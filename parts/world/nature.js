/* EnglishVerse – CÂY CỎ MÔ HÌNH (Quaternius, CC0 – assets/nature/, nguồn: assets/CREDITS.md). Hiện dùng cho mùa xuân (Blossom Valley + Bamboo Hills).
   - Cây: bộ "Textured Stylized Trees" (lá ảnh cắt hình, tán bông xốp; biến thể lá hồng = hoa anh đào). Thay cây "bông" lushTree của wilds.js.
   - Bụi, hoa, cây nhỏ, gốc cây: bộ "Ultimate Nature" (tô màu thuần). KHÔNG rải cỏ: nhìn từ camera cao thành đốm tối li ti (chủ dự án chê 18/11).
   - Lá: pháp tuyến hướng ra từ tâm tán → tán tròn mềm, không lộ mặt góc cạnh.
   Cách làm cho nhẹ máy: wilds.js chỉ ghi chỗ đặt (NATURE.tree / ground / bush) lúc dựng thế giới; file này nạp mô hình (~0,8 MB) rồi GỘP theo ô 40 m,
   mỗi ô × lớp × vật liệu = 1 lần vẽ. Cỏ/hoa chỉ vẽ trong 50 m quanh người chơi, cây trong 100 m (góc rộng 70 / 180 m). Không đổ bóng thật (bóng râm vẽ sẵn vào nền).
   Nạp lỗi → không có cây cỏ mới (vật cản vẫn giữ), game vẫn chạy. */
const NATURE = (function () {
  const DIR = "assets/nature/";
  const H = { Tree_1: 4.4, Tree_7: 4.8, Tree_9: 4.6, Tree_10: 4.0,   // chiều cao chuẩn (m); nhân thêm cỡ s khi đặt
    Bush_1: 0.95, Bush_2: 0.85, BushBerries_1: 0.95, Flowers: 0.42, TreeStump_Moss: 0.45 };
  const TREES = ["Tree_1", "Tree_7", "Tree_9", "Tree_10"];   // 4 mẫu nhẹ nhất (800–1.330 mặt)
  const GROUND = { flower: ["Flowers"], plant: ["TreeStump_Moss"] };   // bỏ cây con màu sẫm: thành đốm tối khi nhìn từ trên
  const TEX = { Tree_Leaves: "Tree_Leaves.png", Bark: "Tree_Bark.jpg" }, FOL = /Leaves|Green|Orange|Snow|Pink|Yellow/;
  const CH = 40, Q = [];   // chỗ đặt: [tên, x, z, cỡ, biến thể ("pink" | null), lớp ("t" cây / "g" mặt đất)]
  let seed = 911; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const pick = a => a[(rnd() * a.length) | 0];
  function tree(x, z, s, cherry) { Q.push([pick(TREES), x, z, s, cherry ? "pink" : null, "t"]); }
  function bush(x, z, s) { Q.push([pick(["Bush_1", "Bush_2", "BushBerries_1"]), x, z, s || 1, null, "g"]); }
  function ground(x, z, kind) { Q.push([pick(GROUND[kind] || GROUND.flower), x, z, 0.8 + rnd() * 0.45, null, "g"]); }

  /* ---------- vật liệu (dùng chung) ---------- */
  const MATS = {}, TL = new THREE.TextureLoader();
  function material(key, mesh, variant) {   // key = tên mảnh (+ màu); lá có ảnh: cắt hình bằng alphaTest
    const k = key + (variant ? "|" + variant : ""); if (MATS[k]) return MATS[k];
    const base = key.split("#")[0], tex = variant === "pink" && base === "Tree_Leaves" ? "Leaves_Pink.png" : TEX[base];
    let m;
    if (tex) { const t = TL.load(DIR + tex); t.anisotropy = 4; m = new THREE.MeshLambertMaterial({ map: t, alphaTest: /Leaves/.test(base) ? 0.5 : 0, side: /Leaves/.test(base) ? THREE.DoubleSide : THREE.FrontSide }); }
    else { const c = mesh.material.color.clone(); c.convertLinearToSRGB(); if (FOL.test(base)) c.multiplyScalar(1.4); m = new THREE.MeshLambertMaterial({ color: c }); }
    if (/Leaves|Bark/.test(base)) seeThrough(m);   // chỉ cây to (bụi, hoa thấp không cần)
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
      if (FOL.test(base) && !fb.isEmpty()) { const p = g.attributes.position, n = g.attributes.normal, v = new THREE.Vector3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).sub(cen).normalize(); n.setXYZ(i, v.x, v.y, v.z); } }
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
    if (started || !Q.length || typeof THREE.GLTFLoader === "undefined") return; started = true;
    const names = [...new Set(Q.map(q => q[0]))], L = new THREE.GLTFLoader();
    Promise.all(names.map(n => new Promise(ok => L.load(DIR + n + ".glb", g => { try { prep(n, g.scene); } catch (e) {} ok(); }, undefined, () => ok()))))
      .then(() => { buildChunks(); updateVis(); setInterval(updateVis, 250); });
  }
  return { tree, bush, ground, build, _managed: () => managed };
})();
