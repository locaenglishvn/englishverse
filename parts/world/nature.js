/* EnglishVerse – CÂY CỎ MÔ HÌNH THẬT cho vùng hoang dã (bộ Quaternius "Stylized Nature MegaKit", CC0 – assets/nature/, nguồn: assets/CREDITS.md).
   Đang dùng cho: thảm cỏ, hoa, bụi cây, dương xỉ, nấm ở Blossom Valley vòng 1 (wilds.js: carpet / flowers). Cây to vẫn là cây "bông" của wilds.js:
   cây của bộ này thân cao tán nhỏ, nhìn từ camera cao bị gầy (đã thử 18/11). NATURE.tree vẫn có sẵn nếu sau này có cây hợp góc nhìn.
   Cách làm cho nhẹ máy:
   - wilds.js chỉ ghi chỗ đặt (NATURE.tree / NATURE.ground) lúc dựng thế giới; file này nạp mô hình (~3 MB) rồi GỘP theo ô 40 m, mỗi ô 1 khối / vật liệu.
   - Ảnh lá đã đổi sang trắng (chỉ dùng để cắt hình lá); màu lá tô chuyển theo độ cao trong tán (gốc sẫm → ngọn sáng) + pháp tuyến hướng ra từ tâm tán
     → tán tròn mềm như shader gốc của bộ (Unity/Godot), mà vẫn dùng vật liệu Lambert rẻ.
   - Cỏ / hoa chỉ vẽ trong 50 m quanh người chơi, cây trong 100 m (góc rộng: 70 / 180 m). Không đổ bóng thật (bóng râm đã vẽ sẵn vào nền: shadeGround).
   - Nạp lỗi → không có cây cỏ mới (vật cản vẫn giữ), game chạy bình thường. */
