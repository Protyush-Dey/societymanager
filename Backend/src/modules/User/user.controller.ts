import { Request, Response } from "express";
import { BaseController } from "../../Base/Base_Class/Base.controller";
import { IUser } from "./user.model";
import { UserService, userService } from "./user.service";
import { ApiResponse } from "../../Base/Base_Class/Response";

const getIdFromRequest = (req: Request): string | undefined => {
    const id = req.params.id || req.query.id || req.body._id;
    if (Array.isArray(id)) {
        return id[0];
    }
    return id ? String(id) : undefined;
};

export class UserController extends BaseController<IUser> {
    private userSvc: UserService;

    constructor() {
        super(userService);
        this.userSvc = userService;
    }

    createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, phone, password, role, email, profileImage, pushTokens, isActive } = req.body;

            if (!name || !name.first) {
                ApiResponse.error(res, "First name is required in name.first", 400);
                return;
            }

            if (!phone) {
                ApiResponse.error(res, "Phone number is required", 400);
                return;
            }

            if (!password) {
                ApiResponse.error(res, "Password is required", 400);
                return;
            }

            const newUser = await this.userSvc.createUser({
                name,
                phone,
                password,
                role,
                email,
                profileImage,
                pushTokens,
                isActive,
            });

            ApiResponse.success(res, "User created successfully", newUser, 201);
        } catch (error: any) {
            ApiResponse.error(res, error.message || "Failed to create user", 400);
        }
    };

    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const { role, isActive, search, page, limit } = req.query;

            const result = await this.userSvc.getAllUsers({
                role: role as string,
                isActive: isActive as string,
                search: search as string,
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
            });

            ApiResponse.success(res, "Users fetched successfully", result, 200);
        } catch (error: any) {
            ApiResponse.error(res, error.message || "Failed to fetch users", 500);
        }
    };

    getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = getIdFromRequest(req);
            if (!id) {
                ApiResponse.error(res, "User ID parameter is required", 400);
                return;
            }

            const user = await this.userSvc.getUserById(id);
            ApiResponse.success(res, "User fetched successfully", user, 200);
        } catch (error: any) {
            ApiResponse.error(res, error.message || "User not found", 404);
        }
    };

    getProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?._id || req.user?.id;
            if (!userId) {
                ApiResponse.error(res, "Unauthorized", 401);
                return;
            }

            const user = await this.userSvc.getUserById(userId.toString());
            ApiResponse.success(res, "Profile fetched successfully", user, 200);
        } catch (error: any) {
            ApiResponse.error(res, error.message || "Failed to fetch profile", 500);
        }
    };

    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = getIdFromRequest(req);
            if (!id) {
                ApiResponse.error(res, "User ID is required for update", 400);
                return;
            }

            const updatedUser = await this.userSvc.updateUser(id, req.body);
            ApiResponse.success(res, "User updated successfully", updatedUser, 200);
        } catch (error: any) {
            ApiResponse.error(res, error.message || "Failed to update user", 400);
        }
    };

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = getIdFromRequest(req);
            const soft = req.query.soft !== "false";

            if (!id) {
                ApiResponse.error(res, "User ID is required", 400);
                return;
            }

            const result = await this.userSvc.deleteUser(id, soft);
            ApiResponse.success(res, result.message, result, 200);
        } catch (error: any) {
            ApiResponse.error(res, error.message || "Failed to delete user", 400);
        }
    };

    addPushToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?._id || req.user?.id || req.body.userId;
            const { token } = req.body;

            if (!userId || !token) {
                ApiResponse.error(res, "User ID and push token are required", 400);
                return;
            }

            const updated = await this.userSvc.addPushToken(userId.toString(), token);
            ApiResponse.success(res, "Push token registered successfully", updated, 200);
        } catch (error: any) {
            ApiResponse.error(res, error.message || "Failed to register push token", 400);
        }
    };

    removePushToken = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?._id || req.user?.id || req.body.userId;
            const { token } = req.body;

            if (!userId || !token) {
                ApiResponse.error(res, "User ID and push token are required", 400);
                return;
            }

            const updated = await this.userSvc.removePushToken(userId.toString(), token);
            ApiResponse.success(res, "Push token removed successfully", updated, 200);
        } catch (error: any) {
            ApiResponse.error(res, error.message || "Failed to remove push token", 400);
        }
    };
}

export const userController = new UserController();
