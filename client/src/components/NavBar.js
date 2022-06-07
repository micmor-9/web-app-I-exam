import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar } from "react-bootstrap";
import "../App.css";

function NavBar(props) {
  return (
    <Navbar bg="light" expand="md">
      <Navbar.Brand>
        <h2>
          <i className="bi bi-mortarboard-fill me-2"></i> StudyPlan
        </h2>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
    </Navbar>
  );
}

export default NavBar;
