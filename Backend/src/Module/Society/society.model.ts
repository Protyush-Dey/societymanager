import { prop, modelOptions } from "@typegoose/typegoose";

export class Address {
  @prop({ required: true })
  public state!: string;

  @prop({ required: true })
  public city!: string;

  @prop({ required: true })
  public street!: string;

  @prop({ required: true })
  public pin!: string;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Society {
  @prop({ required: true, trim: true })
  public name!: string;

  @prop({ required: true, lowercase: true, trim: true })
  public email!: string;

  @prop({ required: true, trim: true })
  public phone!: string;

  @prop({
    required: true,
    type: () => Address,
    _id: false,
  })
  public address!: Address;
}