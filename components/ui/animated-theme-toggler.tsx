"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type AnimatedThemeTogglerProps = {
  className?: string;
};

export const AnimatedThemeToggler = ({ className }: AnimatedThemeTogglerProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Set dark mode as default on first mount if no theme is set
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only set default if not already set (resolvedTheme is undefined or null)
    if (mounted && !resolvedTheme) {
      setTheme("dark");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted) {
    return (
      <button className={cn("flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] bg-transparent", className)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4.5"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
          <path d="M12 3l0 18"></path>
          <path d="M12 9l4.65 -4.65"></path>
          <path d="M12 14.3l7.37 -7.37"></path>
          <path d="M12 19.6l8.85 -8.85"></path>
        </svg>
      </button>
    );
  }

  const changeTheme = async () => {
    if (!buttonRef.current) return;

    const currentTheme = resolvedTheme || theme || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    }).ready;

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    // Center of the button
    const cx = left + width / 2;
    const cy = top + height / 2;
    // How far the corners are from the center
    const maxX = Math.max(cx, window.innerWidth - cx);
    const maxY = Math.max(cy, window.innerHeight - cy);
    const maxRadius = Math.hypot(maxX, maxY);

    // Use a circle-like clip-path polygon growing from the center of the button
    const numPoints = 24;
    const radiusStart = 0; // Initial circle radius
    const radiusEnd = maxRadius; // Final circle radius

    // Helper to create circle polygon points
    function circlePolygon(cx: number, cy: number, r: number, points: number) {
      const arr: string[] = [];
      for (let i = 0; i < points; i++) {
        const angle = (2 * Math.PI * i) / points;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        arr.push(`${(x / window.innerWidth) * 100}% ${(y / window.innerHeight) * 100}%`);
      }
      return `polygon(${arr.join(", ")})`;
    }

    document.documentElement.animate(
      {
        clipPath: [
          circlePolygon(cx, cy, radiusStart, numPoints), // small circle at center
          circlePolygon(cx, cy, radiusEnd, numPoints),   // large circle covering viewport
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  const currentTheme = resolvedTheme || theme || "dark";

  return (
    <button
      ref={buttonRef}
      onClick={changeTheme}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] bg-transparent",
        className
      )}
      aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4.5"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
        <path d="M12 3l0 18"></path>
        <path d="M12 9l4.65 -4.65"></path>
        <path d="M12 14.3l7.37 -7.37"></path>
        <path d="M12 19.6l8.85 -8.85"></path>
      </svg>
    </button>
  );
};
