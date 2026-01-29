import bcrypt from "bcryptjs";

const hash = await bcrypt.hash("123000", 10);
console.log(hash);
