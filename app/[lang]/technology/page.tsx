import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../technology.css";
import { getAlphaEvidencePublicSnapshot } from "@/app/alphaevidence-snapshot";
import { TechnologyPage } from "@/app/components/TechnologyPage";
import { buildPageMetadata, PAGE_SEO, SITE_UPDATED_AT } from "@/app/seo";
import { isLanguage } from "@/app/site-content";

type TechnologyRouteParams = Promise<{ lang: string }>;

export const revalidate = 600;

export async function generateMetadata({ params }: { params: TechnologyRouteParams }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};
  const copy = PAGE_SEO.technology[lang];
  return buildPageMetadata({
    lang,
    title: copy.title,
    description: copy.description,
    path: "/technology",
  });
}

const techArticles = {
  ko: [
    {
      id: "technology-alphaevidence",
      datePublished: "2026-07-21",
      dateModified: SITE_UPDATED_AT,
      headline: "AlphaEvidence — Evidence Foundation",
      description: "문헌과 진료지침마다 출처, 이용 조건, 변경 이력을 남겨 근거를 다시 확인할 수 있게 하는 AlphaEvidence를 소개합니다.",
      about: ["Evidence Foundation", "AlphaEvidence DB", "medical evidence provenance"],
    },
    {
      id: "technology-alphadoc-engine",
      datePublished: "2026-07-21",
      dateModified: SITE_UPDATED_AT,
      headline: "AlphaDoc Engine — Medical Workflow Orchestration",
      description: "할 일에 맞춰 근거와 문서, 도구, 사용자 확인을 연결하는 실행 계층 AlphaDoc Engine을 소개합니다.",
      about: ["medical workflow orchestration", "purpose-defined capability", "AI execution"],
    },
    {
      id: "technology-alphadocument",
      datePublished: "2026-07-21",
      dateModified: SITE_UPDATED_AT,
      headline: "AlphaDocument — Deterministic Document-to-Artifact Engine",
      description: "지원하는 문서를 구조와 출처가 남는 Document Artifact로 바꾸는 AlphaDocument를 소개합니다.",
      about: ["Document Artifact", "document provenance", "deterministic extraction"],
    },
    {
      id: "technology-alphaimage",
      datePublished: "2026-07-21",
      dateModified: SITE_UPDATED_AT,
      headline: "AlphaImage — Deterministic Image Artifact Compiler",
      description: "지원하는 정적 이미지를 같은 형식과 좌표로 정리하고 원본과 주석의 이력을 남기는 AlphaImage를 소개합니다.",
      about: ["Image Artifact", "image coordinate normalization", "annotation provenance"],
    },
    {
      id: "technology-alphalayer",
      datePublished: "2026-07-21",
      dateModified: SITE_UPDATED_AT,
      headline: "AlphaLayer — Protected Inference Gateway",
      description: "알파닥의 일부 텍스트 기능에서 외부 AI 실행을 등록된 정책으로 통제하는 AlphaLayer를 소개합니다.",
      about: ["Protected Inference Gateway", "purpose-aware protection", "AI execution assurance"],
    },
    {
      id: "technology-alphaseal",
      datePublished: "2026-07-21",
      dateModified: SITE_UPDATED_AT,
      headline: "AlphaSeal — End-to-End Conversation Seal",
      description: "지원하는 1:1 쪽지 본문을 보내는 사람과 받는 사람의 브라우저 사이에서 암호화하는 AlphaSeal의 현재 범위를 소개합니다.",
      about: ["end-to-end encrypted messaging", "one-to-one messaging", "conversation protection"],
    },
    {
      id: "technology-medical-model",
      datePublished: "2026-09-14",
      dateModified: SITE_UPDATED_AT,
      headline: "의료 특화 AI 모델 — Medical-specialized AI Model",
      description: "바이오레가 직접 미세조정하는 의료 AI 모델",
      about: ["Medical-specialized AI Model", "fine-tuned AI model", "AlphaDoc Engine model slot"],
    },
    {
      id: "technology-onpremise-security",
      datePublished: "2026-09-14",
      dateModified: SITE_UPDATED_AT,
      headline: "사내망 알파닥과 기관 단위 보안 체계 — Corporate Network Deployment & Zero Trust Extension",
      description: "개인이 쓰던 AI를 기관이 도입하고 관리할 수 있게 만듭니다.",
      about: ["Corporate Network Deployment", "Zero Trust Extension", "institution-level security"],
    },
    {
      id: "technology-one-way-architecture",
      datePublished: SITE_UPDATED_AT,
      dateModified: SITE_UPDATED_AT,
      headline: "일방향 AI 구조 — One-way AI Architecture",
      description: "의학 근거는 기관 환경으로 보내고, 기관의 데이터는 그 안에 둡니다.",
      about: ["One-way AI Architecture", "corporate network deployment", "institution data residency"],
    },
  ],
  en: [
    {
      id: "technology-alphaevidence",
      datePublished: "2026-07-21",
      dateModified: SITE_UPDATED_AT,
      headline: "AlphaEvidence — Evidence Foundation",
      description: "How AlphaEvidence keeps source, terms of use, and change history with every paper and guideline.",
      about: ["Evidence Foundation", "AlphaEvidence DB", "medical evidence provenance"],
    },
    {
      id: "technology-alphadoc-engine",
      datePublished: "2026-07-21",
      dateModified: SITE_UPDATED_AT,
      headline: "AlphaDoc Engine — Medical Workflow Orchestration",
      description: "How AlphaDoc Engine, Viore's execution layer, matches evidence, documents, tools, and review to each task.",
      about: ["medical workflow orchestration", "purpose-defined capability", "AI execution"],
    },
    {
      id: "technology-alphadocument",
      datePublished: "2026-07-21",
      dateModified: SITE_UPDATED_AT,
      headline: "AlphaDocument — Deterministic Document-to-Artifact Engine",
      description: "How AlphaDocument turns supported documents into reusable artifacts that keep structure and source.",
      about: ["Document Artifact", "document provenance", "deterministic extraction"],
    },
    {
      id: "technology-alphaimage",
      datePublished: "2026-07-21",
      dateModified: SITE_UPDATED_AT,
      headline: "AlphaImage — Deterministic Image Artifact Compiler",
      description: "How AlphaImage aligns supported static images to one format and coordinate system while keeping their history.",
      about: ["Image Artifact", "image coordinate normalization", "annotation provenance"],
    },
    {
      id: "technology-alphalayer",
      datePublished: "2026-07-21",
      dateModified: SITE_UPDATED_AT,
      headline: "AlphaLayer — Protected Inference Gateway",
      description: "How AlphaLayer governs external AI execution with registered policies in selected Alphadoc text features.",
      about: ["Protected Inference Gateway", "purpose-aware protection", "AI execution assurance"],
    },
    {
      id: "technology-alphaseal",
      datePublished: "2026-07-21",
      dateModified: SITE_UPDATED_AT,
      headline: "AlphaSeal — End-to-End Conversation Seal",
      description: "AlphaSeal's current scope: supported one-to-one message bodies, encrypted between participant browsers.",
      about: ["end-to-end encrypted messaging", "one-to-one messaging", "conversation protection"],
    },
    {
      id: "technology-medical-model",
      datePublished: "2026-09-14",
      dateModified: SITE_UPDATED_AT,
      headline: "Our own medical AI model",
      description: "Fine-tuned by Viore, built for medicine.",
      about: ["Medical-specialized AI Model", "fine-tuned AI model", "AlphaDoc Engine model slot"],
    },
    {
      id: "technology-onpremise-security",
      datePublished: "2026-09-14",
      dateModified: SITE_UPDATED_AT,
      headline: "Alphadoc on your corporate network, with institution-level security — Corporate Network Deployment & Zero Trust Extension",
      description: "From AI you use on your own to AI your institution can run and govern.",
      about: ["Corporate Network Deployment", "Zero Trust Extension", "institution-level security"],
    },
    {
      id: "technology-one-way-architecture",
      datePublished: SITE_UPDATED_AT,
      dateModified: SITE_UPDATED_AT,
      headline: "One-way AI Architecture",
      description: "Evidence flows in. Your data stays put.",
      about: ["One-way AI Architecture", "corporate network deployment", "institution data residency"],
    },
  ],
} as const;

export default async function TechnologyRoute({ params }: { params: TechnologyRouteParams }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const snapshotResult = await getAlphaEvidencePublicSnapshot();
  const pageUrl = `https://vioreai.com/${lang}/technology`;
  const articles = techArticles[lang];
  const inLanguage = lang === "ko" ? "ko-KR" : "en-US";
  const collectionName = lang === "ko" ? "바이오레 기술 저널" : "Viore Technology Journal";
  const articleNodes = articles.map((article) => ({
    "@type": "TechArticle",
    "@id": `${pageUrl}#${article.id}`,
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    about: article.about,
    isPartOf: { "@type": "CollectionPage", "@id": pageUrl, name: collectionName },
    author: { "@type": "Organization", name: "Viore Inc.", url: "https://vioreai.com" },
    inLanguage,
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageUrl,
        name: collectionName,
        description: PAGE_SEO.technology[lang].description,
        dateModified: SITE_UPDATED_AT,
        inLanguage,
        about: articles.map((article) => article.headline),
        hasPart: articles.map((article) => ({ "@id": `${pageUrl}#${article.id}` })),
      },
      ...articleNodes,
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }}
      />
      <TechnologyPage language={lang} snapshotResult={snapshotResult} />
    </>
  );
}
