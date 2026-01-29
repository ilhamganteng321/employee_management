import { NextResponse } from "next/server"
import { db } from "@/db"
import { attendances } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { format } from "date-fns"
import { getDistance } from "geolib"
import { OFFICE_LOCATION } from "@/utils/constants"

const OFFICE_START = "08:00"

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

    if(attendance == null){
      return NextResponse.json({message: "Belum check-in"}, {status: 400})
    }

    // console.log("ATTENDANCE:", attendance)
    if(attendance?.checkIn === null){
      return NextResponse.json(attendance || null)
    }else{
      return NextResponse.json({message: "Sudah check-in"}, {status: 400})
    }
  }catch (error) {
    console.error("GET ATTENDANCE ERROR:", error)
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { employeeId, latitude, longitude } = await req.json()

    // Validasi lokasi
    if (latitude && longitude) {
      const distance = getDistance(
        { latitude, longitude },
        OFFICE_LOCATION
      )
      
      if (distance > OFFICE_LOCATION.radius) {
        return NextResponse.json(
          { message: `Anda berada ${distance}m dari kantor. Absensi hanya dalam ${OFFICE_LOCATION.radius}m` },
          { status: 403 }
        )
      }
    } else {
      return NextResponse.json(
        { message: "Lokasi diperlukan" },
        { status: 400 }
      )
    }

    if (!employeeId) {
      return NextResponse.json(
        { message: "Employee ID wajib" },
        { status: 400 }
      )
    }

    const today = format(new Date(), "yyyy-MM-dd")
    const now = new Date()

    // Cek sudah absen hari ini?
    const existing = await db.query.attendances.findFirst({
      where: and(
        eq(attendances.employeeId, employeeId),
        eq(attendances.date, today)
      )
    })

    if (existing) {
      return NextResponse.json(
        { message: "Sudah check-in hari ini" },
        { status: 400 }
      )
    }

    // Hitung telat
    const officeStart = new Date(`${today}T${OFFICE_START}:00`)
    const isLate = now > officeStart

    await db.insert(attendances).values({
      employeeId,
      date: today,
      checkIn: now,
      isLate,
      status: "present"
    })

    return NextResponse.json({
      message: "Check-in berhasil",
      isLate,
      time: now
    })
  } catch (error) {
    console.error("CHECK-IN ERROR:", error)
    return NextResponse.json({ message: "Gagal check-in" }, { status: 500 })
  }
}
