import { Container, Row, Col, Button } from "react-bootstrap";
import CoursesList from "./CoursesList";
import { LoginForm } from "./AuthComponents";
import { StudyPlan } from "./StudyPlanComponents/StudyPlan";

// Route rendered when the path is not recognized as a valid route
function DefaultRoute() {
  return (
    <Container fluid="xxl" className="App">
      <h1>No data here...</h1>
      <h2>This is not the route you are looking for!</h2>
    </Container>
  );
}

// View displayed in the Login Route
function LoginRoute(props) {
  return (
    <Container fluid="xxl" className="App login-form-container">
      <Row id="content" className="justify-content-center">
        <LoginForm login={props.login} />
      </Row>
    </Container>
  );
}

// View displayed in the Homepage Route
function HomepageRoute(props) {
  return (
    <Container fluid="xxl" className="App">
      <Row id="content" className="justify-content-center">
        {
          // If the user is logged in, show the Study Plan Component to display the study plan section
          props.loggedIn && (
            <Row id="studyPlanPanel">
              <StudyPlan
                mode={props.mode}
                setMode={props.setMode}
                studyPlan={props.studyPlan}
                studyPlanList={props.studyPlanList}
                setStudyPlanList={props.setStudyPlanList}
                removeCourseFromStudyPlan={props.removeCourseFromStudyPlan}
                saveStudyPlan={props.saveStudyPlan}
                deleteStudyPlan={props.deleteStudyPlan}
              />
            </Row>
          )
        }
        <Row id="coursesListPanel">
          <CoursesList
            list={props.coursesList}
            mode={props.mode}
            studyPlan={props.studyPlan}
            studyPlanList={props.studyPlanList}
            addCourseToStudyPlan={props.addCourseToStudyPlan}
            removeCourseFromStudyPlan={props.removeCourseFromStudyPlan}
          />
        </Row>
      </Row>
    </Container>
  );
}

export { DefaultRoute, LoginRoute, HomepageRoute };
