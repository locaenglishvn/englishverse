/* EnglishVerse – nội thất "pharmacy" Green Cross Pharmacy (layout: "pharmacyshop"), phòng 20 × 48 m, trần 8 m. Dùng khung chung shopKit (không quầy giữa).
   GREEN CROSS PHARMACY – nhà thuốc lớn: QUẦY THUỐC VÒNG TRÒN ở giữa (tâm dz -4, bán kính 2,8 m), dược sĩ đứng TRONG vòng bán thuốc ra
   (người bán Sam quay về phía sau tiệm, Penny quay ra cửa), trụ kệ thuốc tròn giữa vòng + vòng biển xanh treo trên; kệ thuốc tường trái, kệ chăm sóc cá nhân tường phải,
   góc mẹ & bé (phải, gần cửa), góc sức khoẻ (trái, gần cửa: cân, máy đo huyết áp, thước đo chiều cao, bảng đo mắt, tủ sơ cứu).
   Khu: counter, shelf, care, health, baby. Chừa trống: lối vào x -1.5..1.5, z 15..24; NPC (0,-2.4) trong vòng, (-6,6) (6,-12) (6,6). */
function furnishPharmacy(P, g, cx, cz, W, D, fur) {
  const K = shopKit(P, g, cx, cz, W, D, { floor: ["#cfd8d3", "#c3cec8"], wall: ["#eef3ef", "#2b8a3e"], trim: "#37b24d", noCounter: true });
  const { back, front, B, sol, plate, pic, A } = K;
  const BOX = [0xffffff, 0xd3f9d8, 0xd0ebff, 0xfff3bf, 0xffe3e3, 0xe5dbff];
  const boxes = (x, y, z, len, alongZ, seed) => { for (let i = 0; i < Math.floor(len / 0.28); i++) { const t = -len / 2 + 0.14 + i * 0.28, h = 0.16 + ((i + seed) % 3) * 0.05; B(0.2, h, 0.16, BOX[(i + seed) % 6], alongZ ? x : x + t, y + h / 2, alongZ ? z + t : z); } };
  const cross = skin(1.4, 1.4, 50, x => { x.fillStyle = "#2b8a3e"; x.fillRect(0.45, 0.05, 0.5, 1.3); x.fillRect(0.05, 0.45, 1.3, 0.5); });
  // QUẦY VÒNG TRÒN (counter): 18 đoạn quầy quanh tâm, mặt đá trắng, chân xanh; trụ kệ thuốc giữa; vòng biển treo
  const RX = cx, RZ = cz - 4, R = 2.8, N = 18;
  for (let i = 0; i < N; i++) { const a = i * 2 * Math.PI / N, x = RX + Math.cos(a) * R, z = RZ + Math.sin(a) * R;
    const seg = new THREE.Group(); seg.position.set(x, 0, z); seg.rotation.y = -a + Math.PI / 2; g.add(seg);
    lb(seg, 1.02, 1.0, 0.75, 0xf8f9fa, 0, 0.5, 0); lb(seg, 1.06, 0.1, 0.9, 0xdee2e6, 0, 1.05, 0); lb(seg, 1.02, 0.12, 0.02, 0x2b8a3e, 0, 0.82, 0.38);
    sol(x, z, 0.5, 0.5); }
  lc(g, 0.95, 0.95, 2.4, 0xf8f9fa, RX, 1.2, RZ, 20);
  for (let k = 0; k < 4; k++) { const y = 0.4 + k * 0.5; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; B(0.18, 0.2, 0.14, BOX[(i + k) % 6], RX + Math.cos(a) * 0.98, y, RZ + Math.sin(a) * 0.98).rotation.y = -a; } }
  { const band = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.2, R + 0.2, 0.7, 36, 1, true), mat(0x2b8a3e, { side: THREE.DoubleSide })); band.position.set(RX, 3.8, RZ); g.add(band); }
  [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].forEach(a => { const p = textPlate("PHARMACY · ASK HERE", 2.6, 0.45, "#2b8a3e", "#ffffff"); p.position.set(RX + Math.cos(a) * (R + 0.24), 3.8, RZ + Math.sin(a) * (R + 0.24)); p.rotation.y = -a + Math.PI / 2; g.add(p); });
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; lc(g, 0.02, 0.02, 3.8, 0x868e96, RX + Math.cos(a) * (R + 0.2), 6.0, RZ + Math.sin(a) * (R + 0.2), 4); }
  [[1.2, 0.9], [-1.2, 0.9], [0.9, -1.2]].forEach(([a, b], i) => { B(0.45, 0.3, 0.3, [0x343a40, 0xffffff, 0xd0ebff][i], RX + a * 2.3, 1.25, RZ + b * 2.3); });
  P.keeperAt = { x: RX, z: RZ - 1.6, ry: Math.PI };
  // KỆ THUỐC (shelf) – tường trái, cao 2,4 m
  B(0.6, 2.5, 30, 0xf8f9fa, cx - 9.7, 1.25, cz - 5); [0.45, 0.95, 1.45, 1.95].forEach((y, r) => { B(0.6, 0.04, 30, 0xced4da, cx - 9.6, y, cz - 5); boxes(cx - 9.5, y + 0.02, cz - 5, 29.6, true, r); }); sol(cx - 9.7, cz - 5, 0.35, 15);
  plate("MEDICINE · VITAMINS", 3.6, 0.5, "#2b8a3e", "#ffffff", cx - W / 2 + 0.03, 3.1, cz - 5, Math.PI / 2);
  // KỆ CHĂM SÓC CÁ NHÂN (care) – tường phải
  B(0.6, 2.4, 22, 0xf8f9fa, cx + 9.7, 1.2, cz - 9); sol(cx + 9.7, cz - 9, 0.35, 11);
  [0.45, 0.95, 1.45, 1.95].forEach((y, r) => { B(0.6, 0.04, 22, 0xced4da, cx + 9.6, y, cz - 9); for (let z = -19.7; z <= 1.7; z += 0.32) lc(g, 0.08, 0.09, 0.26 + (r % 2) * 0.08, [0x74c0fc, 0xffa8a8, 0x8ce99a, 0xffd43b, 0xb197fc][(Math.round(z * 3.1) + r + 70) % 5], cx + 9.5, y + 0.17, cz + z, 8); });
  plate("PERSONAL CARE", 3, 0.5, "#1c7ed6", "#ffffff", cx + W / 2 - 0.03, 3.1, cz - 9, -Math.PI / 2);
  // GÓC MẸ & BÉ (baby) – phải, gần cửa: kệ tã, xe đẩy, nôi mẫu
  B(0.6, 2, 6, 0xfff0f6, cx + 9.7, 1, cz + 12); [0.5, 1.1, 1.6].forEach((y, r) => { B(0.6, 0.04, 6, 0xfcc2d7, cx + 9.6, y, cz + 12); for (let i = 0; i < 10; i++) B(0.35, 0.3, 0.5, [0xd0ebff, 0xfff0f6, 0xfff3bf][(i + r) % 3], cx + 9.5, y + 0.17, cz + 9.3 + i * 0.6); }); sol(cx + 9.7, cz + 12, 0.35, 3);
  B(0.7, 0.5, 1.1, 0x74c0fc, cx + 6.5, 0.75, cz + 13); [-0.4, 0.4].forEach(d => lc(g, 0.15, 0.15, 0.05, 0x343a40, cx + 6.5 + d * 0.8, 0.15, cz + 13 + d, 10)); B(0.05, 0.7, 0.05, 0x343a40, cx + 6.5, 1.1, cz + 13.6); sol(cx + 6.5, cz + 13, 0.45, 0.65);   // xe đẩy
  B(1.4, 0.8, 0.8, 0xfff0f6, cx + 6.5, 0.6, cz + 16.5); for (let i = 0; i < 6; i++) B(0.04, 0.5, 0.04, 0xffffff, cx + 5.9 + i * 0.24, 1.15, cz + 16.1); sol(cx + 6.5, cz + 16.5, 0.75, 0.45);   // nôi mẫu
  plate("MOTHER & BABY", 2.4, 0.45, "#e64980", "#ffffff", cx + W / 2 - 0.03, 2.8, cz + 12, -Math.PI / 2);
  // GÓC SỨC KHOẺ (health) – trái, gần cửa
  B(0.6, 0.12, 0.6, 0xdee2e6, cx - 8.4, 0.06, cz + 12); B(0.12, 1.1, 0.12, 0xadb5bd, cx - 8.4, 0.6, cz + 12.25); B(0.35, 0.3, 0.1, 0xffffff, cx - 8.4, 1.25, cz + 12.25); sol(cx - 8.4, cz + 12, 0.35, 0.4);
  B(1, 0.08, 0.6, 0x2b8a3e, cx - 6.2, 0.48, cz + 15); B(1, 0.6, 0.08, 0x2b8a3e, cx - 6.2, 0.8, cz + 15.3); B(0.5, 0.75, 0.4, 0xffffff, cx - 5.2, 0.38, cz + 15.1); B(0.45, 0.3, 0.3, 0x495057, cx - 5.2, 0.9, cz + 15.1); B(0.3, 0.2, 0.02, 0x69db7c, cx - 5.2, 0.95, cz + 14.94); sol(cx - 5.8, cz + 15.05, 0.95, 0.4);
  const ruler = skin(0.5, 2, 40, x => { x.fillStyle = "#fff3bf"; x.fillRect(0, 0, 0.5, 2); x.fillStyle = "#e67700"; for (let i = 0; i <= 20; i++) x.fillRect(0, i * 0.1, i % 5 ? 0.12 : 0.25, 0.015); });
  pic(ruler, 0.5, 2, cx - W / 2 + 0.03, 1.1, cz + 14, Math.PI / 2);
  const eye = skin(0.9, 1.3, 60, x => { x.fillStyle = "#ffffff"; x.fillRect(0, 0, 0.9, 1.3); x.fillStyle = "#111"; x.textAlign = "center"; ["E", "F P", "T O Z", "L P E D", "P E C F D"].forEach((t, i) => { x.font = "bold " + (0.22 - i * 0.035) + "px sans-serif"; x.fillText(t, 0.45, 0.25 + i * 0.22); }); });
  pic(eye, 0.9, 1.3, cx - W / 2 + 0.03, 1.9, cz + 17.5, Math.PI / 2);
  B(0.8, 0.6, 0.2, 0xffffff, cx - 6, 2, front - 0.12); pic(cross, 0.4, 0.4, cx - 6, 2, front - 0.23, Math.PI);
  plate("HEALTH CHECK", 2.2, 0.45, "#2b8a3e", "#ffffff", cx - W / 2 + 0.03, 2.9, cz + 15, Math.PI / 2);
  // tường sau: chữ thập xanh lớn + tủ thuốc kéo
  const drawers = skin(9, 2.4, 30, x => { x.fillStyle = "#f8f9fa"; x.fillRect(0, 0, 9, 2.4); for (let i = 0; i < 18; i++) for (let j = 0; j < 6; j++) { x.fillStyle = (i + j) % 4 ? "#e9ecef" : "#d3f9d8"; x.fillRect(0.05 + i * 0.5, 0.05 + j * 0.4, 0.45, 0.35); x.fillStyle = "#868e96"; x.fillRect(0.22 + i * 0.5, 0.2 + j * 0.4, 0.1, 0.04); } });
  B(9, 2.4, 0.5, 0xf8f9fa, cx, 1.2, back + 0.25); pic(drawers, 9, 2.4, cx, 1.2, back + 0.51); sol(cx, back + 0.25, 4.5, 0.3); pic(cross, 2, 2, cx, 4.2, back + 0.04);
  [[-3, 22.6], [3, 22.6]].forEach(([dx, dz]) => { pot(g, cx + dx, cz + dz, 1.2); sol(cx + dx, cz + dz, 0.45, 0.45); });
  g.traverse(o => { if (o.isMesh && o.position.y > 4.5) o.userData.flat = true; });
  const ring = []; for (let k = 0; k < 9; k++) { const a = 0.35 + k * 2 * Math.PI / 9, c = Math.cos(a), s = Math.sin(a); ring.push(A(c * R, 1.4, -4 + s * R, c * 4.2, -4 + s * 4.2)); }
  P.anchors = {
    counter: ring,
    shelf: [-18, -15, -12, -9, -6, -3, 0, 3, 6.5].map((dz, i) => A(-9.3, i % 2 ? 1.75 : 1.25, dz, -8.2, dz)),
    care: [-19, -16.5, -14, -9, -6.5, -4, -1.5, 1, -11.5].map((dz, i) => A(9.3, i % 2 ? 1.75 : 1.25, dz, 8.2, dz)),
    health: [A(-8.4, 1.6, 12, -7.2, 11.2), A(-6.2, 1.3, 15, -6.2, 13.9), A(-5.2, 1.4, 15.1, -4.2, 14), A(-9.75, 1.9, 14, -8.4, 14), A(-9.75, 2.5, 17.5, -8.4, 17.5), A(-6, 2.5, 23.7, -6, 22)],
    baby: [A(9.3, 1.4, 10, 8.2, 10), A(9.3, 1.9, 12, 8.2, 12), A(9.3, 1.4, 14, 8.2, 14), A(6.5, 1.4, 13, 5.2, 13), A(6.5, 1.3, 16.5, 6.5, 15.3), A(9.75, 2.8, 12, 8.2, 11)]
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["pharmacyshop"] = { furnish: furnishPharmacy };
