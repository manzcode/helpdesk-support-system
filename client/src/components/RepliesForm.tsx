import {
  ChangeEventHandler,
  FormEvent,
  FunctionComponent,
  PropsWithChildren,
  useRef,
  useState,
} from "react";
import { TbSend } from "react-icons/tb";
import { GrAttachment } from "react-icons/gr";
import { AiOutlineClose } from "react-icons/ai";
import { Form, InputGroup, ListGroup, Spinner } from "react-bootstrap";
import { replyticket } from "../api";
import { useUser } from "../context/UserContext";
import { usePopUp } from "../context/PopUpcontext";
import { useTickets } from "../context/TicketsContext";

export type Reply = {
  assignation: {
    id: string;
    role: string;
    username: string;
  };
  assigned: string;
  content: string;
  createdAt: string;
  _count: {
    files: number;
  };
  id: string;
  ticketId: string;
};

const RepliesForm: FunctionComponent<PropsWithChildren<{
  ticketId: string;
  newAnswer: React.Dispatch<React.SetStateAction<Reply[]>>;
}>> = ({ ticketId, newAnswer }) => {
  const [myAnswer, setMyAnswer] = useState("");
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [attachments, setAttachments] = useState<any[]>([]);
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

  const handlesubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (myAnswer === "") {
      return;
    }
    setLoading(true);
    const formData = new FormData();
    attachments.forEach((attachment) => {
      formData.append("files", attachment);
    });
    formData.append("content", myAnswer);
    formData.append("ticketId", ticketId);
    try {
      const res = await replyticket(user?.id as string, formData);
      newAnswer((p) => [...p, res.data]);
      setPopUp({
        message: {
          success: "answer posted!",
          error: "Error try again",
        },
        show: true,
        isSuccess: true,
      });
      setTicket((p) =>
        p.map((ticket) => {
          if (ticket.id === ticketId) {
            return {
              ...ticket,
              _count: {
                files: ticket._count.files,
                replies: ticket._count.replies + 1,
              },
            };
          }
          return ticket;
        })
      );
    } catch (error) {
      setPopUp({
        message: {
          success: "answer posted!",
          error: "Error try again",
        },
        show: true,
        isSuccess: false,
      });
    }
    setMyAnswer("");
    setAttachments([]);
    setLoading(false);
  };

  return (
    <Form onSubmit={handlesubmit}>
      <input
        type="file"
        multiple
        ref={(input) => (fileInput.current = input)}
        className="d-none"
        onChange={handleFileInputChange}
      />
      <Form.Group controlId="formComment">
        <InputGroup className="mb-3">
          <Form.Control
            className="border-end-0 rounded-start"
            disabled={loading}
            value={myAnswer}
            onChange={(event) => setMyAnswer(event.target.value)}
            placeholder="Solutions..."
          />
          <InputGroup.Text
            className="bg-white border-x-0"
            id="basic-addon2"
            onClick={() => {
              fileInput.current?.click();
            }}
          >
            <GrAttachment size={15} className="text-primary" />
          </InputGroup.Text>
          <InputGroup.Text
            className="bg-white border-start-0 text-primary"
            onClick={handlesubmit}
            id="basic-addon2"
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <TbSend size={20} />
            )}
          </InputGroup.Text>
        </InputGroup>
      </Form.Group>
      <ListGroup>
        {attachments.map((attachment, index) => (
          <ListGroup.Item
            key={index}
            variant="secondary"
            className="d-flex justify-content-between"
          >
            <div
              className="w-75 lh-sm text-break"
              style={{ fontSize: "0.6rem" }}
            >
              {attachment.name} ({attachment.type}, {attachment.size} bytes)
            </div>
            <AiOutlineClose onClick={() => handleRemoveAttachment(index)} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Form>
  );
};

export default RepliesForm;
