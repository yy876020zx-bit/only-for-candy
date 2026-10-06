/* Episode video and editable sample conversations. */
(() => {
  const introScreen = document.getElementById('screen-intro');
  const introTitle = document.getElementById('trans-main-title');
  function startIntroTranslation(onComplete) {
    if (!introScreen || !introTitle) { onComplete(); return; }
    const fromText = '카피플릭스';
    const toText = 'CAFYFLIX';
    const glyphs = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ가나다라마바사';
    const spans = text => [...text].map(char => `<span class="char">${char}</span>`).join('');
    introTitle.innerHTML = spans(fromText);
    introScreen.querySelector('.intro-translation')?.classList.add('visible');
    setTimeout(() => {
      const start = performance.now();
      function frame(now) {
        const progress = Math.min((now - start) / 1600, 1);
        introTitle.innerHTML = [...toText].map((char, index) => {
          const settled = progress > (index + 1) / toText.length;
          const shown = settled ? char : glyphs[Math.floor(Math.random() * glyphs.length)];
          return `<span class="char ${settled ? 'resolved' : 'scrambling'}">${shown}</span>`;
        }).join('');
        if (progress < 1) requestAnimationFrame(frame);
        else {
          introTitle.innerHTML = [...toText].map(char => `<span class="char resolved">${char}</span>`).join('');
          setTimeout(onComplete, 1100);
        }
      }
      requestAnimationFrame(frame);
    }, 800);
  }
  window.startIntroTranslation = startIntroTranslation;

  const videoModal = document.getElementById('modal-episode');
  const entryVideo = document.getElementById('episode-entry-video');
  const video = document.getElementById('ep-player-video');
  const closeVideoButton = document.getElementById('btn-close-episode');

  function closeVideo() {
    if (!videoModal || !video) return;
    entryVideo?.pause();
    if (entryVideo) entryVideo.currentTime = 0;
    video.pause();
    video.currentTime = 0;
    videoModal.classList.remove('active');
    videoModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }

  function playVideo() {
    if (!videoModal || !video || !entryVideo) return;
    videoModal.classList.remove('hidden');
    videoModal.classList.add('active');
    document.body.classList.add('modal-open');
    video.pause();
    video.currentTime = 0;
    video.hidden = true;
    entryVideo.hidden = false;
    entryVideo.currentTime = 0;
    entryVideo.controls = false;
    entryVideo.defaultMuted = false;
    entryVideo.muted = false;
    entryVideo.volume = 1;
    entryVideo.play().catch(() => {
      // A later tap can satisfy browsers that block playback after navigation.
      entryVideo.addEventListener('pointerdown', () => entryVideo.play().catch(() => {}), { once: true });
    });
  }
  function showEpisodeMain() {
    if (!videoModal?.classList.contains('active')) return;
    entryVideo.hidden = true;
    video.hidden = false;
    video.controls = true;
    video.defaultMuted = false;
    video.muted = false;
    video.volume = 1;
    video.currentTime = 0;
    video.play().catch(() => {});
  }
  entryVideo?.addEventListener('ended', showEpisodeMain);
  entryVideo?.addEventListener('error', showEpisodeMain);
  window.playEpisode01Video = playVideo;
  window.closeEpisode01Video = closeVideo;
  closeVideoButton?.addEventListener('click', closeVideo);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && videoModal?.classList.contains('active')) closeVideo();
  });

  // Edit these four sample threads when the final conversation text is ready.
  const CONTACTS = [
    {
      id: 'dear-sister', name: '亲爱的干妹', initials: '亲', color: '#d886a8', avatar: 'assets/photos/avatar-dear-sister-1.jpg',
      messages: [
        { from: 'them', text: '第一次听说笔记本电脑是用来看的' },
        { from: 'me', text: '哦嗯调' },
        { from: 'them', text: '👍👍👍' }
      ],
      replies: ['不是我']
    },
    {
      id: 'not-dear-sister', name: '亲爱的干妹', initials: '亲', color: '#8c86d4', avatar: 'assets/photos/avatar-dear-sister-2.jpg',
      messages: [
        { from: 'them', text: '💋可以减肥' },
        { from: 'me', text: '？' },
        { from: 'them', text: '舌吻减的更快' }
      ],
      replies: ['笨蛋我回不了你，找yzx去。']
    },
    {
      id: 'yzx', name: 'Yzx东华易烊千玺', initials: 'Y', color: '#6f9bd1', avatar: 'assets/photos/avatar-yzx.jpg',
      messages: [
        { from: 'them', text: '安怡宝宝～' },
        { from: 'me', text: '👍👍👍' }
      ],
      replies: ['嘻嘻，你可以给我发抖音，微信，短信，在这里我也回不了。']
    },
    {
      id: 'eight-nine', name: '5+3=（9）', initials: 'Y', color: '#73af9c',
      messages: [
        { from: 'them', text: '生日快乐！' }
      ],
      replies: ['嘻嘻嘻嘻嘻嘻，其实都回不了']
    }
  ];

  const ICONS = {
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-5 4V6a2 2 0 0 1 1-2zm3 5v2h10V9H7zm0 4v2h7v-2H7z"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.78L20 21l1-1-5.5-6zm-5 0A4.5 4.5 0 1 1 10.5 5a4.5 4.5 0 0 1 0 9z"/></svg>',
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.33-2.33a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.82-1.84z"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4l5.6 5.6 1.4-1.4-5.6-5.6L19 6.4z"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 11-12.2 0 5.6-5.6L12 4 4 12l8 8 1.4-1.4L7.8 13H20v-2z"/></svg>',
    emoji: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM8.5 11A1.5 1.5 0 1 0 8.5 8a1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 17.5c2.3 0 4.2-1.5 4.8-3.5H7.2c.6 2 2.5 3.5 4.8 3.5z"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 21 23 12 2 3l.01 7L17 12 2.01 14 2 21z"/></svg>'
  };

  const chatModal = document.createElement('div');
  chatModal.id = 'episode-chat-modal';
  chatModal.className = 'episode-chat-modal hidden';
  chatModal.setAttribute('role', 'dialog');
  chatModal.setAttribute('aria-modal', 'true');
  chatModal.setAttribute('aria-label', '第二集聊天记录');
  chatModal.innerHTML = `
    <div class="gm-shell">
      <aside class="gm-sidebar" aria-label="聊天列表">
        <header class="gm-appbar">
          <span class="gm-logo">${ICONS.chat}</span>
          <h2>消息</h2>
          <button class="gm-icon-button gm-close" type="button" aria-label="关闭消息">${ICONS.close}</button>
        </header>
        <button class="gm-start-chat" type="button">${ICONS.edit}<span>发起聊天</span></button>
        <label class="gm-search">${ICONS.search}<input type="search" placeholder="搜索聊天" aria-label="搜索聊天" autocomplete="off"></label>
        <div class="gm-filters" role="group" aria-label="筛选聊天">
          <button class="gm-filter active" type="button" data-filter="all">全部</button>
          <button class="gm-filter" type="button" data-filter="unread">未读</button>
        </div>
        <div class="gm-contact-list" role="list"></div>
      </aside>
      <main class="gm-main">
        <div class="gm-empty"><span class="gm-empty-mark">${ICONS.chat}</span><h3>选择一段对话</h3><p>点击左侧的联系人，查看消息</p></div>
        <section class="gm-conversation" aria-label="对话" hidden>
          <header class="gm-thread-head">
            <button class="gm-icon-button gm-back" type="button" aria-label="返回聊天列表">${ICONS.back}</button>
            <span class="gm-avatar gm-thread-avatar"></span>
            <span class="gm-thread-info"><span class="gm-thread-name"></span></span>
            <button class="gm-icon-button gm-close" type="button" aria-label="关闭消息">${ICONS.close}</button>
          </header>
          <div class="gm-messages" role="log" aria-live="polite"></div>
          <div class="gm-emoji-picker" hidden></div>
          <form class="gm-compose">
            <button class="gm-icon-button gm-emoji-toggle" type="button" aria-label="插入表情">${ICONS.emoji}</button>
            <textarea rows="1" maxlength="500" placeholder="发送消息" aria-label="输入消息"></textarea>
            <button class="gm-send" type="submit" aria-label="发送消息" disabled>${ICONS.send}</button>
          </form>
        </section>
      </main>
    </div>`;
  document.body.appendChild(chatModal);

  const list = chatModal.querySelector('.gm-contact-list');
  const messages = chatModal.querySelector('.gm-messages');
  const search = chatModal.querySelector('.gm-search input');
  const conversation = chatModal.querySelector('.gm-conversation');
  const empty = chatModal.querySelector('.gm-empty');
  const compose = chatModal.querySelector('.gm-compose');
  const input = compose.querySelector('textarea');
  const send = compose.querySelector('.gm-send');
  const emojiPicker = chatModal.querySelector('.gm-emoji-picker');
  const state = Object.fromEntries(CONTACTS.map(contact => [contact.id, contact.messages.map(message => ({ ...message }))]));
  const drafts = Object.create(null);
  const repliedContacts = new Set();
  const pendingReplies = new Set();
  const unread = new Set(['dear-sister', 'yzx']);
  const replyTimers = new Set();
  let activeId = null;
  let filter = 'all';
  let typingFor = null;

  const contactFor = id => CONTACTS.find(contact => contact.id === id);
  const currentTime = () => new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(new Date());
  function fillAvatar(avatar, contact) {
    avatar.style.background = contact.color;
    avatar.replaceChildren();
    if (contact.avatar) {
      const image = document.createElement('img');
      image.src = contact.avatar;
      image.alt = '';
      avatar.appendChild(image);
    } else {
      avatar.textContent = contact.initials;
    }
  }
  function makeAvatar(contact) {
    const avatar = document.createElement('span');
    avatar.className = 'gm-avatar';
    fillAvatar(avatar, contact);
    return avatar;
  }
  function renderContacts() {
    list.replaceChildren();
    const query = search.value.trim().toLowerCase();
    const shown = CONTACTS.filter(contact => {
      const matches = contact.name.toLowerCase().includes(query) || state[contact.id].some(message => message.text.toLowerCase().includes(query));
      return matches && (filter !== 'unread' || unread.has(contact.id));
    });
    if (!shown.length) {
      const none = document.createElement('p');
      none.className = 'gm-no-results';
      none.textContent = '没有找到聊天';
      list.appendChild(none);
      return;
    }
    shown.forEach(contact => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gm-contact' + (activeId === contact.id ? ' active' : '') + (unread.has(contact.id) ? ' unread' : '');
      button.appendChild(makeAvatar(contact));
      const copy = document.createElement('span');
      copy.className = 'gm-contact-copy';
      const name = document.createElement('span');
      name.className = 'gm-contact-name';
      name.textContent = contact.name;
      const preview = document.createElement('span');
      preview.className = 'gm-contact-preview';
      const last = state[contact.id].at(-1);
      preview.textContent = (last?.from === 'me' ? '你：' : '') + (last?.text || '');
      copy.append(name, preview);
      button.appendChild(copy);
      const side = document.createElement('span');
      side.className = 'gm-contact-side';
      const time = document.createElement('span');
      time.textContent = last?.time || '刚刚';
      side.appendChild(time);
      if (unread.has(contact.id)) {
        const dot = document.createElement('span');
        dot.className = 'gm-unread-dot';
        side.appendChild(dot);
      }
      button.appendChild(side);
      button.addEventListener('click', () => openThread(contact.id));
      list.appendChild(button);
    });
  }
  function renderMessages() {
    messages.replaceChildren();
    if (!activeId) return;
    const day = document.createElement('span');
    day.className = 'gm-day';
    day.textContent = '今天';
    messages.appendChild(day);
    state[activeId].forEach((message, index) => {
      const row = document.createElement('div');
      row.className = 'gm-message ' + (message.from === 'me' ? 'mine' : 'theirs');
      const bubble = document.createElement('div');
      bubble.className = 'gm-bubble';
      bubble.textContent = message.text;
      const actions = document.createElement('span');
      actions.className = 'gm-message-actions';
      const react = document.createElement('button');
      react.type = 'button';
      react.className = 'gm-react-button';
      react.setAttribute('aria-label', '给消息添加表情');
      react.textContent = '☺';
      react.addEventListener('click', () => {
        actions.querySelector('.gm-reaction-picker')?.remove();
        const picker = document.createElement('span');
        picker.className = 'gm-reaction-picker';
        ['❤️','😂','👍','🎉'].forEach(emoji => {
          const choice = document.createElement('button');
          choice.type = 'button';
          choice.textContent = emoji;
          choice.setAttribute('aria-label', `回应 ${emoji}`);
          choice.addEventListener('click', () => {
            state[activeId][index].reaction = emoji;
            renderMessages();
          });
          picker.appendChild(choice);
        });
        actions.appendChild(picker);
      });
      actions.appendChild(react);
      row.append(bubble, actions);
      messages.appendChild(row);
      if (message.reaction) {
        const chip = document.createElement('span');
        chip.className = 'gm-reaction-chip';
        chip.textContent = message.reaction;
        messages.appendChild(chip);
      }
      const meta = document.createElement('span');
      meta.className = 'gm-message-meta' + (message.from === 'me' ? ' mine' : '');
      meta.textContent = (message.time || '刚刚') + (message.from === 'me' ? ' · 已送达' : '');
      messages.appendChild(meta);
    });
    if (typingFor === activeId) {
      const typing = document.createElement('span');
      typing.className = 'gm-typing';
      typing.textContent = '正在输入…';
      messages.appendChild(typing);
    }
    messages.scrollTop = messages.scrollHeight;
  }
  function updateSend() { send.disabled = !input.value.trim(); }
  function openThread(id) {
    const contact = contactFor(id);
    if (!contact) return;
    if (activeId) drafts[activeId] = input.value;
    activeId = id;
    unread.delete(id);
    chatModal.classList.add('thread-open');
    conversation.hidden = false;
    empty.hidden = true;
    chatModal.querySelector('.gm-thread-name').textContent = contact.name;
    const avatar = chatModal.querySelector('.gm-thread-avatar');
    fillAvatar(avatar, contact);
    input.value = drafts[id] || '';
    updateSend();
    emojiPicker.hidden = true;
    renderContacts();
    renderMessages();
    input.focus();
  }
  function closeChat() {
    chatModal.classList.add('hidden');
    chatModal.classList.remove('thread-open');
    document.body.classList.remove('modal-open');
    for (const timer of replyTimers) clearTimeout(timer);
    replyTimers.clear();
    pendingReplies.clear();
    typingFor = null;
  }
  function openChat() {
    chatModal.classList.remove('hidden');
    chatModal.classList.remove('thread-open');
    activeId = null;
    conversation.hidden = true;
    empty.hidden = false;
    search.value = '';
    filter = 'all';
    chatModal.querySelectorAll('.gm-filter').forEach(button => button.classList.toggle('active', button.dataset.filter === 'all'));
    renderContacts();
    document.body.classList.add('modal-open');
  }
  window.openEpisode02Chat = openChat;
  window.closeEpisode02Chat = closeChat;
  chatModal.querySelectorAll('.gm-close').forEach(button => button.addEventListener('click', closeChat));
  chatModal.querySelector('.gm-back').addEventListener('click', () => chatModal.classList.remove('thread-open'));
  chatModal.querySelector('.gm-start-chat').addEventListener('click', () => {
    filter = 'all';
    chatModal.querySelectorAll('.gm-filter').forEach(button => button.classList.toggle('active', button.dataset.filter === 'all'));
    search.value = '';
    search.placeholder = '输入联系人姓名';
    renderContacts();
    search.focus();
  });
  chatModal.querySelectorAll('.gm-filter').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    chatModal.querySelectorAll('.gm-filter').forEach(item => item.classList.toggle('active', item === button));
    renderContacts();
  }));
  search.addEventListener('input', renderContacts);
  input.addEventListener('input', () => {
    updateSend();
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 112) + 'px';
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      if (!send.disabled) compose.requestSubmit();
    }
  });
  const emojiList = ['😀','🥰','🎂','🎉','❤️','✨','👍','😂','😭','🌙'];
  emojiList.forEach(emoji => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = emoji;
    button.setAttribute('aria-label', `插入 ${emoji}`);
    button.addEventListener('click', () => {
      input.value += emoji;
      updateSend();
      input.focus();
    });
    emojiPicker.appendChild(button);
  });
  chatModal.querySelector('.gm-emoji-toggle').addEventListener('click', () => { emojiPicker.hidden = !emojiPicker.hidden; });
  compose.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!activeId || !text) return;
    const id = activeId;
    state[id].push({ from: 'me', text, time: currentTime() });
    input.value = '';
    input.style.height = 'auto';
    drafts[id] = '';
    updateSend();
    emojiPicker.hidden = true;
    const shouldReply = contactFor(id).replies.length > 0 && !repliedContacts.has(id) && !pendingReplies.has(id);
    if (shouldReply) {
      pendingReplies.add(id);
      typingFor = id;
    }
    renderMessages();
    renderContacts();
    if (!shouldReply) return;
    const timer = setTimeout(() => {
      replyTimers.delete(timer);
      const contact = contactFor(id);
      pendingReplies.delete(id);
      repliedContacts.add(id);
      const reply = contact.replies[0];
      state[id].push({ from: 'them', text: reply, time: currentTime() });
      if (typingFor === id) typingFor = null;
      if (activeId !== id) unread.add(id);
      if (activeId === id && !chatModal.classList.contains('hidden')) renderMessages();
      renderContacts();
    }, 1100);
    replyTimers.add(timer);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !chatModal.classList.contains('hidden')) closeChat();
  });
})();
