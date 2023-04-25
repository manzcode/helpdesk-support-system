import {
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";
import { Alert, Badge, Card, ListGroup } from "react-bootstrap";
import { TiMessage } from "react-icons/ti";
import { GrAttachment } from "react-icons/gr";
import { HiOutlineLockOpen, HiOutlineLockClosed } from "react-icons/hi";
import ReplyList, { Files } from "./RepliesList";
import { getFiles } from "../api";
import { FileViewer } from "./FileViewer";

const Single: FunctionComponent<PropsWithChildren<{
  id: string;
  date: string;
  title: string;
  content: string;
  createdAt: string;
  answer?: number;
  status: string;
  priority: "low" | "medium" | "high";
  files?: number;
}>> = ({
  title,
  date,
  content,
  id,
  answer = 0,
  files = 0,
  status,
  createdAt,
  priority,
}) => {
  const color: { medium: "primary"; high: "danger"; low: "success" } = {
    medium: "primary",
    high: "danger",
    low: "success",
  };
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [showAttachement, setShowAttachement] = useState<Files[]>([]);
  const [toggleFiles, setToggleFiles] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async () => {
    setError(false);
    try {
      const res = await getFiles({ type: "ticketid", id });
      setShowAttachement([...res.data]);
    } catch (e) {
      setToggleFiles(false);
      setError(true);
      return;
    }
    setToggleFiles((p) => !p);
  };
  return (
    <>
      <Card className="my-2 shadow-sm border-0">
        <Card.Body>
          <div className="d-md-flex justify-content-md-between mb-2">
            <div>
              <h5 className="mb-0"> {title} </h5>
              <div className="d-none d-md-flex">
                <small className="d-flex align-items-center">
                  {createdAt} -{" "}
                </small>
                <span className="ps-1">
                  {status === "open" ? (
                    <HiOutlineLockOpen className="text-danger" />
                  ) : (
                    <HiOutlineLockClosed className="text-success" />
                  )}
                </span>
              </div>
            </div>
            <Badge
              text="dark"
              bg="white"
              className="d-flex align-items-center align-items-md-start"
            >
              <small className="fw-lighter d-md-none pe-1">
                {createdAt} .{" "}
              </small>
              <span>expire {date} </span>
              <span className="d-md-none ps-1">
                -
                {status === "open" ? (
                  <HiOutlineLockOpen className="text-danger ms-1" />
                ) : (
                  <HiOutlineLockClosed className="text-success ms-1" />
                )}
              </span>
            </Badge>
          </div>

          <p className="lh-sm me-md-5 text-break">{content}</p>

          <div className="d-flex flex-row">
            <Badge
              bg={`${color[priority]}`}
              text={`${color[priority]}`}
              className="bg-opacity-10 d-flex align-items-center text-capitalize mx-1"
            >
              {priority}
            </Badge>
            <Badge
              text="dark"
              bg="white"
              className="d-flex align-items-center mx-1 border"
            >
              #{id.slice(0, 6)}
            </Badge>
            <Badge
              text="dark"
              bg="white"
              className="d-flex btn align-items-center border-0"
              onClick={() => {
                setShowReplies((p) => !p);
              }}
            >
              <TiMessage size={20} /> <span className="fs-5">{answer}</span>{" "}
            </Badge>
            {files > 1 ? (
              <Badge
                text="dark"
                bg="white"
                className="d-flex btn align-items-center border-0"
                onClick={handleClick}
              >
                <GrAttachment size={15} /> <span className="fs-5">{files}</span>
              </Badge>
            ) : null}
          </div>
        </Card.Body>
        {error ? (
          <Alert
            variant="danger"
            className="mx-2"
            dismissible
            onClose={() => setError(false)}
          >
            Can't get the files{" "}
            <Alert.Link onClick={handleClick}> Try again</Alert.Link>
          </Alert>
        ) : null}
        {toggleFiles ? (
          <ListGroup horizontal className="m-2">
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
      </Card>
      {showReplies ? <ReplyList ticketId={id} /> : null}
    </>
  );
};

export default Single;
