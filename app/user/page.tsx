"use client";

import { useState } from "react";
import { useUsers } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 10;

export default function UserPage() {
  const [inputKey, setInputKey] = useState("");
  const [submittedKey, setSubmittedKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useUsers({
    apiKey: submittedKey,
    page,
    limit: PAGE_SIZE,
    enabled: !!submittedKey,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSubmittedKey(inputKey.trim());
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Danh sách người dùng</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Nhập API key để xác thực và tải dữ liệu người dùng.
          </p>
        </div>

        {/* API Key Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">API Key</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="Nhập API key..."
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button type="submit" disabled={!inputKey.trim()}>
                Xác nhận
              </Button>
            </form>
            {submittedKey && (
              <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                ✓ API key đã được áp dụng.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Data Table */}
        {submittedKey && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                Người dùng
                {data?.pagination && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({data.pagination.total_items} tổng)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isError && (
                <div className="p-6 text-center text-sm text-destructive">
                  {error?.message || "Không thể tải dữ liệu. Vui lòng kiểm tra API key."}
                </div>
              )}

              {isLoading && (
                <div className="space-y-2 p-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              )}

              {!isLoading && !isError && data && (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Họ tên</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Số điện thoại</TableHead>
                        <TableHead>Mã giới thiệu</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Hoạt động</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.data.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                            Không có dữ liệu.
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.data.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.full_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone_number || "—"}</TableCell>
                            <TableCell>
                              <span className="font-mono text-xs">{user.referral_code || "—"}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.is_active ? "default" : "secondary"}>
                                {user.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(user.created_at).toLocaleDateString("vi-VN")}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {data.pagination && (
                    <div className="flex items-center justify-between border-t px-6 py-4">
                      <p className="text-sm text-muted-foreground">
                        Trang {data.pagination.page} / {data.pagination.total_pages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={!data.pagination.has_prev}
                        >
                          Trước
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => p + 1)}
                          disabled={!data.pagination.has_next}
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
