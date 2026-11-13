# EnglishVerse – Cách vận hành đội (người + AI)

> File này là "sổ tay công ty". **Mọi AI làm việc trong dự án phải đọc file này + `docs/ROADMAP.md` trước khi bắt đầu.**
> Cập nhật khi quy trình thay đổi hoặc khi gặp lỗi mới cần nhắc (mục 7).

---

## 1. Mục tiêu & khách hàng (chủ dự án chốt ngày 13/11/2026)

- **Mục đích:** game học nghe – nói tiếng Anh, đồng thời là đề tài nghiên cứu thạc sĩ Ngôn ngữ Anh của chủ dự án (độ hút, trải nghiệm, giá trị học thật). Định hướng lâu dài: đóng góp cho mục tiêu tiếng Anh thành ngôn ngữ thứ 2 trong giáo dục.
- **Điểm khác biệt khó sao chép:** dữ liệu + chuyên môn sư phạm tiếng Anh (hơn 10 năm) của chủ dự án; sau này có thể có công nhận pháp lý. → Nội dung học (NPC, từ vựng, độ khó, cách chấm) là **tài sản cốt lõi**, phải có chất lượng chuyên môn.
- **Không thu tiền để được chơi.** Chơi miễn phí vẫn nhận đủ giá trị ngôn ngữ.
- **Người chơi chính:** từ ~8–9 tuổi (lớp 3) trở lên, trình độ **Cambridge Movers – Flyers ≈ CEFR A1–A2** (mục tiêu nghe nói A1–B1). Nhóm lớp 6–9 là nhóm "máu game" nhất; người lớn đến vì giá trị học. Sau này thêm lựa chọn trình độ B1/B2 cho cùng bản đồ.
- **Chơi có kỷ luật:** game phải hút nhưng có giới hạn lành mạnh để phụ huynh yên tâm.
- **Mốc:** cuối tuần 14–15/11 thử với 6–10 người · **30/11 mở cho ~100 người** thử nghiệm (nghiên cứu).
- **Ưu tiên phát triển (theo thứ tự):** (a) nội thất thành phố → (b) đánh quái bằng nhạc cụ → (c) online & xã hội → (d) cốt truyện mở đầu cho người mới.
- **Ngân sách AI:** ~500.000đ/tháng trong tháng 11; tăng nếu thử nghiệm tốt.

## 2. Sơ đồ đội

| Vai | Ai | Làm gì | Quyền |
|---|---|---|---|
| **Chủ dự án** | Người dùng | Đặt mục tiêu, chọn hướng, duyệt "gu", trả lời câu hỏi 🔴 | Cao nhất |
| **CTO** | Claude Opus | Chia việc, viết đề bài, rà soát, QA, ghép, merge, báo cáo | Theo bảng mục 3 |
| **Builder** | Claude Sonnet (agent phụ) | Dựng nội thất / ngoại thất 3D, tính năng theo đề bài | Chỉ sửa file được giao, trên nhánh riêng. **Không merge** |
| **Writer & Checker** | Claude Haiku (agent phụ) | Viết NPC + từ vựng theo mẫu, soát chính tả / độ khó, chạy QA | Chỉ sửa phần dữ liệu được giao. **Không merge** |

Quyền của agent phụ không bao giờ vượt quyền CTO. Mọi thứ vào `main` đều đi qua CTO.

**Tiết kiệm:** Opus chỉ làm phần cần phán đoán (thiết kế, đề bài, rà soát). Việc theo khuôn → Sonnet/Haiku. Đề bài phải đủ rõ để agent làm 1 lần là đạt (đỡ tốn lượt sửa).

## 3. Phân quyền quyết định

| Mức | Việc | Cách làm |
|---|---|---|
| 🟢 **CTO tự quyết, tự merge** | Sửa lỗi, tối ưu hiệu năng, sắp xếp code (không đổi cách chơi), công cụ QA, tài liệu. Nội thất / ngoại thất theo ảnh hoặc tên toà nhà chủ dự án đưa (hoặc ảnh CTO tự tìm cho nơi không có yêu cầu riêng). NPC + từ vựng đúng quy tắc mục 6 | Làm xong báo cáo |
| 🟡 **CTO quyết, báo để biết** | Chi tiết thiết kế trong phong cách đã có (bố trí đồ, tên NPC, màu phụ). Chỉnh nhỏ độ khó, giá đồ, phần thưởng | Gom vào báo cáo; chủ dự án phản đối thì sửa lại |
| 🔴 **Phải hỏi trước** | Hệ thống chơi mới, cốt truyện. Kinh tế lớn (Legendary, tiền thật). Đổi phong cách hình ảnh / quy hoạch bản đồ. Xoá tính năng. **Đổi cấu trúc dữ liệu lưu của người chơi.** Dịch vụ ngoài / chi phí mới. **An toàn trẻ em, dữ liệu cá nhân, thu thập dữ liệu nghiên cứu.** Nội dung nhạy cảm (lịch sử, chính trị, người thật, thương hiệu thật) | Đưa 2–3 phương án + gợi ý, chờ chọn |

