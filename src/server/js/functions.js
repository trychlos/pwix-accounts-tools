/*
 * pwix:accounts-tools/src/server/js/functions.js
 */

import _ from 'lodash';

AccountsTools.server = {
    /*
     * Returns the user document
     */
    byId( id ){
        let res = null;
        if( id && _.isString( id )){
            res = AccountsTools.server.cleanUser( Meteor.users.findOne({ _id: id }));
            if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.SERVERDB ){
                console.log( 'pwix:accounts-tools byId('+id+')', res );
            }
        } else {
            // either a code error or a user try to bypass our checks
            throw new Meteor.Error( 'arg', 'incorrect argument' );
        }
        console.debug( 'AccountsTools.server.byId', res );
        return res;
    },

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
    cleanUser( user ){
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
    },

    /**
     * update user document with provided values
     *  do not update updatedAt/updatedBy values as this is considered as pure user settings
     * @throws {Error} when user not found
     */
    writeData( id, set ){
        let res = null;
        if( id && _.isString( id )){
            res = Meteor.users.update({ _id: id }, { $set: set });
            if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.SERVERDB ){
                console.log( 'pwix:accounts-tools writeData('+id+')', res );
            }
        } else {
            // either a code error or a user try to bypass our checks
            throw new Meteor.Error( 'arg', 'incorrect argument' );
        }
        return res;
    }
};
