/* eslint-disable @next/next/no-img-element -- Decorative product chrome inside the motion scene. */
import {
  ArrowUp,
  BookOpen,
  Check,
  ChevronDown,
  CircleCheck,
  ClipboardList,
  Copy,
  Eye,
  MessageCircle,
  Plus,
  RotateCcw,
  Square,
  Star,
  X,
} from "lucide-react";
import { A2Pill, A2SourceIcon } from "@/app/components/alphadoc2/kit";
import type { Language } from "@/app/site-content";

export type AlphadocFeatureId = "evidence-chat" | "notes" | "board" | "guidelines" | "papers" | "favorites";

/* Small cropped pieces of the 2.0 mockup, one per feature card (CHG-015, 020, 036, 040, 046, 048, 049).
   Example data is neutral. Each element's own style is the final frame, so reduced motion shows it finished. */

const copy = {
  ko: {
    alphadoc: "알파닥",
    placeholder: "알파닥에게 질문하거나 @로 자료를 지정하세요",
    scope: {
      title: "참조 범위",
      items: [
        ["전체 자료", "바이오레 자료, 사내 게시판, 내 자료"],
        ["바이오레 자료", "문헌, 의료 지침, 의료 공식 공지"],
        ["내 자료", "내 노트와 문서, 조직에 공유된 자료"],
        ["사내 게시판", "사내 소식, 자료 공유, 업무 논의"],
      ],
      before: "자료",
      after: "자료: 사내 게시판",
      chip: "손 위생 지침 v3",
    },
    notes: {
      title: "주간 업무 회의",
      meta: "나만 보기 · 오늘",
      lines: ["손 위생 지침 v3 교육 일정", "신규 직원 온보딩 자료 정리", "필독 공지 확인 현황"],
      request: "결정 사항과 할 일로 정리해 줘",
      decision: "결정 사항",
      decisionLine: "지침 v3를 사내 게시판 필독으로 게시",
      todo: "할 일",
      todos: ["교육 자료 초안 작성", "필독 확인 현황 점검"],
      insert: "노트 끝에 넣기",
      inserted: "할 일",
    },
    board: {
      head: ["분류", "제목", "작성자", "날짜"],
      rows: [
        ["사내 소식", "손 위생 지침 v3 시행 안내", "품질관리팀", "오늘"],
        ["업무 자료", "신규 직원 온보딩 체크리스트", "교육팀", "어제"],
        ["사내 소식", "정기 점검 일정 안내", "시설팀", "2일 전"],
        ["품질·안전", "환자 확인 절차 개정안", "품질관리팀", "4일 전"],
        ["업무 자료", "감염관리 교육 자료 모음", "교육팀", "1주 전"],
        ["사내 소식", "다음 달 당직 일정 안내", "운영지원팀", "2주 전"],
      ],
      must: "필독",
      detailMeta: "품질관리팀 · 오늘",
      detailNote: "필독으로 지정된 글입니다.",
      confirm: "필독 확인",
      confirmed: "확인함",
      readers: "읽은 멤버 12",
    },
    guidelines: {
      head: ["분류", "제목", "출처", "날짜"],
      newRow: ["의료 지침", "성인 예방접종 지침 요약", "바이오레", "오늘"],
      rows: [
        ["의료 지침", "항생제 적정 사용 지침 요약", "바이오레", "4일 전"],
        ["공지", "의료기관 감염관리 안내", "관련 학회", "1주 전"],
        ["의료 지침", "손 위생 지침 요약", "바이오레", "2주 전"],
        ["공지", "진료지침 개정 일정 안내", "관련 학회", "3주 전"],
        ["의료 지침", "만성질환 관리 지침 요약", "바이오레", "4주 전"],
        ["공지", "예방접종 시행 안내", "관련 학회", "1개월 전"],
      ],
      badge: "새로 반영",
    },
    papers: {
      chip: "가이드라인",
      cards: [
        ["CONSORT-AI extension", "Nature Medicine · 2020"],
        ["TRIPOD+AI statement", "BMJ · 2024"],
        ["SPIRIT-AI extension", "Nature Medicine · 2020"],
        ["DECIDE-AI", "Nature Medicine · 2022"],
      ],
      paneTitle: "이 논문에 대해 알파닥에게 물어보세요",
      question: "보고 항목을 정리해 줘",
    },
    favorites: {
      answerTitle: "손 위생 지침 v3 개정 사항",
      answerBody: "v3에서는 손 위생 시점과 교육 주기가 바뀌었습니다.",
      pill: "사내 게시판",
      sources: "출처 2",
      listTitle: "저장한 답변",
      saved: [
        ["손 위생 지침 v3 개정 사항", "오늘"],
        ["신규 직원 교육 자료 기준", "2일 전"],
        ["TRIPOD+AI 보고 항목", "4일 전"],
      ],
      toast: "즐겨찾기에 저장했습니다",
    },
  },
  en: {
    alphadoc: "Alphadoc",
    placeholder: "Ask Alphadoc, or type @ to add a source",
    scope: {
      title: "Source scope",
      items: [
        ["All materials", "Viore, internal board, my materials"],
        ["Viore materials", "Literature, guidelines, official notices"],
        ["My materials", "My notes and files, shared with my org"],
        ["Internal board", "News, shared materials, discussions"],
      ],
      before: "Sources",
      after: "Sources: Internal board",
      chip: "Hand hygiene guideline v3",
    },
    notes: {
      title: "Weekly team meeting",
      meta: "Only me · Today",
      lines: ["Hand hygiene v3 training schedule", "New staff onboarding files", "Must-read notice status"],
      request: "Sort this into decisions and to-dos",
      decision: "Decisions",
      decisionLine: "Post guideline v3 as a must-read",
      todo: "To-dos",
      todos: ["Draft the training material", "Check must-read status"],
      insert: "Add to end of note",
      inserted: "To-dos",
    },
    board: {
      head: ["Category", "Title", "Author", "Date"],
      rows: [
        ["News", "Hand hygiene guideline v3 starts", "Quality team", "Today"],
        ["Work files", "New staff onboarding checklist", "Training", "1d ago"],
        ["News", "Maintenance schedule", "Facilities", "2d ago"],
        ["Safety", "Patient ID procedure update", "Quality team", "4d ago"],
        ["Work files", "Infection control training pack", "Training", "1w ago"],
        ["News", "Next month's on-call schedule", "Operations", "2w ago"],
      ],
      must: "Must-read",
      detailMeta: "Quality team · Today",
      detailNote: "This post is marked must-read.",
      confirm: "Mark as read",
      confirmed: "Read",
      readers: "12 members read",
    },
    guidelines: {
      head: ["Type", "Title", "Source", "Date"],
      newRow: ["Guideline", "Adult immunization summary", "Viore", "Today"],
      rows: [
        ["Guideline", "Antibiotic stewardship summary", "Viore", "4d ago"],
        ["Notice", "Infection control notice", "Society", "1w ago"],
        ["Guideline", "Hand hygiene summary", "Viore", "2w ago"],
        ["Notice", "Guideline revision schedule", "Society", "3w ago"],
        ["Guideline", "Chronic care guideline summary", "Viore", "4w ago"],
        ["Notice", "Immunization program notice", "Society", "1mo ago"],
      ],
      badge: "New",
    },
    papers: {
      chip: "Guideline",
      cards: [
        ["CONSORT-AI extension", "Nature Medicine · 2020"],
        ["TRIPOD+AI statement", "BMJ · 2024"],
        ["SPIRIT-AI extension", "Nature Medicine · 2020"],
        ["DECIDE-AI", "Nature Medicine · 2022"],
      ],
      paneTitle: "Ask Alphadoc about this paper",
      question: "List what authors should report",
    },
    favorites: {
      answerTitle: "Hand hygiene guideline v3 changes",
      answerBody: "Version 3 changes when to clean hands and how often training runs.",
      pill: "Internal board",
      sources: "2 sources",
      listTitle: "Saved answers",
      saved: [
        ["Hand hygiene guideline v3 changes", "Today"],
        ["New staff training standards", "2d ago"],
        ["TRIPOD+AI reporting items", "4d ago"],
      ],
      toast: "Saved to Favorites",
    },
  },
} as const;

