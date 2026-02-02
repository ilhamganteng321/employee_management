import { NextResponse } from 'next/server';
import { db } from '@/db';
import { attendances, employees, positions, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { ca } from 'date-fns/locale';

export async function GET() {
    const { id } = await params;
  try {
    const records = await db
      .select({
        attendanceId: attendances.id,
        date: attendances.date,
        checkIn: attendances.checkIn,
        checkOut: attendances.checkOut,
        status: attendances.status,
        isLate: attendances.isLate,
        workMinutes: attendances.workMinutes
      })
      .from(attendances)
      .where(eq(attendances.id, id))

    if(!records){
        return NextResponse.json(
          { message: "Data absensi tidak ditemukan" },
          { status: 404 }
        )
    }

    return NextResponse.json({ data: records })
  } catch (error) {
    console.error("FETCH ATTENDANCE ERROR:", error)
    return NextResponse.json(
      { message: "Gagal mengambil data absensi" },
      { status: 500 }
    )
  }
}


export async function DELETE(_, { params }) {
  const { id } = await params;

  try{
    const result = await db
      .delete(attendances)
      .where(eq(attendances.id, id));

    if(result.rowCount === 0){
      return NextResponse.json(
        { message: "Data absensi tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Data absensi dihapus" });
  }catch(error){
    console.error("DELETE ATTENDANCE ERROR:", error)
    return NextResponse.json(
      { message: "Gagal menghapus data absensi" },
      { status: 500 }
    )
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const { date, checkIn, checkOut, status, isLate, workMinutes } = await req.json();

  if(!date || !checkIn || !status || !isLate || !workMinutes) {
    return NextResponse.json(
      { message: "Data absensi tidak lengkap" },
      { status: 400 }
    );
  }
  
  try {
    const result = await db
      .update(attendances)
      .set({
        date,
        checkIn,
        checkOut,
        status,
        isLate,
        workMinutes
      })
      .where(eq(attendances.id, id));
    
    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Data absensi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Data absensi diperbarui" });
  } catch (error) {
    console.error("UPDATE ATTENDANCE ERROR:", error);
    return NextResponse.json(
      { message: "Gagal memperbarui data absensi" },
      { status: 500 }
    );
  }
}