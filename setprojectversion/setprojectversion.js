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
const versionOption = tl.getInput('versionOptions', true);
const version = tl.getInput('version', false);
const revision = tl.getInput('revision', false);
const minimumOption = tl.getInput('minimumOptions', true);
const minimumVersion = tl.getInput('minimumVersion', false);
const mmbPattern = /^\d+\.\d+\.\d+/g;
const revPattern = /\d+$/g;
const minimumPattern = /^\d+\.\d+\.\d+\.\d+$/g;
let fullVersion;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            tl.debug(`File Path: ${projectFilePath}`);
            tl.debug(`Version Option: ${versionOption}`);
            tl.debug(`Version: ${version}`);
            tl.debug(`Revision: ${revision}`);
            tl.debug(`Minimum Option: ${minimumOption}`);
            tl.debug(`Minimum Version: ${minimumVersion}`);
            const projFiles = tl.findMatch(workingDir, projectFilePath);
            projFiles.forEach((file) => {
                const doc = new Parser.DOMParser().parseFromString(fs.readFileSync(file, { encoding: 'utf8' }));
                const versionElem = doc.getElementsByTagName('ApplicationVersion').item(0);
                const revisionElem = doc.getElementsByTagName('ApplicationRevision').item(0);
                const minimumElem = doc.getElementsByTagName('MinimumRequiredVersion').item(0);
                if (versionOption === 'fromFile') {
                    if (!/^\d+$/g.test(revision)) {
                        throw new Error('Version format is incorrect.');
                    }
                    revisionElem.textContent = revision;
                    fullVersion = `${versionElem.textContent.match(mmbPattern)[0]}.${revision}`;
                    tl.debug(`Version has been set to ${fullVersion}`);
                }
                else if (versionOption === 'explicit') {
                    if (!mmbPattern.test(version) || !revPattern.test(version)) {
                        throw new Error('Version format is incorrect.');
                    }
                    versionElem.textContent = `${version.match(mmbPattern)[0]}.%2a`;
                    revisionElem.textContent = version.match(revPattern)[0];
                    fullVersion = `${version.match(mmbPattern)[0]}.${version.match(revPattern)[0]}`;
                    tl.debug(`Version has been set to ${fullVersion}`);
                }
                else {
                    fullVersion = `${versionElem.textContent.match(mmbPattern)[0]}.${revisionElem.textContent}`;
                    tl.debug(`Version is not changing from ${fullVersion}`);
                }
                if (minimumOption === 'same') {
                    minimumElem.textContent = fullVersion;
                    tl.debug(`Minimum Required Version has been set to ${fullVersion}`);
                }
                else if (minimumOption === 'custom') {
                    if (!minimumPattern.test(minimumVersion)) {
                        throw new Error('Minimum Required Version format is incorrect.');
                    }
                    minimumElem.textContent = minimumVersion;
                    tl.debug(`Minimum Required Version has been set to ${minimumVersion}`);
                }
                else {
                    tl.debug(`Minimum Required Version is not being set`);
                }
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
//# sourceMappingURL=setprojectversion.js.map