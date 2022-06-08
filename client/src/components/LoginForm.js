import { useState } from "react";
import { Button, Form, FormControl, FormLabel, Row } from "react-bootstrap";

function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props.login(credentials);
  };

  return (
    <Row id="loginForm">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            required={true}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required={true}
            minLength={6}
          />
        </Form.Group>

        <Button variant="study" className="mt-3">
          Login
        </Button>
      </Form>
    </Row>
  );
}

export default LoginForm;
