/* EnglishVerse – ngoại thất STAR CINEMA (rạp chiếu phim kiểu multiplex hiện đại, thương hiệu tự đặt – không logo thật).
   Mặt tiền quay về +z, rộng 20 m (trục x), sâu 16 m. Gồm: tường tối, biển đèn "STAR CINEMA", 3 hộp đèn poster lớn, dải LED,
   cửa kính + mái che, thảm đỏ + cột rào xếp hàng, xe bắp rang ngoài trời, cột chữ STARIUM, 2 tia đèn pha trên mái.
   File này cũng chứa cinemaPoster() – 5 poster phim thiếu nhi (tên tự đặt) dùng chung cho nội thất (parts/interiors/cinema.js). */
const CINEMA_POSTERS = {};
function cinemaPoster(kind) {   // poster phim 3 × 4 (vẽ bằng canvas, cache để ngoại thất + nội thất dùng chung 1 ảnh)
  if (CINEMA_POSTERS[kind]) return CINEMA_POSTERS[kind];
  const T = { space: "SPACE PUPPIES", dragon: "LITTLE DRAGON", robot: "ROBOT & ROSE", ocean: "OCEAN FRIENDS", mango: "SUPER MANGO" };
  return CINEMA_POSTERS[kind] = skin(3, 4, 70, (x, W, H) => {
    const ell = (c, a, b, rx, ry, r) => { x.fillStyle = c; x.beginPath(); x.ellipse(a, b, rx, ry, r || 0, 0, 7); x.fill(); };
    const grad = (c1, c2) => { const q = x.createLinearGradient(0, 0, 0, H); q.addColorStop(0, c1); q.addColorStop(1, c2); x.fillStyle = q; x.fillRect(0, 0, W, H); };
    if (kind === "space") {
      grad("#2b1b6b", "#7a3fb8"); x.fillStyle = "#fff"; for (let i = 0; i < 40; i++) x.fillRect((i * 1.31) % W, (i * 0.97) % 2.6, 0.04, 0.04);
      ell("#ffb703", 2.2, 1.0, 0.5, 0.5); x.strokeStyle = "#ffd166"; x.lineWidth = 0.07; x.beginPath(); x.ellipse(2.2, 1.0, 0.85, 0.2, -0.4, 0, 7); x.stroke();
      ell("#d6e4f0", 1.5, 2.2, 0.75, 0.75); ell("#4cc9f0", 1.5, 2.2, 0.55, 0.5);   // mũ phi hành gia
      ell("#f1d1a3", 1.5, 2.25, 0.4, 0.36); ell("#8a5a3b", 1.12, 2.0, 0.14, 0.3, 0.3); ell("#8a5a3b", 1.88, 2.0, 0.14, 0.3, -0.3);   // chú cún
      ell("#222", 1.38, 2.2, 0.05, 0.06); ell("#222", 1.62, 2.2, 0.05, 0.06); ell("#222", 1.5, 2.36, 0.08, 0.06); }
    if (kind === "dragon") {
      grad("#ffd27a", "#ff7a59"); ell("#fff3b0", 1.5, 1.2, 0.7, 0.7); x.fillStyle = "#2f9e44"; x.beginPath(); x.moveTo(0, H); x.quadraticCurveTo(1, 2.2, 2, 2.8); x.quadraticCurveTo(2.6, 2.5, W, 2.6); x.lineTo(W, H); x.fill();
      ell("#40c057", 1.5, 2.3, 0.62, 0.5); ell("#40c057", 1.5, 1.9, 0.42, 0.38); ell("#f8f9fa", 1.35, 1.85, 0.09, 0.1); ell("#f8f9fa", 1.65, 1.85, 0.09, 0.1); ell("#111", 1.37, 1.86, 0.04, 0.05); ell("#111", 1.63, 1.86, 0.04, 0.05);
      x.fillStyle = "#ffd43b"; x.beginPath(); x.moveTo(1.2, 1.58); x.lineTo(1.3, 1.35); x.lineTo(1.4, 1.58); x.moveTo(1.6, 1.58); x.lineTo(1.7, 1.35); x.lineTo(1.8, 1.58); x.fill();
      ell("#e03131", 0.75, 2.2, 0.28, 0.5, -0.5); ell("#e03131", 2.25, 2.2, 0.28, 0.5, 0.5); ell("#ffa94d", 1.5, 2.4, 0.3, 0.3); }
    if (kind === "robot") {
      grad("#0b7285", "#66d9e8"); x.fillStyle = "#adb5bd"; x.fillRect(0.9, 1.4, 1.1, 1.2); x.fillStyle = "#ced4da"; x.fillRect(1.0, 0.8, 0.9, 0.7); x.fillStyle = "#ffe066"; x.fillRect(1.1, 0.95, 0.2, 0.2); x.fillRect(1.6, 0.95, 0.2, 0.2);
      x.fillStyle = "#e03131"; x.fillRect(1.15, 1.25, 0.6, 0.08); x.fillRect(1.43, 0.45, 0.04, 0.35); ell("#e03131", 1.45, 0.42, 0.08, 0.08); x.fillStyle = "#868e96"; x.fillRect(0.6, 1.5, 0.3, 0.9); x.fillRect(2.0, 1.5, 0.3, 0.9);
      x.fillStyle = "#2f9e44"; x.fillRect(2.4, 2.4, 0.07, 0.8); for (let i = 0; i < 6; i++) ell("#ff6b9d", 2.43 + Math.cos(i) * 0.2, 2.3 + Math.sin(i) * 0.2, 0.15, 0.1, i); ell("#ffd43b", 2.43, 2.3, 0.1, 0.1); }
    if (kind === "ocean") {
      grad("#4dabf7", "#1864ab"); for (let i = 0; i < 9; i++) { x.strokeStyle = "#a5d8ff"; x.lineWidth = 0.03; x.beginPath(); x.arc(0.4 + (i * 0.77) % 2.4, 0.5 + (i * 0.61) % 2.2, 0.08 + (i % 3) * 0.04, 0, 7); x.stroke(); }
      ell("#ff922b", 1.5, 1.5, 0.75, 0.45); x.fillStyle = "#ff922b"; x.beginPath(); x.moveTo(2.1, 1.5); x.lineTo(2.6, 1.15); x.lineTo(2.6, 1.85); x.fill(); ell("#fff", 1.1, 1.4, 0.13, 0.13); ell("#111", 1.08, 1.4, 0.06, 0.06);
      x.fillStyle = "#fff"; x.fillRect(1.45, 1.1, 0.08, 0.8); ell("#ffd43b", 0.6, 2.3, 0.3, 0.2); x.fillStyle = "#e8c56a"; x.fillRect(0, 3.0, W, 1); ell("#f06595", 2.3, 2.9, 0.25, 0.25); }
    if (kind === "mango") {
      grad("#ffec99", "#fab005"); x.fillStyle = "#e03131"; x.beginPath(); x.moveTo(0.9, 1.5); x.lineTo(0.2, 2.9); x.lineTo(2.0, 2.2); x.lineTo(2.1, 1.5); x.fill();
      ell("#ff9f1c", 1.55, 1.9, 0.65, 0.8, 0.3); ell("#ffbf47", 1.4, 1.7, 0.3, 0.4, 0.3); x.fillStyle = "#2f9e44"; x.beginPath(); x.ellipse(1.8, 1.1, 0.3, 0.12, -0.6, 0, 7); x.fill();
      ell("#fff", 1.35, 1.85, 0.12, 0.13); ell("#fff", 1.8, 1.85, 0.12, 0.13); ell("#111", 1.37, 1.87, 0.06, 0.06); ell("#111", 1.82, 1.87, 0.06, 0.06); x.strokeStyle = "#7a3e00"; x.lineWidth = 0.05; x.beginPath(); x.arc(1.58, 2.05, 0.2, 0.2, 2.9); x.stroke();
      x.fillStyle = "#4c6ef5"; x.fillRect(1.0, 1.72, 1.0, 0.18); }
    x.fillStyle = "rgba(0,0,0,0.55)"; x.fillRect(0, 3.15, W, 0.85); x.fillStyle = "#ffe066"; signText(x, T[kind], W / 2, 3.42, 2.7, 0.36, "#ffe066"); signText(x, "★ IN CINEMAS NOW ★", W / 2, 3.78, 2.5, 0.16, "#ffffff");
    x.strokeStyle = "#ffffff"; x.lineWidth = 0.05; x.strokeRect(0.05, 0.05, W - 0.1, H - 0.1);
  });
}
EXTERIORS_EXTRA["cinema"] = function (g, P) {
  const F = 8, BH = 10, LED = {}, led = (c) => LED[c] || (LED[c] = new THREE.MeshBasicMaterial({ color: c }));
  const body = 0x262a33, gold = 0xffc233;
  const glow = (tex, w, h, x, y, z, ry, par) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex })); m.position.set(x, y, z); m.rotation.y = ry || 0; m.userData.flat = true; (par || g).add(m); return m; };
  lb(g, 20, BH, 16, body, 0, BH / 2, 0);                                    // khối nhà chính
  lb(g, 20.6, 0.5, 16.6, 0x14161b, 0, BH + 0.25, 0);                        // gờ mái
  lb(g, 24, 0.04, 20, 0x8a8f98, 0, 0.02, 0.5);                              // vỉa hè
  lb(g, 3.4, 0.05, 7.2, 0xb71c1c, 0, 0.06, F + 3.6); lb(g, 3.6, 0.04, 7.4, gold, 0, 0.055, F + 3.6);   // thảm đỏ viền vàng
  // ---- tầng trệt: mặt kính + 2 hộp đèn poster nhỏ ----
  const glass = skin(9, 3.8, 50, (x, w, h) => {
    x.fillStyle = "#ffb454"; x.fillRect(0, 0, w, h); const q = x.createLinearGradient(0, 0, 0, h); q.addColorStop(0, "#3a2a52"); q.addColorStop(1, "#ffcf7a"); x.fillStyle = q; x.fillRect(0.05, 0.05, w - 0.1, h - 0.1);
    for (let i = 0; i < 6; i++) { x.fillStyle = "rgba(255,255,255,0.12)"; x.fillRect(0.3 + i * 1.5, 0.1, 0.5, h - 0.2); }
    x.fillStyle = "#2a2a30"; for (let X = 0; X <= w; X += 1.5) x.fillRect(X - 0.04, 0, 0.08, h); x.fillRect(0, 2.9, w, 0.08);
    x.fillStyle = "#1a1a1f"; x.fillRect(w / 2 - 1.55, 0.3, 3.1, h - 0.3); x.fillStyle = "#ffe9a8"; x.fillRect(w / 2 - 1.47, 0.38, 1.4, h - 0.46); x.fillRect(w / 2 + 0.07, 0.38, 1.4, h - 0.46);   // 2 cánh cửa kính
    x.fillStyle = "#c9a227"; x.fillRect(w / 2 - 0.2, 1.6, 0.08, 0.7); x.fillRect(w / 2 + 0.12, 1.6, 0.08, 0.7); signText(x, "ENTRANCE · MỜI VÀO", w / 2, 0.14, 2.8, 0.2, "#ffffff"); });
  glow(glass, 9, 3.8, 0, 1.9, F + 0.04);
  [-1, 1].forEach((s, i) => {
    lb(g, 3.1, 4.0, 0.3, 0x15171c, s * 7.2, 2.1, F + 0.15); glow(cinemaPoster(i ? "mango" : "robot"), 2.8, 3.73, s * 7.2, 2.1, F + 0.32);
  });
  // ---- mái che + dải LED ----
  lb(g, 10.6, 0.4, 3.4, 0x15171c, 0, 4.1, F + 1.7); lb(g, 10.6, 0.14, 0.12, led(0xffe066), 0, 3.85, F + 3.42); lb(g, 10.6, 0.1, 0.1, led(0xff4fa3), 0, 4.33, F + 3.42);
  lb(g, 9.8, 0.05, 2.9, led(0xfff1c2), 0, 3.88, F + 1.7);   // đèn dưới mái che
  [-4.7, 4.7].forEach(x => { lc(g, 0.14, 0.14, 4, 0x2d2f36, x, 2, F + 3.1, 10); lc(g, 0.18, 0.18, 0.1, gold, x, 0.05, F + 3.1, 10); });
  [4.2, 8.6].forEach(y => { lb(g, 20.1, 0.14, 0.14, led(y > 5 ? 0x4dd0e1 : 0xff4fa3), 0, y, F + 0.06); });
  [-10.05, 10.05].forEach(x => { lb(g, 0.14, BH, 0.14, led(0x4dd0e1), x, BH / 2, F + 0.02); });
  // ---- tầng trên: 3 hộp đèn poster lớn + biển đèn ----
  ["space", "dragon", "ocean"].forEach((k, i) => {
    const x = (i - 1) * 6.3; lb(g, 4.2, 5.4, 0.35, 0x111318, x, 7.1, F + 0.17); lb(g, 4.35, 0.12, 0.38, led(gold), x, 9.85 - 0.05, F + 0.2);
    glow(cinemaPoster(k), 3.9, 5.2, x, 7.1, F + 0.37); });
  const mq = skin(16, 2.4, 50, (x, w, h) => {
    x.fillStyle = "#13131a"; x.fillRect(0, 0, w, h); x.fillStyle = "#c92a2a"; x.fillRect(0.12, 0.12, w - 0.24, h - 0.24); x.fillStyle = "#1c1030"; x.fillRect(0.3, 0.3, w - 0.6, h - 0.6);
    x.fillStyle = "#ffe9a3"; for (let X = 0.4; X < w - 0.2; X += 0.5) { x.beginPath(); x.arc(X, 0.21, 0.07, 0, 7); x.arc(X, h - 0.21, 0.07, 0, 7); x.fill(); } for (let Y = 0.4; Y < h - 0.2; Y += 0.5) { x.beginPath(); x.arc(0.21, Y, 0.07, 0, 7); x.arc(w - 0.21, Y, 0.07, 0, 7); x.fill(); }
    const q = x.createLinearGradient(0, 0.4, 0, h - 0.4); q.addColorStop(0, "#fff3a8"); q.addColorStop(1, "#ffb300"); x.shadowColor = "#ff6f00"; x.shadowBlur = 0.25;
    signText(x, "STAR CINEMA", w / 2, h / 2 + 0.05, w - 4.2, 1.5, q, "900 "); x.shadowBlur = 0;
    [[1.5, 1.2], [w - 1.5, 1.2]].forEach(([a, b]) => { x.fillStyle = "#ffd43b"; x.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.28 : 0.7, an = -Math.PI / 2 + i * Math.PI / 5; x.lineTo(a + r * Math.cos(an), b + r * Math.sin(an)); } x.closePath(); x.fill(); }); });
  lb(g, 16.4, 2.8, 0.4, 0x0b0b10, 0, 11.4, F - 1.2); glow(mq, 16, 2.4, 0, 11.4, F - 0.98);
  [-5, 5].forEach(x => lb(g, 0.3, 1.4, 0.3, 0x111318, x, 10.6, F - 1.2));   // chân biển
  // ---- cột chữ STARIUM (cạnh trái) ----
  const fin = skin(1.6, 9, 50, (x, w, h) => { x.fillStyle = "#101018"; x.fillRect(0, 0, w, h); x.fillStyle = "#4dd0e1"; x.fillRect(0, 0, 0.1, h); x.fillRect(w - 0.1, 0, 0.1, h); "STARIUM".split("").forEach((c, i) => signText(x, c, w / 2, 0.75 + i * 1.18, 1.2, 1.0, i % 2 ? "#ffd43b" : "#ff6b9d", "900 ")); });
  lb(g, 1.8, 9.4, 0.4, 0x0b0b10, -11.2, 4.7, F - 0.6); glow(fin, 1.6, 9, -11.2, 4.7, F - 0.38);
  // ---- hai bên hông: họa tiết cuộn phim ----
  const side = skin(16, BH, 24, (x, w, h) => { x.fillStyle = "#262a33"; x.fillRect(0, 0, w, h); x.fillStyle = "#111318"; x.fillRect(1.2, 0, 1.8, h); x.fillRect(w - 3, 0, 1.8, h);
    x.fillStyle = "#e9ecef"; for (let Y = 0.3; Y < h; Y += 0.6) { x.fillRect(1.35, Y, 0.3, 0.35); x.fillRect(2.55, Y, 0.3, 0.35); x.fillRect(w - 2.85, Y, 0.3, 0.35); x.fillRect(w - 1.65, Y, 0.3, 0.35); }
    x.fillStyle = "#ffd43b"; signText(x, "★ STAR CINEMA ★", w / 2, h * 0.45, 6, 0.9, "#ffd43b"); signText(x, "Movies for everyone!", w / 2, h * 0.52, 6, 0.4, "#dee2e6"); });
  [-1, 1].forEach(s => { const m = new THREE.Mesh(new THREE.PlaneGeometry(16, BH), new THREE.MeshLambertMaterial({ map: side })); m.position.set(s * 10.02, BH / 2, 0); m.rotation.y = s * Math.PI / 2; m.userData.flat = true; g.add(m); });
  // ---- cột rào xếp hàng + dây nhung ----
  [-1, 1].forEach(s => { for (let i = 0; i < 4; i++) { const z = F + 1.2 + i * 1.6; lc(g, 0.05, 0.05, 0.95, gold, s * 1.9, 0.5, z, 8); lc(g, 0.13, 0.15, 0.06, 0x2d2f36, s * 1.9, 0.03, z, 10); const b = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), mat(gold)); b.position.set(s * 1.9, 1, z); g.add(b);
    if (i < 3) lb(g, 0.04, 0.04, 1.6, 0xc0392b, s * 1.9, 0.85, z + 0.8); } });
  // ---- xe bắp rang (ngoài trời) ----
  { const cx = 7.4, cz = F + 3.8, q = new THREE.Group(); q.position.set(cx, 0, cz); q.rotation.y = -0.25; g.add(q);
    lb(q, 1.6, 0.9, 1, 0xd62828, 0, 0.7, 0); lb(q, 1.7, 0.08, 1.1, 0xfff3bf, 0, 1.18, 0); lb(q, 1.4, 0.7, 0.9, mat(0xd0ebff, { transparent: true, opacity: 0.4 }), 0, 1.57, 0);
    [-0.45, 0, 0.45].forEach(dx => { const p = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), mat(0xfff1b8)); p.position.set(dx, 1.4, 0); q.add(p); const p2 = p.clone(); p2.position.set(dx + 0.1, 1.62, 0.1); q.add(p2); });
    [-0.55, 0.55].forEach(dx => lc(q, 0.17, 0.17, 0.1, 0x2d2f36, dx, 0.17, 0.55, 10).rotation.x = Math.PI / 2);
    lc(q, 0.04, 0.04, 2.3, 0xdee2e6, 0, 1.15, -0.4, 6); const um = new THREE.Mesh(new THREE.ConeGeometry(1.35, 0.55, 12), mat(0xe03131, { side: THREE.DoubleSide })); um.position.set(0, 2.45, -0.4); q.add(um);
    const t = textPlate("POPCORN 🍿 10K", 1.5, 0.35, "#ffe066", "#c0392b"); t.position.set(0, 0.72, 0.52); q.add(t); }
  // ---- bảng "NOW SHOWING" chữ A đặt trên vỉa hè ----
  { const q = new THREE.Group(); q.position.set(-7.2, 0, F + 3.6); q.rotation.y = 0.3; g.add(q);
    [-1, 1].forEach(s => { const l = lb(q, 0.08, 1.7, 0.08, 0x2d2f36, s * 0.55, 0.8, 0); l.rotation.z = s * -0.12; });
    lb(q, 1.3, 1.5, 0.08, 0x15171c, 0, 1.0, 0.05); glow(cinemaPoster("space"), 1.1, 1.47, 0, 1.0, 0.1, 0, q); }
  // ---- 2 tia đèn pha trên mái ----
  [-1, 1].forEach(s => { lb(g, 0.7, 0.4, 0.7, 0x333840, s * 8.5, BH + 0.7, -3); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 1.1, 22, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff3bf, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }));
    c.position.set(s * 8.5 + s * 3.6, BH + 11, -3); c.rotation.z = -s * 0.32; c.userData.flat = true; g.add(c); });
  // ---- biển ngôi sao trên mái + thùng rác ----
  { const s = new THREE.Shape(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 0.45 : 1.1, a = Math.PI / 2 + i * Math.PI / 5; i ? s.lineTo(r * Math.cos(a), r * Math.sin(a)) : s.moveTo(r * Math.cos(a), r * Math.sin(a)); }
    const star = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.3, bevelEnabled: false }), led(0xffd43b)); star.position.set(0, 13.6, F - 1.4); g.add(star); lb(g, 0.15, 1, 0.15, 0x333840, 0, 12.9, F - 1.3); }
  lc(g, 0.3, 0.26, 0.8, 0x495057, -9, 0.4, F + 1.2, 10); lc(g, 0.31, 0.31, 0.06, 0x212529, -9, 0.83, F + 1.2, 10);
  return {
    solids: [[0, 0, 10, 8], [7.4, F + 3.8, 0.95, 0.65], [-7.2, F + 3.6, 0.7, 0.3], [-4.7, F + 3.1, 0.2, 0.2], [4.7, F + 3.1, 0.2, 0.2], [-9, F + 1.2, 0.35, 0.35], [-11.2, F - 0.6, 0.9, 0.3]],
    door: [0, F + 4.6], map: [[0, 0, 20, 16]]
  };
};
