"use client";

import { useEffect, useState } from "react";
import type { Language } from "@/app/site-content";

type NavArticle = {
  id: string;
  label: string;
  tag?: string;
};

const CURRENT_ARTICLES: Record<Language, readonly NavArticle[]> = {
  ko: [
    { id: "technology-alphaevidence", label: "AlphaEvidence" },
    { id: "technology-alphadoc-engine", label: "AlphaDoc Engine" },
    { id: "technology-alphadocument", label: "AlphaDocument" },
    { id: "technology-alphaimage", label: "AlphaImage" },
    { id: "technology-alphalayer", label: "AlphaLayer" },
    { id: "technology-alphaseal", label: "AlphaSeal" },
  ],
  en: [
    { id: "technology-alphaevidence", label: "AlphaEvidence" },
    { id: "technology-alphadoc-engine", label: "AlphaDoc Engine" },
    { id: "technology-alphadocument", label: "AlphaDocument" },
    { id: "technology-alphaimage", label: "AlphaImage" },
    { id: "technology-alphalayer", label: "AlphaLayer" },
    { id: "technology-alphaseal", label: "AlphaSeal" },
  ],
};

const NEXT_ARTICLES: Record<Language, readonly NavArticle[]> = {
  ko: [
    { id: "technology-medical-model", label: "의료 특화 AI 모델", tag: "Coming soon" },
    { id: "technology-onpremise-security", label: "온프레미스 알파닥과 기관 단위 보안 체계" },
  ],
  en: [
    { id: "technology-medical-model", label: "Medical-specialized AI Model", tag: "Coming soon" },
    { id: "technology-onpremise-security", label: "On-premise Alphadoc and Institution-level Security" },
  ],
};

function NavList({
  articles,
  offset,
  activeId,
  className,
}: {
  articles: readonly NavArticle[];
  offset: number;
  activeId: string | null;
  className?: string;
}) {
  return (
    <ol className={className}>
      {articles.map((article, index) => (
        <li key={article.id}>
          <a
            className={activeId === article.id ? "is-active" : undefined}
            href={`#${article.id}`}
            aria-current={activeId === article.id ? "location" : undefined}
          >
            <small>{String(offset + index + 1).padStart(2, "0")}</small>
            <span>
              {article.label}
              {article.tag && <small className="technology-article-nav-tag">{article.tag}</small>}
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function TechnologyArticleNav({ language }: { language: Language }) {
  const currentArticles = CURRENT_ARTICLES[language];
  const nextArticles = NEXT_ARTICLES[language];
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = [...currentArticles, ...nextArticles]
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-22% 0px -58%", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [currentArticles, nextArticles]);

  return (
    <nav
      className={`technology-article-nav${activeId ? " is-visible" : ""}`}
      aria-label={language === "ko" ? "기술 저널 목차" : "Technology journal contents"}
    >
      <div className="technology-article-nav-inner">
        <span>{language === "ko" ? "현재 기술" : "Current Tech"}</span>
        <NavList articles={currentArticles} offset={0} activeId={activeId} />
        <span className="technology-article-nav-next-title">{language === "ko" ? "다음 기술" : "What's next"}</span>
        <NavList
          articles={nextArticles}
          offset={currentArticles.length}
          activeId={activeId}
          className="technology-article-nav-next"
        />
      </div>
    </nav>
  );
}
