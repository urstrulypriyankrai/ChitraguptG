import bcrypt from "bcryptjs";

export default async function CheckPassword(
  plainPassword: string,
  hashedPassword: string
) {
  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  return isValid;
}
