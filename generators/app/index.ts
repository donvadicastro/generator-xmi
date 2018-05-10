'use strict';

import {XmiParser} from "../../src/xmiParser";
import {xmiClass} from "../../src/entities/xmiClass";
import {xmiComponent} from "../../src/entities/xmiComponent";
import {xmiPackage} from "../../src/entities/xmiPackage";
import {default as chalk} from "chalk";

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const treeify = require('treeify');
const parseString = require('xml2js').parseString;

export class XmiGenerator extends Generator {
    prompting() {

        this.log(yosay(`Welcome to the top-notch ${chalk.red('generator-xmi')} generator!`));
    }

    parsing() {
        this._readData((result: any) => {
            const parser = new XmiParser(result);
            parser.parse();

            this.log(chalk.green('Model'));
            this.log(treeify.asTree(parser.toConsole(), true, true));
        });
    }

    _generate(path: string, pkg: any) {
        path = path || 'dist';
        pkg = pkg || this.packge;

        pkg.children.forEach((x: any) => {
            if(x instanceof xmiClass || x instanceof xmiComponent) {
                this.fs.copyTpl(
                    this.templatePath('xmiClass.ejs'),
                    this.destinationPath(`${path}/${x.name}.js`), x);
            }

            if(x instanceof xmiPackage) {
                this.generate(`${path}/${x.name}`, x);
            }
        });
    }

    _readData(callback: (result: any) => void) {
        const file = this.fs.read(this.templatePath('../files/project6_activity.xml'));

        parseString(file, (err: any, result: any) => {
            callback(result);
            //this.fs.writeJSON(this.templatePath('../files/project6_activity.json'), result);
        });
    }
}

declare var module: any;
module.exports = XmiGenerator;