# EnglishVerse – Tầm nhìn & Lộ trình

> Tài liệu này để **mỗi phiên làm việc mới** (người hoặc AI) nắm ngay bối cảnh, không phải hỏi lại từ đầu.
> Quy tắc làm việc nằm trong `CLAUDE.md`. Cập nhật mục **"Đã làm"** và **"Việc tiếp theo"** sau mỗi chặng lớn.

---

## 1. Tầm nhìn

**Mục tiêu xã hội:** giúp học sinh Việt Nam (và cả người lớn) **dùng được** tiếng Anh như ngôn ngữ thứ hai.
Vấn đề gốc: không có môi trường tiếng Anh ngoài lớp học; dạy và thi nặng ngữ pháp, bài viết, nên học sinh "biết" mà không "dùng" được.

**Lời giải:** một **metaverse 3D online** (chơi chủ yếu trên điện thoại). Người chơi là một nhân vật đi lại tự do trong thành phố, có xã hội, có tương tác.
**Tiếng Anh là công cụ để chơi, để thắng**, chứ không phải môn học.

### Nguyên tắc thiết kế (bắt buộc giữ)
1. **Game cuốn trước, học ngầm sau.** Không "bán" game bằng lợi ích học tập. Người chơi phải mê vì vui, tò mò, thành tựu, xã hội.
2. **Tiếng Anh là công cụ:** mọi nhiệm vụ đều cần nghe/nói tiếng Anh để hoàn thành (mua hàng, hỏi đường, đánh quái, phối hợp đội).
3. **Tự nói thì có lợi hơn:** nói qua micro → giảm giá, thêm ⭐, sát thương cao hơn. Câu có sẵn vẫn dùng được nhưng ít hoặc không có thưởng.
4. **Đồ hiếm nhất không mua được bằng tiền**, chỉ đạt được bằng thành tích tiếng Anh. Vì vậy địa vị trong cộng đồng gắn với việc dùng tiếng Anh.
5. **Hạn chế tiếng Việt bằng thiết kế, không bằng lệnh cấm:** không có ô gõ tự do; chat bằng câu có sẵn hoặc giọng nói (máy chỉ nghe ra tiếng Anh); tên nhân vật chỉ chữ cái tiếng Anh.
6. **Mọi mini-game là một "trạm" trong thế giới.** Chơi xong thì quay lại thành phố.
7. **Không bạo lực:** quái bị "giải thoát" chứ không bị giết; chiêu thức là câu nói. **Vũ khí & giáp (chủ dự án đổi 25/11, thay bản 20/11 "tròn, không sắc bén"):** kiếm, búa, thương, trượng, sách phép, khiên, song đao… được phép góc cạnh, gai vừa phải, đẹp và "wow", cấp càng cao càng hầm hố; vẫn không máu me, không hở hang. Bỏ vũ khí nhạc cụ. Thiết kế: `docs/bible/outfits.js` (tab Trang bị).
8. **Giữ nút để nói** ở mọi chỗ có micro (giữ → nói → thả tay là chấm ngay).

### Lý thuyết nền (để giải thích với nhà trường, phụ huynh, nhà đầu tư)
| Lý thuyết | Áp dụng trong game |
|---|---|
| Krashen – Input i+1, Affective Filter, Compelling Input | Nội dung khó hơn trình độ một chút; không bao giờ chấm "SAI" đỏ chói; cốt truyện cuốn đến mức quên đang học |
| Long – Interaction (thương lượng nghĩa) | NPC hỏi lại "Sorry, who or where?"; trạm mê cung bắt hai người phải hỏi lại nhau |
| Swain – Output | Phải tự nói để hành động (mua hàng, ra chiêu, chỉ đường) |
| Schmidt – Noticing | Hiện chữ máy nghe được ngay khi nói; NPC nhắc lại câu chuẩn |
| Vygotsky – ZPD, giàn giáo | Gợi ý giảm dần (💡 Phrases); ghép đội người giỏi + người yếu |
| Norton – Identity / Investment | Mỗi người có nhân vật và tên tiếng Anh, "một Tiếng Nói" |
| CLIL / TBLT | Học khoa học, lịch sử, nghề **bằng** tiếng Anh qua nhiệm vụ với danh nhân |
| SRS (lặp lại ngắt quãng) | Đề đánh quái ưu tiên câu trong thẻ vừa sưu tầm |
| Stealth assessment, Flow | Chỉ số nhân vật thực chất đo năng lực, sau này thành báo cáo CEFR; độ khó tự điều chỉnh |

### Đối tượng
- **Trẻ em:** bị hút bởi đánh quái, sưu tầm, trang phục, nhà riêng, bạn bè.
- **Người lớn:** thêm giá trị chứng nhận CEFR, nhiệm vụ đời thật (phỏng vấn, du lịch, công việc).
- **Phụ huynh, nhà trường "mua" kết quả:** báo cáo năng lực **nghe, nói** theo CEFR. Đây là bài đánh giá có độ giá trị cao mà kỳ thi viết hiện nay thiếu.

---

## 2. Cốt truyện & bối cảnh

> **20/11: cốt truyện mới (bản nháp v1, chờ chốt) ở [`docs/STORY.md`](STORY.md)**: Vocara + Vox Prima, tháp Babel, The Great Silence, Vòm Thần ở vùng Đông Nam thế giới, tiếng Anh = thần chú. Phần bên dưới là bản cũ, chỉ giữ lại để tham khảo (Mutelings, Word Spirit, thanh Voice chung vẫn dùng được).

**Verse City** – thành phố nằm giữa các cánh cổng thời gian. Ngày xưa ai cũng nói, rồi người ta **sợ nói sai** và im lặng dần. Những lời không dám nói đọng lại thành **The Mute**: màn sương xám làm mọi thứ mất màu, mất tiếng.

- **The Mute** là một **thế lực** (giống "phe bóng tối"), không phải một con quái. Thông điệp ngầm: *"Mở miệng nói là sức mạnh; im lặng mới là kẻ thù."*
- **Mutelings:** quái vật lý trên bản đồ, mỗi con là **một lời chưa được nói ra**, ví dụ Echo Ghost (đã có), Riddle Bug, Scramble Worm.
- **Tướng khu vực và Mute Lord:** trùm, đánh theo nhóm, xuất hiện theo mùa.
- **Word Spirit:** quái bị đánh bại thì **được giải thoát**, hóa thành tinh linh. Tinh linh sưu tầm được, bay theo người chơi, trưng bày trong nhà.
- **Người chơi là "a Voice"** (một Tiếng Nói). Mỗi câu tiếng Anh nói ra là sức mạnh.
- **Thế giới chung:** sương phủ khu vực cho cả server. Mỗi khu có thanh "Voice" chung, cả cộng đồng góp câu nói vào. Đầy thanh thì trùm xuất hiện; hạ trùm thì khu đó sáng màu lại cho mọi người. Sau đó sương lan sang khu mới, nên mục tiêu không bao giờ hết.
- **Phần mở đầu riêng (phasing):** người mới tự giải cứu khu nhà mình qua vài nhiệm vụ hướng dẫn.

Lời mở đầu (dự kiến):
> *Long ago, Verse City was full of voices. Then people became afraid of making mistakes… and stopped speaking. Their unspoken words turned into the Mute — a grey fog full of strange creatures. You have a Voice. Every word you say is power. Speak, free the creatures, and bring the colors back!*

---

## 3. Hệ thống game (thiết kế)

### Chiến đấu bằng giọng nói
- **Vũ khí là nhạc cụ.** Mỗi loại là một "hệ", ứng với một kỹ năng:
  - 📢 **Loa:** *lặp lại* câu (phát âm), sát thương mạnh. **Đã có (Echo Ghost).**
  - 🎺 **Kèn:** *trả lời* câu hỏi (nghe hiểu).
  - 🎸 **Đàn:** *xếp lại* câu bị đảo (ngữ pháp), hồi phục và tăng sức cho đồng đội.
  - 🥁 **Trống:** *nói nhanh* từ theo hình (từ vựng, phản xạ).
- **Sát thương** = độ chính xác × độ khó/độ dài câu × cấp người chơi/vũ khí. Quái mạnh hơn mình ≥2 cấp chỉ nhận 30%.
- **Đề riêng cho từng người** trên cùng một con quái: phần lớn là câu trong thẻ đã có (SRS), một phần i+1, một ít câu đã thuộc.
- **Bị đánh thì không chết, mà bị câm:** hết giờ → "Shhh!" → micro khóa 3 giây; có thể trúng độc ☠️ (sát thương giảm một nửa).
- **Quái thường** đi trên bản đồ chung (kiểu Võ Lâm). **Trùm, hầm ngục** vào phòng đánh riêng (kiểu TS Online), có thời gian suy nghĩ.

### Chỉ số nhân vật (đánh giá ẩn → CEFR)
| Chỉ số | Tăng khi | Thực chất đo |
|---|---|---|
| 🗣️ Voice | Tự nói qua micro | Nói |
| 👂 Ears | Nhiệm vụ nghe | Nghe |
| 🧠 Mind | Nhiệm vụ danh nhân, thẻ | Từ vựng, kiến thức |
| 💛 Heart | Giúp người khác, làm guide | Giao tiếp xã hội |

### Trang phục (ĐÃ LÀM – PR #21)
- **Ô trang bị:** 🧢 Mũ · 👕 Áo/áo choàng · 👟 Giày · 🎒 Phụ kiện (sau này thêm ô nhạc cụ).
- **Chỉ số trang bị:** Voice (sát thương), Ears (thêm thời gian trả lời), Stamina (năng lượng tối đa, hồi nhanh), Resist (giảm trúng độc), Luck (thêm xu, tinh linh hiếm).
- **Độ hiếm:**

| Bậc | Màu | Cấp yêu cầu | Giá | Cách có |
|---|---|---|---|---|
| Common | Trắng | Lv.1 | 15–30 🪙 | Mua ở Clothes Shop (trước là Style Box) |
| Uncommon | Xanh lá | Lv.3 | 60–100 🪙 | Mua |
| Rare | Xanh dương | Lv.5 | 200–350 🪙 | Mua |
| Epic | Tím | Lv.10 | 800+ 🪙 | Mua hoặc rơi từ trùm |
| **Legendary** | **Vàng** | Lv.15 | **Không bán** | **Chỉ bằng thành tích tiếng Anh** (vd: Best Speaker 10 lần, tự nói 1000 câu) |

- Nhân vật KayKit ghép từ nhiều bộ phận (mũ, áo choàng, đầu, thân, tay, chân), dùng chung khung xương nên **có thể phối bộ phận giữa các nhân vật**. Code: `buildComposite()` lấy xương của Rogue rồi gắn từng bộ phận theo tên xương.
- **Tạo nhân vật chỉ chọn khuôn mặt + kiểu tóc** (4 đầu: Alex, Sam, Robin, Max). Ai cũng bắt đầu bằng áo thun trắng + quần xám, nên mua đồ mới mới thấy khác biệt.
- Áo trơn (T-shirt, jeans) = vải của Rogue chuyển đen trắng rồi **nhuộm màu** (`plain` + `tint` trong `places.js`), nên thêm màu mới chỉ cần thêm 1 dòng dữ liệu.
- Đổi kiểu tóc: **Saigon Barber** (12 🪙). Thay đồ: 🎒 túi, **gương ở nhà**, gương thử đồ ở Clothes Shop.
- Chỉ số đã có tác dụng: Voice (+% sát thương), Ears (+giây), Stamina (tốn ít năng lượng, hồi nhanh), Resist (giảm % trúng độc), Luck (+% xu).
- Legendary đầu tiên: **Crown of Voices** – giải thoát 30 tinh linh + tự nói đúng 300 câu (`LEGENDS` trong `places.js`; đếm bằng `save.spoken`).

### Sổ thẻ 🎴 – 3 loại, có hạn mức, có sao luyện tập (PR #26)
| Loại | Lấy ở đâu | Dữ liệu |
|---|---|---|
| 💬 Câu nói (phrase) | Trả lời đúng NPC | `card` trong mỗi bước ở lessons.js |
| ❓ Câu hỏi (question) | NPC hỏi mình, trả lời đúng | `q` trong mỗi bước ở lessons.js |
| 📦 Từ vựng (vocab) | Chạm đồ trưng bày → **bắt buộc giữ 🎤 và hỏi** "What is this?" (không có nút bấm thay thế). Từ Lv.20 gợi ý hỏi rõ loại: "What is this drink / food / tool / machine / plant / furniture / thing?" (`kind`), vẫn chấp nhận câu ngắn; hỏi đủ +2 ⭐ | `VOCAB[placeId]` trong places.js (có `pos`, `kind`, `at`; câu ví dụ ngắn, tự nhiên – tính từ/trạng từ chỉ thêm khi hợp lý, không làm khó người mới) |

- **Hạn mức theo cấp (riêng từng loại):** cấp 1–5: 6 câu nói, 2 câu hỏi, 10 từ vựng. Từ cấp 6: mỗi cấp thêm 3 / 1 / 5 (tỉ lệ 3 : 1 : 5). Đầy hạn mức thì NPC vẫn nói chuyện nhưng không cho thẻ mới, nhắc đi luyện.
- **Độ thuộc 0–3 ⭐ mỗi thẻ:** tăng khi nói đúng câu của thẻ lúc đánh Echo Ghost, gặp lại NPC, hoặc nói lại từ ở chỗ trưng bày. Quái chọn đề từ cả 3 loại thẻ, thẻ ít sao ra nhiều hơn.
- **Lên cấp:** theo đường cong EXP tới Lv.100 (`XP_CUM`, engine.js); **từ Lv.3, mỗi loại thẻ phải có số thẻ đạt ⭐⭐ ≥ 70% hạn mức của cấp hiện tại** (`levelGate`, parts/ui/progress.js), thiếu thì EXP dừng ở 100%. Cấp lưu trong `save.level`.
- **NPC theo cấp:** `minLv` trong lessons.js (vd Uncle Tu – Cafe Owner chỉ tiếp từ Lv.5). Tên trên đầu ghi "· Lv.5".
- **Đồ trưng bày đúng ngữ cảnh:** mỗi món có `at` = khu đặt (quầy pha chế, tủ bánh, quầy tính tiền, kệ, quầy cửa kính, sofa, góc cây, trần, lối vào). Bày **tất cả** cùng lúc (không xoay vòng theo người chơi – người dùng đã chốt). ❓ = chưa học, ✅ = đã có thẻ. Hỏi bằng cách **chạm thẳng vào đồ** hoặc đứng gần bấm ❓.

