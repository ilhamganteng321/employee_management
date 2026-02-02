import { NextResponse } from "next/server"
import { db } from "@/db"
import { attendances, users, positions, employees } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

export async function GET() {
  try {
    const records = await db
      .select({
        attendanceId: attendances.id,
        date: attendances.date,
        checkIn: attendances.checkIn,
        checkOut: attendances.checkOut,
        status: attendances.status,
        isLate: attendances.isLate,
        workMinutes: attendances.workMinutes,

        employeeId: employees.id,
        employeeName: users.name,

        positionName: positions.name
      })
      .from(attendances)
      .innerJoin(employees, eq(attendances.employeeId, employees.id))
      .innerJoin(users, eq(employees.userId, users.id))
      .leftJoin(positions, eq(employees.positionId, positions.id))
      .orderBy(desc(attendances.date))

    return NextResponse.json({ data: records })
  } catch (error) {
    console.error("FETCH ATTENDANCE ERROR:", error)
    return NextResponse.json(
      { message: "Gagal mengambil data absensi" },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  const { employeeId, date, checkIn, checkOut, status, isLate, workMinutes } = await req.json()
  
  if(!employeeId || !date || !checkIn || !status || !isLate || !workMinutes) {
    return NextResponse.json(
      { message: "Data absensi tidak lengkap" },
      { status: 400 }
    )
  }

  try {
    const result = await db.insert(attendances).values({
      employeeId,
      date,
      checkIn,
      checkOut,
      status,
      isLate,
      workMinutes
    }).returning()

    const resultData = result[0]

    if (!resultData) {
      return NextResponse.json(
        { message: "Gagal membuat data absensi" },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: resultData }, { status: 201 })
  } catch (error) {
    console.error("CREATE ATTENDANCE ERROR:", error)
    return NextResponse.json(
      { message: "Gagal membuat data absensi" },
      { status: 500 }
    )
  }
}
