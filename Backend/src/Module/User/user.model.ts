import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  pre,
  DocumentType,
} from "@typegoose/typegoose";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import "dotenv/config";
import { BaseModel } from "../../Base/Base.model";

@modelOptions({
    schemaOptions: {
        _id: false,
    },
})
export class IUserName {
    @prop({ required: true, trim: true })
    public first!: string;

    @prop({ trim: true, default: "" })
    public last!: string;
}

export enum USERROLE {
  SUPER_ADMIN = "SUPER_ADMIN",
  SOCIETY_ADMIN = "SOCIETY_ADMIN",
  OWNER = "OWNER",
  TENANT = "TENANT",
  STAFF = "STAFF",
  SECURITY = "SECURITY",
  RESIDENT = "RESIDENT",
}

@modelOptions({
    schemaOptions: {
        collection: "users",
        timestamps: true,
    },
})
export class IUser {
    @prop({ required: true, _id: false, type: () => IUserName })
    public name!: IUserName;

    @prop({ unique: true, sparse: true, lowercase: true, trim: true })
    public email?: string;

    @prop({ required: true, unique: true, trim: true })
    public phone!: string;

    @prop({ required: true })
    public password!: string;

    @prop({
        required: true,
        enum: USERROLE,
        default: USERROLE.RESIDENT,
    })
    public role!: USERROLE;

    @prop({ default: null })
    public profileImage?: string | null;

    @prop({ type: () => [String], default: [] })
    public pushTokens!: string[];

    @prop({ default: true })
    public isActive!: boolean;

    @prop({ default: null })
    public lastLoginAt?: Date | null;



  // password cheak
  public async isPasswordCorrect(
    this: DocumentType<User>,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }


  // genarate tokens
  public generateAccessToken(this: DocumentType<User>): string {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const expiry = process.env.ACCESS_TOKEN_EXPIRY;
    if (!secret || !expiry) throw new Error("ACCESS_TOKEN env vars missing");

    return jwt.sign(
      {
        _id: this._id,
        fullName: this.fullName,
        email: this.email,
      },
      secret,
      { expiresIn: expiry as SignOptions["expiresIn"] },
    );
  }

  public generateRefreshToken(this: DocumentType<User>): string {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const expiry = process.env.REFRESH_TOKEN_EXPIRY;
    if (!secret || !expiry) throw new Error("REFRESH_TOKEN env vars missing");

    return jwt.sign({ _id: this._id }, secret, {
      expiresIn: expiry as SignOptions["expiresIn"],
    });
  }
}

export const UserModel = getModelForClass(User);
