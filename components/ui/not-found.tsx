'use client';

import { useRef, MouseEvent } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Particles } from '@/components/ui/particles';
import { Button } from '@/components/ui/button';
import ArrowNarrowRightIcon from '@/components/ui/arrow-narrow-right-icon';

interface NotFoundProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
  onButtonClick?: () => void;
}

export default function NotFound({
  title = 'Trang không tồn tại',
  description = 'Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.',
  buttonText = 'Về trang chủ',
  buttonHref = '/',
  className = '',
  onButtonClick,
}: NotFoundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = ((y - height / 2) / height) * -6;
    const rotateY = ((x - width / 2) / width) * 6;

    content.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (contentRef.current) {
      contentRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Particle background */}
      <Particles
        color="#000000"
        particleCount={6000}
        particleSize={3}
        animate={false}
        className="absolute inset-0 z-0 opacity-40"
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/60 via-transparent to-white/80" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center px-6 transition-transform duration-300 ease-out will-change-transform"
      >
        {/* 404 large text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="text-[10rem] md:text-[14rem] font-extrabold leading-none tracking-tighter select-none">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              4
            </span>
            <span className="text-neutral-200">0</span>
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              4
            </span>
          </h1>
        </motion.div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="h-px w-32 bg-gradient-to-r from-transparent via-neutral-300 to-transparent"
        />

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-2xl md:text-3xl font-bold text-neutral-900"
        >
          {title}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-3 max-w-md text-base text-neutral-500"
        >
          {description}
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <Link href={buttonHref} onClick={onButtonClick}>
            <Button
              size="lg"
              className="bg-black px-8 py-6 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              {buttonText}
              <ArrowNarrowRightIcon size={18} className="ml-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Subtle badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 text-xs text-neutral-400"
        >
          wokki · Nền tảng quản lí ca làm #1 Việt Nam
        </motion.p>
      </div>
    </div>
  );
}
