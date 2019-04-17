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
                        const content = await ejs.renderFile(path.join(dir, 'attributes.ejs'), {entity: aircraft});

                        expect(aircraft.name).toBe('aircraft');
                        expect(content.normalizeSpace()).toBe(`
                        @ObjectIdColumn() 
                        id: string; 
                        
                        @Column()
                        number: string;
                        
                        @ManyToMany(type => pilotBase)
                        pilotRefList: pilotContract[];
                        
                        @ManyToOne(type => airlineBase, airline => airline.aircraftRefList)
                        airlineRef: airlineContract;
                    `.normalizeSpace());
                    });

                    it('check one to many relation', async () => {
                        const airline = <xmiClass>classes.children[3];
                        const content = await ejs.renderFile(path.join(dir, 'attributes.ejs'), {entity: airline});

                        expect(airline.name).toBe('airline');
                        expect(content.normalizeSpace()).toBe(`
                        @ObjectIdColumn() 
                        id: string; 
                        
                        @Column()
                        name: string;
                                           
                        @OneToMany(type => aircraftBase, aircraft => aircraft.airlineRef)
                        aircraftRefList: aircraftContract[];
                        
                        @OneToOne(type => cityBase) 
                        cityRef: cityContract;
                    `.normalizeSpace());
                    });

                    it('check one to one relation', async () => {
                        const city = <xmiClass>classes.children[5];
                        const content = await ejs.renderFile(path.join(dir, 'attributes.ejs'), {entity: city});

                        expect(city.name).toBe('city');
                        expect(content.normalizeSpace()).toBe(`
                        @ObjectIdColumn() 
                        id: string; 

                        @Column()
                        name: string;
                                                
                        @OneToOne(type => airlineBase) 
                        airlineRef: airlineContract;
                    `.normalizeSpace());
                    });
                });

            });
        });
    });
});
