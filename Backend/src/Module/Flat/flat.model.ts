import {
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Types } from "mongoose";

export enum FLATTYPE {
  ONE_BHK = "1BHK",
  TWO_BHK = "2BHK",
  THREE_BHK = "3BHK",
  FOUR_BHK = "4BHK",
  OTHER = "OTHER",
}

@modelOptions({
  schemaOptions: {
    collection: "units",
    timestamps: true,
  },
})
export class IUnit {
  @prop({
    required: true,
    trim: true,
  })
  public name!: string;

  @prop({
    required: true,
    ref: "Building",
  })
  public buildingId!: Types.ObjectId;

  @prop({
    required: true,
    min: 1,
  })
  public floor!: number;

  @prop({
    required: true,
    enum: FLATTYPE,
  })
  public type!: FLATTYPE;

  @prop({
    ref: "User",
    default: null,
  })
  public ownerId?: Types.ObjectId | null;

  @prop({
    ref: "User",
    default: null,
  })
  public tenantId?: Types.ObjectId | null;

  @prop({
    default: true,
  })
  public isActive!: boolean;
}

export const UnitModel = getModelForClass(IUnit);
