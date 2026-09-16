import { UserRole } from "@prisma/client";

export interface RegisterUserDto {
  first: string;
  last?: string;
  phone: string;
  role?: UserRole;
  email?: string;
  password: string;
}

export interface LoginUserDto {
  phone: string;
  password: string;
}

export interface UserSafePayload {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string;
  role: UserRole;
  profileImage: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenPayload {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  phone: string;
  role: UserRole;
}
