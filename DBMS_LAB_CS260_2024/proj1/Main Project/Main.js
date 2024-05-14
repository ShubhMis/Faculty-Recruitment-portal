const express = require('express');
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const exphbs = require('express-handlebars');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const facultypanelRouter = require('./routes/facultypanel');
const acde2 = require('./routes/acde2');
const employment = require('./routes/employment');
const publish = require('./routes/publish');
const acd_ind = require('./routes/acd_ind');
const thesis_course = require('./routes/thesis_course');
const rel_info = require('./routes/rel_info');
const payment_complete = require('./routes/payment_complete');
const submission_complete = require('./routes/submission_complete');
const finalpdf = require('./routes/finalpdf');

const app = express();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css')));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "firstsql"
})

const port = process.env.PORT || 4000;

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MySQL Connected");
    }
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', (req, res, next) => {
    req.db = db;
    next();
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/');
        }
    });
});

app.use('/',loginRouter);
app.use('/',signupRouter);
app.use('/',facultypanelRouter);
app.use('/',acde2);
app.use('/',employment);
app.use('/',publish);
app.use('/',acd_ind);
app.use('/',thesis_course);
app.use('/',rel_info);
app.use('/',payment_complete);
app.use('/',submission_complete);
app.use('/',finalpdf);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});