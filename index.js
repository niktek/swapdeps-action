const core = require('@actions/core');
const github = require('@actions/github');
import fs from 'fs';
import { writeFileSync } from 'fs';

try {
    console.log(`Passed in package location is ${core.getInput('package-location')}`)
    const packageLoc = fs.join(core.getInput('package-location'), 'package.json');
    //check if package.json exists in custom location
    
    if (!fs.existsSync(packageLoc)) {
        throw new Error(`package.json not found at ${packageLoc}`);
    }
    const pkg = JSON.parse(fs.readFileSync(packageLoc, 'utf8'));
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach((depType) => {
        if (pkg?.deployConfig[depType] != undefined) {
            for (const [dep, version] of Object.entries(pkg?.deployConfig[depType])) {
                pkg[depType][dep] = version;
            }
        }
    });
} catch (error) {
    core.setFailed(error.message);
}