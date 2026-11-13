/* EnglishVerse – MÔ HÌNH QUÁI (dễ thương, low-poly). Xem docs/design/voice-combat.html mục 5.
   MONSTER_MODELS.make(type, season, lv) → { g, update(dt, t, state) }
     type:   "ghost" (Echo Ghost) · "bug" (Riddle Bug) · "worm" (Scramble Worm) · "crab" (Question Crab) · "bat" (Blank Bat)
     season: "winter" | "autumn" | "desert" | "tropic" | "spring" (đổi màu + phụ kiện); khác / bỏ trống = màu tím nhạt trung tính
     lv:     chỉ làm quái to thêm tối đa 15% (cao 1,2–1,8 m, chân ở y = 0, mặt hướng +z)
     state:  "idle" (nhún nhẹ) · "walk" (lắc lư) · "attack" (lao tới / vung, 0,5 s) · "hit" (nháy trắng + rung) · "die" (xẹp + mờ dần, 0,8 s)
   Cách dựng cho nhẹ máy: mỗi quái chỉ 2–6 lần vẽ — các khối nhỏ được gộp thành 1 mảng, tô màu theo đỉnh (khác mat(màu) chung của lõi game vì cần
   nháy trắng / mờ dần riêng từng con; chất liệu tạo 1 lần lúc make, KHÔNG tạo thêm mỗi khung hình). Bóng đổ do lõi game bật (shade) nếu muốn. */
