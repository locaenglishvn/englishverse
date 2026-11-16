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
  if (near && gate.missing > 0) { gc.style.display = "block"; gc.textContent = "🔒 Thiếu " + gate.missing + " thẻ ⭐⭐ ›"; } else gc.style.display = "none";
  // xu, sức mạnh, cấp
  evEl("coins").textContent = save.coins;
  evEl("hPow").textContent = typeof powerScore === "function" ? "⚔️ " + powerScore() : "";
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
function evLvColor(ml) {
  const d = ml - (save.level || 1);
  if (d <= -3) return ["#5fe08a", ""]; if (Math.abs(d) <= 2) return ["#ffd43b", ""]; if (d <= 7) return ["#ff9a3c", ""]; return ["#ff5a5f", " 💀"];
}
function evMonTag(M) {   // tạo lần đầu rồi chỉ vẽ lại khi máu / cấp đổi
  const hpK = Math.max(0, Math.min(40, Math.round(M.hp / (M.hpMax || 1) * 40))), key = hpK + "|" + M.lv + "|" + (save.level || 1);
  if (M.tagKey === key) return M.tag; M.tagKey = key;
  if (!M.tagC) { M.tagC = document.createElement("canvas"); M.tagC.width = 320; M.tagC.height = 120; M.tagTex = new THREE.CanvasTexture(M.tagC); M.tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: M.tagTex, depthTest: false })); M.tag.scale.set(2.4, 2.4 * 120 / 320, 1); M.tag.position.y = 2.4; }
  const g = M.tagC.getContext("2d"), [col, skull] = evLvColor(M.lv);
  g.clearRect(0, 0, 320, 120);
  g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(0, 4, 320, 44);
  g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = col; let sz = 32; const txt = M.T.icon + " " + M.T.name + " Lv." + M.lv + skull;
  do { g.font = "bold " + sz + "px system-ui,sans-serif"; sz -= 2; } while (g.measureText(txt).width > 304 && sz > 14); g.fillText(txt, 160, 27);
  g.fillStyle = "rgba(0,0,0,.7)"; g.fillRect(40, 56, 240, 20); g.fillStyle = "#ff4f5e"; g.fillRect(43, 59, 234 * hpK / 40, 14);
  g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(43, 59, 234 * hpK / 40, 4);
  g.fillStyle = "#ffd43b"; g.font = "bold 24px system-ui,sans-serif"; g.fillText("sợ " + (typeof TASK_ICON !== "undefined" ? TASK_ICON[M.T.weak] : ""), 160, 98);
  M.tagTex.needsUpdate = true; return M.tag;
}

/* ---------- hướng dẫn lần đầu vào vùng hoang dã (5 bước) ---------- */
const EV_TUT = [
  ["#stick", "Move with the stick.", "Cần điều khiển để đi lại."],
  ["#cbAtk", "Tap ⚔️ to hit.", "Chạm ⚔️ để đánh thường."],
  ["#cbBtns", "Tap a skill to see the card. HOLD it and speak. Let go to score.", "Chạm chiêu để xem đề, GIỮ nút để nói, thả tay là chấm."],
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
