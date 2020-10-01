import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function Header(props) {
  return (
    <Navbar bg="light">
      <Navbar.Brand href="#/">tbtc.insure</Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#/purchase">Purchase</Nav.Link>
          <Nav.Link href="#/marketplace">Marketplace</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
