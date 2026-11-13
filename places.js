/* ===== DỮ LIỆU THÀNH PHỐ: vật phẩm, cửa hàng, địa điểm =====
   Sửa ở đây để đổi tên, giá, tác dụng – không cần đụng code game (index.html).
   Tên vật phẩm là tiếng Anh vì đó cũng là từ vựng người chơi sẽ học. */

/* VẬT PHẨM
   price  = giá (xu 🪙)
   energy = hồi bao nhiêu năng lượng ⚡ khi dùng
   cure   = true: chữa trúng độc "Mute poison" ☠️
   protect = số giây miễn nhiễm độc sau khi dùng */
const ITEMS = {
  banhmi:     { name: "Banh mi",       icon: "🥖", price: 8,  energy: 30, desc: "A Vietnamese sandwich. +30 energy." },
  donut:      { name: "Donut",         icon: "🍩", price: 5,  energy: 15, desc: "Sweet and soft. +15 energy." },
  milk:       { name: "Milk",          icon: "🥛", price: 4,  energy: 10, desc: "A glass of fresh milk. +10 energy." },
  icedcoffee: { name: "Iced coffee",   icon: "🧋", price: 6,  energy: 20, desc: "Cold and strong. +20 energy." },
  syrup:      { name: "Throat syrup",  icon: "🧴", price: 12, cure: true, desc: "Cures Mute poison." },
  vaccine:    { name: "Voice vaccine", icon: "💉", price: 25, cure: true, protect: 300, desc: "Cures poison and protects you for 5 minutes." },
  apple:      { name: "Apple",         icon: "🍎", price: 3,  energy: 8,  desc: "A red, crunchy apple. +8 energy." },
  banana:     { name: "Banana",        icon: "🍌", price: 3,  energy: 8,  desc: "Yellow and sweet. +8 energy." },
  water:      { name: "Water",         icon: "💧", price: 2,  energy: 5,  desc: "A bottle of water. +5 energy." },
  riceball:   { name: "Rice ball",     icon: "🍙", price: 6,  energy: 20, desc: "Rice with a little salt. +20 energy." },
  pho:        { name: "Pho",           icon: "🍜", price: 15, energy: 50, desc: "Hot beef noodle soup. +50 energy." },
  springroll: { name: "Spring rolls",  icon: "🌯", price: 10, energy: 30, desc: "Fresh rolls with shrimp. +30 energy." },
  lemontea:   { name: "Lemon tea",     icon: "🍹", price: 5,  energy: 12, desc: "Cold lemon tea. +12 energy." },
  popcorn:    { name: "Popcorn",       icon: "🍿", price: 6,  energy: 15, desc: "Salty popcorn for the movie. +15 energy." },
  // 💇 Dịch vụ cắt tóc (Saigon Barber): đổi khuôn mặt + kiểu tóc ngay, không vào túi
  hair_Rogue:     { name: "Long hair",   icon: "👩", price: 12, head: "Rogue",     desc: "Long red hair (Alex style)." },
  hair_Knight:    { name: "Short hair",  icon: "👱", price: 12, head: "Knight",    desc: "Short blond hair (Sam style)." },
  hair_Mage:      { name: "Black hair",  icon: "🧑", price: 12, head: "Mage",      desc: "Thick black hair (Robin style)." },
  hair_Barbarian: { name: "Beard style", icon: "🧔", price: 12, head: "Barbarian", desc: "Bald head with a big beard (Max style)." },
  // 🛋️ Nội thất (Home & Cozy): giao thẳng về nhà (🏠 My Home); decor = mô hình trong assets/furniture
  d_couch:   { name: "Sofa",          icon: "🛋️", price: 60, decor: "couch_pillows",            desc: "A soft sofa for your home." },
  d_chair:   { name: "Armchair",      icon: "💺", price: 35, decor: "armchair_pillows",         desc: "A cosy armchair." },
  d_lamp:    { name: "Floor lamp",    icon: "💡", price: 25, decor: "lamp_standing",            desc: "A tall lamp." },
  d_cactus:  { name: "Cactus",        icon: "🌵", price: 15, decor: "cactus_medium_A",          desc: "A plant that needs little water." },
  d_shelf:   { name: "Bookshelf",     icon: "📚", price: 70, decor: "shelf_B_large_decorated",  desc: "A big shelf full of books." },
  d_table:   { name: "Table",         icon: "🪑", price: 40, decor: "table_medium",             desc: "A wooden table." },
  d_cabinet: { name: "Cabinet",       icon: "🗄️", price: 45, decor: "cabinet_medium_decorated", desc: "A cabinet with nice things on top." },
  d_rug:     { name: "Round rug",     icon: "🟠", price: 20, decor: "rug_oval_A",               desc: "A round rug for the floor." }
};

/* TRANG PHỤC (mặc vào nhân vật, bán ở Clothes Shop)
   slot   = ô trang bị: hat (🧢 mũ), top (👕 áo), legs (👟 quần + giày), cape (🎒 phụ kiện: áo choàng)
   model  = lấy bộ phận từ nhân vật nào: Rogue, Knight, Mage, Barbarian (hat thì thêm part = tên mũ; hood = mũ trùm thay cả đầu)
   plain  = true: bản vải trơn (đen trắng) để nhuộm màu bằng tint; tint = màu nhuộm (0xRRGGBB)
   rarity = common | uncommon | rare | epic | legendary;  lv = cấp cần có để mặc
   stats  = voice (sát thương), ears (thêm giây trả lời), stamina (tốn ít năng lượng, hồi nhanh), resist (khó trúng độc), luck (thêm xu)
   Legendary KHÔNG bán: chỉ nhận được bằng thành tích tiếng Anh (xem LEGENDS bên dưới). */
const RARITY = {
  common:    { name: "Common",    color: "#adb5bd" },
  uncommon:  { name: "Uncommon",  color: "#40c057" },
  rare:      { name: "Rare",      color: "#339af0" },
  epic:      { name: "Epic",      color: "#9775fa" },
  legendary: { name: "Legendary", color: "#fab005" }
};
Object.assign(ITEMS, {
  // 👕 Áo
  tee_white:   { name: "White T-shirt",   icon: "👕", slot: "top", model: "Rogue", plain: true, tint: 0xffffff, rarity: "common", lv: 1, price: 15, stats: {}, desc: "A simple white T-shirt." },
  tee_red:     { name: "Red T-shirt",     icon: "👕", slot: "top", model: "Rogue", plain: true, tint: 0xff8787, rarity: "common", lv: 1, price: 20, stats: { stamina: 2 }, desc: "A bright red T-shirt." },
  tee_blue:    { name: "Blue T-shirt",    icon: "👕", slot: "top", model: "Rogue", plain: true, tint: 0x74c0fc, rarity: "common", lv: 1, price: 20, stats: { ears: 1 }, desc: "A cool blue T-shirt." },
  tee_yellow:  { name: "Yellow T-shirt",  icon: "👕", slot: "top", model: "Rogue", plain: true, tint: 0xffe066, rarity: "common", lv: 1, price: 25, stats: { luck: 2 }, desc: "A sunny yellow T-shirt." },
  jacket:      { name: "Explorer Jacket", icon: "🧥", slot: "top", model: "Rogue", rarity: "uncommon", lv: 3, price: 90, stats: { stamina: 5, luck: 3 }, desc: "A jacket with many pockets." },
  vest:        { name: "Viking Vest",     icon: "🦺", slot: "top", model: "Barbarian", rarity: "uncommon", lv: 3, price: 80, stats: { stamina: 8 }, desc: "Warm and strong." },
  robe:        { name: "Wizard Robe",     icon: "🥻", slot: "top", model: "Mage", rarity: "rare", lv: 5, price: 280, stats: { voice: 10, ears: 2 }, desc: "Your words sound more powerful." },
  armor:       { name: "Knight Armor",    icon: "🛡️", slot: "top", model: "Knight", rarity: "rare", lv: 5, price: 340, stats: { resist: 20 }, desc: "The Mute can’t poison you easily." },
  royal:       { name: "Royal Armor",     icon: "👑", slot: "top", model: "Knight", tint: 0xd0b8ff, rarity: "epic", lv: 10, price: 900, stats: { voice: 15, resist: 25 }, desc: "Shiny purple armor for heroes." },
  // 👟 Quần + giày
  pants_plain: { name: "Grey Pants",      icon: "👖", slot: "legs", model: "Rogue", plain: true, tint: 0xb0bccb, rarity: "common", lv: 1, price: 15, stats: {}, desc: "Simple grey pants and shoes." },
  jeans:       { name: "Blue Jeans",      icon: "👖", slot: "legs", model: "Rogue", plain: true, tint: 0x74a9e8, rarity: "common", lv: 1, price: 20, stats: { stamina: 1 }, desc: "Everyone loves jeans." },
  boots_exp:   { name: "Explorer Boots",  icon: "🥾", slot: "legs", model: "Rogue", rarity: "uncommon", lv: 3, price: 60, stats: { stamina: 4 }, desc: "Good for long walks." },
  boots_vik:   { name: "Viking Boots",    icon: "👢", slot: "legs", model: "Barbarian", rarity: "uncommon", lv: 3, price: 70, stats: { stamina: 5, resist: 3 }, desc: "Fur boots for cold days." },
  boots_wiz:   { name: "Wizard Boots",    icon: "👞", slot: "legs", model: "Mage", rarity: "rare", lv: 5, price: 220, stats: { ears: 2, luck: 3 }, desc: "Quiet boots. You hear better." },
  boots_kn:    { name: "Knight Boots",    icon: "🦿", slot: "legs", model: "Knight", rarity: "rare", lv: 5, price: 250, stats: { resist: 10 }, desc: "Heavy metal boots." },
  // 🧢 Mũ
  straw_hat:   { name: "Straw Hat",       icon: "👒", slot: "hat", model: "Barbarian", part: "Barbarian_Hat", tint: 0xffe8a3, rarity: "common", lv: 1, price: 25, stats: { luck: 2 }, desc: "A sunny summer hat." },
  viking_hat:  { name: "Viking Hat",      icon: "🪖", slot: "hat", model: "Barbarian", part: "Barbarian_Hat", rarity: "uncommon", lv: 3, price: 80, stats: { resist: 5 }, desc: "A hat with horns!" },
  hood:        { name: "Ninja Hood",      icon: "🥷", slot: "hat", model: "Rogue_Hooded", hood: true, rarity: "uncommon", lv: 3, price: 70, stats: { luck: 5 }, desc: "Quiet like a ninja." },
  wizard_hat:  { name: "Wizard Hat",      icon: "🎩", slot: "hat", model: "Mage", part: "Mage_Hat", rarity: "rare", lv: 5, price: 260, stats: { voice: 5, ears: 2 }, desc: "A tall, magic hat." },
  helmet:      { name: "Knight Helmet",   icon: "⛑️", slot: "hat", model: "Knight", part: "Knight_Helmet", rarity: "rare", lv: 5, price: 300, stats: { resist: 15 }, desc: "Protects your head." },
  crown:       { name: "Crown of Voices", icon: "🏆", slot: "hat", model: "Knight", part: "Knight_Helmet", tint: 0xffd43b, rarity: "legendary", lv: 15, stats: { voice: 20, resist: 20, luck: 10 }, desc: "Only for true speakers. Not for sale!" },
  // 🎒 Phụ kiện (áo choàng)
  cape_exp:    { name: "Explorer Cape",   icon: "🧣", slot: "cape", model: "Rogue", rarity: "uncommon", lv: 3, price: 70, stats: { luck: 5 }, desc: "A short travel cape." },
  cape_vik:    { name: "Viking Cape",     icon: "🧣", slot: "cape", model: "Barbarian", rarity: "uncommon", lv: 3, price: 80, stats: { stamina: 5 }, desc: "A warm fur cape." },
  cape_wiz:    { name: "Wizard Cape",     icon: "🧣", slot: "cape", model: "Mage", rarity: "rare", lv: 5, price: 240, stats: { voice: 8 }, desc: "A long magic cape." },
  cape_kn:     { name: "Knight Cape",     icon: "🧣", slot: "cape", model: "Knight", rarity: "rare", lv: 5, price: 260, stats: { resist: 8 }, desc: "A red cape for brave knights." },
  cape_star:   { name: "Star Cape",       icon: "🌟", slot: "cape", model: "Mage", tint: 0xffe066, rarity: "epic", lv: 10, price: 850, stats: { voice: 12, luck: 12 }, desc: "It shines like the stars." }
});

