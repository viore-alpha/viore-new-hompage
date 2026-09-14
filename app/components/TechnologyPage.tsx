import type { AlphaEvidenceSnapshotResult } from "@/app/alphaevidence-snapshot";
import { AlphaEvidenceSnapshot } from "@/app/components/AlphaEvidenceSnapshot";
import { TechnologyArticleNav } from "@/app/components/TechnologyArticleNav";
import { TechnologyMotion, type TechnologyMotionKind } from "@/app/components/TechnologyMotion";
import type { Language } from "@/app/site-content";

type TechnologyStatus =
  | "implemented-foundation"
  | "implemented-capability"
  | "release-in-review"
  | "integration-in-review"
  | "selected-path-active"
  | "supported-path-implemented";

const VERIFIED_DATE = "2026-07-30";

const sharedCopy = {
  ko: {
    journal: "Journal",
    published: "2026년 7월 21일",
    updated: "2026년 7월 30일 업데이트",
    hero: <>우리만의 선형을<br />만드는 과정</>,
    author: "Viore Team",
    status: "상태",
    verified: "확인 기준",
    figure: "그림",
    statuses: {
      "implemented-foundation": "구현 · 제품 기반 운영 중",
      "implemented-capability": "구현 · 제품 기능 운영 중",
      "release-in-review": "구현 · 적용 범위 확대 검토 중",
      "integration-in-review": "구현 · 제품 활성화 검토 중",
      "selected-path-active": "선택 경로 운영 검증",
      "supported-path-implemented": "구현 · 지원 1:1 쪽지",
    },
    introTitle: "하나의 답보다, 그 답이 만들어지는 전체 구조를 설계합니다",
    intro: [
      "바이오레는 의료 근거가 어디에서 왔는지, 문서와 이미지가 어떻게 다시 쓰이는지, AI 실행과 의료인 대화가 어떤 경계 안에서 움직이는지를 각각의 기술로 설계합니다. 서로 다른 기술은 확인된 지점에서 연결되고, 그 연결이 알파닥의 의료 업무 경험을 만듭니다.",
      "구현과 제품 연결, 실제 운영은 같은 말이 아닙니다. 바이오레는 기술을 하나의 완성된 묶음으로 포장하기보다 확인한 범위를 밝히고, 다음 연결을 계속 넓혀갑니다.",
    ],
    quote: {
      first: "모델은 바뀔 수 있습니다.",
      second: "근거와 업무, 보호의 원칙은 남아야 합니다.",
    },
  },
  en: {
    journal: "Journal",
    published: "July 21, 2026",
    updated: "Updated July 30, 2026",
    hero: <>Medical AI,<br />built as a technology system<br />rather than one model</>,
    author: "Viore Team",
    status: "Status",
    verified: "Verified as of",
    figure: "Figure",
    statuses: {
      "implemented-foundation": "IMPLEMENTED · PRODUCT FOUNDATION ACTIVE",
      "implemented-capability": "IMPLEMENTED · PRODUCT CAPABILITY ACTIVE",
      "release-in-review": "IMPLEMENTED · SCOPE EXPANSION REVIEW",
      "integration-in-review": "IMPLEMENTED · PRODUCT ACTIVATION REVIEW",
      "selected-path-active": "SELECTED PATHS RUNTIME-VERIFIED",
      "supported-path-implemented": "IMPLEMENTED · SUPPORTED 1:1 MESSAGING",
    },
    introTitle: "We design the whole system behind the answer",
    intro: [
      "Viore designs distinct technologies around where medical evidence came from, how documents and images remain reusable, and which boundaries govern AI execution and professional conversations. Those technologies connect where their behavior has been verified, and together they shape the medical-work experience in Alphadoc.",
      "Implementation, product connection, and live operation are not the same. Rather than presenting the portfolio as one finished bundle, Viore states what has been verified and keeps extending the connections.",
    ],
    quote: {
      first: "Models can change.",
      second: "The principles for evidence, work, and protection should remain.",
    },
  },
} as const;

