# pwix:accounts-tools - TODO

## Summary

1. [Todo](#todo)
2. [Done](#done)

---
## Todo

|   Id | Date       | Description and comment(s) |
| ---: | :---       | :---                       |
|    4 |  |  |

---
## Done

|   Id | Date       | Description and comment(s) |
| ---: | :---       | :---                       |
|    1 | 2023- 9-13 | make sure that email address is unique inside of users collection ? |
|      | 2023-10-11 | according to https://docs.meteor.com/api/accounts, "an email address may belong to at most one user" |
|      |            | according to https://docs.meteor.com/api/passwords, "If there are existing users with a username or email only differing in case, createUser will fail" |
|      |            | so the point can be considered as acted |
|    2 | 2023- 9-19 | make sure writeData() is relevant in current state (not sure at all) |
|      | 2024- 5-30 | could be for example a 'set' function, with Mongo query argument |
|      | 2024- 6- 3 | done with update( modifier, options ) function |
|    3 | 2024- 5-24 | review server code to replace all sync calls with async/await |
|      | 2024- 5-30 | done |

---
P. Wieser
- Last updated on 2024, Jul. 1st
