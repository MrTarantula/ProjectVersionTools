import path = require('path');
import fs = require('fs');
import Parser = require('xmldom');
import tl = require('vsts-task-lib/task');
// npm install vsts-task-lib

fs.readFile('./testing/original.vbproj', 'utf8', (err, data) => {
    const doc = new Parser.DOMParser().parseFromString(data);
    // DO STUFF HERE
    const xml = new Parser.XMLSerializer().serializeToString(doc);
    fs.writeFile('./testing/test.vbproj', xml, (error) => console.log(error));
});
const workingDir: string = tl.getVariable('System.DefaultWorkingDirectory');

// Get task parameters
const version: string = tl.getInput('version', true);
const projectFilePath: string = tl.getPathInput('path', true, true);
const minimum: boolean = tl.getBoolInput('minimum', false);
const minimumVersion: string = tl.getInput('minimumVersion', false);

const mmbPattern: RegExp = /^\d+\.\d+\.\d+/g;
const revPattern: RegExp = /\d+$/g;
const majorMinorBuild = version.match(mmbPattern);
const revision = version.match(revPattern);

tl.debug(`Version: ${version}`);
tl.debug(`File Path: ${projectFilePath}`);
tl.debug(`Set Minimum Version: ${minimum}`);
tl.debug(`Minimum Version: ${minimumVersion}`);
tl.debug(`Major.Minor.Build: ${majorMinorBuild}`);
tl.debug(`Revision: ${revision}`);

async function run() {
    try {
        const projFiles = tl.findMatch(workingDir, projectFilePath);
        projFiles.forEach((file) => {
            fs.readFile(file, 'utf8', (err, data) => {

                const doc: libxml.XMLDocument = libxml.parseXmlString(data);
                const versionNode: libxml.Element = doc.get('//ApplicationVersion');
                const revisionNode: libxml.Element = doc.get('//ApplicationRevision');
                const minimumNode: libxml.Element = doc.get('//MinimumRequiredVersion');

                versionNode.text(`${majorMinorBuild}.%2a`);
                revisionNode.text(revision);
                minimumNode.text(minimumVersion || `${majorMinorBuild}.${revision}`);

                fs.writeFile(file, doc.toString(), (error) => {
                    throw new Error('Unable to write file');
                });
            });
        });
    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
