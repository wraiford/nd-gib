import {
    Basis,  // basis e1,e2...
    Box, // shape
    Capability,
    Color, // descends from coords (has position?)
    DirectionalLight, // > facet > shareable, ref counted
    Engine,
    Facet, // webgl related
    Geometric3, ImageTexture, MinecraftFigure, // multivector in 3d
    PerspectiveCamera,
    Scalar,
    Scene,
    Texture,
    TextureLoader,
    TextureMinFilter,
    TrackballControls,
} from 'davinci-eight';
import { delay, extractErrorMsg, getTimestampInTicks } from "@ibgib/helper-gib/dist/helpers/utils-helper.mjs";


import { GLOBAL_LOG_A_LOT } from "../ibgib-constants.mjs";
import { RendererBase_V1 } from './renderer-base-v1.mjs';
import {
    RenderOptions, RendererCmd, RendererCmdData, RendererCmdIbGib,
    RendererCmdModifier, RendererCmdRel8ns,
    RendererData_V1, RendererRel8ns_V1,
    RendererResultData, RendererResultRel8ns, RendererResultIbGib,
} from './renderer-types.mjs';
import { windowResizer } from './window-resizer.mjs';


const logalot = GLOBAL_LOG_A_LOT || true;

export interface SketchyRendererData_V1 extends RendererData_V1 {
}

export interface SketchyRendererRel8ns_V1 extends RendererRel8ns_V1 {

}

export class SketchyRenderer_V1 extends RendererBase_V1<
    RendererCmd, RendererCmdModifier,
    RendererCmdData<RendererCmd, RendererCmdModifier>,
    RendererCmdRel8ns,
    RendererCmdIbGib<RendererCmd, RendererCmdModifier, RendererCmdData<RendererCmd, RendererCmdModifier>, RendererCmdRel8ns>,
    RendererResultData, RendererResultRel8ns, RendererResultIbGib,
    SketchyRendererData_V1
