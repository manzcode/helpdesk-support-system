import { FunctionComponent, PropsWithChildren } from "react";
import { Button, Modal } from "react-bootstrap";

type Myprops = PropsWithChildren<{
  showModal: boolean;
  handleClose: () => void;
  handleConfirm?: () => void;
  confirm?: boolean;
  titre: string;
}>;

export const ModalCustom: FunctionComponent<Myprops> = ({
  showModal,
  handleClose,
  handleConfirm,
  confirm = false,
  children,
  titre,
}) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton={!confirm}>
        <Modal.Title>{titre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {confirm ? (
          <Button variant="primary" onClick={handleConfirm}>
            Confirmer
          </Button>
        ) : null}
        <Button variant="secondary" onClick={handleClose}>
          {confirm ? "Annuler" : "Fermé"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
