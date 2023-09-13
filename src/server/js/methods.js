/*
 * pwix:accounts-tools/src/server/js/methods.js
 */

Meteor.methods({
    // find a user by his internal (mongo) identifier
    'AccountsTools.byId'( id ){
        return AccountsTools.server.byId( id );
    },

    // update the named field of the user data
    'AccountsTools.writeData'( id, set ){
        return AccountsTools.server.writeData( id, set );
    }
});
