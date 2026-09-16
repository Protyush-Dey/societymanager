import { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { BaseController } from "../../Base/Base.controller";
import { userService } from "./user.service";

class UserController extends BaseController {
  // ─── Register User ──────────────────────────────────────────────────────────
  registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { first, last, phone, role, email, password } = req.body as {
      first?: string;
      last?: string;
      phone?: string;
      role?: UserRole;
      email?: string;
      password?: string;
    };

    if (!first?.trim() || !phone?.trim() || !password?.trim()) {
      throw new ApiError(400, "First name, phone, and password are required");
    }

    const user = await userService.registerUser({
      first: first.trim(),
      last: last?.trim() || "",
      phone: phone.trim(),
      role: role || UserRole.SOCIETY_ADMIN,
      email: email?.trim().toLowerCase() || undefined,
      password,
    });

    return this.created(res, "User registered successfully", user);
  });

  // ─── Web Login (Cookie + JSON) ──────────────────────────────────────────────
  loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { phone, password } = req.body as {
      phone?: string;
      password?: string;
    };

    if (!phone?.trim() || !password?.trim()) {
      throw new ApiError(400, "Phone number and password are required");
    }

    const { loginData, accessToken, refreshToken } =
      await userService.loginUser(phone, password);

    return res
      .status(200)
      .cookie("AccessToken", accessToken, this.cookieOptions)
      .cookie("RefreshToken", refreshToken, this.cookieOptions)
      .json(
        new ApiResponse(200, "Logged in successfully", {
          user: loginData,
          accessToken,
          refreshToken,
        })
      );
  });

  // ─── Mobile Login (JSON Token Payload) ──────────────────────────────────────
  loginUserMobile = asyncHandler(async (req: Request, res: Response) => {
    const { phone, password } = req.body as {
      phone?: string;
      password?: string;
    };

    if (!phone?.trim() || !password?.trim()) {
      throw new ApiError(400, "Phone number and password are required");
    }

    const { loginData, accessToken, refreshToken } =
      await userService.loginUser(phone, password);

    return res.status(200).json(
      new ApiResponse(200, "Logged in successfully", {
        user: loginData,
        accessToken,
        refreshToken,
      })
    );
  });

  // ─── Get Current User Profile ───────────────────────────────────────────────
  me = asyncHandler(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    const user = await userService.me(userId);

    return this.ok(res, "User profile retrieved successfully", user);
  });

  // ─── Logout User ────────────────────────────────────────────────────────────
  logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = this.getUserId(req);
    if (userId) {
      await userService.logoutUser(userId);
    }

    return res
      .status(200)
      .clearCookie("AccessToken", this.cookieOptions)
      .clearCookie("RefreshToken", this.cookieOptions)
      .json(new ApiResponse(200, "Logged out successfully"));
  });

  // ─── Refresh Access Token ───────────────────────────────────────────────────
  resetRefreshToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken =
      req.cookies?.RefreshToken ||
      (req.headers["refreshtoken"] as string | undefined) ||
      (req.headers["x-refresh-token"] as string | undefined) ||
      req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "No refresh token provided");
    }

    const { accessToken, refreshToken } =
      await userService.resetRefreshToken(incomingRefreshToken);

    return res
      .status(200)
      .cookie("AccessToken", accessToken, this.cookieOptions)
      .cookie("RefreshToken", refreshToken, this.cookieOptions)
      .json(
        new ApiResponse(200, "Token refreshed successfully", {
          accessToken,
          refreshToken,
        })
      );
  });
}

export const userController = new UserController();
