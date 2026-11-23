/* EnglishVerse – CÂY CỎ MÔ HÌNH (Quaternius, CC0 – assets/nature/, nguồn: assets/CREDITS.md). Hiện dùng cho mùa xuân (Blossom Valley + Bamboo Hills).
   - Cây: bộ "Textured Stylized Trees" (lá ảnh cắt hình, tán bông xốp; biến thể lá hồng = hoa anh đào). Thay cây "bông" lushTree của wilds.js.
   - Bụi, hoa, cây nhỏ, gốc cây: bộ "Ultimate Nature" (tô màu thuần). KHÔNG rải cỏ: nhìn từ camera cao thành đốm tối li ti (chủ dự án chê 18/11).
   - Lá: pháp tuyến hướng ra từ tâm tán → tán tròn mềm, không lộ mặt góc cạnh.
   Cách làm cho nhẹ máy: wilds.js chỉ ghi chỗ đặt (NATURE.tree / ground / bush) lúc dựng thế giới; file này nạp mô hình (~0,8 MB) rồi GỘP theo ô 40 m,
   mỗi ô × lớp × vật liệu = 1 lần vẽ. Cỏ/hoa chỉ vẽ trong 50 m quanh người chơi, cây trong 100 m (góc rộng 70 / 180 m). Không đổ bóng thật (bóng râm vẽ sẵn vào nền).
   Nạp lỗi → không có cây cỏ mới (vật cản vẫn giữ), game vẫn chạy. */
