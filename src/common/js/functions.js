/*
 * pwix:accounts-tools/src/common/js/functions.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

/**
 * @locus Anywhere
 * @param {String} email the email address to be examined
 * @param {Object} user the user document
 * @returns {Promise} a Promise which eventually will resolve to a Boolean true|false value if no user document is provided
 *  or a Boolean true|false if a user document is provided
 * Please note that we do not search in `users` collection if a user document is provided.
 * So in this later case, the result will be false if the user document is not the right one for this email address.
 */
AccountsTools.isEmailVerified = async function( email, user ){
    if( user ){
        return Promise.resolve( AccountsTools._isEmailVerified( email, user ));
    }
    return AccountsTools._userDocByEmail( email )
        .then(( user ) => { return AccountsTools._isEmailVerified( email, user ); });
}

/**
 * @summary Returns the preferred label for the user
 * @locus Anywhere
 * @param {String|Object} arg the user identifier or the user document
 * @param {String} preferred the optional caller preference, either AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS,
 *  defaulting to the configured value
 * @returns {Promise} a Promise which eventually will resolve to an object with following keys:
 *  - label: the computed preferred label
 *  - origin: the origin, which may be 'ID' or AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS
 */
AccountsTools.preferredLabel = async function( arg, preferred=null ){
    if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.PREFERREDLABEL ){
        console.log( 'pwix:accounts-tools preferredLabel() arg='+arg, 'preferred='+preferred );
    }
    let result = AccountsTools._preferredLabelInitialResult( arg, preferred );
    if( result ){
        // if a user identifier is provided, returns a Promise which resolves to the updated result object
        if( _.isString( arg )){
            return Promise.resolve( result )
                .then(() => { return AccountsTools._preferredLabelById( arg, preferred || AccountsTools.opts().preferredLabel(), result ); });
        }
        if( _.isString( arg._id )){
            return Promise.resolve( result )
                .then(() => { return AccountsTools._preferredLabelByDoc( arg, preferred || AccountsTools.opts().preferredLabel(), result ); });
        }
    }
    console.error( 'AccountsTools.preferredLabel() expects at least one argument, none found' );
    return null;
};

/**
 * @summary Returns the preferred label for the user
 * @locus Anywhere
 * @param {String|Object} arg the user identifier or the user document
 * @param {String} preferred the optional caller preference, either AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS,
 *  defaulting to the configured value
 * @returns {ReactiveVar} a ReactiveVar which handles a Promise which eventually will resolve to an object with following keys:
 *  - label: the computed preferred label
 *  - origin: the origin, which may be 'ID' or AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS
 */
AccountsTools.preferredLabelRV = function( arg, preferred=null ){
    if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.PREFERREDLABEL ){
        console.log( 'pwix:accounts-tools preferredLabelRV() arg='+arg, 'preferred='+preferred );
    }
    const ret = AccountsTools.preferredLabel( arg, preferred );
    if( ret ){
        const rv = new ReactiveVar( AccountsTools._preferredLabelInitialResult( arg, preferred ));
        ret.then(( result ) => { rv.set( result ); });
        return rv;
    }
    return null;
};
