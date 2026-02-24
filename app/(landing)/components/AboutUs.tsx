"use client";

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const team = [
  {
    quote:
      "Theo dõi tiến độ dự án, đưa ra các quyết định về tính năng và chiến lược dự án. Thu thập, xử lý và phân tích dữ liệu, xây dựng báo cáo hỗ trợ doanh nghiệp đưa ra quyết định.",
    name: "Như Phương",
    designation: "CEO & Data Analyst",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3387&auto=format&fit=crop",
  },
  {
    quote:
      "Quản lý dòng tiền, lập ngân sách, quản lý thu chi và phân tích báo cáo tài chính toàn diện cho dự án.",
    name: "Thái Hòa",
    designation: "Financial Analysis Executive",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3387&auto=format&fit=crop",
  },
  {
    quote:
      "Báo cáo và lên kế hoạch cho các chiến dịch tiếp thị, phân phối sản phẩm và phát triển thị trường.",
    name: "Minh Quang",
    designation: "Chief Sales & Marketing Director",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop",
  },
  {
    quote:
      "Dẫn dắt kỹ thuật, thiết kế kiến trúc hệ thống và phát triển các tính năng cốt lõi của nền tảng Wokki.",
    name: "Phương Hòa",
    designation: "Tech Lead & Software Developer",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
  },
  {
    quote:
      "Phát triển phần mềm và thiết kế hạ tầng hệ thống, đảm bảo hiệu suất và độ ổn định của nền tảng.",
    name: "Thành Đạt",
    designation: "Software Developer & System Engineer",
    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop",
  },
  {
    quote:
      "Tham gia phát triển các tính năng sản phẩm, xây dựng giao diện người dùng và tối ưu trải nghiệm.",
    name: "Phú Thịnh",
    designation: "Software Developer",
    src: "/phuthinh.png",
  },
];

export default function AboutUs() {
  return (
    <section id="ve-chung-toi" className="w-full bg-white py-16 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-500">
            Đội ngũ
          </span>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">
            Những người xây dựng{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Wokki
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-500">
            Đội ngũ trẻ, đam mê và đa dạng — cùng nhau giải quyết bài toán quản lý ca làm việc cho ngành F&B và bán lẻ Việt Nam.
          </p>
        </div>
        <AnimatedTestimonials testimonials={team} autoplay />
      </div>
    </section>
  );
}
  
