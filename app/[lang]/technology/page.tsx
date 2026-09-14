import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../technology.css";
import { getAlphaEvidencePublicSnapshot } from "@/app/alphaevidence-snapshot";
import { TechnologyPage } from "@/app/components/TechnologyPage";
import { buildPageMetadata, PAGE_SEO } from "@/app/seo";
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
      headline: "AlphaEvidence — Evidence Foundation",
      description: "문헌과 진료지침의 출처, 이용 조건과 변화를 다시 확인할 수 있는 근거 계보로 잇는 AlphaEvidence를 소개합니다.",
      about: ["Evidence Foundation", "AlphaEvidence DB", "medical evidence provenance"],
    },
    {
      id: "technology-alphadoc-engine",
      headline: "AlphaDoc Engine — Medical Workflow Orchestration",
      description: "의료 업무의 목적에 맞춰 근거, 문서 맥락, 도구와 사용자 검토를 연결하는 AlphaDoc Engine을 소개합니다.",
      about: ["medical workflow orchestration", "purpose-defined capability", "AI execution"],
    },
    {
      id: "technology-alphadocument",
      headline: "AlphaDocument — Deterministic Document-to-Artifact Engine",
      description: "지원 문서를 구조와 출처가 남는 재사용 가능한 Document Artifact로 바꾸는 AlphaDocument를 소개합니다.",
      about: ["Document Artifact", "document provenance", "deterministic extraction"],
    },
    {
      id: "technology-alphaimage",
      headline: "AlphaImage — Deterministic Image Artifact Compiler",
      description: "지원되는 정적 이미지를 일관된 표현과 좌표로 정리하고 원본과 기존 주석의 계보를 잇는 AlphaImage를 소개합니다.",
      about: ["Image Artifact", "image coordinate normalization", "annotation provenance"],
    },
    {
      id: "technology-alphalayer",
      headline: "AlphaLayer — Protected Inference Gateway",
      description: "알파닥의 선택된 보호 텍스트 기능에서 외부 AI 실행을 등록된 정책 경계로 통제하는 AlphaLayer를 소개합니다.",
      about: ["Protected Inference Gateway", "purpose-aware protection", "AI execution assurance"],
    },
    {
      id: "technology-alphaseal",
      headline: "AlphaSeal — End-to-End Conversation Seal",
      description: "지원되는 1:1 쪽지 본문을 참여자의 브라우저 사이에서 암호화하는 AlphaSeal의 현재 범위를 소개합니다.",
      about: ["end-to-end encrypted messaging", "one-to-one messaging", "conversation protection"],
    },
  ],
  en: [
    {
      id: "technology-alphaevidence",
      headline: "AlphaEvidence — Evidence Foundation",
      description: "Explore AlphaEvidence, the foundation that keeps literature and guideline provenance, usage context, and change reviewable.",
      about: ["Evidence Foundation", "AlphaEvidence DB", "medical evidence provenance"],
    },
    {
      id: "technology-alphadoc-engine",
      headline: "AlphaDoc Engine — Medical Workflow Orchestration",
      description: "Explore AlphaDoc Engine, the execution layer connecting evidence, document context, tools, and user review around medical work.",
      about: ["medical workflow orchestration", "purpose-defined capability", "AI execution"],
    },
    {
      id: "technology-alphadocument",
      headline: "AlphaDocument — Deterministic Document-to-Artifact Engine",
      description: "Explore AlphaDocument, which turns supported documents into reusable artifacts carrying recoverable structure and provenance.",
      about: ["Document Artifact", "document provenance", "deterministic extraction"],
    },
    {
      id: "technology-alphaimage",
      headline: "AlphaImage — Deterministic Image Artifact Compiler",
      description: "Explore AlphaImage, which organizes supported static images into consistent representations and coordinates while keeping source lineage.",
      about: ["Image Artifact", "image coordinate normalization", "annotation provenance"],
    },
    {
      id: "technology-alphalayer",
      headline: "AlphaLayer — Protected Inference Gateway",
      description: "Explore AlphaLayer, the registered policy boundary governing selected protected external AI execution paths in Alphadoc.",
      about: ["Protected Inference Gateway", "purpose-aware protection", "AI execution assurance"],
    },
    {
      id: "technology-alphaseal",
      headline: "AlphaSeal — End-to-End Conversation Seal",
      description: "Explore AlphaSeal's current scope for encrypting message bodies on supported one-to-one paths between participant browsers.",
      about: ["end-to-end encrypted messaging", "one-to-one messaging", "conversation protection"],
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
    datePublished: "2026-07-21",
    dateModified: "2026-07-30",
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
        dateModified: "2026-07-30",
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
