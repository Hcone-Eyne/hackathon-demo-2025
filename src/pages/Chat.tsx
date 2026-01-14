import { useEffect, useRef, useState } from "react";
import { Send, Trash2, AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChatMessage } from "@/components/ChatMessage";
import { QuickActionButtons } from "@/components/QuickActionButtons";
import { ApiKeyDialog } from "@/components/ApiKeyDialog";
import { useChat } from "@/hooks/useChat";

export default function Chat() {
  const { messages, isLoading, error, sendMessage, clearChat, cancelRequest, retryLastMessage } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage(input.trim());
    setInput("");
  };

  const handleQuickAction = (question: string) => {
    if (isLoading) return;
    sendMessage(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Expert help for DBT and Aadhaar queries
            </p>
          </div>
          
          <div className="flex gap-2">
            <ApiKeyDialog />
            {messages.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="transition-all duration-300 hover:scale-110 active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="animate-bounce-in">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all messages from this conversation.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="transition-all duration-300 hover:scale-105">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={clearChat}
                      className="transition-all duration-300 hover:scale-105"
                    >
                      Clear
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="space-y-6 py-8">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">Welcome to DBT Assistant</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  I'm here to help you understand Aadhaar linking, DBT schemes, and answer 
                  your questions about government benefits. Try asking a question or use 
                  one of the quick actions below.
                </p>
              </div>
              
              <QuickActionButtons 
                onQuickAction={handleQuickAction}
                disabled={isLoading}
              />
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              
              {isLoading && (
                <div className="flex gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium">DBT Assistant</span>
                    <p className="text-sm text-muted-foreground mt-1">Thinking...</p>
                  </div>
                </div>
              )}
              
              <div ref={scrollRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Error Alert */}
      {error && (
        <div className="px-4 pb-2">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={retryLastMessage}
                className="h-7"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Ask about DBT, Aadhaar linking, or schemes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          {isLoading ? (
            <Button 
              type="button" 
              onClick={cancelRequest}
              variant="secondary"
            >
              Cancel
            </Button>
          ) : (
            <Button type="submit" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          )}
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI responses may contain errors. Verify important information.
        </p>
      </div>
    </div>
  );
}
