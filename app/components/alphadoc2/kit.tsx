/* eslint-disable @next/next/no-img-element -- Decorative product chrome inside motion scenes. */
import type { ReactNode } from "react";
import {
  ArrowUp,
  BookOpen,
  BookText,
  ChevronDown,
  ClipboardList,
  Clock,
  FileText,
  House,
  MessageSquare,
  Plus,
  Search,
  SquarePen,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { Language } from "@/app/site-content";

/* Shared parts for Alphadoc 2.0 motion scenes. Layout and labels follow the 2.0 mockup
   (alphadoc-mockup-edits, CHG-050). Example data stays neutral: no institution names or types. */

export type A2NavKey = "home" | "chat" | "note" | "favorites" | "notes" | "board" | "guidelines" | "papers";
export type A2SourceKind = "paper" | "guideline" | "board" | "note";

export const a2Labels = {
  ko: {
    brand: "알파닥",
    quick: "빠른 이동",
    nav: {
      home: "홈",
      chat: "새 대화",
      note: "새 노트",
      favorites: "즐겨찾기",
      notes: "내 노트",
      board: "사내 게시판",
      guidelines: "의료 지침·공지",
      papers: "논문",
    },
    recentLabel: "최근 대화",
    recent: ["수술 예방 항생제 기준 비교", "SAE 보고 기한 정리", "TRIPOD+AI 적용 범위 확인", "약제위원회 회의록 정리"],
    profileName: "김지원",
    profileRole: "임상연구팀 · 연구원",
    avatar: "지원",
    workspace: "워크스페이스",
    newChat: "새 대화",
    placeholder: "알파닥에게 질문하거나 @로 자료를 지정하세요",
    scope: "자료",
    sourceKinds: { paper: "바이오레 문헌", guideline: "바이오레 지침", board: "사내 게시판", note: "내 노트" },
  },
  en: {
    brand: "Alphadoc",
    quick: "Quick jump",
    nav: {
      home: "Home",
      chat: "New chat",
      note: "New note",
      favorites: "Favorites",
      notes: "My notes",
      board: "Internal board",
      guidelines: "Guidelines & notices",
      papers: "Papers",
    },
    recentLabel: "Recent chats",
    recent: ["Surgical prophylaxis changes", "SAE reporting timelines", "TRIPOD+AI scope", "P&T committee minutes"],
    profileName: "Jiwon Kim",
    profileRole: "Clinical research",
    avatar: "JK",
    workspace: "Workspace",
    newChat: "New chat",
    placeholder: "Ask Alphadoc, or type @ to add a source",
    scope: "Sources",
    sourceKinds: { paper: "Viore literature", guideline: "Viore guidelines", board: "Internal board", note: "My notes" },
  },
} as const;

const navIcons: Record<A2NavKey, LucideIcon> = {
  home: House,
  chat: MessageSquare,
  note: SquarePen,
  favorites: Star,
  notes: FileText,
  board: ClipboardList,
  guidelines: BookOpen,
  papers: BookText,
};

const sourceIcons: Record<A2SourceKind, LucideIcon> = {
  paper: BookText,
  guideline: BookOpen,
  board: ClipboardList,
  note: FileText,
};

export function A2SourceIcon({ kind }: { kind: A2SourceKind }) {
  const Icon = sourceIcons[kind];
  return <Icon aria-hidden="true" strokeWidth={1.8} />;
}

export function A2NavIcon({ nav }: { nav: A2NavKey }) {
  const Icon = navIcons[nav];
  return <Icon aria-hidden="true" strokeWidth={1.8} />;
}

const navOrder: readonly A2NavKey[] = ["home", "chat", "note", "favorites", "notes", "board", "guidelines", "papers"];

/* role: the signed-in member's team and job for this scene (the name stays the same). */
export function A2Sidebar({ language, active, role }: { language: Language; active: A2NavKey; role?: string }) {
  const copy = a2Labels[language];
  return (
    <aside className="a2-sidebar" aria-hidden="true">
      <div className="a2-brand">
        <img src="/brand/alphadoc-alpha.png" alt="" width="419" height="365" />
        <span>{copy.brand}</span>
      </div>
      <div className="a2-quick">
        <span>{copy.quick}</span>
        <kbd>⌘K</kbd>
      </div>
      <nav className="a2-nav">
        {navOrder.map((key) => (
          <span key={key} className={`a2-nav-item${key === active ? " is-active" : ""}`}>
            <A2NavIcon nav={key} />
            <span>{copy.nav[key]}</span>
          </span>
        ))}
      </nav>
      <p className="a2-side-label">{copy.recentLabel}</p>
      {copy.recent.map((item) => (
        <span key={item} className="a2-recent">
          <Clock aria-hidden="true" strokeWidth={1.8} />
          <span>{item}</span>
        </span>
      ))}
      <div className="a2-profile">
        <span className="a2-avatar">{copy.avatar}</span>
        <span>
          {copy.profileName}
          <small>{role ?? copy.profileRole}</small>
        </span>
      </div>
    </aside>
  );
}

export function A2Topbar({ language, crumbs }: { language: Language; crumbs: readonly string[] }) {
  const copy = a2Labels[language];
  const trail = [copy.workspace, ...crumbs];
  return (
    <div className="a2-topbar" aria-hidden="true">
      {trail.map((crumb, index) => (
        <span key={`${crumb}-${index}`} className={index === trail.length - 1 ? "a2-crumb-current" : undefined}>
          {index > 0 && <span className="a2-crumb-sep">›&nbsp;</span>}
          {crumb}
        </span>
      ))}
      <span className="a2-topbar-actions">
        <Search aria-hidden="true" strokeWidth={1.8} />
        <span className="a2-button">
          <MessageSquare aria-hidden="true" strokeWidth={1.8} />
          {copy.newChat}
        </span>
      </span>
    </div>
  );
}

export function A2Composer({
  language,
  children,
  ready = false,
  className = "",
  scopeLabel,
  sendClassName = "",
}: {
  language: Language;
  children?: ReactNode;
  ready?: boolean;
  className?: string;
  scopeLabel?: string;
  sendClassName?: string;
}) {
  const copy = a2Labels[language];
  return (
    <div className={`a2-composer ${className}`.trim()} aria-hidden="true">
      <div className="a2-composer-text">
        {children ?? <span className="a2-placeholder">{copy.placeholder}</span>}
      </div>
      <div className="a2-composer-row">
        <span className="a2-icon-btn"><Plus aria-hidden="true" strokeWidth={1.8} /></span>
        <span className="a2-scope">
          <BookOpen aria-hidden="true" strokeWidth={1.8} />
          {scopeLabel ?? copy.scope}
          <ChevronDown aria-hidden="true" strokeWidth={1.8} />
        </span>
        <span className={`a2-send${ready ? " is-ready" : ""} ${sendClassName}`.trim()}>
          <ArrowUp aria-hidden="true" strokeWidth={2.2} />
        </span>
      </div>
    </div>
  );
}

export function A2Pill({ kind, label, more, className = "" }: { kind: A2SourceKind; label: string; more?: number; className?: string }) {
  return (
    <span className={`a2-pill ${className}`.trim()}>
      <A2SourceIcon kind={kind} />
      {label}
      {more ? <b>+{more}</b> : null}
    </span>
  );
}
