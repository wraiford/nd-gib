/**
 * @module index.mjs gets imported by the index.html...
 *
 * still just sketching and feeling, feeling and sketching...
 */

import { delay, getUUID } from "@ibgib/helper-gib/dist/helpers/utils-helper.mjs";
import { SketchyRenderer_V1 } from "./renderer/sketchy-renderer-v1.mjs";

import { GLOBAL_LOG_A_LOT } from "./ibgib-constants.mjs";
const logalot = GLOBAL_LOG_A_LOT || true;


// window.addEventListener("load", draw);

// async function draw(): Promise<void> {
// await doTestRenderer('canvas1');
// await doTestRenderer('canvas2');
// await doTestRenderer('canvas3');
// await doTestRenderer('canvas4');
// }

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

let sizingViews = false;
async function sizeViews(): Promise<void> {
    const lc = `[${sizeViews.name}]`;
    try {
        if (logalot) { console.log(`${lc} starting... (I: 6ce21828ccedaae6b7bedc4b15c14223)`); }
        if (sizingViews) { return; /* <<<< returns early */ }
        sizingViews = true;

        const divMetacanvas = document.getElementById("metacanvas") as HTMLDivElement;
        const canvasCount = divMetacanvas.childNodes.length;

        /**
         * views atow are square, so get the smallest max edge size for the window
         */
        const smallestWindowSide =
            window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;

        if (canvasCount === 0) {
            return; /* <<<< returns early */
        } else if (canvasCount === 1) {
            const canvas = divMetacanvas.children.item(0) as HTMLCanvasElement;
            canvas.style.width = `${smallestWindowSide}px`;
            canvas.style.height = `${smallestWindowSide}px`;
        } else {
            const rowSize_withoutPadding = Math.floor(smallestWindowSide / 2);
            const canvasSize = Math.floor(0.7 * rowSize_withoutPadding);
            const totalPadding = rowSize_withoutPadding - canvasSize;
            const halfPadding = Math.floor(totalPadding / 2);
            const canvases = [...divMetacanvas.children];
            for (let i = 0; i < canvases.length; i++) {
                const canvas = canvases[i] as HTMLCanvasElement;
                canvas.style.width = `${canvasSize}px`;
                canvas.style.height = `${canvasSize}px`;
                canvas.style.top = `${i * rowSize_withoutPadding + halfPadding}px`;
                canvas.style.right = i % 2 === 0 ?
                    `${halfPadding}px` :
                    `${canvasSize + totalPadding}px`;
            }
        }
    } catch (error) {
        console.error(`${lc} ${error.message}`);
        throw error;
    } finally {
        if (logalot) { console.log(`${lc} complete.`); }
        sizingViews = false;
    }
}

export async function handleClick_addView(): Promise<void> {
    const lc = `[${handleClick_addView.name}]`;
    try {
        if (logalot) { console.log(`${lc} starting... (I: ed54c14a1ae44f6f9263f5ac307088db)`); }

        const divMetacanvas = document.getElementById("metacanvas") as HTMLDivElement;
        const canvas = document.createElement('canvas');
        // const canvas = new HTMLCanvasElement();
        canvas.id = await getUUID();
        divMetacanvas.appendChild(canvas);

        await sizeViews();

        await doTestRenderer(canvas.id);
    } catch (error) {
        console.error(`${lc} ${error.message}`);
        throw error;
    } finally {
        if (logalot) { console.log(`${lc} complete.`); }
    }
}
(window as any).handleClick_addView = handleClick_addView;

export function handleClick_addScene(): void {
    const lc = `[${handleClick_addScene.name}]`;
    try {
        if (logalot) { console.log(`${lc} starting... (I: d6a04b12c75cfd1e0a00fbcfa72deb23)`); }

    } catch (error) {
        console.error(`${lc} ${error.message}`);
        throw error;
    } finally {
        if (logalot) { console.log(`${lc} complete.`); }
    }
}
(window as any).handleClick_addScene = handleClick_addScene;

window.addEventListener('resize', () => {
    if (sizingViews) { return; /* <<<< returns early */ }
    setTimeout(async () => {
        await sizeViews();
    });
});
