import type { Application } from "express";
import mongoose from "mongoose";
import { userRouter } from "./User/user.router";

export default function initializeModules(app: Application): void {
    console.log("Initializing modules...");

    app.use("/api/users", userRouter);

    console.log("Registered Models:", mongoose.modelNames());
}
