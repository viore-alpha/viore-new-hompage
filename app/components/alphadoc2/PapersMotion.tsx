/* eslint-disable @next/next/no-img-element -- Decorative product chrome inside the motion scene. */
import {
  ArrowUp,
  ArrowUpRight,
  BookText,
  Bookmark,
  FileText,
  LayoutGrid,
  List,
  MousePointer2,
  NotebookPen,
  PanelRight,
  Search,
  X,
} from "lucide-react";
import { ViewportMotion } from "@/app/components/ViewportMotion";
import { A2Pill, A2Sidebar, A2Topbar, a2Labels } from "@/app/components/alphadoc2/kit";
import type { Language } from "@/app/site-content";

/* Papers screen from the 2.0 mockup (CHG-036, CHG-050): the card list, the reader and the Alphadoc pane.
   The scene searches the list ("예측 모델"), the list narrows to TRIPOD+AI, the card is opened in the
   reader, and the Alphadoc pane is asked what TRIPOD+AI adds to TRIPOD 2015. Bibliographic data is real
   and public; the answer only restates what the guideline itself lists. One 11s cycle. Each element's own style
   is the final frame, so reduced motion shows the finished screen. */

type PaperType = "guideline" | "review" | "original";

const papers: ReadonlyArray<{
  id: string;
  type: PaperType;
  title: string;
  authors: string;
  journal: string;
  year: string;
  ko: string;
  en: string;
}> = [
  {
    id: "ssc-2021",
    type: "guideline",
    title: "Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021",
    authors: "Evans L et al.",
    journal: "Critical Care Medicine",
    year: "2021",
    ko: "패혈증·패혈성 쇼크 국제 진료지침",
    en: "International sepsis and septic shock guideline",
  },
  {
    id: "vancomycin-2020",
    type: "guideline",
    title: "Therapeutic monitoring of vancomycin for serious methicillin-resistant Staphylococcus aureus infections: a revised consensus guideline and review",
    authors: "Rybak MJ et al.",
    journal: "Am J Health Syst Pharm",
    year: "2020",
    ko: "반코마이신 혈중농도 모니터링 개정 합의문",
    en: "Revised vancomycin monitoring consensus",
  },
  {
    id: "tripod-ai",
    type: "guideline",
    title: "TRIPOD+AI statement: updated guidance for reporting clinical prediction models that use regression or machine learning methods",
    authors: "Collins GS et al.",
    journal: "BMJ",
    year: "2024",
    ko: "임상 예측 모델 연구 보고 지침",
    en: "Reporting clinical prediction model studies",
  },
  {
    id: "topol-2019",
    type: "review",
    title: "High-performance medicine: the convergence of human and artificial intelligence",
    authors: "Topol EJ",
    journal: "Nature Medicine",
    year: "2019",
    ko: "의료 전반의 AI 활용을 다룬 리뷰",
    en: "Review of AI across medicine",
  },
  {
    id: "consort-ai",
    type: "guideline",
    title: "Reporting guidelines for clinical trial reports for interventions involving artificial intelligence: the CONSORT-AI extension",
    authors: "Liu X et al.",
    journal: "Nature Medicine",
    year: "2020",
    ko: "AI 중재 임상시험 결과 보고 지침",
    en: "Reporting trials of AI interventions",
  },
  {
    id: "rivers-2001",
    type: "original",
    title: "Early goal-directed therapy in the treatment of severe sepsis and septic shock",
    authors: "Rivers E et al.",
    journal: "N Engl J Med",
    year: "2001",
    ko: "중증 패혈증·패혈성 쇼크의 조기 목표 지향 치료",
    en: "Early goal-directed therapy in severe sepsis",
  },
  {
    id: "spirit-ai",
    type: "guideline",
    title: "Guidelines for clinical trial protocols for interventions involving artificial intelligence: the SPIRIT-AI extension",
    authors: "Cruz Rivera S et al.",
    journal: "Nature Medicine",
    year: "2020",
    ko: "AI 중재 임상시험 계획서 지침",
    en: "Protocols for trials of AI interventions",
  },
  {
    id: "decide-ai",
    type: "guideline",
    title: "Reporting guideline for the early-stage clinical evaluation of decision support systems driven by artificial intelligence: DECIDE-AI",
    authors: "Vasey B et al.",
    journal: "Nature Medicine",
    year: "2022",
    ko: "AI 의사결정 지원 초기 임상 평가 보고 지침",
    en: "Early clinical evaluation of AI decision support",
  },
];

const TARGET_ID = "tripod-ai";

