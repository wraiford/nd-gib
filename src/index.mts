/**
 * @module index.mjs gets imported by the index.html...
 *
 * still just sketching and feeling, feeling and sketching...
 */

import { delay } from "@ibgib/helper-gib";
import { SketchyRenderer_V1 } from "./render/sketchy-renderer-v1.mjs";


window.addEventListener("load", draw);

async function draw() {
    let testRenderer = new SketchyRenderer_V1();
    await testRenderer.ready;
    console.log('draw yo')
    setInterval(async () => {
        console.log('render interval loop yo')
        await testRenderer.render({
            priority: undefined,
            targetAddr: undefined,
            targetTjpAddr: undefined,
        });
    }, 100);
}