### Nội thất (làm theo ảnh người dùng gửi, từng nơi)
- Phòng có thể to riêng: `size: { w, d, h }` trong places.js (mặc định 16 × 12).
- **Camera trong nhà luôn ở bên trong phòng** (sau lưng nhân vật, không vượt tường/trần); kéo màn hình xuống để ngước lên nhìn trần.
- **Post Office** (24 × 48 m, theo Bưu điện Trung tâm Sài Gòn): mái vòm cong có giếng trời + sườn sắt xanh, tường kem cửa sổ vòm, cột sắt xanh, quầy giao dịch 2 bên có số, quầy lưu niệm đỏ giữa sảnh, ghế gỗ mặt đỏ, bản đồ cổ + bản đồ thế giới + đồng hồ ở tường cuối (không treo chân dung lãnh tụ), buồng điện thoại, bàn viết thư, quạt trần, đèn treo. 5 NPC: Mr. Brown, Ms. Thu (quầy gửi hàng), Kevin (khách du lịch), Mrs. Lan (bán lưu niệm), Uncle Bay (người viết thư, Lv.5). 40 từ vựng.
- **Verse Library** (28 × 40 m, trần 12 m, `layout: "oval"`, theo ảnh phòng đọc bầu dục): tường cong 3 tầng kệ sách dưới các vòm, 2 tầng ban công lan can, mái vòm có cửa sổ tròn + giếng trời kính, quầy thủ thư tròn ở tâm (Ms. Green đứng trong), 5 NPC (Ms. Green, Tom – học sinh, Mrs. Hoa – xếp sách, Lily – bé đọc sách, Grandpa Vinh – Lv.5), 32 từ vựng, 11 dãy bàn đọc tỏa ra như nan quạt có đèn chụp xanh (vẽ bằng `InstancedMesh` cho nhẹ), thảm xanh ngọc, lối vào thẳng từ cửa. Camera bị giữ trong hình elip. Code: `furnishReadingRoom`.
- **City Museum** (60 × 72 m, trần 14 m, `layout: "museumhall"`, code `furnishMuseum` + `museumPaint`): **sảnh chính** dọc giữa (quầy vé, bản đồ bảo tàng, tủ gửi đồ, hộp quyên góp, trụ chỉ đường, cửa hàng lưu niệm cuối sảnh; Leo – hướng dẫn viên) và **4 khu 24 × 36 m**, mỗi khu 4 NPC (1 NPC Lv.5):
  - 🦖 **Dinosaur Hall** (trước–trái): tường đá Romanesque 2 tầng vòm, mái vòm có 2 dải ô kính, cầu thang lớn, bộ xương T. rex + khủng long cổ dài, thằn lằn bay treo trần, đầu khủng long 3 sừng, tổ trứng, thiên thạch, 6 tủ hóa thạch, bảng niên đại. NPC: Dr. Rex, Ben, Ms. Ivy, Dr. Kim (Lv.5).
  - 🗿 **Sculpture & Antiques** (sau–trái): sân trong mái kính, tường đá vòm cuốn sáng ấm, bậc thềm có lan can + 2 tượng ngựa, tượng cẩm thạch (giơ tay, suy tư, ném đĩa…), tượng sư tử, tượng bán thân, 2 cây xanh, tủ cổ vật, **trống đồng Đông Sơn**, áo giáp, bình gốm. NPC: Marco, Anna, Uncle Tuan, Dr. Phuong (Lv.5).
  - 🖼️ **Painting Gallery** (sau–phải): tường đỏ, trần vòm hắt hoa văn + giếng trời dài, sàn gỗ xương cá, 12 tranh khung vàng có bảng tên (Mona Lisa trong tủ kính + dây chắn, The Starry Night, Sunflowers, The Scream, The Great Wave, Girl with a Pearl Earring, Water Lilies + tranh của "Verse City Artist"), ghế nhung, góc vẽ tranh. NPC: Mrs. Rose, Nam, Sophie, Mr. Henry (Lv.5).
  - 🚀 **Science & Space** (trước–phải): mái vòm lưới thép trắng, tường xanh có chòm sao, quả địa cầu khổng lồ (chấm đỏ = Việt Nam), 2 tên lửa, trạm vũ trụ, máy bay trên cột, hành tinh treo (Sao Thổ có vành), phi hành gia, robot, chuỗi ADN, kính thiên văn, góc thí nghiệm, cuộn Tesla. NPC: Captain Sky, Ms. Nova, Robo-7, Dr. Minh (Lv.5).
  - Kỹ thuật: vách ngăn là mặt phẳng quay vào trong từng khu; `P.zones` giữ camera trong khu đang đứng; phòng rộng > 40 m đặt ở hàng z = 440 để không chồng lên phòng khác.
- **Verse Bank** (28 × 44 m, trần 13 m, `layout: "bankhall"`, theo ảnh Ngân hàng Nhà nước TP.HCM + **màu thương hiệu xanh lá đậm** `BANK_GREEN`, logo tự chế: tròn xanh, chữ V trắng, đồng xu vàng – `bankLogo()`): 6 cột đá granite + dầm đá quanh giếng trời kính cam – vàng 2 tầng, tầng lửng lan can sắt đen 2 bên + phía trước, băng rôn xanh, quầy giao dịch chữ U (kính, hoa sắt, số 1–10 xanh), dây xếp hàng, tủ trưng bày tiền xưa dọc 2 tường, khu chờ ghế xanh + màn hình "NOW SERVING" + máy lấy số, 3 ATM, bảng tiền Verse City, bảng tỷ giá, cửa chính hoa sắt hình tròn + cổng an ninh, phòng két cuối sảnh (cửa két tròn, tủ két sắt). 5 NPC: Linh (giao dịch), Mr. Hai (bảo vệ), Ms. Mai (đổi tiền), Grandma Sau (nhờ dùng ATM – dạy giữ bí mật mã PIN), Mr. Quang (giám đốc, Lv.5). 34 từ vựng. Code: `furnishBankHall`.
- **Cafe Sua Da** (20 × 48 m, trần 8 m, kiểu nhà kính – theo ảnh quán cà phê nhà kính): khu trước "The Green Corner" (bàn bình thủy sinh, sen đá, cây lá to), khu giữa chỗ ngồi (quầy bar gỗ dọc cửa kính + ghế cao, 3 góc sofa, cây treo, bóng đèn dây, máy lạnh), khu sau quầy pha chế (máy espresso, máy xay, tủ bánh, máy tính tiền, menu bảng đen, kệ, bao cà phê). 6 NPC: Mia (barista), Vy (thu ngân), Bao (phục vụ), Grace (khách), Mr. Kha (bán cây), Uncle Tu (chủ quán, Lv.5). **58 từ vựng**. Mái kính trong suốt (nhìn lên thấy trời).

### Kinh tế
- 🪙 Xu: từ NPC, hạ quái, mê cung, (sau này) bán đồ tự làm.
- ⚡ Năng lượng: đánh quái tốn, tự hồi chậm, ăn để hồi nhanh.
- ☠️ Trúng độc: thuốc ở nhà thuốc chữa; vaccine bảo vệ thêm 5 phút.
- Sau này: **chợ người chơi** (mua bán, trao đổi **bằng cách mặc cả tiếng Anh**), tặng quà qua bưu điện.
- **Thận trọng với tiền thật, hộp quà ngẫu nhiên, mua bán giữa trẻ em** – cần tư vấn pháp lý trước.

### Danh nhân (CLIL) – mỗi người một chuỗi nhiệm vụ, thưởng một kỹ năng
| Danh nhân | Ở đâu | Kỹ năng | Dùng để |
|---|---|---|---|
| Louis Pasteur | City Hospital (đã có bàn thí nghiệm) | Pha thuốc | Bán cho nhà thuốc, chữa NPC |
| Anh em nhà Wright | Sân bay (chưa có) | Tàu lượn | Bay qua thành phố |
| G. W. Carver | Nông trại (chưa có) | Trồng trọt | Vòng "cày" hằng ngày |
| Edison / Tesla | Nhà máy điện (chưa có) | Thắp sáng | Thắp đèn nhà, phố về đêm |
| Ada Lovelace | Science Lab (chưa có) | Robot phụ tá | Thú cưng robot |
| Shakespeare | Thư viện (chưa có) | – | Nhiệm vụ đọc |
| Lương Thế Vinh, Tôn Thất Tùng | Trường học, bệnh viện | – | Tự hào văn hóa, nói về Việt Nam bằng tiếng Anh |

**Bản mở rộng 30 danh nhân (25/11):** `docs/bible/scholars.js`.

*Nội dung danh nhân phải chính xác lịch sử, không bịa trích dẫn, có người duyệt; tránh nhân vật chính trị nhạy cảm và người còn sống.*

### Thành phố – quy hoạch (PR #22)
Verse City chia **9 khu như bàn cờ 3 × 3** (dữ liệu `ZONES`, `METRO`, `LOTS` cuối `places.js`). Bắc = phía z âm. Kích thước ≈ 300 × 300 m, ranh giới ±150.

| | Tây (x −150…−50) | Giữa (x −44…44) | Đông (x 50…150) |
|---|---|---|---|
| **Bắc** (z −150…−66) | Tech Valley – công nghệ cao: Science Lab, 🚧 Tech Park, Robotics Lab, Space Center | Sports District – thể thao: Stadium, cổng Maze, 🚧 Sports Center, Swimming Pool | Industrial Park – công nghiệp: Power Plant, Fix-It Workshop, Airfield, 🚧 Factory |
| **Giữa** (z −60…60) | Maple Town – dân cư & công cộng: My Home, School, Hospital, Police, Fire, 🚧 nhà ở, Clinic | **Civic Center – hành chính**: Town Hall + quảng trường đi bộ dài (kiểu Nguyễn Huệ: bồn hoa, hàng cây, đài phun nước, tượng đài quả cầu EnglishVerse), Post Office, Bank, Cafe Sua Da, Museum, Library, 🚧 Verse Hotel | Market District – thương mại, dịch vụ: Market Street (Banh Mi Bakery, Green Cross Pharmacy, Clothes Shop, Saigon Barber, Pho Corner, Home & Cozy, Shop 24h), Star Cinema, Wet Market, 🚧 Shopping Mall, Bookshop, Toy Store |
| **Nam** (z 66…150) | Green Fields – nông nghiệp: Green Farm, 🚧 Orchard, Fish Pond, Rice Field | Station Square: Train Station (nhìn thẳng về Town Hall), Bus Stop, Verse Lake, 🚧 Bus Terminal | Wild Woods – thiên nhiên: City Zoo, Misty Park (quái), 🚧 Botanical Garden |

- Đường vành đai x = ±47, z = ±63; mỗi khu có trục đường riêng. Nhà quay mặt ra đường gần nhất (đủ 4 hướng).
- **Đảo đấu trường Verse Arena** (bên trái/phía tây thành phố, x −310…−210, z −80…80): sông bao quanh, tường thành gạch có răng cưa + 4 vọng lâu, **3 cổng kiểu Ngọ Môn** (đông – cầu từ thành phố, bắc, nam; mỗi cổng 3 cửa vòm đều đi qua được, cầu rộng 26 m). Ở giữa là **Grand Arena** (đấu trường tròn). Mọi trò ở đây là **trò đồng đội bắt buộc giao tiếp tiếng Anh**; The Maze đã dời vào đảo. 🚧 Chờ làm: Quiz Tower, Word Race, Treasure Hunt, Team Battle (đề xuất luật chơi ở mục 6).
- **Vùng hoang dã có quái (ý tưởng người dùng, làm sau):** quái không chỉ ở Misty Park mà ở **toàn bộ vùng bên ngoài thành phố**, nhiều cảnh khác nhau (rừng, đồi, đầm lầy, hang, phế tích…), càng xa càng mạnh. Cổng bắc/nam của đảo và các đường ra rìa bản đồ sẽ dẫn ra vùng này. Ranh giới hiện tại: x −360…150, z ±150.
- **Metro**: mỗi khu 1 trạm (chữ M xanh), đứng gần bấm 🚇 Metro để đi nhanh. **Bus Stop** chỉ để trang trí / nhiệm vụ. **Train Station** sau này dùng để đi sang thành phố khác.
- **🚧 Ô đất chờ xây** (`LOTS`): hàng rào cam trắng + bảng "Coming soon"; ô lớn (`big: true`) có cần cẩu. Khi xây thật: chuyển ô đó thành một mục trong `CITY` cùng tọa độ.
- Ngoại thất vẽ riêng theo ảnh thật (mục `8c`, `8e` trong index.html, `exterior:` trong places.js): Town Hall (UBND TP.HCM), City Hospital (BV Chợ Rẫy), Verse School (trường Lê Quý Đôn), Cafe Sua Da (nhà ống Việt Nam), My Home, Train Station (ga Đà Lạt: 3 đầu hồi vàng viền đỏ, tàu xanh lá), Banh Mi Bakery (ổ bánh mì khổng lồ), Green Cross Pharmacy, Clothes Shop, Saigon Barber (cột đèn sọc xoay), Shop 24h (cửa hàng tiện lợi), Home & Cozy (sofa trên nóc), Police Station (trụ sở công an kiểu Pháp ở Hà Nội: tường vàng, cổng sắt, chòi gác), Fire Station (gạch đỏ, tháp canh, xe cứu hỏa), Verse Plaza (trung tâm thương mại theo Gigamall: ốp lưới thoi, tháp tròn kính xanh), Post Office (Bưu điện Trung tâm Sài Gòn: tường vàng, 2 tầng cửa vòm, khối giữa có đồng hồ, mái ngói cam, sân cỏ + cây cọ; mặt tiền 28 m), Verse Bank (Ngân hàng Nhà nước, cột granite, mái cam giếng trời), Verse Library (Thư viện KHTH, lam bê tông hoa văn), City Museum (Bảo tàng TP.HCM, cột đôi, sảnh bán nguyệt). Biển hiệu tự thiết kế, **không dùng logo thương hiệu thật**. Các nơi khác vẫn dùng tạm mô hình nhà phố KayKit; người dùng gửi hình theo đợt.
- **My Home sẽ nâng cấp được** (ý tưởng của người dùng): bỏ xu (+ điều kiện thành tích) để xây to hơn, nhiều kiểu nhà, giá khác nhau.
- Camera 2 chế độ: 🔍 gần (giao tiếp, thao tác) / 🔭 rộng (nhìn tổng thể; tự về gần khi đang nói chuyện). Tốc độ đi 6 m/giây.
- Mỗi địa điểm cần: **nhu cầu trong game + từ vựng/mẫu câu riêng + thứ để sưu tầm/khám phá**.

### Xã hội & an toàn
- Câu nhanh tiếng Anh (🗨️ Say), giọng nói chỉ gửi phần máy nghe ra là tiếng Anh, lọc từ xấu, chống spam.
- Trạm mê cung 2 người / 2 vs 2, Best Speaker.
- Sau này: nhà riêng (mời bạn, sổ khách bằng giọng nói), chụp ảnh khoe mạng xã hội, bang hội.
- **An toàn trẻ em:** nút báo cáo, kiểm duyệt, tách server/ghép trận theo độ tuổi, giới hạn tương tác với người dưới 13 tuổi. Lưu ý **Nghị định 13/2023** (dữ liệu cá nhân – giọng nói trẻ em là dữ liệu nhạy cảm) và quy định về game online cho người dưới 18 tuổi.
- Sau này cần **giới hạn chơi lành mạnh** (trần phần thưởng mỗi ngày, bảng theo dõi cho phụ huynh).

---

## 4. Kỹ thuật hiện tại

