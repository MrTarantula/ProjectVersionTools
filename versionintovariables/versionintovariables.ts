import path = require('path');
import fs = require('fs');
import Parser = require('xmldom');
import tl = require('vsts-task-lib/task');
// npm install vsts-task-lib

const workingDir: string = tl.getVariable('System.DefaultWorkingDirectory');

// Get task parameters
const projectFilePath: string = tl.getPathInput('path', true, true);
let prefix: string = tl.getInput('prefix');
prefix = prefix ? prefix + '.' : '';
let versionTagName: string = tl.getInput('versionTag');
let revisionTagName: string = tl.getInput('revisionTag');
async function run() {
    try {
        tl.debug(`File Path: ${projectFilePath}`);

        const projFiles = tl.findMatch(workingDir, projectFilePath);
        projFiles.forEach((file) => {
            const doc: Document = new Parser.DOMParser().parseFromString(fs.readFileSync(file, { encoding: 'utf8' }));
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
            tl.setVariable(`${prefix}Version.MajorMinorBuildRevision`,
                `${version[0]}.${version[1]}.${version[2]}.${revisionElem.textContent}`);
            tl.setVariable(`${prefix}Version.MajorMinorPatchRevision`,
                `${version[0]}.${version[1]}.${version[2]}.${revisionElem.textContent}`);
            tl.setVariable(`${prefix}Version.Full`,
                `${version[0]}.${version[1]}.${version[2]}.${revisionElem.textContent}`);
        });
    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
