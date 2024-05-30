/*
 * pwix:accounts-tools/src/server/js/publish.js
 */

/**
 * @summary a publication to feed all available email addresses, or all available users
 * @param {String} mode whether to publish a single row per email address, or a single row per user
 *  defaulting to a single row per email address (`AccountsTools.C.EmailsPublication.PER_EMAIL`)
 * @param {Object} options an optional dictionary of fields to return or exclude
 * @returns objects { _id, email, verified }
 *  Note that the '_id' is the user identifier, so may not be unique when listing all email addresses
 */
Meteor.publish( 'AccountsTools.emails', function( mode=AccountsTools.C.EmailsPublication.PER_EMAIL, options={} ){
    const self = this;
    const collectionName = 'users';
    const query = { selector:{}, options:{}};
    //console.log( query );

    function f_setFields( doc ){
        let result = [];
        // if we want a single row per user
        if( mode === AccountsTools.C.EmailsPublication.PER_USER ){
            result.push({
                _id: doc._id,
                email: doc.emails[0].address,
                verified: doc.emails[0].verified
            });
        // or if we want a single row per email address (which is the default)
        } else {
            doc.emails.every(( o ) => {
                result.push({
                    _id: doc._id,
                    email: o.address,
                    verified: o.verified
                });
                return true;
            });
        }
        return result;
    }

    const observer = Meteor.users.find( query.selector, query.options ).observe({
        added: function( doc){
            f_setFields( doc ).every(( o ) => {
                self.added( collectionName, doc._id, o );
                return true;
            });
        },
        changed: function( newDoc, oldDoc ){
            f_setFields( newDoc ).every(( o ) => {
                self.changed( collectionName, newDoc._id, o );
                return true;
            });
        },
        removed: function( oldDoc ){
            self.removed( collectionName, oldDoc._id );
        }
    });

    self.onStop( function(){
        observer.stop();
    });

    self.ready();
});
