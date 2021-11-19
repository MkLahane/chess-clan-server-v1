import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { Clan } from "./Clan";
import { ClanUser } from "./ClanUser";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column("text")
  name: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Field(() => String)
  @Column("text")
  username: string;

  @Column("text")
  password: string;

  @Field(() => Int)
  @Column("int", { default: 400 })
  rating: number;

  @Field(() => Clan, { nullable: true })
  @OneToOne(() => Clan, { nullable: true, cascade: true })
  @JoinColumn({ name: "clan_id", referencedColumnName: "id" })
  clan: Clan;

  @Field(() => ClanUser, { nullable: true })
  @OneToOne(() => ClanUser, {
    nullable: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "clan_user_id", referencedColumnName: "id" })
  clanUser: ClanUser;

  @Column("int", { default: 0 })
  tokenVersion: number;
}
