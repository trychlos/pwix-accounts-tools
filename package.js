Package.describe({
    name: 'pwix:accounts-tools',
    version: '1.0.0-rc',
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
    api.versionsFrom( '2.9.0' );
    api.use( 'deanius:promise' );
    api.use( 'ecmascript' );
    api.use( 'mongo' );
    api.use( 'pwix:options@2.1.0' );
    api.use( 'reactive-var' );
    api.use( 'tmeasday:check-npm-versions@1.0.2', 'server' );
}

// NPM dependencies are checked in /src/server/js/check_npms.js
// See also https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies
