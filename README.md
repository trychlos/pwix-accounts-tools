# pwix:accounts-tools - README

## What is it ?

Some functions and tools gathered here to help the accounts management.

_Note_: at the moment, we focus on the `users` collection as created by `accounts-passwd` package.

## Usage

Just add the package to your application, and enjoy!

```
    meteor add pwix:accounts-tools
```

## Configuring

The package's behavior can be configured through a call to the `AccountsTools.configure()` method, with just a single javascript object argument, which itself should only contains the options you want override.

Known configuration options are:

- `preferredLabel`

    When not explicitely specified, which label choose to qualify a user account? Following values are accepted:

    - `AccountsTools.C.PreferredLabel.USERNAME`
    - `AccountsTools.C.PreferredLabel.EMAIL_ADDRESS`

    A function can be provided by the application for this parm. The function will be called without argument and must return one of the accepted values.

    Defaults to `AccountsTools.C.preferredLabel.EMAIL_ADDRESS`, though the actually displayed label heavily depends of the runtime configuration as we try to always display something.

- `verbosity`

    The verbosity level as:
    
    - `AccountsTools.C.Verbose.NONE`
    
    or an OR-ed value of integer constants:

    - `AccountsTools.C.Verbose.CONFIGURE`

    A function can be provided by the application for this parm. The function will be called without argument and MUST return a suitable value.

    - `AccountsTools.C.Verbose.PREFERREDLABEL`

    Trace the `AccountsTools.preferredLabel()` operations and fallbacks.

    - `AccountsTools.C.Verbose.SERVERDB`

    Trace results from server accesses to the database.

    Defaults to `AccountsTools.C.Verbose.NONE`.

Please note that `AccountsTools.configure()` method should be called in the same terms both in client and server sides.

Remind too that Meteor packages are instanciated at application level. They are so only configurable once, or, in other words, only one instance has to be or can be configured. Addtionnal calls to `AccountsTools.configure()` will just override the previous one. You have been warned: **only the application should configure a package**.

## What does it provide ?

### `AccountsTools`

The globally exported object.

### Methods

#### `AccountsTools.configure( o )`

The configuration of the package.

See [Configuring](#configuring).

#### `AccountsTools.isEmailVerified( email [, user] )`

As its name says.

If the user document is provided, then returns a `Boolean` `true`|`false`.

Else, retuns a Promise which will resolve to this same `Boolean` `true`|`false`.

Please note that we do not search the `users` collection if a user document is provided. In this case, the result will be `false` if the user document is not the right one for this email address.

#### `AccountsTools.opts()`

A getter which returns the current options.

#### `AccountsTools.preferredLabel( id|user [, preferred] )`

The function returns:
- either a `Promise` which eventually will resolve to the result object, if the method is called with a user identifier `id` (which must be the Mongo `user._id`),
- or the result `Object` itself, if the method is called with a user document `user`.

The result object has following keys:
- `label`: the computed preferred label
- `origin`: the origin, which may be `ID` if the account has not been found, or `AccountsTools.C.PreferredLabel.USERNAME` or `AccountsTools.C.PreferredLabel.EMAIL_ADDRESS`.

On server side, the function returns an alrealdy resolved Promise (rationale: have a common prototype on client and server sides).

The application may have ask for either a username or an email address, or both.
When time comes to display an identification string to the user, we need to choose between the username and the email address (if both apply), depending of the preference of the caller.

The caller preference is optional, may be one the following values:

- `AccountsTools.C.PreferredLabel.USERNAME`
- `AccountsTools.C.PreferredLabel.EMAIL_ADDRESS`

Default is the configured value.

#### `AccountsTools.preferredLabelRV( id|user [, preferred] )`

The same method that above `AccountsTools.preferredLabel()`, but returns a `ReactiveVar` with the value of the result, or which will be set to the value of the result when the Promise will be resolved.

#### `AccountsTools.writeData( id|user, set )`

Update (do not create) a user document with the provided set.

The function returns:

- on the client, a Promise which eventually resolves to the result

- on the server, the result Metoer.update() method.

### Constants

#### When choosing the preferred label

- `AccountsTools.C.PreferredLabel.USERNAME`
- `AccountsTools.C.PreferredLabel.EMAIL_ADDRESS`

#### Verbosity level

- `AccountsTools.C.Verbose.NONE`
- `AccountsTools.C.Verbose.CONFIGURE`
- `AccountsTools.C.Verbose.SERVERDB`
- `AccountsTools.C.Verbose.PREFERREDLABEL`

## NPM peer dependencies

In accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies), we do not hardcode NPM dependencies in `package.js`. Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.0.0:
```
    'lodash': '^4.17.0'
```
Each of these dependencies should be installed at application level:
```
    meteor npm install <package> --save
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-accounts-tools/pulls).

---
P. Wieser
- Last updated on 2023, Oct. 11th
