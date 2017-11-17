"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var ts = require("typescript");
var utils = require("egret-node-utils");
var index_1 = require("./index");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var rootDir, rootFileNames, options, error, services;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rootDir = path.join(process.cwd(), "../../code");
                    return [4 /*yield*/, utils.walk(rootDir, function (p, stat) { return p.indexOf('.ts') >= 0; })];
                case 1:
                    rootFileNames = _a.sent();
                    return [4 /*yield*/, index_1.init(rootFileNames)];
                case 2:
                    _a.sent();
                    options = {
                        target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
                    };
                    error = index_1.generateErrors(rootFileNames, options, function (fileName) {
                        return fileName.indexOf(".d.ts") >= 0 && fileName.indexOf('node_modules') == -1;
                    });
                    console.log(error);
                    services = index_1.createLanguageService(rootFileNames, rootDir, options);
                    error.forEach(function (error) {
                        var result = services.findRenameLocations(error.fileName, error.pos + 1, false, false);
                        if (result) {
                            var realValue_1 = error.value.charAt(0).toLocaleUpperCase() + error.value.substr(1);
                            result.forEach(function (v) {
                                index_1.refactor(v.fileName, v.textSpan.start, realValue_1);
                            });
                        }
                        else {
                            console.log('all right !!' + error.fileName, error.value, error.pos);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
run().catch(function (e) { return console.log(e); });
