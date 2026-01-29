import { db } from "@/db";
import { employees } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  const data = await db.select().from(employees);
  return NextResponse.json(data);
}

export async function POST( req) {
  const body = await req.json();
  
  if (!body.userId) {
    return NextResponse.json(
      { message: "user id wajib diisi" },
      { status: 400 }
    );
  }

  await db.insert(employees).values(body);

  return NextResponse.json({ message: "Karyawan berhasil ditambahkan" });
}
