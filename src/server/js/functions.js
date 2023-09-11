/*
 * pwix:accounts-tools/src/server/js/functions.js
 */

pwixAccountsTools.server.fn = {

    /*
     * update user document
     *  do not update updatedAt/updatedBy values as this is considered as pure user settings
     * @throws {Error} when user not found
     */
    writeData( id, name, value ){
        let object = {};
        object[name] = value;
        const res = Meteor.users.update( id, { $set: object });
        console.log( 'name='+name, 'value='+value, 'object', object, 'res', res );
        return res;
    }
};
