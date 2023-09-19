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
 * @returns {Promise} which resolves to the user document
 */
AccountsTools._userDoc = function( id ){
    return Meteor.isClient ? Meteor.callPromise( 'AccountsTools.byId', id ) : Promise.resolve( AccountsTools.server.byId( id ));
};
