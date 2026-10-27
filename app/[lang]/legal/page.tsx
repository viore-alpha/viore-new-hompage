import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { buildPageMetadata } from "@/app/seo";
import { isLanguage } from "@/app/site-content";
import { withAlphadocName } from "@/app/components/BrandName";

type RouteParams = Promise<{ lang: string }>;
type Detail = { label: string; value: ReactNode };

const legalCopy = {
  ko: {
    metadataTitle: "법무고지 — Viore",
    metadataDescription: "주식회사 바이오레의 개인정보처리방침과 사이트 이용안내입니다.",
    pageTitle: "법무고지",
    privacyLabel: "개인정보처리방침",
    termsLabel: "사이트 이용안내",
    privacy: {
      eyebrow: "PRIVACY",
      title: "개인정보처리방침",
      effective: "시행일 2026년 7월 14일",
      summary: "주식회사 바이오레는 홈페이지 운영에 필요한 최소한의 개인정보만 처리합니다.",
    },
    inquiryDetails: [
      { label: "목적", value: "문의 확인 및 회신" },
      { label: "항목", value: "이름, 이메일 주소, 문의 내용과 이용자가 직접 첨부한 정보" },
      { label: "처리 근거", value: "개인정보 보호법 제15조 제1항 제4호" },
      { label: "보유 기간", value: "문의 접수일로부터 1년" },
    ],
    googleDetails: [
      { label: "이전받는 자", value: "Google LLC · Google Workspace" },
      { label: "이전 근거", value: "개인정보 보호법 제28조의8 제1항 제3호" },
      { label: "이전 항목", value: "이름, 이메일 주소, 문의 내용과 첨부파일" },
      { label: "이전 목적", value: "업무용 이메일 송수신 및 보관" },
      { label: "이전 국가", value: "미국 등 Google의 데이터 처리 시설이 위치한 국가" },
      { label: "시점·방법", value: "이메일 송수신 시 암호화된 네트워크로 전송" },
      { label: "보유 기간", value: "문의 접수일로부터 1년 또는 위탁계약 종료 시까지" },
    ],
    sections: {
      processing: "처리하는 개인정보",
      transfer: "처리 위탁 및 국외 이전",
      thirdParty: "제3자 제공 및 자동 수집",
      deletion: "개인정보의 파기",
      rights: "이용자의 권리와 문의",
      safeguards: "보호조치 및 변경",
    },
    terms: {
      eyebrow: "SITE NOTICE",
      title: "사이트 이용안내",
    },
  },
  en: {
    metadataTitle: "Legal Notice — Viore",
    metadataDescription: "Viore Inc. Privacy Policy and Terms of Use.",
    pageTitle: "Legal Notice",
    privacyLabel: "Privacy Policy",
    termsLabel: "Terms of Use",
    privacy: {
      eyebrow: "PRIVACY",
      title: "Privacy Policy",
      effective: "Effective July 14, 2026",
      summary: "Viore Inc. processes only the minimum personal information necessary to operate this website.",
    },
    inquiryDetails: [
      { label: "Purpose", value: "Reviewing and responding to inquiries" },
      { label: "Information", value: "Name, email address, inquiry content, and information directly attached by the user" },
      { label: "Legal basis", value: "Article 15(1)(4) of the Personal Information Protection Act" },
      { label: "Retention", value: "One year from the date the inquiry is received" },
    ],
    googleDetails: [
      { label: "Recipient", value: "Google LLC · Google Workspace" },
      { label: "Legal basis", value: "Article 28-8(1)(3) of the Personal Information Protection Act" },
      { label: "Information", value: "Name, email address, inquiry content, and attachments" },
      { label: "Purpose", value: "Business email transmission, receipt, and storage" },
      { label: "Countries", value: "The United States and other countries where Google data-processing facilities are located" },
      { label: "Timing · method", value: "Transferred over an encrypted network when email is sent or received" },
      { label: "Retention", value: "One year from receipt of the inquiry or until termination of the processing agreement" },
    ],
    sections: {
      processing: "Personal information we process",
      transfer: "Processing entrustment and overseas transfer",
      thirdParty: "Third-party provision and automatic collection",
      deletion: "Destruction of personal information",
      rights: "Your rights and inquiries",
      safeguards: "Safeguards and changes",
    },
    terms: {
      eyebrow: "SITE NOTICE",
      title: "Terms of Use",
    },
  },
} as const;

