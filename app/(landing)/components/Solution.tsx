"use client";

import { motion } from "motion/react";
import {
  IconSparkles,
  IconArrowsExchange,
  IconCalendarEvent,
  IconMapPin,
  IconChartBar,
  IconBell,
  IconShieldLock,
  IconDeviceMobile,
  IconBrain,
  IconCalendarClock,
  IconListCheck,
  IconAlertTriangle,
  IconAdjustments,
  IconMessageCircle,
  IconCoin,
  IconClockHour4,
  IconUsersGroup,
} from "@tabler/icons-react";

/* ─── Animation helper ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

/* ─── Component ─── */

export default function Solution() {
  return (
    <section id="giai-phap" className="w-full bg-white dark:bg-neutral-950 py-20 md:py-28 scroll-mt-16 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        {/* ── Header ── */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border border-neutral-300 dark:border-neutral-700 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Giải pháp toàn diện
          </span>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 dark:text-white md:text-4xl lg:text-5xl">
            Giải pháp &{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Tính năng
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-400">
            Từ thu thập lịch rảnh, AI xếp ca, chấm công GPS đến sàn đổi ca và
            báo cáo tự động — tất cả trên một nền tảng duy nhất.
          </p>
        </div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
          {/* ─────────────────────── ROW 1 ─────────────────────── */}

          {/* Card 1 — Foundation (left, 5 cols) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={0}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-7 lg:col-span-5"
          >
            {/* Feature icons row */}
            <div className="mb-16 flex items-center gap-3">
              {[IconCalendarClock, IconCalendarEvent, IconAdjustments, IconShieldLock].map(
                (Icon, i) => (
                  <div
                    key={i}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      i < 2
                        ? "border-emerald-200 bg-emerald-50 text-emerald-500"
                        : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                )
              )}
            </div>

            <h3 className="text-xl font-bold leading-snug text-neutral-900 dark:text-white">
              Thiết lập dữ liệu
              <br />
              đầu vào
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              Xây dựng nền tảng dữ liệu để AI có đủ thông tin vận hành — từ
              lịch rảnh, tiêu chuẩn ca đến lịch học của nhân viên.
            </p>
          </motion.div>

          {/* Card 2 — AI Engine (right, 7 cols, stat style) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={1}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-7 lg:col-span-7"
          >
            {/* Dot pattern background */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgb(212 212 212) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                AI xếp ca
                <br />
                <span className="text-neutral-400">thông minh</span>
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                Thuật toán AI phân tích hàng nghìn biến số để tạo lịch ca tối
                ưu — cân bằng chi phí, sở thích nhân viên và nhu cầu kinh
                doanh.
              </p>

              {/* Accent dots */}
              <div className="mt-8 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                <div className="h-3 w-3 rounded-full bg-neutral-200" />
              </div>

              {/* Big stat */}
              <p className="mt-3 text-6xl font-bold text-neutral-900 md:text-7xl">
                85%
              </p>
              <p className="text-xl font-semibold text-neutral-500 dark:text-neutral-400">
                Thời gian tiết kiệm
              </p>
            </div>
          </motion.div>

          {/* ─────────────────────── ROW 2 ─────────────────────── */}

          {/* Card 3 — Execution (wide, 8 cols) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={2}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-7 lg:col-span-8"
          >
            <div className="flex flex-col gap-8 md:flex-row md:items-end">
              {/* Left content */}
              <div className="flex-1">
                {/* Icons row */}
                <div className="mb-5 flex items-center gap-2.5">
                  {[IconBell, IconMapPin, IconClockHour4, IconDeviceMobile].map(
                    (Icon, i) => (
                      <div
                        key={i}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 transition-colors duration-200 hover:border-emerald-300 hover:text-emerald-500"
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    )
                  )}
                </div>

                <h3 className="text-xl font-bold leading-snug text-neutral-900 dark:text-white">
                  Vận hành &
                  <br />
                  Chấm công thực tế
                </h3>
                <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Theo dõi và ghi nhận hoạt động tại cửa hàng theo thời gian
                  thực — từ check-in GPS đến cảnh báo đi trễ.
                </p>
              </div>

              {/* Right — big stat + feature circles */}
              <div className="text-right">
                <p className="text-5xl font-bold text-neutral-900 md:text-6xl">
                  323K+
                </p>
                <p className="text-base font-medium text-neutral-400">
                  Cửa hàng F&B tại Việt Nam
                </p>
                {/* Feature circles grid */}
                <div className="mt-4 flex justify-end gap-2">
                  {[
                    IconBell,
                    IconMapPin,
                    IconClockHour4,
                    IconDeviceMobile,
                    IconShieldLock,
                    IconBrain,
                  ].map((Icon, i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white"
                    >
                      <Icon className="h-4 w-4 text-neutral-400" />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-end gap-2">
                  {[
                    IconCalendarClock,
                    IconCalendarEvent,
                    IconAdjustments,
                    IconListCheck,
                    IconSparkles,
                    IconChartBar,
                  ].map((Icon, i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white"
                    >
                      <Icon className="h-4 w-4 text-neutral-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4 — Stats overview (4 cols, tall) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={3}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-7 lg:col-span-4 lg:row-span-2"
          >
            <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Tổng quan nền tảng
            </span>

            <p className="mt-4 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              Hệ thống quản lý ca làm toàn diện — được thiết kế dành riêng cho
              ngành F&B và bán lẻ tại Việt Nam.
            </p>

            <div className="mt-6 space-y-5">
              {[
                { value: "20+", label: "Tính năng chính", icon: IconListCheck },
                { value: "5", label: "Nhóm giải pháp", icon: IconAdjustments },
                { value: "3", label: "USP độc quyền", icon: IconSparkles },
                { value: "1", label: "Nền tảng duy nhất", icon: IconDeviceMobile },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-500">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* USP badges */}
            <div className="mt-6 flex flex-wrap gap-1.5">
              {["Sàn đổi ca", "Study Sync", "AI-Hybrid"].map((usp) => (
                <span
                  key={usp}
                  className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600"
                >
                  <IconSparkles className="h-3 w-3" />
                  {usp}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ─────────────────────── ROW 3 ─────────────────────── */}

          {/* Card 5 — Experience (4 cols) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={4}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-7 lg:col-span-4"
          >
            {/* Feature icons */}
            <div className="mb-5 flex items-center gap-2.5">
              {[IconArrowsExchange, IconCoin, IconUsersGroup, IconMessageCircle].map(
                (Icon, i) => (
                  <div
                    key={i}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      i < 3
                        ? "border-emerald-200 bg-emerald-50 text-emerald-500"
                        : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                )
              )}
            </div>

            <h3 className="text-xl font-bold leading-snug text-neutral-900 dark:text-white">
              Tương tác &
              <br />
              Sự linh hoạt
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              Biến quy trình hành chính khô khan thành trải nghiệm cộng đồng —
              nơi nhân viên chủ động và gắn kết.
            </p>

            {/* USP mini-list */}
            <div className="mt-5 space-y-2">
              {[
                "Sàn đổi ca — duyệt một chạm",
                "Bounty & điểm thưởng cho ca khó",
                "AI gợi ý nhân viên phù hợp nhất",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <IconSparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 6 — Reporting (4 cols) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={5}
            className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-7 lg:col-span-4"
          >
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Báo cáo &
              <br />
              <span className="text-neutral-400">Tổng kết</span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              Dữ liệu hoá toàn bộ hiệu quả làm việc — từ giờ công, chi phí
              nhân sự đến lịch sử thay đổi ca.
            </p>

            {/* Dashboard preview bars */}
            <div className="mt-6 space-y-3">
              {[
                { label: "Giờ làm", w: "85%" },
                { label: "Chi phí", w: "62%" },
                { label: "Hiệu suất", w: "94%" },
                { label: "Tuân thủ", w: "78%" },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">{bar.label}</span>
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      {bar.w}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-neutral-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                      style={{ width: bar.w }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Feature icons */}
            <div className="mt-5 flex items-center gap-2">
              {[IconChartBar, IconCoin, IconClockHour4, IconShieldLock].map(
                (Icon, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500"
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
