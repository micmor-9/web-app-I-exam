import { useState } from "react";
import { Button, Form, NavDropdown, Row } from "react-bootstrap";
import { Toast } from "./Toast";

function LoginForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      const credentials = { username: email, password };
      props
        .login(credentials)
        .then((user) => {
          Toast({
            message: `Welcome ${user.name} ${user.surname}`,
            type: "success",
          });
        })
        .catch((error) => {
          console.error(error);
          Toast({ message: `Wrong email or password`, type: "error" });
        });
    }
    setValidated(true);
  };

  return (
    <Row id="loginForm">
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Provide a valid email address.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            minLength={6}
            required
          />
          <Form.Control.Feedback type="invalid">
            Provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="study" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </Row>
  );
}

function UserActions({ user, logout }) {
  const logoutAction = () => {
    logout()
      .then(() => {
        Toast({
          message: `Logged out successfully!`,
          type: "success",
        });
      })
      .catch((err) => {
        console.error(err);
        Toast({
          message: `There was an error logging out. Please refresh the page.`,
          type: "error",
        });
      });
  };

  return (
    <NavDropdown title={`${user.name} ${user.surname}`} id="user-nav-dropdown">
      <NavDropdown.Item id="user-logout-button" onClick={() => logoutAction()}>
        Logout
      </NavDropdown.Item>
    </NavDropdown>
  );
}

export { LoginForm, UserActions };