const MONSTER_MODELS = (function () {
  const TP = {};
  function tpl(g, ty) { if (ty) g.translate(0, ty, 0); return g.toNonIndexed(); }
  function init() {
    if (TP.sph) return;
    TP.sph = tpl(new THREE.SphereGeometry(1, 9, 6)); TP.cone = tpl(new THREE.ConeGeometry(1, 1, 8), 0.5);
    TP.cyl = tpl(new THREE.CylinderGeometry(1, 1, 1, 8), 0.5); TP.box = tpl(new THREE.BoxGeometry(1, 1, 1), 0.5);
  }
  const _m = new THREE.Matrix4(), _nm = new THREE.Matrix3(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _v = new THREE.Vector3();
  const add = (L, tn, c, x, y, z, sx, sy, sz, ry, rx, rz) => L.push([tn, c, x, y, z, sx, sy === undefined ? sx : sy, sz === undefined ? sx : sz, ry || 0, rx || 0, rz || 0]);
  function bake(L, opacity) {   // gộp danh sách khối thành 1 Mesh (màu theo đỉnh), chất liệu riêng cho con quái này
    const pos = [], nor = [], col = [];
    L.forEach(a => {
      const G = TP[a[0]], P = G.attributes.position, N = G.attributes.normal, c = a[1], r = ((c >> 16) & 255) / 255, g = ((c >> 8) & 255) / 255, b = (c & 255) / 255;
      _e.set(a[9], a[8], a[10], "YXZ"); _q.setFromEuler(_e); _m.compose(_p.set(a[2], a[3], a[4]), _q, _s.set(a[5], a[6], a[7])); _nm.getNormalMatrix(_m);
      for (let i = 0; i < P.count; i++) {
        _v.fromBufferAttribute(P, i).applyMatrix4(_m); pos.push(_v.x, _v.y, _v.z);
        _v.fromBufferAttribute(N, i).applyMatrix3(_nm).normalize(); nor.push(_v.x, _v.y, _v.z); col.push(r, g, b);
      }
    });
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3)); geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    const m = new THREE.MeshLambertMaterial({ vertexColors: true }); if (opacity < 1) { m.transparent = true; m.opacity = opacity; }
    const mesh = new THREE.Mesh(geo, m); mesh.userData.flag = true; mesh.frustumCulled = true; mesh.castShadow = false; return mesh;
  }

  /* ----- bảng màu theo mùa ----- */
  const PAL = {
    winter: { main: 0xf1f6ff, dark: 0xb9c9e6, accent: 0x4f9de8, ghost: 0xeaf3ff },
    autumn: { main: 0xe8903a, dark: 0xb85a1c, accent: 0xd33a2c, ghost: 0xffe3c2 },
    desert: { main: 0xe6c585, dark: 0xbf9650, accent: 0xc8573a, ghost: 0xfff0cf },
    tropic: { main: 0xff8f80, dark: 0xe0605a, accent: 0x38c6d9, ghost: 0xffe0dc },
    spring: { main: 0xa6e37e, dark: 0x6ebf52, accent: 0xff8fc0, ghost: 0xe6ffe0 },
    none: { main: 0xbca6ff, dark: 0x8b73e6, accent: 0xffd43b, ghost: 0xeeeaff }
  };
  const EYE = 0x2b2d42, WHITE = 0xffffff, PINK = 0xff9ab0;

  /* phụ kiện trên đầu theo mùa (đặt ở (x, y, z), r = bán kính đầu) */
  function accessory(L, season, x, y, z, r, P) {
    if (season === "winter") {   // mũ len + bông
      add(L, "cyl", WHITE, x, y - 0.04, z, r * 0.9, 0.16, r * 0.9); add(L, "cone", P.accent, x, y + 0.08, z, r * 0.8, r * 1.0, r * 0.8, 0, -0.12, 0.1); add(L, "sph", WHITE, x + 0.03, y + r * 1.08, z - 0.02, 0.13);
    } else if (season === "autumn") {   // lá phong
      for (let i = 0; i < 3; i++) { const a = i * 2.094; add(L, "sph", i === 1 ? 0xf08a24 : 0xd33a2c, x + Math.sin(a) * 0.16, y + 0.06, z + Math.cos(a) * 0.16, 0.2, 0.04, 0.11, a); }
      add(L, "cyl", 0x7a5236, x, y, z, 0.025, 0.1, 0.025);
    } else if (season === "desert") {   // xương rồng tí hon có hoa
      add(L, "box", 0x4f9d4e, x, y, z, 0.15, 0.34, 0.15); add(L, "box", 0x4f9d4e, x + 0.14, y + 0.12, z, 0.14, 0.07, 0.07); add(L, "box", 0x4f9d4e, x + 0.2, y + 0.12, z, 0.07, 0.17, 0.07); add(L, "sph", 0xff7eb6, x, y + 0.36, z, 0.07);
    } else if (season === "tropic") {   // hoa dâm bụt
      for (let i = 0; i < 5; i++) { const a = i * 1.2566; add(L, "sph", 0xff4f87, x + Math.sin(a) * 0.15, y + 0.08, z + Math.cos(a) * 0.15, 0.14, 0.05, 0.14, a); }
      add(L, "sph", 0xffd43b, x, y + 0.12, z, 0.07);
    } else if (season === "spring") {   // 3 bông hoa
      [[-0.15, 0, 0xff8fc0], [0.14, 0.04, 0xffd43b], [0, -0.12, WHITE]].forEach(f => { add(L, "cyl", 0x4e9e3a, x + f[0], y - 0.02, z + f[1], 0.018, 0.2, 0.018); add(L, "sph", f[2], x + f[0], y + 0.22, z + f[1], 0.09); add(L, "sph", 0xffb300, x + f[0], y + 0.24, z + f[1] + 0.05, 0.04); });
    }
  }
  /* mặt dễ thương: mắt to + điểm sáng + má hồng + miệng nhỏ (cx, cy, cz = tâm mặt; fw = nửa rộng mặt; fz = chiều sâu mặt phía trước) */
  function face(L, cx, ey, ez, sp, es) {
    [-1, 1].forEach(k => { add(L, "sph", EYE, cx + k * sp, ey, ez, 0.1 * es, 0.13 * es, 0.06 * es); add(L, "sph", WHITE, cx + k * (sp - 0.03 * es), ey + 0.05 * es, ez + 0.04 * es, 0.035 * es); });
  }
  function cheeks(L, cx, cy, cz, sp) { [-1, 1].forEach(k => add(L, "sph", PINK, cx + k * sp, cy, cz, 0.1, 0.06, 0.03)); }

  /* ----- bong bóng chữ (sprite) và ô chữ cái, dùng chung ảnh ----- */
  const TEX = {};
  function bubbleTex(txt, color) {
    const key = txt + color; if (TEX[key]) return TEX[key];
    const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d");
    x.fillStyle = "#fff"; x.strokeStyle = color; x.lineWidth = 8; x.beginPath(); x.arc(64, 60, 50, 0, 7); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(52, 104); x.lineTo(64, 124); x.lineTo(76, 104); x.closePath(); x.fill(); x.stroke(); x.fillStyle = "#fff"; x.fillRect(54, 100, 20, 8);
    x.fillStyle = color; x.font = "bold 70px system-ui, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(txt, 64, 62);
    return TEX[key] = new THREE.CanvasTexture(c);
  }
  const LMAT = {};
  function letterMat(ch) {
    if (LMAT[ch]) return LMAT[ch];
    const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d");
    x.fillStyle = "#fff6d6"; x.fillRect(2, 2, 60, 60); x.strokeStyle = "#8a6a2f"; x.lineWidth = 4; x.strokeRect(3, 3, 58, 58);
    x.fillStyle = "#3b2a1a"; x.font = "bold 44px system-ui, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(ch, 32, 35);
    return LMAT[ch] = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), side: THREE.DoubleSide });
  }
  let TILE = null;
  const LETTERS = "ABCDEFGHILMNOPRSTW";

  /* ----- 5 loại quái: mỗi hàm dựng vào group "body" và trả về phần hoạt hình riêng ----- */
  function mesh(ctx, parent, L, opacity) { const m = bake(L, opacity === undefined ? 1 : opacity); parent.add(m); ctx.mats.push({ m: m.material, base: opacity === undefined ? 1 : opacity }); return m; }
  function sprite(ctx, parent, txt, color, x, y, z, size) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: bubbleTex(txt, color), depthWrite: false })); s.scale.set(size, size, 1); s.position.set(x, y, z); s.userData.flag = true; parent.add(s); ctx.mats.push({ m: s.material, base: 1 }); return s;
  }
  const BUILD = {
    ghost(ctx, body, P, season) {   // Echo Ghost: bóng ma tròn trịa, váy lượn sóng, nổi bồng bềnh
      const B = [], F = [], c = P.ghost;
      add(B, "sph", c, 0, 0.86, 0, 0.54, 0.54, 0.5); add(B, "cyl", c, 0, 0.24, 0, 0.54, 0.62, 0.5);
      for (let i = 0; i < 8; i++) { const a = i * 0.785; add(B, "sph", c, Math.sin(a) * 0.4, 0.27, Math.cos(a) * 0.37, 0.17, 0.15, 0.17); }
      add(B, "sph", c, -0.58, 0.72, 0.08, 0.15, 0.24, 0.15, 0, 0, 0.5); add(B, "sph", c, 0.58, 0.72, 0.08, 0.15, 0.24, 0.15, 0, 0, -0.5);
      face(F, 0, 0.94, 0.44, 0.2, 1); cheeks(F, 0, 0.8, 0.45, 0.33); add(F, "sph", EYE, 0, 0.74, 0.5, 0.055, 0.045, 0.03);
      accessory(F, season, 0, 1.36, 0, 0.5, P);
      mesh(ctx, body, B, 0.86); mesh(ctx, body, F, 1);
      return { float: 0.12, bob: 0.07 };
    },
    bug(ctx, body, P, season) {   // Riddle Bug: bọ cánh cứng, râu có bi, chấm hỏi trên đầu
      const B = [], A = [], F = [];
      add(B, "sph", P.main, 0, 0.55, -0.05, 0.6, 0.46, 0.7); add(B, "sph", P.dark, 0, 0.55, -0.05, 0.04, 0.5, 0.7);   // vỏ + đường giữa lưng
      [[0, 0.98, -0.28], [0.3, 0.88, 0.05], [-0.3, 0.88, 0.05], [0.34, 0.8, -0.38], [-0.34, 0.8, -0.38]].forEach(s => add(B, "sph", P.dark, s[0], s[1], s[2], 0.11, 0.05, 0.11));
      add(B, "sph", 0xfff0d6, 0, 0.7, 0.62, 0.36, 0.34, 0.34);   // đầu
      [-1, 1].forEach(k => { for (let i = 0; i < 3; i++) add(B, "cyl", P.dark, k * 0.5, 0.05, -0.38 + i * 0.36, 0.05, 0.32, 0.05, 0, 0, -k * 0.9); });   // 6 chân
      face(F, 0, 0.78, 0.9, 0.15, 0.95); cheeks(F, 0, 0.62, 0.92, 0.27); add(F, "sph", EYE, 0, 0.6, 0.96, 0.05, 0.035, 0.03);
      accessory(F, season, 0, 0.98, -0.3, 0.3, P);
      [-1, 1].forEach(k => { add(A, "cyl", P.dark, k * 0.15, 0.95, 0.7, 0.025, 0.5, 0.025, 0, 0.25, -k * 0.35); add(A, "sph", P.accent, k * 0.3, 1.42, 0.78, 0.07); });
      mesh(ctx, body, B); mesh(ctx, body, F); const ant = mesh(ctx, body, A);
      const q = sprite(ctx, body, "?", "#7048e8", 0, 1.75, 0.3, 0.55);
      return { ant, q, qy: 1.75 };
    },
    worm(ctx, body, P, season) {   // Scramble Worm: sâu nhiều đốt, mỗi đốt mang một chữ cái
      const B = [], F = [], segs = [[-0.78, 0.26, 0.3], [-0.42, 0.34, 0.34], [-0.1, 0.56, 0.38], [0.12, 0.84, 0.42]];
      segs.forEach((s, i) => add(B, "sph", i % 2 ? P.dark : P.main, 0, s[1], s[0], s[2], s[2], s[2]));
      add(B, "sph", P.main, 0, 1.02, 0.3, 0.46, 0.44, 0.44);
      [-1, 1].forEach(k => add(B, "cone", P.accent, k * 0.2, 1.38, 0.2, 0.05, 0.22, 0.05, 0, 0, -k * 0.3));
      face(F, 0, 1.08, 0.7, 0.19, 0.95); cheeks(F, 0, 0.94, 0.72, 0.3); add(F, "sph", EYE, 0, 0.9, 0.74, 0.06, 0.04, 0.03);
      accessory(F, season, 0, 1.44, 0.25, 0.4, P);
      mesh(ctx, body, B); mesh(ctx, body, F);
      if (!TILE) TILE = new THREE.PlaneGeometry(0.36, 0.36);
      const tiles = segs.map((s, i) => { const t = new THREE.Mesh(TILE, letterMat(LETTERS[(Math.random() * LETTERS.length) | 0])); t.position.set(0, s[1] + s[2] * 0.96, s[0] + 0.02); t.rotation.x = -0.95; t.userData.flag = true; body.add(t); return t; });
      return { tiles };
    },
    crab(ctx, body, P, season) {   // Question Crab: cua giơ càng, mắt cuống
      const B = [], F = [];
      add(B, "sph", P.main, 0, 0.46, 0, 0.74, 0.4, 0.56); [[0, 0.8, -0.1], [0.3, 0.74, 0.1], [-0.3, 0.74, 0.1]].forEach(s => add(B, "sph", P.dark, s[0], s[1] - 0.12, s[2], 0.11, 0.05, 0.11));
      [-1, 1].forEach(k => { add(B, "cyl", P.dark, k * 0.22, 0.7, 0.3, 0.035, 0.32, 0.035); for (let i = 0; i < 3; i++) add(B, "cyl", P.dark, k * 0.62, 0.12, -0.18 + i * 0.22, 0.04, 0.42, 0.04, 0, 0, k * 1.0); });
      [-1, 1].forEach(k => { add(F, "sph", WHITE, k * 0.22, 1.08, 0.3, 0.12); add(F, "sph", EYE, k * 0.22, 1.09, 0.4, 0.065); add(F, "sph", WHITE, k * 0.2, 1.12, 0.44, 0.02); });
      cheeks(F, 0, 0.45, 0.5, 0.36); add(F, "sph", EYE, 0, 0.42, 0.54, 0.07, 0.04, 0.03);
      accessory(F, season, 0, 0.72, -0.1, 0.34, P);
      mesh(ctx, body, B); mesh(ctx, body, F);
      const claws = [-1, 1].map(k => { const C = [], gr = new THREE.Group(); gr.position.set(k * 0.66, 0.6, 0.3); body.add(gr);
        add(C, "cyl", P.main, 0, 0, 0, 0.06, 0.4, 0.06, 0, 0, -k * 0.5); add(C, "sph", P.accent, k * 0.22, 0.52, 0.04, 0.27, 0.23, 0.22); add(C, "cone", P.dark, k * 0.22, 0.6, 0.2, 0.09, 0.2, 0.09, 0, 1.0, 0); add(C, "sph", EYE, k * 0.22, 0.54, 0.25, 0.03);
        mesh(ctx, gr, C); return gr; });
      return { claws };
    },
    bat(ctx, body, P, season) {   // Blank Bat: dơi tròn, tai to, cánh vỗ
      const B = [], F = [], dk = P.dark;
      add(B, "sph", P.main, 0, 0.8, 0, 0.5, 0.48, 0.46); add(B, "sph", 0xfff0d6, 0, 0.74, 0.2, 0.32, 0.3, 0.22);
      [-1, 1].forEach(k => { add(B, "cone", P.main, k * 0.28, 1.12, 0, 0.17, 0.36, 0.1, 0, 0, -k * 0.25); add(B, "cone", PINK, k * 0.28, 1.14, 0.03, 0.09, 0.22, 0.05, 0, 0, -k * 0.25); add(B, "sph", dk, k * 0.17, 0.32, 0.05, 0.1, 0.07, 0.13); });
      face(F, 0, 0.92, 0.4, 0.19, 1.05); cheeks(F, 0, 0.76, 0.42, 0.33); add(F, "sph", EYE, 0, 0.7, 0.46, 0.05, 0.035, 0.03); [-1, 1].forEach(k => add(F, "cone", WHITE, k * 0.07, 0.69, 0.45, 0.025, 0.06, 0.025, 0, 3.14));
      accessory(F, season, 0, 1.24, 0.0, 0.3, P);
      mesh(ctx, body, B); mesh(ctx, body, F);
      const wings = [-1, 1].map(k => { const W = [], gr = new THREE.Group(); gr.position.set(k * 0.46, 0.85, -0.02); body.add(gr);
        add(W, "sph", dk, k * 0.45, 0.06, 0, 0.5, 0.045, 0.3); [0.1, 0.4, 0.7].forEach(f => add(W, "sph", dk, k * (0.3 + f * 0.7), -0.02, 0.18 - f * 0.1, 0.12, 0.05, 0.12));
        mesh(ctx, gr, W); return gr; });
      const q = sprite(ctx, body, "__", "#e8590c", 0.5, 1.55, 0.1, 0.5);
      return { wings, q, qy: 1.55, float: 0.2 };
    }
  };

  function make(type, season, lv) {
    init();
    const P = PAL[season] || PAL.none, build = BUILD[type] || BUILD.ghost, g = new THREE.Group(), body = new THREE.Group(); g.add(body);
    body.scale.setScalar((1 + Math.min(lv || 1, 30) * 0.005) * ({ ghost: 0.86, worm: 0.84, bug: 0.9 }[type] || 1));   // chỉnh để mọi loài cao khoảng 1,2–1,8 m
    const ctx = { mats: [] }, X = build(ctx, body, P, PAL[season] ? season : "none"), k0 = body.scale.x, phase = Math.random() * 6.28;
    const letters = X.tiles || [];
    let cur = "idle", st = 0, flashOn = false, lastAlpha = 1, dead = false;
    function setAlpha(a) { if (a === lastAlpha) return; lastAlpha = a; ctx.mats.forEach(o => { const t = a < 1; if (o.m.transparent !== (t || o.base < 1)) o.m.transparent = t || o.base < 1; o.m.opacity = o.base * a; }); }
    function setFlash(on) { if (on === flashOn) return; flashOn = on; ctx.mats.forEach(o => { if (o.m.emissive) o.m.emissive.setHex(on ? 0x999999 : 0); }); }
    function update(dt, t, state) {
      state = state || "idle";
      if (state !== cur) { cur = state; st = 0; if (state !== "die" && dead) { dead = false; body.visible = true; setAlpha(1); letters.forEach(l => l.visible = true); } }
      st += dt;
      const ph = t * 2.2 + phase; let bx = 0, by = X.float || 0, bz = 0, rx = 0, rz = 0, sx = 1, sy = 1, alpha = 1, flash = false, lunge = 0, wave = 1;
      if (state === "idle") { by += Math.sin(ph) * (X.bob || 0.03); sy = 1 + Math.sin(ph) * 0.025; sx = 1 - Math.sin(ph) * 0.012; }
      else if (state === "walk") { const w = t * 8 + phase; rz = Math.sin(w) * 0.12; by += Math.abs(Math.sin(w)) * 0.08; sy = 1 + Math.sin(w * 2) * 0.03; wave = 2.2; }
      else if (state === "attack") { const p = Math.min(1, st / 0.5); lunge = Math.sin(p * Math.PI); bz = lunge * 0.75; rx = lunge * 0.3; by += lunge * 0.1; sy = 1 - lunge * 0.06; wave = 3; }
      else if (state === "hit") { const f = Math.max(0, 1 - st / 0.35); bx = Math.sin(st * 55) * 0.07 * f; rz = Math.sin(st * 40) * 0.08 * f; flash = st < 0.4 && Math.floor(st * 16) % 2 === 0; sy = 1 - 0.08 * f; }
      else if (state === "die") { const p = Math.min(1, st / 0.8); sy = 1 - 0.8 * p; sx = 1 + 0.4 * p; alpha = 1 - p * p; by = 0; if (p >= 1 && !dead) { dead = true; body.visible = false; } letters.forEach(l => l.visible = p < 0.3); }
      body.position.set(bx, by, bz); body.rotation.set(rx, 0, rz); body.scale.set(k0 * sx, k0 * sy, k0 * sx);
      setAlpha(alpha); setFlash(flash);
      // phần riêng từng loài
      if (X.ant) { X.ant.rotation.z = Math.sin(t * 5 * wave + phase) * 0.14; X.ant.rotation.x = Math.sin(t * 3 + phase) * 0.1 + lunge * 0.3; }
      if (X.claws) X.claws.forEach((c, i) => { const s = i ? 1 : -1; c.rotation.z = s * (Math.sin(t * 2.4 * wave + phase + i) * 0.12 + 0.08); c.rotation.x = -0.15 + lunge * 1.5 + (state === "idle" ? Math.sin(t * 2.4 + i * 2) * 0.12 : 0); });
      if (X.wings) X.wings.forEach((w, i) => { const s = i ? 1 : -1, f = state === "die" ? -0.3 : Math.sin(t * (state === "idle" ? 7 : 13) + phase) * (state === "idle" ? 0.35 : 0.6) + 0.15 - lunge * 0.6; w.rotation.z = s * f; });
      if (X.q) { X.q.position.y = X.qy + Math.sin(t * 3 + phase) * 0.05; }
    }
    return { g, update };
  }
  return { make };
})();
