/* EnglishVerse – nội thất STAR CINEMA (layout: "starium"), phòng 40 × 56 m, cao 14 m. Phong cách multiplex hiện đại + phòng chiếu màn hình khổng lồ "STARIUM"
   (thương hiệu tự đặt, không logo thật). Các khu (P.zones – camera ở trong khu đang đứng):
   🍿 LOBBY (z −3 → 28): quầy bắp nước (trái) + quầy vé (phải) hai bên lối vào hành lang, máy bán vé tự động, màn hình NOW SHOWING,
        poster, ghế chờ, góc game (máy gắp thú, máy arcade), nhà vệ sinh
   🚪 CORRIDOR (z −9 → −3): hành lang tối có đèn sàn + poster dẫn vào phòng chiếu
   🎬 HALL (z −28 → −9): màn hình cong khổng lồ 26 × 10 m, 270 ghế đỏ xếp bậc thang (InstancedMesh), đèn bậc thang, loa, cửa thoát hiểm, cửa sổ phòng máy chiếu
   Dùng cinemaPoster() từ parts/exteriors/cinema.js (poster phim thiếu nhi tự đặt). */
function furnishStarium(P, g, cx, cz, W, D, fur) {
  const S = P.room.solids, up = new THREE.Vector3(0, 1, 0);
  const sol = (x, z, hw, hd) => S.push({ x: cx + x, z: cz + z, hw, hd });
  const B = (w, h, d, c, x, y, z) => lb(g, w, h, d, c, cx + x, y, cz + z);
  const C = (rt, rb, h, c, x, y, z, seg) => lc(g, rt, rb, h, c, cx + x, y, cz + z, seg);
  const LEDM = {}, led = c => LEDM[c] || (LEDM[c] = new THREE.MeshBasicMaterial({ color: c }));   // vật tự phát sáng (dùng chung theo màu)
  const BL = (w, h, d, c, x, y, z) => B(w, h, d, led(c), x, y, z);
  const glassM = mat(0xcfe9ff, { transparent: true, opacity: 0.3 });
  const grp = (x, z, ry, y) => { const q = new THREE.Group(); q.position.set(cx + x, y || 0, cz + z); q.rotation.y = ry || 0; g.add(q); return q; };
  const TM = new Map(), matOf = (t, basic) => { const k = (basic ? "b" : "l") + t.uuid; if (!TM.has(k)) TM.set(k, basic ? new THREE.MeshBasicMaterial({ map: t }) : new THREE.MeshLambertMaterial({ map: t })); return TM.get(k); };
  const plane = (t, w, h, x, y, z, ry, basic, parent) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), matOf(t, basic)); m.position.set(parent ? x : cx + x, y, parent ? z : cz + z); m.rotation.y = ry || 0; m.userData.flat = true; (parent || g).add(m); return m; };
  const atlas = (t, cols, rows, i, w, h, x, y, z, ry, parent) => {   // 1 tấm trong ảnh ghép (nhiều biển chữ dùng chung 1 ảnh = 1 lần vẽ)
    const gm = new THREE.PlaneGeometry(w, h), uv = gm.attributes.uv, c = i % cols, r = Math.floor(i / cols);
    for (let k = 0; k < uv.count; k++) { uv.setX(k, (uv.getX(k) + c) / cols); uv.setY(k, (uv.getY(k) + rows - 1 - r) / rows); }
    const m = new THREE.Mesh(gm, matOf(t, true)); m.position.set(parent ? x : cx + x, y, parent ? z : cz + z); m.rotation.y = ry || 0; m.userData.flat = true; (parent || g).add(m); return m; };
  const star5 = (x, X, Y, R, r) => { x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r : R; x.lineTo(X + q * Math.cos(a), Y + q * Math.sin(a)); } x.closePath(); x.fill(); };
  const WALL_L = 0x4a2a63, WALL_H = 0x1d2250, GOLD = 0xe0b43a, TRIM = 0x15101f;
  /* ---------- ẢNH DÁN (canvas) ---------- */
  const floorTex = skin(40, 56, 14, (x) => {   // 1 ảnh cho cả sàn: x = X − 20, z = Y − 28
    x.fillStyle = "#1d1330"; x.fillRect(0, 0, 40, 56);
    x.fillStyle = "#6e1226"; x.fillRect(0, 0, 40, 19);   // phòng chiếu: thảm đỏ sẫm
    for (let i = 0; i < 320; i++) { x.fillStyle = i % 2 ? "#8a1c36" : "#4f0b1c"; x.fillRect((i * 7.31) % 40, (i * 3.77) % 19, 0.22, 0.22); }
    x.fillStyle = "#4a0a18"; [[17.9, 4.2], [2, 4.4], [34.2, 3.8]].forEach(([a, w]) => x.fillRect(a, 0, w, 19));   // lối đi giữa + 2 lối bên
    x.fillStyle = "#5a1226"; x.fillRect(0, 19, 40, 6);
    for (let a = 0; a < 40; a += 2) for (let b = 25; b < 56; b += 2) { x.fillStyle = ((a + b) / 2) % 2 ? "#33204f" : "#2a1a42"; x.fillRect(a, b, 2, 2); }   // sảnh: gạch caro tím
    x.fillStyle = "#111118"; x.fillRect(2, 25, 14, 7); x.fillRect(24, 25, 14, 7);   // sàn sau quầy
    for (let a = 2; a < 16; a += 1) for (let b = 25; b < 32; b += 1) if ((a + b) % 2) { x.fillStyle = "#23232d"; x.fillRect(a, b, 1, 1); x.fillRect(a + 22, b, 1, 1); }
    x.fillStyle = "#0e1a4a"; x.fillRect(30, 41, 10, 15);   // góc game: thảm xanh đêm + đốm neon
    for (let i = 0; i < 90; i++) { x.fillStyle = ["#ff4fa3", "#4dd0e1", "#ffd43b", "#9b5de5"][i % 4]; x.fillRect(30 + (i * 2.37) % 9.6, 41 + (i * 1.71) % 14.6, 0.16, 0.16); }
    x.fillStyle = "#7d1426"; x.fillRect(18.2, 19, 3.6, 37); x.fillStyle = "#c9a227"; x.fillRect(18.1, 19, 0.12, 37); x.fillRect(21.78, 19, 0.12, 37);   // thảm đỏ từ cửa tới hành lang
    x.strokeStyle = "#8a6aa8"; x.lineWidth = 0.1; [5.3, 4.7].forEach((r, i) => { x.strokeStyle = i ? "#c9a227" : "#4a3068"; x.beginPath(); x.arc(20, 42, r, 0, 7); x.stroke(); });   // hoa văn giữa sảnh
    x.fillStyle = "#b02a3c"; star5(x, 20, 42, 4.2, 1.7); x.fillStyle = "#ffd43b"; star5(x, 20, 42, 1.9, 0.8);
  });
  const LAB = skin(8, 8, 128, (x) => {   // biển chữ (8 hàng, tỷ lệ 8:1)
    [["TICKETS", "#1d1b3a", "#ffd43b"], ["CONCESSION · SNACKS & DRINKS", "#7a1020", "#fff3bf"], ["STARIUM · GIANT SCREEN HALL  ▶", "#10102a", "#7be0ff"], ["RESTROOMS", "#15375a", "#ffffff"],
      ["ARCADE", "#1a0b3a", "#ff6bd5"], ["NOW SHOWING", "#1d1b3a", "#ffd43b"], ["WELCOME TO STAR CINEMA", "#7a1020", "#ffe066"], ["★ MOVIE MAGIC ★", "#10102a", "#ffd43b"]].forEach(([t, bg, fg], i) => {
      x.fillStyle = bg; x.fillRect(0, i, 8, 1); x.strokeStyle = fg; x.lineWidth = 0.03; x.strokeRect(0.05, i + 0.06, 7.9, 0.88); signText(x, t, 4, i + 0.52, 7.4, 0.62, fg); });
  });
  const CELL = skin(8, 4, 64, (x) => {   // ô nhỏ 2:1 (4 cột × 4 hàng): EXIT, MEN, WOMEN, HALL 1, hàng ghế A–I
    const cell = (i, t, bg, fg) => { const a = (i % 4) * 2, b = Math.floor(i / 4); x.fillStyle = bg; x.fillRect(a, b, 2, 1); x.strokeStyle = fg; x.lineWidth = 0.05; x.strokeRect(a + 0.06, b + 0.06, 1.88, 0.88); signText(x, t, a + 1, b + 0.54, 1.7, 0.6, fg); };
    cell(0, "EXIT →", "#0a7a35", "#ffffff"); cell(1, "MEN", "#1c5da8", "#ffffff"); cell(2, "WOMEN", "#b83b7a", "#ffffff"); cell(3, "HALL 1", "#10102a", "#ffd43b");
    "ABCDEFGHI".split("").forEach((c, i) => cell(4 + i, c, "#1a1a22", "#ffe9a8"));
  });
  const nsTex = (kinds, title) => skin(4.2, 2.5, 70, (x, w, h) => {
    x.fillStyle = "#0b0b1c"; x.fillRect(0, 0, w, h); x.fillStyle = "#c92a2a"; x.fillRect(0, 0, w, 0.45); signText(x, title, w / 2, 0.24, 3.8, 0.34, "#ffe066");
    kinds.forEach((k, i) => { const X = 0.2 + i * 1.35; x.drawImage(cinemaPoster(k).image, X, 0.6, 1.2, 1.6); x.fillStyle = "#ffe066"; signText(x, ["7:00", "5:30", "6:15"][i], X + 0.6, 2.35, 1.1, 0.2, "#ffe066"); }); });
  const showTex = skin(11, 2.6, 50, (x, w, h) => {
    x.fillStyle = "#0b0b1c"; x.fillRect(0, 0, w, h); x.fillStyle = "#1c7ed6"; x.fillRect(0, 0, w, 0.5); signText(x, "SHOWTIMES · LỊCH CHIẾU", w / 2, 0.27, 6, 0.36, "#ffffff");
    [["SPACE PUPPIES", "10:00  1:30  4:00  7:00"], ["LITTLE DRAGON", "9:30  12:00  3:15  6:30"], ["ROBOT & ROSE", "11:00  2:00  5:00  8:00"], ["OCEAN FRIENDS", "10:30  1:00  3:45  6:15"], ["SUPER MANGO", "9:00  12:30  4:30  7:30"]].forEach(([t, s], i) => {
      x.fillStyle = i % 2 ? "#14142b" : "#1b1b3a"; x.fillRect(0.2, 0.6 + i * 0.38, w - 0.4, 0.36); x.textAlign = "left"; signText(x, t, 2.4, 0.79 + i * 0.38, 3.6, 0.26, "#ffd43b"); signText(x, s, 7.6, 0.79 + i * 0.38, 5.4, 0.26, "#ffffff"); }); });
  const comboTex = skin(12, 2.4, 50, (x, w, h) => {
    x.fillStyle = "#16101c"; x.fillRect(0, 0, w, h); x.fillStyle = "#d62828"; x.fillRect(0, 0, w, 0.5); signText(x, "COMBO MENU", w / 2, 0.27, 5, 0.38, "#fff3bf");
    [["COMBO A", "Small popcorn + water", "$5", "#ffd43b"], ["COMBO B", "Big popcorn + 2 drinks", "$9", "#ff922b"], ["COMBO C", "Nachos + soda", "$7", "#69db7c"]].forEach(([a, b, c, col], i) => {
      const X = 0.25 + i * 3.9; x.fillStyle = "#241a30"; x.fillRect(X, 0.7, 3.6, 1.5); x.fillStyle = col; signText(x, a, X + 1.8, 0.98, 3.2, 0.42, col); signText(x, b, X + 1.8, 1.45, 3.4, 0.26, "#ffffff"); signText(x, c, X + 1.8, 1.9, 3, 0.4, "#ffe9a8"); }); });
  const uiTex = skin(1, 0.75, 100, (x, w, h) => {
    x.fillStyle = "#0b1030"; x.fillRect(0, 0, w, h); x.fillStyle = "#1c7ed6"; x.fillRect(0, 0, w, 0.14); signText(x, "BUY TICKETS", w / 2, 0.08, 0.9, 0.1, "#fff");
    ["space", "dragon", "robot"].forEach((k, i) => x.drawImage(cinemaPoster(k).image, 0.08 + i * 0.3, 0.2, 0.26, 0.35)); x.fillStyle = "#2f9e44"; x.fillRect(0.2, 0.6, 0.6, 0.12); signText(x, "TOUCH TO START", w / 2, 0.66, 0.56, 0.08, "#fff"); });
  const screenTex = skin(26, 10, 50, (x, w, h) => {   // hình trên màn hình khổng lồ: bầu trời bình minh, cầu vồng, đồi, bóng bay
    const q = x.createLinearGradient(0, 0, 0, h); q.addColorStop(0, "#2b2a8f"); q.addColorStop(0.5, "#ff6fb1"); q.addColorStop(1, "#ffd27a"); x.fillStyle = q; x.fillRect(0, 0, w, h);
    x.fillStyle = "#fff"; for (let i = 0; i < 70; i++) { x.globalAlpha = 0.5 + (i % 3) * 0.2; x.fillRect((i * 1.97) % w, (i * 0.83) % 4, 0.07, 0.07); } x.globalAlpha = 1;
    x.fillStyle = "#fff3b0"; x.beginPath(); x.arc(w / 2, 6.6, 2.4, 0, 7); x.fill();
    ["#e03131", "#ff922b", "#ffd43b", "#40c057", "#4dabf7", "#845ef7"].forEach((c, i) => { x.strokeStyle = c; x.lineWidth = 0.45; x.beginPath(); x.arc(w / 2, 9.2, 9.5 - i * 0.45, Math.PI, 0); x.stroke(); });
    x.fillStyle = "#2f9e44"; x.beginPath(); x.moveTo(0, h); x.quadraticCurveTo(5, 6.5, 11, 8.2); x.quadraticCurveTo(w / 2, 9, 15, 8.2); x.quadraticCurveTo(21, 6.5, w, h); x.fill();
    x.fillStyle = "#37b24d"; x.beginPath(); x.moveTo(0, h); x.quadraticCurveTo(9, 8, 16, h); x.fill(); x.beginPath(); x.moveTo(w, h); x.quadraticCurveTo(18, 8.4, 10, h); x.fill();
    [[3.5, 3.2, "#ff6b6b"], [6, 2.2, "#ffd43b"], [20, 2.6, "#4dabf7"], [22.7, 3.8, "#69db7c"], [9, 4, "#da77f2"]].forEach(([a, b, c]) => { x.fillStyle = c; x.beginPath(); x.ellipse(a, b, 0.7, 0.9, 0, 0, 7); x.fill(); x.strokeStyle = "#fff"; x.lineWidth = 0.04; x.beginPath(); x.moveTo(a, b + 0.9); x.lineTo(a, b + 2.6); x.stroke(); });
    x.fillStyle = "#fff"; [[5, 1.4], [20.5, 1.2]].forEach(([a, b]) => { [0, 0.9, 1.7].forEach((d, i) => { x.beginPath(); x.arc(a + d, b + (i === 1 ? -0.3 : 0), 0.55 + (i === 1 ? 0.15 : 0), 0, 7); x.fill(); }); });
    x.shadowColor = "#7a1fa2"; x.shadowBlur = 0.3; signText(x, "STAR CINEMA", w / 2, 3.4, 15, 2.2, "#ffffff", "900 "); x.shadowBlur = 0; signText(x, "WELCOME TO THE GIANT SCREEN", w / 2, 5, 14, 0.7, "#fff3bf");
    x.fillStyle = "#ffd43b"; [[2, 8.5, 0.6], [24, 8.6, 0.6], [12.5, 1, 0.5], [13.5, 1, 0.5]].forEach(([a, b, r]) => star5(x, a, b, r, r * 0.45));
  });
  /* ---------- KHUNG NHÀ: tường, trần, sàn ---------- */
  g.children[0].material = new THREE.MeshLambertMaterial({ map: floorTex });
  const wall = (w, h, d, c, x, z) => B(w, h, d, c, x, h / 2, z);
  wall(0.4, 14, 37.2, WALL_L, -20.2, 9.4); wall(0.4, 14, 37.2, WALL_L, 20.2, 9.4); wall(0.4, 14, 19.2, WALL_H, -20.2, -18.4); wall(0.4, 14, 19.2, WALL_H, 20.2, -18.4);   // tường bên (sảnh / phòng chiếu)
  wall(40.8, 14, 0.4, WALL_H, 0, -28.2);   // tường sau (sau màn hình)
  wall(18.4, 14, 0.4, WALL_L, -10.9, 28.2); wall(18.4, 14, 0.4, WALL_L, 10.9, 28.2); B(3.6, 10.2, 0.4, WALL_L, 0, 8.9, 28.2);   // tường trước + khung cửa
  [-1, 1].forEach(s => { B(0.3, 3.8, 0.5, GOLD, s * 1.85, 1.9, 28.0); }); B(4, 0.3, 0.5, GOLD, 0, 3.95, 28.0);
  atlas(LAB, 1, 8, 6, 3.6, 0.45, 0, 4.6, 27.78, Math.PI);
  [[-20, -4], [4, 20]].forEach(([a, b]) => { const w = b - a, c = (a + b) / 2; wall(w, 14, 0.4, WALL_L, c, -3); wall(w, 14, 0.4, WALL_H, c, -9); sol(c, -3, w / 2, 0.25); sol(c, -9, w / 2, 0.25); });   // vách sảnh | hành lang | phòng chiếu
  B(8, 9.4, 0.4, WALL_L, 0, 9.3, -3); B(8, 9.4, 0.4, WALL_H, 0, 9.3, -9);   // phần trên lối vào
  [-1, 1].forEach(s => { B(0.4, 4.8, 6.4, 0x2d1535, s * 4.2, 2.4, -6); sol(s * 4.2, -6, 0.25, 3.2); });   // tường hành lang
  const ceil = (w, d, c, x, y, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat(c)); m.rotation.x = Math.PI / 2; m.position.set(cx + x, y, cz + z); m.userData.flat = true; g.add(m); return m; };
  ceil(40, 31, 0x2a1a38, 0, 7.5, 12.5); ceil(8, 6, 0x120d1c, 0, 4.8, -6); ceil(40, 19, 0x10132e, 0, 12.5, -18.5);
  // cửa sổ lớn nhìn ra phố (tường trước) + đèn trần
  [[-18.5, -12.5], [-10.5, -4.5], [4.5, 10.5], [12.5, 18.5]].forEach(([a, b]) => { BL(b - a, 3.6, 0.06, 0xa5d8ff, (a + b) / 2, 3.6, 27.92); B(b - a + 0.3, 0.2, 0.2, TRIM, (a + b) / 2, 5.5, 27.9); B(b - a + 0.3, 0.2, 0.2, TRIM, (a + b) / 2, 1.7, 27.9); for (let X = a; X <= b + 0.01; X += (b - a) / 3) B(0.12, 3.8, 0.12, TRIM, X, 3.6, 27.9); });
  [-10, 0, 10].forEach(x => { BL(0.5, 0.06, 28, x < 0 ? 0x7be0ff : x > 0 ? 0xff6bd5 : 0xffe9a8, x, 7.44, 12.5); });
  for (let x = -16; x <= 16; x += 8) for (let z = 4; z <= 26; z += 7) { C(0.5, 0.5, 0.05, led(0xfff1c2), x, 7.46, z, 14); }
  B(40, 0.2, 0.3, TRIM, 0, 6.2, 27.85); [-1, 1].forEach(s => BL(0.1, 0.12, 31, s > 0 ? 0xff4fa3 : 0x4dd0e1, s * 19.78, 6.9, 12.5));
  atlas(LAB, 1, 8, 7, 7.2, 0.9, 0, 7.0, -2.76, 0);   // (dải chữ trên lối vào hành lang – lớp trên)
  /* ---------- LOBBY: QUẦY BẮP NƯỚC (trái, sát tường sau) ---------- */
  B(12.4, 1.1, 1.2, 0x8a1424, -11.8, 0.55, 1.4); B(12.6, 0.1, 1.4, 0x1b1b24, -11.8, 1.15, 1.4); BL(12.2, 0.07, 0.07, 0xffc233, -11.8, 0.95, 2.03); B(12.6, 0.08, 1.5, 0x241a30, -11.8, 0.04, 1.4);
  sol(-11.8, 1.4, 6.3, 0.7);
  B(12.4, 1.0, 0.9, 0x2b2230, -11.8, 0.5, -2.4); B(12.5, 0.08, 1.0, 0x1b1b24, -11.8, 1.04, -2.4); sol(-11.8, -2.4, 6.3, 0.55);
  [-16.6, -14.4].forEach(x => {   // 2 máy bắp rang
    B(1.3, 0.9, 0.9, 0xd62828, x, 1.5, -2.4); B(1.2, 1.0, 0.8, glassM, x, 2.45, -2.4); B(1.35, 0.15, 0.95, 0xffc233, x, 3.05, -2.4); BL(1.0, 0.06, 0.06, 0xfff1c2, x, 3.15, -1.95);
    for (let i = 0; i < 9; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(0.11, 5, 4), mat(i % 3 ? 0xfff1b8 : 0xffe28a)); p.position.set(cx + x - 0.4 + (i % 3) * 0.4, 2.0 + Math.floor(i / 3) * 0.28 + (i % 2) * 0.1, cz - 2.4 + ((i * 7) % 3 - 1) * 0.12); g.add(p); } });
  { B(1.4, 0.5, 0.7, 0x343a40, -8.8, 1.35, -2.4); [0, 1, 2, 3].forEach(i => { C(0.04, 0.04, 0.25, [0xe03131, 0x40c057, 0xfab005, 0x4dabf7][i], -9.3 + i * 0.33, 1.4, -2.05, 6); BL(0.2, 0.08, 0.04, [0xe03131, 0x40c057, 0xfab005, 0x4dabf7][i], -9.3 + i * 0.33, 1.72, -2.07); }); for (let i = 0; i < 5; i++) C(0.16, 0.12, 0.3, 0xf8f9fa, -9.3 + i * 0.35, 1.37, -2.7, 8); }   // vòi nước ngọt + cốc
  { B(1.3, 0.55, 0.7, 0xc9a227, -6.9, 1.33, -2.4); B(1.1, 0.4, 0.6, 0xffc233, -6.9, 1.78, -2.4); C(0.07, 0.07, 0.3, 0xf08c00, -6.9, 1.6, -2.0, 6); }   // máy nachos
  for (let k = 0; k < 4; k++) { B(5.4, 0.06, 0.5, 0xf1e3c6, -14.4 + (k % 2) * 0.0, 1.3 + k * 0.5, -2.74); }   // kệ kẹo trên tường sau
  for (let i = 0; i < 24; i++) { B(0.28, 0.32, 0.2, [0xe03131, 0xfab005, 0x40c057, 0x4dabf7, 0xda77f2, 0xff922b][i % 6], -16.9 + (i % 12) * 0.45, 1.5 + Math.floor(i / 12) * 0.5, -2.72); }
  plane(comboTex, 12, 2.4, -11.8, 4.9, -2.77, 0, true); B(12.3, 2.7, 0.1, TRIM, -11.8, 4.9, -2.82);
  atlas(LAB, 1, 8, 1, 7.2, 0.9, -11.8, 6.6, -2.76, 0);
  /* ---------- QUẦY VÉ (phải) ---------- */
  B(12.4, 1.1, 1.2, 0x1c3d7a, 11.8, 0.55, 1.4); B(12.6, 0.1, 1.4, 0x1b1b24, 11.8, 1.15, 1.4); BL(12.2, 0.07, 0.07, 0x4dd0e1, 11.8, 0.95, 2.03); sol(11.8, 1.4, 6.3, 0.7);
  [8, 11.8, 15.6].forEach(x => { B(0.8, 0.5, 0.08, 0x111118, x, 1.55, 1.9); plane(uiTex, 0.7, 0.52, x, 1.55, 1.945, 0, true); B(0.1, 0.35, 0.1, 0x111118, x, 1.32, 1.9);
    [-1.9, 1.9].forEach(d => B(0.06, 1.2, 1.3, glassM, x + d, 1.75, 1.4)); B(3.7, 0.5, 0.06, glassM, x, 2.4, 1.95); });
  plane(showTex, 11, 2.6, 11.8, 4.5, -2.77, 0, true); B(11.3, 2.9, 0.1, TRIM, 11.8, 4.5, -2.82);
  atlas(LAB, 1, 8, 0, 4.8, 0.6, 11.8, 6.4, -2.76, 0);
  B(12.4, 0.9, 0.9, 0x2b2230, 11.8, 0.45, -2.4); sol(11.8, -2.4, 6.3, 0.5);
  /* ---------- LOBBY: máy bán vé tự động, màn hình, poster, ghế chờ, nhà vệ sinh ---------- */
  [8, 11, 14].forEach(x => { B(0.9, 1.9, 0.6, 0x1c3d7a, x, 0.95, 9.6); B(0.8, 0.12, 0.5, GOLD, x, 1.96, 9.6); plane(uiTex, 0.75, 0.56, x, 1.45, 9.915, 0, true); B(0.8, 0.5, 0.05, 0x111118, x, 1.45, 9.89); B(0.5, 0.06, 0.2, 0x111118, x, 0.95, 9.95); BL(0.4, 0.04, 0.03, 0x69db7c, x, 0.99, 9.99); sol(x, 9.6, 0.5, 0.35); });
  const NS = [nsTex(["space", "dragon", "robot"], "NOW SHOWING"), nsTex(["ocean", "mango", "dragon"], "COMING SOON")];
  [[8.5, 0], [13, 1]].forEach(([z, i]) => { B(0.2, 2.9, 4.5, TRIM, 19.88, 3.4, z); plane(NS[i], 4.2, 2.5, 19.76, 3.4, z, -Math.PI / 2, true); });
  atlas(LAB, 1, 8, 5, 3.6, 0.45, 19.76, 5.4, 10.75, -Math.PI / 2);
  [4.5, 8.5, 12.5, 16.5, 20.5].forEach((z, i) => { B(0.3, 3.5, 2.7, TRIM, -19.85, 3.0, z); B(0.34, 0.12, 2.8, GOLD, -19.83, 4.8, z); plane(cinemaPoster(["space", "dragon", "robot", "ocean", "mango"][i]), 2.4, 3.2, -19.68, 3.0, z, Math.PI / 2, true); });
  const sofa = (x, z, ry) => { const q = grp(x, z, ry); lb(q, 1.0, 0.4, 2.4, 0xb02a3c, 0, 0.35, 0); lb(q, 0.3, 0.8, 2.4, 0xc0394d, -0.4, 0.75, 0); [-1, 1].forEach(s => lb(q, 1.0, 0.25, 0.25, 0x8a1c2c, 0, 0.6, s * 1.2)); lb(q, 0.9, 0.12, 2.2, 0xd44a5c, 0.05, 0.6, 0); lb(q, 1.1, 0.12, 2.6, 0x2b2230, 0, 0.06, 0); };
  [6.5, 12.5, 18.5].forEach(z => { sofa(-18.5, z, Math.PI / 2); sol(-18.5, z, 0.65, 1.35); });
  [9.5, 15.5].forEach(z => { C(0.35, 0.35, 0.5, 0x2b2230, -18.7, 0.25, z, 12); C(0.4, 0.4, 0.05, 0xe0b43a, -18.7, 0.52, z, 12); C(0.03, 0.03, 0.6, 0x555, -18.7, 0.8, z, 6); C(0.2, 0.28, 0.3, led(0xfff1c2), -18.7, 1.2, z, 10); sol(-18.7, z, 0.4, 0.4); });
  // nhà vệ sinh (tường trái, gần cửa)
  [24, 26.6].forEach((z, i) => { B(0.2, 2.5, 1.3, 0x5c3a2a, -19.8, 1.25, z); B(0.06, 0.12, 0.12, GOLD, -19.68, 1.2, z + 0.4); atlas(CELL, 4, 4, i + 1, 0.9, 0.45, -19.7, 2.85, z, Math.PI / 2); });
  atlas(LAB, 1, 8, 3, 3.2, 0.4, -19.72, 4.2, 25.3, Math.PI / 2);
  // 2 hình nhân (standee) + bệ trưng bày
  [[-5, "dragon"], [5, "mango"]].forEach(([x, k], i) => { B(1.5, 2.1, 0.08, 0x111118, x, 1.15, 12.3); plane(cinemaPoster(k), 1.4, 1.87, x, 1.15, 12.35, 0, true); B(1.0, 0.1, 0.6, 0x2b2230, x, 0.05, 12.4); B(0.1, 0.5, 0.1, 0x2b2230, x, 0.3, 12.15); sol(x, 12.3, 0.8, 0.35); });
  [[-3.2, 3.6], [3.2, 3.6]].forEach(([x, z], i) => {
    C(0.5, 0.55, 0.9, 0xe9e1d0, x, 0.45, z, 14); C(0.55, 0.55, 0.08, GOLD, x, 0.92, z, 14); sol(x, z, 0.6, 0.6);
    if (!i) { B(0.6, 0.35, 0.4, 0x343a40, x, 1.15, z); C(0.18, 0.18, 0.12, 0x868e96, x, 1.2, z + 0.28, 12).rotation.x = Math.PI / 2; [-1, 0, 1].forEach(d => lb(g, 0.04, 0.9, 0.04, 0x555, cx + x + d * 0.22, 0.45, cz + z + (d ? 0.0 : 0.2))); }
    else { [0, 1].forEach(k => { const t = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.06, 6, 16), mat(0x343a40)); t.position.set(cx + x - 0.12 + k * 0.1, 1.28 + k * 0.1, cz + z); g.add(t); C(0.3, 0.3, 0.06, 0x495057, x - 0.12 + k * 0.1, 1.28 + k * 0.1, z, 14).rotation.x = Math.PI / 2; });
      B(0.5, 0.3, 0.05, 0x111118, x + 0.15, 1.18, z + 0.3); B(0.5, 0.06, 0.06, 0xf8f9fa, x + 0.15, 1.34, z + 0.3); } });
  { B(1.0, 1.9, 0.8, 0xc92a2a, 19.3, 0.95, 15.4); BL(0.8, 0.9, 0.04, 0xa5d8ff, 18.88, 1.3, 15.4); B(0.8, 0.2, 0.04, 0xffe066, 18.88, 1.85, 15.4); sol(19.3, 15.4, 0.55, 0.5);   // máy bán hàng tự động
    B(1.4, 2.2, 1.2, 0x3a2a1a, 19.3, 1.1, 4.7); B(1.2, 1.6, 1.0, glassM, 19.2, 1.4, 4.7); [0.7, 1.4].forEach(y => B(1.2, 0.06, 1.0, 0xe0b43a, 19.2, y, 4.7)); [[0.85, 4.45], [0.85, 4.95], [1.5, 4.7]].forEach(([y, z]) => { C(0.14, 0.2, 0.3, GOLD, 19.2, y + 0.18, z, 8); C(0.1, 0.03, 0.12, GOLD, 19.2, y + 0.4, z, 8); }); sol(19.3, 4.7, 0.75, 0.65); }   // tủ cúp
  /* ---------- GÓC GAME ---------- */
  const cab = (z, i) => { const q = grp(19.1, z, -Math.PI / 2), col = [0x2b2d9e, 0x9e2b7a, 0x1a8f6a, 0xb8501a][i % 4], sc = [0x4dd0e1, 0xff6bd5, 0xffe066, 0x69db7c][i % 4];
    lb(q, 0.8, 1.7, 0.9, col, 0, 0.85, 0); lb(q, 0.84, 0.3, 0.96, TRIM, 0, 1.85, 0); lb(q, 0.7, 0.12, 0.7, led(sc), 0, 1.9, 0.1); lb(q, 0.64, 0.5, 0.05, led(sc), 0, 1.35, 0.46); lb(q, 0.7, 0.1, 0.45, 0x222, 0, 0.9, 0.5).rotation.x = 0.35;
    lc(q, 0.025, 0.025, 0.2, 0xdddddd, -0.12, 1.03, 0.52, 6); const b = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), mat(0xe03131)); b.position.set(-0.12, 1.15, 0.52); q.add(b); [0.1, 0.22].forEach((d, k) => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 4), mat([0xffd43b, 0x4dabf7][k])); s.position.set(d, 1.0, 0.52); q.add(s); });
    sol(19.1, z, 0.55, 0.5); };
  [17, 18.5, 20, 21.5].forEach(cab);
  { B(0.9, 1.6, 0.8, 0xe0b43a, 19.2, 0.8, 23.8); C(0.2, 0.2, 0.06, 0x222, 18.75, 1.2, 23.8, 12).rotation.z = Math.PI / 2; BL(0.5, 0.2, 0.04, 0xffffff, 18.74, 1.45, 23.8); sol(19.2, 23.8, 0.55, 0.5); }   // máy đổi xu
  atlas(LAB, 1, 8, 4, 3.6, 0.45, 19.72, 4.1, 19.2, -Math.PI / 2); BL(0.1, 0.12, 8, 0xff6bd5, 19.78, 3.4, 20.4); BL(0.1, 0.12, 8, 0x4dd0e1, 19.78, 0.4, 20.4);
  [11.4, 13.6, 15.8].forEach((x, i) => {   // máy gắp thú nhồi bông (nhìn ra -z)
    const q = grp(x, 27.3, Math.PI); lb(q, 1.4, 1.0, 1.1, [0xff6bd5, 0x4dd0e1, 0xffd43b][i], 0, 0.5, 0); lb(q, 1.3, 1.5, 1.0, glassM, 0, 1.75, 0); lb(q, 1.4, 0.2, 1.1, TRIM, 0, 2.6, 0); lb(q, 1.2, 0.12, 0.7, led(0xfff1c2), 0, 2.45, -0.1);
    [[-0.4, 0.3], [0.1, 0.4], [0.45, 0.2], [-0.1, -0.1], [0.3, -0.2]].forEach(([a, b], k) => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.2, 7, 5), mat([0xff6b6b, 0xffd43b, 0x69db7c, 0x4dabf7, 0xda77f2][(k + i) % 5])); s.position.set(a, 1.15, -b * 0.6); q.add(s); });
    lc(q, 0.015, 0.015, 0.7, 0x888, 0.1, 2.05, 0, 4); const cl = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.2, 6), mat(0xcccccc)); cl.position.set(0.1, 1.62, 0); cl.rotation.x = Math.PI; q.add(cl); sol(x, 27.3, 0.75, 0.6); });
  /* ---------- HÀNH LANG ---------- */
  [-1, 1].forEach((s, si) => { [-4.8, -7.2].forEach((z, i) => { B(0.2, 2.9, 2.2, TRIM, s * 3.9, 2.55, z); plane(cinemaPoster(["ocean", "mango", "robot", "dragon"][si * 2 + i]), 2.0, 2.67, s * 3.78, 2.55, z, -s * Math.PI / 2, true); });
    BL(0.08, 0.08, 6, 0x7b61ff, s * 3.92, 0.15, -6); BL(0.08, 0.08, 6, 0xff4fa3, s * 3.92, 4.6, -6); });
  atlas(CELL, 4, 4, 3, 1.6, 0.8, 0, 4.2, -8.76, 0); atlas(CELL, 4, 4, 3, 1.6, 0.8, 0, 4.2, -3.24, Math.PI);
  for (let z = -8; z <= -4; z += 2) { [-2, 2].forEach(x => C(0.12, 0.12, 0.04, led(0xfff1c2), x, 4.76, z, 10)); }
  /* ---------- PHÒNG CHIẾU STARIUM ---------- */
  const R = 36, LEN = 26 / R, zc = -27.6 + R, curve = (r, h, t, mt, y) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 40, 1, true, Math.PI - LEN * t / 2, LEN * t), mt); m.position.set(cx, y, cz + zc); m.userData.flat = true; g.add(m); return m; };
  curve(R + 0.12, 11, 1.12, new THREE.MeshBasicMaterial({ color: 0x07070c, side: THREE.BackSide }), 6.7);
  const sm = new THREE.MeshBasicMaterial({ map: screenTex, side: THREE.BackSide }); screenTex.wrapS = THREE.RepeatWrapping; screenTex.repeat.x = -1; screenTex.offset.x = 1; curve(R, 10, 1, sm, 6.7);
  B(34, 0.5, 2.4, 0x0b0b12, 0, 0.25, -26.4); BL(30, 0.06, 0.08, 0x7b61ff, 0, 0.55, -25.35);   // bục trước màn hình
  [-1, 1].forEach(s => { for (let i = 0; i < 3; i++) { B(1.3, 1.6, 1.0, 0x111118, s * (15.5 + i * 0.01), 0.8 + i * 1.7, -26.8); C(0.4, 0.4, 0.06, 0x2a2a33, s * 15.5, 0.8 + i * 1.7, -26.28, 16).rotation.x = Math.PI / 2; } });   // loa lớn cạnh màn hình
  // tường bên: tấm hút âm + dải đèn + loa + cửa thoát hiểm
  [-1, 1].forEach(s => {
    for (let z = -27; z < -10; z += 2.2) { B(0.12, 7.5, 1.9, ((z + 27) / 2.2 | 0) % 2 ? 0x2a3270 : 0x232a62, s * 19.9, 4.6, z + 1); BL(0.06, 7.5, 0.1, 0x6c5ce7, s * 19.8, 4.6, z + 2.05); }
    BL(0.1, 0.1, 18, 0x7b61ff, s * 19.75, 0.9, -18); BL(0.1, 0.12, 18, 0xff4fa3, s * 19.75, 8.6, -18);
    [-24.5, -19, -12.5].forEach((z, k) => { const q = grp(s * 19.45, z, -s * Math.PI / 2, 6.6); lb(q, 0.7, 1.5, 1.0, 0x0d0d12, 0, 0, 0); [0.35, -0.3].forEach(y => { lc(q, 0.26, 0.26, 0.1, 0x2a2a33, 0, y, 0.52, 14).rotation.x = Math.PI / 2; lc(q, 0.1, 0.1, 0.12, 0x555a66, 0, y, 0.55, 10).rotation.x = Math.PI / 2; }); });
    B(0.15, 2.8, 1.8, 0x3b3f4a, s * 19.8, 1.4, -14.2); B(0.06, 0.1, 1.3, 0xcfd4da, s * 19.7, 1.1, -14.2); atlas(CELL, 4, 4, 0, 1.6, 0.8, s * 19.72, 3.4, -14.2, -s * Math.PI / 2);
    BL(0.1, 0.1, 3.2, 0x40c057, s * 19.72, 0.1, -14.2); });
  B(0.5, 0.02, 0.02, GOLD, 0, 0.1, -13);   // (chấm vàng nhỏ ở lối đi giữa – không cản)
  // cửa sổ phòng máy chiếu + tia sáng
  B(3.4, 2.0, 0.3, 0x0a0a10, 0, 7.0, -9.35); BL(2.6, 1.3, 0.1, 0xe3f4ff, 0, 7.0, -9.52); B(2.8, 0.08, 0.12, 0x555a66, 0, 6.32, -9.55); B(0.06, 1.3, 0.12, 0x0a0a10, 0, 7.0, -9.56);
  atlas(CELL, 4, 4, 0, 1.6, 0.8, 0, 4.0, -9.22, 0); atlas(CELL, 4, 4, 3, 1.4, 0.7, 5.2, 3.0, -9.22, 0); atlas(CELL, 4, 4, 3, 1.4, 0.7, -5.2, 3.0, -9.22, 0);
  { const bm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 7.2, 17.4, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.06, depthWrite: false, side: THREE.DoubleSide })); bm.scale.set(1, 1, 0.5); bm.rotation.x = Math.PI / 2; bm.position.set(cx, 6.9, cz - 18.2); bm.userData.flat = true; g.add(bm); }
  // trần sao
  for (let i = 0; i < 70; i++) BL(0.14, 0.04, 0.14, i % 5 ? 0xfff1c2 : 0x9ad7ff, -19 + (i * 5.77) % 38, 12.46, -27.5 + (i * 3.13) % 18);
  [-12, -4, 4, 12].forEach(x => BL(0.3, 0.05, 18, 0x4b3fa0, x, 12.44, -18.5));
  // ghế bậc thang: 9 hàng × 2 khối × 15 ghế (InstancedMesh)
  const seats = [], ROWS = 9, ZK = k => -22 + k * 1.1, HK = k => 0.1 + 0.15 * k, dum = new THREE.Object3D();
  [-1, 1].forEach(s => {
    for (let k = 0; k < ROWS; k++) { const z = ZK(k), h = HK(k);
      B(13.6, h, 1.1, 0x3b1426, s * 8.9, h / 2, z); BL(13.6, 0.04, 0.05, 0xffb454, s * 8.9, h - 0.04, z - 0.56); BL(0.06, 0.05, 0.5, 0xffb454, s * 2.17, h + 0.03, z); BL(0.06, 0.05, 0.5, 0xffb454, s * 15.63, h + 0.03, z);   // bậc + đèn bậc thang
      atlas(CELL, 4, 4, 4 + k, 0.5, 0.25, s * 2.15 + s * 0.03, h + 0.16, z, s * Math.PI / 2 + Math.PI / 2 * 0 + (s > 0 ? Math.PI / 2 : -Math.PI / 2) - s * Math.PI / 2 * 0);
      for (let i = 0; i < 15; i++) seats.push([s * (2.55 + i * 0.9), h, z]); }
    sol(s * 8.9, -17.6, 6.8, 4.95); });
  const inst = (geo, m, list, f) => { const im = new THREE.InstancedMesh(geo, m, list.length); list.forEach((p, i) => { dum.position.set(0, 0, 0); dum.rotation.set(0, 0, 0); dum.scale.set(1, 1, 1); f(p); dum.updateMatrix(); im.setMatrixAt(i, dum.matrix); }); g.add(im); return im; };
  inst(new THREE.BoxGeometry(0.72, 0.2, 0.58), mat(0xe03a46, { emissive: 0x3a0508 }), seats, ([x, h, z]) => dum.position.set(cx + x, h + 0.42, cz + z));
  inst(new THREE.BoxGeometry(0.72, 0.8, 0.14), mat(0xc92836, { emissive: 0x330407 }), seats, ([x, h, z]) => { dum.position.set(cx + x, h + 0.85, cz + z + 0.27); dum.rotation.x = -0.12; });
  inst(new THREE.BoxGeometry(0.1, 0.28, 0.56), mat(0x2b2b36), seats, ([x, h, z]) => dum.position.set(cx + x + 0.43, h + 0.62, cz + z));
  inst(new THREE.BoxGeometry(0.1, 0.28, 0.56), mat(0x2b2b36), seats.filter((p, i) => i % 15 === 0), ([x, h, z]) => dum.position.set(cx + x - 0.43, h + 0.62, cz + z));
  /* ---------- KHU, ĐIỂM BÀY TỪ VỰNG, NGƯỜI BÁN ---------- */
  P.zones = [{ x0: cx - 4, x1: cx + 4, z0: cz - 9, z1: cz - 3 }, { x0: cx - 20, x1: cx + 20, z0: cz - 28, z1: cz - 9 }, { x0: cx - 20, x1: cx + 20, z0: cz - 3, z1: cz + 28 }];
  P.keeperPos = [-11, -0.5];
  const A = (a) => a.map(([x, y, z, sx, sz]) => [cx + x, y, cz + z, cx + sx, cz + sz]);
  P.anchors = {
    snack: A([-17.4, -15.9, -14.4, -12.9, -11.4, -9.9, -8.4, -7.2, -6.2].map((x, i) => [x, 1.75 + (i % 2) * 0.4, 1.4, x, 3.3])),
    tickets: A([[7.5, 2.0, 1.6, 7.5, 3.3], [10, 2.5, 1.6, 10, 3.3], [12.5, 3.0, -2.4, 12.5, 3.3], [15, 2.0, 1.6, 15, 3.3], [17, 2.4, 1.6, 17, 3.3]]),
    lobby: A([[-5, 2.5, 12.3, -5, 14.3], [-3.2, 1.9, 3.6, -3.2, 5.4], [3.2, 1.9, 3.6, 2.4, 5.6], [3.5, 2.5, 3.6, 4.4, 5.6], [19.3, 2.3, 15.4, 17.4, 15.4], [19.3, 2.6, 4.7, 17.4, 4.7], [-19.4, 3.5, 25.3, -17.6, 25.3], [19.7, 4.8, 8.5, 17.6, 8.5]]),
    arcade: A([[19.1, 2.3, 17.8, 17.4, 17.8], [19, 1.5, 20.5, 17.4, 20.5], [19.2, 2.0, 23.8, 17.4, 23.8], [15.8, 1.7, 26.6, 15.8, 25.2], [13.6, 2.9, 26.6, 13.6, 25.2]]),
    hall: A([[0, 7.6, -9.7, 0, -11.2], [-19.3, 6.6, -19, -17.8, -19], [-2.4, 1.5, -17.6, -0.9, -17.6], [-2.45, 1.55, -15.4, -0.9, -15.4], [-19.5, 3.7, -14.2, -17.8, -14.2], [0, 1.5, -22.4, 0, -23.8], [-2.2, 0.75, -19.8, -0.9, -19.8], [-8.5, 1.8, -17.6, -1.2, -12], [-14.5, 5.5, -26.2, -13.6, -24.4]])
  };
  g.traverse(o => { if (o.isMesh && o.position.y > 6) o.userData.flat = true; });
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["starium"] = {
  furnish: furnishStarium,
  customWalls: true
};
