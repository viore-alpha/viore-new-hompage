import type { Metadata } from "next";
import type { Language } from "@/app/site-content";

export const SITE_ORIGIN = "https://vioreai.com";
export const SITE_NAME = "바이오레 | Viore";
// Date of the Alphadoc 2.0 site update. Set to the production release day (KST).
export const SITE_UPDATED_AT = "2026-10-26";
export const SQUARE_LOGO_PATH = "/brand/viore-v-square-white-v2.png";
export const SOCIAL_IMAGE_PATHS: Record<Language, string> = {
  ko: "/brand/viore-social-card-white-v3.png",
  en: "/brand/viore-social-card-white-v3.png",
};
export const SOCIAL_IMAGE_PATH = SOCIAL_IMAGE_PATHS.ko;

export const HOME_SEO: Record<
  Language,
  {
    title: string;
    description: string;
    locale: "ko_KR" | "en_US";
    language: "ko-KR" | "en-US";
  }
> = {
  ko: {
    title: "바이오레, 새로운 선형을 그리다.",
    description:
      "의료의 전문성과 시스템을 연결해 의료기관과 의료기업이 안전하게 쓰는 AI 에이전트 워크스페이스 알파닥을 만드는 주식회사 바이오레 공식 홈페이지입니다.",
    locale: "ko_KR",
    language: "ko-KR",
  },
  en: {
    title: "Viore, Drawing a New Linearity in Medicine.",
    description:
      "Viore builds Alphadoc, the AI agent workspace healthcare organizations can use with confidence.",
    locale: "en_US",
    language: "en-US",
  },
};

export const PAGE_SEO = {
  technology: {
    ko: {
      title: "바이오레 기술 | 의료 AI를 하나의 기술 체계로",
      description:
        "바이오레가 AlphaEvidence, AlphaDoc Engine, AlphaDocument, AlphaImage, AlphaLayer, AlphaSeal을 설계하고 알파닥에 연결하는 원칙과 현재 구현 범위, 사내망 알파닥의 일방향 AI 구조를 소개합니다.",
    },
    en: {
      title: "Viore Technology | Medical AI, Built as a System",
      description:
        "How Viore designs AlphaEvidence, AlphaDoc Engine, AlphaDocument, AlphaImage, AlphaLayer, and AlphaSeal, how far each is verified, and how a one-way AI architecture keeps institution data inside corporate-network Alphadoc.",
    },
  },
  product: {
    ko: {
      title: "알파닥 | 의료기관과 의료기업을 위한 AI 에이전트 워크스페이스",
      description:
        "알파닥은 의료기관과 의료기업을 위한 AI 에이전트 워크스페이스입니다. 근거를 찾는 일도, 노트를 쓰는 일도 알파닥에게 맡길 수 있습니다.",
    },
    en: {
      title: "Alphadoc | The AI Agent Workspace for Healthcare",
      description:
        "Alphadoc is the AI agent workspace for healthcare providers and healthcare companies. Hand off evidence searches and note-writing, and keep your data inside.",
    },
  },
  knowledge: {
    ko: {
      title: "바이오레 Knowledge | 최신 의학 논문과 근거",
      description:
        "AlphaEvidence DB에서 선별한 최신 의학 논문과 한국어 브리프를 확인하는 바이오레의 살아 있는 문헌 라이브러리입니다.",
    },
    en: {
      title: "Viore Knowledge | Medical Literature and Evidence",
      description:
        "A living literature library with newly published medical papers and evidence briefs selected from AlphaEvidence DB.",
    },
  },
} as const;

export const SEO_KEYWORDS = [
  "바이오레",
  "Viore",
  "주식회사 바이오레",
  "의료 AI",
  "의료 AI 스타트업",
  "알파닥",
  "Alphadoc",
  "AI Medical Workspace",
  "AI 에이전트 워크스페이스",
  "AI agent workspace",
  "AlphaDoc Engine",
  "AlphaEvidence",
];

export function absoluteUrl(path: string) {
  return new URL(path, SITE_ORIGIN).toString();
}

export function languageAlternates(path = "") {
  return {
    "ko-KR": `/ko${path}`,
    "en-US": `/en${path}`,
    "x-default": `/ko${path}`,
  };
}

export function buildSiteMetadata(lang: Language): Metadata {
  const seo = HOME_SEO[lang];
  const socialImagePath = SOCIAL_IMAGE_PATHS[lang];
  const applicationName = lang === "ko" ? "바이오레" : "Viore";

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: seo.title,
    description: seo.description,
    applicationName,
    authors: [{ name: "Viore Inc.", url: SITE_ORIGIN }],
    creator: "Viore Inc.",
    publisher: "Viore Inc.",
    category: "Medical Technology",
    keywords: SEO_KEYWORDS,
    referrer: "origin-when-cross-origin",
    formatDetection: {
      address: false,
      email: false,
      telephone: false,
    },
    icons: {
      icon: [{ url: SQUARE_LOGO_PATH, type: "image/png", sizes: "1024x1024" }],
      shortcut: SQUARE_LOGO_PATH,
      apple: [{ url: SQUARE_LOGO_PATH, type: "image/png", sizes: "1024x1024" }],
    },
    manifest: "/site.webmanifest",
    appleWebApp: {
      capable: true,
      title: applicationName,
      statusBarStyle: "default",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      google: "jHNuqMrzpeZwUGWutN9Mms8neuaBP87Ouc1RNOYBSyg",
      other: {
        "naver-site-verification": "0e061d531e55879e99b874a7f3c1ed095c7462d6",
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      url: `/${lang}`,
      locale: seo.locale,
      alternateLocale: [lang === "ko" ? HOME_SEO.en.locale : HOME_SEO.ko.locale],
      siteName: SITE_NAME,
      images: [
        {
          url: socialImagePath,
          width: 1200,
          height: 630,
          alt: lang === "ko" ? "흰 배경의 바이오레 로고" : "Viore logo on a white background",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [socialImagePath],
    },
  };
}

export function buildPageMetadata({
  lang,
  title,
  description,
  path = "",
  type = "website",
}: {
  lang: Language;
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
}): Metadata {
  const canonical = `/${lang}${path}`;
  const socialImagePath = SOCIAL_IMAGE_PATHS[lang];

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
      types: {
        "text/plain": "/llms.txt",
      },
    },
    openGraph: {
      title,
      description,
      type,
      url: canonical,
      locale: HOME_SEO[lang].locale,
      alternateLocale: [lang === "ko" ? HOME_SEO.en.locale : HOME_SEO.ko.locale],
      siteName: SITE_NAME,
      images: [
        {
          url: socialImagePath,
          width: 1200,
          height: 630,
          alt: lang === "ko" ? "흰 배경의 바이오레 로고" : "Viore logo on a white background",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImagePath],
    },
  };
}
