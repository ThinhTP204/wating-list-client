"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, ArrowLeftRight, CheckCircle2, UserCheck, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ShiftSwapPost, AvailableEmployee, MOCK_POSTS, MOCK_AVAILABLE, MIN_DAYS_AHEAD } from "./components/types";
import ShiftSwapCard from "./components/ShiftSwapCard";
import AvailableCard from "./components/AvailableCard";
import ShiftSwapDialog from "./components/ShiftSwapDialog";
import AvailableDialog from "./components/AvailableDialog";

const BRANCHES = ["all", "Chi nhánh Quận 1", "Chi nhánh Quận 3", "Chi nhánh Quận 7", "Trụ sở chính"];

function getMinSwapDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + MIN_DAYS_AHEAD);
  d.setHours(0, 0, 0, 0);
  return d;
}

function EmptyPanel({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-14 gap-3 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20"
    >
      <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <Icon className="w-5 h-5 text-neutral-400 dark:text-neutral-500" />
      </div>
      <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500">{sub}</p>
    </motion.div>
  );
}

export default function Page() {
  const [posts, setPosts]           = useState<ShiftSwapPost[]>(MOCK_POSTS);
  const [available, setAvailable]   = useState<AvailableEmployee[]>(MOCK_AVAILABLE);
  const [search, setSearch]         = useState("");
  const [branchFilter, setBranch]   = useState("all");
  const [swapOpen, setSwapOpen]     = useState(false);
  const [availOpen, setAvailOpen]   = useState(false);

  const minDate = getMinSwapDate();

  const filteredSwap = useMemo(() =>
    posts.filter((p) => {
      if (p.status === "expired") return false;
      if (p.status === "open" && new Date(p.myShift.date) < minDate) return false;
      if (branchFilter !== "all" && p.branch !== branchFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.authorName.toLowerCase().includes(q) || p.wantShift.toLowerCase().includes(q) || p.authorDepartment.toLowerCase().includes(q);
      }
      return true;
    }),
    [posts, search, branchFilter]
  );

  const filteredAvail = useMemo(() =>
    available.filter((e) => {
      if (new Date(e.availableDate) < new Date(new Date().toDateString())) return false;
      if (branchFilter !== "all" && e.branch !== branchFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q);
      }
      return true;
    }),
    [available, search, branchFilter]
  );

  const openSwapCount   = posts.filter((p) => p.status === "open").length;
  const matchedCount    = posts.filter((p) => p.status === "matched").length;
  const totalActive     = openSwapCount + available.length;

  const handleSaveSwap     = (p: ShiftSwapPost)      => setPosts((prev) => [p, ...prev]);
  const handleAcceptSwap   = (p: ShiftSwapPost)      => setPosts((prev) => prev.map((x) => x.id === p.id ? { ...x, status: "matched" as const } : x));
  const handleCancelSwap   = (p: ShiftSwapPost)      => setPosts((prev) => prev.filter((x) => x.id !== p.id));
  const handleSaveAvail    = (e: AvailableEmployee)  => setAvailable((prev) => [e, ...prev]);
  const handleCancelAvail  = (e: AvailableEmployee)  => setAvailable((prev) => prev.filter((x) => x.id !== e.id));

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-br from-[#1e0d4a] via-[#402093] to-[#6940c4] overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-6 right-36 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-8 right-20 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-24 h-24 rounded-full bg-purple-400/10 pointer-events-none" />

        <div className="relative px-6 pt-7 pb-6">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              {/* Live indicator */}
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] text-white/55 font-medium uppercase tracking-widest">
                  {totalActive} đang hoạt động
                </span>
              </div>

              <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1.5">
                Shift Exchange
              </h1>
              <p className="text-sm text-purple-200/70">
                Linh hoạt lịch làm việc — cùng đồng nghiệp hỗ trợ nhau
              </p>

              {/* Inline stats */}
              <div className="flex items-center gap-5 mt-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-white/15 flex items-center justify-center">
                    <ArrowLeftRight className="w-2.5 h-2.5 text-purple-200" />
                  </div>
                  <span className="text-white font-bold text-sm">{openSwapCount}</span>
                  <span className="text-white/45 text-xs">cần đổi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-white/15 flex items-center justify-center">
                    <UserCheck className="w-2.5 h-2.5 text-emerald-300" />
                  </div>
                  <span className="text-white font-bold text-sm">{available.length}</span>
                  <span className="text-white/45 text-xs">sẵn sàng</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-white/15 flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-blue-300" />
                  </div>
                  <span className="text-white font-bold text-sm">{matchedCount}</span>
                  <span className="text-white/45 text-xs">đã khớp</span>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="sm"
                  onClick={() => setAvailOpen(true)}
                  className="gap-1.5 text-xs bg-white/12 border border-white/25 text-white hover:bg-white/22 backdrop-blur-sm shadow-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Đăng sẵn sàng
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="sm"
                  onClick={() => setSwapOpen(true)}
                  className="gap-1.5 text-xs bg-white text-[#402093] hover:bg-white/90 font-semibold shadow-none border-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Đăng đổi ca
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="p-6 space-y-6">

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, bộ phận..."
              className="pl-9 text-sm focus-visible:ring-[#8f58e4]"
            />
          </div>
          <Select value={branchFilter} onValueChange={setBranch}>
            <SelectTrigger className="sm:min-w-[200px] text-sm gap-2 focus:ring-[#8f58e4]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BRANCHES.map((b) => (
                <SelectItem key={b} value={b}>{b === "all" ? "Tất cả chi nhánh" : b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: Sẵn sàng nhận ca ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                <span className="text-sm font-semibold text-neutral-800 dark:text-white">Sẵn sàng nhận ca</span>
                <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-transparent">
                  {filteredAvail.length}
                </Badge>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="sm"
                  onClick={() => setAvailOpen(true)}
                  className="gap-1.5 text-xs bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white hover:shadow-md hover:shadow-emerald-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Đăng sẵn sàng
                </Button>
              </motion.div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredAvail.length === 0 ? (
                <EmptyPanel key="empty-avail" icon={UserCheck} title="Chưa có ai đăng sẵn sàng" sub='Nhấn "Đăng sẵn sàng" để bắt đầu' />
              ) : (
                <motion.div key="avail-grid" className="grid grid-cols-1 gap-4">
                  {filteredAvail.map((emp, i) => (
                    <motion.div key={emp.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}>
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

          {/* ── Right: Cần đổi ca ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#402093] to-[#8f58e4]" />
                <span className="text-sm font-semibold text-neutral-800 dark:text-white">Cần đổi ca</span>
                <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-transparent">
                  {filteredSwap.length}
                </Badge>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="sm"
                  onClick={() => setSwapOpen(true)}
                  className="gap-1.5 text-xs bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] border-0 text-white hover:shadow-md hover:shadow-purple-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Đăng đổi ca
                </Button>
              </motion.div>
            </div>

            {/* Date notice */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
              <span className="text-[11px] text-amber-700 dark:text-amber-400">
                Chỉ hiển thị ca cần đổi cách ít nhất <strong>{MIN_DAYS_AHEAD} ngày</strong> từ hôm nay
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredSwap.length === 0 ? (
                <EmptyPanel key="empty-swap" icon={ArrowLeftRight} title="Không có yêu cầu đổi ca" sub='Nhấn "Đăng đổi ca" để tạo yêu cầu' />
              ) : (
                <motion.div key="swap-grid" className="grid grid-cols-1 gap-4">
                  {filteredSwap.map((post, i) => (
                    <motion.div key={post.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}>
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

      <ShiftSwapDialog open={swapOpen} onClose={() => setSwapOpen(false)} onSave={handleSaveSwap} />
      <AvailableDialog open={availOpen} onClose={() => setAvailOpen(false)} onSave={handleSaveAvail} />
    </div>
  );
}
