/* EnglishVerse – CHIẾN ĐẤU THỜI GIAN THỰC ở vùng hoang dã (giai đoạn A). Thiết kế: docs/design/voice-combat.html.
   Mô hình 3 lớp: KỸ NĂNG quyết định hiệu ứng · VOICE DECK quyết định bài nói · VŨ KHÍ quyết định sức mạnh (+ cộng hưởng loại bài).
   - Đánh thường (⚔️, không nói) yếu; chiêu (nói) mạnh: Perfect 100% · Good 70% · Weak 30% · Miss = hoàn ½ mana.
   - Đang nói: khiên −70% sát thương. Mana đầy lại sau ~8 giây. Hết máu: xám màn hình 2 giây, về cổng vùng.
   - Quái đi tuần, thấy người thì đuổi, đánh có vòng đỏ báo trước. Chết thì rơi xu + đồ xuống đất, tự đi tới nhặt.
   - Lên cấp tới Lv.100 ≈ 360 giờ (levelForXp). Quá 2 giờ chơi trong ngày: đánh quái không còn kinh nghiệm.
   Dùng hàm chung của index.html: $, save, saveNow, score, checkLevel, renderHud, flash, speak, match, norm, SR, practice, spokeOk,
   allCards, hasCard, stars, gear, isPoisoned, addCoins, addItem, BAG_SIZE, ITEMS, charAct, nameTag, popText, setWide, camWide, player, scene.
   Dữ liệu đề: VOICE_DECK (deck.js), VOCAB (places.js), ECHO_LINES (index.html). Vùng: WILDS (parts/world/wilds.js). Mô hình quái: MONSTER_MODELS. */

/* ---------- 1. NHỊP LÊN CẤP (tới Lv.100) ---------- */
const XP_PER_HOUR = 3000;   // ước tính khi chơi đều: ~5 lần nói đúng / phút + hạ quái
function hoursForLevel(L) {   // số giờ để đi từ cấp L lên L+1
  if (L < 20) return 0.15 + (L - 1) * 0.7 / 18;   // Lv.1–20: ~10 giờ (lúc đầu nhanh để có hứng)
  if (L < 40) return 2; if (L < 60) return 3.5; if (L < 80) return 5; return 7;   // tổng ~360 giờ
}
const XP_CUM = [0, 0]; for (let L = 1; L < 100; L++) XP_CUM[L + 1] = XP_CUM[L] + Math.round(hoursForLevel(L) * XP_PER_HOUR / 10) * 10;
function levelForXp(xp) { let L = 1; while (L < 100 && xp >= XP_CUM[L + 1]) L++; return L; }
function xpToNext() { const L = save.level || 1; return L >= 100 ? 0 : XP_CUM[L + 1] - score; }
const DAY_LIMIT = 7200;   // giây chơi mỗi ngày còn nhận kinh nghiệm từ quái

/* ---------- 2. QUÁI ---------- */
const MON = {
  ghost: { name: "Echo Ghost", icon: "👻", weak: "repeat", hp: 1.0, dmg: 1.0, speed: 1.0, range: 2.0 },
  bug:   { name: "Riddle Bug", icon: "🐞", weak: "answer", hp: 0.9, dmg: 0.9, speed: 1.1, range: 2.0 },
  worm:  { name: "Scramble Worm", icon: "🪱", weak: "build", hp: 1.2, dmg: 1.1, speed: 0.8, range: 2.4 },
  crab:  { name: "Question Crab", icon: "🦀", weak: "answer", hp: 1.3, dmg: 1.0, speed: 0.9, range: 2.2 },
  bat:   { name: "Blank Bat", icon: "🦇", weak: "name", hp: 0.8, dmg: 1.2, speed: 1.3, range: 2.0 },
  turtle: { name: "Tense Turtle", icon: "🐢", weak: "build", hp: 1.6, dmg: 0.9, speed: 0.6, range: 2.0 },   // vòng 2
  slime: { name: "Shy Slime", icon: "🫧", weak: "ask", hp: 1.0, dmg: 1.0, speed: 1.0, range: 2.0 },
  parrot: { name: "Mimic Parrot", icon: "🦜", weak: "repeat", hp: 0.9, dmg: 1.2, speed: 1.4, range: 2.2 },
  owl:   { name: "Story Owl", icon: "🦉", weak: "answer", hp: 1.2, dmg: 1.1, speed: 1.0, range: 2.4 }
};
const SEASON_MON2 = { spring: ["owl", "slime", "bug"], tropic: ["parrot", "crab", "turtle"], desert: ["turtle", "bat", "owl"], autumn: ["owl", "parrot", "slime"], winter: ["turtle", "slime", "ghost"] };
const SEASON_MON = { spring: ["ghost", "bug", "bug"], tropic: ["crab", "worm", "bug"], desert: ["bat", "worm", "crab"], autumn: ["bug", "bat", "ghost"], winter: ["ghost", "bat", "crab"] };
const TASK_ICON = { repeat: "📢", answer: "🎺", build: "🎸", name: "🥁", ask: "💬", listen: "🎧", fill: "🧩", sounds: "👄", reply: "🗨️", mistake: "🔁", grammar: "📐", describe: "🖼️" };
const TASK_NAME = { repeat: "REPEAT · nói lại", answer: "ANSWER · trả lời", build: "BUILD · xếp câu", name: "NAME · gọi tên", ask: "ASK · đặt câu hỏi", listen: "LISTEN · nghe rồi nói", fill: "FILL · điền từ", sounds: "SOUNDS · âm khó", reply: "REPLY · đáp lời", mistake: "MY MISTAKES · lỗi của mình", grammar: "GRAMMAR · ngữ pháp", describe: "DESCRIBE · tả tranh" };
/* DẠNG BÀI (chủ dự án chốt 17/11): mở dần theo cấp. Bảng xem ở 🌟 Skills → "📚 Challenges" (parts/ui/progress.js).
   why = lý do sư phạm (ghi cho đội, không hiện cho trẻ). need: "v" = cần ít nhất 1 thẻ từ vựng. */
const CHALLENGES = [
  { t: "repeat", lv: 1,  do: "Read the sentence and say it.", ex: "“I can do it!”", why: "Output (Swain), phát âm, nhớ khối câu" },
  { t: "name",   lv: 1,  need: "v", do: "Look at the picture. Say its name.", ex: "🍎 → “apple”", why: "Truy xuất từ vựng nhanh" },
  { t: "listen", lv: 3,  do: "No text! Listen, then say what you hear.", ex: "🔊 … → “Let's go to school.”", why: "Input nghe thật (Krashen), shadowing; không đọc chữ" },
  { t: "answer", lv: 5,  do: "Listen to the question. Answer it.", ex: "“What falls in winter?” → “Snow.”", why: "Nghe hiểu + phản hồi có nghĩa" },
  { t: "build",  lv: 5,  do: "The words are mixed up. Say them in order.", ex: "school / I / to / go", why: "Trật tự từ (ngữ pháp ngầm)" },
  { t: "fill",   lv: 8,  do: "One word is missing. Say the whole sentence.", ex: "“I ___ to school.” → “I go to school.”", why: "Nhớ lại chủ động (retrieval practice) từ chính thẻ đã có" },
  { t: "sounds", lv: 12, do: "Say the tricky sound clearly.", ex: "“I see a big SHIP.” (not sheep)", why: "Âm khó do tiếng Việt: âm cuối, -s, -ed, i dài/ngắn, th, l/n, s/sh" },
  { t: "ask",    lv: 40, do: "Ask a question back.", ex: "“I like cats.” → “Do you like cats?”", why: "Chủ động đặt câu hỏi (tương tác, Long)" },
  /* ----- 🔜 SẮP LÀM (soon: true = chỉ hiện trong bảng, chưa ra đề). Chủ dự án duyệt ý tưởng 17/11, xem ROADMAP mục 6 ----- */
  { t: "reply",    lv: 15, soon: true, lock: "Unlocks at Lv.15", do: "Reply to what someone says.", ex: "“Can I help you?” → “Yes, I need a map.”", why: "Giao tiếp theo chức năng (CLT/TBLT)" },
  { t: "mistake",  lv: 10, soon: true, lock: "Unlocks at Lv.10, after you make a few small mistakes", do: "Fix YOUR OWN mistakes from earlier fights.", ex: "You said “He go to school.” → “He goes to school.”", why: "Lỗi thật của chính người chơi (Swain: nhận ra lỗ hổng; Long: focus on form)" },
  { t: "grammar",  lv: 20, soon: true, lock: "Unlocks at Lv.20 · grammar for your English level (A1 → A2 → B1)", do: "Use a grammar pattern for your level.", ex: "A2: “I have never …” → “I have never seen snow.”", why: "Ngữ pháp theo khung CEFR, chọn theo trình độ ước lượng của người chơi" },
  { t: "describe", lv: 25, soon: true, lock: "Only vs ✨ Golden monsters and bosses (from Lv.25)", do: "Look at a picture. Say 2–3 sentences about it.", ex: "🏖️ → “Two kids play on the beach. It is sunny.”", why: "Nói dài, tự do (pushed output)" }
];
function challengeOpen(t, L) { const C = CHALLENGES.find(c => c.t === t); if (!C || C.soon) return false; L = L || save.level || 1;
  if (L < C.lv) return false; if (C.need === "v" && !owned.some(id => id[0] === "v")) return false;
  if (t === "sounds" && typeof SOUNDS_DECK === "undefined") return false; if (t === "ask" && !(VOICE_DECK.ask || []).length) return false; return true; }

/* ---------- 3. KỸ NĂNG (giai đoạn A: Power + Rhythm, mỗi nhánh 3 chiêu; Control, Harmony mở ở giai đoạn B) ---------- */
/* kind: single (1 mục tiêu) · multi (nhiều đòn nảy) · aoe (vòng quanh mình) · zone (vòng quanh mục tiêu) · dash (lướt) · self (lên bản thân/đội)
   fx: stun, root (không đi được), silence (không đánh được), slow, taunt, heal, shield, buff (tăng sát thương), haste (hồi chiêu nhanh), mana, cleanse
   type: "passive" = nội tại (luôn có tác dụng, không gắn vào ô) · "ult" = tuyệt chiêu (mở ở Lv.40) */
/* CHIÊU (27/11 làm lại theo đề xuất "Chiêu × Danh nhân", chủ dự án duyệt): 4 chiêu khởi đầu (start) + chiêu danh nhân (src.who / src.q = nhiệm vụ mở chiêu)
   + tuyệt chiêu thần thoại (rift: nhận ở khu văn hoá) + nội tại (mở theo cấp như cũ). Chiêu chủ động tối đa SKILL_MAX bậc, mỗi bậc 1 điểm;
   hình dạng đổi ở bậc 1 / 4 / 7 / 10 (FX3D). Điểm không bao giờ đủ nâng hết: người chơi phải chọn hướng. */
