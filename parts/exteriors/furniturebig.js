/* EnglishVerse – ngoại thất "furniturebig" (Home & Cozy). Mỗi nơi 1 file (xem docs/TEAM.md).
   Showroom nội thất to: mặt tiền 22 m (theo x), sâu 16 m (theo z), cao 10 m; mặt tiền quay về +z; giữa toà nhà ở (0, 0).
   Ốp đá tối + gỗ óc chó, kính lớn thấy sofa / đèn chùm bên trong (ảnh vẽ sau kính, ánh vàng ấm), biển "HOME & COZY" chữ vàng,
   sảnh cửa ở giữa có mái hiên gỗ, sofa lớn trên nóc làm điểm nhấn. Nhẹ máy: mặt tiền = 1 ảnh, 2 mặt bên + sau = 1 ảnh dùng chung. */
EXTERIORS_EXTRA["furniturebig"] = function (g, P) {
  const W = 22, D = 16, H = 10, ppm = 28;
  const STONE = 0x2e2e31, WAL = 0x6b4a32, DWAL = 0x3a271c, GOLD = 0xc9a24a;
  const glowM = new THREE.MeshBasicMaterial({ color: 0xffd9a0 });
  lb(g, W, H, D, STONE, 0, H / 2, 0);
  // ---- ảnh mặt tiền ----
  const front = skin(W, H, ppm, (x, w, h) => {
    x.fillStyle = "#2e2e31"; x.fillRect(0, 0, w, h); x.fillStyle = "#3a3a3e"; for (let Y = 0.6; Y < h; Y += 1.2) x.fillRect(0, Y, w, 0.04); for (let X = 0.9; X < w; X += 2.4) { x.fillRect(X, 0, 0.04, h); }
    // đai gỗ trên + dưới tầng kính
    x.fillStyle = "#6b4a32"; x.fillRect(0, 0, w, 0.7); x.fillStyle = "#c9a24a"; x.fillRect(0, 0.7, w, 0.07); x.fillStyle = "#4a3222"; for (let X = 0.2; X < w; X += 0.35) x.fillRect(X, 0.05, 0.05, 0.6);
    // hai cánh ốp gỗ + biển chữ ở giữa
    [[0.5, 3.4], [w - 3.9, 3.4]].forEach(([X, ww]) => { x.fillStyle = "#6b4a32"; x.fillRect(X, 1.1, ww, 3.6); x.fillStyle = "#3a271c"; for (let i = X + 0.12; i < X + ww; i += 0.24) x.fillRect(i, 1.1, 0.05, 3.6); x.fillStyle = "#c9a24a"; x.fillRect(X, 1.1, ww, 0.06); x.fillRect(X, 4.64, ww, 0.06); });
    x.fillStyle = "#c9a24a"; x.fillRect(4.1, 1.0, 13.8, 3.8); x.fillStyle = "#17120e"; x.fillRect(4.25, 1.15, 13.5, 3.5);
    x.strokeStyle = "#c9a24a"; x.lineWidth = 0.05; x.strokeRect(4.5, 1.4, 13.0, 3.0);
    signText(x, "HOME & COZY", w / 2, 2.55, 11.8, 1.6, "#f0cd7c", "bold italic "); x.fillStyle = "#c9a24a"; x.fillRect(5.8, 3.55, 10.4, 0.04); signText(x, "F U R N I T U R E  ·  D E C O R  ·  L I V I N G", w / 2, 3.95, 10.4, 0.4, "#e8c27a");
    x.fillStyle = "rgba(255,210,140,0.18)"; x.beginPath(); x.moveTo(4.4, 4.6); x.lineTo(5.6, 1.2); x.lineTo(7.2, 1.2); x.lineTo(6.2, 4.6); x.fill();
    // đai gỗ giữa tầng
    x.fillStyle = "#6b4a32"; x.fillRect(0, 5.0, w, 0.45); x.fillStyle = "#c9a24a"; x.fillRect(0, 5.0, w, 0.05);
    // ---- kính lớn trái / phải: nhìn thấy nội thất bên trong ----
    const win = (X0, X1, left) => {
      const Y0 = 5.7, Y1 = 9.55, ww = X1 - X0, hh = Y1 - Y0, gr = x.createLinearGradient(0, Y0, 0, Y1); gr.addColorStop(0, "#3a2414"); gr.addColorStop(0.55, "#a8703a"); gr.addColorStop(1, "#ffd08a");
      x.fillStyle = "#17120e"; x.fillRect(X0 - 0.12, Y0 - 0.12, ww + 0.24, hh + 0.12); x.fillStyle = gr; x.fillRect(X0, Y0, ww, hh);
      x.fillStyle = "#7a4e2d"; x.fillRect(X0, Y1 - 0.5, ww, 0.5);   // sàn gỗ trong nhà
      const glow = (cxx, cyy, r) => { const g2 = x.createRadialGradient(cxx, cyy, 0.05, cxx, cyy, r); g2.addColorStop(0, "rgba(255,240,190,0.95)"); g2.addColorStop(1, "rgba(255,220,150,0)"); x.fillStyle = g2; x.fillRect(cxx - r, cyy - r, r * 2, r * 2); };
      const sofa = (sx, sy, sw, col, col2) => { x.fillStyle = col; x.fillRect(sx, sy - 0.9, sw, 0.9); x.fillRect(sx - 0.25, sy - 0.65, 0.35, 0.7); x.fillRect(sx + sw - 0.1, sy - 0.65, 0.35, 0.7); x.fillStyle = col2; x.fillRect(sx + 0.1, sy - 0.45, sw / 2 - 0.15, 0.4); x.fillRect(sx + sw / 2 + 0.05, sy - 0.45, sw / 2 - 0.15, 0.4); x.fillStyle = "#3a271c"; x.fillRect(sx - 0.1, sy, 0.1, 0.15); x.fillRect(sx + sw, sy, 0.1, 0.15); };
      const lamp = (lx, ly, c) => { x.fillStyle = "#c9a24a"; x.fillRect(lx - 0.03, ly - 2.0, 0.06, 2.0); glow(lx, ly - 2.25, 1.1); x.fillStyle = c; x.beginPath(); x.moveTo(lx - 0.45, ly - 1.85); x.lineTo(lx + 0.45, ly - 1.85); x.lineTo(lx + 0.3, ly - 2.45); x.lineTo(lx - 0.3, ly - 2.45); x.fill(); };
      if (left) { sofa(X0 + 1.2, Y1 - 0.5, 3.2, "#2f5d5a", "#3b7770"); lamp(X0 + 5.6, Y1 - 0.5, "#fff0c8"); x.fillStyle = "#c9922e"; x.fillRect(X0 + 5.9, Y1 - 1.3, 0.9, 0.8); x.fillStyle = "#e6dccb"; x.fillRect(X0 + 0.35, Y0 + 0.5, 1.3, 1.0); x.fillStyle = "#2f5d5a"; x.fillRect(X0 + 0.45, Y0 + 0.6, 1.1, 0.8); x.fillStyle = "#e6dccb"; x.fillRect(X0 + 2.4, Y0 + 0.4, 1.6, 1.1); x.fillStyle = "#c9a24a"; x.fillRect(X0 + 2.5, Y0 + 0.5, 1.4, 0.9); }
      else { glow(X0 + ww / 2, Y0 + 0.6, 1.4); x.strokeStyle = "#c9a24a"; x.lineWidth = 0.05; [0.5, 0.9, 1.3].forEach((r, i) => { x.beginPath(); x.ellipse(X0 + ww / 2, Y0 + 0.5 + i * 0.35, r, r * 0.25, 0, 0, 7); x.stroke(); }); x.fillStyle = "#fff0c8"; for (let i = 0; i < 8; i++) { x.beginPath(); x.arc(X0 + ww / 2 + Math.cos(i * 0.78) * 1.2, Y0 + 0.75 + Math.sin(i * 0.78) * 0.3, 0.07, 0, 7); x.fill(); }
        sofa(X0 + 3.6, Y1 - 0.5, 2.8, "#c9922e", "#d9a43e"); x.fillStyle = "#e6dccb"; x.beginPath(); x.ellipse(X0 + 5.0, Y1 - 0.38, 2.2, 0.25, 0, 0, 7); x.fill(); lamp(X0 + 0.7, Y1 - 0.5, "#ffe2b0"); x.fillStyle = "#6e2e3a"; x.fillRect(X0 + 0.15, Y1 - 1.55, 0.9, 1.05); x.fillStyle = "#2f6b3a"; x.beginPath(); x.arc(X0 + ww - 0.7, Y1 - 1.6, 0.5, 0, 7); x.arc(X0 + ww - 0.5, Y1 - 2.1, 0.4, 0, 7); x.fill(); x.fillStyle = "#3a271c"; x.fillRect(X0 + ww - 0.85, Y1 - 1.2, 0.3, 0.7); }
      x.fillStyle = "rgba(255,255,255,0.16)"; x.beginPath(); x.moveTo(X0 + 0.3, Y0); x.lineTo(X0 + 1.4, Y0); x.lineTo(X0 + 0.2, Y1); x.lineTo(X0 - 0.2, Y1); x.fill(); x.beginPath(); x.moveTo(X0 + ww * 0.55, Y0); x.lineTo(X0 + ww * 0.55 + 0.8, Y0); x.lineTo(X0 + ww * 0.55 - 0.7, Y1); x.lineTo(X0 + ww * 0.55 - 1.5, Y1); x.fill();
      x.fillStyle = "#17120e"; for (let i = 1; i < 3; i++) x.fillRect(X0 + ww * i / 3 - 0.04, Y0, 0.08, hh); x.fillRect(X0, Y0 + 1.5, ww, 0.06);
    };
    win(0.9, 8.2, true); win(13.8, 21.1, false);
    // ---- sảnh cửa giữa: ốp gỗ + cửa kính đôi ----
    x.fillStyle = "#6b4a32"; x.fillRect(8.4, 5.45, 5.2, 4.55); x.fillStyle = "#3a271c"; for (let X = 8.5; X < 13.6; X += 0.26) x.fillRect(X, 5.45, 0.05, 4.55);
    x.fillStyle = "#17120e"; x.fillRect(9.5, 6.4, 3.0, 3.6); const dg = x.createLinearGradient(0, 6.5, 0, 10); dg.addColorStop(0, "#5a3a20"); dg.addColorStop(1, "#ffcf8a"); x.fillStyle = dg; x.fillRect(9.6, 6.5, 1.4, 3.5); x.fillRect(11.0, 6.5, 1.4, 3.5);
    x.fillStyle = "rgba(255,255,255,0.2)"; x.beginPath(); x.moveTo(9.7, 6.5); x.lineTo(10.4, 6.5); x.lineTo(9.7, 9.2); x.fill(); x.fillStyle = "#c9a24a"; x.fillRect(10.85, 7.8, 0.06, 1.0); x.fillRect(11.09, 7.8, 0.06, 1.0);
    signText(x, "WELCOME", w / 2, 5.95, 2.6, 0.5, "#f0cd7c");
    x.fillStyle = "#17120e"; x.fillRect(0, 9.6, 8.4, 0.4); x.fillRect(13.6, 9.6, 8.4, 0.4); x.fillStyle = "#4a4a50"; x.fillRect(0, 9.9, w, 0.1);
  });
  const sideDraw = (x, w, h) => {   // mặt bên + sau: đá tối, dải gỗ ngang, cửa sổ đứng sáng vàng
    x.fillStyle = "#2e2e31"; x.fillRect(0, 0, w, h); x.fillStyle = "#3a3a3e"; for (let Y = 0.6; Y < h; Y += 1.2) x.fillRect(0, Y, w, 0.04); for (let X = 0.9; X < w; X += 2.4) x.fillRect(X, 0, 0.04, h);
    x.fillStyle = "#6b4a32"; x.fillRect(0, 0, w, 0.7); x.fillStyle = "#c9a24a"; x.fillRect(0, 0.7, w, 0.07); x.fillStyle = "#6b4a32"; x.fillRect(0, 5.0, w, 0.45); x.fillStyle = "#c9a24a"; x.fillRect(0, 5.0, w, 0.05);
    x.fillStyle = "#3a271c"; for (let X = 0.2; X < w; X += 0.35) { x.fillRect(X, 0.05, 0.05, 0.6); x.fillRect(X, 5.05, 0.05, 0.4); }
    for (let X = 1.6; X < w - 1; X += 3.1) { x.fillStyle = "#17120e"; x.fillRect(X - 0.1, 6.0, 1.3, 3.6); const gr = x.createLinearGradient(0, 6.1, 0, 9.6); gr.addColorStop(0, "#7a4a24"); gr.addColorStop(1, "#ffd08a"); x.fillStyle = gr; x.fillRect(X, 6.1, 1.1, 3.4); x.fillStyle = "rgba(255,255,255,0.14)"; x.beginPath(); x.moveTo(X, 6.1); x.lineTo(X + 0.5, 6.1); x.lineTo(X, 8.6); x.fill(); }
    x.fillStyle = "#17120e"; for (let X = 3.2; X < w - 1; X += 3.1) x.fillRect(X, 1.6, 0.9, 2.6);
    x.fillStyle = "#4a4a50"; x.fillRect(0, 9.9, w, 0.1);
  };
  const sideTex = skin(D, H, ppm, sideDraw), backTex = skin(W, H, ppm, sideDraw);
  face(g, front, W, H, 0, H / 2, D / 2 + 0.02);
  face(g, sideTex, D, H, W / 2 + 0.02, H / 2, 0, Math.PI / 2); face(g, sideTex, D, H, -W / 2 - 0.02, H / 2, 0, -Math.PI / 2);
  face(g, backTex, W, H, 0, H / 2, -D / 2 - 0.02, Math.PI);
  // ---- mái: gờ gỗ + sofa lớn trên nóc ----
  lb(g, W + 0.5, 0.45, D + 0.5, DWAL, 0, H + 0.22, 0); [[0, D / 2 + 0.3, W + 0.7, 0.3], [0, -D / 2 - 0.3, W + 0.7, 0.3], [W / 2 + 0.3, 0, 0.3, D + 0.7], [-W / 2 - 0.3, 0, 0.3, D + 0.7]].forEach(([x, z, w, d]) => lb(g, w, 0.3, d, GOLD, x, H + 0.55, z));
  const sofa = new THREE.Group(); sofa.position.set(0, H + 0.56, 3.5); sofa.scale.setScalar(1.7); g.add(sofa);
  lb(sofa, 4, 0.7, 1.4, 0x2f5d5a, 0, 0.55, 0); lb(sofa, 4, 1.1, 0.4, 0x2f5d5a, 0, 1.1, -0.55); [-1, 1].forEach(s => lb(sofa, 0.45, 1, 1.4, 0x2f5d5a, s * 2.1, 0.8, 0));
  [-0.95, 0.95].forEach(x => lb(sofa, 1.8, 0.25, 1.1, 0x3b7770, x, 1, 0.1)); [-1.7, 1.7].forEach(x => lb(sofa, 0.15, 0.25, 0.15, GOLD, x, 0.1, 0.5)); [-1.5, 1.4].forEach((x, i) => { const p = lb(sofa, 0.6, 0.55, 0.18, i ? GOLD : 0x3b7770, x, 1.3, 0.12); p.rotation.z = i ? -0.2 : 0.2; });
  // đèn cây lớn bên sofa
  lc(g, 0.07, 0.07, 3.6, GOLD, 5.2, H + 2.3, 3.6, 8); lc(g, 0.5, 0.8, 0.9, glowM, 5.2, H + 4.4, 3.6, 14);
  // ---- trụ gỗ + mái hiên sảnh ----
  [-9.0, 9.0].forEach(x => { lb(g, 0.5, 5.4, 0.6, WAL, x, 2.7, D / 2 + 0.3); lb(g, 0.56, 0.12, 0.66, GOLD, x, 5.4, D / 2 + 0.3); });
  lb(g, 7.6, 0.3, 3.0, DWAL, 0, 5.5, D / 2 + 1.5); for (let i = -3.6; i <= 3.7; i += 0.4) lb(g, 0.12, 0.2, 3.0, WAL, i, 5.28, D / 2 + 1.5);
  lb(g, 7.6, 0.06, 0.06, glowM, 0, 5.3, D / 2 + 3.0).userData.flat = true; [-3.4, 3.4].forEach(x => lc(g, 0.11, 0.11, 5.4, DWAL, x, 2.7, D / 2 + 2.9, 8));
  lb(g, 4.6, 0.04, 2.4, WAL, 0, 0.03, D / 2 + 1.2);   // thảm gỗ trước cửa
  // ---- chậu cây lớn hai bên sảnh + 2 đèn đường ----
  [[-6.2, 10.0], [6.2, 10.0], [-10.2, 9.4], [10.2, 9.4]].forEach(([x, z]) => { lc(g, 0.55, 0.45, 0.9, DWAL, x, 0.45, z, 12); bigTree(g, x, z, 0.5); });
  [[-12.5, 9.0], [12.5, 9.0]].forEach(([x, z]) => { lc(g, 0.06, 0.06, 3.2, DWAL, x, 1.6, z, 6); lc(g, 0.22, 0.28, 0.4, glowM, x, 3.3, z, 10); });
  return { solids: [[0, 0, W / 2, D / 2], [-3.4, D / 2 + 2.9, 0.15, 0.15], [3.4, D / 2 + 2.9, 0.15, 0.15], [-6.2, 10.0, 0.5, 0.5], [6.2, 10.0, 0.5, 0.5], [-10.2, 9.4, 0.5, 0.5], [10.2, 9.4, 0.5, 0.5], [-12.5, 9.0, 0.15, 0.15], [12.5, 9.0, 0.15, 0.15], [-9.0, D / 2 + 0.3, 0.3, 0.3], [9.0, D / 2 + 0.3, 0.3, 0.3]],
    door: [0, 8.6], map: [[0, 0, W, D]] };
};
