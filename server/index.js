require('dotenv').config();
const bcrypt = require('bcrypt-nodejs');
const express = require('express');
const LocalStrategy = require('passport-local').Strategy;
const morgan = require('morgan');
const passport = require('passport');
const pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL
});
const port = process.env.PORT || 8000;
const session = require('express-session');
const uuid = require('uuid/v4');

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        const [user] = await pg('users').where({email});
        if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Invalid credentials' });
        } else {
            return done(null, user);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const [user] = await pg('users').where({id});
    done(null, user);
});

const app = express();
app.set('json spaces', 2);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('resources'));
app.use(morgan());

const FileStore = require('session-file-store')(session);
app.use(session({
    genid: () => {
        return uuid();
    },
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/v1',
    (req, res, next) => {
        if (!req.isAuthenticated()) { return res.status(401).json('Not logged-in');}
        return next();
    },
    [
        require('./routes/product_routes'),
        require('./routes/user_routes'),
        require('./routes/order_routes'),
        require('./routes/item_routes')
    ]
);

app.get('/', (req, res) => {
    res.send('Home page!');
});

/**
 * @api {get} /login GetLoginPage
 * @apiGroup Login
 * @apiVersion 0.1.0
 *
 * @apiSuccessExample {String} Success-Response:
 *     HTTP/1.1 200 OK
 *     "Login page!"
 */
app.get('/login', (req, res) => {
    res.send('Login page!');
});

/**
 * @api {post} /login Login
 * @apiGroup Login
 * @apiVersion 0.1.0
 * 
 * @apiParam {String} email
 * @apiParam {String} password
 *
 * @apiSuccessExample {String} Success-Response:
 *     HTTP/1.1 200 OK
 *     "Login Succeeded!"
 */
app.post('/login',
    passport.authenticate('local'),
    (req, res) => {
        return res.send('Login Succeeded!');
    }
);

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});