/* EnglishVerse – nội thất "townhall" (layout: "townhall"). Tách khỏi index.html để mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, face, textPlate, addBox, signText, archPath…) – chúng có sẵn khi nội thất được dựng. */
/* TOWN HALL – sảnh lớn 36 × 48 × 12 m theo phong cách Trụ sở UBND TP.HCM (kiểu Pháp, 1908):
   sàn đá hoa cờ ca-rô, thảm đỏ chạy từ cửa tới quầy thông tin, 2 hàng cột đá + dầm trần ô hộc, đèn chùm pha lê,
   cầu thang đôi thảm đỏ lan can sắt uốn mạ vàng lên ban công (cuối sảnh), tường kem phào chỉ vàng, cột ốp tường, cửa sổ vòm cao + rèm,
   tranh phong cảnh Việt Nam (không chân dung, không biểu tượng chính trị).
   Khu: sảnh trung tâm + quầy thông tin (ông Lee, thị trưởng) · Trung tâm Dịch vụ Công dân (cánh trái: 6 quầy số, máy lấy số, ghế chờ)
        · Phòng tiếp khách (cánh phải: bàn dài, ghế lưng cao) · Bảng nhiệm vụ QUEST BOARD (tường phải, gần cửa) · bảng lịch sử toà nhà. */
