import {
  Entity,
  BaseEntity,
  OneToOne,
  Column,
  PrimaryColumn,
  JoinColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import { Clan } from "./Clan";

export enum UserRoles {
  ADMIN = "admin",
  PLAYER = "player",
}

@ObjectType()
@Entity("clan_users")
export class ClanUser extends BaseEntity {
  @Field(() => String)
  @Column("text")
  userRole: UserRoles;

  @PrimaryColumn("int")
  userId: number;

  @PrimaryColumn("int")
  clanId: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Clan)
  @JoinColumn()
  clan: Clan;
}
