/* EnglishVerse – LẬP ĐỘI + CHIÊU SONG TẤU (Duet) – giao tiếp giữa người chơi (docs/design/voice-combat.html mục 8).
   - Mời: nói / chọn câu "Do you want to join my team?" khi đứng gần người khác (≤ 12 m) → người kia thấy lời mời, trả lời "Sure!" để vào đội.
   - Trong đội (tối đa 4): đánh quái ở vùng hoang dã gần đồng đội (≤ 40 m) được +20% kinh nghiệm.
   - Duet: tung chiêu thành công trong vòng 3 giây sau đồng đội → sát thương ×2 ("DUET!").
   Dùng kênh online `chan` của index.html (sự kiện "team", "cast"); không có mạng thì không làm gì. */
const TEAM = { mates: new Set(), invite: null, mateCastAt: 0 };
function teamWire(ch) {
  ch.on("broadcast", { event: "team" }, ({ payload: m }) => {
    if (m.to !== myId) return;
    if (m.k === "ok") { TEAM.mates.add(m.id); flash("🤝 " + nameOf(m.id) + " joined your team!"); speak("Welcome to the team!"); }
    if (m.k === "inv") showInvite(m.id);
  });
  ch.on("broadcast", { event: "cast" }, ({ payload: m }) => { if (TEAM.mates.has(m.id)) TEAM.mateCastAt = performance.now(); });
  tradeWire(ch);
  if (typeof combatWire === "function") combatWire(ch);   // quái chung nhiều người (parts/combat/engine.js)
}
function nameOf(id) { return (others[id] && others[id].n) || "Friend"; }
function onSocialSend(t) {   // câu mình vừa nói/gửi
  if (!online || typeof chan === "undefined") return;
  if (/join my team|let.?s team up/i.test(t)) Object.keys(others).forEach(id => { const o = others[id]; if (o.g.position.distanceTo(player.position) < 12) chan.send({ type: "broadcast", event: "team", payload: { id: myId, to: id, k: "inv" } }); });
  if (/^(sure|yes|ok|okay)/i.test(t) && TEAM.invite && performance.now() - TEAM.invite.at < 20000) acceptInvite();
  if (/^(sure|yes|ok|okay)/i.test(t) && TRADE.offer && performance.now() - TRADE.offer.at < 30000) acceptTrade();
  onTradeSay(t);
}
function showInvite(id) {
  if (TEAM.mates.size >= 3) return;
  TEAM.invite = { id, at: performance.now() };
  flash("🤝 " + nameOf(id) + ": “Do you want to join my team?”<div style='font-size:13px;font-weight:400'>Trả lời bằng 🗨️ Say: “Sure!” để vào đội</div>");
}
function acceptInvite() {
  const id = TEAM.invite.id; TEAM.invite = null; TEAM.mates.add(id);
  chan.send({ type: "broadcast", event: "team", payload: { id: myId, to: id, k: "ok" } });
  flash("🤝 You joined " + nameOf(id) + "’s team! +20% XP together"); if (typeof addHeart === "function") addHeart(3);
}
function teamNear() { let n = 0; TEAM.mates.forEach(id => { const o = others[id]; if (o && o.g.position.distanceTo(player.position) < 40) n++; }); return n; }
function teamXpMul() { return teamNear() ? 1.2 : 1; }
function teamOnCast() {   // mình vừa tung chiêu thành công → báo đồng đội; trả về hệ số Duet
  if (online && typeof chan !== "undefined" && TEAM.mates.size) chan.send({ type: "broadcast", event: "cast", payload: { id: myId } });
  if (performance.now() - TEAM.mateCastAt < 3000) { TEAM.mateCastAt = 0; popText("DUET! ×2", player.position, "#9b5de5"); if (typeof addHeart === "function") addHeart(1); return 2; }
  return 1;
}

/* ĐỔI ĐỒ giữa người chơi (an toàn trẻ em): người A nói "Can I swap my X for your Y?" khi đứng gần B (≤ 6 m)
   → B thấy lời đề nghị kèm độ hiếm + giá trị 2 món (cảnh báo nếu chênh lệch lớn) → B bấm ✅ (hoặc nói "Sure!") → A xác nhận lần 2 → đổi.
   Đồ Legendary / Maestro không đổi được. */
