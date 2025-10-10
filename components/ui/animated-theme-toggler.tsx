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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _y = top + height / 2;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `polygon(100% 0, 100% 0, 100% 100%, 100% 100%)`,
          `polygon(100% 0, 0 0, 0 100%, 100% 100%)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
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
