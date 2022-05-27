import {Db, MongoClient} from "mongodb";
import chalk from "chalk";
const config = require('../package.json');

export class DbClient {
    private mongoClient: MongoClient;
    private db: Db;

    public get DB() {
        return this.db;
    }

    constructor(mongoClient: MongoClient) {
        this.mongoClient = mongoClient;
        this.db = mongoClient.db('exchange-connector-store');
    }

    static initialize(): Promise<DbClient | null> {
        const mongoConfig = config.mongo || {};
        const url = mongoConfig.url;

        return new Promise(((resolve, reject) => (url && mongoConfig.active) ? MongoClient.connect(url, (err: any, client: MongoClient) => {
                if(err) {
                    console.log(chalk.red("Failed to connect to server"), err);
                    reject();
                } else {
                    console.log(chalk.green("Connected successfully to server"));
                    resolve(new DbClient(client));
                }
            }) : resolve(null)
        ))
    }
}
