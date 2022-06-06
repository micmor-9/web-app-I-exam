'use strict';

const express = require('express');

// MIDDLEWARES
const morgan = require('morgan'); // Middleware for logging messages
const cors = require('cors'); // Middleware to enable CORS support
const {check, validationResult} = require('express-validator'); // Middleware for validation

// DAO and Database Init
const course_dao = require('./models/course_dao');
const study_plan_dao = require('./models/study_plan_dao');
//const db = require('./config/database/db');
//db.init();

// init express
const app = new express();
const port = 3001;

// set up the middlewares
app.use(morgan('dev'));
app.use(express.json()); // for parsing json request body
// set up and enable cors
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

/*** APIs ***/

// GET /api/courses - Get the list of all the courses
app.get('/api/courses', (req, res) => {
  course_dao.listCourses()
  .then(courses => res.json(courses))
  .catch((err) => res.status(500).json(err));
})

/************/

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});