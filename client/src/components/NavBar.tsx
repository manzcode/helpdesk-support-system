import { Navbar, Container, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function CustomNavbar({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { authenticated, setAuthenticated } = useAuth();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  return (
    <Navbar bg="light" className="mb-2">
      <Container>
        <Navbar.Brand>Help</Navbar.Brand>
      </Container>
      {children}
      {authenticated ? (
        <>
          <span className="mx-3 fw-bold">{user?.username}</span>{" "}
          <Button
            className="me-2"
            onClick={() => {
              navigate("/lists");
            }}
          >
            Lists
          </Button>
          <Button
            variant="info"
            className="me-2"
            onClick={() => {
              navigate("/create");
            }}
          >
            Create
          </Button>
          <Button
            variant="danger"
            className="me-2"
            onClick={() => {
              localStorage.clear();
              setAuthenticated(false);
              setUser(null);
              navigate("/");
            }}
          >
            logout
          </Button>
        </>
      ) : null}
    </Navbar>
  );
}
