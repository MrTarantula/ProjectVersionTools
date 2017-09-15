"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Parser = require("xmldom");
const tl = require("vsts-task-lib/task");
// npm install vsts-task-lib
const workingDir = tl.getVariable('System.DefaultWorkingDirectory');
// Get task parameters
const projectFilePath = tl.getPathInput('path', true, true);
const field = tl.getInput('fieldOptions', false);
const value = tl.getInput('value', true);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            tl.debug(`File Path: ${projectFilePath}`);
            tl.debug(`Field: ${field}`);
            tl.debug(`Field Value: ${value}`);
            const projFiles = tl.findMatch(workingDir, projectFilePath);
            projFiles.forEach((file) => {
                const doc = new Parser.DOMParser().parseFromString(fs.readFileSync(file, { encoding: 'utf8' }));
                const elem = doc.getElementsByTagName(`${field}`).item(0);
                elem.textContent = value;
                const xml = new Parser.XMLSerializer().serializeToString(doc);
                tl.writeFile(file, xml);
            });
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
//# sourceMappingURL=projectfileprops.js.map