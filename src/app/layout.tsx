import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "LoveMeet",
  description: "Find genuine connections.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-rose-50 to-white text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
