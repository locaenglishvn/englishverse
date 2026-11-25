/* TRANG BỊ – bản 2 (25/11, chủ dự án chốt hướng): Đẹp, "wow", muốn có. Bỏ vũ khí nhạc cụ, bỏ dáng bầu bĩnh.
   Được phép góc cạnh, gai vừa phải; càng cấp cao càng hầm hố. Vẫn giữ: không máu me, không hở hang (trẻ 8–15).
   Sợi chỉ cốt truyện: mọi trang bị khắc CHỮ CÁI / SÓNG ÂM – khi người chơi nói đúng, chữ trên giáp và vũ khí bừng sáng (Resonance).
   Sửa nội dung trực tiếp ở đây; sổ tay tab "Trang phục" tự hiện. */

/* ---------- 5 Ô TRANG BỊ ---------- */
window.GEAR_SLOTS = [
  { k: "head", ic: "🎧", name: "Đầu", note: "KHÔNG che tóc: tai nghe chiến đấu, kính chắn (visor), mặt nạ nửa mặt, vòng đầu / vương miện, sừng, tai giáp. Mũ trùm kín chỉ có ở vài bộ huyền thoại + nút \"Ẩn mũ\". Tóc chọn lúc tạo nhân vật, chỉ để đẹp." },
  { k: "body", ic: "🛡️", name: "Thân", note: "Áo + quần là 1 món (giáp ngực, vai, váy giáp / quần giáp)." },
  { k: "gloves", ic: "🧤", name: "Găng", note: "Thay bàn tay nắm (đã có kỹ thuật): găng vải → găng da → găng giáp có móng." },
  { k: "boots", ic: "🥾", name: "Giày", note: "Thay vùng bàn chân: giày vải → ủng da → ủng giáp." },
  { k: "weapon", ic: "⚔️", name: "Vũ khí", note: "Cầm tay phải, cán xuyên lỗ nắm tay. Loại vũ khí quyết định nhánh chiêu được cộng thêm." }
];

/* ---------- CHỈ SỐ NGẪU NHIÊN (hên xui) ---------- */
window.GEAR_ROLL = {
  idea: "Cùng một món nhưng mỗi lần rơi ra có chỉ số khác nhau. Mỗi món có chỉ số gốc; khi rơi, máy tung xúc xắc ra PHẨM CHẤT (★) – quyết định % chỉ số gốc và số dòng chỉ số phụ ngẫu nhiên.",
  grades: [
    { s: "★", name: "Thường", pct: "80–95%", lines: 0, quest: true, drop: "40%" },
    { s: "★★", name: "Tốt", pct: "95–105%", lines: 0, quest: true, drop: "32%" },
    { s: "★★★", name: "Tinh xảo", pct: "105–115%", lines: 1, quest: false, drop: "18%" },
    { s: "★★★★", name: "Hoàn hảo", pct: "115–125%", lines: 2, quest: false, drop: "8%" },
    { s: "★★★★★", name: "Thần phẩm", pct: "125–140%", lines: 3, quest: false, drop: "2%" }
  ],
  lines: ["Voice +%", "Ears +giây", "HP tối đa +", "Mana tối đa +", "Hồi mana +%", "Chống độc Mute +%", "Chạy nhanh +%", "Luck +%", "Chí mạng +%", "Hồi chiêu −%"],
  rules: [
    "Đồ nhiệm vụ / phần thưởng cố định: luôn ★ hoặc ★★ (đủ dùng, không mạnh nhất).",
    "Đồ ★★★ trở lên: chỉ rơi từ quái, trùm, rương – may mắn. Trùm và quái hoàng kim có tỉ lệ ★ cao gấp đôi; chỉ số Luck tăng nhẹ tỉ lệ.",
    "Đồ Legendary: chỉ bằng thành tích tiếng Anh, luôn từ ★★★ trở lên (người giỏi tiếng Anh luôn có đồ đẹp – nguyên tắc 4).",
    "Mua bằng nạp tiền: để sau (chủ dự án tính). Gợi ý an toàn cho trẻ em: chỉ bán đồ ngoại hình / rương đẹp, KHÔNG bán thẳng đồ ★★★★★ để tránh \"trả tiền để thắng\".",
    "Tên món hiện màu độ hiếm + sao phẩm chất, vd \"Echo Blade ★★★★\"; đồ ★★★★★ có hào quang nhẹ."
  ]
};

