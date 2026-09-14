"use client";

import { useEffect, useRef } from "react";
import {
  getThreadRenderTier,
  raiseThreadRenderTier,
  type ThreadRenderTier,
} from "@/app/components/threadRenderQuality";

const BLOOM_BLUR_PX = 7;
const BLOOM_STRENGTH = 0.62;
const BLOOM_REFRESH_SECONDS = 1 / 20;
const DRAW_BUDGET_MS = 20;
const SLOW_DRAW_LIMIT = 3;
type EnergyFamily = 0 | 1 | 2;
type Rgb = readonly [number, number, number];

const ORANGE_PALETTE: Record<EnergyFamily, readonly [Rgb, Rgb, Rgb]> = {
  0: [[246, 187, 58], [255, 126, 29], [255, 70, 24]],
  1: [[248, 195, 70], [255, 139, 36], [255, 78, 29]],
  2: [[246, 188, 59], [255, 112, 35], [255, 92, 27]],
};

const RED_PALETTE: Record<EnergyFamily, readonly [Rgb, Rgb, Rgb]> = {
  0: [[255, 92, 43], [255, 59, 48], [205, 26, 24]],
  1: [[255, 105, 44], [244, 54, 42], [197, 24, 24]],
  2: [[255, 112, 49], [250, 63, 42], [214, 29, 23]],
};

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(Math.max(value, minimum), maximum);

const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

const mixColor = (from: Rgb, to: Rgb, progress: number): Rgb => [
  Math.round(mix(from[0], to[0], progress)),
  Math.round(mix(from[1], to[1], progress)),
  Math.round(mix(from[2], to[2], progress)),
];

const rgba = ([red, green, blue]: Rgb, alpha = 1) =>
  `rgba(${red}, ${green}, ${blue}, ${alpha})`;

const continueSmoothly = (
  previousControl: number,
  midpoint: number,
  previousProgress: number,
  midpointProgress: number,
  nextProgress: number,
) =>
  midpoint +
  (midpoint - previousControl) *
    ((nextProgress - midpointProgress) / (midpointProgress - previousProgress));