const articleCopy = {
  ko: {
    evidence: {
      name: "AlphaEvidence",
      englishTitle: "Evidence Foundation",
      lead: "검색 결과보다 먼저, 출처와 변화가 남는 근거 기반을 만듭니다.",
      sections: [
        {
          title: "근거는 어디에서 왔는가",
          paragraphs: [
            "논문과 진료지침은 많이 모았다는 이유만으로 믿을 만한 근거가 되지 않습니다. 어디에서 들어왔고 언제 확인됐는지, 그 뒤 무엇이 달라졌는지가 함께 남아야 의료인이 다시 살필 수 있습니다.",
            "AlphaEvidence는 문헌과 진료지침의 식별 정보, 출처, 이용 조건과 변화 이력을 이어 둡니다. 답변을 쌓아두는 데이터베이스가 아니라, 판단에 쓰인 근거를 다시 찾아갈 수 있게 하는 기반입니다.",
          ],
        },
        {
          title: "자료가 판단의 맥락이 되기까지",
          paragraphs: [
            "확인 가능한 자료가 들어오면 출처와 식별 정보를 맞추고, 같은 자료의 변화와 품질 신호를 이어 붙입니다. AlphaDoc Engine에는 이 계보가 보존된 근거 맥락을 전달합니다.",
            "AlphaEvidence Foundation은 알파닥의 근거 경로에 연결돼 있습니다. 공개 집계는 문헌 레코드와 진료지침의 규모를 보여주는 지표이며, 개별 레코드의 임상 검증 완료 건수와는 구분됩니다.",
          ],
        },
      ],
      figureTitle: "Evidence that keeps its lineage",
      figureCaption: "AlphaEvidence는 확인 가능한 자료를 출처와 변화가 남는 계보로 정리해, AlphaDoc Engine과 의료인이 다시 살필 수 있는 근거 맥락으로 전달합니다.",
      snapshotTitle: "현재 확인할 수 있는 AlphaEvidence DB",
    },
    engine: {
      name: "AlphaDoc Engine",
      englishTitle: "Medical Workflow Orchestration",
      lead: "질문을 답변에서 끝내지 않고, 다음 의료 업무로 이어지게 합니다.",
      sections: [
        {
          title: "질문 다음의 일을 설계하다",
          paragraphs: [
            "같은 질문이라도 근거를 찾는 일, 문서를 다루는 일, 번역하거나 기록을 정리하는 일은 필요한 입력과 검토가 다릅니다. AlphaDoc Engine은 어떤 모델을 쓸지보다 사용자가 지금 무엇을 하려는지부터 구분합니다.",
            "그 목적에 맞는 근거와 문서 맥락, 도구와 결과 형태를 조합합니다. AlphaDoc Engine은 자체 거대언어모델이 아니라, 바이오레의 기술을 의료 업무에 맞게 연결하는 실행 계층입니다.",
          ],
        },
        {
          title: "업무의 목적이 다음 행동으로 이어지는 길",
          paragraphs: [
            "업무 목적을 확인한 뒤 필요한 AlphaEvidence 근거와 사용 가능한 문서·이미지 아티팩트를 불러옵니다. 보호가 필요한 외부 실행은 AlphaLayer가 적용된 경로로 보내고, 결과는 사용자의 검토와 다음 작업으로 돌아옵니다.",
            "이 실행 구조는 여러 알파닥 기능에서 동작합니다. 근거 품질을 평가하는 범위와 방식은 기능에 따라 달라집니다.",
          ],
        },
      ],
      figureTitle: "From purpose to the next medical task",
      figureCaption: "AlphaDoc Engine은 업무 목적에 맞는 근거와 사용 가능한 아티팩트, 선택된 보호 실행 경로를 조합하고 결과를 사용자 검토와 다음 작업으로 돌려보냅니다.",
    },
    document: {
      name: "AlphaDocument",
      englishTitle: "Deterministic Document-to-Artifact Engine",
      lead: "문서를 한 번 읽고 버리는 텍스트가 아니라, 다시 쓸 수 있는 지식으로 바꿉니다.",
      sections: [
        {
          title: "읽은 문서를 다시 쓰는 지식으로",
          paragraphs: [
            "PDF, DOCX, HWP, CSV는 구조를 표현하는 방식이 서로 다릅니다. 텍스트만 뽑아내면 표와 문단, 원문의 위치와 처리 이력이 빠지기 쉽습니다.",
            "AlphaDocument는 지원되는 문서를 구조와 출처가 함께 남는 Document Artifact로 바꿉니다. 같은 입력과 처리 기준에서 결과를 다시 확인할 수 있게 만들고, 문서 지식을 특정 화면 하나에 가두지 않습니다.",
          ],
        },
        {
          title: "문서가 아티팩트로 이어지는 과정",
          paragraphs: [
            "지원 문서를 읽고 보존할 수 있는 구조와 원문 위치를 정리한 뒤, 처리 기준과 무결성 정보를 묶습니다. 만들어진 아티팩트는 알파닥에서 문서 맥락이 필요한 기능에 다시 쓰입니다.",
            "핵심 엔진과 제품 연결 경로는 구현돼 있으며, 적용 범위를 넓히는 단계입니다. 보존 가능한 요소는 형식마다 다르므로 원본의 모든 표·이미지·페이지 배치를 그대로 재현하는 기술은 아닙니다.",
          ],
        },
      ],
      figureTitle: "A document that remains reusable",
      figureCaption: "지원되는 문서는 AlphaDocument에서 보존 가능한 구조와 출처가 남는 아티팩트가 되고, 알파닥의 문서 맥락이 필요한 기능에서 다시 쓰입니다.",
    },
    image: {
      name: "AlphaImage",
      englishTitle: "Deterministic Image Artifact Compiler",
      lead: "이미지를 해석하기 전에, 같은 기준으로 다룰 수 있는 입력으로 만듭니다.",
      sections: [
        {
          title: "해석 전에 입력을 바로 세우다",
          paragraphs: [
            "같은 이미지라도 형식과 방향, 크기와 좌표 기준이 다르면 다음 단계는 서로 다른 대상을 보게 됩니다. 원본과 변환본을 따로 다루면 무엇이 어디서 바뀌었는지도 놓치기 쉽습니다.",
            "AlphaImage는 지원되는 정적 이미지를 일관된 표현과 좌표 체계로 정리하고, 원본과 기존 주석의 계보를 함께 남기는 Image Artifact를 만듭니다.",
          ],
        },
        {
          title: "서로 다른 이미지를 하나의 기준으로",
          paragraphs: [
            "허용된 입력인지 확인한 뒤 안전한 공통 표현으로 바꾸고, 좌표 변환과 기존 주석의 출처를 아티팩트에 연결합니다. 후속 기능은 이 공통 기반을 다시 사용합니다.",
            "기술 구현과 제한된 합성 입력의 실행 검증을 마쳤고, 알파닥 사용자 경로 활성화는 검토 중입니다. AlphaImage는 영상을 판독하거나 진단하는 기술이 아니며, 환자정보 처리 준비나 법적 적합성까지 확인한 상태도 아닙니다.",
          ],
        },
      ],
      figureTitle: "A consistent foundation before interpretation",
      figureCaption: "AlphaImage는 지원되는 정적 이미지를 공통 표현과 좌표로 정리하고 원본과 기존 주석의 계보를 이어, 후속 기능이 다시 쓸 수 있는 기반으로 만듭니다.",
    },
    layer: {
      name: "AlphaLayer",
      englishTitle: "Protected Inference Gateway",
      lead: "외부 AI가 필요한 선택 경로를 하나의 통제 경계로 묶습니다.",
      sections: [
        {
          title: "LLM의 자율성과 보안의 경계를 바로잡다",
          paragraphs: [
            "몇 개의 문자열을 가렸다고 의료 AI 실행이 통제되는 것은 아닙니다. 어떤 업무가 어떤 조건으로 외부 AI를 쓰는지 확인하고, 허용되지 않은 요청은 경계 밖으로 나가기 전에 멈춰야 합니다.",
            "AlphaLayer는 AlphaDoc Engine과 외부 AI 실행 사이에서 등록된 목적과 요청 조건을 확인합니다. 지원되는 데이터 유형과 텍스트 범위에 정책을 적용하고, 필요한 실행 맥락만 다음 단계로 보냅니다.",
          ],
        },
        {
          title: "선택된 실행만 경계를 건너는 길",
          paragraphs: [
            "선택된 보호 텍스트는 등록된 정책 경계를 거쳐 외부에서 실행됩니다. 돌아온 결과가 같은 요청에 속하는지 확인한 뒤 알파닥에 전달하고, 운영에 필요한 범위의 기록만 남기는 것이 원칙입니다.",
            "현재 알파닥의 선택된 텍스트 기능에서 운영 검증됐습니다. 보호 범위는 모든 기능·식별정보 유형·이미지·원문 파일로 자동 확장되지 않으며, 환자정보 처리 준비나 법적 적합성과도 구분됩니다.",
          ],
        },
      ],
      figureTitle: "One boundary for selected external execution",
      figureCaption: "AlphaLayer는 선택된 보호 텍스트를 등록된 정책 경계에서 확인하고, 통제된 외부 실행과 제한된 결과 반환을 같은 요청 맥락으로 잇습니다.",
    },
    seal: {
      name: "AlphaSeal",
      englishTitle: "End-to-End Conversation Seal",
      lead: "지원되는 1:1 쪽지의 본문을 참여자의 브라우저 사이에서 암호화합니다.",
      sections: [
        {
          title: "대화 내용과 전달 정보를 분리하다",
          paragraphs: [
            "전송 구간만 암호화하면 보관 단계에서는 서버가 내용을 읽을 수 있습니다. AlphaSeal이 적용된 1:1 쪽지는 본문을 참여자의 브라우저에서 암호화하고, 일반 저장 경로에는 암호문을 남깁니다.",
            "발신자와 수신자, 시각, 읽음 상태처럼 전달에 필요한 메타데이터는 따로 남습니다. 신고된 내용은 당사자가 복호화해 제출할 수 있습니다. 따라서 AlphaSeal을 모든 대화 정보가 보이지 않는 기술로 표현하지 않습니다.",
          ],
        },
        {
          title: "브라우저에서 봉인하고 상대의 브라우저에서 열다",
          paragraphs: [
            "지원되는 새 쪽지는 대화 맥락과 발신 순서에 묶여 암호화되고, 수신자의 브라우저에서 검증과 복호화를 거칩니다. 지원 환경과 복구 설정에 따라 키를 보호하고 기기 변경 경로를 제공합니다.",
            "현재 적용 범위는 지원되는 1:1 쪽지입니다. 그룹 대화, 완전한 순방향 비밀성, 이미 침해된 사용자 브라우저의 보호, 환자정보 전송 적합성은 이 범위에 포함되지 않습니다.",
          ],
        },
      ],
      figureTitle: "Message body sealed between participant browsers",
      figureCaption: "AlphaSeal이 적용된 1:1 쪽지 본문은 발신자 브라우저에서 암호화돼 일반 저장 경로에 암호문으로 남고, 수신자 브라우저에서 열립니다. 전달 메타데이터와 신고 경로는 별도입니다.",
    },
  },
  en: {
    evidence: {
      name: "AlphaEvidence",
      englishTitle: "Evidence Foundation",
      lead: "Before retrieval, we build an evidence foundation that keeps source and change intact.",
      sections: [
        {
          title: "Where did the evidence come from?",
          paragraphs: [
            "A large collection of papers and guidelines is not automatically trustworthy evidence. Clinicians need to see where material came from, when it was observed, and what changed later.",
            "AlphaEvidence keeps identity, provenance, usage context, and change history connected. It is not a database of stored answers; it is a foundation that lets people return to the evidence behind a judgment.",
          ],
        },
        {
          title: "From source material to a reviewable judgment",
          paragraphs: [
            "When verifiable material enters the system, AlphaEvidence aligns its source and identity and connects later change and quality signals. AlphaDoc Engine receives evidence context with this lineage intact.",
            "AlphaEvidence Foundation is connected to evidence paths in Alphadoc. Public counts describe the scale of literature records and guidelines; they are separate from any count of records that have completed clinical validation.",
          ],
        },
      ],
      figureTitle: "Evidence that keeps its lineage",
      figureCaption: "AlphaEvidence organizes verifiable material into source- and change-aware lineage, then supplies evidence context that AlphaDoc Engine and clinicians can review again.",
      snapshotTitle: "A current public view of AlphaEvidence DB",
    },
    engine: {
      name: "AlphaDoc Engine",
      englishTitle: "Medical Workflow Orchestration",
      lead: "A question should lead beyond an answer to the next medical task.",
      sections: [
        {
          title: "Designing what happens after the question",
          paragraphs: [
            "Evidence discovery, document work, translation, and record preparation need different inputs and review. AlphaDoc Engine identifies what the user is trying to do before it considers model execution.",
            "It combines the evidence, document context, tools, and output form appropriate to that purpose. AlphaDoc Engine is not Viore's own large language model; it is the execution layer connecting Viore technologies to medical work.",
          ],
        },
        {
          title: "How purpose leads to the next action",
          paragraphs: [
            "After identifying the task, the Engine brings in the required AlphaEvidence context and available document or image artifacts. External execution that needs protection uses an AlphaLayer-covered path, and the result returns to user review and the next task.",
            "This execution structure operates across several Alphadoc features. The scope and method of evidence-quality evaluation vary by feature.",
          ],
        },
      ],
      figureTitle: "From purpose to the next medical task",
      figureCaption: "AlphaDoc Engine combines evidence, available artifacts, and selected protected execution paths around the task, then returns the result to user review and the next action.",
    },
    document: {
      name: "AlphaDocument",
      englishTitle: "Deterministic Document-to-Artifact Engine",
      lead: "Documents become reusable knowledge instead of disposable text.",
      sections: [
        {
          title: "From a document read once to knowledge reused",
          paragraphs: [
            "PDF, DOCX, HWP, and CSV files express structure differently. Extracting text alone can lose tables, paragraphs, source locations, and processing history.",
            "AlphaDocument turns supported documents into Document Artifacts that keep recoverable structure and provenance together. Results can be checked again under the same input and processing basis, without trapping document knowledge inside one screen.",
          ],
        },
        {
          title: "How a document becomes an artifact",
          paragraphs: [
            "AlphaDocument reads a supported document, organizes the structure and source locations it can preserve, and binds them to processing and integrity context. Alphadoc features that need document context can reuse the resulting artifact.",
            "The core engine and product connection paths are implemented, while the scope of use continues to expand. What can be preserved varies by format, so the technology does not reproduce every table, image, or page layout exactly.",
          ],
        },
      ],
      figureTitle: "A document that remains reusable",
      figureCaption: "A supported document becomes an artifact carrying the structure and provenance AlphaDocument can preserve, ready for reuse in Alphadoc features that need document context.",
    },
    image: {
      name: "AlphaImage",
      englishTitle: "Deterministic Image Artifact Compiler",
      lead: "Before interpretation, images need a consistent and reusable foundation.",
      sections: [
        {
          title: "Set the input straight before interpretation",
          paragraphs: [
            "Format, orientation, dimensions, and coordinate conventions can make the same image appear different downstream. Separating source and transformed images also makes it easy to lose where a change occurred.",
            "AlphaImage organizes supported static images into consistent representations and coordinates while keeping source and existing-annotation lineage inside an Image Artifact.",
          ],
        },
        {
          title: "Bringing different images onto one reference",
          paragraphs: [
            "After checking that an input is supported, AlphaImage produces a safe shared representation and keeps coordinate transformations and existing annotation sources connected. Downstream features can reuse this common foundation.",
            "Implementation and bounded synthetic-input runtime verification are complete, while activation in Alphadoc user paths remains under review. AlphaImage does not interpret or diagnose images, and patient-information readiness or legal suitability has not been established.",
          ],
        },
      ],
      figureTitle: "A consistent foundation before interpretation",
      figureCaption: "AlphaImage organizes supported static images into common representations and coordinates, keeping source and existing-annotation lineage available for downstream reuse.",
    },
    layer: {
      name: "AlphaLayer",
      englishTitle: "Protected Inference Gateway",
      lead: "Selected paths that need external AI execution pass through one control boundary.",
      sections: [
        {
          title: "Resetting the boundary between LLM autonomy and security",
          paragraphs: [
            "Masking a few strings does not govern medical AI execution. The system must identify which task is using external AI under which conditions and stop requests that do not meet them before they leave the boundary.",
            "AlphaLayer checks registered purpose and request conditions between AlphaDoc Engine and external AI execution. It applies policy to supported data types and text scopes and passes only the execution context that the covered path needs.",
          ],
        },
        {
          title: "Only selected execution crosses the boundary",
          paragraphs: [
            "Selected protected text passes through a registered policy boundary for external execution. The returning result is checked against the request context before Alphadoc receives it, and only records needed to operate the covered path are retained.",
            "Selected text capabilities in Alphadoc are runtime-verified through AlphaLayer. The protection scope does not automatically extend to every feature, identifier type, image, or source file, and remains distinct from patient-information readiness or legal suitability.",
          ],
        },
      ],
      figureTitle: "One boundary for selected external execution",
      figureCaption: "AlphaLayer checks selected protected text against a registered policy boundary and keeps controlled external execution and bounded result return in the same request context.",
    },
    seal: {
      name: "AlphaSeal",
      englishTitle: "End-to-End Conversation Seal",
      lead: "AlphaSeal encrypts message bodies on supported one-to-one paths between participant browsers.",
      sections: [
        {
          title: "Separating conversation content from delivery data",
          paragraphs: [
            "Transport encryption alone can still leave stored content readable to a server. On supported one-to-one paths, AlphaSeal encrypts message bodies in participant browsers and leaves ciphertext in the ordinary storage path.",
            "Delivery metadata such as sender, recipient, time, and read state remains separate. A participant can also decrypt and submit a reported message. AlphaSeal therefore does not mean that every piece of conversation information is invisible.",
          ],
        },
        {
          title: "Sealed in one browser, opened in the other",
          paragraphs: [
            "Supported new messages are encrypted with conversation and sender-order context, then verified and decrypted in the recipient browser. Key protection and device-change paths depend on the supported environment and recovery setup.",
            "The current scope is supported one-to-one messaging. Group conversations, perfect forward secrecy, protection after a participant browser is compromised, and suitability for transmitting patient information are outside that scope.",
          ],
        },
      ],
      figureTitle: "Message body sealed between participant browsers",
      figureCaption: "On supported one-to-one paths, the sender browser encrypts the message body, ordinary storage retains ciphertext, and the recipient browser opens it. Delivery metadata and reporting paths remain separate.",
    },
  },
} as const;

