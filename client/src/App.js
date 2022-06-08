import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";

// Routes handling is done with react-router and a set of Views defined in the StudyPlanViews component
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  DefaultRoute,
  LoginRoute,
  HomepageRoute,
  StudyPlanCreateRoute,
} from "./components/StudyPlanViews";

import API from "./API";

function App() {
  const [coursesList, setCoursesList] = useState([]);
  const [studyPlan, setStudyPlan] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  const getCoursesList = async () => {
    const list = await API.getAllCourses();
    setCoursesList(list);
  };

  useEffect(() => {
    getCoursesList();
  }, []);

  return (
    <BrowserRouter>
      <Container id="rootContainer" fluid="xxxl">
        <NavBar />
        <Routes>
          <Route path="*" element={<DefaultRoute />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route
            path="/"
            element={
              <HomepageRoute coursesList={coursesList} studyPlan={studyPlan} />
            }
          />
          <Route path="/study-plan/create" element={<StudyPlanCreateRoute />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
