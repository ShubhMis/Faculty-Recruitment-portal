const express = require("express")
const path = require("path");
const router = express.Router();

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
})

router.post('/loginmethod', (req, res) => {
    const { email, password } = req.body;
    const db = req.db;
    const selectQuery = `SELECT First_Name, Last_Name, Application_id FROM userauthentication WHERE Email = ? AND Password = ?`;
    db.query(selectQuery, [email, password], (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error occurred while querying the database.");
            return;
        }
        if (results.length > 0) {
            const firstName = results[0].First_Name;
            const lastName = results[0].Last_Name;
            const Application_id = results[0].Application_id;

            req.session.loggedInUser = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                Application_id : Application_id
            };

            res.redirect('/facultypanel');
        } else {
            res.send("Invalid email or password");
        }
    });
});

module.exports = router;