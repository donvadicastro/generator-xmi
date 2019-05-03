import {xmiUseCase} from "../../src/entities/xmiUseCase";
import {xmiScreen} from "../../src/entities/ui/xmiScreen";

const Generator = require('yeoman-generator');

const beautify = require('js-beautify').js;
const kebabCase = require('just-kebab-case');

export class XmiGeneratorBase extends (Generator as { new(args: any, opts: any): any; }) {
    testFiles: string[] = [];
    generatedFiles: string[] = [];
    collaborationDiagrams: any[] = [];
    classes: any[] = [];
    screens: any[] = [];
    enums: any[] = [];

    _bootstrap(extra: string[]) {
        if(!this.fs.exists(this.destinationPath(this.options.destination))) {
            const from = this.templatePath('bootstrap');
            const to = this.destinationPath(this.options.destination);

            this.fs.copy(from, to);
            extra.forEach(x => this.fs.copy(`${from}/${x}`, `${to}/${x}`));
        }
    }

    _beautify(filename: string) {
        this.fs.write(filename, beautify(this.fs.read(filename), {
            jslint_happy: true, preserve_newlines: false
        }));
    }

    _getLocationFromPath(path: string | null): string {
        return (path || '').split('/').map((x: string) => kebabCase(x)).join('/');
    }

    _generateUseCase(x: xmiUseCase, options: any) {
        const dest = this.destinationPath(`${this.options.destination}/documentation/useCases/${x.name}.json`);

        if(this.fs.exists(dest)) {
            let data = this.fs.readJSON(dest);
            this.fs.copyTpl(this.templatePath('../../_base/templates/xmiUseCase.ejs'), dest, options);

            data = {...data, ...this.fs.readJSON(dest)};
            this.fs.delete(dest);
            this.fs.writeJSON(dest, data);
        } else
            this.fs.copyTpl(this.templatePath('../../_base/templates/xmiUseCase.ejs'), dest, options);
    }
}
