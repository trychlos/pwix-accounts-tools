/*
 * pwix:accounts-tools/src/server/js/check_npms.js
 */

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

if( false ){
}

checkNpmVersions({
    'email-validator': '^2.0.4',
    'lodash': '^4.17.0',
    'zxcvbn': '^4.4.2'
},
    'pwix:accounts-tools'
);
