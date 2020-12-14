import {Arg, ClassType, Mutation, Resolver} from "type-graphql";
import {User} from "../../entities/User";
import {RegisterInput} from "../../inputs/RegisterInput";

function createBaseResolver<T extends ClassType, X extends ClassType>(
    suffix: string,
    returnType: T,
    inputType: X,
    entity: any
) {
    @Resolver()
    class BaseResolver {

        // @Query(type => [returnType], {name: `getAll${suffix}`})
        // async getAll(@Arg("first", type => Int) first: number): Promise<T[]> {
        //     return this.items.slice(0, first);
        // }

        @Mutation(() => returnType, {name: `create${suffix}`})
        async create(
            @Arg("data", () => inputType) data: any
        ) {
            return entity.create(data).save()
        }
    }

    return BaseResolver;
}

export const CreateJopaResolver = createBaseResolver("Jopa", User, RegisterInput, User);