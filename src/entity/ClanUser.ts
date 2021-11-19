import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  Column,
  JoinTable,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";

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

  @OneToOne(() => User)
  @JoinTable({
    name: "clan_user", // table name for the junction table of this relation
    joinColumn: {
      name: "clan",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "user",
      referencedColumnName: "id",
    },
  })
  user: User;
}
