import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";
import { Clan } from "./Clan";

export enum UserRoles {
  ADMIN = "admin",
  PLAYER = "player",
}

@ObjectType()
@Entity("clan_users")
export class ClanUser extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("text")
  userRole: UserRoles;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Field(() => Clan)
  @OneToOne(() => Clan)
  @JoinColumn()
  clan: Clan;
}