const SKILLS = {
  // ✨ 4 CHIÊU KHỞI ĐẦU CỦA VOCARA (có sẵn từ Lv.1)
  echo_blast: { branch: "power", name: "Echo Blast", icon: "💥", lv: 1, start: true, kind: "single", base: 40, mana: 25, cd: 3, desc: "Nổ âm thanh vào 1 quái.", en: "A sound blast hits 1 monster.", fx: "Vòng rune xoay ở tay, quả cầu âm thanh bay, nổ cột lửa.", src: {"who": "Vocara", "q": "Món quà của Đấng Tiếng Nói"} },
  question_arrow: { branch: "control", name: "Question Arrow", icon: "🏹", lv: 1, start: true, kind: "single", stun: 2, base: 15, mana: 25, cd: 4, desc: "Mũi tên pha lê, choáng 2 giây.", en: "A crystal arrow stuns a monster for 2 seconds.", fx: "Mũi tên pha lê kéo đuôi sao, nổ phép tím, sao choáng xoay trên đầu quái.", src: {"who": "Vocara", "q": "Món quà của Đấng Tiếng Nói"} },
  harmony_heal: { branch: "harmony", name: "Harmony Heal", icon: "💖", lv: 1, start: true, kind: "self", heal: 0.12, mana: 30, cd: 20, desc: "Hồi 12% máu.", en: "Heal 12% of your HP.", fx: "Ấn lục giác thở dưới chân, hào quang xanh, lá bay lên.", src: {"who": "Vocara", "q": "Món quà của Đấng Tiếng Nói"} },
  drum_roll: { branch: "rhythm", name: "Drum Roll", icon: "🥁", lv: 1, start: true, kind: "multi", hits: 3, base: 18, mana: 25, cd: 3, desc: "3 đòn liền, nảy sang quái gần đó.", en: "3 quick hits that bounce to nearby monsters.", fx: "3 nhịp trống, mỗi nhịp một vệt chém lửa.", src: {"who": "Vocara", "q": "Món quà của Đấng Tiếng Nói"} },
  // 📗 CHƯƠNG 1 – mở bằng nhiệm vụ danh nhân
  elephant_scale: { branch: "control", name: "Elephant Scale", icon: "🐘", lv: 10, mana: 27, cd: 7, kind: "zone", radius: 4, stun: 2, base: 20, desc: "Con thuyền ma khổng lồ trồi từ mặt đất như mặt hồ, sóng nước nâng bổng cả đàn quái lên rồi \"cân\": vạch mực nước đỏ hiện trên thân, quái nặng nhất bị dìm xuống choáng.", en: "A ghost boat lifts monsters on a wave and weighs them. Stuns a group.", fx: "Con thuyền ma khổng lồ trồi từ mặt đất như mặt hồ, sóng nước nâng bổng cả đàn quái lên rồi \"cân\": vạch mực nước đỏ hiện trên thân, quái nặng nhất bị dìm xuống choáng.", seed: "Vật chiếm chỗ nước: thuyền chìm tới đâu thì nặng bấy nhiêu.", src: {"who": "Lương Thế Vinh", "q": "Cân con voi bằng một chiếc thuyền"} },
  abacus_barrage: { branch: "power", name: "Abacus Barrage", icon: "🧮", lv: 10, mana: 27, cd: 5, kind: "multi", hits: 5, base: 14, desc: "Bàn tính gỗ cao 3 m hiện sau lưng, các hạt gỗ bắn liên hoàn như súng máy, mỗi hạt nổ ra một con số vàng.", en: "A giant abacus fires 5 wooden beads.", fx: "Bàn tính gỗ cao 3 m hiện sau lưng, các hạt gỗ bắn liên hoàn như súng máy, mỗi hạt nổ ra một con số vàng.", seed: "Bàn tính: cộng trừ nhanh bằng cách gạt hạt.", src: {"who": "Lương Thế Vinh", "q": "Sách toán Đại thành toán pháp"} },
  bristle_cyclone: { branch: "rhythm", name: "Bristle Cyclone", icon: "🪥", lv: 11, mana: 28, cd: 7, kind: "aoe", radius: 4.5, hits: 3, base: 16, desc: "Bàn chải khổng lồ xoay tít quanh người như cánh quạt, quét văng quái, bọt trắng bay mù trời rồi nổ lốp bốp.", en: "A giant brush spins around you 3 times.", fx: "Bàn chải khổng lồ xoay tít quanh người như cánh quạt, quét văng quái, bọt trắng bay mù trời rồi nổ lốp bốp.", seed: "Lông cứng chà sạch mảng bám.", src: {"who": "William Addis", "q": "Làm bàn chải từ cán xương"} },
  ladys_lamp: { branch: "harmony", name: "Lady's Lamp", icon: "🪔", lv: 12, mana: 28, cd: 15, kind: "self", heal: 0.18, desc: "Đèn dầu vàng bay lên trên đầu, toả chùm sáng quét như hải đăng: đồng đội trong vùng sáng hồi máu liên tục, quái trong vùng sáng bị thiêu.", en: "A lamp shines over you and heals.", fx: "Đèn dầu vàng bay lên trên đầu, toả chùm sáng quét như hải đăng: đồng đội trong vùng sáng hồi máu liên tục, quái trong vùng sáng bị thiêu.", seed: "Chăm sóc bệnh nhân cả ban đêm.", src: {"who": "Florence Nightingale", "q": "The Lady with the Lamp"} },
  fresh_wind: { branch: "harmony", name: "Fresh Wind", icon: "🌬️", lv: 12, mana: 28, cd: 15, kind: "self", cleanse: true, heal: 0.1, desc: "Cánh cửa sổ ánh sáng mở toang, luồng gió trong xanh cuốn sạch độc câm, giải mọi hiệu ứng xấu.", en: "Fresh wind removes silence and heals a little.", fx: "Cánh cửa sổ ánh sáng mở toang, luồng gió trong xanh cuốn sạch độc câm, giải mọi hiệu ứng xấu.", seed: "Vệ sinh và không khí sạch giảm bệnh tật.", src: {"who": "Florence Nightingale", "q": "Rửa tay, mở cửa sổ, phòng sạch"} },
  bandage_bind: { branch: "control", name: "Bandage Bind", icon: "🩹", lv: 13, mana: 28, cd: 5, kind: "single", stun: 3, base: 12, desc: "Cuộn băng keo khổng lồ bay vòng, quấn quái thành xác ướp trắng 3 giây; quanh mình hiện miếng băng sáng hồi máu.", en: "A giant bandage wraps one monster for 3 seconds.", fx: "Cuộn băng keo khổng lồ bay vòng, quấn quái thành xác ướp trắng 3 giây; quanh mình hiện miếng băng sáng hồi máu.", seed: "Băng cá nhân che vết thương nhỏ.", src: {"who": "Earle Dickson", "q": "Dán miếng gạc lên băng keo"} },
  gravity_crush: { branch: "power", name: "Gravity Crush", icon: "🍎", lv: 14, mana: 29, cd: 7, kind: "zone", radius: 3, base: 60, taunt: true, desc: "Quả táo vàng to bằng ngôi nhà rơi từ trời, không gian cong lõm như tấm lưới, quái bị hút về tâm rồi nghiền xuống thành hố.", en: "A giant golden apple falls and pulls monsters in.", fx: "Quả táo vàng to bằng ngôi nhà rơi từ trời, không gian cong lõm như tấm lưới, quái bị hút về tâm rồi nghiền xuống thành hố.", seed: "Mọi vật bị Trái Đất hút xuống.", src: {"who": "Isaac Newton", "q": "Quả táo rơi và lực hấp dẫn"} },
  prism_ray: { branch: "rhythm", name: "Prism Ray", icon: "🌈", lv: 14, mana: 29, cd: 7, kind: "aoe", radius: 6, base: 30, desc: "Lăng kính pha lê lơ lửng, tia sáng trắng đâm vào rồi toả ra 7 tia cầu vồng quét chéo cả bãi.", en: "A prism splits light into 7 rainbow rays.", fx: "Lăng kính pha lê lơ lửng, tia sáng trắng đâm vào rồi toả ra 7 tia cầu vồng quét chéo cả bãi.", seed: "Ánh sáng trắng gồm 7 màu.", src: {"who": "Isaac Newton", "q": "Lăng kính tách ánh sáng 7 màu"} },
  third_law: { branch: "control", name: "Third Law", icon: "↩️", lv: 14, mana: 29, cd: 15, kind: "self", shield: 0.5, shieldT: 5, desc: "Khiên mũi tên phản lực: đòn đánh vào mình bị bật ngược lại kèm sóng chấn động.", en: "Every action has a reaction: a shield for 5 seconds.", fx: "Khiên mũi tên phản lực: đòn đánh vào mình bị bật ngược lại kèm sóng chấn động.", seed: "Lực và phản lực.", src: {"who": "Isaac Newton", "q": "3 định luật chuyển động"} },
  ichthyosaur_rise: { branch: "rhythm", name: "Ichthyosaur Rise", icon: "🦴", lv: 15, mana: 29, cd: 7, kind: "zone", radius: 5, base: 45, desc: "Bộ xương ngư long dài 10 m phá đất trồi lên, \"bơi\" dưới mặt đất như cá mập (để lại rãnh nứt) rồi nhảy lên đớp cả cụm quái.", en: "A fossil sea reptile swims under the ground and bites.", fx: "Bộ xương ngư long dài 10 m phá đất trồi lên, \"bơi\" dưới mặt đất như cá mập (để lại rãnh nứt) rồi nhảy lên đớp cả cụm quái.", seed: "Hoá thạch bò sát biển cổ đại.", src: {"who": "Mary Anning", "q": "Bộ xương ngư long trên vách biển"} },
  plesio_snap: { branch: "power", name: "Plesio Snap", icon: "🦕", lv: 15, mana: 29, cd: 5, kind: "single", base: 70, desc: "Chiếc cổ xương dài vươn ra từ vòng phù văn, quất như roi và cắn 1 mục tiêu.", en: "A long fossil neck snaps at one monster.", fx: "Chiếc cổ xương dài vươn ra từ vòng phù văn, quất như roi và cắn 1 mục tiêu.", seed: "Plesiosaur: cổ rất dài.", src: {"who": "Mary Anning", "q": "Thằn lằn cổ dài"} },
  press_slam: { branch: "power", name: "Press Slam", icon: "🖨️", lv: 16, mana: 29, cd: 5, kind: "single", base: 75, stun: 0.5, desc: "Cỗ máy in gỗ khổng lồ dập xuống, đóng dấu chữ cái phát sáng lên quái và mặt đất.", en: "A giant printing press stamps down.", fx: "Cỗ máy in gỗ khổng lồ dập xuống, đóng dấu chữ cái phát sáng lên quái và mặt đất.", seed: "Máy in ép giấy lên chữ có mực.", src: {"who": "Johannes Gutenberg", "q": "Máy in"} },
  typeset_rain: { branch: "rhythm", name: "Typeset Rain", icon: "🔠", lv: 16, mana: 29, cd: 7, kind: "zone", radius: 5, base: 35, desc: "Mưa chữ kim loại A–Z rơi xuống cả vùng, mỗi chữ cắm xuống nổ tia lửa.", en: "A small book opens and fires pages that explode.", fx: "Mưa chữ kim loại A–Z rơi xuống cả vùng, mỗi chữ cắm xuống nổ tia lửa.", seed: "Chữ rời ghép thành trang in.", src: {"who": "Johannes Gutenberg", "q": "Chữ rời bằng kim loại"} },
  aerial_screw: { branch: "rhythm", name: "Aerial Screw", icon: "🌀", lv: 17, mana: 29, cd: 7, kind: "aoe", radius: 5, hits: 3, base: 20, taunt: true, desc: "Cánh quạt xoắn bằng vải và gỗ khổng lồ quay quanh người như máy xay gió, hút quái vào giữa.", en: "Da Vinci's flying screw spins and pulls monsters.", fx: "Cánh quạt xoắn bằng vải và gỗ khổng lồ quay quanh người như máy xay gió, hút quái vào giữa.", seed: "Bản vẽ máy bay cánh xoắn.", src: {"who": "Leonardo da Vinci", "q": "Cánh quạt bay giống trực thăng"} },
  mirror_script: { branch: "control", name: "Mirror Script", icon: "🪞", lv: 17, mana: 29, cd: 7, kind: "zone", radius: 4, silence: 5, base: 10, desc: "Tấm gương lớn dựng lên trước quái, chữ ngược bay ra quấn quanh đầu: quái rối loạn, đánh nhầm đồng loại.", en: "Mirror writing confuses monsters: no attacks for 5 seconds.", fx: "Tấm gương lớn dựng lên trước quái, chữ ngược bay ra quấn quanh đầu: quái rối loạn, đánh nhầm đồng loại.", seed: "Da Vinci viết chữ từ phải sang trái.", src: {"who": "Leonardo da Vinci", "q": "Viết chữ ngược"} },
  ring_shock: { branch: "control", name: "Ring Shock", icon: "☎️", lv: 18, mana: 29, cd: 5, kind: "single", stun: 2.5, base: 25, desc: "Ống nghe đồng cổ khổng lồ đổ chuông, dây điện xoắn phóng ra quấn quái, tiếng chuông thành sóng âm choáng.", en: "An old telephone rings. The sound stuns.", fx: "Ống nghe đồng cổ khổng lồ đổ chuông, dây điện xoắn phóng ra quấn quái, tiếng chuông thành sóng âm choáng.", seed: "Giọng nói truyền qua dây điện.", src: {"who": "Alexander Graham Bell", "q": "Chiếc điện thoại đầu tiên"} },
  camera_obscura: { branch: "control", name: "Camera Obscura", icon: "📷", lv: 19, mana: 30, cd: 7, kind: "zone", radius: 4, stun: 3, base: 10, desc: "Hộp tối khổng lồ mở \"mắt\", chớp sáng chói: quái bị chụp lại, hoá thành tấm ảnh nâu sepia đứng im 3 giây.", en: "Flash! Monsters freeze like an old photo.", fx: "Hộp tối khổng lồ mở \"mắt\", chớp sáng chói: quái bị chụp lại, hoá thành tấm ảnh nâu sepia đứng im 3 giây.", seed: "Ánh sáng qua lỗ nhỏ vẽ ra hình.", src: {"who": "Nicéphore Niépce", "q": "Tấm ảnh đầu tiên"} },
  x_ray_pierce: { branch: "power", name: "X-Ray Pierce", icon: "🩻", lv: 20, mana: 30, cd: 5, kind: "single", base: 65, pierce: true, desc: "Tia X xanh lục xuyên qua hàng quái, thân quái trong suốt hiện bộ xương phát sáng, nhận thêm 30% sát thương.", en: "An X-ray beam shows the bones. Always x1.5.", fx: "Tia X xanh lục xuyên qua hàng quái, thân quái trong suốt hiện bộ xương phát sáng, nhận thêm 30% sát thương.", seed: "Tia X đi xuyên qua cơ thể.", src: {"who": "Wilhelm Röntgen", "q": "Tìm ra tia X"} },
  skeleton_burst: { branch: "rhythm", name: "Skeleton Burst", icon: "🖐️", lv: 20, mana: 30, cd: 7, kind: "aoe", radius: 5, base: 40, desc: "Bàn tay xương khổng lồ trồi lên từ tấm phim X-quang dưới đất, đập mạnh xuống, sóng xanh lục toả ra.", en: "A giant bone hand smashes the ground.", fx: "Bàn tay xương khổng lồ trồi lên từ tấm phim X-quang dưới đất, đập mạnh xuống, sóng xanh lục toả ra.", seed: "Phim X-quang chụp được xương.", src: {"who": "Wilhelm Röntgen", "q": "Tấm phim bàn tay"} },
  // 📗 CHƯƠNG 2 – mở bằng nhiệm vụ danh nhân
  microbe_swarm: { branch: "rhythm", name: "Microbe Swarm", icon: "🦠", lv: 22, mana: 31, cd: 7, kind: "zone", radius: 5, base: 45, slow: 0.3, slowT: 4, desc: "Thấu kính khổng lồ dựng trước mặt, phóng to giọt nước; đàn vi sinh phát sáng hình que, hình xoắn tràn ra gặm quái.", en: "Glowing microbes swarm the monsters.", fx: "Thấu kính khổng lồ dựng trước mặt, phóng to giọt nước; đàn vi sinh phát sáng hình que, hình xoắn tràn ra gặm quái.", seed: "Kính hiển vi thấy vi khuẩn.", src: {"who": "Antonie van Leeuwenhoek", "q": "Những con vật nhỏ trong giọt nước"} },
  sterilize_blaze: { branch: "power", name: "Sterilize Blaze", icon: "🔥", lv: 24, mana: 31, cd: 5, kind: "single", base: 95, desc: "Cột lửa xanh 100°C phun từ đất lên, nước sôi sùng sục quanh quái, hơi nóng bốc thành nấm khói.", en: "A blue 100 °C fire column.", fx: "Cột lửa xanh 100°C phun từ đất lên, nước sôi sùng sục quanh quái, hơi nóng bốc thành nấm khói.", seed: "Đun nóng diệt vi trùng.", src: {"who": "Louis Pasteur", "q": "Đun nóng để sữa không hỏng"} },
  vaccine_shield: { branch: "harmony", name: "Vaccine Shield", icon: "💉", lv: 24, mana: 31, cd: 15, kind: "self", shield: 0.55, shieldT: 8, cleanse: true, desc: "Mũi kim ánh sáng tiêm vào người, giáp tinh thể lục giác bao quanh: miễn độc câm 10 giây.", en: "A crystal shield. Immune to silence.", fx: "Mũi kim ánh sáng tiêm vào người, giáp tinh thể lục giác bao quanh: miễn độc câm 10 giây.", seed: "Vắc-xin dạy cơ thể tự chống bệnh.", src: {"who": "Louis Pasteur", "q": "Vắc-xin bệnh dại"} },
  penicillin_bloom: { branch: "harmony", name: "Penicillin Bloom", icon: "🍄", lv: 26, mana: 31, cd: 15, kind: "self", heal: 0.25, desc: "Đốm nấm mốc xanh nở bung thành vườn hoa phát sáng: đồng đội đứng trong hồi máu, quái đứng trong bị ăn mòn.", en: "Green mould blooms into healing flowers.", fx: "Đốm nấm mốc xanh nở bung thành vườn hoa phát sáng: đồng đội đứng trong hồi máu, quái đứng trong bị ăn mòn.", seed: "Nấm mốc diệt vi khuẩn.", src: {"who": "Alexander Fleming", "q": "Penicillin"} },
  pea_vine_prison: { branch: "control", name: "Pea Vine Prison", icon: "🌱", lv: 28, mana: 32, cd: 7, kind: "zone", radius: 4, root: 3.5, base: 25, desc: "Dây đậu khổng lồ trồi lên quấn quái, hoa tím trắng nở trên dây, quả đậu nổ ra hạt.", en: "Giant pea vines hold monsters.", fx: "Dây đậu khổng lồ trồi lên quấn quái, hoa tím trắng nở trên dây, quả đậu nổ ra hạt.", seed: "Di truyền ở cây đậu.", src: {"who": "Gregor Mendel", "q": "Trồng hàng nghìn cây đậu"} },
  hybrid_shot: { branch: "power", name: "Hybrid Shot", icon: "🌾", lv: 28, mana: 32, cd: 5, kind: "multi", hits: 4, base: 30, desc: "Hạt giống vàng bay ra, giữa đường tách đôi rồi đôi nữa (2 → 4 → 8) rồi cùng nổ.", en: "A seed splits 2 → 4 → 8 and explodes.", fx: "Hạt giống vàng bay ra, giữa đường tách đôi rồi đôi nữa (2 → 4 → 8) rồi cùng nổ.", seed: "Lai giống cho cây tốt hơn.", src: {"who": "Gregor Mendel", "q": "Lúa lai, bắp, chuối ngày nay"} },
  herbal_mist: { branch: "harmony", name: "Herbal Mist", icon: "🌿", lv: 30, mana: 33, cd: 25, kind: "self", heal: 0.3, desc: "Nồi thuốc đồng hiện ra sôi sùng sục, khói thơm xanh vàng toả rộng hồi máu dần cho cả đội.", en: "Herbal steam heals you.", fx: "Nồi thuốc đồng hiện ra sôi sùng sục, khói thơm xanh vàng toả rộng hồi máu dần cho cả đội.", seed: "Cây thuốc quanh nhà.", src: {"who": "Hải Thượng Lãn Ông", "q": "Cây thuốc nam: gừng, sả, tía tô"} },
  vein_map: { branch: "control", name: "Vein Map", icon: "🫀", lv: 32, mana: 33, cd: 7, kind: "zone", radius: 5, base: 30, slow: 0.5, slowT: 5, desc: "Mạng mạch máu đỏ phát sáng lan trên mặt đất nối các quái: đánh 1 con, cả mạng cùng chịu.", en: "A glowing vein map links and slows monsters.", fx: "Mạng mạch máu đỏ phát sáng lan trên mặt đất nối các quái: đánh 1 con, cả mạng cùng chịu.", seed: "Bản đồ mạch máu giúp mổ chính xác.", src: {"who": "Tôn Thất Tùng", "q": "Vẽ bản đồ mạch máu trong gan"} },
  surgeons_cut: { branch: "power", name: "Surgeon's Cut", icon: "🔪", lv: 32, mana: 33, cd: 5, kind: "single", base: 90, execute: 0.35, desc: "Một đường dao sáng mảnh như sợi chỉ, chậm lại 0,3 giây rồi xé toạc: luôn chí mạng.", en: "One perfect cut. x3 on weak monsters.", fx: "Một đường dao sáng mảnh như sợi chỉ, chậm lại 0,3 giây rồi xé toạc: luôn chí mạng.", seed: "Mổ nhanh, chính xác.", src: {"who": "Tôn Thất Tùng", "q": "Phương pháp mổ gan"} },
  radium_nova: { branch: "power", name: "Radium Nova", icon: "☢️", lv: 34, mana: 33, cd: 7, kind: "zone", radius: 3.5, base: 110, desc: "Hạt radium phát sáng xanh lục trong bóng tối, phình to thành mặt trời nhỏ rồi nổ tung, để lại vùng ánh xanh.", en: "A glowing radium star explodes.", fx: "Hạt radium phát sáng xanh lục trong bóng tối, phình to thành mặt trời nhỏ rồi nổ tung, để lại vùng ánh xanh.", seed: "Radium tự phát sáng.", src: {"who": "Marie Curie", "q": "Tìm ra polonium, radium"} },
  x_ray_ambulance: { branch: "harmony", name: "X-Ray Ambulance", icon: "🚑", lv: 34, mana: 33, cd: 15, kind: "self", heal: 0.2, haste: 0.5, hasteT: 5, desc: "Chiếc xe cứu thương ánh sáng chạy vòng quanh đội, đi qua ai thì hồi máu người đó.", en: "A light ambulance heals and speeds you up.", fx: "Chiếc xe cứu thương ánh sáng chạy vòng quanh đội, đi qua ai thì hồi máu người đó.", seed: "Xe X-quang cứu người bị thương.", src: {"who": "Marie Curie", "q": "Xe X-quang ra chiến trường"} },
  periodic_barrage: { branch: "rhythm", name: "Periodic Barrage", icon: "⚗️", lv: 36, mana: 34, cd: 7, kind: "zone", radius: 5.5, base: 35, hits: 3, desc: "Bảng tuần hoàn khổng lồ dựng sau lưng, từng ô bật sáng và bắn ra nguyên tố của nó: H nổ, O bùng lửa, Fe thành mũi sắt, Ne neon tím.", en: "The periodic table fires its elements.", fx: "Bảng tuần hoàn khổng lồ dựng sau lưng, từng ô bật sáng và bắn ra nguyên tố của nó: H nổ, O bùng lửa, Fe thành mũi sắt, Ne neon tím.", seed: "Bảng tuần hoàn các nguyên tố.", src: {"who": "Dmitri Mendeleev", "q": "Xếp nguyên tố thành bảng"} },
  water_split: { branch: "power", name: "Water Split", icon: "💧", lv: 36, mana: 34, cd: 5, kind: "single", base: 120, desc: "Quả cầu nước bay tới, tách thành 2 bóng H và 1 bóng O, nhập lại nổ một tiếng \"bùm\" hơi nước trắng.", en: "Water splits into H and O, then BOOM.", fx: "Quả cầu nước bay tới, tách thành 2 bóng H và 1 bóng O, nhập lại nổ một tiếng \"bùm\" hơi nước trắng.", seed: "H₂O: nước gồm hydro và ô-xy.", src: {"who": "Dmitri Mendeleev", "q": "Nước = hydro + ô-xy"} },
  // 📗 CHƯƠNG 3 – mở bằng nhiệm vụ danh nhân
  phonograph_roar: { branch: "power", name: "Phonograph Roar", icon: "📯", lv: 38, mana: 35, cd: 5, kind: "single", base: 130, desc: "Loa kèn đồng khổng lồ và đĩa than xoay sau lưng; câu người chơi vừa nói được phát lại ×3 thành 3 sóng âm vàng.", en: "Your own voice is played back x3.", fx: "Loa kèn đồng khổng lồ và đĩa than xoay sau lưng; câu người chơi vừa nói được phát lại ×3 thành 3 sóng âm vàng.", seed: "Máy hát ghi và phát lại tiếng.", src: {"who": "Thomas Edison", "q": "Máy hát ghi lại giọng nói"} },
  bulb_barrage: { branch: "rhythm", name: "Bulb Barrage", icon: "💡", lv: 38, mana: 35, cd: 7, kind: "zone", radius: 5, base: 60, desc: "Hàng trăm bóng đèn bay ra như pháo, chạm quái là chớp sáng và nổ kính.", en: "Hundreds of light bulbs burst.", fx: "Hàng trăm bóng đèn bay ra như pháo, chạm quái là chớp sáng và nổ kính.", seed: "Bóng đèn sợi đốt.", src: {"who": "Thomas Edison", "q": "Bóng đèn điện"} },
  never_give_up: { branch: "harmony", name: "Never Give Up", icon: "🔆", lv: 38, mana: 35, cd: 25, kind: "self", heal: 0.5, desc: "Khi sắp hết máu, ngàn bóng đèn hỏng xoay quanh rồi một bóng sáng rực: hồi 50% máu (nội tại, 1 lần mỗi trận).", en: "One bright bulb after a thousand tries: big heal.", fx: "Khi sắp hết máu, ngàn bóng đèn hỏng xoay quanh rồi một bóng sáng rực: hồi 50% máu (nội tại, 1 lần mỗi trận).", seed: "Kiên trì thử nghiệm.", src: {"who": "Thomas Edison", "q": "Thử hàng nghìn lần"} },
  tesla_coil: { branch: "rhythm", name: "Tesla Coil", icon: "🗼", lv: 40, mana: 35, cd: 5, kind: "multi", hits: 6, base: 45, desc: "Tháp cuộn Tesla trồi khỏi đất, quả cầu trên đỉnh phóng sét nảy liên hoàn qua 6 quái.", en: "A Tesla tower fires lightning through 6 monsters.", fx: "Tháp cuộn Tesla trồi khỏi đất, quả cầu trên đỉnh phóng sét nảy liên hoàn qua 6 quái.", seed: "Cuộn Tesla tạo tia điện cao thế.", src: {"who": "Nikola Tesla", "q": "Cuộn Tesla bắn tia điện"} },
  ac_storm: { branch: "power", name: "AC Storm", icon: "⚡", lv: 40, mana: 35, cd: 5, kind: "single", base: 150, stun: 1, desc: "Hai luồng sét xanh và tím xoắn quanh nhau như sợi dây, đổi chiều liên tục rồi đánh xuống.", en: "Two twisting lightning bolts strike.", fx: "Hai luồng sét xanh và tím xoắn quanh nhau như sợi dây, đổi chiều liên tục rồi đánh xuống.", seed: "Dòng điện đổi chiều nhiều lần mỗi giây.", src: {"who": "Nikola Tesla", "q": "Dòng điện xoay chiều"} },
  motor_spin: { branch: "rhythm", name: "Motor Spin", icon: "🧲", lv: 40, mana: 35, cd: 7, kind: "aoe", radius: 5, hits: 4, base: 35, taunt: true, desc: "Rotor nam châm khổng lồ quay dưới chân, quái bị kéo xoay vòng như trong máy giặt.", en: "A magnet motor spins monsters around.", fx: "Rotor nam châm khổng lồ quay dưới chân, quái bị kéo xoay vòng như trong máy giặt.", seed: "Động cơ quay nhờ nam châm và điện.", src: {"who": "Nikola Tesla", "q": "Động cơ điện"} },
  absolute_chill: { branch: "control", name: "Absolute Chill", icon: "❄️", lv: 42, mana: 35, cd: 7, kind: "aoe", radius: 6, stun: 3, base: 30, desc: "Ống gió khổng lồ thổi bão lạnh, tinh thể băng phủ kín quái, cả vùng đóng băng.", en: "A freezing storm. Everything near you freezes.", fx: "Ống gió khổng lồ thổi bão lạnh, tinh thể băng phủ kín quái, cả vùng đóng băng.", seed: "Máy lạnh hút hơi nóng ra ngoài.", src: {"who": "Willis Carrier", "q": "Máy làm mát"} },
  radio_tower: { branch: "rhythm", name: "Radio Tower", icon: "📡", lv: 44, mana: 36, cd: 7, kind: "aoe", radius: 8, hits: 3, base: 45, desc: "Cột ăng-ten thép mọc lên, sóng radio đồng tâm lan xa cả bản đồ, mỗi vòng sóng đánh 1 lần.", en: "Radio waves ring out across the map.", fx: "Cột ăng-ten thép mọc lên, sóng radio đồng tâm lan xa cả bản đồ, mỗi vòng sóng đánh 1 lần.", seed: "Sóng radio truyền không cần dây.", src: {"who": "Guglielmo Marconi", "q": "Gửi tín hiệu không dây"} },
  sos_beacon: { branch: "harmony", name: "SOS Beacon", icon: "🆘", lv: 44, mana: 36, cd: 25, kind: "self", heal: 0.3, haste: 0.5, hasteT: 6, desc: "Pháo hiệu SOS bắn lên trời, đồng đội ở xa được hồi máu và chạy nhanh về phía mình.", en: "An SOS flare heals and speeds you up.", fx: "Pháo hiệu SOS bắn lên trời, đồng đội ở xa được hồi máu và chạy nhanh về phía mình.", seed: "Tín hiệu cứu nạn.", src: {"who": "Guglielmo Marconi", "q": "Radio cứu người trên biển"} },
  screen_trap: { branch: "control", name: "Screen Trap", icon: "📺", lv: 46, mana: 37, cd: 5, kind: "single", stun: 4, silence: 6, base: 30, desc: "Màn hình ti vi cổ khổng lồ hiện ra, hút quái vào trong, quái bị kẹt giữa nhiễu sóng sọc trắng đen.", en: "A giant TV pulls a monster inside.", fx: "Màn hình ti vi cổ khổng lồ hiện ra, hút quái vào trong, quái bị kẹt giữa nhiễu sóng sọc trắng đen.", seed: "Ti vi truyền hình ảnh đi xa.", src: {"who": "John Logie Baird", "q": "Ti vi đầu tiên"} },
  berthas_drive: { branch: "rhythm", name: "Bertha's Drive", icon: "🚗", lv: 48, mana: 37, cd: 6, kind: "dash", radius: 3.5, base: 90, desc: "Lao tới như chiếc xe ba bánh rực lửa, để lại vệt bánh xe cháy, đâm xuyên cả hàng quái.", en: "Dash like a fire car through the line.", fx: "Lao tới như chiếc xe ba bánh rực lửa, để lại vệt bánh xe cháy, đâm xuyên cả hàng quái.", seed: "Ô tô chạy xăng đầu tiên.", src: {"who": "Karl & Bertha Benz", "q": "Chuyến lái đường dài của Bertha"} },
  steam_express: { branch: "power", name: "Steam Express", icon: "🚂", lv: 50, mana: 37, cd: 7, kind: "zone", radius: 4, base: 140, desc: "Đường ray ánh sáng hiện dưới đất, đoàn tàu hơi nước ma rú còi lao xuyên hàng quái, khói trắng cuồn cuộn.", en: "A ghost steam train rushes through.", fx: "Đường ray ánh sáng hiện dưới đất, đoàn tàu hơi nước ma rú còi lao xuyên hàng quái, khói trắng cuồn cuộn.", seed: "Tàu hơi nước kéo nhiều toa.", src: {"who": "George Stephenson", "q": "Đầu máy hơi nước"} },
  wind_tunnel: { branch: "control", name: "Wind Tunnel", icon: "🌪️", lv: 52, mana: 38, cd: 7, kind: "zone", radius: 6, base: 30, taunt: true, stun: 1.5, desc: "Đường hầm gió xoáy kéo dài, hút quái thành một hàng thẳng.", en: "A wind tunnel pulls monsters into a line.", fx: "Đường hầm gió xoáy kéo dài, hút quái thành một hàng thẳng.", seed: "Thử cánh trong hầm gió.", src: {"who": "Anh em nhà Wright", "q": "Hầm gió tự làm"} },
  kitty_hawk_dive: { branch: "power", name: "Kitty Hawk Dive", icon: "✈️", lv: 52, mana: 38, cd: 7, kind: "zone", radius: 3, base: 170, desc: "Máy bay cánh kép bằng ánh sáng bay vòng rồi bổ nhào xuống, nổ gió.", en: "A light biplane dives and explodes.", fx: "Máy bay cánh kép bằng ánh sáng bay vòng rồi bổ nhào xuống, nổ gió.", seed: "Chuyến bay có động cơ đầu tiên.", src: {"who": "Anh em nhà Wright", "q": "Chuyến bay 12 giây"} },
  // 📗 CHƯƠNG 4 – mở bằng nhiệm vụ danh nhân
  four_moons: { branch: "rhythm", name: "Four Moons", icon: "🌕", lv: 58, mana: 39, cd: 5, kind: "multi", hits: 4, base: 80, desc: "Bốn mặt trăng nhỏ quay quanh người chơi, lần lượt phóng vào quái như sao chổi.", en: "Four moons orbit you and fly at monsters.", fx: "Bốn mặt trăng nhỏ quay quanh người chơi, lần lượt phóng vào quái như sao chổi.", seed: "Sao Mộc có 4 mặt trăng lớn.", src: {"who": "Galileo Galilei", "q": "Bốn mặt trăng của sao Mộc"} },
  lunar_crater: { branch: "power", name: "Lunar Crater", icon: "🌑", lv: 58, mana: 39, cd: 7, kind: "zone", radius: 4, base: 200, desc: "Mặt Trăng nghiêng xuống sát mặt đất, một mảnh đá Mặt Trăng rơi tạo hố khổng lồ.", en: "A piece of the Moon falls.", fx: "Mặt Trăng nghiêng xuống sát mặt đất, một mảnh đá Mặt Trăng rơi tạo hố khổng lồ.", seed: "Mặt Trăng có núi và hố.", src: {"who": "Galileo Galilei", "q": "Núi và hố trên Mặt Trăng"} },
  galaxy_bloom: { branch: "rhythm", name: "Galaxy Bloom", icon: "🌌", lv: 62, mana: 41, cd: 7, kind: "aoe", radius: 7, base: 90, desc: "Thiên hà xoắn ốc mở ra dưới chân, nở rộng đẩy quái văng ra mọi phía.", en: "A spiral galaxy opens and pushes monsters away.", fx: "Thiên hà xoắn ốc mở ra dưới chân, nở rộng đẩy quái văng ra mọi phía.", seed: "Các thiên hà đang rời xa nhau.", src: {"who": "Edwin Hubble", "q": "Vũ trụ đang nở ra"} },
  meteor_shower: { branch: "power", name: "Meteor Shower", icon: "☄️", lv: 62, mana: 41, cd: 7, kind: "zone", radius: 6, hits: 3, base: 80, desc: "Bầu trời tối lại, mưa sao băng lửa rơi xuống cả vùng.", en: "Meteors rain down.", fx: "Bầu trời tối lại, mưa sao băng lửa rơi xuống cả vùng.", seed: "Ngoài Dải Ngân Hà còn nhiều thiên hà.", src: {"who": "Edwin Hubble", "q": "Thiên hà Andromeda"} },
  moon_gravity: { branch: "control", name: "Moon Gravity", icon: "👨‍🚀", lv: 66, mana: 41, cd: 7, kind: "aoe", radius: 7, slow: 0.6, slowT: 6, stun: 1.5, base: 30, desc: "Vùng trọng lực thấp: quái lơ lửng chậm chạp bay lên trời như phi hành gia.", en: "Low gravity: monsters float slowly.", fx: "Vùng trọng lực thấp: quái lơ lửng chậm chạp bay lên trời như phi hành gia.", seed: "Trọng lực Mặt Trăng = 1/6 Trái Đất.", src: {"who": "Neil Armstrong", "q": "Vì sao trên Mặt Trăng nhảy cao"} },
  giant_leap: { branch: "rhythm", name: "Giant Leap", icon: "👣", lv: 66, mana: 41, cd: 6, kind: "dash", radius: 5, base: 150, desc: "Nhảy vọt lên cao, đáp xuống in dấu giày khổng lồ, bụi Mặt Trăng toả tròn.", en: "Jump high and land with a giant footprint.", fx: "Nhảy vọt lên cao, đáp xuống in dấu giày khổng lồ, bụi Mặt Trăng toả tròn.", seed: "\"One small step…\"", src: {"who": "Neil Armstrong", "q": "Bước chân đầu tiên trên Mặt Trăng"} },
  photon_lance: { branch: "power", name: "Photon Lance", icon: "🔦", lv: 70, mana: 43, cd: 5, kind: "single", base: 230, pierce: true, desc: "Tia laser photon trắng xuyên thẳng, electron vàng văng ra từ thân quái.", en: "A white photon laser. Always x1.5.", fx: "Tia laser photon trắng xuyên thẳng, electron vàng văng ra từ thân quái.", seed: "Hiệu ứng quang điện.", src: {"who": "Albert Einstein", "q": "Ánh sáng làm bật electron"} },
  time_dilation: { branch: "control", name: "Time Dilation", icon: "⏳", lv: 70, mana: 43, cd: 7, kind: "aoe", radius: 8, slow: 0.7, slowT: 8, base: 20, desc: "Mặt đồng hồ khổng lồ quay chậm lại dưới chân: quái trong vùng chuyển động chậm như phim quay chậm.", en: "A giant clock slows time around you.", fx: "Mặt đồng hồ khổng lồ quay chậm lại dưới chân: quái trong vùng chuyển động chậm như phim quay chậm.", seed: "Thời gian trôi khác nhau khi đi rất nhanh.", src: {"who": "Albert Einstein", "q": "Thuyết tương đối"} },
  e_mc2_nova: { branch: "power", name: "E = mc² Nova", icon: "☀️", lv: 70, mana: 43, cd: 7, kind: "zone", radius: 5, base: 300, desc: "Một hạt nhỏ xíu tụ ánh sáng, im lặng 1 giây, rồi bùng thành mặt trời nổ tung.", en: "A tiny dot of light becomes a sun and explodes.", fx: "Một hạt nhỏ xíu tụ ánh sáng, im lặng 1 giây, rồi bùng thành mặt trời nổ tung.", seed: "Khối lượng nhỏ chứa năng lượng rất lớn.", src: {"who": "Albert Einstein", "q": "E = mc²"} },
  analytical_engine: { branch: "harmony", name: "Analytical Engine", icon: "⚙️", lv: 74, mana: 43, cd: 15, kind: "self", buff: 0.5, buffT: 10, haste: 0.5, hasteT: 10, desc: "Cỗ máy bánh răng đồng khổng lồ quay sau lưng, chơi một bản nhạc: cả đội tăng sát thương và hồi chiêu nhanh.", en: "A gear machine plays music: +50% damage, faster skills.", fx: "Cỗ máy bánh răng đồng khổng lồ quay sau lưng, chơi một bản nhạc: cả đội tăng sát thương và hồi chiêu nhanh.", seed: "Chương trình máy tính đầu tiên.", src: {"who": "Ada Lovelace", "q": "Máy tính có thể làm ra âm nhạc"} },
  frequency_hop: { branch: "rhythm", name: "Frequency Hop", icon: "📶", lv: 78, mana: 45, cd: 5, kind: "multi", hits: 5, base: 110, desc: "Người chơi dịch chuyển chớp nhoáng giữa 5 quái, mỗi bước để lại sóng tần số màu khác nhau rồi cùng nổ.", en: "Blink between 5 monsters.", fx: "Người chơi dịch chuyển chớp nhoáng giữa 5 quái, mỗi bước để lại sóng tần số màu khác nhau rồi cùng nổ.", seed: "Nhảy tần số: nền của Wi-Fi, Bluetooth.", src: {"who": "Hedy Lamarr", "q": "Ý tưởng nhảy tần số"} },
  code_breaker: { branch: "control", name: "Code Breaker", icon: "🔐", lv: 82, mana: 45, cd: 7, kind: "zone", radius: 5, silence: 8, stun: 2, base: 40, desc: "Bánh răng máy mã Enigma xoay quanh quái, chữ cái mã hoá vỡ vụn: quái mất mọi kỹ năng 6 giây.", en: "Enigma gears break the monsters' code.", fx: "Bánh răng máy mã Enigma xoay quanh quái, chữ cái mã hoá vỡ vụn: quái mất mọi kỹ năng 6 giây.", seed: "Giải mã Enigma.", src: {"who": "Alan Turing", "q": "Giải mã thư mật"} },
  packet_storm: { branch: "rhythm", name: "Packet Storm", icon: "🌐", lv: 86, mana: 47, cd: 5, kind: "multi", hits: 8, base: 90, desc: "Mạng lưới nút sáng nối mọi quái, gói tin ánh sáng bắn qua lại hàng trăm lần.", en: "Light packets bounce through 8 monsters.", fx: "Mạng lưới nút sáng nối mọi quái, gói tin ánh sáng bắn qua lại hàng trăm lần.", seed: "Internet gửi tin theo từng gói nhỏ.", src: {"who": "Paul Baran", "q": "Chia tin nhắn thành gói nhỏ"} },
  zero_void: { branch: "power", name: "Zero Void", icon: "0️⃣", lv: 92, mana: 48, cd: 7, kind: "zone", radius: 6, base: 350, taunt: true, stun: 2, desc: "Số 0 vàng khổng lồ hiện trên trời, lòng số 0 hoá hố đen hút mọi quái vào rồi khép lại.", en: "A giant zero becomes a black hole.", fx: "Số 0 vàng khổng lồ hiện trên trời, lòng số 0 hoá hố đen hút mọi quái vào rồi khép lại.", seed: "Số 0 và hệ chữ số.", src: {"who": "Al-Khwarizmi", "q": "Chữ số 0–9 lan ra khắp thế giới"} },
  algorithm: { branch: "harmony", name: "Algorithm", icon: "🧠", lv: 92, manaGain: 50, cd: 15, kind: "self", haste: 0.5, hasteT: 10, desc: "Chuỗi chiêu tự động: 3 chiêu tiếp theo tung ngay không cần chờ hồi.", en: "Step by step: +50 mana, skills recharge fast.", fx: "Chuỗi chiêu tự động: 3 chiêu tiếp theo tung ngay không cần chờ hồi.", seed: "Thuật toán = các bước theo thứ tự.", src: {"who": "Al-Khwarizmi", "q": "Thuật toán: làm theo từng bước"} },
  // 🐉 TUYỆT CHIÊU THẦN THOẠI – nhận ở 8 khu văn hoá
  dragon_roar: { branch: "power", type: "ult", name: "Dragon Roar", icon: "🐉", lv: 80, mana: 80, cd: 30, kind: "single", base: 260, stun: 1.5, desc: "Rồng đỏ vảy vàng bay xoắn ốc rồi lao xuống quái nổ lớn (đã có bản mẫu).", en: "ULTIMATE: Rồng đỏ vảy vàng bay xoắn ốc rồi lao xuống quái nổ lớn (đã có bản mẫu).", fx: "Rồng đỏ vảy vàng bay xoắn ốc rồi lao xuống quái nổ lớn (đã có bản mẫu).", src: {"who": "Thương Hiệt", "q": "Giải phóng khu Trung Hoa"}, rift: true },
  rune_sword: { branch: "rhythm", type: "ult", name: "Rune Sword", icon: "🗡️", lv: 70, mana: 80, cd: 30, kind: "zone", radius: 4, base: 240, stun: 1, desc: "Kiếm khắc rune khổng lồ rơi từ trời cắm xuống (đã có bản mẫu: Last Word).", en: "ULTIMATE: Kiếm khắc rune khổng lồ rơi từ trời cắm xuống (đã có bản mẫu: Last Word).", fx: "Kiếm khắc rune khổng lồ rơi từ trời cắm xuống (đã có bản mẫu: Last Word).", src: {"who": "Odin", "q": "Giải phóng khu Bắc Âu"}, rift: true },
  ibis_judgment: { branch: "rhythm", type: "ult", name: "Ibis Judgment", icon: "🪶", lv: 60, mana: 80, cd: 30, kind: "aoe", radius: 7, base: 200, desc: "Cánh cổng tượng hình mở, cò quăm ánh sáng sải cánh quét ngang, cân phán xét hiện trên đầu quái.", en: "ULTIMATE: Cánh cổng tượng hình mở, cò quăm ánh sáng sải cánh quét ngang, cân phán xét hiện trên đầu quái.", fx: "Cánh cổng tượng hình mở, cò quăm ánh sáng sải cánh quét ngang, cân phán xét hiện trên đầu quái.", src: {"who": "Thoth", "q": "Giải phóng khu Ai Cập"}, rift: true },
  word_spirit_torii: { branch: "rhythm", type: "ult", name: "Word Spirit Torii", icon: "⛩️", lv: 50, mana: 80, cd: 30, kind: "zone", radius: 6, base: 180, hits: 2, desc: "Hàng cổng torii đỏ mọc thành đường hầm, chữ kana bay thành bầy cá chép lửa.", en: "ULTIMATE: Hàng cổng torii đỏ mọc thành đường hầm, chữ kana bay thành bầy cá chép lửa.", fx: "Hàng cổng torii đỏ mọc thành đường hầm, chữ kana bay thành bầy cá chép lửa.", src: {"who": "Kotodama", "q": "Giải phóng khu Nhật"}, rift: true },
  winged_courier: { branch: "rhythm", type: "ult", name: "Winged Courier", icon: "🪽", lv: 80, mana: 80, cd: 30, kind: "multi", hits: 7, base: 120, desc: "Đôi giày có cánh, người chơi lướt 7 lần như tia chớp, lông vũ vàng bay đầy trời.", en: "ULTIMATE: Đôi giày có cánh, người chơi lướt 7 lần như tia chớp, lông vũ vàng bay đầy trời.", fx: "Đôi giày có cánh, người chơi lướt 7 lần như tia chớp, lông vũ vàng bay đầy trời.", src: {"who": "Hermes", "q": "Giải phóng khu Hy Lạp"}, rift: true },
  ogham_grove: { branch: "control", type: "ult", name: "Ogham Grove", icon: "🗿", lv: 80, mana: 80, cd: 30, kind: "aoe", radius: 8, root: 4, base: 150, desc: "Rừng cột đá Ogham trồi lên vòng tròn, dây leo sáng nối các cột trói cả vùng.", en: "ULTIMATE: Rừng cột đá Ogham trồi lên vòng tròn, dây leo sáng nối các cột trói cả vùng.", fx: "Rừng cột đá Ogham trồi lên vòng tròn, dây leo sáng nối các cột trói cả vùng.", src: {"who": "Ogma", "q": "Giải phóng khu Celt"}, rift: true },
  feathered_serpent: { branch: "rhythm", type: "ult", name: "Feathered Serpent", icon: "🐍", lv: 80, mana: 80, cd: 30, kind: "zone", radius: 6, base: 260, desc: "Rắn lông vũ Kukulkan bay từ kim tự tháp ánh sáng xuống.", en: "ULTIMATE: Rắn lông vũ Kukulkan bay từ kim tự tháp ánh sáng xuống.", fx: "Rắn lông vũ Kukulkan bay từ kim tự tháp ánh sáng xuống.", src: {"who": "Itzamna", "q": "Giải phóng khu Maya"}, rift: true },
  tablet_of_destiny: { branch: "control", type: "ult", name: "Tablet of Destiny", icon: "📜", lv: 90, mana: 80, cd: 30, kind: "zone", radius: 6, base: 300, stun: 3, desc: "Bia đất sét khắc chữ nêm khổng lồ đổ ụp xuống, chữ bay ra thành xích khoá.", en: "ULTIMATE: Bia đất sét khắc chữ nêm khổng lồ đổ ụp xuống, chữ bay ra thành xích khoá.", fx: "Bia đất sét khắc chữ nêm khổng lồ đổ ụp xuống, chữ bay ra thành xích khoá.", src: {"who": "Nabu", "q": "Giải phóng khu Lưỡng Hà"}, rift: true },
  // 🧩 NỘI TẠI (mở theo cấp, tối đa 5 bậc)
  loud_clear:   { branch: "power", type: "passive", name: "Loud & Clear", icon: "🔊", lv: 8,  desc: "Perfect gây thêm +10% mỗi bậc." },
  critical_tone:{ branch: "power", type: "passive", name: "Critical Tone", icon: "✴️", lv: 16, desc: "Chiêu Power có 5% mỗi bậc để chí mạng ×2." },
  steady_voice: { branch: "power", type: "passive", name: "Steady Voice", icon: "🧱", lv: 24, desc: "Khiên khi nói dày thêm 4% mỗi bậc." },
  sharp_ears:   { branch: "control", type: "passive", name: "Sharp Ears", icon: "👂", lv: 8,  desc: "Hiệu ứng khống chế lâu thêm 10% mỗi bậc." },
  echo_chain:   { branch: "control", type: "passive", name: "Echo Chain", icon: "⛓️", lv: 16, desc: "Choáng lan sang 1 quái gần đó (từ bậc 1), thêm 1 quái ở bậc 4." },
  calm_mind:    { branch: "control", type: "passive", name: "Calm Mind", icon: "🧘", lv: 24, desc: "Mỗi lần khống chế: hồi 3 mana mỗi bậc." },
  kind_words:   { branch: "harmony", type: "passive", name: "Kind Words", icon: "🤝", lv: 8,  desc: "Mỗi lần Perfect: hồi 2% máu mỗi bậc." },
  team_spirit:  { branch: "harmony", type: "passive", name: "Team Spirit", icon: "🙌", lv: 16, desc: "Mọi chiêu +3% sát thương mỗi bậc (sau này áp cho cả đội)." },
  warm_heart:   { branch: "harmony", type: "passive", name: "Warm Heart", icon: "❤️", lv: 24, desc: "Máu tối đa +6% mỗi bậc." },
  quick_tongue: { branch: "rhythm", type: "passive", name: "Quick Tongue", icon: "👅", lv: 8,  desc: "Hồi chiêu nhanh hơn 4% mỗi bậc." },
  encore:       { branch: "rhythm", type: "passive", name: "Encore", icon: "🔁", lv: 16, desc: "3% mỗi bậc: chiêu Rhythm tung lại miễn phí." },
  groove:       { branch: "rhythm", type: "passive", name: "Groove", icon: "🕺", lv: 24, desc: "Mỗi quái trúng chiêu Rhythm: +1 mana mỗi bậc." },
};
const BRANCH = { power: { name: "Power", color: "#e5484d", icon: "⚡" }, control: { name: "Control", color: "#3b82f6", icon: "🌀" }, harmony: { name: "Harmony", color: "#2f9e44", icon: "💚" }, rhythm: { name: "Rhythm", color: "#e8590c", icon: "🔥" } };
function skillRank(id) { return (save.combat.skills[id] || 0); }
const pr = id => skillRank(id);   // bậc của nội tại
function isActive(id) { const S = SKILLS[id]; return S && S.type !== "passive"; }
const SKILL_MAX = 10, FORM_AT = [1, 4, 7, 10];   // bậc tối đa chiêu chủ động · bậc đổi hình dạng (FX3D)
function maxRank(id) { const S = SKILLS[id]; return S && S.type === "passive" ? 5 : SKILL_MAX; }
function skillForm(r) { return r >= 10 ? 4 : r >= 7 ? 3 : r >= 4 ? 2 : 1; }
function isLearned(id) { const S = SKILLS[id]; return !!S && (S.start || S.type === "passive" ? true : !!(save.combat.learned || {})[id]); }
function spTotal() { const L = save.level || 1; return 2 * L + 3 * Math.floor(L / 10); }   // 2 điểm mỗi cấp + 3 mỗi 10 cấp (Lv.100 ≈ 230 điểm < ~700 điểm để nâng hết)
function spUsed() { let n = 0; for (const id in save.combat.skills) { const S = SKILLS[id]; if (!S) continue; n += S.type === "passive" ? save.combat.skills[id] : Math.max(0, save.combat.skills[id] - 1); } return n; }   // bậc 1 của chiêu chủ động là miễn phí (có khi học được)
function spLeft() { return spTotal() - spUsed(); }

