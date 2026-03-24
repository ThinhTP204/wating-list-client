"use client";

import { motion } from "motion/react";
import { MapPin, MessageCircle, UserCheck, Sunrise, Sun, Sunset, Moon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvailableEmployee, ShiftType, SHIFT_TYPE_META } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  employee: AvailableEmployee;
  onContact: (emp: AvailableEmployee) => void;
  onInvite: (emp: AvailableEmployee) => void;
  onCancel?: (emp: AvailableEmployee) => void;
}

const SHIFT_ICONS: Record<ShiftType, React.ElementType> = {
  morning:   Sunrise,
  afternoon: Sun,
  evening:   Sunset,
  night:     Moon,
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
}

export default function AvailableCard({ employee, onContact, onInvite, onCancel }: Props) {
  const initial = employee.name.split(" ").pop()?.charAt(0) ?? "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative rounded-xl border transition-all duration-200 overflow-hidden",
        "hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10",
        employee.isOwn && "ring-2 ring-emerald-500/30",
        "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800"
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <Card className="border-0 shadow-none bg-transparent gap-0 py-0">
        <CardContent className="px-4 pt-4 pb-3 space-y-3">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                  {initial}
                </div>
                <span className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-neutral-950",
                  employee.isOnline ? "bg-emerald-500" : "bg-neutral-300 dark:bg-neutral-600"
                )} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white leading-tight">
                    {employee.name}
                  </span>
                  {employee.isOwn && (
                    <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-transparent text-[10px] px-1.5 py-0">
                      Của tôi
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">{employee.position}</span>
              </div>
            </div>
            <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-transparent text-xs shrink-0">
              Sẵn sàng
            </Badge>
          </div>

          {/* Available info */}
          <div className="bg-emerald-50/60 dark:bg-emerald-900/10 rounded-lg p-3 space-y-2.5 border border-emerald-100 dark:border-emerald-900/30">
            {/* Date chip */}
            <div className="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-emerald-200 dark:border-emerald-800/50 rounded-md px-2.5 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {formatDate(employee.availableDate)}
              </span>
            </div>

            {/* Shift chips with icons */}
            <div className="flex flex-wrap gap-1.5">
              {employee.availableShifts.map((type) => {
                const meta = SHIFT_TYPE_META[type];
                const Icon = SHIFT_ICONS[type];
                return (
                  <span
                    key={type}
                    className={cn(
                      "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md",
                      "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700",
                      meta.color
                    )}
                  >
                    <Icon className="w-2.5 h-2.5 shrink-0" />
                    {meta.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{employee.branch}</span>
          </div>

          {employee.note && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 italic bg-neutral-50 dark:bg-neutral-900/40 rounded-md px-2.5 py-1.5 line-clamp-2">
              &ldquo;{employee.note}&rdquo;
            </p>
          )}
        </CardContent>

        <CardFooter className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800/60 gap-2">
          {employee.isOwn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel?.(employee)}
              className="flex-1 text-xs border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Hủy đăng
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onContact(employee)}
                className="flex-1 text-xs gap-1.5 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 focus-visible:ring-[#8f58e4]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Nhắn tin
              </Button>
              <Button
                size="sm"
                onClick={() => onInvite(employee)}
                className="flex-1 text-xs gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white hover:shadow-md hover:shadow-emerald-500/20 focus-visible:ring-[#8f58e4]"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Mời nhận ca
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
