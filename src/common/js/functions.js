/*
 * pwix:accounts-tools/src/common/js/functions.js
 */

/**
 * @locus Anywhere
 * @param {Object} user the user record got from the database
 * @param {String} email the email address to be examined
 * @returns {Boolean} whether the (first) email address has been verified
 */
AccountsTools.isEmailVerified = function( user, email ){
    return user ? ( user.emails[0].verified ) : false;
}

/*
 * @locus Anywhere
 * @returns {Object}
 *  - on client side, a Promise which resolves to the specified user document
 *  - on server side, the user document itself
 */
AccountsTools._userDoc = function( id ){
    return Meteor.isClient ? Meteor.callPromise( 'AccountsTools.byId', id ) : AccountsTools.server.byId( id );
};