export function CompanyNetworkBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bloomCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const canvas = canvasRef.current;
    const bloomCanvas = bloomCanvasRef.current;
    const mainContext = canvas?.getContext("2d", { alpha: true });
    const scene = document.createElement("canvas");
    const context = scene.getContext("2d", { alpha: true });
    // Keep strand geometry Retina-sharp while the soft bloom lives in a
    // cheaper 1x layer that can refresh less often without visible stepping.
    const bloomContext = bloomCanvas?.getContext("2d", { alpha: true });
    const chapter = backdrop?.closest<HTMLElement>(".company-dark-chapter");
    const join = chapter?.querySelector<HTMLElement>(".company-join") ?? null;
    if (!backdrop || !canvas || !bloomCanvas || !mainContext || !context || !bloomContext) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1;
    let height = 1;
    let progress = 0;
    let animationFrame = 0;
    let scrollFrame = 0;
    let renderScale = 1;
    let bloomScale = 1;
    let lastBloomAt = Number.NEGATIVE_INFINITY;
    let bloomDirty = true;
    let renderTier = getThreadRenderTier();
    let slowDraws = 0;
    let isIntersecting = false;
    let shouldAnimate = false;
    let primaryGradient: CanvasGradient | null = null;
    let counterGradient: CanvasGradient | null = null;
    let goldGradient: CanvasGradient | null = null;
    let gradientProgress = -1;

    const traceStrand = (index: number, count: number, seconds: number, family: EnergyFamily) => {
      const position = count === 1 ? 0 : index / (count - 1);
      const offset = position * 2 - 1;
      const localProgress = clamp(progress + 0.035 * (1 - progress));
      const convergence = Math.pow(localProgress, 2.6);
      const compact = width < 700;
      const lateralScale = 0.64;
      const spreadScale = family === 0 ? 0.38 : family === 1 ? 0.31 : 0.43;
      const initialSpread = width * spreadScale * lateralScale;
      const finalSpread = Math.max(compact ? 2.4 : 3.2, width * 0.0035);
      const spread = offset * mix(initialSpread, finalSpread, convergence);
      const flowScale = 1 - convergence;
      const curveScale = flowScale * lateralScale;
      const pulse = Math.sin(seconds * (0.22 + family * 0.025) + index * 0.13 + family * 1.7);
      const counterPulse = Math.cos(seconds * (0.15 + family * 0.018) - index * 0.09 + family * 1.1);
      const drift = pulse * width * 0.024 * flowScale * lateralScale;
      const fineDrift = counterPulse * width * 0.011 * flowScale * lateralScale;
      const jitterA = Math.sin((index + 1) * 1.91 + family * 2.7) * width * 0.018 * flowScale * lateralScale;
      const jitterB = Math.cos((index + 1) * 2.47 + family * 1.3) * width * 0.014 * flowScale * lateralScale;
      const jitterC = Math.sin((index + 1) * 3.31 + family * 0.8) * width * 0.012 * flowScale * lateralScale;
      const centerX = width * 0.5;

      if (family === 0) {
        const previousControlX = centerX + width * 0.145 * curveScale - spread * 0.12 + drift + jitterB;
        const midpointX = centerX - width * 0.024 * curveScale - spread * 0.42 - drift + jitterC;
        const nextControlX = continueSmoothly(previousControlX, midpointX, 0.31, 0.51, 0.69);

        context.moveTo(centerX - width * 0.018 * curveScale + spread + drift, -height * 0.08);
        context.bezierCurveTo(
          centerX + width * 0.105 * curveScale + spread * 0.62 - fineDrift + jitterA,
          height * 0.14,
          previousControlX,
          height * 0.31,
          midpointX,
          height * 0.51,
        );
        context.bezierCurveTo(
          nextControlX,
          height * 0.69,
          centerX - width * 0.105 * curveScale + spread * 0.78 - drift + jitterA,
          height * 0.85,
          centerX + width * 0.025 * curveScale + spread + fineDrift,
          height * 1.08,
        );
        return;
      }

      if (family === 1) {
        const previousControlX = centerX + width * 0.07 * curveScale - spread * 0.35 - fineDrift + jitterA;
        const midpointX = centerX - width * 0.08 * curveScale + spread * 0.3 + drift + jitterC;
        const nextControlX = continueSmoothly(previousControlX, midpointX, 0.35, 0.55, 0.72);

        context.moveTo(centerX + width * 0.025 * curveScale + spread - fineDrift + jitterA, -height * 0.08);
        context.bezierCurveTo(
          centerX + width * 0.11 * curveScale + spread * 0.55 + drift + jitterB,
          height * 0.18,
          previousControlX,
          height * 0.35,
          midpointX,
          height * 0.55,
        );
        context.bezierCurveTo(
          nextControlX,
          height * 0.72,
          centerX - width * 0.08 * curveScale + spread * 0.62 + fineDrift + jitterA,
          height * 0.88,
          centerX + width * 0.045 * curveScale + spread - drift + jitterC,
          height * 1.08,
        );
        return;
      }

      const previousControlX = centerX + width * 0.11 * curveScale + spread * 0.2 + fineDrift + jitterC;
      const midpointX = centerX + width * 0.015 * curveScale - spread * 0.28 + drift + jitterB;
      const nextControlX = continueSmoothly(previousControlX, midpointX, 0.32, 0.47, 0.64);

      context.moveTo(centerX - width * 0.06 * curveScale + spread + fineDrift + jitterB, -height * 0.08);
      context.bezierCurveTo(
        centerX + width * 0.04 * curveScale + spread * 0.7 - drift + jitterA,
        height * 0.16,
        previousControlX,
        height * 0.32,
        midpointX,
        height * 0.47,
      );
      context.bezierCurveTo(
        nextControlX,
        height * 0.64,
        centerX - width * 0.16 * curveScale + spread * 0.6 + drift + jitterC,
        height * 0.82,
        centerX - width * 0.01 * curveScale + spread - fineDrift + jitterB,
        height * 1.08,
      );
    };

    const makeGradient = (family: EnergyFamily) => {
      const orange = ORANGE_PALETTE[family];
      const red = RED_PALETTE[family];
      const colorProgress = Math.pow(progress, 1.18);
      const gradient = context.createLinearGradient(0, -height * 0.1, 0, height * 1.1);

      const stops = family === 0
        ? ([
            [0, orange[0], red[0], 0.18],
            [0.22, orange[1], red[0], 0.84],
            [0.5, orange[2], red[1], 0.96],
            [0.74, orange[1], red[1], 0.8],
            [1, orange[0], red[2], 0.16],
          ] as const)
        : family === 1
          ? ([
              [0, orange[0], red[0], 0.2],
              [0.28, orange[1], red[0], 0.88],
              [0.58, orange[2], red[1], 0.92],
              [0.82, orange[0], red[1], 0.72],
              [1, orange[0], red[2], 0.16],
            ] as const)
          : ([
              [0, orange[1], red[0], 0.14],
              [0.3, orange[0], red[0], 0.74],
              [0.56, orange[1], red[1], 0.82],
              [0.8, orange[0], red[1], 0.64],
              [1, orange[1], red[2], 0.12],
            ] as const);

      for (const [stop, orangeColor, redColor, alpha] of stops) {
        gradient.addColorStop(stop, rgba(mixColor(orangeColor, redColor, colorProgress), alpha));
      }
      return gradient;
    };

    const strokeFamily = (
      count: number,
      seconds: number,
      family: EnergyFamily,
      gradient: CanvasGradient,
      haze = false,
    ) => {
      const convergence = Math.pow(progress, 2.6);
      const convergenceAlpha = mix(1, 0.3, convergence);

      context.strokeStyle = gradient;

      if (haze) {
        context.beginPath();
        for (let index = 0; index < count; index += 1) {
          traceStrand(index, count, seconds, family);
        }
        context.globalAlpha = 0.055 * convergenceAlpha;
        context.lineWidth = 18;
        context.stroke();
        return;
      }

      const accentModulo = family === 0 ? 11 : 8;

      for (let widthGroup = 0; widthGroup < 4; widthGroup += 1) {
        let hasRegularStrands = false;
        context.beginPath();
        for (let index = widthGroup; index < count; index += 4) {
          if (index % accentModulo === 0) continue;
          traceStrand(index, count, seconds, family);
          hasRegularStrands = true;
        }
        if (!hasRegularStrands) continue;

        const shimmer = 0.86 + Math.sin(seconds * 0.22 + widthGroup * 0.57 + family) * 0.14;
        context.globalAlpha = 0.21 * shimmer * convergenceAlpha;
        context.lineWidth = 0.76 + widthGroup * 0.11;
        context.stroke();
      }

      context.beginPath();
      for (let index = 0; index < count; index += accentModulo) {
        traceStrand(index, count, seconds, family);
      }
      const accentShimmer = 0.86 + Math.sin(seconds * 0.22 + family) * 0.14;
      context.globalAlpha = 0.78 * accentShimmer * convergenceAlpha;
      context.lineWidth = 2.35;
      context.stroke();
    };

    const draw = (seconds: number) => {
      context.setTransform(renderScale, 0, 0, renderScale, 0, 0);
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      context.filter = "none";

      if (
        !primaryGradient ||
        !counterGradient ||
        !goldGradient ||
        Math.abs(gradientProgress - progress) > 0.0005
      ) {
        primaryGradient = makeGradient(0);
        counterGradient = makeGradient(1);
        goldGradient = makeGradient(2);
        gradientProgress = progress;
      }

      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = "source-over";
      context.lineCap = "round";
      context.lineJoin = "round";

      const compact = width < 700;
      const primaryHazeCount = renderTier === 0 ? (compact ? 6 : 8) : renderTier === 1 ? (compact ? 2 : 3) : 1;
      const counterHazeCount = renderTier === 0 ? (compact ? 3 : 4) : 1;
      const primaryCount = renderTier === 0 ? (compact ? 32 : 48) : renderTier === 1 ? (compact ? 16 : 24) : (compact ? 6 : 10);
      const counterCount = renderTier === 0 ? (compact ? 7 : 11) : renderTier === 1 ? (compact ? 4 : 6) : (compact ? 2 : 3);
      const goldCount = renderTier === 0 ? (compact ? 11 : 17) : renderTier === 1 ? (compact ? 6 : 9) : (compact ? 2 : 4);

      strokeFamily(primaryHazeCount, seconds, 0, primaryGradient, true);
      strokeFamily(counterHazeCount, seconds, 1, counterGradient, true);
      strokeFamily(primaryCount, seconds, 0, primaryGradient);
      strokeFamily(counterCount, seconds, 1, counterGradient);
      strokeFamily(goldCount, seconds, 2, goldGradient);

      context.restore();

      const bloomRefreshSeconds = renderTier === 0
        ? BLOOM_REFRESH_SECONDS
        : renderTier === 1 ? 1 / 12 : Number.POSITIVE_INFINITY;
      if (bloomDirty || seconds - lastBloomAt >= bloomRefreshSeconds) {
        bloomContext.setTransform(1, 0, 0, 1, 0, 0);
        bloomContext.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);
        bloomContext.filter = `blur(${(BLOOM_BLUR_PX * bloomScale).toFixed(2)}px)`;
        bloomContext.globalAlpha = BLOOM_STRENGTH;
        bloomContext.drawImage(scene, 0, 0, bloomCanvas.width, bloomCanvas.height);
        bloomContext.filter = "none";
        bloomContext.globalAlpha = 1;
        lastBloomAt = seconds;
        bloomDirty = false;
      }

      mainContext.setTransform(1, 0, 0, 1, 0, 0);
      mainContext.clearRect(0, 0, canvas.width, canvas.height);
      mainContext.filter = "none";
      mainContext.globalAlpha = 1;
      mainContext.globalCompositeOperation = "source-over";
      mainContext.drawImage(scene, 0, 0);
    };

    const updateProgress = (syncAnimation = false) => {
      scrollFrame = 0;
      const rect = backdrop.getBoundingClientRect();
      // Hand motion over at the viewport midpoint so the two full-screen
      // Retina canvases never run animation loops at the same time.
      const nextShouldAnimate = rect.top <= window.innerHeight * 0.5;
      const animationChanged = nextShouldAnimate !== shouldAnimate;
      shouldAnimate = nextShouldAnimate;
      const fallbackFinish = Math.max(backdrop.offsetHeight - window.innerHeight * 0.85, 1);
      const finishDistance = join
        ? Math.max(join.offsetTop - window.innerHeight * 0.15, 1)
        : fallbackFinish;
      const nextProgress = clamp(Math.max(-rect.top, 0) / finishDistance);

      if (Math.abs(nextProgress - progress) > 0.0005) {
        progress = nextProgress;
        backdrop.style.setProperty("--company-convergence-progress", progress.toFixed(4));
        if (reducedMotion.matches) draw(0);
      }
      if (syncAnimation && animationChanged) syncMotion();
    };

    const requestProgressUpdate = () => {
      if (!scrollFrame) {
        scrollFrame = window.requestAnimationFrame(() => updateProgress(true));
      }
    };

    const releaseCanvas = () => {
      width = 1;
      height = 1;
      primaryGradient = null;
      counterGradient = null;
      goldGradient = null;
      gradientProgress = -1;
      lastBloomAt = Number.NEGATIVE_INFINITY;
      bloomDirty = true;
      if (canvas.width !== 1) canvas.width = 1;
      if (canvas.height !== 1) canvas.height = 1;
      if (scene.width !== 1) scene.width = 1;
      if (scene.height !== 1) scene.height = 1;
      if (bloomCanvas.width !== 1) bloomCanvas.width = 1;
      if (bloomCanvas.height !== 1) bloomCanvas.height = 1;
    };

    const resize = () => {
      if (!isIntersecting || document.hidden) return;
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      renderScale = pixelRatio;
      bloomScale = Math.min(pixelRatio, 1);
      const renderWidth = Math.round(width * pixelRatio);
      const renderHeight = Math.round(height * pixelRatio);

      if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
        canvas.width = renderWidth;
        canvas.height = renderHeight;
        scene.width = renderWidth;
        scene.height = renderHeight;
        bloomCanvas.width = Math.round(width * bloomScale);
        bloomCanvas.height = Math.round(height * bloomScale);
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        bloomDirty = true;
        primaryGradient = null;
        counterGradient = null;
        goldGradient = null;
        gradientProgress = -1;
      }
      updateProgress();
      draw(reducedMotion.matches ? 0 : performance.now() / 1000);
    };

    const animate = (timestamp: number) => {
      const drawStartedAt = performance.now();
      draw(timestamp / 1000);
      const drawDuration = performance.now() - drawStartedAt;
      if (drawDuration > DRAW_BUDGET_MS) {
        slowDraws += 1;
        if (slowDraws >= SLOW_DRAW_LIMIT && renderTier < 2) {
          renderTier = raiseThreadRenderTier((renderTier + 1) as ThreadRenderTier);
          slowDraws = 0;
          bloomDirty = true;
        }
      } else {
        slowDraws = Math.max(0, slowDraws - 1);
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    const syncMotion = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;

      if (!isIntersecting || document.hidden) {
        releaseCanvas();
        return;
      }
      renderTier = Math.max(renderTier, getThreadRenderTier()) as ThreadRenderTier;
      resize();
      if (reducedMotion.matches) draw(0);
      else if (shouldAnimate) animationFrame = window.requestAnimationFrame(animate);
    };

    const handleMotionChange = () => {
      updateProgress();
      syncMotion();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry?.isIntersecting ?? false;
        syncMotion();
      },
      { rootMargin: "0px", threshold: 0 },
    );

    resizeObserver.observe(canvas);
    intersectionObserver.observe(backdrop);
    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", requestProgressUpdate);
    reducedMotion.addEventListener("change", handleMotionChange);
    document.addEventListener("visibilitychange", syncMotion);
    syncMotion();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(scrollFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("scroll", requestProgressUpdate);
      window.removeEventListener("resize", requestProgressUpdate);
      reducedMotion.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", syncMotion);
      releaseCanvas();
    };
  }, []);

  return (
    <div ref={backdropRef} className="company-network-backdrop" aria-hidden="true">
      <div className="company-network-viewport">
        <canvas ref={bloomCanvasRef} className="company-convergence-bloom-canvas" />
        <canvas ref={canvasRef} className="company-convergence-canvas" />
      </div>
    </div>
  );
}
