import { useState } from "react";
import {
  Badge,
  Card,
  Container,
  OverlayTrigger,
  Tooltip,
  Pagination,
  Row,
} from "react-bootstrap";

function CoursesList(props) {
  const [pagination, setPagination] = useState(1);

  return (
    <Container fluid="xxl">
      <Row>
        {props.list.map((course, index) => {
          const page = Math.ceil((index + 1) / 5);
          return page === pagination ? (
            <CoursesListItem key={course.code} index={index} course={course} />
          ) : null;
        })}
      </Row>
      <CoursesListPagination
        pagination={pagination}
        setPagination={setPagination}
        list={props.list}
      />
    </Container>
  );
}

function CoursesListPagination({ pagination, setPagination, list }) {
  const paginationItems = [];
  const pages = list.length % 5 != 0 ? list.length / 5 + 1 : list.length / 5;
  paginationItems.push(
    <Pagination.Prev
      key="prev"
      onClick={() =>
        pagination - 1 >= 1 ? setPagination(pagination - 1) : null
      }
      disabled={pagination - 1 >= 1 ? false : true}
    />
  );
  for (let n = 1; n <= pages; n++) {
    paginationItems.push(
      <Pagination.Item
        key={n}
        active={n === pagination}
        onClick={() => setPagination(n)}
      >
        {n}
      </Pagination.Item>
    );
  }
  paginationItems.push(
    <Pagination.Next
      key="next"
      onClick={() =>
        pagination + 1 <= pages ? setPagination(pagination + 1) : null
      }
      disabled={pagination + 1 <= pages ? false : true}
    />
  );

  return (
    <Row className="courses-list-pagination">
      <Pagination className="justify-content-center">
        {paginationItems}
      </Pagination>
    </Row>
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
