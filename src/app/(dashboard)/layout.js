import HRISLayout from "@/components/layout/layout"
export default function DashboardLayout({ children }) {
  return (
      <div>
        <HRISLayout>{children}</HRISLayout>;
      </div>
  )
}