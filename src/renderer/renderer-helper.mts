/*
 * @module renderer helper/util/etc. functions
 *
 * this is where you will find helper functions like those that generate
 * and parse ibs for renderer.
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
import { IbGib_V1, } from '@ibgib/ts-gib/dist/V1/types.mjs';
import { GIB, } from '@ibgib/ts-gib/dist/V1/constants.mjs';
import { validateGib, validateIb, validateIbGibIntrinsically, } from '@ibgib/ts-gib/dist/V1/validate-helper.mjs';
// import { IbGibSpaceAny } from '@ibgib/core-gib/dist/witness/space/space-base-v1.mjs';
// import { MetaspaceService } from '@ibgib/core-gib/dist/witness/space/metaspace/metaspace-types.mjs';
import { WitnessFormBuilder } from '@ibgib/core-gib/dist/witness/witness-form-builder.mjs';
// import { IbGibRendererAny } from './renderer-v1.mjs';

import { GLOBAL_LOG_A_LOT } from '../ibgib-constants.mjs';
import {
    RendererData_V1, RendererRel8ns_V1, RendererIbGib_V1,
} from './renderer-types.mjs';
import { RENDERER_NAME_REGEXP, } from './renderer-constants.mjs';

/**
 * for logging. import this constant from your project.
 */
const logalot = GLOBAL_LOG_A_LOT || true; // remove the true to "turn off" verbose logging

export function validateCommonRendererData({
    RendererData,
}: {
    RendererData?: RendererData_V1,
}): string[] {
    const lc = `[${validateCommonRendererData.name}]`;
    try {
        if (logalot) { console.log(`${lc} starting...`); }
        if (!RendererData) { throw new Error(`RendererData required (E: fcacc535eb348ae163afd84d5989c81f)`); }
        const errors: string[] = [];
        const {
            name, uuid, classname,
        } =
            RendererData;

        if (name) {
            if (!name.match(RENDERER_NAME_REGEXP)) {
                errors.push(`name must match regexp: ${RENDERER_NAME_REGEXP} (E: 34b122714bc47c4ec17a1290651b3427)`);
            }
        } else {
            errors.push(`name required.`);
        }

        if (uuid) {
            if (!uuid.match(UUID_REGEXP)) {
                errors.push(`uuid must match regexp: ${UUID_REGEXP} (E: d4eb373252e7c9e377dc10243705dbb4)`);
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

export async function validateCommonRendererIbGib({
    ibGib,
}: {
    ibGib: RendererIbGib_V1,
}): Promise<string[] | undefined> {
    const lc = `[${validateCommonRendererIbGib.name}]`;
    try {
        if (logalot) { console.log(`${lc} starting... (I: 1a6a393170fdd83e45555ce9f0f5e909)`); }
        const intrinsicErrors: string[] = await validateIbGibIntrinsically({ ibGib }) ?? [];

        if (!ibGib.data) { throw new Error(`ibGib.data required (E: e271a53b632c97c0c0923cc6fa76013f)`); }
        const ibErrors: string[] = [];
        let { RendererClassname, RendererName, RendererId } =
            parseRendererIb({ ib: ibGib.ib });
        if (!RendererClassname) { ibErrors.push(`RendererClassname required (E: 2e766b38d3278bd191e5c56887571058)`); }
        if (!RendererName) { ibErrors.push(`RendererName required (E: 4a2853d0d38dea94da8f6ccc86dc497d)`); }
        if (!RendererId) { ibErrors.push(`RendererId required (E: 9503b901a0d0910db35162fd6cd3aa5c)`); }

        const dataErrors = validateCommonRendererData({ RendererData: ibGib.data });

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

export function getRendererIb({
    RendererData,
    classname,
}: {
    RendererData: RendererData_V1,
    classname?: string,
}): Ib {
    const lc = `[${getRendererIb.name}]`;
    try {
        const validationErrors = validateCommonRendererData({ RendererData });
        if (validationErrors.length > 0) { throw new Error(`invalid RendererData: ${validationErrors} (E: 537183706d4d6f803ea750d64a3e874a)`); }
        if (classname) {
            if (RendererData.classname && RendererData.classname !== classname) { throw new Error(`classname does not match RendererData.classname (E: 26d1cb8b7c24903df5de4a0dcfc14660)`); }
        } else {
            classname = RendererData.classname;
            if (!classname) { throw new Error(`classname required (E: db2b4b69835dcc5eb989da60a01ed19b)`); }
        }

        // ad hoc validation here. should centralize witness classname validation

        const { name, uuid } = RendererData;
        return `witness RENDERER_ATOM ${classname} ${name} ${uuid}`;
    } catch (error) {
        console.error(`${lc} ${extractErrorMsg(error)}`);
        throw error;
    }
}

/**
 * Current schema is 'witness RENDERER_ATOM [classname] [RendererName] [RendererId]'
 *
 * NOTE this is space-delimited
 */
export function parseRendererIb({
    ib,
}: {
    ib: Ib,
}): {
    RendererClassname: string,
    RendererName: string,
    RendererId: string,
} {
    const lc = `[${parseRendererIb.name}]`;
    try {
        if (!ib) { throw new Error(`Renderer ib required (E: 2fee3f779575269d6fdcd4e94de8bca2)`); }

        const pieces = ib.split(' ');

        return {
            RendererClassname: pieces[2],
            RendererName: pieces[3],
            RendererId: pieces[4],
        };
    } catch (error) {
        console.error(`${lc} ${extractErrorMsg(error)}`);
        throw error;
    }
}

export class RendererFormBuilder extends WitnessFormBuilder {
    protected lc: string = `[${RendererFormBuilder.name}]`;

    constructor() {
        super();
        this.what = 'renderer';
    }

    // exampleSetting({
    //     of,
    //     required,
    // }: {
    //     of: string,
    //     required?: boolean,
    // }): RendererFormBuilder {
    //     this.addItem({
    //         // Renderer.data.exampleSetting
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
