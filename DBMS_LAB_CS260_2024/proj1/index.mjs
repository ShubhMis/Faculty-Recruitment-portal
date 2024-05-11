import express from "express";
const app = express();
import multer from "multer";
import path from "path";
import ejsmate from "ejs-mate";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import flash from "connect-flash";
import nodemailer from "nodemailer";
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// EJS setup
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
import { fileURLToPath } from "url";
import { Console } from "console";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

//multr setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12344321",
  database: "DBMS_project",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL connected");
  }
});

// Session middleware
app.use(
  session({
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Middleware to set current user in locals
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  req.session.currUser = req.user;
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
db.query(`CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
)`);

db.query(`CREATE TABLE IF NOT EXISTS profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
)`);

db.query(`CREATE TABLE IF NOT EXISTS applicationdetails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  adv_num VARCHAR(255) NOT NULL,
  doa VARCHAR(255) NOT NULL,
  app_num VARCHAR(255) NOT NULL,
  post VARCHAR(255) NOT NULL,
  dept VARCHAR(255) NOT NULL
)`);

db.query(`CREATE TABLE IF NOT EXISTS personaldetails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  nationality VARCHAR(255) NOT NULL,
  dob VARCHAR(255) NOT NULL,
  gender VARCHAR(255) NOT NULL,
  maritalstatus VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  image_path VARCHAR(255) NULL,
  idproof VARCHAR(255) NOT NULL,
  idproof_image VARCHAR(255) NULL,
  father_name VARCHAR(255) NOT NULL,
  correspondenceaddress VARCHAR(255) NOT NULL,
  permanentaddress VARCHAR(255) NOT NULL,
  mobile VARCHAR(255) NOT NULL,
  altmobile VARCHAR(255) NOT NULL,
  altemail VARCHAR(255) NOT NULL,
  landlinenumber VARCHAR(255) NOT NULL
)`);
db.query(`CREATE TABLE IF NOT EXISTS page_8 (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  phd_path VARCHAR(255) NULL,
  pg_path VARCHAR(255) NULL,
  ug_path VARCHAR(255) NULL,
  tw_path VARCHAR(255) NULL,
  te_path VARCHAR(255) NULL,
  pay_path VARCHAR(255) NULL,
  noc_path VARCHAR(255) NULL,
  post_path VARCHAR(255) NULL,
  misc_path VARCHAR(255) NULL,
  sign_path VARCHAR(255) NULL)`);

db.query(`CREATE TABLE IF NOT EXISTS educationaldetails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    college_phd VARCHAR(255),
    stream_phd VARCHAR(255),
    supervisor_phd VARCHAR(255),
    yoj_phd VARCHAR(255),
    dod_phd VARCHAR(255),
    doa_phd VARCHAR(255),
    phd_title VARCHAR(255),
    pg_degree VARCHAR(255),
    pg_college VARCHAR(255),
    pg_stream VARCHAR(255),
    pg_yoj VARCHAR(255),
    pg_yoc VARCHAR(255),
    pg_duration VARCHAR(255),
    pg_cgpa VARCHAR(255),
    pg_division VARCHAR(255),
    ug_degree VARCHAR(255),
    ug_college VARCHAR(255),
    ug_stream VARCHAR(255),
    ug_yoj VARCHAR(255),
    ug_yoc VARCHAR(255),
    ug_duration VARCHAR(255),
    ug_cgpa VARCHAR(255),
    ug_division VARCHAR(255),
    hsc_school VARCHAR(255),
    hsc_passingyear VARCHAR(255),
    hsc_percentage VARCHAR(255),
    hsc_division VARCHAR(255),
    ssc_school VARCHAR(255),
    ssc_passingyear VARCHAR(255),
    ssc_percentage VARCHAR(255),
    ssc_division VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS edu_additionaldetails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  educationaldetails_id INT,
  degree VARCHAR(255),
  college VARCHAR(255),
  subjects VARCHAR(255),
  yoj VARCHAR(255),
  yog VARCHAR(255),
  duration VARCHAR(255),
  perce VARCHAR(255),
  division VARCHAR(255),
  FOREIGN KEY (educationaldetails_id) REFERENCES educationaldetails(id)
)`);

db.query(`CREATE TABLE IF NOT EXISTS publications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  summary_journal_inter VARCHAR(255),
  summary_journal VARCHAR(255),
  summary_conf_inter VARCHAR(255),
  summary_conf_national VARCHAR(255),
  patent_publish VARCHAR(255),
  summary_book VARCHAR(255),
  summary_book_chapter VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS top10publications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  author VARCHAR(255),
  title VARCHAR(255),
  journal VARCHAR(255),
  year VARCHAR(255),
  impact VARCHAR(255),
  doi VARCHAR(255),
  status VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS patents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  pauthor VARCHAR(255),
  ptitle VARCHAR(255),
  p_country VARCHAR(255),
  p_number VARCHAR(255),
  pyear_filed VARCHAR(255),
  pyear_published VARCHAR(255),
  pyear_issued VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  bauthor VARCHAR(255),
  btitle VARCHAR(255),
  byear VARCHAR(255),
  bisbn VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS book_chapters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  bc_author VARCHAR(255),
  bc_title VARCHAR(255),
  bc_year VARCHAR(255),
  bc_isbn VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS googlelink (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  googlelink VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS presentemployment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  pres_emp_position VARCHAR(255),
  pres_emp_employer VARCHAR(255),
  pres_status VARCHAR(255),
  pres_emp_doj VARCHAR(255),
  pres_emp_dol VARCHAR(255),
  pres_emp_duration VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS employmenthistory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  exp_position VARCHAR(255),
  exp_employer VARCHAR(255),
  exp_doj VARCHAR(255),
  exp_dol VARCHAR(255),
  exp_duration VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS teachingexp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  t_exp_position VARCHAR(255),
  t_exp_employer VARCHAR(255),
  t_exp_course VARCHAR(255),
  t_ugpg VARCHAR(255),
  t_noofstudents VARCHAR(255),
  t_doj VARCHAR(255),
  t_dol VARCHAR(255),
  t_duration VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS researchexp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  r_exp_position VARCHAR(255),
  r_exp_institute VARCHAR(255),
  r_exp_supervisor VARCHAR(255),
  r_exp_doj VARCHAR(255),
  r_exp_dol VARCHAR(255),
  r_exp_duration VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS industrialexp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  ind_exp_organization VARCHAR(255),
  ind_exp_workprofile VARCHAR(255),
  ind_exp_doj VARCHAR(255),
  ind_exp_dol VARCHAR(255),
  ind_exp_duration VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS aos_aor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  area_spl VARCHAR(255),
  area_rese VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS membership (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  professional_society_name VARCHAR(255),
  membership_status VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS training (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  training_type VARCHAR(255),
  training_organization VARCHAR(255),
  training_year VARCHAR(255),
  training_duration VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS awards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  award_name VARCHAR(255),
  awarded_by VARCHAR(255),
  award_year VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS sponsoredprojects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  sponsoring_agency VARCHAR(255),
  project_title VARCHAR(255),
  sanctioned_amount VARCHAR(255),
  project_period VARCHAR(255),
  project_role VARCHAR(255),
  project_status VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS consultancyprojects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  consultancy_organization VARCHAR(255),
  consultancy_title VARCHAR(255),
  grant_amount VARCHAR(255),
  consultancy_period VARCHAR(255),
  consultancy_role VARCHAR(255),
  consultancy_status VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS phd_thesis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  phd_name VARCHAR(255),
  phd_title VARCHAR(255),
  phd_role VARCHAR(255),
  phd_status VARCHAR(255),
  phd_year VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS pg_thesis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  pg_name VARCHAR(255),
  pg_title VARCHAR(255),
  pg_role VARCHAR(255),
  pg_status VARCHAR(255),
  pg_year VARCHAR(255)
)`);

db.query(`CREATE TABLE IF NOT EXISTS ug_thesis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  ug_name VARCHAR(255),
  ug_title VARCHAR(255),
  ug_role VARCHAR(255),
  ug_status VARCHAR(255),
  ug_year VARCHAR(255)
)`);

// Passport local strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
      if (err) return done(err);
      if (!rows.length) return done(null, false);

      const user = rows[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return done(err);
        if (!result) return done(null, false);
        return done(null, user);
      });
    });
  })
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, rows) => {
    done(err, rows[0]);
  });
});

