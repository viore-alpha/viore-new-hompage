/* eslint-disable @next/next/no-img-element -- Decorative product mark inside the motion scene. */
import { ArrowUp, Check, FileText, Info, MousePointer2, Plus, X } from "lucide-react";
import { ViewportMotion } from "@/app/components/ViewportMotion";
import { A2Sidebar, A2Topbar } from "@/app/components/alphadoc2/kit";
import type { Language } from "@/app/site-content";

/* Home note scene, drawn from the 2.0 mockup's new-note screen (CHG-049): a meeting note in the
   editor, the Alphadoc pane open on the right (the same pane as the papers screen). The question is
   typed into the pane, Alphadoc sorts the note into decisions and next steps, and "노트 끝에 넣기"
   adds an "알파닥 정리" block to the end of the note. One 9.2s cycle. Keyframe 0% is the empty pane;
   the default (non-animated) state is the final view, which is what reduced motion shows.
   Example data is neutral: made-up names, no institution names or types, no dates. */

const copy = {
  ko: {
    label: "의학부 회의록 노트 옆 알파닥 창에 정리를 맡기면 결정 사항과 다음 할 일이 정리되고, 노트 끝에 알파닥 정리로 들어가는 예시",
    role: "의학부 · 메디컬 어드바이저",
    crumb: "새 노트",
    title: "의학부 주간 회의록",
    info: ["문서 정보", "나만 보기", "#회의록", "#자문위원회", "수정 방금"],
    meta: ["일시: 화요일 10:00–11:00 · 장소: 본사 7층 회의실", "참석: 의학부 김지원, 임상개발팀 박서연, 약물감시팀 이준호"],
    agendaTitle: "안건",
    agenda: ["자문위원 회의 질문지 초안 검토", "경쟁 약제 3상 결과 문헌 정리", "학술 문의 응답 템플릿 개정"],
    findingsTitle: "확인한 내용",
    findings: [
      "질문지 초안 12문항 가운데 1차 평가변수와 직접 관련된 문항은 5개다.",
      "경쟁 약제 3상 결과는 학회 초록만 공개됐고, 논문은 아직 나오지 않았다.",
      "응답 템플릿에 허가 사항 외 사용 문의를 안내하는 문구가 없다.",
    ],
    callout: "주의: 초록 수치만으로 두 약제의 효과를 나란히 비교하지 않는다.",
    insertedTitle: "알파닥 정리",
    paneTitle: "알파닥",
    emptyTitle: "이 노트에 대해 알파닥에게 물어보세요",
    emptyBody: "노트 내용을 고르거나 바로 질문을 입력하세요.",
    placeholder: "이 노트에 대해 알파닥에게 물어보세요",
    question: "이 회의록을 결정 사항과 다음 할 일로 정리해 주세요",
    questionLines: ["이 회의록을 결정 사항과", "다음 할 일로 정리해 주세요"],
    answerLead: "회의록을 결정 사항과 다음 할 일로 정리했어요.",
    decisionsTitle: "결정 사항",
    decisions: [
      "자문위원 질문지는 1차 평가변수와 관련된 5문항을 중심으로 확정한다.",
      "응답 템플릿에 허가 사항 외 사용 문의 안내를 넣고, 의학부 검토 뒤 사내 게시판에 올린다.",
    ],
    todosTitle: "다음 할 일",
    todos: ["경쟁 약제 3상 논문 게재 여부 확인", "자문위원 회의 일정 확정"],
    note: "경쟁 약제 결과는 학회 초록 기준이에요. 논문이 나오면 1차 평가변수 수치를 다시 확인하세요.",
    refs: "참고: 학술 문의 응답 SOP (사내 게시판)",
    insert: "노트 끝에 넣기",
    insertedButton: "노트에 넣었어요",
    scope: "현재 노트 · 회의록",
    send: "질문 보내기",
  },
  en: {
    label: "In a medical affairs meeting note, Alphadoc in the side pane sorts the minutes into decisions and next steps, then adds them to the end of the note as an Alphadoc summary",
    role: "Medical affairs · Medical advisor",
    crumb: "New note",
    title: "Medical affairs weekly minutes",
    info: ["Details", "Only me", "#minutes", "#advisory-board", "Edited just now"],
    meta: ["When: Tuesday 10:00–11:00 · Where: HQ, 7th floor", "Attendees: Jiwon Kim (Medical affairs), Seoyeon Park (Clinical development), Junho Lee (Pharmacovigilance)"],
    agendaTitle: "Agenda",
    agenda: ["Advisory board question draft", "Competitor phase 3 literature", "Medical inquiry response template"],
    findingsTitle: "What we found",
    findings: [
      "5 of the 12 draft questions relate directly to the primary endpoint.",
      "Competitor phase 3 results are out only as a congress abstract. The paper isn't published yet.",
      "The response template has no guidance for off-label inquiries.",
    ],
    callout: "Note: don't compare the two drugs side by side on abstract numbers alone.",
    insertedTitle: "Alphadoc summary",
    paneTitle: "Alphadoc",
    emptyTitle: "Ask Alphadoc about this note",
    emptyBody: "Select part of the note, or just type a question.",
    placeholder: "Ask Alphadoc about this note",
    question: "Sort these minutes into decisions and next steps",
    questionLines: ["Sort these minutes into", "decisions and next steps"],
    answerLead: "I sorted the minutes into decisions and next steps.",
    decisionsTitle: "Decisions",
    decisions: [
      "Finalize the advisory board questions around the 5 primary-endpoint items.",
      "Add off-label inquiry guidance to the template, and post it on the internal board after medical review.",
    ],
    todosTitle: "Next steps",
    todos: ["Check whether the competitor phase 3 paper is out", "Confirm the advisory board date"],
    note: "The competitor results come from the congress abstract. Recheck the primary endpoint once the paper is out.",
    refs: "Source: Medical inquiry SOP (internal board)",
    insert: "Add to end of note",
    insertedButton: "Added to note",
    scope: "This note · Minutes",
    send: "Send",
  },
} as const;

