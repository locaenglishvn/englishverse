-- EnglishVerse – BÁO CÁO từ bộ đàm đội (parts/social/radio.js, nút ⚠️ Report).
-- CÁCH CÀI (1 lần): Supabase → SQL Editor → New query → dán toàn bộ file này → Run.
-- Người chơi CHỈ THÊM được báo cáo, không đọc / sửa / xoá được. Chỉ anh (chủ dự án) xem được trong Supabase.

create table if not exists public.reports (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  reporter      text,            -- mã ngẫu nhiên của người báo cáo trong phiên chơi
  reporter_name text,
  reported      text,            -- mã ngẫu nhiên của người bị báo cáo
  reported_name text,
  text          text,            -- câu máy nhận dạng được
  blocked       boolean,         -- true = câu đã bị chặn (người nghe chỉ nghe beep)
  audio_b64     text,            -- đoạn ghi âm (base64), có thể trống nếu là bộ đàm chữ
  audio_mime    text,
  said_at       timestamptz,
  reviewed      boolean not null default false
);
alter table public.reports enable row level security;
drop policy if exists "anyone can report" on public.reports;
create policy "anyone can report" on public.reports for insert to anon with check (
  length(coalesce(audio_b64, '')) < 300000 and length(coalesce(text, '')) < 200
);
grant insert on public.reports to anon;

-- XEM BÁO CÁO MỚI (chạy riêng):
-- select id, created_at, reported_name, reporter_name, text, blocked, audio_b64 is not null as co_ghi_am from public.reports where not reviewed order by id desc;
-- NGHE 1 đoạn ghi âm: chạy câu dưới (đổi số id), copy ô kết quả, dán vào thanh địa chỉ trình duyệt rồi Enter:
-- select 'data:' || audio_mime || ';base64,' || audio_b64 from public.reports where id = 1;
-- ĐÁNH DẤU đã xem:
-- update public.reports set reviewed = true where id = 1;
