import { useState } from "react";
import {
  Badge,
  Card,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function CoursesList(props) {
  return (
    <Container fluid="xxl">
      {/* <Row xs={1} md={1} lg={1} xl={1}> */}
      {props.list.map((course, index) => {
        return (
          <CoursesListItem key={course.code} index={index} course={course} />
        );
      })}
      {/* </Row> */}
    </Container>
  );
}

function CoursesListItem({ index, course }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      key={index}
      className="courses-list-item"
      onClick={() => toggleExpanded()}
    >
      <Card.Body>
        <CourseCode index={index} code={course.code} />
        <CourseName name={course.name} />
        <CourseCredits credits={course.credits} />
        <CourseInfo course={course} />
        {expanded && <CourseDescription course={course} />}
      </Card.Body>
    </Card>
  );
}

function CourseCode({ index, code }) {
  return (
    <div>
      <OverlayTrigger
        key={`course-code-${index}`}
        placement={`left`}
        overlay={<Tooltip id={`tooltip-course-code`}>Course Code</Tooltip>}
      >
        <Badge className="course-code-badge me-3">{code}</Badge>
      </OverlayTrigger>
    </div>
  );
}

function CourseName({ name }) {
  return <Card.Title>{name}</Card.Title>;
}

function CourseCredits({ credits }) {
  return (
    <Card.Subtitle className="mb-2 text-muted">{credits} CFU</Card.Subtitle>
  );
}

function CourseInfo({ course }) {
  return (
    <Card.Text
      as="div"
      key={`course-info-${course.code}`}
      className="course-info"
    >
      {course.maxStudents ? (
        <div className="course-students">
          <i className="bi bi-diverson-check-fill"></i> {course.maxStudents}{" "}
          Students Enrolled
        </div>
      ) : null}
      {course.maxStudents ? (
        <div className="course-max-students">
          <i className="bi bi-diveople-fill"></i> {course.maxStudents} Max
          Students
        </div>
      ) : null}
    </Card.Text>
  );
}

function CourseDescription({ course }) {
  return (
    <Card.Text
      as="div"
      key={`course-description-${course.code}`}
      className="course-description"
    >
      <p>Preliminary Course: {course.preliminaryCourse}</p>
      <p>
        Incompatible{" "}
        {course.incompatibleCourses.length <= 1 ? "Course" : "Courses"}:{" "}
        {course.incompatibleCourses.join(", ")}
      </p>
    </Card.Text>
  );
}

export default CoursesList;
