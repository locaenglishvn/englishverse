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
      const n = VOCAB[pl].filter(v => !hasCard("v:" + v.w)).length; if (n) list.push({ name: P.name, x: P.doorPos.x, z: P.doorPos.z, n, label: P.name + " (" + n + " đồ vật chưa hỏi)" }); });
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
  if (!g) return "<div class='ev-title'>Lv.100 · cấp tối đa</div>";
  if (L < GATE_FROM) return "<div class='ev-title'>⬆️ Lên Lv." + g.to + "</div><p style='font-size:14px'>Chỉ cần đánh quái lấy kinh nghiệm. Từ Lv." + GATE_FROM + " sẽ cần thêm thẻ đạt ⭐⭐.</p>";
  let h = "<div class='ev-title' style='display:flex;justify-content:space-between;gap:8px'><span>" + (g.blocked ? "🔒 " : "⬆️ ") + "Để lên Lv." + g.to + " bạn cần</span><span style='color:var(--ev-xp);font-size:13px'>EXP " + Math.round(g.frac * 100) + "%</span></div>";
  g.rows.forEach(r => {
    const T = CARD_TYPES[r.t], done = r.have >= r.need, col = done ? "var(--ev-ok)" : r.own < r.need ? "var(--ev-bad)" : "var(--ev-gold)";
    h += "<div style='background:var(--ev-panel);padding:9px 11px;margin-top:8px'><div style='display:flex;justify-content:space-between;font-weight:700;font-size:14px'><span>" + T.icon + " " + T.vi + " đạt ⭐⭐</span><span style='color:" + col + "'>" + r.have + " / " + r.need + (done ? " ✓" : "") + "</span></div>" +
      "<div class='ev-bar " + (done ? "xp" : "know") + "' style='height:8px;margin-top:5px'><i style='width:" + Math.min(100, r.need ? r.have / r.need * 100 : 100) + "%'></i></div>";
    if (!done) {
      const newN = Math.max(0, r.need - r.own), prac = r.need - r.have - newN;
      let tip = "";
      if (newN > 0) { const s = cardSource(r.t); tip += "Bạn có " + r.own + " thẻ: cần <b>" + newN + " thẻ mới</b>" + (prac > 0 ? " và luyện thêm " + prac + " thẻ" : " rồi luyện lên ⭐⭐") + "." + (s ? " Gần nhất: " + s.label + "." : "");
        h += "<div style='font-size:12.5px;color:var(--ev-mut);margin-top:5px'>" + tip + "</div>" + (s ? "<button class='ev-btn' style='margin-top:6px;font-size:12px;padding:5px 12px' data-go='" + r.t + "'>📍 Dẫn đường</button>" : ""); }
      else h += "<div style='font-size:12.5px;color:var(--ev-mut);margin-top:5px'>Đủ thẻ rồi, chỉ cần <b>luyện thêm " + prac + " thẻ</b> lên ⭐⭐: đánh quái (đề sẽ ra đúng thẻ ít sao), nói chuyện lại với NPC, hoặc hỏi lại đồ vật.</div>";
    }
    h += "</div>";
  });
  h += "<div style='font-size:12px;color:var(--ev-mut);margin-top:8px'>Hạn mức thẻ ở Lv." + L + ": 💬 " + g.rows[0].cap + " · ❓ " + g.rows[1].cap + " · 📦 " + g.rows[2].cap + ". Lên cấp thì được sưu tầm thêm.</div>";
  return h;
}
function openLevelPanel() {
  let o = document.getElementById("lvPanel");
  if (!o) { o = document.createElement("div"); o.id = "lvPanel"; o.style.cssText = "position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;background:rgba(5,8,20,.55);padding:16px";
    o.innerHTML = "<div class='ev-panel' style='width:min(420px,100%)'><div class='ev-in' style='max-height:80vh;overflow:auto'><div id='lvBody'></div><div style='text-align:right;margin-top:10px'><button class='ev-btn alt' id='lvClose'>Đóng</button></div></div></div>";
    document.body.appendChild(o);
    o.addEventListener("pointerdown", e => { if (e.target === o) o.style.display = "none"; });
    o.querySelector("#lvClose").onclick = () => o.style.display = "none"; }
  o.querySelector("#lvBody").innerHTML = levelPanelHtml();
  o.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { const s = cardSource(b.dataset.go); o.style.display = "none"; if (s && !room) guideTo(s); else if (s) flash("🧭 Ra khỏi nhà rồi đi tới " + s.label); });
  o.style.display = "flex";
}
function levelGateText() {   // 1 dòng tóm tắt cho bảng kỹ năng
  const g = levelGate(); if (!g || !g.missing || (save.level || 1) < GATE_FROM) return "";
  return "<span style='color:var(--ev-know);font-weight:700'>" + (g.blocked ? "🔒" : "⬆️") + " Lên Lv." + g.to + ": còn thiếu " + g.missing + " thẻ ⭐⭐ ›</span>";
}

/* ---- nhắc người mới ở cổng vùng hoang dã (không chặn) ---- */
let gateHintShown = false;
function gateHint() {
  if (gateHintShown || owned.length >= 6 || (save.level || 1) > 4) return; gateHintShown = true;
  setTimeout(() => flash("💡 Tip: talk to people in the city first!<div style='font-size:13px;font-weight:400'>Bạn mới có " + owned.length + " thẻ. Nói chuyện với Captain Echo và vài người trong thành để có câu dùng khi đánh quái nhé.</div>"), 2600);
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
