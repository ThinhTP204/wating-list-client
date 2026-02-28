"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";

type BillingCycle = "monthly" | "yearly";

const plans = [
  {
    name: "Miễn Phí",
    description: "Dành cho cửa hàng nhỏ mới bắt đầu số hoá quản lý ca.",
    priceMonthly: 0,
    priceYearly: 0,
    badge: null,
    featured: false,
    cta: "Bắt đầu miễn phí",
    features: [
      { text: "Tối đa 5 nhân viên", included: true },
      { text: "Xếp ca thủ công kéo-thả", included: true },
      { text: "Lịch ca dạng bảng", included: true },
      { text: "Thông báo qua app", included: true },
      { text: "Hỗ trợ qua email", included: true },
      { text: "AI xếp ca tự động", included: false },
      { text: "Chấm công GPS / IoT", included: false },
      { text: "Sàn đổi ca", included: false },
      { text: "Báo cáo & phân tích", included: false },
    ],
  },
  {
    name: "Pro",
    description: "Cho doanh nghiệp đang phát triển, cần tối ưu vận hành.",
    priceMonthly: 299000,
    priceYearly: 2990000,
    badge: "Phổ biến nhất",
    featured: true,
    cta: "Dùng thử 14 ngày",
    features: [
      { text: "Tối đa 50 nhân viên", included: true },
      { text: "AI xếp ca tự động", included: true },
      { text: "Chấm công GPS theo thời gian thực", included: true },
      { text: "Sàn đổi ca — duyệt một chạm", included: true },
      { text: "Cảnh báo thiếu nhân sự", included: true },
      { text: "Báo cáo giờ công & chi phí", included: true },
      { text: "Quản lý nhiều chi nhánh", included: true },
      { text: "Hỗ trợ ưu tiên 24/7", included: true },
      { text: "Tích hợp IoT nâng cao", included: false },
    ],
  },
  {
    name: "Doanh Nghiệp",
    description: "Giải pháp toàn diện cho chuỗi cửa hàng & tập đoàn.",
    priceMonthly: null,
    priceYearly: null,
    badge: null,
    featured: false,
    cta: "Liên hệ tư vấn",
    features: [
      { text: "Không giới hạn nhân viên", included: true },
      { text: "Tất cả tính năng Pro", included: true },
      { text: "Tích hợp IoT & thiết bị chấm công", included: true },
      { text: "API tuỳ chỉnh & webhook", included: true },
      { text: "Phân tích nâng cao & dashboard", included: true },
      { text: "Quản lý đa chi nhánh không giới hạn", included: true },
      { text: "Quản lý quyền nhân sự nâng cao", included: true },
      { text: "Account Manager riêng", included: true },
      { text: "SLA cam kết & hỗ trợ 24/7", included: true },
    ],
  },
];

function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN");
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function Subscription() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const isMobile = useIsMobile();

  return (
    <section id="bang-gia" className="w-full bg-white py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-500">
            Bảng giá
          </span>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">
            Chọn gói phù hợp với{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              doanh nghiệp bạn
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-500">
            Bắt đầu miễn phí, nâng cấp khi bạn cần. Không ràng buộc, huỷ bất cứ
            lúc nào.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-neutral-50 p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                billing === "monthly"
                  ? "bg-black text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Hàng tháng
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                billing === "yearly"
                  ? "bg-black text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Hàng năm
              <span className="ml-1.5 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const price =
              billing === "monthly" ? plan.priceMonthly : plan.priceYearly;
            const isCustom = price === null;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                  plan.featured
                    ? "border-emerald-200 bg-gradient-to-b from-emerald-50/60 to-white shadow-lg shadow-emerald-100/50 ring-1 ring-emerald-200"
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan name & description */}
                <div className={plan.badge ? "mt-2" : ""}>
                  <h3 className="text-xl font-bold text-neutral-900">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-6 mb-6">
                  {isCustom ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-neutral-900">
                        Liên hệ
                      </span>
                    </div>
                  ) : price === 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-neutral-900">
                        0đ
                      </span>
                      <span className="text-sm text-neutral-400">/mãi mãi</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-neutral-900">
                        {formatPrice(price)}đ
                      </span>
                      <span className="text-sm text-neutral-400">
                        /{billing === "monthly" ? "tháng" : "năm"}
                      </span>
                    </div>
                  )}
                  {billing === "yearly" && !isCustom && price !== 0 && (
                    <p className="mt-1 text-xs text-emerald-600 font-medium">
                      Tiết kiệm {formatPrice(plan.priceMonthly! * 12 - plan.priceYearly!)}đ
                      so với thanh toán hàng tháng
                    </p>
                  )}
                </div>

                {/* CTA */}
                <a
                  href="#dang-ky"
                  className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 ${
                    plan.featured
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-200/50 hover:shadow-lg hover:shadow-emerald-200/70"
                      : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400"
                  }`}
                >
                  {plan.cta}
                </a>

                {/* Divider */}
                <div className="my-6 h-px bg-neutral-200" />

                {/* Features */}
                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3">
                      {feature.included ? (
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                          <CheckIcon className="h-3 w-3 text-emerald-600" />
                        </span>
                      ) : (
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                          <XIcon className="h-3 w-3 text-neutral-400" />
                        </span>
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-neutral-700"
                            : "text-neutral-400"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom trust bar */}
        <div className="mt-12 rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
          <div className={`grid gap-6 text-center ${isMobile ? "grid-cols-1" : "grid-cols-4"}`}>
            {[
              {
                icon: (
                  <svg className="mx-auto h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Bảo mật SSL",
                desc: "Dữ liệu được mã hoá 256-bit",
              },
              {
                icon: (
                  <svg className="mx-auto h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
                title: "Không thẻ tín dụng",
                desc: "Dùng thử không cần thanh toán",
              },
              {
                icon: (
                  <svg className="mx-auto h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
                title: "Huỷ bất cứ lúc nào",
                desc: "Không ràng buộc hợp đồng",
              },
              {
                icon: (
                  <svg className="mx-auto h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: "Hỗ trợ nhanh chóng",
                desc: "Đội ngũ luôn sẵn sàng 24/7",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-2">
                {icon}
                <p className="text-sm font-semibold text-neutral-900">{title}</p>
                <p className="text-xs text-neutral-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
