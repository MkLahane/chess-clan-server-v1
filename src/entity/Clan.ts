import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { ClanUser } from "./ClanUser";

@ObjectType()
@Entity("clans")
export class Clan extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("text")
  name: string;

  @Field(() => Int)
  @Column({ default: 0 })
  ranking: number;

  @ManyToMany(() => ClanUser)
  @JoinTable({ name: "joint_clan_users" })
  clanUsers: ClanUser[];
}

// @JoinTable({
//     name: "clan_user", // table name for the junction table of this relation
//     joinColumn: {
//       name: "clan",
//       referencedColumnName: "id",
//     },
//     inverseJoinColumn: {
//       name: "user",
//       referencedColumnName: "id",
//     },
//   })
//   user: User;
