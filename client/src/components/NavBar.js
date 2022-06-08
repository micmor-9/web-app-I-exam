import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../App.css";

function NavBar() {
  return (
    <Navbar bg="white" expand="md" className="main-navbar">
      <Container fluid="xxl">
        <Navbar.Brand>
          <Link to="/">
            <h3>
              <i className="bi bi-mortarboard-fill me-2"></i> StudyPlan
            </h3>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-study-plan" />
        <Navbar.Collapse
          id="responsive-navbar-study-plan"
          className="justify-content-end"
        >
          <Link to="/login">
            <Button variant="outline-study">Login</Button>
          </Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
