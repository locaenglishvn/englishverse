/* EnglishVerse – lối vào Banh Mi Bakery: tiệm là căn nhà ống vàng "BÁNH MÌ · BREAD" sát Cafe Sua Da
   (mặt tiền đã vẽ sẵn trong ngoại thất cafe). File này chỉ thêm ổ bánh mì khổng lồ trên mái hiên, xe bánh mì kính, cửa vào. */
EXTERIORS_EXTRA.bakeryDoor = function (g) {
  const F = 4.52;   // mặt tiền nhà ống (tính từ giữa căn)
  const bread = new THREE.Group(); bread.position.set(0, 4.45, F + 0.6); bread.rotation.z = 0.06; g.add(bread);
  lc(bread, 0.42, 0.42, 3.2, 0xd9902f, 0, 0, 0, 14).rotation.z = Math.PI / 2;
  [-1.6, 1.6].forEach(x => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 10), mat(0xd9902f)); e.position.x = x; e.scale.x = 0.7; bread.add(e); });
  [-1, -0.3, 0.4, 1.1].forEach(x => { const c = lb(bread, 0.08, 0.05, 0.5, 0xf0c27a, x, 0.4, 0); c.rotation.y = 0.5; });
  lb(bread, 2.6, 0.12, 0.2, 0x5fae4a, 0, 0.05, 0.38);   // rau thơm
  lb(g, 1.6, 0.9, 0.7, 0xc0392b, 1.6, 0.75, F + 1.1); lb(g, 1.5, 0.6, 0.6, mat(0xd0ebff, { transparent: true, opacity: 0.45 }), 1.6, 1.5, F + 1.1);   // xe bánh mì kính
  [-0.5, 0.5].forEach(dx => lc(g, 0.15, 0.15, 0.08, 0x343a40, 1.6 + dx, 0.15, F + 1.45, 10).rotation.x = Math.PI / 2);
  const t = textPlate("OPEN · MỞ CỬA", 1.4, 0.3, "#c0392b", "#ffffff"); t.position.set(-1.6, 2.3, F + 0.03); g.add(t);
  return { solids: [[1.6, F + 1.1, 0.8, 0.35]], door: [-0.8, F + 1.8], map: [[0, 0, 6, 9]] };
};
