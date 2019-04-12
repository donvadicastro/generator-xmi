'use strict';

import {XmiParser} from "../../src/xmiParser";
import {default as chalk} from "chalk";

const Generator = require('yeoman-generator');
const yosay = require('yosay');
const treeify = require('treeify');
const parseString = require('xml2js').parseString;

export class XmiGenerator extends (Generator as { new(args: any, opts: any): any; }) {
    dist: string = 'dist';

    testFiles: string[] = [];
    generatedFiles: string[] = [];
    collaborationDiagrams: any[] = [];

    constructor(args: any, opts: any) {
        super(args, opts);
        this.argument('xmiFileName', { type: String, required: true });

        this.option('destination', { type: String, default: 'dist' });
        this.option('type', { type: String, default: 'monolith' });
    }

    prompting() {
        this.log(yosay(`Welcome to ${chalk.red('XMI')} generator!`));
        this.log(chalk.green('Options'));
        this.log('file           : ' + this.options.xmiFileName);
        this.log('destination    : ' + this.destinationPath(this.options.destination));
        this.log('type           : ' + this.options.type);
    }

    clean() {
        // const done = this.async();
        // this.spawnCommand('rimraf', [this.options.destination]).on('close', done);
    }

    generate() {
        const done = this.async();

        this._readData((result: any) => {
            const parser = new XmiParser(result);
            parser.parse();

            this.log(chalk.green('Model'));
            this.log(treeify.asTree(parser.toConsole(), true, true));

            this.composeWith(require.resolve('../../generators/' + this.options.type), {...this.options, parser: parser });
            done();
        });
    }

    _readData(callback: (result: any) => void) {
        const file = this.fs.read(this.options.xmiFileName);

        parseString(file, (err: any, result: any) => {
            //this.fs.writeJSON(this.templatePath('../files/test.json'), result);
            callback(result);
        });
    }
}

declare var module: any;
module.exports = XmiGenerator;
