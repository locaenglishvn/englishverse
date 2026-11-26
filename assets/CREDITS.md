# Nguồn hình ảnh 3D (assets)

| Thư mục | Bộ gốc | Tác giả | Giấy phép |
|---|---|---|---|
| `characters/` | KayKit – Adventurers Character Pack 1.0 | Kay Lousberg (www.kaylousberg.com) | CC0 1.0 (miễn phí, dùng thương mại được) |
| `city/` | KayKit – City Builder Bits 1.0 | Kay Lousberg (www.kaylousberg.com) | CC0 1.0 |
| `furniture/` | KayKit – Furniture Bits 1.0 | Kay Lousberg (www.kaylousberg.com) | CC0 1.0 |

Đã chỉnh sửa: chỉ giữ 10 hoạt ảnh cần dùng, bỏ vũ khí (kiếm, rìu, nỏ, dao, khiên, gậy, sách phép) cho phù hợp trẻ em.
Nguồn: https://github.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0
Nguồn: https://github.com/KayKit-Game-Assets/KayKit-City-Builder-Bits-1.0 (dùng nguyên bản, không chỉnh sửa)
Nguồn: https://github.com/KayKit-Game-Assets/KayKit-Furniture-Bits-1.0 (dùng nguyên bản, không chỉnh sửa)

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

## Cây / đá vẽ tay (thư mục `assets/painted/`) – bản 2.5D Blossom Valley
`trees.webp` = 1 ảnh gộp (đã xoá bóng vẽ sẵn, lật ngang, thu nhỏ, cắt gọn) từ 3 bộ trên OpenGameArt.org, giấy phép **CC-BY 3.0** (miễn phí, dùng thương mại được, phải ghi tên tác giả):
| Phần | Bộ gốc | Tác giả | Nguồn |
|---|---|---|---|
| 10 cây xanh, cây liễu, 2 bụi | Tree Collection v2.6 | **Bleed** (Bleed's Game Art) | https://opengameart.org/content/tree-collection-v26-bleeds-game-art |
| Cây anh đào | Hand Painted Trees | **Robert Ramsay** | https://opengameart.org/content/hand-painted-trees |
| 12 tảng đá | Large rocks | **davidbv** | https://opengameart.org/content/large-rocks |
