"use strict";
/* Data Access Object (DAO) module for accessing Courses */

const sqlite = require("sqlite3");
const Course = require("./Course");
const StudyPlan = require("./StudyPlan");

const db = new sqlite.Database("../study-plan.sqlite", (err) => {
  if (err) throw err;
});

exports.createStudyPlan = (option, credits, studentId) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO study_plan(option, credits, studentId) VALUES (?, ?, ?)";
    db.run(sql, [option, credits, studentId], function (err) {
      if (err) reject(err);
      else {
        resolve(this.lastID);
      }
    });
  });
};
