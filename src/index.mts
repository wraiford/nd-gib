/**
 * @module index.mjs gets imported by the index.html...
 *
 * still just sketching and feeling, feeling and sketching...
 */

import { delay } from "@ibgib/helper-gib";
import { SketchyRenderer_V1 } from "./renderer/sketchy-renderer-v1.mjs";

import { GLOBAL_LOG_A_LOT } from "./ibgib-constants.mjs";
const logalot = GLOBAL_LOG_A_LOT || true;


window.addEventListener("load", draw);

async function draw(): Promise<void> {
    await doTestRenderer('canvas1');
    // await doTestRenderer('canvas2');
    // await doTestRenderer('canvas3');
    // await doTestRenderer('canvas4');
}

async function doTestRenderer(canvasName: string): Promise<void> {
    const lc = `[${doTestRenderer.name}]`;
    try {
        if (logalot) { console.log(`${lc} starting... (I: 554b4ce2b6d1bd8094a580a9c95c2d23)`); }
        let testRenderer = new SketchyRenderer_V1(canvasName);
        await testRenderer.initialized;
        setInterval(async () => {
            console.log('render interval loop yo')
            await testRenderer.render({
                priority: undefined,
                targetAddr: undefined,
                targetTjpAddr: undefined,
            });
            // }, Math.random() * 1000);
        }, 1000);


    } catch (error) {
        console.error(`${lc} ${error.message}`);
        throw error;
    } finally {
        if (logalot) { console.log(`${lc} complete.`); }
    }
}

export function handleClick(): void {
    const lc = `[${handleClick.name}]`;
    try {
        if (logalot) { console.log(`${lc} starting... (I: d6a04b12c75cfd1e0a00fbcfa72deb23)`); }

    } catch (error) {
        console.error(`${lc} ${error.message}`);
        throw error;
    } finally {
        if (logalot) { console.log(`${lc} complete.`); }
    }
}

(window as any).handleClick = handleClick;
