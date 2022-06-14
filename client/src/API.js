import Course from "./models/Course";

const SERVER_URL = "http://localhost:3001";

const getAllCourses = async () => {
  const response = await fetch(SERVER_URL + "/api/courses", {
    method: "GET",
  });
  const coursesJson = await response.json();
  if (response.ok) {
    return coursesJson.map(
      (course) =>
        new Course(
          course.code,
          course.name,
          course.credits,
          course.enrolledStudents,
          course.maxStudents,
          course.preparatoryCourse,
          course.incompatibleCourses
        )
    );
  } else throw coursesJson;
};

const createStudyPlan = async (list, option, credits, student) => {
  const response = await fetch(SERVER_URL + "/api/study-plan", {
    method: "POST",
    credentials: "include",
    body: {
      list: JSON.stringify(list),
      option: option,
      credits: credits,
      student: student,
    },
  });
  if (response.ok) {
    return { status: 201 };
  } else throw response.json();
};

/*** AUTHENTICATION APIs ***/

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + "/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    let errDetails = {
      message: await response.text(),
      status: response.status,
    };
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    credentials: "include",
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user; // an object with the error coming from the server
  }
};

const logOut = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) return null;
};

/******/

const API = { getAllCourses, logIn, getUserInfo, logOut, createStudyPlan };
export default API;
