/*
 * pwix:accounts-tools/src/common/js/preferred.js
 */

import _ from 'lodash';

/*
 * @summary returns the preferred label for the user
 * @locus Anywhere
 * @param {Object} user the user document got from the database
 * @param {String} preferred an optional preference, either AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS,
 *  defaulting to the configured value.
 * @returns: {Promise}
 */
AccountsTools._preferredLabelByDoc = function( user, preferred, result ){
    if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.PREFERREDLABEL ){
        console.log( 'pwix:accounts-tools preferredLabelByDoc() user=', user, 'preferred='+preferred, 'result=', result );
    }
    //console.debug( user );
    return Promise.resolve( result )
        .then(() => {
            if( user ){
                let mypref = preferred;
                if( !mypref || !Object.keys( AccountsTools.C.PreferredLabel ).includes( mypref )){
                    mypref = AccountsTools.opts().preferredLabel();
                }

                if( mypref === AccountsTools.C.PreferredLabel.USERNAME && user.username ){
                    result = { label: user.username, origin: AccountsTools.C.PreferredLabel.USERNAME };

                } else if( mypref === AccountsTools.C.PreferredLabel.EMAIL_ADDRESS && user.emails[0].address ){
                    result = { label: user.emails[0].address, origin: AccountsTools.C.PreferredLabel.EMAIL_ADDRESS };

                } else if( user.username ){
                    if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.PREFERREDLABEL ){
                        console.log( 'pwix:accounts-tools fallback to username while preferred is', mypref );
                    }
                    result = { label: user.username, origin: AccountsTools.C.PreferredLabel.USERNAME };

                } else if( user.emails[0].address ){
                    if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.PREFERREDLABEL ){
                        console.log( 'pwix:accounts-tools fallback to email address name while preferred is', mypref );
                    }
                    const words = user.emails[0].address.split( '@' );
                    result = { label: words[0], origin: AccountsTools.C.PreferredLabel.EMAIL_ADDRESS };
                }
            }
            return result;
        });
};

/*
 * @summary Returns the preferred label for the user
 * @locus Anywhere
 * @param {String} arg the user identifier
 * @param {String} preferred the optional caller preference
 * @param {Object} the result object
 * @returns {Promise}
 */
AccountsTools._preferredLabelById = function( id, preferred, result ){
    if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.PREFERREDLABEL ){
        console.log( 'pwix:accounts-tools preferredLabelById() id='+id, 'preferred='+preferred, 'result=', result );
    }
    //console.debug( id );
    return AccountsTools._userDoc( id )
        .then(( user ) => { return AccountsTools._preferredLabelByDoc( user, preferred, result ); })
        .then(( result ) => { return Promise.resolve( result ); });
};

/**
 * @summary Returns the preferred label for the user
 * @locus Anywhere
 * @param {String|Object} arg the user identifier or the user document
 * @param {String} preferred the optional caller preference, either AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS,
 *  defaulting to the configured value
 * @returns {Promise} a Promise which eventually resolves to the result, as an object with following keys:
 *  - label: the computed preferred label
 *  - origin: the origin, which may be 'ID' or AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS
 */
AccountsTools.preferredLabel = function( arg, preferred=null ){
    if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.PREFERREDLABEL ){
        console.log( 'pwix:accounts-tools preferredLabel() arg='+arg, 'preferred='+preferred );
    }
    let id = null;
    let fn = null;
    if( arg ){
        if( _.isString( arg )){
            id = arg;
            fn = 'ById';
        } else if( _.isString( arg._id )){
            id = arg._id;
            fn = 'ByDoc';
        }
        let result = {
            label: id,
            origin: 'ID'
        };
        if( id && _.isString( id )){
            return Promise.resolve( result )
                .then(() => { return AccountsTools['_preferredLabel'+fn]( arg, preferred || AccountsTools.opts().preferredLabel(), result ); });
        }
    }
    throw new Meteor.Error( 'arg', 'incorrect argument' );
};
