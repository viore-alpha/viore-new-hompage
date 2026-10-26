import {
  Check,
  ClipboardCheck,
  KeyRound,
  Lock,
  MessageSquare,
  ScanSearch,
  ShieldCheck,
  SlidersHorizontal,
  Undo2,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { ViewportMotion } from "@/app/components/ViewportMotion";
import type { Language } from "@/app/site-content";

/* Zero Trust step scene for the product security section.
   Steps follow the IR 2.1 Zero Trust slide at the same public level as Technology POST 08:
   step names only, no detection methods, thresholds or internal component names.
   The request uses a made-up staff name and phone number, never patient data. */

type Step = { icon: LucideIcon; title: string; detail: string };

const copy: Record<Language, {
  label: string;
  title: string;
  status: string;
  requestOriginal: [string, string, string, string];
  requestTokens: [string, string];
  steps: Step[];
  vault: string;
  vaultRows: [string, string];
  response: string;
  responseMeta: string;
  done: string;
}> = {
  ko: {
    label: "질문 하나가 요청 인증, 민감정보 치환, 입력 검증, 허용 모델 호출, 응답 검증과 복원, 감사 기록을 차례로 거쳐 답이 되는 흐름",
    title: "기관 단위 보안 체계",
    status: "구축 중",
    requestOriginal: ["", "김지원", " 선생님(", "010-1234-5678"],
    requestTokens: ["[이름 1]", "[전화 1]"],
    steps: [
      { icon: UserCheck, title: "요청 인증 · 권한 확인", detail: "요청마다 확인" },
      { icon: ScanSearch, title: "민감정보 탐지 · 치환", detail: "이름과 번호를 토큰으로" },
      { icon: ShieldCheck, title: "입력 검증", detail: "입력과 첨부 자료" },
      { icon: SlidersHorizontal, title: "허용 모델 게이트웨이", detail: "기관 정책에 맞는 모델만" },
      { icon: Undo2, title: "응답 검증 · 복원", detail: "누출 점검 뒤 권한 있을 때 복원" },
      { icon: ClipboardCheck, title: "감사 기록", detail: "기관 보관 정책 적용" },
    ],
    vault: "토큰 볼트",
    vaultRows: ["이름 1", "전화 1"],
    response: "김지원 선생님 주간 회의 요약",
    responseMeta: "검증된 응답",
    done: "통과",
  },
  en: {
    label: "One question passes request authentication, sensitive-data substitution, input validation, the permitted-model gateway, response validation and restoration, and an audit record before it becomes an answer",
    title: "Institution-level security",
    status: "In progress",
    requestOriginal: ["Summarize the meeting notes from ", "Jiwon Kim", " (", "010-1234-5678"],
    requestTokens: ["[Name 1]", "[Phone 1]"],
    steps: [
      { icon: UserCheck, title: "Authentication · access check", detail: "Every request" },
      { icon: ScanSearch, title: "Sensitive-data substitution", detail: "Names and numbers become tokens" },
      { icon: ShieldCheck, title: "Input validation", detail: "Inputs and attachments" },
      { icon: SlidersHorizontal, title: "Permitted-model gateway", detail: "Only models policy allows" },
      { icon: Undo2, title: "Response validation · restore", detail: "Leak check, restore with permission" },
      { icon: ClipboardCheck, title: "Audit record", detail: "Institution retention policy" },
    ],
    vault: "Token vault",
    vaultRows: ["Name 1", "Phone 1"],
    response: "Meeting summary for Jiwon Kim",
    responseMeta: "Verified answer",
    done: "Passed",
  },
};

export function AlphadocV2SecurityMotion({ language }: { language: Language }) {
  const text = copy[language];
  const [before, name, middle, phone] = text.requestOriginal;
  const tail = language === "ko" ? ") 주간 회의록을 요약해 줘" : ")";

  return (
    <ViewportMotion className="a2-sec-stage" role="img" ariaLabel={text.label} threshold={0.2}>
      <div className="a2 a2-sec" aria-hidden="true">
        <div className="a2-sec-head">
          <Lock strokeWidth={1.9} />
          <span>{text.title}</span>
          <span className="a2-badge is-blue">{text.status}</span>
        </div>

        <div className="a2-sec-request a2-anim">
          <MessageSquare strokeWidth={1.8} />
          <p>
            <span className="a2-sec-original a2-anim">
              {before}<mark>{name}</mark>{middle}<mark>{phone}</mark>{tail}
            </span>
            <span className="a2-sec-tokenized a2-anim">
              {before}<mark>{text.requestTokens[0]}</mark>{middle}<mark>{text.requestTokens[1]}</mark>{tail}
            </span>
          </p>
        </div>

        <div className="a2-sec-body">
          <ol className="a2-sec-steps">
            <span className="a2-sec-rail" />
            <span className="a2-sec-rail-fill a2-anim" />
            {text.steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className={`a2-sec-step a2-anim a2-sec-step-${index + 1}`}>
                  <span className="a2-sec-step-icon"><Icon strokeWidth={1.8} /></span>
                  <span className="a2-sec-step-copy">
                    <strong>{step.title}</strong>
                    <small>{step.detail}</small>
                  </span>
                  <span className={`a2-sec-step-done a2-anim a2-sec-done-${index + 1}`}>
                    <Check strokeWidth={2.4} />
                    {text.done}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="a2-sec-vault a2-anim">
            <span className="a2-sec-vault-head"><KeyRound strokeWidth={1.8} />{text.vault}</span>
            {text.vaultRows.map((row) => (
              <span key={row} className="a2-sec-vault-row">
                <span>{row}</span>
                <span className="a2-sec-vault-value">•••••</span>
              </span>
            ))}
          </div>
        </div>

        <div className="a2-sec-response a2-anim">
          <span className="a2-sec-response-meta"><ShieldCheck strokeWidth={1.9} />{text.responseMeta}</span>
          <p>{text.response}</p>
        </div>
      </div>
    </ViewportMotion>
  );
}
