/* eslint-disable @next/next/no-img-element -- Alphadoc app icons are served from the product asset registry. */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Language } from "@/app/site-content";
import { useViewportMotion } from "@/app/components/useViewportMotion";

type MotionPhase = "intro" | "attaching" | "typing" | "submitting" | "thinking" | "answer";

type MotionAttachment = {
  kind: "image" | "pdf";
  src: string | null;
  name: string;
  meta: string;
};

type MotionInteraction = {
  attachment: MotionAttachment | null;
  questionParts: string[];
  time: string;
  thinking: string;
  answerLeadStart: string;
  answerLeadPrimary: string;
  answerLeadBetween: string;
  answerLeadSecondary: string;
  answerLeadEnd: string;
  answerPoints: [string, string][];
  cautionTitle: string;
  cautionPoints: string[];
  suggestions: string[];
};

type MotionCopy = {
  brand: string;
  headline: string;
  placeholder: string;
  medicalNotice: string;
  sequenceLabel: string;
  prompts: string[];
  actionLabels: string[];
  interactions: MotionInteraction[];
};

const xrayAsset = "/assets/product/alphadoc/generated/synthetic-chest-xray-rll-optimized.webp";
const alphadocAssetRoot = "https://alphadoc.ai";

const heroAppIcons = [
  "/brand/feature-icons/functions/soap/logo.svg",
  "/brand/feature-icons/functions/guide/logo.svg",
  "/brand/feature-icons/functions/drug/logo.svg",
  "/brand/feature-icons/functions/medical-tools/logo.svg",
  "/brand/feature-icons/functions/document-translation/logo.svg",
  "/brand/feature-icons/functions/medical-notices/logo.png",
  "/brand/feature-icons/panel/paper/logo.svg",
  "/brand/feature-icons/panel/guideline/logo.svg",
] as const;

const MOTION_TIMING = {
  introDelay: 520,
  attachmentDelay: 280,
  typingInterval: 16,
  typingStep: 5,
  submitDelay: 120,
  thinkingDelay: 300,
  answerDelay: 640,
  nextInteractionDelay: 2600,
  restartDelay: 2600,
} as const;