/* ---------- 4. VŨ KHÍ: 4 dòng × 8 bậc + dòng hiếm Maestro (đăng ký vào ITEMS lúc chạy) ---------- */
const W_TIER = [{ lv: 1, pct: 8, r: "common" }, { lv: 8, pct: 15, r: "common" }, { lv: 16, pct: 22, r: "uncommon" }, { lv: 28, pct: 30, r: "uncommon" }, { lv: 42, pct: 40, r: "rare" }, { lv: 58, pct: 52, r: "epic" }, { lv: 75, pct: 65, r: "epic" }, { lv: 90, pct: 80, r: "legendary" }];
const W_LINES = {
  power:   { icon: "📢", names: ["Wooden Megaphone", "Brass Horn", "Lightning Rod", "Thunder Hammer", "Storm Horn", "Sky Breaker", "Titan Horn", "Dragon Roar Horn"] },
  control: { icon: "🪄", names: ["Chalk Wand", "Crystal Wand", "Frost Scepter", "Moon Staff", "Star Scepter", "Ice Crown Staff", "Night Scepter", "Time Scepter"] },
  harmony: { icon: "🪈", names: ["Bamboo Flute", "Little Lyre", "Bell Staff", "Leaf Harp", "Sun Harp", "Rainbow Lyre", "Spirit Bell", "World Tree Harp"] },
  rhythm:  { icon: "🥢", names: ["Bamboo Sticks", "Twin Batons", "Fire Tambourine", "Storm Gloves", "Thunder Drums", "Lava Sticks", "Comet Drums", "Phoenix Drums"] }
};
const RESO = ["repeat", "answer", "build", "name"];
const ASK_LV = 40;   // loại bài Ask (đặt câu hỏi) mở từ Lv.40
function deckTypes() { return CHALLENGES.map(c => c.t).filter(t => challengeOpen(t)); }
function registerWeapons() {
  Object.keys(W_LINES).forEach((line, li) => W_LINES[line].names.forEach((nm, t) => {
    const T = W_TIER[t], id = "w_" + line + (t + 1), reso = RESO[(li + t) % 4];
    ITEMS[id] = { name: nm, icon: W_LINES[line].icon, price: Math.round(20 * Math.pow(1.9, t)), rarity: T.r, lv: T.lv, weapon: { line, tier: t + 1, pct: T.pct, reso },
      desc: "Tier " + (t + 1) + " · +" + T.pct + "% " + BRANCH[line].name + " · 🎵 " + TASK_ICON[reso] + " " + reso + " +30%" };
  }));
  [["Starlight Baton", 40, 25], ["Aurora Baton", 70, 45], ["Baton of the First Voice", 90, 65]].forEach(([nm, lv, pct], i) =>
    ITEMS["w_maestro" + (i + 1)] = { name: nm, icon: "🪄", price: 0, rarity: "legendary", lv, weapon: { line: "all", tier: i + 1, pct, reso: null, maestro: true }, desc: "✨ Maestro · +" + pct + "% all 4 branches · only from bosses, quests and the Arena" });
}
function curWeapon() { const id = save.combat.weapons[0]; return id && ITEMS[id] ? ITEMS[id] : null; }
function equipWeapon(id) {
  const it = ITEMS[id]; if (!it || !it.weapon) return;
  if (playerLevel() < it.lv) { flash("🔒 Need Lv." + it.lv); return; }
  const C = save.combat, prev = C.weapons[0];   // chỉ 1 vũ khí đang cầm = weapons[0]; lấy từ túi, vũ khí cũ trả về túi (như trang phục)
  if (!takeItem(save.items, id)) return;
  if (prev && !addItem(save.items, BAG_SIZE, prev)) { addItem(save.items, BAG_SIZE, id); flash(bagFullMsg(prev)); return; }
  C.weapons = [id, null]; C.wIdx = 0; saveNow(); drawCombatHud(); flash(it.icon + " " + it.name + " equipped!<div style='font-size:13px;font-weight:400'>" + it.desc + "</div>");
}

