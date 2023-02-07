# pwix:accounts-tools - README

## What is it ?

Some functions and tools gathered here to help the accounts management.

_Note_: at the moment, we focus on the `users` collection as created by `accounts-passwd` package.

## Usage

Just add the package to your application, and enjoy!

```
    meteor add pwix:accounts-tools
```

## Configuration

The package MUST be configured before Meteor.startup(), so at the top of the application code.
The configuration MUST be done in identical terms **both** in client and in server sides.

Parameters are:

<table>
<tr><td style="vertical-align:top;">
preferredLabel
</td><td>
How to preferentially refer to a user when both options are available:
<ul>
<li>AC_USERNAME</li>
<li>AC_EMAIL_ADDRESS</li>
 </ul>
A function can be provided by the application for this parm. The function will be called without argument and MUST return one of the accepted values.<br />
Default value is AC_EMAIL_ADDRESS, though the actually displayed label heavily depends of the runtime configuration as we try to always display something.</b>
</td></tr>
</table>

## What does it provide ?

### An exported object

`pwixAccountsTools`

### Constants

- AC_USERNAME
- AC_EMAIL_ADDRESS

#### Verbosity of the package

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

### Methods

`pwiRoles.current()`

A reactive data source which returns on the client the roles of the currently logged-in user as an object:
```
- id        {String}    the current user identifier
- all       {Array}     all the roles, either directly or indirectly set
- direct    {Array}     only the directly attributed top roles in the hierarchy (after havng removed indirect ones)
```

## NPM peer dependencies

In accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies), we do not hardcode NPM dependencies in `package.js`. Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.1.0:
```
    '@popperjs/core': '^2.11.6',
    bootstrap: '^5.2.1',
    jstree: '^3.3.12',
    uuid: '^9.0.0'
```
Each of these dependencies should be installed at application level:
```
    meteor npm install <package> --save
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-roles/pulls).

---
P. Wieser
- Last updated on 2023, Feb. 2nd
