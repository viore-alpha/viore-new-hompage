"use client";

import { useEffect, useState, type ReactNode } from "react";

/* One Technology post as a card. The face stays visible; the body opens in place.
   The body is server-rendered and only hidden, so search, links and find-by-anchor keep working.
   A link to #post-id (from another post or another page) opens that card. */
export function TechnologyPostCard({
  id,
  status,
  index,
  englishTitle,
  name,
  lead,
  meta,
  children,
}: {
  id: string;
  status: string;
  index: string;
  englishTitle: string;
  name: string;
  lead: string;
  meta: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const bodyId = `${id}-body`;

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === `#${id}`) setOpen(true);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [id]);

  return (
    <article id={id} className={`technology-post${open ? " is-open" : ""}`} data-tech-status={status}>
      <header className="technology-post-card">
        <p className="technology-post-number">POST {index}</p>
        <p className="technology-section-english">{englishTitle}</p>
        <h2>
          <button
            type="button"
            className="technology-post-toggle"
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => setOpen((value) => !value)}
          >
            <span>{name}</span>
            <i className="technology-post-toggle-icon" aria-hidden="true" />
          </button>
        </h2>
        <p className="technology-section-lead">{lead}</p>
        {meta}
      </header>
      <div className="technology-post-panel" id={bodyId} hidden={!open}>
        {children}
      </div>
    </article>
  );
}
