import { Button } from "@/components/ui/button";
import { Upload, Wand2, Download } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-3rem)] p-4 md:p-8">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Text Behind Image Editor
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create stunning images with text behind the main subject. Professional results in your browser.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button asChild size="lg" className="text-base px-8 py-4 h-auto">
            <Link href="/editor" className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Get Started
            </Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16">
          <div className="flex flex-col items-center p-6 bg-secondary/50 backdrop-blur-sm rounded-2xl border border-primary/10 hover:bg-secondary/70 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Easy Upload</h3>
            <p className="text-sm text-muted-foreground text-center">
              Simply drag and drop your image to get started
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-secondary/50 backdrop-blur-sm rounded-2xl border border-primary/10 hover:bg-secondary/70 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Wand2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">AI Powered</h3>
            <p className="text-sm text-muted-foreground text-center">
              Automatic background removal with precise text placement
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-secondary/50 backdrop-blur-sm rounded-2xl border border-primary/10 hover:bg-secondary/70 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">High Quality</h3>
            <p className="text-sm text-muted-foreground text-center">
              Export professional results in high resolution
            </p>
          </div>
        </div>

        {/* Demo Preview */}
        <div className="mt-12 md:mt-16">
          <div className="relative max-w-2xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-orange-500/20 rounded-2xl border border-primary/10 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white/80" />
                </div>
                <p className="text-white/80 font-medium">Preview your creations here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}