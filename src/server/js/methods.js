/*
 * pwix:accounts-tools/src/server/js/methods.js
 */

Meteor.methods({
    // find a user by one of his/her email addresses
    async 'AccountsTools.byEmail'( email ){
        return AccountsTools.server.byEmail( email );
    },

    // find a user by his internal (mongo) identifier
    async 'AccountsTools.byId'( id ){
        return AccountsTools.server.byId( id );
    },

    // update the named field of the user data
    async 'AccountsTools.writeData'( id, set ){
        return AccountsTools.server.writeData( id, set );
    }
});