> {
    protected parseAddlMetadataString<TParseResult>({ ib }: { ib: string; }): TParseResult {
        // const addlMetadataText = `${atom}_${classnameIsh}_${nameIsh}_${idIsh}`;
        throw new Error(`not impl yet check this over (E: e30e1b34df9f4f7cb69525d35b858202)`);
        if (!ib) { throw new Error(`ib required (E: e21d7b390bc94d7b80eb1de27d068aa7)`); }
        const lc = `[${this.parseAddlMetadataString.name}]`;
        try {
            const [atom, classnameIsh, nameIsh, idIsh] = ib.split('_');
            const result = { atom, classnameIsh, nameIsh, idIsh, } as TParseResult;
            return result as TParseResult; // i'm not liking the TParseResult...hmm
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg({ error })}`);
            throw error;
        }
    }

    protected lc: string = `[${SketchyRenderer_V1.name}]`;

    positionYo: [x: number, y: number] = [10, 10];
    sizeYo: number = 5;
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
                const canvas = document.getElementById(name) as HTMLCanvasElement;
                if (this.canvas !== canvas) {
                    canvas.addEventListener('onresize', (x: Event) => {
                        console.log(`${lc}[${getTimestampInTicks()}] canvas resized`)
                    });
                    canvas.addEventListener('mousemove', (x: MouseEvent) => {
                        console.log(`${lc}[${getTimestampInTicks()}] canvas onmousemove (${x.clientX - this.canvas!.clientLeft}, ${x.clientY - this.canvas!.clientTop})`)
                    });
                    this.canvas = canvas;
                    this.initializeCanvas(canvas);
                }
            } else {
                delete this.canvas;
            }

            // really this should be reference counted with a max number of
            // queueing init calls (or something) otherwise this could turn into
            // a memory-leak like situation
            this.initialized = this.initialize();
        }
    }

    engine: Engine | undefined;
    ambients: Facet[] = [];
    camera: PerspectiveCamera = new PerspectiveCamera();
    trackball: TrackballControls = new TrackballControls(this.camera, window);

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

    /**
     *
     * @param canvas
     */
    async initializeCanvas(canvas: HTMLCanvasElement): Promise<void> {
        const lc = `${this.lc}[${this.initializeCanvas.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting... (I: c90fdf0957a79d37fa03621805c19423)`); }

            const e1 = Geometric3.e1(true);
            const e2 = Geometric3.e2(true);
            const e3 = Geometric3.e3(true);

            // const engine = new Engine('canvas')
            this.engine = new Engine(canvas)
                .size(500, 500)
                .clearColor(0.1, 0.1, 0.1, 1.0)
                .enable(Capability.DEPTH_TEST)
            // this.engine = engine;

            // const ambients: Facet[] = []
            const { ambients, engine, camera, trackball } = this;
            // const camera = new PerspectiveCamera()
            camera.eye.z = 5
            // camera.eye = e2 + 5 * e3
            ambients.push(camera)

            const dirLight = new DirectionalLight()
            ambients.push(dirLight)

            const scene = new Scene(engine);
            const scene2 = new Scene(engine);
            const scene3 = new Scene(engine);

            const box = new Box(engine, { textured: true, color: Color.white, mode: 'mesh', });
            const loader = new TextureLoader(engine);
            const texture = await loader.imageTexture('green_with_squiggles.png')
            texture.minFilter = TextureMinFilter.NEAREST
            box.texture = texture
            scene.add(box);

            const basis = new Basis(engine)
            scene.add(basis);

            const box2 = new Box(engine, { textured: false, color: Color.white, mode: 'wire', });
            box2.position = box2.position.add(new Geometric3([0, box.height, box.width, box.depth, 0, 0, 0, 0]));
            scene2.add(box2);

            const box3 = new Box(engine, { textured: true, color: Color.gray, mode: 'mesh', });
            box3.position = box3.position.sub(new Geometric3([2, 2 * box.height, box.width, box.depth, 0, 0, 0, 0]));
            const loader3 = new TextureLoader(engine);
            const texture3 = await loader3.imageTexture('green_with_squiggles.png')
            texture3.minFilter = TextureMinFilter.NEAREST
            box3.texture = texture3
            scene3.add(box3);


            await this.initialize_trackball();

            const animate = function (_timestamp: number) {
                try {
                    engine.clear();

                    // Update the camera based upon mouse events received.
                    trackball.update();

                    // Keep the directional light pointing in the same direction as the camera.
                    dirLight.direction.copy(camera.look).sub(camera.eye);

                    const t = _timestamp * 0.001;
                    const theta = 2 * Math.PI * t / 1000;

                    // box.R.rotorFromGeneratorAngle({ xy: 0, yz: 1, zx: 0 }, theta)
                    // box.attitude.rotorFromAxisAngle(e2, t)

                    scene.render(ambients)
                    // basis.render(ambients)

                    // box2.position = box2.position.add(e2.mul(new Geometric3([0.001, 0.2, 2, 3, 0, 0, 0, 0])));
                    scene2.render(ambients);

                    scene3.render(ambients);
                    // This call keeps the animation going.
                    requestAnimationFrame(animate)
                }
                catch (e) {
                    document.body.innerHTML = `${e}`
                }
            }

            setInterval(() => {
                console.log(`${lc} box ${box.toString()}`)
                console.log(`${lc} box.position ${box.position.toString()}`)
                console.log(`${lc} box.attitude ${box.attitude.toString()}`)
            }, 1000);

            // Uncomment this line (and add the import)  if you want the canvas to fill the browser window.
            windowResizer(engine, camera).resize()

            // This call "primes the pump".
            requestAnimationFrame(animate)


        } catch (error) {
            console.error(`${lc} ${error.message}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    async initialize_trackball(): Promise<void> {
        const lc = `${this.lc}[${this.initialize_trackball.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting... (I: 8cafefedc571b9bb7446ee260fb24423)`); }

            let { trackball, engine } = this;

            // Subscribe to mouse events from the canvas.
            trackball.subscribe(engine!.canvas)
            trackball.enableContextMenu()
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

            // if (!this.canvas) { throw new Error(`this.canvas required. shouldn't be rendering if not initialized, and shouldn't be done initializing if this.canvas is falsy . (E: 8b9419186231279d75b87cd5f05dcb23)`); }
            // const { canvas } = this;
            // if (!canvas.getContext) { throw new Error(`canvas.getContext falsy. browser doesn't support canvas? (E: d86582220edd8fb155f820eaa3f9fd23)`); }
            // const context = canvas.getContext("3d");
            // if (!context) { throw new Error(`context not found? (E: 6c68916c11f325c70a8c30eb543e6c23)`); }

            // await this.renderGrid();

            // console.log(`${lc} this.width: ${this.width}`)
            // console.log(`${lc} this.height: ${this.height}`)

            // // await delay(Math.random() * 1000);
            // await delay(100 + Math.random() * 500);

            // // let [x, y] = this.positionYo;
            // let x = Math.random() * this.width;
            // let y = Math.random() * this.height;
            // // x++;
            // let colorNoise = Math.random() * 3;
            // // this.positionYo = [x + noise, noise];
            // let { sizeYo } = this;
            // let halfSize = Math.ceil(sizeYo / 2);
            // context.fillStyle = `rgb(${168 - colorNoise}, ${16 + colorNoise}, ${x - colorNoise})`
            // context?.fillRect(x - halfSize, y - halfSize, sizeYo, sizeYo);

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
