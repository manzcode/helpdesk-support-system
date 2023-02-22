import { useState } from "react";
import SupportTicket from "./components/SupportTicket";
import SupportTicketList from "./components/ListTicket";
import { Button, Container } from "react-bootstrap";
import Ticket from "./components/Ticket";
import CustomNavbar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <CustomNavbar>
        <Button className="me-2">Login</Button>
      </CustomNavbar>
      <Container>
        <Routes>
          <Route
            path="/ticket"
            element={
              <Ticket
                subject={"test"}
                description={"test de projet"}
                status={"open"}
                dueDate={new Date()}
                priority={"high"}
                userName={"John Doe"}
                userEmail={"john@example.com"}
                createdDate={new Date()}
                assignedTo={""}
                numReplies={0}
                latestReply={{
                  author: "Bob Johnson",
                  date: new Date(),
                  message: "faire cela: ...",
                }}
              />
            }
          />
          <Route path="/create" element={<SupportTicket />} />
          <Route path="/lists" element={<SupportTicketList />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
