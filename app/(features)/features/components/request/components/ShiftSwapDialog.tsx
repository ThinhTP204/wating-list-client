"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeftRight, Calendar, Clock, MapPin, MessageSquare } from "lucide-react";
import { ShiftSwapPost, ShiftType } from "./types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (post: ShiftSwapPost) => void;
}

const BRANCHES = [
  "Chi nhánh Quận 1",
  "Chi nhánh Quận 3",
  "Chi nhánh Quận 7",
  "Trụ sở chính",
];

export default function ShiftSwapDialog({ open, onClose, onSave }: Props) {
  const [date, setDate]           = useState("");
  const [timeFrom, setTimeFrom]   = useState("");
  const [timeTo, setTimeTo]       = useState("");
  const [shiftType, setShiftType] = useState<ShiftType>("morning");
  const [wantShift, setWantShift] = useState("");
  const [branch, setBranch]       = useState("");
  const [note, setNote]           = useState("");

  const isValid = date && timeFrom && timeTo && wantShift && branch;

  const handleSubmit = () => {
    if (!isValid) return;
    const post: ShiftSwapPost = {
      id: Date.now().toString(),
      authorName: "Bạn",
      authorPosition: "Nhân viên",
      authorDepartment: "Của tôi",
      isOnline: true,
      myShift: { date, timeLabel: `${timeFrom} – ${timeTo}`, type: shiftType },
      wantShift,
      branch,
      note: note || undefined,
      status: "open",
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      isOwn: true,
    };
    onSave(post);
    onClose();
    setDate(""); setTimeFrom(""); setTimeTo("");
    setShiftType("morning"); setWantShift(""); setBranch(""); setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Đăng đổi ca</DialogTitle>

        {/* Gradient header */}
        <div className="bg-gradient-to-br from-[#2d1666] via-[#402093] to-[#6940c4] px-6 py-5">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <ArrowLeftRight className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Đăng đổi ca</span>
            </div>
            <p className="text-purple-200/80 text-sm">Tìm người nhận ca của bạn trên Sàn</p>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">

          {/* Ca muốn nhường */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <Label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                Ca của bạn (muốn nhường)
              </Label>
            </div>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm w-full focus-visible:ring-[#8f58e4]"
            />
            <div className="grid grid-cols-3 gap-2">
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400 pointer-events-none" />
                <Input
                  type="time"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                  className="text-sm pl-7 focus-visible:ring-[#8f58e4]"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400 pointer-events-none" />
                <Input
                  type="time"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                  className="text-sm pl-7 focus-visible:ring-[#8f58e4]"
                />
              </div>
              <Select value={shiftType} onValueChange={(v) => setShiftType(v as ShiftType)}>
                <SelectTrigger className="text-sm focus:ring-[#8f58e4]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Ca sáng</SelectItem>
                  <SelectItem value="afternoon">Ca chiều</SelectItem>
                  <SelectItem value="evening">Ca tối</SelectItem>
                  <SelectItem value="night">Ca đêm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-100 dark:bg-neutral-800" />
            <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-3 h-3 text-neutral-400" />
            </div>
            <div className="flex-1 h-px bg-neutral-100 dark:bg-neutral-800" />
          </div>

          {/* Ca muốn nhận */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <ArrowLeftRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                Ca bạn muốn nhận
              </Label>
            </div>
            <Input
              value={wantShift}
              onChange={(e) => setWantShift(e.target.value)}
              placeholder="VD: Ca chiều hoặc ca tối thứ 4, 5"
              className="text-sm focus-visible:ring-[#8f58e4]"
            />
          </div>

          {/* Chi nhánh */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
              <Label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                Chi nhánh
              </Label>
            </div>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="text-sm w-full focus:ring-[#8f58e4]">
                <SelectValue placeholder="Chọn chi nhánh..." />
              </SelectTrigger>
              <SelectContent>
                {BRANCHES.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ghi chú */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
              </div>
              <Label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                Ghi chú <span className="normal-case font-normal text-neutral-400">(tùy chọn)</span>
              </Label>
            </div>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Lý do hoặc yêu cầu thêm..."
              className="text-sm focus-visible:ring-[#8f58e4]"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/40 gap-2">
          <Button variant="outline" onClick={onClose} className="text-sm">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="text-sm bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] border-0 text-white hover:shadow-md hover:shadow-purple-500/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            Đăng lên Sàn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
