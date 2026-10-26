import { Fragment, type ReactNode } from "react";
import type { AlphaEvidenceSnapshotResult } from "@/app/alphaevidence-snapshot";
import { AlphaEvidenceSnapshot } from "@/app/components/AlphaEvidenceSnapshot";
import { TechnologyMotion, type TechnologyMotionKind } from "@/app/components/TechnologyMotion";
import { TechnologyPostCard } from "@/app/components/TechnologyPostCard";
import { SITE_UPDATED_AT } from "@/app/seo";
import { technologyAnchors, type Language } from "@/app/site-content";

type TechnologyStatus =
  | "implemented-foundation"
  | "implemented-capability"
  | "release-in-review"
  | "integration-in-review"
  | "selected-path-active"
  | "supported-path-implemented"
  | "coming-soon"
  | "first-site-installed"
  | "first-site-applied";

type ProseLink = { text: string; href: string };
type ProseParagraph = string | ReadonlyArray<string | ProseLink>;

const VERIFIED_DATE = "2026-07-30";
const MODEL_ANCHOR = `#${technologyAnchors["medical-model"]}`;
const LAYER_ANCHOR = `#${technologyAnchors.alphalayer}`;
const EVIDENCE_ANCHOR = `#${technologyAnchors.alphaevidence}`;

const ENGLISH_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatUpdated(language: Language) {
  const [year, month, day] = SITE_UPDATED_AT.split("-").map(Number);
  return language === "ko"
    ? `${year}년 ${month}월 ${day}일 업데이트`
    : `Updated ${ENGLISH_MONTHS[month - 1]} ${day}, ${year}`;
}

const sharedCopy = {
  ko: {
    journal: "Journal",
    published: "2026년 7월 21일",
    hero: <>우리만의 선형을<br />만드는 과정</>,
    author: "Viore Team",
    status: "상태",
    verified: "확인 기준",
    figure: "그림",
    statuses: {
      "implemented-foundation": "구현 · 제품 기반 운영 중",
      "implemented-capability": "구현 · 제품 기능 운영 중",
      "release-in-review": "구현 · 적용 범위 확대 검토 중",
      "integration-in-review": "구현 · 제품 적용 검토 중",
      "selected-path-active": "일부 기능에서 운영 검증",
      "supported-path-implemented": "구현 · 1:1 쪽지에 적용",
      "coming-soon": "Coming soon · 개발 중",
      "first-site-installed": "첫 기관 설치 · 보안 체계 구축 중",
      "first-site-applied": "구현 · 첫 기관 적용",
    },
    introTitle: "답이 만들어지는 과정 전체를 설계합니다",
    intro: [
      "바이오레는 근거가 어디서 왔는지, 문서와 이미지를 어떻게 다시 쓰는지, AI 실행과 대화가 어떤 범위 안에서 움직이는지를 기술별로 나눠 설계합니다. 각 기술은 동작을 확인한 곳에서만 서로 연결되고, 그 연결이 알파닥이 됩니다.",
      "만든 것, 제품에 붙인 것, 실제로 운영하는 것은 서로 다릅니다. 바이오레는 기술마다 어디까지 확인했는지 밝히고, 연결할 곳을 하나씩 넓혀 갑니다.",
    ],
    quote: {
      first: "모델은 바뀔 수 있습니다.",
      second: "근거와 업무, 보안의 원칙은 남아야 합니다.",
    },
    overviewCaption: "바이오레는 근거, 문서와 이미지, 업무 실행, 외부 AI 통제, 1:1 대화 보호를 각각 다른 기술로 나눕니다. 각 기술은 검증한 범위 안에서만 알파닥에 연결됩니다.",
  },
  en: {
    journal: "Journal",
    published: "July 21, 2026",
    hero: <>Drawing<br />our own linearity.</>,
    author: "Viore Team",
    status: "Status",
    verified: "Verified as of",
    figure: "Figure",
    statuses: {
      "implemented-foundation": "IMPLEMENTED · PRODUCT FOUNDATION ACTIVE",
      "implemented-capability": "IMPLEMENTED · PRODUCT CAPABILITY ACTIVE",
      "release-in-review": "IMPLEMENTED · SCOPE EXPANSION REVIEW",
      "integration-in-review": "IMPLEMENTED · PRODUCT INTEGRATION REVIEW",
      "selected-path-active": "RUNTIME-VERIFIED IN SELECTED FEATURES",
      "supported-path-implemented": "IMPLEMENTED · APPLIED TO 1:1 MESSAGES",
      "coming-soon": "Coming soon · In development",
      "first-site-installed": "Installed at first institution · Security framework in progress",
      "first-site-applied": "IMPLEMENTED · APPLIED AT FIRST INSTITUTION",
    },
    introTitle: "We design everything behind the answer.",
    intro: [
      "Viore builds a separate technology for each hard question in medical AI: where evidence comes from, how documents and images get reused, and what limits AI execution and conversations stay within. They connect only where we've verified they work, and together they become Alphadoc.",
      "Built, connected, and running are three different things. For each technology, we say exactly how far we've verified it, and we expand from there.",
    ],
    quote: {
      first: "Models can change.",
      second: "The principles for evidence, work, and security should stay.",
    },
    overviewCaption: "Viore splits evidence, documents and images, work execution, external AI control, and one-to-one conversation protection into separate technologies. Each connects to Alphadoc only within its verified scope.",
  },
} as const;