### File
| File | Nội dung |
|---|---|
| `index.html` | Toàn bộ game (HTML + CSS + JS, không có bước build), ~3.300 dòng |
| `lessons.js` | Mảng `LESSONS`: NPC hội thoại. Mỗi bước: `say`, `choices`, `card` (thẻ câu nói), `q` (thẻ câu hỏi). NPC có `place: "id"` thì đứng trong nhà đó (x, z tính từ giữa phòng, z âm = phía trong cùng); `minLv` = cấp tối thiểu |
| `places.js` | `ITEMS` (đồ ăn, thuốc, trang phục, dịch vụ cắt tóc, nội thất), `RARITY`, `LEGENDS`, `STARTER`, `CITY` (nhà vào được), `SPOTS` (khu ngoài trời), `ZONES` (9 khu + đảo), `METRO`, `LOTS` (ô đất chờ xây), `AMBIENT` (NPC đi tuần/trực gác), `VOCAB` (từ vựng theo nơi) |
| `parts/` | `registry.js` (danh bạ `INTERIORS`, `EXTERIORS_EXTRA`) + `interiors/<id>.js` (cafe, post, library, bank, museum) + `exteriors/` – mỗi nơi 1 file, xem `docs/TEAM.md` |
| `tools/qa/run.js` | **Cổng QA**: `node tools/qa/run.js [id…]` – kiểm dữ liệu NPC/từ vựng, lỗi JS, đường đi tới NPC/đồ/cửa, số lần vẽ; ảnh ở `tools/qa/out/` |
| `docs/TEAM.md` | Vận hành đội AI: mục tiêu, phân quyền, quy trình, mẫu đề bài, sổ tay kỹ thuật, backup |
| `lib/` | three.js r128, GLTFLoader, SkeletonUtils, supabase-js (để sẵn, không dùng CDN) |
| `assets/` | Mô hình 3D KayKit (CC0) – `characters/`, `city/`, `furniture/`; nguồn trong `assets/CREDITS.md` |
| `parts/world/nature.js` + `assets/nature/` | Cây cỏ mô hình Quaternius (CC0, ~2 MB GLB): `NATURE.tree / place(kind) / bush / ground`, gộp theo ô 40 m, lá làm mềm + trong suốt khi che người chơi. wilds.js (`lushTree/pine/maple/cactus/palm`) và index.html (`tree()`, `bigTree()` ngoại thất, bồn hoa quảng trường) gọi vào |
| `parts/combat/feel.js` | Game feel chiến đấu (`FEEL`): khựng hình, văng lùi, vệt chém, viền đỏ khi bị đánh, nổ khi quái chết |
| `CLAUDE.md` | Quy tắc làm việc |

### Bản đồ code trong `index.html` (tìm theo tiêu đề `/* ===== ... */`)
- `2` dựng cảnh, ánh sáng, bóng đổ, nhân vật 3D (`makeChar`, `setAvatar`, `buildComposite`, `charAct`), nạp `save`, `blocked()` (va chạm, ranh giới, sông)
- `2b` quy hoạch: `road()` → `ROADS`, quảng trường đi bộ, đảo Arena (`ISLAND`, `RIVER`, `BRIDGES`), cây, cổng mê cung (`MAZE_GX/GZ`)
- `3` điều khiển, camera, chặn trình duyệt tự phóng to · `4` hội thoại NPC (`showStep`, `minLv`), giọng đọc `pickVoice` · `4b` nhận dạng giọng nói, `holdMic`
- `4d` **sổ thẻ**: `allCards`, `gainCard(card, type)`, `cardCap`, `practice`, `masteryRatio`, album 3 tab
- `4e` online Supabase · `6a/6b/6c` mê cung · `4f` câu nhanh · `4g` kinh tế, túi đồ, trang phục (`wear`, `gear`), rương, Legendary · `4c` hỏi đường (`targets`)
- `7` Echo Ghost: `checkLevel` (cấp + điều kiện thuộc thẻ), `pickLine` (đề từ thẻ), `hitGhost`
- `8` thành phố: `buildHouse`, `buildInterior` (phòng theo `size`), `furnish` (theo `layout`), `furnishGreenhouse` (Cafe Sua Da), `furnishPostHall` (Post Office), `refreshVocab` + chạm vào đồ (`tapRay`), `openVocab`/`revealVocab`, nhà riêng (`furnishHome`, `homeRefresh`, `openGallery`), `SPOT_BUILD` (khu ngoài trời), cửa hàng (`buy`, `drawShop`)
- `8c` / `8e` / `8f` ngoại thất vẽ riêng (`EXTERIOR.<tên>` + `buildCustom`), ô đất chờ xây (`lot`), metro, nhà ga
- `8b` bản đồ nhỏ + bản đồ lớn · `8d` metro, camera 2 chế độ (`setWide`), bảng tên khu · `5` vòng lặp game, camera (trong nhà / ngoài trời)

### Hiệu năng (đo bằng `renderer.info`, mục `9` trong index.html)
- **Gộp khối tĩnh** (`bakeWorld` → `bakeStatic`): chạy 1 lần lúc tải (~0,1 giây), gộp các khối đứng yên cùng chất liệu thành 1 mảng. Ngoài trời chia ô 40 m. Không gộp: nhân vật, cờ, quạt, cần cẩu, mây, đồ từ vựng (`P.vgroup`), đồ nhà riêng (`P.dyn`), mô hình .gltf tải sau. **Vật cần chuyển động / đổi hiện–ẩn sau này phải cho vào danh sách bỏ qua** (`dyn` trong `bakeWorld`), nếu không sẽ bị gộp cứng.
- **Bóng đổ thông minh** (`castsShadow`): khối nhỏ (< 0,4 m), tấm phẳng mỏng, biển chữ không đổ bóng; NPC dùng bóng tròn dưới chân, chỉ nhân vật người chơi đổ bóng thật; bản đồ bóng 1024.
- NPC trong phòng khác không vẽ; nhân vật ở xa ẩn theo cùng tầm nhìn với nhà (95 m / 150 m góc rộng). Đồ từ vựng: hình + dấu ❓/✅ chung 1 ảnh.
- Kết quả: lần vẽ mỗi khung 1.267 → ~210 (quảng trường), bảo tàng 1.673 → ~250; tam giác 563k → ~76k.
- iPhone bật **Chế độ nguồn điện thấp** sẽ khóa web ở 30 fps; mở trong Zalo chậm hơn Safari.

### Cách thêm một nơi mới (công thức đã dùng)
1. **Ngoại thất:** viết `EXTERIOR.<tên>(g, P)` trong index.html, vẽ trong hệ tọa độ riêng (mặt tiền quay +z). Trả về `{ solids, door, map }`. Ghi `exterior: "<tên>"` vào mục đó trong `CITY`. Mặt tường dùng ảnh vẽ bằng canvas (`skin` + `face`) cho nhẹ máy.
2. **Nội thất:** thêm `size: { w, d, h }` và `layout: "<tên>"` trong `CITY`; viết `furnish<Tên>(P, g, cx, cz, W, D, fur)`. Phải đặt `P.anchors = { khu: [[x, y, z, chỗ đứng x, z], …] }` và `P.vgroup`.
3. **NPC:** thêm vào `lessons.js` với `place`, tối thiểu 4 NPC/nơi, mỗi NPC 3 bước, có `card` và vài `q`; NPC khó thêm `minLv`.
4. **Từ vựng:** thêm `VOCAB.<placeId>` trong places.js, mỗi món có `at` = tên khu trong `P.anchors`, `kind`, câu ví dụ ngắn tự nhiên.
5. Chạy kiểm tra: cửa ra vào không bị chặn, NPC không nằm trong vật cản, mọi món từ vựng có chỗ bày (số món mỗi `at` ≤ số chỗ của khu đó).

### Công nghệ
- **Three.js r128** + GLTFLoader, SkeletonUtils, supabase-js 2.89.0 trong `lib/`. (Trình duyệt chặn theo dõi từng cảnh báo "reduce protections" khi tải từ CDN.)
- **Supabase Realtime** (khóa publishable là khóa công khai, được phép): kênh `town` (vị trí, tên, màu, trang phục, chat), `maze-duo` / `maze-team` (phòng chờ, Presence), `match-<id>` (báo đội thắng).
- **Lưu trên máy (localStorage):** `ev_name`, `ev_cards` (danh sách thẻ dạng `p:` / `q:` / `v:` + từ), `ev_save` (⭐ `xp`, `level`, `mastery` = sao từng thẻ, xu, năng lượng, độc, `items` = túi 20 ô, `chest` = rương 60 ô, `equip`, `head`, `decor`, `spoken`, `legends`), `ev_spirits`. **Chưa có tài khoản, server chưa lưu gì.**
- **Web Speech API** (miễn phí) cho nhận dạng giọng nói và đọc to; `pickVoice()` chọn giọng tự nhiên nhất máy có.
- **GitHub Pages:** merge vào `main` là tự đăng tại `https://locaenglishvn.github.io/englishverse/`.
- **Môi trường Claude Code "englishverse":** đã mở mạng tới Supabase để chạy thử nhiều người chơi.

### Cách kiểm thử (để phiên sau làm lại)
- Chạy `python3 -m http.server 8765` trong repo (chạy nền, có thời hạn – tắt thì mở lại), dùng Playwright (Chromium có sẵn) mở trang.
- Đặt `localStorage.ev_name` để bỏ qua màn tạo nhân vật.
- Trong `page.evaluate` gọi thẳng biến của game: `player`, `save`, `room`, `enterRoom(CITY.find(c => c.id === "cafe"))`, `openVocab(VOCAB.post[0])`, `buy(id)`, `wear(id)`, `blocked(x, z)`…
- **Chụp ảnh đẹp từ trên cao:** gán `window.requestAnimationFrame = () => 0` để dừng vòng lặp, rồi tự đặt `camera.position`, `camera.lookAt`, gọi `renderer.render(scene, camera)`.
- **Micro giả lập:** thay `window.SpeechRecognition` **và** `window.webkitSpeechRecognition` bằng class giả, khi `stop()` gọi `onresult` với câu định sẵn (`window.__say`) rồi `onend`.
- **Kiểm tra lối đi:** với mỗi `CITY`/`LOTS`/`METRO`, đi từ `doorPos` ra 6 m theo hướng cửa, không được `blocked`; khối nhà (`mapParts`) không chồng nhau, không đè lên đường.
- Nhiều người chơi: mở nhiều `browser.newContext()`.

### Quy ước làm việc
- PR nhỏ, từng bước; **chỉ merge khi người dùng bảo**; giải thích ngắn gọn bằng tiếng Việt, giải thích thuật ngữ mới.
- Người dùng gửi **ảnh thật** cho từng nơi (ngoại thất, rồi nội thất); mình dựng lại theo phong cách hoạt hình, mặt bên/sau tự suy ra.
- **Không dùng logo/thương hiệu thật** (tự đặt tên + logo). **Không treo chân dung lãnh tụ** hay biểu tượng chính trị nhạy cảm trong nội thất (cờ ở công trình công cộng thì được).
- Nội dung (NPC, bài học, vật phẩm, từ vựng) để trong `lessons.js` / `places.js`, không viết cứng trong code. Nội dung danh nhân phải đúng lịch sử, có người duyệt.
- Mô hình 3D mới: ưu tiên bộ CC0, ghi nguồn trong `assets/CREDITS.md`.

---