type SceneCopy = (typeof copy)[Language];

function AlphadocMark() {
  return <img className="a2-fs-mark" src="/brand/alphadoc-alpha.png" alt="" width="419" height="365" />;
}

function EvidenceChatScene({ c }: { c: SceneCopy }) {
  return (
    <>
      <div className="a2-fs-menu fs-anim">
        <p className="a2-fs-menu-title">{c.scope.title}</p>
        {c.scope.items.map(([title, body], index) => (
          <div key={title} className={`a2-fs-menu-item${index === 0 ? " is-first" : ""}${index === 3 ? " is-last" : ""}`}>
            <span className="a2-fs-menu-check">
              {index === 0 && <Check className="a2-fs-check-old fs-anim" strokeWidth={2.2} />}
              {index === 3 && <Check className="a2-fs-check-new fs-anim" strokeWidth={2.2} />}
            </span>
            <span>
              <strong>{title}</strong>
              <small>{body}</small>
            </span>
          </div>
        ))}
        <span className="a2-fs-menu-hover fs-anim" />
      </div>
      <div className="a2-composer a2-fs-composer">
        <div className="a2-composer-text a2-fs-composer-text">
          <span className="a2-fs-tokens">
            <span className="a2-fs-at fs-anim">@</span>
            <span className="a2-chip a2-fs-chip fs-anim"><ClipboardList strokeWidth={1.8} />{c.scope.chip}</span>
          </span>
          <span className="a2-placeholder a2-fs-placeholder">{c.placeholder}</span>
        </div>
        <div className="a2-composer-row">
          <span className="a2-icon-btn"><Plus strokeWidth={1.8} /></span>
          <span className="a2-scope a2-fs-scope">
            <BookOpen strokeWidth={1.8} />
            <span className="a2-fs-scope-before fs-anim">{c.scope.before}<ChevronDown strokeWidth={1.8} /></span>
            <span className="a2-fs-scope-after fs-anim">{c.scope.after}<ChevronDown strokeWidth={1.8} /></span>
          </span>
          <span className="a2-send"><ArrowUp strokeWidth={2.2} /></span>
        </div>
      </div>
    </>
  );
}

