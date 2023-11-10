import { extractErrorMsg, getUUID } from "@ibgib/helper-gib/dist/helpers/utils-helper.mjs";
import { IbGibRel8ns_V1, IbGib_V1 } from "@ibgib/ts-gib/dist/V1/types.mjs";
import { ErrorIbGib_V1 } from "@ibgib/core-gib/dist/common/error/error-types.mjs";
import { argy_, isArg, isCommand } from "@ibgib/core-gib/dist/witness/witness-helper.mjs";
import { WitnessWithContextBase_V1 } from "@ibgib/core-gib/dist/witness/witness-with-context/witness-with-context-base-v1.mjs";
import { AppBase_V1 } from "@ibgib/core-gib/dist/witness/app/app-base-v1.mjs";
import { MetaspaceService } from "@ibgib/core-gib/dist/witness/space/metaspace/metaspace-types.mjs";

import { GLOBAL_LOG_A_LOT } from "../ibgib-constants.mjs";
import { RenderOptions, RendererCmd, RendererCmdData, RendererCmdIbGib, RendererCmdModifier, RendererCmdRel8ns, RendererIbGib_V1 } from "./renderer-types.mjs";
import { RendererData_V1, RendererRel8ns_V1 } from "./renderer-types.mjs";
import { getErrorIbGib } from "@ibgib/core-gib/dist/common/error/error-helper.mjs";
import { isComment } from "@ibgib/core-gib/dist/common/comment/comment-helper.mjs";
import { isPic } from "@ibgib/core-gib/dist/common/pic/pic-helper.mjs";
import { CommentIbGib_V1 } from "@ibgib/core-gib/dist/common/comment/comment-types.mjs";
import { PicIbGib_V1 } from "@ibgib/core-gib/dist/common/pic/pic-types.mjs";

const logalot = GLOBAL_LOG_A_LOT || true;

/**
 * base class for stuff that draws stuff...just sketching right now
 *
 * ## sketching...
 *
 * i'm thinking atm that a renderer can be both a canvas/webgl context (or
 * whatever) or an individual component within that context.
 */
export abstract class RendererBase_V1<
    // export abstract class AppBase_V1<
    TCmd extends RendererCmd, TCmdModifiers extends RendererCmdModifier,
    TOptionsData extends any = any,
    TOptionsRel8ns extends IbGibRel8ns_V1 = IbGibRel8ns_V1,
    TOptionsIbGib extends IbGib_V1<TOptionsData, TOptionsRel8ns>
    = IbGib_V1<TOptionsData, TOptionsRel8ns>,
    TResultData extends any = any,
    TResultRel8ns extends IbGibRel8ns_V1 = IbGibRel8ns_V1,
    TResultIbGib extends IbGib_V1<TResultData, TResultRel8ns> | ErrorIbGib_V1
    = IbGib_V1<TResultData, TResultRel8ns>,
    TData extends RendererData_V1 = RendererData_V1,
    TRel8ns extends RendererRel8ns_V1 = RendererRel8ns_V1,
