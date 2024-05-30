/*
 * pwix:accounts-tools/src/common/js/functions.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

/**
 * @locus Anywhere
 * @param {Object} document
 * @returns {Object} the cleaned-up user document
 * 
 * make sure the password, even crypted, is not returned:
 * {
 *     _id: '55QDvyxocA8XBnyTy',
 *     createdAt: 2023-02-08T21:16:56.851Z,
 *     services: { password: {}, email: { verificationTokens: [Array] } },
 *     username: 'cccc',
 *     emails: [ { address: 'cccc@ccc.cc', verified: true } ],
 *     isAllowed: true,
 *     createdBy: 'EqvmJAhNAZTBAECya',
 *     lastConnection: 2023-02-09T13:22:14.057Z,
 *     updatedAt: 2023-02-09T13:25:16.114Z,
 *     updatedBy: 'EqvmJAhNAZTBAECya'
 * }
 */
AccountsTools.cleanupUserDocument = function( user ){
    if( user ){
        if( user.services ){
            delete user.services.resume;
            if( user.services.password ){
                delete user.services.password.bcrypt;
            }
        }
        delete user.profile;
    }
    return user;
}

/**
 * @locus Anywhere
 * @param {String} email the email address to be examined
 * @param {Object} user the (optional) user document
 * @returns {Promise} which eventually will resolve to a true|false Boolean
 * Please note that we do not search in `users` collection if a user document is provided.
 * So the result will be false if the provided user document is not the right one for this email address.
 */
AccountsTools.isEmailVerified = async function( email, user=null ){
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
