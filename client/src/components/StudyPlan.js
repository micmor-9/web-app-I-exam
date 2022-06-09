import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function StudyPlan({ studyPlan }) {
  return (
    <>
      <Row className="study-plan-head justify-content-between align-items-center">
        <Col xs={6} sm={5} md={9} className="study-plan-header-col">
          <h3 className="study-plan-header">Your Study Plan</h3>
        </Col>
        <Col xs={6} sm={5} md={3} className="study-plan-btn-col">
          <Link to="/study-plan/create">
            <Button className="study-plan-btn">
              <i className="bi bi-plus-lg"></i> Create Study Plan
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <StudyPlanList list={studyPlan ? studyPlan.courses : null} />
      </Row>
    </>
  );
}

function StudyPlanList({ list }) {
  if (list) {
  } else {
    return (
      <div className="study-plan-list">No Study Plan has been defined</div>
    );
  }
}

export default StudyPlan;
