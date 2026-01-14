import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bookmark, Clock, CheckCircle2 } from "lucide-react";
import { Lesson } from "@/data/lessonContent";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  lesson: Lesson;
  isBookmarked: boolean;
  progress: number;
  isCompleted: boolean;
  onBookmarkToggle: () => void;
  onClick: () => void;
}

export function ContentCard({
  lesson,
  isBookmarked,
  progress,
  isCompleted,
  onBookmarkToggle,
  onClick,
}: ContentCardProps) {
  const difficultyColors = {
    beginner: 'bg-secondary text-secondary-foreground',
    intermediate: 'bg-warning text-warning-foreground',
    advanced: 'bg-destructive text-destructive-foreground',
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] relative animate-bounce-in"
      onClick={onClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onBookmarkToggle();
        }}
        className={cn(
          "absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200",
          "hover:bg-accent hover:scale-110",
          isBookmarked ? "text-primary" : "text-muted-foreground"
        )}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <Bookmark 
          className={cn("h-5 w-5", isBookmarked && "fill-current")} 
        />
      </button>

      <CardHeader className="pb-3">
        <div className="flex items-start gap-2 mb-2">
          <Badge className={difficultyColors[lesson.difficulty]}>
            {lesson.difficulty}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {lesson.duration} min
          </Badge>
          {isCompleted && (
            <Badge className="gap-1 bg-success text-success-foreground ml-auto">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {lesson.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {lesson.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {lesson.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
