/*
 * pwix:accounts-tools/src/common/js/config.js
 */

import _ from 'lodash';

import { acOptions } from '../classes/ac_options.class.js';

AccountsTools._conf = {};
AccountsTools._opts = null;

/**
 * @summary Package configuration
 *  Should be called *in same terms* both by the client and the server
 * @locus Anywhere
 * @param {Object} o the configuration options
 * @returns {Object} the package configuration
 */
AccountsTools.configure = function( o ){
    if( o && _.isObject( o )){
        _.merge( AccountsTools._conf, AccountsTools._defaults.conf, o );
        AccountsTools._opts.base_set( AccountsTools._conf );
        // be verbose if asked for
        if( AccountsTools.opts().verbosity() & AC_VERBOSE_CONFIGURE ){
            console.log( 'pwix:accounts-tools configure() with', o, 'building', AccountsTools._conf );
        }
    }
    // also acts as a getter
    return AccountsTools._conf;
};

/**
 * @summarry Runtime configuration getter
 * @locus Anywhere
 * @returns {acOptions} the runtime configuration object
 */
AccountsTools.opts = function(){
    return AccountsTools._opts;
};

_.merge( AccountsTools._conf, AccountsTools._defaults.conf );
AccountsTools._opts = new acOptions( AccountsTools._conf );
