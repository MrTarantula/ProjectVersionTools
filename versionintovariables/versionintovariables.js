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
let prefix = tl.getInput('prefix');
prefix = prefix ? prefix + '.' : '';
let versionTagName = tl.getInput('versionTag');
let revisionTagName = tl.getInput('revisionTag');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            tl.debug(`File Path: ${projectFilePath}`);
            const projFiles = tl.findMatch(workingDir, projectFilePath);
            projFiles.forEach((file) => {
                const doc = new Parser.DOMParser().parseFromString(fs.readFileSync(file, { encoding: 'utf8' }));
                const versionElem = doc.getElementsByTagName(versionTagName).item(0);
                const revisionElem = doc.getElementsByTagName(revisionTagName).item(0);
                const version = versionElem.textContent.split('.');
                tl.setVariable(`${prefix}Version.Major`, version[0]);
                tl.setVariable(`${prefix}Version.Minor`, version[1]);
                tl.setVariable(`${prefix}Version.Build`, version[2]);
                tl.setVariable(`${prefix}Version.Patch`, version[2]);
                tl.setVariable(`${prefix}Version.Revision`, revisionElem.textContent);
                tl.setVariable(`${prefix}Version.MajorMinor`, `${version[0]}.${version[1]}`);
                tl.setVariable(`${prefix}Version.MajorMinorBuild`, `${version[0]}.${version[1]}.${version[2]}`);
                tl.setVariable(`${prefix}Version.MajorMinorPatch`, `${version[0]}.${version[1]}.${version[2]}`);
                tl.setVariable(`${prefix}Version.MajorMinorBuildRevision`, `${version[0]}.${version[1]}.${version[2]}.${revisionElem.textContent}`);
                tl.setVariable(`${prefix}Version.MajorMinorPatchRevision`, `${version[0]}.${version[1]}.${version[2]}.${revisionElem.textContent}`);
                tl.setVariable(`${prefix}Version.Full`, `${version[0]}.${version[1]}.${version[2]}.${revisionElem.textContent}`);
            });
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
//# sourceMappingURL=versionintovariables.js.map