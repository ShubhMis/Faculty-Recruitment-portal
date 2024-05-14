const express = require("express")
const path = require("path");
const router = express.Router();

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
})

router.post('/signupdata', (req, res) => {
    const { firstname, lastname, email, password, cast } = req.body;
    const db = req.db;

    const insertQuery = `INSERT INTO userauthentication (First_Name, Last_Name, Email, Password, Category) VALUES (?, ?, ?, ?, ?)`;
    db.query(insertQuery, [firstname, lastname, email, password, cast], (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error occurred while inserting data into database.");
        } else {
            res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
        }
    });
});

module.exports = router;