//mailer

app.get("/reset", (req, res) => {
  res.render("formpages/reset.ejs");
});
app.post("/reset", async (req, res) => {
  const email = req.body.email;
  req.session.forgotpasswordemail = email;
  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      type: 'login', // specify auth type
      user: `dkb8923@gmail.com`,
      pass: 'csdn qkeh rabv nyjh' // use 'pass', not 'password'
    },
  });

  const mailOptions = {
    from: "IIT PATNA<support>.com",
    to: email,
    subject: "password-reset-link",
    text: `Click the following link to reset your password: http://localhost:8000/reset-password/${token}`,
    html: `<p>Click the following link to reset your password:</p><p><a href="http://localhost:8000/reset-password/${token}">http://localhost:8000/reset-password/${token}</a></p>`
  };
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.redirect("/reset");
    } else {
      res.redirect("/login");
    }
  });



});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get('/reset-password/:token', (req, res) => {
  const token = req.params.token;

  res.render('formpages/reset-password.ejs', { token });
});

app.post('/reset-password/:token', (req, res) => {
  const token = req.params.token;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  if (password !== confirm_password) {
    res.render('formpages/reset-password.ejs', { token, message: 'Passwords do not match' });
    return;
  }
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    db.query('UPDATE users SET password = ? WHERE email = ?', [hash, req.session.forgotpasswordemail], (err, result) => {
      if (err) {
        console.error('Error updating password:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.redirect("/login");
    });
  });
});

