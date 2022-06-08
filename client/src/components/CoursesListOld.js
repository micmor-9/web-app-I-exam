import React from "react";
import {
  Accordion,
  Badge,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function CoursesList(props) {
  return (
    <Accordion alwaysOpen>
      {props.list.map((course, index) => {
        return (
          <Accordion.Item key={course.code} eventKey={index}>
            <Accordion.Header>
              <CourseCode index={index} code={course.code} />
              <CourseName name={course.name} />
              <CourseInfo course={course} />
            </Accordion.Header>
            <Accordion.Body>
              <CourseDescription course={course} />
            </Accordion.Body>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}

function CourseCode({ index, code }) {
  return (
    <Col lg={1}>
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

function CourseName({ name }) {
  return (
    <Col lg={6}>
      <p className="course-name">{name}</p>
    </Col>
  );
}

function CourseInfo({ course }) {
  return (
    <Col lg={4} className="course-description">
      <span className="course-credits">{course.credits} Credits</span>
      {course.maxStudents ? (
        <span className="course-students">
          <i className="bi bi-person-check-fill"></i>
          {course.maxStudents} Students Enrolled
        </span>
      ) : null}
      {course.maxStudents ? (
        <span className="course-max-students">
          <i className="bi bi-people-fill"></i>
          {course.maxStudents} Max Students
        </span>
      ) : null}
    </Col>
  );
}

function CourseDescription({ course }) {
  return (
    <>
      <p>Preliminary Course: {course.preliminaryCourse}</p>
      <p>
        Incompatible{" "}
        {course.incompatibleCourses.length <= 1 ? "Course" : "Courses"}:{" "}
        {course.incompatibleCourses.join(", ")}
      </p>
    </>
  );
}

export default CoursesList;
