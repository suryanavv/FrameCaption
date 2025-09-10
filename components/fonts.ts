// Curated selection of 15 fonts with excellent weight support
import {
  Inter,
  Poppins,
  Montserrat,
  Playfair_Display,
  Merriweather,
  Lora,
  Dancing_Script,
  Caveat,
  Fira_Mono,
  Oswald,
  Raleway,
  PT_Serif,
  Nunito,
  Rubik,
  Pacifico,
} from "next/font/google";

// 1. Clean minimal sans-serif - Inter
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

// 2. Warm sans-serif - Poppins
export const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: 'swap',
});

// 3. Geometric sans-serif - Montserrat
export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: 'swap',
});

// 4. Elegant serif display - Playfair Display
export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: 'swap',
});

// 5. Book serif - Merriweather
export const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: 'swap',
});

// 6. Formal serif - Lora
export const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

// 7. Elegant script - Dancing Script
export const dancingScript = Dancing_Script({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: 'swap',
});

// 8. Handwritten casual - Caveat
export const caveat = Caveat({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-caveat",
  display: 'swap',
});

// 9. Monospace - Fira Mono
export const firaMono = Fira_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-fira-mono",
  display: 'swap',
});

// 10. Condensed sans - Oswald
export const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: 'swap',
});

// 11. Calm sans-serif - Raleway
export const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: 'swap',
});

// 12. Readable serif - PT Serif
export const ptSerif = PT_Serif({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pt-serif",
  display: 'swap',
});

// 13. Rounded sans-serif - Nunito
export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: 'swap',
});

// 14. Modern geometric - Rubik
export const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: 'swap',
});

// 15. Decorative script - Pacifico
export const pacifico = Pacifico({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: 'swap',
});
