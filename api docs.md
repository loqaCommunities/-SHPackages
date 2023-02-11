# loqa api docs

Welcome to the forbidden inscryptions, brave one. This is the powerful file that contains **the docs of the loqa api** *duh*. Proceed with caution.

shh use ctrl+f to find what you're looking for, this is polish engineering not some fancy-ass engineering

![this file is still under construction](https://cdn.discordapp.com/attachments/1073976259513700472/1073976259832463490/under_construction.png)

## auth route

The `auth route` is basically for creating and logging into accounts.

Its link syntax is: `[loqa link]/api/auth/[option]`.

There are **2** options:

- **register**: for registering new accounts
- **login**: for logging into existing accounts

### register

The `register` option is a `post` request and has **9** parameters:

- **username**: `string` `max length: 20` the accounts display name
- **email**: `string` the email linked to the account, used for logging in
- **password**: `string` `max length: 30` the password used to log into the account
- **PFP**: `string` `link` `optional` the profile picture of the account
- **bio**: `string` `link` `optional` the bio of the account
- **isBot**: `boolean` `default: false` determines whether the account appears as a bot or not

If the request is valid, the server should return the friend code of the user.

### login

The `login` option is a `post` request and has **2** parameters:

- **email**: `string` the email linked to the account
- **password**: `string` the password linked to the account

If the request is vaild, the server should return:

- the accounts ID
- the accounts token

## users route

The `users route` is for everything to other users accounts.

Its link syntax is: `[loqa link]/api/users/[option]`.

There is currently only one route:

- `user id`: for getting information about the user who has that id

### `user id`

The `user id` option is a `get` request and has no extra parameters.

If the request is valid, the server should return:

- the accounts username
- the accounts friend code
- the accounts profile picture
- the accounts banner
- what communities is the account a member of
- what accounts/communities does this account follow
- what accounts follow this account
- if the account is a site admin
- if the friend code is the email address
- the email linked to this account
- whether the account is a bot or not
- the id of the account

## communities route

The `communities route` is everything to do with communities.

It's link syntax is: `[loqa link]/api/communities/[option]`.

There are **2** options:

- **create**: for creating a new community
- `community id`: for getting information about the community which has that id

### create

The `create` option is a `post` request and has **7** parameters:

- **name**: `string` `max length: 100` the name of the community
- **token**: `string` the token of the account making the community
- **about**: `string` `markdown` `optional` `max length: 1000` the text in "about community"
- **rules**: `string` `markdown` `optional` `max length: 200` the rules of the community
- **icon**: `string` `link` `optional` the icon of the community
- **banner**: `string` `link` `optional` the banner of the community
- **coOwners**: `array` ids of co-owner accounts

If the request is valid, the server should return the community object.

### `community id`

The `community id` option is a `get` request and has only one parameter, the users token `string`.

If the request is valid, the server should respond with:

- the amount of members in the community
- the rules of the community
- the ID of the account that is the owner of the community
- the about of the community
- the ids of member cards in the community

The `community id` option has also one variant and it's a `delete` request.

It has only the token parameter.

If the request is valid, the server should respond with "community shattered".

The `community id` option has a few sub-options:

- **join**: join the community with that id
- **ban**: ban someone in the community with that id
- **kick**: kick someone in the community with that id
- **unban**: unban someone in the community with that id
- **members**: WIP, will be used for stuff related to the users member card

### join

The `join` option is a `post` request and has only one parameter, the users token `string`.

If the request is valid, the server should respond with the server object.

### ban

The `ban` option is a `delete` option and has **2** parameters:

- **token**: `string` the users token
- **user**: `string` the ID of the user who's getting banned

If the request is valid, the server should respond with "member was banned".

### kick

The `kick` option is a `delete` option and has **2** parameters:

- **token**: `string` the users token
- **user**: `string` the ID of the user who's getting kicked

If the request is valid, the server should respond with "member was kicked".

### unban

The `unban` option is a `delete` option and **2** parameters:

- **token**: `string` the users token
- **user**: `string` the ID of the user to unban

If the request is valid, the server should respond with "member was unbanned".
