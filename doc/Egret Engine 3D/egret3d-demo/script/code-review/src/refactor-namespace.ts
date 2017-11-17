import * as fs from 'fs-extra';
import * as path from 'path';
import * as ts from 'typescript';
import * as utils from 'egret-node-utils';

/**
 * 1.运行该脚本
 * 2.进入egret3d目录tsc
 * 3.进入code目录tsc
 * 4.进入code_loader目录tsc
 * 5.运行index.html
 */

async function run() {
    let root = path.join(__filename, "../../../../");
    let gd3d_rootDir = root + 'gd3d/';
    let egret3d_rootDir = root + 'egret3d/';
    let code_rootDir = root + 'code/';
    let renameList = [
        root + 'gd3d/',
        root + 'lib/gd3d_jsloader.js',
        root + 'lib/gd3d_jsloader.d.ts',
        root + 'lib/gd3d_jsloader.js.map'
    ];
    renameList.forEach((fileName) => {
        if (fs.existsSync(fileName)) {
            fs.renameSync(fileName, fileName.replace("gd3d", "egret3d"));
        }
    });
    let egret3dRootFileNames = await utils.walk(egret3d_rootDir, (p, stat) => p.indexOf('.ts') >= 0);
    let codeRootFileNames = await utils.walk(code_rootDir, (p, stat) => p.indexOf('.ts') >= 0);
    egret3dRootFileNames.concat(codeRootFileNames).concat([
        root + "index.html",
        root + "code_loader/loader.ts",
        root + "lib/egret3d_jsloader.d.ts",
        root + "lib/egret3d_jsloader.js"
    ]).forEach((fileName) => {
        let fileContent = fs.readFileSync(fileName, "utf-8");
        let replaced1 = fileContent.replace(/egret-gd3d/g, "egret3d");
        let replaced2 = replaced1.replace(/gd3d/g, "egret3d");
        if (replaced2 != fileContent) {
            fs.writeFileSync(fileName, replaced2, "utf-8");
        }
    });
}


run().catch(e => console.log(e));
