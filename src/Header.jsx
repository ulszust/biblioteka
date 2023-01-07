import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import BookLogo from "./images/logonowe.png";
import { PersonCircle } from "react-bootstrap-icons";
import React, { useEffect, useState } from "react";
import ChooseProfileModal from "./ChooseProfileModal";
import { isAdmin, isUser } from "./App";

function Header(props) {
  const { user, setUser } = props;
  const [show, setShow] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => setUser(currentUser), [currentUser]);
  function onChangeProfileClick() {
    setShow(true);
  }

  function onUserChanged(user) {
    if (!!user) {
      setCurrentUser(user);
    }
    setShow(false);
  }

  return (
    <>
      <Navbar className="header" bg="light" expand="sm">
        <Navbar.Brand href="/">
          <img width="180" height="40" src={BookLogo} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/books/search">Szukaj</Nav.Link>
            {isUser(user) && (
              <Nav.Link href="/user">Moje wypożyczenia</Nav.Link>
            )}
            {isAdmin(user) && (
              <Nav.Link href="/books/add">Dodaj książkę</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
        <Nav>
          <Nav.Item>
            <PersonCircle
              size={40}
              style={{ cursor: "pointer" }}
              onClick={onChangeProfileClick}
              className="nav-person"
            />
          </Nav.Item>
        </Nav>
      </Navbar>
      <ChooseProfileModal
        show={show}
        handleClose={onUserChanged}
        currentUser={currentUser}
        onProfileChanged={onUserChanged}
      ></ChooseProfileModal>
    </>
  );
}

export default Header;
