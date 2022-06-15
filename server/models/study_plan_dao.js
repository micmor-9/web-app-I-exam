"use strict";
/* Data Access Object (DAO) module for accessing Courses */

const sqlite = require("sqlite3");
const course_dao = require("./course_dao");
const StudyPlan = require("./StudyPlan");

const db = new sqlite.Database("./db.sqlite", (err) => {
  if (err) throw err;
});

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

exports.createStudyPlan = (list, option, credits, user) => {
  const study_plan = new StudyPlan(option, credits, user, JSON.parse(list));

  return new Promise((resolve, reject) => {
    if (study_plan.checkConsistency()) {
      const sql = "UPDATE student SET option = ? WHERE id = ?";
      db.run(sql, [option, user.id], function (err) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const promises = study_plan.courses.map((course) => {
            return new Promise((resolve, reject) => {
              const sql =
                "INSERT INTO study_plan_courses(userId, courseCode) VALUES (?, ?)";
              db.run(sql, [user.id, course.code], (err) => {
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
      reject(422);
    }
  });
};

exports.editStudyPlan = (list, option, credits, user) => {
  const updated_study_plan = new StudyPlan(
    option,
    credits,
    user,
    JSON.parse(list)
  );

  return new Promise((resolve, reject) => {
    this.getStudyPlan(user).then((current_study_plan) => {
      if (current_study_plan === 404) {
        reject(404);
      }
      if (updated_study_plan.checkConsistency()) {
        const to_remove = current_study_plan.courses
          .filter(
            (course) =>
              !updated_study_plan.courses
                .map((c) => c.code)
                .includes(course.code)
          )
          .map((course) => {
            return new Promise((resolve, reject) => {
              const sql =
                "UPDATE course SET enrolledStudents = enrolledStudents - 1 WHERE code = ?";
              db.run(sql, [course.code], (err) => {
                if (err) {
                  console.error(err);
                  reject(err);
                } else {
                  const sql =
                    "DELETE FROM study_plan_courses WHERE userId = ? AND courseCode = ?";
                  db.run(sql, [user.id, course.code], (err) => {
                    if (err) {
                      console.error(err);
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
                }
              });
            });
          });

        const to_add = updated_study_plan.courses
          .filter(
            (course) =>
              !current_study_plan.courses
                .map((c) => c.code)
                .includes(course.code)
          )
          .map((course) => {
            return new Promise((resolve, reject) => {
              const sql =
                "UPDATE course SET enrolledStudents = enrolledStudents + 1 WHERE code = ?";
              db.run(sql, [course.code], (err) => {
                if (err) {
                  console.error(err);
                  reject(err);
                } else {
                  const sql =
                    "INSERT INTO study_plan_courses(userId, courseCode) VALUES (?, ?)";
                  db.run(sql, [user.id, course.code], (err) => {
                    if (err) {
                      console.error(err);
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
                }
              });
            });
          });

        Promise.all(to_remove)
          .then(() => {
            Promise.all(to_add)
              .then(() => {
                resolve(200);
              })
              .catch((err) => reject(err));
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          });
        resolve();
      } else {
        reject(422);
      }
    });
  });
};

exports.deleteStudyPlan = (user) => {
  return new Promise((resolve, reject) => {
    this.getStudyPlan(user)
      .then((study_plan) => {
        const sql = "UPDATE student SET option = NULL WHERE id = ?";
        db.run(sql, [user.id], (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            const promises = study_plan.courses.map((course) => {
              return new Promise((resolve, reject) => {
                const sql =
                  "UPDATE course SET enrolledStudents = enrolledStudents - 1 WHERE code = ?";
                db.run(sql, [course.code], (err) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    const sql =
                      "DELETE FROM study_plan_courses WHERE userId = ? AND courseCode = ?";
                    db.run(sql, [user.id, course.code], (err) => {
                      if (err) {
                        console.error(err);
                        reject(err);
                      } else {
                        resolve();
                      }
                    });
                  }
                });
              });
            });

            Promise.all(promises)
              .then(() => {
                resolve(204);
              })
              .catch((err) => {
                console.error(err);
                reject(err);
              });
            resolve();
          }
        });
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};