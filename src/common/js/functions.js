/*
 * pwix:accounts-tools/src/common/js/functions.js
 */

AccountsTools = {
    ...AccountsTools,
    ...{

        /**
         * @locus Anywhere
         * @param {Object} user the user record got from the database
         * @param {String} email the email address to be examined
         * @returns {Boolean} whether the (first) email address has been verified
         */
        isEmailVerified( user, email ){
            return user ? ( user.emails[0].verified ) : false;
        },

        /**
         * @summary Update the user document
         * @locus Anywhere
         * @param {String} userId the user identifier
         * @param {String} name the (maybe dotted) setting name
         * @param {String} value the value to be set
         * @returns {Promise} which will eventually resolve with the operation result
         */
        writeData( userId, name, value ){
            return Meteor.isClient ? Meteor.callPromise( 'AccountsTools.writeData', userId, name, value ) : Promise.resolve( Meteor.users.find({ _id: id }));
        }
    }
};
