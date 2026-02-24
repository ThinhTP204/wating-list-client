"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ColumnDef } from "@tanstack/react-table";

// Core
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form controls
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Overlay
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Data display
import { DataTable } from "@/components/ui/data-table";

// Custom
import SafeImage from "@/components/ui/SafeImage";
import { TruncatedText } from "@/components/ui/truncated-text";
import { ErrorState, EmptyState, LoadingSkeleton } from "@/components/ui/state";

// Icons
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Info,
  Loader2,
  Settings,
  Trash2,
  User,
} from "lucide-react";

// ─── Demo Table Data ──────────────────────────────────────────
type Payment = {
  id: string;
  name: string;
  status: "pending" | "processing" | "success" | "failed";
  amount: number;
};

const tableData: Payment[] = [
  { id: "1", name: "Alice Nguyen", status: "success", amount: 250000 },
  { id: "2", name: "Bob Tran", status: "pending", amount: 150000 },
  { id: "3", name: "Charlie Le", status: "processing", amount: 350000 },
  { id: "4", name: "Diana Pham", status: "failed", amount: 50000 },
  { id: "5", name: "Edward Vu", status: "success", amount: 420000 },
];

const columns: ColumnDef<Payment>[] = [
  { accessorKey: "name", header: "Tên khách hàng" },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        success: "default",
        pending: "secondary",
        processing: "outline",
        failed: "destructive",
      };
      return <Badge variant={variantMap[status]}>{status}</Badge>;
    },
  },
  {
    accessorKey: "amount",
    header: "Số tiền",
    cell: ({ row }) =>
      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
        row.getValue("amount")
      ),
  },
];

