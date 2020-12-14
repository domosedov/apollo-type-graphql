import { createConnection } from "typeorm";

export const testConn = (drop: boolean = false) => {
  return createConnection({
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "domosed",
    password: "2001",
    database: "sandbox_1_test",
    synchronize: true,
    logging: false,
    dropSchema: drop,
    entities: [__dirname + "/../entities/*.ts"],
  });
};
