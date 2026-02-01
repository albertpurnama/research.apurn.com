import { SignJWT, jwtVerify } from "jose";
import * as bcrypt from "bcryptjs";

// Validate environment variables
if (!process.env.PASSWORD_HASH) {
  throw new Error("PASSWORD_HASH environment variable is not set");
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const PASSWORD_HASH: string = process.env.PASSWORD_HASH;
const JWT_SECRET: string = process.env.JWT_SECRET;

const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function verifyPassword(password: string): Promise<boolean> {
  const result = await bcrypt.compare(password, PASSWORD_HASH);
  return result;
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
