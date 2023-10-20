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

import { extractErrorMsg, UUID_REGEXP, delay, getSaferSubstring, getTimestampInTicks, getUUID, pretty } from '@ibgib/helper-gib';
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
import { METRONOME_NAME_REGEXP, } from './metronome-constants.mjs';

import { GLOBAL_LOG_A_LOT } from '../ibgib-constants.mjs';
/**
 * for logging. import this constant from your project.
 */
const logalot = GLOBAL_LOG_A_LOT;

export function validateCommonMetronomeData({
    MetronomeData,
}: {
    MetronomeData?: MetronomeData_V1,
}): string[] {
    const lc = `[${validateCommonMetronomeData.name}]`;
    try {
        if (logalot) { console.log(`${lc} starting...`); }
        if (!MetronomeData) { throw new Error(`MetronomeData required (E: f1ac9317f69c16688de9f0b3487897c7)`); }
        const errors: string[] = [];
        const {
            name, uuid, classname,
        } =
            MetronomeData;

        if (name) {
            if (!name.match(METRONOME_NAME_REGEXP)) {
                errors.push(`name must match regexp: ${METRONOME_NAME_REGEXP} (E: edd69ceb198db32300eba9582640697a)`);
            }
        } else {
            errors.push(`name required.`);
        }

        if (uuid) {
            if (!uuid.match(UUID_REGEXP)) {
                errors.push(`uuid must match regexp: ${UUID_REGEXP} (E: 4fbe110da40279f33dd2030b6ca58404)`);
            }
        } else {
            errors.push(`uuid required.`);
        }

        if (classname) {
            if (!classname.match(METRONOME_NAME_REGEXP)) {
                errors.push(`classname must match regexp: ${METRONOME_NAME_REGEXP} (E: 36738222810391a4dfb0d1b720462240)`);
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
        if (logalot) { console.log(`${lc} starting... (I: f70c18c203fe5a90b002c66e566aaa78)`); }
        const intrinsicErrors: string[] = await validateIbGibIntrinsically({ ibGib: MetronomeIbGib }) ?? [];

        if (!MetronomeIbGib.data) { throw new Error(`MetronomeIbGib.data required (E: b4e32f03042b2dd301f35fa246f5758c)`); }
        const ibErrors: string[] = [];
        let { MetronomeClassname, MetronomeName, MetronomeId } =
            parseMetronomeIb({ MetronomeIb: MetronomeIbGib.ib });
        if (!MetronomeClassname) { ibErrors.push(`MetronomeClassname required (E: cb6e60f4c7c7715f3550924eb01f02e3)`); }
        if (!MetronomeName) { ibErrors.push(`MetronomeName required (E: f440149553e0f96e2a2fab3ea10de029)`); }
        if (!MetronomeId) { ibErrors.push(`MetronomeId required (E: e3111187d93d9e8914414bdf4dde16f4)`); }

        const dataErrors = validateCommonMetronomeData({ MetronomeData: MetronomeIbGib.data });

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
    MetronomeData,
    classname,
}: {
    MetronomeData: MetronomeData_V1,
    classname?: string,
}): Ib {
    const lc = `[${getMetronomeIb.name}]`;
    try {
        const validationErrors = validateCommonMetronomeData({ MetronomeData });
        if (validationErrors.length > 0) { throw new Error(`invalid MetronomeData: ${validationErrors} (E: e424c19428995c9abf7d508417d64f2f)`); }
        if (classname) {
            if (MetronomeData.classname && MetronomeData.classname !== classname) { throw new Error(`classname does not match MetronomeData.classname (E: 0644a174ed115e22217dd85263b4e591)`); }
        } else {
            classname = MetronomeData.classname;
            if (!classname) { throw new Error(`classname required (E: ca68793f95dc557830ab92930669f763)`); }
        }

        // ad hoc validation here. should centralize witness classname validation

        const { name, uuid } = MetronomeData;
        return `witness $snake_name ${classname} ${name} ${uuid}`;
    } catch (error) {
        console.error(`${lc} ${extractErrorMsg(error)}`);
        throw error;
    }
}

/**
 * Current schema is 'witness $snake_name [classname] [MetronomeName] [MetronomeId]'
 *
 * NOTE this is space-delimited
 */
export function parseMetronomeIb({
    MetronomeIb,
}: {
    MetronomeIb: Ib,
}): {
    MetronomeClassname: string,
    MetronomeName: string,
    MetronomeId: string,
} {
    const lc = `[${parseMetronomeIb.name}]`;
    try {
        if (!MetronomeIb) { throw new Error(`MetronomeIb required (E: 687bb34829b109282f072e09c4ad97f1)`); }

        const pieces = MetronomeIb.split(' ');

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
        this.what = 'metronome';
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