## 4. Quy trình một đợt việc

1. **Đề bài (CTO):** từ mục tiêu + ảnh/tên toà nhà → chốt bố cục, viết đề bài theo mẫu mục 5.
2. **Làm (agent):** mỗi agent 1 việc, trên bản sao repo riêng (git worktree, nhánh riêng). Mỗi nơi 1 file riêng → không đè nhau.
3. **Cổng QA:** agent phải chạy `node tools/qa/run.js <id>` và đạt ✅ trước khi nộp. Trượt → tự sửa.
4. **Rà soát (CTO):** xem ảnh `tools/qa/out/<id>.png` so với ảnh gốc, đọc hội thoại (tự nhiên? đúng trình độ? an toàn cho trẻ?), chỉnh lần cuối.
5. **Phát hành (CTO):** ghi mốc bản đang chạy vào `docs/RELEASES.md` → merge qua PR → chạy lại QA toàn bộ → báo cáo kèm ảnh.

## 5. Mẫu đề bài (CTO → agent)

```
VIỆC: Nội thất <Tên nơi> (id: <id>, layout: "<layout>")
FILE ĐƯỢC SỬA: parts/interiors/<id>.js (tạo mới) · places.js (chỉ mục <id> và VOCAB.<id>) · lessons.js (chỉ thêm NPC place: "<id>")
THAM KHẢO: <ảnh / tên toà nhà thật> – lấy phong cách, KHÔNG chép logo / thương hiệu
KÍCH THƯỚC: size { w, d, h } · các khu: <tên khu → nội dung>
NPC: ≥ 4 (1 NPC minLv: 5), mỗi NPC 3 bước · TỪ VỰNG: ~30 món, chia theo khu (at)
TIÊU CHÍ ĐẠT: node tools/qa/run.js <id> → ✅ ĐẠT · ảnh nhìn giống tham khảo · lần vẽ ≤ 360
KHÔNG ĐƯỢC: sửa index.html (trừ khi đề bài cho phép), đổi dữ liệu lưu, xoá nội dung có sẵn
```

## 6. Sổ tay kỹ thuật cho agent

**Cấu trúc file**
- `index.html` = lõi game (CTO giữ). `parts/registry.js` = danh bạ. `parts/interiors/<id>.js` = nội thất từng nơi. `parts/exteriors/<tên>.js` = ngoại thất mới.
- File mới cần 1 dòng `<script src="parts/…">` trong index.html (ngay sau `parts/registry.js`) – CTO thêm khi ghép.
- Nội thất tự đăng ký: `INTERIORS["<layout>"] = { furnish, wall?, customWalls?, bright? }` (xem chú thích trong `parts/registry.js`; ví dụ mẫu: `parts/interiors/bank.js`, `post.js`, `museum.js`).
- Ngoại thất mới: `EXTERIORS_EXTRA["<tên>"] = function (g, P) { … return { solids, door, map }; }`, vẽ mặt tiền quay về +z.

