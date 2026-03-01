"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  onError?: () => void;
}

export default function SafeImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority,
  fallbackSrc = "/placeholder.png",
  onError,
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
      onError?.();
    }
  };

  // External URLs — use regular img tag
  const isExternal =
    imageSrc.startsWith("http://") || imageSrc.startsWith("https://");

  if (isExternal) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn("object-cover", className)}
        onError={handleError}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        priority={priority}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width ?? 400}
      height={height ?? 300}
      className={cn("object-cover", className)}
      priority={priority}
      onError={handleError}
    />
  );
}
