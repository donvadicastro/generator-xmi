import {xmiClass} from "../../src/entities/xmiClass";

const parseString = require('xml2js').parseString;

import {readJSONSync} from "fs-extra";
import {XmiParser} from "../../src/xmiParser";
import {xmiComponent} from "../../src/entities/xmiComponent";
import {xmiCollaboration} from "../../src/entities/xmiCollaboration";
import {xmiActor} from "../../src/entities/xmiActor";
import {xmiPackage} from "../../src/entities/xmiPackage";

describe('xmiParser', () => {
    describe('Activities', () => {
        it('Verify activity diagram', () => {
            const data = readJSONSync('test/data/project6_activity.json');
            const parser = new XmiParser(data);

            parser.parse();

            const pkg = <xmiPackage>parser.packge;
            const sequence: xmiCollaboration = <xmiCollaboration>(<xmiPackage>pkg.children[0]).children[0];

            expect(parser.elements.map(x => x.name)).toEqual(["sequence", "actor1", "c1", "c2"]);
            expect(sequence).toBeInstanceOf(xmiCollaboration);

            expect(sequence.lifelines.map(x => x.name)).toEqual(["actor1", "c1", "c2"]);
            expect(sequence.lifelines.map(x => x.elementRef.name)).toEqual(["actor1", "c1", "c2"]);
            expect(sequence.lifelines[0].elementRef).toBeInstanceOf(xmiActor);
            expect(sequence.lifelines[1].elementRef).toBeInstanceOf(xmiComponent);
            expect(sequence.lifelines[2].elementRef).toBeInstanceOf(xmiComponent);

            expect(sequence.messages.length).toBe(3);
            expect(sequence.messages[0].from).toBe(sequence.lifelines[0]);
            expect(sequence.messages[0].to).toBe(sequence.lifelines[1]);
            expect(sequence.messages[0].operation).toBe((<xmiClass>sequence.lifelines[1].elementRef).operations[0]);

            expect(sequence.messages[1].from).toBe(sequence.lifelines[1]);
            expect(sequence.messages[1].to).toBe(sequence.lifelines[2]);
            expect(sequence.messages[1].operation).toBe((<xmiClass>sequence.lifelines[2].elementRef).operations[0]);

            expect(sequence.messages[2].from).toBe(sequence.lifelines[2]);
            expect(sequence.messages[2].to).toBe(sequence.lifelines[1]);
            expect(sequence.messages[2].operation).toBe((<xmiClass>sequence.lifelines[1].elementRef).operations[1]);
        });
    });

    describe('Activities loop', () => {
        it('verify activity diagram with loop', () => {
            const data = readJSONSync('test/data/project11_activity_loop.json');
            const parser = new XmiParser(data);

            parser.parse();

            const pkg = <xmiPackage>parser.packge;
            const sequence: xmiCollaboration = <xmiCollaboration>(<xmiPackage>pkg.children[0]).children[0];

            expect(parser.elements.filter(x => x).map(x => x.name)).toEqual(["componentModel", "c1", "c2", "start"]);
            expect(sequence).toBeInstanceOf(xmiCollaboration);

            expect(sequence.lifelines.map(x => x.name)).toEqual(["c1", "c2"]);
            expect(sequence.lifelines.map(x => x.elementRef.name)).toEqual(["c1", "c2"]);
            expect(sequence.lifelines[0].elementRef).toBeInstanceOf(xmiComponent);
            expect(sequence.lifelines[1].elementRef).toBeInstanceOf(xmiComponent);

            expect(sequence.messages.length).toBe(3);
            expect(sequence.messages[0].from).toBeUndefined();
            expect(sequence.messages[0].to).toBe(sequence.lifelines[0]);

            expect(sequence.messages[1].from).toBe(sequence.lifelines[0]);
            expect(sequence.messages[1].to).toBe(sequence.lifelines[1]);

            expect(sequence.messages[2].from).toBe(sequence.lifelines[0]);
            expect(sequence.messages[2].to).toBe(sequence.lifelines[1]);

            expect(sequence.loopFragments.length).toBe(1);
            expect(sequence.loopFragments[0].lifelines.length).toBe(1);
            expect(sequence.loopFragments[0].lifelines[0]).toBe(sequence.messages[0].to);
            expect(sequence.lifelines[0].elementRef.fragments.length).toBe(1);
            expect(sequence.lifelines[0].elementRef.fragments[0]).toBe(sequence.loopFragments[0]);
        });
    });

    describe('Activities condition', () => {
        it('verify activity diagram with condition', () => {
            const data = readJSONSync('test/data/project11_activity_condition.json');
            const parser = new XmiParser(data);

            parser.parse();
            const pkg = <xmiPackage>parser.packge;
            const sequence: xmiCollaboration = <xmiCollaboration>(<xmiPackage>pkg.children[0]).children[0];
            const fragmentSequence: xmiCollaboration = <xmiCollaboration>(<xmiPackage>(<xmiPackage>pkg.children[0]).children[4]).children[0];

            const classes: xmiPackage = <xmiPackage>(<xmiPackage>pkg.children[0]).children[3];
            const classA = <xmiClass>classes.children[0];
            const classB = <xmiClass>classes.children[1];

            expect(sequence).toBeInstanceOf(xmiCollaboration);
            expect(sequence.messages[2].name).toBe('bfn2');
            expect(sequence.messages[2].connector.condition).toBe('a >= b');
            expect(sequence.messages[3].name).toBe('bfn3');
            expect(sequence.messages[3].connector.condition).toBe('a < b');

            expect(fragmentSequence).toBeInstanceOf(xmiCollaboration);
            expect(fragmentSequence.conditionFragments.length).toBe(1);
            expect(fragmentSequence.conditionFragments[0].operands.length).toBe(2);
            expect(fragmentSequence.conditionFragments[0].operands[0].description).toBe('a >= b');
            expect(fragmentSequence.conditionFragments[0].operands[0].fragments.length).toBe(2);
            expect(fragmentSequence.conditionFragments[0].operands[0].fragments[0].lifelines.length).toBe(1);
            expect(fragmentSequence.conditionFragments[0].operands[0].fragments[0].lifelines[0].elementRef).toBe(classA);
            expect(fragmentSequence.conditionFragments[0].operands[0].fragments[1].lifelines.length).toBe(1);
            expect(fragmentSequence.conditionFragments[0].operands[0].fragments[1].lifelines[0].elementRef).toBe(classB);

            expect(fragmentSequence.conditionFragments[0].operands[1].description).toBe('a < b');
            expect(fragmentSequence.conditionFragments[0].operands[1].fragments.length).toBe(2);
            expect(fragmentSequence.conditionFragments[0].operands[1].fragments[0].lifelines.length).toBe(1);
            expect(fragmentSequence.conditionFragments[0].operands[1].fragments[0].lifelines[0].elementRef).toBe(classA);
            expect(fragmentSequence.conditionFragments[0].operands[1].fragments[1].lifelines.length).toBe(1);
            expect(fragmentSequence.conditionFragments[0].operands[1].fragments[1].lifelines[0].elementRef).toBe(classB);

            expect(classA.conditions['classB_bfn2']).toEqual(['a >= b']);
            expect(classA.conditions['classB_bfn3']).toEqual(['a < b']);
        });
    });
});
