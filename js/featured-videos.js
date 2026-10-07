(() => {
  const collections = {
    rec_music: {
      title: 'Cortis',
      eyebrow: 'CORTIS · mv',
      videos: [
        ['MONEY MONEY MONEY', 'assets/videos/cortis-money.mp4'],
        ['RED RED', 'assets/videos/cortis-red.mp4'],
        ['Go！', 'assets/videos/cortis-third.mp4']
      ]
    },
    rec_drama: {
      title: '爱情怎么翻译',
      eyebrow: '官方预告片',
      videos: [['官方预告片', 'assets/videos/love-translated-trailer.mp4?v=20261007-faststart']]
    }
  };

  const modal = document.createElement('div');
  modal.className = 'featured-video-modal';
  modal.hidden = true;
  modal.innerHTML = '<div class="featured-video-panel" role="dialog" aria-modal="true" aria-labelledby="featured-video-title"><button class="featured-video-close" type="button" aria-label="关闭播放器">✕</button><div class="featured-video-layout"><div class="featured-video-content"><p class="featured-video-eyebrow"></p><h2 id="featured-video-title"></h2><p class="featured-video-description"></p><div class="featured-video-list"></div></div><div class="featured-video-stage"><video controls playsinline preload="none"></video></div></div></div>';
  document.body.appendChild(modal);
  const player = modal.querySelector('video');
  const list = modal.querySelector('.featured-video-list');

  function selectVideo(entry, button) {
    player.pause();
    player.src = entry[1];
    player.load();
    list.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
    player.play().catch(() => {});
  }

  function openCollection(id, card) {
    const collection = collections[id];
    if (!collection) return;
    modal.querySelector('h2').textContent = collection.title;
    modal.querySelector('.featured-video-eyebrow').textContent = collection.eyebrow;
    modal.querySelector('.featured-video-description').textContent = id === 'rec_music' ? '金主训（Kim Juhoon，김주훈），艺名JUHOON，2008年1月3日出生于韩国首尔特别市，毕业于英勋国际中学，韩国男歌手、舞者，男子唱跳组合CORTIS成员。' : card.querySelector('.card-desc')?.textContent || '';
    modal.querySelector('.featured-video-panel').classList.toggle('is-coer', id === 'rec_music');
    modal.querySelector('.featured-video-panel').classList.toggle('is-drama', id === 'rec_drama');
    modal.classList.toggle('is-drama-modal', id === 'rec_drama');
    modal.hidden = false;
    document.body.classList.add('modal-open');
    list.replaceChildren();
    collection.videos.forEach((entry, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      const number = document.createElement('span');
      number.className = 'featured-video-number';
      number.textContent = String(index + 1).padStart(2, '0');
      const name = document.createElement('span');
      name.className = 'featured-video-name';
      name.textContent = entry[0];
      button.append(number, name);
      button.addEventListener('click', () => selectVideo(entry, button));
      list.appendChild(button);
      if (index === 0) selectVideo(entry, button);
    });
    modal.querySelector('.featured-video-close').focus();
  }

  function closeCollection() {
    player.pause();
    player.removeAttribute('src');
    player.load();
    modal.hidden = true;
    document.body.classList.remove('modal-open');
  }

  modal.querySelector('.featured-video-close').addEventListener('click', closeCollection);
  modal.addEventListener('click', event => { if (event.target === modal) closeCollection(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modal.hidden) closeCollection();
  });

  document.addEventListener('click', event => {
    const card = event.target.closest('#row-recommendations .stream-card');
    if (!card) return;
    const title = card.querySelector('.card-title')?.textContent || '';
    const id = card.dataset.featuredId || (title.includes('Cortis') ? 'rec_music' : title.includes('爱情') ? 'rec_drama' : null);
    if (!collections[id]) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openCollection(id, card);
  }, true);

  // The multi-file homepage uses the same episode markup as the standalone page.
  // Supply its missing first-episode controls without changing either video's routing.
  window.openEpisode01 = window.openEpisode01 || function () {
    window.playEpisode01Video?.();
  };
  document.getElementById('btn-hero-play')?.addEventListener('click', window.openEpisode01);
})();
