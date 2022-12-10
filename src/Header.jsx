import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import BookLogo from './images/logonew.jpeg';



function Header() {
  return (
    <Navbar className="header" bg="light" expand="sm">
      <Navbar.Brand href="/">
        <img width="140"
              height="50" src ={BookLogo}/>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/books/search">Szukaj</Nav.Link>
          <Nav.Link href="/user">Moje wypożyczenia</Nav.Link>
          <Nav.Link href="/books/add">Dodaj książkę</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;