"use client";

import { useState } from "react";
import { useRegister } from "@/hooks/useRegister";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RocketIcon from "@/components/ui/rocket-icon";
import ShieldCheck from "@/components/ui/shield-check";
import FilledBellIcon from "@/components/ui/filled-bell-icon";

type ContactType = "email" | "phone";

const benefits = [
  {
    icon: <RocketIcon size={22} className="text-emerald-500" />,
    title: "Truy cập sớm",
    desc: "Nhận quyền dùng thử trước khi ra mắt chính thức.",
  },
  {
    icon: <ShieldCheck size={22} className="text-emerald-500" />,
    title: "Miễn phí hoàn toàn",
    desc: "Không cần thẻ tín dụng, không ràng buộc.",
  },
  {
    icon: <FilledBellIcon size={22} className="text-emerald-500" />,
    title: "Thông báo ưu tiên",
    desc: "Nhận thông tin cập nhật tính năng mới nhất.",
  },
];

export default function Register() {
  const [contactType, setContactType] = useState<ContactType>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const { mutate, isPending, isSuccess } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralCode) return;
    mutate({
      email: contactType === "email" ? email : "",
      phone_number: contactType === "phone" ? phone : "",
      full_name: fullName,
      referral_code: referralCode,
    });
  };

  return (
    <section id="dang-ky" className="w-full bg-white dark:bg-neutral-950 py-24 scroll-mt-16 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full border border-neutral-300 dark:border-neutral-700 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Danh sách chờ
          </span>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 dark:text-white md:text-4xl lg:text-5xl">
            Sẵn sàng dùng thử{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Wokki?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-neutral-500 dark:text-neutral-400">
            Đăng ký ngay hôm nay để truy cập sớm và nhận ưu đãi dành riêng cho
            những người đầu tiên.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* LEFT — Benefits */}
          <div className="flex flex-col gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
                  {b.icon}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{b.title}</p>
                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{b.desc}</p>
                </div>
              </div>
            ))}

            {/* Social proof */}
            <div className="mt-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-6">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Đã có{" "}
                <span className="font-bold text-neutral-900 dark:text-white">1,200+</span> doanh
                nghiệp đăng ký trước — tham gia ngay để không bỏ lỡ.
              </p>
              <div className="mt-4 flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop",
                  "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=40&h=40&fit=crop",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="user"
                    className="h-8 w-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-xs font-bold text-white">
                  +
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 text-3xl">
                  🎉
                </div>
                <p className="text-xl font-bold text-neutral-900 dark:text-white">
                  Đăng ký thành công!
                </p>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Chúng tôi sẽ liên hệ bạn sớm nhất có thể. Cảm ơn bạn đã tin
                  tưởng Wokki!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Toggle */}
                <div>
                  <Label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Liên hệ qua
                  </Label>
                  <div className="flex rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-1">
                    <button
                      type="button"
                      onClick={() => setContactType("email")}
                      className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${contactType === "email"
                          ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                          : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                        }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactType("phone")}
                      className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${contactType === "phone"
                          ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                          : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                        }`}
                    >
                      Số điện thoại
                    </button>
                  </div>
                </div>

                {/* Email / Phone */}
                {contactType === "email" ? (
                  <div>
                    <Label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Email{" "}
                      <span className="font-normal text-red-500">*</span>

                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ban@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-700"
                    />
                  </div>
                ) : (
                  <div>
                    <Label
                      htmlFor="phone"
                      className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Số điện thoại{" "}
                      <span className="font-normal text-red-500">*</span>

                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-700"
                    />
                  </div>
                )}

                {/* Full name */}
                <div>
                  <Label
                    htmlFor="full_name"
                    className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Họ và tên{" "}
                    <span className="font-normal text-red-500">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-700"
                  />
                </div>

                {/* Referral code */}
                <div>
                  <Label
                    htmlFor="referral_code"
                    className="mb-2.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Người giới thiệu{" "}
                    <span className="font-normal text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {([
                      { name: "Như Phương", role: "CEO", avatar: "/phuong.png" },
                      { name: "Thái Hòa", role: "Finance", avatar: "/thaihoa.png" },
                      { name: "Minh Quang", role: "Marketing", avatar: "/quang.png" },
                      { name: "Phú Thịnh", role: "Developer", avatar: "/thinh.png" },
                      { name: "Phương Hòa", role: "Tech Lead", avatar: "/phuonghoa.png" },
                      { name: "Thành Đạt", role: "Engineer", avatar: "/dat.png" },
                    ] as const).map(({ name, role, avatar }) => {
                      const selected = referralCode === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() =>
                            setReferralCode(selected ? "" : name)
                          }
                          className={`group relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${selected
                              ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950 shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-800"
                              : "border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                            }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 transition-all duration-200 ${selected
                                ? "ring-emerald-400"
                                : "ring-neutral-200 group-hover:ring-neutral-300"
                              }`}
                          >
                            <img
                              src={avatar}
                              alt={name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-semibold truncate transition-colors duration-200 ${selected ? "text-emerald-800 dark:text-emerald-300" : "text-neutral-800 dark:text-neutral-200"
                                }`}
                            >
                              {name}
                            </p>
                            <p
                              className={`text-[11px] truncate transition-colors duration-200 ${selected ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400 dark:text-neutral-500"
                                }`}
                            >
                              {role}
                            </p>
                          </div>
                          {/* Check indicator */}
                          {selected && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
                              <svg
                                className="h-3 w-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isPending || !referralCode}
                  size="lg"
                  className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-60 disabled:translate-y-0"
                >
                  {isPending ? "Đang gửi..." : "Đăng ký ngay →"}
                </Button>

                <p className="text-center text-xs text-neutral-400">
                  Hoàn toàn miễn phí · Không spam · Huỷ bất kỳ lúc nào
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