const sceneCopy = {
  ko: {
    role: "의학부 · 메디컬 어드바이저",
    listTitle: "논문",
    listSub: "바이오레가 제공하는 문헌",
    searchButton: "논문 검색",
    filters: ["전체 보기", "리뷰", "원저", "가이드라인"],
    search: "제목·내용·저자로 검색",
    query: "예측 모델",
    listCount: "자료 목록 · 8개 자료",
    resultCount: "검색 결과 · 1개 자료",
    selectAll: "전체 목록 · 0개 선택",
    types: { guideline: "가이드라인", review: "리뷰", original: "원저" },
    readerTitle: "논문 읽기",
    readerPage: "1 / 2 · 초록·정보",
    readerEmpty: "목록에서 논문을 고르면 여기에서 읽습니다",
    metaPublished: "발행 정보",
    metaType: "자료 형식",
    metaTypeValue: "공개 문헌 · 바이오레 제공",
    abstractTitle: "초록",
    abstract: "회귀나 머신러닝 방법을 쓴 임상 예측 모델 연구의 보고 지침입니다. 기존 TRIPOD 성명을 갱신해, 연구 설계와 데이터, 모델 개발과 평가를 투명하게 보고하도록 항목을 정리했습니다.",
    journalLink: "저널 원문 열기",
    checkTitle: "확인할 내용",
    checks: ["데이터 출처와 연구 대상", "모델 개발과 평가 방법", "표본 크기와 결측치 처리"],
    readFull: "논문 본문 읽기",
    note: "노트 0",
    save: "저장",
    paneTitle: "알파닥",
    paperShort: "TRIPOD+AI statement",
    paneEmptyTitle: "이 논문에 대해 알파닥에게 물어보세요",
    paneEmptyBody: "본문 구절을 선택해 물어보거나 바로 질문을 입력하세요.",
    paneEmptyNote: "알파닥은 이 논문 내용을 근거로 답합니다.",
    panePlaceholder: "이 논문에 대해 알파닥에게 물어보세요",
    question: "2015년 TRIPOD 대비 새로 챙겨야 할 항목만 정리해 줘",
    questionLines: ["2015년 TRIPOD 대비", "새로 챙겨야 할 항목만 정리해 줘"],
    paneScope: "현재 문헌 · 초록·정보",
    paneSend: "질문 보내기",
    answerLead: "TRIPOD+AI는 2015년 TRIPOD를 대체합니다. 회귀와 머신러닝 모델에 같은 체크리스트를 쓰며, 본문 27개 항목과 초록 13개 항목으로 구성됩니다.",
    answerSub: "2015년판에 없거나 크게 늘어난 항목은 네 가지입니다.",
    answerItems: [
      ["공정성", "공정성을 다룬 방법과 주요 하위 집단별 성능"],
      ["클래스 불균형", "보정했다면 그 이유와 방법, 이후 재보정"],
      ["오픈 사이언스", "프로토콜·연구 등록, 데이터와 코드 공유"],
      ["환자·대중 참여", "설계부터 결과 공유까지의 참여, 없었다면 없었다고 명시"],
    ],
    answerPill: "BMJ · TRIPOD+AI",
  },
  en: {
    role: "Medical affairs · Medical advisor",
    listTitle: "Papers",
    listSub: "Literature provided by Viore",
    searchButton: "Search papers",
    filters: ["All", "Reviews", "Original", "Guidelines"],
    search: "Search titles, text, authors",
    query: "prediction model",
    listCount: "Library · 8 papers",
    resultCount: "Results · 1 paper",
    selectAll: "All · 0 selected",
    types: { guideline: "Guideline", review: "Review", original: "Original" },
    readerTitle: "Reader",
    readerPage: "1 / 2 · Abstract & details",
    readerEmpty: "Pick a paper from the list to read it here",
    metaPublished: "Published",
    metaType: "Type",
    metaTypeValue: "Open literature · provided by Viore",
    abstractTitle: "Abstract",
    abstract: "A reporting guideline for clinical prediction model studies that use regression or machine learning methods. It updates the original TRIPOD statement and lists what to report about study design, data, and model development and evaluation.",
    journalLink: "Open in journal",
    checkTitle: "What to check",
    checks: ["Data sources and study population", "Model development and evaluation", "Sample size and missing data"],
    readFull: "Read the full paper",
    note: "Notes 0",
    save: "Save",
    paneTitle: "Alphadoc",
    paperShort: "TRIPOD+AI statement",
    paneEmptyTitle: "Ask Alphadoc about this paper",
    paneEmptyBody: "Select a passage, or just type a question.",
    paneEmptyNote: "Alphadoc answers from this paper.",
    panePlaceholder: "Ask Alphadoc about this paper",
    question: "What do we need to add compared with TRIPOD 2015?",
    questionLines: ["What do we need to add", "compared with TRIPOD 2015?"],
    paneScope: "This paper · Abstract",
    paneSend: "Send",
    answerLead: "TRIPOD+AI replaces TRIPOD 2015. It uses one checklist for regression and machine learning models: 27 items for the paper and 13 for the abstract.",
    answerSub: "Four areas are new or much expanded:",
    answerItems: [
      ["Fairness", "how fairness was addressed, and performance in key subgroups"],
      ["Class imbalance", "why and how it was handled, and any recalibration"],
      ["Open science", "protocol, registration, data and code sharing"],
      ["Patient and public involvement", "who took part, or a statement that no one did"],
    ],
    answerPill: "BMJ · TRIPOD+AI",
  },
} as const;

