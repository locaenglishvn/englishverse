/* EnglishVerse – nội thất "furniture" Home & Cozy (layout: "furnishop"), dùng khung chung shopKit (shopkit.js) + đồ KayKit (fur).
   HOME & COZY – showroom nội thất ấm áp: sàn gỗ, tường kem chân nâu; 4 góc bày như phòng thật – phòng khách (trước trái: sofa, ghế bành, bàn trà, thảm, đèn),
   phòng ngủ (sau trái: giường, tủ đầu giường, tủ áo), bếp + bàn ăn (sau phải: bàn, ghế, tủ bếp, tủ lạnh), đồ trang trí (trước phải: kệ sách, tranh, xương rồng, đèn).
   Đồ trưng bày là đúng các món người bán Omar đang bán (sofa, armchair, lamp, cactus, bookshelf, table, cabinet, rug). Khu: living, bedroom, kitchen, decor. */
function furnishFurniture(P, g, cx, cz, W, D, fur) {
  const K = shopKit(P, g, cx, cz, W, D, { floor: ["#d9b38c", "#cfa67c"], wall: ["#fff8f0", "#8d5a2b"], trim: "#a0522d", counter: 0x8d5a2b, counterTop: 0xfff8f0, sign: "MAKE YOUR HOME COZY", signBg: "#a0522d", signFg: "#ffffff" });
  const { back, front, B, sol, plate, pic, A } = K;
  const tag = (t, x, y, z, ry) => plate(t, 0.7, 0.25, "#fff3bf", "#8d5a2b", x, y, z, ry);
  const rug = (c1, c2, w, d, x, z) => { const t = skin(w, d, 20, (c) => { c.fillStyle = c1; c.fillRect(0, 0, w, d); c.strokeStyle = c2; c.lineWidth = 0.12; c.strokeRect(0.15, 0.15, w - 0.3, d - 0.3); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshLambertMaterial({ map: t })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.015, z); m.userData.flat = true; g.add(m); };
  // PHÒNG KHÁCH (living) – trước trái
  rug("#e9c46a", "#a0522d", 4.6, 3.6, cx - 5.3, cz + 6.6);
  fur("couch_pillows", cx - 5, front - 1.1, Math.PI, 1, 1.5, 0.75); fur("armchair_pillows", cx - 7.2, cz + 5.6, Math.PI / 2, 1, 0.8, 0.8);
  fur("table_small", cx - 3.1, cz + 6.2, 0, 1, 0.5, 0.45); fur("lamp_standing", cx - 7.4, front - 0.8, 0, 1, 0.35, 0.35);
  tag("SOFA 60🪙", cx - 5, 0.75, front - 1.9, 0);
  // PHÒNG NGỦ (bedroom) – sau trái
  rug("#d0ebff", "#4dabf7", 3, 2.4, cx - 6, cz - 5.6);
  fur("bed_single_A", cx - 6.2, back + 1.5, 0, 1, 0.65, 1.2); fur("cabinet_small_decorated", cx - 7.45, back + 0.5, 0, 1, 0.4, 0.4);
  B(1.4, 2.3, 0.7, 0xb07a4a, cx - 4.1, 1.15, back + 0.4); B(0.03, 2.1, 0.02, 0x6f4e37, cx - 4.1, 1.15, back + 0.76); [-0.15, 0.15].forEach(d => B(0.05, 0.2, 0.05, 0xc9a227, cx - 4.1 + d, 1.2, back + 0.78)); sol(cx - 4.1, back + 0.4, 0.72, 0.4);   // tủ áo
  pic(skin(1.2, 0.9, 40, x => { x.fillStyle = "#a5d8ff"; x.fillRect(0, 0, 1.2, 0.9); x.fillStyle = "#ffffff"; x.fillRect(0.58, 0, 0.04, 0.9); x.fillRect(0, 0.43, 1.2, 0.04); x.strokeStyle = "#8d5a2b"; x.lineWidth = 0.08; x.strokeRect(0.04, 0.04, 1.12, 0.82); }), 1.2, 0.9, cx - W / 2 + 0.03, 2.2, cz - 6.6, Math.PI / 2);   // cửa sổ giả
  // BẾP + BÀN ĂN (kitchen) – sau phải
  B(2.6, 0.9, 0.6, 0xf8f0e3, cx + 4.6, 0.45, back + 0.3); B(2.7, 0.06, 0.65, 0x868e96, cx + 4.6, 0.93, back + 0.3); B(2.6, 0.8, 0.35, 0xf8f0e3, cx + 4.6, 2.2, back + 0.18); lc(g, 0.2, 0.2, 0.12, 0x495057, cx + 4, 1.02, back + 0.3, 12); sol(cx + 4.6, back + 0.3, 1.35, 0.35);
  B(0.8, 2, 0.7, 0xe9ecef, cx + 7.4, 1, back + 0.4); B(0.03, 0.9, 0.04, 0xadb5bd, cx + 7.1, 1.3, back + 0.76); sol(cx + 7.4, back + 0.4, 0.42, 0.4);   // tủ lạnh
  fur("table_medium", cx + 5.3, cz - 5.6, 0, 1, 0.9, 0.55); fur("chair_A_wood", cx + 4.6, cz - 4.6, Math.PI, 1, 0.3, 0.3); fur("chair_A_wood", cx + 6, cz - 4.6, Math.PI, 1, 0.3, 0.3);
  lc(g, 0.15, 0.1, 0.15, 0xffffff, cx + 5, 0.86, cz - 5.6, 10); lc(g, 0.06, 0.08, 0.3, 0x74c0fc, cx + 5.7, 0.93, cz - 5.6, 8);
  tag("TABLE 40🪙", cx + 5.3, 0.95, cz - 4.95, 0);
  // ĐỒ TRANG TRÍ (decor) – trước phải
  fur("shelf_B_large_decorated", cx + 7.45, cz + 4.6, -Math.PI / 2, 1, 1.1, 0.4); fur("cactus_medium_A", cx + 6.2, front - 0.8, 0, 1, 0.4, 0.4);
  fur("lamp_standing", cx + 3.6, front - 0.6, 0, 1, 0.35, 0.35); fur("cabinet_medium_decorated", cx + 7.4, cz + 1.2, -Math.PI / 2, 1, 0.6, 0.4);
  fur("pictureframe_large_A", cx + W / 2 - 0.03, cz + 7.2, -Math.PI / 2, 1, 0, 0, 1.6); fur("pictureframe_large_B", cx - W / 2 + 0.03, cz + 1.5, Math.PI / 2, 1, 0, 0, 1.6);
  tag("BOOKSHELF 70🪙", cx + 6.6, 2.4, cz + 4.6, -Math.PI / 2);
  // quầy: máy tính tiền, catalogue; tường sau: bảng "FREE DELIVERY"
  B(0.6, 0.3, 0.45, 0x343a40, cx - 1.6, 1.28, cz - 5.3); B(0.6, 0.05, 0.45, 0xffa94d, cx + 1.4, 1.16, cz - 5.2);
  plate("FREE DELIVERY 🚚", 2.8, 0.5, "#2b8a3e", "#ffffff", cx, 2.6, back + 0.04, 0);
  g.traverse(o => { if (o.isMesh && o.position.y > 3.4) o.userData.flat = true; });
  P.anchors = {
    living: [A(-5.8, 1.5, 7.9, -5.8, 6.9), A(-4.2, 1.5, 7.9, -3.4, 7.2), A(-3.1, 0.95, 6.2, -2.2, 5.4), A(-7.2, 1.5, 5.6, -6.2, 4.6), A(-7.4, 2.2, 8.2, -6.6, 6.9), A(-5, 0.3, 5.3, -5.6, 5.2), A(-5, 1.05, 7.2, -5, 5.9)],
    bedroom: [A(-6.2, 0.9, -7.5, -5.2, -6.4), A(-6.2, 0.9, -6.6, -5.2, -5.6), A(-7.45, 1.2, -8.5, -7, -6.5), A(-4.1, 2.6, -8.6, -4.1, -7.4), A(-7.95, 2.2, -6.6, -6.8, -5.3), A(-6, 0.3, -5, -6, -4.6)],
    kitchen: [A(4, 1.35, -8.7, 3.6, -7.6), A(5.2, 1.35, -8.7, 5.6, -7.6), A(7.4, 2.3, -8.6, 7.2, -7.6), A(5, 1.2, -5.6, 4, -6.8), A(5.7, 1.3, -5.6, 6.6, -6.8), A(4.6, 1.2, -4.6, 3.6, -4)],
    decor: [A(7.4, 2.4, 4.2, 6.2, 4.2), A(7.4, 1.4, 5, 6.2, 5.2), A(6.2, 1.4, 8.2, 5.4, 7.2), A(7.9, 2.2, 7.2, 6.4, 6.8), A(7.4, 1.4, 1.2, 6.2, 1.2)]
  };
  P.vgroup = new THREE.Group(); g.add(P.vgroup);
}
INTERIORS["furnishop"] = { furnish: furnishFurniture };
