"use client";

import { useState } from "react";
import { useUsers, useDeleteUser, useReferralStats } from "@/hooks/useUser";
import { useIsMobile } from "@/hooks/useMobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, RefreshCw, Trash2, Users, Tag, BarChart3 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export default function UserPage() {
  const [inputKey, setInputKey] = useState("");
  const [submittedKey, setSubmittedKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const { data, isLoading, isFetching, isError, error, refetch } = useUsers({
    apiKey: submittedKey,
    page,
    limit: PAGE_SIZE,
    enabled: !!submittedKey,
  });

  const { mutate: handleDelete, isPending: isDeleting } = useDeleteUser(submittedKey);

  const {
    data: referralData,
    isLoading: isReferralLoading,
    isFetching: isReferralFetching,
    refetch: refetchReferral,
  } = useReferralStats({ apiKey: submittedKey, enabled: !!submittedKey });

  const referralStats = (referralData?.data ?? []).filter(
    (s) => s.referral_code && s.referral_code.toLowerCase() !== "unknown"
  );
  const maxReferralUsers = referralStats.length > 0 ? Math.max(...referralStats.map((s) => s.total_users)) : 0;
  const isMobile = useIsMobile();
  const statsCols = isMobile ? Math.min(referralStats.length, 2) : Math.min(referralStats.length, 6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSubmittedKey(inputKey.trim());
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    handleDelete(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`Đã xóa người dùng ${deleteTarget.name}`);
        setDeleteTarget(null);
        setDeleteConfirmText("");
      },
      onError: (err) => {
        toast.error(err?.message || "Xóa thất bại. Vui lòng thử lại.");
        setDeleteTarget(null);
        setDeleteConfirmText("");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Danh sách người dùng</h1>
            <p className="mt-1 text-muted-foreground text-sm">
              Nhập API key để xác thực và tải dữ liệu người dùng.
            </p>
          </div>
          {submittedKey && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => { refetch(); refetchReferral(); }}
              disabled={isFetching || isReferralFetching}
              className="flex-shrink-0 gap-2 mt-1"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching || isReferralFetching ? "animate-spin" : ""}`} />
              Tải lại
            </Button>
          )}
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

        {/* Referral Stats */}
        {submittedKey && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Thống kê tổng số người được giới thiệu</CardTitle>
                {referralData?.data && (
                  <Badge variant="secondary" className="ml-1">
                    {referralData.data.length} người
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isReferralLoading ? (
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                  ))}
                </div>
              ) : referralStats.length > 0 ? (
                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${statsCols}, minmax(0, 1fr))`,
                    }}
                  >
                    {referralStats.map((stat) => {
                      const isLeader = stat.total_users === maxReferralUsers && maxReferralUsers > 0;
                      return (
                        <div
                          key={stat.referral_code}
                          className={`relative flex flex-col gap-2 rounded-xl border p-4 transition-all duration-300 ${
                            isLeader
                              ? "border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40 shadow-md shadow-orange-200 dark:shadow-orange-900/30 scale-[1.03]"
                              : "bg-muted/30 hover:bg-muted/50 border-border"
                          }`}
                        >
                          {isLeader && (
                            <span
                              className="absolute -top-3 -right-2 text-xl select-none"
                              style={{ animation: "fireFlicker 0.8s ease-in-out infinite alternate" }}
                            >
                              🔥
                            </span>
                          )}
                          <div className={`flex items-center gap-1.5 ${
                            isLeader ? "text-orange-500" : "text-muted-foreground"
                          }`}>
                            <Tag className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium uppercase tracking-wide">
                              {isLeader ? "Dẫn đầu" : "Mã"}
                            </span>
                          </div>
                          <p
                            className={`font-mono text-sm font-semibold truncate ${
                              isLeader ? "text-orange-700 dark:text-orange-300" : ""
                            }`}
                            title={stat.referral_code}
                          >
                            {stat.referral_code}
                          </p>
                          <div className="flex items-center gap-1.5 mt-auto">
                            <Users className={`h-4 w-4 ${
                              isLeader ? "text-orange-500" : "text-primary"
                            }`} />
                            <span className={`text-xl font-bold ${
                              isLeader ? "text-orange-600 dark:text-orange-400" : ""
                            }`}>
                              {stat.total_users.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">người</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">Không có dữ liệu thống kê.</p>
              )}
            </CardContent>
          </Card>
        )}

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
                        <TableHead>Người giới thiệu</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Hoạt động</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead className="w-12" />
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
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setDeleteTarget({ id: user.id, name: user.full_name })}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) { setDeleteTarget(null); setDeleteConfirmText(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? Hành động này không thể hoàn tác.
          </p>
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">
              Nhập <span className="font-mono font-semibold text-foreground">mật khẩu</span> để xác nhận:
            </p>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Nhập mật khẩu xác nhận..."
              className="font-mono text-sm"
              autoComplete="off"
            />
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm" disabled={isDeleting} onClick={() => setDeleteConfirmText("")}>
                Hủy
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              onClick={confirmDelete}
              disabled={isDeleting || deleteConfirmText !== "xoacaiconcac"}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
