'use strict';

import {XmiParser} from "../../src/xmiParser";
import {xmiClass} from "../../src/entities/xmiClass";
import {xmiComponent} from "../../src/entities/xmiComponent";
import {xmiPackage} from "../../src/entities/xmiPackage";
import {default as chalk} from "chalk";
import {xmiCollaboration} from "../../src/entities/xmiCollaboration";
import {xmiActor} from "../../src/entities/xmiActor";

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const treeify = require('treeify');
const parseString = require('xml2js').parseString;

export class XmiGenerator extends (Generator as { new(args: any, opts: any): any; }) {
    constructor(args: any, opts: any) {
        super(args, opts);
        this.argument('xmiFileName', {type: String, required: true});
    }

    prompting() {
        this.log(yosay(`Welcome to the top-notch ${chalk.red('generator-xmi')} generator!`));
    }

    parsing() {
        this._readData((result: any) => {
            const parser = new XmiParser(result);
            parser.parse();

            this.log(chalk.green('Model'));
            this.log(treeify.asTree(parser.toConsole(), true, true));

            this.log(chalk.green('Generate'));
            this._generate(null, parser.packge);
        });
    }

    _generate(path: string | null, pkg: any) {
        path = path || 'dist';

        pkg.children.forEach((x: any) => {
            if(x instanceof xmiActor) {
                this.fs.copyTpl(this.templatePath('xmiActor.ejs'), this.destinationPath(`${path}/components/${x.name}.ts`), x);
            }

            if(x instanceof xmiClass || x instanceof xmiComponent) {
                this.fs.copyTpl(this.templatePath('xmiInterface.ejs'), this.destinationPath(`${path}/contracts/${x.name}.ts`), x);
                this.fs.copyTpl(this.templatePath('xmiClass.ejs'), this.destinationPath(`${path}/components/${x.name}.ts`), x);
            }

            if(x instanceof xmiCollaboration) {
                this.fs.copyTpl(this.templatePath('xmiCollaboration.ejs'), this.destinationPath(`${path}/process/${x.name}.ts`), x);
                this.fs.copyTpl(this.templatePath('test.ejs'), this.destinationPath(`${path}/test.ts`), x);
            }


            if(x instanceof xmiPackage) {
                this._generate(`${path}/${x.name}`, x);
            }
        });
    }

    _readData(callback: (result: any) => void) {
        const file = this.fs.read(this.templatePath(this.options.xmiFileName));

        parseString(file, (err: any, result: any) => {
            callback(result);
            //this.fs.writeJSON(this.templatePath('../files/test.json'), result);
        });
    }
}

declare var module: any;
module.exports = XmiGenerator;