import { db } from "@/db";
import { salaries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
    const { id } = await params; 
  try {
    const data = await db
      .select()
      .from(salaries)
      .where(eq(salaries.id, id));
    
    const result = data[0]

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { message: "Gagal mengambil detail gaji", error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
    const { id } = await params; 

  try {
    const body = await req.json();

    const {
      basicSalary,
      allowance = 0,
      bonus = 0,
      deduction = 0,
      status,
    } = body;

    const totalSalary =
      basicSalary + allowance + bonus - deduction;

    await db
      .update(salaries)
      .set({
        basicSalary,
        allowance,
        bonus,
        deduction,
        totalSalary,
        status,
      })
      .where(eq(salaries.id, id));

    return NextResponse.json({ message: "Data gaji berhasil diupdate" });
  } catch (err) {
    return NextResponse.json(
      { message: "Gagal update gaji", error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
    const { id } = await params; 

  try {
    await db
      .delete(salaries)
      .where(eq(salaries.id, id));

    return NextResponse.json({ message: "Data gaji dihapus" });
  } catch (err) {
    return NextResponse.json(
      { message: "Gagal menghapus gaji", error: err.message },
      { status: 500 }
    );
  }
}