const articleCopy = {
  ko: {
    evidence: {
      name: "AlphaEvidence",
      englishTitle: "Evidence Foundation",
      lead: "검색보다 먼저, 출처와 변경 이력이 남는 근거 데이터를 만듭니다.",
      sections: [
        {
          title: "근거는 어디에서 왔는가",
          paragraphs: [
            "논문과 진료지침은 많이 모은다고 믿을 수 있는 근거가 되지 않습니다. 어디서 가져왔는지, 언제 확인했는지, 그 뒤 무엇이 바뀌었는지가 남아 있어야 의료인이 다시 확인할 수 있습니다.",
            "AlphaEvidence는 문헌과 진료지침마다 식별 정보, 출처, 이용 조건, 변경 이력을 묶어 저장합니다. 답변을 저장하지는 않습니다. 답에 쓰인 근거를 나중에 다시 찾아갈 수 있게 하는 것이 목적입니다.",
          ],
        },
        {
          title: "자료가 근거가 되기까지",
          paragraphs: [
            "새 자료가 들어오면 출처와 식별 정보를 맞추고, 같은 자료의 이전 버전과 품질 정보를 연결합니다. AlphaDoc Engine은 이렇게 이력이 붙은 근거를 받아 답에 씁니다.",
            "AlphaEvidence는 알파닥이 근거를 찾는 경로에 연결돼 있습니다. 아래 공개 집계는 보유한 문헌과 진료지침의 수이며, 임상 검증을 마친 자료의 수가 아닙니다.",
          ],
        },
      ],
      figureCaption: "AlphaEvidence는 자료를 출처와 변경 이력이 남는 형태로 정리해 AlphaDoc Engine과 의료인에게 전달합니다.",
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
            "근거를 찾는 일, 문서를 다루는 일, 기록을 정리하는 일은 필요한 입력도 확인할 점도 다릅니다. AlphaDoc Engine은 어떤 모델을 쓸지보다 사용자가 지금 하려는 일이 무엇인지를 먼저 구분합니다.",
            [
              "그다음 그 일에 맞는 근거와 문서, 도구, 답의 형식을 고릅니다. AlphaDoc Engine은 바이오레가 만든 거대언어모델이 아니라, 바이오레의 기술을 의료 업무에 맞게 묶어 실행하는 계층입니다. 바이오레가 개발 중인 ",
              { text: "의료 특화 AI 모델", href: MODEL_ANCHOR },
              "도 이 계층에서 지금 쓰는 모델을 대신할 예정입니다.",
            ],
          ],
        },
        {
          title: "목적을 확인하고 다음 작업으로",
          paragraphs: [
            "할 일을 확인하면 AlphaEvidence의 근거와 쓸 수 있는 문서, 이미지 데이터를 불러옵니다. 외부 AI 실행에 보호가 필요한 요청은 AlphaLayer가 적용된 경로로 보내고, 결과는 사용자가 확인한 뒤 다음 작업으로 넘어갑니다.",
            "이 구조는 알파닥의 여러 기능에서 동작합니다. 근거의 품질을 평가하는 범위와 방법은 기능마다 다릅니다.",
          ],
        },
      ],
      figureCaption: "AlphaDoc Engine은 할 일에 맞는 근거와 문서, 실행 경로를 고르고, 결과를 사용자 확인과 다음 작업으로 넘깁니다.",
    },
    document: {
      name: "AlphaDocument",
      englishTitle: "Deterministic Document-to-Artifact Engine",
      lead: "한 번 읽은 문서를 다시 쓸 수 있는 데이터로 바꿉니다.",
      sections: [
        {
          title: "읽은 문서를 다시 쓰는 지식으로",
          paragraphs: [
            "PDF, DOCX, HWP, CSV는 구조를 담는 방식이 서로 다릅니다. 글자만 뽑아내면 표와 문단 구분, 원문의 위치, 처리 이력이 빠지기 쉽습니다.",
            "AlphaDocument는 지원하는 문서를 구조와 출처가 남는 Document Artifact로 바꿉니다. 같은 문서를 같은 기준으로 처리하면 같은 결과가 나와 다시 확인할 수 있고, 변환한 내용은 알파닥의 여러 기능에서 다시 씁니다.",
          ],
        },
        {
          title: "문서가 아티팩트가 되는 과정",
          paragraphs: [
            "문서를 읽어 남길 수 있는 구조와 원문 위치를 정리하고, 처리 기준과 무결성 정보를 붙입니다. 이렇게 만든 아티팩트는 알파닥에서 문서 내용이 필요한 기능에 다시 쓰입니다.",
            "핵심 엔진과 제품 연결은 구현돼 있고, 적용 범위를 넓히고 있습니다. 남길 수 있는 요소는 파일 형식마다 달라서 원본의 표, 이미지, 페이지 배치를 모두 그대로 재현하지는 못합니다.",
          ],
        },
      ],
      figureCaption: "지원하는 문서는 AlphaDocument를 거쳐 구조와 출처가 남는 아티팩트가 되고, 알파닥의 여러 기능에서 다시 쓰입니다.",
    },
    image: {
      name: "AlphaImage",
      englishTitle: "Deterministic Image Artifact Compiler",
      lead: "이미지를 해석하기 전에, 같은 기준으로 다룰 수 있는 입력으로 만듭니다.",
      sections: [
        {
          title: "해석하기 전에 입력부터 맞추다",
          paragraphs: [
            "같은 이미지라도 파일 형식, 방향, 크기, 좌표 기준이 다르면 다음 단계에서는 다른 이미지처럼 다뤄집니다. 원본과 변환본을 따로 관리하면 어디서 무엇이 바뀌었는지도 알기 어렵습니다.",
            "AlphaImage는 지원하는 정적 이미지를 같은 형식과 좌표계로 정리하고, 원본과 기존 주석의 이력을 남긴 Image Artifact를 만듭니다.",
          ],
        },
        {
          title: "서로 다른 이미지를 하나의 기준으로",
          paragraphs: [
            "허용된 입력인지 확인한 뒤 안전한 공통 형식으로 바꾸고, 좌표 변환 내역과 기존 주석의 출처를 아티팩트에 기록합니다. 이후 기능은 이 결과를 다시 씁니다.",
            "구현과 합성 이미지를 사용한 제한된 실행 검증을 마쳤고, 알파닥 사용자 화면에 적용할지는 검토 중입니다. AlphaImage는 영상을 판독하거나 진단하지 않으며, 환자정보 처리 준비나 법적 적합성은 확인하지 않았습니다.",
          ],
        },
      ],
      figureCaption: "AlphaImage는 지원하는 정적 이미지를 같은 형식과 좌표로 정리하고 원본과 주석의 이력을 남겨, 이후 기능이 다시 쓸 수 있게 합니다.",
    },
    layer: {
      name: "AlphaLayer",
      englishTitle: "Protected Inference Gateway",
      lead: "외부 AI를 쓰는 일부 기능을 하나의 통제 지점으로 모읍니다.",
      sections: [
        {
          title: "외부 AI를 쓸 때의 경계를 정하다",
          paragraphs: [
            "일부 글자를 가린다고 외부 AI 사용이 통제되지는 않습니다. 어떤 기능이 어떤 조건에서 외부 AI를 쓰는지 확인하고, 허용되지 않은 요청은 밖으로 나가기 전에 막아야 합니다.",
            "AlphaLayer는 AlphaDoc Engine과 외부 AI 사이에서 요청이 등록된 목적과 조건에 맞는지 확인합니다. 지원하는 데이터 유형과 텍스트에 정책을 적용하고, 실행에 필요한 내용만 넘깁니다.",
          ],
        },
        {
          title: "허용된 요청만 밖으로",
          paragraphs: [
            "보호 대상으로 지정된 텍스트는 등록된 정책을 거친 뒤에만 외부 AI에서 실행됩니다. 돌아온 결과가 원래 요청의 것인지 확인한 뒤 알파닥에 전달하고, 기록은 운영에 필요한 만큼만 남기는 것을 원칙으로 합니다.",
            "현재 알파닥의 일부 텍스트 기능에서 운영 검증을 마쳤습니다. 모든 기능, 모든 식별정보 유형, 이미지, 원본 파일까지 보호하는 것은 아니며, 환자정보 처리 준비나 법적 적합성을 뜻하지도 않습니다.",
          ],
        },
      ],
      figureCaption: "AlphaLayer는 보호 대상 텍스트를 등록된 정책으로 확인한 뒤 외부 AI에서 실행하고, 결과가 같은 요청으로 돌아왔는지 확인합니다.",
    },
    seal: {
      name: "AlphaSeal",
      englishTitle: "End-to-End Conversation Seal",
      lead: "지원하는 1:1 쪽지의 본문을 보내는 사람과 받는 사람의 브라우저 사이에서 암호화합니다.",
      sections: [
        {
          title: "대화 내용과 전달 정보를 분리하다",
          paragraphs: [
            "전송 구간만 암호화하면 서버에 저장된 내용은 서버가 읽을 수 있습니다. AlphaSeal을 적용한 1:1 쪽지는 보내는 사람의 브라우저에서 본문을 암호화하므로, 서버의 일반 저장소에는 암호문으로 남습니다.",
            "보낸 사람, 받는 사람, 시각, 읽음 여부처럼 전달에 필요한 정보는 암호화하지 않고 따로 남습니다. 신고할 때는 당사자가 복호화한 내용을 제출할 수 있습니다. 그래서 AlphaSeal이 대화의 모든 정보를 숨기는 것은 아닙니다.",
          ],
        },
        {
          title: "브라우저에서 봉인하고 상대의 브라우저에서 열다",
          paragraphs: [
            "새 쪽지는 대화와 보낸 순서 정보를 묶어 암호화되고, 받는 사람의 브라우저에서 검증한 뒤 복호화됩니다. 키는 지원 환경과 복구 설정에 따라 보호되고, 기기를 바꿀 때 쓸 수 있는 복구 방법을 제공합니다.",
            "현재 적용 범위는 지원하는 1:1 쪽지입니다. 그룹 대화, 완전한 순방향 비밀성, 이미 침해된 사용자 브라우저의 보호, 환자정보 전송 적합성은 포함하지 않습니다.",
          ],
        },
      ],
      figureCaption: "1:1 쪽지 본문은 보내는 사람의 브라우저에서 암호화돼 서버에 암호문으로 저장되고, 받는 사람의 브라우저에서 열립니다. 전달 정보와 신고 경로는 따로 처리됩니다.",
    },
    model: {
      name: "의료 특화 AI 모델",
      englishTitle: "Medical-specialized AI Model",
      lead: "바이오레가 직접 미세조정하는 의료 AI 모델",
      sections: [
        {
          title: "모델을 직접 만드는 이유",
          paragraphs: [
            "의료기관 중에는 환자 정보와 내부 자료를 외부 클라우드의 상용 AI로 보낼 수 없는 곳이 많습니다. 이런 기관에는 외부 API 없이 기관 안에서 돌아가는 모델이 필요합니다. 모델을 직접 만드는 첫째 이유입니다. 둘째는 비용입니다. 답의 품질을 지키면서 더 적은 연산으로 더 빨리 답해야 기관이 감당할 수 있는 비용으로 운영할 수 있습니다. 셋째는 검증입니다. 어떤 데이터로 무엇을 학습했고 어떤 기준으로 평가했는지 밝힐 수 있어야 의료인과 기관이 모델을 믿고 쓸 수 있습니다.",
          ],
        },
        {
          title: "모델을 만드는 방법",
          paragraphs: [
            "검증된 공개 기반 모델에 의료 지식을 추가로 학습시키고 최적화합니다. 기반 모델을 처음부터 만드는 대신, 더 작은 모델에서 의료 업무에 필요한 성능을 끌어내는 데 집중합니다. 의료 성능은 AlphaEvidence의 근거를 기준으로 대형 상용 모델과 같은 조건에서 비교해 평가합니다. AlphaDoc Engine은 처음부터 특정 모델에 묶이지 않게 설계했기 때문에, 이 모델은 현재 기관 환경에서 돌아가는 공개 기반 모델의 자리에 그대로 들어갑니다. 사내망과 분리 클라우드 모두 기관 환경 안의 모델로 답하며, 외부 모델을 부르지 않습니다. 이후에는 기관이 허용한 범위와 적법한 권한 안에서 기관별 전용 모델로 넓히려 합니다.",
          ],
        },
      ],
      figureCaption: "바이오레의 의료 특화 AI 모델(V1)은 AlphaDoc Engine에서 지금의 공개 기반 모델이 있던 자리를 그대로 대신합니다. 개발 구상을 설명하는 다이어그램.",
    },
    onpremise: {
      name: "사내망 알파닥과 기관 단위 보안 체계",
      englishTitle: "Corporate Network Deployment & Zero Trust Extension",
      lead: "개인이 쓰던 AI를 기관이 도입하고 관리할 수 있게 만듭니다.",
      sections: [
        {
          title: "개인의 AI를 기관의 AI로 넓히다",
          paragraphs: [
            [
              "의료인은 이미 개인 계정으로 AI를 업무에 쓰고 있습니다. 하지만 기관이 이를 업무 도구로 들이려면 기능만으로는 부족하고, 데이터 보호, 사용 권한, 운영 기준, 감사 기록이 갖춰져야 합니다. 바이오레는 이를 두 가지로 준비합니다. 하나는 사내망이나 분리 클라우드에 설치하는 알파닥이고, 다른 하나는 기관의 정책에 따라 접근 권한과 민감정보 처리를 통제하는 기관 단위 보안 체계입니다. 사내망 알파닥은 첫 기관에 설치를 마쳤고 기관 환경에서 공개 기반 모델로 돌아갑니다. 이 모델은 바이오레의 ",
              { text: "의료 특화 AI 모델", href: MODEL_ANCHOR },
              "로 바꿀 예정입니다.",
            ],
          ],
        },
        {
          title: "AlphaLayer의 통제를 기관 전체로",
          paragraphs: [
            [
              { text: "AlphaLayer", href: LAYER_ANCHOR },
              "는 지금 일부 텍스트 기능에서 외부 AI 실행을 등록된 정책으로 통제합니다. 기관 단위 보안 체계는 이 통제를 기관 전체로 넓히는 설계입니다. 요청마다 인증과 접근 권한을 확인하고, 민감정보를 찾아 토큰으로 바꾸고, 입력과 첨부 자료를 검사한 뒤 허용된 모델만 부릅니다. 응답은 정보 누출과 복원 권한을 점검한 뒤 전달하고, 기관별 감사 기록과 보관 정책을 적용합니다. 검사를 통과하지 못한 요청은 처리하지 않고 막는 것을 원칙으로 합니다.",
            ],
          ],
        },
      ],
      figureCaption: "사내망에서 답을 만드는 모델은 인터넷에 연결되지 않고, 의학 자료는 바이오레에서 한 방향으로만 받습니다. 요청 인증부터 감사 기록까지는 기관 단위 보안 체계가 기관 안에서 통제합니다. 개발 구상을 설명하는 다이어그램.",
    },
    oneway: {
      name: "일방향 AI 구조",
      englishTitle: "One-way AI Architecture",
      lead: "의학 근거는 기관 환경으로 보내고, 기관의 데이터는 그 안에 둡니다.",
      sections: [
        {
          title: "데이터가 머무는 곳을 먼저 정하다",
          paragraphs: [
            "의료기관과 의료기업은 생성형 AI를 들이지 못하는 이유로 보안과 내부 전문 인력 부족을 꼽습니다. 문서와 기록을 외부 AI로 보내는 구조라면, 그 경로를 기관이 직접 확인하고 관리해야 합니다.",
            "알파닥은 답을 만드는 모델과 자료를 기관 환경 안에 둡니다. 사내망이나 분리 클라우드에 설치하고, 답변에 외부 AI를 쓰지 않습니다. 개인 노트는 나만 보는 것이 기본이고, 조직에 공유하는 범위는 기관이 정합니다.",
          ],
        },
        {
          title: "근거를 한 방향으로 보내다",
          paragraphs: [
            [
              "새 지침과 문헌은 ",
              { text: "AlphaEvidence", href: EVIDENCE_ANCHOR },
              "에서 정리한 뒤 각 기관 환경으로 보냅니다. 모델과 보안 업데이트도 같은 방향으로만 보냅니다. 기관의 문서, 질문, 답변은 이 경로를 거꾸로 타고 바이오레로 오지 않습니다.",
            ],
            "이 구조는 첫 기관의 사내망에 적용돼 있습니다. 일방향 구조는 데이터가 어디에 머물고 어디로 흐르는지에 대한 설계이며, 기관의 개인정보 처리 근거나 법적 적합성까지 확인해 주지는 않습니다.",
          ],
        },
      ],
      figureCaption: "의학 근거는 바이오레에서 각 기관으로 한 방향으로만 갱신되고, 알파닥은 기관 안의 모델과 자료로 답합니다. 기관의 문서와 노트는 기관 환경에 남습니다.",
    },
  },
  en: {
    evidence: {
      name: "AlphaEvidence",
      englishTitle: "Evidence Foundation",
      lead: "Before search, an evidence base that keeps every source and every change.",
      sections: [
        {
          title: "Where did the evidence come from?",
          paragraphs: [
            "Collecting more papers and guidelines doesn't make them trustworthy. Clinicians need to know where something came from, when it was checked, and what has changed since.",
            "AlphaEvidence stores identity, source, terms of use, and change history for every paper and guideline. It doesn't store answers. It lets you trace an answer back to the evidence behind it.",
          ],
        },
        {
          title: "From source to evidence",
          paragraphs: [
            "When new material arrives, AlphaEvidence matches its source and identity, then links earlier versions and quality signals. AlphaDoc Engine answers with that history attached.",
            "AlphaEvidence is connected to how Alphadoc finds evidence. The public counts below show how many papers and guidelines we hold. They are not counts of clinically validated records.",
          ],
        },
      ],
      figureCaption: "AlphaEvidence keeps source and change history with every record, then passes that evidence to AlphaDoc Engine and to clinicians.",
      snapshotTitle: "AlphaEvidence DB, right now",
    },
    engine: {
      name: "AlphaDoc Engine",
      englishTitle: "Medical Workflow Orchestration",
      lead: "An answer shouldn't be the end. It should lead to the next task.",
      sections: [
        {
          title: "Designing what comes after the question",
          paragraphs: [
            "Finding evidence, working with documents, and organizing records each need different inputs and different checks. So before choosing a model, AlphaDoc Engine works out what you're actually trying to do.",
            [
              "Then it picks the evidence, documents, tools, and answer format that fit. AlphaDoc Engine isn't Viore's own large language model. It's the execution layer that ties Viore's technologies to medical work. Viore's ",
              { text: "medical AI model", href: MODEL_ANCHOR },
              ", now in development, will take the place of the model used here today.",
            ],
          ],
        },
        {
          title: "From purpose to the next step",
          paragraphs: [
            "Once the task is clear, the engine pulls in AlphaEvidence and any usable documents or images. Requests that need protection on their way to external AI go through AlphaLayer, and results come back for your review before the next step.",
            "This structure runs across Alphadoc features. How evidence quality is evaluated depends on the feature.",
          ],
        },
      ],
      figureCaption: "AlphaDoc Engine matches evidence, documents, and an execution path to the task, then hands the result back for review and the next step.",
    },
    document: {
      name: "AlphaDocument",
      englishTitle: "Deterministic Document-to-Artifact Engine",
      lead: "Read a document once. Use what's in it again and again.",
      sections: [
        {
          title: "From read once to reused",
          paragraphs: [
            "PDF, DOCX, HWP, and CSV all store structure differently. Pull out only the text, and you lose tables, paragraph breaks, source locations, and processing history.",
            "AlphaDocument turns supported documents into Document Artifacts that keep structure and source together. Same document, same rules, same result, so you can always check it again. The converted content then works across Alphadoc.",
          ],
        },
        {
          title: "How a document becomes an artifact",
          paragraphs: [
            "It reads the document, maps the structure and source locations it can keep, and attaches the processing rules and integrity data. Any Alphadoc feature that needs the document can reuse the artifact.",
            "The core engine and product connections are built, and coverage is growing. What can be preserved varies by format, so not every table, image, or page layout is reproduced exactly.",
          ],
        },
      ],
      figureCaption: "Supported documents pass through AlphaDocument and become artifacts that keep structure and source, ready to reuse across Alphadoc.",
    },
    image: {
      name: "AlphaImage",
      englishTitle: "Deterministic Image Artifact Compiler",
      lead: "Before an image is interpreted, make it consistent.",
      sections: [
        {
          title: "Get the input right first",
          paragraphs: [
            "The same image can look like a different one downstream if its format, orientation, size, or coordinates differ. Keep the original and the converted copy apart, and it's hard to tell what changed and where.",
            "AlphaImage brings supported static images to one format and coordinate system, and creates an Image Artifact that keeps the history of the original and its existing annotations.",
          ],
        },
        {
          title: "One standard for every image",
          paragraphs: [
            "It checks that the input is allowed, converts it to a safe common format, and records coordinate changes and annotation sources in the artifact. Later features reuse that result.",
            "It's built and has passed limited runtime checks with synthetic images. Whether to bring it to Alphadoc's user-facing features is still under review. AlphaImage does not read or diagnose images, and patient-information readiness and legal suitability have not been established.",
          ],
        },
      ],
      figureCaption: "AlphaImage aligns supported static images to one format and coordinate system and keeps the history of originals and annotations for later reuse.",
    },
    layer: {
      name: "AlphaLayer",
      englishTitle: "Protected Inference Gateway",
      lead: "One checkpoint for the features that use external AI.",
      sections: [
        {
          title: "Drawing the line for external AI",
          paragraphs: [
            "Masking a few words doesn't control how external AI gets used. You have to know which feature uses external AI and under what conditions, and stop anything that isn't allowed before it leaves.",
            "AlphaLayer sits between AlphaDoc Engine and external AI and checks each request against its registered purpose and conditions. It applies policy to supported data types and text, and sends only what execution needs.",
          ],
        },
        {
          title: "Only approved requests go out",
          paragraphs: [
            "Text marked for protection reaches external AI only after passing the registered policy. Results are checked against the original request before Alphadoc receives them, and logs are kept only to the extent operations require.",
            "It's runtime-verified in selected Alphadoc text features. It doesn't cover every feature, every identifier type, images, or original files, and it doesn't establish patient-information readiness or legal suitability.",
          ],
        },
      ],
      figureCaption: "AlphaLayer checks protected text against registered policy, runs it on external AI, and confirms the result belongs to the same request.",
    },
    seal: {
      name: "AlphaSeal",
      englishTitle: "End-to-End Conversation Seal",
      lead: "Supported one-to-one messages, encrypted between the sender's and the recipient's browsers.",
      sections: [
        {
          title: "Separating what you say from how it's delivered",
          paragraphs: [
            "If only the connection is encrypted, the server can still read what it stores. With AlphaSeal, the sender's browser encrypts the message body, so what lands in the server's regular storage is ciphertext.",
            "Delivery details such as sender, recipient, time, and read status aren't encrypted and are stored separately. For a report, a participant can decrypt and submit the message. So AlphaSeal doesn't hide everything about a conversation.",
          ],
        },
        {
          title: "Sealed in one browser, opened in the other",
          paragraphs: [
            "Each new message is encrypted together with its conversation and send order, then verified and decrypted in the recipient's browser. Keys are protected based on the supported environment and recovery setup, with a recovery path for switching devices.",
            "Today this covers supported one-to-one messages. Group conversations, perfect forward secrecy, protection for an already compromised browser, and suitability for sending patient information are out of scope.",
          ],
        },
      ],
      figureCaption: "A one-to-one message is encrypted in the sender's browser, stored on the server as ciphertext, and opened in the recipient's browser. Delivery details and reporting are handled separately.",
    },
    model: {
      name: "Our own medical AI model",
      englishTitle: "Medical-specialized AI Model",
      lead: "Fine-tuned by Viore, built for medicine.",
      sections: [
        {
          title: "Why we build our own model",
          paragraphs: [
            "Many institutions can't send patient data or internal documents to commercial AI in the cloud. They need a model that runs inside the institution, with no external API. That's the first reason. The second is cost: answers have to stay good while using less compute and coming back faster, or institutions can't afford to run them. The third is trust. Clinicians and institutions should be able to see what data the model learned from and how it was evaluated.",
          ],
        },
        {
          title: "How we build it",
          paragraphs: [
            "We start from a proven open base model and train and optimize it on medical knowledge. Instead of building a foundation model from scratch, we focus on getting the performance medical work needs out of a smaller model. We evaluate it against AlphaEvidence, under the same conditions as large commercial models. Because AlphaDoc Engine was never tied to one model, ours takes the place of the open base model running in institutions today. On corporate networks and in separate clouds alike, answers come from models inside the institution's environment. No external models are called. Next, within what each institution allows and with lawful authority, we plan to extend it into institution-specific models.",
          ],
        },
      ],
      figureCaption: "Viore's medical AI model (V1) takes over the slot in AlphaDoc Engine now held by the open base model. A diagram of the development concept.",
    },
    onpremise: {
      name: "Alphadoc on your corporate network, with institution-level security",
      englishTitle: "Corporate Network Deployment & Zero Trust Extension",
      lead: "From AI you use on your own to AI your institution can run and govern.",
      sections: [
        {
          title: "From personal AI to institutional AI",
          paragraphs: [
            [
              "Clinicians already use AI at work through personal accounts. But for an institution to adopt it, features aren't enough. It also needs data protection, access rights, operating rules, and audit records. Viore is building for this in two ways: Alphadoc installed on a corporate network or in a separate cloud, and an institution-level security framework that controls access and sensitive-data handling by institutional policy. Corporate-network Alphadoc is installed at our first institution and runs on an open base model inside the institution's environment. Viore's ",
              { text: "medical AI model", href: MODEL_ANCHOR },
              " will replace it.",
            ],
          ],
        },
        {
          title: "Extending AlphaLayer across the institution",
          paragraphs: [
            [
              "Today, ",
              { text: "AlphaLayer", href: LAYER_ANCHOR },
              " governs external AI execution with registered policies in selected text features. The institution-level security framework extends that control across the whole institution. Every request is authenticated and checked for access rights. Sensitive data is detected and swapped for tokens. Inputs and attachments are validated, and only permitted models are called. Responses are checked for leaks and restoration rights before delivery, and each institution's audit and retention policies apply. As a rule, requests that fail a check are blocked.",
            ],
          ],
        },
      ],
      figureCaption: "On the corporate network, the model that answers isn't connected to the internet, and medical data arrives from Viore in one direction only. The institution-level security framework controls everything from request authentication to audit records, inside the institution. A diagram of the development concept.",
    },
    oneway: {
      name: "One-way AI Architecture",
      englishTitle: "One-way AI Architecture",
      lead: "Evidence flows in. Your data stays put.",
      sections: [
        {
          title: "Decide where the data lives, first",
          paragraphs: [
            "Healthcare providers and healthcare companies point to security and a lack of in-house expertise as the barriers to adopting generative AI. If documents and records have to go to an external AI, the institution has to check and manage that path itself.",
            "Alphadoc keeps the model that answers, and the materials it uses, inside the institution's environment. It's installed on a corporate network or in a separate cloud, and it doesn't use external AI to answer. Personal notes are private by default, and the institution decides how widely they can be shared.",
          ],
        },
        {
          title: "Evidence moves in one direction",
          paragraphs: [
            [
              "New guidelines and literature are organized in ",
              { text: "AlphaEvidence", href: EVIDENCE_ANCHOR },
              " and sent to each institution's environment. Model and security updates take the same route. The institution's documents, questions, and answers don't travel back to Viore.",
            ],
            "This architecture runs on the corporate network at our first institution. It defines where data stays and how it flows. It doesn't establish an institution's legal basis for processing personal data, or its legal suitability.",
          ],
        },
      ],
      figureCaption: "Medical evidence updates flow from Viore to each institution in one direction, and Alphadoc answers with the models and materials inside the institution. Documents and notes stay in the institution's environment.",
    },
  },
} as const;

