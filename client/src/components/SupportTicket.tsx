import React, {
  ChangeEventHandler,
  FormEvent,
  MouseEvent,
  SyntheticEvent,
  useState,
} from "react";
import { Form, Button, Modal, ListGroup } from "react-bootstrap";

const SupportTicket = () => {
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] = useState<"open" | "closed">("open");
  const [ticket, setTicket] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [attachments, setAttachments] = useState<any[]>([]);

  const handleFileInputChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const selectedFiles = event.target.files;
    const filesArray = [];

    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length && i < 10; i++) {
        filesArray.push(selectedFiles[i]);
      }

      setAttachments(filesArray);
    }
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setTicket({ ...ticket, [event.target.name]: event.target.value });
  };

  const handleRemoveAttachment = (index: number) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // Ajouter ici le code pour envoyer le ticket au serveur
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTicket({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div>
      <h2>Créer un ticket de support</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="subject">
          <Form.Label>Sujet</Form.Label>
          <Form.Control
            type="text"
            name="subject"
            value={ticket.subject}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="dueDate">
          <Form.Label>Date limite</Form.Label>
          <Form.Control
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="priority">
          <Form.Label>Priorité</Form.Label>
          <Form.Control
            as="select"
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as "low" | "medium" | "high")
            }
          >
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="status">
          <Form.Label>Statut</Form.Label>
          <Form.Control
            as="select"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "open" | "closed")
            }
          >
            <option value="open">Ouvert</option>
            <option value="closed">Fermé</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="attachments">
          <Form.Label>Pièces jointes (max 10)</Form.Label>
          <Form.Control type="file" multiple onChange={handleFileInputChange} />
          {attachments.length > 0 && (
            <ListGroup>
              {attachments.map((attachment, index) => (
                <ListGroup.Item key={index}>
                  {attachment.name} ({attachment.type}, {attachment.size} bytes)
                  <Button
                    variant="link"
                    onClick={() => handleRemoveAttachment(index)}
                    className="ml-3"
                  >
                    Supprimer
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2">
          Envoyer
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Merci!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Votre ticket a été soumis avec succès. Nous vous contacterons bientôt.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SupportTicket;
