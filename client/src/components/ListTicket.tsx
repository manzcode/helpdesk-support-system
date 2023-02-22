import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

interface ListTicket {
  id: number;
  name: string;
  email: string;
  subject: string;
  status: string;
  priority: string;
  date_limit: string;
}

const SupportTicketList = () => {
  const [tickets, setTickets] = useState<ListTicket[]>([]);

  useEffect(() => {
    // Ajouter ici le code pour récupérer la liste des tickets depuis le serveur
    const fetchedTickets = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        subject: "Problème avec le site",
        status: "En cours",
        priority: "moyen",
        date_limit: "12-03-23",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        subject: "Demande de renseignements",
        status: "Résolu",
        priority: "moyen",
        date_limit: "12-03-23",
      },
      {
        id: 3,
        name: "Bob Johnson",
        email: "bob@example.com",
        subject: "Erreur lors de la commande",
        status: "En cours",
        priority: "moyen",
        date_limit: "12-03-23",
      },
    ];
    setTickets(fetchedTickets);
  }, []);

  return (
    <div>
      <h2>Liste des tickets de support</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Sujet</th>
            <th>Statut</th>
            <th>priority</th>
            <th>data limit</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.name}</td>
              <td>{ticket.email}</td>
              <td>{ticket.subject}</td>
              <td>{ticket.status}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.date_limit}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SupportTicketList;
