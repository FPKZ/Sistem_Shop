import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { Pencil, ChevronDown } from "lucide-react";
import { usePerfil } from "@hooks/auth/usePerfil";
import ImageCropModal from "@components/modal/ImageCropModal";

import PasswordField from "@components/common/PasswordField";
import { Collapsible } from "radix-ui";


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
    imageUpload,
    edit,
    setEdit,
    openPassword,
    setOpenPassword,
    handlePasswordCancel,
    handleCancelEdit,
  } = usePerfil();

  // O preview agora é simples pois o form recebe URLs do back imediatamente pós-recorte
  const profileImagePreview = perfilData.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <Container className="d-flex flex-column gap-4 p-4 pt-3 p-md-4">
      <ImageCropModal 
        visible={imageUpload.showCrop} 
        onClose={imageUpload.handlers.handleCropCancel} 
        src={imageUpload.cropSrc} 
        onConfirm={imageUpload.handlers.handleCropConfirm} 
      />
      <div className="mb-1">
        <h2 className="text-3xl font-bold text-gray-800">Meu Perfil</h2>
        <p className="text-gray-500 mt-1">
          Gerencie as informações do seu perfil e senha.
        </p>
      </div>

      <Card className="shadow-md mb-8 rounded-4">
        <Card.Header as="h3" className="text-xl font-semibold hidden md:block">
          Informações Pessoais
        </Card.Header>
        <Card.Body className="p-4">
          <Form onSubmit={handlePerfilSubmit}>
            <Row className="align-items-center">
              <Col xs="12" md="auto" className="text-center mb-4 mb-md-0">
                <div className="position-relative d-inline-block">
                  <Image
                    src={profileImagePreview}
                    alt="User avatar"
                    style={{ width: "6rem", height: "6rem", objectFit: "cover" }}
                    roundedCircle
                  />
                  {edit && (
                    <Button
                      variant=""
                      className="btn-roxo position-absolute bottom-0 end-0 p-1 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "2rem", height: "2rem" }}
                      onClick={() => imageUpload.fileInputRef.current.click()}
                    >
                      <Pencil size={16} />
                    </Button>
                  )}
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
                  <Form.Label>Nome Completo:</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={perfilData.nome}
                    onChange={handlePerfilChange}
                    isInvalid={!!perfilErrors.nome}
                    disabled={!edit}
                    className={`${edit ? "" : "bg-white! border-white! cursor-default!"}`}
                  />
                  <Form.Control.Feedback type="invalid">
                    {perfilErrors.nome}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Endereço de E-mail:</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={perfilData.email}
                    onChange={handlePerfilChange}
                    isInvalid={!!perfilErrors.email}
                    disabled={!edit}
                    className={`${edit ? "" : "bg-white! border-white! cursor-default!"}`}
                  />
                  <Form.Control.Feedback type="invalid">
                    {perfilErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-center md:justify-end mt-4 gap-2">
              {edit ? (<>
                  <Button
                    size="sm"
                    variant=""
                    className="btn-roxo-secondary"
                    onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    variant=""
                    className="btn-roxo"
                    type="submit">
                    Salvar Alterações
                  </Button>
              </>) : (
                  <Button
                    size="sm"
                    variant 
                    className="
                      font-semibold! text-roxo bg-roxo-subtle
                      hover:bg-[#c63cf4]! hover:text-white!
                      flex! items-center gap-2
                    "
                    onClick={() => setEdit(true)}>
                    <Pencil size={16} />
                    Editar
                  </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-md rounded-4 overflow-hidden">
        <Collapsible.Root open={openPassword} onOpenChange={setOpenPassword}>
              <Collapsible.Trigger asChild>
                  <Card.Header as="h3" className="text-xl font-semibold cursor-pointer hover:bg-gray-50 transition-colors d-flex justify-content-between align-items-center group">
                      Alterar Senha
                      <ChevronDown className="group-data-[state=open]:rotate-180 transition-transform" />
                  </Card.Header>
              </Collapsible.Trigger>
              <Collapsible.Content className="overflow-hidden data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up group">
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
                              placeholder="Confirme sua nova senha"
                          />
                          <div className="d-flex justify-content-end mt-4 gap-2">
                              <Button 
                                variant="none" 
                                type="button"
                                onClick={handlePasswordCancel}
                                className="btn-roxo-secondary"
                              >
                                  Cancelar
                              </Button>
                              <Button variant="none" type="submit" className="btn-roxo">
                                  Salvar Alterações
                              </Button>
                          </div>
                      </Form>
                  </Card.Body>
              </Collapsible.Content>
        </Collapsible.Root>
      </Card>
    </Container>
  );
}
