'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
          "fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 overflow-hidden",
          isLoading ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-tl from-primary/3 via-transparent to-primary/3 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="flex flex-col items-center space-y-6 animate-fade-in-up">
          {/* Logo with animation */}
          <div className="relative">
            <div className="w-24 h-24 relative flex items-center justify-center">
              <Image
                src="/icon.svg"
                alt="POVImage"
                width={64}
                height={64}
                // className={cn(
                //   "transition-all duration-1000 animate-logo-float z-10",
                //   isLoading ? "scale-100 rotate-0" : "scale-110 rotate-12"
                // )}
              />
              {/* Pulse ring animation */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-pulse" />
            </div>
          </div>

          {/* App name */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-text-glow">
              POVImage
            </h1>
            <p className="text-sm text-muted-foreground">
              Text Behind Image Editor
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-primary/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Loading dots */}
          {/* <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div> */}
        </div>
      </div>

      {/* Main content (hidden during splash) */}
      <div className={cn("transition-opacity duration-500", isLoading ? "opacity-0" : "opacity-100")}>
        {children}
      </div>
    </>
  );
} 