
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

router.get('/publish', requireLogin, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'publish4.html');
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

router.post('/publish', (req, res) => {
    const {
        summary_journal_inter,
        summary_journal,
        summary_conf_inter,
        summary_conf_national,
        patent_publish,
        summary_book,
        summary_book_chapter,
        author,
        title,
        journal,
        year,
        impact,
        doi,
        status,
        pauthor,
        ptitle,
        p_country,
        p_number,
        pyear_filed,
        pyear_published,
        pyear_issued,
        bc_author,
        bc_title,
        bc_year,
        bc_isbn,
        google_link
    } = req.body;

    const Application_id = req.session.loggedInUser.Application_id;
    const db = req.db;

    const insertQuery = `
        INSERT INTO publish_details (
            Application_id,
            summary_journal_inter,
            summary_journal,
            summary_conf_inter,
            summary_conf_national,
            patent_publish,
            summary_book,
            summary_book_chapter,
            author,
            title,
            journal,
            year,
            impact,
            doi,
            status,
            pauthor,
            ptitle,
            p_country,
            p_number,
            pyear_filed,
            pyear_published,
            pyear_issued,
            bc_author,
            bc_title,
            bc_year,
            bc_isbn,
            google_link
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            summary_journal_inter = VALUES(summary_journal_inter),
            summary_journal = VALUES(summary_journal),
            summary_conf_inter = VALUES(summary_conf_inter),
            summary_conf_national = VALUES(summary_conf_national),
            patent_publish = VALUES(patent_publish),
            summary_book = VALUES(summary_book),
            summary_book_chapter = VALUES(summary_book_chapter),
            author = VALUES(author),
            title = VALUES(title),
            journal = VALUES(journal),
            year = VALUES(year),
            impact = VALUES(impact),
            doi = VALUES(doi),
            status = VALUES(status),
            pauthor = VALUES(pauthor),
            ptitle = VALUES(ptitle),
            p_country = VALUES(p_country),
            p_number = VALUES(p_number),
            pyear_filed = VALUES(pyear_filed),
            pyear_published = VALUES(pyear_published),
            pyear_issued = VALUES(pyear_issued),
            bc_author = VALUES(bc_author),
            bc_title = VALUES(bc_title),
            bc_year = VALUES(bc_year),
            bc_isbn = VALUES(bc_isbn),
            google_link = VALUES(google_link)
    `;

    const values = [
        Application_id,
        summary_journal_inter,
        summary_journal,
        summary_conf_inter,
        summary_conf_national,
        patent_publish,
        summary_book,
        summary_book_chapter,
        author,
        title,
        journal,
        year,
        impact,
        doi,
        status,
        pauthor,
        ptitle,
        p_country,
        p_number,
        pyear_filed,
        pyear_published,
        pyear_issued,
        bc_author,
        bc_title,
        bc_year,
        bc_isbn,
        google_link
    ];

    db.query(insertQuery, values, (error, results) => {
        if (error) {
            console.error("Error executing SQL query:", error);
            res.status(500).send("Internal Server Error");
        } else {
            res.redirect('/acd_ind');
        }
    });
});

module.exports = router;