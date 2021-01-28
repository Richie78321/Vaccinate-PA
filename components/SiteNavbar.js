import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Link from "next/link";

export default function SiteNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Link href="/">
        <Navbar.Brand href="/">
          <div>
            <img
              alt="VaccinatePA"
              className="d-inline align-middle"
              src="/images/VaccinatePALogo.svg"
              height="40"
            />
            <h2 className="d-inline align-middle mb-0 text-warning font-weight-bold">
              VaccinatePA
            </h2>
          </div>
        </Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link href="/">
            <Nav.Link href="/">County Search</Nav.Link>
          </Link>
          <Link href="/additional-resources">
            <Nav.Link href="/additional-resources">
              Additional Resources
            </Nav.Link>
          </Link>
          <Link href="/about-us">
            <Nav.Link href="/about-us">About Us</Nav.Link>
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
