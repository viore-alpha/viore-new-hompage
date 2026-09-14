/* eslint-disable @next/next/no-img-element -- Alphadoc UI icons are served from the product asset registry. */
"use client";

import type { Language } from "@/app/site-content";
import { useViewportMotion } from "@/app/components/useViewportMotion";
import { ArrowUp } from "lucide-react";

const ALPHADOC_ASSET_ROOT = "https://alphadoc.ai";

const motionCopy = {
  ko: {
    label: "임상 모드에서 일반 모드로 전환한 뒤 일상적인 질문을 주고받는 알파닥 일반대화 애니메이션",
    panel: "알파닥스",
    clinical: "임상",
    general: "일반",
    clinicalPlaceholder: "임상 질문을 물어봐 주세요",
    generalPlaceholder: "메시지를 입력하세요",
    question: "드립 커피 원두는 어떻게 보관하면 좋아?",
    answerLead: "빛과 공기, 열과 습기를 피하는 게 핵심이에요.",
    answerLines: [
      "밀폐 용기에 소분해 두세요.",
      "서늘하고 어두운 곳에 보관하세요.",
      "내리기 직전에 필요한 만큼만 갈아 쓰세요.",
    ],
  },
  en: {
    label: "An Alphadoc animation switching from Clinical to General mode for an everyday question and answer",
    panel: "Alphadocs",
    clinical: "Clinical",
    general: "General",
    clinicalPlaceholder: "Ask a clinical question",
    generalPlaceholder: "Type a message",
    question: "What is the best way to store coffee beans for pour-over?",
    answerLead: "Keep them away from light, air, heat, and moisture.",
    answerLines: [
      "Store small portions in an airtight container.",
      "Keep the container somewhere cool and dark.",
      "Grind only what you need right before brewing.",
    ],
  },
} as const;

export function AlphadocGeneralChatMotion({ language }: { language: Language }) {
  const copy = motionCopy[language];
  const { ref, reducedMotion, shouldAnimate } = useViewportMotion<HTMLDivElement>(0.16);

  return (
    <div
      ref={ref}
      className={`ap-general-motion${shouldAnimate ? " is-playing" : ""}${reducedMotion ? " is-reduced" : ""}`}
      data-motion-active={shouldAnimate ? "true" : "false"}
      role="img"
      aria-label={copy.label}
    >
      <div className="ap-general-window" aria-hidden="true">
        <header className="ap-general-app-header">
          <span className="ap-general-brand">
            <img src={`${ALPHADOC_ASSET_ROOT}/brand/symbol/alpha.png`} alt="" width="419" height="365" decoding="async" />
          </span>
          <span className="ap-general-header-actions">
            <span className="ap-general-panel-action">
              <img src={`${ALPHADOC_ASSET_ROOT}/brand/alphadocs-front/logo.svg`} alt="" width="32" height="32" decoding="async" />
              <b>{copy.panel}</b>
            </span>
            <span className="ap-general-header-action">
              <img src={`${ALPHADOC_ASSET_ROOT}/brand/feature-icons/header/notification/logo.svg`} alt="" width="28" height="28" decoding="async" />
            </span>
            <span className="ap-general-header-action">
              <img src={`${ALPHADOC_ASSET_ROOT}/brand/feature-icons/header/profile-menu/logo.svg`} alt="" width="28" height="28" decoding="async" />
            </span>
          </span>
        </header>

        <main className="ap-general-chat-center">
          <div className="ap-general-chat-scroll">
            <section className="ap-general-conversation">
              <div className="ap-general-user-row">
                <p>{copy.question}</p>
                <time>{language === "ko" ? "오전 10:24" : "10:24 AM"}</time>
              </div>

              <article className="ap-general-answer">
                <p className="ap-general-answer-lead">{copy.answerLead}</p>
                <ul>
                  {copy.answerLines.map((line) => <li key={line}>{line}</li>)}
                </ul>
              </article>
            </section>
          </div>

          <div className="ap-general-composer-dock">
            <div className="ap-general-mode-control">
              <i className="ap-general-mode-pill" />
              <span className="ap-general-mode-label is-clinical">{copy.clinical}</span>
              <span className="ap-general-mode-label is-general">{copy.general}</span>
            </div>
            <div className="ap-general-composer">
              <span className="ap-general-attach">
                <img src={`${ALPHADOC_ASSET_ROOT}/brand/feature-icons/chat/attach/logo.svg`} alt="" width="30" height="30" decoding="async" />
              </span>
              <span className="ap-general-input-shell">
                <span className="ap-general-composer-copy">
                  <span className="ap-general-placeholder ap-general-placeholder--clinical">{copy.clinicalPlaceholder}</span>
                  <span className="ap-general-placeholder ap-general-placeholder--general">{copy.generalPlaceholder}</span>
                  <span className="ap-general-typed-question">{copy.question}</span>
                </span>
                <span className="ap-general-send">
                  <ArrowUp aria-hidden="true" strokeWidth={2.7} />
                </span>
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
