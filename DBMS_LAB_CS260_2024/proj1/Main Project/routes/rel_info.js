

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

router.get('/rel_info', requireLogin, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'rel_info7.html');
    fs.readFile(filePath, 'utf8', function(err, html) {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        const firstName = req.session.loggedInUser.firstName;
        const lastName = req.session.loggedInUser.lastName;
        const email = req.session.loggedInUser.email;
        const Application_id = req.session.loggedInUser.Application_id;
        const modifiedHtml = html.replace('<strong>{{ firstName }} {{ lastName }}</strong>', `<strong>${firstName} ${lastName}</strong>`)

        res.send(modifiedHtml);
    });
});


router.post('/rel_info', (req, res) => {
    const {
        conf_details,
        jour_details,
        prof_serv,
        rel_in,
        teaching_statement,
        research_statement
    } = req.body;

    const Application_id = req.session.loggedInUser.Application_id;
    const db = req.db;

    const insertOrUpdateQuery = `
        INSERT INTO rel_info (
            conf_details,
            jour_details,
            prof_serv,
            rel_in,
            teaching_statement,
            research_statement,
            Application_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            conf_details = VALUES(conf_details),
            jour_details = VALUES(jour_details),
            prof_serv = VALUES(prof_serv),
            rel_in = VALUES(rel_in),
            teaching_statement = VALUES(teaching_statement),
            research_statement = VALUES(research_statement)
    `;

    const values = [
        conf_details,
        jour_details,
        prof_serv,
        rel_in,
        teaching_statement,
        research_statement,
        Application_id
    ];

    db.query(insertOrUpdateQuery, values, (error, results) => {
        if (error) {
            console.error("Error occurred:", error);
            res.status(500).send("Error occurred while saving data.");
        } else {
            if (results.affectedRows > 0) {
                res.redirect('/submission_complete');
            } else {
                res.status(400).send("No data saved.");
            }
        }
    });
});

module.exports = router;