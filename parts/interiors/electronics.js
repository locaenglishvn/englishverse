/* EnglishVerse – nội thất "electronics" (layout: "electrohall"). Mỗi nơi 1 file (xem docs/TEAM.md).
   VERSE ELECTRONICS – siêu thị điện máy kiểu điện máy lớn (40 × 54 m, trần 10 m): sàn trắng bóng, trần trắng đèn tuýp, biển treo xanh lá đậm + chữ vàng,
   dãy bàn / kệ theo ngành hàng, lối đi rõ. Tên / biển hiệu / màu tự thiết kế (KHÔNG dùng logo, tên, linh vật của thương hiệu thật). Sáng (bright). Cửa ở z = +27.
   Toạ độ (x, z) tính từ giữa phòng:
     Cột trái  (x -19.5..-4.5): warranty (z 19.5..26) · phones (z 4.5..12.5) · computers (z -7..2.5) · audio (z -26.5..-13.5)
     Cột phải  (x +4.5..+19.5): cashier (z 19.5..26) · kitchen (z 5..16.5) · appliances (z -12..-1) · tv (z -26.5..-18.3)
   Chừa trống: lối vào x -1.5..+1.5, z +18..+27; lối đi giữa x -2.5..+2.5; chỗ NPC (-8,14) (10,2) (-10,-10) (8,-16) (bán kính 0,8 m). Mọi thứ đứng im.
   Khối tự dựng gộp theo chất liệu (mat()); biển chữ + màn hình = 2 "atlas" ảnh dùng chung (mỗi atlas 1 lần vẽ). */
