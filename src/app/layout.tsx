import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "We",
  description: "A general purpose community building framework for the WWW",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
