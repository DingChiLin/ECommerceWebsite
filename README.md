### Environment
- node v12.13.0
- npm 6.12.0

### How to run

1. Install and start postgresql server
    1. Install: ```brew install postgresql```
    2. Initialize: ```initdb /usr/local/var/postgres```
    3. Start: ```pg_ctl -D /usr/local/var/postgres start```
2. Update env file
    1. Create `.env` file from template: ```cp env.template .env```
    2. Give database url for postgresql server connection in `.env` file
    3. Choose a port for the server in `.env` file
3. Install libraries
    1. ```npm install```
4. Migrate database
    1. ```knex migrate:up```
5. Create fake users and products for testing:
    1. ```npm run create_fake_data```
6. Start the server
    1. ```npm run start```
7. Login to the server for local testing:
    1. Login:
        1. Login through login page: `localhost:<port>/login`
        2. Login through API: see the `Login` part in path `localhost:<port>/api`
    2. There are 3 fake users created in step 5
        1. user1
            1. email: `user1@gmail.com`
            2. password: `user1password`
        2. user2
            1. email: `user2@gmail.com`
            2. password: `user2password`
        3. user3
            1. email: `user3@gmail.com`
            2. password: `user3password`
8. Call each API to get products list and create/update/delete orders
    1. See the APIs document in path `localhost:<port>/api`

### Get Product Image

1. localhost:<post>/<image_url>
2. `image_url` will be returned by product api.