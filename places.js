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
