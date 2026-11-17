/* EnglishVerse – MÃ MỜI (giai đoạn thử nghiệm kín, chủ dự án chốt 17/11, phương án B).
   - Mỗi người được 1 mã riêng. Lần đầu nhập, mã được GẮN vào máy đó bằng "dấu vân tay máy" (băm từ loại máy, trình duyệt
     không kèm số phiên bản, kích thước màn hình, múi giờ, ngôn ngữ, số nhân CPU – không phải thông tin cá nhân). Trình duyệt có xoá
     dữ liệu khi tắt thì mở lại vẫn nhận ra đúng máy. KHÔNG dùng địa chỉ IP: IP đổi khi chuyển wifi ↔ 4G, và cả nhà / cả trường dùng chung 1 IP.
     Máy khác nhập lại mã đó sẽ bị từ chối → bé có gửi link + mã cho bạn thì bạn cũng không vào được.
   - Kiểm tra trên Supabase bằng hàm claim_invite (cài bằng docs/setup/invites.sql). Khi hàm CHƯA được cài, game chỉ kiểm tra mã
     trên máy (vẫn chặn người không có mã, nhưng chưa chặn được việc 1 mã dùng trên 2 máy).
   - Trong code chỉ có mã BĂM (SHA-256), không có mã gốc. Thêm người: thêm mã băm vào INVITE_HASHES + 1 dòng insert trong SQL.
   - Mở khoá 1 mã (bé đổi máy / xoá dữ liệu trình duyệt): chạy câu "update invites set device = null where note = '...';" trong Supabase.
   - Tắt hẳn cổng mã mời (khi mở công khai): INVITE_ON = false. Kiểm thử tự động (QA): localStorage.ev_qa = "1". */
const INVITE_ON = true;
const INVITE_HASHES = { "21bb0956ba5adbe5b9a5ff017c28ff06fb347e9bde80d7864c5e77a4879fdde5": "Hoc sinh 1", "80b62c4eb31d03fdd2ed55c155e6f679a9b0300b13d45664afeae97aa466162d": "Hoc sinh 2", "9397753d8749ce49fde7e83137fa8bbd22a4153bf7d4029e76b888b00118f7f9": "Chu du an", "e6d63c8c41ec94e1b46e0b6b589af285cfa42ccbe0061a2aeaf0390e329e1ed0": "Hoc sinh 3", "dd289c91f6ccd068bb89b1e6a16c359bb074b13a6c40d3000cee1e96ce5c2135": "Hoc sinh 4", "11693daa41f9685ab4bce38fe259baa9da89b8790ac19f1f75c2778e1bbec026": "Hoc sinh 5", "c2e5320d71396ef36e94bee141c235cfd700d198a489f2d19e0308743c1137e0": "Hoc sinh 6", "14f585aa69dd38f1d1d5816056cc242180a74d5829dc3f81deb3635a28f2546f": "Hoc sinh 7", "ed81bea1651de38cdc9948e1a1eba2b37cf0704be9090e306fe4c8c1873dca97": "Hoc sinh 8", "f8f2031c096289540fb96c2f7c5a4194f304f433692039574497746bf8def110": "Hoc sinh 9", "b4bae713ac01354a2799b24c22c890e4d2e5a32517b1d381c26b81c74a1748da": "Hoc sinh 10" };
window.EV_LOCKED = false;
(function () {
  if (!INVITE_ON) return;
  let ls = {}; try { ls = window.localStorage; } catch (e) {}
  const get = k => { try { return ls.getItem(k); } catch (e) { return null; } }, set = (k, v) => { try { ls.setItem(k, v); } catch (e) {} };
  if (get("ev_qa") === "1") return;
  if (INVITE_HASHES[get("ev_invite")]) return;   // máy này đã được cấp mã
  window.EV_LOCKED = true;
  const OWNER = "Chu du an";   // mã của chủ dự án: không khoá máy (thử trên nhiều máy)
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}   // xin trình duyệt đừng tự xoá dữ liệu game
  const fingerprint = () => [
    (navigator.userAgent || "").replace(/[\d._]+/g, ""),   // bỏ số phiên bản → cập nhật trình duyệt không đổi dấu vân tay
    navigator.platform || "", screen.width * screen.height, Math.round((devicePixelRatio || 1) * 10), Math.min(screen.width, screen.height),
    (Intl.DateTimeFormat().resolvedOptions().timeZone || ""), navigator.language || "", navigator.hardwareConcurrency || 0, navigator.deviceMemory || 0, navigator.maxTouchPoints || 0
  ].join("|");
  let dev = null;
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
      const h = await sha(code); if (!dev) dev = "fp-" + (await sha(fingerprint())).slice(0, 32);
      if (!INVITE_HASHES[h]) { go.disabled = false; msg.style.color = "var(--ev-bad)"; msg.innerHTML = "This code is not right. / Mã chưa đúng, em kiểm tra lại nhé."; return; }
      const r = INVITE_HASHES[h] === OWNER ? "ok" : await claim(h);
      if (r === "taken" || r === "unknown") { go.disabled = false; msg.style.color = "var(--ev-bad)"; msg.innerHTML = "This code is already used on another device. / Mã này đã dùng trên máy khác. Em nhờ thầy/cô hỗ trợ nhé."; return; }
      set("ev_invite", h); window.EV_LOCKED = false; o.remove();
    };
    inp.addEventListener("keydown", e => { if (e.key === "Enter") go.onclick(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show); else show();
})();
