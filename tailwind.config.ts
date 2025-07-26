import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // OKLCH color system matching your globals.css
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
        chart: {
          "1": "oklch(var(--chart-1))",
          "2": "oklch(var(--chart-2))",
          "3": "oklch(var(--chart-3))",
          "4": "oklch(var(--chart-4))",
          "5": "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        onest: ["var(--font-onest)", "system-ui", "sans-serif"],
        poppins: ["var(--font-poppins)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        manrope: ["var(--font-manrope)", "system-ui", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        geist: ["var(--font-geist)", "system-ui", "sans-serif"],
        bricolage: ["var(--font-bricolage)", "system-ui", "sans-serif"],
        funnelSans: ["var(--font-funnel-sans)", "system-ui", "sans-serif"],
        funnelDisplay: ["var(--font-funnel-display)", "system-ui", "sans-serif"],
        spaceGrotesk: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        dmSerifDisplay: ["var(--font-dm-serif-display)", "serif"],
        instrumentSerif: ["var(--font-instrument-serif)", "serif"],
        lora: ["var(--font-lora)", "serif"],
        msMadi: ["var(--font-ms-madi)", "cursive"],
        geistMono: ["var(--font-geist-mono)", "monospace"],
        spaceMono: ["var(--font-space-mono)", "monospace"],
        roboto: ["var(--font-roboto)", "system-ui", "sans-serif"],
        openSans: ["var(--font-open-sans)", "system-ui", "sans-serif"],
        lato: ["var(--font-lato)", "system-ui", "sans-serif"],
        merriweather: ["var(--font-merriweather)", "serif"],
        playfairDisplay: ["var(--font-playfair-display)", "serif"],
        rubik: ["var(--font-rubik)", "system-ui", "sans-serif"],
        nunito: ["var(--font-nunito)", "system-ui", "sans-serif"],
        oswald: ["var(--font-oswald)", "system-ui", "sans-serif"],
        raleway: ["var(--font-raleway)", "system-ui", "sans-serif"],
        ptSerif: ["var(--font-pt-serif)", "serif"],
        cabin: ["var(--font-cabin)", "system-ui", "sans-serif"],
        quicksand: ["var(--font-quicksand)", "system-ui", "sans-serif"],
        firaMono: ["var(--font-fira-mono)", "monospace"],
        jetbrainsMono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.5rem", { lineHeight: "0.75rem" }],
        xs: ["0.625rem", { lineHeight: "0.875rem" }],
        sm: ["0.75rem", { lineHeight: "1rem" }],
        base: ["0.875rem", { lineHeight: "1.25rem" }],
        lg: ["1rem", { lineHeight: "1.5rem" }],
        xl: ["1.125rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "3xl": ["1.5rem", { lineHeight: "2rem" }],
        "4xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "5xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "6xl": ["3rem", { lineHeight: "1" }],
        "7xl": ["3.75rem", { lineHeight: "1" }],
        "8xl": ["4.5rem", { lineHeight: "1" }],
        "9xl": ["6rem", { lineHeight: "1" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      animation: {
        // Custom animations from your globals.css
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "logo-float": "logoFloat 3s ease-in-out infinite",
        "text-glow": "textGlow 2s ease-in-out infinite",
        "fade-in-down": "fadeInDown 0.5s ease-out",
        "slide-in-from-top": "slideInFromTop 0.3s ease-out",
        "slide-in-from-bottom": "slideInFromBottom 0.3s ease-out",
        "slide-in-from-left": "slideInFromLeft 0.3s ease-out",
        "slide-in-from-right": "slideInFromRight 0.3s ease-out",
        "zoom-in": "zoomIn 0.2s ease-out",
        "zoom-out": "zoomOut 0.2s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "scale-out": "scaleOut 0.2s ease-out",
        "bounce-in": "bounceIn 0.6s ease-out",
        "bounce-out": "bounceOut 0.6s ease-out",
        "flip-in": "flipIn 0.6s ease-out",
        "flip-out": "flipOut 0.6s ease-out",
        "rotate-in": "rotateIn 0.6s ease-out",
        "rotate-out": "rotateOut 0.6s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-left": "slideLeft 0.3s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
        "wiggle": "wiggle 0.5s ease-in-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 3s linear infinite",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        // Custom keyframes from your globals.css
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        logoFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        textGlow: {
          "0%, 100%": { textShadow: "0 0 5px rgba(var(--primary), 0.3)" },
          "50%": { textShadow: "0 0 20px rgba(var(--primary), 0.6)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInFromTop: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideInFromBottom: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideInFromLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInFromRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        zoomIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        zoomOut: {
          "0%": { transform: "scale(1.05)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleOut: {
          "0%": { transform: "scale(1.2)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "20%": { transform: "scale(0.9)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(0.3)", opacity: "0" },
        },
        flipIn: {
          "0%": { transform: "perspective(400px) rotateY(90deg)", opacity: "0" },
          "40%": { transform: "perspective(400px) rotateY(-20deg)" },
          "60%": { transform: "perspective(400px) rotateY(10deg)" },
          "80%": { transform: "perspective(400px) rotateY(-5deg)" },
          "100%": { transform: "perspective(400px) rotateY(0deg)", opacity: "1" },
        },
        flipOut: {
          "0%": { transform: "perspective(400px) rotateY(0deg)", opacity: "1" },
          "100%": { transform: "perspective(400px) rotateY(90deg)", opacity: "0" },
        },
        rotateIn: {
          "0%": { transform: "rotate(-200deg)", opacity: "0" },
          "100%": { transform: "rotate(0deg)", opacity: "1" },
        },
        rotateOut: {
          "0%": { transform: "rotate(0deg)", opacity: "1" },
          "100%": { transform: "rotate(200deg)", opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        // Custom shadows for your design system
        "glow": "0 0 20px rgba(var(--primary), 0.3)",
        "glow-lg": "0 0 40px rgba(var(--primary), 0.4)",
        "inner-glow": "inset 0 0 20px rgba(var(--primary), 0.1)",
        "soft": "0 2px 15px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 4px 25px rgba(0, 0, 0, 0.12)",
        "elevated": "0 8px 32px rgba(0, 0, 0, 0.12)",
        "elevated-lg": "0 16px 48px rgba(0, 0, 0, 0.16)",
      },
      transitionTimingFunction: {
        // Custom easing functions from your components
        "smooth": "cubic-bezier(0.45, 0.05, 0.55, 0.95)",
        "bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "elastic": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
        "1000": "1000",
        "1001": "1001",
      },
      screens: {
        "xs": "475px",
        "3xl": "1600px",
        "4xl": "1920px",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      minHeight: {
        "screen-75": "75vh",
        "screen-50": "50vh",
      },
      height: {
        "screen-75": "75vh",
        "screen-50": "50vh",
      },
      // Custom utilities for your project
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-mesh": "linear-gradient(45deg, transparent 30%, rgba(var(--primary), 0.1) 50%, transparent 70%)",
      },
    },
  },
  plugins: [
    // Custom plugin for scrollbar hiding
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        // Custom utilities for your design system
        ".glass": {
          "backdrop-filter": "blur(16px)",
          "background": "rgba(255, 255, 255, 0.1)",
          "border": "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".glass-dark": {
          "backdrop-filter": "blur(16px)",
          "background": "rgba(0, 0, 0, 0.1)",
          "border": "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".text-balance": {
          "text-wrap": "balance",
        },
        ".text-pretty": {
          "text-wrap": "pretty",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};

export default config; 