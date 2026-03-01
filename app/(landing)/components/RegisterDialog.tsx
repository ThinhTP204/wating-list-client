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
import RocketIcon from "@/components/ui/rocket-icon";

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
      <DialogContent className="max-w-md p-0 overflow-hidden border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sm:rounded-2xl">
        <DialogTitle className="sr-only">Đăng ký trải nghiệm Wokki</DialogTitle>
        {/* Header gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-cyan-400" />

        <div className="px-6 pb-6 pt-2">
          {/* Title */}
          <div className="mb-5 text-center">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              Trải nghiệm{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Wokki
              </span>
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Đăng ký để truy cập sớm — hoàn toàn miễn phí.
            </p>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
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
              <Button
                onClick={close}
                className="mt-5 bg-black dark:bg-white text-white dark:text-black font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200"
              >
                Đóng
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name */}
              <div>
                <Label
                  htmlFor="dialog-full_name"
                  className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
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
                  className="border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-700"
                />
              </div>

              {/* Email / Phone */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {contactType === "email" ? "Email" : "Số điện thoại"}{" "}
                    <span className="font-normal text-red-500">*</span>
                  </Label>
                  <button
                    type="button"
                    onClick={() => setContactType(contactType === "email" ? "phone" : "email")}
                    className="cursor-pointer text-xs font-medium text-emerald-500 hover:text-emerald-600 transition-colors"
                  >
                    Dùng {contactType === "email" ? "SĐT" : "Email"} thay
                  </button>
                </div>
                {contactType === "email" ? (
                  <Input
                    id="dialog-email"
                    type="email"
                    placeholder="ban@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-700"
                  />
                ) : (
                  <Input
                    id="dialog-phone"
                    type="tel"
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-700"
                  />
                )}
              </div>

              {/* Referral */}
              <div>
                <Label className="mb-2.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
                        className={`cursor-pointer group relative flex items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-all duration-200 ${
                          selected
                            ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950 shadow-sm ring-1 ring-emerald-200 dark:ring-emerald-800"
                            : "border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        }`}
                      >
                        <div
                          className={`relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 transition-all duration-200 ${
                            selected ? "ring-emerald-400" : "ring-neutral-200 group-hover:ring-neutral-300"
                          }`}
                        >
                          <img src={avatar} alt={name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold truncate transition-colors duration-200 ${selected ? "text-emerald-800 dark:text-emerald-300" : "text-neutral-800 dark:text-neutral-200"}`}>
                            {name}
                          </p>
                          <p className={`text-[10px] truncate transition-colors duration-200 ${selected ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400 dark:text-neutral-500"}`}>
                            {role}
                          </p>
                        </div>
                        {selected && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
                            <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
                <RocketIcon size={18} className="mr-2" />
                {isPending ? "Đang gửi..." : "Đăng ký ngay"}
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
