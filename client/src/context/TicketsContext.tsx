import {
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Ticket } from "../components/ListTicket";

interface TicketContextData {
  tickets: Ticket[];
  setTicket: Dispatch<SetStateAction<Ticket[]>>;
}

const TicketsContext = createContext<TicketContextData>({
  tickets: [],
  setTicket: () => {},
});

export const useTickets = () => useContext(TicketsContext);

export const TicketsProvider: FunctionComponent<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [tickets, setTicket] = useState<Ticket[]>([]);

  return (
    <TicketsContext.Provider value={{ tickets, setTicket }}>
      {children}
    </TicketsContext.Provider>
  );
};
