import { ArrowDownToLine, Check, ClipboardList, FileText, SquarePen } from "lucide-react";
import { ViewportMotion } from "@/app/components/ViewportMotion";
import type { Language } from "@/app/site-content";

/* Home note-writing scene (M1-b): a meeting note on the left, the Alphadoc pane on the right.
   Alphadoc sorts the note into decisions and to-dos with sources, then the result is added
   to the end of the note. Matches the 2.0 mockup's new-note screen (CHG-049) in the home
   chapter's line style. Example data is neutral. */

const copy = {
  ko: {
    label: "회의록 노트 옆 알파닥 창에 정리를 맡기면 결정 사항과 할 일이 출처와 함께 정리되고, 노트 끝에 들어가는 예시",
    noteTitle: "주간 회의록",
    noteLines: ["손 위생 지침 v3 교육 일정", "신규 직원 온보딩 자료 정리", "필독 확인 현황 점검"],
    agent: "알파닥",
    request: "사내 자료와 내 노트를 바탕으로 결정 사항과 할 일을 정리해 줘",
    decisions: "결정 사항",
    decisionItems: [
      ["지침 v3를 사내 게시판 필독으로 게시", "board", "사내 게시판"],
      ["교육은 부서별 1회 진행", "note", "내 노트"],
    ],
    todos: "할 일",
    todoItems: ["교육 자료 초안 작성", "필독 확인 현황 점검"],
    insert: "노트 끝에 넣기",
    inserted: "결정 사항 2 · 할 일 2",
  },
  en: {
    label: "In a meeting note, Alphadoc sorts decisions and to-dos with their sources in the side panel, then adds them to the end of the note",
    noteTitle: "Weekly meeting notes",
    noteLines: ["Hand hygiene guideline v3 training", "New staff onboarding materials", "Must-read confirmation status"],
    agent: "Alphadoc",
    request: "Using our internal documents and my notes, sort out decisions and to-dos",
    decisions: "Decisions",
    decisionItems: [
      ["Post guideline v3 as a must-read", "board", "Internal board"],
      ["One session per department", "note", "My notes"],
    ],
    todos: "To-dos",
    todoItems: ["Draft the training materials", "Check must-read confirmations"],
    insert: "Add to end of note",
    inserted: "Decisions 2 · To-dos 2",
  },
} as const;

export function CompanyNoteMotion({ language }: { language: Language }) {
  const text = copy[language];

  return (
    <ViewportMotion className="company-note-motion" role="img" ariaLabel={text.label} threshold={0.25}>
      <div className="company-note-window" aria-hidden="true">
        <div className="company-note-doc">
          <span className="company-note-doc-head"><SquarePen strokeWidth={1.7} />{text.noteTitle}</span>
          <ul className="company-note-lines">
            {text.noteLines.map((line) => <li key={line}>{line}</li>)}
          </ul>
          <div className="company-note-inserted company-note-anim">
            <strong>{text.inserted}</strong>
            <span>{text.decisionItems[0][0]}</span>
            <span>{text.todoItems[0]}</span>
          </div>
        </div>

        <div className="company-note-agent">
          <span className="company-note-agent-head">{text.agent}</span>
          <p className="company-note-request company-note-anim">{text.request}</p>
          <div className="company-note-answer company-note-anim">
            <strong>{text.decisions}</strong>
            <ul>
              {text.decisionItems.map(([item, kind, source]) => (
                <li key={item}>
                  <span>{item}</span>
                  <span className="company-note-pill">
                    {kind === "board" ? <ClipboardList strokeWidth={1.8} /> : <FileText strokeWidth={1.8} />}
                    {source}
                  </span>
                </li>
              ))}
            </ul>
            <strong>{text.todos}</strong>
            <ul>
              {text.todoItems.map((item) => (
                <li key={item} className="is-todo"><Check strokeWidth={2} />{item}</li>
              ))}
            </ul>
          </div>
          <span className="company-note-insert company-note-anim">
            <ArrowDownToLine strokeWidth={1.8} />
            {text.insert}
          </span>
        </div>
      </div>
    </ViewportMotion>
  );
}
