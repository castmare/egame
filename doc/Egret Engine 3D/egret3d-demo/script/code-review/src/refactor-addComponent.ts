import * as fs from 'fs-extra';
import * as path from 'path';
import * as utils from 'egret-node-utils';

async function run() {
    let root = path.join(__filename, "../../../../");
    let egret3d_rootDir = root + 'egret3d/';
    let code_rootDir = root + 'code/';
    let egret3dRootFileNames = await utils.walk(egret3d_rootDir, (p, stat) => p.indexOf('.ts') >= 0);
    let codeRootFileNames = await utils.walk(code_rootDir, (p, stat) => p.indexOf('.ts') >= 0);
    egret3dRootFileNames.concat(codeRootFileNames)
        .forEach((fileName) => {
            let fileContent = fs.readFileSync(fileName, "utf-8");
            let replaced1 = fileContent.replace(/addComponent[(](["]|['])[a-z]/g, (word) => {
                word = word.substr(0, word.length - 1) + word[word.length - 1].toUpperCase();
                return word;
            }
            );
            if (replaced1 != fileContent) {
                fs.writeFileSync(fileName, replaced1, "utf-8");
            }
        });
}


run().catch(e => console.log(e));
