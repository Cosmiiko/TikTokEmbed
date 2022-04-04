import { verboseLog } from "./utils";

export function redirectError(res, err, reqId) {
    res.render('error', {
        error: 'Couldn\'t follow redirects.'
    });

    verboseLog('redirect error on request', reqId, err);
}

export function findDataError(res, reqId) {
    res.render('error', {
        error: 'Couldn\'t find video metadata.'
    });

    verboseLog('empty video metadata error on request', reqId);
}

export function fetchError(res, err, reqId) {
    res.render('error', {
        error: 'Couldn\'t fetch video metadata.'
    });

    verboseLog('fetch video metadata error on request', reqId, err);
}
