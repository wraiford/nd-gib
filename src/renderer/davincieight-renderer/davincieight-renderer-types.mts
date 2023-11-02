/**
 * @module davincieight-renderer types (and some enums/constants)
 */

import { IbGibAddr } from '@ibgib/ts-gib/dist/types.mjs';
import { IbGib_V1 } from '@ibgib/ts-gib/dist/V1/types.mjs';
import { WitnessWithContextData_V1, WitnessWithContextRel8ns_V1 } from '@ibgib/core-gib/dist/witness/witness-with-context/witness-with-context-types.mjs';
import { WitnessCmdData, WitnessCmdIbGib, WitnessCmdRel8ns } from '@ibgib/core-gib/dist/witness/witness-cmd/witness-cmd-types.mjs';
import { WitnessResultData, WitnessResultIbGib, WitnessResultRel8ns } from '@ibgib/core-gib/dist/witness/witness-types.mjs';
import { RendererData_V1, RendererRel8ns_V1 } from '../renderer-types.mjs';
import { DEFAULT_DESCRIPTION_DAVINCIEIGHT_RENDERER, DEFAULT_NAME_DAVINCIEIGHT_RENDERER, DEFAULT_UUID_DAVINCIEIGHT_RENDERER } from './davincieight-renderer-constants.mjs';
// and just to show where these things are
// import { CommentIbGib_V1 } from "@ibgib/core-gib/dist/common/comment/comment-types.mjs";
// import { MetaspaceService } from "@ibgib/core-gib/dist/witness/space/metaspace/metaspace-types.mjs";

// /**
//  * example enum-like type+const that I use in ibgib. sometimes i put
//  * these in the types.mts and sometimes in the const.mts, depending
//  * on context.
//  */
// export type SomeEnum =
//     'ib' | 'gib';
// /**
//  * @see {@link SomeEnum}
//  */
// export const SomeEnum = {
//     ib: 'ib' as SomeEnum,
//     gib: 'gib' as SomeEnum,
// } satisfies { [key: string]: SomeEnum };
// /**
//  * values of {@link SomeEnum}
//  */
// export const SOME_ENUM_VALUES: SomeEnum[] = Object.values(SomeEnum);

/**
 * ibgib's intrinsic data goes here.
 *
 * @see {@link IbGib_V1.data}
 */
export interface DavincieightRendererData_V1 extends RendererData_V1 {
    // ibgib data (settings/values/etc) goes here
    // /**
    //  * docs yo
    //  */
    // setting: string;
}

/**
 * rel8ns (named edges/links in DAG) go here.
 *
 * @see {@link IbGib_V1.rel8ns}
 */
export interface DavincieightRendererRel8ns_V1 extends RendererRel8ns_V1 {
    // /**
    //  * required rel8n. for most, put in davincieight-renderer-constants.mts file
    //  *
    //  * @see {@link REQUIRED_REL8N_NAME}
    //  */
    // [REQUIRED_REL8N_NAME]: IbGibAddr[];
    // /**
    //  * optional rel8n. for most, put in davincieight-renderer-constants.mts file
    //  *
    //  * @see {@link OPTIONAL_REL8N_NAME}
    //  */
    // [OPTIONAL_REL8N_NAME]?: IbGibAddr[];
}

/**
 * this is the ibgib object itself.
 *
 * If this is a plain ibgib data only object, this acts as a dto. You may also
 * want to generate a witness ibgib, which is slightly different, for ibgibs
 * that will have behavior (i.e. methods).
 *
 * @see {@link DavincieightRendererData_V1}
 * @see {@link DavincieightRendererRel8ns_V1}
 */
export interface DavincieightRendererIbGib_V1 extends IbGib_V1<DavincieightRendererData_V1, DavincieightRendererRel8ns_V1> {

}

/**
 * Cmds for interacting with ibgib witnesses.
 *
 * Not all of these will be implemented for every witness.
 *
 * ## todo
 *
 * change these commands to better structure, e.g., verb/do/mod, can/get/addrs
 * */
export type DavincieightRendererCmd =
    'ib' | 'gib' | 'ibgib';
/** Cmds for interacting with ibgib spaces. */
export const DavincieightRendererCmd = {
    /**
     * it's more like a grunt that is intepreted by context.
     */
    ib: 'ib' as DavincieightRendererCmd,
    /**
     * it's more like a grunt that is intepreted by context.
     */
    gib: 'gib' as DavincieightRendererCmd,
    /**
     * third placeholder command.
     *
     * I imagine this will be like "what's up", but who knows.
     */
    ibgib: 'ibgib' as DavincieightRendererCmd,
}

