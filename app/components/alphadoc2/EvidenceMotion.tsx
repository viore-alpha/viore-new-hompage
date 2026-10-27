/* eslint-disable @next/next/no-img-element -- Decorative product mark inside the motion scene. */
import { ArrowUp, BookOpen, Check, ChevronDown, ClipboardList, Copy, MousePointer2, Plus, RotateCcw, Star, X } from "lucide-react";
import type { Language } from "@/app/site-content";
import { ViewportMotion } from "@/app/components/ViewportMotion";
import { A2Pill, A2Sidebar, A2Topbar, a2Labels } from "@/app/components/alphadoc2/kit";

/* M4 · "놓치지 않는 근거". Scope menu → 사내 게시판 → question → answer with sentence-end pills →
   pill preview card → "출처 2" opens the source panel. One 10.6s cycle. Keyframe 0% is the empty
   conversation; the default (non-animated) state is the final view with the source panel open. */

const evidenceCopy = {
  ko: {
    emptyTitle: "무엇을 확인할까요?",
    scopeAll: "자료",
    scopeBoard: "자료: 사내 게시판",
    menuTitle: "참조 범위",
    options: [
      ["전체 자료", "바이오레 문헌·지침·공지, 기관 문서, 사내 게시판, 내 자료와 조직에 공유된 자료"],
      ["바이오레 자료", "문헌, 의료 지침, 의료 공식 공지"],
      ["내 자료", "내가 쓰거나 올린 문서와 노트, 조직에 공유된 자료"],
      ["사내 게시판", "사내 소식, 자료 공유, 업무 논의"],
    ],
    role: "임상운영팀 · CRA",
    question: "임상시험 중 중대한 이상사례는 언제까지 보고해야 해?",
    answerTitle: "시험자는 알게 된 뒤 24시간 안에 보고합니다",
    answer: [
      "시험자는 중대한 이상사례를 알게 된 뒤 24시간 안에 의뢰자에게 보고합니다.",
      "예상하지 못한 중대한 약물이상반응은 의뢰자가 식약처에 보고하며, 사망이나 생명 위협은 7일, 그 밖의 경우는 15일 이내입니다.",
    ],
    boardPill: "이상사례 보고 SOP",
    secondPill: "안전성 정보 관리 지침",
    peekType: "사내 게시판 · 임상운영",
    peekTitle: "이상사례 보고 SOP",
    peekMeta: "임상운영팀 · 2일 전",
    peekQuote: ["시험자는 중대한 이상사례를 인지한 때부터 ", "24시간 이내에 의뢰자에게 보고", "한다."],
    sources: "출처 2",
    panelTitle: "출처 2",
    panelGroup: "사내 게시판 2",
    panelItems: [
      ["이상사례 보고 SOP", "임상운영팀 · 2일 전"],
      ["안전성 정보 관리 지침", "약물감시팀 · 1주 전"],
    ],
  },
  en: {
    emptyTitle: "What should we check?",
    scopeAll: "Sources",
    scopeBoard: "Sources: Internal board",
    menuTitle: "Search scope",
    options: [
      ["All materials", "Viore literature, guidelines and notices, institution documents, the internal board, your files and shared files"],
      ["Viore materials", "Literature, medical guidelines, official notices"],
      ["My materials", "Documents and notes you wrote or uploaded, plus shared files"],
      ["Internal board", "News, shared materials, discussions"],
    ],
    role: "Clinical operations · CRA",
    question: "When do we report a serious adverse event in a trial?",
    answerTitle: "Investigators report within 24 hours",
    answer: [
      "Investigators report a serious adverse event to the sponsor within 24 hours of learning about it.",
      "The sponsor reports unexpected serious adverse drug reactions to the MFDS: within 7 days for deaths or life-threatening cases, and within 15 days for all others.",
    ],
    boardPill: "SAE reporting SOP",
    secondPill: "Safety information policy",
    peekType: "Internal board · Clinical operations",
    peekTitle: "SAE reporting SOP",
    peekMeta: "Clinical operations · 2 days ago",
    peekQuote: ["Investigators ", "report serious adverse events to the sponsor within 24 hours", " of becoming aware of them."],
    sources: "2 sources",
    panelTitle: "2 sources",
    panelGroup: "Internal board 2",
    panelItems: [
      ["SAE reporting SOP", "Clinical operations · 2 days ago"],
      ["Safety information policy", "Pharmacovigilance · 1 week ago"],
    ],
  },
} as const;

function Pointer({ className }: { className: string }) {
  return (
    <span className={`a2e-ptr ${className} a2-anim`}>
      <MousePointer2 aria-hidden="true" strokeWidth={1.6} />
    </span>
  );
}

