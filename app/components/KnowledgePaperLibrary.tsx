"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  parseKnowledgePaperPage,
  type KnowledgeFilter,
  type KnowledgePaperItem,
  type KnowledgePaperPage,
} from "@/app/knowledge-contract";
import type { Language } from "@/app/site-content";

const SOURCE_LABELS: Record<string, string> = {
  kci: "KCI",
  pubmed: "PubMed",
  pmc: "PMC",
  europepmc: "Europe PMC",
  kmbase_publicdata: "KMbase",
  kamje: "KAMJE",
  doaj: "DOAJ",
  medrxiv: "medRxiv",
  manual: "Curated",
};

type FeedStatus = "idle" | "loading" | "done" | "error";
type FeedState = {
  items: KnowledgePaperItem[];
  nextCursor: string | null;
  status: FeedStatus;
};

function formatPublishedDate(value: string) {
  return value.replaceAll("-", ".");
}

function formatAuthors(item: KnowledgePaperItem, language: Language) {
  const firstAuthor = item.authors[0];
  if (!firstAuthor) return language === "ko" ? "저자 정보 없음" : "Author unavailable";

  const remaining = Math.max(0, item.author_count - 1);
  if (remaining === 0) return firstAuthor;
  return language === "ko" ? `${firstAuthor} 외 ${remaining}인` : `${firstAuthor} et al.`;
}

function PaperCard({ item, language }: { item: KnowledgePaperItem; language: Language }) {
  const domestic = item.scope === "domestic";
  const regionLabel = language === "ko"
    ? domestic ? "국내" : "해외"
    : domestic ? "Korea" : "Global";
  const sourceLabel = SOURCE_LABELS[item.source] ?? item.source;
  const preprint = item.source === "medrxiv";
  const displayTitle = item.title_ko ?? item.title;
  const brief = language === "ko"
    ? { text: item.brief, lang: "ko" }
    : item.brief_en
      ? { text: item.brief_en, lang: "en" }
      : null;
  const meta = [
    item.journal,
    String(item.published_year),
    formatAuthors(item, language),
  ].filter(Boolean).join(" · ");

  return (
    <a
      className="knowledge-paper-card"
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      data-paper-scope={item.scope}
      data-paper-preprint={preprint ? "true" : undefined}
      aria-label={`${displayTitle} — ${language === "ko" ? "원문 보기" : "View source"}`}
    >
      <div className="knowledge-paper-topline">
        <time dateTime={item.published_date}>{formatPublishedDate(item.published_date)}</time>
        <span aria-hidden="true">↗</span>
      </div>
      <h2>{displayTitle}</h2>
      {brief && <p className="knowledge-paper-brief" lang={brief.lang}>{brief.text}</p>}
      <div className="knowledge-paper-tags" aria-label={language === "ko" ? "논문 분류" : "Paper classification"}>
        <span>{regionLabel}</span>
        <span>{sourceLabel}</span>
        {preprint && (
          <span data-kind="preprint">{language === "ko" ? "동료심사 전 프리프린트" : "Preprint · not peer reviewed"}</span>
        )}
      </div>
      <p className="knowledge-paper-meta">{meta}</p>
    </a>
  );
}

function initialFeed(page: KnowledgePaperPage): FeedState {
  return {
    items: page.items,
    nextCursor: page.next_cursor,
    status: page.next_cursor ? "idle" : "done",
  };
}

