"use strict";
/* Data Access Object (DAO) module for accessing Courses */

const sqlite = require("sqlite3");
const Course = require("./Course");

/* const db = new sqlite.Database("../study-plan.sqlite", (err) => {
  if (err) throw err;
});

exports.listCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM course";
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        const courses = rows.map((course) =>
          new Course(
            course.code,
            course.name,
            course.credits,
            course.maxStudents,
            course.preparatoryCourse
          ).setIncompatibleCourses(
            getIncompatibleCoursesByCourseCode(course.code)
          )
        );
        resolve(courses);
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
        const incompatibleCourses = rows.reduce(
          (list, code) => list.push(code),
          []
        );
        resolve(incompatibleCourses);
      }
    });
  });
}; */
