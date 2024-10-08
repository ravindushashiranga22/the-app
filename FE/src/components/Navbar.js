import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// Import your logo (adjust the path based on where the logo is stored)
import logo from './tea app logo 2.png';

export default function CustomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="shadow-lg p-3  bg-white rounded">
      <Container>
        <Navbar.Brand href="#">
          {/* Add the logo */}
          <img
            src={logo}
            alt="Tea App Logo"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          Tea App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto"> {/* Align Orders and Log Out to the right */}
            {location.pathname !== '/orders' && (
              <Nav.Link href="/orders">Orders</Nav.Link>
            )}
            <Nav.Link href="#" onClick={handleLogout}>
              Log Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}