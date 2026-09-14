import type { CSSProperties, ReactNode } from "react";
import { ViewportMotion } from "@/app/components/ViewportMotion";
import type { Language } from "@/app/site-content";

export type TechnologyMotionKind =
  | "overview"
  | "evidence"
  | "engine"
  | "document"
  | "image"
  | "layer"
  | "seal";

type DiagramTone = "ink" | "blue" | "red" | "muted";
type DiagramCopy = {
  title: string;
  description: string;
};

const diagramCopy: Record<Language, Record<TechnologyMotionKind, DiagramCopy>> = {
  ko: {
    overview: {
      title: "바이오레 기술 체계",
      description: "근거와 문서·이미지 아티팩트, 의료 업무 실행, 선택된 외부 AI 경계, 지원되는 1:1 대화 보호가 각각의 책임을 유지한 채 연결되는 구조입니다.",
    },
    evidence: {
      title: "AlphaEvidence 근거 계보",
      description: "문헌과 진료지침이 출처 식별과 변화 이력을 거쳐 다시 확인할 수 있는 근거 맥락으로 이어지는 구조입니다.",
    },
    engine: {
      title: "AlphaDoc Engine 의료 업무 실행 구조",
      description: "업무 목적과 근거, 사용할 수 있는 문서와 이미지 맥락을 실행 계층에서 조합한 뒤 사용자 검토를 거쳐 다음 행동으로 이어지는 구조입니다.",
    },
    document: {
      title: "AlphaDocument 문서 아티팩트 구조",
      description: "지원 문서에서 보존 가능한 구조와 원문 위치를 분리해 확인하고 다시 쓸 수 있는 문서 아티팩트로 묶는 구조입니다.",
    },
    image: {
      title: "AlphaImage 이미지 아티팩트 구조",
      description: "지원되는 정적 이미지의 표현과 방향, 좌표를 일관되게 맞추고 원본과 기존 주석의 계보를 보존하는 구조입니다.",
    },
    layer: {
      title: "AlphaLayer 보호 실행 경계",
      description: "선택된 보호 텍스트는 등록된 조건을 확인한 경우에만 외부 실행 경계를 건너며 결과는 같은 요청에 묶여 돌아옵니다.",
    },
    seal: {
      title: "AlphaSeal 지원 1:1 쪽지 보호 구조",
      description: "지원되는 1:1 쪽지 본문이 발신자 브라우저에서 암호화되고 일반 저장 경로에는 암호문으로 남은 뒤 수신자 브라우저에서 열리는 구조입니다.",
    },
  },
  en: {
    overview: {
      title: "Viore technology system",
      description: "Evidence, document and image artifacts, medical-work execution, selected external AI boundaries, and supported one-to-one conversation protection remain separate responsibilities connected to the product.",
    },
    evidence: {
      title: "AlphaEvidence provenance structure",
      description: "Literature and guidelines retain source identity and observed change before becoming evidence context that people can revisit.",
    },
    engine: {
      title: "AlphaDoc Engine medical-work execution structure",
      description: "Work purpose, evidence, and available document or image context converge in an execution layer and return through user review to the next action.",
    },
    document: {
      title: "AlphaDocument artifact structure",
      description: "Preservable document structure and source positions are separated, checked, and bound into a reusable document artifact.",
    },
    image: {
      title: "AlphaImage artifact structure",
      description: "Supported static-image representation, orientation, and coordinates are aligned while source and existing-annotation lineage remain connected.",
    },
    layer: {
      title: "AlphaLayer protected execution boundary",
      description: "Selected protected text crosses the external execution boundary only after registered conditions are checked, and the result returns bound to the same request.",
    },
    seal: {
      title: "AlphaSeal supported one-to-one message protection",
      description: "Supported one-to-one message bodies are encrypted in the sender browser, remain ciphertext in ordinary storage, and open in the recipient browser.",
    },
  },
};

function pick(language: Language, ko: string, en: string) {
  return language === "ko" ? ko : en;
}

function stepStyle(step: number): CSSProperties {
  return { "--svg-step": step } as CSSProperties;
}

function DiagramDefs({ id }: { id: string }) {
  return (
    <defs>
      {(["ink", "blue", "red", "muted"] as const).map((tone) => (
        <marker
          id={`${id}-arrow-${tone}`}
          key={tone}
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 8 4 L 0 8 Z" className={`diagram-marker diagram-marker-${tone}`} />
        </marker>
      ))}
    </defs>
  );
}

function DiagramSvg({
  id,
  kind,
  language,
  mobile,
  height,
  children,
}: {
  id: string;
  kind: TechnologyMotionKind;
  language: Language;
  mobile: boolean;
  height: number;
  children: ReactNode;
}) {
  const copy = diagramCopy[language][kind];
  const width = mobile ? 420 : 960;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`technology-paper-svg ${mobile ? "technology-paper-svg-mobile" : "technology-paper-svg-desktop"}`}
      role="img"
      aria-labelledby={`${id}-title ${id}-description`}
      data-diagram-architecture={kind}
    >
      <title id={`${id}-title`}>{copy.title}</title>
      <desc id={`${id}-description`}>{copy.description}</desc>
      <DiagramDefs id={id} />
      <rect width={width} height={height} rx={mobile ? 10 : 12} className="diagram-paper" />
      {children}
    </svg>
  );
}

