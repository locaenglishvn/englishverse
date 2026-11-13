/* EnglishVerse – nội thất "school" (layout: "schoolhall"). Mỗi nơi 1 file (xem docs/TEAM.md).
   Dùng các hàm chung của index.html (lb, lc, mat, skin, textPlate, signText, pot…) và mảng fans (quạt trần quay, khai báo trong post.js).
   VERSE SCHOOL – lớp học kiểu trường Việt Nam: tường vàng kem, chân tường xanh lá, cửa sổ chớp xanh, quạt trần, bảng trắng + bàn giáo viên,
   16 bàn đôi chia 2 dãy, góc khoa học (trái), góc mỹ thuật & âm nhạc (phải), dãy tủ đồ (trái, gần cửa), căng tin (phải, gần cửa).
   Phòng 30 × 36 m, trần 5 m. Toạ độ (dx, dz) tính từ giữa phòng, cửa ở dz = +18.
   Chừa trống: lối vào giữa dz +12..+18, lối giữa 2 dãy bàn, chỗ NPC: (-3,-13) (-11,-7) (11,-7) (-11,9) (11,9). */
const SCW = {};
function schoolWall(len, h, kind) {   // tường vàng kem, chân tường xanh lá, cửa sổ chớp xanh (tường bên), khẩu hiệu tiếng Anh (tường trước)
  const k = len + kind; if (SCW[k]) return SCW[k];
  const t = skin(len, h, 20, (x, W, H) => {
    x.fillStyle = "#fff1b8"; x.fillRect(0, 0, W, H); x.fillStyle = "#69b578"; x.fillRect(0, H - 1.2, W, 1.2); x.fillStyle = "#4f9a5f"; x.fillRect(0, H - 1.25, W, 0.08);
    x.fillStyle = "#f7e08f"; x.fillRect(0, 0, W, 0.25);
    if (kind === "side") for (let X = 1.5; X < W - 2; X += 4.5) { x.fillStyle = "#ffffff"; x.fillRect(X - 0.12, 1.08, 2.44, 1.94); x.fillStyle = "#cde8f7"; x.fillRect(X, 1.2, 2.2, 1.7);
      x.fillStyle = "#3b82c4"; x.fillRect(X - 0.75, 1.15, 0.65, 1.8); x.fillRect(X + 2.3, 1.15, 0.65, 1.8); x.fillStyle = "#2f6ea8"; for (let j = 0; j < 9; j++) { x.fillRect(X - 0.7, 1.25 + j * 0.19, 0.55, 0.05); x.fillRect(X + 2.35, 1.25 + j * 0.19, 0.55, 0.05); }
      x.fillStyle = "#ffffff"; x.fillRect(X + 1.06, 1.2, 0.08, 1.7); x.fillRect(X, 2.02, 2.2, 0.06); }
    if (kind === "front") { x.fillStyle = "#e03131"; x.fillRect(W / 2 - 7, 0.45, 14, 0.75); signText(x, "LEARN · PLAY · SHARE · GROW", W / 2, 0.84, 13, 0.5, "#fff3bf"); }
  });
  return SCW[k] = new THREE.MeshLambertMaterial({ map: t });
}
function furnishSchool(P, g, cx, cz, W, D, fur) {
  const back = cz - D / 2, front = cz + D / 2, H = (P.size || {}).h || 5, S = P.room.solids;
  const sol = (x, z, hw, hd) => S.push({ x, z, hw, hd });
  const B = (w, h, d, c, x, y, z) => lb(g, w, h, d, c, x, y, z);
  const plate = (t, w, h, bg, fg, x, y, z, ry) => { const p = textPlate(t, w, h, bg, fg); p.position.set(x, y, z); p.rotation.y = ry || 0; g.add(p); return p; };
  const pic = (tex, w, h, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshLambertMaterial({ map: tex })); m.position.set(x, y, z); m.rotation.y = ry || 0; g.add(m); return m; };
  // sàn gạch hoa + tường + trần trắng có đèn tuýp
  const fl = skin(1, 1, 48, x => { x.fillStyle = "#e9ddc8"; x.fillRect(0, 0, 1, 1); x.fillStyle = "#dcc3a3"; x.beginPath(); x.moveTo(0.5, 0.3); x.lineTo(0.7, 0.5); x.lineTo(0.5, 0.7); x.lineTo(0.3, 0.5); x.fill(); x.fillStyle = "#d8c8ab"; x.fillRect(0, 0, 1, 0.03); x.fillRect(0, 0, 0.03, 1); });
  fl.wrapS = fl.wrapT = THREE.RepeatWrapping; fl.repeat.set(W, D); g.children[0].material = new THREE.MeshLambertMaterial({ map: fl });
  ["back", "front", "side", "side"].forEach((k, i) => g.children[1 + i].material = schoolWall(i < 2 ? W : D, H, k));
  { const m = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mat(0xfaf6ee, { side: THREE.DoubleSide })); m.rotation.x = Math.PI / 2; m.position.set(cx, H, cz); g.add(m); }
  const tube = new THREE.MeshBasicMaterial({ color: 0xffffff });
  [-12, -6, 0, 6, 12].forEach(dz => [-8, 8].forEach(dx => { const m = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.18), tube); m.position.set(cx + dx, H - 0.05, cz + dz); g.add(m); }));
  [[-4, -9], [4, -9], [-4, -3], [4, -3]].forEach(([dx, dz]) => {   // quạt trần (quay)
    lc(g, 0.03, 0.03, 0.8, 0x495057, cx + dx, H - 0.4, cz + dz, 6); const f = new THREE.Group(); f.position.set(cx + dx, H - 0.85, cz + dz); g.add(f); fans.push(f);
    lc(f, 0.16, 0.16, 0.14, 0x495057, 0, 0, 0, 10); for (let i = 0; i < 3; i++) { const bl = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.02, 0.2), mat(0xf1f3f5)); bl.position.set(Math.cos(i * 2.09) * 0.65, 0, Math.sin(i * 2.09) * 0.65); bl.rotation.y = -i * 2.09; f.add(bl); } });
  // ===== BẢNG + BÀN GIÁO VIÊN (board) =====
  B(10.4, 2.4, 0.12, 0x868e96, cx, 2.3, back + 0.08); B(10, 2.1, 0.04, 0xfdfdfd, cx, 2.3, back + 0.15); B(10, 0.08, 0.25, 0x868e96, cx, 1.15, back + 0.2);
  const wb = skin(10, 2.1, 30, x => { x.clearRect(0, 0, 10, 2.1); x.fillStyle = "#1c7ed6"; x.font = "bold 0.32px system-ui"; x.fillText("Good morning, class!", 0.3, 0.45); x.fillStyle = "#e03131"; x.fillText("Unit 5: My School", 3.6, 1.0);
    x.fillStyle = "#2b8a3e"; x.font = "0.26px system-ui"; ["• classroom", "• library", "• playground"].forEach((t, i) => x.fillText(t, 0.6, 1.35 + i * 0.3)); x.fillStyle = "#343a40"; x.fillText("I go to school by bike.", 5.5, 1.6); });
  { const m = pic(wb, 10, 2.1, cx, 2.3, back + 0.18); m.material.transparent = true; }
  sol(cx, back + 0.15, 5.2, 0.25);
  B(2.4, 0.08, 1, 0x8d5a2b, cx + 2.5, 0.8, cz - 14.5); B(2.3, 0.76, 0.08, 0x6f4e37, cx + 2.5, 0.38, cz - 14.05); [-1.1, 1.1].forEach(d => B(0.08, 0.76, 0.9, 0x6f4e37, cx + 2.5 + d, 0.38, cz - 14.5)); sol(cx + 2.5, cz - 14.5, 1.25, 0.55);
  B(0.5, 0.08, 0.5, 0x3b5bdb, cx + 2.5, 0.5, cz - 15.5); B(0.5, 0.6, 0.08, 0x3b5bdb, cx + 2.5, 0.8, cz - 15.78); sol(cx + 2.5, cz - 15.5, 0.3, 0.3);
  // ===== BÀN HỌC (classroom): 2 dãy × 2 cột × 4 hàng bàn đôi, ghế băng =====
  const deskT = mat(0xd9a46a), deskL = mat(0x6f4e37), bench = mat(0x3b82c4);
  [-5.5, -2.5, 2.5, 5.5].forEach(dx => [-10, -7.5, -5, -2.5].forEach(dz => { const x = cx + dx, z = cz + dz;
    lb(g, 1.3, 0.06, 0.55, deskT, x, 0.75, z); lb(g, 1.3, 0.4, 0.04, deskL, x, 0.52, z - 0.25); [-0.6, 0.6].forEach(d => lb(g, 0.05, 0.72, 0.5, deskL, x + d, 0.36, z));
    lb(g, 1.3, 0.05, 0.3, bench, x, 0.45, z + 0.55); [-0.55, 0.55].forEach(d => lb(g, 0.05, 0.43, 0.25, deskL, x + d, 0.22, z + 0.55)); sol(x, z + 0.15, 0.68, 0.6); }));
  [[-5.5, -10, "📕"], [2.5, -7.5, "📗"], [5.5, -5, "✏️"]].forEach(([dx, dz]) => B(0.3, 0.05, 0.22, 0xfab005, cx + dx - 0.3, 0.8, cz + dz));
  // ===== GÓC KHOA HỌC (science) – tường trái =====
  B(0.9, 0.9, 10, 0xf1f3f5, cx - 14.4, 0.45, cz - 7); B(1, 0.06, 10.1, 0x343a40, cx - 14.4, 0.93, cz - 7); sol(cx - 14.4, cz - 7, 0.5, 5.05);
  lc(g, 0.08, 0.12, 0.3, 0x343a40, cx - 14.4, 1.11, cz - 10.5, 8); lc(g, 0.04, 0.04, 0.35, 0x495057, cx - 14.4, 1.4, cz - 10.5, 6);   // kính hiển vi
  [-8.5, -8.2, -7.9].forEach((z, i) => lc(g, 0.07, 0.1, 0.3, [0x74c0fc, 0x8ce99a, 0xffa8a8][i], cx - 14.4, 1.11, cz + z + 0.5, 8));   // cốc thí nghiệm
  pot(g, cx - 14.4, cz - 4.5, 0.7); B(0.5, 0.35, 0.35, 0xa5d8ff, cx - 14.4, 1.13, cz - 2.8);   // chậu cây non, bể cá
  const sky = skin(4, 2, 40, x => { x.fillStyle = "#1b1f3b"; x.fillRect(0, 0, 4, 2); [["#ffd43b", 0.35, 0.3], ["#adb5bd", 0.12, 0.8], ["#ffa94d", 0.14, 1.15], ["#4dabf7", 0.15, 1.55], ["#ff6b6b", 0.12, 1.95], ["#f59f00", 0.25, 2.5], ["#e9c46a", 0.22, 3.05], ["#74c0fc", 0.17, 3.5]].forEach(([c, r, X]) => { x.fillStyle = c; x.beginPath(); x.arc(X, 1, r, 0, 7); x.fill(); });
    signText(x, "OUR SOLAR SYSTEM", 2, 0.22, 3.6, 0.22, "#ffffff"); });
  pic(sky, 4, 2, cx - W / 2 + 0.04, 2.6, cz - 8.5, Math.PI / 2); plate("SCIENCE CORNER", 2.6, 0.45, "#2b8a3e", "#ffffff", cx - W / 2 + 0.04, 4.0, cz - 8.5, Math.PI / 2);
  lc(g, 0.05, 0.3, 0.9, 0x6f4e37, cx - 13.2, 0.45, cz - 13.5, 8); { const gl = new THREE.Mesh(new THREE.SphereGeometry(0.35, 14, 10), mat(0x4dabf7)); gl.position.set(cx - 13.2, 1.25, cz - 13.5); g.add(gl); } sol(cx - 13.2, cz - 13.5, 0.35, 0.35);
  // ===== GÓC MỸ THUẬT & ÂM NHẠC (art) – tường phải =====
  B(0.6, 1.8, 6, 0x8d5a2b, cx + 14.65, 0.9, cz - 9); sol(cx + 14.65, cz - 9, 0.35, 3);
  const paints = skin(6, 1.8, 30, x => { x.fillStyle = "#8d5a2b"; x.fillRect(0, 0, 6, 1.8); x.fillStyle = "#6f4e37"; [0.6, 1.2].forEach(y => x.fillRect(0, y, 6, 0.05));
    ["#e03131", "#f08c00", "#fab005", "#40c057", "#1c7ed6", "#7048e8", "#e64980", "#ffffff"].forEach((c, i) => { x.fillStyle = c; x.fillRect(0.3 + i * 0.7, 0.25, 0.4, 0.33); x.fillRect(0.3 + i * 0.7, 0.85, 0.3, 0.33); x.fillRect(0.4 + i * 0.7, 1.4, 0.35, 0.35); }); });
  pic(paints, 6, 1.8, cx + 14.34, 0.9, cz - 9, -Math.PI / 2);
  const easel = (x, z, c) => { [-0.35, 0.35].forEach(d => { const l = B(0.06, 1.8, 0.06, 0x8d5a2b, x + d, 0.9, z); l.rotation.z = d * 0.25; }); B(1, 0.8, 0.04, 0xffffff, x, 1.4, z + 0.05); B(0.6, 0.4, 0.02, c, x, 1.45, z + 0.08); B(1, 0.06, 0.12, 0x8d5a2b, x, 0.98, z + 0.08); sol(x, z, 0.5, 0.3); };
  easel(cx + 12, cz - 12.5, 0x74c0fc); easel(cx + 9.5, cz - 12.5, 0xffa8a8);
  B(1.6, 0.12, 0.5, 0x212529, cx + 13.8, 0.85, cz - 3.5); B(1.5, 0.04, 0.35, 0xffffff, cx + 13.8, 0.93, cz - 3.45); [-0.7, 0.7].forEach(d => B(0.06, 0.8, 0.06, 0x343a40, cx + 13.8 + d, 0.4, cz - 3.5)); sol(cx + 13.8, cz - 3.5, 0.8, 0.3);   // đàn phím
  { const gt = new THREE.Group(); gt.position.set(cx + 14.85, 2.2, cz - 2); gt.rotation.y = -Math.PI / 2; g.add(gt); lc(gt, 0.32, 0.32, 0.08, 0xd9480f, 0, -0.3, 0, 14).rotation.x = Math.PI / 2; lc(gt, 0.25, 0.25, 0.08, 0xd9480f, 0, 0.15, 0, 14).rotation.x = Math.PI / 2; B(0.08, 0.8, 0.04, 0x3b2a1a, 0, 0.7, 0.04); }   // ghi-ta treo tường
  plate("ART & MUSIC", 2.4, 0.45, "#e64980", "#ffffff", cx + W / 2 - 0.04, 4.0, cz - 8, -Math.PI / 2);
  // ===== TỦ ĐỒ (lockers) – tường trái gần cửa =====
  const lk = skin(1, 2, 40, x => { x.fillStyle = "#4dabf7"; x.fillRect(0, 0, 1, 2); x.fillStyle = "#339af0"; x.fillRect(0.02, 0.02, 0.96, 0.96); x.fillRect(0.02, 1.02, 0.96, 0.96); x.fillStyle = "#1c7ed6"; for (let j = 0; j < 4; j++) { x.fillRect(0.3, 0.15 + j * 0.06, 0.4, 0.03); x.fillRect(0.3, 1.15 + j * 0.06, 0.4, 0.03); } x.fillStyle = "#dee2e6"; x.fillRect(0.82, 0.55, 0.06, 0.15); x.fillRect(0.82, 1.55, 0.06, 0.15); });
  lk.wrapS = THREE.RepeatWrapping; lk.repeat.set(10, 1);
  B(0.6, 2, 10, 0x1c7ed6, cx - 14.7, 1, cz + 8.5); pic(lk, 10, 2, cx - 14.38, 1, cz + 8.5, Math.PI / 2); sol(cx - 14.7, cz + 8.5, 0.35, 5);
  B(0.4, 0.12, 3, 0x8d5a2b, cx - 13.3, 0.45, cz + 4.6); [-1.3, 1.3].forEach(d => B(0.35, 0.42, 0.06, 0x6f4e37, cx - 13.3, 0.21, cz + 4.6 + d)); sol(cx - 13.3, cz + 4.6, 0.25, 1.5);   // ghế dài thay giày
  B(0.6, 0.5, 0.4, 0xe03131, cx - 13.2, 0.25, cz + 12.8); B(0.4, 0.3, 0.3, 0xfab005, cx - 13.2, 0.65, cz + 12.8); sol(cx - 13.2, cz + 12.8, 0.35, 0.3);   // cặp sách để quên
  plate("LOCKERS", 1.6, 0.4, "#1971c2", "#ffffff", cx - W / 2 + 0.04, 2.6, cz + 8.5, Math.PI / 2);
  // ===== CĂNG TIN (canteen) – phải gần cửa: quầy, kệ, bảng thực đơn, bàn ghế =====
  B(0.9, 1.05, 8, 0xf08c00, cx + 9.6, 0.53, cz + 9); B(1.05, 0.08, 8.1, 0xfff4e6, cx + 9.6, 1.09, cz + 9); sol(cx + 9.6, cz + 9, 0.5, 4.05);
  B(0.5, 2.2, 7, 0xf1f3f5, cx + 14.7, 1.1, cz + 9); [0.7, 1.4].forEach(y => B(0.5, 0.05, 7, 0xadb5bd, cx + 14.45, y, cz + 9)); sol(cx + 14.7, cz + 9, 0.3, 3.5);
  ["#ffd8a8", "#d3f9d8", "#fff3bf", "#ffe3e3"].forEach((c, i) => B(0.3, 0.3, 1.2, parseInt(c.slice(1), 16), cx + 14.4, 0.9 + (i % 2) * 0.7, cz + 6.5 + i * 1.6));
  const menu = skin(3, 1.6, 50, x => { x.fillStyle = "#2b2b2b"; x.fillRect(0, 0, 3, 1.6); x.fillStyle = "#ffd43b"; x.font = "bold 0.25px system-ui"; x.textAlign = "center"; x.fillText("CANTEEN MENU", 1.5, 0.3);
    x.fillStyle = "#ffffff"; x.font = "0.18px system-ui"; x.textAlign = "left"; [["Sticky rice", "10k"], ["Banh bao", "12k"], ["Fresh milk", "8k"], ["Fruit cup", "10k"]].forEach(([a, b], i) => { x.fillText(a, 0.25, 0.65 + i * 0.25); x.fillText(b, 2.3, 0.65 + i * 0.25); }); });
  pic(menu, 3, 1.6, cx + W / 2 - 0.04, 3.2, cz + 9, -Math.PI / 2);
  [[5.5, 6], [5.5, 10.5]].forEach(([dx, dz]) => { const x = cx + dx, z = cz + dz; lc(g, 0.6, 0.6, 0.06, 0xfff4e6, x, 0.75, z, 16); lc(g, 0.06, 0.06, 0.72, 0x868e96, x, 0.36, z, 6); sol(x, z, 0.6, 0.6);
    [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([a, b]) => { lc(g, 0.2, 0.2, 0.45, 0xf08c00, x + a * 0.95, 0.23, z + b * 0.95, 10); sol(x + a * 0.95, z + b * 0.95, 0.2, 0.2); }); });
  plate("CANTEEN", 1.8, 0.45, "#f08c00", "#ffffff", cx + 9.6, 2.3, cz + 13.1, 0); B(0.06, 1.1, 0.06, 0x868e96, cx + 9.6, 1.6, cz + 12.9);
  { const rug = skin(6, 4, 20, x => { ["#ffa8a8", "#ffd43b", "#8ce99a", "#74c0fc", "#b197fc", "#ffa94d"].forEach((c, i) => { x.fillStyle = c; x.fillRect(i, 0, 1, 4); }); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 4), new THREE.MeshLambertMaterial({ map: rug })); m.rotation.x = -Math.PI / 2; m.position.set(cx - 5.5, 0.02, cz + 5); m.userData.flat = true; g.add(m);
    [[-7.5, 4], [-3.5, 4], [-5.5, 6.3]].forEach(([dx, dz], i) => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 8), mat([0xe64980, 0x1c7ed6, 0x40c057][i])); b.scale.y = 0.6; b.position.set(cx + dx, 0.3, cz + dz); g.add(b); sol(cx + dx, cz + dz, 0.45, 0.45); }); }   // thảm đọc sách + ghế lười
  // lối vào: chậu cây, máy nước uống, bảng tin
  [[-4.5, 16.8], [4.5, 16.8]].forEach(([dx, dz]) => { pot(g, cx + dx, cz + dz, 1.4); sol(cx + dx, cz + dz, 0.5, 0.5); });
  B(0.5, 1, 0.5, 0xdee2e6, cx - 8, 0.5, front - 0.4); lc(g, 0.18, 0.18, 0.45, 0x74c0fc, cx - 8, 1.25, front - 0.4, 10); sol(cx - 8, front - 0.4, 0.3, 0.3);
  g.traverse(o => { if (o.isMesh && o.position.y > 3.5) o.userData.flat = true; });
  // ===== CHỖ BÀY ĐỒ TỪ VỰNG: [x, y, z, chỗ đứng x, chỗ đứng z] =====
  const A = (dx, y, dz, sx, sz) => [cx + dx, y, cz + dz, cx + sx, cz + sz];
  P.anchors = {
    board: [-4, -1.5, 4].map(dx => A(dx, 2.6, -17.6, dx, -16.2)).concat([A(2, 1.15, -14.5, 1, -13), A(3.2, 1.15, -14.5, 4.3, -13.6), A(0, 1.5, -17.6, -0.5, -16.2)]),
    classroom: [[-5.5, -10], [-2.5, -7.5], [2.5, -10], [5.5, -7.5], [-5.5, -5], [2.5, -5], [5.5, -2.5]].map(([dx, dz]) => A(dx, 1.05, dz, dx < 0 ? (dx < -4 ? -4 : -4) : (dx < 4 ? 4 : 4), dz)),
    science: [-11.5, -9.5, -7.5, -5, -3].map(dz => A(-14.4, 1.4, dz, -12.8, dz)).concat([A(-13.2, 1.8, -13.5, -12, -12.4)]),
    art: [A(12, 2.1, -12.4, 12, -11), A(9.5, 2.1, -12.4, 9.5, -11), A(14.3, 1.5, -10.5, 13, -10.2), A(14.3, 1.5, -8, 13, -8.6), A(13.8, 1.3, -3.5, 13.8, -2.3), A(14.5, 2.9, -1.5, 13, -1.2)],
    lockers: [5, 7, 9.8, 11.5].map(dz => A(-14.3, 1.6, dz, -12.8, dz)).concat([A(-13.2, 1.1, 12.8, -12, 13.6), A(-13.3, 0.9, 4.6, -12.3, 3.4)]),
    canteen: [6, 8, 10, 12].map(dz => A(9.6, 1.4, dz, 8.2, dz)).concat([A(5.5, 1.1, 6, 7.2, 7.5)])
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["schoolhall"] = { furnish: furnishSchool };
