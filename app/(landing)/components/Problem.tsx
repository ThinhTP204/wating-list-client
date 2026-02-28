"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Compare } from "@/components/ui/compare";
import { useIsMobile } from "@/hooks/useMobile";

const oldContent = {
  badge: "Cách cũ",
  badgeColor: "text-red-400",
  badgeBg: "bg-red-50",
  dotColor: "bg-red-400",
  title: "Quản lý ca thủ công đang kìm hãm bạn",
  description:
    "Hơn 85% doanh nghiệp F&B và bán lẻ gặp hậu quả tiêu cực từ việc phân ca bằng Excel, giấy tờ và nhắn tin rời rạc.",
  items: [
    "Xếp ca thủ công bằng Excel, giấy tờ rời rạc",
    "Thông báo qua Zalo, Messenger — dễ bị bỏ lỡ",
    "Trùng ca, thiếu người vào giờ cao điểm",
    "Không kiểm soát được giờ công thực tế",
    "Mất hàng giờ mỗi tuần chỉ để lập lịch",
  ],
  iconPath: "M6 18L18 6M6 6l12 12",
  iconColor: "text-red-400",
  iconBg: "bg-red-100",
  textColor: "text-neutral-600",
};

const newContent = {
  badge: "Với Wokki",
  badgeColor: "text-emerald-400",
  badgeBg: "bg-emerald-50",
  dotColor: "bg-emerald-400",
  title: "Xếp ca thông minh, vận hành trơn tru",
  description:
    "Wokki tự động hóa toàn bộ quy trình xếp ca, chấm công và điều phối nhân sự — giúp bạn tập trung vào việc phát triển kinh doanh.",
  items: [
    "AI tự động xếp ca tối ưu trong vài giây",
    "Thông báo lịch làm ngay trên điện thoại",
    "Cảnh báo thông minh khi thiếu nhân sự",
    "Chấm công GPS & IoT theo thời gian thực",
    "Sàn đổi ca minh bạch, duyệt một chạm",
  ],
  iconPath: "M5 13l4 4L19 7",
  iconColor: "text-emerald-400",
  iconBg: "bg-emerald-100",
  textColor: "text-neutral-600",
};

export default function Problem() {
  const [sliderPercent, setSliderPercent] = useState(2);
  const isMobile = useIsMobile();
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-switch between old (2%) and new (98%) every 2 seconds
  useEffect(() => {
    if (isHovering) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSliderPercent((prev) => (prev <= 50 ? 98 : 2));
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovering]);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  const isOldSide = sliderPercent <= 50;
  const content = isOldSide ? oldContent : newContent;

  return (
    <section
      id="van-de"
      className="w-full bg-white py-24 scroll-mt-16"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-500">
            Vấn đề gặp phải
          </span>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">
            Trước và sau khi dùng{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Wokki
              </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-500">
            Kéo thanh trượt để thấy sự khác biệt. Nội dung sẽ thay đổi theo từng phía.
          </p>
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* LEFT — Dynamic content */}
          <div className="flex flex-col">
            {/* Badge */}
            <div
              className={`mb-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 transition-all duration-500 ${content.badgeBg}`}
            >
              <span className={`h-2 w-2 rounded-full ${content.dotColor}`} />
              <span className={`text-xs font-semibold uppercase tracking-widest ${content.badgeColor}`}>
                {content.badge}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-neutral-900 transition-all duration-500 md:text-3xl">
              {content.title}
            </h3>

            {/* Description */}
            <p className="mt-4 text-sm leading-relaxed text-neutral-500 transition-all duration-500">
              {content.description}
            </p>

            {/* List */}
            <ul className="mt-8 space-y-3">
              {content.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 transition-all duration-300"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${content.iconBg}`}
                  >
                    <svg
                      className={`h-3 w-3 ${content.iconColor}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={content.iconPath}
                      />
                    </svg>
                  </span>
                  <span className={`text-sm ${content.textColor}`}>{item}</span>
                </li>
              ))}
            </ul>

            {/* Indicator */}
            <div className="mt-8 flex items-center gap-3">
              <div className="relative h-1.5 w-32 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-500 to-emerald-500 transition-all duration-200"
                  style={{ width: `${sliderPercent}%` }}
                />
              </div>
              <span className="text-xs text-neutral-400">
                {sliderPercent <= 50 ? "← cách cũ" : "với wokki →"}
              </span>
            </div>
          </div>

          {/* RIGHT — Compare slider */}
          <div
            className="flex justify-center"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              setSliderPercent(Math.round((x / rect.width) * 100));
            }}
            onTouchMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.touches[0].clientX - rect.left;
              setSliderPercent(Math.round((x / rect.width) * 100));
            }}
          >
            <Compare
              firstImage="/good-way.png"
              secondImage="/old-way.png"
              className="h-[420px] w-full max-w-lg rounded-2xl"
              slideMode={isMobile ? "drag" : "hover"}
              showHandlebar
              autoplay={false}
              controlledPercentage={isHovering ? undefined : sliderPercent}
              initialSliderPercentage={2}
            />
          </div>
        </div>

        {/* Bottom stat bar */}
        <div className="mt-12 grid grid-cols-1 gap-4 rounded-2xl bg-neutral-100 p-6 sm:grid-cols-3">
          {[
            { stat: "85%", label: "doanh nghiệp gặp sai sót phân ca thủ công" },
            { stat: "323K+", label: "cửa hàng F&B tại Việt Nam cần giải pháp" },
            { stat: "60%", label: "việc làm do SMEs tạo ra — cần quản lý tốt hơn" },
          ].map(({ stat, label }) => (
            <div key={stat} className="text-center">
              <p className="text-3xl font-extrabold text-neutral-900">{stat}</p>
              <p className="mt-1 text-xs text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}