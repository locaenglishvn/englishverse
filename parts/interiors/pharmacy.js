/* EnglishVerse – nội thất "pharmacy" Green Cross Pharmacy (layout: "pharmacyshop"), dùng khung chung shopKit (shopkit.js).
   GREEN CROSS PHARMACY – nhà thuốc sạch sẽ: tường trắng, chân tường xanh lá, chữ thập xanh, tủ thuốc nhiều ngăn sau quầy,
   kệ thuốc tường trái, kệ chăm sóc cá nhân tường phải, góc sức khoẻ trước bên trái (cân, máy đo huyết áp, thước đo chiều cao). Khu: counter, shelf, care, health. */
function furnishPharmacy(P, g, cx, cz, W, D, fur) {
  const K = shopKit(P, g, cx, cz, W, D, { floor: ["#f1f3f5", "#e6fcf5"], wall: ["#ffffff", "#2b8a3e"], trim: "#37b24d", counter: 0xf8f9fa, counterTop: 0x2b8a3e, sign: "ASK THE PHARMACIST", signBg: "#2b8a3e", signFg: "#ffffff" });
  const { back, front, B, sol, plate, pic, A } = K;
  const box = [0xffffff, 0xd3f9d8, 0xd0ebff, 0xfff3bf, 0xffe3e3, 0xe5dbff];
  const boxes = (x, y, z, len, alongZ, seed) => { for (let i = 0; i < Math.floor(len / 0.28); i++) { const t = -len / 2 + 0.14 + i * 0.28, h = 0.16 + ((i + seed) % 3) * 0.05; B(0.2, h, 0.16, box[(i + seed) % 6], alongZ ? x : x + t, y + h / 2, alongZ ? z + t : z); } };
  // QUẦY (counter): hộp thuốc, máy tính tiền; sau lưng: tủ thuốc nhiều ngăn + chữ thập xanh
  B(0.6, 0.3, 0.45, 0x343a40, cx - 1.7, 1.28, cz - 5.3); B(0.4, 0.2, 0.3, 0xffffff, cx + 1.7, 1.23, cz - 5.2); B(0.3, 0.15, 0.2, 0xd0ebff, cx + 1.1, 1.2, cz - 5.1);
  const drawers = skin(9, 2.4, 30, x => { x.fillStyle = "#f8f9fa"; x.fillRect(0, 0, 9, 2.4); for (let i = 0; i < 18; i++) for (let j = 0; j < 6; j++) { x.fillStyle = (i + j) % 4 ? "#e9ecef" : "#d3f9d8"; x.fillRect(0.05 + i * 0.5, 0.05 + j * 0.4, 0.45, 0.35); x.fillStyle = "#868e96"; x.fillRect(0.22 + i * 0.5, 0.2 + j * 0.4, 0.1, 0.04); } });
  B(9, 2.4, 0.5, 0xf8f9fa, cx, 1.2, back + 0.25); pic(drawers, 9, 2.4, cx, 1.2, back + 0.51); sol(cx, back + 0.25, 4.5, 0.3);
  const cross = skin(1.4, 1.4, 50, x => { x.fillStyle = "#2b8a3e"; x.fillRect(0.45, 0.05, 0.5, 1.3); x.fillRect(0.05, 0.45, 1.3, 0.5); });
  pic(cross, 1.4, 1.4, cx, 3.35, back + 0.04);
  // KỆ THUỐC (shelf) – tường trái
  B(0.6, 2.3, 10, 0xf8f9fa, cx - 7.7, 1.15, cz - 1); [0.45, 0.95, 1.45, 1.95].forEach((y, r) => { B(0.6, 0.04, 10, 0xced4da, cx - 7.6, y, cz - 1); boxes(cx - 7.5, y + 0.02, cz - 1, 9.6, true, r); }); sol(cx - 7.7, cz - 1, 0.35, 5);
  plate("MEDICINE · THUỐC", 2.6, 0.4, "#2b8a3e", "#ffffff", cx - W / 2 + 0.03, 2.75, cz - 1, Math.PI / 2);
  // KỆ CHĂM SÓC CÁ NHÂN (care) – tường phải: chai, tuýp, bàn chải
  B(0.6, 2.3, 8, 0xf8f9fa, cx + 7.7, 1.15, cz - 2); sol(cx + 7.7, cz - 2, 0.35, 4);
  [0.45, 0.95, 1.45, 1.95].forEach((y, r) => { B(0.6, 0.04, 8, 0xced4da, cx + 7.6, y, cz - 2); for (let z = -5.7; z <= 1.7; z += 0.3) lc(g, 0.08, 0.09, 0.26 + (r % 2) * 0.08, [0x74c0fc, 0xffa8a8, 0x8ce99a, 0xffd43b, 0xb197fc][(Math.round(z * 3.3) + r + 50) % 5], cx + 7.5, y + 0.17, cz + z, 8); });
  plate("PERSONAL CARE", 2.4, 0.4, "#1c7ed6", "#ffffff", cx + W / 2 - 0.03, 2.75, cz - 2, -Math.PI / 2);
  // GÓC SỨC KHOẺ (health) – trước bên trái: cân, máy đo huyết áp + ghế, thước đo chiều cao, tranh rửa tay, tủ sơ cứu
  B(0.6, 0.12, 0.6, 0xdee2e6, cx - 6.4, 0.06, cz + 7.6); B(0.12, 1.1, 0.12, 0xadb5bd, cx - 6.4, 0.6, cz + 7.85); B(0.35, 0.3, 0.1, 0xffffff, cx - 6.4, 1.25, cz + 7.85); sol(cx - 6.4, cz + 7.6, 0.35, 0.4);
  B(1, 0.08, 0.6, 0x2b8a3e, cx - 4.2, 0.48, cz + 7.7); B(1, 0.6, 0.08, 0x2b8a3e, cx - 4.2, 0.8, cz + 8); B(0.5, 0.75, 0.4, 0xffffff, cx - 3.2, 0.38, cz + 7.8); B(0.45, 0.3, 0.3, 0x495057, cx - 3.2, 0.9, cz + 7.8); B(0.3, 0.2, 0.02, 0x69db7c, cx - 3.2, 0.95, cz + 7.64); sol(cx - 3.8, cz + 7.75, 0.95, 0.4);
  const ruler = skin(0.5, 2, 40, x => { x.fillStyle = "#fff3bf"; x.fillRect(0, 0, 0.5, 2); x.fillStyle = "#e67700"; for (let i = 0; i <= 20; i++) x.fillRect(0, i * 0.1, i % 5 ? 0.12 : 0.25, 0.015); });
  pic(ruler, 0.5, 2, cx - W / 2 + 0.03, 1.1, cz + 6, Math.PI / 2);
  const wash = skin(1.6, 1.2, 50, x => { x.fillStyle = "#e7f5ff"; x.fillRect(0, 0, 1.6, 1.2); x.fillStyle = "#1c7ed6"; x.font = "bold 0.15px system-ui"; x.textAlign = "center"; x.fillText("WASH YOUR HANDS", 0.8, 0.22);
    x.fillStyle = "#ffd8a8"; [0.5, 1.1].forEach(X => { x.beginPath(); x.ellipse(X, 0.7, 0.2, 0.28, 0, 0, 7); x.fill(); }); x.fillStyle = "#74c0fc"; for (let i = 0; i < 6; i++) { x.beginPath(); x.arc(0.4 + i * 0.16, 1.05, 0.04, 0, 7); x.fill(); } });
  pic(wash, 1.6, 1.2, cx + W / 2 - 0.03, 2.1, cz + 6, -Math.PI / 2);
  B(0.8, 0.6, 0.2, 0xffffff, cx + 5, 2, front - 0.12); pic(cross, 0.4, 0.4, cx + 5, 2, front - 0.23, Math.PI);
  pot(g, cx + 6.8, cz + 7.8, 1.3); sol(cx + 6.8, cz + 7.8, 0.45, 0.45);
  g.traverse(o => { if (o.isMesh && o.position.y > 3.4) o.userData.flat = true; });
  P.anchors = {
    counter: [A(-1.7, 1.7, -5.3, -1.7, -4.1), A(1.1, 1.5, -5.1, 1, -4.1), A(1.9, 1.55, -5.2, 2.2, -4.0), A(-3.5, 1.8, -8.6, -3.5, -7.4), A(3.5, 1.8, -8.6, 3.5, -7.4), A(-2, 0.9, -8.6, -2.3, -7.4), A(2, 0.9, -8.6, 2.3, -7.4)],
    shelf: [-5, -3.4, -1.8, -0.2, 1.4, 3, 4].map((dz, i) => A(-7.25, i % 2 ? 1.75 : 1.2, dz, -6.2, dz)),
    care: [-5.2, -3.6, -2, -0.4, 1.2, 1.6].map((dz, i) => A(7.25, i % 2 ? 1.75 : 1.2, dz, 6.2, dz)),
    health: [A(-6.4, 1.6, 7.6, -6.4, 6.4), A(-4.2, 1.4, 7.6, -4.4, 6.5), A(-3.2, 1.4, 7.75, -3, 6.5), A(-7.75, 1.8, 6, -6.4, 6.4), A(7.75, 2.3, 6, 6.4, 6), A(5, 2.5, 8.6, 5, 7.4)]
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["pharmacyshop"] = { furnish: furnishPharmacy };
