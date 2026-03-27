"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  ArrowLeftRight,
  UserCheck,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  Bell,
  Zap,
  Star,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_POSTS,
  MOCK_AVAILABLE,
  MOCK_NOTIFICATIONS,
  ShiftSwapPost,
  AvailableEmployee,
  AppNotification,
  STATUS_META,
  SHIFT_TYPE_META,
  MIN_DAYS_AHEAD,
} from "@/app/(admin)/admin/components/request/components/types";
import ShiftSwapCard from "@/app/(admin)/admin/components/request/components/ShiftSwapCard";
import AvailableCard from "@/app/(admin)/admin/components/request/components/AvailableCard";
import ShiftSwapDialog from "@/app/(admin)/admin/components/request/components/ShiftSwapDialog";
import AvailableDialog from "@/app/(admin)/admin/components/request/components/AvailableDialog";

// ── Mock current user ─────────────────────────────────────────────────────────
const ME = {
  name: "Hoàng Thị Lan",
  position: "Nhân viên bán hàng",
  department: "Bán hàng",
  branch: "Chi nhánh Quận 1",
  initial: "L",
  karma: 90,
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Chào buổi sáng";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

function getMinSwapDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + MIN_DAYS_AHEAD);
  d.setHours(0, 0, 0, 0);
  return d;
}