function TechnologyPostMeta({
  language,
  status,
  verified,
}: {
  language: Language;
  status: TechnologyStatus;
  verified: string;
}) {
  const labels = sharedCopy[language];

  return (
    <dl className="technology-post-meta">
      <div>
        <dt>{labels.status}</dt>
        <dd><span className={`technology-status technology-status-${status}`}>{labels.statuses[status]}</span></dd>
      </div>
      <div>
        <dt>{labels.verified}</dt>
        <dd><time dateTime={verified}>{verified}</time></dd>
      </div>
    </dl>
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

function ProseParagraphContent({ paragraph }: { paragraph: ProseParagraph }) {
  if (typeof paragraph === "string") return paragraph;
  return (
    <>
      {paragraph.map((segment, index) => (
        typeof segment === "string"
          ? <Fragment key={index}>{segment}</Fragment>
          : <a key={index} href={segment.href}>{segment.text}</a>
      ))}
    </>
  );
}

function ProseSections({
  sections,
}: {
  sections: ReadonlyArray<{
    title: string;
    paragraphs: readonly ProseParagraph[];
  }>;
}) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.title}>
          <h3>{section.title}</h3>
          {section.paragraphs.map((paragraph, index) => (
            <p key={index}><ProseParagraphContent paragraph={paragraph} /></p>
          ))}
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

  const posts: ReadonlyArray<{
    id: string;
    index: string;
    status: TechnologyStatus;
    verified: string;
    copy: { name: string; englishTitle: string; lead: string };
    body: ReactNode;
  }> = [
    {
      id: technologyAnchors.alphaevidence,
      index: "01",
      status: "implemented-foundation",
      verified: VERIFIED_DATE,
      copy: articles.evidence,
      body: (
        <>
          <ProseSections sections={articles.evidence.sections} />
          <TechnologyFigure language={language} number="02" kind="evidence" caption={articles.evidence.figureCaption} />
          <section className="technology-data-section">
            <h3>{articles.evidence.snapshotTitle}</h3>
            <AlphaEvidenceSnapshot initialResult={snapshotResult} language={language} />
          </section>
        </>
      ),
    },
    {
      id: "technology-alphadoc-engine",
      index: "02",
      status: "implemented-capability",
      verified: VERIFIED_DATE,
      copy: articles.engine,
      body: (
        <>
          <ProseSections sections={articles.engine.sections} />
          <TechnologyFigure language={language} number="03" kind="engine" caption={articles.engine.figureCaption} />
        </>
      ),
    },
    {
      id: "technology-alphadocument",
      index: "03",
      status: "release-in-review",
      verified: VERIFIED_DATE,
      copy: articles.document,
      body: (
        <>
          <ProseSections sections={articles.document.sections} />
          <TechnologyFigure language={language} number="04" kind="document" caption={articles.document.figureCaption} />
        </>
      ),
    },
    {
      id: "technology-alphaimage",
      index: "04",
      status: "integration-in-review",
      verified: VERIFIED_DATE,
      copy: articles.image,
      body: (
        <>
          <ProseSections sections={articles.image.sections} />
          <TechnologyFigure language={language} number="05" kind="image" caption={articles.image.figureCaption} />
        </>
      ),
    },
    {
      id: technologyAnchors.alphalayer,
      index: "05",
      status: "selected-path-active",
      verified: VERIFIED_DATE,
      copy: articles.layer,
      body: (
        <>
          <ProseSections sections={articles.layer.sections} />
          <TechnologyFigure language={language} number="06" kind="layer" caption={articles.layer.figureCaption} />
        </>
      ),
    },
    {
      id: "technology-alphaseal",
      index: "06",
      status: "supported-path-implemented",
      verified: VERIFIED_DATE,
      copy: articles.seal,
      body: (
        <>
          <ProseSections sections={articles.seal.sections} />
          <TechnologyFigure language={language} number="07" kind="seal" caption={articles.seal.figureCaption} />
        </>
      ),
    },
    {
      id: technologyAnchors["medical-model"],
      index: "07",
      status: "coming-soon",
      verified: SITE_UPDATED_AT,
      copy: articles.model,
      body: (
        <>
          <ProseSections sections={articles.model.sections} />
          <TechnologyFigure language={language} number="08" kind="model" caption={articles.model.figureCaption} />
        </>
      ),
    },
    {
      id: technologyAnchors["onpremise-security"],
      index: "08",
      status: "first-site-installed",
      verified: SITE_UPDATED_AT,
      copy: articles.onpremise,
      body: (
        <>
          <ProseSections sections={articles.onpremise.sections} />
          <TechnologyFigure language={language} number="09" kind="onpremise" caption={articles.onpremise.figureCaption} />
        </>
      ),
    },
    {
      id: technologyAnchors["one-way-architecture"],
      index: "09",
      status: "first-site-applied",
      verified: SITE_UPDATED_AT,
      copy: articles.oneway,
      body: (
        <>
          <ProseSections sections={articles.oneway.sections} />
          <TechnologyFigure language={language} number="10" kind="oneway" caption={articles.oneway.figureCaption} />
        </>
      ),
    },
  ];
  /* Newest first: latest check date, then the later post. */
  const orderedPosts = [...posts].sort((left, right) => (
    right.verified.localeCompare(left.verified) || Number(right.index) - Number(left.index)
  ));

  return (
    <div className="technology-journal" lang={language}>
      <header className="technology-hero" id="technology-overview">
        <div className="technology-hero-meta">
          <span>{page.journal}</span>
          <p><time dateTime="2026-07-21">{page.published}</time><small>{formatUpdated(language)}</small></p>
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
          caption={page.overviewCaption}
        />
      </header>

      <main className="technology-article-stream">
        <ol className="technology-post-list">
          {orderedPosts.map((post) => (
            <li key={post.id}>
              <TechnologyPostCard
                id={post.id}
                status={post.status}
                index={post.index}
                englishTitle={post.copy.englishTitle}
                name={post.copy.name}
                lead={post.copy.lead}
                meta={<TechnologyPostMeta language={language} status={post.status} verified={post.verified} />}
              >
                <div className="technology-prose">{post.body}</div>
              </TechnologyPostCard>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
