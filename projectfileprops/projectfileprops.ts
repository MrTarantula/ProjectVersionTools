import path = require('path');
import fs = require('fs');
import Parser = require('xmldom');
import tl = require('vsts-task-lib/task');
// npm install vsts-task-lib

const workingDir: string = tl.getVariable('System.DefaultWorkingDirectory');

// Get task parameters
const projectFilePath: string = tl.getPathInput('path', true, true);
const field: string = tl.getInput('fieldOptions', false);
const value: string = tl.getInput('value', true);

async function run() {
    try {
        tl.debug(`File Path: ${projectFilePath}`);
        tl.debug(`Field: ${field}`);
        tl.debug(`Field Value: ${value}`);

        const projFiles = tl.findMatch(workingDir, projectFilePath);
        projFiles.forEach((file) => {
            const doc: Document = new Parser.DOMParser().parseFromString(fs.readFileSync(file, { encoding: 'utf8' }));
            const elem = doc.getElementsByTagName(`${field}`).item(0);
            elem.textContent = value;

            const xml = new Parser.XMLSerializer().serializeToString(doc);
            tl.writeFile(file, xml);
        });
    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