/* ---------- 5. TRẠNG THÁI ---------- */
const CB = { buff: { shield: 0, shieldUntil: 0, dmg: 0, dmgUntil: 0, hasteUntil: 0 }, on: false, sec: null, mons: [], drops: [], cast: null, cd: {}, atkCd: 0, mp: 100, harmony: 0, harmonyUntil: 0, lastType: "", lastHurt: 0, ko: false, wideBefore: false, rerollAt: 0, dayWarned: false, rings: [] };
function hpMax() { const g = gear(); return Math.round((100 + ((save.level || 1) - 1) * 5) * (1 + 0.06 * pr("warm_heart")) + g.hp + g.stamina * 2); }   // + máu của trang bị (stamina cũ = hp ×2)
function hpNow() { return save.energy / 100 * hpMax(); }
function setHp(v) { save.energy = Math.max(0, Math.min(100, v / hpMax() * 100)); }

function initCombat() {
  const C = save.combat = save.combat || {};
  C.skills = C.skills || {}; C.learned = C.learned || {}; C.seenMon = C.seenMon || {};
  C.slots = C.slots || ["echo_blast", "question_arrow", "harmony_heal", "drum_roll"];
  if (!C.skillV2) {   // 27/11: chuyển save cũ sang bộ chiêu mới – chiêu cũ đã bỏ trả lại điểm (spLeft tự tính), 4 chiêu khởi đầu có sẵn bậc ≥ 1
    C.skillV2 = true;
    for (const id in C.skills) if (!SKILLS[id]) delete C.skills[id];
    C.slots = C.slots.map(id => SKILLS[id] && SKILLS[id].type !== "passive" ? id : null);
    ["echo_blast", "question_arrow", "harmony_heal", "drum_roll"].forEach(id => { if (C.slots.indexOf(id) < 0) { const k = C.slots.indexOf(null); if (k >= 0) C.slots[k] = id; } });
  }
  for (const id in SKILLS) if (SKILLS[id].start && !C.skills[id]) C.skills[id] = 1;
  C.weapons = C.weapons || [null, null]; C.wIdx = C.wIdx || 0;
  if (!C.wOne) {   // chuyển save cũ (2 vũ khí đổi qua lại) sang 1 vũ khí cầm + phần còn lại trong túi
    C.wOne = true;
    if (C.starter) { const W = C.weapons, i = C.wIdx || 0, cur = W[i] || W[1 - i] || null, other = W[i] && W[1 - i] ? W[1 - i] : null;
      if (cur && save.items[cur]) takeItem(save.items, cur);
      if (other && !save.items[other]) save.items[other] = 1;
      C.weapons = [cur, null]; C.wIdx = 0; }
  }
  C.deck = C.deck || {}; CHALLENGES.forEach(c => C.deck[c.t] = C.deck[c.t] || { n: 0, good: 0 });
  registerWeapons();
  if (!C.starter) { C.starter = true; addItem(save.items, BAG_SIZE, "w_rhythm1"); C.weapons = ["w_power1", null]; C.wIdx = 0; C.wOne = true; }   // quà tân thủ
  buildCombatUi();
  setTimeout(() => { if (typeof LORE !== "undefined") LORE.checkLearn(); }, 4000);   // TẠM: mở chiêu danh nhân theo cấp (chưa có nhiệm vụ)
}
function buildCombatUi() {
  const css = document.createElement("style"); css.textContent = `
#cbHud{position:fixed;left:12px;top:calc(160px + env(safe-area-inset-top,0px));display:none;flex-direction:column;gap:4px;z-index:5;pointer-events:none}
#cbBtns{position:fixed;right:10px;bottom:calc(14px + env(safe-area-inset-bottom,0px));width:210px;height:210px;display:none;z-index:6}
#cbBtns button{position:absolute;font-size:22px;touch-action:none;-webkit-user-select:none;user-select:none}
#cbAtk{right:10px;bottom:10px;width:84px;height:84px;--c:#f4efe0!important;color:#3a2a10!important;text-shadow:none!important;font-size:34px!important}
.cbSk{width:54px;height:54px}.cbSk .cd{position:absolute;inset:0;border-radius:50%;background:rgba(10,14,30,.7);font:700 13px system-ui;display:flex;align-items:center;justify-content:center}
.cbSk.rec{transform:scale(1.14);box-shadow:0 0 0 3px #1b2340,0 0 0 5px #35f0e8,0 0 18px 9px rgba(53,240,232,.85),inset 0 -4px 6px rgba(0,0,0,.35)}
#cbCard{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(286px + env(safe-area-inset-bottom,0px));width:min(92vw,420px);display:none;z-index:7}
#cbCard .t{display:flex;justify-content:space-between;align-items:center;gap:6px}#cbCard .t small{font:600 11px var(--ev-font);color:var(--ev-mut);margin-left:6px}
#cbCard .q{font:700 20px var(--ev-font);margin:8px 0 2px}#cbCard .vi{font-size:13px;color:var(--ev-mut)}#cbCard .h{font-size:12px;color:var(--ev-gold);margin-top:4px;min-height:0}
#cbCard .bar{height:4px;background:rgba(255,255,255,.15);border-radius:2px;margin-top:8px}#cbCard .bar div{height:100%;background:var(--ev-gold);border-radius:2px}
#cbCard #cbReroll{padding:3px 10px;font-size:12px}
#cbKo{position:fixed;inset:0;background:rgba(80,80,80,.7);display:none;align-items:center;justify-content:center;color:#fff;font:800 24px system-ui;z-index:20;text-align:center}
#cbFood{position:fixed;right:14px;bottom:calc(222px + env(safe-area-inset-bottom,0px));display:none;flex-direction:row;gap:6px;z-index:5}
#cbFood button{width:48px;height:48px;font-size:22px}#cbFood button.empty{opacity:.4;filter:grayscale(.6)}
#cbFood b{position:absolute;right:3px;bottom:0;font:700 11px var(--ev-font);color:#fff;text-shadow:0 1px 2px #000}#cbFood i{position:absolute;left:3px;top:1px;font-size:10px;font-style:normal}
body.cbOn #sayBtn{bottom:calc(270px + env(safe-area-inset-bottom,0px))!important;right:14px!important}`;
  document.head.appendChild(css);
  const d = document.createElement("div"); d.innerHTML = `
<div id="cbHud"><div id="cbZone" style="font:700 12px system-ui;color:#fff;text-shadow:0 1px 3px #000"></div></div>
<div id="cbBtns"><button id="cbAtk" class="ev-round">⚔️</button></div>
<div id="cbFood"><button id="cbF0" class="ev-slot"></button><button id="cbF1" class="ev-slot"></button><button id="cbF2" class="ev-slot"></button></div>
<div id="cbCard" class="ev-panel"><div class="ev-in"><div class="t"><span id="cbCt"></span><button class="ev-btn alt" id="cbReroll">🔄 New card</button></div><div class="q" id="cbCq"></div><div class="vi" id="cbVi"></div><div class="h" id="cbCh"></div><div class="bar"><div id="cbCbar"></div></div></div></div>
<div id="cbKo"><div>🤐 You lost your voice…<div style="font:500 14px system-ui;margin-top:8px">Mất giọng! Về cổng vùng sau 2 giây</div></div></div>`;
  document.body.appendChild(d);
  const B = $("cbBtns");
  [0, 1, 2, 3].forEach(i => { const a = i * Math.PI / 5.6, r = 116, e = document.createElement("button"); e.className = "cbSk ev-round"; e.id = "cbS" + i; e.style.right = Math.round(52 + r * Math.cos(a) - 27) + "px"; e.style.bottom = Math.round(52 + r * Math.sin(a) - 27) + "px"; B.appendChild(e); skillButton(e, i); });
  $("cbAtk").addEventListener("pointerdown", e => { e.preventDefault(); normalAttack(); });
  [0, 1, 2].forEach(i => $("cbF" + i).onclick = () => { const id = $("cbF" + i).dataset.id, kind = FOOD_KINDS[i].k; if (!id) { flash("Mua ở Shop 24h / Buy at Shop 24h"); return; }
    if (kind === "mana") { const it = ITEMS[id], M = typeof mpMax === "function" ? mpMax() : 100; if (CB.mp >= M) { flash("💧 Mana đầy / Mana is full"); return; } if (!save.items[id]) return; takeItem(save.items, id); CB.mp = Math.min(M, CB.mp + it.mana); saveNow(); popText("💧+" + it.mana, player.position, "#3fa3ff"); }
    else useItem(id);
    drawCombatHud(); });
  $("cbReroll").onclick = reroll;
  drawCombatHud();
}
function drawCombatHud() {
  if (!$("cbHud")) return;
  for (let i = 0; i < 4; i++) { const id = save.combat.slots[i], S = SKILLS[id], b = $("cbS" + i); b.style.display = S ? "block" : "none"; if (S) { b.style.setProperty("--c", BRANCH[S.branch].color); b.innerHTML = S.icon + "<div class='cd' style='display:none'></div>"; } }
  showWeaponInHand();
  drawFoodSlots(true);
}
const FOOD_KINDS = [{ k: "energy", ic: "❤️" }, { k: "mana", ic: "💧" }, { k: "cure", ic: "☠️" }];
let foodSig = "";
function drawFoodSlots(force) {   // 3 ô cố định: hồi máu · hồi mana · giải độc
  const picks = FOOD_KINDS.map(K => Object.keys(save.items).filter(k => ITEMS[k] && ITEMS[k][K.k] && !ITEMS[k].slot && !ITEMS[k].weapon).sort((x, y) => (ITEMS[y][K.k] > 0 ? ITEMS[y][K.k] : 0) - (ITEMS[x][K.k] > 0 ? ITEMS[x][K.k] : 0))[0] || "");
  const sig = picks.map(k => k + (save.items[k] || "")).join("|"); if (!force && sig === foodSig) return; foodSig = sig;
  picks.forEach((f, i) => { const b = $("cbF" + i); if (!b) return; b.dataset.id = f; b.classList.toggle("empty", !f);
    b.innerHTML = (f ? ITEMS[f].icon + "<b>" + save.items[f] + "</b>" : "") + "<i>" + FOOD_KINDS[i].ic + "</i>"; });
}