export function CompanyNoteMotion({ language }: { language: Language }) {
  const text = copy[language];

  return (
    <ViewportMotion className="a2-stage a2-note company-note-motion" role="img" ariaLabel={text.label} threshold={0.2}>
      <div className="a2" aria-hidden="true">
        <div className="a2-app">
          <A2Sidebar language={language} active="note" role={text.role} />
          <div className="a2-main">
            <A2Topbar language={language} crumbs={[text.crumb, text.title]} />
            <div className="a2n-split">
              <section className="a2n-editor">
                <div className="a2n-doc a2-anim">
                  <h4 className="a2n-title">{text.title}</h4>
                  <p className="a2n-info">
                    <span>›&nbsp;{text.info[0]}</span>
                    {text.info.slice(1).map((item) => <span key={item}>{item}</span>)}
                  </p>
                  {text.meta.map((line) => <p key={line} className="a2n-meta">{line}</p>)}
                  <h5>{text.agendaTitle}</h5>
                  <ol className="a2n-ol">
                    {text.agenda.map((item) => <li key={item}>{item}</li>)}
                  </ol>
                  <h5>{text.findingsTitle}</h5>
                  <ul className="a2n-ul">
                    {text.findings.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <p className="a2n-callout"><Info strokeWidth={1.8} /><span>{text.callout}</span></p>
                  <div className="a2n-inserted a2-anim">
                    <h5>{text.insertedTitle}</h5>
                    <ul className="a2n-ul">
                      {text.decisions.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <ul className="a2n-todos">
                      {text.todos.map((item) => <li key={item}><span className="a2n-box" />{item}</li>)}
                    </ul>
                  </div>
                </div>
              </section>

              <aside className="a2-panel a2n-pane">
                <div className="a2-panel-head">
                  <img src="/brand/alphadoc-alpha.png" alt="" width="419" height="365" />
                  <span>{text.paneTitle}</span>
                  <X className="a2-close" strokeWidth={1.8} />
                </div>
                <p className="a2n-pane-note"><FileText strokeWidth={1.8} /><span>{text.title}</span></p>
                <div className="a2n-pane-scroll">
                  <div className="a2n-empty a2-anim">
                    <img src="/brand/alphadoc-alpha.png" alt="" width="419" height="365" />
                    <strong>{text.emptyTitle}</strong>
                    <span>{text.emptyBody}</span>
                  </div>
                  <div className="a2n-convo">
                    <p className="a2-bubble a2n-question a2-anim">{text.question}</p>
                    <span className="a2n-thinking a2-anim"><i /><i /><i /></span>
                    <div className="a2n-answer">
                      <p className="a2n-agent a2n-step-1 a2-anim">
                        <img src="/brand/alphadoc-alpha.png" alt="" width="419" height="365" />
                        {text.paneTitle}
                      </p>
                      <p className="a2n-step-1 a2-anim">{text.answerLead}</p>
                      <div className="a2n-step-2 a2-anim">
                        <strong>{text.decisionsTitle}</strong>
                        <ul>{text.decisions.map((item) => <li key={item}>{item}</li>)}</ul>
                      </div>
                      <div className="a2n-step-3 a2-anim">
                        <strong>{text.todosTitle}</strong>
                        <ul>{text.todos.map((item) => <li key={item}>{item}</li>)}</ul>
                      </div>
                      <div className="a2n-step-4 a2-anim">
                        <p className="a2n-box-note">{text.note}</p>
                        <p className="a2n-refs">{text.refs}</p>
                        <span className="a2n-insert-wrap">
                          <span className="a2n-insert a2n-insert-before a2-anim"><Plus strokeWidth={2} />{text.insert}</span>
                          <span className="a2n-insert a2n-insert-after a2-anim"><Check strokeWidth={2} />{text.insertedButton}</span>
                          <span className="a2n-ptr a2-anim"><MousePointer2 strokeWidth={1.6} /></span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="a2n-composer">
                  <div className="a2n-input">
                    <span className="a2n-placeholder a2-anim">{text.placeholder}</span>
                    <span className="a2n-typed a2-anim">
                      <span className="a2n-typed-line a2n-type-1 a2-anim">{text.questionLines[0]}</span>
                      <span className="a2n-typed-line a2n-type-2 a2-anim">{text.questionLines[1]}</span>
                    </span>
                  </div>
                  <div className="a2n-row">
                    <span className="a2-badge">{text.scope}</span>
                    <span className="a2-button is-primary a2n-send a2-anim">
                      <ArrowUp strokeWidth={2.2} />
                      {text.send}
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
