import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(_, { params }) {
    const { id } = await params;
    const data = await db
        .select()
        .from(users)
        .where(eq(users.id, id));

    return NextResponse.json(data[0]);
}

export async function PUT(req, { params }) {
    const { id } = await params;
    if(!id){
        return NextResponse({message:"Id harap di isi"})
    }
    const body = await req.json();
    await db
        .update(users)
        .set(body)
        .where(eq(users.id, id));

    return NextResponse.json({ message: "Data Pengguna diupdate" });
}

export async function DELETE(req, {params}){
    const {id} = await params;
    if(!id){
        return NextResponse({message:"Id harap di isi"})
    }

    const body = await req.json();
    await db
        .delete(users)
        .where(eq(users.id, id))
    
    return NextResponse.json({ message: "Data Pengguna berhasil dihapus"})
}