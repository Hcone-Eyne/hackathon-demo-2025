import { useOffline } from '@/hooks/useOffline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WifiOff, RefreshCw, BookMarked } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Offline() {
  const { isOffline, cachedPages, retryConnection } = useOffline();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">No Internet Connection</CardTitle>
          <CardDescription>
            You're offline. Some features may be limited, but you can still access cached content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={retryConnection} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>

          {cachedPages.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <BookMarked className="h-4 w-4" />
                Available Offline Content
              </h3>
              <div className="rounded-lg border bg-card p-4 space-y-2">
                {cachedPages.slice(0, 5).map((page) => (
                  <div key={page} className="text-sm text-muted-foreground">
                    • {page}
                  </div>
                ))}
                {cachedPages.length > 5 && (
                  <div className="text-sm text-muted-foreground">
                    • And {cachedPages.length - 5} more...
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-4 text-center">
            <Link to="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
