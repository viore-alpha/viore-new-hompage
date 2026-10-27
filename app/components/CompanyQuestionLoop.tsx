"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Language } from "@/app/site-content";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const typingDelay = 54;
const deletingDelay = 26;
const holdDelay = 1_650;
const nextQuestionDelay = 420;

/* What Alphadoc users ask at work: clinical evidence, internal policies, trial safety,
   meeting notes and papers. Kept short enough for the field at phone width. */
const alphadocQuestions = {
  ko: [
    "패혈성 쇼크 첫 1시간 처치 순서는?",
    "개정된 항생제 지침에서 바뀐 점은?",
    "임상시험 SUSAR 보고 기한은?",
    "조영제 과민반응 전처치 기준은?",
    "지난 회의록에서 할 일만 정리해 줘",
    "논문을 TRIPOD+AI로 점검해 줘",
  ],
  en: [
    "First-hour steps in septic shock?",
    "Antibiotic policy: what changed?",
    "SUSAR reporting deadlines?",
    "Premedication for contrast allergy?",
    "Pull the to-dos from our minutes",
    "Check this paper with TRIPOD+AI",
  ],
} as const;

type TypingState = {
  questionIndex: number;
  visibleLength: number;
  phase: "typing" | "deleting";
};

function subscribeToReducedMotion(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return typeof window === "undefined" || window.matchMedia(reducedMotionQuery).matches;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => true);
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="13" cy="13" r="8.5" />
      <path d="m19.5 19.5 8 8" />
    </svg>
  );
}

function SubmitIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 25V7M16 7l-7 7M16 7l7 7" />
    </svg>
  );
}

export function CompanyQuestionLoop({ language }: { language: Language }) {
  const questions = alphadocQuestions[language];
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const supportsIntersectionObserver =
    typeof window !== "undefined" && "IntersectionObserver" in window;
  const [isVisible, setIsVisible] = useState(false);
  const [typing, setTyping] = useState<TypingState>({
    questionIndex: 0,
    visibleLength: 0,
    phase: "typing",
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !supportsIntersectionObserver) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.22 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [supportsIntersectionObserver]);

  const isMotionActive = isVisible || !supportsIntersectionObserver;

  useEffect(() => {
    if (!isMotionActive || reduceMotion) return;

    const question = questions[typing.questionIndex];
    const delay = typing.phase === "typing"
      ? typing.visibleLength < question.length ? typingDelay : holdDelay
      : typing.visibleLength > 0 ? deletingDelay : nextQuestionDelay;

    const timer = window.setTimeout(() => {
      setTyping((current) => {
        const currentQuestion = questions[current.questionIndex];
        if (current.phase === "typing") {
          if (current.visibleLength < currentQuestion.length) {
            return { ...current, visibleLength: current.visibleLength + 1 };
          }
          return { ...current, phase: "deleting" };
        }
        if (current.visibleLength > 0) {
          return { ...current, visibleLength: current.visibleLength - 1 };
        }
        return {
          questionIndex: (current.questionIndex + 1) % questions.length,
          visibleLength: 0,
          phase: "typing",
        };
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isMotionActive, questions, reduceMotion, typing]);

  const currentQuestion = questions[typing.questionIndex];
  const visibleQuestion = reduceMotion
    ? questions[0]
    : currentQuestion.slice(0, typing.visibleLength);
  const motionState = reduceMotion ? "reduced" : isMotionActive ? "playing" : "paused";
  const label = language === "ko"
    ? `알파닥 질문 입력 예시: ${questions.join(", ")}`
    : `Alphadoc question examples: ${questions.join(", ")}`;

  return (
    <div
      ref={rootRef}
      className="company-question-loop"
      data-motion={motionState}
      role="img"
      aria-label={label}
    >
      <span className="company-question-search" aria-hidden="true"><SearchIcon /></span>
      <span className="company-question-typed" aria-hidden="true">
        {visibleQuestion}
        {!reduceMotion && <i className="company-question-cursor" />}
      </span>
      <span className="company-question-submit" aria-hidden="true"><SubmitIcon /></span>
    </div>
  );
}
