```ts id="q7m3kp"
import {
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Types } from "mongoose";

// ==================== Complaint Priority ====================

export enum COMPLAINTPRIORITY {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

// ==================== Complaint Status ====================

export enum COMPLAINTSTATUS {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

// ==================== Complaint Model ====================

@modelOptions({
  schemaOptions: {
    collection: "complaints",
    timestamps: true,
  },
})
export class IComplaint {
  @prop({
    required: true,
    trim: true,
  })
  public name!: string;

  @prop({
    required: true,
    trim: true,
  })
  public desc!: string;

  @prop({
    required: true,
    enum: COMPLAINTPRIORITY,
    default: COMPLAINTPRIORITY.MEDIUM,
  })
  public priority!: COMPLAINTPRIORITY;

  @prop({
    required: true,
    enum: COMPLAINTSTATUS,
    default: COMPLAINTSTATUS.OPEN,
  })
  public status!: COMPLAINTSTATUS;

  @prop({
    required: true,
    ref: "User",
  })
  public createdBy!: Types.ObjectId;

  @prop({
    required: true,
    ref: "Unit",
  })
  public unitId!: Types.ObjectId;

  @prop({
    default: null,
  })
  public solvedAt?: Date | null;

  @prop({
    ref: "User",
    default: null,
  })
  public solvedBy?: Types.ObjectId | null;
}

export const ComplaintModel = getModelForClass(IComplaint);
```