/* ĐỒ HUYỀN THOẠI: chỉ nhận bằng thành tích tiếng Anh (không mua được)
   spirits = số Word Spirit đã giải thoát;  spoken = số câu TỰ NÓI qua micro được máy chấm đúng */
const LEGENDS = [
  { item: "crown", need: { spirits: 30, spoken: 300 }, title: "Voice of the City", desc: "Free 30 Word Spirits and speak 300 sentences by yourself." }
];

/* Quà cho người chơi mới: chỉ có áo thun trắng + quần xám. Muốn đẹp hơn thì đi mua! */
const STARTER = { coins: 20, items: { banhmi: 1 }, equip: { top: "tee_white", legs: "pants_plain", hat: null, cape: null } };

/* ĐỊA ĐIỂM TRONG THÀNH PHỐ (nhà có mái, đi vào được)
   x, z   = vị trí giữa tòa nhà trên bản đồ;  w, d = rộng, sâu (mét)
   door   = cửa quay về hướng nào: "south" (xuống), "north" (lên), "east", "west"
   color/roof/awning = màu tường / mái / mái hiên
   keeper = người bán: tên, màu áo, câu chào, câu gợi ý cho người chơi nói (null = không có người bán)
   sells  = các món bán (id trong ITEMS ở trên). Để trống [] nếu chưa bán gì
   model  = mô hình 3D bên ngoài (building_A … building_H trong assets/city); scale = độ phóng to (mặc định 5)
   exterior = ngoại thất vẽ riêng (townhall, hospital, school, cafe, home – xem mục 8c trong index.html); khi có thì bỏ qua model */
const CITY = [
  { id: "bakery", name: "Banh Mi Bakery", type: "bakery", x: -32.5, z: 6.5, w: 6, d: 9, door: "east", exterior: "bakeryDoor", layout: "bakery", size: { w: 20, d: 48, h: 7 },   // căn nhà ống vàng sát Cafe Sua Da
    color: 0xffe8cc, roof: 0xc0392b, awning: 0xe67e22, floor: 0xe9c99a, wall: 0xfff4e0,
    keeper: { name: "Anna – Baker", color: 0xf08c00, greet: "Good morning! Everything is fresh today. What would you like?", hint: "Can I have a banh mi, please?" },
    sells: ["banhmi", "donut", "milk"] },
  { id: "pharmacy", name: "Green Cross Pharmacy", type: "pharmacy", x: 68, z: -10, w: 10, d: 10, door: "south", exterior: "pharmacy",
    color: 0xe6fcf5, roof: 0x2b8a3e, awning: 0x37b24d, floor: 0xdee2e6, wall: 0xf8f9fa,
    keeper: { name: "Sam – Pharmacist", color: 0x1c7ed6, greet: "Hello! How are you feeling today?", hint: "I have a sore throat. Can I have some throat syrup?" },
    sells: ["syrup", "vaccine"] },
  { id: "clothes", name: "Clothes Shop", type: "clothes", x: 80, z: -10, w: 10, d: 10, door: "south", exterior: "clothes",
    color: 0xfff0f6, roof: 0x9c36b5, awning: 0xe64980, floor: 0xf1e3d3, wall: 0xfff5f9,
    keeper: { name: "Kim – Designer", color: 0xe64980, greet: "Hi! Welcome to the Clothes Shop. Do you like hats, T-shirts or capes?", hint: "Can I have the red T-shirt, please?" },
    sells: ["tee_red", "tee_blue", "tee_yellow", "jeans", "straw_hat", "jacket", "vest", "boots_exp", "boots_vik", "viking_hat", "hood", "cape_exp", "cape_vik", "robe", "armor", "boots_wiz", "boots_kn", "wizard_hat", "helmet", "cape_wiz", "cape_kn", "royal", "cape_star"] },
  { id: "townhall", name: "Town Hall", type: "townhall", x: 0, z: -44, w: 32, d: 13, door: "south", exterior: "townhall", layout: "townhall", size: { w: 36, d: 48, h: 12 },
    color: 0xf1f3f5, roof: 0x495057, awning: 0x1c7ed6, floor: 0xc9a27e, wall: 0xf8f0e3,
    keeper: { name: "Mr. Lee – Mayor", color: 0x343a40, greet: "Welcome to Town Hall! The quest board will open soon.", hint: "I'd like to take a quest." },
    sells: [] },
  { id: "hospital", name: "City Hospital", type: "hospital", x: -62, z: -40, w: 20, d: 11, door: "east", exterior: "hospital", layout: "hospital", size: { w: 60, d: 72, h: 6 },
    color: 0xffffff, roof: 0xc92a2a, awning: 0xfa5252, floor: 0xe7f5ff, wall: 0xffffff,
    keeper: { name: "Nurse Mai", color: 0x74c0fc, greet: "Hello! Doctor Pasteur is working in his lab. He will need your help soon.", hint: "I feel sick." },
    sells: [] },
  { id: "cafe", name: "Cafe Sua Da", type: "cafe", x: -32, z: 0, w: 19, d: 10, door: "east", exterior: "cafe", layout: "greenhouse", size: { w: 20, d: 48, h: 8 },
    color: 0xfff1e0, roof: 0xd62828, awning: 0xe8590c, floor: 0xe9d8b4, wall: 0xfff4e6,
    keeper: null,   // không có người bán: Mia (trong lessons.js) đứng sau quầy và nói chuyện với khách
    sells: [] },
  /* --- Các địa điểm mới (ngoại thất tạm dùng mô hình nhà phố, sẽ thay sau) ---
     layout = kiểu bày nội thất: shop | tables | shelves | desks | museum | cinema | salon | lab | home
     goods  = đồ trưng bày (emoji). NPC hội thoại của từng nơi nằm trong lessons.js (place: "id"). */
  // Hàng phía bắc (cửa nhìn ra North Avenue)
  { id: "school", name: "Verse School", type: "school", x: -82, z: -14, w: 24, d: 18, door: "south", exterior: "school", layout: "campus", size: { w: 60, d: 72, h: 12 },
    color: 0xfff3bf, roof: 0x1971c2, awning: 0xfab005, floor: 0xd9b38c, wall: 0xfff9db, goods: ["📚", "✏️", "📐", "🌍", "🎒", "🧮"], keeper: null, sells: [] },
  { id: "museum", name: "City Museum", type: "museum", x: -35, z: 40, w: 26, d: 12, door: "east", exterior: "museum", layout: "museumhall", size: { w: 60, d: 72, h: 14 },
    color: 0xf1f3f5, roof: 0x5c5f66, awning: 0x868e96, floor: 0xe9ecef, wall: 0xf8f9fa, goods: ["🦖", "🏺", "🗿", "⚱️", "🦴", "👑"], keeper: null, sells: [] },
  { id: "library", name: "Verse Library", type: "library", x: 35, z: 40, w: 20, d: 12, door: "west", exterior: "library", layout: "oval", size: { w: 28, d: 40, h: 12 },
    color: 0xe7f5ff, roof: 0x364fc7, awning: 0x4c6ef5, floor: 0xc9a27e, wall: 0xf3f0ff, goods: ["📕", "📗", "📘", "📙", "📖", "📚"], keeper: null, sells: [] },
  { id: "bank", name: "Verse Bank", type: "bank", x: 33, z: -40, w: 20, d: 14, door: "west", exterior: "bank", layout: "bankhall", size: { w: 28, d: 44, h: 13 },
    color: 0xf8f9fa, roof: 0x2b8a3e, awning: 0x2f9e44, floor: 0xdee2e6, wall: 0xf1f3f5, goods: ["💰", "💳", "🪙", "💵", "🏦", "📈"], keeper: null, sells: [] },
  { id: "post", name: "Post Office", type: "post office", x: -33, z: -40, w: 28, d: 12, door: "east", exterior: "post", layout: "posthall", size: { w: 24, d: 48, h: 9 },
    color: 0xfff4e6, roof: 0xe8590c, awning: 0xfd7e14, floor: 0xe9d8b4, wall: 0xfff4e6, goods: ["📮", "✉️", "📦", "📬", "🏷️", "📫"], keeper: null, sells: [] },
  { id: "lab", name: "Science Lab", type: "science lab", x: -75, z: -112, w: 12, d: 12, door: "south", model: "building_F", scale: 6, layout: "lab",
    color: 0xe3fafc, roof: 0x0b7285, awning: 0x15aabf, floor: 0xdee2e6, wall: 0xf8f9fa, goods: ["🧪", "🔬", "🧫", "🧲", "🔭", "⚗️"], keeper: null, sells: [] },
  // Hàng giữa (cửa nhìn ra Market Street)
  { id: "furniture", name: "Home & Cozy", type: "furniture store", x: 56, z: -10, w: 10, d: 10, door: "south", exterior: "furniture", layout: "homecozy", size: { w: 60, d: 72, h: 10 },
    color: 0xf8f0e3, roof: 0x8d5a2b, awning: 0xa0522d, floor: 0xd9b38c, wall: 0xfff8f0, goods: [],
    keeper: { name: "Omar – Seller", color: 0x8d5a2b, greet: "Hello! Welcome to Home & Cozy. Do you need furniture for your home?", hint: "I’d like the sofa, please." },
    sells: ["d_couch", "d_chair", "d_lamp", "d_cactus", "d_shelf", "d_table", "d_cabinet", "d_rug"] },
  { id: "restaurant", name: "Pho Corner", type: "restaurant", x: 108, z: -10, w: 10, d: 10, door: "south", model: "building_E", layout: "tables",
    color: 0xfff5f5, roof: 0xc92a2a, awning: 0xf03e3e, floor: 0xe9c99a, wall: 0xfff4e6, goods: ["🍜", "🌯", "🍹", "🥢", "🍚", "🌶️"],
    keeper: { name: "Chef Bao – Cook", color: 0xf8f9fa, greet: "Welcome to Pho Corner! Are you hungry?", hint: "Can I have a bowl of pho, please?" },
    sells: ["pho", "springroll", "lemontea"] },
  { id: "salon", name: "Saigon Barber", type: "barber shop", x: 92, z: -10, w: 10, d: 10, door: "south", exterior: "barber", layout: "salon",
    color: 0xf3f0ff, roof: 0x7048e8, awning: 0x9775fa, floor: 0xf1f3f5, wall: 0xf8f0fc, goods: ["✂️", "💈", "🪮", "🧴", "💇", "🪞"],
    keeper: { name: "Lily – Hairdresser", color: 0x9775fa, greet: "Hi! Welcome to Saigon Barber. What hairstyle would you like today?", hint: "I’d like short hair, please." },
    sells: ["hair_Rogue", "hair_Knight", "hair_Mage", "hair_Barbarian"] },
  { id: "supermarket", name: "Shop 24h", type: "convenience store", x: 134, z: -11, w: 12, d: 12, door: "south", exterior: "shop24", layout: "shelves",
    color: 0xebfbee, roof: 0x2f9e44, awning: 0x40c057, floor: 0xf1f3f5, wall: 0xf8f9fa, goods: ["🍎", "🍌", "🥛", "🍙", "💧", "🥕"],
    keeper: { name: "Nam – Cashier", color: 0x40c057, greet: "Hi! Shop 24h is open all day and all night. Can I help you?", hint: "Can I have an apple and some water, please?" },
    sells: ["apple", "banana", "water", "riceball", "milk"] },
  { id: "workshop", name: "Fix-It Workshop", type: "workshop", x: 75, z: -86, w: 10, d: 10, door: "north", model: "building_B", layout: "lab",
    color: 0xf1f3f5, roof: 0x495057, awning: 0xfab005, floor: 0xadb5bd, wall: 0xe9ecef, goods: ["🔧", "🔨", "🪛", "🚲", "⚙️", "🪚"], keeper: null, sells: [] },
  { id: "police", name: "Police Station", type: "police station", x: -62, z: 12, w: 16, d: 12, door: "north", exterior: "police", layout: "desks",
    color: 0xe7f5ff, roof: 0x1864ab, awning: 0x1c7ed6, floor: 0xdee2e6, wall: 0xf1f3f5, goods: ["🚓", "🔦", "📋", "🗺️", "🔑", "🚨"], keeper: null, sells: [] },
  { id: "fire", name: "Fire Station", type: "fire station", x: -78, z: 12, w: 10, d: 10, door: "north", exterior: "fire", layout: "lab",
    color: 0xfff5f5, roof: 0xc92a2a, awning: 0xe03131, floor: 0xadb5bd, wall: 0xfff5f5, goods: ["🚒", "🧯", "🪜", "⛑️", "🚨", "🧑‍🚒"], keeper: null, sells: [] },
  { id: "mall", name: "Verse Plaza", type: "shopping mall", x: 64.5, z: 16, w: 24, d: 20, door: "west",   // quay mặt về quảng trường (phía tây)
    exterior: "mall", layout: "shop",
    color: 0xf1f3f5, roof: 0x748ffc, awning: 0x4c6ef5, floor: 0xf1f3f5, wall: 0xf8f9fa, goods: ["🛍️", "👟", "🎮", "📱", "🧸", "⌚"], keeper: null, sells: [] },
  // Hàng phía nam (cửa nhìn lên Market Street)
  { id: "home", name: "My Home", type: "home", x: -125, z: -14, w: 12, d: 11, door: "south", exterior: "home", layout: "home",
    color: 0xfff4e6, roof: 0xd9480f, awning: 0xfd7e14, floor: 0xd9b38c, wall: 0xfff8f0, keeper: null, sells: [] },
  { id: "cinema", name: "Star Cinema", type: "cinema", x: 86.5, z: 18, w: 20, d: 16, door: "north", exterior: "cinema", layout: "starium", size: { w: 40, d: 56, h: 14 },
    color: 0x343a40, roof: 0x212529, awning: 0xfab005, floor: 0x5c1a1a, wall: 0x3b2f2a, goods: ["🎬", "🍿", "🎟️", "🥤", "🎥", "⭐"],
    keeper: { name: "Jack – Ticket Seller", color: 0xfab005, greet: "Hi! The movie starts at seven. Would you like some popcorn?", hint: "Can I have some popcorn, please?" },
    sells: ["popcorn", "water"] },
  { id: "electronics", name: "Verse Electronics", type: "electronics store", x: 63, z: 43, w: 22, d: 16, door: "west", exterior: "electronics", layout: "electronics", size: { w: 60, d: 72, h: 10 },   // siêu thị điện máy, cạnh Verse Plaza
    color: 0x1c4fa0, roof: 0x1c4fa0, awning: 0xffd43b, floor: 0xf1f3f5, wall: 0xffffff, goods: [], keeper: null, sells: [] },
  { id: "hotel", name: "Verse Hotel", type: "hotel", x: 33, z: 0, w: 18, d: 16, door: "west", exterior: "hotel", layout: "hotel", size: { w: 40, d: 60, h: 10 },   // ngoại thất theo khách sạn Majestic (Q.1)
    color: 0xf8f1df, roof: 0x8a6d3b, awning: 0xc9a227, floor: 0xd9c7a4, wall: 0xf8f1df, goods: [], keeper: null, sells: [] }
];

