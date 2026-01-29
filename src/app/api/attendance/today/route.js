import { NextResponse } from "next/server"
import { db } from "@/db"
import { attendances } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const employeeId = searchParams.get('employeeId')
    const date = searchParams.get('date')

    if (!employeeId || !date) {
      return NextResponse.json(
        { message: "Parameter tidak lengkap" },
        { status: 400 }
      )
    }

    const attendance = await db.query.attendances.findFirst({
      where: and(
        eq(attendances.employeeId, employeeId),
        eq(attendances.date, date)
      )
    })

    return NextResponse.json(attendance || null)
  } catch (error) {
    console.error("GET ATTENDANCE ERROR:", error)
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 })
  }
}