app.post('/upload', upload.fields([
  { name: 'phdCertificate' },
  { name: 'pgDocuments' },
  { name: 'ugDocuments' },
  { name: 'twelfthCertificate' },
  { name: 'tenthCertificate' },
  { name: 'paySlip' },
  { name: 'nocUndertaking' },
  { name: 'postPhdExperience' },
  { name: 'miscCertificate' },
  { name: 'signature' }
]), (req, res) => {
  let page_8 = {
    email: req.session.currUser.email,
    phd_path: req.files['phdCertificate'] ? req.files['phdCertificate'][0].path : null,
    pg_path: req.files['pgDocuments'] ? req.files['pgDocuments'][0].path : null,
    ug_path: req.files['ugDocuments'] ? req.files['ugDocuments'][0].path : null,
    tw_path: req.files['twelfthCertificate'] ? req.files['twelfthCertificate'][0].path : null,
    te_path: req.files['tenthCertificate'] ? req.files['tenthCertificate'][0].path : null,
    pay_path: req.files['paySlip'] ? req.files['paySlip'][0].path : null,
    noc_path: req.files['nocUndertaking'] ? req.files['nocUndertaking'][0].path : null,
    post_path: req.files['postPhdExperience'] ? req.files['postPhdExperience'][0].path : null,
    misc_path: req.files['miscCertificate'] ? req.files['miscCertificate'][0].path : null,
    sign_path: req.files['signature'] ? req.files['signature'][0].path : null
  };

  db.query('INSERT INTO page_8 SET ?', page_8, (err, result) => {
    if (err) {
      console.error('Error inserting page_8 data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send('Files uploaded successfully');
  });
});

// Signup route
app.get("/signup", (req, res) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  res.render("home/signup.ejs", { randomString });
});

app.post("/signup", (req, res) => {
  const {
    firstname,
    lastname,
    category,
    email,
    password,
    re_password,
    captcha,
    randomString,
  } = req.body;

  if (password !== re_password) {
    res.redirect("/signup");
    return;
  }

  if (captcha === randomString) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;

      db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hash],
        (err, result) => {
          if (err) throw err;

          db.query(
            "INSERT INTO profile (first_name, last_name, category, email) VALUES (?, ?, ?, ?)",
            [firstname, lastname, category, email],
            (err, result) => {
              if (err) throw err;
            }
          );

          res.redirect("/login");
        }
      );
    });
  } else {
    const charset =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset[randomIndex];
    }
    res.render("home/signup.ejs", { randomString });
  }
});

