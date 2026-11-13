/* EnglishVerse – nội thất "museum" (layout: "museumhall"). Tách khỏi index.html để mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, face, textPlate, addBox…) – chúng có sẵn khi nội thất được dựng. */
/* CITY MUSEUM – bảo tàng lớn 60 × 72 m: sảnh chính dọc giữa (vé, bản đồ, quà lưu niệm) + 4 khu, mỗi khu 24 × 36 m:
   🦖 Dinosaur Hall (trước–trái): sảnh đá kiểu Romanesque, mái vòm có ô kính, cầu thang lớn, bộ xương T. rex + khủng long cổ dài, thằn lằn bay treo trần, tủ hóa thạch
   🗿 Sculpture & Antiques (sau–trái): sân trong mái kính, tường đá vòm cuốn, bậc thềm, tượng cẩm thạch, tượng ngựa, cây xanh, tủ cổ vật, trống đồng Đông Sơn
   🖼️ Painting Gallery (sau–phải): tường đỏ, khung vàng, trần có giếng trời dài, sàn gỗ xương cá, tranh nổi tiếng (vẽ lại đơn giản) + bảng tên tác giả
   🚀 Science & Space (trước–phải): mái vòm lưới thép trắng, tường xanh sao trời, quả địa cầu khổng lồ, tên lửa, trạm vũ trụ, máy bay, hành tinh treo, góc thí nghiệm
   Camera bị giữ trong khu đang đứng (không nhìn xuyên vách). */
