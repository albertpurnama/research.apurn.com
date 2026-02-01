import { SignJWT, jwtVerify } from "jose";
import * as bcrypt from "bcryptjs";

const PASSWORD_HASH = process.env.PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

// Validate environment variables
if (!PASSWORD_HASH) {
  throw new Error("PASSWORD_HASH environment variable is not set");
}
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function verifyPassword(password: string): Promise<boolean> {
  return await bcrypt.compare(password, PASSWORD_HASH);
}

export async function createSession(): Promise<string> {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secretKey);

  return token;
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}
