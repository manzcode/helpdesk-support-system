import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { Badge, ListGroup, Image, Alert } from "react-bootstrap";
import RepliesForm, { Reply } from "./RepliesForm";
import { getFiles, showReplies } from "../api";
import moment from "moment";
import { GrAttachment } from "react-icons/gr";
import { FileViewer } from "./FileViewer";

export type Files = {
  id: string;
  files: { id: string; url: string }[];
};

export function RepliesContent({
  name,
  createdAt,
  content,
  attachement = 0,
  id,
}: PropsWithChildren<{
  name: string;
  createdAt: string;
  content: string;
  attachement?: number;
  id: string;
}>) {
  const [toggleFiles, setToggleFiles] = useState(false);
  const [showAttachement, setShowAttachement] = useState<Files[]>([]);
  const [error, setError] = useState(false);

  const handleClick = async () => {
    setError(false);
    try {
      const res = await getFiles({ type: "replyid", id });
      setShowAttachement([...res.data]);
    } catch (error) {
      setError(true);
      return;
    }
    setToggleFiles((p) => !p);
  };

  return (
    <>
      <div className="h-25  bg-white">
        <div>
          <div className="d-md-flex flex-md-column justify-content-md-between mb-2">
            <div className="d-flex flex-row">
              <div className="d-flex flex-column ms-2 p-2">
                <div className="mb-0 fw-bolder">
                  {" "}
                  {name} <span className="fw-lighter">{content}</span>{" "}
                </div>
                <div className="d-flex">
                  <small className="d-flex text-muted align-items-center">
                    {createdAt}
                  </small>
                  {attachement > 0 ? (
                    <Badge
                      text="dark"
                      bg="white"
                      className="d-flex align-items-center btn border-0"
                      onClick={handleClick}
                    >
                      <GrAttachment size={15} />
                      <span className="fs-5 ms-1">{attachement}</span>
                    </Badge>
                  ) : null}
                </div>
                {error ? (
                  <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setError(false)}
                  >
                    Error when getting Replies{" "}
                    <Alert.Link onClick={handleClick}>Try again</Alert.Link>
                  </Alert>
                ) : null}
                {toggleFiles ? (
                  <ListGroup horizontal>
                    {showAttachement.map((files) => {
                      return files.files.map((file, index) => (
                        <ListGroup.Item key={index} action>
                          <a
                            href={file.url}
                            target="blanck"
                            download
                            className="bnt d-flex flex-row"
                          >
                            <FileViewer url={file.url} />
                            <div className="m-2">file {index}</div>
                          </a>
                        </ListGroup.Item>
                      ));
                    })}
                  </ListGroup>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const ReplyList: FunctionComponent<PropsWithChildren<{
  ticketId: string;
}>> = ({ ticketId }) => {
  const [state, setState] = useState<Reply[]>([]);
  const [error, setError] = useState(false);

  const getReplies = async () => {
    setError(false);
    try {
      const replies = await showReplies(ticketId);
      setState([...replies.data]);
    } catch (e) {
      setError(true);
    }
  };
  useEffect(() => {
    getReplies();
  }, []);

  return (
    <div className="ms-2">
      {error ? (
        <Alert variant="danger" dismissible onClose={() => setError(false)}>
          Error when getting Replies{" "}
          <Alert.Link onClick={getReplies}>Try again</Alert.Link>
        </Alert>
      ) : null}
      {state?.map((reply) => (
        <RepliesContent
          attachement={reply._count?.files}
          name={reply.assignation.username}
          content={reply.content}
          createdAt={moment(reply.createdAt).fromNow()}
          id={reply.id}
          key={reply.id}
        />
      ))}
      <RepliesForm ticketId={ticketId} newAnswer={setState} />
    </div>
  );
};

export default ReplyList;
