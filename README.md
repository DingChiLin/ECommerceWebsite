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
    1. There are 3 fake users created in step 5
        1. user1
            1. email: `user1@gmail.com`
            2. password: `user1password`
        2. user2
            1. email: `user2@gmail.com`
            2. password: `user2password`
        3. user3
            1. email: `user3@gmail.com`
            2. password: `user3password`
    2. See the `Login` part in APIs below
8. Call each API to get products list and create/update/delete orders

### APIs

- Login
    1. get: api/v1/login
    2. post: api/v1/login
        - parameters:
            1. email: [required]
            2. password: [required]
        - example:
        ```
        {
            "email": "user1@gmail.com",
            "password": "user1password"
        }
        ```

- Product
    1. get: api/v1/products
    2. get: api/v1/products/:id

- User
    1. get: api/v1/users/:id/orders
    2. post: api/v1/users/:id/orders
        - parameters:
            1. status: [optional]
            2. description: [optional]
            3. items: [required]
                1. product_id [required]
                2. number [required]
        - example:
        ```
        {
            "status": 1,
            "description: "my order", 
            "items": [{
                "product_id": 2,
                "number": 20
            }, ...]
        }
        ```
    3. delete: api/v1/users/:id/orders

- Order
    1. get: api/v1/orders/:id
    2. patch: api/v1/orders/:id
        - parameters:
            1. status: [optional]
            2. description: [optional]
            3. items: [optional]
                1. product_id [required]
                2. number [required]
        - note: need at least one optional parameter
        - example:
        ```
        {
            "status": 1,
            "description: "my order", 
            "items": [{
                "product_id": 2,
                "number": 20
            }, ...]
        }
        ```
    3. delete: api/v1/orders/:id
    4. get: api/v1/orders/:id/items
    5. post: api/v1/orders/:id/items
        - parameters:
            1. product_id [required]
            2. number [required]
        - example:
        ```
        [{
            "product_id": 1,
            "number": 10
        }, ...]
        ```  

- Item
    1. get: api/v1/items/:id
    2. patch: api/v1/items/:id
        - parameters:
            1. product_id [optional]
            2. number [optional]
        - note: need at least one optional parameter
        - example:
        ```
        {
            "product_id": 3,
            "number": 5
        }
        ```  
    3. delete: api/v1/items/:id

### Get Product Image

1. localhost:<post>/<image_url>
2. `image_url` will be returned by product api.