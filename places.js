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
  vaccine:    { name: "Voice vaccine", icon: "💉", price: 25, cure: true, protect: 300, desc: "Cures poison and protects you for 5 minutes." }
};

/* Quà cho người chơi mới */
const STARTER = { coins: 20, items: { banhmi: 1 } };

/* ĐỊA ĐIỂM TRONG THÀNH PHỐ (nhà có mái, đi vào được)
   x, z   = vị trí giữa tòa nhà trên bản đồ;  w, d = rộng, sâu (mét)
   door   = cửa quay về hướng nào: "south" (xuống), "north" (lên), "east", "west"
   color/roof/awning = màu tường / mái / mái hiên
   keeper = người bán: tên, màu áo, câu chào, câu gợi ý cho người chơi nói
   sells  = các món bán (id trong ITEMS ở trên). Để trống [] nếu chưa bán gì */
const CITY = [
  { id: "bakery", name: "Golden Bakery", type: "bakery", x: -26, z: 4, w: 10, d: 7, door: "south",
    color: 0xffe8cc, roof: 0xc0392b, awning: 0xe67e22, floor: 0xe9c99a, wall: 0xfff4e0,
    keeper: { name: "Anna – Baker", color: 0xf08c00, greet: "Good morning! Everything is fresh today. What would you like?", hint: "Can I have a banh mi, please?" },
    sells: ["banhmi", "donut", "milk"] },
  { id: "pharmacy", name: "Green Cross Pharmacy", type: "pharmacy", x: 26, z: 4, w: 10, d: 7, door: "south",
    color: 0xe6fcf5, roof: 0x2b8a3e, awning: 0x37b24d, floor: 0xdee2e6, wall: 0xf8f9fa,
    keeper: { name: "Sam – Pharmacist", color: 0x1c7ed6, greet: "Hello! How are you feeling today?", hint: "I have a sore throat. Can I have some throat syrup?" },
    sells: ["syrup", "vaccine"] },
  { id: "clothes", name: "Style Box", type: "clothes", x: -42, z: 4, w: 10, d: 7, door: "south",
    color: 0xfff0f6, roof: 0x9c36b5, awning: 0xe64980, floor: 0xf1e3d3, wall: 0xfff5f9,
    keeper: { name: "Kim – Designer", color: 0xe64980, greet: "Hi! New clothes are arriving soon. Come back later!", hint: "Can I try this on?" },
    sells: [] },
  { id: "townhall", name: "Town Hall", type: "townhall", x: 0, z: -26, w: 16, d: 10, door: "south",
    color: 0xf1f3f5, roof: 0x495057, awning: 0x1c7ed6, floor: 0xc9a27e, wall: 0xf8f0e3,
    keeper: { name: "Mr. Lee – Mayor", color: 0x343a40, greet: "Welcome to Town Hall! The quest board will open soon.", hint: "I'd like to take a quest." },
    sells: [] },
  { id: "hospital", name: "City Hospital", type: "hospital", x: 44, z: 36, w: 14, d: 10, door: "north",
    color: 0xffffff, roof: 0xc92a2a, awning: 0xfa5252, floor: 0xe7f5ff, wall: 0xffffff,
    keeper: { name: "Nurse Mai", color: 0x74c0fc, greet: "Hello! Doctor Pasteur is working in his lab. He will need your help soon.", hint: "I feel sick." },
    sells: [] }
];
