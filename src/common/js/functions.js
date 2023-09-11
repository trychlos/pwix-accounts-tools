/*
 * pwix:accounts-ttols/src/common/js/functions.js
 */

import { ReactiveVar } from 'meteor/reactive-var';

import { acConf } from '../classes/ac_conf.class.js';

AccountsTools = {
    ...AccountsTools,
    ...{
        /**
         * @locus Anywhere
         * @returns {Promise} which resolves to the specified user account
         */
        identity( id ){
            return Meteor.isClient ? Meteor.callPromise( 'AccountsTools.byId', id ) : Promise.resolve( Meteor.users.find({ _id: id }));
        },

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
         * @locus Anywhere
         * @param {String} id the user identifier
         * @param {String} preferred the optional user preference, either AC_USERNAME or AC_EMAIL_ADDRESS,
         *  defaulting to the configured value.
         * @returns {ReactiveVar} a new ReactiveVar which will eventually contain:
         *  - label: the label to preferentially use when referring to the user
         *  - origin: whether it is a AC_USERNAME or a AC_EMAIL_ADDRESS
         */
        preferredLabelById( id, preferred ){
            let result = new ReactiveVar({
                label: id,
                origin: 'ID'
            });
            AccountsTools.identity( id )
                .then(( user ) => {
                    if( user ){
                        result.set( AccountsTools.preferredLabelByDoc( user, preferred ));
                        return Promise.resolve( true );
                    }
                    console.error( 'id='+id, 'user not found' );
                    return Promise.resolve( false );
                });
            return result;
        },

        /**
         * @summary returns either a username or an email address
         *  depending of the fields required in the global configuration, of the field availability in the user provided document and of the specified preference
         * @locus Anywhere
         * @param {Object} user the user document got from the database
         * @param {String} preferred an optional preference, either AC_USERNAME or AC_EMAIL_ADDRESS,
         *  defaulting to the configured value.
         * @returns: an object:
         *  - label: the label to preferentially use when referring to the user
         *  - origin: whether it was a AC_USERNAME or a AC_EMAIL_ADDRESS
         */
        preferredLabelByDoc( user, preferred ){
            let mypref = preferred;
            if( !mypref || !acConf.Labels.includes( mypref )){
                mypref = AccountsTools.opts().preferredLabel();
            }
            let result = { label: user._id, origin: 'ID' };

            if( mypref === AC_USERNAME && user.username ){
                result = { label: user.username, origin: AC_USERNAME };

            } else if( mypref === AC_EMAIL_ADDRESS && user.emails[0].address ){
                result = { label: user.emails[0].address, origin: AC_EMAIL_ADDRESS };

            } else if( user.emails[0].address ){
                console.log( 'fallback to email address while preferred is', mypref );
                const words = user.emails[0].address.split( '@' );
                result = { label: words[0], origin: AC_EMAIL_ADDRESS };

            } else if( user.username ){
                console.log( 'fallback to username while preferred is', mypref );
                result = { label: user.username, origin: AC_USERNAME };
            }
            //console.log( 'mypref='+mypref, 'id='+user._id, 'result', result );
            return result;
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
