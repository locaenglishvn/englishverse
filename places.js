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
  { id: "bakery", name: "Banh Mi Bakery", type: "bakery", x: 56, z: -10, w: 10, d: 10, door: "south", exterior: "banhmi",
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
  { id: "townhall", name: "Town Hall", type: "townhall", x: 0, z: -44, w: 32, d: 13, door: "south", exterior: "townhall",
    color: 0xf1f3f5, roof: 0x495057, awning: 0x1c7ed6, floor: 0xc9a27e, wall: 0xf8f0e3,
    keeper: { name: "Mr. Lee – Mayor", color: 0x343a40, greet: "Welcome to Town Hall! The quest board will open soon.", hint: "I'd like to take a quest." },
    sells: [] },
  { id: "hospital", name: "City Hospital", type: "hospital", x: -62, z: -40, w: 20, d: 11, door: "east", exterior: "hospital",
    color: 0xffffff, roof: 0xc92a2a, awning: 0xfa5252, floor: 0xe7f5ff, wall: 0xffffff,
    keeper: { name: "Nurse Mai", color: 0x74c0fc, greet: "Hello! Doctor Pasteur is working in his lab. He will need your help soon.", hint: "I feel sick." },
    sells: [] },
  { id: "cafe", name: "Cafe Sua Da", type: "cafe", x: -32, z: 0, w: 19, d: 10, door: "east", exterior: "cafe",
    color: 0xfff1e0, roof: 0xd62828, awning: 0xe8590c, floor: 0xe9d8b4, wall: 0xfff4e6,
    keeper: null,   // không có người bán: Mia (trong lessons.js) đứng sau quầy và nói chuyện với khách
    sells: [] },
  /* --- Các địa điểm mới (ngoại thất tạm dùng mô hình nhà phố, sẽ thay sau) ---
     layout = kiểu bày nội thất: shop | tables | shelves | desks | museum | cinema | salon | lab | home
     goods  = đồ trưng bày (emoji). NPC hội thoại của từng nơi nằm trong lessons.js (place: "id"). */
  // Hàng phía bắc (cửa nhìn ra North Avenue)
  { id: "school", name: "Verse School", type: "school", x: -82, z: -14, w: 24, d: 18, door: "south", exterior: "school", layout: "desks",
    color: 0xfff3bf, roof: 0x1971c2, awning: 0xfab005, floor: 0xd9b38c, wall: 0xfff9db, goods: ["📚", "✏️", "📐", "🌍", "🎒", "🧮"], keeper: null, sells: [] },
  { id: "museum", name: "City Museum", type: "museum", x: -35, z: 40, w: 26, d: 12, door: "east", exterior: "museum", layout: "museum",
    color: 0xf1f3f5, roof: 0x5c5f66, awning: 0x868e96, floor: 0xe9ecef, wall: 0xf8f9fa, goods: ["🦖", "🏺", "🗿", "⚱️", "🦴", "👑"], keeper: null, sells: [] },
  { id: "library", name: "Verse Library", type: "library", x: 35, z: 40, w: 20, d: 12, door: "west", exterior: "library", layout: "shelves",
    color: 0xe7f5ff, roof: 0x364fc7, awning: 0x4c6ef5, floor: 0xc9a27e, wall: 0xf3f0ff, goods: ["📕", "📗", "📘", "📙", "📖", "📚"], keeper: null, sells: [] },
  { id: "bank", name: "Verse Bank", type: "bank", x: 33, z: -40, w: 20, d: 14, door: "west", exterior: "bank", layout: "desks",
    color: 0xf8f9fa, roof: 0x2b8a3e, awning: 0x2f9e44, floor: 0xdee2e6, wall: 0xf1f3f5, goods: ["💰", "💳", "🪙", "💵", "🏦", "📈"], keeper: null, sells: [] },
  { id: "post", name: "Post Office", type: "post office", x: -33, z: -40, w: 16, d: 12, door: "east", exterior: "post", layout: "shop",
    color: 0xfff4e6, roof: 0xe8590c, awning: 0xfd7e14, floor: 0xe9d8b4, wall: 0xfff4e6, goods: ["📮", "✉️", "📦", "📬", "🏷️", "📫"], keeper: null, sells: [] },
  { id: "lab", name: "Science Lab", type: "science lab", x: -75, z: -112, w: 12, d: 12, door: "south", model: "building_F", scale: 6, layout: "lab",
    color: 0xe3fafc, roof: 0x0b7285, awning: 0x15aabf, floor: 0xdee2e6, wall: 0xf8f9fa, goods: ["🧪", "🔬", "🧫", "🧲", "🔭", "⚗️"], keeper: null, sells: [] },
  // Hàng giữa (cửa nhìn ra Market Street)
  { id: "furniture", name: "Home & Cozy", type: "furniture store", x: 120, z: -10, w: 10, d: 10, door: "south", exterior: "furniture", layout: "showroom",
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
  { id: "mall", name: "Verse Plaza", type: "shopping mall", x: 85, z: 18, w: 24, d: 20, door: "north", exterior: "mall", layout: "shop",
    color: 0xf1f3f5, roof: 0x748ffc, awning: 0x4c6ef5, floor: 0xf1f3f5, wall: 0xf8f9fa, goods: ["🛍️", "👟", "🎮", "📱", "🧸", "⌚"], keeper: null, sells: [] },
  // Hàng phía nam (cửa nhìn lên Market Street)
  { id: "home", name: "My Home", type: "home", x: -125, z: -14, w: 12, d: 11, door: "south", exterior: "home", layout: "home",
    color: 0xfff4e6, roof: 0xd9480f, awning: 0xfd7e14, floor: 0xd9b38c, wall: 0xfff8f0, keeper: null, sells: [] },
  { id: "cinema", name: "Star Cinema", type: "cinema", x: 60, z: 11, w: 12, d: 12, door: "north", model: "building_H", scale: 6, layout: "cinema",
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

