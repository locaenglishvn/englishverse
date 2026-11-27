/* EnglishVerse – HIỆU ỨNG CHIÊU 3D "PARTICLE & MESH" (bản mẫu 27/11, chủ dự án chọn hướng này)
   Mỗi chiêu ghép 3 lớp như game điện thoại: (1) lớp đất – vòng phù văn, vết cháy, vòng sóng; (2) thân chiêu – quả cầu năng lượng, vệt kiếm,
   cột lửa, lốc xoáy, tia sét, rồng; (3) va chạm – chớp sáng, hạt bắn tung, sóng chấn động, rung màn hình.
   Cách làm cho nhẹ máy điện thoại:
   - Hạt sáng: 1 THREE.Points / đợt, vị trí tính trên card đồ hoạ theo thời gian (không cập nhật từng hạt bằng JS) → 1 lần vẽ cho hàng trăm hạt.
   - Khối hình (trụ, nón, dải ruy băng) dùng shader "ảnh nhiễu trôi" + cộng sáng → nhìn như lửa / năng lượng chuyển động mà chỉ vài chục tam giác.
   - Mọi ảnh (ánh sáng, nhiễu, phù văn, vảy rồng) vẽ bằng canvas 1 lần lúc khởi động – không tải file.
   - Dưới mỗi chiêu có 1 vệt tối mềm trên đất → hiệu ứng cộng sáng vẫn nổi trên nền sáng (cỏ, tuyết, cát).
   API: FX3D.setup(scene, camera, renderer) · FX3D.update(dt) mỗi khung · FX3D.cast(id, from, to) · FX3D.ids · FX3D.shake (giây, nơi gọi tự rung camera).
   Ba.js r128, không cần thư viện thêm. */
