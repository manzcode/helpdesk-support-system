import { useEffect } from "react";
import ListTicket from "./components/ListTicket";
import { Col, Container, Row } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Log from "./components/Log";
import { jwtFuncDecode, useAuth } from "./context/AuthContext";
import Footer from "./components/Footer";
import { useUser } from "./context/UserContext";
import { getUser } from "./api";
import SideBarNav from "./components/SideBarNav";
import { PopUpProvider } from "./context/PopUpcontext";

const ProtectedRoutes = ({
  condition,
  redirection = "/",
}: {
  condition: boolean;
  redirection: string;
}) => {
  if (condition) {
    return <Outlet />;
  }
  return <Navigate to={redirection} replace />;
};

function App() {
  const { authenticated } = useAuth();
  const { setUser } = useUser();
  const decode = jwtFuncDecode();
  const getuser = async (userId: string) => {
    try {
      const aUser = await getUser(userId);
      const res = aUser.data;
      setUser(res);
      return true;
    } catch (error) {
      return false;
    }
  };
  useEffect(() => {
    if (typeof decode !== "boolean") {
      getuser(decode?.id);
    }
  }, [authenticated]);

  return (
    <Router>
      <Row className="h-100">
        {authenticated ? (
          <Col md={2} className="border-end d-md-flex d-none">
            <SideBarNav />
          </Col>
        ) : null}

        <Col md={10}>
          <Container className="h-100">
            <PopUpProvider>
              <Routes>
                <Route
                  element={
                    <ProtectedRoutes
                      condition={!authenticated}
                      redirection="/lists"
                    />
                  }
                >
                  <Route path="/" element={<Log />} />
                </Route>
                <Route
                  element={
                    <ProtectedRoutes
                      condition={authenticated}
                      redirection="/"
                    />
                  }
                >
                  <Route path="/lists" element={<ListTicket />} />
                </Route>
              </Routes>
            </PopUpProvider>
          </Container>
        </Col>
      </Row>
    </Router>
  );
}

export default App;