const TH_GOLD = 0xc9a227, TH_CREAM = 0xf1e6c9, TH_BASIC = {};
function thBasic(c) { return TH_BASIC[c] || (TH_BASIC[c] = new THREE.MeshBasicMaterial({ color: c })); }
function thGrad(x, X, Y, w, h, c0, c1) { const gr = x.createLinearGradient(0, Y, 0, Y + h); gr.addColorStop(0, c0); gr.addColorStop(1, c1); x.fillStyle = gr; x.fillRect(X, Y, w, h); }
/* tranh phong cảnh Việt Nam (vẽ bằng canvas, đơn vị mét) */
function thLandscape(x, X, Y, w, h, kind) {
  x.save(); x.beginPath(); x.rect(X, Y, w, h); x.clip();
  if (kind === 0) {   // ruộng bậc thang
    thGrad(x, X, Y, w, h * 0.6, "#9fd3f0", "#fdeec6");
    x.fillStyle = "#7aa08a"; x.beginPath(); x.moveTo(X, Y + h * 0.55); x.lineTo(X + w * 0.2, Y + h * 0.25); x.lineTo(X + w * 0.45, Y + h * 0.5); x.lineTo(X + w * 0.68, Y + h * 0.2); x.lineTo(X + w * 0.9, Y + h * 0.5); x.lineTo(X + w, Y + h * 0.4); x.lineTo(X + w, Y + h); x.lineTo(X, Y + h); x.fill();
    ["#5aa347", "#8cc65c", "#4a8f3c", "#a5d86f", "#3f7d36"].forEach((c, i) => { x.fillStyle = c; const y0 = Y + h * (0.5 + i * 0.1); x.beginPath(); x.moveTo(X, y0 + h * 0.08); x.bezierCurveTo(X + w * 0.3, y0 - h * 0.08, X + w * 0.6, y0 + h * 0.12, X + w, y0 - h * 0.02); x.lineTo(X + w, Y + h); x.lineTo(X, Y + h); x.fill();
      x.strokeStyle = "rgba(190,230,255,.55)"; x.lineWidth = 0.04; x.beginPath(); x.moveTo(X + w * 0.1, y0 + h * 0.08); x.bezierCurveTo(X + w * 0.3, y0 - h * 0.02, X + w * 0.6, y0 + h * 0.15, X + w * 0.9, y0 + h * 0.03); x.stroke(); });
    x.fillStyle = "#e9d8a6"; x.beginPath(); x.moveTo(X + w * 0.3, Y + h * 0.86); x.lineTo(X + w * 0.34, Y + h * 0.78); x.lineTo(X + w * 0.38, Y + h * 0.86); x.fill();   // nón lá
  } else if (kind === 1) {   // vịnh Hạ Long
    thGrad(x, X, Y, w, h * 0.5, "#ffd9a0", "#fff4dc"); x.fillStyle = "#ffe27a"; x.beginPath(); x.arc(X + w * 0.78, Y + h * 0.3, h * 0.11, 0, 7); x.fill();
    thGrad(x, X, Y + h * 0.5, w, h * 0.5, "#5ec2c6", "#1f7f95");
    [[0.18, 0.5, 0.16, 0.3], [0.38, 0.5, 0.2, 0.42], [0.6, 0.5, 0.14, 0.26], [0.82, 0.5, 0.18, 0.34]].forEach(([a, b, ww, hh]) => { x.fillStyle = "#5f7a6a"; x.beginPath(); x.moveTo(X + w * (a - ww / 2), Y + h * b + 0.02); x.lineTo(X + w * (a - ww * 0.12), Y + h * (b - hh)); x.lineTo(X + w * (a + ww * 0.2), Y + h * (b - hh * 0.8)); x.lineTo(X + w * (a + ww / 2), Y + h * b + 0.02); x.fill(); x.fillStyle = "#3f8f4f"; x.fillRect(X + w * (a - ww / 2), Y + h * b - 0.08, w * ww, 0.1); });
    x.fillStyle = "#7a3b1d"; x.beginPath(); x.moveTo(X + w * 0.45, Y + h * 0.85); x.lineTo(X + w * 0.65, Y + h * 0.85); x.lineTo(X + w * 0.6, Y + h * 0.92); x.lineTo(X + w * 0.5, Y + h * 0.92); x.fill();
    x.fillStyle = "#d94f3a"; x.beginPath(); x.moveTo(X + w * 0.55, Y + h * 0.5); x.lineTo(X + w * 0.55, Y + h * 0.84); x.lineTo(X + w * 0.66, Y + h * 0.84); x.fill();
  } else if (kind === 2) {   // sông Cửu Long hoàng hôn
    thGrad(x, X, Y, w, h * 0.55, "#f6a45a", "#ffe3a8"); x.fillStyle = "#fff3c4"; x.beginPath(); x.arc(X + w * 0.5, Y + h * 0.5, h * 0.12, 0, 7); x.fill();
    thGrad(x, X, Y + h * 0.55, w, h * 0.45, "#e8a870", "#8c6a4a");
    x.fillStyle = "#3d6a3a"; x.fillRect(X, Y + h * 0.5, w, h * 0.08);
    [0.12, 0.2, 0.84, 0.92].forEach((a, i) => { x.strokeStyle = "#5a3d22"; x.lineWidth = 0.06; x.beginPath(); x.moveTo(X + w * a, Y + h * 0.55); x.lineTo(X + w * (a + 0.01), Y + h * 0.28 + i % 2 * 0.2); x.stroke(); x.fillStyle = "#2f7d32"; for (let k = 0; k < 5; k++) { x.beginPath(); x.ellipse(X + w * a + Math.cos(k * 1.3) * 0.28, Y + h * 0.28 + i % 2 * 0.2 + Math.sin(k * 1.3) * 0.12, 0.3, 0.05, k * 0.6, 0, 7); x.fill(); } });
    x.fillStyle = "#4a3526"; x.beginPath(); x.moveTo(X + w * 0.38, Y + h * 0.78); x.lineTo(X + w * 0.62, Y + h * 0.78); x.lineTo(X + w * 0.57, Y + h * 0.84); x.lineTo(X + w * 0.43, Y + h * 0.84); x.fill();
    x.fillStyle = "#e9d8a6"; x.beginPath(); x.moveTo(X + w * 0.47, Y + h * 0.7); x.lineTo(X + w * 0.5, Y + h * 0.78); x.lineTo(X + w * 0.53, Y + h * 0.7); x.fill();
  } else {   // ao sen
    thGrad(x, X, Y, w, h, "#d9f0d0", "#6fae7c"); x.fillStyle = "#3f8f55"; for (let i = 0; i < 9; i++) { x.beginPath(); x.ellipse(X + w * (0.1 + (i * 0.37) % 0.85), Y + h * (0.55 + (i * 0.23) % 0.4), 0.4, 0.16, 0, 0, 7); x.fill(); }
    [[0.3, 0.55], [0.55, 0.65], [0.75, 0.5], [0.45, 0.4]].forEach(([a, b]) => { x.fillStyle = "#f7b6cf"; for (let k = -2; k <= 2; k++) { x.beginPath(); x.ellipse(X + w * a + k * 0.12, Y + h * b - Math.abs(k) * 0.03, 0.09, 0.22, k * 0.35, 0, 7); x.fill(); } x.fillStyle = "#ffe27a"; x.beginPath(); x.arc(X + w * a, Y + h * b + 0.12, 0.09, 0, 7); x.fill(); });
    x.strokeStyle = "#2f6b3d"; x.lineWidth = 0.05; [0.3, 0.55, 0.75, 0.45].forEach((a, i) => { x.beginPath(); x.moveTo(X + w * a, Y + h * [0.55, 0.65, 0.5, 0.4][i] + 0.2); x.lineTo(X + w * a, Y + h); x.stroke(); });
  }
  x.restore();
}
function thFrame(x, X, Y, w, h, kind) {   // khung tranh mạ vàng + tranh
  x.fillStyle = "#c9a227"; x.fillRect(X - 0.28, Y - 0.28, w + 0.56, h + 0.56); x.fillStyle = "#7b5d12"; x.fillRect(X - 0.16, Y - 0.16, w + 0.32, h + 0.32); x.fillStyle = "#e3c25a"; x.fillRect(X - 0.1, Y - 0.1, w + 0.2, h + 0.2);
  thLandscape(x, X, Y, w, h, kind);
}
function thWindow(x, c, w, top, bot, curtains) {   // cửa sổ vòm cao + rèm đỏ
  const H = bot - top;
  x.fillStyle = "#c9a227"; archPath(x, c - w / 2 - 0.22, top - 0.22, w + 0.44, H + 0.22); x.fill();
  const gr = x.createLinearGradient(0, top, 0, bot); gr.addColorStop(0, "#bfe0f7"); gr.addColorStop(1, "#fff6dd"); x.fillStyle = gr; archPath(x, c - w / 2, top, w, H); x.fill();
  x.strokeStyle = "#f4ead0"; x.lineWidth = 0.09; x.beginPath(); x.moveTo(c, top); x.lineTo(c, bot); x.moveTo(c - w / 2, top + w / 2 + (H - w / 2) * 0.35); x.lineTo(c + w / 2, top + w / 2 + (H - w / 2) * 0.35); x.moveTo(c - w / 2, top + w / 2 + (H - w / 2) * 0.7); x.lineTo(c + w / 2, top + w / 2 + (H - w / 2) * 0.7); x.stroke();
  x.beginPath(); for (let a = 1; a < 6; a++) { const t = Math.PI + a * Math.PI / 6; x.moveTo(c, top + w / 2); x.lineTo(c + Math.cos(t) * w / 2, top + w / 2 + Math.sin(t) * w / 2); } x.stroke();   // nan quạt
  x.fillStyle = "#e3c25a"; x.fillRect(c - 0.18, top - 0.45, 0.36, 0.3);   // đá đỉnh vòm
  x.fillStyle = "#e9dcb6"; x.fillRect(c - w / 2 - 0.4, bot, w + 0.8, 0.22);   // bậu cửa
  if (curtains) { x.fillStyle = "#8c1d2a"; [c - w / 2 - 0.62, c + w / 2 + 0.08].forEach(X => { x.fillRect(X, top + 0.5, 0.54, bot - top - 0.2); x.fillStyle = "#6f1420"; for (let k = 0.1; k < 0.54; k += 0.18) x.fillRect(X + k, top + 0.5, 0.05, bot - top - 0.2); x.fillStyle = "#8c1d2a"; });
    x.fillRect(c - w / 2 - 0.7, top + 0.35, w + 1.4, 0.42); x.fillStyle = "#c9a227"; x.fillRect(c - w / 2 - 0.7, top + 0.75, w + 1.4, 0.07); x.fillStyle = "#6f1420"; for (let X = c - w / 2 - 0.5; X < c + w / 2 + 0.6; X += 0.5) { x.beginPath(); x.arc(X, top + 0.77, 0.25, 0, Math.PI); x.fill(); }
    x.fillStyle = "#c9a227"; [c - w / 2 - 0.35, c + w / 2 + 0.35].forEach(X => x.fillRect(X - 0.04, bot - 2.1, 0.08, 0.5)); }
}
function thSepia(x, X, Y, w, h) {   // ảnh vẽ tay (nâu sepia) mặt tiền Town Hall
  x.fillStyle = "#e7d5aa"; x.fillRect(X, Y, w, h); x.fillStyle = "#cdb98a"; x.fillRect(X, Y + h * 0.82, w, h * 0.18);
  x.fillStyle = "#8a6e45"; x.fillRect(X + w * 0.12, Y + h * 0.4, w * 0.76, h * 0.42); x.fillRect(X + w * 0.4, Y + h * 0.2, w * 0.2, h * 0.22);
  x.beginPath(); x.moveTo(X + w * 0.38, Y + h * 0.2); x.lineTo(X + w * 0.5, Y + h * 0.06); x.lineTo(X + w * 0.62, Y + h * 0.2); x.fill();
  x.fillStyle = "#f3e7c6"; for (let i = 0; i < 6; i++) { x.fillRect(X + w * (0.16 + i * 0.115), Y + h * 0.5, w * 0.05, h * 0.2); } x.fillRect(X + w * 0.46, Y + h * 0.28, w * 0.08, h * 0.1); x.fillRect(X + w * 0.45, Y + h * 0.62, w * 0.1, h * 0.2);
  x.fillStyle = "#6e5532"; x.fillRect(X + w * 0.12, Y + h * 0.4, w * 0.76, h * 0.03);
}
function thVietMap(x, X, Y, w, h) {   // bản đồ thành phố cách điệu
  x.fillStyle = "#f2e6c4"; x.fillRect(X, Y, w, h); x.fillStyle = "#c9a227"; x.fillRect(X - 0.15, Y - 0.15, w + 0.3, 0.15); x.fillRect(X - 0.15, Y + h, w + 0.3, 0.15); x.fillRect(X - 0.15, Y - 0.15, 0.15, h + 0.3); x.fillRect(X + w, Y - 0.15, 0.15, h + 0.3);
  x.fillStyle = "#bfe0f7"; x.beginPath(); x.moveTo(X, Y + h * 0.7); x.bezierCurveTo(X + w * 0.3, Y + h * 0.5, X + w * 0.6, Y + h * 0.95, X + w, Y + h * 0.6); x.lineTo(X + w, Y + h * 0.75); x.bezierCurveTo(X + w * 0.6, Y + h * 1.1, X + w * 0.3, Y + h * 0.65, X, Y + h * 0.85); x.fill();
  x.fillStyle = "#cfe3b4"; [[0.12, 0.15, 0.2, 0.25], [0.55, 0.12, 0.3, 0.3], [0.38, 0.5, 0.12, 0.15]].forEach(([a, b, ww, hh]) => x.fillRect(X + w * a, Y + h * b, w * ww, h * hh));
  x.strokeStyle = "#b9a37c"; x.lineWidth = 0.06; for (let i = 1; i < 6; i++) { x.beginPath(); x.moveTo(X + w * i / 6, Y); x.lineTo(X + w * i / 6, Y + h * 0.55); x.stroke(); } for (let j = 1; j < 3; j++) { x.beginPath(); x.moveTo(X, Y + h * j * 0.18); x.lineTo(X + w, Y + h * j * 0.18); x.stroke(); }
  x.fillStyle = "#d94f3a"; [[0.3, 0.25], [0.5, 0.2], [0.7, 0.3], [0.45, 0.4]].forEach(([a, b]) => { x.beginPath(); x.arc(X + w * a, Y + h * b, 0.1, 0, 7); x.fill(); });
  signText(x, "VERSE CITY MAP", X + w / 2, Y + h * 0.08, w * 0.6, 0.3, "#5a3d22");
}
/* tường: cornice + dentil, phào chân tường, cột ốp, từng gian (bay) = cửa sổ / tranh / ảnh / ô trơn. o = { pil:[u], bays:[{c,w,t,k,deck}], deckAll, front, map } */
function thWallTex(len, H, o) {
  return skin(len, H, 22, (x, w, h) => {
    x.fillStyle = "#f1e6c9"; x.fillRect(0, 0, w, h);
    x.fillStyle = "#e5d6ae"; x.fillRect(0, 0, w, 0.45); x.fillStyle = "#d8c692"; x.fillRect(0, 0.45, w, 0.3); x.fillStyle = "#c9a227"; x.fillRect(0, 0.75, w, 0.09); x.fillStyle = "#e5d6ae"; for (let X = 0.1; X < w; X += 0.26) x.fillRect(X, 0.86, 0.14, 0.2);
    x.fillStyle = "#c9a227"; x.fillRect(0, 1.12, w, 0.05);
    const lowerTier = (X0, X1) => { x.fillStyle = "#6e4a2c"; x.fillRect(X0, h - 3.6, X1 - X0, 3.6); x.fillStyle = "#5a3a22"; for (let X = X0 + 0.2; X < X1 - 1; X += 1.7) { x.fillRect(X, h - 3.3, 1.5, 2.7); x.fillStyle = "#7d5733"; x.fillRect(X + 0.12, h - 3.18, 1.26, 2.46); x.fillStyle = "#5a3a22"; }
      x.fillStyle = "#c9a227"; x.fillRect(X0, h - 3.65, X1 - X0, 0.08); x.fillStyle = "#e5d6ae"; x.fillRect(X0, h - 4.0, X1 - X0, 0.35); };
    if (o.deckAll) lowerTier(0, w);
    (o.bays || []).forEach(b => {
      const dk = b.deck || o.deckAll, fy = dk ? h - 4.0 : h, dh = dk ? 0.9 : 1.6, L = b.c - b.w / 2, R = b.c + b.w / 2;
      if (b.deck && !o.deckAll) lowerTier(L, R);
      x.fillStyle = "#d9c9a0"; x.fillRect(L, fy - dh, b.w, dh); x.fillStyle = "#c9a227"; x.fillRect(L, fy - dh, b.w, 0.06); x.strokeStyle = "#b9a37c"; x.lineWidth = 0.04; for (let X = L + 0.5; X < R - 1; X += 1.5) x.strokeRect(X, fy - dh + 0.15, 1.2, dh - 0.3);
      x.strokeStyle = "#d4bd78"; x.lineWidth = 0.05; x.strokeRect(L + 0.55, 1.5, b.w - 1.1, fy - dh - 1.7);   // ô phào chỉ
      if (b.t === "win") thWindow(x, b.c, 2.8, dk ? 2.4 : 2.6, fy - (dk ? 1.2 : 2.4), true);
      else if (b.t === "paint") { const bot = fy - (dk ? 1.9 : 3.0); thFrame(x, b.c - 2.0, bot - 3.0, 4.0, 3.0, b.k || 0); x.fillStyle = "#7b5d12"; x.fillRect(b.c - 0.5, bot + 0.45, 1.0, 0.24); x.fillStyle = "#e3c25a"; x.fillRect(b.c - 0.12, bot - 3.0 - 0.75, 0.24, 0.3); }
      else if (b.t === "hist") { const bot = fy - 3.0; x.fillStyle = "#c9a227"; x.fillRect(b.c - 2.0, bot - 3.0, 4.0, 3.0); x.fillStyle = "#7b5d12"; x.fillRect(b.c - 1.88, bot - 2.88, 3.76, 2.76); thSepia(x, b.c - 1.75, bot - 2.75, 3.5, 2.5);
        x.fillStyle = "#4a3526"; x.fillRect(b.c - 1.2, bot + 0.35, 2.4, 0.9); x.fillStyle = "#c9a227"; x.fillRect(b.c - 1.15, bot + 0.4, 2.3, 0.8); x.fillStyle = "#4a3526"; x.fillRect(b.c - 1.1, bot + 0.45, 2.2, 0.7); signText(x, "TOWN HALL", b.c, bot + 0.68, 2.0, 0.34, "#f2d675"); signText(x, "BUILT IN 1908 · FRENCH STYLE", b.c, bot + 1.0, 2.0, 0.17, "#f2d675"); }
      else if (b.t === "bigwin") { const top = 1.9, bot = fy - 1.0, ww = 4.8, H2 = bot - top;   // cửa sổ kính màu lớn ở tường cuối
        x.fillStyle = "#c9a227"; archPath(x, b.c - ww / 2 - 0.3, top - 0.3, ww + 0.6, H2 + 0.3); x.fill();
        const gr = x.createLinearGradient(0, top, 0, bot); gr.addColorStop(0, "#a9d4f2"); gr.addColorStop(1, "#fff3d0"); x.fillStyle = gr; archPath(x, b.c - ww / 2, top, ww, H2); x.fill();
        x.save(); archPath(x, b.c - ww / 2, top, ww, H2); x.clip(); x.strokeStyle = "#e6cf86"; x.lineWidth = 0.05; for (let i = -12; i < 14; i++) { x.beginPath(); x.moveTo(b.c + i * 0.5 - 3, top); x.lineTo(b.c + i * 0.5 + 3, bot); x.moveTo(b.c + i * 0.5 + 3, top); x.lineTo(b.c + i * 0.5 - 3, bot); x.stroke(); }
        ["#d94f3a", "#2f6fb4", "#f2c94c", "#2f9e6a"].forEach((c, ci) => { x.fillStyle = c; for (let k = 0; k < 7; k++) { const a = Math.PI + (k + 0.5) * Math.PI / 7, r = ww / 2 - 0.2 - ci * 0.0; if ((k + ci) % 4 === 0) { x.beginPath(); x.arc(b.c + Math.cos(a) * r, top + ww / 2 + Math.sin(a) * r, 0.17, 0, 7); x.fill(); } } });
        for (let j = 0; j < 10; j++) { [b.c - ww / 2 + 0.1, b.c + ww / 2 - 0.4].forEach((X, i) => { x.fillStyle = ["#d94f3a", "#2f6fb4", "#f2c94c", "#2f9e6a"][(j + i) % 4]; x.fillRect(X, top + ww / 2 + j * 0.42, 0.3, 0.3); }); }
        x.restore(); x.fillStyle = "#e9dcb6"; x.fillRect(b.c - ww / 2 - 0.5, bot, ww + 1, 0.22); }
      else if (b.t === "deckdoor") { x.fillStyle = "#c9a227"; archPath(x, b.c - 1.12, fy - 4.6, 2.24, 3.4); x.fill(); x.fillStyle = "#4a2d18"; archPath(x, b.c - 1.0, fy - 4.5, 2.0, 3.3); x.fill(); x.fillStyle = "#6e4a2c"; x.fillRect(b.c - 0.85, fy - 3.0, 0.78, 1.7); x.fillRect(b.c + 0.07, fy - 3.0, 0.78, 1.7); x.fillStyle = "#c9a227"; x.fillRect(b.c - 0.1, fy - 2.4, 0.06, 0.3); x.fillRect(b.c + 0.04, fy - 2.4, 0.06, 0.3); }
    });
    if (o.map) { const m = o.map; thVietMap(x, m.c - 3.2, h - 3.2, 6.4, 2.3); }
    if (o.lowDoors) o.lowDoors.forEach(c => { x.fillStyle = "#c9a227"; archPath(x, c - 1.1, h - 3.3, 2.2, 2.7); x.fill(); x.fillStyle = "#3a2312"; archPath(x, c - 0.98, h - 3.2, 1.96, 2.6); x.fill(); x.fillStyle = "#5a3a22"; x.fillRect(c - 0.8, h - 1.9, 0.7, 1.3); x.fillRect(c + 0.1, h - 1.9, 0.7, 1.3); });
    if (o.front) {   // cửa chính đôi + cửa sổ quạt + đồng hồ
      const c = o.front, dw = 4.0, top = h - 5.8;
      x.fillStyle = "#c9a227"; archPath(x, c - dw / 2 - 0.25, top - 0.25, dw + 0.5, 5.8 + 0.25); x.fill();
      const gr = x.createLinearGradient(0, top, 0, h); gr.addColorStop(0, "#d9efff"); gr.addColorStop(1, "#fffbe8"); x.fillStyle = gr; archPath(x, c - dw / 2, top, dw, 5.8); x.fill();
      x.strokeStyle = "#c9a227"; x.lineWidth = 0.07; x.beginPath(); for (let a = 1; a < 8; a++) { const t = Math.PI + a * Math.PI / 8; x.moveTo(c, top + dw / 2); x.lineTo(c + Math.cos(t) * dw / 2, top + dw / 2 + Math.sin(t) * dw / 2); } x.stroke();
      x.fillStyle = "#c9a227"; x.fillRect(c - dw / 2, h - 3.5, dw, 0.14);
      [c - dw / 2 + 0.1, c + 0.04].forEach(X => { x.fillStyle = "#4a2d18"; x.fillRect(X, h - 3.4, dw / 2 - 0.14, 3.4); x.fillStyle = "#6e4a2c"; x.fillRect(X + 0.2, h - 3.2, dw / 2 - 0.54, 1.4); x.fillRect(X + 0.2, h - 1.6, dw / 2 - 0.54, 1.4); x.fillStyle = "#cfe9fb"; x.fillRect(X + 0.32, h - 3.08, dw / 2 - 0.78, 1.16); });
      x.fillStyle = "#e3c25a"; x.fillRect(c - 0.3, h - 1.9, 0.12, 0.5); x.fillRect(c + 0.18, h - 1.9, 0.12, 0.5);
      x.fillStyle = "#c9a227"; x.beginPath(); x.arc(c, 3.4, 0.95, 0, 7); x.fill(); x.fillStyle = "#fffaf0"; x.beginPath(); x.arc(c, 3.4, 0.82, 0, 7); x.fill();   // đồng hồ
      x.strokeStyle = "#3a2f28"; x.lineWidth = 0.06; for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; x.beginPath(); x.moveTo(c + Math.cos(a) * 0.68, 3.4 + Math.sin(a) * 0.68); x.lineTo(c + Math.cos(a) * 0.78, 3.4 + Math.sin(a) * 0.78); x.stroke(); }
      x.lineWidth = 0.09; x.beginPath(); x.moveTo(c, 3.4); x.lineTo(c - 0.3, 3.4 - 0.25); x.moveTo(c, 3.4); x.lineTo(c + 0.5, 3.4 - 0.15); x.stroke();
    }
    (o.pil || []).forEach(p => {   // cột ốp tường (pilaster)
      const top = 1.2, bot = h - 1.0;
      x.fillStyle = "#f9f2de"; x.fillRect(p - 0.45, top, 0.9, bot - top); x.fillStyle = "#e0d2ac"; x.fillRect(p - 0.45, top, 0.06, bot - top); x.fillRect(p + 0.39, top, 0.06, bot - top); for (let k = -0.27; k < 0.3; k += 0.18) x.fillRect(p + k, top + 0.5, 0.04, bot - top - 0.9);
      x.fillStyle = "#d4b24a"; x.fillRect(p - 0.58, top, 1.16, 0.45); x.fillStyle = "#c9a227"; x.fillRect(p - 0.52, top + 0.45, 1.04, 0.1); x.fillStyle = "#e5d6ae"; x.fillRect(p - 0.58, bot - 0.35, 1.16, 0.35);
    });
  });
}
function thFloorTex() {   // đá hoa ca-rô kem – xanh đen, có vân nhẹ
  return skin(2, 2, 48, (x) => { x.fillStyle = "#ece4d0"; x.fillRect(0, 0, 2, 2); x.fillStyle = "#33463f"; x.fillRect(0, 0, 1, 1); x.fillRect(1, 1, 1, 1);
    x.strokeStyle = "rgba(140,130,110,.35)"; x.lineWidth = 0.012; x.beginPath(); x.moveTo(1.1, 0.1); x.lineTo(1.5, 0.5); x.lineTo(1.4, 0.9); x.moveTo(0.1, 1.2); x.lineTo(0.5, 1.4); x.lineTo(0.9, 1.9); x.stroke();
    x.strokeStyle = "rgba(255,255,255,.12)"; x.beginPath(); x.moveTo(0.1, 0.2); x.lineTo(0.4, 0.5); x.lineTo(0.8, 0.45); x.moveTo(1.2, 1.2); x.lineTo(1.6, 1.5); x.stroke();
    x.fillStyle = "#c9a227"; x.fillRect(0, 0, 2, 0.015); x.fillRect(0, 0, 0.015, 2); });
}
function thCeilTex() {   // trần ô hộc kem + phào vàng + hoa văn
  return skin(6, 6, 18, (x) => { x.fillStyle = "#f5eed9"; x.fillRect(0, 0, 6, 6); x.fillStyle = "#e0d2ac"; x.fillRect(0.35, 0.35, 5.3, 5.3); x.fillStyle = "#c9a227"; x.fillRect(0.45, 0.45, 5.1, 5.1); x.fillStyle = "#efe4c2"; x.fillRect(0.55, 0.55, 4.9, 4.9);
    x.fillStyle = "#f8f2e0"; x.fillRect(1.0, 1.0, 4.0, 4.0); x.strokeStyle = "#d4bd78"; x.lineWidth = 0.06; x.strokeRect(1.2, 1.2, 3.6, 3.6);
    x.fillStyle = "#c9a227"; x.beginPath(); x.arc(3, 3, 0.55, 0, 7); x.fill(); x.fillStyle = "#f8f2e0"; x.beginPath(); x.arc(3, 3, 0.4, 0, 7); x.fill(); x.fillStyle = "#c9a227"; for (let k = 0; k < 8; k++) { x.beginPath(); x.ellipse(3 + Math.cos(k * 0.785) * 0.85, 3 + Math.sin(k * 0.785) * 0.85, 0.2, 0.08, k * 0.785, 0, 7); x.fill(); } });
}
function thCarpetTex() {   // thảm đỏ viền vàng
  return skin(1, 1, 64, (x) => { x.fillStyle = "#9c1c2c"; x.fillRect(0, 0, 1, 1); x.fillStyle = "#c9a227"; x.fillRect(0.04, 0, 0.05, 1); x.fillRect(0.91, 0, 0.05, 1); x.fillStyle = "#6f1420"; x.fillRect(0.12, 0, 0.03, 1); x.fillRect(0.85, 0, 0.03, 1);
    x.fillStyle = "#c9a227"; x.beginPath(); x.moveTo(0.5, 0.2); x.lineTo(0.68, 0.5); x.lineTo(0.5, 0.8); x.lineTo(0.32, 0.5); x.closePath(); x.fill(); x.fillStyle = "#9c1c2c"; x.beginPath(); x.moveTo(0.5, 0.3); x.lineTo(0.6, 0.5); x.lineTo(0.5, 0.7); x.lineTo(0.4, 0.5); x.closePath(); x.fill(); });
}
function thRailTex() {   // lan can sắt uốn đen + hoa văn mạ vàng (nền trong suốt)
  return skin(1, 1, 64, (x) => { x.clearRect(0, 0, 1, 1); x.fillStyle = "#1b1b1b"; x.fillRect(0, 0.9, 1, 0.1); x.fillRect(0, 0.62, 1, 0.025); [0.06, 0.3, 0.54, 0.78].forEach(X => x.fillRect(X, 0.04, 0.035, 0.88));
    x.strokeStyle = "#d8b13a"; x.lineWidth = 0.035; x.beginPath(); x.arc(0.42, 0.38, 0.13, 0, 7); x.stroke(); x.beginPath(); x.arc(0.18, 0.38, 0.07, 0, 7); x.stroke(); x.beginPath(); x.arc(0.66, 0.38, 0.07, 0, 7); x.stroke(); x.beginPath(); x.arc(0.9, 0.38, 0.07, 0, 7); x.stroke();
    x.beginPath(); x.moveTo(0.0, 0.25); x.quadraticCurveTo(0.2, 0.05, 0.42, 0.25); x.quadraticCurveTo(0.65, 0.05, 0.9, 0.25); x.stroke(); x.beginPath(); x.moveTo(0, 0.52); x.quadraticCurveTo(0.2, 0.7, 0.42, 0.52); x.quadraticCurveTo(0.65, 0.7, 0.9, 0.52); x.stroke();
    x.fillStyle = "#d8b13a"; x.fillRect(0, 0, 1, 0.045); });
}
/* bảng biển: 1 ảnh chung (atlas) cho mọi biển chữ → chỉ 1 lần vẽ. Mỗi ô 512×128 (tỉ lệ 4:1), 2 cột × 8 hàng */
const TH_SIGNS = ["CITIZEN SERVICE CENTER", "RECEPTION HALL", "INFORMATION", "TAKE A NUMBER", "NOW SERVING  ▶  A025", "DESK 1", "DESK 2", "DESK 3", "DESK 4", "DESK 5", "DESK 6", "WAITING AREA", "TOWN HALL · 1908", "WELCOME"];
function thSignTex() {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 1024; const x = c.getContext("2d");
  TH_SIGNS.forEach((t, i) => { const X = (i % 2) * 512, Y = Math.floor(i / 2) * 128, disp = i === 4;
    x.fillStyle = disp ? "#0b0b0b" : "#16362b"; x.fillRect(X, Y, 512, 128); x.strokeStyle = disp ? "#555" : "#d8b13a"; x.lineWidth = 6; x.strokeRect(X + 5, Y + 5, 502, 118); x.strokeRect(X + 12, Y + 12, 488, 104);
    x.fillStyle = disp ? "#69db7c" : "#f2d675"; x.textAlign = "center"; x.textBaseline = "middle"; let f = 64; do { x.font = "bold " + f + "px system-ui, sans-serif"; f -= 2; } while (x.measureText(t).width > 440 && f > 10); x.fillText(t, X + 256, Y + 66); });
  const tx = new THREE.CanvasTexture(c); tx.anisotropy = 4; return tx;
}
function thQuestTex() {   // bảng nhiệm vụ lớn 9 × 4 m
  return skin(9, 4, 56, (x, w, h) => {
    x.fillStyle = "#5a3a22"; x.fillRect(0, 0, w, h); x.fillStyle = "#c9a227"; x.fillRect(0.1, 0.1, w - 0.2, h - 0.2); x.fillStyle = "#7b4f2a"; x.fillRect(0.2, 0.2, w - 0.4, h - 0.4);
    x.fillStyle = "#c58f55"; x.fillRect(0.4, 1.15, w - 0.8, h - 1.55); x.fillStyle = "rgba(90,58,34,.18)"; for (let i = 0; i < 140; i++) x.fillRect(0.4 + (i * 0.617) % (w - 0.9), 1.15 + (i * 0.371) % (h - 1.6), 0.07, 0.05);
    x.fillStyle = "#8c1d2a"; x.fillRect(1.6, 0.3, w - 3.2, 0.75); x.fillStyle = "#c9a227"; x.fillRect(1.6, 0.3, w - 3.2, 0.06); x.fillRect(1.6, 0.99, w - 3.2, 0.06); signText(x, "QUEST BOARD", w / 2, 0.62, w - 4.2, 0.55, "#f2d675");
    const cols = ["#fff7d6", "#d8ecff", "#ffe0e6", "#e3f6d4"], notes = [[0.8, 1.4, 1.5, 1.2], [2.6, 1.55, 1.3, 1.1], [4.2, 1.35, 1.4, 1.3], [6.0, 1.5, 1.5, 1.15], [7.5, 1.4, 1.2, 1.2], [1.0, 2.8, 1.3, 1.0], [2.8, 2.75, 1.5, 0.95], [6.2, 2.8, 1.4, 1.0], [7.7, 2.75, 1.0, 1.0]];
    notes.forEach(([X, Y, nw, nh], i) => { x.save(); x.translate(X + nw / 2, Y + nh / 2); x.rotate(((i * 37) % 11 - 5) * 0.012); x.fillStyle = "rgba(0,0,0,.2)"; x.fillRect(-nw / 2 + 0.05, -nh / 2 + 0.06, nw, nh); x.fillStyle = cols[i % 4]; x.fillRect(-nw / 2, -nh / 2, nw, nh);
      x.fillStyle = "#c92a2a"; x.beginPath(); x.arc(0, -nh / 2 + 0.12, 0.07, 0, 7); x.fill(); x.fillStyle = "#6b5a46"; for (let k = 0; k < 4; k++) x.fillRect(-nw / 2 + 0.15, -nh / 2 + 0.38 + k * 0.17, nw * (0.5 + (k * 0.13 + i * 0.07) % 0.35), 0.06); x.restore(); });
    x.fillStyle = "#fff7d6"; x.fillRect(3.55, 2.65, 2.35, 1.0); x.fillStyle = "#c92a2a"; x.beginPath(); x.arc(4.72, 2.65, 0.08, 0, 7); x.fill(); signText(x, "NEW QUESTS", 4.72, 3.05, 2.1, 0.3, "#8c1d2a"); signText(x, "COMING SOON!", 4.72, 3.4, 2.1, 0.3, "#8c1d2a");
    x.fillStyle = "#f2c94c"; [[0.65, 1.3], [8.4, 1.3], [0.65, 3.75], [8.4, 3.75]].forEach(([a, b]) => { x.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 0.1 : 0.22, t = k * Math.PI / 5 - Math.PI / 2; x.lineTo(a + Math.cos(t) * r, b + Math.sin(t) * r); } x.closePath(); x.fill(); });
  });
}
function furnishTownHall(P, g, cx, cz, W, D, fur) {
  const H = (P.size || {}).h || 12, S = P.room.solids, UP = new THREE.Vector3(0, 1, 0);
  const sol = (x, z, hw, hd) => S.push({ x: cx + x, z: cz + z, hw, hd });
  const B = (w, h, d, c, x, y, z) => lb(g, w, h, d, c, cx + x, y, cz + z);
  const grp = (x, z, ry) => { const q = new THREE.Group(); q.position.set(cx + x, 0, cz + z); q.rotation.y = ry || 0; g.add(q); return q; };
  const flat = m => { m.userData.flat = true; return m; };
  const tx = (t, rx, ry) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); return t; };
  const quad = (m, pts, uvs) => { const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pts.flat(), 3)); geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs.flat(), 2)); geo.setIndex([0, 1, 2, 0, 2, 3]); geo.computeVertexNormals(); const o = new THREE.Mesh(geo, m); g.add(o); return o; };
  const plane = (m, w, h, x, y, z, ry) => { const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); o.position.set(cx + x, y, cz + z); o.rotation.y = ry || 0; g.add(o); return o; };
  const glassM = mat(0xd0ebff, { transparent: true, opacity: 0.25 });
  const signs = thSignTex(), signM = new THREE.MeshBasicMaterial({ map: signs });
  const sign = (i, w, x, y, z, ry) => { const o = plane(signM, w, w / 4, x, y, z, ry), uv = o.geometry.attributes.uv, r = Math.floor(i / 2), c = i % 2; for (let k = 0; k < uv.count; k++) uv.setXY(k, c * 0.5 + uv.getX(k) * 0.5, 1 - (r + 1) / 8 + uv.getY(k) / 8); return o; };
  /* ---------- SÀN, TRẦN, TƯỜNG ---------- */
  g.children[0].material = new THREE.MeshLambertMaterial({ map: tx(thFloorTex(), W / 2, D / 2) });
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshLambertMaterial({ map: tx(thCeilTex(), W / 6, D / 6) })); ceil.rotation.x = Math.PI / 2; ceil.position.set(cx, H, cz); flat(ceil); g.add(ceil);
  const pilW = [], pilD = []; for (let u = 0; u <= W + 0.1; u += 6) pilW.push(u); for (let u = 0; u <= D + 0.1; u += 6) pilD.push(u);
  const fb = [3, 9, 15].flatMap(a => [18 - a, 18 + a]), frontPil = [0, 36].concat([3, 9, 15, 21, 27, 33]).filter((v, i, a) => a.indexOf(v) === i);
  const sideBays = (arr) => arr.map(([z, t, k, deck]) => ({ c: z, w: 6, t, k, deck }));   // z tính từ tường sau; u của từng tường quy đổi bên dưới
  const WEST = [[-21, "paint", 1, true], [-15, "paint", 0], [-9, "win"], [-3, "win"], [3, "win"], [9, "win"], [15, "win"], [21, "win"]];
  const EAST = [[-21, "paint", 2, true], [-15, "paint", 3], [-9, "hist"], [-3, "paint", 0], [3, "paint", 1], [9, "plain"], [15, "plain"], [21, "win"]];
  const uW = z => D / 2 - z, uE = z => D / 2 + z;
  const wallDefs = [
    { x: -W / 2, z: 0, ry: Math.PI / 2, len: D, o: { pil: pilD, bays: sideBays(WEST).map(b => Object.assign(b, { c: uW(b.c) })), lowDoors: [] } },
    { x: W / 2, z: 0, ry: -Math.PI / 2, len: D, o: { pil: pilD, bays: sideBays(EAST).map(b => Object.assign(b, { c: uE(b.c) })) } },
    { x: 0, z: -D / 2, ry: 0, len: W, o: { pil: [0, 36, 3, 33, 9, 27, 15, 21], deckAll: true, map: { c: W / 2 }, lowDoors: [W / 2 - 12, W / 2 + 12],
      bays: [{ c: W / 2, w: 6, t: "bigwin" }, { c: W / 2 - 6, w: 6, t: "paint", k: 1 }, { c: W / 2 + 6, w: 6, t: "paint", k: 2 }, { c: W / 2 - 12, w: 6, t: "win" }, { c: W / 2 + 12, w: 6, t: "win" }, { c: 1.5, w: 3, t: "plain" }, { c: W - 1.5, w: 3, t: "plain" }] } },
    { x: 0, z: D / 2, ry: Math.PI, len: W, o: { pil: frontPil, front: W / 2, bays: [{ c: W / 2 - 6, w: 6, t: "win" }, { c: W / 2 + 6, w: 6, t: "win" }, { c: W / 2 - 12, w: 6, t: "win" }, { c: W / 2 + 12, w: 6, t: "win" }] } }
  ];
  wallDefs.forEach(d => { const o = d.o; const m = new THREE.Mesh(new THREE.PlaneGeometry(d.len, H), new THREE.MeshLambertMaterial({ map: thWallTex(d.len, H, o) })); m.position.set(cx + d.x, H / 2, cz + d.z); m.rotation.y = d.ry; flat(m); g.add(m); });
  /* ---------- CỘT ĐÁ HAI DÃY + DẦM TRẦN ---------- */
  const CZ = [-2, 4, 10, 16], MARB = 0xf3eddc;
  CZ.forEach(z => [-7, 7].forEach(x => { lc(g, 0.5, 0.55, 10.4, MARB, cx + x, 5.6, cz + z, 16); B(1.3, 0.6, 1.3, 0xe0d2ac, x, 0.3, z); B(1.1, 0.25, 1.1, TH_GOLD, x, 0.72, z); B(1.35, 0.55, 1.35, TH_GOLD, x, 10.95, z); B(1.6, 0.3, 1.6, 0xe5d6ae, x, 11.35, z); sol(x, z, 0.5, 0.5); }));
  const bm = (w, h, d, x, y, z) => flat(B(w, h, d, 0xe9dcb6, x, y, z));
  [-7, 7].forEach(x => { bm(0.9, 0.9, 20, x, 11.55, 7); B(0.95, 0.06, 20, TH_GOLD, x, 11.1, 7); });
  CZ.forEach(z => { bm(W, 0.7, 0.7, 0, 11.65, z); B(W, 0.05, 0.75, TH_GOLD, 0, 11.3, z); });
  sign(0, 4, -6.5, 11.5, 7, Math.PI / 2); sign(1, 4, 6.5, 11.5, 7, -Math.PI / 2);   // biển gắn trên dầm: nhìn từ giữa sảnh
  /* ---------- THẢM ĐỎ, HUY HIỆU SÀN ---------- */
  const carpetM = new THREE.MeshLambertMaterial({ map: tx(thCarpetTex(), 1, 1) }), railM = new THREE.MeshLambertMaterial({ map: tx(thRailTex(), 1, 1), alphaTest: 0.5, side: THREE.DoubleSide, transparent: false });
  const strip = (x0, x1, z0, z1, y) => { const L = Math.abs(z1 - z0) / (x1 - x0); quad(carpetM, [[cx + x0, y, cz + z0], [cx + x1, y, cz + z0], [cx + x1, y, cz + z1], [cx + x0, y, cz + z1]], [[0, 0], [1, 0], [1, L], [0, L]]).userData.flat = true; };
  strip(-1.8, 1.8, 23.6, -17.9, 0.035);
  { const ring = (r0, r1, c, y) => { const o = new THREE.Mesh(new THREE.RingGeometry(r0, r1, 40), mat(c)); o.rotation.x = -Math.PI / 2; o.position.set(cx, y, cz + 2); flat(o); g.add(o); };
    ring(0, 3.3, 0xe9dcb6, 0.02); ring(3.0, 3.3, TH_GOLD, 0.025); ring(2.5, 2.7, 0x33463f, 0.03); ring(0, 0.9, 0x9c1c2c, 0.035); ring(0.9, 1.05, TH_GOLD, 0.04);
    for (let k = 0; k < 8; k++) { const b = lb(g, 0.12, 0.012, 4.6, TH_GOLD, cx, 0.045, cz + 2); b.rotation.y = k * Math.PI / 8; flat(b); } }
  /* ---------- CẦU THANG ĐÔI + BAN CÔNG ---------- */
  const ZS = -5, ZE = -17, RUN = 12, RISE = 4.0, NS = 24, TR = RUN / NS, RS = RISE / NS, SLOPE = Math.atan2(RISE, RUN), RLEN = Math.hypot(RUN, RISE);
  B(W, 0.4, 7, 0xefe6cf, 0, 3.8, -20.5).userData.flat = true; B(W, 0.3, 0.3, 0xe5d6ae, 0, 3.55, -17.1); B(W, 0.06, 0.34, TH_GOLD, 0, 3.4, -17.1);
  [-4, 4, -14.5, 14.5].forEach(x => { lc(g, 0.33, 0.38, 3.2, MARB, cx + x, 1.8, cz - 17.2, 14); B(0.95, 0.3, 0.95, TH_GOLD, x, 3.4, -17.2); B(0.9, 0.25, 0.9, 0xe0d2ac, x, 0.12, -17.2); sol(x, -17.2, 0.4, 0.4); });
  [-1, 1].forEach(sx => {
    const x0 = sx > 0 ? 7 : -11, sh = new THREE.Shape(); sh.moveTo(0, 0); for (let i = 0; i < NS; i++) { sh.lineTo(i * TR, (i + 1) * RS); sh.lineTo((i + 1) * TR, (i + 1) * RS); } sh.lineTo(RUN, 0); sh.lineTo(0, 0);
    const st = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 4, bevelEnabled: false }), mat(0xece3cf)); st.rotation.y = Math.PI / 2; st.position.set(cx + x0, 0, cz + ZS); g.add(st);
    // thảm đỏ bậc thang (từng bậc 1 mảnh)
    const cp = [], cu = [], ci = []; let vlen = 0, n = 0; const xa = x0 + 0.8, xb = x0 + 3.2, add = (y0, z0, y1, z1) => { const d = Math.hypot(y1 - y0, z1 - z0) / 2.4; cp.push(cx + xa, y0 + 0.02, cz + z0, cx + xb, y0 + 0.02, cz + z0, cx + xb, y1 + 0.02, cz + z1, cx + xa, y1 + 0.02, cz + z1); cu.push(0, vlen, 1, vlen, 1, vlen + d, 0, vlen + d); vlen += d; ci.push(n, n + 1, n + 2, n, n + 2, n + 3); n += 4; };
    for (let i = 0; i < NS; i++) { add(i * RS, ZS - i * TR, (i + 1) * RS, ZS - i * TR); add((i + 1) * RS, ZS - i * TR, (i + 1) * RS, ZS - (i + 1) * TR); }
    const cg = new THREE.BufferGeometry(); cg.setAttribute("position", new THREE.Float32BufferAttribute(cp, 3)); cg.setAttribute("uv", new THREE.Float32BufferAttribute(cu, 2)); cg.setIndex(ci); cg.computeVertexNormals(); g.add(new THREE.Mesh(cg, carpetM));
    strip(x0 + 0.8, x0 + 3.2, ZE, ZE - 2.8, 4.02);
    // lan can hai bên + tay vịn mạ vàng + trụ đèn
    [x0 + 0.06, x0 + 3.94].forEach(rx => { const y0 = 0.17; quad(railM, [[cx + rx, y0, cz + ZS], [cx + rx, y0 + RISE, cz + ZE], [cx + rx, y0 + RISE + 1, cz + ZE], [cx + rx, y0 + 1, cz + ZS]], [[0, 0], [RLEN, 0], [RLEN, 1], [0, 1]]);
      const hr = B(0.1, 0.1, RLEN, TH_GOLD, rx, y0 + 1 + RISE / 2, (ZS + ZE) / 2); hr.rotation.x = SLOPE;
      [[ZS, y0], [ZE, y0 + RISE]].forEach(([pz, py]) => { B(0.2, 1.25, 0.2, 0xe5d6ae, rx, py + 0.62, pz); B(0.26, 0.1, 0.26, TH_GOLD, rx, py + 1.28, pz); const gl = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), thBasic(0xfff2c0)); gl.position.set(cx + rx, py + 1.55, cz + pz); g.add(gl); }); });
    sol(x0 + 2, (ZS + ZE) / 2, 2.0, RUN / 2);
  });
  [[-18, -11], [-7, 7], [11, 18]].forEach(([a, b]) => { const L = b - a; quad(railM, [[cx + a, 4, cz - 17.05], [cx + b, 4, cz - 17.05], [cx + b, 5, cz - 17.05], [cx + a, 5, cz - 17.05]], [[0, 0], [L, 0], [L, 1], [0, 1]]); B(L, 0.1, 0.1, TH_GOLD, (a + b) / 2, 5.02, -17.05); });
  // ban công: cây cảnh, ghế dài, đèn
  const palm = (x, z, s, y0) => { const y = y0 || 0; lc(g, 0.4 * s, 0.3 * s, 0.7 * s, 0xf4efe4, cx + x, y + 0.35 * s, cz + z, 12); lc(g, 0.3 * s, 0.3 * s, 0.05, 0x4a3526, cx + x, y + 0.7 * s, cz + z, 10);
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, L = 1.5 * s, lf = lb(g, 0.3 * s, 0.03, L, k % 2 ? 0x2b8a3e : 0x40c057, cx + x + Math.cos(a) * 0.62 * s, y + 1.25 * s, cz + z + Math.sin(a) * 0.62 * s); lf.rotation.order = "YXZ"; lf.rotation.set(-0.75, Math.PI / 2 - a, 0); } };
  palm(-16.2, -22.5, 1.6, 4.0); palm(16.2, -22.5, 1.6, 4.0); palm(-13, -22.7, 1.2, 4.0); palm(13, -22.7, 1.2, 4.0);
  /* ---------- QUẦY THÔNG TIN (ông Lee đứng sau: P.keeperPos) ---------- */
  P.keeperPos = [0, -21.6];
  B(7, 1.1, 1.2, 0x5a3a22, 0, 0.55, -19.6); B(7.2, 0.1, 1.45, 0xefe6cf, 0, 1.15, -19.6); B(6.6, 0.5, 0.04, TH_GOLD, 0, 0.55, -18.99); B(6.4, 0.7, 0.04, 0x6e4a2c, 0, 0.6, -18.97);
  [-3.4, 3.4].forEach(x => B(0.3, 1.5, 1.5, 0x6e4a2c, x, 0.75, -19.6)); sol(0, -19.6, 3.6, 0.7);
  sign(2, 3.6, 0, 2.9, -18.2, 0);   // INFORMATION treo dưới ban công
  [-1.6, 1.6].forEach(x => { B(0.06, 0.45, 0.06, 0x333333, x, 3.35, -18.2); });
  B(0.55, 0.4, 0.06, 0x1b1b1b, 2.2, 1.45, -19.9).rotation.y = 0.3; B(0.5, 0.04, 0.3, 0x333333, 2.2, 1.22, -19.4); B(0.5, 0.06, 0.5, 0xc9a227, -2.5, 1.25, -19.5); lc(g, 0.1, 0.14, 0.12, TH_GOLD, cx - 1.2, 1.26, cz - 19.4, 12); lc(g, 0.17, 0.17, 0.06, 0xefe6cf, cx - 1.2, 1.35, cz - 19.4, 12);   // màn hình, bàn phím, sổ khách, chuông
  B(0.5, 0.35, 0.4, 0xefe6cf, 1.0, 1.4, -19.2); lc(g, 0.08, 0.08, 0.2, 0x2f6fb4, cx + 0.2, 1.3, cz - 19.3, 10);
  [-6, 6].forEach(x => B(0.9, 0.9, 0.9, 0xe0d2ac, x, 0.45, -22.8));   // bệ đá hai bên quầy
  [-6, 6].forEach(x => palm(x, -22.8, 1.1, 0.9));
  [-5.2, 5.2].forEach(x => { B(0.2, 0.2, 0.2, TH_GOLD, x, 3.4, -23.2); });
  /* ---------- TRUNG TÂM DỊCH VỤ CÔNG DÂN (cánh trái) ---------- */
  const zi = [2.1, 4.5, 6.9, 9.3, 11.7, 14.1];
  B(1.2, 1.1, 14.6, 0x6e4a2c, -15.2, 0.55, 8.1); B(1.4, 0.08, 14.8, 0xefe6cf, -15.2, 1.14, 8.1); B(0.04, 0.6, 14.6, TH_GOLD, -14.58, 0.7, 8.1); B(0.05, 1.4, 14.6, 0xd0ebff, -15.3, 1.9, 8.1).material = glassM;
  B(0.4, 0.55, 14.8, 0x6e4a2c, -15.7, 3.25, 8.1); B(0.45, 0.08, 14.9, TH_GOLD, -15.7, 3.55, 8.1); sol(-15.2, 8.1, 0.6, 7.3);
  [0.9, 3.3, 5.7, 8.1, 10.5, 12.9, 15.3].forEach(z => B(0.1, 1.9, 0.1, TH_GOLD, -15.25, 2.05, z));
  zi.forEach((z, i) => { sign(5 + i, 1.5, -15.45, 3.25, z, Math.PI / 2); B(0.5, 0.36, 0.05, 0x1b1b1b, -15.95, 1.42, z - 0.5).rotation.y = Math.PI / 2; B(0.45, 0.03, 0.2, 0x333333, -15.6, 1.2, z - 0.5); B(0.5, 0.01, 0.35, 0xf1e6c9, -15.5, 1.2, z + 0.5); });
  sign(4, 3.6, -15.5, 4.15, 8.1, Math.PI / 2); B(0.05, 0.9, 0.06, 0x333333, -15.55, 3.75, 6.5); B(0.05, 0.9, 0.06, 0x333333, -15.55, 3.75, 9.7);
  const bench = (x, z, ry, len) => { const q = grp(x, z, ry); lb(q, len, 0.1, 0.6, 0x8d5a2b, 0, 0.5, 0); lb(q, len, 0.1, 0.5, 0x9c1c2c, 0, 0.58, 0); lb(q, len, 0.7, 0.1, 0x8d5a2b, 0, 0.92, -0.3); lb(q, len - 0.2, 0.5, 0.06, 0x9c1c2c, 0, 0.95, -0.24); [-1, 1].forEach(s => { lb(q, 0.1, 0.5, 0.5, 0x5a3a22, s * (len / 2 - 0.1), 0.25, 0); lb(q, 0.12, 0.25, 0.6, TH_GOLD, s * (len / 2 - 0.1), 0.62, 0); }); };
  [4.5, 9, 13.5].forEach(z => { bench(-9.6, z, -Math.PI / 2, 3); sol(-9.6, z, 0.4, 1.6); });
  sign(11, 3, -7.2, 3.3, 8.6, Math.PI / 2); B(0.05, 3.1, 0.05, 0x333333, -7.25, 1.6, 7.3); B(0.05, 3.1, 0.05, 0x333333, -7.25, 1.6, 9.9);   // biển WAITING AREA trên 2 cột nhỏ
  { const q = grp(-10.5, 17.6, Math.PI / 2); lb(q, 0.8, 1.7, 0.6, 0x1c4a8c, 0, 0.85, 0); lb(q, 0.9, 0.1, 0.7, TH_GOLD, 0, 1.75, 0); lb(q, 0.5, 0.25, 0.04, 0x69db7c, 0, 1.35, 0.32).material = thBasic(0x69db7c); lb(q, 0.2, 0.2, 0.08, 0xc92a2a, 0, 0.95, 0.33); lb(q, 0.4, 0.04, 0.16, 0xffffff, 0, 0.7, 0.33);
    const sg = sign(3, 1.0, -10.5 + 0.34, 1.9, 17.6, Math.PI / 2); sg.position.y = 2.1; sol(-10.5, 17.6, 0.35, 0.5); }
  palm(-17, -1.2, 1.3); palm(-17, 17.8, 1.3); palm(-8.3, 1.2, 1.1);
  /* ---------- PHÒNG TIẾP KHÁCH (cánh phải) ---------- */
  B(5.6, 0.02, 10.6, TH_GOLD, 13.2, 0.04, 0.4); B(5.2, 0.025, 10.2, 0x7d1f2a, 13.2, 0.05, 0.4); B(4.2, 0.03, 9.2, 0x5f1822, 13.2, 0.06, 0.4);
  { const tg = grp(13.2, 0.4, 0); lb(tg, 1.9, 0.12, 8, 0x4a2616, 0, 0.78, 0); lb(tg, 1.8, 0.02, 7.9, 0x6b3a20, 0, 0.85, 0); lb(tg, 1.95, 0.05, 8.05, TH_GOLD, 0, 0.72, 0); [-3, 0, 3].forEach(z => lb(tg, 1.3, 0.72, 0.5, 0x3a1d0e, 0, 0.36, z));
    [-1.1, 1.1].forEach(dx => [-3.6, -1.2, 1.2, 3.6].forEach(dz => { lc(tg, 0.05, 0.05, 0.22, 0xffffff, dx * 0.4, 0.97, dz, 8); lc(tg, 0.07, 0.05, 0.2, 0xd0ebff, dx * 0.5, 1.06, dz + 0.4, 10); }));
    [-2.4, 0, 2.4].forEach((dz, i) => { const v = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.12, 0.4, 12), mat(0x2f6fb4)); v.position.set(0, 1.05, dz); tg.add(v); lb(tg, 0.36, 0.05, 0.36, TH_GOLD, 0, 1.27, dz); const fl = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), mat([0xf783ac, 0xff922b, 0xfa5252][i])); fl.position.set(0, 1.5, dz); tg.add(fl); }); }
  const chair = (x, z, ry) => { const q = grp(x, z, ry); lb(q, 0.55, 0.12, 0.55, 0x9c1c2c, 0, 0.5, 0); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => lb(q, 0.07, 0.5, 0.07, TH_GOLD, a * 0.23, 0.25, b * 0.23)); lb(q, 0.6, 1.0, 0.08, TH_GOLD, 0, 0.98, -0.26); lb(q, 0.48, 0.82, 0.06, 0x9c1c2c, 0, 1.0, -0.22); lb(q, 0.62, 0.1, 0.1, TH_GOLD, 0, 1.52, -0.26); };
  [-2.6, -1.4, -0.2, 1.0, 2.2, 3.4].forEach(z => { chair(11.6, z + 0.4, Math.PI / 2); chair(14.8, z + 0.4, -Math.PI / 2); }); chair(13.2, -4.0, 0); chair(13.2, 4.8, Math.PI);
  sol(13.2, 0.4, 1.0, 4.0); sol(11.45, 0.8, 0.35, 3.4); sol(14.95, 0.8, 0.35, 3.4); sol(13.2, -4.0, 0.35, 0.35); sol(13.2, 4.8, 0.35, 0.35);
  palm(17, -4.6, 1.3); palm(17, 5.6, 1.3); palm(8.3, 6.6, 1.1);
  [8.2, 18.2].forEach(z => { B(0.4, 0.4, 0.4, TH_GOLD, 7.4, 1.05, z); });
  /* ---------- BẢNG NHIỆM VỤ (tường phải, gần cửa) ---------- */
  { const qm = new THREE.MeshBasicMaterial({ map: thQuestTex() }), qb = plane(qm, 9, 4, 17.93, 3.4, 13, -Math.PI / 2); qb.userData.flat = true; B(0.3, 0.5, 9.4, 0x5a3a22, 17.8, 1.15, 13); B(0.3, 0.2, 9.6, TH_GOLD, 17.8, 1.45, 13);
    const q = grp(15.8, 21.2, Math.PI); lb(q, 0.9, 1.1, 0.7, 0x5a3a22, 0, 0.55, 0); lb(q, 1.0, 0.08, 0.8, TH_GOLD, 0, 1.12, 0); lb(q, 0.7, 0.05, 0.5, 0xfff3c4, 0, 1.2, 0); sol(15.8, 21.2, 0.5, 0.4);   // bàn đọc nhiệm vụ
    [8, 18].forEach(z => { lc(g, 0.12, 0.14, 1.0, TH_GOLD, cx + 16.4, 0.5, cz + z, 10); }); }
  palm(17, 19.8, 1.2); palm(-17, 21.5, 1.2); palm(17, 21.6, 1.1);
  /* ---------- CỬA CHÍNH: bình hoa lớn, thảm ---------- */
  [-3.6, 3.6].forEach(x => { const v = new THREE.Mesh(new THREE.LatheGeometry([[0.01, 0], [0.45, 0.05], [0.65, 0.45], [0.5, 1.0], [0.28, 1.25], [0.38, 1.45], [0.01, 1.45]].map(([r, y]) => new THREE.Vector2(r, y)), 14), mat(0x2f6fb4)); v.position.set(cx + x, 0, cz + 22.6); g.add(v); lc(g, 0.4, 0.4, 0.06, TH_GOLD, cx + x, 1.0, cz + 22.6, 14); sol(x, 22.6, 0.6, 0.6);
    for (let k = 0; k < 5; k++) { const a = k * 1.26, br = lb(g, 0.04, 1.1, 0.04, 0x2b8a3e, cx + x + Math.cos(a) * 0.25, 1.9, cz + 22.6 + Math.sin(a) * 0.25); br.rotation.z = Math.cos(a) * 0.4; br.rotation.x = Math.sin(a) * 0.4; const fl = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), mat([0xf783ac, 0xff922b, 0xfa5252, 0xffd43b, 0xf783ac][k])); fl.position.set(cx + x + Math.cos(a) * 0.5, 2.5, cz + 22.6 + Math.sin(a) * 0.5); g.add(fl); } });
  /* ---------- ĐÈN CHÙM PHA LÊ ---------- */
  const chand = (x, z, s, y) => { const q = new THREE.Group(); q.position.set(cx + x, y, cz + z); g.add(q);
    lc(q, 0.03, 0.03, H - y, TH_GOLD, 0, (H - y) / 2, 0, 6); lc(q, 0.1 * s, 0.14 * s, 1.0 * s, TH_GOLD, 0, 0.5 * s, 0, 10);
    [[1.3, 0.2, 14], [0.9, 0.62, 10], [0.5, 0.98, 6]].forEach(([r, yy, nc], ti) => { const tor = new THREE.Mesh(new THREE.TorusGeometry(r * s, 0.05 * s, 6, 24), mat(TH_GOLD)); tor.rotation.x = Math.PI / 2; tor.position.y = yy * s; q.add(tor);
      for (let k = 0; k < nc; k++) { const a = k * Math.PI * 2 / nc, px = Math.cos(a) * r * s, pz = Math.sin(a) * r * s;
        if (ti < 2 && k % 2 === 0) { const sp = lb(q, r * s, 0.04, 0.04, TH_GOLD, px / 2, yy * s, pz / 2); sp.rotation.y = -a; }
        lc(q, 0.04 * s, 0.04 * s, 0.26 * s, 0xfff8e0, px, (yy + 0.14) * s, pz, 6); const fl = new THREE.Mesh(new THREE.SphereGeometry(0.055 * s, 5, 4), thBasic(0xffe9a0)); fl.position.set(px, (yy + 0.32) * s, pz); q.add(fl);
        const dr = new THREE.Mesh(new THREE.OctahedronGeometry(0.075 * s), thBasic(0xe3f2ff)); dr.scale.set(1, 2.2, 1); dr.position.set(px, (yy - 0.16) * s, pz); q.add(dr); } });
    const pd = new THREE.Mesh(new THREE.OctahedronGeometry(0.2 * s), thBasic(0xe3f2ff)); pd.scale.set(1, 2.4, 1); pd.position.y = -0.2 * s; q.add(pd); };
  chand(0, 14, 1.0, 8.4); chand(0, 5, 1.3, 8.2); chand(0, -4, 1.0, 8.4); chand(-12.5, 8, 0.8, 8.8); chand(13.2, 0.4, 0.9, 8.6);
  /* ---------- đèn tường (bóng tròn vàng) giữa các cột ốp ---------- */
  [-1, 1].forEach(s => [-12, 0, 12, 20].forEach(z => { const gl = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), thBasic(0xfff2c0)); gl.position.set(cx + s * (W / 2 - 0.5), 5.2, cz + z + 3); g.add(gl); B(0.12, 0.3, 0.3, TH_GOLD, s * (W / 2 - 0.3), 5.0, z + 3); }));
  g.traverse(o => { if (o.isMesh && o.position.y > 7) o.userData.flat = true; });
  /* ---------- CHỖ BÀY ĐỒ TỪ VỰNG ---------- */
  const A = (x, y, z, sx, sz) => [cx + x, y, cz + z, cx + sx, cz + sz];
  P.anchors = {
    info: [-2.4, -1.2, 0, 1.2, 2.4].map((x, i) => A(x, 1.7 + (i % 2) * 0.12, -19.6, x, -17.9)),
    service: [A(-10.5, 2.0, 17.6, -9.1, 17.6)].concat(zi.map(z => A(-15.0, 1.65, z, -13.4, z))),
    stairs: [A(7.0, 2.4, -10, 5.9, -10), A(-5.2, 4.9, -17.05, -5.2, -15.4), A(0, 8.0, 5, 0, 5.8), A(-7.0, 3.5, -11, -5.9, -11), A(1.3, 0.55, 12, 2.4, 12), A(-17.2, 3.4, -3, -16, -3), A(-3, 0.6, 9, -3, 10)],
    hall: [A(13.2, 1.1, -1.8, 10.2, -1.8), A(11.6, 1.7, 1.0, 10.2, 1.0), A(13.2, 1.25, 1.0, 10.2, 2.0), A(13.2, 1.2, 2.2, 10.2, 3.0), A(13.2, 1.7, -3.2, 10.2, -3.2)],
    quest: [A(17.4, 4.6, 13, 15.6, 13), A(17.4, 2.6, 9.6, 15.6, 9.6), A(17.4, 2.7, 11.3, 15.6, 11.3), A(17.4, 2.6, 14.9, 15.6, 14.9), A(17.4, 2.7, 16.6, 15.6, 16.6)],
    wall: [A(17.5, 1.9, -9, 15.4, -7.2), A(17.5, 4.9, -9, 15.4, -8.6)]
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["townhall"] = {
  furnish: furnishTownHall,
  customWalls: true,
  bright: true
};
