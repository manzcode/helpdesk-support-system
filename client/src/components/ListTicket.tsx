import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useUser } from "../context/UserContext";
import { getAllTicket, getaticket } from "../api";
import { useNavigate } from "react-router-dom";

const SupportTicketList = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let getUserTicket;
        if (user?.role === "admin") {
          getUserTicket = await getAllTicket();
        } else {
          getUserTicket = await getaticket(user?.id as string);
        }

        setTickets(getUserTicket?.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTickets();
  }, [user]);

  return (
    <div>
      <h2>Liste des tickets de support</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            {user?.role === "user" ? null : (
              <>
                <th>Nom</th>
                <th>Email</th>
              </>
            )}
            <th>Sujet</th>
            <th>Statut</th>
            <th>priority</th>
            <th>data limit</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              onClick={() => {
                navigate(`/ticket/${ticket.id}`);
              }}
            >
              <td>{ticket.id}</td>
              {user?.role === "user" ? null : (
                <>
                  <td>{ticket.user.username}</td>
                  <td>{ticket.user.email}</td>
                </>
              )}
              <td>{ticket.subject}</td>
              <td>{ticket.status}</td>
              <td>{ticket.priority}</td>
              <td>{new Date(ticket.date_limit).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SupportTicketList;
