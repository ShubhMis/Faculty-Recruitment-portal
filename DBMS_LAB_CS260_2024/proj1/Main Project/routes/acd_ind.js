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

router.get('/acd_ind', requireLogin, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'acd_ind5.html');
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

router.post('/acd_ind', (req, res) => {
    const { mname, mstatus, trg2, porg2, pyear2, pduration2, awardname, by_person, year3, agency, stitle, samount, speriod, s_role, s_status, c_org, ctitle, camount, cperiod, c_role, c_status } = req.body;
    const Application_id = req.session.loggedInUser.Application_id;
    const db = req.db;

    const insertQuery = `
        INSERT INTO acd_ind (
            mname, mstatus, trg2, porg2, pyear2, pduration2,
            awardname, by_person, year3, agency, stitle, samount,
            speriod, s_role, s_status, c_org, ctitle, camount,
            cperiod, c_role, c_status, Application_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            mname = VALUES(mname),
            mstatus = VALUES(mstatus),
            trg2 = VALUES(trg2),
            porg2 = VALUES(porg2),
            pyear2 = VALUES(pyear2),
            pduration2 = VALUES(pduration2),
            awardname = VALUES(awardname),
            by_person = VALUES(by_person),
            year3 = VALUES(year3),
            agency = VALUES(agency),
            stitle = VALUES(stitle),
            samount = VALUES(samount),
            speriod = VALUES(speriod),
            s_role = VALUES(s_role),
            s_status = VALUES(s_status),
            c_org = VALUES(c_org),
            ctitle = VALUES(ctitle),
            camount = VALUES(camount),
            cperiod = VALUES(cperiod),
            c_role = VALUES(c_role),
            c_status = VALUES(c_status)
    `;

    const values = [
        mname, mstatus, trg2, porg2, pyear2, pduration2,
        awardname, by_person, year3, agency, stitle, samount,
        speriod, s_role, s_status, c_org, ctitle, camount,
        cperiod, c_role, c_status, Application_id
    ];

    db.query(insertQuery, values, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Error occurred while saving data.");
        }

        if (results.affectedRows > 0) {
            res.redirect("/thesis_course");
        } else {
            return res.status(400).send("No data inserted/updated.");
        }
    });
});

module.exports = router;