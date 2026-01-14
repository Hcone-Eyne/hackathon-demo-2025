import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Share2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { lessonsData, getRelatedLessons, LessonContent } from "@/data/lessonContent";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useContentProgress } from "@/hooks/useContentProgress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function LessonDetail() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { 
    getLessonProgress, 
    markAsComplete, 
    addToRecentlyViewed,
    updateProgress 
  } = useContentProgress();

  const [scrollProgress, setScrollProgress] = useState(0);
  const lesson = lessonsData.find((l) => l.id === lessonId);
  const lessonProgress = lesson ? getLessonProgress(lesson.id) : null;
  const relatedLessons = lesson ? getRelatedLessons(lesson.id) : [];

  useEffect(() => {
    if (lesson) {
      addToRecentlyViewed(lesson.id);
    }
  }, [lesson, addToRecentlyViewed]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(progress, 100));

      if (lesson && progress > 90 && !lessonProgress?.completed) {
        markAsComplete(lesson.id);
        toast({
          title: "Lesson Completed!",
          description: "Great job! You've completed this lesson.",
        });
      } else if (lesson && progress > 0) {
        updateProgress(lesson.id, Math.floor(progress));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lesson, lessonProgress, markAsComplete, toast, updateProgress]);

  if (!lesson) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Lesson not found</p>
        <Button onClick={() => navigate("/learn")} className="mt-4">
          Back to Learn
        </Button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: lesson.title,
        text: lesson.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Lesson link copied to clipboard",
      });
    }
  };

  const renderContent = (content: LessonContent, index: number) => {
    switch (content.type) {
      case 'heading':
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">
            {content.content}
          </h2>
        );
      case 'paragraph':
        return (
          <p key={index} className="text-base leading-relaxed mb-4 text-foreground">
            {content.content}
          </p>
        );
      case 'list':
        return (
          <ul key={index} className="space-y-2 mb-4 ml-6">
            {(content.content as string[]).map((item, i) => (
              <li key={i} className="text-base list-disc text-foreground">
                {item}
              </li>
            ))}
          </ul>
        );
      case 'steps':
        return (
          <ol key={index} className="space-y-3 mb-4">
            {(content.content as string[]).map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                  {i + 1}
                </span>
                <span className="text-base pt-1 text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        );
      case 'infographic':
        return (
          <div key={index} className="my-6 rounded-lg bg-muted p-8 text-center">
            <p className="text-muted-foreground italic">
              {content.alt || 'Infographic placeholder'}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Fixed Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <Progress value={scrollProgress} className="h-1 rounded-none" />
      </div>

      {/* Header */}
      <div className="sticky top-1 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBookmark(lesson.id)}
              className={cn(
                isBookmarked(lesson.id) && "text-primary"
              )}
              aria-label={isBookmarked(lesson.id) ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark 
                className={cn(
                  "h-5 w-5",
                  isBookmarked(lesson.id) && "fill-current"
                )} 
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              aria-label="Share lesson"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 py-6">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-primary text-primary-foreground">
              {lesson.category}
            </Badge>
            <Badge variant="outline">{lesson.difficulty}</Badge>
            <Badge variant="outline">{lesson.duration} min read</Badge>
            {lessonProgress?.completed && (
              <Badge className="gap-1 bg-success text-success-foreground">
                <CheckCircle2 className="h-3 w-3" />
                Completed
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {lesson.title}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-4">
            {lesson.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {lesson.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Lesson Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {lesson.content.map((content, index) => renderContent(content, index))}
        </div>

        {/* Related Lessons */}
        {relatedLessons.length > 0 && (
          <>
            <Separator className="my-12" />
            <section>
              <h2 className="text-2xl font-bold mb-6">Related Lessons</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {relatedLessons.map((relatedLesson) => (
                  <Card
                    key={relatedLesson.id}
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(`/learn/${relatedLesson.id}`)}
                  >
                    <CardContent className="p-4">
                      <Badge className="mb-2">{relatedLesson.category}</Badge>
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {relatedLesson.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedLesson.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </article>
    </div>
  );
}