const motionCopy: Record<Language, MotionCopy> = {
  ko: {
    brand: "알파닥",
    headline: "의료인들의 하루를 바꾸는 워크스페이스",
    placeholder: "임상 질문을 물어봐 주세요",
    medicalNotice: "알파닥의 답변은 의료인께서 판단하시는 데 참고로만 사용해 주세요.",
    sequenceLabel: "텍스트 임상 질문에 이어 예시 흉부 X-ray와 논문 PDF를 첨부해 답변받는 3단계 데모",
    prompts: ["패혈증 진단 기준은?", "급성 심근경색 초기 처치는?", "심부전 NYHA 분류는?"],
    actionLabels: ["복사", "저장", "좋아요", "싫어요"],
    interactions: [
      {
        attachment: null,
        questionParts: [
          "38세 여성, Hb 8.1, 혈소판 18,000, schistocyte, LDH 1,240, Cr 1.4,",
          "PT/aPTT 정상이며 혼돈이 있습니다.",
          "TTP와 DIC를 감별하고 즉시 처치를 정리해줘.",
        ],
        time: "오전 01:33",
        thinking: "답변을 준비하고 있어요",
        answerLeadStart: "제시된 소견은 ",
        answerLeadPrimary: "혈전성 혈소판감소성 자반증(Thrombotic Thrombocytopenic Purpura, TTP)",
        answerLeadBetween: "에 매우 합당하며, ",
        answerLeadSecondary: "파종성 혈관내 응고(DIC)",
        answerLeadEnd: "보다 우선 가능성이 높습니다.",
        answerPoints: [
          ["핵심 감별:", "미세혈관병성 용혈성 빈혈, 중증 혈소판감소, 신경학적 증상과 정상 PT/aPTT 조합은 TTP를 강하게 시사합니다."],
          ["DIC와의 차이:", "DIC는 흔히 PT/aPTT 연장, fibrinogen 감소, D-dimer 상승이 동반되므로 해당 수치를 동시에 확인합니다."],
          ["ADAMTS13·PLASMIC:", "혈장치료 전 ADAMTS13 검체를 채취하고 PLASMIC score를 계산하되, 결과를 기다리며 치료를 미루지 않습니다."],
          ["즉시 처치:", "혈액내과에 긴급 협진해 혈장교환과 전신 스테로이드를 시작하고, 후천성 TTP가 의심되면 caplacizumab을 고려합니다."],
        ],
        cautionTitle: "임상적 주의사항:",
        cautionPoints: [
          "생명을 위협하는 출혈이 아니라면 혈소판 수혈은 피하고 심장·신경·신장 손상을 함께 감시합니다.",
          "패혈증이나 산과적 합병증 등 DIC 유발 요인이 있으면 원인 평가와 처치를 병행합니다.",
        ],
        suggestions: ["PLASMIC score도 계산할까요?", "초기 처치 순서를 볼까요?"],
      },
      {
        attachment: {
          kind: "image",
          src: xrayAsset,
          name: "Chest_PA_example.jpg",
          meta: "흉부 X-ray · 예시 이미지",
        },
        questionParts: [
          "이 흉부 X-ray에서 우하폐야 음영을 판독하고",
          "다음 검사와 초기 처치를 정리해줘.",
        ],
        time: "오전 01:34",
        thinking: "영상을 확인하고 있어요",
        answerLeadStart: "첨부 영상에서는 ",
        answerLeadPrimary: "우하폐야의 국소 공기공간 음영",
        answerLeadBetween: "이 보여 ",
        answerLeadSecondary: "우하엽 폐렴",
        answerLeadEnd: "이 우선 의심되며, 판상 무기폐를 함께 감별해야 합니다.",
        answerPoints: [
          ["영상 소견:", "우측 하부에 경계가 불분명한 경결성 음영이 있으며 뚜렷한 흉수나 기흉은 보이지 않습니다."],
          ["임상 연계:", "발열, 기침, 저산소증과 청진 소견을 확인하고 CBC, CRP, 산소포화도 등과 함께 해석합니다."],
          ["다음 단계:", "불안정하면 산소공급과 경험적 치료를 지체하지 말고, 진단이 불명확하거나 경과가 비전형적이면 추가 영상검사를 고려합니다."],
        ],
        cautionTitle: "판독 시 주의사항:",
        cautionPoints: [
          "단일 정면 영상만으로 확진하지 않으며 이전 영상, 촬영 자세와 임상 경과를 함께 비교합니다.",
        ],
        suggestions: ["폐렴 중증도를 평가할까요?", "항생제 선택을 볼까요?"],
      },
      {
        attachment: {
          kind: "pdf",
          src: null,
          name: "Early_Vasopressor_RCT.pdf",
          meta: "PDF · 12쪽 · 2.4 MB",
        },
        questionParts: [
          "이 논문의 PICO, 주요 결과와 한계를 정리하고",
          "실제 진료에 적용할 점을 요약해줘.",
        ],
        time: "오전 01:35",
        thinking: "논문을 읽고 근거를 정리하고 있어요",
        answerLeadStart: "업로드한 논문은 ",
        answerLeadPrimary: "패혈성 쇼크에서의 조기 승압제 전략",
        answerLeadBetween: "이 ",
        answerLeadSecondary: "초기 혈역학적 안정화",
        answerLeadEnd: "에 미치는 영향을 평가한 무작위 연구입니다.",
        answerPoints: [
          ["PICO:", "성인 패혈성 쇼크 환자에서 조기 norepinephrine 전략을 표준 소생 전략과 비교했습니다."],
          ["주요 결과:", "조기 전략군은 목표 평균동맥압 도달 시간이 짧았지만 환자 중심 장기 결과는 신뢰구간과 함께 해석해야 합니다."],
          ["적용 가능성:", "수액 반응성, 말초 관류와 심기능을 반복 평가하면서 과도한 수액을 피하려는 상황에 참고할 수 있습니다."],
          ["한계:", "단일 연구의 표본 규모, 기관별 치료 프로토콜과 제외 기준 때문에 모든 환자군으로 일반화하기 어렵습니다."],
        ],
        cautionTitle: "근거 적용 시 주의사항:",
        cautionPoints: [
          "초록만이 아니라 원문 방법론과 부록을 확인하고 최신 가이드라인 및 환자별 금기와 함께 판단합니다.",
        ],
        suggestions: ["근거표로 정리할까요?", "가이드라인과 비교할까요?"],
      },
    ],
  },
  en: {
    brand: "Alphadoc",
    headline: "The workspace changing every clinician's day",
    placeholder: "Ask a clinical question",
    medicalNotice: "Use Alphadoc answers only as a reference for clinical judgment.",
    sequenceLabel: "A three-step demo that answers a clinical text question, an example chest X-ray attachment, and an uploaded paper PDF",
    prompts: ["Sepsis criteria?", "Initial care for acute MI?", "NYHA classification?"],
    actionLabels: ["Copy", "Save", "Like", "Dislike"],
    interactions: [
      {
        attachment: null,
        questionParts: [
          "A 38-year-old woman has Hb 8.1, platelets 18,000, schistocytes, LDH 1,240, Cr 1.4,",
          "normal PT/aPTT, and confusion.",
          "Differentiate TTP from DIC and outline immediate management.",
        ],
        time: "1:33 AM",
        thinking: "Preparing an answer",
        answerLeadStart: "These findings are highly consistent with ",
        answerLeadPrimary: "thrombotic thrombocytopenic purpura (TTP)",
        answerLeadBetween: " and make ",
        answerLeadSecondary: "disseminated intravascular coagulation (DIC)",
        answerLeadEnd: " less likely as the leading diagnosis.",
        answerPoints: [
          ["Key distinction:", "Microangiopathic hemolytic anemia, severe thrombocytopenia, neurologic symptoms, and normal PT/aPTT strongly favor TTP."],
          ["Compared with DIC:", "DIC more often causes prolonged PT/aPTT, low fibrinogen, and elevated D-dimer; check these in parallel."],
          ["ADAMTS13 and PLASMIC:", "Draw ADAMTS13 before plasma therapy and calculate a PLASMIC score, but do not delay treatment for the result."],
          ["Immediate care:", "Obtain urgent hematology input, start plasma exchange and systemic steroids, and consider caplacizumab for suspected acquired TTP."],
        ],
        cautionTitle: "Clinical considerations:",
        cautionPoints: [
          "Avoid platelet transfusion unless bleeding is life-threatening, and monitor cardiac, neurologic, and renal injury.",
          "If a strong DIC trigger such as sepsis or an obstetric complication exists, evaluate and treat it concurrently.",
        ],
        suggestions: ["Calculate the PLASMIC score?", "Review the first-hour steps?"],
      },
      {
        attachment: {
          kind: "image",
          src: xrayAsset,
          name: "Chest_PA_example.jpg",
          meta: "Chest X-ray · example image",
        },
        questionParts: [
          "Interpret the right lower-lung opacity on this chest X-ray",
          "and outline the next tests and initial management.",
        ],
        time: "1:34 AM",
        thinking: "Reviewing the image",
        answerLeadStart: "The attachment shows a ",
        answerLeadPrimary: "focal right lower-lung air-space opacity",
        answerLeadBetween: " that favors ",
        answerLeadSecondary: "right lower-lobe pneumonia",
        answerLeadEnd: ", with plate-like atelectasis remaining in the differential.",
        answerPoints: [
          ["Imaging finding:", "There is an ill-defined consolidative opacity at the right base without an obvious pleural effusion or pneumothorax."],
          ["Clinical correlation:", "Check fever, cough, oxygenation, and auscultation findings, and interpret the film with CBC, CRP, and pulse oximetry."],
          ["Next step:", "If unstable, do not delay oxygen and empiric treatment; consider additional imaging when the diagnosis or clinical course is atypical."],
        ],
        cautionTitle: "Interpretation note:",
        cautionPoints: [
          "Do not diagnose from a single frontal image alone; compare prior imaging, positioning, and the patient's clinical trajectory.",
        ],
        suggestions: ["Assess pneumonia severity?", "Review antibiotic options?"],
      },
      {
        attachment: {
          kind: "pdf",
          src: null,
          name: "Early_Vasopressor_RCT.pdf",
          meta: "PDF · 12 pages · 2.4 MB",
        },
        questionParts: [
          "Summarize this paper's PICO, key results, and limitations,",
          "then explain what is applicable in practice.",
        ],
        time: "1:35 AM",
        thinking: "Reading the paper and organizing the evidence",
        answerLeadStart: "The uploaded paper evaluates whether an ",
        answerLeadPrimary: "early vasopressor strategy in septic shock",
        answerLeadBetween: " improves ",
        answerLeadSecondary: "initial hemodynamic stabilization",
        answerLeadEnd: " in a randomized study.",
        answerPoints: [
          ["PICO:", "Adults with septic shock received either an early norepinephrine strategy or standard resuscitation."],
          ["Key result:", "The early-strategy group reached target mean arterial pressure sooner, while patient-centered long-term outcomes require confidence-interval-aware interpretation."],
          ["Applicability:", "It can inform care when repeatedly assessing fluid responsiveness, peripheral perfusion, and cardiac function while avoiding excess fluid."],
          ["Limitation:", "Sample size, site-specific protocols, and exclusion criteria limit broad generalization from a single study."],
        ],
        cautionTitle: "Evidence-use note:",
        cautionPoints: [
          "Review the full methods and supplement, then integrate the findings with current guidelines and patient-specific contraindications.",
        ],
        suggestions: ["Build an evidence table?", "Compare with guidelines?"],
      },
    ],
  },
};

function SubmitIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 25V7M16 7l-7 7M16 7l7 7" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="m11.2 16.8 8.9-8.9a5.2 5.2 0 0 1 7.4 7.4L14.9 27.9A8 8 0 0 1 3.6 16.6L16 4.2" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg viewBox="0 0 32 40" aria-hidden="true">
      <path d="M5 1.5h14l8 8V38.5H5z" />
      <path d="M19 1.5v8h8M10 18h12M10 23h12M10 28h8" />
    </svg>
  );
}

function CopyIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="12" height="12" rx="2" /><path d="M5 16H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1" /></svg>;
}

function BookmarkIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z" /></svg>;
}

function ThumbIcon({ down = false }: { down?: boolean }) {
  return (
    <svg className={down ? "is-down" : ""} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 10v11H3V10h4Zm0 9h10.2a2 2 0 0 0 1.9-1.4l2.1-7A2 2 0 0 0 19.3 8H15l.7-3.2A2.4 2.4 0 0 0 13.3 2L7 10v9Z" />
    </svg>
  );
}

function AttachmentCard({ attachment, mode }: { attachment: MotionAttachment; mode: "draft" | "message" }) {
  return (
    <div className={`ap-motion-file ap-motion-file--${attachment.kind} ap-motion-file--${mode}`}>
      <span className="ap-motion-file-preview">
        {attachment.kind === "image" && attachment.src ? (
          <Image src={attachment.src} alt="" width={320} height={260} />
        ) : (
          <span className="ap-motion-file-pdf"><PdfIcon /><b>PDF</b></span>
        )}
      </span>
      <span className="ap-motion-file-copy">
        <strong>{attachment.name}</strong>
        <small>{attachment.meta}</small>
      </span>
    </div>
  );
}

