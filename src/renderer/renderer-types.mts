/**
 * @module renderer types (and some enums/constants)
 */

import { IbGibAddr, TjpIbGibAddr } from '@ibgib/ts-gib/dist/types.mjs';
import { IbGib_V1 } from '@ibgib/ts-gib/dist/V1/types.mjs';
import { WitnessWithContextData_V1, WitnessWithContextRel8ns_V1 } from '@ibgib/core-gib/dist/witness/witness-with-context/witness-with-context-types.mjs';
import { WitnessCmdData, WitnessCmdIbGib, WitnessCmdRel8ns } from '@ibgib/core-gib/dist/witness/witness-cmd/witness-cmd-types.mjs';
import { WitnessResultData, WitnessResultIbGib, WitnessResultRel8ns } from '@ibgib/core-gib/dist/witness/witness-types.mjs';
// and just to show where these things are
// import { CommentIbGib_V1 } from "@ibgib/core-gib/dist/common/comment/comment-types.mjs";
// import { MetaspaceService } from "@ibgib/core-gib/dist/witness/space/metaspace/metaspace-types.mjs";

/**
 * options for the `render` function
 *
 * :under_construction:
 */
export interface RenderOptions {
    /**
     * internally, a render may decide to only render certain priority level
     * render actions. or it may have a scheduler that updates at certain
     * frequencies, etc.
     *
     * a higher number should be a higher priority, i.e. gets rendered.
     */
    priority?: number;
    /**
     * If a target addr is set, then the render action is meant to render
     * at a specific ibgib.
     */
    targetAddr?: IbGibAddr;
    /**
     * if a target tjp addr is set, then the render action is meant to render
     * on any ibgibs who have a certain timeline (temporal junction point).
     */
    targetTjpAddr?: TjpIbGibAddr;
}

/**
 * interface for something (in the near future an ibgib) whose main function is
 * drawing something on something.
 */
export interface Renderer {
    render(opts: RenderOptions): Promise<void>;
}


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
export interface RendererData_V1 extends WitnessWithContextData_V1 {
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
export interface RendererRel8ns_V1 extends WitnessWithContextRel8ns_V1 {
    // /**
    //  * required rel8n. for most, put in renderer-constants.mts file
    //  *
    //  * @see {@link REQUIRED_REL8N_NAME}
    //  */
    // [REQUIRED_REL8N_NAME]: IbGibAddr[];
    // /**
    //  * optional rel8n. for most, put in renderer-constants.mts file
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
 * @see {@link RendererData_V1}
 * @see {@link RendererRel8ns_V1}
 */
export interface RendererIbGib_V1 extends IbGib_V1<RendererData_V1, RendererRel8ns_V1> {

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
export type RendererCmd =
    'ib' | 'gib' | 'ibgib';
/** Cmds for interacting with ibgib spaces. */
export const RendererCmd = {
    /**
     * it's more like a grunt that is intepreted by context.
     */
    ib: 'ib' as RendererCmd,
    /**
     * it's more like a grunt that is intepreted by context.
     */
    gib: 'gib' as RendererCmd,
    /**
     * third placeholder command.
     *
     * I imagine this will be like "what's up", but who knows.
     */
    ibgib: 'ibgib' as RendererCmd,
}

/**
 * Flags to affect the command's interpretation.
 */
export type RendererCmdModifier =
    'ib' | 'gib' | 'ibgib';
/**
 * Flags to affect the command's interpretation.
 */
export const RendererCmdModifier = {
    /**
     * hmm...
     */
    ib: 'ib' as RendererCmdModifier,
    /**
     * hmm...
     */
    gib: 'gib' as RendererCmdModifier,
    /**
     * hmm...
     */
    ibgib: 'ibgib' as RendererCmdModifier,
}

/** Information for interacting with the renderer witness. */
export interface RendererCmdData<
    TCmds extends RendererCmd,
    TCmdModifiers extends RendererCmdModifier
> extends WitnessCmdData<TCmds, TCmdModifiers> {
}

export interface RendererCmdRel8ns extends WitnessCmdRel8ns {
}

/**
 * Shape of options ibgib if used for a command-based witness.
 */
export interface RendererCmdIbGib<
    TCmds extends RendererCmd, TCmdModifiers extends RendererCmdModifier,
    TCmdData extends RendererCmdData<TCmds, TCmdModifiers>,
    TCmdRel8ns extends WitnessCmdRel8ns
> extends WitnessCmdIbGib<
    IbGib_V1,
    TCmds, TCmdModifiers,
    TCmdData, TCmdRel8ns
> {
}

/**
 * Optional shape of result data to app interactions.
 *
 * This is in addition of course to {@link RendererResultData}.
 *
 * so if you're sending a cmd to this witness, this should probably be the shape
 * of the result.
 *
 * ## notes
 *
 * * I'm not sure what to do with this atm, so I'm just stubbing out...
 */
export interface RendererResultData extends WitnessResultData {
}

/**
 * Marker interface rel8ns atm...
 *
 * so if you're sending a cmd to this witness, this should probably be the shape
 * of the result.
 *
 * I'm not sure what to do with this atm, so I'm just stubbing out...
 */
export interface RendererResultRel8ns extends WitnessResultRel8ns { }

/**
 * Shape of result ibgib if used for a app.
 *
 * so if you're sending a cmd to this witness, this should probably be the shape
 * of the result.
 *
 * I'm not sure what to do with this atm, so I'm just stubbing out...
 */
export interface RendererResultIbGib
    extends WitnessResultIbGib<IbGib_V1, RendererResultData, RendererResultRel8ns> {
}


/**
 * addl metadata string in ib
 */
export interface RendererAddlMetadata {
    /**
     * should be 'renderer'
     */
    atom?: 'renderer';
    /**
     * classname of $name **with any underscores removed**.
     */
    classnameIsh?: string;
    /**
     * name of $name witness (data.name) **with any underscores removed**.
     */
    nameIsh?: string;
    /**
     * id of rcli app witness **with any underscores removed**.
     *
     * may be a substring per use case...?
     */
    idIsh?: string;
}
