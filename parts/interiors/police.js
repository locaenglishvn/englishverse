/* EnglishVerse – nội thất "police" (layout: "policehall"). Mỗi nơi 1 file (xem docs/TEAM.md).
   POLICE STATION – đồn công an thân thiện (24 × 30 m, trần 5 m), kiểu trụ sở Pháp ở Hà Nội: tường vàng kem, chân tường xanh dương đậm,
   cửa sổ có cánh chớp xanh, sàn gạch sáng + vạch xanh chỉ đường. KHÔNG súng / còng tay / nhà giam: cảnh sát là người giúp đỡ.
   Huy hiệu tự vẽ (ngôi sao xanh "VERSE POLICE"), không dùng quốc huy thật. Toạ độ (x, z) tính từ giữa phòng, cửa ở z = +15.
   Khu:  desk     – quầy tiếp dân (-5, 9.3), mặt quầy hướng cửa; sổ ghi, chuông, máy tính, bảng "HOW CAN WE HELP?"
         office   – 4 bàn làm việc bên phải (x +3..+12, z -4..+6), tủ hồ sơ
         dispatch – phòng điều phối sau-trái: bản đồ lớn, bàn bộ đàm, màn hình camera giao thông, bảng vụ việc của thám tử
         gear     – khu trang bị sau-phải: tủ đồ, mũ, áo phản quang, đèn pin, xe đạp tuần tra, nón giao thông
         lostfound– kệ đồ thất lạc dọc tường trái (ô dù, ba lô, gấu bông, chìa khoá, ví)
   Chừa trống: lối vào x -1.5..+1.5, z +8..+15; hành lang giữa; chỗ NPC (-5,8) (6,2) (-7,-6) (7,-9) (-2,-11) (bán kính 0,8 m). Mọi thứ đứng im. */
