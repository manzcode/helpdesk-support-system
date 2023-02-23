import { FunctionComponent, PropsWithChildren } from "react";
import { Button, Modal } from "react-bootstrap";

type Myprops = PropsWithChildren<{
  showModal: boolean;
  handleCloseModal: () => void;
  titre: string;
}>;

export const ModalCustom: FunctionComponent<Myprops> = ({
  showModal,
  handleCloseModal,
  children,
  titre,
}) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{titre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleCloseModal}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
