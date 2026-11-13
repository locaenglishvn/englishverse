/* EnglishVerse – ĐỒ NGHỀ DÙNG CHUNG cho nội thất nhiều khu (đọc docs/KIT.md). Toạ độ x0…z1 tính từ GIỮA PHÒNG.
   Dùng bên trong hàm furnish(P, g, cx, cz, W, D, fur). Mọi hàm đều tự thêm vật cản vào P.room.solids khi cần. */
const KIT = {
  // ảnh lặp (texture) vẽ bằng canvas: draw(ctx, w, h) theo mét
  tex(w, h, draw, ppm) { const t = skin(w, h, ppm || 24, draw); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; },
  rep(t, rx, ry) { const c = t.clone(); c.needsUpdate = true; c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); return c; },
  // 1 đoạn tường phẳng từ (x0,z0) tới (x1,z1), mặt quay vào bên TRÁI hướng đi; tex lặp mỗi tileW mét; color nếu không có tex
  wall(P, g, x0, z0, x1, z1, h, tex, tileW, color) {
    const cx = P.room.cx, cz = P.room.cz, len = Math.hypot(x1 - x0, z1 - z0); if (len < 0.05) return;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(len, h), tex ? new THREE.MeshLambertMaterial({ map: KIT.rep(tex, len / (tileW || 4), 1) }) : mat(color || 0xf1f3f5));
    m.position.set(cx + (x0 + x1) / 2, h / 2, cz + (z0 + z1) / 2); m.rotation.y = Math.atan2(-(z1 - z0), x1 - x0); m.userData.flat = true; g.add(m);
  },
  /* 1 khu hình chữ nhật: 4 tường quay vào trong + vật cản tường + cửa. o = { h, tex, tileW, color, doorH (mặc định 3), lintel (màu phần tường trên cửa),
     gaps: { n: [tâm, rộng], s: […], w: […], e: […] }, solid: true }   n = cạnh z nhỏ (phía trong), s = cạnh z lớn (phía cửa chính), w = x nhỏ, e = x lớn */
  zone(P, g, x0, x1, z0, z1, o) {
    const h = o.h || 4, gaps = o.gaps || {}, dh = o.doorH || 3, S = P.room.solids, cx = P.room.cx, cz = P.room.cz;
    const run = (side, ax, az, bx, bz) => {
      const horiz = az === bz, gp = gaps[side];
      const piece = (a, b) => { if (horiz) KIT.wall(P, g, a, az, b, bz, h, o.tex, o.tileW, o.color); else KIT.wall(P, g, ax, a, bx, b, h, o.tex, o.tileW, o.color);
        if (o.solid !== false) { const lo = Math.min(a, b), hi = Math.max(a, b); if (hi - lo > 0.05) S.push(horiz ? { x: cx + (lo + hi) / 2, z: cz + az, hw: (hi - lo) / 2, hd: 0.15 } : { x: cx + ax, z: cz + (lo + hi) / 2, hw: 0.15, hd: (hi - lo) / 2 }); } };
      const a = horiz ? ax : az, b = horiz ? bx : bz;
      if (!gp) return piece(a, b);
      const dir = Math.sign(b - a), g0 = gp[0] - dir * gp[1] / 2, g1 = gp[0] + dir * gp[1] / 2; piece(a, g0); piece(g1, b);
      if (h > dh) { const nrm = { n: [0, 1], e: [-1, 0], s: [0, -1], w: [1, 0] }[side];   // phần tường phía trên cửa, lùi vào trong khu mình
        lb(g, horiz ? gp[1] : 0.2, h - dh, horiz ? 0.2 : gp[1], o.lintel || o.color || 0xe9ecef, cx + (horiz ? gp[0] : ax) + nrm[0] * 0.12, dh + (h - dh) / 2, cz + (horiz ? az : gp[0]) + nrm[1] * 0.12); }
    };
    run("n", x0, z0, x1, z0); run("e", x1, z0, x1, z1); run("s", x1, z1, x0, z1); run("w", x0, z1, x0, z0);
    (P.zones = P.zones || []).push({ x0: cx + x0, x1: cx + x1, z0: cz + z0, z1: cz + z1 });   // camera ở trong khu đang đứng, tên NPC khu khác bị ẩn
  },
  // sàn / trần phẳng cho 1 khu (tex lặp mỗi tileM mét)
  floor(P, g, x0, x1, z0, z1, tex, tileM, y) { const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), new THREE.MeshLambertMaterial({ map: KIT.rep(tex, (x1 - x0) / (tileM || 2), (z1 - z0) / (tileM || 2)) }));
    m.rotation.x = -Math.PI / 2; m.position.set(P.room.cx + (x0 + x1) / 2, y || 0.006, P.room.cz + (z0 + z1) / 2); m.userData.flat = true; g.add(m); return m; },
  ceiling(P, g, x0, x1, z0, z1, h, tex, tileM, color) { const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), tex ? new THREE.MeshLambertMaterial({ map: KIT.rep(tex, (x1 - x0) / (tileM || 4), (z1 - z0) / (tileM || 4)), side: THREE.DoubleSide }) : mat(color || 0xf8f9fa, { side: THREE.DoubleSide }));
    m.rotation.x = Math.PI / 2; m.position.set(P.room.cx + (x0 + x1) / 2, h, P.room.cz + (z0 + z1) / 2); m.userData.flat = true; g.add(m); return m; },
  // biển chữ treo; ry: 0 = quay ra +z (về phía cửa chính)
  sign(P, g, text, w, x, y, z, ry, bg, fg) { const t = textPlate(text, w, w * 0.14, bg || "#2b2b2b", fg || "#ffffff"); t.position.set(P.room.cx + x, y, P.room.cz + z); t.rotation.y = ry || 0; g.add(t); return t; },
  // khối có vật cản (toạ độ từ giữa phòng): hộp màu đặc
  block(P, g, w, h, d, color, x, z, y) { const m = lb(g, w, h, d, color, P.room.cx + x, (y || 0) + h / 2, P.room.cz + z); P.room.solids.push({ x: P.room.cx + x, z: P.room.cz + z, hw: w / 2, hd: d / 2 }); return m; },
  // chỗ bày từ vựng: a(x, y, z, đứngX, đứngZ) → mảng 5 số (toạ độ từ giữa phòng)
  a(P, x, y, z, sx, sz) { return [P.room.cx + x, y, P.room.cz + z, P.room.cx + sx, P.room.cz + sz]; },
  // nhiều vật giống nhau (ghế, giường, sản phẩm): list = [[x, y, z, ry, sx, sy, sz], …] (toạ độ từ giữa phòng) → 1 lần vẽ
  many(P, g, geo, color, list) { const im = new THREE.InstancedMesh(geo, mat(color), list.length), d = new THREE.Object3D();
    list.forEach((q, i) => { d.position.set(P.room.cx + q[0], q[1], P.room.cz + q[2]); d.rotation.set(0, q[3] || 0, 0); d.scale.set(q[4] || 1, q[5] || 1, q[6] || 1); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
    g.add(im); return im; }
};