>
    extends WitnessWithContextBase_V1<
        // extends AppBase_V1<
        TOptionsData, TOptionsRel8ns, TOptionsIbGib,
        TResultData, TResultRel8ns, TResultIbGib,
        TData, TRel8ns>
    implements RendererIbGib_V1 {

    /**
     * log context, used all over so extremely terse.
     *
     * this should be inherited, and then appended to within functions.
     */
    protected lc: string = `[${RendererBase_V1.name}]`;
    protected instanceId: string | undefined;

    /**
     * Reference to the local ibgibs service, which is one way at getting at the
     * local user space.
     */
    ibgibsSvc: MetaspaceService | undefined;

    constructor(initialData?: TData, initialRel8ns?: TRel8ns) {
        super(initialData, initialRel8ns);
    }

    protected async initialize(): Promise<void> {
        const lc = `${this.lc}[${this.initialize.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting... (I: 0956163987874d399f41a58f54ea839c)`); }
            this.instanceId = await getUUID();
            await super.initialize();

            // await this.initialize_semanticHandlers();
            // await this.initialize_lex();
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
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
            if (logalot) { console.log(`${lc} starting... (I: 4ac712b655ac4d00b0f64eae44dc518c)`); }
            const canvas = document.getElementById("canvas_yo") as HTMLCanvasElement;
            if (!canvas.getContext) { throw new Error(`canvas.getContext falsy. browser doesn't support canvas? (E: d88175ce7988457e8e179f37d35ed520)`); }
            const context = canvas.getContext("2d");
            if (!context) { throw new Error(`context not found? (E: 5396803e3acd4683a9e858a9ba8743f7)`); }
            context?.fillRect(10, 10, 20, 20);
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    /*
     * At this point in time, the arg has already been intrinsically validated,
     * as well as the internal state of this app. so whatever this app's
     * function is, it should be good to go.
     *
     * In the base class, this just returns {@link routeAndDoArg}. If you don't
     * want to route, then override this.
     */
    protected async witnessImpl(arg: TOptionsIbGib): Promise<TResultIbGib | undefined> {
        const lc = `${this.lc}[${this.witnessImpl.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }

            await this.loadNewerSelfIfAvailable();

            let result: TResultIbGib | undefined = undefined;

            if (isArg({ ibGib: (arg as IbGib_V1) })) {
                result = await this.routeAndDoArg({ arg });
            } else {
                result = await this.doNonArg({ ibGib: arg as IbGib_V1 });
            }

            // if we didn't get a result, try the default.
            if (!result) {
                console.warn(`${lc} result still falsy. doing default handler. (W: a682520d3ad845e79fdf9965917b6e4a)`);
                result = await this.doDefault({ ibGib: arg as IbGib_V1 });
            }

            if (!result) { console.warn(`${lc} result falsy...Could not produce result? Was doDefault implemented in concrete class? (W: a9e8607bcc584357b7dfc3f7fb05155d)`); }

            return result;
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    /**
     * Base routing executes different if incoming is a cmd options arg, i.e.,
     * if the `data.cmd` is truthy (atow). {@link isArg} is expected to be true
     * at this point. If not, logs an error, **but does not throw**, and returns
     * undefined.
     *
     * Default routing checks arg for command, or if not, checks if comment/pic.
     * If neither of those, then returns undefined atow.
     *
     * Override this function to create more advanced custom routing.
     *
     * ## notes
     *
     * In general, an app ibgib acts more like a normal application in that it
     * accepts commands and not requests. Robbots are more geared to requests,
     * handled semantically.
     *
     * @see {@link isArg}
     * @see {@link doCmdArg}
     * @see {@link doDefault}.
     */
    protected async routeAndDoArg({
        arg,
    }: {
        arg: TOptionsIbGib,
    }): Promise<TResultIbGib | undefined> {
        const lc = `${this.lc}[${this.routeAndDoArg.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            const ibGib = arg as IbGib_V1;
            if (!isArg({ ibGib })) { throw new Error(`ibGib is not an arg (E: 9ec8ffe53a774925ae3d4777f9032bae)`); }
            if (isCommand({ ibGib })) {
                return this.doCmdArg({ arg: arg as RendererCmdIbGib<any, any, RendererCmdData<any, any>, RendererCmdRel8ns> });
            } else {
                return undefined;
            }

        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            if (this.data?.catchAllErrors) {
                return (await getErrorIbGib({ rawMsg: error.message })) as TResultIbGib;
            } else {
                throw error;
            }
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    // #region do cmd args

    /**
     * By default, this routes to {@link doCmdIb}, {@link doCmdGib} & {@link
     * doCmdIbgib}. This is largely to limit scope of responsibility of app to
     * basic functions. But this is not a concrete rule written in stone.
     *
     * You can always override this and route to other commands before calling
     * this with `super.doCmdArg` as a fallback (if you still want to use this
     * function.)
     *
     * Note that this @throws an error if the data.cmd is not recognized. In this
     * implementation, this occurs if it isn't an ib/gib/ibgib _command_.
     */
    protected doCmdArg({
        arg,
    }: {
        arg: RendererCmdIbGib<TCmd, TCmdModifiers, RendererCmdData<TCmd, TCmdModifiers>, RendererCmdRel8ns>,
    }): Promise<TResultIbGib> {
        const lc = `${this.lc}[${this.doCmdArg.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            if (!arg.data?.cmd) { throw new Error(`invalid cmd arg. arg.data.cmd required. (E: d87257b5593e49378f7013e5b5ce3588)`); }
            if (arg.data.cmd === RendererCmd.ib) {
                return this.doCmdIb({ arg: arg });
            } else if (arg.data.cmd === RendererCmd.gib) {
                return this.doCmdGib({ arg: arg });
            } else if (arg.data.cmd === RendererCmd.ibgib) {
                return this.doCmdIbgib({ arg: arg });
            } else {
                throw new Error(`unknown arg.data.cmd: ${arg.data.cmd} (E: 8597ffaf9a7147eabe20543aedea18a6)`);
            }
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    protected doCmdIb({
        arg,
    }: {
        arg: IbGib_V1,
    }): Promise<TResultIbGib> {
        const lc = `${this.lc}[${this.doCmdIb.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            throw new Error(`not implemented in base class (E: ca696c797cbf4261bb9ddf85e63dc217)`);
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }
    protected doCmdGib({
        arg,
    }: {
        arg: IbGib_V1,
    }): Promise<TResultIbGib> {
        const lc = `${this.lc}[${this.doCmdGib.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            throw new Error(`not implemented in base class (E: b0b1524a2b624f48b5c7f0f87d9f740e)`);
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }
    protected doCmdIbgib({
        arg,
    }: {
        arg: IbGib_V1,
    }): Promise<TResultIbGib> {
        const lc = `${this.lc}[${this.doCmdIbgib.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            throw new Error(`not implemented in base class (E: a02de5243f1346e5b4bedfbb8489fa9c)`);
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    // #endregion do cmd args

    // #region other stubbed do functions (doPic, doComment, doDefault)

    /**
     * Stubbed in base class for convenience. Doesn't have to be implemented.
     */
    protected doPic({
        ibGib,
    }: {
        ibGib: PicIbGib_V1,
    }): Promise<TResultIbGib | undefined> {
        const lc = `${this.lc}[${this.doPic.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            throw new Error(`not implemented in base class (E: 3faff6b822c949e1b65ef2a934acb752)`);
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    /**
     * Stubbed in base class for convenience. Doesn't have to be implemented.
     */
    protected doComment({
        ibGib,
    }: {
        ibGib: CommentIbGib_V1,
    }): Promise<TResultIbGib | undefined> {
        const lc = `${this.lc}[${this.doComment.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }

            throw new Error(`not implemented in base class (E: d1c6f593a8fc4795b6fc807d2a54a7fd)`);
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    protected doNonArg({
        ibGib,
    }: {
        ibGib: IbGib_V1,
    }): Promise<TResultIbGib | undefined> {
        const lc = `${this.lc}[${this.doNonArg.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            if (isComment({ ibGib })) {
                return this.doComment({ ibGib: ibGib as CommentIbGib_V1 });
            } else if (isPic({ ibGib })) {
                return this.doPic({ ibGib: ibGib as PicIbGib_V1 });
            } else {
                return this.doDefault({ ibGib });
            }
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }
    /**
     * Stubbed in base class for convenience. Doesn't have to be implemented.
     */
    protected doDefault({
        ibGib,
    }: {
        ibGib: IbGib_V1,
    }): Promise<TResultIbGib | undefined> {
        const lc = `${this.lc}[${this.doDefault.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            throw new Error(`not implemented in base class (E: 80db20403ac74420bde536fe3a9a88c3)`);
            // return this.doDefaultImpl({ibGib});
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    // #endregion other stubbed do functions (doPic, doComment, doDefault)

    /**
     * validates against common app qualities.
     *
     * Override this with a call to `super.validateThis` for custom validation
     * for descending app classes.
     *
     * @returns validation errors common to all apps, if any errors exist.
     */
    protected async validateThis(): Promise<string[]> {
        const lc = `${this.lc}[${this.validateThis.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            if (!this.data) {

            }
            const errors: string[] = [
                // ...await super.validateThis(),
                // ...validateCommonAppData({ appData: this.data }),
            ];
            return errors;
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    // /**
    //  * builds an arg ibGib.
    //  *
    //  * wrapper convenience to avoid long generic calls.
    //  */
    // async argy({
    //     argData,
    //     ibMetadata,
    //     noTimestamp,
    //     ibGibs,
    // }: {
    //     argData: TOptionsData,
    //     ibMetadata?: string,
    //     noTimestamp?: boolean,
    //     ibGibs?: IbGib_V1[],
    // }): Promise<TOptionsIbGib> {
    //     const arg = await argy_<TOptionsData, TOptionsRel8ns, TOptionsIbGib>({
    //         argData,
    //         ibMetadata,
    //         noTimestamp
    //     });

    //     if (ibGibs) { arg.ibGibs = ibGibs; }

    //     return arg;
    // }

    // /**
    //  * builds a result ibGib, if indeed a result ibgib is required.
    //  *
    //  * This is only useful in witnesses that have more structured
    //  * inputs/outputs. For those that simply accept any ibgib incoming and
    //  * return a primitive like ib^gib or whatever, then this is unnecessary.
    //  *
    //  * wrapper convenience to avoid long generic calls.
    //  */
    // async resulty({
    //     resultData,
    //     ibGibs,
    // }: {
    //     resultData: RendererResultData,
    //     ibGibs?: IbGib_V1[],
    // }): Promise<RendererResultIbGib> {
    //     const result = await resulty_<RendererResultData, RendererResultIbGib>({
    //         // ibMetadata: getRendererResultMetadata({space: this}),
    //         resultData,
    //     });
    //     if (ibGibs) { result.ibGibs = ibGibs; }
    //     return result;
    // }

}


// /*
//  * factory for random Renderer witness.
//  *
//  * @see {@link DynamicFormFactoryBase}
//  */
// export class Renderer_V1_Factory
//     extends DynamicFormFactoryBase<RendererData_V1, RendererRel8ns_V1, Renderer_V1> {

//     protected lc: string = `[${Renderer_V1_Factory.name}]`;

//     getName(): string { return Renderer_V1.name; }

//     async newUp({
//         data,
//         rel8ns,
//     }: {
//         data?: RendererData_V1,
//         rel8ns?: RendererRel8ns_V1,
//     }): Promise<TransformResult<Renderer_V1>> {
//         const lc = `${this.lc}[${this.newUp.name}]`;
//         try {
//             if (logalot) { console.log(`${lc} starting...`); }
//             data ??= clone(DEFAULT_RENDERER_DATA_V1);
//             data = data!;
//             rel8ns = rel8ns ?? DEFAULT_RENDERER_REL8NS_V1 ? clone(DEFAULT_RENDERER_REL8NS_V1) : undefined;
//             data.uuid ||= await getUUID();
//             let { classname } = data;

//             const ib = getRendererIb({ hmm });

//             const resFirstGen = await Factory_V1.firstGen({
//                 ib,
//                 parentIbGib: Factory_V1.primitive({ ib: `witness ${classname}` }),
//                 data,
//                 rel8ns,
//                 dna: true,
//                 linkedRel8ns: [Rel8n.ancestor, Rel8n.past],
//                 nCounter: true,
//                 tjp: { timestamp: true },
//             }) as TransformResult<Renderer_V1>;

//             // replace the newIbGib which is just ib,gib,data,rel8ns with loaded
//             // witness class (that has the witness function on it)
//             const witnessDto = resFirstGen.newIbGib;
//             let witnessIbGib = new Renderer_V1(undefined, undefined);
//             await witnessIbGib.loadIbGibDto(witnessDto);
//             resFirstGen.newIbGib = witnessIbGib;
//             if (logalot) { console.log(`${lc} witnessDto: ${pretty(witnessDto)} (I: 36a0edf219410e046438911709076bba)`); }

//             return resFirstGen as TransformResult<Renderer_V1>;
//         } catch (error) {
//             console.error(`${lc} ${extractErrorMsg({ error })}`);
//             throw error;
//         } finally {
//             if (logalot) { console.log(`${lc} complete.`); }
//         }
//     }

//     async witnessToForm({ witness }: { witness: Renderer_V1; }): Promise<DynamicForm> {
//         const lc = `${this.lc}[${this.witnessToForm.name}]`;
//         try {
//             if (logalot) { console.log(`${lc} starting...`); }
//             let { data } = witness;
//             if (!data) { throw new Error(`(UNEXPECTED) witness.data falsy? (E: f3ed3cfb6fa5f0861e50eb363977fa70)`); }
//             if (logalot) { console.log(`${lc} data: ${pretty(data)} (I: d0c41dcd2a00d0417dcdead1ec16e8cc)`); }
//             // be careful of order here because of TS type inference
//             const idPool = await getIdPool({ n: 100 });
//             const form = new RendererFormBuilder()
//                 .with({ idPool })
//                 .name({ of: data.name, required: false, })
//                 .description({ of: data.description ?? DEFAULT_DESCRIPTION_RENDERER })
//                 .and<RendererFormBuilder>()
//                 .and<DynamicFormBuilder>()
//                 .uuid({ of: data.uuid, required: true })
//                 .classname({ of: data.classname! })
//                 .and<WitnessFormBuilder>()
//                 .commonWitnessFields({ data })
//                 .outputForm({
//                     formName: 'form',
//                     label: 'renderer',
//                 });
//             return Promise.resolve(form);
//         } catch (error) {
//             console.error(`${lc} ${extractErrorMsg({ error })}`);
//             throw error;
//         } finally {
//             if (logalot) { console.log(`${lc} complete.`); }
//         }
//     }

//     async formToWitness({ form }: { form: DynamicForm; }): Promise<TransformResult<Renderer_V1>> {
//         let data: RendererData_V1 = clone(DEFAULT_RENDERER_DATA_V1);
//         this.patchDataFromItems({ data, items: form.items, pathDelimiter: DEFAULT_DATA_PATH_DELIMITER });
//         let resWitnessIbGib = await this.newUp({ data });
//         return resWitnessIbGib;
//     }

// }
