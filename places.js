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
  { id: "bakery", name: "Banh Mi Bakery", type: "bakery", x: 56, z: -10, w: 10, d: 10, door: "south", exterior: "banhmi", layout: "bakeryshop", size: { w: 16, d: 18, h: 4.5 },
    color: 0xffe8cc, roof: 0xc0392b, awning: 0xe67e22, floor: 0xe9c99a, wall: 0xfff4e0,
    keeper: { name: "Anna – Baker", color: 0xf08c00, greet: "Good morning! Everything is fresh today. What would you like?", hint: "Can I have a banh mi, please?" },
    sells: ["banhmi", "donut", "milk"] },
  { id: "pharmacy", name: "Green Cross Pharmacy", type: "pharmacy", x: 68, z: -10, w: 10, d: 10, door: "south", exterior: "pharmacy", layout: "pharmacyshop", size: { w: 16, d: 18, h: 4.5 },
    color: 0xe6fcf5, roof: 0x2b8a3e, awning: 0x37b24d, floor: 0xdee2e6, wall: 0xf8f9fa,
    keeper: { name: "Sam – Pharmacist", color: 0x1c7ed6, greet: "Hello! How are you feeling today?", hint: "I have a sore throat. Can I have some throat syrup?" },
    sells: ["syrup", "vaccine"] },
  { id: "clothes", name: "Clothes Shop", type: "clothes", x: 80, z: -10, w: 10, d: 10, door: "south", exterior: "clothes", layout: "clothesshop", size: { w: 16, d: 18, h: 4.5 },
    color: 0xfff0f6, roof: 0x9c36b5, awning: 0xe64980, floor: 0xf1e3d3, wall: 0xfff5f9,
    keeper: { name: "Kim – Designer", color: 0xe64980, greet: "Hi! Welcome to the Clothes Shop. Do you like hats, T-shirts or capes?", hint: "Can I have the red T-shirt, please?" },
    sells: ["tee_red", "tee_blue", "tee_yellow", "jeans", "straw_hat", "jacket", "vest", "boots_exp", "boots_vik", "viking_hat", "hood", "cape_exp", "cape_vik", "robe", "armor", "boots_wiz", "boots_kn", "wizard_hat", "helmet", "cape_wiz", "cape_kn", "royal", "cape_star"] },
  { id: "townhall", name: "Town Hall", type: "townhall", x: 0, z: -44, w: 32, d: 13, door: "south", exterior: "townhall", layout: "cityhall", size: { w: 32, d: 40, h: 10 },
    color: 0xf1f3f5, roof: 0x495057, awning: 0x1c7ed6, floor: 0xc9a27e, wall: 0xf8f0e3,
    keeper: { name: "Mr. Lee – Mayor", color: 0x343a40, greet: "Welcome to Town Hall! The quest board will open soon.", hint: "I'd like to take a quest." },
    sells: [] },
  { id: "hospital", name: "City Hospital", type: "hospital", x: -62, z: -40, w: 20, d: 11, door: "east", exterior: "hospital", layout: "hospitalhall", size: { w: 30, d: 44, h: 6 },
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
  { id: "school", name: "Verse School", type: "school", x: -82, z: -14, w: 24, d: 18, door: "south", exterior: "school", layout: "schoolhall", size: { w: 30, d: 36, h: 5 },
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
  { id: "furniture", name: "Home & Cozy", type: "furniture store", x: 120, z: -10, w: 10, d: 10, door: "south", exterior: "furniture", layout: "furnishop", size: { w: 16, d: 18, h: 4.5 },
    color: 0xf8f0e3, roof: 0x8d5a2b, awning: 0xa0522d, floor: 0xd9b38c, wall: 0xfff8f0, goods: [],
    keeper: { name: "Omar – Seller", color: 0x8d5a2b, greet: "Hello! Welcome to Home & Cozy. Do you need furniture for your home?", hint: "I’d like the sofa, please." },
    sells: ["d_couch", "d_chair", "d_lamp", "d_cactus", "d_shelf", "d_table", "d_cabinet", "d_rug"] },
  { id: "restaurant", name: "Pho Corner", type: "restaurant", x: 108, z: -10, w: 10, d: 10, door: "south", model: "building_E", layout: "phoshop", size: { w: 16, d: 18, h: 4.5 },
    color: 0xfff5f5, roof: 0xc92a2a, awning: 0xf03e3e, floor: 0xe9c99a, wall: 0xfff4e6, goods: ["🍜", "🌯", "🍹", "🥢", "🍚", "🌶️"],
    keeper: { name: "Chef Bao – Cook", color: 0xf8f9fa, greet: "Welcome to Pho Corner! Are you hungry?", hint: "Can I have a bowl of pho, please?" },
    sells: ["pho", "springroll", "lemontea"] },
  { id: "salon", name: "Saigon Barber", type: "barber shop", x: 92, z: -10, w: 10, d: 10, door: "south", exterior: "barber", layout: "barbershop", size: { w: 16, d: 18, h: 4.5 },
    color: 0xf3f0ff, roof: 0x7048e8, awning: 0x9775fa, floor: 0xf1f3f5, wall: 0xf8f0fc, goods: ["✂️", "💈", "🪮", "🧴", "💇", "🪞"],
    keeper: { name: "Lily – Hairdresser", color: 0x9775fa, greet: "Hi! Welcome to Saigon Barber. What hairstyle would you like today?", hint: "I’d like short hair, please." },
    sells: ["hair_Rogue", "hair_Knight", "hair_Mage", "hair_Barbarian"] },
  { id: "supermarket", name: "Shop 24h", type: "convenience store", x: 134, z: -11, w: 12, d: 12, door: "south", exterior: "shop24", layout: "martshop", size: { w: 16, d: 18, h: 4.5 },
    color: 0xebfbee, roof: 0x2f9e44, awning: 0x40c057, floor: 0xf1f3f5, wall: 0xf8f9fa, goods: ["🍎", "🍌", "🥛", "🍙", "💧", "🥕"],
    keeper: { name: "Nam – Cashier", color: 0x40c057, greet: "Hi! Shop 24h is open all day and all night. Can I help you?", hint: "Can I have an apple and some water, please?" },
    sells: ["apple", "banana", "water", "riceball", "milk"] },
  { id: "workshop", name: "Fix-It Workshop", type: "workshop", x: 75, z: -86, w: 10, d: 10, door: "north", model: "building_B", layout: "lab",
    color: 0xf1f3f5, roof: 0x495057, awning: 0xfab005, floor: 0xadb5bd, wall: 0xe9ecef, goods: ["🔧", "🔨", "🪛", "🚲", "⚙️", "🪚"], keeper: null, sells: [] },
  { id: "police", name: "Police Station", type: "police station", x: -62, z: 12, w: 16, d: 12, door: "north", exterior: "police", layout: "policehall", size: { w: 24, d: 30, h: 5 },
    color: 0xe7f5ff, roof: 0x1864ab, awning: 0x1c7ed6, floor: 0xdee2e6, wall: 0xf1f3f5, goods: ["🚓", "🔦", "📋", "🗺️", "🔑", "🚨"], keeper: null, sells: [] },
  { id: "fire", name: "Fire Station", type: "fire station", x: -78, z: 12, w: 10, d: 10, door: "north", exterior: "fire", layout: "firehall", size: { w: 24, d: 32, h: 8 },
    color: 0xfff5f5, roof: 0xc92a2a, awning: 0xe03131, floor: 0xadb5bd, wall: 0xfff5f5, goods: ["🚒", "🧯", "🪜", "⛑️", "🚨", "🧑‍🚒"], keeper: null, sells: [] },
  { id: "mall", name: "Verse Plaza", type: "shopping mall", x: 64.5, z: 16, w: 24, d: 20, door: "west",   // quay mặt về quảng trường (phía tây)
    exterior: "mall", layout: "mallhall", size: { w: 36, d: 44, h: 12 },
    color: 0xf1f3f5, roof: 0x748ffc, awning: 0x4c6ef5, floor: 0xf1f3f5, wall: 0xf8f9fa, goods: ["🛍️", "👟", "🎮", "📱", "🧸", "⌚"], keeper: null, sells: [] },
  // Hàng phía nam (cửa nhìn lên Market Street)
  { id: "home", name: "My Home", type: "home", x: -125, z: -14, w: 12, d: 11, door: "south", exterior: "home", layout: "home",
    color: 0xfff4e6, roof: 0xd9480f, awning: 0xfd7e14, floor: 0xd9b38c, wall: 0xfff8f0, keeper: null, sells: [] },
  { id: "cinema", name: "Star Cinema", type: "cinema", x: 85, z: 18, w: 12, d: 12, door: "north", model: "building_H", scale: 6, layout: "cinema",
    color: 0x343a40, roof: 0x212529, awning: 0xfab005, floor: 0x5c1a1a, wall: 0x3b2f2a, goods: ["🎬", "🍿", "🎟️", "🥤", "🎥", "⭐"],
    keeper: { name: "Jack – Ticket Seller", color: 0xfab005, greet: "Hi! The movie starts at seven. Would you like some popcorn?", hint: "Can I have some popcorn, please?" },
    sells: ["popcorn", "water"] }
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
  { name: "Verse Hotel",      x: 33,   z: 0,    w: 18, d: 16, door: "west",  big: true },
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
  police: [
    // quầy tiếp dân (desk)
    { w: "service counter",  pic: "🛎️", pos: "noun", kind: "furniture", at: "desk", say: "It's a service counter.",     ex: "Ask for help at the service counter." },
    { w: "claim form",       pic: "📝", pos: "noun", kind: "thing",     at: "desk", say: "It's a claim form.",          ex: "Fill in the claim form, please." },
    { w: "ballpoint pen",    pic: "🖊️", pos: "noun", kind: "tool",      at: "desk", say: "It's a ballpoint pen.",       ex: "Write your name with a ballpoint pen." },
    { w: "bulletin board",   pic: "📌", pos: "noun", kind: "thing",     at: "desk", say: "It's a bulletin board.",      ex: "Read the notices on the bulletin board." },
    { w: "queue number",     pic: "🔢", pos: "noun", kind: "thing",     at: "desk", say: "It's a queue number.",        ex: "Take a queue number and wait, please." },
    // văn phòng (office)
    { w: "desktop computer", pic: "🖥️", pos: "noun", kind: "machine",   at: "office", say: "It's a desktop computer.",   ex: "The officer types on the desktop computer." },
    { w: "photocopier",      pic: "🖨️", pos: "noun", kind: "machine",   at: "office", say: "It's a photocopier.",        ex: "The photocopier makes two copies." },
    { w: "filing cabinet",   pic: "🗄️", pos: "noun", kind: "furniture", at: "office", say: "It's a filing cabinet.",     ex: "The papers are in the filing cabinet." },
    { w: "file folder",      pic: "📁", pos: "noun", kind: "thing",     at: "office", say: "It's a file folder.",        ex: "Put the report in the file folder." },
    { w: "desk phone",       pic: "☎️", pos: "noun", kind: "machine",   at: "office", say: "It's a desk phone.",         ex: "Call me on the desk phone." },
    // phòng điều phối (dispatch)
    { w: "big map",          pic: "🗺️", pos: "noun", kind: "thing",     at: "dispatch", say: "It's a big map.",          ex: "The big map shows every street." },
    { w: "walkie-talkie",    pic: "📻", pos: "noun", kind: "machine",   at: "dispatch", say: "It's a walkie-talkie.",    ex: "The officer talks on a walkie-talkie." },
    { w: "radar screen",     pic: "📡", pos: "noun", kind: "machine",   at: "dispatch", say: "It's a radar screen.",     ex: "The radar screen shows the cars." },
    { w: "traffic light",    pic: "🚦", pos: "noun", kind: "machine",   at: "dispatch", say: "It's a traffic light.",    ex: "Stop when the traffic light is red." },
    { w: "headset",          pic: "🎧", pos: "noun", kind: "thing",     at: "dispatch", say: "It's a headset.",          ex: "The officer wears a headset." },
    // trang bị (gear)
    { w: "helmet",           pic: "⛑️", pos: "noun", kind: "thing",     at: "gear", say: "It's a helmet.",               ex: "Always wear a helmet when you ride a bike." },
    { w: "reflective vest",  pic: "🦺", pos: "noun", kind: "thing",     at: "gear", say: "It's a reflective vest.",      ex: "The vest helps drivers see you." },
    { w: "bicycle",          pic: "🚲", pos: "noun", kind: "thing",     at: "gear", say: "It's a bicycle.",              ex: "The police ride a bicycle on the street." },
    { w: "traffic cone",     pic: "🚧", pos: "noun", kind: "thing",     at: "gear", say: "It's a traffic cone.",         ex: "Walk around the traffic cone." },
    { w: "stop sign",        pic: "🛑", pos: "noun", kind: "thing",     at: "gear", say: "It's a stop sign.",            ex: "Stop at the stop sign." },
    // kệ đồ thất lạc (lost and found)
    { w: "keys",             pic: "🔑", pos: "noun", kind: "thing",     at: "lostfound", say: "They're keys.",           ex: "I lost my keys at school." },
    { w: "scarf",            pic: "🧣", pos: "noun", kind: "thing",     at: "lostfound", say: "It's a scarf.",           ex: "My scarf is warm and blue." },
    { w: "water bottle",     pic: "💧", pos: "noun", kind: "thing",     at: "lostfound", say: "It's a water bottle.",    ex: "Is this your water bottle?" },
    { w: "raincoat",         pic: "🧥", pos: "noun", kind: "thing",     at: "lostfound", say: "It's a raincoat.",        ex: "Wear a raincoat when it rains." }
  ],
  fire: [
    // nhà xe (garage)
    { w: "fire truck",       pic: "🚒", pos: "noun", kind: "machine",   at: "garage", say: "It's a fire truck.",          ex: "The fire truck is big and red." },
    { w: "fire hose",        pic: "💦", pos: "noun", kind: "tool",      at: "garage", say: "It's a fire hose.",           ex: "The fire hose is long and heavy." },
    { w: "siren",            pic: "🚨", pos: "noun", kind: "machine",   at: "garage", say: "It's a siren.",               ex: "We hear the siren from far away." },
    { w: "water tank",       pic: "🛢️", pos: "noun", kind: "thing",     at: "garage", say: "It's a water tank.",          ex: "The truck carries a big water tank." },
    { w: "flashlight",       pic: "🔦", pos: "noun", kind: "tool",      at: "garage", say: "It's a flashlight.",          ex: "Use a flashlight in the dark." },
    { w: "toolbox",          pic: "🧰", pos: "noun", kind: "tool",      at: "garage", say: "It's a toolbox.",             ex: "The toolbox has many tools inside." },
    // giá đồ bảo hộ (gear)
    { w: "fire helmet",      pic: "⛑️", pos: "noun", kind: "thing",     at: "gear", say: "It's a fire helmet.",         ex: "A fire helmet keeps your head safe." },
    { w: "fire extinguisher", pic: "🧯", pos: "noun", kind: "tool",     at: "gear", say: "It's a fire extinguisher.",   ex: "The fire extinguisher is red." },
    { w: "fire boots",       pic: "🥾", pos: "noun", kind: "thing",     at: "gear", say: "They're fire boots.",         ex: "The fire boots keep my feet safe." },
    { w: "fire gloves",      pic: "🧤", pos: "noun", kind: "thing",     at: "gear", say: "They're fire gloves.",        ex: "Fire gloves protect your hands." },
    { w: "fire jacket",      pic: "🧥", pos: "noun", kind: "thing",     at: "gear", say: "It's a fire jacket.",         ex: "The fire jacket is thick and strong." },
    // góc báo động (alarm)
    { w: "fire alarm",       pic: "🚨", pos: "noun", kind: "machine",   at: "alarm", say: "It's a fire alarm.",         ex: "Leave the building when you hear the fire alarm." },
    { w: "smoke detector",   pic: "📟", pos: "noun", kind: "machine",   at: "alarm", say: "It's a smoke detector.",     ex: "The smoke detector beeps when there is smoke." },
    { w: "sprinkler",        pic: "🚿", pos: "noun", kind: "machine",   at: "alarm", say: "It's a sprinkler.",          ex: "The sprinkler is on the ceiling." },
    { w: "exit sign",        pic: "🚪", pos: "noun", kind: "thing",     at: "alarm", say: "It's an exit sign.",         ex: "Follow the exit sign to get out." },
    // khu nghỉ và bếp (rest)
    { w: "team photo",       pic: "🖼️", pos: "noun", kind: "thing",     at: "rest", say: "It's a team photo.",          ex: "Our team photo hangs on the wall." },
    { w: "bunk bed",         pic: "🛏️", pos: "noun", kind: "furniture", at: "rest", say: "It's a bunk bed.",            ex: "I sleep on the top bunk bed." },
    { w: "water cooler",     pic: "🚰", pos: "noun", kind: "machine",   at: "rest", say: "It's a water cooler.",        ex: "Get cold water from the water cooler." },
    { w: "rice cooker",      pic: "🍚", pos: "noun", kind: "machine",   at: "rest", say: "It's a rice cooker.",         ex: "The rice cooker makes hot rice." },
    { w: "couch",            pic: "🛋️", pos: "noun", kind: "furniture", at: "rest", say: "It's a couch.",               ex: "We watch TV on the couch." },
    // góc tập huấn (training)
    { w: "whistle",          pic: "📯", pos: "noun", kind: "thing",     at: "training", say: "It's a whistle.",         ex: "The coach blows a whistle to start." },
    { w: "training mat",     pic: "🧘", pos: "noun", kind: "thing",     at: "training", say: "It's a training mat.",    ex: "We practise on the training mat." },
    { w: "rope",             pic: "🪢", pos: "noun", kind: "thing",     at: "training", say: "It's a rope.",            ex: "Hold the rope tight and walk slowly." }
  ],
  mall: [
    // sảnh giữa (atrium)
    { w: "escalator",     pic: "🪜", pos: "noun", kind: "machine", at: "atrium", say: "It's an escalator.",       ex: "We take the escalator to the second floor." },
    { w: "fountain",      pic: "⛲", pos: "noun", kind: "thing",   at: "atrium", say: "It's a fountain.",         ex: "Children play near the fountain." },
    { w: "trash bin",     pic: "🗑️", pos: "noun", kind: "thing",   at: "atrium", say: "It's a trash bin.",        ex: "Please put the paper in the trash bin." },
    { w: "shopping cart", pic: "🛒", pos: "noun", kind: "thing",   at: "atrium", say: "It's a shopping cart.",    ex: "Mom pushes the shopping cart." },
    { w: "elevator",      pic: "🛗", pos: "noun", kind: "machine", at: "atrium", say: "It's an elevator.",        ex: "The elevator goes up to floor three." },
    // Toy Island (toys)
    { w: "toy robot",     pic: "🤖", pos: "noun", kind: "thing",   at: "toys", say: "It's a toy robot.",          ex: "My brother has a toy robot." },
    { w: "doll",          pic: "🪆", pos: "noun", kind: "thing",   at: "toys", say: "It's a doll.",               ex: "She hugs her doll every night." },
    { w: "toy car",       pic: "🚗", pos: "noun", kind: "thing",   at: "toys", say: "It's a toy car.",            ex: "The toy car is red and fast." },
    { w: "building blocks", pic: "🧱", pos: "noun", kind: "thing", at: "toys", say: "They're building blocks.",   ex: "I build a castle with building blocks." },
    { w: "kite",          pic: "🪁", pos: "noun", kind: "thing",   at: "toys", say: "It's a kite.",               ex: "We fly a kite at the park." },
    // Tech Zone (electronics)
    { w: "tablet",        pic: "📱", pos: "noun", kind: "machine", at: "electronics", say: "It's a tablet.",      ex: "I read stories on my tablet." },
    { w: "smartphone",    pic: "📲", pos: "noun", kind: "machine", at: "electronics", say: "It's a smartphone.",  ex: "My smartphone has a big screen." },
    { w: "speaker",       pic: "🔊", pos: "noun", kind: "machine", at: "electronics", say: "It's a speaker.",     ex: "The speaker plays loud music." },
    { w: "camera",        pic: "📷", pos: "noun", kind: "machine", at: "electronics", say: "It's a camera.",      ex: "I take photos with a camera." },
    { w: "game console",  pic: "🎮", pos: "noun", kind: "machine", at: "electronics", say: "It's a game console.", ex: "Turn off the game console after one hour." },
    // Sport Star (sports)
    { w: "basketball",    pic: "🏀", pos: "noun", kind: "thing",   at: "sports", say: "It's a basketball.",      ex: "I bounce the basketball on the floor." },
    { w: "running shoes", pic: "👟", pos: "noun", kind: "thing",   at: "sports", say: "They're running shoes.",  ex: "These running shoes are light." },
    { w: "tennis racket", pic: "🎾", pos: "noun", kind: "tool",    at: "sports", say: "It's a tennis racket.",   ex: "She hits the ball with a tennis racket." },
    { w: "jump rope",     pic: "🪢", pos: "noun", kind: "tool",    at: "sports", say: "It's a jump rope.",       ex: "I skip with a jump rope every day." },
    { w: "skateboard",    pic: "🛹", pos: "noun", kind: "thing",   at: "sports", say: "It's a skateboard.",      ex: "He rides his skateboard to school." },
    // Food Court (foodcourt)
    { w: "pizza",         pic: "🍕", pos: "noun", kind: "food", at: "foodcourt", say: "It's a pizza.",            ex: "Let’s share a big pizza." },
    { w: "hamburger",     pic: "🍔", pos: "noun", kind: "food", at: "foodcourt", say: "It's a hamburger.",        ex: "The hamburger is hot and tasty." },
    { w: "sushi",         pic: "🍣", pos: "noun", kind: "food", at: "foodcourt", say: "It's sushi.",              ex: "I like sushi with soy sauce." },
    { w: "fried chicken", pic: "🍗", pos: "noun", kind: "food", at: "foodcourt", say: "It's fried chicken.",      ex: "Fried chicken is my favorite." },
    { w: "ice cream",     pic: "🍦", pos: "noun", kind: "food", at: "foodcourt", say: "It's ice cream.",          ex: "I’d like ice cream, please." },
    { w: "french fries",  pic: "🍟", pos: "noun", kind: "food", at: "foodcourt", say: "They're french fries.",    ex: "French fries are crispy and hot." },
    // trần (ceiling)
    { w: "chandelier",    pic: "💡", pos: "noun", kind: "thing", at: "ceiling", say: "It's a chandelier.",      ex: "The chandelier is very bright." },
  ],
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
  townhall: [
    // sảnh (lobby)
    { w: "reception desk",   pic: "🛎️", pos: "noun", kind: "furniture", at: "lobby", say: "It's a reception desk.",   ex: "Ask at the reception desk." },
    { w: "flag",             pic: "🚩", pos: "noun", kind: "thing",     at: "lobby", say: "It's a flag.",             ex: "The flag is red and yellow." },
    { w: "city map",         pic: "🗺️", pos: "noun", kind: "thing",     at: "lobby", say: "It's a city map.",         ex: "Look at the city map to find the park." },
    { w: "city model",       pic: "🏙️", pos: "noun", kind: "thing",     at: "lobby", say: "It's a city model.",       ex: "The city model shows every building." },
    { w: "welcome sign",     pic: "🪧", pos: "noun", kind: "thing",     at: "lobby", say: "It's a welcome sign.",     ex: "The welcome sign is near the door." },
    { w: "visitor badge",    pic: "🪪", pos: "noun", kind: "thing",     at: "lobby", say: "It's a visitor badge.",    ex: "Wear your visitor badge, please." },
    // quầy dịch vụ (counter)
    { w: "ticket dispenser", pic: "🎫", pos: "noun", kind: "machine",   at: "counter", say: "It's a ticket dispenser.", ex: "Take a number from the ticket dispenser." },
    { w: "ID card",          pic: "🪪", pos: "noun", kind: "thing",     at: "counter", say: "It's an ID card.",         ex: "Show your ID card, please." },
    { w: "application form", pic: "📄", pos: "noun", kind: "thing",     at: "counter", say: "It's an application form.", ex: "Fill in the application form." },
    { w: "paper clip",       pic: "📎", pos: "noun", kind: "tool",      at: "counter", say: "It's a paper clip.",       ex: "Use a paper clip to hold the papers." },
    { w: "folder",           pic: "📁", pos: "noun", kind: "thing",     at: "counter", say: "It's a folder.",           ex: "The papers are in a blue folder." },
    { w: "printer",          pic: "🖨️", pos: "noun", kind: "machine",   at: "counter", say: "It's a printer.",          ex: "The printer makes copies fast." },
    // bảng nhiệm vụ, thông báo (board)
    { w: "notice board",     pic: "📋", pos: "noun", kind: "furniture", at: "board", say: "It's a notice board.",     ex: "Read the news on the notice board." },
    { w: "notice",           pic: "📢", pos: "noun", kind: "thing",     at: "board", say: "It's a notice.",           ex: "There is a notice about the park." },
    { w: "pushpin",          pic: "📌", pos: "noun", kind: "tool",      at: "board", say: "It's a pushpin.",          ex: "Put the poster up with a pushpin." },
    { w: "recycling bin",    pic: "♻️", pos: "noun", kind: "thing",     at: "board", say: "It's a recycling bin.",    ex: "Put the bottles in the recycling bin." },
    { w: "broom",            pic: "🧹", pos: "noun", kind: "tool",      at: "board", say: "It's a broom.",            ex: "Use a broom to clean the street." },
    { w: "shovel",           pic: "🪏", pos: "noun", kind: "tool",      at: "board", say: "It's a shovel.",           ex: "Dig a hole with a shovel to plant a tree." },
    // phòng họp (meeting)
    { w: "microphone",       pic: "🎤", pos: "noun", kind: "machine",   at: "meeting", say: "It's a microphone.",     ex: "Speak into the microphone, please." },
    { w: "gavel",            pic: "🔨", pos: "noun", kind: "tool",      at: "meeting", say: "It's a gavel.",          ex: "The leader uses a gavel." },
    { w: "long table",       pic: "🪑", pos: "noun", kind: "furniture", at: "meeting", say: "It's a long table.",     ex: "We sit at the long table." },
    { w: "ballot box",       pic: "🗳️", pos: "noun", kind: "thing",     at: "meeting", say: "It's a ballot box.",     ex: "Put your vote in the ballot box." },
    { w: "name card",        pic: "📇", pos: "noun", kind: "thing",     at: "meeting", say: "It's a name card.",      ex: "Put your name card on the table." },
    { w: "projector",        pic: "📽️", pos: "noun", kind: "machine",   at: "meeting", say: "It's a projector.",      ex: "The projector shows the new park plan." },
    // văn phòng (office)
    { w: "file cabinet",     pic: "🗄️", pos: "noun", kind: "furniture", at: "office", say: "It's a file cabinet.",    ex: "The files are in the file cabinet." },
    { w: "office chair",     pic: "💺", pos: "noun", kind: "furniture", at: "office", say: "It's an office chair.",   ex: "Sit on the office chair." },
    { w: "keyboard",         pic: "⌨️", pos: "noun", kind: "machine",   at: "office", say: "It's a keyboard.",        ex: "Type on the keyboard, please." },
    { w: "computer mouse",   pic: "🖱️", pos: "noun", kind: "machine",   at: "office", say: "It's a computer mouse.",  ex: "Click the computer mouse twice." },
    { w: "stapler",          pic: "🖇️", pos: "noun", kind: "tool",      at: "office", say: "It's a stapler.",         ex: "Use the stapler to join the papers." },
    { w: "office phone",     pic: "📞", pos: "noun", kind: "machine",   at: "office", say: "It's an office phone.",   ex: "The office phone is ringing." }
  ],
  hospital: [
    // quầy tiếp nhận (reception)
    { w: "clipboard",        pic: "📋", pos: "noun", kind: "thing",     at: "reception", say: "It's a clipboard.",         ex: "Write your name on the clipboard." },
    { w: "wristband",        pic: "🎗️", pos: "noun", kind: "thing",     at: "reception", say: "It's a wristband.",         ex: "The nurse gives me a wristband." },
    { w: "health card",      pic: "🪪", pos: "noun", kind: "thing",     at: "reception", say: "It's a health card.",       ex: "Show your health card, please." },
    { w: "information desk", pic: "ℹ️", pos: "noun", kind: "furniture", at: "reception", say: "It's an information desk.", ex: "Ask at the information desk." },
    { w: "name tag",         pic: "🏷️", pos: "noun", kind: "thing",     at: "reception", say: "It's a name tag.",          ex: "Wear your name tag, please." },
    // khu chờ (waiting)
    { w: "chair",            pic: "🪑", pos: "noun", kind: "furniture", at: "waiting", say: "It's a chair.",          ex: "Please sit on the chair and wait." },
    { w: "wheelchair",       pic: "♿", pos: "noun", kind: "furniture", at: "waiting", say: "It's a wheelchair.",     ex: "Grandma uses a wheelchair." },
    { w: "tissues",          pic: "🧻", pos: "noun", kind: "thing",     at: "waiting", say: "They're tissues.",       ex: "Can I have some tissues, please?" },
    { w: "teddy bear",       pic: "🧸", pos: "noun", kind: "thing",     at: "waiting", say: "It's a teddy bear.",     ex: "The child hugs a teddy bear." },
    { w: "hand gel",         pic: "🧴", pos: "noun", kind: "thing",     at: "waiting", say: "It's hand gel.",         ex: "Use hand gel before you eat." },
    // quầy thuốc (pharmacy)
    { w: "medicine",         pic: "💊", pos: "noun", kind: "thing",     at: "pharmacy", say: "It's medicine.",        ex: "Take your medicine after meals." },
    { w: "cough syrup",      pic: "🧴", pos: "noun", kind: "thing",     at: "pharmacy", say: "It's cough syrup.",     ex: "Cough syrup helps a sore throat." },
    { w: "eye drops",        pic: "👁️", pos: "noun", kind: "thing",     at: "pharmacy", say: "They're eye drops.",    ex: "Use eye drops when your eyes are dry." },
    { w: "vitamins",         pic: "🍊", pos: "noun", kind: "food",      at: "pharmacy", say: "They're vitamins.",     ex: "Vitamins are good for your body." },
    { w: "syringe",          pic: "💉", pos: "noun", kind: "tool",      at: "pharmacy", say: "It's a syringe.",       ex: "The nurse uses a syringe for the vaccine." },
    // phòng khám (clinic)
    { w: "stethoscope",      pic: "🩺", pos: "noun", kind: "tool",      at: "clinic", say: "It's a stethoscope.",       ex: "The doctor uses a stethoscope." },
    { w: "thermometer",      pic: "🌡️", pos: "noun", kind: "tool",      at: "clinic", say: "It's a thermometer.",       ex: "Check your temperature with a thermometer." },
    { w: "bandage",          pic: "🩹", pos: "noun", kind: "thing",     at: "clinic", say: "It's a bandage.",           ex: "I put a bandage on my knee." },
    { w: "exam table",       pic: "🛏️", pos: "noun", kind: "furniture", at: "clinic", say: "It's an exam table.",       ex: "Sit on the exam table, please." },
    { w: "eye chart",        pic: "👀", pos: "noun", kind: "thing",     at: "clinic", say: "It's an eye chart.",        ex: "Read the letters on the eye chart." },
    { w: "X-ray",            pic: "🩻", pos: "noun", kind: "thing",     at: "clinic", say: "It's an X-ray.",            ex: "The X-ray shows the bones in my arm." },
    // phòng bệnh (ward)
    { w: "hospital bed",     pic: "🛏️", pos: "noun", kind: "furniture", at: "ward", say: "It's a hospital bed.",     ex: "The patient rests in a hospital bed." },
    { w: "plaster cast",     pic: "🦴", pos: "noun", kind: "thing",     at: "ward", say: "It's a plaster cast.",     ex: "My arm is in a plaster cast." },
    { w: "crutches",         pic: "🩼", pos: "noun", kind: "thing",     at: "ward", say: "They're crutches.",        ex: "I use crutches to walk." },
    { w: "drip",             pic: "💧", pos: "noun", kind: "machine",   at: "ward", say: "It's a drip.",             ex: "The nurse checks the drip." },
    { w: "blanket",          pic: "🛌", pos: "noun", kind: "thing",     at: "ward", say: "It's a blanket.",          ex: "Keep warm under a blanket." },
    // phòng xét nghiệm (lab)
    { w: "germ",             pic: "🦠", pos: "noun", kind: "thing",     at: "lab", say: "It's a germ.",              ex: "Germs can make you sick." },
    { w: "petri dish",       pic: "🧫", pos: "noun", kind: "tool",      at: "lab", say: "It's a petri dish.",        ex: "The bacteria grow in a petri dish." },
    { w: "gloves",           pic: "🧤", pos: "noun", kind: "thing",     at: "lab", say: "They're gloves.",           ex: "Wear gloves when you clean." },
    { w: "mask",             pic: "😷", pos: "noun", kind: "thing",     at: "lab", say: "It's a mask.",              ex: "Wear a mask to stop germs." },
    { w: "lab coat",         pic: "🥼", pos: "noun", kind: "thing",     at: "lab", say: "It's a lab coat.",          ex: "The scientist wears a white lab coat." },
    // trần (ceiling)
    { w: "ceiling light",    pic: "💡", pos: "noun", kind: "thing",     at: "ceiling", say: "It's a ceiling light.",  ex: "The ceiling light is very bright." }
  ],
  school: [
    // bảng (board)
    { w: "whiteboard",       pic: "🪧", pos: "noun", kind: "furniture", at: "board", say: "It's a whiteboard.",        ex: "Write the word on the whiteboard." },
    { w: "marker",           pic: "🖊️", pos: "noun", kind: "tool",      at: "board", say: "It's a marker.",            ex: "Use a red marker to write." },
    { w: "chalk",            pic: "🖍️", pos: "noun", kind: "tool",      at: "board", say: "It's chalk.",               ex: "Chalk writes on the board." },
    { w: "class schedule",   pic: "🗓️", pos: "noun", kind: "thing",     at: "board", say: "It's a class schedule.",    ex: "Look at the class schedule for Monday." },
    { w: "pointer",          pic: "👉", pos: "noun", kind: "tool",      at: "board", say: "It's a pointer.",           ex: "Use the pointer to show the word." },
    // lớp học (classroom)
    { w: "student desk",     pic: "🪑", pos: "noun", kind: "furniture", at: "classroom", say: "It's a student desk.",   ex: "Sit at your student desk, please." },
    { w: "teacher’s desk",   pic: "🗄️", pos: "noun", kind: "furniture", at: "classroom", say: "It's a teacher’s desk.", ex: "The books are on the teacher’s desk." },
    { w: "pencil case",      pic: "✏️", pos: "noun", kind: "thing",     at: "classroom", say: "It's a pencil case.",    ex: "My pencils are in my pencil case." },
    { w: "textbook",         pic: "📘", pos: "noun", kind: "thing",     at: "classroom", say: "It's a textbook.",       ex: "Open your textbook to page ten." },
    { w: "alphabet chart",   pic: "🔤", pos: "noun", kind: "thing",     at: "classroom", say: "It's an alphabet chart.", ex: "The alphabet chart has 26 letters." },
    { w: "worksheet",        pic: "📄", pos: "noun", kind: "thing",     at: "classroom", say: "It's a worksheet.",      ex: "Do the worksheet with your partner." },
    // phòng khoa học (science)
    { w: "beaker",           pic: "🧪", pos: "noun", kind: "tool",      at: "science", say: "It's a beaker.",              ex: "Pour the water into the beaker." },
    { w: "safety goggles",   pic: "🥽", pos: "noun", kind: "thing",     at: "science", say: "They're safety goggles.",     ex: "Wear safety goggles in the lab." },
    { w: "stopwatch",        pic: "⏱️", pos: "noun", kind: "tool",      at: "science", say: "It's a stopwatch.",           ex: "Start the stopwatch when I say go." },
    { w: "prism",            pic: "🔺", pos: "noun", kind: "thing",     at: "science", say: "It's a prism.",               ex: "Light goes through a prism." },
    { w: "measuring cup",    pic: "🥛", pos: "noun", kind: "tool",      at: "science", say: "It's a measuring cup.",       ex: "Use a measuring cup for the water." },
    // góc nghệ thuật (art)
    { w: "paint",            pic: "🎨", pos: "noun", kind: "thing",     at: "art", say: "It's paint.",                     ex: "Blue paint is on the table." },
    { w: "crayon",           pic: "🖍️", pos: "noun", kind: "tool",      at: "art", say: "It's a crayon.",                  ex: "I draw a sun with a yellow crayon." },
    { w: "guitar",           pic: "🎸", pos: "noun", kind: "thing",     at: "art", say: "It's a guitar.",                  ex: "I can play the guitar." },
    { w: "piano",            pic: "🎹", pos: "noun", kind: "thing",     at: "art", say: "It's a piano.",                   ex: "She plays the piano every day." },
    { w: "clay",             pic: "🟫", pos: "noun", kind: "thing",     at: "art", say: "It's clay.",                      ex: "Make a little dog with clay." },
    // tủ đồ (lockers)
    { w: "lunch box",        pic: "🍱", pos: "noun", kind: "thing",     at: "lockers", say: "It's a lunch box.",         ex: "My lunch box has rice and fish." },
    { w: "sports bag",       pic: "👜", pos: "noun", kind: "thing",     at: "lockers", say: "It's a sports bag.",        ex: "Put your shoes in the sports bag." },
    { w: "gym shoes",        pic: "👟", pos: "noun", kind: "thing",     at: "lockers", say: "They're gym shoes.",        ex: "My gym shoes are white." },
    { w: "school uniform",   pic: "👔", pos: "noun", kind: "thing",     at: "lockers", say: "It's a school uniform.",    ex: "Wear your school uniform on Monday." },
    { w: "jacket",           pic: "🧥", pos: "noun", kind: "thing",     at: "lockers", say: "It's a jacket.",            ex: "Hang your jacket in the locker." },
    // căng tin (canteen)
    { w: "bowl",             pic: "🥣", pos: "noun", kind: "thing",     at: "canteen", say: "It's a bowl.",              ex: "Eat your soup from a bowl." },
    { w: "chopsticks",       pic: "🥢", pos: "noun", kind: "tool",      at: "canteen", say: "They're chopsticks.",       ex: "I can use chopsticks well." },
    { w: "rice",             pic: "🍚", pos: "noun", kind: "food",      at: "canteen", say: "It's rice.",                ex: "I eat rice for lunch." },
    { w: "soup",             pic: "🍲", pos: "noun", kind: "food",      at: "canteen", say: "It's soup.",                ex: "The soup is hot, be careful." }
  ],
  // Banh Mi Bakery – tiệm bánh mì (bakery)
  bakery: [
    // lò nướng (oven)
    { w: "oven",             pic: "♨️", pos: "noun", kind: "machine", at: "oven", say: "It's an oven.",            ex: "The oven is hot, so be careful." },
    { w: "baking tray",      pic: "🍳", pos: "noun", kind: "tool",    at: "oven", say: "It's a baking tray.",      ex: "Put the rolls on the baking tray." },
    { w: "rolling pin",      pic: "🪵", pos: "noun", kind: "tool",    at: "oven", say: "It's a rolling pin.",      ex: "Roll the dough with a rolling pin." },
    { w: "mixing bowl",      pic: "🥣", pos: "noun", kind: "thing",   at: "oven", say: "It's a mixing bowl.",      ex: "Mix the flour in a big mixing bowl." },
    { w: "timer",            pic: "⏲️", pos: "noun", kind: "tool",    at: "oven", say: "It's a timer.",            ex: "The timer rings when the bread is ready." },
    // tủ kính bánh (display)
    { w: "glass display case", pic: "🪟", pos: "noun", kind: "thing", at: "display", say: "It's a glass display case.", ex: "The cakes are in the glass display case." },
    { w: "custard tart",     pic: "🥧", pos: "noun", kind: "food",    at: "display", say: "It's a custard tart.",     ex: "This custard tart is sweet and soft." },
    { w: "chocolate muffin", pic: "🍫", pos: "noun", kind: "food",    at: "display", say: "It's a chocolate muffin.", ex: "I'd like a chocolate muffin, please." },
    { w: "strawberry tart",  pic: "🍓", pos: "noun", kind: "food",    at: "display", say: "It's a strawberry tart.",  ex: "The strawberry tart looks delicious." },
    { w: "bagel",            pic: "🥯", pos: "noun", kind: "food",    at: "display", say: "It's a bagel.",            ex: "A bagel is round and a little chewy." },
    { w: "apple pie",        pic: "🍎", pos: "noun", kind: "food",    at: "display", say: "It's an apple pie.",       ex: "Apple pie is my favourite dessert." },
    // kệ bánh mì (shelf)
    { w: "banh mi",          pic: "🥖", pos: "noun", kind: "food",    at: "shelf", say: "It's a banh mi.",            ex: "A banh mi has meat and vegetables." },
    { w: "baguette",         pic: "🥖", pos: "noun", kind: "food",    at: "shelf", say: "It's a baguette.",           ex: "The baguette is long and crispy." },
    { w: "sliced bread",     pic: "🍞", pos: "noun", kind: "food",    at: "shelf", say: "It's sliced bread.",         ex: "Sliced bread is good for breakfast." },
    { w: "bread basket",     pic: "🧺", pos: "noun", kind: "thing",   at: "shelf", say: "It's a bread basket.",       ex: "The bread basket is full of rolls." },
    { w: "bread roll",       pic: "🍞", pos: "noun", kind: "food",    at: "shelf", say: "It's a bread roll.",         ex: "I eat one bread roll for breakfast." },
    // bàn ngồi (table)
    { w: "plate",            pic: "🍽️", pos: "noun", kind: "thing",   at: "table", say: "It's a plate.",              ex: "The bread is on a white plate." },
    { w: "fork",             pic: "🍴", pos: "noun", kind: "tool",    at: "table", say: "It's a fork.",               ex: "Use a fork to eat the cake." },
    { w: "butter",           pic: "🧈", pos: "noun", kind: "food",    at: "table", say: "It's butter.",               ex: "Put some butter on the bread." },
    { w: "high chair",       pic: "🪑", pos: "noun", kind: "furniture", at: "table", say: "It's a high chair.",       ex: "The baby sits in a high chair." }
  ],
  // Pho Corner – quán phở (restaurant)
  restaurant: [
    // bếp mở (kitchen)
    { w: "stove",            pic: "🔥", pos: "noun", kind: "machine", at: "kitchen", say: "It's a stove.",           ex: "The soup is cooking on the stove." },
    { w: "big pot",          pic: "🍲", pos: "noun", kind: "thing",   at: "kitchen", say: "It's a big pot.",         ex: "The broth is in a big pot." },
    { w: "ladle",            pic: "🥄", pos: "noun", kind: "tool",    at: "kitchen", say: "It's a ladle.",           ex: "Use a ladle to serve the soup." },
    { w: "noodles",          pic: "🍜", pos: "noun", kind: "food",    at: "kitchen", say: "They're noodles.",        ex: "The noodles are soft and hot." },
    { w: "beef",             pic: "🥩", pos: "noun", kind: "food",    at: "kitchen", say: "It's beef.",              ex: "Pho has thin slices of beef." },
    { w: "bean sprouts",     pic: "🌱", pos: "noun", kind: "food",    at: "kitchen", say: "They're bean sprouts.",   ex: "Bean sprouts are crunchy and fresh." },
    // bàn ăn có gia vị (table)
    { w: "spring roll",      pic: "🥟", pos: "noun", kind: "food",    at: "table", say: "It's a spring roll.",       ex: "I'd like one spring roll, please." },
    { w: "soup spoon",       pic: "🥄", pos: "noun", kind: "tool",    at: "table", say: "It's a soup spoon.",        ex: "Use a soup spoon for the broth." },
    { w: "lime",             pic: "🍋", pos: "noun", kind: "food",    at: "table", say: "It's a lime.",              ex: "Squeeze a lime over your soup." },
    { w: "chilli",           pic: "🌶️", pos: "noun", kind: "food",    at: "table", say: "It's a chilli.",            ex: "This chilli is very hot!" },
    { w: "fish sauce",       pic: "🫙", pos: "noun", kind: "food",    at: "table", say: "It's fish sauce.",          ex: "Add a little fish sauce, please." },
    { w: "salt",             pic: "🧂", pos: "noun", kind: "thing",   at: "table", say: "It's salt.",                ex: "Pass me the salt, please." },
    // tủ đồ uống (drinks)
    { w: "lemon tea",        pic: "🍋", pos: "noun", kind: "drink",   at: "drinks", say: "It's lemon tea.",          ex: "Lemon tea is cold and sweet." },
    { w: "sugarcane juice",  pic: "🥤", pos: "noun", kind: "drink",   at: "drinks", say: "It's sugarcane juice.",    ex: "Sugarcane juice is sweet and cold." },
    { w: "soy milk",         pic: "🥛", pos: "noun", kind: "drink",   at: "drinks", say: "It's soy milk.",           ex: "I drink soy milk for breakfast." },
    { w: "coconut water",    pic: "🥥", pos: "noun", kind: "drink",   at: "drinks", say: "It's coconut water.",      ex: "Coconut water is good on a hot day." },
    // tường treo đèn lồng, thực đơn (wall)
    { w: "paper lantern",    pic: "🏮", pos: "noun", kind: "thing",   at: "wall", say: "It's a paper lantern.",      ex: "The red paper lantern is very pretty." },
    { w: "price list",       pic: "🏷️", pos: "noun", kind: "thing",   at: "wall", say: "It's a price list.",         ex: "Look at the price list first." },
    { w: "photo frame",      pic: "🖼️", pos: "noun", kind: "thing",   at: "wall", say: "It's a photo frame.",        ex: "A photo frame hangs on the wall." },
    { w: "mirror",           pic: "🪞", pos: "noun", kind: "thing",   at: "wall", say: "It's a mirror.",             ex: "Check your hair in the mirror." }
  ],
  // Shop 24h – cửa hàng tiện lợi (supermarket)
  supermarket: [
    // tủ lạnh đồ uống (fridge)
    { w: "fridge",           pic: "🧊", pos: "noun", kind: "machine", at: "fridge", say: "It's a fridge.",          ex: "The milk is in the fridge." },
    { w: "yogurt",           pic: "🥛", pos: "noun", kind: "food",    at: "fridge", say: "It's yogurt.",            ex: "I have yogurt for breakfast." },
    { w: "orange juice",     pic: "🍊", pos: "noun", kind: "drink",   at: "fridge", say: "It's orange juice.",      ex: "Orange juice is cold and sweet." },
    { w: "soda",             pic: "🥤", pos: "noun", kind: "drink",   at: "fridge", say: "It's soda.",              ex: "Soda is fizzy and very cold." },
    { w: "cheese",           pic: "🧀", pos: "noun", kind: "food",    at: "fridge", say: "It's cheese.",            ex: "Cheese is good in sandwiches." },
    // kệ snack (snacks)
    { w: "crisps",           pic: "🥔", pos: "noun", kind: "food",    at: "snacks", say: "They're crisps.",         ex: "I like crisps after school." },
    { w: "chocolate bar",    pic: "🍫", pos: "noun", kind: "food",    at: "snacks", say: "It's a chocolate bar.",   ex: "This chocolate bar is my favourite." },
    { w: "biscuit",          pic: "🍪", pos: "noun", kind: "food",    at: "snacks", say: "It's a biscuit.",         ex: "The biscuit is crunchy and sweet." },
    { w: "popcorn",          pic: "🍿", pos: "noun", kind: "food",    at: "snacks", say: "It's popcorn.",           ex: "We eat popcorn at the cinema." },
    { w: "candy",            pic: "🍬", pos: "noun", kind: "food",    at: "snacks", say: "It's candy.",             ex: "Candy is sweet, but don't eat too much." },
    { w: "gum",              pic: "🫧", pos: "noun", kind: "thing",   at: "snacks", say: "It's gum.",               ex: "Don't chew gum in class." },
    // quầy trái cây (fruit)
    { w: "mango",            pic: "🥭", pos: "noun", kind: "food",    at: "fruit", say: "It's a mango.",            ex: "The mango is sweet and yellow." },
    { w: "grapes",           pic: "🍇", pos: "noun", kind: "food",    at: "fruit", say: "They're grapes.",          ex: "Grapes are small and green." },
    { w: "pear",             pic: "🍐", pos: "noun", kind: "food",    at: "fruit", say: "It's a pear.",             ex: "I eat a pear every day." },
    { w: "pineapple",        pic: "🍍", pos: "noun", kind: "food",    at: "fruit", say: "It's a pineapple.",        ex: "Pineapple is sweet and a little sour." },
    { w: "watermelon",       pic: "🍉", pos: "noun", kind: "food",    at: "fruit", say: "It's a watermelon.",       ex: "Watermelon is very juicy in summer." },
    // quầy tính tiền (counter)
    { w: "shopping basket",  pic: "🧺", pos: "noun", kind: "thing",   at: "counter", say: "It's a shopping basket.",  ex: "Put your snacks in the shopping basket." },
    { w: "plastic bag",      pic: "🛍️", pos: "noun", kind: "thing",   at: "counter", say: "It's a plastic bag.",      ex: "Do you need a plastic bag?" },
    { w: "shopping list",    pic: "📝", pos: "noun", kind: "thing",   at: "counter", say: "It's a shopping list.",    ex: "Check your shopping list before you pay." },
    { w: "barcode scanner",  pic: "📟", pos: "noun", kind: "machine", at: "counter", say: "It's a barcode scanner.",  ex: "The barcode scanner beeps when it works." }
  ],
  // Green Cross Pharmacy – nhà thuốc (pharmacy)
  pharmacy: [
    // quầy thuốc (counter)
    { w: "prescription",     pic: "📄", pos: "noun", kind: "thing",   at: "counter", say: "It's a prescription.",     ex: "The doctor writes a prescription for you." },
    { w: "pill box",         pic: "💊", pos: "noun", kind: "thing",   at: "counter", say: "It's a pill box.",         ex: "Keep your pills in a pill box." },
    { w: "capsule",          pic: "💊", pos: "noun", kind: "thing",   at: "counter", say: "It's a capsule.",          ex: "Only take a capsule when an adult says so." },
    { w: "measuring spoon",  pic: "🥄", pos: "noun", kind: "tool",    at: "counter", say: "It's a measuring spoon.",  ex: "Use the measuring spoon for the syrup." },
    { w: "medicine label",   pic: "🏷️", pos: "noun", kind: "thing",   at: "counter", say: "It's a medicine label.",   ex: "Always read the label before you take medicine." },
    // kệ thuốc (shelf)
    { w: "plasters",         pic: "🩹", pos: "noun", kind: "thing",   at: "shelf", say: "They're plasters.",          ex: "Put a plaster on the small cut." },
    { w: "cotton wool",      pic: "☁️", pos: "noun", kind: "thing",   at: "shelf", say: "It's cotton wool.",          ex: "Clean the cut with cotton wool." },
    { w: "gauze",            pic: "🧻", pos: "noun", kind: "thing",   at: "shelf", say: "It's gauze.",                ex: "Wrap the cut with gauze, gently." },
    { w: "ointment",         pic: "🧴", pos: "noun", kind: "thing",   at: "shelf", say: "It's an ointment.",          ex: "Put this ointment on the bite." },
    { w: "hand sanitiser",   pic: "🧴", pos: "noun", kind: "thing",   at: "shelf", say: "It's hand sanitiser.",       ex: "Use hand sanitiser before you eat." },
    { w: "ice pack",         pic: "🧊", pos: "noun", kind: "thing",   at: "shelf", say: "It's an ice pack.",          ex: "Put an ice pack on your head." },
    // góc chăm sóc cá nhân (care)
    { w: "toothpaste",       pic: "🪥", pos: "noun", kind: "thing",   at: "care", say: "It's toothpaste.",            ex: "Use a little toothpaste on your brush." },
    { w: "toothbrush",       pic: "🪥", pos: "noun", kind: "thing",   at: "care", say: "It's a toothbrush.",          ex: "My toothbrush is blue." },
    { w: "shampoo",          pic: "🧴", pos: "noun", kind: "thing",   at: "care", say: "It's shampoo.",               ex: "This shampoo smells like lemon." },
    { w: "soap",             pic: "🧼", pos: "noun", kind: "thing",   at: "care", say: "It's soap.",                  ex: "Wash your hands with soap." },
    { w: "sunscreen",        pic: "🧴", pos: "noun", kind: "thing",   at: "care", say: "It's sunscreen.",             ex: "Wear sunscreen when it is sunny." },
    // góc sức khoẻ (health)
    { w: "scales",           pic: "⚖️", pos: "noun", kind: "machine", at: "health", say: "They're scales.",          ex: "Stand on the scales, please." },
    { w: "blood pressure monitor", pic: "🩺", pos: "noun", kind: "machine", at: "health", say: "It's a blood pressure monitor.", ex: "The nurse uses a blood pressure monitor." },
    { w: "first aid kit",    pic: "🧰", pos: "noun", kind: "thing",   at: "health", say: "It's a first aid kit.",    ex: "The first aid kit is in the cupboard." },
    { w: "health chart",     pic: "📊", pos: "noun", kind: "thing",   at: "health", say: "It's a health chart.",     ex: "The health chart shows healthy food." }
  ],
  // Clothes Shop – shop quần áo (clothes)
  clothes: [
    // giá treo quần áo (rack)
    { w: "clothes rack",     pic: "👚", pos: "noun", kind: "furniture", at: "rack", say: "It's a clothes rack.",       ex: "The shirts are on the clothes rack." },
    { w: "T-shirt",          pic: "👕", pos: "noun", kind: "thing",     at: "rack", say: "It's a T-shirt.",            ex: "This T-shirt is blue and very soft." },
    { w: "coat",             pic: "🧥", pos: "noun", kind: "thing",     at: "rack", say: "It's a coat.",               ex: "Wear a coat when it’s cold." },
    { w: "dress",            pic: "👗", pos: "noun", kind: "thing",     at: "rack", say: "It's a dress.",              ex: "The yellow dress is very pretty." },
    { w: "skirt",            pic: "👗", pos: "noun", kind: "thing",     at: "rack", say: "It's a skirt.",              ex: "I like this long skirt." },
    { w: "sweater",          pic: "🧶", pos: "noun", kind: "thing",     at: "rack", say: "It's a sweater.",            ex: "A warm sweater is good in winter." },
    // kệ giày (shoes)
    { w: "sneakers",         pic: "👟", pos: "noun", kind: "thing",     at: "shoes", say: "They're sneakers.",         ex: "My sneakers are white and new." },
    { w: "sandals",          pic: "🩴", pos: "noun", kind: "thing",     at: "shoes", say: "They're sandals.",          ex: "Sandals are cool in summer." },
    { w: "boots",            pic: "🥾", pos: "noun", kind: "thing",     at: "shoes", say: "They're boots.",            ex: "The boots keep my feet warm." },
    { w: "high heels",       pic: "👠", pos: "noun", kind: "thing",     at: "shoes", say: "They're high heels.",       ex: "High heels are hard to walk in." },
    { w: "shoe box",         pic: "📦", pos: "noun", kind: "thing",     at: "shoes", say: "It's a shoe box.",          ex: "Put the shoes back in the shoe box." },
    // gương & phòng thử (mirror)
    { w: "full-length mirror", pic: "🪞", pos: "noun", kind: "thing",   at: "mirror", say: "It's a full-length mirror.", ex: "Look at yourself in the full-length mirror." },
    { w: "fitting room",     pic: "🚪", pos: "noun", kind: "thing",     at: "mirror", say: "It's a fitting room.",       ex: "Try it on in the fitting room." },
    { w: "curtain",          pic: "🪟", pos: "noun", kind: "thing",     at: "mirror", say: "It's a curtain.",            ex: "Close the curtain, please." },
    { w: "hanger",           pic: "🪝", pos: "noun", kind: "thing",     at: "mirror", say: "It's a hanger.",             ex: "Hang your coat on a hanger." },
    // quầy thu ngân (counter)
    { w: "cash desk",        pic: "💵", pos: "noun", kind: "machine",   at: "counter", say: "It's a cash desk.",         ex: "Pay for your clothes at the cash desk." },
    { w: "size label",       pic: "🏷️", pos: "noun", kind: "thing",     at: "counter", say: "It's a size label.",        ex: "Check the size label before you buy." },
    { w: "bill",             pic: "🧾", pos: "noun", kind: "thing",     at: "counter", say: "It's a bill.",              ex: "Keep the bill, please." },
    { w: "shopping bag",     pic: "🛍️", pos: "noun", kind: "thing",     at: "counter", say: "It's a shopping bag.",      ex: "Do you need a shopping bag?" },
    { w: "purse",            pic: "👛", pos: "noun", kind: "thing",     at: "counter", say: "It's a purse.",             ex: "Keep your money safe in your purse." }
  ],
  // Saigon Barber – tiệm cắt tóc (salon)
  salon: [
    // ghế cắt tóc (chair)
    { w: "barber chair",     pic: "💺", pos: "noun", kind: "furniture", at: "chair", say: "It's a barber chair.",      ex: "Sit in the barber chair, please." },
    { w: "hair cape",        pic: "🧣", pos: "noun", kind: "thing",     at: "chair", say: "It's a hair cape.",         ex: "Put the hair cape on, please." },
    { w: "hair dryer",       pic: "💨", pos: "noun", kind: "machine",   at: "chair", say: "It's a hair dryer.",        ex: "The hair dryer is hot, so be careful." },
    { w: "hair scissors",    pic: "✂️", pos: "noun", kind: "tool",      at: "chair", say: "They're hair scissors.",    ex: "Be careful with the hair scissors." },
    { w: "comb",             pic: "🪮", pos: "noun", kind: "tool",      at: "chair", say: "It's a comb.",              ex: "Use a comb to make your hair neat." },
    { w: "hair clippers",    pic: "✂️", pos: "noun", kind: "machine",   at: "chair", say: "They're hair clippers.",    ex: "The hair clippers buzz when they work." },
    // bồn gội đầu (wash)
    { w: "wash basin",       pic: "🛁", pos: "noun", kind: "thing",     at: "wash", say: "It's a wash basin.",         ex: "Lean back over the wash basin." },
    { w: "shower head",      pic: "🚿", pos: "noun", kind: "thing",     at: "wash", say: "It's a shower head.",        ex: "The water comes from the shower head." },
    { w: "towel",            pic: "🧻", pos: "noun", kind: "thing",     at: "wash", say: "It's a towel.",              ex: "Dry your hair with a soft towel." },
    { w: "conditioner",      pic: "🧴", pos: "noun", kind: "thing",     at: "wash", say: "It's conditioner.",          ex: "Use conditioner after you wash your hair." },
    // kệ sản phẩm (products)
    { w: "hair gel",         pic: "🧴", pos: "noun", kind: "thing",     at: "products", say: "It's hair gel.",         ex: "Put a little hair gel on your hair." },
    { w: "hair spray",       pic: "🧴", pos: "noun", kind: "thing",     at: "products", say: "It's hair spray.",       ex: "Hair spray keeps my hair in place." },
    { w: "hair clip",        pic: "📎", pos: "noun", kind: "thing",     at: "products", say: "It's a hair clip.",      ex: "This hair clip is pink and pretty." },
    { w: "hair band",        pic: "🎀", pos: "noun", kind: "thing",     at: "products", say: "It's a hair band.",      ex: "She wears a red hair band." },
    { w: "hairbrush",        pic: "🪮", pos: "noun", kind: "tool",      at: "products", say: "It's a hairbrush.",      ex: "Brush your hair every morning." },
    // ghế chờ gần cửa (waiting)
    { w: "wall clock",       pic: "🕐", pos: "noun", kind: "thing",     at: "waiting", say: "It's a wall clock.",      ex: "The wall clock shows it’s ten o’clock." },
    { w: "number ticket",    pic: "🎫", pos: "noun", kind: "thing",     at: "waiting", say: "It's a number ticket.",   ex: "Take a number ticket and wait, please." },
    { w: "hairstyle book",   pic: "📖", pos: "noun", kind: "thing",     at: "waiting", say: "It's a hairstyle book.",  ex: "Look at the hairstyle book for ideas." },
    { w: "photo album",      pic: "📒", pos: "noun", kind: "thing",     at: "waiting", say: "It's a photo album.",     ex: "The photo album has many hairstyles." },
    { w: "ceiling fan",      pic: "🌀", pos: "noun", kind: "machine",   at: "waiting", say: "It's a ceiling fan.",     ex: "The ceiling fan is cool on a hot day." }
  ],
  // Home & Cozy – cửa hàng nội thất (furniture)
  furniture: [
    // góc phòng khách (living)
    { w: "armchair",         pic: "🛋️", pos: "noun", kind: "furniture", at: "living", say: "It's an armchair.",        ex: "Grandpa reads a book in the armchair." },
    { w: "coffee table",     pic: "🪵", pos: "noun", kind: "furniture", at: "living", say: "It's a coffee table.",     ex: "Put your cup on the coffee table." },
    { w: "rug",              pic: "🟫", pos: "noun", kind: "thing",     at: "living", say: "It's a rug.",              ex: "The rug is soft under my feet." },
    { w: "TV",               pic: "📺", pos: "noun", kind: "machine",   at: "living", say: "It's a TV.",               ex: "We watch a film on TV after dinner." },
    { w: "beanbag",          pic: "🔴", pos: "noun", kind: "thing",     at: "living", say: "It's a beanbag.",          ex: "Sit on the beanbag and read." },
    { w: "floor lamp",       pic: "💡", pos: "noun", kind: "thing",     at: "living", say: "It's a floor lamp.",       ex: "Turn on the floor lamp, please." },
    // góc phòng ngủ (bedroom)
    { w: "double bed",       pic: "🛏️", pos: "noun", kind: "furniture", at: "bedroom", say: "It's a double bed.",      ex: "We have a big double bed." },
    { w: "bedside table",    pic: "🪑", pos: "noun", kind: "furniture", at: "bedroom", say: "It's a bedside table.",   ex: "Put the clock on the bedside table." },
    { w: "wardrobe",         pic: "🚪", pos: "noun", kind: "furniture", at: "bedroom", say: "It's a wardrobe.",        ex: "My clothes are in the wardrobe." },
    { w: "pillow",           pic: "🛌", pos: "noun", kind: "thing",     at: "bedroom", say: "It's a pillow.",          ex: "Rest your head on the soft pillow." },
    { w: "duvet",            pic: "🛏️", pos: "noun", kind: "thing",     at: "bedroom", say: "It's a duvet.",           ex: "The duvet is warm and soft at night." },
    // góc bếp và bàn ăn (kitchen)
    { w: "dining table",     pic: "🍽️", pos: "noun", kind: "furniture", at: "kitchen", say: "It's a dining table.",    ex: "We eat dinner at the dining table." },
    { w: "dining chair",     pic: "🪑", pos: "noun", kind: "furniture", at: "kitchen", say: "It's a dining chair.",    ex: "Sit on the dining chair, please." },
    { w: "kitchen cabinet",  pic: "🗄️", pos: "noun", kind: "furniture", at: "kitchen", say: "It's a kitchen cabinet.", ex: "The cups are in the kitchen cabinet." },
    { w: "microwave",        pic: "🍱", pos: "noun", kind: "machine",   at: "kitchen", say: "It's a microwave.",       ex: "Heat the soup in the microwave." },
    { w: "teapot",           pic: "🫖", pos: "noun", kind: "thing",     at: "kitchen", say: "It's a teapot.",          ex: "The teapot keeps the tea hot." },
    // đồ trang trí (decor)
    { w: "picture",          pic: "🖼️", pos: "noun", kind: "thing",     at: "decor", say: "It's a picture.",           ex: "This picture is of the beach." },
    { w: "flower pot",       pic: "🪴", pos: "noun", kind: "plant",     at: "decor", say: "It's a flower pot.",        ex: "The flower pot sits by the window." },
    { w: "cactus",           pic: "🌵", pos: "noun", kind: "plant",     at: "decor", say: "It's a cactus.",            ex: "A cactus needs very little water." },
    { w: "table lamp",       pic: "🪔", pos: "noun", kind: "thing",     at: "decor", say: "It's a table lamp.",        ex: "Turn on the table lamp at night." }
  ]

};
