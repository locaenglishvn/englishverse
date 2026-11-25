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
