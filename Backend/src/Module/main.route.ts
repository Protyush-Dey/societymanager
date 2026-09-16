import { Application } from "express";
import userRouter from "./User/user.route";

export default function initializeModules(app: Application): void {
  try {
    app.use("/society/user", userRouter);
  } catch (error) {
    console.error("Main route initialization error:", error);
  }
}