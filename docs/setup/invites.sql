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

-- SAU BẢN 17/11 (mã gắn theo dấu vân tay máy thay vì số ngẫu nhiên): chạy 1 lần dòng dưới để gỡ các lần gắn cũ:
-- update public.invites set device = null, claimed_at = null;
-- MỞ KHOÁ 1 mã (bé đổi máy / xoá dữ liệu trình duyệt) – chạy riêng dòng này, đổi tên ghi chú cho đúng:
-- update public.invites set device = null, claimed_at = null where note = 'Hoc sinh 1';
-- XEM mã nào đã dùng:
-- select note, claimed_at, device is not null as da_dung from public.invites;
