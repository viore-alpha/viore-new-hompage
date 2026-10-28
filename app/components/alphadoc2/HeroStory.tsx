"use client";
/* eslint-disable @next/next/no-img-element -- Decorative marks inside the motion stage. */

import { useEffect, useRef } from "react";
import {
  ArrowUp, BookOpen, BookText, Check, ChevronDown, ClipboardList, Copy, FileText, Layers,
  House, Library, MessageSquare, Pause, Play, Plus, RotateCcw, SquarePen, Star, X,
} from "lucide-react";
import type { Language } from "@/app/site-content";
import { createRenderer, createTimeline, ease, useTimelinePlayer } from "@/app/components/alphadoc2/timeline";

/* 첫 화면 모션. 구글 Workspace 첫 화면처럼 한 번 재생되는 약 21초짜리 장면:
   α 마크 → 알파닥 창 → 참조 범위 → @로 자료 지정 → 출처가 붙은 답변 → 노트 화면
   → 3단 논문 화면(목록 | 본문 | 알파닥)에서 논문을 묻고, 답의 근거가 본문에 칠해짐.
   타임라인 엔진은 timeline.ts에 있다 (인터페이스 투어와 같이 쓴다). 움직임 줄이기 설정에서는 마지막 장면만 보인다. */

function buildTimeline() {
  const { set, to, pop, rise, out, wipe, type, done } = createTimeline();

  /* 1. α 마크와 떠오르는 말풍선 (0 ~ 1.6초) */
  set("aurora", { o: 0 }); to("aurora", 0, 1200, { o: 1 });
  set("mark", { o: 0, y: 200, s: 0.4, b: 10 });
  to("mark", 0, 700, { o: 1, s: 1.35, b: 0 }, ease.back);
  to("mark", 950, 750, { y: 0, s: 1 }, ease.inOut);
  [["b1", 280], ["tChat", 400], ["b2", 500], ["tFav", 620], ["b3", 720], ["b4", 840]].forEach(([k, t]) => pop(k as string, t as number));
  to("b1", 950, 800, { x: -16, y: -8 }, ease.inOut);
  to("b2", 950, 800, { x: 16, y: -10 }, ease.inOut);
  to("b3", 950, 800, { x: -18, y: 8 }, ease.inOut);
  to("b4", 950, 800, { x: 16, y: 10 }, ease.inOut);
  to("tFav", 950, 800, { x: 24, y: -4 }, ease.inOut);
  to("tChat", 950, 800, { x: -24, y: 4 }, ease.inOut);

  /* 2. 알파닥 창이 마크 아래로 펼쳐지고 인사말 타이핑 (1 ~ 2.6초) */
  set("panel", { o: 0, sy: 0.12, s: 0.94, y: -26, b: 8 });
  to("panel", 1000, 760, { o: 1, sy: 1, s: 1, y: 0, b: 0 }, ease.outQuint);
  set("head", { o: 0 }); to("head", 1400, 300, { o: 1 });
  type("greet1", 1500, 650);
  rise("greet2", 2150, 380, 8);
  rise("comp", 1750, 480, 16);

  /* 3. 참조 범위 고르기 (2.4 ~ 4.1초) */
  rise("mtitle", 2400, 320, 8);
  ["m1", "m2", "m3", "m4"].forEach((k, i) => rise(k, 2480 + i * 90, 420, 14));
  set("hl", { o: 0 }); to("hl", 2950, 200, { o: 1 });
  to("hl", 3150, 620, { y: 108 }, ease.inOut);
  to("hl", 3770, 140, { s: 0.97 }); to("hl", 3910, 220, { s: 1 }, ease.back);
  out("scopeA", 3850, 180);
  pop("scopeB", 3900, 420);

  /* 4. 자료 아이콘 줄, @로 자료 지정, 질문 (4 ~ 6.3초) */
  [["i1", 4000], ["i2", 4090], ["i4", 4180], ["i5", 4270]].forEach(([k, t]) => { set(k as string, { y: 10 }); pop(k as string, t as number, 480); to(k as string, t as number, 480, { y: 0 }, ease.outQuint); });
  out("ph", 4500, 200);
  set("chip", { o: 0, s: 0.5, x: -8 }); to("chip", 4600, 420, { o: 1, s: 1, x: 0 }, ease.back);
  type("q", 4950, 850);
  pop("sendOn", 5850, 360);
  to("sendOn", 6060, 120, { s: 0.82 }); to("sendOn", 6180, 260, { s: 1 }, ease.back);
  to("intro", 6100, 340, { o: 0, y: -14 }, ease.in);
  out("line", 6150, 180);
  out("sendOn", 6400, 220);
  to("ph", 6500, 300, { o: 1 });

  /* 5. 질문이 올라가고 출처가 붙은 답변 (6.2 ~ 9.8초) */
  set("qb", { o: 0, y: 220, s: 0.92 }); to("qb", 6150, 620, { o: 1, y: 0, s: 1 }, ease.outQuint);
  set("think", { o: 0, s: 0.4 }); to("think", 6650, 260, { o: 1, s: 1 }, ease.back); out("think", 7480, 200);
  ["sh1", "sh2", "sh3"].forEach((k, i) => { set(k, { o: 0, sx: 0.2 }); to(k, 6700 + i * 90, 520, { o: 1, sx: 1 }); out(k, 7420 + i * 40, 220); });
  rise("atitle", 7560, 360, 8);
  wipe("aline", 7700, 680);
  ["r1", "r2", "r3"].forEach((k, i) => rise(k, 8000 + i * 140, 380, 10));
  pop("p0", 8250, 420);
  ["p1", "p2", "p3"].forEach((k, i) => pop(k, 8350 + i * 150, 420));
  rise("srcs", 8900, 340, 8);
  ["sc1", "sc2", "sc3"].forEach((k, i) => pop(k, 9000 + i * 100, 380));
  rise("acts", 9250, 320, 6);
  pop("starOn", 9500, 460);

  /* 6. 미니 메뉴가 스치고 새 노트로 (9.7 ~ 10.8초) */
  set("rail", { o: 0, x: -16 }); to("rail", 9700, 420, { o: 1, x: 0 }, ease.outQuint);
  set("railHl", { o: 0 }); to("railHl", 9950, 160, { o: 1 }); to("railHl", 10060, 380, { y: 44 }, ease.inOut);
  out("rail", 10720, 240, { x: -10 });

  /* 7. 창이 옆으로 비켜서고 노트 화면이 짜임 (10.4 ~ 14초) */
  ["i1", "i2", "i4", "i5"].forEach((k, i) => out(k, 10380 + i * 30, 280, { s: 0.6 }));
  ["b1", "b2", "b3", "b4", "tFav", "tChat"].forEach((k, i) => out(k, 10420 + i * 40, 320, { s: 0.7 }));
  to("mark", 10600, 820, { x: 80, y: 34, s: 0.72 }, ease.inOut);
  out("headMark", 10600, 300);
  to("panel", 10600, 880, { x: 191, y: 12, s: 0.74 }, ease.inOut);
  set("win", { o: 0, s: 0.9, y: 34, b: 10 }); to("win", 10900, 780, { o: 1, s: 1, y: 0, b: 0 }, ease.outQuint);
  type("ntitle", 11300, 460);
  rise("nmeta", 11650, 320, 6);
  ["nb1", "nb2", "nb3"].forEach((k, i) => wipe(k, 11750 + i * 150, 460));
  pop("d1", 11450, 540); pop("tHome", 11600, 540); pop("tNotes", 11750, 540);
  set("doc1", { o: 0, y: 44, r: -8 }); to("doc1", 11800, 640, { o: 1, y: 0, r: -3 }, ease.outQuint);
  set("doc2", { o: 0, y: 44, r: 8 }); to("doc2", 11950, 640, { o: 1, y: 0, r: 4 }, ease.outQuint);
  out("comp", 11700, 240);
  rise("ins", 11850, 400, 14);
  to("insBtn", 12450, 120, { s: 0.9 }); to("insBtn", 12570, 240, { s: 1 }, ease.back);
  set("fly", { o: 0, x: 300, y: 86, s: 0.55 });
  to("fly", 12550, 160, { o: 1 }); to("fly", 12600, 720, { x: 0, y: 0, s: 1 }, ease.inOut); out("fly", 13250, 220, { s: 0.96 });
  set("nsec", { o: 0, cv: 0 }); to("nsec", 13200, 560, { o: 1, cv: 1 }, ease.out);
  out("insBtn", 13250, 160); pop("insDone", 13300, 420);
  pop("ck1", 13600, 380); pop("ck2", 13760, 380);

  /* 8. 미니 메뉴에서 논문으로, 노트가 접히고 3단 논문 화면이 열림 (14.3 ~ 16.8초) */
  to("rail", 14300, 1, { x: -110 });
  to("rail", 14420, 380, { o: 1, x: -96 }, ease.outQuint);
  to("railHl", 14520, 380, { y: 88 }, ease.inOut);
  to("railHl", 14900, 110, { s: 0.88 }); to("railHl", 15010, 240, { s: 1 }, ease.back);
  out("rail", 15150, 260, { x: -108 });
  out("panel", 14800, 380, { s: 0.68, y: 10 });
  out("win", 14850, 380, { s: 0.95, y: 10 });
  [["doc1", 14760], ["d1", 14780], ["doc2", 14820], ["tHome", 14840], ["tNotes", 14880]].forEach(([k, t]) => out(k as string, t as number, 300, { s: 0.7 }));
  to("mark", 14900, 820, { x: 306, y: -14, s: 0.6 }, ease.inOut);
  set("pw", { o: 0, c: 0, s: 0.97 }); to("pw", 14980, 780, { o: 1, c: 1, s: 1 }, ease.outQuint);
  rise("pbar", 15400, 320, 6);
  rise("lt", 15480, 340, 8); rise("ls", 15540, 340, 8); rise("ltabs", 15600, 340, 8);
  ["lc1", "lc2", "lc3"].forEach((k, i) => rise(k, 15640 + i * 90, 420, 16));
  set("lsel", { o: 0, s: 0.96 }); to("lsel", 16050, 360, { o: 1, s: 1 }, ease.back);
  rise("rbar", 15700, 320, 6);
  rise("rt", 16150, 380, 10); rise("rs", 16230, 340, 8); rise("rm", 16290, 340, 8); rise("rl", 16350, 320, 6);
  set("rx", { o: 0, cv: 0 }); to("rx", 16400, 760, { o: 1, cv: 1 }, ease.out);
  rise("rbars", 16700, 380, 8);
  rise("ah", 15760, 320, 6);
  set("ae", { o: 0, y: 10, s: 0.94 }); to("ae", 15900, 460, { o: 1, y: 0, s: 1 }, ease.back);
  rise("ac", 15960, 420, 14);
  to("b1", 14300, 1, { x: -130, y: -92 }); to("b1", 15800, 520, { o: 1, s: 1 }, ease.back);
  to("tChat", 14300, 1, { x: 247, y: -183 }); to("tChat", 16000, 520, { o: 1, s: 1 }, ease.back);
  to("tFav", 14300, 1, { x: -133, y: 219 }); to("tFav", 16150, 520, { o: 1, s: 1 }, ease.back);

  /* 9. 오른쪽 알파닥에게 논문을 묻고, 답의 근거가 본문에 칠해짐 (16.5 ~ 20.7초) */
  out("aph", 16500, 160);
  type("pq", 16560, 760);
  pop("send2On", 17360, 320);
  to("send2On", 17560, 110, { s: 0.82 }); to("send2On", 17670, 240, { s: 1 }, ease.back);
  out("send2On", 17950, 200);
  out("pline", 17620, 180);
  to("ae", 17600, 300, { o: 0, y: -12 }, ease.in);
  to("aph", 17950, 260, { o: 1 });
  set("aq", { o: 0, y: 240, s: 0.92 }); to("aq", 17620, 620, { o: 1, y: 0, s: 1 }, ease.outQuint);
  set("think2", { o: 0, s: 0.4 }); to("think2", 18080, 240, { o: 1, s: 1 }, ease.back); out("think2", 18760, 200);
  ["sh4", "sh5", "sh6"].forEach((k, i) => { set(k, { o: 0, sx: 0.2 }); to(k, 18120 + i * 90, 480, { o: 1, sx: 1 }); out(k, 18700 + i * 40, 200); });
  rise("aa0", 18860, 360, 8);
  ["ab1", "ab2", "ab3"].forEach((k, i) => rise(k, 19000 + i * 140, 380, 10));
  pop("cite1", 19260, 400); wipe("rh1", 19380, 620);
  pop("cite2", 19560, 400); wipe("rh2", 19680, 620);
  rise("asrc", 20000, 340, 6);

  return done(20700);
}

