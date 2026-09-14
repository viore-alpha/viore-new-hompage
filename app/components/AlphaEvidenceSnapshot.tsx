"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import type {
  AlphaEvidencePublicSnapshotV1,
  AlphaEvidenceSnapshotResult,
} from "@/app/alphaevidence-snapshot";
import type { Language } from "@/app/site-content";

const integerFormatter = new Intl.NumberFormat("ko-KR");
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

const COUNT_LABELS = [
  ["canonical_papers", "정규화 논문 레코드", "Canonical papers"],
  ["papers_with_abstract", "초록 보유 논문", "Papers with abstract"],
  ["visible_guidelines", "노출 가능한 진료지침", "Visible guidelines"],
] as const;

function subscribeToReducedMotion(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return typeof window === "undefined" || window.matchMedia(reducedMotionQuery).matches;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => true);
}

function useCountUpReady(rootRef: RefObject<HTMLDivElement | null>, enabled: boolean) {
  const reduceMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const supportsIntersectionObserver =
    typeof window !== "undefined" && "IntersectionObserver" in window;
  const started = enabled && (ready || reduceMotion || !supportsIntersectionObserver);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || started || !enabled) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { threshold: 0.16 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [enabled, rootRef, started]);

  return { started, reduceMotion };
}

function useAnimatedNumber(target: number, started: boolean, reduceMotion: boolean, delay: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started || reduceMotion) return;
    let frame = 0;
    const startAt = performance.now() + delay;
    const duration = 1_250;

    const tick = (now: number) => {
      if (now < startAt) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min((now - startAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [delay, reduceMotion, started, target]);

  return reduceMotion ? target : value;
}

function formatDateTime(value: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return null;
  const koreaTime = new Date(parsed.getTime() + 9 * 60 * 60 * 1_000);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${koreaTime.getUTCFullYear()}. ${pad(koreaTime.getUTCMonth() + 1)}. ${pad(koreaTime.getUTCDate())}. ${pad(koreaTime.getUTCHours())}:${pad(koreaTime.getUTCMinutes())}`;
}

function CountMetric({
  value,
  label,
  english,
  index,
  started,
  reduceMotion,
  language,
}: {
  value: number;
  label: string;
  english: string;
  index: number;
  started: boolean;
  reduceMotion: boolean;
  language: Language;
}) {
  const displayValue = useAnimatedNumber(value, started, reduceMotion, index * 75);

  return (
    <tr>
      <td className="alphaevidence-count-index">{String(index + 1).padStart(2, "0")}</td>
      <th scope="row">
        <span>{label}</span>
        {label !== english && <small>{english}</small>}
      </th>
      <td
        className="alphaevidence-count-value"
        aria-label={`${label} ${integerFormatter.format(value)}${language === "ko" ? "건" : ""}`}
      >
        <strong aria-hidden="true">{integerFormatter.format(displayValue)}</strong>
      </td>
    </tr>
  );
}

function SnapshotContent({
  snapshot,
  state,
  rootRef,
  language,
}: {
  snapshot: AlphaEvidencePublicSnapshotV1;
  state: "live" | "stale";
  rootRef: RefObject<HTMLDivElement | null>;
  language: Language;
}) {
  const { started, reduceMotion } = useCountUpReady(rootRef, true);
  const ko = language === "ko";

  return (
    <>
      <div className="alphaevidence-snapshot-meta">
        <div>
          <span className={`snapshot-state snapshot-state-${state}`}>
            {state === "stale"
              ? (ko ? "갱신 지연" : "STALE · UPDATE DELAYED")
              : (ko ? "최근 공개 집계" : "RECENT PUBLIC SNAPSHOT")}
          </span>
          <p>{ko ? "데이터 기준" : "Data as of"} {formatDateTime(snapshot.data_as_of)} KST</p>
        </div>
        <p>
          {ko ? "생성" : "Generated"} {formatDateTime(snapshot.generated_at)} KST
          {" · "}
          {ko ? "10분 캐시" : "10 min cache"}
        </p>
      </div>

      <div className="alphaevidence-table-wrap">
        <table className="alphaevidence-count-table">
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">{ko ? "항목" : "Metric"}</th>
              <th scope="col">{ko ? "집계" : "Count"}</th>
            </tr>
          </thead>
          <tbody>
            {COUNT_LABELS.map(([key, label, english], index) => (
              <CountMetric
                key={key}
                value={snapshot.counts[key]}
                label={ko ? label : english}
                english={english}
                index={index}
                started={started}
                reduceMotion={reduceMotion}
                language={language}
              />
            ))}
          </tbody>
        </table>
      </div>

      <p className="alphaevidence-snapshot-note">
        {ko
          ? "문헌 레코드 수는 수집·정규화된 자료의 규모이며, 모든 자료가 임상 검증을 마쳤다는 뜻은 아닙니다."
          : "Literature record counts describe collected and normalized material; they do not mean every record has completed clinical validation."}
      </p>
    </>
  );
}

export function AlphaEvidenceSnapshot({
  initialResult,
  language,
}: {
  initialResult: AlphaEvidenceSnapshotResult;
  language: Language;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState(initialResult);

  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      try {
        const response = await fetch("/api/technology/alphaevidence-snapshot", {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = await response.json() as AlphaEvidenceSnapshotResult;
        if (!response.ok || !payload.snapshot) {
          setResult((current) => ({
            state: "unavailable",
            snapshot: null,
            lastSuccessAt: current.snapshot?.generated_at ?? current.lastSuccessAt,
          }));
          return;
        }
        setResult(payload);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("[alphaevidence-snapshot] client refresh failed", error);
        setResult((current) => ({
          state: "unavailable",
          snapshot: null,
          lastSuccessAt: current.snapshot?.generated_at ?? current.lastSuccessAt,
        }));
      }
    }
    void refresh();
    return () => controller.abort();
  }, []);

  return (
    <div
      ref={rootRef}
      className="alphaevidence-snapshot"
      data-snapshot-state={result.state}
      aria-live="polite"
    >
      {result.snapshot ? (
        <SnapshotContent snapshot={result.snapshot} state={result.state} rootRef={rootRef} language={language} />
      ) : (
        <div className="alphaevidence-snapshot-unavailable">
          <span>PUBLIC SNAPSHOT</span>
          <h4>{language === "ko" ? "집계 갱신 중" : "Refreshing the snapshot"}</h4>
          <p>
            {language === "ko" ? "AlphaEvidence DB의 최신 집계를 불러오고 있습니다." : "Loading the latest AlphaEvidence DB snapshot."}
            {result.lastSuccessAt && <> {language === "ko" ? "마지막 성공" : "Last success"} {formatDateTime(result.lastSuccessAt)} KST.</>}
          </p>
        </div>
      )}
    </div>
  );
}