function TechnologySectionHeader({
  language,
  index,
  name,
  englishTitle,
  lead,
  status,
}: {
  language: Language;
  index: string;
  name: string;
  englishTitle: string;
  lead: string;
  status: TechnologyStatus;
}) {
  const labels = sharedCopy[language];
  const statusClass = status;

  return (
    <header className="technology-section-header">
      <div className="technology-post-heading">
        <span className="technology-post-number">POST {index}</span>
        <div>
          <p className="technology-section-english">{englishTitle}</p>
          <h2>{name}</h2>
          <p className="technology-section-lead">{lead}</p>
        </div>
      </div>

      <dl className="technology-status-list">
        <div>
          <dt>{labels.status}</dt>
          <dd><span className={`technology-status technology-status-${statusClass}`}>{labels.statuses[status]}</span></dd>
        </div>
        <div>
          <dt>{labels.verified}</dt>
          <dd><time dateTime={VERIFIED_DATE}>{VERIFIED_DATE}</time></dd>
        </div>
      </dl>
    </header>
  );
}

function TechnologyFigure({
  language,
  number,
  kind,
  caption,
}: {
  language: Language;
  number: string;
  kind: TechnologyMotionKind;
  caption: string;
}) {
  return (
    <figure className={`technology-figure technology-figure-${kind}`}>
      <TechnologyMotion kind={kind} language={language} />
      <figcaption>
        <strong>{sharedCopy[language].figure} {number}</strong>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

function ProseSections({
  sections,
}: {
  sections: ReadonlyArray<{
    title: string;
    paragraphs: readonly string[];
  }>;
}) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.title}>
          <h3>{section.title}</h3>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ))}
    </>
  );
}

