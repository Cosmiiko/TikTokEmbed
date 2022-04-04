export function verboseLog(...args) {
    if (process.env.VERBOSE == 'true') {
        console.log(args);
    }
};
