/*
 * pwix:accounts-tools/src/server/js/functions.js
 */

import _ from 'lodash';

import { Accounts } from 'meteor/accounts-base';

AccountsTools.server = {
    /*
     * @param {String} the searched email address
     * @returns {Promise} which eventually resolves to the user document, or null
     * 
     *  As a reminder, see https://v3-docs.meteor.com/api/accounts.html#Meteor-users
     *                 and https://v3-docs.meteor.com/api/accounts.html#passwords
     *  Each email address can only belong to one user
     *  In other words, an email address can be considered as a user identiier in Meteor ecosystems
     */
    async byEmail( email ){
        check( email, String );
        if( email && _.isString( email )){
            return Meteor.users.findOneAsync({ 'emails.address': email })
                .then(( doc ) => {
                    doc = AccountsTools.cleanupUserDocument( doc );
                    if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.SERVERDB ){
                        console.log( 'pwix:accounts-tools byEmail('+email+')', doc );
                    }
                    return doc;
                });
        } else {
            // either a code error or a user try to bypass our checks
            throw new Meteor.Error( 'arg', 'incorrect argument' );
        }
    },

    /*
     * @param {String} the user identifier
     * @returns {Promise} which eventually resolves to the user document
     */
    async byId( id ){
        check( id, String );
        if( id && _.isString( id )){
            return Meteor.users.findOneAsync({ _id: id })
                .then(( doc ) => {
                    doc = AccountsTools.cleanupUserDocument( doc );
                    if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.SERVERDB ){
                        console.log( 'pwix:accounts-tools byId('+id+')', doc );
                    }
                    return doc;
                });
        } else {
            // either a code error or a user try to bypass our checks
            throw new Meteor.Error( 'arg', 'incorrect argument' );
        }
    },

    /**
     * update user document with provided values
     *  do not update updatedAt/updatedBy values as this is considered as pure user settings
     * @throws {Error} when user not found
     */
    async writeData( id, set ){
        check( id, String );
        check( set, Object );
        if( id && _.isString( id )){
            return Meteor.users.updateAsync({ _id: id }, { $set: set })
                .then(( res ) => {
                    if( AccountsTools.opts().verbosity() & AccountsTools.C.Verbose.SERVERDB ){
                        console.log( 'pwix:accounts-tools writeData('+id+')', res );
                    }
                    return res;
                });
        } else {
            // either a code error or a user try to bypass our checks
            throw new Meteor.Error( 'arg', 'incorrect argument' );
        }
    }
};
