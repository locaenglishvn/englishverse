/* EnglishVerse – MÔ HÌNH VŨ KHÍ CẦM TAY. Xem docs/design/voice-combat.html mục 4.
   WEAPON_MODELS.make(item)         item = ITEMS[id], item.weapon = { line: "power"|"control"|"harmony"|"rhythm"|"all", tier: 1..8, maestro?: true } → THREE.Group
                                    (gốc ở chỗ nắm tay, vũ khí mọc theo +y, dài 0,5–0,9 m; bậc 6–8 phát sáng; Maestro có nốt nhạc bay quanh + vệt cầu vồng)
   WEAPON_MODELS.attach(char, group) gắn vào xương tay phải (handslot.r) của nhân vật KayKit → true / false (chưa tải xong mô hình: tự thử lại trong tick)
   WEAPON_MODELS.detach(char)        gỡ + giải phóng vũ khí đang cầm
   WEAPON_MODELS.tick(dt, t)         engine gọi mỗi khung hình: xoay / nhấp nháy hiệu ứng vũ khí bậc cao, thử gắn lại nếu nhân vật đổi mô hình
   Nhẹ máy: mỗi vũ khí chỉ 2 mesh (khối tô màu theo đỉnh: 1 lớp có đổ sáng + 1 lớp "tự phát sáng") + vài sprite; chất liệu dùng chung, chỉ geometry là riêng
   (detach tự giải phóng). Nếu dùng make() để xem trước ngoài tay nhân vật: tự gọi group.userData.upd(dt, t) mỗi khung. */
