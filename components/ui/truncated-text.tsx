"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TruncatedTextProps {
  text: string;
  maxWords?: number;
  className?: string;
  showButton?: boolean;
  buttonText?: { show: string; hide: string };
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}

export function TruncatedText({
  text,
  maxWords = 50,
  className,
  showButton = true,
  buttonText = { show: "Show more", hide: "Show less" },
  as = "span",
}: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const words = text.split(" ");
  const isTruncatable = words.length > maxWords;
  const displayText =
    isTruncatable && !isExpanded ? words.slice(0, maxWords).join(" ") + "..." : text;

  const Tag = as;

  return (
    <div className={cn("space-y-1", className)}>
      <Tag className="leading-relaxed">{displayText}</Tag>
      {isTruncatable && showButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-1 h-3 w-3" />
              {buttonText.hide}
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 h-3 w-3" />
              {buttonText.show}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
