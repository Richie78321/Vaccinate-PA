import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import logo from "../images/VaccinatePALogo.svg";

export default function SiteNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/">
        <div>
          <img
            alt="VaccinatePA"
            className="d-inline align-middle"
            src={logo}
            height="40"
          />
          <h2 className="d-inline align-middle mb-0 text-warning font-weight-bold">
            VaccinatePA
          </h2>
        </div>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/availability">
            Vaccine Availability
          </Nav.Link>
          <Nav.Link as={Link} to="/additional-resources">
            Additional Resources
          </Nav.Link>
          <Nav.Link as={Link} to="/about-us">
            About Us
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