const NATURE = (function () {
  const DIR = "assets/nature/";
  const H = { Tree_1: 4.4, Tree_7: 4.8, Tree_9: 4.6, Tree_10: 4.0, Birch_2: 6.0, Birch_4: 6.4,   // chiều cao chuẩn (m); nhân thêm cỡ s khi đặt
    PineTree_Snow_1: 4.8, PineTree_Snow_3: 5.6, PineTree_Snow_5: 4.6, Cactus_1: 2.4, Cactus_2: 3.4, Cactus_3: 2.9, CactusFlowers_2: 3.0,
    PalmTree_1: 6.2, PalmTree_3: 5.6, PalmTree_4: 5.2,
    Bush_1: 0.95, Bush_2: 0.85, BushBerries_1: 0.95, Flowers: 0.42, TreeStump_Moss: 0.45 };
  const TREES = ["Tree_1", "Tree_7", "Tree_9", "Tree_10"];   // 4 mẫu nhẹ nhất (800–1.330 mặt)
  const KIND = {   // cây theo mùa (wilds.js gọi NATURE.place): [danh sách mẫu, biến thể lá]
    maple: () => rnd() < 0.3 ? [pick(["Birch_2", "Birch_4"]), "yellow"] : [pick(TREES), rnd() < 0.55 ? "orange" : "red"],   // thu
    pine: () => [pick(["PineTree_Snow_1", "PineTree_Snow_3", "PineTree_Snow_5"]), null],   // đông
    cactus: () => [pick(["Cactus_1", "Cactus_2", "Cactus_3", "CactusFlowers_2"]), null],   // sa mạc
    palm: () => [pick(["PalmTree_1", "PalmTree_3", "PalmTree_4"]), null],   // biển
    city: () => [pick(TREES), null],   // thành phố
    cpalm: () => [pick(["PalmTree_1", "PalmTree_3", "PalmTree_4"]), null],   // cây quanh toà nhà (bigTree trong ngoại thất)
    cbush: () => [pick(["Bush_1", "Bush_2", "BushBerries_1"]), null], cflower: () => ["Flowers", null]   // bồn hoa quảng trường
  };
  const NOPUFF = /^Cactus/;   // xương rồng giữ dáng gai, không làm mềm
  const GROUND = { flower: ["Flowers"], plant: ["TreeStump_Moss"] };   // bỏ cây con màu sẫm: thành đốm tối khi nhìn từ trên
  const TEX = { Tree_Leaves: "Tree_Leaves.png", Bark: "Tree_Bark.jpg", Birch_Leaves: "Birch_Leaves_Yellow.png", Birch_Bark: "Birch_Bark.png" },
    VTEX = { pink: "Leaves_Pink.png", orange: "Leaves_Orange.png", red: "Leaves_Red.png" },   // lá cây Tree_* theo biến thể
    TINT = { null: [0.8, 0.8, 0.8], pink: [0.92, 0.74, 0.74], orange: [0.85, 0.82, 0.8], red: [0.82, 0.78, 0.78], yellow: [0.86, 0.84, 0.8] },
    FOL = /Leaves|Green|Orange|Snow|Pink|Yellow/;   // tối bớt cho thật (chủ dự án 18/11); hồng: bớt xanh dương → hết ánh tím
  const CH = 40, Q = [], DEC = [];   // chỗ đặt: [tên, x, z, cỡ, biến thể ("pink" | null), lớp ("t" cây / "g" mặt đất)]
  let seed = 911; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const pick = a => a[(rnd() * a.length) | 0];
  function tree(x, z, s, cherry) { Q.push([pick(TREES), x, z, s, cherry ? "pink" : null, "t"]); }
  function place(kind, x, z, s) { const [n, v] = KIND[kind](); Q.push([n, x, z, s, v, kind[0] === "c" ? "c" : "t"]); }
  function bush(x, z, s) { Q.push([pick(["Bush_1", "Bush_2", "BushBerries_1"]), x, z, s || 1, null, "g"]); }
  function clearArea(x, z, r) { for (let i = Q.length - 1; i >= 0; i--) if (Math.hypot(Q[i][1] - x, Q[i][2] - z) < r) Q.splice(i, 1); }   // bỏ chỗ cây đã xếp (dọn chỗ cho cổng vết rách – rifts.js)
  function ground(x, z, kind) { Q.push([pick(GROUND[kind] || GROUND.flower), x, z, 0.8 + rnd() * 0.45, null, "g"]); }

  /* ---------- vật liệu (dùng chung) ---------- */
  const MATS = {}, TL = new THREE.TextureLoader();
  function material(key, mesh, variant) {   // key = tên mảnh (+ màu); lá có ảnh: cắt hình bằng alphaTest
    const k = key + (variant ? "|" + variant : ""); if (MATS[k]) return MATS[k];
    const base = key.split("#")[0], tex = base === "Tree_Leaves" && VTEX[variant] ? VTEX[variant] : TEX[base], leaf = /Leaves/.test(base);
    let m;
    if (tex) { const t = TL.load(DIR + tex); t.anisotropy = 4; m = new THREE.MeshLambertMaterial({ map: t, alphaTest: leaf ? 0.5 : 0, side: leaf ? THREE.DoubleSide : THREE.FrontSide });
      if (leaf) m.color.setRGB(...(TINT[variant] || TINT.null)); }
    else { const c = mesh.material.color.clone(); c.convertLinearToSRGB(); if (FOL.test(base) && base !== "Snow") c.multiplyScalar(1.2); m = new THREE.MeshLambertMaterial({ color: c }); }
    if (/Leaves|Bark|Snow|Green|Wood|Coconuts/.test(base) && !/^(Bush|Flowers|TreeStump)/.test(mesh.parent && mesh.parent.name || "")) seeThrough(m);   // chỉ cây to (bụi, hoa thấp không cần)
    return MATS[k] = m;
  }

  /* tán cây (> 1,1 m trên chân người chơi; tán bộ này thấp) nằm giữa camera và người chơi: lấm tấm trong suốt (như cây "bông" của wilds.js) */
  const pu = { value: new THREE.Vector3(0, -99, 0) };
  function seeThrough(m) {
    m.onBeforeCompile = sh => {
      sh.uniforms.pPos = pu;
      sh.vertexShader = "varying vec3 vWP;\n" + sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n  vWP = (modelMatrix * vec4(transformed, 1.0)).xyz;");
      sh.fragmentShader = "uniform vec3 pPos; varying vec3 vWP;\n" + sh.fragmentShader.replace("void main() {", `void main() {
  { vec2 d = vWP.xz - pPos.xz; float k = (1.0 - smoothstep(2.8, 5.0, length(vec2(d.x, max(0.0, -d.y) * 1.6 + d.y * 0.8)))) * step(1.1, vWP.y - pPos.y) * step(-1.5, d.y);
    float h = fract(sin(dot(floor(gl_FragCoord.xy), vec2(12.9898, 78.233))) * 43758.5453); if (h < k * 0.85) discard; }`);
    };
  }
  const setP = () => { try { pu.value.copy(player.position); } catch (e) {} };

  /* ---------- mẫu: các mảnh đã co về chiều cao chuẩn, gốc ở mặt đất, lá làm mềm ---------- */
  const TPL = {};
  function prep(name, root) {
    root.updateMatrixWorld(true);
    const bb = new THREE.Box3().setFromObject(root), k = H[name] / Math.max(0.01, bb.max.y - bb.min.y), fb = new THREE.Box3();
    root.traverse(o => { if (o.isMesh && FOL.test(o.name)) fb.expandByObject(o); });
    const cen = new THREE.Vector3(); if (!fb.isEmpty()) { fb.getCenter(cen); cen.y -= (fb.max.y - fb.min.y) * 0.2; }
    const M = new THREE.Matrix4().makeScale(k, k, k).multiply(new THREE.Matrix4().makeTranslation(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2));
    const parts = [];
    root.traverse(o => {
      if (!o.isMesh) return;
      let g = o.geometry.clone(); if (g.index) g = g.toNonIndexed(); g.applyMatrix4(o.matrixWorld);
      const base = o.name.replace(/[._]\d+$/, "");
      if (FOL.test(base) && !fb.isEmpty() && !NOPUFF.test(name)) { const p = g.attributes.position, n = g.attributes.normal, v = new THREE.Vector3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).sub(cen).normalize(); n.setXYZ(i, v.x, v.y, v.z); } }
      g.applyMatrix4(M);
      if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      parts.push({ key: TEX[base] ? base : base + "#" + o.material.color.getHexString(), mesh: o, g });
    });
    TPL[name] = parts;
  }

  /* ---------- gộp theo ô ---------- */
  const managed = [], _M = new THREE.Matrix4(), _Q = new THREE.Quaternion(), _E = new THREE.Euler(), _P = new THREE.Vector3(), _S = new THREE.Vector3(), _N = new THREE.Matrix3();
  function buildChunks() {
    const B = new Map();
    Q.forEach(([name, x, z, s, variant, layer]) => {
      const T = TPL[name]; if (!T) return;
      if (layer === "c" && /Tree/.test(name)) DEC.push([x + 0.6, z + 0.5, 2.3 * s]);
      const ck = Math.floor(x / CH) + "," + Math.floor(z / CH) + "," + layer; let C = B.get(ck); if (!C) B.set(ck, C = { layer, mats: new Map() });
      _E.set(0, rnd() * 6.283, 0); _Q.setFromEuler(_E); _M.compose(_P.set(x, 0, z), _Q, _S.set(s, s * (0.9 + rnd() * 0.2), s)); _N.getNormalMatrix(_M);
      T.forEach(P => { const mt = material(P.key, P.mesh, variant); let L = C.mats.get(mt); if (!L) C.mats.set(mt, L = []); L.push([P.g, _M.clone(), _N.clone()]); });
    });
    const v = new THREE.Vector3();
    B.forEach(C => C.mats.forEach((list, mt) => {
      let nv = 0; list.forEach(([g]) => nv += g.attributes.position.count);
      const Pp = new Float32Array(nv * 3), Nn = new Float32Array(nv * 3), Uu = new Float32Array(nv * 2); let o = 0;
      list.forEach(([g, M, Nm]) => { const a = g.attributes;
        for (let i = 0; i < a.position.count; i++, o++) {
          v.fromBufferAttribute(a.position, i).applyMatrix4(M); Pp[o * 3] = v.x; Pp[o * 3 + 1] = v.y; Pp[o * 3 + 2] = v.z;
          v.fromBufferAttribute(a.normal, i).applyMatrix3(Nm).normalize(); Nn[o * 3] = v.x; Nn[o * 3 + 1] = v.y; Nn[o * 3 + 2] = v.z;
          Uu[o * 2] = a.uv.getX(i); Uu[o * 2 + 1] = a.uv.getY(i);
        } });
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(Pp, 3)); g.setAttribute("normal", new THREE.BufferAttribute(Nn, 3)); g.setAttribute("uv", new THREE.BufferAttribute(Uu, 2)); g.computeBoundingSphere();
      const m = new THREE.Mesh(g, mt); m.userData.flat = true; m.userData.flag = true; m.castShadow = m.receiveShadow = false; m.visible = false; m.onBeforeRender = setP; scene.add(m);
      managed.push({ o: m, x: g.boundingSphere.center.x, z: g.boundingSphere.center.z, r: g.boundingSphere.radius, layer: C.layer });
    }));
    if (DEC.length) {   // bóng râm dưới cây thành phố (thành phố có bóng thật, cây gộp thì không đổ bóng → thêm vệt bóng mềm)
      const cv = document.createElement("canvas"); cv.width = cv.height = 64; const x = cv.getContext("2d"), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(20,40,20,.42)"); gr.addColorStop(0.6, "rgba(20,40,20,.25)"); gr.addColorStop(1, "rgba(20,40,20,0)"); x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
      const mt = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }), pos = [], uv = [];
      DEC.forEach(([cx, cz, r]) => { const a = [[-r, -r, 0, 0], [r, r, 1, 1], [r, -r, 1, 0], [-r, -r, 0, 0], [-r, r, 0, 1], [r, r, 1, 1]];   // ngửa lên
        a.forEach(([dx, dz, u, v]) => { pos.push(cx + dx, 0.04, cz + dz); uv.push(u, v); }); });
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.computeBoundingSphere();
      const m = new THREE.Mesh(g, mt); m.userData.flat = true; m.userData.flag = true; m.renderOrder = 1; scene.add(m);
      managed.push({ o: m, x: 0, z: 0, r: 1e5, layer: "c" }); DEC.length = 0;
    }
    Q.length = 0;
  }
  function updateVis() {
    try {
      const inside = (typeof room !== "undefined" && room) || (typeof maze !== "undefined" && maze), p = player.position, wide = typeof camWide !== "undefined" && camWide;
      managed.forEach(it => { const far = it.layer === "g" ? (wide ? 70 : 50) : (wide ? 180 : 100); it.o.visible = !inside && Math.hypot(it.x - p.x, it.z - p.z) - it.r < far; });
    } catch (e) {}
  }
  let started = false;
  function build() {   // gọi sau khi wilds.js ghi xong chỗ đặt
    if (started || typeof THREE.GLTFLoader === "undefined") return; started = true;
    try { scene.updateMatrixWorld(true); const v = new THREE.Vector3(); scene.traverse(o => { if (o.userData.npalm) { o.getWorldPosition(v); place("cpalm", v.x, v.z, o.userData.npalm * 1.05); } }); } catch (e) {}   // chỗ cây quanh toà nhà
    if (!Q.length) return;
    const names = [...new Set(Q.map(q => q[0]))], L = new THREE.GLTFLoader();
    Promise.all(names.map(n => new Promise(ok => L.load(DIR + n + ".glb", g => { try { prep(n, g.scene); } catch (e) {} ok(); }, undefined, () => ok()))))
      .then(() => { buildChunks(); updateVis(); setInterval(updateVis, 250); });
  }
  return { tree, place, bush, ground, build, clearArea, _managed: () => managed };
})();
