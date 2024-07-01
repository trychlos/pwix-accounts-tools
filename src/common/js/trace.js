/*
 * pwix:accounts-tools/src/common/js/trace.js
 */

_verbose = function( level ){
    if( AccountsTools.opts().verbosity() & level ){
        let args = [ ...arguments ];
        args.shift();
        console.debug( ...args );
    }
};

_trace = function( functionName ){
    _verbose( AccountsTools.C.Verbose.FUNCTIONS, ...arguments );
};
