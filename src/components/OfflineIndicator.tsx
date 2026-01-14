import { useOffline } from '@/hooks/useOffline';
import { WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function OfflineIndicator() {
  const { isOffline } = useOffline();

  if (!isOffline) {
    return null;
  }

  return (
    <Alert className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You're offline. Some features may be limited.
      </AlertDescription>
    </Alert>
  );
}
