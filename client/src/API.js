import Course from "./models/Course";
import StudyPlan from "./models/StudyPlan";

const SERVER_URL = "http://localhost:3001";

const getAllCourses = async () => {
  const response = await fetch(SERVER_URL + "/api/courses");
  const coursesJson = await response.json();
  if (response.ok) {
    return coursesJson.map(
      (course) =>
        new Course(
          course.code,
          course.name,
          course.credits,
          course.maxStudents,
          course.preparatoryCourse,
          course.incompatibleCourses
        )
    );
  } else throw coursesJson;
};

/* const addExam = async (exam) => {
  // handling the laude
  if(exam.score === 31) {
    exam.score = 30;
    exam.laude = true;
  }
  else exam.laude = false;

  const response = await fetch(SERVER_URL + '/api/exams', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ code: exam.code, score: exam.score, laude: exam.laude, date:exam.date.format('YYYY-MM-DD') })
  });

  if(!response.ok){
    const errMessage = await response.json();
    throw errMessage;
  }
  else return null;
  // add other error handling
}

const deleteExam = async (courseCode) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/exams/${courseCode}`, {
      method: 'DELETE'
    });
    if(response.ok)
      return null;
    else {
      const errMessage = await response.json();
      throw errMessage;
    }
  } catch(err){
    throw new Error('Cannot communicate with the server');
    // and/or we can get some info from the 'err' object
  }
} */

const API = { getAllCourses };
export default API;
