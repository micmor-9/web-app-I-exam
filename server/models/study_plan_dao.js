"use strict";
/* Data Access Object (DAO) module for accessing Courses */

const sqlite = require("sqlite3");
const Course = require("./Course");
const StudyPlan = require("./StudyPlan");

const db = new sqlite.Database("./db.sqlite", (err) => {
  if (err) throw err;
});

exports.createStudyPlan = (list, option, credits, studentId) => {
  const study_plan = new StudyPlan(
    option,
    credits,
    studentId,
    JSON.parse(list)
  );

  console.log(study_plan);

  return new Promise((resolve, reject) => {
    if (study_plan.checkConsistency()) {
      const sql = "UPDATE student SET option = ? WHERE id = ?";
      db.run(sql, [option, studentId], function (err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const promises = study_plan.courses.map((course) => {
            return new Promise((resolve, reject) => {
              const sql =
                "INSERT INTO study_plan_courses(userId, courseCode) VALUES (?, ?)";
              db.run(sql, [studentId, course.code], (err) => {
                if (err) {
                  console.error(err);
                  reject(err);
                } else {
                  resolve();
                }
              });
            });
          });
          Promise.all(promises)
            .then(() => {
              const promises = study_plan.courses.map((course) => {
                return new Promise((resolve, reject) => {
                  const sql =
                    "UPDATE course SET enrolledStudents = enrolledStudents + 1 WHERE code = ?";
                  db.run(sql, [course.code], (err) => {
                    if (err) {
                      console.error(err);
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
                });
              });
              Promise.all(promises)
                .then(() => {
                  resolve(201);
                })
                .catch((err) => reject(err));
            })
            .catch((err) => {
              console.error(err);
              reject(err);
            });
        }
      });
      resolve();
    } else {
      reject();
    }
  });
};
