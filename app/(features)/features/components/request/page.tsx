"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, ArrowLeftRight, CheckCircle2, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShiftSwapPost, AvailableEmployee, MOCK_POSTS, MOCK_AVAILABLE, MIN_DAYS_AHEAD } from "./components/types";
import ShiftSwapCard from "./components/ShiftSwapCard";
import AvailableCard from "./components/AvailableCard";
import ShiftSwapDialog from "./components/ShiftSwapDialog";
import AvailableDialog from "./components/AvailableDialog";
import { cn } from "@/lib/utils";

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
      // Chỉ hiển thị ca cách ít nhất MIN_DAYS_AHEAD ngày
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

  const stats = [
    { label: "Cần đổi ca",     value: posts.filter((p) => p.status === "open").length,    cls: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",   icon: ArrowLeftRight },
    { label: "Sẵn sàng nhận",  value: available.length,                                   cls: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400", icon: UserCheck },
    { label: "Đã khớp",        value: posts.filter((p) => p.status === "matched").length, cls: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",           icon: CheckCircle2 },
    { label: "Tổng tham gia",  value: posts.length + available.length,                    cls: "bg-neutral-50 dark:bg-neutral-900/50 text-neutral-600 dark:text-neutral-400", icon: Users },
  ];

  const handleSaveSwap     = (p: ShiftSwapPost)      => setPosts((prev) => [p, ...prev]);
  const handleAcceptSwap   = (p: ShiftSwapPost)      => setPosts((prev) => prev.map((x) => x.id === p.id ? { ...x, status: "matched" as const } : x));
  const handleCancelSwap   = (p: ShiftSwapPost)      => setPosts((prev) => prev.filter((x) => x.id !== p.id));
  const handleSaveAvail    = (e: AvailableEmployee)  => setAvailable((prev) => [e, ...prev]);
  const handleCancelAvail  = (e: AvailableEmployee)  => setAvailable((prev) => prev.filter((x) => x.id !== e.id));

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="p-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Sàn Đổi Ca</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Tìm người nhận ca hoặc đăng sẵn sàng nhận ca từ đồng nghiệp
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-4"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", s.cls)}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-neutral-900 dark:text-white">{s.value}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tên, bộ phận..." className="pl-9 text-sm" />
          </div>
          <Select value={branchFilter} onValueChange={setBranch}>
            <SelectTrigger className="sm:min-w-[200px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BRANCHES.map((b) => (
                <SelectItem key={b} value={b}>{b === "all" ? "Tất cả chi nhánh" : b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

          {/* Vertical divider (desktop only) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 pointer-events-none" />

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

        {/* Mobile divider between panels */}
        <Separator className="lg:hidden" />

      </div>

      <ShiftSwapDialog open={swapOpen} onClose={() => setSwapOpen(false)} onSave={handleSaveSwap} />
      <AvailableDialog open={availOpen} onClose={() => setAvailOpen(false)} onSave={handleSaveAvail} />
    </div>
  );
}
