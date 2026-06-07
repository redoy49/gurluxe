import bcrypt from "bcryptjs";

export default async function hashedPassword(password) {
  return bcrypt.hash(password, 12);
}
