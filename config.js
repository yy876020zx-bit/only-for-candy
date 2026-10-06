/**
 * =====================================================================
 * 《给安怡的一封生日信》- 网站全局配置文件
 * =====================================================================
 * 你可以在这里自由修改所有的文案、照片路径、剧集信息和音乐。
 * 每一个字段都有详细的中文注释，直接修改引号中的文字即可实时生效。
 */

window.ANYI_CONFIG = {
  // 1. 基础信息
  person: {
    name: "陈安怡",
    nickname: "安怡宝宝",
    age: 18,
    year: "2026",
    idols: "cortis 金主训",
    favoriteDrama: "《爱情怎么翻译》",
    favoriteElement: "冰岛极光",
  },

  // 2. 网站与剧集核心命名 (Netflix 风格)
  series: {
    koreanTitle: "너만의 파파고",
    chineseTitle: "十八",
    englishSubtitle: "Brand New Life",
    seasonTag: "1 Season · Special",
    qualityBadge: "Ultra HD 4K · 5.1 环绕声 · 杜比视界",
    bannerTagline: "10.07限定",
    heroSynopsis: "18年呀，你肯定经历了很多，幸福，快乐同时也会有时累累的，会难受，有不开心，但这个世界太美好了，让忘记那些不好，去享受身每个瞬间",
    heroPoster: "assets/photos/hero_aurora_snowforest.png",
  },

  // 3. 开场流媒体片头与韩文转中文沉浸式翻译配置
  intro: {
    // 韩剧《爱情怎么翻译》开场：韩文转中文沉浸式翻译配置
    translation: {
      enabled: true,
      koreanMain: "너만의 파파고",
      chineseMain: "属于你的papago"
    },
    brandTop: "CAYFLIX",
    brandBottom: "STREAMING SPECIAL PRESENTATION",
    startButtonText: "点击进入",
    myListButtonText: "＋ 我的片单",
    badgeYear: "2026",
    badgeEpisode: "Special Episode · 18岁专属特别篇",
  },

  // 4. 推荐栏目：“人生中的小确幸” (4~6个卡片)
  recommendations: [
    {
      id: "rec_music",
      title: "Cortis",
      koreanTitle: "CORTIS COLLECTION",
      subtitle: "Cortis",
      tags: ["DOLBY_ATMOS", "K-pop", "JUHOON"],
      poster: "assets/photos/coer_cover.jpg",
      description: "韩国 BigHit Music 于 2025 年推出的男子组合。该组合由五名成员组成：James、Juhoon、Martin、Seonghyeon 和 Keonho。",
      duration: "循环播放"
    },
    {
      id: "rec_drama",
      title: "《爱情怎么翻译》",
      koreanTitle: "이 사랑 통역 되나요",
      subtitle: "Can This Love Be Translated?",
      tags: ["浪漫", "喜剧"],
      poster: "assets/photos/love_translated_cover_clean.png",
      description: "世界上有多少人就有多少种语言，每个人都使用着自己都语言，所以会相互不理解，曲解对方，甚至口出狂言。",
      duration: "完整珍藏"
    }
  ],
// 5. 照片回忆区：“继续观看” (像韩剧剧照一样)
  memories: [
    {
      episode: "S01E01",
      title: "第一集 · 初见帧",
      photo: "assets/photos/memory_01.jpg",
      subtitle: "“这一幕，值得保存。”",
      tagline: "风吹过发梢的瞬间，像极了韩剧开场的慢镜头。"
    },
    {
      episode: "S01E02",
      title: "第二集 · 暮色漫步",
      photo: "assets/photos/memory_02.jpg",
      subtitle: "“这一刻，后来想起来还是很好。”",
      tagline: "不需要特定目的地，只要阳光恰好落在街边。"
    },
    {
      episode: "S01E03",
      title: "第三集 · 普通日子的小奇迹",
      photo: "assets/photos/memory_03.jpg",
      subtitle: "“有些普通的日子，因为某个人而变得特别。”",
      tagline: "平静的时光里，多了一抹亮色。"
    },
    {
      episode: "S01E04",
      title: "第四集 · 电影定格机位",
      photo: "assets/photos/memory_04.jpg",
      subtitle: "“像电影里的固定机位，记录下关于你的这一帧。”",
      tagline: "不用摆刻意的姿势，自然的你就最好看。"
    },
    {
      episode: "S01E05",
      title: "第五集 · 晚风与私语",
      photo: "assets/photos/memory_05.jpg",
      subtitle: "“愿所有温柔的晚风，都吹向你。”",
      tagline: "夜色渐深，愿你今夜有最香甜的梦境。"
    },
    {
      episode: "S01E06",
      title: "第六集 · 破晓时刻",
      photo: "assets/photos/memory_06.jpg",
      subtitle: "“十八岁，天空才刚刚破晓。”",
      tagline: "往后的所有故事，都值得期待。"
    }
  ],

  // 6. 第一集：今天的女主角 (Episode 01)
  episode01: {
    tag: "EPISODE 01",
    koreanTitle: "오늘의 주인공",
    chineseTitle: "十八",
    englishTitle: "The Heroine of Today",
    badge: "18 Years · 独家放送",
    synopsis: "something beautiful",
    coverPhoto: "assets/photos/ep01_hero.jpg",
    videoSrc: "assets/videos/episode-01-main.mp4"
  },

  // 7. 生日独白文案 (K-Drama Monologue)
  monologue: {
    title: "Birthday Special",
    koreanNote: "생일 축하 독백",
    paragraphs: [
      "安怡宝宝，生日快乐。",
      "希望新的一岁，有很多让你开心的小事。",
      "希望你累的时候，可以好好休息。",
      "希望你不开心的时候，不用假装没事。",
      "也希望以后，会有很多值得你记住的日子。",
      "今天是你的生日。",
      "所以今天，什么都不用想。",
      "开心就好。"
    ]
  },

  // 8. 生日蛋糕场景与许愿配置
  cake: {
    instruction: "许一个愿望吧",
    actionHint: "轻触蜡烛或轻吹屏幕 · 吹灭蜡烛",
    candleSubtitleInitial: "“许一个愿望吧。”",
    afterBlowLine1: "“愿望不用告诉任何人。”",
    afterBlowLine2: "“希望它真的会实现。”",
    finalBlessing: "十八岁快乐，愿你眼里始终有极光，心中始终有安宁。"
  },

  // 9. “下一集”预告 (Next Episode)
  nextEpisode: {
    badge: "NEXT EPISODE · S01E02",
    title: "cmessage",
    koreanTitle: "평범한 날들의 작은 로맨스",
    synopsis: "social media",
    buttonText: "▶ 播放下一集 (记忆胶卷)",
    galleryTitle: "幕后花絮 · Behind The Scenes",
    galleryDesc: "记录下我们共同走过的那些琐碎却闪光的瞬间。"
  },

  // 10. 隐藏彩蛋 (Hidden Easter Egg)
  easterEgg: {
    cardTitle: "Special Scene",
    cardSubtitle: "未公开特别片段",
    poster: "assets/photos/easter_egg.jpg",
    lines: [
      "如果人生真的像一部韩剧……",
      "希望这一集，",
      "不是最后一集。",
      "TO BE CONTINUED…"
    ]
  },

  // 11. 韩剧片尾滚动制作名单 (End Credits)
  credits: {
    title: "PRODUCTION CREDITS",
    roles: [
      { role: "DIRECTED FOR", name: "陈安怡 (Chen Anyi)" },
      { role: "WRITTEN FOR", name: "陈安怡 (Chen Anyi)" },
      { role: "LEAD ACTRESS", name: "陈安怡 (오늘의 주인공)" },
      { role: "SPECIAL GUEST", name: "CORTIS 金主训 (Special Thanks)" },
      { role: "INSPIRATION", name: "《爱情怎么翻译》· 이 사랑 통역 되나요" },
      { role: "CINEMATOGRAPHY", name: "冰岛极光与静谧长夜" },
      { role: "SOUNDTRACK", name: "Aurora Night Melodies" },
      { role: "MILESTONE", name: "18th Birthday Milestone · 2026" },
      { role: "PRODUCTION", name: "AN YI STREAMING STUDIOS" }
    ],
    closingMessage: "Happy Birthday, An Yi.",
    nextEpisodeHint: "See you in the next episode."
  },

  // 12. 音乐配置
  audio: {
    customAudioSrc: null,
    autoplayPrompt: "点击任意位置开启韩剧原声音效"
  }
};
