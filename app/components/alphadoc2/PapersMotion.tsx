/* eslint-disable @next/next/no-img-element -- Decorative product chrome inside the motion scene. */
import { ArrowUp, BookText, Bookmark, NotebookPen, PanelRight, Search, X } from "lucide-react";
import { ViewportMotion } from "@/app/components/ViewportMotion";
import { A2Pill, A2Sidebar, A2Topbar, a2Labels } from "@/app/components/alphadoc2/kit";
import type { Language } from "@/app/site-content";

/* Papers screen from the 2.0 mockup (CHG-036, CHG-050): card list, reader, Alphadoc pane.
   Bibliographic data is public and exact; the answer only restates what the guideline asks authors to report. */

const papers = [
  {
    id: "consort-ai",
    title: "Reporting guidelines for clinical trial reports for interventions involving artificial intelligence: the CONSORT-AI extension",
    authors: "Liu X et al.",
    journal: "Nature Medicine",
    year: "2020",
    ko: "AI 중재 임상시험 결과 보고 지침",
    en: "Reporting trials of AI interventions",
  },
  {
    id: "tripod-ai",
    title: "TRIPOD+AI statement: updated guidance for reporting clinical prediction models that use regression or machine learning methods",
    authors: "Collins GS et al.",
    journal: "BMJ",
    year: "2024",
    ko: "임상 예측 모델 연구 보고 지침",
    en: "Reporting clinical prediction models",
  },
  {
    id: "spirit-ai",
    title: "Guidelines for clinical trial protocols for interventions involving artificial intelligence: the SPIRIT-AI extension",
    authors: "Cruz Rivera S et al.",
    journal: "Nature Medicine",
    year: "2020",
    ko: "AI 중재 임상시험 계획서 지침",
    en: "Protocols for trials of AI interventions",
  },
  {
    id: "decide-ai",
    title: "Reporting guideline for the early-stage clinical evaluation of decision support systems driven by artificial intelligence: DECIDE-AI",
    authors: "Vasey B et al.",
    journal: "Nature Medicine",
    year: "2022",
    ko: "AI 의사결정 지원 초기 임상 평가 보고 지침",
    en: "Early clinical evaluation of AI decision support",
  },
] as const;

const TARGET_ID = "tripod-ai";

const sceneCopy = {
  ko: {
    role: "의학부 · 메디컬 어드바이저",
    listTitle: "논문",
    listSub: "바이오레가 제공하는 문헌",
    filters: ["전체 보기", "리뷰", "원저", "가이드라인"],
    search: "제목·내용·저자로 검색",
    listCount: "자료 목록 · 4건",
    category: "가이드라인",
    readerTitle: "논문 읽기",
    readerPage: "1 / 2 · 초록·정보",
    readerEmpty: "목록에서 논문을 고르면 여기에서 읽습니다",
    metaPublished: "발행 정보",
    metaType: "자료 형식",
    metaTypeValue: "공개 문헌 · 바이오레 제공",
    abstractTitle: "초록",
    abstract: "회귀나 머신러닝 방법을 쓴 임상 예측 모델 연구의 보고 지침입니다. 기존 TRIPOD 성명을 갱신해, 연구 설계와 데이터, 모델 개발과 평가를 투명하게 보고하도록 항목을 정리했습니다.",
    checkTitle: "확인할 내용",
    checks: ["데이터 출처와 연구 대상", "모델 개발과 평가 방법", "표본 크기와 결측치 처리"],
    note: "노트",
    save: "저장",
    paneTitle: "알파닥",
    paneEmptyTitle: "이 논문에 대해 알파닥에게 물어보세요",
    paneEmptyBody: "본문 구절을 고르거나 바로 질문을 입력하세요.",
    panePlaceholder: "이 논문에 대해 알파닥에게 물어보세요",
    question: "우리 예측 모델 논문에 이 지침을 써도 돼?",
    paneScope: "현재 문헌",
    paneSend: "질문 보내기",
    answerLead: "네. TRIPOD+AI는 회귀 모델과 머신러닝 모델을 가리지 않고 쓰는 예측 모델 보고 지침입니다.",
    answerItems: ["모델 개발과 검증 연구 모두 대상", "본문 27개 항목, 초록 13개 항목", "2015년 TRIPOD 체크리스트를 대체"],
    answerPill: "BMJ · TRIPOD+AI",
  },
  en: {
    role: "Medical affairs · Medical advisor",
    listTitle: "Papers",
    listSub: "Literature provided by Viore",
    filters: ["All", "Reviews", "Original", "Guidelines"],
    search: "Search titles, text, authors",
    listCount: "4 papers",
    category: "Guideline",
    readerTitle: "Reader",
    readerPage: "1 / 2 · Abstract & details",
    readerEmpty: "Pick a paper from the list to read it here",
    metaPublished: "Published",
    metaType: "Type",
    metaTypeValue: "Open literature · provided by Viore",
    abstractTitle: "Abstract",
    abstract: "A reporting guideline for clinical prediction model studies that use regression or machine learning methods. It updates the original TRIPOD statement and lists what to report about study design, data, and model development and evaluation.",
    checkTitle: "What to check",
    checks: ["Data sources and study population", "Model development and evaluation", "Sample size and missing data"],
    note: "Note",
    save: "Save",
    paneTitle: "Alphadoc",
    paneEmptyTitle: "Ask Alphadoc about this paper",
    paneEmptyBody: "Select a passage, or just type a question.",
    panePlaceholder: "Ask Alphadoc about this paper",
    question: "Can we use this for our prediction model paper?",
    paneScope: "This paper",
    paneSend: "Send",
    answerLead: "Yes. TRIPOD+AI is the reporting guideline for prediction model studies, whether they use regression or machine learning.",
    answerItems: ["Covers development and validation studies", "27 items for the paper, 13 for the abstract", "Replaces the 2015 TRIPOD checklist"],
    answerPill: "BMJ · TRIPOD+AI",
  },
} as const;

