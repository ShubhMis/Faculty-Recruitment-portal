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

router.get('/facultypanel', requireLogin, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'facultypanel1.html');
    fs.readFile(filePath, 'utf8', function(err, html) {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        const firstName = req.session.loggedInUser.firstName;
        const lastName = req.session.loggedInUser.lastName;
        const email = req.session.loggedInUser.email;
        const Application_id = req.session.loggedInUser.Application_id;

        const modifiedHtml = html.replace('<strong>{{ firstName }} {{ lastName }}</strong>', `<strong>${firstName} ${lastName}</strong>`)
        .replace('value="email"', `value="${email}"`)
        .replace('value="1698348185"', `value="${Application_id}"`);
        

        res.send(modifiedHtml);
    });
});


router.post('/facultypaneldata', (req, res) => {
    const {fname,
        mname,
        lname,
        nationality,
        dob,
        gender,
        mstatus,
        cast,
        id_proof,
        father_name,
        cadd,
        padd,
        mobile,
        mobile_2,
        email_2,
        landline,
        doa,
        post,
        dept
    } = req.body;

        const Application_id = req.session.loggedInUser.Application_id;

        
    const db = req.db;

        const insertQuery = `
        INSERT INTO personaldetails (
            First_Name, 
            Middle_Name, 
            Last_Name, 
            Nationality, 
            Date_of_Birth, 
            Gender, 
            Marital_Status, 
            Category, 
            ID_Proof, 
            Father_s_Name, 
            Correspondence_Address, 
            Permanent_Address, 
            Mobile, 
            Alternate_Mobile, 
            Alternate_Email, 
            Landline_Number,
            Application_id,
            Date_of_Application,
            Post_Applied_For,
            Department
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            First_Name = VALUES(First_Name),
            Middle_Name = VALUES(Middle_Name),
            Last_Name = VALUES(Last_Name),
            Nationality = VALUES(Nationality),
            Date_of_Birth = VALUES(Date_of_Birth),
            Gender = VALUES(Gender),
            Marital_Status = VALUES(Marital_Status),
            Category = VALUES(Category),
            ID_Proof = VALUES(ID_Proof),
            Father_s_Name = VALUES(Father_s_Name),
            Correspondence_Address = VALUES(Correspondence_Address),
            Permanent_Address = VALUES(Permanent_Address),
            Mobile = VALUES(Mobile),
            Alternate_Mobile = VALUES(Alternate_Mobile),
            Alternate_Email = VALUES(Alternate_Email),
            Landline_Number = VALUES(Landline_Number),
            Date_of_Application = VALUES(Date_of_Application),
            Post_Applied_For = VALUES(Post_Applied_For),
            Department = VALUES(Department)
    `;

    const values = [
        fname,
        mname,
        lname,
        nationality,
        dob,
        gender,
        mstatus,
        cast,
        id_proof,
        father_name,
        cadd,
        padd,
        mobile,
        mobile_2,
        email_2,
        landline,
        Application_id,
        doa,
        post,
        dept
    ];

    db.query(insertQuery, values, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error occurred while inserting data into database.");
        } else {
            if (results.affectedRows > 0) {
                res.redirect('/acde2');
            } else {
                res.status(400).send("No data inserted/updated.");
            }
        }
    });

}); 





module.exports = router;
