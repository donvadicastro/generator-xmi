import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../../../src/xmiParser";
import {xmiPackage} from "../../../../src/entities/xmiPackage";
import {xmiComponent} from "../../../../src/entities/xmiComponent";
import '../../../../utils/normilize';
import {xmiClass} from "../../../../src/entities/xmiClass";

const path = require('path');
const ejs = require('ejs');

describe('Generators', () => {
    describe('Templates', () => {
        describe('Monolith', () => {
            describe('Class (input)', () => {
                const dir = path.join(__dirname, '../../../../generators/monolith/templates/partial/class');

                describe('check attribute references', () => {
                    const data = readJSONSync('test/data/project2_class_associations.json');
                    const parser = new XmiParser(data);

                    parser.parse();
                    const pkg = <xmiPackage>parser.packge;
                    const classes = <xmiPackage>pkg.children[0];

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
                        
                        @ManyToMany(type => Pilot)
                        pilotRefList?: Pilot[];
                        
                        @ManyToOne(type => Airline, airline => airline.aircraftRefList, {onDelete: 'CASCADE', nullable: false})
                        airlineRef: Airline;
                        
                        /** 
                         * Refresh current entity. 
                         */ 
                        async refreshEntity(references?: ('airlineRef')[]): Promise<this> { 
                            return Object.assign(this, await getRepository(Aircraft).findOne({id: this.id}, {relations: references})); 
                        }
                    `.normalizeSpace());
                    });

                    it('check one to many relation', async () => {
                        const airline = <xmiClass>classes.children[3];
                        const content = await ejs.renderFile(path.join(dir, 'links.ejs'), {entity: airline, orm: true});

                        expect(airline.name).toBe('airline');
                        expect(content.normalizeSpace()).toBe(`

                        @OneToMany(type => Aircraft, aircraft => aircraft.airlineRef, {onDelete: 'CASCADE'})
                        aircraftRefList?: Aircraft[];
                        
                        @OneToOne(type => City, city => city.airlineRef, {onDelete: 'CASCADE', nullable: false})
                        @JoinColumn()
                        cityRef: City;
                        
                        /** 
                         * Refresh current entity. 
                         */ 
                        async refreshEntity(references?: ('cityRef')[]): Promise<this> { 
                            return Object.assign(this, await getRepository(Airline).findOne({id: this.id}, {relations: references})); 
                        }
                    `.normalizeSpace());
                    });

                    it('check one to one relation', async () => {
                        const city = <xmiClass>classes.children[5];
                        const content = await ejs.renderFile(path.join(dir, 'links.ejs'), {entity: city, orm: true});

                        expect(city.name).toBe('city');
                        expect(content.normalizeSpace()).toBe(`
                                                
                        @OneToOne(type => Airline, airline => airline.cityRef, {onDelete: 'CASCADE', nullable: true}) 
                        airlineRef?: Airline;
                        
                        /** * Refresh current entity. */ 
                        async refreshEntity(references?: ('airlineRef')[]): Promise<this> { 
                            return Object.assign(this, await getRepository(City).findOne({id: this.id}, {relations: references})); 
                        }
                    `.normalizeSpace());
                    });
                });

                it('check operation return type', async () => {
                    const data = readJSONSync('test/data/project2_class.json');
                    const parser = new XmiParser(data);

                    parser.parse();

                    const pkg = <xmiPackage>parser.packge;
                    const entities = (<xmiPackage>pkg.children[0]).children;
                    const team: xmiClass = <xmiClass>entities[9];
                    const location: xmiClass = <xmiClass>entities[6];
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
                    getBaseLocation(): Promise<Location | null> { 
                        return Promise.resolve(null); 
                    }
                    `.normalizeSpace());
                });
            });
        });
    });
});
