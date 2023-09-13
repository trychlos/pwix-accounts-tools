/*
 * pwix:accounts-tools/src/common/js/writedata.js
 */

/**
 * @summary Update an existing user document
 * @locus Anywhere
 * @param {String|Object} arg the user identifier or the user document
 * @param {Object} set the values to be set
 * @returns {Object}
 *  - on client side, a Promise which eventually resolves to the result
 *  - on the server, the result as an object:
 *    > label: the computed preferred label
 *    > origin: the origin, which may be 'ID' or AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS
 */
AccountsTools.writeData = function( arg, set ){
    //return Meteor.isClient ? Meteor.callPromise( 'AccountsTools.writeData', userId, name, value ) : Promise.resolve( Meteor.users.find({ _id: id }));
    const id = _.isString( arg ) ? arg : arg._id;
    let res = null;
    if( id && _.isString( id )){
        if( Meteor.isClient ){
            res = Meteor.callPromise( 'AccountsTools.writeData', id, set );
        } else {
            res = AccountsTools.server.writeData( id, set );
        }
    } else {
        throw new Meteor.Error( 'arg', 'incorrect argument' );
    }
    return res;
};
