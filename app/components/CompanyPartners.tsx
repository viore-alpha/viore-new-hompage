/* eslint-disable @next/next/no-img-element -- Partner and program marks are fixed-size vector files. */
import type { Language } from "@/app/site-content";

/* Home Partners and Recognitions, in the same heading and rule style as the connections grid.
   KMI's name and logo appear only here (public contract rule 13). */

/* Set once KMI provides its official logo file. Use the version made for dark backgrounds,
   for example { src: "/brand/partners/kmi-logo-white.svg", width: 180, height: 48 }. */
const KMI_LOGO: { src: string; width: number; height: number } | null = null;

/* NVIDIA asks for its trademark notice wherever the Inception badge appears.
   Replace with the exact sentence from the NVIDIA Inception design guide before release. */
const NVIDIA_TRADEMARK_NOTICE =
  "NVIDIA, the NVIDIA logo, and NVIDIA Inception are trademarks and/or registered trademarks of NVIDIA Corporation in the U.S. and other countries.";

const kmiName: Record<Language, string> = {
  ko: "KMI 한국의학연구소",
  en: "KMI (Korea Medical Institute)",
};

export function CompanyPartners({ language }: { language: Language }) {
  return (
    <section className="company-logo-section company-partners" aria-labelledby="company-partners-title">
      <header className="company-connections-heading">
        <h2 id="company-partners-title">Partners</h2>
      </header>
      <ul className="company-logo-row">
        <li className="company-logo-item">
          {KMI_LOGO ? (
            <img
              className="company-partner-logo"
              src={KMI_LOGO.src}
              alt={kmiName[language]}
              width={KMI_LOGO.width}
              height={KMI_LOGO.height}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="company-logo-wordmark">{kmiName[language]}</span>
          )}
        </li>
      </ul>
    </section>
  );
}

export function CompanyRecognitions() {
  return (
    <section className="company-logo-section company-recognitions" aria-labelledby="company-recognitions-title">
      <header className="company-connections-heading">
        <h2 id="company-recognitions-title">Recognitions</h2>
      </header>
      <ul className="company-logo-row">
        <li className="company-logo-item">
          <img
            className="company-recognition-badge"
            src="/brand/partners/nvidia-inception-program-badge-rgb.svg"
            alt="NVIDIA Inception program member"
            width="240"
            height="104"
            loading="lazy"
            decoding="async"
          />
        </li>
      </ul>
      <p className="company-trademark">{NVIDIA_TRADEMARK_NOTICE}</p>
    </section>
  );
}
