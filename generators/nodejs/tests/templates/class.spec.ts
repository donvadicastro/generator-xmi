import {readJSONSync} from "fs-extra";
import {xmiClass, xmiPackage, XmiParser} from "generator-xmi-core";
import '../../../common/tests/utils/normilize';
import * as fs from "fs";
import {parseString} from "xml2js";

const path = require('path');
const ejs = require('ejs');

describe('Generators', () => {
    describe('Templates', () => {
        describe('Monolith', () => {
            describe('Class (input)', () => {
                const dir = path.resolve(__dirname, '../../../../generators/nodejs/templates/partial/class');

                describe('check attribute references', () => {
                    let pkg, classes: any;

                    beforeEach(async () => {
                        const data = readJSONSync(path.resolve(__dirname, '../../../../resources/models/project2_class_associations.json'));
                        const parser = new XmiParser(data);
                        await parser.parse();

                        pkg = <xmiPackage>parser.packge;
                        classes = <xmiPackage>pkg.children[0];
                    });

                    it('check many to one relation', async () => {
                        const aircraft = <xmiClass>classes.children[0];
                        let content = await ejs.renderFile(path.join(dir, 'attributes.ejs'), {entity: aircraft, orm: true});

                        expect(aircraft.name).toBe('aircraft');
                        expect(content.normalizeSpace()).toBe(`
                        @PrimaryGeneratedColumn()
                        id?: number;

                        @Column('varchar')
                        number: string;
                    `.normalizeSpace());

                        content = await ejs.renderFile(path.join(dir, 'links.ejs'), {entity: aircraft, orm: true});

                        expect(aircraft.name).toBe('aircraft');
                        expect(content.normalizeSpace()).toBe(`

                        @ManyToMany(type => basicClassDiagramWithMultiplicities_pilot)
                        @JoinTable()
                        pilotRefList?: basicClassDiagramWithMultiplicities_pilot[];

                        @ManyToOne(type => basicClassDiagramWithMultiplicities_airline, airline => airline.aircraftRefList, {onDelete: 'CASCADE', nullable: false})
                        airlineRef: basicClassDiagramWithMultiplicities_airline;

                        /**
                         * Refresh current entity.
                         */
                        async refreshEntity(references?: ('airlineRef')[]): Promise<this> {
                            return Object.assign(this, await getRepository(Aircraft).findOne({id: this.id}, {relations: references}));
                        }
                    `.normalizeSpace());
                    });

                    it('check one to many association', async () => {
                        const airline = <xmiClass>classes.children[3];
                        const content = await ejs.renderFile(path.join(dir, 'links.ejs'), {entity: airline, orm: true});

                        expect(airline.name).toBe('airline');
                        expect(content.normalizeSpace()).toBe(`

                        @OneToMany(type => basicClassDiagramWithMultiplicities_aircraft, aircraft => aircraft.airlineRef, {onDelete: 'CASCADE'})
                        aircraftRefList?: basicClassDiagramWithMultiplicities_aircraft[];

                        @OneToOne(type => basicClassDiagramWithMultiplicities_city, city => city.airlineRef, {onDelete: 'CASCADE', nullable: false})
                        @JoinColumn()
                        cityRef: basicClassDiagramWithMultiplicities_city;

                        /**
                         * Refresh current entity.
                         */
                        async refreshEntity(references?: ('cityRef')[]): Promise<this> {
                            return Object.assign(this, await getRepository(Airline).findOne({id: this.id}, {relations: references}));
                        }
                    `.normalizeSpace());
                    });

                    it('check one to one association', async () => {
                        const city = <xmiClass>classes.children[5];
                        const content = await ejs.renderFile(path.join(dir, 'links.ejs'), {entity: city, orm: true});

                        expect(city.name).toBe('city');
                        expect(content.normalizeSpace()).toBe(`

                        @OneToOne(type => basicClassDiagramWithMultiplicities_airline, airline => airline.cityRef, {onDelete: 'CASCADE', nullable: true})
                        airlineRef?: basicClassDiagramWithMultiplicities_airline;

                        /** * Refresh current entity. */
                        async refreshEntity(references?: ('airlineRef')[]): Promise<this> {
                            return Object.assign(this, await getRepository(City).findOne({id: this.id}, {relations: references}));
                        }
                    `.normalizeSpace());
                    });
                });

                it('check operation return type', async () => {
                    const data = readJSONSync(path.resolve(__dirname, '../../../../resources/models/project2_class.json'));
                    const parser = new XmiParser(data);

                    await parser.parse();

                    const pkg = <xmiPackage>parser.packge;
                    const entities = (<xmiPackage>pkg.children[0]).children;
                    const team: xmiClass = <xmiClass>entities[9];
                    const content = await ejs.renderFile(path.join(dir, 'operations.ejs'), {entity: team, orm: true});

                    expect(content.normalizeSpace()).toBe(`
                    /**
                    * create action.
                    */
                    create(x: number,): Promise<void | null> {
                        return Promise.resolve(null);
                    }

                    /**
                    * getBaseLocation action.
                    */
                    getBaseLocation(): Promise<testModel_location | null> {
                        return Promise.resolve(null);
                    }
                    `.normalizeSpace());
                });

                describe('check links', () => {
                    let entities: any[];

                    beforeAll((done) => {
                        parseString(fs.readFileSync(path.resolve(__dirname, '../../../../resources/models/fixtures.xml')), (err: any, result: any) => {
                            const parser = new XmiParser(result);
                            parser.parse().then(() => {
                                const pkg = <xmiPackage>parser.packge;
                                entities = (<xmiPackage>pkg.children[2]).children;

                                done();
                            });
                        });
                    });

                    it('composition', async () => {
                        const addressClass: xmiClass = <xmiClass>entities[2].children[0];
                        const personClass: xmiClass = <xmiClass>entities[2].children[2];
                        const addressContent = await ejs.renderFile(path.join(dir, 'links.ejs'), {entity: addressClass, orm: true});
                        const personContent = await ejs.renderFile(path.join(dir, 'links.ejs'), {entity: personClass, orm: true});

                        expect(addressContent.normalizeSpace()).toBe(`
                            @OneToOne(() => classDiagrams_x3CompositionRelation_person, (ref) => ref.addressRef, { nullable: false, onDelete: "CASCADE" })
                            @JoinColumn()
                            personRef: classDiagrams_x3CompositionRelation_person;

                           /**
                            * Refresh current entity.
                            */
                            async refreshEntity(references?: ('personRef')[]): Promise<this> {
                                return Object.assign(this, await getRepository(Address).findOne({id: this.id}, {relations: references}));
                            }`.normalizeSpace());

                        expect(personContent.normalizeSpace()).toBe(`
                            @OneToOne(() => classDiagrams_x3CompositionRelation_address,  (ref) => ref.personRef)
                            addressRef: classDiagrams_x3CompositionRelation_address;

                            /**
                             * Refresh current entity.
                             */
                             async refreshEntity(references?: ('addressRef')[]): Promise<this> {
                                return Object.assign(this, await getRepository(Person).findOne({id: this.id}, {relations: references}));
                             }
                        `.normalizeSpace());
                    });
                });
            });
        });
    });
});