function NotesScene({ c }: { c: SceneCopy }) {
  return (
    <div className="a2-fs-split">
      <article className="a2-fs-sheet a2-fs-note">
        <h4>{c.notes.title}</h4>
        <p className="a2-fs-sub">{c.notes.meta}</p>
        <ul className="a2-fs-bullets">
          {c.notes.lines.map((line) => <li key={line}>{line}</li>)}
        </ul>
        <div className="a2-fs-inserted fs-anim">
          <p className="a2-fs-inserted-title">{c.notes.inserted}</p>
          {c.notes.todos.map((todo) => (
            <p key={todo} className="a2-fs-todo"><Square strokeWidth={1.8} />{todo}</p>
          ))}
        </div>
      </article>
      <aside className="a2-fs-pane">
        <div className="a2-fs-pane-head"><AlphadocMark />{c.alphadoc}<X strokeWidth={1.8} /></div>
        <p className="a2-bubble a2-fs-request fs-anim">{c.notes.request}</p>
        <div className="a2-fs-reply fs-anim">
          <p className="a2-fs-reply-title">{c.notes.decision}</p>
          <p>{c.notes.decisionLine}</p>
          <p className="a2-fs-reply-title">{c.notes.todo}</p>
          {c.notes.todos.map((todo) => <p key={todo}>· {todo}</p>)}
          <span className="a2-button a2-fs-insert fs-anim"><Plus strokeWidth={2} />{c.notes.insert}</span>
        </div>
      </aside>
    </div>
  );
}

function BoardScene({ c }: { c: SceneCopy }) {
  return (
    <div className="a2-fs-sheet a2-fs-board">
      <div className="a2-list a2-fs-list">
        <div className="a2-list-row is-head">
          {c.board.head.map((cell) => <span key={cell}>{cell}</span>)}
        </div>
        {c.board.rows.map((row, index) => (
          <div key={row[1]} className={`a2-list-row${index === 0 ? " a2-fs-board-target fs-anim" : ""}`}>
            <span className="a2-muted">{row[0]}</span>
            <span>
              {index === 0 && <span className="a2-badge is-red a2-fs-must">{c.board.must}</span>}
              {row[1]}
            </span>
            <span className="a2-muted">{row[2]}</span>
            <span className="a2-muted">{row[3]}</span>
          </div>
        ))}
      </div>
      <aside className="a2-fs-detail fs-anim">
        <span className="a2-badge is-red">{c.board.must}</span>
        <h4>{c.board.rows[0][1]}</h4>
        <p className="a2-fs-sub">{c.board.detailMeta}</p>
        <p className="a2-fs-detail-note"><Eye strokeWidth={1.8} />{c.board.detailNote}</p>
        <div className="a2-fs-confirm">
          <span className="a2-button is-primary a2-fs-confirm-before fs-anim">{c.board.confirm}</span>
          <span className="a2-button a2-fs-confirm-after fs-anim"><CircleCheck strokeWidth={2} />{c.board.confirmed}</span>
        </div>
        <p className="a2-fs-readers fs-anim"><MessageCircle strokeWidth={1.8} />{c.board.readers}</p>
      </aside>
    </div>
  );
}