export function AlphadocHeroMotion({ language, label }: { language: Language; label: string }) {
  const copy = motionCopy[language];
  const { ref: motionRef, inView, reducedMotion, shouldAnimate } = useViewportMotion<HTMLDivElement>(0.18);
  const [phase, setPhase] = useState<MotionPhase>("intro");
  const [interactionIndex, setInteractionIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;
    const timeouts = new Set<number>();
    let typingTimer = 0;
    let disposed = false;
    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timeouts.delete(timer);
        if (!disposed) callback();
      }, delay);
      timeouts.add(timer);
    };

    function startInteraction(index: number) {
      setInteractionIndex(index);
      setTypedLength(0);
      if (copy.interactions[index].attachment) {
        setPhase("attaching");
        schedule(() => typeInteraction(index), MOTION_TIMING.attachmentDelay);
        return;
      }
      typeInteraction(index);
    }

    function restartSequence() {
      setInteractionIndex(0);
      setTypedLength(0);
      setPhase("intro");
      schedule(() => startInteraction(0), MOTION_TIMING.introDelay);
    }

    function typeInteraction(index: number) {
      const question = copy.interactions[index].questionParts.join(" ");
      setPhase("typing");
      let cursor = 0;
      typingTimer = window.setInterval(() => {
        cursor = Math.min(cursor + MOTION_TIMING.typingStep, question.length);
        setTypedLength(cursor);
        if (cursor < question.length) return;

        window.clearInterval(typingTimer);
        typingTimer = 0;
        schedule(() => setPhase("submitting"), MOTION_TIMING.submitDelay);
        schedule(() => setPhase("thinking"), MOTION_TIMING.thinkingDelay);
        schedule(() => setPhase("answer"), MOTION_TIMING.answerDelay);
        if (index < copy.interactions.length - 1) {
          schedule(() => startInteraction(index + 1), MOTION_TIMING.nextInteractionDelay);
        } else {
          schedule(restartSequence, MOTION_TIMING.restartDelay);
        }
      }, MOTION_TIMING.typingInterval);
    }

    schedule(restartSequence, 0);

    return () => {
      disposed = true;
      timeouts.forEach((timer) => window.clearTimeout(timer));
      timeouts.clear();
      if (typingTimer) window.clearInterval(typingTimer);
    };
  }, [copy.interactions, shouldAnimate]);

  const showReducedState = reducedMotion && inView;
  const isPlaying = shouldAnimate || showReducedState;
  const visiblePhase: MotionPhase = showReducedState ? "answer" : phase;
  const visibleInteractionIndex = showReducedState
    ? copy.interactions.length - 1
    : interactionIndex;
  const activeInteraction = copy.interactions[visibleInteractionIndex];
  const activeQuestion = activeInteraction.questionParts.join(" ");
  const visibleTypedLength = showReducedState ? activeQuestion.length : typedLength;
  const typedQuestion = activeQuestion.slice(0, visibleTypedLength);
  const isDraftingFollowup = visibleInteractionIndex > 0
    && (visiblePhase === "attaching" || visiblePhase === "typing" || visiblePhase === "submitting");
  const chatInteractionIndex = isDraftingFollowup
    ? visibleInteractionIndex - 1
    : visibleInteractionIndex;
  const chatInteraction = copy.interactions[chatInteractionIndex];
  const chatQuestion = chatInteraction.questionParts.join(" ");
  const actionIcons = [<CopyIcon key="copy" />, <BookmarkIcon key="bookmark" />, <ThumbIcon key="like" />, <ThumbIcon key="dislike" down />];

  return (
    <div
      ref={motionRef}
      className={`ap-hero-stage ap-hero-motion${isPlaying ? " is-playing" : ""} is-${visiblePhase}${visibleInteractionIndex > 0 ? " is-followup" : ""}${isDraftingFollowup ? " is-drafting-followup" : ""} is-step-${visibleInteractionIndex + 1}${reducedMotion ? " is-reduced" : ""}`}
      role="img"
      aria-label={`${label}. ${copy.sequenceLabel}`}
    >
      <div className="ap-hero-motion-scene" aria-hidden="true">
        <div className="ap-motion-compose">
          <div className="ap-motion-interface ap-motion-logo">
            <Image src="/brand/alphadoc-alpha.png" alt="" width={419} height={365} priority />
            <strong>{copy.brand}</strong>
          </div>

          <p className="ap-motion-headline">{copy.headline}</p>

          <div className={`ap-motion-interface ap-motion-search${visiblePhase === "typing" ? " is-typing" : ""}`}>
            <span className="ap-motion-attach"><AttachIcon /></span>
            <p className={typedQuestion ? "" : "is-placeholder"}>
              {typedQuestion || copy.placeholder}
              {visiblePhase === "typing" ? <i className="ap-motion-caret" /> : null}
            </p>
            <span className="ap-motion-submit"><SubmitIcon /></span>
          </div>

          <div className="ap-motion-prompts">
            {copy.prompts.map((prompt, index) => (
              <span className={`ap-motion-interface ap-motion-prompt ap-motion-prompt--${index + 1}`} key={prompt}>{prompt}</span>
            ))}
          </div>

          <div className="ap-motion-interface ap-motion-apps" aria-hidden="true">
            {heroAppIcons.map((icon) => (
              <span className="ap-motion-app" key={icon}>
                <img src={`${alphadocAssetRoot}${icon}`} alt="" width="48" height="48" decoding="async" />
              </span>
            ))}
          </div>
        </div>

        <div className="ap-motion-chat">
          <div className="ap-motion-chat-scroll">
            <div
              className={`ap-motion-chat-document${isDraftingFollowup ? " is-drafting" : ""}`}
              key={chatInteractionIndex}
            >
              <div className="ap-motion-user-row">
                <div className={`ap-motion-user-bubble${chatInteraction.attachment ? " has-attachment" : ""}`}>
                  {chatInteraction.attachment ? <AttachmentCard attachment={chatInteraction.attachment} mode="message" /> : null}
                  <p>{chatQuestion}</p>
                </div>
                <time>{chatInteraction.time}</time>
              </div>

              <div className="ap-motion-response">
                <div className="ap-motion-thinking">
                  <span><i /><i /><i /></span>
                  <p>{chatInteraction.thinking}</p>
                </div>

                <div className="ap-motion-answer">
                  <p className="ap-motion-answer-lead">
                    {chatInteraction.answerLeadStart}<strong>{chatInteraction.answerLeadPrimary}</strong>{chatInteraction.answerLeadBetween}<strong>{chatInteraction.answerLeadSecondary}</strong>{chatInteraction.answerLeadEnd}
                  </p>

                  <ul className="ap-motion-answer-list">
                    {chatInteraction.answerPoints.map(([name, detail]) => (
                      <li key={name}><i /><p><strong>{name}</strong> {detail}</p></li>
                    ))}
                  </ul>

                  <section className="ap-motion-caution">
                    <strong>{chatInteraction.cautionTitle}</strong>
                    <ul>
                      {chatInteraction.cautionPoints.map((point) => <li key={point}><i /><span>{point}</span></li>)}
                    </ul>
                  </section>

                  <div className="ap-motion-suggestions">
                    {chatInteraction.suggestions.map((suggestion) => <span key={suggestion}>{suggestion}</span>)}
                  </div>

                  <div className="ap-motion-answer-footer">
                    <div className="ap-motion-action-bar">
                      {actionIcons.map((icon, index) => <span key={copy.actionLabels[index]} aria-label={copy.actionLabels[index]}>{icon}</span>)}
                    </div>
                    <time>{chatInteraction.time}</time>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`ap-motion-composer${isDraftingFollowup ? " is-drafting" : ""}`}>
            {isDraftingFollowup && activeInteraction.attachment ? (
              <div className="ap-motion-composer-file">
                <AttachmentCard attachment={activeInteraction.attachment} mode="draft" />
              </div>
            ) : null}
            <span className="ap-motion-composer-attach"><AttachIcon /></span>
            <span className="ap-motion-composer-copy">
              <b className={isDraftingFollowup && !typedQuestion ? "is-placeholder" : ""}>
                {isDraftingFollowup ? typedQuestion || copy.placeholder : copy.placeholder}
                {isDraftingFollowup && visiblePhase === "typing" ? <i className="ap-motion-caret" /> : null}
              </b>
              <small>{copy.medicalNotice}</small>
            </span>
            <span className="ap-motion-composer-submit"><SubmitIcon /></span>
          </div>
        </div>
      </div>
    </div>
  );
}
