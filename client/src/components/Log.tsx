import React, { FunctionComponent, useState } from "react";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { auth } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "./Footer";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { AxiosError } from "axios";

interface RegistrationFormData {
  email: string;
  password: string;
  username: string;
  role: string;
}

const Log: FunctionComponent = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    password: "",
    username: "",
    role: "user",
  });
  const [newError, setnewError] = useState("");
  const [psTotxt, setPsTotxt] = useState(false);
  const [login, setLogin] = useState<boolean>(true);
  const navigate = useNavigate();
  const { authenticated, setAuthenticated } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const type = login ? "signin" : "signup";
      const log = await auth(formData, type);
      const res = log.data;
      localStorage.setItem("access", res?.token);
      setAuthenticated(true);
      navigate("/lists");
    } catch (error) {
      const newerror = error as AxiosError;
      if (newerror.response) {
        const responseData = newerror.response.data as { message: string }; // Utilisation d'une assertion de type pour indiquer que newerror.response.data est de type { message: string }
        setnewError(responseData.message);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="col-md-6 mx-auto">
      <h1>
        {" "}
        Helpdesk <RiShieldKeyholeLine />{" "}
      </h1>

      <Alert show={newError !== "" ? true : false} variant="danger">
        {newError}
      </Alert>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Mot de passe</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              className="border-end-0"
              type={psTotxt ? "texte" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <InputGroup.Text
              className="bg-white border-start-0"
              id="basic-addon2"
            >
              {psTotxt ? (
                <BsEyeSlash
                  size={20}
                  onClick={() => {
                    setPsTotxt((p) => !p);
                  }}
                />
              ) : (
                <BsEye
                  size={20}
                  onClick={() => {
                    setPsTotxt((p) => !p);
                  }}
                />
              )}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        {!login ? (
          <>
            <Form.Group controlId="username">
              <Form.Label>Nom d'utilisateur</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="role">
              <Form.Label>Rôle</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </Form.Control>
            </Form.Group>
          </>
        ) : null}

        <div>
          S'incrire{" "}
          <span
            className="text-info"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setLogin((p) => !p);
            }}
          >
            clique ici!
          </span>
        </div>

        <Button variant="primary" type="submit" className="mt-2">
          {login ? "connexion" : "S'inscrire"}
        </Button>
      </Form>
      <Footer />
    </div>
  );
};

export default Log;
