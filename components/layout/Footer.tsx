import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  "Sản phẩm": [
    { name: "Tính năng", href: "#tinh-nang" },
    { name: "Xếp ca thông minh", href: "#ai-scheduling" },
    { name: "Chấm công", href: "#cham-cong" },
    { name: "Báo cáo", href: "#bao-cao" },
  ],
  "Công ty": [
    { name: "Về chúng tôi", href: "#ve-chung-toi" },
    { name: "Blog", href: "#blog" },
    { name: "Đội ngũ", href: "#doi-ngu" },
  ],
  "Hỗ trợ": [
    { name: "Vấn đề gặp phải", href: "#van-de" },
    { name: "Liên hệ", href: "#lien-he" },
    { name: "Chính sách bảo mật", href: "#bao-mat" },
    { name: "Điều khoản sử dụng", href: "#dieu-khoan" },
  ],
};

const industries = ["F&B", "Bán lẻ", "Dịch vụ", "Chuỗi cửa hàng"];

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-extrabold tracking-tight text-black dark:text-white">
                wokki
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              Nền tảng quản lý nhân sự và xếp ca làm việc thông minh dành cho
              doanh nghiệp F&B, bán lẻ và dịch vụ tại Việt Nam.
            </p>
            {/* Industry tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {industries.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* CTA */}
            <div className="mt-8">
              <Link
                href="#trai-nghiem"
                className="inline-flex items-center rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                Trải nghiệm ngay →
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold text-black dark:text-white">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Separator className="dark:bg-neutral-800" />

      {/* Bottom bar */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            © {new Date().getFullYear()} Wokki. All rights reserved. — Được xây
            dựng bởi{" "}
            <span className="font-medium text-neutral-600 dark:text-neutral-300">
              Wokki&apos;s Team
            </span>
          </p>
          <div className="flex items-center gap-6 text-xs text-neutral-400">
            <span>Như Phương · Thái Hòa · Minh Quang</span>
            <span>·</span>
            <span>Phương Hòa · Thành Đạt · Phú Thịnh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
