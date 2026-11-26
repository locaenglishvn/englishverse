# Nguồn hình ảnh 3D (assets)

| Thư mục | Bộ gốc | Tác giả | Giấy phép |
|---|---|---|---|
| `characters/` | KayKit – Adventurers Character Pack 1.0 | Kay Lousberg (www.kaylousberg.com) | CC0 1.0 (miễn phí, dùng thương mại được) |
| `city/` | KayKit – City Builder Bits 1.0 | Kay Lousberg (www.kaylousberg.com) | CC0 1.0 |
| `furniture/` | KayKit – Furniture Bits 1.0 | Kay Lousberg (www.kaylousberg.com) | CC0 1.0 |
| `kaykit/` | KayKit – Forest Nature Pack 1.0 (14 mẫu cây / đá / bụi + ảnh bảng màu) | Kay Lousberg (www.kaylousberg.com) | CC0 1.0 |

Đã chỉnh sửa: chỉ giữ 10 hoạt ảnh cần dùng, bỏ vũ khí (kiếm, rìu, nỏ, dao, khiên, gậy, sách phép) cho phù hợp trẻ em.
Nguồn: https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0
Nguồn: https://github.com/KayKit-Game-Assets/KayKit-City-Builder-Bits-1.0 (dùng nguyên bản, không chỉnh sửa)
Nguồn: https://github.com/KayKit-Game-Assets/KayKit-Furniture-Bits-1.0 (dùng nguyên bản, không chỉnh sửa)
Nguồn: KayKit Forest Nature Pack (kaylousberg.itch.io), lấy bản sao .gltf ở github.com/flo-bit/roomy-worlds (static/kaykit-forest-nature) – dùng nguyên bản, đổi màu bằng cách dời cột ảnh trong code.

## Thư viện (thư mục `lib/`)
| File | Nguồn | Giấy phép |
|---|---|---|
| `three.min.js`, `GLTFLoader.js`, `SkeletonUtils.js` | three.js r128 (npm `three@0.128.0`) | MIT |
| `supabase.js` | npm `@supabase/supabase-js@2.89.0` (bản UMD) | MIT |

## Thiên nhiên (thư mục `assets/nature/`)
| Bộ gốc | Tác giả | Giấy phép | Dùng |
|---|---|---|---|
| Textured Stylized Trees (May 2020) | Quaternius (quaternius.com) | CC0 1.0 | Cây tán lá (Tree_1/7/9/10, Birch_2/4), ảnh lá xanh / hồng / cam / đỏ / vàng, vỏ cây |
| Ultimate Nature Pack | Quaternius (quaternius.com) | CC0 1.0 | Bụi cây, hoa, gốc cây rêu, thông tuyết, xương rồng, cọ |

Đã chỉnh sửa: chuyển OBJ → GLB (trimesh), thu nhỏ ảnh (256–512 px). Màu lá / pháp tuyến chỉnh bằng code trong `parts/world/nature.js`.