function GuidelinesScene({ c }: { c: SceneCopy }) {
  return (
    <div className="a2-fs-sheet a2-fs-guidelines">
      <div className="a2-list a2-fs-list">
        <div className="a2-list-row is-head">
          {c.guidelines.head.map((cell) => <span key={cell}>{cell}</span>)}
        </div>
        <div className="a2-fs-list-body">
          <div className="a2-fs-list-track fs-anim">
            <div className="a2-list-row a2-fs-new-row fs-anim">
              <span className="a2-muted">{c.guidelines.newRow[0]}</span>
              <span><span className="a2-badge is-blue">{c.guidelines.badge}</span>{c.guidelines.newRow[1]}</span>
              <span className="a2-muted">{c.guidelines.newRow[2]}</span>
              <span className="a2-muted">{c.guidelines.newRow[3]}</span>
            </div>
            {c.guidelines.rows.map((row) => (
              <div key={row[1]} className="a2-list-row">
                <span className="a2-muted">{row[0]}</span>
                <span>{row[1]}</span>
                <span className="a2-muted">{row[2]}</span>
                <span className="a2-muted">{row[3]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PapersScene({ c }: { c: SceneCopy }) {
  return (
    <div className="a2-fs-papers">
      <div className="a2-fs-grid">
        {c.papers.cards.map(([title, meta], index) => (
          <div key={title} className={`a2-fs-paper${index === 1 ? " is-target fs-anim" : ""}`}>
            <span className="a2-badge is-green">{c.papers.chip}</span>
            <strong>{title}</strong>
            <small>{meta}</small>
          </div>
        ))}
      </div>
      <aside className="a2-fs-pane a2-fs-paper-pane fs-anim">
        <div className="a2-fs-pane-head"><AlphadocMark />{c.alphadoc}<X strokeWidth={1.8} /></div>
        <p className="a2-fs-pane-empty"><AlphadocMark />{c.papers.paneTitle}</p>
        <div className="a2-fs-pane-input">
          <span className="a2-fs-pane-typed fs-anim">{c.papers.question}</span>
          <span className="a2-send is-ready"><ArrowUp strokeWidth={2.2} /></span>
        </div>
      </aside>
    </div>
  );
}

function FavoritesScene({ c }: { c: SceneCopy }) {
  return (
    <div className="a2-fs-favorites">
      <article className="a2-fs-sheet a2-fs-answer">
        <h4>{c.favorites.answerTitle}</h4>
        <p>
          {c.favorites.answerBody}
          <A2Pill kind="board" label={c.favorites.pill} />
        </p>
        <div className="a2-answer-actions">
          <Copy strokeWidth={1.8} />
          <span className="a2-fs-star">
            <Star className="a2-fs-star-off fs-anim" strokeWidth={1.8} />
            <Star className="a2-fs-star-on fs-anim" strokeWidth={1.8} />
          </span>
          <RotateCcw strokeWidth={1.8} />
          <span className="a2-source-count"><A2SourceIcon kind="board" />{c.favorites.sources}</span>
        </div>
        <span className="a2-fs-toast fs-anim"><CircleCheck strokeWidth={2} />{c.favorites.toast}</span>
      </article>
      <aside className="a2-fs-sheet a2-fs-saved">
        <p className="a2-fs-saved-title"><Star strokeWidth={1.8} />{c.favorites.listTitle}</p>
        {c.favorites.saved.map(([title, date], index) => (
          <p key={title} className={`a2-fs-saved-row${index === 0 ? " is-new fs-anim" : ""}`}>
            <span>{title}</span>
            <small>{date}</small>
          </p>
        ))}
      </aside>
    </div>
  );
}

export function AlphadocV2FeatureScene({ featureId, language }: { featureId: AlphadocFeatureId; language: Language }) {
  const c = copy[language];
  return (
    <div className={`a2-fs a2-fs--${featureId}`} data-feature-scene={featureId} aria-hidden="true">
      <div className="a2 a2-fs-canvas">
        {featureId === "evidence-chat" && <EvidenceChatScene c={c} />}
        {featureId === "notes" && <NotesScene c={c} />}
        {featureId === "board" && <BoardScene c={c} />}
        {featureId === "guidelines" && <GuidelinesScene c={c} />}
        {featureId === "papers" && <PapersScene c={c} />}
        {featureId === "favorites" && <FavoritesScene c={c} />}
      </div>
    </div>
  );
}
