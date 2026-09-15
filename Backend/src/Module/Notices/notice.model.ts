```ts
import {
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Types } from "mongoose";

// ==================== Notice Type ====================

export enum NOTICETYPE {
  GENERAL = "GENERAL",
  MAINTENANCE = "MAINTENANCE",
  EVENT = "EVENT",
  EMERGENCY = "EMERGENCY",
  MEETING = "MEETING",
  OTHER = "OTHER",
}

// ==================== Notice Priority ====================

export enum NOTICEPRIORITY {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

// ==================== Notice Model ====================

@modelOptions({
  schemaOptions: {
    collection: "notices",
    timestamps: true,
  },
})
export class INotice {
  @prop({
    required: true,
    trim: true,
  })
  public title!: string;

  @prop({
    required: true,
    trim: true,
  })
  public description!: string;

  @prop({
    required: true,
    ref: "Society",
  })
  public societyId!: Types.ObjectId;

  @prop({
    ref: "Building",
    default: null,
  })
  public buildingId?: Types.ObjectId | null;

  @prop({
    required: true,
    ref: "User",
  })
  public createdBy!: Types.ObjectId;

  @prop({
    required: true,
    enum: NOTICETYPE,
    default: NOTICETYPE.GENERAL,
  })
  public type!: NOTICETYPE;

  @prop({
    required: true,
    enum: NOTICEPRIORITY,
    default: NOTICEPRIORITY.MEDIUM,
  })
  public priority!: NOTICEPRIORITY;

  @prop({
    default: true,
  })
  public isActive!: boolean;

  @prop({
    default: null,
  })
  public expiresAt?: Date | null;

  @prop({
    type: () => [String],
    default: [],
  })
  public attachments!: string[];
}

export const NoticeModel = getModelForClass(INotice);
```