// Login route
app.get("/login", (req, res) => {
  res.render("home/logged.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    res.redirect("/formpages/1");
  }
);

app.get("/formpages/1", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;
  const personaldetails = req.session.personaldetails || {};
  const applicationdetails = req.session.applicationdetails || {};
  let imagePath = req.session.image_path ? req.session.image_path : null;
  let idpath = req.session.idpath ? req.session.idpath : null;
  if (imagePath) {
    imagePath = imagePath.replace(/\\/g, '/');
  }

  db.query(
    "SELECT first_name, last_name, category FROM profile WHERE email = ?",
    [userEmail],
    (err, rows) => {
      if (err) {
        console.error("Error retrieving profile data:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (rows.length === 0) {
        return res.status(404).send("Profile not found");
      }
      const { first_name, last_name, category } = rows[0];
      res.render("formpages/1st.ejs", {
        firstname: first_name,
        lastname: last_name,
        email: userEmail,
        category: category,
        personaldetails: personaldetails,
        applicationdetails: applicationdetails,
        imagePath: imagePath,

        idpath: idpath
      });
    }
  );
});


app.post("/formpages/1", isAuthenticated, upload.fields([{ name: 'uploadid' }, { name: 'userfile' }]), (req, res) => {

  let uploadidFile = null;
  let userfile = null;

  if (req.files['uploadid'] && req.files['uploadid'][0]) {
    uploadidFile = req.files['uploadid'][0];
  }

  if (req.files['userfile'] && req.files['userfile'][0]) {
    userfile = req.files['userfile'][0];
  }
  let applicationdetails = req.body.applicationdetails;
  let personaldetails = req.body.personaldetails;
  applicationdetails.email = req.session.currUser.email;
  req.session.personaldetails = personaldetails;
  req.session.applicationdetails = applicationdetails;
  req.session.image_path = userfile ? userfile.path : null;
  req.session.idpath = uploadidFile ? uploadidFile.path : null;
  personaldetails.image_path = userfile ? userfile.path : null;
  personaldetails.idproof_image = uploadidFile ? uploadidFile.path : null;
  db.query('INSERT INTO applicationdetails SET ?', applicationdetails, (err, result) => {
    if (err) {
      console.error('Error inserting applicationdetails:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    db.query('INSERT INTO personaldetails SET ?', personaldetails, (err, result) => {
      if (err) {
        console.error('Error inserting personaldetails:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.redirect("/formpages/2");
    });
  });
});

app.get("/formpages/2", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;

  // Delete existing data from all tables where email matches
  db.query("DELETE FROM edu_additionaldetails WHERE educationaldetails_id IN (SELECT id FROM educationaldetails WHERE email = ?)", [userEmail], (err) => {
    if (err) {
      console.error("Error deleting publications:", err);
      return res.status(500).send("Internal Server Error");
    }
    db.query("DELETE FROM educationaldetails WHERE email = ?", [userEmail], (err) => {
      if (err) {
        console.error("Error deleting top10publications:", err);
        return res.status(500).send("Internal Server Error");
      }
      db.query(
        "SELECT first_name, last_name FROM profile WHERE email = ?",
        [userEmail],
        (err, rows) => {
          if (err) {
            console.error("Error retrieving profile data:", err);
            return res.status(500).send("Internal Server Error");
          }
          if (rows.length === 0) {
            return res.status(404).send("Profile not found");
          }
          const { first_name, last_name } = rows[0];
          res.render("formpages/2nd.ejs", {
            firstname: first_name,
            lastname: last_name,
          });
        }
      );
    });
  });
});


app.post("/formpages/2", isAuthenticated, (req, res) => {
  const email = req.session.currUser.email;
  req.body.email = email;

  // Insert main educational details into educationaldetails table
  const educationalDetailsQuery = `INSERT INTO educationaldetails (
      email,
      college_phd,
      stream_phd,
      supervisor_phd,
      yoj_phd,
      dod_phd,
      doa_phd,
      phd_title,
      pg_degree,
      pg_college,
      pg_stream,
      pg_yoj,
      pg_yoc,
      pg_duration,
      pg_cgpa,
      pg_division,
      ug_degree,
      ug_college,
      ug_stream,
      ug_yoj,
      ug_yoc,
      ug_duration,
      ug_cgpa,
      ug_division,
      hsc_school,
      hsc_passingyear,
      hsc_percentage,
      hsc_division,
      ssc_school,
      ssc_passingyear,
      ssc_percentage,
      ssc_division
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const educationaldetails = [
    req.body.email,
    req.body.college_phd,
    req.body.stream_phd,
    req.body.supervisor_phd,
    req.body.yoj_phd,
    req.body.dod_phd,
    req.body.doa_phd,
    req.body.phd_title,
    req.body.pg_degree,
    req.body.pg_college,
    req.body.pg_stream,
    req.body.pg_yoj,
    req.body.pg_yoc,
    req.body.pg_duration,
    req.body.pg_cgpa,
    req.body.pg_division,
    req.body.ug_degree,
    req.body.ug_college,
    req.body.ug_stream,
    req.body.ug_yoj,
    req.body.ug_yoc,
    req.body.ug_duration,
    req.body.ug_cgpa,
    req.body.ug_division,
    req.body.hsc_school,
    req.body.hsc_passingyear,
    req.body.hsc_percentage,
    req.body.hsc_division,
    req.body.ssc_school,
    req.body.ssc_passingyear,
    req.body.ssc_percentage,
    req.body.ssc_division
  ];
  req.session.educationaldetails = educationaldetails;
  let edu_additionalDetails = [];

  req.session.edu_additionalDetails = edu_additionalDetails;
  db.query(educationalDetailsQuery, educationaldetails, (error, results, fields) => {
    if (error) {
      console.error('Error inserting educational details:', error);
      return res.status(500).send("Internal Server Error");
    } else {
      const educationaldetails_id = results.insertId;

      const additionalDetailsQuery = `INSERT INTO edu_additionaldetails (
              educationaldetails_id,
              degree,
              college,
              subjects,
              yoj,
              yog,
              duration,
              perce,
              division
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

      const edu_additionalDetails = [];
      if (req.body.add_degree !== undefined) {
        for (let i = 0; i < req.body.add_degree.length; i++) {
          const edu_additionalDetailsValues = [
            educationaldetails_id,
            req.body.add_degree[i],
            req.body.add_college[i],
            req.body.add_subjects[i],
            req.body.add_yoj[i],
            req.body.add_yog[i],
            req.body.add_duration[i],
            req.body.add_perce[i],
            req.body.add_division[i]
          ];
          db.query(additionalDetailsQuery, edu_additionalDetailsValues, (error, results, fields) => {
            if (error) {
              console.error('Error inserting additional details:', error);
            }
          });
        }
      }
      res.redirect("/formpages/3");
    }
  });
});

