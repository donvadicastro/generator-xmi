import {readJSONSync} from "fs-extra";
import {XmiParser} from "../src";
import {xmiInterface} from "../src";
import {xmiPackage} from "../src";
import {xmiClass} from "../src";
import path = require("path");

describe('xmiParser', () => {
  describe('Interfaces', () => {
    const data = readJSONSync(path.resolve('./resources/models/project3_interface.json'));
    const parser = new XmiParser(data);

    beforeEach(async () => await parser.parse());

    it('Verify interface realization', async () => {
      const pkg = <xmiPackage>parser.packge;
      const entities = (<xmiPackage>pkg.children[0]).children;
      const a: xmiClass = <xmiClass>entities[0];
      const b: xmiInterface = <xmiInterface>entities[2];

      //A
      expect(a.attributes.length).toBe(0);

      expect(a.operations.length).toBe(2);
      expect(a.operations[0].name).toBe('fn1');
      expect(a.operations[0].parameters.length).toBe(2);
      expect(a.operations[0].parameters[0].name).toBe('x');
      expect(a.operations[0].parameters[0].type).toBe('number');
      expect(a.operations[0].parameters[1].name).toBe('return');
      expect(a.operations[0].parameters[1].type).toBe('void');
      expect(a.operations[1].parameters[0].name).toBe('y');
      expect(a.operations[1].parameters[0].type).toBe('number');
      expect(a.operations[1].parameters[1].name).toBe('return');
      expect(a.operations[1].parameters[1].type).toBe('boolean');

      //B
      expect(b.attributes.length).toBe(2);
      expect(b.attributes[0].name).toBe('attr1');
      expect(b.attributes[0].type).toBe('number');
      expect(b.attributes[1].name).toBe('attr2');
      expect(b.attributes[1].type).toBe('boolean');

      expect(b.operations.length).toBe(2);
      expect(b.operations[0].name).toBe('fn1');
      expect(b.operations[0].parameters.length).toBe(2);
      expect(b.operations[0].parameters[0].name).toBe('x');
      expect(b.operations[0].parameters[0].type).toBe('number');
      expect(b.operations[0].parameters[1].name).toBe('return');
      expect(b.operations[0].parameters[1].type).toBe('void');
      expect(b.operations[1].parameters[0].name).toBe('y');
      expect(b.operations[1].parameters[0].type).toBe('number');
      expect(b.operations[1].parameters[1].name).toBe('return');
      expect(b.operations[1].parameters[1].type).toBe('boolean');
    });
  });
});
