/* EnglishVerse – BẢN THỬ "2.5D" Ở BLOSSOM VALLEY (ROADMAP mục 6, việc #1, 26/11)
   Mục tiêu: nhìn giống game 2D vẽ tay (diorama) nhưng vẫn là 3D (thay đồ, tóc, giáp vẫn rẻ).
   Chỉ bật khi đứng trong Blossom Valley (mùa xuân, vòng 1). Nút "🎨 2.5D" (chỉ hiện ở đó) bật/tắt để so trước/sau; nhớ ở localStorage "ev_look25" ("0" = tắt).
   4 phần:
   (a) Camera góc cao cố định ~53°, góc nhìn hẹp (FOV 55° → 30°) và lùi xa tương ứng → khung hình giữ nguyên cỡ nhưng ít méo phối cảnh (cảm giác "sa bàn").
       Kéo ngang để xoay nhẹ ±24°; kéo dọc không đổi góc.
   (b) Mặt đất vẽ tay: 2 ảnh lặp (cỏ, đất) vẽ bằng canvas lúc tải (nét cỏ, sỏi, lá rụng, đốm màu kiểu cọ vẽ) + 1 ảnh nhiễu lớn chống lặp.
       Màu lớn vẫn lấy từ ảnh nền cũ của wilds.js (rừng sẫm / mảng đất / đường mòn) → chỗ nào là đất thì ra ảnh đất, cỏ ra ảnh cỏ, mép trộn theo "độ cao" ngọn cỏ.
       Gắn vào shader nền qua LOOK25.patchGround (gọi trong detailed() của wilds.js); chỉ tô trong khung Blossom Valley.
   (c) Ánh sáng có không khí: nắng ấm chiếu xiên ngang (bóng dài hơn), trời dịu, sương xa màu ấm, viền tối mép màn hình + ánh nắng nhẹ phía trên.
   (d) (Chưa làm – chờ nạp Tripo) thay nhà / cây / quái khối bằng mô hình cùng chất liệu nhân vật.
   Móc trong index.html: wildCamTick (góc + xoay nhẹ), kéo màn hình (pointermove), khoảng cách camera (camD), vòng lặp (LOOK25.tick). */
