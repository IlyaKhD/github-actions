import * as core from '@actions/core'

import { execCommand, filterPaths, getPrRevisionRange } from 'common';

const
    INPUT_PATHS = 'paths';

const
    OUTPUT_RESULT = 'result';

async function run(): Promise<void> {
    try {
        const pathPatterns = core.getInput(INPUT_PATHS).split(';');

        console.log(JSON.stringify(pathPatterns, undefined, 4));

        const { head, base } = await getPrRevisionRange();

        const diffOutput: string = await execCommand(`git diff --name-only ${base} ${head}`)

        const changedFiles = diffOutput.split('\n');

        const filteredFiles = filterPaths(changedFiles, pathPatterns);

        core.setOutput(OUTPUT_RESULT, filteredFiles.length > 0);

        console.log(`changed files [${changedFiles.length}]:`)
        console.log(JSON.stringify(changedFiles, undefined, 4));
        console.log(`filtered files [${filteredFiles.length}]:`)
        console.log(JSON.stringify(filteredFiles, undefined, 4));
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message)
        }
    }
}

run()
