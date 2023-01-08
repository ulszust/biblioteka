import Card from "react-bootstrap/Card";
import BookLogo from "./images/logonowe.png";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

function LoginPage() {
  const { onLogin } = useAuth();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  function onLoginClick() {
    onLogin(login, password);
  }

  return (
    <Card>
      <Card.Img src={BookLogo} />
      <Card.Body className="login-page-card">
        <Form>
          <Form.Group htmlFor="login">
            <Form.Control
              id="login"
              type="email"
              placeholder="Login"
              onChange={(e) => setLogin(e.target.value)}
            />
          </Form.Group>
          <br />
          <Form.Group htmlFor="password">
            <Form.Control
              id="password"
              type="password"
              placeholder="Hasło"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
        <Button variant="secondary" onClick={onLoginClick}>
          Zaloguj się
        </Button>
      </Card.Body>
    </Card>
  );
}

export default LoginPage;
