import { delay } from "@ibgib/helper-gib/dist/helpers/utils-helper.mjs";

import { RenderOptions } from "./render-types.mjs";
import { RendererBase_V1 } from "./renderer-base-v1.mjs";

import { GLOBAL_LOG_A_LOT } from "../ibgib-constants.mjs";
const logalot = GLOBAL_LOG_A_LOT;


export class SketchyRenderer_V1 extends RendererBase_V1 {
    protected lc: string = `[${SketchyRenderer_V1.name}]`;

    positionYo: [x: number, y: number] = [10, 10];
    sizeYo: number = 10;
    canvas: HTMLCanvasElement = document.getElementById("canvas_yo") as HTMLCanvasElement;
    get height(): number {
        if (this.canvas) {
            return this.canvas.clientHeight;
        } else {
            return 0;
        }
    }
    get width(): number {
        if (this.canvas) {
            return this.canvas.clientWidth;
        } else {
            return 0;
        }
    }
    get halfHeight(): number { return Math.ceil(this.height / 2); }
    get halfWidth(): number { return Math.ceil(this.width / 2); }

    async initialize(): Promise<void> {
        const lc = `${this.lc}[${this.initialize.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting... (I: d933fa9c267ee1b074a3422db72b4f23)`); }
            await super.initialize();
            while (!this.canvas) { await delay(16); }
        } catch (error) {
            console.error(`${lc} ${error.message}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    async render({
        priority,
        targetAddr,
        targetTjpAddr,
    }: RenderOptions): Promise<void> {
        const lc = `${this.lc}[${this.render.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting... (I: ae684a79619fe4acf7f1123c7abf3b23)`); }
            const { canvas } = this;
            if (!canvas.getContext) { throw new Error(`canvas.getContext falsy. browser doesn't support canvas? (E: d86582220edd8fb155f820eaa3f9fd23)`); }
            const context = canvas.getContext("2d");
            if (!context) { throw new Error(`context not found? (E: 6c68916c11f325c70a8c30eb543e6c23)`); }

            await this.renderGrid();

            let [x, y] = this.positionYo;
            x++;
            this.positionYo = [x, y];
            let { sizeYo } = this;
            let halfSize = Math.ceil(sizeYo / 2);
            context.fillStyle = `rgb(168, 16, ${x})`
            context?.fillRect(x - halfSize, y - halfSize, sizeYo, sizeYo);

        } catch (error) {
            console.error(`${lc} ${error.message}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    gridRendered = 0;
    async renderGrid(): Promise<void> {
        const lc = `${this.lc}[${this.renderGrid.name}]`;
        try {
            if (this.gridRendered > 2) { return; /* <<<< returns early */ }
            // render the axes
            const context = this.canvas.getContext('2d');
            if (!context) { throw new Error(`couldn't get 2d context? (E: 2cee5c6f47643843d9b5648316251c23)`); }

            context.beginPath();
            context.moveTo(this.halfWidth, this.height / 10);
            context.lineTo(this.halfWidth, this.height);
            context.moveTo(0, this.halfHeight);
            context.lineTo(this.width, this.halfHeight);
            context.stroke();
            // this.gridRendered = true;
            this.gridRendered++;
        } catch (error) {
            console.error(`${lc} ${error.message}`);
            throw error;
        }
    }
}
