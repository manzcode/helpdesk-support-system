import mime from "mime-types";
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { Image } from "react-bootstrap";
import pdfImage from "../assets/images/pdfimage.png";

export const FileViewer: FunctionComponent<PropsWithChildren<{
  url: string;
}>> = ({ url }) => {
  const [fileType, setFileType] = useState<string | false>("");
  useEffect(() => {
    const typemime = async () => {
      try {
        const response = await fetch(url);
        const contentType = response.headers.get("content-type");
        if (contentType) {
          const mimeType = contentType.split(";")[0].trim();
          setFileType(mime.extension(mimeType));
        }
      } catch (error) {
        console.log(error);
      }
    };
    typemime();
  }, []);
  if (fileType !== "pdf") {
    return <Image src={url} alt="..." fluid height={100} width={100} />;
  }

  return <Image src={pdfImage} alt="..." fluid height={100} width={100} />;
};
