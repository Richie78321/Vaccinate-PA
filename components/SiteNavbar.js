import { Nav, Navbar } from "react-bootstrap";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SiteNavbar() {
  const router = useRouter();
  const pathName = router.asPath;

  return (
    <Navbar expand="md" className="border-bottom">
      <Link href="/">
        <Navbar.Brand href="/">
          <div>
            <img
              alt="VaccinatePA"
              className="d-inline align-middle"
              src="/images/VaccinatePALogo.svg"
              height="40"
            />
            <h2
              className="d-inline align-middle mb-0 font-weight-bold"
              id="brand-name"
            >
              VaccinatePA
            </h2>
          </div>
        </Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <div className="mt-2 mt-md-0 ml-auto">
          <Nav variant="pills" activeKey={pathName}>
            <Link href="/">
              <Nav.Link href="/" className="main-nav-link px-3">
                Search
              </Nav.Link>
            </Link>
            <Link href="/additional-resources">
              <Nav.Link
                href="/additional-resources"
                className="main-nav-link px-3"
              >
                Additional Resources
              </Nav.Link>
            </Link>
            <Link href="/about-us">
              <Nav.Link href="/about-us" className="main-nav-link px-3">
                About Us
              </Nav.Link>
            </Link>
          </Nav>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}
