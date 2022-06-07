import { Container, Row, Col } from "react-bootstrap";
import NavBar from "./NavBar";
import CoursesList from "./CoursesList";

function DefaultRoute() {
  return (
    <Container fluid="xxl" className="App">
      <h1>No data here...</h1>
      <h2>This is not the route you are looking for!</h2>
    </Container>
  );
}

function HomepageRoute(props) {
  return (
    <Container fluid="xxl" className="App">
      <Row id="navbarRow">
        <NavBar />
      </Row>
      <Row id="mainRow">
        <h3>Courses List</h3>
        <CoursesList list={props.coursesList} />
      </Row>
    </Container>
  );
}

export { DefaultRoute, HomepageRoute };
