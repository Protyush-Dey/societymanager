import {
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Types } from "mongoose";

// ==================== Relationship ====================

export enum UNITRELATIONSHIP {
  OWNER = "OWNER",
  TENANT = "TENANT",
  SPOUSE = "SPOUSE",
  CHILD = "CHILD",
  PARENT = "PARENT",
  SIBLING = "SIBLING",
  FRIEND = "FRIEND",
  OTHER = "OTHER",
}

// ==================== Access Role ====================

export enum UNITACCESSROLE {
  OWNER = "OWNER",
  RESIDENT = "RESIDENT",
  LIMITED = "LIMITED",
}

// ==================== Invitation Status ====================

export enum INVITATIONSTATUS {
  NONE = "NONE",
  INVITED = "INVITED",
  ACCEPTED = "ACCEPTED",
}

// ==================== Unit Member ====================

@modelOptions({
  schemaOptions: {
    collection: "unitMembers",
    timestamps: true,
  },
})
export class IUnitMember {
  @prop({
    required: true,
    ref: "Unit",
  })
  public unitId!: Types.ObjectId;

  @prop({
    required: true,
    ref: "User",
  })
  public userId!: Types.ObjectId;

  @prop({
    required: true,
    enum: UNITRELATIONSHIP,
  })
  public relationship!: UNITRELATIONSHIP;

  @prop({
    required: true,
    enum: UNITACCESSROLE,
    default: UNITACCESSROLE.RESIDENT,
  })
  public accessRole!: UNITACCESSROLE;

  @prop({
    required: true,
    enum: INVITATIONSTATUS,
    default: INVITATIONSTATUS.NONE,
  })
  public invitationStatus!: INVITATIONSTATUS;

  @prop({
    default: true,
  })
  public isActive!: boolean;

  @prop({
    default: null,
  })
  public joinedAt?: Date | null;

  @prop({
    default: null,
  })
  public leftAt?: Date | null;
}

export const UnitMemberModel = getModelForClass(IUnitMember);
