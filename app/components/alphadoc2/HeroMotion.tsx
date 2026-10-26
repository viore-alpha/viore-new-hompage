import { AtSign, BookOpen, BookText, ClipboardList, Copy, FileText, RotateCcw, Star } from "lucide-react";
import type { Language } from "@/app/site-content";
import { ViewportMotion } from "@/app/components/ViewportMotion";
import { A2Composer, A2Pill, A2Sidebar, A2Topbar, a2Labels, type A2SourceKind } from "@/app/components/alphadoc2/kit";

/* M2 · Product hero. Home → @ picks a board guideline → question → document-style answer with sources.
   One 16s cycle. Keyframe 0% is the home screen; the default (non-animated) state is the final answer,
   which is what reduced motion shows. */

type Row = { title: string; kind: A2SourceKind; badge: string; badgeTone?: "green"; when: string };
type Option = { label: string; tag: string; kind: A2SourceKind; first?: boolean; target?: boolean };
type Group = { label: string; options: readonly Option[] };

const heroCopy = {
  ko: {
    homeCrumb: "홈",
    greeting: "김지원님, 안녕하세요.",
    sub: "질문하면 보관한 문헌과 노트를 근거로 답합니다.",
    mentionSearch: "페이지, 문서, 게시글, 문헌 찾기",
    groups: [
      {
        label: "내 노트",
        options: [
          { label: "신규 직원 교육 메모", tag: "최근", kind: "note", first: true },
          { label: "주간 회의록 정리", tag: "최근", kind: "note" },
        ],
      },
      { label: "사내 게시판", options: [{ label: "손 위생 지침 v3", tag: "감염관리", kind: "board", target: true }] },
      { label: "바이오레 지침", options: [{ label: "WHO 손 위생 지침", tag: "의료 지침", kind: "guideline" }] },
      { label: "바이오레 문헌", options: [{ label: "병원 전체 손 위생 개선 프로그램", tag: "문헌", kind: "paper" }] },
    ] satisfies readonly Group[],
    chip: "손 위생 지침 v3",
    question: "이 지침에서 바뀐 손 위생 기준을 표로 정리해 줘",
    listTitle: "이어서 살펴보기",
    listAll: "모두 보기",
    listHead: ["이름", "분류", "마지막 확인"],
    rows: [
      { title: "신규 직원 교육 메모", kind: "note", badge: "내 노트", when: "오늘" },
      { title: "손 위생 지침 v3", kind: "board", badge: "사내 게시판", badgeTone: "green", when: "어제" },
      { title: "WHO 손 위생 지침 요약", kind: "guideline", badge: "의료 지침", when: "2일 전" },
    ] satisfies readonly Row[],
    answerTitle: "손 위생 지침 v3에서 바뀐 기준",
    answerLead: ["v3는 손 위생이 필요한 시점을 다섯 가지로 나누고, 장갑을 벗은 뒤에도 손 위생을 하도록 바꿨습니다.", "다섯 시점 구분은 WHO 지침과 같습니다."],
    tableTitle: "바뀐 항목",
    tableHead: ["항목", "이전 (v2)", "개정 (v3)"],
    tableRows: [
      ["손 위생 시점", "환자 접촉 전후", "다섯 시점으로 구분", "board"],
      ["장갑 사용", "착용하면 생략", "벗은 뒤 손 위생", "guideline"],
      ["교육", "연 1회", "입사 첫 달 안에", "note"],
    ] as const,
    pills: { board: "손 위생 지침 v3", guideline: "WHO 손 위생 지침", note: "신규 직원 교육 메모" },
    sources: "출처 3",
  },
  en: {
    homeCrumb: "Home",
    greeting: "Hi, Jiwon.",
    sub: "Ask a question. Alphadoc answers from your saved literature and notes.",
    mentionSearch: "Find pages, documents, posts, literature",
    groups: [
      {
        label: "My notes",
        options: [
          { label: "New staff training memo", tag: "Recent", kind: "note", first: true },
          { label: "Weekly meeting notes", tag: "Recent", kind: "note" },
        ],
      },
      { label: "Internal board", options: [{ label: "Hand hygiene guideline v3", tag: "Infection control", kind: "board", target: true }] },
      { label: "Viore guidelines", options: [{ label: "WHO hand hygiene guideline", tag: "Guideline", kind: "guideline" }] },
      { label: "Viore literature", options: [{ label: "Hospital-wide hand hygiene programme", tag: "Paper", kind: "paper" }] },
    ] satisfies readonly Group[],
    chip: "Hand hygiene guideline v3",
    question: "Show what changed in this guideline as a table",
    listTitle: "Pick up where you left off",
    listAll: "See all",
    listHead: ["Name", "Type", "Last opened"],
    rows: [
      { title: "New staff training memo", kind: "note", badge: "My notes", when: "Today" },
      { title: "Hand hygiene guideline v3", kind: "board", badge: "Internal board", badgeTone: "green", when: "Yesterday" },
      { title: "WHO hand hygiene guideline summary", kind: "guideline", badge: "Guideline", when: "2 days ago" },
    ] satisfies readonly Row[],
    answerTitle: "What changed in Hand hygiene guideline v3",
    answerLead: ["v3 splits the moments for hand hygiene into five and adds hand hygiene after removing gloves.", "The five moments match the WHO guideline."],
    tableTitle: "Changes",
    tableHead: ["Item", "Before (v2)", "Revised (v3)"],
    tableRows: [
      ["When", "Before and after patient contact", "Five moments", "board"],
      ["Gloves", "Skipped when gloved", "After removing gloves", "guideline"],
      ["Training", "Once a year", "Within the first month", "note"],
    ] as const,
    pills: { board: "Hand hygiene v3", guideline: "WHO guideline", note: "Training memo" },
    sources: "3 sources",
  },
} as const;

