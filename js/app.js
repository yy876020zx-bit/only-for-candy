/**
 * =====================================================================
 * 《给安怡的一封生日信》- 主应用程序逻辑 (Main Application Controller)
 * =====================================================================
 * 管理页面状态、开场动画转场、流媒体卡片交互、播放器模态框、
 * 生日独白播放、下一集倒计时、隐藏彩蛋及片尾制作名单。
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.ANYI_CONFIG || {};

  // 1. 初始化核心引擎
  const aurora = new window.AuroraEngine('aurora-canvas');
  const audio = new window.CinemaAudioEngine();
  let cakeEngine = null;

  // 2. 状态记录
  let currentEpisodeIndex = 0;
  let isPlayingSlideshow = false;
  let slideshowTimer = null;
  let monologueTimer = null;
  let nextEpTimer = null;

  // 3. UI 元素引用
  const screenIntro = document.getElementById('screen-intro');
  const screenHome = document.getElementById('screen-home');
  const modalEpisode = document.getElementById('modal-episode');
  const modalMemory = document.getElementById('modal-memory');
  const modalMonologue = document.getElementById('modal-monologue');
  const modalCake = document.getElementById('modal-cake');
  const modalNextEp = document.getElementById('modal-next-ep');
  const modalEasterEgg = document.getElementById('modal-easter-egg');
  const modalCredits = document.getElementById('modal-credits');
  const modalGallery = document.getElementById('modal-gallery');
  const toastEl = document.getElementById('global-toast');


  // ===================================================================
  // 韩剧《爱情怎么翻译》：韩文转中文实时字符解密翻译器
  // ===================================================================
  function scrambleTranslate(el, fromText, toText, duration, onComplete) {
    if (!el) return;
    const hangulChars = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ가나达라마바사아자차카타파하안이사랑통역되나요별빛하늘꿈영원기억순간마음눈부신";
    const startTime = performance.now();
    const targetLen = toText.length;

    function render(progress) {
      let outHtml = "";
      for (let i = 0; i < targetLen; i++) {
        const charProgress = Math.min(Math.max((progress - (i / targetLen) * 0.5) / 0.5, 0), 1);
        if (charProgress >= 1) {
          outHtml += `<span class="char resolved">${toText[i]}</span>`;
        } else if (charProgress > 0) {
          const randomChar = hangulChars[Math.floor(Math.random() * hangulChars.length)];
          outHtml += `<span class="char scrambling">${randomChar}</span>`;
        } else {
          const initialChar = fromText[i] || hangulChars[Math.floor(Math.random() * hangulChars.length)];
          outHtml += `<span class="char">${initialChar}</span>`;
        }
      }
      el.innerHTML = outHtml;
    }

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      render(progress);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.innerHTML = toText.split("").map(c => `<span class="char resolved">${c}</span>`).join("");
        if (onComplete) onComplete();
      }
    }

    requestAnimationFrame(step);
  }

  /* =============================================================
     0. 漫威电影式照片极速翻页片头引擎 (Marvel Opening Flip Engine)
     ============================================================= */
  /* =============================================================
     0. 纯净韩文转中文沉浸式翻译引擎 (너만의 파파고 ➔ 属于你的papago)
     ============================================================= */
  function scrambleTranslate(el, fromText, toText, duration, onComplete) {
    if (!el) return;
    const hangulChars = "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ가나다라마바사아자차카타파하안이사랑통역되나요별빛하늘꿈영원기억순간마음눈부신";
    const startTime = performance.now();
    const targetLen = toText.length;

    function render(progress) {
    let outHtml = "";
    for (let i = 0; i < targetLen; i++) {
      const charProgress = Math.min(Math.max((progress - (i / targetLen) * 0.5) / 0.5, 0), 1);
      if (charProgress >= 1) {
      outHtml += `<span class="char resolved">${toText[i]}</span>`;
      } else if (charProgress > 0) {
      const randomChar = hangulChars[Math.floor(Math.random() * hangulChars.length)];
      outHtml += `<span class="char scrambling">${randomChar}</span>`;
      } else {
      const initialChar = fromText[i] || "";
      outHtml += `<span class="char">${initialChar}</span>`;
      }
    }
    el.innerHTML = outHtml;
    }

    function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    render(progress);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.innerHTML = toText.split("").map(c => `<span class="char resolved">${c}</span>`).join("");
      if (onComplete) onComplete();
    }
    }

    requestAnimationFrame(step);
  }

  function runKoreanTranslationEffect(audio, onComplete) {
    const introTrans = document.getElementById("intro-translation");
    const mainEl = document.getElementById("trans-main-title");
    const scanline = document.getElementById("trans-scanline");

    if (!introTrans || !mainEl) {
    if (onComplete) onComplete();
    return;
    }

    const fromText = "너만의 파파고";
    const toText = "属于你的papago";

    // 阶段 1：韩文原语【너만의 파파고】静谧呈现
    mainEl.innerHTML = fromText.split("").map(c => `<span class="char">${c}</span>`).join("");
    introTrans.classList.remove("fade-out");
    introTrans.classList.add("visible");

    // 阶段 2：1.2秒后启动激光扫描与解密洗牌，字符自左向右蜕变为中文【属于你的papago】
    setTimeout(() => {
    if (scanline) {
      scanline.style.opacity = "1";
      scanline.style.transition = "left 1.8s cubic-bezier(0.2, 0.8, 0.2, 1)";
      scanline.style.left = "110%";
    }

    if (audio && typeof audio.playTranslateEffect === "function") {
      audio.playTranslateEffect();
    }

    // 主标题字符解密重组为：属于你的papago
    scrambleTranslate(mainEl, fromText, toText, 1600);

    // 阶段 3：翻译完成后定格 1.6 秒，随后轻柔淡出，紧接着无缝切入“黑屏红字片头”
    setTimeout(() => {
      introTrans.classList.add("fade-out");
      setTimeout(() => {
      introTrans.style.display = "none";
      if (onComplete) onComplete();
      }, 900);
    }, 3400);

    }, 1200);
  }

  let introSkipped = false;
  let bumperTimer = null;
  let posterTimer = null;

  function skipIntro() {
    if (introSkipped) return;
    introSkipped = true;
    const introTrans = document.getElementById("intro-translation");
    const btnSkip = document.getElementById("btn-skip-intro");
    if (btnSkip) btnSkip.style.display = "none";
    if (introTrans) {
      introTrans.classList.add("fade-out");
      introTrans.style.display = "none";
    }
    if (introBumper) {
      introBumper.classList.add("fade-out");
      introBumper.style.display = "none";
    }
    introPoster.classList.remove("hidden");
    introPoster.classList.add("fade-in");
  }

  const btnSkip = document.getElementById("btn-skip-intro");
  if (btnSkip) {
    btnSkip.addEventListener("click", (e) => {
      e.stopPropagation();
      skipIntro();
    });
  }

  // 开场时序（已调换顺序）：
  // 第 1 步：首先呈现【黑屏红字流媒体片头 (AN YI ORIGINAL + TUDUM 震撼重低音)】
  // 第 2 步：红字淡出后，【再呈现沉浸式翻译扫描蜕变 (너만의 파파고 ➔ 属于你的papago)】
  // 第 3 步：翻译完成后，显现第一集专属海报与“开始观看”
  setTimeout(() => {
    if (introSkipped) return;

    // 1. 触发黑屏红字与 TUDUM 重低音
    audio.playTudum();
    introBumper.classList.add("visible");

    bumperTimer = setTimeout(() => {
      if (introSkipped) return;
      introBumper.classList.add("fade-out");

      posterTimer = setTimeout(() => {
    if (introSkipped) return;
    introBumper.style.display = "none";

    // 2. 红字淡出后，无缝切入沉浸式翻译环节 (너만의 파파고 ➔ 属于你的papago)
    runKoreanTranslationEffect(audio, () => {
      if (introSkipped) return;
      const skip = document.getElementById("btn-skip-intro");
      if (skip) skip.style.display = "none";
      introPoster.classList.remove("hidden");
      introPoster.classList.add("fade-in");
    });
      }, 800);
    }, 2800);
  }, 500);

  // 点击“开始观看”
  if (btnStartWatching) {
    btnStartWatching.addEventListener('click', () => {
      enterHomeScreen();
    });
  }

  // 点击“我的片单” (添加收藏提示)
  if (btnIntroMyList) {
    btnIntroMyList.addEventListener('click', () => {
      showToast('✓ 《안이에게》 已加入安怡的私人珍藏片单');
      btnIntroMyList.textContent = '✓ 已加入片单';
      btnIntroMyList.style.borderColor = '#2ed573';
      btnIntroMyList.style.color = '#2ed573';
    });
  }

  function enterHomeScreen() {
    // 开启背景音乐

    // 电影黑场转场
    screenIntro.classList.add('fade-out-transition');
    setTimeout(() => {
      screenIntro.style.display = 'none';
      screenHome.classList.remove('hidden');
      screenHome.classList.add('fade-in-transition');
      window.scrollTo(0, 0);
    }, 800);
  }

  // ===================================================================
  // 首页流媒体数据渲染 (Render Home Streaming Data)
  // ===================================================================
  function renderHomeData() {
    // 1. Hero Banner
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroTag = document.getElementById('hero-tag');
    const heroTagline = document.getElementById('hero-tagline');
    const heroDesc = document.getElementById('hero-desc');

    if (heroTitle) heroTitle.textContent = config.series?.chineseTitle || "给安怡的一封生日信";
    if (heroSubtitle) heroSubtitle.textContent = config.series?.koreanTitle || "안이에게";
    if (heroTag) heroTag.textContent = config.series?.seasonTag || "1 Season · Special";
    if (heroTagline) heroTagline.textContent = config.series?.bannerTagline || "10.07限定";
    if (heroDesc) heroDesc.textContent = config.series?.heroSynopsis || "";

    // 2. 推荐栏目 (Row 1: 人生中的小确幸)
    const rowRec = document.getElementById('row-recommendations');
    if (rowRec && config.recommendations) {
      rowRec.innerHTML = '';
      config.recommendations.forEach(item => {
        const card = document.createElement('div');
        card.className = 'stream-card rec-card';
        card.innerHTML = `
          <div class="card-media">
            <img src="${item.poster}" alt="${item.title}" loading="lazy">
            <div class="card-overlay"></div>
            <div class="card-play-badge"><i class="icon-play">▶</i></div>
          </div>
          <div class="card-info">
            <div class="card-title-row">
              <span class="card-korean">${item.koreanTitle}</span>
              <h4 class="card-title">${item.title}</h4>
            </div>
            <div class="card-meta">
              <span class="meta-match">${item.matchRate}</span>
              <span class="meta-badge">HD</span>
              <span class="meta-duration">${item.duration}</span>
            </div>
            <p class="card-desc">${item.description}</p>
            <div class="card-tags">
              ${item.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
            </div>
          </div>
        `;

        card.addEventListener('click', () => {
          openRecDetailModal(item);
        });
        rowRec.appendChild(card);
      });
    }

    // 3. 继续观看 (Row 2: 岁月剧照 / Memories)
    const rowMem = document.getElementById('row-memories');
    if (rowMem && config.memories) {
      rowMem.innerHTML = '';
      config.memories.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'stream-card memory-card';
        card.innerHTML = `
          <div class="card-media widescreen">
            <img src="${item.photo}" alt="${item.title}" loading="lazy">
            <div class="card-progress-bar"><div class="progress-fill" style="width: ${70 + (index * 5)}%"></div></div>
            <div class="card-play-badge"><i class="icon-play">▶</i></div>
          </div>
          <div class="memory-info">
            <div class="ep-header">
              <span class="ep-badge">${item.episode}</span>
              <span class="ep-name">${item.title}</span>
            </div>
            <p class="ep-subtitle">${item.subtitle}</p>
          </div>
        `;

        card.addEventListener('click', () => {
          openMemoryModal(index);
        });
        rowMem.appendChild(card);
      });
    }

    // 4. 专属剧集速览 (Row 3: Episode List)
    const rowEpisodes = document.getElementById('row-episodes');
    if (rowEpisodes) {
      rowEpisodes.innerHTML = `
        <div class="episode-list-item" id="ep-item-1">
          <div class="ep-thumb">
            <img src="${config.episode01?.coverPhoto || 'assets/photos/ep01_hero.jpg'}" alt="Episode 1">
            <span class="ep-number">1</span>
            <div class="ep-thumb-play">▶</div>
          </div>
          <div class="ep-details">
            <div class="ep-head">
              <h4 class="ep-title">1. ${config.episode01?.chineseTitle || '十八'}</h4>
            </div>
            <p class="ep-synopsis">${config.episode01?.synopsis || ''}</p>
          </div>
        </div>

        <div class="episode-list-item" id="ep-item-2">
          <div class="ep-thumb">
            <img src="${config.memories?.[1]?.photo || 'assets/photos/memory_02.jpg'}" alt="Episode 2">
            <span class="ep-number">2</span>
            <div class="ep-thumb-play">▶</div>
          </div>
          <div class="ep-details">
            <div class="ep-head">
              <h4 class="ep-title">2. ${config.nextEpisode?.title || '十七'}</h4>
            </div>
            <p class="ep-synopsis">${config.nextEpisode?.synopsis || ''}</p>
          </div>
        </div>

      `;

      document.getElementById('ep-item-1')?.addEventListener('click', () => openEpisode01());
      document.getElementById('ep-item-2')?.addEventListener('click', () => openNextEpisodeModal());
    }

    // 5. 类似推荐 (Row 4: More Like This + 隐藏彩蛋)
    const rowMore = document.getElementById('row-more');
    if (rowMore) {
      rowMore.innerHTML = `
        <div class="stream-card more-card" id="card-more-1">
          <div class="card-media">
            <img src="assets/photos/rec_drama.jpg" alt="爱情怎么翻译">
            <div class="card-badge-top">热播推荐</div>
          </div>
          <div class="card-info-simple">
            <h4>《爱情怎么翻译》</h4>
            <span class="match-simple">安怡特别推荐</span>
          </div>
        </div>

        <div class="stream-card more-card" id="card-more-2">
          <div class="card-media">
            <img src="assets/photos/rec_aurora.jpg" alt="极光梦境">
            <div class="card-badge-top">心选氛围</div>
          </div>
          <div class="card-info-simple">
            <h4>《极光与冰岛之夜》</h4>
            <span class="match-simple">浪漫风光片</span>
          </div>
        </div>

        <div class="stream-card more-card easter-egg-trigger" id="card-easter-egg">
          <div class="card-media special-egg-media">
            <img src="${config.easterEgg?.poster || 'assets/photos/easter_egg.jpg'}" alt="Special Scene">
            <div class="easter-glow-ring"></div>
            <div class="secret-tag">SPECIAL SCENE</div>
          </div>
          <div class="card-info-simple">
            <h4 class="secret-title">《Special Scene》</h4>
            <span class="match-secret">未公开独家片段 🔒</span>
          </div>
        </div>
      `;

      document.getElementById('card-more-1')?.addEventListener('click', () => {
        showToast('《爱情怎么翻译》：有些语言不用翻译，用心就能听懂。');
      });
      document.getElementById('card-more-2')?.addEventListener('click', () => {
        showToast('冰岛极光：愿十八岁的你，终有一天能亲眼仰望那片绿色光帘。');
      });
      document.getElementById('card-easter-egg')?.addEventListener('click', () => {
        openEasterEggModal();
      });
    }
  }

  renderHomeData();

  // ===================================================================
  // 顶部导航与按键交互 (Top Nav Controls)
  // ===================================================================
  const btnHeroPlay = document.getElementById('btn-hero-play');
  const btnHeroCollect = document.getElementById('btn-hero-collect');
  const btnHeroInfo = document.getElementById('btn-hero-info');

  if (btnHeroPlay) {
    btnHeroPlay.addEventListener('click', () => {
      openEpisode01();
    });
  }

  if (btnHeroCollect) {
    btnHeroCollect.addEventListener('click', () => {
      showToast('✓ 已将《给安怡的一封生日信》加入常驻片单');
      btnHeroCollect.innerHTML = '<span>✓ 已收藏</span>';
      btnHeroCollect.style.background = 'rgba(46, 213, 115, 0.2)';
    });
  }

  if (btnHeroInfo) {
    btnHeroInfo.addEventListener('click', () => {
      openMonologueModal();
    });
  }

  // 导航锚点与功能跳转
  document.querySelectorAll('[data-nav-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-nav-target');
      if (target === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (target === 'episodes') {
        document.getElementById('section-episodes')?.scrollIntoView({ behavior: 'smooth' });
      } else if (target === 'memories') {
        document.getElementById('section-memories')?.scrollIntoView({ behavior: 'smooth' });
      } else if (target === 'monologue') {
        openMonologueModal();
      } else if (target === 'wish') {
        openCakeScene();
      } else if (target === 'easter') {
        openEasterEggModal();
      }
    });
  });

  // ===================================================================
  // Episode 01: 今天的女主角 (The Heroine of Today)
  // ===================================================================
  function openEpisode01() {
    modalEpisode.classList.remove('hidden');
    modalEpisode.classList.add('active');
    document.body.classList.add('modal-open');

    const epTitle = document.getElementById('ep-modal-title');
    const epKorean = document.getElementById('ep-modal-korean');
    const epBadge = document.getElementById('ep-modal-badge');
    const epDesc = document.getElementById('ep-modal-desc');

    if (epTitle) epTitle.textContent = config.episode01?.chineseTitle || "十八";
    if (epKorean) epKorean.textContent = config.episode01?.koreanTitle || "오늘의 주인공";
    if (epBadge) epBadge.textContent = config.episode01?.badge || "本集时长 18 Years";
    if (epDesc) epDesc.textContent = config.episode01?.synopsis || "";

    // 检查是否有自定义视频
    const epVideo = document.getElementById('ep-player-video');
    const epSlideshow = document.getElementById('ep-player-slideshow');
    if (epVideo && config.episode01?.videoSrc) {
      epVideo.src = config.episode01.videoSrc;
      epVideo.style.display = 'block';
      epSlideshow.style.display = 'none';
      epVideo.play().catch(() => {});
    } else {
      if (epVideo) epVideo.style.display = 'none';
      if (epSlideshow) {
        epSlideshow.style.display = 'block';
        startPhotoSlideshow();
      }
    }
  }

  function closeEpisode01() {
    modalEpisode.classList.remove('active');
    setTimeout(() => {
      modalEpisode.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }, 400);

    const epVideo = document.getElementById('ep-player-video');
    if (epVideo) {
      epVideo.pause();
    }
    stopPhotoSlideshow();
  }

  document.getElementById('btn-close-episode')?.addEventListener('click', closeEpisode01);
  document.getElementById('btn-ep-to-monologue')?.addEventListener('click', () => {
    closeEpisode01();
    setTimeout(() => {
      openMonologueModal();
    }, 450);
  });

  // 幻灯片播放逻辑 (Ken Burns 沉浸式电影剧照)
  let slideIndex = 0;
  function startPhotoSlideshow() {
    isPlayingSlideshow = true;
    const slides = config.memories || [];
    if (slides.length === 0) return;

    const imgEl = document.getElementById('slideshow-img');
    const subEl = document.getElementById('slideshow-subtitle');

    const updateSlide = () => {
      if (!isPlayingSlideshow) return;
      const cur = slides[slideIndex % slides.length];
      slideIndex++;

      if (imgEl) {
        imgEl.classList.remove('ken-burns');
        void imgEl.offsetWidth; // trigger reflow
        imgEl.src = cur.photo;
        imgEl.classList.add('ken-burns');
      }
      if (subEl) {
        subEl.classList.remove('visible');
        setTimeout(() => {
          subEl.textContent = cur.subtitle;
          subEl.classList.add('visible');
        }, 300);
      }
    };

    updateSlide();
    slideshowTimer = setInterval(updateSlide, 5000);
  }

  function stopPhotoSlideshow() {
    isPlayingSlideshow = false;
    if (slideshowTimer) {
      clearInterval(slideshowTimer);
      slideshowTimer = null;
    }
  }

  // ===================================================================
  // 照片回忆全屏剧场 (Photo Memories Cinema Viewer)
  // ===================================================================
  function openMemoryModal(index) {
    currentEpisodeIndex = index;
    modalMemory.classList.remove('hidden');
    modalMemory.classList.add('active');
    document.body.classList.add('modal-open');

    updateMemoryView();
  }

  function updateMemoryView() {
    const list = config.memories || [];
    if (list.length === 0) return;
    const item = list[currentEpisodeIndex];

    const imgEl = document.getElementById('memory-view-img');
    const epBadge = document.getElementById('memory-view-ep');
    const titleEl = document.getElementById('memory-view-title');
    const subEl = document.getElementById('memory-view-subtitle');
    const noteEl = document.getElementById('memory-view-note');

    if (imgEl) {
      imgEl.classList.remove('ken-burns');
      void imgEl.offsetWidth;
      imgEl.src = item.photo;
      imgEl.classList.add('ken-burns');
    }
    if (epBadge) epBadge.textContent = item.episode;
    if (titleEl) titleEl.textContent = item.title;
    if (subEl) subEl.textContent = item.subtitle;
    if (noteEl) noteEl.textContent = item.tagline;
  }

  function closeMemoryModal() {
    modalMemory.classList.remove('active');
    setTimeout(() => {
      modalMemory.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }, 400);
  }

  document.getElementById('btn-close-memory')?.addEventListener('click', closeMemoryModal);
  document.getElementById('btn-prev-memory')?.addEventListener('click', () => {
    const list = config.memories || [];
    currentEpisodeIndex = (currentEpisodeIndex - 1 + list.length) % list.length;
    updateMemoryView();
  });
  document.getElementById('btn-next-memory')?.addEventListener('click', () => {
    const list = config.memories || [];
    currentEpisodeIndex = (currentEpisodeIndex + 1) % list.length;
    updateMemoryView();
  });

  // ===================================================================
  // 生日独白 (Birthday Special Monologue)
  // ===================================================================
  function openMonologueModal() {
    modalMonologue.classList.remove('hidden');
    modalMonologue.classList.add('active');
    document.body.classList.add('modal-open');

    const lines = config.monologue?.paragraphs || [];
    const container = document.getElementById('monologue-lines-container');
    const cakeBtn = document.getElementById('btn-monologue-to-cake');

    if (container) {
      container.innerHTML = '';
      if (cakeBtn) cakeBtn.classList.add('hidden');

      lines.forEach((line, idx) => {
        const p = document.createElement('p');
        p.className = 'monologue-line';
        p.textContent = line;
        p.style.animationDelay = `${idx * 1.5 + 0.5}s`;
        container.appendChild(p);
      });

      // 所有独白展示完后，显现前往吹蜡烛的按钮
      const totalTime = (lines.length * 1.5 + 1.2) * 1000;
      monologueTimer = setTimeout(() => {
        if (cakeBtn) {
          cakeBtn.classList.remove('hidden');
          cakeBtn.classList.add('fade-in-glow');
        }
      }, totalTime);
    }
  }

  function closeMonologueModal() {
    modalMonologue.classList.remove('active');
    setTimeout(() => {
      modalMonologue.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }, 400);
    if (monologueTimer) clearTimeout(monologueTimer);
  }

  document.getElementById('btn-close-monologue')?.addEventListener('click', closeMonologueModal);
  document.getElementById('btn-monologue-to-cake')?.addEventListener('click', () => {
    closeMonologueModal();
    setTimeout(() => {
      openCakeScene();
    }, 450);
  });

  // ===================================================================
  // 生日蛋糕与许愿交互 (Birthday Cake & Wish Scene)
  // ===================================================================
  function openCakeScene() {
    modalCake.classList.remove('hidden');
    modalCake.classList.add('active');
    document.body.classList.add('modal-open');

    if (!cakeEngine) {
      cakeEngine = new window.CakeSceneEngine('cake-container', 'cake-particles-canvas', audio);
    } else {
      cakeEngine.reset();
    }
  }

  function closeCakeScene() {
    modalCake.classList.remove('active');
    setTimeout(() => {
      modalCake.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }, 400);
  }

  document.getElementById('btn-close-cake')?.addEventListener('click', closeCakeScene);
  document.getElementById('cake-next-ep-btn')?.addEventListener('click', () => {
    closeCakeScene();
    setTimeout(() => {
      openNextEpisodeModal();
    }, 450);
  });

  // ===================================================================
  // 下一集预告与记忆画廊 (Next Episode Countdown & BTS Gallery)
  // ===================================================================
  function openNextEpisodeModal() {
    modalNextEp.classList.remove('hidden');
    modalNextEp.classList.add('active');
    document.body.classList.add('modal-open');

    let countdown = 5;
    const cdEl = document.getElementById('next-ep-countdown');
    const playNextBtn = document.getElementById('btn-play-next-now');

    if (cdEl) cdEl.textContent = `${countdown}`;

    if (nextEpTimer) clearInterval(nextEpTimer);
    nextEpTimer = setInterval(() => {
      countdown--;
      if (cdEl) cdEl.textContent = `${countdown}`;
      if (countdown <= 0) {
        clearInterval(nextEpTimer);
        enterBehindTheScenesGallery();
      }
    }, 1000);

    if (playNextBtn) {
      playNextBtn.onclick = () => {
        clearInterval(nextEpTimer);
        enterBehindTheScenesGallery();
      };
    }
  }

  function closeNextEpisodeModal() {
    if (nextEpTimer) clearInterval(nextEpTimer);
    modalNextEp.classList.remove('active');
    setTimeout(() => {
      modalNextEp.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }, 400);
  }

  document.getElementById('btn-close-next-ep')?.addEventListener('click', closeNextEpisodeModal);

  function enterBehindTheScenesGallery() {
    closeNextEpisodeModal();
    setTimeout(() => {
      openBehindTheScenesGallery();
    }, 450);
  }

  function openBehindTheScenesGallery() {
    modalGallery.classList.remove('hidden');
    modalGallery.classList.add('active');
    document.body.classList.add('modal-open');

    // 渲染幕后花絮卡片
    const grid = document.getElementById('gallery-grid');
    if (grid && config.memories) {
      grid.innerHTML = '';
      config.memories.forEach((item, idx) => {
        const cell = document.createElement('div');
        cell.className = 'gallery-card';
        cell.innerHTML = `
          <div class="gallery-media">
            <img src="${item.photo}" alt="${item.title}">
            <div class="gallery-overlay">
              <span class="gallery-tag">${item.episode}</span>
              <p class="gallery-caption">${item.subtitle}</p>
            </div>
          </div>
        `;
        cell.addEventListener('click', () => {
          openMemoryModal(idx);
        });
        grid.appendChild(cell);
      });
    }
  }

  function closeGallery() {
    modalGallery.classList.remove('active');
    setTimeout(() => {
      modalGallery.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }, 400);
  }

  document.getElementById('btn-close-gallery')?.addEventListener('click', closeGallery);
  document.getElementById('btn-gallery-to-credits')?.addEventListener('click', () => {
    closeGallery();
    setTimeout(() => {
      openEndCredits();
    }, 450);
  });

  // ===================================================================
  // 隐藏彩蛋 (Hidden Easter Egg: Special Scene)
  // ===================================================================
  function openEasterEggModal() {
    modalEasterEgg.classList.remove('hidden');
    modalEasterEgg.classList.add('active');
    document.body.classList.add('modal-open');

    const lines = config.easterEgg?.lines || [
      "如果人生真的像一部韩剧……",
      "希望这一集，",
      "不是最后一集。",
      "TO BE CONTINUED…"
    ];

    const line1 = document.getElementById('easter-line-1');
    const line2 = document.getElementById('easter-line-2');
    const line3 = document.getElementById('easter-line-3');
    const line4 = document.getElementById('easter-line-4');
    const toCreditsBtn = document.getElementById('btn-easter-to-credits');

    // Reset
    [line1, line2, line3, line4].forEach(el => {
      if (el) {
        el.style.opacity = '0';
        el.classList.remove('fade-in-glow');
      }
    });
    if (toCreditsBtn) toCreditsBtn.classList.add('hidden');

    if (line1) line1.textContent = lines[0];
    if (line2) line2.textContent = lines[1];
    if (line3) line3.textContent = lines[2];
    if (line4) line4.textContent = lines[3];

    // Sequence with respectful pauses
    setTimeout(() => {
      line1.classList.add('fade-in-glow');
    }, 1000);

    setTimeout(() => {
      line2.classList.add('fade-in-glow');
    }, 3800);

    setTimeout(() => {
      line3.classList.add('fade-in-glow');
    }, 5800);

    setTimeout(() => {
      line4.classList.add('fade-in-glow');
    }, 8500);

    setTimeout(() => {
      if (toCreditsBtn) {
        toCreditsBtn.classList.remove('hidden');
        toCreditsBtn.classList.add('fade-in-glow');
      }
    }, 11000);
  }

  function closeEasterEggModal() {
    modalEasterEgg.classList.remove('active');
    setTimeout(() => {
      modalEasterEgg.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }, 400);
  }

  document.getElementById('btn-close-easter')?.addEventListener('click', closeEasterEggModal);
  document.getElementById('btn-easter-to-credits')?.addEventListener('click', () => {
    closeEasterEggModal();
    setTimeout(() => {
      openEndCredits();
    }, 450);
  });

  // ===================================================================
  // 韩剧片尾滚动演职员表 (End Credits)
  // ===================================================================
  function openEndCredits() {
    modalCredits.classList.remove('hidden');
    modalCredits.classList.add('active');
    document.body.classList.add('modal-open');

    const listContainer = document.getElementById('credits-list');
    const roles = config.credits?.roles || [];

    if (listContainer) {
      listContainer.innerHTML = '';
      roles.forEach(item => {
        const row = document.createElement('div');
        row.className = 'credit-row';
        row.innerHTML = `
          <span class="credit-role">${item.role}</span>
          <span class="credit-name">${item.name}</span>
        `;
        listContainer.appendChild(row);
      });
    }

    const scrollBox = document.getElementById('credits-scroll-box');
    if (scrollBox) {
      scrollBox.scrollTop = 0;
      scrollBox.classList.remove('rolling-credits');
      void scrollBox.offsetWidth;
      scrollBox.classList.add('rolling-credits');
    }
  }

  function closeEndCredits() {
    modalCredits.classList.remove('active');
    setTimeout(() => {
      modalCredits.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }, 400);
  }

  document.getElementById('btn-close-credits')?.addEventListener('click', closeEndCredits);
  document.getElementById('btn-replay-credits')?.addEventListener('click', () => {
    closeEndCredits();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===================================================================
  // 推荐卡片详情弹窗 (Recommendation Detail Modal)
  // ===================================================================
  const modalRecDetail = document.getElementById('modal-rec-detail');
  function openRecDetailModal(item) {
    if (!modalRecDetail) return;
    modalRecDetail.classList.remove('hidden');
    modalRecDetail.classList.add('active');
    document.body.classList.add('modal-open');

    document.getElementById('rec-detail-img').src = item.poster;
    document.getElementById('rec-detail-title').textContent = item.title;
    document.getElementById('rec-detail-korean').textContent = item.koreanTitle;
    document.getElementById('rec-detail-match').textContent = item.matchRate;
    document.getElementById('rec-detail-desc').textContent = item.description;

    const tagsContainer = document.getElementById('rec-detail-tags');
    if (tagsContainer) {
      tagsContainer.innerHTML = item.tags.map(t => `<span class="tag-pill">${t}</span>`).join('');
    }
  }

  function closeRecDetailModal() {
    modalRecDetail.classList.remove('active');
    setTimeout(() => {
      modalRecDetail.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }, 400);
  }

  document.getElementById('btn-close-rec-detail')?.addEventListener('click', closeRecDetailModal);
  document.getElementById('btn-rec-detail-play')?.addEventListener('click', () => {
    closeRecDetailModal();
    openEpisode01();
  });

  // ===================================================================
  // 全局 Toast 通知提示
  // ===================================================================
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('visible');
    setTimeout(() => {
      toastEl.classList.remove('visible');
    }, 3000);
  }

  // 监听键盘 ESC 键关闭任何活动的弹窗
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [modalEpisode, modalMemory, modalMonologue, modalCake, modalNextEp, modalEasterEgg, modalCredits, modalGallery, modalRecDetail].forEach(modal => {
        if (modal && modal.classList.contains('active')) {
          modal.classList.remove('active');
          setTimeout(() => {
            modal.classList.add('hidden');
            document.body.classList.remove('modal-open');
          }, 350);
        }
      });
    }
  });
});