let handW = null;
function showWeaponInHand() {   // vũ khí hiện trên tay khi ở vùng hoang dã
  if (typeof WEAPON_MODELS === "undefined" || !WEAPON_MODELS) return;
  const w = CB.on ? curWeapon() : null, key = w ? w.name : "";
  if (handW === key) return; handW = key;
  try { WEAPON_MODELS.detach(player); if (w && !WEAPON_MODELS.attach(player, WEAPON_MODELS.make(w))) handW = null; } catch (e) { handW = null; }
}
/* ---------- 6. VÀO / RA VÙNG HOANG DÃ ---------- */
function setCombatOn(on, sec) {
  const wasOn = CB.on; CB.on = on; CB.sec = sec; document.body.classList.toggle("cbOn", on);
  ["cbHud", "cbFood"].forEach(id => $(id).style.display = on ? "flex" : "none"); $("cbBtns").style.display = on ? "block" : "none";
  if (on) { if (!wasOn) CB.wideBefore = camWide; if (!camWide) setWide(true); $("cbZone").textContent = "📍 " + sec.name + " · Ring " + sec.ring; drawCombatHud();
    if (!wasOn) { if (!save.combat.tut && typeof evTutorial === "function") evTutorial(); if (typeof gateHint === "function") gateHint(); }
    flash("🌿 " + sec.name + "<div style='font-size:13px;font-weight:400'>Monster zone! Tap ⚔️ to hit. HOLD a skill and speak to cast. / Vùng quái: chạm ⚔️ để đánh, GIỮ nút chiêu và nói để ra chiêu.</div>"); }
  else { if (!CB.wideBefore && camWide) setWide(false); endCast(true); if (typeof evHarmonyOff === "function") evHarmonyOff(); }
  if (typeof evHudUpdate === "function") evHudUpdate();
  showWeaponInHand();
}

/* ---------- 7. VÒNG LẶP ---------- */
function updateCombat(dt, t) {
  if (typeof FX3D !== "undefined" && FX3D.ready()) FX3D.update(dt);
  if (!save || !save.combat || typeof WILDS === "undefined") return;
  if (typeof LORE !== "undefined" && (LORE.isOpen() || (CB.on && LORE.meetCheck()))) return;   // đang đọc truyện quái / học chiêu: trận đấu tạm dừng
  dayTick(dt);
  const sec = (!room && !maze) ? WILDS.sectorAt(player.position.x, player.position.z) : null;
  if (!!sec !== CB.on || (sec && CB.sec && (sec.dir !== CB.sec.dir || sec.ring !== CB.sec.ring))) setCombatOn(!!sec, sec);
  CB.mp = Math.min(typeof mpMax === "function" ? mpMax() : 100, CB.mp + dt * 12.5 * (1 + ((typeof gear === "function" && gear().mpRegen) || 0) / 100));   // mana đầy lại ~8 giây; thắt lưng (mpRegen) hồi nhanh hơn. Máu KHÔNG tự hồi.
  for (const k in CB.cd) CB.cd[k] = Math.max(0, CB.cd[k] - dt);
  CB.atkCd = Math.max(0, CB.atkCd - dt);
  if (CB.on) { spawnTick(); netTick(dt); warmSkillFx(); }
  warmTick(dt);
  const mdt = typeof FEEL !== "undefined" ? FEEL.scaleDt(dt) : dt;   // khựng hình khi trúng đòn (parts/combat/feel.js)
  CB.mons.forEach(M => monTick(M, mdt, t));
  CB.mons = CB.mons.filter(M => !M.gone);
  dropTick(dt, t);
  if (CB.cast) { CB.cast.left -= dt; $("cbCbar").style.width = Math.max(0, CB.cast.left / CB.cast.limit * 100) + "%"; if (CB.cast.left <= 0 && !CB.cast.rec) resolveCast([], "timeout"); }
  if (CB.on) hudTick();
}
/* Chống giật khi ra chiêu: lần đầu một hiệu ứng xuất hiện, card đồ hoạ phải biên dịch shader (~0,3–0,6 giây đứng hình).
   Vào vùng hoang dã (hoặc đổi chiêu / lên bậc): lần lượt phát hiệu ứng của 4 chiêu đang gắn ở chỗ rất xa (ngoài tầm nhìn)
   trong chính scene game rồi gọi renderer.compile → shader được biên dịch sẵn (cùng đèn, sương mù, bóng như thật). */
