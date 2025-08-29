'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Ripple } from '@/components/magicui/ripple';

interface SplashScreenProps {
  children: React.ReactNode;
}

export default function SplashScreen({ children }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Add a small delay before hiding the splash screen
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }, 2000); // Show splash for 2 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  if (!isVisible) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Splash Screen */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden",
          isLoading ? "opacity-100" : "opacity-0"
        )}
      >
        <Ripple 
          mainCircleSize={300}
          mainCircleOpacity={0.25}
          numCircles={12}
          className="absolute inset-0"
        />

        <div className="flex flex-col items-center space-y-4">
          {/* Logo with animation */}
          <div className="relative">
            <div className="w-14 h-14 relative flex items-center justify-center">
              <Image
                src="/icon.svg"
                alt="FrameCaption"
                width={32}
                height={32}
                className=""
              />
            </div>
          </div>

          {/* App name */}
          <div className="text-center space-y-1">
            <h1 className="text-lg font-bold text-center">
              FrameCaption
            </h1>
            <p className="text-xs text-muted-foreground">
              Add beautiful text overlays to your images
            </p>
          </div>

          {/* Simple progress bar loader */}
          <div className="w-40 h-1 bg-muted rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content (hidden during splash) */}
      <div className={cn(isLoading ? "opacity-0" : "opacity-100")}>
        {children}
      </div>
    </>
  );
} 