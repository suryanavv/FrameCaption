import type { Metadata } from "next";
import { onest } from "@/components/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: "FrameCaption - Text Overlay Image Editor",
  description: "Create stunning images with text overlays. Add captions, titles, and text elements to your photos with professional styling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${onest.variable} antialiased min-h-screen bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SplashScreen>
            <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
              <main className="flex-1 w-full max-w-full overflow-x-hidden overflow-y-auto">
                {children}
              </main>
            </div>
          </SplashScreen>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
