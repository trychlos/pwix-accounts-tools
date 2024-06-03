/*
 * pwix:accounts-tools/src/common/js/update.js
 */

/**
 * @summary Update an existing user document
 * @locus Anywhere
 * @param {String|Object} selector the user identifier or the user document
 * @param {Object} modifier the values to be set as a Mongo modifier
 * @param {Object} options an optional options
 *  see https://v3-docs.meteor.com/api/collections.html#Mongo-Collection-updateAsync
 * @returns {Object}
 *  - on client side, a Promise which eventually resolves to the result
 *  - on the server, the result as an object:
 *    > label: the computed preferred label
 *    > origin: the origin, which may be 'ID' or AccountsTools.C.PreferredLabel.USERNAME or AccountsTools.C.PreferredLabel.EMAIL_ADDRESS
 */
AccountsTools.update = function( selector, modifier, options ){
    //return Meteor.isClient ? Meteor.callPromise( 'AccountsTools.writeData', userId, name, value ) : Promise.resolve( Meteor.users.find({ _id: id }));
    const id = _.isString( selector ) ? selector : selector._id;
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
