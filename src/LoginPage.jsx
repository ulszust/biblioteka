import Card from "react-bootstrap/Card";
import BookLogo from "./images/logonowe.png";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "./Firebase";

function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  function onLoginClick() {
    signInWithEmailAndPassword(auth, login, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("user", user);
        // ...
      })
      .catch((error) => {
        console.log("error", error);

        window.alert(
          "Logowanie się nie powiodło. Upewnij się, że podano poprawne dane."
        );
      });
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
