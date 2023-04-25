import {
  ChangeEventHandler,
  Dispatch,
  FormEvent,
  FunctionComponent,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button, Form, ListGroup, Modal, Spinner } from "react-bootstrap";
import { postticket } from "../api";
import { useUser } from "../context/UserContext";
import { Ticket } from "./ListTicket";
import { usePopUp } from "../context/PopUpcontext";
import { useTickets } from "../context/TicketsContext";

const NewTicketsModal: FunctionComponent<PropsWithChildren<{
  show: boolean;
  onHide?: () => void;
}>> = ({ show, onHide }) => {
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] = useState<"open" | "closed">("open");
  const [subject, setSubject] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { setState: setPopUp } = usePopUp();
  const { setTicket } = useTickets();

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
    setLoading(true);
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
      if (!sendTicket.data) {
        setPopUp({
          message: {
            success: "Ticket save successsfully",
            error: "Error try again",
          },
          show: true,
          isSuccess: false,
        });
      }
      setTicket((p) => [sendTicket.data, ...p]);
      setPopUp({
        message: {
          success: "Ticket save successsfully",
          error: "Error try again",
        },
        show: true,
        isSuccess: true,
      });
    } catch (error) {
      setPopUp({
        message: {
          success: "Ticket save successsfully",
          error: "Error try again",
        },
        show: true,
        isSuccess: false,
      });
    }
    setLoading(false);
    handleHide();
  };

  const handleHide = () => {
    if (onHide) {
      onHide();
    }
    setLoading(false);
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setStatus("open");
    setSubject("");
    setAttachments([]);
  };

  return (
    <Modal backdrop="static" keyboard={false} show={show} onHide={handleHide}>
      <Modal.Header closeButton={!loading}>
        <h2>Créer un ticket de support</h2>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="subject">
            <Form.Label>Sujet</Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={subject}
              autoFocus
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
            <Form.Control
              type="file"
              multiple
              onChange={handleFileInputChange}
            />
            {attachments.length > 0 && (
              <ListGroup>
                {attachments.map((attachment, index) => (
                  <ListGroup.Item key={index}>
                    {attachment.name} ({attachment.type}, {attachment.size}{" "}
                    bytes)
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-2"
        >
          Send {loading ? <Spinner animation="border" size="sm" /> : null}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewTicketsModal;
