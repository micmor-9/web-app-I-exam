'use strict';

const express = require('express');

// MIDDLEWARES
const morgan = require('morgan'); // Middleware for logging messages
const cors = require('cors'); // Middleware to enable CORS support
const {check, validationResult} = require('express-validator'); // Middleware for validation

// DAO and Database Init
const course_dao = require("./models/course_dao");
const user_dao = require("./models/user_dao");
const study_plan_dao = require("./models/study_plan_dao");

// Passport-related imports
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");

// init express
const app = new express();
const port = 3001;

// set up the middlewares
app.use(morgan("dev"));
app.use(express.json()); // for parsing json request body

// set up and enable cors
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

/*** AUTHENTICATION SETUP ***/

// Passport: set up local strategy
passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    const user = await user_dao.getUser(username, password);
    if (!user) return cb(null, false, "Incorrect username or password.");
    return cb(null, user);
  })
);

// Save user info into the session
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// Delete user info from the session
passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

// Function to check if the request is authenticated
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

app.use(
  session({
    secret: "44c5e72e75cefe051c30cbbc411416ef",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));

/*** APIs ***/

// GET /api/courses - Get the list of all the courses
app.get("/api/courses", (req, res) => {
  course_dao
    .listCourses()
    .then((courses) => res.json(courses))
    .catch((err) => res.status(500).json(err));
});

/* // GET /api/study-plan - Get the single study plan
app.get('/api/study-plan/:id', (req, res) => {
  study_plan_dao.getStudyPlan(req.params.id)
  .then(study_plan => res.json(study_plan))
  .catch((err) => res.status(err.statusCode).json(err));
}) */

// POST /api/study-plan/create - Create a new study plan
app.post(
  "/api/study-plan/",
  isLoggedIn,
  check("list").isArray(),
  check("option").isInt({ min: 0, max: 1 }),
  check("credits").isInt({ min: 20, max: 80 }),
  check("student").isInt(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    study_plan_dao
      .createStudyPlan(
        req.body.list,
        req.body.option,
        req.body.credits,
        req.body.studentId
      )
      .then(() => res.status(201).end())
      .catch((err) => res.status(err.statusCode).json(err));
  }
);

/************/

/*** AUTHENTICATION APIs ***/

app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current
app.get("/api/sessions/current", isLoggedIn, (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

// DELETE /api/session/current
app.delete("/api/sessions/current", isLoggedIn, (req, res) => {
  req.logout(() => {
    res.end();
  });
});

/************/

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});