import {KafkaClientExt} from "../../clients/kafkaClient";
import {exchanges} from "ccxt";
import {ConsumerGroup, Message} from "kafka-node";
import chalk from "chalk";
import {Topic} from "../../topics";
import {DbClient} from "../../clients/dbClient";

const config = require('../../package.json');
const ccxt = require('ccxt');

/**
 * Connector base class definition. Defines base API to work with messaging to consume and produce events
 * based on topic configuration. Also provide access to connected DB
 */
export class ExchangeConnectorProcessBase {
    /**
     * Database client.
     */
    protected dbClient: DbClient | null;

    /**
     * Kafka client.
     */
    protected kafkaClient: KafkaClientExt;

    /**
     * Kafka default consumer group.
     */
    protected kafkaConsumer: ConsumerGroup | null;

    /**
     * Topics to listen from.
     */
    protected topicIn: Topic[] = [];

    /**
     * Topic to produce event to.
     */
    protected topicOut: Topic | null = null;


    constructor(kafkaClient: KafkaClientExt, dbClient?: DbClient | null, topicIn?: Topic[], topicOut?: Topic) {
        this.kafkaClient = kafkaClient;
        this.dbClient = dbClient || null;
        this.topicIn = topicIn || this.topicIn;
        this.topicOut = topicOut || this.topicOut;

        const prefix = config.kafka.prefix || '';
        this.kafkaClient.topics.push(...this.topicIn.map(x => prefix + x));
        this.topicOut && this.kafkaClient.topics.push(prefix + this.topicOut);

        this.kafkaConsumer = null;
    }

    /**
     * Initialize and run process.
     */
    public run(): void {
        this.kafkaConsumer = this.topicIn.length ?
            this.kafkaClient.listen(this.topicIn, this.constructor.name, this.onMessage.bind(this), this.onError.bind(this)) : null;
    }

    /**
     * Consumer input message handler.
     * @param message
     * @param {Message} kafkaMessage
     */
    protected onMessage(message: any, kafkaMessage: Message) {
    }

    /**
     * Consumer error event handler.
     * @param error
     */
    protected onError(error: any): void {
        console.log(chalk.red('ERROR:'), `Consumer "${this.constructor.name}" error: ${error}`);
    }

    /**
     * Send message to topic.
     * @param data
     * @param {string} topic topic to sent to. If not specified - send to client pre-configured.
     */
    protected send(data: any, topic?: string): void {
        console.log(`Success response to be sent to "${this.topicOut}": ${JSON.stringify(data)}`);

        const t = topic || this.topicOut;
        t && this.kafkaClient.send(t, data);
    }

    /**
     * Send error to error queue.
     * @param error error data
     */
    protected sendError(error: any) {
        console.log('ERROR: ', error);
        this.kafkaClient.sendError(error);
    }
}
