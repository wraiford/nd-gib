/**
 * @module window-resizer
 *
 * cargo-culting from stemcstudio at {@link https://www.stemcstudio.com/gists/54644519dcd556bf8bf779bfa084ced3}
 */

import { Engine } from 'davinci-eight';
import { PerspectiveCamera } from 'davinci-eight';

export interface Resizer {
    /**
     * Forces a resize of the canvas to match the window.
     */
    resize(): this;
    /**
     * Stops the resizer from responding to resize events.
     */
    stop(): this;
}

/**
 * Creates an object that manages resizing of the output to fit the window.
 */
export function windowResizer(engine: Engine, camera: PerspectiveCamera): Resizer {
    const callback = function () {
        engine.size(window.innerWidth, window.innerHeight);
        // engine.viewport(0, 0, window.innerWidth, window.innerHeight);
        // engine.canvas.width = window.innerWidth;
        // engine.canvas.height = window.innerHeight;
        engine.canvas.style.width = `${window.innerWidth}px`;
        engine.canvas.style.height = `${window.innerHeight}px`;
        camera.aspect = window.innerWidth / window.innerHeight;
    }
    window.addEventListener('resize', callback, false);

    const that: Resizer = {
        /**
         * Forces a resize of the canvas to match the window.
         */
        resize: function () {
            callback()
            return that
        },
        /**
         * Stops the resizer from responding to resize events.
         */
        stop: function () {
            window.removeEventListener('resize', callback)
            return that
        }
    }
    return that;
}
