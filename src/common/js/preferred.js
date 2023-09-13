/*
 * pwix:accounts-tools/src/common/js/preferred.js
 */

import _ from 'lodash';

/*
 * @locus Anywhere
 * @returns {Object}
 *  - on client side, a Promise which resolves to the specified user document
 *  - on server side, the user document itself
 */
AccountsTools._userDoc = function( id ){
    return Meteor.isClient ? Meteor.callPromise( 'AccountsTools.byId', id ) : AccountsTools.server.byId( id );
};

/*
 * @summary Returns the preferred label for the user
 * @locus Anywhere
 * @param {String} arg the user identifier
 * @param {String} preferred the optional caller preference
 * @param {Object} the result object
 */
AccountsTools._preferredLabelById = function( id, preferred, result ){
    if( Meteor.isClient ){
        return AccountsTools._userDoc( id )
            .then(( user ) => {
                if( user ){
                    return AccountsTools._preferredLabelByDoc( user, preferred );
                }
                console.error( 'id='+id, 'user not found' );
                return result;
            });
    } else {
        const user = AccountsTools._userDoc( id );
        return user ? AccountsTools._preferredLabelByDoc( user, preferred ) : result;
    }
};

/*
 * @summary returns the preferred label for the user
 * @locus Anywhere
 * @param {Object} user the user document got from the database
 * @param {String} preferred an optional preference, either AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS,
 *  defaulting to the configured value.
 * @returns: an object:
 *  - label: the label to preferentially use when referring to the user
 *  - origin: whether it was a AccountsTools.C.PreferredLabel.USERNAME or a AccountsTools.C.PreferredLabel.EMAIL_ADDRESS
 */
AccountsTools._preferredLabelByDoc = function( user, preferred, result ){
    let mypref = preferred;
    if( !mypref || !Object.keys( AccountsTools.C.PreferredLabel ).includes( mypref )){
        mypref = AccountsTools.opts().preferredLabel();
    }

    if( mypref === AccountsTools.C.PreferredLabel.USERNAME && user.username ){
        result = { label: user.username, origin: AccountsTools.C.PreferredLabel.USERNAME };

    } else if( mypref === AccountsTools.C.PreferredLabel.EMAIL_ADDRESS && user.emails[0].address ){
        result = { label: user.emails[0].address, origin: AccountsTools.C.PreferredLabel.EMAIL_ADDRESS };

    } else if( user.username ){
        console.log( 'fallback to username while preferred is', mypref );
        result = { label: user.username, origin: AccountsTools.C.PreferredLabel.USERNAME };

    } else if( user.emails[0].address ){
        console.log( 'fallback to email address name while preferred is', mypref );
        const words = user.emails[0].address.split( '@' );
        result = { label: words[0], origin: AccountsTools.C.PreferredLabel.EMAIL_ADDRESS };
    }
    //console.log( 'mypref='+mypref, 'id='+user._id, 'result', result );
    return result;
};

/**
 * @summary Returns the preferred label for the user
 * @locus Anywhere
 * @param {String|Object} arg the user identifier or the user document
 * @param {String} preferred the optional caller preference, either AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS,
 *  defaulting to the configured value
 * @returns {Object}
 *  - on client side, a Promise which eventually resolves to the result
 *  - on the server, the result as an object:
 *    > label: the computed preferred label
 *    > origin: the origin, which may be 'ID' or AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS
 */
AccountsTools.preferredLabel = function( arg, preferred=null ){
    const id = _.isString( arg ) ? arg : arg._id;
    let result = {
        label: id,
        origin: 'ID'
    };
    const fn = _.isString( arg ) ? 'ById' : 'ByDoc';
    return AccountsTools['_preferredLabel'+fn]( arg, preferred || AccountsTools.opts().preferredLabel(), result );
};
