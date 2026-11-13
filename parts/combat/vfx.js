/* EnglishVerse – HIỆU ỨNG CHIÊU 3D. Xem docs/design/voice-combat.html mục 5 ("hình ảnh chiêu thay đổi theo bậc").
   SKILL_VFX.play(id, { rank: 1..5, from: Vector3 (người chơi, y=0), to: Vector3|null (mục tiêu, y=0), radius, perfect })
   SKILL_VFX.hit(pos, color)   tia sáng nhỏ khi đòn trúng (đánh thường)
   SKILL_VFX.tick(dt)          engine gọi mỗi khung hình
   3 mốc hình ảnh: bậc 1–2 cơ bản · bậc 3–4 to hơn + hạt sáng + thêm lớp · bậc 5 đổi hình dạng / màu, hoành tráng (rung màn hình: window.CAM_SHAKE = giây).
   Tuyệt chiêu (dragon_roar, silence_zone, grand_chorus, festival_frenzy) luôn hoành tráng nhất, ≤ 2 s.
   Cách dựng cho nhẹ máy: hình khối + 6 texture canvas vẽ MỘT lần; mỗi hiệu ứng mượn đồ từ "kho" (pool) rồi trả lại — không tạo
   geometry / material / texture mới mỗi lần bắn; tối đa 60 mesh/sprite sống cùng lúc (hết kho thì bỏ bớt hạt, không lỗi). */
