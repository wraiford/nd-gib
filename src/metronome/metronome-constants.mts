/**
 * @module metronome constants
 *
 * witness constants are in this file!
 */

// /**
//  * example enum-like type+const that I use in ibgib. sometimes i put
//  * these in the types.mts and sometimes in the const.mts, depending
//  * on context.
//  */
// export type SomeEnum =
//     'ib' | 'gib';
// export const SomeEnum = {
//     ib: 'ib' as SomeEnum,
//     gib: 'gib' as SomeEnum,
// } satisfies { [key: string]: SomeEnum };
// export const SOME_TYPE_VALUES: SomeEnum[] = Object.values(SomeEnum);

/**
 * atom used in ibs
 */
export const METRONOME_ATOM = 'metronome';

/**
 * default regexp for a simple name string.
 */
export const METRONOME_NAME_REGEXP = /^[a-zA-Z0-9_-.]{1,255}$/;

export const DEFAULT_NAME_METRONOME = 'Metronome';
export const DEFAULT_DESCRIPTION_METRONOME = 'Keeps time at some frequency. Witness ibgibs register themselves with the metronome. There are details for how exactly it executes on time, but the basic gist is that it executes/starts to execute one or more registered witnesses via their `witness` function (visitor pattern). This makes it part interval, part stopwatch, part scheduler.';


/**
 * for use with validating time units of metronomes
 */
export const TIME_UNITS_REGEXP = /^(ms|s|bpm|unit)$/;
