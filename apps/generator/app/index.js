'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.XmiGenerator = void 0;
var core_1 = require("@xmi/core");
var chalk_1 = require("chalk");
var xml2js_1 = require("xml2js");
var Generator = require("yeoman-generator");
var yosay = require("yosay");
var treeify = require("treeify");
var XmiGenerator = /** @class */ (function (_super) {
    __extends(XmiGenerator, _super);
    function XmiGenerator(args, opts) {
        var _this = _super.call(this, args, opts) || this;
        _this.dist = 'dist';
        _this.testFiles = [];
        _this.generatedFiles = [];
        _this.collaborationDiagrams = [];
        _this.argument('xmiFileName', { type: String, required: true });
        _this.option('destination', { type: String, "default": 'dist' });
        _this.option('type', { type: String, "default": 'nodejs' });
        _this.option('auth', { type: Boolean, "default": false });
        _this.option('dryRun', { type: Boolean, "default": false });
        return _this;
    }
    XmiGenerator.prototype.prompting = function () {
        this.log(yosay("Welcome to " + chalk_1.red('XMI') + " generator!"));
        this.log(chalk_1.green('Options'));
        this.log('file           : ' + this.options.xmiFileName);
        this.log('destination    : ' + this.destinationPath(this.options.destination));
        this.log('type           : ' + this.options.type);
        this.log('auth           : ' + this.options.auth ? 'yes' : 'no');
        this.log('dryRun         : ' + this.options.dryRun ? 'yes' : 'no');
    };
    XmiGenerator.prototype.clean = function () {
        this.spawnCommandSync('rm', ['-rf', this.options.destination + "/api"]);
        this.spawnCommandSync('rm', ['-rf', this.options.destination + "/app"]);
    };
    XmiGenerator.prototype.generate = function () {
        var _this = this;
        var done = this.async();
        this._readData(function (result) { return __awaiter(_this, void 0, void 0, function () {
            var parser, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parser = new core_1.XmiParser(result);
                        return [4 /*yield*/, parser.parse({ 'nodejs': 'js', 'spring': 'java' }[this.options.type])];
                    case 1:
                        success = _a.sent();
                        this.log(chalk_1.green('Model'));
                        this.log(treeify.asTree(parser.toConsole(), true, true));
                        if (success && !this.options.dryRun) {
                            this.composeWith(Promise.resolve().then(function () { return require('../' + _this.options.type); }), __assign(__assign({}, this.options), { parser: parser }));
                        }
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    XmiGenerator.prototype._readData = function (callback) {
        var file = this.fs.read(this.options.xmiFileName);
        xml2js_1.parseString(file, function (err, result) {
            // this.fs.writeJSON(this.templatePath('../files/test.json'), result);
            callback(result);
        });
    };
    return XmiGenerator;
}(Generator));
exports.XmiGenerator = XmiGenerator;
module.exports = XmiGenerator;
