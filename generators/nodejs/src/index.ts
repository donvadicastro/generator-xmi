'use strict';

import {
    xmiActor,
    xmiBoundary,
    xmiClass,
    xmiCollaboration,
    xmiComponent,
    xmiComponentFactory,
    xmiDataType,
    xmiEnumeration,
    xmiInstanceSpecification,
    xmiInterface,
    xmiPackage,
    xmiScreen,
    xmiUseCase
} from "generator-xmi-core";
import {green, yellow} from "chalk";
import {existsSync, readdirSync, statSync} from 'fs';
import * as path from 'path';
import {join} from 'path';
import {js as beautify} from "js-beautify";
import {exec} from "child_process";
import {XmiGeneratorBase} from "generator-xmi-common";
import kebabCase = require('just-kebab-case');
import pascal = require('to-pascal-case');

export class XmiGenerator extends XmiGeneratorBase {
    staleContent: string[] = [];

    _beautify(filename: string) {
        this.fs.write(filename, beautify(this.fs.read(filename), {
            jslint_happy: true, preserve_newlines: false
        }));
    }

    generate() {
        this._bootstrap(['.cfignore', '.yo-rc.json'], ['.env', 'app/environments']);

        this.log(green('Generate'));
        this._generate('', this.options.parser.packge);

        this.testFiles.forEach(x => {
            //this.spawnCommand('tsc', ['--project', this.options.destination, x]);
            this._beautify(x);
        });

        this.generatedFiles.forEach(x => this._beautify(x));
    }

    async install() {
        const destination = path.resolve(process.cwd(), this.options.destination);
        const callback = (error, stdout, stderr) => this.log.info(stdout, stderr);

        this.log.info(`Installing npm packages in ${destination}`);

        try {
            await exec(`cd ${destination} && npm install --force && dir ${destination} && npm run build`, callback);
        } catch (e) {
            this.log.error('Exception on install', e);
        }
    }

    end() {
        this.log('\r\n\r\nProject generated successfully.\r\nUpdate configuration to start using application:');
        this.log(green('DB connection:            ') + `${this.options.destination}/.env -> "db" section`);
        this.log(green('JIRA credentials:         ') + `${this.options.destination}/.env -> "jira" section`);
        this.log(green('Auth server connection:   ') + `${this.options.destination}/.env -> "keycloak" section`);

        if (this.staleContent.length) {
            this.log(yellow('\r\nStale content: '));
            this.staleContent.forEach(x => this.log(x));
        }
    }

