/* EnglishVerse – nội thất "hospital" (layout: "hospitalhall"). Tách khỏi index.html để mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, textPlate, signText, rectWin, pot…) – có sẵn khi nội thất được dựng. */
/* CITY HOSPITAL – sảnh bệnh viện lớn (30 × 44 m, theo kiểu bệnh viện công lớn ở Việt Nam, KHÔNG dùng tên/logo thật):
   sàn gạch sáng + vạch kẻ màu chỉ đường về từng khoa, tường trắng chân tường xanh ngọc, cửa sổ cao, trần có đèn máng, biển chỉ dẫn treo trần,
   quầy tiếp nhận (trái, gần cửa), khu ghế chờ inox xanh + màn hình gọi số (phải), quầy thuốc sát tường phải,
   phòng khám (trái giữa, vách ngăn thấp), phòng bệnh 4 giường có rèm (sau trái), phòng xét nghiệm (sau phải), bàn trực y tá sát tường sau.
   Chừa trống: lối vào + hành lang giữa x −2..+2; điểm đứng NPC (xem lessons.js). */
const HW_TEAL = 0x17a398, HW_BLUE = 0x2e86c1, HW_INOX = 0xb8c2cc, HW_RED = 0xd62828, HW_WOOD = 0xd9b382;
const HW_LANE = { reception: "#2f9e44", clinic: "#1c7ed6", ward: "#e03131", pharmacy: "#f08c00", lab: "#7048e8" };   // màu vạch kẻ = màu biển từng khoa
const HOSPW = {};
function hospWall(len, h, kind) {   // tường trắng, chân tường xanh ngọc, cửa sổ cao; tường trái có cửa sổ lớn của phòng bệnh
  const k = len + kind; if (HOSPW[k]) return HOSPW[k];
  const t = skin(len, h, 14, (x, Wd, Hh) => {
    x.fillStyle = "#f8fbfb"; x.fillRect(0, 0, Wd, Hh);
    x.fillStyle = "#e3ecec"; for (let X = 2; X < Wd; X += 2) x.fillRect(X, 0.3, 0.03, Hh - 1.5);   // vách ốp
    x.fillStyle = "#17a398"; x.fillRect(0, Hh - 1.15, Wd, 1.15); x.fillStyle = "#ffffff"; x.fillRect(0, Hh - 1.2, Wd, 0.06); x.fillStyle = "#0e7f77"; x.fillRect(0, Hh - 0.12, Wd, 0.12);   // chân tường xanh ngọc
    x.fillStyle = "#17a398"; x.fillRect(0, 0, Wd, 0.18); x.fillStyle = "#d9eceb"; x.fillRect(0, 0.18, Wd, 0.05);
    const win = (X, Y, w, hh, mull) => { rectWin(x, X, Y, w, hh, "#bfe3f2", "#ffffff"); x.fillStyle = "#e8f6fb"; x.fillRect(X, Y, w * 0.3, hh * 0.5); x.fillStyle = "#ffffff"; for (let i = 1; i < mull; i++) x.fillRect(X + w * i / mull - 0.03, Y, 0.06, hh); x.fillRect(X, Y + hh / 2 - 0.03, w, 0.06); x.fillRect(X - 0.12, Y + hh + 0.1, w + 0.24, 0.1); };
    for (let X = 1.8; X < Wd - 1; X += 3.6) win(X - 1.2, 0.8, 2.4, 1.5, 3);   // cửa sổ cao (lấy sáng)
    if (kind === "left") [-19.5, -15.5, -11.5].forEach(z => win(Wd / 2 - z - 1.3, Hh - 3.4, 2.6, 2.1, 2));   // phòng bệnh: cửa sổ lớn
    if (kind === "front") [-11, -7, 7, 11].forEach(dx => win(Wd / 2 + dx - 1.2, Hh - 3.4, 2.4, 2.1, 2));   // 2 bên cửa chính
  });
  return HOSPW[k] = new THREE.MeshLambertMaterial({ map: t });
}
function hospFloor(W, D) {   // gạch sáng + vạch kẻ màu từ cửa tới từng khoa (nhìn từ cửa: trái = reception/clinic/ward, phải = pharmacy/lab)
  return skin(W, D, 18, (x) => {
    x.fillStyle = "#8fa5ad"; x.fillRect(0, 0, W, D);
    x.fillStyle = "#809aa3"; for (let i = 0; i < W / 1.2; i++) for (let j = 0; j < D / 1.2; j++) if ((i + j) % 2) x.fillRect(i * 1.2, j * 1.2, 1.2, 1.2);
    x.fillStyle = "#667d86"; for (let X = 0; X < W; X += 1.2) x.fillRect(X, 0, 0.025, D); for (let Y = 0; Y < D; Y += 1.2) x.fillRect(0, Y, W, 0.025);
    const cX = W / 2, cY = D / 2;
    const lane = (name, xl, z0, z1, xt) => {   // đi dọc x = xl từ z0 tới z1 rồi rẽ ngang tới xt
      x.strokeStyle = HW_LANE[name]; x.lineWidth = 0.2; x.lineCap = "butt"; x.beginPath(); x.moveTo(cX + xl, cY + z0); x.lineTo(cX + xl, cY + z1); x.lineTo(cX + xt, cY + z1); x.stroke();
      const s = Math.sign(xt - xl); x.fillStyle = HW_LANE[name]; x.beginPath(); x.moveTo(cX + xt + s * 0.45, cY + z1); x.lineTo(cX + xt, cY + z1 - 0.3); x.lineTo(cX + xt, cY + z1 + 0.3); x.fill();
      signText(x, name.toUpperCase(), cX + (xl + xt) / 2, cY + z1 - 0.5, Math.abs(xt - xl) - 0.3, 0.4, HW_LANE[name]);
    };
    lane("reception", -1.4, 20.5, 14.2, -4.6); lane("clinic", -1.0, 20.5, -2.6, -6.5); lane("ward", -0.6, 20.5, -9.4, -9.5);
    lane("pharmacy", 1.2, 20.5, 2.6, 9.6); lane("lab", 0.6, 20.5, -9.4, 8);
    x.fillStyle = "#d62828"; x.fillRect(cX - 1.2, cY + D / 2 - 0.9, 2.4, 0.9);   // thảm cửa
  });
}
function hospCeil(W, D) {   // trần ô vuông 1,2 m + đèn máng
  const t = skin(W, D, 8, (x) => {
    x.fillStyle = "#f4f6f7"; x.fillRect(0, 0, W, D); x.fillStyle = "#d3dadd"; for (let X = 0; X < W; X += 1.2) x.fillRect(X, 0, 0.03, D); for (let Y = 0; Y < D; Y += 1.2) x.fillRect(0, Y, W, 0.03);
    x.fillStyle = "#ffffff"; for (let X = 3; X < W - 1; X += 6) for (let Y = 2.4; Y < D - 1; Y += 4.8) { x.fillStyle = "#c0c9cd"; x.fillRect(X - 0.7, Y - 0.35, 1.4, 0.7); x.fillStyle = "#ffffff"; x.fillRect(X - 0.62, Y - 0.27, 1.24, 0.54); }
  });
  return t;
}
function hospSign(parts, w, h, flip) {   // biển chỉ dẫn: mỗi phần 1 ô màu + chữ + mũi tên (flip = mặt sau: đảo trái phải)
  const ps = flip ? parts.slice().reverse().map(p => ({ t: p.t, c: p.c, d: -p.d })) : parts;
  const t = skin(w, h, 64, (x) => {
    x.fillStyle = "#0b3d44"; x.fillRect(0, 0, w, h); const cw = w / ps.length;
    ps.forEach((p, i) => { x.fillStyle = p.c; x.fillRect(i * cw + 0.05, 0.05, cw - 0.1, h - 0.1); x.fillStyle = "#ffffff"; const cx = i * cw + cw / 2 + p.d * 0.25;
      signText(x, p.t, cx, h / 2 + 0.02, cw - 1.5, h * 0.45, "#ffffff");
      if (p.d) { const ax = i * cw + (p.d < 0 ? 0.35 : cw - 0.35); x.beginPath(); x.moveTo(ax + p.d * 0.22, h / 2); x.lineTo(ax - p.d * 0.12, h / 2 - h * 0.22); x.lineTo(ax - p.d * 0.12, h / 2 + h * 0.22); x.fill(); } });
  });
  return t;
}
function furnishHospital(P, g, cx, cz, W, D, fur) {
  const H = (P.size || {}).h || 6, S = P.room.solids, BK = -D / 2, FR = D / 2;
  const sol = (x, z, hw, hd) => S.push({ x: cx + x, z: cz + z, hw, hd });
  const B = (w, h, d, c, x, y, z) => lb(g, w, h, d, c, cx + x, y, cz + z);
  const C = (r, h, c, x, y, z, seg) => lc(g, r, r, h, c, cx + x, y, cz + z, seg || 12);
  const plane = (tex, w, h, x, y, z, ry, basic) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic ? new THREE.MeshBasicMaterial({ map: tex }) : new THREE.MeshLambertMaterial({ map: tex })); m.position.set(cx + x, y, cz + z); m.rotation.y = ry || 0; m.userData.flat = true; g.add(m); return m; };
  // ---- sàn + trần (tường do wall() bên dưới vẽ) ----
  g.children[0].material = new THREE.MeshLambertMaterial({ map: hospFloor(W, D) });
  { const m = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshBasicMaterial({ map: hospCeil(W, D), side: THREE.DoubleSide })); m.rotation.x = Math.PI / 2; m.position.set(cx, H - 0.02, cz); m.userData.flat = true; g.add(m); }
  // chữ thập đỏ trên tường sau (ngay trên bàn y tá) + trên cửa chính
  const cross = (x, y, z, ry, s) => { const d = C(s * 0.62, 0.04, 0xffffff, x, y, z, 24); d.rotation.x = Math.PI / 2; d.rotation.z = ry; d.position.z += Math.cos(ry) * 0.02; d.position.x += Math.sin(ry) * 0.02;
    const a = B(s, s * 0.32, 0.05, HW_RED, x, y, z), b = B(s * 0.32, s, 0.05, HW_RED, x, y, z); [a, b].forEach(m => { m.rotation.y = ry; m.userData.flat = true; m.position.z += Math.cos(ry) * 0.04; m.position.x += Math.sin(ry) * 0.04; }); d.userData.flat = true; };
  cross(0, 2.9, BK + 0.03, 0, 1.3); cross(0, 3.25, FR - 0.03, Math.PI, 1.0);
  // ---- vách ngăn thấp (cao 1,3 m, mép xanh ngọc) ----
  const part = (x, z, len, alongZ) => { const w = alongZ ? 0.14 : len, d = alongZ ? len : 0.14;
    B(w, 1.0, d, 0xf4f8f8, x, 0.5, z); B(w + 0.03, 0.12, d + 0.03, HW_TEAL, x, 1.06, z); B(w + 0.03, 0.2, d + 0.03, HW_TEAL, x, 0.1, z); sol(x, z, w / 2, d / 2); };
  // ---- biển treo trần (2 mặt) ----
  const hang = (parts, w, h, x, y, z, ry, both) => {
    const nx = Math.sin(ry), nz = Math.cos(ry), tx = Math.cos(ry), tz = -Math.sin(ry);
    const bx = B(w + 0.1, h + 0.1, 0.05, 0x0b3d44, x, y, z); bx.rotation.y = ry; bx.userData.flat = true;
    const f = plane(hospSign(parts, w, h, false), w, h, x + nx * 0.035, y, z + nz * 0.035, ry, true); if (both) plane(hospSign(parts, w, h, true), w, h, x - nx * 0.035, y, z - nz * 0.035, ry + Math.PI, true);
    [-1, 1].forEach(s => { const r = B(0.04, H - y - h / 2, 0.04, 0x6b7780, x + tx * s * (w / 2 - 0.3), (H + y + h / 2) / 2, z + tz * s * (w / 2 - 0.3)); r.userData.flat = true; });
  };
  const L = HW_LANE, sg = (t, k, d) => ({ t, c: L[k] || k, d: d || 0 });
  hang([sg("RECEPTION", "reception", -1), sg("WAITING", "#0b7285", 1)], 6.6, 1.0, 0, 4.5, 14.2, 0, true);
  hang([sg("CLINIC", "clinic", -1), sg("PHARMACY", "pharmacy", 1)], 6.6, 1.0, 0, 4.5, 1.2, 0, true);
  hang([sg("WARD", "ward", -1), sg("LAB", "lab", 1)], 6.6, 1.0, 0, 4.5, -8, 0, true);
  hang([sg("RECEPTION", "reception")], 3.4, 0.7, -6, 3.5, 11.8, 0);
  hang([sg("PHARMACY", "pharmacy")], 3.6, 0.7, 11.6, 3.6, 1.5, -Math.PI / 2);
  hang([sg("CLINIC", "clinic")], 2.6, 0.7, -4.2, 3.3, -2.6, Math.PI / 2);
  hang([sg("WARD", "ward")], 2.6, 0.7, -8.5, 3.6, -10.3, 0);
  hang([sg("LAB", "lab")], 2.6, 0.7, 9, 3.6, -10.3, 0);

  // ==== RECEPTION: quầy dài 5 m tại x = −6, z = 11.5, mặt quầy hướng cửa (+z) ====
  B(5, 1.0, 0.5, 0xffffff, -6, 0.5, 11.7); B(5.3, 0.07, 0.85, HW_WOOD, -6, 1.035, 11.75); B(5.02, 0.62, 0.04, HW_TEAL, -6, 0.5, 11.97);
  { const p = textPlate("RECEPTION · TIEP NHAN", 2.6, 0.32, "#0e7f77", "#ffffff"); p.position.set(cx - 6, 0.55, cz + 12.0); g.add(p); }
  sol(-6, 11.7, 2.5, 0.25);
  [-7.5, -4.5].forEach(x => { B(0.5, 0.32, 0.04, 0x1b1f23, x, 1.3, 11.8); B(0.44, 0.26, 0.02, 0x3b8fd6, x, 1.3, 11.775); B(0.08, 0.16, 0.08, 0x333a40, x, 1.16, 11.8); B(0.4, 0.02, 0.14, 0x222831, x, 1.09, 11.55); });   // máy tính
  C(0.1, 0.03, 0xc9a227, -3.95, 1.085, 12.0); lc(g, 0.03, 0.09, 0.07, 0xc9a227, cx - 3.95, 1.13, cz + 12.0, 12);   // chuông gọi
  B(0.5, 0.03, 0.34, 0x1c7ed6, -6.1, 1.09, 11.9); B(0.22, 0.02, 0.3, 0xffffff, -6.22, 1.115, 11.9); B(0.22, 0.02, 0.3, 0xffffff, -5.98, 1.115, 11.9);   // sổ đăng ký
  [-8.1, -6.9, -5.7, -4.5].forEach(x => { B(1.1, 1.8, 0.5, 0xdfe6e9, x, 0.9, 8.3); B(1.0, 0.02, 0.01, 0x868e96, x, 1.2, 8.04); B(0.3, 0.03, 0.03, 0x868e96, x, 1.5, 8.03); B(0.3, 0.03, 0.03, 0x868e96, x, 0.8, 8.03); });   // tủ hồ sơ sau quầy
  sol(-6.3, 8.3, 2.4, 0.3);

  // ==== WAITING: 2 dãy ghế inox xanh hướng về màn hình gọi số (treo trần ở z = 7) ====
  [9.6, 14.8].forEach(z => { for (let i = 0; i < 5; i++) { const x = 5.7 + i; B(0.86, 0.1, 0.55, HW_BLUE, x, 0.46, z); B(0.86, 0.5, 0.08, HW_BLUE, x, 0.82, z + 0.3); }
    B(5, 0.06, 0.06, HW_INOX, 7.7, 0.3, z + 0.05); [5.3, 7.7, 10.1].forEach(x => B(0.06, 0.46, 0.5, HW_INOX, x, 0.23, z)); sol(7.7, z, 2.55, 0.35); });
  { const sc = skin(3.4, 1.9, 60, (x, w, h) => { x.fillStyle = "#0b1d26"; x.fillRect(0, 0, w, h); x.fillStyle = "#0e7f77"; x.fillRect(0, 0, w, 0.45); signText(x, "NOW CALLING", w / 2, 0.24, 3, 0.3, "#ffffff");
      signText(x, "A-025", 1.0, 1.1, 1.8, 0.8, "#69db7c"); signText(x, "ROOM 3", 2.55, 1.1, 1.5, 0.45, "#ffd43b"); [["A-026", "Room 1"], ["A-027", "Room 2"]].forEach(([a, b], i) => { signText(x, a + "   " + b, w / 2, 1.62 + i * 0.0 + (i ? 0.0 : 0), 3, 0.22, "#adb5bd"); }); });
    const b = B(3.5, 2.0, 0.08, 0x101417, 8, 3.8, 7); b.userData.flat = true; plane(sc, 3.4, 1.9, 8, 3.8, 7.05, 0, true);
    [-1.5, 1.5].forEach(d => { const r = B(0.05, H - 4.8, 0.05, 0x6b7780, 8 + d, (H + 4.8) / 2, 7); r.userData.flat = true; }); }
  B(0.4, 1.0, 0.4, 0xffffff, 13.6, 0.5, 8.6); C(0.17, 0.45, 0x74c0fc, 13.6, 1.22, 8.6, 14); B(0.1, 0.06, 0.1, HW_RED, 13.45, 0.9, 8.82); B(0.1, 0.06, 0.1, 0x1c7ed6, 13.75, 0.9, 8.82); sol(13.6, 8.6, 0.3, 0.3);   // cây nước
  B(0.9, 0.04, 0.6, HW_WOOD, 13.4, 0.5, 12.2); B(0.06, 0.5, 0.5, HW_INOX, 13.0, 0.25, 12.2); B(0.06, 0.5, 0.5, HW_INOX, 13.8, 0.25, 12.2); B(0.3, 0.02, 0.22, 0xff8787, 13.3, 0.53, 12.2); B(0.3, 0.02, 0.22, 0x74c0fc, 13.5, 0.55, 12.15); sol(13.4, 12.2, 0.5, 0.35);   // bàn nhỏ + tạp chí
  pot(g, cx + 13.6, cz + 15.6, 1.5); sol(13.6, 15.6, 0.4, 0.4);
  B(0.5, 1.5, 0.35, HW_BLUE, 3.8, 0.75, 7.6); B(0.3, 0.2, 0.02, 0xffffff, 3.8, 1.2, 7.8); B(0.4, 0.04, 0.2, 0x1c7ed6, 3.8, 1.52, 7.6); sol(3.8, 7.6, 0.3, 0.25);   // máy lấy số
  { const t = textPlate("TAKE A NUMBER", 0.55, 0.22, "#0b7285", "#ffffff"); t.position.set(cx + 3.8, 1.38, cz + 7.78); g.add(t); }
  [[-4.5, 20.4], [4.5, 20.4], [-13.5, 20.4], [13.5, 20.4], [-13.5, 13.2]].forEach(([x, z]) => { pot(g, cx + x, cz + z, 1.4); sol(x, z, 0.4, 0.4); });   // chậu cây ở sảnh
  // xe lăn (khu gần cửa, bên trái)
  [-12.6, -11.4].forEach(x => { B(0.5, 0.06, 0.5, 0x495057, x, 0.5, 18.4); B(0.5, 0.5, 0.06, 0x495057, x, 0.78, 18.65); [-1, 1].forEach(s => { const w = C(0.3, 0.05, 0x212529, x + s * 0.3, 0.3, 18.4, 14); w.rotation.z = Math.PI / 2; B(0.04, 0.05, 0.4, 0xadb5bd, x + s * 0.27, 0.8, 18.5); }); sol(x, 18.4, 0.4, 0.4); });

  // ==== PHARMACY: quầy sát tường phải, mặt quầy x = 11.8, z −3..6 ====
  B(0.4, 1.0, 9, 0xffffff, 12.0, 0.5, 1.5); B(0.7, 0.07, 9.2, HW_WOOD, 12.0, 1.035, 1.5); B(0.04, 0.62, 9, 0xf08c00, 11.78, 0.5, 1.5); sol(12.0, 1.5, 0.2, 4.5);
  B(0.04, 0.6, 9, 0xd0ebff, 12.0, 1.4, 1.5).material = new THREE.MeshLambertMaterial({ color: 0xd0ebff, transparent: true, opacity: 0.25 });   // kính chắn
  B(0.3, 0.3, 0.4, 0x343a40, 12.1, 1.25, 4); B(0.04, 0.2, 0.3, 0x69db7c, 11.94, 1.3, 4); B(0.3, 0.3, 0.4, 0x343a40, 12.1, 1.25, -1);   // máy tính tiền / máy tính
  B(0.4, 1.0, 9, 0xdfe6e9, 14.78, 0.5, 1.5);
  { const sh = skin(9, 2.6, 50, (x, w, h) => { x.fillStyle = "#e9ecef"; x.fillRect(0, 0, w, h); for (let r = 0; r < 4; r++) { x.fillStyle = "#adb5bd"; x.fillRect(0, r * 0.65 + 0.58, w, 0.06);
        for (let i = 0; i < 30; i++) { x.fillStyle = ["#ffffff", "#fa5252", "#51cf66", "#4dabf7", "#ffd43b", "#9775fa", "#ff922b"][(i * 7 + r * 3) % 7]; const bw = 0.22 + (i * 13 % 5) * 0.02, bh = 0.28 + (i * 5 % 4) * 0.06; x.fillRect(0.1 + i * 0.295, r * 0.65 + 0.58 - bh, bw, bh); x.fillStyle = "#2b8a3e"; x.fillRect(0.1 + i * 0.295, r * 0.65 + 0.58 - bh * 0.55, bw, 0.05); } } });
    plane(sh, 9, 2.6, 14.96, 2.45, 1.5, -Math.PI / 2); }
  plane(skin(1.2, 1.2, 50, (x) => { x.fillStyle = "#2f9e44"; x.fillRect(0, 0, 1.2, 1.2); x.fillStyle = "#fff"; x.fillRect(0.45, 0.15, 0.3, 0.9); x.fillRect(0.15, 0.45, 0.9, 0.3); }), 1.0, 1.0, 14.96, 4.5, 1.5, -Math.PI / 2);   // chữ thập xanh

  // ==== CLINIC: x −15..−4, z −8..+4, vách ngăn thấp, lối vào rộng 2,8 m ở x = −4 ====
  part(-4, -6, 4, true); part(-4, 1.4, 5.2, true);   // mặt phía hành lang (hở z −4..−1.2)
  part(-9.5, 4, 11, false); part(-9.5, -8, 11, false);
  B(2.4, 0.08, 0.9, HW_WOOD, -11, 0.9, -6); B(0.08, 0.9, 0.8, 0xf4f8f8, -12.15, 0.45, -6); B(0.08, 0.9, 0.8, 0xf4f8f8, -9.85, 0.45, -6); sol(-11, -6, 1.2, 0.45);   // bàn bác sĩ
  B(0.5, 0.32, 0.04, 0x1b1f23, -11.6, 1.2, -6.2); B(0.44, 0.26, 0.02, 0x3b8fd6, -11.6, 1.2, -6.17); B(0.08, 0.16, 0.08, 0x333a40, -11.6, 1.05, -6.2); B(0.4, 0.02, 0.14, 0x222831, -11.6, 0.95, -5.85);
  { const st = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 6, 16), mat(0x495057)); st.position.set(cx - 10.3, 0.96, cz - 5.9); st.rotation.x = Math.PI / 2; g.add(st); }   // ống nghe
  [[-11, -4.8], [-11, -6.95]].forEach(([x, z]) => { B(0.5, 0.06, 0.5, 0x1c7ed6, x, 0.48, z); B(0.5, 0.5, 0.06, 0x1c7ed6, x, 0.78, z + (z < -6 ? -0.25 : 0.25)); B(0.05, 0.46, 0.05, 0x495057, x, 0.23, z); sol(x, z, 0.3, 0.3); });
  B(0.9, 0.45, 2.0, 0xffffff, -13.3, 0.45, 1.8); B(0.8, 0.12, 1.9, HW_TEAL, -13.3, 0.74, 1.8); B(0.5, 0.1, 0.35, 0xffffff, -13.3, 0.85, 2.5); sol(-13.3, 1.8, 0.5, 1.05);   // giường khám
  B(0.5, 0.1, 0.5, 0x495057, -6.2, 0.05, 2.8); B(0.06, 1.3, 0.06, 0x868e96, -6.2, 0.7, 2.95); B(0.34, 0.16, 0.14, 0x212529, -6.2, 1.4, 2.95); B(0.5, 0.03, 0.5, 0xffffff, -6.2, 0.11, 2.8); sol(-6.2, 2.8, 0.3, 0.3);   // cân
  B(0.4, 0.5, 0.5, 0xdfe6e9, -10.8, 0.25, 2.5); B(0.8, 0.05, 0.5, 0xadb5bd, -10.8, 0.85, 2.5); B(0.04, 0.6, 0.04, 0x868e96, -11.15, 0.55, 2.7); B(0.04, 0.6, 0.04, 0x868e96, -10.45, 0.55, 2.7); sol(-10.8, 2.5, 0.42, 0.28);   // xe dụng cụ
  B(0.55, 1.9, 1.4, 0xf4f8f8, -14.6, 0.95, -5.5); sol(-14.6, -5.5, 0.28, 0.7);
  plane(skin(1.3, 1.8, 50, (x, w, h) => { x.fillStyle = "#d0ebff"; x.fillRect(0, 0, w, h); for (let r = 0; r < 4; r++) { x.fillStyle = "#ced4da"; x.fillRect(0, 0.4 + r * 0.42, w, 0.04); [0.2, 0.5, 0.85, 1.1].forEach((X, i) => { x.fillStyle = ["#fa5252", "#51cf66", "#fab005", "#4dabf7"][(i + r) % 4]; x.fillRect(X, 0.15 + r * 0.42, 0.14, 0.25); }); } }), 1.3, 1.8, -14.31, 0.95, -5.5, Math.PI / 2);   // kính tủ thuốc
  plane(skin(0.9, 1.5, 60, (x, w, h) => { x.fillStyle = "#fff"; x.fillRect(0, 0, w, h); x.strokeStyle = "#868e96"; x.lineWidth = 0.02; x.strokeRect(0.02, 0.02, w - 0.04, h - 0.04);
    [0.28, 0.2, 0.14, 0.1, 0.07, 0.05].forEach((s, i) => signText(x, ["E", "F P", "T O Z", "L P E D", "P E C F D", "E D F C Z P"][i], w / 2, 0.2 + [0, 0.3, 0.52, 0.7, 0.85, 1.0][i] + (i ? 0.1 : 0), w - 0.1, s, "#212529")); }), 0.9, 1.5, -14.94, 1.7, -1.0, Math.PI / 2);   // bảng đo mắt
  plane(skin(1.4, 1.8, 50, (x, w, h) => { x.fillStyle = "#e7f5ff"; x.fillRect(0, 0, w, h); signText(x, "BODY", w / 2, 0.2, w - 0.2, 0.25, "#1c7ed6"); x.fillStyle = "#ffc9c9"; x.beginPath(); x.arc(w / 2, 0.55, 0.16, 0, 7); x.fill(); x.fillRect(w / 2 - 0.22, 0.75, 0.44, 0.65); x.fillRect(w / 2 - 0.5, 0.78, 0.25, 0.1); x.fillRect(w / 2 + 0.25, 0.78, 0.25, 0.1); x.fillStyle = "#fa5252"; x.beginPath(); x.arc(w / 2 - 0.06, 0.95, 0.06, 0, 7); x.fill(); x.fillStyle = "#4dabf7"; x.fillRect(w / 2 - 0.1, 1.1, 0.2, 0.2); }), 1.4, 1.8, -14.94, 2.5, 2.8, Math.PI / 2);   // poster cơ thể

  // ==== WARD: x −15..−3, z −22..−10: 4 giường có rèm, tủ đầu giường, giá truyền dịch ====
  part(-3.2, -16, 11, true);
  [-13.6, -10.9, -8.2, -5.5].forEach((x, i) => {
    B(0.9, 0.4, 2.0, HW_INOX, x, 0.4, -20.85); B(0.82, 0.14, 1.94, 0xffffff, x, 0.67, -20.85); B(0.82, 0.04, 1.2, 0x74c0fc, x, 0.76, -20.3); B(0.5, 0.1, 0.34, 0xffffff, x, 0.78, -21.5); B(0.9, 0.7, 0.06, HW_INOX, x, 0.95, -21.88); sol(x, -20.85, 0.5, 1.0);
    B(0.04, 1.8, 1.6, 0xa5d8ff, x + 0.62, 1.3, -20.2);   // rèm
    B(0.04, 0.06, 1.7, 0x868e96, x + 0.62, 2.25, -20.2);   // thanh rèm
    B(0.5, 0.65, 0.45, 0xf1f3f5, x - 0.8, 0.33, -21.55); B(0.52, 0.04, 0.47, HW_TEAL, x - 0.8, 0.67, -21.55); sol(x - 0.8, -21.55, 0.26, 0.24);   // tủ đầu giường
    B(0.04, 1.9, 0.04, HW_INOX, x + 0.45, 0.95, -21.3); B(0.4, 0.04, 0.04, HW_INOX, x + 0.45, 1.9, -21.3); B(0.14, 0.24, 0.05, 0xdbe9f4, x + 0.62 - 0.17, 1.72, -21.3); B(0.5, 0.04, 0.5, HW_INOX, x + 0.45, 0.04, -21.3); sol(x + 0.45, -21.3, 0.2, 0.2);   // giá truyền dịch + túi dịch
  });
  B(10.5, 0.06, 0.04, 0x868e96, -9.5, 2.28, -19.4);   // ray rèm chạy dọc phòng

  // ==== LAB: x +3..+15, z −22..−10 ====
  part(3.2, -16, 11, true);
  B(10, 0.9, 0.8, 0xf1f3f5, 8.9, 0.45, -21.4); B(10.2, 0.07, 1.0, 0x343a40, 8.9, 0.935, -21.4); sol(8.9, -21.4, 5, 0.4);   // bàn thí nghiệm sau
  B(0.8, 0.9, 5.6, 0xf1f3f5, 14.5, 0.45, -16); B(1.0, 0.07, 5.8, 0x343a40, 14.5, 0.935, -16); sol(14.5, -16, 0.5, 2.9);   // bàn dọc tường phải
  B(2.8, 0.9, 1.0, 0xf1f3f5, 4.9, 0.45, -14.5); B(3.0, 0.07, 1.2, 0x343a40, 4.9, 0.935, -14.5); sol(4.9, -14.5, 1.5, 0.6);   // bàn giữa phòng
  const micro = (x, y, z) => { B(0.26, 0.04, 0.34, 0x212529, x, y + 0.02, z); B(0.06, 0.34, 0.06, 0xf1f3f5, x, y + 0.2, z - 0.1); const t = C(0.04, 0.3, 0x495057, x, y + 0.3, z, 8); t.rotation.x = 0.25; B(0.2, 0.02, 0.2, 0x868e96, x, y + 0.12, z + 0.02); };
  micro(5.4, 0.97, -21.3); micro(10.2, 0.97, -21.3); micro(4.6, 0.97, -14.5);
  const rack = (x, y, z) => { B(0.5, 0.04, 0.16, 0xe8590c, x, y + 0.02, z); [0, 1, 2, 3, 4].forEach(i => C(0.028, 0.2, [0xfa5252, 0x51cf66, 0xffd43b, 0x4dabf7, 0xcc5de8][i], x - 0.2 + i * 0.1, y + 0.14, z, 8)); };
  rack(7.4, 0.97, -21.3); rack(12.2, 0.97, -21.3); rack(5.8, 0.97, -14.5); rack(14.5, 0.97, -14.5);
  [[8.6, 0x51cf66], [9.1, 0x4dabf7], [13.2, 0xfa5252]].forEach(([x, c]) => { C(0.1, 0.18, c, x, 1.06, -21.3, 12); C(0.03, 0.14, 0xe9ecef, x, 1.22, -21.3, 8); });   // bình thí nghiệm
  B(0.9, 1.9, 0.9, 0xf8f9fa, 14.3, 0.95, -11.9); B(0.04, 1.7, 0.7, 0x74c0fc, 13.85, 0.95, -11.9); B(0.04, 0.5, 0.05, 0x868e96, 13.82, 1.3, -11.6); sol(14.3, -11.9, 0.46, 0.46);   // tủ lạnh mẫu
  { const t = textPlate("SAMPLES 4°C", 0.6, 0.2, "#1c7ed6", "#ffffff"); t.rotation.y = -Math.PI / 2; t.position.set(cx + 13.82, 1.7, cz - 11.9); g.add(t); }
  plane(skin(3.2, 2.0, 50, (x, w, h) => { x.fillStyle = "#fff"; x.fillRect(0, 0, w, h); x.fillStyle = "#364fc7"; x.fillRect(0, 0, w, 0.3); signText(x, "PERIODIC TABLE", w / 2, 0.16, 2.8, 0.2, "#fff");
    for (let r = 0; r < 7; r++) for (let c = 0; c < 18; c++) { if (r < 3 && c > 1 && c < 12 || (r === 0 && c > 0 && c < 17)) continue; x.fillStyle = ["#ffa8a8", "#ffd8a8", "#fff3bf", "#d8f5a2", "#a5d8ff", "#d0bfff"][(c + r * 2) % 6]; x.fillRect(0.1 + c * 0.168, 0.4 + r * 0.22, 0.15, 0.2); } }), 3.2, 2.0, 14.96, 2.7, -16.2, -Math.PI / 2);
  plane(skin(2.2, 1.5, 50, (x, w, h) => { x.fillStyle = "#e6fcf5"; x.fillRect(0, 0, w, h); x.strokeStyle = "#0ca678"; x.lineWidth = 0.05; x.strokeRect(0.03, 0.03, w - 0.06, h - 0.06); signText(x, "GERMS", w / 2, 0.2, 1.8, 0.28, "#087f5b");
    [[0.5, 0.8, 0.22, "#51cf66"], [1.1, 0.9, 0.28, "#fa5252"], [1.7, 0.75, 0.2, "#fab005"], [0.8, 1.2, 0.18, "#4dabf7"]].forEach(([X, Y, r, c]) => { x.fillStyle = c; x.beginPath(); x.arc(X, Y, r, 0, 7); x.fill(); x.fillStyle = "#212529"; x.fillRect(X - r * 0.4, Y - r * 0.2, r * 0.2, r * 0.2); x.fillRect(X + r * 0.2, Y - r * 0.2, r * 0.2, r * 0.2); x.fillRect(X - r * 0.3, Y + r * 0.25, r * 0.6, r * 0.08); });
    x.fillStyle = "#ff922b"; x.beginPath(); x.roundRect ? x.roundRect(1.4, 1.1, 0.6, 0.2, 0.1) : x.rect(1.4, 1.1, 0.6, 0.2); x.fill(); }), 2.2, 1.5, 11.5, 3.0, BK + 0.04, 0);

  // ==== BÀN TRỰC Y TÁ ngay sau Nurse Mai (0, −19.6) ====
  B(3.6, 1.0, 0.6, 0xffffff, 0, 0.5, -21.2); B(3.8, 0.07, 0.8, HW_WOOD, 0, 1.035, -21.2); B(3.62, 0.5, 0.04, HW_TEAL, 0, 0.5, -20.9); sol(0, -21.2, 1.8, 0.3);
  B(0.5, 0.32, 0.04, 0x1b1f23, -1.0, 1.3, -21.3); B(0.44, 0.26, 0.02, 0x3b8fd6, -1.0, 1.3, -21.27); B(0.08, 0.16, 0.08, 0x333a40, -1.0, 1.16, -21.3); B(0.3, 0.14, 0.22, 0x212529, 1.0, 1.12, -21.2);

  // ==== chỗ bày từ vựng: [x, y, z, đứngX, đứngZ] (toạ độ tuyệt đối) ====
  const A = (list) => list.map(([x, y, z, sx, sz]) => [cx + x, y, cz + z, cx + sx, cz + sz]);
  P.anchors = {
    reception: A([-8.2, -7.4, -6.6, -5.8, -5.0, -4.2].map(x => [x, 1.35, 11.7, x, 12.9])),
    waiting: A([[13.6, 1.6, 8.6, 12.4, 8.6], [13.6, 1.5, 15.6, 12.4, 15.6], [3.8, 1.8, 7.6, 3.8, 8.9], [9.2, 0.95, 9.6, 9.2, 8.3], [9.2, 0.95, 14.8, 9.2, 13.2], [13.4, 0.9, 12.2, 12.2, 12.2], [8, 3.9, 7.3, 8, 8.3]]),
    pharmacy: A([-2.2, -0.8, 0.6, 2.0, 3.4, 4.8].map(z => [12.0, 1.4, z, 10.85, z]).concat([[14.4, 2.2, -0.5, 10.85, -0.5], [14.4, 2.8, 3.5, 10.85, 3.5]])),
    clinic: A([[-11.8, 1.15, -6, -11.8, -3.6], [-10.2, 1.15, -6, -10.2, -3.6], [-13.3, 1.15, 1.9, -12.0, 1.9], [-6.2, 1.55, 2.8, -6.2, 1.4], [-14.5, 1.9, -1.0, -13.2, -1.0], [-14.2, 2.0, -5.5, -12.9, -3.7], [-10.8, 1.1, 2.5, -10.8, 0.9]]),
    ward: A([-13.6, -10.9, -8.2, -5.5].map(x => [x, 1.1, -20.8, x, -18.9]).concat([[-8.2 - 0.8, 0.95, -21.55, -9.0, -18.9], [-5.5 - 0.8, 0.95, -21.55, -6.3, -18.9], [-13.15, 2.1, -21.3, -12.4, -18.9]])),
    lab: A([[5.4, 1.35, -21.3, 5.4, -19.6], [7.4, 1.35, -21.3, 7.4, -19.6], [9.0, 1.35, -21.3, 9.0, -19.6], [10.2, 1.35, -21.3, 10.2, -19.6], [12.2, 1.35, -21.3, 12.2, -19.6], [4.6, 1.35, -14.5, 4.6, -12.9], [5.8, 1.35, -14.5, 5.8, -12.9], [14.5, 1.35, -17, 12.9, -17], [14.5, 1.35, -15, 12.9, -15], [14.3, 2.15, -11.9, 12.6, -11.9]]),
    ceiling: A([[5, 5.4, 4, 5, 4], [-6, 5.4, 6.2, -6, 6.6]])
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["hospitalhall"] = {
  furnish: furnishHospital,
  wall: (len, h, w) => hospWall(len, h, w.x === 0 ? (w.z < 0 ? "back" : "front") : (w.x < 0 ? "left" : "right")),
  bright: true
};
