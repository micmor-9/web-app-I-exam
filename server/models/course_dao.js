"use strict";
/* Data Access Object (DAO) module for accessing Courses */

const sqlite = require("sqlite3");
const Course = require("./Course");

const db = new sqlite.Database("./db.sqlite", (err) => {
  if (err) throw err;
});

exports.listCourses = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM incompatible_courses", [], (err, rows) => {
      if (err) reject(false);
      else {
        const incompatible_courses = rows.map((course) => ({
          courseCode: course.courseCode,
          incompatibleWith: course.incompatibleWith,
        }));
        db.all("SELECT * FROM course ORDER BY name ASC", [], (err, rows) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          } else {
            const courses = rows.map((row) => {
              const incompatible = incompatible_courses
                .filter((code) => code.courseCode === row.code)
                .map((course) => course.incompatibleWith);
              const course = new Course(
                row.code,
                row.name,
                row.credits,
                row.maxStudents,
                row.preparatoryCourse,
                incompatible
              );
              return course;
            });
            resolve(courses);
          }
        });
      }
    });
  });
};

exports.getIncompatibleCoursesByCourseCode = (code) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT incompatibleWith FROM incompatible_courses WHERE courseCode = ?";
    db.all(sql, [code], (err, rows) => {
      if (err) reject(err);
      else {
        const incompatibleCourses = rows.map((row) => row.incompatibleWith);
        resolve(incompatibleCourses);
      }
    });
  });
};
