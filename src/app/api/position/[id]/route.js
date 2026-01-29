import { db } from "@/db";
import { positions } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

/* ================= GET ================= */
export async function GET(req, { params }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { message: "ID posisi wajib diisi" },
            { status: 400 }
        );
    }

    const data = await db
        .select()
        .from(positions)
        .where(eq(positions.id, id));

    return NextResponse.json(data[0]);
}

/* ================= PUT ================= */
export async function PUT(req, { params }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { message: "ID posisi wajib diisi" },
            { status: 400 }
        );
    }

    const body = await req.json();

    await db
        .update(positions)
        .set(body)
        .where(eq(positions.id, id));

    return NextResponse.json({ message: "Data posisi diupdate" });
}

/* ================= DELETE ================= */
export async function DELETE(req, { params }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { message: "ID posisi wajib diisi" },
            { status: 400 }
        );
    }

    await db
        .delete(positions)
        .where(eq(positions.id, id));

    return NextResponse.json({ message: "Posisi dihapus" });
}
