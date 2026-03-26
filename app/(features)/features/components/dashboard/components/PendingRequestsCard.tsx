"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowRight } from "lucide-react";

const PENDING_REQUESTS = [
  { id: 1, type: "Nghỉ phép", employee: "Nguyễn Văn A", date: "20/03/2026", days: 2 },
  { id: 2, type: "Tăng ca", employee: "Trần Thị B", date: "21/03/2026", days: 1 },
  { id: 3, type: "Nghỉ phép", employee: "Lê Văn C", date: "22/03/2026", days: 3 },
  { id: 4, type: "Chuyển ca", employee: "Phạm Thị D", date: "23/03/2026", days: 1 },
];

const TYPE_COLORS: Record<string, string> = {
  "Nghỉ phép": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Tăng ca": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Chuyển ca": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function PendingRequestsCard() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <FileText className="w-4 h-4 text-[#4C88C6]" />
          Yêu cầu chờ duyệt
          <span className="ml-auto bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-medium">
            {PENDING_REQUESTS.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 justify-between">
        {PENDING_REQUESTS.slice(0, 4).map((request) => (
          <div
            key={request.id}
            className="flex items-center gap-3 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${TYPE_COLORS[request.type]}`}>
                  {request.type}
                </span>
              </div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {request.employee}
              </p>
              <p className="text-xs text-neutral-500">
                {request.date} · {request.days} ngày
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-[#4C88C6] transition-colors" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
