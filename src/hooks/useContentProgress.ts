import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { logger } from "@/utils/logger";

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  progress: number;
  lastViewed: number;
}

export function useContentProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setProgress({});
      setRecentlyViewed([]);
      setLoading(false);
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("progress_tracking")
        .select("*")
        .eq("user_id", user.id)
        .order("last_accessed_at", { ascending: false });

      if (error) throw error;

      const progressMap: Record<string, LessonProgress> = {};
      const recentIds: string[] = [];

      data?.forEach((item) => {
        progressMap[item.lesson_id] = {
          lessonId: item.lesson_id,
          progress: item.progress_percentage,
          completed: item.completed,
          lastViewed: new Date(item.last_accessed_at).getTime(),
        };
        if (recentIds.length < 5) {
          recentIds.push(item.lesson_id);
        }
      });

      setProgress(progressMap);
      setRecentlyViewed(recentIds);
    } catch (error: any) {
      logger.error("Error fetching progress:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (lessonId: string, progressValue: number) => {
    if (!user) return;

    const completed = progressValue >= 100;
    const now = new Date().toISOString();

    try {
      const { error } = await supabase
        .from("progress_tracking")
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          progress_percentage: progressValue,
          completed,
          last_accessed_at: now,
          completed_at: completed ? now : null,
        });

      if (error) throw error;

      setProgress((prev) => ({
        ...prev,
        [lessonId]: {
          lessonId,
          progress: progressValue,
          completed,
          lastViewed: new Date(now).getTime(),
        },
      }));
    } catch (error: any) {
      logger.error("Error updating progress:", error.message);
    }
  };

  const markAsComplete = async (lessonId: string) => {
    await updateProgress(lessonId, 100);
  };

  const addToRecentlyViewed = async (lessonId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("progress_tracking")
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          last_accessed_at: new Date().toISOString(),
        });

      if (error) throw error;

      setRecentlyViewed((prev) => {
        const filtered = prev.filter((id) => id !== lessonId);
        return [lessonId, ...filtered].slice(0, 5);
      });
    } catch (error: any) {
      logger.error("Error marking as viewed:", error.message);
    }
  };

  const getLessonProgress = (lessonId: string): LessonProgress | null => {
    return progress[lessonId] || null;
  };

  const getCompletedCount = () => {
    return Object.values(progress).filter((p) => p.completed).length;
  };

  return {
    progress,
    recentlyViewed,
    updateProgress,
    markAsComplete,
    addToRecentlyViewed,
    getLessonProgress,
    getCompletedCount,
    loading,
  };
}
