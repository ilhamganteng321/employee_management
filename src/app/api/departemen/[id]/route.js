import {db} from "@/db";
import { departments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { message: "ID departemen wajib diisi" },
            { status: 400 }
        );
    }

    const data = await db
        .select()
        .from(departments)
        .where(eq(departments.id, id));

    return NextResponse.json(data[0]);
}

export async function PUT(req, { params }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { message: "ID departemen wajib diisi" },
            { status: 400 }
        );
    }

    const body = await req.json();
    await db
        .update(departments)
        .set(body)
        .where(eq(departments.id, id));

    return NextResponse.json({ message: "Data departemen diupdate" });
}

export async function DELETE(_, { params }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { message: "ID departemen wajib diisi" },
            { status: 400 }
        );
    }

    await db
        .delete(departments)
        .where(eq(departments.id, id));

    return NextResponse.json({ message: "Departemen dihapus" });
}

