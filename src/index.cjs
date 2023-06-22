const setFailed = require('@actions/core').setFailed;
const getInput = require('@actions/core').getInput;
const existsSync = require('fs').existsSync;
const readFileSync = require('fs').readFileSync;
const writeFileSync = require('fs').writeFileSync;
const resolve = require('path').resolve;
const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE;

try {
    const packageLoc = resolve(GITHUB_WORKSPACE, getInput('package-location'), './package.json');
    console.log(packageLoc)
    // const packageLoc = GITHUB_WORKSPACE + '/package.json';
    console.log(`Reading package.json from ${packageLoc}`);
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