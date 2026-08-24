import { BaseService } from "../../Base/Base_Class/Base.service";
import { IUser, UserModel } from "./user.model";
import * as bcrypt from "bcrypt";

export class UserService extends BaseService<IUser> {
    constructor() {
        super(UserModel);
    }

    async createUser(userData: Partial<IUser>) {
        const { phone, email, password } = userData;

        if (!phone) {
            throw new Error("Phone number is required");
        }

        if (!password) {
            throw new Error("Password is required");
        }

        const existingPhone = await this.model.findOne({ phone });
        if (existingPhone) {
            throw new Error("User with this phone number already exists");
        }

        if (email) {
            const existingEmail = await this.model.findOne({ email: email.toLowerCase().trim() });
            if (existingEmail) {
                throw new Error("User with this email already exists");
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.model.create({
            ...userData,
            password: hashedPassword,
        });

        const userObj = typeof (newUser as any).toObject === "function" ? (newUser as any).toObject() : { ...newUser };
        delete (userObj as any).password;
        return userObj;
    }

    async getAllUsers(query: {
        role?: string;
        isActive?: boolean | string;
        search?: string;
        page?: number;
        limit?: number;
    } = {}) {
        const { role, isActive, search, page = 1, limit = 10 } = query;
        const filter: any = {};

        if (role) {
            filter.role = role;
        }

        if (isActive !== undefined) {
            filter.isActive = String(isActive) === "true";
        }

        if (search) {
            filter.$or = [
                { "name.first": { $regex: search, $options: "i" } },
                { "name.last": { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [users, total] = await Promise.all([
            this.model
                .find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            this.model.countDocuments(filter),
        ]);

        return {
            users,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        };
    }

    async getUserById(id: string) {
        const user = await this.model.findById(id).select("-password");
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    async findByPhone(phone: string) {
        return this.model.findOne({ phone });
    }

    async findByEmail(email: string) {
        return this.model.findOne({ email: email.toLowerCase().trim() });
    }

    async updateUser(id: string, updateData: Partial<IUser>) {
        const updatePayload: any = { ...updateData };

        if (updatePayload.password) {
            updatePayload.password = await bcrypt.hash(updatePayload.password, 10);
        }

        if (updatePayload.email) {
            updatePayload.email = updatePayload.email.toLowerCase().trim();
            const existing = await this.model.findOne({
                email: updatePayload.email,
                _id: { $ne: id },
            });
            if (existing) {
                throw new Error("Email is already in use by another user");
            }
        }

        if (updatePayload.phone) {
            updatePayload.phone = updatePayload.phone.trim();
            const existing = await this.model.findOne({
                phone: updatePayload.phone,
                _id: { $ne: id },
            });
            if (existing) {
                throw new Error("Phone number is already in use by another user");
            }
        }

        const updatedUser = await this.model
            .findByIdAndUpdate(id, updatePayload, { new: true, runValidators: true })
            .select("-password");

        if (!updatedUser) {
            throw new Error("User not found");
        }

        return updatedUser;
    }

    async deleteUser(id: string, soft: boolean = true) {
        if (soft) {
            const user = await this.model.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true }
            );
            if (!user) {
                throw new Error("User not found");
            }
            return { message: "User deactivated successfully", user };
        } else {
            const deleted = await this.model.findByIdAndDelete(id);
            if (!deleted) {
                throw new Error("User not found");
            }
            return { message: "User permanently deleted successfully" };
        }
    }

    async addPushToken(id: string, token: string) {
        return this.model.findByIdAndUpdate(
            id,
            { $addToSet: { pushTokens: token } },
            { new: true }
        ).select("-password");
    }

    async removePushToken(id: string, token: string) {
        return this.model.findByIdAndUpdate(
            id,
            { $pull: { pushTokens: token } },
            { new: true }
        ).select("-password");
    }

    async updateLastLogin(id: string) {
        return this.model.findByIdAndUpdate(
            id,
            { lastLoginAt: new Date() },
            { new: true }
        );
    }
}

export const userService = new UserService();
