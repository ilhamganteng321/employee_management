import { NextResponse } from "next/server"
import {db} from "@/db"
import {attendances} from "@/db/schema"


export async function GET() {
    try {
        const records = await db.select().from(attendances)
        return NextResponse.json({data: records})
    }catch (error) {
        console.error("FETCH ATTENDANCE ERROR:", error)
        return NextResponse.json({message: "Gagal mengambil data absensi"}, {status: 500})
    }
}
