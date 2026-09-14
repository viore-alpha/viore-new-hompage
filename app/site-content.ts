export type Language = "ko" | "en";
export type PageKey =
  | "company"
  | "alphadoc-engine"
  | "alphaevidence"
  | "alphadocument"
  | "alphadoc"
  | "knowledge"
  | "clinical-council"
  | "contact";

export type CompanyMetric = {
  kind: "monthly" | "documents" | "guidelines";
  value: number;
  suffix?: string;
  label: string;
  caption: string;
  ariaLabel: string;
};

export type CompanyConnectionsContent = {
  title: string;
  nodes: Array<{ title: string; subtitle?: string }>;
};

export type CompanyEfficiencyContent = {
  title: string;
  context: string;
  repetition: string;
  product: string;
  productLead: string;
  outcome: string;
};

export type DetailPage = {
  kind: "company" | "technology" | "product" | "insight" | "contact";
  eyebrow: string;
  title: string;
  lead: string;
  status?: string;
  statement: string;
  statementLead?: string;
  metricsTitle?: string;
  metrics?: CompanyMetric[];
  efficiency?: CompanyEfficiencyContent;
  connections?: CompanyConnectionsContent;
  items: Array<{ index: string; title: string; body: string }>;
};

export const isLanguage = (value: string): value is Language =>
  value === "ko" || value === "en";

export const pageRoutes: Record<PageKey, string> = {
  company: "company",
  "alphadoc-engine": "technology/alphadoc-engine",
  alphaevidence: "technology/alphaevidence",
  alphadocument: "technology/alphadocument",
  alphadoc: "product/alphadoc",
  knowledge: "knowledge",
  "clinical-council": "council",
  contact: "contact",
};

const inactivePageKeys: ReadonlySet<PageKey> = new Set(["clinical-council"]);

export function routeFor(language: Language, key: PageKey) {
  if (key === "company") return `/${language}`;
  if (key === "contact") return `/${language}#partnership-inquiry`;
  return `/${language}/${pageRoutes[key]}`;
}

export const technologyAnchors = {
  alphaevidence: "technology-alphaevidence",
  "alphadoc-engine": "technology-alphadoc-engine",
  alphadocument: "technology-alphadocument",
  alphaimage: "technology-alphaimage",
  alphalayer: "technology-alphalayer",
} as const;

export type TechnologyAnchorKey = keyof typeof technologyAnchors;

export function technologyRouteFor(language: Language, key?: TechnologyAnchorKey) {
  return `/${language}/technology${key ? `#${technologyAnchors[key]}` : ""}`;
}

export function technologyAnchorFromLegacySlug(slug: string[]): TechnologyAnchorKey | null {
  if (slug.length !== 2 || slug[0] !== "technology") return null;
  const candidate = slug[1] === "alpha-layer" ? "alphalayer" : slug[1];
  return candidate in technologyAnchors ? candidate as TechnologyAnchorKey : null;
}

export function insightPageFromLegacySlug(slug: string[]): "knowledge" | null {
  if (slug.length !== 2 || slug[0] !== "insight") return null;
  if (slug[1] === "knowledge") return "knowledge";
  return null;
}

export function pageKeyFromSlug(slug: string[]): PageKey | null {
  const path = slug.join("/");
  const entry = Object.entries(pageRoutes).find(([, route]) => route === path);
  const pageKey = entry?.[0] as PageKey | undefined;
  if (!pageKey || inactivePageKeys.has(pageKey)) return null;
  return pageKey;
}

