/*
 * pwix:accounts-ttols/src/common/js/functions.js
 */

import { ReactiveVar } from 'meteor/reactive-var';

import { acConf } from '../classes/ac_conf.class.js';

pwixAccountsTools = {
    ...pwixAccountsTools,
    ...{
        /**
         * @locus Anywhere
         * @returns {Promise} which resolves to the specified user account
         */
        identity( id ){
            return Meteor.isClient ? Meteor.callPromise( 'pwixAccountsTools.byId', id ) : Promise.resolve( Meteor.users.find({ _id: id }));
        },

        /**
         * @summary 
         *  either a username or an email address
         *  depending of the fields required in the global conf
         *  of the field availability in the user record
         *  and of the user's preference
         * @locus Anywhere
         * @param {Object} user the user record got the database
         * @param {String} preferred the optional user preference, either AC_USERNAME or AC_EMAIL_ADDRESS,
         *  defaulting to the configured value.
         * @returns: a new ReactiveVar which will eventually contain:
         *  - label: the label to preferentially use when referring to the user
         *  - origin: whether it is a AC_USERNAME or a AC_EMAIL_ADDRESS
         */
        preferredLabel( user, preferred ){
            let mypref = preferred;
            if( !mypref || !acConf.Labels.includes( mypref )){
                mypref = pwixAccountsTools.opts().preferredLabel();
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
         * @locus Anywhere
         * @param {String} id the user identifier
         * @param {String} preferred the optional user preference, either AC_USERNAME or AC_EMAIL_ADDRESS,
         *  defaulting to the configured value.
         * @returns: a new ReactiveVar which will eventually contain:
         *  - label: the label to preferentially use when referring to the user
         *  - origin: whether it is a AC_USERNAME or a AC_EMAIL_ADDRESS
         */
        preferredLabelById( id, preferred ){
            let result = new ReactiveVar({
                label: id,
                origin: 'ID'
            });
            pwixAccountsTools.identity( id )
                .then(( user ) => {
                    if( user ){
                        result.set( pwixAccountsTools.preferredLabel( user, preferred ));
                        return Promise.resolve( true );
                    }
                    console.error( 'id='+id, 'user not found' );
                    return Promise.resolve( false );
                });
            return result;
        }
    }
};
