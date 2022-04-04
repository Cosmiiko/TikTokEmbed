import path from 'path';
import url from 'url';

export function verboseLog(...args) {
    if (process.env.VERBOSE == 'true') {
        console.log(...args);
    }
};

export function dirname(importMeta) {
    return path.dirname(url.fileURLToPath(importMeta.url));
};
