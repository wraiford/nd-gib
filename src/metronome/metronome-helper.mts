/*
 * @module metronome helper/util/etc. functions
 *
 * this is where you will find helper functions like those that generate
 * and parse ibs for metronome.
 */

// import * as pathUtils from 'path';
// import { statSync } from 'node:fs';
// import { readFile, } from 'node:fs/promises';
// import * as readline from 'node:readline/promises';
// import { stdin, stdout } from 'node:process'; // decide if use this or not

import {
    extractErrorMsg, delay, getSaferSubstring,
    getTimestampInTicks, getUUID, pretty,
} from '@ibgib/helper-gib/dist/helpers/utils-helper.mjs';
import { UUID_REGEXP, CLASSNAME_REGEXP, } from '@ibgib/helper-gib/dist/constants.mjs';
import { Gib, Ib, } from '@ibgib/ts-gib/dist/types.mjs';
// import { GIB, IbGib_V1, getGib, getGibInfo, } from '@ibgib/ts-gib/dist/V1/index.mjs';
import { validateGib, validateIb, validateIbGibIntrinsically } from '@ibgib/ts-gib/dist/V1/validate-helper.mjs';
// import { IbGibSpaceAny } from '@ibgib/core-gib/dist/witness/space/space-base-v1.mjs';
// import { MetaspaceService } from '@ibgib/core-gib/dist/witness/space/metaspace/metaspace-types.mjs';

import { WitnessFormBuilder } from '@ibgib/core-gib/dist/witness/witness-form-builder.mjs';
// import { IbGibMetronomeAny } from './metronome-v1.mjs';
import {
    MetronomeData_V1, MetronomeRel8ns_V1, MetronomeIbGib_V1,
} from './metronome-types.mjs';
import { METRONOME_ATOM, METRONOME_NAME_REGEXP, } from './metronome-constants.mjs';

import { GLOBAL_LOG_A_LOT } from '../ibgib-constants.mjs';
/**
 * for logging. import this constant from your project.
 */
const logalot = GLOBAL_LOG_A_LOT || true;

export function validateCommonMetronomeData({
    data,
}: {
    data?: MetronomeData_V1,
}): string[] {
    const lc = `[${validateCommonMetronomeData.name}]`;
    try {
        if (logalot) { console.log(`${lc} starting...`); }
        if (!data) { throw new Error(`Metronome data required (E: a3040bef4dbff030745d9b174c0d194d)`); }
        const errors: string[] = [];
        const { name, uuid, classname, } = data;

        if (name) {
            if (!name.match(METRONOME_NAME_REGEXP)) {
                errors.push(`name must match regexp: ${METRONOME_NAME_REGEXP} (E: e2011ebbb46bf051f24df64b61864db2)`);
            }
        } else {
            errors.push(`name required.`);
        }

        if (uuid) {
            if (!uuid.match(UUID_REGEXP)) {
                errors.push(`uuid must match regexp: ${UUID_REGEXP} (E: 9b78722831a4fcb25ac3b036b57fb8e4)`);
            }
        } else {
            errors.push(`uuid required.`);
        }

        if (classname) {
            if (!classname.match(CLASSNAME_REGEXP)) {
                errors.push(`classname must match regexp: ${CLASSNAME_REGEXP}`);
            }
        }

        return errors;
    } catch (error) {
        console.error(`${lc} ${extractErrorMsg(error)}`);
        throw error;
    } finally {
        if (logalot) { console.log(`${lc} complete.`); }
    }
}

