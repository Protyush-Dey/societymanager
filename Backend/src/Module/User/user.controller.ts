import { Request, Response } from "express";
import { asyncHandler } from "../../utils/AsyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { BaseController } from "../../Base/Base.controller";
import { UserService } from "./user.service";

const userService = new UserService();

class UserController extends BaseController {

  // register the user
  registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body as Record<
      string,
      string
    >;
    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !password?.trim()
    )
      throw new ApiError(400, "All fields are required");

    const user = await userService.registerUser({
      fullName,
      email,
      password,
    });
    return this.created(res, "Registered successfully", user);
  });

  // login the user
  // loginUser = asyncHandler(async (req: Request, res: Response) => {
  //   const { email, password } = req.body as {
  //     loginInfo: string;
  //     password: string;
  //   };
  //   if (!email?.trim() || !password?.trim())
  //     throw new ApiError(400, "All fields are required");

  //   const { loginData, accessToken, refreshToken } =
  //     await userService.loginUser(email, password);

  //   return res
  //     .status(200)
  //     .clearCookie("OtpToken")
  //     .cookie("AccessToken", accessToken, this.cookieOptions)
  //     .cookie("RefreshToken", refreshToken, this.cookieOptions)
  //     .json(
  //       new ApiResponse(200, "Logged in successfully", {
  //         user: loginData,
  //       }),
  //     );
  // });
  // mobile
  loginUserMobile = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
    if (!email?.trim() || !password?.trim())
      throw new ApiError(400, "All fields are required");

    const { loginData, accessToken, refreshToken } =
      await userService.loginUser(email, password);

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Logged in successfully", {
          user: loginData,
          accestoken:accessToken,
          refreshToken:refreshToken
        }),
      );
  });


  // //me

  // me = asyncHandler(async(req:Request, res:Response)=>{
  //   const user = await userService.me(this.getUserId(req));
  //   return res
  //     .status(200)
  //     .json(new ApiResponse(200, "Logged out successfully" ,user));
  // })


  // //logout user
  // logoutUser = asyncHandler(async (req: Request, res: Response) => {
  //   await userService.logoutUser(this.getUserId(req));
  //   return res
  //     .status(200)
  //     .clearCookie("AccessToken", this.cookieOptions)
  //     .clearCookie("RefreshToken", this.cookieOptions)
  //     .json(new ApiResponse(200, "Logged out successfully"));
  // });

  // // reset refresh token
  // resetRefreshToken = asyncHandler(async (req: Request, res: Response) => {
  //   const incomingRefToken =
  //     req.cookies?.RefreshToken ||
  //     (req.headers["refreshtoken"] as string | undefined);
  //   if (!incomingRefToken) throw new ApiError(401, "Unauthorized access");

  //   const { accessToken, refreshToken } =
  //     await userService.resetRefreshToken(incomingRefToken);

  //   return res
  //     .status(200)
  //     .cookie("AccessToken", accessToken, this.cookieOptions)
  //     .cookie("RefreshToken", refreshToken, this.cookieOptions)
  //     .json(new ApiResponse(200, "Token updated successfully"));
  // });

  // //forgot password
  // forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  //   const { email } = req.body as { email: string };
  //   if (!email?.trim()) throw new ApiError(400, "Give the fields");

  //   const otp = await userService.initForgotPassword(email);
  //   return res.status(200).json(new ApiResponse(200, "OTP generated", { otp }));
  // });

  // //verify otp for password
  // verifyPasswordChangeOtp = asyncHandler(
  //   async (req: Request, res: Response) => {
  //     const { email, otp } = req.body as { email: string; otp: string };
  //     if (!email || !otp) throw new ApiError(400, "Give the fields");

  //     const otpToken = await userService.verifyOtp(email, otp);
  //     return res
  //       .status(200)
  //       .cookie("OtpToken", otpToken, this.cookieOptions)
  //       .json(new ApiResponse(200, "OTP verified"));
  //   },
  // );

  // // update password
  // updatePassword = asyncHandler(async (req: Request, res: Response) => {
  //   const { password } = req.body as { password: string };
  //   if (!password?.trim()) throw new ApiError(400, "Give a password");

  //   await userService.updatePassword(this.getUserId(req), password);
  //   return res
  //     .status(200)
  //     .clearCookie("OtpToken", this.cookieOptions)
  //     .json(new ApiResponse(200, "Password changed"));
  // });

}

export const userController = new UserController();
