"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Language } from "@/app/site-content";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const typingDelay = 54;
const deletingDelay = 26;
const holdDelay = 1_650;
const nextQuestionDelay = 420;

const clinicalQuestions = {
  ko: [
    "패혈증 초기 처치는?",
    "급성 흉통 위험 신호는?",
    "심방세동 항응고 기준은?",
    "신기능 저하 시 용량 조정은?",
    "당뇨병 혈당 목표는?",
  ],
  en: [
    "Initial care for sepsis?",
    "Red flags in acute chest pain?",
    "When to anticoagulate AF?",
    "Dose adjustment in renal impairment?",
    "Glycemic targets in diabetes?",
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

function PlusIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 7v18M7 16h18" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m4 6 4 4 4-4" />
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
  const questions = clinicalQuestions[language];
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
    ? `알파닥 임상 질문 입력 예시: ${questions.join(", ")}`
    : `Alphadoc clinical question examples: ${questions.join(", ")}`;

  return (
    <div
      ref={rootRef}
      className="company-question-loop"
      data-motion={motionState}
      role="img"
      aria-label={label}
    >
      <span className="company-question-search" aria-hidden="true"><PlusIcon /></span>
      <span className="company-question-typed" aria-hidden="true">
        {visibleQuestion}
        {!reduceMotion && <i className="company-question-cursor" />}
      </span>
      <span className="company-question-scope" aria-hidden="true">{language === "ko" ? "자료" : "Sources"}<ChevronIcon /></span>
      <span className="company-question-submit" aria-hidden="true"><SubmitIcon /></span>
    </div>
  );
}
