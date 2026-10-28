"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/* 모션 타임라인 엔진 (첫 화면 모션, 인터페이스 투어가 함께 쓴다).
   CSS 키프레임 대신 시간 t에 대해 data-k 요소마다 투명도·이동·크기·흐림·잘라내기를 계산해 직접 쓴다.
   그래서 일시정지·건너뛰기·반복이 정확하고, 움직임 줄이기 설정에서는 정해 둔 한 장면만 보여 준다. */

export type Prop = "o" | "x" | "y" | "s" | "sx" | "sy" | "b" | "r" | "c" | "cv";
export type V = Partial<Record<Prop, number>>;
export type Ease = (p: number) => number;
type Tween = { k: string; t: number; d: number; to: V; e: Ease };
type Typing = { k: string; t: number; d: number };
export type Timeline = { init: Record<string, V>; byKey: Map<string, Tween[]>; typing: Typing[]; end: number };

export const ease = {
  out: (p: number) => 1 - Math.pow(1 - p, 3),
  outQuint: (p: number) => 1 - Math.pow(1 - p, 5),
  in: (p: number) => p * p * p,
  inOut: (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  back: (p: number) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
  soft: (p: number) => { const c1 = 0.9, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
};

const BASE: Required<V> = { o: 1, x: 0, y: 0, s: 1, sx: 1, sy: 1, b: 0, r: 0, c: 1, cv: 1 };

/* 타임라인 만들기. set은 시작 상태, to는 t부터 d ms 동안 바뀌는 값이다. */
export function createTimeline() {
  const init: Record<string, V> = {};
  const tweens: Tween[] = [];
  const typing: Typing[] = [];
  const set = (k: string, v: V) => { init[k] = { ...init[k], ...v }; };
  const to = (k: string, t: number, d: number, v: V, e: Ease = ease.out) => { tweens.push({ k, t, d: Math.max(1, d), to: v, e }); };
  const pop = (k: string, t: number, d = 520) => { set(k, { o: 0, s: 0.35, b: 6 }); to(k, t, d, { o: 1, s: 1, b: 0 }, ease.back); };
  const rise = (k: string, t: number, d = 420, dy = 12) => { set(k, { o: 0, y: dy }); to(k, t, d, { o: 1, y: 0 }, ease.outQuint); };
  const out = (k: string, t: number, d = 260, v: V = {}) => to(k, t, d, { o: 0, ...v }, ease.in);
  const wipe = (k: string, t: number, d = 560) => { set(k, { o: 0, c: 0 }); to(k, t, d, { o: 1, c: 1 }, ease.out); };
  const type = (k: string, t: number, d: number) => { typing.push({ k, t, d }); };
  const done = (end: number): Timeline => {
    const byKey = new Map<string, Tween[]>();
    tweens.sort((a, b) => a.t - b.t).forEach((tw) => { const list = byKey.get(tw.k) ?? []; list.push(tw); byKey.set(tw.k, list); });
    return { init, byKey, typing, end };
  };
  return { set, to, pop, rise, out, wipe, type, done };
}

/* data-k 요소에 시간 t의 상태를 쓰는 함수를 만든다.
   clock(el)을 주면 그 요소는 전체 시간 대신 자기 장면의 시간으로 움직인다. */
export function createRenderer(root: HTMLElement, tl: Timeline, clock?: (el: HTMLElement) => ((t: number) => number) | null) {
  const items = Array.from(root.querySelectorAll<HTMLElement>("[data-k]")).map((el) => ({
    el, k: el.dataset.k as string, local: clock?.(el) ?? null, last: "",
  }));
  const typed = tl.typing.map((ty) => {
    const el = root.querySelector<HTMLElement>(`[data-k="${ty.k}"]`);
    return { ty, el, text: el?.textContent ?? "", local: el ? clock?.(el) ?? null : null };
  });

  return (t: number) => {
    for (const it of items) {
      const tt = it.local ? it.local(t) : t;
      const st = { ...BASE, ...tl.init[it.k] };
      for (const tw of tl.byKey.get(it.k) ?? []) {
        if (tt <= tw.t) break;
        const e = tw.e(Math.min(1, (tt - tw.t) / tw.d));
        for (const p in tw.to) { const key = p as Prop; st[key] = st[key] + ((tw.to[key] as number) - st[key]) * e; }
      }
      const sx = st.s * st.sx, sy = st.s * st.sy;
      const clip = st.c < 0.999 ? `inset(0 ${((1 - st.c) * 100).toFixed(1)}% 0 0)` : st.cv < 0.999 ? `inset(0 0 ${((1 - st.cv) * 100).toFixed(1)}% 0 round 14px)` : "none";
      const css = `${st.o.toFixed(3)}|translate(${st.x.toFixed(1)}px,${st.y.toFixed(1)}px) scale(${sx.toFixed(4)},${sy.toFixed(4)})${st.r ? ` rotate(${st.r.toFixed(2)}deg)` : ""}|${st.b > 0.05 ? `blur(${st.b.toFixed(1)}px)` : "none"}|${clip}`;
      if (it.last === css) continue;
      it.last = css;
      const [o, tf, f, cp] = css.split("|");
      it.el.style.opacity = o;
      it.el.style.transform = tf;
      it.el.style.filter = f;
      it.el.style.clipPath = cp;
      it.el.style.visibility = Number(o) < 0.005 ? "hidden" : "";
    }
    for (const { ty, el, text, local } of typed) {
      if (!el) continue;
      const tt = local ? local(t) : t;
      const p = Math.max(0, Math.min(1, (tt - ty.t) / ty.d));
      const next = text.slice(0, Math.round(text.length * p));
      if (el.textContent !== next) el.textContent = next;
      el.classList.toggle("is-typing", p > 0 && p < 1);
    }
  };
}

export type PlayerMode = "idle" | "playing" | "paused" | "ended";
type Scene = { frame: (t: number) => void; end: number; staticAt?: number };

/* 재생기: 화면에 30% 이상 보이면 자동 재생, 벗어나면 멈춤, 움직임 줄이기면 staticAt 한 장면만.
   loop면 끝에서 처음으로 이어 붙는다. setup은 글꼴이 준비된 뒤 한 번 불린다. */
export function useTimelinePlayer(
  rootRef: RefObject<HTMLElement | null>,
  setup: (root: HTMLElement) => Scene | null,
  { loop = false, threshold = 0.3 }: { loop?: boolean; threshold?: number } = {},
) {
  const [mode, setMode] = useState<PlayerMode>("idle");
  const api = useRef<{ toggle: () => void; seek: (t: number) => void } | null>(null);
  const setupRef = useRef(setup);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let dispose = () => {};

    const start = () => {
      if (disposed) return;
      const scene = setupRef.current(root);
      if (!scene) return;
      const { frame, end } = scene;
      let t = 0, playing = false, raf = 0, last = 0, started = false, autoPaused = false;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const loopFn = (now: number) => {
        if (!playing) return;
        t += Math.min(50, now - last);
        last = now;
        if (t >= end) {
          if (loop) t %= end;
          else {
            t = end;
            frame(t);
            playing = false;
            root.classList.remove("is-playing");
            setMode("ended");
            return;
          }
        }
        frame(t);
        raf = requestAnimationFrame(loopFn);
      };
      const play = () => {
        if (!loop && t >= end) t = 0;
        playing = true;
        last = performance.now();
        root.classList.add("is-playing");
        setMode("playing");
        raf = requestAnimationFrame(loopFn);
      };
      const pause = () => {
        playing = false;
        cancelAnimationFrame(raf);
        root.classList.remove("is-playing");
        setMode("paused");
      };
      api.current = {
        toggle: () => { autoPaused = false; if (playing) pause(); else play(); },
        seek: (next: number) => { t = Math.max(0, Math.min(end - 1, next)); frame(t); },
      };

      if (reduce) {
        t = scene.staticAt ?? end;
        frame(t);
        setMode(loop ? "paused" : "ended");
      } else {
        frame(0);
      }
      root.classList.add("is-ready");

      const io = new IntersectionObserver(([entry]) => {
        if (reduce) return;
        if (entry.isIntersecting) {
          if (!started) { started = true; play(); }
          else if (autoPaused) { autoPaused = false; play(); }
        } else if (playing) {
          autoPaused = true;
          pause();
        }
      }, { threshold });
      io.observe(root);
      dispose = () => { cancelAnimationFrame(raf); io.disconnect(); };
    };

    if (document.fonts?.status === "loaded") start();
    else (document.fonts?.ready ?? Promise.resolve()).then(start);
    return () => { disposed = true; dispose(); };
  }, [rootRef, loop, threshold]);

  return {
    mode,
    toggle: () => api.current?.toggle(),
    seek: (t: number) => api.current?.seek(t),
  };
}
