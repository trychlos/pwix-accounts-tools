/*
 * pwix:accounts-tools/src/common/js/defaults.js
 */

defaults = {
    conf: {
        preferredLabel: AC_EMAIL_ADDRESS
    }
};

pwixAccountsTools.conf = {
    ...pwixAccountsTools.conf,
    ...defaults.conf
};
