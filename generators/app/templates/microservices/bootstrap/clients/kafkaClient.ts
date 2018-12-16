import {utils} from "../utils";
import {ConsumerGroup, HighLevelProducer, KafkaClient, Message} from "kafka-node";

const chalk = require('chalk');
const config = require('../package.json');

/**
 * Kafka client.
 */
export class KafkaClientExt {
    private client: KafkaClient;
    private producer: HighLevelProducer;

    public topics: string[] = [];

    constructor() {
        this.client = new KafkaClient({kafkaHost: config.kafka.url, clientId: "exchange-connector"});
        this.producer = new HighLevelProducer(this.client);
    }

    public async initialize(): Promise<KafkaClientExt> {
        await this.connect();
        await this.createTopics(this.topics);

        return this;
    }

    public send(topic: string, data: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.producer.send([{ topic: topic || '', messages: utils.encode(data), partition: 0}],
                (error, data) => error ? reject(error) : resolve())
        });
    }

    public sendError(data: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log(chalk.red('ERROR:'), data);
            this.producer.send([{ topic: 'exchange-connector-error', messages: utils.encode(data), partition: 0}],
                (error, data) => error ? reject(error) : resolve())
        });
    }

    public listen(topics: string[], groupId: string, callback: (data: any, message: Message) => void, errorCallback: (error: any) => void): ConsumerGroup {
        const consumerGroup = new ConsumerGroup({kafkaHost: config.kafka.url, groupId: groupId + 'Group'}, topics);

        console.log(`Connecting to "${topics}" topics`);
        consumerGroup.on('message', (message: Message) => callback(utils.decode(message), message));
        consumerGroup.on('error', error => errorCallback(error));

        return consumerGroup;
    }

    private connect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.producer.on('ready', () => {
                console.log("Kafka Client Producer is connected and ready.");
                resolve();
            });

            this.producer.on("error", (err: any) => reject(err));
        });
    }

    private createTopics(topics: string[]): Promise<void> {
        return config.kafka.autoCreateTopics ? new Promise<void>((resolve, reject) => {
            this.producer.createTopics([...topics, 'exchange-connector-error'], (error, data) => error ? reject(error) : resolve(data));
        }) : Promise.resolve();
    }
}
