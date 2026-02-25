"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import createGlobe from "cobe";

const features = [
  {
    title: "Xếp ca tự động với AI",
    description:
      "Wokki tự động phân tích nhu cầu nhân sự và tạo lịch ca tối ưu chỉ trong vài giây, loại bỏ hoàn toàn việc xếp ca thủ công.",
    skeleton: <SkeletonOne />,
    className:
      "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
  },
  {
    title: "Mở rộng toàn cầu",
    description:
      "Wokki được thiết kế để mở rộng theo doanh nghiệp của bạn — từ một cửa hàng đến hàng trăm chi nhánh trên khắp thế giới.",
    skeleton: <SkeletonTwo />,
    className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
  },
  {
    title: "Chấm công GPS theo thời gian thực",
    description:
      "Xác minh vị trí check-in/check-out chính xác qua GPS và IoT, ngăn chặn gian lận giờ công hiệu quả.",
    skeleton: <SkeletonThree />,
    className:
      "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800",
  },
  {
    title: "Báo cáo & phân tích nhân sự",
    description:
      "Tổng hợp giờ công, chi phí nhân sự và hiệu suất ca làm tự động — hỗ trợ ra quyết định nhanh chóng, chính xác.",
    skeleton: <SkeletonFour />,
    className: "col-span-1 lg:col-span-3 border-b lg:border-none",
  },
];

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("relative overflow-hidden p-4 sm:p-8", className)}>
    {children}
  </div>
);

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => (
  <p className="mx-auto max-w-5xl text-left text-xl tracking-tight text-black md:text-2xl md:leading-snug dark:text-white">
    {children}
  </p>
);

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => (
  <p
    className={cn(
      "mx-0 my-2 max-w-sm text-left text-sm font-normal text-neutral-500 md:text-sm dark:text-neutral-300",
    )}
  >
    {children}
  </p>
);

function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    if (!canvasRef.current) return;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 4000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [10.8231, 106.6297], size: 0.08 }, // Ho Chi Minh City
        { location: [21.0285, 105.8542], size: 0.06 }, // Ha Noi
        { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
        { location: [1.3521, 103.8198], size: 0.05 },  // Singapore
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      },
    });
    return () => globe.destroy();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
}

function SkeletonOne() {
  return (
    <div className="relative flex h-full gap-10 px-2 py-8">
      <div className="group mx-auto h-full w-full bg-white p-5 shadow-2xl dark:bg-neutral-900">
        <div className="flex h-full w-full flex-1 flex-col space-y-2">
          <img
            src="/ca1.png"
            alt="Xếp ca tự động"
            width={800}
            height={800}
            className="aspect-square h-full w-full rounded-sm object-cover object-left-top"
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-60 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-60 w-full bg-gradient-to-b from-white via-transparent to-transparent dark:from-black" />
    </div>
  );
}

function SkeletonTwo() {
  return (
    <div className="relative mt-10 flex h-60 flex-col items-center bg-transparent md:h-60">
      <Globe className="absolute -right-10 -bottom-80 md:-right-10 md:-bottom-72" />
    </div>
  );
}

function SkeletonThree() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full overflow-hidden rounded-xl shadow-lg"
      >
        <img
          src="/ca3.png"
          alt="Chấm công GPS"
          width={800}
          height={800}
          className="h-full w-full rounded-xl object-cover"
        />
      </motion.div>
    </div>
  );
}

function SkeletonFour() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-xl">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full overflow-hidden rounded-xl shadow-lg"
      >
        <img
          src="/ca4.png"
          alt="Báo cáo nhân sự"
          width={800}
          height={800}
          className="h-full w-full rounded-xl object-cover"
        />
      </motion.div>
    </div>
  );
}

export default function Blog() {
  return (
    <section id="blog" className="w-full bg-white scroll-mt-16">
      <div className="relative z-20 mx-auto max-w-7xl py-10 lg:py-40">
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-500">
            Quản lí thông minh
          </span>
          <h4 className="mt-4 text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">
            Mọi thứ bạn cần để{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-bold">
              quản lý ca làm
            </span>
          </h4>
          <p className="mx-auto my-4 max-w-2xl text-center text-sm font-normal text-neutral-500 lg:text-base dark:text-neutral-300">
            Từ lập lịch tự động đến chấm công thực tế — Wokki cung cấp đầy đủ
            công cụ để vận hành nhân sự hiệu quả, tiết kiệm thời gian và chi phí.
          </p>
        </div>

        <div className="relative">
          <div className="mt-12 grid grid-cols-1 rounded-md lg:grid-cols-6 xl:border dark:border-neutral-800">
            {features.map((feature) => (
              <FeatureCard key={feature.title} className={feature.className}>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                <div className="h-full w-full">{feature.skeleton}</div>
              </FeatureCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

