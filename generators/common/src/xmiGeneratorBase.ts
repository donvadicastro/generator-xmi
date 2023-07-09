import * as kebabCase from "just-kebab-case";
import Generator = require('yeoman-generator');
import {xmiUseCase} from "generator-xmi-core";
import * as path from "path";

export class XmiGeneratorBase extends (Generator as { new(args: any, opts: any): any; }) {
    testFiles: string[] = [];
    generatedFiles: string[] = [];
    collaborationDiagrams: any[] = [];
    classes: any[] = [];
    dataTypes: any[] = [];
    enums: any[] = [];
    screens: any[] = [];
    components: any[] = [];


    constructor(args: any, opts: any) {
        super(args, opts);
        this.sourceRoot(path.resolve(this.sourceRoot(), '..', '..', 'templates'))
    }

    _bootstrap(extra: string[], skipIfExists: string[]) {
        const from = this.templatePath('bootstrap');
        const to = this.destinationPath(this.options.destination);

        this.fs.copy(from, to, {ignore: skipIfExists});
        extra.forEach(x => this.fs.copy(`${from}/${x}`, `${to}/${x}`));
        skipIfExists.forEach(x => this.fs.exists(`${to}/${x}`) || this.fs.copy(`${from}/${x}`, `${to}/${x}`))
    }

    _beautify(filename: string) {
    }

    _getLocationFromPath(path: string | null): string {
        return (path || '').split('/').map((x: string) => kebabCase(x)).join('/');
    }

    _generateUseCase(x: xmiUseCase, options: any) {
        const dest = this.destinationPath(`${this.options.destination}/documentation/useCases/${x.name}.json`);

        if(this.fs.exists(dest)) {
            let data = this.fs.readJSON(dest);
            this.fs.copyTpl(this.templatePath('../../common/templates/xmiUseCase.ejs'), dest, options);

            data = {...data, ...this.fs.readJSON(dest)};
            this.fs.delete(dest);
            this.fs.writeJSON(dest, data);
        } else
            this.fs.copyTpl(this.templatePath('../../common/templates/xmiUseCase.ejs'), dest, options);
    }
}
