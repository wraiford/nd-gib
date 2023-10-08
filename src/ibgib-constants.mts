/**
 * @module ibgib-constants
 *
 * constants related to this CLI/RLI ibgib package as a whole.
 */

/**
 * Naive selective logging/tracing mechanism.
 *
 * I manually switch this in individual files as needed while
 * developing/troubleshooting. I can change it here to turn on extremely verbose
 * logging application wide (and turn off individual files).
 */
export const GLOBAL_LOG_A_LOT: boolean | number = false;

/**
 * Used in console.timeLog() calls.
 */
export const GLOBAL_TIMER_NAME = '[nd-gib timer]';
