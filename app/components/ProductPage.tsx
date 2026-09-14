/* eslint-disable @next/next/no-img-element -- Real product captures need predictable layering for crossfades and motion. */
import { technologyRouteFor, type Language } from "@/app/site-content";
import { AlphadocHeroMotion } from "@/app/components/AlphadocHeroMotion";
import { AlphadocGeneralChatMotion } from "@/app/components/AlphadocGeneralChatMotion";
import { AlphadocWorkspaceMotion } from "@/app/components/AlphadocWorkspaceMotion";
import { AlphadocsPhoneDemo } from "@/app/components/AlphadocsPhoneDemo";
import { AlphadocFeatureRail } from "@/app/components/AlphadocFeatureRail";
import { AlphadocLocalNav } from "@/app/components/AlphadocLocalNav";
import type { AlphadocFeatureItem } from "@/app/components/AlphadocFeatureCard";
import { CompanyEnergyCanvas } from "@/app/components/CompanyEnergyCanvas";
import { ViewportMotion } from "@/app/components/ViewportMotion";

const productCopy = {
  ko: {
    nav: [
      ["overview", "인터페이스"],
      ["general", "일반대화"],
      ["clinical", "앱"],
      ["alphadocs", "알파닥스"],
    ],
    hero: {
      titleBrand: "알파닥,",
      titleRest: "의료 업무를 하나의 AI Workspace로",
      lead: "임상 질문부터 근거 확인, 문서 작성과 번역까지.\n의료인의 업무를 앱의 형태로 이어주는 공간.",
      primary: "알파닥 시작하기",
      visualLabel: "복합 산-염기 질문이 입력되고 전송된 뒤 알파닥 엔진의 근거 기반 답변으로 전환되는 애니메이션",
    },
    anatomy: {
      title: "모든 것이 하나의 화면 안에",
      body: "필요한 모든 기능이 단 하나의 공간에 펼쳐집니다.\n복잡함은 비우고 시야는 넓혀, 당신이 필요한 순간에 완벽하게 집중할 수 있도록.",
      figures: [
        ["Widgetbar", "오늘의 맥락", "날씨, 일정, 최근 업무의 흐름", "03-widget-context.jpg", "알파닥 Widgetbar에 표시된 날씨와 월간 달력", 256, 347],
        ["Workspace", "지금 하는 일", "질문, 도구, 기록과 문서", "01-workspace-apps.jpg", "알파닥 Workspace의 앱 화면", 648, 648],
        ["Alphawing", "새 문헌과 소식", "뉴스, 문헌, 의료인 연결", "13-alphawing-literature.jpg", "국가와 분야, 최신순과 인용순을 고르는 알파닥 Alphawing 문헌 탭", 320, 648],
      ],
    },
    general: {
      title: "임상 밖의 질문도 함께",
      body: "임상 질문은 임상 모드에서, 일상의 궁금증은 일반 모드에서. 작은 전환만으로 대화 목적을 구분하고, 같은 입력창에서 자연스럽게 질문을 이어갑니다.",
    },
    clinical: {
      title: "모든 가능성은 앱 하나로",
      body: "필요한 순간 앱을 바로 실행하세요.\n더 높은 자율성, 손쉬운 연동, 그리고 계속해서 추가되는 앱까지.\n하나의 공간에서 이 모든 것이 가능해집니다.",
      items: [
        { id: "papers", label: "논문 검색", icon: "/brand/feature-icons/panel/paper/logo.svg", title: "수많은 논문 사이에서, 지금 필요한 근거를 찾습니다.", body: "국내외 의학 논문을 한곳에서 탐색하고 제목과 출처, 발행일, 원문을 함께 확인합니다. 질문에서 근거 검토까지 흩어졌던 검색 단계를 하나로 줄였습니다." },
        { id: "notices", label: "의료 공지", icon: "/brand/feature-icons/functions/medical-notices/logo.png", title: "의료 현장의 변화를 놓치지 않도록, 흩어진 공지를 한곳에 모읍니다.", body: "기관별 의료 공지를 출처와 함께 정리합니다. 목록에서 상세 내용과 원문까지 바로 이어져 중요한 변화를 더 빠르게 파악할 수 있습니다." },
        { id: "forms", label: "진료서류", icon: "/brand/feature-icons/functions/guide/logo.svg", title: "반복되는 서류 업무를, 하나의 완성된 흐름으로 바꿉니다.", body: "진단서와 확인서를 유형별로 찾고 문서에 필요한 항목을 같은 작업 공간에서 채웁니다. 반복되는 문서 업무가 진료의 흐름을 끊지 않도록 설계했습니다." },
        { id: "translation", label: "문서 번역", icon: "/brand/feature-icons/functions/document-translation/logo.svg", title: "언어가 달라도, 의료 문서의 흐름은 끊기지 않습니다.", body: "파일을 올리면 전체 번역과 요약 번역 중 목적에 맞는 방식을 고를 수 있습니다. 목표 언어까지 한 화면에서 설정해, 문서를 읽고 활용하는 다음 단계로 곧바로 이어갑니다." },
        { id: "tools", label: "의료 도구", icon: "/brand/feature-icons/functions/medical-tools/logo.svg", note: "외 다수의 앱들", title: "판단이 필요한 순간, 필요한 의료 도구를 바로 엽니다.", body: "eGFR, CHA₂DS₂-VASc, HAS-BLED, CURB-65 등 자주 쓰는 임상 계산 도구를 분야별로 모았습니다. 검색과 이동을 줄여 필요한 계산을 현재 업무 안에서 곧바로 이어갑니다." },
      ] satisfies AlphadocFeatureItem[],
    },
    alphadocs: {
      title: "소통의 모든 순간을,\n더 직관적이고 책임 있게",
      body: "알파닥스는 알파닥 계정으로 참여하는 커뮤니티입니다. 모바일 중심의 흐름과 참여 범위를 고려한 설계로 의료인의 지식과 경험이 자연스럽게 이어지도록 돕습니다.",
      items: [
        ["Intuitive UI", "모바일 환경에 맞춘 인터페이스로 익숙한 앱처럼 자연스럽게 대화와 콘텐츠를 살펴볼 수 있습니다."],
        ["Account-based access", "알파닥 계정을 바탕으로 참여하며, 구체적인 참여 조건과 공개 범위는 알파닥의 현재 정책과 제공 기능에 따릅니다."],
        ["Protection-aware design", "접근 권한과 공개 범위를 구분하는 원칙을 제품 설계에 반영합니다. 실제 데이터 처리와 보호 범위에는 알파닥의 최신 약관과 개인정보처리방침이 적용됩니다."],
      ],
    },
    cta: {
      title: ["바이오레의 첫번째 선형,", "이제 시작해보세요."],
      primary: "알파닥 시작하기",
      secondary: "Technology 살펴보기",
    },
  },
  en: {
    nav: [["overview", "Overview"], ["general", "General chat"], ["clinical", "Apps"], ["alphadocs", "Alphadocs"]],
    hero: {
      titleBrand: "Alphadoc,",
      titleRest: "From Workstation to AI Workspace",
      lead: "From clinical questions and evidence review to document creation and translation. A space that connects medical work through apps.",
      primary: "Start Alphadoc",
      visualLabel: "A complex acid-base question is typed and submitted before Alphadoc Engine opens an evidence-backed chat answer",
    },
    anatomy: {
      title: "Three roles in one screen",
      body: "Today's context stays on the left, active work sits in the center, and incoming knowledge flows on the right.",
      figures: [
        ["Widgetbar", "Today's context", "Weather, schedule, and recent work", "03-widget-context.jpg", "Weather and monthly calendar in the Alphadoc Widgetbar", 256, 347],
        ["Workspace", "Work in progress", "Questions, clinical tools, records, and documents", "01-workspace-apps.jpg", "The Alphadoc Workspace app launcher", 648, 648],
        ["Alphawing", "Incoming knowledge", "News, literature, and professional connections", "13-alphawing-literature.jpg", "The literature tab in Alphawing", 320, 648],
      ],
    },
    general: {
      title: "A clinician’s day includes\nmore than clinical questions.",
      body: "Use Clinical mode for clinical questions and General mode for everyday questions. A small switch separates the conversation context while keeping the same familiar composer.",
    },
    clinical: {
      title: "Every possibility, one app.",
      body: "Open the app you need, when you need it.\nMore autonomy, seamless connections, and a growing set of apps.\nEverything comes together in one workspace.",
      items: [
        { id: "papers", label: "Literature search", icon: "/brand/feature-icons/panel/paper/logo.svg", title: "Find the evidence you need among thousands of papers.", body: "Search medical literature from Korea and abroad, then review titles, sources, publication dates, and original articles together. The path from question to evidence review becomes one focused flow." },
        { id: "notices", label: "Medical notices", icon: "/brand/feature-icons/functions/medical-notices/logo.png", title: "Bring scattered medical updates into one clear view.", body: "Review notices by institution with their sources attached. Move directly from the list to details and the original notice, so important changes are easier to identify." },
        { id: "forms", label: "Medical forms", icon: "/brand/feature-icons/functions/guide/logo.svg", title: "Turn repetitive paperwork into one complete flow.", body: "Find certificates and confirmations by type, then complete the required fields in the same workspace. Document work stays connected to the clinical task around it." },
        { id: "translation", label: "Document translation", icon: "/brand/feature-icons/functions/document-translation/logo.svg", title: "Language changes. The flow of the medical document does not.", body: "Upload a file and choose full or summary translation for the task at hand. Set the target language in the same view and continue directly into reading and using the document." },
        { id: "tools", label: "Medical tools", icon: "/brand/feature-icons/functions/medical-tools/logo.svg", note: "and many more apps", title: "Open the right medical tool at the moment of judgment.", body: "Access frequently used clinical calculators including eGFR, CHA2DS2-VASc, HAS-BLED, and CURB-65 by category. Reduce searching and switching, and keep each calculation within the task at hand." },
      ] satisfies AlphadocFeatureItem[],
    },
    alphadocs: {
      title: "Every moment of connection,\nmore intuitive and considered",
      body: "Alphadocs is a community for Alphadoc account holders, designed around mobile participation and clearly defined sharing boundaries.",
      items: [
        ["Intuitive UI", "A mobile-first interface makes conversations and shared content easy to follow in a familiar flow."],
        ["Account-based access", "Participation is connected to an Alphadoc account. Current eligibility and visibility follow the product's active features and policies."],
        ["Protection-aware design", "Access and sharing boundaries are part of the product design. Alphadoc's current terms and privacy policy define the applicable data-handling and protection scope."],
      ],
    },
    cta: {
      title: ["Viore's first linearity,", "starts here."],
      primary: "Start Alphadoc",
      secondary: "Explore Technology",
    },
  },
} as const;

