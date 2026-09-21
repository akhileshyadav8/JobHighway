import { ThumbsUp } from "lucide-react";
import { getRatingColor } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface RatingBadgeProps {
  rating: string | null;
  reason: string | null;
}

export function RatingBadge({ rating, reason }: RatingBadgeProps) {
  if (!rating) return null;
  
  const isExcellent = rating.toLowerCase() === 'excellent';
  const isGood = rating.toLowerCase() === 'good';
  
  const bgClass = isExcellent 
    ? "bg-green-50 border-green-200 " 
    : isGood 
      ? "bg-yellow-50 border-yellow-200 "
      : "bg-slate-50 border-slate-200 ";
      
  const iconColor = isExcellent ? "text-green-600 " : isGood ? "text-yellow-600 " : "text-slate-600 ";
  const textColor = isExcellent ? "text-green-800 " : isGood ? "text-yellow-800 " : "text-slate-800 ";

  return (
    <Card className={`mb-6 border ${bgClass}`}>
      <CardContent className="p-4 flex items-start sm:items-center gap-3">
        <div className={`p-2 rounded-full bg-white shadow-sm ${iconColor} flex-shrink-0 mt-1 sm:mt-0`}>
          <ThumbsUp className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold flex items-center gap-2">
            <span className={textColor}>JobPulse Rating: {rating}</span>
          </div>
          {reason && (
            <p className="text-sm text-slate-600 mt-1">
              {reason}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
