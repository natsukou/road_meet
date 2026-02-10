import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoadMeet - 让相遇更有趣",
  description: "基于GPS的社交交友线下聚会应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
