"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  ArrowLeftRight,
  CheckCircle2,
  UserCheck,
  SlidersHorizontal,
  Bell,
  Zap,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ShiftSwapPost,
  AvailableEmployee,
  AppNotification,
  MOCK_POSTS,
  MOCK_AVAILABLE,
  MOCK_NOTIFICATIONS,
  MIN_DAYS_AHEAD,
} from "./components/types";
import ShiftSwapCard from "./components/ShiftSwapCard";
import AvailableCard from "./components/AvailableCard";
import ShiftSwapDialog from "./components/ShiftSwapDialog";
import AvailableDialog from "./components/AvailableDialog";
import { cn } from "@/lib/utils";
import ShiftHistoryPanel from "./components/ShiftHistoryPanel";

const BRANCHES = [
  "all",
  "Chi nhánh Quận 1",
  "Chi nhánh Quận 3",
  "Chi nhánh Quận 7",
  "Trụ sở chính",
];

function getMinSwapDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + MIN_DAYS_AHEAD);
  d.setHours(0, 0, 0, 0);
  return d;
}

function timeAgo(isoDate: string): string {
  const diff = (Date.now() - new Date(isoDate).getTime()) / 60000;
  if (diff < 60) return `${Math.floor(diff)}p`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h`;
  return `${Math.floor(diff / 1440)}d`;
}

const NOTIF_TYPE_META: Record<
  AppNotification["type"],
  { icon: React.ElementType; color: string; bg: string }
> = {
  match_found:    { icon: Zap,           color: "text-[#1D4D8F] dark:text-blue-300",    bg: "bg-[#BCE8F5]/40 dark:bg-blue-900/30" },
  new_post:       { icon: ArrowLeftRight, color: "text-slate-600 dark:text-neutral-300", bg: "bg-slate-100 dark:bg-neutral-800" },
  shift_accepted: { icon: CheckCircle2,   color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
  shift_expired:  { icon: Bell,           color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-900/30" },
};

function EmptyPanel({
  icon: Icon,
  title,
  sub,
}: {
  icon: React.ElementType;
  title: string;
  sub: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-14 gap-3 rounded-2xl border border-dashed border-slate-200 dark:border-neutral-700 bg-slate-50/60 dark:bg-neutral-900/20"
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-400 dark:text-neutral-500" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">{title}</p>
      <p className="text-xs text-slate-400 dark:text-neutral-500">{sub}</p>
    </motion.div>
  );
}

export default function Page() {
  const [posts, setPosts]         = useState<ShiftSwapPost[]>(MOCK_POSTS);
  const [available, setAvailable] = useState<AvailableEmployee[]>(MOCK_AVAILABLE);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [search, setSearch]       = useState("");
  const [branchFilter, setBranch] = useState("all");
  const [swapOpen, setSwapOpen]   = useState(false);
  const [availOpen, setAvailOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const minDate = getMinSwapDate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredSwap = useMemo(
    () =>
      posts.filter((p) => {
        if (p.status === "expired") return false;
        if (p.status === "open" && new Date(p.myShift.date) < minDate) return false;
        if (branchFilter !== "all" && p.branch !== branchFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            p.authorName.toLowerCase().includes(q) ||
            p.wantShift.toLowerCase().includes(q) ||
            p.authorDepartment.toLowerCase().includes(q)
          );
        }
        return true;
      }),
    [posts, search, branchFilter]
  );

  const filteredAvail = useMemo(
    () =>
      available.filter((e) => {
        if (new Date(e.availableDate) < new Date(new Date().toDateString())) return false;
        if (branchFilter !== "all" && e.branch !== branchFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            e.name.toLowerCase().includes(q) ||
            e.department.toLowerCase().includes(q)
          );
        }
        return true;
      }),
    [available, search, branchFilter]
  );

  const openSwapCount  = posts.filter((p) => p.status === "open").length;
  const matchedCount   = posts.filter((p) => p.status === "matched").length;
  const totalActive    = openSwapCount + available.length;

  // Top smart matches (highest matchScore, open status)
  const topMatches = useMemo(() =>
    [...posts]
      .filter((p) => p.status === "open" && p.matchScore !== undefined)
      .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
      .slice(0, 3),
    [posts]
  );

  const handleSaveSwap    = (p: ShiftSwapPost)     => setPosts((prev) => [p, ...prev]);
  const handleAcceptSwap  = (p: ShiftSwapPost)     => setPosts((prev) => prev.map((x) => x.id === p.id ? { ...x, status: "matched" as const } : x));
  const handleCancelSwap  = (p: ShiftSwapPost)     => setPosts((prev) => prev.filter((x) => x.id !== p.id));
  const handleSaveAvail   = (e: AvailableEmployee) => setAvailable((prev) => [e, ...prev]);
  const handleCancelAvail = (e: AvailableEmployee) => setAvailable((prev) => prev.filter((x) => x.id !== e.id));
  const markAllRead       = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-57px)] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="sticky top-0 z-20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-neutral-800"
      >
        <div className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
                {totalActive} đang hoạt động
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              Smart Matching
            </h1>
          </div>

          {/* Stats pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-neutral-800 rounded-xl px-3 py-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#4C88C6]" />
              <span className="text-sm font-bold text-slate-700 dark:text-white">{openSwapCount}</span>
              <span className="text-sm text-slate-400 dark:text-neutral-500">đổi ca</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-neutral-800 rounded-xl px-3 py-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-sm font-bold text-slate-700 dark:text-white">{available.length}</span>
              <span className="text-sm text-slate-400 dark:text-neutral-500">sẵn sàng</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-neutral-800 rounded-xl px-3 py-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1D4D8F] dark:text-blue-400" />
              <span className="text-sm font-bold text-slate-700 dark:text-white">{matchedCount}</span>
              <span className="text-sm text-slate-400 dark:text-neutral-500">đã khớp</span>
            </div>

            {/* Notification bell */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotifOpen((v) => !v)}
              className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <Bell className="w-4 h-4 text-slate-600 dark:text-neutral-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {/* CTA */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="sm"
                onClick={() => setAvailOpen(true)}
                variant="outline"
                className="gap-1.5 text-sm border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-300"
              >
                <Plus className="w-3.5 h-3.5" />
                Sẵn sàng
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="sm"
                onClick={() => setSwapOpen(true)}
                className="gap-1.5 text-sm bg-gradient-to-r from-[#102854] via-[#1D4D8F] to-[#4C88C6] border-0 text-white hover:shadow-md hover:shadow-[#4C88C6]/25"
              >
                <Plus className="w-3.5 h-3.5" />
                Đổi ca
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Notification drawer ── */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
          >
            <div className="px-6 py-4 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-800 dark:text-white">Thông báo</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#4C88C6] hover:underline"
                  >
                    Đánh dấu đã đọc
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
                      "flex items-start gap-3 rounded-xl px-3 py-2.5 border transition-colors",
                      n.read
                        ? "border-slate-100 dark:border-neutral-800 bg-transparent"
                        : "border-[#BCE8F5] dark:border-blue-900/50 bg-[#BCE8F5]/20 dark:bg-blue-900/10"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", meta.bg)}>
                      <Icon className={cn("w-4 h-4", meta.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{n.title}</p>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                    <span className="text-xs text-slate-300 dark:text-neutral-600 shrink-0 mt-0.5">
                      {timeAgo(n.createdAt)}
                    </span>
                    {!n.read && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4C88C6] shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6 px-6 pt-5 pb-6">

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 space-y-5">

        {/* ── Top Smart Matches ── */}
        {topMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-[#102854]/5 via-[#1D4D8F]/5 to-[#4C88C6]/5 dark:from-blue-900/20 dark:via-blue-900/15 dark:to-blue-900/10 border border-[#4C88C6]/20 dark:border-blue-800/40 rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#1D4D8F] to-[#4C88C6] flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-[#102854] dark:text-blue-200">Phù hợp cao nhất</span>
              <Badge className="bg-[#BCE8F5]/60 dark:bg-blue-900/40 text-[#1D4D8F] dark:text-blue-300 border-transparent text-xs">
                AI Match
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {topMatches.map((p) => (
                <div
                  key={p.id}
                  className="bg-white/80 dark:bg-neutral-900/60 backdrop-blur-sm rounded-xl border border-slate-200/80 dark:border-neutral-700 px-3 py-2.5 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800 dark:text-white truncate">{p.authorName}</span>
                    <span className="text-xs font-black text-[#4C88C6] shrink-0">{p.matchScore}%</span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-neutral-500 truncate">{p.wantShift}</p>
                  <div className="h-1 rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#1D4D8F] to-[#4C88C6]"
                      initial={{ width: 0 }}
                      animate={{ width: `${p.matchScore}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Filter bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, bộ phận..."
              className="pl-9 text-sm bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-700 focus-visible:ring-[#4C88C6]"
            />
          </div>
          <Select value={branchFilter} onValueChange={setBranch}>
            <SelectTrigger className="sm:min-w-[200px] text-sm gap-2 bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-700 focus:ring-[#4C88C6]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BRANCHES.map((b) => (
                <SelectItem key={b} value={b}>
                  {b === "all" ? "Tất cả chi nhánh" : b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* ── Split layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left: Sẵn sàng nhận ca */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                <span className="text-sm font-bold text-slate-800 dark:text-white">Sẵn sàng nhận ca</span>
                <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs">
                  {filteredAvail.length}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-neutral-500">
                <Users className="w-3.5 h-3.5" />
                Avg karma: {Math.round(available.reduce((s, e) => s + e.karma, 0) / (available.length || 1))}
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredAvail.length === 0 ? (
                <EmptyPanel
                  key="empty-avail"
                  icon={UserCheck}
                  title="Chưa có ai đăng sẵn sàng"
                  sub='Nhấn "Sẵn sàng" để bắt đầu'
                />
              ) : (
                <motion.div key="avail-grid" className="grid grid-cols-1 gap-4">
                  {filteredAvail.map((emp, i) => (
                    <motion.div
                      key={emp.id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <AvailableCard
                        employee={emp}
                        onContact={(e) => console.log("contact", e.name)}
                        onInvite={(e) => console.log("invite", e.name)}
                        onCancel={handleCancelAvail}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Cần đổi ca */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#1D4D8F] to-[#4C88C6]" />
                <span className="text-sm font-bold text-slate-800 dark:text-white">Cần đổi ca</span>
                <Badge className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-xs">
                  {filteredSwap.length}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-neutral-500">
                <Zap className="w-3.5 h-3.5" />
                Cần đổi trước {MIN_DAYS_AHEAD}+ ngày
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredSwap.length === 0 ? (
                <EmptyPanel
                  key="empty-swap"
                  icon={ArrowLeftRight}
                  title="Không có yêu cầu đổi ca"
                  sub='Nhấn "Đổi ca" để tạo yêu cầu'
                />
              ) : (
                <motion.div key="swap-grid" className="grid grid-cols-1 gap-4">
                  {filteredSwap.map((post, i) => (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <ShiftSwapCard
                        post={post}
                        onContact={(p) => console.log("contact", p.authorName)}
                        onAccept={handleAcceptSwap}
                        onCancel={handleCancelSwap}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        </div>

        {/* ── History panel sidebar ── */}
        <div className="w-72 shrink-0 hidden xl:block">
          <div className="sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-slate-200/80 dark:border-neutral-700/80 bg-white/90 dark:bg-neutral-900/80 backdrop-blur-sm p-4">
            <ShiftHistoryPanel />
          </div>
        </div>

      </div>

      <ShiftSwapDialog open={swapOpen} onClose={() => setSwapOpen(false)} onSave={handleSaveSwap} />
      <AvailableDialog open={availOpen} onClose={() => setAvailOpen(false)} onSave={handleSaveAvail} />
    </div>
  );
}
