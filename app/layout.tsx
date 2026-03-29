import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SciSheet — Science Worksheet Platform",
  description:
    "Build consistent, skills-based science worksheets for your department.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}