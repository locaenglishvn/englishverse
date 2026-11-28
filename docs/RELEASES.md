# Các bản ổn định (mốc khôi phục)

Mỗi lần merge vào `main`, CTO ghi lại mã commit của bản **đang chạy tốt ngay trước đó**.
Khôi phục: `git revert <mã merge lỗi>` (gỡ 1 đợt) hoặc đưa `main` về đúng mã trong bảng (gỡ nhiều đợt – hỏi chủ dự án trước).

| Ngày | Mã commit (main) | Nội dung bản này | QA |
|---|---|---|---|
| 2026-11-13 | `8936100` | Bảo tàng 4 khu, Thư viện, Ngân hàng, Bưu điện mới, tối ưu hiệu năng (~210 lần vẽ) | ✅ |
| 2026-11-13 | `c068e0d` | Vận hành đội AI: parts/, cổng QA, TEAM.md (trước đợt 1) | ✅ |
| 2026-11-13 | `a678afd` | Đợt 1: Town Hall, City Hospital, Verse School | ✅ |
| 2026-11-13 | `a8fceaa` | Đợt 2: Verse Plaza + 4 cửa hàng Market Street | ✅ |
| 2026-11-13 | `45caf01` | Đợt 3: Police, Fire, Clothes, Barber, Home & Cozy (bản nhỏ) | ✅ |
| 2026-11-13 | `1f2e25a` | Đợt 4: Home & Cozy, Verse Electronics, 4 tiệm to, tên NPC | ✅ |
| 2026-11-14 | `10d7c40` | Chiến đấu giai đoạn A | ✅ |
| 2026-11-14 | `fc48753` | Chiến đấu giai đoạn B | ✅ |
| 2026-11-16 | `2729187` | Chiến đấu giai đoạn C (vòng 2, quái chung) – mốc trước đợt góp ý chơi thử 16/11 | ✅ |
| 2026-11-18 | `e093389` | PR #49: bộ đàm đội, giao diện theme.js – mốc trước đợt visual (cây mịn + game feel) | ✅ |
| 2026-11-19 | `8495b5f` | PR #50–#59: đợt visual 18–19/11 (cây mô hình 5 mùa + thành phố, đường nhựa, nội thất hết lóa, game feel) – mốc cuối phiên | ✅ |
| 2026-11-23 | `dcfc24a` | Mốc trước khi gộp phiên 20–23/11 (cốt truyện, sổ tay quái, LISTEN theo cấp, khu Nhật bản đồ riêng, đồi hoa đi qua được) | ✅ |
| 2026-11-25 | `86b707f` | Mốc trước khi gộp phiên 23–25/11 (nhân vật chính Voice Guard Tripo, 2 quái Tripo To He + Tacke Gecko, sổ tay tổng hợp game, danh nhân, thử giáp) | ✅ |
| 2026-11-25 | `8596d6e` | PR #62 – nhân vật chính Voice Guard + 2 quái Tripo (bản trước khi sửa màu / cử động quái, PR #63) | ✅ |
| 2026-11-25 | `81f565f` | PR #63 – màu Tripo + quái cử động (bản trước khi sửa lỗi nhân vật đứng dang tay, PR #64) | ✅ |
| 2026-11-25 | `858b9a6` | PR #64 – sửa nhân vật dang tay (bản trước khi thay động tác chiến đấu bằng code, PR #65) | ✅ |
| 2026-11-25 | `6630d0e` | PR #65 – động tác chiến đấu bằng code (trước khi chỉnh chạy nam + tung phép nữ, PR #66) | ✅ |
| 2026-11-25 | `1f84c71` | PR #66 – chạy nam + tung phép nữ (trước khi chỉnh dáng đứng nam, PR #67) | ✅ |
| 2026-11-25 | `227729c` | PR #67 – dáng đứng nam (trước khi sửa túi đồ, PR #68) | ✅ |
| 2026-11-25 | `8e8d369` | PR #68 – túi đồ dáng đứng (trước khi thêm bàn tay nắm, PR #69) | ✅ |
| 2026-11-25 | `2cf7503` | PR #69 – bàn tay nắm (trước khi sửa tay / bỏ tai nghe / chân dung HUD, PR #70) | ✅ |
| 2026-11-25 | `70ddea2` | PR #70 – tay nắm, bỏ tai nghe bằng code (trước khi thay mô hình nhân vật chính bản 2, PR #71) | ✅ |
| 2026-11-26 | `1fd9ac3` | PR #71 – nhân vật chính bản 2 (trước khi sửa tay ngược + thêm kiểu tóc, PR #72) | ✅ |
| 2026-11-26 | `6f2a44d` | PR #72 – tóc nam bản thường (trước khi lên 11 kiểu tóc HQ, tay nữ mở, da hồng, ô Body – PR #73) | ✅ |
| 2026-11-26 | `588f74e` | PR #73 – tóc HQ, ô Body (trước khi đổi cổng torii tự qua, nắm tay nghiêng, mở khoá tiếng – PR #74) | ✅ |
| 2026-11-26 | `d194b17` | PR #74 – bàn giao phiên 23–26/11 (nhân vật chính Tripo, tóc, tay nắm, torii, sổ tay) – mốc cuối phiên | ✅ |
| 2026-11-26 | `243382a` | Trước bản thử 2.5D Blossom Valley (PR #75 là bản cuối) | ✅ |
| 2026-11-26 | `5409ac9` | PR #76 – bản thử 2.5D Blossom Valley (trước khi thay cây / đá bằng KayKit) | ✅ |
| 2026-11-26 | `cbdebcb` | PR #77 – cây / đá KayKit (trước khi thay bằng cây vẽ tay) | ✅ |
| 2026-11-26 | `968c2fe` | PR #78 – cây / đá vẽ tay (trước khi sửa đường mòn, suối, bản đồ lớn) | ✅ |
| 2026-11-26 | `070d395` | PR #79 – sửa đường mòn / suối / bản đồ (trước khi trả lại mảng đất) | ✅ |
| 2026-11-26 | `c3cf235` | PR #80 – Blossom Valley chốt (trước khi thử Maple Highlands) | ✅ |
| 2026-11-26 | `8425d2a` | PR #81 – thử Maple Highlands (trước khi thêm lá rụng) | ✅ |
| 2026-11-26 | `f845afc` | PR #82 – Maple Highlands lá rụng (trước khi làm 3 vùng còn lại) | ✅ |
| 2026-11-26 | `46280dc` | PR #83 – 2.5D 3 vùng (trước vật trang trí AI + hiệu ứng chuỗi ảnh) | ✅ |
| 2026-11-27 | `91f0b1b` | Trước hệ thống chiêu mới (Chiêu × Danh nhân) | ✅ |
| 2026-11-27 | `56a1b24` | PR #85 – hệ thống chiêu mới (trước hiệu ứng riêng Chương 1 + sắp xếp sổ tay) | ✅ |
| 2026-11-27 | `b32a5d1` | PR #86 – 19 hiệu ứng Chương 1 bản đầu (trước khi làm lại 16 chiêu theo góp ý) | ✅ |
| 2026-11-27 | `90630cb` | PR #87 – làm lại 16 chiêu Chương 1 (trước hiệu ứng Chương 2) | ✅ |
| 2026-11-27 | `5a38fb3` | PR #88 – hiệu ứng Chương 2 (trước Chương 3 + chùm X-quang) | ✅ |
| 2026-11-27 | `dda64cf` | PR #89 – hiệu ứng Chương 3 (trước Chương 4 + động cơ Benz) | ✅ |
| 2026-11-27 | `a4f4fcd` | PR #90 – hiệu ứng Chương 4 (trước tuyệt chiêu + icon chiêu) | ✅ |
| 2026-11-27 | `1935989` | PR #91 – 8 tuyệt chiêu + icon (trước tuyệt chiêu theo bậc + thần hiện ra) | ✅ |
| 2026-11-27 | `12d82d9` | PR #92 – tuyệt chiêu theo bậc (trước hồn thần 3D + đòn riêng) | ✅ |
| 2026-11-27 | `0ba05f0` | PR #93–94 – hồn thần 3D (trước chỉnh khoảng cách thần + font thư pháp) | ✅ |
| 2026-11-27 | `16ec7f4` | PR #95 – chữ thư pháp, khoảng chờ thần 2,2 s (trước dời thần ra hướng 10 giờ) | ✅ |
| 2026-11-27 | `552efff` | PR #96 – thần hướng 10 giờ (trước ô icon vuông + ảnh NPC) | ✅ |
| 2026-11-28 | `bb582b6` | PR #98 – đề xuất nhiệm vụ bản 1 (trước bản 2 + tab Lan truyền) | ✅ |
