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
  function task(delay, dur, setup) { TASKS.push({ t: -delay, dur, setup, h: null, sc: SC, cam: CAM }); }   // nhớ scene + camera lúc tạo (sân tập trong bảng kỹ năng dùng scene riêng)
  function kill(o) { if (!o) return; if (o.parent) o.parent.remove(o); o.traverse && o.traverse(x => { if (x.geometry) x.geometry.dispose(); if (x.material && !x.material.userData.keep) x.material.dispose(); }); }
  function update(dt) {
    if (!ready) return; dt = Math.min(dt, 0.05);
    if (REN && CAM && CAM.projectionMatrix) { const s = new THREE.Vector2(); REN.getDrawingBufferSize(s); scale = s.y * CAM.projectionMatrix.elements[5] * 0.5; }
    const sc0 = SC, cam0 = CAM;
    for (let i = TASKS.length - 1; i >= 0; i--) {
      const T = TASKS[i]; T.t += dt; if (T.t < 0) continue;
      SC = T.sc; CAM = T.cam;
      try { if (!T.h) T.h = T.setup() || {};
        const k = Math.min(1, T.t / T.dur); if (T.h.upd) T.h.upd(k, T.t, dt);
        if (k >= 1) { if (T.h.end) T.h.end(); TASKS.splice(i, 1); } } catch (e) { TASKS.splice(i, 1); }   // lỗi 1 hiệu ứng không làm hỏng game
    }
    SC = sc0; CAM = cam0;
    api.shake = Math.max(0, api.shake - dt);
  }
  const shake = s => { if (SC !== MAIN_SC || performance.now() < (api.quietUntil || 0)) return; api.shake = Math.max(api.shake, s); if (api.onShake) api.onShake(s); };   // chỉ rung khi ở thế giới thật (sân tập không rung)
  let MAIN_SC = null;

  /* ---------- khối dựng sẵn ---------- */
  function mesh(geo, mat, ro) { const m = new THREE.Mesh(geo, mat); m.frustumCulled = false; m.renderOrder = ro || 7; return m; }
  function decal(P, tex, color, size, dur, delay, o) {   // tấm nằm trên đất: phù văn / vết cháy / vệt tối
    o = o || {}; P = P.clone();
    task(delay || 0, dur, () => { const m = mesh(new THREE.PlaneGeometry(1, 1).rotateX(-PI / 2), basic(tex, color, o.add !== false, 1), o.ro || 3); m.position.set(P.x, 0.04 + (o.lift || 0), P.z); SC.add(m);
      return { upd: (k, t) => { const inK = o.inT ? Math.min(1, t / o.inT) : 1, hold = o.hold === undefined ? 0.65 : o.hold, out = 1 - Math.max(0, k - hold) / (1 - hold), mode = o.mode || "spin", eo = 1 - Math.pow(1 - inK, 3);
        let s = size * (o.grow ? 0.6 + 0.4 * eo : 1);
        if (mode === "expand") s *= 1 + k * (o.expand || 0.6);   // toả dần ra
        else if (mode === "pulse") s *= 1 + (o.amp || 0.15) * Math.sin(t * (o.rate || 6));   // thở: toả ra – hút vào
        else if (mode === "converge") s *= 1 + 1.6 * (1 - eo);   // từ to thu vào
        m.scale.set(s, 1, s); m.rotation.y = mode === "static" ? 0 : (o.spin || 0) * t;   // đứng im / xoay
        m.material.opacity = (o.op === undefined ? 1 : o.op) * inK * out * (o.flicker ? 0.7 + 0.3 * Math.abs(Math.sin(t * 23)) : 1); },
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
      if (!o.ring) { const center = new THREE.ConeGeometry(0.6, h * 1.6, 6); center.translate(0, h * 0.8, 0); const cm = mesh(center, mt, 6); cm.position.set(P.x, 0, P.z); grp.add(cm); list.push({ m: cm, d: 0.05 }); }   // ring: chỉ vòng gai quanh (người chơi đứng giữa)
      SC.add(grp); mt.userData.keep = false;
      return { upd: (k, t) => { mt.uniforms.uTime.value = t; list.forEach(q => { const e = Math.min(1, Math.max(0, (t - q.d) / 0.18)), s = (1 - Math.pow(1 - e, 3)) * (k > 0.75 ? 1 - (k - 0.75) / 0.25 : 1); q.m.scale.set(s, s, s); }); mt.uniforms.uAlpha.value = 0.92; }, end: () => kill(grp) }; });
  }
  function aura(P, c1, c2, r, h, dur, delay) {   // hào quang quanh nhân vật: trụ mỏng vân dọc, fresnel
    pillar(P, c1, c2, r, h, dur, delay, { speed: 1.2, top: 1.15, widen: 0.05, cut: 0.3, twist: 0.6 });
  }

  /* ---------- VÒNG PHÙ VĂN: 6 hình × 7 bộ chữ của các vị thần ngôn ngữ (docs/STORY.md mục 3) ----------
     latin (Vocara – tiếng nói chung) · runic (Odin) · ogham (Ogma) · greek (Hermes) · hanzi (Thương Hiệt) · cuneiform (Nabu) · hiero (Thoth).
     Chữ rune / Ogham / hình nêm / tượng hình vẽ bằng nét (không cần font, điện thoại nào cũng hiện đúng); Hy Lạp + chữ Hán + Latin dùng font hệ thống. */
  const FUTHARK = [
    [[.35, 0, .35, 1], [.35, .05, .75, .3], [.35, .3, .75, .55]], [[.3, 1, .3, 0], [.3, 0, .7, .35], [.7, .35, .7, 1]], [[.35, 0, .35, 1], [.35, .25, .7, .5], [.7, .5, .35, .75]],
    [[.35, 0, .35, 1], [.35, 0, .72, .25], [.35, .25, .72, .5]], [[.32, 0, .32, 1], [.32, 0, .7, .22], [.7, .22, .32, .45], [.32, .45, .72, 1]], [[.7, 0, .3, .5], [.3, .5, .7, 1]],
    [[.25, 0, .75, 1], [.75, 0, .25, 1]], [[.35, 0, .35, 1], [.35, 0, .7, .2], [.7, .2, .35, .4]], [[.3, 0, .3, 1], [.7, 0, .7, 1], [.3, .35, .7, .6]], [[.5, 0, .5, 1], [.5, .4, .2, .05], [.5, .4, .8, .05]],
    [[.65, 0, .3, .35], [.3, .35, .7, .65], [.7, .65, .35, 1]], [[.5, 0, .5, 1], [.5, 0, .2, .3], [.5, 0, .8, .3]], [[.25, 0, .25, 1], [.75, 0, .75, 1], [.25, 0, .75, .45], [.75, 0, .25, .45]],
    [[.5, 0, .82, .32], [.82, .32, .2, .78], [.5, 0, .18, .32], [.18, .32, .8, .78], [.2, .78, .1, 1], [.8, .78, .9, 1]]];
  const FONT_SETS = { latin: "AEIOUYWS♪♫", greek: "ΑΒΓΔΘΛΞΠΣΦΨΩ", hanzi: "言語聲文字音心力雷火水風龍光" };
  function glyph(g, script, i, s) {   // vẽ 1 ký tự cỡ s, tâm (0,0)
    g.save(); g.lineWidth = Math.max(2, s * 0.09); g.lineCap = "round"; g.lineJoin = "round";
    if (FONT_SETS[script]) { const set = FONT_SETS[script]; g.font = "bold " + Math.round(s * 0.95) + "px " + (script === "hanzi" ? "serif" : "Georgia, serif"); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText([...set][i % [...set].length], 0, s * 0.04); }
    else if (script === "runic") { const r = FUTHARK[i % FUTHARK.length]; g.beginPath(); r.forEach(([a, b, c, d]) => { g.moveTo((a - .5) * s, (b - .5) * s); g.lineTo((c - .5) * s, (d - .5) * s); }); g.stroke(); }
    else if (script === "ogham") { const n = 1 + (i * 7) % 5, kind = (i * 3) % 4; g.beginPath(); g.moveTo(0, -s * .5); g.lineTo(0, s * .5);
      for (let k = 0; k < n; k++) { const y = -s * .3 + k * s * .15; if (kind === 0) { g.moveTo(-s * .3, y); g.lineTo(0, y); } else if (kind === 1) { g.moveTo(0, y); g.lineTo(s * .3, y); } else if (kind === 2) { g.moveTo(-s * .3, y); g.lineTo(s * .3, y); } else { g.moveTo(-s * .25, y + s * .1); g.lineTo(s * .25, y - s * .1); } } g.stroke(); }
    else if (script === "cuneiform") { const n = 2 + (i * 5) % 4; for (let k = 0; k < n; k++) { const a = ((i * 13 + k * 7) % 4) * PI / 2, x = ((k * 37 + i * 11) % 5 - 2) * s * .14, y = ((k * 23 + i * 7) % 5 - 2) * s * .14;
        g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.moveTo(-s * .12, -s * .1); g.lineTo(s * .12, -s * .1); g.lineTo(0, s * .05); g.closePath(); g.fill(); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, s * .3); g.stroke(); g.restore(); } }
    else if (script === "hiero") { const k = i % 6; g.beginPath();
      if (k === 0) { g.ellipse(0, -s * .22, s * .14, s * .2, 0, 0, 7); g.moveTo(0, -s * .02); g.lineTo(0, s * .5); g.moveTo(-s * .25, s * .08); g.lineTo(s * .25, s * .08); }   // ankh
      else if (k === 1) { g.moveTo(-s * .4, 0); g.quadraticCurveTo(0, -s * .3, s * .4, 0); g.quadraticCurveTo(0, s * .25, -s * .4, 0); g.moveTo(s * .08, 0); g.arc(0, 0, s * .08, 0, 7); g.moveTo(-s * .1, s * .12); g.lineTo(-s * .2, s * .45); }   // mắt Horus
      else if (k === 2) { for (let r = 0; r < 3; r++) { const y = (r - 1) * s * .22; g.moveTo(-s * .4, y); for (let q = 0; q < 6; q++) g.lineTo(-s * .4 + (q + 1) * s * .135, y + (q % 2 ? -1 : 1) * s * .07); } }   // nước
      else if (k === 3) { g.moveTo(0, s * .5); g.quadraticCurveTo(-s * .25, 0, 0, -s * .5); g.quadraticCurveTo(s * .2, 0, 0, s * .5); g.moveTo(0, s * .5); g.lineTo(0, -s * .3); }   // lông vũ / cây sậy
      else if (k === 4) { g.arc(0, 0, s * .3, 0, 7); g.moveTo(s * .06, 0); g.arc(0, 0, s * .06, 0, 7); }   // mặt trời
      else { g.moveTo(-s * .3, s * .4); g.lineTo(-s * .1, -s * .1); g.quadraticCurveTo(0, -s * .45, s * .25, -s * .3); g.lineTo(s * .1, -s * .15); g.lineTo(s * .35, s * .4); }   // chim
      g.stroke(); }
    g.restore();
  }
  const RUNE_CACHE = {};
  function runeTex(shape, script) {
    const key = shape + ":" + script; if (RUNE_CACHE[key]) return RUNE_CACHE[key];
    return RUNE_CACHE[key] = cvTex(512, (g, n) => {
      const c = n / 2, R = 240; g.translate(c, c); g.strokeStyle = "#fff"; g.fillStyle = "#fff"; g.lineCap = "round"; g.lineJoin = "round"; g.shadowColor = "#fff"; g.shadowBlur = 8;
      const circ = (r, w) => { g.lineWidth = w; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke(); };
      const poly = (pts, w) => { g.lineWidth = w; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.stroke(); };
      const ring = (r, k, a0) => Array.from({ length: k }, (_, i) => { const a = a0 + i / k * PI * 2; return [Math.cos(a) * r, Math.sin(a) * r]; });
      let band = 0, nG = 12, gs = 34, inner = [0.32, 6, 26];
      if (shape === "circle") { circ(R, 6); circ(R - 18, 2); circ(R * .66, 4); circ(R * .62, 1.5); for (let i = 0; i < 72; i++) { const a = i / 72 * PI * 2, l = i % 6 ? 8 : 16; g.lineWidth = i % 6 ? 1.5 : 3; g.beginPath(); g.moveTo(Math.cos(a) * (R - 18), Math.sin(a) * (R - 18)); g.lineTo(Math.cos(a) * (R - 18 - l), Math.sin(a) * (R - 18 - l)); g.stroke(); } band = R * .8; poly(ring(R * .62, 3, -PI / 2), 3); poly(ring(R * .62, 3, PI / 2), 3); }
      else if (shape === "star") { const P = []; for (let i = 0; i < 16; i++) { const a = i / 16 * PI * 2 - PI / 2, r = i % 2 ? R * .5 : R; P.push([Math.cos(a) * r, Math.sin(a) * r]); } poly(P, 5); circ(R * .46, 3); circ(R * .42, 1.5); band = R * .62; nG = 8; gs = 30; inner = [0.25, 4, 22]; }   // sao 8 cánh chĩa ra
      else if (shape === "hex") { circ(R, 5); circ(R * .93, 1.5); poly(ring(R * .9, 3, -PI / 2), 4); poly(ring(R * .9, 3, PI / 2), 4); circ(R * .45, 3); band = 0; nG = 6; gs = 40; for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2 - PI / 2 + PI / 6; g.save(); g.translate(Math.cos(a) * R * .62, Math.sin(a) * R * .62); g.rotate(a + PI / 2); glyph(g, script, i, 40); g.restore(); } }
      else if (shape === "seal") { poly(ring(R * .95, 4, 0), 5); poly(ring(R * .95, 4, PI / 4), 5); circ(R * .7, 3); circ(R * .66, 1.5); band = R * .52; nG = 10; gs = 30; inner = [0.2, 4, 0]; }   // ấn 8 góc (2 hình vuông)
      else if (shape === "sun") { circ(R * .6, 5); circ(R * .55, 1.5); for (let i = 0; i < 32; i++) { const a = i / 32 * PI * 2, l = i % 2 ? R * .8 : R; g.lineWidth = i % 2 ? 3 : 6; g.beginPath(); g.moveTo(Math.cos(a) * R * .63, Math.sin(a) * R * .63); g.lineTo(Math.cos(a) * l, Math.sin(a) * l); g.stroke(); } band = R * .42; nG = 8; gs = 28; inner = [0.15, 1, 40]; }   // mặt trời tia gai
      else { poly(ring(R * .95, 3, -PI / 2), 6); ring(R * .95, 3, -PI / 2).forEach(([x, y]) => { g.lineWidth = 3; g.beginPath(); g.arc(x, y, 26, 0, 7); g.stroke(); }); circ(R * .47, 4); band = R * .36; nG = 7; gs = 30; inner = [0, 1, 46]; }   // tam giác
      if (band) for (let i = 0; i < nG; i++) { const a = i / nG * PI * 2 - PI / 2; g.save(); g.translate(Math.cos(a) * band, Math.sin(a) * band); g.rotate(a + PI / 2); glyph(g, script, i, gs); g.restore(); }
      if (inner[1] > 1) for (let i = 0; i < inner[1]; i++) { const a = i / inner[1] * PI * 2; g.save(); g.translate(Math.cos(a) * R * inner[0], Math.sin(a) * R * inner[0]); g.rotate(a + PI / 2); glyph(g, script, i + 5, inner[2]); g.restore(); }
      else if (inner[2]) glyph(g, script, 3, inner[2]);
    });
  }
  /* ---------- VẬT HÌNH DẠNG NHẬN RA ĐƯỢC: rồng, kiếm, sách ---------- */
  const SOLID_FS = `uniform sampler2D uTex; uniform float uTime, uAlpha, uBelly; uniform vec3 uC1, uC2, uRim; uniform vec2 uRep;
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main() {
  float s = pow(texture2D(uTex, vUv * uRep).r, 2.2); float fr = pow(1.0 - abs(dot(vN, vV)), 2.0);
  float sh = sin(vUv.x * 30.0 - uTime * 9.0) * 0.5 + 0.5;
  float belly = smoothstep(0.55, 0.85, abs(vUv.y - 0.5) * 2.0) * uBelly;   // bụng (uv.y ≈ 0 / 1 là mặt dưới thân rồng) sáng màu kem, lưng sẫm
  vec3 col = mix(mix(uC1, uC2, s), vec3(1.0, 0.93, 0.72), belly * 0.8) + uRim * fr * 1.3 + uC2 * sh * 0.12;
  gl_FragColor = vec4(col, uAlpha);
}`;
  function solidMat(c1, c2, rim, tex, rep) {   // vật thể đặc (rồng, kiếm, sách): vân + viền sáng, không cần đèn
    return new THREE.ShaderMaterial({ vertexShader: FLOW_VS, fragmentShader: SOLID_FS, transparent: true, side: THREE.DoubleSide,
      uniforms: { uTex: { value: tex || TEX.noise }, uTime: { value: 0 }, uAlpha: { value: 1 }, uC1: { value: new THREE.Color(c1) }, uC2: { value: new THREE.Color(c2) }, uRim: { value: new THREE.Color(rim) }, uBelly: { value: 0 }, uRep: { value: new THREE.Vector2(...(rep || [1, 1])) } } });
  }
  const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s3 = new V3(), _x = new V3(), _y = new V3(), _z = new V3();
  function basisQ(fwd, upHint) { _z.copy(fwd).normalize(); _x.crossVectors(upHint || UP, _z); if (_x.lengthSq() < 1e-4) _x.set(1, 0, 0); _x.normalize(); _y.crossVectors(_z, _x); return _q.setFromRotationMatrix(_m4.makeBasis(_x, _y, _z)); }

  /* RỒNG (phương Đông): thân ống vảy vàng dài, gai lưng lửa, 4 chân có vuốt, đầu có hàm mở, sừng, râu dài, bờm lửa, đuôi lửa */
  function dragon(F, Tg, dur, delay, o) {
    o = o || {}; F = F.clone(); Tg = Tg.clone(); const C = F.clone().lerp(Tg, 0.3);
    const gold = o.c1 || 0xa8300c, gold2 = o.c2 || 0xffe27a, fire = o.fire || [0xff3a0a, 0xffd27a];
    task(delay || 0, dur, () => {
      const N = 40, M = 8, LEN = 10.5, hist = [];
      const bodyMat = solidMat(gold, gold2, 0xffd890, TEX.scale, [30, 3]); bodyMat.uniforms.uBelly.value = 1; const headMat = solidMat(gold, gold2, 0xffd890, TEX.noise, [2, 2]), _hm = 0, hornMat = solidMat(0xcfa860, 0xfff8e0, 0xffffff), fireMat = flowMat({ c1: fire[0], c2: fire[1], rep: [1, 1], spd: [0, -2.5], fres: 0.6, cut: 0.05, fade: [0, 0, 0.05, 0.5] });
      // thân: ống (N+1) vòng × (M+1) đỉnh, dựng lại mỗi khung theo đường bay
      const bg = new THREE.BufferGeometry(), bp = new Float32Array((N + 1) * (M + 1) * 3), bn = new Float32Array(bp.length), buv = new Float32Array((N + 1) * (M + 1) * 2), bi = [];
      for (let i = 0; i <= N; i++) for (let j = 0; j <= M; j++) { buv.set([i / N, j / M], (i * (M + 1) + j) * 2); if (i && j) { const a = (i - 1) * (M + 1) + j - 1, b = a + 1, c2 = i * (M + 1) + j - 1, d = c2 + 1; bi.push(a, c2, b, b, c2, d); } }
      bg.setAttribute("position", new THREE.BufferAttribute(bp, 3)); bg.setAttribute("normal", new THREE.BufferAttribute(bn, 3)); bg.setAttribute("uv", new THREE.BufferAttribute(buv, 2)); bg.setIndex(bi);
      const body = mesh(bg, bodyMat, 9); SC.add(body);
      // gai lưng + chân + vuốt: InstancedMesh (1 lần vẽ mỗi loại)
      const spikeG = new THREE.ConeGeometry(0.13, 0.55, 4); spikeG.translate(0, 0.27, 0); const spikes = new THREE.InstancedMesh(spikeG, fireMat, 14); spikes.frustumCulled = false; spikes.renderOrder = 10; SC.add(spikes);
      const legG = new THREE.CylinderGeometry(0.09, 0.13, 0.7, 6); legG.translate(0, -0.35, 0); const legs = new THREE.InstancedMesh(legG, bodyMat, 4); legs.frustumCulled = false; SC.add(legs);
      const clawG = new THREE.ConeGeometry(0.05, 0.25, 4); clawG.translate(0, -0.12, 0); const claws = new THREE.InstancedMesh(clawG, hornMat, 12); claws.frustumCulled = false; SC.add(claws);
      const tailF = new THREE.InstancedMesh(new THREE.ConeGeometry(0.22, 1.1, 5).translate(0, 0.55, 0), fireMat, 3); tailF.frustumCulled = false; tailF.renderOrder = 10; SC.add(tailF);
      // đầu: dựng 1 lần trong khung toạ độ riêng (+z = hướng nhìn, +y = trên)
      const head = new THREE.Group(), add = (g, m, x, y, z) => { const me = new THREE.Mesh(g, m); me.position.set(x, y, z); me.frustumCulled = false; head.add(me); return me; };
      add(new THREE.SphereGeometry(0.55, 14, 10), headMat, 0, 0.05, 0).scale.set(1, 0.82, 1.05);   // sọ
      add(new THREE.CylinderGeometry(0.24, 0.34, 0.85, 7).rotateX(PI / 2), headMat, 0, 0, 0.72).scale.set(1.25, 1, 1);   // mõm
      add(new THREE.SphereGeometry(0.17, 8, 6), headMat, 0, 0.08, 1.15);   // mũi
      const jaw = new THREE.Group(); jaw.position.set(0, -0.18, 0.25); head.add(jaw);
      const jm = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, 0.85, 7).rotateX(PI / 2), headMat); jm.position.set(0, -0.08, 0.42); jm.scale.set(1.15, 0.6, 1); jaw.add(jm);   // hàm dưới (mở / ngậm)
      [-1, 1].forEach(sx => { for (let k = 0; k < 3; k++) { const t = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 4), hornMat); t.position.set(sx * 0.14, 0.04, 0.55 + k * 0.17); t.rotation.x = PI; jaw.add(t); } });   // răng
      const mouth = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0xff7a2a, blending: ADD, transparent: true, depthWrite: false })); mouth.position.set(0, -0.15, 0.75); mouth.scale.setScalar(0.9); head.add(mouth);
      [-1, 1].forEach(sx => { add(new THREE.SphereGeometry(0.1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), sx * 0.28, 0.22, 0.42); const eg = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0xfff6a0, blending: ADD, transparent: true, depthWrite: false })); eg.position.set(sx * 0.3, 0.22, 0.46); eg.scale.setScalar(0.5); head.add(eg);
        add(new THREE.ConeGeometry(0.09, 0.35, 4).rotateZ(-sx * 1.2), headMat, sx * 0.3, 0.34, 0.36);   // mày
        const h1 = add(new THREE.CylinderGeometry(0.04, 0.09, 0.8, 5).translate(0, 0.4, 0), hornMat, sx * 0.22, 0.38, -0.05); h1.rotation.set(-1.0, 0, -sx * 0.35);   // sừng gốc
        const h2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.04, 0.6, 5).translate(0, 0.3, 0), hornMat); h2.position.set(0, 0.78, 0); h2.rotation.x = -0.6; h1.add(h2);   // sừng ngọn cong
        const wc = new THREE.CatmullRomCurve3([new V3(sx * 0.3, -0.05, 1.0), new V3(sx * 0.9, -0.25, 0.6), new V3(sx * 1.5, 0.05, -0.1), new V3(sx * 1.9, -0.2, -0.8)]);
        add(new THREE.TubeGeometry(wc, 16, 0.03, 4), hornMat, 0, 0, 0);   // râu dài
        for (let k = 0; k < 4; k++) { const mn = add(new THREE.ConeGeometry(0.16, 0.9, 5).translate(0, 0.45, 0), fireMat, sx * (0.25 + k * 0.08), 0.1 + k * 0.08, -0.35 - k * 0.12); mn.rotation.set(-1.9 + k * 0.1, 0, sx * (0.5 + k * 0.15)); } });   // bờm lửa
      head.scale.setScalar(1.5); SC.add(head); head.traverse(x => { x.frustumCulled = false; x.renderOrder = 11; });
      const pos = new V3(), tmp = new V3(), tan = new V3(), side = new V3(), up = new V3(), nv = new V3(), dum = new THREE.Object3D();
      const path = (u) => {   // 0 → 0.55: bay xoắn ốc lên; 0.55 → 1: lao xuống mục tiêu
        if (u < 0.55) { const s = u / 0.55, a = s * PI * 3.0, r = 1.8 + s * 1.4; return pos.set(C.x + Math.cos(a) * r, 0.9 + s * 3.0 + Math.sin(s * PI * 6) * 0.25, C.z + Math.sin(a) * r); }
        const s = (u - 0.55) / 0.45, a = 3.0 * PI, S = tmp.set(C.x + Math.cos(a) * 3.2, 3.9, C.z + Math.sin(a) * 3.2), e = s * s * (3 - 2 * s);
        return pos.set(S.x + (Tg.x - S.x) * e, S.y + (1.1 - S.y) * e + Math.sin(s * PI) * 1.2, S.z + (Tg.z - S.z) * e);
      };
      const radius = u => u < 0.04 ? 0.38 : u < 0.2 ? 0.38 + (u - 0.04) / 0.16 * 0.17 : u < 0.5 ? 0.55 - (u - 0.2) / 0.3 * 0.12 : Math.max(0.05, 0.43 * (1 - (u - 0.5) / 0.5));
      for (let i = 0; i < 120; i++) hist.push(path(0).clone().add(new V3(0, -1.2 - i * 0.1, 0)));   // thân chưa duỗi: nằm dưới đất (bị mặt đất che), rồng "trồi lên" từ vòng phù văn
      return { upd: (k, t) => {
        [bodyMat, hornMat, headMat].forEach(m => m.uniforms.uTime.value = t); fireMat.uniforms.uTime.value = t;
        const fade = 1 - Math.max(0, k - 0.9) / 0.1; [bodyMat, hornMat, headMat].forEach(m => m.uniforms.uAlpha.value = fade); fireMat.uniforms.uAlpha.value = fade;
        hist.unshift(path(Math.min(1, k * 1.06)).clone()); while (hist.length > 220) hist.pop();
        const pts = [hist[0]], step = LEN / N; let cum = 0, target = step;   // đốt thân cách đều nhau dọc theo đường đầu đã bay qua (đầu đi trước, thân theo sau)
        for (let j = 1; j < hist.length && pts.length <= N; j++) { const d = hist[j].distanceTo(hist[j - 1]);
          while (d > 1e-6 && cum + d >= target && pts.length <= N) { pts.push(hist[j - 1].clone().lerp(hist[j], (target - cum) / d)); target += step; }
          cum += d; }
        while (pts.length <= N) pts.push(pts[pts.length - 1].clone().add(new V3(0, -step, 0)));
        const frames = [];
        for (let i = 0; i <= N; i++) { tan.subVectors(pts[Math.max(0, i - 1)], pts[Math.min(N, i + 1)]); if (tan.lengthSq() < 1e-6) tan.set(0, 0, 1); tan.normalize();   // tan: hướng về phía đầu
          side.crossVectors(UP, tan); if (side.lengthSq() < 1e-4) side.set(1, 0, 0); side.normalize(); up.crossVectors(tan, side).normalize();
          const r = radius(i / N) * (1 + 0.06 * Math.sin(i * 0.8 - t * 10)); frames.push({ p: pts[i], t: tan.clone(), s: side.clone(), u: up.clone(), r });
          for (let jj = 0; jj <= M; jj++) { const a = jj / M * PI * 2; nv.copy(side).multiplyScalar(Math.cos(a)).addScaledVector(up, Math.sin(a)); const q = (i * (M + 1) + jj) * 3;
            bp[q] = pts[i].x + nv.x * r; bp[q + 1] = pts[i].y + nv.y * r * 0.9; bp[q + 2] = pts[i].z + nv.z * r; bn[q] = nv.x; bn[q + 1] = nv.y; bn[q + 2] = nv.z; } }
        bg.attributes.position.needsUpdate = true; bg.attributes.normal.needsUpdate = true;
        for (let s = 0; s < 14; s++) { const f = frames[4 + s * 2]; dum.position.copy(f.p).addScaledVector(f.u, f.r * 0.85); dum.quaternion.copy(basisQ(tmp.copy(f.u).addScaledVector(f.t, -0.7), f.s)); dum.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new V3(1, 0, 0), -PI / 2)); dum.scale.setScalar((f.r / 0.5) * fade); dum.updateMatrix(); spikes.setMatrixAt(s, dum.matrix); }
        spikes.instanceMatrix.needsUpdate = true;
        [[7, -1], [7, 1], [21, -1], [21, 1]].forEach(([ri, sx], li) => { const f = frames[ri], sw = Math.sin(t * 9 + li * 1.7) * 0.5;
          dum.position.copy(f.p).addScaledVector(f.s, sx * f.r * 0.8).addScaledVector(f.u, -f.r * 0.2);
          const dir = tmp.copy(f.u).multiplyScalar(-0.8).addScaledVector(f.s, sx * 0.55).addScaledVector(f.t, 0.25 + sw * 0.4).normalize();
          dum.quaternion.setFromUnitVectors(new V3(0, -1, 0), dir); dum.scale.setScalar(fade); dum.updateMatrix(); legs.setMatrixAt(li, dum.matrix);
          const foot = f.p.clone().addScaledVector(f.s, sx * f.r * 0.8).addScaledVector(f.u, -f.r * 0.2).addScaledVector(dir, 0.7);
          for (let c = 0; c < 3; c++) { dum.position.copy(foot); const cd = dir.clone().addScaledVector(f.s, (c - 1) * 0.5).addScaledVector(f.t, 0.4).normalize(); dum.quaternion.setFromUnitVectors(new V3(0, -1, 0), cd); dum.updateMatrix(); claws.setMatrixAt(li * 3 + c, dum.matrix); } });
        legs.instanceMatrix.needsUpdate = true; claws.instanceMatrix.needsUpdate = true;
        const tf = frames[N - 1], tailOn = tf.p.distanceTo(frames[0].p) > LEN * 0.45 ? fade : 0;   // đuôi lửa chỉ hiện khi thân đã duỗi ra (lúc đầu thân còn cuộn)
        for (let c = 0; c < 3; c++) { dum.position.copy(tf.p); dum.quaternion.copy(basisQ(tmp.copy(tf.t).multiplyScalar(-1).addScaledVector(tf.u, (c - 1) * 0.7), tf.s)); dum.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new V3(1, 0, 0), PI / 2)); dum.scale.setScalar(tailOn); dum.updateMatrix(); tailF.setMatrixAt(c, dum.matrix); }
        tailF.instanceMatrix.needsUpdate = true;
        const f0 = frames[0]; head.position.copy(f0.p).addScaledVector(f0.t, 0.35); head.quaternion.copy(basisQ(f0.t, f0.u)); head.scale.setScalar(1.5 * fade);
        jaw.rotation.x = 0.25 + Math.abs(Math.sin(t * 5)) * 0.35; mouth.material.opacity = 0.6 + Math.sin(t * 20) * 0.3;
      }, end: () => { [body, spikes, legs, claws, tailF, head].forEach(kill); } };
    });
    emitter(220, i => { const u = i / 220, s = Math.min(1, u / 0.55), a = s * PI * 3.0, r = 1.8 + s * 1.4; const p = u < 0.55 ? new V3(C.x + Math.cos(a) * r, 0.9 + s * 3.0, C.z + Math.sin(a) * r) : new V3(C.x + Math.cos(3 * PI) * 3.2, 3.9, C.z).lerp(Tg, (u - 0.55) / 0.45);
      return { p: p.add(rv(0.5)), v: rv(1.0), t0: u * dur * 0.95 + (delay || 0), life: R(0.5, 0.9), size: R(0.3, 0.6), col: [gold2, 0xffffff, fire[0]][i % 3] }; }, { grav: -1.5, drag: 2 });
  }

  /* KIẾM KHỔNG LỒ: lưỡi phát sáng có rune chạy, chuôi + đốc + ngọc; rơi từ trời cắm xuống đất */
  const BLADE_FS = `uniform sampler2D uTex; uniform float uTime, uAlpha; uniform vec3 uC1, uC2; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main() { float fr = pow(1.0 - abs(dot(vN, vV)), 1.5); float n = texture2D(uTex, vec2(vUv.x * 2.0, vUv.y * 3.0 - uTime * 1.5)).r;
  float core = smoothstep(0.35, 0.0, abs(vUv.x - 0.5)); vec3 col = mix(uC1, uC2, core * 0.8 + n * 0.3) + vec3(1.0) * fr * 0.7 + uC2 * smoothstep(0.6, 0.9, n) * 0.6;
  gl_FragColor = vec4(col, uAlpha); }`;
  function giantSword(T, c1, c2, dur, delay, cb) {
    T = T.clone();
    task(delay || 0, dur, () => {
      const sh = new THREE.Shape(); sh.moveTo(-0.34, 0); sh.lineTo(0.34, 0); sh.lineTo(0.28, 4.3); sh.lineTo(0, 5.2); sh.lineTo(-0.28, 4.3); sh.closePath();
      const bladeG = new THREE.ExtrudeGeometry(sh, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.06, bevelSegments: 1 }); bladeG.translate(0, 0, -0.04);
      const uv = bladeG.attributes.uv, p = bladeG.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, (p.getX(i) + 0.4) / 0.8, p.getY(i) / 5.2);
      const bm = new THREE.ShaderMaterial({ vertexShader: FLOW_VS, fragmentShader: BLADE_FS, transparent: true, side: THREE.DoubleSide, uniforms: { uTex: { value: TEX.noise }, uTime: { value: 0 }, uAlpha: { value: 1 }, uC1: { value: new THREE.Color(c1) }, uC2: { value: new THREE.Color(c2) } } });
      const hilt = solidMat(0x6a4a1a, 0xffd27a, 0xffe9b0);
      const g = new THREE.Group(), blade = new THREE.Mesh(bladeG, bm); g.add(blade);
      const guard = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.24, 0.32), hilt); guard.position.y = -0.1; g.add(guard);
      [-1, 1].forEach(s => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), hilt); b.position.set(s * 1.0, -0.1, 0); g.add(b); const w = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 5), hilt); w.position.set(s * 0.75, 0.12, 0); w.rotation.z = -s * 0.6; g.add(w); });
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.1, 8), hilt); grip.position.y = -0.8; g.add(grip);
      const pom = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), hilt); pom.position.y = -1.42; g.add(pom);
      const gem = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c2, blending: ADD, transparent: true, depthWrite: false })); gem.position.set(0, -0.1, 0.2); gem.scale.setScalar(0.9); g.add(gem);
      const aura = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c1, blending: ADD, transparent: true, depthWrite: false, opacity: 0.6 })); aura.position.set(0, 2.4, 0); aura.scale.set(2.2, 7, 1); g.add(aura);
      g.rotation.z = PI; g.traverse(x => { x.frustumCulled = false; x.renderOrder = 10; }); SC.add(g); let hit = false;
      return { upd: (k, t) => { bm.uniforms.uTime.value = t; hilt.uniforms.uTime.value = t;
        const fall = Math.min(1, Math.max(0, (k - 0.18) / 0.14)), y = 11 - (11 + 1.6) * fall * fall;   // treo trên trời rồi rơi nhanh, cắm sâu 1,6 m
        g.position.set(T.x, Math.max(-1.6, y) + 5.2, T.z); g.rotation.y = (1 - fall) * t * 2;
        const a = Math.min(1, k / 0.1) * (1 - Math.max(0, k - 0.8) / 0.2); bm.uniforms.uAlpha.value = a; hilt.uniforms.uAlpha.value = a; aura.material.opacity = 0.6 * a; gem.material.opacity = a;
        if (!hit && fall >= 1) { hit = true; if (cb) cb(); } }, end: () => kill(g) }; });
  }

  /* SÁCH PHÉP: bìa da đỏ viền vàng, trang giấy da có chữ; bay lơ lửng, mở ra, trang sách bay tung, chiếu sáng xuống đất */
  function pageTex(script) { return cvTex(128, (g, n) => { g.fillStyle = "#f3e3bd"; g.fillRect(0, 0, n, n); g.strokeStyle = "rgba(120,80,30,.6)"; g.strokeRect(6, 6, n - 12, n - 12); g.fillStyle = "#6b3d14"; g.strokeStyle = "#6b3d14";
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { g.save(); g.translate(22 + c * 28, 20 + r * 22); glyph(g, script, r * 4 + c, 16); g.restore(); } }); }
  function coverTex() { return cvTex(128, (g, n) => { const gr = g.createLinearGradient(0, 0, n, n); gr.addColorStop(0, "#7a1f1f"); gr.addColorStop(1, "#4a0f14"); g.fillStyle = gr; g.fillRect(0, 0, n, n);
    g.strokeStyle = "#e8b84a"; g.lineWidth = 5; g.strokeRect(8, 8, n - 16, n - 16); g.lineWidth = 2; g.strokeRect(16, 16, n - 32, n - 32); g.fillStyle = "#e8b84a"; g.translate(n / 2, n / 2); g.beginPath(); g.arc(0, 0, 22, 0, 7); g.lineWidth = 3; g.stroke(); glyph(g, "cuneiform", 2, 30); }); }
  function magicBook(F, T, script, glowC, nPages, dur, delay, onHit) {   // sách nhỏ lơ lửng trên đầu người chơi, mở ra, từng trang phóng vào quái → nổ
    F = F.clone(); T = T.clone();
    const tOpen = 0.35, gap = 0.16, fly = 0.32;
    task(delay || 0, dur, () => {
      const pt = pageTex(script), ct = coverTex(), coverM = new THREE.MeshBasicMaterial({ map: ct, transparent: true }), pageM = new THREE.MeshBasicMaterial({ map: pt, transparent: true, side: THREE.DoubleSide });
      const root = new THREE.Group(), L = new THREE.Group(), Rg = new THREE.Group(); root.add(L); root.add(Rg);
      const mkHalf = (grp, s) => { const cv = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.07, 1.5), coverM); cv.position.set(s * 0.575, 0, 0); grp.add(cv); const pg = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.14, 1.4), pageM); pg.position.set(s * 0.53, 0.1, 0); grp.add(pg); };
      mkHalf(L, -1); mkHalf(Rg, 1);
      const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8).rotateX(PI / 2), coverM); root.add(spine);
      const glowS = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: glowC, blending: ADD, transparent: true, depthWrite: false })); glowS.position.y = 0.4; root.add(glowS);
      root.traverse(x => { x.frustumCulled = false; x.renderOrder = 10; }); SC.add(root);
      const yaw = Math.atan2(T.x - F.x, T.z - F.z), pages = [], A = new V3(), B = T.clone().setY(1.1), P = new V3();
      for (let i = 0; i < nPages; i++) { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.95), pageM), gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: glowC, blending: ADD, transparent: true, depthWrite: false }));
        gl.scale.setScalar(1.6); g.add(gl); g.add(m); g.visible = false; g.traverse(x => { x.frustumCulled = false; x.renderOrder = 11; }); SC.add(g);
        pages.push({ g, m, t0: tOpen + i * gap, side: (i % 2 ? 1 : -1) * (0.6 + (i % 3) * 0.3), hit: false }); }
      return { upd: (k, t) => {
        const op = Math.min(1, t / 0.25), e = op * op * (3 - 2 * op), ang = PI / 2 * (1 - e) + 0.14 * e;   // gập → mở hình chữ V
        L.rotation.z = -ang; Rg.rotation.z = ang;
        root.position.set(F.x, 2.9 + Math.sin(t * 4) * 0.08, F.z); root.rotation.set(0.6, yaw, 0, "YXZ");
        root.scale.setScalar(0.62 * Math.min(1, t / 0.12) * (1 - Math.max(0, k - 0.9) / 0.1));
        glowS.scale.setScalar(1 + e * 2); glowS.material.opacity = e * (0.7 + 0.3 * Math.sin(t * 18));
        A.set(F.x, 3.1, F.z);
        pages.forEach(pg => { const u = (t - pg.t0) / fly; pg.g.visible = u > 0 && u < 1; if (u <= 0) return;
          if (u >= 1) { if (!pg.hit) { pg.hit = true; if (onHit) onHit(pages.indexOf(pg)); } return; }
          const s2 = u * u; P.lerpVectors(A, B, s2); P.y += Math.sin(u * PI) * 1.2; P.x += Math.cos(yaw) * pg.side * Math.sin(u * PI); P.z -= Math.sin(yaw) * pg.side * Math.sin(u * PI);
          pg.g.position.copy(P); pg.m.rotation.set(t * 9, t * 7, t * 5); });
      }, end: () => { kill(root); pages.forEach(pg => kill(pg.g)); pt.dispose(); ct.dispose(); } }; });
    // vệt sáng sau mỗi trang
    for (let i = 0; i < nPages; i++) emitter(24, q => { const u = q / 24, side = (i % 2 ? 1 : -1) * (0.6 + (i % 3) * 0.3), yaw = Math.atan2(T.x - F.x, T.z - F.z), p = new V3(F.x, 3.1, F.z).lerp(T.clone().setY(1.1), u * u);
      p.y += Math.sin(u * PI) * 1.2; p.x += Math.cos(yaw) * side * Math.sin(u * PI); p.z -= Math.sin(yaw) * side * Math.sin(u * PI);
      return { p: p.add(rv(0.1)), v: rv(0.4), t0: (delay || 0) + tOpen + i * gap + u * fly, life: R(0.25, 0.45), size: R(0.2, 0.38), col: q % 2 ? glowC : 0xffffff }; }, { grav: 0, drag: 2 });
    return (delay || 0) + tOpen + fly;   // lúc trang đầu chạm quái
  }
  /* ---------- thành phần hình thêm (27/11): vòm năng lượng, mũi tên pha lê, dấu ? 3D, hoa sen, cây ánh sáng, trống ---------- */
  function dome(P, c1, c2, r, dur, delay) {   // vòm năng lượng phồng ra rồi tan (vụ nổ lớn)
    P = P.clone();
    task(delay || 0, dur, () => { const mt = flowMat({ c1, c2, rep: [3, 2], spd: [0.4, -1.5], fres: 1.6, cut: 0.1, fade: [0, 0, 0, 0] }), m = mesh(new THREE.SphereGeometry(1, 28, 16, 0, PI * 2, 0, PI / 2), mt, 8); m.position.set(P.x, 0, P.z); SC.add(m);
      return { upd: (k, t) => { mt.uniforms.uTime.value = t; const e = 1 - Math.pow(1 - k, 3); m.scale.set(r * e, r * e * 0.8, r * e); mt.uniforms.uAlpha.value = 1 - k; }, end: () => kill(m) }; });
  }
  function crystalArrow(A, B, c1, c2, dur, delay, o) {   // mũi tên pha lê bay (đầu nhọn 4 cạnh + thân + lông đuôi), đuôi hạt sáng
    o = o || {}; A = A.clone(); B = B.clone(); const sc = o.size || 1;
    task(delay || 0, dur, () => { const g = new THREE.Group(), cm = solidMat(c1, c2, 0xffffff), gm = flowMat({ c1, c2, rep: [1, 2], spd: [0, -3], fres: 1, cut: -0.2, fade: [0, 0, 0, 0] });
      const head = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), cm); head.scale.set(0.7, 0.7, 1.8); head.position.z = 0.55; g.add(head);
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.3, 6).rotateX(PI / 2), gm); g.add(shaft);
      for (let i = 0; i < 3; i++) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.45, 3).rotateX(-PI / 2), gm); f.position.z = -0.55; f.rotation.z = i * PI * 2 / 3; f.position.x = Math.cos(i * 2.09) * 0.08; f.position.y = Math.sin(i * 2.09) * 0.08; g.add(f); }
      const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c2, blending: ADD, transparent: true, depthWrite: false })); gl.scale.setScalar(1.4); g.add(gl);
      g.scale.setScalar(sc); g.traverse(x => { x.frustumCulled = false; x.renderOrder = 10; }); SC.add(g); const p = new V3(), d = new V3().subVectors(B, A).normalize();
      return { upd: (k, t) => { cm.uniforms.uTime.value = t; gm.uniforms.uTime.value = t; p.lerpVectors(A, B, k); if (o.arc) p.y += Math.sin(k * PI) * o.arc; g.position.copy(p); g.quaternion.copy(basisQ(d)); g.rotateZ(t * 12); }, end: () => kill(g) }; });
    emitter(30, i => ({ p: A.clone().lerp(B, i / 30).add(rv(0.08)), v: rv(0.3), t0: (delay || 0) + i / 30 * dur, life: R(0.2, 0.4), size: R(0.18, 0.32) * sc, col: i % 2 ? c1 : c2 }), { grav: 0, drag: 2 });
  }
  function qmark(P, c1, c2, size, dur, delay, o) {   // dấu "?" 3D (ống cong + chấm) lơ lửng / rơi xuống
    o = o || {}; P = P.clone();
    task(delay || 0, dur, () => { const curve = new THREE.CatmullRomCurve3([new V3(-0.45, 0.95, 0), new V3(-0.3, 1.3, 0), new V3(0.15, 1.4, 0), new V3(0.45, 1.1, 0), new V3(0.3, 0.75, 0), new V3(0.02, 0.55, 0), new V3(0, 0.3, 0)]);
      const mt = solidMat(c1, c2, 0xffffff), g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.11, 8), mt)); const dot = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), mt); dot.position.y = 0.02; g.add(dot);
      const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c2, blending: ADD, transparent: true, depthWrite: false })); gl.position.y = 0.8; gl.scale.setScalar(2.4); g.add(gl);
      g.traverse(x => { x.frustumCulled = false; x.renderOrder = 10; }); SC.add(g);
      return { upd: (k, t) => { mt.uniforms.uTime.value = t; const fall = o.drop ? Math.min(1, k / 0.25) : 1, y = o.drop ? P.y + (1 - fall * fall) * 6 : P.y + Math.sin(t * 4) * 0.12;
        g.position.set(P.x, y, P.z); g.rotation.y = t * (o.spin === undefined ? 2.5 : o.spin); g.scale.setScalar(size * Math.min(1, k / 0.08) * (1 - Math.max(0, k - 0.85) / 0.15)); mt.uniforms.uAlpha.value = 1; }, end: () => kill(g) }; });
  }
  function lotus(P, c1, c2, r, dur, delay) {   // hoa sen ánh sáng 2 tầng cánh nở dưới chân
    P = P.clone();
    task(delay || 0, dur, () => { const g = new THREE.Group(), mt = flowMat({ c1, c2, rep: [1, 1], spd: [0, -0.8], fres: 1.2, cut: -0.3, gain: 1.4, fade: [0, 0, 0, 0.15] }), pet = [];
      const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.bezierCurveTo(0.55, 0.35, 0.45, 1.1, 0, 1.5); sh.bezierCurveTo(-0.45, 1.1, -0.55, 0.35, 0, 0);
      const pg = new THREE.ShapeGeometry(sh, 10); const uv = pg.attributes.uv, pp = pg.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, pp.getX(i) + 0.5, pp.getY(i) / 1.5);
      [[8, 1, 0], [8, 0.7, PI / 8]].forEach(([n, s, off], L) => { for (let i = 0; i < n; i++) { const piv = new THREE.Group(), m = new THREE.Mesh(pg, mt); piv.add(m); piv.rotation.y = off + i / n * PI * 2; m.scale.setScalar(s); g.add(piv); pet.push({ m, L }); } });
      g.position.set(P.x, 0.05, P.z); g.scale.setScalar(r); g.traverse(x => { x.frustumCulled = false; x.renderOrder = 8; }); SC.add(g);
      return { upd: (k, t) => { mt.uniforms.uTime.value = t; const e = Math.min(1, k / 0.35), op = e * e * (3 - 2 * e); pet.forEach(q => { q.m.rotation.x = -(PI / 2) * (1 - op) - (q.L ? 0.35 : 0.9) * op; }); g.rotation.y = t * 0.4; mt.uniforms.uAlpha.value = 1 - Math.max(0, k - 0.75) / 0.25; }, end: () => kill(g) }; });
  }
  function lightTree(P, c1, c2, h, dur, delay) {   // cây ánh sáng mọc lên: thân xoắn + tán cầu năng lượng + lá vàng rơi
    P = P.clone();
    task(delay || 0, dur, () => { const g = new THREE.Group(), tm = solidMat(0x7a5a2a, 0xffe9a0, 0xfff6d0), cm = flowMat({ c1, c2, rep: [2, 2], spd: [0.3, -0.6], fres: 1.1, cut: 0.05, gain: 1.5, fade: [0, 0, 0, 0] });
      const tc = new THREE.CatmullRomCurve3([new V3(0, 0, 0), new V3(0.15, h * 0.3, 0.1), new V3(-0.1, h * 0.6, -0.1), new V3(0, h * 0.85, 0)]);
      const trunk = new THREE.Mesh(new THREE.TubeGeometry(tc, 20, 0.28, 8), tm); g.add(trunk);
      [[-1, 0.55], [1, 0.62], [0.4, 0.75]].forEach(([sx, y]) => { const bc = new THREE.CatmullRomCurve3([new V3(0, h * y, 0), new V3(sx * 0.8, h * (y + 0.12), 0.2), new V3(sx * 1.4, h * (y + 0.18), 0.1)]); g.add(new THREE.Mesh(new THREE.TubeGeometry(bc, 10, 0.1, 6), tm)); });
      const crowns = []; [[0, 1.0, 0, 1.6], [-1.2, 0.85, 0.2, 1.1], [1.3, 0.9, 0, 1.15], [0.3, 1.15, -0.5, 1.0]].forEach(([x, y, z, r]) => { const c = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 2), cm); c.position.set(x, h * y, z); g.add(c); crowns.push(c); });
      g.position.set(P.x, 0, P.z); g.traverse(x => { x.frustumCulled = false; x.renderOrder = 9; }); SC.add(g);
      return { upd: (k, t) => { tm.uniforms.uTime.value = t; cm.uniforms.uTime.value = t; const gr = Math.min(1, k / 0.3), e = 1 - Math.pow(1 - gr, 3); g.scale.set(e, e, e);
        crowns.forEach((c, i) => c.scale.setScalar(1 + Math.sin(t * 3 + i) * 0.05)); const a = 1 - Math.max(0, k - 0.8) / 0.2; tm.uniforms.uAlpha.value = a; cm.uniforms.uAlpha.value = a; }, end: () => kill(g) }; });
    emitter(120, i => ({ p: P.clone().add(new V3(R(-2.2, 2.2), h * R(0.8, 1.15), R(-1.5, 1.5))), v: new V3(R(-0.6, 0.6), R(-1.2, -0.4), R(-0.6, 0.6)), t0: (delay || 0) + 0.4 + R(0, dur - 0.9), life: R(0.9, 1.5), size: R(0.25, 0.45), col: [c2, 0xfff3a0, 0xffffff][i % 3] }), { grav: -0.5, drag: 0.4 });
  }
  function drumHit(P, c1, c2, size, dur, delay, o) {   // trống taiko hiện trên không, dùi lửa đập xuống, mặt trống rung
    o = o || {}; P = P.clone();
    task(delay || 0, dur, () => { const g = new THREE.Group(), wood = solidMat(0x6a1a0a, 0xc0501a, 0xffb060), skinT = cvTex(128, (gx, n) => { gx.fillStyle = "#f3e2c0"; gx.fillRect(0, 0, n, n); gx.fillStyle = "#c0301a"; gx.translate(n / 2, n / 2);
        for (let i = 0; i < 3; i++) { gx.save(); gx.rotate(i * PI * 2 / 3); gx.beginPath(); gx.arc(0, -16, 20, 0, PI * 2); gx.arc(0, -4, 10, 0, PI * 2, true); gx.fill(); gx.restore(); } });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.9, 20, 1, true), wood); body.scale.set(1, 1, 1); g.add(body);
      const bulge = new THREE.Mesh(new THREE.SphereGeometry(0.85, 20, 10), wood); bulge.scale.set(1, 0.55, 1); g.add(bulge);
      const skin = new THREE.Mesh(new THREE.CircleGeometry(0.78, 24).rotateX(-PI / 2), new THREE.MeshBasicMaterial({ map: skinT })); skin.position.y = 0.46; g.add(skin);
      for (let i = 0; i < 10; i++) { const st = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), solidMat(0xffd27a, 0xffffff, 0xffffff)); const a = i / 10 * PI * 2; st.position.set(Math.cos(a) * 0.78, 0.42, Math.sin(a) * 0.78); g.add(st); }
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.4, 6), flowMat({ c1, c2, rep: [1, 2], spd: [0, -3], fres: 0.5, cut: -0.3, fade: [0, 0, 0, 0] })); stick.geometry.translate(0, 0.7, 0); g.add(stick);
      g.position.set(P.x, P.y, P.z); g.rotation.x = 0.5; g.traverse(x => { x.frustumCulled = false; x.renderOrder = 10; }); SC.add(g);
      return { upd: (k, t) => { wood.uniforms.uTime.value = t; stick.material.uniforms.uTime.value = t;
        const hitK = Math.min(1, k / 0.35), sw = hitK < 1 ? -1.2 + hitK * 1.9 : 0.7 - Math.min(1, (k - 0.35) / 0.2) * 1.2;
        stick.position.set(0.55, 0.5, 0); stick.rotation.z = sw; const pop = k > 0.33 && k < 0.5 ? 1.12 : 1;
        g.scale.setScalar(size * Math.min(1, k / 0.12) * pop * (1 - Math.max(0, k - 0.85) / 0.15)); }, end: () => { kill(g); skinT.dispose(); } }; });
  }
  /* ---------- CHIÊU (xếp theo cấp mở: càng về sau càng nhiều lớp, càng hoành tráng) ----------
     Mỗi chiêu nhận bậc rk 1–5: bậc 3 thêm vòng phù văn thứ 2 + hạt; bậc 5 đổi sắc vàng sáng, thêm cột sáng + sóng + rung mạnh (TIER). */
  const SK = {}, META = {};
  const DIR = (F, T) => new V3().subVectors(T, F).setY(0).normalize();
  function rune(P, shape, script, color, size, dur, delay, o) { decal(P, runeTex(shape, script), color, size, dur, delay, Object.assign({ inT: 0.18, grow: true }, o || {})); }
  function TIER(P, rk, col, delay, o) {   // lớp thưởng theo bậc chiêu
    o = o || {};
    if (rk >= 3) { rune(P, o.shape2 || "star", o.script || "latin", col, (o.size || 4) * 1.35, o.dur || 1.2, delay, { mode: "spin", spin: -(o.spin || 1.5), op: 0.7, lift: 0.01 }); sparks(P.clone().setY(0.6), [col, 0xffffff], 30, 4, 0.3, 0.8, delay + 0.1, { up: 2, grav: -2 }); }
    if (rk >= 5) { pillar(P, col, 0xffffff, (o.size || 4) * 0.28, 7, 0.8, delay + 0.05, { speed: 3.5, widen: 0.4, top: 0.6 }); shock(P, 0xffe9a8, (o.size || 4) * 0.9, 0.6, delay + 0.1); shock(P, col, (o.size || 4) * 0.6, 0.5, delay + 0.18);
      emitter(40, i => { const a = i / 40 * PI * 2; return { p: P.clone().add(new V3(Math.cos(a) * 1.5, 0.2, Math.sin(a) * 1.5)), v: new V3(Math.cos(a) * 0.4, R(3, 6), Math.sin(a) * 0.4), t0: delay + R(0, 0.4), life: R(0.6, 1), size: R(0.3, 0.6), col: i % 2 ? 0xffe9a8 : col }; }, { grav: -1, drag: 1 });
      task(delay, 0.01, () => shake(0.15)); }
  }
  const GOLD = rk => rk >= 5;   // bậc 5: chuyển màu vàng sáng (đẹp hơn rõ khi lên bậc)
  /* ---------- 4 CHIÊU KHỞI ĐẦU: mỗi chiêu 4 HÌNH DẠNG (bậc 1 / 4 / 7 / 10) – Lv.1–10 người chơi chỉ có 4 chiêu này nên đổi hình rõ rệt để có cái mà mong ---------- */
  const FORM = rk => rk >= 10 ? 4 : rk >= 7 ? 3 : rk >= 4 ? 2 : 1;
  META.echo_blast = { name: "Echo Blast", lv: 1, who: "Vocara · chữ rune", forms: ["Quả cầu âm thanh", "Cầu kéo vòng sóng + ấn mặt trời", "3 quả cầu xoắn + vòm nổ", "Sao chổi âm thanh từ trời"], desc: "Tụ lực ở tay → cầu âm thanh → nổ. Bậc 4: vòng sóng theo sau, nổ có ấn mặt trời. Bậc 7: 3 quả cầu xoắn vào nhau, vòm nổ. Bậc 10: sao chổi âm thanh khổng lồ lao từ trời xuống." };
  SK.echo_blast = (F, T, rk) => {
    const f = FORM(rk), d = DIR(F, T), A = F.clone().addScaledVector(d, 0.8).setY(1.3), B = T.clone().setY(1.1), c1 = f >= 4 ? 0xffb020 : 0xff6a1a, c2 = f >= 4 ? 0xfff6c0 : 0xffe6a8;
    shadowUnder(F, 3, 0.7, 0); rune(F, f >= 3 ? "sun" : "circle", "runic", f >= 4 ? 0xffd860 : 0xff9a3a, 3 + f * 0.3, 0.8, 0, { mode: "spin", spin: 3 + f });
    emitter(24 + f * 10, i => { const a = rv(1.6); return { p: A.clone().add(a), v: a.clone().multiplyScalar(-3.2), t0: R(0, 0.15), life: 0.28, size: R(0.25, 0.45), col: i % 2 ? 0xffd27a : c1 }; }, { grav: 0, drag: 0 });
    glow(A, 0xffb04a, 1.6 + f * 0.3, 0.25, 0.1, { flash: true });
    let hit;
    if (f < 3) { const fly = 0.38; orbFly(A, B, c1, c2, 1.0 + f * 0.15, fly, 0.18, { arc: 0.4 }); hit = 0.18 + fly;
      if (f >= 2) for (let i = 0; i < 4; i++) task(0.22 + i * 0.07, 0.4, () => { const P = A.clone().lerp(B, (i + 1) / 5); P.y += Math.sin((i + 1) / 5 * PI) * 0.4; const m = mesh(new THREE.RingGeometry(0.5, 0.62, 32), basic(TEX.glow, c2, true, 1), 9); m.position.copy(P); m.quaternion.copy(basisQ(new V3().subVectors(B, A))); SC.add(m);   // vòng sóng âm theo sau quả cầu
        return { upd: k => { m.scale.setScalar(1 + k * 1.4); m.material.opacity = 1 - k; }, end: () => kill(m) }; }); }
    else if (f === 3) { const fly = 0.45; [0, 1, 2].forEach(i => { const off = new V3(Math.cos(i * 2.09) * 1.2, Math.sin(i * 2.09) * 0.6, 0); orbFly(A.clone().add(off), B, c1, c2, 0.9, fly, 0.18 + i * 0.03, { arc: 0.8 + i * 0.3 }); }); hit = 0.18 + fly + 0.06; }
    else { const fly = 0.6, top = F.clone().addScaledVector(d, -4).add(new V3(0, 10, 0)); orbFly(top, B, 0xff8a1a, 0xffffff, 2.4, fly, 0.25, { arc: 0 }); hit = 0.25 + fly;   // sao chổi
      emitter(140, i => { const u = i / 140, p = top.clone().lerp(B, u); return { p: p.add(rv(0.5)), v: rv(1.5).add(new V3(0, 1, 0)), t0: 0.25 + u * fly, life: R(0.4, 0.8), size: R(0.5, 0.9), col: [0xffffff, 0xffd27a, 0xff6a1a][i % 3] }; }, { grav: -1, drag: 1.5 }); }
    shadowUnder(T, 4 + f, 1.0, hit - 0.05); decal(T, TEX.crack, 0xffffff, 3 + f * 0.8, 1.3, hit, { add: false, op: 0.8, ro: 3 });
    glow(B, 0xffffff, 3.5 + f, 0.25, hit, { flash: true }); glow(B, c1, 5 + f * 1.2, 0.4, hit, { flash: true }); shock(T, 0xffb050, 2.8 + f * 0.7, 0.5, hit);
    pillar(T, c1, c2, 0.8 + f * 0.15, 2.6 + f * 0.8, 0.5, hit, { speed: 3, widen: 0.8, top: 1.4 });
    sparks(B, [0xffe0a0, 0xff9a3a, c1], 30 + f * 25, 7 + f, 0.3, 0.6, hit, { up: 1.2 });
    if (f >= 2) { rune(T, "sun", "runic", 0xffb040, 3.6 + f * 0.4, 0.7, hit, { mode: "expand", expand: 0.8, hold: 0.2, grow: false, op: 0.85 }); shock(T, 0xff5a1a, 2 + f * 0.5, 0.45, hit + 0.06); }
    if (f >= 3) { dome(T, 0xff4a10, 0xffe0a0, 2.4 + (f - 3) * 1.4, 0.55, hit); decal(T, TEX.crack, 0xff6a1a, 4 + f, 1.2, hit + 0.05, { op: 0.8, hold: 0.4, ro: 3 }); }   // vết nứt rực lửa
    if (f >= 4) { shock(T, 0xffffff, 6.5, 0.7, hit + 0.12); pillar(T, 0xffb020, 0xffffff, 1.6, 9, 0.8, hit, { speed: 4, widen: 1, top: 1.5 }); sparks(B, [0xffffff, 0xffd860], 80, 12, 0.4, 0.9, hit, { up: 1.6 }); }
    task(hit, 0.01, () => shake(0.12 + f * 0.08));
  };
  META.question_arrow = { name: "Question Arrow", lv: 1, who: "Vocara · chữ Latin", forms: ["1 mũi tên pha lê", "3 mũi tên toả", "Mưa tên + dấu ? rơi", "Lồng dấu ? vàng + sét tím"], desc: "Mũi tên pha lê choáng quái. Bậc 4: 3 mũi tên. Bậc 7: mưa tên từ trời, dấu ? 3D rơi đè. Bậc 10: dấu ? vàng khổng lồ thành lồng, sét tím trói quái." };
  SK.question_arrow = (F, T, rk) => {
    const f = FORM(rk), d = DIR(F, T), A = F.clone().addScaledVector(d, 0.8).setY(1.3), B = T.clone().setY(1.1), side = new V3(-d.z, 0, d.x), cA = 0x7a5cff, cB = f >= 4 ? 0xfff0a0 : 0xd8ccff;
    const fly = 0.32; let hit = fly + 0.05;
    const n = f >= 2 ? 3 : 1; for (let i = 0; i < n; i++) crystalArrow(A.clone().addScaledVector(side, (i - (n - 1) / 2) * 0.9), B, cA, cB, fly, i * 0.05, { size: 1 + f * 0.1, arc: 0.3 });
    if (f >= 3) { for (let i = 0; i < 6 + (f - 3) * 6; i++) { const a = i / (6 + (f - 3) * 6) * PI * 2, P = T.clone().add(new V3(Math.cos(a) * R(0.4, 2.2), 0.2, Math.sin(a) * R(0.4, 2.2))); crystalArrow(P.clone().add(new V3(R(-1, 1), 9, R(-1, 1))), P, cA, cB, 0.35, 0.15 + i * 0.03, { size: 0.9 });
        sparks(P.clone().setY(0.3), [cB, cA], 6, 3, 0.2, 0.3, 0.5 + i * 0.03, { up: 1.5 }); } hit = 0.5; }
    shadowUnder(T, 4 + f * 0.5, 1.2, hit - 0.05);
    glow(B, 0xffffff, 3, 0.25, hit, { flash: true }); glow(B, cA, 4.5 + f * 0.6, 0.4, hit, { flash: true }); shock(T, 0xb39cff, 2.4 + f * 0.5, 0.45, hit);
    sparks(B, [0xffffff, 0xc77dff, cA], 24 + f * 10, 5, 0.22, 0.5, hit, { up: 1.2 });
    rune(T, f >= 4 ? "hex" : "tri", "latin", f >= 4 ? 0xffd860 : 0xb39cff, 3 + f * 0.6, 1.4, hit, { mode: f >= 3 ? "converge" : "static", inT: 0.25, op: 0.9 });
    if (f <= 2) qmark(T.clone().setY(2.6), cA, cB, 0.9 + f * 0.15, 1.2, hit, { spin: 3 });
    if (f === 3) qmark(T.clone().setY(1.0), cA, cB, 1.8, 1.4, 0.3, { drop: true, spin: 0.5 });
    if (f >= 4) { qmark(T.clone().setY(0.6), 0xd89a10, 0xfff6c0, 3.0, 1.6, 0.3, { drop: true, spin: 0.6 });   // dấu ? khổng lồ đè xuống như lồng
      for (let i = 0; i < 5; i++) { const a = i / 5 * PI * 2; bolt(T.clone().add(new V3(Math.cos(a) * 0.4, 3.2, Math.sin(a) * 0.4)), T.clone().add(new V3(Math.cos(a) * 2.2, 0.05, Math.sin(a) * 2.2)), 0xd8a0ff, 0.22, 0.9, 0.55 + i * 0.04, { jag: 0.5 }); }
      shock(T, 0xffe9a8, 5, 0.6, 0.55); }
    for (let i = 0; i < 2 + f; i++) orbitStar(T, cB, 1.0 + f * 0.1, 2.4 + f * 0.25, 1.4, hit + 0.1, i / (2 + f));
    task(hit, 0.01, () => shake(0.1 + f * 0.05));
  };
  function orbitStar(P, color, r, y, dur, delay, ph) {   // sao choáng quay quanh đầu quái
    P = P.clone(); task(delay, dur, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color, blending: ADD, transparent: true, depthWrite: false })); s.renderOrder = 11; SC.add(s);
      return { upd: (k, t) => { const a = ph * PI * 2 + t * 5; s.position.set(P.x + Math.cos(a) * r, y + Math.sin(t * 7 + ph * 6) * 0.1, P.z + Math.sin(a) * r * 0.6); s.scale.setScalar(0.5 + 0.15 * Math.sin(t * 20)); s.material.opacity = 1 - Math.max(0, k - 0.75) / 0.25; }, end: () => kill(s) }; });
  }
  META.harmony_heal = { name: "Harmony Heal", lv: 1, who: "Vocara · chữ Ogham", forms: ["Ấn lục giác thở", "+ 6 cột sáng", "Hoa sen ánh sáng nở", "Cây ánh sáng + lá vàng rơi"], desc: "Hồi máu. Bậc 4: 6 cột sáng. Bậc 7: hoa sen ánh sáng nở dưới chân. Bậc 10: cây ánh sáng mọc lên, lá vàng rơi." };
  SK.harmony_heal = (F, T, rk) => {
    const f = FORM(rk), c = f >= 4 ? 0xffe27a : 0x3fe08a, c2 = f >= 4 ? 0xffffff : 0xe8ffd0;
    shadowUnder(F, 4 + f * 0.6, 1.4 + f * 0.2, 0); rune(F, "hex", "ogham", c, 3.8 + f * 0.4, 1.4 + f * 0.2, 0, { mode: "pulse", rate: 7, amp: 0.12 });
    aura(F, c, c2, 0.85, 2.6 + f * 0.3, 1.2, 0.1);
    if (f >= 2) for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; pillar(F.clone().add(new V3(Math.cos(a) * 1.9, 0, Math.sin(a) * 1.9)), c, 0xfff6c0, 0.14, 2.6 + R(0, 1), 0.9, 0.15 + i * 0.05, { speed: 3.5, top: 0.3, widen: 0 }); }
    if (f >= 3) { lotus(F, f >= 4 ? 0xffc040 : 0xff8ac8, f >= 4 ? 0xfff6c0 : 0xffe0f0, 1.7, 1.8, 0.05); rune(F, "circle", "ogham", 0xff9ad0, 5.6, 1.6, 0.1, { mode: "spin", spin: -0.8, op: 0.6, lift: 0.01 }); }
    if (f >= 4) { lightTree(F.clone().add(new V3(0, 0, -1.2)), 0xffd860, 0xfffbe0, 4.6, 2.4, 0.1); shock(F, 0xfff3a0, 6, 0.8, 0.3); }
    emitter(40 + f * 25, i => { const a = R(0, PI * 2), r = R(0.3, 2.1); return { p: F.clone().add(new V3(Math.cos(a) * r, R(0, 0.4), Math.sin(a) * r)), v: new V3(Math.cos(a + 1.6) * 0.6, R(1.5, 3.2), Math.sin(a + 1.6) * 0.6), t0: R(0.1, 0.9), life: R(0.7, 1.2), size: R(0.25, 0.5), col: [0x8dffb5, 0xfff3a0, 0xffffff][i % 3] }; }, { grav: 0.4, drag: 0.6 });
    glow(F.clone().setY(1.3), 0xbfffd8, 3 + f * 0.5, 0.6, 0.3, {});
  };
  const LAST = {};   // lần gọi trước của mỗi chiêu (chiêu nhiều đòn gọi hiệu ứng cho từng đòn)
  META.drum_roll = { name: "Drum Roll", lv: 1, who: "Vocara · chữ Latin", forms: ["Vệt chém lửa mỗi nhịp", "Trống taiko trên đầu quái", "Trống lớn + chém chữ X + cột lửa", "Vòng trống lửa quanh người + trống vàng"], desc: "Mỗi nhịp 1 đòn. Bậc 4: trống taiko hiện trên quái, dùi lửa đập xuống. Bậc 7: chém chữ X, cột lửa. Bậc 10: 6 trống lửa quanh người đánh theo nhịp, trống vàng khổng lồ." };
  SK.drum_roll = (F, T, rk) => {
    const f = FORM(rk), now = performance.now(), first = !LAST.drum_roll || now - LAST.drum_roll > 700; LAST.drum_roll = now;
    const B = T.clone().setY(1.0), c1 = f >= 4 ? 0xffb020 : 0xff3a0a, c2 = 0xffd27a;
    if (first && f >= 4) { for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; drumHit(F.clone().add(new V3(Math.cos(a) * 2.6, 0.9, Math.sin(a) * 2.6)), c1, c2, 0.8, 1.4, i * 0.1); }
      rune(F, "sun", "latin", 0xffb020, 6.5, 1.4, 0, { mode: "spin", spin: 2 }); tornado(F, 0xff6a0a, 0xffe0a0, 1.2, 3, 1.2, 0.2); }
    const yaw = R(0, 6);
    slash(B.clone().setY(0), c1, c2, 1.9 + f * 0.25, 1.3, -PI * 0.85, PI * 0.25, 0.55, yaw, 0.42, 0, 1.1);
    if (f >= 3) slash(B.clone().setY(0), c1, 0xffffff, 2.1, 1.2, -PI * 0.85, PI * 0.25, -0.55, yaw + 1.6, 0.42, 0.05, 1.2);   // chém chữ X
    if (f >= 2) drumHit(T.clone().setY(2.6), c1, c2, f >= 4 ? 1.6 : 0.9 + f * 0.15, 0.55, 0);
    glow(B, 0xffe0a0, 2 + f * 0.6, 0.2, 0.18, { flash: true }); shock(T, 0xffa040, 1.4 + f * 0.4, 0.35, 0.2);
    sparks(B, [0xffe0a0, 0xff8a2a, c1], 14 + f * 8, 6 + f, 0.2, 0.45, 0.2, { up: 1.2 });
    if (f >= 3) pillar(T, c1, c2, 0.6 + f * 0.1, 3 + f * 0.5, 0.4, 0.2, { speed: 4, widen: 0.6, top: 1.2 });
    task(0.2, 0.01, () => shake(0.06 + f * 0.04));
  };

  META.basic_slash = { name: "Basic Slash", lv: 0, who: "Vocara · chữ Latin", desc: "Đòn đánh thường: vệt kiếm khí + tia lửa." };
  SK.basic_slash = (F, T, rk) => {
    const d = DIR(F, T), yaw = Math.atan2(d.x, d.z), P = F.clone().addScaledVector(d, 1.2), c = GOLD(rk) ? 0xffe27a : 0xff9a2a;
    slash(P, c, 0xffffff, 2.0, 1.2, -PI * 0.8, PI * 0.2, 0.45, -yaw, 0.36, 0, 1.2);
    if (rk >= 3) slash(P, 0xffd27a, 0xffffff, 1.6, 0.6, -PI * 0.7, PI * 0.1, 0.3, -yaw + 0.3, 0.32, 0.05, 1.4);
    sparks(T.clone().setY(1), [0xffffff, 0xffd27a, c], 18 + rk * 4, 7, 0.28, 0.45, 0.14, { up: 1 });
    glow(T.clone().setY(1), 0xfff0c0, 2.4, 0.22, 0.14, { flash: true }); if (rk >= 5) shock(T, 0xffd27a, 1.8, 0.35, 0.14);
  };
  META.typeset_rain = { name: "Typeset Rain", lv: 16, who: "Gutenberg · chữ hình nêm", desc: "Sách phép nhỏ mở trên đầu người chơi, từng trang sách phóng vào quái nổ liên tiếp (bậc càng cao càng nhiều trang), rồi ấn phù văn khoá chân quái." };
  SK.typeset_rain = (F, T, rk) => {
    const c = GOLD(rk) ? 0xffd860 : 0x6fb8ff, B = T.clone().setY(1.1), n = 3 + Math.ceil(rk / 2);
    rune(F, "seal", "cuneiform", c, 3, 0.5 + n * 0.16 + 0.4, 0, { mode: "spin", spin: 1.5, op: 0.8 });
    const first = magicBook(F, T, "cuneiform", c, n, 0.75 + n * 0.16, 0, null);
    for (let i = 0; i < n; i++) { const tt = first + i * 0.16, P = T.clone().add(new V3(R(-0.6, 0.6), 0, R(-0.6, 0.6)));   // mỗi trang: nổ bùm
      glow(P.clone().setY(1.1), 0xffffff, 2.6, 0.2, tt, { flash: true }); glow(P.clone().setY(1.1), c, 3.6, 0.32, tt, { flash: true });
      shock(P, c, 1.6, 0.35, tt); sparks(P.clone().setY(1.1), [0xffffff, c, 0xfff0c0], 22, 6, 0.24, 0.45, tt, { up: 1.2 }); task(tt, 0.01, () => shake(0.12)); }
    const end = first + (n - 1) * 0.16 + 0.1;
    shadowUnder(T, 5.5, 1.4, end - 0.1); rune(T, "seal", "cuneiform", c, 5, 1.3, end, { mode: "converge", inT: 0.25 });   // ấn khoá chân sau loạt nổ
    pillar(T, c, 0xffffff, 1.2, 2.6, 0.8, end, { speed: 1.5, widen: 0, top: 0.25, cut: 0.3 });
    TIER(T, rk, c, end, { script: "cuneiform", shape2: "circle", size: 4.4 });
  };

  META.ac_storm = { name: "AC Storm", lv: 40, who: "Nikola Tesla · chữ rune", desc: "Ấn sét đứng im dưới quái → 3 tia sét + cột điện → tia điện toả trên đất, vết nứt." };
  SK.ac_storm = (F, T, rk) => {
    const B = T.clone().setY(1), c = GOLD(rk) ? 0xffe27a : 0x7cc8ff;
    shadowUnder(T, 5, 1.2, 0); rune(T, "sun", "runic", c, 4.6, 1.2, 0, { mode: "static", inT: 0.25, flicker: true });
    glow(F.clone().setY(1.6), 0x9ad8ff, 1.5, 0.3, 0, { flash: true });
    const nb = 2 + Math.ceil(rk / 2);
    for (let i = 0; i < nb; i++) { const dl = i * 0.06, top = T.clone().add(new V3(R(-1.5, 1.5), 12, R(-1.5, 1.5))), end = T.clone().add(new V3((i - 1) * 0.5, 0.1, R(-0.4, 0.4)));
      bolt(top, end, i ? 0x8fd6ff : 0xffffff, i ? 0.35 : 0.55, 0.45, 0.28 + dl, { jag: 0.9 }); bolt(top, end, GOLD(rk) ? 0xffb030 : 0x3a8bff, 1.1, 0.4, 0.28 + dl, { jag: 0.9 }); }
    const hit = 0.3;
    glow(B, 0xffffff, 5, 0.3, hit, { flash: true }); glow(B, GOLD(rk) ? 0xffb040 : 0x4aa8ff, 8, 0.5, hit, { flash: true });
    pillar(T, GOLD(rk) ? 0xffb030 : 0x2f7bff, 0xd8f0ff, 0.9, 8, 0.5, hit, { speed: 5, widen: 0.3, top: 0.5 });
    shock(T, 0x9ad8ff, 4, 0.5, hit); decal(T, TEX.crack, 0xffffff, 3.6, 1.2, hit, { add: false, op: 0.7, ro: 3 });
    for (let i = 0; i < 3 + rk; i++) { const a = i / (3 + rk) * PI * 2 + R(0, 1), e = T.clone().add(new V3(Math.cos(a) * 2.4, 0.1, Math.sin(a) * 2.4)); bolt(B, e, 0xbfe6ff, 0.18, 0.3, hit + 0.05 + i * 0.03, { jag: 0.5 }); }
    sparks(B, [0xffffff, 0x9ad8ff, c], 50 + rk * 10, 10, 0.3, 0.6, hit, { up: 1.4, drag: 3 });
    TIER(T, rk, c, hit, { script: "runic", shape2: "star", size: 4.4 }); task(hit, 0.01, () => shake(0.3));
  };
  META.bristle_cyclone = { name: "Bristle Cyclone", lv: 11, who: "William Addis · chữ Hy Lạp", desc: "(màu bọt trắng xanh) Ấn sao gai xoay tít → 3 vệt kiếm lửa quét quanh người → lốc xoáy lửa, vết cháy, tàn lửa bay." };
  SK.bristle_cyclone = (F, T, rk) => {
    const c1 = GOLD(rk) ? 0x9ae8ff : 0x2fb8e8;
    shadowUnder(F, 7, 1.4, 0); rune(F, "star", "greek", 0x7ad8ff, 5.5, 1.3, 0, { mode: "spin", spin: 6 });
    [0, 0.12, 0.24].forEach((dl, i) => slash(F, c1, 0xffffff, 2.6 + i * 0.5, 1.1, 0, PI * 1.6, R(-0.25, 0.25), i * 2.1, 0.35, dl, 1.0 + i * 0.15));
    tornado(F, c1, 0xe8fbff, 1.6, 4.2, 1.1, 0.2); pillar(F, 0x5fd0ff, 0xcff4ff, 2.4, 1.6, 0.8, 0.25, { speed: 2.5, widen: 0.6, top: 1.3, cut: 0.25 });
    shock(F, 0xbff0ff, 5, 0.6, 0.3);
    emitter(80 + rk * 20, i => { const a = R(0, PI * 2), r = R(0.5, 3); return { p: F.clone().add(new V3(Math.cos(a) * r, R(0, 1), Math.sin(a) * r)), v: new V3(-Math.sin(a) * 3, R(2, 5), Math.cos(a) * 3), t0: R(0.15, 0.9), life: R(0.5, 0.9), size: R(0.2, 0.45), col: [0xe8fbff, 0x8fe0ff, c1][i % 3] }; }, { grav: 1, drag: 1.5 });
    TIER(F, rk, 0x8fe0ff, 0.25, { script: "greek", shape2: "sun", size: 5, spin: 3 }); task(0.3, 0.01, () => shake(0.25));
  };
  META.rune_sword = { name: "Rune Sword", lv: 70, who: "Odin · chữ rune (tuyệt chiêu)", desc: "Thanh kiếm khổng lồ khắc rune hiện trên trời, rơi cắm xuống quái → ấn toả ra, nứt đất, cột sáng, tia lửa." };
  SK.rune_sword = (F, T, rk) => {
    const c1 = GOLD(rk) ? 0xffc040 : 0x5fa8ff, c2 = GOLD(rk) ? 0xfff6d0 : 0xe0f4ff, B = T.clone().setY(1);
    shadowUnder(T, 6, 1.9, 0); rune(T, "sun", "runic", c1, 5.5, 1.0, 0, { mode: "spin", spin: 2, op: 0.85 });
    giantSword(T, c1, c2, 1.9, 0.05, null);
    const hit = 0.05 + 1.9 * 0.32;
    rune(T, "sun", "runic", 0xffffff, 5.5, 0.8, hit, { mode: "expand", expand: 1.2, hold: 0.1, grow: false, op: 0.8, lift: 0.01 });
    decal(T, TEX.crack, 0xffffff, 6.5, 1.4, hit, { add: false, op: 0.95, ro: 3 });
    glow(B, 0xffffff, 6, 0.3, hit, { flash: true }); glow(B, c1, 9, 0.5, hit, { flash: true });
    shock(T, c2, 5.5, 0.6, hit); shock(T, c1, 3.5, 0.5, hit + 0.08);
    pillar(T, c1, c2, 1.2, 7, 0.7, hit, { speed: 4, widen: 0.8, top: 0.7 });
    sparks(B, [0xffffff, c2, c1], 90 + rk * 15, 12, 0.35, 0.8, hit, { up: 1.5, drag: 2 });
    TIER(T, rk, c1, hit, { script: "runic", shape2: "seal", size: 5 }); task(hit, 0.01, () => shake(0.45));
  };
  META.dragon_roar = { name: "Dragon Roar", lv: 80, who: "Thương Hiệt · chữ Hán · 2 vòng xoay ngược + ấn sao toả ra", desc: "TUYỆT CHIÊU: rồng vàng (đầu, sừng, râu, bờm lửa, 4 chân có vuốt) bay xoắn ốc rồi lao xuống quái → nổ lớn." };
  SK.dragon_roar = (F, T, rk) => {
    const fire = GOLD(rk) ? [0xff6a0a, 0xfff0a0] : [0xff3a0a, 0xffd27a];
    shadowUnder(F, 7, 2.6, 0); rune(F, "circle", "hanzi", 0xffb040, 7, 2.4, 0, { mode: "spin", spin: 1, inT: 0.35 });
    rune(F, "star", "hanzi", 0xff4a20, 4.6, 2.3, 0.1, { mode: "spin", spin: -2, lift: 0.01, op: 0.85 });
    glow(F.clone().setY(1.2), 0xffc060, 4, 0.6, 0, {});
    const dur = 1.9; dragon(F, T, dur, 0.15, { c1: GOLD(rk) ? 0xc8780a : 0xa8300c, c2: GOLD(rk) ? 0xfff2a0 : 0xffc23a, fire });   // bậc 1–4: rồng đỏ vảy vàng · bậc 5: rồng vàng kim
    const hit = 0.15 + dur * 0.92;
    shadowUnder(T, 8, 1.4, hit - 0.1); decal(T, TEX.crack, 0xffffff, 7, 1.6, hit, { add: false, op: 0.9, ro: 3 });
    rune(T, "star", "hanzi", 0xffd860, 6, 1.0, hit, { mode: "expand", expand: 0.8, hold: 0.2, grow: false });
    glow(T.clone().setY(1.2), 0xffffff, 7, 0.3, hit, { flash: true }); glow(T.clone().setY(1.2), 0xff6a1a, 11, 0.6, hit, { flash: true });
    pillar(T, 0xff3a0a, 0xffe08a, 1.6, 9, 0.8, hit, { speed: 4, widen: 1, top: 1.6 });
    shock(T, 0xffc060, 7, 0.7, hit); shock(T, 0xff4a20, 5, 0.6, hit + 0.08); shock(T, 0xffffff, 3, 0.4, hit + 0.15);
    sparks(T.clone().setY(1), [0xffffff, 0xffd27a, 0xff6a1a, 0xff2a10], 160, 13, 0.45, 1.0, hit, { up: 1.5, drag: 1.8 });
    TIER(T, Math.max(rk, 3), 0xffc060, hit, { script: "hanzi", shape2: "sun", size: 6 }); task(hit, 0.01, () => shake(0.6));
  };
  /* ---------- HIỆU ỨNG CHUNG cho chiêu danh nhân chưa có hiệu ứng riêng: theo nhánh + loại chiêu, cũng 4 hình dạng theo bậc ---------- */
  const PALS = { power: [0xff6a1a, 0xffe0a0], control: [0x5f7bff, 0xd8e4ff], harmony: [0x3fe08a, 0xe8ffd0], rhythm: [0xff3a0a, 0xffd27a] };
  const SHAPES = ["circle", "star", "hex", "seal", "sun", "tri"], SCRIPTS = ["latin", "greek", "runic", "ogham", "hanzi", "cuneiform", "hiero"];
  const hash = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  function generic(id, F, T, rk, o) {
    const f = FORM(rk), br = o.branch || "power", kind = o.kind || "single", rad = o.radius || 3, h = hash(id), shp = SHAPES[h % 6], scr = SCRIPTS[(h >> 3) % 7];
    const gold = f >= 4, c1 = gold ? 0xffb020 : PALS[br][0], c2 = gold ? 0xfff6c0 : PALS[br][1], B = T.clone().setY(1.1), d = DIR(F, T), A = F.clone().addScaledVector(d, 0.8).setY(1.3);
    const now = performance.now(), first = !LAST[id] || now - LAST[id] > 700; LAST[id] = now;
    if (kind === "self") {
      shadowUnder(F, 4 + f * 0.5, 1.4, 0); rune(F, shp, scr, c1, 3.6 + f * 0.5, 1.4, 0, { mode: "pulse", rate: 6, amp: 0.1 }); aura(F, c1, c2, 0.85, 2.6 + f * 0.3, 1.2, 0.1);
      if (f >= 2) for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; pillar(F.clone().add(new V3(Math.cos(a) * 1.9, 0, Math.sin(a) * 1.9)), c1, 0xffffff, 0.14, 2.4 + R(0, 1), 0.9, 0.15 + i * 0.05, { speed: 3.5, top: 0.3, widen: 0 }); }
      if (f >= 3) { lotus(F, c1, c2, 1.5, 1.6, 0.05); rune(F, SHAPES[(h + 2) % 6], scr, c2, 5.4, 1.5, 0.1, { mode: "spin", spin: -0.8, op: 0.6, lift: 0.01 }); }
      if (f >= 4) { dome(F, c1, c2, 3.2, 1.0, 0.2); shock(F, 0xfff3a0, 6, 0.8, 0.3); }
      emitter(40 + f * 25, i => { const a = R(0, PI * 2), r = R(0.3, 2.1); return { p: F.clone().add(new V3(Math.cos(a) * r, R(0, 0.4), Math.sin(a) * r)), v: new V3(0, R(1.5, 3.2), 0), t0: R(0.1, 0.9), life: R(0.7, 1.2), size: R(0.25, 0.5), col: [c1, c2, 0xffffff][i % 3] }; }, { grav: 0.4, drag: 0.6 });
      return;
    }
    if (kind === "aoe") {
      shadowUnder(F, rad * 2, 1.2, 0); rune(F, shp, scr, c1, rad * 1.6, 1.2, 0, { mode: (h & 1) ? "expand" : "spin", spin: 2, expand: 0.3, op: 0.9 });
      for (let i = 0; i < 1 + f; i++) shock(F, i % 2 ? c2 : c1, rad * (0.7 + i * 0.25), 0.55, 0.15 + i * 0.1);
      if (br === "control" && f >= 2) shards(F, c1, 8 + f * 3, rad * 0.9, 1.6 + f * 0.3, 1.3, 0.2, { c2, ring: true });
      if (br !== "control" && f >= 3) tornado(F, c1, c2, 1.3 + f * 0.2, 3 + f * 0.4, 1.0, 0.15);
      if (f >= 2) for (let i = 0; i < 4 + f; i++) { const a = i / (4 + f) * PI * 2; pillar(F.clone().add(new V3(Math.cos(a) * rad * 0.8, 0, Math.sin(a) * rad * 0.8)), c1, c2, 0.25, 2 + f * 0.6, 0.6, 0.2 + i * 0.03, { speed: 3, top: 0.6, widen: 0.2 }); }
      sparks(F.clone().setY(0.8), [c1, c2, 0xffffff], 40 + f * 25, 8 + f, 0.3, 0.7, 0.2, { up: 1 });
      if (f >= 4) dome(F, c1, c2, rad * 1.2, 0.7, 0.25);
      task(0.2, 0.01, () => shake(0.1 + f * 0.06)); return;
    }
    if (kind === "dash") {
      emitter(80, i => ({ p: F.clone().lerp(T, i / 80).setY(R(0.3, 1.6)).add(rv(0.3)), v: rv(1).setY(R(0.5, 2)), t0: i / 80 * 0.25, life: R(0.3, 0.6), size: R(0.3, 0.6), col: [c1, c2][i % 2] }), { grav: -2, drag: 2 });
      decal(F.clone().lerp(T, 0.5), TEX.crack, 0xffffff, 2.5, 1, 0.15, { add: false, op: 0.6, ro: 3 });
      slash(T, c1, c2, 1.8 + f * 0.2, 1.1, -PI * 0.8, PI * 0.2, 0.4, -Math.atan2(d.x, d.z), 0.3, 0.2, 1.1);
    }
    if (kind === "single") {
      if (br === "control") crystalArrow(A, B, c1, c2, 0.32, 0, { size: 1 + f * 0.1, arc: 0.3 }); else orbFly(A, B, c1, c2, 1 + f * 0.15, 0.35, 0, { arc: 0.4 });
      if (f >= 4) bolt(T.clone().add(new V3(0, 12, 0)), T.clone().setY(0.1), 0xffffff, 0.6, 0.4, 0.3, { jag: 0.8 });
    }
    if (kind === "multi") {
      if (br === "rhythm" || br === "power") slash(T, c1, c2, 1.3 + f * 0.2, 0.9, -PI * 0.8, PI * 0.2, R(-0.5, 0.5), R(0, 6), 0.28, 0, 1.1);
      else bolt(A, B, c2, 0.25 + f * 0.05, 0.25, 0, { jag: 0.4 });
      if (first && f >= 3) rune(F, shp, scr, c1, 4, 1.2, 0, { mode: "spin", spin: 3, op: 0.8 });
    }
    const hit = kind === "multi" ? 0.15 : kind === "dash" ? 0.25 : kind === "zone" ? 0.2 : 0.36, zr = kind === "zone" ? rad : 1.3;
    if (kind === "zone") { rune(T, shp, scr, c1, zr * 1.8, 1.2, 0, { mode: (h & 2) ? "converge" : "static", inT: 0.2 }); if (br === "control" && f >= 2) shards(T, c1, 6 + f * 2, zr * 0.8, 1.6 + f * 0.3, 1.3, 0.2, { c2 }); }
    shadowUnder(T, zr * 2 + f * 0.5, 1.0, hit - 0.05);
    glow(B, 0xffffff, 2.5 + f * 0.7, 0.22, hit, { flash: true }); glow(B, c1, 3.5 + f, 0.4, hit, { flash: true }); shock(T, c2, zr * (0.8 + f * 0.2), 0.45, hit);
    sparks(B, [c1, c2, 0xffffff], 20 + f * 15, 6 + f, 0.25, 0.55, hit, { up: 1.2 });
    if (f >= 2) rune(T, SHAPES[(h + 1) % 6], scr, c2, zr * 1.4 + 1, 0.7, hit, { mode: "expand", expand: 0.7, hold: 0.2, grow: false, op: 0.8, lift: 0.01 });
    if (f >= 3) { pillar(T, c1, c2, 0.6 + zr * 0.2, 3 + f, 0.5, hit, { speed: 3.5, widen: 0.7, top: 1.3 }); dome(T, c1, c2, zr * 0.9, 0.5, hit); }
    if (f >= 4) { shock(T, 0xffffff, zr * 2.2, 0.6, hit + 0.1); sparks(B, [0xffffff, 0xffd860], 60, 11, 0.35, 0.8, hit, { up: 1.5 }); }
    task(hit, 0.01, () => shake(0.08 + f * 0.06));
  }
  // vài chiêu danh nhân dùng hiệu ứng chung (để xem trong sổ tay)
  [["ladys_lamp", "Lady's Lamp", 12, "Florence Nightingale", { kind: "self", branch: "harmony" }], ["camera_obscura", "Camera Obscura", 19, "Nicéphore Niépce", { kind: "zone", branch: "control", radius: 4 }],
   ["gravity_crush", "Gravity Crush", 14, "Isaac Newton", { kind: "zone", branch: "power", radius: 3 }], ["prism_ray", "Prism Ray", 14, "Isaac Newton", { kind: "aoe", branch: "rhythm", radius: 6 }],
   ["tesla_coil", "Tesla Coil", 40, "Nikola Tesla", { kind: "multi", branch: "rhythm" }], ["absolute_chill", "Absolute Chill", 42, "Willis Carrier", { kind: "aoe", branch: "control", radius: 6 }]]
   .forEach(([id, name, lv, who, g]) => META[id] = { name, lv, who: who + " · hiệu ứng chung (chờ làm riêng)", g, desc: "Hiệu ứng chung theo nhánh + loại chiêu, cũng đổi hình ở bậc 4 / 7 / 10." });
  const LEGACY = { typeset_rain: 1, ac_storm: 1, bristle_cyclone: 1, rune_sword: 1, dragon_roar: 1, basic_slash: 1 };   // hiệu ứng viết theo thang 5 bậc cũ
  api.ids = Object.keys(META);
  api.meta = META;
  api.names = {}; api.ids.forEach(id => api.names[id] = META[id].name);
  api.form = FORM;
  api.setup = (scene, camera, renderer) => { SC = MAIN_SC = scene; CAM = camera; REN = renderer; if (!ready) { makeTextures(); ready = true; } };
  api.ready = () => ready;
  api.update = update;
  /* cast(id, từ, tới, bậc 1–10, { kind, branch, radius, scene, camera }) – chiêu chưa có hiệu ứng riêng dùng hiệu ứng chung theo nhánh + loại */
  api.cast = (id, from, to, rank, o) => {
    if (!ready) return; o = o || {}; const sc0 = SC, cam0 = CAM; if (o.scene) { SC = o.scene; CAM = o.camera || CAM; }
    try { const g = Object.assign({}, (META[id] || {}).g, o), F = from.clone().setY(0), r = Math.max(1, Math.min(10, rank || 1));
      const Tt = to ? to.clone().setY(0) : (g.kind === "aoe" || g.kind === "self" ? F.clone() : F.clone().add(new V3(0, 0, -6)));
      if (SK[id]) SK[id](F, Tt, LEGACY[id] ? [0, 1, 3, 4, 5][FORM(r)] : r); else generic(id, F, Tt, r, g); }
    catch (e) {} finally { SC = sc0; CAM = cam0; }
  };
  api.clear = () => { TASKS.forEach(T => { if (T.h && T.h.end) T.h.end(); }); TASKS.length = 0; };
  api._tasks = () => TASKS.length;
  return api;
})();
