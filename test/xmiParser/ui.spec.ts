import {XmiParser} from "../../src/xmiParser";
import {readJSONSync} from "fs-extra";
import {xmiScreen} from "../../src/entities/ui/xmiScreen";
import {xmiPackage} from "../../src/entities/xmiPackage";
import {xmiGUIElement} from "../../src/entities/ui/xmiGUIElement";
import {xmiCollaboration} from "../../src/entities/xmiCollaboration";
import xmiBase from "../../src/entities/xmiBase";
import {xmiUMLDiagram} from "../../src/entities/diagrams/xmiUMLDiagram";

describe('xmiParser', () => {
    describe('UI', () => {
        const data = readJSONSync('test/data/project8_ui.json');
        const parser = new XmiParser(data);

        parser.parse();

        it('Verify package tree', () => {
            const screen: xmiScreen = <xmiScreen>(<xmiPackage>parser.packge.children[0]).children[0];

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
        const data = readJSONSync('test/data/project8_ui_iteraction.json');
        const parser = new XmiParser(data);

        parser.parse();

        it('Verify link', () => {
            const collaboration: xmiCollaboration = <xmiCollaboration>(<xmiPackage>parser.packge.children[0]).children[0];
            const screen: xmiScreen = <xmiScreen>(<xmiPackage>parser.packge.children[1]).children[0];

            expect(collaboration).toBeInstanceOf(xmiCollaboration);
            expect(screen).toBeInstanceOf(xmiScreen);

            const button: xmiGUIElement = screen.children[1];
            expect(button.name).toBe('process');
            expect(button.links.informationFLow.length).toBe(1);

            expect(button.links.informationFLow[0].start).toBe(button);
            expect((<xmiUMLDiagram>button.links.informationFLow[0].end).elementRef).toBe(collaboration);
        });
    });
});