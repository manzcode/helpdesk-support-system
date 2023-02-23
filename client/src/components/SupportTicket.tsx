import React, {
  ChangeEventHandler,
  FormEvent,
  MouseEvent,
  SyntheticEvent,
  useState,
} from "react";
import { Form, Button, Modal, ListGroup } from "react-bootstrap";
import { useUser } from "../context/UserContext";
import { postticket } from "../api";
import { ModalCustom } from "./ModalCustom";

const SupportTicket = () => {
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] = useState<"open" | "closed">("open");
  const [subject, setSubject] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const { user } = useUser();
  const [error, setError] = useState(false);

  const handleFileInputChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setAttachments((p) => [...p, ...selectedFiles]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    attachments.forEach((attachment) => {
      formData.append("files", attachment);
    });
    formData.append("subject", subject);
    formData.append("priority", priority);
    formData.append("date_limit", dueDate);
    formData.append("status", status);
    formData.append("description", description);

    try {
      const sendTicket = await postticket(user?.id as string, formData);
      // Ajouter ici le code pour envoyer le ticket au serveur
      setShowModal(true);
      if (!sendTicket.data) {
        setError(true);
      }
    } catch (error) {
      setShowModal(true);
      setError(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSubject("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setStatus("open");
    setError(false);
    setAttachments([]);
  };

  return (
    <div className="col-6 mx-auto">
      <h2>Créer un ticket de support</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="subject">
          <Form.Label>Sujet</Form.Label>
          <Form.Control
            type="text"
            name="subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="dueDate">
          <Form.Label>Date limite</Form.Label>
          <Form.Control
            type="date"
            name="date-limit"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="priority">
          <Form.Label>Priorité</Form.Label>
          <Form.Control
            as="select"
            name="priority"
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
            name="status"
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
            name="description"
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

      <ModalCustom
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        titre={error ? "failed" : "success"}
      >
        {error
          ? "désolé une erreur du serveur. réessayer plus tard."
          : "Votre ticket a été soumis avec succès. Nous vous contacterons bientôt."}
      </ModalCustom>
    </div>
  );
};

export default SupportTicket;
