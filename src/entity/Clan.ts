import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";

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

  @OneToOne(() => User)
  @JoinColumn()
  admin: User;

  @OneToMany(() => User, (user) => user)
  users: User[];
}