const PL = { cream: "#f3e2a9", blue: "#1b4a8c", navy: "#12376b", wood: 0xb98b54, bl: 0x1b4a8c, nv: 0x12376b, wh: 0xf4f6f8, gr: 0x8d99a6, dk: 0x2b3138 };
const PLW = {};
function policeWall(len, h, kind) {   // tường vàng kem, chân tường xanh đậm, cửa sổ cánh chớp xanh
  const k = len + kind; if (PLW[k]) return PLW[k];
  const t = skin(len, h, 16, (x, Wd, Hh) => {
    x.fillStyle = PL.cream; x.fillRect(0, 0, Wd, Hh);
    x.fillStyle = "#e6d08c"; for (let X = 0; X < Wd; X += 3) x.fillRect(X, 0.5, 0.04, Hh - 1.8);   // vạch ốp nhẹ
    x.fillStyle = PL.blue; x.fillRect(0, Hh - 1.2, Wd, 1.2); x.fillStyle = "#ffffff"; x.fillRect(0, Hh - 1.26, Wd, 0.07); x.fillStyle = PL.navy; x.fillRect(0, Hh - 0.12, Wd, 0.12);   // chân tường xanh
    x.fillStyle = "#fff6d4"; x.fillRect(0, 0, Wd, 0.3); x.fillStyle = "#c9a227"; x.fillRect(0, 0.3, Wd, 0.07);   // phào trên
    for (let X = 0; X < Wd + 1; X += 4) { x.fillStyle = "#fff3c4"; x.fillRect(X - 0.12, 0.4, 0.24, Hh - 1.7); }   // cột ốp
    const win = (c) => {   // c = tâm cửa sổ trên ảnh tường
      const w = 1.7, X = c - w / 2, Y = 1.0, hh = 1.9;
      x.fillStyle = "#2d5fa8"; x.fillRect(X - 0.62, Y, 0.55, hh); x.fillRect(X + w + 0.07, Y, 0.55, hh);   // cánh chớp
      x.fillStyle = "#1f4a8a"; for (let j = 0; j < 9; j++) { x.fillRect(X - 0.62, Y + 0.12 + j * 0.2, 0.55, 0.04); x.fillRect(X + w + 0.07, Y + 0.12 + j * 0.2, 0.55, 0.04); }
      rectWin(x, X, Y, w, hh, "#cfe6f5", "#ffffff"); x.fillStyle = "#eaf5fc"; x.fillRect(X, Y, w * 0.3, hh * 0.4);
      x.fillStyle = "#ffffff"; x.fillRect(X + w / 2 - 0.03, Y, 0.06, hh); x.fillRect(X, Y + hh * 0.45, w, 0.06); x.fillRect(X - 0.15, Y + hh + 0.1, w + 0.3, 0.1);
    };
    if (kind === "front") [-8.5, -4.5, 4.5, 8.5].forEach(dx => win(Wd / 2 + dx));
    if (kind === "right") [-11, -7, -3, 1, 5].forEach(z => win(Wd / 2 + z));
    if (kind === "left") win(Wd / 2 - 12.8);
  });
  return PLW[k] = new THREE.MeshLambertMaterial({ map: t });
}
function policeFloor(W, D) {   // gạch sáng 1,2 m + vạch xanh từ cửa về từng khu
  return skin(W, D, 18, (x) => {
    x.fillStyle = "#c3cad2"; x.fillRect(0, 0, W, D);
    x.fillStyle = "#b3bcc6"; for (let i = 0; i < W / 1.2; i++) for (let j = 0; j < D / 1.2; j++) if ((i + j) % 2) x.fillRect(i * 1.2, j * 1.2, 1.2, 1.2);
    x.fillStyle = "#8f9aa6"; for (let X = 0; X < W; X += 1.2) x.fillRect(X, 0, 0.025, D); for (let Y = 0; Y < D; Y += 1.2) x.fillRect(0, Y, W, 0.025);
    const cX = W / 2, cY = D / 2;
    x.fillStyle = "#e8eef7"; x.fillRect(cX - 6.5, cY - 14.5, 5.4, 8.5); x.fillStyle = "#dbe6f5"; x.fillRect(cX - 6.1, cY - 14.1, 4.6, 7.7);   // thảm sáng khu điều phối
    x.strokeStyle = "#1b4a8c"; x.lineWidth = 0.2; x.beginPath(); x.moveTo(cX, cY + 15); x.lineTo(cX, cY - 14); x.stroke();   // vạch giữa
    const stub = (z, dir, label) => { x.beginPath(); x.moveTo(cX, cY + z); x.lineTo(cX + dir * 3, cY + z); x.stroke(); x.fillStyle = "#1b4a8c"; x.beginPath(); x.moveTo(cX + dir * 3.4, cY + z); x.lineTo(cX + dir * 3, cY + z - 0.28); x.lineTo(cX + dir * 3, cY + z + 0.28); x.fill();
      signText(x, label, cX + dir * 1.6, cY + z - 0.45, 2.2, 0.36, "#1b4a8c"); };
    stub(12, -1, "INFORMATION"); stub(2.5, 1, "OFFICE"); stub(-3.2, -1, "DISPATCH"); stub(-8, 1, "GEAR");
    x.fillStyle = "#c92a2a"; x.fillRect(cX - 1.2, cY + D / 2 - 0.9, 2.4, 0.9);   // thảm cửa
  });
}
function policeBadge(s) {   // huy hiệu tự vẽ: ngôi sao xanh + chữ VERSE POLICE
  return skin(s, s, 80, (x) => {
    const c = s / 2; x.fillStyle = "#c9a227"; x.beginPath(); x.arc(c, c, c * 0.98, 0, 7); x.fill(); x.fillStyle = "#12376b"; x.beginPath(); x.arc(c, c, c * 0.88, 0, 7); x.fill();
    x.fillStyle = "#fbe38e"; x.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? c * 0.26 : c * 0.62, a = -Math.PI / 2 + i * Math.PI / 5; x.lineTo(c + Math.cos(a) * r, c * 0.92 + Math.sin(a) * r); } x.closePath(); x.fill();
    x.fillStyle = "#1b4a8c"; x.beginPath(); x.arc(c, c * 0.92, c * 0.17, 0, 7); x.fill();
    signText(x, "VERSE POLICE", c, c * 1.72, s * 0.7, s * 0.11, "#ffffff");
  });
}
function policeMap(w, h) {   // bản đồ thành phố lớn: đường, sông, công viên, ghim đỏ
  return skin(w, h, 60, (x) => {
    x.fillStyle = "#efe9d2"; x.fillRect(0, 0, w, h); x.fillStyle = "#b9dfa4"; x.fillRect(0.4, 0.5, 1.4, 0.8); x.fillRect(4.2, 1.1, 1.3, 0.8);
    x.strokeStyle = "#7fc3e8"; x.lineWidth = 0.35; x.beginPath(); x.moveTo(0, 1.6); x.bezierCurveTo(1.6, 0.9, 3, 2.1, w, 1.2); x.stroke();
    x.strokeStyle = "#ffffff"; x.lineWidth = 0.14; for (let X = 0.8; X < w; X += 1.1) { x.beginPath(); x.moveTo(X, 0.3); x.lineTo(X + 0.2, h); x.stroke(); } for (let Y = 0.7; Y < h; Y += 0.65) { x.beginPath(); x.moveTo(0, Y); x.lineTo(w, Y + 0.1); x.stroke(); }
    x.fillStyle = "#c9b79a"; [[1.6, 0.3], [2.9, 1.7], [3.6, 0.4], [5.0, 0.4], [0.6, 1.7]].forEach(([X, Y]) => x.fillRect(X, Y, 0.35, 0.3));
    [[1.2, 1.0], [2.4, 0.6], [3.5, 1.5], [4.8, 1.6], [5.2, 0.7]].forEach(([X, Y], i) => { x.fillStyle = "#e03131"; x.beginPath(); x.arc(X, Y, 0.1, 0, 7); x.fill(); x.fillStyle = "#fff"; x.beginPath(); x.arc(X, Y, 0.04, 0, 7); x.fill(); });
    x.fillStyle = "#1b4a8c"; x.fillRect(0, 0, w, 0.32); signText(x, "VERSE CITY MAP", w / 2, 0.17, 3.6, 0.22, "#ffffff");
  });
}
function furnishPolice(P, g, cx, cz, W, D, fur) {
  const H = (P.size || {}).h || 5, S = P.room.solids, BK = -D / 2, FR = D / 2, LW = -W / 2, RW = W / 2;
  const sol = (x, z, hw, hd) => S.push({ x: cx + x, z: cz + z, hw, hd });
  const B = (w, h, d, c, x, y, z) => lb(g, w, h, d, c, cx + x, y, cz + z);
  const C = (r, h, c, x, y, z, seg) => lc(g, r, r, h, c, cx + x, y, cz + z, seg || 12);
  const flat = (m) => { m.userData.flat = true; return m; };
  const plane = (tex, w, h, x, y, z, ry, basic) => flat((() => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic ? new THREE.MeshBasicMaterial({ map: tex }) : new THREE.MeshLambertMaterial({ map: tex })); m.position.set(cx + x, y, cz + z); m.rotation.y = ry || 0; g.add(m); return m; })());
  const plate = (t, w, h, bg, fg, x, y, z, ry) => { const p = textPlate(t, w, h, bg, fg); p.position.set(cx + x, y, cz + z); p.rotation.y = ry || 0; g.add(p); return p; };
  const loc = (x, z, ry) => { const c = Math.round(Math.cos(ry)), s = Math.round(Math.sin(ry)); return (w, h, d, col, lx, y, lz) => B(s ? d : w, h, s ? w : d, col, x + lx * c + lz * s, y, z - lx * s + lz * c); };   // khối theo hệ toạ độ vật (ry bội 90°)
  // ---- sàn + trần ----
  g.children[0].material = new THREE.MeshLambertMaterial({ map: policeFloor(W, D) });
  { const ct = skin(W, D, 8, (x) => { x.fillStyle = "#f4f1e6"; x.fillRect(0, 0, W, D); x.fillStyle = "#dcd6c2"; for (let X = 0; X < W; X += 1.2) x.fillRect(X, 0, 0.03, D); for (let Y = 0; Y < D; Y += 1.2) x.fillRect(0, Y, W, 0.03);
      for (let X = 3; X < W - 1; X += 6) for (let Y = 3; Y < D - 1; Y += 6) { x.fillStyle = "#b9c0c6"; x.fillRect(X - 0.7, Y - 0.35, 1.4, 0.7); x.fillStyle = "#ffffff"; x.fillRect(X - 0.62, Y - 0.27, 1.24, 0.54); } });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshBasicMaterial({ map: ct, side: THREE.DoubleSide })); m.rotation.x = Math.PI / 2; m.position.set(cx, H - 0.02, cz); flat(m); g.add(m); }
  // ---- chung: ghế, máy tính, bàn ----
  const chair = (x, z, ry, c) => { const b = loc(x, z, ry); b(0.5, 0.07, 0.5, c || PL.bl, 0, 0.48, 0); b(0.5, 0.5, 0.07, c || PL.bl, 0, 0.8, -0.24); b(0.07, 0.46, 0.07, PL.dk, 0, 0.23, 0); b(0.4, 0.04, 0.4, PL.dk, 0, 0.04, 0); sol(x, z, 0.3, 0.3); };
  const comp = (x, y, z, ry) => { const b = loc(x, z, ry); b(0.5, 0.32, 0.04, 0x1b1f23, 0, y + 0.3, 0); b(0.44, 0.26, 0.02, 0x4aa3e0, 0, y + 0.3, 0.025); b(0.08, 0.16, 0.08, PL.dk, 0, y + 0.1, 0); b(0.4, 0.02, 0.14, 0x222831, 0, y + 0.02, 0.3); };
  const desk = (x, z, w, d) => { B(w, 0.06, d, PL.wood, x, 0.75, z); B(0.06, 0.72, d - 0.05, PL.wh, x - w / 2 + 0.05, 0.36, z); B(0.06, 0.72, d - 0.05, PL.wh, x + w / 2 - 0.05, 0.36, z); sol(x, z, w / 2, d / 2); };
  const cabinet = (x, z, ry, n) => { const b = loc(x, z, ry); for (let i = 0; i < (n || 1); i++) { const o = i * 0.62; b(0.6, 1.3, 0.5, 0x9aa7b4, o, 0.65, 0); [0.35, 0.75, 1.1].forEach(y => { b(0.5, 0.03, 0.01, 0x6c7a89, o, y, 0.255); b(0.14, 0.03, 0.02, PL.dk, o, y + 0.1, 0.27); }); } sol(x + (ry ? 0 : ((n || 1) - 1) * 0.31), z + (ry ? ((n || 1) - 1) * -0.31 * Math.sign(Math.sin(ry)) : 0), ry ? 0.28 : 0.31 * (n || 1), ry ? 0.31 * (n || 1) : 0.28); };
  const helmet = (x, y, z, c) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(c)); m.position.set(cx + x, y, cz + z); g.add(m); B(0.3, 0.03, 0.3, c, x, y, z + 0.04); B(0.12, 0.03, 0.08, 0xf2c94c, x, y + 0.08, z + 0.17); };
  // ---- bảng treo trần ----
  const hang = (t, w, h, x, y, z, bg) => { B(w + 0.1, h + 0.1, 0.05, PL.nv, x, y, z); plate(t, w, h, bg || "#1b4a8c", "#ffffff", x, y, z + 0.03); [-1, 1].forEach(s => flat(B(0.04, H - y - h / 2, 0.04, PL.gr, x + s * (w / 2 - 0.3), (H + y + h / 2) / 2, z))); };
  // ---- huy hiệu: trên cửa (mặt trong) và tường sau ----
  plane(policeBadge(1.4), 1.4, 1.4, 0, 3.5, FR - 0.03, Math.PI, true);
  plane(policeBadge(1.4), 1.4, 1.4, 0.0, 3.35, BK + 0.03, 0, true);

  // ==== DESK: quầy tiếp dân tâm (-5, 9.3), dài 4 m, mặt quầy hướng cửa ====
  B(4.0, 1.0, 0.5, PL.bl, -5, 0.5, 9.3); B(4.3, 0.07, 0.85, PL.wood, -5, 1.035, 9.3); B(4.02, 0.12, 0.54, PL.nv, -5, 0.06, 9.3);
  plate("INFORMATION", 2.2, 0.32, "#ffffff", "#1b4a8c", -5, 0.62, 9.3 + 0.26);
  sol(-5, 9.3, 2.15, 0.45);
  comp(-6.7, 1.07, 9.15, Math.PI);   // máy tính (mặt hướng -z, về phía NPC)
  C(0.07, 0.14, 0x3b8fd6, -6.1, 1.14, 9.2); [0, 1, 2].forEach(i => { const p = C(0.008, 0.22, [0xe03131, 0x2f9e44, 0xf2c94c][i], -6.1 + (i - 1) * 0.025, 1.3, 9.2, 5); p.rotation.z = (i - 1) * 0.2; });   // cốc bút
  B(0.5, 0.03, 0.34, 0x1b4a8c, -5.5, 1.085, 9.5); B(0.22, 0.02, 0.3, 0xffffff, -5.62, 1.1, 9.5); B(0.22, 0.02, 0.3, 0xffffff, -5.38, 1.1, 9.5);   // sổ ghi
  C(0.1, 0.03, 0xc9a227, -4.5, 1.085, 9.5); C(0.035, 0.09, 0xc9a227, -4.5, 1.14, 9.5);   // chuông gọi
  B(0.26, 0.07, 0.2, PL.dk, -3.8, 1.1, 9.4); B(0.2, 0.03, 0.06, 0x495057, -3.8, 1.16, 9.4);   // điện thoại bàn
  plate("HELP DESK", 0.6, 0.2, "#c9a227", "#12376b", -3.3, 1.2, 9.55);
  hang("HOW CAN WE HELP?", 3.8, 0.8, -5, 3.6, 9.3);
  [-7, -6.1, -5.2, -4.3, -3.4].forEach(x => B(0.8, 1.3, 0.45, 0x9aa7b4, x, 0.65, 6.2)); sol(-5.2, 6.2, 2.45, 0.28);   // tủ thấp sau quầy
  B(2.6, 0.03, 0.3, PL.wood, -5.2, 1.32, 6.2);

  // ==== OFFICE: x +3..+12, z -4..+6 ====
  [[10.3, -2.6], [10.3, 1.0], [10.3, 4.6]].forEach(([x, z]) => { desk(x, z, 0.9, 2.0); comp(x, 0.78, z, -Math.PI / 2); chair(x - 1.1, z, Math.PI / 2); B(0.28, 0.02, 0.2, 0xffffff, x + 0.1, 0.79, z + 0.6); });
  desk(5.5, -2.8, 2.0, 0.9); comp(5.5, 0.78, -2.8, 0); chair(5.5, -1.85, Math.PI); B(0.2, 0.02, 0.28, 0xffd43b, 6.2, 0.79, -2.8);
  cabinet(3.4, -0.4, Math.PI / 2, 1); cabinet(11.7, 6.0, -Math.PI / 2, 1);
  hang("OFFICE", 1.4, 0.4, 8, 3.9, 6.5);
  [[11.8, -4.5], [3.5, 5.6]].forEach(([x, z]) => { pot(g, cx + x, cz + z, 1.3); sol(x, z, 0.35, 0.35); });
  plane(skin(1.6, 1.0, 50, (x, w, h) => { x.fillStyle = "#fff"; x.fillRect(0, 0, w, h); x.strokeStyle = "#1b4a8c"; x.lineWidth = 0.06; x.strokeRect(0.03, 0.03, w - 0.06, h - 0.06); signText(x, "DAILY PLAN", w / 2, 0.2, 1.3, 0.2, "#1b4a8c"); [0.45, 0.65, 0.85].forEach((y, i) => { x.fillStyle = ["#2f9e44", "#f2c94c", "#4aa3e0"][i]; x.fillRect(0.2, y - 0.05, 0.1, 0.1); x.fillStyle = "#adb5bd"; x.fillRect(0.4, y - 0.02, 0.9 - i * 0.15, 0.04); }); }), 1.6, 1.0, RW - 0.04, 2.9, 1.5, -Math.PI / 2);   // bảng kế hoạch (tường phải)

  // ==== DISPATCH: x -12..-3, z -15..-3 ====
  plane(policeMap(6, 2.2), 6, 2.2, -8.5, 3.1, BK + 0.04, 0, true); flat(B(6.2, 2.4, 0.05, PL.nv, -8.5, 3.1, BK + 0.015));
  B(5.2, 0.06, 0.8, PL.wood, -8.8, 0.75, -13.9); B(5.2, 0.7, 0.06, PL.wh, -8.8, 0.38, -13.55); B(0.06, 0.72, 0.76, PL.wh, -11.35, 0.36, -13.9); B(0.06, 0.72, 0.76, PL.wh, -6.25, 0.36, -13.9); sol(-8.8, -13.9, 2.6, 0.4);   // bàn điều phối sát tường sau
  comp(-10.2, 0.78, -13.9, 0); comp(-8.0, 0.78, -13.9, 0);
  chair(-10.2, -12.7, Math.PI); chair(-8.0, -12.7, Math.PI);
  const radio = (x, y, z, ry) => { const b = loc(x, z, ry); b(0.22, 0.04, 0.16, PL.dk, 0, y + 0.02, 0); b(0.12, 0.26, 0.07, 0x343a40, 0, y + 0.17, 0); b(0.1, 0.07, 0.01, 0x9aa7b4, 0, y + 0.2, 0.04); b(0.02, 0.2, 0.02, PL.dk, 0.04, y + 0.4, 0); b(0.03, 0.03, 0.01, 0x2f9e44, -0.03, y + 0.27, 0.04); };
  radio(-6.9, 0.78, -13.9, 0); B(0.3, 0.02, 0.2, 0xffffff, -9.1, 0.79, -13.8); C(0.07, 0.12, 0xe03131, -11.0, 0.84, -13.9);
  // bàn bộ đàm thứ hai giữa phòng, dọc theo z
  desk(-4.6, -9.4, 0.9, 2.6); radio(-4.6, 0.78, -10.3, Math.PI / 2); radio(-4.6, 0.78, -9.4, Math.PI / 2); comp(-4.6, 0.78, -8.5, Math.PI / 2 * 3);
  // 3 màn hình camera giao thông trên tường trái
  [-10, -8, -6].forEach(z => { B(0.06, 1.0, 1.6, PL.dk, LW + 0.05, 2.45, z); plane(skin(1.5, 0.9, 50, (x, w, h) => { x.fillStyle = "#16212b"; x.fillRect(0, 0, w, h); x.fillStyle = "#4a5560"; x.fillRect(0, h * 0.55, w, h * 0.45); x.fillStyle = "#f2c94c"; for (let X = 0.1; X < w; X += 0.4) x.fillRect(X, h * 0.76, 0.2, 0.04);
      x.fillStyle = ["#e03131", "#4aa3e0", "#2f9e44"][(z + 10) / 2 | 0]; x.fillRect(0.4 + ((z * 7) & 3) * 0.2, h * 0.6, 0.35, 0.18); x.fillStyle = "#69db7c"; signText(x, "CAM " + ((z + 12) / -2 | 0), 0.5, 0.12, 0.7, 0.14, "#69db7c"); }), 1.5, 0.9, LW + 0.09, 2.45, z, Math.PI / 2, true); });
  plate("TRAFFIC CAMERAS", 2.4, 0.3, "#1b4a8c", "#ffffff", LW + 0.05, 3.2, -8, Math.PI / 2);
  // bảng vụ việc của thám tử (tường sau, sau Detective)
  plane(skin(2.6, 1.3, 60, (x, w, h) => { x.fillStyle = "#6b4a2b"; x.fillRect(0, 0, w, h); x.fillStyle = "#c79a5f"; x.fillRect(0.08, 0.08, w - 0.16, h - 0.16); signText(x, "CASE: THE LOST CAT", w / 2, 0.22, 2.2, 0.22, "#12376b");
      [[0.4, 0.55, "#fff3a0"], [1.1, 0.6, "#ffc9c9"], [1.8, 0.55, "#c5f0c5"], [0.7, 0.95, "#bfe3f2"], [1.5, 1.0, "#fff3a0"]].forEach(([X, Y, c]) => { x.fillStyle = c; x.fillRect(X, Y, 0.45, 0.3); x.fillStyle = "#e03131"; x.beginPath(); x.arc(X + 0.22, Y + 0.03, 0.03, 0, 7); x.fill(); });
      x.strokeStyle = "#e03131"; x.lineWidth = 0.015; x.beginPath(); x.moveTo(0.62, 0.58); x.lineTo(1.32, 0.63); x.lineTo(2.02, 0.58); x.moveTo(0.92, 1.0); x.lineTo(1.7, 1.03); x.stroke(); }), 2.6, 1.3, -2, 2.1, BK + 0.04, 0, true);
  B(2.8, 1.5, 0.05, PL.nv, -2, 2.1, BK + 0.015).userData.flat = true;
  hang("DISPATCH", 1.8, 0.4, -8, 3.9, -3.2);

  // ==== GEAR: x +3..+12, z -15..-6 ====
  [4.4, 5.3, 6.2, 7.1, 8.0].forEach((x, i) => { B(0.86, 1.9, 0.5, 0x4a6fa5, x, 0.95, -14.5); B(0.02, 1.6, 0.01, 0x2f4f7f, x, 0.95, -14.24); [1.2, 1.4].forEach(y => B(0.5, 0.025, 0.01, 0x2f4f7f, x, y + 0.2, -14.24)); B(0.04, 0.2, 0.03, 0xdde3ea, x + 0.3, 1.0, -14.22); B(0.86, 0.14, 0.51, 0xf2c94c, x, 0.5, -14.5).scale.set(1, 0.4, 1); });
  sol(6.2, -14.5, 2.25, 0.27);
  helmet(4.4, 1.9, -14.5, 0xffffff); helmet(5.3, 1.9, -14.5, 0x4aa3e0); helmet(7.1, 1.9, -14.5, 0xf2c94c); C(0.1, 0.2, 0x1b4a8c, 8.0, 2.0, -14.5);
  // giá bên tường phải: kệ mũ + đèn pin, và thanh treo áo phản quang
  B(0.5, 0.05, 3.0, PL.wood, 11.6, 0.9, -11.5); B(0.5, 0.05, 3.0, PL.wood, 11.6, 1.5, -11.5); [-13, -10].forEach(z => B(0.05, 1.5, 0.45, PL.gr, 11.4, 0.75, z)); B(0.05, 1.5, 3.0, PL.wh, 11.9, 0.75, -11.5); sol(11.6, -11.5, 0.3, 1.55);
  helmet(11.6, 1.52, -12.6, 0xffffff); helmet(11.6, 0.92, -12.6, 0x1b4a8c); [-11.0, -10.6].forEach(z => { const f = C(0.035, 0.22, 0x2b3138, 11.6, 0.99, z, 8); f.rotation.x = Math.PI / 2; C(0.05, 0.05, 0xf2c94c, 11.6, 0.99, z - 0.13, 8).rotation.x = Math.PI / 2; });
  B(0.05, 0.05, 2.6, PL.gr, 11.8, 1.9, -7.6); sol(11.8, -7.6, 0.18, 1.35);
  [-8.6, -7.8, -7.0, -6.4].forEach((z, i) => { B(0.04, 0.8, 0.45, 0xff8a00, 11.77, 1.45, z); B(0.045, 0.8, 0.07, 0xf2f2f2, 11.76, 1.45, z - 0.1); B(0.045, 0.8, 0.07, 0xf2f2f2, 11.76, 1.45, z + 0.1); });   // áo phản quang
  // xe đạp tuần tra (dọc theo z) tại (4.0, -10.5)
  [-0.55, 0.55].forEach(dz => { const w = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.03, 6, 18), mat(0x212529)); w.rotation.y = Math.PI / 2; w.position.set(cx + 4.0, 0.36, cz - 10.5 + dz); g.add(w); });
  B(0.05, 0.05, 1.1, 0x1b4a8c, 4.0, 0.62, -10.5); B(0.05, 0.4, 0.05, 0x1b4a8c, 4.0, 0.5, -10.15); B(0.05, 0.5, 0.05, 0x1b4a8c, 4.0, 0.62, -10.82); B(0.2, 0.05, 0.3, PL.dk, 4.0, 0.92, -10.1); B(0.45, 0.04, 0.04, PL.dk, 4.0, 0.98, -10.95); B(0.07, 0.07, 0.07, 0xf2c94c, 4.0, 1.04, -10.98); B(0.04, 0.1, 0.3, 0xffffff, 4.0, 0.62, -10.5); sol(4.0, -10.5, 0.3, 0.9);
  // nón giao thông
  const cone = (x, z) => { lc(g, 0.03, 0.16, 0.55, mat(0xff6b00), cx + x, 0.3, cz + z, 12); B(0.4, 0.03, 0.4, 0xff6b00, x, 0.02, z); lc(g, 0.07, 0.1, 0.1, mat(0xffffff), cx + x, 0.32, cz + z, 12); sol(x, z, 0.22, 0.22); };
  cone(4.2, -7.0); cone(5.3, -6.5); cone(3.4, -8.2);
  hang("GEAR", 1.4, 0.4, 7, 3.9, -6.2);

  // ==== LOST & FOUND: kệ dọc tường trái x -12..-9, z 0..10 ====
  B(0.5, 0.05, 9.6, PL.wood, -11.6, 0.4, 5); B(0.5, 0.05, 9.6, PL.wood, -11.6, 0.95, 5); B(0.5, 0.05, 9.6, PL.wood, -11.6, 1.5, 5); B(0.55, 0.06, 9.7, PL.wood, -11.6, 1.8, 5);
  [0.2, 2.1, 4.0, 5.9, 7.8, 9.7].forEach(z => B(0.5, 1.8, 0.06, PL.wh, -11.6, 0.9, z)); B(0.04, 1.8, 9.6, 0xc8b79a, -11.9, 0.9, 5); sol(-11.6, 5, 0.3, 4.85);
  plate("LOST & FOUND", 3.0, 0.6, "#1b4a8c", "#ffffff", LW + 0.04, 3.1, 5, Math.PI / 2);
  // 1. ô dù (bay 1)
  C(0.012, 0.8, 0x2b3138, -11.6, 1.2, 1.15, 6).rotation.z = 0.35; { const c = lc(g, 0.02, 0.3, 0.35, mat(0xe03131), cx - 11.55, 1.3, cz + 1.15, 10); c.rotation.z = 0.35; } B(0.12, 0.04, 0.04, 0x2b3138, -11.55, 0.82, 1.15);
  // 2. ba lô (bay 2)
  B(0.34, 0.42, 0.22, 0x2f9e44, -11.6, 1.2, 3.05); B(0.28, 0.2, 0.06, 0x2b8a3e, -11.6, 1.12, 3.2); B(0.3, 0.05, 0.24, 0x1f6f31, -11.6, 1.43, 3.05); B(0.05, 0.3, 0.02, 0xf2c94c, -11.6, 1.1, 3.24);
  // 3. gấu bông (bay 3)
  { const bs = (r, c, x, y, z) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat(c)); m.position.set(cx + x, y, cz + z); g.add(m); return m; };
    bs(0.17, 0xb97a4a, -11.6, 1.7, 4.95).scale.set(1, 1.15, 0.9); bs(0.12, 0xb97a4a, -11.6, 1.95, 4.95); bs(0.045, 0xb97a4a, -11.7, 2.05, 4.95); bs(0.045, 0xb97a4a, -11.5, 2.05, 4.95); bs(0.05, 0xe8c9a0, -11.5 - 0.02, 1.93, 4.95 + 0.0).scale.set(0.8, 0.8, 0.8); bs(0.1, 0xb97a4a, -11.75, 1.62, 4.95); bs(0.1, 0xb97a4a, -11.45, 1.62, 4.95); }
  // 4. chìa khoá (bay 4): bảng móc
  B(0.04, 0.3, 0.9, 0x8d5a2b, -11.85, 1.65, 6.85); [-0.3, 0, 0.3].forEach(d => { B(0.04, 0.14, 0.04, 0xc9a227, -11.8, 1.6, 6.85 + d); B(0.04, 0.08, 0.1, 0xf2c94c, -11.8, 1.5, 6.85 + d); });
  // 5. ví (bay 5) + vài món phụ
  B(0.2, 0.04, 0.13, 0x6b3e1f, -11.6, 0.45 + 0.03, 8.75); B(0.2, 0.02, 0.13, 0x8d5a2b, -11.6, 0.5 + 0.03, 8.75);
  B(0.3, 0.2, 0.2, 0x4aa3e0, -11.6, 1.05 + 0.1, 8.7); B(0.14, 0.14, 0.14, 0xf2c94c, -11.6, 0.5 + 0.1, 1.3); C(0.09, 0.2, 0x7048e8, -11.6, 1.6, 8.6, 10);

  // ==== lối vào: ghế chờ, chậu cây, áp phích an toàn (không đặt gì ở x −1.5..+1.5, z +8..+15) ====
  B(0.5, 0.08, 2.4, PL.bl, 10.6, 0.46, 12.4); B(0.1, 0.5, 2.4, PL.bl, 10.88, 0.8, 12.4); [11.4, 13.4].forEach(z => B(0.4, 0.45, 0.06, PL.gr, 10.6, 0.22, z - 0.4 + (z > 12.4 ? 0.8 : 0))); sol(10.7, 12.4, 0.35, 1.25);
  [[-11, 14], [11, 14.2], [-11.2, 12.6]].forEach(([x, z]) => { pot(g, cx + x, cz + z, 1.4); sol(x, z, 0.4, 0.4); });
  plane(skin(1.4, 1.9, 50, (x, w, h) => { x.fillStyle = "#e7f5ff"; x.fillRect(0, 0, w, h); x.fillStyle = "#1b4a8c"; x.fillRect(0, 0, w, 0.35); signText(x, "LOOK BOTH WAYS", w / 2, 0.19, 1.2, 0.2, "#ffffff");
    x.fillStyle = "#343a40"; x.fillRect(0.4, 0.55, 0.6, 1.0); [["#e03131", 0.7], ["#f2c94c", 1.05], ["#2f9e44", 1.4]].forEach(([c, y]) => { x.fillStyle = c; x.beginPath(); x.arc(0.7, y - 0.15, 0.13, 0, 7); x.fill(); }); signText(x, "STOP  WAIT  GO", w / 2, 1.75, 1.2, 0.15, "#1b4a8c"); }), 1.4, 1.9, RW - 0.04, 1.8, 9.2, -Math.PI / 2);
  plane(skin(1.4, 1.9, 50, (x, w, h) => { x.fillStyle = "#fff3c4"; x.fillRect(0, 0, w, h); x.fillStyle = "#1b4a8c"; x.fillRect(0, 0, w, 0.35); signText(x, "WEAR A HELMET", w / 2, 0.19, 1.2, 0.2, "#ffffff");
    x.fillStyle = "#4aa3e0"; x.beginPath(); x.arc(w / 2, 1.1, 0.4, Math.PI, 0); x.fill(); x.fillRect(w / 2 - 0.4, 1.1, 0.8, 0.1); x.fillStyle = "#ffd43b"; x.beginPath(); x.arc(w / 2, 0.95, 0.1, 0, 7); x.fill(); signText(x, "BE SAFE ON YOUR BIKE", w / 2, 1.65, 1.2, 0.14, "#1b4a8c"); }), 1.4, 1.9, RW - 0.04, 1.8, 11.4, -Math.PI / 2);

  // ==== chỗ bày từ vựng: [x, y, z, đứngX, đứngZ] (toạ độ tuyệt đối) ====
  const A = (list) => list.map(([x, y, z, sx, sz]) => [cx + x, y, cz + z, cx + sx, cz + sz]);
  P.anchors = {
    desk: A([[-6.7, 1.5, 9.15, -6.7, 10.5], [-6.1, 1.4, 9.2, -6.1, 10.5], [-5.5, 1.25, 9.5, -5.5, 10.5], [-4.5, 1.3, 9.5, -4.5, 10.5], [-3.8, 1.3, 9.4, -3.8, 10.5], [-3.3, 1.4, 9.55, -3.3, 10.5], [-5, 3.6, 9.3, -5, 10.6]]),
    office: A([[10.3, 1.3, -2.6, 8.0, -2.6], [10.3, 1.3, 1.0, 8.0, 1.0], [10.3, 1.3, 4.6, 8.0, 4.6], [5.5, 1.3, -2.8, 5.5, -0.7], [3.4, 1.5, -0.4, 4.9, -0.4], [11.7, 1.5, 6.0, 10.4, 6.9]]),
    dispatch: A([[-10.2, 1.3, -13.9, -10.2, -11.5], [-8.0, 1.3, -13.9, -8.0, -11.5], [-6.9, 1.3, -13.9, -6.9, -11.5], [-8.5, 2.6, -14.9, -8.5, -11.5], [-4.6, 1.25, -10.3, -5.8, -10.3], [-4.6, 1.25, -9.4, -5.8, -9.4], [LW + 0.5, 2.45, -10, -10.6, -10], [LW + 0.5, 2.45, -8, -10.6, -8], [LW + 0.5, 2.45, -6, -10.6, -6], [-2, 2.1, -14.8, -2, -13.8]].map(([x, y, z, sx, sz]) => [x, y, z, sx, sz])),
    gear: A([[4.4, 2.2, -14.5, 4.4, -13.2], [5.3, 2.2, -14.5, 5.3, -13.2], [7.1, 2.2, -14.5, 7.1, -13.2], [11.6, 1.8, -12.6, 10.3, -12.6], [11.6, 1.3, -10.8, 10.3, -10.8], [11.77, 1.9, -7.8, 10.3, -7.8], [4.0, 1.2, -10.5, 5.4, -10.5], [4.2, 0.85, -7.0, 3.6, -5.8], [5.3, 0.85, -6.5, 5.3, -5.4]]),
    lostfound: A([[-11.6, 1.45, 1.15, -10.4, 1.15], [-11.6, 1.55, 3.05, -10.4, 3.05], [-11.6, 2.1, 4.95, -10.4, 4.95], [-11.7, 1.9, 6.85, -10.4, 6.85], [-11.6, 0.75, 8.75, -10.4, 8.75]])
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["policehall"] = {
  furnish: furnishPolice,
  wall: (len, h, w) => policeWall(len, h, w.x === 0 ? (w.z < 0 ? "back" : "front") : (w.x < 0 ? "left" : "right"))
};
