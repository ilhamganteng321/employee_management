import {db} from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  const data = await db.select().from(users);
  const filteredData = data.map(({ password, ...rest }) => rest); // Remove password field
  return NextResponse.json(filteredData);
}


export async function POST(req){
  const body = await req.json();

  if(!body){
    return NextResponse(
      {message:"Isi semua kolom"},
      {status: 403}
    )
  }

  if(!body.name){
    return NextResponse(
      {message: "Isi nama"},
      {status: 403}
    )
  }

  await db.insert(users).values(body);
  return NextResponse({message: "Pengguna baru telah ditambahkan"})
}