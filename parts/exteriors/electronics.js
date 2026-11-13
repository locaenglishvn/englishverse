/* EnglishVerse – ngoại thất "electronics" (Verse Electronics). Mỗi nơi 1 file (xem docs/TEAM.md).
   Siêu thị điện máy kiểu điện máy lớn: khối hộp mặt tiền 22 m (theo x), sâu 16 m (theo z), cao 9 m; mặt tiền quay về +z; giữa toà nhà ở (0, 0).
   Ốp xanh lá đậm, dải biển vàng chữ lớn "VERSE ELECTRONICS" (tự thiết kế, không logo / tên thật), kính lớn thấy tường TV + tủ lạnh / máy giặt bên trong (ảnh vẽ sau kính),
   mái hiên xanh viền vàng, cửa trượt kính ở giữa, cờ phướn "SALE" trước nhà, cột biển cao bên góc. Nhẹ máy: mặt tiền = 1 ảnh, mặt bên / sau = 1 ảnh dùng chung. */
EXTERIORS_EXTRA["electronics"] = function (g, P) {
  const W = 22, D = 16, H = 9, ppm = 28;
  const GREEN = 0x136b2b, YEL = 0xffd21f, WHITE = 0xf4f6f5;
  const front = skin(W, H, ppm, (x, w, h) => {
    x.fillStyle = "#136b2b"; x.fillRect(0, 0, w, h); x.fillStyle = "#1a7c34"; for (let X = 0; X < w; X += 1.1) x.fillRect(X, 0, 0.5, h); x.fillStyle = "#0e5522"; for (let X = 0; X < w; X += 1.1) x.fillRect(X + 0.5, 0, 0.04, h);
    // dải biển vàng
    x.fillStyle = "#ffffff"; x.fillRect(0, 0.7, w, 0.14); x.fillStyle = "#ffd21f"; x.fillRect(0, 0.84, w, 2.9); x.fillStyle = "#ffffff"; x.fillRect(0, 3.73, w, 0.14);
    x.fillStyle = "#136b2b"; x.beginPath(); x.arc(2.1, 2.3, 1.05, 0, 7); x.fill(); signText(x, "V", 2.1, 2.34, 1.1, 1.7, "#ffd21f");
    signText(x, "VERSE ELECTRONICS", 12.3, 2.15, 17.0, 2.0, "#136b2b"); signText(x, "TV · PHONES · LAPTOPS · HOME APPLIANCES", 12.3, 3.3, 15.0, 0.42, "#136b2b");
    x.fillStyle = "#d62f2f"; x.fillRect(19.2, 1.05, 2.4, 0.9); signText(x, "SALE -30%", 20.4, 1.52, 2.2, 0.55, "#ffe45c");
    // kính tầng trệt
    const shop = (X0, X1, kind) => {
      const Y0 = 4.5, Y1 = 8.55, ww = X1 - X0, hh = Y1 - Y0; x.fillStyle = "#0e5522"; x.fillRect(X0 - 0.12, Y0 - 0.12, ww + 0.24, hh + 0.12);
      const gr = x.createLinearGradient(0, Y0, 0, Y1); gr.addColorStop(0, "#d8eef7"); gr.addColorStop(1, "#f4fbff"); x.fillStyle = gr; x.fillRect(X0, Y0, ww, hh);
      x.fillStyle = "#e2e8ea"; x.fillRect(X0, Y1 - 0.4, ww, 0.4);
      if (kind === "tv") { const cols = ["#ff8a3d", "#2bb0ed", "#3aa655", "#6a3b86", "#e63946", "#2ec4b6"]; [[0.3, 0.3, 2.6, 1.5], [3.1, 0.3, 1.8, 1.0], [5.1, 0.3, 2.4, 1.4], [3.1, 1.45, 1.8, 1.0], [0.3, 1.95, 1.8, 1.0], [2.3, 2.1, 2.3, 1.35], [4.8, 1.85, 1.6, 0.95], [6.6, 1.85, 1.2, 0.75]].forEach(([dx, dy, tw, th], i) => { x.fillStyle = "#111"; x.fillRect(X0 + dx, Y0 + dy, tw, th); x.fillStyle = cols[i % 6]; x.fillRect(X0 + dx + 0.06, Y0 + dy + 0.06, tw - 0.12, th - 0.12); x.fillStyle = "rgba(255,255,255,0.3)"; x.beginPath(); x.moveTo(X0 + dx + 0.06, Y0 + dy + 0.06); x.lineTo(X0 + dx + 0.06 + tw * 0.4, Y0 + dy + 0.06); x.lineTo(X0 + dx + 0.06, Y0 + dy + th * 0.7); x.fill(); });
        x.fillStyle = "#c9cfd1"; x.fillRect(X0 + 0.4, Y1 - 0.9, 3.0, 0.5); x.fillStyle = "#111"; x.fillRect(X0 + 0.5, Y1 - 1.0, 2.8, 0.1); x.fillStyle = "#d62f2f"; x.fillRect(X0 + 5.4, Y1 - 1.6, 2.2, 1.0); signText(x, "BIG SALE", X0 + 6.5, Y1 - 1.1, 2.0, 0.4, "#ffe45c"); }
      else { [[0.4, 2.0, "#f2f5f6"], [1.6, 1.8, "#c9d0d4"], [2.8, 2.05, "#f2f5f6"], [4.0, 1.7, "#e3e8ea"]].forEach(([dx, th, c], i) => { x.fillStyle = "#aeb8bd"; x.fillRect(X0 + dx, Y1 - 0.4 - th, 1.05, th); x.fillStyle = c; x.fillRect(X0 + dx + 0.04, Y1 - 0.4 - th + 0.04, 0.97, th - 0.08); x.fillStyle = "#8d979c"; x.fillRect(X0 + dx + 0.85, Y1 - 0.4 - th + 0.5, 0.05, 0.6); x.fillRect(X0 + dx + 0.04, Y1 - 0.4 - th * 0.35, 0.97, 0.03); });
        [[5.4], [6.5]].forEach(([dx]) => { x.fillStyle = "#aeb8bd"; x.fillRect(X0 + dx, Y1 - 1.35, 0.95, 0.95); x.fillStyle = "#f2f5f6"; x.fillRect(X0 + dx + 0.04, Y1 - 1.31, 0.87, 0.87); x.fillStyle = "#5d6a70"; x.beginPath(); x.arc(X0 + dx + 0.47, Y1 - 0.72, 0.3, 0, 7); x.fill(); x.fillStyle = "#9fd3e6"; x.beginPath(); x.arc(X0 + dx + 0.47, Y1 - 0.72, 0.24, 0, 7); x.fill(); });
        x.fillStyle = "#f2f5f6"; x.fillRect(X0 + 0.6, Y0 + 0.4, 1.6, 0.5); x.fillStyle = "#9aa6ab"; x.fillRect(X0 + 0.7, Y0 + 0.72, 1.4, 0.06); x.fillStyle = "#f2f5f6"; x.fillRect(X0 + 2.6, Y0 + 0.4, 1.6, 0.5); x.fillStyle = "#1f8f3c"; x.fillRect(X0 + 5.4, Y0 + 0.3, 2.2, 0.9); signText(x, "FRIDGES · AC", X0 + 6.5, Y0 + 0.76, 2.0, 0.34, "#ffd21f"); }
      x.fillStyle = "rgba(255,255,255,0.35)"; x.beginPath(); x.moveTo(X0 + 0.3, Y0); x.lineTo(X0 + 1.5, Y0); x.lineTo(X0 + 0.1, Y1); x.lineTo(X0 - 0.3, Y1); x.fill(); x.beginPath(); x.moveTo(X0 + ww * 0.6, Y0); x.lineTo(X0 + ww * 0.6 + 0.8, Y0); x.lineTo(X0 + ww * 0.6 - 0.6, Y1); x.lineTo(X0 + ww * 0.6 - 1.4, Y1); x.fill();
      x.fillStyle = "#0e5522"; for (let i = 1; i < 3; i++) x.fillRect(X0 + ww * i / 3 - 0.05, Y0, 0.1, hh);
    };
    shop(0.7, 9.0, "tv"); shop(13.0, 21.3, "fridge");
    // cửa trượt giữa
    x.fillStyle = "#0e5522"; x.fillRect(9.2, 4.4, 3.6, 4.6); x.fillStyle = "#cfe9f2"; x.fillRect(9.4, 4.95, 3.2, 3.95); x.fillStyle = "#0e5522"; x.fillRect(10.98, 4.95, 0.1, 3.95); x.fillStyle = "rgba(255,255,255,0.4)"; x.beginPath(); x.moveTo(9.6, 4.95); x.lineTo(10.4, 4.95); x.lineTo(9.6, 7.2); x.fill();
    x.fillStyle = "#0b0b0b"; x.fillRect(9.5, 4.5, 3.0, 0.38); signText(x, "OPEN 8AM – 10PM", 11.0, 4.7, 2.8, 0.26, "#6cf08a");
    x.fillStyle = "#ffd21f"; x.fillRect(0, 8.6, w, 0.14); x.fillStyle = "#dfe5e7"; x.fillRect(0, 8.74, w, 0.26);
  });
  const sideDraw = (x, w, h) => {   // mặt bên + sau: ốp xanh, vạch vàng, ô cửa sổ cao
    x.fillStyle = "#136b2b"; x.fillRect(0, 0, w, h); x.fillStyle = "#1a7c34"; for (let X = 0; X < w; X += 1.1) x.fillRect(X, 0, 0.5, h); x.fillStyle = "#0e5522"; for (let X = 0; X < w; X += 1.1) x.fillRect(X + 0.5, 0, 0.04, h);
    x.fillStyle = "#ffd21f"; x.fillRect(0, 0.9, w, 0.35); x.fillRect(0, 8.4, w, 0.2); x.fillStyle = "#dfe5e7"; x.fillRect(0, 8.7, w, 0.3);
    for (let X = 1.5; X < w - 1.5; X += 3.0) { x.fillStyle = "#0e5522"; x.fillRect(X - 0.1, 3.0, 1.7, 1.0); x.fillStyle = "#cfe9f2"; x.fillRect(X, 3.1, 1.5, 0.8); }
    x.fillStyle = "#ffffff"; signText(x, "VERSE ELECTRONICS", w / 2, 6.2, w * 0.6, 0.9, "#ffd21f");
  };
  const sideTex = skin(D, H, ppm, sideDraw), backTex = skin(W, H, ppm, sideDraw);
  lb(g, W, H, D, GREEN, 0, H / 2, 0);
  face(g, front, W, H, 0, H / 2, D / 2 + 0.02);
  face(g, sideTex, D, H, W / 2 + 0.02, H / 2, 0, Math.PI / 2); face(g, sideTex, D, H, -W / 2 - 0.02, H / 2, 0, -Math.PI / 2);
  face(g, backTex, W, H, 0, H / 2, -D / 2 - 0.02, Math.PI);
  // ---- mái: gờ xanh + vạch vàng + vài máy lạnh trên nóc ----
  lb(g, W + 0.5, 0.5, D + 0.5, 0x0e5522, 0, H + 0.25, 0); [[0, D / 2 + 0.3, W + 0.7, 0.3], [0, -D / 2 - 0.3, W + 0.7, 0.3], [W / 2 + 0.3, 0, 0.3, D + 0.7], [-W / 2 - 0.3, 0, 0.3, D + 0.7]].forEach(([x, z, w, d]) => lb(g, w, 0.3, d, YEL, x, H + 0.6, z));
  [[-6, -3], [-1, -3], [5, 0]].forEach(([x, z]) => { lb(g, 3.2, 1.3, 2.4, 0xdfe5e7, x, H + 1.2, z); lb(g, 2.9, 0.08, 2.1, 0xdfe5e7, x, H + 1.88, z); lc(g, 0.55, 0.55, 0.1, 0x0e5522, x - 0.8, H + 1.95, z, 12); });
  // ---- mái hiên xanh viền vàng + cột trắng ----
  const aw = lb(g, W + 0.8, 0.25, 2.4, GREEN, 0, 4.7, D / 2 + 1.2); aw.rotation.x = 0.05; lb(g, W + 0.8, 0.12, 0.1, YEL, 0, 4.55, D / 2 + 2.42);
  [-10.6, -6.0, 6.0, 10.6].forEach(x => lc(g, 0.1, 0.1, 4.6, WHITE, x, 2.3, D / 2 + 2.2, 8));
  lb(g, 4.6, 0.04, 2.4, GREEN, 0, 0.03, D / 2 + 1.2);   // thảm xanh trước cửa
  // ---- cờ phướn SALE ----
  const flagTex = skin(1.2, 2.6, 60, (x, w, h) => { x.fillStyle = "#d62f2f"; x.fillRect(0, 0, w, h); x.fillStyle = "#ffd21f"; x.fillRect(0, 0, w, 0.1); x.fillRect(0, h - 0.1, w, 0.1); signText(x, "SALE", w / 2, h * 0.3, w - 0.2, 0.5, "#ffe45c"); signText(x, "-30%", w / 2, h * 0.52, w - 0.2, 0.55, "#ffffff"); signText(x, "ALL TVs", w / 2, h * 0.72, w - 0.2, 0.26, "#ffe45c"); });
  const flagM = new THREE.MeshLambertMaterial({ map: flagTex, side: THREE.DoubleSide });
  [-8.3, -4.6, 4.6, 8.3].forEach(x => { lc(g, 0.04, 0.05, 4.2, WHITE, x, 2.1, D / 2 + 4.2, 6); const f = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.6), flagM); f.position.set(x + 0.62, 2.9, D / 2 + 4.2); g.add(f); lc(g, 0.07, 0.07, 0.08, YEL, x, 4.25, D / 2 + 4.2, 6); });
  // ---- cột biển cao ở góc ----
  { const px = -14.0, pz = D / 2 + 2.0; lc(g, 0.22, 0.28, 8.0, 0x0e5522, px, 4.0, pz, 10);
    const lg = skin(4.2, 2.6, 60, (x, w, h) => { x.fillStyle = "#ffd21f"; x.fillRect(0, 0, w, h); x.fillStyle = "#136b2b"; x.fillRect(0.12, 0.12, w - 0.24, h - 0.24); signText(x, "VERSE", w / 2, 0.8, w - 0.6, 0.9, "#ffd21f"); signText(x, "ELECTRONICS", w / 2, 1.55, w - 0.5, 0.6, "#ffffff"); x.fillStyle = "#d62f2f"; x.fillRect(0.5, 1.95, w - 1.0, 0.45); signText(x, "SALE UP TO 30% OFF", w / 2, 2.18, w - 1.2, 0.3, "#ffe45c"); });
    const lm = new THREE.MeshLambertMaterial({ map: lg, side: THREE.DoubleSide }); const sp = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.6), lm); sp.position.set(px, 8.8, pz); g.add(sp); lb(g, 4.4, 0.15, 0.2, YEL, px, 10.2, pz); lb(g, 4.4, 0.15, 0.2, YEL, px, 7.4, pz); }
  // ---- giỏ xe đẩy + chậu cây hai bên ----
  [[-11.6, 9.6], [11.6, 9.6]].forEach(([x, z]) => { lc(g, 0.55, 0.45, 0.9, 0x0e5522, x, 0.45, z, 12); bigTree(g, x, z, 0.5); });
  [[-3.6, 9.3], [-3.6, 10.0], [-3.6, 10.7]].forEach(([x, z]) => { lb(g, 0.6, 0.55, 0.9, GREEN, x - 0.0, 0.5, z).scale.set(1, 1, 0.5); });
  return { solids: [[0, 0, W / 2, D / 2], [-10.6, D / 2 + 2.2, 0.12, 0.12], [-6.0, D / 2 + 2.2, 0.12, 0.12], [6.0, D / 2 + 2.2, 0.12, 0.12], [10.6, D / 2 + 2.2, 0.12, 0.12], [-8.3, D / 2 + 4.2, 0.1, 0.1], [-4.6, D / 2 + 4.2, 0.1, 0.1], [4.6, D / 2 + 4.2, 0.1, 0.1], [8.3, D / 2 + 4.2, 0.1, 0.1], [-14.0, D / 2 + 2.0, 0.3, 0.3], [-11.6, 9.6, 0.5, 0.5], [11.6, 9.6, 0.5, 0.5], [-3.6, 10.0, 0.4, 0.9]],
    door: [0, 8.6], map: [[0, 0, W, D]] };
};
