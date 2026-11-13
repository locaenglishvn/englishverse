# Các bản ổn định (mốc khôi phục)

Mỗi lần merge vào `main`, CTO ghi lại mã commit của bản **đang chạy tốt ngay trước đó**.
Khôi phục: `git revert <mã merge lỗi>` (gỡ 1 đợt) hoặc đưa `main` về đúng mã trong bảng (gỡ nhiều đợt – hỏi chủ dự án trước).

| Ngày | Mã commit (main) | Nội dung bản này | QA |
|---|---|---|---|
| 2026-11-13 | `8936100` | Bảo tàng 4 khu, Thư viện, Ngân hàng, Bưu điện mới, tối ưu hiệu năng (~210 lần vẽ) | ✅ |
| 2026-11-13 (chiều) | `c068e0d` | Trước khi thêm Bakery, giới hạn 120 phút, vị trí mới | ✅ |
