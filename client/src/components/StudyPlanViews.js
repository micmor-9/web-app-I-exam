import { Container, Row, Col, Button } from "react-bootstrap";
import CoursesList from "./CoursesList";
import { LoginForm } from "./AuthComponents";
import { StudyPlan } from "./StudyPlan";

function DefaultRoute() {
  return (
    <Container fluid="xxl" className="App">
      <h1>No data here...</h1>
      <h2>This is not the route you are looking for!</h2>
    </Container>
  );
}

function LoginRoute(props) {
  return (
    <Container fluid="xxl" className="App login-form-container">
      <Row id="content" className="justify-content-center">
        <LoginForm login={props.login} />
      </Row>
    </Container>
  );
}

function HomepageRoute(props) {
  return (
    <Container fluid="xxl" className="App">
      <Row id="content" className="justify-content-center">
        {props.loggedIn && (
          <Row id="studyPlanPanel">
            <StudyPlan
              mode={props.mode}
              setMode={props.setMode}
              studyPlanList={props.studyPlanList}
              setStudyPlanList={props.setStudyPlanList}
              removeCourseFromStudyPlan={props.removeCourseFromStudyPlan}
              saveStudyPlan={props.saveStudyPlan}
            />
          </Row>
        )}
        <Row id="coursesListPanel">
          <CoursesList
            list={props.coursesList}
            mode={props.mode}
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
