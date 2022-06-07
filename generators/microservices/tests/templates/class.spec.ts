import {readJSONSync} from "fs-extra";
import {XmiParser} from "generator-xmi-core";
import {xmiPackage} from "generator-xmi-core";
import {xmiComponent} from "generator-xmi-core";
import '../../../common/tests/utils/normilize';

const path = require('path');
const ejs = require('ejs');

describe('Generators', () => {
    describe('Templates', () => {
        describe('Microservices', () => {
            describe('Class (input)', () => {
                const dir = path.resolve(__dirname, '../../../../generators/microservices/templates/partial/class');
                let pkg, entities, c1: any;

                beforeEach(async () => {
                    const data = readJSONSync(path.resolve(__dirname, '../../../../resources/models/project4_component.json'));

                    const parser = new XmiParser(data);
                    await parser.parse();

                    pkg = <xmiPackage>parser.packge;
                    entities = (<xmiPackage>pkg.children[0]).children;
                    c1 = <xmiComponent>entities[1];
                });

                it('check constructor', async () => {
                    const content = await ejs.renderFile(path.join(dir, 'constructor.ejs'), {entity: c1});

                    expect(content.normalizeSpace()).toBe(`constructor(kafkaClient: KafkaClientExt, dbClient: DbClient | null, topicIn?: string, topicOut?: string) {
                        super(kafkaClient, dbClient, topicIn ? [topicIn] : ['c1-fn1'], topicOut);
                    }`.normalizeSpace());
                });

                it('check methods', async () => {
                    const comments = (await ejs.renderFile(path.join(dir, 'methods_onmessage_description.ejs'))).trim();
                    const content = await ejs.renderFile(path.join(dir, 'methods.ejs'), {entity: c1});

                    expect(content.normalizeSpace()).toBe(`
                        ${comments}
                        onMessage(message: IMessageBase, kafkaMessage: Message) {
                            const prefix = config.kafka.prefix || '';

                            switch (kafkaMessage.topic) {
                                case prefix + 'c1-fn1':
                                    this.onMessage_fn1(message, kafkaMessage);
                                    break;
                            }
                        }

                        ${comments}
                        onMessage_fn1(message: IMessageBase, kafkaMessage: Message) {
                            this.send(message);
                        }
                    `.normalizeSpace());
                });
            });
        });
    });
});
