import { IbGibAddr, TjpIbGibAddr } from "@ibgib/ts-gib/dist/types.mjs";

export interface RenderOptions {
    /**
     * internally, a render may decide to only render certain priority level
     * render actions. or it may have a scheduler that updates at certain
     * frequencies, etc.
     *
     * a higher number should be a higher priority, i.e. gets rendered.
     */
    priority?: number;
    /**
     * If a target addr is set, then the render action is meant to render
     * at a specific ibgib.
     */
    targetAddr?: IbGibAddr;
    /**
     * if a target tjp addr is set, then the render action is meant to render
     * on any ibgibs who have a certain timeline (temporal junction point).
     */
    targetTjpAddr?: TjpIbGibAddr;
}

/**
 * interface for something (in the near future an ibgib) whose main function is
 * drawing something on something.
 */
export interface Renderer {
    render(opts: RenderOptions): Promise<void>;
}

/**
 * internal settings for a renderer
 */
export interface RendererData {
    /**
     * if render priority is at or above this threshold, then it must
     * be rendered. If it is below, then could be dropped if necessary.
     */
    priorityRequiredThreshold: number;
}
