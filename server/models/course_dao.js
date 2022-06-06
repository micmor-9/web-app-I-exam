"use strict";
/* Data Access Object (DAO) module for accessing Courses */

const sqlite = require("sqlite3");
const Course = require("./Course");

const db = new sqlite.Database("./db.sqlite", (err) => {
  if (err) throw err;
});

exports.listCourses = () => {
  const getIncompatibleCourses = () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM incompatible_courses", [], (err, rows) => {
        if (err) reject(false);
        else resolve(rows);
      });
    });
  };
  getIncompatibleCourses().then((incompatibleCourses) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM course";
      db.all(sql, [], (err, rows) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const courses = rows.map(async (row) => {
            const course = new Course(
              row.code,
              row.name,
              row.credits,
              row.maxStudents,
              row.preparatoryCourse,
              incompatibleCourses
                .filter((code) => code === row.code)
                .map((course) => course.incompatibleWith)
            );
            return course;
          });
          resolve(courses);
        }
      });
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
