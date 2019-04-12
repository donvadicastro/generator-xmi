'use strict';

import {xmiClass} from "../../src/entities/xmiClass";
import {xmiComponent} from "../../src/entities/xmiComponent";
import {xmiPackage} from "../../src/entities/xmiPackage";
import {default as chalk} from "chalk";
import {xmiCollaboration} from "../../src/entities/xmiCollaboration";
import {xmiActor} from "../../src/entities/xmiActor";
import {xmiScreen} from "../../src/entities/ui/xmiScreen";
import {xmiInterface} from "../../src/entities/xmiInterface";
import {xmiComponentFactory} from "../../src/factories/xmiComponentFactory";
import {xmiUseCase} from "../../src/entities/xmiUseCase";
import {XmiGeneratorBase} from "../_base/xmiGeneratorBase";
import {xmiInstanceSpecification} from "../../src/entities/xmiInstanceSpecification";

const pascal = require('to-pascal-case');

export class XmiGenerator extends XmiGeneratorBase {
    generate() {
        this._bootstrap(['.cfignore', '.env', '.yo-rc.json']);

        this.log(chalk.green('Generate'));
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

            else if (x instanceof xmiInstanceSpecification) {
                const baseClassFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                const classFileName = this.destinationPath(`${path}/components/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath('xmiClass.generated.ejs'), baseClassFileName, options);
                this.generatedFiles.push(baseClassFileName);

                if(!this.fs.exists(classFileName)) {
                    this.fs.copyTpl(this.templatePath('xmiClass.ejs'), classFileName, options);
                    this.generatedFiles.push(classFileName);
                }
            }

            else if (x instanceof xmiClass) {
                const interfaceFileName = this.destinationPath(`${path}/contracts/${x.name}.ts`);
                const baseClassFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                const classFileName = this.destinationPath(`${path}/components/${x.name}.ts`);
                const apiRouterFileName = this.destinationPath(`${this.options.destination}/api/server/routes/${localPath}/router.ts`);

                this.fs.copyTpl(this.templatePath('xmiInterface.ejs'), interfaceFileName, options);
                this.generatedFiles.push(interfaceFileName);

                this.fs.copyTpl(this.templatePath('xmiClass.generated.ejs'), baseClassFileName, options);
                this.generatedFiles.push(baseClassFileName);

                if(!this.fs.exists(classFileName)) {
                    this.fs.copyTpl(this.templatePath('xmiClass.ejs'), classFileName, options);
                    this.generatedFiles.push(classFileName);
                }

                this.fs.copyTpl(this.templatePath('api/class/router.ejs'), apiRouterFileName, options);

                this.generatedFiles.push(apiRouterFileName);
                this.classes.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});
            }

            else if (x instanceof xmiInterface) {
                const interfaceFileName = this.destinationPath(`${path}/contracts/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath('xmiInterface.ejs'), interfaceFileName, options);
                this.generatedFiles.push(interfaceFileName);
            }

            else if (x instanceof xmiCollaboration) {
                const testFileDest = `${path}/test/process_${x.name}.ts`;
                const diagramFileName = this.destinationPath(`${path}/process/${x.name}.ts`);
                const apiRouterFileName = this.destinationPath(`${this.options.destination}/api/server/routes/${localPath}/router.ts`);
                const apiControllerFileName = this.destinationPath(`${this.options.destination}/api/server/routes/${localPath}/controller.ts`);

                this.fs.copyTpl(this.templatePath('xmiCollaboration.ejs'), diagramFileName, options);
                this.fs.copyTpl(this.templatePath('test/xmiComponent.ejs'), this.destinationPath(testFileDest), options);

                this.fs.copyTpl(this.templatePath('api/diagram/router.ejs'), apiRouterFileName, options);
                this.fs.copyTpl(this.templatePath('api/diagram/controller.ejs'), apiControllerFileName, options);

                this.testFiles.push(testFileDest);
                this.generatedFiles.push(diagramFileName);
                this.generatedFiles.push(apiRouterFileName);
                this.generatedFiles.push(apiControllerFileName);
                this.collaborationDiagrams.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});
            }

            else if (x instanceof xmiScreen) {
                const testFileDest = `${path}/test/screen_${x.name}.ts`;
                const screenFileName = this.destinationPath(`${path}/screens/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath('xmiScreen.ejs'), screenFileName, options);
                this.fs.copyTpl(this.templatePath('test/xmiScreen.ejs'), this.destinationPath(testFileDest), options);

                this.testFiles.push(testFileDest);
                this.generatedFiles.push(screenFileName);
            }

            else if (x instanceof xmiUseCase) {
                this._generateUseCase(x, options);
            }

            else if (x instanceof xmiPackage) {
                localPath || this.fs.copyTpl(this.templatePath('readme.ejs'), `${this.options.destination}/readme.md`, options);
                this._generate(`${localPath}/${x.name}`, x);
            }
        });

        const routesFileName = `${this.options.destination}/api/server/routes.ts`;
        this.fs.copyTpl(
            this.templatePath('api/routes.ejs'),
            this.destinationPath(routesFileName), {diagrams: this.collaborationDiagrams, classes: this.classes}
        );
        this.generatedFiles.push(routesFileName);

        const apiSwaggerConfig = this.destinationPath(`${this.options.destination}/api/server/swagger/api.yaml`);
        this.fs.copyTpl(
            this.templatePath('api/swagger/api.yaml.ejs'),
            apiSwaggerConfig, {diagrams: this.collaborationDiagrams, classes: this.classes}
        );
    }
}

declare var module: any;
module.exports = XmiGenerator;
