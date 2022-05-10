import {KafkaClientExt} from "../../clients/kafkaClient";
import {Message} from "kafka-node";
import chalk from "chalk";
import {DbClient} from "../../clients/dbClient";
import {IMessageBase} from "../../contracts/messages/baseMessage";

const config = require('../../package.json');

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
     * Topics to listen from.
     */
    protected topicIn: string[] = [];

    /**
     * Topic to produce event to.
     */
    protected topicOut: string | null = null;


    constructor(kafkaClient: KafkaClientExt, dbClient?: DbClient | null, topicIn?: string[], topicOut?: string) {
        this.kafkaClient = kafkaClient;
        this.dbClient = dbClient || null;
        this.topicIn = topicIn || this.topicIn;
        this.topicOut = topicOut || this.topicOut;

        const prefix = config.kafka.prefix || '';
        this.kafkaClient.topics.push(...this.topicIn.map(x => prefix + x));
        this.topicOut && this.kafkaClient.topics.push(prefix + this.topicOut);
    }

    /**
     * Initialize and run process.
     */
    public run(topicIn?: [string], topicOut?: string, callback?: (message: IMessageBase, kafkaMessage: Message) => void): void {
        (topicIn || this.topicIn || []).length &&
            this.kafkaClient.listen(topicIn || this.topicIn, this.constructor.name,
                (callback || this.onMessage).bind({context: this, topicOut: topicOut}), this.onError.bind(this));
    }

    /**
     * Consumer input message handler.
     * @param message
     * @param {Message} kafkaMessage
     */
    protected onMessage(message: IMessageBase, kafkaMessage: Message) {
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
        const t = topic || this.topicOut;

        console.log(`Success response to be sent to "${t}": ${JSON.stringify(data)}`);
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
