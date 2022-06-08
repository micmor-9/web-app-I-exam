import { Container, Row, Col, Button } from "react-bootstrap";
import CoursesList from "./CoursesList";
import LoginForm from "./LoginForm";
import StudyPlan from "./StudyPlan";
import StudyPlanCreateForm from "./StudyPlanCreateForm";

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
      <Row id="content">
        <LoginForm />
      </Row>
    </Container>
  );
}

function HomepageRoute(props) {
  return (
    <Container fluid="xxl" className="App">
      <Row id="content">
        <Row id="studyPlanPanel">
          <StudyPlan studyPlan={props.studyPlan} />
        </Row>
        <Row id="coursesListPanel">
          <h3 className="courses-list-header">Courses List</h3>
          <CoursesList list={props.coursesList} />
        </Row>
      </Row>
    </Container>
  );
}

function StudyPlanCreateRoute(props) {
  return (
    <Container fluid="xxl" className="App">
      <Row id="content">
        <Row id="studyPlanCreateForm">
          <StudyPlanCreateForm />
        </Row>
      </Row>
    </Container>
  );
}

export { DefaultRoute, LoginRoute, HomepageRoute, StudyPlanCreateRoute };
