/* EnglishVerse – HUD chân dung (trên trái), hào quang Harmony, thanh máu + nhãn quái, hướng dẫn lần đầu vào vùng hoang dã.
   HTML của HUD nằm trong index.html (#evHud); file này chỉ cập nhật dữ liệu. Dùng khung giao diện parts/ui/theme.js. */
const evEl = id => document.getElementById(id);
function evHudUpdate() {   // gọi từ renderHud() (thành phố) và hudTick() (vùng hoang dã, ~10 lần/giây)
  if (!evEl("evHud")) return;
  const L = (typeof save !== "undefined" && save.level) || 1;
  const wild = typeof CB !== "undefined" && CB.on;
  // máu
  let hp, H;
  if (typeof hpNow === "function" && typeof hpMax === "function") { hp = hpNow(); H = hpMax(); } else { hp = save.energy; H = 100; }
  evEl("hHp").firstElementChild.style.width = Math.max(0, Math.min(100, hp / H * 100)) + "%"; evEl("hHp").lastElementChild.textContent = "❤️ " + Math.round(hp) + "/" + H;
  // mana
  if (wild) { const M = typeof mpMax === "function" ? mpMax() : 100; evEl("hMp").firstElementChild.style.width = Math.max(0, Math.min(100, CB.mp / M * 100)) + "%"; evEl("hMp").lastElementChild.textContent = "💧 " + Math.round(CB.mp) + "/" + M; }
  // kinh nghiệm trong cấp hiện tại
  let k = 1; if (typeof XP_CUM !== "undefined" && L < 100) k = Math.max(0, Math.min(1, (score - XP_CUM[L]) / ((XP_CUM[L + 1] - XP_CUM[L]) || 1)));
  const gate = typeof levelGate === "function" ? levelGate() : null, blocked = !!(gate && gate.blocked), near = !!(gate && (gate.blocked || gate.near));
  const xb = evEl("hXp"); xb.classList.toggle("lock", blocked); xb.firstElementChild.style.width = k * 100 + "%";
  xb.lastElementChild.textContent = (blocked ? "🔒 " : "") + "EXP " + Math.floor(k * 100) + "%";
  const gc = evEl("gateChip");
  if (near && gate.missing > 0) { gc.style.display = "block"; gc.textContent = "🔒 Need " + gate.missing + " more ⭐⭐ card" + (gate.missing > 1 ? "s" : "") + " ›"; } else gc.style.display = "none";
  // xu, sức mạnh, cấp
  evEl("coins").textContent = save.coins;
  evEl("hPow").textContent = "";   // Lực chiến chỉ hiện trong túi đồ (chủ dự án 16/11)
  evEl("lvl").textContent = "Lv." + L;
  // Harmony
  const hm = evEl("hHm"), now = performance.now();
  if (wild && now < CB.harmonyUntil) { hm.style.display = "inline-block"; hm.textContent = "🎼 ×2 · " + Math.ceil((CB.harmonyUntil - now) / 1000) + "s"; } else hm.style.display = "none";
}
if (evEl("gateChip")) evEl("gateChip").onclick = () => { if (typeof openLevelPanel === "function") openLevelPanel(); };

