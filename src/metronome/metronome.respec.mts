/**
 * @module metronome respec
 *
 * we gotta test our metronome
 */

// import { cwd, chdir, } from 'node:process';
// import { statSync } from 'node:fs';
// import { mkdir, } from 'node:fs/promises';
// import { ChildProcess, exec, ExecException } from 'node:child_process';
import * as pathUtils from 'path';

import { Observable, ReplaySubject, firstValueFrom } from 'rxjs';

import {
    firstOfAll, firstOfEach, ifWe, ifWeMight, iReckon,
    lastOfAll, lastOfEach, respecfully, respecfullyDear
} from '@ibgib/helper-gib/dist/respec-gib/respec-gib.mjs';
const maam = `[${import.meta.url}]`, sir = maam;

import { extractErrorMsg, getTimestampInTicks, getUUID } from '@ibgib/helper-gib';

/**
 * for verbose logging. import this.
 */
const logalot = GLOBAL_LOG_A_LOT;

const lcFile: string = `[${pathUtils.basename(import.meta.url)}]`;

await respecfully(maam, `when testing stuff...`, async () => {
    await ifWe(maam, `should happen to do...`, async () => {
        iReckon(maam, true).asTo('42').isGonnaBe(false);
    });
});
