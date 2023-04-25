import { useState, useEffect } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { useUser } from "../context/UserContext";
import { getAllTicket, getaticket } from "../api";
import Single from "./Single";
import moment from "moment";
import { HiChevronRight } from "react-icons/hi";
import SideBarNav from "./SideBarNav";
import NewTicketsModal from "./NewTicketsModal";
import { useTickets } from "../context/TicketsContext";

export type Ticket = {
  id: string;
  description: string;
  priority: "high" | "low" | "medium";
  status: string;
  subject: string;
  date_limit: string;
  created_at: string;
  assigned: null | string;
  _count: {
    files: number;
    replies: number;
  };
};

const SupportTicketList = () => {
  const { tickets, setTicket } = useTickets();
  const [showNav, setShowNav] = useState<boolean>(false);
  const { user } = useUser();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState(false);

  const showSideBar = () => {
    setShowNav((p) => !p);
  };

  useEffect(() => {
    function handleResize() {
      setShowNav(false);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchTickets = async () => {
    setError(false);
    try {
      let getUserTicket;
      if (user?.role === "admin") {
        getUserTicket = await getAllTicket();
      } else {
        getUserTicket = await getaticket(user?.id as string);
      }
      setTicket([...getUserTicket?.data]);
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  return (
    <main className="mt-2 h-100">
      <NewTicketsModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      />
      <Container className="h-100">
        {showNav ? (
          <SideBarNav handleClick={showSideBar} style="d-flex d-md-none" />
        ) : (
          <>
            <Row className="my-2">
              <Col className="d-flex align-items-center">
                <span>
                  <HiChevronRight
                    className="d-md-none d-flex"
                    size={25}
                    color="#4f35d8"
                    onClick={showSideBar}
                  />
                </span>
                <h1 className="m-0">Tickets</h1>
              </Col>
              <Col className="d-flex justify-content-end py-2">
                <Button
                  variant="primary"
                  className="fw-bold"
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  New tickets
                </Button>
              </Col>
            </Row>
            {error ? (
              <Alert
                variant="danger"
                dismissible
                onClose={() => setError(false)}
              >
                Error when getting Tickets{" "}
                <Alert.Link onClick={fetchTickets}>Try again</Alert.Link>
              </Alert>
            ) : null}
            {tickets.map((ticket) => (
              <Single
                key={ticket.id}
                files={ticket._count.files}
                answer={ticket._count.replies}
                id={ticket.id}
                title={ticket.subject}
                date={moment(`${ticket.date_limit}`)
                  .endOf("days")
                  .fromNow()}
                createdAt={moment(`${ticket.created_at}`).fromNow()}
                status={ticket.status}
                priority={ticket.priority}
                content={ticket.description}
              />
            ))}
          </>
        )}
      </Container>
    </main>
  );
};

export default SupportTicketList;