app.get("/formpages/3", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;

  // Delete existing data from all tables where email matches
  db.query("DELETE FROM presentemployment WHERE email = ?", [userEmail], (err) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    db.query("DELETE FROM employmenthistory WHERE email = ?", [userEmail], (err) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }
      db.query("DELETE FROM teachingexp WHERE email = ?", [userEmail], (err) => {
        if (err) {
          return res.status(500).send("Internal Server Error");
        }
        db.query("DELETE FROM researchexp WHERE email = ?", [userEmail], (err) => {
          if (err) {
            return res.status(500).send("Internal Server Error");
          }
          db.query("DELETE FROM industrialexp WHERE email = ?", [userEmail], (err) => {
            if (err) {
              return res.status(500).send("Internal Server Error");
            }
            db.query("DELETE FROM aos_aor WHERE email = ?", [userEmail], (err) => {
              if (err) {
                return res.status(500).send("Internal Server Error");
              }
              db.query(
                "SELECT first_name, last_name FROM profile WHERE email = ?",
                [userEmail],
                (err, rows) => {
                  if (err) {
                    console.error("Error retrieving profile data:", err);
                    return res.status(500).send("Internal Server Error");
                  }
                  if (rows.length === 0) {
                    return res.status(404).send("Profile not found");
                  }
                  const { first_name, last_name } = rows[0];
                  res.render("formpages/3rd.ejs", {
                    firstname: first_name,
                    lastname: last_name,
                  });
                }
              );
            });
          });
        });
      });
    });
  });
});

