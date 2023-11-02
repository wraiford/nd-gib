/**
 * @module renderer constants
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
export const RENDERER_ATOM = 'renderer';

/**
 * default regexp for a simple name string.
 */
export const RENDERER_NAME_REGEXP = /^[a-zA-Z0-9_-.]{1,255}$/;

export const DEFAULT_NAME_RENDERER = 'renderer';
export const DEFAULT_DESCRIPTION_RENDERER = 'renderer is a cool ibgib witness that has seriously fascinating behavior.';
