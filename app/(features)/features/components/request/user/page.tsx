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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  MOCK_POSTS,
  MOCK_AVAILABLE,
  ShiftSwapPost,
  AvailableEmployee,
  STATUS_META,
  SHIFT_TYPE_META,
  MIN_DAYS_AHEAD,
} from "../components/types";
import ShiftSwapCard from "../components/ShiftSwapCard";
import AvailableCard from "../components/AvailableCard";
import ShiftSwapDialog from "../components/ShiftSwapDialog";
import AvailableDialog from "../components/AvailableDialog";

// ── Mock current user ──────────────────────────────────────────────────────
const ME = {
  name: "Hoàng Thị Lan",
  position: "Nhân viên bán hàng",
  department: "Bán hàng",
  branch: "Chi nhánh Quận 1",
  initial: "L",
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

type Tab = "swap" | "avail";

const TABS: Array<{ id: Tab; label: string; Icon: React.ElementType }> = [
  { id: "swap", label: "Cần đổi ca", Icon: ArrowLeftRight },
  { id: "avail", label: "Sẵn sàng nhận", Icon: UserCheck },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function UserRequestPage() {
  const [posts, setPosts] = useState<ShiftSwapPost[]>(MOCK_POSTS);
  const [available, setAvailable] = useState<AvailableEmployee[]>(MOCK_AVAILABLE);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("swap");
  const [swapOpen, setSwapOpen] = useState(false);
  const [availOpen, setAvailOpen] = useState(false);

  const minDate = getMinSwapDate();
  const mySwapPost = posts.find((p) => p.isOwn);
  const myAvailPost = available.find((e) => e.isOwn);
  const hasMatch = mySwapPost?.status === "matched";

  // Marketplace — exclude own posts
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

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {/* ── Personal Hero ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="relative bg-gradient-to-br from-[#140830] via-[#2d1666] to-[#5028a8] overflow-hidden"
      >
        {/* Decorative shapes */}
        <div className="absolute -top-14 -right-14 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-8 right-40 w-20 h-20 rounded-full bg-purple-400/10 pointer-events-none" />
        <div className="absolute -bottom-8 left-1/3 w-36 h-36 rounded-full bg-indigo-400/10 pointer-events-none" />

        <div className="relative px-6 pt-6 pb-5 space-y-4">
          {/* User identity row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-300 via-fuchsia-400 to-indigo-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-purple-900/40">
                  {ME.initial}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#140830]" />
              </div>
              <div>
                <p className="text-white/50 text-xs mb-0.5">{getGreeting()},</p>
                <p className="text-white font-bold text-lg leading-tight">{ME.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-purple-200/50 text-[11px]">{ME.department}</span>
                  <span className="text-white/20 text-[11px]">·</span>
                  <span className="text-purple-200/50 text-[11px] flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    {ME.branch}
                  </span>
                </div>
              </div>
            </div>

            {/* Match badge */}
            <AnimatePresence>
              {hasMatch && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 rounded-xl px-2.5 py-1.5 shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
                  <span className="text-xs text-blue-200 font-semibold">Ca đã khớp!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* My active posts */}
          <div className="flex flex-wrap gap-2">
            {/* My swap post chip */}
            <AnimatePresence mode="popLayout">
              {mySwapPost ? (
                <motion.div
                  key="my-swap"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2.5 bg-white/10 border border-white/15 rounded-xl px-3 py-2"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-purple-200/60 shrink-0" />
                  <div>
                    <p className="text-[9px] text-white/45 uppercase tracking-widest font-semibold">
                      Đổi ca của tôi
                    </p>
                    <p className="text-xs font-semibold text-white leading-tight">
                      {SHIFT_TYPE_META[mySwapPost.myShift.type].label}
                      <span className="text-white/60 font-normal"> · </span>
                      {mySwapPost.myShift.timeLabel}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      "border-transparent text-[10px] shrink-0",
                      STATUS_META[mySwapPost.status].cls
                    )}
                  >
                    {STATUS_META[mySwapPost.status].label}
                  </Badge>
                  <button
                    onClick={() => handleCancelSwap(mySwapPost)}
                    className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0"
                  >
                    <X className="w-3 h-3 text-white/60" />
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
                  className="flex items-center gap-2 bg-transparent border border-dashed border-white/25 rounded-xl px-3 py-2 hover:bg-white/10 transition-colors text-white/55 hover:text-white/80"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-xs">Đăng đổi ca</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* My availability chip */}
            <AnimatePresence mode="popLayout">
              {myAvailPost ? (
                <motion.div
                  key="my-avail"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2.5 bg-white/10 border border-white/15 rounded-xl px-3 py-2"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-300/70 shrink-0" />
                  <div>
                    <p className="text-[9px] text-white/45 uppercase tracking-widest font-semibold">
                      Sẵn sàng nhận
                    </p>
                    <p className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-white/50" />
                      {new Date(myAvailPost.availableDate).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                      <span className="text-white/60 font-normal">
                        {" "}
                        · {myAvailPost.availableShifts.length} ca
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancelAvail(myAvailPost)}
                    className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0"
                  >
                    <X className="w-3 h-3 text-white/60" />
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
                  className="flex items-center gap-2 bg-transparent border border-dashed border-white/25 rounded-xl px-3 py-2 hover:bg-white/10 transition-colors text-white/55 hover:text-white/80"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-xs">Đăng sẵn sàng</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── Marketplace ───────────────────────────────────────────────────── */}
      <div className="flex-1 px-6 pt-5 pb-6 space-y-4">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm đồng nghiệp, bộ phận..."
            className="pl-9 text-sm focus-visible:ring-[#8f58e4]"
          />
        </motion.div>

        {/* Pill tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900/80 p-1 rounded-xl"
        >
          {TABS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8f58e4]",
                  isActive
                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                )}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{label}</span>
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors",
                    isActive
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                      : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
                  )}
                >
                  {tabCount[id]}
                </span>
              </button>
            );
          })}
        </motion.div>

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
                <div className="flex flex-col items-center py-14 gap-3 text-neutral-400 dark:text-neutral-500 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
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
                <div className="flex flex-col items-center py-14 gap-3 text-neutral-400 dark:text-neutral-500 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800">
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
