import bcrypt from "bcryptjs";

const hash = await bcrypt.hash("admin01", 10);
console.log(hash);
