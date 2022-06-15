import { useState, useEffect } from "react";
import { Button, Col } from "react-bootstrap";
import { StudyPlanMode, validateCredits } from "./StudyPlan";

function StudyPlanButtons({
  studyPlanList,
  mode,
  setMode,
  setStudyPlanOption,
  setStudyPlanCredits,
  setStudyPlanList,
  studyPlanOption,
  studyPlanCredits,
  saveStudyPlan,
}) {
  return (
    <Col className="study-plan-btn-col">
      {studyPlanList.length === 0 && mode == StudyPlanMode.SHOW && (
        <CreateStudyPlanBtn setMode={setMode} />
      )}
      {studyPlanList.length > 0 && mode == StudyPlanMode.SHOW && (
        <>
          <DeleteStudyPlanBtn setMode={setMode} />
          <EditStudyPlanBtn setMode={setMode} />
        </>
      )}
      {mode != StudyPlanMode.SHOW && (
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

function EditStudyPlanBtn({ setMode }) {
  return (
    <Button
      variant="study"
      className="ms-3"
      onClick={() => {
        setMode(StudyPlanMode.EDIT);
      }}
    >
      <i className="bi bi-pencil-square"></i> Edit Study Plan
    </Button>
  );
}

function DeleteStudyPlanBtn({ setMode }) {
  return (
    <Button variant="outline-danger" onClick={() => {}}>
      <i className="bi bi-x-lg"></i> Delete Study Plan
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
        saveStudyPlan(mode, studyPlanList, studyPlanOption, studyPlanCredits)
          .then((res) => {
            setMode(StudyPlanMode.SHOW);
          })
          .catch((err) => {
            console.error(err);
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

export default StudyPlanButtons;
