import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error(
    "🚨 JWT_SECRET và JWT_REFRESH_SECRET chưa được cấu hình trong .env"
  );
}

interface TokenPayload {
  id: number;
  role: {
    id: number;
    name: string;
  };
}

export const createAccessToken = (
  id: number,
  role: { id: number; name: string }
): string => {
  const payload: TokenPayload = { id, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
};

export const createRefreshToken = (
  id: number,
  role: { id: number; name: string }
): string => {
  const payload: TokenPayload = { id, role };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (
  token: string,
  isRefreshToken = false
): TokenPayload | null => {
  try {
    const secret = isRefreshToken ? JWT_REFRESH_SECRET : JWT_SECRET;
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return null;
  }
};
