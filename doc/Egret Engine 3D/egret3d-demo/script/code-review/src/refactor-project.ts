import * as fs from 'fs-extra-promise';
import * as path from 'path';

import * as ts from 'typescript';
import * as utils from 'egret-node-utils';
import { DocEntry, refactor, createLanguageService, generateErrors, init } from "./index";




async function run() {

    // let rootDir = 'C:/Users/18571/Documents/work/3d/engine_egret/code/';
    let rootDir = path.join(process.cwd(), "../../code");
    let rootFileNames = await utils.walk(rootDir, (p, stat) => p.indexOf('.ts') >= 0);

    await init(rootFileNames);

    // let list = ['C:/Users/18571/Documents/work/3d/engine_egret/gd3d/framework/application.ts']
    let options: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
    }

    let error = generateErrors(rootFileNames, options, (fileName) => {
        return fileName.indexOf(".d.ts") >= 0 && fileName.indexOf('node_modules') == -1;
    });

    console.log(error)

    const services = createLanguageService(rootFileNames, rootDir, options);


    error.forEach(error => {
        let result = services.findRenameLocations(error.fileName, error.pos + 1, false, false)
        if (result) {
            let realValue = error.value.charAt(0).toLocaleUpperCase() + error.value.substr(1);
            result.forEach(v => {
                refactor(v.fileName, v.textSpan.start, realValue);
            })
        }
        else {
            console.log('all right !!' + error.fileName, error.value, error.pos)
        }

    })
}


run().catch(e => console.log(e))
