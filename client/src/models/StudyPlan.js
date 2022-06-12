"use strict";

class StudyPlan {
  static PART_TIME = 0;
  static FULL_TIME = 1;

  /**
   * Creates a new instance of StudyPlan
   * @param {number} option Specifies if the study is part-time or full-time (PART_TIME|FULL_TIME)
   * @param {number} credits Study Plan total number of credits
   * @param {Student} student Student associated with the study plan
   * @param {Course[]} courses Courses associated with the study plan
   */
  constructor(option, credits, student, courses = []) {
    this.option = option;
    this.credits = credits;
    this.student = student;
    this.courses = courses;
  }

  /**
   * Sets the courses that are inserted into the study plan
   * @param {Course[]} courses List of courses that are inserted into the study plan
   */
  setCourses(courses) {
    this.courses = courses;
  }

  /**
   * Add a course to the study plan's courses collection
   * @param {Course} course The course to add to the courses collection
   */
  addCourse(course) {
    this.courses.push(course);
  }

  /**
   * Remove a course to the study plan's courses collection
   * @param {Course} course The course to remove to the courses collection
   */
  removeCourse(course) {
    this.courses = this.courses.filter((c) => c.id !== course.id);
  }
}

module.exports = StudyPlan;
