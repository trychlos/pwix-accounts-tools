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

    A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.

    Defaults to `AccountsTools.C.preferredLabel.EMAIL_ADDRESS`, though the actually displayed label heavily depends of the runtime configuration as we try to always display something.

- `verbosity`

    The verbosity level as:
    
    - `AccountsTools.C.Verbose.NONE`
    
    or an OR-ed value of integer constants:

    - `AccountsTools.C.Verbose.CONFIGURE`

    A function can be provided by the application for this parm. The function will be called without argument and MUST return a suitable value.
    
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

#### `AccountsTools.opts()`

A getter which returns the current options.

### Constants

#### When choosing the preferred label

- `AccountsTools.C.PreferredLabel.USERNAME`
- `AccountsTools.C.PreferredLabel.EMAIL_ADDRESS`

#### Verbosity level

- `AccountsTools.C.Verbose.NONE`
- `AccountsTools.C.Verbose.CONFIGURE`

### Blaze components

#### prView

#### prEdit

### Roles configuration

Roles have to be declared as an object with a top single key 'roles'
```
    {
        roles: {                                        mandatory topmost key of the configuration object
            hierarchy: [                                description of the hierarchy as an array of role objects
                {
                    name: <name1>,                      a role object must have a name which uniquely identifies the role
                    children: [                         a role object may have zero to many children, each of them being itself a role object
                        {
                            name: <name2>,
                            children: [                 there is no limit to the count of recursivity levels of the children
                                {
                                    ...
                                }
                            ]
                        }

                    ]
                },
                {
                    name: <name>,
                    children: [

                    ]
                },
                {
                    ...
                }
            ],
            aliases: [                                  one can define aliases, i.e. distinct names which are to be considered as same roles
                [ <name1>, <name2>, ... ],
                [ ... ]
            ]
        }
    }
```

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
- Last updated on 2023, Feb. 2nd
