import { CompanyConnections } from "@/app/components/CompanyConnections";
import { CompanyEnergyCanvas } from "@/app/components/CompanyEnergyCanvas";
import { CompanyMetrics } from "@/app/components/CompanyMetrics";
import { CompanyNetworkBackdrop } from "@/app/components/CompanyNetworkBackdrop";
import { CompanyQuestionLoop } from "@/app/components/CompanyQuestionLoop";
import { getCompanyMetrics } from "@/app/company-metrics";
import { detailContent, routeFor, type Language } from "@/app/site-content";

export async function CompanyPage({ language }: { language: Language }) {
  const page = detailContent[language].company;
  const companyMetrics = page.metrics
    ? await getCompanyMetrics(language, page.metrics)
    : null;

  return (
    <article className="detail-page detail-page-company detail-company">
      <section className="company-hero">
        <CompanyEnergyCanvas quality="balanced" activationThreshold={0.5} />
        <div className="company-hero-copy">
          <h1>{page.title}</h1>
          <p>{page.lead}</p>
        </div>
        <a
          className="company-scroll-cue"
          href="#company-story"
          aria-label={language === "ko" ? "회사 소개 보기" : "View our story"}
        >
          <i aria-hidden="true" />
        </a>
      </section>

      <div className="company-dark-chapter">
        <CompanyNetworkBackdrop />
        <section className="detail-body" id="company-story">
          <h2>{page.statement}</h2>
          {page.statementLead && <p className="detail-statement-lead">{page.statementLead}</p>}
          {page.efficiency && (
            <section className="company-efficiency" aria-labelledby="company-efficiency-title">
              <div className="company-efficiency-heading">
                <h2 id="company-efficiency-title" aria-label={page.efficiency.title.replace("\n", " ")}>
                  {page.efficiency.title.split("\n").map((line, index) => (
                    <span className={index === 0 ? "company-efficiency-title-brand" : "company-efficiency-title-workspace"} key={line}>
                      {line}
                    </span>
                  ))}
                </h2>
                <CompanyQuestionLoop language={language} />
              </div>
              <p>
                <span>{page.efficiency.context}</span>
                <span>{page.efficiency.repetition}</span>
                <span>
                  <strong className="company-efficiency-product">{page.efficiency.product}</strong>
                  {page.efficiency.productLead}
                </span>
                <span>{page.efficiency.outcome}</span>
              </p>
            </section>
          )}
          {page.metrics && (
            <section className="company-knowledge" aria-labelledby="company-knowledge-title">
              <h2 id="company-knowledge-title">{page.metricsTitle}</h2>
              <CompanyMetrics
                metrics={companyMetrics?.metrics ?? page.metrics}
                language={language}
                source={companyMetrics?.source}
                generatedAt={companyMetrics?.generatedAt}
              />
            </section>
          )}
          {page.connections && <CompanyConnections content={page.connections} />}
        </section>

        <section className="detail-next company-join" id="company-join">
          <h2>{language === "ko" ? "우리가 그리는 새로운 선형에\n합류하세요." : "Join the new line\nwe are drawing."}</h2>
          <div className="company-join-links">
            <a className="company-join-product" href={routeFor(language, "alphadoc")}>
              <span>
                {language === "ko" ? "그 첫 번째 선형, " : "The first line, "}
                <span className="company-join-product-name">{language === "ko" ? "알파닥 Alphadoc" : "Alphadoc"}</span>
              </span>
              <i aria-hidden="true">↗</i>
            </a>
            <a id="partnership-inquiry" className="company-join-contact" href="mailto:biz@vioreai.com">
              <small>{language === "ko" ? "파트너십 문의" : "Partnership inquiries"}</small>
              <span>biz@vioreai.com <i aria-hidden="true">↗</i></span>
            </a>
          </div>
        </section>
      </div>
    </article>
  );
}
