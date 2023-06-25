"use client";
import "./globals.css";
import { MoralisProvider } from "react-moralis";

export const metadata = {
  title: "Smart Contract Lottery",
  description: "Our Smart Contract Lottery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MoralisProvider initializeOnMount={false}>{children}</MoralisProvider>
      </body>
    </html>
  );
}
