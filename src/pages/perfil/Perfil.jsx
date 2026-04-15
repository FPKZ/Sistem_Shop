import React, { useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { Pencil } from "lucide-react";
import { usePerfil } from "@hooks/auth/usePerfil";
import ImageCropModal from "@components/modal/ImageCropModal";

import PasswordField from "@components/common/PasswordField";


export default function PerfilPage() {
  const {
    perfilData,
    passwords,
    perfilErrors,
    passwordErrors,
    handlePerfilChange,
    handlePasswordChange,
    handlePerfilSubmit,
    handlePasswordSubmit,
    showModal,
    setShowModal,
    imageUpload,
  } = usePerfil();

  // O preview agora é simples pois o form recebe URLs do back imediatamente pós-recorte
  const profileImagePreview = perfilData.img;

  return (
    <Row>
      <ImageCropModal 
        visible={imageUpload.showCrop} 
        onClose={imageUpload.handlers.handleCropCancel} 
        src={imageUpload.cropSrc} 
        onConfirm={imageUpload.handlers.handleCropConfirm} 
      />
      <Col className="d-flex flex-column overflow-hidden">
        <main className="grow overflow-y-auto p-4 md:p-8">
          <Container fluid="xl" className="d-flex flex-column gap-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Meu Perfil</h2>
              <p className="text-gray-500 mt-1">
                Gerencie as informações do seu perfil e senha.
              </p>
            </div>

            <Card className="shadow-md mb-8">
              <Card.Header as="h3" className="text-xl font-semibold">
                Informações Pessoais
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handlePerfilSubmit}>
                  <Row className="align-items-center">
                    <Col xs="auto" className="text-center mb-4 mb-md-0">
                      <div className="position-relative d-inline-block">
                        <Image
                          src={profileImagePreview}
                          alt="User avatar"
                          style={{ width: "6rem", height: "6rem", objectFit: "cover" }}
                          roundedCircle
                        />
                        <Button
                          variant="primary"
                          className="position-absolute bottom-0 end-0 p-1 rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "2rem", height: "2rem" }}
                          onClick={() => imageUpload.fileInputRef.current.click()}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Form.Control
                          type="file"
                          ref={imageUpload.fileInputRef}
                          className="d-none"
                          accept={imageUpload.tiposAceitos}
                          onChange={imageUpload.handlers.handleFileSelect}
                        />
                      </div>
                    </Col>
                    <Col>
                      <Form.Group controlId="nome" className="mb-4">
                        <Form.Label>Nome Completo</Form.Label>
                        <Form.Control
                          type="text"
                          name="nome"
                          value={perfilData.nome}
                          onChange={handlePerfilChange}
                          isInvalid={!!perfilErrors.nome}
                        />
                        <Form.Control.Feedback type="invalid">
                          {perfilErrors.nome}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="email">
                        <Form.Label>Endereço de E-mail</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={perfilData.email}
                          onChange={handlePerfilChange}
                          isInvalid={!!perfilErrors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {perfilErrors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end mt-4 gap-2">
                    <Button variant="secondary" >
                      Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                      Salvar Alterações
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <Card className="shadow-md">
              <Card.Header as="h3" className="text-xl font-semibold">
                Alterar Senha
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handlePasswordSubmit}>
                  <PasswordField
                    label="Senha Atual"
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    isInvalid={!!passwordErrors.current}
                    error={passwordErrors.current}
                    placeholder="Sua senha atual"
                  />
                  <PasswordField
                    label="Nova Senha"
                    name="new"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    isInvalid={!!passwordErrors.new}
                    error={passwordErrors.new}
                    placeholder="Sua nova senha"
                  />
                  <PasswordField
                    label="Confirmar Nova Senha"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    isInvalid={!!passwordErrors.confirm}
                    error={passwordErrors.confirm}
                    placeholder="Confirme a nova senha"
                  />
                  <div className="d-flex justify-content-end mt-4 gap-2">
                    <Button variant="secondary">
                      Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                      Atualizar Senha
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Container>
        </main>
      </Col>
    </Row>
  );
}
