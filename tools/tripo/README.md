# Quy trình Tripo API (đã chạy thử 25/11 với 2 nhân vật chính)

Khoá API lưu ở cài đặt môi trường (proxy tự gắn), host `api.tripo3d.ai` (API v2). File kết quả tải từ `tripo-data.rg1.data.tripo3d.com`.
Header gửi kèm: `Authorization: Bearer proxy-injected` (proxy thay bằng khoá thật).

| Bước | Gọi | Credit thật |
|---|---|---|
| Tải ảnh | `POST /v2/openapi/upload` (multipart `file`) → `image_token` | 0 |
| Dựng 3D ít mặt | `POST /v2/openapi/task` `{"type":"multiview_to_model","model_version":"P1-20260311","files":[front,{},back,{}],"texture":true,"pbr":false}` | 50 |
| Kiểm tra gắn xương | `{"type":"animate_prerigcheck","original_model_task_id":…}` | 0 |
| Gắn xương | `{"type":"animate_rig","original_model_task_id":…,"out_format":"glb","rig_type":"biped","spec":"tripo"}` | 25 |
| Động tác | `{"type":"animate_retarget","original_model_task_id":<rig task>,"animations":["preset:idle","preset:walk","preset:run","preset:slash","preset:hurt"],"bake_animation":true,"export_with_geometry":true}` | 50 (10/động tác) |
| Xem trạng thái | `GET /v2/openapi/task/<id>` → `output.model` (link GLB) | – |
| Số dư | `GET /v2/openapi/user/balance` | – |

Ảnh đầu vào: cắt vuông 1024×1024, nhân vật ở giữa, nền xám (xem cách cắt trong lịch sử phiên). Ảnh nghiêng chưa dùng (chưa chắc quy ước trái/phải).
Kết quả: ~5.000 mặt, 41 khớp (Root, Hip, Pelvis, Head, L_Hand, R_Hand, L_Foot, R_Foot…), GLB 1,8 MB có 5 động tác.
Động tác đi / chạy có di chuyển gốc xương (Root, Hip): khi dùng trong game phải khoá trục trôi (xem `inPlace` trong docs/design/hero-viewer.html).
Lưu ý: Tripo đang chuyển sang API v3 (`openapi.tripo3d.ai`); khi v2 tắt cần lưu khoá cho host mới.

## Lắp ghép món đồ (thử 25/11 – THÀNH CÔNG, xem swap-demo.html / swap-demo.png)
- Mô hình Tripo đã gắn xương tự chia gọn theo xương chi phối mỗi đỉnh: **đầu** (Head, NeckTwist – gồm tóc, tai nghe), **bàn tay** (L_Hand/R_Hand), **bàn chân + giày** (L_Foot/L_ToeBase, R_…), **thân** (còn lại).
- Ẩn vùng: lọc tam giác theo vùng (`hideRegion`). Ghép vùng của mô hình khác: chuyển đỉnh về không gian xương (`boneInverses × bindMatrix`) rồi gắn **khối cứng** vào xương cùng tên của mô hình đích (`rigidPart`) – đầu, giày, mũ khớp liền mạch vì mọi nhân vật cùng tỉ lệ 3,9 đầu và cùng tên xương Tripo.
- Nắm tay: Tripo không có xương ngón (cả chuẩn tripo lẫn mixamo, đã thử – 25 credit) → uốn sẵn đỉnh phía trên khớp ngón quanh trục ngang lòng bàn tay (`makeFist`) – còn thô, cần tinh chỉnh.
