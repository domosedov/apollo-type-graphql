import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { ObjectType, Field, ID, Int, Root } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Todo extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({
    type: "text",
    default: "",
  })
  description: string;

  @Field()
  @Column({ default: false })
  isCompleted: boolean;

  @Field(() => User)
  @ManyToOne(() => User, user => user.todos)
  user: User

  @Field(() => Int)
  userId(@Root() parent: Todo): number {
    return parent.user.id;
  }
}
