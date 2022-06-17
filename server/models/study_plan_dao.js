"use strict";
/* Data Access Object (DAO) module for accessing Courses */

const sqlite = require("sqlite3");
const course_dao = require("./course_dao");
const StudyPlan = require("./StudyPlan");

const db = new sqlite.Database("./db.sqlite", (err) => {
  if (err) throw err;
});

// Get the study plan of the current user
exports.getStudyPlan = (user) => {
  return new Promise((resolve, reject) => {
    // Check if an option has been set 
    const sql = "SELECT option FROM student WHERE id = ?";
    db.get(sql, [user.id], (err, row) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const option = row.option;
        // If not, resolve 404
        if (option === null) {
          resolve(404);
        }
        // If yes, select all the course codes associated with the study plan
        const sql =
          "SELECT code FROM course, study_plan_courses WHERE study_plan_courses.userId = ? AND study_plan_courses.courseCode = course.code";
        db.all(sql, [user.id], (err, rows) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            const courses_codes = rows.map((course) => course.code);
            // Then get the full objects of courses through a filtered listCourses()
            course_dao
              .listCourses()
              .then((courses) => {
                const study_plan_courses = courses.filter((c) =>
                  courses_codes.includes(c.code)
                );
                const credits = study_plan_courses
                  .map((course) => course.credits)
                  .reduce((prev, curr) => prev + curr, 0);
                // Finally create the study plan object to resolve
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

// Create a new study plan associated with the current user
exports.createStudyPlan = (list, option, credits, user) => {
  const parsed_list = JSON.parse(list).map((c) => c.code);
  return new Promise((resolve, reject) => {
    // Retrieve the most update version of the selected courses from the database
    course_dao.listCourses().then((courses) => {
      const study_plan_list = courses.filter((c) =>
        parsed_list.includes(c.code)
      );
      const study_plan = new StudyPlan(option, credits, user, study_plan_list);
      if (study_plan.checkConsistency()) {
        // Update first the option field of the student
        const sql = "UPDATE student SET option = ? WHERE id = ?";
        db.run(sql, [option, user.id], function (err) {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            // Then create an array of promises to insert every single course into the study_plan_courses table
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
            // Consume all the promises in parallel
            Promise.all(promises)
              .then(() => {
                const promises = study_plan.courses.map((course) => {
                  // Then again create an array of promises to update the enrolledStudents info of all the courses included in the new study plan.
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
                // Consume the promises and resolve
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
  });
};

// Edit the study plan associated with the current user
exports.editStudyPlan = (list, option, credits, user) => {
  const parsed_list = JSON.parse(list).map((c) => c.code);
  // Retrieve the most update version of the selected courses from the database
  return new Promise((resolve, reject) => {
    course_dao.listCourses().then((courses) => {
      const study_plan_list = courses.filter((c) =>
        parsed_list.includes(c.code)
      );
      // Create the object of the updated study plan
      const updated_study_plan = new StudyPlan(
        option,
        credits,
        user,
        study_plan_list
      );
      // Get the current study plan
      this.getStudyPlan(user).then((current_study_plan) => {
        // If it doesn't exist, reject 404
        if (current_study_plan === 404) {
          reject(404);
        }
        // Check if the new study plan is consistent with all the constraints
        if (updated_study_plan.checkConsistency()) {
          // Get the courses to remove from the study plan and create an array of promises
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

          // Get the courses to add to the study plan and create an array of promises
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

          // Consume the promises in the to_remove array
          Promise.all(to_remove)
            .then(() => {
              // Consume the promises in the to_add array
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
  });
};

// Delete the study plan associated with the current user
exports.deleteStudyPlan = (user) => {
  return new Promise((resolve, reject) => {
    // Get the study plan associated with the current user
    this.getStudyPlan(user)
      .then((study_plan) => {
        // Set the option to NULL
        const sql = "UPDATE student SET option = NULL WHERE id = ?";
        db.run(sql, [user.id], (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            // Create an array of promises to update the enrolledStudents of the courses included into the study plan and to delete the course from the study_plan_courses table
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

            // Consume the promises and resolve
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