    _generate(localPath: string | null, pkg: any) {
        const path = this.options.destination + '/design' + localPath;
        const childPackages: string[] = ['components', 'contracts', 'enums', 'types', 'process', 'test'];
        const childComponents: string[] = [];

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
            } else if (x instanceof xmiBoundary) {
                const destFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                this.fs.copyTpl(this.templatePath('xmiActor.ejs'), destFileName, options);
                this.generatedFiles.push(destFileName);
            } else if (x instanceof xmiEnumeration) {
                const fileName = `${path}/enums/${x.name}.ts`;
                const destFileName = this.destinationPath(fileName);
                const apiRouterFileName = this.destinationPath(`${this.options.destination}/api/server/routes/${localPath}/${x.name}.router.ts`);

                this.fs.copyTpl(this.templatePath('xmiEnumeration.ejs'), destFileName, options);
                this.generatedFiles.push(destFileName);

                //api
                this.fs.copyTpl(this.templatePath('api/enum/router.ejs'), apiRouterFileName, options);

                this.enums.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});
            } else if (x instanceof xmiInstanceSpecification) {
                const baseClassFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                const classFileName = this.destinationPath(`${path}/components/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath('xmiClass.generated.ejs'), baseClassFileName, options);
                this.generatedFiles.push(baseClassFileName);

                if (!this.fs.exists(classFileName)) {
                    this.fs.copyTpl(this.templatePath('xmiClass.ejs'), classFileName, options);
                    this.generatedFiles.push(classFileName);
                }

                //store all non-generated content
                childComponents.push(classFileName);
            } else if (x instanceof xmiComponent) {
                const interfaceFileName = this.destinationPath(`${path}/contracts/${x.name}.ts`);
                const baseClassFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                const classFileName = this.destinationPath(`${path}/components/${x.name}.ts`);
                const classTestFileName = this.destinationPath(`${path}/components/${x.name}.test.ts`);

                this.fs.copyTpl(this.templatePath('xmiInterface.ejs'), interfaceFileName, options);
                this.generatedFiles.push(interfaceFileName);

                this.fs.copyTpl(this.templatePath('components/component.generated.ejs'), baseClassFileName, options);
                this.generatedFiles.push(baseClassFileName);
                this.components.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});

                if (!this.fs.exists(classFileName)) {
                    this.fs.copyTpl(this.templatePath('components/component.ejs'), classFileName, options);
                }

                // if (!this.fs.exists(classTestFileName)) {
                //     this.fs.copyTpl(this.templatePath('components/component.test.ejs'), classTestFileName, options);
                //     this.generatedFiles.push(classTestFileName);
                // }

                //store all non-generated content
                childComponents.push(classFileName);
                childComponents.push(classTestFileName);
            } else if (x instanceof xmiDataType) {
                const baseClassFileName = this.destinationPath(`${path}/types/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath('xmiDataType.ejs'), baseClassFileName, options);
                this.generatedFiles.push(baseClassFileName);
                this.dataTypes.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});

            } else if (x instanceof xmiClass) {
                const interfaceFileName = this.destinationPath(`${path}/contracts/${x.name}.ts`);
                const baseClassFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                const classFileName = this.destinationPath(`${path}/components/${x.name}.ts`);
                const classTestFileName = this.destinationPath(`${path}/components/${x.name}.test.ts`);
                const apiRouterFileName = this.destinationPath(`${this.options.destination}/api/server/routes/${localPath}/${x.name}.router.ts`);
                const appComponentRootPath = this.destinationPath(`${this.options.destination}/app/pages/administration/${localPath}`);
                const e2eRootPath = this.destinationPath(`${this.options.destination}/e2e/features/administration/${localPath}`);
                const e2eFeatuePath = this.destinationPath(`${e2eRootPath}/${x.name}.feature`);
                const dbFixturePath = this.destinationPath(`${this.options.destination}/test/fixtures/${x.name}.json`);

                const editComponentFileName = `${appComponentRootPath}/${x.name}/edit/component.ts`;
                const listComponentFileName = `${appComponentRootPath}/${x.name}/list/component.ts`;

                this.fs.copyTpl(this.templatePath('xmiInterface.ejs'), interfaceFileName, options);
                this.generatedFiles.push(interfaceFileName);

                this.fs.copyTpl(this.templatePath('xmiClass.generated.ejs'), baseClassFileName, options);
                this.generatedFiles.push(baseClassFileName);

                if (!this.fs.exists(classFileName)) {
                    this.fs.copyTpl(this.templatePath('xmiClass.ejs'), classFileName, options);
                }

                if (!this.fs.exists(classTestFileName)) {
                    this.fs.copyTpl(this.templatePath('xmiClass.test.ejs'), classTestFileName, options);
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

                //e2e
                this.fs.copyTpl(this.templatePath('e2e/list.po.ts.ejs'), `${e2eRootPath}/${x.name}/list.po.ts`, options);
                this.fs.copyTpl(this.templatePath('e2e/editor.po.ts.ejs'), `${e2eRootPath}/${x.name}/editor.po.ts`, options);
                this.fs.copyTpl(this.templatePath('e2e/test.feature.ts.ejs'), `${e2eRootPath}/${x.name}/feature.ts`, options);

                //fixtures
                if (!this.fs.exists(dbFixturePath)) {
                    this.fs.copyTpl(this.templatePath('db/fixture.json.ejs'), dbFixturePath, options);
                }

                if (!this.fs.exists(e2eFeatuePath)) {
                    this.fs.copyTpl(this.templatePath('e2e/test.feature.ejs'), e2eFeatuePath, options);
                }

                this.generatedFiles.push(editComponentFileName);
                this.generatedFiles.push(listComponentFileName);

                //store all non-generated content
                childComponents.push(classFileName);
                childComponents.push(classTestFileName);

                this.classes.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});
            } else if (x instanceof xmiInterface) {
                const interfaceFileName = this.destinationPath(`${path}/contracts/${x.name}.ts`);

                this.fs.copyTpl(this.templatePath('xmiInterface.ejs'), interfaceFileName, options);
                this.generatedFiles.push(interfaceFileName);
            } else if (x instanceof xmiCollaboration) {
                //const testFileDest = `${path}/test/process_${x.name}.ts`;
                const diagramFileName = this.destinationPath(`${path}/process/${x.name}.ts`);
                const apiRouterFileName = this.destinationPath(`${this.options.destination}/api/server/routes/${localPath}/router.ts`);
                const apiActorFileName = this.destinationPath(`${this.options.destination}/api/server/routes/${localPath}/actor.ts`);
                const apiControllerFileName = this.destinationPath(`${this.options.destination}/api/server/routes/${localPath}/controller.ts`);

                this.fs.copyTpl(this.templatePath('xmiCollaboration.ejs'), diagramFileName, options);
                //this.fs.copyTpl(this.templatePath('test/xmiComponent.ejs'), this.destinationPath(testFileDest), options);

                this.fs.copyTpl(this.templatePath('api/diagram/router.ejs'), apiRouterFileName, options);
                this.fs.copyTpl(this.templatePath('api/diagram/actor.ejs'), apiActorFileName, options);
                this.fs.copyTpl(this.templatePath('api/diagram/controller.ejs'), apiControllerFileName, options);

                //this.testFiles.push(testFileDest);
                this.generatedFiles.push(diagramFileName);
                this.generatedFiles.push(apiActorFileName);
                this.collaborationDiagrams.push({
                    path: localPath,
                    url: this._getLocationFromPath(localPath),
                    entity: x
                });
            } else if (x instanceof xmiScreen) {
                //const testFileDest = `${path}/test/screen_${x.name}.ts`;
                //const screenFileName = this.destinationPath(`${path}/screens/${x.name}.ts`);
                const appComponentRootPath = this.destinationPath(`${this.options.destination}/app/pages/screens/${localPath}`);
                const screenComponentFileName = `${appComponentRootPath}/${x.name}/component.ts`;

                //this.fs.copyTpl(this.templatePath('xmiScreen.ejs'), screenFileName, options);
                //this.fs.copyTpl(this.templatePath('test/xmiScreen.ejs'), this.destinationPath(testFileDest), options);

                //edit form
                this.fs.copyTpl(this.templatePath('app/screen/component.ts.ejs'), screenComponentFileName, options);
                this.fs.copyTpl(this.templatePath('app/screen/component.html.ejs'), `${appComponentRootPath}/${x.name}/component.html`, options);
                this.fs.write(`${appComponentRootPath}/${x.name}/component.sass`, '');

                //this.generatedFiles.push(screenFileName);
                this.generatedFiles.push(screenComponentFileName);

                //this.testFiles.push(testFileDest);
                this.screens.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});
            } else if (x instanceof xmiUseCase) {
                this._generateUseCase(x, options);
            } else if (x instanceof xmiPackage) {
                localPath || this.fs.copyTpl(this.templatePath('readme.ejs'), `${this.options.destination}/readme.md`, options);
                localPath || this.fs.copyTpl(this.templatePath('package.json.ejs'), `${this.options.destination}/package.json`, options);

                //clean generated content
                existsSync(`${localPath}/${x.name}/components/generated`) && this.spawnCommandSync('rm', ['-rf', `${localPath}/${x.name}/components/generated`]);
                existsSync(`${localPath}/${x.name}/contracts`) && this.spawnCommandSync('rm', ['-rf', `${localPath}/${x.name}/contracts`]);
                existsSync(`${localPath}/${x.name}/enums`) && this.spawnCommandSync('rm', ['-rf', `${localPath}/${x.name}/enums`]);
                existsSync(`${localPath}/${x.name}/types`) && this.spawnCommandSync('rm', ['-rf', `${localPath}/${x.name}/types`]);

                this._generate(`${localPath}/${x.name}`, x);

                childPackages.push(x.name);
            }
        });

        const routesFileName = `${this.options.destination}/api/server/routes.ts`;
        this.fs.copyTpl(
            this.templatePath('api/routes.ejs'),
            this.destinationPath(routesFileName), {
                diagrams: this.collaborationDiagrams,
                classes: this.classes,
                enums: this.enums,
                options: options
            }
        );
        this.generatedFiles.push(routesFileName);

        const apiSwaggerConfig = this.destinationPath(`${this.options.destination}/api/server/swagger/api.yaml`);
        this.fs.copyTpl(
            this.templatePath('api/swagger/api.yaml.ejs'),
            apiSwaggerConfig, {
                diagrams: this.collaborationDiagrams,
                classes: this.classes,
                dataTypes: this.dataTypes,
                options: options
            }
        );

        const ormConfig = this.destinationPath(`${this.options.destination}/ormconfig.json`);
        this.fs.copyTpl(this.templatePath('config/ormconfig.json.ejs'), ormConfig, {
            classes: this.classes,
            options: options
        });

        const appModule = this.destinationPath(`${this.options.destination}/app/pages/app.module.ts`);
        this.fs.copyTpl(this.templatePath('app/module.ejs'), appModule, {
            classes: this.classes,
            screens: this.screens,
            options: options
        });

        const appRoutes = this.destinationPath(`${this.options.destination}/app/pages/routing.module.ts`);
        this.fs.copyTpl(this.templatePath('app/routes.ejs'), appRoutes, {
            classes: this.classes,
            screens: this.screens,
            options: options
        });

        const appMainPage = this.destinationPath(`${this.options.destination}/app/pages/master/app.component.html`);
        this.fs.copyTpl(this.templatePath('app/master.html.ejs'), appMainPage, {
            classes: this.classes,
            screens: this.screens,
            options: options
        });

        const appIndexPage = this.destinationPath(`${this.options.destination}/app/pages/master/index.component.html`);
        this.fs.copyTpl(this.templatePath('app/index.html.ejs'), appIndexPage, {
            classes: this.classes,
            screens: this.screens,
            pkg: this.options.parser.packge,
            options: options
        });

        const diTypesPage = this.destinationPath(`${this.options.destination}/design/types/diTypes.ts`);
        this.fs.copyTpl(this.templatePath('components/registerTypes.ejs'), diTypesPage, {
            components: this.components,
            pkg: this.options.parser.packge,
            options: options
        });
        this.generatedFiles.push(diTypesPage);

        const diBindingConfigPath = this.destinationPath(`${this.options.destination}/inversify.config.ts`);
        this.fs.copyTpl(this.templatePath('components/bindingConfig.ejs'), diBindingConfigPath, {
            components: this.components,
            pkg: this.options.parser.packge,
            options: options
        });
        this.generatedFiles.push(diBindingConfigPath);

        const dbManagerCommonPath = this.destinationPath(`${this.options.destination}/design/common/dbManagerCommon.ts`);
        this.fs.copyTpl(this.templatePath('db/dbManager.ts.ejs'), dbManagerCommonPath, {
            classes: this.classes,
            pkg: this.options.parser.packge,
            options: options
        });

        const dbUtilsCommonPath = this.destinationPath(`${this.options.destination}/utils/database.ts`);
        this.fs.copyTpl(this.templatePath('db/dbUtils.ts.ejs'), dbUtilsCommonPath, {
            classes: this.classes,
            pkg: this.options.parser.packge,
            options: options
        });

        localPath && this._calculateDiff(path, childPackages, childComponents);
    }

    _calculateDiff(localPath: string, folders: string[], componentFiles: string[]) {
        if (existsSync(localPath)) {
            const dirs = readdirSync(this.destinationPath(localPath)).filter(f => statSync(join(localPath, f)).isDirectory());
            this.staleContent = this.staleContent.concat(dirs.filter(x => folders.indexOf(x) === -1).map(x => `(D) ${localPath}/${x}`));
        }

        const cmpFolder = join(localPath, 'components');
        if (existsSync(cmpFolder)) {
            const files = readdirSync(this.destinationPath(cmpFolder)).filter(f => statSync(join(cmpFolder, f)).isFile());
            this.staleContent = this.staleContent.concat(files.filter(x => componentFiles.indexOf(this.destinationPath(join(cmpFolder, x))) === -1).map(x => `(F) ${localPath}/components/${x}`));
        }
    }
}

declare var module: any;
module.exports = XmiGenerator;