const LOOK25 = (function () {
  const FOV0 = 55, FOV1 = 30, PITCH = 0.93, YAW_MAX = 0.42;
  const SUN0 = [12, 22, 9], SUN1 = [15, 15, 3];   // vị trí nắng so với người chơi: thường / 2.5D (thấp + xiên ngang → bóng dài đổ sang trái)
  let dir = "S";   // vùng đang đứng → bộ màu đèn / sương riêng
  const LIGHT = { S: [0xffd9a0, 0xf2e2c4], NE: [0xffcf8e, 0xf0d6b0], N: [0xfff2e2, 0xe3ecf6], E: [0xffd08a, 0xf4d6a8], SE: [0xfff0c8, 0xdcf0ee] };   // [màu nắng, màu sương xa]
  let blend = 0, yaw = 0, here = false, fovSet = false, btn = null, veil = null;
  const U = { on: { value: 0 }, time: { value: 0 } };   // shader nền: 0 = tắt, 1 = bật (đổi mượt); time: nước chảy
  let enabled = true;
  try { enabled = localStorage.getItem("ev_look25") !== "0"; } catch (e) {}
  try { const q = new URLSearchParams(location.search).get("look25"); if (q !== null) enabled = q !== "0"; } catch (e) {}

  /* ---------- (b) ảnh vẽ tay (canvas, lặp liền mép) ---------- */
  function rng(s) { return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  function wrap(N, x, y, r, fn) {   // vẽ lặp ở mép để ảnh nối liền khi lặp
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) { const X = x + i * N, Y = y + j * N; if (X + r < 0 || Y + r < 0 || X - r > N || Y - r > N) continue; fn(X, Y); }
  }
  function blob(g, N, x, y, r, col, a) { wrap(N, x, y, r, (X, Y) => { const gr = g.createRadialGradient(X, Y, 0, X, Y, r); gr.addColorStop(0, col.replace(")", "," + a + ")").replace("rgb", "rgba")); gr.addColorStop(1, col.replace(")", ",0)").replace("rgb", "rgba")); g.fillStyle = gr; g.fillRect(X - r, Y - r, 2 * r, 2 * r); }); }
  const hx = h => "rgb(" + ((h >> 16) & 255) + "," + ((h >> 8) & 255) + "," + (h & 255) + ")";
  function blade(g, N, x, y, len, w, lean, col) {   // 1 ngọn cỏ: nét cong, gốc to ngọn nhọn (vẽ 2 lần mỏng dần)
    wrap(N, x, y, len + 4, (X, Y) => { g.strokeStyle = col; g.lineCap = "round";
      g.lineWidth = w; g.beginPath(); g.moveTo(X, Y); g.quadraticCurveTo(X + lean * 0.3, Y - len * 0.6, X + lean, Y - len * 0.6); g.stroke();
      g.lineWidth = w * 0.5; g.beginPath(); g.moveTo(X + lean, Y - len * 0.6); g.quadraticCurveTo(X + lean * 1.4, Y - len * 0.85, X + lean * 1.8, Y - len); g.stroke(); });
  }
  function avg(cv) { const d = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data; let r = 0, gg = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; } const n = d.length / 4 * 255; return new THREE.Vector3(r / n, gg / n, b / n); }
  function tex(cv) { const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; }

  function grassTile() {
    const N = 512, cv = document.createElement("canvas"); cv.width = cv.height = N; const g = cv.getContext("2d"), r = rng(11);
    g.fillStyle = hx(0x6c9f45); g.fillRect(0, 0, N, N);
    const pal = [0x5a8c38, 0x7aae4b, 0x88bb55, 0x4e7f33, 0x96c45f, 0x6f9a3c];
    for (let i = 0; i < 170; i++) blob(g, N, r() * N, r() * N, 18 + r() * 60, hx(pal[(r() * pal.length) | 0]), 0.22 + r() * 0.2);   // đốm màu kiểu cọ vẽ
    for (let i = 0; i < 3200; i++) { const v = r(), col = v < 0.5 ? "rgba(58,100,40,.32)" : "rgba(160,205,100,.32)"; blade(g, N, r() * N, r() * N, 3 + r() * 6, 1 + r(), (r() - 0.5) * 4, col); }   // nét cỏ ngắn rải đều (vân nền)
    for (let c = 0; c < 230; c++) {   // khóm cỏ: 4–10 ngọn xoè từ 1 gốc, đậm nhạt khác nhau
      const cx = r() * N, cy = r() * N, n = 4 + ((r() * 7) | 0), dark = r() < 0.5, a = 0.3 + r() * 0.4, sz = 0.6 + r() * 0.8;
      for (let k = 0; k < n; k++) {
        const x = cx + (r() - 0.5) * 12 * sz, y = cy + (r() - 0.5) * 6 * sz, len = (6 + r() * 10) * sz, lean = (r() - 0.5) * 10 * sz, v = r();
        const col = dark ? (v < 0.5 ? "rgba(52,96,36," + a + ")" : "rgba(70,116,46," + a + ")") : (v < 0.5 ? "rgba(150,200,96," + a + ")" : "rgba(180,216,116," + a + ")");
        blade(g, N, x, y, len, 1.3 + r() * 1.3, lean, col);
      }
    }
    for (let i = 0; i < 260; i++) { const x = r() * N, y = r() * N; wrap(N, x, y, 3, (X, Y) => { g.fillStyle = "rgba(205,232,140," + (0.35 + r() * 0.35) + ")"; g.fillRect(X, Y, 1.5 + r() * 2, 1.5); }); }   // ánh nắng trên ngọn
    for (let i = 0; i < 26; i++) {   // cỏ ba lá + hoa nhỏ li ti
      const x = r() * N, y = r() * N, f = r();
      if (f < 0.55) { wrap(N, x, y, 6, (X, Y) => { g.fillStyle = "rgba(70,130,52,.85)"; for (let k = 0; k < 3; k++) { const a = k * 2.094; g.beginPath(); g.arc(X + Math.cos(a) * 2.6, Y + Math.sin(a) * 2.6, 2.4, 0, 7); g.fill(); } }); }
      else { const col = [0xffffff, 0xffe066, 0xffa8c8][(r() * 3) | 0]; wrap(N, x, y, 6, (X, Y) => { g.fillStyle = hx(col); for (let k = 0; k < 5; k++) { const a = k * 1.2566; g.beginPath(); g.arc(X + Math.cos(a) * 1.8, Y + Math.sin(a) * 1.8, 1.4, 0, 7); g.fill(); } g.fillStyle = "#f4b400"; g.beginPath(); g.arc(X, Y, 1.1, 0, 7); g.fill(); }); }
    }
    return cv;
  }
  function dirtTile() {
    const N = 512, cv = document.createElement("canvas"); cv.width = cv.height = N; const g = cv.getContext("2d"), r = rng(29);
    g.fillStyle = hx(0x9c7b50); g.fillRect(0, 0, N, N);
    const pal = [0x8a6a42, 0xb08c5c, 0x7a5c38, 0xa98557, 0xc19c6a];
    for (let i = 0; i < 150; i++) blob(g, N, r() * N, r() * N, 14 + r() * 55, hx(pal[(r() * pal.length) | 0]), 0.25 + r() * 0.25);
    for (let i = 0; i < 40; i++) { const x = r() * N, y = r() * N, L = 10 + r() * 28; wrap(N, x, y, L, (X, Y) => { g.strokeStyle = "rgba(92,66,38,.45)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(X, Y); let px = X, py = Y; for (let k = 0; k < 4; k++) { px += (r() - 0.5) * L * 0.6; py += (r() - 0.3) * L * 0.4; g.lineTo(px, py); } g.stroke(); }); }   // vết nứt
    for (let i = 0; i < 170; i++) {   // sỏi: bóng dưới phải, sáng trên trái
      const x = r() * N, y = r() * N, rx = 2 + r() * 5.5, ry = rx * (0.6 + r() * 0.3), a = r() * 3, v = 120 + r() * 70 | 0;
      wrap(N, x, y, rx + 3, (X, Y) => {
        g.fillStyle = "rgba(60,42,24,.45)"; g.beginPath(); g.ellipse(X + 1.3, Y + 1.6, rx, ry, a, 0, 7); g.fill();
        g.fillStyle = "rgb(" + v + "," + (v * 0.92 | 0) + "," + (v * 0.8 | 0) + ")"; g.beginPath(); g.ellipse(X, Y, rx, ry, a, 0, 7); g.fill();
        g.fillStyle = "rgba(255,245,220,.45)"; g.beginPath(); g.ellipse(X - rx * 0.3, Y - ry * 0.35, rx * 0.45, ry * 0.35, a, 0, 7); g.fill(); });
    }
    for (let i = 0; i < 30; i++) {   // lá rụng
      const x = r() * N, y = r() * N, L = 4 + r() * 4, a = r() * 6.3, col = [0x7a9a3c, 0xb88a3a, 0xc9a25a, 0x6b8a34][(r() * 4) | 0];
      wrap(N, x, y, L + 2, (X, Y) => { g.save(); g.translate(X, Y); g.rotate(a); g.fillStyle = "rgba(40,28,16,.35)"; g.beginPath(); g.ellipse(1, 1.2, L, L * 0.42, 0, 0, 7); g.fill(); g.fillStyle = hx(col); g.beginPath(); g.ellipse(0, 0, L, L * 0.42, 0, 0, 7); g.fill(); g.strokeStyle = "rgba(60,40,20,.5)"; g.lineWidth = 0.7; g.beginPath(); g.moveTo(-L, 0); g.lineTo(L, 0); g.stroke(); g.restore(); });
    }
    for (let c = 0; c < 22; c++) { const cx = r() * N, cy = r() * N; for (let k = 0; k < 6; k++) blade(g, N, cx + (r() - 0.5) * 8, cy, 5 + r() * 7, 1.4, (r() - 0.5) * 7, "rgba(96,130,58,.8)"); }   // vài khóm cỏ dại
    return cv;
  }
  function leafTile() {   // lá rụng mùa thu (nền trong suốt): lá phong 5 thuỳ + lá bầu dục, đỏ / cam / vàng / nâu, có bóng nhỏ, đè lên ảnh cỏ ở gần cho sắc nét
    const N = 512, cv = document.createElement("canvas"); cv.width = cv.height = N; const g = cv.getContext("2d"), r = rng(47);
    const cols = ["#c0392b", "#d35400", "#e67e22", "#f1c40f", "#a0522d", "#b03a1a", "#e8a33a", "#8e5a2b"];
    for (let i = 0; i < 230; i++) {
      const x = r() * N, y = r() * N, L = 6 + r() * 7, a = r() * 6.3, col = cols[(r() * cols.length) | 0], maple = r() < 0.55;
      wrap(N, x, y, L + 3, (X, Y) => { g.save(); g.translate(X, Y); g.rotate(a);
        const shape = () => { g.beginPath(); if (maple) { for (let k = 0; k < 5; k++) { const t = -Math.PI / 2 + (k - 2) * 0.62, rr = k === 2 ? L : k % 2 ? L * 0.8 : L * 0.62; g.lineTo(Math.cos(t) * rr, Math.sin(t) * rr); g.lineTo(Math.cos(t + 0.31) * rr * 0.42, Math.sin(t + 0.31) * rr * 0.42); } g.lineTo(0, L * 0.25); }
          else g.ellipse(0, 0, L * 0.45, L, 0, 0, 7); g.closePath(); };
        g.translate(1.2, 1.5); g.fillStyle = "rgba(30,20,10,.35)"; shape(); g.fill(); g.translate(-1.2, -1.5);   // bóng nhỏ
        g.fillStyle = col; shape(); g.fill();
        g.strokeStyle = "rgba(60,30,10,.55)"; g.lineWidth = 0.8; g.beginPath(); g.moveTo(0, L * (maple ? 0.5 : 1.1)); g.lineTo(0, -L * 0.7); g.stroke();   // gân + cuống
        g.fillStyle = "rgba(255,240,200,.25)"; g.beginPath(); g.ellipse(-L * 0.15, -L * 0.25, L * 0.22, L * 0.35, 0.3, 0, 7); g.fill();   // ánh sáng
        g.restore(); });
    }
    const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t;
  }
  function macroTile() {   // nhiễu lớn mềm (chống lặp ảnh, loang sáng tối như mây che nắng)
    const N = 128, cv = document.createElement("canvas"); cv.width = cv.height = N; const g = cv.getContext("2d"), r = rng(5);
    g.fillStyle = "rgb(128,128,128)"; g.fillRect(0, 0, N, N);
    for (let i = 0; i < 60; i++) { const v = r() < 0.5 ? "rgb(255,255,255)" : "rgb(0,0,0)"; blob(g, N, r() * N, r() * N, 10 + r() * 26, v, 0.25); }
    return cv;
  }
  let T = null;
  function textures() {
    if (T) return T;
    const gC = grassTile(), dC = dirtTile();
    T = { g: { value: tex(gC) }, d: { value: tex(dC) }, m: { value: tex(macroTile()) }, ga: { value: avg(gC) }, da: { value: avg(dC) } };
    // Maple Highlands (thử 26/11): nền là ảnh VẼ TAY TẢI VỀ (OpenGameArt, CC0): cỏ "Hand Painted Grass" – PamNawi; đất nứt "4 hand-painted ground textures" – Drummyfish
    const ld = f => { const t = new THREE.TextureLoader().load(f); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t; };
    Object.assign(T, { s3: { value: ld("assets/painted/ground-sand.webp") }, s3a: { value: new THREE.Vector3(0.879, 0.838, 0.608) } });   // cát gợn "4 hand-painted ground textures" – Drummyfish (CC0): sa mạc, bãi biển, và nhuộm trắng xanh làm tuyết dạt
    Object.assign(T, { g2: { value: ld("assets/painted/ground-grass.webp") }, d2: { value: ld("assets/painted/ground-dirt.webp") }, lf: { value: leafTile() }, g2a: { value: new THREE.Vector3(0.284, 0.516, 0.047) }, d2a: { value: new THREE.Vector3(0.679, 0.491, 0.271) } });
    return T;
  }

  /* Gắn vào shader nền (wilds.js detailed): thay vân mịn bằng ảnh vẽ tay trong khung Blossom Valley.
     Màu lớn = ảnh nền cũ (trước vân mịn) × màu đỉnh; ảnh vẽ tay chia cho màu trung bình của nó → giữ đúng tông vùng. */
  function patchGround(sh) {
    const t = textures();
    Object.assign(sh.uniforms, { l25On: U.on, l25G: t.g, l25D: t.d, l25M: t.m, l25GA: t.ga, l25DA: t.da, l25G2: t.g2, l25D2: t.d2, l25G2A: t.g2a, l25D2A: t.d2a, l25L: t.lf, l25S: t.s3, l25SA: t.s3a });
    sh.vertexShader = "varying vec3 vW25;\n#ifdef RIB\nattribute float ea; varying float vEA;\n#endif\n" + sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n  vW25 = (modelMatrix * vec4(transformed, 1.0)).xyz;\n#ifdef RIB\n  vEA = ea;\n#endif");
    sh.fragmentShader = "uniform float l25On; uniform sampler2D l25G, l25D, l25M, l25G2, l25D2, l25L, l25S; uniform vec3 l25GA, l25DA, l25G2A, l25D2A, l25SA; varying vec3 vW25;\n#ifdef RIB\nvarying float vEA;\n#endif\n" +
      "float l25Sec(vec2 p, float a0, float a1) { float a = degrees(atan(p.x, -p.y)), m = max(abs(p.x), abs(p.y)); return smoothstep(a0, a0 + 3.0, a) * (1.0 - smoothstep(a1 - 3.0, a1, a)) * smoothstep(149.0, 156.0, m) * (1.0 - smoothstep(236.0, 241.0, m)); }\n" +
      "float l25MaskNE(vec2 p) { float a = degrees(atan(p.x, -p.y)), m = max(abs(p.x), abs(p.y)); return smoothstep(30.0, 33.0, a) * (1.0 - smoothstep(57.0, 60.0, a)) * smoothstep(149.0, 156.0, m) * (1.0 - smoothstep(236.0, 241.0, m)); }\n" +
      "float l25Mask(vec2 p) { float r = p.x / max(p.y, 1.0); return smoothstep(149.0, 157.0, p.y) * smoothstep(-1.0, -0.94, r) * (1.0 - smoothstep(0.52, 0.577, r)) * (1.0 - smoothstep(236.0, 241.0, max(abs(p.x), abs(p.y)))); }\n" +
      sh.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n  vec3 c25 = diffuseColor.rgb;")
        .replace("#include <color_fragment>", `#include <color_fragment>
  #ifdef RIB
  { // dải đường mòn / bờ suối: mép lởm chởm theo ngọn cỏ + nhiễu → cỏ bên dưới mọc lấn vào, không còn mép cắt thẳng
    vec2 q = vec2(vW25.x, -vW25.z);
    float hg = dot(texture2D(l25G, q / 4.2).rgb, vec3(0.3, 0.6, 0.1)) / dot(l25GA, vec3(0.3, 0.6, 0.1)), nz = texture2D(l25M, q / 7.0).r;
    float mk = max(max(l25Mask(vW25.xz), l25MaskNE(vW25.xz)), l25Sec(vW25.xz, -45.0, 30.0) + l25Sec(vW25.xz, 60.0, 120.0) + l25Sec(vW25.xz, 120.0, 150.0)), th = mix(1.01, 0.8 + (nz - 0.5) * 0.4 - (hg - 1.0) * 0.3, mk), sw = max(0.002, 0.1 * mk);   // chỉ trong Blossom Valley (vùng khác: mép trơn như cũ)
    float al = 1.0 - smoothstep(th - sw, th + sw, abs(vEA)); if (al < 0.01) discard; diffuseColor.a *= al; }   // mép lởm chởm nhưng mờ dần, không sắc
  #endif
  { float msk = l25On * l25Mask(vW25.xz);
    if (msk > 0.002) {
      vec3 c = c25;
      #ifdef USE_COLOR
        c *= vColor;
      #endif
      vec2 w = vec2(vW25.x, -vW25.z);
      float mac = texture2D(l25M, w / 43.0).r, mac2 = texture2D(l25M, w / 11.0 + 0.37).r;
      vec2 w2 = mat2(0.8, -0.6, 0.6, 0.8) * w / 5.3 + vec2(0.31, 0.57);   // lấy ảnh lần 2 xoay lệch, trộn theo nhiễu lớn → không thấy ô lặp
      float sel = smoothstep(0.38, 0.62, mac2);
      vec3 G = mix(texture2D(l25G, w / 4.2).rgb, texture2D(l25G, w2).rgb, sel), D = mix(texture2D(l25D, w / 3.4).rgb, texture2D(l25D, w2 * 1.2).rgb, sel);
      float gm = clamp((c.g - max(c.r, c.b)) * 7.0, 0.0, 1.0); if (c.b > c.g + 0.04) gm = 0.0;
      float hG = dot(G, vec3(0.3, 0.6, 0.1)) / dot(l25GA, vec3(0.3, 0.6, 0.1));
      float tg = smoothstep(0.12, 0.88, gm + (hG - 1.0) * 0.55 + (mac2 - 0.5) * 0.35);   // mép đất – cỏ: cỏ thưa dần vào đất theo khóm cỏ + nhiễu (mềm, không thẳng, không sắc)
      vec3 gRef = mix(vec3(0.40, 0.59, 0.26), c, smoothstep(0.6, 0.95, gm)), dRef = mix(vec3(0.50, 0.49, 0.30), c, smoothstep(0.4, 0.05, gm));   // vùng giáp: màu cỏ / màu đất bên trong mảng (khỏi viền nâu sậm)
      vec3 hp = mix(D / l25DA * dRef, G / l25GA * gRef, tg);
      hp *= 0.84 + mac * 0.3 + (mac2 - 0.5) * 0.12;
      hp = mix(vec3(dot(hp, vec3(0.3, 0.59, 0.11))), hp, 1.04) * vec3(1.05, 0.99, 0.9);   // ấm hơn, bớt xanh "neon"
      diffuseColor.rgb = mix(diffuseColor.rgb, hp, msk);
    } }
  { float mN = l25On * l25MaskNE(vW25.xz);   // Maple Highlands: ảnh vẽ tay tải về, nhuộm màu thu theo ảnh nền (vàng / cam / mảng lá đỏ)
    if (mN > 0.002) {
      vec3 c = c25;
      #ifdef USE_COLOR
        c *= vColor;
      #endif
      vec2 w = vec2(vW25.x, -vW25.z);
      float mac = texture2D(l25M, w / 43.0).r, mac2 = texture2D(l25M, w / 11.0 + 0.37).r, sel = smoothstep(0.38, 0.62, mac2);
      vec2 w2 = mat2(0.8, -0.6, 0.6, 0.8) * w / 7.7 + vec2(0.31, 0.57);
      vec3 G = mix(texture2D(l25G2, w / 3.0).rgb, texture2D(l25G2, w2 * 1.9).rgb, sel),   // 3 m / lần lặp (trước 6,5 m: gần nhìn nét cọ to, nhòe)
         D = mix(texture2D(l25D2, w / 2.6).rgb, texture2D(l25D2, w2 * 2.4).rgb, sel);
      float gl = min(dot(G, vec3(0.3, 0.6, 0.1)) / dot(l25G2A, vec3(0.3, 0.6, 0.1)), 1.3); G = min(G, l25G2A * 1.6);   // chặn chấm hoa trắng trong ảnh (nhuộm ra đốm tím)
      float mx = max(c.r, max(c.g, c.b)), sat = (mx - min(c.r, min(c.g, c.b))) / max(mx, 0.01);
      float tg = smoothstep(0.3, 0.62, sat + (gl - 1.0) * 0.3 + (mac2 - 0.5) * 0.18);   // ít bão hoà = đất; cỏ thưa dần vào đất
      vec3 aut = mix(c, vec3(0.5, 0.5, 0.24), 0.45);   // vàng úa pha ô liu (bớt cam chói)
      vec3 gC = mix(gl * aut, G / l25G2A * aut, 0.4), dC = mix(D / l25D2A, vec3(1.0), 0.5) * mix(vec3(0.6, 0.47, 0.32), c, 0.25);   // đất: vết nứt nhỏ, nhạt; màu nâu ấm
      float fine = dot(texture2D(l25G, w / 1.8).rgb, vec3(0.3, 0.6, 0.1)) / dot(l25GA, vec3(0.3, 0.6, 0.1));   // ngọn cỏ mảnh (ảnh cỏ vẽ code) → gần vẫn sắc
      gC *= mix(1.0, fine, 0.55);
      vec4 Lf = texture2D(l25L, w / 2.4), Lf2 = texture2D(l25L, w2 * 2.9 + 0.5);
      float dens = smoothstep(0.25, 0.75, mac2 * 0.7 + mac * 0.5);   // lá rụng: chỗ dày chỗ thưa
      gC = mix(gC, Lf.rgb * 0.9, Lf.a * (0.35 + 0.6 * dens)); gC = mix(gC, Lf2.rgb * 0.85, Lf2.a * dens * 0.7);
      dC = mix(dC, Lf.rgb * 0.85, Lf.a * dens * 0.35);
      vec3 hp = mix(dC, gC, tg) * (0.86 + mac * 0.28);
      diffuseColor.rgb = mix(diffuseColor.rgb, hp, mN);
    } }
  { // Frost Peaks (N) · Sunset Canyon (E) · Coral Coast (SE): ảnh vẽ tay tải về (cát gợn, đất nứt, cỏ) + chi tiết nhỏ vẽ code
    vec2 p2 = vW25.xz; float rN = l25Sec(p2, -45.0, 30.0), rE = l25Sec(p2, 60.0, 120.0), rS = l25Sec(p2, 120.0, 150.0), mR = l25On * (rN + rE + rS);
    if (mR > 0.002) {
      vec3 c = c25;
      #ifdef USE_COLOR
        c *= vColor;
      #endif
      vec2 w = vec2(vW25.x, -vW25.z);
      float mac = texture2D(l25M, w / 43.0).r, mac2 = texture2D(l25M, w / 11.0 + 0.37).r, sel = smoothstep(0.38, 0.62, mac2);
      vec2 w2 = mat2(0.8, -0.6, 0.6, 0.8) * w / 7.7 + vec2(0.31, 0.57);
      vec3 L3 = vec3(0.3, 0.6, 0.1);
      float sl = dot(mix(texture2D(l25S, w / 4.0).rgb, texture2D(l25S, w2 * 2.2).rgb, sel), L3) / dot(l25SA, L3);   // gợn cát / tuyết dạt
      float dl = dot(mix(texture2D(l25D2, w / 2.6).rgb, texture2D(l25D2, w2 * 2.4).rgb, sel), L3) / dot(l25D2A, L3);   // vết nứt
      float fd = dot(texture2D(l25D, w / 1.7).rgb, L3) / dot(l25DA, L3), fg = dot(texture2D(l25G, w / 1.8).rgb, L3) / dot(l25GA, L3);   // chi tiết nhỏ (code): sỏi, ngọn cỏ
      float lc = dot(c, L3);
      vec3 hp = vec3(0.0);
      if (rN > 0.001) {   // tuyết: gợn dạt + lấp lánh nhẹ; hồ băng (xanh): vết nứt; đá lộ: sỏi
        float ice = smoothstep(0.12, 0.2, c.b - c.r);   // chỉ hồ băng (xanh rõ); tuyết hơi ánh xanh không tính
        vec3 snow = c * mix(sl, 1.0, 0.45) * mix(1.0, fd, 0.12) * vec3(0.98, 1.0, 1.03);
        vec3 icec = c * mix(1.0, mix(dl, 1.0, 0.45), 1.0) * vec3(0.97, 1.0, 1.04);
        hp += mix(snow, icec, ice) * rN;
      }
      if (rE > 0.001) {   // sa mạc: cát gợn; mảng đỏ sẫm: đất nứt khô; sỏi nhỏ
        float crack = smoothstep(0.6, 0.48, lc + (mac2 - 0.5) * 0.08);
        vec3 sand = c * mix(sl, 1.0, 0.25) * mix(1.0, fd, 0.18), dry = c * mix(dl, 1.0, 0.08) * mix(1.0, fd, 0.25);
        hp += mix(sand, dry, crack) * rE;
      }
      if (rS > 0.001) {   // biển nhiệt đới: cỏ vẽ tay (ảnh tải về) + cát gợn; nước biển giữ nguyên
        float gm = clamp((c.g - max(c.r, c.b)) * 6.0, 0.0, 1.0), water = smoothstep(0.03, 0.1, c.b - c.r * 0.9 - 0.08);
        vec3 G = mix(texture2D(l25G2, w / 3.0).rgb, texture2D(l25G2, w2 * 1.9).rgb, sel);
        float gl = min(dot(G, L3) / dot(l25G2A, L3), 1.3); G = min(G, l25G2A * 1.6);
        vec3 cg = mix(vec3(dot(c, L3)), c, 0.78) * vec3(1.02, 0.97, 0.9), grass = mix(gl * cg, G / l25G2A * cg, 0.35) * mix(1.0, fg, 0.5), sand = c * mix(sl, 1.0, 0.3) * mix(1.0, fd, 0.2);
        vec3 land = mix(sand, grass, smoothstep(0.25, 0.75, gm + (gl - 1.0) * 0.3 + (mac2 - 0.5) * 0.2));
        hp += mix(land, c, water) * rS;
      }
      hp = hp / max(rN + rE + rS, 0.001) * (0.88 + mac * 0.24);
      diffuseColor.rgb = mix(diffuseColor.rgb, hp, mR);
    } }`);
  }

  /* Suối mùa xuân: lạch nước cạn, trong – thấy sỏi đáy, giữa sâu hơn, gợn sáng trôi theo dòng, mép ướt lởm chởm (lội qua được) */
  function patchWater(sh) {
    const t = textures();
    Object.assign(sh.uniforms, { l25D: t.d, l25M: t.m, l25DA: t.da, l25T: U.time });
    sh.vertexShader = "attribute float ea; varying float vEA; varying vec3 vW25;\n" + sh.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n  vEA = ea; vW25 = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    sh.fragmentShader = "uniform sampler2D l25D, l25M; uniform vec3 l25DA; uniform float l25T; varying float vEA; varying vec3 vW25;\n" + sh.fragmentShader.replace("#include <color_fragment>", `#include <color_fragment>
  { vec2 w = vec2(vW25.x, -vW25.z); float a = abs(vEA), nz = texture2D(l25M, w / 5.0).r;
    if (a > 0.93 + (nz - 0.5) * 0.25) discard;
    vec3 bed = texture2D(l25D, w / 2.6).rgb / l25DA * vec3(0.5, 0.45, 0.36);   // sỏi đáy (ướt, sẫm)
    float dp = clamp(1.0 - a * a * 1.15, 0.0, 1.0);
    vec3 col = mix(bed, mix(vec3(0.42, 0.68, 0.66), vec3(0.12, 0.38, 0.48), dp), 0.3 + dp * 0.55);
    float r1 = texture2D(l25M, w / 5.5 + vec2(0.02, l25T * 0.09)).r, r2 = texture2D(l25M, w / 3.1 + vec2(0.31, l25T * 0.16)).r;
    col += smoothstep(0.66, 0.86, r1 * 0.55 + r2 * 0.55) * vec3(0.22, 0.26, 0.26);   // gợn sáng trôi xuôi dòng
    col = mix(col, vec3(0.9, 0.95, 0.95), smoothstep(0.8, 0.92, a) * smoothstep(0.45, 0.7, r2) * 0.6);   // bọt nhỏ sát bờ
    diffuseColor.rgb = col; }`);
  }

  /* ---------- trạng thái: đang ở Blossom Valley? ---------- */
  function inBlossom() {
    try {
      if (room || maze || creating) return false;
      if (typeof RIFTS !== "undefined" && RIFTS.blocked(player.position.x, player.position.z) !== undefined) return false;
      const s = WILDS.sectorAt(player.position.x, player.position.z); if (s && s.ring === 1) { dir = s.dir; return true; } return false;   // vòng 1 cả 5 vùng (26/11)
    } catch (e) { return false; }
  }
  function ui() {
    if (btn) return;
    btn = document.createElement("button"); btn.id = "lookBtn";
    btn.style.cssText = "position:fixed;top:calc(250px + env(safe-area-inset-top,0px));right:12px;width:112px;border:0;border-radius:999px;padding:6px 0;font-weight:700;font-size:14px;display:none;background:linear-gradient(180deg,#3a4677,#1b2340);color:#eef1fb;box-shadow:inset 0 0 0 2px #ffc94a,0 3px 0 #7a5212,0 5px 10px rgba(0,0,0,.35);font-family:var(--ev-font,system-ui)";
    btn.onclick = () => { enabled = !enabled; try { localStorage.setItem("ev_look25", enabled ? "1" : "0"); } catch (e) {} label(); };
    document.body.appendChild(btn); label();
    veil = document.createElement("div"); veil.className = "look25";   // viền tối mép + nắng nhẹ phía trên (z-index 1 như viền trong nhà, dưới mọi bảng/nút)
    veil.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0;background:radial-gradient(ellipse 85% 75% at 50% 48%,rgba(0,0,0,0) 52%,rgba(28,18,36,.46) 100%),linear-gradient(180deg,rgba(255,210,140,.18),rgba(255,210,140,0) 38%,rgba(0,0,0,0) 75%,rgba(40,30,60,.12))";
    document.body.appendChild(veil);
  }
  function label() { if (btn) btn.textContent = "🎨 2.5D: " + (enabled ? "On" : "Off"); }

  const lerp = (a, b, t) => a + (b - a) * t;
  const cSun0 = new THREE.Color(0xfff0d6), cSun1 = new THREE.Color(0xffd9a0), cSky0 = new THREE.Color(0xdff0ff), cSky1 = new THREE.Color(0xc9dcff), cGr0 = new THREE.Color(0x9bc47a), cGr1 = new THREE.Color(0x8a8a5a);
  const cFog0 = new THREE.Color(0xcfe8ff), cFog1 = new THREE.Color(0xf2e2c4);
  function tick(dt) {
    ui();
    here = inBlossom();
    btn.style.display = here ? "block" : "none";
    const want = here && enabled ? 1 : 0;
    blend += (want - blend) * Math.min(1, dt * 3); if (Math.abs(want - blend) < 0.002) blend = want;
    U.on.value = enabled ? 1 : blend; U.time.value += dt;   // mặt đất: theo nút (chỉ tô trong khung Blossom Valley)
    veil.style.opacity = blend.toFixed(3);
    if (!here) yaw = 0;
    if (room || maze) { fovSet = false; return; }   // trong nhà / mê cung: index.html tự lo đèn + camera
    if (blend > 0 || fovSet) {   // camera: FOV hẹp dần
      const f = lerp(FOV0, FOV1, blend); if (Math.abs(camera.fov - f) > 0.01) { camera.fov = f; camera.updateProjectionMatrix(); }
      fovSet = blend > 0;
      // đèn + sương (chỉ ngoài trời)
      sun.intensity = lerp(0.75, 0.98, blend); const LP = LIGHT[dir] || LIGHT.S; cSun1.setHex(LP[0]); cFog1.setHex(LP[1]); sun.color.copy(cSun0).lerp(cSun1, blend);
      hemi.intensity = lerp(0.62, 0.5, blend); hemi.color.copy(cSky0).lerp(cSky1, blend); hemi.groundColor.copy(cGr0).lerp(cGr1, blend);
      const p = player.position; sun.position.set(p.x + lerp(SUN0[0], SUN1[0], blend), lerp(SUN0[1], SUN1[1], blend), p.z + lerp(SUN0[2], SUN1[2], blend));
      if (scene.fog) { const n0 = camWide ? 70 : 34, f0 = camWide ? 170 : 85; scene.fog.near = lerp(n0, n0 * 1.6, blend); scene.fog.far = lerp(f0, f0 * 1.5, blend); scene.fog.color.copy(cFog0).lerp(cFog1, blend * 0.8); }
    }
  }
  return {
    patchGround, patchWater, tick,
    active: () => blend > 0.001,
    yaw: () => yaw * blend,   // lệch hướng camera (xoay nhẹ)
    pitch: (cur) => lerp(cur, PITCH, blend),   // góc nghiêng cố định
    drag: (dx) => { if (blend > 0.5) yaw = Math.max(-YAW_MAX, Math.min(YAW_MAX, yaw - dx * 0.006)); },
    distK: () => { if (blend <= 0) return 1; return Math.tan(FOV0 * Math.PI / 360) / Math.tan(camera.fov * Math.PI / 360); }   // lùi camera bù góc nhìn hẹp → khung hình giữ cỡ
  };
})();
