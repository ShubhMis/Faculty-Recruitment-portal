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

router.get('/acde2', requireLogin, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'acde2.html');
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



router.post('/acde2', (req, res) => {
    const {
        college_phd,
        stream,
        supervisor,
        yoj_phd,
        dod_phd,
        doa_phd,
        phd_title,
        pg_degree,
        pg_college,
        pg_subjects,
        pg_yoj,
        pg_yog,
        pg_duration,
        pg_perce,
        pg_rank,
        ug_degree,
        ug_college,
        ug_subjects,
        ug_yoj,
        ug_yog,
        ug_duration,
        ug_perce,
        ug_rank,
        hsc_ssc,
        school,
        passing_year,
        s_perce,
        s_rank,
        add_degree,
        add_college,
        add_subjects,
        add_yoj,
        add_yog,
        add_duration,
        add_perce,
        add_rank
    } = req.body;

    const Application_id = req.session.loggedInUser.Application_id;
    const db = req.db;

    const insertQuery = `
        INSERT INTO Educational (
            college_phd,
            stream,
            supervisor,
            yoj_phd,
            dod_phd,
            doa_phd,
            phd_title,
            pg_degree,
            pg_college,
            pg_subjects,
            pg_yoj,
            pg_yog,
            pg_duration,
            pg_perce,
            pg_rank,
            ug_degree,
            ug_college,
            ug_subjects,
            ug_yoj,
            ug_yog,
            ug_duration,
            ug_perce,
            ug_rank,
            hsc_ssc,
            school,
            passing_year,
            s_perce,
            s_rank,
            add_degree,
            add_college,
            add_subjects,
            add_yoj,
            add_yog,
            add_duration,
            add_perce,
            add_rank,
            Application_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            college_phd = VALUES(college_phd),
            stream = VALUES(stream),
            supervisor = VALUES(supervisor),
            yoj_phd = VALUES(yoj_phd),
            dod_phd = VALUES(dod_phd),
            doa_phd = VALUES(doa_phd),
            phd_title = VALUES(phd_title),
            pg_degree = VALUES(pg_degree),
            pg_college = VALUES(pg_college),
            pg_subjects = VALUES(pg_subjects),
            pg_yoj = VALUES(pg_yoj),
            pg_yog = VALUES(pg_yog),
            pg_duration = VALUES(pg_duration),
            pg_perce = VALUES(pg_perce),
            pg_rank = VALUES(pg_rank),
            ug_degree = VALUES(ug_degree),
            ug_college = VALUES(ug_college),
            ug_subjects = VALUES(ug_subjects),
            ug_yoj = VALUES(ug_yoj),
            ug_yog = VALUES(ug_yog),
            ug_duration = VALUES(ug_duration),
            ug_perce = VALUES(ug_perce),
            ug_rank = VALUES(ug_rank),
            hsc_ssc = VALUES(hsc_ssc),
            school = VALUES(school),
            passing_year = VALUES(passing_year),
            s_perce = VALUES(s_perce),
            s_rank = VALUES(s_rank),
            add_degree = VALUES(add_degree),
            add_college = VALUES(add_college),
            add_subjects = VALUES(add_subjects),
            add_yoj = VALUES(add_yoj),
            add_yog = VALUES(add_yog),
            add_duration = VALUES(add_duration),
            add_perce = VALUES(add_perce),
            add_rank = VALUES(add_rank)
    `;

    const values = [
        college_phd,
        stream,
        supervisor,
        yoj_phd,
        dod_phd,
        doa_phd,
        phd_title,
        pg_degree,
        pg_college,
        pg_subjects,
        pg_yoj,
        pg_yog,
        pg_duration,
        pg_perce,
        pg_rank,
        ug_degree,
        ug_college,
        ug_subjects,
        ug_yoj,
        ug_yog,
        ug_duration,
        ug_perce,
        ug_rank,
        hsc_ssc,
        school,
        passing_year,
        s_perce,
        s_rank,
        add_degree,
        add_college,
        add_subjects,
        add_yoj,
        add_yog,
        add_duration,
        add_perce,
        add_rank,
        Application_id
    ];

    db.query(insertQuery, values, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error occurred while inserting data into database.");
        } else {
            if (results.affectedRows > 0) {
                res.redirect('/employment')
            } else {
                res.status(400).send("No data inserted.");
            }
        }
    });
});

module.exports = router;