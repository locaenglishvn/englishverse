/* EnglishVerse – ĐIỀU KIỆN LÊN CẤP = KINH NGHIỆM + KIẾN THỨC (chủ dự án chốt 16/11, docs/design/playtest-1611.html mục 6).
   - Từ Lv.3: muốn lên cấp tiếp phải có, với TỪNG loại thẻ (💬 câu nói, ❓ câu hỏi, 📦 từ vựng), số thẻ đạt ⭐⭐ ≥ 70% hạn mức thẻ của cấp hiện tại.
   - Chưa đủ thẻ thì EXP dừng ở 100% (không tích luỹ) → phải về thành sưu tầm / luyện thẻ.
   - Hạn mức thẻ theo cấp (cardCap, index.html) chặn chiều ngược lại: sưu tầm mãi mà không lên cấp thì đầy.
   Hàm toàn cục: levelGate() · gateRows() · clampXp() · openLevelPanel() · levelGateText() · gateHint() · onMastery(id)
   Dùng biến/hàm của index.html: save, score, owned, stars, cardCap, CARD_TYPES, LESSONS, VOCAB, CITY, npcInfo, hasCard, guideTo, flash, player, room;
   của engine.js: XP_CUM. */
const GATE_FROM = 3, GATE_PCT = 0.7;
function gateNeed(type, L) { return L < GATE_FROM ? 0 : Math.round(GATE_PCT * cardCap(type, L)); }
function gateRows(L) {
  L = L || save.level || 1;
  return ["p", "q", "v"].map(t => ({ t, need: gateNeed(t, L), have: owned.filter(id => id[0] === t && stars(id) >= 2).length, own: owned.filter(id => id[0] === t).length, cap: cardCap(t, L) }));
}
function xpSpan() { const L = save.level || 1; if (typeof XP_CUM === "undefined" || L >= 100) return null; return [XP_CUM[L], XP_CUM[L + 1]]; }
function levelGate() {
  const L = save.level || 1, sp = xpSpan(); if (!sp) return null;
  const rows = gateRows(L), missing = rows.reduce((a, r) => a + Math.max(0, r.need - r.have), 0);
  const frac = Math.max(0, Math.min(1, (score - sp[0]) / (sp[1] - sp[0])));
  return { blocked: missing > 0 && score >= sp[1], near: missing > 0 && frac >= 0.8, missing, to: L + 1, rows, frac };
}
function clampXp() {   // EXP không vượt quá mốc cấp kế tiếp khi còn thiếu thẻ
  const g = levelGate(); if (!g || !g.missing) return;
  const sp = xpSpan(); if (score > sp[1]) { score = sp[1]; save.xp = score; }
}

/* ---- tìm nơi gần nhất còn thẻ chưa có (để dẫn đường) ---- */
function cardSource(t) {
  const L = save.level || 1, p = room ? room.P.doorPos : player.position, list = [];
  if (t === "v") {
    Object.keys(VOCAB).forEach(pl => { const P = CITY.find(c => c.id === pl); if (!P || !P.doorPos) return;
      const n = VOCAB[pl].filter(v => !hasCard("v:" + v.w)).length; if (n) list.push({ name: P.name, x: P.doorPos.x, z: P.doorPos.z, n, label: P.name + " (" + n + " new things to ask about)" }); });
  } else {
    LESSONS.forEach(N => { if ((N.minLv || 0) > L) return;
      const n = N.steps.filter(s => t === "p" ? s.card && !hasCard("p:" + s.card.w) : s.q && !hasCard("q:" + s.q.w)).length; if (!n) return;
      const P = N.inPlace, I = npcInfo(N.name);
      list.push({ name: I.short, npc: true, inName: P && P.name, x: P ? P.doorPos.x : N.x, z: P ? P.doorPos.z : N.z, n, label: I.short + (P ? " · " + P.name : "") }); });
  }
  list.forEach(o => o.d = Math.hypot(o.x - p.x, o.z - p.z));
  return list.sort((a, b) => a.d - b.d)[0] || null;
}

