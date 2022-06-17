import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect } from "react";
import { StudyPlanMode } from "./StudyPlanComponents/StudyPlan";
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

// Courses List Component
function CoursesList(props) {
  // Create a State to handle pagination
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
          // Calculate the page to which the current item of the list belongs
          const page = Math.ceil((index + 1) / elementsPerPage);
          return page === pagination ? (
            <CoursesListItem
              key={course.code}
              index={index}
              course={course}
              coursesList={props.list}
              mode={props.mode}
              studyPlan={props.studyPlan}
              studyPlanList={props.studyPlanList}
              addCourseToStudyPlan={props.addCourseToStudyPlan}
              removeCourseFromStudyPlan={props.removeCourseFromStudyPlan}
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
  // Calculate the number of pages needed to display all the list items
  const pages =
    list.length % elementsPerPage != 0
      ? list.length / elementsPerPage + 1
      : list.length / elementsPerPage;

  // Add to the pagination items the previous element button, the number of pages and the next element button
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

function CoursesListItem({
  index,
  course,
  coursesList,
  mode,
  studyPlan,
  studyPlanList,
  addCourseToStudyPlan,
  removeCourseFromStudyPlan,
}) {
  // Create state to expand the current item
  const [expanded, setExpanded] = useState(false);
  // Create state to display the current item with a warning if it can't be added to the study plan
  const [warning, setWarning] = useState();

  const toggleExpanded = () => {
    setExpanded((expanded) => !expanded);
  };

  // Function that checks if the current item can be added to the study plan
  const checkCoursesConstraints = () => {
    let message = [];

    // Check for preparatoryCourse
    if (course.preparatoryCourse.length > 0) {
      const prepIndex = studyPlanList.find(
        (c) => c.code === course.preparatoryCourse[0].code
      );
      if (prepIndex === undefined) {
        const pc = coursesList.find(
          (pc) => pc.code === course.preparatoryCourse[0].code
        );
        message.push(`
          Can't add ${course.code} - ${course.name} to the Study Plan. You need its preparatory course ${pc.code} - ${pc.name}
        `);
      }
    }

    // Check for incompatibleCourses
    if (course.incompatibleCourses.length > 0) {
      course.incompatibleCourses.forEach((incompatibleCourse, index) => {
        const incompIndex = studyPlanList.find(
          (c) => c.code === incompatibleCourse.code
        );
        if (incompIndex !== undefined) {
          const ic = coursesList.find(
            (ic) => ic.code === course.incompatibleCourses[index].code
          );
          message.push(`
            Can't add ${course.code} - ${course.name} to the Study Plan. It is incompatible with ${ic.code} - ${ic.name}
          `);
        }
      });
    }

    // Check for maximum number of enrolledStudents
    if (course.maxStudents) {
      if (studyPlan && !studyPlan.courses.find((c) => c.code === course.code)) {
        if (course.enrolledStudents === course.maxStudents) {
          message.push(`
          ${course.code} - ${course.name}
          has already reached the maximum number of students enrolled.
        `);
        }
      }
    }

    if (message.length !== 0) {
      setWarning(message.join("; "));
    } else {
      setWarning();
    }
  };

  // Effect to update the warnings of the list items whenever the stidu plan list is updated
  useEffect(() => {
    checkCoursesConstraints();
  }, [studyPlanList]);

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
      className={
        (mode == StudyPlanMode.CREATE || mode == StudyPlanMode.EDIT) && warning
          ? "courses-list-item course-warning"
          : "courses-list-item"
      }
      onClick={() => toggleExpanded()}
    >
      <Card.Body>
        <Row className="align-items-center" sm={12}>
          <CourseCode
            cols={columnsWidth.code}
            index={index}
            code={course.code}
          />
          <CourseName
            cols={columnsWidth.name}
            name={course.name}
            index={index}
            warning={warning}
            mode={mode}
          />
          <CourseCredits cols={columnsWidth.credits} credits={course.credits} />
          <CourseInfo cols={columnsWidth.info} course={course} index={index} />
          <CourseActions
            cols={columnsWidth.actions}
            course={course}
            mode={mode}
            studyPlanList={studyPlanList}
            addCourseToStudyPlan={addCourseToStudyPlan}
            removeCourseFromStudyPlan={removeCourseFromStudyPlan}
          />
          {expanded && <CourseDescription course={course} />}
        </Row>
      </Card.Body>
    </Card>
  );
}

// Course Code Column
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

// Course Name Column
function CourseName({ cols, name, index, warning, mode }) {
  return (
    <Col
      xs={cols.xs}
      sm={cols.sm}
      md={cols.md}
      lg={cols.lg}
      xl={cols.xl}
      className="my-1 my-md-0 px-0"
    >
      <Card.Title className="mb-1">
        {name}
        {(mode == StudyPlanMode.CREATE || mode == StudyPlanMode.EDIT) &&
          warning && (
            <OverlayTrigger
              key={`course-warning-${index}`}
              placement={`right`}
              overlay={<Tooltip id={`tooltip-course-code`}>{warning}</Tooltip>}
            >
              <i className="bi bi-exclamation-triangle-fill ms-2"></i>
            </OverlayTrigger>
          )}
      </Card.Title>
    </Col>
  );
}

// Course Credits Column
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

// Course Info Column
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

// Course Actions Column
function CourseActions({
  cols,
  course,
  mode,
  studyPlanList,
  addCourseToStudyPlan,
  removeCourseFromStudyPlan,
}) {
  return (
    <Col
      xs={cols.xs}
      sm={cols.sm}
      md={cols.md}
      lg={cols.lg}
      xl={cols.xl}
      className="text-center"
    >
      {(mode == StudyPlanMode.CREATE || mode == StudyPlanMode.EDIT) &&
        (studyPlanList.filter((c) => c.code === course.code).length != 0 ? (
          <Button
            variant={"danger"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              removeCourseFromStudyPlan(course);
            }}
          >
            <i className="bi bi-x-lg"></i> Remove
          </Button>
        ) : (
          <Button
            variant={"outline-success"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              addCourseToStudyPlan(course);
            }}
          >
            <i className="bi bi-plus-lg"></i> Add
          </Button>
        ))}
    </Col>
  );
}

// Course Description Column (shows the expanded content)
function CourseDescription({ course }) {
  return (
    <Card.Text
      as="div"
      key={`course-description-${course.code}`}
      className="course-description"
    >
      <p>
        <span className="course-description-label">Preparatory Course:</span>{" "}
        {course.preparatoryCourse.length > 0 ? (
          <b>
            {course.preparatoryCourse[0].code} -{" "}
            {course.preparatoryCourse[0].name}
          </b>
        ) : (
          <i>No preparatory course</i>
        )}
      </p>
      <p>
        <span className="course-description-label">
          Incompatible{" "}
          {course.incompatibleCourses.length <= 1 ? "Course" : "Courses"}:
        </span>{" "}
        {course.incompatibleCourses.length > 0 && (
          <b>
            {course.incompatibleCourses
              .map((ic) => ic.code + " - " + ic.name)
              .join(", ")}
          </b>
        )}
        {!course.incompatibleCourses.length > 0 && (
          <i>No incompatible courses</i>
        )}
      </p>
    </Card.Text>
  );
}

export default CoursesList;
