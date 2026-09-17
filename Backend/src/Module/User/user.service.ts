import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import prisma from "../../config/prisma";
import { ApiError } from "../../utils/ApiError";
import { RegisterUserDto, UserSafePayload } from "./user.types";

export class UserService {
  // ─── Token Generation Helpers ───────────────────────────────────────────────

  public generateTokens(user: {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
    phone: string;
    role: UserRole;
  }): { accessToken: string; refreshToken: string } {
    const accessSecret = process.env.ACCESS_TOKEN_SECRET || "default_access_secret";
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret";
    const accessExpiry = (process.env.ACCESS_TOKEN_EXPIRY || "1d") as SignOptions["expiresIn"];
    const refreshExpiry = (process.env.REFRESH_TOKEN_EXPIRY || "10d") as SignOptions["expiresIn"];

    const accessToken = jwt.sign(
      {
        id: user.id,
        _id: user.id, // For backward compatibility
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessSecret,
      { expiresIn: accessExpiry }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
        _id: user.id,
      },
      refreshSecret,
      { expiresIn: refreshExpiry }
    );

    return { accessToken, refreshToken };
  }

  // ─── Register User ──────────────────────────────────────────────────────────

  async registerUser(data: RegisterUserDto): Promise<UserSafePayload> {
    const { first, last, phone, role, email, password } = data;

    const existingPhone = await prisma.user.findUnique({
      where: { phone: phone.trim() },
    });
    if (existingPhone) {
      throw new ApiError(409, "User with this phone number already exists");
    }

    if (email?.trim()) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (existingEmail) {
        throw new ApiError(409, "User with this email already exists");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName: first.trim(),
        lastName: last?.trim() || "",
        phone: phone.trim(),
        role: role || UserRole.SOCIETY_ADMIN,
        email: email?.trim().toLowerCase() || null,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        profileImage: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  // ─── Login User ─────────────────────────────────────────────────────────────

  async loginUser(phone: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { phone: phone.trim() },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Your account is deactivated. Please contact admin.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Incorrect password");
    }

    const { accessToken, refreshToken } = this.generateTokens(user);

    // Save refresh token in database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const loginData: UserSafePayload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { loginData, accessToken, refreshToken };
  }

  // ─── Get Current User (Me) ──────────────────────────────────────────────────

  // async me(userId: string): Promise<UserSafePayload> {
  //   const user = await prisma.user.findUnique({
  //     where: { id: userId },
  //     select: {
  //       id: true,
  //       firstName: true,
  //       lastName: true,
  //       email: true,
  //       phone: true,
  //       role: true,
  //       profileImage: true,
  //       isActive: true,
  //       createdAt: true,
  //       updatedAt: true,
  //     },
  //   });

  //   if (!user) {
  //     throw new ApiError(404, "User not found");
  //   }

  //   return user;
  // }

  // ─── Logout User ────────────────────────────────────────────────────────────

  // async logoutUser(userId: string): Promise<void> {
  //   await prisma.user.update({
  //     where: { id: userId },
  //     data: { refreshToken: null },
  //   });
  // }

  // ─── Reset Refresh Token ────────────────────────────────────────────────────

  // async resetRefreshToken(incomingRefreshToken: string) {
  //   const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "default_refresh_secret";

  //   let decoded: { id?: string; _id?: string };
  //   try {
  //     decoded = jwt.verify(incomingRefreshToken, refreshSecret) as {
  //       id?: string;
  //       _id?: string;
  //     };
  //   } catch {
  //     throw new ApiError(401, "Invalid or expired refresh token");
  //   }

  //   const userId = decoded.id || decoded._id;
  //   if (!userId) {
  //     throw new ApiError(401, "Invalid token payload");
  //   }

  //   const user = await prisma.user.findUnique({
  //     where: { id: userId },
  //   });

  //   if (!user || user.refreshToken !== incomingRefreshToken) {
  //     throw new ApiError(401, "Refresh token expired or already used");
  //   }

  //   const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(user);

  //   await prisma.user.update({
  //     where: { id: user.id },
  //     data: { refreshToken: newRefreshToken },
  //   });

  //   return { accessToken, refreshToken: newRefreshToken };
  // }
}

export const userService = new UserService();