const TIMELINE = buildTimeline();

const copy = {
  ko: {
    brand: "알파닥", greet1: "알파닥님, 안녕하세요.", greet2: "무엇을 확인할까요?", menu: "참조 범위",
    rows: [["전체 자료", "모든 자료"], ["최신 의학 자료", "문헌 · 지침 · 공지"], ["내 자료", "노트 · 문서"], ["사내 게시판", "공지 · 업무 기준"]],
    ph: "알파닥에게 질문하거나 @로 자료를 지정하세요", scope: "자료", scopeOn: "자료: 사내 게시판",
    chip: "항생제 사용 지침 개정안", q: "바뀐 기준을 표로 정리해 줘",
    aTitle: "바뀐 기준", aLine: "개정안은 예방 항생제 투여 시점과 기간을 국제 지침에 맞췄습니다.",
    rowsA: [["예방 항생제 투여", "절개 전 60분 이내", "guide", "지침"], ["투여 기간", "24시간 이내 중단", "guide", "지침"], ["반코마이신", "AUC 400–600", "paper", "문헌"]],
    pill0: "게시판", sources: "출처 3", kinds: ["게시판", "지침", "문헌"],
    rail: ["새 대화", "새 노트", "논문"],
    crumb: ["워크스페이스", "새 노트"], nTitle: "약제위원회 회의", nMeta: "나만 보기 · 오늘",
    nb: ["반코마이신 AUC 기반 TDM 도입", "수술 예방 항생제 24시간 중단 준수율", "항생제 지침 개정안 게시 일정"],
    dec: "결정 사항", decText: "개정안을 사내 게시판 필독으로 게시", todo: "할 일", todos: ["TDM 계산 도구 검토", "외과 계열 교육 일정 조율"],
    ins: "결정 사항과 할 일로 정리했어요", insBtn: "노트 끝에 넣기", insDone: "노트에 넣었어요", fly: "결정 사항 · 할 일",
    docs: ["이상사례 보고 SOP", "TRIPOD+AI"], must: "필독",
    p: {
      crumb: ["워크스페이스", "논문"], toggle: "알파닥", title: "논문", sub: "바이오레가 제공하는 문헌",
      tabs: ["전체 보기", "리뷰", "원저", "가이드라인"], tag: "가이드라인",
      reading: ["논문 읽기", "1 / 2 · 초록·정보"], rSub: "반코마이신 혈중농도 모니터링 개정 합의문", abstract: "초록",
      empty: ["이 논문에 대해 알파닥에게 물어보세요", "본문 구절을 선택해 묻거나 바로 질문하세요."],
      ph: "이 논문에 대해 질문하세요", scope: "자료: 이 논문", q: "트러프 대신 AUC를 권하는 이유는?",
      lead: "개정 합의문은 트러프 대신 AUC 기반 용량 조절을 권합니다.",
      bullets: ["목표 AUC 400–600 (MIC 1 기준)", "트러프 15–20 목표는 신독성 위험으로 더는 권하지 않음", "AUC 계산은 베이지안 방식을 우선 권장"],
      evidence: "근거 2",
    },
    play: "재생", pause: "일시정지", replay: "다시 재생",
  },
  en: {
    brand: "Alphadoc", greet1: "Hello, Alphadoc", greet2: "What should we look into?", menu: "Sources",
    rows: [["All sources", "Everything"], ["Latest medical sources", "Papers · guidelines"], ["My materials", "Notes · documents"], ["Internal board", "Notices · standards"]],
    ph: "Ask Alphadoc, or type @ to add a source", scope: "Sources", scopeOn: "Sources: Internal board",
    chip: "Antibiotic guideline revision", q: "Put the changes in a table",
    aTitle: "What changed", aLine: "The revision aligns prophylaxis timing and duration with international guidelines.",
    rowsA: [["Timing", "Within 60 min", "guide", "Guideline"], ["Duration", "Stop within 24 h", "guide", "Guideline"], ["Vancomycin", "AUC 400–600", "paper", "Paper"]],
    pill0: "Board", sources: "Sources 3", kinds: ["Board", "Guideline", "Paper"],
    rail: ["New chat", "New note", "Papers"],
    crumb: ["Workspace", "New note"], nTitle: "P&T committee", nMeta: "Only me · Today",
    nb: ["Adopt AUC-based vancomycin TDM", "24 h stop compliance for prophylaxis", "Posting schedule for the revision"],
    dec: "Decisions", decText: "Post the revision as required reading", todo: "To-dos", todos: ["Review a TDM calculator", "Schedule surgical team training"],
    ins: "Sorted into decisions and to-dos", insBtn: "Add to note", insDone: "Added to note", fly: "Decisions · to-dos",
    docs: ["AE reporting SOP", "TRIPOD+AI"], must: "Must read",
    p: {
      crumb: ["Workspace", "Papers"], toggle: "Alphadoc", title: "Papers", sub: "Literature from Viore",
      tabs: ["All", "Reviews", "Original", "Guidelines"], tag: "Guideline",
      reading: ["Reading", "1 / 2 · Abstract"], rSub: "Revised consensus guideline", abstract: "Abstract",
      empty: ["Ask Alphadoc about this paper", "Select a passage, or just ask."],
      ph: "Ask about this paper", scope: "Source: This paper", q: "Why AUC instead of trough?",
      lead: "The revision favors AUC-guided dosing over trough targets.",
      bullets: ["Target AUC 400–600 (MIC 1)", "Trough-only 15–20 is no longer advised due to kidney risk", "Bayesian AUC estimation is preferred"],
      evidence: "Evidence 2",
    },
    play: "Play", pause: "Pause", replay: "Replay",
  },
} as const;