export const siteContent = {
  ko: {
    nav: { company: "Company", technology: "Technology", product: "Product", knowledge: "Knowledge", council: "Council", contact: "Contact" },
    home: {
      eyebrow: "VIORE · MEDICAL INTELLIGENCE",
      title: ["New Linearity in Medicine"],
      lead: "We bring incongruity to convergence\nthrough a singular cohesive intelligence",
      overview: "Company Overview",
      technology: {
        eyebrow: "CORE TECHNOLOGY",
        title: "AlphaDoc Engine",
        statement: "Medical Intelligence Orchestration",
        cta: "View Technology",
      },
      knowledge: {
        title: "Knowledge",
        body: "Ever-growing, daily influx of literature",
        cta: "Explore Knowledge",
      },
      council: {
        title: "Council & Partners",
        body: "Collective intelligence, shaped by clinical expertise and trusted partnerships",
        cta: "Meet Council & Partners",
      },
      contact: "Learn more about us",
    },
    footer: {
      company: {
        name: "주식회사 바이오레",
        representative: "대표 고석진",
        registration: "사업자등록번호 709-88-03418",
        address: "경기도 성남시 분당구 대왕판교로 660, 유스페이스1 A동 B1 101-102·104호",
        email: "biz@vioreai.com",
      },
      privacy: "개인정보처리방침",
      terms: "사이트 이용안내",
      copyright: "© 2026 Viore Inc. All rights reserved.",
    },
  },
  en: {
    nav: { company: "Company", technology: "Technology", product: "Product", knowledge: "Knowledge", council: "Council", contact: "Contact" },
    home: {
      eyebrow: "VIORE · MEDICAL INTELLIGENCE",
      title: ["New Linearity in Medicine"],
      lead: "We bring incongruity to convergence\nthrough a singular cohesive intelligence",
      overview: "Company Overview",
      technology: {
        eyebrow: "CORE TECHNOLOGY",
        title: "AlphaDoc Engine",
        statement: "Medical Intelligence Orchestration",
        cta: "View Technology",
      },
      knowledge: {
        title: "Knowledge",
        body: "Ever-growing, daily influx of literature",
        cta: "Explore Knowledge",
      },
      council: {
        title: "Council & Partners",
        body: "Collective intelligence, shaped by clinical expertise and trusted partnerships",
        cta: "Meet Council & Partners",
      },
      contact: "Learn more about us",
    },
    footer: {
      company: {
        name: "Viore Inc.",
        representative: "Representative Seokjin Ko",
        registration: "Business Registration No. 709-88-03418",
        address: "B101-102 and 104, Building A, 660 Daewangpangyo-ro, Bundang-gu, Seongnam, Gyeonggi-do, Korea",
        email: "biz@vioreai.com",
      },
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      copyright: "© 2026 Viore Inc. All rights reserved.",
    },
  },
} as const;

