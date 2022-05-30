'use strict';

import {xmiComponentFactory} from "generator-xmi-core";
import {
  xmiActor,
  xmiBoundary,
  xmiClass,
  xmiCollaboration,
  xmiComponent,
  xmiDataType,
  xmiEnumeration,
  xmiInstanceSpecification,
  xmiInterface, xmiPackage,
  xmiScreen,
  xmiUseCase
} from "generator-xmi-core";
import {XmiGeneratorBase} from "../_base/xmiGeneratorBase";
import {existsSync, readdirSync, statSync} from "fs";
import {join} from "path";

import * as kebabCase from "just-kebab-case";
import pascal from "to-pascal-case";
import {green, yellow} from "chalk";

export class XmiGenerator extends XmiGeneratorBase {
    staleContent: string[] = [];

    //TODO: requires Node > 10
    // _beautify(filename: string) {
    //     this.fs.write(filename, prettier.format(this.fs.read(filename), {
    //         parser: 'java', tabWidth: 4
    //     }));
    // }

    generate() {
        this._bootstrap([], ['.env']);

        this.log(green('Generate'));
        this._generate('', this.options.parser.packge);

        this.testFiles.forEach(x => this._beautify(x));
        this.generatedFiles.forEach(x => this._beautify(x));
    }

    end() {
        this.log('\r\n\r\nProject generated successfully.\r\nUpdate configuration to start using application:');
        this.log(green('DB connection:            ') + `${this.options.destination}/.env -> "db" section`);
        this.log(green('JIRA credentials:         ') + `${this.options.destination}/.env -> "jira" section`);
        this.log(green('Auth server connection:   ') + `${this.options.destination}/.env -> "keycloak" section`);

        if(this.staleContent.length) {
            this.log(yellow('\r\nStale content: '));
            this.staleContent.forEach(x => this.log(x));
        }
    }

