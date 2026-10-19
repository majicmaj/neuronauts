import { useEffect, useRef, type ReactNode } from "react";

/** One active game dock: measured clearance and visual viewport keyboard offset. */
export function GuessDock({ children, className = "", label }: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const dock = ref.current;
    if (!dock) return;
    const root = document.documentElement;
    const measure = () => root.style.setProperty("--guess-dock-height", `${dock.getBoundingClientRect().height}px`);
    const viewport = window.visualViewport;
    const position = () => {
      const keyboardOffset = viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0;
      dock.style.bottom = `${keyboardOffset}px`;
    };
    const observer = new ResizeObserver(measure);
    observer.observe(dock);
    viewport?.addEventListener("resize", position);
    viewport?.addEventListener("scroll", position);
    measure();
    position();
    return () => {
      observer.disconnect();
      viewport?.removeEventListener("resize", position);
      viewport?.removeEventListener("scroll", position);
      root.style.removeProperty("--guess-dock-height");
    };
  }, []);
  return <section ref={ref} className={`guess-dock ${className}`} aria-label={label}>{children}</section>;
}
