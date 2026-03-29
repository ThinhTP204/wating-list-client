import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Wokki",
  description:
    "Nền tảng quản lý nhân sự thông minh — lịch ca, chấm công, tính lương trong một hệ thống duy nhất.",
  icons: {
    icon: "/WOKKI-LOGO.png",
    shortcut: "/WOKKI-LOGO.png",
    apple: "/WOKKI-LOGO.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${ubuntu.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
