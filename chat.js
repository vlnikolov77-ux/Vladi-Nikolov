/* Vladiator Digital — AI асистент (чат прозорче). Отговорите идват от Cloudflare Worker → Gemini API. */
(function () {
  var WORKER_URL = 'https://vladiator-assistant.vladiatorai.workers.dev/'; // адресът на Cloudflare Worker, напр. https://vladiator-assistant.xxx.workers.dev
  if (!WORKER_URL) return;

  var en = function () { return document.documentElement.lang === 'en'; };
  var T = {
    bg: {
      open: 'Чат с Мая — AI асистент', title: 'Мая · AI асистент', sub: 'Vladiator Digital · отговаря веднага', label: 'Попитай Мая', tag: 'AI чатбот · 24/7',
      hi: 'Здрасти! Аз съм Мая, AI асистентката на Влади. Питай ме каквото искаш за услугите и обученията — или просто ми кажи с какво се занимаваш.',
      chips: ['Социални мрежи', 'Рекламна кампания', 'AI обучения за фирми', 'Как да говоря с Влади?'],
      ph: 'Напиши съобщение…', send: 'Изпрати', wait: 'Пише…',
      err: 'Не успях да отговоря. Пиши директно на vlnikolov77@gmail.com или +359 896 868 198.',
      lead: 'Изпрати на Влади', wa: 'или по WhatsApp',
      note: 'AI асистент · <a href="privacy.html#chat">Поверителност</a>'
    },
    en: {
      open: 'Chat with Maya, the AI assistant', title: 'Maya · AI assistant', sub: 'Vladiator Digital · replies instantly', label: 'Ask Maya', tag: 'AI chatbot · 24/7',
      hi: 'Hi! I am Maya, Vladi\'s AI assistant. Ask me anything about the services and training, or just tell me what you do.',
      chips: ['Social media', 'Ad campaign', 'AI training for companies', 'How do I talk to Vladi?'],
      ph: 'Type a message…', send: 'Send', wait: 'Typing…',
      err: 'I could not reply. Write directly to vlnikolov77@gmail.com or +359 896 868 198.',
      lead: 'Send to Vladi', wa: 'or via WhatsApp',
      note: 'AI assistant · <a href="privacy.html#en">Privacy</a>'
    }
  };
  var t = function () { return en() ? T.en : T.bg; };

  var css = '\
.vc-btn{position:fixed;right:16px;bottom:16px;z-index:35;height:46px;padding:0 16px 0 5px;border-radius:999px;border:1px solid rgba(255,255,255,.14);cursor:pointer;background:#0D1A2B;color:#fff;box-shadow:0 12px 28px -10px rgba(13,26,43,.7);display:flex;align-items:center;gap:9px;font:700 14px Onest,system-ui,sans-serif;transition:transform .2s}\
.vc-btn:hover{transform:translateY(-2px)}\
.vc-av{position:relative;width:36px;height:36px;border-radius:50%;background:#FF3B4E;display:grid;place-items:center;flex:none}\
.vc-av svg{width:27px;height:27px}\
.vc-av i{position:absolute;right:-1px;bottom:-1px;width:10px;height:10px;border-radius:50%;background:#3DDC84;border:2px solid #0D1A2B}\
.vc-btn small{display:block;font-weight:500;font-size:11px;color:#9DB0C6;line-height:1.1}\
.vc-btn span.vc-t{line-height:1.15;text-align:left}\
.vc-panel{position:fixed;right:18px;bottom:74px;z-index:36;width:340px;max-width:calc(100vw - 24px);height:480px;max-height:calc(100vh - 100px);background:#fff;border-radius:22px;box-shadow:0 30px 70px -20px rgba(13,26,43,.55);display:flex;flex-direction:column;overflow:hidden;font-family:Onest,system-ui,sans-serif;color:#0D1A2B}\
.vc-panel[hidden]{display:none}\
.vc-head{background:#0D1A2B;color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px}\
.vc-head b{display:block;font-size:16px}.vc-head small{color:#9DB0C6;font-size:12.5px}\
.vc-head button{margin-left:auto;background:none;border:0;color:#C9D7E6;font-size:22px;cursor:pointer;line-height:1}\
.vc-dot{width:10px;height:10px;border-radius:50%;background:#3DDC84;flex:none}\
.vc-head .vc-av{width:34px;height:34px}.vc-head .vc-av svg{width:25px;height:25px}\
.vc-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#F3F6FA}\
.vc-m{max-width:85%;padding:10px 13px;border-radius:16px;font-size:14.5px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}\
.vc-m a{color:#E02236}\
.vc-bot{background:#fff;border:1px solid #DCE3EB;align-self:flex-start;border-bottom-left-radius:5px}\
.vc-me{background:#0D1A2B;color:#fff;align-self:flex-end;border-bottom-right-radius:5px}\
.vc-chips{display:flex;flex-wrap:wrap;gap:6px}\
.vc-chips button{font:500 13px/1 Onest,system-ui,sans-serif;background:#D9ECFF;color:#0D1A2B;border:0;border-radius:999px;padding:9px 12px;cursor:pointer}\
.vc-lead{align-self:flex-start;display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:13px;color:#566479}\
.vc-lead a.vc-go{background:#FF3B4E;color:#fff;text-decoration:none;font-weight:700;padding:10px 14px;border-radius:999px}\
.vc-lead a{color:#566479}\
.vc-form{display:flex;gap:8px;padding:10px;border-top:1px solid #DCE3EB;background:#fff}\
.vc-form textarea{flex:1;resize:none;min-height:0;border:1px solid #C3CDD8;border-radius:14px;padding:10px 12px;font:15px/1.35 Onest,system-ui,sans-serif;height:44px;max-height:110px}\
.vc-form button{border:0;border-radius:14px;height:44px;align-self:flex-end;background:#FF3B4E;color:#fff;font:700 14px Onest,system-ui,sans-serif;padding:0 14px;cursor:pointer}\
.vc-form button:disabled{opacity:.5;cursor:default}\
.vc-note{font-size:11.5px;color:#566479;padding:0 12px 10px;background:#fff}.vc-note a{color:#566479}\
@media (max-width:600px){.vc-btn{padding:0 5px;height:48px;right:12px;bottom:12px}.vc-btn .vc-t{display:none}.vc-av{width:38px;height:38px}.vc-panel{right:6px;left:6px;width:auto;max-width:none;bottom:70px;height:calc(100vh - 86px)}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var btn = document.createElement('button');
  btn.className = 'vc-btn'; btn.type = 'button';
  btn.innerHTML = '<span class="vc-av"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 3.6c-3.7 0-6.2 2.8-6.2 6.6v6c0 1 .6 1.7 1.5 2h9.4c.9-.3 1.5-1 1.5-2v-6c0-3.8-2.5-6.6-6.2-6.6z"/><ellipse cx="12" cy="11.2" rx="3.2" ry="3.7" fill="#FF3B4E"/><path d="M8.7 10.4c2.5-.1 4.6-1.2 5.6-3.1.5 1.4 1.3 2.4 2.1 2.9-.2-2.8-2-4.6-4.4-4.6-2.3 0-3.7 1.7-3.3 4.8z"/><path d="M5.2 21.6c.7-2.7 3.4-4.4 6.8-4.4s6.1 1.7 6.8 4.4z"/><path d="M19.7 2.6l.55 1.3 1.3.55-1.3.55-.55 1.3-.55-1.3-1.3-.55 1.3-.55z"/></svg><i></i></span><span class="vc-t"><span class="vc-l"></span><small class="vc-s"></small></span>';
  var panel = document.createElement('div');
  panel.className = 'vc-panel'; panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.innerHTML = '<div class="vc-head"><span class="vc-av"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 3.6c-3.7 0-6.2 2.8-6.2 6.6v6c0 1 .6 1.7 1.5 2h9.4c.9-.3 1.5-1 1.5-2v-6c0-3.8-2.5-6.6-6.2-6.6z"/><ellipse cx="12" cy="11.2" rx="3.2" ry="3.7" fill="#FF3B4E"/><path d="M8.7 10.4c2.5-.1 4.6-1.2 5.6-3.1.5 1.4 1.3 2.4 2.1 2.9-.2-2.8-2-4.6-4.4-4.6-2.3 0-3.7 1.7-3.3 4.8z"/><path d="M5.2 21.6c.7-2.7 3.4-4.4 6.8-4.4s6.1 1.7 6.8 4.4z"/><path d="M19.7 2.6l.55 1.3 1.3.55-1.3.55-.55 1.3-.55-1.3-1.3-.55 1.3-.55z"/></svg></span><div><b></b><small></small></div><button type="button" aria-label="Затвори">×</button></div>' +
    '<div class="vc-log" aria-live="polite"></div>' +
    '<form class="vc-form"><textarea rows="1" maxlength="1000"></textarea><button type="submit"></button></form>' +
    '<div class="vc-note"></div>';
  document.body.appendChild(btn); document.body.appendChild(panel);

  var log = panel.querySelector('.vc-log'), form = panel.querySelector('form'),
      input = form.querySelector('textarea'), sendBtn = form.querySelector('button');
  var history = [], started = false, busy = false;
  // Казва на модела на какъв език е последният въпрос (безплатният модел иначе отговаря на български)
  function withLang(h) {
    var out = h.slice(), last = out[out.length - 1];
    if (last && last.role === 'user' && !/[\u0400-\u04FF]/.test(last.text) && /[A-Za-z]/.test(last.text))
      out[out.length - 1] = { role: 'user', text: last.text + '\n\n[Reply in English only. Your name is Maya.]' };
    return out;
  }

  function labels() {
    btn.setAttribute('aria-label', t().open); btn.title = t().open;
    panel.setAttribute('aria-label', t().title);
    panel.querySelector('.vc-head b').textContent = t().title;
    btn.querySelector('.vc-l').textContent = t().label;
    btn.querySelector('.vc-s').textContent = t().tag;
    panel.querySelector('.vc-head small').textContent = t().sub;
    input.placeholder = t().ph; sendBtn.textContent = t().send;
    panel.querySelector('.vc-note').innerHTML = t().note;
  }

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function linkify(s) {
    return esc(s).replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }
  function add(text, who) {
    var d = document.createElement('div');
    d.className = 'vc-m ' + (who === 'me' ? 'vc-me' : 'vc-bot');
    if (who === 'me') d.textContent = text; else d.innerHTML = linkify(text);
    log.appendChild(d); log.scrollTop = log.scrollHeight; return d;
  }
  function addLead(lead) {
    var lines = [
      'Име: ' + (lead.name || ''), 'Фирма: ' + (lead.company || ''), 'Контакт: ' + (lead.contact || ''),
      'Удобно време: ' + (lead.time || ''), 'Нужда: ' + (lead.need || ''), '', '(изпратено от AI асистента на сайта)'
    ].join('\n');
    var mail = 'mailto:vlnikolov77@gmail.com?subject=' + encodeURIComponent('Запитване от AI асистента: ' + (lead.name || '')) +
      '&body=' + encodeURIComponent(lines);
    var wa = 'https://wa.me/359896868198?text=' + encodeURIComponent(lines);
    var d = document.createElement('div'); d.className = 'vc-lead';
    d.innerHTML = '<a class="vc-go" href="' + mail + '">' + esc(t().lead) + '</a><a href="' + wa + '" target="_blank" rel="noopener">' + esc(t().wa) + '</a>';
    log.appendChild(d); log.scrollTop = log.scrollHeight;
  }
  function chips() {
    var c = document.createElement('div'); c.className = 'vc-chips';
    t().chips.forEach(function (label) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = label;
      b.addEventListener('click', function () { c.remove(); ask(label); });
      c.appendChild(b);
    });
    log.appendChild(c);
  }

  function ask(text) {
    if (busy || !text.trim()) return;
    busy = true; sendBtn.disabled = true;
    add(text, 'me'); history.push({ role: 'user', text: text });
    var typing = add(t().wait, 'bot'); typing.style.opacity = '.6';
    fetch(WORKER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: withLang(history) }) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw j; return j; }); })
      .then(function (j) {
        typing.remove();
        var reply = j.text || '', lead = null;
        var m = reply.match(/\[\[LEAD\]\]\s*(\{[\s\S]*\})\s*$/);
        if (m) { try { lead = JSON.parse(m[1]); } catch (e) {} reply = reply.slice(0, m.index).trim(); }
        add(reply, 'bot'); history.push({ role: 'model', text: j.text || reply });
        if (lead) addLead(lead);
      })
      .catch(function () { typing.remove(); add(t().err, 'bot'); history.pop(); })
      .then(function () { busy = false; sendBtn.disabled = false; input.focus(); });
  }

  btn.addEventListener('click', function () {
    labels();
    panel.hidden = !panel.hidden;
    if (!panel.hidden && !started) { started = true; add(t().hi, 'bot'); history.push({ role: 'model', text: t().hi }); chips(); }
    if (!panel.hidden) input.focus();
  });
  panel.querySelector('.vc-head button').addEventListener('click', function () { panel.hidden = true; });
  form.addEventListener('submit', function (e) { e.preventDefault(); var v = input.value; input.value = ''; ask(v); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
  labels();
})();
