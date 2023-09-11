/*
 * pwix:accounts-tools/src/server/js/check_npms.js
 */

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

if( false ){
}

checkNpmVersions({
    'lodash': '^4.17.0'
},
    'pwix:accounts-tools'
);