/* ĐỊA ĐIỂM NGOÀI TRỜI (không có nhà, đi thẳng vào): x, z = tâm khu; keys = từ khóa khi hỏi "Where is …?" */
const SPOTS = [
  { id: "busstop",  name: "Bus Stop",    type: "busstop",  x: 22, z: 72, keys: ["bus"] },
  { id: "market",   name: "Wet Market",  type: "market",   x: 120, z: 6,   keys: ["market", "fruit"] },
  { id: "zoo",      name: "City Zoo",    type: "zoo",      x: 80, z: 80,   keys: ["zoo", "animal"] },
  { id: "farm",     name: "Green Farm",  type: "farm",     x: -80, z: 80,   keys: ["farm", "vegetable"] },
  { id: "stadium",  name: "Stadium",     type: "stadium",  x: 0, z: -110,  keys: ["stadium", "sport", "football"] },
  { id: "power",    name: "Power Plant", type: "power",    x: 75, z: -120,  keys: ["power", "electric"] },
  { id: "park",     name: "Misty Park",  type: "park",     x: 125, z: 82,   keys: ["park", "ghost", "misty"] },
  { id: "lake",     name: "Verse Lake",  type: "lake",     x: 0,   z: 128,  keys: ["lake", "water"] },
  { id: "airfield", name: "Airfield",    type: "airfield", x: 125, z: -125,  keys: ["airfield", "airport", "plane"] }
];

/* ===== QUY HOẠCH THÀNH PHỐ =====
   Thành phố chia 9 khu như bàn cờ 3 × 3, khu hành chính ở giữa (Town Hall + quảng trường đi bộ dài).
   Bắc = phía z âm (trên bản đồ). Đường vành đai: x = ±47, z = ±63.
   ZONES: x0..x1, z0..z1 = phạm vi khu; color = màu nền trên bản đồ. */
const ZONES = [
  { id: "admin",    name: "Civic Center",      vi: "Khu hành chính",        x0: -44, x1: 44,   z0: -60,  z1: 60,   color: "#f1e3c6" },
  { id: "sports",   name: "Sports District",   vi: "Khu thể thao",          x0: -44, x1: 44,   z0: -150, z1: -66,  color: "#c3e6b4" },
  { id: "tech",     name: "Tech Valley",       vi: "Khu công nghệ cao",     x0: -150, x1: -50, z0: -150, z1: -66,  color: "#c5dcf0" },
  { id: "industry", name: "Industrial Park",   vi: "Khu công nghiệp",       x0: 50,  x1: 150,  z0: -150, z1: -66,  color: "#d6d6d6" },
  { id: "living",   name: "Maple Town",        vi: "Khu dân cư & công cộng", x0: -150, x1: -50, z0: -60,  z1: 60,   color: "#e8dcc8" },
  { id: "market",   name: "Market District",   vi: "Khu thương mại, dịch vụ", x0: 50, x1: 150,  z0: -60,  z1: 60,   color: "#f5d9c8" },
  { id: "transit",  name: "Station Square",    vi: "Khu nhà ga, hồ",        x0: -44, x1: 44,   z0: 66,   z1: 150,  color: "#cfe3f1" },
  { id: "arena",    name: "Verse Arena",       vi: "Đảo đấu trường",        x0: -310, x1: -210, z0: -80, z1: 80,   color: "#e9dcc0" },
  { id: "farm",     name: "Green Fields",      vi: "Khu nông nghiệp",       x0: -150, x1: -50, z0: 66,   z1: 150,  color: "#d9ecb0" },
  { id: "nature",   name: "Wild Woods",        vi: "Khu thiên nhiên",       x0: 50,  x1: 150,  z0: 66,   z1: 150,  color: "#b9e0a5" }
];

/* METRO: mỗi khu một trạm nhỏ, đứng gần bấm 🚇 để đi nhanh tới khu khác */
const METRO = [
  { zone: "admin",    name: "City Hall",       x: -9,   z: 46 },
  { zone: "sports",   name: "Stadium",         x: 10,   z: -72 },
  { zone: "tech",     name: "Tech Valley",     x: -94,  z: -74 },
  { zone: "industry", name: "Industrial Park", x: 94,   z: -74 },
  { zone: "living",   name: "Maple Town",      x: -94,  z: 8 },
  { zone: "market",   name: "Market Street",   x: 106,  z: 8 },
  { zone: "transit",  name: "Central Station", x: -14,  z: 72, door: "north" },
  { zone: "arena",    name: "Verse Arena",     x: -224, z: 10, door: "east" },
  { zone: "farm",     name: "Green Fields",    x: -106, z: 70, door: "north" },
  { zone: "nature",   name: "Wild Woods",      x: 106,  z: 70, door: "north" }
];

/* Ô ĐẤT CHỜ XÂY: hiện hàng rào + bảng "Coming soon". big = công trình công cộng lớn (có cần cẩu). door = mặt tiền quay hướng nào */
const LOTS = [
  { name: "Sports Center",    x: 30,   z: -93,  w: 16, d: 14, door: "west",  big: true },
  { name: "Swimming Pool",    x: 32,   z: -126, w: 14, d: 12, door: "west",  big: true },
  { name: "Tech Park",        x: -125, z: -112, w: 20, d: 16, door: "south", big: true },
  { name: "Robotics Lab",     x: -75,  z: -87,  w: 12, d: 12, door: "north" },
  { name: "Space Center",     x: -125, z: -87,  w: 16, d: 12, door: "north", big: true },
  { name: "Factory",          x: 125,  z: -86,  w: 20, d: 16, door: "north", big: true },
  { name: "House",            x: -140, z: -14,  w: 10, d: 10, door: "south" },
  { name: "House",            x: -110, z: -14,  w: 10, d: 10, door: "south" },
  { name: "House",            x: -140, z: 14,   w: 10, d: 10, door: "north" },
  { name: "House",            x: -125, z: 14,   w: 10, d: 10, door: "north" },
  { name: "Clinic",           x: -110, z: 14,   w: 10, d: 10, door: "north" },
  { name: "Bookshop",         x: 145,  z: -10,  w: 9,  d: 10, door: "south" },
  { name: "Toy Store",        x: 145,  z: 11,   w: 9,  d: 10, door: "north" },
  { name: "Pet Shop",         x: 120,  z: -10,  w: 10, d: 10, door: "south" },   // chỗ cũ của Home & Cozy
  { name: "Orchard",          x: -125, z: 80,   w: 20, d: 18, door: "north", big: true },
  { name: "Fish Pond",        x: -80,  z: 125,  w: 18, d: 16, door: "north" },
  { name: "Rice Field",       x: -125, z: 125,  w: 20, d: 18, door: "north" },
  { name: "Botanical Garden", x: 80,   z: 125,  w: 20, d: 18, door: "north", big: true },
  // Đảo đấu trường: các trạm trò chơi đồng đội sẽ làm (mê cung The Maze đã có)
  { name: "Quiz Tower",       x: -240, z: -52, w: 16, d: 14, door: "east",  big: true },
  { name: "Word Race",        x: -240, z: 52,  w: 16, d: 14, door: "east",  big: true },
  { name: "Treasure Hunt",    x: -290, z: -55, w: 18, d: 14, door: "south", big: true },
  { name: "Team Battle",      x: -290, z: 55,  w: 18, d: 14, door: "north", big: true },
  { name: "Bus Terminal",     x: 34,   z: 84,   w: 14, d: 10, door: "north" }
];

/* NPC ĐI TUẦN / TRỰC GÁC (không nói chuyện được, chỉ chào khi mình đi ngang)
   path = các điểm đi qua lại (1 điểm = đứng gác tại chỗ); look = bộ nhân vật; say = câu chào */
const AMBIENT = [
  { name: "Officer Duc – Police Officer",  color: 0x1864ab, look: "Knight",    path: [[-70, 1.6], [-54, 1.6]],  say: "Hello! Stay safe!" },
  { name: "Officer Vy – Police Officer",   color: 0x1864ab, look: "Rogue",     path: [[-66.4, 3.2]],            say: "Good morning! Can I help you?" },
  { name: "Officer Long – Police Officer", color: 0x1864ab, look: "Barbarian", path: [[-57.6, 3.2]],            say: "Please walk on the sidewalk." },
  { name: "Tuan – Firefighter",            color: 0xc92a2a, look: "Knight",    path: [[-84, 4.4], [-79.5, 4.4]], say: "Fire safety first!" },
  { name: "Mai – Firefighter",             color: 0xc92a2a, look: "Mage",      path: [[-72.6, 2.5], [-72.6, 8]], say: "Our fire truck is ready!" },
  { name: "Guard Nam – Arena Guard",       color: 0xb02a2a, look: "Knight",    path: [[-206, -10.5]],           say: "Welcome to Verse Arena!" },
  { name: "Guard Thu – Arena Guard",       color: 0xb02a2a, look: "Knight",    path: [[-206, 10.5]],            say: "Find a team and play together!" }
];

/* THẺ TỪ VỰNG 📦: đồ trưng bày trong từng nơi (theo id trong CITY). Giữ nút 🎤 và hỏi "What is this?" → nhận thẻ.
   w = từ, pic = hình, pos = loại từ, say = câu NPC trả lời, ex = câu ví dụ ngắn, tự nhiên (tính từ / trạng từ chỉ thêm khi hợp lý)
   kind = nhóm đồ: từ Lv.20 người chơi hỏi rõ hơn "What is this drink / food / tool / machine / plant / furniture / thing?"
   at = đồ bày ở khu nào trong nơi đó (đúng ngữ cảnh) – xem anchors trong index.html */
