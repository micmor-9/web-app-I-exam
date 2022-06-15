import { useState, useEffect } from "react";
import {
  Badge,
  ButtonGroup,
  Card,
  Col,
  Container,
  ProgressBar,
  Row,
  ToggleButton,
} from "react-bootstrap";
import { Toast } from "../Toast";
import StudyPlanButtons from "./StudyPlanButtons";
import StudyPlanList from "./StudyPlanList";

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
  studyPlan,
  studyPlanList,
  setStudyPlanList,
  removeCourseFromStudyPlan,
  saveStudyPlan,
  deleteStudyPlan,
}) {
  const [studyPlanOption, setStudyPlanOption] = useState();
  const [studyPlanCredits, setStudyPlanCredits] = useState(0);

  useEffect(() => {
    if (studyPlan) {
      setStudyPlanOption(studyPlan.option);
      setStudyPlanCredits(studyPlan.credits);
    }
  }, [studyPlan]);

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
        <Col className="study-plan-header-col align-middle">
          <h3 className="study-plan-header d-flex align-items-center">
            {mode == StudyPlanMode.SHOW && "Your Study Plan"}
            {(mode == StudyPlanMode.CREATE ||
              mode == StudyPlanMode.PRECREATE) &&
              "Create Study Plan"}
            {mode == StudyPlanMode.EDIT && "Edit Study Plan"}
            {studyPlan !== undefined && (
              <StudyPlanInfo mode={mode} studyPlan={studyPlan} />
            )}
          </h3>
        </Col>
        <StudyPlanButtons
          studyPlanList={studyPlanList}
          mode={mode}
          setMode={setMode}
          setStudyPlanOption={setStudyPlanOption}
          setStudyPlanCredits={setStudyPlanCredits}
          setStudyPlanList={setStudyPlanList}
          studyPlanOption={studyPlanOption}
          studyPlanCredits={studyPlanCredits}
          saveStudyPlan={saveStudyPlan}
          deleteStudyPlan={deleteStudyPlan}
        />
      </Row>
      <Row>
        {mode == StudyPlanMode.SHOW && (
          <StudyPlanList studyPlan={studyPlan} studyPlanList={studyPlanList} />
        )}
        {(mode == StudyPlanMode.CREATE ||
          mode == StudyPlanMode.PRECREATE ||
          mode == StudyPlanMode.EDIT) && (
          <StudyPlanForm
            studyPlanList={studyPlanList}
            removeCourseFromStudyPlan={removeCourseFromStudyPlan}
            mode={mode}
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

function StudyPlanInfo({ mode, studyPlan }) {
  return (
    <>
      {mode !== StudyPlanMode.PRECREATE && mode !== StudyPlanMode.CREATE && (
        <Badge pill bg="light" className="study-plan-option-badge mx-3">
          {studyPlan.option === 0 ? "PART TIME" : "FULL TIME"}
        </Badge>
      )}
      {mode === StudyPlanMode.SHOW && (
        <Badge pill className="study-plan-credits-badge">
          {studyPlan.credits} CFU
        </Badge>
      )}
    </>
  );
}

function StudyPlanForm({
  studyPlanList,
  removeCourseFromStudyPlan,
  mode,
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
      {mode != StudyPlanMode.EDIT && (
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
      )}
      {studyPlanOption !== undefined && (
        <Row>
          <Col className="mb-3">
            A {studyPlanOption == 0 ? "Part Time" : "Full Time"} study plan
            needs to have minimum {CreditsConstraints[studyPlanOption].min} and
            maximum {CreditsConstraints[studyPlanOption].max} credits.
          </Col>
        </Row>
      )}
      {studyPlanOption !== undefined && (
        <Row id="study-plan-progress">
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

export { StudyPlan, StudyPlanMode, CreditsConstraints, validateCredits };
