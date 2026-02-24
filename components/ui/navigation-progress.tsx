"use client";

import { cn } from "@/lib/utils";

interface NavigationProgressProps {
  isNavigating: boolean;
  progress: number;
  className?: string;
}

export function NavigationProgress({
  isNavigating,
  progress,
  className,
}: NavigationProgressProps) {
  if (!isNavigating && progress === 0) return null;

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-[9999] h-1 w-full bg-transparent pointer-events-none",
        className
      )}
    >
      <div
        className="h-full bg-foreground transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: isNavigating ? 1 : 0,
          transition: progress === 100 ? "width 0.2s ease-out, opacity 0.3s ease-out" : "width 0.2s ease-out",
        }}
      >
        {/* Shimmer effect */}
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}

export function NavigationProgressAdvanced({
  isNavigating,
  progress,
  className,
}: NavigationProgressProps) {
  return (
    <NavigationProgress
      isNavigating={isNavigating}
      progress={progress}
      className={className}
    />
  );
}