const optionIcons = { note: FileText, board: ClipboardList, guideline: BookOpen, paper: BookText } as const;

export function AlphadocV2HeroMotion({ language, label }: { language: Language; label: string }) {
  const copy = heroCopy[language];
  const labels = a2Labels[language];

  return (
    <ViewportMotion className="a2-stage a2-hero" role="img" ariaLabel={label} threshold={0.18}>
      <div className="a2" aria-hidden="true">
        <div className="a2-app">
          <A2Sidebar language={language} active="home" />
          <div className="a2-main">
            <section className="a2h-screen a2h-home a2-anim">
              <A2Topbar language={language} crumbs={[copy.homeCrumb]} />
              <div className="a2h-home-body">
                <div className="a2h-home-inner">
                  <p className="a2h-greeting">{copy.greeting}</p>
                  <p className="a2h-sub">{copy.sub}</p>
                  <div className="a2h-compose-wrap">
                    <A2Composer language={language} sendClassName="a2h-send a2-anim">
                      <span className="a2h-compose-line">
                        <span className="a2h-ph a2-anim">{labels.placeholder}</span>
                        <span className="a2h-at a2-anim">@</span>
                        <span className="a2-chip a2h-chip a2-anim"><ClipboardList aria-hidden="true" strokeWidth={1.8} />{copy.chip}</span>
                        <span className="a2h-typed a2-anim">{copy.question}</span>
                      </span>
                    </A2Composer>
                    <div className="a2h-mention a2-anim">
                      <div className="a2h-mention-search">
                        <AtSign aria-hidden="true" strokeWidth={1.8} />
                        <span>{copy.mentionSearch}</span>
                      </div>
                      {copy.groups.map((group) => (
                        <div key={group.label} className="a2h-mention-group">
                          <p className="a2h-mention-label">{group.label}</p>
                          {group.options.map((option) => {
                            const Icon = optionIcons[option.kind];
                            const state = "target" in option && option.target
                              ? " a2h-opt-target a2-anim"
                              : "first" in option && option.first ? " a2h-opt-first a2-anim" : "";
                            return (
                              <span key={option.label} className={`a2h-opt${state}`}>
                                <Icon aria-hidden="true" strokeWidth={1.8} />
                                <span className="a2h-opt-label">{option.label}</span>
                                <small>{option.tag}</small>
                              </span>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="a2h-list">
                    <div className="a2h-list-title">
                      <strong>{copy.listTitle} <span>{copy.rows.length}</span></strong>
                      <span>{copy.listAll}</span>
                    </div>
                    <div className="a2h-list-row is-head">
                      {copy.listHead.map((cell) => <span key={cell}>{cell}</span>)}
                    </div>
                    {copy.rows.map((row) => {
                      const Icon = optionIcons[row.kind];
                      return (
                        <div key={row.title} className="a2h-list-row">
                          <span className="a2h-list-name"><Icon aria-hidden="true" strokeWidth={1.8} />{row.title}</span>
                          <span><span className={`a2-badge${"badgeTone" in row ? " is-green" : ""}`}>{row.badge}</span></span>
                          <span className="a2-muted">{row.when}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="a2h-screen a2h-chat a2-anim">
              <A2Topbar language={language} crumbs={[labels.newChat, copy.question]} />
              <div className="a2h-thread">
                <div className="a2h-thread-inner">
                  <div className="a2-bubble a2h-bubble a2-anim">
                    <span className="a2-chip"><ClipboardList aria-hidden="true" strokeWidth={1.8} />{copy.chip}</span>{" "}
                    {copy.question}
                  </div>
                  <div className="a2h-reply">
                    <span className="a2h-think a2-anim"><i /><i /><i /></span>
                    <div className="a2-answer">
                      <div className="a2h-ans-a a2-anim">
                        <h4>{copy.answerTitle}</h4>
                        <p>
                          {copy.answerLead[0]}
                          <A2Pill kind="board" label={copy.pills.board} />{" "}
                          {copy.answerLead[1]}
                          <A2Pill kind="guideline" label={copy.pills.guideline} more={1} />
                        </p>
                      </div>
                      <div className="a2h-ans-b a2-anim">
                        <h5>{copy.tableTitle}</h5>
                        <table className="a2-table">
                          <thead>
                            <tr>{copy.tableHead.map((cell) => <th key={cell}>{cell}</th>)}</tr>
                          </thead>
                          <tbody>
                            {copy.tableRows.map(([item, before, after, kind], index) => (
                              <tr key={item} className={`a2h-tr a2h-tr-${index + 1} a2-anim`}>
                                <td>{item}</td>
                                <td className="a2-muted">{before}</td>
                                <td>{after}<A2Pill kind={kind} label={copy.pills[kind]} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="a2-answer-actions a2h-actions a2-anim">
                        <Copy aria-hidden="true" strokeWidth={1.8} />
                        <Star aria-hidden="true" strokeWidth={1.8} />
                        <RotateCcw aria-hidden="true" strokeWidth={1.8} />
                        <span className="a2-source-count">
                          <span className="a2h-source-icons">
                            <ClipboardList aria-hidden="true" strokeWidth={1.8} />
                            <BookOpen aria-hidden="true" strokeWidth={1.8} />
                            <FileText aria-hidden="true" strokeWidth={1.8} />
                          </span>
                          {copy.sources}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="a2h-chat-compose">
                <A2Composer language={language} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </ViewportMotion>
  );
}
