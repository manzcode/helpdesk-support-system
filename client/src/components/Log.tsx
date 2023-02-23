import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { auth } from "../api";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RegistrationFormData {
  email: string;
  password: string;
  username: string;
  role: string;
}

const Log: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    password: "",
    username: "",
    role: "user",
  });
  const [error, setError] = useState(false);
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
      setError(true);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="col-6 mx-auto">
      <h1> Auth </h1>

      <Alert show={error} variant="danger">
        Vérifier vos identification
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
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
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
    </div>
  );
};

export default Log;
