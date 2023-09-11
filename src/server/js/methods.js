/*
 * pwix:accounts-ttols/src/server/js/methods.js
 */

// make sure the password, even crypted, is not returned:
// {
//     _id: '55QDvyxocA8XBnyTy',
//     createdAt: 2023-02-08T21:16:56.851Z,
//     services: { password: {}, email: { verificationTokens: [Array] } },
//     username: 'cccc',
//     emails: [ { address: 'cccc@ccc.cc', verified: true } ],
//     isAllowed: true,
//     createdBy: 'EqvmJAhNAZTBAECya',
//     lastConnection: 2023-02-09T13:22:14.057Z,
//     updatedAt: 2023-02-09T13:25:16.114Z,
//     updatedBy: 'EqvmJAhNAZTBAECya'
// }
//
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
    //console.log( user );
    return user;
};

Meteor.methods({
    // find a user by his internal (mongo) identifier
    'pwixAccountsTools.byId'( id ){
        const res = Meteor.users.findOne({ _id: id });
        if( res ){
            //console.log( 'pwixAccountsTools.byId' );
            return _cleanUser( Meteor.users.findOne({ _id: id }));
        }
        console.error( 'pwixAccountsTools.byId', id, 'not found' );
        return res;
    },

    // update the named field of the user data
    'pwixAccountsTools.writeData'( id, name, value ){
        return pwixAccountsTools.server.fn.writeData( id, name, value );
    }
});