## 5. Đã làm (PR #1–#26)
1. `CLAUDE.md`, tầm nhìn metaverse
2. Thị trấn ban đầu; hỏi đường "Where is …?" có mũi tên dẫn đường
3. Thẻ từ vựng và sổ sưu tập
4. Online: thấy người chơi khác, tên tiếng Anh, câu nhanh và giọng nói chỉ nhận tiếng Anh
5. Trạm mê cung: phòng chờ, ghép đội cân sức, guide/walker, cổng EXIT, giữ để nói, Best Speaker
6. Đánh quái Echo Ghost bằng giọng nói, Word Spirit, bị câm, trúng độc
7. Xu, năng lượng, túi đồ, lưu tiến độ; bóng đổ, bầu trời, mây
8. Thành phố mở rộng: 6 tòa nhà đi vào được, mua hàng bằng giọng nói (giảm 10%)
9. Đồ họa KayKit: nhân vật 3D có hoạt ảnh (5 loại), nhà phố, đồ trang trí phố, nội thất
10. Camera không xuyên tường, camera nhảy ngay khi vào/ra nhà; giữ để nói ở mọi nút micro
11. **Trang phục** (4 ô, 5 độ hiếm, chỉ số có tác dụng), tạo nhân vật chỉ chọn mặt + tóc, bán 23 món, Legendary bằng thành tích
12. **Túi đồ dạng ô** (20 ô), **nhà riêng** My Home: rương 60 ô, gương thay đồ, phòng trưng bày, nội thất mua về nhà
13. Bản đồ mở rộng, 15 địa điểm mới + 7 khu ngoài trời, 16 NPC mới, tên + nghề trên đầu NPC
14. **Bản đồ nhỏ** xoay theo hướng nhìn; bản đồ lớn chạm để được chỉ đường
15. Giọng đọc tự nhiên hơn; tinh linh trưng ở nhà; thư viện để trong `lib/`
16. Ngoại thất đợt 1: Town Hall, City Hospital, Verse School, Cafe Sua Da, My Home
17. **Quy hoạch lại thành phố** 9 khu, quảng trường đi bộ trước Town Hall, metro mỗi khu, 20 ô đất chờ xây, nhà ga + đường ray, hồ, camera gần/rộng, đi nhanh hơn 50%, bảng tên khu
18. Ngoại thất đợt 2: nhà ga kiểu Đà Lạt + 6 cửa hàng Market Street (đổi tên: Banh Mi Bakery, Clothes Shop, Saigon Barber, Shop 24h, Home & Cozy)
19. Ngoại thất đợt 3: Post Office, Verse Bank, Verse Library, City Museum; sửa lỗi trang tự phóng to, camera giật sát
20. Đồn công an, trạm cứu hỏa; **đảo đấu trường Verse Arena** (sông, cầu, tường thành, 3 cổng Ngọ Môn, Grand Arena); The Maze dời vào đảo
21. Verse Plaza (trung tâm thương mại); NPC đi tuần/trực gác (`AMBIENT`); cổng Arena 3 cửa đi qua được
22. **Sổ thẻ 3 loại + hạn mức theo cấp + sao luyện tập**; NPC theo cấp; **nội thất Cafe Sua Da** (nhà kính 20 × 48 m, trần 8 m), 6 NPC, 58 từ vựng; camera trong nhà nhìn được tường và trần
23. Hỏi từ vựng **bắt buộc bằng giọng nói**, câu hỏi theo cấp (Lv.20+); câu ví dụ đơn giản; **nội thất Post Office** (sảnh vòm kiểu Bưu điện Sài Gòn), 5 NPC, 40 từ vựng
24. **Ngoại thất Post Office** làm lại theo Bưu điện Trung tâm Sài Gòn; **nội thất Verse Library** (phòng đọc bầu dục, mái vòm)
25. Library đủ 5 NPC + 32 từ vựng; **đổi chỗ Verse Plaza ↔ Star Cinema** (Verse Plaza ở x 64,5 z 16, quay mặt về quảng trường); **nội thất Verse Bank** (5 NPC, 34 từ vựng)
26. **Nội thất City Museum** 4 khu (khủng long, điêu khắc & cổ vật, tranh nổi tiếng, khoa học & vũ trụ), 17 NPC, 68 từ vựng
27. **Tối ưu hiệu năng**: gộp khối tĩnh, bóng đổ thông minh, ẩn NPC phòng khác → lần vẽ mỗi khung giảm từ ~1.270 xuống ~210
28. **Vận hành đội AI**: tách nội thất ra `parts/`, cổng QA `tools/qa/run.js`, `docs/TEAM.md`; sửa kẹt cửa Trường học / Đồn công an
29. **Đợt 1 (đội AI)**: nội thất Town Hall, City Hospital, Verse School; 15 NPC mới + 92 từ vựng (Haiku viết, CTO soát); QA thêm `--data`
30. **Đợt 2 (đội AI)**: nội thất Verse Plaza + 4 cửa hàng Market Street (Banh Mi Bakery, Pho Corner, Shop 24h, Green Cross Pharmacy; khung chung `parts/interiors/shopkit.js`); 22 NPC mới + 107 từ vựng
31. **Đợt 3 (đội AI)**: nội thất Clothes Shop, Saigon Barber, Home & Cozy (shopKit; Home & Cozy trưng đúng đồ đang bán), Police Station, Fire Station; 20 NPC mới + 107 từ vựng, nội dung an toàn trẻ em (113/114/115, an toàn giao thông, cháy nổ)
35. **Chiến đấu – giai đoạn C**: vòng 2 (Lv.25–50) ở 5 hướng (Glacier Heights, Maple Falls, Echo Gorge, Coral Isles, Bamboo Hills), 4 quái mới (Tense Turtle, Shy Slime, Mimic Parrot, Story Owl); **quái chung nhiều người** (chủ phòng điều khiển quái, chia thưởng theo đóng góp, đồ rơi riêng); đổi đồ giữa người chơi bằng lời nói; bản đồ lớn hiện cả vùng hoang dã
34. **Chiến đấu – giai đoạn B + một phần C**: đủ 4 nhánh × 10 ô kỹ năng (khống chế, tăng sức, nội tại, tuyệt chiêu Lv.40), hiệu ứng chiêu đổi hình ở bậc 1/3/5 (`parts/combat/vfx.js`), vũ khí 3D cầm tay 4 dòng × 8 bậc + Maestro (`parts/combat/weapons3d.js`), xem trước chiêu, rung camera; bán đồ cho tiệm bằng lời nói; loại bài Ask (Lv.40+, 90 đề); chat an toàn cho trẻ em + khoá phụ huynh (`parts/social/safechat.js`); lập đội bằng lời nói, +20% kinh nghiệm, Duet ×2 (`parts/social/team.js`); chỉ số 💛 Heart
33. **Chiến đấu bằng giọng nói – giai đoạn A**: 5 vùng hoang dã vòng 1 quanh thành phố (Frost Peaks, Maple Highlands, Sunset Canyon, Coral Coast, Blossom Valley; `parts/world/wilds.js`), 5 loại quái theo mùa (`parts/combat/models.js`), chiến đấu thời gian thực (`parts/combat/engine.js`): máu/mana, ⚔️ đánh thường, 6 chiêu Power + Rhythm, Voice Deck 4 loại bài (`deck.js`, 320 đề), khiên −70%, rơi đồ để nhặt, vũ khí 4 dòng × 8 bậc + Maestro, cấp tối đa Lv.100 (~360 giờ), quá 2 giờ/ngày không còn kinh nghiệm
36. **Góp ý chơi thử 16/11** (thiết kế: `docs/design/playtest-1611.html`): bộ khung giao diện chung `parts/ui/theme.js` (góc vát, viền vàng, khối nổi; mọi bảng/nút mới dùng lại lớp `.ev-*`); HUD chân dung mới `parts/ui/hud.js` (máu, mana, thanh EXP, ⚔️ Lực chiến; bỏ số ⭐ và thanh tím Harmony → hào quang tím quanh nhân vật); nút chiêu tròn xếp vòng cung; thẻ đề có nhãn loại bài (REPEAT/ANSWER/BUILD/NAME/ASK) + nghĩa tiếng Việt, dòng hướng dẫn chỉ ở Lv.1–2; quái có thanh máu + màu tên theo chênh cấp (💀 khi mạnh hơn ≥ 8 cấp); hướng dẫn 5 bước lần đầu ra vùng hoang dã; ô dùng nhanh chỉ ❤️ / 💧 / ☠️ (đồ uống mana mới); **camera vùng hoang dã cố định hướng Bắc**, kéo dọc đổi góc 35°–78°; **máu không tự hồi** (đồ ăn, ngủ giường My Home miễn phí, áo choàng hpRegen; hết máu về cổng 30%); **lên cấp cần thẻ**: từ Lv.3, mỗi loại thẻ cần ≥ 70% hạn mức đạt ⭐⭐, thiếu thì EXP dừng ở 100%, bảng "Lên cấp cần gì" + dẫn đường (`parts/ui/progress.js`); người mới Lv.1–4 chỉ ra đề từ thẻ đã có + `STARTER_DECK`, NPC Captain Echo; **túi đồ 8 ô** có nhân vật 3D xoay được, thử đồ so sánh ▲▼, bảng chỉ số, `powerScore()` (`parts/ui/bag.js`; save cũ top/legs tự chuyển armor/pants); **bảng kỹ năng** chia 4 tab, chỉ hiện chiêu kế tiếp, chiêu xa là "? ? ?", sân tập trong bảng (`parts/combat/skills-ui.js`)
37. **Góp ý chơi thử 16/11 – đợt 2**: camera vùng hoang dã 30°–78°; Captain Echo **tự chào người mới** và tặng thẻ khởi đầu (`echoIntro`, progress.js); người mới 80% đề từ thẻ của mình + 20% câu mới; hết máu về cổng **đầy máu**; **giữ nút chiêu = hiện đề và nói luôn**, chạm nhanh = chỉ xem đề + nghe mẫu; **chống giật khi ra chiêu** (`warmSkillFx`: phát trước hiệu ứng 4 chiêu ở chỗ xa rồi `renderer.compile`, lần đầu ra chiêu từ ~0,6 s đứng hình xuống < 30 ms); **tiếng Việt là giàn giáo, ẩn dần**: nghĩa câu mới trên thẻ đề chỉ hiện 2 lần đầu (sau đó nút "VI" để xem khi cần), thông báo song ngữ chỉ hiện tiếng Việt 3 lần đầu (`fadeVi` trong index.html; thêm `<!--vi-->` để luôn giữ); **bảng túi đồ / kỹ năng / lên cấp bằng tiếng Anh**; Lực chiến chỉ còn trong túi; thanh máu quái nhỏ gọn; túi đồ chỉ 1 vũ khí đang cầm (bỏ đổi 2 vũ khí), 2 tab Gear 15 ô / Items 15 ô, đồ giống nhau gộp ×N; bảng kỹ năng: nút 🌟 tròn cạnh 🎒, gắn chiêu bằng "Use ▸" (không còn lỡ tay gỡ chiêu), sân tập phát chiêu giống hệt ngoài trận
38. **Chơi thử 17/11**: sửa Preview chỉ xem được 1 lần; đồ mặc định áo thun trơn + quần short (`tee_basic`, `shorts_basic`); Harmony Heal hồi 12%, chờ 30 s; quái dày hơn (tối đa 14/vùng); nhãn quái: icon điểm yếu + tên nhỏ + **Lv to**, trắng (≤ +4 cấp) / cam (+5…+7) / đỏ 💀 (≥ +8); **cấp hiện cạnh tên người chơi** (cả online); NPC báo đầy thẻ ngay khi bắt đầu nói, thông báo 5 giây; **chọn câu theo sao** (`pickByStars`: 0 ⭐ ra nhiều nhất, 3 ⭐ hiếm, không lặp lại ngay); bớt giật khi bật/tắt micro (giữ nút không đọc mẫu, chấm điểm sau 120 ms); hào quang Harmony 10 s; **hạn mức thẻ tăng dần theo giờ chơi mỗi cấp** (`CAP_ADD`, index.html); **mã mời khoá theo máy** (`parts/ui/invite.js`, cài server bằng `docs/setup/invites.sql`; QA đặt `localStorage.ev_qa = "1"` để bỏ qua)
39. **3 dạng bài mới + bảng mở khoá**: `CHALLENGES` (engine.js) – REPEAT Lv.1 · NAME Lv.1 (cần thẻ từ vựng) · **LISTEN Lv.3** (không chữ, nghe rồi nói; nút 🔊 Again; nói xong hiện câu đúng) · ANSWER, BUILD Lv.5 · **FILL Lv.8** (che 1 từ trong câu của thẻ đã có) · **SOUNDS Lv.12** (`SOUNDS_DECK` trong deck.js: 72 câu, 8 nhóm âm khó cho người Việt: i dài/ngắn, u dài/ngắn, âm cuối t/d/k, -s, -ed, th, l/n, s/sh; nghe ra từ dễ nhầm thì chỉ được Weak) · ASK Lv.40. Bảng **📚 Challenges** trong 🌟 Skills: dạng đã mở sáng + cách làm + số lần làm tốt, dạng chưa mở mờ + điều kiện; lên cấp mở dạng mới thì có thông báo (`onLevelUp`, progress.js)
40. **Nhạc nền** (`parts/ui/music.js`): tự sinh bằng Web Audio (không file, không bản quyền), rất nhỏ; thành phố (ấm, vui nhẹ) / vùng hoang dã (phiêu lưu, tiếng sáo); tự hạ gần tắt khi máy đang đọc hoặc micro đang thu; nút 🎵 bật/tắt cạnh 🌟
41. **Mã mời gắn theo dấu vân tay máy** (băm loại máy, trình duyệt không kèm số phiên bản, màn hình, múi giờ, ngôn ngữ, CPU) thay vì số ngẫu nhiên lưu trong trình duyệt → trình duyệt xoá dữ liệu khi tắt vẫn vào lại được; mã của chủ dự án không khoá máy; xin trình duyệt giữ dữ liệu lâu dài (`navigator.storage.persist`). Không dùng IP (đổi khi chuyển mạng, cả trường dùng chung)
42. **📻 Bộ đàm đội** (`parts/social/radio.js`, chủ dự án chốt 18/11: giọng thật mặc định, KHÔNG cần phụ huynh bật, không tốn phí): chỉ khi trong đội; GIỮ nút để nói (≤ 10 s); mỗi lúc 1 người nói, người khác xếp hàng; kiểm duyệt trên máy người nói (≥ 60% từ tiếng Anh, không từ tục, không dãy số) → đạt thì gửi giọng thật (~24 kbps qua kênh Supabase) + phụ đề, không đạt thì đồng đội chỉ nghe beep; máy không thu song song được (thường iPhone) → tự chuyển bộ đàm chữ (máy bên kia đọc to); micro giữ sẵn 30 s; mỗi máy lưu 20 đoạn gần nhất, nút ⚠️ Report gửi đoạn ghi âm + chữ lên bảng `reports` (cài bằng `docs/setup/reports.sql`). Giới hạn: nhận dạng giọng có thể nghe nhầm câu tiếng Việt thành chữ tiếng Anh → hiếm khi lọt; cần thử trên iPhone thật
32. **Đợt 4 (theo góp ý chủ dự án)**: Home & Cozy dời cạnh Verse Plaza, nội thất 40 × 54 m tông tối có gu + ngoại thất to; **Verse Electronics** mới (siêu thị điện máy, 40 × 54 m); Bakery / Shop 24h / Pharmacy to bằng Cafe (20 × 48), Pharmacy có quầy thuốc vòng tròn; Clothes Shop 32 × 36; Pho 3 NPC, Barber 2 NPC; **tên NPC 80% tiếng Anh**, tên hiển thị không dấu; phòng trong nhà xếp theo bề rộng thật, người bán đặt được vị trí (`P.keeperAt`)

### Tình trạng nội thất
| Nơi | Nội thất | NPC | Từ vựng |
|---|---|---|---|
| Cafe Sua Da | ✅ nhà kính, 3 khu | 6 | 58 |
| Post Office | ✅ sảnh vòm | 5 | 40 |
| Verse Library | ✅ phòng đọc bầu dục | 5 | 32 |
| Verse Bank | ✅ sảnh giao dịch, giếng trời kính | 5 | 34 |
| City Museum | ✅ 60 × 72 m: sảnh + 4 khu | 17 | 68 |
| Town Hall | ✅ 32 × 40 m: sảnh thảm đỏ, quầy dịch vụ, bảng nhiệm vụ, phòng họp, văn phòng | 5 + Thị trưởng | 30 |
| City Hospital | ✅ 30 × 44 m: tiếp nhận, khu chờ, quầy thuốc, phòng khám, phòng bệnh, xét nghiệm | 6 + y tá Mai | 32 |
| Verse School | ✅ 30 × 36 m: bảng, 16 bàn đôi, góc khoa học, mỹ thuật & âm nhạc, tủ đồ, căng tin | 5 | 30 |
| Verse Plaza | ✅ 36 × 44 m: sảnh giếng trời, đài phun nước, thang cuốn, Toy Island, Tech Zone, Sport Star, Food Court | 6 | 27 |
| Banh Mi Bakery · Shop 24h · Green Cross Pharmacy | ✅ 20 × 48 m mỗi tiệm (Pharmacy: quầy vòng tròn) | 4 + người bán | 38 / 38 / 34 |
| Pho Corner | ✅ 16 × 18 m | 3 + người bán | 20 |
| Clothes Shop | ✅ 32 × 36 m: sào treo, bàn đồ gấp, bục ma-nơ-canh, giày, phụ kiện, góc vải | 4 + người bán | 45 |
| Saigon Barber | ✅ 16 × 18 m | 2 + người bán | 20 |
| Home & Cozy | ✅ 40 × 54 m showroom tối ấm: 8 phòng mẫu (cả đồ sân vườn) | 4 + người bán | 48 |
| Verse Electronics | ✅ 40 × 54 m siêu thị điện máy | 4 | 44 |
| Police Station | ✅ 24 × 30 m: quầy tiếp dân, văn phòng, điều phối, trang bị, đồ thất lạc | 5 | 24 |
| Fire Station | ✅ 24 × 32 m: nhà xe + xe cứu hoả, giá đồ bảo hộ, góc báo động, khu nghỉ, góc tập huấn | 5 | 23 |
| Các nơi còn lại | ⏳ phòng mẫu 16 × 12 (bày đồ theo `layout` cũ) | 1 (hoặc người bán) | chưa có |

---

## 6. Việc tiếp theo (theo thứ tự đề xuất) – cập nhật 26/11 khi bàn giao sang phiên mới

### 🔁 BÀN GIAO PHIÊN 23–26/11 (nhánh `claude/sharp-keller-74gko0`, đã gộp `main` tới PR #74)
**Trạng thái:** `main` = PR #62–#74, QA toàn bộ ✅ (7 cảnh báo cũ về số NPC). Mốc khôi phục: bảng `docs/RELEASES.md` (mốc cuối `588f74e` trước PR #74).
**Tripo API:** khoá lưu ở môi trường (host `api.tripo3d.ai`, proxy tự gắn); **còn 10 credit – chủ dự án cần nạp thêm** trước khi dựng gì mới. Quy trình + giá thật: `tools/tripo/README.md`; nén ảnh màu GLB: `tools/tripo/shrink_glb.py`.

