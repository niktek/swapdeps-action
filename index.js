import { getInput, setFailed } from '@actions/core';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

try {
    const packageLoc = process.cwd() +  '/package.json';
    //check if package.json exists in custom location
    console.log(`Checking if package.json exists at ${packageLoc}`)
    if (!existsSync(packageLoc)) {
        throw new Error(`package.json not found at ${packageLoc}`);
    }
    const pkg = JSON.parse(readFileSync(packageLoc, 'utf8'));
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach((depType) => {
        if (pkg?.deployConfig[depType] != undefined) {
            for (const [dep, version] of Object.entries(pkg?.deployConfig[depType])) {
                pkg[depType][dep] = version;
            }
        }
    });
    writeFileSync(packageLoc, JSON.stringify(pkg, null, 2));
} catch (error) {
    setFailed(error.message);
}