export function ProductPage({ language }: { language: Language }) {
  const content = productCopy[language];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://alphadoc.ai/#software",
    name: "Alphadoc",
    alternateName: "알파닥",
    applicationCategory: "MedicalApplication",
    operatingSystem: "Web",
    url: "https://alphadoc.ai",
    description: language === "ko"
      ? "임상·일반 대화와 근거 탐색, 임상 도구, 진료노트와 문서를 한곳에서 이어주는 AI Medical Workspace"
      : "An AI Medical Workspace connecting clinical and general conversations, evidence, clinical tools, notes, and documents in one place",
    inLanguage: language === "ko" ? "ko-KR" : "en-US",
    author: { "@id": "https://vioreai.com/#organization" },
  };

  return (
    <article className={`alphadoc-product lang-${language}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }}
      />

      <section className="ap-hero" id="overview" data-ap-section>
        <div className="ap-hero-copy">
          <h1>
            <span className="ap-hero-brand">{content.hero.titleBrand}</span>
            <span className="ap-hero-tagline">{content.hero.titleRest}</span>
          </h1>
          <p className="ap-hero-lead">{content.hero.lead}</p>
          <div className="ap-hero-actions">
            <a className="ap-button ap-button-primary" href="https://alphadoc.ai" target="_blank" rel="noreferrer">{content.hero.primary}<span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div className="ap-hero-visual">
          <AlphadocHeroMotion language={language} label={content.hero.visualLabel} />
        </div>
      </section>

      <AlphadocLocalNav items={content.nav} language={language} />

      <section className="ap-anatomy ap-shell" id="workspace">
        <header className="ap-section-head">
          <div><h2>{content.anatomy.title}</h2></div>
          <p className="ap-anatomy-lead">{content.anatomy.body}</p>
        </header>
        <figure className="ap-anatomy-motion-figure">
          <AlphadocWorkspaceMotion
            language={language}
            label={language === "ko"
              ? "달력 색상 마킹, 임상 질문과 답변, Alphawing 탭 전환이 순서대로 이어지는 알파닥 화면"
              : "The Alphadoc workspace moving from calendar marking to a clinical answer and Alphawing tabs"}
          />
        </figure>
      </section>

      <section className="ap-general" id="general" data-ap-section aria-labelledby="ap-general-title">
        <div className="ap-shell">
          <header className="ap-section-head">
            <div><h2 className="ap-general-title" id="ap-general-title">{content.general.title}</h2></div>
            <p>{content.general.body}</p>
          </header>
          <figure className="ap-general-motion-figure">
            <AlphadocGeneralChatMotion language={language} />
          </figure>
        </div>
      </section>

      <section className="ap-showcase ap-shell" id="clinical" data-ap-section>
        <header className="ap-section-head">
          <div><h2>{content.clinical.title}</h2></div>
          <p className="ap-clinical-lead">{content.clinical.body}</p>
        </header>
        <AlphadocFeatureRail id="clinical-gallery" items={content.clinical.items} ariaLabel={content.clinical.title} language={language} />
      </section>

      <section className="ap-alphadocs" id="alphadocs" data-ap-section>
        <div className="ap-alphadocs-visual"><AlphadocsPhoneDemo language={language} /></div>
        <div className="ap-alphadocs-copy">
          <h2>{content.alphadocs.title}</h2>
          <p>{content.alphadocs.body}</p>
          <div className="ap-alphadocs-list">
            {content.alphadocs.items.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}
          </div>
        </div>
      </section>

      <ViewportMotion as="section" className="ap-final-cta" threshold={0.12}>
        <CompanyEnergyCanvas quality="balanced" />
        <div className="ap-final-screen" aria-hidden="true">
          <div className="ap-final-logo-stage">
            <img className="ap-final-logo" src="/brand/alphadoc-alpha.png" alt="" width="419" height="365" loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="ap-final-copy">
          <h2>{content.cta.title.map((line) => <span key={line}>{line}</span>)}</h2>
          <div className="ap-hero-actions">
            <a className="ap-button ap-button-primary" href="https://alphadoc.ai" target="_blank" rel="noreferrer">{content.cta.primary}<span aria-hidden="true">↗</span></a>
            <a className="ap-text-link" href={technologyRouteFor(language)}>{content.cta.secondary}<span aria-hidden="true">→</span></a>
          </div>
        </div>
      </ViewportMotion>
    </article>
  );
}
