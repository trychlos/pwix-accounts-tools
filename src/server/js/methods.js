/*
 * pwix:accounts-tools/src/server/js/methods.js
 */

Meteor.methods({
    // find a user by one of his/her email addresses
    async 'AccountsTools.byEmail'( email, options={} ){
        return AccountsTools.server.byEmail( email, options );
    },

    // find a user by his internal (mongo) identifier
    async 'AccountsTools.byId'( id ){
        return AccountsTools.server.byId( id );
    },

    // find a user by his/her username
    async 'AccountsTools.byUsername'( username, options={} ){
        return AccountsTools.server.byUsername( username, options );
    },

    // update the named field of the user data
    async 'AccountsTools.update'( id, modifier, options ){
        return AccountsTools.server.update( id, modifier, options );
    }
});