/**
 * Flags to affect the command's interpretation.
 */
export type DavincieightRendererCmdModifier =
    'ib' | 'gib' | 'ibgib';
/**
 * Flags to affect the command's interpretation.
 */
export const DavincieightRendererCmdModifier = {
    /**
     * hmm...
     */
    ib: 'ib' as DavincieightRendererCmdModifier,
    /**
     * hmm...
     */
    gib: 'gib' as DavincieightRendererCmdModifier,
    /**
     * hmm...
     */
    ibgib: 'ibgib' as DavincieightRendererCmdModifier,
}

/** Information for interacting with spaces. */
export interface DavincieightRendererCmdData
    extends WitnessCmdData<DavincieightRendererCmd, DavincieightRendererCmdModifier> {
}

export interface DavincieightRendererCmdRel8ns extends WitnessCmdRel8ns {
}

/**
 * Shape of options ibgib if used for a command-based witness.
 */
export interface DavincieightRendererCmdIbGib
    extends WitnessCmdIbGib<
        IbGib_V1,
        DavincieightRendererCmd, DavincieightRendererCmdModifier,
        DavincieightRendererCmdData, DavincieightRendererCmdRel8ns
    > {
}

/**
 * Optional shape of result data to app interactions.
 *
 * This is in addition of course to {@link DavincieightRendererResultData}.
 *
 * so if you're sending a cmd to this witness, this should probably be the shape
 * of the result.
 *
 * ## notes
 *
 * * I'm not sure what to do with this atm, so I'm just stubbing out...
 */
export interface DavincieightRendererResultData extends WitnessResultData {
}

/**
 * Marker interface rel8ns atm...
 *
 * so if you're sending a cmd to this witness, this should probably be the shape
 * of the result.
 *
 * I'm not sure what to do with this atm, so I'm just stubbing out...
 */
export interface DavincieightRendererResultRel8ns extends WitnessResultRel8ns { }

/**
 * Shape of result ibgib if used for a app.
 *
 * so if you're sending a cmd to this witness, this should probably be the shape
 * of the result.
 *
 * I'm not sure what to do with this atm, so I'm just stubbing out...
 */
export interface DavincieightRendererResultIbGib
    extends WitnessResultIbGib<IbGib_V1, DavincieightRendererResultData, DavincieightRendererResultRel8ns> {
}

/**
 * shape of underscore-delimited addl metadata string that may be present in the
 * ib (i.e. available when parsing the ib)
 *
 * This is not hard and fast and can (and should?) vary greatly per use case.
 */
export interface DavincieightRendererAddlMetadata {
    /**
     * should be davincieight-renderer
     */
    atom?: 'davincieight-renderer'
    /**
     * classname of davincieight-renderer **with any underscores removed**.
     */
    classnameIsh?: string;
    /**
     * name of davincieight-renderer witness (data.name) **with any underscores removed**.
     */
    nameIsh?: string;
    /**
     * id of rcli app witness **with any underscores removed**.
     *
     * may be a substring per use case...?
     */
    idIsh?: string;
}

/**
 * Default data values for a renderer.
 *
 * If you change this, please bump the version
 *
 * (but of course won't be the end of the world when this doesn't happen).
 */
export const DEFAULT_DAVINCIEIGHT_RENDERER_DATA_V1: DavincieightRendererData_V1 = {
    version: '1',
    uuid: DEFAULT_UUID_DAVINCIEIGHT_RENDERER,
    name: DEFAULT_NAME_DAVINCIEIGHT_RENDERER,
    description: DEFAULT_DESCRIPTION_DAVINCIEIGHT_RENDERER,
    classname: `DavincieightRenderer_V1`,

    /**
     * if true, then the witness will attempt to persist ALL calls to
     * \`witness.witness\`.
     */
    persistOptsAndResultIbGibs: false,
    /**
     * allow ibgibs like 42^gib ({ib: 42, gib: 'gib'} with \`data\` and \`rel8ns\` undefined)
     */
    allowPrimitiveArgs: true,
    /**
     * witnesses should be guaranteed not to throw uncaught exceptions.
     */
    catchAllErrors: true,
    /**
     * if true, would enable logging of all calls to \`witness.witness(...)\`
     */
    trace: false,

    // put in your custom defaults here
}
export const DEFAULT_DAVINCIEIGHT_RENDERER_REL8NS_V1: DavincieightRendererRel8ns_V1 | undefined = undefined;
