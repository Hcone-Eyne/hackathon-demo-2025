import { useState, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const CHAT_HISTORY_KEY = 'dbt-chat-history';
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dbt-chat`;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(CHAT_HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const saveToHistory = useCallback((msgs: Message[]) => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(msgs));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => {
      const updated = [...prev, userMessage];
      saveToHistory(updated);
      return updated;
    });
    
    setIsLoading(true);
    setError(null);

    let assistantContent = '';
    const assistantId = `assistant-${Date.now()}`;

    try {
      abortControllerRef.current = new AbortController();

      // Get auth token for authenticated requests
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Please sign in to use the chat');
      }

      // Check for custom API key in sessionStorage (session-only, more secure)
      const customApiKey = sessionStorage.getItem('custom-ai-api-key');

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({ 
            role: m.role, 
            content: m.content 
          })),
          customApiKey: customApiKey || undefined,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            
            if (content) {
              assistantContent += content;
              
              setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                const assistantMsg: Message = {
                  id: assistantId,
                  role: 'assistant',
                  content: assistantContent,
                  timestamp: Date.now(),
                };

                if (lastMsg?.id === assistantId) {
                  const updated = [...prev.slice(0, -1), assistantMsg];
                  saveToHistory(updated);
                  return updated;
                }
                
                const updated = [...prev, assistantMsg];
                saveToHistory(updated);
                return updated;
              });
            }
          } catch (parseError) {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        logger.info('Request aborted');
      } else {
        logger.error('Chat error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMessage);
        
        // Remove the user message if there was an error
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== userMessage.id);
          saveToHistory(filtered);
          return filtered;
        });
      }
      setIsLoading(false);
    }
  }, [messages, saveToHistory]);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setError(null);
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      // Remove last assistant message if exists
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg.role === 'assistant') {
          const filtered = prev.slice(0, -1);
          saveToHistory(filtered);
          return filtered;
        }
        return prev;
      });
      sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage, saveToHistory]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    cancelRequest,
    retryLastMessage,
  };
}
