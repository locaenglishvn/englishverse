-- EnglishVerse – MÃ MỜI khoá theo máy (parts/ui/invite.js).
-- CÁCH CÀI (làm 1 lần, ~2 phút):
--   1. Mở https://supabase.com/dashboard → chọn project EnglishVerse → menu trái "SQL Editor" → "New query".
--   2. Dán TOÀN BỘ file này vào → bấm "Run". Thấy "Success" là xong.
-- Bảng chỉ lưu: mã đã băm (không phải mã gốc), số ngẫu nhiên đại diện cho máy, thời điểm dùng, ghi chú. Không có thông tin cá nhân.

create table if not exists public.invites (
  code_hash  text primary key,
  device     text,
  claimed_at timestamptz,
  note       text
);
alter table public.invites enable row level security;   -- không ai đọc/sửa bảng trực tiếp được, chỉ qua hàm bên dưới

create or replace function public.claim_invite(p_hash text, p_device text)
returns text language plpgsql security definer set search_path = public as $$
declare d text;
begin
  select device into d from invites where code_hash = p_hash;
  if not found then return 'unknown'; end if;
  if d is null then update invites set device = p_device, claimed_at = now() where code_hash = p_hash; return 'ok'; end if;
  if d = p_device then return 'ok'; end if;
  return 'taken';
end $$;
grant execute on function public.claim_invite(text, text) to anon;

insert into public.invites (code_hash, note) values
  ('21bb0956ba5adbe5b9a5ff017c28ff06fb347e9bde80d7864c5e77a4879fdde5', 'Hoc sinh 1'),
  ('80b62c4eb31d03fdd2ed55c155e6f679a9b0300b13d45664afeae97aa466162d', 'Hoc sinh 2'),
  ('9397753d8749ce49fde7e83137fa8bbd22a4153bf7d4029e76b888b00118f7f9', 'Chu du an')
on conflict (code_hash) do nothing;

-- THÊM 8 MÃ (17/11) – chạy riêng khối này nếu đã cài file trước đó:
insert into public.invites (code_hash, note) values
  ('e6d63c8c41ec94e1b46e0b6b589af285cfa42ccbe0061a2aeaf0390e329e1ed0', 'Hoc sinh 3'),
  ('dd289c91f6ccd068bb89b1e6a16c359bb074b13a6c40d3000cee1e96ce5c2135', 'Hoc sinh 4'),
  ('11693daa41f9685ab4bce38fe259baa9da89b8790ac19f1f75c2778e1bbec026', 'Hoc sinh 5'),
  ('c2e5320d71396ef36e94bee141c235cfd700d198a489f2d19e0308743c1137e0', 'Hoc sinh 6'),
  ('14f585aa69dd38f1d1d5816056cc242180a74d5829dc3f81deb3635a28f2546f', 'Hoc sinh 7'),
  ('ed81bea1651de38cdc9948e1a1eba2b37cf0704be9090e306fe4c8c1873dca97', 'Hoc sinh 8'),
  ('f8f2031c096289540fb96c2f7c5a4194f304f433692039574497746bf8def110', 'Hoc sinh 9'),
  ('b4bae713ac01354a2799b24c22c890e4d2e5a32517b1d381c26b81c74a1748da', 'Hoc sinh 10')
on conflict (code_hash) do nothing;

-- SAU BẢN 17/11 (mã gắn theo dấu vân tay máy thay vì số ngẫu nhiên): chạy 1 lần dòng dưới để gỡ các lần gắn cũ:
-- update public.invites set device = null, claimed_at = null;
-- MỞ KHOÁ 1 mã (bé đổi máy / xoá dữ liệu trình duyệt) – chạy riêng dòng này, đổi tên ghi chú cho đúng:
-- update public.invites set device = null, claimed_at = null where note = 'Hoc sinh 1';
-- XEM mã nào đã dùng:
-- select note, claimed_at, device is not null as da_dung from public.invites;
