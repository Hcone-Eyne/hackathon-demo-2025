import { useState, useEffect } from "react";
import { Settings, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Use sessionStorage instead of localStorage for security
// Keys are cleared when browser tab closes, reducing exposure window
const API_KEY_STORAGE = 'custom-ai-api-key';

export function ApiKeyDialog() {
  const [apiKey, setApiKey] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Use sessionStorage for temporary, session-only storage
    const saved = sessionStorage.getItem(API_KEY_STORAGE);
    if (saved) {
      setApiKey(saved);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      // Store in sessionStorage - cleared when tab closes
      sessionStorage.setItem(API_KEY_STORAGE, apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your API key is stored for this session only and will be cleared when you close this tab.",
      });
    } else {
      sessionStorage.removeItem(API_KEY_STORAGE);
      toast({
        title: "API Key Removed",
        description: "Using default AI service.",
      });
    }
    setOpen(false);
  };

  const handleClear = () => {
    setApiKey("");
    sessionStorage.removeItem(API_KEY_STORAGE);
    toast({
      title: "API Key Cleared",
      description: "Switched back to default AI service.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-95"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] animate-bounce-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            API Key Settings
          </DialogTitle>
          <DialogDescription>
            Configure your custom AI API key for the assistant. Leave empty to use the default service.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="transition-all duration-200 focus:scale-[1.02]"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleClear}
            className="transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Clear
          </Button>
          <Button 
            onClick={handleSave}
            className="transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
