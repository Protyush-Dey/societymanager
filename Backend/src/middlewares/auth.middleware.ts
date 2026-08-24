import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.util";
import { ApiResponse } from "../Base/Base_Class/Response";
import { UserModel, IUser } from "../modules/User/user.model";
import { USERROLE } from "../Base/Base_Class/Base.enum";
import { DocumentType } from "@typegoose/typegoose";

declare global {
    namespace Express {
        interface Request {
            user?: DocumentType<IUser> | IUser | any;
        }
    }
}

// Middleware to verify JWT authentication token from Bearer header or cookies
export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        let token =
            req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization;

        if (!token && (req as any).cookies) {
            token = (req as any).cookies.accessToken || (req as any).cookies.token;
        }

        if (!token) {
            return ApiResponse.error(res, "Access Denied: Unauthorized request, token missing", 401);
        }

        const decoded: any = verifyJwt(token);
        if (!decoded) {
            return ApiResponse.error(res, "Invalid or expired token", 401);
        }

        const userId = decoded._id || decoded.id;
        if (!userId) {
            return ApiResponse.error(res, "Invalid token payload", 401);
        }

        const user = await UserModel.findById(userId).select("-password").lean();
        if (!user) {
            return ApiResponse.error(res, "User session invalid or user not found", 401);
        }

        if (user.isActive === false) {
            return ApiResponse.error(res, "Account is deactivated. Please contact support.", 403);
        }

        req.user = user;
        return next();
    } catch (error: any) {
        return ApiResponse.error(
            res,
            "Authentication failed",
            500,
            error?.message || error
        );
    }
};

//  Middleware to authorize access based on user roles

export const authorizeRoles = (...roles: (USERROLE | string)[]) => {
    return (req: Request, res: Response, next: NextFunction): any => {
        if (!req.user) {
            return ApiResponse.error(res, "Unauthorized: User not authenticated", 401);
        }

        if (!roles.includes(req.user.role)) {
            return ApiResponse.error(
                res,
                "Forbidden: You do not have permission to access this resource",
                403
            );
        }

        return next();
    };
};