const NATURE = (function () {
  const DIR = "assets/nature/";
  // chiều cao chuẩn (m) cho từng loại; mô hình gốc được co theo đó
  const H = { CommonTree_3: 4.6, CommonTree_5: 4.2, Pine_5: 4.8, Bush_Common: 0.95, Bush_Common_Flowers: 0.95, Grass_Common_Short: 0.42, Grass_Common_Tall: 0.62,
    Grass_Wispy_Short: 0.4, Clover_1: 0.32, Flower_3_Group: 0.6, Flower_4_Single: 0.62, Fern_1: 0.75, Plant_1_Big: 0.8, Plant_7_Big: 0.12, Mushroom_Common: 0.3,
    Rock_Medium_1: 0.85, Rock_Medium_2: 0.75, Rock_Medium_3: 0.9, Pebble_Round_1: 0.06, Pebble_Round_3: 0.06 };
  const LEAF = { green: [0x2f6b2a, 0x9ed65a], cherry: [0xb8507c, 0xffc6dc], bush: [0x2c6628, 0x86c44e] };   // màu gốc → ngọn của tán
  const CH = 40, Q = [];   // Q: chỗ đặt [tên, x, z, cỡ, màu lá, lớp ("t" cây / "g" mặt đất)]
  let seed = 911; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const pick = a => a[(rnd() * a.length) | 0];

  function tree(x, z, s, cherry) { Q.push([pick(["CommonTree_3", "CommonTree_5"]), x, z, s, cherry ? "cherry" : "green", "t"]); }
  function bush(x, z, s) { Q.push([rnd() < 0.35 ? "Bush_Common_Flowers" : "Bush_Common", x, z, s || 1, "bush", "g"]); }
  function ground(x, z, kind) {   // thảm mặt đất: "grass" / "flower" / "plant" / "rock"
    const L = { grass: ["Grass_Common_Short", "Grass_Common_Short", "Grass_Common_Tall", "Grass_Wispy_Short"], flower: ["Flower_3_Group", "Flower_4_Single", "Clover_1"],
      plant: ["Fern_1", "Plant_1_Big", "Plant_7_Big", "Mushroom_Common"], rock: ["Rock_Medium_1", "Rock_Medium_2", "Rock_Medium_3", "Pebble_Round_1", "Pebble_Round_3"] }[kind];
    Q.push([pick(L), x, z, 0.8 + rnd() * 0.45, null, kind === "rock" ? "t" : "g"]);
  }

  /* ---------- nạp + chuẩn bị mẫu (mỗi mẫu: danh sách [vật liệu, hình đã co về chiều cao chuẩn]) ---------- */
  const MATS = {}, TPL = {};
  function material(m) {
    if (MATS[m.name]) return MATS[m.name];
    const o = new THREE.MeshLambertMaterial({ map: m.map || null, vertexColors: true, alphaTest: m.alphaTest || 0, side: m.side });
    if (o.map) o.map.anisotropy = 4;
    return MATS[m.name] = o;
  }
  function grad(g, cols) {   // tô màu theo độ cao trong tán + pháp tuyến hướng ra từ tâm tán
    g.computeBoundingBox(); const bb = g.boundingBox, y0 = bb.min.y, y1 = bb.max.y, c = new THREE.Vector3(); bb.getCenter(c); c.y -= (y1 - y0) * 0.15;
    const a = new THREE.Color(cols[0]), b = new THREE.Color(cols[1]), t = new THREE.Color(), p = g.attributes.position, n = g.attributes.normal, v = new THREE.Vector3(), col = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) {
      t.copy(a).lerp(b, Math.pow((p.getY(i) - y0) / Math.max(0.01, y1 - y0), 0.8)); col[i * 3] = t.r; col[i * 3 + 1] = t.g; col[i * 3 + 2] = t.b;
      v.fromBufferAttribute(p, i).sub(c).normalize(); n.setXYZ(i, v.x, v.y, v.z);
    }
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  }
  function white(g, up) {   // không tô màu; cỏ / lá thấp: pháp tuyến hướng lên → sáng như mặt đất khi nhìn từ trên cao (không thành đốm tối)
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3).fill(1), 3));
    if (up) { const n = g.attributes.normal; for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0); }
  }
  function prep(name, root) {   // gom các mảnh của mô hình, co về chiều cao chuẩn, đặt gốc ở mặt đất
    root.updateMatrixWorld(true); const parts = [], bb = new THREE.Box3().setFromObject(root), k = H[name] / Math.max(0.01, bb.max.y - bb.min.y);
    const M = new THREE.Matrix4().makeScale(k, k, k).multiply(new THREE.Matrix4().makeTranslation(0, -bb.min.y, 0));
    root.traverse(o => { if (!o.isMesh) return; const g = o.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(M, o.matrixWorld));
      if (g.attributes.color) g.deleteAttribute("color"); if (!g.index) g.setIndex([...Array(g.attributes.position.count).keys()]);
      parts.push({ m: o.material, g }); });
    TPL[name] = parts;
  }
  function variant(name, tint) {   // mẫu đã tô màu lá (mỗi tên + màu chỉ làm 1 lần)
    const key = name + "|" + tint; if (TPL[key]) return TPL[key];
    return TPL[key] = TPL[name].map(P => { const g = P.g.clone(); if (/Leaves_|Leaf_Pine/.test(P.m.name) || (/^Leaves_/.test(P.m.name))) grad(g, LEAF[tint] || LEAF.green); else white(g, /^(Grass|Leaves|Flowers)$/.test(P.m.name)); return { m: P.m, g }; });
  }

  /* ---------- gộp theo ô: mỗi ô × lớp × vật liệu = 1 khối ---------- */
  const managed = [];
  const _M = new THREE.Matrix4(), _Q = new THREE.Quaternion(), _E = new THREE.Euler(), _P = new THREE.Vector3(), _S = new THREE.Vector3(), _N = new THREE.Matrix3();
  function buildChunks() {
    const B = new Map();
    Q.forEach(([name, x, z, s, tint, layer]) => {
      if (!TPL[name]) return;
      const key = Math.floor(x / CH) + "," + Math.floor(z / CH) + "," + layer;
      let C = B.get(key); if (!C) B.set(key, C = { layer, mats: new Map() });
      _E.set(0, rnd() * 6.283, 0); _Q.setFromEuler(_E); _M.compose(_P.set(x, 0, z), _Q, _S.set(s, s * (0.9 + rnd() * 0.2), s)); _N.getNormalMatrix(_M);
      variant(name, tint || "green").forEach(P => { const mt = material(P.m); let L = C.mats.get(mt); if (!L) C.mats.set(mt, L = []); L.push([P.g, _M.clone(), _N.clone(), 0.92 + rnd() * 0.16]); });
    });
    B.forEach(C => C.mats.forEach((list, mt) => {
      let nv = 0, ni = 0; list.forEach(([g]) => { nv += g.attributes.position.count; ni += g.index.count; });
      const P = new Float32Array(nv * 3), N = new Float32Array(nv * 3), U = new Float32Array(nv * 2), Cc = new Float32Array(nv * 3), I = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
      let ov = 0, oi = 0; const v = new THREE.Vector3();
      list.forEach(([g, M, Nm, br]) => {
        const a = g.attributes, n = a.position.count;
        for (let i = 0; i < n; i++) {
          v.fromBufferAttribute(a.position, i).applyMatrix4(M); P.set([v.x, v.y, v.z], (ov + i) * 3);
          v.fromBufferAttribute(a.normal, i).applyMatrix3(Nm).normalize(); N.set([v.x, v.y, v.z], (ov + i) * 3);
          if (a.uv) U.set([a.uv.getX(i), a.uv.getY(i)], (ov + i) * 2);
          Cc.set([a.color.getX(i) * br, a.color.getY(i) * br, a.color.getZ(i) * br], (ov + i) * 3);   // mỗi cây sáng / tối khác nhau một chút
        }
        const ix = g.index.array; for (let i = 0; i < ix.length; i++) I[oi + i] = ix[i] + ov; ov += n; oi += ix.length;
      });
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(P, 3)); g.setAttribute("normal", new THREE.BufferAttribute(N, 3));
      g.setAttribute("uv", new THREE.BufferAttribute(U, 2)); g.setAttribute("color", new THREE.BufferAttribute(Cc, 3)); g.setIndex(new THREE.BufferAttribute(I, 1)); g.computeBoundingSphere();
      const m = new THREE.Mesh(g, mt); m.userData.flat = true; m.userData.flag = true; m.receiveShadow = false; m.castShadow = false; m.visible = false; scene.add(m);
      managed.push({ o: m, x: g.boundingSphere.center.x, z: g.boundingSphere.center.z, r: g.boundingSphere.radius, layer: C.layer });
    }));
    Q.length = 0;
  }
  function updateVis() {
    try {
      const inside = (typeof room !== "undefined" && room) || (typeof maze !== "undefined" && maze), p = player.position, wide = typeof camWide !== "undefined" && camWide;
      managed.forEach(it => { const far = it.layer === "g" ? (wide ? 70 : 50) : (wide ? 180 : 100); it.o.visible = !inside && Math.hypot(it.x - p.x, it.z - p.z) - it.r < far; });
    } catch (e) {}
  }

  let started = false;
  function build() {   // gọi sau khi wilds.js đã ghi xong chỗ đặt
    if (started || !Q.length || typeof THREE.GLTFLoader === "undefined") return; started = true;
    const names = [...new Set(Q.map(q => q[0]))], L = new THREE.GLTFLoader();
    Promise.all(names.map(n => new Promise(ok => L.load(DIR + n + ".gltf", g => { try { prep(n, g.scene); } catch (e) {} ok(); }, undefined, () => ok()))))
      .then(() => { buildChunks(); updateVis(); setInterval(updateVis, 250); });
  }
  return { tree, bush, ground, build, _managed: () => managed, _pending: () => Q.length };
})();
