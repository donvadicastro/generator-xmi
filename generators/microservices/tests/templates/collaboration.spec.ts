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
            describe('Collaboration', () => {
                const dir = path.resolve(__dirname, '../../../../generators/microservices/templates');
                const data = readJSONSync(path.resolve(__dirname, '../../../../resources/models/project6_activity.json'));
                const parser = new XmiParser(data);

                beforeEach(async () => await parser.parse());

                it('check template generation', async () => {
                    const pkg = <xmiPackage>parser.packge;
                    const entities = (<xmiPackage>pkg.children[0]).children;
                    const c1 = <xmiComponent>entities[0];
                    const content = await ejs.renderFile(path.join(dir, 'xmiCollaboration.ejs'), {entity: c1});

                    expect(content.normalizeSpace()).toBe(`
                        import {KafkaClientExt} from '../../../clients/kafkaClient';
                        import {DbClient} from '../../../clients/dbClient';
                        import actor1 from '../../sequence/components/actor1';
                        import c1 from '../../sequence/components/c1';
                        import c2 from '../../sequence/components/c2';

                        DbClient.initialize().then((dbClient: DbClient | null) => {
                            const kafkaClient: KafkaClientExt = new KafkaClientExt();
                            const singleRun: string | boolean = <string>process.argv[2] || false;

                            const actor1Process = new actor1(kafkaClient, dbClient);
                            const c1Process = new c1(kafkaClient, dbClient);
                            const c2Process = new c2(kafkaClient, dbClient);

                            return kafkaClient.initialize().then(() => {
                                (singleRun === false || singleRun === null) && actor1Process.run(null, 'c1-fn1');
                                (singleRun === false || singleRun === 'c1-fn1') && c1Process.run(['c1-fn1'], 'c2-fn2');
                                (singleRun === false || singleRun === 'c2-fn2') && c2Process.run(['c2-fn2'], 'c1-ret1');
                            });
                        });`.normalizeSpace());
                });
            });
        });
    });
});