const WEAPON_MODELS = (function () {
  const TP = {}, TEX = {}, SPM = {}, ATT = [];
  let MAT_L = null, MAT_G = null, retryT = 0;
  const PI = Math.PI;
  function init() {
    if (TP.sph) return;
    const f = (g, ty) => { if (ty) g.translate(0, ty, 0); return g.toNonIndexed(); };
    TP.sph = f(new THREE.SphereGeometry(1, 8, 6)); TP.cyl = f(new THREE.CylinderGeometry(1, 1, 1, 8), 0.5); TP.fru = f(new THREE.CylinderGeometry(1, 0.35, 1, 10), 0.5);
    TP.cone = f(new THREE.ConeGeometry(1, 1, 8), 0.5); TP.box = f(new THREE.BoxGeometry(1, 1, 1), 0.5); TP.tor = f(new THREE.TorusGeometry(1, 0.2, 5, 14));
    TP.arc = f(new THREE.TorusGeometry(1, 0.2, 5, 12, PI * 1.5)); TP.oct = f(new THREE.OctahedronGeometry(1)); TP.disc = f(new THREE.CylinderGeometry(1, 1, 0.1, 12), 0.05);
    MAT_L = new THREE.MeshLambertMaterial({ vertexColors: true }); MAT_G = new THREE.MeshBasicMaterial({ vertexColors: true });
    const ct = fn => { const c = document.createElement("canvas"); c.width = c.height = 64; fn(c.getContext("2d")); return new THREE.CanvasTexture(c); };
    TEX.glow = ct(x => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.4, "rgba(255,255,255,0.7)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
    TEX.star = ct(x => { x.fillStyle = "#fff"; x.beginPath(); x.moveTo(32, 1); x.quadraticCurveTo(35, 29, 63, 32); x.quadraticCurveTo(35, 35, 32, 63); x.quadraticCurveTo(29, 35, 1, 32); x.quadraticCurveTo(29, 29, 32, 1); x.fill(); });
    const tx = s => ct(x => { x.fillStyle = "#fff"; x.font = "bold 54px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(s, 32, 36); });
    TEX.note = tx("♪"); TEX.note2 = tx("♫");
    TEX.petal = ct(x => { x.fillStyle = "#fff"; x.beginPath(); x.moveTo(32, 4); x.bezierCurveTo(58, 22, 52, 50, 32, 60); x.bezierCurveTo(12, 50, 6, 22, 32, 4); x.fill(); });
  }
  const spMat = (tex, c) => { const k = tex + c; return SPM[k] || (SPM[k] = new THREE.SpriteMaterial({ map: TEX[tex], color: c, transparent: true, depthWrite: false, fog: false })); };

  /* ---------- bộ dựng: gom khối thành 2 mảng, tô màu theo đỉnh ---------- */
  const _m = new THREE.Matrix4(), _nm = new THREE.Matrix3(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _v = new THREE.Vector3();
  class Build {
    constructor() { this.L = []; this.G = []; this.sp = []; this.an = []; this.root = new THREE.Group(); }
    // khối có đổ sáng: l(hình, màu, x,y,z, sx,sy,sz, rx,ry,rz)   (sy, sz bỏ trống = sx)
    l(t, c, x, y, z, sx, sy, sz, rx, ry, rz) { this.L.push([t, c, x, y, z, sx, sy === undefined ? sx : sy, sz === undefined ? sx : sz, rx || 0, ry || 0, rz || 0]); return this; }
    g(t, c, x, y, z, sx, sy, sz, rx, ry, rz) { this.G.push([t, c, x, y, z, sx, sy === undefined ? sx : sy, sz === undefined ? sx : sz, rx || 0, ry || 0, rz || 0]); return this; }   // tự phát sáng
    // que tròn từ y0 đến y1 (bán kính r), r1 = bán kính đầu trên nếu muốn thon
    rod(c, y0, y1, r, glow, x, z) { return (glow ? this.g : this.l).call(this, "cyl", c, x || 0, y0, z || 0, r, y1 - y0, r); }
    halo(c, size, y, pulse) { const s = new THREE.Sprite(spMat("glow", c)); s.position.y = y; s.scale.setScalar(size); s.material.opacity = 0.55; this.root.add(s); const sc = size; this.an.push((t) => { if (pulse) s.scale.setScalar(sc * (1 + 0.12 * Math.sin(t * 3))); }); return s; }
    spr(tex, c, size, x, y, z) { const s = new THREE.Sprite(spMat(tex, c)); s.position.set(x || 0, y || 0, z || 0); s.scale.setScalar(size); this.root.add(s); return s; }
    orbit(tex, c, n, rad, y, size, speed, bob) {   // sprite quay quanh cán vũ khí
      const a = []; for (let i = 0; i < n; i++) a.push(this.spr(Array.isArray(tex) ? tex[i % tex.length] : tex, Array.isArray(c) ? c[i % c.length] : c, size));
      this.an.push((t) => a.forEach((s, i) => { const an = t * speed + i / n * PI * 2; s.position.set(Math.cos(an) * rad, y + Math.sin(t * 2 + i * 2) * (bob || 0.04), Math.sin(an) * rad); }));
    }
    flick(parts, base) { this.an.push((t) => parts.forEach((o, i) => { const k = 1 + 0.25 * Math.sin(t * 14 + i * 2.1); o.scale.y = base[i] * k; })); }
  }
  function bake(L, mat) {
    if (!L.length) return null;
    const pos = [], nor = [], col = [];
    L.forEach(a => {
      const G = TP[a[0]], P = G.attributes.position, N = G.attributes.normal, c = a[1], r = ((c >> 16) & 255) / 255, g = ((c >> 8) & 255) / 255, b = (c & 255) / 255;
      _e.set(a[8], a[9], a[10], "YXZ"); _q.setFromEuler(_e); _m.compose(_p.set(a[2], a[3], a[4]), _q, _s.set(a[5], a[6], a[7])); _nm.getNormalMatrix(_m);
      for (let i = 0; i < P.count; i++) {
        _v.fromBufferAttribute(P, i).applyMatrix4(_m); pos.push(_v.x, _v.y, _v.z);
        _v.fromBufferAttribute(N, i).applyMatrix3(_nm).normalize(); nor.push(_v.x, _v.y, _v.z); col.push(r, g, b);
      }
    });
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3)); geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    const m = new THREE.Mesh(geo, mat); m.castShadow = false; m.receiveShadow = false; m.frustumCulled = false; m.userData.wpn = true; return m;
  }

  /* ---------- màu ---------- */
  const WOOD = 0x9a6b3f, DWOOD = 0x6b4423, BRASS = 0xd9a441, GOLD = 0xffcf3b, SILVER = 0xcfd8e3, STEEL = 0x8e9aab, IRON = 0x4a5160, CREAM = 0xf3e6c8, WHITE = 0xffffff;

  // vòng đai ôm đúng thân hình nón cụt (đáy y0, cao h, bán kính miệng R): vòng ở độ cao y
  const band = (b, c, y0, h, R, y, t) => { const r = R * (0.35 + 0.65 * (y - y0) / h) * 1.03; b.l("tor", c, 0, y, 0, r, r, r * 1.2, PI / 2); };

  /* ---------- ⚡ POWER ---------- */
  const POWER = [
    b => { b.rod(WOOD, -0.12, 0.2, 0.03); b.l("fru", 0xd9a066, 0, 0.17, 0, 0.14, 0.34, 0.14); b.l("cyl", 0xe5484d, 0, 0.2, 0, 0.082, 0.04, 0.082); b.l("cyl", 0x3a2a1a, 0, 0.505, 0, 0.12, 0.012, 0.12); },
    b => { b.rod(DWOOD, -0.12, 0.1, 0.028); b.l("cyl", BRASS, 0, 0.06, 0, 0.04, 0.1, 0.04); b.l("fru", BRASS, 0, 0.1, 0, 0.16, 0.56, 0.16); [0.2, 0.38, 0.6].forEach(y => band(b, 0xb07a1c, 0.1, 0.56, 0.16, y)); b.l("cyl", 0x3a2a1a, 0, 0.655, 0, 0.145, 0.012, 0.145); },
    b => { b.rod(SILVER, -0.12, 0.72, 0.02); for (let i = 0; i < 4; i++) b.l("tor", 0xc8793a, 0, 0.12 + i * 0.1, 0, 0.05, 0.05, 0.05, PI / 2); b.l("sph", GOLD, 0, 0.74, 0, 0.04); b.g("box", 0xffe14a, -0.02, 0.76, 0, 0.03, 0.12, 0.03, 0, 0, -0.5); b.g("box", 0xffe14a, 0.04, 0.84, 0, 0.03, 0.1, 0.03, 0, 0, 0.55); b.g("box", 0xfff3a0, 0.0, 0.92, 0, 0.025, 0.08, 0.025, 0, 0, -0.4); },
    b => { b.rod(WOOD, -0.14, 0.5, 0.03); b.l("box", STEEL, -0.13, 0.5, -0.09, 0.26, 0.2, 0.18); b.l("box", GOLD, -0.15, 0.48, -0.1, 0.03, 0.24, 0.2); b.l("box", GOLD, 0.1, 0.48, -0.1, 0.03, 0.24, 0.2); b.l("sph", GOLD, 0, 0.5, 0, 0.04); b.g("box", 0xffe14a, -0.02, 0.52, 0.095, 0.03, 0.14, 0.01, 0, 0, 0.35); },
    b => { b.rod(DWOOD, -0.12, 0.12, 0.028); b.l("fru", 0x5b6b8c, 0, 0.1, 0, 0.19, 0.62, 0.19); [0.25, 0.5].forEach(y => band(b, GOLD, 0.1, 0.62, 0.19, y)); b.g("tor", 0x7fe3ff, 0, 0.72, 0, 0.19, 0.19, 0.19, PI / 2); b.g("sph", 0xbff4ff, 0, 0.7, 0, 0.09); b.halo(0x8fe3ff, 0.55, 0.65, true); b.g("box", 0xffe14a, 0.17, 0.36, 0, 0.025, 0.1, 0.025, 0, 0, 0.5); },
    b => { b.rod(0x3b4a6b, -0.14, 0.58, 0.03); b.l("box", 0xdde7ff, -0.17, 0.58, -0.12, 0.34, 0.26, 0.24); b.g("box", 0x7fd0ff, -0.19, 0.57, -0.13, 0.03, 0.28, 0.26); b.g("box", 0x7fd0ff, 0.16, 0.57, -0.13, 0.03, 0.28, 0.26); b.g("sph", 0xffffff, 0, 0.71, 0, 0.06); b.g("box", 0xffe14a, -0.04, 0.6, 0.125, 0.04, 0.18, 0.01, 0, 0, 0.4); b.halo(0x7fd0ff, 0.9, 0.7, true); b.orbit("star", 0xbfe9ff, 3, 0.26, 0.7, 0.1, 2.2); },
    b => { b.rod(0x7a4b1c, -0.12, 0.1, 0.03); b.l("fru", GOLD, 0, 0.08, 0, 0.22, 0.72, 0.22); [0.2, 0.42, 0.66].forEach(y => band(b, 0xb8860b, 0.08, 0.72, 0.22, y)); for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; b.l("cone", 0xfff1a8, Math.cos(a) * 0.23, 0.78, Math.sin(a) * 0.23, 0.03, 0.12, 0.03, Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4); } for (let i = 0; i < 3; i++) b.g("sph", 0xff3b30, 0, 0.3 + i * 0.17, 0.19 - i * 0.01, 0.03); b.g("sph", 0xfff3b0, 0, 0.78, 0, 0.1); b.halo(0xffd43b, 1.0, 0.7, true); b.orbit("star", 0xffe27a, 4, 0.3, 0.75, 0.1, 2.5); },
    b => {   // Dragon Roar Horn: sừng vảy đỏ-vàng, loa là miệng rồng có răng + sừng, lửa phun ở trong
      b.rod(0x5a2a10, -0.14, 0.04, 0.032);
      for (let i = 0; i < 4; i++) b.l("fru", i % 2 ? 0xffb02e : 0xe5484d, 0, 0.03 + i * 0.13, 0, 0.05 + i * 0.022, 0.14, 0.05 + i * 0.022);
      b.l("fru", 0xc2300f, 0, 0.55, 0, 0.25, 0.22, 0.25); band(b, GOLD, 0.55, 0.22, 0.25, 0.6); band(b, GOLD, 0.55, 0.22, 0.25, 0.74);
      for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2; b.l("cone", WHITE, Math.cos(a) * 0.245, 0.77, Math.sin(a) * 0.245, 0.028, 0.09, 0.028, Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3); }
      b.l("cone", 0xffb02e, -0.16, 0.7, -0.14, 0.05, 0.26, 0.05, 0.5, 0, 0.5); b.l("cone", 0xffb02e, 0.16, 0.7, -0.14, 0.05, 0.26, 0.05, 0.5, 0, -0.5);
      b.g("cyl", 0xff6a1f, 0, 0.74, 0, 0.21, 0.02, 0.21); b.g("sph", 0xffd43b, 0, 0.78, 0, 0.09, 0.05, 0.09);
      const fl = []; for (let i = 0; i < 3; i++) { const c = new THREE.Mesh(TP.cone.clone(), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffc24a : 0xff5a1f, transparent: true, opacity: 0.85 })); c.scale.set(0.07, 0.24, 0.07); c.position.set((i - 1) * 0.09, 0.78, 0); b.root.add(c); fl.push(c); }
      b.root.userData.own = fl; b.flick(fl, [0.24, 0.24, 0.24]); b.halo(0xff7a2e, 1.1, 0.7, true); b.orbit("glow", 0xff9a3a, 6, 0.32, 0.6, 0.08, 3);
    }
  ];

  /* ---------- 🌀 CONTROL ---------- */
  const CONTROL = [
    b => { b.rod(0xf2efe6, -0.1, 0.46, 0.016); b.l("box", 0xfff3b0, -0.015, 0.44, -0.015, 0.03, 0.07, 0.03); b.l("cyl", 0x4d7fd0, 0, -0.05, 0, 0.02, 0.1, 0.02); },
    b => { b.rod(WOOD, -0.12, 0.42, 0.018); b.l("cyl", GOLD, 0, 0.38, 0, 0.03, 0.03, 0.03); b.g("oct", 0x7fdcff, 0, 0.5, 0, 0.05, 0.1, 0.05); b.l("tor", GOLD, 0, 0.45, 0, 0.045, 0.045, 0.045, PI / 2); },
    b => { b.rod(SILVER, -0.12, 0.58, 0.02); b.l("tor", 0x8fb4d8, 0, 0.2, 0, 0.04, 0.04, 0.04, PI / 2); for (let i = 0; i < 5; i++) { const a = i / 5 * PI * 2; b.g("cone", i % 2 ? 0xe6f6ff : 0x9fd8ff, Math.cos(a) * 0.035, 0.58, Math.sin(a) * 0.035, 0.025, 0.16 + (i % 2) * 0.05, 0.025, Math.sin(a) * 0.45, 0, -Math.cos(a) * 0.45); } b.g("cone", 0xffffff, 0, 0.6, 0, 0.03, 0.24, 0.03); },
    b => { b.rod(0x24305c, -0.12, 0.64, 0.022); b.l("tor", SILVER, 0, 0.3, 0, 0.04, 0.04, 0.04, PI / 2); b.g("arc", 0xfff3b0, 0, 0.74, 0, 0.11, 0.11, 0.11, 0, 0, 2.4); b.g("sph", 0xe6f0ff, 0.0, 0.74, 0, 0.035); b.g("oct", 0xfff3b0, 0.08, 0.84, 0, 0.025); },
    b => { b.rod(GOLD, -0.12, 0.62, 0.02); b.l("tor", 0xb8860b, 0, 0.25, 0, 0.04, 0.04, 0.04, PI / 2); for (let i = 0; i < 5; i++) { const a = i / 5 * PI * 2 + PI / 2; b.l("cone", GOLD, Math.cos(a) * 0.04, 0.74 + Math.sin(a) * 0.04, 0, 0.045, 0.14, 0.045, 0, 0, a - PI / 2); } b.g("sph", 0xfff6c0, 0, 0.74, 0, 0.055); b.halo(0xffe27a, 0.5, 0.74, true); },
    b => { b.rod(0xbfe6ff, -0.12, 0.6, 0.022); for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; b.g("cone", 0xdff4ff, Math.cos(a) * 0.075, 0.58, Math.sin(a) * 0.075, 0.026, 0.17, 0.026, Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4); } b.g("oct", 0x7fd0ff, 0, 0.8, 0, 0.06, 0.1, 0.06); b.halo(0x9fe0ff, 0.8, 0.75, true); b.orbit("snow", 0xffffff, 0, 0.1, 0.7, 0.05, 1); b.orbit("star", 0xdff4ff, 3, 0.16, 0.8, 0.08, 2); },
    b => { b.rod(0x3a1f6b, -0.12, 0.64, 0.024); b.l("tor", 0xc0a0ff, 0, 0.3, 0, 0.045, 0.045, 0.045, PI / 2); b.g("sph", 0x7a4bdc, 0, 0.78, 0, 0.09); b.g("arc", 0xe6d8ff, 0, 0.78, 0, 0.14, 0.14, 0.14, 0, 0, 1.0); b.halo(0x9a6bff, 1.0, 0.78, true); b.orbit("star", [0xffffff, 0xd8c4ff, 0xffe27a], 5, 0.22, 0.78, 0.09, 2.6, 0.08); },
    b => {   // Time Scepter: vòng đồng hồ vàng + kim quay + 2 vòng xoay
      b.rod(GOLD, -0.14, 0.62, 0.024); b.l("tor", 0xb8860b, 0, 0.3, 0, 0.045, 0.045, 0.045, PI / 2); b.l("tor", GOLD, 0, 0.78, 0, 0.14, 0.14, 0.14); b.g("cyl", 0xfff1b0, 0, 0.78, -0.012, 0.125, 0.01, 0.125, PI / 2);
      for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2; b.g("box", 0xb8860b, Math.sin(a) * 0.11, 0.78 + Math.cos(a) * 0.11, 0.005, 0.01, 0.025, 0.01, 0, 0, -a); }
      const hands = new THREE.Group(); hands.position.set(0, 0.78, 0.01); const h1 = new THREE.Mesh(TP.box.clone(), new THREE.MeshBasicMaterial({ color: 0x5a3a00 })), h2 = h1.clone(); h1.scale.set(0.012, 0.1, 0.012); h2.scale.set(0.012, 0.07, 0.012); hands.add(h1, h2); b.root.add(hands); b.root.userData.own = [h1, h2];
      b.an.push(t => { h1.rotation.z = -t * 3; h2.rotation.z = -t * 0.25; });
      b.halo(0xffd43b, 1.0, 0.78, true); b.orbit("star", 0xfff1b0, 4, 0.24, 0.78, 0.09, 1.6, 0.07);
      const r1 = new THREE.Mesh(TP.tor.clone(), new THREE.MeshBasicMaterial({ color: 0xffe27a, transparent: true, opacity: 0.7 })), r2 = r1.clone(); r1.scale.setScalar(0.2); r2.scale.setScalar(0.17); r1.position.y = r2.position.y = 0.78; b.root.add(r1, r2); b.root.userData.own = b.root.userData.own.concat([r1, r2]);
      b.an.push(t => { r1.rotation.set(t * 1.2, t * 0.7, 0); r2.rotation.set(-t, 0.4, t * 0.9); });
    }
  ];

  /* ---------- 💚 HARMONY ---------- */
  const HARMONY = [
    b => { b.rod(0xc5c45a, -0.12, 0.42, 0.016); [0.1, 0.17, 0.24, 0.31].forEach(y => b.l("sph", 0x2f3a1a, 0, y, 0.015, 0.008)); b.l("cyl", 0x8a8a2a, 0, 0.4, 0, 0.02, 0.03, 0.02); b.l("tor", 0xe5484d, 0, 0.0, 0, 0.018, 0.018, 0.018, PI / 2); },
    b => { b.rod(DWOOD, -0.12, 0.14, 0.02); b.l("sph", WOOD, 0, 0.17, 0, 0.07, 0.08, 0.03); b.l("cyl", WOOD, -0.075, 0.2, 0, 0.012, 0.32, 0.012, 0, 0, -0.08); b.l("cyl", WOOD, 0.075, 0.2, 0, 0.012, 0.32, 0.012, 0, 0, 0.08); b.l("box", BRASS, -0.1, 0.52, -0.01, 0.2, 0.025, 0.02); for (let i = 0; i < 4; i++) b.l("box", CREAM, -0.045 + i * 0.03, 0.2, 0, 0.004, 0.31, 0.004); },
    b => { b.rod(0x6b4423, -0.12, 0.6, 0.02); b.l("tor", 0x2f9e44, 0, 0.2, 0, 0.04, 0.04, 0.04, PI / 2); b.l("fru", GOLD, 0, 0.72, 0, 0.1, 0.12, 0.1, PI); b.l("sph", 0xb8860b, 0, 0.68, 0, 0.025); b.l("box", 0x38c6b0, -0.02, 0.58, 0.0, 0.015, 0.14, 0.01, 0, 0, 0.25); b.l("box", 0xff9ab0, 0.02, 0.58, 0, 0.015, 0.12, 0.01, 0, 0, -0.25); b.l("tor", BRASS, 0, 0.74, 0, 0.03, 0.03, 0.03, PI / 2); },
    b => { b.rod(0x5a3a1c, -0.12, 0.2, 0.02); b.l("arc", 0x6b4423, 0, 0.4, 0, 0.2, 0.2, 0.12, 0, 0, 2.2); for (let i = 0; i < 4; i++) b.l("box", CREAM, -0.08 + i * 0.05, 0.22 + i * 0.01, 0, 0.004, 0.18 + i * 0.03, 0.004); [[-0.16, 0.5, 0.5], [0.12, 0.62, -0.5], [-0.1, 0.62, 0.3]].forEach(l => b.l("sph", 0x3fb34f, l[0], l[1], 0, 0.045, 0.02, 0.07, 0, 0, l[2])); },
    b => { b.rod(GOLD, -0.12, 0.25, 0.02); b.l("arc", GOLD, 0, 0.5, 0, 0.22, 0.22, 0.12, 0, 0, 2.2); b.l("cyl", 0xb8860b, -0.2, 0.2, 0, 0.02, 0.55, 0.02); for (let i = 0; i < 5; i++) b.l("box", CREAM, -0.14 + i * 0.045, 0.3 + i * 0.01, 0, 0.004, 0.2 + i * 0.03, 0.004); b.g("sph", 0xffe14a, 0.04, 0.66, 0, 0.07); for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2; b.g("cone", 0xff9a3a, 0.04 + Math.cos(a) * 0.08, 0.66 + Math.sin(a) * 0.08, 0, 0.018, 0.07, 0.018, 0, 0, a - PI / 2); } b.halo(0xffd43b, 0.6, 0.66, true); },
    b => { b.rod(0xfdf3df, -0.12, 0.2, 0.02); b.l("arc", 0xfff0a8, 0, 0.46, 0, 0.24, 0.24, 0.14, 0, 0, 2.2); b.l("cyl", 0xe8c26a, -0.22, 0.2, 0, 0.02, 0.5, 0.02); RAINBOW.forEach((c, i) => b.g("box", c, -0.17 + i * 0.045, 0.26 + i * 0.012, 0, 0.005, 0.22 + i * 0.035, 0.005)); b.halo(0xffd0f0, 0.9, 0.5, true); b.orbit(["note", "note2"], [0xff9ab0, 0x7ee8c6], 3, 0.25, 0.5, 0.1, 2); },
    b => { b.rod(0xdff7f2, -0.12, 0.45, 0.02); b.l("arc", 0xbff0e8, 0, 0.55, 0, 0.14, 0.14, 0.1, 0, 0, 1.5); [[-0.12, 0.5], [0.0, 0.66], [0.12, 0.5]].forEach((l, i) => { b.l("cyl", 0xbff0e8, l[0], l[1] - 0.07, 0, 0.004, 0.07, 0.004); b.l("fru", i === 1 ? GOLD : 0xe8fffb, l[0], l[1] - 0.14, 0, 0.05, 0.07, 0.05, PI); b.g("sph", 0xfff6a8, l[0], l[1] - 0.15, 0, 0.012); }); b.g("sph", 0x9ff5e0, 0, 0.82, 0, 0.07); b.halo(0x7ee8c6, 0.9, 0.78, true); b.orbit(["note", "note2", "note"], 0xbff8ee, 3, 0.2, 0.7, 0.1, 2.2); },
    b => {   // World Tree Harp: thân cây vàng nâu + cành làm khung đàn, lá phát sáng, cánh hoa bay quanh
      b.l("cyl", 0x7a4b1c, 0, -0.14, 0, 0.032, 0.6, 0.032); b.l("cone", 0x5a3a1c, 0, -0.18, 0, 0.06, 0.1, 0.06, PI); b.l("cyl", 0x7a4b1c, 0, 0.3, 0, 0.022, 0.4, 0.022, 0, 0, 0.65); b.l("cyl", 0x7a4b1c, 0, 0.3, 0, 0.022, 0.4, 0.022, 0, 0, -0.65); b.l("cyl", 0x7a4b1c, 0, 0.3, 0, 0.02, 0.32, 0.02);
      for (let i = 0; i < 5; i++) b.g("box", 0xffe27a, -0.13 + i * 0.065, 0.36 + (i === 2 ? 0.05 : i % 3 === 0 ? 0 : 0.02), 0, 0.004, 0.22, 0.004);
      [[-0.24, 0.68], [0.24, 0.68], [0, 0.72], [-0.15, 0.6], [0.15, 0.6], [-0.3, 0.74], [0.3, 0.74], [0, 0.82]].forEach((l, i) => b.g("sph", i % 2 ? 0x7be36a : 0xb6f06a, l[0], l[1], 0, 0.045, 0.03, 0.06));
      b.halo(0x9aff9a, 1.1, 0.6, true); b.orbit("petal", [0xffb6d0, 0xfff0a0, 0xffffff], 5, 0.3, 0.6, 0.08, 1.8, 0.1);
    }
  ];
  const RAINBOW = [0xff5a5a, 0xffa23a, 0xffe14a, 0x4be08a, 0x4da3ff, 0xa78bfa];

  /* ---------- 🔥 RHYTHM ---------- */
  const stick = (b, c, tip, tilt, len, tr) => { b.l("cyl", c, 0, -0.1, 0, 0.014, len + 0.1, 0.014, 0, 0, tilt); const s = Math.sin(tilt), co = Math.cos(tilt); b.l("sph", tip, -s * len, co * len, 0, tr, tr * 0.9, tr); };
  const RHYTHM = [
    b => { stick(b, 0xd9c070, 0x8a6a2a, 0.0, 0.5, 0.022); stick(b, 0xc9b060, 0x8a6a2a, 0.32, 0.46, 0.022); },
    b => { stick(b, WOOD, 0xe5484d, 0.0, 0.52, 0.034); stick(b, WOOD, 0xe5484d, 0.34, 0.48, 0.034); b.l("tor", GOLD, 0, 0.1, 0, 0.022, 0.022, 0.022, PI / 2); },
    b => { b.rod(DWOOD, -0.12, 0.16, 0.025); b.l("tor", 0xc2410c, 0, 0.34, 0, 0.17, 0.17, 0.17); b.l("cyl", CREAM, 0, 0.34, -0.01, 0.16, 0.02, 0.16, PI / 2); for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2; b.l("cyl", GOLD, Math.sin(a) * 0.17, 0.34 + Math.cos(a) * 0.17, 0, 0.03, 0.01, 0.03, PI / 2); } const fl = []; for (let i = 0; i < 3; i++) { const c = new THREE.Mesh(TP.cone.clone(), new THREE.MeshBasicMaterial({ color: i === 1 ? 0xffc24a : 0xff6a1f, transparent: true, opacity: 0.85 })); c.scale.set(0.06, 0.18 + (i === 1 ? 0.06 : 0), 0.06); c.position.set((i - 1) * 0.07, 0.5, 0); b.root.add(c); fl.push(c); } b.root.userData.own = fl; b.flick(fl, [0.18, 0.24, 0.18]); },
    b => { b.l("box", 0x1f3a6b, -0.05, -0.1, -0.05, 0.1, 0.12, 0.1); b.l("box", 0x2c4f8f, -0.055, 0.02, -0.055, 0.11, 0.07, 0.11); for (let i = 0; i < 4; i++) b.l("sph", 0x9fb6d8, -0.04 + i * 0.027, 0.095, 0.05, 0.016); b.l("cyl", SILVER, -0.03, 0.08, 0, 0.012, 0.5, 0.012, 0, 0, 0.12); b.l("cyl", SILVER, 0.03, 0.08, 0, 0.012, 0.46, 0.012, 0, 0, -0.2); b.g("sph", 0x7fe3ff, -0.09, 0.6, 0, 0.03); b.g("sph", 0x7fe3ff, 0.12, 0.54, 0, 0.03); b.g("box", 0xffe14a, 0.0, 0.1, 0.08, 0.02, 0.1, 0.01, 0, 0, 0.5); b.g("box", 0xffe14a, 0.04, 0.2, 0.08, 0.02, 0.08, 0.01, 0, 0, -0.5); },
    b => { b.rod(IRON, -0.12, 0.15, 0.025); b.l("cyl", 0xb23a2a, 0, 0.18, 0, 0.12, 0.17, 0.12); b.l("tor", SILVER, 0, 0.18, 0, 0.12, 0.12, 0.12, PI / 2); b.l("tor", SILVER, 0, 0.35, 0, 0.12, 0.12, 0.12, PI / 2); b.l("cyl", CREAM, 0, 0.345, 0, 0.115, 0.012, 0.115); b.l("cyl", SILVER, -0.04, 0.4, 0, 0.012, 0.3, 0.012, 0, 0, 0.8); b.l("cyl", SILVER, 0.04, 0.4, 0, 0.012, 0.3, 0.012, 0, 0, -0.8); b.g("box", 0x7fe3ff, -0.14, 0.3, 0.05, 0.02, 0.14, 0.01, 0, 0, 0.5); b.g("box", 0x7fe3ff, 0.12, 0.34, -0.05, 0.02, 0.12, 0.01, 0, 0, -0.6); b.g("box", 0xffe14a, 0.0, 0.48, 0.08, 0.015, 0.1, 0.01, 0, 0, 0.3); b.halo(0x7fe3ff, 0.6, 0.35, true); },
    b => { b.l("cyl", 0x2b1a1a, 0, -0.1, 0, 0.018, 0.64, 0.018, 0, 0, 0); b.l("cyl", 0x2b1a1a, 0, -0.1, 0, 0.018, 0.58, 0.018, 0, 0, 0.3); for (let i = 0; i < 5; i++) { b.g("box", 0xff7a1f, -0.005, 0.0 + i * 0.1, 0.014, 0.012, 0.05, 0.004); } b.g("sph", 0xff5a1f, 0, 0.56, 0, 0.04); b.g("sph", 0xffd43b, -0.17, 0.54, 0, 0.04); b.halo(0xff7a1f, 0.7, 0.55, true); b.orbit("glow", 0xffa51f, 4, 0.12, 0.45, 0.07, 2.4, 0.15); },
    b => { b.rod(0x2a3b6b, -0.12, 0.15, 0.025); b.l("cyl", 0x3b6fd8, 0, 0.18, 0, 0.12, 0.17, 0.12); b.l("tor", 0xeaf6ff, 0, 0.18, 0, 0.12, 0.12, 0.12, PI / 2); b.l("tor", 0xeaf6ff, 0, 0.35, 0, 0.12, 0.12, 0.12, PI / 2); b.l("cyl", 0xf4fbff, 0, 0.345, 0, 0.115, 0.012, 0.115); b.l("cyl", 0xdff4ff, -0.04, 0.4, 0, 0.012, 0.32, 0.012, 0, 0, 0.8); b.l("cyl", 0xdff4ff, 0.04, 0.4, 0, 0.012, 0.32, 0.012, 0, 0, -0.8); b.g("cone", 0x9fd8ff, 0, 0.18, 0, 0.1, 0.5, 0.1, PI); b.g("cone", 0xffffff, 0, 0.18, 0, 0.05, 0.4, 0.05, PI); b.halo(0xbfe9ff, 0.9, 0.3, true); b.orbit("star", 0xdff4ff, 4, 0.2, 0.3, 0.1, 2.2); },
    b => {   // Phoenix Drums: trống vàng đỏ + cánh phượng + lửa
      b.rod(0x5a2a10, -0.12, 0.15, 0.026); b.l("cyl", 0xc2410c, 0, 0.18, 0, 0.12, 0.18, 0.12); b.l("tor", GOLD, 0, 0.18, 0, 0.12, 0.12, 0.12, PI / 2); b.l("tor", GOLD, 0, 0.36, 0, 0.12, 0.12, 0.12, PI / 2); b.l("cyl", 0xffe8b0, 0, 0.355, 0, 0.115, 0.012, 0.115);
      [-1, 1].forEach(sd => { [0.9, 0.55, 0.2, -0.15].forEach((ang, i) => { b.g("cone", i % 2 ? 0xffa51f : 0xff4a1f, sd * 0.13, 0.28 + i * 0.015, 0, 0.035, 0.2 - i * 0.025, 0.012, 0, 0, sd * (-1.2 - ang * 0.5) + 0); b.l("cone", i % 2 ? 0xffd43b : 0xe5484d, sd * 0.13, 0.28 + i * 0.015, 0, 0.04, 0.18 - i * 0.022, 0.012, 0, 0, -sd * (1.2 + ang * 0.5)); }); });
      const fl = []; for (let i = 0; i < 4; i++) { const c = new THREE.Mesh(TP.cone.clone(), new THREE.MeshBasicMaterial({ color: i % 2 ? 0xffd43b : 0xff5a1f, transparent: true, opacity: 0.85 })); c.scale.set(0.05, 0.2 + (i === 1 || i === 2 ? 0.1 : 0), 0.05); c.position.set((i - 1.5) * 0.06, 0.38, 0); b.root.add(c); fl.push(c); } b.root.userData.own = fl; b.flick(fl, [0.2, 0.3, 0.3, 0.2]);
      b.halo(0xff7a2e, 1.1, 0.35, true); b.orbit("glow", 0xffa51f, 6, 0.3, 0.35, 0.08, 2.8, 0.12);
    }
  ];

  /* ---------- ✨ MAESTRO (đũa nhạc trưởng): nốt nhạc bay quanh + vệt cầu vồng ---------- */
  const MAESTRO = [
    b => maestro(b, { shaft: 0xffffff, hand: 0xcfd8e3, band: 0x4da3ff, len: 0.55, tip: 0xbfe0ff, notes: 3, trail: 4, halo: 0x9fd0ff, ncol: [0xbfe0ff, 0xffffff] }),
    b => maestro(b, { shaft: 0xcffff0, hand: 0xe8c26a, band: 0x7ee8c6, len: 0.7, tip: 0x9fffe0, notes: 4, trail: 6, halo: 0x7ee8c6, ncol: [0x7ee8c6, 0xa78bfa, 0xffffff], ring: true }),
    b => maestro(b, { shaft: 0xfff6c8, hand: GOLD, band: 0xff5a5a, len: 0.9, tip: 0xffe27a, notes: 6, trail: 8, halo: 0xffd43b, ncol: RAINBOW, ring: true, crown: true, glowShaft: true })
  ];
  function maestro(b, o) {
    b.l("cyl", o.hand, 0, -0.12, 0, 0.025, 0.2, 0.025); b.l("sph", o.hand, 0, -0.12, 0, 0.04, 0.045, 0.04); b.l("tor", o.band, 0, 0.05, 0, 0.028, 0.028, 0.028, PI / 2);
    (o.glowShaft ? b.g : b.l).call(b, "cyl", o.shaft, 0, 0.07, 0, 0.011, o.len, 0.011);
    if (o.crown) for (let i = 0; i < 5; i++) { const a = i / 5 * PI * 2; b.g("cone", 0xfff1a8, Math.cos(a) * 0.04, o.len - 0.05, Math.sin(a) * 0.04, 0.012, 0.09, 0.012, Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5); }
    if (o.ring) b.g("tor", o.tip, 0, o.len + 0.07, 0, 0.05, 0.05, 0.05, PI / 2);
    const tipY = o.len + 0.08; b.g("sph", o.tip, 0, tipY, 0, 0.025); const star = b.spr("star", o.tip, 0.2 + o.notes * 0.01, 0, tipY, 0); b.halo(o.halo, 0.5 + o.notes * 0.08, tipY, true);
    b.an.push(t => { star.material.rotation = t * 1.5; star.scale.setScalar((0.2 + o.notes * 0.01) * (1 + 0.15 * Math.sin(t * 5))); });
    b.orbit(["note", "note2"], o.ncol, o.notes, 0.22 + o.notes * 0.02, tipY * 0.6, 0.11, 2.0, 0.08);
    // vệt cầu vồng: lưu vị trí đầu đũa (toạ độ thế giới) rồi vẽ lại theo toạ độ của vũ khí
    const N = o.trail, hist = [], sps = [], tip = new THREE.Vector3(0, tipY, 0); let acc = 0;
    for (let i = 0; i < N; i++) sps.push(b.spr("glow", RAINBOW[i % 6], 0.16 - i * 0.008));
    b.an.push((t, dt) => {
      acc += dt; if (acc > 0.025) { acc = 0; hist.unshift(b.root.localToWorld(tip.clone())); if (hist.length > N + 1) hist.pop(); }
      sps.forEach((s, i) => { const h = hist[i + 1]; if (!h) { s.visible = false; return; } s.visible = true; s.position.copy(b.root.worldToLocal(h.clone())); s.scale.setScalar((0.17 - i * 0.012) * (1 - i / N * 0.4)); });
    });
  }
  const LINES = { power: POWER, control: CONTROL, harmony: HARMONY, rhythm: RHYTHM };

  /* ---------- API ---------- */
  function make(item) {
    init();
    const w = item && item.weapon; if (!w) return new THREE.Group();
    const b = new Build(); b.root.name = "weapon";
    const tier = Math.max(1, Math.min(w.maestro || w.line === "all" ? 3 : 8, w.tier || 1));
    const fn = (w.maestro || w.line === "all") ? MAESTRO[tier - 1] : (LINES[w.line] || POWER)[tier - 1]; fn(b);
    const lm = bake(b.L, MAT_L), gm = bake(b.G, MAT_G); if (lm) b.root.add(lm); if (gm) b.root.add(gm);
    const g = b.root, an = b.an; let tt = Math.random() * 6;
    g.userData.upd = (dt, t) => { tt += dt || 0; an.forEach(f => f(tt, dt || 0)); };
    g.userData.hasAnim = an.length > 0; g.userData.bakes = [lm, gm].filter(Boolean);
    return g;
  }
  function dispose(g) {
    if (!g) return; (g.userData.bakes || []).forEach(m => m.geometry.dispose());
    (g.userData.own || []).forEach(m => { if (m.geometry) m.geometry.dispose(); if (m.material) m.material.dispose(); });
  }
  function findHand(root) {
    let slot = null, hand = null;
    root.traverse(o => { if (!o.isBone) return; const n = o.name.toLowerCase().replace(/[^a-z]/g, ""); if (/^handslot(r|right)$/.test(n)) slot = slot || o; else if (/^hand(r|right)$/.test(n)) hand = hand || o; });
    return slot || hand;
  }
  function doAttach(rec) {
    const ch = rec.ch, m = ch.userData && ch.userData.mesh; if (!m) return false;
    const bone = findHand(m); if (!bone) return false;
    m.updateMatrixWorld(true); const ws = bone.getWorldScale(new THREE.Vector3()), k = ws.x > 1e-4 ? 1 / ws.x : 1;
    rec.grp.scale.setScalar(k); rec.grp.position.set(0, 0, 0); rec.grp.rotation.set(0, 0, PI / 2 - 0.3);   // trục xương tay: X hướng xuống, Y hướng trước → xoay để vũ khí chĩa lên, nghiêng nhẹ về trước
    bone.add(rec.grp); rec.mesh = m; rec.bone = bone; rec.boneName = bone.name; return true;
  }
  function attach(ch, grp) {
    init(); if (!ch || !grp) return false;
    let rec = ATT.find(r => r.ch === ch);
    if (rec && rec.grp !== grp) { detach(ch); rec = null; }
    if (!rec) { rec = { ch, grp, mesh: null, bone: null, t: 0 }; ATT.push(rec); }
    return doAttach(rec);
  }
  function detach(ch) {
    const i = ATT.findIndex(r => r.ch === ch); if (i < 0) return; const rec = ATT[i]; ATT.splice(i, 1);
    if (rec.grp.parent) rec.grp.parent.remove(rec.grp); dispose(rec.grp);
  }
  function tick(dt, t) {
    retryT += dt; const retry = retryT > 0.4; if (retry) retryT = 0;
    for (let i = 0; i < ATT.length; i++) {
      const rec = ATT[i], ch = rec.ch;
      if (retry && (!rec.mesh || ch.userData.mesh !== rec.mesh || !rec.grp.parent)) doAttach(rec);   // nhân vật đổi mô hình / chưa tải xong → gắn lại
      if (rec.grp.parent && rec.grp.userData.upd) rec.grp.userData.upd(dt, t);
    }
  }
  return { make, attach, detach, tick, dispose, _attached: () => ATT.map(r => r.boneName) };
})();
