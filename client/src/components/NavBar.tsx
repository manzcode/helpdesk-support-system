import { Navbar, Container } from "react-bootstrap";

export default function CustomNavbar({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Navbar bg="light" className="mb-2">
      <Container>
        <Navbar.Brand>Brand text</Navbar.Brand>
      </Container>
      {children}
    </Navbar>
  );
}
