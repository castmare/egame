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
var fs = require("fs-extra");
var path = require("path");
var utils = require("egret-node-utils");
/**
 * 1.运行该脚本
 * 2.进入egret3d目录tsc
 * 3.进入code目录tsc
 * 4.进入code_loader目录tsc
 * 5.运行index.html
 */
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var root, gd3d_rootDir, egret3d_rootDir, code_rootDir, renameList, egret3dRootFileNames, codeRootFileNames;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    root = path.join(__filename, "../../../../");
                    gd3d_rootDir = root + 'gd3d/';
                    egret3d_rootDir = root + 'egret3d/';
                    code_rootDir = root + 'code/';
                    renameList = [
                        root + 'gd3d/',
                        root + 'lib/gd3d_jsloader.js',
                        root + 'lib/gd3d_jsloader.d.ts',
                        root + 'lib/gd3d_jsloader.js.map'
                    ];
                    renameList.forEach(function (fileName) {
                        if (fs.existsSync(fileName)) {
                            fs.renameSync(fileName, fileName.replace("gd3d", "egret3d"));
                        }
                    });
                    return [4 /*yield*/, utils.walk(egret3d_rootDir, function (p, stat) { return p.indexOf('.ts') >= 0; })];
                case 1:
                    egret3dRootFileNames = _a.sent();
                    return [4 /*yield*/, utils.walk(code_rootDir, function (p, stat) { return p.indexOf('.ts') >= 0; })];
                case 2:
                    codeRootFileNames = _a.sent();
                    egret3dRootFileNames.concat(codeRootFileNames).concat([
                        root + "index.html",
                        root + "code_loader/loader.ts",
                        root + "lib/egret3d_jsloader.d.ts",
                        root + "lib/egret3d_jsloader.js"
                    ]).forEach(function (fileName) {
                        var fileContent = fs.readFileSync(fileName, "utf-8");
                        var replaced1 = fileContent.replace(/egret-gd3d/g, "egret3d");
                        var replaced2 = replaced1.replace(/gd3d/g, "egret3d");
                        if (replaced2 != fileContent) {
                            fs.writeFileSync(fileName, replaced2, "utf-8");
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
run().catch(function (e) { return console.log(e); });
