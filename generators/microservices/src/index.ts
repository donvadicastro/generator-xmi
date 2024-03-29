'use strict';

import {xmiComponent} from "generator-xmi-core";
import {xmiPackage} from "generator-xmi-core";
import {green} from "chalk";
import {xmiCollaboration} from "generator-xmi-core";
import {xmiActor} from "generator-xmi-core";
import {xmiInterface} from "generator-xmi-core";
import {xmiComponentFactory} from "generator-xmi-core";
import {xmiUseCase} from "generator-xmi-core";
import {xmiClass} from "generator-xmi-core";
import {XmiGeneratorBase} from "../../common/src/xmiGeneratorBase";

const pascal = require('to-pascal-case');

export class XmiGenerator extends XmiGeneratorBase {
    generate() {
        this._bootstrap(['.editorconfig', '.eslintignore', '.gitignore', '.yo-rc.json'], []);

        this.log(green('Generate'));
        this._generate('', this.options.parser.packge);

        this.testFiles.forEach(x => {
            //this.spawnCommand('tsc', ['--project', this.options.destination, x]);
            this._beautify(x);
        });

        this.generatedFiles.forEach(x => this._beautify(x));
    }

    _generate(localPath: string | null, pkg: any) {
        const path = this.options.destination + '/design' + localPath;

        const options: any = {
            factory: xmiComponentFactory
        };

        pkg.children.filter((x: any) => x.name).forEach((x: any) => {
            this.log(`Processing "${x.name}" package element`);

            options.className = pascal(x.name);
            options.entity = x;

            if (x instanceof xmiActor) {
                const destFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                this.fs.copyTpl(this.templatePath('xmiActor.ejs'), destFileName, options);
                this.generatedFiles.push(destFileName);
            }

            if (x instanceof xmiInterface) {
                const interfaceFileName = this.destinationPath(`${path}/contracts/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath('xmiInterface.ejs'), interfaceFileName, options);
                this.generatedFiles.push(interfaceFileName);
            }

            if (x instanceof xmiClass || x instanceof xmiComponent) {
                const interfaceFileName = this.destinationPath(`${path}/contracts/${x.name}.ts`);
                const baseClassFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                const classFileName = this.destinationPath(`${path}/components/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath('xmiInterface.ejs'), interfaceFileName, options);
                this.generatedFiles.push(interfaceFileName);

                this.fs.copyTpl(this.templatePath('xmiClass.generated.ejs'), baseClassFileName, options);
                this.generatedFiles.push(baseClassFileName);

                if(!this.fs.exists(classFileName)) {
                    this.fs.copyTpl(this.templatePath('xmiClass.ejs'), classFileName, options);
                    this.generatedFiles.push(classFileName);
                }
            }

            if (x instanceof xmiCollaboration) {
                const diagramFileName = this.destinationPath(`${path}/process/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath('xmiCollaboration.ejs'), diagramFileName, options);
                this.generatedFiles.push(diagramFileName);
                this.collaborationDiagrams.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});
            }

            if (x instanceof xmiUseCase) {
                this._generateUseCase(x, options);
            }

            if (x instanceof xmiPackage) {
                localPath || this.fs.copyTpl(this.templatePath('readme.ejs'), `${this.options.destination}/readme.md`, options);
                localPath || this.fs.copyTpl(this.templatePath('package.json.ejs'), `${this.options.destination}/package.json`, options);

                this._generate(`${localPath}/${x.name}`, x);
            }
        });
    }
}

declare var module: any;
module.exports = XmiGenerator;
