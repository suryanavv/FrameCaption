import type { Metadata } from "next";
import { onest } from "@/components/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
          <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
            <main className="flex-1 w-full max-w-full overflow-x-hidden overflow-y-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
