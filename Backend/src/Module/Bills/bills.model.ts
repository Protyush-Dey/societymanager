```ts id="x9k2as"
import {
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Types } from "mongoose";

export enum BILLTYPE {
  MAINTENANCE = "MAINTENANCE",
  ELECTRICITY = "ELECTRICITY",
  WATER = "WATER",
  PARKING = "PARKING",
  OTHER = "OTHER",
}

export enum BILLSTATUS {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

@modelOptions({
  schemaOptions: {
    collection: "bills",
    timestamps: true,
  },
})
export class IBill {
  @prop({
    required: true,
    enum: BILLTYPE,
  })
  public type!: BILLTYPE;

  @prop({
    required: true,
    min: 0,
  })
  public amount!: number;

  @prop({
    required: true,
    ref: "Unit",
  })
  public unitId!: Types.ObjectId;

  @prop({
    required: true,
    enum: BILLSTATUS,
    default: BILLSTATUS.PENDING,
  })
  public status!: BILLSTATUS;

  @prop({
    required: true,
  })
  public dueDate!: Date;

  @prop({
    default: null,
  })
  public paidAt?: Date | null;

  @prop({
    trim: true,
    default: "",
  })
  public description?: string;
}

export const BillModel = getModelForClass(IBill);
```
