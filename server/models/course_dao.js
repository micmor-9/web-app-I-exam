"use strict";
/* Data Access Object (DAO) module for accessing Courses */

const sqlite = require("sqlite3");
const Course = require("./Course");

// Open DB
const db = new sqlite.Database("./db.sqlite", (err) => {
  if (err) throw err;
});

// Get the full list of Courses from the database
exports.listCourses = () => {
  return new Promise((resolve, reject) => {
    // First, get the complete list of incompatible courses
    db.all(
      "SELECT * FROM incompatible_courses, course WHERE incompatible_courses.incompatibleWith = course.code",
      [],
      (err, rows) => {
        if (err) reject(false);
        else {
          const incompatible_courses = rows.map((course) => ({
            courseCode: course.courseCode,
            incompatibleWith: course.incompatibleWith,
            incompatibleName: course.name,
          }));
          // Then, get the complete list of preparatory courses
          db.all(
            "SELECT t1.code, t1.preparatoryCourse, t2.name FROM course as t1, course as t2 WHERE t1.preparatoryCourse = t2.code",
            [],
            (err, rows) => {
              if (err) reject(false);
              else {
                const preparatory_courses = rows.map((course) => ({
                  code: course.code,
                  prepCode: course.preparatoryCourse,
                  prepName: course.name,
                }));
                // Finally, get the complete list of courses ordered aplhabetically
                db.all(
                  "SELECT * FROM course ORDER BY name ASC",
                  [],
                  (err, rows) => {
                    if (err) {
                      console.error(err);
                      reject(err);
                      return;
                    } else {
                      // Now, the complete list of courses is mapped with the preparatory course and the incompatible courses
                      const courses = rows.map((row) => {
                        const incompatible = incompatible_courses
                          .filter((code) => code.courseCode === row.code)
                          .map((course) => {
                            return {
                              code: course.incompatibleWith,
                              name: course.incompatibleName,
                            };
                          });
                        const preparatory = preparatory_courses
                          .filter((code) => code.code === row.code)
                          .map((course) => {
                            return {
                              code: course.prepCode,
                              name: course.prepName,
                            };
                          });
                        const course = new Course(
                          row.code,
                          row.name,
                          row.credits,
                          row.enrolledStudents,
                          row.maxStudents,
                          preparatory,
                          incompatible
                        );
                        return course;
                      });
                      // An array of Course objects (complete of all information regarding preparatory and incompatible courses) is resolved
                      resolve(courses);
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
};
