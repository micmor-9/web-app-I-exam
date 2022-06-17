import Course from "./models/Course";

const SERVER_URL = "http://localhost:3001";

// GET /api/courses API Call
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

// GET /api/study-plan API Call
const getStudyPlan = async () => {
  const response = await fetch(SERVER_URL + "/api/study-plan", {
    method: "GET",
    credentials: "include",
  });
  if (response.ok) {
    return response.json();
  } else throw response.json();
};

// POST /api/study-plan API Call
const createStudyPlan = async (list, option, credits) => {
  const response = await fetch(SERVER_URL + "/api/study-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      list: JSON.stringify(list),
      option: option,
      credits: credits,
    }),
  });
  if (response.ok) {
    return 201;
  } else throw response.json();
};

// PUT /api/study-plan API Call
const editStudyPlan = async (list, option, credits) => {
  const response = await fetch(SERVER_URL + "/api/study-plan", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      list: JSON.stringify(list),
      option: option,
      credits: credits,
    }),
  });
  if (response.ok) {
    return 200;
  } else throw response.json();
};

// DELETE /api/study-plan API Call
const deleteStudyPlan = async () => {
  const response = await fetch(SERVER_URL + "/api/study-plan", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) {
    return 204;
  } else throw response.json();
};

/*** AUTHENTICATION APIs ***/

// POST /api/sessions API Call
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

// GET /api/sessions/current API Call
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

// DELETE /api/sessions/current API Call
const logOut = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) return null;
};

const API = {
  getAllCourses,
  getStudyPlan,
  createStudyPlan,
  editStudyPlan,
  deleteStudyPlan,
  logIn,
  getUserInfo,
  logOut,
};
export default API;
