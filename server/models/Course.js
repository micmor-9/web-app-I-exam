"use strict";

class Course {
  /**
   * Creates a new instance of Course
   * @param {string} code Course code
   * @param {string} name Course name
   * @param {number} credits Course credits
   * @param {number} maxStudents Course maximum students allowed
   * @param {string} preparatoryCourse Course code of the preparatory course needed for this one
   * @param {Course[]} incompatibleCourses List of courses that are incompatible with this course
   */
  constructor(
    code,
    name,
    credits,
    maxStudents = null,
    preparatoryCourse = null,
    incompatibleCourses = []
  ) {
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.maxStudents = maxStudents;
    this.preparatoryCourse = preparatoryCourse;
    this.incompatibleCourses = incompatibleCourses;
  }

  /**
   * Sets the courses that are incompatible with the current course
   * @param {Course[]} incompatibleCourses List of courses that are incompatible with this course
   */
  static setIncompatibleCourses(courses) {
    courses.forEach(() => {});
  }
}

module.exports = Course;
