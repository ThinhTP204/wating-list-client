"use client";

import { useState } from "react";
import { useRegister } from "@/hooks/useRegister";
import { useRegisterDialog } from "@/hooks/useRegisterDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type ContactType = "email" | "phone";

export default function RegisterDialog() {
  const { isOpen, close } = useRegisterDialog();
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-neutral-200 bg-white sm:rounded-2xl">
        <DialogTitle className="sr-only">Đăng ký trải nghiệm Wokki</DialogTitle>
        {/* Header gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-cyan-400" />

        <div className="px-6 pb-6 pt-2">
          {/* Title */}
          <div className="mb-5 text-center">
            <h3 className="text-xl font-bold text-neutral-900">
              Trải nghiệm{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Wokki
              </span>
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Đăng ký để truy cập sớm — hoàn toàn miễn phí.
            </p>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
                🎉
              </div>
              <p className="text-xl font-bold text-neutral-900">
                Đăng ký thành công!
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Chúng tôi sẽ liên hệ bạn sớm nhất có thể. Cảm ơn bạn đã tin
                tưởng Wokki!
              </p>
              <Button
                onClick={close}
                className="mt-5 bg-black text-white font-semibold hover:bg-neutral-800"
              >
                Đóng
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Toggle */}
              <div>
                <Label className="mb-2 block text-sm font-medium text-neutral-700">
                  Liên hệ qua
                </Label>
                <div className="flex rounded-xl border border-neutral-200 bg-neutral-50 p-1">
                  <button
                    type="button"
                    onClick={() => setContactType("email")}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${contactType === "email"
                      ? "bg-black text-white shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700"
                      }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactType("phone")}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${contactType === "phone"
                      ? "bg-black text-white shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700"
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
                    htmlFor="dialog-email"
                    className="mb-2.5 block text-sm font-medium text-neutral-700"
                  >
                    Email{" "}
                    <span className="font-normal text-red-500">*</span>

                  </Label>
                  <Input
                    id="dialog-email"
                    type="email"
                    placeholder="ban@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-neutral-200 bg-neutral-50 focus:bg-white"
                  />
                </div>
              ) : (
                <div>
                  <Label
                    htmlFor="dialog-phone"
                    className="mb-2.5 block text-sm font-medium text-neutral-700"
                  >
                    Số điện thoại{" "}
                    <span className="font-normal text-red-500">*</span>

                  </Label>
                  <Input
                    id="dialog-phone"
                    type="tel"
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="border-neutral-200 bg-neutral-50 focus:bg-white"
                  />
                </div>
              )}

              {/* Full name */}
              <div>
                <Label
                  htmlFor="dialog-full_name"
                  className="mb-2.5 block text-sm font-medium text-neutral-700"
                >
                  Họ và tên{" "}
                  <span className="font-normal text-red-500">*</span>

                </Label>
                <Input
                  id="dialog-full_name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="border-neutral-200 bg-neutral-50 focus:bg-white"
                />
              </div>

              {/* Referral */}
              <div>
                <Label className="mb-2.5 block text-sm font-medium text-neutral-700">
                  Người giới thiệu{" "}
                  <span className="font-normal text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
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
                        onClick={() => setReferralCode(selected ? "" : name)}
                        className={`group relative flex items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-all duration-200 ${selected
                          ? "border-emerald-300 bg-emerald-50 shadow-sm ring-1 ring-emerald-200"
                          : "border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 hover:bg-neutral-50"
                          }`}
                      >
                        <div
                          className={`relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 transition-all duration-200 ${selected
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
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs font-semibold truncate transition-colors duration-200 ${selected ? "text-emerald-800" : "text-neutral-800"
                              }`}
                          >
                            {name}
                          </p>
                          <p
                            className={`text-[10px] truncate transition-colors duration-200 ${selected ? "text-emerald-600" : "text-neutral-400"
                              }`}
                          >
                            {role}
                          </p>
                        </div>
                        {selected && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
                            <svg
                              className="h-2.5 w-2.5 text-white"
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
                className="w-full bg-black text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 disabled:opacity-60 disabled:translate-y-0"
              >
                {isPending ? "Đang gửi..." : "Đăng ký ngay →"}
              </Button>

              <p className="text-center text-xs text-neutral-400">
                Hoàn toàn miễn phí · Không spam · Huỷ bất kỳ lúc nào
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
