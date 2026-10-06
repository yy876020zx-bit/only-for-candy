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
  let translationTimer = null;

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
      output.textContent = WISH_REPLY;
      output.classList.remove('translation-arrive');
      void output.offsetWidth;
      output.classList.add('translation-arrive');
      status.textContent = '소원을 받았어요';
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
