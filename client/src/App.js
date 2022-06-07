import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { useEffect, useState } from "react";

// Routes handling is done with react-router and a set of Views defined in the StudyPlanViews component
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DefaultRoute, HomepageRoute } from "./components/StudyPlanViews";

import API from "./API";

function App() {
  const [coursesList, setCoursesList] = useState([]);
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
      <Routes>
        <Route path="*" element={<DefaultRoute />} />
        <Route path="/" element={<HomepageRoute coursesList={coursesList} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
