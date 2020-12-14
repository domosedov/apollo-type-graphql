import {InputType, ClassType, Field} from 'type-graphql'

export const MyMixinInput = <T extends ClassType>(BaseClass: T) => {
    @InputType()
    class MyInput extends BaseClass {
        @Field()
        testField: boolean
    }

    return MyInput
}