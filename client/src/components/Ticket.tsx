import React, {
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { Badge, Button, Card, Form, ListGroup } from "react-bootstrap";
import {
  FaUser,
  FaCalendarAlt,
  FaEnvelope,
  FaFlag,
  FaCheck,
  FaClock,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { closeTicket, showAticket } from "../api";
import { useUser } from "../context/UserContext";
import { replyticket } from "../api";
import { ModalCustom } from "./ModalCustom";

type TicketResponse = {
  ticketFiles: {
    id: string;
    description: string;
    priority: string;
    status: string;
    subject: string;
    date_limit: string;
    created_at: string;
    assigned: null | string;
    userId: string;
    files: {
      id: string;
      url: string;
      userId: string;
    }[];
    user: {
      id: String;
      username: String;
      email: String;
      password: String;
      role: String;
    };
  };
  ticketReply: {
    id: string;
    content: string;
    assigned: string;
    createdAt: string;
    ticketId: string;
    files: {
      id: string;
      url: string;
      userId: string;
    }[];
    assignation: {
      id: String;
      username: String;
      email: String;
      password: String;
      role: String;
    };
  }[];
};

const Ticket = () => {
  const [state, setState] = useState<TicketResponse>({
    ticketFiles: {
      id: "",
      description: "",
      priority: "",
      status: "",
      subject: "",
      date_limit: "",
      created_at: "",
      assigned: "",
      userId: "",
      files: [],
      user: {
        id: "",
        username: "",
        email: "",
        password: "",
        role: "",
      },
    },
    ticketReply: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<any[]>([]);
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const [error, setError] = useState(false);
  const [confirm, setConfirm] = useState(false);

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

  const handleCloseModal = () => {
    setShowModal(false);
    setContent("");
    setConfirm(false);
    setAttachments([]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    attachments.forEach((attachment) => {
      formData.append("files", attachment);
    });
    formData.append("content", content);
    formData.append("ticketId", id as string);

    try {
      const sendReply = await replyticket(user?.id as string, formData);
      // Ajouter ici le code pour envoyer le ticket au serveur
      setShowModal(true);
      if (!sendReply.data) {
        setState((prevState) => {
          return {
            ...prevState,
            ticketReply: [...prevState.ticketReply, sendReply.data],
          };
        });

        setError(true);
      }
    } catch (error) {
      setShowModal(true);
      setError(true);
    }
  };

  const changeStatus = async () => {
    if (state.ticketFiles.status === "closed") {
      return;
    }
    try {
      const res = await closeTicket(state.ticketFiles.id);

      setShowModal(true);
      if (res.data) {
        setState((prevState) => {
          return {
            ...prevState,
            ticketFiles: {
              ...prevState.ticketFiles,
              status: "closed",
            },
          };
        });
        return;
      }
      setError(true);
      setConfirm(false);
    } catch (error) {
      setShowModal(true);
      setError(true);
      setConfirm(false);
    }
  };

  useEffect(() => {
    const getAticket = async (ticketId: string) => {
      try {
        const res = await showAticket(ticketId);
        return res ? res.data : null;
      } catch (error) {
        return null;
      }
    };
    getAticket(id as string).then((res) => {
      setState(res);
    });
  }, [id]);

  return (
    <Card>
      <Card.Header className="d-flex justify-content-around">
        <h4>{state.ticketFiles.subject}</h4>
        <Badge
          bg={`${state.ticketFiles.status === "open" ? "danger" : "success"}`}
          className="d-flex align-items-center fs-6"
          onClick={() => {
            if (state.ticketFiles.status !== "open") {
              return;
            }
            setConfirm(true);
          }}
          style={{ cursor: "pointer" }}
        >
          {state.ticketFiles.status === "open" ? "Ouvert" : "Fermé"}
        </Badge>
      </Card.Header>
      <Card.Body>
        <Card.Text>{state.ticketFiles.description}</Card.Text>
        <ListGroup>
          <ListGroup.Item>
            <FaFlag className="me-2" />
            Priorité : {state.ticketFiles.priority}
          </ListGroup.Item>
          <ListGroup.Item>
            <FaUser className="me-2" />
            Créé par : {state.ticketFiles.user.username}
          </ListGroup.Item>
          <ListGroup.Item>
            <FaCalendarAlt className="me-2" />
            Date de création :{" "}
            {new Date(state.ticketFiles.created_at).toLocaleDateString()} à
            {new Date(state.ticketFiles.created_at).toLocaleTimeString()}
          </ListGroup.Item>
          <ListGroup.Item>
            <FaClock className="me-2" />
            Date limite :{" "}
            {new Date(state.ticketFiles.date_limit).toLocaleDateString()} à
            {new Date(state.ticketFiles.date_limit).toLocaleTimeString()}
          </ListGroup.Item>
          <ListGroup>
            {state.ticketFiles.files.map((attachment) => (
              <ListGroup.Item key={attachment.id}>
                <a href={`${attachment.url}`} download>
                  {" "}
                  {attachment.id}
                </a>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {state.ticketFiles.status !== "open" ? null : (
            <>
              <h3>Répondre</h3>
              <Form onSubmit={handleSubmit} className="mx-2">
                <Form.Group controlId="content">
                  <Form.Control
                    name="content"
                    as="textarea"
                    rows={5}
                    required
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
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
                          {attachment.name} ({attachment.type},{" "}
                          {attachment.size} bytes)
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
                <Button type="submit" variant="primary" className="my-2">
                  Envoyer
                </Button>
              </Form>
            </>
          )}
          <h3>Replies</h3>
          {state.ticketReply?.map((value) => (
            <ListGroup key={value.id} className="my-2">
              <ListGroup.Item variant="secondary">
                <span className="fw-bold">{value.assignation.username}</span> le{" "}
                <span className="fst-italic">
                  {new Date(value.createdAt).toLocaleDateString()} à
                  {new Date(value.createdAt).toLocaleTimeString()}
                </span>
              </ListGroup.Item>
              <ListGroup.Item>{value.content}</ListGroup.Item>
              <ListGroup>
                {value.files.map((attachment) => (
                  <ListGroup.Item key={attachment.id}>
                    <a href={`${attachment.url}`} download>
                      {" "}
                      {attachment.id}
                    </a>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup>
          ))}
        </ListGroup>
      </Card.Body>

      <ModalCustom
        showModal={confirm}
        handleClose={handleCloseModal}
        handleConfirm={changeStatus}
        confirm={true}
        titre="confirmé la fermeture du ticket"
      >
        vouler vous vraiment fermé le ricket
      </ModalCustom>

      <ModalCustom
        showModal={showModal}
        confirm={false}
        handleClose={handleCloseModal}
        titre={error ? "failed" : "success"}
      >
        {error
          ? "désolé une erreur du serveur. réessayer plus tard."
          : "Votre message a été soumis avec succès. Nous vous répondre le plus tôt possible."}
      </ModalCustom>
    </Card>
  );
};

export default Ticket;
