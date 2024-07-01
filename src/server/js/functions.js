/*
 * pwix:accounts-tools/src/server/js/functions.js
 */

import _ from 'lodash';

import { Accounts } from 'meteor/accounts-base';

AccountsTools.server = {
    /*
     * @param {String} the searched email address
     * @param {Object} options an optional dictionary of fields to return or exclude
     * @returns {Promise} which eventually resolves to the user document, or null
     *
     *  As a reminder, see https://v3-docs.meteor.com/api/accounts.html#Meteor-users
     *                 and https://v3-docs.meteor.com/api/accounts.html#passwords
     *                 and https://v3-docs.meteor.com/api/accounts.html#Accounts-findUserByEmail
     *  Each email address can only belong to one user
     *  In other words, an email address can be considered as a user identiier in Meteor ecosystems
     */
    async byEmail( email, options={} ){
        check( email, String );
        check( options, Object );
        if( email && _.isString( email )){
            return Accounts.findUserByEmail( email, options )
                .then(( doc ) => {
                    doc = AccountsTools.cleanupUserDocument( doc );
                    _verbose( AccountsTools.C.Verbose.SERVERDB, 'pwix:accounts-tools byEmail('+email+')', doc );
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
                    _verbose( AccountsTools.C.Verbose.SERVERDB, 'pwix:accounts-tools byId('+id+')', doc );
                    return doc;
                });
        } else {
            // either a code error or a user try to bypass our checks
            throw new Meteor.Error( 'arg', 'incorrect argument' );
        }
    },

    /*
     * @param {String} the searched username
     * @param {Object} options an optional dictionary of fields to return or exclude
     * @returns {Promise} which eventually resolves to the user document, or null
     *
     *  As a reminder, see https://v3-docs.meteor.com/api/accounts.html#Accounts-findUserByUsername
     *  Each username can only belong to one user
     *  In other words, a username can be considered as a user identiier in Meteor ecosystems
     */
    async byUsername( username, options={} ){
        check( username, String );
        check( options, Object );
        if( username && _.isString( username )){
            return Accounts.findUserByUsername( username, options )
                .then(( doc ) => {
                    doc = AccountsTools.cleanupUserDocument( doc );
                    _verbose( AccountsTools.C.Verbose.SERVERDB, 'pwix:accounts-tools byUsername('+username+')', doc );
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
    async update( id, modifier, options ){
        check( id, String );
        check( modifier, Object );
        if( id && _.isString( id )){
            return Meteor.users.updateAsync({ _id: id }, modifier, options )
                .then(( res ) => {
                    _verbose( AccountsTools.C.Verbose.SERVERDB, 'pwix:accounts-tools writeData('+id+')', res );
                    return res;
                });
        } else {
            // either a code error or a user try to bypass our checks
            throw new Meteor.Error( 'arg', 'incorrect argument' );
        }
    }
};
