import { AtSign, BookOpen, BookText, ClipboardList, Copy, FileText, RotateCcw, Star } from "lucide-react";
import type { Language } from "@/app/site-content";
import { ViewportMotion } from "@/app/components/ViewportMotion";
import { A2Composer, A2Pill, A2Sidebar, A2Topbar, a2Labels, type A2SourceKind } from "@/app/components/alphadoc2/kit";

/* M2 · Product hero. Home → @ picks a board guideline → question → document-style answer with sources.
   One 11s cycle. Keyframe 0% is the home screen; the default (non-animated) state is the final answer,
   which is what reduced motion shows. */

type Row = { title: string; kind: A2SourceKind; badge: string; badgeTone?: "green"; when: string };
type Option = { label: string; tag: string; kind: A2SourceKind; first?: boolean; target?: boolean };
type Group = { label: string; options: readonly Option[] };

const heroCopy = {
  ko: {
    role: "약제부 · 약사",
    homeCrumb: "홈",
    greeting: "김지원님, 안녕하세요.",
    sub: "질문하면 보관한 문헌과 노트를 근거로 답합니다.",
    mentionSearch: "페이지, 문서, 게시글, 문헌 찾기",
    groups: [
      {
        label: "내 노트",
        options: [
          { label: "약제위원회 회의록", tag: "최근", kind: "note", first: true },
          { label: "반코마이신 TDM 메모", tag: "최근", kind: "note" },
        ],
      },
      { label: "사내 게시판", options: [{ label: "항생제 사용 지침 개정안", tag: "약제부", kind: "board", target: true }] },
      { label: "바이오레 지침", options: [{ label: "수술 예방 항생제 국제 지침", tag: "의료 지침", kind: "guideline" }] },
      { label: "바이오레 문헌", options: [{ label: "반코마이신 TDM 개정 합의문", tag: "문헌", kind: "paper" }] },
    ] satisfies readonly Group[],
    chip: "항생제 사용 지침 개정안",
    question: "현행 지침과 비교해서 바뀐 기준을 표로 정리해 줘",
    listTitle: "이어서 살펴보기",
    listAll: "모두 보기",
    listHead: ["이름", "분류", "마지막 확인"],
    rows: [
      { title: "약제위원회 회의록", kind: "note", badge: "내 노트", when: "오늘" },
      { title: "항생제 사용 지침 개정안", kind: "board", badge: "사내 게시판", badgeTone: "green", when: "어제" },
      { title: "수술 예방 항생제 국제 지침 요약", kind: "guideline", badge: "의료 지침", when: "2일 전" },
    ] satisfies readonly Row[],
    answerTitle: "항생제 사용 지침 개정안에서 바뀐 기준",
    answerLead: [
      "개정안은 수술 예방 항생제의 투여 시점과 기간을 국제 지침에 맞추고, 반코마이신 혈중농도 관리를 AUC 기준으로 바꿨습니다.",
      "투여를 수술 후 24시간 안에 끝내는 것은 국제 지침의 권고와 같습니다.",
    ],
    tableTitle: "바뀐 항목",
    tableHead: ["항목", "현행", "개정안"],
    tableRows: [
      ["예방 항생제 투여", "절개 전 2시간 이내", "절개 전 60분 이내", "guideline"],
      ["예방 항생제 기간", "수술 후 72시간", "24시간 이내 중단", "guideline"],
      ["반코마이신 모니터링", "최저농도 15–20 mg/L", "AUC 400–600", "paper"],
    ] as const,
    pills: { board: "항생제 지침 개정안", guideline: "수술 예방 국제 지침", paper: "반코마이신 TDM 합의문" },
    sources: "출처 3",
  },
  en: {
    role: "Pharmacy · Pharmacist",
    homeCrumb: "Home",
    greeting: "Hi, Jiwon.",
    sub: "Ask a question. Alphadoc answers from your saved literature and notes.",
    mentionSearch: "Find pages, documents, posts, literature",
    groups: [
      {
        label: "My notes",
        options: [
          { label: "P&T committee minutes", tag: "Recent", kind: "note", first: true },
          { label: "Vancomycin TDM memo", tag: "Recent", kind: "note" },
        ],
      },
      { label: "Internal board", options: [{ label: "Antibiotic policy revision", tag: "Pharmacy", kind: "board", target: true }] },
      { label: "Viore guidelines", options: [{ label: "Surgical prophylaxis guideline", tag: "Guideline", kind: "guideline" }] },
      { label: "Viore literature", options: [{ label: "Vancomycin TDM consensus", tag: "Paper", kind: "paper" }] },
    ] satisfies readonly Group[],
    chip: "Antibiotic policy revision",
    question: "Compare it with the current policy in a table",
    listTitle: "Pick up where you left off",
    listAll: "See all",
    listHead: ["Name", "Type", "Last opened"],
    rows: [
      { title: "P&T committee minutes", kind: "note", badge: "My notes", when: "Today" },
      { title: "Antibiotic policy revision", kind: "board", badge: "Internal board", badgeTone: "green", when: "Yesterday" },
      { title: "Surgical prophylaxis guideline summary", kind: "guideline", badge: "Guideline", when: "2 days ago" },
    ] satisfies readonly Row[],
    answerTitle: "What the antibiotic policy revision changes",
    answerLead: [
      "The revision aligns surgical prophylaxis timing and duration with international guidance, and moves vancomycin monitoring to AUC targets.",
      "Stopping prophylaxis within 24 hours of surgery matches the international recommendation.",
    ],
    tableTitle: "Changes",
    tableHead: ["Item", "Current", "Revised"],
    tableRows: [
      ["Prophylaxis timing", "Within 2 h before incision", "Within 60 min before incision", "guideline"],
      ["Prophylaxis duration", "72 h after surgery", "Stop within 24 h", "guideline"],
      ["Vancomycin monitoring", "Trough 15–20 mg/L", "AUC 400–600", "paper"],
    ] as const,
    pills: { board: "Policy revision", guideline: "Surgical prophylaxis", paper: "Vancomycin consensus" },
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
          <A2Sidebar language={language} active="home" role={copy.role} />
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
                            <BookText aria-hidden="true" strokeWidth={1.8} />
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
