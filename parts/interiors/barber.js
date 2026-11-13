/* EnglishVerse – nội thất "salon" Saigon Barber (layout: "barbershop"), dùng khung chung shopKit (shopkit.js).
   SAIGON BARBER – tiệm cắt tóc cổ điển Sài Gòn: sàn ô cờ đen trắng, tường tím nhạt, 3 ghế cắt tóc da đỏ + gương lớn dọc tường trái,
   2 bồn gội đầu + ghế ngả phía sau bên phải, kệ sản phẩm tường phải, ghế chờ + giá báo + TV + cột đèn sọc gần cửa. Khu: chair, wash, products, waiting. */
function furnishBarber(P, g, cx, cz, W, D, fur) {
  const K = shopKit(P, g, cx, cz, W, D, { floor: ["#f1f3f5", "#5c5f66"], wall: ["#f3f0ff", "#7048e8"], trim: "#c92a2a", counter: 0x7048e8, counterTop: 0xf8f9fa, sign: "WALK-INS WELCOME", signBg: "#c92a2a", signFg: "#ffffff" });
  const { back, front, B, sol, plate, pic, A } = K;
  // GHẾ CẮT TÓC + GƯƠNG (chair) – tường trái
  [-5, -2, 1].forEach(dz => { const x = cx - 6.6, z = cz + dz;
    B(1.6, 1.9, 0.06, 0xced4da, cx - W / 2 + 0.05, 1.75, z).rotation.y = Math.PI / 2; B(0.04, 1.7, 1.4, 0xe7f5ff, cx - W / 2 + 0.1, 1.75, z);
    B(0.4, 0.06, 1.6, 0xf8f9fa, cx - 7.6, 0.95, z);   // bàn để đồ dưới gương
    lc(g, 0.3, 0.35, 0.08, 0xadb5bd, x, 0.04, z, 14); lc(g, 0.08, 0.08, 0.45, 0xadb5bd, x, 0.27, z, 8);
    B(0.65, 0.15, 0.65, 0xc92a2a, x, 0.55, z); B(0.12, 0.75, 0.6, 0xc92a2a, x - 0.3, 0.95, z); B(0.6, 0.06, 0.12, 0x343a40, x, 0.72, z - 0.35); B(0.6, 0.06, 0.12, 0x343a40, x, 0.72, z + 0.35);
    B(0.1, 0.2, 0.25, 0xc92a2a, x - 0.32, 1.42, z); B(0.3, 0.05, 0.3, 0x343a40, x + 0.35, 0.2, z);
    sol(x - 0.4, z, 0.75, 0.42); });
  B(0.12, 0.2, 0.1, 0x343a40, cx - 7.6, 1.08, cz - 3.5); B(0.25, 0.05, 0.05, 0xadb5bd, cx - 7.6, 1.0, cz - 0.5);   // máy sấy, kéo
  // BỒN GỘI ĐẦU (wash) – sau bên phải
  [3.6, 5.8].forEach(dx => { const x = cx + dx; B(1, 0.85, 0.6, 0xf8f9fa, x, 0.43, back + 0.3); lc(g, 0.32, 0.25, 0.25, 0xffffff, x, 0.95, back + 0.35, 14); lc(g, 0.03, 0.03, 0.4, 0xadb5bd, x, 1.25, back + 0.15, 6);
    B(0.7, 0.4, 1.4, 0x343a40, x, 0.3, back + 1.3); B(0.7, 0.12, 0.8, 0x7048e8, x, 0.55, back + 1.6); const bk = B(0.7, 0.1, 0.7, 0x7048e8, x, 0.75, back + 0.95); bk.rotation.x = -0.6; sol(x, back + 0.9, 0.5, 0.9); });
  B(0.5, 1.2, 1.2, 0xf8f9fa, cx + 7.7, 0.6, back + 0.8); [0.2, 0.5, 0.8].forEach((y, i) => B(0.4, 0.18, 1, [0xffffff, 0xd0bfff, 0xffffff][i], cx + 7.65, 1.25 + y * 0.6, back + 0.8)); sol(cx + 7.7, back + 0.8, 0.3, 0.6);   // khăn
  // KỆ SẢN PHẨM (products) – tường phải
  B(0.5, 2.1, 6, 0xf3f0ff, cx + 7.75, 1.05, cz - 1.5); sol(cx + 7.75, cz - 1.5, 0.3, 3);
  [0.6, 1.1, 1.6].forEach((y, r) => { B(0.5, 0.04, 6, 0x7048e8, cx + 7.65, y, cz - 1.5); for (let z = -4.2; z <= 1.2; z += 0.36) lc(g, 0.07, 0.08, 0.25 + ((Math.round(z * 3) + r) % 2) * 0.1, [0xb197fc, 0x74c0fc, 0xffa8a8, 0x8ce99a, 0xffd43b][(Math.round(z * 3) + r + 40) % 5], cx + 7.55, y + 0.16, cz + z, 8); });
  plate("HAIR CARE", 1.8, 0.4, "#7048e8", "#ffffff", cx + W / 2 - 0.03, 2.5, cz - 1.5, -Math.PI / 2);
  // GHẾ CHỜ + báo + TV + nước + cột đèn sọc (waiting)
  B(3, 0.45, 0.7, 0x343a40, cx - 5.5, 0.23, front - 1.1); B(3, 0.12, 0.7, 0xc92a2a, cx - 5.5, 0.5, front - 1.1); B(3, 0.6, 0.12, 0xc92a2a, cx - 5.5, 0.85, front - 0.8); sol(cx - 5.5, front - 1.1, 1.5, 0.4);
  B(0.4, 0.8, 0.8, 0x8d5a2b, cx - 7.6, 0.4, cz + 5.5); [0, 1].forEach(i => B(0.05, 0.4, 0.3, [0xffd43b, 0x74c0fc][i], cx - 7.5 + i * 0.1, 0.95, cz + 5.4 + i * 0.25)); sol(cx - 7.6, cz + 5.5, 0.3, 0.45);
  B(0.06, 1, 1.7, 0x111111, cx + W / 2 - 0.05, 2.4, cz + 5); B(0.02, 0.85, 1.55, 0x4dabf7, cx + W / 2 - 0.09, 2.4, cz + 5);
  B(0.45, 1, 0.45, 0xdee2e6, cx + 4.5, 0.5, front - 0.4); lc(g, 0.17, 0.17, 0.45, 0x74c0fc, cx + 4.5, 1.23, front - 0.4, 10); sol(cx + 4.5, front - 0.4, 0.3, 0.3);
  const stripe = skin(1, 2, 40, x => { x.fillStyle = "#ffffff"; x.fillRect(0, 0, 1, 2); x.lineWidth = 0.14; [["#c92a2a", 0], ["#1c7ed6", 0.25]].forEach(([c, o]) => { x.strokeStyle = c; for (let y = -1 + o; y < 3; y += 0.5) { x.beginPath(); x.moveTo(0, y); x.lineTo(1, y + 0.5); x.stroke(); } }); });
  { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 1.4, 14), new THREE.MeshLambertMaterial({ map: stripe })); p.position.set(cx + 6.8, 1.3, front - 1.2); g.add(p); lc(g, 0.21, 0.21, 0.15, 0xadb5bd, cx + 6.8, 2.07, front - 1.2, 12); lc(g, 0.21, 0.25, 0.6, 0xadb5bd, cx + 6.8, 0.3, front - 1.2, 12); sol(cx + 6.8, front - 1.2, 0.3, 0.3); }
  // quầy: máy tính tiền + sổ hẹn; tường sau: bảng giá
  B(0.6, 0.3, 0.45, 0x343a40, cx - 1.6, 1.28, cz - 5.3); B(0.5, 0.04, 0.35, 0xfff3bf, cx + 1.5, 1.15, cz - 5.2);
  const price = skin(3, 1.6, 50, x => { x.fillStyle = "#212529"; x.fillRect(0, 0, 3, 1.6); x.fillStyle = "#ffd43b"; x.font = "bold 0.24px system-ui"; x.textAlign = "center"; x.fillText("PRICE LIST", 1.5, 0.3);
    x.fillStyle = "#ffffff"; x.font = "0.17px system-ui"; x.textAlign = "left"; [["Haircut", "50k"], ["Kids haircut", "30k"], ["Hair wash", "20k"], ["Shave", "30k"]].forEach(([a, b], i) => { x.fillText(a, 0.3, 0.65 + i * 0.25); x.fillText(b, 2.3, 0.65 + i * 0.25); }); });
  pic(price, 3, 1.6, cx - 1, 2.6, back + 0.04);
  g.traverse(o => { if (o.isMesh && o.position.y > 3.4) o.userData.flat = true; });
  P.anchors = {
    chair: [A(-7.85, 2.1, -5, -5.4, -5.4), A(-6.6, 1.3, -5, -5.2, -4.4), A(-7.85, 2.1, -2, -3.8, -2.6), A(-7.85, 2.1, 1, -5.2, 1.6), A(-6.6, 1.3, 1, -5.2, 0.4), A(-7.6, 1.4, -3.5, -5.6, -3.5), A(-7.6, 1.25, -0.5, -5.6, -0.6)],
    wash: [A(3.6, 1.3, -8.6, 3.6, -6.9), A(5.8, 1.3, -8.6, 5.8, -6.9), A(4.7, 1.2, -7.6, 4.7, -6.9), A(7.6, 2.1, -8.2, 6.9, -6.9), A(6.8, 1.1, -7.2, 6.8, -6.5)],
    products: [-4, -3, -1.8, -0.6, 0.6, 1.2].map((dz, i) => A(7.4, i % 2 ? 1.95 : 1.45, dz, 6.3, dz)),
    waiting: [A(-6.5, 1.1, 7.9, -6.5, 6.7), A(-4.5, 1.1, 7.9, -4.5, 6.7), A(-7.5, 1.4, 5.5, -6.4, 5.5), A(7.85, 2.4, 5, 6.4, 5), A(4.5, 1.8, 8.6, 4.5, 7.3), A(6.8, 2.4, 7.8, 6.2, 6.6)]
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["barbershop"] = { furnish: furnishBarber };
