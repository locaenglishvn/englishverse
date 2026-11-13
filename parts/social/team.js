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
}
function nameOf(id) { return (others[id] && others[id].n) || "Friend"; }
function onSocialSend(t) {   // câu mình vừa nói/gửi
  if (!online || typeof chan === "undefined") return;
  if (/join my team|let.?s team up/i.test(t)) Object.keys(others).forEach(id => { const o = others[id]; if (o.g.position.distanceTo(player.position) < 12) chan.send({ type: "broadcast", event: "team", payload: { id: myId, to: id, k: "inv" } }); });
  if (/^(sure|yes|ok|okay)/i.test(t) && TEAM.invite && performance.now() - TEAM.invite.at < 20000) acceptInvite();
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