(function () {
  const K = { green: 0x1f8f3c, dgreen: 0x136b2b, lgreen: 0x7fd18b, yellow: 0xffd21f, white: 0xf4f6f5, grey: 0xc9cfcd, dgrey: 0x4a5250, black: 0x16191a, steel: 0xaab3b8, silver: 0xd3d9dc,
    red: 0xd62f2f, blue: 0x2f7fd6, orange: 0xf08a24, wood: 0xb98a58, pink: 0xe8789c, teal: 0x1fa6a0, navy: 0x233a5c };
  const BMC = {}, BM = (c) => BMC[c] || (BMC[c] = new THREE.MeshBasicMaterial({ color: c }));
  const glassM = () => mat(0xbfe0e6, { transparent: true, opacity: 0.3, depthWrite: false });
  const SPH = new THREE.SphereGeometry(1, 12, 9);
  const rnd = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647;

  function atlas(cols, rows, cw, ch, draw) {   // nhiều ảnh nhỏ trong 1 ảnh to → dùng chung 1 chất liệu = 1 lần vẽ
    const c = document.createElement("canvas"); c.width = cols * cw; c.height = rows * ch; const x = c.getContext("2d");
    for (let i = 0; i < cols * rows; i++) { x.save(); x.translate((i % cols) * cw, Math.floor(i / cols) * ch); x.beginPath(); x.rect(0, 0, cw, ch); x.clip(); draw(x, i, cw, ch); x.restore(); }
    const t = new THREE.CanvasTexture(c); t.anisotropy = 4; const m = new THREE.MeshBasicMaterial({ map: t });
    return { mat: m, quad(i, w, h) { const geo = new THREE.PlaneGeometry(w, h), uv = geo.attributes.uv, u0 = (i % cols) / cols, v1 = 1 - Math.floor(i / cols) / rows;
      for (let k = 0; k < uv.count; k++) uv.setXY(k, u0 + uv.getX(k) / cols, v1 - (1 - uv.getY(k)) / rows); return new THREE.Mesh(geo, m); } };
  }
  const SIGNS = ["TV & HOME THEATER", "PHONES & TABLETS", "LAPTOPS & PCs", "KITCHEN ESSENTIALS", "HOME APPLIANCES", "AUDIO & KARAOKE", "CASHIER", "WARRANTY & REPAIR", "VERSE ELECTRONICS", "SALE", "BIG SALE -30%", "0% INSTALLMENT", "FREE DELIVERY", "NEW ARRIVALS", "BEST PRICE", "SMART HOME"];
  function signDraw(x, i, w, h) {   // biển xanh lá đậm chữ vàng (mục 8, 9, 10… là nhãn khuyến mãi đỏ / vàng)
    const promo = i >= 9, bg = i === 9 ? "#d62f2f" : i === 10 ? "#d62f2f" : promo ? "#ffd21f" : "#136b2b", fg = (i === 9 || i === 10) ? "#ffe45c" : promo ? "#136b2b" : "#ffd21f";
    x.fillStyle = bg; x.fillRect(0, 0, w, h); x.fillStyle = fg; x.fillRect(0, 0, w, 7); x.fillRect(0, h - 7, w, 7); x.strokeStyle = fg; x.lineWidth = 3; x.strokeRect(14, 14, w - 28, h - 28);
    x.fillStyle = fg; x.textAlign = "center"; x.textBaseline = "middle"; let f = 66; do { x.font = "bold " + f + "px system-ui, sans-serif"; f -= 3; } while (x.measureText(SIGNS[i] || "").width > w - 60); x.fillText(SIGNS[i] || "", w / 2, h / 2 + 3);
  }
  function scrDraw(x, i, w, h) {   // hình trên màn hình: hoàng hôn, sóng, sân bóng, thành phố, không gian, đại dương, test màu…
    const g = x.createLinearGradient(0, 0, 0, h); const k = i % 8, P = [["#ff8a3d", "#5b2a86"], ["#2bb0ed", "#0b2a5a"], ["#3aa655", "#1b5e2e"], ["#1b1f3a", "#4b2a7a"], ["#06142e", "#1a0b3a"], ["#2ec4b6", "#0b4a6a"], ["#ffd166", "#ef476f"], ["#a1c4fd", "#c2e9fb"]][k];
    g.addColorStop(0, P[0]); g.addColorStop(1, P[1]); x.fillStyle = g; x.fillRect(0, 0, w, h);
    if (k === 0) { x.fillStyle = "#ffe08a"; x.beginPath(); x.arc(w * 0.5, h * 0.62, h * 0.2, 0, 7); x.fill(); x.fillStyle = "#2a1747"; x.beginPath(); x.moveTo(0, h); x.lineTo(w * 0.3, h * 0.65); x.lineTo(w * 0.6, h * 0.9); x.lineTo(w * 0.85, h * 0.7); x.lineTo(w, h); x.fill(); }
    if (k === 1) { x.strokeStyle = "rgba(255,255,255,0.7)"; x.lineWidth = 4; for (let j = 0; j < 5; j++) { x.beginPath(); x.moveTo(0, h * (0.4 + j * 0.12)); x.bezierCurveTo(w * 0.3, h * (0.2 + j * 0.12), w * 0.6, h * (0.7 + j * 0.12), w, h * (0.4 + j * 0.12)); x.stroke(); } }
    if (k === 2) { x.strokeStyle = "#fff"; x.lineWidth = 3; x.strokeRect(10, 10, w - 20, h - 20); x.beginPath(); x.moveTo(w / 2, 10); x.lineTo(w / 2, h - 10); x.stroke(); x.beginPath(); x.arc(w / 2, h / 2, h * 0.16, 0, 7); x.stroke(); }
    if (k === 3) { x.fillStyle = "#0d0f24"; for (let j = 0; j < 9; j++) { const bh = h * (0.25 + ((j * 37) % 5) * 0.1); x.fillRect(j * w / 9, h - bh, w / 9 - 4, bh); } x.fillStyle = "#ffd166"; for (let j = 0; j < 30; j++) x.fillRect((j * 53) % w, h * 0.4 + (j * 29) % (h * 0.55), 4, 4); }
    if (k === 4) { x.fillStyle = "#fff"; for (let j = 0; j < 40; j++) x.fillRect((j * 71) % w, (j * 43) % h, 2, 2); x.fillStyle = "#ff7ab6"; x.beginPath(); x.arc(w * 0.7, h * 0.35, h * 0.18, 0, 7); x.fill(); }
    if (k === 5) { x.fillStyle = "#ffffff"; for (let j = 0; j < 6; j++) { x.beginPath(); x.ellipse(w * (0.1 + j * 0.16), h * (0.3 + (j % 3) * 0.2), 14, 6, 0, 0, 7); x.fill(); } }
    if (k === 6) { ["#e63946", "#f4a261", "#2a9d8f", "#264653", "#e9c46a", "#8ecae6"].forEach((c, j) => { x.fillStyle = c; x.fillRect(j * w / 6, h * 0.5, w / 6, h * 0.5); }); }
    if (k === 7) { x.fillStyle = "#fff"; x.beginPath(); x.arc(w * 0.3, h * 0.4, h * 0.12, 0, 7); x.arc(w * 0.42, h * 0.38, h * 0.16, 0, 7); x.arc(w * 0.56, h * 0.4, h * 0.12, 0, 7); x.fill(); x.fillStyle = "#6bbf59"; x.fillRect(0, h * 0.8, w, h * 0.2); }
  }
  function ceilTex(W, D) {   // trần trắng ô 0,6 m + đèn tuýp dài
    return skin(W, D, 8, (x) => { x.fillStyle = "#f6f8f7"; x.fillRect(0, 0, W, D); x.fillStyle = "#dfe4e2"; for (let X = 0; X < W; X += 0.6) x.fillRect(X, 0, 0.025, D); for (let Y = 0; Y < D; Y += 0.6) x.fillRect(0, Y, W, 0.025);
      for (let X = 3; X < W - 1; X += 6) for (let Y = 2.5; Y < D - 1; Y += 4.2) { x.fillStyle = "#c9d0cd"; x.fillRect(X - 1.5, Y - 0.2, 3, 0.4); x.fillStyle = "#ffffff"; x.fillRect(X - 1.4, Y - 0.12, 2.8, 0.24); x.fillStyle = "#fffbe0"; x.fillRect(X - 1.3, Y - 0.06, 2.6, 0.12); } });
  }
  function hallFloor(W, D) {   // gạch trắng bóng 2 m, vệt phản chiếu, lối giữa viền xanh, nền nhạt từng ngành
    return skin(W, D, 10, (x) => {
      x.fillStyle = "#929d9a"; x.fillRect(0, 0, W, D); const gr = x.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, "rgba(120,150,170,0.14)"); gr.addColorStop(0.5, "rgba(255,255,255,0.12)"); gr.addColorStop(1, "rgba(120,150,170,0.14)"); x.fillStyle = gr; x.fillRect(0, 0, W, D);
      x.fillStyle = "#6f7b78"; for (let X = 0; X < W; X += 2) x.fillRect(X, 0, 0.03, D); for (let Y = 0; Y < D; Y += 2) x.fillRect(0, Y, W, 0.03);
      const patch = (x0, x1, z0, z1, c) => { x.fillStyle = c; x.fillRect(W / 2 + x0, D / 2 + z0, x1 - x0, z1 - z0); };
      patch(4.5, 19.5, -26.5, -18.3, "#8a97a6"); patch(-19.5, -4.5, 4.5, 12.5, "#86a2b2"); patch(-19.5, -4.5, -7, 2.5, "#9496b0"); patch(-19.5, -4.5, -26.5, -13.5, "#a692a8"); patch(4.5, 19.5, 5, 16.5, "#a99f85"); patch(4.5, 19.5, -12, -1, "#86a692");
      patch(4.5, 19.5, 19.5, 26, "#88a88f"); patch(-19.5, -4.5, 19.5, 26, "#88a88f");
      x.fillStyle = "#1f8f3c"; x.fillRect(W / 2 - 2.5, 0, 0.14, D); x.fillRect(W / 2 + 2.36, 0, 0.14, D); x.fillStyle = "#ffd21f"; for (let Y = 0; Y < D; Y += 1.2) x.fillRect(W / 2 - 0.05, Y, 0.1, 0.6);
      x.fillStyle = "#1f8f3c"; x.fillRect(W / 2 - 2.5, D - 4, 5, 0.1);
    });
  }
  function hallWall(W, D, kind, len, h) {   // chân tường xanh lá, thân trắng, dải xanh + vàng trên cao
    return skin(len, h, 14, (x, w, hh) => {
      const Y = (m) => hh - m;
      x.fillStyle = "#f2f5f4"; x.fillRect(0, 0, w, hh); x.fillStyle = "#e1e7e4"; for (let X = 0; X < w; X += 3) x.fillRect(X, Y(7), 0.04, 6);
      x.fillStyle = "#1f8f3c"; x.fillRect(0, Y(1.1), w, 1.1); x.fillStyle = "#ffd21f"; x.fillRect(0, Y(1.15), w, 0.1);
      x.fillStyle = "#1f8f3c"; x.fillRect(0, Y(7.4), w, 0.45); x.fillStyle = "#ffd21f"; x.fillRect(0, Y(7.0), w, 0.08); x.fillStyle = "#dfe7e3"; x.fillRect(0, 0, w, Y(7.4));
      x.fillStyle = "#ffffff"; for (let X = 1.5; X < w; X += 5) x.fillRect(X, 0.6, 2.4, 0.18);
    });
  }
  function logoTex(w, h) { return skin(w, h, 60, (x) => { x.fillStyle = "#136b2b"; x.fillRect(0, 0, w, h); x.fillStyle = "#ffd21f"; x.fillRect(0, 0, w, 0.16); x.fillRect(0, h - 0.16, w, 0.16); x.textAlign = "center"; x.textBaseline = "middle";
      signText(x, "VERSE ELECTRONICS", w / 2 + 0.5, h * 0.44, w - 2.4, 1.0, "#ffd21f"); signText(x, "TV · PHONES · COMPUTERS · HOME APPLIANCES", w / 2 + 0.5, h * 0.82, w - 2.4, 0.3, "#ffffff");
      x.fillStyle = "#ffd21f"; x.beginPath(); x.arc(0.95, h / 2, 0.55, 0, 7); x.fill(); signText(x, "V", 0.95, h / 2 + 0.03, 0.7, 0.8, "#136b2b"); }); }

  function furnishElec(P, g, cx, cz, W, D, fur) {
    const H = (P.size || {}).h || 10, S = P.room.solids, FR = D / 2, BK = -D / 2, LW = -W / 2, RW = W / 2;
    const flat = (m) => { m.userData.flat = true; return m; };
    const sol = (x, z, hw, hd) => S.push({ x: cx + x, z: cz + z, hw, hd });
    const B = (w, h, d, c, x, y, z) => lb(g, w, h, d, c, cx + x, y, cz + z);
    const C = (r, h, c, x, y, z, seg) => lc(g, r, r, h, c, cx + x, y, cz + z, seg || 14);
    const Sp = (r, c, x, y, z, sx, sy, sz) => { const m = new THREE.Mesh(SPH, typeof c === "number" ? mat(c) : c); m.scale.set(r * (sx || 1), r * (sy || 1), r * (sz || 1)); m.position.set(cx + x, y, cz + z); g.add(m); return m; };
    const G = (x, z, ry, y0) => { const o = new THREE.Group(); o.position.set(cx + x, y0 || 0, cz + z); o.rotation.y = ry || 0; g.add(o);   // đồ trong hệ toạ độ riêng (mặt trước = +z)
      o.b = (w, h, d, c, x2, y, z2) => lb(o, w, h, d, c, x2, y, z2); o.c = (r, h, c, x2, y, z2, seg) => lc(o, r, r, h, c, x2, y, z2, seg || 14); o.t = (rt, rb, h, c, x2, y, z2, seg) => lc(o, rt, rb, h, c, x2, y, z2, seg || 14);
      o.s = (r, c, x2, y, z2, sx, sy, sz) => { const m = new THREE.Mesh(SPH, typeof c === "number" ? mat(c) : c); m.scale.set(r * (sx || 1), r * (sy || 1), r * (sz || 1)); m.position.set(x2, y, z2); o.add(m); return m; };
      o.scr = (i, w, h, x2, y, z2, rx) => { const m = SC.quad(i, w, h); m.position.set(x2, y, z2); if (rx) m.rotation.x = rx; flat(m); o.add(m); return m; }; return o; };
    // ---- sàn, trần, tường (tự dựng: customWalls) ----
    g.children[0].material = new THREE.MeshLambertMaterial({ map: hallFloor(W, D) });
    { const m = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshBasicMaterial({ map: ceilTex(W, D), side: THREE.DoubleSide })); m.rotation.x = Math.PI / 2; m.position.set(cx, H - 0.02, cz); flat(m); g.add(m); }
    [["back", 0, BK, 0, W], ["front", 0, FR, Math.PI, W], ["left", LW, 0, Math.PI / 2, D], ["right", RW, 0, -Math.PI / 2, D]].forEach(([k, x, z, ry, len]) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(len, H), new THREE.MeshLambertMaterial({ map: hallWall(W, D, k, len, H) })); m.position.set(cx + x, H / 2, cz + z); m.rotation.y = ry; flat(m); g.add(m); });
    const SG = atlas(2, 8, 512, 128, signDraw), SC = atlas(4, 4, 256, 144, scrDraw);
    const sign = (i, w, x, y, z, ry) => { const m = SG.quad(i, w, w / 4); m.position.set(cx + x, y, cz + z); m.rotation.y = ry || 0; flat(m); g.add(m); return m; };
    const hang = (i, x, z, y, w) => { const ww = w || 4.4; sign(i, ww, x, y, z, 0); sign(i, ww, x, y, z - 0.03, Math.PI); [-1, 1].forEach(d => C(0.012, H - y, K.dgrey, x + d * (ww / 2 - 0.4), (H + y) / 2, z - 0.015, 5)); };
    const pennant = (i, x, y, z, ry) => { const m = SG.quad(i, 1.6, 0.4); m.position.set(cx + x, y, cz + z); m.rotation.y = ry || 0; flat(m); g.add(m); };
    { const lg = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.6), new THREE.MeshBasicMaterial({ map: logoTex(10, 1.6) })); lg.position.set(cx, 6.0, cz + BK + 0.04); flat(lg); g.add(lg); }
    // cửa kính + biển ở tường trước
    B(3.2, 3.4, 0.12, K.dgreen, 0, 1.7, FR - 0.08); B(2.8, 3.0, 0.05, glassM(), 0, 1.6, FR - 0.13); B(0.06, 3.0, 0.06, K.silver, 0, 1.6, FR - 0.17); B(0.05, 0.9, 0.08, K.steel, -0.3, 1.5, FR - 0.19); B(0.05, 0.9, 0.08, K.steel, 0.3, 1.5, FR - 0.19);
    sign(8, 4, 0, 4.4, FR - 0.04, Math.PI); sign(12, 2.4, -6.0, 3.6, FR - 0.04, Math.PI); sign(11, 2.4, 6.0, 3.6, FR - 0.04, Math.PI);
    // ==== chung ====
    const tbl = (x, z, w, d, h, topC, ry) => { const o = G(x, z, ry || 0); o.b(w, 0.06, d, topC || K.white, 0, h, 0); o.b(w - 0.1, h - 0.1, d - 0.1, K.grey, 0, (h - 0.06) / 2, 0); o.b(w + 0.04, 0.06, d + 0.04, K.green, 0, 0.12, 0); o.b(w, 0.03, 0.03, K.yellow, 0, h - 0.03, d / 2); const sw = Math.abs(Math.sin(ry || 0)) > 0.7; sol(x, z, (sw ? d : w) / 2, (sw ? w : d) / 2); return o; };
    const tag = (o, x, y, z, c) => { o.b(0.1, 0.07, 0.01, c || K.yellow, x, y, z); };
    const rack = (x, z, ry, len, h, shelves, cols) => { const o = G(x, z, ry); o.b(len, h, 0.1, K.dgrey, 0, h / 2, -0.25); o.b(0.05, h, 0.5, K.white, -len / 2, h / 2, 0); o.b(0.05, h, 0.5, K.white, len / 2, h / 2, 0);
      for (let s = 0; s < shelves; s++) { const y = 0.3 + s * (h - 0.4) / (shelves - 1); o.b(len, 0.04, 0.5, K.white, 0, y, 0); o.b(len, 0.04, 0.02, K.yellow, 0, y + 0.02, 0.26);
        for (let i = 0; i < Math.floor(len / 0.34); i++) o.b(0.28, 0.22 + ((i + s) % 3) * 0.05, 0.34, cols[(i + s * 2) % cols.length], -len / 2 + 0.25 + i * 0.34, y + 0.14, 0); }
      const sw = Math.abs(Math.sin(ry || 0)) > 0.7; sol(x, z, (sw ? 0.3 : len / 2), (sw ? len / 2 : 0.3)); return o; };
    // ---- món nhỏ trên bàn (toạ độ riêng của bàn o) ----
    const phone = (o, x, y, z, c, sc) => { o.b(0.1, 0.02, 0.1, K.silver, x, y + 0.01, z - 0.02); const p = o.b(0.07, 0.15, 0.008, c, x, y + 0.1, z - 0.04); p.rotation.x = -0.28; const s = o.b(0.062, 0.138, 0.003, BM(sc || 0x66b8ff), x, y + 0.1, z - 0.033); s.rotation.x = -0.28; };
    const tablet = (o, x, y, z, c) => { o.b(0.14, 0.03, 0.1, K.silver, x, y + 0.015, z - 0.04); const p = o.b(0.27, 0.19, 0.012, c || K.dgrey, x, y + 0.15, z - 0.07); p.rotation.x = -0.25; o.scr(Math.floor(x * 7 + 16) % 8, 0.25, 0.17, x, y + 0.15, z - 0.062, -0.25); };
    const watch = (o, x, y, z, c) => { o.c(0.03, 0.03, K.black, x, y + 0.03, z, 12).rotation.x = Math.PI / 2; o.b(0.025, 0.12, 0.012, c, x, y + 0.03, z).position.y = y + 0.03; o.c(0.02, 0.004, BM(0x66ccff), x, y + 0.047, z, 12).rotation.x = Math.PI / 2; };
    const laptop = (o, x, y, z, ry, c) => { const l = new THREE.Group(); l.position.set(x, y, z); l.rotation.y = ry || 0; o.add(l); lb(l, 0.36, 0.015, 0.25, c || K.silver, 0, 0.0075, 0); const s = lb(l, 0.36, 0.23, 0.01, K.dgrey, 0, 0.125, -0.12); s.rotation.x = -0.3; const q = SC.quad(Math.floor((x * 5 + z * 3 + 40)) % 8, 0.33, 0.2); q.position.set(0, 0.125, -0.113); q.rotation.x = -0.3; flat(q); l.add(q); lb(l, 0.3, 0.004, 0.1, K.black, 0, 0.017, 0.04); };
    const monitor = (o, x, y, z, w) => { const m = w || 0.55; o.b(m, m * 0.58, 0.025, K.black, x, y + m * 0.6, z); o.scr(Math.floor(x * 3 + 20) % 8, m - 0.04, m * 0.58 - 0.04, x, y + m * 0.6, z + 0.015); o.b(0.05, 0.2, 0.04, K.dgrey, x, y + 0.2, z - 0.02); o.b(0.22, 0.015, 0.16, K.dgrey, x, y + 0.01, z); };
    const kbd = (o, x, y, z) => { o.b(0.38, 0.012, 0.12, K.black, x, y + 0.006, z); o.b(0.34, 0.004, 0.08, K.dgrey, x, y + 0.014, z); o.s(0.03, K.black, x + 0.3, y + 0.02, z, 1, 0.5, 1.4); };
    const printer = (o, x, y, z) => { o.b(0.44, 0.18, 0.34, K.white, x, y + 0.09, z); o.b(0.3, 0.015, 0.2, K.grey, x, y + 0.2, z - 0.02); o.b(0.32, 0.015, 0.1, K.white, x, y + 0.04, z + 0.2); o.b(0.1, 0.03, 0.02, BM(0x59c36a), x + 0.12, y + 0.15, z + 0.18); };
    const tower = (o, x, y, z) => { o.b(0.22, 0.46, 0.46, K.black, x, y + 0.23, z); o.b(0.01, 0.3, 0.3, BM(0x44ddff), x + 0.115, y + 0.24, z); o.c(0.025, 0.01, BM(0x44ff88), x, y + 0.38, z + 0.235, 8).rotation.x = Math.PI / 2; };
    const router = (o, x, y, z) => { o.b(0.22, 0.04, 0.16, K.white, x, y + 0.02, z); [-0.07, 0.07].forEach(d => { const a = o.b(0.012, 0.18, 0.012, K.white, x + d, y + 0.12, z - 0.06); a.rotation.z = d * 1.5; }); o.b(0.1, 0.004, 0.02, BM(0x44ff88), x, y + 0.042, z + 0.05); };
    const usb = (o, x, y, z, c) => { o.b(0.025, 0.07, 0.01, c || K.red, x, y + 0.04, z); o.b(0.015, 0.02, 0.006, K.silver, x, y + 0.085, z); };
    const cooker = (o, x, y, z, c) => { o.c(0.15, 0.2, c || K.white, x, y + 0.1, z, 16); o.s(0.15, c || K.white, x, y + 0.2, z, 1, 0.55, 1); o.c(0.03, 0.02, K.red, x, y + 0.3, z, 8); o.b(0.1, 0.05, 0.02, K.dgrey, x, y + 0.1, z + 0.15); };
    const micro = (o, x, y, z, c) => { o.b(0.5, 0.3, 0.4, c || K.white, x, y + 0.15, z); o.b(0.3, 0.2, 0.01, K.black, x - 0.07, y + 0.15, z + 0.205); o.b(0.12, 0.22, 0.01, K.dgrey, x + 0.17, y + 0.15, z + 0.205); o.c(0.025, 0.012, K.silver, x + 0.17, y + 0.2, z + 0.215, 10).rotation.x = Math.PI / 2; };
    const blender = (o, x, y, z, c) => { o.b(0.15, 0.12, 0.15, c || K.black, x, y + 0.06, z); o.t(0.08, 0.055, 0.3, mat(0xcfe9f0, { transparent: true, opacity: 0.6 }), x, y + 0.27, z, 12); o.c(0.085, 0.03, c || K.black, x, y + 0.43, z, 12); o.c(0.015, 0.02, K.red, x, y + 0.46, z, 6); };
    const kettle = (o, x, y, z, c) => { o.t(0.08, 0.11, 0.24, c || K.steel, x, y + 0.12, z, 14); o.t(0.04, 0.08, 0.06, K.dgrey, x, y + 0.27, z, 12); o.b(0.02, 0.2, 0.06, K.black, x + 0.12, y + 0.14, z); o.b(0.05, 0.03, 0.03, K.steel, x - 0.1, y + 0.2, z); };
    const fryer = (o, x, y, z) => { o.b(0.3, 0.32, 0.34, K.black, x, y + 0.16, z); o.b(0.24, 0.1, 0.02, K.dgrey, x, y + 0.2, z + 0.175); o.b(0.1, 0.03, 0.04, K.silver, x, y + 0.27, z + 0.2); o.c(0.025, 0.012, K.orange, x + 0.1, y + 0.33, z + 0.1, 8); };
    const toaster = (o, x, y, z, c) => { o.b(0.3, 0.18, 0.16, c || K.red, x, y + 0.09, z); o.b(0.2, 0.01, 0.03, K.black, x, y + 0.185, z - 0.03); o.b(0.2, 0.01, 0.03, K.black, x, y + 0.185, z + 0.04); o.b(0.03, 0.05, 0.02, K.silver, x + 0.16, y + 0.1, z); };
    const coffee = (o, x, y, z) => { o.b(0.24, 0.36, 0.28, K.black, x, y + 0.18, z); o.b(0.2, 0.06, 0.14, K.dgrey, x, y + 0.34, z + 0.04); o.t(0.05, 0.06, 0.12, mat(0xcfe9f0, { transparent: true, opacity: 0.7 }), x, y + 0.09, z + 0.08, 10); o.b(0.1, 0.01, 0.12, K.silver, x, y + 0.01, z + 0.08); };
    const juicer = (o, x, y, z) => { o.b(0.18, 0.2, 0.18, K.green, x, y + 0.1, z); o.t(0.05, 0.1, 0.1, K.white, x, y + 0.25, z, 12); o.t(0.12, 0.09, 0.14, mat(0xd8f0ee, { transparent: true, opacity: 0.6 }), x + 0.05, y + 0.3, z - 0.05, 12); };
    const stove = (o, x, y, z) => { o.b(0.56, 0.06, 0.4, K.black, x, y + 0.03, z); [-0.14, 0.14].forEach(a => [-0.07, 0.07].forEach(b2 => o.c(0.07, 0.01, K.dgrey, x + a, y + 0.065, z + b2, 14))); [-0.2, 0, 0.2].forEach(a => o.c(0.015, 0.02, K.silver, x + a, y + 0.04, z + 0.2, 8).rotation.x = Math.PI / 2); };
    const mixer = (o, x, y, z) => { o.b(0.06, 0.18, 0.08, K.white, x, y + 0.09, z); o.b(0.1, 0.05, 0.12, K.white, x, y + 0.2, z + 0.02); [-0.025, 0.025].forEach(a => o.b(0.008, 0.1, 0.008, K.steel, x + a, y + 0.1, z + 0.08)); };
    const sandwich = (o, x, y, z) => { o.b(0.28, 0.04, 0.26, K.black, x, y + 0.02, z); const l = o.b(0.28, 0.04, 0.26, K.dgrey, x, y + 0.09, z - 0.04); l.rotation.x = 0.35; };
    const speaker = (o, x, y, z, h, c) => { o.b(0.26, h, 0.26, c || K.black, x, y + h / 2, z); o.c(0.09, 0.01, K.dgrey, x, y + h * 0.7, z + 0.135, 14).rotation.x = Math.PI / 2; o.c(0.05, 0.01, K.silver, x, y + h * 0.7, z + 0.14, 12).rotation.x = Math.PI / 2; o.c(0.07, 0.01, K.dgrey, x, y + h * 0.28, z + 0.135, 14).rotation.x = Math.PI / 2; };
    const headphones = (o, x, y, z, c, ry) => { const h = new THREE.Group(); h.position.set(x, y, z); h.rotation.y = ry || 0; o.add(h); const t = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.012, 6, 14, Math.PI), mat(c)); t.position.y = 0.03; h.add(t); [-0.09, 0.09].forEach(a => { const e = lc(h, 0.04, 0.04, 0.035, c === K.black ? K.dgrey : K.black, a, 0.025, 0, 10); e.rotation.z = Math.PI / 2; }); };
    const mic = (o, x, y, z, c) => { o.c(0.015, 0.2, K.black, x, y + 0.1, z, 8); o.s(0.04, K.silver, x, y + 0.22, z); o.c(0.017, 0.04, c || K.red, x, y + 0.14, z, 8); };

    // ==== TV: nền nhạt (4.5..19.5, -26.5..-18.3) – tường TV nhiều cỡ + bàn trưng bày ====
    const TVS = [[5.5, 2.0, 1.45, 0.85], [8.3, 2.0, 1.7, 1.0], [11.6, 2.1, 1.95, 1.15], [14.6, 2.0, 1.25, 0.75], [17.0, 1.9, 1.0, 0.6], [18.9, 1.7, 0.7, 0.42], [8.0, 3.7, 2.3, 1.35], [11.6, 3.7, 1.45, 0.85], [14.6, 3.7, 1.75, 1.0], [17.5, 3.6, 1.2, 0.7]];
    B(15.4, 5.0, 0.1, K.dgrey, 12.0, 2.5, BK + 0.07);
    TVS.forEach(([x, y, w, h], i) => { B(w + 0.1, h + 0.1, 0.06, K.black, x, y, BK + 0.15); const s = SC.quad(i + 3, w, h); s.position.set(cx + x, y, cz + BK + 0.185); flat(s); g.add(s); B(w * 0.4, 0.05, 0.03, K.silver, x, y - h / 2 - 0.12, BK + 0.14); });
    B(15.2, 0.05, 0.05, BM(0x6cf0a0), 12.0, 0.9, BK + 0.12).userData.flat = true;
    [[7.0, "a"], [12.0, "b"], [17.0, "c"]].forEach(([x, k]) => { const t = tbl(x, -21.5, 3.2, 0.9, 0.8, K.white, 0);
      if (k === "a") { t.b(0.07, 0.4, 0.07, K.dgrey, -0.7, 1.0, 0); t.b(0.5, 0.03, 0.2, K.dgrey, -0.7, 0.835, 0); t.b(1.0, 0.58, 0.04, K.black, -0.7, 1.35, 0); t.scr(2, 0.94, 0.52, -0.7, 1.35, 0.025); t.b(1.0, 0.07, 0.1, K.black, 0.6, 0.865, 0.1); t.b(0.9, 0.01, 0.02, BM(0x44ddff), 0.6, 0.9, 0.152); }
      if (k === "b") { t.b(0.28, 0.07, 0.24, K.white, -0.8, 0.865, 0); t.b(0.28, 0.07, 0.02, K.black, -0.8, 0.885, 0.13); t.b(0.12, 0.03, 0.06, K.black, 0.2, 0.845, 0.1); t.b(0.04, 0.03, 0.02, K.red, 0.2, 0.862, 0.14); t.b(0.3, 0.12, 0.2, K.white, 1.0, 0.89, 0); t.c(0.05, 0.02, K.dgrey, 1.0, 0.9, 0.11, 10).rotation.x = Math.PI / 2; }
      if (k === "c") { t.b(0.07, 0.3, 0.07, K.dgrey, -0.7, 0.95, 0); t.b(0.5, 0.03, 0.2, K.dgrey, -0.7, 0.835, 0); t.b(0.75, 0.45, 0.04, K.black, -0.7, 1.2, 0); t.scr(6, 0.7, 0.4, -0.7, 1.2, 0.025); t.b(0.2, 0.04, 0.2, K.black, 0.7, 0.84, 0); t.b(0.5, 0.2, 0.34, K.white, 1.2, 1.0, 0); tag(t, 0.3, 0.84, 0.46, K.red); } });
    { const s = G(7.6, -18.9, 0); s.b(2.6, 0.45, 0.95, K.navy, 0, 0.3, 0); s.b(2.6, 0.55, 0.22, K.navy, 0, 0.7, -0.4); [-1, 1].forEach(d => s.b(0.2, 0.55, 0.95, K.navy, d * 1.2, 0.5, 0)); [-0.6, 0.6].forEach(d => s.b(1.0, 0.18, 0.7, 0x35507a, d, 0.5, 0.05)); sol(7.6, -18.9, 1.3, 0.5); B(3.2, 0.02, 2.0, 0xb7c4d4, 7.6, 0.012, -17.9); }
    // ==== PHONES: nền nhạt (-19.5..-4.5, 4.5..12.5) – 2 bàn + kệ tường ====
    { const a = tbl(-11.5, 6.4, 5.2, 1.0, 0.85, K.white, 0), cs = [K.black, K.red, K.blue, K.pink, K.green, K.silver]; for (let i = 0; i < 6; i++) phone(a, -2.2 + i * 0.52, 0.88, 0, cs[i], [0x66b8ff, 0xffb347, 0x7ee081][i % 3]); tablet(a, 1.2, 0.88, 0.3, K.dgrey); tablet(a, 1.8, 0.88, 0.3, K.silver); tablet(a, 2.2, 0.88, -0.1, K.black); tag(a, -2.2, 0.9, 0.42); tag(a, 0.0, 0.9, 0.42, K.red); }
    { const b = tbl(-11.5, 10.6, 5.2, 1.0, 0.85, K.white, 0); [K.black, K.pink, K.blue, K.orange].forEach((c, i) => watch(b, -2.2 + i * 0.32, 0.88, 0.1, c)); [0, 1, 2].forEach(i => { b.b(0.1, 0.02, 0.1, K.white, -0.7 + i * 0.25, 0.9, 0.2); b.c(0.004, 0.2, K.white, -0.7 + i * 0.25, 0.9, 0.05, 4).rotation.x = 1.2; });
      [0, 1, 2].forEach(i => { b.b(0.07, 0.14, 0.025, [K.white, K.black, K.blue][i], 0.5 + i * 0.12, 0.96, 0.2); }); b.b(0.1, 0.08, 0.1, K.white, 1.3, 0.92, 0.1); b.c(0.03, 0.02, K.white, 1.6, 0.9, 0.1, 10); b.c(0.03, 0.02, K.black, 1.7, 0.9, 0.1, 10); [0, 1, 2, 3].forEach(i => b.b(0.1, 0.14, 0.01, [K.red, K.blue, K.green, K.orange][i], 2.0 + i * 0.12, 0.96, -0.05)); }
    rack(-19.5, 8.5, Math.PI / 2, 8.0, 2.5, 5, [K.white, K.dgrey, K.blue, K.black, K.silver, K.pink]); sign(1, 3.2, -19.85, 3.4, 8.5, Math.PI / 2); sign(13, 1.6, -19.85, 3.4, 5.8, Math.PI / 2); sign(14, 1.6, -19.85, 3.4, 11.2, Math.PI / 2);
    // ==== COMPUTERS: nền nhạt (-19.5..-4.5, -7..2.5) – 2 bàn laptop + kệ máy in / màn hình ====
    { const a = tbl(-11.5, -4.7, 5.4, 1.0, 0.85, K.white, 0); [0, 1, 2, 3].forEach(i => laptop(a, -1.9 + i * 1.05, 0.88, 0.0, 0, [K.silver, K.dgrey, K.silver, K.black][i])); kbd(a, 2.3, 0.88, 0.25); a.c(0.03, 0.03, K.white, 2.4, 0.9, -0.2, 10); router(a, 2.1, 0.88, -0.3); usb(a, 1.7, 0.88, 0.3); usb(a, 1.8, 0.88, 0.3, K.blue); tag(a, -1.9, 0.9, 0.42); tag(a, 1.15, 0.9, 0.42, K.red); }
    { const b = tbl(-11.5, -0.2, 5.4, 1.0, 0.85, K.white, 0); monitor(b, -1.9, 0.88, 0.0, 0.62); monitor(b, -0.8, 0.88, 0.0, 0.5); tower(b, 0.5, 0.88, 0.1); tower(b, 1.1, 0.88, 0.1); kbd(b, -1.9, 0.88, 0.3); b.c(0.03, 0.02, K.black, -1.45, 0.9, 0.32, 10); b.s(0.025, K.black, 2.1, 0.9, 0.3); b.b(0.16, 0.05, 0.1, K.black, 2.2, 0.9, 0.0); tag(b, -1.9, 0.9, 0.42); tag(b, 0.8, 0.9, 0.42, K.red); }
    { const r = rack(-19.4, -2.2, Math.PI / 2, 9.0, 2.3, 4, [K.white, K.dgrey, K.silver, K.black]); [-3, -1.8, -0.6, 0.6, 1.8, 3.0].forEach(x => printer(r, x, 0.3, 0.02)); [-3.0, -1.2, 0.6, 2.4].forEach((x, i) => monitor(r, x, 0.9, 0.02, 0.42)); sign(2, 3.2, -19.85, 3.4, -2.2, Math.PI / 2); }
    // ==== AUDIO: nền nhạt (-19.5..-4.5, -26.5..-13.5) – buồng karaoke, tường tai nghe, loa tháp ====
    { const bo = G(-15.5, -22.5, 0); bo.b(6.2, 0.1, 6.2, K.dgrey, 0, 0.05, 0); bo.b(6.0, 0.02, 6.0, 0x6a3b86, 0, 0.11, 0);
      [[0, 3.05, 6.0, 0.06], [3.05, 0, 0.06, 6.0]].forEach(([x, z, w, d]) => { bo.b(w, 2.6, d, glassM(), x, 1.4, z); bo.b(w, 0.07, d, K.silver, x, 2.7, z); });
      bo.b(0.07, 2.7, 0.07, K.silver, 3.05, 1.35, 3.05); bo.b(0.07, 2.7, 0.07, K.silver, -3.05, 1.35, 3.05);
      bo.b(3.4, 1.0, 0.1, K.black, 0, 2.0, -2.9); bo.scr(6, 3.2, 0.9, 0, 2.0, -2.84); bo.b(0.5, 0.9, 0.4, K.black, -2.6, 0.55, -2.6); bo.b(0.5, 0.9, 0.4, K.black, 2.6, 0.55, -2.6); bo.c(0.15, 0.01, K.silver, -2.6, 0.9, -2.39, 14).rotation.x = Math.PI / 2; bo.c(0.15, 0.01, K.silver, 2.6, 0.9, -2.39, 14).rotation.x = Math.PI / 2;
      bo.b(1.6, 0.5, 0.6, 0x6a3b86, 0, 0.35, -1.0); bo.b(1.6, 0.4, 0.15, 0x6a3b86, 0, 0.8, -1.3); [-0.5, 0.5].forEach(a => { bo.c(0.02, 1.2, K.black, a, 0.6, 1.0, 6); bo.c(0.12, 0.03, K.black, a, 0.02, 1.0, 12); bo.s(0.05, K.silver, a, 1.3, 1.0); bo.c(0.02, 0.15, K.red, a, 1.2, 1.0, 8); });
      bo.b(1.2, 0.4, 0.5, K.black, 0, 0.3, 2.2); bo.b(1.0, 0.3, 0.02, BM(0xff5ad8), 0, 0.5, 2.46); bo.b(0.3, 0.02, 0.02, BM(0x44ddff), -0.3, 0.1, 2.46); sol(-15.5, -22.5, 3.15, 3.15); sign(5, 3.2, -15.5, 4.2, -25.7, 0); }
    { const w = G(-8.5, -26.8, 0); w.b(7.0, 2.6, 0.06, K.dgrey, 0, 1.6, 0.03); for (let r = 0; r < 4; r++) for (let i = 0; i < 12; i++) { w.b(0.012, 0.012, 0.1, K.steel, -3.2 + i * 0.58, 0.7 + r * 0.55, 0.1); const c = [K.black, K.red, K.blue, K.white, K.pink, K.green][(i + r * 2) % 6]; headphones(w, -3.2 + i * 0.58, 0.65 + r * 0.55, 0.14, c, 0); } w.b(7.0, 0.3, 0.1, K.green, 0, 3.1, 0.06); sign(5, 2.2, 0, 3.55, 0.07, 0); }
    [[-9.6, -15.6], [-8.0, -15.6], [-6.4, -15.6]].forEach(([x, z], i) => { const o = G(x, z, 0); o.b(0.7, 0.18, 0.7, K.white, 0, 0.09, 0); speaker(o, 0, 0.18, 0, 1.2 + i * 0.1, [K.black, 0x5b3a22, K.white][i]); sol(x, z, 0.38, 0.38); });
    { const t = tbl(-9.0, -20.8, 3.4, 0.9, 0.8, K.white, 0); t.b(1.0, 0.07, 0.1, K.black, -1.0, 0.865, 0.0); t.b(0.4, 0.14, 0.1, K.black, 0.1, 0.87, -0.05); [0.7, 1.1, 1.5].forEach((x, i) => { t.c(0.08, 0.2, [K.blue, K.red, K.green][i], x, 0.93, 0.05, 14).rotation.z = Math.PI / 2; });
      [-0.4, 0.0].forEach((x, i) => mic(t, x, 0.83, 0.2, [K.red, K.blue][i])); t.b(0.4, 0.05, 0.4, K.black, 0.55, 0.85, 0.0); t.c(0.15, 0.01, K.dgrey, 0.55, 0.88, 0.0, 16); [0.3, 0.7].forEach(x => { t.b(0.04, 0.025, 0.04, K.white, x, 0.84, 0.3); }); tag(t, 0.5, 0.84, 0.46, K.red); }
    // ==== KITCHEN: nền be nhạt (4.5..19.5, 5..16.5) – 2 bàn gia dụng nhỏ + kệ tường phải ====
    { const a = tbl(10.5, 8.0, 6.4, 1.0, 0.85, K.white, 0); cooker(a, -2.7, 0.88, 0, K.white); cooker(a, -2.1, 0.88, 0.05, K.red); blender(a, -1.4, 0.88, 0, K.black); blender(a, -0.9, 0.88, 0, K.red); kettle(a, -0.2, 0.88, 0, K.steel); kettle(a, 0.4, 0.88, 0, K.red); juicer(a, 1.1, 0.88, 0); toaster(a, 1.8, 0.88, 0, K.red); toaster(a, 2.3, 0.88, 0, K.silver); mixer(a, 2.8, 0.88, 0); tag(a, -2.4, 0.9, 0.44); tag(a, 0.0, 0.9, 0.44, K.red); tag(a, 2.0, 0.9, 0.44); }
    { const b = tbl(10.5, 12.2, 6.4, 1.0, 0.85, K.white, 0); micro(b, -2.5, 0.88, 0, K.white); micro(b, -1.6, 0.88, 0, K.steel); fryer(b, -0.7, 0.88, 0); fryer(b, -0.2, 0.88, 0.02); coffee(b, 0.6, 0.88, 0); coffee(b, 1.1, 0.88, 0); sandwich(b, 1.8, 0.88, 0); stove(b, 2.5, 0.88, 0); mixer(b, 2.95, 0.88, 0.2); tag(b, -2.1, 0.9, 0.44, K.red); tag(b, 0.4, 0.9, 0.44); tag(b, 2.2, 0.9, 0.44); }
    { const r = rack(19.4, 10.5, -Math.PI / 2, 10.0, 2.4, 4, [K.white, K.red, K.dgrey, K.silver, K.green]); [-4, -2.5, -1, 0.5, 2, 3.5].forEach((x, i) => { cooker(r, x, 1.25, 0.02, K.white); micro(r, x + 0.5, 0.3, 0.02, K.steel); fryer(r, x + 0.4, 0.9 + 0.0, 0.02); }); sign(3, 3.2, 19.85, 3.4, 10.5, -Math.PI / 2); }
    // ==== APPLIANCES: nền xanh nhạt (4.5..19.5, -12..-1) – tủ lạnh, máy giặt, máy lạnh, quạt ====
    const fridge = (x, z, ry, w, h, c, type) => { const o = G(x, z, ry); o.b(w, h, 0.75, c, 0, h / 2, 0); o.b(w - 0.04, 0.02, 0.02, K.dgrey, 0, h * 0.35, 0.385);
      if (type === "side") { o.b(0.02, h - 0.1, 0.02, K.dgrey, 0, h / 2, 0.385); o.b(0.03, 0.5, 0.04, K.silver, -0.04, h * 0.55, 0.4); o.b(0.03, 0.5, 0.04, K.silver, 0.04, h * 0.55, 0.4); o.b(0.18, 0.3, 0.01, BM(0x2a5a7a), -w * 0.25, h * 0.7, 0.386); }
      else if (type === "french") { o.b(w - 0.04, 0.02, 0.02, K.dgrey, 0, h * 0.7, 0.385); o.b(0.02, h * 0.3, 0.02, K.dgrey, 0, h * 0.85, 0.385); o.b(0.4, 0.03, 0.04, K.silver, 0, h * 0.5, 0.4); o.b(0.03, 0.3, 0.04, K.silver, -0.06, h * 0.82, 0.4); o.b(0.03, 0.3, 0.04, K.silver, 0.06, h * 0.82, 0.4); }
      else { o.b(0.03, 0.3, 0.04, K.silver, w * 0.3, h * 0.6, 0.4); o.b(0.4 * w, 0.03, 0.02, K.dgrey, 0, h * 0.7, 0.385); }
      const sw = Math.abs(Math.sin(ry || 0)) > 0.7; sol(x, z, sw ? 0.4 : w / 2, sw ? w / 2 : 0.4); return o; };
    fridge(19.3, -10.6, -Math.PI / 2, 0.95, 1.95, K.silver, "side"); fridge(19.3, -9.4, -Math.PI / 2, 0.85, 1.85, K.dgrey, "french"); fridge(19.3, -8.3, -Math.PI / 2, 0.8, 1.75, K.white, "french"); fridge(19.3, -7.2, -Math.PI / 2, 0.85, 1.9, 0xc4cfd4, "side"); fridge(19.3, -4.4, -Math.PI / 2, 0.6, 0.9, K.red, "mini"); fridge(19.3, -3.4, -Math.PI / 2, 0.6, 0.9, K.green, "mini");
    [-10.0, -7.6, -5.0].forEach(z => { const ac = G(19.9, z, -Math.PI / 2); ac.b(1.05, 0.3, 0.22, K.white, 0, 3.0, 0); ac.b(0.9, 0.04, 0.03, K.grey, 0, 2.9, 0.12); ac.b(0.12, 0.03, 0.01, BM(0x44ddff), 0.35, 3.08, 0.115); });
    sign(4, 3.2, 19.85, 4.0, -7.2, -Math.PI / 2);
    [8.0, 9.2, 10.4, 11.6].forEach((x, i) => { const w = G(x, -11.2, 0); w.b(0.6, 0.85, 0.62, i === 3 ? K.silver : K.white, 0, 0.43, 0); w.b(0.5, 0.1, 0.01, K.dgrey, 0, 0.75, 0.315); w.c(0.2, 0.02, K.dgrey, 0, 0.4, 0.315, 18).rotation.x = Math.PI / 2; w.c(0.17, 0.02, mat(0x66b8d0, { transparent: true, opacity: 0.8 }), 0, 0.4, 0.328, 18).rotation.x = Math.PI / 2; w.b(0.1, 0.04, 0.01, BM(0x44ff88), 0.18, 0.75, 0.32); sol(x, -11.2, 0.32, 0.34); });
    [13.5, 14.9].forEach((x, i) => { const f = G(x, -11.2, 0); f.c(0.26, 0.03, K.dgrey, 0, 0.02, 0, 16); f.c(0.03, 1.2, K.silver, 0, 0.62, 0, 8); f.s(0.12, K.dgrey, 0, 1.25, 0, 1, 1, 0.8); const cage = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.012, 5, 18), mat(K.silver)); cage.position.set(0, 1.25, 0.1); f.add(cage); const bl = f.c(0.2, 0.01, mat(0xdff0f6, { transparent: true, opacity: 0.55 }), 0, 1.25, 0.1, 18); bl.rotation.x = Math.PI / 2; sol(x, -11.2, 0.3, 0.3); });
    { const p = G(17.0, -11.2, 0); p.b(0.4, 1.1, 0.35, K.white, 0, 0.55, 0); p.b(0.3, 0.3, 0.01, K.blue, 0, 0.8, 0.18); p.b(0.04, 0.04, 0.06, K.red, -0.08, 0.5, 0.2); p.b(0.04, 0.04, 0.06, K.blue, 0.08, 0.5, 0.2); sol(17.0, -11.2, 0.25, 0.25); }
    { const t = G(9.5, -5.0, 0); t.c(0.8, 0.25, K.white, 0, 0.125, 0, 22); t.c(0.8, 0.03, K.green, 0, 0.26, 0, 22); t.c(0.17, 0.07, K.black, -0.3, 0.32, 0, 18); t.s(0.1, K.black, -0.3, 0.37, 0, 1, 0.6, 1); t.b(0.3, 0.7, 0.3, K.white, 0.35, 0.6, 0); t.b(0.2, 0.2, 0.01, K.silver, 0.35, 0.8, 0.16); sol(9.5, -5.0, 0.85, 0.85); }
    { const t = G(14.5, -5.0, 0); t.c(0.8, 0.25, K.white, 0, 0.125, 0, 22); t.c(0.8, 0.03, K.green, 0, 0.26, 0, 22); const wd = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.85, 0.6), mat(K.white)); wd.position.set(0.0, 0.7, 0); t.add(wd); t.c(0.17, 0.02, K.dgrey, 0, 0.7, 0.31, 16).rotation.x = Math.PI / 2; sol(14.5, -5.0, 0.85, 0.85); }
    // ==== CASHIER + WARRANTY (hàng trước) ====
    { const d = G(11.5, 23.2, 0); d.b(11.0, 0.95, 1.0, K.green, 0, 0.48, 0); d.b(11.2, 0.06, 1.1, K.white, 0, 0.98, 0); d.b(11.0, 0.15, 1.02, K.yellow, 0, 0.82, 0.0); d.b(11.0, 0.9, 0.04, K.dgreen, 0, 0.5, -0.52); sol(11.5, 23.2, 5.7, 0.58);
      [-3.5, 0, 3.5].forEach((x, i) => { d.b(0.42, 0.3, 0.03, K.black, x, 1.3, -0.1).rotation.x = -0.2; const q = SC.quad(i + 1, 0.38, 0.26); q.position.set(x, 1.3, -0.082); q.rotation.x = -0.2; flat(q); d.add(q); d.b(0.06, 0.18, 0.06, K.dgrey, x, 1.1, -0.1); d.b(0.2, 0.02, 0.14, K.dgrey, x, 1.015, -0.05); d.b(0.14, 0.03, 0.08, K.black, x + 0.4, 1.02, 0.15); d.b(0.12, 0.06, 0.12, K.white, x - 0.5, 1.04, 0.1); d.b(0.1, 0.1, 0.01, K.white, x - 0.5, 1.12, 0.2); d.b(0.2, 0.02, 0.2, BM(0xff4040), x + 0.8, 1.02, 0.15); d.b(0.04, 0.4, 0.04, K.dgrey, x + 1.2, 1.2, 0); sign(6, 1.2, x, 2.0, -0.45, 0); });
      for (let i = 0; i < 4; i++) { d.b(0.46, 0.02 + 0, 0.34, K.red, 5.9, 0.0 + 0.1 + i * 0.07, 0.15); } }
    { const d = G(-13.0, 23.2, 0); d.b(10.0, 0.95, 1.0, K.dgreen, 0, 0.48, 0); d.b(10.2, 0.06, 1.1, K.white, 0, 0.98, 0); d.b(10.0, 0.15, 1.02, K.yellow, 0, 0.82, 0); d.b(10.0, 1.3, 0.3, K.white, 0, 1.65, -0.9); sol(-13.0, 23.2, 5.1, 0.58);
      [-3.0, 0, 3.0].forEach(x => { d.b(0.5, 0.3, 0.03, K.black, x, 1.3, -0.1).rotation.x = -0.2; d.b(0.08, 0.18, 0.06, K.dgrey, x, 1.1, -0.1); d.b(0.3, 0.02, 0.2, K.dgrey, x, 1.015, -0.05); d.b(0.22, 0.012, 0.3, K.white, x + 0.6, 1.02, 0.1); d.b(0.02, 0.1, 0.02, K.dgrey, x + 0.6, 1.07, 0.2); });
      B(9.0, 2.4, 0.1, K.grey, -13.0, 1.3, 26.6); sign(7, 3.6, -13.0, 3.6, 26.9, Math.PI); [-3.5, -1.2, 1.4, 3.6].forEach((x, i) => { B(0.9, 0.7, 0.4, [K.white, K.dgrey, K.silver, K.blue][i], -13.0 + x, 1.0, 26.1); }); }
    [[4.3, 25.8], [4.3, 24.8]].forEach(([x, z]) => { const bk = G(x, z, 0); for (let i = 0; i < 5; i++) bk.t(0.28 - i * 0.0, 0.22, 0.2, [K.green, K.red][i % 2], 0, 0.1 + i * 0.12, 0, 14); sol(x, z, 0.32, 0.32); });
    // ==== biển treo trần ====
    hang(0, 12.0, -17.2, 4.8); hang(1, -12.0, 13.8, 4.6); hang(2, -12.0, 3.6, 4.6); hang(5, -12.0, -12.8, 4.6); hang(3, 12.0, 17.4, 4.6); hang(4, 12.0, -0.3, 4.6); hang(6, 11.5, 20.8, 4.4); hang(7, -13.0, 20.8, 4.4);
    [[-5.0, 5.2, 0], [5.0, 5.6, 0], [-5.0, -3.0, 0], [5.0, -4.5, 0], [-5.0, -15.0, 0], [5.0, 8.0, 0]].forEach(([x, y, z], i) => { [-0.4, 0.4].forEach(d => C(0.008, H - 5.6, K.dgrey, x + d * 2, (H + 5.6) / 2, z, 4)); pennant(9 + (i % 4), x, 5.6, z, 0); pennant(9 + (i % 4), x, 5.6, z - 0.03, Math.PI); });
    sign(10, 3.0, 0, 3.0, BK + 0.05, 0);

    // ---- chỗ bày từ vựng (toạ độ tuyệt đối) ----
    const A = (list) => list.map(([x, y, z, sx, sz]) => [cx + x, y, cz + z, cx + sx, cz + sz]);
    P.anchors = {
      tv: A([[5.5, 2.5, -26.5, 5.5, -24.3], [8.3, 2.6, -26.5, 8.3, -24.3], [11.6, 2.7, -26.5, 11.6, -24.3], [14.6, 2.4, -26.5, 14.6, -24.3], [17.0, 2.2, -26.5, 17.0, -24.3], [6.3, 1.2, -21.5, 6.3, -19.9], [12.0, 1.1, -21.5, 12.0, -19.9], [13.2, 1.05, -21.3, 13.2, -19.9], [17.0, 1.7, -21.5, 17.0, -19.9], [7.6, 1.0, -18.9, 9.4, -17.0]]),
      phones: A([[-13.3, 1.2, 6.4, -13.3, 8.5], [-10.3, 1.3, 6.5, -10.3, 8.5], [-11.5, 1.1, 10.6, -11.5, 8.5], [-9.8, 1.1, 10.8, -9.8, 8.5], [-10.4, 1.15, 10.7, -10.4, 8.5], [-12.7, 1.0, 10.6, -12.7, 8.5], [-19.6, 2.0, 6.0, -17.7, 6.0], [-19.6, 1.6, 9.5, -17.7, 9.5], [-8.9, 1.15, 10.7, -8.9, 8.5], [-19.6, 2.5, 11.0, -17.7, 11.0]]),
      computers: A([[-13.4, 1.25, -4.7, -13.4, -2.6], [-11.2, 1.2, -4.5, -11.2, -2.6], [-9.3, 1.1, -4.4, -9.3, -2.6], [-13.6, 1.5, -0.2, -13.6, -2.2], [-12.3, 1.3, -0.2, -12.3, -2.2], [-11.0, 1.2, -0.1, -11.0, -2.2], [-19.5, 0.9, -2.2, -17.6, -2.2], [-9.4, 1.0, -0.2, -9.4, -2.2], [-19.5, 1.6, 0.6, -17.6, 0.6], [-9.7, 1.1, -5.0, -9.7, -2.6]]),
      audio: A([[-8.0, 1.6, -15.6, -8.0, -13.9], [-8.5, 2.2, -26.6, -8.5, -24.5], [-12.4, 1.0, -20.8, -12.4, -18.9], [-9.4, 1.1, -20.8, -9.4, -18.9], [-8.0, 1.0, -20.8, -8.0, -18.9], [-15.5, 1.3, -21.0, -15.5, -18.6], [-15.5, 1.0, -24.7, -11.0, -24.5], [-6.4, 1.6, -15.6, -6.4, -13.9]]),
      kitchen: A([[7.8, 1.3, 8.0, 7.8, 10.1], [8.4, 1.3, 8.05, 8.4, 10.1], [9.1, 1.4, 8.0, 9.1, 10.1], [10.3, 1.3, 8.0, 10.3, 10.1], [11.0, 1.3, 8.0, 11.0, 10.1], [12.3, 1.3, 8.0, 12.3, 10.1], [8.0, 1.4, 12.2, 8.0, 10.1], [9.5, 1.3, 12.2, 9.5, 10.1], [11.1, 1.3, 12.2, 11.1, 10.1], [12.0, 1.2, 12.2, 12.0, 10.1], [13.0, 1.2, 12.2, 13.0, 10.1], [13.4, 1.1, 12.2, 13.8, 10.1]]),
      appliances: A([[19.3, 2.2, -10.6, 17.9, -9.2], [19.3, 2.1, -8.3, 17.5, -8.3], [8.0, 1.2, -11.2, 8.0, -9.6], [9.2, 1.2, -11.2, 9.2, -9.6], [19.9, 3.4, -7.6, 17.6, -7.6], [13.5, 1.8, -11.2, 13.5, -9.6], [14.9, 1.8, -11.2, 14.9, -9.6], [17.0, 1.5, -11.2, 17.0, -9.6], [9.2, 0.7, -5.0, 9.2, -3.3], [14.5, 1.3, -5.0, 14.5, -3.3]]),
      cashier: A([[8.0, 1.6, 23.2, 8.0, 21.5], [11.5, 1.6, 23.2, 11.5, 21.5], [12.0, 1.3, 23.4, 12.0, 21.5], [15.0, 1.3, 23.4, 15.0, 21.5], [4.3, 1.0, 25.4, 3.0, 24.6], [-13.0, 1.4, 23.2, -13.0, 21.5], [-9.4, 1.3, 23.3, -9.4, 21.5], [-16.0, 1.4, 23.2, -16.0, 21.5]])
    };
    P.vgroup = new THREE.Group(); g.add(P.vgroup);
  }
  INTERIORS["electrohall"] = { furnish: furnishElec, customWalls: true };
})();
