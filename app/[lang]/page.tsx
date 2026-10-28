import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../alphadoc-hero-story.css";
import { CompanyPage } from "@/app/components/CompanyPage";
import {
  HOME_SEO,
  SITE_UPDATED_AT,
  SITE_NAME,
  SITE_ORIGIN,
  SOCIAL_IMAGE_PATHS,
  SQUARE_LOGO_PATH,
  absoluteUrl,
  buildPageMetadata,
} from "@/app/seo";
import { isLanguage } from "@/app/site-content";

type LanguageRouteParams = Promise<{ lang: string }>;

export const revalidate = 600;

export async function generateMetadata({ params }: { params: LanguageRouteParams }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};
  const seo = HOME_SEO[lang];
  return buildPageMetadata({ lang, title: seo.title, description: seo.description });
}

export default async function LanguageHome({ params }: { params: LanguageRouteParams }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const seo = HOME_SEO[lang];
  const pageUrl = absoluteUrl(`/${lang}`);
  const socialImagePath = SOCIAL_IMAGE_PATHS[lang];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_ORIGIN}/#organization`,
        name: "Viore Inc.",
        legalName: "주식회사 바이오레",
        alternateName: ["바이오레", "Viore"],
        url: SITE_ORIGIN,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(SQUARE_LOGO_PATH),
          width: 1024,
          height: 1024,
        },
        image: {
          "@type": "ImageObject",
          url: absoluteUrl(socialImagePath),
          width: 1200,
          height: 630,
        },
        email: "biz@vioreai.com",
        description: seo.description,
        contactPoint: {
          "@type": "ContactPoint",
          email: "biz@vioreai.com",
          contactType: "business inquiries",
          availableLanguage: ["Korean", "English"],
        },
        areaServed: ["KR", "Global"],
        brand: {
          "@type": "Brand",
          "@id": "https://alphadoc.ai/#brand",
          name: "Alphadoc",
          alternateName: "알파닥",
          url: "https://alphadoc.ai",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: SITE_NAME,
        alternateName: ["Viore Inc.", "주식회사 바이오레"],
        description: seo.description,
        inLanguage: ["ko-KR", "en-US"],
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: seo.title,
        description: seo.description,
        inLanguage: seo.language,
        dateModified: SITE_UPDATED_AT,
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
        about: { "@id": `${SITE_ORIGIN}/#organization` },
        primaryEntity: { "@id": `${SITE_ORIGIN}/#organization` },
        image: absoluteUrl(socialImagePath),
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://alphadoc.ai/#software",
        name: "Alphadoc",
        alternateName: "알파닥",
        url: "https://alphadoc.ai",
        applicationCategory: "MedicalApplication",
        operatingSystem: "Web",
        description:
          lang === "ko"
            ? "의료기관과 의료기업을 위한 바이오레의 AI 에이전트 워크스페이스"
            : "The AI agent workspace for healthcare, from Viore.",
        author: { "@id": `${SITE_ORIGIN}/#organization` },
      },
    ],
  };

  return (
    <>
      <script
        id="viore-home-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }}
      />
      <CompanyPage language={lang} />
    </>
  );
}