app.post("/formpages/3", isAuthenticated, (req, res) => {
  req.body.email = req.session.currUser.email;
  const present = req.body.present;
  present.email = req.session.currUser.email;
  const aos_aor = req.body.aos_aor;
  aos_aor.email = req.session.currUser.email;
  db.query('INSERT INTO presentemployment SET ?', present, (err, result) => {
    if (err) throw err;
  });
  if (req.body.exp_position !== undefined) {
    for (let i = 0; i < req.body.exp_position.length; i++) {
      let data2 = [req.body.exp_position[i], req.body.exp_employer[i], req.body.exp_doj[i], req.body.exp_dol[i], req.body.exp_duration[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO employmenthistory(exp_position,exp_employer,exp_doj,exp_dol,exp_duration,email) Values (?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  if (req.body.t_exp_position !== undefined) {
    for (let i = 0; i < req.body.t_exp_position.length; i++) {
      let data2 = [req.body.t_exp_position[i], req.body.t_exp_employer[i], req.body.t_exp_course[i], req.body.t_ugpg[i], req.body.t_noofstudents[i], req.body.t_doj[i], req.body.t_dol[i], req.body.t_duration[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO teachingexp(t_exp_position,t_exp_employer,t_exp_course,t_ugpg,t_noofstudents,t_doj,t_dol,t_duration,email) Values (?,?,?,?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  if (req.body.r_exp_position !== undefined) {
    for (let i = 0; i < req.body.r_exp_position.length; i++) {
      let data2 = [req.body.r_exp_position[i], req.body.r_exp_institute[i], req.body.r_exp_supervisor[i], req.body.r_exp_doj[i], req.body.r_exp_dol[i], req.body.r_exp_duration[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO researchexp(r_exp_position,r_exp_institute,r_exp_supervisor,r_exp_doj,r_exp_dol,r_exp_duration,email) Values (?,?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  if (req.body.ind_exp_position !== undefined) {
    for (let i = 0; i < req.body.ind_exp_position.length; i++) {
      let data2 = [req.body.ind_exp_organization[i], req.body.ind_exp_workprofile[i], req.body.ind_exp_doj[i], req.body.ind_exp_dol[i], req.body.ind_exp_duration[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO industrialexp(ind_exp_organization,ind_exp_workprofile,ind_exp_doj,ind_exp_dol,ind_exp_duration,email) Values (?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  db.query('INSERT INTO aos_aor SET ?', aos_aor, (err, result) => {
    if (err) throw err;
  });
  res.redirect("/formpages/4");
});

app.get("/formpages/4", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;

  // Delete existing data from all tables where email matches
  db.query("DELETE FROM publications WHERE email = ?", [userEmail], (err) => {
    if (err) {
      console.error("Error deleting publications:", err);
      return res.status(500).send("Internal Server Error");
    }
    db.query("DELETE FROM top10publications WHERE email = ?", [userEmail], (err) => {
      if (err) {
        console.error("Error deleting top10publications:", err);
        return res.status(500).send("Internal Server Error");
      }
      db.query("DELETE FROM patents WHERE email = ?", [userEmail], (err) => {
        if (err) {
          console.error("Error deleting patents:", err);
          return res.status(500).send("Internal Server Error");
        }
        db.query("DELETE FROM books WHERE email = ?", [userEmail], (err) => {
          if (err) {
            console.error("Error deleting books:", err);
            return res.status(500).send("Internal Server Error");
          }
          db.query("DELETE FROM book_chapters WHERE email = ?", [userEmail], (err) => {
            if (err) {
              console.error("Error deleting book_chapters:", err);
              return res.status(500).send("Internal Server Error");
            }
            db.query("DELETE FROM googlelink WHERE email = ?", [userEmail], (err) => {
              if (err) {
                console.error("Error deleting book_chapters:", err);
                return res.status(500).send("Internal Server Error");
              }

              // Once deletion is complete, retrieve profile data
              db.query(
                "SELECT first_name, last_name FROM profile WHERE email = ?",
                [userEmail],
                (err, rows) => {
                  if (err) {
                    console.error("Error retrieving profile data:", err);
                    return res.status(500).send("Internal Server Error");
                  }
                  if (rows.length === 0) {
                    return res.status(404).send("Profile not found");
                  }
                  const { first_name, last_name } = rows[0];
                  res.render("formpages/4th.ejs", {
                    firstname: first_name,
                    lastname: last_name,
                  });
                }
              );
            });
          });
        });
      });
    });
  });
});

app.post("/formpages/4", isAuthenticated, (req, res) => {
  req.body.email = req.session.currUser.email;
  const data1 = req.body.one;
  data1.email = req.session.currUser.email;
  console.log(req.body);
  // Insert data into publications table
  db.query('INSERT INTO publications SET ?', data1, (err, result) => {
    if (err) throw err;
  });
  if (req.body.author !== undefined) {
    for (let i = 0; i < req.body.author.length; i++) {
      let data2 = [req.body.author[i], req.body.title[i], req.body.journal[i], req.body.year[i], req.body.impact[i], req.body.doi[i], req.body.status[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO top10publications(author,title,journal,year,impact,doi,status,email) Values (?,?,?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  if (req.body.pauthor !== undefined) {
    for (let i = 0; i < req.body.pauthor.length; i++) {
      let data2 = [req.body.pauthor[i], req.body.ptitle[i], req.body.p_country[i], req.body.p_number[i], req.body.pyear_filed[i], req.body.pyear_published[i], req.body.pyear_issued[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO patents(pauthor,ptitle,p_country,p_number,pyear_filed,pyear_published,pyear_issued,email) Values (?,?,?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  if (req.body.bauthor !== undefined) {
    for (let i = 0; i < req.body.bauthor.length; i++) {
      let data2 = [req.body.bauthor[i], req.body.btitle[i], req.body.byear[i], req.body.bisbn[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO books(bauthor,btitle,byear,bisbn,email) Values (?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }

  if (req.body.bc_author !== undefined) {
    for (let i = 0; i < req.body.bc_author.length; i++) {
      let data2 = [req.body.bc_author[i], req.body.bc_title[i], req.body.bc_year[i], req.body.bc_isbn[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO book_chapters(bc_author,bc_title,bc_year,bc_isbn,email) Values (?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  db.query('INSERT INTO googlelink(email,googlelink) Values (?,?)', [req.session.currUser.email, req.body.google_link], (err, result) => {
    if (err) throw err;
  });
  res.redirect("/formpages/5");
});


app.get("/formpages/5", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;

  // Delete existing data from all tables where email matches
  db.query("DELETE FROM membership WHERE email = ?", [userEmail], (err) => {
    if (err) {
      console.error("Error deleting publications:", err);
      return res.status(500).send("Internal Server Error");
    }
    db.query("DELETE FROM training WHERE email = ?", [userEmail], (err) => {
      if (err) {
        console.error("Error deleting top10publications:", err);
        return res.status(500).send("Internal Server Error");
      }
      db.query("DELETE FROM awards WHERE email = ?", [userEmail], (err) => {
        if (err) {
          console.error("Error deleting patents:", err);
          return res.status(500).send("Internal Server Error");
        }
        db.query("DELETE FROM sponsoredprojects WHERE email = ?", [userEmail], (err) => {
          if (err) {
            console.error("Error deleting books:", err);
            return res.status(500).send("Internal Server Error");
          }
          db.query("DELETE FROM consultancyprojects WHERE email = ?", [userEmail], (err) => {
            if (err) {
              console.error("Error deleting book_chapters:", err);
              return res.status(500).send("Internal Server Error");
            }

            // Once deletion is complete, retrieve profile data
            db.query(
              "SELECT first_name, last_name FROM profile WHERE email = ?",
              [userEmail],
              (err, rows) => {
                if (err) {
                  console.error("Error retrieving profile data:", err);
                  return res.status(500).send("Internal Server Error");
                }
                if (rows.length === 0) {
                  return res.status(404).send("Profile not found");
                }
                const { first_name, last_name } = rows[0];
                res.render("formpages/5th.ejs", {
                  firstname: first_name,
                  lastname: last_name,
                });
              }
            );
          });
        });
      });
    });
  });
});

app.post("/formpages/5", isAuthenticated, (req, res) => {
  if (req.body.professional_society_name !== undefined) {
    for (let i = 0; i < req.body.professional_society_name.length; i++) {
      let data2 = [req.body.professional_society_name[i], req.body.membership_status[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO membership(professional_society_name, membership_status,email) Values (?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  if (req.body.training_type !== undefined) {
    for (let i = 0; i < req.body.training_type.length; i++) {
      let data2 = [req.body.training_type[i], req.body.training_organization[i], req.body.training_year[i], req.body.training_duration[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO training(training_type, training_organization, training_year,training_duration,email) Values (?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  if (req.body.award_name !== undefined) {
    for (let i = 0; i < req.body.award_name.length; i++) {
      let data2 = [req.body.award_name[i], req.body.awarded_by[i], req.body.award_year[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO awards(award_name, awarded_by, award_year,email) Values (?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  if (req.body.sponsoring_agency !== undefined) {
    for (let i = 0; i < req.body.sponsoring_agency.length; i++) {
      let data2 = [req.body.sponsoring_agency[i], req.body.project_title[i], req.body.sanctioned_amount[i], req.body.project_period[i], req.body.project_role[i], req.body.project_status[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO sponsoredprojects(sponsoring_agency, project_title, sanctioned_amount, project_period, project_role, project_status,email) Values (?,?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  if (req.body.consultancy_organization !== undefined) {
    for (let i = 0; i < req.body.consultancy_organization.length; i++) {
      let data2 = [req.body.consultancy_organization[i], req.body.consultancy_title[i], req.body.grant_amount[i], req.body.consultancy_period[i], req.body.consultancy_role[i], req.body.consultancy_status[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO consultancyprojects(consultancy_organization, consultancy_title, grant_amount,consultancy_period,consultancy_role,consultancy_status,email) Values (?,?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  res.redirect("/formpages/6");
});

app.get("/formpages/6", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;

  // Delete existing data from all tables where email matches
  db.query("DELETE FROM phd_thesis WHERE email = ?", [userEmail], (err) => {
    if (err) {
      console.error("Error deleting publications:", err);
      return res.status(500).send("Internal Server Error");
    }
    db.query("DELETE FROM pg_thesis WHERE email = ?", [userEmail], (err) => {
      if (err) {
        console.error("Error deleting top10publications:", err);
        return res.status(500).send("Internal Server Error");
      }
      db.query("DELETE FROM ug_thesis WHERE email = ?", [userEmail], (err) => {
        if (err) {
          console.error("Error deleting patents:", err);
          return res.status(500).send("Internal Server Error");
        }

        // Once deletion is complete, retrieve profile data
        db.query(
          "SELECT first_name, last_name FROM profile WHERE email = ?",
          [userEmail],
          (err, rows) => {
            if (err) {
              console.error("Error retrieving profile data:", err);
              return res.status(500).send("Internal Server Error");
            }
            if (rows.length === 0) {
              return res.status(404).send("Profile not found");
            }
            const { first_name, last_name } = rows[0];
            res.render("formpages/6th.ejs", {
              firstname: first_name,
              lastname: last_name,
            });
          }
        );
      });
    });
  });
});

app.post("/formpages/6", isAuthenticated, (req, res) => {
  if (req.body.phd_name !== undefined) {
    for (let i = 0; i < req.body.phd_name.length; i++) {
      let data2 = [req.body.phd_name[i], req.body.phd_title[i], req.body.phd_role[i], req.body.phd_status[i], req.body.phd_year[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO phd_thesis(phd_name, phd_title,phd_role,phd_status,phd_year,email) Values (?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  if (req.body.pg_name !== undefined) {
    for (let i = 0; i < req.body.pg_name.length; i++) {
      let data2 = [req.body.pg_name[i], req.body.pg_title[i], req.body.pg_role[i], req.body.pg_status[i], req.body.pg_year[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO pg_thesis(pg_name, pg_title,pg_role,pg_status,pg_year,email) Values (?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  if (req.body.ug_name !== undefined) {
    for (let i = 0; i < req.body.ug_name.length; i++) {
      let data2 = [req.body.ug_name[i], req.body.ug_title[i], req.body.ug_role[i], req.body.ug_status[i], req.body.ug_year[i]];
      data2.push(req.session.currUser.email);
      db.query('INSERT INTO ug_thesis(ug_name, ug_title,ug_role,ug_status,ug_year,email) Values (?,?,?,?,?,?)', data2, (err, result) => {
        if (err) throw err;
      });
    }
  }
  res.redirect("/formpages/7");
});

app.get("/formpages/7", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;
  db.query(
    "SELECT first_name, last_name FROM profile WHERE email = ?",
    [userEmail],
    (err, rows) => {
      if (err) {
        console.error("Error retrieving profile data:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (rows.length === 0) {
        return res.status(404).send("Profile not found");
      }
      const { first_name, last_name } = rows[0];
      res.render("formpages/7th.ejs", {
        firstname: first_name,
        lastname: last_name,
      });
    }
  );
});

app.post("/formpages/7", isAuthenticated, (req, res) => {
  res.redirect("/formpages/8");
});

app.get("/formpages/8", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;
  db.query(
    "SELECT first_name, last_name FROM profile WHERE email = ?",
    [userEmail],
    (err, rows) => {
      if (err) {
        console.error("Error retrieving profile data:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (rows.length === 0) {
        return res.status(404).send("Profile not found");
      }
      const { first_name, last_name } = rows[0];
      res.render("formpages/8th.ejs", {
        firstname: first_name,
        lastname: last_name,
      });
    }
  );
});

app.post("/formpages/8", isAuthenticated, (req, res) => {
  res.redirect("/formpages/9");
});

app.get("/formpages/9", isAuthenticated, (req, res) => {
  const userEmail = req.session.currUser.email;
  db.query(
    "SELECT first_name, last_name FROM profile WHERE email = ?",
    [userEmail],
    (err, rows) => {
      if (err) {
        console.error("Error retrieving profile data:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (rows.length === 0) {
        return res.status(404).send("Profile not found");
      }
      const { first_name, last_name } = rows[0];
      res.render("formpages/9th.ejs", {
        firstname: first_name,
        lastname: last_name,
      });
    }
  );
});

app.post("/formpages/9", isAuthenticated, (req, res) => {
  res.redirect("/formpages/10");
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.redirect("/");
    }
    res.redirect("/login");
  });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
