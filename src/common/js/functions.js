/*
 * pwix:accounts-tools/src/common/js/functions.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

/**
 * @locus Anywhere
 * @param {String|Object} userA
 * @param {String|Object} userB
 * @returns {Boolean} whether userA and userB are same
 */
AccountsTools.areSame = function( userA, userB ){
    const idA = userA ? ( _.isObject( userA ) ? userA._id : ( _.isString( userA ) ? userA : null )) : null;
    const idB = userB ? ( _.isObject( userB ) ? userB._id : ( _.isString( userB ) ? userB : null )) : null;
    let res = true;
    if( idA === null ){
        console.warn( 'unable to get user identifier from', userA );
    }
    if( idB === null ){
        console.warn( 'unable to get user identifier from', userB );
    }
    if( idA && idB ){
        res = ( idA === idB );
    }
    return res;
}

/**
 * @locus Anywhere
 * @param {String} email
 * @param {Object} options an optional dictionary of fields to return or exclude
 * @returns {Promise} which will eventually resolve to the cleanup user document, or null
 */
AccountsTools.byEmail = async function( email, options={} ){
    check( email, String );
    check( options, Object );
    return await ( Meteor.isClient ? Meteor.callAsync( 'AccountsTools.byEmail', email, options ) : AccountsTools.server.byEmail( email, options ));
}

/**
 * @locus Anywhere
 * @param {String} id
 * @param {Object} options an optional dictionary of fields to return or exclude
 * @returns {Promise} which will eventually resolve to the cleanup user document, or null
 */
AccountsTools.byId = async function( email, options={} ){
    check( email, String );
    check( options, Object );
    return await ( Meteor.isClient ? Meteor.callAsync( 'AccountsTools.byId', id, options ) : AccountsTools.server.byId( i, options ));
}

/**
 * @locus Anywhere
 * @param {String} username
 * @param {Object} options an optional dictionary of fields to return or exclude
 * @returns {Promise} which will eventually resolve to the cleanup user document, or null
 */
AccountsTools.byUsername = async function( username, options={} ){
    check( username, String );
    check( options, Object );
    return await( Meteor.isClient ? Meteor.callAsync( 'AccountsTools.byUsername', username, options ) : AccountsTools.server.byUsername( username, options ));
}

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
        return AccountsTools._isEmailVerified( email, user );
    }
    return AccountsTools.byEmail( email )
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
    _verbose( AccountsTools.C.Verbose.PREFERREDLABEL, 'pwix:accounts-tools preferredLabel() arg='+arg, 'preferred='+preferred );
    let result = AccountsTools._preferredLabelInitialResult( arg, preferred );
    if( result ){
        // if a user identifier is provided, returns a Promise which resolves to the updated result object
        if( _.isString( arg )){
            return Promise.resolve( result )
                .then(() => { return AccountsTools._preferredLabelById( arg, preferred || AccountsTools.opts().preferredLabel(), result ); })
                .then(( res ) => {
                    //console.debug( 'res', res );
                    return res ? res : result;
                });
        }
        if( _.isString( arg._id )){
            return Promise.resolve( result )
                .then(() => { return AccountsTools._preferredLabelByDoc( arg, preferred || AccountsTools.opts().preferredLabel(), result ); })
                .then(( res ) => {
                    //console.debug( res );
                    return res;
                });
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
 * @returns {ReactiveVar} a ReactiveVar initialized with the default result object.
 *  This ReactiveVar will later (and aynchronously) be updated with the actual values.
 *  This is an object with following keys:
 *  - label: the computed preferred label
 *  - origin: the origin, which may be 'ID' or AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS
 */
AccountsTools.preferredLabelRV = function( arg, preferred=null ){
    _verbose( AccountsTools.C.Verbose.PREFERREDLABEL, 'pwix:accounts-tools preferredLabelRV() arg='+arg, 'preferred='+preferred );
    let rv = new ReactiveVar( AccountsTools._preferredLabelInitialResult( arg, preferred ));
    AccountsTools.preferredLabel( arg, preferred ).then(( res ) => {
        rv.set( res );
    });
    return rv;
};

/**
 * @summary Update an existing user document
 * @locus Anywhere
 * @param {String|Object} user the user identifier or the user document
 * @param {Object} modifier the values to be set as a Mongo modifier
 * @param {Object} options an optional options
 *  see https://v3-docs.meteor.com/api/collections.html#Mongo-Collection-updateAsync
 * @returns {Promise} which eventually resolves to the result
 */
AccountsTools.update = async function( user, modifier, options ){
    const id = _.isString( user ) ? user : user._id;
    let res = null;
    if( id && _.isString( id )){
        if( Meteor.isClient ){
            res = Meteor.callAsync( 'AccountsTools.update', id, modifier, options );
        } else {
            res = AccountsTools.server.update( id, modifier, options );
        }
    } else {
        throw new Meteor.Error( 'arg', 'incorrect argument' );
    }
    return res;
};
