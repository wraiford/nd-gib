/**
 * @module metronome types (and some enums/constants)
 */

import { IbGibAddr } from '@ibgib/ts-gib/dist/types.mjs';
import { IbGib_V1 } from '@ibgib/ts-gib/dist/V1/types.mjs';
import { WitnessWithContextData_V1, WitnessWithContextRel8ns_V1 } from '@ibgib/core-gib/dist/witness/witness-with-context/witness-with-context-types.mjs';
import { WitnessCmdData, WitnessCmdIbGib, WitnessCmdRel8ns } from '@ibgib/core-gib/dist/witness/witness-cmd/witness-cmd-types.mjs';
import { WitnessResultData, WitnessResultIbGib, WitnessResultRel8ns } from '@ibgib/core-gib/dist/witness/witness-types.mjs';
// and just to show where these things are
// import { CommentIbGib_V1 } from "@ibgib/core-gib/dist/common/comment/comment-types.mjs";
// import { MetaspaceService } from "@ibgib/core-gib/dist/witness/space/metaspace/metaspace-types.mjs";

/**
 * time units that we use for metronome frequency.
 */
export type MetronomeTimeUnits = 's' | 'ms' | 'bpm';
/**
 * @see {@link MetronomeTimeUnits}
 */
export const MetronomeTimeUnits = {
    s: 's' as MetronomeTimeUnits,
    ms: 'ms' as MetronomeTimeUnits,
    bpm: 'bpm' as MetronomeTimeUnits,
} satisfies { [key: string]: MetronomeTimeUnits };
/**
 * values of {@link MetronomeTimeUnits}
 */
export const METRONOME_TIME_UNITS_VALUES: MetronomeTimeUnits[] = Object.values(MetronomeTimeUnits);

/**
 * ibgib's intrinsic data goes here.
 *
 * @see {@link IbGib_V1.data}
 */
export interface MetronomeData_V1 extends WitnessWithContextData_V1 {
    /**
     * how fast does the metronome tick
     *
     * @see {@link frequencyUnits}
     */
    frequency: number;

    /**
     * units that correspond to the frequncy
     *
     * @see {@link frequncy}
     */
    frequencyUnits: MetronomeTimeUnits;   // setting: string;
}

/**
 * rel8ns (named edges/links in DAG) go here.
 *
 * @see {@link IbGib_V1.rel8ns}
 */
export interface MetronomeRel8ns_V1 extends WitnessWithContextRel8ns_V1 {
    // /**
    //  * required rel8n. for most, put in metronome-constants.mts file
    //  *
    //  * @see {@link REQUIRED_REL8N_NAME}
    //  */
    // [REQUIRED_REL8N_NAME]: IbGibAddr[];
    // /**
    //  * optional rel8n. for most, put in metronome-constants.mts file
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
 * @see {@link MetronomeData_V1}
 * @see {@link MetronomeRel8ns_V1}
 */
export interface MetronomeIbGib_V1 extends IbGib_V1<MetronomeData_V1, MetronomeRel8ns_V1> {

}

export const DEFAULT_METRONOME_DATA_V1: MetronomeData_V1 = {
    frequency: 0,
    frequencyUnits: MetronomeTimeUnits.ms,

    allowPrimitiveArgs: true,
    catchAllErrors: true,
    classname: 'Metronome_V1',
}

export const DEFAULT_METRONOME_REL8NS_V1: MetronomeRel8ns_V1 | undefined = undefined;

/**
 * Cmds for interacting with ibgib witnesses.
 *
 * Not all of these will be implemented for every witness.
 *
 * ## todo
 *
 * change these commands to better structure, e.g., verb/do/mod, can/get/addrs
 * */
export type MetronomeCmd =
    'ib' | 'gib' | 'ibgib';
/** Cmds for interacting with ibgib spaces. */
export const MetronomeCmd = {
    /**
     * it's more like a grunt that is intepreted by context.
     */
    ib: 'ib' as MetronomeCmd,
    /**
     * it's more like a grunt that is intepreted by context.
     */
    gib: 'gib' as MetronomeCmd,
    /**
     * third placeholder command.
     *
     * I imagine this will be like "what's up", but who knows.
     */
    ibgib: 'ibgib' as MetronomeCmd,
}

/**
 * Flags to affect the command's interpretation.
 */
export type MetronomeCmdModifier =
    'ib' | 'gib' | 'ibgib';
/**
 * Flags to affect the command's interpretation.
 */
export const MetronomeCmdModifier = {
    /**
     * hmm...
     */
    ib: 'ib' as MetronomeCmdModifier,
    /**
     * hmm...
     */
    gib: 'gib' as MetronomeCmdModifier,
    /**
     * hmm...
     */
    ibgib: 'ibgib' as MetronomeCmdModifier,
}

/** Information for interacting with spaces. */
export interface MetronomeCmdData
    extends WitnessCmdData<MetronomeCmd, MetronomeCmdModifier> {
}

export interface MetronomeCmdRel8ns extends WitnessCmdRel8ns {
}

/**
 * Shape of options ibgib if used for a command-based witness.
 */
export interface MetronomeCmdIbGib
    extends WitnessCmdIbGib<
        IbGib_V1,
        MetronomeCmd, MetronomeCmdModifier,
        MetronomeCmdData, MetronomeCmdRel8ns
    > {
}

/**
 * Optional shape of result data to app interactions.
 *
 * This is in addition of course to {@link MetronomeResultData}.
 *
 * so if you're sending a cmd to this witness, this should probably be the shape
 * of the result.
 *
 * ## notes
 *
 * * I'm not sure what to do with this atm, so I'm just stubbing out...
 */
export interface MetronomeResultData extends WitnessResultData {
}

/**
 * Marker interface rel8ns atm...
 *
 * so if you're sending a cmd to this witness, this should probably be the shape
 * of the result.
 *
 * I'm not sure what to do with this atm, so I'm just stubbing out...
 */
export interface MetronomeResultRel8ns extends WitnessResultRel8ns { }

/**
 * Shape of result ibgib if used for a app.
 *
 * so if you're sending a cmd to this witness, this should probably be the shape
 * of the result.
 *
 * I'm not sure what to do with this atm, so I'm just stubbing out...
 */
export interface MetronomeResultIbGib
    extends WitnessResultIbGib<IbGib_V1, MetronomeResultData, MetronomeResultRel8ns> {
}
