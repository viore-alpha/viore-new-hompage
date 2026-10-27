/* eslint-disable @next/next/no-img-element -- The final CTA logo needs predictable layering for its light effect. */
import { technologyRouteFor, type Language } from "@/app/site-content";
import { AlphadocFeatureRail } from "@/app/components/AlphadocFeatureRail";
import { AlphadocLocalNav } from "@/app/components/AlphadocLocalNav";
import type { AlphadocFeatureItem } from "@/app/components/AlphadocFeatureCard";
import { CompanyEnergyCanvas } from "@/app/components/CompanyEnergyCanvas";
import { ViewportMotion } from "@/app/components/ViewportMotion";
import { AlphadocV2HeroMotion } from "@/app/components/alphadoc2/HeroMotion";
import { AlphadocV2PapersMotion } from "@/app/components/alphadoc2/PapersMotion";
import { AlphadocV2EvidenceMotion } from "@/app/components/alphadoc2/EvidenceMotion";
import { AlphadocV2SecurityMotion } from "@/app/components/alphadoc2/SecurityMotion";

const productCopy = {
  ko: {
    nav: [
      ["overview", "인터페이스"],
      ["general", "근거 대화"],
      ["clinical", "기능"],
      ["alphadocs", "보안"],
    ],
    hero: {
      titleBrand: "알파닥, ",
      titleRest: "의료기관과 의료기업을 위한 AI 에이전트 워크스페이스",
      lead: "근거를 찾는 일도, 노트를 쓰는 일도 알파닥에게 맡기세요.\n최신 의학 문헌과 진료지침, 계속 업데이트되는 사내 자료를 바탕으로 답하고 정리합니다.",
      primary: "알파닥 시작하기",
      visualLabel: "알파닥 홈에서 @로 지침을 지정해 질문하고, 출처가 붙은 문서형 답변을 받는 화면",
    },
    anatomy: {
      title: "모든 것이 하나의 화면 안에",
      body: "필요한 모든 기능이 단 하나의 공간에 펼쳐집니다.\n복잡함은 비우고 시야는 넓혀, 당신이 필요한 순간에 완벽하게 집중할 수 있도록.",
      visualLabel: "논문 목록을 검색해 TRIPOD+AI를 열고, 오른쪽 알파닥 창에서 2015년판과 달라진 보고 항목을 묻고 답을 받는 화면",
    },
    general: {
      title: "놓치지 않는 근거",
      body: "사내 문서도, 나만의 노트도, 그리고 최신 의학 자료도 같은 입력창에서 시작합니다. 참고할 자료의 범위를 고를 수 있고, 자료를 근거로 자연스럽게 질문을 이어갑니다.",
      visualLabel: "참고할 자료 범위를 사내 게시판으로 고르고, 답변 문장의 출처를 미리보기와 출처 목록으로 확인하는 화면",
    },
    clinical: {
      title: "모든 가능성은 한눈에",
      body: "내가 쓴 노트와 사내 게시판, 바이오레가 갱신하는 의료 지침과 논문을 한곳에서 봅니다.\n하나의 공간에서 이 모든 것이 가능해집니다.",
      items: [
        { id: "evidence-chat", label: "근거 대화", title: "참고할 자료를, 질문하기 전에 고릅니다.", body: "입력창의 '자료'에서 전체 자료, 바이오레 자료, 내 자료, 사내 게시판 중 참고할 범위를 고릅니다. 특정 문서나 노트는 @로 바로 지정합니다." },
        { id: "notes", label: "노트", title: "노트를 쓰다가, 정리는 알파닥에게 맡깁니다.", body: "옆 창의 알파닥에게 회의록을 맡기면 결정 사항과 할 일로 나눠 노트 끝에 넣습니다. 노트는 나만 보거나 조직에 공유할 수 있습니다." },
        { id: "board", label: "사내 게시판", title: "조직의 공지와 업무 기준도, 알파닥의 근거가 됩니다.", body: "공지와 업무 자료를 분류별로 올리고, 필독 확인과 댓글로 소통합니다. 게시글을 연 채로 알파닥에게 바로 물을 수 있습니다." },
        { id: "guidelines", label: "의료 지침·공지", title: "의료 지침과 공식 공지를, 한곳에서 확인합니다.", body: "의료 지침은 바이오레가 넣고 갱신합니다. 목록에서 출처와 날짜를 바로 보고, 지침을 열면 알파닥에게 요약을 맡길 수 있습니다." },
        { id: "papers", label: "논문", title: "수많은 논문 사이에서, 지금 필요한 근거를 찾습니다.", body: "바이오레가 모은 국내외 의학 논문을 카드로 훑어봅니다. 읽던 논문에 대해서는 옆 창의 알파닥에게 바로 묻습니다." },
        { id: "favorites", label: "즐겨찾기", title: "다시 볼 답변과 게시글을, 한곳에 모읍니다.", body: "알파닥의 답변과 자주 보는 게시글을 저장해 두고 필요할 때 다시 엽니다. 저장한 답변과 게시글은 따로 나눠 봅니다." },
      ] satisfies AlphadocFeatureItem[],
    },
    security: {
      title: "정보의 모든 순간을,\n더 직관적이고 책임 있게",
      body: "알파닥은 보안을 최우선으로 하여 분리 클라우드와 사내망에서 유연하게 작동합니다.",
      items: [
        ["Lightweight", "의료에 특화되어 더 가볍고 빠르게, 적은 비용으로 효율성을 높여 갑니다."],
        ["One-way", "일방향 학습형 AI 구조로서 기관 데이터를 학습에 쓰지 않고 밖으로 내보내지 않습니다."],
        ["Zero Trust", "입력, 경로, 응답까지 검증 로직을 더한 보안 체계를 구현하고 있습니다."],
      ],
    },
    cta: {
      title: ["바이오레의 첫번째 선형,", "이제 시작해보세요."],
      primary: "알파닥 시작하기",
      secondary: "Technology 살펴보기",
    },
  },
  en: {
    nav: [
      ["overview", "Overview"],
      ["general", "Evidence"],
      ["clinical", "Features"],
      ["alphadocs", "Security"],
    ],
    hero: {
      titleBrand: "Alphadoc,",
      titleRest: "the AI agent workspace for healthcare.",
      lead: "Finding evidence. Writing notes. Hand both to Alphadoc.\nIt works from the latest medical literature and clinical guidelines, plus your internal documents as they change.",
      primary: "Start Alphadoc",
      visualLabel: "On the Alphadoc home screen, a guideline is added with @, the question is sent, and a document-style answer with sources appears",
    },
    anatomy: {
      title: "Everything, on one screen.",
      body: "Your materials on the left. What you're reading in the center. Alphadoc on the right.",
      visualLabel: "The paper list is searched, TRIPOD+AI is opened, and the Alphadoc panel answers what changed from TRIPOD 2015",
    },
    general: {
      title: "Never miss the evidence.",
      body: "Internal documents, your notes, and the latest medical literature all start in the same box. Pick what Alphadoc should draw from, and keep the conversation going, grounded in your sources.",
      visualLabel: "The source scope is set to the internal board, and the sources behind the answer are checked in a preview and a source list",
    },
    clinical: {
      title: "Every possibility, at a glance.",
      body: "Your notes, your internal board, and the guidelines and papers Viore keeps current, all in one place.\nOne workspace makes it all possible.",
      items: [
        { id: "evidence-chat", label: "Evidence chat", title: "Choose your sources first.", body: "Pick all materials, Viore's library, your own files, or the internal board from the Sources menu. Need one specific document? Just type @." },
        { id: "notes", label: "Notes", title: "Write the note. Let Alphadoc organize it.", body: "Drop meeting notes into the side panel, and Alphadoc sorts out decisions and to-dos, then adds them to your note. Keep notes private or share them with your organization." },
        { id: "board", label: "Internal board", title: "Your organization's standards become evidence.", body: "Post notices and documents by category, with read receipts and comments. Open any post and ask Alphadoc about it." },
        { id: "guidelines", label: "Guidelines & notices", title: "Guidelines and official notices. One place.", body: "Viore adds and updates the guidelines for you. See each source and date at a glance, and let Alphadoc summarize any guideline." },
        { id: "papers", label: "Papers", title: "The right paper, out of thousands.", body: "Browse Korean and international research collected by Viore. Reading a paper? Ask Alphadoc about it in the side panel." },
        { id: "favorites", label: "Favorites", title: "Save it now. Find it later.", body: "Keep Alphadoc's answers and the posts you check often, each in its own list." },
      ] satisfies AlphadocFeatureItem[],
    },
    security: {
      title: "Every moment of information,\nhandled with clarity and care.",
      body: "Alphadoc is built security-first, and runs just as well in a separate cloud as on your corporate network.",
      items: [
        ["Lightweight", "Tuned for medicine to run lighter and faster, so efficiency keeps improving while costs stay low."],
        ["One-way", "A one-way learning architecture. Your institution's data isn't used for training, and it doesn't leave."],
        ["Zero Trust", "We're building checks into every input, every path, and every response."],
      ],
    },
    cta: {
      title: ["Viore's first linearity.", "Start here."],
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
      ? "클라우드 & 사내망 안에서 작동하는, 의료기관과 의료기업을 위한 일방향 학습형 AI 에이전트 워크스페이스"
      : "A one-way learning AI agent workspace for healthcare, running in the cloud or on your corporate network.",
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
          <AlphadocV2HeroMotion language={language} label={content.hero.visualLabel} />
        </div>
      </section>

      <AlphadocLocalNav items={content.nav} language={language} />

      <section className="ap-anatomy ap-shell" id="workspace">
        <header className="ap-section-head">
          <div><h2>{content.anatomy.title}</h2></div>
          <p className="ap-anatomy-lead">{content.anatomy.body}</p>
        </header>
        <figure className="ap-anatomy-motion-figure">
          <AlphadocV2PapersMotion language={language} label={content.anatomy.visualLabel} />
        </figure>
      </section>

      <section className="ap-general" id="general" data-ap-section aria-labelledby="ap-general-title">
        <div className="ap-shell">
          <header className="ap-section-head">
            <div><h2 className="ap-general-title" id="ap-general-title">{content.general.title}</h2></div>
            <p>{content.general.body}</p>
          </header>
          <figure className="ap-general-motion-figure">
            <AlphadocV2EvidenceMotion language={language} label={content.general.visualLabel} />
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

      <section className="ap-alphadocs ap-security" id="alphadocs" data-ap-section>
        <div className="ap-alphadocs-visual"><AlphadocV2SecurityMotion language={language} /></div>
        <div className="ap-alphadocs-copy">
          <h2>{content.security.title}</h2>
          <p>{content.security.body}</p>
          <div className="ap-alphadocs-list">
            {content.security.items.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}
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
