import { db } from "@/db";
import { departments, employees } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all departments with employee count
    const data = await db
      .select({
        id: departments.id,
        name: departments.name,
        employeeCount: sql`COUNT(${employees.id})`.mapWith(Number),
      })
      .from(departments)
      .leftJoin(employees, eq(departments.id, employees.departmentId))
      .groupBy(departments.id, departments.name);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
    const body = await req.json();

    if (!body.name) {
        return NextResponse.json(
            { message: "Nama departemen wajib diisi" },
            { status: 400 }
        );
    }

    await db.insert(departments).values(body);

    return NextResponse.json({ message: "Departemen berhasil ditambahkan" });
}