import { Router } from "express";
import { userController } from "./user.controller";
import { verifyToken, authorizeRoles } from "../../middlewares/auth.middleware";
import { USERROLE } from "../../Base/Base_Class/Base.enum";

const router = Router();

// Profile endpoint (Authenticated)
router.get("/me", verifyToken, userController.getProfile);

// Push token management (Authenticated)
router.post("/push-token", verifyToken, userController.addPushToken);
router.delete("/push-token", verifyToken, userController.removePushToken);

// User CRUD endpoints
router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const userRouter = router;