function timeAgo(isoDate: string): string {
  const diff = (Date.now() - new Date(isoDate).getTime()) / 60000;
  if (diff < 60) return `${Math.floor(diff)}p trước`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h trước`;
  return `${Math.floor(diff / 1440)}d trước`;
}

type Tab = "swap" | "avail";
const TABS: Array<{ id: Tab; label: string; Icon: React.ElementType }> = [
  { id: "swap", label: "Cần đổi ca", Icon: ArrowLeftRight },
  { id: "avail", label: "Sẵn sàng nhận", Icon: UserCheck },
];

const NOTIF_TYPE_META: Record<
  AppNotification["type"],
  { icon: React.ElementType; color: string; dot: string }
> = {
  match_found: { icon: Zap, color: "text-[#1D4D8F] dark:text-blue-300", dot: "bg-[#4C88C6]" },
  new_post: {
    icon: ArrowLeftRight,
    color: "text-slate-500 dark:text-neutral-400",
    dot: "bg-slate-400",
  },
  shift_accepted: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  shift_expired: { icon: Bell, color: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
};

// Karma ring component
function KarmaScoreRing({ score }: { score: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="80" height="80" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="5"
          className="dark:stroke-neutral-700"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#4C88C6"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="relative z-10 text-center">
        <p className="text-xl font-black text-[#102854] dark:text-white leading-none">{score}</p>
        <p className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wide">
          karma
        </p>
      </div>
    </div>
  );
}

export default function UserRequestPage() {
  const [posts, setPosts] = useState<ShiftSwapPost[]>(MOCK_POSTS);
  const [available, setAvailable] = useState<AvailableEmployee[]>(MOCK_AVAILABLE);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("swap");
  const [swapOpen, setSwapOpen] = useState(false);
  const [availOpen, setAvailOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const minDate = getMinSwapDate();
  const mySwapPost = posts.find((p) => p.isOwn);
  const myAvailPost = available.find((e) => e.isOwn);
  const hasMatch = mySwapPost?.status === "matched";
  const unreadCount = notifications.filter((n) => !n.read).length;

  const marketSwap = useMemo(
    () =>
      posts.filter((p) => {
        if (p.isOwn || p.status === "expired") return false;
        if (p.status === "open" && new Date(p.myShift.date) < minDate) return false;
        if (search) {
          const q = search.toLowerCase();
          return p.authorName.toLowerCase().includes(q) || p.wantShift.toLowerCase().includes(q);
        }
        return true;
      }),
    [posts, search]
  );

  const marketAvail = useMemo(
    () =>
      available.filter((e) => {
        if (e.isOwn) return false;
        if (new Date(e.availableDate) < new Date(new Date().toDateString())) return false;
        if (search) {
          const q = search.toLowerCase();
          return e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q);
        }
        return true;
      }),
    [available, search]
  );

  const tabCount = { swap: marketSwap.length, avail: marketAvail.length };

  const handleSaveSwap = (p: ShiftSwapPost) => setPosts((prev) => [p, ...prev]);
  const handleAccept = (p: ShiftSwapPost) =>
    setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: "matched" as const } : x)));
  const handleCancelSwap = (p: ShiftSwapPost) =>
    setPosts((prev) => prev.filter((x) => x.id !== p.id));
  const handleSaveAvail = (e: AvailableEmployee) => setAvailable((prev) => [e, ...prev]);
  const handleCancelAvail = (e: AvailableEmployee) =>
    setAvailable((prev) => prev.filter((x) => x.id !== e.id));
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* ── Personal Hero ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-neutral-800"
      >
        <div className="px-6 pt-5 pb-4 space-y-4">
          {/* User identity + karma */}
          <div className="flex items-center gap-4">
            <KarmaScoreRing score={ME.karma} />

            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-400 dark:text-neutral-500 mb-0.5">
                {getGreeting()},
              </p>
              <p className="text-xl font-black text-slate-800 dark:text-white leading-tight">
                {ME.name}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-neutral-400">
                  <span>{ME.department}</span>
                  <span className="text-slate-300 dark:text-neutral-600">·</span>
                  <MapPin className="w-3 h-3" />
                  <span>{ME.branch}</span>
                </div>
              </div>
              {/* Karma tier */}
              <div className="flex items-center gap-1.5 mt-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3.5 h-3.5",
                      i < Math.round(ME.karma / 20)
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-200 dark:text-neutral-700 fill-slate-200 dark:fill-neutral-700"
                    )}
                  />
                ))}
                <span className="text-xs text-slate-400 dark:text-neutral-500 ml-1">
                  {ME.karma >= 85 ? "Tin cậy cao" : ME.karma >= 65 ? "Tốt" : "Đang xây dựng"}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              {/* Match badge */}
              <AnimatePresence>
                {hasMatch && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl px-2.5 py-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                      Đã khớp!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Notification bell */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotifOpen((v) => !v)}
                className="relative flex items-center gap-1.5 bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 rounded-xl px-3 py-1.5 transition-colors"
              >
                <Bell className="w-4 h-4 text-slate-600 dark:text-neutral-300" />
                <span className="text-sm font-medium text-slate-600 dark:text-neutral-300">
                  Thông báo
                </span>
                {unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
                    notifOpen && "rotate-180"
                  )}
                />
              </motion.button>
            </div>
          </div>

          {/* My active posts */}
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {mySwapPost ? (
                <motion.div
                  key="my-swap"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2.5 bg-[#102854]/5 dark:bg-blue-900/20 border border-[#4C88C6]/20 dark:border-blue-800/40 rounded-xl px-3 py-2"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[#4C88C6] shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-semibold">
                      Đổi ca của tôi
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">
                      {SHIFT_TYPE_META[mySwapPost.myShift.type].label}
                      <span className="text-slate-400 font-normal"> · </span>
                      {mySwapPost.myShift.timeLabel}
                    </p>
                  </div>
                  <Badge
                    className={cn("border text-xs shrink-0", STATUS_META[mySwapPost.status].cls)}
                  >
                    {STATUS_META[mySwapPost.status].label}
                  </Badge>
                  <button
                    onClick={() => handleCancelSwap(mySwapPost)}
                    className="w-5 h-5 rounded-full bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors shrink-0"
                  >
                    <X className="w-3 h-3 text-slate-500 dark:text-neutral-400" />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="add-swap"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSwapOpen(true)}
                  className="flex items-center gap-2 border border-dashed border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-neutral-800/60 transition-colors text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Đăng đổi ca</span>
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence mode="popLayout">
              {myAvailPost ? (
                <motion.div
                  key="my-avail"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl px-3 py-2"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 dark:text-neutral-500 uppercase tracking-widest font-semibold">
                      Sẵn sàng nhận
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(myAvailPost.availableDate).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                      <span className="text-slate-400 font-normal">
                        {" "}
                        · {myAvailPost.availableShifts.length} ca
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancelAvail(myAvailPost)}
                    className="w-5 h-5 rounded-full bg-white/60 dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors shrink-0"
                  >
                    <X className="w-3 h-3 text-slate-500 dark:text-neutral-400" />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="add-avail"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setAvailOpen(true)}
                  className="flex items-center gap-2 border border-dashed border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 hover:bg-slate-50 dark:hover:bg-neutral-800/60 transition-colors text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Đăng sẵn sàng</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Notification panel ── */}
        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden border-t border-slate-100 dark:border-neutral-800"
            >
              <div className="px-6 py-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-700 dark:text-white">
                    Thông báo của bạn
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-[#4C88C6] hover:underline"
                    >
                      Đọc tất cả
                    </button>
                  )}
                </div>
                {notifications.map((n) => {
                  const meta = NOTIF_TYPE_META[n.type];
                  const Icon = meta.icon;
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        "flex items-start gap-2.5 rounded-xl px-3 py-2.5 border",
                        n.read
                          ? "border-slate-100 dark:border-neutral-800 bg-transparent"
                          : "border-[#BCE8F5] dark:border-blue-900/50 bg-[#BCE8F5]/20 dark:bg-blue-900/10"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 shrink-0 mt-0.5", meta.color)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs text-slate-300 dark:text-neutral-600">
                          {timeAgo(n.createdAt)}
                        </span>
                        {!n.read && <div className={cn("w-1.5 h-1.5 rounded-full", meta.dot)} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Marketplace ──────────────────────────────────────────────────── */}
      <div className="flex-1 px-6 pt-5 pb-6 space-y-4">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm đồng nghiệp, bộ phận..."
            className="pl-9 text-sm bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-700 focus-visible:ring-[#4C88C6]"
          />
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-1 bg-slate-100 dark:bg-neutral-900/80 p-1 rounded-xl"
        >
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C88C6]",
                  isActive
                    ? "bg-white dark:bg-neutral-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-neutral-300"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
                <span
                  className={cn(
                    "text-xs font-bold px-1.5 py-0.5 rounded-full transition-colors",
                    isActive
                      ? "bg-[#BCE8F5]/60 dark:bg-blue-900/40 text-[#1D4D8F] dark:text-blue-400"
                      : "bg-slate-200 dark:bg-neutral-700 text-slate-500 dark:text-neutral-400"
                  )}
                >
                  {tabCount[id]}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Smart match hint */}
        <AnimatePresence>
          {activeTab === "swap" && marketSwap.some((p) => (p.matchScore ?? 0) >= 80) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 bg-[#BCE8F5]/30 dark:bg-blue-900/20 border border-[#4C88C6]/20 dark:border-blue-800/40 rounded-xl px-3 py-2"
            >
              <Zap className="w-4 h-4 text-[#4C88C6] shrink-0" />
              <p className="text-sm text-[#1D4D8F] dark:text-blue-300">
                Có <strong>{marketSwap.filter((p) => (p.matchScore ?? 0) >= 80).length}</strong> yêu
                cầu phù hợp cao (&ge;80%) với nhu cầu của bạn
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card feed */}
        <AnimatePresence mode="popLayout">
          {activeTab === "swap" && (
            <motion.div
              key="tab-swap"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {marketSwap.length === 0 ? (
                <div className="flex flex-col items-center py-14 gap-3 text-slate-400 dark:text-neutral-500 rounded-2xl border border-dashed border-slate-200 dark:border-neutral-700">
                  <ArrowLeftRight className="w-8 h-8 opacity-25" />
                  <p className="text-sm">Không có yêu cầu đổi ca nào</p>
                </div>
              ) : (
                marketSwap.map((post, i) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <ShiftSwapCard
                      post={post}
                      onContact={(p) => console.log("contact", p.authorName)}
                      onAccept={handleAccept}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "avail" && (
            <motion.div
              key="tab-avail"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {marketAvail.length === 0 ? (
                <div className="flex flex-col items-center py-14 gap-3 text-slate-400 dark:text-neutral-500 rounded-2xl border border-dashed border-slate-200 dark:border-neutral-700">
                  <UserCheck className="w-8 h-8 opacity-25" />
                  <p className="text-sm">Chưa có ai đăng sẵn sàng</p>
                </div>
              ) : (
                marketAvail.map((emp, i) => (
                  <motion.div
                    key={emp.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <AvailableCard
                      employee={emp}
                      onContact={(e) => console.log("contact", e.name)}
                      onInvite={(e) => console.log("invite", e.name)}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ShiftSwapDialog open={swapOpen} onClose={() => setSwapOpen(false)} onSave={handleSaveSwap} />
      <AvailableDialog
        open={availOpen}
        onClose={() => setAvailOpen(false)}
        onSave={handleSaveAvail}
      />
    </div>
  );
}