const SKILL_VFX = (function () {
  const USE_ADD = false, GS = 3, MAX = 60, ADD = THREE.AdditiveBlending, V3 = THREE.Vector3, PI = Math.PI;
  const GEO = {}, TEX = {}, POOL = {}, FX = [];
  let live = 0, ready = false;
  const UP = new V3(0, 1, 0), FWD = new V3(0, 0, 1), _a = new V3(), _b = new V3(), _c = new V3(), _d = new V3();
  const R = (a, b) => a + Math.random() * (b - a), clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  /* ---------- kho đồ chung (tạo 1 lần) ---------- */
  function canvasTex(fn) { const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d"); x.scale(2, 2); fn(x); return new THREE.CanvasTexture(c); }
  function init() {
    if (ready) return; ready = true;
    TEX.glow = canvasTex(x => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.4, "rgba(255,255,255,0.8)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
    TEX.star = canvasTex(x => { x.fillStyle = "#fff"; x.beginPath(); x.moveTo(32, 1); x.quadraticCurveTo(35, 29, 63, 32); x.quadraticCurveTo(35, 35, 32, 63); x.quadraticCurveTo(29, 35, 1, 32); x.quadraticCurveTo(29, 29, 32, 1); x.fill(); const g = x.createRadialGradient(32, 32, 0, 32, 32, 12); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
    const txt = s => canvasTex(x => { x.fillStyle = "#fff"; x.font = "bold 54px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(s, 32, 36); });
    TEX.note = txt("♪"); TEX.note2 = txt("♫"); TEX.q = txt("?");
    TEX.petal = canvasTex(x => { x.fillStyle = "#fff"; x.beginPath(); x.moveTo(32, 4); x.bezierCurveTo(58, 22, 52, 50, 32, 60); x.bezierCurveTo(12, 50, 6, 22, 32, 4); x.fill(); });
    TEX.snow = canvasTex(x => { x.strokeStyle = "#fff"; x.lineWidth = 5; x.lineCap = "round"; for (let i = 0; i < 3; i++) { const a = i * PI / 3; x.beginPath(); x.moveTo(32 + Math.cos(a) * 27, 32 + Math.sin(a) * 27); x.lineTo(32 - Math.cos(a) * 27, 32 - Math.sin(a) * 27); x.stroke(); } });
    const f = (g, ty) => { if (ty) g.translate(0, ty, 0); return g; };
    GEO.ring = new THREE.RingGeometry(0.86, 1, 40).rotateX(-PI / 2);      // vòng nằm trên đất
    GEO.vring = new THREE.RingGeometry(0.8, 1, 28);                          // vòng đứng (pháp tuyến +z)
    GEO.disc = new THREE.CircleGeometry(1, 24).rotateX(-PI / 2);
    GEO.cone = f(new THREE.ConeGeometry(1, 1, 8), 0.5);                     // đáy ở gốc, mũi +y, cao 1
    GEO.box = f(new THREE.BoxGeometry(1, 1, 1), 0.5);                       // dài theo +y từ 0 đến 1
    GEO.cyl = f(new THREE.CylinderGeometry(1, 1, 1, 12, 1, true), 0.5);     // cột sáng rỗng
    GEO.sph = new THREE.SphereGeometry(1, 10, 7);
    GEO.oct = new THREE.OctahedronGeometry(1, 0);
  }
  const ringK = r => 1 + (GS - 1) * clamp(1 - r / 4.5, 0, 1);   // vòng quanh mình: nhỏ thì phóng to cho dễ thấy, vòng lớn (vùng đánh thật) giữ nguyên bán kính
  class Item {
    constructor(o, m, pk) { this.o = o; this.m = m; this.pk = pk; this.exact = /^m(ring|disc|sph)/.test(pk); }
    p(x, y, z) { if (x.isVector3) this.o.position.copy(x); else this.o.position.set(x, y, z); return this; }
    s(x, y, z) { const g = this.exact ? ringK(x) : GS; this.o.scale.set(x * g, (y === undefined ? x : y) * g, (z === undefined ? x : z) * g); return this; }   // GS: camera chiến đấu ở xa → hình to hơn; vòng / vòm giữ đúng bán kính
    a(v) { this.m.opacity = v < 0 ? 0 : v > 1 ? 1 : v; return this; }
    c(h) { this.m.color.setHex(h); return this; }
    along(d) { this.o.quaternion.setFromUnitVectors(UP, d); return this; }    // trục +y theo hướng d (nón, hộp)
    face(d) { this.o.quaternion.setFromUnitVectors(FWD, d); return this; }     // pháp tuyến +z theo hướng d (vòng đứng)
    rz(a) { this.m.rotation = a; this.o.rotation.z = a; return this; }
    ry(a) { this.o.rotation.y = a; return this; }
  }
  const NIL = new Item(new THREE.Object3D(), { opacity: 0, color: new THREE.Color(), rotation: 0 }, "nil");
  function take(kind, key, color, add) {
    if (live >= MAX || typeof scene === "undefined") return NIL;
    const pk = kind + key + (add ? 1 : 0), pl = POOL[pk] || (POOL[pk] = []);
    let it = pl.pop();
    if (!it) {
      const bl = (add && USE_ADD) ? ADD : THREE.NormalBlending;   // nền game sáng (tuyết, cát): cộng sáng sẽ trắng xoá → dùng trộn thường
      if (kind === "s") { const m = new THREE.SpriteMaterial({ map: TEX[key], transparent: true, depthWrite: false, blending: bl, fog: false }); it = new Item(new THREE.Sprite(m), m, pk); }
      else { const m = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, blending: bl, side: THREE.DoubleSide, fog: false }); it = new Item(new THREE.Mesh(GEO[key], m), m, pk); }
      it.o.frustumCulled = false; it.o.userData.fxItem = true;
    }
    it.m.color.setHex(color); it.m.opacity = 1; it.m.rotation = 0; it.o.position.set(0, 0, 0); it.o.scale.set(1, 1, 1); it.o.quaternion.set(0, 0, 0, 1); it.o.rotation.set(0, 0, 0);
    scene.add(it.o); live++; return it;
  }
  function give(it) { if (it === NIL) return; scene.remove(it.o); (POOL[it.pk] = POOL[it.pk] || []).push(it); live--; }

  /* ---------- hệ thống hiệu ứng theo thời gian ---------- */
  function fx(dur, delay, setup) { FX.push({ t: -(delay || 0), dur, items: [], setup, upd: null }); }
  function mk(E) {
    E.spr = (key, c, add) => { const i = take("s", key, c, add !== false); E.items.push(i); return i; };
    E.mesh = (key, c, add) => { const i = take("m", key, c, add !== false); E.items.push(i); return i; };
  }
  function tick(dt) {
    if (!FX.length) return;
    dt = Math.min(dt, 0.1);
    for (let i = FX.length - 1; i >= 0; i--) {
      const E = FX[i]; E.t += dt; if (E.t < 0) continue;
      if (!E.upd) { mk(E); E.upd = E.setup(E) || (() => {}); }
      const k = Math.min(1, E.t / E.dur); E.upd(k, dt, E);
      if (k >= 1) { E.items.forEach(give); FX.splice(i, 1); }
    }
  }
  function shake(s) { try { window.CAM_SHAKE = Math.max(window.CAM_SHAKE || 0, s); } catch (e) {} }

  /* ---------- thành phần dùng lại ---------- */
  const flash = (P, c, size, dur, delay, y, key) => { P = P.clone(); fx(dur, delay, E => { const s = E.spr(key || "glow", c); return k => s.p(P.x, y === undefined ? P.y : y, P.z).s(size * (0.4 + k * 0.8)).a(0.8 * (1 - k * k)); }); };
  const ringWave = (P, c, r1, dur, delay, y, r0) => { P = P.clone(); fx(dur, delay, E => { const m = E.mesh("ring", c); return k => m.p(P.x, y === undefined ? 0.12 : y, P.z).s((r0 || 0.3) + (r1 - (r0 || 0.3)) * Math.sqrt(k)).a(0.95 * (1 - k)); }); };
  const vWave = (P, d, c, r0, r1, dur, delay) => { P = P.clone(); d = d.clone(); fx(dur, delay, E => { const m = E.mesh("vring", c); return k => m.p(P).face(d).s(r0 + (r1 - r0) * k).a(0.9 * (1 - k)); }); };
  function burst(P, c, n, spd, size, dur, delay, key, grav, y0) {   // hạt bắn tỏa tròn (rơi theo trọng lực)
    P = P.clone(); fx(dur, delay, E => {
      const a = []; for (let i = 0; i < n; i++) { const ang = R(0, PI * 2), el = R(-0.1, 1), sp = R(0.5, 1) * spd * 1.6; a.push({ it: E.spr(key || "glow", c), vx: Math.cos(ang) * sp * (1 - el * 0.5), vz: Math.sin(ang) * sp * (1 - el * 0.5), vy: el * sp * 0.9 + 1 }); }
      return k => { const t = k * dur; a.forEach(o => o.it.p(P.x + o.vx * t, (y0 === undefined ? P.y : y0) + o.vy * t - 0.5 * (grav === undefined ? 6 : grav) * t * t, P.z + o.vz * t).s(size * (1 - k * 0.6)).a(1 - k)); };
    });
  }
  const pillar = (P, c, h, r, dur, delay) => { P = P.clone(); fx(dur, delay, E => { const m = E.mesh("cyl", c); return k => m.p(P.x, 0, P.z).s(r * 0.8 * (1 - k * 0.5), h * 0.7 * Math.min(1, k * 6 + 0.3), r * 0.8 * (1 - k * 0.5)).a(0.5 * (1 - k)); }); };
  function risers(P, c, n, rad, h, turns, dur, delay, size, key, flip) {   // hạt xoắn bay lên (hoặc rơi xuống nếu flip)
    rad *= 1.6; h *= 1.4; P = P.clone(); fx(dur, delay, E => {
      const a = []; for (let i = 0; i < n; i++) a.push({ it: E.spr(Array.isArray(key) ? key[i % key.length] : key || "glow", Array.isArray(c) ? c[i % c.length] : c), ph: i / n, ang: i * 2.4 });
      return k => a.forEach(o => { const u = (k * 0.7 + o.ph * 0.3), y = flip ? h * (1 - u) : h * u, an = o.ang + k * turns * PI * 2; o.it.p(P.x + Math.cos(an) * rad, y + 0.1, P.z + Math.sin(an) * rad).s(size).a(Math.sin(clamp(k, 0, 1) * PI) * 0.95); });
    });
  }
  function orbit(P, c, n, rad, y, turns, dur, delay, size, key, grow) {   // hạt quay quanh một điểm
    rad *= 1.6; y *= 1.3; P = P.clone(); fx(dur, delay, E => {
      const a = []; for (let i = 0; i < n; i++) a.push(E.spr(Array.isArray(key) ? key[i % key.length] : key || "glow", Array.isArray(c) ? c[i % c.length] : c));
      return k => a.forEach((it, i) => { const an = i / n * PI * 2 + k * turns * PI * 2, r = rad * (grow ? 0.4 + 0.6 * k : 1); it.p(P.x + Math.cos(an) * r, y + Math.sin(an * 2 + i) * 0.15, P.z + Math.sin(an) * r).s(size).a(Math.sin(k * PI) * 0.95); });
    });
  }
  const _e = new V3();
  function seg(it, a, b, w) { _e.subVectors(b, a); const l = _e.length(); if (l < 1e-4) { it.s(0); return it; } it.p(a).along(_e.multiplyScalar(1 / l)); it.o.scale.set(w * GS, l, w * GS); return it; }
  function dome(P, c, r, dur, delay, op, hemi) { P = P.clone(); fx(dur, delay, E => { const m = E.mesh("sph", c); return k => { const e = k < 0.2 ? k / 0.2 : 1, f = k > 0.7 ? (1 - k) / 0.3 : 1; m.p(P.x, hemi ? 0 : 1, P.z).s(r * (0.6 + 0.4 * e)).a((op || 0.3) * f * (0.85 + 0.15 * Math.sin(k * 30))); }; }); }
  function impact(C, delay, size, big) {   // chỗ trúng đòn: chớp + vòng + hạt, nhiều lớp dần theo bậc
    const B = C.B, T = C.T, s = size * C.k, c = C.col;
    flash(B, c[2], s * 1.5, 0.28, delay); ringWave(C.Tg, c[0], s * 1.6, 0.4, delay);
    burst(B, c[1], 5 + T * 4, 4 + T, 0.3 + 0.08 * T, 0.5, delay, "glow", 8);
    if (T >= 2) { ringWave(C.Tg, c[1], s * 2.3, 0.5, delay + 0.08); flash(B, c[2], s * 1.9, 0.35, delay, undefined, "star"); }
    if (T >= 3 || big) { ringWave(C.Tg, c[2], s * 3, 0.6, delay + 0.16); burst(B, c[3] || c[2], 12, 6, 0.34, 0.7, delay, "star", 4); pillar(C.Tg, c[1], 5, 0.7 * s, 0.5, delay); }
  }
  const lerpP = (A, B, k, o, arc) => { o.lerpVectors(A, B, k); if (arc) o.y += Math.sin(k * PI) * arc; return o; };

  /* ---------- bảng màu theo nhánh × mốc (0 main · 1 sáng · 2 trắng ấm/lạnh · 3 điểm nhấn) ---------- */
  const PAL = {
    power: [[0xff4d3a, 0xff9a3a, 0xffe08a, 0xff2a1a], [0xff3b30, 0xff8a1f, 0xffd43b, 0xffffff], [0xffd43b, 0xff9f1a, 0xfff6c8, 0xff3b30]],
    control: [[0x3b8bff, 0x8fcbff, 0xe6f4ff, 0x6fd0ff], [0x2fa8ff, 0x8be9ff, 0xffffff, 0xa6c8ff], [0xcdeeff, 0x7cc0ff, 0xffffff, 0xa78bfa]],
    harmony: [[0x3fd16a, 0xa4f0a0, 0xf0ffe0, 0x7ee8c6], [0x32cf7a, 0xb8f5a0, 0xfff6a8, 0x7ee8c6], [0xffd43b, 0xfff0a0, 0xffffff, 0xff9ab0]],
    rhythm: [[0xff8a1f, 0xffc24a, 0xfff0b0, 0xff5a1f], [0xff6a00, 0xffa51f, 0xffe066, 0xff3b1f], [0xff3b1f, 0xff9a1f, 0xffe27a, 0xffffff]]
  };
  const RAINBOW = [0xff5a5a, 0xffa23a, 0xffe14a, 0x4be08a, 0x4da3ff, 0xa78bfa];

  /* ---------- 28 chiêu ---------- */
  const SK = {};
  /* ⚡ POWER */
  SK.echo_blast = C => {   // sóng âm tròn lao tới: 2 → 3 → 4 vòng, bậc 5 lõi vàng + vòng đồng tâm
    const { T, A, B, dir, col, k: K } = C, dur = 0.2 + A.distanceTo(B) * 0.018, nr = T + 1;
    fx(dur, 0, E => { const core = E.spr("glow", col[2]), rs = [], tr = [];
      for (let i = 0; i < nr; i++) rs.push(E.mesh("vring", col[i % 2], true)); for (let i = 0; i < T * 2; i++) tr.push(E.spr("glow", col[1]));
      return k => { lerpP(A, B, k, _a); core.p(_a).s((0.7 + 0.35 * T) * K).a(1);
        rs.forEach((r, i) => { const kk = Math.max(0, k - i * 0.09); lerpP(A, B, kk, _b); r.p(_b).face(dir).s((0.3 + 0.2 * T + kk * 0.5 + i * 0.12) * K).a(kk > 0 ? 0.9 : 0); });
        tr.forEach((s, i) => { const kk = k - (i + 1) * 0.05; if (kk < 0) { s.a(0); return; } lerpP(A, B, kk, _b); s.p(_b).s((0.5 + 0.1 * T) * K * (1 - i * 0.08)).a(0.7 - i * 0.07); }); }; });
    impact(C, dur, 1.2, false);
  };
  SK.sonic_spear = C => {   // giáo âm thanh → giáo dài có đuôi → bậc 5: giáo rồng vàng
    const { T, A, B, dir, col, k: K } = C, dur = 0.16 + A.distanceTo(B) * 0.012, len = (0.9 + 0.4 * T) * K;
    fx(dur, 0, E => { const head = E.mesh("cone", col[2], false), shaft = E.mesh("box", col[0], true), tr = [];
      const horn1 = T >= 3 ? E.mesh("cone", col[1], false) : NIL, horn2 = T >= 3 ? E.mesh("cone", col[1], false) : NIL, body = [];
      for (let i = 0; i < (T >= 3 ? 12 : T * 3); i++) body.push(E.spr("glow", i % 3 === 0 ? col[2] : col[T >= 3 ? 1 : 0]));
      for (let i = 0; i < T * 2; i++) tr.push(E.spr("star", col[1]));
      const side = _c.crossVectors(dir, UP).normalize().clone();
      return k => { lerpP(A, B, k, _a); const w = 0.2 * K * (T >= 3 ? 1.7 : 1);
        head.p(_a.x + dir.x * 0.0, _a.y, _a.z).along(dir).s(w, len * 0.5, w).a(1); head.o.position.copy(_a).addScaledVector(dir, 0);
        shaft.p(_a.x - dir.x * len * 0.5, _a.y - dir.y * len * 0.5, _a.z - dir.z * len * 0.5).along(dir).s(w * 0.35, len * 0.7, w * 0.35).a(0.9);
        if (T >= 3) { horn1.p(_a.x - dir.x * 0.3, _a.y + 0.1, _a.z - dir.z * 0.3).along(_d.copy(dir).multiplyScalar(-1).addScaledVector(UP, 0.8).addScaledVector(side, 0.6)).s(0.07, 0.5, 0.07).a(1); horn2.p(_a.x - dir.x * 0.3, _a.y + 0.1, _a.z - dir.z * 0.3).along(_d.copy(dir).multiplyScalar(-1).addScaledVector(UP, 0.8).addScaledVector(side, -0.6)).s(0.07, 0.5, 0.07).a(1); }
        body.forEach((s, i) => { const kk = k - 0.02 - i * 0.025; if (kk < 0) { s.a(0); return; } lerpP(A, B, kk, _b); const wob = T >= 3 ? Math.sin(kk * 26 - i * 0.7) * 0.5 : 0; _b.addScaledVector(side, wob); _b.y += T >= 3 ? Math.cos(kk * 22 - i) * 0.25 : 0; s.p(_b).s((T >= 3 ? 0.9 - i * 0.04 : 0.5) * K).a(0.9 - i * 0.04); });
        tr.forEach((s, i) => { const kk = k - 0.05 - i * 0.06; if (kk < 0) { s.a(0); return; } lerpP(A, B, kk, _b); _b.x += Math.sin(i * 5) * 0.25; _b.y += 0.3 + Math.cos(i * 3) * 0.2; s.p(_b).s(0.35 * K).a(0.8 * (1 - i / (T * 2))); }); }; });
    impact(C, dur, 1.4, T >= 3); if (T >= 3) { shake(0.35); flash(C.B, col[2], 5 * K, 0.4, dur, undefined, "star"); burst(C.B, col[0], 10, 7, 0.3, 0.8, dur, "glow", 5); }
  };
  SK.thunder_clap = C => {   // sét từ trời: 1 tia → 3 tia + vòng điện → bậc 5 lưới sét trắng vàng + trụ sáng
    const { T, Tg, B, col, k: K } = C, nb = T === 1 ? 1 : T === 2 ? 2 : 3, S = T >= 3 ? 4 : 5;
    fx(0.45, 0, E => { const bolts = [];
      for (let b = 0; b < nb; b++) { const arr = []; for (let i = 0; i < S; i++) arr.push(E.mesh("box", b === 0 ? col[2] : col[1], true)); bolts.push(arr); }
      const core = E.spr("glow", col[2]); let acc = 0;
      return (k, dt) => { acc += dt; const on = k < 0.7; core.p(Tg.x, 1, Tg.z).s(2.5 * K * (T + 1) / 2 * (1 - k)).a(on ? 1 : 0);
        bolts.forEach((arr, b) => { const ox = b === 0 ? 0 : (b === 1 ? 1.4 : -1.4) * K, oz = b === 2 ? 0.8 : -0.4 * b; let prev = _a.set(Tg.x + ox, 9, Tg.z + oz);
          arr.forEach((it, i) => { const f = (i + 1) / S, nx = Tg.x + ox + (i === S - 1 ? 0 : R(-0.7, 0.7)), nz = Tg.z + oz + (i === S - 1 ? 0 : R(-0.7, 0.7)); _b.set(nx, 9 * (1 - f) + 0.2, nz);
            seg(it, prev, _b, (b === 0 ? 0.28 : 0.18) * K * (1 - k * 0.6)); it.a(on ? (Math.random() < 0.15 ? 0.4 : 1) : 0); prev = _d.copy(_b); }); }); }; });
    impact(C, 0.1, 1.1, false); if (T >= 2) ringWave(Tg, col[2], 2.4 * K, 0.4, 0.1);
    if (T >= 3) { shake(0.35); pillar(Tg, col[2], 12, 0.9 * K, 0.5, 0.05); orbit(Tg, col[2], 5, 1.6, 0.5, 1.2, 0.6, 0.1, 0.55, "star"); }
  };
  SK.big_voice = C => {   // gồng hơi, sóng hình nón mở rộng
    const { T, A, B, dir, col, k: K } = C, dur = 0.3 + A.distanceTo(B) * 0.015, n = T + 1;
    flash(A, col[1], 1.5 * K, 0.35, 0, undefined, "star"); if (T >= 2) burst(A, col[2], 8, 3, 0.25, 0.4, 0, "glow", 3);
    for (let i = 0; i < n; i++) fx(dur, i * 0.07, E => { const m = E.mesh("vring", col[i % 2], true), g = E.spr("glow", col[2]);
      return k => { lerpP(A, B, k, _a); const r = (0.4 + k * (0.9 + 0.5 * T)) * K; m.p(_a).face(dir).s(r).a(0.9 * (1 - k * 0.4)); g.p(_a).s(r * 1.3).a(0.25 * (1 - k)); }; });
    impact(C, dur * 0.8, 1.4, false);
    if (T >= 3) { shake(0.4); fx(0.5, dur * 0.8, E => { const m = E.mesh("cyl", col[1]); return k => m.p(C.Tg.x, 0, C.Tg.z).s(2.5 * (0.5 + k), 3 * (1 - k), 2.5 * (0.5 + k)).a(0.6 * (1 - k)); }); }
  };
  SK.piercing_note = C => {   // tia kim âm xuyên qua mục tiêu
    const { T, A, B, dir, col, k: K } = C, ext = _d.copy(B).addScaledVector(dir, 3).clone(), dur = 0.14 + A.distanceTo(B) * 0.01;
    fx(dur + 0.25, 0, E => { const beams = [E.mesh("box", col[2], true)]; if (T >= 2) beams.push(E.mesh("box", col[0], true)); if (T >= 3) beams.push(E.mesh("box", col[1], true));
      const head = E.spr(T >= 2 ? "note2" : "note", col[2]), nts = []; for (let i = 0; i < (T - 1) * 3; i++) nts.push(E.spr(i % 2 ? "note" : "note2", col[1])); const side = _c.crossVectors(dir, UP).normalize().clone();
      return k => { const f = Math.min(1, k * (dur + 0.25) / dur), len = (T >= 3 ? 9 : 6) * Math.min(1, f * 1.2), fa = 1 - Math.max(0, (k * (dur + 0.25) - dur) / 0.25);
        _a.lerpVectors(A, ext, f); _b.copy(_a).addScaledVector(dir, -len * 0.7); beams.forEach((b, i) => { seg(b, _b, _a, (0.06 + 0.1 * i * (T >= 3 ? 1 : 0.5)) * K).a(fa * (i === 0 ? 1 : 0.5)); });
        head.p(_a).s((0.9 + 0.3 * T) * K).a(fa);
        nts.forEach((n, i) => { const t = i / nts.length, an = f * 14 + i * 2.1; _b.lerpVectors(A, _a, 0.2 + 0.7 * t); n.p(_b.x + side.x * Math.cos(an) * 0.5, _b.y + Math.sin(an) * 0.5, _b.z + side.z * Math.cos(an) * 0.5).s(0.5 * K).a(fa * 0.9); }); }; });
    impact(C, dur * 0.9, 1.0, false); if (T >= 3) { shake(0.3); ringWave(ext.set(ext.x, 0, ext.z), col[1], 2.5, 0.5, dur + 0.1); }
  };
  SK.last_word = C => {   // nhát chém kết liễu: chữ X → chém + máu đỏ → bậc 5 thanh kiếm khổng lồ rơi từ trời
    const { T, Tg, B, col, k: K } = C;
    if (T < 3) {
      fx(0.4, 0.05, E => { const a = E.mesh("box", col[2], true), b = E.mesh("box", col[T === 1 ? 0 : 1], true), g = E.spr("glow", col[1]);
        return k => { const e = Math.min(1, k * 4), L = (2.6 + T * 0.6) * K, w = 0.12 * K * (1 - k * 0.5);
          _a.set(B.x - L / 2 * 0.7, B.y + L / 2 * 0.7, B.z); _b.set(B.x + L / 2 * 0.7, B.y - L / 2 * 0.7, B.z); _c.lerpVectors(_a, _b, e); seg(a, _a, _c, w).a(1 - k * k);
          _a.set(B.x + L / 2 * 0.7, B.y + L / 2 * 0.7, B.z); _b.set(B.x - L / 2 * 0.7, B.y - L / 2 * 0.7, B.z); _c.lerpVectors(_a, _b, Math.max(0, e * 1.3 - 0.3)); seg(b, _a, _c, w).a(1 - k * k);
          g.p(B).s(2.4 * K * (1 - k * 0.5)).a(0.7 * (1 - k)); }; });
      impact(C, 0.15, 1.1, false);
    } else {
      fx(0.7, 0, E => { const blade = E.mesh("box", col[2], false), guard = E.mesh("box", col[0], false), edge = E.mesh("box", col[1], true), g = E.spr("glow", col[1]), trail = [E.spr("glow", col[0]), E.spr("glow", col[1]), E.spr("glow", col[0])];
        return k => { const f = Math.min(1, k / 0.4), y = 11 * (1 - f * f) + 1.1; _a.set(Tg.x, y, Tg.z); _b.set(Tg.x, y - 3.2 * K, Tg.z);
          seg(blade, _b, _a, 0.45 * K).a(k < 0.7 ? 1 : (1 - k) / 0.3); seg(edge, _b, _a, 0.75 * K).a(0.4 * (1 - Math.max(0, (k - 0.5) * 2)));
          _c.set(Tg.x - 0.7 * K, y, Tg.z); _d.set(Tg.x + 0.7 * K, y, Tg.z); seg(guard, _c, _d, 0.18 * K).a(k < 0.7 ? 1 : (1 - k) / 0.3);
          g.p(Tg.x, y - 1.6, Tg.z).s(3 * K).a(0.6 * (1 - k)); trail.forEach((s, i) => s.p(Tg.x, y + 1.3 + i * 1.4, Tg.z).s(1.4 * K).a((1 - f) * 0.6)); }; });
      impact(C, 0.3, 1.5, true); shake(0.4); burst(B, col[3], 14, 7, 0.28, 0.8, 0.3, "star", 5);
    }
  };
  SK.dragon_roar = C => {   // TUYỆT CHIÊU: tụ lực → rồng vàng cuộn bay tới → gầm: nổ, trụ lửa
    const { A, B, Tg, dir, col, k: K } = C, dur = 0.55 + A.distanceTo(B) * 0.012, T0 = 0.35; _c.crossVectors(dir, UP).normalize(); const side = _c.clone();
    ringWave(C.F, col[1], 3, 0.4, 0); risers(C.F, col[2], 8, 1.2, 2.2, 1, 0.4, 0, 0.5, "star", true); flash(A, col[2], 2.5, 0.4, 0, undefined, "star");
    fx(dur, T0, E => { const head = E.mesh("cone", col[2], false), h1 = E.mesh("cone", col[1], false), h2 = E.mesh("cone", col[1], false), jaw = E.mesh("cone", col[0], false), eye = E.spr("glow", 0xffffff), body = [], fire = [];
      for (let i = 0; i < 16; i++) body.push(E.spr("glow", i % 4 === 0 ? col[2] : i % 2 ? col[1] : col[0])); for (let i = 0; i < 8; i++) fire.push(E.spr("glow", col[3]));
      return k => { lerpP(A, B, k, _a, 1.2); const hd = _d.copy(dir);
        head.p(_a).along(hd).s(0.5, 1.0, 0.5).a(1); jaw.p(_a.x, _a.y - 0.25, _a.z).along(_b.copy(hd).addScaledVector(UP, -0.3)).s(0.3, 0.6, 0.3).a(1);
        h1.p(_a.x - dir.x * 0.1, _a.y + 0.3, _a.z - dir.z * 0.1).along(_b.copy(dir).multiplyScalar(-1).addScaledVector(UP, 1).addScaledVector(side, 0.8)).s(0.14, 1, 0.14).a(1);
        h2.p(_a.x - dir.x * 0.1, _a.y + 0.3, _a.z - dir.z * 0.1).along(_b.copy(dir).multiplyScalar(-1).addScaledVector(UP, 1).addScaledVector(side, -0.8)).s(0.14, 1, 0.14).a(1);
        eye.p(_a.x + side.x * 0.3, _a.y + 0.35, _a.z + side.z * 0.3).s(0.45).a(1);
        body.forEach((s, i) => { const kk = k - 0.025 - i * 0.03; if (kk < 0) { s.a(0); return; } lerpP(A, B, kk, _b, 1.2); _b.addScaledVector(side, Math.sin(kk * 22 - i * 0.6) * 0.9); _b.y += Math.cos(kk * 18 - i * 0.5) * 0.5; s.p(_b).s(0.85 - i * 0.035).a(0.95 - i * 0.03); });
        fire.forEach((s, i) => { const kk = k - 0.03 - i * 0.05; if (kk < 0) { s.a(0); return; } lerpP(A, B, kk, _b, 1.2); s.p(_b.x + R(-0.3, 0.3), _b.y + 0.5 + i * 0.07, _b.z + R(-0.3, 0.3)).s(0.6).a(0.6 - i * 0.05); }); }; });
    const hit = T0 + dur * 0.92; impact(C, hit, 2.2, true); shake(0.7);
    ringWave(Tg, col[3], 9, 0.8, hit); ringWave(Tg, col[1], 6, 0.7, hit + 0.12); pillar(Tg, col[1], 9, 2.2, 0.7, hit); pillar(Tg, col[2], 12, 1, 0.6, hit);
    burst(B, col[2], 16, 9, 0.5, 0.9, hit, "star", 5); risers(Tg, col[1], 10, 1.5, 6, 1.5, 0.8, hit, 0.7, "glow");
  };
  /* 🌀 CONTROL */
  SK.question_arrow = C => {   // mũi tên → mũi tên pha lê + dấu ? → 3 mũi tên & 3 dấu ? xoay quanh mục tiêu
    const { T, A, B, Tg, dir, col, k: K } = C, dur = 0.2 + A.distanceTo(B) * 0.015, na = T >= 3 ? 3 : 1, side = _c.crossVectors(dir, UP).normalize().clone();
    for (let n = 0; n < na; n++) fx(dur, n * 0.08, E => { const head = E.mesh("cone", col[2], false), shaft = E.mesh("box", col[0], true), tr = []; for (let i = 0; i < T * 2; i++) tr.push(E.spr(T >= 3 ? "star" : "glow", col[1]));
      const off = (n - (na - 1) / 2) * 1.1; return k => { lerpP(A, B, k, _a); _a.addScaledVector(side, off * (1 - k)); const w = 0.15 * K * (T >= 3 ? 1.3 : 1);
        head.p(_a).along(dir).s(w, 0.5 * K, w).a(1); shaft.p(_a.x - dir.x * 0.8 * K, _a.y - dir.y * 0.8 * K, _a.z - dir.z * 0.8 * K).along(dir).s(w * 0.3, 0.8 * K, w * 0.3).a(0.9);
        tr.forEach((s, i) => { const kk = k - (i + 1) * 0.04; if (kk < 0) { s.a(0); return; } lerpP(A, B, kk, _b); _b.addScaledVector(side, off * (1 - kk)); s.p(_b).s(0.4 * K).a(0.7 - i * 0.08); }); }; });
    impact(C, dur + 0.05, 0.9, false);
    const nq = T >= 3 ? 3 : 1; fx(0.9, dur, E => { const qs = []; for (let i = 0; i < nq; i++) qs.push(E.spr("q", i % 2 ? col[1] : col[2])); const sp = nq > 1 ? E.spr("star", col[3]) : NIL;
      return k => { qs.forEach((q, i) => { const an = i / nq * PI * 2 + k * 5, r = nq > 1 ? 1.1 : 0; q.p(Tg.x + Math.cos(an) * r, 2.4 + Math.sin(k * 14 + i) * 0.12 + k * 0.2, Tg.z + Math.sin(an) * r).s((1.1 + 0.25 * T) * K).a(k < 0.8 ? 1 : (1 - k) / 0.2); }); sp.p(Tg.x, 1, Tg.z).s(2.5 * K).a(0.5 * (1 - k)); }; });
    if (T >= 3) orbit(Tg, col[3], 8, 1.4, 1, 1.5, 0.9, dur, 0.4, "star");
  };
  SK.riddle_trap = C => {   // lưới nhện ánh sáng trên đất, vùng trói chân
    const { T, Tg, col, rad, k: K } = C, r = rad * (0.85 + 0.1 * T), spokes = 5 + T * 2;
    fx(1.05, 0, E => { const sp = [], rg = []; for (let i = 0; i < spokes; i++) sp.push(E.mesh("box", col[T === 3 ? 3 : 0], true)); for (let i = 0; i < T + 1; i++) rg.push(E.mesh("ring", col[i % 2 ? 1 : 2], true)); const nodes = []; if (T >= 2) for (let i = 0; i < spokes; i++) nodes.push(E.spr("glow", col[2]));
      const cen = E.spr("glow", col[1]);
      return k => { const e = Math.min(1, k * 4), f = k > 0.7 ? (1 - k) / 0.3 : 1, rot = k * (T >= 3 ? 1.2 : 0.3);
        sp.forEach((s, i) => { const an = i / spokes * PI * 2 + rot; _a.set(Tg.x, 0.15, Tg.z); _b.set(Tg.x + Math.cos(an) * r * e, 0.15, Tg.z + Math.sin(an) * r * e); seg(s, _a, _b, 0.07 * K).a(0.9 * f); });
        rg.forEach((m, i) => m.p(Tg.x, 0.14, Tg.z).s(r * e * (i + 1) / (T + 1)).a(0.9 * f)); nodes.forEach((n, i) => { const an = i / spokes * PI * 2 + rot; n.p(Tg.x + Math.cos(an) * r * e, 0.3 + Math.sin(k * 10 + i) * 0.1, Tg.z + Math.sin(an) * r * e).s(0.5).a(f); });
        cen.p(Tg.x, 0.7, Tg.z).s(2 * K).a(0.6 * f); }; });
    flash(C.B, col[2], 2.5, 0.3, 0); if (T >= 3) { risers(Tg, col[3], 10, r * 0.6, 4, 0.6, 1, 0, 0.5, "star"); shake(0.2); pillar(Tg, col[3], 5, r * 0.5, 0.7, 0.1); orbit(Tg, col[2], 3, r * 0.7, 1.4, 1, 1, 0.1, 0.9, "q"); }
    else if (T === 2) risers(Tg, col[1], 8, r * 0.5, 2.5, 0.5, 0.9, 0.1, 0.4, "glow");
  };
  SK.freeze_note = C => {   // mảnh băng → tinh thể → bậc 5: ngôi sao băng lớn rơi xuống
    const { T, A, B, Tg, dir, col, k: K } = C;
    if (T < 3) {
      const dur = 0.2 + A.distanceTo(B) * 0.014;
      fx(dur, 0, E => { const sh = E.mesh("oct", col[2], false), tr = []; for (let i = 0; i < T * 2; i++) tr.push(E.spr("snow", col[1])); return k => { lerpP(A, B, k, _a); sh.p(_a).s(0.2 * K, 0.2 * K, 0.5 * K).along(dir).a(1); tr.forEach((s, i) => { const kk = k - (i + 1) * 0.05; if (kk < 0) { s.a(0); return; } lerpP(A, B, kk, _b); s.p(_b).s(0.5 * K).a(0.8 - i * 0.1); }); }; });
      fx(1.1, dur, E => { const sp = []; for (let i = 0; i < 2 + T * 2; i++) sp.push(E.mesh("cone", i % 2 ? col[2] : col[0], false)); const g = E.mesh("cone", col[1], true);
        return k => { const e = Math.min(1, k * 5), f = k > 0.75 ? (1 - k) / 0.25 : 1; sp.forEach((s, i) => { const an = i / sp.length * PI * 2, tilt = 0.5 + (i % 2) * 0.25; s.p(Tg.x + Math.cos(an) * 0.25, 0, Tg.z + Math.sin(an) * 0.25).along(_a.set(Math.cos(an) * tilt, 1, Math.sin(an) * tilt).normalize()).s(0.28 * K, (1.4 + (i % 2) * 0.8) * K * e, 0.28 * K).a(0.85 * f); }); g.p(Tg.x, 0, Tg.z).s(1.1 * K, 2.2 * K * e, 1.1 * K).a(0.25 * f); }; });
      impact(C, dur, 1.0, false); if (T === 2) risers(Tg, col[2], 8, 1.0, 3, 0.8, 1, dur, 0.4, "snow", true);
    } else {   // sao băng: đuôi sao chổi chéo từ trời
      const dd = _d.set(0.5, 1, 0.3).normalize().clone();
      fx(0.55, 0, E => { const star = E.spr("star", col[2]), halo = E.spr("glow", col[1]), tail = []; for (let i = 0; i < 14; i++) tail.push(E.spr(i % 3 === 0 ? "star" : "glow", i % 2 ? col[1] : col[3]));
        return k => { const f = k * k; _a.set(Tg.x + dd.x * 12 * (1 - f), 1 + 12 * (1 - f), Tg.z + dd.z * 12 * (1 - f)); star.p(_a).s(2.0 * K).a(1); star.rz(k * 6); halo.p(_a).s(3.2 * K).a(0.6);
          tail.forEach((s, i) => { const kk = Math.max(0, k - i * 0.022), ff = kk * kk; s.p(Tg.x + dd.x * 12 * (1 - ff) + R(-0.15, 0.15), 1 + 12 * (1 - ff), Tg.z + dd.z * 12 * (1 - ff)).s((1.7 - i * 0.1) * K).a(kk > 0 ? 0.7 - i * 0.04 : 0); }); }; });
      impact(C, 0.5, 1.6, true); shake(0.4); ringWave(Tg, col[1], 5 * K, 0.8, 0.5);
      fx(1.1, 0.5, E => { const sp = []; for (let i = 0; i < 9; i++) sp.push(E.mesh("cone", i % 2 ? col[2] : col[1], false)); const sn = []; for (let i = 0; i < 6; i++) sn.push(E.spr("snow", col[2]));
        return k => { const e = Math.min(1, k * 6), f = k > 0.7 ? (1 - k) / 0.3 : 1; sp.forEach((s, i) => { const an = i / 9 * PI * 2, r = 0.5 + (i % 3) * 0.6; s.p(Tg.x + Math.cos(an) * r, 0, Tg.z + Math.sin(an) * r).along(_a.set(Math.cos(an) * 0.3, 1, Math.sin(an) * 0.3).normalize()).s(0.35 * K, (1.5 + (i % 3) * 1.2) * K * e, 0.35 * K).a(0.9 * f); });
          sn.forEach((s, i) => s.p(Tg.x + Math.cos(i * 1.7) * 2, 4 * (1 - k) + 0.5, Tg.z + Math.sin(i * 1.7) * 2).s(0.6).a(f).rz(k * 4)); }; });
    }
  };
  SK.silence_bubble = C => {   // bong bóng khoá miệng
    const { T, Tg, col, k: K } = C, r = (0.9 + 0.2 * T) * K;
    flash(C.B, col[2], 2, 0.3, 0);
    fx(1.0, 0.05, E => { const b1 = E.mesh("sph", col[1], true), b2 = T >= 3 ? E.mesh("sph", col[3], true) : NIL, hl = E.spr("glow", col[2]);
      return k => { const e = Math.min(1, k * 5), f = k > 0.75 ? (1 - k) / 0.25 : 1, w = 1 + Math.sin(k * 24) * 0.04; b1.p(Tg.x, 1, Tg.z).s(r * e * w, r * e / w, r * e * w).a(0.3 * f); b2.p(Tg.x, 1, Tg.z).s(r * 1.35 * e / w, r * 1.35 * e * w, r * 1.35 * e / w).a(0.2 * f); hl.p(Tg.x + r * 0.35, 1.5 + r * 0.2, Tg.z).s(0.5 * K).a(0.9 * f); }; });
    risers(Tg, col[2], 4 + T * 3, r * 0.8, 2.6, 0.5, 1, 0.1, 0.32 * K, "glow"); ringWave(Tg, col[0], r * 2, 0.5, 0.05);
    if (T >= 2) burst(C.B, col[2], 8, 3, 0.25, 0.6, 0.05, "star", 2); if (T >= 3) { shake(0.2); orbit(Tg, col[3], 6, r * 1.2, 1, 1, 1, 0.1, 0.5, "star"); ringWave(Tg, col[3], r * 3, 0.7, 0.2); }
  };
  SK.slow_song = C => {   // sóng ngân chậm quanh mình, hạt tuyết / nốt nhạc rơi
    const { T, F, col, rad, k: K } = C, r = Math.min(rad, 5) * (0.9 + 0.05 * T);
    fx(1.1, 0, E => { const g = E.mesh("disc", col[0], true), rs = []; for (let i = 0; i < T; i++) rs.push(E.mesh("ring", i % 2 ? col[1] : col[2], true));
      const hands = T >= 3 ? [E.mesh("box", col[2], true), E.mesh("box", col[3], true)] : [];
      return k => { g.p(F.x, 0.08, F.z).s(r * Math.min(1, k * 3)).a(0.2 * (1 - k)); rs.forEach((m, i) => { const kk = clamp(k - i * 0.12, 0, 1); m.p(F.x, 0.12, F.z).s(r * Math.sqrt(kk) + 0.2).a(0.9 * (1 - kk)); });
        hands.forEach((h, i) => { const an = -k * (i ? 2 : 14) + PI / 2; _a.set(F.x, 0.2, F.z); _b.set(F.x + Math.cos(an) * r * (i ? 0.6 : 0.85), 0.2, F.z + Math.sin(an) * r * (i ? 0.6 : 0.85)); seg(h, _a, _b, 0.18).a(0.9 * (1 - k * k)); }); }; });
    risers(F, col[2], 6 + T * 3, r * 0.6, 3.2, 0.4, 1.1, 0, 0.55 * K, T >= 2 ? ["snow", "note", "snow", "note2"] : "snow", true);
    if (T >= 2) ringWave(F, col[2], r * 1.05, 1, 0.2); if (T >= 3) { orbit(F, col[3], 10, r * 0.7, 0.9, 0.5, 1.1, 0, 0.5, "star", true); shake(0.2); }
  };
  SK.mirror_ask = C => {   // gương kéo quái lại gần nhau
    const { T, Tg, col, rad, k: K } = C, r = rad * (0.85 + 0.05 * T), nm = T === 1 ? 2 : T === 2 ? 4 : 6;
    ringWave(Tg, col[0], r, 0.6, 0); if (T >= 2) ringWave(Tg, col[1], r * 0.7, 0.6, 0.15);
    fx(1.0, 0, E => { const ms = [], bm = []; for (let i = 0; i < nm; i++) { ms.push(E.mesh("box", col[2], true)); if (T >= 3) bm.push(E.mesh("box", col[3], true)); } const cen = E.spr("glow", col[1]), sp = [], nsp = 6 + T * 2; for (let i = 0; i < nsp; i++) sp.push(E.spr("star", col[2]));
      return k => { const f = k > 0.7 ? (1 - k) / 0.3 : 1, rr = r * (1 - 0.55 * Math.min(1, k * 1.6)), rot = k * (1 + T);
        ms.forEach((m, i) => { const an = i / nm * PI * 2 + rot; _a.set(Tg.x + Math.cos(an) * rr, 0.1, Tg.z + Math.sin(an) * rr); _b.set(_a.x, 2.6, _a.z); seg(m, _a, _b, 0.12).a(0.55 * f); m.o.scale.x = 1.0 * K; m.o.scale.z = 0.12;
          m.o.quaternion.setFromAxisAngle(UP, -an + PI / 2); if (bm[i]) seg(bm[i], _a.set(_a.x, 1.3, _a.z), _b.set(Tg.x, 1.3, Tg.z), 0.07).a(0.5 * f * Math.abs(Math.sin(k * 12 + i))); });
        sp.forEach((s, i) => { const u = (k * 1.8 + i / nsp) % 1, an = i * 2.4; s.p(Tg.x + Math.cos(an) * r * (1 - u), 0.5 + Math.sin(i) * 0.4, Tg.z + Math.sin(an) * r * (1 - u)).s(0.4).a(f * Math.sin(u * PI)); });
        cen.p(Tg.x, 1, Tg.z).s((1.5 + k * 2) * K).a(0.5 * f); }; });
    if (T >= 3) { shake(0.25); flash(Tg, col[2], 5, 0.4, 0.5, 1, "star"); }
  };
  SK.silence_zone = C => {   // TUYỆT CHIÊU: vòm im lặng tím-xanh phủ cả cụm
    const { F, col, k: K } = C, r = Math.min(C.rad, 8);
    flash(F.clone().setY(1), col[2], 4, 0.4, 0, undefined, "star"); ringWave(F, col[3], r * 1.1, 1.0, 0); ringWave(F, col[1], r * 0.8, 1.0, 0.15); ringWave(F, col[2], r * 0.5, 0.9, 0.3);
    fx(1.8, 0.1, E => { const d1 = E.mesh("sph", col[0], true), d2 = E.mesh("sph", col[3], true), gr = E.mesh("disc", col[3], true), stars = []; for (let i = 0; i < 12; i++) stars.push(E.spr("star", i % 2 ? col[2] : col[1]));
      return k => { const e = Math.min(1, k * 3), f = k > 0.75 ? (1 - k) / 0.25 : 1; d1.p(F.x, 0, F.z).s(r * e).a(0.22 * f); d2.p(F.x, 0, F.z).s(r * 0.75 * e).a(0.18 * f); gr.p(F.x, 0.06, F.z).s(r * e).a(0.3 * f);
        stars.forEach((s, i) => { const an = i * 2.4 + k * 1.5, rr = r * (0.2 + 0.7 * ((i * 0.37) % 1)); s.p(F.x + Math.cos(an) * rr, 7 * (1 - ((k * 1.3 + i / 12) % 1)) + 0.5, F.z + Math.sin(an) * rr).s(0.7).a(f); }); }; });
    pillar(F, col[2], 14, 1.2, 1.0, 0.1); shake(0.6); burst(F.clone().setY(1), col[2], 14, 8, 0.4, 0.9, 0.1, "star", 2); orbit(F, col[1], 12, r * 0.6, 1.2, 0.7, 1.6, 0.2, 0.6, "snow", true);
  };
  /* 💚 HARMONY (lên bản thân) */
  SK.harmony_heal = C => {   // vòng xanh bay lên → thêm nốt nhạc + xoắn → bậc 5 cánh hoa vàng, hồi cả đội
    const { T, F, col, k: K } = C;
    fx(0.9, 0, E => { const rs = []; for (let i = 0; i < T; i++) rs.push(E.mesh("ring", i % 2 ? col[1] : col[0], true)); const g = E.mesh("cyl", col[1], true);
      return k => { rs.forEach((m, i) => { const kk = clamp(k - i * 0.12, 0, 1); m.p(F.x, 0.1 + kk * 2.2, F.z).s(0.9 * K * (1 - kk * 0.25)).a(Math.sin(kk * PI)); }); g.p(F.x, 0, F.z).s(0.8 * K, 2.4 * K, 0.8 * K).a(0.2 * Math.sin(k * PI)); }; });
    flash(F, col[1], 2.2 * K, 0.5, 0, 1); risers(F, col[2], 5 + T * 3, 0.8 * K, 2.8, 0.8, 0.9, 0, 0.35 * K, T >= 3 ? "petal" : T === 2 ? ["note", "star", "note2"] : "star");
    if (T >= 2) { risers(F, col[0], 6, 0.5, 2.2, -0.6, 0.9, 0.1, 0.5 * K, "glow"); ringWave(F, col[1], 2.2, 0.7, 0.1); }
    if (T >= 3) { ringWave(F, col[0], 5, 0.9, 0); ringWave(F, col[2], 3.5, 0.9, 0.15); pillar(F, col[1], 5, 1.1, 0.8, 0); risers(F, [col[0], col[3], col[1]], 12, 2.2, 4, 0.4, 1.1, 0.1, 0.7, "petal", true); shake(0.2); orbit(F, col[2], 6, 1.3, 1.4, 1, 0.9, 0, 0.5, "star"); }
  };
  SK.chord_shield = C => {   // khiên: 1 vỏ → vòm + sao quanh → vỏ vàng 2 lớp xoay + nốt nhạc
    const { T, F, col, k: K } = C;
    fx(1.15, 0, E => { const s1 = E.mesh("sph", col[0], true), s2 = T >= 2 ? E.mesh("sph", col[1], true) : NIL, s3 = T >= 3 ? E.mesh("sph", col[3], true) : NIL, rr = [E.mesh("ring", col[2], true)]; if (T >= 3) rr.push(E.mesh("vring", col[2], true));
      return k => { const e = Math.min(1, k * 5), f = k > 0.7 ? (1 - k) / 0.3 : 1, w = 0.85 + 0.15 * Math.sin(k * 25); s1.p(F.x, 1, F.z).s(1.1 * K * e).a(0.28 * f * w); s2.p(F.x, 1, F.z).s(1.3 * K * e).a(0.2 * f); s3.p(F.x, 1, F.z).s(1.5 * K * e).a(0.2 * f);
        rr[0].p(F.x, 0.12, F.z).s(1.3 * K * e).a(f); if (rr[1]) rr[1].p(F.x, 1, F.z).s(1.5 * K).a(0.8 * f).o.rotation.set(0, k * 5, 0); }; });
    flash(F, col[2], 3, 0.35, 0, 1); if (T >= 2) orbit(F, col[2], 6, 1.4, 1, 1.2, 1.1, 0, 0.45, "star"); if (T >= 3) { orbit(F, col[1], 5, 1.6, 1.3, -1, 1.1, 0, 0.55, ["note", "note2"]); shake(0.2); burst(F, col[2], 10, 4, 0.3, 0.7, 0, "star", 1, 1); }
  };
  SK.courage_chant = C => {   // khí thế bừng cháy: tia lửa → vòng lửa → cánh lửa vàng
    const { T, F, col, k: K } = C, wcol = [0xff9a1f, 0xffd43b, 0xfff0a0, 0xff3b1f];
    const c2 = T >= 3 ? [0xffd43b, 0xff9a1f, 0xffffff, 0xff3b1f] : wcol;
    ringWave(F, c2[0], 2 * K + T * 0.5, 0.6, 0); flash(F, c2[2], 3 * K, 0.4, 0, 1, "star");
    fx(1.0, 0, E => { const fl = []; for (let i = 0; i < 3 + T * 2; i++) fl.push(E.mesh("cone", i % 2 ? c2[0] : c2[1], true)); const wings = T >= 3 ? [E.mesh("cone", c2[1], true), E.mesh("cone", c2[1], true), E.mesh("cone", c2[0], true), E.mesh("cone", c2[0], true)] : [];
      return k => { const e = Math.min(1, k * 4), f = k > 0.7 ? (1 - k) / 0.3 : 1; fl.forEach((m, i) => { const an = i / fl.length * PI * 2 + k * 2, r = 0.8 * K; m.p(F.x + Math.cos(an) * r, 0, F.z + Math.sin(an) * r).s(0.3 * K, (1.2 + 0.4 * Math.sin(k * 20 + i * 2)) * K * e, 0.3 * K).a(0.8 * f); });
        wings.forEach((w, i) => { const sd = i % 2 ? 1 : -1, up = i < 2 ? 0.5 : 0.1; w.p(F.x + sd * 0.4, 1.3, F.z - 0.2).along(_a.set(sd * 1.2, up + 0.6 + 0.2 * Math.sin(k * 14), -0.5).normalize()).s(0.3, 2.4 * e, 0.3).a(0.85 * f); }); }; });
    risers(F, [c2[1], c2[0], c2[2]], 6 + T * 3, 0.8 * K, 3.2, 0.6, 0.9, 0.4 * K, "glow"); if (T >= 2) burst(F, c2[1], 10, 4, 0.3, 0.7, 0, "star", 3, 1);
    if (T >= 3) { pillar(F, c2[1], 7, 1.2, 0.8, 0); shake(0.25); ringWave(F, c2[3], 5, 0.8, 0.1); }
  };
  SK.tempo_up = C => {   // tăng tốc: vạch tốc độ → đồng hồ xoay → 2 đồng hồ vàng, bóng mờ
    const { T, F, col, k: K } = C;
    fx(1.0, 0, E => { const lines = [], hands = []; for (let i = 0; i < 6 + T * 3; i++) lines.push(E.mesh("box", i % 2 ? col[1] : col[2], true)); const rg = [E.mesh("ring", col[0], true)]; if (T >= 2) { hands.push(E.mesh("box", col[2], true), E.mesh("box", col[1], true)); } if (T >= 3) { rg.push(E.mesh("ring", col[1], true)); hands.push(E.mesh("box", col[2], true), E.mesh("box", col[1], true)); }
      return k => { const f = Math.sin(k * PI); lines.forEach((m, i) => { const an = i * 2.4, r = 0.7 + (i % 3) * 0.25, y = ((k * 1.8 + i * 0.17) % 1) * 2.6; m.p(F.x + Math.cos(an) * r, y, F.z + Math.sin(an) * r).along(UP).s(0.05, 0.6 * K, 0.05).a(0.8 * f); });
        rg[0].p(F.x, 0.1, F.z).s(1.3 * K + k * 0.8).a(f); if (rg[1]) rg[1].p(F.x, 0.14, F.z).s(2.2 * K - k * 0.6).a(f * 0.8);
        hands.forEach((h, i) => { const big = i % 2 === 0, an = -k * (big ? 14 : 3) * (i > 1 ? -1 : 1), rr = (i > 1 ? 2.0 : 1.2) * K * (big ? 1 : 0.65); _a.set(F.x, 0.2, F.z); _b.set(F.x + Math.cos(an) * rr, 0.2, F.z + Math.sin(an) * rr); seg(h, _a, _b, 0.09).a(f); }); }; });
    flash(F, col[2], 2.5, 0.4, 0, 1); if (T >= 2) risers(F, col[1], 6, 1, 2.6, 1.5, 0.9, 0, 0.45 * K, "star");
    if (T >= 3) { orbit(F, col[2], 6, 1.8, 1, 2, 0.9, 0, 0.5, "star"); shake(0.2); burst(F, col[1], 10, 5, 0.3, 0.7, 0, "glow", 0, 1); }
  };
  SK.mana_song = C => {   // mana chảy vào người
    const { T, F, col, k: K } = C, cy = [0x4dc8ff, 0x9fe6ff, 0xe6faff, 0x34d6c8];
    fx(1.0, 0, E => { const o = [], n = 6 + T * 4; for (let i = 0; i < n; i++) o.push({ it: E.spr(i % 3 === 0 && T >= 2 ? (i % 2 ? "note" : "note2") : "glow", i % 2 ? cy[1] : cy[T >= 3 ? 3 : 0]), a: i * 2.4, ph: (i / n) });
      const g = E.spr("glow", cy[0]);
      return k => { o.forEach(q => { const u = (k * 1.2 + q.ph) % 1, r = 2.8 * (1 - u), y = 0.2 + u * (T >= 3 ? 1.8 : 1.2), an = q.a + u * (T >= 2 ? 5 : 1); q.it.p(F.x + Math.cos(an) * r, y + (1 - u) * 1.5, F.z + Math.sin(an) * r).s((0.3 + 0.25 * u) * K * (T >= 2 ? 1.3 : 1)).a(Math.sin(u * PI)); }); g.p(F.x, 1, F.z).s((1 + k * 1.6) * K).a(0.5 * Math.sin(k * PI)); }; });
    ringWave(F, cy[0], 3, 0.8, 0); if (T >= 2) ringWave(F, cy[1], 2, 0.8, 0.2);
    if (T >= 3) { ringWave(F, cy[3], 4, 0.9, 0.35); pillar(F, cy[1], 5, 1, 0.8, 0.5); flash(F, 0xffffff, 3.5, 0.4, 0.6, 1, "star"); shake(0.15); }
  };
  SK.cleanse_note = C => {   // gột sạch: sao trắng → sóng quét ra → lông vũ vàng + chớp chữ thập
    const { T, F, col, k: K } = C;
    ringWave(F, col[2], 2.5 + T, 0.6, 0); if (T >= 2) ringWave(F, col[1], 3.5 + T, 0.7, 0.15); if (T >= 3) { ringWave(F, col[0], 6, 0.9, 0.1); ringWave(F, col[2], 4.5, 0.9, 0.3); pillar(F, col[2], 6, 1.2, 0.8, 0); shake(0.2); }
    flash(F, col[2], 2.2 * K, 0.5, 0, 1, "star"); risers(F, col[2], 5 + T * 3, 1.0 * K, 3, 0.9, 1.0, 0, 0.4 * K, T >= 3 ? ["petal", "star"] : "star");
    if (T >= 2) burst(F, col[1], 8, 4, 0.25, 0.8, 0.1, "star", -1, 1);
    if (T >= 3) fx(0.8, 0.2, E => { const a = E.spr("star", col[2]), b = E.spr("star", col[1]); return k => { a.p(F.x, 1.2, F.z).s(5.5 * Math.sin(k * PI)).a(1).rz(k * 2); b.p(F.x, 1.2, F.z).s(4 * Math.sin(k * PI)).a(1).rz(-k * 2 + 0.8); }; });
  };
  SK.grand_chorus = C => {   // TUYỆT CHIÊU: cầu vồng 6 vòng, trụ sáng, nốt nhạc + cánh hoa, vòm ánh sáng
    const { F, col } = C;
    RAINBOW.forEach((c, i) => ringWave(F, c, 3 + i * 0.9, 0.7, i * 0.12, 0.1 + i * 0.08)); RAINBOW.forEach((c, i) => fx(1.0, 0.1 + i * 0.1, E => { const m = E.mesh("ring", c, true); return k => m.p(F.x, 0.2 + k * 5, F.z).s(2.6 - i * 0.2 + k * 0.6).a(Math.sin(k * PI)); }));
    pillar(F, 0xffffff, 16, 1.4, 1.2, 0.15); pillar(F, col[1], 12, 2.4, 1.0, 0.1); flash(F, 0xfff6c8, 6, 0.6, 0.1, 1, "star");
    fx(1.7, 0.2, E => { const d = E.mesh("sph", 0xfff0a0, true), d2 = E.mesh("sph", 0xa4f0a0, true); return k => { const e = Math.min(1, k * 3), f = k > 0.7 ? (1 - k) / 0.3 : 1; d.p(F.x, 0, F.z).s(5 * e).a(0.18 * f); d2.p(F.x, 0, F.z).s(3.4 * e).a(0.16 * f); }; });
    risers(F, RAINBOW, 12, 2, 6, 1.2, 1.6, 0.1, 0.9, ["note", "note2"]); risers(F, [0xffd43b, 0xff9ab0, 0xfff6c8, 0xa4f0a0], 12, 3, 7, 0.6, 1.6, 0.3, 0.8, "petal", true);
    orbit(F, RAINBOW, 6, 2.4, 1.2, 1.2, 1.5, 0.2, 0.9, "star"); burst(F, 0xffffff, 14, 8, 0.4, 0.9, 0.2, "star", 2, 1); shake(0.6);
  };
  /* 🔥 RHYTHM */
  SK.drum_roll = C => {   // 3 nhịp trống trúng mục tiêu → thêm lửa + nốt nhạc → trống lửa đỏ vàng, 5 nhịp dồn
    const { T, A, B, Tg, col, k: K } = C, nh = T >= 3 ? 5 : 3;
    fx(0.2 + nh * 0.12, 0, E => { const dr = T >= 3 ? E.mesh("cyl", col[0], false) : NIL, top = T >= 3 ? E.mesh("disc", col[2], false) : NIL, rg = T >= 3 ? E.mesh("ring", col[1], true) : NIL, tr = []; for (let i = 0; i < 4; i++) tr.push(E.spr(T >= 2 ? "note" : "glow", col[1]));
      return k => { const bob = Math.abs(Math.sin(k * nh * PI)); if (T >= 3) { const h = 2.6 - bob * 1.4; dr.p(B.x, h, B.z).s(0.85 * K, 0.5 * K, 0.85 * K).a(1); top.p(B.x, h + 0.5 * K, B.z).s(0.85 * K).a(1); rg.p(B.x, h + 0.5 * K, B.z).s(0.9 * K).a(0.9); }
        tr.forEach((s, i) => { const kk = (k * 1.5 + i * 0.25) % 1; lerpP(A, B, kk, _a, 1.5); s.p(_a).s(0.45 * K).a(Math.sin(kk * PI) * (k < 0.8 ? 1 : 0)); }); }; });
    for (let h = 0; h < nh; h++) { const d = 0.15 + h * 0.12, off = _d.set(R(-0.5, 0.5), 0, R(-0.5, 0.5)).add(Tg).clone(); flash(_a.copy(off).setY(0.9), h % 2 ? col[1] : col[2], (1.3 + 0.2 * T) * K, 0.22, d); ringWave(off, col[h % 2 ? 1 : 0], (1.1 + 0.4 * T) * K, 0.3, d); burst(_b.copy(off).setY(0.8), col[1], 4 + T * 2, 3 + T, 0.25, 0.4, d, T >= 2 ? "star" : "glow", 8); }
    if (T >= 2) risers(Tg, col[3], 6, 0.7, 2, 0.4, 0.6, 0.2, 0.4, "glow"); if (T >= 3) { shake(0.35); fx(0.8, 0.3, E => { const f = []; for (let i = 0; i < 6; i++) f.push(E.mesh("cone", i % 2 ? col[1] : col[0], true)); return k => f.forEach((m, i) => { const an = i / 6 * PI * 2 + k * 3; m.p(Tg.x + Math.cos(an) * 1.2, 0, Tg.z + Math.sin(an) * 1.2).s(0.3, 1.6 * Math.sin(k * PI), 0.3).a(0.85 * (1 - k * 0.5)); }); }); }
  };
  SK.shock_wave = C => {   // sóng tròn → 2 sóng + bụi → bậc 5: lốc lửa hút quái vào giữa
    const { T, F, col, rad, k: K } = C, r = Math.min(rad, 5) * 0.95;
    if (T < 3) {
      ringWave(F, col[0], r, 0.55, 0, 0.12, 0.5); flash(F, col[2], 3 * K, 0.3, 0, 0.6); burst(F, col[1], 6 + T * 5, 5 + r * 0.4, 0.3, 0.5, 0, "glow", 8, 0.3);
      if (T >= 2) { ringWave(F, col[1], r * 0.8, 0.6, 0.12); ringWave(F, col[2], r * 1.1, 0.7, 0.2); fx(0.7, 0.05, E => { const g = E.mesh("disc", col[0], true); return k => g.p(F.x, 0.08, F.z).s(r * Math.sqrt(k)).a(0.25 * (1 - k)); }); }
    } else {   // lốc lửa
      fx(1.0, 0, E => { const cones = [], fl = []; for (let i = 0; i < 5; i++) cones.push(E.mesh("ring", i % 2 ? col[1] : col[0], true)); for (let i = 0; i < 14; i++) fl.push(E.spr("glow", i % 3 ? col[1] : col[2])); const col2 = E.mesh("cyl", col[0], true);
        return k => { const e = Math.min(1, k * 4), f = k > 0.75 ? (1 - k) / 0.25 : 1; cones.forEach((m, i) => { const h = 0.4 + i * 0.95; m.p(F.x + Math.sin(k * 6 + i) * 0.2, h, F.z).s((0.9 + i * 0.5) * K * e).a(0.8 * f); m.o.rotation.y = k * 9 + i; });
          fl.forEach((s, i) => { const u = (k * 1.6 + i / 14) % 1, an = i * 1.1 + k * 12, rr = (0.6 + u * 2.4) * K; s.p(F.x + Math.cos(an) * rr, 0.3 + u * 4.2, F.z + Math.sin(an) * rr).s((1.1 - u * 0.5) * K).a(f * Math.sin(u * PI) * 0.9); }); col2.p(F.x, 0, F.z).s(0.45 * K, 2.6 * e, 0.45 * K).a(0.25 * f); }; });
      ringWave(F, col[0], r, 0.7, 0, 0.12, 0.5); ringWave(F, col[1], r * 1.1, 0.8, 0.12); fx(0.9, 0.1, E => { const s = []; for (let i = 0; i < 10; i++) s.push(E.spr("star", col[2])); return k => s.forEach((m, i) => { const an = i * 0.63 + k * 3, rr = r * (1 - k) + 0.5; m.p(F.x + Math.cos(an) * rr, 0.6 + Math.sin(i) * 0.3, F.z + Math.sin(an) * rr).s(0.55).a(Math.sin(k * PI)); }); });   // hạt hút vào tâm
      shake(0.45);
    }
  };
  SK.beat_dash = C => {   // lướt: vệt sáng + nổ → ảnh mờ + lửa → bậc 5: phượng hoàng lửa
    const { T, A, B, Tg, dir, col, k: K } = C, dur = 0.22 + A.distanceTo(B) * 0.01, side = _c.crossVectors(dir, UP).normalize().clone();
    fx(dur + 0.2, 0, E => { const st = E.mesh("box", col[1], true), st2 = E.mesh("box", col[2], true), gh = []; for (let i = 0; i < (T === 1 ? 0 : T * 2 + 1); i++) gh.push(E.spr("glow", i % 2 ? col[1] : col[0]));
      const wings = T >= 3 ? [E.mesh("cone", col[2], true), E.mesh("cone", col[1], true), E.mesh("cone", col[2], true), E.mesh("cone", col[1], true)] : [], core = E.spr("glow", col[2]);
      return k => { const f = Math.min(1, k * (dur + 0.2) / dur), fa = 1 - Math.max(0, (k * (dur + 0.2) - dur) / 0.2); lerpP(A, B, f, _a); _b.copy(A); seg(st, _b, _a, (0.35 + 0.1 * T) * K).a(0.55 * fa); seg(st2, _b, _a, 0.12 * K).a(fa); core.p(_a).s(1.8 * K).a(fa);
        gh.forEach((g, i) => { const kk = f - (i + 1) * 0.06; if (kk < 0) { g.a(0); return; } lerpP(A, B, kk, _b); g.p(_b.x + Math.sin(i * 7) * 0.2, _b.y + 0.2 * Math.sin(i * 3 + 1), _b.z).s((1.2 - i * 0.07) * K).a(0.7 * (1 - i / gh.length) * fa); });
        wings.forEach((w, i) => { const sd = i % 2 ? 1 : -1, lo = i > 1 ? 0.2 : 0.7; w.p(_a).along(_d.copy(dir).multiplyScalar(-1.2).addScaledVector(side, sd * 1.4).addScaledVector(UP, lo).normalize()).s(0.35, (2.6 - (i > 1 ? 0.8 : 0)) * K, 0.35).a(0.8 * fa); }); }; });
    impact(C, dur, 1.2, T >= 3); ringWave(Tg, col[0], (C.rad || 3) * K, 0.5, dur); if (T >= 2) burst(C.B, col[1], 10, 6, 0.35, 0.6, dur, "star", 6);
    if (T >= 3) { shake(0.4); pillar(Tg, col[1], 4, 0.7, 0.6, dur); risers(Tg, col[2], 6, 1.3, 3, 1, 0.8, dur, 0.5, "glow"); }
  };
  SK.echo_rain = C => {   // mưa âm thanh: giọt sáng → nhiều giọt + nốt → sao băng lửa
    const { T, Tg, col, rad, k: K } = C, r = rad * 0.9, nd = T === 1 ? 8 : T === 2 ? 11 : 13;
    ringWave(Tg, col[1], r, 0.8, 0, 0.1, r * 0.5); fx(1.0, 0, E => { const g = E.mesh("disc", col[0], true); return k => g.p(Tg.x, 0.07, Tg.z).s(r).a(0.2 * Math.sin(k * PI)); });
    for (let i = 0; i < nd; i++) { const d = i * (0.5 / nd) + R(0, 0.1), a = R(0, PI * 2), rr = Math.sqrt(R(0.05, 1)) * r, X = Tg.x + Math.cos(a) * rr, Z = Tg.z + Math.sin(a) * rr;
      fx(0.45, d, E => { const dr = E.mesh("box", T >= 3 ? col[2] : col[1], true), hd = T >= 2 ? E.spr(i % 2 && T === 2 ? "note" : "glow", col[2]) : NIL, ring = E.mesh("ring", col[0], true);
        return k => { const f = Math.min(1, k / 0.55), y = 7 * (1 - f * f); if (f < 1) { dr.p(X, y, Z).along(UP).s(0.07 * K * (T >= 3 ? 1.8 : 1), (1.3 + 0.7 * T) * K, 0.07 * K * (T >= 3 ? 1.8 : 1)).a(0.9); hd.p(X, y, Z).s((0.5 + 0.1 * T) * K).a(1); ring.s(0); } else { const kk = (k - 0.55) / 0.45; dr.a(0); hd.p(X, 0.5, Z).s(0.9 * K * (1 - kk)).a(1 - kk); ring.p(X, 0.1, Z).s(0.3 + kk * (0.9 + 0.3 * T) * K).a(1 - kk); } }; });
      if (T >= 3 && i % 3 === 0) burst(_a.set(X, 0.4, Z), col[1], 4, 3, 0.3, 0.4, d + 0.25, "star", 6); }
    if (T >= 3) shake(0.3);
  };
  SK.spin_beat = C => {   // xoay tròn 3 vòng: cánh cung → 3 vòng → lốc lửa xoắn
    const { T, F, col, rad, k: K } = C, r = Math.min(rad, 4.5);
    fx(1.0, 0, E => { const arms = [], fl = [], na = T === 1 ? 3 : T === 2 ? 5 : 4; for (let i = 0; i < na; i++) arms.push(E.mesh("box", i % 2 ? col[1] : col[0], true)); const rg = E.mesh("ring", col[1], true); if (T >= 3) for (let i = 0; i < 16; i++) fl.push(E.spr(i % 3 ? "glow" : "star", i % 2 ? col[1] : col[2]));
      return k => { const f = k > 0.75 ? (1 - k) / 0.25 : 1, rot = k * PI * 2 * 3, e = Math.min(1, k * 5); rg.p(F.x, 0.12, F.z).s(r * e).a(0.6 * f);
        arms.forEach((m, i) => { const an = rot + i / arms.length * PI * 2, rr = r * e * (T === 2 ? 0.7 + 0.3 * (i % 2) : 1); _a.set(F.x, 0.6 + i * (T === 2 ? 0.25 : 0.1), F.z); _b.set(F.x + Math.cos(an) * rr, _a.y, F.z + Math.sin(an) * rr); seg(m, _a, _b, 0.16 * K).a(0.8 * f); });
        fl.forEach((s, i) => { const u = i / fl.length, an = rot * 1.3 + u * PI * 6, rr = (0.8 + u * (r - 0.8)) * e; s.p(F.x + Math.cos(an) * rr, 0.3 + u * 3.2, F.z + Math.sin(an) * rr).s(0.9 - u * 0.4).a(f * 0.9); }); }; });
    flash(F, col[2], 3 * K, 0.4, 0, 1); burst(F, col[1], 6 + T * 4, 5, 0.3, 0.6, 0, "glow", 5, 0.5); if (T >= 2) ringWave(F, col[0], r, 0.6, 0.1); if (T >= 3) { shake(0.35); ringWave(F, col[2], r * 1.2, 0.8, 0.3); pillar(F, col[0], 5, 1.2, 0.7, 0.1); }
  };
  SK.chain_beat = C => {   // nhịp nảy: dây sáng nối các điểm quanh mục tiêu
    const { T, A, B, Tg, col, k: K } = C, nh = T >= 3 ? 5 : T === 2 ? 4 : 3, pts = [A.clone()], rad = C.rad || 3;
    for (let i = 0; i < nh; i++) pts.push(i === 0 ? B.clone() : new V3(Tg.x + R(-rad, rad), 0.9, Tg.z + R(-rad, rad)));
    const hop = 0.17;
    fx(hop * nh + 0.35, 0, E => { const links = [], orb = E.spr("glow", col[2]), halo = E.spr("glow", col[0]); for (let i = 0; i < nh; i++) links.push(E.mesh("box", i % 2 ? col[1] : col[2], true));
      return k => { const t = k * (hop * nh + 0.35), cur = t / hop, fa = 1 - Math.max(0, (t - hop * nh) / 0.35); links.forEach((l, i) => { const u = clamp(cur - i, 0, 1); if (u <= 0) { l.a(0); return; } _a.copy(pts[i]); _b.lerpVectors(pts[i], pts[i + 1], u); _b.y += Math.sin(u * PI) * 0.6; seg(l, _a, _b, (0.12 + 0.03 * T) * K * (1 - Math.max(0, cur - i - 1) * 0.1)).a(fa * 0.9); });
        const ci = Math.min(nh - 1, Math.floor(cur)); lerpP(pts[ci], pts[ci + 1], clamp(cur - ci, 0, 1), _a, 0.6); orb.p(_a).s((1 + 0.2 * T) * K).a(fa); halo.p(_a).s(1.9 * K).a(0.5 * fa); }; });
    for (let i = 1; i <= nh; i++) { const d = i * hop; flash(pts[i], col[2], (1.2 + 0.2 * T) * K, 0.25, d); ringWave(_a.set(pts[i].x, 0, pts[i].z), col[i % 2], (1 + 0.3 * T) * K, 0.35, d); burst(pts[i], col[1], 3 + T * 2, 3, 0.25, 0.4, d, T >= 3 ? "star" : "glow", 6); }
    if (T >= 3) { shake(0.3); risers(Tg, col[2], 6, 1, 3, 1, 0.8, hop * nh, 0.5, "star"); }
  };
  SK.festival_frenzy = C => {   // TUYỆT CHIÊU: 4 đợt pháo hoa nhiều màu phủ cả vùng
    const { F, Tg, col } = C, r = Math.min(C.rad, 9), cs = [0xff4d6a, 0xffd43b, 0x4dc8ff, 0xa4f06a, 0xff9a3a, 0xc78bff];
    ringWave(F, col[0], r, 0.9, 0); ringWave(F, col[1], r * 0.6, 0.9, 0.15); flash(F, col[2], 5, 0.5, 0, 1, "star"); pillar(F, col[1], 8, 1.2, 0.6, 0);
    for (let w = 0; w < 4; w++) for (let n = 0; n < 3; n++) {
      const an = R(0, PI * 2), rr = Math.sqrt(R(0.1, 1)) * r, X = F.x + Math.cos(an) * rr, Z = F.z + Math.sin(an) * rr, d = 0.15 + w * 0.38 + n * 0.07, hgt = R(5, 7.5), c = cs[(w * 3 + n) % cs.length], c2 = cs[(w * 3 + n + 2) % cs.length];
      fx(0.9, d, E => { const rk = E.spr("glow", 0xffe27a), sp = []; for (let i = 0; i < 8; i++) sp.push(E.spr(i % 2 ? "star" : "glow", i % 2 ? c2 : c)); const cen = E.spr("star", 0xffffff);
        return k => { if (k < 0.3) { const u = k / 0.3; rk.p(X, 0.3 + (hgt - 0.3) * u, Z).s(0.55).a(1); sp.forEach(s => s.a(0)); cen.a(0); } else { const t = (k - 0.3) / 0.7; rk.a(0); sp.forEach((s, i) => { const a2 = i / 8 * PI * 2 + n, sp2 = (i % 2 ? 1.5 : 2.6) * t * 3; s.p(X + Math.cos(a2) * sp2, hgt + Math.sin(a2) * sp2 - 1.5 * t * t, Z).s((i % 2 ? 0.8 : 0.9) * (1 - t * 0.5)).a(1 - t * t); }); cen.p(X, hgt, Z).s(2.6 * (1 - t)).a(1 - t); } }; });
    }
    risers(F, cs, 10, r * 0.5, 4, 0.6, 1.5, 0.2, 0.5, "star", true); shake(0.5);
  };

  /* ---------- đầu vào ---------- */
  const KIND = { // [nhánh, loại]
    echo_blast: "power", sonic_spear: "power", thunder_clap: "power", big_voice: "power", piercing_note: "power", last_word: "power", dragon_roar: "power",
    question_arrow: "control", riddle_trap: "control", freeze_note: "control", silence_bubble: "control", slow_song: "control", mirror_ask: "control", silence_zone: "control",
    harmony_heal: "harmony", chord_shield: "harmony", courage_chant: "harmony", tempo_up: "harmony", mana_song: "harmony", cleanse_note: "harmony", grand_chorus: "harmony",
    drum_roll: "rhythm", shock_wave: "rhythm", beat_dash: "rhythm", echo_rain: "rhythm", spin_beat: "rhythm", chain_beat: "rhythm", festival_frenzy: "rhythm"
  };
  const DEF_RAD = { riddle_trap: 3, mirror_ask: 4, slow_song: 6, silence_zone: 8, shock_wave: 5, beat_dash: 3, echo_rain: 5, spin_beat: 4, chain_beat: 3, festival_frenzy: 9 };
  const ULT = { dragon_roar: 1, silence_zone: 1, grand_chorus: 1, festival_frenzy: 1 };
  function play(id, o) {
    const f = SK[id]; if (!f || typeof scene === "undefined") return; init(); o = o || {};
    const rank = clamp(o.rank || 1, 1, 5), ult = !!ULT[id], T = ult ? 3 : rank >= 5 ? 3 : rank >= 3 ? 2 : 1, br = KIND[id];
    const F = (o.from || new V3()).clone().setY(0), Tg = (o.to ? o.to.clone() : F.clone().add(new V3(0, 0, 6))).setY(0);
    const dir = _a.subVectors(Tg, F); dir.y = 0; if (dir.lengthSq() < 1e-4) dir.set(0, 0, 1); dir.normalize(); const dr = dir.clone();
    const A = F.clone().addScaledVector(dr, 0.7).setY(1.25), B = Tg.clone().setY(0.9), d3 = B.clone().sub(A).normalize();
    const C = { id, T, rank, F, Tg, A, B, dir: d3, col: PAL[br][T - 1], rad: o.radius || DEF_RAD[id] || 4, k: ult ? 1.3 : 1 + (rank - 1) * 0.1 + (o.perfect ? 0.12 : 0) };
    f(C);
    if (T >= 3 && !ult) shake(0.3);
    if (o.perfect) { const pc = C.col[2], at = (id in { harmony_heal: 1, chord_shield: 1, courage_chant: 1, tempo_up: 1, mana_song: 1, cleanse_note: 1, grand_chorus: 1, slow_song: 1, shock_wave: 1, spin_beat: 1, silence_zone: 1, festival_frenzy: 1 }) ? F.clone().setY(1.2) : B; burst(at, 0xffe27a, 8, 5, 0.38, 0.7, 0.05, "star", 3); flash(at, pc, 2.6, 0.4, 0.05, undefined, "star"); }
  }
  function hit(pos, color) {
    if (typeof scene === "undefined") return; init(); let c = 0xffd43b; try { c = new THREE.Color(color).getHex(); } catch (e) {}
    const P = pos.clone(); P.y = Math.max(P.y, 0.9); flash(P, 0xffffff, 1.2, 0.22, 0); burst(P, c, 5, 3.5, 0.26, 0.35, 0, "glow", 8); ringWave(_d.set(P.x, 0, P.z), c, 0.9, 0.3, 0);
  }
  return { play, hit, tick, _live: () => live, _fx: () => FX.length, _ids: () => Object.keys(SK) };
})();