export const detailContent: Record<Language, Record<PageKey, DetailPage>> = {
  ko: {
    company: {
      kind: "company",
      eyebrow: "COMPANY",
      title: "의료계의\n새로운 선형을 그리다.",
      lead: "의료계가 오랜 시간 축적해 온 전문성과 시스템을 연결하기 위한 선\n그것이 바이오레 입니다",
      status: "MEDICAL INTELLIGENCE COMPANY",
      statement: "의료인의 모든 업무를\n하나의 흐름으로",
      statementLead: "혁신은, 더 많이 더하는 일이 아닙니다.\n이미 존재하는 의료의 전문성과 시스템이 더 자연스럽게 이어지도록 만드는 일입니다.\n바이오레는 의료인의 질문과 문서, 지식과 도구가 끊김 없이 이어지는 환경을 Medical OS(Operating System)라고 부릅니다.",
      metricsTitle: "Ever-growing Knowledge",
      metrics: [
        { kind: "documents", value: 212891, label: "Standardized Medical Documents", caption: "누적 정규화 의료 문헌", ariaLabel: "누적 정규화 의료 문헌 212,891건 이상" },
        { kind: "monthly", value: 36047, label: "Medical Documents Added Monthly", caption: "최근 30일 신규 정규화 문헌", ariaLabel: "최근 30일 신규 정규화 의료 문헌 36,047건 이상" },
        { kind: "guidelines", value: 9476, label: "Korean & Global Clinical Guidelines", caption: "누적 공개 국내외 가이드라인·지침 문헌", ariaLabel: "누적 공개 국내외 가이드라인과 지침 문헌 9,476건 이상" },
      ],
      efficiency: {
        title: "Alphadoc\nAI Medical Workspace",
        context: "의료 현장은 수많은 정보와 시스템 사이를 끊임없이 오갑니다.",
        repetition: "기록하고, 계산하고, 검색하고, 확인하는 반복적인 과정은 의료인의 시간을 빼앗습니다.",
        product: "알파닥",
        productLead: "은 이러한 업무를 하나의 자연스러운 흐름으로 연결하여,",
        outcome: "의료인이 가장 중요한 일에 집중할 수 있도록 돕습니다.",
      },
      connections: {
        title: "One connected Flow\nfor Medicine",
        nodes: [
          { title: "더 직관적인 경험", subtitle: "A more intuitive experience" },
          { title: "보안을 고려한 설계", subtitle: "Security-aware design" },
          { title: "다양한 의료 도구", subtitle: "A diverse range of medical tools" },
          { title: "빠른 의료 노트 작성", subtitle: "Fast medical note drafting" },
          { title: "쉽게 보는 최신 의료 근거", subtitle: "Clear, up-to-date medical evidence" },
          { title: "함께 성장하는 지식 커뮤니티", subtitle: "A knowledge community that grows together" },
        ],
      },
      items: [],
    },
    "alphadoc-engine": {
      kind: "technology",
      eyebrow: "TECHNOLOGY · 01",
      title: "AlphaDoc Engine",
      lead: "의료의 질문을 맥락에 맞는 근거와 다음 행동으로 연결하는 바이오레의 핵심 지능입니다.",
      status: "IMPLEMENTED CAPABILITY",
      statement: "Medical Intelligence Orchestration",
      items: [
        { index: "01", title: "Understand context", body: "의료인의 질문을 진료, 문서와 지식 탐색이라는 실제 업무 맥락 안에서 이해합니다." },
        { index: "02", title: "Converge evidence", body: "관련 논문과 최신 지침을 근거 흐름 안에 모아 검토 가능한 형태로 연결합니다." },
        { index: "03", title: "Continue the work", body: "답변에서 멈추지 않고 기록, 서류, 번역과 의료 도구로 다음 작업을 이어갑니다." },
      ],
    },
    alphaevidence: {
      kind: "technology",
      eyebrow: "TECHNOLOGY · 02",
      title: "AlphaEvidence",
      lead: "흩어진 의료 근거를 출처와 맥락, 변화가 살아 있는 검토 가능한 구조로 연결합니다.",
      status: "IMPLEMENTED FOUNDATION",
      statement: "근거가 판단으로 이어지도록.",
      items: [
        { index: "01", title: "Source context", body: "논문과 지침을 단순히 모으지 않고 출처, 시점과 사용 맥락을 함께 보존합니다." },
        { index: "02", title: "Evidence linkage", body: "의료 질문과 판단을 이를 뒷받침하거나 달리 해석할 수 있는 근거에 연결합니다." },
        { index: "03", title: "Living knowledge", body: "새로운 근거가 들어오면 기존 맥락에서 무엇이 달라지는지 계속 검토할 수 있는 기반을 지향합니다." },
      ],
    },
    alphadocument: {
      kind: "technology",
      eyebrow: "TECHNOLOGY · 03",
      title: "AlphaDocument",
      lead: "다양한 디지털 문서를 구조와 출처가 보존된 재사용 가능한 아티팩트로 바꿉니다.",
      status: "IMPLEMENTED · INTEGRATION IN PROGRESS",
      statement: "문서는 한 번 읽히고, 지식은 계속 이어집니다.",
      items: [
        { index: "01", title: "Deterministic artifact", body: "같은 문서와 같은 처리 기준을 같은 Document Artifact로 재현합니다." },
        { index: "02", title: "Provenance intact", body: "정규화된 내용과 구조, 원문 위치와 무결성 정보를 하나의 아티팩트에 함께 보존합니다." },
        { index: "03", title: "Reusable knowledge", body: "AlphaDoc Engine과 AlphaEvidence가 문서 지식을 각자의 목적에 맞게 다시 활용할 수 있게 합니다." },
      ],
    },
    alphadoc: {
      kind: "product",
      eyebrow: "PRODUCT",
      title: "Alphadoc",
      lead: "질문에서 근거로, 근거에서 문서와 지식으로. 알파닥은 의료인의 일을 하나의 흐름으로 연결합니다.",
      status: "AI MEDICAL WORKSPACE",
      statement: "하나의 질문이, 하나의 흐름이 됩니다.",
      items: [
        { index: "01", title: "질문과 임상 맥락", body: "알파닥 엔진과 대화하며 의료 질문을 정리하고 필요한 업무를 시작합니다." },
        { index: "02", title: "논문과 최신 지침", body: "판단에 필요한 문헌을 찾고 근거의 출처와 맥락을 함께 검토합니다." },
        { index: "03", title: "진료노트와 진료서류", body: "대화의 맥락을 이어 받아 기록과 검토 가능한 문서 초안을 만듭니다." },
        { index: "04", title: "번역과 의료 도구", body: "문서 번역, 약물 상호작용과 의료 계산 등 반복 작업을 한곳에서 이어갑니다." },
        { index: "05", title: "AlphaWing", body: "뉴스, 문헌과 전문가의 맥락을 현재 업무 옆에서 계속 확인합니다." },
      ],
    },
    knowledge: {
      kind: "insight",
      eyebrow: "KNOWLEDGE",
      title: "의료 지식과 근거",
      lead: "매일 쏟아지는 문헌과 의료 AI를 만들며 얻은 관찰을 계속 읽고, 검토하고, 기록합니다.",
      status: "EVER-GROWING KNOWLEDGE",
      statement: "Ever-growing, daily influx of literature",
      items: [
        { index: "01", title: "Literature", body: "새로운 논문과 지침을 지속적으로 살피고 의료인의 질문과 연결될 맥락을 찾습니다." },
        { index: "02", title: "Product notes", body: "실제 의료 업무에서 발견한 문제와 제품을 만들며 내린 선택을 기록합니다." },
        { index: "03", title: "Responsible practice", body: "의료 AI를 책임 있게 만들고 운영하기 위한 기준을 축적합니다." },
      ],
    },
    "clinical-council": {
      kind: "insight",
      eyebrow: "COUNCIL & PARTNERS",
      title: "Council & Partners",
      lead: "임상 전문성과 신뢰할 수 있는 파트너십을 연결해 제품의 방향, 사용 맥락과 책임 기준을 함께 검토합니다.",
      status: "COLLECTIVE INTELLIGENCE",
      statement: "Built with medicine, not merely for medicine.",
      items: [
        { index: "01", title: "Clinical relevance", body: "기술이 실제 의료 업무의 필요와 맞닿아 있는지 살핍니다." },
        { index: "02", title: "Professional judgment", body: "의료인의 판단을 존중하면서 제품이 실제로 도움이 되는지 함께 검토합니다." },
        { index: "03", title: "Trusted partnerships", body: "의료, 연구와 기술의 서로 다른 전문성을 연결해 혼자 만들 수 없는 기준을 세웁니다." },
      ],
    },
    contact: {
      kind: "contact",
      eyebrow: "CONTACT",
      title: "새로운 선형에\n합류하세요.",
      lead: "의료의 전문성과 기술을 더 나은 흐름으로 연결할 파트너를 기다립니다.",
      status: "LET'S BUILD TOGETHER",
      statement: "THE LINE CONTINUES WITH YOU.",
      items: [],
    },
  },
  en: {
    company: {
      kind: "company",
      eyebrow: "COMPANY",
      title: "Drawing a\nnew linearity in medicine.",
      lead: "Viore builds a Medical OS that connects the expertise and systems accumulated across medicine into one continuous flow.",
      status: "MEDICAL INTELLIGENCE COMPANY",
      statement: "Viore draws a new linearity in medicine.",
      metricsTitle: "Ever-growing Knowledge",
      metrics: [
        { kind: "documents", value: 212891, label: "Standardized Medical Documents", caption: "Current normalized corpus", ariaLabel: "More than 212,891 normalized medical documents" },
        { kind: "monthly", value: 36047, label: "Medical Documents Added Monthly", caption: "Newly normalized in the last 30 days", ariaLabel: "More than 36,047 medical documents normalized in the last 30 days" },
        { kind: "guidelines", value: 9476, label: "Korean & Global Clinical Guidelines", caption: "Current visible guideline corpus", ariaLabel: "More than 9,476 visible Korean and global clinical guidelines" },
      ],
      efficiency: {
        title: "Alphadoc\nAI Medical Workspace",
        context: "Medical professionals constantly move between countless sources of information and systems.",
        repetition: "Repetitive recording, calculating, searching, and checking takes time away from medical professionals.",
        product: "Alphadoc",
        productLead: " connects these tasks into one natural flow,",
        outcome: "helping medical professionals focus on what matters most.",
      },
      connections: {
        title: "One connected Flow\nfor Medicine",
        nodes: [
          { title: "A more intuitive experience" },
          { title: "Security-aware design" },
          { title: "A diverse range of medical tools" },
          { title: "Fast medical note drafting" },
          { title: "Clear, up-to-date medical evidence" },
          { title: "A knowledge community that grows together" },
        ],
      },
      items: [],
    },
    "alphadoc-engine": {
      kind: "technology", eyebrow: "TECHNOLOGY · 01", title: "AlphaDoc Engine", lead: "Viore's core intelligence connecting medical questions to contextual evidence and next actions.", status: "IMPLEMENTED CAPABILITY", statement: "Medical Intelligence Orchestration",
      items: [
        { index: "01", title: "Understand context", body: "Understands a medical question within the actual context of care, documents, and knowledge work." },
        { index: "02", title: "Converge evidence", body: "Connects relevant literature and current guidelines in a form that can be reviewed." },
        { index: "03", title: "Continue the work", body: "Moves beyond an answer into records, forms, translation, and medical tools." },
      ],
    },
    alphaevidence: {
      kind: "technology", eyebrow: "TECHNOLOGY · 02", title: "AlphaEvidence", lead: "Connects fragmented medical evidence into a reviewable structure with source, context, and change intact.", status: "IMPLEMENTED FOUNDATION", statement: "From evidence to judgment.",
      items: [
        { index: "01", title: "Source context", body: "Preserves provenance, timing, and context instead of treating papers and guidelines as an undifferentiated collection." },
        { index: "02", title: "Evidence linkage", body: "Connects a medical question and judgment to evidence that supports it or offers a different interpretation." },
        { index: "03", title: "Living knowledge", body: "Aims to make it possible to review what changes when new evidence enters an existing context." },
      ],
    },
    alphadocument: {
      kind: "technology", eyebrow: "TECHNOLOGY · 03", title: "AlphaDocument", lead: "Turns digital documents into reusable artifacts with structure and provenance intact.", status: "IMPLEMENTED · INTEGRATION IN PROGRESS", statement: "Documents are read once. Knowledge keeps moving.",
      items: [
        { index: "01", title: "Deterministic artifact", body: "Creates the same Document Artifact from the same document under the same processing identity." },
        { index: "02", title: "Provenance intact", body: "Preserves normalized content, structure, source locations, and integrity in one artifact." },
        { index: "03", title: "Reusable knowledge", body: "Lets AlphaDoc Engine and AlphaEvidence reuse document knowledge for their own purposes." },
      ],
    },
    alphadoc: {
      kind: "product", eyebrow: "PRODUCT", title: "Alphadoc", lead: "From questions to evidence, and from evidence to documents and knowledge. Alphadoc connects medical work in one continuous flow.", status: "AI MEDICAL WORKSPACE", statement: "One question becomes one continuous flow.",
      items: [
        { index: "01", title: "Questions and clinical context", body: "Work with AlphaDoc Engine to clarify a medical question and begin the task in context." },
        { index: "02", title: "Literature and guidelines", body: "Find relevant sources and review the evidence behind a decision." },
        { index: "03", title: "Clinical notes and forms", body: "Carry context into reviewable records and medical document drafts." },
        { index: "04", title: "Translation and tools", body: "Continue with document translation, drug interaction checks, and medical calculations." },
        { index: "05", title: "AlphaWing", body: "Keep news, literature, and professional context beside the work in progress." },
      ],
    },
    knowledge: {
      kind: "insight", eyebrow: "KNOWLEDGE", title: "Knowledge", lead: "We keep reading, reviewing, and recording the daily influx of literature and the lessons from building medical intelligence.", status: "EVER-GROWING KNOWLEDGE", statement: "Ever-growing, daily influx of literature",
      items: [
        { index: "01", title: "Literature", body: "We continually read new papers and guidelines, looking for context that connects to medical questions." },
        { index: "02", title: "Product notes", body: "We record problems found in real medical work and the choices made while building the product." },
        { index: "03", title: "Responsible practice", body: "We accumulate standards for building and operating medical intelligence responsibly." },
      ],
    },
    "clinical-council": {
      kind: "insight", eyebrow: "COUNCIL & PARTNERS", title: "Council & Partners", lead: "Clinical expertise and trusted partnerships come together to review product direction, context of use, and standards of responsibility.", status: "COLLECTIVE INTELLIGENCE", statement: "Built with medicine, not merely for medicine.",
      items: [
        { index: "01", title: "Clinical relevance", body: "Checks whether technology meets a real medical need." },
        { index: "02", title: "Professional judgment", body: "Reviews whether the product is genuinely useful while respecting medical judgment." },
        { index: "03", title: "Trusted partnerships", body: "Connects medical, research, and technical expertise to set standards that cannot be built alone." },
      ],
    },
    contact: {
      kind: "contact", eyebrow: "CONTACT", title: "Join the\nnew linearity.", lead: "We are looking for partners who want to connect medical expertise and technology into a better flow.", status: "LET'S BUILD TOGETHER", statement: "THE LINE CONTINUES WITH YOU.", items: [],
    },
  },
};
