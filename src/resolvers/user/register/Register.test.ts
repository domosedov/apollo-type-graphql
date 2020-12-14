import { Connection } from "typeorm";
import faker from "faker";

import { testConn } from "../../../test-utils/testConn";
import { gCall } from "../../../test-utils/gCall";
import {User} from "../../../entities/User";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation RegisterMutation($registerData: RegisterInput!) {
  register(data: $registerData) {
    firstName
    lastName
    email
  }
}
`;

describe("Register", () => {
  it("create user", async () => {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    };

    const response = await gCall({
      source: registerMutation,
      variableValues: {
        "registerData": {
          "password": "2001",
          "firstName": "al",
          "lastName": "lex",
          "email": "al@lex.com"
        }
      }
    });

    expect(response).toMatchObject({
      data: {
        register: {
          firstName: "al",
          lastName: "lex",
          email: "al@lex.com"
        }
      }
    });

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser!.confirmed).toBeFalsy();
    expect(dbUser!.firstName).toBe(user.firstName);
  });
});