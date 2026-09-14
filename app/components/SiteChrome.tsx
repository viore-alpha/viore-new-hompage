"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { routeFor, siteContent, technologyRouteFor, type Language, type PageKey } from "@/app/site-content";

type MenuId = "product";
type MenuItem = { label: string; key?: PageKey; href?: string; badge?: string; disabled?: boolean };

export function SiteChrome({ language, children }: { language: Language; children: ReactNode }) {
  const pathname = usePathname();
  const isTechnologyPage = pathname.includes("/technology");
  const isProductPage = pathname.includes("/product/alphadoc");
  const isDarkPage = isTechnologyPage || isProductPage;
  const isCompanyPage = pathname === `/${language}` || pathname === `/${language}/`;
  const isDarkFooter = isCompanyPage || isTechnologyPage;
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const content = siteContent[language];
  const otherLanguage: Language = language === "ko" ? "en" : "ko";
  const otherPath = pathname.replace(/^\/(ko|en)(?=\/|$)/, `/${otherLanguage}`);

  const menus: Record<MenuId, MenuItem[]> = {
    product: [{ label: "Alphadoc", key: "alphadoc" }],
  };

  const navLabel = (id: MenuId) => content.nav[id];

  return (
    <div className="site-frame">
      <header className={`site-header ${isDarkPage ? "site-header-dark" : ""}`}>
        <a className="skip-link" href="#page-content">Skip to content</a>
        <div className="nav-shell">
          <a className="brand" href={`/${language}`} aria-label="Viore home">
            <img src="/brand/viore-logotype.png" alt="Viore" />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation" onMouseLeave={() => setOpenMenu(null)}>
            <a className={`nav-link ${isCompanyPage ? "is-active" : ""}`} href={routeFor(language, "company")}>{content.nav.company}</a>
            <a className={`nav-link ${isTechnologyPage ? "is-active" : ""}`} href={technologyRouteFor(language)}>{content.nav.technology}</a>
            {(["product"] as MenuId[]).map((menu) => (
              <div className="nav-item" key={menu} onMouseEnter={() => setOpenMenu(menu)}>
                <button
                  className={`nav-link nav-button ${pathname.includes(`/${menu}`) ? "is-active" : ""}`}
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openMenu === menu}
                  onClick={() => setOpenMenu(openMenu === menu ? null : menu)}
                  onFocus={() => setOpenMenu(menu)}
                >
                  {navLabel(menu)} <span className="nav-chevron" aria-hidden="true" />
                </button>
                <div className={`dropdown ${openMenu === menu ? "is-open" : ""}`}>
                  <small className="dropdown-label">{navLabel(menu).toUpperCase()}</small>
                  {menus[menu].map((item) => item.disabled ? (
                    <span className="dropdown-disabled" aria-disabled="true" key={item.label}>
                      <span>{item.label}</span><small>{item.badge}</small>
                    </span>
                  ) : (
                    <a href={item.href ?? routeFor(language, item.key!)} key={item.href ?? item.key}>
                      <span>{item.label}</span>
                      {item.badge ? <small>{item.badge}</small> : <span aria-hidden="true">↗</span>}
                    </a>
                  ))}
                </div>
              </div>
            ))}
            <a className={`nav-link ${pathname.endsWith("/knowledge") ? "is-active" : ""}`} href={routeFor(language, "knowledge")}>{content.nav.knowledge}</a>
            <button
              className="nav-link nav-link-disabled"
              type="button"
              disabled
              aria-label={`${content.nav.council} — Coming soon`}
            >
              <span>{content.nav.council}</span>
              <small>Coming soon</small>
            </button>
          </nav>
          <div className="nav-actions">
            <div className="language-switch" aria-label="Language">
              <a className={language === "en" ? "is-active" : ""} href={language === "en" ? pathname : otherPath}>EN</a>
              <a className={language === "ko" ? "is-active" : ""} href={language === "ko" ? pathname : otherPath}>KR</a>
            </div>
            <a className="contact-link" href={routeFor(language, "contact")}>{content.nav.contact}</a>
            <button className={`menu-toggle ${mobileOpen ? "is-open" : ""}`} type="button" aria-label="Toggle menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}><span /><span /></button>
          </div>
        </div>
        <div className={`mobile-menu ${mobileOpen ? "is-open" : ""}`} aria-hidden={!mobileOpen}>
          <div className="mobile-menu-inner">
            <div className="mobile-primary-links">
              <a className="mobile-top-link" href={routeFor(language, "company")}>Company</a>
              <a className="mobile-top-link" href={technologyRouteFor(language)}>Technology</a>
            </div>
            {(["product"] as MenuId[]).map((menu) => (
              <div className="mobile-menu-group" key={menu}>
                <span>{navLabel(menu)}</span>
                <div>{menus[menu].map((item) => item.disabled ? (
                  <span className="mobile-menu-disabled" aria-disabled="true" key={item.label}>{item.label}<small>{item.badge}</small></span>
                ) : (
                  <a href={item.href ?? routeFor(language, item.key!)} key={item.href ?? item.key}>{item.label}{item.badge && <small>{item.badge}</small>}</a>
                ))}</div>
              </div>
            ))}
            <div className="mobile-primary-links mobile-independent-links">
              <a className="mobile-top-link" href={routeFor(language, "knowledge")}>{content.nav.knowledge}</a>
              <button
                className="mobile-top-link mobile-top-link-disabled"
                type="button"
                disabled
                aria-label={`${content.nav.council} — Coming soon`}
              >
                <span>{content.nav.council}</span>
                <small>Coming soon</small>
              </button>
            </div>
            <a className="mobile-contact" href={routeFor(language, "contact")}>Contact <span>↗</span></a>
          </div>
        </div>
      </header>
      <main id="page-content">{children}</main>
      <footer className={`site-footer ${isDarkFooter ? "site-footer-dark" : ""}`}>
        <div className="footer-shell">
          <a className="footer-brand" href={`/${language}`} aria-label="Viore home">
            <img src="/brand/viore-logotype.png" alt="Viore" />
          </a>
          <div className="footer-company">
            <div className="footer-company-primary">
              <strong>{content.footer.company.name}</strong>
              <span>{content.footer.company.representative}</span>
              <span>{content.footer.company.registration}</span>
            </div>
            <address className="footer-company-address">
              <span>{content.footer.company.address}</span>
              <a href={`mailto:${content.footer.company.email}`}>{content.footer.company.email}</a>
            </address>
          </div>
          <div className="footer-legal">
            <div className="footer-policy-links">
              <a href={`/${language}/legal#privacy`}>{content.footer.privacy}</a>
              <a href={`/${language}/legal#terms`}>{content.footer.terms}</a>
            </div>
            <span className="footer-copyright">{content.footer.copyright}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