/* 논문 화면에 보이는 문헌. 제목·저자·연도는 실제 문헌이고, 본문은 초록 내용을 짧게 풀어 쓴 것이다. */
const PAPERS = [
  ["Therapeutic monitoring of vancomycin for serious MRSA infections: a revised consensus guideline", "Rybak MJ et al. · 2020"],
  ["Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2021", "Evans L et al. · 2021"],
  ["TRIPOD+AI statement: updated guidance for reporting clinical prediction models", "Collins GS et al. · 2024"],
] as const;
const READER_TITLE = "Therapeutic monitoring of vancomycin for serious MRSA infections";
const READER_META = "Rybak MJ et al. · Am J Health Syst Pharm · 2020";
/* [앞, 근거 1, 사이, 근거 2, 뒤] */
const READER_TEXT = [
  "This revision updates vancomycin dosing and monitoring for serious MRSA infections. ",
  "An individualized AUC target of 400–600 mg·h/L (MIC 1 mg/L) is advised.",
  " ",
  "Trough-only monitoring at 15–20 mg/L is no longer recommended,",
  " as it adds kidney injury risk. Bayesian AUC estimation is the preferred method.",
] as const;

function ReaderText({ on }: { on?: 1 | 2 }) {
  const [a, h1, b, h2, z] = READER_TEXT;
  return <>{a}<mark className={on === 1 ? "on" : undefined}>{h1}</mark>{b}<mark className={on === 2 ? "on" : undefined}>{h2}</mark>{z}</>;
}

