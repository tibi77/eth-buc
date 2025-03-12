import * as dotenv from 'dotenv';
import { User } from 'src/users/user.entry';

dotenv.config();

export const mongoConfig = {
    /** Postgres */
    // type: process.env.DB_TYPE as any,
    // host: process.env.DB_HOST ?? 'localhost',
    // port: process.env.DB_PORT as any,
    // username: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,
    // entities: [User],
    // logging: true,

    /** MongoDb */
    type: process.env.DB_TYPE as any,
    url: process.env.DB_URL as string,
    entities: [User],
    useUnifiedTopology: true,
    useNewUrlParser: true,
    logging: true,
    keepConnectionAlive: true,
    logger: 'advanced-console',
    synchronize: true

};
