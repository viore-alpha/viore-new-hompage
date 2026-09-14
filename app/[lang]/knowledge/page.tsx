import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../knowledge.css";
import { KnowledgePage } from "@/app/components/KnowledgePage";
import { getKnowledgeInitialFeed } from "@/app/knowledge-feed";
import { buildPageMetadata, PAGE_SEO, SITE_ORIGIN } from "@/app/seo";
import { isLanguage } from "@/app/site-content";

type KnowledgeRouteParams = Promise<{ lang: string }>;

export const revalidate = 600;

export async function generateMetadata({ params }: { params: KnowledgeRouteParams }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};
  const copy = PAGE_SEO.knowledge[lang];

  return buildPageMetadata({
    lang,
    title: copy.title,
    description: copy.description,
    path: "/knowledge",
  });
}

export default async function KnowledgeRoute({ params }: { params: KnowledgeRouteParams }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const result = await getKnowledgeInitialFeed();
  const pageUrl = `${SITE_ORIGIN}/${lang}/knowledge`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    url: pageUrl,
    name: PAGE_SEO.knowledge[lang].title,
    description: PAGE_SEO.knowledge[lang].description,
    inLanguage: lang === "ko" ? "ko-KR" : "en-US",
    dateModified: (result.page.refreshed_at ?? result.lastSuccessAt ?? "2026-07-27").slice(0, 10),
    isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }}
      />
      <KnowledgePage language={lang} result={result} />
    </>
  );
}
