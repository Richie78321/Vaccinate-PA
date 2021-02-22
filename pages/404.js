import Layout from "../layouts/Layout";
import Link from "next/link";
import { Button } from "react-bootstrap";

export default function FourOhFour() {
  return (
    <Layout title="Page Not Found">
      <div className="m-5 text-center">
        <h1>Page Not Found</h1>
        <p>Sorry, this page doesn't seem to exist.</p>
        <Link href="/">
          <Button variant="warning" className="rounded-pill my-2">
            Go Back Home
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
