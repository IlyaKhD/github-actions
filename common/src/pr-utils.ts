
import * as core from '@actions/core'
import { context } from '@actions/github'
import { execCommand } from './common-utils';

export async function getPrRevisionRange(): Promise<{
    head: string;
    base: string;
}> {
    return getRange().then((r) => {
        core.info(`Base commit: ${r.base}`);
        core.info(`Head commit: ${r.head}`);
        return r;
    });
}

function normalizeCommit(commit: string) {
    return commit === '0000000000000000000000000000000000000000' ? 'HEAD^' : commit;
}

export async function getRange(): Promise<{
    head: string;
    base: string;
}> {
    switch (context.eventName) {
        case 'pull_request':
            const baseBranch = context.payload.pull_request?.base?.ref;
            await execCommand(`git fetch origin`);

            return {
                base: await execCommand(`git rev-parse origin/${baseBranch}`),
                head: context.payload.pull_request?.head?.sha,
            };

        case 'push':

            return {
                base: normalizeCommit(context.payload.before),
                head: context.payload.after,
            };
        default:
            throw new Error(`This action only supports pull requests and pushes, ${context.eventName} events are not supported.`);
    }
}