/* ---------- VŨ KHÍ: 8 loại × 4 nhánh chiêu ---------- */
window.WEAPON_STYLE = "Game weapon concept, single item floating, stylized 3D fantasy game art (same rendering style as the attached character but NOT cartoon-round): crisp shapes, tasteful edges and small spikes allowed, rich materials, cool and desirable for teen players, no blood. ";
window.WEAPON_TAIL = " Engraved glowing letters / sound-wave runes along the blade or shaft that light up when the hero speaks. Side view, centered, plain light grey background, no hands, no text, no logo.";
window.WEAPON_TYPES = [
  { k: "sword", ic: "🗡️", name: "Kiếm", branch: "power", feel: "Cân bằng, chém gọn", ladder: [
      ["Lv.1", "common", "Training Blade", "a simple steel training sword with a wrapped leather grip and a small round guard"],
      ["Lv.28", "rare", "Echo Saber", "a sleek steel saber with a blue glowing sound-wave line along the blade and a winged silver guard"],
      ["Lv.75", "epic", "Thunderword Greatblade", "a large ornate greatsword with an angular gold and dark-steel blade, crackling cyan lightning letters along the fuller, jagged crossguard"] ] },
  { k: "hammer", ic: "🔨", name: "Búa", branch: "power", feel: "Chậm, cực mạnh, choáng", ladder: [
      ["Lv.1", "common", "Smith Hammer", "a sturdy blacksmith hammer with an iron head and wooden handle"],
      ["Lv.28", "rare", "Quake Maul", "a heavy maul with a hexagonal steel head, glowing orange cracks with letters inside"],
      ["Lv.75", "epic", "Titan Roar Hammer", "a massive war hammer shaped like a roaring lion head in gold and obsidian, molten glowing runes, small angular spikes"] ] },
  { k: "staff", ic: "🪄", name: "Trượng", branch: "control", feel: "Đánh xa, khống chế", ladder: [
      ["Lv.1", "common", "Oak Staff", "a simple oak staff with a small blue crystal tied on top"],
      ["Lv.28", "rare", "Frost Script Staff", "a silver staff whose top is a floating ring of ice crystals and glowing letters"],
      ["Lv.75", "epic", "Starfall Scepter of Thoth", "a tall ornate staff with an ibis-head crown in gold and lapis, a floating star crystal, orbiting glowing hieroglyph letters"] ] },
  { k: "tome", ic: "📖", name: "Sách phép", branch: "control", feel: "Bùa chú, làm chậm, trói", ladder: [
      ["Lv.1", "common", "Word Primer", "a small leather spellbook with a brass clasp, floating open"],
      ["Lv.28", "rare", "Codex of Echoes", "a floating spellbook with silver corners, pages fluttering, glowing letters rising from it"],
      ["Lv.75", "epic", "Grimoire of the First Voice", "a large floating grimoire with an armored dark cover, gold sigils, chains of glowing letters circling it"] ] },
  { k: "scepter", ic: "✨", name: "Quyền trượng thánh", branch: "harmony", feel: "Hồi máu, khiên, tăng sức", ladder: [
      ["Lv.1", "common", "Light Rod", "a short white rod with a small glowing yellow orb"],
      ["Lv.28", "rare", "Dawn Scepter", "a white and gold scepter with sun-ray blades around a glowing orb"],
      ["Lv.75", "epic", "Halo of Langua", "an ornate holy scepter with a large golden halo of sound-wave rings, feather-shaped blades, radiant aura"] ] },
  { k: "shield", ic: "🛡️", name: "Khiên + chuỳ", branch: "harmony", feel: "Bảo vệ đồng đội", ladder: [
      ["Lv.1", "common", "Guard Buckler", "a small round wooden buckler with an iron rim and a short mace"],
      ["Lv.28", "rare", "Resonance Aegis", "a steel kite shield with a glowing speaker-ring emblem and a flanged mace"],
      ["Lv.75", "epic", "Bastion of the Dome", "a large ornate tower shield shaped like the Resonance Dome, gold filigree, glowing letter barrier, with a crystal mace"] ] },
  { k: "spear", ic: "🔱", name: "Thương", branch: "rhythm", feel: "Đâm xuyên, quét vòng", ladder: [
      ["Lv.1", "common", "Bamboo Spear", "a bamboo spear with a simple iron tip and red tassel"],
      ["Lv.28", "rare", "Wind Glaive", "a slim glaive with a curved silver blade and green wind ribbons"],
      ["Lv.75", "epic", "Dragon Tide Halberd", "an ornate halberd with a dragon-head socket in jade and gold, wave-shaped blade, flowing water-light letters"] ] },
  { k: "twin", ic: "⚔️", name: "Song đao", branch: "rhythm", feel: "Đánh nhanh liên hoàn, nảy nhiều mục tiêu", ladder: [
      ["Lv.1", "common", "Twin Knives", "a pair of short practice blades with cloth grips"],
      ["Lv.28", "rare", "Beat Fangs", "a pair of curved twin blades with orange glowing rhythm marks"],
      ["Lv.75", "epic", "Phoenix Duet", "a pair of ornate curved blades shaped like phoenix wings in red and gold, ember letters trailing"] ] }
];
window.WEAPON_EXTRA = [
  "Vũ khí văn hoá (Epic, rơi từ trùm mỗi khu): Katana anh đào (Nhật) · Khopesh vàng (Ai Cập) · Rìu rune (Bắc Âu) · Giáo Gae Bolg phát sáng (Celt) · Macuahuitl ngọc (Maya) · Trượng rắn Caduceus (Hy Lạp) · Bút lông khổng lồ (Trung Hoa) · Trượng hình nêm (Lưỡng Hà) · Mã tấu đồng Đông Sơn (Việt).",
  "Vũ khí thần (Legendary, thành tích): mỗi khu giải phóng xong, vị thần trao 1 vũ khí theo binh khí trong thần thoại (vd giáo Gungnir của Odin) – đẹp nhất game, có hiệu ứng riêng.",
  "Bậc ngoại hình: Lv.1 gỗ/sắt trơn → Lv.10 thép có viền → Lv.28 chữ phát sáng → Lv.45 tinh thể / nguyên tố → Lv.60+ hoa văn cầu kỳ, hào quang → Legendary: chi tiết bay lơ lửng, hạt sáng, vệt sáng khi vung."
];

