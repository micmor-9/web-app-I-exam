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
}

module.exports = StudyPlan;
