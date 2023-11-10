/*
 * @module DavincieightRenderer_V1 witness class
 *
 * this is where you will find the witness class that contains behavior
 * for the DavincieightRenderer ibgib.
 */

import {
    extractErrorMsg, delay, getSaferSubstring,
    getTimestampInTicks, getUUID, pretty, clone, getIdPool,
} from '@ibgib/helper-gib/dist/helpers/utils-helper.mjs';
import { DEFAULT_DATA_PATH_DELIMITER } from '@ibgib/helper-gib/dist/constants.mjs';
import { IbGib_V1, Rel8n, } from '@ibgib/ts-gib/dist/V1/types.mjs';
import { Factory_V1, } from '@ibgib/ts-gib/dist/V1/factory.mjs';
import { TransformResult } from '@ibgib/ts-gib/dist/types.mjs';

import { ErrorIbGib_V1 } from '@ibgib/core-gib/dist/common/error/error-types.mjs';
import { WitnessWithContextBase_V1 } from '@ibgib/core-gib/dist/witness/witness-with-context/witness-with-context-base-v1.mjs';
import { MetaspaceService } from '@ibgib/core-gib/dist/witness/space/metaspace/metaspace-types.mjs';
import { argy_, isArg, isCommand, resulty_ } from '@ibgib/core-gib/dist/witness/witness-helper.mjs';
import { isComment } from '@ibgib/core-gib/dist/common/comment/comment-helper.mjs';
import { isPic } from '@ibgib/core-gib/dist/common/pic/pic-helper.mjs';
import { CommentIbGib_V1 } from '@ibgib/core-gib/dist/common/comment/comment-types.mjs';
import { PicIbGib_V1 } from '@ibgib/core-gib/dist/common/pic/pic-types.mjs';
import { getErrorIbGib } from '@ibgib/core-gib/dist/common/error/error-helper.mjs';
import { DynamicFormBuilder } from '@ibgib/core-gib/dist/common/form/form-helper.mjs';
import { WitnessFormBuilder } from '@ibgib/core-gib/dist/witness/witness-form-builder.mjs';
import { DynamicFormFactoryBase } from '@ibgib/core-gib/dist/witness/factory/dynamic-form-factory-base.mjs';

import { GLOBAL_LOG_A_LOT } from '../../ibgib-constants.mjs';
import {
    DavincieightRendererData_V1, DavincieightRendererRel8ns_V1, DavincieightRendererIbGib_V1,
    DavincieightRendererCmd, DavincieightRendererCmdData, DavincieightRendererCmdRel8ns, DavincieightRendererCmdIbGib,
    DavincieightRendererResultData, DavincieightRendererResultRel8ns, DavincieightRendererResultIbGib,
    DavincieightRendererAddlMetadata,
    DEFAULT_DAVINCIEIGHT_RENDERER_DATA_V1,
    DEFAULT_DAVINCIEIGHT_RENDERER_REL8NS_V1,
    DavincieightRendererCmdModifier,
} from './davincieight-renderer-types.mjs';
import { DavincieightRendererFormBuilder, getDavincieightRendererIb } from './davincieight-renderer-helper.mjs';
import { DynamicForm } from '@ibgib/core-gib/dist/common/form/form-items.mjs';
import { DEFAULT_DESCRIPTION_DAVINCIEIGHT_RENDERER, DEFAULT_NAME_DAVINCIEIGHT_RENDERER } from './davincieight-renderer-constants.mjs';
import { RendererBase_V1 } from '../renderer-base-v1.mjs';


/**
 * for logging. import this constant from your project.
 */
const logalot = GLOBAL_LOG_A_LOT || true; // change this when you want to turn off verbose logging

/**
 * sketching...
 * under construction...
 */
