import type { ReactNode } from "react";
import { ViewportMotion } from "@/app/components/ViewportMotion";
import type { Language } from "@/app/site-content";

/* Product security section: the whole Alphadoc architecture as a line diagram on the dark page,
   with no card behind it, so it reads differently from the Alphadoc screen scenes.
   Parts light up in the order a request travels: the one-way update from Viore, the member's
   question, Zero Trust steps 1 to 3, the permitted model call, Alphadoc with the institution's model
   and data, steps 5 and 6, the verified answer, and external AI kept out.
   Public level only (contract rules 9 to 11): step names, no detection methods or internal parts.
   External AI is shown as unused because the diagram is the corporate-network / separate-cloud setup. */

const copy: Record<Language, {
  label: string;
  viore: string;
  vioreSub: string;
  oneWay: string;
  external: string;
  boundary: string;
  member: string;
  band: string;
  steps: [string, string, string, string, string, string];
  core: string;
  model: string;
  data: string;
  dataSub: string;
  stays: string;
  answer: string;
}> = {
  ko: {
    label: "알파닥 보안 아키텍처: 바이오레는 지침과 문헌, 모델, 보안 업데이트를 기관 환경으로 한 방향으로만 보냅니다. 사내망 또는 분리 클라우드 안에서 구성원의 질문은 인증·권한 확인, 민감정보 치환, 입력 검증, 허용 모델 호출을 거쳐 알파닥이 기관 환경 모델과 기관 자료로 답하고, 응답 검증·복원과 감사 기록을 거쳐 돌아옵니다. 기관 단위 보안 체계는 구축 중이며 외부 AI는 쓰지 않습니다.",
    viore: "바이오레",
    vioreSub: "지침 · 문헌 · 모델 · 보안 업데이트",
    oneWay: "한 방향",
    external: "외부 AI",
    boundary: "기관 환경 · 사내망 또는 분리 클라우드",
    member: "구성원",
    band: "기관 단위 보안 체계 · 구축 중",
    steps: ["인증 · 권한 확인", "민감정보 치환", "입력 검증", "허용 모델 호출", "응답 검증 · 복원", "감사 기록"],
    core: "알파닥",
    model: "기관 환경 모델",
    data: "기관 자료",
    dataSub: "게시판 · 노트 · 문서",
    stays: "기관 데이터는 기관 환경 안에",
    answer: "검증된 답변",
  },
  en: {
    label: "Alphadoc security architecture: Viore sends guidelines, literature, model and security updates to the institution in one direction only. Inside the corporate network or a separate cloud, a staff question passes authentication and access checks, sensitive-data masking, input validation and the permitted-model call; Alphadoc answers with the in-institution model and institution data, and the answer comes back through verification and restoration and an audit log. Institution-level security is in progress, and external AI isn't used.",
    viore: "Viore",
    vioreSub: "Guidelines · literature · model · security updates",
    oneWay: "One way",
    external: "External AI",
    boundary: "Institution environment · corporate network or separate cloud",
    member: "Staff",
    band: "Zero Trust · in progress",
    steps: ["Auth & access", "Mask sensitive data", "Validate input", "Permitted model", "Verify & restore", "Audit log"],
    core: "Alphadoc",
    model: "In-institution model",
    data: "Institution data",
    dataSub: "Board · notes · documents",
    stays: "Institution data stays inside",
    answer: "Verified answer",
  },
};

/* Each lit part: a base box, a highlight box on top, then text. */
function Box({ x, y, w, h, step, children, tone = "blue", dashed = false }: {
  x: number; y: number; w: number; h: number; step: number; children: ReactNode; tone?: "blue" | "red"; dashed?: boolean;
}) {
  return (
    <g className={`arch-part arch-anim arch-s${step}${tone === "red" ? " is-red" : ""}`}>
      <rect className={`arch-box${dashed ? " is-dashed" : ""}`} x={x} y={y} width={w} height={h} rx={10} />
      <rect className="arch-hl" x={x} y={y} width={w} height={h} rx={10} />
      {children}
    </g>
  );
}

function Wire({ d, step, arrow }: { d: string; step: number; arrow?: string }) {
  return (
    <g className={`arch-part arch-anim arch-s${step}`}>
      <path className="arch-wire" d={d} />
      <path className={`arch-wire-hl arch-anim arch-draw${step}`} d={d} pathLength={1} />
      {arrow && <path className="arch-arrow" d={arrow} />}
    </g>
  );
}

