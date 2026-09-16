import { Router } from "express";
import { userController } from "./user.controller";
import { verifyJwtToken } from "../../middleware/Auth.middleware";

const userRouter = Router();

// Public routes
userRouter.post("/register", userController.registerUser);
userRouter.post("/logIn", userController.loginUser);
userRouter.post("/logInMobile", userController.loginUserMobile);
userRouter.post("/resetRefreshToken", userController.resetRefreshToken);

// Protected routes
userRouter.get("/me", verifyJwtToken, userController.me);
userRouter.post("/logOut", verifyJwtToken, userController.logoutUser);

export default userRouter;