import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

const StudyPlanMode = {
  SHOW: 0,
  CREATE: 1,
  EDIT: 2,
};

function StudyPlan({ mode, setMode, studyPlan }) {
  return (
    <Container>
      <Row className="study-plan-head justify-content-between align-items-center">
        <Col xs={6} sm={5} md={9} className="study-plan-header-col">
          <h3 className="study-plan-header">
            {mode == StudyPlanMode.SHOW && "Your Study Plan"}
            {mode == StudyPlanMode.CREATE && "Create Study Plan"}
            {mode == StudyPlanMode.EDIT && "Edit Study Plan"}
          </h3>
        </Col>
        <Col xs={6} sm={5} md={3} className="study-plan-btn-col">
          {!studyPlan && mode == StudyPlanMode.SHOW && (
            <CreateStudyPlanBtn mode={mode} setMode={setMode} />
          )}
          {mode == StudyPlanMode.CREATE && (
            <>
              <CancelCreateStudyPlanBtn mode={mode} setMode={setMode} />
              <SaveStudyPlanBtn mode={mode} setMode={setMode} />
            </>
          )}
        </Col>
      </Row>
      <Row>
        {mode == StudyPlanMode.SHOW && (
          <StudyPlanList list={studyPlan ? studyPlan.courses : null} />
        )}
        {!studyPlan && mode == StudyPlanMode.CREATE && <CreateStudyPlanForm />}
      </Row>
    </Container>
  );
}

function CreateStudyPlanBtn({ mode, setMode }) {
  return (
    <Button
      variant="study"
      onClick={() => {
        setMode(StudyPlanMode.CREATE);
      }}
    >
      <i className="bi bi-plus-lg"></i> Create Study Plan
    </Button>
  );
}

function SaveStudyPlanBtn({ mode, setMode }) {
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

function CancelCreateStudyPlanBtn({ mode, setMode }) {
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

function CreateStudyPlanForm() {
  return (
    <Card id="create-study-plan-form">
      <Form>
        <Form.Group className="mb-3" controlId="studyPlanOption">
          <Form.Check
            inline
            type="radio"
            id={"part-time-option"}
            name="study-plan-option"
            label={"Part Time"}
          />

          <Form.Check
            inline
            type="radio"
            id={"full-time-option"}
            name="study-plan-option"
            label={"Full Time"}
          />
        </Form.Group>
      </Form>
    </Card>
  );
}

function StudyPlanList({ list }) {
  return (
    !list && (
      <div className="study-plan-list">No Study Plan has been defined</div>
    )
  );
}

export { StudyPlan, StudyPlanMode };