let WARM = null;
function warmSkillFx() {
  if (typeof renderer === "undefined" || (typeof FX3D === "undefined" && (typeof SKILL_VFX === "undefined" || !SKILL_VFX))) return;
  const ids = save.combat.slots.filter(id => SKILLS[id]), key = ids.map(id => id + skillRank(id)).join(",");
  if (WARM && WARM.key === key) return;
  WARM = { key, q: ids.slice(), t: 0, next: 0, comp: [] };
}
function warmTick(dt) {
  if (!WARM || (!WARM.q.length && !WARM.comp.length)) return; WARM.t += dt;
  if (WARM.q.length && WARM.t >= WARM.next) { const id = WARM.q.shift(), F = new THREE.Vector3(player.position.x, 0, player.position.z + 600); WARM.next = WARM.t + 0.45;
    const sh = window.CAM_SHAKE; if (typeof FX3D !== "undefined") FX3D.quietUntil = performance.now() + 2500; try { playSkillFx(id, Math.max(1, skillRank(id)), F, F.clone().add(new THREE.Vector3(0, 0, -4)), SKILLS[id].radius || 2); } catch (e) {} window.CAM_SHAKE = sh;
    WARM.comp.push(WARM.t + 0.05, WARM.t + 0.25); }
  if (WARM.comp.length && WARM.t >= WARM.comp[0]) { WARM.comp.shift(); try { renderer.compile(scene, camera); } catch (e) {} }
}
let netT = 0;
function netSend(ev, payload) { try { if (online && typeof chan !== "undefined" && chan) chan.send({ type: "broadcast", event: ev, payload: Object.assign({ id: myId }, payload) }); } catch (e) {} }
function netTick(dt) {   // chủ phòng gửi trạng thái quái ~3 lần/giây
  if (!CB.on || !online || !sectorPlayers(CB.sec).length || !amHost(CB.sec)) return;
  if ((netT += dt) < 0.33) return; netT = 0;
  const list = CB.mons.filter(M => !M.remote && !M.dead && M.dir === CB.sec.dir).map(M => [M.key, M.type, M.lv, +M.g.position.x.toFixed(1), +M.g.position.z.toFixed(1), Math.round(M.hp), M.hpMax, M.tele ? [+M.tele.x.toFixed(1), +M.tele.z.toFixed(1)] : 0, M.stun > 0 ? "hit" : "walk"]);
  netSend("mons", { dir: CB.sec.dir, ring: CB.sec.ring, l: list });
}
function combatWire(ch) {
  ch.on("broadcast", { event: "mons" }, ({ payload: m }) => {
    if (!CB.on || m.dir !== CB.sec.dir || m.ring !== CB.sec.ring || m.id > myId && amHost(CB.sec)) return;
    CB.mons.filter(M => !M.remote && M.dir === m.dir && !M.dead).forEach(M => { scene.remove(M.g); M.gone = true; });   // không phải chủ phòng: bỏ quái của mình
    m.l.forEach(([k, type, lv, x, z, hp, hpMax, tele, st]) => {
      let M = CB.mons.find(o => o.key === k);
      if (!M) { if (!MON[type]) return; M = makeMon(type, CB.sec, x, z); M.key = k; M.remote = true; M.lv = lv; M.hpMax = hpMax; }
      M.nx = x; M.nz = z; M.hp = Math.min(M.hp, hp); if (hp > M.hp + 5) M.hp = hp; M.seen = performance.now(); M.nst = st; if (tele && !M.tele) M.ntele = tele; });
  });
  ch.on("broadcast", { event: "mdmg" }, ({ payload: m }) => {   // mình là chủ phòng: nhận sát thương của người khác
    const M = CB.mons.find(o => o.key === m.k && !o.remote); if (!M || M.dead) return;
    if (m.fx) { if (m.fx.st) M.stun = Math.max(M.stun, m.fx.st); if (m.fx.ro) M.root = m.fx.ro; if (m.fx.si) M.silence = m.fx.si; if (m.fx.sl) { M.slow = m.fx.sl; M.slowT = m.fx.slT; } }
    dealDamage(M, m.d, !!m.s, m.id); popText("-" + m.d, M.g.position, "#868e96");
  });
  ch.on("broadcast", { event: "mdie" }, ({ payload: m }) => {
    const M = CB.mons.find(o => o.key === m.k); if (!M || M.dead) return; M.dead = true; M.deadT = 0; if (M.tele) { scene.remove(M.tele.ring); M.tele = null; }
    const me = m.sh && m.sh[myId]; if (me) rewardKill(M, me[0], me[1]);
  });
  ch.on("broadcast", { event: "mhit" }, ({ payload: m }) => {   // quái của chủ phòng đánh trúng mình
    if (m.to !== myId || CB.ko) return; if (Math.hypot(player.position.x - m.x, player.position.z - m.z) < m.r + 0.3) hurtPlayer({ lv: m.lv, T: { dmg: m.d } });
  });
}
let cbHudT = 0;
function hudTick() {
  if (typeof evHarmonyFx === "function") evHarmonyFx();   // hào quang Harmony: mỗi khung hình
  if ((cbHudT += 1) % 6) return;   // cập nhật thanh ~10 lần/giây
  if (typeof evHudUpdate === "function") evHudUpdate(); drawFoodSlots();
  for (let i = 0; i < 4; i++) { const id = save.combat.slots[i], S = SKILLS[id], b = $("cbS" + i); if (!S) continue; const c = b.querySelector(".cd"), cd = CB.cd[id] || 0, low = CB.mp < S.mana;
    c.style.display = cd > 0 || low ? "flex" : "none"; c.textContent = cd > 0 ? Math.ceil(cd) + "s" : "💧"; }
}
function dayTick(dt) {
  const key = new Date().toDateString(); if (save.combat.day !== key) { save.combat.day = key; save.combat.daySec = 0; CB.dayWarned = false; }
  if (!document.hidden) save.combat.daySec = (save.combat.daySec || 0) + dt;
  if (save.combat.daySec > DAY_LIMIT && !CB.dayWarned && CB.on) { CB.dayWarned = true; flash("😴 Time to rest your voice!<div style='font-size:13px;font-weight:400'>Hôm nay đã chơi hơn 2 giờ: đánh quái không còn kinh nghiệm. Mai quay lại nhé!</div>"); }
}

/* ---------- 8. SINH QUÁI + HÀNH VI ---------- */
function ringLevel(x, z) { const d = Math.max(Math.abs(x), Math.abs(z)); return Math.max(1, Math.min(100, Math.round(1 + (d - 150) / 90 * 24))); }
function spawnTick() {
  if (!amHost(CB.sec)) return;
  const s = CB.sec, here = CB.mons.filter(M => M.dir === s.dir && !M.dead).length;
  if (here >= 14 || Math.random() > 0.12) return;   // dày hơn (chủ dự án 17/11): tối đa 14 quái mỗi vùng
  const pts = WILDS.spawnPoints(s.dir, s.ring) || []; if (!pts.length) return;
  const far = pts.filter(p => Math.hypot(p.x - player.position.x, p.z - player.position.z) > 14 && Math.hypot(p.x - player.position.x, p.z - player.position.z) < 45);
  const p = (far.length ? far : pts)[Math.floor(Math.random() * (far.length ? far.length : pts.length))];
  const list = (s.ring >= 2 ? SEASON_MON2 : SEASON_MON)[s.season] || SEASON_MON.spring; makeMon(list[Math.floor(Math.random() * list.length)], s, p.x, p.z);
}
let monSeq = 0;
function makeMon(type, sec, x, z) {
  const T = MON[type], lv = ringLevel(x, z);
  let model = null; try { if (MONSTER_MODELS.make) model = MONSTER_MODELS.make(type, sec.season, lv); } catch (e) {}
  if (!model) { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 10), mat(0xffd43b)); b.position.y = 0.7; g.add(b); model = { g, update() {} }; }
  const g = model.g; g.position.set(x, 0, z); scene.add(g);
  const TT = model.name ? Object.assign({}, T, { name: model.name }) : T;   // quái Tripo mang tên riêng (To He, Tacke Gecko…), giữ chỉ số loài cũ
  const hpm = Math.round((40 + lv * 15) * T.hp);
  const M = { tag: null, key: myId + "-" + (++monSeq), ring: sec.ring, type, T: TT, lv, dir: sec.dir, contrib: {}, g, model, hp: hpm, hpMax: hpm, home: { x, z }, tx: x, tz: z, state: "idle", atkT: 0, tele: null, stun: 0, dmgSkill: 0, dmgAll: 0, dead: false, gone: false, hurtT: 0 };
  evMonTag(M); g.add(M.tag);   // nhãn tên đổi màu theo cấp + thanh máu (parts/ui/hud.js)
  CB.mons.push(M); return M;
}
function monTick(M, dt, t) {
  if (M.tag && !M.dead) evMonTag(M);   // cập nhật thanh máu khi M.hp đổi (cả quái remote)
  const p = M.g.position, P = player.position, dist = Math.hypot(P.x - p.x, P.z - p.z);
  if (M.dead) { if (!M.fxDone) { M.fxDone = 1; if (typeof FEEL !== "undefined") FEEL.death(M); } M.deadT += dt; M.model.update(dt, t, "die"); M.g.scale.setScalar(Math.max(0.01, 1 - Math.max(0, M.deadT - 0.7) / 0.3)); if (M.deadT > 1) { scene.remove(M.g); M.gone = true; } return; }
  if (!CB.on || CB.sec.dir !== M.dir) { if (dist > 120 || M.remote) { scene.remove(M.g); M.gone = true; } return; }
  if (!M.remote && dist > 75 && M.hp >= M.hpMax && (() => { const q = monTarget(M).pos; return Math.hypot(q.x - p.x, q.z - p.z) > 75; })()) { scene.remove(M.g); M.gone = true; return; }   // quái lành lặn ở quá xa: dọn đi để quái mới sinh gần người chơi
  if (M.remote) {   // quái của "chủ phòng": chỉ nội suy vị trí nhận qua mạng
    if (performance.now() - M.seen > 2500) { scene.remove(M.g); M.gone = true; return; }
    const dx = M.nx - p.x, dz = M.nz - p.z, d = Math.hypot(dx, dz); if (d > 0.05) { p.x += dx * Math.min(1, dt * 6); p.z += dz * Math.min(1, dt * 6); M.g.rotation.y = Math.atan2(dx, dz); }
    if (M.ntele && !M.tele) { const ring = teleRing(M); ring.position.set(M.ntele[0], 0.06, M.ntele[1]); M.tele = { t: 0, ring, x: M.ntele[0], z: M.ntele[1], remote: true }; }
    if (M.tele) { M.tele.t += dt; M.tele.ring.scale.setScalar(0.4 + Math.min(1, M.tele.t / 0.8) * 0.6); if (M.tele.t >= 0.8) { scene.remove(M.tele.ring); M.tele = null; M.ntele = null; } }
    M.model.update(dt, t, M.hurtT > 0 ? (M.hurtT -= dt, "hit") : M.nst || "idle"); return;
  }
  if (M.kb && typeof FEEL !== "undefined") FEEL.kbTick(M, dt);   // văng lùi khi trúng đòn
  if (M.stun > 0) { M.stun -= dt; M.model.update(dt, t, "hit"); return; }
  M.root = Math.max(0, (M.root || 0) - dt); M.silence = Math.max(0, (M.silence || 0) - dt); M.slowT = Math.max(0, (M.slowT || 0) - dt);
  const spd = M.slowT > 0 ? 1 - (M.slow || 0) : 1;
  const tg = monTarget(M), P2 = tg.pos, dist2 = Math.hypot(P2.x - p.x, P2.z - p.z);
  const fromHome = Math.hypot(p.x - M.home.x, p.z - M.home.z), aggro = !(tg.me && CB.ko) && dist2 < 9 && fromHome < 25;
  let state = "idle";
  if (M.tele) {   // đang ra đòn: vòng đỏ báo trước, hết 0,8 s thì trúng nếu người chơi còn trong vòng
    M.tele.t += dt; M.tele.ring.scale.setScalar(0.4 + M.tele.t / 0.8 * 0.6); state = "attack";
    if (M.tele.t >= 0.8) { if (M.tele.who === myId) { if (Math.hypot(P.x - M.tele.x, P.z - M.tele.z) < M.T.range + 0.3) hurtPlayer(M); }
      else netSend("mhit", { to: M.tele.who, x: M.tele.x, z: M.tele.z, r: M.T.range, lv: M.lv, d: M.T.dmg }); scene.remove(M.tele.ring); M.tele = null; M.atkT = 2.2; }
  } else if (aggro) {
    M.g.rotation.y = Math.atan2(P2.x - p.x, P2.z - p.z);
    if (dist2 > M.T.range * 0.8 && !M.root && !M.kb) { const s = 2.3 * M.T.speed * spd * dt; movMon(M, (P2.x - p.x) / dist2 * s, (P2.z - p.z) / dist2 * s); state = "walk"; }
    M.atkT -= dt;
    if (dist2 < M.T.range + 0.6 && M.atkT <= 0 && !M.silence) { const ring = teleRing(M); ring.position.set(P2.x, 0.06, P2.z); M.tele = { t: 0, ring, x: P2.x, z: P2.z, who: tg.id }; }
  } else {   // đi tuần quanh nhà
    if (Math.hypot(M.tx - p.x, M.tz - p.z) < 0.5 || fromHome > 25) { M.tx = M.home.x + (Math.random() - 0.5) * 16; M.tz = M.home.z + (Math.random() - 0.5) * 16; }
    const dx = M.tx - p.x, dz = M.tz - p.z, d = Math.hypot(dx, dz) || 1; if (!M.root) movMon(M, dx / d * 0.9 * spd * dt, dz / d * 0.9 * spd * dt); M.g.rotation.y = Math.atan2(dx, dz); state = "walk";
    if (M.hp < M.hpMax && dist > 20) M.hp = Math.min(M.hpMax, M.hp + dt * M.hpMax * 0.05);
  }
  if (M.hurtT > 0) { M.hurtT -= dt; state = "hit"; }
  M.model.update(dt, t, state);
}
function teleRing(M) { const ring = new THREE.Mesh(new THREE.RingGeometry(M.T.range * 0.85, M.T.range, 28), new THREE.MeshBasicMaterial({ color: 0xe5484d, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false })); ring.rotation.x = -Math.PI / 2; scene.add(ring); return ring; }
function sectorPlayers(sec) {   // người chơi khác đang ở cùng vùng (cùng hướng, cùng vòng)
  if (!sec || typeof others === "undefined") return [];
  return Object.keys(others).filter(id => { const o = others[id]; if (performance.now() - (o.last || 0) > 20000) return false; const s2 = WILDS.sectorAt(o.g.position.x, o.g.position.z); return s2 && s2.dir === sec.dir && s2.ring === sec.ring; });
}
function amHost(sec) { const ids = sectorPlayers(sec); return !ids.some(id => id < myId); }   // người có mã nhỏ nhất trong vùng làm "chủ phòng" điều khiển quái
function monTarget(M) {   // quái đuổi người gần nhất trong vùng
  let best = { id: myId, pos: player.position, me: true }, bd = CB.ko ? 1e9 : M.g.position.distanceTo(player.position);
  sectorPlayers(CB.sec).forEach(id => { const d = M.g.position.distanceTo(others[id].g.position); if (d < bd) { bd = d; best = { id, pos: others[id].g.position, me: false }; } });
  return best;
}
function movMon(M, dx, dz) { const p = M.g.position; if (!blocked(p.x + dx, p.z)) p.x += dx; if (!blocked(p.x, p.z + dz)) p.z += dz; }
function hurtPlayer(M) {
  if (CB.ko) return;
  let dmg = (5 + M.lv * 1.3) * M.T.dmg * (1 - Math.min(60, gear().resist || 0) / 100);
  if (CB.cast) dmg *= Math.max(0.1, 0.3 - 0.04 * pr("steady_voice"));   // 🛡️ khiên giọng nói khi đang nói (Steady Voice dày thêm)
  if (performance.now() < CB.buff.shieldUntil) dmg *= 1 - CB.buff.shield;   // Chord Shield / Grand Chorus
  setHp(hpNow() - dmg); CB.lastHurt = performance.now(); charAct(player, "Hit_A"); if (typeof FEEL !== "undefined") FEEL.hurt(dmg > hpMax() * 0.15);
  popText("-" + Math.round(dmg), player.position, CB.cast ? "#35c9c4" : "#e5484d");
  if (hpNow() <= 0) knockOut();
  saveSoon();
}
function knockOut() {   // hết máu: xám 2 giây rồi về cổng vùng
  CB.ko = true; endCast(true); $("cbKo").style.display = "flex"; talking = true;
  setTimeout(() => {
    const G2 = CB.sec && CB.sec.ring >= 2 && WILDS.gates2 ? WILDS.gates2 : WILDS.gates, g = (G2 || []).find(G => CB.sec && G.dir === CB.sec.dir) || WILDS.gates[0];
    if (g) { player.position.set(g.x, 0, g.z); camSnap = true; }
    setHp(hpMax()); CB.ko = false; talking = false; $("cbKo").style.display = "none"; saveNow(); renderHud();
  }, 2000);
}
let saveT = null; function saveSoon() { if (!saveT) saveT = setTimeout(() => { saveT = null; saveNow(); renderHud(); }, 1500); }

