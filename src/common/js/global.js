/*
 * pwix:accounts-tools/src/common/js/config.js
 */

import { acConf } from '../classes/ac_conf.class.js';

pwixAccountsTools = {
    // client-specific data and functions
    client: {},

    _conf: {},
    _opts: null,

    // should be *in same terms* called both by the client and the server
    configure: function( o ){
        console.log( 'pwix:accounts-tools configure() with', o );
        pwixAccountsTools._conf = {
	    ...pwixAccountsTools._conf,
	    ...o
        };
        pwixAccountsTools._opts = new acConf( pwixAccountsTools._conf );
    },

    // configuration access
    opts(){
        return pwixAccountsTools._opts;
    },

    // server-specific data and functions
    server: {}
};
