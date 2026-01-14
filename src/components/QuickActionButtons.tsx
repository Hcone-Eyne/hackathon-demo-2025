import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface QuickActionButtonsProps {
  onQuickAction: (question: string) => void;
  disabled?: boolean;
}

const quickActions = [
  {
    label: "Difference: Seeded vs Linked",
    question: "What's the difference between Aadhaar-seeded and Aadhaar-linked bank accounts?",
    category: "Banking",
  },
  {
    label: "How to Link Aadhaar",
    question: "How do I link my Aadhaar with my bank account?",
    category: "Linking",
  },
  {
    label: "Check DBT Status",
    question: "How can I check if my bank account is DBT-enabled?",
    category: "Verification",
  },
  {
    label: "Popular DBT Schemes",
    question: "What are the most popular DBT schemes in India?",
    category: "Schemes",
  },
  {
    label: "What is NPCI Mapper",
    question: "What is NPCI mapper and why is it important for DBT?",
    category: "Banking",
  },
  {
    label: "Aadhaar Basics",
    question: "What is Aadhaar and why do I need it?",
    category: "Basics",
  },
];

export function QuickActionButtons({ onQuickAction, disabled }: QuickActionButtonsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>Quick Questions</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto py-3 px-4 flex flex-col items-start gap-2 hover:bg-accent transition-colors"
            onClick={() => onQuickAction(action.question)}
            disabled={disabled}
          >
            <Badge variant="secondary" className="text-xs">
              {action.category}
            </Badge>
            <span className="text-sm text-left font-normal">
              {action.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
