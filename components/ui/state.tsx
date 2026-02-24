"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, PackageOpen, RefreshCw } from "lucide-react";

// ============================
// ErrorState
// ============================
interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  detail?: string;
  onRetry?: () => void;
}

function ErrorState({ className, message = "Có lỗi xảy ra", detail, onRetry, ...props }: ErrorStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center py-12 text-center gap-4", className)}
      {...props}
    >
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-1">
        <p className="font-semibold text-foreground">{message}</p>
        {detail && <p className="text-sm text-muted-foreground">{detail}</p>}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </Button>
      )}
    </div>
  );
}

// ============================
// EmptyState
// ============================
function EmptyState({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center py-12 text-center gap-4", className)}
      {...props}
    >
      <PackageOpen className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-1">
        <p className="font-semibold text-foreground">Không có dữ liệu</p>
        <p className="text-sm text-muted-foreground">Chưa có nội dung nào ở đây.</p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href="/">Về trang chủ</Link>
      </Button>
    </div>
  );
}

// ============================
// LoadingSkeleton
// ============================
function LoadingSkeleton({
  className,
  propertyCount = 3,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { propertyCount?: number }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)} {...props}>
      {Array.from({ length: propertyCount }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export { ErrorState, EmptyState, LoadingSkeleton };
