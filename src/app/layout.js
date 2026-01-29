import { Inter } from "next/font/google"
import "./globals.css"
import HRISLayout from "@/components/layout/layout";
import ToastProvider from "./providers/ToastProvider";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "HRIS Mini - Sistem Manajemen Karyawan",
  description: "Sistem manajemen karyawan modern"
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ToastProvider>
        <HRISLayout>{children}</HRISLayout>;
        </ToastProvider>
      </body>
    </html>
  )
}