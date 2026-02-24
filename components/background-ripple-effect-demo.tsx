"use client";
import React from "react";
import Image from "next/image";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Button } from "@/components/ui/button";
import SafeImage from "./ui/SafeImage";
import { PointerHighlight } from "./ui/pointer-highlight";
import { useIsMobile } from "@/hooks/useMobile";

const badges = ["F&B", "Bán lẻ", "Dịch vụ", "Part-time"];

export default function BackgroundRippleEffectDemo() {
  const isMobile = useIsMobile();

  return (
    <div className="relative flex min-h-screen w-full items-center overflow-hidden">
      {/* Background ripple */}
      <BackgroundRippleEffect />

      {/* Two-column layout */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        {/* LEFT — Content */}
        <div className="flex flex-col items-start">
          {/* Industry badges */}
          <div className="mb-6 flex flex-wrap gap-2">
            {badges.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-600 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-neutral-900 md:text-5xl lg:text-6xl dark:text-white">
            Quản lý ca làm việc{" "}
            <PointerHighlight containerClassName="inline-block">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              thông minh.
            </span>
            </PointerHighlight>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-600 md:text-lg dark:text-neutral-400">
            Wokki giúp doanh nghiệp F&B, bán lẻ và dịch vụ tự động xếp ca,
            quản lý giờ công và điều phối nhân sự bán thời gian — nhanh hơn,
            chính xác hơn, không còn sai sót thủ công.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-black px-8 py-6 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Trải nghiệm ngay
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-neutral-300 px-8 py-6 text-base font-semibold text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 dark:border-neutral-600 dark:text-neutral-300"
            >
              Tìm hiểu thêm
            </Button>
          </div>

          <p className="mt-8 text-sm text-neutral-400 dark:text-neutral-500">
            Được xây dựng cho{" "}
            <span className="font-semibold text-neutral-600 dark:text-neutral-300">
              323,000+
            </span>{" "}
            cửa hàng F&B tại Việt Nam
          </p>
        </div>

        {/* RIGHT — Macbook image */}
        {!isMobile && (
          <div className="flex items-center justify-center">
            <SafeImage
              src="/macbook.svg"
              alt="Wokki dashboard trên macbook"
              width={720}
              height={480}
              className=" max-w-7xl object-cover"
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
}
