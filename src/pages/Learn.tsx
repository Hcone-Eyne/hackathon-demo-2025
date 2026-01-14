import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookMarked, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContentCard } from "@/components/ContentCard";
import { lessonsData, lessonCategories } from "@/data/lessonContent";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useContentProgress } from "@/hooks/useContentProgress";
import { cn } from "@/lib/utils";

export default function Learn() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { isBookmarked, toggleBookmark, bookmarks } = useBookmarks();
  const { getLessonProgress, recentlyViewed, getCompletedCount } = useContentProgress();

  // Filter lessons based on search and category
  const filteredLessons = useMemo(() => {
    return lessonsData.filter(lesson => {
      const matchesSearch = 
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        selectedCategory === "all" || lesson.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Get bookmarked lessons
  const bookmarkedLessons = useMemo(() => {
    return lessonsData.filter(lesson => bookmarks.includes(lesson.id));
  }, [bookmarks]);

  // Get recently viewed lessons
  const recentLessons = useMemo(() => {
    return recentlyViewed
      .map(id => lessonsData.find(lesson => lesson.id === id))
      .filter(Boolean)
      .slice(0, 3);
  }, [recentlyViewed]);

  const handleLessonClick = (lessonId: string) => {
    navigate(`/learn/${lessonId}`);
  };

  return (
    <div className="p-4 pb-24 max-w-screen-xl mx-auto">
      {/* Header with Stats */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Learn About DBT</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Master Aadhaar linking and DBT systems
            </p>
          </div>
          <Card className="px-4 py-2">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{getCompletedCount()}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics, tags, or keywords..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {lessonCategories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={cn(
                "cursor-pointer whitespace-nowrap transition-all hover:scale-105",
                selectedCategory === category.id && "shadow-sm"
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Recently Viewed Section */}
      {recentLessons.length > 0 && (
        <>
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Recently Viewed</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentLessons.map((lesson) => {
                if (!lesson) return null;
                const progress = getLessonProgress(lesson.id);
                return (
                  <ContentCard
                    key={lesson.id}
                    lesson={lesson}
                    isBookmarked={isBookmarked(lesson.id)}
                    progress={progress?.progress || 0}
                    isCompleted={progress?.completed || false}
                    onBookmarkToggle={() => toggleBookmark(lesson.id)}
                    onClick={() => handleLessonClick(lesson.id)}
                  />
                );
              })}
            </div>
          </section>
          <Separator className="my-8" />
        </>
      )}

      {/* Bookmarked Lessons Section */}
      {bookmarkedLessons.length > 0 && (
        <>
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookMarked className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Bookmarked Lessons</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookmarkedLessons.map((lesson) => {
                const progress = getLessonProgress(lesson.id);
                return (
                  <ContentCard
                    key={lesson.id}
                    lesson={lesson}
                    isBookmarked={true}
                    progress={progress?.progress || 0}
                    isCompleted={progress?.completed || false}
                    onBookmarkToggle={() => toggleBookmark(lesson.id)}
                    onClick={() => handleLessonClick(lesson.id)}
                  />
                );
              })}
            </div>
          </section>
          <Separator className="my-8" />
        </>
      )}

      {/* All Lessons Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">
          {searchQuery || selectedCategory !== "all" 
            ? `Found ${filteredLessons.length} lessons` 
            : "All Lessons"}
        </h2>
        
        {filteredLessons.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.map((lesson) => {
              const progress = getLessonProgress(lesson.id);
              return (
                <ContentCard
                  key={lesson.id}
                  lesson={lesson}
                  isBookmarked={isBookmarked(lesson.id)}
                  progress={progress?.progress || 0}
                  isCompleted={progress?.completed || false}
                  onBookmarkToggle={() => toggleBookmark(lesson.id)}
                  onClick={() => handleLessonClick(lesson.id)}
                />
              );
            })}
          </div>
        ) : (
          <Card className="p-12">
            <CardHeader>
              <CardTitle className="text-center text-muted-foreground">
                No lessons found
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