/* ---------- 9. ĐÁNH THƯỜNG + CHIÊU ---------- */
function nearestMon(r) { let best = null, bd = r; CB.mons.forEach(M => { if (M.dead || M.dir !== (CB.sec && CB.sec.dir)) return; const d = M.g.position.distanceTo(player.position); if (d < bd) { bd = d; best = M; } }); return best; }
function normalAttack() {
  if (!CB.on || CB.ko || CB.atkCd > 0) return;
  const M = nearestMon(3.2); CB.atkCd = 0.7; charAct(player, "1H_Melee_Attack_Chop");
  if (M) player.rotation.y = Math.atan2(M.g.position.x - player.position.x, M.g.position.z - player.position.z);
  if (typeof FEEL !== "undefined") FEEL.slash();   // vệt chém sáng (cả khi đánh trượt)
  if (!M) return;
  CB.mp = Math.min(100, CB.mp + 3);
  if (typeof SKILL_VFX !== "undefined" && SKILL_VFX) SKILL_VFX.hit(M.g.position.clone(), "#ffffff");
  dealDamage(M, Math.round(4 + (save.level || 1) * 0.6), false);
}
function skillButton(btn, i) {   // GIỮ nút: hiện đề và nói luôn, thả tay là chấm · CHẠM NHANH: chỉ xem đề + nghe đọc mẫu (giữ lại sau để nói)
  let rec = null, downAt = 0, heard = false;
  btn.addEventListener("pointerdown", e => {
    e.preventDefault(); const id = save.combat.slots[i], S = SKILLS[id]; if (!S || !CB.on || CB.ko) return;
    if (!CB.cast) { startCast(id, btn, true); if (!CB.cast) return;
      if (CB.cast.task.listen) { speak(CB.cast.task.speak); return; } }   // LISTEN: lần bấm đầu chỉ để nghe; giữ lần sau để nói
    else if (CB.cast.id !== id || rec) return;
    if (!SR) { flash("🎤 A microphone is needed (Chrome / Safari)"); return; }
    try { btn.setPointerCapture(e.pointerId); } catch (x) {}
    try { if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel(); } catch (x) {}
    downAt = performance.now(); heard = false;
    const r = new SR(); r.lang = "en-US"; r.interimResults = true; r.continuous = true; r.maxAlternatives = 3; let alts = [], err = "";
    r.onresult = ev => { heard = true; alts = [""]; for (const res of ev.results) alts[0] += res[0].transcript; const last = ev.results[ev.results.length - 1]; for (let k = 1; k < last.length; k++) alts.push(last[k].transcript); $("cbCh").textContent = "🎙️ " + alts[0]; };
    r.onerror = ev => { err = ev.error; };
    r.onend = () => { rec = null; btn.classList.remove("rec"); if (!CB.cast) return;
      if (r.quick) { CB.cast.rec = false; speak(CB.cast.task.speak); showCard(); return; }   // chạm nhanh: không chấm, đọc mẫu cho nghe
      const a2 = alts.filter(Boolean); setTimeout(() => resolveCast(a2, err), 120); };   // chờ hệ thống tắt micro (tiếng "tít") xong rồi mới chấm + vẽ hiệu ứng → không giật
    rec = r; CB.cast.rec = true; btn.classList.add("rec"); try { r.start(); } catch (x) { rec = null; CB.cast.rec = false; btn.classList.remove("rec"); }
  });
  ["pointerup", "pointercancel"].forEach(ev => btn.addEventListener(ev, () => { if (!rec) return; if (performance.now() - downAt < 350 && !heard) rec.quick = true; try { rec.stop(); } catch (x) {} }));
  btn.addEventListener("contextmenu", e => e.preventDefault());
}
function startCast(id, btn, silent) {   // silent: đang giữ nút để nói → không đọc mẫu
  const S = SKILLS[id];
  if ((CB.cd[id] || 0) > 0) return;
  if (CB.mp < S.mana) { popText("💧", player.position, "#3b82f6"); return; }
  const target = nearestMon(S.kind === "aoe" ? 8 : 11);
  if (!target && S.kind !== "aoe" && S.kind !== "self") { flash("🎯 No monster nearby / Không có quái gần đây"); return; }
  CB.mp -= S.mana;
  const task = drawTask(Math.min(5, Math.ceil(skillRank(id) / 2)));
  CB.cast = { id, S, task, target, limit: 10, left: 10, rec: false };
  showCard(); if (!silent) speak(task.speak);
}
const TASK_COL = { repeat: "#3fa3ff", answer: "#3fd68c", build: "#ff8a2a", name: "#ff5a5f", ask: "#b07cff", listen: "#22b8cf", fill: "#e64980", sounds: "#f59f00", reply: "#20c997", mistake: "#fa5252", grammar: "#4c6ef5", describe: "#fab005" };
function showCard() {
  const c = CB.cast, k = c.task, nm = TASK_NAME[k.type].split(" · ")[0];
  $("cbCt").innerHTML = '<span class="ev-tag" style="--c:' + TASK_COL[k.type] + '">' + TASK_ICON[k.type] + " " + nm + "</span><small>" + c.S.name + (resoOn(k.type) ? " · 🎵 Resonance!" : "") + "</small>";
  $("cbCq").textContent = k.show; viLine(k);
  const tip = (save.level || 1) <= 2 ? "🎤 Hold " + c.S.icon + " and speak" : "";
  $("cbCh").textContent = tip + (k.hint ? (tip ? " · " : "") + k.hint : "");
  $("cbReroll").style.visibility = performance.now() > CB.rerollAt ? "visible" : "hidden";
  $("cbCard").style.display = "block";
}
/* Tiếng mẹ đẻ là giàn giáo tạm (Vygotsky / Nation: gloss L1 giúp nối nghĩa lần đầu, rồi phải rút dần để người học nghĩ bằng tiếng Anh):
   nghĩa tiếng Việt hiện ở 2 lần đầu gặp một câu MỚI; từ lần 3 ẩn đi, còn nút nhỏ "VI" để xem khi thật cần (không tính lượt). */
const VI_SHOW = 2;
function viLine(k) {
  const el = $("cbVi"); if (!el) return; el.innerHTML = "";
  if (k.listen) { const b = document.createElement("button"); b.className = "ev-btn alt"; b.style.cssText = "font-size:12px;padding:2px 10px"; b.textContent = "🔊 Again"; b.onpointerdown = e => { e.stopPropagation(); speak(k.speak); }; el.appendChild(b); return; }
  if (!k.vi) return;
  const seen = save.combat.viSeen = save.combat.viSeen || {}, key = k.target, n = seen[key] || 0;
  if (n < VI_SHOW) { if (!k.viCounted) { seen[key] = n + 1; k.viCounted = true; } el.textContent = k.vi; return; }
  const b = document.createElement("button"); b.className = "ev-btn alt"; b.style.cssText = "font-size:11px;padding:1px 8px"; b.textContent = "VI";
  b.onpointerdown = e => { e.stopPropagation(); el.textContent = k.vi; }; el.appendChild(b);
}
function reroll() { if (!CB.cast || performance.now() < CB.rerollAt || CB.mp < 10) return; CB.mp -= 10; CB.rerollAt = performance.now() + 20000; CB.cast.task = drawTask(Math.min(5, Math.ceil(skillRank(CB.cast.id) / 2)), CB.cast.task.type); CB.cast.left = CB.cast.limit; showCard(); speak(CB.cast.task.speak); }
function endCast(silent) { CB.cast = null; $("cbCard") && ($("cbCard").style.display = "none"); }
function resoOn(type) { const w = curWeapon(); return !!(w && w.weapon.reso === type); }

/* Voice Deck: chọn loại bài (sàn 15%, loại yếu tới 35%) rồi lấy nội dung (ưu tiên thẻ của người chơi) */
const NEWBIE_LV = 4;   // Lv.1–4: đề chỉ lấy từ thẻ đã có + bộ thẻ khởi đầu (STARTER_DECK), chỉ dạng REPEAT / NAME
function drawTask(band, avoid) {
  if ((save.level || 1) <= NEWBIE_LV) { const T = ["name", "listen"].filter(t => t !== avoid && challengeOpen(t)); return makeTask(T.length && Math.random() < 0.2 * T.length ? cbPick(T) : "repeat", band); }
  const T = deckTypes(), st = save.combat.deck; T.forEach(t => st[t] = st[t] || { n: 0, good: 0 }); const rate = t => (st[t].good + 1) / (st[t].n + 2), avg = T.reduce((a, t) => a + rate(t), 0) / T.length, base = 1 / T.length;
  let w = T.map(t => Math.max(0.15, Math.min(0.35, base + (avg - rate(t)) * 0.6)) * (t === avoid ? 0.3 : 1)), sum = w.reduce((a, b) => a + b, 0), r = Math.random() * sum, type = T[0];
  for (let i = 0; i < T.length; i++) { r -= w[i]; if (r <= 0) { type = T[i]; break; } }
  return makeTask(type, band) || makeTask("repeat", band);
}
/* Chọn thẻ để luyện (lặp lại ngắt quãng đơn giản): trọng số theo sao – 0 ⭐: 8 · 1 ⭐: 5 · 2 ⭐: 2 · 3 ⭐: 0,4; thẻ vừa ra lượt trước bị giảm mạnh */
const STAR_W = [8, 5, 2, 0.4]; let lastPicks = [];
function pickByStars(list, extra) {
  const w = list.map(c => STAR_W[Math.min(3, stars(c.id))] * (extra ? extra(c) : 1) * (lastPicks.indexOf(c.id) >= 0 ? 0.15 : 1));
  let r = Math.random() * w.reduce((a, b) => a + b, 0), i = 0; for (; i < list.length - 1; i++) { r -= w[i]; if (r <= 0) break; }
  lastPicks = [list[i].id].concat(lastPicks).slice(0, 3); return list[i];
}
function cbPick(a) { return a[Math.floor(Math.random() * a.length)]; }
function wc(s) { return s.split(/\s+/).filter(Boolean).length; }
const BAND_WORDS = [0, [2, 4], [5, 6], [7, 8], [9, 10], [11, 12]];
function bandOk(s, band) { const n = wc(s), [a, b] = BAND_WORDS[band]; return n >= a - 1 && n <= b + 1; }
const FILL_SKIP = ["the", "and", "you", "are", "was", "this", "that", "with", "have", "has", "for", "can", "not", "your", "very"];
/* LISTEN: giới hạn độ dài câu nghe theo cấp (chủ dự án chốt 20/11): Lv < 10 → dưới 5 từ, Lv < 20 → dưới 7 từ, sau đó tự do */
function listenMax() { const lv = save.level || 1; return lv < 10 ? 4 : lv < 20 ? 6 : 99; }
function ownLine(max) {   // 1 câu từ thẻ của mình (ưu tiên thẻ ít sao), không có thì lấy bộ thẻ khởi đầu; max = số từ tối đa
  max = max || 99; const fits = t => !!t && wc(t) <= max;
  const have = allCards().filter(c => hasCard(c.id) && c.ex && (fits(c.ex) || (c.type === "p" && fits(c.w))));
  if (have.length) { const c = pickByStars(have, null), wOk = c.type === "p" && fits(c.w), useW = wOk && (!fits(c.ex) || Math.random() < 0.3); return { text: useW ? c.w : c.ex, card: c.id, pic: c.pic }; }
  if (typeof STARTER_DECK === "undefined") return { text: "Let's go!", card: null };
  const pool = STARTER_DECK.filter(x => fits(x.say)), st = cbPick(pool.length ? pool : STARTER_DECK.slice().sort((a, b) => wc(a.say) - wc(b.say)).slice(0, 3));
  return { text: st.say, card: null, pic: st.pic, vi: st.vi };
}
function makeTask(type, band) {
  const season = CB.sec ? CB.sec.season : "city";
  if (type === "repeat") {
    const newbie = (save.level || 1) <= NEWBIE_LV, have = allCards().filter(c => hasCard(c.id) && c.ex);
    const line = have.length && Math.random() < 0.8 ? pickByStars(have, c => bandOk(c.ex, band) ? 1.5 : 1) : null;   // 80% từ thẻ của mình: thẻ 0 ⭐ ra nhiều nhất, 3 ⭐ hiếm
    if (line) { const text = newbie && line.type === "p" && Math.random() < 0.5 ? line.w : line.ex; return { type, show: "“" + text + "”", speak: text, target: text, card: line.id, hint: "Say it again." }; }
    const st = typeof STARTER_DECK !== "undefined" && (newbie || Math.random() < 0.3) ? cbPick(STARTER_DECK) : null;   // câu mới luôn có nghĩa tiếng Việt
    const b = st || cbPick((VOICE_DECK.build || []).filter(b => b.band === band)) || { say: cbPick(ECHO_LINES)[1] };
    return { type, show: "“" + b.say + "”", speak: b.say, target: b.say, vi: b.vi, card: null, hint: "Say it again." };
  }
  if (type === "build") {
    const pool = (VOICE_DECK.build || []).filter(b => b.band === band && (b.topic === season || b.topic === "city" || Math.random() < 0.3)); const b = cbPick(pool.length ? pool : (VOICE_DECK.build || [])); if (!b) return null;
    const words = b.say.replace(/[.!?]$/, "").split(" "); let sh = words.slice(); for (let k = 0; k < 6 && sh.join(" ") === words.join(" "); k++) sh.sort(() => Math.random() - 0.5);
    return { type, show: (b.pic || "") + " " + sh.join(" / "), speak: "", target: b.say, vi: b.vi, hint: "Say the words in the right order." };
  }
  if (type === "answer") {
    const pool = (VOICE_DECK.answer || []).filter(a => a.band <= band && a.band >= band - 1 && (a.topic === season || a.topic === "city" || Math.random() < 0.3)); const a = cbPick(pool.length ? pool : (VOICE_DECK.answer || [])); if (!a) return null;
    return { type, show: (a.pic || "") + " " + a.q, speak: a.q, keys: a.keys, target: a.full, vi: a.vi, hint: "Answer in a full sentence." };
  }
  if (type === "ask") {
    const pool = (VOICE_DECK.ask || []).filter(a => a.band <= Math.max(3, band) && (a.topic === season || a.topic === "city" || Math.random() < 0.3)); const a = cbPick(pool.length ? pool : (VOICE_DECK.ask || [])); if (!a) return null;
    return { type, show: (a.pic || "") + " “" + a.say + "”", speak: a.say, keys: a.keys, target: a.full, vi: a.vi, hint: "Ask a question back." };
  }
  if (type === "listen") {   // không có chữ: nghe máy đọc rồi nói lại. Chỉ dùng câu đã học → nghe được, hiểu được (i+1)
    const L = ownLine(listenMax()), n = wc(L.text);
    return { type, show: "🎧 " + "▁ ".repeat(n).trim() + "  (" + n + " words)", speak: L.text, target: L.text, card: L.card, listen: true, hint: "Listen. Tap 🔊 to hear again." };
  }
  if (type === "fill") {   // che 1 từ trong câu của thẻ đã có → nhớ lại chủ động (retrieval practice)
    const have = allCards().filter(c => hasCard(c.id) && c.ex && wc(c.ex) >= 3); if (!have.length) return null;
    const c = pickByStars(have, null), words = c.ex.split(" "), cand = words.map((w, i) => [w.replace(/[^A-Za-z']/g, ""), i]).filter(([w]) => w.length >= 3 && FILL_SKIP.indexOf(w.toLowerCase()) < 0);
    if (!cand.length) return null; const [w, i] = cand.sort((a, b) => b[0].length - a[0].length)[Math.floor(Math.random() * Math.min(2, cand.length))];
    const blank = band <= 2 ? w[0] + "_".repeat(Math.max(2, w.length - 1)) : "_____"; words[i] = words[i].replace(w, blank);
    return { type, show: (c.pic || "") + " “" + words.join(" ") + "”", speak: "", target: c.ex, keys: [w.toLowerCase()], card: c.id, hint: "Say the whole sentence." };
  }
  if (type === "sounds") {   // âm khó với người Việt: máy phải nghe ra đúng từ đích, không phải từ dễ nhầm
    const pool = SOUNDS_DECK.filter(x => x.band <= Math.min(3, band)), x = cbPick(pool.length ? pool : SOUNDS_DECK); if (!x) return null;
    return { type, show: (x.pic || "") + " “" + x.say.replace(new RegExp("\\b" + x.key + "\\b", "i"), m => m.toUpperCase()) + "”", speak: x.say, target: x.say, sound: x, vi: x.vi, hint: "👄 " + x.tip + " (not “" + x.avoid + "”)" };
  }
  if (type === "name") {
    const all = Object.values(VOCAB).flat(), mine = all.filter(v => hasCard("v:" + v.w)), v = mine.length && ((save.level || 1) <= NEWBIE_LV || Math.random() < 0.8) ? pickByStars(mine.map(v => ({ id: "v:" + v.w, v })), null).v : cbPick(all);   // người mới: chỉ đồ vật đã có thẻ if (!v) return null;
    return { type, show: v.pic + "  What is this?", speak: "What is this?", keys: [v.w.toLowerCase()], target: v.say, card: hasCard("v:" + v.w) ? "v:" + v.w : null, hint: band >= 3 ? "Say: " + v.say.replace(v.w, "…") : "Name it." };
  }
  return null;
}
function grade(task, alts) {   // → 1 (Perfect) · 0.7 (Good) · 0.3 (Weak) · 0 (Miss)
  if (!alts.length) return 0;
  if (task.sound) {
    const x = task.sound, has = (h, w) => norm(h).indexOf(w.toLowerCase()) >= 0, best = Math.max(...alts.map(h => match(task.target, h)));
    if (!has(alts[0], x.key) && alts.some(h => has(h, x.avoid))) return best >= 0.3 ? 0.3 : 0;   // nghe thành từ dễ nhầm
    if (!alts.some(h => has(h, x.key))) return best >= 0.3 ? 0.3 : 0;
    return best >= 0.85 ? 1 : 0.7;
  }
  if (task.keys) {
    const has = (T, o) => { const O = norm(o); if (O.length > 1) return (" " + T.join(" ") + " ").indexOf(" " + O.join(" ") + " ") >= 0; return T.some(t => t === O[0] || (O[0].length >= 3 && t.indexOf(O[0]) === 0)); };   // slow → slowly, apple → apples
    const ok = alts.some(h => { const T = norm(h); return task.keys.every(k => k.split("|").some(o => has(T, o))); });
    const full = alts.some(h => match(task.target, h) >= 0.6);
    if (ok && (full || task.type === "name" && (skillRank(CB.cast.id) < 3))) return 1;
    if (ok) return 0.7; return full ? 0.3 : (alts.some(h => match(task.target, h) >= 0.3) ? 0.3 : 0);
  }
  const m = Math.max(...alts.map(h => match(task.target, h)));
  return m >= 0.85 ? 1 : m >= 0.6 ? 0.7 : m >= 0.3 ? 0.3 : 0;
}
function resolveCast(alts, err) {
  const c = CB.cast; if (!c) return;
  endCast();
  if (err === "not-allowed" || err === "service-not-allowed") { CB.mp += c.S.mana; flash("🎤 Hãy cho phép micro để tung chiêu"); return; }
  if (!alts.length && err !== "timeout") { CB.mp += c.S.mana; popText("🔇", player.position, "#868e96"); return; }   // không nghe thấy gì: không phạt
  const acc = grade(c.task, alts), st = save.combat.deck[c.task.type] = save.combat.deck[c.task.type] || { n: 0, good: 0 }; st.n++;
  if (c.task.listen || c.task.type === "fill") setTimeout(() => flash("📝 " + c.task.target, 2200), 300);   // cho thấy câu đúng sau khi nói (noticing) if (acc >= 0.7) st.good++;
  if (acc === 0) { CB.mp += c.S.mana / 2; popText("Miss", player.position, "#868e96"); CB.cd[c.id] = 1; return; }
  popText(acc === 1 ? "Perfect!" : acc >= 0.7 ? "Good!" : "Weak", player.position, acc === 1 ? "#f08c00" : acc >= 0.7 ? "#2f9e44" : "#868e96");
  if (acc >= 0.7) { spokeOk(); if (c.task.card) practice(c.task.card); gainXp(4); harmonyStep(c.task.type); }
  c.duet = typeof teamOnCast === "function" ? teamOnCast() : 1;
  CB.cd[c.id] = c.S.cd * (1 - 0.04 * pr("quick_tongue")) * (performance.now() < CB.buff.hasteUntil ? 0.5 : 1); castSkill(c, acc);
  if (c.S.branch === "rhythm" && Math.random() < 0.03 * pr("encore")) setTimeout(() => { popText("Encore!", player.position, "#e8590c"); castSkill(c, acc); }, 600);
  if (acc === 1 && pr("kind_words")) setHp(hpNow() + hpMax() * 0.02 * pr("kind_words"));
  saveSoon();
}
function harmonyStep(type) { if (performance.now() < CB.harmonyUntil) return; if (type !== CB.lastType) CB.harmony += 25; CB.lastType = type; if (CB.harmony >= 100) { CB.harmony = 0; CB.harmonyUntil = performance.now() + 10000; flash("🎼 HARMONY! ×2 damage · 10s"); } }
function skillDamage(c, acc, M) {
  const w = curWeapon(), S = c.S, rank = skillRank(c.id);
  let d = S.base * (1 + 0.15 * (rank - 1)) * (1 + (save.level || 1) * 0.04) * acc * (1 + (gear().voice || 0) / 100);
  if (w && (w.weapon.line === S.branch || w.weapon.line === "all")) d *= 1 + w.weapon.pct / 100;
  if (resoOn(c.task.type)) d *= 1.3;
  if (M && (M.T.weak === c.task.type || S.pierce)) d *= 1.5;
  if (S.execute && M && M.hp / M.hpMax < S.execute) d *= 3;
  if (acc === 1) d *= 1 + 0.1 * pr("loud_clear");
  d *= 1 + 0.03 * pr("team_spirit");
  if (performance.now() < CB.buff.dmgUntil) d *= 1 + CB.buff.dmg;
  if (S.branch === "power" && Math.random() < 0.05 * pr("critical_tone")) { d *= 2; c.crit = true; }
  if (performance.now() < CB.harmonyUntil) d *= 2;
  if (c.duet > 1) d *= c.duet;   // Duet với đồng đội
  if (isPoisoned()) d *= 0.5;
  if (M && M.lv > (save.level || 1) + 8) d *= 0.3;   // quái mạnh hơn nhiều: nên lên cấp trước
  return Math.round(d);
}
/* Hiệu ứng chiêu 3D (parts/combat/fx3d.js – FX3D): mỗi chiêu đổi hình ở bậc 1 / 4 / 7 / 10; chiêu chưa có hiệu ứng riêng dùng hiệu ứng chung theo nhánh + loại */
function fxReady() { if (typeof FX3D === "undefined") return false; if (!FX3D.ready()) { FX3D.setup(scene, camera, renderer); FX3D.onShake = s => { window.CAM_SHAKE = Math.max(window.CAM_SHAKE || 0, s * 1.2); }; } return true; }
function playSkillFx(id, rank, from, to, radius) {
  const S = SKILLS[id]; if (!S) return;
  if (fxReady()) FX3D.cast(id, from, to, Math.max(1, rank), { kind: S.kind, branch: S.branch, radius: radius || S.radius });
  else if (typeof SKILL_VFX !== "undefined" && SKILL_VFX) SKILL_VFX.play(id, { rank: Math.min(5, Math.ceil(rank / 2)), from, to, radius });
}
function castSkill(c, acc) {   // hiệu ứng chiêu theo kind + fx (stun, root, silence, slow, taunt, heal, shield, buff, haste, mana, cleanse)
  const S = c.S, P = player.position, rank = skillRank(c.id); charAct(player, "Spellcast_Shoot");
  const alive = c.target && !c.target.dead ? c.target : nearestMon(11), ccMul = 1 + 0.1 * pr("sharp_ears");
  if (alive) player.rotation.y = Math.atan2(alive.g.position.x - P.x, alive.g.position.z - P.z);
  const look = (to, radius) => { playSkillFx(c.id, S.type === "ult" ? Math.max(rank, 10) : rank, P.clone(), to ? to.clone() : null, radius); };
  const cc = M => { if (M.remote) { M.pendFx = { st: S.stun ? S.stun * ccMul : 0, ro: S.root ? S.root * ccMul : 0, si: S.silence ? S.silence * ccMul : 0, sl: S.slow || 0, slT: S.slow ? S.slowT * ccMul : 0 }; } let n = 0; if (S.stun) { M.stun = Math.max(M.stun, S.stun * ccMul); n++; } if (S.root) { M.root = S.root * ccMul; n++; } if (S.silence) { M.silence = S.silence * ccMul; n++; } if (S.slow) { M.slow = S.slow; M.slowT = S.slowT * ccMul; n++; }
    if (n && pr("calm_mind")) CB.mp = Math.min(100, CB.mp + 3 * pr("calm_mind")); return n; };
  const hit = M => { if (M.dead) return; dealDamage(M, skillDamage(c, acc, M), true); if (cc(M) && S.stun && pr("echo_chain") && S.branch === "control") {
      CB.mons.filter(o => !o.dead && o !== M && o.g.position.distanceTo(M.g.position) < 5).slice(0, pr("echo_chain") >= 4 ? 2 : 1).forEach(o => o.stun = Math.max(o.stun, S.stun * 0.5)); }
    if (S.branch === "rhythm" && pr("groove")) CB.mp = Math.min(100, CB.mp + pr("groove")); };
  const inR = (pos, r) => CB.mons.filter(M => !M.dead && M.dir === (CB.sec && CB.sec.dir) && M.g.position.distanceTo(pos) < r);
  const waves = (n, fn) => { for (let h = 0; h < n; h++) setTimeout(fn, h * 300); };
  if (S.kind === "single" && alive) { look(alive.g.position); hit(alive); }
  if (S.kind === "multi" && alive) { let tgt = alive; for (let h = 0; h < S.hits; h++) { const M = tgt; setTimeout(() => { if (!M.dead) { look(M.g.position, 0.8); hit(M); } }, h * 220);
      const nx = CB.mons.filter(m => !m.dead && m !== tgt && m.g.position.distanceTo(tgt.g.position) < 5)[0]; if (nx) tgt = nx; } }
  if (S.kind === "aoe") { look(null, S.radius); waves(S.hits || 1, () => inR(player.position, S.radius).forEach(hit)); }
  if (S.kind === "zone" && alive) { const ctr = alive.g.position.clone(); look(ctr, S.radius);
    if (S.taunt) inR(ctr, S.radius * 2).forEach(M => { M.g.position.lerp(ctr, 0.6); }); inR(ctr, S.radius).forEach(hit); }
  if (S.kind === "dash" && alive) { const a = alive.g.position, dx = a.x - P.x, dz = a.z - P.z, d = Math.hypot(dx, dz), step = Math.max(0, d - 1.2);
    for (let k = 0; k < 10; k++) { const nx = P.x + dx / d * step / 10, nz = P.z + dz / d * step / 10; if (!blocked(nx, nz)) { P.x = nx; P.z = nz; } }
    look(a, S.radius); inR(a, S.radius).forEach(hit); }
  if (S.kind === "self") { look(null, 2); const now = performance.now(), k = acc * (1 + 0.08 * (rank - 1));
    if (S.heal) { setHp(hpNow() + hpMax() * S.heal * k); popText("+❤️", P, "#2f9e44"); }
    if (S.shield) { CB.buff.shield = Math.min(0.85, S.shield * (0.8 + 0.2 * k)); CB.buff.shieldUntil = now + S.shieldT * 1000; }
    if (S.buff) { CB.buff.dmg = S.buff * k; CB.buff.dmgUntil = now + S.buffT * 1000; }
    if (S.haste) CB.buff.hasteUntil = now + S.hasteT * 1000;
    if (S.manaGain) CB.mp = Math.min(100, CB.mp + S.manaGain * k);
    if (S.cleanse) save.poisonUntil = 0; }
  if (c.crit) popText("CRIT!", P, "#e5484d");
}
const VFX = [];
function vfx(pos, color, size, rank) {   // hiệu ứng chiêu: bậc càng cao càng to, nhiều vòng, có hạt sáng
  const n = rank >= 5 ? 3 : rank >= 3 ? 2 : 1;
  for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(0.5 + i * 0.3, 0.08 + 0.03 * rank, 8, 28), new THREE.MeshBasicMaterial({ color: i === 2 ? 0xffd43b : color, transparent: true, depthWrite: false }));
    m.rotation.x = Math.PI / 2; m.position.copy(pos).setY(0.4 + i * 0.4); scene.add(m); VFX.push({ m, t: -i * 0.08, size: size * (1 + rank * 0.15) }); }
  if (rank >= 3) for (let i = 0; i < 4 + rank * 2; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffd43b, transparent: true })); s.position.copy(pos).setY(1); s.userData.v = new THREE.Vector3((Math.random() - 0.5) * 6, 2 + Math.random() * 3, (Math.random() - 0.5) * 6); scene.add(s); VFX.push({ m: s, t: 0, spark: true }); }
}
function vfxTick(dt) { VFX.forEach(f => { f.t += dt; if (f.t < 0) return; const k = f.t / 0.5; if (f.spark) { f.m.position.addScaledVector(f.m.userData.v, dt); f.m.userData.v.y -= 9 * dt; } else f.m.scale.setScalar(1 + k * f.size); f.m.material.opacity = Math.max(0, 1 - k); if (k >= 1) { scene.remove(f.m); f.m.geometry.dispose(); f.m.material.dispose(); f.done = true; } }); for (let i = VFX.length - 1; i >= 0; i--) if (VFX[i].done) VFX.splice(i, 1); }
function dealDamage(M, dmg, bySkill, who) {
  if (M.dead) return; who = who || myId; M.hurtT = 0.3;
  if (who === myId) popText(String(dmg), M.g.position, bySkill ? "#ffd43b" : "#ffffff", { stroke: bySkill ? "#7a4a00" : "#343a40", big: bySkill });   // số vàng to = chiêu nói, trắng = đánh thường
  if (typeof FEEL !== "undefined") FEEL.onHit(M, dmg, bySkill, who === myId);
  if (M.remote) { netSend("mdmg", { k: M.key, d: dmg, s: bySkill ? 1 : 0, fx: M.pendFx || null }); M.pendFx = null; M.hp = Math.max(1, M.hp - dmg); return; }   // gửi về chủ phòng
  const c = M.contrib[who] = M.contrib[who] || { s: 0, a: 0 }; c.a += dmg; if (bySkill) c.s += dmg;
  M.hp -= dmg; M.dmgAll += dmg; if (bySkill) M.dmgSkill += dmg;
  if (M.hp <= 0) killMon(M);
}

