import { delay } from "@ibgib/helper-gib/dist/helpers/utils-helper.mjs";

import { RenderOptions } from "./render-types.mjs";
import { RendererBase_V1 } from "./renderer-base-v1.mjs";

import { GLOBAL_LOG_A_LOT } from "../ibgib-constants.mjs";
const logalot = GLOBAL_LOG_A_LOT || true;


export class SketchyRenderer_V1 extends RendererBase_V1 {
    protected lc: string = `[${SketchyRenderer_V1.name}]`;

    positionYo: [x: number, y: number] = [10, 10];
    sizeYo: number = 10;
    canvas: HTMLCanvasElement | undefined = undefined;
    get height(): number { return this.canvas?.clientHeight ?? 0; }
    get width(): number { return this.canvas?.clientWidth ?? 0; }
    get halfHeight(): number { return Math.ceil(this.height / 2); }
    get halfWidth(): number { return Math.ceil(this.width / 2); }

    private _canvasName: string = "";
    get canvasName(): string {
        return this._canvasName;
    }
    set canvasName(name: string) {
        const lc = `${this.lc}[set canvasName]`;
        if (name !== this._canvasName) {
            if (logalot) { console.log(`${lc} old this._canvasName: ${this._canvasName}. new value: ${name} (I: 65c3f3901ef8a1819f3b6e8591411b23)`); }
            this._canvasName = name;
            if (name) {
                this.canvas = document.getElementById(name) as HTMLCanvasElement;
            } else {
                delete this.canvas;
            }

            // really this should be reference counted with a max number of
            // queueing init calls (or something) otherwise this could turn into
            // a memory-leak like situation
            this.ready = this.initialize();
        }
    }

    /**
     *
     */
    constructor(name: string) {
        super();
        this.canvasName = name;
    }

    async initialize(): Promise<void> {
        const lc = `${this.lc}[${this.initialize.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting... (I: d933fa9c267ee1b074a3422db72b4f23)`); }
            await super.initialize();
            if (this.canvasName) {
                while (!this.canvas) {
                    if (logalot) { console.log(`${lc} delaying because this.canvas (${this.canvasName}) is falsy (I: 344db72f3bddbfe5cbb659e8eb3ba123)`); }
                    await delay(1000);
                }
            }
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

            if (!this.canvas) { throw new Error(`this.canvas required. shouldn't be rendering if not initialized, and shouldn't be done initializing if this.canvas is falsy . (E: 8b9419186231279d75b87cd5f05dcb23)`); }
            const { canvas } = this;
            if (!canvas.getContext) { throw new Error(`canvas.getContext falsy. browser doesn't support canvas? (E: d86582220edd8fb155f820eaa3f9fd23)`); }
            const context = canvas.getContext("2d");
            if (!context) { throw new Error(`context not found? (E: 6c68916c11f325c70a8c30eb543e6c23)`); }

            await this.renderGrid();

            // await delay(Math.random() * 1000);
            await delay(1000 + Math.random() * 500);

            // let [x, y] = this.positionYo;
            let x = Math.random() * this.width;
            let y = Math.random() * this.height;
            // x++;
            let colorNoise = Math.random() * 3;
            // this.positionYo = [x + noise, noise];
            let { sizeYo } = this;
            let halfSize = Math.ceil(sizeYo / 2);
            context.fillStyle = `rgb(${168 - colorNoise}, ${16 + colorNoise}, ${x - colorNoise})`
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
            if (!this.canvas) { throw new Error(`this.canvas required. shouldn't be rendering if not initialized, and shouldn't be done initializing if this.canvas is falsy . (E: 7cc6ae6df66649a89408b88f527dd88e)`); }
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
