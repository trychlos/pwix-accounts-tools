/*
 * pwix:accounts-tools/src/common/js/private.js
 */

import _ from 'lodash';

/*
 * @summary test if the email address is said verified in this user document
 * @locus Anywhere
 * @param {String} email
 * @param {Object} user
 * @returns: true|false
 */
AccountsTools._isEmailVerified = function( email, user ){
    check( email, String );
    check( user, Object );
    let verified = false;
    let found = false;
    user.emails.every(( o ) => {
        if( o.address === email ){
            found = true;
            verified = o.verified;
        }
        return !found;
    });
    return verified;
};

/*
 * @summary returns the preferred label for the user
 * @locus Anywhere
 * @param {Object} user the user document got from the database
 * @param {String} preferred an optional preference, either AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS,
 *  defaulting to the configured value.
 * @param {Object} the result object to be updated
 * @returns: {Object}
 */
AccountsTools._preferredLabelByDoc = function( user, preferred, result ){
    check( user, Object );
    check( result, Object );
    if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.PREFERREDLABEL ){
        console.log( 'pwix:accounts-tools preferredLabelByDoc() user=', user, 'preferred='+preferred, 'result=', result );
    }
    // make reasonably sure we have a user document
    if( user && _.isObject( user ) && user._id && _.isString( user._id )){
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
};

/*
 * @summary Returns the preferred label for the user
 * @locus Anywhere
 * @param {String} arg the user identifier
 * @param {String} preferred the optional caller preference, may be null
 * @param {Object} the result object
 * @returns {Promise} which eventually resolves to the result object
 */
AccountsTools._preferredLabelById = async function( id, preferred, result ){
    check( id, String );
    check( result, Object );
    if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.PREFERREDLABEL ){
        console.log( 'pwix:accounts-tools preferredLabelById() id='+id, 'preferred='+preferred, 'result=', result );
    }
    //console.debug( id );
    return AccountsTools._userDocById( id )
        .then(( user ) => { return Promise.resolve( AccountsTools._preferredLabelByDoc( user, preferred, result )); });
};

/*
 * @summary Returns the preferredLabel initial result, or null
 * @locus Anywhere
 * @returns {Object} the initial result
 */
AccountsTools._preferredLabelInitialResult = function( arg, preferred ){
    if( arg ){
        // if a user identifier is provided
        if( _.isString( arg )){
            return {
                label: arg,
                origin: 'ID'
            };
        }
        if( _.isString( arg._id )){
            return {
                label: arg._id,
                origin: 'ID'
            };
        }
    }
    return null;
};

/*
 * @locus Anywhere
 * @returns {Promise} which resolves to the user document
 */
AccountsTools._userDocById = async function( id ){
    check( id, String );
    return Meteor.isClient ? Meteor.callAsync( 'AccountsTools.byId', id ) : AccountsTools.server.byId( id );
};
