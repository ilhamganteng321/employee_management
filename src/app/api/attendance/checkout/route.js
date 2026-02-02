import { NextResponse } from "next/server"
import { db } from "@/db"
import { attendances } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { differenceInMinutes, format } from "date-fns"

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



    if(!attendance && !attendance?.checkOut){
      return NextResponse.json({message: "Belum check-out"}, {status: 400})
    }else{
      return NextResponse.json({status: 200})
    }

  }catch (error) {
    console.error("GET ATTENDANCE ERROR:", error)
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { employeeId } = await req.json()

    if (!employeeId) {
      return NextResponse.json(
        { message: "Employee ID wajib" },
        { status: 400 }
      )
    }

    const today = format(new Date(), "yyyy-MM-dd")
    const now = new Date()

    const attendance = await db.query.attendances.findFirst({
      where: and(
        eq(attendances.employeeId, employeeId),
        eq(attendances.date, today)
      )
    })

    if (!attendance) {
      return NextResponse.json(
        { message: "Belum check-in hari ini" },
        { status: 400 }
      )
    }

    if (!attendance.checkIn) {
      return NextResponse.json(
        { message: "Data check-in tidak valid" },
        { status: 400 }
      )
    }

    if (attendance.checkOut) {
      return NextResponse.json(
        { message: "Sudah check-out hari ini" },
        { status: 400 }
      )
    }

    const workMinutes = differenceInMinutes(now, new Date(attendance.checkIn))

    await db
      .update(attendances)
      .set({
        checkOut: now,
        workMinutes
      })
      .where(eq(attendances.id, attendance.id))

    return NextResponse.json({
      message: "Check-out berhasil",
      workMinutes,
      time: now
    })
  } catch (error) {
    console.error("CHECK-OUT ERROR:", error)
    return NextResponse.json({ message: "Gagal check-out" }, { status: 500 })
  }
}
