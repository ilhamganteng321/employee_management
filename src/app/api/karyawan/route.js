import { db } from "@/db";
import { employees, positions, users } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  const data = await db.select({
    id: employees.id,
    userId: employees.userId,
    departmentId: employees.departmentId,
    positionId : employees.positionId,
    phone: employees.phone,
    address: employees.address,
    employeeName: users.name
  }).from(employees)
  .innerJoin(users, eq(employees.userId, users.id));
  return NextResponse.json(data);
}

export async function POST(req) {
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
