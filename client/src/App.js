import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Import Dependencies
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { Toast } from "./components/Toast";
import NavBar from "./components/NavBar";

// Routes handling is done with react-router and a set of Views defined in the StudyPlanViews component
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  DefaultRoute,
  LoginRoute,
  HomepageRoute,
} from "./components/StudyPlanViews";

// Import API
import API from "./API";
import { StudyPlanMode } from "./components/StudyPlan";

function App() {
  const [coursesList, setCoursesList] = useState([]);
  const [studyPlan, setStudyPlan] = useState();
  const [studyPlanList, setStudyPlanList] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [mode, setMode] = useState(StudyPlanMode.SHOW);

  const getCoursesList = () => {
    API.getAllCourses()
      .then((list) => {
        setCoursesList(list);
      })
      .catch((err) => {
        console.error(err);
        setCoursesList();
        Toast({
          message: "Error: " + err,
          type: "error",
        });
      });
  };

  const getStudyPlan = () => {
    if (loggedIn) {
      API.getStudyPlan()
        .then((study_plan) => {})
        .catch((err) => {
          console.error(err);
          setStudyPlan();
          setStudyPlanList([]);
          Toast({
            message: "Error: " + err,
            type: "error",
          });
        });
    }
  };

  useEffect(() => {
    const verifyAuthentication = () => {
      API.getUserInfo() // Gather user info from the session
        .then((user) => {
          setCurrentUser(user);
          setLoggedIn(true);
        })
        .catch((err) => {
          console.error(err);
          setCurrentUser();
          setLoggedIn(false);
        });
    };
    verifyAuthentication();
  }, []);

  useEffect(() => {
    getCoursesList();
  }, []);

  const handleLogin = (credentials) => {
    return new Promise((resolve, reject) => {
      API.logIn(credentials)
        .then((user) => {
          setCurrentUser({ ...user });
          setLoggedIn(true);
          resolve(user);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };

  const handleLogout = () => {
    return new Promise((resolve, reject) => {
      API.logOut()
        .then(() => {
          setLoggedIn(false);
          setCurrentUser({});
          setStudyPlan();
          setStudyPlanList([]);
          setMode(StudyPlanMode.SHOW);
          resolve();
        })
        .catch((err) => {
          setLoggedIn(false);
          setCurrentUser({});
          setStudyPlan();
          reject(err);
        });
    });
  };

  //Mode: 0 ADD, 1 REMOVE
  const beforeAddCourse = (course) => {
    // Check for preparatoryCourse
    if (course.preparatoryCourse.length > 0) {
      const prepIndex = studyPlanList.find(
        (c) => c.code === course.preparatoryCourse[0].code
      );
      if (prepIndex === undefined) {
        const pc = coursesList.find(
          (pc) => pc.code === course.preparatoryCourse[0].code
        );
        Toast({
          message: (
            <>
              Can't add{" "}
              <b>
                {course.code} - {course.name}
              </b>{" "}
              to the Study Plan. You need its preparatory course{" "}
              <b>
                {pc.code} - {pc.name}
              </b>
            </>
          ),
          type: "warning",
          duration: 8000,
        });
        return false;
      }
      return true;
    }

    // Check for incompatibleCourses
    if (course.incompatibleCourses.length > 0) {
      let result = true;
      course.incompatibleCourses.forEach((incompatibleCourse, index) => {
        const incompIndex = studyPlanList.find(
          (c) => c.code === incompatibleCourse.code
        );
        if (incompIndex !== undefined) {
          const ic = coursesList.find(
            (ic) => ic.code === course.incompatibleCourses[index].code
          );
          Toast({
            message: (
              <>
                Can't add{" "}
                <b>
                  {course.code} - {course.name}
                </b>{" "}
                to the Study Plan. It is incompatible with{" "}
                <b>
                  {ic.code} - {ic.name}
                </b>
              </>
            ),
            type: "warning",
            duration: 8000,
          });
          result = false;
        }
      });
      return result;
    }

    // Check for maximum number of enrolledStudents
    if (course.maxStudents) {
      if (course.enrolledStudents === course.maxStudents) {
        Toast({
          message: (
            <>
              <b>
                {course.code} - {course.name}
              </b>{" "}
              has already reached the maximum number of students enrolled.
            </>
          ),
          type: "warning",
          duration: 5000,
        });
        return false;
      }
      return true;
    }

    return true;
  };

  const beforeRemoveCourse = (course) => {
    const isPreparatory = studyPlanList.find((c) => {
      if (c.preparatoryCourse.length > 0) {
        return c.preparatoryCourse[0].code === course.code;
      }
      return false;
    });

    if (isPreparatory === undefined) {
      return true;
    } else {
      Toast({
        message: (
          <>
            Can't remove{" "}
            <b>
              {course.code} - {course.name}
            </b>{" "}
            to the Study Plan. It is the preparatory course of{" "}
            <b>
              {isPreparatory.code} - {isPreparatory.name}
            </b>
          </>
        ),
        type: "warning",
        duration: 5000,
      });
      return false;
    }
  };

  const addCourseToStudyPlan = (course) => {
    if (beforeAddCourse(course)) {
      setStudyPlanList((studyPlanList) =>
        [...studyPlanList, course].sort((a, b) => a.name.localeCompare(b.name))
      );
      return true;
    } else {
      return false;
    }
  };

  const removeCourseFromStudyPlan = (course) => {
    if (beforeRemoveCourse(course)) {
      setStudyPlanList((studyPlanList) =>
        studyPlanList.filter((c) => c.code !== course.code)
      );
      return true;
    } else {
      return false;
    }
  };

  const saveStudyPlan = (
    mode,
    list,
    option = undefined,
    credits = undefined
  ) => {
    return new Promise((resolve, reject) => {
      if (mode === StudyPlanMode.CREATE) {
        API.createStudyPlan(list, option, credits, currentUser.id)
          .then((result) => {
            resolve(result);
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          });
      }

      if (mode === StudyPlanMode.EDIT) {
      }
    });
  };

  return (
    <BrowserRouter>
      <Container id="rootContainer" fluid="xxxl">
        <NavBar user={currentUser} loggedIn={loggedIn} logout={handleLogout} />
        <Routes>
          <Route path="*" element={<DefaultRoute />} />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate replace to="/" />
              ) : (
                <LoginRoute login={handleLogin} />
              )
            }
          />
          <Route
            path="/"
            element={
              <HomepageRoute
                coursesList={coursesList}
                studyPlan={studyPlan}
                loggedIn={loggedIn}
                mode={mode}
                setMode={setMode}
                addCourseToStudyPlan={addCourseToStudyPlan}
                removeCourseFromStudyPlan={removeCourseFromStudyPlan}
                studyPlanList={studyPlanList}
                setStudyPlanList={setStudyPlanList}
                saveStudyPlan={saveStudyPlan}
              />
            }
          />
        </Routes>
      </Container>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
