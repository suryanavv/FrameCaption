'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">Page Not Found</h1>
      <p className="text-muted-foreground mb-4 text-center text-base sm:text-lg">Sorry, the page you are looking for does not exist or has been moved.</p>
      <Button size="sm" className="text-base text-sm px-4 py-2 w-auto" onClick={() => router.push('/')}>Go to App</Button>
    </div>
  );
} 