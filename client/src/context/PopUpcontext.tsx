import {
  createContext,
  useContext,
  useState,
  useEffect,
  FunctionComponent,
  PropsWithChildren,
} from "react";
import { Alert, Container } from "react-bootstrap";

interface NotificationProps {
  show?: boolean;
  message?: {
    success: string;
    error: string;
  };
  isSuccess?: boolean;
}

const PopUpContext = createContext<{
  state: NotificationProps | null;
  setState: (state: NotificationProps | null) => void;
}>({
  state: null,
  setState: () => {},
});

export const usePopUp = () => useContext(PopUpContext);

export const PopUpProvider: FunctionComponent<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [state, setState] = useState<NotificationProps | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [state]);

  return (
    <PopUpContext.Provider value={{ state, setState }}>
      {state && state.show ? (
        <Alert
          variant={state.isSuccess ? "success" : "danger"}
          onClose={() => setState(null)}
          dismissible
        >
          {state.isSuccess ? state.message?.success : state.message?.error}
        </Alert>
      ) : null}
      {children}
    </PopUpContext.Provider>
  );
};