/* ---- bảng "Lên cấp cần gì" ---- */
function levelPanelHtml() {
  const g = levelGate(), L = save.level || 1;
  if (!g) return "<div class='ev-title'>Lv.100 · max level</div>";
  const vi = viHelp();   // tiếng Việt chỉ là gợi ý phụ, hiện 3 lần mở bảng đầu tiên
  if (L < GATE_FROM) return "<div class='ev-title'>⬆️ Level up to Lv." + g.to + "</div><p style='font-size:14px'>Just fight monsters to get EXP. From Lv." + GATE_FROM + " you also need cards with ⭐⭐.</p>";
  let h = "<div class='ev-title' style='display:flex;justify-content:space-between;gap:8px'><span>" + (g.blocked ? "🔒 " : "⬆️ ") + "To reach Lv." + g.to + " you need</span><span style='color:var(--ev-xp);font-size:13px'>EXP " + Math.round(g.frac * 100) + "%</span></div>";
  g.rows.forEach(r => {
    const T = CARD_TYPES[r.t], done = r.have >= r.need, col = done ? "var(--ev-ok)" : r.own < r.need ? "var(--ev-bad)" : "var(--ev-gold)";
    h += "<div style='background:var(--ev-panel);padding:9px 11px;margin-top:8px'><div style='display:flex;justify-content:space-between;font-weight:700;font-size:14px'><span>" + T.icon + " " + T.name + " with ⭐⭐</span><span style='color:" + col + "'>" + r.have + " / " + r.need + (done ? " ✓" : "") + "</span></div>" +
      "<div class='ev-bar " + (done ? "xp" : "know") + "' style='height:8px;margin-top:5px'><i style='width:" + Math.min(100, r.need ? r.have / r.need * 100 : 100) + "%'></i></div>";
    if (!done) {
      const newN = Math.max(0, r.need - r.own), prac = r.need - r.have - newN;
      let tip = "";
      if (newN > 0) { const s = cardSource(r.t); tip += "You have " + r.own + ". Get <b>" + newN + " new card" + (newN > 1 ? "s" : "") + "</b> in the city, then practise them." + (s ? " Nearest: " + s.label + "." : "");
        h += "<div style='font-size:12.5px;color:var(--ev-mut);margin-top:5px'>" + tip + (vi ? "<br><i>Về thành nói chuyện với NPC / hỏi đồ vật để có thêm " + newN + " thẻ mới, rồi luyện lên ⭐⭐.</i>" : "") + "</div>" + (s ? "<button class='ev-btn' style='margin-top:6px;font-size:12px;padding:5px 12px' data-go='" + r.t + "'>📍 Show me the way</button>" : ""); }
      else h += "<div style='font-size:12.5px;color:var(--ev-mut);margin-top:5px'>Practise <b>" + prac + " more card" + (prac > 1 ? "s" : "") + "</b> to ⭐⭐: fight monsters, talk to NPCs again, or ask about things again." + (vi ? "<br><i>Đủ thẻ rồi, chỉ cần luyện thêm " + prac + " thẻ lên ⭐⭐ (đánh quái là nhanh nhất).</i>" : "") + "</div>";
    }
    h += "</div>";
  });
  h += "<div style='font-size:12px;color:var(--ev-mut);margin-top:8px'>Card limit at Lv." + L + ": 💬 " + g.rows[0].cap + " · ❓ " + g.rows[1].cap + " · 📦 " + g.rows[2].cap + ". Level up to collect more.</div>";
  return h;
}
function openLevelPanel() {
  let o = document.getElementById("lvPanel");
  if (!o) { o = document.createElement("div"); o.id = "lvPanel"; o.style.cssText = "position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;background:rgba(5,8,20,.55);padding:16px";
    o.innerHTML = "<div class='ev-panel' style='width:min(420px,100%)'><div class='ev-in' style='max-height:80vh;overflow:auto'><div id='lvBody'></div><div style='text-align:right;margin-top:10px'><button class='ev-btn alt' id='lvClose'>Close</button></div></div></div>";
    document.body.appendChild(o);
    o.addEventListener("pointerdown", e => { if (e.target === o) o.style.display = "none"; });
    o.querySelector("#lvClose").onclick = () => o.style.display = "none"; }
  o.querySelector("#lvBody").innerHTML = levelPanelHtml(); save.viSeen = save.viSeen || {}; save.viSeen.lvPanel = (save.viSeen.lvPanel || 0) + 1;
  o.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { const s = cardSource(b.dataset.go); o.style.display = "none"; if (s && !room) guideTo(s); else if (s) flash("🧭 Go outside, then go to " + s.label); });
  o.style.display = "flex";
}
function viHelp() { return ((save.viSeen && save.viSeen.lvPanel) || 0) < 3; }
function levelGateText() {   // 1 dòng tóm tắt cho bảng kỹ năng
  const g = levelGate(); if (!g || !g.missing || (save.level || 1) < GATE_FROM) return "";
  return "<span style='color:var(--ev-know);font-weight:700'>" + (g.blocked ? "🔒" : "⬆️") + " Lv." + g.to + ": need " + g.missing + " more ⭐⭐ card" + (g.missing > 1 ? "s" : "") + " ›</span>";
}

/* ---- nhắc người mới ở cổng vùng hoang dã (không chặn) ---- */
let gateHintShown = false;
function gateHint() {
  if (gateHintShown || owned.length >= 6 || (save.level || 1) > 4) return; gateHintShown = true;
  setTimeout(() => flash("💡 Tip: talk to people in the city first!<div style='font-size:13px;font-weight:400'>Bạn mới có " + owned.length + " thẻ. Nói chuyện với vài người trong thành để có câu dùng khi đánh quái nhé.</div>"), 2600);
}

