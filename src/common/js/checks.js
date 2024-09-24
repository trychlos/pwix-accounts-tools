/*
 * pwix:accounts-ui/src/common/js/checks.js
 */

import _ from 'lodash';
import emailValidator from 'email-validator';
import zxcvbn from 'zxcvbn';

import { AccountsConf } from 'meteor/pwix:accounts-conf';
import { pwixI18n } from 'meteor/pwix:i18n';

AccountsTools = {
    ...AccountsTools,
    ...{
        //
        // Rationale: we need as usual check functions both on client and on server side.
        //  Both server and client sides use asynchronous code
        //

        /*
         * @summary: check that the proposed candidate email address is valid, and not already exists
         *  Run in the standard meteor 'users' accounts collection
         */
        async _checkEmailAddress( email, opts={} ){
            let result = {
                ok: true,
                reason: undefined,
                errors: [],
                countOk: 0,
                countNotOk: 0,
                canonical: ( email ? email.trim() : '' ).toLowerCase()
            };
            // check if the email address is set
            const _checkSet = async function(){
                if( opts.testEmpty !== false ){
                    if( result.canonical ){
                        result.countOk += 1;
                    } else {
                        result.ok = false;
                        result.reason = 'email_empty';
                        result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason ));
                        result.countNotOk += 1;
                    }
                }
            };
            await _checkSet();
            if( !result.ok ){
                return result;
            }
            // check for an email valid syntax
            const _checkSyntax = async function(){
                if( opts.testValid !== false ){
                    if( emailValidator.validate( result.canonical )){
                        result.countOk += 1;
                    } else {
                        result.ok = false;
                        result.reason = 'email_invalid';
                        result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason ));
                        result.countNotOk += 1;
                    }
                }
            };
            await _checkSyntax();
            if( !result.ok ){
                return result;
            }
            // check if the email address already exists
            const _checkExists = async function(){
                if( opts.testExists !== false ){
                    if( Meteor.isClient ){
                        return Meteor.callAsync( 'AccountsTools.byEmail', result.canonical )
                            .then(( res ) => {
                                return Boolean( res );
                            });
                    }
                    // server side
                    return AccountsTools.server.byEmail( result.canonical ).then(( res ) => {
                        return Boolean( res );
                    });
                }
            };
            if( await _checkExists()){
                result.ok = false;
                result.reason = 'email_exists';
                result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason ));
                result.countNotOk += 1;
            } else {
                result.countOk += 1;
            }
            return result;
        },

        /**
         * @summary: check that the proposed candidate email address is valid, and not already exists
         * @locus Anywhere
         * @param {String} email the email address to be checked
         * @param {Object} opts:
         *  - testSyntax: true|false, defaulting to true (test the syntax, returning an error if empty or bad syntax)
         *  - testExistance: true|false, defaulting to true (test the existance, positionning the flag in result object)
         * @returns {Promise} which resolves to the check result, as:
         *  - ok: true|false
         *  - reason: if not ok, the first reason
         *  - errors: an array of localized error messages
         *  - canonical: trimmed lowercase email address
         */
        async checkEmailAddress( email, opts={} ){
            return this._checkEmailAddress( email, opts );
        },

        /*
         * @summary: check that the proposed candidate password is valid
         */
        async _checkPassword( password, opts={} ){
            let result = {
                ok: true,
                reason: undefined,
                errors: [],
                countOk: 0,
                countNotOk: 0,
                minScore: -1,
                zxcvbn: null,
                canonical: password || ''
            };
            // first compute min score function of required complexity
            result.minScore = AccountsTools._computeMinScore();
            result.zxcvbn = zxcvbn( result.canonical );
            // check if the email address is set
            const _checkSet = async function(){
                if( opts.testEmpty !== false ){
                    if( result.canonical ){
                        result.countOk += 1;
                    } else {
                        result.ok = false;
                        result.reason = 'password_empty';
                        result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason ));
                        result.countNotOk += 1;
                    }
                }
            };
            await _checkSet();
            if( !result.ok ){
                return result;
            }
            // check for minimal length
            const _checkLength = async function(){
                if( opts.testLength !== false ){
                    const minLength = AccountsUI.opts().passwordLength();
                    if( result.canonical.length < minLength ){
                        result.ok = false;
                        result.reason = 'password_short';
                        result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason, minLength ));
                        result.countNotOk += 1;
                    } else {
                        result.countOk += 1;
                    }
                }
            };
            await _checkLength();
            if( !result.ok ){
                return result;
            }
            // check for complexity
            const _checkComplexity = async function(){
                if( opts.testComplexity !== false ){
                    if( result.zxcvbn.score < result.minScore ){
                        result.ok = false;
                        result.reason = 'password_weak';
                        result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason, result.zxcvbn.score, result.minScore ));
                        result.countNotOk += 1;
                    } else {
                        result.countOk += 1;
                    }
                }
            };
            await _checkComplexity();
            return result;
        },

        // let the configured password strength be converted into a zxcvbn score
        _scores: [
            AccountsUI.C.Password.VERYWEAK,
            AccountsUI.C.Password.WEAK,
            AccountsUI.C.Password.MEDIUM,
            AccountsUI.C.Password.STRONG,
            AccountsUI.C.Password.VERYSTRONG
        ],
        _computeMinScore(){
            const strength = AccountsUI.opts().passwordStrength();
            let minScore = -1;
            for( let i=0 ; i<this._scores.length && minScore === -1 ; ++i ){
                if( this._scores[i] === strength ){
                    minScore = i;
                }
            }
            return minScore;
        },

        /**
         * @summary: check that the proposed candidate password is valid
         * @locus Anywhere
         * @param {String} password the password to be checked
         * @param {Object} opts:
         *  - testLength: true|false, defaulting to true (test the length vs the globally configured option)
         *  - testComplexity: true|false, defaulting to true (test the complexity)
         * @returns {Object} the check result, as:
         *  - ok: true|false
         *  - reason: if not ok, the first reason
         *  - errors: an array of localized error messages
         *  - minScore: the minimal computed score depending of the required strength
         *  - zxcvbn: the zxcvbn computed result
         *  - canonical: the checked password
         */
        checkPassword( password, opts={} ){
            return this._checkPassword( password, opts );
        },

        /*
         * @summary: check that the proposed candidate username is valid, and not already exists
         */
        async _checkUsername( username, opts={} ){
            let result = {
                ok: true,
                reason: undefined,
                errors: [],
                countOk: 0,
                countNotOk: 0,
                canonical: username ? username.trim() : ''
            };
            // check if the username is set
            const _checkSet = async function(){
                if( opts.testEmpty !== false ){
                    if( result.canonical ){
                        result.countOk += 1;
                    } else {
                        result.ok = false;
                        result.reason = 'username_empty';
                        result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason ));
                        result.countNotOk += 1;
                    }
                }
            };
            await _checkSet();
            if( !result.ok ){
                return result;
            }
            // check for minimal length
            const _checkLength = async function(){
                if( opts.testLength !== false ){
                    const minLength = AccountsUI.opts().usernameLength();
                    if( result.canonical.length < minLength ){
                        result.ok = false;
                        result.reason = 'username_short';
                        result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason, minLength ));
                        result.countNotOk += 1;
                    } else {
                        result.countOk += 1;
                    }
                }
            };
            await _checkLength();
            if( !result.ok ){
                return result;
            }
            // check if the username already exists
            const _checkExists = async function(){
                if( opts.testExists !== false ){
                    if( Meteor.isClient ){
                        return Meteor.callAsync( 'AccountsTools.byUsername', result.canonical )
                            .then(( res ) => {
                                return Boolean( res );
                            });
                    }
                    // server side
                    return AccountsTools.server.byUsername( result.canonical ).then(( res ) => {
                        return Boolean( res );
                    });
                }
            };
            if( await _checkExists()){
                result.ok = false;
                result.reason = 'username_exists';
                result.errors.push( pwixI18n.label( I18N, 'checks.'+result.reason ));
                result.countNotOk += 1;
            } else {
                result.countOk += 1;
            }
        },

        /**
         * @summary: check that the proposed candidate username is valid, and not already exists
         * @locus Anywhere
         * @param {String} username the username to be checked
         * @param {Object} an option object with:
         *  - testLength: true|false, defaulting to true (test the length vs the globally configured option)
         *  - testExists: true|false, defaulting to true (test the existance, positionning the flag in result object)
         * @returns {Promise} which resolves to the check result, as:
         *  - ok: true|false
         *  - errors: [] an array of localized error messages
         *  - warnings: [] an array of localized warning messages
         *  - username: trimmed username
         */
        async checkUsername( username, opts={} ){
            return this._checkUsername( username, opts );
        }
    }
};
