import { firstOfAll, ifWe, ifWeMight, iReckon, lastOfAll, respecfully, respecfullyDear } from '@ibgib/helper-gib/dist/respec-gib/respec-gib.mjs';
const maam = `[${import.meta.url}]`, sir = maam;
import { IbGib_V1 } from '@ibgib/ts-gib/dist/V1/types.mjs';

/**
 * wrapper that uses crypto.subtle under the hood (i.e. doesn't hash using ts-gib)
 *
 * notes:
 *
 * * i did in fact copy this from ts-gib though, but we're testing simply that the
 *   context (node/browser/whatever) has this since it's integral to all things ibgib.
 */
async function cryptoSubtleHash({
    s,
    algorithm = 'SHA-256',
}: {
    s: string,
    algorithm?: string,
}): Promise<string> {
    let { subtle } = globalThis.crypto;
    if (!s) { throw new Error(`[${cryptoSubtleHash.name}] s is required`) }
    if (!algorithm) { throw new Error(`[${cryptoSubtleHash.name}] algorithm is required`) }
    try {
        const msgUint8 = new TextEncoder().encode(s);
        const buffer = await subtle.digest(algorithm, msgUint8);
        const asArray = Array.from(new Uint8Array(buffer));
        return asArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
        console.error(e.message ?? e);
        throw e;
    }
}

await respecfully(sir, `non-ts-gib isomorphic crypto hashing`, async () => {

    await ifWe(sir, `should digest simple string consistently using crypto.subtle directly `, async () => {
        let h = await cryptoSubtleHash({ s: '42' });
        iReckon(sir, h).asTo('42').isGonnaBe('73475cb40a568e8da8a045ced110137e159f890ac4da883b6b17dc651b3a8049');
    });
    await ifWe(sir, `should digest simple stringified ibgib consistently using crypto.subtle directly `, async () => {
        let ibgib: IbGib_V1 = { ib: 'ib', gib: 'gib' };
        let h = await cryptoSubtleHash({ s: JSON.stringify(ibgib) }); // doesn't use ts-gib but consistent stringifying json is important
        iReckon(sir, h).asTo('ib^gib').isGonnaBe('cbad0694a257358c044611ea1fa88ace71a01a9b8409d2354d0387d8043f7671');
    });
});
