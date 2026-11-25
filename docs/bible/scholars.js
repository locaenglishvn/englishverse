/* DANH NHÂN – chuỗi nhiệm vụ "Khôi phục tri thức" (đề xuất 25/11, chờ chủ dự án duyệt) – sửa nội dung trực tiếp ở đây.
   Cốt truyện: tướng Oblivia xoá khoa học của nhân loại. Khi Babel Tower đủ mạnh, The Knowledge Collector gọi linh hồn danh nhân về.
   Mỗi nhiệm vụ = 1 phát minh / thành tựu thật của danh nhân đó. Làm xong: trang tri thức + một phần công trình + (có khi) kỹ năng.
   Luật nội dung: đúng lịch sử, không bịa trích dẫn, chỉ người đã mất, không nhân vật chính trị. "(truyện kể)" = giai thoại, không phải sự thật chắc chắn.
   lv = cấp tối thiểu · need = điều kiện thêm · where = công trình được khôi phục. */
window.SCHOLAR_CHAPTERS = [
  { n: 1, name: "Nền móng", lv: "Lv.10–20", need: "Gặp The Knowledge Collector ở Grand Archive" },
  { n: 2, name: "Năng lượng & di chuyển", lv: "Lv.22–40", need: "Xong ít nhất 6 danh nhân chương 1" },
  { n: 3, name: "Sự sống, máy tính & sóng", lv: "Lv.42–58", need: "Power Plant đã sáng đèn (Faraday + Edison + Tesla)" },
  { n: 4, name: "Tri thức từ các vùng đất", lv: "Lv.62–92", need: "Giải phóng khu văn hoá tương ứng" }
];
window.SCHOLARS = [
  /* ---------- CHƯƠNG 1 · NỀN MÓNG ---------- */
  { ch: 1, name: "Lương Thế Vinh", years: "1441–1496", from: "🇻🇳 Việt Nam", field: "Toán học", lv: 10, where: "Verse School", reward: "Kỹ năng Đo đạc: xem khoảng cách trên bản đồ",
    quests: ["Trạng Lường: đọc sách toán \"Đại thành toán pháp\"", "Cân voi bằng thuyền (truyện kể)", "Đo ruộng, tính diện tích"] },
  { ch: 1, name: "Archimedes", years: "~287–212 TCN", from: "Hy Lạp cổ (Syracuse)", field: "Cơ học", lv: 11, where: "Bến cảng / Fix-It Workshop", reward: "Mở cần cẩu ở bến cảng",
    quests: ["Đòn bẩy: nâng tảng đá nặng", "Ròng rọc: kéo thuyền lên bờ", "Vì sao thuyền nổi? (nguyên lý vật nổi, \"Eureka!\" là truyện kể)"] },
  { ch: 1, name: "Mary Anning", years: "1799–1847", from: "Anh", field: "Hoá thạch", lv: 12, where: "Bảo tàng (cạnh Dr. Rex)", reward: "Đồ trưng bày hoá thạch trong nhà riêng",
    quests: ["Bộ xương ngư long (ichthyosaur) tìm thấy khi mới khoảng 12 tuổi", "Hoá thạch thằn lằn cổ dài (plesiosaur)", "Đọc các lớp đá ở vách biển"] },
  { ch: 1, name: "George Washington Carver", years: "~1864–1943", from: "Mỹ", field: "Nông nghiệp", lv: 13, where: "Nông trại", reward: "Kỹ năng Trồng trọt (vòng chơi hằng ngày)",
    quests: ["Luân canh: trồng xen để đất khoẻ lại", "Hàng trăm sản phẩm từ cây lạc", "Dạy nông dân bằng xe lưu động"] },
  { ch: 1, name: "Isaac Newton", years: "1643–1727", from: "Anh", field: "Vật lý", lv: 14, where: "Science Lab", reward: "Trang tri thức: lực hấp dẫn",
    quests: ["Quả táo rơi và lực hấp dẫn (truyện kể)", "Lăng kính tách ánh sáng trắng thành cầu vồng", "Ba định luật chuyển động"] },
  { ch: 1, name: "Alexander Graham Bell", years: "1847–1922", from: "Scotland → Mỹ", field: "Truyền âm", lv: 15, where: "Bưu điện", reward: "Mở gọi điện giữa các toà nhà",
    quests: ["Chiếc điện thoại đầu tiên (1876)", "Truyền giọng nói qua dây điện", "Dạy người khiếm thính giao tiếp"] },
  { ch: 1, name: "Galileo Galilei", years: "1564–1642", from: "Ý", field: "Thiên văn", lv: 16, where: "Đài thiên văn", reward: "Mở bầu trời sao ban đêm",
    quests: ["Làm kính thiên văn (1609)", "Mặt Trăng có núi và hố", "Bốn mặt trăng của sao Mộc", "Con lắc đong đưa đều nhịp"] },
  { ch: 1, name: "Johannes Gutenberg", years: "~1400–1468", from: "Đức", field: "In ấn", lv: 18, where: "Thư viện / xưởng in", reward: "Sổ thẻ in thành sách, trưng bày trong nhà",
    quests: ["Chữ rời bằng kim loại", "Máy in ép (khoảng 1440)", "In sách hàng loạt cho mọi người đọc"] },
  { ch: 1, name: "Florence Nightingale", years: "1820–1910", from: "Anh", field: "Điều dưỡng", lv: 19, where: "City Hospital", reward: "Hồi máu nhanh hơn trong thành phố",
    quests: ["Rửa tay, giữ bệnh viện sạch sẽ", "\"Lady with the Lamp\": đi thăm bệnh nhân ban đêm", "Biểu đồ hình hoa hồng: dùng số liệu để thuyết phục"] },
  { ch: 1, name: "Leonardo da Vinci", years: "1452–1519", from: "Ý", field: "Nghệ thuật & phát minh", lv: 20, where: "Phòng tranh / xưởng", reward: "Khung tranh tự vẽ trong nhà riêng",
    quests: ["Sổ tay viết chữ ngược (đọc qua gương)", "Bản vẽ máy bay cánh vỗ", "Vẽ cơ thể người thật chính xác"] },
  /* ---------- CHƯƠNG 2 · NĂNG LƯỢNG & DI CHUYỂN ---------- */
  { ch: 2, name: "Louis Pasteur", years: "1822–1895", from: "Pháp", field: "Y học", lv: 22, where: "City Hospital (bàn thí nghiệm có sẵn)", reward: "Kỹ năng Pha thuốc",
    quests: ["Vi trùng nhỏ xíu gây bệnh", "Đun nóng để sữa không hỏng (tiệt trùng)", "Vắc-xin bệnh dại (1885)"] },
  { ch: 2, name: "Michael Faraday", years: "1791–1867", from: "Anh", field: "Điện từ", lv: 24, where: "Power Plant", reward: "Phần 1 của nhà máy điện",
    quests: ["Nam châm sinh ra dòng điện (1831)", "Máy phát điện đầu tiên", "Bài giảng Giáng sinh cho trẻ em: \"Lịch sử hoá học của cây nến\""] },
  { ch: 2, name: "Thomas Edison", years: "1847–1931", from: "Mỹ", field: "Điện & âm thanh", lv: 26, where: "Power Plant", reward: "Đèn phố về đêm",
    quests: ["Máy hát: lần đầu ghi lại giọng nói (1877)", "Bóng đèn sáng lâu (1879)", "Xưởng phát minh Menlo Park"] },
  { ch: 2, name: "Nikola Tesla", years: "1856–1943", from: "Serbia (sinh ở Croatia ngày nay) → Mỹ", field: "Điện xoay chiều", lv: 28, where: "Power Plant", reward: "Thắp sáng nhà riêng",
    quests: ["Dòng điện xoay chiều đi được rất xa", "Động cơ điện quay bằng từ trường", "Cuộn Tesla tạo tia điện"] },
  { ch: 2, name: "Alexander Fleming", years: "1881–1955", from: "Scotland", field: "Y học", lv: 30, where: "City Hospital", reward: "Thuốc giải độc Mute mạnh hơn",
    quests: ["Đĩa nuôi cấy bị mốc (1928)", "Penicillin: thuốc kháng sinh đầu tiên", "Giữ phòng thí nghiệm gọn gàng"] },
  { ch: 2, name: "Guglielmo Marconi", years: "1874–1937", from: "Ý", field: "Radio", lv: 32, where: "Tháp radio", reward: "Bộ đàm đội nghe được xa hơn",
    quests: ["Gửi tín hiệu không cần dây", "Tín hiệu vượt Đại Tây Dương (1901)", "Radio cứu người trên biển"] },
  { ch: 2, name: "Karl & Bertha Benz", years: "1844–1929 · 1849–1944", from: "Đức", field: "Ô tô", lv: 34, where: "Gara / bến xe buýt", reward: "Mở xe đi nhanh trong thành phố",
    quests: ["Chiếc ô tô chạy xăng đầu tiên (1886)", "Bertha lái chuyến đường dài đầu tiên (1888)"] },
  { ch: 2, name: "George Stephenson", years: "1781–1848", from: "Anh", field: "Đường sắt", lv: 36, where: "Nhà ga", reward: "Mở tàu đi vùng mới (STORY: nhà ga)",
    quests: ["Đầu máy hơi nước", "Tuyến đường sắt công cộng đầu tiên (1825)", "Đường ray rộng chuẩn"] },
  { ch: 2, name: "Anh em nhà Wright", years: "1867–1912 · 1871–1948", from: "Mỹ", field: "Hàng không", lv: 38, where: "Sân bay", reward: "Kỹ năng Tàu lượn: bay qua thành phố",
    quests: ["Thả tàu lượn thử", "Tự làm hầm gió để thử cánh", "Chuyến bay có động cơ đầu tiên, 12 giây (1903)"] },
  { ch: 2, name: "Marie Curie", years: "1867–1934", from: "Ba Lan → Pháp", field: "Hoá & vật lý", lv: 40, where: "Science Lab", reward: "Trang tri thức: nguyên tố mới",
    quests: ["Tìm ra hai nguyên tố polonium và radium", "Người đầu tiên đoạt 2 giải Nobel", "Xe X-quang lưu động cứu người bị thương"] },
  /* ---------- CHƯƠNG 3 · SỰ SỐNG, MÁY TÍNH & SÓNG ---------- */
  { ch: 3, name: "Carl Linnaeus", years: "1707–1778", from: "Thuỵ Điển", field: "Sinh học", lv: 42, where: "Vườn bách thảo / sở thú", reward: "Sổ tay sinh vật trong sổ thẻ",
    quests: ["Đặt tên khoa học hai phần cho mọi sinh vật", "Xếp sinh vật theo nhóm"] },
  { ch: 3, name: "Gregor Mendel", years: "1822–1884", from: "Áo (nay thuộc Séc)", field: "Di truyền", lv: 44, where: "Nông trại", reward: "Lai giống hoa trong nhà riêng",
    quests: ["Trồng hàng nghìn cây đậu Hà Lan", "Màu hoa, màu hạt truyền từ cha mẹ sang con"] },
  { ch: 3, name: "Charles Darwin", years: "1809–1882", from: "Anh", field: "Tự nhiên học", lv: 46, where: "Sở thú", reward: "Mở thú cưng",
    quests: ["Chuyến tàu Beagle vòng quanh thế giới", "Chim sẻ quần đảo Galápagos mỏ khác nhau"] },
  { ch: 3, name: "Hải Thượng Lãn Ông (Lê Hữu Trác)", years: "1720–1791", from: "🇻🇳 Việt Nam", field: "Y học", lv: 48, where: "Vườn thuốc nam cạnh bệnh viện", reward: "Thuốc từ cây trồng trong nhà",
    quests: ["Bộ sách y học \"Hải Thượng y tông tâm lĩnh\"", "Cây thuốc nam quanh nhà", "Thầy thuốc chữa bệnh cho người nghèo"] },
  { ch: 3, name: "Ada Lovelace", years: "1815–1852", from: "Anh", field: "Máy tính", lv: 50, where: "Science Lab", reward: "Robot phụ tá (thú cưng robot)",
    quests: ["Chương trình máy tính đầu tiên, viết cho máy của Babbage (1843)", "Ý tưởng: máy tính có thể làm ra cả âm nhạc"] },
  { ch: 3, name: "Hedy Lamarr", years: "1914–2000", from: "Áo → Mỹ", field: "Sóng vô tuyến", lv: 54, where: "Tháp radio", reward: "Kháng đòn \"câm\" của Distortia",
    quests: ["Ý tưởng nhảy tần số (1942), nền tảng của Wi-Fi, Bluetooth sau này", "Vừa là diễn viên vừa là nhà phát minh"] },
  { ch: 3, name: "Tôn Thất Tùng", years: "1912–1982", from: "🇻🇳 Việt Nam", field: "Phẫu thuật", lv: 58, where: "City Hospital", reward: "Hồi sinh nhanh hơn khi gục ở vùng hoang dã",
    quests: ["Bản đồ mạch máu trong gan", "Phương pháp mổ gan mang tên ông, được thế giới biết đến"] },
  /* ---------- CHƯƠNG 4 · TRI THỨC TỪ CÁC VÙNG ĐẤT ---------- */
  { ch: 4, name: "Ibn al-Haytham", years: "~965–1040", from: "Basra (Iraq ngày nay) → Cairo", field: "Quang học", lv: 62, need: "Giải phóng khu Ai Cập (Nile Rift)", where: "Star Cinema", reward: "Mở rạp chiếu phim",
    quests: ["Buồng tối: ánh sáng qua lỗ nhỏ vẽ ảnh ngược lên tường", "Mắt nhìn thấy nhờ ánh sáng đi vào mắt", "Làm thí nghiệm để kiểm chứng"] },
  { ch: 4, name: "Trương Hành (Zhang Heng)", years: "78–139", from: "Trung Hoa cổ", field: "Địa chấn & thiên văn", lv: 85, need: "Giải phóng khu Trung Hoa (Ink Rift)", where: "Trạm thời tiết", reward: "Báo trước trùm thế giới sắp xuất hiện",
    quests: ["Địa động nghi: máy báo động đất (năm 132)", "Quả cầu mô hình bầu trời quay bằng nước"] },
  { ch: 4, name: "Al-Khwarizmi", years: "~780–850", from: "Ba Tư → Baghdad", field: "Toán học", lv: 92, need: "Giải phóng khu Lưỡng Hà (Babel Rift)", where: "Babel Tower", reward: "Mảnh tri thức cuối: mở trận cuối",
    quests: ["Đại số (algebra) từ tên cuốn sách của ông", "Từ \"algorithm\" (thuật toán) bắt nguồn từ tên ông", "Đưa hệ chữ số Ấn Độ – Ả Rập (0–9) đến với thế giới"] }
];
/* Dự bị (khi cần thêm): Albert Einstein, Nicolaus Copernicus, Katherine Johnson (tính quỹ đạo tàu vũ trụ), William Shakespeare (văn học), Edward Jenner (vắc-xin đầu tiên), James Watt, Tuệ Tĩnh, Lê Quý Đôn. */
