// Import Boostrap and CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Import Dependencies and Components
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { Toast } from "./components/Toast";
import NavBar from "./components/NavBar";
import { StudyPlanMode } from "./components/StudyPlanComponents/StudyPlan";

// Routes handling is done with react-router and a set of Views defined in the StudyPlanViews component
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  DefaultRoute,
  LoginRoute,
  HomepageRoute,
} from "./components/StudyPlanViews";

// Import API
import API from "./API";

function App() {
  // currentUser: {Object} -> keeps information about current user
  const [currentUser, setCurrentUser] = useState({});

  // loggedIn: {bool} -> user is logged in or not
  const [loggedIn, setLoggedIn] = useState(false);

  // coursesList: {Course[]} -> list of all the courses available
  const [coursesList, setCoursesList] = useState([]);

  // studyPlan: {StudyPlan} -> study plan object retrieved from the database
  const [studyPlan, setStudyPlan] = useState();

  // studyPlanList: {Course[]} -> list of the courses beloging to the "local" study plan (which hasn't been saved permanently yet)
  const [studyPlanList, setStudyPlanList] = useState([]);

  // mode: {number} -> current mode of the application. Valid values are defined in the StudyPlan component
  const [mode, setMode] = useState(StudyPlanMode.SHOW);

  /*** API Calls ***/

  // Get courses list
  const getCoursesList = () => {
    API.getAllCourses()
      .then((list) => {
        setCoursesList(list);
      })
      .catch((err) => {
        console.error(err);
        setCoursesList();
        Toast({
          message: "Error: " + err.error,
          type: "error",
        });
      });
  };

  // Effect to check if the user has already authenticated
  useEffect(() => {
    const verifyAuthentication = () => {
      API.getUserInfo() // Gather user info from the session
        .then((user) => {
          setCurrentUser(user);
          setLoggedIn(true);
        })
        .catch((err) => {
          console.error(err.error);
          setCurrentUser();
          setLoggedIn(false);
        });
    };
    verifyAuthentication();
  }, []);

  // Effect to get the updated course list after every update to the study plan
  useEffect(() => {
    getCoursesList();
  }, [studyPlan, mode]);

  // Effect to get the updated study plan after login and after every mode change (after CREATE od EDIT)
  useEffect(() => {
    // Get study plan of the current user
    const getStudyPlan = () => {
      if (loggedIn) {
        API.getStudyPlan()
          .then((study_plan) => {
            if (study_plan !== 404) {
              setStudyPlan(study_plan);
              setStudyPlanList(study_plan.courses);
            } else {
              setStudyPlan();
              setStudyPlanList([]);
            }
          })
          .catch((err) => {
            console.error(err.error);
            setStudyPlan();
            setStudyPlanList([]);
            Toast({
              message: "Error: " + err.error,
              type: "error",
            });
          });
      }
    };
    getStudyPlan();
  }, [loggedIn, mode]);

  // Handler for the Login API
  const handleLogin = (credentials) => {
    return new Promise((resolve, reject) => {
      API.logIn(credentials)
        .then((user) => {
          setCurrentUser({ ...user });
          setLoggedIn(true);
          resolve(user);
        })
        .catch((err) => {
          console.error(err.error);
          reject(err);
        });
    });
  };

  // Handler for the Logout API
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
          Toast({
            message: "Error: " + err.error,
            type: "error",
          });
          reject(err);
        });
    });
  };

  // Handler called when adding a course to the study plan to check the constraints
  const beforeAddCourse = (course) => {
    let prepResult = true;
    let incompResult = true;
    let enrollResult = true;

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
          duration: 5000,
        });
        prepResult = false;
      }
    }

    // Check for incompatibleCourses
    if (course.incompatibleCourses.length > 0) {
      incompResult = true;
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
            duration: 5000,
          });
          incompResult = false;
        }
      });
    }

    // Check for maximum number of enrolledStudents
    if (course.maxStudents) {
      if (course.enrolledStudents === course.maxStudents) {
        if (studyPlan) {
          if (!studyPlan.courses.find((c) => c.code === course.code)) {
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
            enrollResult = false;
          }
        } else {
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
          enrollResult = false;
        }
      }
    }

    return prepResult && incompResult && enrollResult;
  };

  // Handler called when removing a course from the study plan to check the constraints
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
            from the Study Plan. It is the preparatory course of{" "}
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

  // Function to update the local Study Plan courses list when adding a course
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

  // Function to update the local Study Plan courses list when removing a course
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

  // Handler for the Create Study Plan and Edit Study Plan API
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
            Toast({
              message: "Study Plan created successfully!",
              type: "success",
            });
            resolve(result);
          })
          .catch((err) => {
            console.error(err);
            reject(err);
            Toast({
              message:
                "There was an error during the creation of the study plan!",
              type: "error",
            });
            setStudyPlanList([]);
            getCoursesList();
          });
      }

      if (mode === StudyPlanMode.EDIT) {
        API.editStudyPlan(list, option, credits, currentUser.id)
          .then((result) => {
            Toast({
              message: "Study Plan updated successfully!",
              type: "success",
            });
            resolve(result);
          })
          .catch((err) => {
            console.error(err);
            reject(err);
            Toast({
              message:
                "There was an error during the update of the study plan!",
              type: "error",
            });
            setStudyPlanList(studyPlan.courses);
            getCoursesList();
            setMode(StudyPlanMode.SHOW);
          });
      }
    });
  };

  // Handler for the Delete Study Plan API
  const deleteStudyPlan = () => {
    return new Promise((resolve, reject) => {
      API.deleteStudyPlan()
        .then((result) => {
          setStudyPlan();
          setStudyPlanList([]);
          resolve(result);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };

  // Render return
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
                loggedIn={loggedIn}
                coursesList={coursesList}
                studyPlan={studyPlan}
                studyPlanList={studyPlanList}
                setStudyPlanList={setStudyPlanList}
                mode={mode}
                setMode={setMode}
                addCourseToStudyPlan={addCourseToStudyPlan}
                removeCourseFromStudyPlan={removeCourseFromStudyPlan}
                saveStudyPlan={saveStudyPlan}
                deleteStudyPlan={deleteStudyPlan}
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
