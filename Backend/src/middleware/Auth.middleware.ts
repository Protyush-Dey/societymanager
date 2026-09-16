import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import { UserModel } from "../Module/User/user.model";
import { DocumentType } from "@typegoose/typegoose";
import { IUser } from "../Module/User/user.model";

// This gives `req.user` full type safety everywhere in the codebase.
declare global {
  namespace Express {
    interface Request {
      user: DocumentType<IUser>;
    }
  }
}

// token verify
async function verifyToken(
  token: string,
  secret: string,
): Promise<JwtPayload & { _id: string }> {
  const decoded = jwt.verify(token, secret) as JwtPayload & { _id: string };
  return decoded;
}

// access token cheak
export const verifyJwtToken = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) throw new ApiError(500, "ACCESS_TOKEN_SECRET not configured");
    const token =
      req.cookies?.AccessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) throw new ApiError(401, "Unauthorized — no token provided");

    const decoded = await verifyToken(token, secret);

     const user = await UserModel.findById(decoded._id);
    if (!user) throw new ApiError(401, "Invalid access token");
    req.user = user;
    next();
  },
);

