import { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  ProgressBar,
  Row,
  Table,
  ToggleButton,
} from "react-bootstrap";
import { Toast } from "./Toast";

const StudyPlanMode = {
  SHOW: 0,
  CREATE: 1,
  EDIT: 2,
  PRECREATE: 3,
};

const CreditsConstraints = {
  0: { min: 20, max: 40 },
  1: { min: 60, max: 80 },
};

const validateCredits = (credits, option) => {
  if (option === undefined) return false;
  if (credits < CreditsConstraints[option].min) return false;
  if (credits > CreditsConstraints[option].max) return false;
  return true;
};

function StudyPlan({
  mode,
  setMode,
  studyPlanList,
  setStudyPlanList,
  removeCourseFromStudyPlan,
  saveStudyPlan,
}) {
  const [studyPlanOption, setStudyPlanOption] = useState();
  const [studyPlanCredits, setStudyPlanCredits] = useState(0);

  useEffect(() => {
    if (
      studyPlanOption !== undefined &&
      studyPlanCredits > CreditsConstraints[studyPlanOption].max
    ) {
      Toast({
        message:
          "You've reached the maximum amount of credits for your study plan. Remove an exam.",
        type: "error",
      });
    }
  }, [studyPlanCredits]);

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
          {studyPlanList.length === 0 && mode == StudyPlanMode.SHOW && (
            <CreateStudyPlanBtn setMode={setMode} />
          )}
          {(mode == StudyPlanMode.CREATE ||
            mode == StudyPlanMode.PRECREATE) && (
            <>
              <CancelStudyPlanBtn
                setMode={setMode}
                setStudyPlanOption={setStudyPlanOption}
                setStudyPlanCredits={setStudyPlanCredits}
                setStudyPlanList={setStudyPlanList}
              />
              <SaveStudyPlanBtn
                mode={mode}
                setMode={setMode}
                studyPlanOption={studyPlanOption}
                studyPlanCredits={studyPlanCredits}
                studyPlanList={studyPlanList}
                saveStudyPlan={saveStudyPlan}
              />
            </>
          )}
        </Col>
      </Row>
      <Row>
        {mode == StudyPlanMode.SHOW && (
          <StudyPlanList empty={true} studyPlanList={studyPlanList} />
        )}
        {(mode == StudyPlanMode.CREATE || mode == StudyPlanMode.PRECREATE) && (
          <StudyPlanForm
            studyPlanList={studyPlanList}
            removeCourseFromStudyPlan={removeCourseFromStudyPlan}
            setMode={setMode}
            studyPlanOption={studyPlanOption}
            studyPlanCredits={studyPlanCredits}
            setStudyPlanOption={setStudyPlanOption}
            setStudyPlanCredits={setStudyPlanCredits}
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

function SaveStudyPlanBtn({
  mode,
  setMode,
  studyPlanOption,
  studyPlanCredits,
  studyPlanList,
  saveStudyPlan,
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    validateCredits(studyPlanCredits, studyPlanOption)
      ? setActive(true)
      : setActive(false);
  }, [studyPlanOption, studyPlanCredits]);

  return (
    <Button
      variant="study"
      onClick={() => {
        saveStudyPlan(
          mode,
          studyPlanList,
          studyPlanOption,
          studyPlanCredits
        ).then((res) => {
          console.log(res);
          setMode(StudyPlanMode.SHOW);
        });
      }}
      disabled={!active}
    >
      <i className="bi bi-check-lg"></i> Save
    </Button>
  );
}

function CancelStudyPlanBtn({
  setMode,
  setStudyPlanOption,
  setStudyPlanCredits,
  setStudyPlanList,
}) {
  return (
    <Button
      variant="study-secondary"
      onClick={() => {
        setMode(StudyPlanMode.SHOW);
        setStudyPlanOption();
        setStudyPlanCredits(0);
        setStudyPlanList([]);
      }}
      className="me-3"
    >
      <i className="bi bi-x-lg"></i> Cancel
    </Button>
  );
}

function StudyPlanForm({
  studyPlanList,
  removeCourseFromStudyPlan,
  setMode,
  studyPlanOption,
  studyPlanCredits,
  setStudyPlanOption,
  setStudyPlanCredits,
}) {
  useEffect(() => {
    const totalCredits = studyPlanList
      .map((course) => course.credits)
      .reduce((prev, curr) => prev + curr, 0);
    setStudyPlanCredits(totalCredits);
  }, [studyPlanList]);

  return (
    <Card id="create-study-plan-form">
      <Row>
        <Col xs={12}>
          <ButtonGroup className="mb-3">
            <ToggleButton
              key={"part-time-option"}
              id={"part-time-option"}
              type="radio"
              variant={studyPlanOption === 0 ? "study" : "outline-study"}
              name="study-plan-option"
              value={0}
              checked={studyPlanOption === 0}
              onClick={() => {
                setMode(StudyPlanMode.CREATE);
                setStudyPlanOption(0);
              }}
            >
              Part Time
            </ToggleButton>
            <ToggleButton
              key={"full-time-option"}
              id={"full-time-option"}
              type="radio"
              variant={studyPlanOption === 1 ? "study" : "outline-study"}
              name="study-plan-option"
              value={1}
              checked={studyPlanOption === 1}
              onClick={() => {
                setMode(StudyPlanMode.CREATE);
                setStudyPlanOption(1);
              }}
            >
              Full Time
            </ToggleButton>
          </ButtonGroup>
        </Col>
      </Row>
      {studyPlanOption !== undefined && (
        <Row id="study-plan-progress">
          <Row>
            <Col className="mb-3">
              A {studyPlanOption == 0 ? "Part Time" : "Full Time"} study plan
              needs to have minimum {CreditsConstraints[studyPlanOption].min}{" "}
              and maximum {CreditsConstraints[studyPlanOption].max} credits.
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col>
              <h4 className="text-muted text-start">0</h4>
            </Col>
            {studyPlanOption == 1 && (
              <>
                <Col></Col>
                <Col></Col>
                <Col></Col>
              </>
            )}
            <Col>
              <h4 className="text-muted text-center">
                {CreditsConstraints[studyPlanOption].min}
              </h4>
            </Col>
            <Col>
              <h4 className="text-muted text-end">
                {studyPlanCredits}/{CreditsConstraints[studyPlanOption].max} CFU
              </h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <ProgressBar className="flex-grow-1">
                <ProgressBar
                  animated
                  variant={
                    validateCredits(studyPlanCredits, studyPlanOption)
                      ? "success"
                      : "danger"
                  }
                  now={
                    (studyPlanCredits * 100) /
                    CreditsConstraints[studyPlanOption].max
                  }
                />
              </ProgressBar>
            </Col>
          </Row>
        </Row>
      )}
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
                  <td>{course.enrolledStudents || "0"}</td>
                  <td>{course.maxStudents || "-"}</td>
                  <td>
                    {course.preparatoryCourse.length === 0
                      ? "-"
                      : course.preparatoryCourse.map((course) => course.code)}
                  </td>
                  <td>
                    {course.incompatibleCourses.length === 0
                      ? "-"
                      : course.incompatibleCourses
                          .map((course) => course.code)
                          .join(", ")}
                  </td>
                  {removeCourseFromStudyPlan && (
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          removeCourseFromStudyPlan(course);
                        }}
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