const FX3D = (function () {
  const V3 = THREE.Vector3, PI = Math.PI, ADD = THREE.AdditiveBlending;
  let SC = null, CAM = null, REN = null, ready = false, scale = 600;
  const TASKS = [], TEX = {}, UP = new V3(0, 1, 0);
  const R = (a, b) => a + Math.random() * (b - a);
  const api = { shake: 0, ids: [] };

  /* ---------- ảnh vẽ 1 lần ---------- */
  function cvTex(n, fn, rep) {
    const c = document.createElement("canvas"); c.width = c.height = n; const g = c.getContext("2d"); fn(g, n);
    const t = new THREE.CanvasTexture(c); if (rep) t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  }
  function wrapDot(g, n, x, y, r, fill) {
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      const X = x + i * n, Y = y + j * n; if (X + r < 0 || Y + r < 0 || X - r > n || Y - r > n) continue;
      const gr = g.createRadialGradient(X, Y, 0, X, Y, r); gr.addColorStop(0, fill); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(X - r, Y - r, 2 * r, 2 * r);
    }
  }
  function makeTextures() {
    TEX.glow = cvTex(64, (g, n) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.25, "rgba(255,255,255,0.75)"); gr.addColorStop(0.6, "rgba(255,255,255,0.18)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, n, n); });
    TEX.noise = cvTex(128, (g, n) => { g.fillStyle = "#000"; g.fillRect(0, 0, n, n); g.globalCompositeOperation = "lighter";
      let s = 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
      for (let i = 0; i < 90; i++) wrapDot(g, n, r() * n, r() * n, 6 + r() * 26, "rgba(255,255,255," + (0.12 + r() * 0.22) + ")");
      for (let i = 0; i < 160; i++) wrapDot(g, n, r() * n, r() * n, 2 + r() * 6, "rgba(255,255,255," + (0.1 + r() * 0.2) + ")"); }, true);
    TEX.beam = cvTex(64, (g, n) => { const gr = g.createLinearGradient(0, 0, n, 0); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.35, "rgba(255,255,255,0.35)"); gr.addColorStop(0.5, "rgba(255,255,255,1)"); gr.addColorStop(0.65, "rgba(255,255,255,0.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, n, n); });
    TEX.ring = cvTex(128, (g, n) => { const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.72, "rgba(255,255,255,0)"); gr.addColorStop(0.86, "rgba(255,255,255,1)"); gr.addColorStop(0.93, "rgba(255,255,255,0.5)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, n, n); });
    TEX.dark = cvTex(64, (g, n) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(10,8,20,0.75)"); gr.addColorStop(0.55, "rgba(10,8,20,0.45)"); gr.addColorStop(1, "rgba(10,8,20,0)"); g.fillStyle = gr; g.fillRect(0, 0, n, n); });
    TEX.rune = cvTex(512, (g, n) => {   // vòng phù văn: 3 vòng tròn, vạch chia, ngôi sao 6 cánh, ký hiệu dạng nốt nhạc + chữ cái (hợp chủ đề học tiếng Anh)
      const c = n / 2; g.translate(c, c); g.strokeStyle = "#fff"; g.fillStyle = "#fff"; g.lineCap = "round"; g.shadowColor = "#fff"; g.shadowBlur = 8;
      const circ = (r, w) => { g.lineWidth = w; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke(); };
      circ(238, 6); circ(222, 2); circ(160, 4); circ(150, 1.5); circ(70, 3);
      for (let i = 0; i < 72; i++) { const a = i / 72 * PI * 2, l = i % 6 ? 8 : 16; g.lineWidth = i % 6 ? 1.5 : 3; g.beginPath(); g.moveTo(Math.cos(a) * 222, Math.sin(a) * 222); g.lineTo(Math.cos(a) * (222 - l), Math.sin(a) * (222 - l)); g.stroke(); }
      g.lineWidth = 3; for (let k = 0; k < 2; k++) { g.beginPath(); for (let i = 0; i <= 3; i++) { const a = (i / 3 + k / 6) * PI * 2 - PI / 2; i ? g.lineTo(Math.cos(a) * 150, Math.sin(a) * 150) : g.moveTo(Math.cos(a) * 150, Math.sin(a) * 150); } g.stroke(); }
      g.font = "bold 30px serif"; g.textAlign = "center"; g.textBaseline = "middle"; const gl = ["♪", "A", "♫", "E", "♩", "I", "♬", "O", "♪", "U", "♫", "Y"];
      gl.forEach((s, i) => { const a = i / gl.length * PI * 2; g.save(); g.rotate(a); g.fillText(s, 0, -190); g.restore(); });
      for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2 + PI / 6; g.beginPath(); g.arc(Math.cos(a) * 110, Math.sin(a) * 110, 12, 0, 7); g.lineWidth = 2; g.stroke(); }
    });
    TEX.scale = cvTex(128, (g, n) => {   // vảy rồng (lặp): hàng vảy cong, sáng ở mép
      g.fillStyle = "#000"; g.fillRect(0, 0, n, n);
      for (let row = -1; row < 9; row++) for (let col = -1; col < 9; col++) { const x = col * 16 + (row % 2 ? 8 : 0), y = row * 16;
        const gr = g.createRadialGradient(x, y + 4, 2, x, y + 4, 12); gr.addColorStop(0, "rgba(255,255,255,0.15)"); gr.addColorStop(0.75, "rgba(255,255,255,0.55)"); gr.addColorStop(0.95, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr; g.beginPath(); g.arc(x, y + 4, 12, 0, PI); g.fill(); } }, true);
    TEX.crack = cvTex(256, (g, n) => {   // vết nứt cháy xém
      const c = n / 2; const gr = g.createRadialGradient(c, c, 0, c, c, c); gr.addColorStop(0, "rgba(20,10,5,0.7)"); gr.addColorStop(0.5, "rgba(20,10,5,0.35)"); gr.addColorStop(1, "rgba(20,10,5,0)"); g.fillStyle = gr; g.fillRect(0, 0, n, n);
      g.strokeStyle = "rgba(10,5,0,0.85)"; g.lineCap = "round";
      for (let i = 0; i < 9; i++) { let a = i / 9 * PI * 2 + Math.random() * 0.4, x = c, y = c, w = 5; g.beginPath(); g.moveTo(x, y);
        for (let k = 0; k < 6; k++) { a += (Math.random() - 0.5) * 0.8; x += Math.cos(a) * 16; y += Math.sin(a) * 16; g.lineWidth = w; w *= 0.78; g.lineTo(x, y); } g.stroke(); }
    });
  }

  /* ---------- vật liệu ---------- */
  const FLOW_VS = `varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main() { vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`;
  const FLOW_FS = `uniform sampler2D uTex; uniform float uTime, uAlpha, uCut, uFres, uGain; uniform vec3 uC1, uC2; uniform vec2 uRep, uSpd; uniform vec4 uFade;
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main() {
  vec2 uv = vUv * uRep + uSpd * uTime;
  float n = texture2D(uTex, uv).r * 0.65 + texture2D(uTex, uv * 0.47 + vec2(0.31, 0.17) + uSpd * uTime * 0.6).r * 0.35;
  float e = smoothstep(0.0, uFade.x, vUv.x) * smoothstep(0.0, uFade.y, 1.0 - vUv.x) * smoothstep(0.0, uFade.z, vUv.y) * smoothstep(0.0, uFade.w, 1.0 - vUv.y);
  float fr = mix(1.0, pow(1.0 - abs(dot(vN, vV)), 1.5) * 1.7 + 0.15, uFres);
  float a = smoothstep(uCut, uCut + 0.35, n) * e * fr * uAlpha;
  vec3 col = mix(uC1, uC2, smoothstep(0.25, 0.9, n));
  gl_FragColor = vec4(col * a * uGain, a);
}`;
  function flowMat(o) {   // khối hình năng lượng: ảnh nhiễu trôi theo thời gian, mép mờ, viền sáng (fresnel)
    return new THREE.ShaderMaterial({ vertexShader: FLOW_VS, fragmentShader: FLOW_FS, transparent: true, depthWrite: false, blending: ADD, side: THREE.DoubleSide,
      uniforms: { uTex: { value: o.tex || TEX.noise }, uTime: { value: 0 }, uAlpha: { value: 1 }, uCut: { value: o.cut === undefined ? 0.2 : o.cut }, uFres: { value: o.fres || 0 }, uGain: { value: o.gain || 1.6 },
        uC1: { value: new THREE.Color(o.c1) }, uC2: { value: new THREE.Color(o.c2) }, uRep: { value: new THREE.Vector2(...(o.rep || [1, 1])) }, uSpd: { value: new THREE.Vector2(...(o.spd || [0, -1])) },
        uFade: { value: new THREE.Vector4(...(o.fade || [0.05, 0.05, 0.1, 0.3])) } } });
  }
  const SLASH_FS = `uniform sampler2D uTex; uniform float uTime, uProg, uAlpha; uniform vec3 uC1, uC2; varying vec2 vUv;
void main() {
  float head = uProg, tail = uProg - 0.6;
  float along = smoothstep(tail, head, vUv.x) * (1.0 - smoothstep(head, head + 0.04, vUv.x));
  float across = 1.0 - abs(vUv.y * 2.0 - 1.0); across = pow(across, 0.7) * smoothstep(0.0, 0.25, vUv.y + (vUv.x - tail) * 0.3);
  float n = texture2D(uTex, vec2(vUv.x * 3.0 - uTime * 2.0, vUv.y * 0.7)).r;
  float a = along * across * (0.55 + 0.75 * n) * uAlpha;
  vec3 col = mix(uC1, uC2, along) + vec3(1.0) * smoothstep(0.8, 1.0, across) * along * 0.8;
  gl_FragColor = vec4(col * a * 1.8, a);
}`;
  function slashMat(c1, c2) { return new THREE.ShaderMaterial({ vertexShader: FLOW_VS, fragmentShader: SLASH_FS, transparent: true, depthWrite: false, blending: ADD, side: THREE.DoubleSide,
    uniforms: { uTex: { value: TEX.noise }, uTime: { value: 0 }, uProg: { value: 0 }, uAlpha: { value: 1 }, uC1: { value: new THREE.Color(c1) }, uC2: { value: new THREE.Color(c2) } } }); }
  const basic = (map, color, add, op) => new THREE.MeshBasicMaterial({ map, color, transparent: true, depthWrite: false, blending: add === false ? THREE.NormalBlending : ADD, side: THREE.DoubleSide, opacity: op === undefined ? 1 : op });

  /* ---------- hạt sáng trên card đồ hoạ ---------- */
  const P_VS = `attribute vec3 aVel; attribute vec4 aDat; attribute vec3 aCol; uniform float uTime, uScale, uDrag; uniform vec3 uGrav; varying vec3 vCol; varying float vA;
void main() {
  float t = uTime - aDat.x; float k = t / aDat.y;
  if (t < 0.0 || k > 1.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; vA = 0.0; vCol = aCol; return; }
  float dr = (1.0 - exp(-uDrag * t)) / max(uDrag, 0.001);
  vec3 p = position + aVel * dr + 0.5 * uGrav * t * t;
  vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
  float sz = aDat.z * (k < 0.12 ? k / 0.12 : 1.0 - (k - 0.12) / 0.88 * 0.75);
  gl_PointSize = clamp(sz * uScale / -mv.z, 0.0, 96.0); vCol = aCol; vA = 1.0 - k * k;
}`;
  const P_FS = `uniform sampler2D uTex; varying vec3 vCol; varying float vA;
void main() { float a = texture2D(uTex, gl_PointCoord).a * vA; gl_FragColor = vec4(vCol * a * 1.5, a); }`;
  /* emit: n hạt, mỗi hạt: f(i) → { p: vị trí đầu, v: vận tốc, t0: lúc sinh (giây, tính từ lúc đợt bắt đầu), life, size, col } */
  function emitter(n, f, o) {
    o = o || {}; const g = new THREE.BufferGeometry(), pos = new Float32Array(n * 3), vel = new Float32Array(n * 3), dat = new Float32Array(n * 4), col = new Float32Array(n * 3), c = new THREE.Color();
    let maxT = 0;
    for (let i = 0; i < n; i++) { const q = f(i); pos.set([q.p.x, q.p.y, q.p.z], i * 3); vel.set([q.v.x, q.v.y, q.v.z], i * 3); dat.set([q.t0 || 0, q.life, q.size, 0], i * 4); c.set(q.col); col.set([c.r, c.g, c.b], i * 3); maxT = Math.max(maxT, (q.t0 || 0) + q.life); }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("aVel", new THREE.BufferAttribute(vel, 3)); g.setAttribute("aDat", new THREE.BufferAttribute(dat, 4)); g.setAttribute("aCol", new THREE.BufferAttribute(col, 3));
    const m = new THREE.ShaderMaterial({ vertexShader: P_VS, fragmentShader: P_FS, transparent: true, depthWrite: false, blending: ADD,
      uniforms: { uTex: { value: TEX.glow }, uTime: { value: 0 }, uScale: { value: scale }, uDrag: { value: o.drag || 0 }, uGrav: { value: new V3(0, o.grav === undefined ? -6 : o.grav, 0) } } });
    const pts = new THREE.Points(g, m); pts.frustumCulled = false; pts.renderOrder = 8;
    task(o.delay || 0, maxT + 0.05, () => { SC.add(pts); return { upd: (k, t) => { m.uniforms.uTime.value = t; m.uniforms.uScale.value = scale; }, end: () => kill(pts) }; });
  }
  const rv = (s) => new V3(R(-1, 1), R(-1, 1), R(-1, 1)).normalize().multiplyScalar(s);

  /* ---------- quản lý theo thời gian ---------- */
  function task(delay, dur, setup) { TASKS.push({ t: -delay, dur, setup, h: null }); }
  function kill(o) { if (!o) return; if (o.parent) o.parent.remove(o); o.traverse && o.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material && !x.material.userData.keep) x.material.dispose(); }); }
  function update(dt) {
    if (!ready) return; dt = Math.min(dt, 0.05);
    if (REN && CAM && CAM.projectionMatrix) { const s = new THREE.Vector2(); REN.getDrawingBufferSize(s); scale = s.y * CAM.projectionMatrix.elements[5] * 0.5; }
    for (let i = TASKS.length - 1; i >= 0; i--) {
      const T = TASKS[i]; T.t += dt; if (T.t < 0) continue;
      if (!T.h) T.h = T.setup() || {};
      const k = Math.min(1, T.t / T.dur); if (T.h.upd) T.h.upd(k, T.t, dt);
      if (k >= 1) { if (T.h.end) T.h.end(); TASKS.splice(i, 1); }
    }
    api.shake = Math.max(0, api.shake - dt);
  }
  const shake = s => { api.shake = Math.max(api.shake, s); };

  /* ---------- khối dựng sẵn ---------- */
  function mesh(geo, mat, ro) { const m = new THREE.Mesh(geo, mat); m.frustumCulled = false; m.renderOrder = ro || 7; return m; }
  function decal(P, tex, color, size, dur, delay, o) {   // tấm nằm trên đất: phù văn / vết cháy / vệt tối
    o = o || {}; P = P.clone();
    task(delay || 0, dur, () => { const m = mesh(new THREE.PlaneGeometry(1, 1).rotateX(-PI / 2), basic(tex, color, o.add !== false, 1), o.ro || 3); m.position.set(P.x, 0.04 + (o.lift || 0), P.z); SC.add(m);
      return { upd: (k, t) => { const inK = o.inT ? Math.min(1, t / o.inT) : 1, out = 1 - Math.max(0, k - (o.hold || 0.65)) / (1 - (o.hold || 0.65));
        const s = size * (o.grow ? 0.6 + 0.4 * (1 - Math.pow(1 - inK, 3)) : 1) * (o.expand ? 1 + k * o.expand : 1); m.scale.set(s, 1, s); m.rotation.y = (o.spin || 0) * t; m.material.opacity = (o.op === undefined ? 1 : o.op) * inK * out; },
        end: () => kill(m) }; });
  }
  const shadowUnder = (P, size, dur, delay) => decal(P, TEX.dark, 0xffffff, size, dur, delay, { add: false, op: 0.9, inT: 0.12, hold: 0.7, ro: 2 });   // vệt tối dưới chiêu (nền sáng vẫn nổi)
  function glow(P, color, size, dur, delay, o) {   // quầng sáng (sprite cộng sáng) – chớp / lõi
    o = o || {}; P = P.clone();
    task(delay || 0, dur, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color, blending: ADD, transparent: true, depthWrite: false })); s.renderOrder = 9; s.position.copy(P); SC.add(s);
      return { upd: (k) => { const e = o.flash ? 1 - k : Math.sin(Math.min(1, k * 1.4) * PI * 0.5) * (1 - Math.max(0, k - 0.6) / 0.4); s.scale.setScalar(size * (o.flash ? 0.5 + k * 0.9 : 0.8 + 0.2 * k)); s.material.opacity = e; }, end: () => kill(s) }; });
  }
  function shock(P, color, r1, dur, delay, y) {   // vòng sóng chấn động nằm đất
    P = P.clone();
    task(delay || 0, dur, () => { const m = mesh(new THREE.PlaneGeometry(1, 1).rotateX(-PI / 2), basic(TEX.ring, color, true, 1), 4); m.position.set(P.x, 0.06 + (y || 0), P.z); SC.add(m);
      return { upd: (k) => { const e = 1 - Math.pow(1 - k, 3), s = 0.3 + (r1 * 2 - 0.3) * e; m.scale.set(s, 1, s); m.material.opacity = 1 - k; }, end: () => kill(m) }; });
  }
  function sparks(P, color, n, spd, size, life, delay, o) {   // hạt bắn tung (rơi theo trọng lực, có lực cản)
    o = o || {}; P = P.clone(); const cols = Array.isArray(color) ? color : [color];
    emitter(n, i => ({ p: P.clone().add(rv(o.r || 0.15)), v: (o.dir ? o.dir(i) : rv(1).setY(Math.abs(rv(1).y) * (o.up || 1) + (o.lift || 0.3)).normalize()).multiplyScalar(spd * R(0.5, 1.2)), t0: R(0, o.spread || 0.05), life: life * R(0.6, 1.1), size: size * R(0.6, 1.3), col: cols[i % cols.length] }), { delay, grav: o.grav === undefined ? -7 : o.grav, drag: o.drag === undefined ? 2.2 : o.drag });
  }
  function pillar(P, c1, c2, r, h, dur, delay, o) {   // cột năng lượng / cột lửa (ảnh nhiễu trôi lên)
    o = o || {}; P = P.clone();
    task(delay || 0, dur, () => { const g = new THREE.CylinderGeometry(r * (o.top || 0.7), r, h, 24, 1, true); g.translate(0, h / 2, 0); const mt = flowMat({ c1, c2, rep: [2, 1.2], spd: [o.twist || 0.15, -(o.speed || 1.6)], fres: 1, cut: o.cut === undefined ? 0.15 : o.cut, fade: [0, 0, 0.02, 0.45] });
      const m = mesh(g, mt); m.position.set(P.x, 0, P.z); SC.add(m);
      return { upd: (k, t) => { mt.uniforms.uTime.value = t; const inK = Math.min(1, t / 0.15); m.scale.set(1 + k * (o.widen || 0.2), inK * (1 + k * 0.15), 1 + k * (o.widen || 0.2)); mt.uniforms.uAlpha.value = inK * (1 - Math.max(0, k - 0.55) / 0.45); }, end: () => kill(m) }; });
  }
  function tornado(P, c1, c2, r, h, dur, delay) {   // lốc xoáy: phễu xoắn mở rộng lên trên
    P = P.clone();
    task(delay || 0, dur, () => { const pts = []; for (let i = 0; i <= 12; i++) { const y = i / 12; pts.push(new THREE.Vector2(r * (0.25 + y * y * 1.1), y * h)); }
      const g = new THREE.LatheGeometry(pts, 28); const mt = flowMat({ c1, c2, rep: [3, 1], spd: [1.2, -0.8], fres: 0.8, cut: 0.25, fade: [0, 0, 0.05, 0.25] });
      const m = mesh(g, mt); m.position.set(P.x, 0, P.z); SC.add(m);
      return { upd: (k, t) => { mt.uniforms.uTime.value = t; m.rotation.y = t * 6; const inK = Math.min(1, t / 0.2); m.scale.set(inK, inK, inK); mt.uniforms.uAlpha.value = 1 - Math.max(0, k - 0.6) / 0.4; }, end: () => kill(m) }; });
  }
  function arcGeo(r, a0, a1, w, seg) {   // dải cong nằm ngang (vệt kiếm): uv.x dọc cung, uv.y ngang dải
    const g = new THREE.BufferGeometry(), pos = [], uv = [], idx = [];
    for (let i = 0; i <= seg; i++) { const u = i / seg, a = a0 + (a1 - a0) * u, ww = w * (0.35 + 0.65 * Math.sin(u * PI * 0.9 + 0.1));
      [r - ww / 2, r + ww / 2].forEach((rr, j) => { pos.push(Math.cos(a) * rr, 0, Math.sin(a) * rr); uv.push(u, j); });
      if (i) { const b = (i - 1) * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); } }
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  function slash(P, c1, c2, r, w, a0, a1, tilt, yaw, dur, delay, y) {   // vệt kiếm khí: cung sáng quét qua, đuôi mờ dần
    P = P.clone();
    task(delay || 0, dur, () => { const mt = slashMat(c1, c2), m = mesh(arcGeo(r, a0, a1, w, 40), mt, 8); const grp = new THREE.Group(); grp.add(m); grp.position.set(P.x, y === undefined ? 1.1 : y, P.z); grp.rotation.set(tilt || 0, yaw || 0, 0, "YXZ"); SC.add(grp);
      return { upd: (k, t) => { mt.uniforms.uTime.value = t; mt.uniforms.uProg.value = Math.pow(k, 0.6) * 1.6; mt.uniforms.uAlpha.value = 1 - Math.max(0, k - 0.7) / 0.3; }, end: () => kill(grp) }; });
  }
  function bolt(A, B, color, width, dur, delay, o) {   // tia sét: dải zigzag luôn quay mặt camera, nhấp nháy, đổi hình liên tục
    o = o || {}; A = A.clone(); B = B.clone();
    task(delay || 0, dur, () => { const N = 14, g = new THREE.BufferGeometry(), pos = new Float32Array((N + 1) * 2 * 3), uv = new Float32Array((N + 1) * 2 * 2), idx = [];
      for (let i = 0; i <= N; i++) { uv.set([0, i / N, 1, i / N], i * 4); if (i) { const b = (i - 1) * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); } }
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.BufferAttribute(uv, 2)); g.setIndex(idx);
      const m = mesh(g, basic(TEX.beam, color, true, 1), 9); SC.add(m); let acc = 1;
      const pts = [], d = new V3(), side = new V3(), vd = new V3();
      const reshape = () => { pts.length = 0; for (let i = 0; i <= N; i++) { const u = i / N, p = A.clone().lerp(B, u); if (i && i < N) p.add(rv(o.jag || 0.6).multiplyScalar(Math.sin(u * PI))); pts.push(p); }
        for (let i = 0; i <= N; i++) { d.subVectors(pts[Math.min(N, i + 1)], pts[Math.max(0, i - 1)]).normalize(); vd.subVectors(CAM.position, pts[i]).normalize(); side.crossVectors(d, vd).normalize().multiplyScalar(width * (1 - 0.5 * i / N));
          pos.set([pts[i].x - side.x, pts[i].y - side.y, pts[i].z - side.z, pts[i].x + side.x, pts[i].y + side.y, pts[i].z + side.z], i * 6); }
        g.attributes.position.needsUpdate = true; };
      return { upd: (k, t, dt) => { acc += dt; if (acc > 0.05) { acc = 0; reshape(); } m.material.opacity = (Math.random() < 0.2 ? 0.4 : 1) * (1 - Math.max(0, k - 0.6) / 0.4); }, end: () => kill(m) }; });
  }
  function orbFly(A, B, c1, c2, size, dur, delay, o) {   // quả cầu năng lượng bay: lõi sáng + vỏ nhiễu xoáy + đuôi hạt
    o = o || {}; A = A.clone(); B = B.clone();
    task(delay || 0, dur, () => { const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c2, blending: ADD, transparent: true, depthWrite: false })), halo = new THREE.Sprite(core.material.clone()); halo.material.color.set(c1);
      const shellMat = flowMat({ c1, c2, rep: [2, 2], spd: [1.5, -1.2], fres: 1.2, cut: 0.2, fade: [0, 0, 0, 0] }), shell = mesh(new THREE.SphereGeometry(size * 0.45, 20, 14), shellMat, 9);
      [core, halo].forEach(s => s.renderOrder = 10); SC.add(core); SC.add(halo); SC.add(shell); const p = new V3();
      return { upd: (k, t) => { p.lerpVectors(A, B, k); p.y += Math.sin(k * PI) * (o.arc || 0); core.position.copy(p); halo.position.copy(p); shell.position.copy(p); shell.rotation.set(t * 4, t * 6, 0);
        shellMat.uniforms.uTime.value = t; core.scale.setScalar(size * (0.8 + Math.sin(t * 30) * 0.08)); halo.scale.setScalar(size * 2.2); halo.material.opacity = 0.55; }, end: () => { kill(core); kill(halo); kill(shell); } }; });
    emitter(70, i => { const u = i / 70, p = A.clone().lerp(B, u); p.y += Math.sin(u * PI) * (o.arc || 0); return { p: p.add(rv(0.15)), v: rv(0.8), t0: u * dur + (delay || 0), life: R(0.25, 0.5), size: size * R(0.35, 0.7), col: i % 3 ? c1 : c2 }; }, { grav: 0.5, drag: 3 });
  }
  function shards(P, color, n, rad, h, dur, delay, o) {   // tinh thể băng / gai đất trồi lên vòng quanh
    o = o || {}; P = P.clone();
    task(delay || 0, dur, () => { const grp = new THREE.Group(), mt = flowMat({ c1: color, c2: o.c2 || 0xffffff, rep: [1, 1], spd: [0, -0.3], fres: 1.4, cut: -0.2, gain: 1.3, fade: [0, 0, 0, 0.05] }); mt.blending = THREE.NormalBlending; mt.depthWrite = true; mt.transparent = true;
      const list = []; for (let i = 0; i < n; i++) { const a = i / n * PI * 2 + R(-0.2, 0.2), r = rad * R(0.55, 1.1), hh = h * R(0.6, 1.2), g = new THREE.ConeGeometry(0.28 * hh / h + 0.15, hh, 5); g.translate(0, hh / 2, 0);
        const m = mesh(g, mt, 6); m.position.set(P.x + Math.cos(a) * r, 0, P.z + Math.sin(a) * r); m.rotation.set(R(-0.35, 0.35), R(0, 6), R(-0.35, 0.35)); grp.add(m); list.push({ m, d: R(0, 0.12) }); }
      const center = new THREE.ConeGeometry(0.6, h * 1.6, 6); center.translate(0, h * 0.8, 0); const cm = mesh(center, mt, 6); cm.position.set(P.x, 0, P.z); grp.add(cm); list.push({ m: cm, d: 0.05 });
      SC.add(grp); mt.userData.keep = false;
      return { upd: (k, t) => { mt.uniforms.uTime.value = t; list.forEach(q => { const e = Math.min(1, Math.max(0, (t - q.d) / 0.18)), s = (1 - Math.pow(1 - e, 3)) * (k > 0.75 ? 1 - (k - 0.75) / 0.25 : 1); q.m.scale.set(s, s, s); }); mt.uniforms.uAlpha.value = 0.92; }, end: () => kill(grp) }; });
  }
  function aura(P, c1, c2, r, h, dur, delay) {   // hào quang quanh nhân vật: trụ mỏng vân dọc, fresnel
    pillar(P, c1, c2, r, h, dur, delay, { speed: 1.2, top: 1.15, widen: 0.05, cut: 0.3, twist: 0.6 });
  }

  /* ---------- RỒNG ÂM THANH (tuyệt chiêu): thân = 2 dải chéo nhau theo đường bay của đầu, ảnh vảy trôi dọc thân ---------- */
  function dragon(F, Tg, c1, c2, dur, delay) {
    F = F.clone(); Tg = Tg.clone(); const F0 = F.clone(); F = F.clone().lerp(Tg, 0.3);   // tâm vòng xoắn: lệch về phía quái để rồng bay giữa khung hình
    task(delay || 0, dur, () => {
      const N = 46, LEN = 11, hist = [], g1 = new THREE.BufferGeometry(), g2 = new THREE.BufferGeometry();
      const mk = (g) => { g.setAttribute("position", new THREE.BufferAttribute(new Float32Array((N + 1) * 2 * 3), 3)); const uv = new Float32Array((N + 1) * 4), idx = [];
        for (let i = 0; i <= N; i++) { uv.set([i / N, 0, i / N, 1], i * 4); if (i) { const b = (i - 1) * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); } }
        g.setAttribute("uv", new THREE.BufferAttribute(uv, 2)); g.setAttribute("normal", new THREE.BufferAttribute(new Float32Array((N + 1) * 2 * 3).fill(0.5), 3)); g.setIndex(idx); };
      mk(g1); mk(g2);
      const mt = flowMat({ tex: TEX.scale, c1, c2, rep: [10, 1], spd: [-2.5, 0], fres: 0, cut: -0.25, gain: 2.0, fade: [0.02, 0.12, 0.08, 0.08] });
      const b1 = mesh(g1, mt, 9), b2 = mesh(g2, mt, 9); SC.add(b1); SC.add(b2);
      const head = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c2, blending: ADD, transparent: true, depthWrite: false })); head.renderOrder = 11; SC.add(head);
      const eyes = [0, 1].map(() => { const e = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0xffffff, blending: ADD, transparent: true, depthWrite: false })); e.renderOrder = 12; SC.add(e); return e; });
      const hornMat = flowMat({ c1: c2, c2: 0xffffff, rep: [1, 1], spd: [0, -2], fres: 1, cut: -0.3, fade: [0, 0, 0, 0.1] });
      const horns = [0, 1].map(() => { const g = new THREE.ConeGeometry(0.16, 1.1, 5); g.translate(0, 0.55, 0); const m = mesh(g, hornMat, 11); SC.add(m); return m; });
      const whisk = [0, 1].map(() => { const g = new THREE.CylinderGeometry(0.03, 0.01, 1.6, 4); g.translate(0, 0.8, 0); const m = mesh(g, hornMat, 11); SC.add(m); return m; });
      const pos = new V3(), tan = new V3(), side = new V3(), up2 = new V3(), tmp = new V3();
      const path = (u) => {   // 0 → 0.55: xoắn ốc lên quanh người; 0.55 → 1: lao xuống mục tiêu
        if (u < 0.55) { const s = u / 0.55, a = s * PI * 3.2, r = 1.6 + s * 1.4; return pos.set(F.x + Math.cos(a) * r, 0.8 + s * 3.2, F.z + Math.sin(a) * r); }   // thấp (≤ 4 m) để luôn nằm trong khung camera 2.5D
        const s = (u - 0.55) / 0.45, a = 3.2 * PI, r = 3.0, S = tmp.set(F.x + Math.cos(a) * r, 4.0, F.z + Math.sin(a) * r);
        const e = s * s * (3 - 2 * s); return pos.set(S.x + (Tg.x - S.x) * e, S.y + (1.0 - S.y) * e + Math.sin(s * PI) * 1.5, S.z + (Tg.z - S.z) * e);
      };
      return { upd: (k, t) => {
        mt.uniforms.uTime.value = t; hornMat.uniforms.uTime.value = t;
        const u = Math.min(1, k * 1.08), H = path(u).clone(); hist.unshift(H); while (hist.length > 160) hist.pop();
        // lấy N+1 điểm dọc lịch sử cách đều theo độ dài
        const pts = [hist[0]]; let acc = 0, j = 1, step = LEN / N;
        for (let i = 1; i <= N; i++) { let need = step; while (j < hist.length) { const d = hist[j].distanceTo(hist[j - 1]); if (acc + d >= need) { pts.push(hist[j - 1].clone().lerp(hist[j], (need - acc) / Math.max(d, 1e-4))); acc = acc + d - need; break; } acc += d; j++; } if (pts.length <= i) pts.push(hist[hist.length - 1].clone()); }
        const A1 = g1.attributes.position.array, A2 = g2.attributes.position.array, fade = 1 - Math.max(0, k - 0.88) / 0.12;
        for (let i = 0; i <= N; i++) { const p = pts[i], q = pts[Math.min(N, i + 1)], o2 = pts[Math.max(0, i - 1)]; tan.subVectors(o2, q).normalize(); if (tan.lengthSq() < 0.5) tan.set(1, 0, 0);
          const w = (i < 4 ? 0.7 + i * 0.14 : 1.35 * Math.pow(1 - i / N, 0.7) + 0.08) * (1 + 0.12 * Math.sin(i * 0.9 - t * 12)) * fade;
          side.crossVectors(tan, UP).normalize().multiplyScalar(w); up2.crossVectors(side, tan).normalize().multiplyScalar(w);
          A1.set([p.x - side.x, p.y - side.y, p.z - side.z, p.x + side.x, p.y + side.y, p.z + side.z], i * 6); A2.set([p.x - up2.x, p.y - up2.y, p.z - up2.z, p.x + up2.x, p.y + up2.y, p.z + up2.z], i * 6); }
        g1.attributes.position.needsUpdate = true; g2.attributes.position.needsUpdate = true; g1.computeBoundingSphere(); g2.computeBoundingSphere();
        const h0 = pts[0], hd = tan.subVectors(pts[0], pts[2]).normalize(); side.crossVectors(hd, UP).normalize();
        head.position.copy(h0); head.scale.setScalar(2.6 * fade); head.material.opacity = 0.9;
        eyes.forEach((e, i) => { e.position.copy(h0).addScaledVector(side, (i ? 1 : -1) * 0.32).addScaledVector(hd, 0.25).y += 0.25; e.scale.setScalar(0.6 * fade); });
        horns.forEach((m, i) => { m.position.copy(h0).addScaledVector(side, (i ? 1 : -1) * 0.3); m.position.y += 0.2; m.lookAt(tmp.copy(m.position).addScaledVector(hd, -1).add(UP)); m.rotateX(PI / 2); m.scale.setScalar(fade); });
        whisk.forEach((m, i) => { m.position.copy(h0).addScaledVector(hd, 0.4).addScaledVector(side, (i ? 1 : -1) * 0.25); m.lookAt(tmp.copy(m.position).addScaledVector(hd, -1).addScaledVector(side, (i ? 1 : -1) * 0.8)); m.rotateX(PI / 2); m.rotateZ(Math.sin(t * 9 + i) * 0.4); m.scale.setScalar(fade); });
        mt.uniforms.uAlpha.value = fade;
      }, end: () => { [b1, b2, head, ...eyes, ...horns, ...whisk].forEach(kill); } };
    });
    // vảy sáng rơi theo đường bay
    emitter(200, i => { const u = i / 200 * 1.0, s = u < 0.55 ? u / 0.55 : 1, a = s * PI * 3.2, r = 1.6 + s * 1.4; const p = u < 0.55 ? new V3(F.x + Math.cos(a) * r, 0.8 + s * 3.2, F.z + Math.sin(a) * r) : new V3(F.x, 4, F.z).lerp(Tg, (u - 0.55) / 0.45);
      return { p: p.add(rv(0.4)), v: rv(1.2), t0: u * dur * 0.95 + (delay || 0), life: R(0.5, 0.9), size: R(0.3, 0.55), col: i % 3 ? c1 : 0xffffff }; }, { grav: -2, drag: 2 });
  }

  /* ---------- CHIÊU MẪU ---------- */
  const SK = {};
  const DIR = (F, T) => new V3().subVectors(T, F).setY(0).normalize();
  SK.echo_blast = (F, T) => {   // ⚡ POWER – sóng âm nổ: tụ lực ở tay → quả cầu năng lượng bay → nổ
    const d = DIR(F, T), A = F.clone().addScaledVector(d, 0.8).setY(1.3), B = T.clone().setY(1.1), fly = 0.38;
    shadowUnder(F, 3, 0.7, 0); decal(F, TEX.rune, 0xff9a3a, 3.2, 0.7, 0, { inT: 0.15, spin: 1.5, grow: true, op: 0.9 });
    emitter(40, i => { const a = rv(1.6); return { p: A.clone().add(a), v: a.clone().multiplyScalar(-3.2), t0: R(0, 0.15), life: 0.28, size: R(0.25, 0.45), col: i % 2 ? 0xffd27a : 0xff7a2a }; }, { grav: 0, drag: 0 });   // tụ lực: hạt hút vào tay
    glow(A, 0xffb04a, 1.6, 0.25, 0.1, { flash: true });
    orbFly(A, B, 0xff6a1a, 0xffe6a8, 1.1, fly, 0.18, { arc: 0.4 });
    const hit = 0.18 + fly;
    shadowUnder(T, 5.5, 1.0, hit - 0.05); decal(T, TEX.crack, 0xffffff, 4.2, 1.4, hit, { add: false, op: 0.85, hold: 0.6, ro: 3 });
    glow(B, 0xffffff, 4.5, 0.25, hit, { flash: true }); glow(B, 0xff8a2a, 6.5, 0.45, hit, { flash: true });
    shock(T, 0xffb050, 3.8, 0.55, hit); shock(T, 0xff5a1a, 2.6, 0.45, hit + 0.06);
    pillar(T, 0xff5010, 0xffd080, 1.0, 3.6, 0.55, hit, { speed: 3, widen: 0.8, top: 1.4 });
    sparks(B, [0xffe0a0, 0xff9a3a, 0xff5a1a], 70, 9, 0.35, 0.7, hit, { up: 1.2 });
    sparks(B, [0xffffff, 0xffd27a], 30, 4, 0.55, 0.5, hit, { grav: -1 });
    task(hit, 0.01, () => { shake(0.25); });
  };
  SK.thunder_clap = (F, T) => {   // ⚡ POWER – sét giáng: vòng phù văn xanh dưới quái → 3 tia sét + cột điện + tia lửa điện
    const B = T.clone().setY(1);
    shadowUnder(T, 5, 1.2, 0); decal(T, TEX.rune, 0x7cc8ff, 4.6, 1.2, 0, { inT: 0.2, spin: -2, grow: true });
    glow(F.clone().setY(1.6), 0x9ad8ff, 1.5, 0.3, 0, { flash: true });
    [0, 0.07, 0.15].forEach((dl, i) => { const top = T.clone().add(new V3(R(-1.5, 1.5), 12, R(-1.5, 1.5))), end = T.clone().add(new V3((i - 1) * 0.6, 0.1, R(-0.4, 0.4)));
      bolt(top, end, i ? 0x8fd6ff : 0xffffff, i ? 0.35 : 0.55, 0.45, 0.28 + dl, { jag: 0.9 }); bolt(top, end, 0x3a8bff, 1.1, 0.4, 0.28 + dl, { jag: 0.9 }); });
    const hit = 0.3;
    glow(B, 0xffffff, 5, 0.3, hit, { flash: true }); glow(B, 0x4aa8ff, 8, 0.5, hit, { flash: true });
    pillar(T, 0x2f7bff, 0xd8f0ff, 0.9, 8, 0.5, hit, { speed: 5, widen: 0.3, top: 0.5 });
    shock(T, 0x9ad8ff, 4.2, 0.5, hit); decal(T, TEX.crack, 0xffffff, 3.6, 1.2, hit, { add: false, op: 0.7, ro: 3 });
    for (let i = 0; i < 4; i++) { const a = i / 4 * PI * 2 + R(0, 1), e = T.clone().add(new V3(Math.cos(a) * 2.4, 0.1, Math.sin(a) * 2.4)); bolt(B, e, 0xbfe6ff, 0.18, 0.3, hit + 0.05 + i * 0.03, { jag: 0.5 }); }
    sparks(B, [0xffffff, 0x9ad8ff, 0x4aa8ff], 80, 10, 0.3, 0.6, hit, { up: 1.4, drag: 3 });
    task(hit, 0.01, () => shake(0.3));
  };
  SK.freeze_note = (F, T) => {   // 🌀 CONTROL – đóng băng: phù văn băng → gai băng trồi lên quanh quái → bụi tuyết + hơi lạnh
    const d = DIR(F, T), A = F.clone().addScaledVector(d, 0.8).setY(1.2), B = T.clone().setY(1);
    orbFly(A, B, 0x3aa8ff, 0xe8fbff, 0.8, 0.32, 0, { arc: 0.2 });
    const hit = 0.32;
    shadowUnder(T, 5.5, 1.6, hit - 0.05); decal(T, TEX.rune, 0x9fe4ff, 5, 1.6, hit - 0.1, { inT: 0.15, spin: 0.8, grow: true, op: 0.9 });
    shards(T, 0x5fc8ff, 9, 1.7, 2.4, 1.5, hit, { c2: 0xf4feff });
    glow(B, 0xe8fbff, 5, 0.35, hit, { flash: true }); shock(T, 0xbff0ff, 3.6, 0.6, hit);
    sparks(B, [0xffffff, 0xcff4ff, 0x8fd6ff], 60, 5, 0.3, 1.1, hit, { grav: -1.5, up: 1.6 });
    emitter(50, i => ({ p: T.clone().add(new V3(R(-2.5, 2.5), R(0.1, 0.5), R(-2.5, 2.5))), v: new V3(R(-0.3, 0.3), R(0.3, 0.9), R(-0.3, 0.3)), t0: hit + R(0, 0.8), life: R(0.8, 1.4), size: R(0.6, 1.1), col: 0x9fd8ff }), { grav: 0, drag: 0.5 });   // hơi lạnh
    task(hit, 0.01, () => shake(0.15));
  };
  SK.harmony_heal = (F) => {   // 💚 HARMONY – hồi máu: phù văn vàng xanh xoay dưới chân → 6 cột sáng mảnh + hào quang → lá / sao bay lên
    shadowUnder(F, 5, 1.6, 0);
    decal(F, TEX.rune, 0x5cff9a, 5, 1.6, 0, { inT: 0.25, spin: 1.2, grow: true });
    decal(F, TEX.rune, 0xffe27a, 3, 1.5, 0.1, { inT: 0.25, spin: -2, grow: true, op: 0.8, lift: 0.01 });
    aura(F, 0x2fd17a, 0xe8ffd0, 0.9, 3.2, 1.4, 0.1);
    for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; pillar(F.clone().add(new V3(Math.cos(a) * 2.1, 0, Math.sin(a) * 2.1)), 0x3fe08a, 0xfff6c0, 0.16, 3 + R(0, 1.2), 0.9, 0.15 + i * 0.05, { speed: 3.5, top: 0.3, widen: 0 }); }
    emitter(90, i => { const a = R(0, PI * 2), r = R(0.3, 2.2); return { p: F.clone().add(new V3(Math.cos(a) * r, R(0, 0.4), Math.sin(a) * r)), v: new V3(Math.cos(a + 1.6) * 0.6, R(1.5, 3.2), Math.sin(a + 1.6) * 0.6), t0: R(0.1, 0.9), life: R(0.7, 1.2), size: R(0.25, 0.5), col: [0x8dffb5, 0xfff3a0, 0xffffff][i % 3] }; }, { grav: 0.4, drag: 0.6 });
    glow(F.clone().setY(1.3), 0xbfffd8, 3.5, 0.6, 0.3, {});
    shock(F, 0x8dffb5, 3.2, 0.7, 0.2);
  };
  SK.fire_spin = (F) => {   // 🔥 RHYTHM – lốc lửa: 3 vệt kiếm lửa quét quanh người → lốc xoáy lửa → tàn lửa + vết cháy
    shadowUnder(F, 7, 1.4, 0); decal(F, TEX.rune, 0xff6a1a, 5.5, 1.3, 0, { inT: 0.15, spin: 3, grow: true, op: 0.8 });
    [0, 0.12, 0.24].forEach((dl, i) => slash(F, 0xff3a0a, 0xffd27a, 2.6 + i * 0.5, 1.1, 0, PI * 1.6, R(-0.25, 0.25), i * 2.1, 0.35, dl, 1.0 + i * 0.15));
    tornado(F, 0xff3a0a, 0xffe0a0, 1.6, 4.2, 1.1, 0.2);
    pillar(F, 0xff5010, 0xffc060, 2.4, 1.6, 0.8, 0.25, { speed: 2.5, widen: 0.6, top: 1.3, cut: 0.25 });
    decal(F, TEX.crack, 0xffffff, 6, 1.5, 0.3, { add: false, op: 0.8, ro: 3 });
    shock(F, 0xffa040, 5, 0.6, 0.3);
    emitter(120, i => { const a = R(0, PI * 2), r = R(0.5, 3); return { p: F.clone().add(new V3(Math.cos(a) * r, R(0, 1), Math.sin(a) * r)), v: new V3(-Math.sin(a) * 3, R(2, 5), Math.cos(a) * 3), t0: R(0.15, 0.9), life: R(0.5, 0.9), size: R(0.2, 0.45), col: [0xffe0a0, 0xff8a2a, 0xff4a10][i % 3] }; }, { grav: 1, drag: 1.5 });
    task(0.3, 0.01, () => shake(0.25));
  };
  SK.dragon_roar = (F, T) => {   // 🐉 TUYỆT CHIÊU – rồng âm thanh: phù văn lớn → rồng vàng đỏ xoắn ốc bay lên rồi lao xuống quái → nổ lớn
    shadowUnder(F, 7, 2.4, 0); decal(F, TEX.rune, 0xffb040, 7, 2.2, 0, { inT: 0.3, spin: 1, grow: true });
    decal(F, TEX.rune, 0xff4a20, 4.5, 2.1, 0.1, { inT: 0.3, spin: -1.6, grow: true, lift: 0.01, op: 0.85 });
    glow(F.clone().setY(1.2), 0xffc060, 4, 0.6, 0, {});
    const dur = 1.7; dragon(F, T, 0xff3a10, 0xffd860, dur, 0.15);
    const hit = 0.15 + dur * 0.93;
    shadowUnder(T, 8, 1.4, hit - 0.1); decal(T, TEX.crack, 0xffffff, 7, 1.6, hit, { add: false, op: 0.9, ro: 3 }); decal(T, TEX.rune, 0xffb040, 6, 1.0, hit, { spin: 2, expand: 0.4, hold: 0.3 });
    glow(T.clone().setY(1.2), 0xffffff, 7, 0.3, hit, { flash: true }); glow(T.clone().setY(1.2), 0xff6a1a, 11, 0.6, hit, { flash: true });
    pillar(T, 0xff3a0a, 0xffe08a, 1.6, 9, 0.8, hit, { speed: 4, widen: 1, top: 1.6 });
    shock(T, 0xffc060, 7, 0.7, hit); shock(T, 0xff4a20, 5, 0.6, hit + 0.08); shock(T, 0xffffff, 3, 0.4, hit + 0.15);
    sparks(T.clone().setY(1), [0xffffff, 0xffd27a, 0xff6a1a, 0xff2a10], 160, 13, 0.45, 1.0, hit, { up: 1.5, drag: 1.8 });
    task(hit, 0.01, () => shake(0.6));
  };
  SK.basic_slash = (F, T) => {   // đòn đánh thường: vệt kiếm khí trắng vàng + tia lửa nhỏ
    const d = DIR(F, T), yaw = Math.atan2(d.x, d.z), P = F.clone().addScaledVector(d, 1.2);
    slash(P, 0xff9a2a, 0xffffff, 2.0, 1.2, -PI * 0.8, PI * 0.2, 0.45, -yaw, 0.36, 0, 1.2);
    slash(P, 0xffd27a, 0xffffff, 1.6, 0.6, -PI * 0.7, PI * 0.1, 0.3, -yaw + 0.3, 0.32, 0.04, 1.4);
    sparks(T.clone().setY(1), [0xffffff, 0xffd27a, 0xff9a3a], 26, 7, 0.28, 0.45, 0.14, { up: 1 });
    glow(T.clone().setY(1), 0xfff0c0, 2.6, 0.22, 0.14, { flash: true }); shock(T, 0xffd27a, 1.6, 0.35, 0.14);
  };
  api.ids = Object.keys(SK);
  api.names = { echo_blast: "Echo Blast", thunder_clap: "Thunder Clap", freeze_note: "Freeze Note", harmony_heal: "Harmony Heal", fire_spin: "Fire Spin", dragon_roar: "Dragon Roar", basic_slash: "Basic Slash" };
  api.setup = (scene, camera, renderer) => { SC = scene; CAM = camera; REN = renderer; if (!ready) { makeTextures(); ready = true; } };
  api.update = update;
  api.cast = (id, from, to) => { if (!ready || !SK[id]) return; SK[id](from.clone().setY(0), (to || from.clone().add(new V3(0, 0, -6))).clone().setY(0)); };
  api.clear = () => { TASKS.forEach(T => { if (T.h && T.h.end) T.h.end(); }); TASKS.length = 0; };
  api._tasks = () => TASKS.length;
  return api;
})();
