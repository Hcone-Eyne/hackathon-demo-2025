import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else {
      setBookmarks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("lesson_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setBookmarks(data?.map((b) => b.lesson_id) || []);
    } catch (error: any) {
      logger.error("Error fetching bookmarks:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (lessonId: string) => {
    if (!user) {
      toast.error("Please sign in to bookmark lessons");
      return;
    }

    const isCurrentlyBookmarked = bookmarks.includes(lessonId);

    try {
      if (isCurrentlyBookmarked) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId);

        if (error) throw error;
        setBookmarks((prev) => prev.filter((id) => id !== lessonId));
        toast.success("Bookmark removed");
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: user.id, lesson_id: lessonId });

        if (error) throw error;
        setBookmarks((prev) => [...prev, lessonId]);
        toast.success("Lesson bookmarked");
      }
    } catch (error: any) {
      logger.error("Error toggling bookmark:", error.message);
      toast.error("Failed to update bookmark");
    }
  };

  const isBookmarked = (lessonId: string) => bookmarks.includes(lessonId);

  const clearBookmarks = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;
      setBookmarks([]);
      toast.success("All bookmarks cleared");
    } catch (error: any) {
      logger.error("Error clearing bookmarks:", error.message);
      toast.error("Failed to clear bookmarks");
    }
  };

  return { bookmarks, toggleBookmark, isBookmarked, clearBookmarks, loading };
}