export async function validateCommonMetronomeIbGib({
    MetronomeIbGib,
}: {
    MetronomeIbGib: MetronomeIbGib_V1,
}): Promise<string[] | undefined> {
    const lc = `[${validateCommonMetronomeIbGib.name}]`;
    try {
        if (logalot) { console.log(`${lc} starting... (I: 115a74e2fbfb63a65981cf81bddffc74)`); }
        const intrinsicErrors: string[] = await validateIbGibIntrinsically({ ibGib: MetronomeIbGib }) ?? [];

        if (!MetronomeIbGib.data) { throw new Error(`MetronomeIbGib.data required (E: f9caaad0bbc20e2e3f6286fe3517f720)`); }
        const ibErrors: string[] = [];
        let { MetronomeClassname, MetronomeName, MetronomeId } =
            parseMetronomeIb({ ib: MetronomeIbGib.ib });
        if (!MetronomeClassname) { ibErrors.push(`MetronomeClassname required (E: 55a15aca2374d9b23e47c58f29ba41bb)`); }
        if (!MetronomeName) { ibErrors.push(`MetronomeName required (E: 4aa20200690e86f980ab67dc1302d519)`); }
        if (!MetronomeId) { ibErrors.push(`MetronomeId required (E: 8a0c1a98ebb90071a0c54623054b5ad2)`); }

        const dataErrors = validateCommonMetronomeData({ data: MetronomeIbGib.data });

        let result = [...(intrinsicErrors ?? []), ...(ibErrors ?? []), ...(dataErrors ?? [])];
        if (result.length > 0) {
            return result;
        } else {
            return undefined;
        }
    } catch (error) {
        console.error(`${lc} ${extractErrorMsg(error)}`);
        throw error;
    } finally {
        if (logalot) { console.log(`${lc} complete.`); }
    }
}

export function getMetronomeIb({
    data,
    classname,
}: {
    data: MetronomeData_V1,
    classname?: string,
}): Ib {
    const lc = `[${getMetronomeIb.name}]`;
    try {
        const validationErrors = validateCommonMetronomeData({ data });
        if (validationErrors.length > 0) { throw new Error(`invalid Metronome data: ${validationErrors} (E: cb865d01fadadbc1760f6b89852f6260)`); }
        if (classname) {
            if (data.classname && data.classname !== classname) { throw new Error(`classname does not match Metronome data.classname (E: 1d8c2a690f0daa651af4569702a30a8f)`); }
        } else {
            classname = data.classname;
            if (!classname) { throw new Error(`classname required (E: d4a90312d7b510e7fb729ccaf92cd9ab)`); }
        }

        // ad hoc validation here. should centralize witness classname validation

        const { name, uuid } = data;
        return `witness METRONOME_ATOM ${classname} ${name} ${uuid}`;
    } catch (error) {
        console.error(`${lc} ${extractErrorMsg(error)}`);
        throw error;
    }
}

/**
 * Current schema is 'witness METRONOME_ATOM [classname] [MetronomeName] [MetronomeId]'
 *
 * NOTE this is space-delimited
 */
export function parseMetronomeIb({
    ib,
}: {
    ib: Ib,
}): {
    MetronomeClassname: string,
    MetronomeName: string,
    MetronomeId: string,
} {
    const lc = `[${parseMetronomeIb.name}]`;
    try {
        if (!ib) { throw new Error(`Metronome ib required (E: bd8b22c6305005115214e1ef9609b36f)`); }

        const pieces = ib.split(' ');

        return {
            MetronomeClassname: pieces[2],
            MetronomeName: pieces[3],
            MetronomeId: pieces[4],
        };
    } catch (error) {
        console.error(`${lc} ${extractErrorMsg(error)}`);
        throw error;
    }
}

export class MetronomeFormBuilder extends WitnessFormBuilder {
    protected lc: string = `[${MetronomeFormBuilder.name}]`;

    constructor() {
        super();
        this.what = METRONOME_ATOM;
    }

    // exampleSetting({
    //     of,
    //     required,
    // }: {
    //     of: string,
    //     required?: boolean,
    // }): MetronomeFormBuilder {
    //     this.addItem({
    //         // Metronome.data.exampleSetting
    //         name: "exampleSetting",
    //         description: `example description`,
    //         label: "Example Label",
    //         regexp: EXAMPLE_REGEXP,
    //         regexpErrorMsg: EXAMPLE_REGEXP_DESC,
    //         dataType: 'textarea',
    //         value: of,
    //         required,
    //     });
    //     return this;
    // }

}
