import { db } from "@/db";
import { employees } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(_, { params }) {
  const { id } = await params;
  const data = await db
    .select()
    .from(employees)
    .where(eq(employees.userId, id));

  const karyawanData = data[0];
  if(!karyawanData){
    return NextResponse.json(
      { message: "Karyawan tidak ditemukan" },
      { status: 404 }
    );
  }
  return NextResponse.json(data[0]);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  await db
    .update(employees)
    .set(body)
    .where(eq(employees.id, id));

  return NextResponse.json({ message: "Data karyawan diupdate" });
}

export async function DELETE(_, { params }) {
  const { id } = await params;
  await db
    .delete(employees)
    .where(eq(employees.id, id));

  return NextResponse.json({ message: "Karyawan dihapus" });
}