/* ---------- hào quang Harmony quanh nhân vật ---------- */
let evAura = null;
function evGlowTex(rgb) {
  const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
  const r = g.createRadialGradient(32, 32, 2, 32, 32, 32); r.addColorStop(0, "rgba(" + rgb + ",.95)"); r.addColorStop(.5, "rgba(" + rgb + ",.35)"); r.addColorStop(1, "rgba(" + rgb + ",0)");
  g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
}
function evNoteTex() {
  const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
  g.font = "bold 52px system-ui,sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "#b07cff"; g.shadowBlur = 10; g.fillStyle = "#f1e4ff"; g.fillText("♪", 32, 34);
  return new THREE.CanvasTexture(c);
}
function evMakeAura() {
  const g = new THREE.Group(), tex = evGlowTex("176,124,255");
  const mk = (map, blend) => new THREE.SpriteMaterial({ map, transparent: true, blending: blend, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.CircleGeometry(1.3, 24), new THREE.MeshBasicMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.06; g.add(ring);
  const body = new THREE.Sprite(mk(tex, THREE.AdditiveBlending)); body.scale.set(3.2, 3.6, 1); body.position.y = 1.0; g.add(body);
  const nt = evNoteTex(), notes = [];
  for (let i = 0; i < 3; i++) { const s = new THREE.Sprite(mk(nt, THREE.NormalBlending)); s.scale.set(0.5, 0.5, 1); s.visible = false; g.add(s); notes.push(s); }
  g.userData = { ring, body, notes }; g.visible = false; player.add(g); return g;
}
function evHarmonyFx() {   // gọi mỗi khung hình từ hudTick
  if (typeof player === "undefined" || typeof THREE === "undefined") return;
  const now = performance.now(), act = now < CB.harmonyUntil, near = !act && CB.harmony >= 75;
  if (!evAura) { if (!act && !near) return; evAura = evMakeAura(); }
  const u = evAura.userData, t = now / 1000;
  evAura.visible = act || near;
  const k = act ? 0.75 + 0.25 * Math.sin(t * 5) : 0;
  u.ring.visible = u.body.visible = act; u.ring.material.opacity = 0.55 * k + 0.2; u.body.material.opacity = 0.45 * k + 0.1; u.ring.scale.setScalar(1 + 0.08 * Math.sin(t * 5));
  u.notes.forEach((s, i) => { s.visible = near || act; const a = t * 2 + i * 2.094; s.position.set(Math.cos(a) * 0.95, 1.3 + 0.5 * Math.sin(t * 3 + i * 2), Math.sin(a) * 0.95); });
}
function evHarmonyOff() { if (evAura) evAura.visible = false; }

/* ---------- thanh máu + nhãn tên quái (1 sprite, vẽ lại khi máu đổi) ---------- */
function evLvColor(ml) {   // trắng: thấp hơn / ngang / hơn chút (≤ +4) · cam: +5…+7 · đỏ 💀: ≥ +8 (đánh chỉ còn 30%)
  const d = ml - (save.level || 1);
  if (d <= 4) return ["#ffffff", ""]; if (d <= 7) return ["#ff9a3c", ""]; return ["#ff5a5f", " 💀"];
}
function evMonTag(M) {   // tạo lần đầu rồi chỉ vẽ lại khi máu / cấp đổi. Dòng 1: [icon loại bài quái sợ] tên nhỏ + Lv to · dòng 2: thanh máu
  const hpK = Math.max(0, Math.min(40, Math.round(M.hp / (M.hpMax || 1) * 40))), key = hpK + "|" + M.lv + "|" + (save.level || 1);
  if (M.tagKey === key) return M.tag; M.tagKey = key;
  if (!M.tagC) { M.tagC = document.createElement("canvas"); M.tagC.width = 320; M.tagC.height = 120; M.tagTex = new THREE.CanvasTexture(M.tagC); M.tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: M.tagTex, depthTest: false })); M.tag.scale.set(2.2, 2.2 * 120 / 320, 1); M.tag.position.y = 2.5; }
  const g = M.tagC.getContext("2d"), [col, skull] = evLvColor(M.lv), weak = typeof TASK_ICON !== "undefined" ? TASK_ICON[M.T.weak] : "";
  g.clearRect(0, 0, 320, 120); g.textBaseline = "middle"; g.textAlign = "left";
  const F1 = "bold 34px system-ui,sans-serif", F2 = "600 22px system-ui,sans-serif", F3 = "900 40px system-ui,sans-serif";
  const a = weak + " ", b = M.T.name + " ", c = "Lv." + M.lv + skull;
  g.font = F1; const wa = g.measureText(a).width; g.font = F2; const wb = g.measureText(b).width; g.font = F3; const wc = g.measureText(c).width;
  let x = Math.max(4, 160 - (wa + wb + wc) / 2);
  g.shadowColor = "rgba(0,0,0,.9)"; g.shadowBlur = 6; g.lineWidth = 5; g.strokeStyle = "rgba(0,0,0,.75)";
  g.font = F1; g.fillText(a, x, 40); x += wa;
  g.font = F2; g.strokeText(b, x, 42); g.fillStyle = col; g.fillText(b, x, 42); x += wb;
  g.font = F3; g.strokeText(c, x, 40); g.fillStyle = col; g.fillText(c, x, 40);
  g.shadowBlur = 0;
  g.fillStyle = "rgba(0,0,0,.7)"; g.fillRect(50, 70, 220, 16); g.fillStyle = "#ff4f5e"; g.fillRect(52, 72, 216 * hpK / 40, 12);
  g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(52, 72, 216 * hpK / 40, 3);
  M.tagTex.needsUpdate = true; return M.tag;
}

