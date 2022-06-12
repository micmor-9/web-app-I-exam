import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ProgressBar,
  Row,
  Table,
} from "react-bootstrap";

const StudyPlanMode = {
  SHOW: 0,
  CREATE: 1,
  EDIT: 2,
  PRECREATE: 3,
};

function StudyPlan({
  mode,
  setMode,
  studyPlan,
  setStudyPlan,
  studyPlanList,
  setStudyPlanList,
  removeCourseFromStudyPlan,
}) {
  return (
    <Container>
      <Row className="study-plan-head justify-content-between align-items-center">
        <Col xs={6} sm={5} md={9} className="study-plan-header-col">
          <h3 className="study-plan-header">
            {mode == StudyPlanMode.SHOW && "Your Study Plan"}
            {(mode == StudyPlanMode.CREATE ||
              mode == StudyPlanMode.PRECREATE) &&
              "Create Study Plan"}
            {mode == StudyPlanMode.EDIT && "Edit Study Plan"}
          </h3>
        </Col>
        <Col xs={6} sm={5} md={3} className="study-plan-btn-col">
          {!studyPlan && mode == StudyPlanMode.SHOW && (
            <CreateStudyPlanBtn setMode={setMode} />
          )}
          {(mode == StudyPlanMode.CREATE ||
            mode == StudyPlanMode.PRECREATE) && (
            <>
              <CancelStudyPlanBtn setMode={setMode} />
              <SaveStudyPlanBtn setMode={setMode} />
            </>
          )}
        </Col>
      </Row>
      <Row>
        {mode == StudyPlanMode.SHOW && (
          <StudyPlanList empty={true} studyPlanList={studyPlanList} />
        )}
        {((!studyPlan && mode == StudyPlanMode.CREATE) ||
          mode == StudyPlanMode.PRECREATE) && (
          <StudyPlanForm
            studyPlanList={studyPlanList}
            removeCourseFromStudyPlan={removeCourseFromStudyPlan}
            setMode={setMode}
          />
        )}
      </Row>
    </Container>
  );
}

function CreateStudyPlanBtn({ setMode }) {
  return (
    <Button
      variant="study"
      onClick={() => {
        setMode(StudyPlanMode.PRECREATE);
      }}
    >
      <i className="bi bi-plus-lg"></i> Create Study Plan
    </Button>
  );
}

function SaveStudyPlanBtn({ setMode }) {
  return (
    <Button
      variant="study"
      onClick={() => {
        setMode(StudyPlanMode.SHOW);
      }}
    >
      <i className="bi bi-check-lg"></i> Save
    </Button>
  );
}

function CancelStudyPlanBtn({ setMode }) {
  return (
    <Button
      variant="study-secondary"
      onClick={() => {
        setMode(StudyPlanMode.SHOW);
      }}
      className="me-3"
    >
      <i className="bi bi-x-lg"></i> Cancel
    </Button>
  );
}

function StudyPlanForm({ studyPlanList, removeCourseFromStudyPlan, setMode }) {
  const [studyPlanOption, setStudyPlanOption] = useState();
  const [studyPlanCredits, setStudyPlanCredits] = useState(0);

  return (
    <Card id="create-study-plan-form">
      <Form>
        <Row>
          <Col xs={12}>
            <Form.Group className="mb-3" controlId="studyPlanOption">
              <Form.Check
                inline
                type="radio"
                id={"part-time-option"}
                name="study-plan-option"
                label={"Part Time"}
                onClick={() => {
                  setMode(StudyPlanMode.CREATE);
                  setStudyPlanOption(0);
                }}
              />
              <Form.Check
                inline
                type="radio"
                id={"full-time-option"}
                name="study-plan-option"
                label={"Full Time"}
                onClick={() => {
                  setMode(StudyPlanMode.CREATE);
                  setStudyPlanOption(1);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        {studyPlanOption !== undefined && (
          <Row className="align-items-center">
            <Col xs={12} md={6} lg={8} xl={10}>
              <ProgressBar>
                <ProgressBar striped variant="success" now={35} key={1} />
              </ProgressBar>
            </Col>
            <Col xs={12} md={6} lg={4} xl={2}>
              <h4 className="text-muted align-middle">
                {studyPlanCredits}/60 CFU
              </h4>
            </Col>
          </Row>
        )}
      </Form>
      {studyPlanOption !== undefined && (
        <Row>
          <StudyPlanList
            empty={false}
            studyPlanList={studyPlanList}
            removeCourseFromStudyPlan={removeCourseFromStudyPlan}
          />
        </Row>
      )}
    </Card>
  );
}

function StudyPlanList({ empty, studyPlanList, removeCourseFromStudyPlan }) {
  if (!empty) {
    return (
      <StudyPlanTable
        data={studyPlanList}
        removeCourseFromStudyPlan={removeCourseFromStudyPlan}
      />
    );
  } else {
    return (
      <div className="study-plan-list">No Study Plan has been defined</div>
    );
  }
}

function StudyPlanTable({ data, removeCourseFromStudyPlan = null }) {
  return (
    <Col xs={12}>
      <Table id="study-plan-table">
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Name</th>
            <th scope="col">Credits</th>
            <th scope="col">Enrolled Students</th>
            <th scope="col">Max Students</th>
            <th scope="col">Preparatory Course</th>
            <th scope="col">Incompatible courses</th>
            {removeCourseFromStudyPlan && <th scope="col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length == 0 ? (
            <tr>
              <td colSpan={removeCourseFromStudyPlan ? 8 : 7}>
                {" "}
                No course inserted yet{" "}
              </td>
            </tr>
          ) : (
            data.map((course) => {
              return (
                <tr key={course.code}>
                  <th scope="row">{course.code}</th>
                  <td>{course.name}</td>
                  <td>{course.credits}</td>
                  <td>{course.enrolledStudents || "-"}</td>
                  <td>{course.maxStudents || "-"}</td>
                  <td>{course.preparatoryCourse || "-"}</td>
                  <td>
                    {course.incompatibleCourses.length === 0
                      ? "-"
                      : course.incompatibleCourses.join(", ")}
                  </td>
                  {removeCourseFromStudyPlan && (
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeCourseFromStudyPlan(course)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </Col>
  );
}

export { StudyPlan, StudyPlanMode };
