"use client";

import { lazy, memo, Suspense, type PointerEvent as ReactPointerEvent } from "react";
import type { Language } from "@/app/site-content";
import { A2NavIcon, type A2NavKey } from "@/app/components/alphadoc2/kit";
import { withAlphadocName } from "@/app/components/BrandName";
import type { AlphadocFeatureId } from "@/app/components/alphadoc2/FeatureScene";

const AlphadocV2FeatureScene = lazy(async () => {
  const loadedModule = await import("@/app/components/alphadoc2/FeatureScene");
  return { default: loadedModule.AlphadocV2FeatureScene };
});

const featureIcons: Record<AlphadocFeatureId, A2NavKey> = {
  "evidence-chat": "chat",
  notes: "note",
  board: "board",
  guidelines: "guidelines",
  papers: "papers",
  favorites: "favorites",
};

export interface AlphadocFeatureItem {
  id: AlphadocFeatureId;
  label: string;
  title: string;
  body: string;
}

interface AlphadocFeatureCardProps {
  active: boolean;
  copyIndex: number;
  duplicate: boolean;
  index: number;
  instanceId: string;
  item: AlphadocFeatureItem;
  language: Language;
  motionVisible: boolean;
  onPointerEnter: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave: (event: ReactPointerEvent<HTMLElement>) => void;
}

export const AlphadocFeatureCard = memo(function AlphadocFeatureCard({ active, copyIndex, duplicate, index, instanceId, item, language, motionVisible, onPointerEnter, onPointerLeave }: AlphadocFeatureCardProps) {
  return (
    <article
      className={`ap-feature-card${active ? " is-current" : ""}${motionVisible ? " is-motion-visible" : ""}`}
      data-feature-card={item.id}
      data-feature-copy={copyIndex}
      data-feature-index={index}
      data-feature-instance={instanceId}
      aria-current={!duplicate && active ? "true" : undefined}
      aria-hidden={duplicate ? "true" : undefined}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      role="listitem"
    >
      <div className="ap-feature-motion">
        {motionVisible ? (
          <Suspense fallback={<span className="ap-feature-motion-placeholder" aria-hidden="true" />}>
            <AlphadocV2FeatureScene featureId={item.id} language={language} />
          </Suspense>
        ) : <span className="ap-feature-motion-placeholder" aria-hidden="true" />}
      </div>

      <div className="ap-feature-card-copy">
        <div className="ap-feature-card-label">
          <span className="ap-feature-card-icon"><A2NavIcon nav={featureIcons[item.id]} /></span>
          <span>{item.label}</span>
        </div>
        <h3>{withAlphadocName(item.title)}</h3>
        <p>{withAlphadocName(item.body)}</p>
      </div>
    </article>
  );
});
