"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useNavigationProgressContext } from "@/components/providers/navigationProgressProvider";

// ============================
// NavigationLink
// ============================
interface NavigationLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  showProgress?: boolean;
  progressDelay?: number;
}

export function NavigationLink({
  children,
  className,
  showProgress = true,
  progressDelay = 0,
  onClick,
  ...props
}: NavigationLinkProps) {
  const { startNavigation } = useNavigationProgressContext();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (showProgress) {
      if (progressDelay > 0) {
        setTimeout(startNavigation, progressDelay);
      } else {
        startNavigation();
      }
    }
    onClick?.(e);
  };

  return (
    <Link className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

// ============================
// EnhancedNavigationLink
// ============================
interface EnhancedNavigationLinkProps extends NavigationLinkProps {
  onNavigationStart?: () => void;
  onNavigationComplete?: () => void;
  progressType?: "immediate" | "delayed" | "on-hover";
}

export function EnhancedNavigationLink({
  children,
  className,
  showProgress = true,
  progressDelay = 0,
  progressType = "immediate",
  onNavigationStart,
  onNavigationComplete,
  onClick,
  href,
  ...props
}: EnhancedNavigationLinkProps) {
  const { startNavigation, completeNavigation } = useNavigationProgressContext();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (showProgress && progressType === "immediate") {
      startNavigation();
      onNavigationStart?.();
    }
    onClick?.(e);

    // Simulate completion after navigation
    setTimeout(() => {
      completeNavigation();
      onNavigationComplete?.();
    }, 500);
  };

  const handleMouseEnter = () => {
    if (showProgress && progressType === "on-hover") {
      startNavigation();
    }
  };

  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </Link>
  );
}
