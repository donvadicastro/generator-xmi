import {KafkaClientExt} from "../clients/kafkaClient";
import {DbClient} from "../clients/dbClient";

const actor = require('../process/' + <string>process.argv[2]).default;

DbClient.initialize().then((dbClient: DbClient | null) => {
    const kafkaClient: KafkaClientExt = new KafkaClientExt();
    const process = new actor(kafkaClient, dbClient);

    return kafkaClient.initialize().then(() => {
        process.run();
    });
});
