import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function GET() {
  const data = await db.select().from(users);
  const filteredData = data.map(({ password, ...rest }) => rest); // Remove password field
  return NextResponse.json(filteredData);
}


export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, role, status, password } = body;

    // Validasi input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Semua kolom wajib diisi" },
        { status: 400 }
      );
    }


    // Validasi password strength (opsional)
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Hash password dengan bcrypt
    const saltRounds = 10; // Cost factor, semakin tinggi semakin aman tapi lebih lambat
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Data yang akan disimpan
    const userData = {
      name,
      email,
      role,
      status: status || 'active', // Default status
      password: hashedPassword,
      createdAt: new Date()
    };

    // Simpan ke database
    await db.insert(users).values(userData);

    // Jangan kembalikan password (bahkan yang sudah di-hash)
    const userResponse = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
      createdAt: userData.createdAt,
    };

    return NextResponse.json(
      {
        message: "Pengguna baru telah ditambahkan",
        user: userResponse
      },
      { status: 201 }
    );
  } catch (e) {
    console.log("error server", e)
    return NextResponse.json({ message: "Error internal server" }, { status: 500 })
  }
}