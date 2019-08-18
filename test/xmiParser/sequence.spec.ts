import {XmiParser} from "../../src/xmiParser";
import {xmiPackage} from "../../src/entities/xmiPackage";
import {xmiCollaboration} from "../../src/entities/xmiCollaboration";
import {xmiActor} from "../../src/entities/xmiActor";
import {xmiComponent} from "../../src/entities/xmiComponent";
import {xmiClass} from "../../src/entities/xmiClass";
import {xmiOperand} from "../../src/entities/collaboration/xmiOperand";

const parseString = require('xml2js').parseString;
const fs = require('fs');

describe('xmiParser', () => {
    describe('Sequence diagrams', () => {
        describe('Loop', () => {
            let data: any, parser: XmiParser;

            beforeEach((done) => {
                parseString(fs.readFileSync('test/data/fixtures.xml'), (err: any, result: any) => { data = result; done(); });
            });

            beforeEach(() => {
                parser = new XmiParser(data);
                parser.parse();
            });

            test('Check loop condition', () => {
                const pkg = <xmiPackage>parser.packge;
                const sequence: xmiCollaboration = <xmiCollaboration>(pkg.getNode('sequenceDiagrams.1SimpleLoop.eaCollaboration1'));

                expect(sequence).toBeInstanceOf(xmiCollaboration);
                expect(sequence.lifelines.map(x => x.name)).toEqual(["componentA", "componentB"]);
                expect(sequence.lifelines.map(x => x.elementRef.name)).toEqual(["componentA", "componentB"]);
                expect(sequence.lifelines[0].elementRef).toBeInstanceOf(xmiComponent);
                expect(sequence.lifelines[1].elementRef).toBeInstanceOf(xmiComponent);

                expect(sequence.messages.length).toBe(3);
                expect(sequence.messages[0].from).toBeUndefined();
                expect(sequence.messages[0].to).toBe(sequence.lifelines[0]);
                expect(sequence.messages[0].operation).toBe((<xmiClass>sequence.lifelines[0].elementRef).operations[0]);
                expect(sequence.messages[0].fromOperand).toBeNull();
                expect(sequence.messages[0].toOperand).toBeNull();

                expect(sequence.messages[1].from).toBe(sequence.lifelines[0]);
                expect(sequence.messages[1].to).toBe(sequence.lifelines[1]);
                expect(sequence.messages[1].operation).toBe((<xmiClass>sequence.lifelines[1].elementRef).operations[0]);
                expect(sequence.messages[1].fromOperand).toBeNull();
                expect(sequence.messages[1].toOperand).toBeNull();

                expect(sequence.messages[2].from).toBe(sequence.lifelines[0]);
                expect(sequence.messages[2].to).toBe(sequence.lifelines[1]);
                expect(sequence.messages[2].operation).toBe((<xmiClass>sequence.lifelines[1].elementRef).operations[1]);
                expect(sequence.messages[2].fromOperand).toBe(sequence.loopFragments[0].operands[0]);
                expect(sequence.messages[2].toOperand).toBe(sequence.loopFragments[0].operands[0]);

                expect(sequence.loopFragments.length).toBe(1);
                expect(sequence.loopFragments[0].lifelines.length).toBe(2);
                expect(sequence.loopFragments[0].lifelines[0]).toBe(sequence.messages[0].to);
                expect(sequence.loopFragments[0].lifelines[1]).toBe(sequence.messages[1].to);
                expect(sequence.loopFragments[0].operands.length).toBe(1);                              // fragment is split to N parts
                expect(sequence.loopFragments[0].operands[0].fragments.length).toBe(2);                 // how many parts covers each operand
                expect(sequence.lifelines[0].elementRef.fragments.length).toBe(1);                      // how many fragments this lifeline belongs to
                expect(sequence.lifelines[0].elementRef.fragments[0]).toBe(sequence.loopFragments[0]);  // map with fragment
            });
        });
    });
});
