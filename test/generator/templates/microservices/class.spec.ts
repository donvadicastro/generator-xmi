import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../../../src/xmiParser";
import {xmiPackage} from "../../../../src/entities/xmiPackage";
import {xmiComponent} from "../../../../src/entities/xmiComponent";
import '../../../../utils/normilize';

const path = require('path');
const ejs = require('ejs');

describe('Generators', () => {
    describe('Templates', () => {
        describe('Microservices', () => {
            describe('Class (input)', () => {
                const dir = path.join(__dirname, '../../../../generators/microservices/templates/partial/class');
                const data = readJSONSync('test/data/project4_component.json');
                const parser = new XmiParser(data);

                parser.parse();

                const pkg = <xmiPackage>parser.packge;
                const entities = (<xmiPackage>pkg.children[0]).children;
                const c1: xmiComponent = <xmiComponent>entities[1];

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
