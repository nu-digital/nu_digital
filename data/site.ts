export const siteConfig = {
  name: "nu_digital",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://nu-digital.github.io/nu_digital",
  description:
    "nu_digitalは、ゲーム制作、VRChatワールド、3Dモデル、Webなどのデジタル創作に取り組むプロジェクト団体です。",
  ogImage: "/images/ogp/member.webp",
};

export const navItems = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Project", href: "/project" },
  { name: "Terms", href: "/terms" },
];

export const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/nu-digital",
    type: "github",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCP50CAz2iyb8KKa3EV5BGKw",
    type: "youtube",
  },
  {
    label: "X",
    href: "https://x.com/nu_digital_",
    type: "x",
  },
] as const;

export const heroSlides = [
  { src: "/images/hero/1.webp", alt: "nu_digitalの活動風景 1" },
  { src: "/images/hero/2.webp", alt: "nu_digitalの活動風景 2" },
  { src: "/images/hero/3.webp", alt: "nu_digitalの活動風景 3" },
  { src: "/images/hero/4.webp", alt: "nu_digitalの活動風景 4" },
  { src: "/images/hero/5.webp", alt: "nu_digitalの活動風景 5" },
  { src: "/images/hero/6.webp", alt: "nu_digitalの活動風景 6" },
];

export const memberImages = [
  "member_yura.webp",
  "member_iwa.webp",
  "member_mizmelon.webp",
  "member_syama.webp",
  "member_nero.webp",
  "member_potty.webp",
  "member_alma.webp",
  "member_yoshi.webp",
  "member_ff.webp",
  "member_lemonkey.webp",
  "member_s.webp",
  "member_takoyaki.webp",
  "member_asi.webp",
].map((fileName) => ({
  src: `/images/member/${fileName}`,
  alt: `nu_digital member ${fileName.replace(/\.[^.]+$/, "")}`,
}));

export const homeCopy = {
  about:
    "nu_digitalは、日本大学の理工学部・芸術学部の学生で構成される、デジタルコンテンツ制作に特化した団体です。大学本部公認のプロジェクトを遂行し、ゲーム、VRChatワールド、3D、Web、映像、サウンドなどの制作に取り組んでいます。",
  project:
    "ゲーム制作、VRChatワールド、モデリング、デザイン、サウンド、Web開発など幅広い制作活動に取り組んでいます。展示、イベント、技術発信、団体運営まで、リアルとデジタルの両面から創作を広げています。",
};

export const homeLinks = {
  about: [
    {
      href: "/news/recruit-2026",
      label: "募集について",
    },
    {
      href: "https://numetaproject.booth.pm/",
      label: "Booth",
    },
    {
      href: "https://numa-meta.com/posts/blogs/metasou/",
      label: "活動紹介",
    },
    {
      href: "https://nu-digital.github.io/nu-document/",
      label: "部内ドキュメント",
    },
  ],
  project: [
    { href: "/project", label: "制作物を見る" },
    {
      href: "https://www.youtube.com/channel/UCP50CAz2iyb8KKa3EV5BGKw",
      label: "公式YouTube",
    },
    {
      href: "https://numetaproject.booth.pm/",
      label: "公式Booth",
    },
  ],
};

export const featuredProjects = [
  {
    "title": "学生VR集会 Webサイト",
    "description": "学生VR集会の紹介・活動写真・参加団体をまとめたWebサイト。",
    "image": "/images/imported/img-a535007ebd150bc1f148.webp",
    "link": "/project/student-vr-meetup-website"
  },
  {
    "title": "ReCall",
    "description": "記憶と連想から生まれる世界を巡る、物語と空間演出を重視したVR作品です。IVRC 2026メタバース部門で「岸上健人賞」を受賞し、富山のVR学会で展示しました。",
    "image": "/images/imported/img-a537e2d36d5524465939.webp",
    "link": "/project/recall"
  },
  {
    "title": "LBE Restaurant Simulator",
    "description": "現実の空間を歩きながら、複数人で料理を作って客へ運ぶレストランシミュレーターです。",
    "image": "/images/imported/img-6a5153913b3027a25ebe.webp",
    "link": "/project/lbe-restaurant-simulator"
  }
];

export const featuredVideo = {
  videoId: "SFRixRoWjyo",
  title: "nu_digital 制作物紹介",
};

export const overviewSlides = Array.from({ length: 14 }, (_, index) => ({
  src: `/images/overview/${index + 1}.webp`,
  alt: `nu_digital 団体概要スライド ${index + 1}`,
}));

export const introductionVideo = {
  videoId: "cBZoGDpXPHU",
  title: "nu_digital 団体紹介",
};
