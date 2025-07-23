import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitch } from "@/components/ui/themeSwitch";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POVImage - Text Behind Image Editor",
  description: "Create stunning images with text behind the main subject. All in your browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            {/* Floating Header - Same Width as Editor */}
            <div className="sticky top-0 z-50 p-2 flex justify-between">
              {/* <div> */}
                <header className="flex h-10 items-center justify-center bg-secondary/50 backdrop-blur-md rounded-2xl border border-primary/10 shadow-sm w-full max-w-[240px]">
                  <h1 className="text-lg font-semibold flex items-center gap-2 p-3">
                    <Image src="/icon.svg" alt="POVImage" width={20} height={20} />
                    POVImage
                  </h1>
                </header>
                <div className="h-10 w-full max-w-[240px] mx-2">
                  <ThemeSwitch />
                </div>
                {/* </div> */}
            </div>
            
            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