/* ---- báo tiến độ khi một thẻ vừa lên ⭐⭐ ---- */
function onMastery(id) {
  if (stars(id) !== 2) return;
  const t = id[0], L = save.level || 1, r = gateRows(L).find(x => x.t === t), T = CARD_TYPES[t];
  let d = document.getElementById("masteryToast");
  if (!d) { d = document.createElement("div"); d.id = "masteryToast"; d.style.cssText = "position:fixed;left:50%;top:calc(120px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:25;pointer-events:none;transition:opacity .3s"; document.body.appendChild(d); }
  d.innerHTML = "<span class='ev-tag' style='--c:#7340c4;font-size:12px;text-transform:none;letter-spacing:0'>" + T.icon + " " + id.slice(2) + " ⭐⭐" + (L >= GATE_FROM ? " (" + r.have + "/" + r.need + ")" : "") + "</span>";
  d.style.opacity = 1; clearTimeout(d._t); d._t = setTimeout(() => d.style.opacity = 0, 2200);
}

/* ---- người mới: Captain Echo TỰ chào và tặng thẻ khởi đầu ngay khi vào game lần đầu ---- */
(function echoIntro() {
  const tryStart = () => {
    if (typeof save === "undefined" || !save || save.metEcho) return;
    const E = LESSONS.find(L => /^Captain Echo/.test(L.name));
    if (!E || owned.some(id => E.steps.some(s => s.card && id === "p:" + s.card.w))) { save.metEcho = 1; return; }
    if (window.EV_LOCKED || creating || room || maze || talking || !document.getElementById("talk")) return setTimeout(tryStart, 1500);
    save.metEcho = 1; saveNow();
    player.position.set(E.x - 0.5, 0, E.z + 2.6); camAngle = 0; camSnap = true;
    near = E; document.getElementById("talk").onclick();
  };
  window.addEventListener("load", () => setTimeout(tryStart, 2500));
})();

/* ---- 📚 BẢNG DẠNG BÀI (chủ dự án 17/11): dạng đã mở sáng, dạng chưa mở mờ + điều kiện mở khoá. Mở từ 🌟 Skills ---- */
function openChallenges() {
  let o = document.getElementById("chPanel");
  if (!o) { o = document.createElement("div"); o.id = "chPanel"; o.style.cssText = "position:fixed;inset:0;z-index:31;display:flex;align-items:center;justify-content:center;background:rgba(5,8,20,.55);padding:16px";
    o.innerHTML = "<div class='ev-panel' style='width:min(420px,100%)'><div class='ev-in' style='max-height:82vh;overflow:auto'><div id='chBody'></div><div style='text-align:right;margin-top:10px'><button class='ev-btn alt' id='chClose'>Close</button></div></div></div>";
    document.body.appendChild(o); o.addEventListener("pointerdown", e => { if (e.target === o) o.style.display = "none"; }); o.querySelector("#chClose").onclick = () => o.style.display = "none"; }
  const L = save.level || 1, st = (save.combat && save.combat.deck) || {};
  const open = CHALLENGES.filter(c => challengeOpen(c.t)).length;
  let h = "<div class='ev-title'>📚 Challenges · " + open + "/" + CHALLENGES.length + "</div><div style='font-size:12.5px;color:var(--ev-mut);margin:2px 0 8px'>Monsters ask you these. New ones open as you level up.</div>";
  CHALLENGES.forEach(c => {
    const on = challengeOpen(c.t), col = TASK_COL[c.t], s = st[c.t] || { n: 0, good: 0 }, nm = TASK_NAME[c.t].split(" · ")[0];
    const lock = c.need === "v" && L >= c.lv ? "Get a 📦 vocab card first (ask about a thing in the city)" : "Unlocks at Lv." + c.lv;
    h += "<div style='display:flex;gap:10px;align-items:center;background:var(--ev-panel);padding:9px 10px;margin-top:6px;" + (on ? "box-shadow:inset 3px 0 0 " + col : "opacity:.55;filter:grayscale(1)") + "'>" +
      "<div style='font-size:26px;width:34px;text-align:center'>" + (on ? TASK_ICON[c.t] : "🔒") + "</div><div style='flex:1;min-width:0'>" +
      "<span class='ev-tag' style='--c:" + (on ? col : "#3a4677") + "'>" + nm + "</span>" +
      (on ? "<div style='font-size:13px;margin-top:4px'>" + c.do + "</div><div style='font-size:12px;color:var(--ev-mut)'>" + c.ex + "</div>" +
            (s.n ? "<div style='font-size:11.5px;color:var(--ev-mut);margin-top:2px'>Good " + s.good + " / " + s.n + " times</div>" : "")
          : "<div style='font-size:12.5px;margin-top:4px;color:var(--ev-mut)'>🔒 " + lock + "</div>") + "</div></div>";
  });
  o.querySelector("#chBody").innerHTML = h; o.style.display = "flex";
}
function onLevelUp(L) {   // gọi từ checkLevel (index.html) mỗi khi lên cấp: báo dạng bài mới mở
  if (typeof CHALLENGES === "undefined") return;
  CHALLENGES.filter(c => c.lv === L && challengeOpen(c.t)).forEach((c, i) => setTimeout(() => flash("📚 New challenge: " + TASK_ICON[c.t] + " " + TASK_NAME[c.t].split(" · ")[0] + "<div style='font-size:13px;font-weight:400'>" + c.do + "</div>", 4000), 3200 + i * 4200));
}
