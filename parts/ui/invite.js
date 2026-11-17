/* EnglishVerse – MÃ MỜI (giai đoạn thử nghiệm kín, chủ dự án chốt 17/11, phương án B).
   - Mỗi người được 1 mã riêng. Lần đầu nhập, mã được GẮN vào máy đó (số ngẫu nhiên ev_device, không phải thông tin cá nhân).
     Máy khác nhập lại mã đó sẽ bị từ chối → bé có gửi link + mã cho bạn thì bạn cũng không vào được.
   - Kiểm tra trên Supabase bằng hàm claim_invite (cài bằng docs/setup/invites.sql). Khi hàm CHƯA được cài, game chỉ kiểm tra mã
     trên máy (vẫn chặn người không có mã, nhưng chưa chặn được việc 1 mã dùng trên 2 máy).
   - Trong code chỉ có mã BĂM (SHA-256), không có mã gốc. Thêm người: thêm mã băm vào INVITE_HASHES + 1 dòng insert trong SQL.
   - Mở khoá 1 mã (bé đổi máy / xoá dữ liệu trình duyệt): chạy câu "update invites set device = null where note = '...';" trong Supabase.
   - Tắt hẳn cổng mã mời (khi mở công khai): INVITE_ON = false. Kiểm thử tự động (QA): localStorage.ev_qa = "1". */
const INVITE_ON = true;
const INVITE_HASHES = { "21bb0956ba5adbe5b9a5ff017c28ff06fb347e9bde80d7864c5e77a4879fdde5": "Hoc sinh 1", "80b62c4eb31d03fdd2ed55c155e6f679a9b0300b13d45664afeae97aa466162d": "Hoc sinh 2", "9397753d8749ce49fde7e83137fa8bbd22a4153bf7d4029e76b888b00118f7f9": "Chu du an" };
window.EV_LOCKED = false;
(function () {
  if (!INVITE_ON) return;
  let ls = {}; try { ls = window.localStorage; } catch (e) {}
  const get = k => { try { return ls.getItem(k); } catch (e) { return null; } }, set = (k, v) => { try { ls.setItem(k, v); } catch (e) {} };
  if (get("ev_qa") === "1") return;
  if (INVITE_HASHES[get("ev_invite")]) return;   // máy này đã được cấp mã
  window.EV_LOCKED = true;
  let dev = get("ev_device"); if (!dev) { dev = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()); set("ev_device", dev); }
  const sha = async t => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)))).map(b => b.toString(16).padStart(2, "0")).join("");
  async function claim(h) {   // → "ok" | "taken" | "unknown" | "offline" (chưa cài hàm / mất mạng)
    try {
      const ac = new AbortController(); setTimeout(() => ac.abort(), 6000);   // mạng chậm: tối đa 6 giây
      const r = await fetch(SUPABASE_URL + "/rest/v1/rpc/claim_invite", { method: "POST", signal: ac.signal, headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_hash: h, p_device: dev }) });
      if (!r.ok) return "offline"; return String(await r.json());
    } catch (e) { return "offline"; }
  }
  function show() {
    const o = document.createElement("div"); o.id = "inviteGate";
    o.style.cssText = "position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;background:radial-gradient(ellipse at 50% 30%,#2a3560,#0b1024);touch-action:auto;user-select:text;-webkit-user-select:text";
    o.innerHTML = "<div class='ev-panel' style='width:min(360px,100%)'><div class='ev-in' style='text-align:center'>" +
      "<div style='font-size:40px'>🎟️</div><div class='ev-title' style='font-size:20px'>EnglishVerse</div>" +
      "<p style='font-size:14px;color:var(--ev-mut);margin:6px 0 12px'>Enter your invite code<br><i style='font-size:12.5px'>Nhập mã mời thầy/cô gửi cho em</i></p>" +
      "<input id='invCode' autocomplete='off' autocapitalize='characters' spellcheck='false' placeholder='EV-XXXX-XXXX' style='width:100%;box-sizing:border-box;font:700 20px var(--ev-font);text-align:center;letter-spacing:.08em;padding:10px;border:2px solid var(--ev-gold);background:#0b1024;color:#fff;border-radius:6px'>" +
      "<div id='invMsg' style='min-height:20px;font-size:13px;margin:8px 0;color:var(--ev-bad)'></div>" +
      "<button class='ev-btn' id='invGo' style='font-size:16px;padding:10px 26px'>Start ▸</button></div></div>";
    document.body.appendChild(o);
    const inp = o.querySelector("#invCode"), msg = o.querySelector("#invMsg"), go = o.querySelector("#invGo");
    ["pointerdown", "touchstart", "keydown"].forEach(ev => o.addEventListener(ev, e => e.stopPropagation()));
    go.onclick = async () => {
      const code = inp.value.trim().toUpperCase().replace(/\s+/g, ""); if (!code) return;
      go.disabled = true; msg.style.color = "var(--ev-mut)"; msg.textContent = "Checking…";
      const h = await sha(code);
      if (!INVITE_HASHES[h]) { go.disabled = false; msg.style.color = "var(--ev-bad)"; msg.innerHTML = "This code is not right. / Mã chưa đúng, em kiểm tra lại nhé."; return; }
      const r = await claim(h);
      if (r === "taken" || r === "unknown") { go.disabled = false; msg.style.color = "var(--ev-bad)"; msg.innerHTML = "This code is already used on another device. / Mã này đã dùng trên máy khác. Em nhờ thầy/cô hỗ trợ nhé."; return; }
      set("ev_invite", h); window.EV_LOCKED = false; o.remove();
    };
    inp.addEventListener("keydown", e => { if (e.key === "Enter") go.onclick(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show); else show();
})();
