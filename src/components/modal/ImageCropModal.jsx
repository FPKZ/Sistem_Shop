import { useState, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@utils/cropImage";

/**
 * Modal de recorte de imagem.
 *
 * Props:
 *  - src: string | null      — URL Object da imagem selecionada
 *  - visible: boolean
 *  - onClose: () => void     — cancela sem salvar
 *  - onConfirm: (File) => void — retorna o arquivo recortado
 *  - aspect: number          — proporção w/h (padrão: 1 = quadrado)
 */
export default function ImageCropModal({
  src,
  visible,
  onClose,
  onConfirm,
  aspect = 1,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedFile = await getCroppedImg(src, croppedAreaPixels);
      onConfirm(croppedFile);
    } catch (err) {
      console.error("Erro ao recortar imagem:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    onClose();
  };

  return (
    <Modal
      show={visible}
      onHide={handleCancel}
      centered
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-semibold">Recortar Imagem</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        {/* Área do cropper */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "380px",
            background: "#1a1a1a",
          }}
        >
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { borderRadius: 0 },
              }}
            />
          )}
        </div>

        {/* Controle de zoom */}
        <div className="px-4 py-3 border-top d-flex align-items-center gap-3">
          <i className="bi bi-zoom-out text-muted" />
          <Form.Range
            id="cropZoom"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-grow-1"
          />
          <i className="bi bi-zoom-in text-muted" />
          <span className="text-muted small ms-1" style={{ minWidth: "3rem" }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={handleCancel}
          disabled={isProcessing}
        >
          Cancelar
        </Button>
        <Button
          className="btn-roxo"
          onClick={handleConfirm}
          disabled={isProcessing || !croppedAreaPixels}
        >
          {isProcessing ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Processando...
            </>
          ) : (
            "Confirmar Recorte"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
