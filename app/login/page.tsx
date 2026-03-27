"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  User,
  CalendarDays,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials } from "@/lib/redux/slices/authSlice";
import { cn } from "@/lib/utils";

// ── Mock accounts ──────────────────────────────────────────────────────────────
const MOCK_ACCOUNTS = [
  {
    email: "admin@wokki.com",
    password: "12345@Abc",
    user: { id: "mock-admin-1", email: "admin@wokki.com", name: "Admin Wokki", role: "admin" },
    token: "mock-token-admin",
  },
  {
    email: "nv@wokki.com",
    password: "12345@Abc",
    user: { id: "mock-user-1", email: "nv@wokki.com", name: "Nguyễn Văn A", role: "user" },
    token: "mock-token-user",
  },
];

// ── Left panel feature cards ───────────────────────────────────────────────────
const FEATURES = [
  { icon: CalendarDays, label: "Lịch ca làm việc", desc: "Xem & quản lý ca trực real-time" },
  { icon: Clock, label: "Chấm công", desc: "Theo dõi giờ vào — ra chính xác" },
  { icon: Users, label: "Nhân sự", desc: "Hồ sơ nhân viên tập trung" },
  { icon: TrendingUp, label: "Báo cáo lương", desc: "Tính lương tự động theo ca" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

// ── Component ──────────────────────────────────────────────────────────────────
function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filled, setFilled] = useState<"admin" | "user" | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const account = MOCK_ACCOUNTS.find((a) => a.email === email && a.password === password);

    if (!account) {
      setError("Email hoặc mật khẩu không đúng.");
      setLoading(false);
      return;
    }

    setCookie("auth-token", account.token, { maxAge: 7 * 24 * 60 * 60, path: "/" });
    setCookie("user-role", account.user.role, { maxAge: 7 * 24 * 60 * 60, path: "/" });
    dispatch(setCredentials({ user: account.user, token: account.token }));

    if (account.user.role === "admin") {
      router.push(callbackUrl || "/admin?tab=dashboard");
    } else {
      router.push(callbackUrl || "/employee?tab=calendar");
    }
  };

  const fillAccount = (type: "admin" | "user") => {
    setFilled(type);
    setEmail(type === "admin" ? "admin@wokki.com" : "nv@wokki.com");
    setPassword("12345@Abc");
    setError("");
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — visual / image ──────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative flex-col overflow-hidden bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6]">
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#4C88C6]/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#102854]/60 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-2xl font-black text-white tracking-tight">wokki</span>
          </motion.div>

          {/* Tagline */}
          <motion.div
            className="mt-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Quản lý nhân sự
              <br />
              <span className="text-[#BCE8F5]">thông minh hơn.</span>
            </h1>
            <p className="mt-4 text-base text-white/60 max-w-sm leading-relaxed">
              Lên lịch ca, chấm công, tính lương — tất cả trong một nền tảng duy nhất.
            </p>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            className="grid grid-cols-2 gap-3 pb-10"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <motion.div
                key={label}
                variants={itemVariants}
                className="flex items-start gap-3 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/10 px-4 py-3.5 hover:bg-white/12 transition-colors duration-200"
              >
                <div className="mt-0.5 shrink-0 w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-white/50 mt-0.5 leading-snug">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────────── */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-6 py-10 bg-white dark:bg-neutral-950"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <span className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
            wokki
          </span>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Nền tảng quản lý nhân sự
          </p>
        </div>

        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
              Đăng nhập
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Chào mừng trở lại — nhập thông tin để tiếp tục.
            </p>
          </div>

          {/* Demo accounts */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 mb-2">
              Tài khoản demo
            </p>
            <div className="flex gap-2">
              {(["admin", "user"] as const).map((type) => {
                const isActive = filled === type;
                return (
                  <motion.button
                    key={type}
                    type="button"
                    onClick={() => fillAccount(type)}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200",
                      type === "admin"
                        ? isActive
                          ? "border-[#1D4D8F] bg-[#BCE8F5]/30 text-[#102854] dark:bg-[#1D4D8F]/20 dark:text-[#BCE8F5] dark:border-[#4C88C6]/50"
                          : "border-[#1D4D8F]/20 bg-[#BCE8F5]/10 text-[#1D4D8F] dark:text-[#BCE8F5]/70 hover:bg-[#BCE8F5]/25 dark:hover:bg-[#1D4D8F]/15"
                        : isActive
                          ? "border-neutral-400 bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-600"
                          : "border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  >
                    {isActive ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    ) : type === "admin" ? (
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <User className="w-3.5 h-3.5 shrink-0" />
                    )}
                    {type === "admin" ? "Admin" : "Nhân viên"}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
            <span className="text-xs text-neutral-400 dark:text-neutral-600">
              hoặc nhập thủ công
            </span>
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@wokki.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFilled(null);
                }}
                required
                autoComplete="email"
                className="h-10 focus-visible:ring-[#4C88C6]"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFilled(null);
                  }}
                  required
                  autoComplete="current-password"
                  className="h-10 pr-10 focus-visible:ring-[#4C88C6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-red-500 font-medium"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button type="submit" variant="brand" className="w-full h-10 mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Đang đăng nhập…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 mt-8">
            Môi trường demo — dữ liệu không có thật.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
