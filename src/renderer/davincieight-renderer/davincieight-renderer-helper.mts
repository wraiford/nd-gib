/*
 * @module davincieight-renderer helper/util/etc. functions
 *
 * this is where you will find helper functions like those that generate
 * and parse ibs for davincieight-renderer.
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

import { GLOBAL_LOG_A_LOT } from '../../ibgib-constants.mjs';
// import { IbGibDavincieightRendererAny } from './davincieight-renderer-v1.mjs';
import {
    DavincieightRendererData_V1, DavincieightRendererRel8ns_V1, DavincieightRendererIbGib_V1,
} from './davincieight-renderer-types.mjs';
import { DAVINCIEIGHT_RENDERER_NAME_REGEXP, } from './davincieight-renderer-constants.mjs';

/**
 * for logging. import this constant from your project.
 */
const logalot = GLOBAL_LOG_A_LOT || true; // remove the true to "turn off" verbose logging

export function validateCommonDavincieightRendererData({
    data,
}: {
    data?: DavincieightRendererData_V1,
}): string[] {
    const lc = `[${validateCommonDavincieightRendererData.name}]`;
    try {
        if (logalot) { console.log(`${lc} starting...`); }
        if (!data) { throw new Error(`DavincieightRenderer data required (E: 5c652dca18569ff374a5103fc0aeff65)`); }
        const errors: string[] = [];
        const {
            name, uuid, classname,
        } =
            data;

        if (name) {
            if (!name.match(DAVINCIEIGHT_RENDERER_NAME_REGEXP)) {
                errors.push(`name must match regexp: ${DAVINCIEIGHT_RENDERER_NAME_REGEXP} (E: cd3be1fcf80f614c95e2b2eef85b39ff)`);
            }
        } else {
            errors.push(`name required.`);
        }

        if (uuid) {
            if (!uuid.match(UUID_REGEXP)) {
                errors.push(`uuid must match regexp: ${UUID_REGEXP} (E: eadf318ac8628c6af0bbf0152b8f0f50)`);
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

export async function validateCommonDavincieightRendererIbGib({
    ibGib,
}: {
    ibGib: DavincieightRendererIbGib_V1,
}): Promise<string[] | undefined> {
    const lc = `[${validateCommonDavincieightRendererIbGib.name}]`;
    try {
        if (logalot) { console.log(`${lc} starting... (I: e516244fef56f9681ed89e1a7e256c36)`); }
        const intrinsicErrors: string[] = await validateIbGibIntrinsically({ ibGib }) ?? [];

        if (!ibGib.data) { throw new Error(`ibGib.data required (E: c9937a9bf403810834dcf06d836ee90a)`); }
        const ibErrors: string[] = [];
        let { DavincieightRendererClassname, DavincieightRendererName, DavincieightRendererId } =
            parseDavincieightRendererIb({ ib: ibGib.ib });
        if (!DavincieightRendererClassname) { ibErrors.push(`DavincieightRendererClassname required (E: 74eb7b6853074ffc5c2630c8a2f18bf3)`); }
        if (!DavincieightRendererName) { ibErrors.push(`DavincieightRendererName required (E: d7f0403630b2a65c9e858cae6605c5f8)`); }
        if (!DavincieightRendererId) { ibErrors.push(`DavincieightRendererId required (E: f2c773046d3ef83f08c00c9e77e51939)`); }

        const dataErrors = validateCommonDavincieightRendererData({ data: ibGib.data });

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

export function getDavincieightRendererIb({
    data,
    classname,
}: {
    data: DavincieightRendererData_V1,
    classname?: string,
}): Ib {
    const lc = `[${getDavincieightRendererIb.name}]`;
    try {
        const validationErrors = validateCommonDavincieightRendererData({ data });
        if (validationErrors.length > 0) { throw new Error(`invalid DavincieightRendererData: ${validationErrors} (E: e923a0e6d72631153d46a590cebcda75)`); }
        if (classname) {
            if (data.classname && data.classname !== classname) { throw new Error(`classname does not match DavincieightRenderer data.classname (E: 38c1492ad0b1f1ede749a0984eefde01)`); }
        } else {
            classname = data.classname;
            if (!classname) { throw new Error(`classname required (E: a866257c5786b4206213373d1957e86b)`); }
        }

        // ad hoc validation here. should centralize witness classname validation

        const { name, uuid } = data;
        return `witness DAVINCIEIGHT_RENDERER_ATOM ${classname} ${name} ${uuid}`;
    } catch (error) {
        console.error(`${lc} ${extractErrorMsg(error)}`);
        throw error;
    }
}

/**
 * Current schema is 'witness DAVINCIEIGHT_RENDERER_ATOM [classname] [DavincieightRendererName] [DavincieightRendererId]'
 *
 * NOTE this is space-delimited
 */
export function parseDavincieightRendererIb({
    ib,
}: {
    ib: Ib,
}): {
    DavincieightRendererClassname: string,
    DavincieightRendererName: string,
    DavincieightRendererId: string,
} {
    const lc = `[${parseDavincieightRendererIb.name}]`;
    try {
        if (!ib) { throw new Error(`DavincieightRenderer ib required (E: 9aabe8232e4629012143b288914b644c)`); }

        const pieces = ib.split(' ');

        return {
            DavincieightRendererClassname: pieces[2],
            DavincieightRendererName: pieces[3],
            DavincieightRendererId: pieces[4],
        };
    } catch (error) {
        console.error(`${lc} ${extractErrorMsg(error)}`);
        throw error;
    }
}

export class DavincieightRendererFormBuilder extends WitnessFormBuilder {
    protected lc: string = `[${DavincieightRendererFormBuilder.name}]`;

    constructor() {
        super();
        this.what = 'davincieight-renderer';
    }

    // exampleSetting({
    //     of,
    //     required,
    // }: {
    //     of: string,
    //     required?: boolean,
    // }): DavincieightRendererFormBuilder {
    //     this.addItem({
    //         // DavincieightRenderer.data.exampleSetting
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