function Lines({
  lines,
  x,
  y,
  lineHeight = 16,
  anchor = "middle",
  className = "diagram-architecture-label",
}: {
  lines: readonly string[];
  x: number;
  y: number;
  lineHeight?: number;
  anchor?: "start" | "middle" | "end";
  className?: string;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={className}>
      {lines.map((line, index) => (
        <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function Module({
  x,
  y,
  width,
  height,
  label,
  annotation,
  tone = "ink",
  step,
  dashed = false,
  strong = false,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  label: readonly string[];
  annotation?: string;
  tone?: DiagramTone;
  step: number;
  dashed?: boolean;
  strong?: boolean;
}) {
  const labelY = y + height / 2 - ((label.length - 1) * 8);

  return (
    <g className="technology-svg-step" style={stepStyle(step)}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="7"
        className={[
          "diagram-module",
          `diagram-module-${tone}`,
          dashed ? "is-dashed" : "",
          strong ? "is-strong" : "",
        ].filter(Boolean).join(" ")}
      />
      {annotation && (
        <text x={x + 12} y={y + 18} className={`diagram-annotation diagram-text-${tone}`}>
          {annotation}
        </text>
      )}
      <Lines
        lines={label}
        x={x + width / 2}
        y={labelY + (annotation ? 8 : 5)}
      />
    </g>
  );
}

function Boundary({
  x,
  y,
  width,
  height,
  label,
  tone,
  step,
  solid = false,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  tone: DiagramTone;
  step: number;
  solid?: boolean;
}) {
  return (
    <g className="technology-svg-step" style={stepStyle(step)}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="10"
        className={`diagram-boundary diagram-boundary-${tone}${solid ? " is-solid" : ""}`}
      />
      <text x={x + 13} y={y + 20} className={`diagram-zone-label diagram-text-${tone}`}>
        {label}
      </text>
    </g>
  );
}

function Link({
  id,
  d,
  tone = "muted",
  step,
  dashed = false,
  arrow = true,
}: {
  id: string;
  d: string;
  tone?: DiagramTone;
  step: number;
  dashed?: boolean;
  arrow?: boolean;
}) {
  return (
    <path
      d={d}
      className={`diagram-link diagram-link-${tone} technology-svg-step${dashed ? " is-dashed" : ""}`}
      markerEnd={arrow ? `url(#${id}-arrow-${tone})` : undefined}
      style={stepStyle(step)}
    />
  );
}

function Annotation({
  x,
  y,
  text,
  tone = "muted",
  anchor = "start",
  step,
}: {
  x: number;
  y: number;
  text: string;
  tone?: DiagramTone;
  anchor?: "start" | "middle" | "end";
  step: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className={`diagram-annotation diagram-text-${tone} technology-svg-step`}
      style={stepStyle(step)}
    >
      {text}
    </text>
  );
}

function Dot({
  x,
  y,
  tone,
  step,
  radius = 5,
}: {
  x: number;
  y: number;
  tone: DiagramTone;
  step: number;
  radius?: number;
}) {
  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      className={`diagram-version-node diagram-version-node-${tone} technology-svg-step`}
      style={stepStyle(step)}
    />
  );
}

function Footnote({
  lines,
  x,
  y,
  width,
  step,
}: {
  lines: readonly string[];
  x: number;
  y: number;
  width: number;
  step: number;
}) {
  return (
    <g className="technology-svg-step" style={stepStyle(step)}>
      <line x1={x} y1={y} x2={x + width} y2={y} className="diagram-panel-rule" />
      <Lines
        lines={lines}
        x={x}
        y={y + 23}
        lineHeight={15}
        anchor="start"
        className="diagram-footnote"
      />
    </g>
  );
}

function OverviewDiagram({ language, mobile }: { language: Language; mobile: boolean }) {
  const id = `viore-${language}-overview-${mobile ? "mobile" : "desktop"}`;

  if (mobile) {
    return (
      <DiagramSvg id={id} kind="overview" language={language} mobile height={650}>
        <Module x={24} y={34} width={172} height={78} label={["AlphaEvidence"]} annotation={pick(language, "근거 계보", "Evidence lineage")} tone="blue" step={1} />
        <Module x={224} y={34} width={172} height={78} label={["AlphaDocument", "AlphaImage"]} annotation={pick(language, "아티팩트", "Artifacts")} tone="ink" step={1} />
        <Boundary x={93} y={178} width={234} height={134} label="ALPHADOC ENGINE" tone="red" step={2} solid />
        <Module x={122} y={220} width={176} height={64} label={[pick(language, "목적에 맞춘 실행", "Purpose-defined execution")]} tone="red" step={3} strong />
        <Module x={24} y={376} width={172} height={76} label={["AlphaLayer"]} annotation={pick(language, "선택된 외부 경계", "Selected external path")} tone="red" step={4} dashed />
        <Module x={224} y={376} width={172} height={76} label={["AlphaSeal"]} annotation={pick(language, "지원 1:1 본문", "Supported 1:1 content")} tone="blue" step={4} />
        <Module x={94} y={508} width={232} height={74} label={["Alphadoc"]} annotation={pick(language, "검토와 다음 행동", "Review and next action")} tone="blue" step={5} />
        <Link id={id} d="M 110 112 C 110 148 148 164 180 178" tone="blue" step={6} />
        <Link id={id} d="M 310 112 C 310 148 272 164 240 178" tone="ink" step={6} />
        <Link id={id} d="M 155 312 C 120 338 110 350 110 376" tone="red" step={7} />
        <Link id={id} d="M 265 312 C 300 338 310 350 310 376" tone="blue" step={7} />
        <Link id={id} d="M 110 452 C 110 478 150 492 180 508" tone="red" step={8} dashed />
        <Link id={id} d="M 310 452 C 310 478 270 492 240 508" tone="blue" step={8} />
        <Annotation x={210} y={153} text={pick(language, "서로 다른 책임이 한 실행 계층에서 만납니다", "Distinct responsibilities meet in one execution layer")} anchor="middle" step={9} />
        <Footnote
          lines={language === "ko"
            ? ["구현·제품 연결·운영 검증은 같은 상태로 묶지 않습니다."]
            : ["Implementation, product connection, and runtime", "verification remain distinct."]}
          x={24}
          y={610}
          width={372}
          step={10}
        />
      </DiagramSvg>
    );
  }

  return (
    <DiagramSvg id={id} kind="overview" language={language} mobile={false} height={420}>
      <Module x={42} y={54} width={196} height={86} label={["AlphaEvidence"]} annotation={pick(language, "출처와 변화가 남는 근거", "Source-and-change evidence")} tone="blue" step={1} />
      <Module x={42} y={240} width={196} height={86} label={["AlphaDocument", "AlphaImage"]} annotation={pick(language, "다시 쓰는 아티팩트", "Reusable artifacts")} tone="ink" step={1} />
      <Boundary x={354} y={106} width={252} height={176} label="ALPHADOC ENGINE" tone="red" step={2} solid />
      <Module x={394} y={160} width={172} height={72} label={[pick(language, "목적에 맞춘", "Purpose-defined"), pick(language, "의료 업무 실행", "medical-work execution")]} tone="red" step={3} strong />
      <Module x={722} y={54} width={196} height={86} label={["AlphaLayer"]} annotation={pick(language, "선택된 외부 AI 경계", "Selected external AI boundary")} tone="red" step={4} dashed />
      <Module x={722} y={240} width={196} height={86} label={["AlphaSeal"]} annotation={pick(language, "지원되는 1:1 본문 보호", "Protected 1:1 message content")} tone="blue" step={4} />
      <Module x={714} y={160} width={212} height={58} label={["Alphadoc"]} annotation={pick(language, "검토 · 다음 행동", "Review · next action")} tone="blue" step={5} />
      <Link id={id} d="M 238 97 C 292 97 310 145 354 165" tone="blue" step={6} />
      <Link id={id} d="M 238 283 C 292 283 310 235 354 215" tone="ink" step={6} />
      <Link id={id} d="M 606 152 C 656 112 674 97 722 97" tone="red" step={7} dashed />
      <Link id={id} d="M 606 194 H 706" tone="blue" step={7} />
      <Link id={id} d="M 606 236 C 656 276 674 283 722 283" tone="blue" step={7} />
      <Link id={id} d="M 820 240 V 218" tone="blue" step={8} />
      <Annotation x={286} y={82} text={pick(language, "근거 맥락", "Evidence context")} tone="blue" anchor="middle" step={8} />
      <Annotation x={286} y={312} text={pick(language, "문서·이미지 맥락", "Document · image context")} anchor="middle" step={8} />
      <Annotation x={664} y={86} text={pick(language, "조건이 맞는 경로만", "Only conforming paths")} tone="red" anchor="middle" step={8} />
      <Footnote
        lines={[pick(language, "각 기술의 책임을 분리하고 확인된 지점에서만 연결합니다.", "Each responsibility remains separate and connects only where verified.")]}
        x={42}
        y={362}
        width={876}
        step={9}
      />
    </DiagramSvg>
  );
}

function EvidenceDiagram({ language, mobile }: { language: Language; mobile: boolean }) {
  const id = `viore-${language}-evidence-${mobile ? "mobile" : "desktop"}`;
  const sourceLabels = [
    pick(language, "문헌", "Literature"),
    pick(language, "진료지침", "Guidelines"),
    pick(language, "새로운 변화", "Observed change"),
  ];

  if (mobile) {
    return (
      <DiagramSvg id={id} kind="evidence" language={language} mobile height={690}>
        {sourceLabels.map((label, index) => (
          <Module
            key={label}
            x={22 + index * 127}
            y={34}
            width={116}
            height={62}
            label={[label]}
            tone={index === 2 ? "red" : "blue"}
            step={1 + index}
          />
        ))}
        <Module x={103} y={144} width={214} height={76} label={[pick(language, "출처 · 식별 정보", "Source · identity")]} annotation={pick(language, "같은 자료임을 확인하는 기준", "A stable identity")} tone="blue" step={4} />
        <Link id={id} d="M 80 96 C 80 122 140 126 160 144" tone="blue" step={5} />
        <Link id={id} d="M 210 96 V 144" tone="blue" step={5} />
        <Link id={id} d="M 340 96 C 340 122 280 126 260 144" tone="red" step={5} />
        <path d="M 210 220 V 442" className="diagram-lineage-spine technology-svg-step" style={stepStyle(6)} />
        {[270, 326, 382, 438].map((y, index) => (
          <g key={y}>
            <Dot x={210} y={y} tone={index === 3 ? "red" : "blue"} step={7 + index} radius={index === 3 ? 7 : 5} />
            <Annotation
              x={228}
              y={y + 4}
              text={[
                pick(language, "처음 확인", "First observed"),
                pick(language, "같은 자료 연결", "Same item linked"),
                pick(language, "변화 이력", "Change history"),
                pick(language, "현재 맥락", "Current context"),
              ][index]}
              tone={index === 3 ? "red" : "muted"}
              step={7 + index}
            />
          </g>
        ))}
        <Module x={92} y={484} width={236} height={84} label={[pick(language, "다시 확인할 수 있는", "Evidence context"), pick(language, "근거 맥락", "people can revisit")]} tone="red" step={12} strong />
        <Link id={id} d="M 210 442 V 484" tone="red" step={13} />
        <Link id={id} d="M 92 526 C 42 526 42 182 103 182" tone="muted" step={14} dashed />
        <Annotation x={24} y={350} text={pick(language, "검토 결과가", "Review informs")} step={15} />
        <Annotation x={24} y={366} text={pick(language, "다음 확인에 반영", "the next check")} step={15} />
        <Footnote
          lines={language === "ko"
            ? ["레코드 수가 개별 자료의 임상 검증을 뜻하지는 않습니다."]
            : ["Record volume remains distinct from clinical", "validation of each item."]}
          x={22}
          y={626}
          width={376}
          step={16}
        />
      </DiagramSvg>
    );
  }

  return (
    <DiagramSvg id={id} kind="evidence" language={language} mobile={false} height={420}>
      {sourceLabels.map((label, index) => (
        <Module
          key={label}
          x={42}
          y={54 + index * 88}
          width={142}
          height={58}
          label={[label]}
          tone={index === 2 ? "red" : "blue"}
          step={1 + index}
        />
      ))}
      <Module x={246} y={120} width={168} height={102} label={[pick(language, "출처와", "Source and"), pick(language, "식별 정보", "identity")]} annotation={pick(language, "같은 자료임을 확인하는 기준", "A stable identity")} tone="blue" step={4} />
      <Link id={id} d="M 184 83 C 214 83 214 142 246 151" tone="blue" step={5} />
      <Link id={id} d="M 184 171 H 246" tone="blue" step={5} />
      <Link id={id} d="M 184 259 C 214 259 214 200 246 191" tone="red" step={5} />
      <path d="M 470 171 H 704" className="diagram-lineage-spine technology-svg-step" style={stepStyle(6)} />
      {[486, 548, 610, 688].map((x, index) => (
        <g key={x}>
          <Dot x={x} y={171} tone={index === 3 ? "red" : "blue"} step={7 + index} radius={index === 3 ? 7 : 5} />
          <Annotation
            x={x}
            y={index % 2 === 0 ? 145 : 202}
            text={[
              pick(language, "처음 확인", "First observed"),
              pick(language, "동일 자료", "Same item"),
              pick(language, "변화 이력", "Change history"),
              pick(language, "현재 맥락", "Current context"),
            ][index]}
            tone={index === 3 ? "red" : "muted"}
            anchor="middle"
            step={7 + index}
          />
        </g>
      ))}
      <Module x={754} y={111} width={166} height={120} label={[pick(language, "검토 가능한", "Reviewable"), pick(language, "근거 맥락", "evidence context")]} tone="red" step={12} strong />
      <Link id={id} d="M 414 171 H 470" tone="blue" step={13} />
      <Link id={id} d="M 704 171 H 754" tone="red" step={13} />
      <Link id={id} d="M 837 231 C 837 310 330 326 330 222" tone="muted" step={14} dashed />
      <Annotation x={584} y={302} text={pick(language, "검토 결과는 다음 확인에 다시 쓰입니다", "Review returns as context for the next check")} anchor="middle" step={15} />
      <Footnote
        lines={[pick(language, "출처·변화·검토의 연결을 남기지만 개별 자료의 임상 검증 완료를 뜻하지는 않습니다.", "Source, change, and review remain connected without implying clinical validation of every item.")]}
        x={42}
        y={362}
        width={878}
        step={16}
      />
    </DiagramSvg>
  );
}

function EngineDiagram({ language, mobile }: { language: Language; mobile: boolean }) {
  const id = `viore-${language}-engine-${mobile ? "mobile" : "desktop"}`;

  if (mobile) {
    return (
      <DiagramSvg id={id} kind="engine" language={language} mobile height={720}>
        <Module x={22} y={32} width={176} height={68} label={[pick(language, "업무 목적", "Work purpose")]} tone="ink" step={1} />
        <Module x={222} y={32} width={176} height={68} label={[pick(language, "근거 맥락", "Evidence context")]} tone="blue" step={1} />
        <Module x={22} y={120} width={176} height={68} label={[pick(language, "문서·이미지", "Document · image")]} tone="blue" step={2} />
        <Module x={222} y={120} width={176} height={68} label={[pick(language, "사용 가능한 기능", "Available capability")]} tone="ink" step={2} />
        <Boundary x={58} y={246} width={304} height={194} label="ALPHADOC ENGINE" tone="red" step={3} solid />
        <Module x={82} y={290} width={116} height={58} label={[pick(language, "맥락 조합", "Assemble context")]} tone="blue" step={4} />
        <Module x={222} y={290} width={116} height={58} label={[pick(language, "통제된 실행", "Controlled run")]} tone="red" step={4} strong />
        <Module x={152} y={366} width={116} height={48} label={[pick(language, "결과 구성", "Shape result")]} tone="ink" step={5} />
        <Link id={id} d="M 110 188 C 110 220 138 228 152 246" tone="blue" step={6} />
        <Link id={id} d="M 310 188 C 310 220 282 228 268 246" tone="ink" step={6} />
        <Module x={78} y={496} width={126} height={66} label={[pick(language, "사용자 검토", "User review")]} tone="blue" step={7} />
        <Module x={230} y={496} width={126} height={66} label={[pick(language, "다음 행동", "Next action")]} tone="red" step={7} />
        <Link id={id} d="M 210 440 C 210 470 141 470 141 496" tone="blue" step={8} />
        <Link id={id} d="M 204 529 H 230" tone="red" step={8} />
        <Link id={id} d="M 141 562 C 141 608 46 608 46 342 C 46 310 58 310 58 310" tone="muted" step={9} dashed />
        <Annotation x={58} y={596} text={pick(language, "검토 결과를 다음 실행에 반영", "Review returns to execution context")} step={10} />
        <Footnote
          lines={language === "ko"
            ? ["실행에 앞서 업무 목적과 사용할 수 있는 맥락을 구분합니다."]
            : ["Work purpose and available context are resolved", "before execution."]}
          x={22}
          y={650}
          width={376}
          step={11}
        />
      </DiagramSvg>
    );
  }

  return (
    <DiagramSvg id={id} kind="engine" language={language} mobile={false} height={420}>
      <Module x={42} y={44} width={158} height={64} label={[pick(language, "업무 목적", "Work purpose")]} tone="ink" step={1} />
      <Module x={42} y={138} width={158} height={64} label={[pick(language, "근거 맥락", "Evidence context")]} tone="blue" step={2} />
      <Module x={42} y={232} width={158} height={64} label={[pick(language, "문서·이미지", "Document · image")]} tone="blue" step={3} />
      <Boundary x={286} y={54} width={392} height={242} label="ALPHADOC ENGINE" tone="red" step={4} solid />
      <Module x={314} y={99} width={142} height={70} label={[pick(language, "필요한 맥락", "Required context"), pick(language, "조합", "assembly")]} tone="blue" step={5} />
      <Module x={508} y={99} width={142} height={70} label={[pick(language, "목적에 맞춘", "Purpose-defined"), pick(language, "통제된 실행", "controlled run")]} tone="red" step={5} strong />
      <Module x={411} y={206} width={142} height={58} label={[pick(language, "결과 구성", "Result shaping")]} tone="ink" step={6} />
      <Link id={id} d="M 200 76 C 242 76 252 118 286 126" tone="ink" step={7} />
      <Link id={id} d="M 200 170 H 286" tone="blue" step={7} />
      <Link id={id} d="M 200 264 C 242 264 252 222 286 214" tone="blue" step={7} />
      <Link id={id} d="M 456 134 H 508" tone="red" step={8} />
      <Link id={id} d="M 579 169 C 579 192 530 192 510 206" tone="ink" step={8} />
      <Module x={764} y={91} width={154} height={72} label={[pick(language, "사용자 검토", "User review")]} tone="blue" step={9} />
      <Module x={764} y={218} width={154} height={72} label={[pick(language, "다음 행동", "Next action")]} tone="red" step={9} />
      <Link id={id} d="M 678 175 C 722 175 728 127 764 127" tone="blue" step={10} />
      <Link id={id} d="M 841 163 V 218" tone="red" step={10} />
      <Link id={id} d="M 764 254 C 722 326 482 342 482 296" tone="muted" step={11} dashed />
      <Annotation x={626} y={330} text={pick(language, "검토 결과는 다음 실행의 맥락에 반영됩니다", "Review returns as context for the next execution")} anchor="middle" step={12} />
      <Footnote
        lines={[pick(language, "이 실행 구조는 여러 기능에서 쓰이지만 근거 평가 범위는 기능마다 다릅니다.", "The execution structure serves multiple features; evidence evaluation scope varies by feature.")]}
        x={42}
        y={362}
        width={876}
        step={13}
      />
    </DiagramSvg>
  );
}

function DocumentPage({
  x,
  y,
  width,
  height,
  step,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  step: number;
}) {
  return (
    <g className="technology-svg-step" style={stepStyle(step)}>
      <rect x={x + 11} y={y - 9} width={width} height={height} rx="4" className="diagram-document-shadow" />
      <rect x={x} y={y} width={width} height={height} rx="4" className="diagram-document-page" />
      <rect x={x + 18} y={y + 22} width={width * .5} height="10" rx="2" className="diagram-document-heading" />
      <rect x={x + 18} y={y + 50} width={width - 36} height="5" rx="1" className="diagram-document-line" />
      <rect x={x + 18} y={y + 66} width={width - 50} height="5" rx="1" className="diagram-document-line" />
      <rect x={x + 18} y={y + 88} width={width * .42} height={height * .24} rx="3" className="diagram-document-figure" />
      <line x1={x + width * .58} y1={y + 92} x2={x + width - 18} y2={y + 92} className="diagram-document-chart" />
      <line x1={x + width * .58} y1={y + 111} x2={x + width - 28} y2={y + 111} className="diagram-document-chart" />
      <rect x={x + 18} y={y + height - 42} width={width - 36} height="5" rx="1" className="diagram-document-line" />
      <rect x={x + 18} y={y + height - 26} width={width * .58} height="5" rx="1" className="diagram-document-line" />
      <circle cx={x + width - 14} cy={y + 14} r="4" className="diagram-version-node diagram-version-node-red" />
    </g>
  );
}

function ArtifactLayers({
  x,
  y,
  width,
  labels,
  step,
}: {
  x: number;
  y: number;
  width: number;
  labels: readonly string[];
  step: number;
}) {
  return (
    <g className="technology-svg-step" style={stepStyle(step)}>
      {labels.map((label, index) => (
        <g key={label}>
          <rect
            x={x + index * 8}
            y={y + index * 54}
            width={width - index * 16}
            height="42"
            rx="5"
            className={`diagram-module diagram-module-${index === 1 ? "red" : "blue"}`}
          />
          <text
            x={x + width / 2}
            y={y + index * 54 + 26}
            textAnchor="middle"
            className="diagram-architecture-label"
          >
            {label}
          </text>
        </g>
      ))}
    </g>
  );
}

function DocumentDiagram({ language, mobile }: { language: Language; mobile: boolean }) {
  const id = `viore-${language}-document-${mobile ? "mobile" : "desktop"}`;
  const layerLabels = [
    pick(language, "보존 가능한 구조", "Preservable structure"),
    pick(language, "원문 위치와 출처", "Source position"),
    pick(language, "처리 기준과 무결성", "Integrity"),
  ];

  if (mobile) {
    return (
      <DiagramSvg id={id} kind="document" language={language} mobile height={720}>
        <DocumentPage x={42} y={42} width={144} height={190} step={1} />
        <Annotation x={205} y={82} text={pick(language, "문단·표", "Blocks · tables")} tone="blue" step={2} />
        <Link id={id} d="M 186 102 H 198" tone="blue" step={2} arrow={false} />
        <Annotation x={205} y={142} text={pick(language, "원문 위치", "Source position")} tone="red" step={3} />
        <Link id={id} d="M 186 156 H 198" tone="red" step={3} arrow={false} />
        <Boundary x={228} y={42} width={166} height={190} label="ALPHADOCUMENT" tone="ink" step={4} solid />
        <Module x={246} y={82} width={130} height={52} label={[pick(language, "구조 분리", "Separate structure")]} tone="blue" step={5} />
        <Module x={246} y={156} width={130} height={52} label={[pick(language, "범위 확인", "Check boundary")]} tone="red" step={6} />
        <Link id={id} d="M 186 204 C 208 204 206 185 228 185" tone="ink" step={7} />
        <ArtifactLayers x={80} y={292} width={260} labels={layerLabels} step={8} />
        <Link id={id} d="M 311 232 C 311 266 254 268 254 292" tone="red" step={9} />
        <Module x={42} y={496} width={152} height={62} label={[pick(language, "근거 맥락", "Evidence context")]} tone="blue" step={10} />
        <Module x={226} y={496} width={152} height={62} label={[pick(language, "문서 업무", "Document work")]} tone="ink" step={10} />
        <Link id={id} d="M 160 454 C 160 476 118 478 118 496" tone="blue" step={11} />
        <Link id={id} d="M 260 454 C 260 476 302 478 302 496" tone="ink" step={11} />
        <Annotation x={210} y={594} text={pick(language, "같은 아티팩트를 필요한 업무에 다시 씁니다", "The same artifact returns in the context that needs it")} anchor="middle" step={12} />
        <Footnote
          lines={language === "ko"
            ? ["형식마다 보존 범위가 다릅니다.", "원본 배치 전체를 재현하는 기술은 아닙니다."]
            : ["Preservation varies by format and does not", "reproduce every source layout."]}
          x={22}
          y={650}
          width={376}
          step={13}
        />
      </DiagramSvg>
    );
  }

  return (
    <DiagramSvg id={id} kind="document" language={language} mobile={false} height={420}>
      <DocumentPage x={52} y={62} width={176} height={232} step={1} />
      <Annotation x={246} y={105} text={pick(language, "문단 · 표 · 위치", "Blocks · tables · position")} tone="blue" step={2} />
      <Link id={id} d="M 228 112 H 240" tone="blue" step={2} arrow={false} />
      <Annotation x={246} y={183} text={pick(language, "원문으로 돌아가는 기준", "A path back to the source")} tone="red" step={3} />
      <Link id={id} d="M 228 190 H 240" tone="red" step={3} arrow={false} />
      <Boundary x={330} y={68} width={210} height={220} label="ALPHADOCUMENT" tone="ink" step={4} solid />
      <Module x={354} y={112} width={162} height={58} label={[pick(language, "보존할 구조", "Structure to keep")]} tone="blue" step={5} />
      <Module x={354} y={196} width={162} height={58} label={[pick(language, "처리 범위 확인", "Boundary check")]} tone="red" step={6} />
      <Link id={id} d="M 228 246 C 278 246 282 224 330 224" tone="ink" step={7} />
      <ArtifactLayers x={618} y={76} width={264} labels={layerLabels} step={8} />
      <Link id={id} d="M 540 178 H 618" tone="red" step={9} />
      <Module x={618} y={272} width={120} height={52} label={[pick(language, "근거 맥락", "Evidence context")]} tone="blue" step={10} />
      <Module x={762} y={272} width={120} height={52} label={[pick(language, "문서 업무", "Document work")]} tone="ink" step={10} />
      <Link id={id} d="M 750 238 C 712 252 690 258 678 272" tone="blue" step={11} />
      <Link id={id} d="M 750 238 C 788 252 810 258 822 272" tone="ink" step={11} />
      <Footnote
        lines={[pick(language, "보존 가능한 구조와 출처를 함께 남겨 같은 문서를 필요한 업무에 다시 씁니다.", "Preservable structure and provenance travel together so the document can be reused.")]}
        x={52}
        y={362}
        width={830}
        step={12}
      />
    </DiagramSvg>
  );
}

function ImageFrame({
  x,
  y,
  width,
  height,
  normalized,
  step,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  normalized: boolean;
  step: number;
}) {
  const inset = 14;
  const polygon = normalized
    ? `${x + width * .28},${y + height * .32} ${x + width * .7},${y + height * .25} ${x + width * .78},${y + height * .66} ${x + width * .38},${y + height * .74}`
    : `${x + width * .22},${y + height * .43} ${x + width * .58},${y + height * .2} ${x + width * .82},${y + height * .57} ${x + width * .46},${y + height * .78}`;

  return (
    <g className="technology-svg-step" style={stepStyle(step)}>
      <rect x={x} y={y} width={width} height={height} rx="7" className="diagram-image-frame" />
      {[1, 2, 3].map((index) => (
        <line
          key={`v-${index}`}
          x1={x + inset + ((width - inset * 2) / 4) * index}
          y1={y + inset}
          x2={x + inset + ((width - inset * 2) / 4) * index}
          y2={y + height - inset}
          className="diagram-image-grid"
        />
      ))}
      {[1, 2, 3].map((index) => (
        <line
          key={`h-${index}`}
          x1={x + inset}
          y1={y + inset + ((height - inset * 2) / 4) * index}
          x2={x + width - inset}
          y2={y + inset + ((height - inset * 2) / 4) * index}
          className="diagram-image-grid"
        />
      ))}
      <polyline points={polygon} className={`diagram-image-annotation${normalized ? " is-normalized" : ""}`} />
      <circle cx={x + width * .5} cy={y + height * .5} r="4" className="diagram-coordinate-origin" />
      <line x1={x + inset} y1={y + height - inset} x2={x + width - inset} y2={y + height - inset} className="diagram-coordinate-axis" />
      <line x1={x + inset} y1={y + inset} x2={x + inset} y2={y + height - inset} className="diagram-coordinate-axis" />
    </g>
  );
}

function ImageDiagram({ language, mobile }: { language: Language; mobile: boolean }) {
  const id = `viore-${language}-image-${mobile ? "mobile" : "desktop"}`;
  const lineage = [
    pick(language, "원본", "Source"),
    pick(language, "표현·방향", "Representation"),
    pick(language, "좌표 연결", "Coordinates"),
    pick(language, "기존 주석", "Existing annotation"),
  ];

  if (mobile) {
    return (
      <DiagramSvg id={id} kind="image" language={language} mobile height={610}>
        <ImageFrame x={22} y={36} width={172} height={178} normalized={false} step={1} />
        <ImageFrame x={226} y={36} width={172} height={178} normalized step={2} />
        <Link id={id} d="M 194 125 H 226" tone="red" step={3} />
        <Annotation x={108} y={238} text={pick(language, "입력마다 다른 기준", "Different source basis")} anchor="middle" step={4} />
        <Annotation x={312} y={238} text={pick(language, "하나의 공통 기준", "One shared basis")} tone="blue" anchor="middle" step={4} />
        <Module
          x={55}
          y={280}
          width={92}
          height={52}
          label={language === "ko" ? ["안전한 표현"] : ["Safe", "representation"]}
          tone="ink"
          step={5}
        />
        <Module x={164} y={280} width={92} height={52} label={[pick(language, "방향", "Orientation")]} tone="blue" step={5} />
        <Module x={273} y={280} width={92} height={52} label={[pick(language, "좌표", "Coordinates")]} tone="red" step={5} />
        <path d="M 42 398 H 378" className="diagram-lineage-spine technology-svg-step" style={stepStyle(6)} />
        {lineage.map((label, index) => {
          const x = 54 + index * 100;
          return (
            <g key={label}>
              <Dot x={x} y={398} tone={index === 3 ? "red" : "blue"} step={7 + index} />
              <Annotation x={x} y={430} text={label} anchor="middle" tone={index === 3 ? "red" : "muted"} step={7 + index} />
            </g>
          );
        })}
        <Annotation x={210} y={482} text={pick(language, "변환 뒤에도 원본과 주석의 계보가 이어집니다", "Source and annotation lineage survive the transform")} anchor="middle" step={11} />
        <Footnote
          lines={language === "ko"
            ? ["입력 기준을 일관되게 맞추지만", "판독이나 진단은 수행하지 않습니다."]
            : ["This structure aligns inputs; it does not", "interpret or diagnose."]}
          x={22}
          y={542}
          width={376}
          step={12}
        />
      </DiagramSvg>
    );
  }

  return (
    <DiagramSvg id={id} kind="image" language={language} mobile={false} height={420}>
      <ImageFrame x={46} y={48} width={268} height={232} normalized={false} step={1} />
      <ImageFrame x={646} y={48} width={268} height={232} normalized step={2} />
      <Module x={382} y={62} width={196} height={58} label={[pick(language, "안전한 공통 표현", "Safe shared representation")]} tone="ink" step={3} />
      <Module x={382} y={136} width={196} height={58} label={[pick(language, "방향 기준", "Orientation basis")]} tone="blue" step={4} />
      <Module x={382} y={210} width={196} height={58} label={[pick(language, "좌표 연결", "Coordinate mapping")]} tone="red" step={5} />
      <Link id={id} d="M 314 104 H 382" tone="ink" step={6} />
      <Link id={id} d="M 314 164 H 382" tone="blue" step={6} />
      <Link id={id} d="M 314 224 H 382" tone="red" step={6} />
      <Link id={id} d="M 578 104 H 646" tone="ink" step={7} />
      <Link id={id} d="M 578 164 H 646" tone="blue" step={7} />
      <Link id={id} d="M 578 224 H 646" tone="red" step={7} />
      <Annotation x={180} y={306} text={pick(language, "입력마다 다른 기준", "Different source basis")} anchor="middle" step={8} />
      <Annotation x={780} y={306} text={pick(language, "후속 기능이 공유하는 기준", "A basis downstream work can share")} tone="blue" anchor="middle" step={8} />
      <path d="M 100 336 H 860" className="diagram-lineage-spine technology-svg-step" style={stepStyle(9)} />
      {lineage.map((label, index) => {
        const x = 136 + index * 228;
        return (
          <g key={label}>
            <Dot x={x} y={336} tone={index === 3 ? "red" : "blue"} step={10 + index} />
            <Annotation x={x} y={326} text={label} anchor="middle" tone={index === 3 ? "red" : "muted"} step={10 + index} />
          </g>
        );
      })}
      <Footnote
        lines={[pick(language, "표현과 좌표를 맞추고 계보를 보존하지만 영상 판독이나 진단을 수행하지 않습니다.", "Representation and coordinates align while lineage remains; the system does not interpret or diagnose.")]}
        x={46}
        y={370}
        width={868}
        step={14}
      />
    </DiagramSvg>
  );
}

function LayerDiagram({ language, mobile }: { language: Language; mobile: boolean }) {
  const id = `viore-${language}-layer-${mobile ? "mobile" : "desktop"}`;

  if (mobile) {
    return (
      <DiagramSvg id={id} kind="layer" language={language} mobile height={720}>
        <Boundary x={20} y={28} width={380} height={314} label={pick(language, "알파닥 경계 안", "Inside Alphadoc boundary")} tone="blue" step={1} solid />
        <Module x={46} y={78} width={140} height={68} label={[pick(language, "선택된", "Selected"), pick(language, "보호 텍스트", "protected text")]} tone="ink" step={2} />
        <Module x={230} y={70} width={142} height={92} label={[pick(language, "등록된 목적과", "Registered purpose"), pick(language, "요청 조건", "and request conditions")]} tone="red" step={3} strong />
        <Link id={id} d="M 186 112 H 230" tone="red" step={4} />
        <Module x={46} y={226} width={140} height={64} label={[pick(language, "경계 안에서", "Stopped inside"), pick(language, "중단", "the boundary")]} tone="muted" step={5} dashed />
        <Link id={id} d="M 301 162 C 301 196 116 190 116 226" tone="muted" step={6} dashed />
        <path d="M 20 376 H 400" className="diagram-trust-boundary technology-svg-step" style={stepStyle(7)} />
        <Annotation x={28} y={365} text={pick(language, "통제 경계", "Controlled boundary")} tone="red" step={7} />
        <Module x={88} y={420} width={244} height={78} label={[pick(language, "조건을 통과한 외부 AI 실행", "External AI execution after checks")]} tone="red" step={8} />
        <Link id={id} d="M 301 162 C 376 244 376 386 310 420" tone="red" step={9} />
        <Module x={88} y={544} width={244} height={68} label={[pick(language, "같은 요청에 묶인 결과 반환", "Result bound to the same request")]} tone="blue" step={10} />
        <Link id={id} d="M 210 498 V 544" tone="blue" step={11} />
        <Link id={id} d="M 88 578 C 34 578 34 130 46 130" tone="blue" step={12} dashed />
        <Footnote
          lines={[
            pick(language, "선택된 텍스트 경로의 경계입니다.", "A boundary for selected text paths."),
            pick(language, "모든 기능·파일·법적 적합성을 포괄하지 않습니다.", "It does not cover every feature or file,"),
            ...(language === "ko" ? [] : ["or every legal-suitability question."]),
          ]}
          x={20}
          y={650}
          width={380}
          step={13}
        />
      </DiagramSvg>
    );
  }

  return (
    <DiagramSvg id={id} kind="layer" language={language} mobile={false} height={420}>
      <Boundary x={30} y={34} width={490} height={294} label={pick(language, "알파닥 경계 안", "Inside Alphadoc boundary")} tone="blue" step={1} solid />
      <rect x="520" y="34" width="410" height="294" rx="10" className="diagram-external-zone technology-svg-step" style={stepStyle(1)} />
      <line x1="520" y1="34" x2="520" y2="328" className="diagram-trust-boundary technology-svg-step" style={stepStyle(2)} />
      <Annotation x={540} y={55} text={pick(language, "외부 실행 통제 영역", "Controlled external execution")} tone="red" step={2} />
      <Module x={70} y={112} width={176} height={82} label={[pick(language, "선택된", "Selected"), pick(language, "보호 텍스트", "protected text")]} tone="ink" step={3} />
      <Module x={330} y={92} width={154} height={122} label={[pick(language, "등록된 목적", "Registered purpose"), pick(language, "요청 조건", "Request conditions")]} annotation={pick(language, "경계 통과 확인", "Boundary check")} tone="red" step={4} strong />
      <Link id={id} d="M 246 153 H 330" tone="red" step={5} />
      <Module x={302} y={252} width={182} height={58} label={[pick(language, "조건 불충족 · 중단", "Nonconforming · stop")]} tone="muted" step={6} dashed />
      <Link id={id} d="M 407 214 V 252" tone="muted" step={7} dashed />
      <Module x={626} y={96} width={220} height={86} label={[pick(language, "외부 AI 실행", "External AI execution")]} annotation={pick(language, "조건을 통과한 요청만", "Only conforming requests")} tone="red" step={8} />
      <Link id={id} d="M 484 132 C 548 132 560 139 626 139" tone="red" step={9} />
      <Module x={626} y={232} width={220} height={70} label={[pick(language, "요청에 묶인 결과", "Result bound to request")]} tone="blue" step={10} />
      <Link id={id} d="M 736 182 V 232" tone="blue" step={11} />
      <Link id={id} d="M 626 267 C 566 267 558 190 484 190" tone="blue" step={12} dashed />
      <Annotation x={553} y={251} text={pick(language, "반환 확인", "Return check")} tone="blue" anchor="middle" step={13} />
      <Footnote
        lines={[pick(language, "선택된 보호 텍스트 경로의 경계이며 모든 기능·원문 파일·법적 적합성을 포괄하지 않습니다.", "This boundary applies to selected protected text paths, not every feature, source file, or legal-suitability question.")]}
        x={30}
        y={362}
        width={900}
        step={14}
      />
    </DiagramSvg>
  );
}

function BrowserFrame({
  x,
  y,
  width,
  height,
  label,
  content,
  tone,
  step,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  content: readonly string[];
  tone: DiagramTone;
  step: number;
}) {
  return (
    <g className="technology-svg-step" style={stepStyle(step)}>
      <rect x={x} y={y} width={width} height={height} rx="8" className={`diagram-browser diagram-browser-${tone}`} />
      <line x1={x} y1={y + 28} x2={x + width} y2={y + 28} className="diagram-panel-rule" />
      <circle cx={x + 13} cy={y + 14} r="3" className="diagram-browser-dot" />
      <circle cx={x + 24} cy={y + 14} r="3" className="diagram-browser-dot" />
      <text x={x + 38} y={y + 18} className={`diagram-annotation diagram-text-${tone}`}>{label}</text>
      <rect x={x + 22} y={y + 57} width={width - 44} height={height - 82} rx="7" className={`diagram-module diagram-module-${tone}`} />
      <Lines lines={content} x={x + width / 2} y={y + height / 2 + 8} />
    </g>
  );
}

function CipherBlocks({
  x,
  y,
  columns,
  rows,
  step,
}: {
  x: number;
  y: number;
  columns: number;
  rows: number;
  step: number;
}) {
  return (
    <g className="technology-svg-step" style={stepStyle(step)}>
      {Array.from({ length: columns * rows }, (_, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        return (
          <rect
            key={index}
            x={x + column * 14}
            y={y + row * 14}
            width="9"
            height="9"
            rx="1"
            className={`diagram-token ${index % 3 === 0 ? "diagram-token-red" : "diagram-token-blue"}`}
          />
        );
      })}
    </g>
  );
}

function SealDiagram({ language, mobile }: { language: Language; mobile: boolean }) {
  const id = `viore-${language}-seal-${mobile ? "mobile" : "desktop"}`;

  if (mobile) {
    return (
      <DiagramSvg id={id} kind="seal" language={language} mobile height={650}>
        <BrowserFrame x={20} y={38} width={170} height={172} label={pick(language, "발신자", "Sender")} content={[pick(language, "쪽지 본문", "Message body")]} tone="ink" step={1} />
        <BrowserFrame x={230} y={38} width={170} height={172} label={pick(language, "수신자", "Recipient")} content={[pick(language, "검증 후", "Open after"), pick(language, "본문 열기", "verification")]} tone="blue" step={2} />
        <Link id={id} d="M 190 112 H 230" tone="red" step={3} />
        <Annotation x={210} y={98} text={pick(language, "암호화", "Encrypt")} tone="red" anchor="middle" step={3} />
        <Module x={112} y={272} width={196} height={96} label={[pick(language, "암호문만 저장", "Ciphertext only")]} annotation={pick(language, "일반 저장 경로", "Ordinary storage")} tone="muted" step={4} />
        <CipherBlocks x={174} y={346} columns={6} rows={2} step={5} />
        <Link id={id} d="M 105 210 C 105 246 168 246 168 272" tone="red" step={6} />
        <Link id={id} d="M 252 272 C 252 246 315 246 315 210" tone="blue" step={6} />
        <path d="M 24 434 H 396" className="diagram-separate-lane technology-svg-step" style={stepStyle(7)} />
        <Annotation x={30} y={422} text={pick(language, "별도 전달 정보", "Separate delivery data")} tone="muted" step={7} />
        <Module x={38} y={462} width={154} height={58} label={[pick(language, "발신자 · 수신자", "Sender · recipient"), pick(language, "시각 · 읽음 상태", "Time · read state")]} tone="muted" step={8} dashed />
        <Module x={228} y={462} width={154} height={58} label={[pick(language, "당사자 신고 경로", "Participant report path")]} tone="ink" step={8} dashed />
        <Footnote
          lines={language === "ko"
            ? ["현재 범위는 지원되는 1:1 쪽지 본문입니다."]
            : ["Current scope is supported one-to-one", "message bodies."]}
          x={20}
          y={584}
          width={380}
          step={9}
        />
      </DiagramSvg>
    );
  }

  return (
    <DiagramSvg id={id} kind="seal" language={language} mobile={false} height={420}>
      <BrowserFrame x={42} y={54} width={238} height={204} label={pick(language, "발신자 브라우저", "Sender browser")} content={[pick(language, "쪽지 본문", "Message body"), pick(language, "브라우저에서 암호화", "Encrypted in browser")]} tone="ink" step={1} />
      <BrowserFrame x={680} y={54} width={238} height={204} label={pick(language, "수신자 브라우저", "Recipient browser")} content={[pick(language, "검증 후 복호화", "Verify and open"), pick(language, "브라우저에서 본문 열기", "in the browser")]} tone="blue" step={2} />
      <Link id={id} d="M 280 118 H 680" tone="red" step={3} />
      <Annotation x={480} y={101} text={pick(language, "대화 맥락과 순서에 묶인 암호문", "Ciphertext bound to conversation context and order")} tone="red" anchor="middle" step={3} />
      <Module x={380} y={176} width={200} height={102} label={[pick(language, "암호문만 저장", "Ciphertext only")]} annotation={pick(language, "일반 저장 경로", "Ordinary storage")} tone="muted" step={4} />
      <CipherBlocks x={424} y={252} columns={9} rows={2} step={5} />
      <Link id={id} d="M 360 118 C 360 154 420 154 420 176" tone="red" step={6} />
      <Link id={id} d="M 540 176 C 540 154 600 154 600 118" tone="blue" step={6} />
      <path d="M 42 326 H 918" className="diagram-separate-lane technology-svg-step" style={stepStyle(7)} />
      <Annotation x={50} y={316} text={pick(language, "본문과 분리된 전달 정보", "Delivery data remains separate from content")} tone="muted" step={7} />
      <Module x={88} y={340} width={230} height={48} label={[pick(language, "발신자 · 수신자 · 시각 · 읽음 상태", "Sender · recipient · time · read state")]} tone="muted" step={8} dashed />
      <Module x={642} y={340} width={230} height={48} label={[pick(language, "당사자가 제출하는 신고 경로", "Participant-submitted report path")]} tone="ink" step={8} dashed />
      <Annotation x={480} y={371} text={pick(language, "현재 범위: 지원되는 1:1 쪽지 본문", "Current scope: supported one-to-one message bodies")} anchor="middle" step={9} />
    </DiagramSvg>
  );
}

function DiagramPair({
  kind,
  language,
}: {
  kind: TechnologyMotionKind;
  language: Language;
}) {
  if (kind === "overview") {
    return <><OverviewDiagram language={language} mobile={false} /><OverviewDiagram language={language} mobile /></>;
  }
  if (kind === "evidence") {
    return <><EvidenceDiagram language={language} mobile={false} /><EvidenceDiagram language={language} mobile /></>;
  }
  if (kind === "engine") {
    return <><EngineDiagram language={language} mobile={false} /><EngineDiagram language={language} mobile /></>;
  }
  if (kind === "document") {
    return <><DocumentDiagram language={language} mobile={false} /><DocumentDiagram language={language} mobile /></>;
  }
  if (kind === "image") {
    return <><ImageDiagram language={language} mobile={false} /><ImageDiagram language={language} mobile /></>;
  }
  if (kind === "layer") {
    return <><LayerDiagram language={language} mobile={false} /><LayerDiagram language={language} mobile /></>;
  }
  return <><SealDiagram language={language} mobile={false} /><SealDiagram language={language} mobile /></>;
}

export function TechnologyMotion({
  kind,
  language,
}: {
  kind: TechnologyMotionKind;
  language: Language;
}) {
  return (
    <ViewportMotion
      activeClassName="is-active"
      className={`technology-raw-diagram technology-raw-diagram-${kind}`}
      deferChildren
      eagerOnSmallScreens
      enhancedClassName="is-enhanced"
      mountMargin="720px 0px"
      once
      threshold={0.14}
    >
      <DiagramPair kind={kind} language={language} />
    </ViewportMotion>
  );
}
