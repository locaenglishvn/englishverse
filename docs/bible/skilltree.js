/* ĐỀ XUẤT 27/11 (chờ chủ dự án duyệt): MỞ CHIÊU BẰNG NHIỆM VỤ DANH NHÂN.
   Mỗi chiêu = 1 hạt giống khoa học thật (đúng lịch sử, trong nhiệm vụ) → phóng đại ×1000 thành hình thần thoại hầm hố.
   b: nhánh (power | control | harmony | rhythm) · q: nhiệm vụ mở chiêu · fx: hình ảnh khi tung · seed: kiến thức thật gốc. */
window.SKILL_TREE = {
  rules: [
    ["Mở chiêu = làm nhiệm vụ kiến thức", "Mỗi nhiệm vụ của một danh nhân mở 1 chiêu. Danh nhân có 3 nhiệm vụ thì có 2–3 chiêu cùng \"hệ\" (ví dụ Tesla: hệ điện)."],
    ["Điểm kỹ năng khi lên cấp = nâng bậc", "Lên cấp được điểm, chỉ dùng để nâng bậc chiêu đã mở (bậc 1 → 5, sau này tới 10). Bậc càng cao hình càng hoành tráng: thêm vòng phù văn, đổi sắc vàng, thêm cột sáng, rung mạnh."],
    ["Câu thần chú = thẻ kiến thức", "Lần đầu tung chiêu mới, người chơi phải nói câu tiếng Anh của thẻ kiến thức đó (ví dụ Tesla Coil: \"Electricity can jump through the air.\"). Sau đó câu này vào Voice Deck để ôn."],
    ["Càng về sau càng đẹp", "Chương 1 (Lv.10–20): 1 hình chính + nổ. Chương 2 (Lv.22–36): 2 lớp, có sinh vật / cây mọc. Chương 3 (Lv.38–52): máy móc khổng lồ hiện ra. Chương 4 (Lv.58–92): vũ trụ, thời gian, thiên hà."],
    ["Mang theo 4 chiêu + 1 tuyệt chiêu", "Mở được hàng chục chiêu nhưng mỗi trận chỉ mang 4 chiêu thường + 1 tuyệt chiêu, nên người chơi phải chọn bộ chiêu hợp nhau (đây là phần \"cày\" và khoe)."],
    ["Thần ban chiêu khởi đầu và tuyệt chiêu", "Lv.1–9 (chưa gặp danh nhân): 4 chiêu của Vocara, mỗi nhánh 1. Tuyệt chiêu thần thoại (rồng, kiếm rune…) nhận ở 8 khu văn hoá Lv.50–100, đúng cốt truyện: danh nhân trao tri thức, thần trao phép."]
  ],
  starter: [
    { name: "Echo Blast", b: "power", fx: "Vòng rune xoay ở tay, quả cầu âm thanh bay, nổ cột lửa." },
    { name: "Question Arrow", b: "control", fx: "Mũi tên pha lê kéo đuôi sao, nổ phép tím, sao choáng xoay trên đầu quái." },
    { name: "Harmony Heal", b: "harmony", fx: "Ấn lục giác thở dưới chân, hào quang xanh, lá bay lên." },
    { name: "Drum Roll", b: "rhythm", fx: "3 nhịp trống, mỗi nhịp một vệt chém lửa." }
  ],
  chapters: [
    { n: 1, name: "Đời sống quanh em", lv: "Lv.10–20", list: [
      { who: "Lương Thế Vinh", lv: 10, skills: [
        { name: "Elephant Scale", b: "control", q: "Cân con voi bằng một chiếc thuyền", fx: "Con thuyền ma khổng lồ trồi từ mặt đất như mặt hồ, sóng nước nâng bổng cả đàn quái lên rồi \"cân\": vạch mực nước đỏ hiện trên thân, quái nặng nhất bị dìm xuống choáng.", seed: "Vật chiếm chỗ nước: thuyền chìm tới đâu thì nặng bấy nhiêu." },
        { name: "Abacus Barrage", b: "power", q: "Sách toán Đại thành toán pháp", fx: "Bàn tính gỗ cao 3 m hiện sau lưng, các hạt gỗ bắn liên hoàn như súng máy, mỗi hạt nổ ra một con số vàng." , seed: "Bàn tính: cộng trừ nhanh bằng cách gạt hạt." } ] },
      { who: "William Addis", lv: 11, skills: [
        { name: "Bristle Cyclone", b: "rhythm", q: "Làm bàn chải từ cán xương", fx: "Bàn chải khổng lồ xoay tít quanh người như cánh quạt, quét văng quái, bọt trắng bay mù trời rồi nổ lốp bốp.", seed: "Lông cứng chà sạch mảng bám." } ] },
      { who: "Florence Nightingale", lv: 12, skills: [
        { name: "Lady's Lamp", b: "harmony", q: "The Lady with the Lamp", fx: "Đèn dầu vàng bay lên trên đầu, toả chùm sáng quét như hải đăng: đồng đội trong vùng sáng hồi máu liên tục, quái trong vùng sáng bị thiêu.", seed: "Chăm sóc bệnh nhân cả ban đêm." },
        { name: "Fresh Wind", b: "harmony", q: "Rửa tay, mở cửa sổ, phòng sạch", fx: "Cánh cửa sổ ánh sáng mở toang, luồng gió trong xanh cuốn sạch độc câm, giải mọi hiệu ứng xấu.", seed: "Vệ sinh và không khí sạch giảm bệnh tật." } ] },
      { who: "Earle Dickson", lv: 13, skills: [
        { name: "Bandage Bind", b: "control", q: "Dán miếng gạc lên băng keo", fx: "Cuộn băng keo khổng lồ bay vòng, quấn quái thành xác ướp trắng 3 giây; quanh mình hiện miếng băng sáng hồi máu.", seed: "Băng cá nhân che vết thương nhỏ." } ] },
      { who: "Isaac Newton", lv: 14, skills: [
        { name: "Gravity Crush", b: "power", q: "Quả táo rơi và lực hấp dẫn", fx: "Quả táo vàng to bằng ngôi nhà rơi từ trời, không gian cong lõm như tấm lưới, quái bị hút về tâm rồi nghiền xuống thành hố.", seed: "Mọi vật bị Trái Đất hút xuống." },
        { name: "Prism Ray", b: "rhythm", q: "Lăng kính tách ánh sáng 7 màu", fx: "Lăng kính pha lê lơ lửng, tia sáng trắng đâm vào rồi toả ra 7 tia cầu vồng quét chéo cả bãi.", seed: "Ánh sáng trắng gồm 7 màu." },
        { name: "Third Law", b: "control", q: "3 định luật chuyển động", fx: "Khiên mũi tên phản lực: đòn đánh vào mình bị bật ngược lại kèm sóng chấn động.", seed: "Lực và phản lực." } ] },
      { who: "Mary Anning", lv: 15, skills: [
        { name: "Ichthyosaur Rise", b: "rhythm", q: "Bộ xương ngư long trên vách biển", fx: "Bộ xương ngư long dài 10 m phá đất trồi lên, \"bơi\" dưới mặt đất như cá mập (để lại rãnh nứt) rồi nhảy lên đớp cả cụm quái.", seed: "Hoá thạch bò sát biển cổ đại." },
        { name: "Plesio Snap", b: "power", q: "Thằn lằn cổ dài", fx: "Chiếc cổ xương dài vươn ra từ vòng phù văn, quất như roi và cắn 1 mục tiêu.", seed: "Plesiosaur: cổ rất dài." } ] },
      { who: "Johannes Gutenberg", lv: 16, skills: [
        { name: "Press Slam", b: "power", q: "Máy in", fx: "Cỗ máy in gỗ khổng lồ dập xuống, đóng dấu chữ cái phát sáng lên quái và mặt đất.", seed: "Máy in ép giấy lên chữ có mực." },
        { name: "Typeset Rain", b: "rhythm", q: "Chữ rời bằng kim loại", fx: "Mưa chữ kim loại A–Z rơi xuống cả vùng, mỗi chữ cắm xuống nổ tia lửa.", seed: "Chữ rời ghép thành trang in." } ] },
      { who: "Leonardo da Vinci", lv: 17, skills: [
        { name: "Ornithopter Dive", b: "rhythm", q: "Máy bay cánh chim (ornithopter)", fx: "Máy bay cánh chim bằng gỗ của Da Vinci vỗ cánh bay vút lên rồi lao bổ vào quái, nổ tung cả vùng.", seed: "Da Vinci vẽ máy bay vỗ cánh như chim." },
        { name: "Vitruvian Seal", b: "control", q: "Người Vitruvius", fx: "Chưởng ra ấn Người Vitruvius của Da Vinci, ấn đóng xuống phong ấn quái: quái rối loạn, không đánh được.", seed: "Da Vinci vẽ cơ thể người cân đối trong hình tròn và hình vuông (và viết chữ ngược)." } ] },
      { who: "Alexander Graham Bell", lv: 18, skills: [
        { name: "Ring Shock", b: "control", q: "Chiếc điện thoại đầu tiên", fx: "Ống nghe đồng cổ khổng lồ đổ chuông, dây điện xoắn phóng ra quấn quái, tiếng chuông thành sóng âm choáng.", seed: "Giọng nói truyền qua dây điện." } ] },
      { who: "Nicéphore Niépce", lv: 19, skills: [
        { name: "Camera Obscura", b: "control", q: "Tấm ảnh đầu tiên", fx: "Hộp tối khổng lồ mở \"mắt\", chớp sáng chói: quái bị chụp lại, hoá thành tấm ảnh nâu sepia đứng im 3 giây.", seed: "Ánh sáng qua lỗ nhỏ vẽ ra hình." } ] },
      { who: "Wilhelm Röntgen", lv: 20, skills: [
        { name: "X-Ray Pierce", b: "power", q: "Tìm ra tia X", fx: "Tia X xanh lục xuyên qua hàng quái, thân quái trong suốt hiện bộ xương phát sáng, nhận thêm 30% sát thương.", seed: "Tia X đi xuyên qua cơ thể." },
        { name: "Skeleton Burst", b: "rhythm", q: "Tấm phim bàn tay", fx: "Bàn tay xương khổng lồ trồi lên từ tấm phim X-quang dưới đất, đập mạnh xuống, sóng xanh lục toả ra.", seed: "Phim X-quang chụp được xương." } ] }
    ] },
    { n: 2, name: "Sức khoẻ & sự sống", lv: "Lv.22–36", list: [
      { who: "Antonie van Leeuwenhoek", lv: 22, skills: [
        { name: "Microbe Swarm", b: "rhythm", q: "Những con vật nhỏ trong giọt nước", fx: "Thấu kính khổng lồ dựng trước mặt, phóng to giọt nước; đàn vi sinh phát sáng hình que, hình xoắn tràn ra gặm quái.", seed: "Kính hiển vi thấy vi khuẩn." } ] },
      { who: "Louis Pasteur", lv: 24, skills: [
        { name: "Sterilize Blaze", b: "power", q: "Đun nóng để sữa không hỏng", fx: "Cột lửa xanh 100°C phun từ đất lên, nước sôi sùng sục quanh quái, hơi nóng bốc thành nấm khói.", seed: "Đun nóng diệt vi trùng." },
        { name: "Vaccine Shield", b: "harmony", q: "Vắc-xin bệnh dại", fx: "Mũi kim ánh sáng tiêm vào người, giáp tinh thể lục giác bao quanh: miễn độc câm 10 giây.", seed: "Vắc-xin dạy cơ thể tự chống bệnh." } ] },
      { who: "Alexander Fleming", lv: 26, skills: [
        { name: "Penicillin Bloom", b: "harmony", q: "Penicillin", fx: "Đốm nấm mốc xanh nở bung thành vườn hoa phát sáng: đồng đội đứng trong hồi máu, quái đứng trong bị ăn mòn.", seed: "Nấm mốc diệt vi khuẩn." } ] },
      { who: "Gregor Mendel", lv: 28, skills: [
        { name: "Pea Vine Prison", b: "control", q: "Trồng hàng nghìn cây đậu", fx: "Dây đậu khổng lồ trồi lên quấn quái, hoa tím trắng nở trên dây, quả đậu nổ ra hạt.", seed: "Di truyền ở cây đậu." },
        { name: "Hybrid Shot", b: "power", q: "Lúa lai, bắp, chuối ngày nay", fx: "Hạt giống vàng bay ra, giữa đường tách đôi rồi đôi nữa (2 → 4 → 8) rồi cùng nổ.", seed: "Lai giống cho cây tốt hơn." } ] },
      { who: "Hải Thượng Lãn Ông", lv: 30, skills: [
        { name: "Herbal Mist", b: "harmony", q: "Cây thuốc nam: gừng, sả, tía tô", fx: "Nồi thuốc đồng hiện ra sôi sùng sục, khói thơm xanh vàng toả rộng hồi máu dần cho cả đội.", seed: "Cây thuốc quanh nhà." } ] },
      { who: "Tôn Thất Tùng", lv: 32, skills: [
        { name: "Vein Map", b: "control", q: "Vẽ bản đồ mạch máu trong gan", fx: "Mạng mạch máu đỏ phát sáng lan trên mặt đất nối các quái: đánh 1 con, cả mạng cùng chịu.", seed: "Bản đồ mạch máu giúp mổ chính xác." },
        { name: "Surgeon's Cut", b: "power", q: "Phương pháp mổ gan", fx: "Một đường dao sáng mảnh như sợi chỉ, chậm lại 0,3 giây rồi xé toạc: luôn chí mạng.", seed: "Mổ nhanh, chính xác." } ] },
      { who: "Marie Curie", lv: 34, skills: [
        { name: "Radium Nova", b: "power", q: "Tìm ra polonium, radium", fx: "Hạt radium phát sáng xanh lục trong bóng tối, phình to thành mặt trời nhỏ rồi nổ tung, để lại vùng ánh xanh.", seed: "Radium tự phát sáng." },
        { name: "X-Ray Aura", b: "harmony", q: "Xe X-quang ra chiến trường", fx: "Chùm sáng X-quang xanh lục rọi xuống người, vòng quét sáng chạy lên xuống: hồi máu.", seed: "Xe X-quang cứu người bị thương." } ] },
      { who: "Dmitri Mendeleev", lv: 36, skills: [
        { name: "Periodic Barrage", b: "rhythm", q: "Xếp nguyên tố thành bảng", fx: "Bảng tuần hoàn khổng lồ dựng sau lưng, từng ô bật sáng và bắn ra nguyên tố của nó: H nổ, O bùng lửa, Fe thành mũi sắt, Ne neon tím.", seed: "Bảng tuần hoàn các nguyên tố." },
        { name: "Water Split", b: "power", q: "Nước = hydro + ô-xy", fx: "Quả cầu nước bay tới, tách thành 2 bóng H và 1 bóng O, nhập lại nổ một tiếng \"bùm\" hơi nước trắng.", seed: "H₂O: nước gồm hydro và ô-xy." } ] }
    ] },
    { n: 3, name: "Điện, máy móc & di chuyển", lv: "Lv.38–52", list: [
      { who: "Thomas Edison", lv: 38, skills: [
        { name: "Phonograph Roar", b: "power", q: "Máy hát ghi lại giọng nói", fx: "Loa kèn đồng khổng lồ và đĩa than xoay sau lưng; câu người chơi vừa nói được phát lại ×3 thành 3 sóng âm vàng.", seed: "Máy hát ghi và phát lại tiếng." },
        { name: "Bulb Barrage", b: "rhythm", q: "Bóng đèn điện", fx: "Hàng trăm bóng đèn bay ra như pháo, chạm quái là chớp sáng và nổ kính.", seed: "Bóng đèn sợi đốt." },
        { name: "Never Give Up", b: "harmony", q: "Thử hàng nghìn lần", fx: "Khi sắp hết máu, ngàn bóng đèn hỏng xoay quanh rồi một bóng sáng rực: hồi 50% máu (nội tại, 1 lần mỗi trận).", seed: "Kiên trì thử nghiệm." } ] },
      { who: "Nikola Tesla", lv: 40, skills: [
        { name: "Tesla Coil", b: "rhythm", q: "Cuộn Tesla bắn tia điện", fx: "Tháp cuộn Tesla trồi khỏi đất, quả cầu trên đỉnh phóng sét nảy liên hoàn qua 6 quái.", seed: "Cuộn Tesla tạo tia điện cao thế." },
        { name: "AC Storm", b: "power", q: "Dòng điện xoay chiều", fx: "Hai luồng sét xanh và tím xoắn quanh nhau như sợi dây, đổi chiều liên tục rồi đánh xuống.", seed: "Dòng điện đổi chiều nhiều lần mỗi giây." },
        { name: "Motor Spin", b: "rhythm", q: "Động cơ điện", fx: "Rotor nam châm khổng lồ quay dưới chân, quái bị kéo xoay vòng như trong máy giặt.", seed: "Động cơ quay nhờ nam châm và điện." } ] },
      { who: "Willis Carrier", lv: 42, skills: [
        { name: "Absolute Chill", b: "control", q: "Máy làm mát", fx: "Ống gió khổng lồ thổi bão lạnh, tinh thể băng phủ kín quái, cả vùng đóng băng.", seed: "Máy lạnh hút hơi nóng ra ngoài." } ] },
      { who: "Guglielmo Marconi", lv: 44, skills: [
        { name: "Radio Tower", b: "rhythm", q: "Gửi tín hiệu không dây", fx: "Cột ăng-ten thép mọc lên, sóng radio đồng tâm lan xa cả bản đồ, mỗi vòng sóng đánh 1 lần.", seed: "Sóng radio truyền không cần dây." },
        { name: "SOS Beacon", b: "harmony", q: "Radio cứu người trên biển", fx: "Pháo hiệu SOS bắn lên trời, đồng đội ở xa được hồi máu và chạy nhanh về phía mình.", seed: "Tín hiệu cứu nạn." } ] },
      { who: "John Logie Baird", lv: 46, skills: [
        { name: "Screen Trap", b: "control", q: "Ti vi đầu tiên", fx: "Màn hình ti vi cổ khổng lồ hiện ra, hút quái vào trong, quái bị kẹt giữa nhiễu sóng sọc trắng đen.", seed: "Ti vi truyền hình ảnh đi xa." } ] },
      { who: "Karl & Bertha Benz", lv: 48, skills: [
        { name: "Benz Engine", b: "rhythm", q: "Chuyến lái đường dài của Bertha", fx: "Khối động cơ xy-lanh khổng lồ dạng linh hồn hiện sau quái, piston lên xuống, từng buồng đốt nổ liên hoàn bùm bùm bùm vào quái.", seed: "Ô tô chạy xăng đầu tiên." } ] },
      { who: "George Stephenson", lv: 50, skills: [
        { name: "Steam Express", b: "power", q: "Đầu máy hơi nước", fx: "Đường ray ánh sáng hiện dưới đất, đoàn tàu hơi nước ma rú còi lao xuyên hàng quái, khói trắng cuồn cuộn.", seed: "Tàu hơi nước kéo nhiều toa." } ] },
      { who: "Anh em nhà Wright", lv: 52, skills: [
        { name: "Wind Tunnel", b: "control", q: "Hầm gió tự làm", fx: "Đường hầm gió xoáy kéo dài, hút quái thành một hàng thẳng.", seed: "Thử cánh trong hầm gió." },
        { name: "Kitty Hawk Dive", b: "power", q: "Chuyến bay 12 giây", fx: "Máy bay cánh kép bằng ánh sáng bay vòng rồi bổ nhào xuống, nổ gió.", seed: "Chuyến bay có động cơ đầu tiên." } ] }
    ] },
    { n: 4, name: "Vũ trụ & thế giới số", lv: "Lv.58–92", list: [
      { who: "Galileo Galilei", lv: 58, skills: [
        { name: "Four Moons", b: "rhythm", q: "Bốn mặt trăng của sao Mộc", fx: "Bốn mặt trăng nhỏ quay quanh người chơi, lần lượt phóng vào quái như sao chổi.", seed: "Sao Mộc có 4 mặt trăng lớn." },
        { name: "Lunar Crater", b: "power", q: "Núi và hố trên Mặt Trăng", fx: "Mặt Trăng nghiêng xuống sát mặt đất, một mảnh đá Mặt Trăng rơi tạo hố khổng lồ.", seed: "Mặt Trăng có núi và hố." } ] },
      { who: "Edwin Hubble", lv: 62, skills: [
        { name: "Galaxy Bloom", b: "rhythm", q: "Vũ trụ đang nở ra", fx: "Thiên hà xoắn ốc mở ra dưới chân, nở rộng đẩy quái văng ra mọi phía.", seed: "Các thiên hà đang rời xa nhau." },
        { name: "Meteor Shower", b: "power", q: "Thiên hà Andromeda", fx: "Bầu trời tối lại, mưa sao băng lửa rơi xuống cả vùng.", seed: "Ngoài Dải Ngân Hà còn nhiều thiên hà." } ] },
      { who: "Neil Armstrong", lv: 66, skills: [
        { name: "Moon Gravity", b: "control", q: "Vì sao trên Mặt Trăng nhảy cao", fx: "Vùng trọng lực thấp: quái lơ lửng chậm chạp bay lên trời như phi hành gia.", seed: "Trọng lực Mặt Trăng = 1/6 Trái Đất." },
        { name: "Giant Leap", b: "rhythm", q: "Bước chân đầu tiên trên Mặt Trăng", fx: "Nhảy vọt lên cao, đáp xuống in dấu giày khổng lồ, bụi Mặt Trăng toả tròn.", seed: "\"One small step…\"" } ] },
      { who: "Albert Einstein", lv: 70, skills: [
        { name: "Photon Lance", b: "power", q: "Ánh sáng làm bật electron", fx: "Tia laser photon trắng xuyên thẳng, electron vàng văng ra từ thân quái.", seed: "Hiệu ứng quang điện." },
        { name: "Time Dilation", b: "control", q: "Thuyết tương đối", fx: "Mặt đồng hồ khổng lồ quay chậm lại dưới chân: quái trong vùng chuyển động chậm như phim quay chậm.", seed: "Thời gian trôi khác nhau khi đi rất nhanh." },
        { name: "E = mc² Nova", b: "power", q: "E = mc²", fx: "Một hạt nhỏ xíu tụ ánh sáng, im lặng 1 giây, rồi bùng thành mặt trời nổ tung.", seed: "Khối lượng nhỏ chứa năng lượng rất lớn." } ] },
      { who: "Ada Lovelace", lv: 74, skills: [
        { name: "Analytical Engine", b: "harmony", q: "Máy tính có thể làm ra âm nhạc", fx: "Cỗ máy bánh răng đồng khổng lồ quay sau lưng, chơi một bản nhạc: cả đội tăng sát thương và hồi chiêu nhanh.", seed: "Chương trình máy tính đầu tiên." } ] },
      { who: "Hedy Lamarr", lv: 78, skills: [
        { name: "Frequency Hop", b: "rhythm", q: "Ý tưởng nhảy tần số", fx: "Người chơi dịch chuyển chớp nhoáng giữa 5 quái, mỗi bước để lại sóng tần số màu khác nhau rồi cùng nổ.", seed: "Nhảy tần số: nền của Wi-Fi, Bluetooth." } ] },
      { who: "Alan Turing", lv: 82, skills: [
        { name: "Code Breaker", b: "control", q: "Giải mã thư mật", fx: "Bánh răng máy mã Enigma xoay quanh quái, chữ cái mã hoá vỡ vụn: quái mất mọi kỹ năng 6 giây.", seed: "Giải mã Enigma." } ] },
      { who: "Paul Baran", lv: 86, skills: [
        { name: "Packet Storm", b: "rhythm", q: "Chia tin nhắn thành gói nhỏ", fx: "Mạng lưới nút sáng nối mọi quái, gói tin ánh sáng bắn qua lại hàng trăm lần.", seed: "Internet gửi tin theo từng gói nhỏ." } ] },
      { who: "Al-Khwarizmi", lv: 92, skills: [
        { name: "Zero Void", b: "power", q: "Chữ số 0–9 lan ra khắp thế giới", fx: "Số 0 vàng khổng lồ hiện trên trời, lòng số 0 hoá hố đen hút mọi quái vào rồi khép lại.", seed: "Số 0 và hệ chữ số." },
        { name: "Algorithm", b: "harmony", q: "Thuật toán: làm theo từng bước", fx: "Chuỗi chiêu tự động: 3 chiêu tiếp theo tung ngay không cần chờ hồi.", seed: "Thuật toán = các bước theo thứ tự." } ] }
    ] }
  ],
  ults: [
    { god: "Thương Hiệt", area: "Trung Hoa · Lv.80–90", name: "Dragon Roar", fx: "Rồng đỏ vảy vàng bay xoắn ốc rồi lao xuống quái nổ lớn (đã có bản mẫu)." },
    { god: "Odin", area: "Bắc Âu · Lv.70–80", name: "Rune Sword", fx: "Kiếm khắc rune khổng lồ rơi từ trời cắm xuống (đã có bản mẫu: Last Word)." },
    { god: "Thoth", area: "Ai Cập · Lv.60–70", name: "Ibis Judgment", fx: "Cánh cổng tượng hình mở, cò quăm ánh sáng sải cánh quét ngang, cân phán xét hiện trên đầu quái." },
    { god: "Kotodama", area: "Nhật · Lv.50–60", name: "Word Spirit Torii", fx: "Hàng cổng torii đỏ mọc thành đường hầm, chữ kana bay thành bầy cá chép lửa." },
    { god: "Hermes", area: "Hy Lạp · Lv.80–90", name: "Winged Courier", fx: "Đôi giày có cánh, người chơi lướt 7 lần như tia chớp, lông vũ vàng bay đầy trời." },
    { god: "Ogma", area: "Celt · Lv.80–90", name: "Ogham Grove", fx: "Rừng cột đá Ogham trồi lên vòng tròn, dây leo sáng nối các cột trói cả vùng." },
    { god: "Itzamna", area: "Maya · Lv.80–90", name: "Feathered Serpent", fx: "Rắn lông vũ Kukulkan bay từ kim tự tháp ánh sáng xuống." },
    { god: "Nabu", area: "Lưỡng Hà · Lv.90–100", name: "Tablet of Destiny", fx: "Bia đất sét khắc chữ nêm khổng lồ đổ ụp xuống, chữ bay ra thành xích khoá." }
  ]
};
