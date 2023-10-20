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

export const METRONOME_NAME_REGEXP = /^[a-zA-Z0-9_-.]{1,255}$/;


export const TIME_UNITS_REGEXP = /^(ms|s|bpm)$/;
