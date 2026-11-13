/* EnglishVerse – nội thất "furniture" (layout: "furnihall"). Mỗi nơi 1 file (xem docs/TEAM.md).
   HOME & COZY – showroom nội thất cao cấp, "tối tối có gu" (40 × 54 m, trần 10 m): tường xanh rêu đậm / xám than, sàn gỗ óc chó, trần đen,
   ray đèn rọi treo thấp; ánh sáng vàng ấm chỉ rọi vào từng phòng mẫu (quầng sáng trên sàn). KHÔNG bright. Toạ độ (x, z) tính từ giữa phòng, cửa ở z = +27.
   Phòng mẫu (bục nền khác màu + vách thấp):
     Cột trái  (x -19.5..-3.8): lighting (z 19.5..26.3) · living (z 3.4..15) · bedroom (z -6.3..0.8) · bathroom (z -26.3..-12.6)
     Cột phải  (x +3.8..+19.5): quầy bán hàng Omar (z 18.8..26.3) · dining (z 8.8..16.2) · kitchen (z -5..3.6) · study (z -12.5..-6.2) · outdoor (z -26.3..-16.8)
   Chừa trống: lối vào x -1.5..+1.5, z +18..+27; lối đi giữa x -2.5..+2.5 suốt phòng; chỗ NPC (-5,16) (9,6) (-9,-8) (8,-14) (bán kính 0,8 m). Mọi thứ đứng im.
   Khối tự dựng gộp theo chất liệu (mat()); đồ KayKit (fur) chỉ dùng vài món. Bảng chữ / tranh = 1 "atlas" ảnh dùng chung (1 lần vẽ). */
