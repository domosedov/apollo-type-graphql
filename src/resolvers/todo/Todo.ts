import { Todo } from "../../entities/Todo";
import { FieldResolver, Query, Resolver, Root } from "type-graphql";
import { User } from "../../entities/User";

@Resolver(() => Todo)
export class TodoResolver {
  @Query(() => [Todo], {nullable: true})
  async allTodos(): Promise<Todo[] | null> {
    const todos = await Todo.find({
      relations: ["user"]
    });

    if (!todos) return null;

    return todos;
  }

  // @FieldResolver()
  // async user(@Root() todo: Todo) {
  //   const usr = await User.findOne({where: { id: todo.id }});
  //   return usr;
  // }
}