export function AlphadocV2EvidenceMotion({ language, label }: { language: Language; label: string }) {
  const copy = evidenceCopy[language];
  const labels = a2Labels[language];

  return (
    <ViewportMotion className="a2-stage a2-evidence" role="img" ariaLabel={label} threshold={0.18}>
      <div className="a2" aria-hidden="true">
        <div className="a2-app">
          <A2Sidebar language={language} active="chat" role={copy.role} />
          <div className="a2-main">
            <A2Topbar language={language} crumbs={[labels.newChat]} />

            <div className="a2e-thread">
              <div className="a2e-empty a2-anim">
                <img src="/brand/alphadoc-alpha.png" alt="" width="419" height="365" />
                <p>{copy.emptyTitle}</p>
              </div>
              <div className="a2e-thread-inner a2-anim">
                <div className="a2-bubble a2e-bubble a2-anim">{copy.question}</div>
                <div className="a2e-reply">
                  <span className="a2e-think a2-anim"><i /><i /><i /></span>
                  <div className="a2-answer">
                    <div className="a2e-ans-a a2-anim">
                      <h4>{copy.answerTitle}</h4>
                      <p className="a2e-p1">
                        {copy.answer[0]}
                        <span className="a2e-pill-wrap">
                          <A2Pill kind="board" label={copy.boardPill} className="a2e-pill-board a2-anim" />
                          <Pointer className="a2e-ptr-pill" />
                        </span>
                        <span className="a2e-peek a2-anim">
                          <span className="a2e-peek-type"><ClipboardList aria-hidden="true" strokeWidth={1.8} />{copy.peekType}</span>
                          <strong>{copy.peekTitle}</strong>
                          <small>{copy.peekMeta}</small>
                          <span className="a2e-peek-quote">
                            {copy.peekQuote[0]}<mark>{copy.peekQuote[1]}</mark>{copy.peekQuote[2]}
                          </span>
                        </span>
                      </p>
                    </div>
                    <p className="a2e-ans-b a2-anim">
                      {copy.answer[1]}
                      <A2Pill kind="board" label={copy.secondPill} />
                    </p>
                    <div className="a2-answer-actions a2e-actions a2-anim">
                      <Copy aria-hidden="true" strokeWidth={1.8} />
                      <Star aria-hidden="true" strokeWidth={1.8} />
                      <RotateCcw aria-hidden="true" strokeWidth={1.8} />
                      <span className="a2e-count-wrap">
                        <span className="a2-source-count a2e-count a2-anim">
                          <ClipboardList aria-hidden="true" strokeWidth={1.8} />
                          {copy.sources}
                        </span>
                        <Pointer className="a2e-ptr-count" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="a2e-dock">
              <div className="a2-composer a2e-composer a2-anim">
                <div className="a2-composer-text">
                  <span className="a2-placeholder a2e-ph a2-anim">{labels.placeholder}</span>
                  <span className="a2e-typed a2-anim">{copy.question}</span>
                </div>
                <div className="a2-composer-row">
                  <span className="a2-icon-btn"><Plus aria-hidden="true" strokeWidth={1.8} /></span>
                  <span className="a2e-scope-wrap">
                    <span className="a2-scope a2e-scope a2-anim">
                      <BookOpen aria-hidden="true" strokeWidth={1.8} />
                      <span className="a2e-scope-labels">
                        <span className="a2e-scope-all a2-anim">{copy.scopeAll}<ChevronDown aria-hidden="true" strokeWidth={1.8} /></span>
                        <span className="a2e-scope-board a2-anim">{copy.scopeBoard}<ChevronDown aria-hidden="true" strokeWidth={1.8} /></span>
                      </span>
                    </span>
                    <Pointer className="a2e-ptr-scope" />
                  </span>
                  <span className="a2-send a2e-send a2-anim"><ArrowUp aria-hidden="true" strokeWidth={2.2} /></span>
                </div>

                <div className="a2e-menu a2-anim">
                  <p className="a2e-menu-title">{copy.menuTitle}</p>
                  {copy.options.map(([title, description], index) => (
                    <span key={title} className={`a2e-opt${index === 3 ? " a2e-opt-board a2-anim" : ""}`}>
                      <span className={`a2e-check${index === 0 ? " a2e-check-all a2-anim" : index === 3 ? " a2e-check-board a2-anim" : " is-empty"}`}>
                        <Check aria-hidden="true" strokeWidth={2.2} />
                      </span>
                      <span className="a2e-opt-copy">
                        <strong>{title}</strong>
                        <small>{description}</small>
                      </span>
                      {index === 3 ? <Pointer className="a2e-ptr-opt" /> : null}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <aside className="a2-panel a2e-panel a2-anim">
              <div className="a2-panel-head">
                <span>{copy.panelTitle}</span>
                <X className="a2-close" aria-hidden="true" strokeWidth={1.8} />
              </div>
              <div className="a2e-panel-body">
                <div className="a2e-panel-group">
                  <p>{copy.panelGroup}</p>
                  {copy.panelItems.map(([title, meta]) => (
                    <span key={title} className="a2e-panel-item">
                      <ClipboardList aria-hidden="true" strokeWidth={1.8} />
                      <span>
                        <strong>{title}</strong>
                        <small>{meta}</small>
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </ViewportMotion>
  );
}
