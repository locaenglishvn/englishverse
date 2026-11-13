/* EnglishVerse – nội thất "hospital" (layout: "hospital"). Tách khỏi index.html để mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, textPlate, signText, pot…) – chúng có sẵn khi nội thất được dựng. */
/* CITY HOSPITAL – bệnh viện lớn 60 × 72 m, trần cao 6 m, tường trắng – xanh nhạt, viền xanh bạc hà, mọi bảng có tiếng Anh + tiếng Việt.
   Toạ độ trong file này TÍNH TỪ GIỮA PHÒNG (x: −30…30, z: −36…36; cửa chính ở z = +36).
   🏥 Sảnh (z 10…36): quầy đăng ký 1-2-3, màn hình số thứ tự, máy lấy số, ghế chờ, quầy thông tin, sơ đồ bệnh viện, quầy quà & hoa,
      nhà thuốc (x 20…30, z 10…24, có cửa sổ phát thuốc, kệ hộp thuốc, tủ lạnh)
   🛤️ Hành lang giữa (x −5…5, z −36…10): vạch màu chỉ đường từ cửa chính tới từng khoa, trạm y tá ở cuối hành lang, cửa sổ nhìn vào phòng mổ
   Bên trái (tây) từ trước ra sau: Cấp cứu (giường rèm, xe cứu thương, cổng xe) · Nhi (đồ chơi, thước đo chiều cao) · Nha · Mắt
   Bên phải (đông) từ trước ra sau: X-quang · Xét nghiệm (có góc "Pasteur's Lab") · Phòng mổ (chỉ nhìn qua kính) · Buồng bệnh
   Camera bị giữ trong khu đang đứng (P.zones). */
