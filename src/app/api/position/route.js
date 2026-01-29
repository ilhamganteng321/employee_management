// app/api/employees/route.js
import { db } from "@/db";
import { employees, positions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const data = await db
          .select({
            id: positions.id,
            name: positions.name,
            employeeCount: sql`COUNT(${employees.positionId})`.mapWith(Number),
          })
          .from(positions)
          .leftJoin(employees, eq(positions.id, employees.positionId))
          .groupBy(positions.id, positions.name);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      { error: "Failed to fetch positions" },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  const body = await req.json();
    if (!body.name) {
        return NextResponse.json(
            { message: "Nama posisi wajib diisi" },
            { status: 400 }
        );
    }

    await db.insert(positions).values(body);

    return NextResponse.json({ message: "Posisi berhasil ditambahkan" });
}