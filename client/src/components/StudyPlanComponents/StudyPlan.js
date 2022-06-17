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

// Standard values of the operating mode
const StudyPlanMode = {
  SHOW: 0, // Just display the current study plan
  CREATE: 1, // Create a new study plan (after defining the option)
  EDIT: 2, // Edit the current study plan
  PRECREATE: 3, // Create a new study plan (before defining the option)
};

// Study Plan Options
const StudyPlanOptions = {
  PART_TIME: 0, // Part Time Study Plan Option
  FULL_TIME: 1, // Full Time Study Plan Option
}

const CreditsConstraints = {
  0: { min: 20, max: 40 }, // Credits contstraints for a part time study plan
  1: { min: 60, max: 80 }, // Credits contstraints for a full time study plan
};

// Function to validate the number of credits of a study plan according to the selected option
const validateCredits = (credits, option) => {
  if (option === undefined) return false;
  if (credits < CreditsConstraints[option].min) return false;
  if (credits > CreditsConstraints[option].max) return false;
  return true;
};

// Study Plan Component
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
  // States of the local study plan list
  const [studyPlanOption, setStudyPlanOption] = useState();
  const [studyPlanCredits, setStudyPlanCredits] = useState(0);

  // Effect to update option and credits whenever studyPlan changes
  useEffect(() => {
    if (studyPlan) {
      setStudyPlanOption(studyPlan.option);
      setStudyPlanCredits(studyPlan.credits);
    }
  }, [studyPlan]);

  // Effect to show an error when the study plan credits exceed the maximum
  useEffect(() => {
    if (
      studyPlanOption !== undefined &&
      studyPlanCredits > CreditsConstraints[studyPlanOption].max
    ) {
      const diff = studyPlanCredits - CreditsConstraints[studyPlanOption].max;
      Toast({
        message:
          "You've reached the maximum amount of credits for your study plan. Remove " +
          diff +
          " CFU.",
        type: "error",
      });
    }
  }, [studyPlanCredits, studyPlanOption]);

  return (
    <Container>
      <Row className="study-plan-head justify-content-between align-items-center">
        <Col className="study-plan-header-col align-middle">
          <h3 className="study-plan-header d-flex align-items-center">
            {mode === StudyPlanMode.SHOW && "Your Study Plan"}
            {(mode === StudyPlanMode.CREATE ||
              mode === StudyPlanMode.PRECREATE) &&
              "Create Study Plan"}
            {mode === StudyPlanMode.EDIT && "Edit Study Plan"}
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
        {mode === StudyPlanMode.SHOW && (
          <StudyPlanList studyPlanList={studyPlanList} />
        )}
        {(mode === StudyPlanMode.CREATE ||
          mode === StudyPlanMode.PRECREATE ||
          mode === StudyPlanMode.EDIT) && (
          <StudyPlanForm
            studyPlan={studyPlan}
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

// Show option and credits of the current study plan
function StudyPlanInfo({ mode, studyPlan }) {
  return (
    <>
      {mode !== StudyPlanMode.PRECREATE && mode !== StudyPlanMode.CREATE && (
        <Badge pill bg="light" className="study-plan-option-badge mx-3">
          {studyPlan.option === StudyPlanOptions.PART_TIME
            ? "PART TIME"
            : "FULL TIME"}
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

// Form to create or edit the study plan
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
  /**
   * Effect to update the total number of credits of the current study plan.
   * Implemented through an effect because the functions that update the the study plan (by adding or removing a course)
   * are defined in App.js and states are not visible at that level
   * */
  useEffect(() => {
    const totalCredits = studyPlanList
      .map((course) => course.credits)
      .reduce((prev, curr) => prev + curr, 0);
    setStudyPlanCredits(totalCredits);
  }, [studyPlanList, setStudyPlanCredits]);

  return (
    <Card id="create-study-plan-form">
      {mode !== StudyPlanMode.EDIT && (
        <Row>
          <Col xs={12}>
            <ButtonGroup className="mb-3">
              <ToggleButton
                key={"part-time-option"}
                id={"part-time-option"}
                type="radio"
                variant={
                  studyPlanOption === StudyPlanOptions.PART_TIME
                    ? "study"
                    : "outline-study"
                }
                name="study-plan-option"
                value={StudyPlanOptions.PART_TIME}
                checked={studyPlanOption === StudyPlanOptions.PART_TIME}
                onClick={() => {
                  setMode(StudyPlanMode.CREATE);
                  setStudyPlanOption(StudyPlanOptions.PART_TIME);
                }}
              >
                Part Time
              </ToggleButton>
              <ToggleButton
                key={"full-time-option"}
                id={"full-time-option"}
                type="radio"
                variant={
                  studyPlanOption === StudyPlanOptions.FULL_TIME
                    ? "study"
                    : "outline-study"
                }
                name="study-plan-option"
                value={StudyPlanOptions.FULL_TIME}
                checked={studyPlanOption === StudyPlanOptions.FULL_TIME}
                onClick={() => {
                  setMode(StudyPlanMode.CREATE);
                  setStudyPlanOption(StudyPlanOptions.FULL_TIME);
                }}
              >
                Full Time
              </ToggleButton>
            </ButtonGroup>
          </Col>
        </Row>
      )}
      {studyPlanOption !== undefined && (
        <>
          <Row>
            <Col className="mb-3">
              A{" "}
              {studyPlanOption === StudyPlanOptions.PART_TIME
                ? "Part Time"
                : "Full Time"}{" "}
              study plan needs to have minimum{" "}
              {CreditsConstraints[studyPlanOption].min} and maximum{" "}
              {CreditsConstraints[studyPlanOption].max} credits.
            </Col>
          </Row>
          <Row id="study-plan-progress">
            <Row className="align-items-center">
              <Col>
                <h4 className="text-muted text-start">0</h4>
              </Col>
              {studyPlanOption === StudyPlanOptions.FULL_TIME && (
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
                  {studyPlanCredits}/{CreditsConstraints[studyPlanOption].max}{" "}
                  CFU
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
                      // Calculation to get the correct value of progress bar now position
                      (studyPlanCredits * 100) /
                      CreditsConstraints[studyPlanOption].max
                    }
                  />
                </ProgressBar>
              </Col>
            </Row>
          </Row>
          <Row>
            <StudyPlanList
              studyPlanList={studyPlanList}
              removeCourseFromStudyPlan={removeCourseFromStudyPlan}
            />
          </Row>
        </>
      )}
    </Card>
  );
}

export { StudyPlan, StudyPlanMode, CreditsConstraints, validateCredits };
