import { DocumentType, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import * as jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { USERROLE } from "../../Base/Base_Class/Base.enum";

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

    public generateAccessToken(this: DocumentType<IUser>): string {
    const secret = process.env.ACCESS_TOKEN_SECRET || "fallback_access_token_secret";
    const expiry = (process.env.ACCESS_TOKEN_EXPIRY || "15m") as SignOptions["expiresIn"];
    if (!secret || !expiry) throw new Error("ACCESS_TOKEN env vars missing");

    return jwt.sign(
        {
            _id: this._id,
            role: this.role,
        },
        secret,
        {
            expiresIn: expiry,
        }
    );
}


    public generateRefreshToken(this: DocumentType<IUser>): string {
        const secret = process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_token_secret";
        const expiry = (process.env.REFRESH_TOKEN_EXPIRY || "7d") as SignOptions["expiresIn"];
        if (!secret || !expiry) throw new Error("REFRESH_TOKEN env vars missing");

        return jwt.sign(
            {
                _id: this._id
            },
            secret,
            {
                expiresIn: expiry,
            }
        );
    }

    // public generateOtpToken(this: DocumentType<IUser>): string {
    //     const secret = process.env.OTP_TOKEN_SECRET || "fallback_otp_token_secret";
    //     const expiry = (process.env.OTP_TOKEN_EXPIRY || "10m") as SignOptions["expiresIn"];
    //     if (!secret || !expiry) throw new Error("OTP_TOKEN env vars missing");

    //     return jwt.sign({ _id: this._id, email: this.email }, secret, {
    //         expiresIn: expiry,
    //     });
    // }
}

export const UserModel = getModelForClass(IUser);
export default UserModel;
