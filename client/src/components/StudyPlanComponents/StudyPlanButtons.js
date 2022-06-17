import { useState, useEffect } from "react";
import { Button, Col, Modal } from "react-bootstrap";
import { StudyPlanMode, validateCredits } from "./StudyPlan";
import { Toast } from "../Toast";

// Component which containes all the buttons related to the study plan section
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
  deleteStudyPlan,
}) {
  return (
    <Col className="study-plan-btn-col" xs={12} md={6}>
      {studyPlanList.length === 0 && mode == StudyPlanMode.SHOW && (
        <CreateStudyPlanBtn setMode={setMode} />
      )}
      {studyPlanList.length > 0 && mode == StudyPlanMode.SHOW && (
        <>
          <DeleteStudyPlanBtn
            deleteStudyPlan={deleteStudyPlan}
            setStudyPlanOption={setStudyPlanOption}
            setStudyPlanCredits={setStudyPlanCredits}
          />
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

// Button to create a new study plan (it shows the create study plan form)
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

// Button to edit the current study plan (it shows the edit form)
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

// Button the delete the current study plan (it shows a modal dialog to confirm the deletion)
function DeleteStudyPlanBtn({
  deleteStudyPlan,
  setStudyPlanOption,
  setStudyPlanCredits,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    setShowDeleteModal(false);
    deleteStudyPlan()
      .then(() => {
        setStudyPlanOption();
        setStudyPlanCredits(0);
        Toast({
          message: "Study Plan deleted successfully!",
          type: "success",
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
        <i className="bi bi-x-lg"></i> Delete Study Plan
      </Button>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete your Study Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You are deleting your Study Plan. <br />
          This operation is IRREVERSIBLE. Are you sure you want to continue?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

// Button to save the current study plan (which is in CREATE or EDIT mode)
function SaveStudyPlanBtn({
  mode,
  setMode,
  studyPlanOption,
  studyPlanCredits,
  studyPlanList,
  saveStudyPlan,
}) {
  const [active, setActive] = useState(false);

  // Effect to enable or disable the button according to the credits constraints
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
          .then(() => {
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

// Button to close the CREATE/EDIT study plan form
function CancelStudyPlanBtn({
  setMode,
  setStudyPlanOption
}) {
  return (
    <Button
      variant="study-secondary"
      onClick={() => {
        setStudyPlanOption();
        setMode(StudyPlanMode.SHOW);
      }}
      className="me-3"
    >
      <i className="bi bi-x-lg"></i> Cancel
    </Button>
  );
}

export default StudyPlanButtons;
