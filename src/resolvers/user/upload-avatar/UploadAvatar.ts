import {Arg, Mutation, Resolver} from "type-graphql";
import {FileUpload, GraphQLUpload} from "graphql-upload";
import {createWriteStream} from "fs";
import path from "path"

@Resolver()
export class UploadAvatarResolver {
    @Mutation(() => Boolean)
    async uploadFile(
        @Arg("file", () => GraphQLUpload)
            file: FileUpload): Promise<boolean> {

        const { createReadStream, filename } = await file;

        console.log(createReadStream)

        // const pathName= path.join('.', 'uploads', filename);
        const pathName= path.join(__dirname, '..', '..', '..', 'uploads', filename);
        console.log(pathName)

        return new Promise(async (resolve, reject) => {
            createReadStream()
                .pipe(createWriteStream(pathName, {autoClose: true}))
                .on("finish", () => resolve(true))
                .on("error", () => reject(false))
        })
    }
}