export class DavincieightRenderer_V1
    extends RendererBase_V1<
        DavincieightRendererCmd, DavincieightRendererCmdModifier,
        DavincieightRendererCmdData, DavincieightRendererCmdRel8ns, DavincieightRendererCmdIbGib,
        DavincieightRendererResultData, DavincieightRendererResultRel8ns, DavincieightRendererResultIbGib,
        DavincieightRendererData_V1, DavincieightRendererRel8ns_V1>
    implements DavincieightRendererIbGib_V1 {

    protected parseAddlMetadataString<TParseResult>({ ib }: { ib: string; }): TParseResult {
        // const addlMetadataText = `${atom}_${classnameIsh}_${nameIsh}_${idIsh}`;
        throw new Error(`not impl yet check this over (E: fedb486e5d56eccbc73a79371d46d423)`);
        if (!ib) { throw new Error(`ib required (E: 9a00f2a7423086e5f4d78665e25f51c0)`); }
        const lc = `[${this.parseAddlMetadataString.name}]`;
        try {
            const [atom, classnameIsh, nameIsh, idIsh] = ib.split('_');
            const result = { atom, classnameIsh, nameIsh, idIsh, } as DavincieightRendererAddlMetadata;
            return result as TParseResult; // i'm not liking the TParseResult...hmm
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg({ error })}`);
            throw error;
        }
    }

    /**
     * Log context for convenience with logging. (Ignore if you don't want to use this.)
     */
    protected lc: string = `[${DavincieightRenderer_V1.name}]`;

    /**
     * Reference to the local ibgibs service, which is one way at getting at the
     * local user space.
     */
    public ibgibsSvc: MetaspaceService | undefined;

    constructor(initialData?: DavincieightRendererData_V1, initialRel8ns?: DavincieightRendererRel8ns_V1) {
        super(initialData, initialRel8ns);
    }

    /**
     * At this point in time, the arg has already been intrinsically validated,
     * as well as the internal state of this witness. so whatever this witness's
     * function is, it should be good to go.
     *
     * In the base class, this just returns {@link routeAndDoArg}. If you don't
     * want to route, then override this.
     */
    protected async witnessImpl(arg: DavincieightRendererCmdIbGib): Promise<DavincieightRendererResultIbGib | undefined> {
        const lc = `${this.lc}[${this.witnessImpl.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }

            // await this.loadNewerSelfIfAvailable(); // rendering requires not loading newer self every time

            let result: DavincieightRendererResultIbGib | undefined = undefined;

            if (isArg({ ibGib: (arg as IbGib_V1) })) {
                result = await this.routeAndDoArg({ arg });
            } else {
                result = await this.doNonArg({ ibGib: arg });
            }

            // if we didn't get a result, try the default.
            if (!result) {
                console.warn(`${lc} result still falsy. doing default handler. (W: aba0de32c3835056447d7de3a2fb0223)`);
                result = await this.doDefault({ ibGib: arg });
            }

            if (!result) { console.warn(`${lc} result falsy...Could not produce result? Was doDefault implemented in concrete class? (W: 15e70486bc33922f9388961bab815223)`); }

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
     * @see {@link isArg}
     * @see {@link doCmdArg}
     * @see {@link doDefault}.
     */
    protected async routeAndDoArg({
        arg,
    }: {
        arg: DavincieightRendererCmdIbGib,
    }): Promise<DavincieightRendererResultIbGib | undefined> {
        const lc = `${this.lc}[${this.routeAndDoArg.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            const ibGib = arg as IbGib_V1;
            if (!isArg({ ibGib })) { throw new Error(`ibGib is not an arg (E: f0e36b13acbcdb1123ee72bdb9ee7723)`); }
            if (isCommand({ ibGib })) {
                return this.doCmdArg({ arg: arg as DavincieightRendererCmdIbGib });
            } else if (isComment({ ibGib })) {
                return this.doComment({ ibGib: ibGib as CommentIbGib_V1 });
            } else if (isPic({ ibGib })) {
                return this.doPic({ ibGib: ibGib as PicIbGib_V1 });
            } else {
                return undefined;
            }
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            if (this.data?.catchAllErrors) {
                return (await getErrorIbGib({ rawMsg: extractErrorMsg(error) })) as DavincieightRendererResultIbGib;
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
     * doCmdIbgib}. This is largely to limit scope of responsibility of witness to
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
        arg: DavincieightRendererCmdIbGib,
    }): Promise<DavincieightRendererResultIbGib> {
        const lc = `${this.lc}[${this.doCmdArg.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            if (!arg.data?.cmd) { throw new Error(`invalid cmd arg. arg.data.cmd required. (E: aec4dd5bd967fbf36f9c4fad22210222)`); }
            if (arg.data.cmd === DavincieightRendererCmd.ib) {
                return this.doCmdIb({ arg: arg });
            } else if (arg.data.cmd === DavincieightRendererCmd.gib) {
                return this.doCmdGib({ arg: arg });
            } else if (arg.data.cmd === DavincieightRendererCmd.ibgib) {
                return this.doCmdIbgib({ arg: arg });
            } else {
                throw new Error(`unknown arg.data.cmd: ${arg.data.cmd} (E: 721fa6a5166327134f9504c1caa3e422)`);
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
    }): Promise<DavincieightRendererResultIbGib> {
        const lc = `${this.lc}[${this.doCmdIb.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            throw new Error(`not implemented in base class (E: 7298662a2b8f67611d16a8af0e499422)`);
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
    }): Promise<DavincieightRendererResultIbGib> {
        const lc = `${this.lc}[${this.doCmdGib.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            throw new Error(`not implemented in base class (E: b6bf2c788c734051956481be7283d006)`);
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
    }): Promise<DavincieightRendererResultIbGib> {
        const lc = `${this.lc}[${this.doCmdIbgib.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            throw new Error(`not implemented in base class (E: 4fee11f05315467abd036cd8555d27db)`);
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
    }): Promise<DavincieightRendererResultIbGib | undefined> {
        const lc = `${this.lc}[${this.doPic.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            throw new Error(`not implemented in base class (E: 16ba889931644d42ad9e476757dd0617)`);
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
    }): Promise<DavincieightRendererResultIbGib | undefined> {
        const lc = `${this.lc}[${this.doComment.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }

            throw new Error(`not implemented in base class (E: 0486a7864729456d993a1afe246faea4)`);
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
        ibGib: DavincieightRendererCmdIbGib,
    }): Promise<DavincieightRendererResultIbGib | undefined> {
        const lc = `${this.lc}[${this.doNonArg.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            return this.doDefault({ ibGib });
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
        ibGib: DavincieightRendererCmdIbGib,
    }): Promise<DavincieightRendererResultIbGib | undefined> {
        const lc = `${this.lc}[${this.doDefault.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            throw new Error(`not implemented in base class (E: 5038662186617aaf1f0cc698fd1f9622)`);
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
     * validates against common witness qualities.
     *
     * Override this with a call to `super.validateThis` for custom validation
     * for descending witness classes.
     *
     * @returns validation errors common to all davincieight-renderer witnesses, if any errors exist.
     */
    protected async validateThis(): Promise<string[]> {
        const lc = `${this.lc}[${this.validateThis.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            if (!this.data) {

            }
            const errors: string[] = [
                // ...await super.validateThis(),
                // ...validateCommonDavincieightRendererData({ data: this.data }),
            ];
            return errors;
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg(error)}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    /**
     * builds an arg ibGib.
     *
     * wrapper convenience to avoid long generic calls.
     */
    async argy({
        argData,
        ibMetadata,
        noTimestamp,
        ibGibs,
    }: {
        argData: DavincieightRendererCmdData,
        ibMetadata?: string,
        noTimestamp?: boolean,
        ibGibs?: IbGib_V1[],
    }): Promise<DavincieightRendererCmdIbGib> {
        const arg = await argy_<DavincieightRendererCmdData, DavincieightRendererCmdRel8ns, DavincieightRendererCmdIbGib>({
            argData,
            ibMetadata,
            noTimestamp
        });

        if (ibGibs) { arg.ibGibs = ibGibs; }

        return arg;
    }

    /**
     * builds a result ibGib, if indeed a result ibgib is required.
     *
     * This is only useful in witnesses that have more structured
     * inputs/outputs. For those that simply accept any ibgib incoming and
     * return a primitive like ib^gib or whatever, then this is unnecessary.
     *
     * wrapper convenience to avoid long generic calls.
     */
    async resulty({
        resultData,
        ibGibs,
    }: {
        resultData: DavincieightRendererResultData,
        ibGibs?: IbGib_V1[],
    }): Promise<DavincieightRendererResultIbGib> {
        const result = await resulty_<DavincieightRendererResultData, DavincieightRendererResultIbGib>({
            // ibMetadata: getDavincieightRendererResultMetadata({space: this}),
            resultData,
        });
        if (ibGibs) { result.ibGibs = ibGibs; }
        return result;
    }

}

/*
 * factory for random DavincieightRenderer witness.
 *
 * @see {@link DynamicFormFactoryBase}
 */
export class DavincieightRenderer_V1_Factory
    extends DynamicFormFactoryBase<DavincieightRendererData_V1, DavincieightRendererRel8ns_V1, DavincieightRenderer_V1> {

    protected lc: string = `[${DavincieightRenderer_V1_Factory.name}]`;

    getName(): string { return DavincieightRenderer_V1.name; }

    async newUp({
        data,
        rel8ns,
    }: {
        data?: DavincieightRendererData_V1,
        rel8ns?: DavincieightRendererRel8ns_V1,
    }): Promise<TransformResult<DavincieightRenderer_V1>> {
        const lc = `${this.lc}[${this.newUp.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            data ??= clone(DEFAULT_DAVINCIEIGHT_RENDERER_DATA_V1);
            data = data!;
            rel8ns = rel8ns ?? DEFAULT_DAVINCIEIGHT_RENDERER_REL8NS_V1 ? clone(DEFAULT_DAVINCIEIGHT_RENDERER_REL8NS_V1) : undefined;
            data.uuid ||= await getUUID();
            let { classname } = data;

            const ib = getDavincieightRendererIb({ data });

            const resFirstGen = await Factory_V1.firstGen({
                ib,
                parentIbGib: Factory_V1.primitive({ ib: `witness ${classname}` }),
                data,
                rel8ns,
                dna: true,
                linkedRel8ns: [Rel8n.ancestor, Rel8n.past],
                nCounter: true,
                tjp: { timestamp: true },
            }) as TransformResult<DavincieightRenderer_V1>;

            // replace the newIbGib which is just ib,gib,data,rel8ns with loaded
            // witness class (that has the witness function on it)
            const witnessDto = resFirstGen.newIbGib;
            let witnessIbGib = new DavincieightRenderer_V1(undefined, undefined);
            await witnessIbGib.loadIbGibDto(witnessDto);
            resFirstGen.newIbGib = witnessIbGib;
            if (logalot) { console.log(`${lc} witnessDto: ${pretty(witnessDto)} (I: 7d87ceab3e777d00546534d623b28d66)`); }

            return resFirstGen as TransformResult<DavincieightRenderer_V1>;
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg({ error })}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    async witnessToForm({ witness }: { witness: DavincieightRenderer_V1; }): Promise<DynamicForm> {
        const lc = `${this.lc}[${this.witnessToForm.name}]`;
        try {
            if (logalot) { console.log(`${lc} starting...`); }
            let { data } = witness;
            if (!data) { throw new Error(`(UNEXPECTED) witness.data falsy? (E: 43f46063e1442952f1182f5300cb90dd)`); }
            if (logalot) { console.log(`${lc} data: ${pretty(data)} (I: 191c9b4b712070b0cbd600d6894363cb)`); }
            // be careful of order here because of TS type inference
            const idPool = await getIdPool({ n: 100 });
            const form = new DavincieightRendererFormBuilder()
                .with({ idPool })
                .name({ of: data.name!, required: false, })
                .description({ of: data.description ?? DEFAULT_DESCRIPTION_DAVINCIEIGHT_RENDERER })
                .and<DavincieightRendererFormBuilder>()
                .and<DynamicFormBuilder>()
                .uuid({ of: data.uuid!, required: true })
                .classname({ of: data.classname! })
                .and<WitnessFormBuilder>()
                .commonWitnessFields({ data })
                .outputForm({
                    formName: 'form',
                    label: 'davincieight-renderer',
                });
            return Promise.resolve(form);
        } catch (error) {
            console.error(`${lc} ${extractErrorMsg({ error })}`);
            throw error;
        } finally {
            if (logalot) { console.log(`${lc} complete.`); }
        }
    }

    async formToWitness({ form }: { form: DynamicForm; }): Promise<TransformResult<DavincieightRenderer_V1>> {
        let data: DavincieightRendererData_V1 = clone(DEFAULT_DAVINCIEIGHT_RENDERER_DATA_V1);
        this.patchDataFromItems({ data, items: form.items, pathDelimiter: DEFAULT_DATA_PATH_DELIMITER });
        let resWitnessIbGib = await this.newUp({ data });
        return resWitnessIbGib;
    }

}
