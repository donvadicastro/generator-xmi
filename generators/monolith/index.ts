'use strict';

import {xmiClass} from "../../src/entities/xmiClass";
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
import {xmiComponent} from "../../src/entities/xmiComponent";
import {xmiBoundary} from "../../src/entities/useCases/xmiBoundary";
import {xmiEnumeration} from "../../src/entities/xmiEnumeration";
import {xmiDataType} from "../../src/entities/xmiDataType";

const kebabCase = require('just-kebab-case');
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

    end() {
        this.log('\r\n\r\nProject generated successfully.\r\nUpdate configuration to start using application:');
        this.log(chalk.green('DB connection:            ') + `${this.options.destination}/package.json -> "db" section`);
        this.log(chalk.green('JIRA credentials:         ') + `${this.options.destination}/package.json -> "jira" section`);
        this.log(chalk.green('Auth server connection:   ') + `${this.options.destination}/package.json -> "keycloak" section`);
    }

    _generate(localPath: string | null, pkg: any) {
        const path = this.options.destination + '/design' + localPath;

        const options: any = {
            auth: this.options.auth,
            factory: xmiComponentFactory,
            utils: {
                kebabCase: kebabCase
            }
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

            else if (x instanceof xmiBoundary) {
                const destFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                this.fs.copyTpl(this.templatePath('xmiActor.ejs'), destFileName, options);
                this.generatedFiles.push(destFileName);
            }

            else if (x instanceof xmiEnumeration) {
                const fileName = `${path}/enums/${x.name}.ts`;
                const destFileName = this.destinationPath(fileName);

                this.fs.copyTpl(this.templatePath('xmiEnumeration.ejs'), destFileName, options);
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

            else if (x instanceof xmiComponent) {
                const interfaceFileName = this.destinationPath(`${path}/contracts/${x.name}.ts`);
                const baseClassFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                const classFileName = this.destinationPath(`${path}/components/${x.name}.ts`);
                const classTestFileName = this.destinationPath(`${path}/components/${x.name}.test.ts`);

                this.fs.copyTpl(this.templatePath('xmiInterface.ejs'), interfaceFileName, options);
                this.generatedFiles.push(interfaceFileName);

                this.fs.copyTpl(this.templatePath('xmiComponent.generated.ejs'), baseClassFileName, options);
                this.generatedFiles.push(baseClassFileName);

                if(!this.fs.exists(classFileName)) {
                    this.fs.copyTpl(this.templatePath('xmiClass.ejs'), classFileName, options);
                    this.generatedFiles.push(classFileName);
                }

                if(!this.fs.exists(classTestFileName)) {
                    this.fs.copyTpl(this.templatePath('xmiComponent.test.ejs'), classTestFileName, options);
                    // this.generatedFiles.push(classTestFileName);
                }
            }

            else if (x instanceof xmiDataType) {
                const baseClassFileName = this.destinationPath(`${path}/types/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath('xmiDataType.ejs'), baseClassFileName, options);
                this.generatedFiles.push(baseClassFileName);
                this.dataTypes.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});
            }

            else if (x instanceof xmiClass) {
                const interfaceFileName = this.destinationPath(`${path}/contracts/${x.name}.ts`);
                const baseClassFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                const classFileName = this.destinationPath(`${path}/components/${x.name}.ts`);
                const apiRouterFileName = this.destinationPath(`${this.options.destination}/api/server/routes/${localPath}/${x.name}.router.ts`);
                const appComponentRootPath = this.destinationPath(`${this.options.destination}/app/pages/administration/${localPath}`);

                const editComponentFileName = `${appComponentRootPath}/${x.name}/edit/component.ts`;
                const listComponentFileName = `${appComponentRootPath}/${x.name}/list/component.ts`;

                this.fs.copyTpl(this.templatePath('xmiInterface.ejs'), interfaceFileName, options);
                this.generatedFiles.push(interfaceFileName);

                this.fs.copyTpl(this.templatePath('xmiClass.generated.ejs'), baseClassFileName, options);
                this.generatedFiles.push(baseClassFileName);

                if(!this.fs.exists(classFileName)) {
                    this.fs.copyTpl(this.templatePath('xmiClass.ejs'), classFileName, options);
                    this.generatedFiles.push(classFileName);
                }

                //api
                this.fs.copyTpl(this.templatePath('api/class/router.ejs'), apiRouterFileName, options);

                //app
                this.fs.copyTpl(this.templatePath('app/edit/component.ts.ejs'), editComponentFileName, options);
                this.fs.copyTpl(this.templatePath('app/edit/component.html.ejs'), `${appComponentRootPath}/${x.name}/edit/component.html`, options);
                this.fs.write(`${appComponentRootPath}/${x.name}/edit/component.sass`, '');

                this.fs.copyTpl(this.templatePath('app/list/component.ts.ejs'), listComponentFileName, options);
                this.fs.copyTpl(this.templatePath('app/list/component.html.ejs'), `${appComponentRootPath}/${x.name}/list/component.html`, options);
                this.fs.write(`${appComponentRootPath}/${x.name}/list/component.sass`, '');

                this.generatedFiles.push(apiRouterFileName);
                this.generatedFiles.push(editComponentFileName);
                this.generatedFiles.push(listComponentFileName);

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
                const appComponentRootPath = this.destinationPath(`${this.options.destination}/app/pages/screens/${localPath}`);
                const screenComponentFileName = `${appComponentRootPath}/${x.name}/component.ts`;

                this.fs.copyTpl(this.templatePath('xmiScreen.ejs'), screenFileName, options);
                this.fs.copyTpl(this.templatePath('test/xmiScreen.ejs'), this.destinationPath(testFileDest), options);

                //edit form
                this.fs.copyTpl(this.templatePath('app/screen/component.ts.ejs'), screenComponentFileName, options);
                this.fs.copyTpl(this.templatePath('app/screen/component.html.ejs'), `${appComponentRootPath}/${x.name}/component.html`, options);
                this.fs.write(`${appComponentRootPath}/${x.name}/component.sass`, '');

                this.generatedFiles.push(screenFileName);
                this.generatedFiles.push(screenComponentFileName);

                this.testFiles.push(testFileDest);
                this.screens.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});
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
            this.destinationPath(routesFileName), {diagrams: this.collaborationDiagrams, classes: this.classes, options: options}
        );
        this.generatedFiles.push(routesFileName);

        const apiSwaggerConfig = this.destinationPath(`${this.options.destination}/api/server/swagger/api.yaml`);
        this.fs.copyTpl(
            this.templatePath('api/swagger/api.yaml.ejs'),
            apiSwaggerConfig, {diagrams: this.collaborationDiagrams, classes: this.classes, dataTypes: this.dataTypes, options: options}
        );

        const ormConfig = this.destinationPath(`${this.options.destination}/ormconfig.json`);
        this.fs.copyTpl(this.templatePath('config/ormconfig.json.ejs'), ormConfig, {classes: this.classes, options: options});

        const appModule = this.destinationPath(`${this.options.destination}/app/pages/app.module.ts`);
        this.fs.copyTpl(this.templatePath('app/module.ejs'), appModule, {classes: this.classes, screens: this.screens, options: options});

        const appRoutes = this.destinationPath(`${this.options.destination}/app/pages/routing.module.ts`);
        this.fs.copyTpl(this.templatePath('app/routes.ejs'), appRoutes, {classes: this.classes, screens: this.screens, options: options});

        const appMainPage = this.destinationPath(`${this.options.destination}/app/pages/master/app.component.html`);
        this.fs.copyTpl(this.templatePath('app/master.html.ejs'), appMainPage, {classes: this.classes, screens: this.screens, options: options});
    }
}

declare var module: any;
module.exports = XmiGenerator;
