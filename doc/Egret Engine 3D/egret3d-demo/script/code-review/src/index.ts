import * as fs from 'fs-extra-promise';
import * as path from 'path';

import * as ts from 'typescript';
import * as utils from 'egret-node-utils';

export interface DocEntry {
    name?: string,
    fileName?: string,
    documentation?: string,
    type?: string,
    constructors?: DocEntry[],
    parameters?: DocEntry[],
    returnType?: string
};

export function refactor(fileName: string, from: number, value: string) {
    let content = fs.readFileSync(fileName, 'utf-8');
    content = content.substr(0, from) + value + content.substr(from + value.length);
    fs.writeFileSync(fileName, content);

}

export async function removeBom(fileName: string) {
    let content = await fs.readFileSync(fileName, 'utf-8');
    const stripBom = require('strip-bom');
    content = stripBom(content);
    await fs.writeFileSync(fileName, content);

}

export async function init(rootFileNames: string[]) {
    return Promise.all(rootFileNames.map((fileName) => {
        return removeBom(fileName);
    }));
}

export function createLanguageService(rootFileNames: string[], rootDir: string, options: ts.CompilerOptions) {

    let files = {};
    rootFileNames.forEach(fileName => {

        files[fileName] = { version: 0 };
    })

    const servicesHost: ts.LanguageServiceHost = {
        getScriptFileNames: () => rootFileNames,
        getScriptVersion: (fileName) => files[fileName] && files[fileName].version.toString(),
        getScriptSnapshot: (fileName) => {
            if (!fs.existsSync(fileName)) {
                return undefined;
            }

            return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
        },
        getCurrentDirectory: () => rootDir,
        getCompilationSettings: () => options,
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
    };

    // Create the language service files
    const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
    return services;
}




/** Generate documentation for all classes in a set of .ts files */
export function generateErrors(fileNames: string[], options: ts.CompilerOptions, filter: (fileName: string) => boolean) {
    // Build a program using the set of root file names in fileNames
    let program = ts.createProgram(fileNames, options);

    // Get the checker, we will use it to find more about classes
    let checker = program.getTypeChecker();

    let output: DocEntry[] = [];
    let errors: { fileName: string, pos: number, value: string }[] = [];


    // Visit every sourceFile in the program    
    for (const sourceFile of program.getSourceFiles()) {

        if (filter(sourceFile.fileName)) {
            // console.log(sourceFile.fileName)
            // if (sourceFile.fileName.indexOf(".d.ts") == -1) {
            // Walk the tree to search for classes
            console.log(sourceFile.fileName)
            ts.forEachChild(sourceFile, visitForCheckClassNameClass);
        }

    }

    // print out the doc
    fs.writeFileSync("output.json", JSON.stringify(output, undefined, 4));
    fs.writeFileSync("error.json", JSON.stringify(errors, undefined, 4));




    return errors;

    /** visit nodes finding exported classes */


    /** Serialize a symbol into a json object */
    function serializeSymbol(symbol: ts.Symbol): DocEntry {
        return {
            name: symbol.getName(),
            documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
            type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
        };
    }

    function reviewClass(symbol: ts.Symbol, node: ts.ClassDeclaration) {
        let name = symbol.name;
        if (name.charAt(0) == name.charAt(0).toLocaleLowerCase()) {
            let fileName = node.getSourceFile().fileName;
            let pos = node.name.pos;
            let value = name;
            return { fileName, pos, value }
        }
        else {
            return null;
        }

    }

    /** Serialize a class symbol information */
    function serializeClass(symbol: ts.Symbol) {
        let details = serializeSymbol(symbol);

        // Get the construct signatures
        let constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        details.constructors = constructorType.getConstructSignatures().map(serializeSignature);
        return details;
    }

    /** Serialize a signature (call or construct) */
    function serializeSignature(signature: ts.Signature) {
        return {
            parameters: signature.parameters.map(serializeSymbol),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(signature.getDocumentationComment())
        };
    }



    function visitForSerializeClass(node: ts.Node) {

        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            let symbol = checker.getSymbolAtLocation((<ts.ClassDeclaration>node).name);
            output.push(serializeClass(symbol));
        }
        else if (node.kind === ts.SyntaxKind.ModuleDeclaration || ts.SyntaxKind.ModuleBlock) {
            ts.forEachChild(node, visitForSerializeClass);
        }
    }

    function visitForCheckClassNameClass(node: ts.Node) {

        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            let symbol = checker.getSymbolAtLocation((<ts.ClassDeclaration>node).name);
            let error = reviewClass(symbol, <ts.ClassDeclaration>node);
            if (error) {
                errors.push(error);
            }

        }
        else if (node.kind === ts.SyntaxKind.ModuleDeclaration || ts.SyntaxKind.ModuleBlock) {
            ts.forEachChild(node, visitForCheckClassNameClass);
        }
    }
}