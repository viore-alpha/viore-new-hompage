import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  AlphaDocumentVisual,
  AlphaDocOrchestrationVisual,
  AlphaEvidenceVisual,
  CouncilPartnersVisual,
} from "@/app/components/BrandVisuals";
import { buildPageMetadata, PAGE_SEO } from "@/app/seo";
import { detailContent, insightPageFromLegacySlug, isLanguage, pageKeyFromSlug, pageRoutes, routeFor, technologyAnchorFromLegacySlug, technologyRouteFor, type Language, type PageKey } from "@/app/site-content";

type RouteParams = Promise<{ lang: string; slug: string[] }>;

export async function generateMetadata({ params }: { params: RouteParams }): Promise<Metadata> {
  const { lang, slug } = await params;
  const technologyAnchor = technologyAnchorFromLegacySlug(slug);
  if (isLanguage(lang) && technologyAnchor) {
    const copy = PAGE_SEO.technology[lang];
    return {
      title: copy.title,
      description: copy.description,
      alternates: { canonical: technologyRouteFor(lang, technologyAnchor) },
    };
  }
  const key = pageKeyFromSlug(slug);
  if (!isLanguage(lang) || !key) return {};
  if (key === "company" || key === "contact" || key === "alphadoc") return {};
  if (key === "knowledge") {
    const copy = PAGE_SEO.knowledge[lang];
    return buildPageMetadata({
      lang,
      title: copy.title,
      description: copy.description,
      path: `/${pageRoutes[key]}`,
    });
  }
  const page = detailContent[lang][key];
  return buildPageMetadata({
    lang,
    title: `${page.title.replace(/\n/g, " ")} — Viore`,
    description: page.lead.replace(/\n/g, " "),
    path: `/${pageRoutes[key]}`,
  });
}

function PageVisual({ pageKey }: { pageKey: Exclude<PageKey, "company" | "alphadoc" | "contact"> }) {
  if (pageKey === "alphadoc-engine") return <AlphaDocOrchestrationVisual compact />;
  if (pageKey === "alphaevidence") return <AlphaEvidenceVisual />;
  if (pageKey === "alphadocument") return <AlphaDocumentVisual />;
  if (pageKey === "clinical-council") return <CouncilPartnersVisual compact />;
  return null;
}

function continuationFor(language: Language, pageKey: PageKey) {
  const ko = language === "ko";
  if (pageKey === "alphadoc-engine") return { label: "Explore AlphaEvidence", href: routeFor(language, "alphaevidence") };
  if (pageKey === "alphaevidence") return { label: "Explore AlphaDocument", href: routeFor(language, "alphadocument") };
  if (pageKey === "alphadocument") return { label: ko ? "알파닥 만나기" : "Meet Alphadoc", href: routeFor(language, "alphadoc"), external: true };
  if (pageKey === "alphadoc") return { label: "Open alphadoc.ai", href: "https://alphadoc.ai", external: true };
  if (pageKey === "knowledge") return { label: ko ? "Council & Partners 만나기" : "Meet Council & Partners", href: routeFor(language, "clinical-council") };
  if (pageKey === "clinical-council") return { label: ko ? "함께 이야기하기" : "Start a conversation", href: routeFor(language, "contact") };
  return null;
}

export default async function DetailRoute({ params }: { params: RouteParams }) {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) notFound();
  const technologyAnchor = technologyAnchorFromLegacySlug(slug);
  if (technologyAnchor) permanentRedirect(technologyRouteFor(lang, technologyAnchor));
  const legacyInsightPage = insightPageFromLegacySlug(slug);
  if (legacyInsightPage) permanentRedirect(routeFor(lang, legacyInsightPage));
  const pageKey = pageKeyFromSlug(slug);
  if (!pageKey) notFound();
  if (pageKey === "company") permanentRedirect(routeFor(lang, "company"));
  if (pageKey === "contact") permanentRedirect(routeFor(lang, "contact"));
  const page = detailContent[lang][pageKey];
  const continuation = continuationFor(lang, pageKey);

  if (pageKey === "alphadoc" || pageKey === "knowledge") notFound();

  return (
    <article className={`detail-page detail-page-${pageKey} detail-${page.kind}`}>
      <section className="detail-hero">
        <div className="detail-network-backdrop" aria-hidden="true" />
        <div className="detail-hero-copy">
          <div className="detail-kicker"><span>{page.eyebrow}</span>{page.status && <i>{page.status}</i>}</div>
          <h1>{page.title}</h1>
          <p>{page.lead}</p>
        </div>
        <PageVisual pageKey={pageKey} />
      </section>

      <div className="detail-chapter">
        <section className="detail-body">
          <div className="detail-line-marker" aria-hidden="true"><i /><span /></div>
          <h2>{page.statement}</h2>
          {page.statementLead && <p className="detail-statement-lead">{page.statementLead}</p>}
          <div className="detail-items">
            {page.items.map((item) => <article key={item.index}><span>{item.index}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}
          </div>
        </section>
        {continuation && (
          <section className="detail-next">
            <small>{lang === "ko" ? "NEXT LINE" : "NEXT LINE"}</small>
            <a href={continuation.href} target={continuation.external ? "_blank" : undefined} rel={continuation.external ? "noreferrer" : undefined}>
              <span>{continuation.label}</span><i>↗</i>
            </a>
          </section>
        )}
      </div>
    </article>
  );
}
