Package.describe({
    name: 'pwix:accounts-tools',
    version: '2.3.0',
    summary: 'Accounts management tools',
    git: 'https://github.com/trychlos/pwix-accounts-tools',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'AccountsTools'
    ]);
    api.mainModule( 'src/client/js/index.js', 'client' );
    api.mainModule( 'src/server/js/index.js', 'server' );
});

Package.onTest( function( api ){
    configure( api );
    api.use( 'tinytest' );
    api.use( 'pwix:accounts-tools' );
    api.mainModule( 'test/js/index.js' );
});

function configure( api ){
    api.versionsFrom([ '2.9.0', '3.0-rc.0' ]);
    api.use( 'accounts-base' );
    api.use( 'check' );
    api.use( 'ecmascript' );
    api.use( 'mongo' );
    api.use( 'pwix:accounts-conf@1.0.0-rc' );
    api.use( 'pwix:i18n@1.5.0' );
    api.use( 'reactive-var' );
    api.use( 'tmeasday:check-npm-versions@1.0.2 || 2.0.0-beta.0', 'server' );
}

// NPM dependencies are checked in /src/server/js/check_npms.js
// See also https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies
