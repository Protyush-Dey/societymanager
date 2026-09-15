import {
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({
  schemaOptions: {
    collection: "buildings",
    timestamps: true,
  },
})
export class IBuilding {
  @prop({
    required: true,
    trim: true,
  })
  public name!: string;

  @prop({
    required: true,
    ref: "Society",
  })
  public societyId!: Types.ObjectId;

  @prop({
    required: true,
    min: 1,
  })
  public floorCount!: number;

  @prop({
    default: 0,
    min: 0,
  })
  public unitCount!: number;

  @prop({
    default: true,
  })
  public isActive!: boolean;
}

export const BuildingModel = getModelForClass(IBuilding);