(function () {
  const K = { walnut: 0x5a3d2b, dwal: 0x33231a, oak: 0xb48a5a, light: 0xd8c3a0, char: 0x26282a, black: 0x151617, moss: 0x39463c, brass: 0xc9a24a, cream: 0xe6dccb, linen: 0xcfc4ae,
    teal: 0x2f5d5a, teal2: 0x3b7770, wine: 0x6e2e3a, tan: 0x9c6638, grey: 0x7b7d7e, mustard: 0xc9922e, rust: 0xa9532f, stone: 0xb9b3a6, white: 0xece7de, olive: 0x5d6b3f,
    leaf1: 0x2f6b3a, leaf2: 0x3f8a46, leaf3: 0x56a05a, rattan: 0xb0803f, steel: 0x9aa0a4, navy: 0x2c3e55 };
  const BMC = {}, BM = (c) => BMC[c] || (BMC[c] = new THREE.MeshBasicMaterial({ color: c }));   // chất liệu tự sáng (đèn, màn hình)
  const glassM = () => mat(0xbfd8e0, { transparent: true, opacity: 0.3, depthWrite: false });
  const SPH = new THREE.SphereGeometry(1, 12, 9);
  const rnd = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647;

  function atlas(cols, rows, cw, ch, draw) {   // nhiều ảnh nhỏ trong 1 ảnh to → mọi biển / tranh dùng chung 1 chất liệu = 1 lần vẽ
    const c = document.createElement("canvas"); c.width = cols * cw; c.height = rows * ch; const x = c.getContext("2d");
    for (let i = 0; i < cols * rows; i++) { x.save(); x.translate((i % cols) * cw, Math.floor(i / cols) * ch); x.beginPath(); x.rect(0, 0, cw, ch); x.clip(); draw(x, i, cw, ch); x.restore(); }
    const t = new THREE.CanvasTexture(c); t.anisotropy = 4; const m = new THREE.MeshBasicMaterial({ map: t });
    return { mat: m, quad(i, w, h) { const geo = new THREE.PlaneGeometry(w, h), uv = geo.attributes.uv, u0 = (i % cols) / cols, v1 = 1 - Math.floor(i / cols) / rows;
      for (let k = 0; k < uv.count; k++) uv.setXY(k, u0 + uv.getX(k) / cols, v1 - (1 - uv.getY(k)) / rows); return new THREE.Mesh(geo, m); } };
  }
  const SIGNS = ["LIVING ROOM", "BEDROOM", "DINING", "KITCHEN", "BATHROOM", "STUDY", "OUTDOOR LIVING", "LIGHTING", "HOME & COZY", "SALES & SERVICE", "BEST SELLERS", "NEW ARRIVALS", "SALE 30% OFF", "EXIT", "MADE WITH CARE", "WELCOME"];
  const ART_PAL = [["#c9a24a", "#2f5d5a", "#e6dccb", "#6e2e3a"], ["#d98a4a", "#26323a", "#efe2c8", "#8a9a6a"], ["#7fa39a", "#1f2a2e", "#e9d7b5", "#c9714a"], ["#bfa27a", "#3a2a22", "#f1e8d6", "#5d6b3f"]];
  function artDraw(x, i, w, h) {   // tranh trừu tượng: sóng, vòng tròn, vòm, núi…
    const P = ART_PAL[i % 4], R = rnd(11 + i * 7); x.fillStyle = P[2]; x.fillRect(0, 0, w, h);
    const k = Math.floor(i / 4);
    if (k === 0) { x.fillStyle = P[1]; x.beginPath(); x.arc(w * 0.5, h * 0.55, h * 0.34, 0, 7); x.fill(); x.fillStyle = P[0]; x.beginPath(); x.arc(w * 0.62, h * 0.4, h * 0.16, 0, 7); x.fill(); x.fillStyle = P[3]; x.fillRect(0, h * 0.82, w, h * 0.18); }
    else if (k === 1) { for (let j = 0; j < 5; j++) { x.fillStyle = P[j % 4]; x.beginPath(); x.moveTo(0, h * (0.45 + j * 0.11)); x.bezierCurveTo(w * 0.3, h * (0.25 + j * 0.11), w * 0.65, h * (0.75 + j * 0.11), w, h * (0.4 + j * 0.11)); x.lineTo(w, h); x.lineTo(0, h); x.fill(); } }
    else if (k === 2) { for (let j = 0; j < 3; j++) { x.fillStyle = P[j]; x.beginPath(); x.moveTo(w * (0.12 + j * 0.28), h); x.lineTo(w * (0.12 + j * 0.28), h * 0.45); x.arc(w * (0.26 + j * 0.28), h * 0.45, w * 0.14, Math.PI, 0); x.lineTo(w * (0.4 + j * 0.28), h); x.fill(); } }
    else { x.fillStyle = P[0]; x.beginPath(); x.moveTo(0, h); x.lineTo(w * 0.3, h * 0.35); x.lineTo(w * 0.55, h * 0.8); x.lineTo(w * 0.75, h * 0.5); x.lineTo(w, h); x.fill(); x.fillStyle = P[3]; x.beginPath(); x.arc(w * 0.78, h * 0.2, h * 0.1, 0, 7); x.fill(); x.fillStyle = P[1]; x.fillRect(0, h * 0.9, w, h * 0.1); }
  }
  function haloTex() { const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d"), gr = x.createRadialGradient(64, 64, 2, 64, 64, 62);
    gr.addColorStop(0, "rgba(255,186,96,0.34)"); gr.addColorStop(0.5, "rgba(255,170,80,0.15)"); gr.addColorStop(1, "rgba(255,160,70,0)"); x.fillStyle = gr; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); }

  function hallFloor(W, D) {   // sàn gỗ óc chó + lối đi giữa bằng bê tông mài, đường chỉ đồng
    return skin(W, D, 10, (x) => {
      const R = rnd(5); x.fillStyle = "#2f2118"; x.fillRect(0, 0, W, D);
      for (let j = 0; j < D / 0.3; j++) { let X = -R() * 2.4; while (X < W) { const L = 1.6 + R() * 1.4, v = 28 + R() * 14 | 0; x.fillStyle = "rgb(" + (v + 28) + "," + (v + 8) + "," + (v - 6) + ")"; x.fillRect(X, j * 0.3, L - 0.02, 0.28); X += L; } }
      x.fillStyle = "#34322f"; x.fillRect(W / 2 - 2.5, 0, 5, D);
      x.fillStyle = "#3b3936"; for (let j = 0; j < D / 1.5; j++) if (j % 2) x.fillRect(W / 2 - 2.5, j * 1.5, 5, 1.5);
      x.fillStyle = "#7c6a3a"; x.fillRect(W / 2 - 2.55, 0, 0.06, D); x.fillRect(W / 2 + 2.49, 0, 0.06, D);
    });
  }
  function hallWall(W, D, kind, len, h) {   // chân tường óc chó, thân xanh rêu, phía trên xám than, vài mảng ốp gỗ + quầng sáng ấm
    return skin(len, h, 14, (x, w, hh) => {
      const Y = (m) => hh - m;
      x.fillStyle = "#1f2623"; x.fillRect(0, 0, w, hh); x.fillStyle = "#33403a"; x.fillRect(0, Y(5.6), w, 5.6);
      x.fillStyle = "#3d4b44"; for (let X = 0; X < w; X += 2.4) x.fillRect(X, Y(5.6), 0.05, 5.6 - 1.1);
      x.fillStyle = "#c9a24a"; x.fillRect(0, Y(5.65), w, 0.06); x.fillStyle = "#171c1a"; x.fillRect(0, Y(10.0), w, 0.4);
      x.fillStyle = "#3a2a1f"; x.fillRect(0, Y(1.1), w, 1.1); x.fillStyle = "#2a1d15"; for (let X = 0; X < w; X += 0.25) x.fillRect(X, Y(1.0), 0.04, 0.9); x.fillStyle = "#c9a24a"; x.fillRect(0, Y(1.12), w, 0.04);
      const u = kind === "back" ? (v) => v + W / 2 : kind === "front" ? (v) => W / 2 - v : kind === "left" ? (v) => D / 2 - v : (v) => v + D / 2;
      const slat = (a, b, top) => { const A = Math.min(u(a), u(b)), Bq = Math.max(u(a), u(b)); x.fillStyle = "#4b3424"; x.fillRect(A, Y(top), Bq - A, top - 1.1); x.fillStyle = "#2c1e15"; for (let X = A + 0.12; X < Bq; X += 0.24) x.fillRect(X, Y(top), 0.05, top - 1.1); x.fillStyle = "#c9a24a"; x.fillRect(A, Y(top), Bq - A, 0.06); };
      if (kind === "left") { slat(3.4, 15, 4.2); slat(-6.3, 0.8, 4.2); slat(-26, -12.6, 3.6); slat(19.5, 26.5, 4.0); }
      if (kind === "right") { slat(8.8, 16.2, 4.2); slat(-5, 3.6, 3.4); slat(-12.5, -6.2, 4.2); slat(-26, -16.8, 3.0); }
      if (kind === "back") { slat(-3.6, 3.6, 4.8); }
      for (let X = 2; X < w; X += 4) { const gr = x.createRadialGradient(X, Y(3.6), 0.2, X, Y(3.6), 2.6); gr.addColorStop(0, "rgba(255,196,120,0.20)"); gr.addColorStop(1, "rgba(255,196,120,0)"); x.fillStyle = gr; x.fillRect(X - 2.6, Y(6.2), 5.2, 5.2); }
    });
  }
  function logoTex(w, h) { return skin(w, h, 60, (x) => { x.fillStyle = "#16120f"; x.fillRect(0, 0, w, h); x.strokeStyle = "#c9a24a"; x.lineWidth = 0.06; x.strokeRect(0.1, 0.1, w - 0.2, h - 0.2);
      signText(x, "HOME & COZY", w / 2, h * 0.43, w - 1.2, 0.8, "#e8c27a", "bold italic "); signText(x, "F U R N I T U R E  ·  D E C O R  ·  L I V I N G", w / 2, h * 0.8, w - 1.2, 0.2, "#c9a24a", ""); }); }

  function furnishHall(P, g, cx, cz, W, D, fur) {
    const H = (P.size || {}).h || 10, S = P.room.solids, FR = D / 2, BK = -D / 2, LW = -W / 2, RW = W / 2;
    const flat = (m) => { m.userData.flat = true; return m; };
    const sol = (x, z, hw, hd) => S.push({ x: cx + x, z: cz + z, hw, hd });
    const solR = (x, z, w, d, ry) => { const sw = Math.abs(Math.sin(ry || 0)) > 0.7; sol(x, z, (sw ? d : w) / 2, (sw ? w : d) / 2); };
    const B = (w, h, d, c, x, y, z) => lb(g, w, h, d, c, cx + x, y, cz + z);
    const C = (r, h, c, x, y, z, seg) => lc(g, r, r, h, c, cx + x, y, cz + z, seg || 14);
    const Sp = (r, c, x, y, z, sx, sy, sz) => { const m = new THREE.Mesh(SPH, typeof c === "number" ? mat(c) : c); m.scale.set(r * (sx || 1), r * (sy || 1), r * (sz || 1)); m.position.set(cx + x, y, cz + z); g.add(m); return m; };
    const G = (x, z, ry) => { const o = new THREE.Group(); o.position.set(cx + x, 0, cz + z); o.rotation.y = ry || 0; g.add(o);   // đồ nội thất trong hệ toạ độ riêng (mặt trước = +z)
      o.b = (w, h, d, c, x2, y, z2) => lb(o, w, h, d, c, x2, y, z2); o.c = (r, h, c, x2, y, z2, seg) => lc(o, r, r, h, c, x2, y, z2, seg || 14); o.t = (rt, rb, h, c, x2, y, z2, seg) => lc(o, rt, rb, h, c, x2, y, z2, seg || 14);
      o.s = (r, c, x2, y, z2, sx, sy, sz) => { const m = new THREE.Mesh(SPH, typeof c === "number" ? mat(c) : c); m.scale.set(r * (sx || 1), r * (sy || 1), r * (sz || 1)); m.position.set(x2, y, z2); o.add(m); return m; }; return o; };
    // ---- sàn, trần, tường (tự dựng: customWalls) ----
    g.children[0].material = new THREE.MeshLambertMaterial({ map: hallFloor(W, D) });
    { const m = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshBasicMaterial({ color: 0x0b0b0c, side: THREE.DoubleSide })); m.rotation.x = Math.PI / 2; m.position.set(cx, H - 0.02, cz); flat(m); g.add(m); }
    [["back", 0, BK, 0, W], ["front", 0, FR, Math.PI, W], ["left", LW, 0, Math.PI / 2, D], ["right", RW, 0, -Math.PI / 2, D]].forEach(([k, x, z, ry, len]) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(len, H), new THREE.MeshLambertMaterial({ map: hallWall(W, D, k, len, H) })); m.position.set(cx + x, H / 2, cz + z); m.rotation.y = ry; flat(m); g.add(m); });
    const SG = atlas(2, 8, 512, 128, (x, i, w, h) => { x.fillStyle = i === 12 ? "#7a1f1f" : "#17130f"; x.fillRect(0, 0, w, h); x.strokeStyle = i === 12 ? "#e8c27a" : "#c9a24a"; x.lineWidth = 5; x.strokeRect(8, 8, w - 16, h - 16);
      x.fillStyle = i === 12 ? "#ffe6b0" : "#e8c27a"; x.textAlign = "center"; x.textBaseline = "middle"; let f = 64; do { x.font = "bold " + f + "px Georgia, serif"; f -= 4; } while (x.measureText(SIGNS[i] || "").width > w - 50); x.fillText(SIGNS[i] || "", w / 2, h / 2 + 4); });
    const AR = atlas(4, 4, 256, 192, artDraw);
    const sign = (i, w, x, y, z, ry) => { const m = SG.quad(i, w, w / 4); m.position.set(cx + x, y, cz + z); m.rotation.y = ry || 0; flat(m); g.add(m); return m; };
    const art = (i, w, h, x, y, z, ry) => { B2(w + 0.14, h + 0.14, 0.05, K.brass, x, y, z, ry); const m = AR.quad(i % 16, w, h); m.position.set(cx + x, y, cz + z); m.rotation.y = ry || 0; m.translateZ(0.035); flat(m); g.add(m); };
    function B2(w, h, d, c, x, y, z, ry) { const m = B(w, h, d, c, x, y, z); m.rotation.y = ry || 0; return m; }
    const hang = (i, x, z, y, ry) => { sign(i, 3.2, x, y, z, ry || 0); sign(i, 3.2, x, y, z - 0.02 * Math.cos(ry || 0), (ry || 0) + Math.PI); [-1.4, 1.4].forEach(d => C(0.012, H - y, K.char, x + d, (H + y) / 2, z, 5)); };   // biển treo 2 mặt
    const halo = (() => { const hm = new THREE.MeshBasicMaterial({ map: haloTex(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      return (x, z, r, y) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), hm); m.rotation.x = -Math.PI / 2; m.position.set(cx + x, (y || 0) + 0.014, cz + z); flat(m); g.add(m); }; })();
    // ---- biển lớn + cửa ra ----
    { const lg = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.2), new THREE.MeshBasicMaterial({ map: logoTex(8, 1.2) })); lg.position.set(cx, 6.6, cz + FR - 0.04); lg.rotation.y = Math.PI; flat(lg); g.add(lg); }
    B(2.6, 3.3, 0.12, K.dwal, 0, 1.65, FR - 0.08); B(2.3, 2.95, 0.05, 0x40291b, 0, 1.55, FR - 0.15); B(0.05, 2.9, 0.06, K.brass, -0.12, 1.55, FR - 0.19); B(0.05, 2.9, 0.06, K.brass, 0.12, 1.55, FR - 0.19); B(0.04, 0.6, 0.08, K.brass, -0.3, 1.2, FR - 0.2); B(0.04, 0.6, 0.08, K.brass, 0.3, 1.2, FR - 0.2);
    sign(13, 1.6, 0, 3.75, FR - 0.05, Math.PI);

    // ---- đèn rọi: ray treo thấp (y 6) chạy ngang phòng, đèn chĩa xuống từng phòng mẫu ----
    const spotM = BM(0xffd9a0), tilt = (L, a) => { L.rotation.x = a; };
    const RAILS = [[22.8, 1], [12.4, -1], [5.2, 1], [-3, -1], [-9.6, 1], [-16.8, -1], [-22.5, 1]];
    RAILS.forEach(([z, dir]) => { B(38, 0.08, 0.1, K.black, 0, 6.0, z); [-17, 0, 17].forEach(x => C(0.012, H - 6, K.char, x, (H + 6) / 2, z, 5));
      for (let x = -17; x <= 17; x += 3.4) { if (Math.abs(x) < 2.6) continue; const L = G(x, z, 0); L.b(0.03, 0.22, 0.03, K.char, 0, 5.9, 0); const body = L.c(0.07, 0.3, K.black, 0, 5.72, 0, 10); body.position.y = 5.7; body.rotation.x = dir * 0.5; body.position.z = dir * 0.05;
        const lens = L.c(0.055, 0.03, spotM, 0, 5.58, dir * 0.16, 10); lens.rotation.x = dir * 0.5; } });
    // ==== cụm đồ dùng chung ====
    const deck = (x0, x1, z0, z1, col) => { const w = x1 - x0, d = z1 - z0, mx = (x0 + x1) / 2, mz = (z0 + z1) / 2; B(w, 0.1, d, col, mx, 0.05, mz); B(w + 0.06, 0.03, 0.06, K.brass, mx, 0.115, z0); B(w + 0.06, 0.03, 0.06, K.brass, mx, 0.115, z1); B(0.06, 0.03, d, K.brass, x0, 0.115, mz); B(0.06, 0.03, d, K.brass, x1, 0.115, mz); };
    const vach = (x0, z0, x1, z1, h) => { const w = Math.abs(x1 - x0) || 0.16, d = Math.abs(z1 - z0) || 0.16, mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, alongX = w >= d;
      B(w, h, d, K.dwal, mx, h / 2, mz); B(alongX ? w + 0.04 : 0.22, 0.05, alongX ? 0.22 : d + 0.04, K.brass, mx, h + 0.02, mz);
      const n = Math.floor((alongX ? w : d) / 0.4); for (let i = 0; i < n; i++) { const t = -(alongX ? w : d) / 2 + 0.3 + i * 0.4; B(alongX ? 0.06 : 0.2, h - 0.2, alongX ? 0.2 : 0.06, K.walnut, alongX ? mx + t : mx, h / 2, alongX ? mz : mz + t); }
      sol(mx, mz, w / 2 + 0.05, d / 2 + 0.05); };
    const rug = (x, z, w, d, c1, c2) => { B(w, 0.025, d, c1, x, 0.113, z); B(w - 0.5, 0.03, d - 0.5, c2, x, 0.116, z); B(w - 0.8, 0.032, d - 0.8, c1, x, 0.118, z); };
    const sofa = (x, z, ry, len, col, col2, pil, solid) => { const o = G(x, z, ry), n = Math.max(1, Math.round(len / 1.1)), aw = 0.24;
      o.b(len, 0.24, 0.95, col, 0, 0.34, 0); [-1, 1].forEach(s => [-1, 1].forEach(t => o.b(0.06, 0.18, 0.06, K.brass, s * (len / 2 - 0.1), 0.09, t * 0.38)));
      o.b(len, 0.6, 0.24, col, 0, 0.78, -0.36); [-1, 1].forEach(s => o.b(aw, 0.46, 0.95, col, s * (len / 2 - aw / 2), 0.58, 0));
      const cw = (len - 2 * aw) / n; for (let i = 0; i < n; i++) { const px = -len / 2 + aw + cw * (i + 0.5); o.b(cw - 0.03, 0.2, 0.72, col2, px, 0.56, 0.1); o.b(cw - 0.08, 0.46, 0.16, col2, px, 0.86, -0.2); }
      (pil || []).forEach(([c, px, py]) => { const p = o.b(0.4, 0.38, 0.13, c, px, py || 0.84, -0.0); p.rotation.set(-0.2, 0, px > 0 ? -0.2 : 0.2); });
      if (solid !== false) solR(x, z, len, 1.0, ry); return o; };
    const chair = (x, z, ry, c, c2) => { const o = G(x, z, ry); o.b(0.46, 0.06, 0.46, c2 || c, 0, 0.47, 0); [-1, 1].forEach(s => [-1, 1].forEach(t => o.b(0.04, 0.45, 0.04, K.dwal, s * 0.2, 0.23, t * 0.2))); o.b(0.46, 0.46, 0.05, c, 0, 0.78, -0.21); o.b(0.46, 0.05, 0.05, K.dwal, 0, 0.5, -0.21); return o; };
    const stool = (x, z, c) => { C(0.26, 0.07, c || K.tan, x, 0.74, z, 12); C(0.035, 0.7, K.brass, x, 0.36, z, 8); C(0.22, 0.04, K.black, x, 0.03, z, 12); };
    const lampT = (x, y, z, s) => { const sc = s || 1; C(0.09 * sc, 0.03, K.brass, x, y + 0.015, z, 10); C(0.025 * sc, 0.3 * sc, K.brass, x, y + 0.18 * sc, z, 6); const sh = lc(g, 0.11 * sc, 0.2 * sc, 0.26 * sc, BM(0xffd9a0), cx + x, y + 0.42 * sc, cz + z, 12); sh.userData.flat = true; };
    const plant = (x, z, s, solid) => { const q = s || 1; C(0.3 * q, 0.5 * q, K.char, x, 0.25 * q, z, 12); C(0.26 * q, 0.04, 0x3b2b20, x, 0.5 * q, z, 12); C(0.03 * q, 1.0 * q, K.dwal, x, 0.9 * q, z, 5);
      [[0, 1.6, 0, 0.55, K.leaf1], [0.3, 1.3, 0.1, 0.38, K.leaf2], [-0.28, 1.35, -0.1, 0.4, K.leaf3], [0.05, 1.05, 0.3, 0.33, K.leaf2], [-0.1, 1.85, 0.1, 0.32, K.leaf3]].forEach(([dx, y, dz, r, c]) => Sp(r * q, c, x + dx * q, y * q, z + dz * q)); if (solid !== false) sol(x, z, 0.35 * q, 0.35 * q); };
    const books = (o, x, y, z, n) => { const cs = [K.wine, K.teal, K.mustard, K.cream, K.rust, K.navy]; for (let i = 0; i < n; i++) o.b(0.06, 0.24 + (i % 3) * 0.03, 0.2, cs[i % 6], x + i * 0.075, y + 0.13, z); };
    const pend = (x, z, y, drop, c) => { C(0.01, drop, K.char, x, y + drop / 2, z, 4); const sh = lc(g, 0.07, 0.22, 0.2, c || K.brass, cx + x, y - 0.1, cz + z, 14); C(0.06, 0.02, BM(0xffe2b0), x, y - 0.23, z, 10); };

    // ==== LIVING: bục (-19.5..-3.8, 3.4..15) ====
    deck(-19.5, -3.8, 3.4, 15, 0x4f453a); rug(-15.6, 9.2, 5.4, 6.0, 0x8a7458, 0x6a5740); halo(-15.2, 9.2, 5.2, 0.1); halo(-8, 9, 3.6, 0.1);
    B(0.2, 3.6, 8.6, K.dwal, -19.9, 2.5, 9.2); for (let i = 0; i < 8; i++) B(0.06, 3.5, 0.22, K.walnut, -19.78, 2.5, 5.4 + i * 1.08);   // tường TV ốp gỗ
    B(0.08, 1.05, 1.85, 0x0c0d0f, -19.72, 1.95, 9.2); B(0.02, 0.95, 1.75, BM(0x1b2d40), -19.67, 1.95, 9.2); B(0.03, 0.03, 6, BM(0xffc67a), -19.66, 0.2, 9.2).userData.flat = true;
    B(0.5, 0.5, 3.4, K.walnut, -19.55, 0.35, 9.2); B(0.02, 0.4, 1.0, K.dwal, -19.28, 0.38, 8.3); B(0.02, 0.4, 1.0, K.dwal, -19.28, 0.38, 10.1); sol(-19.55, 9.2, 0.3, 1.7);
    sofa(-13.3, 9.2, -Math.PI / 2, 3.2, K.teal, K.teal2, [[K.mustard, -1.0, 0.84], [K.wine, 1.0, 0.84]], true);
    { const t = G(-16, 9.2, 0); t.c(0.7, 0.05, K.oak, 0, 0.42, 0, 24); t.c(0.08, 0.38, K.brass, 0, 0.21, 0, 8); t.c(0.4, 0.03, K.brass, 0, 0.02, 0, 20); t.b(0.5, 0.05, 0.36, K.wine, -0.15, 0.47, 0.1); t.b(0.4, 0.04, 0.3, K.teal, -0.1, 0.52, 0.1); t.c(0.1, 0.2, K.cream, 0.28, 0.54, -0.2, 10); sol(-16, 9.2, 0.75, 0.75); }
    fur("armchair_pillows", cx - 16.2, cz + 6.0, 0, 0.9, 0.85, 0.75);
    { const a = sofa(-16.2, 12.6, Math.PI, 1.15, K.mustard, 0xd9a43e, [[K.wine, 0.25, 0.8]]); }
    { const t = G(-13.5, 12.4, 0); t.c(0.32, 0.04, K.walnut, 0, 0.56, 0, 16); t.c(0.04, 0.52, K.brass, 0, 0.28, 0, 6); t.c(0.24, 0.03, K.brass, 0, 0.02, 0, 12); sol(-13.5, 12.4, 0.35, 0.35); lampT(-13.5, 0.58, 12.4, 0.9); }
    fur("lamp_standing", cx - 13.4, cz + 5.7, 0, 1.0, 0.3, 0.3);
    Sp(0.5, K.rust, -6.3, 0.34, 12.2, 1, 0.68, 1); Sp(0.5, K.mustard, -5.2, 0.34, 13.4, 1, 0.68, 1); sol(-6.3, 12.2, 0.5, 0.5); sol(-5.2, 13.4, 0.5, 0.5);
    { const s = G(-8.5, 4.0, 0); s.b(2.8, 2.3, 0.4, K.walnut, 0, 1.15, 0); for (let r = 0; r < 4; r++) { s.b(2.6, 0.04, 0.34, K.dwal, 0, 0.45 + r * 0.55, 0.02); books(s, -1.1, 0.45 + r * 0.55, 0.02, 4 + (r % 3)); books(s, 0.2, 0.45 + r * 0.55, 0.02, 5); } sol(-8.5, 4.0, 1.4, 0.22); }
    plant(-4.6, 4.5, 1.1); art(0, 2.6, 1.7, -19.88, 4.9, 9.2, Math.PI / 2); art(5, 1.6, 1.2, -19.88, 3.3, 3.8, Math.PI / 2);

    // ==== BEDROOM: bục (-19.5..-3.8, -6.3..0.8) ====
    deck(-19.5, -3.8, -6.3, 0.8, 0x46505a); vach(-19.5, -6.3, -3.8, -6.3, 1.1); halo(-17.6, -2.6, 3.4, 0.1); halo(-8, -3, 4, 0.1);
    { const o = G(-18.4, -2.6, 0); o.b(0.2, 1.45, 2.3, K.teal, -1.05, 0.9, 0); o.b(0.12, 0.05, 2.3, K.brass, -1.12, 1.64, 0); o.b(2.1, 0.3, 1.9, K.dwal, 0, 0.25, 0); o.b(2.05, 0.28, 1.85, K.white, 0, 0.5, 0); o.b(1.2, 0.07, 1.9, K.wine, 0.45, 0.67, 0); o.b(0.6, 0.2, 1.9, K.char, 1.2, 0.68, 0);
      o.b(0.4, 0.16, 0.7, K.cream, -0.8, 0.72, -0.5); o.b(0.4, 0.16, 0.7, K.cream, -0.8, 0.72, 0.5); o.b(0.3, 0.25, 0.5, K.mustard, -0.45, 0.76, 0).rotation.y = 0.3; solR(-18.4, -2.6, 2.3, 2.0, 0); }
    rug(-14.6, -2.6, 4.2, 5.2, 0x7a8590, 0x586471);
    [-4.5, -0.7].forEach(z => { const t = G(-19.1, z, Math.PI / 2); t.b(0.5, 0.5, 0.45, K.walnut, 0, 0.35, 0); t.b(0.44, 0.02, 0.01, K.brass, 0, 0.45, 0.23); t.b(0.5, 0.04, 0.5, K.walnut, 0, 0.62, 0); sol(-19.1, z, 0.3, 0.3); lampT(-19.1, 0.64, z, 1.0); });
    { const w = G(-11.5, -5.6, 0); w.b(3.0, 2.4, 0.6, K.char, 0, 1.2, 0); w.b(1.45, 2.2, 0.03, K.moss, -0.74, 1.2, 0.31); w.b(1.45, 2.2, 0.03, K.moss, 0.74, 1.2, 0.31); w.b(0.04, 0.5, 0.05, K.brass, -0.08, 1.2, 0.34); w.b(0.04, 0.5, 0.05, K.brass, 0.08, 1.2, 0.34); sol(-11.5, -5.6, 1.55, 0.35); }
    { const v = G(-6.8, -5.4, 0); v.b(1.5, 0.05, 0.55, K.oak, 0, 0.76, 0); [-1, 1].forEach(s => v.b(0.05, 0.74, 0.5, K.dwal, s * 0.7, 0.37, 0)); v.b(1.4, 0.02, 0.5, K.dwal, 0, 0.3, 0); v.b(1.1, 1.3, 0.03, K.brass, 0, 1.5, -0.25); v.b(1.0, 1.2, 0.02, 0xaed3dc, 0, 1.5, -0.235); v.c(0.07, 0.14, K.rust, -0.5, 0.85, 0, 10); v.c(0.05, 0.1, K.cream, 0.4, 0.82, 0.05, 10); sol(-6.8, -5.5, 0.8, 0.35); stool(-6.8, -4.4, K.teal2); sol(-6.8, -4.4, 0.3, 0.3); }
    fur("rug_oval_A", cx - 6.2, cz - 1.2, 0.3, 0.9);
    plant(-4.4, 0.2, 0.9); sofa(-5.3, -2.6, -Math.PI / 2, 1.15, K.wine, 0x8a3c4a, null);
    fur("pictureframe_large_B", cx - 19.86, cz - 2.6, Math.PI / 2, 1.2, 0, 0, 3.4); art(9, 1.8, 1.3, -19.88, 5.3, -2.6, Math.PI / 2);

    // ==== BATHROOM: bục (-19.5..-3.8, -26.3..-12.6) ====
    deck(-19.5, -3.8, -26.3, -12.6, 0x66635b); vach(-19.5, -12.5, -3.8, -12.5, 1.3); halo(-16.8, -18, 3.4, 0.1); halo(-11, -24, 4, 0.1); halo(-5.4, -23, 2.4, 0.1);
    { const t = G(-16.8, -18, 0); t.b(1.05, 0.62, 2.1, K.white, 0, 0.45, 0); t.b(0.8, 0.1, 1.85, 0x5b8996, 0, 0.78, 0); t.b(1.05, 0.08, 2.1, K.white, 0, 0.77, 0); t.b(0.84, 0.05, 1.9, 0xaed3dc, 0, 0.8, 0); [-1, 1].forEach(s => [-1, 1].forEach(q => t.b(0.08, 0.14, 0.08, K.brass, s * 0.42, 0.07, q * 0.95)));
      t.c(0.025, 0.9, K.brass, 0, 0.45, -1.2, 8).position.set(0, 0.85, -1.2); t.b(0.04, 0.04, 0.34, K.brass, 0, 1.3, -1.05); sol(-16.8, -18, 0.6, 1.1); }
    { const m = G(-15.2, -18, 0); m.b(0.8, 0.02, 1.2, K.teal, 0, 0.12, 0); }
    { const s = G(-18, -24.8, 0); s.b(2.2, 2.4, 0.04, glassM(), 0, 1.3, 1.1); s.b(0.04, 2.4, 2.2, glassM(), 1.1, 1.3, 0); s.b(2.2, 0.06, 0.06, K.brass, 0, 2.5, 1.1); s.b(0.06, 0.06, 2.2, K.brass, 1.1, 2.5, 0); s.b(2.1, 0.04, 2.1, K.stone, 0, 0.13, 0);
      s.c(0.03, 1.2, K.brass, -0.8, 1.6, -0.9, 6); const hd = s.c(0.2, 0.04, K.brass, -0.8, 2.25, -0.75, 14); hd.rotation.x = 0.4; s.b(0.04, 0.04, 0.3, K.brass, -0.8, 2.2, -0.9); sol(-18, -24.8, 1.15, 1.15); }
    { const v = G(-11, -25.9, 0); v.b(3.2, 0.82, 0.6, K.walnut, 0, 0.45, 0); v.b(3.3, 0.05, 0.66, 0xd4cfc4, 0, 0.88, 0); [-0.8, 0.8].forEach(x => { v.c(0.24, 0.12, K.white, x, 0.97, 0.02, 18); v.c(0.02, 0.28, K.brass, x, 1.05, -0.2, 6); v.b(0.03, 0.03, 0.14, K.brass, x, 1.18, -0.14); }); [-0.8, 0.8].forEach(x => { v.c(0.5, 0.04, K.brass, x, 1.95, -0.3, 24).rotation.x = Math.PI / 2; v.c(0.46, 0.02, 0xaed3dc, x, 1.95, -0.275, 24).rotation.x = Math.PI / 2; });
      v.b(0.5, 0.2, 0.4, K.cream, 1.3, 0.95, 0); v.c(0.05, 0.16, K.rust, -1.3, 0.97, 0, 10); sol(-11, -25.9, 1.65, 0.35); }
    { const l = G(-5.4, -25.9, 0); l.b(0.04, 1.9, 0.04, K.dwal, -0.35, 0.95, 0.15); l.b(0.04, 1.9, 0.04, K.dwal, 0.35, 0.95, 0.15); [0.3, 0.7, 1.1, 1.5].forEach(y => { l.b(0.7, 0.03, 0.4, K.dwal, 0, y, -0.05); }); l.b(0.62, 0.14, 0.34, K.cream, 0, 0.4, -0.05); l.b(0.62, 0.12, 0.34, K.teal, 0, 0.82, -0.05); l.b(0.62, 0.14, 0.34, K.mustard, 0, 1.24, -0.05); l.b(0.62, 0.1, 0.34, K.wine, 0, 1.62, -0.05); sol(-5.4, -25.7, 0.4, 0.3); }
    { const t = G(-19.0, -14.0, Math.PI / 2); t.b(0.45, 0.4, 0.55, K.white, 0, 0.25, 0.05); t.c(0.22, 0.04, K.white, 0, 0.47, 0.1, 16); t.b(0.4, 0.36, 0.18, K.white, 0, 0.58, -0.3); t.b(0.12, 0.03, 0.05, K.brass, 0, 0.78, -0.3); sol(-19.0, -14.0, 0.45, 0.35); }
    { const w = G(-4.6, -16, -Math.PI / 2); w.c(0.28, 0.5, K.char, 0, 0.35, 0, 12); w.b(0.3, 0.04, 0.3, K.walnut, 0, 0.62, 0); [-0.1, 0.1].forEach(x => w.b(0.04, 0.2, 0.04, K.brass, x, 0.74, 0)); sol(-4.6, -16, 0.35, 0.35); }
    plant(-4.7, -13.8, 0.9); plant(-19.0, -21.6, 0.8); art(14, 1.6, 1.2, -19.88, 3.6, -18, Math.PI / 2);

    // ==== LIGHTING: bục (-19.5..-5, 19.5..26.3) ====
    deck(-19.5, -5, 19.5, 26.3, 0x252527); halo(-12, 23, 4.8, 0.1); halo(-17.6, 22.6, 2.6, 0.1); halo(-7.5, 24.2, 2.4, 0.1);
    { const cy = 3.7, ch = G(-12, 23, 0); ch.c(0.02, 10 - cy - 0.3, K.char, 0, (10 + cy) / 2 + 0.1, 0, 5); ch.c(0.28, 0.2, K.brass, 0, cy + 0.2, 0, 14);
      [0.7, 1.15, 1.6].forEach((r, k) => { const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.03, 6, 28), mat(K.brass)); ring.rotation.x = Math.PI / 2; ring.position.y = cy - k * 0.35; ch.add(ring);
        const n = 6 + k * 3; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, px = Math.cos(a) * r, pz = Math.sin(a) * r; ch.c(0.02, 0.18, K.brass, px, cy - k * 0.35 + 0.1, pz, 5); ch.s(0.07, BM(0xfff0c8), px, cy - k * 0.35 + 0.28, pz, 1, 1.3, 1); ch.s(0.035, 0xddeeff, px, cy - k * 0.35 - 0.12, pz, 1, 1.8, 1); } });
      ch.c(0.06, 0.8, K.brass, 0, cy - 0.7, 0, 8); ch.s(0.16, K.brass, 0, cy - 1.15, 0); }
    fur("lamp_standing", cx - 18.0, cz + 21.5, 0, 1.0, 0.3, 0.3);
    { const a = G(-16.4, 21.8, 0); a.c(0.28, 0.05, K.black, 0, 0.03, 0, 14); a.c(0.025, 2.4, K.brass, 0, 1.2, 0, 6); const arc = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.025, 6, 16, Math.PI * 0.7), mat(K.brass)); arc.position.set(0, 2.3, 0); arc.rotation.set(0, 0, 0.9); a.add(arc);
      const sh = a.s(0.35, BM(0xffe0b0), 0.62, 2.95, 0, 1, 0.8, 1); sol(-16.4, 21.8, 0.35, 0.35); }
    { const t = G(-14.2, 24.8, 0); [[-0.35, 0.3], [0.35, 0.3], [0, -0.4]].forEach(([x, z]) => { const l = t.c(0.02, 2.1, K.walnut, x * 0.7, 1.0, z * 0.7, 5); l.rotation.set(z * 0.35, 0, -x * 0.35); }); t.c(0.2, 0.3, BM(0xffd9a0), 0, 2.15, 0, 12); t.t(0.12, 0.26, 0.3, K.char, 0, 2.15, 0, 12).position.y = 2.1; sol(-14.2, 24.8, 0.45, 0.45); }
    [[-9.6, 23.4, 3.6], [-8.8, 23.4, 3.0], [-8.0, 23.4, 4.0], [-9.2, 24.2, 3.3], [-8.4, 24.2, 2.8]].forEach(([x, z, y], i) => pend(x, z, y, 10 - y, [K.brass, K.char, K.rust, K.brass, K.teal][i]));
    { const t = G(-6.4, 25.4, 0); t.b(2.4, 0.9, 0.5, K.walnut, 0, 0.45, 0); [-0.7, 0.7].forEach((x, i) => { t.c(0.12, 0.04, K.brass, x, 0.92, 0, 12); t.c(0.02, 0.3, K.brass, x, 1.09, 0, 6); const sh = t.c(0.1, 0.18, BM(0xffe2b8), x, 1.35, 0, 12); }); sol(-6.4, 25.4, 1.3, 0.3); }
    art(11, 1.8, 1.35, -14, 4.4, 26.9, Math.PI); [[-17.5], [-9]].forEach(([x]) => { B(0.1, 0.5, 0.1, K.brass, x, 3.0, 26.9); Sp(0.18, BM(0xffe2b0), x, 3.05, 26.7, 1, 1.2, 1); });

    // ==== SALES: quầy bán hàng (Omar) bên phải ngay sau cửa ====
    halo(8, 22.5, 4, 0); halo(15, 22, 4.5, 0);
    B(1.1, 1.05, 5.4, K.walnut, 7.2, 0.52, 22.5); B(1.3, 0.07, 5.6, 0x8f8a80, 7.2, 1.08, 22.5); B(1.12, 0.1, 5.42, K.brass, 7.2, 0.9, 22.5).scale.set(1, 0.3, 1); B(0.04, 0.6, 5, K.dwal, 6.62, 0.55, 22.5);
    sol(7.2, 22.5, 0.7, 2.8);
    B(0.04, 0.34, 0.5, 0x0f1114, 7.5, 1.3, 21.2); B(0.5, 0.34, 0.03, 0x10161c, 7.4, 1.3, 20.9); { const p = B(0.46, 0.3, 0.02, BM(0x35597a), 7.4, 1.3, 20.9); p.position.z -= 0.0; } B(0.25, 0.04, 0.2, K.black, 7.4, 1.12, 21.2);
    sign(9, 2.4, 6.6, 1.1, 22.5, -Math.PI / 2); sign(12, 1.6, 6.62, 1.55, 24.4, -Math.PI / 2);
    B(0.24, 0.02, 0.3, 0xffffff, 7.2, 1.13, 23.8); C(0.07, 0.12, K.brass, 7.6, 1.17, 24.6, 10); B(0.3, 0.3, 0.2, K.tan, 7.0, 1.27, 25.3);
    { const sh = G(18.9, 22.5, -Math.PI / 2); sh.b(5.6, 2.6, 0.45, K.walnut, 0, 1.3, 0); for (let r = 0; r < 4; r++) { sh.b(5.4, 0.04, 0.4, K.dwal, 0, 0.4 + r * 0.6, 0.02); [-2.0, -0.6, 0.9, 2.1].forEach((x, i) => { if ((r + i) % 2) sh.c(0.12, 0.3 + (i % 2) * 0.1, [K.teal, K.rust, K.cream, K.mustard][(r + i) % 4], x, 0.6 + r * 0.6, 0.0, 10); else books(sh, x - 0.3, 0.4 + r * 0.6, 0.02, 6); }); } sol(18.9, 22.5, 0.3, 2.9); }
    { const t = G(14.2, 24.2, 0); t.c(0.9, 0.06, K.oak, 0, 0.7, 0, 24); t.c(0.1, 0.65, K.brass, 0, 0.35, 0, 8); t.c(0.45, 0.04, K.black, 0, 0.02, 0, 20); [-0.3, 0.2, 0.5].forEach((x, i) => t.c(0.09, 0.18 + i * 0.05, [K.wine, K.cream, K.teal][i], x, 0.83, i * 0.2 - 0.2, 10)); sol(14.2, 24.2, 0.95, 0.95); }
    plant(18.6, 19.6, 1.2); plant(12.2, 19.4, 0.9);

    // ==== DINING: bục (4..19.5, 8.8..16.2) ====
    deck(3.8, 19.5, 8.8, 16.2, 0x62452d); halo(11.5, 12.5, 4.6, 0.1);
    { const t = G(11.5, 12.5, 0); t.b(3.8, 0.08, 1.2, K.walnut, 0, 0.76, 0); t.b(3.6, 0.04, 1.0, K.dwal, 0, 0.7, 0); [-1, 1].forEach(s => { t.b(0.08, 0.72, 1.0, K.dwal, s * 1.7, 0.36, 0); }); t.b(3.4, 0.03, 0.34, K.teal, 0, 0.805, 0);
      t.c(0.09, 0.3, K.cream, -0.6, 0.97, 0, 10); t.c(0.07, 0.22, K.rust, 0.5, 0.92, 0, 10); t.s(0.14, 0xc0392b, 1.1, 0.9, 0.1); t.s(0.13, 0xe0a030, 1.28, 0.9, -0.05); [-1.2, -0.3, 0.9, 1.4].forEach((x, i) => { [-0.4, 0.4].forEach(z => { t.c(0.15, 0.015, K.white, x, 0.805, z, 14); }); });
      [-1.2, 0, 1.2].forEach(x => { chair(11.5 + x, 11.4, 0, K.rattan, K.cream); chair(11.5 + x, 13.6, Math.PI, K.rattan, K.cream); }); chair(9.2, 12.5, Math.PI / 2, K.rattan, K.cream); chair(13.8, 12.5, -Math.PI / 2, K.rattan, K.cream); sol(11.5, 12.5, 2.7, 1.7); }
    [[-1.2, 3.0], [0, 3.2], [1.2, 3.0]].forEach(([x, y], i) => pend(11.5 + x, 12.5, y + 0.2, 10 - y - 0.2, [K.brass, K.char, K.brass][i]));
    { const c = G(19.3, 12.6, -Math.PI / 2); c.b(2.8, 2.2, 0.55, K.dwal, 0, 1.1, 0); c.b(2.6, 1.3, 0.04, glassM(), 0, 1.45, 0.28); c.b(2.6, 0.03, 0.5, K.brass, 0, 0.8, 0.02); c.b(2.6, 0.03, 0.5, K.brass, 0, 1.4, 0.02); c.b(2.6, 0.03, 0.5, K.brass, 0, 1.9, 0.02); c.b(2.5, 1.3, 0.02, BM(0x3a2c20), 0, 1.45, -0.2);
      for (let i = 0; i < 7; i++) { c.c(0.06, 0.18, 0xdfe9ee, -1.1 + i * 0.36, 0.9, 0.0, 8); c.c(0.05, 0.15, 0xdfe9ee, -1.0 + i * 0.36, 1.5, 0.05, 8); c.c(0.07, 0.04, K.cream, -1.1 + i * 0.36, 1.98, 0.0, 10); } c.b(2.6, 0.9, 0.04, K.walnut, 0, 0.45, 0.28); sol(19.3, 12.6, 0.3, 1.45); }
    { const b = G(15.8, 9.4, 0); b.b(2.4, 0.9, 0.5, K.walnut, 0, 0.45, 0); b.b(2.5, 0.05, 0.55, K.stone, 0, 0.92, 0); [-0.8, 0, 0.8].forEach(x => b.b(0.7, 0.7, 0.02, K.dwal, x, 0.45, 0.26)); b.c(0.18, 0.1, K.rust, -0.7, 1.0, 0, 14); b.s(0.17, 0xe0a030, -0.7, 1.15, 0); b.c(0.06, 0.3, K.teal, 0.6, 1.1, 0, 10); sol(15.8, 9.4, 1.25, 0.28); }
    art(8, 2.2, 1.6, 19.88, 4.6, 12.6, -Math.PI / 2);

    // ==== KITCHEN: bục (4..19.5, -5..3.6) ====
    deck(3.8, 19.5, -5, 3.6, 0x364039); vach(3.8, -5.0, 19.5, -5.0, 1.2); halo(13.5, -0.6, 4.2, 0.1); halo(17.5, -0.5, 3, 0.1);
    { const k = G(19.55, -1.6, -Math.PI / 2); k.b(6.0, 0.9, 0.8, K.char, 0, 0.45, 0); k.b(6.1, 0.05, 0.86, 0x8d8980, 0, 0.93, 0); [-2.4, -1.2, 0, 1.2, 2.4].forEach(x => { k.b(1.1, 0.7, 0.02, K.moss, x, 0.48, 0.4); k.b(0.3, 0.03, 0.03, K.brass, x, 0.75, 0.42); });
      k.b(6.0, 0.9, 0.4, K.moss, 0, 2.2, -0.2); [-2.4, -1.2, 0, 1.2, 2.4].forEach(x => { k.b(1.1, 0.8, 0.02, K.char, x, 2.2, 0.01); k.b(0.03, 0.3, 0.03, K.brass, x + 0.4, 1.9, 0.04); });
      k.b(0.8, 0.02, 0.5, K.steel, -1.8, 0.96, 0); k.b(0.6, 0.03, 0.38, K.char, -1.8, 0.955, 0).scale.y = 0.5; k.c(0.02, 0.3, K.brass, -1.8, 1.1, -0.28, 6); k.b(0.02, 0.02, 0.2, K.brass, -1.8, 1.25, -0.2);
      k.b(0.8, 0.02, 0.5, 0x111214, 1.6, 0.96, 0); [-0.2, 0.2].forEach(a => [-0.12, 0.12].forEach(b2 => k.c(0.09, 0.015, K.steel, 1.6 + a, 0.98, b2, 12))); k.b(0.8, 1.1, 0.5, K.steel, 1.6, 1.9, -0.05).scale.set(1, 0.4, 1); k.c(0.08, 0.7, K.steel, 1.6, 2.5, -0.2, 8);
      k.c(0.1, 0.16, K.cream, 0.4, 1.05, -0.1, 10); k.c(0.08, 0.2, K.rust, 0.7, 1.07, -0.12, 10); k.b(0.5, 0.04, 0.3, K.oak, -0.4, 0.97, 0); sol(19.55, -1.6, 0.45, 3.05); }
    { const t = G(19.3, 2.7, -Math.PI / 2); t.b(1.3, 2.3, 0.7, K.char, 0, 1.15, 0); t.b(0.6, 2.1, 0.02, K.moss, -0.3, 1.15, 0.36); t.b(0.6, 2.1, 0.02, K.moss, 0.3, 1.15, 0.36); sol(19.3, 2.7, 0.4, 0.7); }
    { const isl = G(13.5, -0.8, 0); isl.b(3.2, 0.88, 1.15, K.char, 0, 0.44, 0); isl.b(3.4, 0.07, 1.3, 0x938e84, 0, 0.92, 0); isl.b(0.9, 0.5, 0.02, K.moss, -1.0, 0.45, 0.58); isl.b(0.9, 0.5, 0.02, K.moss, 0.2, 0.45, 0.58); isl.b(0.04, 0.04, 0.9, K.brass, 1.4, 0.7, 0.6);
      isl.c(0.18, 0.015, K.cream, -0.5, 0.96, 0.1, 14); isl.s(0.12, 0xc0392b, -0.5, 1.04, 0.1); isl.c(0.1, 0.22, K.teal, 0.9, 1.06, -0.2, 12); isl.b(0.5, 0.03, 0.34, K.oak, 0.2, 0.97, 0.1); sol(13.5, -0.8, 1.7, 0.72); }
    [-1.1, 0, 1.1].forEach(x => { stool(13.5 + x, 0.5, K.tan); sol(13.5 + x, 0.5, 0.3, 0.3); });
    [-1.2, 0, 1.2].forEach(x => pend(13.5 + x, -0.8, 3.0 + Math.abs(x) * 0.1, 10 - 3.0 - Math.abs(x) * 0.1, K.char));
    { const r = G(8, -4.8, 0); r.b(2.4, 0.05, 0.22, K.walnut, 0, 1.45, 0.05); r.b(2.4, 0.05, 0.22, K.walnut, 0, 1.85, 0.05); [0, 1].forEach(row => { for (let i = 0; i < 9; i++) r.c(0.06, 0.16, [K.rust, K.mustard, K.cream, K.leaf2, K.wine][(i + row) % 5], -1.0 + i * 0.25, 1.55 + row * 0.4, 0.05, 8); }); r.b(0.5, 0.35, 0.05, K.cream, 1.6, 1.2, 0.0); sol(8, -4.8, 1.25, 0.2); }
    art(13, 1.4, 1.0, 19.88, 4.0, -1.6, -Math.PI / 2);

    // ==== STUDY: bục (4..19.5, -12.5..-6.2) ====
    deck(3.8, 19.5, -12.5, -6.2, 0x42384d); halo(11.5, -9.5, 4.2, 0.1);
    { const s = G(11.5, -12.1, 0); s.b(4.8, 2.5, 0.4, K.walnut, 0, 1.25, 0); for (let r = 0; r < 5; r++) { s.b(4.6, 0.04, 0.34, K.dwal, 0, 0.4 + r * 0.5, 0.03); books(s, -2.1, 0.4 + r * 0.5, 0.03, 9); books(s, -0.4, 0.4 + r * 0.5, 0.03, 8); books(s, 1.2, 0.4 + r * 0.5, 0.03, 8); } sol(11.5, -12.1, 2.45, 0.22); }
    { const d = G(11.5, -9.4, 0); d.b(2.4, 0.06, 0.95, K.oak, 0, 0.76, 0); [-1, 1].forEach(s => d.b(0.05, 0.73, 0.9, K.dwal, s * 1.1, 0.37, 0)); d.b(0.9, 0.5, 0.5, K.walnut, -0.7, 0.45, 0); d.b(0.6, 0.02, 0.38, K.char, -0.1, 0.8, 0.15); d.b(0.6, 0.38, 0.02, 0x15181b, -0.1, 1.0, -0.08).rotation.x = -0.15;
      d.b(0.54, 0.32, 0.01, BM(0x6aa0c8), -0.1, 1.0, -0.065).rotation.x = -0.15; d.b(0.05, 0.2, 0.05, K.char, -0.1, 0.9, -0.06); d.s(0.17, 0x4a90a4, 0.8, 0.95, 0.1); d.c(0.03, 0.05, K.brass, 0.8, 0.8, 0.1, 8); d.b(0.2, 0.04, 0.28, K.cream, 0.45, 0.8, 0.15); d.c(0.09, 0.03, K.char, 0.95, 0.8, -0.2, 10); d.c(0.012, 0.35, K.char, 0.95, 0.99, -0.2, 6); d.s(0.1, BM(0xffd9a0), 0.95, 1.2, -0.12, 1, 0.8, 1);
      sol(11.5, -9.4, 1.3, 0.55); }
    { const c = G(11.5, -8.2, Math.PI); c.b(0.55, 0.08, 0.55, K.char, 0, 0.5, 0); c.b(0.5, 0.6, 0.1, K.char, 0, 0.92, -0.25); c.c(0.04, 0.4, K.steel, 0, 0.26, 0, 8); [0, 1, 2, 3, 4].forEach(i => c.b(0.4, 0.04, 0.04, K.steel, 0, 0.04, 0).rotation.y = i * 0.63); sol(11.5, -8.2, 0.35, 0.35); }
    { const f = G(16.6, -9.4, 0); f.b(0.7, 0.75, 0.6, K.char, 0, 0.38, 0); [0.2, 0.45, 0.65].forEach(y => { f.b(0.55, 0.15, 0.02, K.walnut, 0, y, 0.31); f.b(0.18, 0.03, 0.03, K.brass, 0, y, 0.33); }); sol(16.6, -9.4, 0.4, 0.35); }
    { const q = G(18.2, -7.4, -Math.PI / 2 - 0.4); q.b(0.9, 0.26, 0.9, K.navy, 0, 0.3, 0); q.b(0.9, 0.5, 0.2, K.navy, 0, 0.62, -0.35); [-1, 1].forEach(s => q.b(0.15, 0.4, 0.9, K.navy, s * 0.42, 0.48, 0)); sol(18.2, -7.4, 0.55, 0.55); }
    fur("book_set", cx + 11.1, cz - 8.5, 0.2, 0.7, 0, 0, 0.82); fur("pictureframe_large_A", cx + 19.86, cz - 9.4, -Math.PI / 2, 1.2, 0, 0, 3.4);
    plant(5.0, -7.2, 0.9); { const gl = G(16.0, -11.2, 0); gl.c(0.3, 0.05, K.brass, 0, 1.0, 0, 8); gl.s(0.22, 0x3d6a8a, 0, 1.45, 0); gl.c(0.02, 0.45, K.brass, 0, 1.15, 0, 6); }

    // ==== OUTDOOR: bục (4..19.5, -26.3..-16.8) – sân vườn trong nhà ====
    deck(3.8, 19.5, -26.3, -16.8, 0x5a4c32); B(15.4, 0.02, 9.4, 0x3d5430, 11.65, 0.112, -21.55); halo(8, -21.5, 4.4, 0.1); halo(14, -24, 3.6, 0.1); halo(17.6, -19, 3, 0.1);
    { const t = G(7.8, -21.5, 0); t.c(0.85, 0.05, K.black, 0, 0.72, 0, 24); t.c(0.06, 0.68, K.char, 0, 0.36, 0, 8); t.c(0.4, 0.04, K.char, 0, 0.03, 0, 16); [0, 1, 2, 3].forEach(i => { const a = i * Math.PI / 2 + 0.4, ch = G(7.8 + Math.sin(a) * 1.35, -21.5 + Math.cos(a) * 1.35, a + Math.PI); ch.b(0.55, 0.1, 0.55, K.rattan, 0, 0.45, 0); ch.b(0.55, 0.55, 0.08, K.rattan, 0, 0.78, -0.25); ch.b(0.45, 0.05, 0.45, K.cream, 0, 0.52, 0); [-1, 1].forEach(s => [-1, 1].forEach(q => ch.b(0.04, 0.42, 0.04, K.char, s * 0.24, 0.21, q * 0.24))); });
      t.c(0.04, 2.4, K.char, 0, 1.3, 0, 8); const cn = t.t(0.05, 2.0, 0.55, K.rust, 0, 2.62, 0, 16); t.t(0.05, 0.05, 0.1, K.char, 0, 2.95, 0, 6); const ring = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.025, 5, 24), mat(K.char)); ring.rotation.x = Math.PI / 2; ring.position.y = 2.35; t.add(ring); sol(7.8, -21.5, 1.9, 1.9); }
    { const s = G(13.6, -25.0, 0); [-1, 1].forEach(sd => { [-0.7, 0.7].forEach(z => { const l = s.c(0.03, 2.6, K.dwal, sd * 1.4, 1.3, z, 5); }); s.b(0.08, 0.08, 1.6, K.dwal, sd * 1.4, 2.55, 0); }); s.b(2.9, 0.1, 0.1, K.dwal, 0, 2.6, 0); [-0.9, 0.9].forEach(x => s.c(0.008, 1.9, K.char, x, 1.6, 0, 4)); s.b(1.9, 0.1, 0.65, K.oak, 0, 0.6, 0); s.b(1.9, 0.5, 0.08, K.oak, 0, 0.92, -0.3); s.b(1.7, 0.1, 0.55, K.cream, 0, 0.7, 0.02); s.b(0.4, 0.3, 0.1, K.rust, -0.5, 0.88, -0.2); sol(13.6, -25.0, 1.6, 0.9); }
    { const h = G(17.8, -22.8, 0); h.c(0.05, 3.0, K.char, 0.5, 1.5, 0, 8); const arc = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.04, 6, 16, Math.PI * 0.6), mat(K.char)); arc.position.set(0, 2.9, 0); arc.rotation.z = 0.3; h.add(arc); h.c(0.01, 1.0, K.char, -0.1, 2.35, 0, 4); const egg = h.s(0.55, K.rattan, -0.1, 1.5, 0, 1, 1.2, 1); h.s(0.38, K.cream, -0.1, 1.4, 0.15, 1, 0.9, 1); h.c(0.45, 0.04, K.char, 0.5, 0.03, 0, 12); sol(17.8, -22.8, 0.8, 0.8); }
    [[11.0, -19.4], [12.5, -19.4]].forEach(([x, z]) => { const l = G(x, z, 0); l.b(0.6, 0.08, 1.9, K.light, 0, 0.35, 0); l.b(0.6, 0.35, 0.08, K.light, 0, 0.62, -0.88).rotation.x = -0.5; [-1, 1].forEach(s => [-1, 1].forEach(q => l.b(0.05, 0.3, 0.05, K.steel, s * 0.26, 0.15, q * 0.8))); l.b(0.5, 0.04, 1.8, K.teal, 0, 0.42, 0.05); sol(x, z, 0.35, 1.0); });
    { const gr = G(17.8, -18.4, 0); gr.c(0.5, 0.06, K.char, 0, 0.88, 0, 18); const bowl = gr.s(0.5, K.black, 0, 0.9, 0, 1, 0.6, 1); gr.c(0.02, 0.9, K.char, -0.3, 0.45, -0.3, 5); gr.c(0.02, 0.9, K.char, 0.3, 0.45, -0.3, 5); gr.c(0.02, 0.9, K.char, 0, 0.45, 0.35, 5); gr.b(0.9, 0.04, 0.3, K.walnut, 0.9, 0.9, 0); gr.b(0.04, 0.4, 0.04, K.steel, 0.9, 0.7, 0); sol(17.8, -18.4, 0.75, 0.55); }
    [[5.0, -17.6, 1.2], [19.0, -17.4, 1.0], [5.2, -25.8, 1.3], [19.0, -26.0, 1.2]].forEach(([x, z, s]) => plant(x, z, s));
    fur("cactus_medium_A", cx + 5.2, cz - 19.8, 0, 1.2, 0.45, 0.45); fur("cactus_small_B", cx + 10.4, cz - 17.8, 0, 1.4, 0.35, 0.35);

    // ==== LỐI GIỮA: cổng gỗ + logo cuối phòng, vài cây lớn, tranh ====
    B(0.5, 4.6, 0.5, K.dwal, -3.6, 2.3, BK + 0.5); B(0.5, 4.6, 0.5, K.dwal, 3.6, 2.3, BK + 0.5); B(7.7, 0.5, 0.5, K.dwal, 0, 4.85, BK + 0.5); B(7.0, 0.04, 0.5, K.brass, 0, 4.58, BK + 0.5); B(7.0, 4.4, 0.1, BM(0x6a4a2a), 0, 2.3, BK + 0.1).userData.flat = true;
    B(7.0, 4.4, 0.02, BM(0x3a281a), 0, 2.3, BK + 0.16); sol(-3.6, BK + 0.5, 0.3, 0.3); sol(3.6, BK + 0.5, 0.3, 0.3); { const lg = SG.quad(8, 4.4, 1.1); lg.position.set(cx, 3.9, cz + BK + 0.2); flat(lg); g.add(lg); }
    sol(0, BK + 0.3, 3.4, 0.25); plant(-2.2, BK + 1.4, 1.5); plant(2.2, BK + 1.4, 1.5);

    // ---- biển treo trần cho từng phòng mẫu (nhìn từ lối đi giữa) ----
    hang(0, -11.6, 14.8, 5.0); hang(1, -11.6, 0.4, 4.4); hang(4, -11.6, -12.8, 4.4); hang(7, -12.5, 19.9, 4.6); hang(9, 11.5, 18.9, 4.4); hang(2, 11.5, 16.0, 4.6); hang(3, 11.5, 3.4, 4.4); hang(5, 11.5, -6.4, 4.4); hang(6, 11.5, -17.1, 4.4);

    // ---- chỗ người bán + chỗ bày từ vựng ----
    P.keeperAt = { x: cx + 8.6, z: cz + 22.5, ry: -Math.PI / 2 };   // sau quầy, mặt hướng lối đi
    const A = (list) => list.map(([x, y, z, sx, sz]) => [cx + x, y, cz + z, cx + sx, cz + sz]);
    P.anchors = {
      living: A([[-13.3, 1.5, 9.2, -10.6, 9.2], [-16.2, 1.7, 6.0, -14.2, 5.3], [-16.2, 1.5, 12.6, -14.2, 13.3], [-16, 1.0, 9.2, -14.5, 7.9], [-19.65, 2.9, 9.2, -18.0, 9.2], [-15.6, 0.5, 7.0, -14.6, 10.7],
        [-6.3, 1.0, 12.2, -7.8, 12.2], [-13.4, 2.8, 5.7, -11.4, 5.7], [-13.3, 1.3, 8.0, -10.6, 8.0], [-13.5, 1.2, 12.4, -11.5, 12.4], [-8.5, 2.7, 4.0, -8.5, 5.6]]),
      bedroom: A([[-18.4, 1.0, -2.6, -16.0, -2.6], [-19.0, 0.95, -0.7, -17.6, 0.0], [-19.0, 0.95, -4.5, -17.4, -5.0], [-18.8, 1.1, -3.4, -16.6, -3.9], [-18.6, 1.1, -1.8, -16.6, -1.2], [-11.5, 2.8, -5.6, -11.5, -3.8], [-6.8, 1.6, -5.4, -6.8, -3.2],
        [-6.8, 1.0, -4.4, -8.6, -4.0], [-14.6, 0.5, -2.6, -14.6, -3.8], [-5.3, 1.2, -2.6, -6.5, -1.2]]),
      dining: A([[11.5, 1.1, 12.5, 11.5, 10.1], [11.5, 1.2, 11.4, 13.5, 10.1], [19.3, 2.6, 12.6, 17.6, 12.6], [11.5, 3.2, 12.5, 10.1, 14.9], [15.8, 1.35, 9.4, 15.8, 10.8], [10.9, 1.25, 12.5, 9.2, 14.9], [12.7, 0.95, 12.5, 12.5, 14.9], [13.5, 1.0, 13.0, 15.0, 14.8]]),
      kitchen: A([[19.5, 3.2, -1.6, 17.6, -1.6], [13.5, 1.2, -0.8, 15.9, -1.8], [14.6, 1.0, 0.5, 14.6, 2.3], [8.0, 1.7, -4.8, 8.0, -3.2], [17.9, 1.1, 0.0, 16.4, 0.0], [18.5, 1.3, -2.4, 16.8, -2.8], [19.3, 1.5, -3.8, 17.2, -3.6], [13.5, 3.1, -0.8, 11.6, -2.6], [19.3, 2.4, 2.7, 17.5, 2.7]]),
      bathroom: A([[-16.8, 1.1, -18.0, -14.6, -18.0], [-12.2, 1.25, -25.9, -12.2, -24.0], [-11.0, 2.8, -26.0, -11.0, -23.8], [-5.4, 2.0, -25.7, -5.4, -23.7], [-18.8, 2.7, -23.8, -16.2, -23.0], [-19.0, 0.95, -14.0, -17.3, -14.8], [-9.8, 1.3, -25.8, -9.8, -24.2], [-15.2, 0.3, -18.0, -14.2, -19.4], [-4.6, 1.0, -16.0, -6.2, -16.0]]),
      study: A([[11.5, 1.2, -9.4, 11.5, -7.0], [11.5, 1.3, -8.2, 13.6, -7.4], [11.5, 3.0, -12.1, 11.5, -10.8], [12.6, 1.1, -9.2, 14.0, -8.2], [10.9, 1.4, -9.4, 9.6, -8.0], [16.0, 1.9, -11.2, 14.7, -10.3], [16.6, 1.3, -9.4, 16.6, -7.6], [18.2, 1.2, -7.4, 17.0, -6.9]]),
      outdoor: A([[7.8, 1.0, -21.5, 7.8, -19.0], [9.1, 1.0, -20.5, 10.6, -22.3], [7.8, 3.1, -21.5, 4.9, -22.6], [13.6, 1.0, -25.0, 13.6, -23.0], [17.8, 1.6, -22.8, 16.4, -21.4], [11.0, 0.8, -19.4, 11.7, -17.3], [5.2, 2.0, -25.8, 6.8, -24.6], [17.8, 1.4, -18.4, 16.2, -17.7], [5.2, 1.3, -19.8, 6.6, -18.4]]),
      lighting: A([[-12, 3.2, 23, -12, 21.4], [-16.4, 3.2, 21.8, -14.8, 21.8], [-14.2, 2.5, 24.8, -13.0, 23.2], [-8.8, 3.2, 23.4, -8.8, 21.8], [-6.4, 1.6, 25.4, -6.4, 23.7], [-18.0, 2.9, 21.5, -16.3, 20.5], [-14, 4.4, 26.9, -16.8, 25.4]])
    };
    P.vgroup = new THREE.Group(); g.add(P.vgroup);
  }
  INTERIORS["furnihall"] = { furnish: furnishHall, customWalls: true };
})();
