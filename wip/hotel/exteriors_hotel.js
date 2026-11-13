/* EnglishVerse – ngoại thất "hotel": VERSE HOTEL, khách sạn kiểu Pháp thuộc địa / Art Deco (lấy cảm hứng từ Hotel Majestic Sài Gòn, Q.1 – tên và logo là tự đặt).
   Mặt tiền kem 6 tầng: tầng trệt ốp đá, 4 tầng cửa sổ vòm có ban công sắt uốn, tầng áp mái, gờ phào + lan can con tiện;
   tháp tròn ở góc (mái vòm đồng xanh), sảnh chính nhô ra có mái kính, thảm đỏ, người gác cửa, xe hành lý, cọ cảnh, cờ cắm trên ban công.
   Cửa chính nằm lệch về bên phải (x = 1,7) để tránh đèn đường của quảng trường. Chữ VERSE HOTEL ở mặt trán nhà + trên mái hiên. */
EXTERIORS_EXTRA["hotel"] = function (g, P) {
  const CR = "#f6ecd1", CRL = "#fdf7e6", CRD = "#d8c79b", GOLD = "#c9a227", BURG = "#6a1424", IRON = "#1d1a17";
  const BH = 21.5, CORN = 20.5, G0 = 4.4, FH = 3.3;   // chiều cao thân (tới đỉnh lan can), cao gờ mái, cao tầng trệt, cao mỗi tầng
  const WX = 1.7, WW = 14.6, FZ = 8, BZ = -8;   // phần mặt tiền phẳng: x từ −5,6 tới 9 (tâm 1,7); mặt trước z = 8
  const TX = -5.6, TZ = 4.6, TR = 3.4;   // tháp tròn góc trái-trước
  const ENT = 1.7;   // tâm sảnh chính
  const col = (c) => typeof c === "string" ? parseInt(c.slice(1), 16) : c;   // cho phép màu dạng "#rrggbb"
  const LB = (g, w, h, d, c, x, y, z) => lb(g, w, h, d, col(c), x, y, z), LC = (g, a, b, h, c, x, y, z, n) => lc(g, a, b, h, col(c), x, y, z, n);
  const base = (n) => G0 + (n - 2) * FH;   // cao độ sàn tầng n (n = 2..5)
  const spaced = (x, t, cx, cy, size, color, track, maxW) => {   // chữ có đường chân (serif), giãn chữ, tự co vừa maxW
    x.font = "bold " + size + "px Georgia, 'Times New Roman', serif"; x.textAlign = "left"; x.textBaseline = "middle"; x.fillStyle = color;
    const ws = [...t].map(ch => x.measureText(ch).width), tot = ws.reduce((a, b) => a + b, 0) + track * (t.length - 1); if (maxW && tot > maxW) { const k = maxW / tot; x.font = "bold " + size * k + "px Georgia, 'Times New Roman', serif"; ws.forEach((w, i) => ws[i] = w * k); track *= k; return spacedDraw(x, t, cx, cy, ws, track); } return spacedDraw(x, t, cx, cy, ws, track);
  };
  const spacedDraw = (x, t, cx, cy, ws, track) => { const tot = ws.reduce((a, b) => a + b, 0) + track * (t.length - 1); let px = cx - tot / 2;
    [...t].forEach((ch, i) => { x.fillText(ch, px, cy); px += ws[i] + track; });
  };
  const rust = (x, X, Y, W, Hh, c1, c2) => {   // tường ốp đá: ron ngang + ron dọc so le
    x.fillStyle = c1; x.fillRect(X, Y, W, Hh); x.fillStyle = c2;
    for (let j = 0, r = 0; j < Hh; j += 0.55, r++) { x.fillRect(X, Y + j, W, 0.05); for (let i = (r % 2) * 0.7; i < W; i += 1.4) x.fillRect(X + i, Y + j, 0.045, 0.55); }
  };
  const wnd = (x, c, top, w, h, arch, lit, hood) => {   // cửa sổ cao: khung trắng, kính xanh / ánh đèn vàng + rèm đỏ, song ngang, đá khóa
    const X = c - w / 2;
    x.fillStyle = "#fffaf0"; if (arch) { archPath(x, X - 0.14, top - 0.14, w + 0.28, h + 0.14); x.fill(); } else x.fillRect(X - 0.14, top - 0.14, w + 0.28, h + 0.14);
    const gr = x.createLinearGradient(0, top, 0, top + h);
    if (lit) { gr.addColorStop(0, "#fbe6ac"); gr.addColorStop(1, "#e2a850"); } else { gr.addColorStop(0, "#6a93a3"); gr.addColorStop(1, "#243b47"); }
    x.fillStyle = gr; if (arch) { archPath(x, X, top, w, h); x.fill(); } else x.fillRect(X, top, w, h);
    const y0 = top + (arch ? w / 2 : 0);
    if (lit) { x.fillStyle = "#8c2438"; x.fillRect(X, y0, w * 0.24, h - (y0 - top)); x.fillRect(X + w * 0.76, y0, w * 0.24, h - (y0 - top)); }
    x.strokeStyle = "#fffaf0"; x.lineWidth = 0.055; x.beginPath(); x.moveTo(c, top + (arch ? 0.05 : 0)); x.lineTo(c, top + h);
    const ty = y0 + (top + h - y0) * 0.38; x.moveTo(X, ty); x.lineTo(X + w, ty); x.stroke();
    if (arch) { x.fillStyle = "#e3d2a2"; x.fillRect(c - 0.15, top - 0.34, 0.3, 0.36); x.fillStyle = GOLD; x.fillRect(c - 0.15, top - 0.34, 0.3, 0.04); }
    if (hood) { x.fillStyle = CRL; x.fillRect(X - 0.4, top - 0.34, w + 0.8, 0.16); x.fillStyle = CRD; x.fillRect(X - 0.4, top - 0.18, w + 0.8, 0.04); x.fillStyle = CRL; x.fillRect(X - 0.3, top - 0.2, 0.18, 0.5); x.fillRect(X + w + 0.12, top - 0.2, 0.18, 0.5); }
    x.fillStyle = "#fffaf0"; x.fillRect(X - 0.22, top + h, w + 0.44, 0.15); x.fillStyle = CRD; x.fillRect(X - 0.22, top + h + 0.15, w + 0.44, 0.04);
  };
  const lit = (i, f) => ((i * 7 + f * 3 + 1) % 5) < 2;
  const dentils = (x, W, y) => { x.fillStyle = CRD; for (let X = 0.1; X < W; X += 0.42) x.fillRect(X, y, 0.22, 0.24); x.fillStyle = GOLD; x.fillRect(0, y - 0.14, W, 0.06); };
  const parapet = (x, W, Hh) => {   // lan can con tiện trên cùng
    x.fillStyle = CRD; x.fillRect(0, 0, W, 0.9); x.fillStyle = CRL; x.fillRect(0, 0, W, 0.12); x.fillRect(0, 0.78, W, 0.12);
    for (let X = 0.12; X < W - 0.1; X += 0.34) { x.fillStyle = CRL; x.fillRect(X, 0.12, 0.17, 0.66); x.fillStyle = "#e9dcb6"; x.fillRect(X + 0.17, 0.12, 0.03, 0.66); }
  };
  const lamp = (x, c, y) => { x.fillStyle = GOLD; x.beginPath(); x.arc(c, y, 0.13, 0, 7); x.fill(); };

  /* ---------- ẢNH MẶT TIỀN PHẲNG ---------- */
  const wing = skin(WW, BH, 38, (x, Wd, Hh) => {
    const Y = h => Hh - h;
    x.fillStyle = CR; x.fillRect(0, 0, Wd, Hh);
    x.fillStyle = "#ecdfbb"; x.fillRect(0, Y(CORN - 0.6), Wd, 2.9);   // tầng áp mái hơi đậm hơn
    rust(x, 0, Y(G0), Wd, G0, "#ead9ae", "#c7b682");
    x.fillStyle = CRL; x.fillRect(0, Y(G0 + 0.28), Wd, 0.28); x.fillStyle = GOLD; x.fillRect(0, Y(G0 + 0.34), Wd, 0.04); x.fillStyle = CRD; x.fillRect(0, Y(G0 + 0.28), Wd, 0.04);
    x.fillStyle = CRL; x.fillRect(0, Y(base(5) + 0.1), Wd, 0.2); x.fillRect(0, Y(CORN - 2.7), Wd, 0.18);   // gờ chân tầng 5 & chân áp mái
    dentils(x, Wd, Y(CORN - 0.05)); x.fillStyle = CRL; x.fillRect(0, Y(CORN), Wd, 0.5); x.fillStyle = CRD; x.fillRect(0, Y(CORN - 0.5) - 0.02, Wd, 0.04);
    x.save(); x.translate(0, Y(BH)); parapet(x, Wd, Hh); x.restore();
    const bay = Wd / 5;
    for (let k = 0; k <= 5; k++) {   // trụ tường (pilaster) giữa các gian
      const X = Math.max(0, Math.min(Wd - 0.34, k * bay - 0.17)); x.fillStyle = CRL; x.fillRect(X, Y(CORN - 0.5), 0.34, CORN - 0.5 - G0 - 0.28); x.fillStyle = CRD; x.fillRect(X + 0.3, Y(CORN - 0.5), 0.04, CORN - 0.5 - G0 - 0.28);
      x.fillStyle = GOLD; x.fillRect(X, Y(CORN - 0.5), 0.34, 0.07); x.fillRect(X, Y(base(5) + 0.3), 0.34, 0.05); }
    for (let i = 0; i < 5; i++) {
      const c = bay / 2 + i * bay, ent = i === 2;
      if (!ent) wnd(x, c, Y(3.75), 1.5, 3.05, true, lit(i, 1));   // tầng trệt: cửa vòm cao
      [2, 3, 4].forEach(f => wnd(x, c, Y(base(f) + 2.9), ent && f === 2 ? 1.9 : 1.35, ent && f === 2 ? 2.65 : 2.45, true, lit(i, f), f === 3));
      wnd(x, c, Y(base(5) + 2.75), 1.2, 2.2, true, lit(i, 5));
      const ay = Y(CORN - 1.35);   // tầng áp mái: cửa sổ nhỏ + huy hiệu tròn
      x.fillStyle = "#fffaf0"; x.fillRect(c - 0.5, ay, 1, 1.15); x.fillStyle = lit(i, 6) ? "#efc872" : "#3b5766"; x.fillRect(c - 0.4, ay + 0.1, 0.8, 0.95);
      x.fillStyle = GOLD; x.beginPath(); x.arc(c, Y(CORN - 0.35) - 0.35, 0.12, 0, 7); x.fill();
    }
    x.fillStyle = CRL; for (let j = 0; j < 14; j++) x.fillRect(Wd - 0.5, Y(CORN - 0.6) - j * 1.25 - 0.55, j % 2 ? 0.5 : 0.35, 0.6);   // đá góc (quoin) mép phải
  });
  const sideTex = (W) => skin(W, BH, 22, (x, Wd, Hh) => {   // mặt hông / mặt sau: hàng cửa sổ đều
    const Y = h => Hh - h;
    x.fillStyle = CR; x.fillRect(0, 0, Wd, Hh); x.fillStyle = "#ecdfbb"; x.fillRect(0, Y(CORN - 0.6), Wd, 2.9);
    rust(x, 0, Y(G0), Wd, G0, "#ead9ae", "#c7b682"); x.fillStyle = CRL; x.fillRect(0, Y(G0 + 0.28), Wd, 0.28); x.fillStyle = GOLD; x.fillRect(0, Y(G0 + 0.34), Wd, 0.04);
    x.fillStyle = CRL; x.fillRect(0, Y(base(5) + 0.1), Wd, 0.2); x.fillRect(0, Y(CORN - 2.7), Wd, 0.18);
    dentils(x, Wd, Y(CORN - 0.05)); x.fillStyle = CRL; x.fillRect(0, Y(CORN), Wd, 0.5); x.save(); x.translate(0, Y(BH)); parapet(x, Wd, Hh); x.restore();
    const n = Math.max(2, Math.round(Wd / 3)), bay = Wd / n;
    for (let k = 0; k <= n; k++) { const X = Math.max(0, Math.min(Wd - 0.3, k * bay - 0.15)); x.fillStyle = CRL; x.fillRect(X, Y(CORN - 0.5), 0.3, CORN - 0.5 - G0 - 0.28); }
    for (let i = 0; i < n; i++) { const c = bay / 2 + i * bay;
      wnd(x, c, Y(3.5), 1.3, 2.6, false, lit(i, 1)); [2, 3, 4, 5].forEach(f => wnd(x, c, Y(base(f) + 2.8), 1.2, 2.35, true, lit(i, f)));
      x.fillStyle = "#fffaf0"; x.fillRect(c - 0.4, Y(CORN - 1.35), 0.8, 1.0); x.fillStyle = lit(i, 6) ? "#efc872" : "#3b5766"; x.fillRect(c - 0.32, Y(CORN - 1.35) + 0.08, 0.64, 0.84); }
  });
  const rails = skin(WW, BH, 36, (x, Wd, Hh) => {   // lớp ban công sắt uốn (trong suốt) đặt trước tường
    const bay = Wd / 5; x.strokeStyle = IRON; x.fillStyle = IRON;
    for (let i = 0; i < 5; i++) { const c = bay / 2 + i * bay;
      [2, 3, 4].forEach(f => { if (i === 2 && f === 2) return; const yb = Hh - (base(f) + 0.18), X0 = c - 1.05, X1 = c + 1.05;
        x.lineWidth = 0.07; x.beginPath(); x.moveTo(X0, yb - 0.95); x.lineTo(X1, yb - 0.95); x.moveTo(X0, yb - 0.08); x.lineTo(X1, yb - 0.08); x.stroke();
        x.lineWidth = 0.04; x.beginPath(); for (let X = X0 + 0.06; X <= X1; X += 0.2) { x.moveTo(X, yb - 0.95); x.lineTo(X, yb - 0.08); } x.stroke();
        x.lineWidth = 0.035; for (let X = X0 + 0.16; X < X1; X += 0.4) { x.beginPath(); x.arc(X, yb - 0.5, 0.1, 0, 7); x.stroke(); }
        x.fillRect(X0 - 0.03, yb - 1.0, 0.09, 1); x.fillRect(X1 - 0.06, yb - 1.0, 0.09, 1); }); }
  });
  const porchTex = skin(4.6, G0, 52, (x, Wd, Hh) => {   // mặt sảnh: ốp đá, cửa vòm kính + cửa xoay, quạt gió hình tia nắng
    rust(x, 0, 0, Wd, Hh, "#ead9ae", "#c7b682");
    x.fillStyle = CRL; archPath(x, 0.55, 0.15, 3.5, Hh - 0.15); x.fill();
    x.fillStyle = GOLD; archPath(x, 0.7, 0.3, 3.2, Hh - 0.3); x.fill();
    const gr = x.createLinearGradient(0, 0.4, 0, Hh); gr.addColorStop(0, "#f8e3a6"); gr.addColorStop(1, "#c58b3e"); x.fillStyle = gr; archPath(x, 0.78, 0.38, 3.04, Hh - 0.38); x.fill();
    x.strokeStyle = GOLD; x.lineWidth = 0.05; const cx = Wd / 2, cy = 1.95;   // quạt gió
    for (let a = 0; a <= 12; a++) { const t = Math.PI + a * Math.PI / 12; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(t) * 1.52, cy + Math.sin(t) * 1.52); x.stroke(); }
    x.fillStyle = "#e8b95a"; x.fillRect(0.78, cy, 3.04, 0.12);   // thanh ngang
    x.fillStyle = "#fff3cf"; x.beginPath(); x.arc(cx, 1.1, 0.35, 0, 7); x.fill();   // ánh đèn chùm
    const dy = 2.3, dh = Hh - dy;   // cửa: 2 cánh bên + cửa xoay giữa
    x.fillStyle = "#3d2a1c"; x.fillRect(0.9, dy, 0.1, dh); x.fillRect(3.6, dy, 0.1, dh); x.fillRect(1.9, dy, 0.1, dh); x.fillRect(2.6, dy, 0.1, dh);
    x.fillStyle = "rgba(60,90,100,0.55)"; x.fillRect(1.0, dy + 0.1, 0.9, dh - 0.5); x.fillRect(3.7 - 0.1, dy + 0.1, 0, 0); x.fillRect(2.7, dy + 0.1, 0.9, dh - 0.5);
    x.fillStyle = "rgba(255,236,180,0.7)"; x.fillRect(2.0, dy + 0.1, 0.6, dh - 0.5);
    x.fillStyle = GOLD; x.fillRect(0.9, dy - 0.05, 2.8, 0.1); x.fillRect(0.9, Hh - 0.4, 2.8, 0.4); x.fillRect(2.25, dy, 0.1, dh);
    x.fillStyle = "#e3d2a2"; x.fillRect(cx - 0.2, 0.0, 0.4, 0.34); x.fillStyle = GOLD; x.fillRect(cx - 0.2, 0.3, 0.4, 0.04);
  });
  const stoneSide = skin(1.3, G0, 40, (x, Wd, Hh) => rust(x, 0, 0, Wd, Hh, "#ead9ae", "#c7b682"));
  const tower = skin(2 * Math.PI * TR, BH, 28, (x, Wd, Hh) => {   // tháp tròn: 12 gian, mỗi gian 30°
    const Y = h => Hh - h; x.fillStyle = CR; x.fillRect(0, 0, Wd, Hh); x.fillStyle = "#ecdfbb"; x.fillRect(0, Y(CORN - 0.6), Wd, 2.9);
    rust(x, 0, Y(G0), Wd, G0, "#ead9ae", "#c7b682"); x.fillStyle = CRL; x.fillRect(0, Y(G0 + 0.28), Wd, 0.28); x.fillStyle = GOLD; x.fillRect(0, Y(G0 + 0.34), Wd, 0.04);
    x.fillStyle = CRL; x.fillRect(0, Y(base(5) + 0.1), Wd, 0.2); x.fillRect(0, Y(CORN - 2.7), Wd, 0.18);
    dentils(x, Wd, Y(CORN - 0.05)); x.fillStyle = CRL; x.fillRect(0, Y(CORN), Wd, 0.5); x.save(); x.translate(0, Y(BH)); parapet(x, Wd, Hh); x.restore();
    const bay = Wd / 12;
    for (let i = 0; i < 12; i++) { const c = bay / 2 + i * bay;
      x.fillStyle = CRL; x.fillRect(i * bay - 0.12, Y(CORN - 0.5), 0.24, CORN - 0.5 - G0 - 0.28);
      wnd(x, c, Y(3.7), 1.0, 3.0, true, lit(i, 1)); [2, 3, 4].forEach(f => { wnd(x, c, Y(base(f) + 2.85), 1.0, 2.4, true, lit(i, f)); });
      wnd(x, c, Y(base(5) + 2.7), 0.95, 2.2, true, lit(i, 5));
      x.fillStyle = "#fffaf0"; x.fillRect(c - 0.35, Y(CORN - 1.35), 0.7, 1.0); x.fillStyle = lit(i, 6) ? "#efc872" : "#3b5766"; x.fillRect(c - 0.28, Y(CORN - 1.35) + 0.08, 0.56, 0.84);
      [2, 3, 4].forEach(f => { x.fillStyle = IRON; const yb = Y(base(f) + 0.18); x.fillRect(c - bay * 0.42, yb - 0.95, bay * 0.84, 0.06); x.fillRect(c - bay * 0.42, yb - 0.08, bay * 0.84, 0.05); for (let X = c - bay * 0.4; X < c + bay * 0.42; X += 0.18) x.fillRect(X, yb - 0.95, 0.03, 0.87); }); }
  });
  const drum = skin(2 * Math.PI * 3.0, 2.4, 22, (x, Wd, Hh) => {   // cổ tháp dưới mái vòm
    x.fillStyle = CRL; x.fillRect(0, 0, Wd, Hh); x.fillStyle = GOLD; x.fillRect(0, 0, Wd, 0.08); x.fillRect(0, Hh - 0.08, Wd, 0.08);
    for (let i = 0; i < 12; i++) { const c = (i + 0.5) * Wd / 12; archWin(x, c - 0.3, 0.55, 0.6, 1.4, lit(i, 3) ? "#efc872" : "#3b5766", "#fffaf0"); } });
  const crown = skin(5, 3.6, 60, (x, Wd, Hh) => {   // mặt trán nhà: bảng tên VERSE HOTEL + tia nắng Art Deco
    x.fillStyle = BURG; x.fillRect(0, 0, Wd, Hh); x.strokeStyle = GOLD; x.lineWidth = 0.07; x.strokeRect(0.12, 0.12, Wd - 0.24, Hh - 0.24); x.lineWidth = 0.03; x.strokeRect(0.26, 0.26, Wd - 0.52, Hh - 0.52);
    x.lineWidth = 0.04; for (let a = 0; a <= 14; a++) { const t = Math.PI + a * Math.PI / 14; x.beginPath(); x.moveTo(Wd / 2 + Math.cos(t) * 0.35, 1.5 + Math.sin(t) * 0.35); x.lineTo(Wd / 2 + Math.cos(t) * 1.15, 1.5 + Math.sin(t) * 1.15); x.stroke(); }
    x.beginPath(); x.arc(Wd / 2, 1.5, 1.2, Math.PI, 0); x.stroke(); x.fillStyle = GOLD; x.beginPath(); x.arc(Wd / 2, 1.5, 0.28, Math.PI, 0); x.fill();
    spaced(x, "VERSE HOTEL", Wd / 2, 2.2, 0.62, "#f6dc8a", 0.1, Wd - 1.7); x.fillStyle = GOLD; x.fillRect(0.7, 2.62, Wd - 1.4, 0.03); spaced(x, "GRAND HOTEL · VERSE CITY", Wd / 2, 2.98, 0.2, "#f1e6c6", 0.06, Wd - 1.2);
    [0.45, Wd - 0.45].forEach(X => { x.beginPath(); x.moveTo(X, 2.0); x.lineTo(X + 0.12, 2.2); x.lineTo(X, 2.4); x.lineTo(X - 0.12, 2.2); x.closePath(); x.fill(); });
  });
  const fascia = skin(4.8, 0.5, 80, (x, Wd, Hh) => { x.fillStyle = BURG; x.fillRect(0, 0, Wd, Hh); x.fillStyle = GOLD; x.fillRect(0, 0, Wd, 0.04); x.fillRect(0, Hh - 0.04, Wd, 0.04); spaced(x, "VERSE HOTEL", Wd / 2, Hh / 2 + 0.01, 0.3, "#f6dc8a", 0.12, Wd - 0.6); });
  const bal = (len) => skin(len, 1.0, 40, (x, Wd) => {   // lan can con tiện nhỏ cho sân thượng sảnh (trong suốt giữa các con tiện)
    x.fillStyle = CRL; x.fillRect(0, 0, Wd, 0.1); x.fillRect(0, 0.88, Wd, 0.12);
    for (let X = 0.1; X < Wd - 0.08; X += 0.26) { x.fillRect(X, 0.1, 0.1, 0.78); x.fillRect(X - 0.02, 0.45, 0.14, 0.12); } });

  /* ---------- KHỐI NHÀ ---------- */
  LB(g, 18, BH, 12.6, CR, 0, BH / 2, -1.7);   // thân sau (x −9..9, z −8..4,6)
  LB(g, WW, BH, 3.4, CR, WX, BH / 2, 6.3);   // cánh trước (x −5,6..9, z 4,6..8)
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(TR, TR, BH, 36), new THREE.MeshLambertMaterial({ map: tower })); cyl.position.set(TX, BH / 2, TZ); g.add(cyl);   // tháp tròn
  face(g, wing, WW, BH, WX, BH / 2, FZ + 0.02);
  face(g, rails, WW, BH, WX, BH / 2, FZ + 0.6);
  face(g, sideTex(16), 16, BH, 9.02, BH / 2, 0, Math.PI / 2);
  face(g, sideTex(12.6), 12.6, BH, -9.02, BH / 2, -1.7, -Math.PI / 2);
  face(g, sideTex(18), 18, BH, 0, BH / 2, BZ - 0.02, Math.PI);
  // gờ chân từng tầng + phào mái nhô ra (hình khối)
  [G0, base(5)].forEach(y => LB(g, WW + 0.1, 0.24, 0.42, CRL, WX, y, FZ + 0.12));
  LB(g, 18.9, 0.55, 13.1, CRL, 0, CORN - 0.05, -1.45); LB(g, WW + 0.9, 0.55, 3.8, CRL, WX + 0.35, CORN - 0.05, 6.45);   // phào mái (thân sau + cánh trước)
  [[0, -8.45, 18.9, 0.3], [-9.45, -1.9, 0.3, 13.1], [9.45, 0, 0.3, 16.9]].forEach(([x, z, w, d]) => LB(g, w, 0.16, d, CRL, x, BH + 0.08, z));
  LB(g, WW + 0.3, 0.16, 0.3, CRL, WX + 0.1, BH + 0.08, FZ + 0.15);   // nắp lan can mặt trước
  [-5.6, 9.3].forEach(x => { LC(g, 0.16, 0.2, 0.5, GOLD, x, BH + 0.4, FZ + 0.1, 8); const u = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), mat(0xc9a227)); u.position.set(x, BH + 0.8, FZ + 0.1); g.add(u); });   // bình trang trí
  // ban công: sàn đá nhô ra từng cửa sổ (tầng 2–4)
  for (let i = 0; i < 5; i++) { const x = -5.6 + 1.46 + i * 2.92;
    [2, 3, 4].forEach(f => { if (i === 2 && f === 2) return; LB(g, 2.3, 0.18, 0.62, CRL, x, base(f) + 0.09, FZ + 0.3); [-1, 1].forEach(s => LB(g, 0.18, 0.4, 0.2, CRD, x + s * 0.9, base(f) - 0.2, FZ + 0.1)); }); }
  // tháp: vòng ban công + phào + cổ + mái vòm đồng xanh + chóp vàng
  [base(2), base(3), base(4)].forEach(y => LC(g, TR + 0.28, TR + 0.28, 0.16, CRL, TX, y + 0.08, TZ, 36));
  LC(g, TR + 0.45, TR + 0.45, 0.55, CRL, TX, CORN - 0.05, TZ, 36); LC(g, TR + 0.12, TR + 0.12, 0.16, CRL, TX, BH + 0.08, TZ, 36);
  LC(g, 3.0, 3.0, 2.4, 0xffffff, TX, BH + 1.2, TZ, 36).material = new THREE.MeshLambertMaterial({ map: drum });
  LC(g, 3.3, 3.3, 0.18, 0xc9a227, TX, BH + 2.5, TZ, 36);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(3.1, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x5fa58f)); dome.position.set(TX, BH + 2.4, TZ); g.add(dome);
  LC(g, 0.5, 0.7, 0.7, 0xc9a227, TX, BH + 5.65, TZ, 12); const fb = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 8), mat(0xc9a227)); fb.position.set(TX, BH + 6.3, TZ); g.add(fb); LC(g, 0.04, 0.1, 1.6, 0xc9a227, TX, BH + 7.2, TZ, 6);
  // sân thượng: sàn gỗ, 4 dù che nắng, đèn dây
  LB(g, 12, 0.06, 6.5, 0xb08d5a, 3, BH + 0.03, 0.6);
  [[-1.5, 3], [2, 3.4], [5.5, 3], [8, 2.6], [0.5, -1.5], [5, -1.8]].forEach(([x, z], i) => { LC(g, 0.04, 0.04, 2.3, 0xdee2e6, x, BH + 1.15, z, 5); const u = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.5, 10), mat(i % 2 ? 0x6a1424 : 0xf0e6c8)); u.position.set(x, BH + 2.5, z); g.add(u); LC(g, 0.55, 0.55, 0.05, 0xf6efd9, x, BH + 0.65, z, 10); });
  // trán nhà trên sảnh: bảng tên + bậc Art Deco
  LB(g, 5, 3.6, 1.0, 0x6a1424, ENT, CORN + 1.8, 7.8); face(g, crown, 5, 3.6, ENT, CORN + 1.8, 8.32);
  LB(g, 5.3, 0.22, 1.3, 0xc9a227, ENT, CORN + 3.7, 7.85); LB(g, 3.6, 0.5, 1.0, 0x6a1424, ENT, CORN + 4.05, 7.8); LB(g, 3.9, 0.12, 1.1, 0xc9a227, ENT, CORN + 4.36, 7.8);
  LB(g, 0.16, 1.0, 0.16, 0xc9a227, ENT, CORN + 4.9, 7.8);
  // ---------- SẢNH CHÍNH ----------
  const PZ = FZ + 1.3;   // mặt trước sảnh z = 9,3
  LB(g, 4.6, G0, 1.3, CR, ENT, G0 / 2, FZ + 0.65); face(g, porchTex, 4.6, G0, ENT, G0 / 2, PZ + 0.02);
  [-1, 1].forEach(s => face(g, stoneSide, 1.3, G0, ENT + s * 2.32, G0 / 2, FZ + 0.65, s * Math.PI / 2));
  [-1, 1].forEach(s => { LC(g, 0.2, 0.22, G0 - 0.5, CRL, ENT + s * 2.5, (G0 - 0.5) / 2 + 0.1, PZ - 0.05, 14); LB(g, 0.62, 0.35, 0.62, 0xc9a227, ENT + s * 2.5, G0 - 0.25, PZ - 0.05); LB(g, 0.55, 0.3, 0.55, 0xdad0b2, ENT + s * 2.5, 0.15, PZ - 0.05); });   // 2 cột đá ốp góc, đầu cột mạ vàng
  LB(g, 5.0, 0.22, 1.9, CRL, ENT, G0 + 0.1, FZ + 0.95);   // sàn sân thượng trên sảnh
  const b3 = bal(5.0); face(g, b3, 5.0, 1.0, ENT, G0 + 0.72, FZ + 1.88); [-1, 1].forEach(s => face(g, bal(1.9), 1.9, 1.0, ENT + s * 2.45, G0 + 0.72, FZ + 0.95, s * Math.PI / 2));
  // mái hiên kính: sườn sắt + kính + diềm tên + đèn
  const CY = 3.55, CZ0 = PZ, CZ1 = PZ + 1.45;
  LB(g, 5.0, 0.16, CZ1 - CZ0, 0x6a1424, ENT, CY, (CZ0 + CZ1) / 2);
  LB(g, 4.7, 0.05, CZ1 - CZ0 - 0.2, mat(0xcfe8f0, { transparent: true, opacity: 0.55 }), ENT, CY + 0.12, (CZ0 + CZ1) / 2);
  face(g, fascia, 4.8, 0.5, ENT, CY - 0.05, CZ1 + 0.02);
  LB(g, 5.0, 0.07, 0.07, 0xc9a227, ENT, CY + 0.18, CZ1);
  [-1, 1].forEach(s => { const r = LB(g, 0.05, 0.05, 1.8, 0x1d1a17, ENT + s * 2.3, CY + 0.6, PZ + 0.7); r.rotation.x = -0.52; });   // thanh treo
  [-1.6, 0, 1.6].forEach(dx => { const l = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), mat(0xffe9a8)); l.position.set(ENT + dx, CY - 0.2, PZ + 0.85); g.add(l); });
  [-1, 1].forEach(s => { LB(g, 0.16, 0.3, 0.16, 0xc9a227, ENT + s * 2.3, 2.8, PZ + 0.18); const l = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), mat(0xffe9a8)); l.position.set(ENT + s * 2.3, 3.1, PZ + 0.18); g.add(l); });   // đèn tường bên cột
  // bậc thềm + thảm đỏ + cột dây
  LB(g, 5.6, 0.1, 0.5, 0xdcd3bd, ENT, 0.05, PZ + 0.55); LB(g, 5.2, 0.2, 0.5, 0xd2c8ae, ENT, 0.1, PZ + 0.25);
  LB(g, 1.7, 0.04, 2.2, 0x7a1626, ENT, 0.13, PZ + 1.35); LB(g, 1.7, 0.04, 0.02, 0xc9a227, ENT, 0.14, PZ + 0.45);
  [[-1, 0.6], [-1, 1.5], [1, 0.6], [1, 1.5]].forEach(([s, dz]) => { LC(g, 0.04, 0.04, 0.8, 0xc9a227, ENT + s * 1.0, 0.45, PZ + dz + 0.4, 6); LC(g, 0.16, 0.16, 0.04, 0xc9a227, ENT + s * 1.0, 0.04, PZ + dz + 0.4, 10); });
  [-1, 1].forEach(s => LB(g, 0.03, 0.04, 0.9, 0x7a1626, ENT + s * 1.0, 0.78, PZ + 1.35 + 0.1));
  // người gác cửa (áo đỏ rượu vang, mũ), xe hành lý mạ vàng
  { const dx = ENT - 1.85, dz = PZ + 0.75;
    LB(g, 0.2, 0.55, 0.2, 0x2a1f1a, dx - 0.12, 0.3, dz); LB(g, 0.2, 0.55, 0.2, 0x2a1f1a, dx + 0.12, 0.3, dz); LB(g, 0.52, 0.8, 0.3, 0x7a1626, dx, 0.95, dz);
    [-1, 1].forEach(s => { LB(g, 0.14, 0.62, 0.16, 0x7a1626, dx + s * 0.34, 0.95, dz); LB(g, 0.16, 0.06, 0.18, 0xc9a227, dx + s * 0.34, 1.25, dz); });
    LB(g, 0.3, 0.04, 0.02, 0xc9a227, dx, 1.2, dz + 0.16); [0.8, 1.0, 1.15].forEach(y => LB(g, 0.04, 0.04, 0.02, 0xffe27a, dx, y, dz + 0.16));
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), mat(0xe9b98c)); h.position.set(dx, 1.5, dz); g.add(h);
    LC(g, 0.2, 0.22, 0.14, 0x7a1626, dx, 1.7, dz, 12); LB(g, 0.34, 0.03, 0.34, 0x2a1f1a, dx, 1.62, dz + 0.05); }
  { const cx = ENT + 2.9, cz = PZ + 0.9;
    LB(g, 0.9, 0.06, 0.55, 0xc9a227, cx, 0.22, cz); [-0.4, 0.4].forEach(dx => { LB(g, 0.04, 1.3, 0.04, 0xc9a227, cx + dx, 0.85, cz - 0.24); LB(g, 0.04, 1.3, 0.04, 0xc9a227, cx + dx, 0.85, cz + 0.24); }); LB(g, 0.9, 0.04, 0.55, 0xc9a227, cx, 1.5, cz);
    LB(g, 0.7, 0.4, 0.4, 0x6a1424, cx, 0.45, cz); LB(g, 0.6, 0.32, 0.36, 0x7a4b25, cx, 0.82, cz); LB(g, 0.5, 0.26, 0.3, 0x2d5d63, cx - 0.04, 1.15, cz);
    [-0.34, 0.34].forEach(dx => LC(g, 0.1, 0.1, 0.05, 0x343a40, cx + dx, 0.1, cz, 10).rotation.x = Math.PI / 2); }
  // cờ cắm trên sân thượng sảnh (màu trơn: vàng, đỏ rượu vang, kem)
  [[-1.7, 0xd9a82b], [0, 0x7a1626], [1.7, 0xf0e6c8]].forEach(([dx, col], i) => {
    const px = ENT + dx, py = G0 + 1.2, pz = FZ + 1.85;
    const pole = LC(g, 0.04, 0.05, 2.0, 0xdee2e6, px, py + 0.95, pz + 0.35, 6); pole.rotation.x = 0.4;
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.65), new THREE.MeshLambertMaterial({ color: col, side: THREE.DoubleSide })); fl.position.set(px + 0.52, py + 1.55, pz + 0.55); fl.userData.flag = true; g.add(fl); if (typeof flags !== "undefined") flags.push(fl); });
  // cây cọ cảnh, cây cắt tỉa, chậu hoa dưới cửa sổ
  const palm = (x, z) => { LC(g, 0.34, 0.28, 0.7, 0xb08d3c, x, 0.35, z, 10); LC(g, 0.1, 0.16, 2.2, 0x8a6a4a, x, 1.7, z, 7);
    for (let k = 0; k < 8; k++) { const a = k * 0.8, lf = LB(g, 0.4, 0.05, 2.0, 0x2f9e44, x + Math.sin(a) * 0.8, 2.9, z + Math.cos(a) * 0.8); lf.rotation.order = "YXZ"; lf.rotation.y = a; lf.rotation.x = 0.5; } };
  palm(ENT - 3.15, FZ + 1.5); palm(ENT + 3.9, FZ + 1.4);
  const topiary = (x, z) => { LC(g, 0.3, 0.24, 0.5, 0xb08d3c, x, 0.25, z, 10); LC(g, 0.05, 0.05, 0.5, 0x6c4a2f, x, 0.75, z, 6); const b = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), mat(0x2f8a3a)); b.position.set(x, 1.2, z); g.add(b); };
  topiary(-4.6, FZ + 1.0); topiary(8.0, FZ + 1.0);
  [-4.14, -1.22, 4.62].forEach(x => { LB(g, 2.0, 0.5, 0.5, 0x7a4b25, x, 0.25, FZ + 0.3); LB(g, 1.9, 0.12, 0.42, 0x3d8b37, x, 0.55, FZ + 0.3);
    [-0.6, 0, 0.6].forEach(dx => { const f = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), mat(dx ? 0xe05a5a : 0xf2c14e)); f.position.set(x + dx, 0.75, FZ + 0.3); g.add(f); }); });
  return { solids: [[0, 0, 9, 8.35], [ENT, FZ + 0.65, 2.45, 0.7], [ENT - 3.15, FZ + 1.5, 0.4, 0.4], [ENT + 3.9, FZ + 1.4, 0.4, 0.4]], door: [ENT, PZ + 2.15], map: [[0, 0, 18, 16]] };
};
