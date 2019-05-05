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
        describe('Microservices', () => {
            describe('Class (input)', () => {
                const dir = path.join(__dirname, '../../../../generators/monolith/templates/partial/class');

                it('check conditions', async () => {
                    const data = readJSONSync('test/data/project11_activity_condition.json');
                    const parser = new XmiParser(data);

                    parser.parse();

                    const pkg = <xmiPackage>parser.packge;
                    const classes: xmiPackage = <xmiPackage>(<xmiPackage>pkg.children[0]).children[3];
                    const classA = <xmiClass>classes.children[0];
                    const content = await ejs.renderFile(path.join(dir, 'conditions.ejs'), {entity: classA});

                    expect(content.normalizeSpace()).toBe(`
                        //# region Message conditions
                        'a >= b'(state: any) {
                            return true;
                        }
                        
                        'a < b'(state: any) {
                            return true;
                        }
                        //# endregion
                    `.normalizeSpace());
                });

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
                        id: string; 
                        
                        @Column('varchar')
                        number: string;
                    `.normalizeSpace());

                        content = await ejs.renderFile(path.join(dir, 'links.ejs'), {entity: aircraft, orm: true});

                        expect(aircraft.name).toBe('aircraft');
                        expect(content.normalizeSpace()).toBe(`
                        
                        @ManyToMany(type => pilotBase)
                        pilotRefList: pilotBase[];
                        
                        @ManyToOne(type => airlineBase, airline => airline.aircraftRefList)
                        airlineRef: airlineBase;
                    `.normalizeSpace());
                    });

                    it('check one to many relation', async () => {
                        const airline = <xmiClass>classes.children[3];
                        const content = await ejs.renderFile(path.join(dir, 'links.ejs'), {entity: airline, orm: true});

                        expect(airline.name).toBe('airline');
                        expect(content.normalizeSpace()).toBe(`

                        @OneToMany(type => aircraftBase, aircraft => aircraft.airlineRef)
                        aircraftRefList: aircraftBase[];
                        
                        @OneToOne(type => cityBase) 
                        cityRef: cityBase;
                    `.normalizeSpace());
                    });

                    it('check one to one relation', async () => {
                        const city = <xmiClass>classes.children[5];
                        const content = await ejs.renderFile(path.join(dir, 'links.ejs'), {entity: city, orm: true});

                        expect(city.name).toBe('city');
                        expect(content.normalizeSpace()).toBe(`
                                                
                        @OneToOne(type => airlineBase) 
                        airlineRef: airlineBase;
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
                    * create description. 
                    */ 
                    async create(state: FlowStateType & { x: number, }, returns?: any): Promise<FlowStateType & {returns: void | null}> { 
                        this.notifyComplete('team::create', state.start); 
                        return {...<FlowStateType>state, ...{returns: returns}}; 
                    } 
                    
                    /** 
                    * getBaseLocation description. 
                    */ 
                    async getBaseLocation(state: FlowStateType & { }, returns?: any): Promise<FlowStateType & {returns: locationBase | null}> { 
                        this.notifyComplete('team::getBaseLocation', state.start); 
                        return {...<FlowStateType>state, ...{returns: returns}}; 
                    }
                    `.normalizeSpace());
                });
            });
        });
    });
});