export function AlphadocHeroStory({ language, label }: { language: Language; label: string }) {
  const c = copy[language];
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<SVGCircleElement>(null);
  const { mode, toggle } = useTimelinePlayer(rootRef, (root) => {
    const render = createRenderer(root, TIMELINE);
    const ring = 2 * Math.PI * 18;
    return {
      end: TIMELINE.end,
      frame: (t) => {
        render(t);
        if (barRef.current) barRef.current.style.strokeDashoffset = String(ring * (1 - t / TIMELINE.end));
      },
    };
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(([entry]) => root.style.setProperty("--hs-scale", String(entry.contentRect.width / 640)));
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  // 흰 첫 화면(is-light)이 헤더 아래로 지나가면 is-past를 붙여 헤더를 원래 어두운 색으로 돌린다.
  useEffect(() => {
    const hero = rootRef.current?.closest<HTMLElement>(".ap-hero.is-light");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => hero.classList.toggle("is-past", !entry.isIntersecting), { rootMargin: "-72px 0px 0px 0px" });
    io.observe(hero);
    return () => { io.disconnect(); hero.classList.remove("is-past"); };
  }, []);

  const ctrlLabel = mode === "playing" ? c.pause : mode === "ended" ? c.replay : c.play;
  const CtrlIcon = mode === "playing" ? Pause : mode === "ended" ? RotateCcw : Play;
  const kindIcon = { paper: BookText, guide: BookOpen } as const;

  return (
    <div className="hs" ref={rootRef}>
      <div className="hs-stage" role="img" aria-label={label}>
        <div aria-hidden="true">
          <div className="hs-k hs-aurora" data-k="aurora"><i className="hs-blob a" /><i className="hs-blob b" /><i className="hs-blob c" /></div>

          {/* 논문 3단 화면: 목록 | 본문 | 알파닥 */}
          <div className="hs-k hs-pw" data-k="pw">
            <div className="hs-card">
              <div className="hs-k hs-pbar" data-k="pbar">
                <BookText strokeWidth={1.8} />{c.p.crumb[0]} › <b>{c.p.crumb[1]}</b>
                <span className="tg"><img src="/brand/alphadoc-alpha.svg" alt="" width={419} height={365} />{c.p.toggle}</span>
              </div>
              <i className="hs-pcol" style={{ left: 176 }} />
              <i className="hs-pcol" style={{ left: 404 }} />

              <div className="hs-k hs-lt" data-k="lt">{c.p.title}</div>
              <div className="hs-k hs-ls" data-k="ls">{c.p.sub}</div>
              <div className="hs-k hs-ltabs" data-k="ltabs">{c.p.tabs.map((tab) => <span key={tab}>{tab}</span>)}</div>
              <i className="hs-k hs-lsel" data-k="lsel" />
              {PAPERS.map(([title, meta], i) => (
                <div key={title} className={`hs-k hs-lc${i === 0 ? " on" : ""}`} data-k={`lc${i + 1}`} style={{ top: 104 + i * 86 }}>
                  <span className="hs-pill guide"><BookOpen size={9} strokeWidth={2.4} />{c.p.tag}</span>
                  <b>{title}</b>
                  <small>{meta}</small>
                </div>
              ))}

              <div className="hs-k hs-rbar" data-k="rbar"><b>{c.p.reading[0]}</b>{c.p.reading[1]}</div>
              <div className="hs-k hs-rt" data-k="rt">{READER_TITLE}</div>
              <div className="hs-k hs-rs" data-k="rs">{c.p.rSub}</div>
              <div className="hs-k hs-rm" data-k="rm">{READER_META}</div>
              <div className="hs-k hs-rl" data-k="rl">{c.p.abstract}</div>
              <div className="hs-k hs-rx hs-rx-hl" data-k="rh1"><ReaderText on={1} /></div>
              <div className="hs-k hs-rx hs-rx-hl" data-k="rh2"><ReaderText on={2} /></div>
              <div className="hs-k hs-rx" data-k="rx"><ReaderText /></div>
              <div className="hs-k hs-rbars" data-k="rbars"><i style={{ width: "96%" }} /><i style={{ width: "88%" }} /><i style={{ width: "64%" }} /></div>

              <div className="hs-k hs-ah" data-k="ah"><img src="/brand/alphadoc-alpha.svg" alt="" width={419} height={365} />{c.brand}<X strokeWidth={1.8} /></div>
              <div className="hs-k hs-ae" data-k="ae">
                <img src="/brand/alphadoc-alpha.svg" alt="" width={419} height={365} />
                <b>{c.p.empty[0]}</b>
                <small>{c.p.empty[1]}</small>
              </div>
              <div className="hs-k hs-aq" data-k="aq">{c.p.q}</div>
              <i className="hs-k hs-think" data-k="think2" style={{ left: 416, top: 112, width: 14, height: 14 }} />
              {[150, 128, 96].map((w, i) => <i key={w} className="hs-k hs-sh" data-k={`sh${i + 4}`} style={{ left: 438, top: 113 + i * 13, width: w }} />)}
              <div className="hs-k hs-aa0" data-k="aa0">{c.p.lead}</div>
              {c.p.bullets.map((text, i) => (
                <div key={text} className="hs-k hs-ab" data-k={`ab${i + 1}`} style={{ top: [144, 168, 204][i] }}>
                  <span>{text}{i < 2 && <span className="hs-cite" data-k={`cite${i + 1}`}>{i + 1}</span>}</span>
                </div>
              ))}
              <div className="hs-k hs-asrc" data-k="asrc">{c.p.evidence}<span className="hs-pill paper"><BookText size={9} strokeWidth={2.4} />Rybak 2020</span></div>
              <div className="hs-k hs-ac" data-k="ac">
                <span className="hs-k hs-aph" data-k="aph">{c.p.ph}</span>
                <span className="hs-k hs-apl" data-k="pline"><span data-k="pq">{c.p.q}</span></span>
                <span className="hs-k hs-plus"><Plus strokeWidth={1.8} /></span>
                <span className="hs-k hs-scope on"><BookText strokeWidth={1.8} />{c.p.scope}</span>
                <span className="hs-k hs-send"><span><ArrowUp strokeWidth={2.2} /></span><span className="on" data-k="send2On"><ArrowUp strokeWidth={2.2} /></span></span>
              </div>
            </div>
          </div>

          {/* 떠 있는 말풍선: 알파닥 실제 탭 아이콘 (논문·지침·게시판·새 노트·즐겨찾기·새 대화·홈·내 노트) */}
          <div className="hs-k" data-k="b1" style={{ left: 128, top: 148 }}><span className="hs-bob"><span className="hs-bubble k-paper"><BookText strokeWidth={1.9} /></span></span></div>
          <div className="hs-k" data-k="b2" style={{ left: 478, top: 146 }}><span className="hs-bob d1"><span className="hs-bubble k-guide"><BookOpen strokeWidth={1.9} /></span></span></div>
          <div className="hs-k" data-k="b3" style={{ left: 106, top: 358 }}><span className="hs-bob d2"><span className="hs-bubble k-board"><ClipboardList strokeWidth={1.9} /></span></span></div>
          <div className="hs-k" data-k="b4" style={{ left: 500, top: 366 }}><span className="hs-bob d3"><span className="hs-bubble k-note"><SquarePen strokeWidth={1.9} /></span></span></div>
          <div className="hs-k" data-k="tFav" style={{ left: 460, top: 248 }}><span className="hs-bob d2"><span className="hs-bubble k-fav"><Star strokeWidth={1.9} /></span></span></div>
          <div className="hs-k" data-k="tChat" style={{ left: 136, top: 250 }}><span className="hs-bob d1"><span className="hs-bubble k-chat"><MessageSquare strokeWidth={1.9} /></span></span></div>

          {/* 자료 아이콘 줄 */}
          <div className="hs-k" data-k="i1" style={{ left: 198, top: 78 }}><span className="hs-bubble sm k-paper"><BookText strokeWidth={1.9} /></span></div>
          <div className="hs-k" data-k="i2" style={{ left: 250, top: 78 }}><span className="hs-bubble sm k-guide"><BookOpen strokeWidth={1.9} /></span></div>
          <div className="hs-k" data-k="i4" style={{ left: 354, top: 78 }}><span className="hs-bubble sm k-board"><ClipboardList strokeWidth={1.9} /></span></div>
          <div className="hs-k" data-k="i5" style={{ left: 406, top: 78 }}><span className="hs-bubble sm k-note"><SquarePen strokeWidth={1.9} /></span></div>

          {/* 노트 창 */}
          <div className="hs-k hs-win" data-k="win">
            <div className="hs-card">
              <div className="hs-k hs-win-bar"><SquarePen strokeWidth={1.8} />{c.crumb[0]} › <b style={{ color: "var(--hs-ink)", fontWeight: 600 }}>{c.crumb[1]}</b></div>
              <div className="hs-k hs-n-title" data-k="ntitle">{c.nTitle}</div>
              <div className="hs-k hs-n-meta" data-k="nmeta">{c.nMeta}</div>
              {c.nb.map((text, i) => <div key={text} className="hs-k hs-nb" data-k={`nb${i + 1}`} style={{ top: 100 + i * 22 }}>{text}</div>)}
              <div className="hs-k hs-nsec" data-k="nsec">
                <div className="is-h6">{c.dec}</div>
                <p>{c.decText}</p>
                <div className="is-h6">{c.todo}</div>
                {c.todos.map((text, i) => (
                  <div key={text} className="hs-todo"><span className="hs-box"><span className="hs-k hs-ck" data-k={`ck${i + 1}`}><Check strokeWidth={3} /></span></span>{text}</div>
                ))}
              </div>
            </div>
          </div>

          {/* 노트 주변 장식 */}
          <div className="hs-k" data-k="doc1" style={{ left: 50, top: 420 }}><div className="hs-doc"><em className="k-board"><ClipboardList strokeWidth={2} />{c.docs[0]}</em><i style={{ width: "92%" }} /><i style={{ width: "70%" }} /><i style={{ width: "80%" }} /></div></div>
          <div className="hs-k" data-k="doc2" style={{ left: 190, top: 432 }}><div className="hs-doc"><em className="k-paper"><BookText strokeWidth={2} />{c.docs[1]}</em><i style={{ width: "88%" }} /><i style={{ width: "76%" }} /><i style={{ width: "60%" }} /></div></div>
          <div className="hs-k" data-k="d1" style={{ left: 12, top: 82 }}><span className="hs-bob"><span className="hs-bubble k-board" style={{ position: "relative" }}><ClipboardList strokeWidth={1.9} /><span className="hs-tag">{c.must}</span></span></span></div>
          <div className="hs-k" data-k="tHome" style={{ left: 350, top: 74 }}><span className="hs-bob d1"><span className="hs-bubble k-home"><House strokeWidth={1.9} /></span></span></div>
          <div className="hs-k" data-k="tNotes" style={{ left: 0, top: 333 }}><span className="hs-bob d3"><span className="hs-bubble k-notes"><FileText strokeWidth={1.9} /></span></span></div>

          {/* 알파닥 창 */}
          <div className="hs-k hs-panel" data-k="panel">
            <div className="hs-card">
              <div className="hs-k hs-head" data-k="head"><img data-k="headMark" src="/brand/alphadoc-alpha.svg" alt="" width={419} height={365} />{c.brand}<X strokeWidth={1.8} /></div>

              <div className="hs-k hs-fill" data-k="intro">
                <div className="hs-k hs-greet1" data-k="greet1">{c.greet1}</div>
                <div className="hs-k hs-greet2" data-k="greet2">{c.greet2}</div>
                <div className="hs-k hs-menu-title" data-k="mtitle">{c.menu}</div>
                <i className="hs-k hs-hl" data-k="hl" />
                {c.rows.map(([name, sub], i) => {
                  const Icon = [Layers, Library, FileText, ClipboardList][i];
                  const tone = [["#0064e1", "#e6f0fd"], ["#16a34a", "#e6f4ea"], ["#8b5cf6", "#f1ebff"], ["#f97316", "#fff1e6"]][i];
                  return (
                    <div key={name} className="hs-k hs-row" data-k={`m${i + 1}`} style={{ top: 128 + i * 36 }}>
                      <span className="ic" style={{ color: tone[0], background: tone[1] }}><Icon strokeWidth={2} /></span>
                      <b>{name}</b><small>{sub}</small>
                    </div>
                  );
                })}
              </div>

              <div className="hs-k hs-comp" data-k="comp">
                <span className="hs-k hs-ph" data-k="ph">{c.ph}</span>
                <span className="hs-k hs-line" data-k="line">
                  <span className="hs-chip board" data-k="chip"><ClipboardList strokeWidth={2} />{c.chip}</span>
                  <span data-k="q">{c.q}</span>
                </span>
                <span className="hs-k hs-plus"><Plus strokeWidth={1.8} /></span>
                <span className="hs-k hs-scope" data-k="scopeA"><Library strokeWidth={1.8} />{c.scope}<ChevronDown strokeWidth={1.8} /></span>
                <span className="hs-k hs-scope on" data-k="scopeB"><Library strokeWidth={1.8} />{c.scopeOn}<ChevronDown strokeWidth={1.8} /></span>
                <span className="hs-k hs-send"><span><ArrowUp strokeWidth={2.2} /></span><span className="on" data-k="sendOn"><ArrowUp strokeWidth={2.2} /></span></span>
              </div>

              <div className="hs-k hs-qb" data-k="qb"><span className="hs-chip board"><ClipboardList strokeWidth={2} />{c.chip}</span>{c.q}</div>
              <i className="hs-k hs-think" data-k="think" />
              {[220, 190, 150].map((w, i) => <i key={w} className="hs-k hs-sh" data-k={`sh${i + 1}`} style={{ top: 106 + i * 14, width: w }} />)}
              <div className="hs-k hs-a-title" data-k="atitle">{c.aTitle}</div>
              <div className="hs-k hs-a-line" data-k="aline">{c.aLine} <span className="hs-pill board" data-k="p0" style={{ display: "inline-flex" }}>{c.pill0}</span></div>
              {c.rowsA.map(([item, after, kind, pill], i) => {
                const Icon = kindIcon[kind as "paper" | "guide"];
                return (
                  <div key={item} className="hs-k hs-r" data-k={`r${i + 1}`} style={{ top: 162 + i * 26 }}>
                    <b>{item}</b>
                    <span>{after}<span className={`hs-pill ${kind}`} data-k={`p${i + 1}`}><Icon size={9} strokeWidth={2.4} />{pill}</span></span>
                  </div>
                );
              })}
              <div className="hs-k hs-srcs" data-k="srcs">
                {c.sources}
                <span className="hs-pill board" data-k="sc1">{c.kinds[0]}</span>
                <span className="hs-pill guide" data-k="sc2">{c.kinds[1]}</span>
                <span className="hs-pill paper" data-k="sc3">{c.kinds[2]}</span>
              </div>
              <div className="hs-k hs-acts" data-k="acts">
                <Copy strokeWidth={1.8} />
                <span className="hs-star"><Star strokeWidth={1.8} /><span className="hs-k hs-star-on" data-k="starOn"><Star strokeWidth={1.8} /></span></span>
                <RotateCcw strokeWidth={1.8} />
              </div>

              <div className="hs-k hs-ins" data-k="ins">
                <p>{c.ins}</p>
                <span className="hs-k hs-ins-btn" data-k="insBtn"><Plus strokeWidth={2.4} />{c.insBtn}</span>
                <span className="hs-k hs-ins-btn done" data-k="insDone"><Check strokeWidth={2.6} />{c.insDone}</span>
              </div>
            </div>
          </div>

          {/* 미니 메뉴 */}
          <div className="hs-k hs-rail" data-k="rail">
            <i className="hs-k hs-rail-hl" data-k="railHl" />
            {[MessageSquare, SquarePen, FileText].map((Icon, i) => (
              <span key={c.rail[i]} className="hs-k hs-rail-i" style={{ top: 12 + i * 44 }}><Icon strokeWidth={1.8} />{c.rail[i]}</span>
            ))}
          </div>

          {/* α 마크 */}
          <div className="hs-k hs-mark" data-k="mark"><span className="hs-mark-ring" /><span className="hs-mark-core"><img src="/brand/alphadoc-alpha.svg" alt="" width={419} height={365} /></span></div>

          {/* 노트로 날아가는 카드 */}
          <div className="hs-k hs-fly" data-k="fly"><i />{c.fly}</div>
        </div>
      </div>

      <button type="button" className="hs-ctrl" onClick={toggle} aria-label={ctrlLabel}>
        <svg className="hs-ring" viewBox="0 0 40 40" aria-hidden="true">
          <circle className="track" cx="20" cy="20" r="18" />
          <circle ref={barRef} className="bar" cx="20" cy="20" r="18" strokeDasharray={2 * Math.PI * 18} strokeDashoffset={2 * Math.PI * 18} />
        </svg>
        <CtrlIcon className="ico" strokeWidth={2.4} aria-hidden="true" />
      </button>
    </div>
  );
}