    _generate(localPath: string | null, pkg: any) {
        const path = this.options.destination + '/src/main/java/com/generator/design' + localPath;
        const childPackages: string[] = ['components', 'contracts', 'enums', 'types', 'process', 'test'];
        const childComponents: string[] = [];

        const options: any = {
            auth: this.options.auth,
            factory: xmiComponentFactory,
            utils: {
                kebabCase: kebabCase,
                self: (x: any) => x
            }
        };

        pkg.children.filter((x: any) => x.name).forEach((x: any) => {
            this.log(`Processing "${x.name}" package element`);

            options.className = pascal(x.name);
            options.entity = x;


            if (x instanceof xmiActor) {
                // const destFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                // this.fs.copyTpl(this.templatePath('xmiActor.ejs'), destFileName, options);
                // this.generatedFiles.push(destFileName);
            }

            else if (x instanceof xmiBoundary) {
                // const destFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                // this.fs.copyTpl(this.templatePath('xmiActor.ejs'), destFileName, options);
                // this.generatedFiles.push(destFileName);
            }

            else if (x instanceof xmiEnumeration) {
                const fileName = `${path}/enums/${x.namePascal}.java`;
                const destFileName = this.destinationPath(fileName);

                this.fs.copyTpl(this.templatePath('xmiEnumeration.java.ejs'), destFileName, options);
                this.generatedFiles.push(destFileName);

                this.enums.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});
            }

            else if (x instanceof xmiInstanceSpecification) {
                // const baseClassFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                // const classFileName = this.destinationPath(`${path}/components/${x.name}.ts`);
                //
                // this.fs.copyTpl(this.templatePath('xmiClass.generated.java.ejs'), baseClassFileName, options);
                // this.generatedFiles.push(baseClassFileName);
                //
                // if(!this.fs.exists(classFileName)) {
                //     this.fs.copyTpl(this.templatePath('xmiClass.java.ejs'), classFileName, options);
                //     this.generatedFiles.push(classFileName);
                // }
                //
                // //store all non-generated content
                // childComponents.push(classFileName);
            }

            else if (x instanceof xmiComponent) {
                // const interfaceFileName = this.destinationPath(`${path}/contracts/${x.name}.ts`);
                // const baseClassFileName = this.destinationPath(`${path}/components/generated/${x.name}.generated.ts`);
                // const classFileName = this.destinationPath(`${path}/components/${x.name}.ts`);
                // const classTestFileName = this.destinationPath(`${path}/components/${x.name}.test.ts`);
                //
                // this.fs.copyTpl(this.templatePath('xmiInterface.java.ejs'), interfaceFileName, options);
                // this.generatedFiles.push(interfaceFileName);
                //
                // this.fs.copyTpl(this.templatePath('components/component.generated.ejs'), baseClassFileName, options);
                // this.generatedFiles.push(baseClassFileName);
                // this.components.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});
                //
                // if(!this.fs.exists(classFileName)) {
                //     this.fs.copyTpl(this.templatePath('components/component.ejs'), classFileName, options);
                // }
                //
                // if(!this.fs.exists(classTestFileName)) {
                //     this.fs.copyTpl(this.templatePath('components/component.test.ejs'), classTestFileName, options);
                //     // this.generatedFiles.push(classTestFileName);
                // }
                //
                // //store all non-generated content
                // childComponents.push(classFileName);
                // childComponents.push(classTestFileName);
            }

            else if (x instanceof xmiDataType) {
                const baseClassFileName = this.destinationPath(`${path}/types/${x.namePascal}.java`);

                this.fs.copyTpl(this.templatePath('xmiDataType.java.ejs'), baseClassFileName, options);
                this.generatedFiles.push(baseClassFileName);
                this.dataTypes.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});

            }

            else if (x instanceof xmiClass) {
                const baseClassFileName = this.destinationPath(`${path}/components/generated/${x.namePascal}Base.java`);
                const classFileName = this.destinationPath(`${path}/components/${x.namePascal}.java`);
                const repositoryFileName = this.destinationPath(`${path}/repositories/${x.namePascal}Repository.java`);
                const controllerFileName = this.destinationPath(`${path}/controllers/${x.namePascal}Controller.java`);
                const classTestFileName = this.destinationPath(`${path}/components/${x.namePascal}.test.java`);

                this.fs.copyTpl(this.templatePath('xmiClass.generated.java.ejs'), baseClassFileName, options);
                this.generatedFiles.push(baseClassFileName);

                if(!this.fs.exists(classFileName)) {
                    this.fs.copyTpl(this.templatePath('xmiClass.java.ejs'), classFileName, options);
                }

                this.fs.copyTpl(this.templatePath('spring/repository.java.ejs'), repositoryFileName, options);
                this.fs.copyTpl(this.templatePath('spring/controller.java.ejs'), controllerFileName, options);

                // if(!this.fs.exists(classTestFileName)) {
                //     this.fs.copyTpl(this.templatePath('xmiClass.test.java.ejs'), classTestFileName, options);
                // }

                //store all non-generated content
                childComponents.push(classFileName);
                childComponents.push(classTestFileName);

                this.classes.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});
            }

            else if (x instanceof xmiInterface) {
                const interfaceFileName = this.destinationPath(`${path}/contracts/${x.namePascal}.java`);

                this.fs.copyTpl(this.templatePath('xmiInterface.java.ejs'), interfaceFileName, options);
                this.generatedFiles.push(interfaceFileName);
            }

            else if (x instanceof xmiCollaboration) {
                // const diagramFileName = this.destinationPath(`${path}/process/${x.name}.ts`);
                // const apiRouterFileName = this.destinationPath(`${this.options.destination}/api/server/routes/${localPath}/router.ts`);
                // const apiActorFileName = this.destinationPath(`${this.options.destination}/api/server/routes/${localPath}/actor.ts`);
                // const apiControllerFileName = this.destinationPath(`${this.options.destination}/api/server/routes/${localPath}/controller.ts`);
                //
                // this.fs.copyTpl(this.templatePath('xmiCollaboration.ejs'), diagramFileName, options);
                //
                // this.fs.copyTpl(this.templatePath('api/diagram/router.ejs'), apiRouterFileName, options);
                // this.fs.copyTpl(this.templatePath('api/diagram/actor.ejs'), apiActorFileName, options);
                // this.fs.copyTpl(this.templatePath('api/diagram/controller.ejs'), apiControllerFileName, options);
                //
                // this.generatedFiles.push(diagramFileName);
                // this.generatedFiles.push(apiActorFileName);
                // this.collaborationDiagrams.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});
            }

            else if (x instanceof xmiScreen) {
                // const appComponentRootPath = this.destinationPath(`${this.options.destination}/app/pages/screens/${localPath}`);
                // const screenComponentFileName = `${appComponentRootPath}/${x.name}/component.ts`;
                //
                // this.fs.copyTpl(this.templatePath('app/screen/component.ts.ejs'), screenComponentFileName, options);
                // this.fs.copyTpl(this.templatePath('app/screen/component.html.ejs'), `${appComponentRootPath}/${x.name}/component.html`, options);
                // this.fs.write(`${appComponentRootPath}/${x.name}/component.sass`, '');
                //
                // this.generatedFiles.push(screenComponentFileName);
                // this.screens.push({path: localPath, url: this._getLocationFromPath(localPath), entity: x});
            }

            else if (x instanceof xmiUseCase) {
                // this._generateUseCase(x, options);
            }

            else if (x instanceof xmiPackage) {
                localPath || this.fs.copyTpl(this.templatePath('readme.ejs'), `${this.options.destination}/readme.md`, options);

                //clean generated content
                existsSync(`${localPath}/${x.name}/components/generated`) && this.spawnCommandSync('rm', ['-rf', `${localPath}/${x.name}/components/generated`]);
                existsSync(`${localPath}/${x.name}/contracts`) && this.spawnCommandSync('rm', ['-rf', `${localPath}/${x.name}/contracts`]);
                existsSync(`${localPath}/${x.name}/enums`) && this.spawnCommandSync('rm', ['-rf', `${localPath}/${x.name}/enums`]);
                existsSync(`${localPath}/${x.name}/types`) && this.spawnCommandSync('rm', ['-rf', `${localPath}/${x.name}/types`]);

                this._generate(`${localPath}/${x.name}`, x);

                childPackages.push(x.name);
            }
        });

        localPath && this._calculateDiff(path, childPackages, childComponents);
    }

    _calculateDiff(localPath: string, folders: string[], componentFiles: string[]) {
        if(existsSync(localPath)) {
            const dirs = readdirSync(this.destinationPath(localPath)).filter(f => statSync(join(localPath, f)).isDirectory());
            this.staleContent = this.staleContent.concat(dirs.filter(x => folders.indexOf(x) === -1).map(x => `(D) ${localPath}/${x}`));
        }

        const cmpFolder = join(localPath, 'components');
        if(existsSync(cmpFolder)) {
            const files = readdirSync(this.destinationPath(cmpFolder)).filter(f => statSync(join(cmpFolder, f)).isFile());
            this.staleContent = this.staleContent.concat(files.filter(x => componentFiles.indexOf(this.destinationPath(join(cmpFolder, x))) === -1).map(x => `(F) ${localPath}/components/${x}`));
        }
    }
}

declare var module: any;
module.exports = XmiGenerator;
