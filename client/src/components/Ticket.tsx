import React from "react";
import { Badge, Card, ListGroup } from "react-bootstrap";
import {
  FaUser,
  FaCalendarAlt,
  FaEnvelope,
  FaFlag,
  FaCheck,
  FaClock,
} from "react-icons/fa";

interface TicketProps {
  subject: string;
  description: string;
  status: "open" | "closed";
  dueDate: Date;
  priority: "low" | "medium" | "high";
  userName: string;
  userEmail: string;
  createdDate: Date;
  assignedTo: string;
  numReplies: number;
  latestReply: {
    author: string;
    date: Date;
    message: string;
  };
}

const Ticket: React.FC<TicketProps> = ({
  subject,
  description,
  status,
  dueDate,
  priority,
  userName,
  userEmail,
  createdDate,
  assignedTo,
  numReplies,
  latestReply,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
      date
    );
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <Card>
      <Card.Header>
        <h4>{subject}</h4>
        <Badge bg={status === "open" ? "danger" : "success"} className="ml-2">
          {status === "open" ? "Ouvert" : "Fermé"}
        </Badge>
      </Card.Header>
      <Card.Body>
        <Card.Text>{description}</Card.Text>
        <ListGroup>
          <ListGroup.Item>
            <FaFlag className="mr-2" />
            Priorité : {priority}
          </ListGroup.Item>
          <ListGroup.Item>
            <FaUser className="mr-2" />
            Créé par : {userName} ({userEmail})
          </ListGroup.Item>
          <ListGroup.Item>
            <FaCalendarAlt className="mr-2" />
            Date de création : {formatDateTime(createdDate)}
          </ListGroup.Item>
          <ListGroup.Item>
            <FaClock className="mr-2" />
            Date limite : {formatDate(dueDate)}
          </ListGroup.Item>
          {assignedTo && (
            <ListGroup.Item>
              <FaEnvelope className="mr-2" />
              Assigné à : {assignedTo}
            </ListGroup.Item>
          )}
          <ListGroup.Item>Réponses : {numReplies}</ListGroup.Item>
          {latestReply && (
            <ListGroup.Item>
              <ListGroup>
                <ListGroup.Item variant="secondary">
                  {latestReply.author} ({formatDateTime(latestReply.date)})
                </ListGroup.Item>
                <ListGroup.Item>{latestReply.message}</ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default Ticket;
