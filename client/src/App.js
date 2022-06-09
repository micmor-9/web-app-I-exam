import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Import Dependencies
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import NavBar from "./components/NavBar";

// Routes handling is done with react-router and a set of Views defined in the StudyPlanViews component
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  DefaultRoute,
  LoginRoute,
  HomepageRoute,
  StudyPlanCreateRoute,
} from "./components/StudyPlanViews";

// Import API
import API from "./API";

function App() {
  const [coursesList, setCoursesList] = useState([]);
  const [studyPlan, setStudyPlan] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const getCoursesList = async () => {
    const list = await API.getAllCourses();
    setCoursesList(list);
  };

  useEffect(() => {
    const verifyAuthentication = () => {
      API.getUserInfo() // Gather user info from the session
        .then((user) => {
          setCurrentUser({ ...user });
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
  }, [loggedIn]);

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
              />
            }
          />
          <Route path="/study-plan/create" element={<StudyPlanCreateRoute />} />
        </Routes>
      </Container>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
