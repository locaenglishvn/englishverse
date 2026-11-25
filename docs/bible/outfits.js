/* TRANG PHỤC – concept "Giáp Cộng Hưởng" (Resonance Gear), đề xuất 25/11, chờ chủ dự án duyệt. Sửa nội dung trực tiếp ở đây.
   Ý tưởng: The Mute cướp giọng nói → giáp của Voice là thứ bảo vệ giọng nói: hoạ tiết sóng âm, vòng loa, âm thoa, chữ cái phát sáng.
   Mỗi bộ = giáp thân (áo + quần, 1 món) + giày + mũ (mũ, giày là món rời). Cùng 1 bộ: nam vai rộng, giáp chắc; nữ eo gọn, váy giáp / tà áo.
   Phần phát sáng theo màu độ hiếm. Bo tròn, không gai nhọn, kín đáo (trẻ 8–15).
   stats: voice (sát thương) · ears (thêm giây trả lời) · stamina · resist (chống độc) · luck · hp · mana · speed (%).
   m / f = mô tả bộ đồ cho câu lệnh vẽ (ghép vào OUTFIT_STYLE). img = ảnh 2D đã duyệt (sau khi vẽ). */
window.OUTFIT_STYLE = {
  m: "Use the attached boy (Voice Guard, male) as the exact reference: keep his face, hair, headset, body proportions (about 3.9 heads tall) and art style (soft 3D stylized game character). Only change his outfit to: ",
  f: "Use the attached girl (Voice Guard, female) as the exact reference: keep her face, hair, headset, body proportions (about 3.9 heads tall) and art style (soft 3D stylized game character). Only change her outfit to: ",
  tail: " Rounded kid-friendly armor shapes, no sharp spikes, modest, bright readable colors, glowing details in the rarity color. Hands empty. Full body, A-pose (arms angled down 30°), front view, plain light grey background, no text, no logo."
};
window.OUTFIT_TIERS = [
  { r: "common", name: "Common", how: "Mua ở Clothes Shop", lv: "Lv.1" },
  { r: "uncommon", name: "Uncommon", how: "Mua", lv: "Lv.5–12" },
  { r: "rare", name: "Rare", how: "Mua hoặc rơi từ quái tinh anh", lv: "Lv.15–35" },
  { r: "epic", name: "Epic · Giáp văn hoá", how: "Giải phóng khu văn hoá (trùm khu rơi bản vẽ, Uncle Dan / Ms. Lua làm)", lv: "Lv.30–95" },
  { r: "legendary", name: "Legendary", how: "Không bán – chỉ bằng thành tích tiếng Anh", lv: "Lv.40+" }
];
window.OUTFITS = [
  /* ---------- COMMON ---------- */
  { id: "vg_uniform", r: "common", lv: 1, name: "Voice Guard Uniform", vi: "Đồng phục Voice Guard", how: "Có sẵn khi tạo nhân vật", stats: {}, hat: "Tai nghe Voice Guard", shoes: "Giày thể thao xanh ngọc",
    idea: "Bộ người mới – chính là nhân vật chính hiện tại.", img: { m: "concept/characters/voice-guard-m.webp", f: "concept/characters/voice-guard-f.webp" },
    m: "the current Voice Guard uniform (teal vest with gold trim, white shirt, navy trousers, teal sneakers).", f: "the current Voice Guard uniform (open teal jacket, white shirt, navy pleated skirt, dark leggings, teal sneakers)." },
  { id: "school", r: "common", lv: 1, name: "School Uniform", vi: "Đồng phục học sinh", how: "Clothes Shop · 20 🪙", stats: { ears: 1 }, hat: "Không", shoes: "Giày bata trắng",
    idea: "Đồng phục học sinh Việt Nam – gần gũi.",
    m: "a Vietnamese school uniform: white short-sleeve shirt with a red scarf (khan quang do), navy trousers, white canvas shoes.", f: "a Vietnamese school uniform: white blouse with a red scarf (khan quang do), navy pleated skirt, white socks, white canvas shoes." },
  { id: "ba_ba", r: "common", lv: 1, name: "Ao Ba Ba Set", vi: "Áo bà ba", how: "Clothes Shop · 25 🪙", stats: { luck: 2 }, hat: "Nón lá", shoes: "Dép quai",
    idea: "Chất Việt dân dã, đi kèm nón lá.",
    m: "a traditional Vietnamese ao ba ba set in soft indigo, loose black trousers, conical leaf hat (non la), simple sandals.", f: "a traditional Vietnamese ao ba ba set in soft pink, loose black silk trousers, conical leaf hat (non la), simple sandals." },
  { id: "street", r: "common", lv: 1, name: "Street Hoodie", vi: "Áo hoodie dạo phố", how: "Clothes Shop · 30 🪙", stats: { speed: 3 }, hat: "Mũ lưỡi trai", shoes: "Giày sneaker",
    idea: "Đồ thường ngày, trẻ trung.",
    m: "a casual orange hoodie with a small sound-wave print, cargo shorts, baseball cap, sneakers.", f: "a casual lilac hoodie with a small sound-wave print, denim skirt over leggings, baseball cap, sneakers." },
  /* ---------- UNCOMMON ---------- */
  { id: "vg_armor", r: "uncommon", lv: 5, name: "Voice Guard Armor", vi: "Giáp Voice Guard", how: "Clothes Shop · 80 🪙", stats: { resist: 5, hp: 10 }, hat: "Tai nghe gắn mic vàng", shoes: "Ủng đệm xanh",
    idea: "Bản nâng cấp của đồng phục: miếng vai, đai lưng, huy hiệu sóng âm bằng kim loại.",
    m: "Voice Guard light armor: teal padded vest with rounded metal shoulder pads, gold sound-wave emblem on the chest, belt with a speaker-shaped buckle, navy trousers, padded teal boots.", f: "Voice Guard light armor: fitted teal padded jacket with small rounded shoulder pads, gold sound-wave emblem, belt with a speaker-shaped buckle, navy pleated skirt over leggings, padded teal boots." },
  { id: "scout", r: "uncommon", lv: 8, name: "Echo Scout", vi: "Trinh sát Tiếng Vọng", how: "Clothes Shop · 90 🪙", stats: { speed: 6, ears: 1 }, hat: "Mũ trùm tai thỏ có lưới thu âm", shoes: "Ủng da nhẹ",
    idea: "Hợp người thích chạy nhanh, đi khám phá vùng hoang dã.",
    m: "an explorer outfit: green hooded jacket with sound-catching mesh ear flaps, many pockets, brown trousers, light leather boots.", f: "an explorer outfit: green hooded cropped jacket with sound-catching mesh ear flaps, brown shorts over leggings, light leather boots." },
  { id: "drummer", r: "uncommon", lv: 12, name: "Festival Drummer", vi: "Tay trống lễ hội", how: "Clothes Shop · 100 🪙", stats: { voice: 5, stamina: 4 }, hat: "Khăn buộc trán đỏ", shoes: "Giày vải đỏ",
    idea: "Hợp nhánh Rhythm (trống): áo lễ hội, khăn buộc trán.",
    m: "a festival drummer outfit: red and gold sleeveless tunic with drum patterns, wide black trousers, red headband, red cloth shoes.", f: "a festival drummer outfit: red and gold tunic dress with drum patterns, black leggings, red headband with ribbons, red cloth shoes." },
  /* ---------- RARE ---------- */
  { id: "echo_knight", r: "rare", lv: 15, name: "Echo Knight", vi: "Hiệp sĩ Tiếng Vọng", how: "Clothes Shop · 300 🪙 hoặc rơi từ quái tinh anh", stats: { resist: 15, hp: 25 }, hat: "Mũ giáp hình loa", shoes: "Ủng giáp bạc",
    idea: "Nhánh Power: giáp bạc tròn trịa, vai là hai âm thoa, ngực có vòng loa phát sáng xanh.",
    m: "rounded silver knight armor with tuning-fork shaped shoulder guards, a glowing blue speaker ring on the chest, blue cape, silver boots, round helmet shaped like a megaphone bell.", f: "rounded silver knight armor with small tuning-fork shoulder guards, a glowing blue speaker ring on the chest, silver armored skirt, short blue cape, silver boots, round helmet shaped like a megaphone bell." },
  { id: "sound_mage", r: "rare", lv: 20, name: "Sound Mage", vi: "Pháp sư Âm thanh", how: "Clothes Shop · 320 🪙", stats: { voice: 10, mana: 20 }, hat: "Mũ chóp có nốt nhạc", shoes: "Hài vải tím",
    idea: "Nhánh Control: áo choàng tím in khuông nhạc, nốt nhạc phát sáng bay quanh tay áo.",
    m: "a purple mage robe printed with glowing musical staff lines, wide sleeves, gold sash, pointed hat with a glowing music note, purple cloth shoes.", f: "a purple mage dress robe printed with glowing musical staff lines, flowing sleeves, gold sash, pointed hat with a glowing music note, purple cloth shoes." },
  { id: "harmony_healer", r: "rare", lv: 25, name: "Harmony Healer", vi: "Thầy thuốc Hoà Âm", how: "Clothes Shop · 300 🪙", stats: { hp: 30, mana: 15 }, hat: "Vòng nguyệt quế xanh", shoes: "Giày trắng",
    idea: "Nhánh Harmony (hồi máu): áo trắng xanh lá, đàn hạc nhỏ thêu trên ngực.",
    m: "a white and leaf-green healer tunic with a small embroidered harp on the chest, light green trousers, leaf laurel circlet, white shoes.", f: "a white and leaf-green healer dress with a small embroidered harp on the chest, light leggings, leaf laurel circlet, white shoes." },
  { id: "rhythm_fighter", r: "rare", lv: 30, name: "Rhythm Fighter", vi: "Võ sĩ Nhịp Điệu", how: "Rơi từ quái tinh anh", stats: { voice: 8, speed: 8 }, hat: "Băng đô có loa nhỏ", shoes: "Giày võ cam",
    idea: "Nhánh Rhythm: đồ võ cam, găng tay có mặt trống nhỏ.",
    m: "an orange martial-arts outfit with drum-skin patches on the forearms, black belt with speaker buckle, loose black trousers, headband with tiny speakers, orange kung-fu shoes.", f: "an orange martial-arts outfit with drum-skin patches on the forearms, black belt with speaker buckle, black wide trousers, headband with tiny speakers, orange kung-fu shoes." },
  /* ---------- EPIC · GIÁP VĂN HOÁ ---------- */
  { id: "dong_son", r: "epic", lv: 30, zone: "🌾 Khu Việt", name: "Dong Son Bronze", vi: "Giáp đồng Đông Sơn", how: "Hạ 4 trùm truyền thuyết khu Việt", stats: { voice: 12, resist: 15 }, hat: "Mũ lông chim kiểu trống đồng", shoes: "Dép đồng",
    idea: "Mặt trống đồng trước ngực (vòng đồng tâm, ngôi sao giữa), hoạ tiết chim Lạc, đai đỏ.",
    m: "Vietnamese Dong Son bronze armor: bronze chest plate shaped like a bronze drum face (concentric rings, star in the center, Lac bird patterns), red sash, white trousers, feathered headdress like the warriors on the drum, bronze sandals.", f: "Vietnamese Dong Son bronze armor: bronze chest plate shaped like a bronze drum face (concentric rings, star in the center, Lac bird patterns), red sash, layered white skirt, feathered headdress like the warriors on the drum, bronze sandals." },
  { id: "sakura", r: "epic", lv: 55, zone: "⛩️ Khu Nhật", name: "Sakura Samurai", vi: "Võ sĩ Sakura", how: "Giải phóng Sakura Rift", stats: { voice: 15, resist: 12 }, hat: "Mũ kabuto trăng lưỡi liềm", shoes: "Dép waraji",
    idea: "Giáp lá đỏ buộc dây, chữ kana phát sáng trên tay áo.",
    m: "red lacquered samurai armor (rounded plates laced with cream cords), glowing kana letters on the sleeves, wide dark hakama trousers, kabuto helmet with a gold crescent, straw sandals.", f: "red lacquered samurai armor (rounded plates laced with cream cords), glowing kana letters on the sleeves, pleated hakama skirt, kabuto helmet with a gold crescent, straw sandals." },
  { id: "nile", r: "epic", lv: 65, zone: "🏜️ Khu Ai Cập", name: "Scribe of Thoth", vi: "Thư lại của Thoth", how: "Giải phóng Nile Rift", stats: { voice: 12, ears: 4, mana: 20 }, hat: "Mũ nemes vàng xanh", shoes: "Dép vàng",
    idea: "Vải lanh trắng, cổ áo vàng xanh, chữ tượng hình phát sáng.",
    m: "Egyptian scribe outfit: white linen tunic, broad gold and lapis collar, glowing hieroglyphs on the belt, gold arm cuffs, blue and gold nemes headdress, gold sandals.", f: "Egyptian scribe outfit: white linen dress, broad gold and lapis collar, glowing hieroglyphs on the belt, gold arm cuffs, blue and gold nemes headdress, gold sandals." },
  { id: "rune", r: "epic", lv: 75, zone: "❄️ Khu Bắc Âu", name: "Rune Warden", vi: "Hộ vệ Rune", how: "Giải phóng Rune Rift", stats: { hp: 40, resist: 20 }, hat: "Mũ lông có sừng tròn", shoes: "Ủng lông",
    idea: "Áo lông, khiên tròn sau lưng, chữ rune xanh băng phát sáng.",
    m: "Norse rune warden outfit: fur-trimmed blue tunic, leather vest with glowing ice-blue runes, round shield on the back, fur boots, fur cap with small rounded horns.", f: "Norse rune warden outfit: fur-trimmed blue dress tunic, leather vest with glowing ice-blue runes, braided belt, fur boots, fur cap with small rounded horns." },
  { id: "ogham", r: "epic", lv: 82, zone: "🍁 Khu Celt", name: "Ogham Druid", vi: "Tu sĩ Ogham", how: "Giải phóng Mist Rift", stats: { mana: 30, luck: 8 }, hat: "Vòng lá sồi", shoes: "Giày da mềm",
    idea: "Áo choàng xanh rêu, hoa văn nút thắt Celt, vạch chữ Ogham.",
    m: "Celtic druid outfit: moss-green hooded cloak with Celtic knot borders, cream tunic with glowing Ogham line letters, oak-leaf circlet, soft leather shoes.", f: "Celtic druid outfit: moss-green hooded cloak with Celtic knot borders, long cream dress with glowing Ogham line letters, oak-leaf circlet, soft leather shoes." },
  { id: "jaguar", r: "epic", lv: 85, zone: "🏝️ Khu Maya", name: "Jaguar Glyph", vi: "Chiến binh Báo đốm", how: "Giải phóng Jungle Rift", stats: { speed: 10, voice: 12 }, hat: "Mũ lông quetzal", shoes: "Dép ngọc bích",
    idea: "Áo hoạ tiết báo đốm, ngọc bích, glyph Maya phát sáng.",
    m: "Maya jaguar warrior outfit: jaguar-pattern padded tunic, jade collar, glowing Maya glyph belt, quetzal feather headdress, jade sandals.", f: "Maya jaguar warrior outfit: jaguar-pattern padded dress, jade collar, glowing Maya glyph belt, quetzal feather headdress, jade sandals." },
  { id: "hermes", r: "epic", lv: 85, zone: "🏛️ Khu Hy Lạp", name: "Messenger of Hermes", vi: "Sứ giả Hermes", how: "Giải phóng Marble Rift", stats: { speed: 12, ears: 3 }, hat: "Mũ có cánh", shoes: "Dép có cánh",
    idea: "Áo chiton trắng viền vàng, mũ và dép có cánh nhỏ.",
    m: "Greek messenger outfit: white chiton tunic with gold Greek-key border, short blue cloak, winged hat, winged sandals.", f: "Greek messenger outfit: long white chiton dress with gold Greek-key border, short blue cloak, winged hairband, winged sandals." },
  { id: "ink", r: "epic", lv: 88, zone: "🖌️ Khu Trung Hoa", name: "Ink Immortal", vi: "Đạo bào Mực Tàu (tu tiên)", how: "Giải phóng Ink Rift", stats: { mana: 30, voice: 10 }, hat: "Trâm ngọc búi tóc", shoes: "Hài vải",
    idea: "Phong cách tu tiên: đạo bào trắng loang mực, chữ Hán bay quanh tay áo.",
    m: "Chinese ink-painting immortal robe: flowing white and grey robe with ink-wash mountain patterns, glowing Chinese characters floating around the sleeves, jade hairpin, cloth shoes.", f: "Chinese ink-painting immortal dress robe: flowing white and grey robe with ink-wash mountain patterns, glowing Chinese characters floating around the sleeves, jade hairpin, cloth shoes." },
  { id: "babel", r: "epic", lv: 95, zone: "🗿 Khu Lưỡng Hà", name: "Babel Scribe", vi: "Thư lại Babel", how: "Giải phóng Babel Rift", stats: { voice: 18, resist: 18 }, hat: "Mũ trụ vàng", shoes: "Dép đất nung",
    idea: "Áo len tua rua, bảng đất sét chữ hình nêm đeo hông.",
    m: "Mesopotamian scribe outfit: layered fringed wool robe in sand and blue, clay tablet with glowing cuneiform on the belt, gold cylinder cap, terracotta sandals.", f: "Mesopotamian scribe outfit: layered fringed wool dress in sand and blue, clay tablet with glowing cuneiform on the belt, gold cylinder cap, terracotta sandals." },
  /* ---------- LEGENDARY ---------- */
  { id: "crown_voices", r: "legendary", lv: 40, name: "Voice of the City", vi: "Tiếng Nói Thành Phố", how: "Giải thoát 30 Word Spirit + tự nói đúng 300 câu (đã có Crown of Voices)", stats: { voice: 20, resist: 20, luck: 10 }, hat: "Crown of Voices", shoes: "Ủng vàng",
    idea: "Giáp vàng trắng, vương miện là vòng sóng âm, áo choàng in chữ cái phát sáng.",
    m: "legendary white and gold armor, cape covered with softly glowing letters, crown made of golden sound-wave rings, gold boots.", f: "legendary white and gold armor dress, cape covered with softly glowing letters, crown made of golden sound-wave rings, gold boots." },
  { id: "council", r: "legendary", lv: 90, name: "Council of Langua", vi: "Hội đồng Ngôn ngữ", how: "Sưu tầm đủ 8 giáp văn hoá", stats: { voice: 25, mana: 40, hp: 40 }, hat: "Vòng 8 hệ chữ", shoes: "Giày ánh sáng",
    idea: "Áo choàng ghép 8 màu, vòng sau lưng xoay 8 hệ chữ (kana, tượng hình, rune, Ogham, glyph, Hy Lạp, Hán, hình nêm).",
    m: "legendary robe made of 8 colored panels, a glowing halo ring behind the back carrying 8 writing systems (kana, hieroglyphs, runes, Ogham, Maya glyphs, Greek, Chinese, cuneiform), light boots.", f: "legendary dress robe made of 8 colored panels, a glowing halo ring behind the back carrying 8 writing systems (kana, hieroglyphs, runes, Ogham, Maya glyphs, Greek, Chinese, cuneiform), light boots." },
  { id: "vox_prima", r: "legendary", lv: 100, name: "Vox Prima", vi: "Thanh Quản Nguyên Thuỷ", how: "Đánh bại Silentium (trận cuối)", stats: { voice: 35, resist: 30, ears: 5 }, hat: "Vòng sáng", shoes: "Giày ánh sáng",
    idea: "Giáp ánh sáng vàng trắng của Vocara, tinh thể thanh quản ở cổ, cánh là vòng sóng âm.",
    m: "legendary armor of light, white-gold glowing plates, a crystal at the throat (Vox Prima), wings made of sound-wave rings, glowing boots, simple light halo.", f: "legendary armor dress of light, white-gold glowing plates, a crystal at the throat (Vox Prima), wings made of sound-wave rings, glowing boots, simple light halo." }
];