function furnishHospital(P, g, cx, cz, W, D, fur) {
  const H = 6, T = 0.3, S = P.room.solids, PI = Math.PI;
  const R = new THREE.Group(); R.position.set(cx, 0, cz); g.add(R);   // mọi thứ dựng trong R, toạ độ tính từ giữa phòng
  const bb = q => (w, h, d, c, x, y, z) => lb(q, w, h, d, c, x, y + h / 2, z);   // hộp: y = mép dưới
  const B = bb(R);
  const cy = (q, r, h, c, x, y, z, seg) => lc(q, r, r, h, c, x, y + h / 2, z, seg || 14);
  const sol = (x, z, hw, hd) => S.push({ x: cx + x, z: cz + z, hw, hd });
  const solR = (x, z, hw, hd, ry) => { const sw = Math.abs(Math.sin(ry || 0)) > 0.7; sol(x, z, sw ? hd : hw, sw ? hw : hd); };
  const SB = (w, h, d, c, x, y, z) => { sol(x, z, w / 2, d / 2); return B(w, h, d, c, x, y, z); };
  const grp = (x, z, ry, y) => { const q = new THREE.Group(); q.position.set(x, y || 0, z); q.rotation.y = ry || 0; R.add(q); return q; };
  const WC = 0xe2edf1, MINT = 0x8fe0cb, MINTD = 0x2fb894, STEEL = 0x90a4ae, DARK = 0x37474f, WHITE = 0xffffff;
  const GLASS = mat(0xcdeaf7, { transparent: true, opacity: 0.3 }), LIGHT = mat(0xfdfefe, { emissive: 0xdcecf3 });
  const DEP = {   // các khu: hình chữ nhật, màu viền tường, màu sàn
    er: { x0: -30, x1: -5, z0: -4, z1: 10, col: 0xff8a8a, fl: 0xfdeaea }, peds: { x0: -30, x1: -5, z0: -16, z1: -4, col: 0xffd45e, fl: 0xfff4cc },
    dent: { x0: -30, x1: -5, z0: -26, z1: -16, col: 0x6fd6c2, fl: 0xdff6f0 }, eye: { x0: -30, x1: -5, z0: -36, z1: -26, col: 0xb39ddb, fl: 0xece8f8 },
    xray: { x0: 5, x1: 30, z0: -4, z1: 10, col: 0x90a4ce, fl: 0xe3eaf6 }, lab: { x0: 5, x1: 30, z0: -16, z1: -4, col: 0x7fd68a, fl: 0xe5f6e7 },
    or: { x0: 5, x1: 30, z0: -26, z1: -16, col: 0x4fc3c9, fl: 0xd6f0ee }, ward: { x0: 5, x1: 30, z0: -36, z1: -26, col: 0x7cc7f0, fl: 0xe6f4fc },
    pharm: { x0: 20, x1: 30, z0: 10, z1: 24, col: 0x5fd08a, fl: 0xe2f6ea }, corr: { x0: -5, x1: 5, z0: -36, z1: 10, col: MINT, fl: 0xeef7f9 },
    lobby: { x0: -30, x1: 30, z0: 10, z1: 36, col: MINT, fl: 0xe1f0f6 }
  };
  const Zr = d => ({ x0: cx + d.x0, x1: cx + d.x1, z0: cz + d.z0, z1: cz + d.z1 });
  P.zones = ["pharm", "er", "peds", "dent", "eye", "xray", "lab", "or", "ward", "corr", "lobby"].map(k => Zr(DEP[k]));   // khu nhỏ đứng trước (find lấy khu đầu tiên chứa người chơi)
  P.keeperPos = [-14, 12.2];   // Y tá Mai: sau quầy đăng ký
  /* ---------- SÀN: 1 ảnh ô gạch dùng chung, mỗi khu 1 màu ---------- */
  const gridT = skin(1.2, 1.2, 40, (x, w, h) => { x.fillStyle = "#ffffff"; x.fillRect(0, 0, w, h); x.fillStyle = "#c3d8e0"; x.fillRect(0, 0, w, 0.03); x.fillRect(0, 0, 0.03, h); });
  gridT.wrapS = gridT.wrapT = THREE.RepeatWrapping;
  const FM = {}, fmat = c => FM[c] || (FM[c] = new THREE.MeshLambertMaterial({ color: new THREE.Color(c).multiplyScalar(0.8), map: gridT }));
  const floorRect = (x0, x1, z0, z1, c, y, plain) => {
    const geo = new THREE.PlaneGeometry(x1 - x0, z1 - z0), uv = geo.attributes.uv;
    if (!plain) for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * (x1 - x0) / 1.2, uv.getY(i) * (z1 - z0) / 1.2);
    const m = new THREE.Mesh(geo, plain ? mat(c) : fmat(c)); m.rotation.x = -PI / 2; m.position.set((x0 + x1) / 2, y || 0.01, (z0 + z1) / 2); R.add(m); return m;
  };
  const base = g.children[0]; base.material = fmat(0xeaf3f7); { const uv = base.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * W / 1.2, uv.getY(i) * D / 1.2); }
  Object.values(DEP).forEach(d => floorRect(d.x0, d.x1, d.z0, d.z1, d.fl));
  const strip = (x0, x1, z0, z1, c) => floorRect(x0, x1, z0, z1, c, 0.02, true);   // vạch / thảm phẳng nằm sàn
  /* ---------- BIỂN CHỮ + TRANH: chất liệu dùng chung theo nội dung (gộp được khi bake) ---------- */
  const SC = new Map(), sgn = (t, w, h, bg, fg, x, y, z, ry) => {
    const k = [t, w, h, bg, fg].join("|"); let m = SC.get(k); if (!m) { const p = textPlate(t, w, h, bg, fg); m = p.material; p.geometry.dispose(); SC.set(k, m); }
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); p.rotation.y = ry || 0; R.add(p); return p;
  };
  const DM = new Map(), pic = (tex, w, h, x, y, z, ry, basic) => {
    let m = DM.get(tex); if (!m) { m = basic ? new THREE.MeshBasicMaterial({ map: tex }) : new THREE.MeshLambertMaterial({ map: tex }); DM.set(tex, m); }
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); p.rotation.y = ry || 0; R.add(p); return p;
  };
  const ell = (x, c, a, b, rx, ry) => { x.fillStyle = c; x.beginPath(); x.ellipse(a, b, rx, ry, 0, 0, 7); x.fill(); };
  /* ---------- TƯỜNG: hộp mỏng, chừa cửa (door: y0 = 0) hoặc ô kính (glass); viền màu 2 mặt ---------- */
  const wall = (ax, k, a, b, cuts, cA, cB) => {   // ax "x": tường chạy theo x tại z = k; ax "z": chạy theo z tại x = k. cA = viền bên nhỏ hơn, cB = bên lớn hơn
    const X = ax === "x"; cuts = (cuts || []).slice().sort((p, q) => p.c - q.c);
    const part = (u0, u1, y0, y1, band) => {
      const len = u1 - u0; if (len < 0.02 || y1 - y0 < 0.02) return; const m = (u0 + u1) / 2;
      B(X ? len : T, y1 - y0, X ? T : len, WC, X ? m : k, y0, X ? k : m);
      if (band) [[cA, -1], [cB, 1]].forEach(([c, s]) => { if (c == null) return; const o = s * (T / 2 + 0.02); B(X ? len : 0.04, Math.min(1, y1), X ? 0.04 : len, c, X ? m : k + o, 0, X ? k + o : m); });
    };
    const solSeg = (u0, u1) => { if (u1 - u0 > 0.05) X ? sol((u0 + u1) / 2, k, (u1 - u0) / 2, T / 2) : sol(k, (u0 + u1) / 2, T / 2, (u1 - u0) / 2); };
    let u = a, su = a;
    cuts.forEach(c => {
      const u0 = c.c - c.w / 2, u1 = c.c + c.w / 2, door = !c.y0; part(u, u0, 0, H, 1);
      if (c.y0 > 0) part(u0, u1, 0, c.y0, 1); if (c.y1 < H) part(u0, u1, c.y1, H, 0);
      if (c.glass) { const m = (u0 + u1) / 2; B(X ? c.w : 0.05, c.y1 - c.y0, X ? 0.05 : c.w, GLASS, X ? m : k, c.y0, X ? k : m); }
      if (door) { solSeg(su, u0); su = u1; [u0 + 0.07, u1 - 0.07].forEach(v => B(X ? 0.14 : T + 0.1, c.y1, X ? T + 0.1 : 0.14, MINT, X ? v : k, 0, X ? k : v)); }
      u = u1;
    });
    part(u, b, 0, H, 1); solSeg(su, b);
  };
  const dr = (c, w) => ({ c, w: w || 3.4, y0: 0, y1: 2.9 }), win = (c, w, y0, y1) => ({ c, w, y0: y0 || 1.3, y1: y1 || 3.6, glass: true });
  const D_ = DEP;
  // tường ngoài: trước (cửa chính + cửa sổ), sau, tây, đông
  wall("x", 35.85, -30, 30, [{ c: 0, w: 6, y0: 0, y1: 3.4 }, win(-24, 6), win(-16, 6), win(-8, 6), win(8, 6), win(16, 6), win(24, 6)], MINT, null);
  wall("x", -35.85, -30, -5, [win(-24, 5), win(-13, 5)], null, D_.eye.col); wall("x", -35.85, -5, 5, [win(0, 6, 1.4, 3.6)], null, MINT); wall("x", -35.85, 5, 30, [win(9, 4, 1.6), win(18, 4, 1.6), win(27, 4, 1.6)], null, D_.ward.col);
  wall("z", -29.85, 10, 36, [win(31, 4)], null, MINT); wall("z", -29.85, -4, 10, [], null, D_.er.col); wall("z", -29.85, -16, -4, [win(-10, 5)], null, D_.peds.col);
  wall("z", -29.85, -26, -16, [win(-21, 4)], null, D_.dent.col); wall("z", -29.85, -36, -26, [], null, D_.eye.col);
  wall("z", 29.85, 24, 36, [], MINT, null); wall("z", 29.85, 10, 24, [], D_.pharm.col, null); wall("z", 29.85, -4, 10, [], D_.xray.col, null); wall("z", 29.85, -16, -4, [], D_.lab.col, null);
  wall("z", 29.85, -26, -16, [], D_.or.col, null); wall("z", 29.85, -36, -26, [win(-31, 5)], D_.ward.col, null);
  // hành lang: tường tây (x = −5) và đông (x = 5), mỗi khu 1 cửa
  [["er", 3.5], ["peds", -10], ["dent", -21], ["eye", -31]].forEach(([k, z]) => wall("z", -5, D_[k].z0, D_[k].z1, [dr(z)], D_[k].col, MINT));
  wall("z", 5, -4, 10, [dr(3.5)], MINT, D_.xray.col); wall("z", 5, -16, -4, [dr(-10)], MINT, D_.lab.col);
  wall("z", 5, -26, -16, [win(-21, 7, 1.0, 3.6)], MINT, D_.or.col); wall("z", 5, -36, -26, [dr(-31)], MINT, D_.ward.col);   // phòng mổ: chỉ nhìn qua kính
  // vách ngang giữa các khu + vách sảnh
  wall("x", 10, -30, -5, [], D_.er.col, MINT); wall("x", 10, 5, 20, [], D_.xray.col, MINT); wall("x", 10, 20, 30, [], D_.xray.col, D_.pharm.col);
  B(10, 2.4, T, WC, 0, 3.6, 10);   // dầm trên lối vào hành lang
  wall("x", -4, -30, -5, [], D_.peds.col, D_.er.col); wall("x", -16, -30, -5, [], D_.dent.col, D_.peds.col); wall("x", -26, -30, -5, [], D_.eye.col, D_.dent.col);
  wall("x", -4, 5, 30, [], D_.lab.col, D_.xray.col); wall("x", -16, 5, 30, [], D_.or.col, D_.lab.col); wall("x", -26, 5, 30, [], D_.ward.col, D_.or.col);
  // nhà thuốc: cửa vào + cửa sổ phát thuốc nhìn ra sảnh
  wall("z", 20, 10, 24, [dr(12.7, 2.8), win(19.4, 8.6, 1.0, 3.2)], MINT, D_.pharm.col); wall("x", 24, 20, 30, [], D_.pharm.col, MINT);
  B(T + 0.02, 0.1, 8.6, STEEL, 20, 3.2, 19.4);
  /* ---------- TRẦN + ĐÈN ---------- */
  B(W, 0.06, D, mat(0xdde9ee, { emissive: 0x6f8794 }), 0, H - 0.06, 0);
  Object.values(DEP).forEach(d => { if (d === DEP.lobby) return; const nx = Math.max(1, Math.round((d.x1 - d.x0) / 7)), nz = Math.max(1, Math.round((d.z1 - d.z0) / 6));
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) B(1.8, 0.04, 0.5, LIGHT, d.x0 + (i + 0.5) * (d.x1 - d.x0) / nx, H - 0.1, d.z0 + (j + 0.5) * (d.z1 - d.z0) / nz); });
  for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) { const x = -26 + i * 7.5 + 0.5; if (x > 20 && j < 2) continue; B(1.8, 0.04, 0.5, LIGHT, x, H - 0.1, 14 + j * 7); }
  /* ---------- VẠCH MÀU CHỈ ĐƯỜNG: từ cửa chính tới từng khoa (làn tây ngoài cùng rẽ trước, nên không cắt nhau) ---------- */
  [[0xe5484d, -1, 3.5, -1.75], [0xffb020, -1, -10, -1.25], [0x2fb894, -1, -21, -0.75], [0x8b6fd6, -1, -31, -0.25], [0x3b82f6, 1, 3.5, 1.75], [0x37b24d, 1, -10, 1.25], [0xe879a8, 1, -31, 0.75]].forEach(([c, s, z, lx]) => {
    strip(lx - 0.14, lx + 0.14, z, 34.4, c); strip(Math.min(lx, s * 9), Math.max(lx, s * 9), z - 0.14, z + 0.14, c); });
  strip(-2.2, 2.2, 33.2, 35.2, 0x8fe0cb);   // thảm đón khách
  /* ---------- BIỂN HIỆU HÀNH LANG (trên cửa từng khoa) ---------- */
  [["EMERGENCY · CẤP CỨU", 3.5, "#d6333a", "#fff", -1], ["PEDIATRICS · NHI KHOA", -10, "#ffb020", "#3a2a00", -1], ["DENTIST · NHA KHOA", -21, "#1aa58f", "#fff", -1], ["EYE CLINIC · NHÃN KHOA", -31, "#7e5bd1", "#fff", -1],
   ["X-RAY · CHỤP X-QUANG", 3.5, "#3b66c4", "#fff", 1], ["LABORATORY · XÉT NGHIỆM", -10, "#2f9e44", "#fff", 1], ["OPERATING ROOM · PHÒNG MỔ", -21, "#14a3ad", "#fff", 1], ["PATIENT WARD · BUỒNG BỆNH", -31, "#2b8fd6", "#fff", 1]]
    .forEach(([t, z, bg, fg, s]) => sgn(t, 4.8, 0.7, bg, fg, s * 4.83, t[0] === "O" ? 4.6 : 3.9, z, s < 0 ? PI / 2 : -PI / 2));
  /* ===== SẢNH ===== */
  const counter = (xc, z, len, face) => { SB(len, 1.0, 1.0, WHITE, xc, 0, z); B(len + 0.1, 0.06, 1.2, 0xdde6ea, xc, 1.0, z); B(len, 0.8, 0.05, face || MINTD, xc, 0.1, z + 0.52); };
  const hang = (t, w, x, y, z, ry, bg, fg) => { sgn(t, w, 0.6, bg, fg, x, y, z + 0.03, ry); sgn(t, w, 0.6, bg, fg, x, y, z - 0.03, ry + PI); [-1, 1].forEach(s => B(0.03, H - y - 0.3, 0.03, STEEL, x + s * (w / 2 - 0.3) * Math.cos(ry), y + 0.3, z)); };   // biển treo trần 2 mặt
  const monitor = (x, y, z, ry, tex) => { B(0.5, 0.35, 0.05, DARK, x, y, z); pic(tex, 0.44, 0.3, x + Math.sin(ry) * 0.03, y + 0.175, z + Math.cos(ry) * 0.03, ry, true); };
  const monTex = skin(0.5, 0.35, 120, (x, w, h) => { x.fillStyle = "#04140f"; x.fillRect(0, 0, w, h); x.strokeStyle = "#35e08a"; x.lineWidth = 0.02; x.beginPath(); x.moveTo(0.02, 0.2); x.lineTo(0.14, 0.2); x.lineTo(0.18, 0.1); x.lineTo(0.23, 0.3); x.lineTo(0.27, 0.2); x.lineTo(0.48, 0.2); x.stroke(); signText(x, "72", 0.4, 0.07, 0.15, 0.07, "#8dffc0"); });
  // quầy đăng ký 1-2-3 (z = 14), nhân viên đứng phía sau (z 10…13.5)
  counter(-17, 14, 18); [-20, -14].forEach(x => B(0.05, 0.9, 0.9, GLASS, x, 1.06, 14)); B(18, 0.05, 0.05, STEEL, -17, 1.95, 14);
  [-23, -17, -11].forEach((x, i) => { hang(String(i + 1), 0.7, x, 3.3, 14.3, 0, "#2fb894", "#fff"); B(0.5, 0.3, 0.05, DARK, x, 1.1, 13.3); });
  B(18, 0.8, 0.7, 0xe8d9bd, -17, 0, 10.6);   // bàn làm việc sau quầy
  sgn("REGISTRATION · ĐĂNG KÝ KHÁM", 8, 0.9, "#2fb894", "#fff", -17, 4.6, 10.17, 0);
  // quầy thông tin
  counter(12, 14, 10, 0x3b9ae1); sgn("INFORMATION · THÔNG TIN", 6, 0.8, "#2b7bb9", "#fff", 12, 4.4, 10.17, 0); B(0.7, 0.45, 0.05, 0xfff3bf, 9.5, 1.06, 14.2); B(0.08, 0.5, 0.2, 0xffffff, 14.2, 1.06, 14.0);
  // màn hình số thứ tự trên lối vào hành lang
  const qT = skin(5, 1.6, 80, (x, w, h) => { x.fillStyle = "#082a44"; x.fillRect(0, 0, w, h); signText(x, "NOW SERVING · MỜI SỐ", 1.6, 0.3, 3, 0.26, "#ffd43b"); signText(x, "023", 1.4, 1.0, 2.4, 1.0, "#59f59b"); signText(x, "COUNTER 2", 3.7, 0.55, 2.2, 0.32, "#ffffff"); signText(x, "QUẦY 2", 3.7, 0.98, 2.2, 0.32, "#a5d8ff"); signText(x, "NEXT · TIẾP: 024  025  026", 3.1, 1.4, 4.4, 0.2, "#9fb9cc"); });
  B(5.3, 1.8, 0.08, DARK, 0, 3.9, 10.2); pic(qT, 5, 1.6, 0, 4.0, 10.26, 0, true);
  // máy lấy số + sơ đồ bệnh viện
  SB(0.5, 1.3, 0.45, 0x3b9ae1, -6.4, 0, 17); B(0.38, 0.25, 0.04, 0xffffff, -6.4, 0.95, 17.25);
  const dirT = skin(6, 2.6, 70, (x, w, h) => { x.fillStyle = "#f4fbfd"; x.fillRect(0, 0, w, h); x.fillStyle = "#2fb894"; x.fillRect(0, 0, w, 0.6); signText(x, "DIRECTORY · SƠ ĐỒ BỆNH VIỆN", w / 2, 0.32, 5.6, 0.36, "#ffffff");
    [["Emergency · Cấp cứu", "#e5484d", "← left"], ["Pediatrics · Nhi khoa", "#ffb020", "← left"], ["Dentist · Nha khoa", "#2fb894", "← left"], ["Eye Clinic · Nhãn khoa", "#8b6fd6", "← left"],
     ["X-ray · Chụp X-quang", "#3b82f6", "right →"], ["Laboratory · Xét nghiệm", "#37b24d", "right →"], ["Operating Room · Phòng mổ", "#14a3ad", "right →"], ["Patient Ward · Buồng bệnh", "#e879a8", "right →"], ["Pharmacy · Nhà thuốc", "#5fd08a", "right →"], ["Nurses' Station · Y tá", "#7cc7f0", "straight ↑"]]
      .forEach(([t, c, a], i) => { const col = i < 5 ? 0 : 1, row = i % 5, X0 = 0.25 + col * 2.9, Y0 = 0.95 + row * 0.33; ell(x, c, X0 + 0.12, Y0, 0.1, 0.1); x.textAlign = "left"; signText(x, t, X0 + 1.6, Y0, 2.0, 0.2, "#243b4a"); x.textAlign = "left"; signText(x, a, X0 + 2.6, Y0 + 0.17, 0.9, 0.12, "#6b7f8c"); }); });
  B(6.2, 2.8, 0.08, STEEL, 29.7, 1.1, 30.5).rotation.y = 0; R.children[R.children.length - 1].scale.set(0.0129, 1, 1);
  pic(dirT, 6, 2.6, 29.66, 2.5, 30.5, -PI / 2);
  // ghế chờ (hướng về quầy), bàn tạp chí, cây xanh
  [[-20, 26], [-20, 28.5], [-12, 26], [-12, 28.5], [12, 26], [12, 28.5], [20, 26], [20, 28.5]].forEach(([x, z], i) => { const n = 6, p = 0.56, x0 = x - (n - 1) * p / 2, c = i % 2 ? 0x4aa3df : MINTD;
    for (let k = 0; k < n; k++) { const cx_ = x0 + k * p; B(0.5, 0.07, 0.5, c, cx_, 0.45, z); B(0.5, 0.5, 0.06, c, cx_, 0.5, z + 0.22); B(0.06, 0.45, 0.06, STEEL, cx_, 0, z); } sol(x, z, n * p / 2, 0.3); });
  [-16, 16].forEach(x => { SB(0.8, 0.45, 0.8, 0xe8d9bd, x, 0, 27.2); B(0.3, 0.03, 0.22, 0xff6b6b, x - 0.1, 0.45, 27.2); });
  [[-27.5, 33.5], [27.5, 33.5], [-27.5, 12], [-6, 34], [6, 34], [27, 27]].forEach(([x, z]) => { pot(R, x, z, 1.6); sol(x, z, 0.4, 0.4); });
  // quầy quà tặng & hoa ở tường tây
  SB(1.0, 1.0, 8, WHITE, -27.6, 0, 20.5); B(1.2, 0.06, 8.2, 0xdde6ea, -27.6, 1.0, 20.5); B(0.05, 0.8, 8, 0xf7a8c8, -27.1, 0.1, 20.5);
  SB(0.5, 2.3, 8, 0xe3ebef, -29.5, 0, 20.5);
  for (let i = 0; i < 8; i++) { const z = 17 + i + 0.5, col = [0xff6b81, 0xffd43b, 0xff9ff3, 0x74c0fc][i % 4]; B(0.04, 0.35, 0.04, 0x37b24d, -29.1, 1.0, z); const f = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), mat(col)); f.position.set(-29.1, 1.5, z); R.add(f);
    const t = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), mat(i % 2 ? 0xc68642 : 0xf0e0c0)); t.position.set(-29.1, 1.95 + 0.05, z); R.add(t); }
  sgn("GIFTS & FLOWERS · QUÀ & HOA", 5, 0.7, "#e64980", "#fff", -29.68, 3.4, 20.5, PI / 2);
  // cửa chính: kính trượt mở nửa, biển EXIT
  [-1, 1].forEach(s => { B(1.2, 2.8, 0.05, GLASS, s * 2.4, 0, 35.85); B(0.08, 2.8, 0.08, STEEL, s * 1.8, 0, 35.85); });
  sgn("EXIT · LỐI RA", 3.4, 0.5, "#1e9e63", "#fff", 0, 4.1, 35.68, PI); sgn("CITY HOSPITAL · BỆNH VIỆN THÀNH PHỐ", 8.5, 0.8, "#2fb894", "#fff", 0, 5.0, 35.68, PI);
  [-3.9, 3.9].forEach(x => { SB(0.3, 1.1, 0.3, 0xeceff1, x, 0, 34.8); B(0.2, 0.3, 0.16, 0x4aa3df, x, 1.1, 34.8); });   // gel rửa tay
  // xe lăn đậu ở sảnh
  const wheelchair = (x, z, ry) => { const q = grp(x, z, ry), b = bb(q); b(0.5, 0.06, 0.5, 0x3b9ae1, 0, 0.5, 0); b(0.5, 0.55, 0.05, 0x3b9ae1, 0, 0.5, 0.25); b(0.06, 0.3, 0.4, DARK, -0.28, 0.6, 0); b(0.06, 0.3, 0.4, DARK, 0.28, 0.6, 0);
    [-0.3, 0.3].forEach(s => { const w = cy(q, 0.32, 0.04, DARK, s, 0, 0.18, 14); w.rotation.z = PI / 2; w.position.y = 0.32; const f = cy(q, 0.1, 0.04, DARK, s * 0.8, 0, -0.3, 10); f.rotation.z = PI / 2; f.position.y = 0.1; }); solR(x, z, 0.4, 0.4, ry); };
  wheelchair(-8.5, 33.5, PI); wheelchair(-9.3, 33.5, PI);
  /* ===== NHÀ THUỐC ===== */
  sgn("PHARMACY · NHÀ THUỐC", 6, 0.8, "#2f9e44", "#fff", 19.84, 4.3, 19.4, -PI / 2); sgn("✚", 0.9, 0.9, "#2f9e44", "#fff", 19.84, 4.3, 14.2, -PI / 2);
  SB(0.5, 1.0, 8.6, MINT, 19.5, 0, 19.4); SB(1.0, 1.0, 8.6, WHITE, 21, 0, 19.4); B(1.1, 0.06, 8.7, 0xdde6ea, 21, 1.0, 19.4);
  B(0.4, 0.3, 0.4, DARK, 21, 1.06, 17); B(0.5, 0.05, 0.4, 0xdddddd, 21, 1.06, 21.5);   // máy tính tiền, cân
  const meds = [0xff8787, 0x74c0fc, 0xffd43b, 0x69db7c, 0xb197fc, 0xffa94d, 0x66d9e8, 0xf783ac];
  const shelfUnit = (xc, z, w, d, rot, rows, fx) => { const q = grp(xc, z, rot ? PI / 2 : 0), b = bb(q); b(w, 2.3, d, 0xe3ebef, 0, 0, 0); const sx = d > 0.6 ? 1 : 0;
    for (let r = 0; r < rows; r++) for (let i = 0; i < Math.floor(w / 0.42); i++) { const c = meds[(i * 3 + r * 5) % meds.length]; [1, -1].forEach(s => { if (d < 0.7 && s < 0) return; b(0.34, 0.26, 0.12, c, -w / 2 + 0.3 + i * 0.42, 0.3 + r * 0.42, s * (d / 2 + 0.06) * (fx || 1)); }); }
    solR(xc, z, rot ? d / 2 : w / 2, rot ? w / 2 : d / 2, 0); };
  shelfUnit(29.45, 17, 12, 0.5, true, 5); shelfUnit(25, 10.45, 8, 0.5, false, 5); shelfUnit(25.5, 17.5, 6, 1.0, true, 4);
  SB(0.8, 1.9, 0.7, WHITE, 29.4, 0, 22.6); B(0.6, 1.3, 0.04, GLASS, 29.05, 0.4, 22.6);   // tủ lạnh vắc-xin
  floorRect(20, 30, 10, 24, 0xe2f6ea, 0.011, true).visible = false;
  /* ===== HÀNH LANG ===== */
  [[-4.55, -3], [4.55, -3], [-4.55, 7.8], [4.55, 7.8]].forEach(([x, z]) => { SB(0.5, 0.45, 2.4, 0x4aa3df, x, 0, z); B(0.1, 0.5, 2.4, 0x4aa3df, x + Math.sign(x) * 0.2, 0.45, z); });
  SB(0.12, 0.08, 6.6, STEEL, 4.5, 0.85, -21); [-3.2, 3.2].forEach(d => B(0.08, 0.85, 0.08, STEEL, 4.5, 0, -21 + d));   // lan can ngắm phòng mổ
  sgn("QUIET PLEASE · GIỮ YÊN LẶNG", 3.6, 0.5, "#e3f2fd", "#2b7bb9", 4.83, 2.0, -17.3, -PI / 2);
  wheelchair(3.9, 5.6, -PI / 2);
  /* ===== TRẠM Y TÁ (cuối hành lang) ===== */
  counter(0, -32, 5, 0x7cc7f0); B(5.2, 0.5, 0.06, WHITE, 0, 1.06, -31.55); B(0.5, 0.3, 0.05, DARK, -1.2, 1.1, -31.8); B(0.5, 0.3, 0.05, DARK, 1.2, 1.1, -31.8); B(0.16, 0.1, 0.16, 0xffd43b, 2.0, 1.06, -31.7);
  B(6, 0.8, 0.7, 0xe8d9bd, 0, 0, -35.4); sgn("NURSES' STATION · TRẠM Y TÁ", 6, 0.8, "#2b8fd6", "#fff", 0, 4.5, -35.68, 0);
  SB(0.8, 0.9, 0.5, 0xe5484d, -3.8, 0, -34.5);   // xe thuốc
  B(2.4, 1.1, 0.04, 0xffffff, 3.4, 1.4, -35.72); B(2.5, 1.2, 0.03, STEEL, 3.4, 1.35, -35.73);
  /* ===== CẤP CỨU ===== */
  sgn("EMERGENCY · CẤP CỨU", 7, 0.9, "#d6333a", "#fff", -29.68, 4.8, 2, PI / 2); sgn("AMBULANCE BAY · CỔNG XE CỨU THƯƠNG", 6.4, 0.6, "#fff", "#d6333a", -29.68, 3.95, 4, PI / 2);
  B(0.06, 3.5, 6.6, 0xdbe3e8, -29.7, 0, 4); for (let y = 0.35; y < 3.4; y += 0.35) B(0.09, 0.04, 6.6, 0xc3ced4, -29.7, y, 4); B(0.1, 0.25, 6.6, 0xe5484d, -29.7, 3.25, 4);
  { const q = grp(-26.4, 4.2, 0), b = bb(q);   // xe cứu thương: đầu xe về +x
    b(3.8, 1.9, 2.0, WHITE, -0.7, 0.45, 0); b(1.5, 1.05, 1.95, WHITE, 2.0, 0.45, 0); b(0.1, 0.6, 1.7, 0x2b4a63, 2.78, 0.95, 0); b(1.0, 0.55, 2.0, 0x2b4a63, 2.2, 1.5, 0);
    [-1.02, 1.02].forEach(s => { b(3.8, 0.2, 0.03, 0xe5484d, -0.7, 1.3, s); b(0.7, 0.2, 0.03, 0xe5484d, -0.7, 1.55, s); b(0.2, 0.7, 0.03, 0xe5484d, -0.7, 1.3, s); b(1.0, 0.4, 0.03, 0x2b4a63, 0.2, 1.6, s);
      [-1.5, 1.8].forEach(wx => { const w = cy(q, 0.4, 0.22, DARK, wx, 0, s * 0.95, 16); w.rotation.x = PI / 2; w.position.y = 0.4; }); });
    b(0.3, 0.12, 0.4, 0xe5484d, 1.9, 2.35, -0.4); b(0.3, 0.12, 0.4, 0x2b7bd6, 1.9, 2.35, 0.4); sol(-26.4 - 0.6, 4.2, 2.9, 1.1); }
  [0, 1, 2, 3].forEach(i => { const x = -21 + i * 4.5; bed(x, -2.45, 0, [0x74c0fc, 0xa5d8ff, 0x74c0fc, 0xa5d8ff][i]); monitor(x, 1.7, -3.8, 0, monTex); [x - 2.25, 0].length; });
  [-23.25, -18.75, -14.25, -9.75, -5.5].forEach((x, i) => { const c = i % 2 ? 0x8ecbf0 : 0xb7e0f7; B(0.05, 1.7, 3.2, c, x, 0.55, -2.2); B(0.06, 0.06, 3.2, STEEL, x, 2.3, -2.2); sol(x, -2.2, 0.08, 1.6); });
  hang("TRIAGE · PHÂN LOẠI", 3.4, -12, 3.6, 7.0, 0, "#d6333a", "#fff"); SB(4, 1.0, 0.9, WHITE, -12, 0, 7.4); B(4.1, 0.06, 1.0, 0xdde6ea, -12, 1.0, 7.4); B(0.5, 0.3, 0.05, DARK, -13, 1.06, 7.3); B(0.16, 0.2, 0.16, 0xff8787, -11, 1.06, 7.4);
  SB(0.7, 0.95, 0.55, 0xe5484d, -9, 0, 0.7); [0.3, 0.6].forEach(y => B(0.62, 0.04, 0.02, 0xffffff, -9, y, 0.99));   // xe đẩy cấp cứu
  { const q = grp(-19, 9.0, PI / 2); bed(-19, 9.0, PI / 2, 0xffffff, true); }   // cáng
  wheelchair(-8.4, 9.0, PI); wheelchair(-7.5, 9.0, PI);
  SB(0.8, 0.6, 0.4, 0x2f9e44, -28.8, 0, 9.2).scale.set(1, 1, 1);   // bình oxy
  B(0.7, 0.55, 0.2, 0xffffff, -24, 1.4, 9.8); B(0.4, 0.12, 0.21, 0xe5484d, -24, 1.62, 9.8); B(0.12, 0.4, 0.22, 0xe5484d, -24, 1.48, 9.8);   // tủ sơ cứu
  /* ===== NHI KHOA ===== */
  sgn("PEDIATRICS · NHI KHOA", 6.4, 0.8, "#ffb020", "#3a2a00", -17, 4.5, -15.83, 0);
  [[3, 0xff6b6b], [2.4, 0xffd43b], [1.8, 0x69db7c], [1.2, 0x4dabf7]].forEach(([r, c], i) => { const m = cy(R, r, 0.01, c, -25, 0.012 + i * 0.003, -9, 32); });   // thảm cầu vồng
  [[-26.6, -6.5, 0xff6b6b], [-26.0, -6.5, 0x4dabf7], [-26.3, -6.5, 0xffd43b], [-26.3, -6.5, 0x69db7c]].forEach(([x, z, c], i) => B(0.3, 0.3, 0.3, c, x + (i === 3 ? 0.02 : 0), i === 3 ? 0.3 : 0, z));
  sol(-26.3, -6.5, 0.6, 0.3);
  { const bear = (x, z) => { const m = (r, c, a, b2, d) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), mat(c)); s.position.set(a, b2, d); R.add(s); }; m(0.42, 0xc68642, x, 0.45, z); m(0.3, 0xc68642, x, 1.05, z); m(0.1, 0xc68642, x - 0.2, 1.3, z); m(0.1, 0xc68642, x + 0.2, 1.3, z); m(0.12, 0xf0d9b5, x, 1.0, z + 0.25); m(0.03, 0x222222, x - 0.1, 1.12, z + 0.27); m(0.03, 0x222222, x + 0.1, 1.12, z + 0.27); sol(x, z, 0.45, 0.4); }; bear(-28.3, -5.6); }
  SB(0.4, 1.2, 4, 0xffe3a3, -29.5, 0, -12.5); for (let i = 0; i < 6; i++) B(0.3, 0.28, 0.3, meds[i], -29.3, 0.35 + (i % 2) * 0.55, -14 + i * 0.7);
  SB(1.6, 0.5, 1.2, 0xffffff, -21, 0, -13.5); B(1.7, 0.05, 1.3, 0xffd45e, -21, 0.5, -13.5); [[-0.45, -0.4], [0.45, -0.4], [-0.45, 0.4], [0.45, 0.4]].forEach(([a, c], i) => B(0.22, 0.25, 0.22, meds[i + 2], -21 + a * 2, 0, -13.5 + c * 2));   // bàn + ghế mini
  [[-27, -13.8, 0xff6b6b], [-28.4, -11, 0x4dabf7], [-23, -5.2, 0xffd43b], [-21.5, -6.2, 0x69db7c], [-8, -5.6, 0xf783ac]].forEach(([x, z, c]) => { const bl = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), mat(c)); bl.position.set(x, 2.6 + (x % 3) * 0.1, z); R.add(bl); B(0.01, 1.6, 0.01, 0xffffff, x, 1.0, z); });
  const hcT = skin(0.9, 1.15, 100, (x, w, h) => { x.fillStyle = "#fff7d6"; x.fillRect(0, 0, w, h); x.fillStyle = "#c9a227"; x.fillRect(0.06, 0.04, 0.12, h - 0.08);
    for (let i = 0; i <= 9; i++) { const y = h - 0.08 - i * 0.11; x.fillStyle = "#6b4a1e"; x.fillRect(0.06, y, i % 2 ? 0.07 : 0.12, 0.012); signText(x, String(100 + i * 10), 0.36, y, 0.3, 0.07, "#6b4a1e"); }
    ell(x, "#ffcf5c", 0.7, 0.3, 0.18, 0.12); ell(x, "#ffcf5c", 0.6, 0.55, 0.06, 0.28); ell(x, "#ffcf5c", 0.7, 0.9, 0.17, 0.1); ell(x, "#c98a2b", 0.62, 0.3, 0.03, 0.03); ell(x, "#c98a2b", 0.72, 0.8, 0.03, 0.03); ell(x, "#222", 0.75, 0.28, 0.015, 0.015); });
  pic(hcT, 0.9, 1.15, -12.5, 1.45, -15.83, 0); SB(0.7, 0.1, 0.5, 0xdfe7ea, -12.5, 0, -14.9); B(0.06, 0.9, 0.06, STEEL, -12.5, 0.1, -15.1); B(0.3, 0.12, 0.05, DARK, -12.5, 1.0, -15.0);
  sgn("HEIGHT CHART · THƯỚC ĐO CHIỀU CAO", 3.2, 0.4, "#fff3bf", "#7a5a00", -12.5, 2.35, -15.83, 0);
  SB(2.0, 0.8, 0.8, 0xe8d3b0, -8.5, 0, -15.4); B(0.5, 0.3, 0.05, DARK, -8.8, 0.86, -15.5); B(0.5, 0.45, 0.5, 0xffd45e, -8.5, 0, -14.4);
  SB(2.0, 0.75, 0.7, 0xffffff, -17.5, 0, -15.3); B(2.0, 0.1, 0.72, 0x4aa3df, -17.5, 0.75, -15.3);   // bàn khám
  /* ===== NHA KHOA ===== */
  sgn("DENTIST · NHA KHOA", 6, 0.8, "#1aa58f", "#fff", -17, 4.5, -25.83, 0);
  const dchair = (x, z) => { const q = grp(x, z, PI / 2), b = bb(q); cy(q, 0.4, 0.08, 0x546e7a, 0, 0, 0); cy(q, 0.1, 0.45, 0xb0bec5, 0, 0.08, 0); b(0.62, 0.14, 0.7, 0x4aa3df, 0, 0.53, 0.1);
    const bk = b(0.62, 0.14, 1.0, 0x4aa3df, 0, 0.75, -0.7); bk.rotation.x = -0.45; b(0.3, 0.2, 0.22, 0x1c7ed6, 0, 0.98, -1.15); const lg = b(0.5, 0.12, 0.6, 0x4aa3df, 0, 0.42, 0.7); lg.rotation.x = 0.35;
    b(0.05, 2.0, 0.05, STEEL, 0.6, 0, -0.9); b(0.05, 0.05, 1.2, STEEL, 0.6, 1.95, -0.4); b(0.5, 0.05, 0.5, 0xfdfefe, 0.35, 1.85, 0.2); B(0.0, 0, 0, WHITE, 0, -9, 0); sol(x + 0.2, z, 1.2, 0.55); };
  dchair(-24.2, -23.2); dchair(-24.2, -18.6);
  [-22.6, -17.8].forEach(z => { SB(0.5, 0.9, 0.5, 0xffffff, -20.4, 0, z); B(0.5, 0.04, 0.5, STEEL, -20.4, 0.9, z); B(0.3, 0.03, 0.2, 0xffd43b, -20.4, 0.94, z); });
  SB(6, 0.9, 0.6, WHITE, -15, 0, -25.4); B(6.1, 0.05, 0.65, 0xdde6ea, -15, 0.9, -25.4); B(0.5, 0.05, 0.4, 0xcfd8dc, -17, 0.95, -25.4);   // bồn rửa + quầy
  B(2.6, 0.6, 0.3, 0xe3ebef, -15, 1.7, -25.8); [0, 1, 2, 3, 4].forEach(i => B(0.28, 0.4, 0.28, meds[i], -16 + i * 0.5, 1.75, -25.6));
  cy(R, 0.35, 0.8, MINT, -12, 0, -22, 16); sol(-12, -22, 0.4, 0.4);
  { const t = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 12), mat(0xffffff)); t.position.set(-12, 1.55, -22); t.scale.set(1, 0.85, 0.9); R.add(t);
    [-0.25, 0.25].forEach(s => lc(R, 0.05, 0.16, 0.55, 0xf3ead6, -12 + s, 0.72 + 0.8, -22, 8).position.y = 0.88 + 0.8 - 0.55);
    [-0.15, 0.15].forEach(s => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), mat(0x222222)); e.position.set(-12 + s, 1.65, -21.5); R.add(e); }); B(0.2, 0.04, 0.04, 0xe5484d, -12, 1.45, -21.48); }
  const brT = skin(1.2, 1.6, 90, (x, w, h) => { x.fillStyle = "#e0f7f1"; x.fillRect(0, 0, w, h); signText(x, "BRUSH TWICE", w / 2, 0.2, 1.0, 0.18, "#117a68"); signText(x, "A DAY!", w / 2, 0.42, 1.0, 0.2, "#117a68"); signText(x, "Đánh răng 2 lần mỗi ngày", w / 2, 1.5, 1.1, 0.1, "#3d6b63");
    x.fillStyle = "#ffffff"; x.strokeStyle = "#7fb8aa"; x.lineWidth = 0.03; x.beginPath(); x.moveTo(0.35, 0.65); x.quadraticCurveTo(0.6, 0.55, 0.85, 0.65); x.quadraticCurveTo(0.95, 1.1, 0.8, 1.3); x.lineTo(0.7, 1.3); x.lineTo(0.6, 1.05); x.lineTo(0.5, 1.3); x.lineTo(0.4, 1.3); x.quadraticCurveTo(0.25, 1.1, 0.35, 0.65); x.fill(); x.stroke();
    ell(x, "#222", 0.5, 0.88, 0.03, 0.04); ell(x, "#222", 0.7, 0.88, 0.03, 0.04); x.strokeStyle = "#d6333a"; x.lineWidth = 0.03; x.beginPath(); x.arc(0.6, 0.95, 0.1, 0.2, 2.9); x.stroke(); });
  pic(brT, 1.2, 1.6, -9, 2.0, -25.83, 0); pic(brT, 1.2, 1.6, -6.6, 2.0, -25.83, 0);
  SB(2.2, 0.45, 0.5, 0x4aa3df, -7.3, 0, -17.6);   // ghế chờ
  /* ===== NHÃN KHOA ===== */
  sgn("EYE CLINIC · NHÃN KHOA", 6, 0.8, "#7e5bd1", "#fff", -17, 4.5, -35.68, 0);
  const ecT = skin(1.0, 1.7, 110, (x, w, h) => { x.fillStyle = "#ffffff"; x.fillRect(0, 0, w, h); x.fillStyle = "#222"; [["E", 0.5], ["F P", 0.34], ["T O Z", 0.24], ["L P E D", 0.17], ["P E C F D", 0.12], ["E D F C Z P", 0.085]].forEach(([t, s], i) => { const y = [0.3, 0.62, 0.86, 1.07, 1.24, 1.4][i]; signText(x, t, w / 2, y, w * 0.85, s, "#1d1d1d", "bold "); }); });
  B(1.2, 1.9, 0.04, DARK, -29.7, 0.75, -31); pic(ecT, 1.0, 1.7, -29.66, 1.6, -31, PI / 2);
  strip(-23.8, -23.6, -33, -29, 0xb39ddb);   // vạch đứng
  { const q = grp(-23, -31, -PI / 2), b = bb(q); cy(q, 0.3, 0.06, 0x546e7a, 0, 0, 0); cy(q, 0.07, 0.4, 0xb0bec5, 0, 0.06, 0); b(0.55, 0.12, 0.55, 0x7e5bd1, 0, 0.46, 0); b(0.55, 0.7, 0.1, 0x7e5bd1, 0, 0.55, 0.3);   // ghế khám (nhìn về −x tới bảng chữ)
    b(0.05, 1.5, 0.05, STEEL, 0.55, 0, -0.2); b(0.05, 0.05, 0.7, STEEL, 0.55, 1.5, -0.5); b(0.4, 0.3, 0.25, 0x546e7a, 0.45, 1.25, -0.85); [-0.1, 0.1].forEach(s => { const l = cy(q, 0.09, 0.05, 0x80deea, s * 2, 1.3, -1.0); l.rotation.x = PI / 2; }); sol(-23, -31, 0.7, 0.6); }
  B(5.5, 1.4, 0.05, 0x5b4a8a, -18, 1.3, -35.7); [0, 1, 2, 3, 4, 5].forEach(i => { const x = -20.2 + i * 0.85, c = [0xff6b6b, 0x4dabf7, 0xffd43b, 0x69db7c, 0xb197fc, 0x212529][i];
    [-0.17, 0.17].forEach(s => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 6, 14), mat(c)); r.position.set(x + s, 2.0, -35.64); R.add(r); const r2 = r.clone(); r2.position.y = 1.5; R.add(r2); }); B(0.1, 0.03, 0.03, c, x, 2.02, -35.64); B(0.1, 0.03, 0.03, c, x, 1.52, -35.64); });
  SB(2.0, 0.8, 0.8, 0xe8d3b0, -12, 0, -33); B(0.5, 0.3, 0.05, DARK, -12.4, 0.86, -33.1); { const e = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), mat(0xffffff)); e.position.set(-11.4, 1.0, -33); R.add(e); const ir = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), mat(0x339af0)); ir.position.set(-11.4, 1.0, -32.86); R.add(ir); }
  SB(4, 1.9, 0.4, 0xe3ebef, -10, 0, -26.45); for (let i = 0; i < 8; i++) B(0.28, 0.3, 0.1, meds[i], -11.5 + i * 0.42, 0.4 + (i % 4) * 0.4, -26.7);
  /* ===== X-QUANG ===== */
  sgn("X-RAY · CHỤP X-QUANG", 6, 0.8, "#3b66c4", "#fff", 17.5, 4.5, -3.83, 0);
  { const t = grp(17, 1.0, 0), b = bb(t); b(2.2, 0.7, 0.8, 0xdfe7ea, 0, 0, 0); b(2.3, 0.1, 0.9, 0x90caf9, 0, 0.7, 0); sol(17, 1.0, 1.15, 0.45);
    B(0.4, 0.12, 0.4, STEEL, 17, 0, -1.4); B(0.14, 3.4, 0.14, 0xeceff1, 17, 0.1, -1.4); B(0.12, 0.12, 1.8, 0xeceff1, 17, 3.4, -0.55); B(0.55, 0.45, 0.55, 0xcfd8dc, 17, 2.95, 0.3); B(0.3, 0.05, 0.3, DARK, 17, 2.92, 0.3); sol(17, -1.4, 0.3, 0.3); }
  const lbox = (x, kind) => { const t = skin(0.9, 0.7, 100, (c, w, h) => { c.fillStyle = "#0c2a40"; c.fillRect(0, 0, w, h); c.strokeStyle = "#d6ecff"; c.fillStyle = "#d6ecff"; c.lineCap = "round"; c.lineWidth = 0.05;
      if (kind === 0) { [[0.2, 0.6, 0.15, 0.2], [0.35, 0.55, 0.35, 0.1], [0.5, 0.55, 0.55, 0.1], [0.65, 0.6, 0.75, 0.2]].forEach(([a, b, d, e]) => { c.beginPath(); c.moveTo(a, b); c.lineTo(d, e); c.stroke(); }); c.lineWidth = 0.09; c.beginPath(); c.moveTo(0.45, 0.65); c.lineTo(0.45, 0.4); c.stroke(); }
      else if (kind === 1) { c.lineWidth = 0.04; c.beginPath(); c.moveTo(0.45, 0.05); c.lineTo(0.45, 0.65); c.stroke(); for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(0.45, 0.15 + i * 0.1); c.quadraticCurveTo(0.2, 0.1 + i * 0.1, 0.12, 0.3 + i * 0.08); c.moveTo(0.45, 0.15 + i * 0.1); c.quadraticCurveTo(0.7, 0.1 + i * 0.1, 0.78, 0.3 + i * 0.08); c.stroke(); } }
      else { c.lineWidth = 0.1; c.beginPath(); c.moveTo(0.4, 0.05); c.lineTo(0.42, 0.33); c.moveTo(0.48, 0.37); c.lineTo(0.5, 0.65); c.stroke(); c.beginPath(); c.arc(0.45, 0.35, 0.09, 0, 7); c.fill(); } });
    B(1.0, 0.8, 0.06, DARK, x, 1.0, -3.8); pic(t, 0.9, 0.7, x, 1.4, -3.76, 0, true); };
  lbox(13, 0); lbox(17.5, 1); lbox(22, 2);
  B(0.1, 2.2, 1.6, 0x607d8b, 25, 0, 7.5); B(0.04, 1.0, 1.4, GLASS, 25, 1.0, 7.5); sol(25, 7.5, 0.1, 0.9);   // tấm kính chì
  SB(1.6, 0.8, 0.8, 0xe8d9bd, 27.6, 0, 7.5); B(0.5, 0.3, 0.05, DARK, 27.6, 0.86, 7.4); B(0.5, 0.3, 0.05, DARK, 27.0, 0.86, 7.4);
  B(0.5, 0.9, 0.12, 0xb0bec5, 29.55, 1.0, 2); B(0.6, 0.12, 0.2, 0x78909c, 29.55, 1.9, 2);   // áo chì
  sgn("PLEASE STAND STILL · ĐỨNG YÊN NHÉ", 4, 0.5, "#e3f2fd", "#2b4a8a", 17.5, 3.4, -3.83, 0);
  [[11, 9.4], [15, 9.4]].forEach(([x, z]) => SB(2.4, 0.45, 0.5, 0x4aa3df, x, 0, z));
  /* ===== XÉT NGHIỆM + GÓC PASTEUR ===== */
  sgn("LABORATORY · XÉT NGHIỆM", 6, 0.8, "#2f9e44", "#fff", 17, 4.5, -15.83, 0);
  const micro = (x, y, z, c) => { B(0.22, 0.04, 0.28, c || WHITE, x, y, z); B(0.05, 0.34, 0.05, c || WHITE, x, y, z - 0.1); B(0.05, 0.05, 0.22, c || WHITE, x, y + 0.3, z - 0.02); const t = cy(R, 0.035, 0.22, DARK, x, y + 0.14, z + 0.03, 8); t.rotation.x = -0.25; };
  SB(16, 0.9, 1.2, 0x546e7a, 17, 0, -15.0); B(16.1, 0.06, 1.3, WHITE, 17, 0.9, -15.0);
  SB(11, 0.9, 1.2, 0x546e7a, 16.5, 0, -9.7); B(11.1, 0.06, 1.3, WHITE, 16.5, 0.9, -9.7);
  [0, 1, 2, 3].forEach(i => micro(10.5 + i * 1.1, 0.96, -15.0)); [0, 1].forEach(i => micro(12 + i * 1.2, 0.96, -9.7));
  for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const c = [0xff6b6b, 0x4dabf7, 0xffd43b, 0x69db7c, 0xb197fc, 0xff9f43][i]; cy(R, 0.04, 0.3, c, 18.5 + i * 0.16 + r * 1.8, 0.96, -15.0 + (r ? 0.3 : -0.3), 6); }   // giá ống nghiệm
  B(6, 0.05, 0.4, 0xe3ebef, 17, 1.9, -15.7); [0, 1, 2, 3, 4].forEach(i => cy(R, 0.1, 0.25, [0x74c0fc, 0xffd43b, 0xff8787, 0x69db7c, 0xb197fc][i], 15 + i * 1.0, 1.95, -15.7, 10));
  SB(0.9, 2.0, 0.8, WHITE, 6.4, 0, -5.2); B(0.04, 1.0, 0.6, GLASS, 6.85, 0.8, -5.2);   // tủ lạnh mẫu
  const labT = skin(1.2, 1.5, 80, (x, w, h) => { x.fillStyle = "#eaf8ec"; x.fillRect(0, 0, w, h); signText(x, "WASH YOUR HANDS", w / 2, 0.18, 1.1, 0.16, "#237a35"); signText(x, "Rửa tay với xà phòng", w / 2, 1.38, 1.1, 0.09, "#4b7d55");
    ell(x, "#ffd8a8", 0.6, 0.75, 0.3, 0.4); [0.34, 0.48, 0.62, 0.76, 0.88].forEach((a, i) => ell(x, "#ffd8a8", a, 0.38 + (i === 0 || i === 4 ? 0.08 : 0), 0.05, 0.2)); [[0.3, 0.6], [0.8, 0.9], [0.5, 1.1], [0.9, 0.55]].forEach(([a, b]) => { ell(x, "#a5d8ff", a, b, 0.09, 0.09); ell(x, "#e7f5ff", a - 0.02, b - 0.02, 0.03, 0.03); }); });
  pic(labT, 1.2, 1.5, 11, 2.0, -3.83 - 0.0 + 0.0, PI);
  [[8, -5], [10.5, -5.0]].forEach(([x, z], i) => { }); [8.8, 9.6, 10.4, 11.2].forEach(x => { B(0.5, 1.1, 0.05, WHITE, x, 1.0, -4.3); B(0.3, 0.12, 0.05, MINTD, x, 2.05, -4.3); });   // áo choàng trắng treo tường
  // Góc Pasteur: bàn gỗ, kính hiển vi đồng, bình cổ thiên nga, sách cũ, thảm đỏ
  strip(24.5, 29.5, -15.6, -10.0, 0x8e2f3a); sgn("PASTEUR'S LAB · GÓC PASTEUR", 4.6, 0.7, "#5b3a1e", "#ffe9a8", 29.68, 3.0, -12.8, -PI / 2);
  SB(2.8, 0.85, 1.0, 0x8a5a33, 27.2, 0, -15.2); B(2.9, 0.06, 1.1, 0x6b4423, 27.2, 0.85, -15.2); micro(26.4, 0.91, -15.2, 0xc9a227);
  { const f = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), mat(0xcfe8ef, { transparent: true, opacity: 0.7 })); f.position.set(27.6, 1.1, -15.2); R.add(f);
    const n1 = cy(R, 0.025, 0.3, 0xcfe8ef, 27.65, 1.2, -15.2, 6); n1.rotation.z = -0.5; const n2 = cy(R, 0.025, 0.2, 0xcfe8ef, 27.85, 1.45, -15.2, 6); n2.rotation.z = -1.2; }
  B(0.35, 0.08, 0.26, 0x2b6cb0, 28.3, 0.91, -15.0); B(0.35, 0.08, 0.26, 0xb23a48, 28.3, 0.99, -15.0); cy(R, 0.1, 0.18, 0xe8c15a, 26.0, 0.91, -14.8, 10);
  B(0.5, 0.5, 0.5, 0x8a5a33, 26.6, 0, -13.7); sol(26.6, -13.7, 0.3, 0.3);
  SB(0.4, 2.0, 2.2, 0x6b4423, 29.5, 0, -10.8); for (let i = 0; i < 5; i++) B(0.3, 0.25, 0.1 + (i % 2) * 0.05, [0xb23a48, 0x2b6cb0, 0xc9a227, 0x2f7d4f, 0x6b4a8a][i], 29.3, 0.6 + (i % 3) * 0.5, -11.6 + i * 0.4);
  /* ===== PHÒNG MỔ (chỉ nhìn qua kính, không đáng sợ: sáng, xanh dịu, gọn gàng) ===== */
  sgn("OPERATING ROOM · PHÒNG MỔ", 6, 0.8, "#14a3ad", "#fff", 17, 4.5, -25.83, 0); sgn("CLEAN & QUIET · SẠCH & YÊN TĨNH", 5, 0.5, "#e0f7fa", "#0d7c84", 17, 3.6, -25.83, 0);
  { const q = grp(10, -21, 0), b = bb(q); b(0.9, 0.85, 2.0, 0xdfe7ea, 0, 0, 0); b(0.95, 0.12, 2.05, 0x4fc3c9, 0, 0.85, 0); b(0.5, 0.1, 0.35, WHITE, 0, 0.97, -0.7);
    sol(10, -21, 0.5, 1.05); B(0.1, 3.0, 0.1, STEEL, 10, 3.0, -21); B(1.2, 0.06, 0.06, STEEL, 10.6, 5.2, -21); cy(R, 0.6, 0.1, 0xfdfefe, 11.2, 4.1, -21, 20); cy(R, 0.4, 0.1, 0xfff9c4, 8.9, 4.1, -21, 20); sol(11, -21, 0.4, 0.4); }
  SB(0.6, 1.1, 0.6, 0xdfe7ea, 8.4, 0, -23.5); monitor(8.4, 1.7, -23.5, 0, monTex); B(0.04, 1.2, 0.04, STEEL, 8.4, 1.1, -23.5);
  SB(1.6, 0.85, 0.6, WHITE, 14, 0, -25.5); B(1.5, 0.05, 0.5, 0xb2ebf2, 14, 0.85, -25.5); [0, 1, 2, 3].forEach(i => B(0.16, 0.04, 0.05, 0xcfd8dc, 13.5 + i * 0.3, 0.9, -25.5));   // bàn dụng cụ
  B(4, 0.6, 0.3, 0xe3ebef, 20, 1.8, -25.8); SB(3.5, 0.9, 0.6, 0xb2ebf2, 21, 0, -25.5);
  /* ===== BUỒNG BỆNH ===== */
  sgn("PATIENT WARD · BUỒNG BỆNH", 6, 0.8, "#2b8fd6", "#fff", 17, 4.5, -35.68, 0);
  [9, 13.5, 18, 22.5, 27].forEach((x, i) => { bed(x, -34.6, 0, [0xffb3c6, 0xa5d8ff, 0xb2f2bb, 0xffe066, 0xd0bfff][i]); iv(x - 0.9, -34.2); SB(0.5, 0.7, 0.45, 0xe8d3b0, x + 1.0, 0, -35.3); B(0.25, 0.22, 0.2, [0xff6b81, 0xffd43b, 0x74c0fc][i % 3], x + 1.0, 0.7, -35.3); });
  const tvT = skin(2, 1.1, 80, (x, w, h) => { const gr = x.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#3bc9db"); gr.addColorStop(1, "#4dabf7"); x.fillStyle = gr; x.fillRect(0, 0, w, h); signText(x, "Kids' Cartoon", w / 2, 0.55, 1.6, 0.28, "#ffffff"); });
  B(2.1, 1.2, 0.06, DARK, 22, 1.5, -26.2); pic(tvT, 2, 1.1, 22, 2.1, -26.24, PI, true);
  SB(2.4, 0.5, 0.8, 0x4aa3df, 22, 0, -28.1); B(2.4, 0.5, 0.15, 0x4aa3df, 22, 0.5, -28.5);   // ghế dài người thăm
  wheelchair(7.2, -28.2, PI / 2); sgn("VISITING HOURS 2 – 8 PM · GIỜ THĂM BỆNH 14 – 20 GIỜ", 5.4, 0.6, "#e3f2fd", "#1b5e8f", 5.17, 3.5, -33.9, PI / 2);
  { const k = skin(0.9, 0.9, 80, (x, w, h) => { x.fillStyle = "#ffffff"; x.fillRect(0, 0, w, h); x.strokeStyle = "#2b8fd6"; x.lineWidth = 0.05; x.beginPath(); x.arc(0.45, 0.45, 0.4, 0, 7); x.stroke(); x.beginPath(); x.moveTo(0.45, 0.45); x.lineTo(0.45, 0.2); x.moveTo(0.45, 0.45); x.lineTo(0.62, 0.52); x.stroke(); }); pic(k, 0.7, 0.7, 29.66, 3.4, -28.5, -PI / 2); }
  /* ===== CHỖ BÀY TỪ VỰNG (x, y, z, chỗ đứng x, z — tính từ giữa phòng) ===== */
  const A = (rows) => rows.map(([a, b, c, d, e]) => [cx + a, b, cz + c, cx + d, cz + e]);
  P.anchors = {
    lobby: A([[-17, 1.4, 14, -17, 15.5], [-6.4, 1.6, 17, -6.4, 18.6], [-11, 3.0, 14.3, -11, 15.6], [-20, 1.0, 26, -20, 24.5], [-3.9, 1.45, 34.8, -3.9, 33.3], [-27.6, 1.5, 22.5, -26.0, 22.5], [12, 1.4, 14, 12, 15.5]]),
    pharmacy: A([[29.2, 1.5, 14, 27.5, 14], [29.2, 1.8, 17, 27.5, 17], [29.2, 1.5, 20, 27.5, 20], [25, 1.5, 15.5, 23.2, 15.5], [21, 1.5, 17, 22.6, 17], [25, 1.5, 12.2, 25, 11.9], [25, 1.5, 20.5, 23.2, 20.5]]),
    er: A([[-21, 1.3, -2.2, -21, 0.4], [-19, 1.2, 9.0, -19, 7.7], [-8.4, 1.2, 9.0, -8.4, 7.7], [-26.4, 2.9, 4.2, -26.4, 6.6], [-16.5, 2.2, -3.6, -16.5, 0.4], [-24, 1.8, 9.7, -24, 8.4], [-9, 1.3, 0.7, -9, 2.4]]),
    peds: A([[-28.3, 1.4, -5.6, -26.9, -5.6], [-26.3, 0.9, -6.5, -25.0, -7.2], [-28.6, 2.3, -9.7, -27.0, -9.7], [-12.5, 1.9, -15.5, -12.5, -13.7], [-8.5, 1.3, -15.4, -8.5, -13.6], [-17.5, 1.2, -15.3, -17.5, -13.6], [-29.2, 1.5, -12.5, -27.6, -12.5]]),
    dentist: A([[-24.2, 1.6, -23.2, -22.2, -23.2], [-15, 1.25, -25.4, -15, -24.0], [-13, 1.25, -25.4, -13, -24.0], [-20.4, 1.3, -22.6, -19.4, -22.6], [-12, 2.4, -22, -12, -20.6], [-20.4, 1.3, -17.8, -19.4, -17.8]]),
    eye: A([[-29.4, 2.3, -31, -27.8, -31], [-10, 1.6, -26.9, -10, -28.2], [-18, 2.2, -35.4, -18, -34.0], [-11.4, 1.35, -33, -11.4, -31.7], [-12, 1.3, -33, -12.6, -31.7]]),
    xray: A([[17, 2.7, 0.3, 17, 2.7], [17.5, 1.95, -3.5, 17.5, -2.0], [13, 1.95, -3.5, 13, -2.0], [29.3, 1.7, 2, 27.8, 2], [22, 1.95, -3.5, 22, -2.0]]),
    lab: A([[8.8, 1.7, -4.4, 8.8, -6.0], [10.5, 1.3, -15.0, 10.5, -13.4], [13, 1.3, -15.0, 13, -13.4], [16, 1.3, -15.0, 16, -13.4], [27.6, 1.45, -15.2, 27.6, -13.4], [14, 1.3, -9.7, 14, -8.2], [19, 1.3, -9.7, 19, -8.2]]),
    ward: A([[13.5, 1.2, -34.6, 13.5, -32.6], [12.6, 2.2, -34.2, 11.8, -32.6], [15, 1.1, -35.3, 15, -32.6], [22.5, 1.6, -35.5, 22.5, -32.6], [18, 1.0, -35.0, 18, -32.6], [27, 1.0, -34.2, 27, -32.6]]),
    station: A([[0.8, 1.5, -32, 0.8, -30.4], [-1.6, 1.5, -32, -1.6, -30.4]]),
    or: A([[10, 1.4, -21, 3.3, -21], [10.6, 4.0, -21, 3.3, -19.6]])
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
  R.traverse(o => { if (o.isMesh) o.userData.flat = true; });   // nội thất bệnh viện: không đổ bóng (nhẹ máy, sáng đều)
  /* ---- đồ dựng bằng hàm (khai báo sau để dùng được ở trên nhờ hoisting của const? không: dùng function) ---- */
  function bed(x, z, ry, sheet, stretcher) {   // giường bệnh: đầu giường quay về −z (khi ry = 0)
    const q = grp(x, z, ry), b = bb(q);
    b(1.0, 0.12, 2.1, 0xb0bec5, 0, 0.3, 0); b(0.9, 0.16, 1.95, WHITE, 0, 0.42, 0); b(0.93, 0.1, 1.15, sheet, 0, 0.55, 0.4); b(0.55, 0.12, 0.36, WHITE, 0, 0.58, -0.7);
    b(1.0, stretcher ? 0.2 : 0.75, 0.07, 0xdfe7ea, 0, 0.3, -1.03); b(1.0, 0.4, 0.07, 0xdfe7ea, 0, 0.3, 1.03);
    [[-0.45, -0.95], [0.45, -0.95], [-0.45, 0.95], [0.45, 0.95]].forEach(([a, c]) => b(0.08, 0.3, 0.08, DARK, a, 0, c));
    solR(x, z, 0.55, 1.1, ry);
  }
  function iv(x, z) {   // cột truyền dịch
    B(0.4, 0.04, 0.04, STEEL, x, 0.02, z); B(0.04, 0.04, 0.4, STEEL, x, 0.02, z); B(0.03, 1.9, 0.03, STEEL, x, 0.04, z); B(0.3, 0.02, 0.02, STEEL, x + 0.1, 1.92, z); B(0.14, 0.24, 0.05, 0xc8e6ff, x + 0.22, 1.62, z); sol(x, z, 0.22, 0.22);
  }
}
INTERIORS["hospital"] = {
  furnish: furnishHospital,
  customWalls: true,
  bright: true
};
