import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "@prisma/client";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import prisma from "../config/prisma";

export type SafeUser = Omit<User, "password">;

// Type safety for Express Request
declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}

interface DecodedToken extends JwtPayload {
  id?: string;
  _id?: string;
}

// Verify JWT token and attach user
export const verifyJwtToken = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const accessSecret = process.env.ACCESS_TOKEN_SECRET || "default_access_secret";

    const token =
      req.cookies?.AccessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
      throw new ApiError(401, "Unauthorized — no access token provided");
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, accessSecret) as DecodedToken;
    } catch {
      throw new ApiError(401, "Invalid or expired access token");
    }

    const userId = decoded.id || decoded._id;
    if (!userId) {
      throw new ApiError(401, "Invalid access token payload");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(401, "User not found or token is invalid");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Your account has been deactivated");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  }
);
