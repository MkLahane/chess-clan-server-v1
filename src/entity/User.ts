import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

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

  @Column("int", { default: 0 })
  tokenVersion: number;
}
