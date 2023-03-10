import { useEffect, useState } from "react";
import SupportTicket from "./components/SupportTicket";
import SupportTicketList from "./components/ListTicket";
import { Button, Container } from "react-bootstrap";
import Ticket from "./components/Ticket";
import CustomNavbar from "./components/NavBar";
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
  const { authenticated, setAuthenticated } = useAuth();
  const { user, setUser } = useUser();
  const decode = jwtFuncDecode();

  useEffect(() => {
    const getuser = async (userId: string) => {
      try {
        const Auser = await getUser(userId);
        const res = Auser.data;
        setUser(res);
        return true;
      } catch (error) {
        return false;
      }
    };
    if (authenticated && typeof decode !== "boolean") {
      getuser(decode?.id);
    }
  }, [authenticated, decode]);

  return (
    <Router>
      <CustomNavbar />
      <Container className="h-100">
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
              <ProtectedRoutes condition={authenticated} redirection="/" />
            }
          >
            <Route path="/create" element={<SupportTicket />} />
            <Route path="/lists" element={<SupportTicketList />} />
            <Route path="/ticket/:id" element={<Ticket />} />
          </Route>
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
