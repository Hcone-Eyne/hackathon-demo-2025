import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Check for updates every hour
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
  });

  if (!needRefresh) {
    return null;
  }

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  return (
    <Card className="fixed bottom-20 left-4 right-4 z-50 shadow-lg md:left-auto md:right-4 md:w-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Update Available
        </CardTitle>
        <CardDescription>
          A new version is available. Update now to get the latest features.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button onClick={handleUpdate} className="flex-1">
          Update Now
        </Button>
        <Button variant="outline" onClick={() => setNeedRefresh(false)} className="flex-1">
          Later
        </Button>
      </CardContent>
    </Card>
  );
}
