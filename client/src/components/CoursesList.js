import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { StudyPlanMode } from "./StudyPlan";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  OverlayTrigger,
  Tooltip,
  Pagination,
  Row,
} from "react-bootstrap";

function CoursesList(props) {
  const [pagination, setPagination] = useState(1);
  const elementsPerPage = 10;

  return (
    <Container fluid="xxl">
      <h3 className="courses-list-header">
        Courses List
        <OverlayTrigger
          key={"course-list-info"}
          placement={`top`}
          overlay={
            <Tooltip id={`tooltip-course-code`}>
              Click on a course to show its description
            </Tooltip>
          }
        >
          <i className="ms-3 bi bi-info-circle-fill"></i>
        </OverlayTrigger>
      </h3>
      <Row>
        {props.list.map((course, index) => {
          const page = Math.ceil((index + 1) / elementsPerPage);
          return page === pagination ? (
            <CoursesListItem
              key={course.code}
              index={index}
              course={course}
              mode={props.mode}
            />
          ) : null;
        })}
      </Row>
      <CoursesListPagination
        pagination={pagination}
        elementsPerPage={elementsPerPage}
        setPagination={setPagination}
        list={props.list}
      />
    </Container>
  );
}

function CoursesListPagination({
  pagination,
  elementsPerPage,
  setPagination,
  list,
}) {
  const paginationItems = [];
  const pages =
    list.length % elementsPerPage != 0
      ? list.length / elementsPerPage + 1
      : list.length / elementsPerPage;
  paginationItems.push(
    <Pagination.Prev
      key="prev"
      onClick={() =>
        pagination - 1 >= 1
          ? setPagination((pagination) => pagination - 1)
          : null
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
        pagination + 1 <= pages
          ? setPagination((pagination) => pagination + 1)
          : null
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

function CoursesListItem({ index, course, mode }) {
  const [expanded, setExpanded] = useState(false);
  const [added, setAdded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((expanded) => !expanded);
  };

  const columnsWidth = {
    code: { xs: 12, sm: 6, md: 2, lg: 1, xl: 1 },
    name: { xs: 12, sm: 6, md: 5, lg: 6, xl: 6 },
    credits: { xs: 12, sm: 4, md: 1, lg: 2, xl: 1 },
    info: {
      enrolledStudents: { xs: 6, sm: 4, md: 1, lg: 1, xl: 1 },
      maxStudents: { xs: 6, sm: 4, md: 2, lg: 1, xl: 1 },
    },
    actions: { xs: 12, sm: 12, md: 1, lg: 1, xl: 2 },
  };

  return (
    <Card
      key={index}
      className="courses-list-item"
      onClick={() => toggleExpanded()}
    >
      <Card.Body>
        <Row className="align-items-center" sm={12}>
          <CourseCode
            cols={columnsWidth.code}
            index={index}
            code={course.code}
          />
          <CourseName cols={columnsWidth.name} name={course.name} />
          <CourseCredits cols={columnsWidth.credits} credits={course.credits} />
          <CourseInfo cols={columnsWidth.info} course={course} index={index} />
          <CourseActions
            cols={columnsWidth.actions}
            mode={mode}
            added={added}
            setAdded={setAdded}
          />
          {expanded && <CourseDescription course={course} />}
        </Row>
      </Card.Body>
    </Card>
  );
}

function CourseCode({ cols, index, code }) {
  return (
    <Col
      xs={cols.xs}
      sm={cols.sm}
      md={cols.md}
      lg={cols.lg}
      xl={cols.xl}
      className="my-1 my-md-0 px-0"
    >
      <OverlayTrigger
        key={`course-code-${index}`}
        placement={`bottom`}
        overlay={<Tooltip id={`tooltip-course-code`}>Course Code</Tooltip>}
      >
        <Badge className="course-code-badge me-3">{code}</Badge>
      </OverlayTrigger>
    </Col>
  );
}

function CourseName({ cols, name }) {
  return (
    <Col
      xs={cols.xs}
      sm={cols.sm}
      md={cols.md}
      lg={cols.lg}
      xl={cols.xl}
      className="my-1 my-md-0 px-0"
    >
      <Card.Title className="mb-1">{name}</Card.Title>
    </Col>
  );
}

function CourseCredits({ cols, credits }) {
  return (
    <Col
      xs={cols.xs}
      sm={cols.sm}
      md={cols.md}
      lg={cols.lg}
      xl={cols.xl}
      className="my-1 my-md-0 px-0"
    >
      <Card.Subtitle className="text-muted">{credits} CFU</Card.Subtitle>
    </Col>
  );
}

function CourseInfo({ cols, course, index }) {
  return (
    <>
      <Col
        xs={cols.enrolledStudents.xs}
        sm={cols.enrolledStudents.sm}
        md={cols.enrolledStudents.md}
        lg={cols.enrolledStudents.lg}
        xl={cols.enrolledStudents.xl}
        className="my-1 my-md-0 px-0 justify-content-between"
      >
        <Card.Subtitle
          as="div"
          key={`course-enrolled-students-${course.code}`}
          className="course-info"
        >
          <OverlayTrigger
            key={`course-students-${index}`}
            placement={`bottom`}
            overlay={
              <Tooltip id={`tooltip-course-code`}>Enrolled Students</Tooltip>
            }
          >
            <span className="course-students">
              <i className="bi bi-person-check-fill"></i>{" "}
              {course.enrolledStudents}{" "}
            </span>
          </OverlayTrigger>
        </Card.Subtitle>
      </Col>
      <Col
        xs={cols.maxStudents.xs}
        sm={cols.maxStudents.sm}
        md={cols.maxStudents.md}
        lg={cols.maxStudents.lg}
        xl={cols.maxStudents.xl}
        className="my-1 my-md-0 px-0 justify-content-between"
      >
        {course.maxStudents && (
          <Card.Subtitle
            as="div"
            key={`course-max-students-${course.code}`}
            className="course-info"
          >
            <OverlayTrigger
              key={`course-max-students-${index}`}
              placement={`bottom`}
              overlay={
                <Tooltip id={`tooltip-course-code`}>
                  Max Enrollable Students
                </Tooltip>
              }
            >
              <span
                className={`course-max-students ${
                  !course.maxStudents ? "hidden" : ""
                }`}
              >
                <i className="bi bi-people-fill"></i> {course.maxStudents}
              </span>
            </OverlayTrigger>
          </Card.Subtitle>
        )}
      </Col>
    </>
  );
}

function CourseActions({ cols, mode, added, setAdded }) {
  return (
    <Col
      xs={cols.xs}
      sm={cols.sm}
      md={cols.md}
      lg={cols.lg}
      xl={cols.xl}
      className="text-center"
    >
      {(mode == StudyPlanMode.CREATE || mode == StudyPlanMode.EDIT) && (
        <Button
          variant={added ? "danger" : "outline-success"}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setAdded((added) => !added);
          }}
        >
          {added ? (
            <>
              <i className="bi bi-x-lg"></i> Remove
            </>
          ) : (
            <>
              <i className="bi bi-plus-lg"></i> Add
            </>
          )}
        </Button>
      )}
    </Col>
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
