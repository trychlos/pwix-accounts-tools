/*
 * pwix:accounts-tools/src/common/js/config.js
 */

pwixAccountsTools = {
    // client-specific data and functions
    client: {},

    conf: {},

    // should be *in same terms* called both by the client and the server
    configure: function( o ){
        console.log( 'pwix:accounts-tools configure() with', o );
        pwixAccountsTools.conf = {
	    ...pwixAccountsTools.conf,
	    ...o
        };
    },

    // server-specific data and functions
    server: {}
};
