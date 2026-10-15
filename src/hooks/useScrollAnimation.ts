import { useEffect, useRef, useState, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScrollAnimationConfig {
  /** GSAP animation properties applied to the target element */
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  /** ScrollTrigger-specific options (merged with defaults) */
  trigger?: ScrollTrigger.Vars;
  /** If true, the tween is a fromTo; otherwise a simple to */
  useFromTo?: boolean;
  /** Disable the animation entirely (e.g. for reduced-motion) */
  disabled?: boolean;
}

// ─── useScrollAnimation ───────────────────────────────────────────────────────

/**
 * Attach a GSAP ScrollTrigger-driven animation to a container element.
 *
 * @param containerRef  React ref to the element that is both the trigger and the
 *                      animated target (you can override the trigger in config).
 * @param config        Animation + ScrollTrigger configuration.
 */
export function useScrollAnimation(
  containerRef: RefObject<HTMLElement | null>,
  config: ScrollAnimationConfig,
) {
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (config.disabled) return;

    const el = containerRef.current;
    if (!el) return;

    const triggerDefaults: ScrollTrigger.Vars = {
      trigger: el,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    };

    const triggerVars: ScrollTrigger.Vars = {
      ...triggerDefaults,
      ...config.trigger,
    };

    if (config.useFromTo && config.from) {
      tweenRef.current = gsap.fromTo(
        el,
        { ...config.from },
        {
          ...(config.to ?? {}),
          scrollTrigger: triggerVars,
        },
      );
    } else {
      tweenRef.current = gsap.to(el, {
        ...(config.to ?? {}),
        scrollTrigger: triggerVars,
      });
    }

    return () => {
      tweenRef.current?.scrollTrigger?.kill();
      tweenRef.current?.kill();
    };
  }, [containerRef, config]);
}

// ─── useChapterProgress ───────────────────────────────────────────────────────

/**
 * Returns a 0–1 progress value representing how far the chapter element has
 * scrolled through the viewport.
 *
 * @param chapterRef  Ref to the chapter section element.
 * @param disabled    Skip setting up the trigger (e.g. reduced motion).
 */
export function useChapterProgress(
  chapterRef: RefObject<HTMLElement | null>,
  disabled = false,
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (disabled) return;

    const el = chapterRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        setProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [chapterRef, disabled]);

  return progress;
}

// ─── useParallax ──────────────────────────────────────────────────────────────

/**
 * Applies a vertical parallax translation to an element based on scroll
 * position.
 *
 * @param ref     Ref to the element to parallax.
 * @param speed   Multiplier — positive = moves slower than scroll (background
 *                feel), negative = moves faster.
 * @param disabled  Skip setup.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  speed = 0.3,
  disabled = false,
) {
  useEffect(() => {
    if (disabled) return;

    const el = ref.current;
    if (!el) return;

    const yDistance = speed * 100; // percentage-like value

    const tween = gsap.to(el, {
      y: yDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref, speed, disabled]);
}

export default useScrollAnimation;
