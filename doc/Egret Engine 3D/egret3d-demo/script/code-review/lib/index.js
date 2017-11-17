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
var fs = require("fs-extra-promise");
var ts = require("typescript");
;
function refactor(fileName, from, value) {
    var content = fs.readFileSync(fileName, 'utf-8');
    content = content.substr(0, from) + value + content.substr(from + value.length);
    fs.writeFileSync(fileName, content);
}
exports.refactor = refactor;
function removeBom(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var content, stripBom;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readFileSync(fileName, 'utf-8')];
                case 1:
                    content = _a.sent();
                    stripBom = require('strip-bom');
                    content = stripBom(content);
                    return [4 /*yield*/, fs.writeFileSync(fileName, content)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeBom = removeBom;
function init(rootFileNames) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, Promise.all(rootFileNames.map(function (fileName) {
                    return removeBom(fileName);
                }))];
        });
    });
}
exports.init = init;
function createLanguageService(rootFileNames, rootDir, options) {
    var files = {};
    rootFileNames.forEach(function (fileName) {
        files[fileName] = { version: 0 };
    });
    var servicesHost = {
        getScriptFileNames: function () { return rootFileNames; },
        getScriptVersion: function (fileName) { return files[fileName] && files[fileName].version.toString(); },
        getScriptSnapshot: function (fileName) {
            if (!fs.existsSync(fileName)) {
                return undefined;
            }
            return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
        },
        getCurrentDirectory: function () { return rootDir; },
        getCompilationSettings: function () { return options; },
        getDefaultLibFileName: function (options) { return ts.getDefaultLibFilePath(options); },
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
    };
    // Create the language service files
    var services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
    return services;
}
exports.createLanguageService = createLanguageService;
/** Generate documentation for all classes in a set of .ts files */
function generateErrors(fileNames, options, filter) {
    // Build a program using the set of root file names in fileNames
    var program = ts.createProgram(fileNames, options);
    // Get the checker, we will use it to find more about classes
    var checker = program.getTypeChecker();
    var output = [];
    var errors = [];
    // Visit every sourceFile in the program    
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var sourceFile = _a[_i];
        if (filter(sourceFile.fileName)) {
            // console.log(sourceFile.fileName)
            // if (sourceFile.fileName.indexOf(".d.ts") == -1) {
            // Walk the tree to search for classes
            console.log(sourceFile.fileName);
            ts.forEachChild(sourceFile, visitForCheckClassNameClass);
        }
    }
    // print out the doc
    fs.writeFileSync("output.json", JSON.stringify(output, undefined, 4));
    fs.writeFileSync("error.json", JSON.stringify(errors, undefined, 4));
    return errors;
    /** visit nodes finding exported classes */
    /** Serialize a symbol into a json object */
    function serializeSymbol(symbol) {
        return {
            name: symbol.getName(),
            documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
            type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
        };
    }
    function reviewClass(symbol, node) {
        var name = symbol.name;
        if (name.charAt(0) == name.charAt(0).toLocaleLowerCase()) {
            var fileName = node.getSourceFile().fileName;
            var pos = node.name.pos;
            var value = name;
            return { fileName: fileName, pos: pos, value: value };
        }
        else {
            return null;
        }
    }
    /** Serialize a class symbol information */
    function serializeClass(symbol) {
        var details = serializeSymbol(symbol);
        // Get the construct signatures
        var constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        details.constructors = constructorType.getConstructSignatures().map(serializeSignature);
        return details;
    }
    /** Serialize a signature (call or construct) */
    function serializeSignature(signature) {
        return {
            parameters: signature.parameters.map(serializeSymbol),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(signature.getDocumentationComment())
        };
    }
    function visitForSerializeClass(node) {
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            var symbol = checker.getSymbolAtLocation(node.name);
            output.push(serializeClass(symbol));
        }
        else if (node.kind === ts.SyntaxKind.ModuleDeclaration || ts.SyntaxKind.ModuleBlock) {
            ts.forEachChild(node, visitForSerializeClass);
        }
    }
    function visitForCheckClassNameClass(node) {
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            var symbol = checker.getSymbolAtLocation(node.name);
            var error = reviewClass(symbol, node);
            if (error) {
                errors.push(error);
            }
        }
        else if (node.kind === ts.SyntaxKind.ModuleDeclaration || ts.SyntaxKind.ModuleBlock) {
            ts.forEachChild(node, visitForCheckClassNameClass);
        }
    }
}
exports.generateErrors = generateErrors;