export function AlphadocV2PapersMotion({ language, label }: { language: Language; label: string }) {
  const copy = sceneCopy[language];
  const target = papers.find((paper) => paper.id === TARGET_ID) ?? papers[1];

  return (
    <ViewportMotion className="a2-stage a2-papers" role="img" ariaLabel={label} threshold={0.12}>
      <div className="a2" aria-hidden="true">
        <div className="a2-app">
          <A2Sidebar language={language} active="papers" role={copy.role} />
          <div className="a2-main">
            <A2Topbar language={language} crumbs={[a2Labels[language].nav.papers, "TRIPOD+AI"]} />
            <div className="a2p-body">
              <section className="a2p-list">
                <header className="a2p-list-head">
                  <h4>{copy.listTitle}</h4>
                  <p>{copy.listSub}</p>
                </header>
                <div className="a2p-filters">
                  {copy.filters.map((filter, index) => (
                    <span key={filter} className={index === 0 ? "is-active" : undefined}>{filter}</span>
                  ))}
                </div>
                <div className="a2p-search">
                  <Search strokeWidth={1.8} />
                  <span>{copy.search}</span>
                </div>
                <p className="a2p-count">{copy.listCount}</p>
                <ul className="a2p-cards">
                  {papers.map((paper) => (
                    <li key={paper.id} className={`a2p-card${paper.id === TARGET_ID ? " is-target a2-anim" : ""}`}>
                      <span className="a2-badge is-green">{copy.category}</span>
                      <strong>{paper.title}</strong>
                      <span className="a2p-card-desc">{paper[language]}</span>
                      <span className="a2p-card-meta">{paper.authors} · {paper.journal} · {paper.year}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="a2p-reader">
                <div className="a2p-reader-bar">
                  <span className="a2p-reader-title">{copy.readerTitle}</span>
                  <span className="a2p-reader-page">{copy.readerPage}</span>
                  <span className="a2p-reader-tools">
                    <span><NotebookPen strokeWidth={1.8} />{copy.note}</span>
                    <span><Bookmark strokeWidth={1.8} />{copy.save}</span>
                    <span className="is-active"><PanelRight strokeWidth={1.8} />{copy.paneTitle}</span>
                  </span>
                </div>
                <div className="a2p-reader-scroll">
                  <article className="a2p-sheet a2-anim">
                    <h4>{target.title}</h4>
                    <p className="a2p-sheet-authors">{target.authors}</p>
                    <dl className="a2p-sheet-meta">
                      <div><dt>{copy.metaPublished}</dt><dd>{target.journal} · {target.year}</dd></div>
                      <div><dt>{copy.metaType}</dt><dd>{copy.metaTypeValue}</dd></div>
                    </dl>
                    <h5>{copy.abstractTitle}</h5>
                    <p>{copy.abstract}</p>
                    <h5>{copy.checkTitle}</h5>
                    <ul>
                      {copy.checks.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </article>
                  <p className="a2p-reader-empty a2-anim">
                    <BookText strokeWidth={1.6} />
                    <span>{copy.readerEmpty}</span>
                  </p>
                </div>
              </section>

              <aside className="a2-panel a2p-pane">
                <div className="a2-panel-head">
                  <img src="/brand/alphadoc-alpha.png" alt="" width="419" height="365" />
                  <span>{copy.paneTitle}</span>
                  <X className="a2-close" strokeWidth={1.8} />
                </div>
                <div className="a2p-pane-scroll">
                  <div className="a2p-pane-empty a2-anim">
                    <img src="/brand/alphadoc-alpha.png" alt="" width="419" height="365" />
                    <strong>{copy.paneEmptyTitle}</strong>
                    <span>{copy.paneEmptyBody}</span>
                  </div>
                  <div className="a2p-convo">
                    <p className="a2-bubble a2p-question a2-anim">{copy.question}</p>
                    <span className="a2p-thinking a2-anim"><i /><i /><i /></span>
                    <div className="a2-answer a2p-answer a2-anim">
                      <p>{copy.answerLead}</p>
                      <ul>
                        {copy.answerItems.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                      <p className="a2p-answer-source">
                        <A2Pill kind="paper" label={copy.answerPill} className="a2p-answer-pill a2-anim" />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="a2p-pane-composer">
                  <div className="a2p-pane-input">
                    <span className="a2p-pane-placeholder a2-anim">{copy.panePlaceholder}</span>
                    <span className="a2p-pane-typed a2-anim">{copy.question}</span>
                  </div>
                  <div className="a2p-pane-row">
                    <span className="a2-badge">{copy.paneScope}</span>
                    <span className="a2-button is-primary a2p-pane-send a2-anim">
                      <ArrowUp strokeWidth={2.2} />
                      {copy.paneSend}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </ViewportMotion>
  );
}
