"use strict";
/* Data Access Object (DAO) module for accessing Courses */

const sqlite = require("sqlite3");
const Course = require("./Course");
const StudyPlan = require("./StudyPlan");

const db = new sqlite.Database("../study-plan.sqlite", (err) => {
  if (err) throw err;
});

exports.createStudyPlan = (list, option, credits, studentId) => {
  const study_plan = new StudyPlan(option, credits, studentId, list);

  return new Promise((resolve, reject) => {
    if (study_plan.checkConsistency()) {
    } else {
      reject({ status: 422 });
    }
  }); /* 

  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO study_plan(option, credits, studentId) VALUES (?, ?, ?)";
    db.run(sql, [option, credits, studentId], function (err) {
      if (err) reject(err);
      else {
        resolve(this.lastID);
      }
    });
  }); */
};
