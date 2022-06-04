import {XmiParser} from "../src";
import {readJSONSync} from "fs-extra";
import {xmiScreen} from "../src";
import {xmiPackage} from "../src";
import {xmiGUIElement} from "../src";
import {xmiCollaboration} from "../src";
import {xmiUMLDiagram} from "../src";
import path = require("path");

describe('xmiParser', () => {
  describe('UI', () => {
    const data = readJSONSync(path.resolve('../../resources/models/project8_ui.json'));
    const parser = new XmiParser(data);

    beforeEach(async () => await parser.parse());

    it('Verify package tree', () => {
      const pkg = <xmiPackage>parser.packge;
      const screen: xmiScreen = <xmiScreen>(<xmiPackage>pkg.children[0]).children[0];

      expect(screen.name).toBe('admin');
      expect(screen.children.map(x => x.name)).toEqual(['firstName', 'panel', 'save']);
      expect(screen.children.map(x => x.alias)).toEqual(['firstName', undefined, undefined]);
      expect(screen.children.map(x => x.stereotype)).toEqual(['textbox', 'panel', 'button']);

      const lastName = (<xmiGUIElement>screen.children[1]).children[0];
      expect(lastName.name).toBe('lastName');
      expect(lastName.alias).toBe('lastName');
      expect(lastName.stereotype).toBeUndefined();
    });
  });

  describe('UI iteractions', () => {
    let pkg: any;

    beforeEach(async () => {
      const data = readJSONSync(path.resolve('../../resources/models/project8_ui_iteraction.json'));
      const parser = new XmiParser(data);

      await parser.parse();
      pkg = <xmiPackage>parser.packge;
    });

    it('Verify outbound link', () => {
      const collaboration: xmiCollaboration = <xmiCollaboration>(<xmiPackage>pkg.children[0]).children[0];
      const screen: xmiScreen = <xmiScreen>(<xmiPackage>pkg.children[1]).children[0];

      expect(collaboration).toBeInstanceOf(xmiCollaboration);
      expect(screen).toBeInstanceOf(xmiScreen);

      const button: xmiGUIElement = screen.children[3];
      expect(button.name).toBe('process');
      expect(button.links.informationFLow.length).toBe(1);

      expect(button.links.informationFLow[0].start).toBe(button);
      expect((<xmiUMLDiagram>button.links.informationFLow[0].end).elementRef).toBe(collaboration);
    });

    it('Verify inbound link', () => {
      const collaboration: xmiCollaboration = <xmiCollaboration>(<xmiPackage>pkg.children[0]).children[0];
      const screen: xmiScreen = <xmiScreen>(<xmiPackage>pkg.children[1]).children[2];

      expect(collaboration).toBeInstanceOf(xmiCollaboration);
      expect(screen).toBeInstanceOf(xmiScreen);

      const grid: xmiGUIElement = screen.children[0];
      expect(grid.name).toBe('dataBoundView');
      expect(grid.links.informationFLow.length).toBe(1);

      expect(grid.links.informationFLow[0].end).toBe(grid);
      expect((<xmiUMLDiagram>grid.links.informationFLow[0].start).elementRef).toBe(collaboration);
    });
  });
});
