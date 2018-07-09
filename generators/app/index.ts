'use strict';

import { XmiParser } from "../../src/xmiParser";
import { xmiClass } from "../../src/entities/xmiClass";
import { xmiComponent } from "../../src/entities/xmiComponent";
import { xmiPackage } from "../../src/entities/xmiPackage";
import { default as chalk } from "chalk";
import { xmiCollaboration } from "../../src/entities/xmiCollaboration";
import { xmiActor } from "../../src/entities/xmiActor";
import { xmiScreen } from "../../src/entities/ui/xmiScreen";
import { xmiInterface } from "../../src/entities/xmiInterface";
import {xmiComponentFactory} from "../../src/factories/xmiComponentFactory";
import any = jasmine.any;

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const treeify = require('treeify');
const parseString = require('xml2js').parseString;
const pascal = require('to-pascal-case');
const beautify = require('js-beautify').js;

export class XmiGenerator extends (Generator as { new(args: any, opts: any): any; }) {
    type: string = 'default';
    dist = 'dist';

    testFiles: string[] = [];
    generatedFiles: string[] = [];

    constructor(args: any, opts: any) {
        super(args, opts);
        this.argument('xmiFileName', { type: String, required: true });
    }

    prompting() {
        this.log(yosay(`Welcome to the top-notch ${chalk.red('generator-xmi')} generator!`));
    }

    // clean() {
    //     const done = this.async();
    //
    //     this.log(chalk.green('Clean'));
    //     this.spawnCommand('rimraf', ['dist']).on('close', done);
    // }

    generate() {
        const done = this.async();

        this._readData((result: any) => {
            const parser = new XmiParser(result);
            parser.parse();

            this.log(chalk.green('Model'));
            this.log(treeify.asTree(parser.toConsole(), true, true));

            this.log(chalk.green('Bootstrap'));
            this._bootstrap();

            this.log(chalk.green('Generate'));
            this._generate(null, parser.packge);

            this.log(chalk.green('Rebuild'));

            this.testFiles.forEach(x => {this.spawnCommand('tsc', [x]); this._beautify(x); });
            this.generatedFiles.forEach(x => this._beautify(x));

            done();
        });
    }

    _bootstrap() {
        this.fs.exists(this.destinationPath(this.dist)) || this.fs.copy(
            this.templatePath(`${this.type}/bootstrap`),
            this.destinationPath(this.dist)
        );
    }

    _generate(path: string | null, pkg: any) {
        path = path || this.dist;

        const options: any = {
            factory: xmiComponentFactory
        };

        pkg.children.filter((x: any) => x.name).forEach((x: any) => {
            this.log(`Processing "${x.name} (${x.type})" package element`);

            options.className = pascal(x.name);
            options.entity = x;

            if (x instanceof xmiActor) {
                const destFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                this.fs.copyTpl(this.templatePath(`${this.type}/xmiActor.ejs`), destFileName, options);
                this.generatedFiles.push(destFileName);
            }

            if (x instanceof xmiInterface) {
                const interfaceFileName = this.destinationPath(`${path}/contracts/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath(`${this.type}/xmiInterface.ejs`), interfaceFileName, options);
                this.generatedFiles.push(interfaceFileName);
            }

            if (x instanceof xmiClass || x instanceof xmiComponent) {
                const interfaceFileName = this.destinationPath(`${path}/contracts/${x.name}.ts`);
                const baseClassFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                const classFileName = this.destinationPath(`${path}/components/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath(`${this.type}/xmiInterface.ejs`), interfaceFileName, options);
                this.generatedFiles.push(interfaceFileName);

                this.fs.copyTpl(this.templatePath(`${this.type}/xmiClass.generated.ejs`), baseClassFileName, options);
                this.generatedFiles.push(baseClassFileName);

                if(!this.fs.exists(classFileName)) {
                    this.fs.copyTpl(this.templatePath(`${this.type}/xmiClass.ejs`), classFileName, options);
                    this.generatedFiles.push(classFileName);
                }
            }

            if (x instanceof xmiCollaboration) {
                const testFileDest = `${path}/test/process_${x.name}.ts`;
                const diagramFileName = this.destinationPath(`${path}/process/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath(`${this.type}/xmiCollaboration.ejs`), diagramFileName, options);
                this.fs.copyTpl(this.templatePath(`${this.type}/test/xmiComponent.ejs`), this.destinationPath(testFileDest), options);

                this.testFiles.push(testFileDest);
                this.generatedFiles.push(diagramFileName);
            }

            if (x instanceof xmiScreen) {
                const testFileDest = `${path}/test/screen_${x.name}.ts`;
                const screenFileName = this.destinationPath(`${path}/screens/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath(`${this.type}/xmiScreen.ejs`), screenFileName, options);
                this.fs.copyTpl(this.templatePath(`${this.type}/test/xmiScreen.ejs`), this.destinationPath(testFileDest), options);

                this.testFiles.push(testFileDest);
                this.generatedFiles.push(screenFileName);
            }

            if (x instanceof xmiPackage) {
                this._generate(`${path}/${x.name}`, x);
            }
        });
    }

    _readData(callback: (result: any) => void) {
        const file = this.fs.read(this.templatePath(this.options.xmiFileName));

        parseString(file, (err: any, result: any) => {
            callback(result);
            // this.fs.writeJSON(this.templatePath('../files/test.json'), result);
        });
    }

    _beautify(filename: string) {
        this.fs.write(filename, beautify(this.fs.read(filename), {
            jslint_happy: true, preserve_newlines: false
        }));
    }
}

declare var module: any;
module.exports = XmiGenerator;