**Đã làm trong phiên (chi tiết từng đợt ở các đoạn in đậm bên dưới):**
- **Nhân vật chính Voice Guard nam / nữ** (Tripo, 3,9 đầu, không tai nghe, miệng nhỏ) thay nhân vật ghép KayKit cho người chơi; động tác đi/đứng/chạy từ Tripo + **động tác chiến đấu bằng code** (`HERO_FX` / `heroPose`): giật lùi, chém, tung phép (nam đẩy tay, nữ giơ trời rồi chỉ), reo, cúi chào; dáng nam chân dang bằng vai; chạy nam đầu đổ tới.
- **Lắp ghép** `parts/characters/assemble.js`: chia vùng theo xương, ghép đầu (kiểu tóc), **bàn tay nắm** riêng (`assets/parts/fist.glb`, đổi chéo trái/phải + nghiêng 0,35 – chủ dự án chốt; nữ tay mở, chỉ nắm khi cầm vũ khí), **da hồng hào** (`warmSkin`), nhuộm tóc (`hairTexture`).
- **11 kiểu tóc** (5 nam + 5 nữ chất lượng cao ~18k đỉnh, Classic là đầu gốc) + 7 màu: chọn ở màn tạo nhân vật và Saigon Barber.
- Chân dung HUD = đầu nhân vật; túi đồ: ô **Body** (áo + quần), Shoes, Belt, Cape, Weapon, 🐎 Mount (để sẵn).
- 2 quái Tripo (To He, Tacke Gecko) ở vùng mùa xuân, cử động bằng shader; khu Nhật: **cổng torii đỏ, bước vào vết rách tự qua** (bỏ nút); iPhone: mở khoá đọc tiếng lần chạm đầu (đề Listening không còn câm).
- **Sổ tay tổng hợp** `docs/bible/` (artifact https://claude.ai/artifact/TtFyva9oHxZSQGCHvyA9Gr): 13 tab – cốt truyện, nhân vật chính (+ kiểu tóc), NPC cốt lõi (9), **36 danh nhân** (23 có ảnh chốt; danh nhân giữ **tỉ lệ người lớn**), quái, **Trang bị bản 2** (8 ô, chỉ số hên xui ★, 8 loại vũ khí, 21 bộ giáp – chờ duyệt, chưa vào code), vật phẩm, chiêu thức, thẻ, đề nói, thế giới. Dữ liệu: `node tools/bible/build.js`.

**👉 TRỌNG TÂM PHIÊN MỚI (chủ dự án đồng ý 26/11):**
1. **Thử hướng "2.5D" cho đẹp, ít "giả"** (chủ dự án so với game 2D pixel art): làm thử **1 khu – Blossom Valley** rồi so trước/sau: (a) camera góc cao cố định (cho xoay nhẹ), (b) mặt đất ảnh vẽ tay (đất, cỏ, lá, đá – không màu phẳng), (c) ánh sáng có không khí: bóng mềm, ánh ấm, viền tối mép màn hình, chỉnh màu riêng mỗi vùng, (d) dần thay nhà / cây / quái khối bằng mô hình cùng chất liệu nhân vật Tripo. Ưng thì áp dụng cả game. Kết luận đã báo chủ dự án: **giữ 3D** (thay đồ, tóc, giáp rẻ hơn nhiều so với 2D; online nhiều người không phụ thuộc 2D/3D).
   **ĐÃ DỰNG BẢN THỬ (26/11):** `parts/world/look25.js` (`LOOK25`), chỉ bật khi đứng trong Blossom Valley (vòng 1); nút **🎨 2.5D: On/Off** (dưới nút Wide, chỉ hiện ở đó) để so trước/sau, nhớ ở `localStorage.ev_look25` (hoặc `?look25=0`). (a) góc nghiêng cố định 53°, FOV 55° → 30° + lùi camera bù (khung hình giữ cỡ, ít méo), kéo ngang xoay nhẹ ±24°; (b) mặt đất: ảnh cỏ + ảnh đất vẽ bằng canvas (nét cỏ, sỏi, lá rụng, đốm màu cọ vẽ), lấy ảnh 2 lần xoay lệch + nhiễu lớn để không thấy ô lặp, màu lớn vẫn theo ảnh nền cũ (gắn qua `LOOK25.patchGround` trong `detailed()` của wilds.js); (c) nắng ấm thấp chiếu xiên (bóng dài sang trái), trời dịu, sương xa màu ấm, viền tối mép + ánh nắng phía trên. Không thêm lần vẽ; tắt nút = y hệt bản cũ. Ảnh so: `docs/design/look25-compare.jpg`. **Chưa làm:** (d) thay cây / đá / quái khối bằng mô hình Tripo (chờ nạp credit). Móc trong index.html: `wildCamTick`, `pointermove`, `camD`, `LOOK25.tick` trong vòng lặp. **Chủ dự án duyệt nền + màu (26/11), đã lên `main` (PR #76).**
   **Cây / đá / bụi VẼ TAY dạng ảnh (26/11, chủ dự án chọn sau khi chê KayKit "tròn vuông như Minecraft, con nít"):** `assets/painted/trees.webp` (1 ảnh gộp 2048 × 1024, ~1 MB, 26 hình) từ OpenGameArt, **CC-BY – phải ghi tên tác giả** (Bleed: cây; Robert Ramsay: anh đào; davidbv: đá – `assets/CREDITS.md`; ❗ trước khi mở 100 người nên có dòng "Credits" trong game). Đã xoá bóng vẽ sẵn trong ảnh + lật ngang (ánh sáng khớp nắng game). `NATURE.sprite(kind, x, z, s)` (kind: tree · cherry · willow · bush · slim · rock): mỗi cây = 1 tấm ảnh nghiêng ra sau 20°, kéo cao ×1,15; + 1 tấm vô hình quay về phía nắng chỉ để **đổ bóng thật theo dáng lá** (`customDepthMaterial`); gộp theo ô 40 m. Cây/đá đứng trước nhân vật: khoét lỗ tròn mờ mép quanh nhân vật trên màn hình (`setPS`, uniform `uPS`). Blossom Valley vòng 1: `lushTree` / `rock` / bụi / khóm tre (`kkHere` trong wilds.js) đều dùng ảnh; gần suối là liễu; 20% anh đào. Đo: ~54 lần vẽ/khung, ~70k tam giác (nhẹ hơn cả cây mô hình); ảnh tốn ~11 MB bộ nhớ đồ hoạ. KayKit Forest đã gỡ. **Sửa sau khi chủ dự án chơi thử trên iPhone (26/11):** bóng đá / bụi = vệt mềm nằm đất (tấm đổ bóng dựng đứng làm lệch) · đường mòn rộng ~5 m, dải hình 5 cột có thuộc tính `ea` (−1…1) → shader (RIB trong `patchGround`) cắt mép lởm chởm theo ngọn cỏ + nhiễu, CHỈ trong Blossom Valley · mảng đất trong ảnh nền: lưới nhiễu xoay + méo (trước: mép thẳng tắp theo ô lưới nhiễu) + shader giáp đất–cỏ sắc mà lượn, dùng màu chuẩn ở vùng giáp (hết nhòe bẩn) · suối = lạch cạn lội qua được (`LOOK25.patchWater`: sỏi đáy, giữa sâu, gợn sáng trôi, bọt mép; bờ đất ướt + sỏi thay dải cỏ xanh đậm) · **bản đồ lớn làm lại** (`drawBig` index.html): cả thế giới, 3 mức phóng (− / + / 📍), nhãn có nền và không đè nhau (đè thì ẩn; phóng to mới hiện thêm tên), tên khu co vừa ô, vùng hoang dã có đường mòn + suối + rừng (`WILDS.drawMap`, `WILDS.labels`). Ảnh: `docs/design/look25-fix1.jpg`.
   **Góp ý lần 2 (26/11):** giữ nguyên các mảng đất trống như cũ (`soilDirt` trong wilds.js – dùng chung cho tô nền và rải cây; chỉ lệch toạ độ ±11 m + nhạt dần gần rừng thay vì cắt cụt ở fbm 0,55 – đó là nguồn cạnh sắc / gãy góc) · giáp đất–cỏ: cỏ thưa dần vào đất (smoothstep rộng theo ngọn cỏ), màu vùng giáp = màu cỏ / màu đất bên trong (hết viền nâu) · cây trên bãi đất đậm: 85% bỏ; cây còn lại có vòng cỏ dưới gốc (`onSoil`, `GRASSP`, `grassUnder`); bụi/hoa cũng ít trên đất · mép đường mòn: vẫn lởm chởm nhưng mờ dần (dải trong suốt, `diffuseColor.a`) · BỎ khoét lỗ / tàng hình cây khi nhân vật đi sau (chủ dự án: lá thưa, nhìn xuyên được).
   **Thử vùng thứ 2 – Maple Highlands (vòng 1) với nền ẢNH VẼ TAY TẢI VỀ (26/11, chủ dự án yêu cầu so với nền vẽ bằng code):** cỏ "Hand Painted Grass" (PamNawi) + đất nứt (Drummyfish), CC0, `assets/painted/ground-*.webp` (39 + 17 KB) – nhánh `l25MaskNE` trong `patchGround`: ảnh cỏ nhuộm theo màu thu của ảnh nền (vàng / cam / mảng lá đỏ), đất nhận theo độ bão hoà màu thấp (`K.dirtNE`); cây thu Bleed (`assets/painted/autumn.webp`, 320 KB; ảnh gộp thứ 2 – `ATL` trong nature.js): phong đỏ, liễu vàng, thông cam, cây trụi + 15% cây xanh; `grovesNE()` thêm cụm rừng phong; mảng đất trống vùng thu (`soilDirt` lệch toạ độ, ngưỡng 0,47); đường mòn NE đổi màu nâu nhạt. Camera / ánh sáng 2.5D bật cả ở đây (nút 🎨 hiện ở 2 vùng). Blossom Valley giữ nguyên nền vẽ bằng code. Ảnh so: `docs/design/look25-maple.jpg`. Đo: ~53 lần vẽ/khung. Sửa (góp ý: camera mặc định thấy nét cọ to, nhòe, bệt): ảnh cỏ lặp 3 m (trước 6,5 m) + lớp ngọn cỏ mảnh (ảnh cỏ code, 1,8 m) + **lớp lá rụng vẽ code** (`leafTile`: lá phong / bầu dục đỏ-cam-vàng-nâu, chỗ dày chỗ thưa) – ảnh `docs/design/look25-maple2.jpg`. **Chờ chủ dự án chọn:** nền code hay nền ảnh tải về cho các vùng còn lại.
   **3 vùng còn lại (vòng 1) theo kiểu TRỘN (26/11, chủ dự án duyệt):** ảnh vẽ tay tải về cho mảng màu + chi tiết nhỏ vẽ code. Shader `patchGround` khối chung `l25Sec(p, góc0, góc1)`: **Frost Peaks** – ảnh cát gợn (Drummyfish, `ground-sand.webp` 4 KB) nhuộm thành tuyết dạt, hồ băng (màu xanh rõ) có vết nứt (ảnh đất nứt), thông Bleed + 15% cây trụi, đá xám hoá (màu đỉnh > 1,25 = xám hoá rồi nhuộm – shader sprite), ụ tuyết khối → tảng đá phủ tuyết; **Sunset Canyon** – cát gợn + mảng đỏ sẫm thành đất nứt, đá nhuộm đỏ, bụi khô vẽ tay; xương rồng giữ mô hình 3D; **Coral Coast** – cỏ vẽ tay (PamNawi) bớt chói + cát gợn, nước biển giữ nguyên, dừa Bleed (`assets/painted/extra.webp` 209 KB, ảnh gộp 3), đá màu cát. Đèn + sương riêng từng vùng (`LIGHT` trong look25.js). Camera 2.5D + nút 🎨 ở cả 5 vùng vòng 1. Đo: ~54 lần vẽ/khung. Ảnh: `docs/design/look25-3regions.jpg`. **Còn khối code:** cối xay gió, đống rơm, bí ngô (thu), mesa + cột đá (sa mạc), thuyền + san hô (biển), người tuyết, tinh thể băng; vòng 2 cả 5 vùng chưa làm.
   **Vật khối → hình vẽ tay (26/11):** tạo bằng AI Canva (hết hạn mức sau 4 ảnh; máy làm việc không tải được ảnh gốc từ Canva → dùng ảnh xem trước 200 px phóng 2×): cối xay gió, đống rơm, bí ngô, người tuyết (`assets/painted/props.webp`, ảnh gộp 4). Mesa → cụm đá đỏ vẽ tay; cột phế tích → trụ đá sa thạch. **Còn chờ ảnh:** tinh thể băng, thuyền, san hô (+ ảnh cột phế tích, núi mesa thật) – khi Canva có lại hạn mức hoặc chủ dự án tạo bằng ChatGPT/Gemini.
   **Hiệu ứng chiêu dạng CHUỖI ẢNH (flipbook, 26/11 – thử 4 chiêu đầu):** `assets/fx/fx.webp` (138 KB, 8 hiệu ứng CC0 của Cethiel: chém lửa, chém vàng, phép tím, phép nước, cầu sáng, nổ gai, sao chữ thập, xoáy). `flip(key, P, cỡ, thời gian, trễ, {tint, add, rot, y, grow, from, to, loop})` trong vfx.js: 1 tấm vuông tự quay về camera, đổi khung bằng toạ độ ảnh (không nhân bản ảnh), vật liệu riêng từng tấm để mờ dần. Viết lại Echo Blast, Question Arrow, Harmony Heal, Drum Roll (bỏ vòng tròn phẳng / đốm màu, thêm chuỗi ảnh + hạt nhỏ + rung) và đòn đánh thường (vệt chém). **Bước tiếp:** áp cho 24 chiêu còn lại + tuyệt chiêu (rồng âm thanh: dải hình uốn lượn có ảnh vảy trôi).
   **Hiệu ứng chiêu 3D "particle & mesh" – BẢN MẪU chờ duyệt (27/11, chủ dự án chọn hướng này thay chuỗi ảnh 2D):** `parts/combat/fx3d.js` (`FX3D.setup / update / cast`) – hạt sáng tính trên card đồ hoạ (1 THREE.Points / đợt), khối hình shader ảnh nhiễu trôi + fresnel (cột năng lượng, lốc xoáy, quả cầu), vệt kiếm cong, tia sét zigzag quay về camera, vòng phù văn (nốt nhạc + nguyên âm) xoay dưới đất, vết nứt cháy, vòng sóng, rồng = 2 dải chéo theo đường bay của đầu + ảnh vảy trôi; vệt tối mềm dưới mỗi chiêu cho nổi trên nền sáng; mọi ảnh vẽ bằng canvas (không tải file). 7 chiêu mẫu: Echo Blast, Thunder Clap, Freeze Note, Harmony Heal, Fire Spin, Dragon Roar, đòn thường. Trang xem: `docs/design/vfx-lab.html` (artifact https://claude.ai/artifact/BXjyKHYTSkBJtoPLkhVFjJ). **Chưa đưa vào game** – chờ chủ dự án duyệt, sau đó thay `SKILL_VFX` trong vfx.js bằng FX3D cho đủ 28 chiêu.
   **Bước tiếp:** tre vẽ tay thật (đang tạm thay bằng cây thân mảnh), áp cho 4 vùng mùa (bộ Bleed còn thông, cọ ×2, liễu vàng, phong đỏ, cây trụi – đủ cho đông/biển/thu).
2. Sau khi nạp Tripo: dựng lại **Classic** nam/nữ chất lượng cao (~85 credit/kiểu); món đội đầu (vương miện, mặt nạ – gắn xương Head, không che tóc); thử 1–2 bộ giáp + vũ khí theo `docs/bible/outfits.js`.
3. Ảnh 2D còn thiếu: 13 danh nhân (câu lệnh trong sổ tay), giáp, NPC cốt lõi, NPC phổ thông (đầu + bộ đồ theo nghề).
4. Đưa **Trang bị bản 2** vào code khi chủ dự án duyệt (ô, chỉ số ★ ngẫu nhiên, vũ khí kiếm/búa/… thay nhạc cụ).

<details>Bàn giao 23/11 (cũ)</details>

### (cũ) 6. Việc tiếp theo (theo thứ tự đề xuất) – cập nhật 23/11 khi bàn giao sang phiên mới
**Trạng thái:** `main` = gộp nhánh `claude/inspiring-pasteur-1xop2q` (phiên 20–23/11), QA toàn bộ ✅ (7 cảnh báo cũ về số NPC). Mốc khôi phục trước đợt này: `dcfc24a` (docs/RELEASES.md).

**Phiên 20–23/11 đã làm:**
- **Cốt truyện ĐÃ CHỐT** – `docs/STORY.md` (13 mục: Vocara / Vox Prima, Babel, The Great Silence, 3 chiều không gian, Resonance Dome, tiếng Anh = tiếng nói chung, Silentium + 4 tướng Distortia / Oblivia / Vorax / Tremora, Council of Langua, 8 khu văn hoá + trùm hiếm, thành trì & thành lũy).
- **Sổ tay nhân vật** `docs/design/bestiary.html` (artifact: https://claude.ai/artifact/JFDiirGusB2wF3viV4ELpx): 105 mục (khu Việt 27 · 8 khu văn hoá · mục "Thần & The Mute" 14), **104 ảnh chốt** ở `assets/concept/` (thiếu Oblivia). Mỗi mục có câu lệnh vẽ AI; quy trình: ChatGPT/Gemini → chọn ảnh → Tripo (GLB tĩnh, không cần rig vì quái tự hoạt hoạ bằng code).
- **LISTEN giới hạn số từ theo cấp** (`listenMax()` engine.js).
- **Khu văn hoá = bản đồ riêng** (`parts/world/rifts.js` + `rift-jp.js`): khu Nhật **Sakura Rift** đã dựng map (chưa có quái) – xem đoạn "🌀 KHU VĂN HOÁ" bên dưới. Cổng ở cuối đường mòn hướng NAM (Bamboo Hills, (0, 318)), bản đồ nhỏ đánh dấu vòng hồng tâm trắng.
- **Đồi hoa vùng Nam** (Blossom Valley / Bamboo Hills) thành gò thấp đi xuyên qua được (chủ dự án: đồi to chắn đường).

**👉 TRỌNG TÂM PHIÊN MỚI (đề xuất, hỏi chủ dự án chọn):**
1. Chủ dự án đi thử khu Nhật trên điện thoại → chỉnh gu (bố cục, màu, công trình).
2. **Thả quái vào khu Nhật**: combat engine đang lấy vùng đánh từ `WILDS.sectorAt` → cần thêm "sector" cho khu (vd `RIFTS.sectorAt` trả { dir, ring: 3, season: "jp", name }) + bảng quái Lv.50–60 theo sổ tay (hiện quái là khối code tạm trong `parts/combat/models.js`).
3. **7 khu còn lại** theo khuôn `rift-jp.js` (thành trì + thành lũy ở STORY mục 13; cổng: mép ngoài 4 hướng còn lại của khu Việt + 3 cổng đảo Arena cho Trung Hoa / Hy Lạp / Lưỡng Hà).
4. **Đưa quái mới vào game** qua Tripo (thử 1 con trước, đo nặng).
5. **Chương mở đầu cốt truyện** (prologue, lời kể A2 ở STORY mục 10) – chưa làm.

<details>Trọng tâm phiên 19/11 (đã xong): chốt cốt truyện → sổ tay nhân vật.</details>

~~TRỌNG TÂM 19/11: CHỐT CỐT TRUYỆN~~ (đã xong 20–22/11) – bàn kỹ và chốt hẳn cốt truyện (mục 2) TRƯỚC, rồi mới từ đó thiết kế nhân vật + quái. Nền hiện có: Verse City, The Mute, Mutelings = lời chưa dám nói, Word Spirit, người chơi là "a Voice". Sau khi chốt: CTO viết **sổ tay nhân vật** (trang web xem trên điện thoại): ~10 quái (2 / vùng mùa, khớp dạng bài nói) + ~5 NPC chính, mỗi mục: tên, ý nghĩa học (nỗi sợ / lỗi khi nói tiếng Anh), nguồn cảm hứng văn hoá Việt (con vật, đồ vật, truyện cổ – không có bản quyền), dáng, màu, tính cách, **câu lệnh vẽ AI viết sẵn**. Chủ dự án là "giám đốc nghệ thuật": chọn / gạch / sửa; vẽ 2D bằng ChatGPT/Gemini → chọn 1 → Tripo 3D → CTO đưa vào game. Công thức ý tưởng đã đề xuất: lai 2–3 nguồn (con vật / đồ vật Việt + lỗi tiếng Anh + mùa của vùng); ví dụ đã đưa: Mumble Snail (xuân), Tense Twister (thu), Lantern Shy (trùm Trung thu). ~~Luật hình khối chung: quái tròn mềm, không đáng sợ~~ → **20/11 đổi: surreal fantasy, hơi rợn được** (xem `docs/STORY.md`); trùm to ×3. Sổ tay quái bản thử 1 (13 con): `docs/design/bestiary.html`.

**🌀 KHU VĂN HOÁ – BẢN ĐỒ RIÊNG (22/11, đã làm khu Nhật, chưa có quái):** `parts/world/rifts.js` (khung chung: cổng vết rách ở bản đồ chính, đi qua lại có màn mờ, va chạm, bản đồ nhỏ, sương riêng, nhịp riêng xoay cổng / hiệu ứng) + `parts/world/rift-<khu>.js` (nội dung từng khu, `RIFTS.define({...})`). Mỗi khu đặt ở toạ độ rất xa (khu Nhật: tâm (0, 2300), 300 × 300 m) nên camera (tầm 220 m) không bao giờ vẽ 2 nơi cùng lúc; dựng 1 lần lúc tải, trước `bakeWorld` (wilds.js gọi `RIFTS.build()` trước `NATURE.build()`) → khối tĩnh được gộp theo ô 40 m. Logic hướng: cổng ở hướng D → xuất hiện ở mép đối diện, thành chính cuối bản đồ theo hướng D. Camera vùng hoang dã vẫn cố định hướng Bắc, chỉ trong 30 m quanh cổng thì quay mặt về cổng (`RIFTS.camTarget`, gate.view). Nối vào lõi: `blocked()` (RIFTS.blocked), `updateCity()` (nút 🌀 qua RIFTS.nearSpot), `drawCity()` (RIFTS.drawMap), `nature.js` thêm `clearArea` (dọn cây quanh cổng). **Khu Nhật – Sakura Rift** (`rift-jp.js`): cổng kiểu Nhật ở mép Nam Bamboo Hills (0, 318) → vào cổng Bắc khu; phố gỗ machiya, đại lộ anh đào + đèn đá, ĐÔNG hàng torii → chùa tháp 5 tầng + gác chuông, TÂY chánh điện + vườn đá Thiền, hồ koi + cầu cong, góc TB rừng trúc, góc ĐB phong đỏ, NAM hào nước + đảo thành + lâu đài kiểu Himeji (tháp chính 5 tầng + 2 tháp phụ, chân đá xếp), tường thành vôi trắng chân đá + 7 vọng lâu, núi tuyết phông nền, sương hồng + cánh anh đào bay. Đo: ≤ ~190 lần vẽ, ≤ ~68k tam giác ở góc chơi; thành phố không đổi (242–243 lần vẽ). Việc tiếp: thả quái khu Nhật (cần nối combat engine: sector của khu thay cho WILDS.sectorAt), rồi 7 khu còn lại theo cùng khuôn.

**📖 CỐT TRUYỆN – ĐÃ CHỐT (20/11):** toàn bộ ở `docs/STORY.md`. Sổ tay quái bản 2 (13 con) `docs/design/bestiary.html`. **Ảnh chuẩn phong cách đã duyệt:** `assets/concept/mud-buffalo.webp` (Gemini) – đính kèm ảnh này khi vẽ các con còn lại để giữ đồng bộ. Quái hiện là khối code tự hoạt hoạ (`parts/combat/models.js`: lấy đà, bẹp nảy…) nên mô hình Tripo **không cần rig**, chỉ cần GLB tĩnh. Việc tiếp: vẽ 12 con còn lại → Tripo thử 1 con → CTO đưa vào game đo hiệu năng → làm loạt; song song: chương mở đầu (prologue) + NPC chính (The Oracle Lady…).

**🧊 TRIPO API – CHẠY THỬ THÀNH CÔNG (25/11):** chủ dự án nạp $20 (2.000 credit) và cấp khoá. 2 nhân vật chính đã dựng 3D + gắn xương + 5 động tác (idle, walk, run, slash, hurt): `assets/characters/voice-guard-m.glb`, `voice-guard-f.glb` (~5.000 mặt, 1,8 MB, 41 khớp). Chi phí thật **125 credit = $1,25 / nhân vật** (dựng 50 · xương 25 · động tác 50). Còn 1.750 credit. Trang xem: `docs/design/hero-viewer.html` (artifact https://claude.ai/artifact/6kkbxyaSAdomTKvwNckx6a). Quy trình + mã lệnh: `tools/tripo/README.md`. **ĐÃ ĐƯA VÀO GAME (25/11):** `HERO` / `buildHero` / `HERO_CLIP` / `heroInPlace` trong index.html (cạnh `FACES`): save.head = `hero_m` | `hero_f`, người chơi cũ tự chuyển 1 lần (`save.heroV1`; Alex tóc dài → nữ), màn tạo nhân vật chọn Boy / Girl. Tên động tác KayKit (Idle, Walking_A, Running_A, Hit_A, 1H_Melee_Attack_Chop, Spellcast_Shoot) trỏ sang động tác Tripo; Cheer / Interact / Use_Item chưa có (bỏ qua). Vũ khí gắn vào xương R_Hand (weapons3d.js), túi đồ xem được (bag.js). **Thêm 3 động tác (25/11, 60 credit): cheer (Cheer), bow (Interact – cúi chào NPC), shoot (Spellcast_Shoot – tung phép), nạp từ file `voice-guard-*-extra/cheer/bow/shoot.glb`. **QUÁI TRIPO ĐẦU TIÊN (25/11, 50 credit/con):** `assets/monsters/to-he.glb`, `tacke-gecko.glb` thay hình Echo Ghost / Riddle Bug ở **Blossom Valley + Bamboo Hills (mùa xuân)**, giữ chỉ số loài cũ, đổi tên hiển thị; bảng `GLB` trong parts/combat/models.js (khoá mùa:loại, yaw, h) – thêm quái mới chỉ cần thêm 1 dòng + file GLB; cử động bằng code như quái khối + **lắc / uốn trong shader** (`WOB_BODY`: sway = phần trên lắc, chân đứng yên; wave = sóng dọc thân cho quái thân mềm; step = nhún theo bước) vì Tripo không gắn xương được cho 2 con này (rig check: to-he "others", tacke-gecko "avian" – ép rig avian thất bại, không trừ credit); có bóng mềm dưới chân. **Đợt 26/11 chiều (góp ý chơi thử):** tay nắm đổi chéo trái/phải, không xoay (chủ dự án chốt) · nữ: tay mở mặc định, chỉ nắm khi cầm vũ khí (`fists(..., {toggle})` + `ASSEMBLE.setFist`, kiểm tra trong `heroPose`) · da hồng hào: `ASSEMBLE.warmSkin` tăng bão hoà vùng màu da khi tải mô hình nhân vật / tóc · túi đồ: áo + quần = 1 ô **Body**, bỏ ô Pants, giày `boots_*` chuyển sang ô Shoes (save cũ tự chuyển) · **11 kiểu tóc chất lượng cao** (5 nam + 5 nữ + Ponytail; Tripo `face_limit 15000` + `texture_quality detailed`, 85 credit/kiểu, ~18k đỉnh) nén ảnh màu 4096→2048 bằng `tools/tripo/shrink_glb.py` (~1,5 MB/kiểu, chỉ tải kiểu đang dùng). Kiểu **Classic** nam/nữ vẫn là đầu mô hình gốc ~5k mặt – cần dựng lại HQ (~85 credit/kiểu). **Tripo còn 10 credit – cần nạp thêm.**

**Kiểu tóc + tay đúng chiều (26/11):** 5 kiểu tóc nam (Gemini vẽ Voice Guard tóc mới → Tripo image-to-model + rig, 75 credit/kiểu) ở `assets/characters/hair/m-*.glb`; `HAIRS` / `HAIR_COLORS` / `hairOf` trong index.html, `buildHero` bỏ vùng đầu gốc và ghép đầu của mô hình kiểu tóc (`ASSEMBLE.rigid`, giữ pháp tuyến gốc); nhuộm màu = `ASSEMBLE.hairTexture` (mặt nạ texel tóc tối, trừ vùng mắt). Chọn ở màn tạo nhân vật + Saigon Barber (bán kiểu tóc nam + Hair dye, thay 4 đầu KayKit). Nữ chưa có kiểu thêm (chờ ảnh). Tay nắm xoay 180° (trước bị ngược, ngón cái phía sau) + ép ngón cái. Còn 860 credit.

**Nhân vật chính bản 2 (25/11 khuya):** chủ dự án vẽ lại Voice Guard nam / nữ **không tai nghe, miệng nhỏ** (`assets/concept/characters/voice-guard-v2-*.webp`, trước + sau) → Tripo dựng lại (multiview P1 + rig + idle/walk/run, ~210 credit cả 2) thay `voice-guard-m/f.glb`; bỏ gọi `stripHeadset` (giữ hàm). Tay nắm: nam sink 0,1, nữ 0,48. Còn 1.235 credit.

**Sửa sau chơi thử 25/11 (tối):** tay nắm hết gai / cổ tay gỗ (mô hình nắm tay: cổ tay vuốt nhỏ thụt vào ống tay áo; bỏ tam giác chạm vùng bàn tay cũ) · bỏ tai nghe dính trong mô hình (`ASSEMBLE.stripHeadset`: mic + chụp tai xoá, vòng đầu tô màu tóc – còn vệt nhỏ khi zoom sát, sửa hẳn = dựng lại mô hình gốc không tai nghe) · chân dung HUD = chụp đầu nhân vật (`evPortrait`, hud.js) · túi đồ thêm ô Belt + 🐎 Mount (để sẵn). **Ô trang bị chốt:** đầu · thân · găng · giày (né tránh, may mắn – không tăng tốc) · đai (chỉ chỉ số) · áo choàng · vũ khí · vật cưỡi (nguồn tăng tốc duy nhất). **Kiểu tóc:** `docs/bible/hairstyles.js` (6 nam, 6 nữ) – vẽ Voice Guard tóc mới bỏ tai nghe → Tripo → chỉ lấy vùng đầu; màu đổi bằng code. Thử tóc rời bằng Tripo text-to-3D + tách phần: không dùng được (80 credit). Còn 1.445 credit.

**🛡️ TRANG BỊ bản 2 (25/11, chủ dự án chốt hướng, chi tiết chờ duyệt):** `docs/bible/outfits.js` + tab Trang bị. **5 ô:** đầu (không che tóc: tai nghe, visor, mặt nạ nửa mặt, vòng đầu, sừng; mũ kín chỉ vài bộ huyền thoại + nút Ẩn mũ; tóc chọn lúc tạo nhân vật) · thân (áo + quần) · găng (thay bàn tay nắm) · giày · vũ khí. **Chỉ số hên xui:** phẩm chất ★–★★★★★ = 80–140% chỉ số gốc + 0–3 dòng phụ; đồ nhiệm vụ luôn ★–★★, đồ ★★★+ chỉ rơi (trùm / quái hoàng kim tỉ lệ ×2); nạp tiền để sau (gợi ý chỉ bán ngoại hình). **8 loại vũ khí** (kiếm, búa = Power · trượng, sách phép = Control · quyền trượng thánh, khiên + chuỳ = Harmony · thương, song đao = Rhythm) + vũ khí văn hoá + vũ khí thần. **21 bộ giáp** Common → Legendary, 9 bộ văn hoá. CHƯA đổi code game (ô trang bị, chỉ số ngẫu nhiên, vũ khí mới).

**26/11 tối:** cổng khu Nhật = **torii đỏ son** + 2 đèn đá; **bỏ nút "🌀 Sakura Rift"** – bước vào vết rách là tự qua (`gate.door` vòng 1,8 m ở bản đồ chính, `portal.r` 3,2 m trong khu; kiểm trong `tick` của rifts.js), cả 2 chiều. Nắm tay nghiêng ra ngoài 0,35 rad (`opt.bend`, hết lòi cổ tay). iPhone: mở khoá đọc tiếng ngay lần chạm đầu (đề LISTEN trước đây câm nếu chưa nói với NPC).

**Danh nhân – tỉ lệ người lớn (chủ dự án chốt 26/11):** danh nhân giữ dáng người lớn (~5–6 đầu, giống người thật) để phân biệt với nhân vật chính / NPC thường (chibi 3,9 đầu). Ảnh chốt: 23/36 (`assets/concept/scholars/`, sổ tay tab Danh nhân).

**Bàn tay nắm + mô-đun lắp ghép (25/11):** `parts/characters/assemble.js` (`ASSEMBLE`: regions / hide / rigid / fists). Tripo không có xương ngón (chuẩn tripo + mixamo đều không), uốn đỉnh ngón trông như vuốt → mô hình nắm tay riêng `assets/parts/fist.glb` (Tripo text-to-3D, 40 credit, có lỗ cầm) thay bàn tay mở: nam 2 tay, nữ tay phải; màu da đọc từ ảnh mô hình. Vũ khí cắm xuyên lỗ nắm (`bone.userData.grip` dạng mảng số vì userData bị sao chép JSON khi nhân bản – từng làm vũ khí biến mất). Tạo ảnh 2D bằng Tripo (`generate_image`, FLUX.1 Kontext Pro) hết hạn chờ 2 lần, không trừ credit → chưa dùng được. Còn 1.525 credit.

**Động tác chiến đấu bằng code (25/11, góp ý chủ dự án: bị đánh ngồi xổm trượt, tung phép không ngầu, chạy chồm):** clip Tripo hurt / slash / shoot / cheer dài 6–14 s (hurt = ngồi bệt) nên bỏ; `HERO_FX` + `heroPose` trong index.html chỉnh khớp xương chồng lên vòng lặp idle/walk/run, không khoá nhân vật: flinch 0,32 s (giật lùi nhẹ), chop 0,42 s, cast 0,62 s (thẳng ngực, tay phải đẩy tới), cheer 1,1 s, bow 0,9 s; chạy được dựng thẳng người; gốc hông khoá trục tiến về 0 (khung xương Tripo z-up, trục tiến = y). Trục khớp: Spine02/Head x+ = ngả sau · Upperarm x+ = đưa tay lên trước. Xoá 4 file GLB động tác Tripo. Kiểm tra bằng ảnh chụp chuỗi khung hình từng động tác (không chỉ đo xương). **Lỗi đứng dang tay trên điện thoại (sửa 25/11):** khi thay chất liệu Lambert cho mô hình có xương phải đặt `skinning: true` (three r128), thiếu thì xương vẫn chạy nhưng da đứng yên ở tư thế gốc. **Màu (sửa 25/11 sau khi chủ dự án chơi thử: tối):** game không đổi sRGB (renderer để mặc định) nên ảnh màu Tripo phải đặt `encoding = LinearEncoding` + Lambert – giờ sáng ngang KayKit. Tải sẵn sau 4 giây; chưa tải xong thì dùng quái khối. **Hạn chế:** chưa mặc đồ rời – trang phục chỉ còn tác dụng chỉ số; Saigon Barber vẫn đổi sang đầu KayKit cũ. NPC vẫn KayKit. Việc tiếp: tách đầu / giày, thêm động tác Cheer + cast, bộ giáp mới.

**📚 SỔ TAY TỔNG HỢP GAME (23/11, cho chủ dự án + stakeholder):** `docs/bible/index.html` (artifact https://claude.ai/artifact/TtFyva9oHxZSQGCHvyA9Gr) – 11 tab: Tổng quan · Cốt truyện · Nhân vật chính · NPC · Quái · Vật phẩm · Chiêu thức · Sổ thẻ · Đề nói & logic · Thế giới · Thiết kế hệ thống. Dữ liệu tự lấy từ code: chạy `node tools/bible/build.js` (ghi `docs/bible/data.js`) rồi xuất bản lại khi nội dung đổi. **NPC cốt lõi (12, chờ duyệt)** sửa tay ở `docs/bible/core-npcs.js`: Oracle Lady, Commander Vy, Mr. Huy (đổi từ Ms. Hoa – đã sửa lessons.js), The Knowledge Collector (chủ dự án đề xuất: dẫn tới danh nhân, khôi phục khoa học), Pip – Word Spirit, Mayor Bao, Uncle Dan (nhạc cụ = vũ khí), Ms. Lua (may giáp), Coach Kai, Warden Torin (cổng vết rách). **25/11 chủ dự án chỉnh:** bỏ Pip (sợ rối màn hình), bỏ Mr. Hush, Dr. Nova để sau; Uncle Dan = **lò rèn vũ khí** (nhiều loại vũ khí theo binh khí các thần, không phải xưởng nhạc cụ) → còn 9 NPC cốt lõi. **36 danh nhân – bản 3 (thêm Einstein, Leeuwenhoek – kính hiển vi, Hubble – thiên hà, Mendel – lai tạo, Mendeleev – bảng tuần hoàn, Paul Baran – Internet; Niépce – ảnh đầu tiên thay Ibn al-Haytham; thưởng 🎴 thẻ kiến thức thay câu nói danh nhân) · 103 nhiệm vụ · **Sổ Tri Thức** (đề xuất): tab thứ 4 của Sổ thẻ, mỗi danh nhân 1 trang, mỗi phát minh 1 ô huy hiệu + thẻ phát minh vào Voice Deck · câu lệnh vẽ Gemini cho 36 danh nhân + 9 NPC cốt lõi nằm trong sổ tay (nút "Chép câu lệnh"; tỉ lệ 3,9 đầu, tay trống, đạo cụ làm riêng) (chủ dự án: chọn phát minh "wow", gần đời sống: rửa tay, kháng sinh, vắc-xin, điện, Wi-Fi…; mỗi thẻ có câu móc "không có người này thì…")** (4 chương, Lv.10–92, 3 người Việt) ở `docs/bible/scholars.js`, tab "Danh nhân" – chờ duyệt.

**🧍 THÂN GỐC & TRANG BỊ – CHỐT 23/11 (phiên claude/sharp-keller-74gko0):** tỉ lệ **3,9 đầu** (kiểu "Q" như game tham khảo Đại Hiệp Khách; nón / tóc bồng làm đầu trông to thêm), thay mẫu Tripo cũ 2,6 đầu (cậu bé áo mây, phải vẽ lại; **bỏ balo**). Chia món: **giáp thân = áo + quần 1 món** (Tripo, Auto Rig) · **đầu + tóc, giày, mũ, vũ khí = món cứng gắn vào khớp xương** (đầu / bàn chân / tay) nên rời được mà không cần gắn xương phức tạp. Đẹp nhờ: texture vẽ sẵn từ Tripo + tà áo/tóc lay + hiệu ứng (viền sáng, hào quang, vệt chém) – KHÔNG ghép khối code. Trang xem thử dáng + 7 bộ giáp mẫu (Voice Guard, Hiệp sĩ sắt, Thợ săn rừng, Pháp sư sao, Võ sĩ Sakura, Giáp Đông Sơn): `docs/design/armor-fitting.html` (artifact https://claude.ai/artifact/Gtj2ozZqpXHVcrvz41j2Fr). Cần thử: cắt đầu + bàn chân khỏi mô hình Tripo liền khối (Blender chạy lệnh). **Ảnh chốt nhân vật chính (23/11):** `assets/concept/characters/voice-guard-m.webp` (nam: mặt lạnh, nam tính; áo gile xanh ngọc viền vàng + áo trắng dài tay) · `voice-guard-f.webp` (nữ: tươi tắn; áo khoác xanh ngọc, váy xếp ly navy). Ảnh trong repo là bản nén – đưa Tripo dùng file gốc của chủ dự án.
**🧍 NHÂN VẬT – ĐÃ CHỐT (19/11):** chia 3 tầng · (1) người chơi + (2) NPC thường dùng **2 thân gốc chibi: 1 nam, 1 nữ** (bộ xương chuẩn, đổi tóc / mặt / da / trang phục; cùng 1 món đồ, nam mặc ra kiểu nam, nữ mặc ra kiểu nữ; NPC thường máy tự phối) · (3) NPC chính (~10–15), **mỗi loại quái**, trùm = **mô hình riêng** bằng Tripo. Phong cách: chibi hoạt hình 3D mềm (mục dưới). Mặt vẽ bằng ảnh dán (đổi biểu cảm). Tripo: chủ dự án định mua gói Pro (~20 USD/tháng, trả theo tháng, dùng thương mại + mô hình riêng tư), xuất **Smart Mesh** ít mặt (5–10k), texture 1024–2048, GLB, Auto Rig cho thân người; sau đó có thể dùng API (`request_credential`) tạo hàng loạt theo 1 mẫu chuẩn.

**Visual – việc còn lại (khi rảnh):** camera trong vài phòng nhỏ (Lab, Fix-It, nhà riêng) đứng sát lưng nhân vật; `bigTree` trong nội thất + cây đước + trúc vẫn khối code; lá rụng mùa thu góc cạnh; mép hồ băng / hồ thác / bờ biển còn vẽ trong ảnh nền (mềm); bãi cỏ nhỏ trong khuôn viên vài toà nhà; hình đồ vật từ vựng (685 từ / 384 emoji, nhiều hình sai nghĩa – ví dụ 🧻 dùng cho paper towel / toilet paper / towel) → chủ dự án hoãn, làm sau khi đủ số lượng (dự kiến ảnh 2D xoá nền, vẽ bằng API ảnh, chủ dự án duyệt nghĩa).

**Môi trường phiên:** đã mở mạng tới kenney.nl, quaternius.com, poly.pizza, opengameart.org, polyhaven.com, itch.io, Google Drive (drive.google.com, drive.usercontent.google.com) – chủ dự án tải gói về rồi chia sẻ link Drive (tải trực tiếp qua itch.io bị chặn). Gói Quaternius gốc (OBJ) ở Drive của chủ dự án; chuyển OBJ → GLB bằng `pip install trimesh` + script trong scratchpad (không commit). Công cụ chụp ảnh thử: Playwright, ẩn giao diện bằng CSS, chụp từng phòng bằng `enterRoom(CITY.find(...))`.

<details>Trọng tâm phiên 18/11 (đã làm): chủ dự án chốt 18/11. Hỏi chủ dự án muốn ưu tiên phần nào trước (gợi ý: giao diện còn lại chưa theo `theme.js` – cửa hàng, hội thoại NPC, sổ thẻ, bản đồ lớn, màn tạo nhân vật; hiệu ứng / vùng hoang dã; nhân vật & trang phục – áo mặc định vẫn hơi dáng áo dài vì mô hình thân Rogue; mô hình quái; nội thất/ngoại thất còn thiếu). Dùng lại lớp `.ev-*` trong `parts/ui/theme.js`, không tự chế màu.</details>

**Visual 18/11 (phiên mới) – hướng đã thử:** tham khảo video game mobile chủ dự án gửi (góc nhìn cao, cỏ có vân, cây tán tròn "bông", bóng râm dưới cây, màu dịu). Đã làm ở vùng hoang dã (`parts/world/wilds.js`): `putBlob` = khối tròn tô mượt + đáy sẫm (giả bóng khuất) cho tán cây xuân/thu và đá; `detailed()` = vân cỏ 128 px lặp mỗi ~3 m nhân lên ảnh nền (chỉ cỏ, không phủ nước); `shadeGround` = vẽ sẵn bóng râm dưới cây vào ảnh nền lúc tải (không tốn khi chơi); màu cỏ mùa xuân dịu lại, bớt đốm hoa. Lần vẽ không đổi; tam giác trên màn hình ~+30% (≈50k), tổng hình vùng hoang dã 240k → 370k. **Bước tiếp theo đề xuất:** (1) áp cùng cách cho cây/cỏ trong thành phố; (2) ánh sáng + màu toàn cảnh dịu hơn; (3) mô hình làm bằng Blender (GLB) cho quái / nhân vật / đồ đặc trưng – dùng bộ CC0 (KayKit, Kenney, Quaternius) trước, tự làm sau.

**Blossom Valley giống video tham khảo (18/11):** `wilds.js` → `groves()` cây "bông" mọc thành cụm rừng dày theo nhiễu fbm (chừa trảng + đường mòn), `boulders()` ≤ 30 cụm đá xám to có rêu, nền: sàn rừng sẫm + mảng đất + mép đường mòn lẫn đất (`K.sF`, `K.dirt`). Tán cây lấm tấm trong suốt khi nằm giữa camera và người chơi (shader trong `finalize`, uniform `pPos`). Camera vùng hoang dã lùi 11 → 15 m (góc nghiêng giữ như chốt 16/11). ~40–68k tam giác. **Đã thử & bỏ:** bộ Quaternius Stylized Nature MegaKit (CC0) – cây thân cao tán nhỏ nhìn từ trên bị gầy, cỏ thành đốm, nặng gấp 2–4 lần; code còn trong lịch sử git (commit "Thử nghiệm: thảm cỏ/hoa/bụi Quaternius"). Bước tiếp: áp cùng cách cho 4 vùng mùa còn lại (thu: phong, đông: thông tuyết, sa mạc: xương rồng + đá đỏ, biển: cọ).

**Nội thất hết lóa, ấm, có chiều sâu (19/11, góp ý chủ dự án – lấy Home & Cozy làm chuẩn cảm giác):** index.html, ngay sau `indoorBg` – trong nhà đổi đèn sang ánh ấm (`indoorLook`: trời vàng nhạt, phản chiếu nâu, nắng + đèn phòng vàng), **tự cân sáng** (`autoExpose`: render 1 ảnh 64×32 ngoài màn hình 2 lượt, giảm đèn tới độ sáng trung bình ~0,58, chỉ giảm không tăng – phòng tối sẵn giữ nguyên; `expoTick` đổi mượt), viền tối `#vig` khi ở trong nhà. Đo bằng ảnh chụp từng phòng: vùng cháy trắng (>230) từ 30–75% xuống < 1% ở 19/23 phòng; Home & Cozy / thư viện / rạp phim gần như không đổi. Không sửa từng file nội thất. Nếu sau này muốn chỉnh riêng 1 phòng: thêm hệ số vào INTERIORS (chưa có).

**Thành phố giống thành phố thật (18/11, góp ý chủ dự án):** index.html – `flat()` tự đổi mặt cỏ cũ (0x8fd17a / 0x5fae4e / 0x9fcf7f) sang cỏ có vân `lawnMat()` (ảnh 256 px lặp mỗi 4 m, cùng tông Blossom Valley; `K.cityGrass` của wilds.js đổi theo); `road()` = nhựa đường `asphaltMat()`, `roadMarks()` vẽ vạch giữa đứt khúc + lề đường xám nhạt + vạch đi bộ ở mọi nhánh ngã ba / ngã tư (19/11: tính "miệng" đường khác chạm vào từng phía, lề bỏ đúng phía đó, vạch giữa dừng cách miệng 3,4 m) (gọi sau các road() của thành phố và của đảo Arena). Bồn hoa quảng trường: bụi lá + hoa mô hình (`NATURE.place("cbush" / "cflower")`). Cây quanh toà nhà: `bigTree()` / `palm` cục bộ trong ngoại thất (khi `EXT_BUILD` – bật trong `buildCustom`) chỉ để lại điểm đánh dấu `userData.npalm`, `NATURE.build()` đổi thành cây dừa mô hình (23 cây). `bigTree` trong nội thất giữ nguyên.

**Cây mô hình cho cả 5 mùa + thành phố (18/11, chủ dự án: "mượt, đẹp"):** `NATURE.place(kind, x, z, s)` – thu `maple` (Tree_* lá cam/đỏ + Birch lá vàng), đông `pine` (PineTree_Snow), sa mạc `cactus` (Cactus/CactusFlowers, không làm mềm), biển `palm` (PalmTree); wilds.js `pine/maple/cactus/palm` gọi vào. Thành phố: `tree(x, z)` trong index.html → `NATURE.place("city")` (lớp "c", có vệt bóng râm mềm vì cây gộp không đổ bóng thật). Lá tối bớt ~20% (`TINT`), lá hồng bớt xanh dương (hết ánh tím). Rừng trúc tách vùng riêng (`bambooZone` – nhiễu, vòng 2 rộng hơn). Chưa đổi: `bigTree` gắn trong ngoại thất từng toà nhà, cây đước (mangrove) bờ biển, trúc (vẫn khối code). Góc chơi: xuân ~100–150k, thu ~100k, đông ~125k, sa mạc / biển / thành phố 40–70k tam giác.

**Cây mô hình Quaternius cho mùa xuân (18/11, chủ dự án tải 2 bộ qua Drive):** `parts/world/nature.js` (`NATURE`) + `assets/nature/` (~0,65 MB GLB chuyển từ OBJ bằng trimesh). Cây = "Textured Stylized Trees" (Tree_1/7/9/10, lá ảnh cắt hình, biến thể lá hồng cho cây anh đào), bụi / hoa / gốc rêu = "Ultimate Nature". `lushTree` trong wilds.js gọi `NATURE.tree` (mọi nơi dùng lushTree), `flowers` + `carpet()` rải thưa bụi/hoa ở Blossom Valley vòng 1. KHÔNG rải cỏ / cây con sẫm (thành đốm tối khi nhìn từ trên). Lá: pháp tuyến hướng ra từ tâm tán; tán trong suốt khi che người chơi (ngưỡng 1,1 m vì tán thấp). Nặng hơn cây "bông": ~95–130k tam giác ở góc chơi (cây "bông" ~40–68k). Ultimate Nature còn đủ bộ cây mùa thu / tuyết / cọ / xương rồng / đá tuyết (OBJ gốc ở Drive chủ dự án) – bước tiếp: áp cho 4 vùng mùa còn lại.

**Nền sạch + chấm quái (18/11, góp ý chủ dự án):** bỏ đốm hoa vẽ trong ảnh nền (nhòe khi phóng to). Đường mòn 5 hướng, sân trước cổng, suối mùa xuân (nước + bờ) KHÔNG vẽ vào ảnh nền nữa mà dựng thành dải hình mép sắc (`ribbons()` trong wilds.js; vật liệu đất cần `map` 1 điểm trắng để `detailed()` có vUv; mặt tự lật cho ngửa lên). Còn vẽ trong ảnh nền (mép còn mềm): hồ băng N, hồ thác NE, bờ biển SE, mảng đất. Rừng cụm thêm vòng 2 mùa xuân (Bamboo Hills, 30% tre). Bản đồ nhỏ: chấm đỏ = quái trong 40 m (tím = quái hơn mình > 3 cấp), mũi tên đỏ ở mép = 3 quái xa gần nhất (`miniMons` trong index.html). Quái lành lặn cách mọi người chơi > 75 m tự biến mất để quái mới sinh gần (engine.js `monTick`).

**Game feel chiến đấu (18/11):** file mới `parts/combat/feel.js` (`FEEL`): khựng hình khi trúng đòn (quái chạy chậm 5% trong 0,06–0,09 s), quái văng lùi ~0,8–1,1 m (chỉ quái mình điều khiển, không áp cho quái `T.boss`), vệt chém lưỡi liềm khi đánh thường, viền đỏ màn hình khi bị đánh, nổ hạt khi quái chết. `models.js`: quái lấy đà 0,5 s (ngả sau, phồng, nhấp nháy) rồi lao 0,3 s; trúng đòn nhá trắng + bẹp nảy như thạch; chết nảy lên, xoay, xẹp. `popText(text, pos, color, { stroke, big })`: số nảy to rồi thu, trôi chéo; số vàng to = chiêu nói, trắng = đánh thường. Rung màn hình giảm dần. **Chủ dự án định dùng API Meshy/Tripo để làm nhân vật/quái độc quyền** (đang so sánh 2 bên) → khi có khoá: `request_credential`, làm 1 mẫu chuẩn phong cách rồi tạo loạt, giảm số mặt, ghi `assets/CREDITS.md`.

**🎨 CHUẨN PHONG CÁCH NHÂN VẬT (chủ dự án chốt 18/11):** chibi hoạt hình 3D mềm – đầu to người nhỏ, mặt thân thiện, màu tươi sáng, trang phục kín đáo, có thể mang chất Việt (hoa văn mây, nón lá, áo bà ba, đồ học sinh). KHÔNG dùng: low-poly góc cạnh kiểu gấp giấy; anh hùng fantasy dáng người lớn / trang phục hở. Trong game giữ dáng + tỉ lệ + bảng màu, chất liệu làm đơn giản (màu phẳng, tô bóng mềm, ít mặt). Quy trình: AI vẽ ảnh 2D (ChatGPT / Gemini / Copilot) → Meshy hoặc Tripo (Image to 3D, GLB, ít mặt) → CTO đo, giảm, đưa vào game. Ảnh game thương mại chỉ để tham khảo, không chép.

**Việc treo / chờ chủ dự án:**
- **Giọng đọc AI tạo sẵn** (chốt: Azure trước, sau này đổi ElevenLabs; KHÔNG gọi AI mỗi lần đọc): chủ dự án đăng ký Azure bị lỗi (email trường không xác minh được; tài khoản cá nhân pay-as-you-go báo "couldn't complete sign-up" – có thể do thẻ). Phương án dự phòng: OpenAI TTS (~2 USD). Có khoá thì: `request_credential` cho host dịch vụ, viết công cụ tạo file giọng cho ~4.830 câu / 122.000 ký tự (gán giọng theo NPC, đọc chậm cho trẻ, chỉ tạo câu chưa có), lưu `assets/voice/`, game phát file, thiếu thì dùng giọng máy.
- **Mã mời:** 11 mã (Hoc sinh 1–10 + Chu du an; mã gốc chỉ chủ dự án giữ, code chỉ có mã băm). Supabase đã cài `docs/setup/invites.sql`; nhắc chủ dự án chạy khối "THÊM 8 MÃ" nếu chưa. **Bảng báo cáo** `docs/setup/reports.sql` – chủ dự án cần chạy để nút ⚠️ Report của bộ đàm hoạt động.
- **Cần thử trên điện thoại thật:** bộ đàm đội trên iPhone (có tự chuyển bộ đàm chữ không), lag khi ra chiêu (đã chống bằng `warmSkillFx` + chấm sau khi tắt micro), độ to nhạc nền, chấm điểm SOUNDS (máy nhận dạng hay tự sửa từ).
- **Gọi chiêu cho đồng đội** (Harmony chỉ hồi máu / khiên khi đồng đội nói "Heal me!", "Shield now!" qua bộ đàm) – chủ dự án hoãn, làm sau visual.
- **Lưu tiến độ lên server theo tài khoản** (🔴 dữ liệu trẻ em): hiện trình duyệt xoá dữ liệu là mất tiến độ.

**LISTEN giới hạn độ dài theo cấp (chốt 20/11, đã làm):** Lv < 10 → câu ≤ 4 từ, Lv < 20 → ≤ 6 từ, sau đó tự do (`listenMax()` trong parts/combat/engine.js). Loại đề không phụ thuộc quái (trừ DESCRIBE).

0. **4 dạng bài đã duyệt ý tưởng (17/11), đã có trong bảng 📚 Challenges với nhãn "Coming soon" (`soon: true` trong `CHALLENGES`, engine.js):**
   - **REPLY (Lv.15):** đáp lại câu tình huống ("Can I help you?" → "Yes, I need a map."). Cần ngân hàng ~120 cặp câu – câu đáp theo `keys` như ANSWER. Writer viết.
   - **MY MISTAKES (Lv.10):** lấy LỖI THẬT của người chơi. Mỗi lần chấm Good/Weak ở REPEAT/LISTEN/FILL/BUILD: so từng từ câu đích với câu máy nghe được (thiếu từ, thiếu -s/-ed, sai trật tự) → lưu tối đa ~30 câu vào `save.combat.mistakes` (câu đích + phần sai). Đề: hiện câu người chơi đã nói, tô phần sai, người chơi nói lại câu đúng; làm đúng 2 lần thì xoá khỏi danh sách. Lưu ý: máy nhận dạng giọng nói hay tự sửa ngữ pháp → chủ yếu bắt được lỗi THIẾU từ / đuôi và sai trật tự, khó bắt lỗi chia động từ.
   - **GRAMMAR (Lv.20):** ngân hàng mẫu ngữ pháp gắn nhãn CEFR (A1: to be, there is, can; A2: past simple, comparatives, going to, present perfect cơ bản; B1: …). Chọn mẫu theo **trình độ ước lượng** của người chơi. Hiện CHƯA có ước lượng CEFR: làm trước bản đơn giản = theo cấp game (Lv.20–40 ≈ A2, 40+ ≈ B1) + tỉ lệ làm tốt từng dạng bài (`save.combat.deck`); sau này nối vào báo cáo CEFR (mục 8).
   - **DESCRIBE (Lv.25):** tả tranh 2–3 câu, chấm theo từ khoá. Chỉ xuất hiện khi đánh **✨ quái hoàng kim** (mới: xuất hiện ngẫu nhiên tỉ lệ thấp ~3%, viền vàng, máu ×3, rơi đồ hiếm tỉ lệ cao) hoặc trùm.
1. **Chiến đấu – phần còn lại:** vòng 3–4 (Lv.50–100, `parts/world/wilds.js`); rẽ hướng chuyên sâu mỗi nhánh ở Lv.50; **trùm khu vực đánh nhóm** (mỗi người một vai trong hội thoại nhiều lượt); quái Picture Golem (tả tranh); bãi tập hình nộm ở Verse Arena; bán vũ khí ở tiệm (vd Verse Electronics thêm người bán).
2. **Giao tiếp xã hội thêm:** nhiệm vụ "mỗi người giữ nửa thông tin" (info-gap), vai Guide (người cũ chỉ đường người mới), tặng đồ.
3. **Trò chơi đồng đội ở Verse Arena** (Quiz Tower, Word Race, Treasure Hunt, Team Battle) – thắng mới có đồ hiếm.
4. **Nội thất / ngoại thất còn thiếu:** Science Lab, Star Cinema, Fix-It Workshop; ngoại thất Pho Corner; các ô 🚧 (Gift Shop, Bookshop, Toy Store…).
5. **Bảng nhiệm vụ ở Town Hall**; chuỗi nhiệm vụ Pasteur ở bệnh viện.
6. **Tài khoản (Supabase Auth) + lưu tiến độ lên server** (🔴 hỏi trước: dữ liệu trẻ em).
7. Nâng cấp nhà riêng; mời bạn vào nhà, sổ khách.
8. Báo cáo năng lực CEFR cho phụ huynh và nhà trường (dùng `save.combat.deck`, `save.heart`, `save.spoken`).

**Cách đội làm việc (đã chạy ổn 6 đợt):** CTO (Opus) chốt khung + toạ độ + tên khu trước, rồi giao song song: Sonnet = hình ảnh (nội thất, địa hình, quái, hiệu ứng), Haiku = nội dung (NPC, từ vựng, đề nói). Agent tạo worktree từ `main` nên đề bài luôn có BƯỚC 0 `git merge --ff-only <nhánh làm việc>`. Công cụ thử của CTO (Playwright) để trong scratchpad, không commit.

### Hạn chế đã biết
- Quái **chỉ có trên máy mỗi người** (chưa đồng bộ); hiện chỉ ở Misty Park.
- Tiến độ lưu trên máy, đổi máy là mất.
- Gói Supabase miễn phí giới hạn tin nhắn thời gian thực mỗi tháng.
- Nhận dạng giọng nói trình duyệt kém ổn định với giọng trẻ em và trên iPhone; máy không có micro thì không thu thẻ từ vựng được.
- Nhân vật phong cách phiêu lưu giả tưởng; NPC dùng lại 5 bộ nhân vật KayKit.
- Đồ trưng bày từ vựng và thú/rau ngoài trời là emoji; điện thoại cũ có thể hiện khác nhau.
- Hạn mức thẻ (6/2/10, mỗi cấp +3/+1/+5) và điều kiện lên cấp (từ Lv.3, mỗi loại ≥ 70% hạn mức đạt ⭐⭐: `GATE_FROM`, `GATE_PCT` trong `parts/ui/progress.js`) là tạm, cần chỉnh sau khi người chơi thật thử.
- Găng tay / giày / thắt lưng hiện bằng vật nhỏ tô màu, không phải mô hình chi tiết. Sân tập kỹ năng dùng nhân vật chibi đơn giản.
- Chỉ học được chiêu kế tiếp trong mỗi nhánh (theo thứ tự cấp).
- Mái kính/vòm trong nhà đôi khi che tầm nhìn khi camera ngước lên cao.