const TRADE = { offer: null, pending: null };
function tradeValue(id) { const it = ITEMS[id]; return it ? Math.max(1, it.price || 1) : 0; }
function tradable(id) { const it = ITEMS[id]; return it && save.items[id] && it.rarity !== "legendary" && !(it.weapon && it.weapon.maestro) && !it.decor; }
function tradeWire(ch) {
  ch.on("broadcast", { event: "trade" }, ({ payload: m }) => {
    if (m.to !== myId) return;
    if (m.k === "offer") {   // mình là B: tìm món "your Y" trong túi mình
      const mine = Object.keys(save.items).filter(tradable), want = heardItem(m.want, mine), give = m.give;
      if (!want || !ITEMS[give]) { chan.send({ type: "broadcast", event: "trade", payload: { id: myId, to: m.id, k: "no" } }); return; }
      TRADE.offer = { from: m.id, give, want, at: performance.now() }; showTrade();
    }
    if (m.k === "accept" && TRADE.pending && TRADE.pending.to === m.id) confirmTrade(m.want);
    if (m.k === "done" && TRADE.offer && TRADE.offer.from === m.id) { const o = TRADE.offer; TRADE.offer = null; takeItem(save.items, o.want); addItem(save.items, BAG_SIZE, o.give); saveNow(); flash("🔄 Swapped! " + ITEMS[o.want].icon + " → " + ITEMS[o.give].icon); if (typeof addHeart === "function") addHeart(2); }
    if (m.k === "no") flash("🙅 " + nameOf(m.id) + ": “Sorry, I can’t swap that.”");
  });
}
function onTradeSay(t) {   // "Can I swap my bamboo flute for your brass horn?"
  const m = t.toLowerCase().match(/(swap|trade) my (.+?) for your (.+?)\??$/); if (!m || !online) return;
  const give = heardItem(m[2], Object.keys(save.items).filter(tradable)); if (!give) { flash("🎒 You don’t have that item to swap."); return; }
  const near = Object.keys(others).filter(id => others[id].g.position.distanceTo(player.position) < 6).sort((a, b) => others[a].g.position.distanceTo(player.position) - others[b].g.position.distanceTo(player.position))[0];
  if (!near) { flash("👀 Stand next to a friend to swap. / Đứng gần bạn để đổi đồ."); return; }
  TRADE.pending = { to: near, give, at: performance.now() };
  chan.send({ type: "broadcast", event: "trade", payload: { id: myId, to: near, k: "offer", give, want: m[3] } });
}
function showTrade() {
  const o = TRADE.offer, a = ITEMS[o.give], b = ITEMS[o.want], va = tradeValue(o.give), vb = tradeValue(o.want), warn = vb > va * 2.5;
  const box = document.createElement("div"); box.className = "over"; box.style.display = "block";
  box.innerHTML = "<div class='box' style='padding:14px;max-width:380px;margin:18vh auto'><b>🔄 " + nameOf(o.from) + " wants to swap</b><div style='display:flex;gap:10px;justify-content:center;font-size:15px;margin:10px 0'><div>You get<br><span style='font-size:30px'>" + a.icon + "</span><br>" + a.name + "<br>" + (a.rarity || "") + " · ~" + va + "🪙</div><div style='font-size:26px;align-self:center'>⇄</div><div>You give<br><span style='font-size:30px'>" + b.icon + "</span><br>" + b.name + "<br>" + (b.rarity || "") + " · ~" + vb + "🪙</div></div>" +
    (warn ? "<div style='color:#c92a2a;font-size:13px'>⚠️ Món của bạn giá trị cao hơn nhiều. Bạn chắc chứ?</div>" : "") +
    "<div style='font-size:13px;opacity:.8'>Say “Sure!” or tap ✅ · Nói “Sure!” hoặc bấm ✅</div><button id='trOk' style='margin-top:8px;padding:8px 16px;border:0;border-radius:10px;background:#2f9e44;color:#fff;font-weight:700'>✅ Sure!</button> <button id='trNo' style='padding:8px 16px;border:0;border-radius:10px'>No, thanks</button></div>";
  document.body.appendChild(box); TRADE.box = box;
  box.querySelector("#trOk").onclick = () => acceptTrade();
  box.querySelector("#trNo").onclick = () => { chan.send({ type: "broadcast", event: "trade", payload: { id: myId, to: o.from, k: "no" } }); TRADE.offer = null; box.remove(); };
}
function acceptTrade() { const o = TRADE.offer; if (!o) return; if (TRADE.box) TRADE.box.remove(); chan.send({ type: "broadcast", event: "trade", payload: { id: myId, to: o.from, k: "accept", want: o.want } }); flash("⏳ Waiting for " + nameOf(o.from) + "…"); }
function confirmTrade(want) {   // mình là A: xác nhận lần 2 rồi đổi
  const P = TRADE.pending; if (!P || !ITEMS[want] || !save.items[P.give]) return;
  const box = document.createElement("div"); box.className = "over"; box.style.display = "block";
  box.innerHTML = "<div class='box' style='padding:14px;max-width:360px;margin:20vh auto'><b>🔄 Confirm swap?</b><p>" + ITEMS[P.give].icon + " " + ITEMS[P.give].name + " ⇄ " + ITEMS[want].icon + " " + ITEMS[want].name + "</p><button id='tcOk' style='padding:8px 16px;border:0;border-radius:10px;background:#2f9e44;color:#fff;font-weight:700'>✅ Yes, swap</button> <button id='tcNo' style='padding:8px 16px;border:0;border-radius:10px'>Cancel</button></div>";
  document.body.appendChild(box);
  box.querySelector("#tcNo").onclick = () => { TRADE.pending = null; box.remove(); };
  box.querySelector("#tcOk").onclick = () => { box.remove(); takeItem(save.items, P.give); addItem(save.items, BAG_SIZE, want); saveNow(); TRADE.pending = null;
    chan.send({ type: "broadcast", event: "trade", payload: { id: myId, to: P.to, k: "done" } }); flash("🔄 Swapped! " + ITEMS[P.give].icon + " → " + ITEMS[want].icon); if (typeof addHeart === "function") addHeart(2); };
}