**Nội thất – bắt buộc**
- Hàm chung dùng được: `lb, lc, mat, addBox, skin, face, textPlate, signText, archPath, archWin, rectWin, pot, bigTree, emojiSprite, fur` (đồ KayKit).
- Vật cản: `P.room.solids.push({ x, z, hw, hd })` (nửa rộng / nửa sâu). Chừa lối đi ≥ 1,5 m; **không đặt gì ở chỗ đứng khi vào cửa** (giữa phòng, cách cửa ~4,5 m với phòng có `size`).
- Chỗ bày từ vựng: `P.anchors = { <khu>: [[x, y, z, chỗ đứng x, chỗ đứng z], …] }`, rồi `P.vgroup = new THREE.Group(); g.add(P.vgroup);`. Số chỗ mỗi khu ≥ số món có `at` = khu đó. Chỗ đứng phải đi tới được.
- Mái / trần / vật trên cao: `userData.flat = true` (không đổ bóng).
- **Vật chuyển động hoặc hiện/ẩn sau khi tải** (quạt quay, cửa mở…) phải thêm vào danh sách bỏ qua `dyn` trong `bakeWorld()` (index.html, mục 9); nếu không sẽ bị gộp khối và đứng im. Báo CTO.
- Cửa hàng nhỏ (16 × 18 m): dùng khung chung `shopKit()` trong `parts/interiors/shopkit.js` (mẫu: `bakery.js`). Three.js bản r128: KHÔNG có `CapsuleGeometry` (dùng hình cầu kéo dãn).
- Hiệu năng: dùng `mat(màu)` (dùng chung chất liệu) thay vì tạo chất liệu mới; nhiều vật giống nhau → `InstancedMesh`.

**NPC (lessons.js) – trình độ Movers/Flyers (A1–A2)**
- ≥ 4 NPC mỗi nơi, mỗi NPC 3 bước; mỗi bước: `say`, `card` (thẻ câu nói), 3 `choices` (≥ 1 `ok: true`, 2 sai có `fb` gợi ý nhẹ nhàng, **không chê**), thêm `q` (thẻ câu hỏi) ở 1–2 bước.
- Câu ngắn (thường ≤ 12 từ), từ thông dụng, thì hiện tại / quá khứ đơn / will / can / would like. Đáp án sai = lỗi người Việt hay mắc (sai trật tự, thiếu động từ, nhầm từ) hoặc lạc đề vui.
- 1 NPC khó hơn có `minLv: 5`. Không bạo lực, không nội dung người lớn, không chính trị; danh nhân phải đúng lịch sử, không bịa trích dẫn.
- `x, z` tính từ giữa phòng; không đứng trong vật cản, không chắn lối.

**Từ vựng (places.js → VOCAB.<id>)**
- Trường: `w, pic (emoji), pos, kind (drink/food/tool/machine/plant/furniture/thing), at, say ("It's a …"), ex` (câu ví dụ ngắn, tự nhiên).
- Không trùng từ đã có ở nơi khác (QA sẽ cảnh báo). Chọn từ đúng ngữ cảnh nơi đó, hữu ích cho trẻ.

## 7. Lỗi hay gặp (bổ sung dần)
- Ghế/bàn đặt ngay chỗ đứng khi vào phòng → người chơi kẹt ở cửa (đã gặp ở Trường học, Đồn công an).
- NPC đứng chắn lối hẹp giữa 2 dãy bàn → không tới được đồ phía trong (đã gặp ở Thư viện).
- Tấm tường trên cửa giữa 2 khu thò sang mái khu bên cạnh → lùi tấm đó vào trong khu mình.
- Nhãn tên NPC xuyên tường: nơi nhiều khu dùng `P.zones` để chỉ hiện tên trong khu đang đứng.

## 8. Backup & khôi phục
| Lớp | Cách | Khôi phục |
|---|---|---|
| Lịch sử git | Mọi thay đổi là commit | Lấy lại từng file / dòng |
| PR | Không sửa thẳng `main`; mỗi đợt 1 PR | Revert cả PR bằng 1 lệnh |
| Mốc ổn định | CTO ghi mã commit của bản đang chạy tốt vào `docs/RELEASES.md` trước mỗi lần merge (môi trường hiện tại không cho đẩy git tag) | Quay về mốc trong vài phút |
| Dữ liệu người chơi | Lưu ở máy người chơi + Supabase, không nằm trong code | Không đổi cấu trúc lưu khi chưa hỏi (🔴) |

Từ 30/11 (khi có ~100 người): thêm bản thử nghiệm (staging) để duyệt trước khi lên `main`.

## 9. Liên lạc & báo cáo
- Kênh chính: **app Claude trên điện thoại** (cùng tài khoản) → mở phiên làm việc này để đọc báo cáo, trả lời, giao việc. Bật thông báo cho app.
- CTO gửi thông báo khi: xong một đợt việc, hoặc cần quyết định 🔴. Không báo từng bước nhỏ.
- Báo cáo định kỳ hằng ngày (~20h giờ Việt Nam) nếu trong ngày có việc: ✅ đã xong · 🔄 đang làm · ❓ cần quyết (kèm phương án) · ➡️ tiếp theo.
- Mỗi đợt có PR mô tả rõ trên GitHub.
