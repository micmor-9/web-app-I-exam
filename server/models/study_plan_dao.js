"use strict";
/* Data Access Object (DAO) module for accessing Courses */

const sqlite = require("sqlite3");
const course_dao = require("./course_dao");
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

exports.getStudyPlan = (user) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT option FROM student WHERE id = ?";
    db.get(sql, [user.id], (err, row) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const option = row.option;
        if (option === null) {
          resolve(404);
        }
        const sql =
          "SELECT code FROM course, study_plan_courses WHERE study_plan_courses.userId = ? AND study_plan_courses.courseCode = course.code";
        db.all(sql, [user.id], (err, rows) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            const courses_codes = rows.map((course) => course.code);
            course_dao
              .listCourses()
              .then((courses) => {
                const study_plan_courses = courses.filter((c) =>
                  courses_codes.includes(c.code)
                );
                const credits = study_plan_courses
                  .map((course) => course.credits)
                  .reduce((prev, curr) => prev + curr, 0);
                const study_plan = new StudyPlan(
                  option,
                  credits,
                  user.id,
                  study_plan_courses
                );
                resolve(study_plan);
              })
              .catch((err) => {
                console.error(err);
                reject(err);
              });
          }
        });
      }
    });
  });
};
