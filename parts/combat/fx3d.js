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
  let CLOCK = 10;   /* đồng hồ riêng của hiệu ứng (giây) – nhận biết đòn đầu của chiêu nhiều đòn, không lệch khi máy chậm */
  const CLOCK_MS = () => CLOCK * 1000;
  function update(dt) {
    if (!ready) return; dt = Math.min(dt, 0.05); CLOCK += dt;
    if (REN && CAM && CAM.projectionMatrix) { const s = new THREE.Vector2(); REN.getDrawingBufferSize(s); scale = s.y * CAM.projectionMatrix.elements[5] * 0.5; }
    const sc0 = SC, cam0 = CAM;
    for (let i = TASKS.length - 1; i >= 0; i--) {
      const T = TASKS[i]; T.t += dt; if (T.t < 0) continue;
      SC = T.sc; CAM = T.cam;
      try { if (!T.h) T.h = T.setup() || {};
        const k = Math.min(1, T.t / T.dur); if (T.h.upd) T.h.upd(k, T.t, dt);
        if (k >= 1) { if (T.h.end) T.h.end(); TASKS.splice(i, 1); } } catch (e) { if (window.__fxdebug) console.error("FX3D task", e); TASKS.splice(i, 1); }   // lỗi 1 hiệu ứng không làm hỏng game
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
  function featherTex() { return TEX.feather || (TEX.feather = cvTex(64, (g, n) => { g.translate(n / 2, n); const gr = g.createLinearGradient(0, 0, 0, -n); gr.addColorStop(0, "rgba(255,255,255,.6)"); gr.addColorStop(0.5, "#ffffff"); gr.addColorStop(1, "rgba(255,255,255,.9)"); g.fillStyle = gr;
    g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(-n * 0.42, -n * 0.55, 0, -n); g.quadraticCurveTo(n * 0.42, -n * 0.55, 0, 0); g.fill(); g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -n * 0.95); g.stroke();
    g.fillStyle = "rgba(20,40,120,.55)"; g.beginPath(); g.ellipse(0, -n * 0.78, n * 0.1, n * 0.12, 0, 0, PI * 2); g.fill(); })); }   /* lông vũ: thân trắng (tô màu theo từng lông), có mắt lông */
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
      const NF = o.feathers ? 34 : 0, featT = NF ? featherTex() : null, feathers = NF ? new THREE.InstancedMesh(new THREE.PlaneGeometry(0.42, 1.5).translate(0, 0.7, 0), new THREE.MeshBasicMaterial({ map: featT, transparent: true, side: THREE.DoubleSide, depthWrite: false }), NF * 2) : null;   /* rắn lông vũ: 2 hàng lông dọc thân */
      if (feathers) { feathers.frustumCulled = false; feathers.renderOrder = 10; const cc = new THREE.Color(); for (let q = 0; q < NF * 2; q++) feathers.setColorAt(q, cc.set(o.feathers[q % o.feathers.length])); SC.add(feathers); }
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
        const h1 = add(new THREE.CylinderGeometry(0.04, 0.09, 0.8, 5).translate(0, 0.4, 0), hornMat, sx * 0.22, 0.38, -0.05); h1.rotation.set(-1.0, 0, -sx * 0.35); h1.visible = !o.feathers;   // sừng gốc
        const h2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.04, 0.6, 5).translate(0, 0.3, 0), hornMat); h2.position.set(0, 0.78, 0); h2.rotation.x = -0.6; h1.add(h2);   // sừng ngọn cong
        const wc = new THREE.CatmullRomCurve3([new V3(sx * 0.3, -0.05, 1.0), new V3(sx * 0.9, -0.25, 0.6), new V3(sx * 1.5, 0.05, -0.1), new V3(sx * 1.9, -0.2, -0.8)]);
        add(new THREE.TubeGeometry(wc, 16, 0.03, 4), hornMat, 0, 0, 0);   // râu dài
        for (let k = 0; k < 4; k++) { const mn = add(new THREE.ConeGeometry(0.16, 0.9, 5).translate(0, 0.45, 0), fireMat, sx * (0.25 + k * 0.08), 0.1 + k * 0.08, -0.35 - k * 0.12); mn.rotation.set(-1.9 + k * 0.1, 0, sx * (0.5 + k * 0.15)); } });   // bờm lửa
      if (o.feathers) for (let q = 0; q < 11; q++) { const a = (q / 10 - 0.5) * PI * 1.2, fm = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 1.7).translate(0, 0.85, 0), new THREE.MeshBasicMaterial({ map: featherTex(), color: o.feathers[q % o.feathers.length], transparent: true, side: THREE.DoubleSide, depthWrite: false })); fm.position.set(0, 0.35, -0.25); fm.rotation.set(-0.9, 0, a); head.add(fm); }   /* mào lông quetzal */
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
          dum.quaternion.setFromUnitVectors(new V3(0, -1, 0), dir); dum.scale.setScalar(o.feathers ? 0 : fade); dum.updateMatrix(); legs.setMatrixAt(li, dum.matrix);
          const foot = f.p.clone().addScaledVector(f.s, sx * f.r * 0.8).addScaledVector(f.u, -f.r * 0.2).addScaledVector(dir, 0.7);
          for (let c = 0; c < 3; c++) { dum.position.copy(foot); const cd = dir.clone().addScaledVector(f.s, (c - 1) * 0.5).addScaledVector(f.t, 0.4).normalize(); dum.quaternion.setFromUnitVectors(new V3(0, -1, 0), cd); dum.updateMatrix(); claws.setMatrixAt(li * 3 + c, dum.matrix); } });
        legs.instanceMatrix.needsUpdate = true; claws.instanceMatrix.needsUpdate = true;
        if (feathers) { for (let q = 0; q < NF; q++) { const f = frames[2 + Math.floor(q * (N - 6) / NF)], fl = Math.sin(t * 8 - q * 0.5) * 0.35; [-1, 1].forEach((sx, si) => { const dir = tmp.copy(f.s).multiplyScalar(sx).addScaledVector(f.t, -0.75).addScaledVector(f.u, 0.35 + fl).normalize();
            dum.position.copy(f.p).addScaledVector(f.s, sx * f.r * 0.7).addScaledVector(f.u, f.r * 0.3); dum.quaternion.setFromUnitVectors(new V3(0, 1, 0), dir); dum.scale.setScalar((0.5 + f.r * 1.4) * fade); dum.updateMatrix(); feathers.setMatrixAt(q * 2 + si, dum.matrix); }); }
          feathers.instanceMatrix.needsUpdate = true; feathers.material.opacity = fade; }
        const tf = frames[N - 1], tailOn = tf.p.distanceTo(frames[0].p) > LEN * 0.45 ? fade : 0;   // đuôi lửa chỉ hiện khi thân đã duỗi ra (lúc đầu thân còn cuộn)
        for (let c = 0; c < 3; c++) { dum.position.copy(tf.p); dum.quaternion.copy(basisQ(tmp.copy(tf.t).multiplyScalar(-1).addScaledVector(tf.u, (c - 1) * 0.7), tf.s)); dum.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new V3(1, 0, 0), PI / 2)); dum.scale.setScalar(tailOn); dum.updateMatrix(); tailF.setMatrixAt(c, dum.matrix); }
        tailF.instanceMatrix.needsUpdate = true;
        const f0 = frames[0]; head.position.copy(f0.p).addScaledVector(f0.t, 0.35); head.quaternion.copy(basisQ(f0.t, f0.u)); head.scale.setScalar(1.5 * fade);
        jaw.rotation.x = 0.25 + Math.abs(Math.sin(t * 5)) * 0.35; mouth.material.opacity = 0.6 + Math.sin(t * 20) * 0.3;
      }, end: () => { [body, spikes, legs, claws, tailF, head].forEach(kill); if (feathers) kill(feathers); } };
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

  META.basic_slash = { name: "Basic Slash", lv: 0, who: "Vocara · chữ Latin", desc: "Đòn đánh thường: vệt kiếm khí + tia lửa." };
  SK.basic_slash = (F, T, rk) => {
    const d = DIR(F, T), yaw = Math.atan2(d.x, d.z), P = F.clone().addScaledVector(d, 1.2), c = GOLD(rk) ? 0xffe27a : 0xff9a2a;
    slash(P, c, 0xffffff, 2.0, 1.2, -PI * 0.8, PI * 0.2, 0.45, -yaw, 0.36, 0, 1.2);
    if (rk >= 3) slash(P, 0xffd27a, 0xffffff, 1.6, 0.6, -PI * 0.7, PI * 0.1, 0.3, -yaw + 0.3, 0.32, 0.05, 1.4);
    sparks(T.clone().setY(1), [0xffffff, 0xffd27a, c], 18 + rk * 4, 7, 0.28, 0.45, 0.14, { up: 1 });
    glow(T.clone().setY(1), 0xfff0c0, 2.4, 0.22, 0.14, { flash: true }); if (rk >= 5) shock(T, 0xffd27a, 1.8, 0.35, 0.14);
  };

  /* ---------- HIỆU ỨNG CHUNG cho chiêu danh nhân chưa có hiệu ứng riêng: theo nhánh + loại chiêu, cũng 4 hình dạng theo bậc ---------- */
  const PALS = { power: [0xff6a1a, 0xffe0a0], control: [0x5f7bff, 0xd8e4ff], harmony: [0x3fe08a, 0xe8ffd0], rhythm: [0xff3a0a, 0xffd27a] };
  const SHAPES = ["circle", "star", "hex", "seal", "sun", "tri"], SCRIPTS = ["latin", "greek", "runic", "ogham", "hanzi", "cuneiform", "hiero"];
  const hash = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  function generic(id, F, T, rk, o) {
    const f = FORM(rk), br = o.branch || "power", kind = o.kind || "single", rad = o.radius || 3, h = hash(id), shp = SHAPES[h % 6], scr = SCRIPTS[(h >> 3) % 7];
    const gold = f >= 4, c1 = gold ? 0xffb020 : PALS[br][0], c2 = gold ? 0xfff6c0 : PALS[br][1], B = T.clone().setY(1.1), d = DIR(F, T), A = F.clone().addScaledVector(d, 0.8).setY(1.3);
    const now = CLOCK_MS(), first = !LAST[id] || now - LAST[id] > 700; LAST[id] = now;
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
  /* ---------- CHƯƠNG 1 (Lv.10–20): hiệu ứng riêng đúng mô tả trong sổ tay, mỗi chiêu 4 hình dạng ---------- */
  /* ================= CHƯƠNG 1 (Lv.10–20): hiệu ứng riêng đúng mô tả trong sổ tay, mỗi chiêu 4 hình (bậc 1/4/7/10) ================= */
  const pop = (k, a, b) => Math.min(1, k / (a || 0.1)) * (1 - Math.max(0, k - (b || 0.85)) / (1 - (b || 0.85)));   // hiện ra → giữ → tan
  function prop(delay, dur, build) {   // vật thể có vòng đời: build() → { g, upd(k, t, dt), end() }
    task(delay || 0, dur, () => { const r = build(); r.g.traverse(x => { x.frustumCulled = false; if (!x.renderOrder) x.renderOrder = 9; }); SC.add(r.g);
      return { upd: (k, t, dt) => { if (r.upd) r.upd(k, t, dt); }, end: () => { kill(r.g); if (r.end) r.end(); } }; });
  }
  const TXT = {};
  function txtTex(s, color, font) {   // chữ / số nổi (sprite), có viền tối
    const key = s + color + (font || ""); if (TXT[key]) return TXT[key];
    return TXT[key] = cvTex(128, (g, n) => { g.font = font || "bold 92px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; const k = Math.min(1, (n - 16) / g.measureText(s).width); g.translate(n / 2, n / 2 + 6); g.scale(k, k); /* chữ dài thì thu nhỏ cho vừa */
      g.lineWidth = 10; g.strokeStyle = "rgba(40,20,0,.85)"; g.strokeText(s, 0, 0); g.fillStyle = color; g.fillText(s, 0, 0); });
  }
  function textPop(P, s, color, size, dur, delay, o) {   // chữ bật lên rồi bay lên tan
    o = o || {}; P = P.clone();
    prop(delay, dur, () => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: txtTex(s, color), transparent: true, depthWrite: false, depthTest: false })); sp.renderOrder = 12; const g = new THREE.Group(); g.add(sp);
      return { g, upd: k => { sp.position.set(P.x, P.y + k * (o.rise === undefined ? 1.2 : o.rise), P.z); sp.scale.setScalar(size * (k < 0.15 ? 0.4 + k / 0.15 * 0.9 : 1.3 - Math.min(0.3, (k - 0.15)))); sp.material.opacity = 1 - Math.max(0, k - 0.6) / 0.4; } }; });
  }
  const BONE = 0xe9dcc0, BONE2 = 0xfff6e0;
  const boneMat = (gold) => solidMat(gold ? 0xc89a20 : 0xb8a888, gold ? 0xfff0a0 : BONE2, gold ? 0xffe080 : 0xffffff);
  const woodMat = (gold) => solidMat(gold ? 0x9a6a10 : 0x5a3418, gold ? 0xffd860 : 0xb07840, 0xffd8a0);
  const helix = (r, h, turns, n) => new THREE.CatmullRomCurve3(Array.from({ length: n || 60 }, (_, i) => { const u = i / ((n || 60) - 1), a = u * turns * PI * 2; return new V3(Math.cos(a) * r, u * h, Math.sin(a) * r); }));
  function upg(P, f, col, delay, size) {   // lớp thưởng chung theo hình dạng: hình 2 ấn toả · hình 3 cột sáng + hạt · hình 4 sóng vàng lớn
    size = size || 3;
    if (f >= 2) rune(P, "sun", "latin", col, size * 1.6, 0.8, delay, { mode: "expand", expand: 0.7, hold: 0.2, grow: false, op: 0.8, lift: 0.01 });
    if (f >= 3) { pillar(P, col, 0xffffff, size * 0.25, 5, 0.6, delay, { speed: 3.5, widen: 0.5, top: 0.8 }); sparks(P.clone().setY(1), [col, 0xffffff], 40, 8, 0.3, 0.7, delay, { up: 1.4 }); }
    if (f >= 4) { shock(P, 0xffe9a8, size * 2, 0.7, delay + 0.05); shock(P, 0xffd860, size * 1.4, 0.6, delay + 0.12); task(delay, 0.01, () => shake(0.25)); }
  }
  /* --- Lương Thế Vinh --- */
  /* --- William Addis --- */
  /* --- Florence Nightingale --- */
  /* --- Earle Dickson --- */
  /* --- Isaac Newton --- */
  META.gravity_crush = { name: "Gravity Crush", lv: 14, who: "Isaac Newton", forms: ["Táo đỏ linh hồn rơi, lưới lõm", "Táo to + hạt bị hút vào", "Lưới lõm sâu + vòm nổ", "Táo vàng khổng lồ + hố lớn"] };
  SK.gravity_crush = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 3 + f * 0.4, fall = 0.55, sz = 0.9 + f * 0.35;
    shadowUnder(T, R0 * 2, 1.8, 0);
    prop(0, 1.7, () => {   // lưới không gian lõm xuống ở tâm
      const N = 26, geo = new THREE.PlaneGeometry(2, 2, N, N).rotateX(-PI / 2), base = geo.attributes.position.array.slice(), tex = cvTex(128, (g2, n) => { g2.strokeStyle = "rgba(255,255,255,0.9)"; g2.lineWidth = 3; for (let i = 0; i <= 8; i++) { g2.beginPath(); g2.moveTo(i * n / 8, 0); g2.lineTo(i * n / 8, n); g2.stroke(); g2.beginPath(); g2.moveTo(0, i * n / 8); g2.lineTo(n, i * n / 8); g2.stroke(); } });
      const m = new THREE.MeshBasicMaterial({ map: tex, color: gold ? 0xffd860 : 0x9a7aff, transparent: true, depthWrite: false, blending: ADD, side: THREE.DoubleSide }), me = new THREE.Mesh(geo, m), g = new THREE.Group(); g.add(me); g.position.set(T.x, 0.06, T.z); g.scale.set(R0, 1, R0);
      const pa = geo.attributes.position;
      return { g, upd: k => { const dep = (k < 0.35 ? k / 0.35 * 0.6 : 0.6 + Math.min(1, (k - 0.35) / 0.1) * (0.6 + f * 0.3)) * (1 - Math.max(0, k - 0.75) / 0.25);
        for (let i = 0; i < pa.count; i++) { const x = base[i * 3], z = base[i * 3 + 2]; pa.setY(i, -dep * Math.exp(-(x * x + z * z) * 4) * 1.5 / R0 * 3); } pa.needsUpdate = true; m.opacity = 0.75 * pop(k, 0.1, 0.8); }, end: () => tex.dispose() }; });
    prop(0.1, fall + 0.3, () => { const g = new THREE.Group(), am = ghostMat(0xe01818, gold ? 0xffd860 : 0xff7070, { fres: 1.2, cut: -0.4, gain: 1 }), apple = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), am); apple.scale.set(1.05, 0.95, 1.05); g.add(apple); am.blending = THREE.NormalBlending;   /* táo đỏ trong mờ (không cộng sáng để giữ màu đỏ) */
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.5, 6), am); stem.position.y = 1.05; stem.rotation.z = 0.3; g.add(stem);
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 6), ghostMat(0x2aff6a, 0xd0ffd0)); leaf.scale.set(1, 0.2, 0.5); leaf.position.set(0.3, 1.15, 0); leaf.rotation.z = -0.5; g.add(leaf);
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0xff5040, blending: ADD, transparent: true, depthWrite: false })); halo.scale.setScalar(3.4); g.add(halo);
      return { g, upd: (k, t) => { am.uniforms.uTime.value = t; const e = Math.min(1, k / (fall / (fall + 0.3))); g.position.set(T.x, 12 - e * e * (12 - sz * 0.9), T.z); g.rotation.y = t * 3; g.scale.setScalar(sz * (k > 0.9 ? 1 - (k - 0.9) / 0.1 : 1)); } }; });
    if (f >= 2) emitter(80, i => { const a = R(0, PI * 2), r = R(R0 * 0.8, R0 * 1.4), p = T.clone().add(new V3(Math.cos(a) * r, R(0.2, 1.5), Math.sin(a) * r)); return { p, v: new V3().subVectors(T, p).setY(-0.3).multiplyScalar(1.6), t0: R(0, 0.55), life: 0.6, size: R(0.25, 0.45), col: gold ? 0xffd860 : 0xb39cff }; }, { grav: 0, drag: 0 });   // bị hút vào tâm
    const hit = 0.1 + fall;
    decal(T, TEX.crack, 0xffffff, R0 * 1.6, 1.3, hit, { add: false, op: 0.9, ro: 3 });
    glow(T.clone().setY(1), 0xffffff, 4 + f, 0.25, hit, { flash: true }); glow(T.clone().setY(1), gold ? 0xffc040 : 0xb080ff, 6 + f, 0.45, hit, { flash: true });
    shock(T, 0xffe0a0, R0 * 1.2, 0.5, hit); sparks(T.clone().setY(0.5), [0xb8a080, 0xd8c8a8, 0xffe0a0], 50 + f * 20, 6, 0.4, 0.8, hit, { up: 1.5 });   // bụi đất
    if (f >= 3) dome(T, gold ? 0xffb020 : 0x8a5aff, 0xffffff, R0 * 0.9, 0.55, hit);
    upg(T, f, gold ? 0xffd860 : 0xb39cff, hit, R0 * 0.7); task(hit, 0.01, () => shake(0.2 + f * 0.08));
  };
  const RAINBOW7 = [0xff3a3a, 0xff8a2a, 0xffe03a, 0x3ae060, 0x3aa8ff, 0x4a5aff, 0xb05aff];
  META.third_law = { name: "Third Law", lv: 14, who: "Isaac Newton", forms: ["Khiên mũi tên phản lực", "+ mũi tên bắn ngược ra", "2 vòng mũi tên + sóng", "Khiên vàng + mưa mũi tên"] };
  SK.third_law = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, n = 8 + f * 4, c1 = gold ? 0xffb020 : 0x5f9bff, c2 = gold ? 0xfff6c0 : 0xd8e8ff;
    shadowUnder(F, 4, 1.6, 0); rune(F, "star", "latin", c1, 4, 1.6, 0, { mode: "spin", spin: -2 });
    prop(0, 1.6, () => { const g = new THREE.Group(), sm = flowMat({ c1, c2, rep: [4, 2], spd: [0.5, -0.5], fres: 1.8, cut: 0.1, gain: 1.3, fade: [0, 0, 0, 0] }), sh = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 16), sm); g.add(sh);
      const ar = []; for (let L = 0; L < (f >= 3 ? 2 : 1); L++) for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 4), solidMat(c1, c2, 0xffffff)); const piv = new THREE.Group(); m.position.y = 1.8 + L * 0.4; piv.add(m); piv.rotation.set(R(-1.2, 1.2), i / n * PI * 2, 0, "YXZ"); g.add(piv); ar.push({ piv, m, L }); }
      g.position.set(F.x, 1.1, F.z);
      return { g, upd: (k, t) => { sm.uniforms.uTime.value = t; sm.uniforms.uAlpha.value = 0.55 * pop(k, 0.1, 0.85); g.rotation.y = t * 1.5; const burst = f >= 2 && k > 0.55 ? (k - 0.55) / 0.45 : 0;
        ar.forEach(a => { a.m.position.y = 1.8 + a.L * 0.4 + burst * 5; a.m.material.uniforms.uTime.value = t; a.m.material.uniforms.uAlpha.value = pop(k, 0.1, 0.9); }); } }; });
    if (f >= 3) { shock(F, c2, 4, 0.5, 0.9); shock(F, c1, 3, 0.45, 1.0); }
    if (gold) for (let i = 0; i < 10; i++) { const a = i / 10 * PI * 2, P = F.clone().add(new V3(Math.cos(a) * 3, 0.1, Math.sin(a) * 3)); crystalArrow(F.clone().setY(1.5), P, c1, c2, 0.3, 0.9 + i * 0.02, { size: 0.8 }); }
    upg(F, f, c1, 0.3, 2.5);
  };
  /* --- Mary Anning --- */
  function fossil(len, gold) {   // bộ xương bò sát biển: sọ dài, cột sống, xương sườn, vây, đuôi
    const g = new THREE.Group(), bm = boneMat(gold), N = 18;
    const skull = new THREE.Mesh(new THREE.ConeGeometry(0.45, 2.0, 8), bm); skull.rotation.z = -PI / 2; skull.position.x = len / 2 + 0.8; g.add(skull);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 8), bm); crown.scale.set(1.1, 0.9, 0.9); crown.position.x = len / 2 - 0.1; g.add(crown);
    const eye = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 6, 14), bm); eye.position.set(len / 2, 0.15, 0.46); g.add(eye);
    const eye2 = eye.clone(); eye2.position.z = -0.46; g.add(eye2);
    for (let i = 0; i < N; i++) { const u = i / (N - 1), x = len / 2 - 0.8 - u * len, s = 1 - u * 0.75, v = new THREE.Mesh(new THREE.SphereGeometry(0.2 * s + 0.05, 8, 6), bm); v.position.x = x; g.add(v);
      if (i > 1 && i < N * 0.6) { const rib = new THREE.Mesh(new THREE.TorusGeometry(0.6 * s + 0.15, 0.04, 5, 14, PI), bm); rib.position.x = x; rib.rotation.y = PI / 2; rib.rotation.x = PI; rib.position.y = -0.05; g.add(rib); } }
    [[len * 0.25, 1], [len * 0.25, -1], [-len * 0.1, 1], [-len * 0.1, -1]].forEach(([x, s]) => { const fin = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.1, 4), bm); fin.position.set(x, -0.25, s * 0.7); fin.rotation.set(s * 1.2, 0, -0.6); g.add(fin); });
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.2, 4), bm); tail.position.x = -len / 2 - 0.9; tail.rotation.z = PI / 2 + 0.6; tail.position.y = 0.3; g.add(tail);
    const tail2 = tail.clone(); tail2.rotation.z = PI / 2 - 0.6; tail2.position.y = -0.3; g.add(tail2);
    return { g, bm };
  }
  META.ichthyosaur_rise = { name: "Ichthyosaur Rise", lv: 15, who: "Mary Anning", forms: ["Bộ xương bơi dưới đất rồi đớp", "Xương to + đất nổ tung", "+ cột nước, rãnh nứt sâu", "Hoá thạch vàng dài 10 m"] };
  SK.ichthyosaur_rise = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, len = 3.5 + f * 1.1, d = DIR(F, T), swim = 0.7, S0 = F.clone().addScaledVector(d, 1.5);
    shadowUnder(T, 6, 2.2, 0.4);
    for (let i = 0; i < 6; i++) { const P = S0.clone().lerp(T, i / 6); decal(P, TEX.crack, 0xffffff, 2.2 + f * 0.2, 1.6, i / 6 * swim, { add: false, op: 0.8, ro: 3 }); sparks(P.clone().setY(0.2), [0x9a7a50, 0xc8a878], 10 + f * 3, 4, 0.3, 0.5, i / 6 * swim, { up: 2 }); }   // rãnh nứt + đất bắn theo đường bơi
    prop(0, swim + 1.0, () => { const { g: fo, bm } = fossil(len, gold), g = new THREE.Group(); g.add(fo); const tot = swim + 1.0, ks = swim / tot;
      return { g, upd: (k, t) => { bm.uniforms.uTime.value = t; let pos, rx = 0;
        if (k < ks) { const u = k / ks; pos = S0.clone().lerp(T, u); pos.y = -0.9 + Math.sin(t * 10) * 0.1; }   // bơi dưới đất (vây lưng lấp ló)
        else { const u = (k - ks) / (1 - ks); pos = T.clone().addScaledVector(d, (u - 0.5) * len * 0.8); pos.y = Math.sin(u * PI) * (3 + f * 0.6) - 0.6; rx = -(u - 0.5) * 2.2; }   // nhảy lên khỏi đất, đớp rồi lặn xuống
        g.position.copy(pos); g.quaternion.copy(basisQ(new V3(-d.z, 0, d.x))); g.rotateZ(rx); fo.rotation.x = Math.sin(t * 8) * 0.12; fo.children.forEach((c, i) => { if (i > 4) c.position.z = Math.sin(t * 9 - i * 0.4) * 0.18; }); } }; });
    const hit = swim + 0.35;
    glow(T.clone().setY(1.5), 0xffffff, 3 + f, 0.3, hit, { flash: true }); shock(T, 0xe8d8b0, 3.5 + f * 0.5, 0.6, hit - 0.3);
    sparks(T.clone().setY(0.4), [0x8a6a40, 0xc8a878, 0xe8d8b0], 60 + f * 25, 7, 0.4, 0.9, swim, { up: 2.2 });   // đất nổ tung khi trồi lên
    if (f >= 3) pillar(T, 0x2a90c8, 0xdff8ff, 1.2, 4 + f, 0.6, swim, { speed: 4, widen: 0.8, top: 1.4 });
    upg(T, f, gold ? 0xffd860 : 0xe8d8b0, hit, 3); task(swim, 0.01, () => shake(0.15 + f * 0.07));
  };
  /* --- Johannes Gutenberg --- */
  const LTX = {}; function letterTex(gold) { return LTX[gold] || (LTX[gold] = cvTex(256, (g, n) => { g.fillStyle = "rgba(0,0,0,0)"; g.fillRect(0, 0, n, n); g.font = "bold 50px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = gold ? "#ffe9a0" : "#ffd27a"; g.shadowColor = g.fillStyle; g.shadowBlur = 12;
    const s = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; for (let i = 0; i < 16; i++) { const a = i / 16 * PI * 2, r = i % 2 ? 60 : 100; g.fillText(s[(i * 7) % 26], n / 2 + Math.cos(a) * r, n / 2 + Math.sin(a) * r); } g.font = "bold 72px Georgia, serif"; g.fillText("Aa", n / 2, n / 2); })); }
  /* --- Leonardo da Vinci --- */
  function helicoid(r, h, turns) {   // cánh xoắn của "máy bay xoắn": mặt xoắn ốc
    const N = 60, M = 6, pos = [], uv = [], idx = [];
    for (let i = 0; i <= N; i++) for (let j = 0; j <= M; j++) { const u = i / N, a = u * turns * PI * 2, rr = 0.15 + j / M * r; pos.push(Math.cos(a) * rr, u * h, Math.sin(a) * rr); uv.push(u, j / M); if (i && j) { const A = (i - 1) * (M + 1) + j - 1, B = A + 1, C = i * (M + 1) + j - 1, D = C + 1; idx.push(A, C, B, B, C, D); } }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  /* --- Alexander Graham Bell --- */
  /* --- Nicéphore Niépce --- */
  function sepiaTex() { return TEX.sepia || (TEX.sepia = cvTex(128, (g, n) => { g.fillStyle = "rgba(0,0,0,0)"; g.fillRect(0, 0, n, n); g.fillStyle = "rgba(150,105,55,.55)"; g.fillRect(10, 10, n - 20, n - 20);
    const gr = g.createRadialGradient(n / 2, n / 2, 10, n / 2, n / 2, n / 1.6); gr.addColorStop(0, "rgba(240,210,160,.35)"); gr.addColorStop(1, "rgba(60,35,15,.7)"); g.fillStyle = gr; g.fillRect(10, 10, n - 20, n - 20);
    g.strokeStyle = "#f4e6c8"; g.lineWidth = 9; g.strokeRect(6, 6, n - 12, n - 12); g.strokeStyle = "#7a4a1a"; g.lineWidth = 2; g.strokeRect(13, 13, n - 26, n - 26); })); }
  /* --- Wilhelm Röntgen --- */
  function boneHandTex() { return TEX.xhand || (TEX.xhand = cvTex(256, (g, n) => {   // tấm phim X-quang: nền xanh đen + xương bàn tay sáng
    g.fillStyle = "#06140c"; g.fillRect(0, 0, n, n); g.strokeStyle = "#5aff9a"; g.lineWidth = 3; g.strokeRect(8, 8, n - 16, n - 16);
    g.strokeStyle = "rgba(200,255,220,.95)"; g.lineCap = "round"; g.shadowColor = "#5aff9a"; g.shadowBlur = 10;
    const cx = n / 2, by = n * 0.82; g.lineWidth = 16; g.beginPath(); g.moveTo(cx - 14, by + 30); g.lineTo(cx - 10, by); g.moveTo(cx + 14, by + 30); g.lineTo(cx + 10, by); g.stroke();
    [[-58, 0.55, -0.5], [-30, 0.92, -0.18], [0, 1, 0], [30, 0.92, 0.18], [55, 0.75, 0.35]].forEach(([dx, L, a]) => { let x = cx + dx * 0.4, y = by - 20; const segs = 3; g.lineWidth = 11;
      for (let s = 0; s < segs + 1; s++) { const len = (s ? 26 : 34) * L, nx = x + Math.sin(a) * len, ny = y - Math.cos(a) * len; g.beginPath(); g.moveTo(x, y); g.lineTo(nx, ny); g.stroke(); x = nx + Math.sin(a) * 5; y = ny - Math.cos(a) * 5; g.lineWidth -= 1.5; } }); })); }
  function boneHand(gold) {   // bàn tay xương 3D (5 ngón, mỗi ngón 3 đốt)
    const g = new THREE.Group(), bm = boneMat(gold), palm = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.5, 0.35), bm); palm.position.y = 0.75; g.add(palm); const fingers = [];
    [[-0.75, 0.6, -0.6], [-0.4, 0.95, -0.12], [0, 1, 0], [0.4, 0.95, 0.12], [0.68, 0.8, 0.3]].forEach(([x, L, a], i) => { const root = new THREE.Group(); root.position.set(x * 0.85, 1.5, 0); root.rotation.z = -a * (i === 0 ? 1.4 : 0.6); g.add(root); let par = root;
      for (let s = 0; s < 3; s++) { const len = (0.55 - s * 0.1) * L * 1.4, seg = new THREE.Group(), bn = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, len, 6), bm); bn.position.y = len / 2; seg.add(bn);
        const kn = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), bm); seg.add(kn); par.add(seg); fingers.push(seg); seg.userData.len = len; const nxt = new THREE.Group(); nxt.position.y = len; seg.add(nxt); par = nxt; } });
    const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 2.2, 8), bm); wrist.position.y = -1.0; g.add(wrist);
    return { g, bm, fingers };
  }
  META.x_ray_pierce = { name: "X-Ray Pierce", lv: 20, who: "Wilhelm Röntgen", forms: ["Tia X xanh xuyên qua, hiện bộ xương", "Tia to + vòng quét", "3 tia + phim X-quang", "Tia vàng-lục + nổ xương"] };
  SK.x_ray_pierce = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, dir = T.clone().sub(F).setY(0).normalize(), L = F.distanceTo(T) + 7, nB = f >= 3 ? 3 : 1, W = 0.35 + f * 0.12, col = gold ? 0xd8ff60 : 0x40ff90;
    glow(F.clone().setY(1.3).addScaledVector(dir, 0.8), col, 3 + f, 0.3, 0);
    for (let b = 0; b < nB; b++) { const yaw = Math.atan2(dir.x, dir.z) + (b ? (b === 1 ? -0.18 : 0.18) : 0);
      task(0.12 + b * 0.04, 0.6, () => { const geo = new THREE.CylinderGeometry(W, W, L, 16, 1, true).rotateX(PI / 2); geo.translate(0, 0, L / 2); const mt = flowMat({ c1: col, c2: 0xffffff, rep: [2, 6], spd: [0.3, -4], fres: 1, cut: 0.05, fade: [0.02, 0.15, 0, 0] }), m = mesh(geo, mt, 9);
        m.position.copy(F).setY(1.3); m.rotation.y = yaw; SC.add(m);
        return { upd: (k, t) => { mt.uniforms.uTime.value = t; const inK = Math.min(1, t / 0.08); m.scale.set(1 - k * 0.5, 1 - k * 0.5, inK); mt.uniforms.uAlpha.value = 1 - Math.max(0, k - 0.5) / 0.5; }, end: () => kill(m) }; }); }
    emitter(60 + f * 20, i => { const u = R(0, 1), p = F.clone().setY(1.3).addScaledVector(dir, u * L); return { p: p.add(rv(W)), v: rv(1.2), t0: 0.12 + u * 0.15, life: R(0.3, 0.6), size: R(0.15, 0.35), col: i % 2 ? col : 0xffffff }; }, { grav: 0, drag: 2 });
    const hit = 0.18;
    prop(hit, 1.2, () => { const h = boneHand(gold), g = new THREE.Group(), sk = new THREE.Group(), bm = boneMat(gold);   // bộ xương phát sáng hiện trong thân quái
      const skull = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 10), bm); skull.position.y = 2.3; sk.add(skull);
      [-0.15, 0.15].forEach(x => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), new THREE.MeshBasicMaterial({ color: 0x002010 })); e.position.set(x, 2.32, 0.36); sk.add(e); });
      const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.3, 6), bm); spine.position.y = 1.35; sk.add(spine);
      for (let i = 0; i < 4; i++) { const rib = new THREE.Mesh(new THREE.TorusGeometry(0.42 - i * 0.04, 0.04, 4, 16, PI * 1.4), bm); rib.position.y = 1.85 - i * 0.2; rib.rotation.set(PI / 2, 0, -PI * 0.2); rib.scale.set(1, 0.7, 1); sk.add(rib); }
      const pelvis = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.07, 6, 14, PI), bm); pelvis.position.y = 0.7; pelvis.rotation.x = PI; sk.add(pelvis);
      g.add(sk); const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: col, blending: ADD, transparent: true, depthWrite: false })); halo.position.y = 1.5; halo.scale.set(3, 4, 1); g.add(halo);
      g.position.copy(T); g.rotation.y = Math.atan2(-dir.x, -dir.z); g.traverse(x => { x.renderOrder = 11; if (x.material) { x.material.depthTest = false; } });
      return { g, upd: (k, t) => { bm.uniforms.uTime.value = t; g.scale.setScalar(pop(k, 0.08, 0.8) * (1 + Math.sin(t * 30) * 0.02)); halo.material.opacity = 0.6 * pop(k, 0.08, 0.8); } }; });
    shock(T, col, 2.2, 0.4, hit, 1.3);
    if (f >= 2) shock(T, col, 3.5, 0.5, hit + 0.1);
    if (f >= 3) decal(T, boneHandTex(), 0xffffff, 3, 1.2, hit, { add: true, op: 0.9, mode: "static" });
    if (gold) { sparks(T.clone().setY(1.5), [BONE2, col], 40, 7, 0.3, 0.6, hit + 0.8); glow(T.clone().setY(1.5), col, 6, 0.3, hit + 0.8, { flash: true }); }
    upg(T, f, col, hit, 2); task(hit, 0.01, () => shake(0.12 + f * 0.04));
  };
  /* ---------- góp ý 27/11: làm lại 16 chiêu Chương 1 ---------- */
  const ghostMat = (c1, c2, o) => flowMat(Object.assign({ c1, c2, rep: [1, 2], spd: [0.1, -0.5], fres: 1.8, cut: -0.25, gain: 1.15, fade: [0, 0, 0, 0] }, o || {}));   /* vật thể dạng linh hồn: trong mờ, viền sáng */
  function nuv(geo) { const uv = geo.attributes.uv, a = uv.array; let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (let i = 0; i < a.length; i += 2) { x0 = Math.min(x0, a[i]); x1 = Math.max(x1, a[i]); y0 = Math.min(y0, a[i + 1]); y1 = Math.max(y1, a[i + 1]); }
    for (let i = 0; i < a.length; i += 2) { a[i] = 0.02 + 0.96 * (a[i] - x0) / (x1 - x0 || 1); a[i + 1] = 0.02 + 0.96 * (a[i + 1] - y0) / (y1 - y0 || 1); } uv.needsUpdate = true; return geo; }   /* đưa toạ độ vân về 0–1 (hình đùn / hình phẳng) */
  const SDIR = (F, T) => { const d = DIR(F, T); return d.lengthSq() > 0.5 ? d : new V3(0, 0, -1); };
  const GODS = ["runic", "ogham", "greek", "hanzi", "cuneiform", "hiero"], GLY = {};
  function glyphTex(script, i, color) { const key = script + i + color; return GLY[key] || (GLY[key] = cvTex(128, (g, n) => { g.translate(n / 2, n / 2); g.fillStyle = g.strokeStyle = color; g.shadowColor = color; g.shadowBlur = 16; glyph(g, script, i, 78); })); }
  const bez = (A, B, C, u, out) => (out || new V3()).set(0, 0, 0).addScaledVector(A, (1 - u) * (1 - u)).addScaledVector(B, 2 * u * (1 - u)).addScaledVector(C, u * u);
  function swirlTex() { return TEX.swirl || (TEX.swirl = cvTex(256, (g, n) => { g.translate(n / 2, n / 2); g.lineCap = "round";
    for (let a = 0; a < 5; a++) for (let i = 0; i < 60; i++) { const u = i / 60, r = 12 + u * 112, th = a / 5 * PI * 2 + u * 4.2; g.strokeStyle = "rgba(255,255,255," + (0.9 * (1 - u * 0.6)) + ")"; g.lineWidth = 3 + 10 * (1 - u); g.beginPath(); g.arc(0, 0, r, th, th + 0.12); g.stroke(); } })); }

  /* --- Lương Thế Vinh: thuyền buồm ma, nước dạt 2 bên, xoáy hút quái --- */
  META.elephant_scale = { name: "Elephant Scale", lv: 10, who: "Lương Thế Vinh", forms: ["Thuyền buồm ma rẽ nước, xoáy hút quái", "Tường nước cao hơn + bọt", "+ phễu xoáy nước", "Buồm vàng + sóng lớn"] };
  SK.elephant_scale = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), side = new V3(-d.z, 0, d.x), dist = Math.max(2, F.distanceTo(T)), run = 0.65, R0 = 3 + f * 0.3, wH = 1.2 + f * 0.35;
    glow(F.clone().setY(1.3).addScaledVector(d, 0.7), 0x9ae8ff, 2.5, 0.35, 0);
    rune(F, "circle", "ogham", 0x9ae8ff, 3, 1, 0, { mode: "expand", expand: 0.4, op: 0.8 });
    prop(0, run + 0.7, () => { const g = new THREE.Group(), hm = ghostMat(gold ? 0xffc040 : 0x3aa8ff, 0xe8fbff, { fres: 0.6, cut: -0.5 }), sm = ghostMat(gold ? 0xffe080 : 0xbfeaff, 0xffffff, { fres: 0.3, cut: -0.5 });
      const hs = new THREE.Shape(); hs.moveTo(-1.3, 0.5); hs.lineTo(1.5, 0.5); hs.quadraticCurveTo(1.2, -0.1, 0.8, -0.35); hs.lineTo(-0.9, -0.35); hs.quadraticCurveTo(-1.25, -0.1, -1.3, 0.5);
      const hull = new THREE.Mesh(nuv(new THREE.ExtrudeGeometry(hs, { depth: 0.9, bevelEnabled: false })).translate(0, 0, -0.45).rotateY(-PI / 2), hm); g.add(hull);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3, 6), hm); mast.position.y = 2; g.add(mast);
      [[0.15, 1, 2.4, 1.4], [-0.15, 0.9, 1.8, -1.0]].forEach(([z, y0, h, w]) => { const ss = new THREE.Shape(); ss.moveTo(0, 0); ss.lineTo(0, h); ss.quadraticCurveTo(w * 0.7, h * 0.4, w, 0); ss.lineTo(0, 0);
        const sail = new THREE.Mesh(nuv(new THREE.ShapeGeometry(ss)).translate(-w / 2, 0, 0), sm); sail.position.set(0, y0, z * 4); g.add(sail); });   /* buồm ngang thân thuyền, nhìn rõ từ trên */
      const yaw = Math.atan2(d.x, d.z), sc = 1.1 + f * 0.15, P = new V3();
      return { g, upd: (k, t) => { hm.uniforms.uTime.value = t; sm.uniforms.uTime.value = t; const tt = Math.min(1, t / run); P.copy(F).addScaledVector(d, 0.8 + tt * (dist - 0.8));
        const sink = t > run ? Math.min(1, (t - run) / 0.5) : 0; g.position.set(P.x, 0.2 + Math.sin(t * 9) * 0.06 - sink * 1.6, P.z); g.rotation.set(Math.sin(t * 6) * 0.05, yaw + sink * 2.5, Math.sin(t * 7) * 0.06);
        g.scale.setScalar(sc * Math.min(1, t / 0.12)); hm.uniforms.uAlpha.value = sm.uniforms.uAlpha.value = 1 - sink; } }; });
    const nS = 7; for (let i = 0; i < nS; i++) { const u = (i + 0.5) / nS, at = run * u;   /* 2 bức tường nước dạt sang 2 bên khi thuyền đi qua */
      [-1, 1].forEach(s => { const P = F.clone().addScaledVector(d, 0.8 + u * (dist - 0.8)).addScaledVector(side, s * 1.25);
        task(at, 0.9, () => { const mt = flowMat({ c1: gold ? 0xffc860 : 0x3aa8ff, c2: 0xe8fbff, rep: [1, 1.5], spd: [0.2, 1.4], fres: 0, cut: 0.05, gain: 1.3, fade: [0.15, 0.15, 0.02, 0.35] });
          const m = mesh(new THREE.PlaneGeometry(dist / nS * 1.5, wH).translate(0, wH / 2, 0), mt, 8); m.position.set(P.x, 0, P.z); m.rotation.set(0, Math.atan2(d.x, d.z) + PI / 2, 0); m.rotateX(s * 0.45); SC.add(m);
          return { upd: (k, t) => { mt.uniforms.uTime.value = t; m.scale.y = Math.sin(Math.min(1, k * 1.6) * PI * 0.5) * (1 - Math.max(0, k - 0.5) / 0.5) + 0.01; mt.uniforms.uAlpha.value = 0.9; }, end: () => kill(m) }; });
        sparks(P.clone().setY(0.4), [0xe8fbff, 0x9ae8ff, 0xffffff], 6 + f * 3, 4, 0.25, 0.6, at, { dir: () => side.clone().multiplyScalar(s).add(new V3(R(-0.3, 0.3), R(1, 2), R(-0.3, 0.3))).normalize() }); }); }
    const hit = run;   /* xoáy nước dưới quái: hạt bị hút vào tâm */
    decal(T, swirlTex(), gold ? 0xffd860 : 0x7ad8ff, R0 * 2, 1.5, hit - 0.15, { mode: "converge", spin: -5, op: 0.95 });
    decal(T, swirlTex(), 0xffffff, R0 * 1.3, 1.4, hit, { spin: -8, op: 0.6, lift: 0.01 });
    emitter(70 + f * 30, i => { const a = R(0, PI * 2), r = R(R0 * 0.9, R0 * 1.6), p = T.clone().add(new V3(Math.cos(a) * r, R(0.1, 0.8), Math.sin(a) * r)), tan = new V3(-Math.sin(a), 0, Math.cos(a)).multiplyScalar(-r * 1.6);
      return { p, v: new V3().subVectors(T, p).setY(0).multiplyScalar(1.3).add(tan), t0: hit - 0.1 + R(0, 0.8), life: 0.7, size: R(0.2, 0.4), col: [0x9ae8ff, 0xffffff, 0x3aa8ff][i % 3] }; }, { grav: 0, drag: 0.3 });
    if (f >= 3) tornado(T, gold ? 0xffc040 : 0x3aa8ff, 0xe8fbff, 1.2, 3.2, 1.2, hit);
    pillar(T, 0x9ae8ff, 0xffffff, 0.9, 3 + f, 0.5, hit + 0.45, { speed: 4, widen: 0.6 }); sparks(T.clone().setY(0.5), [0xffffff, 0x9ae8ff], 40 + f * 15, 7, 0.35, 0.8, hit + 0.45, { up: 2 });
    shock(T, 0xe8fbff, R0 * 0.9, 0.5, hit + 0.45); for (let i = 0; i < 3; i++) orbitStar(T, 0x9ae8ff, 0.9, 2.4, 1.4, hit + 0.5, i / 3);
    upg(T, f, gold ? 0xffd860 : 0x9ae8ff, hit + 0.45, R0 * 0.7); task(hit + 0.45, 0.01, () => shake(0.12 + f * 0.05));
  };

  /* --- Bàn tính: hạt vàng toả vòng cung từ sau lưng rồi lượn vào quái --- */
  META.abacus_barrage = { name: "Abacus Barrage", lv: 10, who: "Lương Thế Vinh", forms: ["3 hạt vòng cung từ sau lưng", "4 hạt to hơn, sáng hơn", "5 hạt + vệt sáng dài", "6 hạt vàng rực"] };
  SK.abacus_barrage = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), side = new V3(-d.z, 0, d.x), n = 2 + f, sz = 0.22 + f * 0.07, fly = 0.5;
    const now = CLOCK_MS(), first = !LAST.abacus || now - LAST.abacus > 900; LAST.abacus = now;
    const back = F.clone().setY(1.7).addScaledVector(d, -0.7), B = T.clone().setY(1.1), col = gold ? 0xffd040 : 0xffb050;
    if (first) prop(0, 1.6, () => { const g = new THREE.Group(), fm = ghostMat(0xc88040, 0xffe0b0, { fres: 1.4 }); [[0, 1.2, 2.2, 0.12], [0, -1.2, 2.2, 0.12], [-1.1, 0, 0.12, 2.5], [1.1, 0, 0.12, 2.5]].forEach(([x, y, w, h]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), fm); b.position.set(x, y, 0); g.add(b); });
      for (let r = 0; r < 5; r++) { const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 4).rotateZ(PI / 2), fm); rod.position.y = -0.9 + r * 0.45; g.add(rod); }
      g.position.copy(back).addScaledVector(d, -0.4); g.rotation.y = Math.atan2(d.x, d.z);   /* bóng bàn tính mờ sau lưng (chỉ đòn đầu) */
      return { g, upd: (k, t) => { fm.uniforms.uTime.value = t; fm.uniforms.uAlpha.value = 0.7 * pop(k, 0.12, 0.7); g.scale.setScalar(0.8 + 0.2 * Math.min(1, k / 0.15)); } }; });
    for (let i = 0; i < n; i++) { const s = n === 1 ? 0 : (i / (n - 1) - 0.5) * 2, dl = i * 0.05;   /* mỗi hạt 1 đường cong: bung ra 2 bên sau lưng, vòng lên rồi bổ vào quái */
      const C = back.clone().addScaledVector(side, s * (2.4 + f * 0.4)).addScaledVector(d, -1.2).add(new V3(0, 1.4 + Math.abs(s) * 0.8, 0)), P = new V3();
      prop(dl, fly, () => { const g = new THREE.Group(), bm = woodMat(gold), bead = new THREE.Mesh(new THREE.SphereGeometry(sz, 12, 8), bm); bead.scale.y = 0.6; g.add(bead);
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: col, blending: ADD, transparent: true, depthWrite: false })); halo.scale.setScalar(sz * (5 + f)); g.add(halo);
        return { g, upd: (k, t) => { bm.uniforms.uTime.value = t; bez(back, C, B, k * k * (3 - 2 * k), P); g.position.copy(P); bead.rotation.set(t * 12, t * 7, 0); } }; });
      emitter(18 + f * 6, q => { const u = q / (18 + f * 6), p = bez(back, C, B, u * u * (3 - 2 * u)); return { p: p.add(rv(0.06)), v: rv(0.3), t0: dl + u * fly, life: R(0.2, 0.35) * (1 + f * 0.25), size: sz * R(1.2, 2), col: q % 2 ? col : 0xffffff }; }, { grav: 0, drag: 2 });
      const hit = dl + fly; glow(B, 0xffffff, 1.4 + f * 0.5, 0.18, hit, { flash: true }); sparks(B, [col, 0xffffff], 6 + f * 3, 4, 0.18, 0.35, hit, { up: 1 });
      if (i === n - 1) { textPop(B.clone().add(new V3(R(-0.5, 0.5), 0.8, 0)), String(1 + ((Math.random() * 9) | 0)), gold ? "#fff0a0" : "#ffd27a", 1 + f * 0.2, 0.6, hit); task(hit, 0.01, () => shake(0.04 + f * 0.02)); } }
    if (first) upg(T, f, col, fly + 0.1, 1.8);
  };

  /* --- William Addis: lông bàn chải hiện quanh người, chĩa về quái rồi phóng vào --- */
  META.bristle_cyclone = { name: "Bristle Cyclone", lv: 11, who: "William Addis", forms: ["Lông bàn chải quanh người phóng vào quái", "Nhiều lông hơn + bọt nổ", "3 loạt + vòng bọt", "Lông vàng + bão bọt"] };
  SK.bristle_cyclone = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, has = F.distanceTo(T) > 0.7, n = 12 + f * 8, vol = f >= 3 ? 3 : 2, c1 = gold ? 0xffd040 : 0x7ad8ff;
    rune(F, "star", "greek", c1, 4.4, 1.6, 0, { mode: "pulse", rate: 7, amp: 0.08, op: 0.8 });
    for (let i = 0; i < n; i++) { const a = R(0, PI * 2), r = R(0.9, 2.1), S = F.clone().add(new V3(Math.cos(a) * r, R(0.5, 2.4), Math.sin(a) * r)), v = i % vol, t0 = 0.45 + v * 0.3 + R(0, 0.08);
      const tgt = has ? T.clone().add(new V3(R(-0.8, 0.8), R(0.6, 1.6), R(-0.8, 0.8))) : F.clone().add(new V3(Math.cos(a) * 5, 0.8, Math.sin(a) * 5)), r0 = new V3(R(-PI, PI), R(-PI, PI), 0);
      prop(i * 0.012, t0 + 0.32, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.9, 5).rotateX(PI / 2), basic(null, i % 4 ? 0xffffff : c1, true, 1)), tip = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c1, blending: ADD, transparent: true, depthWrite: false }));
        tip.position.z = 0.45; tip.scale.setScalar(0.5); g.add(m); g.add(tip); const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(r0.x, r0.y, 0)), q1 = basisQ(new V3().subVectors(tgt, S)), P = new V3();
        return { g, upd: (k, t) => { const aim = Math.min(1, Math.max(0, (t - 0.12) / 0.3)), fly = Math.max(0, (t - t0) / 0.3);
          g.quaternion.copy(q0).slerp(q1, aim * aim * (3 - 2 * aim)); P.copy(S).lerp(tgt, Math.min(1, fly * fly)); if (fly <= 0) P.y += Math.sin(t * 6 + i) * 0.05; g.position.copy(P); g.scale.setScalar(Math.min(1, t / 0.12) * (1 + f * 0.08)); g.visible = fly < 1; } }; }); }
    for (let v = 0; v < vol; v++) { const hit = 0.45 + v * 0.3 + 0.3, Bp = (has ? T : F).clone().setY(1.1);
      glow(Bp, 0xffffff, 2 + f * 0.6, 0.2, hit, { flash: true }); sparks(Bp, [0xffffff, 0xe8fbff, c1], 25 + f * 10, 5, 0.35, 0.7, hit, { up: 1.2, grav: -2 }); task(hit, 0.01, () => shake(0.06 + f * 0.03)); }
    if (f >= 2) emitter(40 + f * 15, i => ({ p: (has ? T : F).clone().add(new V3(R(-1.5, 1.5), R(0.3, 2.2), R(-1.5, 1.5))), v: new V3(0, R(0.2, 0.8), 0), t0: 0.8 + R(0, 0.8), life: R(0.4, 0.8), size: R(0.25, 0.55), col: i % 3 ? 0xffffff : 0xbfeaff }), { grav: 0, drag: 1 });   /* bọt nổ lốp bốp */
    if (f >= 3) shock(has ? T : F, 0xffffff, 3, 0.5, 1.1);
    upg(has ? T : F, f, c1, 0.8, 2.2);
  };

  /* --- Nightingale: đèn bay chậm dần từ thấp lên cao rồi tan --- */
  META.ladys_lamp = { name: "Lady's Lamp", lv: 12, who: "Florence Nightingale", forms: ["Đèn bay lên chậm dần, hồi máu", "Ánh sáng to + hạt sáng bay lên", "+ vòng sáng rơi xuống người", "Đèn vàng + cánh hoa"] };
  SK.ladys_lamp = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, dur = 2.4, col = gold ? 0xffd040 : 0xffc870, st = F.clone().add(new V3(0.9, 0.5, 0.5));
    decal(F, TEX.glow, col, 4 + f * 0.6, dur, 0, { op: 0.6, hold: 0.6 }); rune(F, "sun", "latin", col, 3.6 + f * 0.4, dur, 0, { mode: "static", op: 0.55 });
    prop(0, dur, () => { const g = new THREE.Group(), bm = solidMat(gold ? 0xc89010 : 0x8a5a18, gold ? 0xfff0a0 : 0xe8b860, 0xfff0c0), gm = ghostMat(0xffe0a0, 0xffffff, { fres: 1, cut: -0.5 });
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.14, 12), bm); g.add(base); const cap = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.3, 12), bm); cap.position.y = 0.88; g.add(cap);
      const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.72, 12, 1, true), gm); glass.position.y = 0.43; g.add(glass);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 6, 14), bm); ring.position.y = 1.1; g.add(ring);
      const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0xffd080, blending: ADD, transparent: true, depthWrite: false })); fl.position.y = 0.42; g.add(fl);
      const halo = new THREE.Sprite(fl.material.clone()); halo.material.color.set(col); halo.position.y = 0.42; g.add(halo);
      return { g, upd: (k, t) => { [bm, gm].forEach(m => m.uniforms.uTime.value = t); const e = 1 - Math.pow(1 - k, 2.4);   /* nhanh lúc đầu, chậm dần khi lên cao */
        g.position.set(st.x - e * 0.9, st.y + e * (4.6 + f * 0.4), st.z - e * 0.5); g.rotation.y = Math.sin(t * 1.5) * 0.3; const fade = 1 - Math.max(0, k - 0.6) / 0.4;
        g.scale.setScalar((0.9 + f * 0.1) * Math.min(1, k / 0.08) * (0.4 + 0.6 * fade)); bm.uniforms.uAlpha.value = gm.uniforms.uAlpha.value = fade;
        fl.scale.setScalar((0.7 + Math.sin(t * 22) * 0.06) * fade + 0.01); halo.scale.setScalar((3 + f) * fade + 0.01); halo.material.opacity = 0.7 * fade; } }; });
    emitter(30 + f * 20, i => { const a = R(0, PI * 2), r = R(0.2, 1.6); return { p: F.clone().add(new V3(Math.cos(a) * r, R(0, 0.5), Math.sin(a) * r)), v: new V3(0, R(1, 2.5), 0), t0: R(0.1, 1.6), life: R(0.6, 1.1), size: R(0.2, 0.4), col: i % 3 ? col : 0xffffff }; }, { grav: 0, drag: 0.5 });
    for (let i = 0; i < 2 + f; i++) textPop(F.clone().add(new V3(R(-0.8, 0.8), 1.4 + R(0, 0.8), R(-0.5, 0.5))), "+", "#7dff9a", 0.9, 0.9, 0.3 + i * 0.25);
    if (f >= 3) for (let i = 0; i < 3; i++) decal(F, TEX.ring, col, 3.5, 0.7, 0.5 + i * 0.4, { mode: "converge", op: 0.9 });
    if (gold) emitter(30, i => ({ p: F.clone().add(new V3(R(-2, 2), R(3, 4.5), R(-2, 2))), v: new V3(R(-0.3, 0.3), -0.9, R(-0.3, 0.3)), t0: R(0.3, 1.8), life: 1.2, size: R(0.25, 0.4), col: [0xffd0e0, 0xfff0a0][i % 2] }), { grav: 0, drag: 0.2 });
    upg(F, f, col, 0.3, 2.2);
  };

  /* --- Fresh Wind: lốc xoáy phóng ra, lớn dần, đánh nhiều đòn ở quái --- */
  META.fresh_wind = { name: "Fresh Wind", lv: 12, who: "Florence Nightingale", forms: ["Lốc gió lớn dần, trúng 1 đòn", "Lốc to hơn, 2 đòn", "Lốc lớn 3 đòn + 2 lốc nhỏ toả ra", "Lốc vàng khổng lồ 4 đòn"] };
  SK.fresh_wind = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), dist = Math.max(2, F.distanceTo(T)), run = 0.5, stay = 0.3 * f + 0.4, c1 = gold ? 0xffd860 : 0x7affd0, c2 = 0xffffff, big = 0.8 + f * 0.3;
    function twister(A, B, s0, s1, delay, life, h) {
      task(delay, life, () => { const pts = []; for (let i = 0; i <= 12; i++) { const y = i / 12; pts.push(new THREE.Vector2(0.3 + y * y * 1.2, y * h)); }
        const mt = flowMat({ c1, c2, rep: [3, 1], spd: [1.6, -0.9], fres: 0.8, cut: 0.2, fade: [0, 0, 0.05, 0.25] }), m = mesh(new THREE.LatheGeometry(pts, 26), mt), m2 = mesh(new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p.x * 0.6, p.y * 0.95)), 20), flowMat({ c1: c2, c2: c1, rep: [2, 1], spd: [2.4, -1.4], fres: 1, cut: 0.35, fade: [0, 0, 0.05, 0.3] }));
        const g = new THREE.Group(); g.add(m); g.add(m2); SC.add(g); const P = new V3(); const tr = run / life;
        return { upd: (k, t) => { mt.uniforms.uTime.value = t; m2.material.uniforms.uTime.value = t; const u = Math.min(1, k / tr); P.lerpVectors(A, B, u); g.position.copy(P); g.rotation.y = t * 9;
          const s = s0 + (s1 - s0) * u; g.scale.set(s, s * (0.9 + 0.1 * Math.sin(t * 8)), s); const a = 1 - Math.max(0, k - 0.8) / 0.2; mt.uniforms.uAlpha.value = a; m2.material.uniforms.uAlpha.value = a; }, end: () => kill(g) }; }); }
    const A = F.clone().addScaledVector(d, 0.8).setY(0);
    twister(A, T.clone().setY(0), 0.35, big, 0.05, run + stay, 2.8);
    emitter(80 + f * 30, i => { const a = R(0, PI * 2), r = R(0.4, 1.6) * big, h = R(0.2, 2.6) * big; return { p: T.clone().add(new V3(Math.cos(a) * r, h, Math.sin(a) * r)), v: new V3(-Math.sin(a) * 6, R(0.5, 2), Math.cos(a) * 6), t0: run + R(0, stay), life: R(0.3, 0.6), size: R(0.2, 0.4), col: [c1, c2, 0xb8ffe8][i % 3] }; }, { grav: 0, drag: 1.5 });
    emitter(30, i => { const u = i / 30, p = A.clone().lerp(T, u); return { p: p.add(new V3(R(-0.5, 0.5), R(0.3, 1.5), R(-0.5, 0.5))), v: rv(1.5), t0: u * run, life: 0.5, size: R(0.25, 0.45), col: [0x8ad860, c1][i % 2] }; }, { grav: -1, drag: 1 });   /* lá + gió trên đường bay */
    for (let h = 0; h < f; h++) { const hit = run + h * 0.3; glow(T.clone().setY(1.3), 0xffffff, 2 + f * 0.5, 0.2, hit, { flash: true }); shock(T, c1, 1.5 + big, 0.4, hit); task(hit, 0.01, () => shake(0.05 + f * 0.02)); }
    if (f >= 3) [-1, 1].forEach(s => { const side = new V3(-d.z, 0, d.x).multiplyScalar(s * 3.2).addScaledVector(d, 1); twister(T.clone().setY(0), T.clone().add(side).setY(0), big * 0.8, big * 0.6, run + 0.3, 1.0, 2.2); });
    upg(T, f, c1, run, 2 + big);
  };

  /* --- Băng cá nhân: quấn quanh người, hồi máu (buff bản thân) --- */
  META.bandage_bind = { name: "Bandage Bind", lv: 13, who: "Earle Dickson", forms: ["Băng sáng quấn quanh người, hồi máu", "2 dải băng + chữ thập", "+ cột sáng xanh", "Băng vàng + hoa sáng"] };
  SK.bandage_bind = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, nR = f >= 2 ? 2 : 1, col = gold ? 0xffd860 : 0xfff4e0;
    const bt = TEX.band || (TEX.band = cvTex(64, (g, n) => { g.fillStyle = "#fff6e8"; g.fillRect(0, 0, n, n); g.fillStyle = "rgba(230,190,150,.9)"; g.fillRect(n * 0.3, 0, n * 0.4, n); g.fillStyle = "rgba(200,150,110,.6)"; for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) g.fillRect(n * (0.36 + j * 0.2), i * n / 6 + 3, 4, 4); }, true));
    rune(F, "hex", "latin", 0x7dff9a, 3.6, 1.8, 0, { mode: "pulse", rate: 5, amp: 0.1, op: 0.7 }); aura(F, 0x7dff9a, 0xffffff, 0.9, 2.6, 1.6, 0);
    for (let r = 0; r < nR; r++) prop(r * 0.12, 1.7, () => { const g = new THREE.Group(), curve = helix(1.0, 2.4, 2.2, 80), mt = new THREE.MeshBasicMaterial({ map: bt, color: col, transparent: true, side: THREE.DoubleSide }), geo = new THREE.TubeGeometry(curve, 160, 0.13, 4), m = new THREE.Mesh(geo, mt);
      m.scale.set(1, 1, 0.35); g.add(m); g.position.set(F.x, 0.2, F.z); g.rotation.y = r * PI; bt.repeat.set(20, 1); const N = geo.index.count;
      return { g, upd: (k, t) => { geo.setDrawRange(0, Math.floor(N * Math.min(1, k / 0.35))); g.rotation.y = r * PI + t * 2.5; const s = 1 - Math.max(0, k - 0.65) / 0.35 * 0.4; g.scale.set(s, 1, s); mt.opacity = 1 - Math.max(0, k - 0.75) / 0.25; } }; });
    if (f >= 2) textPop(F.clone().setY(3), "✚", gold ? "#ffe9a0" : "#ff4a4a", 1.6, 1.2, 0.4, { rise: 0.6 });
    emitter(30 + f * 15, i => { const a = R(0, PI * 2), r = R(0.3, 1.3); return { p: F.clone().add(new V3(Math.cos(a) * r, R(0, 0.4), Math.sin(a) * r)), v: new V3(0, R(1.2, 2.6), 0), t0: R(0.2, 1.2), life: R(0.5, 0.9), size: R(0.2, 0.38), col: i % 2 ? 0x7dff9a : 0xffffff }; }, { grav: 0, drag: 0.5 });
    if (f >= 3) pillar(F, 0x7dff9a, 0xffffff, 1.1, 4.5, 0.9, 0.4, { speed: 2.5, widen: 0.2 });
    if (gold) lotus(F, 0xffd860, 0xfff6c0, 1.5, 1.4, 0.3);
    upg(F, f, 0x7dff9a, 0.4, 2);
  };
  /* --- Prism Ray: bậc thấp chiếu / quét về phía quái, bậc cao toả rộng rồi xoay vòng --- */
  META.prism_ray = { name: "Prism Ray", lv: 14, who: "Isaac Newton", forms: ["7 tia cầu vồng chiếu về phía quái", "Tia dài, quét qua lại", "Toả rộng rồi xoay 1 vòng", "2 lăng kính vàng xoay vòng"] };
  SK.prism_ray = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), dist = F.distanceTo(T), L = Math.max(4.5 + f * 0.6, dist + 2), nP = gold ? 2 : 1, th0 = Math.atan2(-d.z, d.x), spread = [0.05, 0.07, 0.13, 0.15][f - 1], sweep = [0.12, 0.45, 0.6, 0.6][f - 1], dur = f >= 3 ? 2.0 : 1.5;
    const C = F.clone().addScaledVector(d, 0.9).setY(2.4), tilt = -Math.atan2(1.6, L * 0.8);
    shadowUnder(f >= 3 ? F : T, f >= 3 ? L * 1.6 : 4, dur, 0);
    for (let p = 0; p < nP; p++) prop(p * 0.1, dur, () => { const g = new THREE.Group(), pm = flowMat({ c1: gold ? 0xffd860 : 0x9ae8ff, c2: 0xffffff, rep: [1, 1], spd: [0.3, -0.4], fres: 1.6, cut: -0.4, gain: 1.4, fade: [0, 0, 0, 0] });
      const prism = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.6, 3), pm); prism.rotation.z = PI / 2; g.add(prism);
      const rays = RAINBOW7.map((c, i) => { const r = new THREE.Mesh(new THREE.PlaneGeometry(L, 0.34 + f * 0.04), basic(TEX.beam, c, true, 1)); r.geometry.rotateX(-PI / 2); r.geometry.translate(L / 2, 0, 0); const piv = new THREE.Group(); piv.add(r); g.add(piv); return { piv, i }; });
      g.position.copy(C);
      return { g, upd: (k, t) => { pm.uniforms.uTime.value = t; prism.rotation.x = t * 3; g.scale.setScalar(pop(k, 0.08, 0.9)); const on = Math.min(1, Math.max(0, (k - 0.12) / 0.1));
        let base = th0 + Math.sin((k - 0.12) * PI * 2.2) * sweep;   /* quét qua lại về phía quái */
        if (f >= 3 && k > 0.5) base += ((k - 0.5) / 0.5) * PI * 2 * (p ? -1 : 1);   /* bậc cao: xoay vòng quanh người */
        const sp = spread * (f >= 3 ? 1 + Math.min(1, Math.max(0, (k - 0.3) / 0.2)) * 1.2 : 1);
        rays.forEach(r => { r.piv.rotation.set(0, base + (r.i - 3) * sp + p * PI, tilt); r.piv.children[0].material.opacity = on * (0.8 + 0.2 * Math.sin(t * 20 + r.i)) * (1 - Math.max(0, k - 0.88) / 0.12); r.piv.children[0].scale.x = on; }); } }; });
    bolt(C.clone().setY(14), C, 0xffffff, f >= 3 ? 0.5 : 0.3, 0.5, 0, { jag: 0.05 });   /* tia trắng từ trời vào lăng kính */
    for (let i = 0; i < 7; i++) emitter(12 + f * 4, q => { const a = f >= 3 ? R(0, PI * 2) : th0 + R(-0.5, 0.5), r = R(1, L), p = C.clone().setY(0).add(new V3(Math.cos(a) * r, R(0.1, 0.8), -Math.sin(a) * r)); return { p, v: rv(0.6).setY(R(0.5, 1.5)), t0: 0.3 + R(0, dur - 0.5), life: R(0.3, 0.6), size: R(0.25, 0.4), col: RAINBOW7[i] }; }, { grav: 0, drag: 1 });
    const hit = 0.3; glow(T.clone().setY(1.2), 0xffffff, 2.5 + f * 0.5, 0.25, hit, { flash: true }); sparks(T.clone().setY(1), RAINBOW7, 20 + f * 10, 5, 0.3, 0.6, hit, { up: 1 });
    if (f >= 3) prop(dur * 0.5, dur * 0.5, () => { const g = new THREE.Group(); RAINBOW7.forEach((c, i) => { const m = new THREE.Mesh(new THREE.RingGeometry(L * 0.55 + i * 0.12, L * 0.55 + i * 0.12 + 0.12, 64).rotateX(-PI / 2), basic(null, c, true, 0.8)); g.add(m); }); g.position.set(F.x, 0.06, F.z);
      return { g, upd: k => { g.scale.setScalar(0.5 + k * 0.7); g.children.forEach(m => m.material.opacity = 0.8 * pop(k, 0.15, 0.6)); } }; });
    upg(f >= 3 ? F : T, f, gold ? 0xffd860 : 0xffffff, 0.4, f >= 3 ? L * 0.6 : 2); task(0.3, 0.01, () => shake(0.08 + f * 0.04));
  };

  /* --- Mary Anning: đầu khủng long cổ dài (sọ xương), mỗi mốc bậc thêm 1 đầu, tối đa 4 đầu = 4 đòn --- */
  function dinoSkull(gold) {
    const root = new THREE.Group(), inner = new THREE.Group(); inner.rotation.y = -PI / 2; root.add(inner); const bm = boneMat(gold);
    const up = new THREE.Shape(); up.moveTo(-0.6, 0); up.lineTo(-0.62, 0.42); up.quadraticCurveTo(-0.35, 0.72, 0.05, 0.52); up.lineTo(0.95, 0.2); up.quadraticCurveTo(1.12, 0.1, 1.05, 0); up.lineTo(-0.6, 0);
    const eye = new THREE.Path(); eye.absarc(-0.22, 0.36, 0.13, 0, PI * 2, true); up.holes.push(eye); const nos = new THREE.Path(); nos.absarc(0.72, 0.2, 0.05, 0, PI * 2, true); up.holes.push(nos);
    const skull = new THREE.Mesh(new THREE.ExtrudeGeometry(up, { depth: 0.46, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2, curveSegments: 10 }).translate(0, 0, -0.23), bm); inner.add(skull);
    const jawG = new THREE.Group(); jawG.position.set(-0.5, 0.02, 0); inner.add(jawG);
    const jw = new THREE.Shape(); jw.moveTo(0, 0); jw.lineTo(1.4, 0); jw.lineTo(1.4, -0.08); jw.quadraticCurveTo(0.7, -0.24, 0, -0.2); jw.lineTo(0, 0);
    jawG.add(new THREE.Mesh(new THREE.ExtrudeGeometry(jw, { depth: 0.36, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 1 }).translate(0, 0, -0.18), bm));
    const tm = boneMat(true); for (let i = 0; i < 7; i++) [-1, 1].forEach(s => { const x = 0.1 + i * 0.13, tu = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.16, 4), tm); tu.position.set(x, -0.06, s * 0.2); tu.rotation.x = PI; inner.add(tu);
      const tl = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.13, 4), tm); tl.position.set(x + 0.55, 0.06, s * 0.15); jawG.add(tl); });
    const ey = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: gold ? 0xffd040 : 0xff5030, blending: ADD, transparent: true, depthWrite: false })); ey.position.set(-0.22, 0.36, 0); ey.scale.setScalar(0.45); inner.add(ey);
    return { g: root, bm, tm, jaw: jawG };
  }
  META.plesio_snap = { name: "Plesio Snap", lv: 15, who: "Mary Anning", forms: ["1 đầu khủng long cắn 1 đòn", "2 đầu cắn 2 đòn", "3 đầu cắn 3 đòn", "4 đầu hoá thạch vàng cắn 4 đòn"] };
  SK.plesio_snap = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), side = new V3(-d.z, 0, d.x), now = CLOCK_MS();
    const idx = (!LAST.plesio || now - LAST.plesio > 800) ? 0 : (LAST.plesioI + 1) % 4; LAST.plesio = now; LAST.plesioI = idx;
    const base = F.clone().addScaledVector(side, [1.6, -1.6, 2.4, -2.4][idx]).addScaledVector(d, [0.6, 0.6, -0.6, -0.6][idx]), tgt = T.clone().setY(1.2), sc = 1.6 + f * 0.12;
    rune(base, "circle", "ogham", gold ? 0xffd860 : 0xe8d8b0, 2.4, 1.1, 0, { mode: "spin", spin: 3, op: 0.8 }); decal(base, TEX.crack, 0xffffff, 2.5, 1.2, 0, { add: false, op: 0.8, ro: 3 });
    sparks(base.clone().setY(0.2), [0xb8a080, 0xd8c8a8], 18, 4, 0.3, 0.6, 0.05, { up: 1.5 });
    prop(0, 1.0, () => { const H = dinoSkull(gold), g = new THREE.Group(); g.add(H.g); const vs = [], vm = boneMat(gold);
      for (let i = 0; i < 6; i++) { const v = new THREE.Mesh(new THREE.SphereGeometry(0.24 - i * 0.015, 8, 6), vm); v.scale.set(1, 0.75, 1); g.add(v); vs.push(v); }
      const P = new V3(), mid = base.clone().lerp(tgt, 0.45).setY(3.2), back = new V3();
      return { g, upd: (k, t) => { [H.bm, H.tm, vm].forEach(m => m.uniforms.uTime.value = t); const rise = Math.min(1, k / 0.25), lunge = Math.min(1, Math.max(0, (k - 0.25) / 0.2)), ret = Math.max(0, (k - 0.65) / 0.35);
        if (lunge <= 0) P.copy(base).setY(-1.2 + rise * 3.4); else bez(base.clone().setY(2.2), mid, tgt.clone().addScaledVector(d, -0.6), lunge * lunge, P);
        if (ret > 0) P.lerp(base.clone().setY(-1.5), ret * ret);
        H.g.position.copy(P); const aim = lunge > 0 && ret < 0.3 ? new V3().subVectors(tgt, P) : new V3().subVectors(tgt, base).setY(lunge > 0 ? 0 : 2.5); H.g.quaternion.copy(basisQ(aim.lengthSq() > 1e-4 ? aim : d, side.clone().multiplyScalar(idx % 2 ? -1 : 1).add(new V3(0, 0.5, 0)))); H.g.scale.setScalar(sc);   /* nghiêng đầu: thấy rõ hàm răng từ trên xuống */
        H.jaw.rotation.z = -(k < 0.38 ? 0.15 + rise * 0.5 : k < 0.46 ? 0.65 : 0.05);   /* há miệng → đớp */
        back.subVectors(P, base).setY(0); vs.forEach((v, i) => { const u = (i + 1) / 7; v.position.copy(base).lerp(P, 1 - u).setY(P.y * (1 - u) - u * 0.3 + Math.sin(u * PI) * 0.8); v.position.addScaledVector(d, -0.5 * u); v.scale.setScalar(sc * (1 - u * 0.3)); });
        g.visible = k < 0.98; } }; });
    const hit = 0.45; glow(tgt, 0xffffff, 2.5 + f * 0.4, 0.2, hit, { flash: true }); sparks(tgt, [0xffffff, 0xe8d8b0, 0xff6040], 18 + f * 6, 6, 0.25, 0.45, hit, { up: 1 }); shock(T, 0xe8d8b0, 1.8 + f * 0.3, 0.35, hit);
    textPop(tgt.clone().add(new V3(0, 1, 0)), "CHOMP!", gold ? "#ffe9a0" : "#fff0d8", 1.4, 0.5, hit); task(hit, 0.01, () => shake(0.1 + f * 0.03));
    if (idx === 0) upg(T, f, gold ? 0xffd860 : 0xe8d8b0, hit, 2);
  };

  /* --- Gutenberg: con dấu gỗ linh hồn dập xuống --- */
  META.press_slam = { name: "Press Slam", lv: 16, who: "Johannes Gutenberg", forms: ["Con dấu linh hồn dập xuống, in chữ sáng", "+ tờ giấy in bay ra", "Dập 2 lần, chữ to hơn", "Con dấu vàng + sóng lớn"] };
  SK.press_slam = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, sc = 1 + (f - 1) * 0.18, drop = 0.42, nS = f >= 3 ? 2 : 1, c1 = gold ? 0xffc030 : 0xffa860;
    shadowUnder(T, 4 * sc, 1.6, 0);
    for (let s = 0; s < nS; s++) { const dl = s * 0.5, hit = dl + drop;
      prop(dl, 0.95, () => { const g = new THREE.Group(), gm = ghostMat(c1, 0xfff0d0, { fres: 0.8, cut: -0.5 }), blk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 2.4), gm); blk.position.y = 0.35; g.add(blk);
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 1.3, 12), gm); neck.position.y = 1.35; g.add(neck);
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.62, 16, 12), gm); knob.position.y = 2.3; knob.scale.y = 0.85; g.add(knob);
        const face = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2).rotateX(PI / 2), basic(letterTex(gold), c1, true, 1)); face.position.y = 0.01; g.add(face);
        g.position.set(T.x, 0, T.z); g.rotation.y = Math.atan2(F.x - T.x, F.z - T.z) + s * 0.4;
        return { g, upd: (k, t) => { gm.uniforms.uTime.value = t; const tt = t; let y; if (tt < drop) { const e = tt / drop; y = 7 * (1 - e * e); } else if (tt < drop + 0.18) y = 0; else y = (tt - drop - 0.18) * 4;
          g.position.y = y; const sq = tt > drop && tt < drop + 0.1 ? 0.85 : 1; g.scale.set(sc * (2 - sq), sc * sq, sc * (2 - sq)); gm.uniforms.uAlpha.value = 0.95 * pop(k, 0.06, 0.6); face.material.opacity = pop(k, 0.06, 0.6); } }; });
      decal(T, letterTex(gold), 0xffffff, 3.4 * sc * (1 + s * 0.25), 1.4, hit, { op: 1, hold: 0.6, ro: 4 });
      glow(T.clone().setY(0.6), 0xfff0c0, 3 + f, 0.25, hit, { flash: true }); shock(T, c1, 2.6 * sc, 0.45, hit); sparks(T.clone().setY(0.3), [0xd8c8a8, 0xffe0a0, c1], 35 + f * 12, 6, 0.35, 0.7, hit, { up: 1.2 }); task(hit, 0.01, () => shake(0.16 + f * 0.05)); }
    if (f >= 2) for (let i = 0; i < 3 + f; i++) prop(drop + i * 0.05, 1.2, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.95), new THREE.MeshBasicMaterial({ map: letterTex(gold), color: 0xf4ead0, side: THREE.DoubleSide, transparent: true })); g.add(m); const a = R(0, PI * 2), sp = R(2, 4);
      return { g, upd: (k, t) => { g.position.set(T.x + Math.cos(a) * sp * k, 1 + Math.sin(k * PI) * 2.5, T.z + Math.sin(a) * sp * k); m.rotation.set(t * 5, t * 4, 0); m.material.opacity = 1 - Math.max(0, k - 0.7) / 0.3; } }; });
    upg(T, f, gold ? 0xffd860 : c1, drop, 2.5 * sc);
  };

  /* --- Gutenberg: 2 vòng phù văn kẹp vùng quái (dưới đất + trên trời), mưa chữ cổ của các vị thần --- */
  META.typeset_rain = { name: "Typeset Rain", lv: 16, who: "Johannes Gutenberg", forms: ["2 vòng kẹp quái, mưa chữ cổ", "Mưa dày hơn + chớp trúng", "Vòng xoay ngược nhau + cột sáng", "Chữ vàng + sóng lớn"] };
  SK.typeset_rain = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 3.2 + f * 0.3, top = 5.6, dur = 2.0, n = 16 + f * 9, c1 = gold ? 0xffd860 : 0x9ad8ff, sc = GODS[(rk * 3) % GODS.length], spin = f >= 3 ? 1.4 : 0;
    shadowUnder(T, R0 * 2.2, dur, 0);
    rune(T, "circle", sc, c1, R0 * 2, dur, 0, { mode: spin ? "spin" : "static", spin, op: 0.95 });
    rune(T, "seal", GODS[(rk * 3 + 2) % GODS.length], c1, R0 * 2, dur, 0.1, { mode: spin ? "spin" : "static", spin: -spin, op: 0.9, lift: top });   /* vòng trên trời */
    task(0.2, dur - 0.2, () => { const mt = flowMat({ c1, c2: 0xffffff, rep: [3, 1], spd: [0.1, 1.2], fres: 1, cut: 0.35, fade: [0, 0, 0.1, 0.1] }), m = mesh(new THREE.CylinderGeometry(R0, R0, top, 40, 1, true).translate(0, top / 2, 0), mt); m.position.set(T.x, 0, T.z); SC.add(m);
      return { upd: (k, t) => { mt.uniforms.uTime.value = t; mt.uniforms.uAlpha.value = 0.35 * pop(k, 0.15, 0.8); }, end: () => kill(m) }; });   /* màn sáng mờ nối 2 vòng */
    const cols = gold ? ["#fff0a0", "#ffd860"] : ["#d8f0ff", "#9ad8ff", "#ffffff"];
    for (let i = 0; i < n; i++) { const a = R(0, PI * 2), r = Math.sqrt(Math.random()) * R0 * 0.9, P = T.clone().add(new V3(Math.cos(a) * r, 0, Math.sin(a) * r)), dl = 0.3 + i * ((dur - 0.9) / n), s = GODS[(Math.random() * GODS.length) | 0], tex = glyphTex(s, (Math.random() * 12) | 0, cols[i % cols.length]), fall = 0.32;
      prop(dl, fall + 0.25, () => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, blending: ADD, transparent: true, depthWrite: false })), g = new THREE.Group(); g.add(sp);
        const tr = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c1, blending: ADD, transparent: true, depthWrite: false })); tr.scale.set(0.4, 1.6, 1); g.add(tr);
        return { g, upd: (k, t) => { const e = Math.min(1, t / fall); g.position.set(P.x, top - 0.3 - e * e * (top - 0.6), P.z); sp.scale.setScalar((1.4 + f * 0.12) * (t > fall ? 1 + (t - fall) * 3 : 1)); tr.position.y = 0.8; tr.material.opacity = t > fall ? 0 : 0.6; sp.material.opacity = t > fall ? 1 - (t - fall) / 0.25 : 1; } }; });
      sparks(P.clone().setY(0.4), [c1, 0xffffff], 5 + f, 3.5, 0.2, 0.3, dl + fall, { up: 1.5 }); }
    for (let h = 0; h < 3 + f; h++) { const hit = 0.65 + h * ((dur - 1) / (3 + f)); glow(T.clone().setY(1.2), 0xffffff, 2 + f * 0.4, 0.18, hit, { flash: true }); sparks(T.clone().setY(1.2), [c1, 0xffffff], 10 + f * 4, 5, 0.25, 0.4, hit, { up: 1 }); task(hit, 0.01, () => shake(0.05 + f * 0.02)); }   /* chữ trúng quái */
    if (f >= 3) pillar(T, c1, 0xffffff, 0.7, top, 0.6, dur - 0.7, { speed: 4, widen: 0.6 });
    upg(T, f, c1, dur - 0.7, R0 * 0.7);
  };

  /* --- Da Vinci: máy bay cánh chim bằng gỗ lao vào quái --- */
  function ornithopter(gold) {
    const g = new THREE.Group(), wm = woodMat(gold), cm = new THREE.MeshBasicMaterial({ map: TEX.orn || (TEX.orn = cvTex(128, (c, n) => { c.fillStyle = "#efe2c2"; c.fillRect(0, 0, n, n); c.strokeStyle = "rgba(120,85,45,.75)"; c.lineWidth = 3; for (let i = 0; i <= 8; i++) { c.beginPath(); c.moveTo(0, n); c.lineTo(i * n / 8, 0); c.stroke(); } })), color: gold ? 0xffe9a0 : 0xffffff, side: THREE.DoubleSide, transparent: true });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 2.6, 8).rotateX(PI / 2), wm); g.add(body);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 8).rotateX(PI / 2), wm); nose.position.z = 1.6; g.add(nose);
    const ws = new THREE.Shape(); ws.moveTo(0, 0.5); ws.quadraticCurveTo(1.6, 1.0, 3.4, 0.5); ws.lineTo(2.9, 0.1); ws.lineTo(2.4, -0.25); ws.lineTo(1.8, 0.0); ws.lineTo(1.2, -0.45); ws.lineTo(0.6, -0.1); ws.lineTo(0, -0.6); ws.lineTo(0, 0.5);
    const wings = [-1, 1].map(s => { const piv = new THREE.Group(), mem = new THREE.Mesh(new THREE.ShapeGeometry(ws).rotateX(-PI / 2), cm); mem.scale.x = s; piv.add(mem);
      [0.5, 1.4, 2.4].forEach((x, i) => { const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.4 - i * 0.25, 5), wm); sp.position.set(s * x, 0.02, -0.1); sp.rotation.x = PI / 2; piv.add(sp); });
      const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 3.4, 6).rotateZ(PI / 2), wm); lead.position.set(s * 1.7, 0.03, -0.55); piv.add(lead); piv.position.z = 0.2; g.add(piv); return piv; });
    const ts = new THREE.Shape(); ts.moveTo(0, 0); ts.lineTo(-0.8, -1.2); ts.quadraticCurveTo(0, -1.0, 0.8, -1.2); ts.lineTo(0, 0); const tail = new THREE.Mesh(new THREE.ShapeGeometry(ts).rotateX(-PI / 2), cm); tail.position.z = -1.2; g.add(tail);
    return { g, wm, wings };
  }
  META.aerial_screw = { name: "Ornithopter Dive", lv: 17, who: "Leonardo da Vinci", forms: ["Máy bay chim gỗ lao vào quái", "Cánh lớn + vệt gió", "2 máy bay chim", "3 máy bay cánh vàng"] };
  SK.aerial_screw = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), side = new V3(-d.z, 0, d.x), nB = gold ? 3 : f >= 3 ? 2 : 1, fly = 0.75, sc = 0.75 + f * 0.1, R0 = 3 + f * 0.3;
    for (let b = 0; b < nB; b++) { const off = b === 0 ? 0 : b === 1 ? 1 : -1, dl = b * 0.15, A = F.clone().addScaledVector(d, -1.2).addScaledVector(side, off * 1.5).setY(1.4), C = F.clone().lerp(T, 0.35).addScaledVector(side, off * 2.5).setY(6), B = T.clone().setY(0.6), P = new V3(), P2 = new V3();
      prop(dl, fly, () => { const o = ornithopter(gold);
        return { g: o.g, upd: (k, t) => { o.wm.uniforms.uTime.value = t; const u = k * k; bez(A, C, B, u, P); bez(A, C, B, Math.min(1, u + 0.02), P2); o.g.position.copy(P); o.g.quaternion.copy(basisQ(P2.sub(P).lengthSq() > 1e-6 ? P2 : d));
          const fl = Math.sin(t * (k < 0.6 ? 22 : 8)) * (k < 0.6 ? 0.55 : 0.2); o.wings[0].rotation.z = fl; o.wings[1].rotation.z = -fl; o.g.scale.setScalar(sc * Math.min(1, t / 0.1)); } }; });
      emitter(40, i => { const u = i / 40, p = bez(A, C, B, u); return { p: p.add(rv(0.4)), v: rv(0.6), t0: dl + Math.sqrt(u) * fly, life: R(0.3, 0.55), size: R(0.2, 0.4), col: i % 3 ? 0xffffff : 0xe8dcc0 }; }, { grav: 0, drag: 2 });   /* vệt gió + lông vũ */
      const hit = dl + fly; glow(B, 0xffffff, 3 + f, 0.25, hit, { flash: true }); glow(B, 0xffc070, 5 + f, 0.4, hit, { flash: true }); shock(T, 0xffe8c0, R0, 0.5, hit);
      sparks(B, [0x8a5a2a, 0xc89050, 0xefe2c2], 30 + f * 10, 8, 0.3, 0.8, hit, { up: 1.5 }); task(hit, 0.01, () => shake(0.14 + f * 0.05)); }
    decal(T, TEX.crack, 0xffffff, R0 * 1.4, 1.2, fly, { add: false, op: 0.8, ro: 3 });
    if (f >= 2) for (let i = 0; i < 2; i++) decal(T, TEX.ring, 0xe8f4ff, R0 * 2.4, 0.5, fly + i * 0.12, { mode: "expand", expand: 0.8, op: 0.8 });
    upg(T, f, gold ? 0xffd860 : 0xffe0b0, fly, R0 * 0.7);
  };

  /* --- Da Vinci: ấn phong ấn Người Vitruvius (người dang tay chân trong hình tròn + hình vuông) --- */
  function vitruvianTex() { return TEX.vit || (TEX.vit = cvTex(512, (g, n) => { g.translate(n / 2, n / 2); g.strokeStyle = g.fillStyle = "#fff"; g.lineCap = g.lineJoin = "round"; g.shadowColor = "#fff"; g.shadowBlur = 10;
    const H = 340, Rc = H * 0.61, cy = 0, nav = 0, sqTop = nav + Rc - H, line = (w, ...p) => { g.lineWidth = w; g.beginPath(); g.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]); g.stroke(); };
    g.lineWidth = 6; g.beginPath(); g.arc(0, nav, Rc, 0, PI * 2); g.stroke(); g.strokeRect(-H / 2, sqTop, H, H);   /* tròn tâm ở rốn, vuông cạnh = chiều cao người, chung đáy */
    const foot = nav + Rc, head = sqTop, neck = head + H * 0.13, sh = head + H * 0.18, crotch = head + H * 0.5;
    g.lineWidth = 5; g.beginPath(); g.ellipse(0, head + H * 0.065, H * 0.05, H * 0.065, 0, 0, PI * 2); g.stroke();
    line(7, 0, neck, 0, crotch); line(5, -H * 0.12, sh, H * 0.12, sh); line(5, -H * 0.09, crotch - 4, H * 0.09, crotch - 4);
    line(5, -H * 0.12, sh, -H / 2, sh); line(5, H * 0.12, sh, H / 2, sh);   /* tay ngang chạm cạnh vuông */
    const ra = Math.asin((sh - nav) / Rc) - 0.22, ax = Math.cos(ra) * Rc, ay = nav + Math.sin(ra) * Rc; line(4, -H * 0.12, sh, -ax, ay); line(4, H * 0.12, sh, ax, ay);   /* tay giơ chạm vòng tròn */
    line(5, -H * 0.05, crotch, -H * 0.05, foot); line(5, H * 0.05, crotch, H * 0.05, foot);   /* chân khép chạm đáy */
    const la = PI / 2 - 0.33, lx = Math.cos(la) * Rc, ly = nav + Math.sin(la) * Rc; line(4, -H * 0.05, crotch, -lx, ly); line(4, H * 0.05, crotch, lx, ly);   /* chân dạng chạm vòng tròn */
    g.font = "bold 22px Georgia, serif"; g.textAlign = "center"; g.save(); g.scale(-1, 1); const s = "OTTAVIRTUVIUS·OMO·SENZA·MISURA·"; for (let i = 0; i < s.length; i++) { const a = i / s.length * PI * 2; g.save(); g.rotate(a); g.fillText(s[i], 0, -Rc - 24); g.restore(); } g.restore();   /* chữ viết ngược kiểu Da Vinci */
  })); }
  META.mirror_script = { name: "Vitruvian Seal", lv: 17, who: "Leonardo da Vinci", forms: ["Chưởng ấn Người Vitruvius phong ấn quái", "Ấn to + sóng phong ấn", "2 ấn đứng chéo + ấn đất", "Ấn vàng + vòng chữ ngược"] };
  SK.mirror_script = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), fly = 0.38, col = gold ? 0xffd860 : 0xc8b8ff, sz = 2.4 + f * 0.3, A = F.clone().setY(1.5).addScaledVector(d, 0.6), B = T.clone().setY(1.8), tx = vitruvianTex();
    glow(A, col, 2.5, 0.3, 0);
    prop(0, fly, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), basic(tx, col, true, 1)); g.add(m); const P = new V3();
      return { g, upd: (k, t) => { P.lerpVectors(A, B, k * k); g.position.copy(P); g.lookAt(B.clone().add(d)); m.rotation.z = t * 8; g.scale.setScalar(1 + k * (sz - 1)); } }; });   /* ấn bay ra từ lòng bàn tay */
    emitter(40, i => { const u = i / 40, p = A.clone().lerp(B, u * u); return { p: p.add(rv(0.3)), v: rv(0.5), t0: u * fly, life: 0.4, size: R(0.25, 0.45), col: i % 2 ? col : 0xffffff }; }, { grav: 0, drag: 2 });
    const hit = fly, nV = f >= 3 ? 2 : 1;
    glow(B, 0xffffff, 3 + f, 0.25, hit, { flash: true }); decal(T, tx, col, sz * 1.6, 2.2, hit, { mode: "converge", op: 1, hold: 0.8 });
    for (let v = 0; v < nV; v++) prop(hit, 2.2, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(sz, sz), basic(tx, col, true, 0.9)); g.add(m); g.position.copy(B); g.rotation.y = Math.atan2(d.x, d.z) + v * PI / 2;
      return { g, upd: (k, t) => { m.rotation.z = t * 0.8 * (v ? -1 : 1); m.material.opacity = 0.9 * pop(k, 0.08, 0.75); g.scale.setScalar(1 + 0.08 * Math.sin(t * 5)); } }; });
    if (f >= 2) for (let i = 0; i < 2; i++) decal(T, TEX.ring, col, sz * 2.2, 0.6, hit + i * 0.15, { mode: "expand", expand: 0.6, op: 0.8 });
    for (let i = 0; i < 4; i++) textPop(B.clone().add(new V3(R(-0.6, 0.6), 0.9, R(-0.6, 0.6))), "?", gold ? "#ffe9a0" : "#d8c8ff", 0.8, 1.0, hit + 0.2 + i * 0.3, { rise: 0.6 });
    for (let i = 0; i < 3; i++) orbitStar(T, col, 0.9, 2.9, 2.0, hit, i / 3);
    if (gold) rune(T, "circle", "latin", 0xffd860, sz * 2.4, 2.0, hit, { mode: "spin", spin: -0.8, op: 0.7 });
    upg(T, f, col, hit, 2.5); task(hit, 0.01, () => shake(0.08 + f * 0.03));
  };

  /* --- Bell: sóng điện thoại hình lưỡi liềm lao vào quái rồi lan sóng xung quanh --- */
  META.ring_shock = { name: "Ring Shock", lv: 18, who: "Alexander Graham Bell", forms: ["3 sóng lưỡi liềm lao vào quái", "4 sóng + sóng lan rộng", "5 sóng + sét điện", "Sóng vàng + sóng lan lớn"] };
  SK.ring_shock = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), n = 2 + f, dist = Math.max(1.5, F.distanceTo(T)), fly = 0.32, c1 = gold ? 0xffd860 : 0x9ad8ff, c2 = 0xffffff;
    const ct = TEX.cres || (TEX.cres = cvTex(64, (g, s) => { const gr = g.createLinearGradient(0, 0, 0, s); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, s, s); const gx = g.createLinearGradient(0, 0, s, 0); gx.addColorStop(0, "rgba(0,0,0,1)"); gx.addColorStop(0.2, "rgba(0,0,0,0)"); gx.addColorStop(0.8, "rgba(0,0,0,0)"); gx.addColorStop(1, "rgba(0,0,0,1)"); g.globalCompositeOperation = "destination-out"; g.fillStyle = gx; g.fillRect(0, 0, s, s); }));
    glow(F.clone().setY(1.2).addScaledVector(d, 0.6), c1, 2.5, 0.4, 0); rune(F, "sun", "greek", c1, 3, 1, 0, { mode: "pulse", rate: 9, amp: 0.12, op: 0.8 });
    const yaw = Math.atan2(d.x, d.z);
    for (let i = 0; i < n; i++) { const dl = i * 0.09, r = 1.5 + f * 0.2 + i * 0.06;
      prop(dl, fly, () => { const g = new THREE.Group(); [[r, 0.7, c1], [r * 0.8, 0.35, c2]].forEach(([rr, w, c]) => { const m = new THREE.Mesh(arcGeo(rr, -0.95, 0.95, w, 24), basic(ct, c, true, 1)); m.position.x = -rr; g.add(m); });
        g.rotation.set(0, yaw - PI / 2, 0); const P = new V3();   /* cung lồi về phía quái */
        return { g, upd: (k, t) => { P.copy(F).addScaledVector(d, 0.6 + k * (dist - 0.6)); g.position.set(P.x, 1.2 + Math.sin(i * 1.7) * 0.25, P.z); g.scale.set(0.6 + k * 0.6, 1, 0.6 + k * 0.6); g.children.forEach(m => m.material.opacity = 1 - Math.max(0, k - 0.85) / 0.15); } }; });
      glow(T.clone().setY(1.2), 0xffffff, 1.6 + f * 0.3, 0.15, dl + fly, { flash: true }); }
    const hit = fly + (n - 1) * 0.09;
    for (let i = 0; i < 2 + f; i++) shock(T, i % 2 ? c2 : c1, 1.8 + i * 0.9, 0.55, hit + i * 0.1, 0.6 + (i % 2) * 0.5);   /* sóng lan ra xung quanh */
    if (f >= 3) for (let i = 0; i < 3; i++) bolt(T.clone().setY(2.6), T.clone().add(new V3(R(-1.6, 1.6), 0.1, R(-1.6, 1.6))), 0xbfe0ff, 0.12, 0.3, hit + i * 0.12);
    textPop(T.clone().setY(2.8), "RING!", gold ? "#ffe9a0" : "#d8f0ff", 1.5, 0.6, hit);
    for (let i = 0; i < 3; i++) orbitStar(T, 0xffe080, 0.9, 2.6, 1.6, hit, i / 3);
    upg(T, f, c1, hit, 2.2); task(hit, 0.01, () => shake(0.1 + f * 0.04));
  };
  /* --- Niépce: chớp sáng + khung ảnh sepia ở quái (không có hộp máy ảnh) --- */
  META.camera_obscura = { name: "Camera Obscura", lv: 19, who: "Nicéphore Niépce", forms: ["Chớp sáng, quái thành ảnh sepia", "Chớp mạnh + bụi ảnh cũ", "Nhiều khung ảnh", "Chớp đôi vàng"] };
  SK.camera_obscura = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, flash = 0.3, yaw = Math.atan2(T.x - F.x, T.z - F.z), hold = 3;
    glow(T.clone().setY(1.5), 0xffffff, 0.6, flash, 0);   /* chấm sáng tụ lại trước khi chớp */
    glow(T.clone().setY(2), 0xffffff, 12 + f * 3, 0.35, flash, { flash: true }); glow(T.clone().setY(1.3), 0xfff4e0, 6 + f, 0.4, flash, { flash: true });
    shock(T, 0xffffff, 3 + f * 0.5, 0.35, flash);
    if (gold) glow(T.clone().setY(1.6), 0xffffff, 10, 0.35, flash + 0.25, { flash: true });
    textPop(T.clone().setY(3.2), "CLICK!", "#fff4e0", 1.4, 0.5, flash);
    const nF = f >= 3 ? 3 : 1;
    for (let i = 0; i < nF; i++) { const off = i ? (i === 1 ? -1 : 1) * 1.5 : 0;
      prop(flash + i * 0.08, hold, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1.25), new THREE.MeshBasicMaterial({ map: sepiaTex(), transparent: true, depthWrite: false, side: THREE.DoubleSide })); g.add(m);
        const s0 = (i ? 1.6 : 2.4) * (1 + (f - 1) * 0.12); g.position.set(T.x + Math.cos(yaw) * off, 1.4 + (i ? 0.4 : 0), T.z - Math.sin(yaw) * off); g.rotation.y = yaw + PI + (i ? off * 0.15 : 0); m.renderOrder = 10;
        return { g, upd: (k, t) => { const inK = Math.min(1, t / 0.15); g.scale.set(s0 * (1.4 - 0.4 * inK), s0 * (1.4 - 0.4 * inK), 1); m.material.opacity = inK * (1 - Math.max(0, k - 0.88) / 0.12); } }; }); }
    decal(T, TEX.dark, 0xffffff, 3.2, hold, flash, { add: false, op: 0.6, hold: 0.9 });
    if (f >= 2) emitter(30 + f * 10, i => ({ p: T.clone().add(new V3(R(-1.5, 1.5), R(0.3, 2.8), R(-1.5, 1.5))), v: new V3(R(-0.3, 0.3), 0.4, R(-0.3, 0.3)), t0: flash + R(0, 1.2), life: R(0.8, 1.5), size: R(0.15, 0.3), col: [0xd8b080, 0xfff0d0][i % 2] }), { grav: 0, drag: 1 });
    upg(T, f, gold ? 0xffd860 : 0xe8c890, flash, 2.4); task(flash, 0.01, () => shake(0.08 + f * 0.03));
  };

  /* --- Röntgen: bàn tay xương X-quang xanh lục trồi lên đập xuống (không còn tấm phim) --- */
  META.skeleton_burst = { name: "Skeleton Burst", lv: 20, who: "Wilhelm Röntgen", forms: ["Bàn tay X-quang trồi lên đập xuống", "Tay lớn + sóng xanh đôi", "+ mảnh xương sáng bắn tung", "Bàn tay X-quang vàng-lục khổng lồ"] };
  SK.skeleton_burst = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, col = gold ? 0xd8ff60 : 0x40ff90, sc = 1 + (f - 1) * 0.22, rise = 0.5, slam = 0.8, d = SDIR(F, T), C = F.clone().addScaledVector(d, 2.2);
    rune(C, "hex", "hiero", col, 3.6 * sc, 1.7, 0, { mode: "static", op: 0.85, hold: 0.8 }); glow(C.clone().setY(0.3), col, 4 * sc, rise, 0);
    prop(0.05, 1.5, () => { const h = boneHand(gold), g = new THREE.Group(), xm = ghostMat(col, 0xe8fff0, { fres: 2, cut: -0.35, gain: 1.3 }); h.g.traverse(x => { if (x.isMesh) x.material = xm; }); g.add(h.g); g.position.copy(C); const yaw = Math.atan2(d.x, d.z);   /* đập về phía quái */
      return { g, upd: (k, t) => { xm.uniforms.uTime.value = t; xm.uniforms.uAlpha.value = 1 - Math.max(0, k - 0.85) / 0.15;
        let y, tilt; if (t < rise) { y = -3.5 + t / rise * 5.5; tilt = 0; } else if (t < slam) { const e = (t - rise) / (slam - rise); y = 2 + Math.sin(e * PI) * 0.6; tilt = e * e * 1.45; } else { y = 2; tilt = 1.45; }
        g.position.y = y * sc * 0.6; g.rotation.set(-tilt, yaw + PI, 0, "YXZ"); g.scale.setScalar(sc * 1.3);
        const curl = t < rise ? 0.6 * (1 - t / rise) : t < slam ? 0 : 0.2; h.fingers.forEach(s => s.rotation.x = curl); } }; });
    emitter(50, i => ({ p: C.clone().add(new V3(R(-1.5, 1.5), 0.1, R(-1.5, 1.5))), v: new V3(0, R(2, 5), 0), t0: R(0, rise), life: R(0.3, 0.6), size: R(0.2, 0.4), col: i % 2 ? col : 0xd0ffe0 }), { grav: 0, drag: 1 });
    glow(C.clone().setY(0.8), col, 6 * sc, 0.3, slam, { flash: true }); shock(C, col, 4 * sc, 0.55, slam); shock(F, col, 5 * sc, 0.6, slam + 0.05);
    if (f >= 2) shock(C, 0xb0ffd0, 5.5 * sc, 0.7, slam + 0.12);
    if (f >= 3) sparks(C.clone().setY(0.4), [col, 0xd0ffe0], 30, 8, 0.35, 0.8, slam, { up: 1.5 });
    upg(C, f, col, slam, 3 * sc); task(slam, 0.01, () => shake(0.2 + f * 0.06));
  };
  /* ---------- CHƯƠNG 2 (Lv.22–36): Sức khoẻ & sự sống – đẹp hơn chương 1, mỗi chiêu 4 hình ---------- */
  function ghostLens(r, col) {   /* thấu kính linh hồn: vành + mặt kính sáng */
    const g = new THREE.Group(), rm = ghostMat(col, 0xffffff, { fres: 0.8, cut: -0.5 }), gm = flowMat({ c1: col, c2: 0xffffff, rep: [1, 1], spd: [0.2, -0.3], fres: 1.6, cut: -0.3, gain: 0.9, fade: [0, 0, 0, 0] });
    g.add(new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.08, 8, 40), rm)); const disc = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 12), gm); disc.scale.z = 0.18; g.add(disc);
    const hd = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.07, r * 0.09, r * 1.2, 8), rm); hd.position.y = -r * 1.55; g.add(hd); return { g, mats: [rm, gm] };
  }
  /* --- Leeuwenhoek: thấu kính phóng to, vi sinh phát sáng tràn ra gặm quái --- */
  META.microbe_swarm = { name: "Microbe Swarm", lv: 22, who: "Antonie van Leeuwenhoek", forms: ["Thấu kính + đàn vi khuẩn que", "+ vi khuẩn xoắn, vệt nhờn", "Đàn đông gấp đôi + thấu kính lớn", "Vi sinh vàng rực"] };
  SK.microbe_swarm = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), col = gold ? 0xffd860 : 0x7dffb0, n = [10, 16, 26, 30][f - 1], L0 = F.clone().addScaledVector(d, 1.4).setY(2.2), R0 = 2.4 + f * 0.3;
    prop(0, 2.1, () => { const o = ghostLens(0.9 + f * 0.15, col); o.g.position.copy(L0); o.g.lookAt(T.clone().setY(2.2));
      return { g: o.g, upd: (k, t) => { o.mats.forEach(m => { m.uniforms.uTime.value = t; m.uniforms.uAlpha.value = pop(k, 0.1, 0.8); }); o.g.scale.setScalar(Math.min(1, k / 0.1) * (1 + Math.sin(t * 4) * 0.03)); } }; });
    glow(L0, col, 1.4 + f * 0.2, 0.3, 0.15, { flash: true });
    for (let i = 0; i < n; i++) { const kind = f >= 2 && i % 3 === 2 ? 1 : f >= 3 && i % 5 === 4 ? 2 : 0, dl = 0.3 + i * 0.03, a0 = R(0, PI * 2), rr = R(0.6, R0), ph = R(0, 6), sp = R(2, 4) * (i % 2 ? 1 : -1);
      prop(dl, 1.9 - i * 0.02, () => { const g = new THREE.Group(), mm = flowMat({ c1: col, c2: 0xffffff, rep: [1, 2], spd: [0, -1.5], fres: 1.2, cut: -0.3, gain: 1.4, fade: [0, 0, 0, 0] }); let body;
        if (kind === 0) { body = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), mm); body.scale.set(1, 2.6, 1); }   /* trực khuẩn hình que */
        else if (kind === 1) body = new THREE.Mesh(new THREE.TubeGeometry(helix(0.12, 0.8, 2.5, 30), 40, 0.05, 5), mm);   /* xoắn khuẩn */
        else { body = new THREE.Group(); for (let q = 0; q < 4; q++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), mm); s.position.set((q % 2) * 0.22, ((q / 2) | 0) * 0.22, 0); body.add(s); } }   /* cầu khuẩn chùm */
        g.add(body); const hl = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: col, blending: ADD, transparent: true, depthWrite: false })); hl.scale.setScalar(0.6); hl.material.opacity = 0.6; g.add(hl); const P = new V3(), E = new V3();
        return { g, upd: (k, t) => { mm.uniforms.uTime.value = t; const u = Math.min(1, t / 0.45), a = a0 + t * sp; E.set(T.x + Math.cos(a) * rr, 0.4 + Math.abs(Math.sin(t * 3 + ph)) * 1.4, T.z + Math.sin(a) * rr);
          P.lerpVectors(L0, E, u * u * (3 - 2 * u)); g.position.copy(P); body.rotation.set(t * 5 + ph, t * 3, Math.sin(t * 12 + ph) * 0.6); g.scale.setScalar((1.7 + f * 0.15) * pop(k, 0.05, 0.85)); mm.uniforms.uAlpha.value = 1; } }; }); }
    decal(T, TEX.glow, col, R0 * 2.2, 2, 0.5, { op: 0.45, hold: 0.7 });
    if (f >= 2) decal(T, swirlTex(), col, R0 * 2, 1.8, 0.6, { spin: 1.5, op: 0.4 });
    for (let h = 0; h < 4 + f; h++) { const P = T.clone().add(new V3(R(-1, 1), R(0.6, 1.6), R(-1, 1))), hit = 0.8 + h * 0.18; sparks(P, [col, 0xffffff], 6 + f * 2, 3, 0.2, 0.35, hit, { up: 1 }); glow(P, col, 1 + f * 0.3, 0.15, hit, { flash: true }); }   /* gặm lốp bốp */
    upg(T, f, col, 0.8, R0 * 0.7); task(0.8, 0.01, () => shake(0.06 + f * 0.03));
  };

  /* --- Pasteur: cột lửa xanh 100°C, nước sôi, nấm khói hơi nóng --- */
  META.sterilize_blaze = { name: "Sterilize Blaze", lv: 24, who: "Louis Pasteur", forms: ["Cột lửa xanh + bọt sôi", "Lửa cao hơn + vòng nước sôi", "+ 3 cột phụ, nấm khói", "Lửa xanh viền vàng khổng lồ"] };
  SK.sterilize_blaze = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, hit = 0.35, c1 = 0x2a7bff, c2 = gold ? 0xfff0a0 : 0xbfeaff, R0 = 1.4 + f * 0.3;
    rune(T, "sun", "greek", 0x5aa8ff, R0 * 2.6, 1.6, 0, { mode: "converge", op: 0.9 }); decal(T, TEX.crack, 0xffffff, R0 * 2, 1.6, hit, { add: false, op: 0.7, ro: 3 });
    glow(T.clone().setY(0.3), c1, 2, hit, 0);
    pillar(T, c1, c2, 0.7 + f * 0.18, 5 + f * 1.2, 1.0, hit, { speed: 5, widen: 0.5, top: 0.6 }); pillar(T, 0xffffff, c2, 0.35 + f * 0.08, 4 + f, 0.8, hit + 0.05, { speed: 6.5, widen: 0.3, top: 0.5 });
    glow(T.clone().setY(1.5), 0xffffff, 4 + f, 0.3, hit, { flash: true }); shock(T, c2, R0 * 1.4, 0.5, hit);
    if (f >= 3) for (let i = 0; i < 3; i++) { const a = i / 3 * PI * 2, P = T.clone().add(new V3(Math.cos(a) * R0, 0, Math.sin(a) * R0)); pillar(P, c1, c2, 0.4, 3 + f * 0.5, 0.8, hit + 0.12 + i * 0.07, { speed: 5, widen: 0.4 }); }
    emitter(40 + f * 20, i => { const a = R(0, PI * 2), r = Math.sqrt(Math.random()) * R0 * 1.2; return { p: T.clone().add(new V3(Math.cos(a) * r, 0.1, Math.sin(a) * r)), v: new V3(0, R(0.5, 1.6), 0), t0: hit + R(0, 0.9), life: R(0.25, 0.5), size: R(0.2, 0.45), col: i % 2 ? 0xbfeaff : 0xffffff }; }, { grav: 0, drag: 0.5 });   /* bọt nước sôi */
    if (f >= 2) decal(T, TEX.ring, 0x9ad8ff, R0 * 2.4, 1.0, hit, { mode: "pulse", rate: 14, amp: 0.08, op: 0.8 });
    const top = 4 + f * 1.2; emitter(f >= 3 ? 60 : 30, i => { const cap = i % 3 !== 0, a = R(0, PI * 2), r = cap ? R(0.5, 1.6 + f * 0.3) : R(0, 0.4);   /* nấm khói: thân + mũ */
      return { p: T.clone().add(new V3(Math.cos(a) * r * 0.3, cap ? top : R(0.5, top), Math.sin(a) * r * 0.3)), v: new V3(Math.cos(a) * r * 1.2, cap ? R(0.2, 0.8) : 1, Math.sin(a) * r * 1.2), t0: hit + 0.25 + R(0, 0.3), life: R(0.7, 1.1), size: R(0.6, 1.1) * (1 + f * 0.15), col: 0xd8e8f0 }; }, { grav: 0, drag: 2 });
    textPop(T.clone().setY(3.4), "100°C", gold ? "#fff0a0" : "#bfeaff", 1.5, 0.7, hit);
    upg(T, f, gold ? 0xffd860 : 0x5aa8ff, hit, R0); task(hit, 0.01, () => shake(0.14 + f * 0.05));
  };

  /* --- Pasteur: kim tiêm ánh sáng + giáp tinh thể lục giác --- */
  META.vaccine_shield = { name: "Vaccine Shield", lv: 24, who: "Louis Pasteur", forms: ["Kim tiêm sáng + giáp lục giác", "+ mảnh lục giác bay quanh", "Giáp 2 lớp xoay ngược", "Giáp vàng + hào quang"] };
  SK.vaccine_shield = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, c1 = gold ? 0xffd860 : 0x7ad8ff, inj = 0.45;
    prop(0, inj + 0.3, () => { const g = new THREE.Group(), gm = ghostMat(0xbfeaff, 0xffffff, { fres: 1, cut: -0.5 }), lq = ghostMat(c1, 0xffffff, { fres: 0.4, cut: -0.6 });
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.4, 14, 1, true), gm); g.add(barrel); const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 1, 12), lq); liq.position.y = -0.15; g.add(liq);
      const plunger = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 6), gm); g.add(plunger); const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 14), gm); g.add(thumb);
      const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.03, 0.9, 6), gm); needle.position.y = -1.15; g.add(needle);
      return { g, upd: (k, t) => { [gm, lq].forEach(m => { m.uniforms.uTime.value = t; m.uniforms.uAlpha.value = pop(k, 0.12, 0.8); }); const down = Math.min(1, t / 0.25), push = Math.min(1, Math.max(0, (t - 0.25) / 0.2));
        g.position.set(F.x + 0.35, 5 - down * 2.3, F.z + 0.2); g.rotation.z = 0.35; plunger.position.y = 1.1 - push * 0.8; thumb.position.y = 1.7 - push * 0.8; liq.scale.y = 1 - push * 0.9; liq.position.y = -0.15 - push * 0.45; } }; });
    glow(F.clone().setY(1.6), c1, 2.5, 0.3, inj, { flash: true }); sparks(F.clone().setY(1.6), [c1, 0xffffff], 20, 4, 0.25, 0.4, inj, { up: 1 });
    const nL = f >= 3 ? 2 : 1;
    for (let l = 0; l < nL; l++) prop(inj + l * 0.08, 2.2, () => { const g = new THREE.Group(), r = 1.7 + l * 0.35, sm = flowMat({ c1, c2: 0xffffff, rep: [2, 2], spd: [0.2, -0.4], fres: 1.8, cut: -0.1, gain: 1.2, fade: [0, 0, 0, 0] }), geo = new THREE.IcosahedronGeometry(r, 1);
      const shell = new THREE.Mesh(geo, sm); g.add(shell); const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: gold ? 0xfff0a0 : 0xd8f4ff, transparent: true, blending: ADD, depthWrite: false })); g.add(edge);
      g.position.set(F.x, 1.2, F.z);
      return { g, upd: (k, t) => { sm.uniforms.uTime.value = t; const inK = Math.min(1, t / 0.2), a = pop(k, 0.1, 0.8); g.scale.setScalar(0.6 + 0.4 * (1 - Math.pow(1 - inK, 3))); g.rotation.y = t * (l ? -0.8 : 0.6); sm.uniforms.uAlpha.value = 0.55 * a; edge.material.opacity = a; } }; });
    if (f >= 2) for (let i = 0; i < 6; i++) prop(inj + 0.1, 2.0, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.CircleGeometry(0.35, 6), basic(null, c1, true, 0.8)); g.add(m); const a0 = i / 6 * PI * 2;
      return { g, upd: (k, t) => { const a = a0 + t * 2; g.position.set(F.x + Math.cos(a) * 2.5, 1.2 + Math.sin(t * 3 + i) * 0.5, F.z + Math.sin(a) * 2.5); g.lookAt(F.x, 1.2, F.z); m.material.opacity = 0.8 * pop(k, 0.1, 0.8); } }; });
    rune(F, "hex", "greek", c1, 4.4, 2.2, inj, { mode: "static", op: 0.8 });
    if (gold) aura(F, 0xffd860, 0xfff6c0, 1.0, 3, 1.8, inj);
    upg(F, f, c1, inj, 2.2);
  };

  /* --- Fleming: đốm nấm mốc nở thành vườn hoa phát sáng --- */
  function flowerTex(c) { const key = "fl" + c; return TEX[key] || (TEX[key] = cvTex(128, (g, n) => { g.translate(n / 2, n / 2); const col = "#" + new THREE.Color(c).getHexString();
    for (let i = 0; i < 6; i++) { g.save(); g.rotate(i / 6 * PI * 2); const gr = g.createLinearGradient(0, 0, 0, -56); gr.addColorStop(0, "#ffffff"); gr.addColorStop(1, col); g.fillStyle = gr; g.beginPath(); g.ellipse(0, -30, 15, 28, 0, 0, PI * 2); g.fill(); g.restore(); }
    g.fillStyle = "#fff6b0"; g.beginPath(); g.arc(0, 0, 12, 0, PI * 2); g.fill(); })); }
  META.penicillin_bloom = { name: "Penicillin Bloom", lv: 26, who: "Alexander Fleming", forms: ["Nấm mốc lan, hoa sáng nở quanh người", "Vườn hoa dày hơn + bào tử", "Hoa to + mưa cánh hoa", "Vườn hoa vàng"] };
  SK.penicillin_bloom = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, c1 = gold ? 0xffd860 : 0x5affb0, R0 = 2.6 + f * 0.4, n = [8, 12, 16, 20][f - 1], dur = 2.4;
    for (let i = 0; i < 6 + f * 2; i++) { const a = R(0, PI * 2), r = R(0, R0); decal(F.clone().add(new V3(Math.cos(a) * r, 0, Math.sin(a) * r)), TEX.glow, i % 2 ? 0x3ad8a0 : 0x7ab8ff, R(1, 2), dur, i * 0.04, { mode: "expand", expand: 0.8, op: 0.55, hold: 0.7 }); }   /* đốm mốc loang */
    decal(F, swirlTex(), c1, R0 * 2.2, dur, 0.1, { spin: 0.6, op: 0.4 });
    for (let i = 0; i < n; i++) { const a = i / n * PI * 2 + R(-0.2, 0.2), r = R(0.9, R0), P = F.clone().add(new V3(Math.cos(a) * r, 0, Math.sin(a) * r)), dl = 0.25 + r / R0 * 0.4, fc = [0x2ad890, 0x4a9aff, 0xff7ac8, 0x8adf3a][i % 4], h = R(0.5, 1.1) * (1 + f * 0.12);
      prop(dl, dur - dl, () => { const g = new THREE.Group(), stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, h, 5).translate(0, h / 2, 0), basic(null, 0x5adf7a, true, 0.9)); g.add(stem);
        const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: flowerTex(gold ? 0xffd860 : fc), transparent: true, depthWrite: false })); fl.position.y = h; g.add(fl); g.position.copy(P);
        return { g, upd: (k, t) => { const e = Math.min(1, t / 0.35), o = 1 - Math.max(0, k - 0.8) / 0.2; stem.scale.y = e + 0.01; fl.position.y = h * e; fl.scale.setScalar((0.2 + 0.8 * Math.min(1, Math.max(0, (t - 0.2) / 0.3))) * (0.8 + f * 0.12) * (1 + Math.sin(t * 4 + i) * 0.05)); fl.material.rotation = t * 0.5; fl.material.opacity = o; stem.material.opacity = 0.9 * o; } }; }); }
    if (f >= 2) emitter(40 + f * 15, i => { const a = R(0, PI * 2), r = R(0.3, R0); return { p: F.clone().add(new V3(Math.cos(a) * r, R(0.2, 1), Math.sin(a) * r)), v: new V3(0, R(0.4, 1.2), 0), t0: R(0.4, 2), life: R(0.6, 1.1), size: R(0.15, 0.3), col: i % 2 ? c1 : 0xffffff }; }, { grav: 0, drag: 0.4 });
    if (f >= 3) emitter(40, i => ({ p: F.clone().add(new V3(R(-R0, R0), R(3, 4.5), R(-R0, R0))), v: new V3(R(-0.4, 0.4), -1, R(-0.4, 0.4)), t0: R(0.5, 2), life: 1.4, size: R(0.25, 0.4), col: [0xffd0f0, 0xd8fff0, 0xfff0a0][i % 3] }), { grav: 0, drag: 0.2 });
    for (let i = 0; i < 3 + f; i++) textPop(F.clone().add(new V3(R(-1, 1), 1.5 + R(0, 0.8), R(-0.5, 0.5))), "+", "#7dff9a", 0.9, 0.9, 0.5 + i * 0.25);
    upg(F, f, c1, 0.6, R0 * 0.8);
  };

  /* --- Mendel: dây đậu khổng lồ quấn quái, hoa tím trắng, quả đậu nổ hạt --- */
  META.pea_vine_prison = { name: "Pea Vine Prison", lv: 28, who: "Gregor Mendel", forms: ["3 dây đậu quấn quái + hoa", "5 dây + quả đậu nổ hạt", "Lồng dây kín + hoa to", "Dây đậu vàng"] };
  SK.pea_vine_prison = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, nV = [3, 5, 7, 8][f - 1], grow = 0.5, dur = 2.4, vc = gold ? 0xffd860 : 0x5adf5a;
    rune(T, "circle", "latin", 0x7adf7a, 4.6, dur, 0, { mode: "static", op: 0.7 }); decal(T, TEX.crack, 0xffffff, 3.4, dur, 0.05, { add: false, op: 0.7, ro: 3 });
    sparks(T.clone().setY(0.2), [0x8a6a40, 0x6a5030], 30, 5, 0.3, 0.7, 0.05, { up: 1.5 });
    for (let v = 0; v < nV; v++) { const a0 = v / nV * PI * 2, r0 = 1.6 + (v % 2) * 0.4, h = 3.4 + f * 0.4 + (v % 3) * 0.4, tw = (v % 2 ? 1 : -1) * (1.2 + f * 0.1);
      const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40, a = a0 + u * tw * PI, r = r0 * (1 - u * 0.65) + 0.35; pts.push(new V3(T.x + Math.cos(a) * r, u * h, T.z + Math.sin(a) * r)); }
      const curve = new THREE.CatmullRomCurve3(pts);
      prop(v * 0.05, dur, () => { const g = new THREE.Group(), vm = flowMat({ c1: vc, c2: gold ? 0xfff6c0 : 0xd8ffb0, rep: [1, 6], spd: [0, -0.8], fres: 0.6, cut: -0.6, gain: 1.1, fade: [0, 0, 0, 0] }); vm.blending = THREE.NormalBlending; vm.depthWrite = true;
        const geo = new THREE.TubeGeometry(curve, 80, 0.16 + f * 0.02, 6), m = new THREE.Mesh(geo, vm); g.add(m); const N = geo.index.count, leaves = [], flowers = [];
        for (let q = 0; q < 5; q++) { const u = 0.2 + q * 0.16, P = curve.getPoint(u), lf = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 4), basic(null, vc, false, 1)); lf.scale.set(1, 0.25, 0.55); lf.position.copy(P); lf.rotation.y = q * 2; g.add(lf); leaves.push({ m: lf, u });
          if (q % 2 === 1) { const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: flowerTex(q === 1 ? 0xb06aff : 0xffffff), blending: ADD, transparent: true, depthWrite: false })); fl.position.copy(P).add(new V3(0, 0.15, 0)); g.add(fl); flowers.push({ s: fl, u }); } }
        return { g, upd: (k, t) => { vm.uniforms.uTime.value = t; const e = Math.min(1, t / grow), o = 1 - Math.max(0, k - 0.85) / 0.15; geo.setDrawRange(0, Math.floor(N * e * e * (3 - 2 * e))); vm.uniforms.uAlpha.value = o;
          leaves.forEach(L => L.m.scale.setScalar(e > L.u ? 1 : 0.001)); flowers.forEach(F2 => { const b = Math.min(1, Math.max(0, (t - grow - F2.u * 0.3) / 0.3)); F2.s.scale.setScalar(b * (0.8 + f * 0.1) + 0.001); F2.s.material.opacity = o; }); } }; }); }
    if (f >= 2) for (let p = 0; p < 2 + f; p++) { const P = T.clone().add(new V3(R(-1.3, 1.3), R(1.5, 3.2), R(-1.3, 1.3))), at = grow + 0.5 + p * 0.15;
      prop(grow, at - grow + 0.05, () => { const g = new THREE.Group(), pod = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 6), basic(null, 0x8aef5a, false, 1)); pod.scale.set(0.6, 0.6, 1.7); g.add(pod); g.position.copy(P); g.rotation.y = p; return { g, upd: (k, t) => g.scale.setScalar(Math.min(1, t / 0.2) * (1 + k * 0.2)) }; });
      sparks(P, [0x9aff6a, 0x5adf5a], 8, 5, 0.3, 0.6, at, { up: 0.5, grav: -8 }); glow(P, 0xd8ffb0, 1.2, 0.15, at, { flash: true }); }   /* quả đậu nổ ra hạt */
    if (f >= 3) dome(T, 0x5adf5a, 0xd8ffb0, 2.2, 0.6, grow);
    glow(T.clone().setY(1.5), 0xd8ffb0, 3 + f, 0.3, grow, { flash: true }); shock(T, 0x9aff6a, 2.6, 0.4, grow);
    upg(T, f, vc, grow, 2.4); task(grow, 0.01, () => shake(0.1 + f * 0.04));
  };
  /* --- Mendel: hạt giống vàng tách đôi giữa đường 2 → 4 → 8 rồi cùng nổ --- */
  META.hybrid_shot = { name: "Hybrid Shot", lv: 28, who: "Gregor Mendel", forms: ["Hạt tách đôi (2)", "Tách 2 lần (4)", "Tách 3 lần (8)", "8 hạt vàng + nổ hoa"] };
  SK.hybrid_shot = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, lvl = Math.min(3, f), d = SDIR(F, T), side = new V3(-d.z, 0, d.x), fly = 0.55, c1 = gold ? 0xffd040 : 0xd8ff6a, A = F.clone().setY(1.4).addScaledVector(d, 0.6), B = T.clone().setY(1.1);
    const now = CLOCK_MS(), first = !LAST.hybrid || now - LAST.hybrid > 900; LAST.hybrid = now;
    const splits = [0.3, 0.5, 0.7].slice(0, lvl), N = 1 << lvl, P = new V3();
    const offAt = (j, u) => { let o = 0; splits.forEach((s, l) => { if (u > s) { const bit = (j >> (lvl - 1 - l)) & 1, w = (1.1 - l * 0.3) * Math.sin(Math.min(1, (u - s) / 0.15) * PI * 0.5) * (1 - Math.max(0, (u - 0.8) / 0.2)); o += (bit ? 1 : -1) * w; } }); return o; };   /* cây nhị phân: mỗi lần tách lệch trái / phải */
    for (let j = 0; j < N; j++) { prop(0, fly, () => { const g = new THREE.Group(), sm = solidMat(gold ? 0xc89010 : 0x7aa830, gold ? 0xfff0a0 : 0xe8ff9a, 0xffffff), s = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), sm); s.scale.set(1, 0.8, 1.2); g.add(s);
        const hl = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c1, blending: ADD, transparent: true, depthWrite: false })); hl.scale.setScalar(1.1 + f * 0.15); g.add(hl);
        return { g, upd: (k, t) => { sm.uniforms.uTime.value = t; P.lerpVectors(A, B, k); P.y += Math.sin(k * PI) * 0.8; P.addScaledVector(side, offAt(j, k)); P.y += offAt(j ^ 1, k) * 0.15; g.position.copy(P); s.rotation.y = t * 8; } }; });
      emitter(14, q => { const u = q / 14, p = A.clone().lerp(B, u); p.y += Math.sin(u * PI) * 0.8; p.addScaledVector(side, offAt(j, u)); return { p, v: rv(0.3), t0: u * fly, life: 0.3, size: R(0.15, 0.3), col: q % 2 ? c1 : 0xffffff }; }, { grav: 0, drag: 2 }); }
    splits.forEach(s => { const p = A.clone().lerp(B, s); p.y += Math.sin(s * PI) * 0.8; glow(p, 0xffffff, 1.2, 0.15, s * fly, { flash: true }); });
    glow(B, 0xffffff, 2 + f * 0.6, 0.22, fly, { flash: true }); glow(B, c1, 3 + f, 0.35, fly, { flash: true }); sparks(B, [c1, 0xffffff, 0x9aff6a], 14 + N * 3, 6, 0.25, 0.5, fly, { up: 1 }); shock(T, c1, 1.2 + f * 0.3, 0.35, fly);
    if (gold) for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; textPop(B.clone().add(new V3(Math.cos(a) * 0.9, 0.3, Math.sin(a) * 0.9)), "✿", "#fff0a0", 0.8, 0.5, fly); }
    if (first) upg(T, f, c1, fly, 1.8); task(fly, 0.01, () => shake(0.05 + f * 0.02));
  };

  /* --- Hải Thượng Lãn Ông: nồi thuốc đồng sôi, khói thơm xanh vàng toả hồi máu --- */
  META.herbal_mist = { name: "Herbal Mist", lv: 30, who: "Hải Thượng Lãn Ông", forms: ["Nồi thuốc sôi, khói thơm hồi máu", "Mây thuốc rộng + lá bay", "+ vòng lá xoáy, chữ Hán phù văn", "Nồi vàng + mây vàng"] };
  SK.herbal_mist = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 3 + f * 0.5, dur = 2.6, c1 = gold ? 0xffd860 : 0x9aff8a, P0 = F.clone().add(new V3(0.9, 0, 0.6));
    prop(0, dur, () => { const g = new THREE.Group(), bm = ghostMat(gold ? 0xffc040 : 0xc88040, 0xffe0b0, { fres: 0.7, cut: -0.5 }), pts = [];
      for (let i = 0; i <= 10; i++) { const u = i / 10; pts.push(new THREE.Vector2(0.25 + Math.sin(u * PI * 0.85 + 0.2) * 0.5, u * 0.9)); }
      bm.blending = THREE.NormalBlending; const pot = new THREE.Mesh(new THREE.LatheGeometry(pts, 20), bm); g.add(pot); [-1, 1].forEach(s => { const h = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.04, 6, 12), bm); h.position.set(s * 0.72, 0.65, 0); h.rotation.y = PI / 2; g.add(h); });
      for (let i = 0; i < 3; i++) { const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 0.35, 5), bm); const a = i / 3 * PI * 2; lg.position.set(Math.cos(a) * 0.35, -0.15, Math.sin(a) * 0.35); g.add(lg); }
      const brew = new THREE.Mesh(new THREE.CircleGeometry(0.62, 20).rotateX(-PI / 2), flowMat({ c1, c2: 0xffffff, rep: [2, 2], spd: [0.5, -0.5], fres: 0, cut: -0.2, fade: [0, 0, 0, 0] })); brew.position.y = 0.85; brew.material.blending = THREE.NormalBlending; g.add(brew);
      g.position.copy(P0);
      return { g, upd: (k, t) => { bm.uniforms.uTime.value = t; brew.material.uniforms.uTime.value = t; const a = pop(k, 0.1, 0.85); bm.uniforms.uAlpha.value = a; brew.material.uniforms.uAlpha.value = a; g.scale.setScalar(1.1 * Math.min(1, k / 0.08)); g.position.y = 0.2 + Math.sin(t * 20) * 0.02; } }; });
    emitter(30, i => ({ p: P0.clone().add(new V3(R(-0.4, 0.4), 1.1, R(-0.4, 0.4))), v: new V3(0, R(0.5, 1), 0), t0: R(0, dur * 0.8), life: R(0.3, 0.5), size: R(0.15, 0.3), col: 0xffffff }), { grav: 0, drag: 0 });   /* bọt sôi */
    emitter(40 + f * 20, i => { const a = R(0, PI * 2), sp = R(0.6, 1.4) * R0 / 2; return { p: P0.clone().add(new V3(0, 1.2, 0)), v: new V3(Math.cos(a) * sp, R(0.6, 1.4), Math.sin(a) * sp), t0: R(0.15, dur * 0.7), life: R(1.0, 1.6), size: R(0.5, 0.95) * (1 + f * 0.1), col: [gold ? 0xc8a020 : 0x3aa83a, 0xa89020, 0x5ab84a][i % 3] }; }, { grav: -0.4, drag: 0.9 });   /* khói thơm toả rộng */
    decal(F, TEX.glow, c1, R0 * 2.2, dur, 0.2, { op: 0.45, hold: 0.7 });
    if (f >= 2) emitter(24 + f * 8, i => { const a = R(0, PI * 2), r = R(0.5, R0); return { p: F.clone().add(new V3(Math.cos(a) * r, R(0.3, 2.2), Math.sin(a) * r)), v: new V3(-Math.sin(a) * 1.5, R(-0.2, 0.3), Math.cos(a) * 1.5), t0: R(0.3, 2), life: R(0.8, 1.2), size: R(0.25, 0.4), col: i % 2 ? 0x5adf5a : 0xb8ef6a }; }, { grav: 0, drag: 0.3 });
    if (f >= 3) rune(F, "circle", "hanzi", c1, R0 * 1.8, dur, 0.2, { mode: "spin", spin: 0.5, op: 0.7 });
    for (let i = 0; i < 3 + f; i++) textPop(F.clone().add(new V3(R(-1.2, 1.2), 1.5 + R(0, 0.8), R(-0.6, 0.6))), "+", "#7dff9a", 0.9, 0.9, 0.5 + i * 0.3);
    upg(F, f, c1, 0.5, R0 * 0.7);
  };

  /* --- Tôn Thất Tùng: mạng mạch máu đỏ sáng lan trên đất nối các quái, nhịp tim đập --- */
  function veinTex(seed) { const key = "vein" + seed; return TEX[key] || (TEX[key] = cvTex(512, (g, n) => { let s = seed * 9301 + 49297; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    g.translate(n / 2, n / 2); g.lineCap = "round"; g.strokeStyle = "#fff"; g.shadowColor = "#fff"; g.shadowBlur = 8;
    const br = (x, y, a, len, w, depth) => { if (depth > 6 || w < 0.8) return; const nx = x + Math.cos(a) * len, ny = y + Math.sin(a) * len; g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo((x + nx) / 2 + (rnd() - 0.5) * len * 0.5, (y + ny) / 2 + (rnd() - 0.5) * len * 0.5, nx, ny); g.stroke();
      br(nx, ny, a + (rnd() - 0.5) * 0.9, len * 0.82, w * 0.72, depth + 1); if (rnd() < 0.6) br(nx, ny, a + (rnd() < 0.5 ? -1 : 1) * (0.5 + rnd() * 0.6), len * 0.68, w * 0.6, depth + 1); };
    for (let i = 0; i < 6; i++) br(0, 0, i / 6 * PI * 2 + rnd() * 0.5, 46, 12, 0); g.fillStyle = "#fff"; g.beginPath(); g.arc(0, 0, 16, 0, PI * 2); g.fill(); })); }
  META.vein_map = { name: "Vein Map", lv: 32, who: "Tôn Thất Tùng", forms: ["Mạch máu đỏ lan trên đất, nhịp tim", "Mạng dày hơn + nhịp đập lan", "+ mạch cong nổi lên nối quái", "Mạch máu vàng-đỏ"] };
  SK.vein_map = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 4.5 + f * 0.5, dur = 2.4, c1 = gold ? 0xffb030 : 0xff2a3a;
    for (let l = 0; l < (f >= 2 ? 2 : 1); l++) decal(T, veinTex(3 + l), c1, R0 * 2 * (1 - l * 0.15), dur, 0.05 + l * 0.1, { mode: "expand", expand: 0.25, inT: 0.45, op: 1, hold: 0.75, spin: 0 });
    shadowUnder(T, R0 * 2, dur, 0);
    for (let b = 0; b < 3 + f; b++) { const at = 0.4 + b * 0.42; decal(T, TEX.ring, c1, R0 * 0.8, 0.45, at, { mode: "expand", expand: 1.4, op: 0.9 }); glow(T.clone().setY(0.6), c1, 2 + f * 0.5, 0.2, at, { flash: true }); task(at, 0.01, () => shake(0.04)); }   /* thình thịch */
    textPop(T.clone().setY(2.8), "♥", gold ? "#ffd860" : "#ff4a5a", 1.4, 0.8, 0.4, { rise: 0.4 });
    if (f >= 3) for (let i = 0; i < 4; i++) { const a = i / 4 * PI * 2 + 0.4, E = T.clone().add(new V3(Math.cos(a) * R0 * 0.9, 0, Math.sin(a) * R0 * 0.9));
      prop(0.3 + i * 0.1, dur - 0.4, () => { const pts = []; for (let q = 0; q <= 20; q++) { const u = q / 20, p = T.clone().lerp(E, u); p.y = Math.sin(u * PI) * 1.6 + 0.2; p.x += Math.sin(u * 9 + i) * 0.15; pts.push(p); }
        const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.09, 5), mt = flowMat({ c1, c2: 0xffd0d0, rep: [6, 1], spd: [-2.5, 0], fres: 0.5, cut: -0.3, fade: [0, 0, 0, 0] }), m = new THREE.Mesh(geo, mt), g = new THREE.Group(); g.add(m); const N = geo.index.count;
        return { g, upd: (k, t) => { mt.uniforms.uTime.value = t; geo.setDrawRange(0, Math.floor(N * Math.min(1, k / 0.25))); mt.uniforms.uAlpha.value = 1 - Math.max(0, k - 0.8) / 0.2; } }; }); }
    emitter(30 + f * 10, i => { const a = R(0, PI * 2), r = R(0.5, R0 * 0.9); return { p: T.clone().add(new V3(Math.cos(a) * r, 0.15, Math.sin(a) * r)), v: new V3(-Math.cos(a), 0.3, -Math.sin(a)).multiplyScalar(r * 0.8), t0: R(0.4, 1.8), life: 0.9, size: R(0.2, 0.35), col: i % 2 ? c1 : 0xffb0b0 }; }, { grav: 0, drag: 0 });   /* dòng máu chảy về tim */
    upg(T, f, c1, 0.4, R0 * 0.6);
  };

  /* --- Tôn Thất Tùng: đường dao sáng mảnh, khựng 0,3 giây rồi xé toạc --- */
  META.surgeons_cut = { name: "Surgeon's Cut", lv: 32, who: "Tôn Thất Tùng", forms: ["Đường dao mảnh → xé toạc", "Vết cắt chữ X", "3 vết cắt hình sao", "Dao vàng + nổ chí mạng"] };
  SK.surgeons_cut = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, nC = [1, 2, 3, 3][f - 1], hold = 0.3, c1 = gold ? 0xffd860 : 0xd8f4ff, B = T.clone().setY(1.2), d = SDIR(F, T), yaw = Math.atan2(d.x, d.z);
    for (let c = 0; c < nC; c++) { const ang = yaw + PI / 2 + c * PI / nC + 0.3, dl = c * 0.08, dir = new V3(Math.sin(ang), 0, Math.cos(ang)), A1 = B.clone().addScaledVector(dir, -1.8).add(new V3(0, 0.7, 0)), A2 = B.clone().addScaledVector(dir, 1.8).add(new V3(0, -0.6, 0));
      bolt(A1, A2, 0xffffff, 0.07, hold + 0.05, dl, { jag: 0.0 }); glow(A1.clone().lerp(A2, 0.5), 0xffffff, 1.5, hold, dl);   /* đường chỉ sáng mảnh */
      slash(T, c1, 0xffffff, 2.2 + f * 0.3, 1.3 + f * 0.12, -PI * 0.7, PI * 0.2, 0.5 * (c % 2 ? -1 : 1), ang, 0.35, dl + hold, 1.2); }
    glow(B, 0xffffff, 0.8, hold, 0);   /* khựng: tia sáng nhỏ tụ */
    const hit = hold + 0.05 + (nC - 1) * 0.08;
    glow(B, 0xffffff, 4 + f, 0.2, hit, { flash: true }); glow(B, gold ? 0xffb020 : 0xff3a4a, 3 + f, 0.35, hit, { flash: true });
    sparks(B, [0xffffff, c1, 0xff6070], 30 + f * 15, 9, 0.25, 0.45, hit, { up: 0.6, grav: -3 }); shock(T, 0xffffff, 1.8 + f * 0.4, 0.35, hit);
    textPop(B.clone().add(new V3(0, 1.2, 0)), "CRIT!", gold ? "#ffe060" : "#ff5a6a", 1.6, 0.6, hit);
    if (gold) { dome(T, 0xffb020, 0xffffff, 1.8, 0.4, hit); }
    upg(T, f, c1, hit, 1.8); task(hit, 0.01, () => shake(0.16 + f * 0.05));
  };

  /* --- Marie Curie: hạt radium xanh lục phình thành mặt trời nhỏ rồi nổ --- */
  META.radium_nova = { name: "Radium Nova", lv: 34, who: "Marie Curie", forms: ["Hạt radium → mặt trời xanh nổ", "Mặt trời to + vầng hào quang", "Nổ 2 đợt + vùng ánh xanh", "Mặt trời xanh-vàng khổng lồ"] };
  SK.radium_nova = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 3 + f * 0.4, grow = 0.7, c1 = gold ? 0xd8ff40 : 0x4aff7a, C = T.clone().setY(1.8);
    shadowUnder(T, R0 * 2.4, 2, 0); rune(T, "star", "cuneiform", c1, R0 * 2, grow + 0.2, 0, { mode: "converge", op: 0.9 });
    orbFly(F.clone().setY(1.4), C, c1, 0xffffff, 0.5, 0.3, 0, { arc: 0.6 });
    prop(0.3, grow, () => { const g = new THREE.Group(), cm = flowMat({ c1, c2: 0xffffff, rep: [2, 2], spd: [0.6, -0.8], fres: 0.6, cut: -0.4, gain: 1.5, fade: [0, 0, 0, 0] }), core = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), cm); g.add(core);
      const cor = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c1, blending: ADD, transparent: true, depthWrite: false })); g.add(cor); g.position.copy(C);
      return { g, upd: (k, t) => { cm.uniforms.uTime.value = t; const s = 0.15 + k * k * (0.9 + f * 0.25); core.scale.setScalar(s * (1 + Math.sin(t * 30) * 0.04 * k)); cor.scale.setScalar(s * (5 + f)); core.rotation.y = t * 2; } }; });
    emitter(60 + f * 20, i => { const a = R(0, PI * 2), b = R(-1, 1), r = R(2.5, 4.5), p = C.clone().add(new V3(Math.cos(a) * r * Math.sqrt(1 - b * b), b * r * 0.6, Math.sin(a) * r * Math.sqrt(1 - b * b))); return { p, v: C.clone().sub(p).multiplyScalar(1.6), t0: 0.3 + R(0, grow - 0.3), life: 0.6, size: R(0.15, 0.3), col: i % 2 ? c1 : 0xffffff }; }, { grav: 0, drag: 0 });   /* hút năng lượng vào */
    const hit = 0.3 + grow; const boom = h => { glow(C, 0xffffff, 6 + f * 1.5, 0.3, h, { flash: true }); glow(C, c1, 9 + f * 2, 0.5, h, { flash: true }); dome(T, c1, 0xffffff, R0, 0.6, h); shock(T, c1, R0 * 1.4, 0.6, h); shock(T, 0xffffff, R0, 0.45, h + 0.05);
      sparks(C, [c1, 0xffffff, 0xb0ffc0], 60 + f * 20, 11, 0.35, 0.8, h, { up: 1 }); task(h, 0.01, () => shake(0.2 + f * 0.07)); };
    boom(hit); if (f >= 3) boom(hit + 0.35);
    decal(T, TEX.glow, c1, R0 * 2.4, 1.8, hit, { mode: "pulse", rate: 6, amp: 0.1, op: 0.7, hold: 0.6 }); if (f >= 3) decal(T, TEX.crack, 0xffffff, R0 * 1.8, 1.6, hit, { add: false, op: 0.8, ro: 3 });
    upg(T, f, c1, hit, R0 * 0.8);
  };

  /* --- Marie Curie: xe cứu thương ánh sáng chạy vòng quanh, đi qua đâu hồi máu đó --- */
  META.x_ray_ambulance = { name: "X-Ray Aura", lv: 34, who: "Marie Curie", forms: ["Chùm sáng X-quang xanh rọi xuống, hồi máu", "+ vòng quét lên xuống", "Chùm to + xương sáng thoáng hiện", "Chùm xanh-vàng + hào quang lớn"] };
  SK.x_ray_ambulance = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, dur = 2.2, c1 = gold ? 0xd8ff60 : 0x40ff90, r = 1.2 + f * 0.2, H = 7;
    rune(F, "hex", "latin", c1, 3.4 + f * 0.4, dur, 0, { mode: "pulse", rate: 5, amp: 0.08, op: 0.8 }); decal(F, TEX.glow, c1, 4 + f, dur, 0, { op: 0.55, hold: 0.75 });
    task(0, dur, () => { const mt = flowMat({ c1, c2: 0xe8fff0, rep: [3, 2], spd: [0.2, 1.5], fres: 1.2, cut: 0.1, gain: 1.3, fade: [0, 0, 0.05, 0.5] }), m = mesh(new THREE.CylinderGeometry(r * 0.35, r * 1.3, H, 28, 1, true).translate(0, H / 2, 0), mt); m.position.set(F.x, 0, F.z); SC.add(m);
      return { upd: (k, t) => { mt.uniforms.uTime.value = t; mt.uniforms.uAlpha.value = pop(k, 0.12, 0.8); m.rotation.y = t * 0.6; }, end: () => kill(m) }; });   /* chùm sáng hình nón rọi từ trên xuống */
    glow(F.clone().setY(H), c1, 4, dur, 0);
    const nS = f >= 2 ? 3 : 1; for (let s = 0; s < nS; s++) task(0.2 + s * 0.5, 0.9, () => { const m = mesh(new THREE.TorusGeometry(r * 1.1, 0.05, 6, 40).rotateX(PI / 2), basic(null, 0xffffff, true, 1), 9); m.position.set(F.x, 0, F.z); SC.add(m);
      return { upd: k => { const y = k < 0.5 ? k * 2 * 3 : (1 - k) * 2 * 3; m.position.y = y + 0.1; m.scale.setScalar(1.25 - y / 3 * 0.4); m.material.opacity = 0.9 * (1 - Math.max(0, k - 0.8) / 0.2); }, end: () => kill(m) }; });   /* vòng quét chạy lên xuống */
    if (f >= 3) prop(0.4, 1.2, () => { const g = new THREE.Group(), bm = ghostMat(c1, 0xffffff, { fres: 1.4 }), sk = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8), bm); sk.position.y = 1.75; g.add(sk);
      const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 5), bm); sp.position.y = 1.05; g.add(sp); for (let i = 0; i < 4; i++) { const rb = new THREE.Mesh(new THREE.TorusGeometry(0.3 - i * 0.03, 0.03, 4, 14, PI * 1.5), bm); rb.position.y = 1.4 - i * 0.15; rb.rotation.x = PI / 2; g.add(rb); }
      g.position.set(F.x, 0, F.z); g.traverse(x => { x.renderOrder = 12; if (x.material) x.material.depthTest = false; });
      return { g, upd: (k, t) => { bm.uniforms.uTime.value = t; bm.uniforms.uAlpha.value = 0.8 * pop(k, 0.15, 0.6); } }; });   /* thoáng thấy bộ xương sáng của chính mình */
    emitter(40 + f * 15, i => { const a = R(0, PI * 2), rr = R(0.2, r * 1.2); return { p: F.clone().add(new V3(Math.cos(a) * rr, R(0, 0.5), Math.sin(a) * rr)), v: new V3(0, R(1, 2.5), 0), t0: R(0.1, 1.7), life: R(0.6, 1), size: R(0.2, 0.38), col: i % 2 ? c1 : 0xffffff }; }, { grav: 0, drag: 0.4 });
    for (let i = 0; i < 3 + f; i++) textPop(F.clone().add(new V3(R(-0.8, 0.8), 1.6 + R(0, 0.6), R(-0.4, 0.4))), "+", "#7dff9a", 0.9, 0.9, 0.4 + i * 0.3);
    if (gold) shock(F, 0xffd860, 5, 0.7, 0.5);
    upg(F, f, c1, 0.5, 2.4);
  };

  /* --- Mendeleev: bảng tuần hoàn sau lưng, từng ô sáng bắn nguyên tố: H nổ, O lửa, Fe mũi sắt, Ne neon tím --- */
  function periodicTex() { return TEX.ptab || (TEX.ptab = cvTex(512, (g, n) => {
    const rows = ["H               He", "LiBe          BCNOFNe", "NaMg          AlSiPSClAr", "KCaScTiVCrMnFeCoNiCuZnGaGeAsSeBrKr"], cell = n / 19, pos = [[0, 0], [17, 0]];
    const EL = [["H", 0, 0], ["He", 17, 0], ["Li", 0, 1], ["Be", 1, 1], ["B", 12, 1], ["C", 13, 1], ["N", 14, 1], ["O", 15, 1], ["F", 16, 1], ["Ne", 17, 1], ["Na", 0, 2], ["Mg", 1, 2], ["Al", 12, 2], ["Si", 13, 2], ["P", 14, 2], ["S", 15, 2], ["Cl", 16, 2], ["Ar", 17, 2]];
    ["K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr"].forEach((s, i) => EL.push([s, i, 3])); ["Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe"].forEach((s, i) => EL.push([s, i, 4]));
    const oy = n * 0.36; g.fillStyle = "rgba(10,20,40,.55)"; g.fillRect(0, oy - 8, n, (n / 19) * 5 + 16); g.font = "bold " + Math.round(cell * 0.48) + "px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
    EL.forEach(([s, x, y]) => { const X = cell * 0.5 + x * cell * 1.0, Y = oy + y * cell * 1.0; g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 2; g.strokeRect(X + 2, Y + 2, cell - 4, cell - 4); g.fillStyle = ["H", "O", "Fe", "Ne"].includes(s) ? "#fff" : "rgba(255,255,255,.75)"; g.fillText(s, X + cell / 2, Y + cell / 2 + 1); }); })); }
  const ELEM = { H: [0x6ab8ff, "H"], O: [0xff7a2a, "O"], Fe: [0xb8c0d0, "Fe"], Ne: [0xd060ff, "Ne"] };
  META.periodic_barrage = { name: "Periodic Barrage", lv: 36, who: "Dmitri Mendeleev", forms: ["Bảng tuần hoàn bắn H, O", "+ Fe mũi sắt", "+ Ne neon tím, bắn dày", "Bảng vàng, mưa nguyên tố"] };
  SK.periodic_barrage = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), side = new V3(-d.z, 0, d.x), W = 7.5, H0 = 3.0, Cb = F.clone().addScaledVector(d, -0.4).setY(4.4), dur = 2.2, c1 = gold ? 0xffd860 : 0x9ad8ff;
    const types = ["H", "O", "Fe", "Ne"].slice(0, Math.min(4, f + 1)), n = [6, 9, 12, 16][f - 1];
    prop(0, dur, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(W, W), basic(periodicTex(), c1, false, 1)); g.add(m); g.position.copy(Cb);
      return { g, upd: (k, t) => { g.quaternion.copy(CAM.quaternion); /* luôn quay mặt về camera */ m.material.opacity = 0.9 * pop(k, 0.1, 0.85); g.scale.setScalar(0.8 + 0.2 * Math.min(1, k / 0.1)); } }; });
    for (let i = 0; i < n; i++) { const ty = types[i % types.length], [col, sym] = ELEM[ty], dl = 0.35 + i * ((dur - 1) / n), S = Cb.clone().addScaledVector(side, R(-W * 0.4, W * 0.4)).add(new V3(0, R(-0.8, 0.8), 0)), E = T.clone().add(new V3(R(-1.2, 1.2), R(0.6, 1.4), R(-1.2, 1.2))), fly = 0.35;
      glow(S, col, 1.2, 0.25, dl - 0.1);   /* ô bật sáng */
      if (ty === "Fe") prop(dl, fly, () => { const g = new THREE.Group(), sm = solidMat(0x5a6270, 0xd8e0f0, 0xffffff), sp = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1.1, 6).rotateX(PI / 2), sm); g.add(sp); const P = new V3();
        return { g, upd: (k, t) => { sm.uniforms.uTime.value = t; P.lerpVectors(S, E, k); g.position.copy(P); g.quaternion.copy(basisQ(E.clone().sub(S))); } }; });
      else if (ty === "Ne") bolt(S, E, col, 0.12, fly + 0.1, dl, { jag: 0.4 });
      else orbFly(S, E, col, 0xffffff, ty === "O" ? 0.6 : 0.45, fly, dl, { arc: 0.6 });
      textPop(S, sym, "#" + new THREE.Color(col).getHexString(), 0.9, 0.4, dl - 0.05, { rise: 0.3 });
      const hit = dl + fly;
      if (ty === "H") { glow(E, 0xffffff, 2.5, 0.18, hit, { flash: true }); glow(E, col, 3, 0.3, hit, { flash: true }); }
      else if (ty === "O") { pillar(E.clone().setY(0), 0xff5a1a, 0xffd27a, 0.35, 2.2, 0.45, hit, { speed: 4 }); sparks(E, [0xff7a2a, 0xffd27a], 14, 5, 0.25, 0.45, hit, { up: 1.4 }); }
      else if (ty === "Fe") sparks(E, [0xd8e0f0, 0xffffff, 0xffb050], 14, 6, 0.18, 0.35, hit, { up: 0.8 });
      else { glow(E, col, 2.5, 0.3, hit, { flash: true }); shock(E, col, 1, 0.3, hit, E.y - 0.06); }
      if (i % 2 === 0) task(hit, 0.01, () => shake(0.05 + f * 0.015)); }
    if (gold) shock(T, 0xffd860, 4.5, 0.7, dur - 0.5);
    upg(T, f, c1, 0.9, 2.6);
  };

  /* --- Mendeleev: cầu nước tách 2 H + 1 O, nhập lại nổ hơi nước --- */
  META.water_split = { name: "Water Split", lv: 36, who: "Dmitri Mendeleev", forms: ["Cầu nước tách H₂O, nhập lại nổ", "Bóng to + hơi nước dày", "Nổ đôi + mưa giọt nước", "H₂O vàng + nổ lớn"] };
  SK.water_split = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, C = T.clone().setY(1.8), fly = 0.35, split = 0.45, merge = 0.35, wc = 0x3aa8ff;
    orbFly(F.clone().setY(1.4), C, wc, 0xe8fbff, 0.9 + f * 0.1, fly, 0, { arc: 0.5 });
    const atoms = [["H", 0xffffff, 0.45, 0], ["H", 0xffffff, 0.45, 2.1], ["O", gold ? 0xffd040 : 0xff4a4a, 0.7, 4.2]];
    atoms.forEach(([s, col, r, a0], i) => prop(fly, split + merge, () => { const g = new THREE.Group(), am = flowMat({ c1: col, c2: 0xffffff, rep: [1, 1], spd: [0.3, -0.5], fres: 1.4, cut: -0.4, gain: 1.2, fade: [0, 0, 0, 0] }), b = new THREE.Mesh(new THREE.SphereGeometry(r * (1 + f * 0.1), 18, 12), am); g.add(b);
      const lab = new THREE.Sprite(new THREE.SpriteMaterial({ map: txtTex(s, "#ffffff"), transparent: true, depthWrite: false, depthTest: false })); lab.scale.setScalar(0.9); lab.renderOrder = 12; g.add(lab); const P = new V3();
      return { g, upd: (k, t) => { am.uniforms.uTime.value = t; const sp = t < split ? Math.sin(t / split * PI * 0.5) : 1 - (t - split) / merge, ang = a0 + t * 6, rr = sp * (1.3 + f * 0.15); P.set(C.x + Math.cos(ang) * rr, C.y + Math.sin(ang * 1.3) * rr * 0.3, C.z + Math.sin(ang) * rr); g.position.copy(P); } }; }));   /* 2 H + 1 O xoay tách ra rồi nhập lại */
    const hit = fly + split + merge;
    const pop2 = h => { glow(C, 0xffffff, 5 + f, 0.25, h, { flash: true }); glow(C, wc, 6 + f, 0.4, h, { flash: true }); shock(T, 0xe8fbff, 2.4 + f * 0.4, 0.5, h);
      emitter(40 + f * 15, i => { const v = rv(1); return { p: C.clone().add(v.clone().multiplyScalar(0.3)), v: v.multiplyScalar(R(1.5, 3.5)), t0: h + R(0, 0.1), life: R(0.7, 1.2), size: R(0.7, 1.3) * (1 + f * 0.12), col: 0xf0f6ff }; }, { grav: 0.4, drag: 2.2 }); task(h, 0.01, () => shake(0.14 + f * 0.05)); };   /* nổ hơi nước trắng */
    pop2(hit); if (f >= 3) pop2(hit + 0.3);
    textPop(C.clone().add(new V3(0, 1.3, 0)), "BOOM!", gold ? "#ffe060" : "#e8fbff", 1.5, 0.6, hit);
    if (f >= 3) sparks(C.clone().setY(3.5), [wc, 0xe8fbff], 40, 3, 0.25, 0.9, hit + 0.1, { up: 0.2, grav: -9 });
    upg(T, f, gold ? 0xffd860 : wc, hit, 2.2);
  };
  /* ---------- CHƯƠNG 3 (Lv.38–52): Điện, máy móc & di chuyển – máy móc làm dạng linh hồn, hướng về quái ---------- */
  function bulb(gold, lit) {   /* bóng đèn: bầu kính + dây tóc sáng + đuôi xoáy */
    const g = new THREE.Group(), gm = ghostMat(lit ? (gold ? 0xffe060 : 0xfff0b0) : 0x8090a0, 0xffffff, { fres: 1.6, cut: -0.3 }), b = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 10), gm); b.scale.y = 1.15; g.add(b);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.18, 0.18, 10), gm); neck.position.y = -0.36; g.add(neck);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.2, 10), solidMat(0x8a7a5a, 0xe8d8b0, 0xffffff)); base.position.y = -0.53; g.add(base);
    const fil = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: lit ? 0xffd060 : 0x404040, blending: ADD, transparent: true, depthWrite: false })); fil.scale.setScalar(lit ? 0.9 : 0.2); g.add(fil);
    return { g, gm, base, fil };
  }
  /* --- Edison: kèn đồng + đĩa than sau lưng, phát lại câu nói ×3 thành sóng âm vàng --- */
  META.phonograph_roar = { name: "Phonograph Roar", lv: 38, who: "Thomas Edison", forms: ["Kèn đồng + 3 sóng âm vàng", "Sóng to + nốt nhạc bay", "5 sóng + đĩa than lớn dưới chân", "Kèn vàng, sóng vàng rực"] };
  SK.phonograph_roar = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), nW = f >= 3 ? 5 : 3, dist = Math.max(2, F.distanceTo(T)), c1 = gold ? 0xffd040 : 0xffc060, H0 = F.clone().addScaledVector(d, -0.6).setY(2.6), fly = 0.4;
    prop(0, 0.6 + nW * 0.22, () => { const g = new THREE.Group(), hm = ghostMat(gold ? 0xffc030 : 0xd8a040, 0xfff0c0, { fres: 0.7, cut: -0.5 }), pts = [];
      for (let i = 0; i <= 14; i++) { const u = i / 14; pts.push(new THREE.Vector2(0.08 + Math.pow(u, 3) * 1.3, u * 2.2)); }
      const horn = new THREE.Mesh(new THREE.LatheGeometry(pts, 24), hm); horn.rotation.x = PI / 2; horn.position.z = -0.4; g.add(horn);   /* loa kèn loe về phía quái */
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32), solidMat(0x101014, 0x404050, 0xb0a0ff)); disc.position.set(0, -0.9, -0.6); g.add(disc);
      g.position.copy(H0); g.lookAt(T.clone().setY(1.6)); hm.blending = THREE.NormalBlending;
      return { g, upd: (k, t) => { hm.uniforms.uTime.value = t; hm.uniforms.uAlpha.value = pop(k, 0.1, 0.85); disc.rotation.y = t * 8; g.scale.setScalar(Math.min(1, k / 0.1) * (1 + 0.06 * Math.sin(t * 30))); } }; });
    const M = H0.clone().addScaledVector(d, 2), B = T.clone().setY(1.4), yaw = Math.atan2(d.x, d.z);
    for (let i = 0; i < nW; i++) { const dl = 0.25 + i * 0.22;
      prop(dl, fly, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.12, 6, 32), basic(null, i % 2 ? 0xffffff : c1, true, 1)); g.add(m); const P = new V3();
        return { g, upd: (k, t) => { P.lerpVectors(M, B, k); g.position.copy(P); g.rotation.set(0, yaw, 0); m.scale.setScalar(1 + k * (1.5 + f * 0.25)); m.material.opacity = 1 - Math.max(0, k - 0.8) / 0.2; } }; });   /* vòng sóng âm bay & phình ra */
      glow(B, c1, 2 + f * 0.4, 0.2, dl + fly, { flash: true }); shock(T, c1, 1.6 + f * 0.3, 0.35, dl + fly, 1); task(dl + fly, 0.01, () => shake(0.06 + f * 0.02)); }
    textPop(H0.clone().add(new V3(0, 1, 0)), "×3", gold ? "#ffe060" : "#ffd27a", 1.2, 0.6, 0.2);
    if (f >= 2) for (let i = 0; i < 4 + f * 2; i++) textPop(H0.clone().add(new V3(R(-1, 1), R(0, 1), R(-1, 1))).lerp(B, R(0, 0.8)), i % 2 ? "♪" : "♫", gold ? "#ffe060" : "#ffffff", 0.8, 0.8, 0.3 + i * 0.1);
    if (f >= 3) prop(0.1, 1.6, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.RingGeometry(0.3, 3, 48).rotateX(-PI / 2), basic(TEX.ring, 0x9080ff, true, 0.5)); g.add(m); g.position.set(F.x, 0.05, F.z); return { g, upd: (k, t) => { g.rotation.y = t * 3; m.material.opacity = 0.5 * pop(k, 0.1, 0.8); } }; });
    upg(T, f, c1, 0.25 + fly, 2);
  };

  /* --- Edison: bóng đèn bay ra như pháo, chạm quái chớp sáng và nổ kính --- */
  META.bulb_barrage = { name: "Bulb Barrage", lv: 38, who: "Thomas Edison", forms: ["Bóng đèn bay vòng cung, nổ kính", "Nhiều bóng hơn + chớp sáng", "Pháo bóng đèn nổ hoa", "Bóng đèn vàng rực"] };
  SK.bulb_barrage = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, n = [8, 14, 20, 26][f - 1], R0 = 3.6, fly = 0.55, A = F.clone().setY(1.8);
    for (let i = 0; i < n; i++) { const a = R(0, PI * 2), r = Math.sqrt(Math.random()) * R0, E = T.clone().add(new V3(Math.cos(a) * r, 0.4, Math.sin(a) * r)), C = A.clone().lerp(E, 0.5).add(new V3(R(-2, 2), R(3, 5), R(-2, 2))), dl = i * (0.9 / n), P = new V3();
      prop(dl, fly, () => { const o = bulb(gold, true);
        return { g: o.g, upd: (k, t) => { o.gm.uniforms.uTime.value = t; bez(A, C, E, k, P); o.g.position.copy(P); o.g.rotation.set(t * 6, t * 4, 0); o.g.scale.setScalar(1 + f * 0.1); o.fil.scale.setScalar(0.9 + Math.sin(t * 40) * 0.2); } }; });
      const hit = dl + fly; glow(E, gold ? 0xffe060 : 0xfff6d0, 2 + f * 0.4, 0.2, hit, { flash: true }); sparks(E, [0xffffff, 0xd8f0ff, 0xfff0b0], 8 + f * 2, 5, 0.15, 0.4, hit, { up: 1.2 });   /* mảnh kính */
      if (f >= 3 && i % 3 === 0) sparks(E.clone().setY(1.5), [0xff6a3a, 0xffd040, 0x6ab8ff, 0xb06aff], 20, 6, 0.3, 0.6, hit, { up: 0.6, grav: -2 });   /* nổ hoa pháo */
      if (i % 3 === 0) task(hit, 0.01, () => shake(0.04 + f * 0.015)); }
    decal(T, TEX.glow, 0xfff0b0, R0 * 2.2, 1.6, 0.5, { op: 0.4, hold: 0.6 }); rune(T, "sun", "latin", gold ? 0xffd860 : 0xfff0b0, R0 * 2, 1.5, 0.3, { mode: "static", op: 0.7 });
    upg(T, f, gold ? 0xffd860 : 0xfff0b0, 0.9, R0 * 0.7);
  };

  /* --- Edison: ngàn bóng đèn hỏng xoay quanh, rồi một bóng sáng rực: hồi máu --- */
  META.never_give_up = { name: "Never Give Up", lv: 38, who: "Thomas Edison", forms: ["Vòng bóng hỏng → 1 bóng sáng rực", "Nhiều bóng hơn, sáng dần cả vòng", "Bóng khổng lồ + cột sáng", "Bóng vàng + mưa ánh sáng"] };
  SK.never_give_up = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, n = [10, 14, 18, 22][f - 1], lit = 0.9, dur = 2.3, R0 = 2.2;
    for (let i = 0; i < n; i++) { const a0 = i / n * PI * 2, y = 1 + (i % 3) * 0.5;
      prop(0, dur, () => { const o = bulb(gold, false);
        return { g: o.g, upd: (k, t) => { o.gm.uniforms.uTime.value = t; const on = t > lit + i * 0.03 * (f >= 2 ? 1 : 0) && (f >= 2 || i === 0), a = a0 + t * 1.6; o.g.position.set(F.x + Math.cos(a) * R0, y + Math.sin(t * 3 + i) * 0.1, F.z + Math.sin(a) * R0);
          o.fil.material.color.set(on ? 0xffd060 : 0x303030); o.fil.scale.setScalar(on ? 1.2 : 0.2); o.gm.uniforms.uC1.value.set(on ? 0xfff0b0 : 0x606a78); o.gm.uniforms.uAlpha.value = pop(k, 0.1, 0.85); o.g.scale.setScalar(0.7 * Math.min(1, t / 0.15)); } }; }); }
    const top = F.clone().setY(3.6 + f * 0.2);
    prop(0.2, dur - 0.2, () => { const o = bulb(gold, false); o.g.position.copy(top);
      return { g: o.g, upd: (k, t) => { o.gm.uniforms.uTime.value = t; const on = t > lit - 0.2; o.fil.material.color.set(on ? 0xffd060 : 0x303030); o.fil.scale.setScalar(on ? 2.5 + f * 0.5 : 0.2); o.gm.uniforms.uC1.value.set(on ? 0xffe880 : 0x606a78); o.g.scale.setScalar((1.6 + f * 0.3) * Math.min(1, t / 0.2)); o.gm.uniforms.uAlpha.value = pop(k, 0.1, 0.85); o.g.rotation.y = t; } }; });
    textPop(top.clone().add(new V3(0, 0.8, 0)), "...", "#a0a8b0", 1, 0.5, 0.2, { rise: 0.2 });
    glow(top, 0xffffff, 3 + f * 0.6, 0.3, lit, { flash: true }); glow(top, gold ? 0xffd040 : 0xfff0b0, 3 + f * 0.5, 0.7, lit); shock(F, 0xfff0b0, 4, 0.6, lit);
    textPop(top.clone().add(new V3(0, 1.6, 0)), "NEVER", gold ? "#ffe060" : "#fff6c0", 1.8, 1.1, lit); textPop(top.clone().add(new V3(0, 0.9, 0)), "GIVE UP!", gold ? "#ffe060" : "#fff6c0", 1.8, 1.1, lit + 0.1);
    if (f >= 3) pillar(F, 0xfff0b0, 0xffffff, 1.2, 5, 1.0, lit, { speed: 3 });
    if (gold) emitter(50, i => ({ p: F.clone().add(new V3(R(-3, 3), R(4, 5.5), R(-3, 3))), v: new V3(0, -1.6, 0), t0: lit + R(0, 1), life: 1.4, size: R(0.25, 0.45), col: [0xffe060, 0xffffff][i % 2] }), { grav: 0, drag: 0 });
    for (let i = 0; i < 4 + f; i++) textPop(F.clone().add(new V3(R(-0.9, 0.9), 1.5 + R(0, 0.8), R(-0.5, 0.5))), "+", "#7dff9a", 1, 0.9, lit + 0.1 + i * 0.2);
    upg(F, f, 0xfff0b0, lit, 2.4);
  };

  /* --- Tesla: tháp cuộn Tesla trồi khỏi đất, quả cầu trên đỉnh phóng sét nảy qua các quái --- */
  META.tesla_coil = { name: "Tesla Coil", lv: 40, who: "Nikola Tesla", forms: ["Tháp Tesla + sét nảy", "Sét đôi + tia lửa", "Sét chẻ nhánh + vòng điện quanh tháp", "Tháp vàng, sét tím-vàng"] };
  SK.tesla_coil = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, now = CLOCK_MS(), first = !LAST.tesla || now - LAST.tesla > 900; LAST.tesla = now;
    const d = SDIR(F, T); if (first) LAST.teslaP = F.clone().add(new V3(-d.z, 0, d.x).multiplyScalar(1.4)).addScaledVector(d, -0.4);
    const B0 = LAST.teslaP, H = 3.6 + f * 0.2, top = B0.clone().setY(H + 0.4), c1 = gold ? 0xffd860 : 0xb08aff, c2 = 0xd8f0ff;
    if (first) { prop(0, 2.0, () => { const g = new THREE.Group(), cm = ghostMat(gold ? 0xffc040 : 0x8a6aff, 0xe8e0ff, { fres: 0.8, cut: -0.5 });
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, H, 16, 1, true), cm); col.position.y = H / 2; g.add(col);
        for (let i = 0; i < 10; i++) { const rr = new THREE.Mesh(new THREE.TorusGeometry(0.42 - i * 0.008, 0.035, 5, 20).rotateX(PI / 2), cm); rr.position.y = 0.4 + i * (H - 0.8) / 10; g.add(rr); }   /* cuộn dây */
        const tor = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.25, 10, 26).rotateX(PI / 2), cm); tor.position.y = H + 0.2; g.add(tor);
        const orb = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c1, blending: ADD, transparent: true, depthWrite: false })); orb.position.y = H + 0.4; g.add(orb); g.position.copy(B0);
        return { g, upd: (k, t) => { cm.uniforms.uTime.value = t; const rise = Math.min(1, t / 0.25); g.position.y = -H * (1 - rise); cm.uniforms.uAlpha.value = pop(k, 0.05, 0.85); orb.scale.setScalar(2 + Math.sin(t * 30) * 0.5 + f * 0.3); } }; });
      decal(B0, TEX.crack, 0xffffff, 2.4, 2, 0, { add: false, op: 0.8, ro: 3 }); sparks(B0.clone().setY(0.2), [0x8a7a5a, 0xb8a888], 20, 4, 0.3, 0.6, 0.05, { up: 1.5 });
      if (f >= 3) for (let i = 0; i < 3; i++) bolt(top, B0.clone().add(new V3(Math.cos(i * 2.1) * 1.5, 0.1, Math.sin(i * 2.1) * 1.5)), c1, 0.08, 1.6, 0.25, { jag: 0.5 }); }
    const B = T.clone().setY(1.2), dl = first ? 0.25 : 0;
    bolt(top, B, c2, 0.2 + f * 0.04, 0.22, dl, { jag: 0.7 }); bolt(top, B, c1, 0.4 + f * 0.06, 0.22, dl, { jag: 0.9 });
    if (f >= 2) bolt(top, B.clone().add(new V3(0.4, 0.3, 0)), c1, 0.25, 0.2, dl + 0.04, { jag: 1.1 });
    if (f >= 3) { const mid = top.clone().lerp(B, 0.6); bolt(mid, mid.clone().add(new V3(R(-1.5, 1.5), -1, R(-1.5, 1.5))), c1, 0.15, 0.2, dl + 0.05, { jag: 0.5 }); }
    glow(B, 0xffffff, 1.8 + f * 0.4, 0.15, dl, { flash: true }); glow(top, c1, 2.5, 0.15, dl, { flash: true }); sparks(B, [c2, c1, 0xffffff], 12 + f * 4, 6, 0.15, 0.3, dl, { up: 1 });
    task(dl, 0.01, () => shake(0.05 + f * 0.02)); if (first) upg(T, f, c1, 0.3, 1.8);
  };

  /* --- Tesla: 2 luồng sét xanh + tím xoắn nhau, đổi chiều liên tục rồi đánh xuống --- */
  META.ac_storm = { name: "AC Storm", lv: 40, who: "Nikola Tesla", forms: ["2 luồng sét xoắn đánh xuống", "Xoắn dày hơn + vòng điện", "3 cú đánh liên tiếp", "Sét vàng-tím khổng lồ"] };
  SK.ac_storm = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, nS = f >= 3 ? 3 : 1, H = 11, ca = gold ? 0xffd860 : 0x5ab0ff, cb = gold ? 0xffffff : 0xc060ff;
    rune(T, "star", "runic", ca, 4 + f * 0.4, 1.4 + nS * 0.3, 0, { mode: "static", op: 0.9 }); shadowUnder(T, 5, 1.6, 0);
    for (let s = 0; s < nS; s++) { const dl = 0.2 + s * 0.3, P = T.clone().add(s ? new V3(R(-1, 1), 0, R(-1, 1)) : new V3());
      [[ca, 0], [cb, PI]].forEach(([c, ph]) => task(dl, 0.45, () => { const mt = basic(null, c, true, 1), m = mesh(new THREE.BufferGeometry(), mt, 9); SC.add(m); const pts = []; for (let i = 0; i <= 50; i++) pts.push(new V3()); let acc = 1;
        return { upd: (k, t, dt) => { acc += dt || 0.016; if (acc > 0.04) { acc = 0; const dir = Math.sin(t * 40) > 0 ? 1 : -1, reach = Math.min(1, t / 0.12);   /* dòng điện xoay chiều: đổi chiều liên tục */
            for (let i = 0; i <= 50; i++) { const u = i / 50, a = ph + u * 14 * dir + t * 20 * dir, r = (0.35 + 0.25 * f) * (1 - u * 0.5); pts[i].set(P.x + Math.cos(a) * r + R(-0.08, 0.08), H - u * H * reach, P.z + Math.sin(a) * r + R(-0.08, 0.08)); }
            m.geometry.dispose(); m.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.06 + f * 0.015, 4); }
          mt.opacity = 1 - Math.max(0, k - 0.6) / 0.4; }, end: () => kill(m) }; }));
      bolt(P.clone().setY(H), P.clone().setY(0.1), 0xffffff, 0.35 + f * 0.08, 0.3, dl + 0.12, { jag: 0.5 });
      const hit = dl + 0.12; glow(P.clone().setY(1.2), 0xffffff, 4 + f, 0.25, hit, { flash: true }); glow(P.clone().setY(1.2), ca, 5 + f, 0.4, hit, { flash: true }); shock(P, cb, 2.4 + f * 0.4, 0.45, hit);
      sparks(P.clone().setY(0.3), [ca, cb, 0xffffff], 30 + f * 10, 8, 0.25, 0.5, hit, { up: 1.2 }); decal(P, TEX.crack, 0xffffff, 3, 1.2, hit, { add: false, op: 0.8, ro: 3 }); task(hit, 0.01, () => shake(0.14 + f * 0.05)); }
    if (f >= 2) for (let i = 0; i < 3; i++) orbitStar(T, cb, 1, 2.4, 1.4, 0.4, i / 3);
    upg(T, f, ca, 0.35, 2.4);
  };

  /* --- Tesla: rotor nam châm khổng lồ quay dưới chân, quái bị kéo xoay như máy giặt --- */
  META.motor_spin = { name: "Motor Spin", lv: 40, who: "Nikola Tesla", forms: ["Rotor nam châm quay, kéo quái xoay", "Đường sức từ xoáy + tia lửa", "Rotor 2 tầng + lốc điện", "Rotor vàng khổng lồ"] };
  SK.motor_spin = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 4 + f * 0.3, dur = 1.8, c1 = gold ? 0xffd860 : 0x5ab0ff;
    shadowUnder(F, R0 * 2.4, dur, 0);
    prop(0, dur, () => { const g = new THREE.Group(), N = 12;
      for (let i = 0; i < N; i++) { const a = i / N * PI * 2, seg = new THREE.Mesh(new THREE.TorusGeometry(R0, 0.22, 6, 8, PI * 2 / N * 0.85).rotateX(PI / 2), basic(null, i % 2 ? 0xff4a4a : 0x4a8aff, true, 0.9)); seg.rotation.y = -a; g.add(seg);
        const lab = new THREE.Sprite(new THREE.SpriteMaterial({ map: txtTex(i % 2 ? "N" : "S", i % 2 ? "#ff7a7a" : "#7ab0ff"), transparent: true, depthWrite: false })); lab.position.set(Math.cos(a + 0.2) * R0, 0.6, Math.sin(a + 0.2) * R0); lab.scale.setScalar(0.8); g.add(lab); }   /* stato: cực N đỏ / S xanh */
      const rot = new THREE.Group(), rm = ghostMat(gold ? 0xffc040 : 0xb8c8e0, 0xffffff, { fres: 0.6, cut: -0.5 }); for (let i = 0; i < 4; i++) { const bar = new THREE.Mesh(new THREE.BoxGeometry(R0 * 1.7, 0.1, 0.22), rm); bar.rotation.y = i * PI / 4; rot.add(bar); }
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16), rm); rot.add(hub); rot.position.y = 0.25; g.add(rot); g.position.set(F.x, 0.05, F.z);
      return { g, upd: (k, t) => { rm.uniforms.uTime.value = t; rm.uniforms.uAlpha.value = 0.6 * pop(k, 0.08, 0.85); const sp = Math.min(1, t / 0.4); rot.rotation.y = t * t * 6 * (1 + f * 0.2); g.scale.setScalar(0.6 + 0.4 * sp); g.children.forEach(c => { if (c.material && c.material.opacity !== undefined && c !== rot) c.material.opacity = 0.9 * pop(k, 0.08, 0.85); }); } }; });
    emitter(80 + f * 30, i => { const a = R(0, PI * 2), r = R(1, R0 * 1.1), p = F.clone().add(new V3(Math.cos(a) * r, R(0.2, 1.6), Math.sin(a) * r)); return { p, v: new V3(-Math.sin(a) * 7, 0, Math.cos(a) * 7).add(new V3(-Math.cos(a), 0, -Math.sin(a)).multiplyScalar(r * 0.6)), t0: R(0.1, dur - 0.4), life: R(0.3, 0.6), size: R(0.2, 0.4), col: [c1, 0xffffff, 0xff7a7a][i % 3] }; }, { grav: 0, drag: 0.5 });   /* bị cuốn xoay vòng */
    for (let h = 0; h < 4; h++) { const at = 0.2 + h * 0.3; shock(F, c1, R0 * 0.9, 0.35, at, 0.3); if (f >= 2) for (let q = 0; q < 2; q++) { const a = R(0, PI * 2); bolt(F.clone().add(new V3(Math.cos(a) * R0 * 0.3, 0.4, Math.sin(a) * R0 * 0.3)), F.clone().add(new V3(Math.cos(a + 0.6) * R0, 0.4, Math.sin(a + 0.6) * R0)), c1, 0.12, 0.15, at, { jag: 0.4 }); } task(at, 0.01, () => shake(0.05 + f * 0.02)); }
    if (f >= 3) tornado(F, c1, 0xffffff, 1.4, 3.6, 1.2, 0.3);
    upg(F, f, c1, 0.3, R0 * 0.7);
  };

  /* --- Carrier: bão lạnh thổi từ ống gió, băng phủ kín quái, cả vùng đóng băng --- */
  META.absolute_chill = { name: "Absolute Chill", lv: 42, who: "Willis Carrier", forms: ["Bão tuyết xoáy + băng phủ", "Gai băng vòng quanh + sương lạnh", "4 cửa gió thổi + gai băng lớn", "Vòm băng khổng lồ"] };
  SK.absolute_chill = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 5 + f * 0.4, freeze = 0.7, c1 = 0x9ae8ff, c2 = 0xffffff, nV = f >= 3 ? 4 : 1;
    decal(F, TEX.glow, c1, R0 * 2.2, 2.4, 0.1, { mode: "expand", expand: 0.3, op: 0.3, hold: 0.75 }); rune(F, "seal", "runic", c1, R0 * 1.9, 2.4, 0, { mode: "static", op: 0.85 });
    for (let v = 0; v < nV; v++) { const a = v / nV * PI * 2 + PI / 4, P = F.clone().add(nV > 1 ? new V3(Math.cos(a) * R0 * 0.8, 0, Math.sin(a) * R0 * 0.8) : new V3()).setY(6.5);
      prop(0, freeze + 0.4, () => { const g = new THREE.Group(), vm = ghostMat(0xb8d8f0, 0xffffff, { fres: 0.6, cut: -0.5 }), box = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.8, 1, 4, 1, true), vm); box.rotation.y = PI / 4; g.add(box);
        for (let i = 0; i < 4; i++) { const sl = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.05, 0.12), vm); sl.position.set(0, -0.45, -0.45 + i * 0.3); sl.rotation.x = 0.6; g.add(sl); }   /* cửa gió có lá chắn */
        g.position.copy(P); if (nV > 1) g.lookAt(F.clone().setY(0.5));
        return { g, upd: (k, t) => { vm.uniforms.uTime.value = t; vm.uniforms.uAlpha.value = 0.5 * pop(k, 0.1, 0.8); g.scale.setScalar(Math.min(1, t / 0.15) * (0.8 + f * 0.1)); } }; });
      emitter(60 + f * 15, i => { const tgt = F.clone().add(new V3(R(-R0, R0) * 0.8, 0.2, R(-R0, R0) * 0.8)); return { p: P.clone().add(rv(0.4)), v: tgt.sub(P).multiplyScalar(R(1.4, 2.2)), t0: R(0.05, freeze), life: R(0.45, 0.7), size: R(0.2, 0.45), col: [c1, c2, 0xd8f4ff][i % 3] }; }, { grav: 0, drag: 0.4 }); }   /* bão tuyết thổi xuống */
    emitter(80, i => { const a = R(0, PI * 2), r = R(0.5, R0); return { p: F.clone().add(new V3(Math.cos(a) * r, R(0.2, 2.5), Math.sin(a) * r)), v: new V3(-Math.sin(a) * 4, R(-0.5, 0.3), Math.cos(a) * 4), t0: R(0.1, freeze + 0.6), life: R(0.5, 0.9), size: R(0.15, 0.3), col: c2 }; }, { grav: 0, drag: 0.6 });
    shards(F, c1, 10 + f * 4, R0 * 0.85, 1.6 + f * 0.4, 1.8, freeze, { c2, ring: true }); if (f >= 2) shards(F, 0xd8f4ff, 8 + f * 2, R0 * 0.5, 1 + f * 0.3, 1.6, freeze + 0.1, { c2, ring: true });
    glow(F.clone().setY(1), c2, 5 + f, 0.35, freeze, { flash: true }); shock(F, c2, R0, 0.6, freeze); decal(F, TEX.crack, 0xbfe8ff, R0 * 1.6, 1.6, freeze, { op: 0.8, ro: 3 });
    if (gold) dome(F, c1, c2, R0 * 0.8, 1.0, freeze + 0.1);
    upg(F, f, gold ? 0xffd860 : c1, freeze, R0 * 0.7); task(freeze, 0.01, () => shake(0.15 + f * 0.05));
  };
  /* --- Marconi: cột ăng-ten thép mọc lên, sóng radio đồng tâm lan xa, mỗi vòng sóng đánh 1 lần --- */
  META.radio_tower = { name: "Radio Tower", lv: 44, who: "Guglielmo Marconi", forms: ["Cột ăng-ten + 3 vòng sóng", "Sóng dày + đèn đỏ nhấp nháy", "Sóng nhiều tầng + tia điện", "Cột vàng, sóng vàng khổng lồ"] };
  SK.radio_tower = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, H = 6 + f * 0.5, R0 = 8, c1 = gold ? 0xffd860 : 0x7ad8ff, P0 = F.clone().addScaledVector(SDIR(F, T), -0.8), dur = 1.9;
    prop(0, dur, () => { const g = new THREE.Group(), lm = new THREE.LineBasicMaterial({ color: gold ? 0xffe080 : 0xc8e0f0, transparent: true, blending: ADD, depthWrite: false }), pts = [];
      const legs = [[1, 1], [1, -1], [-1, -1], [-1, 1]], w = u => 1.1 * (1 - u) + 0.12;
      for (let i = 0; i < 4; i++) { const [x0, z0] = legs[i], [x1, z1] = legs[(i + 1) % 4]; for (let s = 0; s < 8; s++) { const u0 = s / 8, u1 = (s + 1) / 8;
        pts.push(x0 * w(u0), u0 * H, z0 * w(u0), x0 * w(u1), u1 * H, z0 * w(u1)); pts.push(x0 * w(u0), u0 * H, z0 * w(u0), x1 * w(u1), u1 * H, z1 * w(u1)); pts.push(x1 * w(u0), u0 * H, z1 * w(u0), x0 * w(u1), u1 * H, z0 * w(u1)); pts.push(x0 * w(u1), u1 * H, z0 * w(u1), x1 * w(u1), u1 * H, z1 * w(u1)); } }   /* khung giàn thép chéo */
      const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); const tw = new THREE.LineSegments(geo, lm); g.add(tw);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.4, 5), basic(null, 0xffffff, true, 1)); mast.position.y = H + 0.7; g.add(mast);
      const lamp = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0xff3a3a, blending: ADD, transparent: true, depthWrite: false })); lamp.position.y = H + 1.4; g.add(lamp); g.position.copy(P0);
      return { g, upd: (k, t) => { const rise = Math.min(1, t / 0.3); g.scale.set(1, rise, 1); lm.opacity = pop(k, 0.05, 0.85); lamp.scale.setScalar(Math.sin(t * 12) > 0 ? 1.6 : 0.5); } }; });
    const top = P0.clone().setY(H + 1.4); const nT = f >= 3 ? 2 : 1;
    for (let h = 0; h < 3; h++) { const at = 0.35 + h * 0.3;
      for (let l = 0; l < nT; l++) task(at + l * 0.06, 0.9, () => { const m = mesh(new THREE.TorusGeometry(1, 0.035 + f * 0.01, 6, 64).rotateX(PI / 2), basic(null, h % 2 ? 0xffffff : c1, true, 1), 8); m.position.set(P0.x, 0.4 + l * 1.4, P0.z); SC.add(m);
        return { upd: k => { const e = 1 - Math.pow(1 - k, 2); m.scale.set(0.5 + e * R0, 1, 0.5 + e * R0); m.material.opacity = 0.8 * (1 - k); }, end: () => kill(m) }; });   /* vòng sóng radio lan rộng */
      decal(P0, TEX.ring, c1, R0 * 2, 0.8, at, { mode: "expand", expand: 0.3, op: 0.6 }); glow(top, c1, 2.5, 0.2, at, { flash: true }); task(at, 0.01, () => shake(0.05 + f * 0.02));
      if (f >= 3) for (let q = 0; q < 2; q++) { const a = R(0, PI * 2); bolt(top, P0.clone().add(new V3(Math.cos(a) * 3, 0.2, Math.sin(a) * 3)), c1, 0.1, 0.15, at, { jag: 0.5 }); } }
    if (f >= 2) textPop(top.clone().add(new V3(0, 0.8, 0)), "((•))", gold ? "#ffe060" : "#bfeaff", 1.4, 0.8, 0.3);
    upg(P0, f, c1, 0.35, 3);
  };

  /* --- Marconi: pháo hiệu SOS bắn lên trời, đồng đội hồi máu + chạy nhanh --- */
  META.sos_beacon = { name: "SOS Beacon", lv: 44, who: "Guglielmo Marconi", forms: ["Pháo hiệu đỏ bắn lên, mã · · · — — — · · ·", "Pháo sáng to + tia sáng rọi xuống", "+ vệt tốc độ quanh người", "Pháo vàng + mưa sáng"] };
  SK.sos_beacon = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, up = 0.5, H = 6.5, c1 = gold ? 0xffd040 : 0xff4a3a, S = F.clone().setY(H);
    orbFly(F.clone().setY(1.6), S, c1, 0xffffff, 0.6, up, 0, { arc: 0 });
    glow(S, 0xffffff, 6 + f * 1.5, 0.35, up, { flash: true }); glow(S, c1, 4 + f, 1.6, up); sparks(S, [c1, 0xffd0a0, 0xffffff], 40 + f * 15, 7, 0.3, 1.1, up, { up: 0.2, grav: -3 });
    textPop(S.clone().add(new V3(0, 1.1, 0)), "SOS", gold ? "#ffe060" : "#ffd0c0", 2, 1.1, up + 0.05, { rise: 0.3 }); textPop(S.clone().add(new V3(0, 0.2, 0)), "···–––···", gold ? "#ffe060" : "#ffb0a0", 2, 1.1, up + 0.15, { rise: 0.3 });
    if (f >= 2) task(up, 1.4, () => { const mt = flowMat({ c1, c2: 0xfff0e0, rep: [2, 1], spd: [0, -1.5], fres: 1, cut: 0.2, fade: [0, 0, 0.05, 0.3] }), m = mesh(new THREE.CylinderGeometry(0.2, 2.2, H, 20, 1, true).translate(0, H / 2, 0), mt); m.position.set(F.x, 0, F.z); SC.add(m);
      return { upd: (k, t) => { mt.uniforms.uTime.value = t; mt.uniforms.uAlpha.value = 0.6 * pop(k, 0.1, 0.7); }, end: () => kill(m) }; });   /* ánh pháo rọi xuống đội */
    decal(F, TEX.glow, c1, 5, 1.6, up, { op: 0.5, hold: 0.6 }); rune(F, "circle", "latin", c1, 4, 1.6, up, { mode: "spin", spin: 1, op: 0.7 });
    if (f >= 3) emitter(40, i => { const a = R(0, PI * 2), r = R(0.6, 1.4); return { p: F.clone().add(new V3(Math.cos(a) * r, R(0.2, 1.6), Math.sin(a) * r)), v: new V3(-Math.sin(a) * 6, 0, Math.cos(a) * 6), t0: up + R(0, 1), life: 0.3, size: R(0.15, 0.3), col: 0xffffff }; }, { grav: 0, drag: 0 });   /* vệt tốc độ */
    if (gold) emitter(50, i => ({ p: S.clone().add(new V3(R(-3, 3), 0, R(-3, 3))), v: new V3(0, -3, 0), t0: up + R(0, 1), life: 2.2, size: R(0.25, 0.45), col: [0xffe060, 0xffffff][i % 2] }), { grav: 0, drag: 0 });
    for (let i = 0; i < 3 + f; i++) textPop(F.clone().add(new V3(R(-0.9, 0.9), 1.5 + R(0, 0.8), R(-0.5, 0.5))), "+", "#7dff9a", 0.9, 0.9, up + 0.2 + i * 0.25);
    upg(F, f, c1, up, 2.2);
  };

  /* --- Baird: màn hình ti vi cổ khổng lồ hút quái vào, nhiễu sóng sọc trắng đen --- */
  function staticTex() { return TEX.stat || (TEX.stat = cvTex(128, (g, n) => { const im = g.createImageData(n, n); for (let i = 0; i < n * n; i++) { const v = Math.random() * 255; im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v; im.data[i * 4 + 3] = 255; } g.putImageData(im, 0, 0);
    g.fillStyle = "rgba(0,0,0,.35)"; for (let y = 0; y < n; y += 4) g.fillRect(0, y, n, 2); }, true)); }
  META.screen_trap = { name: "Screen Trap", lv: 46, who: "John Logie Baird", forms: ["Ti vi cổ hút quái vào nhiễu sóng", "Màn to + sọc nhiễu chớp", "+ 2 ti vi nhỏ hai bên", "Khung ti vi vàng"] };
  SK.screen_trap = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), hold = 2.4, nTV = f >= 3 ? 3 : 1, sz = 2.6 + f * 0.25, st = staticTex();
    for (let v = 0; v < nTV; v++) { const off = v === 0 ? 0 : v === 1 ? -1 : 1, P = T.clone().add(new V3(-d.z, 0, d.x).multiplyScalar(off * 2.6)).setY(sz * 0.6 + (v ? 0.6 : 0)), s = v ? 0.55 : 1;
      prop(v * 0.12, hold, () => { const g = new THREE.Group(), fm = ghostMat(gold ? 0xffc040 : 0x8a6a4a, 0xffe0b0, { fres: 0.5, cut: -0.55 }); fm.blending = THREE.NormalBlending;
        const box = new THREE.Mesh(new THREE.BoxGeometry(sz * 1.3, sz, sz * 0.7), fm); box.position.z = -sz * 0.36; g.add(box);
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(sz * 1.05, sz * 0.78), new THREE.MeshBasicMaterial({ map: st, transparent: true })); scr.position.z = 0.01; g.add(scr);
        [-1, 1].forEach(q => { const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, sz * 0.7, 4), fm); ant.position.set(q * sz * 0.25, sz * 0.75, -sz * 0.3); ant.rotation.z = -q * 0.5; g.add(ant); });
        [-1, 1].forEach(q => { const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 10).rotateX(PI / 2), fm); knob.position.set(sz * 0.6, q * 0.25, 0.02); g.add(knob); });
        g.position.copy(P); g.scale.setScalar(s);
        return { g, upd: (k, t) => { g.quaternion.copy(CAM.quaternion); /* màn hình luôn quay về camera */ fm.uniforms.uTime.value = t; fm.uniforms.uAlpha.value = pop(k, 0.06, 0.88); scr.material.opacity = pop(k, 0.06, 0.88); st.offset.set(Math.random(), Math.random()); st.repeat.set(1.5, 1.5);
          g.scale.setScalar(s * Math.min(1, t / 0.15) * (k > 0.9 ? 1 - (k - 0.9) / 0.1 * 0.9 : 1)); } }; }); }
    emitter(60 + f * 20, i => { const a = R(0, PI * 2), r = R(2, 3.5), p = T.clone().add(new V3(Math.cos(a) * r, R(0.3, 2.5), Math.sin(a) * r)); return { p, v: T.clone().setY(sz * 0.6).sub(p).multiplyScalar(2.2), t0: R(0.1, 0.6), life: 0.45, size: R(0.2, 0.4), col: i % 2 ? 0xffffff : 0x9a9aa8 }; }, { grav: 0, drag: 0 });   /* bị hút vào màn hình */
    glow(T.clone().setY(sz * 0.6), 0xffffff, 3 + f, 0.3, 0.15, { flash: true }); textPop(T.clone().setY(sz * 1.25 + 0.4), "NO SIGNAL", "#e8e8f0", 1.4, 1.0, 0.4, { rise: 0.2 });
    if (f >= 2) for (let i = 0; i < 4; i++) glow(T.clone().setY(sz * 0.6), 0xffffff, 2.5, 0.08, 0.6 + i * 0.4, { flash: true });
    upg(T, f, gold ? 0xffd860 : 0xd8d8e8, 0.3, 2.4); task(0.3, 0.01, () => shake(0.08 + f * 0.03));
  };

  /* --- Bertha Benz: lao tới như chiếc xe ba bánh rực lửa, vệt bánh cháy, đâm xuyên hàng quái --- */
  /* --- Benz: động cơ xy-lanh linh hồn hiện sau quái, piston nổ liên hoàn bùm bùm bùm vào quái --- */
  function engineBlock(nC, gold) {
    const g = new THREE.Group(), mm = ghostMat(gold ? 0xd8a830 : 0x8a96a8, gold ? 0xfff0b0 : 0xe8eef8, { fres: 0.5, cut: -0.6, gain: 1 }); mm.blending = THREE.NormalBlending;
    const sm = flowMat({ c1: 0x9ab0c8, c2: 0xffffff, rep: [1, 1], spd: [0, 0], fres: 1.6, cut: -0.4, gain: 0.8, fade: [0, 0, 0, 0] }), y0 = 0.7, r = 0.38, L = 1.35, gap = 1.25, cyl = [];
    for (let i = 0; i < nC; i++) { const x = (i - (nC - 1) / 2) * gap, c = new THREE.Group(); c.position.x = x; g.add(c);
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2 * r + 1.1, 18, 1, true), sm); sleeve.position.y = y0 + L + 0.3; c.add(sleeve);   /* ống xy-lanh trong suốt */
      const head = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.3, 1.15), mm); head.position.y = y0 + L + r + 0.95; c.add(head);
      const piston = new THREE.Group(), pb = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.55, 18), mm); piston.add(pb);
      for (let q = 0; q < 3; q++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.465, 0.025, 4, 20).rotateX(PI / 2), basic(null, 0xffffff, true, 0.6)); ring.position.y = 0.15 - q * 0.08; piston.add(ring); } c.add(piston);
      const rod = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1, 0.12), mm); c.add(rod);
      const fire = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0xffa020, blending: ADD, transparent: true, depthWrite: false })); fire.position.y = y0 + L + r + 0.45; c.add(fire);
      const fire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.8, 16), flowMat({ c1: 0xff6a10, c2: 0xffe080, rep: [2, 1], spd: [0.4, 1.8], fres: 0, cut: 0, gain: 1.8, fade: [0, 0, 0, 0] })); fire2.position.y = y0 + L + r + 0.45; c.add(fire2);
      cyl.push({ piston, rod, fire, fire2, x }); }
    const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, nC * gap + 0.4, 10).rotateZ(PI / 2), mm); crank.position.y = y0; g.add(crank);
    const base = new THREE.Mesh(new THREE.BoxGeometry(nC * gap + 0.6, 0.35, 1.2), mm); base.position.y = y0 - 0.55; g.add(base);
    const set = (a) => cyl.forEach((c, i) => { const th = a + i * PI / 2, py = y0 + r * Math.cos(th), pz = r * Math.sin(th), top = py + Math.sqrt(L * L - pz * pz);   /* trục khuỷu → thanh truyền → piston */
      c.piston.position.set(0, top, 0); const mid = new V3(0, (py + top) / 2, pz / 2); c.rod.position.copy(mid); c.rod.scale.y = Math.hypot(top - py, pz); c.rod.rotation.x = Math.atan2(pz, top - py); });
    return { g, mm, sm, cyl, set, crank };
  }
  META.berthas_drive = { name: "Benz Engine", lv: 48, who: "Karl & Bertha Benz", forms: ["Động cơ 2 xy-lanh nổ liên hoàn", "3 xy-lanh, lửa to hơn", "4 xy-lanh + cầu lửa bắn vào quái", "Động cơ vàng, nổ lớn"] };
  SK.berthas_drive = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), nC = [2, 3, 4, 4][f - 1], nF = 3 + f, gapT = 0.2, t0 = 0.35, w = (PI / 2) / gapT, dur = t0 + nF * gapT + 0.4, P0 = T.clone().add(new V3(d.z, 0, -d.x).multiplyScalar(2.2 + nC * 0.3)).addScaledVector(d, -0.6), sc = 0.9 + f * 0.08;
    shadowUnder(P0, nC * 1.6, dur, 0);
    prop(0, dur, () => { const E = engineBlock(nC, gold); E.g.position.copy(P0); const fired = new Array(nF).fill(false);
      return { g: E.g, upd: (k, t) => { E.mm.uniforms.uTime.value = t; E.sm.uniforms.uTime.value = t; E.g.quaternion.copy(CAM.quaternion); /* mặt cắt động cơ quay về camera */
        E.g.scale.setScalar(sc * Math.min(1, t / 0.2)); const a = w * (t - t0); E.set(a); E.crank.rotation.x = a; const al = pop(k, 0.08, 0.88); E.mm.uniforms.uAlpha.value = al; E.sm.uniforms.uAlpha.value = 0.5 * al;
        E.cyl.forEach((c, i) => { const ph = ((a + i * PI / 2) % (PI * 2) + PI * 2) % (PI * 2), burn = t > t0 && ph < 1.2 ? 1 - ph / 1.2 : 0;   /* nổ ở điểm chết trên rồi tắt dần */
          c.fire.scale.setScalar(0.2 + burn * (2.4 + f * 0.4)); c.fire.material.opacity = burn; c.fire2.material.uniforms.uTime.value = t; c.fire2.material.uniforms.uAlpha.value = burn; c.fire2.visible = burn > 0.02; }); } }; });
    for (let j = 0; j < nF; j++) { const at = t0 + j * gapT + 0.03, S = P0.clone().add(new V3(0, (2.3 + 0.38) * sc, 0)), B = T.clone().setY(1).add(new V3(R(-0.5, 0.5), R(0, 0.5), R(-0.5, 0.5)));
      if (f >= 3) orbFly(S, B, 0xff6a10, 0xffe080, 0.6, 0.18, at, { arc: 0.6 });
      const hit = at + (f >= 3 ? 0.18 : 0.02); glow(B, 0xffd080, 2.4 + f * 0.4, 0.2, hit, { flash: true }); glow(B, 0xff5a10, 3 + f * 0.5, 0.3, hit, { flash: true });
      sparks(B, [0xff6a10, 0xffd27a, 0xffffff], 18 + f * 5, 7, 0.25, 0.45, hit, { up: 1 }); shock(T, 0xff8a30, 1.6 + f * 0.3, 0.3, hit); textPop(B.clone().add(new V3(R(-0.6, 0.6), 1, 0)), "BÙM!", gold ? "#ffe060" : "#ffb060", 1.3, 0.45, hit); task(hit, 0.01, () => shake(0.09 + f * 0.03)); }
    emitter(30 + f * 10, i => ({ p: P0.clone().add(new V3(R(-1.5, 1.5), 3.4 * sc, R(-0.5, 0.5))), v: new V3(R(-0.3, 0.3), R(1, 2), R(-0.3, 0.3)), t0: R(t0, dur - 0.3), life: R(0.6, 1), size: R(0.5, 0.9), col: [0x707070, 0x909090, 0x505050][i % 3] }), { grav: 0, drag: 1 });   /* khói xả */
    decal(T, TEX.crack, 0xffffff, 3, dur, t0, { add: false, op: 0.7, ro: 3 });
    upg(T, f, gold ? 0xffd860 : 0xff8a30, t0 + 0.2, 2.4);
  };

  /* --- Stephenson: đường ray sáng hiện dưới đất, tàu hơi nước ma rú còi lao xuyên hàng quái --- */
  function locomotive(gold) {
    const g = new THREE.Group(), lm = ghostMat(gold ? 0xffc040 : 0x4a5a70, 0xd8e0f0, { fres: 0.6, cut: -0.5 }); lm.blending = THREE.NormalBlending;
    const boiler = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.6, 16).rotateX(PI / 2), lm); boiler.position.set(0, 1.2, 0.3); g.add(boiler);
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.5, 1.1), lm); cab.position.set(0, 1.4, -1.4); g.add(cab); const roof = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 1.3), lm); roof.position.set(0, 2.2, -1.4); g.add(roof);
    const fun = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.2, 0.9, 12), lm); fun.position.set(0, 2.1, 1.2); g.add(fun);
    const cow = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.7, 4).rotateX(-PI / 2), lm); cow.position.set(0, 0.45, 1.85); cow.rotation.z = PI / 4; g.add(cow);
    const lamp = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0xfff0b0, blending: ADD, transparent: true, depthWrite: false })); lamp.position.set(0, 1.3, 1.7); lamp.scale.setScalar(1.6); g.add(lamp);
    const wh = []; [-0.7, 0.7].forEach(x => [-1.2, -0.2, 0.8].forEach(z => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 14).rotateZ(PI / 2), lm); w.position.set(x, 0.42, z); g.add(w); wh.push(w); }));
    return { g, lm, wh, top: fun };
  }
  META.steam_express = { name: "Steam Express", lv: 50, who: "George Stephenson", forms: ["Ray sáng + đầu tàu ma lao xuyên", "+ 2 toa, khói dày", "Đoàn tàu dài + còi rú", "Tàu vàng rực"] };
  SK.steam_express = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), side = new V3(-d.z, 0, d.x), A = F.clone().addScaledVector(d, -3).addScaledVector(side, 1.2), E = T.clone().addScaledVector(d, 8), len = A.distanceTo(E), run = 0.8, nC = [0, 2, 3, 3][f - 1], c1 = gold ? 0xffd860 : 0xffe0a0, yaw = Math.atan2(d.x, d.z);
    prop(0, run + 0.6, () => { const g = new THREE.Group(), rm = basic(null, c1, true, 1); [-0.55, 0.55].forEach(x => { const r = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, len), rm); r.position.set(x, 0.04, len / 2); g.add(r); });
      for (let i = 0; i < len / 0.9; i++) { const tie = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.03, 0.22), basic(null, 0xc8a060, true, 0.7)); tie.position.set(0, 0.03, i * 0.9); g.add(tie); }
      g.position.copy(A); g.rotation.y = yaw; return { g, upd: k => g.children.forEach(c => c.material.opacity = (c.geometry.parameters.width > 1 ? 0.7 : 1) * pop(k, 0.12, 0.8)) }; });   /* đường ray ánh sáng */
    const cars = 1 + nC;
    for (let c = 0; c < cars; c++) prop(0.2, run, () => { const o = c === 0 ? locomotive(gold) : (() => { const g = new THREE.Group(), lm = ghostMat(gold ? 0xffc040 : 0x7a4a3a, 0xf0d8c0, { fres: 0.6, cut: -0.5 }); lm.blending = THREE.NormalBlending; const b = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 2.4), lm); b.position.y = 1.1; g.add(b); const wh = []; [-0.7, 0.7].forEach(x => [-0.8, 0.8].forEach(z => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.1, 12).rotateZ(PI / 2), lm); w.position.set(x, 0.32, z); g.add(w); wh.push(w); })); return { g, lm, wh }; })(), P = new V3();
      return { g: o.g, upd: (k, t) => { o.lm.uniforms.uTime.value = t; const u = k * 1.15 - c * 0.12; P.lerpVectors(A, E, Math.max(0, Math.min(1, u))); o.g.position.copy(P); o.g.rotation.y = yaw; o.wh.forEach(w => w.rotation.x = t * 25); o.g.visible = u > 0 && u < 1; o.lm.uniforms.uAlpha.value = u > 0.85 ? (1 - u) / 0.15 : 1; o.g.scale.setScalar(1.1 + f * 0.08); } }; });
    emitter(60 + f * 25, i => { const u = R(0, 0.9), p = A.clone().lerp(E, u); return { p: p.add(new V3(R(-0.3, 0.3), 2.6, R(-0.3, 0.3))), v: new V3(R(-0.6, 0.6), R(1, 2), R(-0.6, 0.6)), t0: 0.2 + u / 1.15 * run, life: R(0.9, 1.5), size: R(0.7, 1.3) * (1 + f * 0.1), col: [0xf0f0f0, 0xd8d8e0, 0xffffff][i % 3] }; }, { grav: 0, drag: 1.2 });   /* khói trắng cuồn cuộn */
    textPop(F.clone().setY(3.6), "TOOT! TOOT!", gold ? "#ffe060" : "#ffffff", 1.6, 0.8, 0.15);
    const hit = 0.2 + run * (A.distanceTo(T) / len) / 1.15; glow(T.clone().setY(1.2), 0xffffff, 4 + f, 0.25, hit, { flash: true }); shock(T, c1, 3 + f * 0.4, 0.5, hit); sparks(T.clone().setY(1), [c1, 0xffffff, 0xffb060], 35 + f * 12, 9, 0.3, 0.6, hit, { up: 1 });
    task(hit, 0.01, () => shake(0.18 + f * 0.06)); upg(T, f, c1, hit, 2.6);
  };

  /* --- anh em Wright: đường hầm gió xoáy kéo dài, hút quái thành 1 hàng --- */
  META.wind_tunnel = { name: "Wind Tunnel", lv: 52, who: "Anh em nhà Wright", forms: ["Đường hầm gió xoáy hút quái", "Hầm dài hơn + vòng gió", "2 lớp xoáy ngược + lá cuốn", "Hầm gió vàng"] };
  SK.wind_tunnel = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), A = F.clone().addScaledVector(d, 0.8).setY(1.3), L = Math.max(6, F.distanceTo(T) + 3), r = 1.4 + f * 0.2, dur = 1.8, c1 = gold ? 0xffd860 : 0xd8f4ff, yaw = Math.atan2(d.x, d.z);
    for (let l = 0; l < (f >= 3 ? 2 : 1); l++) task(0, dur, () => { const mt = flowMat({ c1, c2: 0x9ad8ff, rep: [4, 3], spd: [(l ? -1 : 1) * 2.2, -1.6], fres: 1, cut: 0.25, fade: [0, 0, 0.1, 0.1] }), geo = new THREE.CylinderGeometry(r * (1 - l * 0.3), r * (1.3 - l * 0.3), L, 28, 1, true).rotateX(PI / 2).translate(0, 0, L / 2), m = mesh(geo, mt);
      m.position.copy(A); m.rotation.y = yaw; SC.add(m);
      return { upd: (k, t) => { mt.uniforms.uTime.value = t; mt.uniforms.uAlpha.value = 0.85 * pop(k, 0.1, 0.8); m.scale.set(1, 1, Math.min(1, t / 0.25)); }, end: () => kill(m) }; });   /* ống gió nằm ngang */
    emitter(90 + f * 30, i => { const u = R(0.2, 1), a = R(0, PI * 2), rr = R(0.2, r), p = A.clone().addScaledVector(d, u * L); p.x += Math.cos(a) * rr * Math.cos(yaw); p.z -= Math.cos(a) * rr * Math.sin(yaw); p.y += Math.sin(a) * rr; return { p, v: d.clone().multiplyScalar(-R(5, 9)), t0: R(0.1, dur - 0.5), life: R(0.3, 0.6), size: R(0.15, 0.35), col: i % 4 ? c1 : 0x8adf5a }; }, { grav: 0, drag: 0 });   /* gió hút về phía người chơi */
    if (f >= 2) for (let i = 0; i < 5; i++) task(0.2 + i * 0.28, 0.6, () => { const m = mesh(new THREE.TorusGeometry(r * 1.2, 0.05, 6, 32), basic(null, 0xffffff, true, 1), 9); m.rotation.y = yaw; SC.add(m);
      return { upd: k => { m.position.copy(A).addScaledVector(d, L * (1 - k)); m.material.opacity = 0.9 * Math.sin(k * PI); }, end: () => kill(m) }; });
    glow(T.clone().setY(1.2), c1, 2.5 + f * 0.5, 0.4, 0.3, { flash: true }); for (let i = 0; i < 3; i++) orbitStar(T, 0xffe080, 0.9, 2.4, 1.3, 0.4, i / 3);
    upg(T, f, c1, 0.3, 2.2); task(0.3, 0.01, () => shake(0.08 + f * 0.03));
  };

  /* --- anh em Wright: máy bay cánh kép bằng ánh sáng bay vòng rồi bổ nhào, nổ gió --- */
  function biplane(gold) {
    const g = new THREE.Group(), pm = ghostMat(gold ? 0xffd860 : 0xe8f4ff, 0xffffff, { fres: 0.8, cut: -0.5 }), wm = woodMat(gold);
    [0, 0.8].forEach(y => { const w = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.05, 0.8), pm); w.position.y = y; g.add(w); });
    for (let i = -2; i <= 2; i++) if (i) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 4), wm); s.position.set(i * 0.9, 0.4, 0); g.add(s); }
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 2.6), wm); body.position.set(0, 0.3, -0.6); g.add(body);
    const el = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.4), pm); el.position.set(0, 0.4, 1.2); g.add(el);   /* cánh lái phía trước kiểu Wright Flyer */
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.7, 0.4), pm); tail.position.set(0, 0.4, -1.9); g.add(tail);
    const props = [-0.7, 0.7].map(x => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 0.03), wm); p.position.set(x, 0.4, -0.45); g.add(p); return p; });
    return { g, pm, wm, props };
  }
  META.kitty_hawk_dive = { name: "Kitty Hawk Dive", lv: 52, who: "Anh em nhà Wright", forms: ["Máy bay cánh kép bay vòng rồi bổ nhào", "Vệt mây + nổ gió lớn", "2 máy bay bổ nhào", "Máy bay vàng + bão gió"] };
  SK.kitty_hawk_dive = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, nP = f >= 3 ? 2 : 1, fly = 1.0, c1 = gold ? 0xffd860 : 0xe8f4ff, R0 = 3 + f * 0.3;
    for (let p = 0; p < nP; p++) { const dl = p * 0.18, ph = p * PI, C = T.clone().setY(6), P = new V3(), P2 = new V3();
      const path = (u, out) => { if (u < 0.6) { const a = ph + u / 0.6 * PI * 1.5, rr = 4.5; return out.set(C.x + Math.cos(a) * rr, 6 + Math.sin(u * 10) * 0.3, C.z + Math.sin(a) * rr); } const e = (u - 0.6) / 0.4, a = ph + PI * 1.5, S = new V3(C.x + Math.cos(a) * 4.5, 6, C.z + Math.sin(a) * 4.5); return out.copy(S).lerp(T.clone().setY(0.6), e * e); };   /* bay vòng → bổ nhào */
      prop(dl, fly, () => { const o = biplane(gold);
        return { g: o.g, upd: (k, t) => { o.pm.uniforms.uTime.value = t; o.wm.uniforms.uTime.value = t; path(k, P); path(Math.min(1, k + 0.02), P2); o.g.position.copy(P); o.g.quaternion.copy(basisQ(P2.sub(P).lengthSq() > 1e-6 ? P2 : new V3(0, -1, 0))); o.props.forEach(q => q.rotation.z = t * 40); o.g.scale.setScalar(0.8 + f * 0.08); } }; });
      emitter(50, i => { const u = i / 50, q = path(u, new V3()); return { p: q.add(rv(0.3)), v: rv(0.4), t0: dl + u * fly, life: R(0.4, 0.7), size: R(0.35, 0.6), col: 0xffffff }; }, { grav: 0, drag: 1 });   /* vệt mây trắng */
      const hit = dl + fly; glow(T.clone().setY(1), 0xffffff, 4 + f, 0.25, hit, { flash: true }); shock(T, c1, R0, 0.5, hit); task(hit, 0.01, () => shake(0.16 + f * 0.05)); }
    const hit = fly + (nP - 1) * 0.18;
    emitter(50 + f * 20, i => { const a = R(0, PI * 2); return { p: T.clone().setY(0.4), v: new V3(Math.cos(a) * R(5, 9), R(0.5, 2), Math.sin(a) * R(5, 9)), t0: hit, life: R(0.4, 0.7), size: R(0.3, 0.6), col: i % 3 ? 0xffffff : c1 }; }, { grav: 0, drag: 2 });   /* nổ gió */
    decal(T, TEX.ring, c1, R0 * 2.4, 0.6, hit, { mode: "expand", expand: 0.6, op: 0.9 }); if (f >= 2) decal(T, swirlTex(), 0xffffff, R0 * 2, 0.8, hit, { spin: 6, op: 0.6 });
    if (gold) tornado(T, 0xffd860, 0xffffff, 1.4, 3.6, 1.0, hit);
    upg(T, f, c1, hit, R0 * 0.7);
  };
  /* ---------- CHƯƠNG 4 (Lv.58–92): Vũ trụ & thế giới số – chương cuối, hoành tráng nhất ---------- */
  function moonTex() { return TEX.moon || (TEX.moon = cvTex(256, (g, n) => { g.fillStyle = "#b8b8c0"; g.fillRect(0, 0, n, n); let s = 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 60; i++) { const x = r() * n, y = r() * n, rr = 4 + r() * 22; const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, "rgba(80,80,95,.7)"); gr.addColorStop(0.8, "rgba(110,110,120,.5)"); gr.addColorStop(0.9, "rgba(235,235,240,.7)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr, 0, PI * 2); g.fill(); } }, true)); }
  function moonDisc() { return TEX.moonD || (TEX.moonD = cvTex(256, (g, n) => { g.save(); g.beginPath(); g.arc(n / 2, n / 2, n / 2 - 4, 0, PI * 2); g.clip(); g.drawImage(moonTex().image, 0, 0, n, n); g.restore();
    g.globalCompositeOperation = "destination-in"; const gr = g.createRadialGradient(n / 2, n / 2, n * 0.3, n / 2, n / 2, n / 2); gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, n, n); })); }   /* đất mặt trăng cắt tròn, mép mờ */
  const moonMat = (gold) => solidMat(gold ? 0xb08a30 : 0x8a8a98, gold ? 0xfff0b0 : 0xf0f0f6, gold ? 0xffd860 : 0xd8e8ff, moonTex(), [1, 1]);
  /* --- Galileo: 4 mặt trăng nhỏ quay quanh người, lần lượt phóng vào quái như sao chổi --- */
  META.four_moons = { name: "Four Moons", lv: 58, who: "Galileo Galilei", forms: ["4 mặt trăng quay quanh, phóng như sao chổi", "Trăng to + đuôi sao chổi dài", "+ Sao Mộc mờ trên trời", "Trăng vàng, đuôi lửa vàng"] };
  SK.four_moons = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, now = CLOCK_MS(), first = !LAST.moons || now - LAST.moons > 900; if (first) LAST.moonI = 0; else LAST.moonI++; LAST.moons = now; const idx = LAST.moonI % 4, sz = 0.35 + f * 0.07, c1 = gold ? 0xffd860 : 0xbfe0ff;
    const orbitP = (j, t, out) => { const a = j * PI / 2 + t * 3; return out.set(F.x + Math.cos(a) * 1.8, 2 + Math.sin(t * 2 + j) * 0.2, F.z + Math.sin(a) * 1.8); };
    if (first) { LAST.moonT0 = now; for (let j = 0; j < 4; j++) prop(0, 0.25 + j * 0.22, () => { const g = new THREE.Group(), mm = moonMat(gold), m = new THREE.Mesh(new THREE.SphereGeometry(sz, 18, 12), mm); g.add(m); const P = new V3();
        return { g, upd: (k, t) => { mm.uniforms.uTime.value = t; orbitP(j, t, P); g.position.copy(P); m.rotation.y = t; g.scale.setScalar(Math.min(1, t / 0.15)); } }; });
      rune(F, "circle", "latin", c1, 4.4, 1.3, 0, { mode: "spin", spin: 1.5, op: 0.6 });
      if (f >= 3) prop(0, 1.4, () => { const g = new THREE.Group(), jm = flowMat({ c1: 0xd8a070, c2: 0xfff0d8, rep: [1, 6], spd: [0.1, 0], fres: 1, cut: -0.4, gain: 0.8, fade: [0, 0, 0, 0] }), j = new THREE.Mesh(new THREE.SphereGeometry(2.2, 24, 16), jm); g.add(j); g.position.copy(F).add(new V3(-4, 7, -6)); return { g, upd: (k, t) => { jm.uniforms.uTime.value = t; jm.uniforms.uAlpha.value = 0.5 * pop(k, 0.2, 0.7); } }; }); }   /* Sao Mộc mờ */
    const tt = (now - (LAST.moonT0 || now)) / 1000, A = orbitP(idx, tt, new V3()), B = T.clone().setY(1.1), fly = 0.28;
    prop(0, fly, () => { const g = new THREE.Group(), mm = moonMat(gold), m = new THREE.Mesh(new THREE.SphereGeometry(sz, 18, 12), mm); g.add(m); const hl = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c1, blending: ADD, transparent: true, depthWrite: false })); hl.scale.setScalar(sz * 5); g.add(hl); const P = new V3();
      return { g, upd: (k, t) => { mm.uniforms.uTime.value = t; P.lerpVectors(A, B, k * k); P.y += Math.sin(k * PI) * 0.8; g.position.copy(P); m.rotation.set(t * 6, t * 4, 0); } }; });
    emitter(30 + f * 10, i => { const u = i / (30 + f * 10), p = A.clone().lerp(B, u * u); p.y += Math.sin(u * PI) * 0.8; return { p: p.add(rv(0.1)), v: rv(0.4), t0: u * fly, life: R(0.25, 0.4) * (1 + f * 0.2), size: R(0.3, 0.55) * (1 + f * 0.1), col: i % 3 ? c1 : 0xffffff }; }, { grav: 0, drag: 2 });   /* đuôi sao chổi */
    glow(B, 0xffffff, 2.5 + f * 0.5, 0.2, fly, { flash: true }); glow(B, c1, 3 + f * 0.6, 0.3, fly, { flash: true }); sparks(B, [0xd8d8e0, c1, 0xffffff], 16 + f * 5, 6, 0.25, 0.45, fly, { up: 1 }); shock(T, c1, 1.4 + f * 0.3, 0.3, fly); task(fly, 0.01, () => shake(0.07 + f * 0.02));
    if (idx === 3) upg(T, f, c1, fly, 2);
  };

  /* --- Galileo: Mặt Trăng nghiêng sát đất, đá Mặt Trăng rơi tạo hố khổng lồ --- */
  META.lunar_crater = { name: "Lunar Crater", lv: 58, who: "Galileo Galilei", forms: ["Trăng sà xuống, đá rơi tạo hố", "Hố to + bụi trăng", "3 tảng đá + vòng bụi lớn", "Trăng vàng + hố vàng khổng lồ"] };
  SK.lunar_crater = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 3.5 + f * 0.4, fall = 0.6, nR = f >= 3 ? 3 : 1, c1 = gold ? 0xffd860 : 0xd8e0ff, M = T.clone().addScaledVector(SDIR(F, T), 2.5).add(new V3(0, 5, 0));
    prop(0, 1.6, () => { const g = new THREE.Group(), mm = moonMat(gold), m = new THREE.Mesh(new THREE.SphereGeometry(3.8, 32, 22), mm); g.add(m); const hl = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c1, blending: ADD, transparent: true, depthWrite: false })); hl.scale.setScalar(13); g.add(hl);
      return { g, upd: (k, t) => { mm.uniforms.uTime.value = t; mm.uniforms.uAlpha.value = pop(k, 0.15, 0.75); hl.material.opacity = 0.5 * pop(k, 0.15, 0.75); g.position.copy(M).add(new V3(0, (1 - Math.min(1, t / 0.4)) * 8, 0)); m.rotation.set(0.4, t * 0.3, 0.2); } }; });   /* Mặt Trăng sà xuống */
    decal(T, TEX.dark, 0xffffff, R0 * 3, 1.8, 0, { add: false, op: 0.7 });
    for (let r = 0; r < nR; r++) { const E = T.clone().add(r ? new V3(R(-1.8, 1.8), 0, R(-1.8, 1.8)) : new V3()), S = M.clone().add(new V3(0, -2, 0)).addScaledVector(SDIR(F, T), -3), dl = 0.35 + r * 0.18, hit = dl + fall, s0 = (r ? 0.7 : 1.1) * (1 + f * 0.15);
      prop(dl, fall, () => { const g = new THREE.Group(), mm = moonMat(gold), m = new THREE.Mesh(new THREE.DodecahedronGeometry(s0, 1), mm); g.add(m); const P = new V3();
        return { g, upd: (k, t) => { mm.uniforms.uTime.value = t; P.lerpVectors(S, E.clone().setY(s0 * 0.5), k * k); g.position.copy(P); m.rotation.set(t * 3, t * 2, 0); } }; });
      emitter(30, i => { const u = i / 30, p = S.clone().lerp(E, u * u); return { p: p.add(rv(0.3)), v: rv(0.3), t0: dl + u * fall, life: 0.4, size: R(0.4, 0.8), col: i % 2 ? 0xff9a40 : 0xffe0a0 }; }, { grav: 0, drag: 2 });   /* cháy khi rơi */
      glow(E.clone().setY(1), 0xffffff, 4 + f, 0.25, hit, { flash: true }); shock(E, c1, (r ? 0.5 : 1) * R0 * 1.2, 0.55, hit); decal(E, TEX.crack, 0xffffff, (r ? 0.5 : 1) * R0 * 1.8, 1.6, hit, { add: false, op: 0.95, ro: 3 });
      sparks(E.clone().setY(0.4), [0xb8b8c0, 0xd8d8e0, 0x9090a0], 40 + f * 15, 8, 0.4, 0.9, hit, { up: 2 }); task(hit, 0.01, () => shake(0.2 + f * 0.06)); }
    const hit = 0.35 + fall; decal(T, moonDisc(), 0x9a9aa8, R0 * 1.8, 1.4, hit, { add: false, op: 0.85, hold: 0.7, ro: 3 });   /* lòng hố mặt trăng */
    if (f >= 2) emitter(60 + f * 20, i => { const a = R(0, PI * 2); return { p: T.clone().add(new V3(Math.cos(a) * 1, 0.3, Math.sin(a) * 1)), v: new V3(Math.cos(a) * R(3, 6), R(0.3, 1.2), Math.sin(a) * R(3, 6)), t0: hit + R(0, 0.1), life: R(0.8, 1.2), size: R(0.6, 1.1), col: [0xc8c8d0, 0xa8a8b0][i % 2] }; }, { grav: -0.5, drag: 1.6 });
    upg(T, f, c1, hit, R0 * 0.7);
  };

  /* --- Hubble: thiên hà xoắn ốc mở dưới chân, nở rộng đẩy quái văng ra --- */
  function galaxyTex() { return TEX.gal || (TEX.gal = cvTex(512, (g, n) => { g.translate(n / 2, n / 2); let s = 3; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const core = g.createRadialGradient(0, 0, 0, 0, 0, 90); core.addColorStop(0, "rgba(255,250,220,1)"); core.addColorStop(0.4, "rgba(255,200,150,.6)"); core.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = core; g.fillRect(-n / 2, -n / 2, n, n);
    const cols = ["#ffffff", "#bfe0ff", "#d8b0ff", "#ffb0d8", "#9ad8ff"];
    for (let i = 0; i < 2600; i++) { const arm = i % 3, u = Math.pow(r(), 0.7), a = arm / 3 * PI * 2 + u * 5.2 + (r() - 0.5) * 0.6 * (1 - u * 0.5), rr = u * 240; const x = Math.cos(a) * rr, y = Math.sin(a) * rr, sz = r() * 2.2 + 0.4;
      g.fillStyle = cols[(r() * cols.length) | 0]; g.globalAlpha = 0.4 + r() * 0.6; g.beginPath(); g.arc(x, y, sz, 0, PI * 2); g.fill(); } g.globalAlpha = 1; })); }
  META.galaxy_bloom = { name: "Galaxy Bloom", lv: 62, who: "Edwin Hubble", forms: ["Thiên hà xoắn ốc nở dưới chân", "Sao bắn ra + sóng đẩy", "2 thiên hà xoay ngược + cột sáng", "Thiên hà vàng khổng lồ"] };
  SK.galaxy_bloom = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 7 + f * 0.4, dur = 1.9, c1 = gold ? 0xffd860 : 0xb08aff;
    decal(F, TEX.dark, 0xffffff, R0 * 2.6, dur, 0, { add: false, op: 0.85, hold: 0.75 });
    decal(F, galaxyTex(), gold ? 0xfff0b0 : 0xffffff, R0 * 2.2, dur, 0, { mode: "expand", expand: 0.35, spin: 1.4, op: 1, inT: 0.4, hold: 0.7 });
    if (f >= 3) decal(F, galaxyTex(), c1, R0 * 1.5, dur, 0.1, { mode: "expand", expand: 0.4, spin: -2.2, op: 0.7, lift: 0.01 });
    glow(F.clone().setY(0.6), 0xfff0d0, 2 + f * 0.4, dur * 0.8, 0);
    emitter(120 + f * 40, i => { const a = R(0, PI * 2), r = R(0.3, 2.5), p = F.clone().add(new V3(Math.cos(a) * r, R(0.1, 0.6), Math.sin(a) * r)), tan = new V3(-Math.sin(a), 0, Math.cos(a)); return { p, v: new V3(Math.cos(a), 0.15, Math.sin(a)).multiplyScalar(R(4, 9)).addScaledVector(tan, 3), t0: R(0.3, 0.8), life: R(0.5, 0.9), size: R(0.15, 0.35), col: [0xffffff, 0xbfe0ff, 0xd8b0ff, 0xffb0d8][i % 4] }; }, { grav: 0, drag: 1.2 });   /* sao văng ra */
    for (let i = 0; i < 2 + f; i++) shock(F, i % 2 ? 0xffffff : c1, R0 * (0.6 + i * 0.15), 0.6, 0.35 + i * 0.1);
    if (f >= 3) pillar(F, c1, 0xffffff, 1.2, 7, 0.9, 0.35, { speed: 3, widen: 0.5 });
    upg(F, f, c1, 0.4, R0 * 0.6); task(0.4, 0.01, () => shake(0.15 + f * 0.05));
  };

  /* --- Hubble: trời tối lại, mưa sao băng lửa rơi xuống cả vùng --- */
  META.meteor_shower = { name: "Meteor Shower", lv: 62, who: "Edwin Hubble", forms: ["Trời tối, mưa sao băng", "Sao băng dày + hố cháy", "Sao băng lớn + đuôi lửa dài", "Mưa sao băng vàng"] };
  SK.meteor_shower = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 6, n = [8, 13, 18, 24][f - 1], dur = 1.9, ca = gold ? 0xffd040 : 0xff6a1a, cb = gold ? 0xfff6c0 : 0xffd27a, dir = new V3(-0.6, -1, -0.4).normalize();
    decal(T, TEX.dark, 0xffffff, R0 * 3.2, dur + 0.3, 0, { add: false, op: 0.9, inT: 0.3, hold: 0.8 });   /* trời tối lại */
    rune(T, "star", "cuneiform", ca, R0 * 1.9, dur, 0.1, { mode: "static", op: 0.6 });
    for (let i = 0; i < n; i++) { const a = R(0, PI * 2), r = Math.sqrt(Math.random()) * R0 * 0.85, E = T.clone().add(new V3(Math.cos(a) * r, 0.3, Math.sin(a) * r)), S = E.clone().addScaledVector(dir, -14), dl = 0.25 + i * (dur - 0.7) / n, fly = 0.35, big = f >= 3 && i % 3 === 0;
      orbFly(S, E, ca, cb, (big ? 1.1 : 0.7) * (1 + f * 0.08), fly, dl, { arc: 0 });
      const hit = dl + fly; glow(E.clone().setY(0.8), 0xffffff, big ? 4 : 2.5, 0.2, hit, { flash: true }); glow(E.clone().setY(0.6), ca, big ? 5 : 3, 0.35, hit, { flash: true });
      sparks(E, [ca, cb, 0xffffff], big ? 30 : 14, 7, 0.3, 0.6, hit, { up: 1.5 }); shock(E, cb, big ? 2.2 : 1.2, 0.35, hit); if (f >= 2) decal(E, TEX.crack, 0xffffff, big ? 2.6 : 1.6, 1.2, hit, { add: false, op: 0.8, ro: 3 });
      if (i % 2 === 0) task(hit, 0.01, () => shake(big ? 0.15 : 0.07)); }
    upg(T, f, ca, 0.8, R0 * 0.6);
  };

  /* --- Armstrong: vùng trọng lực thấp, quái lơ lửng chậm chạp như phi hành gia --- */
  META.moon_gravity = { name: "Moon Gravity", lv: 66, who: "Neil Armstrong", forms: ["Vùng trọng lực thấp, đá bay lơ lửng", "Vòng hành tinh + bụi bay", "Trái Đất hiện trên trời", "Vùng trọng lực vàng"] };
  SK.moon_gravity = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 7, dur = 2.4, c1 = gold ? 0xffd860 : 0x9ab0ff;
    decal(F, moonDisc(), 0xc8c8d8, R0 * 2.2, dur, 0, { add: false, op: 0.6, mode: "static", hold: 0.8 }); rune(F, "circle", "greek", c1, R0 * 2, dur, 0, { mode: "spin", spin: 0.25, op: 0.75 });
    task(0, dur, () => { const mt = flowMat({ c1, c2: 0xffffff, rep: [4, 1], spd: [0.2, 0.3], fres: 1.4, cut: 0.25, fade: [0, 0, 0.02, 0.6] }), m = mesh(new THREE.CylinderGeometry(R0, R0, 4.5, 48, 1, true).translate(0, 2.25, 0), mt); m.position.set(F.x, 0, F.z); SC.add(m);
      return { upd: (k, t) => { mt.uniforms.uTime.value = t; mt.uniforms.uAlpha.value = 0.4 * pop(k, 0.15, 0.8); }, end: () => kill(m) }; });   /* màn trọng lực */
    for (let i = 0; i < 10 + f * 4; i++) { const a = R(0, PI * 2), r = R(1, R0 * 0.9), P = F.clone().add(new V3(Math.cos(a) * r, 0, Math.sin(a) * r)), s = R(0.15, 0.4), sp = R(0.8, 1.6);
      prop(R(0, 0.3), dur - 0.3, () => { const g = new THREE.Group(), mm = moonMat(gold), m = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), mm); g.add(m);
        return { g, upd: (k, t) => { mm.uniforms.uTime.value = t; g.position.set(P.x, 0.2 + t * sp, P.z); m.rotation.set(t * 0.7, t * 0.5, 0); mm.uniforms.uAlpha.value = pop(k, 0.1, 0.8); } }; }); }   /* đá trôi lên chậm */
    emitter(60 + f * 20, i => { const a = R(0, PI * 2), r = R(0.5, R0); return { p: F.clone().add(new V3(Math.cos(a) * r, R(0, 0.3), Math.sin(a) * r)), v: new V3(0, R(0.3, 0.9), 0), t0: R(0, dur - 0.6), life: R(1.2, 1.8), size: R(0.15, 0.3), col: i % 2 ? c1 : 0xffffff }; }, { grav: 0, drag: 0 });
    if (f >= 2) for (let i = 0; i < 3; i++) decal(F, TEX.ring, c1, R0 * 1.6, 0.9, 0.2 + i * 0.6, { mode: "converge", op: 0.6 });
    if (f >= 3) prop(0.1, dur - 0.1, () => { const g = new THREE.Group(), em = flowMat({ c1: 0x2a7aff, c2: 0x6adf8a, rep: [2, 2], spd: [0.05, 0], fres: 1.4, cut: -0.4, gain: 1, fade: [0, 0, 0, 0] }), e = new THREE.Mesh(new THREE.SphereGeometry(1.4, 24, 16), em); g.add(e); g.position.copy(F).add(new V3(4, 7, -6));
      return { g, upd: (k, t) => { em.uniforms.uTime.value = t; em.uniforms.uAlpha.value = 0.9 * pop(k, 0.15, 0.8); e.rotation.y = t * 0.3; } }; });   /* Trái Đất nhìn từ Mặt Trăng */
    for (let i = 0; i < 3; i++) orbitStar(T, c1, 1, 2.6, 1.8, 0.3, i / 3);
    upg(F, f, c1, 0.3, R0 * 0.5);
  };

  /* --- Armstrong: nhảy vọt lên cao, đáp xuống in dấu giày khổng lồ, bụi Mặt Trăng toả tròn --- */
  function bootTex() { return TEX.boot || (TEX.boot = cvTex(256, (g, n) => { g.translate(n / 2, n / 2); g.fillStyle = "rgba(255,255,255,.95)"; g.beginPath(); g.ellipse(0, -40, 48, 70, 0, 0, PI * 2); g.fill(); g.beginPath(); g.ellipse(0, 70, 38, 48, 0, 0, PI * 2); g.fill();
    g.globalCompositeOperation = "destination-out"; g.lineWidth = 7; for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(-60, -40 + i * 15); g.lineTo(60, -40 + i * 15); g.stroke(); } for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(-50, 70 + i * 13); g.lineTo(50, 70 + i * 13); g.stroke(); } })); }
  META.giant_leap = { name: "Giant Leap", lv: 66, who: "Neil Armstrong", forms: ["Nhảy vọt, đáp in dấu giày", "Dấu giày to + bụi trăng", "Cờ cắm + vòng bụi lớn", "Dấu giày vàng"] };
  SK.giant_leap = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), land = 0.5, c1 = gold ? 0xffd860 : 0xd8e0ff, R0 = 3.5 + f * 0.4, top = F.clone().lerp(T, 0.5).setY(6);
    emitter(50, i => { const u = i / 50, p = bez(F.clone().setY(1), top, T.clone().setY(1), u); return { p: p.add(rv(0.2)), v: rv(0.3), t0: u * land, life: 0.5, size: R(0.3, 0.5), col: i % 2 ? c1 : 0xffffff }; }, { grav: 0, drag: 1 });   /* vệt bay vòng cung */
    decal(F, TEX.ring, c1, 2.5, 0.4, 0, { mode: "expand", expand: 0.6, op: 0.8 }); sparks(F.clone().setY(0.2), [0xc8c8d0, 0xa8a8b0], 20, 4, 0.4, 0.6, 0, { up: 1 });
    decal(T, bootTex(), gold ? 0xffe080 : 0xd8d8e8, 2.6 + f * 0.4, 2.2, land, { add: gold, op: 0.95, mode: "static", hold: 0.8, ro: 3 });
    glow(T.clone().setY(1), 0xffffff, 4 + f, 0.25, land, { flash: true }); shock(T, c1, R0, 0.6, land); shock(T, 0xffffff, R0 * 0.6, 0.45, land + 0.05);
    emitter(80 + f * 25, i => { const a = R(0, PI * 2); return { p: T.clone().add(new V3(Math.cos(a) * 0.8, 0.2, Math.sin(a) * 0.8)), v: new V3(Math.cos(a) * R(3, 7), R(0.3, 1.5), Math.sin(a) * R(3, 7)), t0: land, life: R(0.9, 1.4), size: R(0.5, 1) * (1 + f * 0.1), col: [0xc8c8d0, 0xb0b0b8, 0xd8d8e0][i % 3] }; }, { grav: -0.6, drag: 1.4 });   /* bụi Mặt Trăng toả tròn, rơi chậm */
    textPop(T.clone().setY(3), "ONE GIANT LEAP!", gold ? "#ffe060" : "#ffffff", 2.2, 0.9, land);
    if (f >= 3) prop(land + 0.1, 1.8, () => { const g = new THREE.Group(), pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 6), basic(null, 0xffffff, false, 1)); pole.position.y = 1.3; g.add(pole);
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.75), basic(null, gold ? 0xffd860 : 0xffffff, true, 0.85)); fl.position.set(0.62, 2.2, 0); g.add(fl); g.position.copy(T).addScaledVector(d, 1.5);
      return { g, upd: (k, t) => { g.scale.set(1, Math.min(1, t / 0.15), 1); fl.rotation.y = Math.sin(t * 2) * 0.15; fl.material.opacity = 0.85 * pop(k, 0.1, 0.8); pole.material.opacity = pop(k, 0.1, 0.8); } }; });   /* cờ cắm */
    upg(T, f, c1, land, R0 * 0.7); task(land, 0.01, () => shake(0.2 + f * 0.06));
  };

  /* --- Einstein: tia laser photon trắng xuyên thẳng, electron vàng văng ra từ thân quái --- */
  META.photon_lance = { name: "Photon Lance", lv: 70, who: "Albert Einstein", forms: ["Tia photon trắng + electron văng", "Tia to + gợn sóng ánh sáng", "3 tia hội tụ", "Tia vàng-trắng khổng lồ"] };
  SK.photon_lance = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, d = SDIR(F, T), dist = F.distanceTo(T), L = dist + 8, W = 0.25 + f * 0.1, c1 = gold ? 0xffe080 : 0xffffff, A = F.clone().setY(1.3).addScaledVector(d, 0.5), nB = f >= 3 ? 3 : 1, charge = 0.25;
    glow(A, 0xffffff, 1.5, charge, 0); emitter(30, i => { const p = A.clone().add(rv(1.5)); return { p, v: A.clone().sub(p).multiplyScalar(4), t0: R(0, charge * 0.7), life: 0.25, size: R(0.15, 0.3), col: 0xffffff }; }, { grav: 0, drag: 0 });   /* tụ sáng */
    for (let b = 0; b < nB; b++) { const S = b ? A.clone().add(new V3(-d.z, 0, d.x).multiplyScalar(b === 1 ? 1.6 : -1.6)).add(new V3(0, 1, 0)) : A, dir = T.clone().setY(1.2).sub(S).normalize(), len = b ? S.distanceTo(T.clone().setY(1.2)) + 0.3 : L;
      task(charge, 0.55, () => { const geo = new THREE.CylinderGeometry(W * (b ? 0.6 : 1), W * (b ? 0.6 : 1), len, 14, 1, true).rotateX(PI / 2).translate(0, 0, len / 2), mt = flowMat({ c1, c2: gold ? 0xffd040 : 0xbfe0ff, rep: [2, 10], spd: [0, -8], fres: 0.8, cut: -0.1, gain: 1.6, fade: [0, 0, 0, 0.1] }), m = mesh(geo, mt, 10);
        m.position.copy(S); m.quaternion.copy(basisQ(dir)); SC.add(m);
        return { upd: (k, t) => { mt.uniforms.uTime.value = t; m.scale.set(1 - k * 0.6, 1 - k * 0.6, Math.min(1, t / 0.06)); mt.uniforms.uAlpha.value = 1 - Math.max(0, k - 0.6) / 0.4; }, end: () => kill(m) }; }); }
    if (f >= 2) for (let i = 0; i < 4; i++) task(charge + i * 0.08, 0.3, () => { const m = mesh(new THREE.TorusGeometry(W * 2.2, 0.04, 6, 24), basic(null, 0xffffff, true, 1), 10); m.quaternion.copy(basisQ(d)); SC.add(m);
      return { upd: k => { m.position.copy(A).addScaledVector(d, k * L); m.material.opacity = 1 - k; }, end: () => kill(m) }; });   /* gợn sóng ánh sáng */
    const hit = charge + 0.04, B = T.clone().setY(1.2);
    glow(B, 0xffffff, 3 + f, 0.25, hit, { flash: true }); shock(T, c1, 2 + f * 0.3, 0.4, hit, 1.1);
    for (let e = 0; e < 4 + f * 2; e++) prop(hit, 0.7, () => { const g = new THREE.Group(), s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0xffd040, blending: ADD, transparent: true, depthWrite: false })); s.scale.setScalar(0.6); g.add(s); const v = rv(1).setY(Math.abs(rv(1).y) + 0.3).normalize().multiplyScalar(R(3, 6)), P = new V3();
      return { g, upd: (k, t) => { P.copy(B).addScaledVector(v, t); P.y -= t * t * 2; g.position.copy(P); s.material.opacity = 1 - k; } }; });   /* electron vàng văng ra */
    textPop(B.clone().add(new V3(0, 1.1, 0)), "e⁻", "#ffd860", 1, 0.5, hit);
    upg(T, f, c1, hit, 1.8); task(hit, 0.01, () => shake(0.12 + f * 0.04));
  };
  /* --- Einstein: mặt đồng hồ khổng lồ quay chậm dưới chân, quái chậm như phim quay chậm --- */
  function clockTex() { return TEX.clock || (TEX.clock = cvTex(512, (g, n) => { g.translate(n / 2, n / 2); g.strokeStyle = g.fillStyle = "#fff"; g.shadowColor = "#fff"; g.shadowBlur = 8;
    g.lineWidth = 10; g.beginPath(); g.arc(0, 0, 238, 0, PI * 2); g.stroke(); g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 214, 0, PI * 2); g.stroke();
    for (let i = 0; i < 60; i++) { const a = i / 60 * PI * 2, l = i % 5 ? 10 : 24; g.lineWidth = i % 5 ? 2 : 5; g.beginPath(); g.moveTo(Math.cos(a) * 212, Math.sin(a) * 212); g.lineTo(Math.cos(a) * (212 - l), Math.sin(a) * (212 - l)); g.stroke(); }
    const RN = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"]; g.font = "bold 38px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle";
    RN.forEach((s, i) => { const a = i / 12 * PI * 2 - PI / 2; g.fillText(s, Math.cos(a) * 160, Math.sin(a) * 160); }); g.beginPath(); g.arc(0, 0, 12, 0, PI * 2); g.fill(); })); }
  META.time_dilation = { name: "Time Dilation", lv: 70, who: "Albert Einstein", forms: ["Mặt đồng hồ quay chậm dưới chân", "Gợn thời gian + kim chậm dần", "+ đồng hồ đứng trên trời", "Đồng hồ vàng khổng lồ"] };
  SK.time_dilation = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 8, dur = 2.6, c1 = gold ? 0xffd860 : 0x9ad8ff;
    decal(F, TEX.dark, 0xffffff, R0 * 2.4, dur, 0, { add: false, op: 0.7, hold: 0.8 }); decal(F, clockTex(), c1, R0 * 2, dur, 0, { mode: "static", op: 0.95, inT: 0.3, hold: 0.8 });
    const hands = [[R0 * 0.55, 0.22, 1], [R0 * 0.8, 0.12, 12]];   /* kim giờ, kim phút: quay nhanh rồi chậm dần gần như đứng */
    hands.forEach(([len, w, sp], i) => prop(0.1, dur - 0.1, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(w, len).translate(0, len / 2, 0).rotateX(-PI / 2), basic(null, i ? 0xffffff : c1, true, 1)); g.add(m); g.position.set(F.x, 0.08 + i * 0.01, F.z);
      return { g, upd: (k, t) => { g.rotation.y = -sp * (1 - Math.exp(-t * 2.5)) * 1.2; m.material.opacity = pop(k, 0.1, 0.85); } }; }));
    for (let i = 0; i < 3 + f; i++) decal(F, TEX.ring, c1, R0 * 2.2, 1.1, 0.2 + i * 0.4, { mode: "converge", op: 0.7 });   /* gợn thời gian thu vào chậm */
    emitter(50 + f * 20, i => { const a = R(0, PI * 2), r = R(1, R0); return { p: F.clone().add(new V3(Math.cos(a) * r, R(0.2, 2.5), Math.sin(a) * r)), v: new V3(-Math.sin(a), 0, Math.cos(a)).multiplyScalar(0.4), t0: R(0, dur - 0.8), life: R(1.2, 1.8), size: R(0.15, 0.3), col: i % 2 ? c1 : 0xffffff }; }, { grav: 0, drag: 0 });   /* hạt trôi rất chậm */
    if (f >= 3) prop(0.2, dur - 0.2, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.CircleGeometry(1.6, 40), basic(clockTex(), c1, true, 0.9)); g.add(m); g.position.copy(T).setY(4.2);
      return { g, upd: (k, t) => { g.quaternion.copy(CAM.quaternion); m.material.opacity = 0.9 * pop(k, 0.1, 0.8); } }; });
    textPop(F.clone().setY(3), "SLOW...", gold ? "#ffe060" : "#bfeaff", 1.6, 1.2, 0.3, { rise: 0.3 });
    for (let i = 0; i < 3; i++) orbitStar(T, c1, 1, 2.6, 2, 0.3, i / 3);
    upg(F, f, c1, 0.3, R0 * 0.5);
  };

  /* --- Einstein: hạt nhỏ tụ ánh sáng, im lặng 1 giây, rồi bùng thành mặt trời nổ tung (E = mc²) --- */
  META.e_mc2_nova = { name: "E=mc² Nova", lv: 70, who: "Albert Einstein", forms: ["Hạt tụ sáng, im lặng, bùng nổ", "Nổ to + vòng năng lượng", "Nổ 2 tầng + cột sáng trời", "Mặt trời vàng khổng lồ"] };
  SK.e_mc2_nova = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 5 + f * 0.5, C = T.clone().setY(1.8), quiet = 1.0, c1 = gold ? 0xffd040 : 0xffffff, c2 = gold ? 0xff8a20 : 0x9ad8ff;
    emitter(90 + f * 30, i => { const p = C.clone().add(rv(R(3, 6))); return { p, v: C.clone().sub(p).multiplyScalar(1 / 0.55), t0: R(0, 0.45), life: 0.55, size: R(0.15, 0.3), col: i % 2 ? c2 : 0xffffff }; }, { grav: 0, drag: 0 });   /* ánh sáng bị hút vào 1 điểm */
    prop(0, quiet + 0.15, () => { const g = new THREE.Group(), s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0xffffff, blending: ADD, transparent: true, depthWrite: false })); g.add(s); g.position.copy(C);
      return { g, upd: (k, t) => s.scale.setScalar(0.3 + Math.min(1, t / 0.5) * 0.5 + (t > quiet - 0.1 ? (t - quiet + 0.1) * 12 : 0)) }; });   /* điểm sáng nhỏ xíu, im lặng */
    decal(T, TEX.dark, 0xffffff, R0 * 3, quiet + 1.2, 0, { add: false, op: 0.85, inT: 0.5, hold: 0.85 });
    textPop(C.clone().add(new V3(0, 1.2, 0)), "E = mc²", gold ? "#ffe060" : "#ffffff", 2, quiet - 0.3, 0.35, { rise: 0.2 });
    const boom = quiet + 0.1;
    prop(boom, 0.9, () => { const g = new THREE.Group(), sm = flowMat({ c1: c2, c2: c1, rep: [2, 2], spd: [0.8, -1], fres: 0.5, cut: -0.4, gain: 1.6, fade: [0, 0, 0, 0] }), sun = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), sm); g.add(sun); g.position.copy(C);
      return { g, upd: (k, t) => { sm.uniforms.uTime.value = t; sun.scale.setScalar(0.3 + (1 - Math.pow(1 - k, 3)) * R0 * 0.75); sm.uniforms.uAlpha.value = 1 - Math.max(0, k - 0.4) / 0.6; } }; });   /* bùng thành mặt trời */
    glow(C, 0xffffff, 6 + f * 1.5, 0.35, boom, { flash: true }); glow(C, c2, 8 + f * 1.5, 0.6, boom, { flash: true }); dome(T, c2, c1, R0, 0.8, boom + 0.05);
    for (let i = 0; i < 3; i++) shock(T, i % 2 ? c2 : 0xffffff, R0 * (1 + i * 0.35), 0.7, boom + i * 0.08);
    sparks(C, [c1, c2, 0xffffff], 90 + f * 30, 13, 0.4, 0.9, boom, { up: 1 }); decal(T, TEX.crack, 0xffffff, R0 * 2, 1.6, boom, { add: false, op: 0.9, ro: 3 });
    if (f >= 3) { pillar(T, c2, 0xffffff, 1.6, 12, 0.8, boom, { speed: 5, widen: 0.8 }); dome(T, c1, 0xffffff, R0 * 1.4, 0.9, boom + 0.25); }
    upg(T, f, c2, boom, R0 * 0.8); task(boom, 0.01, () => shake(0.35 + f * 0.08));
  };

  /* --- Ada Lovelace: cỗ máy bánh răng đồng quay sau lưng, chơi nhạc: cả đội tăng sát thương + hồi chiêu nhanh --- */
  function gearGeo(r, teeth, depth) { const s = new THREE.Shape(), N = teeth * 4; for (let i = 0; i <= N; i++) { const a = i / N * PI * 2, rr = (i % 4 < 2) ? r : r * 0.82; i ? s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    const h = new THREE.Path(); h.absarc(0, 0, r * 0.25, 0, PI * 2, true); s.holes.push(h); return nuv(new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false })).translate(0, 0, -depth / 2); }
  META.analytical_engine = { name: "Analytical Engine", lv: 74, who: "Ada Lovelace", forms: ["Bánh răng đồng quay + nhạc, đội mạnh lên", "Nhiều bánh răng + thẻ đục lỗ", "Cỗ máy lớn + vòng nốt nhạc", "Bánh răng vàng"] };
  SK.analytical_engine = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, dur = 2.4, c1 = gold ? 0xffd860 : 0xffb060, P0 = F.clone().add(new V3(SDIR(F, T).z, 0, -SDIR(F, T).x).multiplyScalar(1.6)).setY(4.8);
    const gears = [[0, 0, 1.2, 16, 1], [1.75, 0.55, 0.7, 10, -1.6], [-1.6, 0.7, 0.75, 10, -1.5], [0.9, -1.4, 0.55, 8, -2.2], [-0.95, -1.35, 0.55, 8, -2.2], [2.6, -0.6, 0.45, 8, 2.5], [-2.5, -0.5, 0.45, 8, 2.6]].slice(0, [3, 5, 7, 7][f - 1]);
    prop(0, dur, () => { const g = new THREE.Group(), gm = ghostMat(gold ? 0xffc030 : 0xc88a3a, 0xffe8c0, { fres: 0.6, cut: -0.55 }); gm.blending = THREE.NormalBlending;
      const list = gears.map(([x, y, r, n, sp]) => { const m = new THREE.Mesh(gearGeo(r, n, 0.22), gm); m.position.set(x, y, 0); g.add(m); return { m, sp }; }); g.position.copy(P0);
      return { g, upd: (k, t) => { gm.uniforms.uTime.value = t; gm.uniforms.uAlpha.value = pop(k, 0.1, 0.85); g.quaternion.copy(CAM.quaternion); list.forEach(q => q.m.rotation.z = t * q.sp * 2); g.scale.setScalar((0.8 + f * 0.1) * Math.min(1, t / 0.2)); } }; });
    if (f >= 2) for (let i = 0; i < 4; i++) prop(0.2 + i * 0.3, 0.9, () => { const g = new THREE.Group(), card = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5), basic(cvTex(64, (c, n) => { c.fillStyle = "#f4e6c0"; c.fillRect(0, 0, n, n); c.fillStyle = "#3a2a10"; for (let q = 0; q < 14; q++) c.fillRect(((q * 37) % 6) * 10 + 4, ((q * 13) % 5) * 12 + 4, 5, 6); }), 0xffffff, false, 1)); g.add(card);
      return { g, upd: (k, t) => { g.position.copy(P0).add(new V3(2.6 - k * 5.2, -1.8, 0)); g.quaternion.copy(CAM.quaternion); card.material.opacity = Math.sin(k * PI); } }; });   /* thẻ đục lỗ chạy qua máy */
    for (let i = 0; i < 6 + f * 2; i++) textPop(P0.clone().add(new V3(R(-2, 2), R(-0.5, 1.5), 0)), i % 2 ? "♪" : "♫", gold ? "#ffe060" : "#ffd8a0", 1, 0.9, 0.2 + i * 0.15);
    aura(F, c1, 0xfff0d0, 1.0, 3, dur - 0.4, 0.3); rune(F, "circle", "latin", c1, 4.2, dur, 0.2, { mode: "spin", spin: 1.2, op: 0.7 });
    if (f >= 3) for (let i = 0; i < 2; i++) decal(F, TEX.ring, c1, 6, 0.8, 0.5 + i * 0.6, { mode: "expand", expand: 0.5, op: 0.8 });
    textPop(F.clone().setY(2.6), "ATK ↑  CD ↓", gold ? "#ffe060" : "#ffd8a0", 1.6, 1, 0.6, { rise: 0.4 });
    upg(F, f, c1, 0.5, 2.4);
  };

  /* --- Hedy Lamarr: dịch chuyển chớp nhoáng giữa 5 quái, mỗi bước để lại sóng tần số màu khác, rồi cùng nổ --- */
  META.frequency_hop = { name: "Frequency Hop", lv: 78, who: "Hedy Lamarr", forms: ["Chớp nhảy để lại sóng tần số 5 màu", "Sóng dày + vòng phát", "Sóng cầu vồng nối các bước", "Sóng vàng + nổ chung lớn"] };
  SK.frequency_hop = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, now = CLOCK_MS(), first = !LAST.hop || now - LAST.hop > 900; if (first) { LAST.hopI = 0; LAST.hopP = F.clone(); } else LAST.hopI++; LAST.hop = now;
    const i = LAST.hopI, HUES = [0xff4a6a, 0xffb040, 0x5aff8a, 0x4ab0ff, 0xc060ff], col = gold ? 0xffd860 : HUES[i % 5], B = T.clone().setY(1.2); let A = (LAST.hopP || F).clone().setY(1.2); if (A.distanceTo(B) < 1.5) { const a = i * 1.3 + 0.5; A = B.clone().add(new V3(Math.cos(a) * 3.2, 0, Math.sin(a) * 3.2)); } LAST.hopP = T.clone();   /* cùng 1 quái: nhảy vòng quanh nó */
    task(0, 0.9, () => { const N = 60, pos = [], side = new V3().subVectors(B, A).cross(new V3(0, 1, 0)).normalize(); for (let q = 0; q <= N; q++) { const u = q / N, p = A.clone().lerp(B, u), amp = 0.35 + f * 0.08; p.addScaledVector(side, Math.sin(u * PI * (6 + i * 2)) * amp * Math.sin(u * PI)); pos.push(p); }
      const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pos), 120, 0.05 + f * 0.012, 4), m = mesh(geo, basic(null, col, true, 1), 9); SC.add(m); const n = geo.index.count;
      return { upd: k => { geo.setDrawRange(0, Math.floor(n * Math.min(1, k / 0.15))); m.material.opacity = 1 - Math.max(0, k - 0.6) / 0.4; }, end: () => kill(m) }; });   /* sóng tần số hình sin, mỗi bước 1 màu, tần số khác nhau */
    glow(A, 0xffffff, 2.5, 0.15, 0, { flash: true }); glow(B, col, 2.5 + f * 0.4, 0.2, 0.06, { flash: true }); sparks(B, [col, 0xffffff], 12 + f * 4, 5, 0.2, 0.35, 0.06, { up: 1 });
    if (f >= 2) decal(T, TEX.ring, col, 2.6, 0.5, 0.06, { mode: "expand", expand: 0.6, op: 0.9 });
    task(0.06, 0.01, () => shake(0.05 + f * 0.02));
    if (i === 4) { const at = 0.25; glow(B, 0xffffff, 5 + f * 1.2, 0.3, at, { flash: true }); for (let q = 0; q < 5; q++) shock(T, gold ? 0xffd860 : HUES[q], 1.5 + q * 0.6, 0.5, at + q * 0.04, 0.5); sparks(B, HUES, 40 + f * 15, 9, 0.3, 0.6, at, { up: 1 }); upg(T, f, col, at, 2.4); task(at, 0.01, () => shake(0.15 + f * 0.05)); }   /* 5 sóng cùng nổ */
  };

  /* --- Turing: bánh răng máy mã Enigma xoay quanh quái, chữ mã hoá vỡ vụn: quái mất kỹ năng --- */
  function rotorTex() { return TEX.rotor || (TEX.rotor = cvTex(512, (g, n) => { g.fillStyle = "#2a2418"; g.fillRect(0, 0, n, n); g.font = "bold 30px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 26; i++) { const x = (i + 0.5) / 26 * n; g.fillStyle = "#f4e6c0"; g.fillRect(x - 8, n * 0.25, 16, n * 0.5); g.fillStyle = "#2a2418"; g.save(); g.translate(x, n / 2); g.rotate(PI / 2); g.fillText(L[i], 0, 0); g.restore(); } }, true)); }
  META.code_breaker = { name: "Code Breaker", lv: 82, who: "Alan Turing", forms: ["3 rô-to Enigma xoay quanh quái", "Chữ mã vỡ vụn bay ra", "+ ổ khoá vỡ, mã nhị phân", "Rô-to vàng + nổ mã"] };
  SK.code_breaker = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, dur = 2.2, c1 = gold ? 0xffd860 : 0x7affb0, rt = rotorTex();
    rune(T, "seal", "latin", c1, 5, dur, 0, { mode: "spin", spin: 0.8, op: 0.8 });
    for (let r = 0; r < 3; r++) prop(r * 0.08, dur, () => { const g = new THREE.Group(), rim = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.35, 26, 1, true), new THREE.MeshBasicMaterial({ map: rt, transparent: true, side: THREE.DoubleSide })), cm = solidMat(gold ? 0xb08a30 : 0x5a5040, gold ? 0xfff0b0 : 0xd8c8a0, 0xffffff);
      g.add(rim); [-1, 1].forEach(s => { const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.04, 26), cm); cap.position.y = s * 0.19; g.add(cap); }); const ax = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8), cm); g.add(ax);
      const ph = r / 3 * PI * 2;
      return { g, upd: (k, t) => { cm.uniforms.uTime.value = t; const a = ph + t * 1.8; g.position.set(T.x + Math.cos(a) * 2, 1.6 + Math.sin(t * 2 + r) * 0.3, T.z + Math.sin(a) * 2); g.rotation.set(PI / 2, 0, a); rim.rotation.y = Math.floor(t * 8 * (r + 1)) * (PI * 2 / 26);   /* nhảy từng nấc chữ */
        rim.material.opacity = pop(k, 0.1, 0.85); cm.uniforms.uAlpha.value = pop(k, 0.1, 0.85); g.scale.setScalar(0.9 + f * 0.1); } }; });
    const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 6 + f * 3; i++) { const P = T.clone().add(new V3(R(-1, 1), R(1, 2.4), R(-1, 1))), at = 0.4 + i * 0.12; textPop(P, L[(Math.random() * 26) | 0], gold ? "#ffe060" : "#c8ffd8", 1, 0.4, at, { rise: 0.2 }); if (f >= 2) sparks(P, [c1, 0xffffff], 8, 4, 0.15, 0.35, at + 0.35, { up: 1 }); }   /* chữ mã hiện rồi vỡ vụn */
    if (f >= 3) { textPop(T.clone().setY(3.2), "🔓", "#ffffff", 1.6, 0.8, 0.5); for (let i = 0; i < 10; i++) textPop(T.clone().add(new V3(R(-2, 2), R(0.5, 3), R(-2, 2))), Math.random() < 0.5 ? "0" : "1", gold ? "#ffe060" : "#7affb0", 0.7, 0.8, 0.3 + i * 0.1); }
    glow(T.clone().setY(1.5), c1, 3 + f, 0.3, 0.4, { flash: true }); shock(T, c1, 2.6, 0.4, 0.4); textPop(T.clone().setY(2.8), "SILENCED", gold ? "#ffe060" : "#c8ffd8", 1.5, 1, 0.9, { rise: 0.3 });
    upg(T, f, c1, 0.4, 2.4);
  };

  /* --- Paul Baran: mạng lưới nút sáng nối quái, gói tin ánh sáng bắn qua lại --- */
  META.packet_storm = { name: "Packet Storm", lv: 86, who: "Paul Baran", forms: ["Mạng nút sáng + gói tin bắn", "Mạng dày + gói tin nhiều màu", "Mạng 3 tầng + vòng dữ liệu", "Mạng vàng + bão gói tin"] };
  SK.packet_storm = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, now = CLOCK_MS(), first = !LAST.pkt || now - LAST.pkt > 900; LAST.pkt = now; const c1 = gold ? 0xffd860 : 0x5ad8ff;
    if (first) { const nN = 6 + f * 2, nodes = []; for (let i = 0; i < nN; i++) { const a = i / nN * PI * 2 + R(-0.3, 0.3), r = R(2.2, 4.5); nodes.push(T.clone().add(new V3(Math.cos(a) * r, R(1.2, 3.2), Math.sin(a) * r))); } nodes.push(F.clone().setY(2.2)); LAST.pktN = nodes;
      prop(0, 2.2, () => { const g = new THREE.Group(), pts = []; nodes.forEach((a, i) => nodes.forEach((b, j) => { if (j > i && (a.distanceTo(b) < 4.5 || j === nodes.length - 1)) pts.push(a.x, a.y, a.z, b.x, b.y, b.z); })); nodes.forEach(a => pts.push(a.x, a.y, a.z, T.x, 1.2, T.z));
        const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); const ln = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: c1, transparent: true, blending: ADD, depthWrite: false })); g.add(ln);
        const dots = nodes.map(p => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c1, blending: ADD, transparent: true, depthWrite: false })); s.position.copy(p); g.add(s); return s; });
        return { g, upd: (k, t) => { ln.material.opacity = 0.7 * pop(k, 0.1, 0.85); dots.forEach((s, i) => s.scale.setScalar((0.8 + Math.sin(t * 10 + i) * 0.2) * Math.min(1, t / 0.15) * (1 + f * 0.1))); } }; });   /* mạng lưới nút */
      if (f >= 3) for (let i = 0; i < 3; i++) decal(T, TEX.ring, c1, 6 + i * 2, 1.6, i * 0.2, { mode: "spin", spin: i % 2 ? 1 : -1, op: 0.5 }); }
    const nodes = LAST.pktN || [F.clone().setY(2)], B = T.clone().setY(1.2), cols = gold ? [0xffd860, 0xffffff] : [0x5ad8ff, 0x7affb0, 0xffb040, 0xff6ab0];
    for (let p = 0; p < 2 + f; p++) { const S = nodes[(Math.random() * nodes.length) | 0], M = nodes[(Math.random() * nodes.length) | 0], dl = p * 0.04, fly = 0.22, col = cols[p % cols.length], P = new V3();
      prop(dl, fly, () => { const g = new THREE.Group(), cube = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), basic(null, col, true, 1)), hl = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: col, blending: ADD, transparent: true, depthWrite: false })); hl.scale.setScalar(0.9); g.add(cube); g.add(hl);
        return { g, upd: (k, t) => { if (k < 0.5) P.lerpVectors(S, M, k * 2); else P.lerpVectors(M, B, (k - 0.5) * 2); g.position.copy(P); cube.rotation.set(t * 9, t * 7, 0); } }; });   /* gói tin nảy qua 1 nút rồi vào quái */
      sparks(B, [col, 0xffffff], 5, 4, 0.15, 0.25, dl + fly, { up: 1 }); }
    glow(B, c1, 1.6 + f * 0.3, 0.15, 0.24, { flash: true }); task(0.24, 0.01, () => shake(0.03 + f * 0.01));
    if (first) upg(T, f, c1, 0.3, 2.2);
  };

  /* --- Al-Khwarizmi: số 0 vàng khổng lồ trên trời, lòng số 0 hoá hố đen hút quái rồi khép lại --- */
  META.zero_void = { name: "Zero Void", lv: 92, who: "Al-Khwarizmi", forms: ["Số 0 vàng → hố đen hút quái", "Đĩa bồi tụ xoáy + sao bị hút", "Số 0 khổng lồ + 2 vòng chữ số", "Hố đen vàng nuốt cả vùng"] };
  SK.zero_void = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, R0 = 6 + f * 0.4, C = T.clone().setY(3.2), dur = 2.4, close = 1.9, c1 = 0xffc030, rz = 1.6 + f * 0.25;
    decal(T, TEX.dark, 0xffffff, R0 * 2.8, dur, 0, { add: false, op: 0.9, inT: 0.4, hold: 0.85 });
    prop(0, dur, () => { const g = new THREE.Group(), zm = solidMat(0xc08a10, 0xfff0a0, 0xffe080), zero = new THREE.Mesh(new THREE.TorusGeometry(rz, 0.32, 14, 48), zm); zero.scale.set(0.78, 1.1, 1); g.add(zero);   /* số 0 (hình bầu dục) */
      const hole = new THREE.Mesh(new THREE.CircleGeometry(rz * 0.92, 40), new THREE.MeshBasicMaterial({ color: 0x000000 })); hole.scale.set(0.78, 1.1, 1); hole.renderOrder = 12; g.add(hole);   /* lòng đen đặc, che quầng sáng phía sau */
      const disk = new THREE.Mesh(new THREE.RingGeometry(rz * 0.95, rz * 1.8, 48), basic(swirlTex(), gold ? 0xffd860 : 0xb06aff, true, 0.9)); g.add(disk);
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c1, blending: ADD, transparent: true, depthWrite: false })); halo.scale.setScalar(rz * 4); halo.position.z = -0.6; halo.renderOrder = 8; g.add(halo); g.position.copy(C);
      return { g, upd: (k, t) => { zm.uniforms.uTime.value = t; g.quaternion.copy(CAM.quaternion); const open = Math.min(1, Math.max(0, (t - 0.35) / 0.3)), shut = t > close ? 1 - Math.min(1, (t - close) / 0.2) : 1;
        hole.scale.set(0.78 * open * shut + 0.001, 1.1 * open * shut + 0.001, 1); disk.rotation.z = -t * 4; disk.material.opacity = 0.9 * open * shut; zero.scale.set(0.78 * (0.6 + 0.4 * shut), 1.1 * (0.6 + 0.4 * shut), 1); g.scale.setScalar(Math.min(1, t / 0.25) * (t > close + 0.2 ? 1 - (t - close - 0.2) / (dur - close - 0.2) : 1)); } }; });
    emitter(120 + f * 40, i => { const a = R(0, PI * 2), r = R(R0 * 0.5, R0 * 1.2), p = T.clone().add(new V3(Math.cos(a) * r, R(0.2, 2), Math.sin(a) * r)), tan = new V3(-Math.sin(a), 0, Math.cos(a)); return { p, v: C.clone().sub(p).multiplyScalar(1.4).addScaledVector(tan, 3), t0: R(0.5, close - 0.4), life: 0.65, size: R(0.15, 0.35), col: [0xffffff, 0xb06aff, c1][i % 3] }; }, { grav: 0, drag: 0 });   /* mọi thứ bị hút vào */
    if (f >= 3) [6, 8.5].forEach((rr, q) => prop(0.3, close, () => { const g = new THREE.Group(), D = "0123456789"; for (let i = 0; i < 14; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: txtTex(D[(i * 3 + q) % 10], "#ffd860"), transparent: true, depthWrite: false })); s.scale.setScalar(0.9); g.add(s); s.userData.a = i / 14 * PI * 2; }
      return { g, upd: (k, t) => { const sh = 1 - Math.max(0, k - 0.6) / 0.4; g.children.forEach(s => { const a = s.userData.a + t * (q ? -1.2 : 1.6); s.position.set(T.x + Math.cos(a) * rr * 0.5 * sh, 1.6 + q * 1.2, T.z + Math.sin(a) * rr * 0.5 * sh); s.material.opacity = sh; }); } }; }));   /* vòng chữ số Ả Rập */
    glow(C, 0xffffff, 8 + f * 2, 0.35, close + 0.15, { flash: true }); glow(C, c1, 10 + f * 2, 0.6, close + 0.15, { flash: true }); shock(T, c1, R0 * 1.2, 0.7, close + 0.15); shock(T, 0xffffff, R0 * 0.8, 0.5, close + 0.2);
    sparks(C, [c1, 0xffffff, 0xb06aff], 60 + f * 20, 10, 0.35, 0.8, close + 0.15, { up: 0.5 }); textPop(C.clone().add(new V3(0, rz * 1.4 + 0.6, 0)), "0", "#ffe060", 2.4, 0.6, 0.1, { rise: 0.2 });
    upg(T, f, c1, close + 0.15, R0 * 0.7); task(close + 0.15, 0.01, () => shake(0.3 + f * 0.08)); task(0.6, 0.01, () => shake(0.05));
  };

  /* --- Al-Khwarizmi: thuật toán – chuỗi 3 bước sáng lần lượt, 3 chiêu tiếp theo không cần chờ hồi --- */
  META.algorithm = { name: "Algorithm", lv: 92, who: "Al-Khwarizmi", forms: ["3 ô bước 1 → 2 → 3 sáng lần lượt", "+ vòng chữ số xoay", "+ mũi tên lưu đồ nối các bước", "Thuật toán vàng + cột sáng"] };
  SK.algorithm = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, dur = 2.3, c1 = gold ? 0xffd860 : 0x7ad8ff, step = 0.4;
    rune(F, "hex", "latin", c1, 4.6, dur, 0, { mode: "static", op: 0.8 }); aura(F, c1, 0xffffff, 0.9, 3, dur - 0.3, 0.2);
    for (let s = 0; s < 3; s++) { const a = -PI / 2 + (s - 1) * 1.1, P = F.clone().add(new V3(Math.cos(a) * 2.2, 2.6 + (s === 1 ? 0.5 : 0), Math.sin(a) * 2.2)), on = 0.3 + s * step;
      prop(0.1, dur - 0.1, () => { const g = new THREE.Group(), box = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), basic(null, c1, true, 0.35)), num = new THREE.Sprite(new THREE.SpriteMaterial({ map: txtTex(String(s + 1), "#ffffff"), transparent: true, depthWrite: false })); num.scale.setScalar(0.9); num.position.z = 0.02; g.add(box); g.add(num);
        const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.1, 1.1)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, blending: ADD })); g.add(edge); g.position.copy(P);
        return { g, upd: (k, t) => { g.quaternion.copy(CAM.quaternion); const lit = t > on - 0.1; box.material.opacity = (lit ? 0.85 : 0.2) * pop(k, 0.08, 0.85); num.material.opacity = pop(k, 0.08, 0.85); edge.material.opacity = pop(k, 0.08, 0.85); g.scale.setScalar(lit && t < on + 0.15 ? 1.25 : 1); } }; });
      glow(P, c1, 2.2, 0.25, on - 0.1, { flash: true }); if (f >= 3 && s < 2) { const Q = F.clone().add(new V3(Math.cos(a + 1.1) * 2.2, 2.6 + (s === 0 ? 0.5 : 0), Math.sin(a + 1.1) * 2.2)); bolt(P, Q, 0xffffff, 0.08, 0.4, on, { jag: 0 }); }   /* mũi tên lưu đồ */
      textPop(P.clone().add(new V3(0, 0.9, 0)), "✓", "#7dff9a", 0.9, 0.5, on); }
    if (f >= 2) prop(0.2, dur - 0.2, () => { const g = new THREE.Group(), D = "0123456789"; for (let i = 0; i < 20; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: txtTex(D[i % 10], gold ? "#ffe060" : "#bfeaff"), transparent: true, depthWrite: false })); s.scale.setScalar(0.55); s.userData.a = i / 20 * PI * 2; g.add(s); }
      return { g, upd: (k, t) => g.children.forEach(s => { const a = s.userData.a + t * 1.4; s.position.set(F.x + Math.cos(a) * 1.5, 0.6 + Math.sin(a * 3 + t * 4) * 0.15, F.z + Math.sin(a) * 1.5); s.material.opacity = pop(k, 0.1, 0.85); }) }; });   /* vòng chữ số Ả Rập (0–9) */
    textPop(F.clone().setY(4.2), "CD = 0 ×3", gold ? "#ffe060" : "#bfeaff", 1.7, 1, 0.3 + 3 * step, { rise: 0.3 });
    if (gold) pillar(F, 0xffd860, 0xffffff, 1.1, 6, 0.8, 0.3 + 3 * step, { speed: 3 });
    upg(F, f, c1, 0.3 + 3 * step, 2.4);
  };
  /* ---------- TUYỆT CHIÊU (8 vị thần): luôn ở hình đẹp nhất, nặng hơn chiêu thường – trời tối, 3 vòng phù văn của thần, tên chiêu hiện to ---------- */
  function ultFrame(P, c1, c2, script, dur, name, R0) {
    R0 = R0 || 6; decal(P, TEX.dark, 0xffffff, R0 * 3.4, dur, 0, { add: false, op: 0.92, inT: 0.35, hold: 0.85 });   /* trời tối lại */
    rune(P, "circle", script, c1, R0 * 2.1, dur, 0, { mode: "spin", spin: 0.6, inT: 0.4, op: 0.95, hold: 0.85 });
    rune(P, "star", script, c2, R0 * 1.5, dur, 0.1, { mode: "spin", spin: -1.2, op: 0.8, lift: 0.01, hold: 0.85 });
    rune(P, "seal", script, c1, R0 * 0.9, dur, 0.2, { mode: "pulse", rate: 5, amp: 0.1, op: 0.85, lift: 0.02, hold: 0.85 });
    emitter(90, i => { const a = R(0, PI * 2), r = R(0.5, R0); return { p: P.clone().add(new V3(Math.cos(a) * r, R(0, 0.3), Math.sin(a) * r)), v: new V3(0, R(1.5, 4), 0), t0: R(0, dur - 0.6), life: R(0.6, 1.1), size: R(0.15, 0.35), col: i % 2 ? c1 : c2 }; }, { grav: 0, drag: 0.3 });   /* hạt sáng bốc lên */
    if (name && !window.__iconMode) prop(0.1, 1.4, () => { const col = "#" + new THREE.Color(c2).getHexString(), tx = cvTex(512, (g, n) => { g.font = "bold 64px Georgia, serif"; g.textAlign = "center"; g.textBaseline = "middle"; const s = name.toUpperCase(), k = Math.min(1, (n - 30) / g.measureText(s).width); g.translate(n / 2, n / 2); g.scale(k, k);
        g.lineWidth = 12; g.strokeStyle = "rgba(20,10,0,.85)"; g.strokeText(s, 0, 0); g.shadowColor = col; g.shadowBlur = 24; g.fillStyle = col; g.fillText(s, 0, 0); g.shadowBlur = 0; g.fillStyle = "#ffffff"; g.globalAlpha = 0.5; g.fillText(s, 0, -3); });
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthWrite: false, depthTest: false })); sp.renderOrder = 13; const g = new THREE.Group(); g.add(sp);   /* băng tên tuyệt chiêu */
      return { g, upd: (k, t) => { sp.position.copy(P).setY(4.8 + k * 0.5); const e = Math.min(1, t / 0.15); sp.scale.set(5.5 * (1.4 - 0.4 * e), 5.5 * (1.4 - 0.4 * e), 1); sp.material.opacity = e * (1 - Math.max(0, k - 0.7) / 0.3); }, end: () => tx.dispose() }; });
    task(0.1, 0.01, () => shake(0.08));
  }
  const ULT_BIG = (P, c1, c2, at, R0) => { glow(P.clone().setY(1.5), 0xffffff, 6 + R0 * 0.4, 0.35, at, { flash: true }); glow(P.clone().setY(1.5), c1, 9 + R0 * 0.5, 0.6, at, { flash: true }); dome(P, c1, c2, R0 * 0.8, 0.7, at + 0.03);
    for (let i = 0; i < 3; i++) shock(P, i % 2 ? c2 : 0xffffff, R0 * (0.8 + i * 0.35), 0.7, at + i * 0.08); decal(P, TEX.crack, 0xffffff, R0 * 2, 1.8, at, { add: false, op: 0.95, ro: 3 });
    sparks(P.clone().setY(1), [0xffffff, c1, c2], 140, 13, 0.4, 1.0, at, { up: 1.5, drag: 1.8 }); task(at, 0.01, () => shake(0.55)); };   /* đòn kết tuyệt chiêu */

  /* --- Thương Hiệt (Trung Hoa): Dragon Roar – rồng bay xoắn ốc lao xuống, bão chữ Hán --- */
  META.dragon_roar = { name: "Dragon Roar", lv: 80, who: "Thương Hiệt · tuyệt chiêu Trung Hoa", forms: ["Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu"] };
  SK.dragon_roar = (F, T, rk) => {
    const c1 = 0xff6a1a, c2 = 0xffd860, dur = 1.9, hit = 0.15 + dur * 0.92;
    ultFrame(F, 0xffb040, c2, "hanzi", 2.8, "Dragon Roar", 6);
    dragon(F, T, dur, 0.15, { c1: 0xa8300c, c2: 0xffc23a, fire: [0xff3a0a, 0xffd27a] });
    for (let i = 0; i < 14; i++) { const a = i / 14 * PI * 2; textPop(F.clone().add(new V3(Math.cos(a) * 3, 1 + (i % 3) * 0.8, Math.sin(a) * 3)), "龍言語聲文字火雷風光心力水音"[i], "#ffd27a", 1.1, 0.9, 0.2 + i * 0.05, { rise: 1.5 }); }   /* bão chữ Hán */
    rune(T, "star", "hanzi", c2, 7, 1.2, hit, { mode: "expand", expand: 0.8, hold: 0.2, grow: false });
    pillar(T, 0xff3a0a, 0xffe08a, 1.8, 10, 0.9, hit, { speed: 4, widen: 1, top: 1.6 }); ULT_BIG(T, c1, c2, hit, 7);
    for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; pillar(T.clone().add(new V3(Math.cos(a) * 3.5, 0, Math.sin(a) * 3.5)), 0xff3a0a, 0xffd27a, 0.6, 5, 0.6, hit + 0.12 + i * 0.04, { speed: 5 }); }
  };

  /* --- Odin (Bắc Âu): Rune Sword – kiếm rune khổng lồ rơi từ trời, quạ Odin bay vòng, sét, đá rune trồi lên --- */
  function raven() { const g = new THREE.Group(), m = basic(null, 0x101018, false, 1); const b = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), m); b.scale.set(0.7, 0.6, 1.6); g.add(b);
    const ws = new THREE.Shape(); ws.moveTo(0, 0); ws.quadraticCurveTo(0.8, 0.5, 1.6, 0.1); ws.lineTo(1.3, -0.15); ws.lineTo(1.0, -0.05); ws.lineTo(0.7, -0.25); ws.lineTo(0.3, -0.1); ws.lineTo(0, -0.3);
    const wings = [-1, 1].map(s => { const w = new THREE.Mesh(new THREE.ShapeGeometry(ws).rotateX(-PI / 2), m); w.scale.x = s; g.add(w); return w; }); const eye = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0x5fa8ff, blending: ADD, transparent: true, depthWrite: false })); eye.position.z = 0.35; eye.scale.setScalar(0.35); g.add(eye); return { g, wings }; }
  META.rune_sword = { name: "Rune Sword", lv: 70, who: "Odin · tuyệt chiêu Bắc Âu", forms: ["Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu"] };
  SK.rune_sword = (F, T, rk) => {
    const c1 = 0x5fa8ff, c2 = 0xe0f4ff, B = T.clone().setY(1), hit = 0.05 + 2.2 * 0.32;
    ultFrame(T, c1, c2, "runic", 2.6, "Rune Sword", 5);
    giantSword(T, c1, c2, 2.2, 0.05, null);
    for (let r = 0; r < 2; r++) prop(0, 2.4, () => { const o = raven(); return { g: o.g, upd: (k, t) => { const a = r * PI + t * 2.2; o.g.position.set(T.x + Math.cos(a) * 4, 6 + Math.sin(t * 3 + r) * 0.4, T.z + Math.sin(a) * 4); o.g.rotation.y = -a; o.wings.forEach((w, i) => w.rotation.z = (i ? -1 : 1) * Math.sin(t * 12) * 0.5); o.g.scale.setScalar(1.4); } }; });   /* Huginn & Muninn */
    for (let i = 0; i < 4; i++) bolt(T.clone().add(new V3(R(-3, 3), 14, R(-3, 3))), T.clone().add(new V3(R(-2.5, 2.5), 0.1, R(-2.5, 2.5))), 0xbfe0ff, 0.25, 0.25, 0.15 + i * 0.12, { jag: 0.9 });
    pillar(T, c1, c2, 1.3, 8, 0.8, hit, { speed: 4, widen: 0.8, top: 0.7 }); ULT_BIG(T, c1, c2, hit, 5);
    for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2, P = T.clone().add(new V3(Math.cos(a) * 4.2, 0, Math.sin(a) * 4.2));   /* đá rune trồi vòng quanh */
      prop(hit + 0.05 + i * 0.03, 1.4, () => { const g = new THREE.Group(), st = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2, 0.4), solidMat(0x3a4250, 0x8a9ab0, c1)), gl = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1.6), basic(glyphTex("runic", i, "#9ad0ff"), 0xffffff, true, 1)); gl.position.z = 0.21; g.add(st); g.add(gl); g.position.copy(P); g.lookAt(T.x, 0, T.z);
        return { g, upd: (k, t) => { st.material.uniforms.uTime.value = t; g.position.y = -1 + Math.min(1, t / 0.2) * 2; gl.material.opacity = (0.6 + 0.4 * Math.sin(t * 8)) * (1 - Math.max(0, k - 0.75) / 0.25); g.scale.setScalar(1 - Math.max(0, k - 0.85) / 0.15); } }; }); }
  };

  /* --- Thoth (Ai Cập): Ibis Judgment – cổng tượng hình mở, cò quăm ánh sáng sải cánh quét, cân phán xét trên đầu quái --- */
  function ibisBird(c1) {
    const g = new THREE.Group(), m = flowMat({ c1, c2: 0xffffff, rep: [1, 2], spd: [0.2, -1], fres: 1.2, cut: -0.4, gain: 1.4, fade: [0, 0, 0, 0] }), body = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 10), m); body.scale.set(0.8, 0.7, 1.6); g.add(body);
    const neck = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new V3(0, 0.2, 0.8), new V3(0, 0.9, 1.1), new V3(0, 1.1, 1.6)]), 12, 0.13, 6), m); g.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), m); head.position.set(0, 1.12, 1.65); g.add(head);
    const beak = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new V3(0, 1.1, 1.8), new V3(0, 1.05, 2.5), new V3(0, 0.6, 2.9)), 12, 0.05, 5), m); g.add(beak);   /* mỏ cong dài của cò quăm */
    const ws = new THREE.Shape(); ws.moveTo(0, 0.4); ws.quadraticCurveTo(1.8, 1.0, 3.8, 0.3); for (let i = 0; i < 7; i++) { ws.lineTo(3.6 - i * 0.5, -0.35 - (i % 2) * 0.25); ws.lineTo(3.4 - i * 0.5, -0.05); } ws.lineTo(0, -0.5); ws.lineTo(0, 0.4);
    const wings = [-1, 1].map(s => { const w = new THREE.Mesh(nuv(new THREE.ShapeGeometry(ws)).rotateX(-PI / 2), m); w.scale.x = s; w.position.z = 0.2; g.add(w); return w; });
    const tail = new THREE.Mesh(nuv(new THREE.ShapeGeometry((() => { const s = new THREE.Shape(); s.moveTo(-0.5, 0); s.lineTo(0, -1.4); s.lineTo(0.5, 0); s.lineTo(-0.5, 0); return s; })())).rotateX(-PI / 2), m); tail.position.z = -0.8; g.add(tail);
    return { g, m, wings };
  }
  function scaleTex() { return TEX.scl || (TEX.scl = cvTex(256, (g, n) => { g.translate(n / 2, n / 2); g.strokeStyle = g.fillStyle = "#fff"; g.lineWidth = 7; g.lineCap = "round"; g.shadowColor = "#fff"; g.shadowBlur = 10;
    g.beginPath(); g.moveTo(0, -100); g.lineTo(0, 90); g.moveTo(-60, 90); g.lineTo(60, 90); g.moveTo(-95, -60); g.lineTo(95, -60); g.stroke();
    [-1, 1].forEach(s => { g.lineWidth = 3; g.beginPath(); g.moveTo(s * 90, -60); g.lineTo(s * 70, 0); g.moveTo(s * 90, -60); g.lineTo(s * 110, 0); g.stroke(); g.lineWidth = 6; g.beginPath(); g.arc(s * 90, 0, 26, 0, PI); g.stroke(); });
    g.beginPath(); g.ellipse(-90, -18, 6, 18, 0.3, 0, PI * 2); g.fill(); g.beginPath(); g.arc(90, -8, 12, 0, PI * 2); g.fill(); })); }   /* cân: lông vũ Maat ⟷ trái tim */
  META.ibis_judgment = { name: "Ibis Judgment", lv: 60, who: "Thoth · tuyệt chiêu Ai Cập", forms: ["Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu"] };
  SK.ibis_judgment = (F, T, rk) => {
    const c1 = 0xffc040, c2 = 0x5ad8ff, d = SDIR(F, T), dur = 3.0, R0 = 7, gate = T.clone().addScaledVector(d, 3.2);
    ultFrame(F, c1, c2, "hiero", dur, "Ibis Judgment", R0);
    prop(0, 1.6, () => { const g = new THREE.Group(), pm = ghostMat(0xd8a030, 0xfff0c0, { fres: 0.6, cut: -0.5 }); pm.blending = THREE.NormalBlending;
      const doors = [-1, 1].map(s => { const py = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, 5, 4), pm); py.rotation.y = PI / 4; py.position.set(s * 2.2, 2.5, 0); g.add(py);
        const gl = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 3.6), basic(glyphTex("hiero", s > 0 ? 0 : 1, "#3a2a10"), 0xffffff, false, 1)); gl.position.set(s * 2.2, 2.6, 1.0); g.add(gl); return py; });
      const lint = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.7, 1.4), pm); lint.position.y = 5.2; g.add(lint);
      const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c1, blending: ADD, transparent: true, depthWrite: false })); sun.position.set(0, 2.5, 0); g.add(sun); g.position.copy(gate); g.lookAt(F.x, 0, F.z);
      return { g, upd: (k, t) => { pm.uniforms.uTime.value = t; pm.uniforms.uAlpha.value = pop(k, 0.1, 0.8); g.position.y = -5 + Math.min(1, t / 0.3) * 5; sun.scale.setScalar(Math.min(1, Math.max(0, (t - 0.3) / 0.3)) * 7); } }; });   /* cổng tượng hình trồi lên, ánh sáng mở ra */
    const fly = 1.1, t0 = 0.55;
    prop(t0, fly, () => { const o = ibisBird(c1), P = new V3(), P2 = new V3(), path = (u, out) => { const a = Math.atan2(d.x, d.z) + PI * 0.8 - u * PI * 1.6; return out.set(F.x + Math.sin(a) * R0 * 0.75, 2.4 + Math.sin(u * PI) * 1.2, F.z + Math.cos(a) * R0 * 0.75); };
      return { g: o.g, upd: (k, t) => { o.m.uniforms.uTime.value = t; o.m.uniforms.uAlpha.value = pop(k, 0.1, 0.85); path(k, P); path(Math.min(1, k + 0.02), P2); o.g.position.copy(P); o.g.quaternion.copy(basisQ(P2.sub(P).lengthSq() > 1e-6 ? P2 : d)); o.wings.forEach((w, i) => w.rotation.z = (i ? -1 : 1) * Math.sin(t * 9) * 0.45); o.g.scale.setScalar(1.6); } }; });   /* cò quăm sải cánh quét vòng cung */
    emitter(140, i => { const u = i / 140, a = Math.atan2(d.x, d.z) + PI * 0.8 - u * PI * 1.6, p = F.clone().add(new V3(Math.sin(a) * R0 * 0.75, 2.4 + Math.sin(u * PI) * 1.2, Math.cos(a) * R0 * 0.75)); return { p: p.add(rv(1.2)), v: rv(0.6).setY(-0.5), t0: t0 + u * fly, life: R(0.5, 0.9), size: R(0.25, 0.5), col: [c1, 0xffffff, c2][i % 3] }; }, { grav: -1, drag: 1 });   /* lông vũ ánh sáng rơi */
    const jt = t0 + fly * 0.6;
    prop(jt, dur - jt, () => { const g = new THREE.Group(), m = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), basic(scaleTex(), c1, true, 1)); g.add(m); g.position.copy(T).setY(4.2);
      return { g, upd: (k, t) => { g.quaternion.copy(CAM.quaternion); m.rotation.z = Math.sin(t * 3) * 0.15 * (1 - k) - k * 0.25; m.material.opacity = pop(k, 0.1, 0.85); g.scale.setScalar(Math.min(1, t / 0.2)); } }; });   /* cân phán xét nghiêng xuống */
    const hit = jt + 0.8; pillar(T, c1, 0xffffff, 1.2, 9, 0.8, hit, { speed: 4, widen: 0.6 }); for (let i = 0; i < 5; i++) { const a = i / 5 * PI * 2; pillar(F.clone().add(new V3(Math.cos(a) * R0 * 0.6, 0, Math.sin(a) * R0 * 0.6)), c2, 0xffffff, 0.5, 6, 0.6, hit + i * 0.05, { speed: 5 }); }
    ULT_BIG(F, c1, c2, hit, R0);
  };

  /* --- Kotodama (Nhật): Word Spirit Torii – hàng cổng torii đỏ thành đường hầm, chữ kana hoá bầy cá chép lửa --- */
  function torii() { const g = new THREE.Group(), rm = solidMat(0xc81a10, 0xff6a3a, 0xffd0a0), bm = solidMat(0x1a1010, 0x4a3030, 0xff6a3a);
    [-1, 1].forEach(s => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 3.4, 10), rm); p.position.set(s * 1.3, 1.7, 0); g.add(p); });
    const ks = new THREE.Shape(); ks.moveTo(-2.1, 0); ks.quadraticCurveTo(0, -0.25, 2.1, 0); ks.lineTo(2.2, 0.28); ks.quadraticCurveTo(0, 0.05, -2.2, 0.28); ks.lineTo(-2.1, 0);
    const kas = new THREE.Mesh(new THREE.ExtrudeGeometry(ks, { depth: 0.36, bevelEnabled: false }).translate(0, 0, -0.18), bm); kas.position.y = 3.55; g.add(kas);   /* xà trên cong (kasagi) */
    const nuki = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.2, 0.22), rm); nuki.position.y = 2.85; g.add(nuki); return { g, mats: [rm, bm] }; }
  function koi(c) { const g = new THREE.Group(), m = flowMat({ c1: c, c2: 0xffffff, rep: [1, 2], spd: [0, -2], fres: 1, cut: -0.4, gain: 1.4, fade: [0, 0, 0, 0] }), b = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8), m); b.scale.set(0.7, 0.7, 1.7); g.add(b);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 4).rotateX(-PI / 2), m); tail.scale.x = 0.3; tail.position.z = -0.7; g.add(tail);
    [-1, 1].forEach(s => { const fin = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 3).rotateZ(s * PI / 2), m); fin.position.set(s * 0.22, -0.05, 0.15); g.add(fin); }); return { g, m, tail }; }
  META.word_spirit_torii = { name: "Word Spirit Torii", lv: 50, who: "Kotodama · tuyệt chiêu Nhật", forms: ["Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu"] };
  SK.word_spirit_torii = (F, T, rk) => {
    const c1 = 0xff4a20, c2 = 0xffd27a, d = SDIR(F, T), dist = Math.max(4, F.distanceTo(T)), nG = 6, dur = 3.0, yaw = Math.atan2(d.x, d.z);
    ultFrame(F.clone().lerp(T, 0.5), c1, c2, "hanzi", dur, "Word Spirit Torii", dist * 0.5 + 2);
    for (let i = 0; i < nG; i++) { const P = F.clone().addScaledVector(d, 0.8 + i * (dist + 0.5) / nG);
      prop(i * 0.1, dur - i * 0.1, () => { const o = torii(); o.g.position.copy(P); o.g.rotation.y = yaw; return { g: o.g, upd: (k, t) => { o.mats.forEach(m => { m.uniforms.uTime.value = t; m.uniforms.uAlpha.value = pop(k, 0.05, 0.85); }); o.g.position.y = -3.6 * (1 - Math.min(1, t / 0.25)); } }; });   /* cổng torii mọc thành đường hầm */
      decal(P, TEX.ring, c1, 3, 0.6, i * 0.1, { mode: "expand", expand: 0.5, op: 0.7 }); }
    const KANA = "コトダマアイウエオカキクケコサシスセソ";
    for (let i = 0; i < 14; i++) { const S = F.clone().addScaledVector(d, R(0.5, dist)).add(new V3(R(-1.2, 1.2), R(1, 3), R(-1.2, 1.2))); textPop(S, KANA[i % KANA.length], "#ffe0c0", 1.1, 0.5, 0.3 + i * 0.05, { rise: 0.2 }); }   /* chữ kana hiện lên … */
    const nK = 12; for (let i = 0; i < nK; i++) { const ph = i / nK * PI * 2, st = 0.75 + i * 0.04, col = [0xff4a20, 0xffffff, 0xffa020][i % 3];   /* … rồi hoá cá chép lửa bơi qua đường hầm, xoáy quanh quái */
      prop(st, dur - st, () => { const o = koi(col), P = new V3(), P2 = new V3(), path = (t, out) => { const u = Math.min(1, t / 0.9); if (u < 1) { out.copy(F).addScaledVector(d, 0.5 + u * dist); out.y = 1.8 + Math.sin(u * PI * 3 + ph) * 0.6; out.addScaledVector(new V3(-d.z, 0, d.x), Math.cos(u * PI * 3 + ph) * 0.8); return out; } const a = ph + (t - 0.9) * 4; return out.set(T.x + Math.cos(a) * 1.8, 1.4 + Math.sin(a * 2) * 0.5, T.z + Math.sin(a) * 1.8); };
        return { g: o.g, upd: (k, t) => { o.m.uniforms.uTime.value = t; o.m.uniforms.uAlpha.value = pop(k, 0.08, 0.85); path(t, P); path(t + 0.03, P2); o.g.position.copy(P); o.g.quaternion.copy(basisQ(P2.sub(P).lengthSq() > 1e-6 ? P2 : d)); o.tail.rotation.y = Math.sin(t * 16) * 0.5; o.g.scale.setScalar(1.3); } }; });
      emitter(24, q => ({ p: F.clone().addScaledVector(d, 0.5 + q / 24 * dist).add(new V3(R(-1, 1), R(1.2, 2.4), R(-1, 1))), v: rv(0.5), t0: st + q / 24 * 0.9, life: 0.4, size: R(0.25, 0.45), col: q % 2 ? 0xff6a2a : 0xffd27a }), { grav: 0, drag: 2 }); }   /* lửa theo đuôi cá */
    const h1 = 1.85, h2 = 2.45; [h1, h2].forEach((h, i) => { glow(T.clone().setY(1.4), 0xffffff, 5, 0.3, h, { flash: true }); pillar(T, c1, c2, 1.2, 7, 0.6, h, { speed: 5, widen: 0.6 }); shock(T, c2, 5, 0.6, h); task(h, 0.01, () => shake(0.3)); });
    ULT_BIG(T, c1, c2, h2 + 0.05, 6);
  };

  /* --- Hermes (Hy Lạp): Winged Courier – giày có cánh, lướt 7 lần như tia chớp, lông vũ vàng đầy trời --- */
  META.winged_courier = { name: "Winged Courier", lv: 80, who: "Hermes · tuyệt chiêu Hy Lạp", forms: ["Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu"] };

  /* --- Ogma (Celt): Ogham Grove – vòng cột đá Ogham trồi lên, dây leo sáng nối các cột trói cả vùng --- */
  META.ogham_grove = { name: "Ogham Grove", lv: 80, who: "Ogma · tuyệt chiêu Celt", forms: ["Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu"] };
  SK.ogham_grove = (F, T, rk) => {
    const c1 = 0x5aff8a, c2 = 0xd8ffb0, R0 = 6.5, nS = 10, dur = 3.0, rise = 0.5;
    ultFrame(F, c1, c2, "ogham", dur, "Ogham Grove", 8);
    const stones = []; for (let i = 0; i < nS; i++) { const a = i / nS * PI * 2, P = F.clone().add(new V3(Math.cos(a) * R0, 0, Math.sin(a) * R0)), h = R(2.6, 3.6); stones.push(P.clone().setY(h * 0.85));
      prop(i * 0.04, dur - i * 0.04, () => { const g = new THREE.Group(), sm = solidMat(0x4a5048, 0x9aa890, c1), st = new THREE.Mesh(new THREE.BoxGeometry(0.9, h, 0.6, 1, 3, 1), sm); st.position.y = h / 2; g.add(st);
        const gl = new THREE.Mesh(new THREE.PlaneGeometry(0.5, h * 0.85), basic(glyphTex("ogham", i, "#9affb8"), 0xffffff, true, 1)); gl.position.set(0, h / 2, 0.31); g.add(gl); g.position.copy(P); g.lookAt(F.x, 0, F.z); g.rotateZ(R(-0.08, 0.08));
        return { g, upd: (k, t) => { sm.uniforms.uTime.value = t; sm.uniforms.uAlpha.value = 1 - Math.max(0, k - 0.88) / 0.12; g.position.y = -h * (1 - Math.min(1, t / rise)); gl.material.opacity = (t > rise ? 0.7 + 0.3 * Math.sin(t * 6 + i) : 0) * (1 - Math.max(0, k - 0.8) / 0.2); } }; });
      sparks(P.clone().setY(0.2), [0x8a7a5a, 0x6a5a40], 15, 4, 0.3, 0.6, i * 0.04, { up: 1.5 }); }   /* cột đá trồi lên */
    for (let i = 0; i < nS; i++) { const A = stones[i], B2 = stones[(i + 1) % nS], C2 = stones[(i + 3) % nS];   /* dây leo sáng nối các cột + vào giữa */
      [[A, B2, 0.6], [A, C2, -0.4], [A, F.clone().setY(1.2), 0.3]].forEach(([P1, P2, sag], q) => prop(rise + 0.1 + i * 0.04 + q * 0.12, dur - rise - 0.3, () => { const pts = []; for (let s = 0; s <= 16; s++) { const u = s / 16, p = P1.clone().lerp(P2, u); p.y -= Math.sin(u * PI) * sag * 2; p.x += Math.sin(u * 12 + i) * 0.12; pts.push(p); }
        const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, q === 2 ? 0.05 : 0.08, 5), mt = flowMat({ c1, c2, rep: [8, 1], spd: [-2, 0], fres: 0.6, cut: -0.3, gain: 1.4, fade: [0, 0, 0, 0] }), m = new THREE.Mesh(geo, mt), g = new THREE.Group(); g.add(m); const N = geo.index.count;
        return { g, upd: (k, t) => { mt.uniforms.uTime.value = t; geo.setDrawRange(0, Math.floor(N * Math.min(1, t / 0.3))); mt.uniforms.uAlpha.value = 1 - Math.max(0, k - 0.8) / 0.2; } }; })); }
    for (let i = 0; i < 16; i++) { const a = i / 16 * PI * 2, pts = []; for (let s = 0; s <= 10; s++) { const u = s / 10; pts.push(F.clone().add(new V3(Math.cos(a + Math.sin(u * 6) * 0.15) * u * R0, 0.06, Math.sin(a + Math.sin(u * 6) * 0.15) * u * R0))); }   /* rễ sáng lan trên đất */
      prop(0.3 + i * 0.02, dur - 0.5, () => { const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.06, 4), m = new THREE.Mesh(geo, basic(null, c1, true, 0.9)), g = new THREE.Group(); g.add(m); const N = geo.index.count; return { g, upd: (k, t) => { geo.setDrawRange(0, Math.floor(N * Math.min(1, t / 0.4))); m.material.opacity = 0.9 * (1 - Math.max(0, k - 0.8) / 0.2); } }; }); }
    const hit = rise + 0.9; ULT_BIG(F, c1, c2, hit, 8); pillar(F, c1, c2, 1.5, 10, 1.0, hit, { speed: 3, widen: 0.5 });
    emitter(80, i => { const a = R(0, PI * 2), r = R(1, R0); return { p: F.clone().add(new V3(Math.cos(a) * r, 0.2, Math.sin(a) * r)), v: new V3(0, R(0.5, 1.5), 0), t0: hit + R(0, 1), life: R(0.8, 1.3), size: R(0.25, 0.45), col: [0x5aff8a, 0xd8ffb0, 0xffffff][i % 3] }; }, { grav: 0, drag: 0.2 });   /* đom đóm rừng */
  };

  /* --- Itzamna (Maya): Feathered Serpent – kim tự tháp ánh sáng, rắn lông vũ Kukulkan trườn xuống bậc thang rồi lao vào quái --- */
  META.feathered_serpent = { name: "Feathered Serpent", lv: 80, who: "Itzamna · tuyệt chiêu Maya", forms: ["Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu"] };

  /* --- Nabu (Lưỡng Hà): Tablet of Destiny – bia đất sét chữ nêm khổng lồ đổ ụp xuống, chữ bay ra thành xích khoá --- */
  function cuneiTex() { return TEX.cun || (TEX.cun = cvTex(256, (g, n) => { g.fillStyle = "#b8865a"; g.fillRect(0, 0, n, n); const gr = g.createRadialGradient(n / 2, n / 2, 20, n / 2, n / 2, n * 0.75); gr.addColorStop(0, "rgba(255,230,180,.2)"); gr.addColorStop(1, "rgba(60,30,10,.5)"); g.fillStyle = gr; g.fillRect(0, 0, n, n);
    g.fillStyle = g.strokeStyle = "#ffd070"; g.shadowColor = "#ffb030"; g.shadowBlur = 10; for (let r = 0; r < 8; r++) { g.fillRect(10, 18 + r * 30, n - 20, 2); for (let c = 0; c < 6; c++) { g.save(); g.translate(28 + c * 40, 34 + r * 30); glyph(g, "cuneiform", r * 6 + c, 22); g.restore(); } } })); }
  function chainLink(m) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 6, 14), m); t.scale.y = 1.5; return t; }
  META.tablet_of_destiny = { name: "Tablet of Destiny", lv: 90, who: "Nabu · tuyệt chiêu Lưỡng Hà", forms: ["Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu", "Tuyệt chiêu"] };
  SK.tablet_of_destiny = (F, T, rk) => {
    const c1 = 0xffb030, c2 = 0xfff0c0, dur = 3.0, fall = 0.9, R0 = 6, d = SDIR(F, T), yaw = Math.atan2(d.x, d.z);
    ultFrame(T, c1, c2, "cuneiform", dur, "Tablet of Destiny", R0);
    shadowUnder(T, 8, fall + 0.3, 0.2);
    prop(0.1, dur - 0.1, () => { const g = new THREE.Group(), cm = solidMat(0x8a5a30, 0xd8a870, c1), slab = new THREE.Mesh(new THREE.BoxGeometry(5.2, 7, 0.9), cm); g.add(slab);
      const face = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 6.6), new THREE.MeshBasicMaterial({ map: cuneiTex(), transparent: true })); face.position.z = 0.46; g.add(face);
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c1, blending: ADD, transparent: true, depthWrite: false })); halo.scale.set(9, 11, 1); halo.position.z = -0.6; g.add(halo);
      return { g, upd: (k, t) => { cm.uniforms.uTime.value = t; const tt = t; let y, tilt; if (tt < fall * 0.55) { y = 12 - tt * 2; tilt = 0; } else if (tt < fall) { const e = (tt - fall * 0.55) / (fall * 0.45); y = 10.9 - e * e * 10.4; tilt = e * e * (PI / 2); } else { y = 0.5; tilt = PI / 2; }   /* lơ lửng trên trời rồi đổ ụp mặt chữ xuống */
        g.position.set(T.x, y, T.z); g.rotation.set(-tilt, yaw + PI, 0, "YXZ"); const a = 1 - Math.max(0, k - 0.85) / 0.15; cm.uniforms.uAlpha.value = a; face.material.opacity = a; halo.material.opacity = 0.6 * a * (tt < fall ? 1 : 0.4); } }; });
    const hit = 0.1 + fall; ULT_BIG(T, c1, c2, hit, R0); emitter(80, i => { const a = R(0, PI * 2); return { p: T.clone().add(new V3(Math.cos(a) * 2.5, 0.3, Math.sin(a) * 2.5)), v: new V3(Math.cos(a) * R(3, 6), R(0.3, 1.2), Math.sin(a) * R(3, 6)), t0: hit, life: R(0.9, 1.3), size: R(0.7, 1.2), col: [0xb8865a, 0xd8a870][i % 2] }; }, { grav: -0.5, drag: 1.5 });   /* bụi đất sét */
    for (let r = 0; r < 3; r++) prop(hit + 0.25 + r * 0.15, dur - hit - 0.3 - r * 0.15, () => { const g = new THREE.Group(), lm = solidMat(0x8a6020, 0xffe080, c1), links = [], n = 18;   /* chữ bay ra hoá xích khoá quanh quái */
      for (let i = 0; i < n; i++) { const L = chainLink(lm); g.add(L); links.push(L); } const y = 0.7 + r * 0.8, rr = 1.3 - r * 0.15;
      return { g, upd: (k, t) => { lm.uniforms.uTime.value = t; const close = Math.min(1, t / 0.4); links.forEach((L, i) => { const a = i / n * PI * 2 * close + r + t * 0.3; L.position.set(T.x + Math.cos(a) * rr * (2 - close), y, T.z + Math.sin(a) * rr * (2 - close)); L.rotation.set(i % 2 ? PI / 2 : 0, -a, 0); }); lm.uniforms.uAlpha.value = 1 - Math.max(0, k - 0.85) / 0.15; } }; });
    for (let i = 0; i < 12; i++) textPop(T.clone().add(new V3(R(-2.5, 2.5), R(0.5, 2.5), R(-2.5, 2.5))), "𒀭", "#ffd070", 1, 0.5, hit + 0.1 + i * 0.03, { rise: 0.8 });
    textPop(T.clone().setY(3.4), "🔒", "#ffffff", 1.8, 1.2, hit + 0.7);
    for (let i = 0; i < 3; i++) orbitStar(T, c2, 1.1, 2.8, 1.6, hit + 0.3, i / 3);
  };
  /* ---------- TUYỆT CHIÊU THEO BẬC (góp ý 27/11): bậc 1 = 1 đòn · bậc 4 = 2 đòn luân phiên · bậc 7 = 3 đòn liên hoàn · bậc 10 = vị thần của vùng hiện ra tung thêm đòn CHÍ MẠNG ---------- */
  const GOD_TEX = {};
  function godTex(slug) { return GOD_TEX[slug] || (GOD_TEX[slug] = new THREE.TextureLoader().load((api.godPath || "assets/gods/") + slug + ".webp")); }
  function godAppear(slug, name, F, T, col, at, dur) {   /* thần hiện lên cạnh người chơi: cột sáng, vòng phù văn, tranh thần phát sáng trồi lên rồi tan */
    const d = SDIR(F, T), G = F.clone().lerp(T, 0.6).addScaledVector(new V3(-d.z, 0, d.x), -2.8);   /* đứng phía sau quái, đối diện người chơi: luôn nằm trong khung hình */
    godTex(slug); rune(G, "sun", "latin", col, 6.5, dur, at, { mode: "spin", spin: 0.8, op: 0.95 }); pillar(G, col, 0xffffff, 1.7, 13, 0.9, at, { speed: 3, widen: 0.7 });
    glow(G.clone().setY(3), 0xffffff, 9, 0.35, at, { flash: true }); shock(G, col, 5, 0.6, at);
    prop(at, dur, () => { const tx = godTex(slug), g = new THREE.Group(), halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: col, blending: ADD, transparent: true, depthWrite: false })), sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthWrite: false }));
      halo.renderOrder = 11; sp.renderOrder = 12; g.add(halo); g.add(sp); g.position.copy(G);
      return { g, upd: (k, t) => { const im = tx.image, asp = im && im.width ? im.width / im.height : 0.6, H = 6.5, e = Math.min(1, t / 0.45), a = e * (1 - Math.max(0, k - 0.82) / 0.18);
        sp.scale.set(H * asp, H, 1); sp.position.y = H / 2 - 2 * (1 - e) + Math.sin(t * 2) * 0.1; sp.material.opacity = a; halo.position.y = H * 0.5; halo.scale.setScalar(H * 1.5 * (1 + Math.sin(t * 6) * 0.05)); halo.material.opacity = 0.55 * a; } }; });
    textPop(G.clone().setY(8.6), name, "#" + new THREE.Color(col).getHexString(), 2, 1.4, at + 0.3, { rise: 0.3 });
    return G;
  }
  function critBurst(T, col, at) {   /* đòn chí mạng của thần */
    const B = T.clone().setY(1.4); glow(B, 0xffffff, 12, 0.4, at, { flash: true }); glow(B, col, 15, 0.7, at, { flash: true }); dome(T, col, 0xffffff, 5, 0.8, at + 0.03);
    for (let i = 0; i < 4; i++) shock(T, i % 2 ? col : 0xffffff, 4 + i * 1.6, 0.8, at + i * 0.07); pillar(T, col, 0xffffff, 2.2, 14, 0.9, at, { speed: 5, widen: 1.2 });
    sparks(B, [0xffffff, col, 0xffd860], 200, 15, 0.45, 1.1, at, { up: 1.5, drag: 1.6 }); textPop(B.clone().add(new V3(0, 2.2, 0)), "CRITICAL!", "#ffd040", 3, 1.2, at, { rise: 0.6 });
    task(at, 0.01, () => shake(0.8));
  }
  let ULT_REP = false, ULT_EXTRA = 0;
  const _ultFrame = ultFrame; ultFrame = function (P, c1, c2, script, dur, name, R0) { if (ULT_REP) return; _ultFrame(P, c1, c2, script, dur + ULT_EXTRA, name, R0); };   /* khung tuyệt chiêu chỉ 1 lần, kéo dài theo số đòn */
  const VARY = {
    Frot: (F, T, i) => [F.clone().sub(T).applyAxisAngle(UP, [0, 0.9, -0.9][i]).add(T), T],   /* bay tới từ hướng khác */
    Trot: (F, T, i) => [F, T.clone().sub(F).applyAxisAngle(UP, [0, 0.9, -0.9][i]).add(F)],
    Tshift: (F, T, i) => { const d = SDIR(F, T); return [F, T.clone().add(new V3(-d.z, 0, d.x).multiplyScalar([0, 1.8, -1.8][i]))]; },
    center: (F, T, i) => [[F, T, F.clone().lerp(T, 0.5)][i], T],
  };
  function ultTiered(id, slug, godName, col, gap, hit, vary) {
    const base = SK[id];
    META[id].forms = ["1 đòn tuyệt chiêu", "2 đòn luân phiên", "3 đòn liên hoàn", "+ " + godName + " hiện ra, đòn CHÍ MẠNG"];
    SK[id] = (F, T, rk) => { const f = FORM(rk), n = Math.min(f, 3), tg = (n - 1) * gap + 0.9;
      ULT_EXTRA = (n - 1) * gap + (f >= 4 ? hit + 1.8 : 0); try { base(F, T, rk); } finally { ULT_EXTRA = 0; }
      for (let i = 1; i < n; i++) task(i * gap, 0.01, () => { ULT_REP = true; try { const [F2, T2] = VARY[vary](F, T, i); base(F2, T2, rk); } finally { ULT_REP = false; } });
      if (f >= 4) { const G = godAppear(slug, godName, F, T, col, tg, hit + 2.2);
        task(tg + 0.6, 0.01, () => { ULT_REP = true; try { base(G.clone(), T, rk); } finally { ULT_REP = false; } }); critBurst(T, col, tg + 0.6 + hit); }
    };
  }

  /* --- Itzamna (Maya): Feathered Serpent – vẽ lại kiểu rồng: thân vảy dài uốn lượn, 2 hàng lông vũ nhiều màu, mào lông quetzal, không chân --- */
  SK.feathered_serpent = (F, T, rk) => {
    const c1 = 0x2affb0, c2 = 0xffd040, d = SDIR(F, T), side = new V3(-d.z, 0, d.x), dur = 3.2, Pp = T.clone().addScaledVector(d, 3.2).addScaledVector(side, 1.6), flyT = 0.45, fly = 2.0;
    ultFrame(T, c1, c2, "hiero", dur, "Feathered Serpent", 6);
    if (!ULT_REP) prop(0, dur + ULT_EXTRA, () => { const g = new THREE.Group(), pm = ghostMat(0x2ad890, 0xffe8a0, { fres: 0.6, cut: -0.5 }); pm.blending = THREE.NormalBlending;
      for (let s = 0; s < 6; s++) { const w = 7 - s * 1.1, st = new THREE.Mesh(new THREE.BoxGeometry(w, 0.9, w), pm); st.position.y = 0.45 + s * 0.9; g.add(st); }
      const temple = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), pm); temple.position.y = 6; g.add(temple); const stair = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 7.6), basic(null, c2, true, 0.6)); stair.position.set(0, 2.7, 3.2); stair.rotation.x = -0.68; g.add(stair);
      const beam = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: c2, blending: ADD, transparent: true, depthWrite: false })); beam.position.y = 7; beam.scale.setScalar(6); g.add(beam); g.position.copy(Pp); g.lookAt(T.x, 0, T.z); g.scale.setScalar(0.75);
      return { g, upd: (k, t) => { pm.uniforms.uTime.value = t; pm.uniforms.uAlpha.value = 0.95 * pop(k, 0.05, 0.92); g.position.y = -5.5 * (1 - Math.min(1, t / 0.45)); } }; });   /* kim tự tháp bậc thang trồi lên */
    dragon(ULT_REP ? F : Pp.clone().addScaledVector(d, -1.5), T, fly, flyT, { c1: 0x0a7a4a, c2: 0x9affd0, fire: [0x2affb0, 0xffd040], feathers: [0x2affb0, 0xffd040, 0xff4a3a, 0x2a8aff, 0x9a5aff, 0x2affb0] });
    const hit = flyT + fly * 0.92; pillar(T, c1, c2, 1.6, 10, 0.9, hit, { speed: 4, widen: 1 }); ULT_BIG(T, c1, c2, hit, 6);
    for (let i = 0; i < 4; i++) tornado(T.clone().add(new V3(Math.cos(i * PI / 2) * 3, 0, Math.sin(i * PI / 2) * 3)), c1, c2, 0.8, 3, 0.9, hit + 0.1);
    emitter(80, i => ({ p: T.clone().add(new V3(R(-4, 4), R(4, 7), R(-4, 4))), v: new V3(R(-0.5, 0.5), -R(1, 2), R(-0.5, 0.5)), t0: hit + R(0, 1), life: R(1.2, 2), size: R(0.3, 0.5), col: [c1, c2, 0xff4a3a, 0x2a8aff][i % 4] }), { grav: 0, drag: 0.3 });   /* mưa lông vũ */
  };

  /* --- Hermes (Hy Lạp): Winged Courier – bão sấm kéo dài: mây giông, sét giáng liên tục, điện xẹt quanh người, 7 lần lướt tia chớp; bậc 10 Hermes hiện ra --- */
  SK.winged_courier = (F, T, rk) => {
    const f = FORM(rk), c1 = 0xffd040, c2 = 0xffffff, ce = 0x9ad8ff, now = CLOCK_MS(), first = !LAST.hermes || now - LAST.hermes > 900; if (first) { LAST.hermesI = 0; LAST.hermesP = F.clone(); } else LAST.hermesI++; LAST.hermes = now; const i = LAST.hermesI;
    if (first) { const SD = 2.8 + f * 0.8, R0 = 5.5 + f * 0.5, C = F.clone().lerp(T, 0.5);
      ULT_EXTRA = SD - 2.4 + (f >= 4 ? 2.2 : 0); ultFrame(F, c1, c2, "greek", 2.4, "Winged Courier", 6); ULT_EXTRA = 0;
      [-1, 1].forEach(s => prop(0, SD, () => { const g = new THREE.Group(), ws = new THREE.Shape(); ws.moveTo(0, 0); ws.quadraticCurveTo(0.5, 0.5, 1.1, 0.6); ws.lineTo(0.9, 0.35); ws.lineTo(1.0, 0.25); ws.lineTo(0.75, 0.12); ws.lineTo(0.8, 0.0); ws.lineTo(0, -0.1);
        const w = new THREE.Mesh(nuv(new THREE.ShapeGeometry(ws)), ghostMat(c1, 0xffffff, { fres: 0.6, cut: -0.5 })); w.scale.x = s; g.add(w);
        return { g, upd: (k, t) => { w.material.uniforms.uTime.value = t; w.material.uniforms.uAlpha.value = pop(k, 0.05, 0.9); g.position.copy(F).add(new V3(s * 0.35, 0.25, 0)); g.quaternion.copy(CAM.quaternion); w.rotation.z = Math.sin(t * 14) * 0.25 * s; g.scale.setScalar(1.2); } }; }));
      prop(0, SD, () => { const g = new THREE.Group(), cm = flowMat({ c1: 0x2a3050, c2: 0x8a9ac8, rep: [2, 2], spd: [0.15, 0.05], fres: 0, cut: 0.1, gain: 0.9, fade: [0.2, 0.2, 0.2, 0.2] }); cm.blending = THREE.NormalBlending; const m = new THREE.Mesh(new THREE.CircleGeometry(R0 * 1.5, 40).rotateX(PI / 2), cm); g.add(m); g.position.copy(C).setY(9);
        const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: 0xd8f0ff, blending: ADD, transparent: true, depthWrite: false })); fl.scale.setScalar(R0 * 3); fl.position.y = -0.5; g.add(fl);
        return { g, upd: (k, t) => { cm.uniforms.uTime.value = t; cm.uniforms.uAlpha.value = 0.85 * pop(k, 0.1, 0.88); fl.material.opacity = Math.random() < 0.12 ? 0.9 : 0.05; } }; });   /* mây giông chớp nháy */
      emitter(160 + f * 40, q => ({ p: C.clone().add(new V3(R(-7, 7), R(5, 8), R(-7, 7))), v: new V3(R(-0.6, 0.6), -R(1, 2), R(-0.6, 0.6)), t0: R(0, SD), life: R(1.5, 2.4), size: R(0.3, 0.55), col: [c1, 0xfff0b0, 0xffffff][q % 3] }), { grav: 0, drag: 0.3 });   /* lông vũ vàng rơi đầy trời */
      const nB = 12 + f * 9; for (let b = 0; b < nB; b++) { const at = 0.15 + b * (SD - 0.4) / nB, a = R(0, PI * 2), r = Math.sqrt(Math.random()) * R0, P = C.clone().add(new V3(Math.cos(a) * r, 0.05, Math.sin(a) * r)), big = b % 4 === 0;   /* sét giáng liên tục */
        bolt(P.clone().add(new V3(R(-1.5, 1.5), 9, R(-1.5, 1.5))), P, big ? 0xffffff : ce, big ? 0.45 + f * 0.06 : 0.2, big ? 0.28 : 0.18, at, { jag: 1 });
        glow(P.clone().setY(0.6), big ? 0xffffff : ce, big ? 3.5 : 2, 0.2, at, { flash: true }); if (big) { shock(P, ce, 2, 0.35, at); decal(P, TEX.crack, 0xffffff, 1.8, 1, at, { add: false, op: 0.7, ro: 3 }); task(at, 0.01, () => shake(0.1)); }
        sparks(P.clone().setY(0.3), [ce, 0xffffff], big ? 18 : 8, 6, 0.2, 0.35, at, { up: 1.5 }); }
      for (let a = 0; a < 10 + f * 6; a++) { const at = R(0.1, SD - 0.2), a1 = R(0, PI * 2), a2 = a1 + R(0.8, 2); bolt(F.clone().add(new V3(Math.cos(a1) * 0.8, R(0.3, 2), Math.sin(a1) * 0.8)), F.clone().add(new V3(Math.cos(a2) * 1.3, R(0.1, 2.2), Math.sin(a2) * 1.3)), ce, 0.07, 0.14, at, { jag: 0.5 }); }   /* điện xẹt quanh người */
      aura(F, ce, 0xffffff, 1.0, 3, SD, 0);
      if (f >= 3) for (let r = 0; r < 3; r++) decal(C, TEX.ring, ce, R0 * 2.4, 0.6, 0.5 + r * (SD / 3), { mode: "expand", expand: 0.6, op: 0.9 });
      if (f >= 4) { const tg = SD - 0.5, G = godAppear("hermes", "HERMES", F, T, c1, tg, 2.8);
        for (let q = 0; q < 6; q++) bolt(G.clone().setY(5), T.clone().add(new V3(R(-0.8, 0.8), 1.2, R(-0.8, 0.8))), q % 2 ? c1 : 0xffffff, 0.5, 0.3, tg + 0.8 + q * 0.07, { jag: 0.8 });   /* Hermes phóng sét vào quái */
        critBurst(T, c1, tg + 1.15); } }
    const HUE = [0xffd040, 0xffffff, 0x9ad8ff], B = T.clone().setY(1.1); let A = (LAST.hermesP || F).clone().setY(1.1); if (A.distanceTo(B) < 1.5) { const a = i * 2.4; A = B.clone().add(new V3(Math.cos(a) * 3.5, 0, Math.sin(a) * 3.5)); } LAST.hermesP = T.clone();
    bolt(A, B, c2, 0.6 + f * 0.08, 0.35, 0, { jag: 0.3 }); bolt(A, B, c1, 1.1 + f * 0.1, 0.35, 0, { jag: 0.15 }); bolt(A, B, ce, 0.3, 0.35, 0.03, { jag: 0.9 });   /* lướt như tia chớp, đuôi điện dài hơn */
    for (let g2 = 0; g2 < 3; g2++) glow(A.clone().lerp(B, g2 / 3), HUE[g2], 2.4, 0.4, g2 * 0.02);
    for (let q = 0; q < 2; q++) bolt(B, B.clone().add(new V3(R(-3, 3), R(-1, 1), R(-3, 3))), ce, 0.15, 0.25, 0.05, { jag: 0.7 });   /* điện nhánh toả ra */
    glow(B, 0xffffff, 3.5, 0.25, 0.04, { flash: true }); sparks(B, [c1, 0xffffff, ce], 30, 8, 0.3, 0.55, 0.04, { up: 1 }); shock(T, c1, 2.4, 0.4, 0.04); task(0.04, 0.01, () => shake(0.14));
    if (i === 6) { const at = 0.25; prop(at - 0.2, 1.2, () => { const g = new THREE.Group(), sm = solidMat(0xc8901a, 0xfff0a0, 0xffffff), staff = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4, 8), sm); g.add(staff);
        for (let s = 0; s < 2; s++) { const sn = new THREE.Mesh(new THREE.TubeGeometry(helix(0.35, 3, 2.2, 60), 80, 0.07, 6), sm); sn.position.y = -1.5; sn.rotation.y = s * PI; g.add(sn); }
        [-1, 1].forEach(s => { const w = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.2, 4).rotateZ(s * 1.2), sm); w.position.set(s * 0.6, 1.9, 0); g.add(w); }); const orb = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 8), sm); orb.position.y = 2.1; g.add(orb);
        return { g, upd: (k, t) => { sm.uniforms.uTime.value = t; const e = Math.min(1, t / 0.2); g.position.copy(T).setY(10 - e * e * 8); g.rotation.y = t * 2; sm.uniforms.uAlpha.value = 1 - Math.max(0, k - 0.75) / 0.25; } }; });
      ULT_BIG(T, c1, c2, at, 6); }
  };
  META.winged_courier.forms = ["Bão sấm + 7 lần lướt chớp", "Bão dài hơn, sét dày", "+ sóng điện lan, sét to", "+ HERMES hiện ra, sét CHÍ MẠNG"];

  ultTiered("dragon_roar", "thuong-hiet", "THƯƠNG HIỆT", 0xffc040, 0.8, 1.9, "Frot");
  ultTiered("rune_sword", "odin", "ODIN", 0x5fa8ff, 0.7, 0.75, "Tshift");
  ultTiered("ibis_judgment", "thoth", "THOTH", 0xffc040, 0.9, 1.75, "Trot");
  ultTiered("word_spirit_torii", "kotodama", "KOTODAMA", 0xff6a3a, 0.9, 2.45, "Frot");
  ultTiered("ogham_grove", "ogma", "OGMA", 0x5aff8a, 0.8, 1.4, "center");
  ultTiered("feathered_serpent", "itzamna", "ITZAMNA", 0x2affb0, 0.9, 2.3, "Frot");
  ultTiered("tablet_of_destiny", "nabu", "NABU", 0xffb030, 0.7, 1.0, "Tshift");

  /* --- Drum Roll (góp ý: đổi kiểu): dùi trống khổng lồ nện xuống quái như nện trống, mỗi nhịp 1 vòng sóng âm đứng + "DON!" --- */
  function drumstick(gold) { const g = new THREE.Group(), wm = solidMat(gold ? 0xc8901a : 0x9a2a10, gold ? 0xfff0a0 : 0xff9a5a, 0xffe0b0), st = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 3.2, 10).translate(0, 1.6, 0), wm); g.add(st);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 8), wm); tip.position.y = 3.25; g.add(tip); const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX.glow, color: gold ? 0xffd040 : 0xff6a1a, blending: ADD, transparent: true, depthWrite: false })); fl.position.y = 3.25; fl.scale.setScalar(1.6); g.add(fl); return { g, wm }; }
  function drumFaceTex() { return TEX.dface || (TEX.dface = cvTex(256, (g, n) => { g.translate(n / 2, n / 2); g.fillStyle = "rgba(255,240,210,.85)"; g.beginPath(); g.arc(0, 0, 118, 0, PI * 2); g.fill(); g.strokeStyle = "#8a2a10"; g.lineWidth = 10; g.stroke();
    for (let i = 0; i < 24; i++) { const a = i / 24 * PI * 2; g.fillStyle = "#3a1a08"; g.beginPath(); g.arc(Math.cos(a) * 108, Math.sin(a) * 108, 4, 0, PI * 2); g.fill(); }
    g.fillStyle = "#c0301a"; for (let i = 0; i < 3; i++) { g.save(); g.rotate(i * PI * 2 / 3); g.beginPath(); g.arc(0, -30, 38, 0, PI * 2); g.arc(0, -8, 18, 0, PI * 2, true); g.fill(); g.restore(); } })); }   /* mặt trống taiko (mitsudomoe) */
  META.drum_roll = { name: "Drum Roll", lv: 1, who: "Vocara · nhịp trống", forms: ["Dùi trống nện + sóng âm", "2 dùi luân phiên + mặt trống dưới quái", "+ cột âm lượng nhảy theo nhịp", "Dùi vàng + sấm mỗi nhịp"] };
  SK.drum_roll = (F, T, rk) => {
    const f = FORM(rk), gold = f >= 4, now = CLOCK_MS(), first = !LAST.drum_roll || now - LAST.drum_roll > 700; if (first) LAST.drumI = 0; else LAST.drumI++; LAST.drum_roll = now;
    const i = LAST.drumI, d = SDIR(F, T), side = new V3(-d.z, 0, d.x), s = f >= 2 ? (i % 2 ? 1 : -1) : 1, c1 = gold ? 0xffc040 : 0xff5a1a, c2 = 0xffe0a0, hit = 0.2, top = T.clone().setY(1.9);
    if (first && f >= 2) { decal(T, drumFaceTex(), 0xffffff, 3.6 + f * 0.3, 1.5, 0, { add: false, op: 0.95, mode: "static", ro: 3 }); rune(T, "circle", "latin", c1, 5 + f * 0.4, 1.5, 0, { mode: "spin", spin: 2, op: 0.7 }); }
    prop(0, 0.5, () => { const o = drumstick(gold), piv = T.clone().addScaledVector(side, s * 2.6).addScaledVector(d, -1.4).setY(0.4), aim = new V3().subVectors(top, piv).normalize();
      return { g: o.g, upd: (k, t) => { o.wm.uniforms.uTime.value = t; o.wm.uniforms.uAlpha.value = pop(k, 0.05, 0.75); o.g.position.copy(piv); const lift = t < hit ? 1 - Math.pow(t / hit, 2) * 1 : Math.min(0.6, (t - hit) * 3);   /* giơ cao rồi nện xuống, nảy lên */
        const dir = aim.clone().add(new V3(0, lift * 1.4, 0)).normalize(); o.g.quaternion.setFromUnitVectors(UP, dir); o.g.scale.setScalar(1 + f * 0.1); } }; });
    task(hit, 0.6, () => { const m = mesh(new THREE.RingGeometry(0.5, 0.75, 40), basic(null, i % 2 ? 0xffffff : c1, true, 1), 10); SC.add(m);   /* vòng sóng âm đứng, luôn quay về camera */
      return { upd: k => { m.position.copy(top); m.quaternion.copy(CAM.quaternion); m.scale.setScalar(1 + k * (3 + f)); m.material.opacity = 1 - k; }, end: () => kill(m) }; });
    if (f >= 2) task(hit + 0.06, 0.5, () => { const m = mesh(new THREE.RingGeometry(0.6, 0.75, 40), basic(null, c2, true, 1), 10); SC.add(m); return { upd: k => { m.position.copy(top); m.quaternion.copy(CAM.quaternion); m.scale.setScalar(1 + k * (2 + f)); m.material.opacity = 1 - k; }, end: () => kill(m) }; });
    glow(top, 0xffffff, 2.4 + f * 0.5, 0.18, hit, { flash: true }); glow(top, c1, 3 + f * 0.6, 0.3, hit, { flash: true }); shock(T, c1, 1.8 + f * 0.4, 0.35, hit);
    sparks(top, [c2, c1, 0xffffff], 14 + f * 6, 6, 0.22, 0.45, hit, { up: 1.2 }); textPop(top.clone().add(new V3(s * 0.8, 1, 0)), i % 3 === 2 ? "KA!" : "DON!", gold ? "#ffe060" : "#ffb070", 1.3 + f * 0.1, 0.45, hit);
    if (f >= 3) for (let b = 0; b < 8; b++) { const a = b / 8 * PI * 2, P = T.clone().add(new V3(Math.cos(a) * 2.4, 0, Math.sin(a) * 2.4)), h = R(1.6, 3.4) * (b % 2 ? 1 : 0.7);   /* cột âm lượng nhảy theo nhịp */
      task(hit, 0.45, () => { const m = mesh(new THREE.BoxGeometry(0.6, 1, 0.6).translate(0, 0.5, 0), basic(null, [0xff3a5a, 0xffa020, 0xffe040, 0x3aff8a][b % 4], true, 0.9)); m.position.copy(P); SC.add(m); return { upd: k => { m.scale.y = h * Math.sin(Math.min(1, k * 2) * PI * 0.5) * (1 - k) + 0.01; m.material.opacity = 0.9 * (1 - k); }, end: () => kill(m) }; }); }
    if (gold) bolt(T.clone().setY(11), T.clone().setY(0.2), 0xffffff, 0.35, 0.25, hit - 0.05, { jag: 0.6 });
    task(hit, 0.01, () => shake(0.07 + f * 0.04));
  };
  // vài chiêu danh nhân dùng hiệu ứng chung (để xem trong sổ tay)
  [["ladys_lamp", "Lady's Lamp", 12, "Florence Nightingale", { kind: "self", branch: "harmony" }], ["camera_obscura", "Camera Obscura", 19, "Nicéphore Niépce", { kind: "zone", branch: "control", radius: 4 }],
   ["gravity_crush", "Gravity Crush", 14, "Isaac Newton", { kind: "zone", branch: "power", radius: 3 }], ["prism_ray", "Prism Ray", 14, "Isaac Newton", { kind: "aoe", branch: "rhythm", radius: 6 }],
   ["tesla_coil", "Tesla Coil", 40, "Nikola Tesla", { kind: "multi", branch: "rhythm" }], ["absolute_chill", "Absolute Chill", 42, "Willis Carrier", { kind: "aoe", branch: "control", radius: 6 }]]
   .forEach(([id, name, lv, who, g]) => META[id] = META[id] || { name, lv, who: who + " · hiệu ứng chung (chờ làm riêng)", g, desc: "Hiệu ứng chung theo nhánh + loại chiêu, cũng đổi hình ở bậc 4 / 7 / 10." });
  const LEGACY = { basic_slash: 1 };   // hiệu ứng viết theo thang 5 bậc cũ
  api.ids = Object.keys(META);
  api.meta = META;
  api.names = {}; api.ids.forEach(id => api.names[id] = META[id].name);
  api.form = FORM;
  api.has = id => !!SK[id];   // chiêu đã có hiệu ứng riêng
  api.setup = (scene, camera, renderer) => { SC = MAIN_SC = scene; CAM = camera; REN = renderer; if (!ready) { makeTextures(); ready = true; } };
  api.ready = () => ready;
  api.update = update;
  /* cast(id, từ, tới, bậc 1–10, { kind, branch, radius, scene, camera }) – chiêu chưa có hiệu ứng riêng dùng hiệu ứng chung theo nhánh + loại */
  api.cast = (id, from, to, rank, o) => {
    if (!ready) return; o = o || {}; const sc0 = SC, cam0 = CAM; if (o.scene) { SC = o.scene; CAM = o.camera || CAM; }
    try { const g = Object.assign({}, (META[id] || {}).g, o), F = from.clone().setY(0), r = Math.max(1, Math.min(10, rank || 1));
      const Tt = to ? to.clone().setY(0) : (g.kind === "aoe" || g.kind === "self" ? F.clone() : F.clone().add(new V3(0, 0, -6)));
      if (SK[id]) SK[id](F, Tt, LEGACY[id] ? [0, 1, 3, 4, 5][FORM(r)] : r); else generic(id, F, Tt, r, g); }
    catch (e) { if (window.__fxdebug) console.error("FX3D", id, e); } finally { SC = sc0; CAM = cam0; }
  };
  api.clear = () => { TASKS.forEach(T => { if (T.h && T.h.end) T.h.end(); }); TASKS.length = 0; };
  api._tasks = () => TASKS.length;
  return api;
})();
