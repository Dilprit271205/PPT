import { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PresentationProvider, usePresentationStore } from './store/presentationStore';
import { Navigation } from './components/Navigation';
import { ChapterMenu } from './components/ChapterMenu';
import { ProgressBar } from './components/ProgressBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CHAPTERS } from './data/scenarioData';

gsap.registerPlugin(ScrollTrigger);

// Lazy-load chapters for performance
const Chapter01Opening = lazy(() => import('./chapters/Chapter01Opening'));
const Chapter02Problem = lazy(() => import('./chapters/Chapter02Problem'));
const Chapter03Connect = lazy(() => import('./chapters/Chapter03Connect'));
const Chapter04Solution = lazy(() => import('./chapters/Chapter04Solution'));
const Chapter05Intelligence = lazy(() => import('./chapters/Chapter05Intelligence'));
const Chapter06Workflow = lazy(() => import('./chapters/Chapter06Workflow'));
const Chapter07Alerting = lazy(() => import('./chapters/Chapter07Alerting'));
const Chapter08Remediation = lazy(() => import('./chapters/Chapter08Remediation'));
const Chapter09USP = lazy(() => import('./chapters/Chapter09USP'));
const Chapter10TechStack = lazy(() => import('./chapters/Chapter10TechStack'));
const Chapter11Business = lazy(() => import('./chapters/Chapter11Business'));
const Chapter12Demo = lazy(() => import('./chapters/Chapter12Demo'));

const chapterComponents = [
  Chapter01Opening,
  Chapter02Problem,
  Chapter03Connect,
  Chapter04Solution,
  Chapter05Intelligence,
  Chapter06Workflow,
  Chapter07Alerting,
  Chapter08Remediation,
  Chapter09USP,
  Chapter10TechStack,
  Chapter11Business,
  Chapter12Demo,
];

function PresentationContent() {
  const {
    currentChapter,
    setCurrentChapter,
    isChapterMenuOpen,
    setIsChapterMenuOpen,
    setScrollProgress,
    isFullscreen,
    setIsFullscreen,
    isAutoplay,
    setIsAutoplay,
  } = usePresentationStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Set up chapter scroll tracking
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    chapterRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const trigger = ScrollTrigger.create({
        trigger: ref,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setCurrentChapter(index),
        onEnterBack: () => setCurrentChapter(index),
        onUpdate: (self) => {
          if (self.isActive) {
            setScrollProgress(self.progress);
          }
        },
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [setCurrentChapter, setScrollProgress]);

  const navigateToChapter = useCallback((index: number) => {
    const ref = chapterRefs.current[index];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth' });
      setIsChapterMenuOpen(false);
    }
  }, [setIsChapterMenuOpen]);

  // Autoplay progression
  useEffect(() => {
    let timer: any;
    if (isAutoplay) {
      timer = setInterval(() => {
        navigateToChapter((currentChapter + 1) % CHAPTERS.length);
      }, 10000);
    }
    return () => clearInterval(timer);
  }, [isAutoplay, currentChapter, navigateToChapter]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          navigateToChapter(Math.min(currentChapter + 1, CHAPTERS.length - 1));
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          navigateToChapter(Math.max(currentChapter - 1, 0));
          break;
        case 'Home':
          e.preventDefault();
          navigateToChapter(0);
          break;
        case 'End':
          e.preventDefault();
          navigateToChapter(CHAPTERS.length - 1);
          break;
        case 'Escape':
          if (isChapterMenuOpen) {
            setIsChapterMenuOpen(false);
          }
          if (isFullscreen) {
            document.exitFullscreen?.();
            setIsFullscreen(false);
          }
          break;
        case 'f':
        case 'F':
          if (!e.ctrlKey && !e.metaKey) {
            toggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapter, isChapterMenuOpen, isFullscreen, navigateToChapter]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, [setIsFullscreen]);

  return (
    <div ref={containerRef} className="relative bg-[#07080C] min-h-screen">
      {/* Progress Bar */}
      <ProgressBar
        currentChapter={currentChapter}
        totalChapters={CHAPTERS.length}
      />

      {/* Navigation */}
      <Navigation
        currentChapter={currentChapter}
        totalChapters={CHAPTERS.length}
        onPrev={() => navigateToChapter(Math.max(currentChapter - 1, 0))}
        onNext={() => navigateToChapter(Math.min(currentChapter + 1, CHAPTERS.length - 1))}
        onMenuToggle={() => setIsChapterMenuOpen(!isChapterMenuOpen)}
        onHome={() => navigateToChapter(0)}
        onEnd={() => navigateToChapter(CHAPTERS.length - 1)}
        onFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        isAutoplay={isAutoplay}
        onToggleAutoplay={() => setIsAutoplay(!isAutoplay)}
        onReset={() => {
          setIsAutoplay(false);
          navigateToChapter(0);
        }}
      />

      {/* Chapter Menu Overlay */}
      <ChapterMenu
        isOpen={isChapterMenuOpen}
        currentChapter={currentChapter}
        onSelect={navigateToChapter}
        onClose={() => setIsChapterMenuOpen(false)}
      />

      {/* Chapters */}
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center bg-[#07080C]">
          <div className="w-8 h-8 border-2 border-[#E53935] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        {chapterComponents.map((ChapterComponent, index) => (
          <div
            key={CHAPTERS[index].id}
            ref={(el) => { chapterRefs.current[index] = el; }}
            id={CHAPTERS[index].id}
            className="relative"
          >
            <ChapterComponent
              id={CHAPTERS[index].id}
              isActive={currentChapter === index}
              scrollProgress={currentChapter === index ? 0.5 : 0}
            />
          </div>
        ))}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PresentationProvider>
        <PresentationContent />
      </PresentationProvider>
    </ErrorBoundary>
  );
}
