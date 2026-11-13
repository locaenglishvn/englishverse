/* EnglishVerse – ngoại thất "electronics" (Verse Electronics · Điện Máy Verse). Tách khỏi index.html (xem docs/TEAM.md).
   Siêu thị điện máy kiểu chuỗi Việt Nam (chỉ lấy PHONG CÁCH, thương hiệu tự đặt): mặt tiền xanh dương đậm + vàng, tường kính khổng lồ
   thấy tivi / tủ lạnh / máy giặt bên trong, biển "VERSE ELECTRONICS", băng-rôn khuyến mãi, mái hiên cửa vào, bãi xe máy phía trước, cột biển (pylon), cờ phướn.
   Hệ tọa độ: mặt tiền quay +z, rộng 22 m (trục x), sâu 16 m (trục z), cao 9 m. Ít chất liệu dùng chung để nhẹ máy (ảnh mặt tiền 1 + ảnh hông 1 + biển hiên 1 + cờ 1). */
EXTERIORS_EXTRA["electronics"] = function (g, P) {
  const W = 22, D = 16, H = 9, F = D / 2, BLUE = 0x1456b8, NAVY = 0x0c3a85, YEL = 0xffd43b, WHITE = 0xf8f9fa, GREY = 0xc9ced4;

  /* ---------- ảnh mặt tiền (22 × 9 m): biển, băng-rôn, tường kính nhìn thấy đồ điện máy bên trong ---------- */
  const rrect = (x, X, Y, w, h, r, fill) => { x.fillStyle = fill; x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); x.fill(); };
  const bolt = (x, cx, cy, s, fill) => { x.fillStyle = fill; x.beginPath(); x.moveTo(cx + 0.15 * s, cy - 0.9 * s); x.lineTo(cx - 0.55 * s, cy + 0.1 * s); x.lineTo(cx - 0.05 * s, cy + 0.1 * s); x.lineTo(cx - 0.25 * s, cy + 0.95 * s); x.lineTo(cx + 0.55 * s, cy - 0.15 * s); x.lineTo(cx + 0.05 * s, cy - 0.15 * s); x.closePath(); x.fill(); };
  const front = skin(W, H, 36, (x, Wd, Hh) => {
    let gr = x.createLinearGradient(0, 0, 0, Hh); gr.addColorStop(0, "#1a63cf"); gr.addColorStop(1, "#0f4aa6"); x.fillStyle = gr; x.fillRect(0, 0, Wd, Hh);
    x.fillStyle = "#ffd43b"; x.fillRect(0, 0, Wd, 0.35);   // viền vàng trên cùng
    x.fillStyle = "#0c3a85"; for (let X = 0.4; X < Wd; X += 1.1) x.fillRect(X, 0.5, 0.04, 2.9);   // gân tường
    // logo tia chớp + biển tên khổng lồ
    x.fillStyle = "#ffd43b"; x.beginPath(); x.arc(2.4, 1.95, 1.05, 0, 7); x.fill(); bolt(x, 2.4, 1.95, 0.85, "#0c3a85");
    rrect(x, 3.9, 0.7, 15.8, 2.5, 0.25, "#ffd43b"); rrect(x, 4.05, 0.85, 15.5, 2.2, 0.2, "#0c3a85");
    signText(x, "VERSE ELECTRONICS", 11.8, 1.72, 14.2, 1.25, "#ffd43b"); signText(x, "ĐIỆN MÁY VERSE · TIVI · TỦ LẠNH · MÁY GIẶT · MÁY LẠNH", 11.8, 2.62, 14.2, 0.36, "#ffffff", "600 ");
    x.fillStyle = "#ffd43b"; x.beginPath(); x.arc(21.0, 1.95, 0.9, 0, 7); x.fill(); signText(x, "24/7", 21.0, 1.95, 1.3, 0.55, "#0c3a85");
    // băng-rôn khuyến mãi
    rrect(x, 0.7, 3.65, 9.2, 1.45, 0.15, "#e03131"); x.fillStyle = "#ffd43b"; x.fillRect(0.7, 5.0, 9.2, 0.1); signText(x, "SALE UP TO 50%", 5.3, 4.25, 8.6, 0.8, "#ffffff"); signText(x, "GIẢM GIÁ ĐẾN 50% · TOÀN BỘ ĐIỆN MÁY", 5.3, 4.82, 8.4, 0.28, "#ffe066", "600 ");
    rrect(x, 12.1, 3.65, 9.2, 1.45, 0.15, "#ffd43b"); signText(x, "0% INSTALLMENT", 16.7, 4.2, 8.6, 0.78, "#0c3a85"); signText(x, "TRẢ GÓP 0% · MUA TRƯỚC TRẢ SAU", 16.7, 4.8, 8.4, 0.3, "#c92a2a", "700 ");
    rrect(x, 10.05, 3.9, 1.9, 1.0, 0.12, "#40c057"); signText(x, "FREE", 11, 4.22, 1.7, 0.4, "#ffffff"); signText(x, "SHIP", 11, 4.62, 1.7, 0.4, "#ffffff");
    // dải vàng dưới băng-rôn (chỗ gắn mái hiên)
    x.fillStyle = "#ffd43b"; x.fillRect(0, 5.35, Wd, 0.45); signText(x, "ĐIỆN MÁY  ·  GIA DỤNG  ·  CÔNG NGHỆ   —   VERSE ELECTRONICS   —   ĐIỆN MÁY  ·  GIA DỤNG  ·  CÔNG NGHỆ", Wd / 2, 5.58, Wd - 1, 0.28, "#0c3a85");
    // tường kính: cửa hàng sáng đèn, thấy đồ bên trong
    const gy = 5.8, gh = Hh - gy - 0.35;
    x.fillStyle = "#f4f9ff"; x.fillRect(0.3, gy, Wd - 0.6, gh);
    gr = x.createLinearGradient(0, gy, 0, gy + gh); gr.addColorStop(0, "#cfe3fb"); gr.addColorStop(0.45, "#f4f9ff"); gr.addColorStop(1, "#dfe7ef"); x.fillStyle = gr; x.fillRect(0.3, gy, Wd - 0.6, gh);
    x.fillStyle = "#ffffff"; for (let X = 1; X < Wd - 1; X += 2.6) x.fillRect(X, gy + 0.08, 1.6, 0.1);   // đèn trần
    const scr = ["#ff6b6b", "#4dabf7", "#ffd43b", "#51cf66", "#cc5de8", "#ff922b", "#22b8cf", "#f06595"];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const X = 0.8 + c * 1.45, Y = gy + 0.35 + r * 0.9; x.fillStyle = "#15191d"; x.fillRect(X, Y, 1.3, 0.76); x.fillStyle = scr[(r * 3 + c * 5) % 8]; x.fillRect(X + 0.05, Y + 0.05, 1.2, 0.66); x.fillStyle = "rgba(255,255,255,0.25)"; x.fillRect(X + 0.05, Y + 0.05, 1.2, 0.2); }   // tường tivi
    [[10.1, 1], [10.1, 2]].forEach(() => {});
    for (let i = 0; i < 4; i++) { const X = 13.4 + i * 0.95; rrect(x, X, gy + 0.65, 0.8, 2.15, 0.06, i % 2 ? "#dde3ea" : "#f1f3f5"); x.fillStyle = "#adb5bd"; x.fillRect(X + 0.08, gy + 1.5, 0.05, 0.5); x.fillRect(X, gy + 1.3, 0.8, 0.04); }   // tủ lạnh
    for (let i = 0; i < 3; i++) { const X = 17.6 + i * 1.1; rrect(x, X, gy + 1.7, 0.95, 1.1, 0.08, "#f8f9fa"); x.fillStyle = "#74c0fc"; x.beginPath(); x.arc(X + 0.475, gy + 2.3, 0.33, 0, 7); x.fill(); x.fillStyle = "#495057"; x.beginPath(); x.arc(X + 0.475, gy + 2.3, 0.2, 0, 7); x.fill(); }   // máy giặt
    for (let i = 0; i < 3; i++) { rrect(x, 17.6 + i * 1.3, gy + 0.55, 1.15, 0.38, 0.1, "#ffffff"); x.fillStyle = "#4dabf7"; x.fillRect(17.7 + i * 1.3, gy + 0.78, 0.95, 0.05); }   // máy lạnh
    x.fillStyle = "#ffd43b"; x.fillRect(0.3, gy + gh - 0.12, Wd - 0.6, 0.12);
    // khung kính (nẹp xanh) và cửa ra vào ở giữa
    x.fillStyle = "#0c3a85"; for (let X = 0.3; X <= Wd - 0.29; X += 1.9) { if (X > 8.9 && X < 13.1) continue; x.fillRect(X - 0.06, gy, 0.12, gh); }
    x.fillStyle = "#0c3a85"; x.fillRect(0.3, gy - 0.06, Wd - 0.6, 0.12);
    x.fillStyle = "rgba(180,215,245,0.55)"; x.fillRect(9.1, gy, 3.8, gh); x.fillStyle = "#0c3a85"; x.fillRect(9.0, gy, 0.12, gh); x.fillRect(10.95, gy, 0.1, gh); x.fillRect(12.88, gy, 0.12, gh); x.fillRect(9.0, gy, 4, 0.14);
    x.fillStyle = "#ffd43b"; x.fillRect(10.7, gy + gh * 0.45, 0.07, 0.8); x.fillRect(11.23, gy + gh * 0.45, 0.07, 0.8);   // tay nắm cửa
    signText(x, "OPEN · MỞ CỬA", 11, gy + 0.35, 3.4, 0.3, "#0c3a85");
    x.fillStyle = "rgba(255,255,255,0.22)"; for (let X = -2; X < Wd; X += 3.2) { x.beginPath(); x.moveTo(X, gy + gh); x.lineTo(X + 0.9, gy); x.lineTo(X + 1.5, gy); x.lineTo(X + 0.6, gy + gh); x.fill(); }   // vệt phản chiếu kính
    x.fillStyle = "#0c3a85"; x.fillRect(0, Hh - 0.35, Wd, 0.35);   // chân tường
  });
  const side = skin(D, H, 24, (x, Wd, Hh) => {
    x.fillStyle = "#1456b8"; x.fillRect(0, 0, Wd, Hh); x.fillStyle = "#ffd43b"; x.fillRect(0, 0, Wd, 0.3); x.fillRect(0, 5.1, Wd, 0.4); x.fillStyle = "#0c3a85"; x.fillRect(0, Hh - 0.5, Wd, 0.5);
    x.fillStyle = "#0f4aa6"; for (let X = 0.5; X < Wd; X += 1.1) x.fillRect(X, 0.4, 0.05, Hh - 0.9);
    rrect(x, 3, 1.2, 10, 2.6, 0.25, "#ffd43b"); signText(x, "VERSE", 8, 2.2, 8.5, 1.3, "#0c3a85"); signText(x, "ĐIỆN MÁY · ELECTRONICS", 8, 3.3, 9, 0.38, "#1456b8");
    bolt(x, 1.7, 2.5, 0.9, "#ffd43b");
    x.fillStyle = "#e9ecef"; for (let X = 1; X < Wd - 1.5; X += 3.5) { x.fillRect(X, 6.2, 2.4, 1.2); x.fillStyle = "#adb5bd"; x.fillRect(X + 0.1, 6.3, 2.2, 0.1); x.fillStyle = "#e9ecef"; }
  });
  const flag = skin(0.9, 2.2, 60, (x, Wd, Hh) => { x.fillStyle = "#ffd43b"; x.fillRect(0, 0, Wd, Hh); x.fillStyle = "#0c3a85"; x.fillRect(0, Hh - 0.35, Wd, 0.35); bolt(x, Wd / 2, 0.55, 0.38, "#0c3a85");
    x.save(); x.translate(Wd / 2, 1.35); x.rotate(-Math.PI / 2); signText(x, "SALE", 0, 0, 1.6, 0.6, "#c92a2a"); x.restore(); });

  /* ---------- khối chính ---------- */
  lb(g, W, H, D, BLUE, 0, H / 2, 0);
  face(g, front, W, H, 0, H / 2, F + 0.02);
  face(g, side, D, H, W / 2 + 0.02, H / 2, 0, Math.PI / 2); face(g, side, D, H, -W / 2 - 0.02, H / 2, 0, -Math.PI / 2);
  lb(g, W + 0.5, 0.45, D + 0.5, YEL, 0, H + 0.2, 0);   // gờ mái vàng
  lb(g, W + 0.2, 0.7, 0.5, NAVY, 0, H + 0.7, F - 0.1);   // lan can mặt tiền
  [[-6, -3], [4, -4], [7, 2]].forEach(([x, z]) => { lb(g, 2.4, 1.1, 1.8, GREY, x, H + 1.0, z); lc(g, 0.6, 0.6, 0.1, 0x495057, x - 0.5, H + 1.6, z, 14); lc(g, 0.6, 0.6, 0.1, 0x495057, x + 0.5, H + 1.6, z, 14); });   // dàn nóng điều hòa trên mái
  // tia chớp khổng lồ trên mái (biểu tượng thương hiệu)
  { const s = new THREE.Shape(); s.moveTo(0.55, 2.0); s.lineTo(-0.9, 0.0); s.lineTo(-0.05, 0.0); s.lineTo(-0.55, -2.0); s.lineTo(0.95, 0.35); s.lineTo(0.1, 0.35); s.closePath();
    const bo = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: false }), mat(YEL)); bo.position.set(-8.5, H + 3.1, F - 0.6); bo.scale.setScalar(1.15); g.add(bo);
    lb(g, 0.15, 1.9, 0.15, 0x868e96, -9.2, H + 1.4, F - 0.5); lb(g, 0.15, 1.9, 0.15, 0x868e96, -7.8, H + 1.4, F - 0.5); }

  /* ---------- mái hiên cửa vào (vàng) + biển WELCOME ---------- */
  lb(g, 8.4, 0.32, 3.4, YEL, 0, 3.55, F + 1.5); lb(g, 8.4, 0.75, 0.22, BLUE, 0, 3.55, F + 3.2);
  const wl = textPlate("WELCOME · XIN CHÀO", 6.4, 0.55, "#1456b8", "#ffd43b"); wl.position.set(0, 3.55, F + 3.32); g.add(wl);
  [-3.9, 3.9].forEach(x => { lc(g, 0.17, 0.17, 3.4, 0xf1f3f5, x, 1.7, F + 2.9, 10); lc(g, 0.22, 0.22, 0.25, YEL, x, 0.12, F + 2.9, 10); });
  lb(g, 3.6, 0.04, 2.0, 0x1456b8, 0, 0.03, F + 1.1);   // thảm xanh trước cửa
  lb(g, 22.6, 0.05, 4.6, 0xd3d8de, 0, 0.025, F + 2.3);   // sân bê tông trước cửa hàng
  lb(g, 22.6, 0.1, 0.12, YEL, 0, 0.06, F + 4.55);   // vạch vàng mép sân

  /* ---------- bãi xe máy phía trước: vạch ô đậu + 7 chiếc xe tay ga đơn giản ---------- */
  const scooter = (x, z, body, box) => {
    const s = new THREE.Group(); s.position.set(x, 0, z); g.add(s);
    [-0.55, 0.6].forEach(zz => lc(s, 0.22, 0.22, 0.12, 0x212529, 0, 0.22, zz, 12).rotation.z = Math.PI / 2);   // 2 bánh
    lb(s, 0.36, 0.3, 1.0, body, 0, 0.48, -0.15); lb(s, 0.3, 0.1, 0.55, 0x212529, 0, 0.74, -0.35);   // thân + yên
    const sh = lb(s, 0.34, 0.6, 0.1, body, 0, 0.72, 0.42); sh.rotation.x = -0.25;   // yếm trước
    lb(s, 0.62, 0.06, 0.07, 0x343a40, 0, 1.08, 0.4); lb(s, 0.06, 0.6, 0.06, 0x495057, 0, 0.62, 0.55);   // tay lái + phuộc
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), mat(0xfff3bf)); hl.position.set(0, 0.95, 0.5); s.add(hl);
    if (box) lb(s, 0.42, 0.36, 0.42, box, 0, 1.02, -0.62);   // thùng sau
    return s;
  };
  [-4.8, -6.4, -8.0, -9.6].forEach((x, i) => { scooter(x, F + 2.9, [0xe03131, 0x1c7ed6, 0xf8f9fa, 0x212529][i], i === 2 ? 0xffd43b : 0); });
  [5.2, 6.9, 8.6].forEach((x, i) => { scooter(x, F + 2.9, [0xffd43b, 0x2f9e44, 0xe03131][i], i === 0 ? 0x1c7ed6 : 0); });
  for (let x = -10.4; x <= -4.0; x += 1.6) lb(g, 0.07, 0.01, 2.3, 0xffffff, x, 0.056, F + 2.9);
  for (let x = 4.4; x <= 9.5; x += 1.7) lb(g, 0.07, 0.01, 2.3, 0xffffff, x, 0.056, F + 2.9);
  lb(g, 6.4, 0.06, 0.06, 0x868e96, -7.2, 0.5, F + 4.1);   // thanh chắn bánh xe
  const pk = textPlate("PARKING · GỬI XE", 2.4, 0.5, "#1456b8", "#ffffff"); pk.position.set(-7.2, 1.9, F + 4.3); g.add(pk); lc(g, 0.05, 0.05, 1.9, 0x868e96, -8.9, 0.95, F + 4.28, 6); lc(g, 0.05, 0.05, 1.9, 0x868e96, -5.5, 0.95, F + 4.28, 6);

  /* ---------- cột biển (pylon) + cờ phướn + cây ---------- */
  lb(g, 1.5, 6.6, 1.1, BLUE, -12.9, 3.3, F + 1.2); lb(g, 1.7, 0.4, 1.3, YEL, -12.9, 6.8, F + 1.2);
  const pyl = skin(1.3, 4.2, 70, (x, Wd, Hh) => { x.fillStyle = "#1456b8"; x.fillRect(0, 0, Wd, Hh); bolt(x, Wd / 2, 0.9, 0.55, "#ffd43b"); x.save(); x.translate(Wd / 2, 2.8); x.rotate(-Math.PI / 2); signText(x, "VERSE ELECTRONICS", 0, 0, 2.2, 0.55, "#ffffff"); x.restore(); });
  face(g, pyl, 1.3, 4.2, -12.9, 4.3, F + 1.78); face(g, pyl, 1.3, 4.2, -12.9, 4.3, F + 0.62, Math.PI);
  [[-11.6, F + 4.0], [11.6, F + 4.0]].forEach(([x, z]) => { lc(g, 0.04, 0.04, 4.2, 0x868e96, x, 2.1, z, 6); const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 2.2), new THREE.MeshLambertMaterial({ map: flag, transparent: true, side: THREE.DoubleSide })); fl.position.set(x + 0.48, 3.0, z); fl.userData.flat = true; g.add(fl); });
  [-5.5, 5.5].forEach(x => pot(g, x, F + 1.0, 1.4)); [-2.9, 2.9].forEach(x => pot(g, x, F + 0.7, 1.1));
  bigTree(g, 11.8, F + 2.2, 0.55); bigTree(g, -11.8, F + 4.9, 0.5);

  return {
    solids: [[0, 0, W / 2, D / 2], [-3.9, F + 2.9, 0.25, 0.25], [3.9, F + 2.9, 0.25, 0.25], [-12.9, F + 1.2, 0.85, 0.65],
      [-4.8, F + 2.9, 0.3, 0.9], [-6.4, F + 2.9, 0.3, 0.9], [-8.0, F + 2.9, 0.3, 0.9], [-9.6, F + 2.9, 0.3, 0.9], [5.2, F + 2.9, 0.3, 0.9], [6.9, F + 2.9, 0.3, 0.9], [8.6, F + 2.9, 0.3, 0.9],
      [-5.5, F + 1.0, 0.45, 0.45], [5.5, F + 1.0, 0.45, 0.45], [-2.9, F + 0.7, 0.4, 0.4], [2.9, F + 0.7, 0.4, 0.4], [11.8, F + 2.2, 0.3, 0.3], [-11.8, F + 4.9, 0.3, 0.3]],
    door: [0, F + 1.9], map: [[0, 0, W, D]]
  };
};
