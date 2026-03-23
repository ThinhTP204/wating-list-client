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
import { Separator } from "@/components/ui/separator";
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
  const [date, setDate] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [shiftType, setShiftType] = useState<ShiftType>("morning");
  const [wantShift, setWantShift] = useState("");
  const [branch, setBranch] = useState("");
  const [note, setNote] = useState("");

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
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-white text-lg">Đăng đổi ca</DialogTitle>
            <p className="text-purple-200 text-sm mt-0.5">Tìm người nhận ca của bạn trên Sàn</p>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Ca muốn nhường */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
              Ca của bạn (muốn nhường)
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm w-full"
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="time"
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
                placeholder="Từ"
                className="text-sm"
              />
              <Input
                type="time"
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
                placeholder="Đến"
                className="text-sm"
              />
              <Select value={shiftType} onValueChange={(v) => setShiftType(v as ShiftType)}>
                <SelectTrigger className="text-sm">
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

          <Separator />

          {/* Ca muốn nhận */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
              Ca bạn muốn nhận
            </Label>
            <Input
              value={wantShift}
              onChange={(e) => setWantShift(e.target.value)}
              placeholder="VD: Ca chiều hoặc ca tối thứ 4, 5"
              className="text-sm"
            />
          </div>

          {/* Chi nhánh */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
              Chi nhánh
            </Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="text-sm w-full">
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
            <Label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
              Ghi chú <span className="normal-case font-normal text-neutral-400">(tùy chọn)</span>
            </Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Lý do hoặc yêu cầu thêm..."
              className="text-sm"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
          <Button variant="outline" onClick={onClose} className="text-sm">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
            className="text-sm bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] border-0 text-white hover:shadow-md hover:shadow-purple-500/20 disabled:opacity-50"
          >
            Đăng lên Sàn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
