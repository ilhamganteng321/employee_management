import HRISLayout from "@/components/layout/layout"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function DashboardLayout({ children }) {
  return (
      <div className={inter.className}>
        <HRISLayout>{children}</HRISLayout>;
      </div>
  )
}