function Step({ n, x, y, label, step }: { n: number; x: number; y: number; label: string; step: number }) {
  return (
    <Box x={x} y={y} w={180} h={40} step={step}>
      <circle className="arch-num" cx={x + 20} cy={y + 20} r={10} />
      <text className="arch-num-text" x={x + 20} y={y + 24.5} textAnchor="middle">{n}</text>
      <text className="arch-text" x={x + 38} y={y + 25}>{label}</text>
    </Box>
  );
}

export function AlphadocV2SecurityMotion({ language }: { language: Language }) {
  const t = copy[language];

  return (
    <ViewportMotion className="ap-arch" role="img" ariaLabel={t.label} threshold={0.25}>
      <svg className="ap-arch-svg" viewBox="0 0 460 640" aria-hidden="true">
        {/* Viore and the one-way update */}
        <Box x={95} y={8} w={270} h={52} step={0}>
          <text className="arch-text is-title" x={230} y={30} textAnchor="middle">{t.viore}</text>
          <text className="arch-sub" x={230} y={48} textAnchor="middle">{t.vioreSub}</text>
        </Box>
        <Wire d="M230 60 V96" step={0} arrow="M225 89 L230 96 L235 89" />
        <text className="arch-sub arch-label" x={240} y={83}>{t.oneWay}</text>

        {/* External AI stays outside */}
        <Box x={380} y={14} w={72} h={40} step={10} tone="red" dashed>
          <text className="arch-text is-small" x={416} y={38} textAnchor="middle">{t.external}</text>
        </Box>
        <g className="arch-part arch-anim arch-s10 is-red">
          <path className="arch-wire is-dashed" d="M416 54 V96" />
          <path className="arch-block" d="M410 69 L422 81 M422 69 L410 81" />
        </g>

        {/* Institution boundary */}
        <rect className="arch-boundary" x={8} y={96} width={444} height={536} rx={20} />
        <text className="arch-sub arch-boundary-label" x={26} y={120}>{t.boundary}</text>

        {/* Member */}
        <Box x={150} y={138} w={160} h={44} step={1}>
          <text className="arch-text" x={230} y={165} textAnchor="middle">{t.member}</text>
        </Box>

        {/* Zero Trust band (in progress) */}
        <rect className="arch-band" x={18} y={204} width={424} height={240} rx={14} />
        <text className="arch-band-label" x={130} y={220}>{t.band}</text>

        {/* Request path: member, steps 1 to 3, the permitted model call */}
        <Wire d="M150 160 H118 V230" step={1} arrow="M113 223 L118 230 L123 223" />
        <Step n={1} x={28} y={230} label={t.steps[0]} step={2} />
        <Wire d="M118 270 V282" step={3} />
        <Step n={2} x={28} y={282} label={t.steps[1]} step={3} />
        <Wire d="M118 322 V334" step={4} />
        <Step n={3} x={28} y={334} label={t.steps[2]} step={4} />
        <Wire d="M118 374 V412 H140" step={5} arrow="M133 407 L140 412 L133 417" />
        <Step n={4} x={140} y={392} label={t.steps[3]} step={5} />

        {/* Alphadoc with the institution's model and data */}
        <Wire d="M230 432 V462" step={6} arrow="M225 455 L230 462 L235 455" />
        <Box x={28} y={462} w={404} h={150} step={6}>
          <text className="arch-text is-title is-core" x={46} y={487}>{t.core}</text>
          <rect className="arch-inner" x={46} y={500} width={176} height={52} rx={9} />
          <text className="arch-text" x={134} y={531} textAnchor="middle">{t.model}</text>
          <rect className="arch-inner" x={238} y={500} width={176} height={52} rx={9} />
          <text className="arch-text" x={326} y={522} textAnchor="middle">{t.data}</text>
          <text className="arch-sub" x={326} y={540} textAnchor="middle">{t.dataSub}</text>
          <text className="arch-sub arch-stays" x={46} y={588}>{t.stays}</text>
        </Box>

        {/* Response path: steps 5 and 6, then the verified answer back to the member */}
        <Wire d="M342 462 V374" step={7} arrow="M337 381 L342 374 L347 381" />
        <Step n={5} x={252} y={334} label={t.steps[4]} step={7} />
        <Wire d="M342 334 V322" step={8} arrow="M337 329 L342 322 L347 329" />
        <Step n={6} x={252} y={282} label={t.steps[5]} step={8} />
        <Wire d="M342 282 V160 H310" step={9} arrow="M317 155 L310 160 L317 165" />
        <text className="arch-sub arch-label arch-answer" x={352} y={252}>{t.answer}</text>
      </svg>
    </ViewportMotion>
  );
}
