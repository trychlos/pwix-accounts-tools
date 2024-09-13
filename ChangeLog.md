# pwix:accounts-tools

## ChangeLog

### 2.2.1-rc

    Release date: 

    - 

### 2.2.0

    Release date: 2024- 9-13

    - Replace the pwix:options dependency with a pwix:accounts-conf one
    - Define AccountsTools.areSame() new function, bumping minor candidate version number

### 2.1.0

    Release date: 2024- 7- 1

    - Add a dependency on Meteor check and check all private functions arguments
    - Add a dependency on Meteor accounts-base
    - Define new AccountsTools.cleanupUserDocument() function, bumping candidate release number
    - Reviewed all functions to use async versions and return Promises (todo #3)
    - New AccountsTools.byEmail() function
    - New AccountsTools.byUsername() function
    - New AccountsTools.emails publication
    - Replace writedata() function with update( selector, modifier, options ) (todo #2)
    - Update README
    - Fix the behaviour when user is not found in the collection

### 2.0.0

    Release date: 2024- 5-25

    - Get rid of 'deanius:promise' dependency
    - Change APIs to always return a Promise (todo #3) thus bumping the major version number
    - Meteor 3.0 ready

### 1.0.0

    Release date: 2023-10-11

    - Initial release

---
P. Wieser
- Last updated on 2024, Sep. 13th