function LegalSection({ children, number, title }: { children: ReactNode; number: string; title: string }) {
  return (
    <section className="legal-section">
      <h3>{number}. {title}</h3>
      <div className="legal-section-body">{children}</div>
    </section>
  );
}

function DetailCard({ details, google }: { details: readonly Detail[]; google?: boolean }) {
  return (
    <dl className="legal-detail-card">
      {details.map((detail, index) => (
        <div className="legal-detail-row" key={detail.label}>
          <dt>{detail.label}</dt>
          <dd>
            {google && index === 0 ? (
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">{detail.value}</a>
            ) : detail.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function KoreanLegalDocument() {
  const copy = legalCopy.ko;
  return (
    <>
      <article id="privacy" className="legal-article" lang="ko">
        <div className="legal-article-head">
          <p className="legal-eyebrow">{copy.privacy.eyebrow}</p>
          <h2>{copy.privacy.title}</h2>
          <p className="legal-effective">{copy.privacy.effective}</p>
          <p className="legal-summary">{copy.privacy.summary}</p>
        </div>
        <LegalSection number="1" title={copy.sections.processing}>
          <DetailCard details={copy.inquiryDetails} />
        </LegalSection>
        <LegalSection number="2" title={copy.sections.transfer}>
          <p>이메일 문의 처리를 위해 다음과 같이 개인정보의 보관을 위탁합니다.</p>
          <DetailCard details={copy.googleDetails} google />
          <p>국외 이전을 원하지 않으면 이메일 문의를 보내지 않을 수 있으며, 이 경우 문의에 대한 회신이 제한됩니다.</p>
        </LegalSection>
        <LegalSection number="3" title={copy.sections.thirdParty}>
          <p>바이오레는 개인정보를 제3자에게 제공하지 않습니다. 법령에 특별한 규정이 있는 경우는 예외로 합니다.</p>
          <p>홈페이지는 광고성 쿠키, 방문자 분석 도구 또는 맞춤형 광고를 사용하지 않습니다.</p>
        </LegalSection>
        <LegalSection number="4" title={copy.sections.deletion}>
          <p>보유 기간이 끝나거나 처리 목적을 달성한 개인정보는 지체 없이 파기합니다. 전자 파일은 복구할 수 없는 방법으로 삭제하며, 법령상 보존 의무가 있는 정보는 해당 기간 동안 분리해 보관합니다.</p>
        </LegalSection>
        <LegalSection number="5" title={copy.sections.rights}>
          <p>이용자는 개인정보의 열람, 정정·삭제 또는 처리정지를 요청할 수 있습니다.</p>
          <p>담당: 개인정보 보호 담당<br />이메일: <a href="mailto:cs@vioreai.com">cs@vioreai.com</a></p>
        </LegalSection>
        <LegalSection number="6" title={copy.sections.safeguards}>
          <p>바이오레는 개인정보 취급자를 최소화하고 접근 권한 관리, 전송구간 암호화와 계정 보호 조치를 적용합니다.</p>
          <p>이 방침은 2026년 7월 14일부터 적용하며, 변경 시 홈페이지에 공개합니다.</p>
        </LegalSection>
      </article>
      <article id="terms" className="legal-article" lang="ko">
        <div className="legal-article-head">
          <p className="legal-eyebrow">{copy.terms.eyebrow}</p>
          <h2>{copy.terms.title}</h2>
        </div>
        <div className="legal-notice-copy">
          <p>이 홈페이지는 바이오레와 제품에 관한 일반적인 정보를 제공하며, 내용은 필요한 경우 변경될 수 있습니다.</p>
          <p>문구, 이미지, 로고와 디자인의 권리는 바이오레 또는 정당한 권리자에게 있으며, 사전 동의 없는 상업적 이용을 금합니다.</p>
          <p>{withAlphadocName("알파닥 서비스에는 알파닥에서 공개하는 별도 약관과 정책이 적용됩니다.")}</p>
          <p>문의는 <a href="mailto:cs@vioreai.com">cs@vioreai.com</a>으로 보내주세요.</p>
        </div>
      </article>
    </>
  );
}

function EnglishLegalDocument() {
  const copy = legalCopy.en;
  return (
    <>
      <article id="privacy" className="legal-article" lang="en">
        <div className="legal-article-head">
          <p className="legal-eyebrow">{copy.privacy.eyebrow}</p>
          <h2>{copy.privacy.title}</h2>
          <p className="legal-effective">{copy.privacy.effective}</p>
          <p className="legal-summary">{copy.privacy.summary}</p>
        </div>
        <LegalSection number="1" title={copy.sections.processing}>
          <DetailCard details={copy.inquiryDetails} />
        </LegalSection>
        <LegalSection number="2" title={copy.sections.transfer}>
          <p>We entrust the storage of personal information as follows to process email inquiries.</p>
          <DetailCard details={copy.googleDetails} google />
          <p>If you do not want your information transferred overseas, you may choose not to send an email inquiry; in that case, our ability to respond may be limited.</p>
        </LegalSection>
        <LegalSection number="3" title={copy.sections.thirdParty}>
          <p>Viore does not provide personal information to third parties, except where specifically required by law.</p>
          <p>This website does not use advertising cookies, visitor analytics tools, or personalized advertising.</p>
        </LegalSection>
        <LegalSection number="4" title={copy.sections.deletion}>
          <p>Personal information is destroyed without delay when its retention period expires or its processing purpose is fulfilled. Electronic files are deleted using methods that prevent recovery, while information subject to statutory retention is stored separately for the required period.</p>
        </LegalSection>
        <LegalSection number="5" title={copy.sections.rights}>
          <p>You may request access, correction, deletion, or suspension of processing of your personal information.</p>
          <p>Contact: Privacy Officer<br />Email: <a href="mailto:cs@vioreai.com">cs@vioreai.com</a></p>
        </LegalSection>
        <LegalSection number="6" title={copy.sections.safeguards}>
          <p>Viore limits the personnel who handle personal information and applies access controls, encryption in transit, and account-protection measures.</p>
          <p>This policy takes effect on July 14, 2026. Any changes will be published on this website.</p>
        </LegalSection>
      </article>
      <article id="terms" className="legal-article" lang="en">
        <div className="legal-article-head">
          <p className="legal-eyebrow">{copy.terms.eyebrow}</p>
          <h2>{copy.terms.title}</h2>
        </div>
        <div className="legal-notice-copy">
          <p>This website provides general information about Viore and its products. The content may be changed when necessary.</p>
          <p>Text, images, logos, and designs are owned by Viore or their respective rights holders. Commercial use without prior consent is prohibited.</p>
          <p>{withAlphadocName("Separate terms and policies published by Alphadoc apply to the Alphadoc service.")}</p>
          <p>For inquiries, contact <a href="mailto:cs@vioreai.com">cs@vioreai.com</a>.</p>
        </div>
      </article>
    </>
  );
}

export async function generateMetadata({ params }: { params: RouteParams }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};
  const copy = legalCopy[lang];
  return buildPageMetadata({
    lang,
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    path: "/legal",
  });
}

export default async function LegalPage({ params }: { params: RouteParams }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const copy = legalCopy[lang];

  return (
    <div className="legal-page">
      <div className="legal-shell">
        <div className="legal-intro">
          <h1>{copy.pageTitle}</h1>
          <nav className="legal-nav" aria-label={copy.pageTitle}>
            <a href="#privacy">{copy.privacyLabel}</a>
            <a href="#terms">{copy.termsLabel}</a>
          </nav>
        </div>
        <div className="legal-content">
          {lang === "ko" ? <KoreanLegalDocument /> : <EnglishLegalDocument />}
        </div>
      </div>
    </div>
  );
}
