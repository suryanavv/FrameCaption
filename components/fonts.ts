// Onest is now the global app font
import {
  Bricolage_Grotesque,
  Space_Mono,
  Space_Grotesk,
  Manrope,
  Poppins,
  Montserrat,
  Onest,
  Instrument_Serif,
  Inter,
  DM_Serif_Display,
  Lora,
  Geist,
  Geist_Mono,
  Ms_Madi,
  Funnel_Sans,
  Funnel_Display,
  // New fonts
  Roboto,
  Open_Sans,
  Lato,
  Merriweather,
  Playfair_Display,
  Rubik,
  Nunito,
  Oswald,
  Raleway,
  PT_Serif,
  Cabin,
  Quicksand,
  Fira_Mono,
  JetBrains_Mono,
} from "next/font/google";

// Sans-serif fonts
export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: 'swap',
});

export const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  variable: "--font-funnel-sans",
  display: 'swap',
});

export const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel-display",
  display: 'swap',
});

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: 'swap',
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: 'swap',
});

export const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: 'swap',
});

export const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: 'swap',
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: 'swap',
});

// Serif fonts
export const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
  weight: ["400"],
  display: 'swap',
});

export const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: 'swap',
});

export const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  display: 'swap',
});

export const msMadi = Ms_Madi({
  subsets: ["latin"],
  variable: "--font-ms-madi",
  weight: ["400"],
  display: 'swap',
});

// Monospace fonts
export const geistMono = Geist_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: 'swap',
});

export const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: 'swap',
});

// New font exports
export const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: 'swap',
});
export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: 'swap',
});
export const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: 'swap',
});
export const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: 'swap',
});
export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: 'swap',
});
export const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: 'swap',
});
export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: 'swap',
});
export const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: 'swap',
});
export const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: 'swap',
});
export const ptSerif = PT_Serif({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pt-serif",
  display: 'swap',
});
export const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-cabin",
  display: 'swap',
});
export const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: 'swap',
});
export const firaMono = Fira_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-fira-mono",
  display: 'swap',
});
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: 'swap',
});
