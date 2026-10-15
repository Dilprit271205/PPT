import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PresentationProvider, usePresentationStore } from './store/presentationStore';
import { Navigation } from './components/Navigation';
import { ChapterMenu } from './components/ChapterMenu';
import { ProgressBar } from './components/ProgressBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CHAPTERS } from './data/scenarioData';

import Chapter01Opening from './chapters/Chapter01Opening';
import Chapter02Problem from './chapters/Chapter02Problem';
import Chapter03Connect from './chapters/Chapter03Connect';
import Chapter04Solution from './chapters/Chapter04Solution';
import Chapter05Intelligence from './chapters/Chapter05Intelligence';
import Chapter06Workflow from './chapters/Chapter06Workflow';
import Chapter07Alerting from './chapters/Chapter07Alerting';
import Chapter08Remediation from './chapters/Chapter08Remediation';
import Chapter09USP from './chapters/Chapter09USP';
import Chapter10TechStack from './chapters/Chapter10TechStack';
import Chapter11Business from './chapters/Chapter11Business';
import Chapter12Demo from './chapters/Chapter12Demo';

gsap.registerPlugin(ScrollTrigger);

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
    isFullscreen,
    setIsFullscreen,
    isAutoplay,
    setIsAutoplay,
  } = usePresentationStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Set up chapter scroll tracking with gsap context
  useEffect(() => {
    const ctx = gsap.context(() => {
      chapterRefs.current.forEach((ref, index) => {
        if (!ref) return;

        ScrollTrigger.create({
          trigger: ref,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setCurrentChapter(index),
          onEnterBack: () => setCurrentChapter(index),
        });
      });
    });

    return () => {
      ctx.revert();
    };
  }, [setCurrentChapter]);

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
