import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Wrapper from "./components/Wrapper";
import Navbar from "./components/navigation/navbar";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budgeting App",
  description: "Stick to your created budget",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <Navbar />
          <Wrapper>{children}</Wrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
