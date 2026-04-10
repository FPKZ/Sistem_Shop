import * as vercelBlob from "@vercel/blob";
import { env } from "../config/env.js";

/**
 * Wrapper centralizado para o Vercel Blob.
 * Injeta automaticamente o token em todas as operações.
 */

const blobOptions = () => ({
    token: env.BLOB_TOKEN,
});

export async function put(pathname, body, options = {}) {
    return vercelBlob.put(pathname, body, {
        ...blobOptions(),
        ...options,
    });
}

export async function del(url, options = {}) {
    return vercelBlob.del(url, {
        ...blobOptions(),
        ...options,
    });
}

export async function head(url, options = {}) {
    return vercelBlob.head(url, {
        ...blobOptions(),
        ...options,
    });
}

export async function list(options = {}) {
    return vercelBlob.list({
        ...blobOptions(),
        ...options,
    });
}

export default {
    put,
    del,
    head,
    list,
};
