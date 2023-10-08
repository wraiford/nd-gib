import { getUUID } from "@ibgib/helper-gib/dist/helpers/utils-helper.mjs";
import { RenderOptions, Renderer } from "./render-types.mjs";

import { GLOBAL_LOG_A_LOT } from "../ibgib-constants.mjs";
const logalot = GLOBAL_LOG_A_LOT;

/**
 * base class for stuff that draws stuff...just sketching right now
 *
 * ## sketching...
 *
 * i'm thinking atm that a renderer can be both a canvas/webgl context (or
 * whatever) or an individual component within that context.
 */
export abstract class RendererBase_V1 implements Renderer {

    /**
     * log context, used all over so extremely terse.
     *
     * this should be inherited, and then appended to within functions.
     */
    protected lc: string = `[${RendererBase_V1.name}]`;
    protected instanceId: string | undefined;

    public ready: Promise<void>;

    constructor() {
        this.ready = this.initialize();
    }

    async initialize(): Promise<void> {
        this.instanceId = await getUUID();
    }

    async render({
        priority,
        targetAddr,
        targetTjpAddr,
    }: RenderOptions): Promise<void> {
        const lc = `${this.lc}[${this.render.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting... (I: ae684a79619fe4acf7f1123c7abf3b23)`); }
            const canvas = document.getElementById("canvas_yo") as HTMLCanvasElement;
            if (!canvas.getContext) { throw new Error(`canvas.getContext falsy. browser doesn't support canvas? (E: d86582220edd8fb155f820eaa3f9fd23)`); }
            const context = canvas.getContext("2d");
            if (!context) { throw new Error(`context not found? (E: 6c68916c11f325c70a8c30eb543e6c23)`); }
            context?.fillRect(10, 10, 20, 20);
        } catch (error) {
            console.error(`${lc} ${error.message}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

}
