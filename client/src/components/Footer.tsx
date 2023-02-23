import React from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="py-3">
      <Container>
        <Row>
          <Col className="text-center">
            <span className="text-muted">Mario Mans © 2023</span>{" "}
            <a
              href="https://www.linkedin.com/in/mario-rakotondrasoa-275044180/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin color="primary" size={20} />
            </a>{" "}
            |{" "}
            <a
              href="https://github.com/manzcode"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub color="primary" size={20} />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
