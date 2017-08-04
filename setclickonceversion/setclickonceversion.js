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
const libxml = require("libxmljs");
const tl = require("vsts-task-lib/task");
// npm install vsts-task-lib
const workingDir = tl.getVariable('System.DefaultWorkingDirectory');
// Get task parameters
const version = tl.getInput('version', true);
const projectFilePath = tl.getPathInput('path', true, true);
const minimum = tl.getBoolInput('minimum', false);
const minimumVersion = tl.getInput('minimumVersion', false);
const mmbPattern = /^\d+\.\d+\.\d+/g;
const revPattern = /\d+$/g;
const majorMinorBuild = version.match(mmbPattern);
const revision = version.match(revPattern);
tl.debug(`Version: ${version}`);
tl.debug(`File Path: ${projectFilePath}`);
tl.debug(`Set Minimum Version: ${minimum}`);
tl.debug(`Minimum Version: ${minimumVersion}`);
tl.debug(`Major.Minor.Build: ${majorMinorBuild}`);
tl.debug(`Revision: ${revision}`);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const projFiles = tl.findMatch(workingDir, projectFilePath);
            projFiles.forEach((file) => {
                fs.readFile(file, 'utf8', (err, data) => {
                    const doc = libxml.parseXmlString(data);
                    const versionNode = doc.get('//ApplicationVersion');
                    const revisionNode = doc.get('//ApplicationRevision');
                    const minimumNode = doc.get('//MinimumRequiredVersion');
                    versionNode.text(`${majorMinorBuild}.%2a`);
                    revisionNode.text(revision);
                    minimumNode.text(minimumVersion || `${majorMinorBuild}.${revision}`);
                    fs.writeFile(file, doc.toString(), (error) => {
                        throw new Error('Unable to write file');
                    });
                });
            });
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
//# sourceMappingURL=setclickonceversion.js.map