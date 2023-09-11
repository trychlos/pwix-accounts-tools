/*
 * pwix:accounts/src/common/classes/ac_options_global_conf.class.js
 *
 * This class manages the global configuration options.
 */

import '../js/constants.js';

import { Options } from 'meteor/pwix:options';

export class acConf extends Options.BaseOpt {

    // static data
    //

    // possible user label
    static Labels = [
        AccountsTools.C.PreferredLabel.USERNAME,
        AccountsTools.C.PreferredLabel.EMAIL_ADDRESS
    ];

    // private data
    //

    // private functions
    //

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @param {Object} options the options to be managed
     * 
     * The Options base class takes care of managing the known options, either as a value, or as a function which return a value.
     * In some case where the expected value is a string, the base class also can accept an object with 'i18n' key.
     * All options are accepted as long as the corresponding getter/setter method exists in this derived class.
     * 
     * @returns {acConf}
     */
    constructor( options ){
        super( options );
        return this;
    }

    /**
     * Getter/Setter
     * @param {String|Function} value preferred label when displaying a user
     * @returns {String}
     */
    preferredLabel( value ){
        return this.baseOpt_gsStringObjectFn( 'preferredLabel', value, { default: AccountsTools._defaults.conf.preferredLabel, ref: acConf.Labels });
    }
}
