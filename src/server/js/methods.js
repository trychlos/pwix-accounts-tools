/*
 * pwix:accounts-ttols/src/server/js/methods.js
 */

_cleanUser = function ( user ){
    if( user ){
        if( user.services ){
            delete user.services.resume;
            if( user.services.password ){
                delete user.services.password.bcrypt;
            }
        }
        delete user.profile;
    }
    console.log( user );
    return user;
};

Meteor.methods({
    // find a user by his internal (mongo) identifier
    'pwixAccountsTools.byId'( id ){
        const res = Meteor.users.findOne({ _id: id });
        if( res ){
            console.log( 'pwixAccountsTools.byId' );
            return _cleanUser( Meteor.users.findOne({ _id: id }));
        }
        console.log( 'pwixAccountsTools.byId', id, 'not found' );
        return res;
    }
});
