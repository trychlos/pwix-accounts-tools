/*
 * pwix:accounts/src/common/classes/ac_options_global_conf.class.js
 *
 * This class manages the global configuration options.
 */

import '../js/constants.js';

import { Options } from 'meteor/pwix:options';

export class acOptions extends Options.Base {

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
     * @returns {acOptions}
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
        return this.base_gsStringObjectFn( 'preferredLabel', value, { default: AccountsTools._defaults.conf.preferredLabel, ref: acOptions.Labels });
    }

    /**
     * Getter/Setter
     * @param {Integer|Function} value verbosity level
     * @returns {String}
     */
    verbosity( value ){
        return this.base_gsIntegerFn( 'verbosity', value, { default: AccountsTools._defaults.conf.verbosity, ref: acOptions.Labels });
    }
}
