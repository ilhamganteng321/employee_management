import { db } from "@/db";
import { salaries, employees, users, positions } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        id: salaries.id,
        month: salaries.month,
        year: salaries.year,
        basicSalary: salaries.basicSalary,
        allowance: salaries.allowance,
        bonus: salaries.bonus,
        deduction: salaries.deduction,
        totalSalary: salaries.totalSalary,
        status: salaries.status,
        employeeId: employees.id,
        employeeName: users.name,
        positionName: positions.name
      })
      .from(salaries)
      .leftJoin(employees, eq(salaries.employeeId, employees.id))
      .leftJoin(positions, eq(employees.positionId, positions.id))
      .leftJoin(users, eq(employees.userId, users.id));

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: "Gagal mengambil data gaji", error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      employeeId,
      month,
      year,
      basicSalary,
      allowance = 0,
      bonus = 0,
      deduction = 0,
    } = body;

    if (!employeeId || !month || !year || !basicSalary) {
      return NextResponse.json(
        { message: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const totalSalary =
      basicSalary + allowance + bonus - deduction;

    await db.insert(salaries).values({
      employeeId,
      month,
      year,
      basicSalary,
      allowance,
      bonus,
      deduction,
      totalSalary,
    });

    return NextResponse.json({ message: "Data gaji berhasil ditambahkan" });
  } catch (err) {
    return NextResponse.json(
      { message: "Gagal menambahkan gaji", error: err.message },
      { status: 500 }
    );
  }
}
