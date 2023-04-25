import { FunctionComponent, PropsWithChildren } from "react";
import { Dropdown, Nav, Navbar, Image } from "react-bootstrap";
import Footer from "./Footer";
import { IoChatbubblesOutline } from "react-icons/io5";
import { RiUser6Line } from "react-icons/ri";
import { MdLogout, MdOutlineAnalytics } from "react-icons/md";
import { HiChevronLeft, HiOutlineTicket, HiViewGridAdd } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/HelpDesk.svg";

const SideBarNav: FunctionComponent<PropsWithChildren<{
  handleClick?: () => void;
  style?: string;
}>> = ({ handleClick, style = "d-flex" }) => {
  const { user, setUser } = useUser();
  const { setAuthenticated } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  return (
    <div className={`h-100 ${style} flex-column justify-content-between`}>
      <div>
        <div className="d-flex justify-content-between border-bottom border-2">
          <Navbar>
            <Navbar.Brand>
              <Image src={logo} alt="..." height={50} width={50} />
              HelpDesk
            </Navbar.Brand>
          </Navbar>
          <span className="d-flex d-md-none align-items-center">
            <HiChevronLeft size={25} color="#4f35d8" onClick={handleClick} />
          </span>
        </div>
      </div>
      <Nav className="flex-column mb-auto mt-2" variant="pills">
        <Nav.Item>
          <Nav.Link href="#" className="link-dark">
            <HiViewGridAdd size={25} /> Overview
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" className="link-dark">
            <MdOutlineAnalytics size={25} /> analitics
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" className="link-dark">
            <IoChatbubblesOutline size={25} /> Chat
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#" active aria-current="page">
            <HiOutlineTicket size={25} /> Tickets
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div>
        <div className="App">
          <Dropdown drop="up">
            <Dropdown.Toggle>
              {" "}
              <RiUser6Line size={20} /> {user?.username}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={logout}>
                {" "}
                <MdLogout size={20} /> LogOut
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SideBarNav;