// ─── Zod Schema ───────────────────────────────────────────────
const formSchema = z.object({
  username: z.string().min(2, { message: "Tên phải ít nhất 2 ký tự." }),
  email: z.string().email({ message: "Email không hợp lệ." }),
  bio: z.string().max(160, { message: "Bio tối đa 160 ký tự." }).optional(),
  role: z.string().min(1, { message: "Vui lòng chọn vai trò." }),
  notifications: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Section Wrapper ──────────────────────────────────────────
function Section({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <Separator className="mt-2" />
      </div>
      {children}
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function UIDemo() {
  const [progress, setProgress] = useState(40);
  const [switchOn, setSwitchOn] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("design");
  const [checked, setChecked] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", email: "", bio: "", role: "", notifications: false },
  });

  const onSubmit = (values: FormValues) => {
    toast.success("Form submitted!", { description: `Username: ${values.username}` });
    console.log(values);
  };

  const navItems = ["Buttons", "Cards", "Form", "Badges", "Progress", "Alert", "Controls", "Dialog", "Table", "Custom"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <span className="text-xs font-bold text-background">UI</span>
            </div>
            <span className="font-semibold">Component Demo</span>
          </div>
          <nav className="hidden gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>TK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-16 px-6 py-12">

        {/* ── Hero ── */}
        <div className="space-y-4 text-center">
          <Badge variant="outline" className="mx-auto">v1.0.0 — Black & White Theme</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">UI Component Library</h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Demo tất cả components — Button, Card, Form, Dialog, Table, và nhiều hơn.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button
              onClick={() =>
                toast.success("Welcome! 🎉", { description: "Tất cả components đã sẵn sàng." })
              }
            >
              Get Started
            </Button>
            <Button variant="outline">View Docs</Button>
          </div>
        </div>

        {/* ── 1. Buttons ── */}
        <Section title="1. Buttons" id="buttons">
          <Card>
            <CardHeader>
              <CardTitle>Variants & Sizes</CardTitle>
              <CardDescription>Tất cả button variants, sizes và trạng thái</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg">Large</Button>
                <Button size="default">Default</Button>
                <Button size="sm">Small</Button>
                <Button size="icon"><Settings className="h-4 w-4" /></Button>
                <Button disabled>Disabled</Button>
                <Button>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => toast("Info toast")} variant="outline">
                  <Info className="mr-2 h-4 w-4" /> Toast
                </Button>
                <Button
                  onClick={() => toast.success("Success!")}
                  className="bg-green-600 hover:bg-green-700 text-white border-0"
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Success Toast
                </Button>
                <Button onClick={() => toast.error("Something failed!")} variant="destructive">
                  <AlertCircle className="mr-2 h-4 w-4" /> Error Toast
                </Button>
                <Button
                  onClick={() =>
                    toast.promise(new Promise((res) => setTimeout(res, 2000)), {
                      loading: "Processing...",
                      success: "Xong rồi!",
                      error: "Lỗi!",
                    })
                  }
                  variant="outline"
                >
                  Promise Toast
                </Button>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ── 2. Cards ── */}
        <Section title="2. Cards" id="cards">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>Card với header và content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Nội dung card có thể chứa bất kỳ elements nào.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Footer</CardTitle>
                <CardDescription>Có footer với actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Thêm thông tin chi tiết tại đây.</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="sm">Confirm</Button>
                <Button size="sm" variant="ghost">Cancel</Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-36 bg-secondary">
                <SafeImage
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&fit=crop"
                  alt="Card image"
                  fill
                  className="object-cover opacity-80"
                  fallbackSrc=""
                />
              </div>
              <CardHeader className="pt-4">
                <CardTitle>Image Card</CardTitle>
                <CardDescription>SafeImage với fill mode</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </Section>

        {/* ── 3. Form ── */}
        <Section title="3. Form" id="form">
          <Card>
            <CardHeader>
              <CardTitle>React Hook Form + Zod Validation</CardTitle>
              <CardDescription>
                Form đầy đủ với validation, error messages, và tất cả input types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="nguyenvana" {...field} />
                          </FormControl>
                          <FormDescription>Tên hiển thị của bạn.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="example@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mô tả ngắn về bạn..." {...field} />
                        </FormControl>
                        <FormDescription>Tối đa 160 ký tự.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vai trò</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3 rounded-xl border border-border p-4">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div>
                          <FormLabel className="cursor-pointer">Email notifications</FormLabel>
                          <FormDescription>Nhận thông báo qua email.</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full sm:w-auto">
                    Submit Form
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </Section>

        {/* ── 4. Badges & Avatars ── */}
        <Section title="4. Badges & Avatar" id="badges">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-green-600 text-white border-0">Custom Green</Badge>
                <Badge className="bg-blue-600 text-white border-0">Custom Blue</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Avatars</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap items-end gap-6">
                {[
                  { src: "https://github.com/shadcn.png", fallback: "SC", label: "With image", size: "h-16 w-16" },
                  { src: "", fallback: "TK", label: "Fallback", size: "h-12 w-12" },
                  { src: "", fallback: "AB", label: "Default", size: "h-10 w-10" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1">
                    <Avatar className={item.size}>
                      <AvatarImage src={item.src} />
                      <AvatarFallback>{item.fallback}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ── 5. Progress & Skeleton ── */}
        <Section title="5. Progress & Skeleton" id="progress">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Progress Bar</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} />
                <Progress value={65} className="h-2" />
                <Progress value={90} className="h-3" />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setProgress((p) => Math.max(0, p - 10))}
                  >
                    −10
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setProgress((p) => Math.min(100, p + 10))}
                  >
                    +10
                  </Button>
                  <span className="self-center text-sm text-muted-foreground">{progress}%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Skeleton</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-28 w-full rounded-xl" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ── 6. Alert ── */}
        <Section title="6. Alerts" id="alert">
          <div className="space-y-3">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Thông báo</AlertTitle>
              <AlertDescription>Đây là thông báo informational mặc định.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>Đã xảy ra lỗi trong quá trình xử lý.</AlertDescription>
            </Alert>
          </div>
        </Section>

        {/* ── 7. Input Controls ── */}
        <Section title="7. Input Controls" id="controls">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Checkbox</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {["Tùy chọn 1", "Tùy chọn 2", "Tùy chọn 3"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Checkbox id={`cb-${i}`} defaultChecked={i === 0} />
                    <Label htmlFor={`cb-${i}`}>{item}</Label>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="cb-controlled"
                    checked={checked}
                    onCheckedChange={(v) => setChecked(!!v)}
                  />
                  <Label htmlFor="cb-controlled">
                    Controlled: <strong>{checked ? "ON" : "OFF"}</strong>
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Radio Group</CardTitle></CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedRadio}
                  onValueChange={setSelectedRadio}
                  className="space-y-2"
                >
                  {["design", "development", "marketing"].map((v) => (
                    <div key={v} className="flex items-center gap-2">
                      <RadioGroupItem value={v} id={`r-${v}`} />
                      <Label htmlFor={`r-${v}`} className="cursor-pointer capitalize">{v}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <p className="mt-3 text-sm text-muted-foreground">
                  Selected: <strong>{selectedRadio}</strong>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Switch</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {["Dark mode", "Notifications", "Auto-save"].map((label, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Label>{label}</Label>
                    <Switch defaultChecked={i === 2} />
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">Premium features</p>
                    <p className="text-xs text-muted-foreground">Enable all premium features</p>
                  </div>
                  <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Select</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hcm">Hồ Chí Minh</SelectItem>
                    <SelectItem value="hn">Hà Nội</SelectItem>
                    <SelectItem value="dn">Đà Nẵng</SelectItem>
                    <SelectItem value="ct">Cần Thơ</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="vi">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ── 8. Dialog ── */}
        <Section title="8. Dialog" id="dialog">
          <Card>
            <CardHeader><CardTitle>Dialog / Modal</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {/* Basic form dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
                    <DialogDescription>
                      Cập nhật thông tin cá nhân của bạn tại đây.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    <div className="space-y-1">
                      <Label>Tên</Label>
                      <Input placeholder="Nhập tên của bạn" />
                    </div>
                    <div className="space-y-1">
                      <Label>Email</Label>
                      <Input type="email" placeholder="email@example.com" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Hủy</Button>
                    <Button onClick={() => toast.success("Lưu thành công!")}>Lưu thay đổi</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete confirm dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Xóa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogDescription>
                      Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Hủy</Button>
                    <Button variant="destructive" onClick={() => toast.error("Đã xóa!")}>
                      Xóa
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Profile dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hồ sơ người dùng</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center gap-4 py-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback>TK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">ThinhKevin</p>
                      <p className="text-sm text-muted-foreground">thinh@example.com</p>
                      <Badge className="mt-1">Admin</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 py-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vai trò</span>
                      <span>Administrator</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ngày tạo</span>
                      <span>24/02/2026</span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </Section>

        {/* ── 9. Data Table ── */}
        <Section title="9. Data Table" id="table">
          <Card>
            <CardHeader>
              <CardTitle>TanStack Table</CardTitle>
              <CardDescription>Với search, sort, và pagination tích hợp sẵn</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={tableData}
                searchKey="name"
                searchPlaceholder="Tìm theo tên..."
              />
            </CardContent>
          </Card>
        </Section>

        {/* ── 10. Custom Components ── */}
        <Section title="10. Custom Components" id="custom">
          <div className="space-y-4">
            {/* TruncatedText */}
            <Card>
              <CardHeader><CardTitle>TruncatedText</CardTitle></CardHeader>
              <CardContent>
                <TruncatedText
                  text="Đây là một đoạn văn bản rất dài để demo tính năng truncate. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                  maxWords={20}
                  as="p"
                  buttonText={{ show: "Xem thêm", hide: "Thu gọn" }}
                />
              </CardContent>
            </Card>

            {/* State Components */}
            <Card>
              <CardHeader>
                <CardTitle>State Components</CardTitle>
                <CardDescription>ErrorState, EmptyState, LoadingSkeleton</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setShowError(true); setShowEmpty(false); setShowLoading(false); }}
                  >
                    Show Error
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setShowEmpty(true); setShowError(false); setShowLoading(false); }}
                  >
                    Show Empty
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setShowLoading(true); setShowError(false); setShowEmpty(false); }}
                  >
                    Show Loading
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setShowError(false); setShowEmpty(false); setShowLoading(false); }}
                  >
                    Reset
                  </Button>
                </div>

                {showError && (
                  <ErrorState
                    message="Không thể tải dữ liệu"
                    detail="Kết nối tới server thất bại. Vui lòng thử lại."
                    onRetry={() => { setShowError(false); toast.success("Đã thử lại!"); }}
                  />
                )}
                {showEmpty && <EmptyState />}
                {showLoading && <LoadingSkeleton propertyCount={3} />}
                {!showError && !showEmpty && !showLoading && (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    Nhấn một nút ở trên để xem state component
                  </p>
                )}
              </CardContent>
            </Card>

            {/* SafeImage */}
            <Card>
              <CardHeader><CardTitle>SafeImage</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">External URL</p>
                  <SafeImage
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=240&h=160&fit=crop"
                    alt="Tech image"
                    width={240}
                    height={160}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Fallback on broken URL</p>
                  <SafeImage
                    src="/this-does-not-exist.jpg"
                    alt="Broken"
                    width={240}
                    height={160}
                    className="rounded-xl bg-secondary"
                    fallbackSrc="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=240&h=160&fit=crop"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ── 11. Separator ── */}
        <Section title="11. Separator" id="separator">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <p className="text-sm font-medium">Horizontal separator</p>
              <Separator />
              <p className="text-sm text-muted-foreground">Below separator</p>
              <div className="flex h-8 items-center gap-4">
                <span className="text-sm">Left</span>
                <Separator orientation="vertical" />
                <span className="text-sm">Middle</span>
                <Separator orientation="vertical" />
                <span className="text-sm">Right (vertical)</span>
              </div>
            </CardContent>
          </Card>
        </Section>

      </main>

      <footer className="mt-16 border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-muted-foreground">
          UI Component Demo — Black &amp; White Theme
        </div>
      </footer>
    </div>
  );
}
