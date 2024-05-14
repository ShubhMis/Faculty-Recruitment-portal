const express = require("express")
const path = require("path");
const router = express.Router();
const fs = require('fs');

function requireLogin(req, res, next) {
    if (req.session.loggedInUser) {
        next();
    } else {
        res.redirect('/');
    }
}

router.get('/payment_complete', requireLogin, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'payment_complete9.html');
    fs.readFile(filePath, 'utf8', function(err, html) {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        const firstName = req.session.loggedInUser.firstName;
        const lastName = req.session.loggedInUser.lastName;
        const email = req.session.loggedInUser.email;
        const Application_id = req.session.loggedInUser.Application_id;
        const modifiedHtml = html.replace('<strong>{{ firstName }} {{ lastName }}</strong>', `<strong>${firstName} ${lastName}</strong>`);

        res.send(modifiedHtml);
    });
});

router.post('/payment_complete', (req, res) => {
   
    const {
        my_state,
        decl_status
    } = req.body;

    const Application_id = req.session.loggedInUser.Application_id;
    const db = req.db;

    if(decl_status){
        res.redirect('/finalpdf');
    }

    else{
        res.status(400).send("Checkbox error");
    }
});

module.exports = router;