/* ---------- 10. HẠ QUÁI: kinh nghiệm theo phần sát thương do CHIÊU NÓI + rơi đồ ---------- */
function gainXp(n) { if (save.combat.daySec > DAY_LIMIT) return 0; if (typeof teamXpMul === "function") n = Math.round(n * teamXpMul()); const L0 = save.level || 1; score += n; $("score").textContent = score; checkLevel();
  if ((save.level || 1) > L0) setTimeout(() => { if (typeof LORE !== "undefined") LORE.checkLearn(); }, 4500);
  if ((save.level || 1) > L0) setTimeout(() => flash("🌟 +" + (spTotal() - 2 * L0 - 3 * Math.floor(L0 / 10)) + " skill points! / Có điểm kỹ năng mới<div style='font-size:13px;font-weight:400'>Bấm 🌟 Skills để học hoặc nâng chiêu.</div>"), 2500);
  return n; }
function killMon(M) {   // chủ phòng: quái chết → báo mọi người phần đóng góp, ai góp ≥ 10% nhận thưởng riêng
  M.dead = true; M.deadT = 0; if (M.tele) { scene.remove(M.tele.ring); M.tele = null; }
  const tot = Object.values(M.contrib).reduce((a, c) => a + c.a, 0) || 1, sh = {}; Object.keys(M.contrib).forEach(id => sh[id] = [M.contrib[id].s / tot, M.contrib[id].a / tot]);
  netSend("mdie", { k: M.key, sh });
  const me = sh[myId]; if (me) rewardKill(M, me[0], me[1]);
}
function rewardKill(M, shareSkill, shareAll) {   // thưởng của riêng mình: kinh nghiệm theo phần sát thương do CHIÊU NÓI, đồ rơi riêng nếu góp ≥ 10%
  if (shareAll < 0.1) return;
  const share = shareSkill, xp = gainXp(Math.round((6 + M.lv * 1.5) * share));
  if (xp) setTimeout(() => popText("+" + xp + " ⭐", M.g.position.clone(), "#f08c00"), 200);
  if (Math.random() < 0.5) { spiritCount++; try { localStorage.setItem("ev_spirits", spiritCount); } catch (e) {} }   // giải thoát thành Word Spirit
  const coins = Math.round((2 + M.lv * 0.6 + Math.random() * 3) * (1 + (gear().luck || 0) / 100)), p = M.g.position;
  dropAt(p.x, p.z, "coins", coins);
  const foods = Object.keys(ITEMS).filter(k => ITEMS[k].energy && ITEMS[k].price <= 15);
  if (Math.random() < 0.4) dropAt(p.x + 0.8, p.z, cbPick(foods));
  const w = Object.keys(ITEMS).filter(k => ITEMS[k].weapon && !ITEMS[k].weapon.maestro && ITEMS[k].lv <= M.lv + 3);
  const r = Math.random();
  if (r < 0.03) { const u = w.filter(k => ITEMS[k].rarity === "uncommon"); if (u.length) dropAt(p.x, p.z + 0.8, cbPick(u)); }
  else if (r < 0.11) { const c = w.filter(k => ITEMS[k].rarity === "common"); if (c.length) dropAt(p.x, p.z + 0.8, cbPick(c)); }
  checkLegends();
}
const RCOL = { common: 0xdee2e6, uncommon: 0x40c057, rare: 0x339af0, epic: 0x9775fa, legendary: 0xfab005 };
function dropAt(x, z, id, n) {
  const it0 = id === "coins" ? { icon: "🪙", rarity: "common" } : ITEMS[id]; if (!it0) return; const it = Object.assign({ rarity: "common" }, it0);
  const g = new THREE.Group(), s = emojiSprite(it.icon, 0.7); s.position.y = 0.6; g.add(s);
  if (id !== "coins" && it.rarity !== "common") { const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3, 8, 1, true), new THREE.MeshBasicMaterial({ color: RCOL[it.rarity], transparent: true, opacity: 0.45, depthWrite: false })); beam.position.y = 1.5; g.add(beam); }
  g.position.set(x + (Math.random() - 0.5), 0, z + (Math.random() - 0.5)); scene.add(g);
  CB.drops.push({ g, id, n: n || 1, owner: cbOwnerId(), t: 0 });
}
function cbOwnerId() { return myId; }
function dropTick(dt, t) {
  vfxTick(dt); if (typeof SKILL_VFX !== "undefined" && SKILL_VFX) SKILL_VFX.tick(dt); if (typeof WEAPON_MODELS !== "undefined" && WEAPON_MODELS && WEAPON_MODELS.tick) WEAPON_MODELS.tick(dt, t);
  if (typeof FEEL !== "undefined") FEEL.slTick(dt);
  if (window.CAM_SHAKE > 0) { window.CAM_SHAKE -= dt; const a = Math.min(1, window.CAM_SHAKE / 0.25) * 0.28; scene.position.set((Math.random() - 0.5) * a, (Math.random() - 0.5) * a * 0.4, (Math.random() - 0.5) * a); }   // rung giảm dần else if (scene.position.x || scene.position.z) scene.position.set(0, 0, 0);
  CB.drops.forEach(D => { D.t += dt; D.g.children[0].position.y = 0.6 + Math.sin(t * 3 + D.t) * 0.1;
    const mine = D.owner === cbOwnerId() || D.t > 20;   // 20 giây đầu chỉ người hạ quái nhặt được
    if (mine && !CB.ko && D.g.position.distanceTo(player.position) < 1.4) {
      if (D.id === "coins") { addCoins(D.n); popText("+" + D.n + " 🪙", D.g.position, "#e67700"); D.done = true; }
      else if (addItem(save.items, BAG_SIZE, D.id)) { const it = ITEMS[D.id]; popText(it.icon + " " + it.name, D.g.position, "#" + (RCOL[it.rarity || "common"]).toString(16).padStart(6, "0")); D.done = true; saveNow(); drawCombatHud(); }
      else if (!D.full) { D.full = true; flash(bagFullMsg(D.id)); }
    }
    if (D.t > 90) D.done = true;
    if (D.done) scene.remove(D.g); });
  CB.drops = CB.drops.filter(D => !D.done);
}

/* ---------- 11. BẢNG KỸ NĂNG ---------- */