/* ---------- hướng dẫn lần đầu vào vùng hoang dã (5 bước) ---------- */
const EV_TUT = [
  ["#stick", "Move with the stick.", "Cần điều khiển để đi lại."],
  ["#cbAtk", "Tap ⚔️ to hit.", "Chạm ⚔️ để đánh thường."],
  ["#cbBtns", "HOLD a skill: read the card and speak. Let go to cast. A quick tap only shows the card and reads it to you.", "GIỮ nút chiêu: đọc đề và nói luôn, thả tay là ra chiêu. Chạm nhanh chỉ để xem đề và nghe đọc mẫu."],
  ["#evHud", "Watch your ❤️ health and 💧 mana.", "Theo dõi máu ❤️ và mana 💧."],
  ["#cbFood", "Quick slots: food, mana drinks, antidote.", "Ô dùng nhanh: đồ ăn, nước mana, thuốc giải."]
];
let evTutEl = null;
function evTutorial() {
  if (evTutEl || save.combat.tut) return;
  let i = 0; const o = evTutEl = document.createElement("div"); o.id = "evTut";
  o.innerHTML = '<div class="spot"></div><div class="ev-panel cap"><div class="ev-in"><div class="en"></div><div class="vi"></div><div class="nx"></div></div></div><button class="ev-btn alt skip">Bỏ qua · Skip</button>';
  document.body.appendChild(o);
  const done = () => { save.combat.tut = 1; try { saveNow(); } catch (e) {} o.remove(); evTutEl = null; };
  const show = () => {
    const [sel, en, vi] = EV_TUT[i], el = document.querySelector(sel), r = el && el.getBoundingClientRect();
    if (!r || !r.width) { if (++i >= EV_TUT.length) done(); else show(); return; }
    const s = o.querySelector(".spot"), p = 8; s.style.cssText = "left:" + (r.left - p) + "px;top:" + (r.top - p) + "px;width:" + (r.width + 2 * p) + "px;height:" + (r.height + 2 * p) + "px";
    const cap = o.querySelector(".cap"), low = r.top > innerHeight / 2; cap.style.top = low ? "110px" : "auto"; cap.style.bottom = low ? "auto" : "40px";
    o.querySelector(".en").textContent = en; o.querySelector(".vi").textContent = vi; o.querySelector(".nx").textContent = (i + 1) + "/" + EV_TUT.length + " · chạm để tiếp tục / tap to continue";
  };
  o.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); if (e.target.classList.contains("skip")) { done(); return; } if (++i >= EV_TUT.length) done(); else show(); });
  show();
}

/* ---------- chân dung trên thanh máu = đầu nhân vật người chơi (25/11) ---------- */
let evPR = null;
function evPortrait(model) {   // model = mô hình đang hiện của người chơi; chụp 1 lần mỗi khi đổi ngoại hình
  const span = document.querySelector("#evHud .hex span"); if (!span || !model || !THREE.SkeletonUtils) return;
  try {
    if (!evPR) { const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setSize(128, 128); r.setPixelRatio(1);
      const s = new THREE.Scene(); s.add(new THREE.HemisphereLight(0xffffff, 0x8890a0, 1.05)); const d = new THREE.DirectionalLight(0xffffff, 0.55); d.position.set(1, 1.5, 2); s.add(d);
      evPR = { r, s, cam: new THREE.PerspectiveCamera(24, 1, 0.01, 20) }; }
    const c = THREE.SkeletonUtils.clone(model); c.position.set(0, 0, 0); c.rotation.set(0, 0, 0); evPR.s.add(c); c.updateMatrixWorld(true);
    let head = null; c.traverse(o => { if (!head && o.isBone && /^head$/i.test(o.name)) head = o; });
    const box = new THREE.Box3().setFromObject(c), H = box.max.y - box.min.y, p = new THREE.Vector3();
    if (head) head.getWorldPosition(p); else p.set(0, box.max.y - H * 0.15, 0);
    const top = box.max.y, cy = (p.y + top) / 2 - H * 0.005, span2 = (top - p.y) * 1.2;
    evPR.cam.position.set(0, cy + span2 * 0.05, span2 / (2 * Math.tan(12 * Math.PI / 180)) + 0.2); evPR.cam.lookAt(0, cy, 0);
    evPR.r.render(evPR.s, evPR.cam); evPR.s.remove(c);
    span.innerHTML = '<img src="' + evPR.r.domElement.toDataURL("image/png") + '" alt="" style="width:100%;height:100%;object-fit:cover;display:block">';
    span.style.cssText = "display:block;width:100%;height:100%;overflow:hidden;border-radius:inherit";
  } catch (e) {}
}