export function TechnologyPage({
  language,
  snapshotResult,
}: {
  language: Language;
  snapshotResult: AlphaEvidenceSnapshotResult;
}) {
  const page = sharedCopy[language];
  const articles = articleCopy[language];

  return (
    <div className="technology-journal" lang={language}>
      <header className="technology-hero" id="technology-overview">
        <div className="technology-hero-meta">
          <span>{page.journal}</span>
          <p><time dateTime="2026-07-21">{page.published}</time><small>{page.updated}</small></p>
        </div>

        <h1>{page.hero}</h1>
        <p className="technology-hero-author">{page.author}</p>

        <section className="technology-intro-copy" aria-labelledby="technology-intro-title">
          <h2 id="technology-intro-title">{page.introTitle}</h2>
          {page.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <blockquote>
            <span>{page.quote.first}</span>
            <strong>{page.quote.second}</strong>
          </blockquote>
        </section>

        <TechnologyFigure
          language={language}
          number="01"
          kind="overview"
          caption={language === "ko"
            ? "바이오레는 근거, 문서·이미지, 업무 실행, 외부 AI 통제와 1:1 대화 보호를 서로 다른 기술로 나눕니다. 각 기술은 검증된 범위에서만 알파닥과 연결됩니다."
            : "Viore separates evidence, documents and images, work orchestration, external AI control, and one-to-one conversation protection into distinct technologies. Each connects to Alphadoc only within its verified scope."}
        />
      </header>

      <TechnologyArticleNav language={language} />

      <main className="technology-article-stream">
        <article id="technology-alphaevidence" className="technology-post" data-tech-status="implemented-foundation">
          <TechnologySectionHeader
            language={language}
            index="01"
            name={articles.evidence.name}
            englishTitle={articles.evidence.englishTitle}
            lead={articles.evidence.lead}
            status="implemented-foundation"
          />
          <div className="technology-prose">
            <ProseSections sections={articles.evidence.sections} />
            <TechnologyFigure
              language={language}
              number="02"
              kind="evidence"
              caption={articles.evidence.figureCaption}
            />
            <section className="technology-data-section">
              <h3>{articles.evidence.snapshotTitle}</h3>
              <AlphaEvidenceSnapshot initialResult={snapshotResult} language={language} />
            </section>
          </div>
        </article>

        <article id="technology-alphadoc-engine" className="technology-post" data-tech-status="implemented-capability">
          <TechnologySectionHeader
            language={language}
            index="02"
            name={articles.engine.name}
            englishTitle={articles.engine.englishTitle}
            lead={articles.engine.lead}
            status="implemented-capability"
          />
          <div className="technology-prose">
            <ProseSections sections={articles.engine.sections} />
            <TechnologyFigure
              language={language}
              number="03"
              kind="engine"
              caption={articles.engine.figureCaption}
            />
          </div>
        </article>

        <article id="technology-alphadocument" className="technology-post" data-tech-status="release-in-review">
          <TechnologySectionHeader
            language={language}
            index="03"
            name={articles.document.name}
            englishTitle={articles.document.englishTitle}
            lead={articles.document.lead}
            status="release-in-review"
          />
          <div className="technology-prose">
            <ProseSections sections={articles.document.sections} />
            <TechnologyFigure
              language={language}
              number="04"
              kind="document"
              caption={articles.document.figureCaption}
            />
          </div>
        </article>

        <article id="technology-alphaimage" className="technology-post" data-tech-status="integration-in-review">
          <TechnologySectionHeader
            language={language}
            index="04"
            name={articles.image.name}
            englishTitle={articles.image.englishTitle}
            lead={articles.image.lead}
            status="integration-in-review"
          />
          <div className="technology-prose">
            <ProseSections sections={articles.image.sections} />
            <TechnologyFigure
              language={language}
              number="05"
              kind="image"
              caption={articles.image.figureCaption}
            />
          </div>
        </article>

        <article id="technology-alphalayer" className="technology-post" data-tech-status="selected-path-active">
          <TechnologySectionHeader
            language={language}
            index="05"
            name={articles.layer.name}
            englishTitle={articles.layer.englishTitle}
            lead={articles.layer.lead}
            status="selected-path-active"
          />
          <div className="technology-prose">
            <ProseSections sections={articles.layer.sections} />
            <TechnologyFigure
              language={language}
              number="06"
              kind="layer"
              caption={articles.layer.figureCaption}
            />
          </div>
        </article>

        <article id="technology-alphaseal" className="technology-post" data-tech-status="supported-path-implemented">
          <TechnologySectionHeader
            language={language}
            index="06"
            name={articles.seal.name}
            englishTitle={articles.seal.englishTitle}
            lead={articles.seal.lead}
            status="supported-path-implemented"
          />
          <div className="technology-prose">
            <ProseSections sections={articles.seal.sections} />
            <TechnologyFigure
              language={language}
              number="07"
              kind="seal"
              caption={articles.seal.figureCaption}
            />
          </div>
        </article>
      </main>
    </div>
  );
}
