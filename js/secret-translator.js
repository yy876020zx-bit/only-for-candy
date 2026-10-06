/* The special scene recognizes wishes and answers in Korean. */
(() => {
  const overlay = document.createElement('div');
  overlay.className = 'secret-translator-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `<div class="secret-translator-shell" role="dialog" aria-modal="true" aria-label="PAPAGO 愿望翻译器">
    <button class="secret-translator-close" type="button" aria-label="关闭">×</button>
    <div class="secret-translate-step">
      <header class="translator-top"><h2>PAPAGO</h2><p>中文翻译韩文</p></header>
      <div class="translator-toolbar"><div class="translator-language">简体中文</div><span class="translator-direction" aria-hidden="true">→</span><div class="translator-language">韩语</div></div>
      <div class="translator-panels"><div class="translator-panel translator-input-panel"><textarea class="translator-input" maxlength="2000" placeholder="这里只可以翻译你的愿望" aria-label="输入愿望"></textarea><div class="translator-panel-footer"><span class="translator-count">0 / 2000</span><button class="translator-clear" type="button">清空</button></div></div><div class="translator-panel translator-output-panel"><div class="translator-output" lang="ko" aria-live="polite"></div><div class="translator-panel-footer"><span class="translator-status" role="status">입력을 기다리는 중</span><button class="translator-copy" type="button" disabled>复制</button></div></div></div>
    </div>
  </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('.translator-input');
  const output = overlay.querySelector('.translator-output');
  const status = overlay.querySelector('.translator-status');
  const count = overlay.querySelector('.translator-count');
  const copyButton = overlay.querySelector('.translator-copy');
  const WISH_REPLY = '반드시 이루어질 거야';
  const UNKNOWN_REPLY = '잘 모르겠어';
  let translationTimer = null;

  function isWish(text) {
    if (!/[\u3400-\u9fff]/u.test(text)) return false;
    const normalized = text.replace(/\s+/g, '');
    if (/(希望|祝愿|祝你|祝我|祝大家|愿望|许愿|心愿|祈愿|祈祷|保佑|盼望|但愿|梦想|愿你|愿我|愿大家)/u.test(normalized)) return true;
    if (/[?？]|怎么|为什么|什么|是谁|在哪|哪里|多少|如何|吗$|呢$/u.test(normalized)) return false;
    if (/(想知道|想问|想了解)/u.test(normalized)) return false;
    if (/(想要|想让|我想)/u.test(normalized)) return true;
    return /(生日快乐|天天开心|每天开心|永远开心|一直开心|平安健康|幸福快乐|一切顺利|梦想成真|心想事成|万事如意|早日康复|考上|成功|好运|发财)/u.test(normalized);
  }

  function resetResult() {
    output.textContent = '';
    status.textContent = '입력을 기다리는 중';
    copyButton.disabled = true;
  }

  function updateTranslation() {
    clearTimeout(translationTimer);
    count.textContent = `${input.value.length} / 2000`;
    const text = input.value.trim();
    if (!text) { resetResult(); return; }
    output.textContent = '';
    status.textContent = '소원을 확인하고 있어요…';
    copyButton.disabled = true;
    translationTimer = setTimeout(() => {
      const wish = isWish(text);
      output.textContent = wish ? WISH_REPLY : UNKNOWN_REPLY;
      output.classList.remove('translation-arrive');
      void output.offsetWidth;
      output.classList.add('translation-arrive');
      status.textContent = wish ? '소원을 받았어요' : '소원을 찾지 못했어요';
      copyButton.disabled = false;
      translationTimer = null;
    }, 280);
  }

  function open() {
    overlay.hidden = false;
    document.body.classList.add('modal-open');
    input.value = '';
    updateTranslation();
    input.focus();
  }
  function close() {
    clearTimeout(translationTimer);
    overlay.hidden = true;
    document.body.classList.remove('modal-open');
  }
  window.openSecretTranslator = open;
  overlay.querySelector('.secret-translator-close').addEventListener('click', close);
  overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !overlay.hidden) close(); });
  input.addEventListener('input', updateTranslation);
  overlay.querySelector('.translator-clear').addEventListener('click', () => { input.value = ''; updateTranslation(); input.focus(); });
  copyButton.addEventListener('click', async () => {
    if (copyButton.disabled) return;
    const result = output.textContent;
    try {
      await navigator.clipboard.writeText(result);
    } catch (_) {
      const field = document.createElement('textarea');
      field.value = result;
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      field.remove();
    }
    copyButton.textContent = '已复制';
    setTimeout(() => { copyButton.textContent = '复制'; }, 1500);
  });
})();