export function AlphadocV2PapersMotion({ language, label }: { language: Language; label: string }) {
  const copy = sceneCopy[language];
  const target = papers.find((paper) => paper.id === TARGET_ID) ?? papers[2];

  return (
    <ViewportMotion className="a2-stage a2-papers" role="img" ariaLabel={label} threshold={0.12}>
      <div className="a2" aria-hidden="true">
        <div className="a2-app">
          <A2Sidebar language={language} active="papers" role={copy.role} />
          <div className="a2-main">
            <A2Topbar language={language} crumbs={[a2Labels[language].nav.papers]} />
            <div className="a2p-body">
              <section className="a2p-list">
                <header className="a2p-list-head">
                  <div>
                    <h4>{copy.listTitle}</h4>
                    <p>{copy.listSub}</p>
                  </div>
                  <span className="a2-button a2p-search-button"><Search strokeWidth={1.8} />{copy.searchButton}</span>
                </header>
                <div className="a2p-filters">
                  {copy.filters.map((filter, index) => (
                    <span key={filter} className={index === 0 ? "is-active" : undefined}>{filter}</span>
                  ))}
                </div>
                <div className="a2p-search a2-anim">
                  <Search strokeWidth={1.8} />
                  <span className="a2p-search-text">
                    <span className="a2p-search-ph a2-anim">{copy.search}</span>
                    <span className="a2p-search-query a2-anim">{copy.query}</span>
                  </span>
                </div>
                <div className="a2p-count-row">
                  <span className="a2p-count">
                    <span className="a2p-count-all a2-anim">{copy.listCount}</span>
                    <span className="a2p-count-result a2-anim">{copy.resultCount}</span>
                  </span>
                  <span className="a2p-views"><List strokeWidth={1.8} /><LayoutGrid strokeWidth={1.8} className="is-active" /></span>
                </div>
                <p className="a2p-select-all"><span className="a2p-check" />{copy.selectAll}</p>
                <ul className="a2p-cards">
                  {papers.map((paper) => {
                    const isTarget = paper.id === TARGET_ID;
                    return (
                      <li key={paper.id} className={`a2p-card a2-anim ${isTarget ? "is-target" : "is-other"}`}>
                        <span className="a2p-card-top">
                          <span className={`a2-badge${paper.type === "guideline" ? " is-green" : paper.type === "review" ? " is-blue" : ""}`}>{copy.types[paper.type]}</span>
                          <span className="a2p-check" />
                        </span>
                        <strong>{paper.title}</strong>
                        <span className="a2p-card-desc">{paper[language]}</span>
                        <span className="a2p-card-meta">{paper.authors} · {paper.journal} · {paper.year}</span>
                        {isTarget && <span className="a2p-ptr a2-anim"><MousePointer2 strokeWidth={1.6} /></span>}
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section className="a2p-reader a2-anim">
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
                    <p className="a2p-sheet-link">{copy.journalLink}<ArrowUpRight strokeWidth={1.8} /></p>
                    <h5>{copy.checkTitle}</h5>
                    <ul>
                      {copy.checks.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <span className="a2-button a2p-read-full"><BookText strokeWidth={1.8} />{copy.readFull}</span>
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
                <p className="a2p-pane-paper a2-anim"><FileText strokeWidth={1.8} /><span>{copy.paperShort}</span></p>
                <div className="a2p-pane-scroll">
                  <div className="a2p-pane-empty a2-anim">
                    <img src="/brand/alphadoc-alpha.png" alt="" width="419" height="365" />
                    <strong>{copy.paneEmptyTitle}</strong>
                    <span>{copy.paneEmptyBody}</span>
                    <small>{copy.paneEmptyNote}</small>
                  </div>
                  <div className="a2p-convo">
                    <p className="a2-bubble a2p-question a2-anim">{copy.question}</p>
                    <span className="a2p-thinking a2-anim"><i /><i /><i /></span>
                    <div className="a2-answer a2p-answer a2-anim">
                      <p>{copy.answerLead}</p>
                      <div className="a2p-answer-more a2-anim">
                        <p>{copy.answerSub}</p>
                        <ul>
                          {copy.answerItems.map(([term, detail]) => <li key={term}><strong>{term}</strong> {detail}</li>)}
                        </ul>
                      </div>
                      <p className="a2p-answer-source">
                        <A2Pill kind="paper" label={copy.answerPill} className="a2p-answer-pill a2-anim" />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="a2p-pane-composer">
                  <div className="a2p-pane-input">
                    <span className="a2p-pane-placeholder a2-anim">{copy.panePlaceholder}</span>
                    <span className="a2p-pane-typed a2-anim">
                      <span className="a2p-typed-line a2p-type-1 a2-anim">{copy.questionLines[0]}</span>
                      <span className="a2p-typed-line a2p-type-2 a2-anim">{copy.questionLines[1]}</span>
                    </span>
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
