'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { IconError404, IconArrowLeft, IconHome } from '@tabler/icons-react';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4">
      <IconError404 className="w-20 h-20 text-primary mb-6" aria-hidden="true" />
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary flex items-center gap-2">
        Page Not Found
      </h1>
      <p className="text-muted-foreground mb-6 text-center text-base sm:text-lg">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Button
        size="sm"
        className="text-sm h-8 w-auto cursor-pointer flex items-center gap-2"
        onClick={() => router.push('/')}
      >
        <IconHome className="w-4 h-4" aria-hidden="true" />
        Go to App
      </Button>
    </div>
  );
}