const VOCAB = {
  cafe: [
    // quầy pha chế
    { w: "espresso machine", pic: "☕", pos: "noun", kind: "machine", at: "bar", say: "It's an espresso machine.", ex: "The espresso machine makes coffee." },
    { w: "coffee grinder",   pic: "⚙️", pos: "noun", kind: "machine", at: "bar", say: "It's a coffee grinder.",    ex: "The coffee grinder is noisy." },
    { w: "phin filter",      pic: "⏳", pos: "noun", kind: "tool",    at: "bar", say: "It's a phin filter.",       ex: "Vietnamese coffee drips slowly from a phin filter." },
    { w: "coffee beans",     pic: "🫘", pos: "noun", kind: "food",    at: "bar", say: "They're coffee beans.",     ex: "These coffee beans smell good." },
    { w: "cup",              pic: "🍵", pos: "noun", kind: "thing",   at: "bar", say: "It's a cup.",               ex: "A cup of hot tea, please." },
    { w: "mug",              pic: "☕", pos: "noun", kind: "thing",   at: "bar", say: "It's a mug.",               ex: "I drink coffee from a big mug." },
    { w: "milk jug",         pic: "🥛", pos: "noun", kind: "thing",   at: "bar", say: "It's a milk jug.",          ex: "The milk jug is full." },
    { w: "kettle",           pic: "🫖", pos: "noun", kind: "machine", at: "bar", say: "It's a kettle.",            ex: "The water in the kettle is hot." },
    { w: "ice cubes",        pic: "🧊", pos: "noun", kind: "thing",   at: "bar", say: "They're ice cubes.",        ex: "Can I have some ice cubes?" },
    { w: "straw",            pic: "🥤", pos: "noun", kind: "thing",   at: "bar", say: "It's a straw.",             ex: "Can I have a straw, please?" },
    { w: "spoon",            pic: "🥄", pos: "noun", kind: "tool",    at: "bar", say: "It's a spoon.",             ex: "Stir your coffee with a spoon." },
    { w: "tray",             pic: "🍽️", pos: "noun", kind: "thing",   at: "bar", say: "It's a tray.",              ex: "The waiter carries a tray." },
    { w: "napkin",           pic: "🧻", pos: "noun", kind: "thing",   at: "bar", say: "It's a napkin.",            ex: "Here is a napkin for you." },
    { w: "milk tea",         pic: "🧋", pos: "noun", kind: "drink",   at: "bar", say: "It's milk tea.",            ex: "Milk tea is popular in Vietnam." },
    // tủ bánh
    { w: "croissant",        pic: "🥐", pos: "noun", kind: "food",    at: "cake", say: "It's a croissant.",        ex: "I'd like a warm croissant." },
    { w: "cake",             pic: "🍰", pos: "noun", kind: "food",    at: "cake", say: "It's a piece of cake.",    ex: "This cake is soft and sweet." },
    { w: "cupcake",          pic: "🧁", pos: "noun", kind: "food",    at: "cake", say: "It's a cupcake.",          ex: "I love pink cupcakes." },
    { w: "cookie",           pic: "🍪", pos: "noun", kind: "food",    at: "cake", say: "It's a cookie.",           ex: "Can I have a cookie, please?" },
    { w: "doughnut",         pic: "🍩", pos: "noun", kind: "food",    at: "cake", say: "It's a doughnut.",         ex: "The doughnut has sugar on top." },
    // quầy tính tiền
    { w: "cash register",    pic: "🖥️", pos: "noun", kind: "machine", at: "cashier", say: "It's a cash register.", ex: "The money is in the cash register." },
    { w: "card machine",     pic: "💳", pos: "noun", kind: "machine", at: "cashier", say: "It's a card machine.",  ex: "You can pay with the card machine." },
    { w: "receipt",          pic: "🧾", pos: "noun", kind: "thing",   at: "cashier", say: "It's a receipt.",       ex: "Here is your receipt." },
    { w: "tip jar",          pic: "🫙", pos: "noun", kind: "thing",   at: "cashier", say: "It's a tip jar.",       ex: "Put some coins in the tip jar." },
    { w: "menu",             pic: "📋", pos: "noun", kind: "thing",   at: "cashier", say: "It's the menu.",        ex: "Can I see the menu, please?" },
    // kệ tường sau
    { w: "condensed milk",   pic: "🥫", pos: "noun", kind: "food",    at: "shelf", say: "It's condensed milk.",    ex: "Condensed milk is very sweet." },
    { w: "honey",            pic: "🍯", pos: "noun", kind: "food",    at: "shelf", say: "It's honey.",             ex: "I put honey in my tea." },
    { w: "sugar",            pic: "🧂", pos: "noun", kind: "food",    at: "shelf", say: "It's sugar.",             ex: "No sugar, please." },
    { w: "tea leaves",       pic: "🍃", pos: "noun", kind: "food",    at: "shelf", say: "They're tea leaves.",     ex: "We make green tea with tea leaves." },
    { w: "bottle",           pic: "🍾", pos: "noun", kind: "thing",   at: "shelf", say: "It's a bottle.",          ex: "There is juice in the bottle." },
    { w: "glass",            pic: "🥛", pos: "noun", kind: "thing",   at: "shelf", say: "It's a glass.",           ex: "Can I have a glass of water?" },
    { w: "coffee bag",       pic: "🛍️", pos: "noun", kind: "thing",   at: "shelf", say: "It's a bag of coffee.",   ex: "This bag of coffee is heavy." },
    // quầy gỗ cạnh cửa kính
    { w: "stool",            pic: "🪑", pos: "noun", kind: "furniture", at: "window", say: "It's a stool.",        ex: "Sit on the stool by the window." },
    { w: "laptop",           pic: "💻", pos: "noun", kind: "machine", at: "window", say: "It's a laptop.",         ex: "He works on his laptop." },
    { w: "notebook",         pic: "📓", pos: "noun", kind: "thing",   at: "window", say: "It's a notebook.",       ex: "I write new words in my notebook." },
    { w: "headphones",       pic: "🎧", pos: "noun", kind: "thing",   at: "window", say: "They're headphones.",    ex: "She listens to music with headphones." },
    { w: "phone charger",    pic: "🔌", pos: "noun", kind: "thing",   at: "window", say: "It's a phone charger.",  ex: "Can I borrow your phone charger?" },
    { w: "wifi password",    pic: "📶", pos: "noun", kind: "thing",   at: "window", say: "It's the wifi password.", ex: "What's the wifi password?" },
    // góc sofa
    { w: "sofa",             pic: "🛋️", pos: "noun", kind: "furniture", at: "sofa", say: "It's a sofa.",           ex: "This sofa is very comfortable." },
    { w: "cushion",          pic: "🟧", pos: "noun", kind: "thing",   at: "sofa", say: "It's a cushion.",          ex: "The cushion is soft." },
    { w: "board game",       pic: "🎲", pos: "noun", kind: "thing",   at: "sofa", say: "It's a board game.",       ex: "Let's play a board game!" },
    { w: "newspaper",        pic: "📰", pos: "noun", kind: "thing",   at: "sofa", say: "It's a newspaper.",        ex: "My grandpa reads the newspaper." },
    { w: "book",             pic: "📖", pos: "noun", kind: "thing",   at: "sofa", say: "It's a book.",             ex: "This book is interesting." },
    { w: "candle",           pic: "🕯️", pos: "noun", kind: "thing",   at: "sofa", say: "It's a candle.",           ex: "There is a candle on the table." },
    // góc cây
    { w: "succulent",        pic: "🌵", pos: "noun", kind: "plant",   at: "plants", say: "It's a succulent.",      ex: "A succulent needs very little water." },
    { w: "terrarium",        pic: "🫙", pos: "noun", kind: "plant",   at: "plants", say: "It's a terrarium.",      ex: "There is a tiny garden in the terrarium." },
    { w: "potted plant",     pic: "🪴", pos: "noun", kind: "plant",   at: "plants", say: "It's a potted plant.",   ex: "Water the potted plant every week." },
    { w: "watering can",     pic: "🚿", pos: "noun", kind: "tool",    at: "plants", say: "It's a watering can.",   ex: "Fill the watering can with water." },
    { w: "seeds",            pic: "🌱", pos: "noun", kind: "plant",   at: "plants", say: "They're seeds.",         ex: "Plant the seeds in the soil." },
    { w: "flower",           pic: "🌸", pos: "noun", kind: "plant",   at: "plants", say: "It's a flower.",         ex: "What a beautiful flower!" },
    { w: "price tag",        pic: "🏷️", pos: "noun", kind: "thing",   at: "plants", say: "It's a price tag.",      ex: "Look at the price tag." },
    // trần
    { w: "light bulb",       pic: "💡", pos: "noun", kind: "thing",   at: "ceiling", say: "It's a light bulb.",    ex: "The light bulbs are bright." },
    { w: "hanging plant",    pic: "🌿", pos: "noun", kind: "plant",   at: "ceiling", say: "It's a hanging plant.", ex: "The hanging plants are green." },
    { w: "glass roof",       pic: "🪟", pos: "noun", kind: "thing",   at: "ceiling", say: "It's a glass roof.",    ex: "I can see the sky through the glass roof." },
    // lối vào
    { w: "air conditioner",  pic: "❄️", pos: "noun", kind: "machine", at: "door", say: "It's an air conditioner.", ex: "The air conditioner keeps the room cool." },
    { w: "umbrella",         pic: "☂️", pos: "noun", kind: "thing",   at: "door", say: "It's an umbrella.",        ex: "Take an umbrella. It's raining." },
    { w: "doormat",          pic: "🟫", pos: "noun", kind: "thing",   at: "door", say: "It's a doormat.",          ex: "Wipe your shoes on the doormat." },
    { w: "trash can",        pic: "🗑️", pos: "noun", kind: "thing",   at: "door", say: "It's a trash can.",        ex: "Put your cup in the trash can." },
    { w: "open sign",        pic: "🪧", pos: "noun", kind: "thing",   at: "door", say: "It's an open sign.",       ex: "The sign says the café is open." }
  ],
  post: [
    // quầy giao dịch (2 bên)
    { w: "stamp",            pic: "📮", pos: "noun", kind: "thing",   at: "counter", say: "It's a stamp.",         ex: "I need a stamp for this letter." },
    { w: "envelope",         pic: "✉️", pos: "noun", kind: "thing",   at: "counter", say: "It's an envelope.",     ex: "Put the letter in the envelope." },
    { w: "letter",           pic: "💌", pos: "noun", kind: "thing",   at: "counter", say: "It's a letter.",        ex: "I'm writing a letter to my grandma." },
    { w: "parcel",           pic: "📦", pos: "noun", kind: "thing",   at: "counter", say: "It's a parcel.",        ex: "This parcel is heavy." },
    { w: "scale",            pic: "⚖️", pos: "noun", kind: "machine", at: "counter", say: "It's a scale.",         ex: "Put the parcel on the scale." },
    { w: "form",             pic: "📝", pos: "noun", kind: "thing",   at: "counter", say: "It's a form.",          ex: "Please fill in this form." },
    { w: "pen",              pic: "🖊️", pos: "noun", kind: "tool",    at: "counter", say: "It's a pen.",           ex: "Can I borrow a pen?" },
    { w: "tape",             pic: "🩹", pos: "noun", kind: "tool",    at: "counter", say: "It's tape.",            ex: "Close the box with tape." },
    { w: "scissors",         pic: "✂️", pos: "noun", kind: "tool",    at: "counter", say: "They're scissors.",     ex: "Cut the paper with scissors." },
    { w: "rubber stamp",     pic: "🔖", pos: "noun", kind: "tool",    at: "counter", say: "It's a rubber stamp.",  ex: "The clerk uses a rubber stamp." },
    { w: "glue",             pic: "🧴", pos: "noun", kind: "thing",   at: "counter", say: "It's glue.",            ex: "Use glue to stick the stamp." },
    { w: "address label",    pic: "🏷️", pos: "noun", kind: "thing",   at: "counter", say: "It's an address label.", ex: "Write the address on the label." },
    { w: "cardboard box",    pic: "📦", pos: "noun", kind: "thing",   at: "counter", say: "It's a cardboard box.", ex: "I need a big cardboard box." },
    { w: "queue ticket",     pic: "🎫", pos: "noun", kind: "thing",   at: "counter", say: "It's a queue ticket.",  ex: "Take a queue ticket and wait." },
    // quầy lưu niệm giữa sảnh
    { w: "postcard",         pic: "🏞️", pos: "noun", kind: "thing",   at: "kiosk", say: "It's a postcard.",        ex: "I'm sending a postcard to my friend." },
    { w: "souvenir",         pic: "🎁", pos: "noun", kind: "thing",   at: "kiosk", say: "It's a souvenir.",        ex: "I bought a souvenir for my mom." },
    { w: "keychain",         pic: "🔑", pos: "noun", kind: "thing",   at: "kiosk", say: "It's a keychain.",        ex: "This keychain is cute." },
    { w: "fridge magnet",    pic: "🧲", pos: "noun", kind: "thing",   at: "kiosk", say: "It's a fridge magnet.",   ex: "I collect fridge magnets." },
    { w: "conical hat",      pic: "👒", pos: "noun", kind: "thing",   at: "kiosk", say: "It's a conical hat.",     ex: "A conical hat is called nón lá in Vietnam." },
    { w: "calendar",         pic: "📅", pos: "noun", kind: "thing",   at: "kiosk", say: "It's a calendar.",        ex: "Look at the calendar. Today is Monday." },
    // ghế chờ
    { w: "bench",            pic: "🪑", pos: "noun", kind: "furniture", at: "bench", say: "It's a bench.",         ex: "Let's sit on the bench and wait." },
    { w: "newspaper",        pic: "📰", pos: "noun", kind: "thing",   at: "bench", say: "It's a newspaper.",       ex: "He reads the newspaper." },
    { w: "backpack",         pic: "🎒", pos: "noun", kind: "thing",   at: "bench", say: "It's a backpack.",        ex: "My backpack is on the bench." },
    { w: "potted plant",     pic: "🪴", pos: "noun", kind: "plant",   at: "bench", say: "It's a potted plant.",    ex: "There is a big plant next to the bench." },
    // tường cuối sảnh
    { w: "clock",            pic: "🕰️", pos: "noun", kind: "thing",   at: "wall", say: "It's a clock.",            ex: "The clock says ten o'clock." },
    { w: "map",              pic: "🗺️", pos: "noun", kind: "thing",   at: "wall", say: "It's a map.",              ex: "Look at the old map of the city." },
    { w: "world map",        pic: "🌏", pos: "noun", kind: "thing",   at: "wall", say: "It's a world map.",        ex: "Find Vietnam on the world map." },
    // buồng điện thoại
    { w: "phone booth",      pic: "☎️", pos: "noun", kind: "furniture", at: "booth", say: "It's a phone booth.",   ex: "You can call from the phone booth." },
    { w: "telephone",        pic: "📞", pos: "noun", kind: "machine", at: "booth", say: "It's a telephone.",       ex: "The old telephone still works." },
    { w: "phone card",       pic: "💳", pos: "noun", kind: "thing",   at: "booth", say: "It's a phone card.",      ex: "Buy a phone card to make a call." },
    // bàn viết thư
    { w: "desk",             pic: "🗄️", pos: "noun", kind: "furniture", at: "desk", say: "It's a desk.",           ex: "The letter writer sits at his desk." },
    { w: "magnifying glass", pic: "🔍", pos: "noun", kind: "tool",    at: "desk", say: "It's a magnifying glass.", ex: "Use a magnifying glass to read small words." },
    { w: "ink",              pic: "🖋️", pos: "noun", kind: "thing",   at: "desk", say: "It's ink.",                ex: "He writes with blue ink." },
    { w: "dictionary",       pic: "📕", pos: "noun", kind: "thing",   at: "desk", say: "It's a dictionary.",       ex: "Look up the word in the dictionary." },
    { w: "glasses",          pic: "👓", pos: "noun", kind: "thing",   at: "desk", say: "They're glasses.",         ex: "Grandpa wears glasses to read." },
    // lối vào, trần
    { w: "mailbox",          pic: "📫", pos: "noun", kind: "thing",   at: "door", say: "It's a mailbox.",          ex: "Put your letter in the mailbox." },
    { w: "ATM",              pic: "🏧", pos: "noun", kind: "machine", at: "door", say: "It's an ATM.",             ex: "I take money from the ATM." },
    { w: "fan",              pic: "🪭", pos: "noun", kind: "machine", at: "ceiling", say: "It's a fan.",           ex: "The fan keeps us cool." },
    { w: "lamp",             pic: "💡", pos: "noun", kind: "thing",   at: "ceiling", say: "It's a lamp.",          ex: "The lamps hang from the ceiling." },
    { w: "arch",             pic: "🌉", pos: "noun", kind: "thing",   at: "ceiling", say: "It's an arch.",         ex: "The green arches are very old." }
  ],
  library: [
    // quầy thủ thư (giữa phòng)
    { w: "library card",     pic: "🪪", pos: "noun", kind: "thing",     at: "desk", say: "It's a library card.",   ex: "Show your library card, please." },
    { w: "stamp pad",        pic: "🟦", pos: "noun", kind: "tool",      at: "desk", say: "It's a stamp pad.",      ex: "She uses the stamp pad every day." },
    { w: "computer",         pic: "🖥️", pos: "noun", kind: "machine",   at: "desk", say: "It's a computer.",       ex: "Search for books on the computer." },
    { w: "scanner",          pic: "📠", pos: "noun", kind: "machine",   at: "desk", say: "It's a scanner.",        ex: "The scanner reads the barcode." },
    { w: "bell",             pic: "🛎️", pos: "noun", kind: "thing",     at: "desk", say: "It's a bell.",           ex: "Ring the bell for help." },
    { w: "return box",       pic: "📥", pos: "noun", kind: "thing",     at: "desk", say: "It's a return box.",     ex: "Put old books in the return box." },
    // bàn đọc
    { w: "desk lamp",        pic: "💡", pos: "noun", kind: "thing",     at: "table", say: "It's a desk lamp.",     ex: "Turn on the desk lamp." },
    { w: "sticky note",      pic: "🗒️", pos: "noun", kind: "thing",     at: "table", say: "It's a sticky note.",   ex: "Write the page number on a sticky note." },
    { w: "pencil",           pic: "✏️", pos: "noun", kind: "tool",      at: "table", say: "It's a pencil.",        ex: "Can I borrow your pencil?" },
    { w: "eraser",           pic: "🧽", pos: "noun", kind: "tool",      at: "table", say: "It's an eraser.",       ex: "I need an eraser." },
    { w: "ruler",            pic: "📏", pos: "noun", kind: "tool",      at: "table", say: "It's a ruler.",          ex: "Draw a line with a ruler." },
    { w: "bookmark",         pic: "🔖", pos: "noun", kind: "thing",     at: "table", say: "It's a bookmark.",      ex: "Put a bookmark in your book." },
    { w: "storybook",        pic: "📖", pos: "noun", kind: "thing",     at: "table", say: "It's a storybook.",     ex: "This storybook is about a brave cat." },
    { w: "bookend",          pic: "🧱", pos: "noun", kind: "thing",     at: "table", say: "It's a bookend.",       ex: "The bookend holds the books up." },
    // kệ sách sát tường
    { w: "bookshelf",        pic: "📚", pos: "noun", kind: "furniture", at: "shelf", say: "It's a bookshelf.",     ex: "The bookshelf is full of books." },
    { w: "novel",            pic: "📗", pos: "noun", kind: "thing",     at: "shelf", say: "It's a novel.",         ex: "This novel is very exciting." },
    { w: "comic book",       pic: "💥", pos: "noun", kind: "thing",     at: "shelf", say: "It's a comic book.",    ex: "Kids love comic books." },
    { w: "encyclopedia",     pic: "📘", pos: "noun", kind: "thing",     at: "shelf", say: "It's an encyclopedia.", ex: "The encyclopedia has many facts." },
    { w: "atlas",            pic: "🗺️", pos: "noun", kind: "thing",     at: "shelf", say: "It's an atlas.",        ex: "Find Vietnam in the atlas." },
    { w: "magazine",         pic: "📰", pos: "noun", kind: "thing",     at: "shelf", say: "It's a magazine.",      ex: "I read a science magazine." },
    { w: "cookbook",         pic: "🍳", pos: "noun", kind: "thing",     at: "shelf", say: "It's a cookbook.",      ex: "Mom found a recipe in the cookbook." },
    { w: "picture book",     pic: "🖼️", pos: "noun", kind: "thing",     at: "shelf", say: "It's a picture book.",  ex: "My little sister likes picture books." },
    { w: "ladder",           pic: "🪜", pos: "noun", kind: "tool",      at: "shelf", say: "It's a ladder.",        ex: "Use the ladder for the top shelf." },
    { w: "globe",            pic: "🌍", pos: "noun", kind: "thing",     at: "shelf", say: "It's a globe.",         ex: "Spin the globe and find Japan." },
    // ban công tầng trên
    { w: "railing",          pic: "🚧", pos: "noun", kind: "thing",     at: "gallery", say: "It's a railing.",     ex: "Hold the railing on the stairs." },
    { w: "old book",         pic: "📜", pos: "noun", kind: "thing",     at: "gallery", say: "It's an old book.",   ex: "This old book is 200 years old." },
    { w: "statue",           pic: "🗿", pos: "noun", kind: "thing",     at: "gallery", say: "It's a statue.",      ex: "There is a statue of a writer." },
    { w: "poster",           pic: "🪧", pos: "noun", kind: "thing",     at: "gallery", say: "It's a poster.",      ex: "The poster says “Quiet, please”." },
    // trần, cửa
    { w: "dome",             pic: "⛪", pos: "noun", kind: "thing",     at: "ceiling", say: "It's a dome.",        ex: "The library has a big dome." },
    { w: "skylight",         pic: "🪟", pos: "noun", kind: "thing",     at: "ceiling", say: "It's a skylight.",    ex: "Light comes in through the skylight." },
    { w: "quiet sign",       pic: "🤫", pos: "noun", kind: "thing",     at: "door", say: "It's a quiet sign.",     ex: "The sign says: Be quiet!" },
    { w: "locker",           pic: "🔐", pos: "noun", kind: "furniture", at: "door", say: "It's a locker.",         ex: "Leave your bag in the locker." }
  ],
  bank: [
    // quầy giao dịch
    { w: "cash",             pic: "💵", pos: "noun", kind: "thing",     at: "counter", say: "It's cash.",           ex: "Do you pay by cash or card?" },
    { w: "coin",             pic: "🪙", pos: "noun", kind: "thing",     at: "counter", say: "It's a coin.",         ex: "I have three coins." },
    { w: "bank statement",   pic: "🧾", pos: "noun", kind: "thing",     at: "counter", say: "It's a bank statement.", ex: "My bank statement shows my money." },
    { w: "passbook",         pic: "📒", pos: "noun", kind: "thing",     at: "counter", say: "It's a passbook.",      ex: "Grandma keeps her passbook safe." },
    { w: "calculator",       pic: "🧮", pos: "noun", kind: "machine",   at: "counter", say: "It's a calculator.",   ex: "She adds the numbers on a calculator." },
    { w: "money counter",    pic: "🎰", pos: "noun", kind: "machine",   at: "counter", say: "It's a money counter.", ex: "The money counter is very fast." },
    { w: "card reader",      pic: "📟", pos: "noun", kind: "machine",   at: "counter", say: "It's a card reader.",  ex: "Put your card in the card reader." },
    { w: "deposit slip",     pic: "📝", pos: "noun", kind: "thing",     at: "counter", say: "It's a deposit slip.",  ex: "Fill in a deposit slip, please." },
    { w: "signature",        pic: "✍️", pos: "noun", kind: "thing",     at: "counter", say: "It's a signature.",    ex: "Write your signature here." },
    // tủ trưng bày tiền xưa (2 bên)
    { w: "banknote",         pic: "💴", pos: "noun", kind: "thing",     at: "display", say: "It's a banknote.",     ex: "This banknote is very old." },
    { w: "gold bar",         pic: "🥇", pos: "noun", kind: "thing",     at: "display", say: "It's a gold bar.",     ex: "A gold bar is very heavy." },
    { w: "piggy bank",       pic: "🐷", pos: "noun", kind: "thing",     at: "display", say: "It's a piggy bank.",   ex: "I put coins in my piggy bank." },
    { w: "wallet",           pic: "👛", pos: "noun", kind: "thing",     at: "display", say: "It's a wallet.",       ex: "My wallet is in my bag." },
    { w: "credit card",      pic: "💳", pos: "noun", kind: "thing",     at: "display", say: "It's a credit card.",  ex: "Can I pay by credit card?" },
    { w: "cheque",           pic: "🗒️", pos: "noun", kind: "thing",     at: "display", say: "It's a cheque.",       ex: "People used cheques in the past." },
    { w: "dollar",           pic: "💲", pos: "noun", kind: "thing",     at: "display", say: "It's a dollar.",       ex: "I want to change dollars to dong." },
    { w: "treasure chest",   pic: "💰", pos: "noun", kind: "thing",     at: "display", say: "It's a treasure chest.", ex: "The treasure chest is full of gold." },
    // khu chờ, ATM
    { w: "brochure",         pic: "📄", pos: "noun", kind: "thing",     at: "waiting", say: "It's a brochure.",     ex: "Take a brochure about saving money." },
    { w: "screen",           pic: "📺", pos: "noun", kind: "machine",   at: "waiting", say: "It's a screen.",       ex: "Look at the number on the screen." },
    { w: "water dispenser",  pic: "🚰", pos: "noun", kind: "machine",   at: "waiting", say: "It's a water dispenser.", ex: "Get a cup from the water dispenser." },
    { w: "plant",            pic: "🪴", pos: "noun", kind: "plant",     at: "waiting", say: "It's a plant.",        ex: "Water the plant every week." },
    { w: "ATM",              pic: "🏧", pos: "noun", kind: "machine",   at: "atm", say: "It's an ATM.",             ex: "I get money from the ATM." },
    { w: "bank card",        pic: "💳", pos: "noun", kind: "thing",     at: "atm", say: "It's a bank card.",        ex: "Insert your bank card." },
    { w: "keypad",           pic: "🔢", pos: "noun", kind: "thing",     at: "atm", say: "It's a keypad.",           ex: "Type your PIN on the keypad." },
    // phòng két, trần, cửa
    { w: "safe",             pic: "🗄️", pos: "noun", kind: "thing",     at: "vault", say: "It's a safe.",           ex: "The money is in the safe." },
    { w: "key",              pic: "🔑", pos: "noun", kind: "thing",     at: "vault", say: "It's a key.",            ex: "Don't lose your key." },
    { w: "lock",             pic: "🔒", pos: "noun", kind: "thing",     at: "vault", say: "It's a lock.",           ex: "The door has a big lock." },
    { w: "security camera",  pic: "📹", pos: "noun", kind: "machine",   at: "ceiling", say: "It's a security camera.", ex: "The security camera is always on." },
    { w: "glass ceiling",    pic: "🪟", pos: "noun", kind: "thing",     at: "ceiling", say: "It's a glass ceiling.", ex: "The glass ceiling is orange and yellow." },
    { w: "column",           pic: "🏛️", pos: "noun", kind: "thing",     at: "wall", say: "It's a column.",          ex: "The column is made of stone." },
    { w: "logo",             pic: "🟢", pos: "noun", kind: "thing",     at: "wall", say: "It's the bank's logo.",   ex: "The bank's logo is green." },
    { w: "exchange rate",    pic: "💱", pos: "noun", kind: "thing",     at: "wall", say: "It's an exchange rate board.", ex: "Check the exchange rate first." },
    { w: "security gate",    pic: "🚪", pos: "noun", kind: "thing",     at: "door", say: "It's a security gate.",   ex: "Walk through the security gate." },
    { w: "rope barrier",     pic: "🪢", pos: "noun", kind: "thing",     at: "door", say: "It's a rope barrier.",    ex: "Please wait behind the rope barrier." }
  ],
  museum: [
    // sảnh chính
    { w: "ticket", pic: "🎟️", pos: "noun", kind: "thing", at: "lobby", say: "It's a ticket.", ex: "One ticket for the museum, please." },
    { w: "museum map", pic: "🗺️", pos: "noun", kind: "thing", at: "lobby", say: "It's a museum map.", ex: "Look at the museum map to find the dinosaurs." },
    { w: "audio guide", pic: "🎧", pos: "noun", kind: "machine", at: "lobby", say: "It's an audio guide.", ex: "The audio guide tells you about each room." },
    { w: "donation box", pic: "🗳️", pos: "noun", kind: "thing", at: "lobby", say: "It's a donation box.", ex: "Put a coin in the donation box." },
    { w: "keyring", pic: "🔑", pos: "noun", kind: "thing", at: "shop", say: "It's a keyring.", ex: "I bought a dinosaur keyring." },
    { w: "toy dinosaur", pic: "🦖", pos: "noun", kind: "thing", at: "shop", say: "It's a toy dinosaur.", ex: "My brother loves his toy dinosaur." },
    { w: "snow globe", pic: "🔮", pos: "noun", kind: "thing", at: "shop", say: "It's a snow globe.", ex: "Shake the snow globe!" },
    { w: "tote bag", pic: "👜", pos: "noun", kind: "thing", at: "shop", say: "It's a tote bag.", ex: "Put your books in the tote bag." },
    // khu khủng long
    { w: "skeleton", pic: "💀", pos: "noun", kind: "thing", at: "dino", say: "It's a skeleton.", ex: "This skeleton is very big." },
    { w: "T. rex", pic: "🦖", pos: "noun", kind: "thing", at: "dino", say: "It's a T. rex.", ex: "The T. rex had very big teeth." },
    { w: "long-necked dinosaur", pic: "🦕", pos: "noun", kind: "thing", at: "dino", say: "It's a long-necked dinosaur.", ex: "The long-necked dinosaur ate leaves." },
    { w: "skull", pic: "🦴", pos: "noun", kind: "thing", at: "dino", say: "It's a skull.", ex: "This skull has three horns." },
    { w: "claw", pic: "🦅", pos: "noun", kind: "thing", at: "dino", say: "It's a claw.", ex: "The dinosaur had sharp claws." },
    { w: "tooth", pic: "🦷", pos: "noun", kind: "thing", at: "dino", say: "It's a tooth.", ex: "This tooth is as long as my hand." },
    { w: "fossil", pic: "🪨", pos: "noun", kind: "thing", at: "fossil", say: "It's a fossil.", ex: "Fossils are millions of years old." },
    { w: "dinosaur egg", pic: "🥚", pos: "noun", kind: "thing", at: "fossil", say: "It's a dinosaur egg.", ex: "The dinosaur egg is very old." },
    { w: "nest", pic: "🪺", pos: "noun", kind: "thing", at: "fossil", say: "It's a nest.", ex: "There are four eggs in the nest." },
    { w: "footprint", pic: "👣", pos: "noun", kind: "thing", at: "fossil", say: "It's a footprint.", ex: "Look at this huge footprint!" },
    { w: "amber", pic: "🟠", pos: "noun", kind: "thing", at: "fossil", say: "It's amber.", ex: "There is a tiny insect in the amber." },
    { w: "ammonite", pic: "🐚", pos: "noun", kind: "thing", at: "fossil", say: "It's an ammonite.", ex: "An ammonite is a sea animal fossil." },
    { w: "meteorite", pic: "☄️", pos: "noun", kind: "thing", at: "fossil", say: "It's a meteorite.", ex: "A meteorite is a rock from space." },
    { w: "brush", pic: "🖌️", pos: "noun", kind: "tool", at: "fossil", say: "It's a brush.", ex: "Scientists clean fossils with a brush." },
    // khu điêu khắc, cổ vật
    { w: "sculpture", pic: "🗿", pos: "noun", kind: "thing", at: "statue", say: "It's a sculpture.", ex: "This sculpture shows a man with his arm up." },
    { w: "marble", pic: "🤍", pos: "noun", kind: "thing", at: "statue", say: "It's marble.", ex: "This statue is made of marble." },
    { w: "horse statue", pic: "🐎", pos: "noun", kind: "thing", at: "statue", say: "It's a horse statue.", ex: "The horse statue looks strong." },
    { w: "lion statue", pic: "🦁", pos: "noun", kind: "thing", at: "statue", say: "It's a lion statue.", ex: "A lion statue guards the door." },
    { w: "bust", pic: "👤", pos: "noun", kind: "thing", at: "statue", say: "It's a bust.", ex: "A bust shows only the head and shoulders." },
    { w: "pedestal", pic: "🏛️", pos: "noun", kind: "thing", at: "statue", say: "It's a pedestal.", ex: "The statue stands on a pedestal." },
    { w: "tree", pic: "🌳", pos: "noun", kind: "plant", at: "statue", say: "It's a tree.", ex: "There are two trees in the courtyard." },
    { w: "vase", pic: "🏺", pos: "noun", kind: "thing", at: "antique", say: "It's a vase.", ex: "This vase is 2,000 years old." },
    { w: "bronze drum", pic: "🥁", pos: "noun", kind: "thing", at: "antique", say: "It's a bronze drum.", ex: "The Dong Son bronze drum is from Vietnam." },
    { w: "sword", pic: "🗡️", pos: "noun", kind: "thing", at: "antique", say: "It's a sword.", ex: "The king had a golden sword." },
    { w: "shield", pic: "🛡️", pos: "noun", kind: "thing", at: "antique", say: "It's a shield.", ex: "Soldiers used a shield." },
    { w: "crown", pic: "👑", pos: "noun", kind: "thing", at: "antique", say: "It's a crown.", ex: "The queen wore a crown." },
    { w: "suit of armour", pic: "🤺", pos: "noun", kind: "thing", at: "antique", say: "It's a suit of armour.", ex: "Knights wore a suit of armour." },
    { w: "golden mask", pic: "🎭", pos: "noun", kind: "thing", at: "antique", say: "It's a golden mask.", ex: "The golden mask is shiny." },
    { w: "clay pot", pic: "🫙", pos: "noun", kind: "thing", at: "antique", say: "It's a clay pot.", ex: "People cooked rice in a clay pot." },
    // khu tranh
    { w: "painting", pic: "🖼️", pos: "noun", kind: "thing", at: "painting", say: "It's a painting.", ex: "I like this painting of the sea." },
    { w: "frame", pic: "🟨", pos: "noun", kind: "thing", at: "painting", say: "It's a frame.", ex: "The painting has a gold frame." },
    { w: "portrait", pic: "👩", pos: "noun", kind: "thing", at: "painting", say: "It's a portrait.", ex: "A portrait is a painting of a person." },
    { w: "landscape", pic: "🏞️", pos: "noun", kind: "thing", at: "painting", say: "It's a landscape.", ex: "This landscape shows rice fields." },
    { w: "still life", pic: "🌻", pos: "noun", kind: "thing", at: "painting", say: "It's a still life.", ex: "A still life shows flowers or fruit." },
    { w: "night sky", pic: "🌌", pos: "noun", kind: "thing", at: "painting", say: "It's a night sky.", ex: "Van Gogh painted the night sky." },
    { w: "masterpiece", pic: "⭐", pos: "noun", kind: "thing", at: "painting", say: "It's a masterpiece.", ex: "The Mona Lisa is a masterpiece." },
    { w: "label", pic: "🏷️", pos: "noun", kind: "thing", at: "painting", say: "It's a label.", ex: "Read the label to find the artist's name." },
    { w: "easel", pic: "🪧", pos: "noun", kind: "tool", at: "studio", say: "It's an easel.", ex: "Put the canvas on the easel." },
    { w: "palette", pic: "🎨", pos: "noun", kind: "tool", at: "studio", say: "It's a palette.", ex: "Mix the colours on the palette." },
    { w: "paintbrush", pic: "🖌️", pos: "noun", kind: "tool", at: "studio", say: "It's a paintbrush.", ex: "Dip the paintbrush in blue paint." },
    { w: "canvas", pic: "⬜", pos: "noun", kind: "thing", at: "studio", say: "It's a canvas.", ex: "The artist paints on a canvas." },
    { w: "sketchbook", pic: "📒", pos: "noun", kind: "thing", at: "studio", say: "It's a sketchbook.", ex: "She draws statues in her sketchbook." },
    { w: "velvet rope", pic: "🟥", pos: "noun", kind: "thing", at: "studio", say: "It's a velvet rope.", ex: "Don't cross the velvet rope." },
    { w: "spotlight", pic: "🔦", pos: "noun", kind: "machine", at: "studio", say: "It's a spotlight.", ex: "The spotlight shines on the painting." },
    // khu khoa học, vũ trụ
    { w: "planet Earth", pic: "🌍", pos: "noun", kind: "thing", at: "space", say: "It's planet Earth.", ex: "We live on planet Earth." },
    { w: "rocket", pic: "🚀", pos: "noun", kind: "machine", at: "space", say: "It's a rocket.", ex: "The rocket flies to the Moon." },
    { w: "astronaut", pic: "👨‍🚀", pos: "noun", kind: "thing", at: "space", say: "It's an astronaut.", ex: "An astronaut works in space." },
    { w: "space station", pic: "🛰️", pos: "noun", kind: "machine", at: "space", say: "It's a space station.", ex: "Astronauts live on a space station." },
    { w: "Saturn", pic: "🪐", pos: "noun", kind: "thing", at: "space", say: "It's Saturn.", ex: "Saturn has beautiful rings." },
    { w: "moon", pic: "🌕", pos: "noun", kind: "thing", at: "space", say: "It's the moon.", ex: "The moon is bright tonight." },
    { w: "star map", pic: "✨", pos: "noun", kind: "thing", at: "space", say: "It's a star map.", ex: "Find the Big Dipper on the star map." },
    { w: "airplane", pic: "✈️", pos: "noun", kind: "machine", at: "space", say: "It's an airplane.", ex: "The airplane flies over the clouds." },
    { w: "microscope", pic: "🔬", pos: "noun", kind: "machine", at: "lab", say: "It's a microscope.", ex: "Look at the cells with a microscope." },
    { w: "robot", pic: "🤖", pos: "noun", kind: "machine", at: "lab", say: "It's a robot.", ex: "The robot can say hello." },
    { w: "magnet", pic: "🧲", pos: "noun", kind: "tool", at: "lab", say: "It's a magnet.", ex: "A magnet picks up nails." },
    { w: "DNA model", pic: "🧬", pos: "noun", kind: "thing", at: "lab", say: "It's a DNA model.", ex: "DNA is inside every living thing." },
    { w: "test tube", pic: "🧪", pos: "noun", kind: "tool", at: "lab", say: "It's a test tube.", ex: "The test tube has blue water." },
    { w: "volcano model", pic: "🌋", pos: "noun", kind: "thing", at: "lab", say: "It's a volcano model.", ex: "The volcano model can erupt!" },
    { w: "telescope", pic: "🔭", pos: "noun", kind: "machine", at: "lab", say: "It's a telescope.", ex: "I can see stars with a telescope." },
    { w: "Tesla coil", pic: "⚡", pos: "noun", kind: "machine", at: "lab", say: "It's a Tesla coil.", ex: "A Tesla coil makes big sparks." }
  ],
  /* ===== VOCAB.townhall – điền món vào trong mảng dưới đây ===== */
  townhall: [
    { w: "information desk", pic: "ℹ️", pos: "noun", kind: "furniture", at: "info", say: "It's an information desk.", ex: "Ask at the information desk." },
    { w: "visitor badge", pic: "🪪", pos: "noun", kind: "thing", at: "info", say: "It's a visitor badge.", ex: "Wear your visitor badge." },
    { w: "leaflet", pic: "📄", pos: "noun", kind: "thing", at: "info", say: "It's a leaflet.", ex: "Take a leaflet about the city." },
    { w: "guest book", pic: "📖", pos: "noun", kind: "thing", at: "info", say: "It's a guest book.", ex: "Sign the guest book, please." },
    { w: "keyboard", pic: "⌨️", pos: "noun", kind: "machine", at: "info", say: "It's a keyboard.", ex: "He types on the keyboard." },
    { w: "ticket machine", pic: "🎫", pos: "noun", kind: "machine", at: "service", say: "It's a ticket machine.", ex: "Press the button on the ticket machine." },
    { w: "service counter", pic: "🧾", pos: "noun", kind: "furniture", at: "service", say: "It's a service counter.", ex: "Go to the service counter." },
    { w: "ID card", pic: "🪪", pos: "noun", kind: "thing", at: "service", say: "It's an ID card.", ex: "Show your ID card, please." },
    { w: "document", pic: "📑", pos: "noun", kind: "thing", at: "service", say: "It's a document.", ex: "Sign this document." },
    { w: "certificate", pic: "📜", pos: "noun", kind: "thing", at: "service", say: "It's a certificate.", ex: "She got a certificate." },
    { w: "folder", pic: "📁", pos: "noun", kind: "thing", at: "service", say: "It's a folder.", ex: "Put the papers in the folder." },
    { w: "stapler", pic: "🖇️", pos: "noun", kind: "tool", at: "service", say: "It's a stapler.", ex: "Use the stapler for the pages." },
    { w: "staircase", pic: "🪜", pos: "noun", kind: "thing", at: "stairs", say: "It's a staircase.", ex: "The staircase goes up to the balcony." },
    { w: "balcony", pic: "🏛️", pos: "noun", kind: "thing", at: "stairs", say: "It's a balcony.", ex: "We can see the hall from the balcony." },
    { w: "chandelier", pic: "💡", pos: "noun", kind: "thing", at: "stairs", say: "It's a chandelier.", ex: "The chandelier is made of crystal." },
    { w: "handrail", pic: "🛤️", pos: "noun", kind: "thing", at: "stairs", say: "It's a handrail.", ex: "Hold the handrail on the stairs." },
    { w: "carpet", pic: "🟥", pos: "noun", kind: "thing", at: "stairs", say: "It's a red carpet.", ex: "Walk on the red carpet." },
    { w: "curtain", pic: "🪟", pos: "noun", kind: "thing", at: "stairs", say: "It's a curtain.", ex: "Open the curtain, please." },
    { w: "floor tile", pic: "⬛", pos: "noun", kind: "thing", at: "stairs", say: "It's a floor tile.", ex: "The floor tiles are black and white." },
    { w: "conference table", pic: "🪑", pos: "noun", kind: "furniture", at: "hall", say: "It's a conference table.", ex: "The mayor sits at the conference table." },
    { w: "high-back chair", pic: "💺", pos: "noun", kind: "furniture", at: "hall", say: "It's a high-back chair.", ex: "The mayor sits on a high-back chair." },
    { w: "carafe", pic: "🫗", pos: "noun", kind: "thing", at: "hall", say: "It's a carafe of water.", ex: "Pour some water from the carafe." },
    { w: "microphone", pic: "🎤", pos: "noun", kind: "machine", at: "hall", say: "It's a microphone.", ex: "Speak into the microphone." },
    { w: "bouquet", pic: "💐", pos: "noun", kind: "plant", at: "hall", say: "It's a bouquet.", ex: "The bouquet smells sweet." },
    { w: "quest board", pic: "🗒️", pos: "noun", kind: "thing", at: "quest", say: "It's the quest board.", ex: "Check the quest board every day." },
    { w: "notice", pic: "📌", pos: "noun", kind: "thing", at: "quest", say: "It's a notice.", ex: "Read the notice on the board." },
    { w: "scroll", pic: "📜", pos: "noun", kind: "thing", at: "quest", say: "It's a scroll.", ex: "The quest is written on a scroll." },
    { w: "reward", pic: "🎁", pos: "noun", kind: "thing", at: "quest", say: "It's a reward.", ex: "You get a reward for the quest." },
    { w: "medal", pic: "🏅", pos: "noun", kind: "thing", at: "quest", say: "It's a medal.", ex: "She won a gold medal." },
    { w: "plaque", pic: "🪧", pos: "noun", kind: "thing", at: "wall", say: "It's a plaque.", ex: "The plaque says the hall was built in 1908." },
    { w: "photograph", pic: "🖼️", pos: "noun", kind: "thing", at: "wall", say: "It's a photograph.", ex: "This old photograph shows the Town Hall." }
  ],
  /* ===== VOCAB.hospital – điền món vào trong mảng dưới đây ===== */
  hospital: [
  ],
  /* ===== VOCAB.school – điền món vào trong mảng dưới đây ===== */
  school: [
  ],
  /* ===== VOCAB.bakery – điền món vào trong mảng dưới đây ===== */
  bakery: [
    // quầy bánh mì (khu trước)
    { w: "banh mi",         pic: "🥪", pos: "noun", kind: "food",    at: "counter", say: "It's a banh mi.",          ex: "I'd like a banh mi, please." },
    { w: "baguette",        pic: "🥖", pos: "noun", kind: "food",    at: "counter", say: "It's a baguette.",         ex: "The baguette is long and crispy." },
    { w: "pâté",            pic: "🥫", pos: "noun", kind: "food",    at: "counter", say: "It's pâté.",               ex: "I like pâté in my banh mi." },
    { w: "pork roll",       pic: "🍖", pos: "noun", kind: "food",    at: "counter", say: "It's pork roll.",          ex: "Pork roll is a Vietnamese meat." },
    { w: "cucumber",        pic: "🥒", pos: "noun", kind: "food",    at: "counter", say: "It's a cucumber.",         ex: "Fresh cucumber is cool and crunchy." },
    { w: "pickled carrots", pic: "🥕", pos: "noun", kind: "food",    at: "counter", say: "They're pickled carrots.", ex: "Pickled carrots taste sweet and sour." },
    { w: "coriander",       pic: "🌿", pos: "noun", kind: "food",    at: "counter", say: "It's coriander.",          ex: "No coriander, please." },
    { w: "chilli",          pic: "🌶️", pos: "noun", kind: "food",    at: "counter", say: "It's a chilli.",           ex: "This chilli is very hot!" },
    { w: "paper bag",       pic: "🛍️", pos: "noun", kind: "thing",   at: "counter", say: "It's a paper bag.",        ex: "Put the bread in a paper bag, please." },
    // kệ bánh mì dọc tường
    { w: "sandwich bread",  pic: "🍞", pos: "noun", kind: "food",    at: "shelf", say: "It's sandwich bread.",     ex: "I eat sandwich bread for breakfast." },
    { w: "bagel",           pic: "🥯", pos: "noun", kind: "food",    at: "shelf", say: "It's a bagel.",            ex: "A bagel has a hole in the middle." },
    { w: "steamed bun",     pic: "🥟", pos: "noun", kind: "food",    at: "shelf", say: "It's a steamed bun.",      ex: "The steamed bun is soft and hot." },
    { w: "butter",          pic: "🧈", pos: "noun", kind: "food",    at: "shelf", say: "It's butter.",             ex: "Put some butter on the bread." },
    { w: "jam",             pic: "🍓", pos: "noun", kind: "food",    at: "shelf", say: "It's jam.",                ex: "I like strawberry jam." },
    // tủ kính bánh ngọt
    { w: "sponge cake",     pic: "🍰", pos: "noun", kind: "food",    at: "cases", say: "It's a sponge cake.",      ex: "The sponge cake is soft and sweet." },
    { w: "flan",            pic: "🍮", pos: "noun", kind: "food",    at: "cases", say: "It's a flan.",             ex: "Flan is sweet and smooth." },
    { w: "birthday cake",   pic: "🎂", pos: "noun", kind: "food",    at: "cases", say: "It's a birthday cake.",    ex: "We have a birthday cake for my sister." },
    { w: "mooncake",        pic: "🥮", pos: "noun", kind: "food",    at: "cases", say: "It's a mooncake.",         ex: "We eat mooncakes at the Mid-Autumn Festival." },
    { w: "muffin",          pic: "🧁", pos: "noun", kind: "food",    at: "cases", say: "It's a muffin.",           ex: "I'd like a blueberry muffin." },
    { w: "tart",            pic: "🥧", pos: "noun", kind: "food",    at: "cases", say: "It's a tart.",             ex: "The fruit tart looks delicious." },
    // tủ lạnh nước
    { w: "orange juice",    pic: "🍊", pos: "noun", kind: "drink",   at: "fridge", say: "It's orange juice.",      ex: "I drink orange juice every morning." },
    { w: "yogurt",          pic: "🥛", pos: "noun", kind: "food",    at: "fridge", say: "It's yogurt.",            ex: "Yogurt is cold and creamy." },
    { w: "soda can",        pic: "🥤", pos: "noun", kind: "drink",   at: "fridge", say: "It's a soda can.",        ex: "Can I have a cold soda can?" },
    // góc ngồi
    { w: "table",           pic: "🍽️", pos: "noun", kind: "furniture", at: "seats", say: "It's a table.",         ex: "A table for two, please." },
    { w: "chair",           pic: "🪑", pos: "noun", kind: "furniture", at: "seats", say: "It's a chair.",         ex: "Please sit on this chair." },
    { w: "plate",           pic: "🍽️", pos: "noun", kind: "thing",   at: "seats", say: "It's a plate.",           ex: "Put the cake on the plate." },
    // bếp sau
    { w: "oven",            pic: "♨️", pos: "noun", kind: "machine", at: "kitchen", say: "It's an oven.",          ex: "The bread is in the oven." },
    { w: "dough mixer",     pic: "🌀", pos: "noun", kind: "machine", at: "kitchen", say: "It's a dough mixer.",    ex: "The dough mixer is very strong." },
    { w: "rolling pin",     pic: "🪵", pos: "noun", kind: "tool",    at: "kitchen", say: "It's a rolling pin.",    ex: "Use a rolling pin to flatten the dough." },
    { w: "flour",           pic: "🌾", pos: "noun", kind: "food",    at: "kitchen", say: "It's flour.",            ex: "We need flour to make bread." },
    { w: "dough",           pic: "⚪", pos: "noun", kind: "food",    at: "kitchen", say: "It's dough.",            ex: "The dough is soft and sticky." },
    { w: "baking tray",     pic: "🍪", pos: "noun", kind: "tool",    at: "kitchen", say: "It's a baking tray.",    ex: "Put the bread on the baking tray." },
    { w: "rolling rack",    pic: "🛒", pos: "noun", kind: "furniture", at: "kitchen", say: "It's a rolling rack.", ex: "The hot bread is on the rolling rack." },
    { w: "sink",            pic: "🚰", pos: "noun", kind: "furniture", at: "kitchen", say: "It's a sink.",         ex: "Wash your hands in the sink." },
    { w: "timer",           pic: "⏲️", pos: "noun", kind: "machine", at: "kitchen", say: "It's a timer.",          ex: "The timer rings after twenty minutes." },
    { w: "apron",           pic: "👨‍🍳", pos: "noun", kind: "thing",   at: "kitchen", say: "It's an apron.",        ex: "The baker wears a white apron." }
  ],
  /* ===== VOCAB.furniture – điền món vào trong mảng dưới đây ===== */
  furniture: [
  ],
  /* ===== VOCAB.electronics – điền món vào trong mảng dưới đây ===== */
  electronics: [
  ],
  /* ===== VOCAB.cinema – điền món vào trong mảng dưới đây ===== */
  cinema: [
  ],
  /* ===== VOCAB.hotel – điền món vào trong mảng dưới đây ===== */
  hotel: [
  ]
};