export function KnowledgePaperLibrary({
  initialPage,
  language,
}: {
  initialPage: KnowledgePaperPage;
  language: Language;
}) {
  const [activeFilter, setActiveFilter] = useState<KnowledgeFilter>("all");
  const [feeds, setFeeds] = useState<Partial<Record<KnowledgeFilter, FeedState>>>(() => ({
    all: initialFeed(initialPage),
  }));
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const requestsInFlight = useRef(new Set<string>());
  const ko = language === "ko";

  const loadPage = useCallback(async (filter: KnowledgeFilter, cursor: string | null) => {
    const requestKey = `${filter}:${cursor ?? "first"}`;
    if (requestsInFlight.current.has(requestKey)) return;
    requestsInFlight.current.add(requestKey);

    setFeeds((current) => ({
      ...current,
      [filter]: {
        items: cursor ? current[filter]?.items ?? [] : [],
        nextCursor: cursor,
        status: "loading",
      },
    }));

    try {
      const params = new URLSearchParams({ scope: filter });
      if (cursor) params.set("cursor", cursor);
      const response = await fetch(`/api/knowledge/papers?${params.toString()}`);
      if (!response.ok) throw new Error(`Knowledge page request failed with status ${response.status}`);

      const page = parseKnowledgePaperPage(await response.json());
      if (!page) throw new Error("Knowledge page response did not match the public contract");

      setFeeds((current) => {
        const priorItems = cursor ? current[filter]?.items ?? [] : [];
        const knownIds = new Set(priorItems.map((item) => item.paper_id));
        const appended = page.items.filter((item) => !knownIds.has(item.paper_id));
        return {
          ...current,
          [filter]: {
            items: [...priorItems, ...appended],
            nextCursor: page.next_cursor,
            status: page.next_cursor ? "idle" : "done",
          },
        };
      });
    } catch (error) {
      console.error("[knowledge-library] could not load paper page", error);
      setFeeds((current) => ({
        ...current,
        [filter]: {
          items: current[filter]?.items ?? [],
          nextCursor: cursor,
          status: "error",
        },
      }));
    } finally {
      requestsInFlight.current.delete(requestKey);
    }
  }, []);

  const activeFeed = feeds[activeFilter];
  const visibleItems = activeFeed?.items ?? [];
  const filters = useMemo<Array<{ value: KnowledgeFilter; label: string }>>(() => [
    { value: "all", label: ko ? "전체" : "All" },
    { value: "overseas", label: ko ? "해외" : "Global" },
    { value: "domestic", label: ko ? "국내" : "Korea" },
  ], [ko]);

  const activateFilter = (filter: KnowledgeFilter) => {
    setActiveFilter(filter);
    if (!feeds[filter]) void loadPage(filter, null);
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !activeFeed?.nextCursor || activeFeed.status !== "idle") return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        void loadPage(activeFilter, activeFeed.nextCursor);
      }
    }, { rootMargin: "900px 0px" });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [activeFeed?.nextCursor, activeFeed?.status, activeFilter, loadPage]);

  return (
    <>
      <div className="knowledge-scope-toolbar">
        <div
          className="knowledge-scope-filters"
          role="group"
          aria-label={ko ? "논문 지역 분류" : "Filter papers by region"}
        >
          {filters.map((filter) => (
            <button
              key={filter.value}
              className="knowledge-scope-filter"
              type="button"
              aria-label={filter.label}
              aria-pressed={activeFilter === filter.value}
              data-active={activeFilter === filter.value ? "true" : "false"}
              onClick={() => activateFilter(filter.value)}
            >
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {visibleItems.length > 0 ? (
        <div className="knowledge-paper-columns" data-active-scope={activeFilter}>
          {visibleItems.map((item) => (
            <PaperCard key={item.paper_id} item={item} language={language} />
          ))}
        </div>
      ) : activeFeed?.status !== "loading" && activeFeed?.status !== "error" ? (
        <div className="knowledge-empty" role="status">
          <p>{ko ? "해당 분류의 최신 논문을 불러오고 있습니다." : "Loading papers in this category."}</p>
        </div>
      ) : null}

      <div ref={sentinelRef} className="knowledge-feed-sentinel" aria-hidden="true" />
      <div className="knowledge-feed-status" aria-live="polite">
        {activeFeed?.status === "loading" && (
          <p><i aria-hidden="true" />{ko ? "문헌을 이어 불러오는 중" : "Loading more literature"}</p>
        )}
        {activeFeed?.status === "error" && (
          <button
            type="button"
            onClick={() => void loadPage(activeFilter, activeFeed.nextCursor)}
          >
            {ko ? "불러오기 다시 시도" : "Try loading again"}
          </button>
        )}
      </div>
    </>
  );
}
