import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import {ObjectType, Field, ID, Root} from "type-graphql";
import { Todo } from "./Todo";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column("varchar", { unique: true, length: 255 })
  email: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column()
  password: string;

  @Column("bool", {default: false})
  confirmed: boolean;

  @Field(() => [Todo])
  @OneToMany(() => Todo, todo => todo.user, {
    eager: true
  })
  todos: Todo[]
}