/* ---------- GIÁP (mỗi bộ = đầu + thân + găng + giày) ---------- */
window.OUTFIT_STYLE = {
  m: "Use the attached boy (Voice Guard, male) as the exact reference: keep his face, hair, body proportions (about 3.9 heads tall) and rendering style. Only change his gear to: ",
  f: "Use the attached girl (Voice Guard, female) as the exact reference: keep her face, hair, body proportions (about 3.9 heads tall) and rendering style. Only change her gear to: ",
  tail: " Stylish heroic fantasy game armor that players will want: crisp angular plates, layered materials, tasteful small spikes allowed, more ornate the higher the rarity, glowing letter / sound-wave engravings in the rarity color. The head piece must NOT cover the hair (headset, visor, half mask, circlet or horns only). Modest, no gore. Hands in the gloves, empty. Full body, A-pose (arms angled down 30°), front view, plain light grey background, no text, no logo."
};
window.OUTFIT_TIERS = [
  { r: "common", name: "Common", look: "Vải, da mềm, ít kim loại", how: "Shop · phần thưởng nhiệm vụ (★–★★)", lv: "Lv.1–10" },
  { r: "uncommon", name: "Uncommon", look: "Da + miếng giáp kim loại, đinh tán", how: "Shop · rơi từ quái", lv: "Lv.10–25" },
  { r: "rare", name: "Rare", look: "Giáp tấm, viền phát sáng, vai lớn", how: "Rơi từ quái tinh anh · rương", lv: "Lv.25–45" },
  { r: "epic", name: "Epic · Giáp văn hoá", look: "Cầu kỳ, hào quang, hoạ tiết văn hoá, gai vừa phải", how: "Trùm khu văn hoá rơi", lv: "Lv.45–95" },
  { r: "legendary", name: "Legendary", look: "Hầm hố nhất: vai khổng lồ, vết nứt phát sáng, cánh / vòng sáng", how: "Chỉ bằng thành tích tiếng Anh", lv: "Lv.40–100" }
];
window.OUTFITS = [
  /* COMMON */
  { id: "vg_uniform", r: "common", lv: 1, name: "Voice Guard Uniform", vi: "Đồng phục Voice Guard", how: "Có sẵn khi tạo nhân vật", stats: {}, head: "Tai nghe Voice Guard", gloves: "Tay trần (nắm)", boots: "Giày thể thao xanh ngọc",
    idea: "Bộ người mới – chính là nhân vật chính hiện tại.", img: { m: "concept/characters/voice-guard-m.webp", f: "concept/characters/voice-guard-f.webp" },
    m: "the current Voice Guard uniform (teal vest with gold trim, white shirt, navy trousers, teal sneakers, teal headset).", f: "the current Voice Guard uniform (open teal jacket, white shirt, navy pleated skirt, dark leggings, teal sneakers, teal headset)." },
  { id: "cadet", r: "common", lv: 5, name: "Cadet Leathers", vi: "Giáp da tân binh", how: "Shop · thưởng nhiệm vụ Commander Vy", stats: { hp: 10, resist: 3 }, head: "Tai nghe mic đôi", gloves: "Găng da không ngón", boots: "Ủng da cổ thấp",
    idea: "Áo da bó, đai chéo, miếng đệm vai nhỏ – trông đã là \"chiến binh\" chứ không còn là học sinh.",
    m: "brown leather cadet armor: fitted leather jerkin with a cross strap, small leather shoulder guard, teal undershirt, reinforced trousers, fingerless leather gloves, low leather boots, dual-mic combat headset.", f: "brown leather cadet armor: fitted leather jerkin with a cross strap, small leather shoulder guard, teal undershirt, short pleated leather skirt over leggings, fingerless leather gloves, low leather boots, dual-mic combat headset." },
  /* UNCOMMON */
  { id: "vg_armor", r: "uncommon", lv: 12, name: "Voice Guard Mail", vi: "Giáp Voice Guard", how: "Shop · rơi từ quái", stats: { hp: 25, resist: 6 }, head: "Visor xanh trong suốt", gloves: "Găng nửa giáp", boots: "Ủng đinh tán",
    idea: "Áo teal + giáp ngực thép có huy hiệu sóng âm, vai giáp góc cạnh, đinh tán.",
    m: "teal Voice Guard armor: angular steel chest plate with a gold sound-wave emblem, layered angular shoulder plates with rivets, armored belt, dark trousers with knee guards, half-plate gauntlets, riveted boots, transparent teal visor over the eyes.", f: "teal Voice Guard armor: fitted angular steel chest plate with a gold sound-wave emblem, small layered shoulder plates, armored belt with tassets over a dark skirt, knee guards, half-plate gauntlets, riveted boots, transparent teal visor over the eyes." },
  { id: "ranger", r: "uncommon", lv: 18, name: "Wild Ranger", vi: "Du hiệp hoang dã", how: "Rơi từ quái vòng 2", stats: { speed: 6, ears: 1, luck: 3 }, head: "Mặt nạ vải che mũi", gloves: "Găng bảo vệ cổ tay", boots: "Ủng cao buộc dây",
    idea: "Áo choàng ngắn rách mép, giáp da lớp, mặt nạ vải che nửa mặt – ngầu kiểu thợ săn.",
    m: "a wild ranger outfit: dark green layered leather armor, short tattered hooded cape (hood down), bracers, belt pouches, tall laced boots, cloth half-mask covering the nose and mouth.", f: "a wild ranger outfit: dark green fitted layered leather armor, short tattered hooded cape (hood down), bracers, belt pouches, leggings with tall laced boots, cloth half-mask covering the nose and mouth." },
  /* RARE – 4 nhánh */
  { id: "echo_knight", r: "rare", lv: 28, name: "Echo Knight", vi: "Hiệp sĩ Tiếng Vọng (Power)", how: "Rơi từ quái tinh anh · rương", stats: { voice: 10, hp: 40, resist: 10 }, head: "Vòng đầu thép có cánh", gloves: "Găng giáp", boots: "Ủng giáp",
    idea: "Giáp tấm bạc-xanh, vai lớn góc cạnh như âm thoa, đường sáng xanh chạy dọc giáp.",
    m: "silver and deep-blue plate armor with large angular shoulder pauldrons shaped like tuning forks, glowing blue sound-wave lines along the plates, flowing dark-blue tabard, plated gauntlets and sabatons, steel winged circlet on the forehead (hair visible).", f: "silver and deep-blue fitted plate armor with angular shoulder pauldrons shaped like tuning forks, glowing blue sound-wave lines along the plates, armored skirt with a dark-blue tabard, plated gauntlets and sabatons, steel winged circlet on the forehead (hair visible)." },
  { id: "rune_mage", r: "rare", lv: 32, name: "Rune Weaver", vi: "Pháp sư Dệt Chữ (Control)", how: "Rơi từ quái tinh anh · rương", stats: { voice: 8, mana: 40 }, head: "Vương miện pha lê nổi", gloves: "Găng lụa có nhẫn", boots: "Ủng mũi nhọn",
    idea: "Áo choàng tím đen viền bạc, cổ áo cao sắc, chữ cái phát sáng bay quanh tay áo.",
    m: "a dark purple and silver battle-mage coat with a tall sharp collar, angular silver shoulder pieces, glowing violet letters orbiting the sleeves, sash with crystals, silk gloves with rings, pointed boots, floating crystal circlet above the head.", f: "a dark purple and silver battle-mage coat dress with a tall sharp collar, angular silver shoulder pieces, glowing violet letters orbiting the sleeves, sash with crystals, silk gloves with rings, pointed boots, floating crystal circlet above the head." },
  { id: "dawn_cleric", r: "rare", lv: 36, name: "Dawn Warden", vi: "Hộ vệ Bình Minh (Harmony)", how: "Rơi từ quái tinh anh · rương", stats: { hp: 50, mana: 25, resist: 8 }, head: "Vòng nguyệt quế vàng", gloves: "Găng trắng viền vàng", boots: "Ủng trắng",
    idea: "Giáp trắng-vàng, vai hình lông vũ, áo choàng dài – kiểu thánh kỵ sĩ.",
    m: "white and gold paladin armor with feather-shaped shoulder plates, sun emblem on the chest, long white cape, gold-trimmed gauntlets and boots, golden laurel circlet.", f: "white and gold paladin armor dress with feather-shaped shoulder plates, sun emblem on the chest, long white cape, gold-trimmed gauntlets and boots, golden laurel circlet." },
  { id: "beat_blade", r: "rare", lv: 40, name: "Beat Striker", vi: "Kiếm khách Nhịp Điệu (Rhythm)", how: "Rơi từ quái tinh anh · rương", stats: { voice: 8, speed: 10 }, head: "Mặt nạ nửa mặt cam", gloves: "Găng có móng ngắn", boots: "Giày chạy giáp nhẹ",
    idea: "Giáp nhẹ đen-cam, khăn quàng dài bay, mặt nạ nửa mặt – nhanh và ngầu.",
    m: "black and orange light armor, asymmetric shoulder plate, long flowing orange scarf, armored forearm guards with short claw tips on the gloves, light armored running boots, orange half mask over the lower face.", f: "black and orange fitted light armor, asymmetric shoulder plate, long flowing orange scarf, armored forearm guards with short claw tips on the gloves, light armored running boots, orange half mask over the lower face." },
  /* EPIC – giáp văn hoá */
  { id: "dong_son", r: "epic", lv: 45, zone: "🌾 Khu Việt", name: "Dong Son Warlord", vi: "Giáp đồng Đông Sơn", how: "Trùm truyền thuyết khu Việt rơi", stats: { voice: 15, hp: 60, resist: 15 }, head: "Mũ lông chim Lạc (lộ tóc)", gloves: "Găng đồng", boots: "Ủng đồng",
    idea: "Giáp đồng xanh rỉ, mặt trống đồng trên ngực, vai hình đầu chim Lạc, lông vũ cao.",
    m: "Vietnamese Dong Son bronze war armor: bronze chest plate shaped like a bronze drum face (concentric rings, star center, Lac bird patterns), shoulder plates shaped like Lac bird heads, red sash, bronze tassets over dark trousers, bronze gauntlets and greaves, tall feather crest headband like the drum warriors (hair visible).", f: "Vietnamese Dong Son bronze war armor: fitted bronze chest plate shaped like a bronze drum face, shoulder plates shaped like Lac bird heads, red sash, layered bronze tassets over a dark skirt, bronze gauntlets and greaves, tall feather crest headband (hair visible)." },
  { id: "sakura", r: "epic", lv: 55, zone: "⛩️ Khu Nhật", name: "Sakura Shogun", vi: "Tướng quân Sakura", how: "Trùm Sakura Rift rơi", stats: { voice: 18, resist: 15 }, head: "Mặt nạ menpo nửa dưới", gloves: "Găng kote", boots: "Ủng suneate",
    idea: "Giáp lá đỏ đen, vai sode lớn, cánh hoa anh đào phát sáng, chữ kana.",
    m: "red and black lacquered samurai armor with large sode shoulder plates, gold kana letters glowing on the plates, sakura petals drifting, wide hakama, armored kote sleeves, suneate shin guards, menpo half mask on the lower face (hair visible).", f: "red and black lacquered samurai armor, large sode shoulder plates, gold kana letters glowing on the plates, sakura petals drifting, pleated hakama, armored kote sleeves, suneate shin guards, menpo half mask on the lower face (hair visible)." },
  { id: "nile", r: "epic", lv: 65, zone: "🏜️ Khu Ai Cập", name: "Pharaoh's Scribe Guard", vi: "Vệ binh Thoth", how: "Trùm Nile Rift rơi", stats: { voice: 15, ears: 4, mana: 40 }, head: "Vương miện rắn hổ mang vàng", gloves: "Găng vàng", boots: "Dép giáp vàng",
    idea: "Giáp vàng-lam ngọc, cổ áo rộng, vai cánh chim ưng, chữ tượng hình phát sáng.",
    m: "Egyptian gold and lapis armor: broad jeweled collar, falcon-wing shoulder plates, gold scale chest piece with glowing hieroglyphs, white linen kilt with gold plates, gold gauntlets, armored sandals, cobra circlet (hair visible).", f: "Egyptian gold and lapis armor dress: broad jeweled collar, falcon-wing shoulder plates, gold scale bodice with glowing hieroglyphs, long white linen skirt with gold plates, gold gauntlets, armored sandals, cobra circlet (hair visible)." },
  { id: "rune", r: "epic", lv: 75, zone: "❄️ Khu Bắc Âu", name: "Frost Rune Jarl", vi: "Lãnh chúa Rune Băng", how: "Trùm Rune Rift rơi", stats: { hp: 90, resist: 20 }, head: "Vòng sừng băng", gloves: "Găng lông giáp", boots: "Ủng lông giáp",
    idea: "Giáp sắt đen + lông trắng, rune xanh băng, khiên tròn sau lưng, sừng băng.",
    m: "Norse jarl armor: dark iron plates with fur mantle, glowing ice-blue runes, round shield on the back, braided leather straps, fur-trimmed gauntlets and boots, circlet with small curved ice horns (hair visible).", f: "Norse jarl armor: dark iron fitted plates with fur mantle, glowing ice-blue runes, round shield on the back, fur-trimmed armored skirt, gauntlets and boots, circlet with small curved ice horns (hair visible)." },
  { id: "ogham", r: "epic", lv: 82, zone: "🍁 Khu Celt", name: "Oak Druid Knight", vi: "Kỵ sĩ Sồi", how: "Trùm Mist Rift rơi", stats: { mana: 50, luck: 10, hp: 50 }, head: "Gạc hươu bằng gỗ", gloves: "Găng vỏ cây", boots: "Ủng rễ cây",
    idea: "Giáp gỗ sồi + đồng, gạc hươu, dây leo, chữ Ogham xanh lục.",
    m: "Celtic druid knight armor made of carved oak bark and bronze, Celtic knot engravings, glowing green Ogham letters, moss cape, bark gauntlets, root-shaped boots, wooden antler headpiece (hair visible).", f: "Celtic druid knight armor dress made of carved oak bark and bronze, Celtic knot engravings, glowing green Ogham letters, moss cape, bark gauntlets, root-shaped boots, wooden antler headpiece (hair visible)." },
  { id: "jaguar", r: "epic", lv: 85, zone: "🏝️ Khu Maya", name: "Jaguar Sun Warrior", vi: "Chiến binh Báo Mặt Trời", how: "Trùm Jungle Rift rơi", stats: { speed: 12, voice: 15 }, head: "Mặt nạ báo nửa mặt", gloves: "Găng móng báo", boots: "Dép ngọc giáp",
    idea: "Giáp hoạ tiết báo đốm, ngọc bích, lông quetzal, glyph Maya.",
    m: "Maya jaguar warrior armor: jaguar-pattern padded armor, jade and gold plates, quetzal feather mantle, glowing glyph belt, jaguar-claw gauntlets, jade greaves, jaguar half mask on the upper face (hair visible).", f: "Maya jaguar warrior armor: jaguar-pattern fitted padded armor, jade and gold plates, quetzal feather mantle, glowing glyph belt, jaguar-claw gauntlets, jade greaves, jaguar half mask on the upper face (hair visible)." },
  { id: "hermes", r: "epic", lv: 85, zone: "🏛️ Khu Hy Lạp", name: "Olympian Herald", vi: "Sứ giả Olympus", how: "Trùm Marble Rift rơi", stats: { speed: 14, ears: 3, voice: 12 }, head: "Mũ chiến đấu có cánh (hở mặt, lộ tóc)", gloves: "Găng đồng", boots: "Dép giáp có cánh",
    idea: "Giáp ngực cơ bắp bằng đồng, áo choàng đỏ, cánh nhỏ ở mũ và giày.",
    m: "Greek bronze muscle cuirass, red cape, pteruges skirt, bronze vambraces, winged greaves and sandals, open bronze helmet with small wings (face and hair visible).", f: "Greek bronze fitted cuirass, red cape, layered pteruges skirt, bronze vambraces, winged greaves and sandals, open bronze helmet with small wings (face and hair visible)." },
  { id: "ink", r: "epic", lv: 88, zone: "🖌️ Khu Trung Hoa", name: "Ink Immortal", vi: "Tiên Mực Tàu (tu tiên)", how: "Trùm Ink Rift rơi", stats: { mana: 60, voice: 14 }, head: "Trâm ngọc + mũ miện nhỏ", gloves: "Bao tay lụa", boots: "Hài thêu",
    idea: "Đạo bào trắng-đen loang mực, giáp vai ngọc, chữ Hán bay, khí thế tu tiên.",
    m: "Chinese xianxia immortal battle robe: flowing white and black robe with ink-wash mountain patterns, jade shoulder armor, floating glowing Chinese characters, silk sash, silk arm guards, embroidered boots, small jade crown hairpin (hair visible).", f: "Chinese xianxia immortal battle robe dress: flowing white and black robe with ink-wash mountain patterns, jade shoulder armor, floating glowing Chinese characters, long silk sleeves, embroidered boots, small jade crown hairpin (hair visible)." },
  { id: "babel", r: "epic", lv: 95, zone: "🗿 Khu Lưỡng Hà", name: "Lamassu Guardian", vi: "Vệ thần Lamassu", how: "Trùm Babel Rift rơi", stats: { voice: 20, resist: 22, hp: 80 }, head: "Vòng sừng bò vàng", gloves: "Găng vảy vàng", boots: "Ủng vảy",
    idea: "Giáp vảy vàng-lam, cánh Lamassu nhỏ trên vai, bảng chữ hình nêm phát sáng.",
    m: "Mesopotamian Lamassu guardian armor: gold and lapis scale armor, small Lamassu wings on the shoulders, glowing cuneiform tablets on the belt, fringed sash, scale gauntlets and boots, gold circlet with small bull horns (hair visible).", f: "Mesopotamian Lamassu guardian armor: gold and lapis fitted scale armor, small Lamassu wings on the shoulders, glowing cuneiform tablets on the belt, fringed long skirt, scale gauntlets and boots, gold circlet with small bull horns (hair visible)." },
  /* LEGENDARY – hầm hố nhất */
  { id: "crown_voices", r: "legendary", lv: 40, name: "Voice of the City", vi: "Tiếng Nói Thành Phố", how: "Giải thoát 30 Word Spirit + tự nói đúng 300 câu", stats: { voice: 25, resist: 20, luck: 10 }, head: "Crown of Voices (vòng sóng âm vàng)", gloves: "Găng vàng", boots: "Ủng vàng",
    idea: "Giáp trắng-vàng, áo choàng in chữ phát sáng, vương miện sóng âm.",
    m: "legendary white and gold plate armor with sharp layered pauldrons, a long cape covered in glowing letters, gold gauntlets and boots, a crown made of floating golden sound-wave rings (hair visible).", f: "legendary white and gold fitted plate armor with sharp layered pauldrons, a long cape covered in glowing letters, gold gauntlets and boots, a crown made of floating golden sound-wave rings (hair visible)." },
  { id: "council", r: "legendary", lv: 90, name: "Council of Langua", vi: "Hội đồng Ngôn ngữ", how: "Sưu tầm đủ 8 giáp văn hoá", stats: { voice: 30, mana: 60, hp: 80 }, head: "Vòng sáng 8 hệ chữ", gloves: "Găng ánh sáng", boots: "Ủng ánh sáng",
    idea: "Giáp ghép 8 màu, vòng sau lưng xoay 8 hệ chữ.",
    m: "legendary armor made of 8 colored plate panels from 8 cultures, a large glowing halo ring behind the back with 8 writing systems (kana, hieroglyphs, runes, Ogham, Maya glyphs, Greek, Chinese, cuneiform), radiant gauntlets and boots.", f: "legendary fitted armor made of 8 colored plate panels from 8 cultures, a large glowing halo ring behind the back with 8 writing systems, radiant gauntlets and boots." },
  { id: "vox_prima", r: "legendary", lv: 100, name: "Vox Prima", vi: "Thanh Quản Nguyên Thuỷ", how: "Đánh bại Silentium (trận cuối)", stats: { voice: 40, resist: 30, ears: 5 }, head: "Mũ giáp ánh sáng (có nút Ẩn mũ)", gloves: "Găng tinh thể", boots: "Ủng tinh thể",
    idea: "Hầm hố nhất game: giáp vàng-trắng có vết nứt phát sáng, vai khổng lồ, cánh vòng sóng âm.",
    m: "the ultimate legendary armor: massive white-gold plate armor with glowing cracks of light, huge layered pauldrons, a crystal at the throat, wings made of sound-wave rings, crystal gauntlets and boots, sleek light helmet with an open face.", f: "the ultimate legendary armor: white-gold fitted plate armor with glowing cracks of light, large layered pauldrons, a crystal at the throat, wings made of sound-wave rings, crystal gauntlets and boots, sleek light helmet with an open face." }
];