function museumPaint(kind) {   // tranh vẽ lại đơn giản (tranh gốc đều đã thuộc phạm vi công cộng); trả về texture
  return skin(3, 2.2, 70, (x, W, H) => {
    const bg = (c) => { x.fillStyle = c; x.fillRect(0, 0, W, H); }, ell = (c, a, b, rx, ry, r) => { x.fillStyle = c; x.beginPath(); x.ellipse(a, b, rx, ry, r || 0, 0, 7); x.fill(); };
    if (kind === "starry") { bg("#1d3b78"); x.strokeStyle = "#8fb3e8"; x.lineWidth = 0.06; for (let i = 0; i < 9; i++) { x.beginPath(); x.arc(0.6 + i * 0.32, 0.6 + (i % 3) * 0.2, 0.25 + (i % 2) * 0.1, i, i + 3.5); x.stroke(); }
      [[0.5, 0.4], [1.2, 0.3], [1.8, 0.6], [2.3, 0.3], [0.9, 0.9]].forEach(([a, b]) => { ell("#f7e27a55", a, b, 0.16, 0.16); ell("#ffe873", a, b, 0.07, 0.07); }); ell("#ffd43b", 2.7, 0.35, 0.16, 0.16); ell("#1d3b78", 2.75, 0.32, 0.13, 0.13);
      x.fillStyle = "#20302a"; x.beginPath(); x.moveTo(0.35, H); x.quadraticCurveTo(0.2, 1, 0.45, 0.3); x.quadraticCurveTo(0.7, 1.1, 0.7, H); x.fill();
      x.fillStyle = "#2d3e5c"; x.fillRect(0, 1.75, W, 0.45); for (let i = 0; i < 8; i++) { x.fillStyle = "#4b5a73"; x.fillRect(1 + i * 0.22, 1.7, 0.16, 0.14); x.fillStyle = "#ffd43b"; x.fillRect(1.04 + i * 0.22, 1.73, 0.04, 0.04); } }
    if (kind === "wave") { bg("#efe3c4"); ell("#f1f3f5", 2.1, 1.35, 0.32, 0.12); x.fillStyle = "#6c7a89"; x.beginPath(); x.moveTo(1.75, 1.45); x.lineTo(2.1, 1.1); x.lineTo(2.45, 1.45); x.fill();
      x.fillStyle = "#1f3f73"; x.beginPath(); x.moveTo(0, H); x.quadraticCurveTo(0.2, 0.6, 1.1, 0.4); x.quadraticCurveTo(1.6, 0.35, 1.5, 0.75); x.quadraticCurveTo(1.0, 0.6, 0.9, 1.1); x.quadraticCurveTo(1.4, 1.6, 2.6, 1.7); x.lineTo(W, H); x.fill();
      x.fillStyle = "#ffffff"; for (let i = 0; i < 7; i++) { x.beginPath(); x.arc(1.1 + i * 0.06, 0.42 + i * 0.03, 0.05, 0, 7); x.fill(); } x.fillStyle = "#c9a26b"; x.fillRect(0.6, 1.75, 0.8, 0.08); x.fillRect(1.9, 1.85, 0.7, 0.08); }
    if (kind === "sunflowers") { bg("#e8c547"); x.fillStyle = "#c98a2b"; x.fillRect(0, 1.65, W, 0.55); x.fillStyle = "#d9a441"; x.beginPath(); x.moveTo(1.15, 1.95); x.lineTo(1.85, 1.95); x.lineTo(1.75, 1.25); x.lineTo(1.25, 1.25); x.fill();
      [[1.2, 0.6], [1.6, 0.4], [1.95, 0.75], [1.0, 1.0], [1.5, 0.95], [2.1, 1.1]].forEach(([a, b]) => { for (let k = 0; k < 10; k++) ell("#f59f00", a + Math.cos(k * 0.63) * 0.13, b + Math.sin(k * 0.63) * 0.13, 0.08, 0.04, k * 0.63); ell("#7a4b25", a, b, 0.09, 0.09); }); }
    if (kind === "scream") { bg("#e8590c"); x.strokeStyle = "#ffb54a"; x.lineWidth = 0.08; for (let j = 0.15; j < 1; j += 0.18) { x.beginPath(); x.moveTo(0, j); x.bezierCurveTo(1, j + 0.2, 2, j - 0.2, W, j + 0.1); x.stroke(); }
      x.fillStyle = "#2b4c8c"; x.beginPath(); x.moveTo(1.2, 1); x.quadraticCurveTo(2.2, 0.9, W, 1.2); x.lineTo(W, 1.5); x.quadraticCurveTo(2, 1.4, 1.2, 1); x.fill();
      x.fillStyle = "#8a5a35"; x.beginPath(); x.moveTo(0, 2.2); x.lineTo(0, 1.6); x.lineTo(W, 0.9); x.lineTo(W, 1.1); x.lineTo(0.6, 2.2); x.fill(); x.strokeStyle = "#5c3a1e"; x.lineWidth = 0.04; x.beginPath(); x.moveTo(0, 1.4); x.lineTo(W, 0.75); x.stroke();
      x.fillStyle = "#2a2a3a"; x.beginPath(); x.moveTo(0.75, H); x.quadraticCurveTo(0.8, 1.7, 0.95, 1.55); x.quadraticCurveTo(1.15, 1.7, 1.2, H); x.fill(); ell("#e8dcb0", 0.95, 1.4, 0.15, 0.22); ell("#3a2a2a", 0.95, 1.45, 0.04, 0.07); ell("#3a2a2a", 0.9, 1.33, 0.02, 0.03); ell("#3a2a2a", 1.0, 1.33, 0.02, 0.03); }
    if (kind === "mona") { bg("#5b6b4a"); x.fillStyle = "#7f8f6a"; x.beginPath(); x.moveTo(0, 0.9); x.quadraticCurveTo(0.7, 0.5, 1.2, 0.9); x.lineTo(1.2, 2.2); x.lineTo(0, 2.2); x.fill(); x.beginPath(); x.moveTo(1.8, 0.9); x.quadraticCurveTo(2.4, 0.6, 3, 0.8); x.lineTo(3, 2.2); x.fill();
      x.fillStyle = "#2b2418"; x.beginPath(); x.moveTo(0.75, H); x.quadraticCurveTo(0.85, 1.15, 1.5, 1.1); x.quadraticCurveTo(2.15, 1.15, 2.25, H); x.fill(); ell("#2b2418", 1.5, 0.75, 0.32, 0.45); ell("#d9b07a", 1.5, 0.72, 0.22, 0.3); x.fillStyle = "#d9b07a"; x.fillRect(1.38, 0.98, 0.24, 0.2);
      x.strokeStyle = "#7a4b2a"; x.lineWidth = 0.025; x.beginPath(); x.arc(1.5, 0.8, 0.07, 0.3, 2.8); x.stroke(); ell("#3a2a1a", 1.42, 0.66, 0.025, 0.015); ell("#3a2a1a", 1.58, 0.66, 0.025, 0.015); ell("#d9b07a", 1.4, 1.95, 0.25, 0.08); }
    if (kind === "pearl") { bg("#1c1b19"); ell("#e8c99a", 1.5, 1.2, 0.42, 0.55); ell("#2f5aa8", 1.4, 0.62, 0.5, 0.3, -0.2); ell("#e8c547", 1.9, 0.75, 0.15, 0.4, 0.3); ell("#c99a5a", 1.4, 1.8, 0.7, 0.3);
      ell("#3a2a1a", 1.35, 1.1, 0.04, 0.03); ell("#3a2a1a", 1.62, 1.1, 0.04, 0.03); ell("#b0574a", 1.5, 1.45, 0.08, 0.035); ell("#ffffff", 1.82, 1.38, 0.06, 0.06); }
    if (kind === "lilies") { bg("#3f7f8c"); x.fillStyle = "#5fa3a0"; for (let j = 0.2; j < H; j += 0.3) x.fillRect(0, j, W, 0.06);
      [[0.5, 0.5], [1.4, 0.9], [2.3, 0.4], [0.9, 1.6], [2.0, 1.5], [2.7, 1.9]].forEach(([a, b]) => { ell("#4f9a52", a, b, 0.3, 0.12); ell("#f3a6c8", a + 0.05, b - 0.04, 0.07, 0.05); }); }
    if (kind === "rice") { bg("#ffd8a8"); ell("#ffe066", 2.3, 0.5, 0.25, 0.25); x.fillStyle = "#74b816"; x.fillRect(0, 1.1, W, 1.1); x.strokeStyle = "#5c940d"; x.lineWidth = 0.04; for (let j = 1.2; j < H; j += 0.15) { x.beginPath(); x.moveTo(0, j); x.lineTo(W, j + 0.05); x.stroke(); }
      x.fillStyle = "#495057"; x.beginPath(); x.moveTo(0, 1.1); x.lineTo(0.6, 0.7); x.lineTo(1.3, 1.1); x.fill(); x.fillStyle = "#e8c547"; x.beginPath(); x.moveTo(1.3, 1.5); x.lineTo(1.5, 1.35); x.lineTo(1.7, 1.5); x.fill(); x.fillStyle = "#343a40"; x.fillRect(1.47, 1.5, 0.06, 0.25); }
    if (kind === "fisher") { bg("#3d342b"); ell("#c4956a", 1.5, 0.95, 0.38, 0.5); x.fillStyle = "#e9ecef"; x.beginPath(); x.moveTo(1.15, 1.2); x.quadraticCurveTo(1.5, 1.8, 1.85, 1.2); x.fill(); ell("#4a6a8a", 1.5, 2.0, 0.8, 0.35);
      ell("#2a2018", 1.35, 0.85, 0.04, 0.03); ell("#2a2018", 1.65, 0.85, 0.04, 0.03); x.fillStyle = "#6b4a2b"; x.beginPath(); x.moveTo(0.9, 0.55); x.lineTo(1.5, 0.15); x.lineTo(2.1, 0.55); x.fill(); }
    if (kind === "river") { bg("#a5d8ff"); x.fillStyle = "#868e96"; x.beginPath(); x.moveTo(0, 1.3); x.lineTo(0.8, 0.4); x.lineTo(1.5, 1.2); x.lineTo(2.2, 0.5); x.lineTo(W, 1.3); x.fill(); x.fillStyle = "#f8f9fa"; x.beginPath(); x.moveTo(0.65, 0.58); x.lineTo(0.8, 0.4); x.lineTo(0.95, 0.58); x.fill();
      x.fillStyle = "#40c057"; x.fillRect(0, 1.3, W, 0.9); x.fillStyle = "#4dabf7"; x.beginPath(); x.moveTo(1.3, 1.3); x.quadraticCurveTo(0.8, 1.7, 1.6, H); x.lineTo(2.2, H); x.quadraticCurveTo(1.4, 1.7, 1.6, 1.3); x.fill(); }
    if (kind === "fruit") { bg("#5c4033"); x.fillStyle = "#8d6e63"; x.fillRect(0, 1.5, W, 0.7); ell("#d9d2c4", 1.5, 1.55, 0.8, 0.18); ell("#e03131", 1.2, 1.35, 0.18, 0.17); ell("#fab005", 1.55, 1.3, 0.2, 0.18); ell("#69db7c", 1.85, 1.38, 0.16, 0.15); ell("#7048e8", 1.4, 1.15, 0.1, 0.1); ell("#7048e8", 1.52, 1.12, 0.1, 0.1); }
    if (kind === "ship") { bg("#d0ebff"); x.fillStyle = "#1c7ed6"; x.fillRect(0, 1.3, W, 0.9); x.strokeStyle = "#ffffff"; x.lineWidth = 0.03; for (let j = 1.4; j < H; j += 0.2) { x.beginPath(); x.moveTo(0.2, j); x.lineTo(0.6, j - 0.04); x.moveTo(1.9, j); x.lineTo(2.4, j + 0.04); x.stroke(); }
      x.fillStyle = "#6b3a1e"; x.beginPath(); x.moveTo(0.9, 1.25); x.lineTo(2.1, 1.25); x.lineTo(1.9, 1.45); x.lineTo(1.1, 1.45); x.fill(); x.fillStyle = "#f8f9fa"; x.beginPath(); x.moveTo(1.5, 0.35); x.lineTo(1.5, 1.2); x.lineTo(2.0, 1.2); x.fill(); x.beginPath(); x.moveTo(1.45, 0.45); x.lineTo(1.45, 1.2); x.lineTo(1.05, 1.2); x.fill(); }
  });
}
function furnishMuseum(P, g, cx, cz, W, D, fur) {
  const H = (P.size || {}).h || 14, S = P.room.solids, BONE = 0xe9dfc6, MARBLE = 0xf1efe9, GOLD = 0xc9a227, up = new THREE.Vector3(0, 1, 0);
  const sol = (x, z, hw, hd) => S.push({ x, z, hw, hd });
  const tx = (t, rx, ry) => { const c = t.clone(); c.needsUpdate = true; c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); return c; };
  const flatM = (t, basic) => basic ? new THREE.MeshBasicMaterial({ map: t, side: THREE.DoubleSide }) : new THREE.MeshLambertMaterial({ map: t, side: THREE.DoubleSide });
  const floor = (t, x0, x1, z0, z1, rx, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), new THREE.MeshLambertMaterial({ map: tx(t, rx, ry) })); m.rotation.x = -Math.PI / 2; m.position.set(cx + (x0 + x1) / 2, 0.006, cz + (z0 + z1) / 2); g.add(m); };
  const sign = (t, w, x, y, z, ry, bg, fg) => { const p = textPlate(t, w, w * 0.12, bg || "#3b2f2a", fg || "#ffe9a8"); p.position.set(x, y, z); p.rotation.y = ry || 0; g.add(p); return p; };
  const bone = (grp, a, b, r, c) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.85, d.length(), 7), mat(c || BONE)); m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(up, d.normalize()); grp.add(m); return m; };
  const ball = (grp, r, c, x, y, z, sx, sy, sz) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), mat(c)); m.position.set(x, y, z); m.scale.set(sx || 1, sy || 1, sz || 1); grp.add(m); return m; };
  const grp = (x, z, ry, y) => { const q = new THREE.Group(); q.position.set(x, y || 0, z); q.rotation.y = ry || 0; g.add(q); return q; };
  const glassM = mat(0xd0ebff, { transparent: true, opacity: 0.28 });
  const showcase = (x, z, w, d, ry) => { const q = grp(x, z, ry); lb(q, w, 0.9, d, 0x4a3526, 0, 0.45, 0); lb(q, w + 0.05, 0.06, d + 0.05, GOLD, 0, 0.92, 0); lb(q, w, 0.9, d, glassM, 0, 1.4, 0); lb(q, w + 0.05, 0.05, d + 0.05, 0x4a3526, 0, 1.87, 0);
    const sw = Math.abs(Math.sin(ry || 0)) > 0.7; sol(x, z, (sw ? d : w) / 2, (sw ? w : d) / 2); };
  const plinth = (x, z, w, h, d, c) => { lb(g, w, h, d, c || 0xdcd6ca, x, h / 2, z); lb(g, w + 0.15, 0.12, d + 0.15, 0xc8c0b0, x, h, z); sol(x, z, w / 2, d / 2); return h; };
  const ZONES = { dino: [-18, 18], sci: [18, 18], sculpt: [-18, -18], art: [18, -18] };
  P.zones = [{ x0: cx - 6, x1: cx + 6, z0: cz - 36, z1: cz + 36 }].concat(Object.values(ZONES).map(([a, b]) => ({ x0: cx + a - 12, x1: cx + a + 12, z0: cz + b - 18, z1: cz + b + 18 })));
  /* ---------- TƯỜNG + VÁCH NGĂN (mặt phẳng quay vào trong khu; chừa cửa) ---------- */
  const wallTex = {
    lobby: skin(6, 10, 20, (x, w, h) => { x.fillStyle = "#efe8da"; x.fillRect(0, 0, w, h); x.fillStyle = "#e2d8c4"; x.fillRect(0, 0, 0.5, h); x.fillRect(w - 0.5, 0, 0.5, h); x.fillRect(0, h - 0.8, w, 0.8); x.fillRect(0, 0, w, 0.5); x.fillRect(0, h - 6.8, w, 0.2);
      x.fillStyle = "#d9cdb4"; archPath(x, 1.8, h - 5.8, 2.4, 4.4); x.fill(); x.fillStyle = "#f6f1e7"; archPath(x, 2, h - 5.6, 2, 4.1); x.fill(); x.fillStyle = "#cfe3ee"; x.fillRect(1.6, 1.2, 2.8, 1.8); }),
    dino: skin(6, 9, 20, (x, w, h) => { x.fillStyle = "#c9b48f"; x.fillRect(0, 0, w, h); x.fillStyle = "#a9b0b0"; for (let j = 0.3; j < h; j += 0.9) x.fillRect(0, j, w, 0.3);
      x.fillStyle = "#c9b48f"; archPath(x, 0.75, h - 5.2, 4.5, 5.2); x.fill(); x.fillStyle = "#4e4033"; archPath(x, 1.05, h - 4.9, 3.9, 4.9); x.fill(); x.fillStyle = "#6e5c48"; archPath(x, 1.6, h - 4.2, 2.8, 4.2); x.fill();
      x.fillStyle = "#b9a37c"; x.fillRect(0, h - 5.7, w, 0.45); for (let X = 0.9; X < w - 0.5; X += 0.35) x.fillRect(X, h - 6.4, 0.12, 0.7); x.fillRect(0, h - 6.5, w, 0.12);
      x.fillStyle = "#4e4033"; archPath(x, 1.2, 0.5, 1.6, 2.2); x.fill(); archPath(x, 3.2, 0.5, 1.6, 2.2); x.fill(); x.fillStyle = "#b9a37c"; x.fillRect(0, 0, 0.35, h); x.fillRect(w - 0.35, 0, 0.35, h); x.fillRect(0, 0, w, 0.3); }),
    sculpt: skin(6, 14, 18, (x, w, h) => { x.fillStyle = "#dccdae"; x.fillRect(0, 0, w, h); x.fillStyle = "#cdbc98"; for (let j = 0; j < h; j += 0.5) x.fillRect(0, j, w, 0.02);
      x.fillStyle = "#c4b18c"; archPath(x, 0.9, h - 6.4, 4.2, 6.4); x.fill(); x.fillStyle = "#f2c879"; archPath(x, 1.15, h - 6.1, 3.7, 6.1); x.fill(); x.fillStyle = "#e9b862"; x.fillRect(1.15, h - 1.6, 3.7, 1.6);
      x.fillStyle = "#cdbc98"; x.fillRect(0, h - 7.2, w, 0.4); x.fillRect(0, 0.3, w, 0.4); x.fillStyle = "#5a5148"; x.fillRect(2.3, 2.7, 1.4, 2.8); x.fillStyle = "#e8eef2"; x.fillRect(2.4, 2.8, 1.2, 2.6);
      x.fillStyle = "#cdbc98"; x.beginPath(); x.moveTo(2, 2.6); x.lineTo(3, 1.9); x.lineTo(4, 2.6); x.fill(); x.fillRect(0, 0, 0.45, h); x.fillRect(w - 0.45, 0, 0.45, h); }),
    art: skin(6, 11.5, 20, (x, w, h) => { x.fillStyle = "#8b2e2a"; x.fillRect(0, 0, w, h); x.fillStyle = "#7a2622"; for (let X = 0.3; X < w; X += 0.6) for (let Y = 0.3; Y < h; Y += 0.6) { x.beginPath(); x.ellipse(X, Y, 0.1, 0.16, 0, 0, 7); x.fill(); }
      x.fillStyle = "#4a2a1c"; x.fillRect(0, h - 0.9, w, 0.9); x.fillStyle = "#c9a227"; x.fillRect(0, h - 0.95, w, 0.07); x.fillRect(0, h - 9.05, w, 0.1); x.fillStyle = "#e8d9b5"; x.fillRect(0, 0, w, h - 9); }),
    sci: skin(6, 9, 24, (x, w, h) => { x.fillStyle = "#1e3f8a"; x.fillRect(0, 0, w, h); x.fillStyle = "#2a55ad"; x.fillRect(0, h - 1, w, 1); x.fillStyle = "#ffffff";
      for (let i = 0; i < 40; i++) { x.globalAlpha = 0.4 + (i % 3) * 0.2; x.fillRect((i * 1.37) % w, (i * 0.77) % (h - 1.5), 0.05, 0.05); } x.globalAlpha = 1;
      x.strokeStyle = "#a5d8ff"; x.lineWidth = 0.04; x.beginPath(); x.moveTo(0.8, 1.5); x.lineTo(1.6, 1.1); x.lineTo(2.3, 1.6); x.lineTo(3.1, 1.3); x.lineTo(3.4, 2.2); x.moveTo(3.9, 3.4); x.lineTo(4.6, 2.9); x.lineTo(5.3, 3.5); x.lineTo(4.9, 4.2); x.stroke();
      x.fillStyle = "#ffffff"; [[0.8, 1.5], [1.6, 1.1], [2.3, 1.6], [3.1, 1.3], [3.4, 2.2], [3.9, 3.4], [4.6, 2.9], [5.3, 3.5], [4.9, 4.2]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 0.07, 0, 7); x.fill(); }); })
  };
  const wallH = { lobby: 10, dino: 9, sculpt: 14, art: 11.5, sci: 9 };
  const seg = (k, x0, z0, x1, z1, h) => {   // 1 đoạn tường từ (x0,z0) tới (x1,z1), mặt quay vào bên TRÁI hướng đi
    const len = Math.hypot(x1 - x0, z1 - z0); if (len < 0.05) return; h = h || wallH[k];
    const m = new THREE.Mesh(new THREE.PlaneGeometry(len, h), new THREE.MeshLambertMaterial({ map: tx(wallTex[k], len / 6, wallH[k] / h > 1 ? 1 : h / wallH[k]) }));
    const dx = (x1 - x0) / len, dz = (z1 - z0) / len; m.position.set(cx + (x0 + x1) / 2, h / 2, cz + (z0 + z1) / 2); m.rotation.y = Math.atan2(-dz, dx); m.userData.flat = true; g.add(m); };
  // chạy tường quanh 1 khu theo chiều kim đồng hồ nhìn từ trên (mặt quay vào trong); gaps: { cạnh: [tâm, rộng] }
  const room = (k, x0, x1, z0, z1, gaps) => {
    const run = (side, ax, az, bx, bz) => { const gp = gaps[side]; if (!gp) return seg(k, ax, az, bx, bz);
      const horiz = az === bz, a = horiz ? ax : az, b = horiz ? bx : bz, dir = Math.sign(b - a), g0 = gp[0] - dir * gp[1] / 2, g1 = gp[0] + dir * gp[1] / 2;
      if (horiz) { seg(k, ax, az, g0, az); seg(k, g1, az, bx, bz); } else { seg(k, ax, az, ax, g0); seg(k, ax, g1, bx, bz); }
      const lw = gp[1], lx = horiz ? gp[0] : ax, lz = horiz ? az : gp[0], hh = wallH[k] - 7;
      const nrm = { n: [0, 1], e: [-1, 0], s: [0, -1], w: [1, 0] }[side];   // lùi tấm trên cửa vào trong khu mình, không thò sang mái khu bên
      lb(g, horiz ? lw : 0.25, hh, horiz ? 0.25 : lw, k === "art" ? 0x8b2e2a : k === "sci" ? 0x1e3f8a : k === "dino" ? 0xb9a37c : 0xdccdae, cx + lx + nrm[0] * 0.17, 7 + hh / 2, cz + lz + nrm[1] * 0.17); };
    run("n", x0, z0, x1, z0); run("e", x1, z0, x1, z1); run("s", x1, z1, x0, z1); run("w", x0, z1, x0, z0);
  };
  // n = z nhỏ (phía trong), s = z lớn (phía cửa chính), w = x nhỏ, e = x lớn
  [[-6, -1], [6, 1]].forEach(([x, s]) => { [[-36, -21], [-15, 15], [21, 36]].forEach(([a, b]) => s < 0 ? seg("lobby", x, b, x, a) : seg("lobby", x, a, x, b)); [-18, 18].forEach(z => lb(g, 0.5, 3, 6, 0xe2d8c4, cx + x, 8.5, cz + z)); });
  seg("lobby", -6, -36, 6, -36); seg("lobby", 6, 36, -6, 36);
  room("dino", -30, -6, 0, 36, { e: [18, 6], n: [-18, 5] });
  room("sculpt", -30, -6, -36, 0, { e: [-18, 6], s: [-18, 5] });
  room("art", 6, 30, -36, 0, { w: [-18, 6], s: [18, 5] });
  room("sci", 6, 30, 0, 36, { w: [18, 6], n: [18, 5] });
  // vật cản vách ngăn
  [-6, 6].forEach(x => [[-36, -21], [-15, 15], [21, 36]].forEach(([a, b]) => sol(cx + x, cz + (a + b) / 2, 0.25, (b - a) / 2)));
  [-1, 1].forEach(s => [[6, 15.5], [20.5, 30]].forEach(([a, b]) => sol(cx + s * (a + b) / 2, cz, (b - a) / 2, 0.25)));
  // bảng tên trên cửa (phía sảnh)
  [["DINOSAUR HALL · KHỦNG LONG", -5.7, 18, Math.PI / 2], ["SCULPTURE & ANTIQUES · CỔ VẬT", -5.7, -18, Math.PI / 2], ["PAINTINGS · TRANH NỔI TIẾNG", 5.7, -18, -Math.PI / 2], ["SCIENCE & SPACE · KHOA HỌC", 5.7, 18, -Math.PI / 2]]
    .forEach(([t, x, z, ry]) => sign(t, 5.6, cx + x, 7.6, cz + z, ry, "#2b2b2b", "#ffd43b"));
  /* ---------- SÀN ---------- */
  const marble = skin(2, 2, 40, x => { x.fillStyle = "#e8e1d3"; x.fillRect(0, 0, 2, 2); x.fillStyle = "#ddd3c0"; x.fillRect(0, 0, 1, 1); x.fillRect(1, 1, 1, 1); x.fillStyle = "#c9bea8"; x.fillRect(0, 0, 2, 0.02); x.fillRect(0, 0, 0.02, 2); });
  marble.wrapS = marble.wrapT = THREE.RepeatWrapping; marble.repeat.set(W / 2, D / 2); g.children[0].material = new THREE.MeshLambertMaterial({ map: marble });
  floor(skin(2, 2, 32, x => { x.fillStyle = "#9c9488"; x.fillRect(0, 0, 2, 2); x.fillStyle = "#8a8276"; x.fillRect(0, 0, 2, 0.04); x.fillRect(0, 1, 2, 0.04); x.fillRect(0, 0, 0.04, 1); x.fillRect(1, 1, 0.04, 1); }), -30, -6, 0, 36, 12, 18);
  floor(skin(2, 2, 32, x => { x.fillStyle = "#e6dcc6"; x.fillRect(0, 0, 2, 2); x.fillStyle = "#d4c7aa"; x.fillRect(0, 0, 2, 0.03); x.fillRect(0, 0, 0.03, 2); }), -30, -6, -36, 0, 12, 18);
  floor(skin(1, 1, 64, x => { x.fillStyle = "#b07a45"; x.fillRect(0, 0, 1, 1); for (let i = -1; i < 2; i += 0.25) { x.fillStyle = (Math.round(i * 4) % 2) ? "#c48a50" : "#a06c3a"; x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 0.5, 0.5); x.lineTo(i + 0.75, 0.5); x.lineTo(i + 0.25, 0); x.fill(); x.beginPath(); x.moveTo(i + 0.5, 0.5); x.lineTo(i, 1); x.lineTo(i + 0.25, 1); x.lineTo(i + 0.75, 0.5); x.fill(); } }), 6, 30, -36, 0, 24, 36);
  floor(skin(2, 2, 32, x => { x.fillStyle = "#2f8fd1"; x.fillRect(0, 0, 2, 2); x.fillStyle = "#3a9be0"; x.fillRect(0, 0, 1, 1); x.fillRect(1, 1, 1, 1); }), 6, 30, 0, 36, 12, 18);
  /* ---------- TRẦN TỪNG KHU ---------- */
  const vault = (t, x, z0, z1, R, spring, flat, rep) => { const L = z1 - z0, v = new THREE.Mesh(new THREE.CylinderGeometry(R, R, L, 40, 1, true, Math.PI / 2, Math.PI), flatM(tx(t, 1, rep || L / 4)));
    v.rotation.x = Math.PI / 2; v.scale.z = flat; v.position.set(cx + x, spring, cz + (z0 + z1) / 2); g.add(v);
    [z0, z1].forEach((z, i) => { const c = new THREE.Mesh(new THREE.CircleGeometry(R, 32, 0, Math.PI), mat(i ? 0xe9e1d0 : 0xe9e1d0, { side: THREE.DoubleSide })); c.scale.y = flat; c.position.set(cx + x, spring, cz + z + (i ? -0.02 : 0.02)); g.add(c); }); return v; };
  const ribs = (x, z0, z1, R, spring, flat, step, c) => { for (let z = z0 + step / 2; z < z1; z += step) { const r = new THREE.Mesh(new THREE.TorusGeometry(R - 0.1, 0.18, 6, 28, Math.PI), mat(c)); r.scale.y = flat; r.position.set(cx + x, spring, cz + z); g.add(r); } };
  // sảnh: vòm kính
  vault(skin(6, 4, 20, (x, w, h) => { x.fillStyle = "#f4f1ea"; x.fillRect(0, 0, w, h); x.fillStyle = "#dff0fb"; x.fillRect(1.2, 0, 3.6, h); x.strokeStyle = "#8a9aa3"; x.lineWidth = 0.05; for (let X = 1.2; X <= 4.8; X += 0.6) { x.beginPath(); x.moveTo(X, 0); x.lineTo(X, h); x.stroke(); } x.beginPath(); x.moveTo(1.2, 2); x.lineTo(4.8, 2); x.stroke(); }), 0, -36, 36, 6, 10, 0.6);
  // khủng long: vòm đá có sườn + 2 dải ô kính
  vault(skin(12, 4, 16, (x, w, h) => { x.fillStyle = "#cdbb98"; x.fillRect(0, 0, w, h); x.fillStyle = "#b9a37c"; for (let X = 0; X < w; X += 1) x.fillRect(X, 0, 0.08, h);
    [[1.6, 2.6], [7.8, 2.6]].forEach(([a, b]) => { x.fillStyle = "#eef6fb"; x.fillRect(a, 0.3, b, h - 0.6); x.strokeStyle = "#7d8b8f"; x.lineWidth = 0.06; for (let X = a; X <= a + b; X += 0.43) { x.beginPath(); x.moveTo(X, 0.3); x.lineTo(X, h - 0.3); x.stroke(); } }); x.fillStyle = "#a08a64"; x.fillRect(0, 0, w, 0.3); }), -18, 0, 36, 12, 9, 0.55);
  ribs(-18, 0, 36, 12, 9, 0.55, 4, 0xa08a64);
  // khoa học: vòm lưới thép trắng
  vault(skin(4, 4, 24, (x, w, h) => { x.fillStyle = "#dceefb"; x.fillRect(0, 0, w, h); x.strokeStyle = "#ffffff"; x.lineWidth = 0.14; for (let i = -4; i < 8; i += 0.8) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 4, h); x.stroke(); x.beginPath(); x.moveTo(i + 4, 0); x.lineTo(i, h); x.stroke(); } x.strokeStyle = "#c3cfd8"; x.lineWidth = 0.05; for (let j = 0; j < h; j += 0.8) { x.beginPath(); x.moveTo(0, j); x.lineTo(w, j); x.stroke(); } }), 18, 0, 36, 12, 9, 0.55, 9);
  ribs(18, 0, 36, 12, 9, 0.55, 6, 0xf1f3f5);
  // điêu khắc: mái kính phẳng
  { const gr = skin(2, 2, 32, x => { x.fillStyle = "#cfe6f5"; x.fillRect(0, 0, 2, 2); x.strokeStyle = "#5c6b73"; x.lineWidth = 0.06; x.strokeRect(0, 0, 2, 2); x.beginPath(); x.moveTo(1, 0); x.lineTo(1, 2); x.moveTo(0, 1); x.lineTo(2, 1); x.stroke(); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(24, 36), flatM(tx(gr, 12, 18), true)); m.rotation.x = Math.PI / 2; m.position.set(cx - 18, H, cz - 18); g.add(m);
    [-12, -6, 0, 6, 12].forEach(dz => lb(g, 24, 0.4, 0.25, 0x5c6b73, cx - 18, H - 0.2, cz - 18 + dz)); }
  // tranh: trần vòm hắt (cove) đỏ nâu hoa văn + giếng trời dài
  { const cove = skin(4, 4.5, 20, x => { x.fillStyle = "#7a2e24"; x.fillRect(0, 0, 4, 4.5); x.strokeStyle = "#d8b25a"; x.lineWidth = 0.06; x.beginPath(); x.ellipse(2, 2.2, 1.4, 1.2, 0, 0, 7); x.stroke(); x.beginPath(); x.ellipse(2, 2.2, 0.6, 0.5, 0, 0, 7); x.stroke(); x.fillStyle = "#c9a227"; x.fillRect(0, 0, 4, 0.12); x.fillRect(0, 4.38, 4, 0.12); });
    const cl = Math.hypot(3.7, 2.5), th = Math.atan2(3.7, 2.5);
    [[6.3, Math.PI / 2], [29.7, -Math.PI / 2]].forEach(([x, ry]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(36, cl), new THREE.MeshLambertMaterial({ map: tx(cove, 9, 1), side: THREE.DoubleSide })); m.rotation.order = "YXZ"; m.rotation.set(th, ry, 0); m.position.set(cx + x + Math.sign(ry) * 1.85, 10.25, cz - 18); g.add(m); });
    const sk = skin(4, 4, 24, x => { x.fillStyle = "#e9e0c9"; x.fillRect(0, 0, 4, 4); x.fillStyle = "#fffef5"; x.fillRect(0.8, 0, 2.4, 4); x.strokeStyle = "#a8a08c"; x.lineWidth = 0.05; for (let X = 0.8; X <= 3.2; X += 0.4) { x.beginPath(); x.moveTo(X, 0); x.lineTo(X, 4); x.stroke(); } for (let Y = 0; Y < 4; Y += 0.5) { x.beginPath(); x.moveTo(0.8, Y); x.lineTo(3.2, Y); x.stroke(); } });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(16.6, 36), flatM(tx(sk, 1, 9), true)); m.rotation.x = Math.PI / 2; m.position.set(cx + 18, 11.5, cz - 18); g.add(m); }
  /* ===================== SẢNH CHÍNH ===================== */
  { const q = grp(cx - 4, cz + 28, Math.PI / 2); lb(q, 3, 1.05, 0.8, 0x6b4a2b, 0, 0.53, 0); lb(q, 3.1, 0.06, 0.95, 0xe9e1d0, 0, 1.08, 0); sol(cx - 4, cz + 28, 0.4, 1.5); }
  sign("TICKETS · VÉ VÀO CỬA", 2.6, cx - 5.9, 2.6, cz + 28, Math.PI / 2, "#7a2e24", "#ffe9a8");
  const mapT = skin(3, 2.2, 60, x => { x.fillStyle = "#f8f1df"; x.fillRect(0, 0, 3, 2.2); signText(x, "MUSEUM MAP", 1.5, 0.2, 2.6, 0.2, "#3b2f2a");
    [["#e8c547", "DINOSAURS", 0.15, 1.3], ["#a5d8ff", "SCIENCE", 1.95, 1.3], ["#dccdae", "SCULPTURE", 0.15, 0.4], ["#c0504a", "PAINTINGS", 1.95, 0.4]].forEach(([c, t, a, b]) => { x.fillStyle = c; x.fillRect(a, b, 0.9, 0.8); signText(x, t, a + 0.45, b + 0.4, 0.85, 0.12, "#222"); });
    x.fillStyle = "#e9ecef"; x.fillRect(1.15, 0.4, 0.7, 1.7); signText(x, "LOBBY", 1.5, 1.2, 0.6, 0.12, "#222"); x.fillStyle = "#e03131"; x.beginPath(); x.arc(1.5, 1.9, 0.07, 0, 7); x.fill(); signText(x, "You are here", 1.5, 2.05, 0.8, 0.08, "#e03131"); });
  { const m = new THREE.Mesh(new THREE.PlaneGeometry(3, 2.2), new THREE.MeshLambertMaterial({ map: mapT })); m.position.set(cx + 5.7, 2.4, cz + 28); m.rotation.y = -Math.PI / 2; g.add(m); }
  for (let i = 0; i < 3; i++) lb(g, 0.5, 1.9, 1.2, 0x5c7f9a, cx + 5.5, 0.95, cz + 32.5 + i * 0 + (i - 1) * 1.25); sol(cx + 5.5, cz + 32.5, 0.25, 1.9);   // tủ gửi đồ
  lb(g, 0.6, 1.2, 0.6, 0xc92a2a, cx + 3.5, 0.6, cz + 24); lb(g, 0.5, 0.5, 0.5, glassM, cx + 3.5, 1.45, cz + 24); sol(cx + 3.5, cz + 24, 0.3, 0.3);   // hộp quyên góp
  [8, -8].forEach(z => [-1, 1].forEach(s => { lb(g, 0.7, 0.12, 3, 0x6b4a2b, cx + s * 3.6, 0.48, cz + z); lb(g, 0.6, 0.45, 0.1, 0x3b2f2a, cx + s * 3.6, 0.22, cz + z - 1.3); lb(g, 0.6, 0.45, 0.1, 0x3b2f2a, cx + s * 3.6, 0.22, cz + z + 1.3); sol(cx + s * 3.6, cz + z, 0.35, 1.5); }));
  lc(g, 0.45, 0.5, 3, 0x3b2f2a, cx, 1.5, cz, 16); sol(cx, cz, 0.5, 0.5);   // trụ chỉ đường
  [["DINOSAURS", 0], ["SCIENCE", Math.PI], ["SCULPTURE", Math.PI / 2], ["PAINTINGS", -Math.PI / 2]].forEach(([t, ry]) => { const p = sign(t, 1.4, cx, 3.2 - (ry ? 0.25 * (Math.abs(ry) > 2 ? 1 : 2) : 0), cz, ry, "#ffd43b", "#2b2b2b"); p.position.x += Math.sin(ry) * 0.47; p.position.z += Math.cos(ry) * 0.47; });
  // cửa hàng lưu niệm cuối sảnh
  [-1, 1].forEach(s => { lb(g, 0.7, 2.2, 6, 0x8d5a2b, cx + s * 5.4, 1.1, cz - 31); for (let k = 0; k < 3; k++) lb(g, 0.75, 0.05, 6, 0xf1e3c6, cx + s * 5.4, 0.5 + k * 0.7, cz - 31); sol(cx + s * 5.4, cz - 31, 0.35, 3); });
  lb(g, 3, 1, 0.8, 0x7a2e24, cx, 0.5, cz - 34.5); sol(cx, cz - 34.5, 1.5, 0.4); sign("GIFT SHOP · QUÀ LƯU NIỆM", 4, cx, 3.6, cz - 35.9, 0, "#7a2e24", "#ffe9a8");
  ["🦖", "🧸", "🖼️", "🚀", "📚", "🏺"].forEach((e, i) => { const sp = emojiSprite(e, 0.45); sp.position.set(cx + (i < 3 ? -5.3 : 5.3), 0.85 + (i % 3) * 0.7, cz - 33.5); g.add(sp); });
  /* ===================== 🦖 DINOSAUR HALL (x −30…−6, z 0…36) ===================== */
  { const X = cx - 18, Z = cz + 18;
    // cầu thang lớn ở cuối (sát tường trước)
    for (let k = 0; k < 8; k++) lb(g, 8, 0.3 * (k + 1), 0.55, 0xcdbb98, X, 0.15 * (k + 1), Z + 12 + k * 0.55);
    lb(g, 8, 2.4, 1.6, 0xcdbb98, X, 1.2, Z + 17.2);
    [-1, 1].forEach(s => { lb(g, 0.35, 3, 6, 0xb9a37c, X + s * 4.15, 1.5, Z + 15); for (let k = 0; k < 6; k++) { const h = 2.4 + 0.3 * (k + 1); lb(g, 0.8, h, 1.6, 0xcdbb98, X + s * (4.7 + k * 0.8), h / 2, Z + 17.2); } });
    sol(X, Z + 15, 4.3, 3); [-1, 1].forEach(s => sol(X + s * 6.7, Z + 17.2, 2.5, 0.8));
    sign("DINOSAUR HALL · BẢO TÀNG KHỦNG LONG", 7, X, 6.5, Z + 17.95, Math.PI, "#3b2f2a", "#ffe9a8");
    // T. REX (quay mặt về cửa sảnh, hướng +x)
    plinth(X, Z - 9, 11, 0.6, 3.6, 0x6e6458); { const t = grp(X, Z - 9, 0, 0.6);
      const sp = new THREE.CatmullRomCurve3([[-5.2, 1.4], [-3.5, 2.4], [-1.5, 3.3], [0.5, 3.4], [1.8, 3.6], [2.6, 4.2], [3.2, 4.5]].map(([a, b]) => new THREE.Vector3(a, b, 0)));
      sp.getPoints(44).forEach((p, i) => { const s = 0.12 + Math.min(i, 30) * 0.004; lb(t, s * 1.6, s * 2, s * 1.6, BONE, p.x, p.y, 0); });
      for (let x = -0.9; x <= 1.9; x += 0.32) { const r = 0.95 - Math.abs(x - 0.5) * 0.25, rb = new THREE.Mesh(new THREE.TorusGeometry(r, 0.05, 4, 12, Math.PI), mat(BONE)); rb.geometry.rotateZ(Math.PI); rb.geometry.rotateY(Math.PI / 2); rb.position.set(x, 3.35, 0); t.add(rb); }
      lb(t, 1.5, 0.75, 0.62, BONE, 3.95, 4.45, 0); const jaw = lb(t, 1.35, 0.22, 0.5, BONE, 3.85, 3.92, 0); jaw.rotation.z = -0.12; [-1, 1].forEach(s => lb(t, 0.22, 0.2, 0.04, 0x2b2b2b, 3.65, 4.55, s * 0.32));
      for (let i = 0; i < 7; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 5), mat(0xffffff)); c.position.set(3.35 + i * 0.16, 4.02, 0.2); c.rotation.x = Math.PI; t.add(c); const c2 = c.clone(); c2.position.z = -0.2; t.add(c2); }
      lb(t, 1, 0.6, 1, BONE, -1.5, 3.1, 0);
      [-1, 1].forEach(s => { const z = s * 0.5; bone(t, [-1.4, 3, z], [-0.7, 1.8, z], 0.16); bone(t, [-0.7, 1.8, z], [-1.3, 0.6, z], 0.11); bone(t, [-1.3, 0.6, z], [-0.5, 0.12, z], 0.06); bone(t, [-1.3, 0.6, z], [-0.7, 0.12, z + s * 0.25], 0.05);
        bone(t, [1.6, 3.1, s * 0.35], [2.0, 2.6, s * 0.4], 0.05); bone(t, [2.0, 2.6, s * 0.4], [2.3, 2.7, s * 0.4], 0.04); });
      bone(t, [-1.5, 0, 0], [-1.5, 3, 0], 0.04, 0x343a40); bone(t, [1.6, 0, 0], [1.6, 3.4, 0], 0.04, 0x343a40); }
    sign("TYRANNOSAURUS REX · 66 MILLION YEARS AGO", 4.2, X + 3, 0.45, Z - 7.15, 0, "#3b2f2a", "#ffe9a8");
    // KHỦNG LONG CỔ DÀI
    plinth(X, Z + 5, 12, 0.6, 4, 0x6e6458); { const t = grp(X, Z + 5, 0, 0.6);
      const sp = new THREE.CatmullRomCurve3([[-6, 2.4], [-4, 3.6], [-2, 4.8], [0, 5.2], [1.8, 5.8], [2.8, 7.4], [3.6, 9.2], [4.2, 10.8]].map(([a, b]) => new THREE.Vector3(a, b, 0)));
      sp.getPoints(60).forEach((p, i) => lb(t, 0.24, 0.3, 0.24, BONE, p.x, p.y, 0));
      for (let x = -1.6; x <= 1.6; x += 0.3) { const rb = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.06, 4, 12, Math.PI), mat(BONE)); rb.geometry.rotateZ(Math.PI); rb.geometry.rotateY(Math.PI / 2); rb.position.set(x, 5.1 + x * 0.15, 0); t.add(rb); }
      lb(t, 0.9, 0.45, 0.4, BONE, 4.7, 11, 0); lb(t, 1.2, 0.7, 1.1, BONE, -2, 4.6, 0);
      [-1, 1].forEach(s => { const z = s * 0.7; bone(t, [1.6, 5.3, z], [1.8, 3, z], 0.17); bone(t, [1.8, 3, z], [1.7, 0.3, z], 0.15); bone(t, [-2, 4.4, z], [-1.6, 2.4, z], 0.18); bone(t, [-1.6, 2.4, z], [-2, 0.3, z], 0.15); });
      bone(t, [3.6, 0, 0], [3.6, 9.2, 0], 0.035, 0x343a40); }
    sign("BRACHIOSAURUS · LONG-NECKED DINOSAUR", 4.2, X + 3, 0.45, Z + 7.05, 0, "#3b2f2a", "#ffe9a8");
    // thằn lằn bay treo trần
    { const t = grp(X, Z - 1, 0.6, 10.5); ball(t, 0.3, BONE, 0, 0, 0, 2.2, 0.8, 0.8); const hd = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.2, 6), mat(BONE)); hd.rotation.z = -Math.PI / 2; hd.position.x = 1.2; t.add(hd); const cr = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.6, 5), mat(BONE)); cr.rotation.z = Math.PI / 2.5; cr.position.set(0.5, 0.25, 0); t.add(cr);
      [-1, 1].forEach(s => { const gm = new THREE.BufferGeometry(); gm.setAttribute("position", new THREE.Float32BufferAttribute([0.4, 0, 0, -0.5, 0, 0, 0.1, 0.15, s * 3.2], 3)); gm.computeVertexNormals(); t.add(new THREE.Mesh(gm, mat(0xd9c7a4, { side: THREE.DoubleSide }))); bone(t, [0, 0.05, 0], [0, 4, s * 1.5], 0.01, 0x343a40); }); }
    // tủ hóa thạch dọc tường ngoài + tổ trứng + thiên thạch + đầu khủng long 3 sừng
    [-15, -10, -5, 0, 5, 10].forEach(z => showcase(X - 11.3, Z + z, 2.2, 1.1, Math.PI / 2));
    { const n = grp(X + 8, Z + 15); const tr = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.25, 6, 14), mat(0x8d6e4a)); tr.rotation.x = Math.PI / 2; tr.position.y = 0.3; n.add(tr); [[0, 0], [0.3, 0.2], [-0.3, 0.15], [0.05, -0.3]].forEach(([a, b]) => ball(n, 0.2, 0xf1e3c6, a, 0.45, b, 1, 1.35, 1)); sol(X + 8, Z + 15, 1, 1); }
    plinth(X + 8, Z - 15, 1.2, 0.8, 1.2, 0x495057); { const m = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55), mat(0x3d3a36)); m.position.set(X + 8, 1.35, Z - 15); g.add(m); }
    plinth(X - 8, Z + 15, 2.4, 0.5, 1.6, 0x6e6458); { const t = grp(X - 8, Z + 15, Math.PI / 2, 0.5); const fr = new THREE.Mesh(new THREE.CircleGeometry(1, 20), mat(BONE, { side: THREE.DoubleSide })); fr.position.set(0, 1.3, -0.3); t.add(fr); lb(t, 0.6, 0.6, 1.1, BONE, 0, 0.6, 0.3);
      [[-0.25, 1.1, 0.4, -1], [0.25, 1.1, 0.4, -1], [0, 0.75, 0.85, 0.5]].forEach(([a, b, c, k]) => { const h = new THREE.Mesh(new THREE.ConeGeometry(0.08, k > 0 ? 0.35 : 0.9, 6), mat(0xf8f1df)); h.position.set(a, b + (k > 0 ? 0.15 : 0.35), c); h.rotation.x = k > 0 ? 0.3 : 0.9; t.add(h); }); }
    const tl = skin(6, 1.6, 40, x => { x.fillStyle = "#3b2f2a"; x.fillRect(0, 0, 6, 1.6); signText(x, "AGE OF DINOSAURS", 3, 0.25, 5, 0.25, "#ffe9a8"); [["TRIASSIC", "#c98a2b"], ["JURASSIC", "#5c940d"], ["CRETACEOUS", "#1c7ed6"]].forEach(([t, c], i) => { x.fillStyle = c; x.fillRect(0.2 + i * 1.9, 0.6, 1.8, 0.5); signText(x, t, 1.1 + i * 1.9, 0.85, 1.6, 0.2, "#fff"); }); signText(x, "252 – 66 million years ago", 3, 1.35, 5, 0.18, "#ffe9a8"); });
    { const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.6), new THREE.MeshLambertMaterial({ map: tl })); m.position.set(X - 11.95, 4.4, Z - 2.5); m.rotation.y = Math.PI / 2; g.add(m); }
    P.anchors = {
      dino: [[-4.5, 2.6, -9, -4.5, -6.5], [-1.5, 3.8, -9, -1.5, -6.5], [2, 6.5, 5, 2, 2.4], [-8, 2.2, 15.4, -8, 12.9], [0.5, 1.2, -8.4, 0.5, -6.5], [4.2, 3.6, -8.6, 4.2, -6.5]].map(([a, b, c, d, e]) => [X + a, b, Z + c, X + d, Z + e]),
      fossil: [[-11.3, 1.5, -15], [-11.3, 1.5, -10], [8, 1.2, 15, 8, 12.9], [-11.3, 1.5, -5], [-11.3, 1.5, 0], [-11.3, 1.5, 5], [8, 2.2, -15, 8, -13], [-11.3, 1.5, 10]].map(([a, b, c, d, e]) => [X + a, b, Z + c, X + (d === undefined ? -9.8 : d), Z + (e === undefined ? c : e)])
    }; }
  /* ===================== 🗿 SCULPTURE & ANTIQUES (x −30…−6, z −36…0) ===================== */
  const figure = (x, z, pose, c, ry, y0) => { const t = grp(x, z, ry || 0, y0 || 0); c = c || MARBLE;
    if (pose === "think") { lb(t, 0.6, 0.5, 0.6, c, 0, 0.25, 0); [-1, 1].forEach(s => { bone(t, [s * 0.13, 0.55, 0], [s * 0.13, 0.55, 0.45], 0.1, c); bone(t, [s * 0.13, 0.55, 0.45], [s * 0.13, 0, 0.5], 0.09, c); });
      bone(t, [0, 0.55, 0], [0, 1.15, 0.2], 0.2, c); ball(t, 0.14, c, 0, 1.38, 0.32); bone(t, [0.25, 1.05, 0.15], [0.15, 0.62, 0.45], 0.06, c); bone(t, [0.15, 0.62, 0.45], [0.05, 1.25, 0.4], 0.055, c); bone(t, [-0.25, 1.05, 0.15], [-0.2, 0.62, 0.45], 0.06, c); return t; }
    [-1, 1].forEach(s => bone(t, [s * 0.12, 0, 0], [s * 0.12, 0.9, 0], 0.1, c)); bone(t, [0, 0.85, 0], [0, 1.55, 0], 0.22, c); ball(t, 0.15, c, 0, 1.78, 0);
    if (pose === "astro") { ball(t, 0.24, 0xffffff, 0, 1.8, 0); lb(t, 0.3, 0.16, 0.05, 0xc9a227, 0, 1.8, 0.21); lb(t, 0.4, 0.5, 0.2, 0xdee2e6, 0, 1.3, -0.28); }
    if (pose === "raise") { bone(t, [-0.28, 1.5, 0], [-0.42, 2.3, 0.05], 0.06, c); bone(t, [0.28, 1.5, 0], [0.33, 0.95, 0], 0.06, c); }
    if (pose === "down" || pose === "astro") [-1, 1].forEach(s => bone(t, [s * 0.28, 1.5, 0], [s * 0.34, 0.92, 0.05], 0.065, c));
    if (pose === "throw") { bone(t, [-0.28, 1.5, 0], [-0.75, 1.2, -0.35], 0.06, c); bone(t, [0.28, 1.5, 0], [0.6, 1.6, 0.4], 0.06, c); ball(t, 0.12, c, 0.65, 1.62, 0.48, 1, 0.3, 1); }
    if (pose === "knight") { ball(t, 0.2, c, 0, 1.8, 0); lb(t, 0.5, 0.6, 0.3, c, 0, 1.25, 0); [-1, 1].forEach(s => bone(t, [s * 0.3, 1.5, 0], [s * 0.36, 0.95, 0.1], 0.08, c)); bone(t, [0.36, 0.95, 0.1], [0.36, 0.1, 0.25], 0.03, 0xadb5bd); }
    return t; };
  const horse = (x, z, ry, y0) => { const t = grp(x, z, ry, y0); const b = grp(0, 0, 0); t.add(b); b.rotation.z = 0.5; b.position.y = 1.2;
    bone(b, [-0.8, 0, 0], [0.8, 0, 0], 0.38, MARBLE); ball(b, 0.4, MARBLE, 0.8, 0, 0); ball(b, 0.38, MARBLE, -0.8, 0, 0); bone(b, [0.9, 0.2, 0], [1.3, 1, 0], 0.2, MARBLE); lb(b, 0.6, 0.3, 0.28, MARBLE, 1.55, 1.05, 0).rotation.z = -0.6;
    [-1, 1].forEach(s => { bone(b, [-0.8, -0.2, s * 0.2], [-1.1, -1.3, s * 0.2], 0.09, MARBLE); bone(b, [0.8, -0.2, s * 0.2], [1.2, -0.6, s * 0.25], 0.08, MARBLE); bone(b, [1.2, -0.6, s * 0.25], [1.0, -1.0, s * 0.25], 0.07, MARBLE); }); bone(b, [-1.1, 0.1, 0], [-1.5, -0.8, 0], 0.07, MARBLE); return t; };
  { const X = cx - 18, Z = cz - 18;
    // bậc thềm cao phía trong + lan can đá + 2 tượng ngựa
    lb(g, 24, 1.4, 7, 0xd4c5a5, X, 0.7, Z - 14.5); for (let k = 0; k < 4; k++) lb(g, 8, 0.35 * (k + 1), 0.4, 0xe6dcc6, X, 0.175 * (k + 1), Z - 9.4 - k * 0.4); sol(X, Z - 14.5, 12, 3.5); sol(X, Z - 10, 4, 0.8);
    [-1, 1].forEach(s => { lb(g, 7.6, 0.8, 0.3, 0xcdbc98, X + s * 7.9, 1.8, Z - 11.15); for (let xx = 4.3; xx < 11.8; xx += 0.5) lc(g, 0.08, 0.1, 0.6, 0xdccdae, X + s * xx, 1.7, Z - 11.15, 6); });
    [-6, 6].forEach(dx => { plinth(X + dx, Z - 14, 2.6, 1.4 + 0.9, 1.6, 0xdccdae); horse(X + dx, Z - 14, dx < 0 ? 0 : Math.PI, 2.3); });
    sign("SCULPTURE & ANTIQUES · ĐIÊU KHẮC – CỔ VẬT", 7.5, X, 7.6, Z - 17.95, 0, "#3b2f2a", "#ffe9a8");
    // tượng trên bệ
    [[-8, -5, "raise"], [-8, 4, "think"], [8, -7, "down"], [-3, -1, "throw"]].forEach(([dx, dz, p]) => { const h = plinth(X + dx, Z + dz, 1.1, 1, 1.1); figure(X + dx, Z + dz, p, MARBLE, 0, h); });
    { const t = grp(X + 8, Z + 8, -Math.PI / 2, 1); plinth(X + 8, Z + 8, 2.2, 1, 1.2); bone(t, [-0.6, 0.6, 0], [0.5, 0.6, 0], 0.3, MARBLE); ball(t, 0.42, MARBLE, 0.65, 0.95, 0); ball(t, 0.26, MARBLE, 0.85, 0.95, 0);
      [[-0.5, -0.15], [-0.5, 0.15], [0.4, -0.15], [0.4, 0.15]].forEach(([a, b]) => bone(t, [a, 0.5, b], [a, 0, b], 0.08, MARBLE)); bone(t, [-0.6, 0.6, 0], [-1, 0.2, 0], 0.04, MARBLE); }
    lc(g, 0.25, 0.3, 1.4, MARBLE, X - 3, 0.7, Z + 10, 12); sol(X - 3, Z + 10, 0.35, 0.35); lb(g, 0.6, 0.3, 0.3, MARBLE, X - 3, 1.55, Z + 10); ball(g, 0.18, MARBLE, X - 3, 1.88, Z + 10);   // tượng bán thân
    [[3.5, -4], [-0.5, -4]].forEach(([dx, dz]) => { lb(g, 1.8, 0.9, 1.8, 0x6b5a46, X + dx, 0.45, Z + dz); lc(g, 0.12, 0.15, 2.2, 0x6b4a2b, X + dx, 2, Z + dz, 6); ball(g, 1.1, 0x2f7d32, X + dx, 3.6, Z + dz, 1, 1.2, 1); ball(g, 0.8, 0x3d8b37, X + dx + 0.4, 4.2, Z + dz - 0.2); sol(X + dx, Z + dz, 0.9, 0.9); });
    // tủ cổ vật + trống đồng + áo giáp + bình gốm
    [-8, -3, 2, 7, 12].forEach(z => showcase(X - 11.3, Z + z, 2.2, 1.1, Math.PI / 2));
    plinth(X + 6, Z + 12, 2, 0.6, 2); { const dr = skin(2, 2, 64, x => { x.fillStyle = "#8c6a3a"; x.fillRect(0, 0, 2, 2); x.strokeStyle = "#5c4422"; x.lineWidth = 0.03; [0.95, 0.8, 0.62, 0.45].forEach(r => { x.beginPath(); x.arc(1, 1, r, 0, 7); x.stroke(); }); x.fillStyle = "#d9b76a"; x.beginPath(); for (let i = 0; i < 28; i++) { const r = i % 2 ? 0.08 : 0.3, a = i * Math.PI / 14; x.lineTo(1 + Math.cos(a) * r, 1 + Math.sin(a) * r); } x.fill(); for (let i = 0; i < 6; i++) { const a = i * 1.047; x.beginPath(); x.ellipse(1 + Math.cos(a) * 0.71, 1 + Math.sin(a) * 0.71, 0.08, 0.03, a + 1.57, 0, 7); x.fill(); } });
      const d = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.8, 0.8, 24), [mat(0x8c6a3a), new THREE.MeshLambertMaterial({ map: dr }), mat(0x6b4f2a)]); d.position.set(X + 6, 1, Z + 12); g.add(d); }
    sign("DONG SON BRONZE DRUM · TRỐNG ĐỒNG ĐÔNG SƠN", 3.6, X + 6, 0.35, Z + 13.02, 0, "#3b2f2a", "#ffe9a8");
    plinth(X - 10.8, Z + 15.8, 1, 0.4, 1, 0x495057); figure(X - 10.8, Z + 15.8, "knight", 0x9aa3ab, Math.PI / 2, 0.4);
    plinth(X + 8, Z - 1, 0.9, 1, 0.9); { const pts = [[0, 0], [0.18, 0.02], [0.28, 0.25], [0.3, 0.55], [0.18, 0.8], [0.1, 0.95], [0.16, 1.05]].map(([a, b]) => new THREE.Vector2(a, b)); const v = new THREE.Mesh(new THREE.LatheGeometry(pts, 16), mat(0xb5651d, { side: THREE.DoubleSide })); v.position.set(X + 8, 1, Z - 1); g.add(v); }
    Object.assign(P.anchors, {
      statue: [[-8, 2.8, -5, -6.4, -5], [8, 2.5, -7, 6.4, -7], [-6, 4, -14, -6, -10.4], [8, 2.2, 8, 8, 9.9], [-3, 2.3, 10, -3, 8.4], [-8, 1.3, 4, -6.4, 4], [3.5, 1.6, -4, 3.5, -2.3]].map(([a, b, c, d, e]) => [X + a, b, Z + c, X + d, Z + e]),
      antique: [[-11.3, 1.5, -8], [6, 1.9, 12, 6, 10.3], [-11.3, 1.5, -3], [-11.3, 1.5, 2], [-11.3, 1.5, 7], [-10.8, 2.6, 15.8, -9.1, 15.8], [-11.3, 1.5, 12], [8, 2.4, -1, 6.6, -1]].map(([a, b, c, d, e]) => [X + a, b, Z + c, X + (d === undefined ? -9.8 : d), Z + (e === undefined ? c : e)])
    }); }
  /* ===================== 🖼️ PAINTING GALLERY (x 6…30, z −36…0) ===================== */
  { const X = cx + 18, Z = cz - 18;
    const hang = (kind, x, z, ry, s, title) => { const q = grp(x, z, ry, 0); s = (s || 1) * 1.3;
      lb(q, 3 * s + 0.4, 2.2 * s + 0.4, 0.12, GOLD, 0, 3.7, 0.06); const c = new THREE.Mesh(new THREE.PlaneGeometry(3 * s, 2.2 * s), new THREE.MeshLambertMaterial({ map: museumPaint(kind) })); c.position.set(0, 3.7, 0.13); q.add(c);
      const lbp = textPlate(title, 1.8, 0.28, "#f8f1df", "#3b2f2a"); lbp.position.set(0, 3.7 - 1.1 * s - 0.55, 0.05); q.add(lbp); };
    hang("starry", X + 11.85, Z - 13, -Math.PI / 2, 1.1, "The Starry Night · Van Gogh, 1889"); hang("sunflowers", X + 11.85, Z - 7, -Math.PI / 2, 0.9, "Sunflowers · Van Gogh, 1888");
    hang("scream", X + 11.85, Z - 1, -Math.PI / 2, 0.9, "The Scream · Edvard Munch, 1893"); hang("wave", X + 11.85, Z + 5, -Math.PI / 2, 1.1, "The Great Wave · Hokusai, c.1831"); hang("ship", X + 11.85, Z + 11, -Math.PI / 2, 1, "Ship at Sea · Verse City Artist");
    hang("pearl", X - 11.85, Z - 13, Math.PI / 2, 0.9, "Girl with a Pearl Earring · Vermeer, c.1665"); hang("lilies", X - 11.85, Z - 8, Math.PI / 2, 1, "Water Lilies · Claude Monet, c.1906");
    hang("rice", X - 11.85, Z + 8, Math.PI / 2, 1, "Rice Fields at Dawn · Verse City Artist"); hang("fisher", X - 11.85, Z + 13, Math.PI / 2, 0.9, "The Old Fisherman · Verse City Artist");
    hang("river", X - 7, Z + 17.85, Math.PI, 1, "Mountain River · Verse City Artist"); hang("fruit", X + 7, Z + 17.85, Math.PI, 0.9, "Fruit Bowl · Verse City Artist");
    hang("mona", X, Z - 17.85, 0, 0.75, "Mona Lisa · Leonardo da Vinci, c.1503"); lb(g, 3, 2.6, 0.5, glassM, X, 3.6, Z - 17.4);
    for (let x = -3; x <= 3.01; x += 1.5) { lc(g, 0.05, 0.05, 1, GOLD, X + x, 0.5, Z - 15.5, 8); sol(X + x, Z - 15.5, 0.1, 0.1); } lb(g, 6, 0.06, 0.06, 0x8b1e1e, X, 0.85, Z - 15.5);
    sign("PAINTING GALLERY · TRANH NỔI TIẾNG", 6.5, X, 10, Z + 17.95, Math.PI, "#3b2f2a", "#ffe9a8");
    [-6, 2, 10].forEach(z => { lb(g, 0.8, 0.45, 3, 0x8b1e1e, X, 0.35, Z + z); lb(g, 0.9, 0.12, 3.1, 0x4a2a1c, X, 0.08, Z + z); sol(X, Z + z, 0.45, 1.5); });
    // góc vẽ tranh: giá vẽ, bàn màu, tranh dựng tường
    { const q = grp(X - 6, Z + 9, Math.PI / 2 + 0.3); bone(q, [-0.4, 0, 0.2], [0, 2.1, 0], 0.03, 0x8d5a2b); bone(q, [0.4, 0, 0.2], [0, 2.1, 0], 0.03, 0x8d5a2b); bone(q, [0, 0, -0.5], [0, 2, 0], 0.03, 0x8d5a2b);
      const cv = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.75), new THREE.MeshLambertMaterial({ map: museumPaint("rice") })); cv.position.set(0, 1.45, 0.1); q.add(cv); sol(X - 6, Z + 9, 0.45, 0.45); }
    lb(g, 0.9, 0.9, 0.6, 0x6b4a2b, X - 7.3, 0.45, Z + 10.4); sol(X - 7.3, Z + 10.4, 0.45, 0.3);
    [0, 0.3, 0.6].forEach(k => { const c = lb(g, 1.2, 0.9, 0.05, 0xf8f9fa, X - 9.4 + k, 0.5, Z + 16.6 - k * 0.3); c.rotation.x = -0.15; }); sol(X - 9, Z + 16.3, 0.9, 0.6);
    Object.assign(P.anchors, {
      painting: [[11.5, 3.7, 11, 9.9, 11], [11.5, 2.3, 6.5, 9.9, 6.5], [-11.5, 3.7, -13, -9.9, -13], [-11.5, 3.7, 8, -9.9, 7], [11.5, 3.7, -7, 9.9, -7], [11.5, 3.7, -13, 9.9, -13], [0, 3.9, -17, 2.8, -14.2], [11.5, 1.95, -1, 9.9, -1]].map(([a, b, c, d, e]) => [X + a, b, Z + c, X + d, Z + e]),
      studio: [[-6, 2.3, 9, -6, 7.3], [-7.3, 1.1, 10.4, -8.2, 8.6], [-7.0, 1.15, 10.2, -7.2, 8.4], [-9, 1.2, 16.2, -9, 14.6], [0, 0.9, 2, 1.6, 2], [-2.2, 1.1, -15.5, -2.2, -13.9], [0, 9.5, -16, 0, -12]].map(([a, b, c, d, e]) => [X + a, b, Z + c, X + d, Z + e])
    }); }
  /* ===================== 🚀 SCIENCE & SPACE (x 6…30, z 0…36) ===================== */
  { const X = cx + 18, Z = cz + 18;
    sign("SCIENCE & SPACE · KHOA HỌC – VŨ TRỤ", 7, X, 7.3, Z + 17.95, Math.PI, "#0b1d4a", "#a5d8ff");
    // quả địa cầu khổng lồ + vòng sàn
    const earth = skin(4, 2, 80, x => { x.fillStyle = "#2f7fd1"; x.fillRect(0, 0, 4, 2); x.fillStyle = "#5bb04a"; [[0.9, 0.55, 0.45, 0.3], [1.15, 0.85, 0.15, 0.12], [1.25, 1.3, 0.2, 0.35], [2.05, 0.5, 0.17, 0.12], [2.15, 1.05, 0.28, 0.38], [2.85, 0.55, 0.6, 0.28], [2.65, 0.85, 0.1, 0.13], [3.05, 0.9, 0.06, 0.15], [3.45, 1.35, 0.25, 0.15]].forEach(([a, b, c, d]) => { x.beginPath(); x.ellipse(a, b, c, d, 0, 0, 7); x.fill(); });
      x.fillStyle = "#f1f3f5"; x.fillRect(0, 1.85, 4, 0.15); x.fillRect(0, 0, 4, 0.08); x.fillStyle = "#e03131"; x.beginPath(); x.arc(3.05, 0.85, 0.04, 0, 7); x.fill(); });
    const gl = new THREE.Mesh(new THREE.SphereGeometry(3.2, 40, 28), new THREE.MeshLambertMaterial({ map: earth })); gl.position.set(X + 1, 4.4, Z); gl.rotation.y = -1.2; g.add(gl);
    lc(g, 1.2, 1.6, 1.2, 0xf1f3f5, X + 1, 0.6, Z, 24); sol(X + 1, Z, 3.4, 3.4);
    const band = new THREE.Mesh(new THREE.TorusGeometry(3.35, 0.1, 6, 40), mat(0xffd43b)); band.position.set(X + 1, 4.4, Z); band.rotation.x = Math.PI / 2 - 0.25; g.add(band);
    [5, 5.5].forEach(r => { const m = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.15, 48), mat(0xffffff)); m.rotation.x = -Math.PI / 2; m.position.set(X + 1, 0.012, Z); g.add(m); });
    // tên lửa
    [-14.5, 14.5].forEach((dz, i) => { const q = grp(X + 8.5, Z + dz, 0); lc(q, 1.4, 1.5, 0.3, 0x868e96, 0, 0.15, 0, 16); lc(q, 0.55, 0.6, 6, 0xf8f9fa, 0, 3.5, 0, 16);
      const n = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.6, 16), mat(i ? 0xe03131 : 0x1c7ed6)); n.position.y = 7.3; q.add(n); lc(q, 0.56, 0.56, 0.3, i ? 0xe03131 : 0x1c7ed6, 0, 5.4, 0, 16);
      for (let k = 0; k < 3; k++) { const f = lb(q, 0.08, 1.2, 0.8, i ? 0xe03131 : 0x1c7ed6, Math.cos(k * 2.09) * 0.75, 1.1, Math.sin(k * 2.09) * 0.75); f.rotation.y = Math.PI / 2 - k * 2.09; } ball(q, 0.15, 0x74c0fc, 0, 5, 0.53, 1, 1, 0.4); sol(X + 8.5, Z + dz, 1.4, 1.4); });
    // trạm vũ trụ
    { const q = grp(X - 6, Z + 13, 0, 0); bone(q, [-3, 1.5, 0], [3, 1.5, 0], 1.1, 0xe9ecef); [-3.1, 3.1].forEach(x => lc(q, 0.7, 0.7, 0.3, 0xadb5bd, x, 1.5, 0, 16).rotation.z = Math.PI / 2);
      const pn = skin(2, 1, 40, x => { x.fillStyle = "#1c3d7a"; x.fillRect(0, 0, 2, 1); x.strokeStyle = "#a5d8ff"; x.lineWidth = 0.03; for (let i = 0; i <= 2; i += 0.25) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 1); x.stroke(); } x.beginPath(); x.moveTo(0, 0.5); x.lineTo(2, 0.5); x.stroke(); });
      [-1, 1].forEach(s => { const p = new THREE.Mesh(new THREE.PlaneGeometry(4, 1.8), new THREE.MeshLambertMaterial({ map: pn, side: THREE.DoubleSide })); p.rotation.x = -Math.PI / 2; p.position.set(0, 3.1, s * 2.6); q.add(p); bone(q, [0, 2.4, s * 0.8], [0, 3.1, s * 1.8], 0.05, 0x868e96); });
      sol(X - 6, Z + 13, 3.2, 0.9); }
    // máy bay trên cột
    { const q = grp(X - 6, Z - 11, 0, 4.6); lc(g, 0.08, 0.1, 4.2, 0xadb5bd, X - 6, 2.1, Z - 11, 8); sol(X - 6, Z - 11, 0.2, 0.2); bone(q, [-3, 0, 0], [2.6, 0, 0], 0.4, 0xffffff); ball(q, 0.4, 0xffffff, 2.6, 0, 0, 1.4, 1, 1);
      lb(q, 1.4, 0.08, 6, 0xffffff, 0.2, -0.1, 0); lb(q, 0.8, 1.2, 0.08, 0x0b6b3a, -2.8, 0.6, 0); lb(q, 0.6, 0.06, 2, 0xffffff, -2.8, 0.1, 0); lb(q, 5, 0.1, 0.82, 0x1c7ed6, 0, -0.12, 0); }
    // hành tinh treo
    [[5, 10, 6, 1.2, 0xe9c46a, true], [-4, 11, -2, 1.6, 0xd4a373], [6, 9.5, -7, 0.8, 0xc0392b], [-3, 9, 8, 0.7, 0xadb5bd]].forEach(([dx, y, dz, r, c, ring]) => { ball(g, r, c, X + dx, y, Z + dz); lc(g, 0.01, 0.01, 14 - y, 0xdee2e6, X + dx, (14 + y) / 2 + r / 2, Z + dz, 4);
      if (ring) { const rg = new THREE.Mesh(new THREE.RingGeometry(r * 1.4, r * 2.1, 40), mat(0xd9c38c, { side: THREE.DoubleSide })); rg.position.set(X + dx, y, Z + dz); rg.rotation.x = -Math.PI / 2 + 0.4; g.add(rg); } });
    // phi hành gia, robot, chuỗi ADN, kính thiên văn
    figure(X - 8, Z + 6, "astro", 0xf8f9fa, Math.PI / 2, plinth(X - 8, Z + 6, 1, 0.5, 1, 0x1e3f8a));
    { const q = grp(X - 9.5, Z + 8.5, Math.PI / 2); lb(q, 0.7, 0.8, 0.5, 0xadb5bd, 0, 1, 0); lb(q, 0.5, 0.4, 0.4, 0xced4da, 0, 1.65, 0); [-1, 1].forEach(s => { ball(q, 0.06, 0x4dabf7, s * 0.12, 1.7, 0.21); bone(q, [s * 0.4, 1.3, 0], [s * 0.5, 0.8, 0.15], 0.05, 0x868e96); bone(q, [s * 0.18, 0.6, 0], [s * 0.18, 0, 0], 0.08, 0x868e96); }); lc(q, 0.02, 0.02, 0.3, 0x495057, 0, 2, 0, 4); ball(q, 0.05, 0xe03131, 0, 2.15, 0); sol(X - 9.5, Z + 8.5, 0.4, 0.4); }
    { const q = grp(X - 8.5, Z - 5.5, 0); for (let i = 0; i < 24; i++) { const a = i * 0.5, y = 0.6 + i * 0.15; const p1 = [Math.cos(a) * 0.5, y, Math.sin(a) * 0.5], p2 = [-p1[0], y, -p1[2]]; ball(q, 0.1, 0xe03131, ...p1); ball(q, 0.1, 0x1c7ed6, ...p2); if (i % 2 === 0) bone(q, p1, p2, 0.025, 0xf1f3f5); } lc(q, 0.6, 0.7, 0.4, 0x343a40, 0, 0.2, 0, 16); sol(X - 8.5, Z - 5.5, 0.7, 0.7); }
    { const q = grp(X + 5, Z - 14.5, 0.6); [-1, 1, 0].forEach((s, i) => bone(q, [0, 1.2, 0], [s * 0.4, 0, i === 2 ? -0.45 : 0.3], 0.03, 0x495057)); const tb = bone(q, [-0.5, 1.1, 0], [0.7, 1.6, 0], 0.12, 0xf8f9fa); sol(X + 5, Z - 14.5, 0.45, 0.45); }
    // góc thí nghiệm sát tường ngoài
    [-4, 4].forEach(dz => { lb(g, 1.2, 0.9, 3, 0xf1f3f5, X + 10.6, 0.45, Z + dz); lb(g, 1.3, 0.06, 3.1, 0x343a40, X + 10.6, 0.93, Z + dz); sol(X + 10.6, Z + dz, 0.6, 1.5); });
    { lb(g, 0.15, 0.4, 0.15, 0x343a40, X + 10.6, 1.15, Z - 5); lb(g, 0.06, 0.3, 0.06, 0x343a40, X + 10.6, 1.4, Z - 4.9); for (let i = 0; i < 4; i++) lc(g, 0.04, 0.04, 0.3, [0xe03131, 0x40c057, 0x4dabf7, 0xfab005][i], X + 10.4, 1.11, Z + 2.5 + i * 0.15, 8);
      const v = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.5, 10), mat(0x8d6e4a)); v.position.set(X + 10.6, 1.21, Z + 5); g.add(v); ball(g, 0.12, 0xff6b00, X + 10.6, 1.45, Z + 5);
      const mg = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.06, 6, 12, Math.PI), mat(0xe03131)); mg.position.set(X + 10.6, 1.12, Z - 3); g.add(mg); }
    lc(g, 0.2, 0.3, 1.6, 0x868e96, X + 10.8, 0.8, Z + 9.5, 12); { const tr = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.12, 8, 16), mat(0xadb5bd)); tr.rotation.x = Math.PI / 2; tr.position.set(X + 10.8, 1.75, Z + 9.5); g.add(tr); } ball(g, 0.12, 0xfff3bf, X + 10.8, 2.1, Z + 9.5); sol(X + 10.8, Z + 9.5, 0.35, 0.35);
    Object.assign(P.anchors, {
      space: [[1, 1.6, 3.6, 1, 4.3], [7.3, 2, 14.5, 6.2, 14.5], [-7.3, 2.2, 6, -6.4, 6], [-6, 2.4, 11.8, -6, 10.6], [5, 10, 6, 5, 6], [-3, 9, 8, -3, 8], [11.85, 5.5, 0, 8.8, 0], [-6, 4.8, -10.2, -6, -8.8]].map(([a, b, c, d, e]) => [X + a, b, Z + c, X + d, Z + e]),
      lab: [[10.6, 1.25, -5, 9.1, -5], [-9.5, 2.3, 8.5, -8, 8.5], [10.6, 1.3, -3, 9.1, -3], [-8.5, 2.6, -5.5, -7, -5.5], [10.6, 1.3, 3, 9.1, 3], [10.6, 1.6, 5, 9.1, 5], [5, 1.9, -14.5, 5, -12.8], [10.8, 2.5, 9.5, 9.2, 9.5]].map(([a, b, c, d, e]) => [X + a, b, Z + c, X + d, Z + e])
    }); }
  Object.assign(P.anchors, {
    lobby: [[-4, 1.3, 27, -2.6, 27], [5.6, 2.4, 28, 4.3, 28], [-4, 1.3, 29.2, -2.6, 29.2], [3.5, 1.9, 24, 3.5, 22.6]].map(([a, b, c, d, e]) => [cx + a, b, cz + c, cx + d, cz + e]),
    shop: [[-5.1, 1.2, -29, -3.8, -29], [5.1, 1.2, -29, 3.8, -29], [-5.1, 1.9, -32, -3.8, -32], [5.1, 1.9, -32, 3.8, -32]].map(([a, b, c, d, e]) => [cx + a, b, cz + c, cx + d, cz + e])
  });
  g.traverse(o => { if (o.isMesh && o.position.y > 6) o.userData.flat = true; });
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["museumhall"] = {
  furnish: furnishMuseum,
  customWalls: true,
  bright: true
};
