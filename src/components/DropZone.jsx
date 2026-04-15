import { useState, useRef } from "react";
import { UploadCloud, Camera, Image, X } from "lucide-react";
import { Form } from "react-bootstrap";

export default function DropZone({ onFilesSelected, aceitos, tiposLabel }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left - 20,
      y: e.clientY - rect.top - 20,
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected({ target: { files: e.dataTransfer.files } });
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();
  const triggerCamera = () => cameraInputRef.current?.click();

  return (
    <div className="w-100 animate-fade-in">
      {/* Container Principal da DropZone */}
      <div
        className={`
          position-relative rounded-4 border-2 border-dashed p-5 text-center transition-all duration-300
          ${isDragActive ? "border-roxo bg-roxo-subtle scale-102 shadow-lg" : "border-gray-300 bg-light hover:border-roxo-subtle"}
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onMouseMove={handleMouseMove}
        onDrop={handleDrop}
        style={{ cursor: "pointer", flexGrow: 1, display: "flex", flexDirection: "column", minHeight: "280px", overflow: "hidden" }}
      >
        {/* Camada de clique Inteligente (Input Pequeno que segue o mouse) */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={aceitos}
          onChange={onFilesSelected}
          className="position-absolute border-0 p-0 m-0"
          style={{ 
            zIndex: 1, 
            opacity: 0, 
            cursor: "pointer",
            width: "40px",
            height: "40px",
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            // Em dispositivos toque (sem mouseMove ativo), expandimos para a área toda
            ...(window.innerWidth < 1024 && {
              width: "100%",
              height: "100%",
              left: 0,
              top: 0
            })
          }}
          title={tiposLabel}
        />

        {/* Camada de Conteúdo e Botões Específicos */}
        <div 
          className="position-relative d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5"
          style={{ zIndex: 2, pointerEvents: "none" }}
        >
          <div className={`p-4 rounded-circle mb-3 transition-all ${isDragActive ? "bg-roxo text-white" : "bg-white text-roxo shadow-sm"}`}>
            <UploadCloud size={48} strokeWidth={1.5} />
          </div>
          
          <h5 className="fw-bold mb-2">Arraste suas fotos aqui</h5>
          <p className="text-muted small mb-4 px-4">
            Ou clique para selecionar arquivos do seu dispositivo.<br/>
            Suporta {tiposLabel}.
          </p>

          <div 
            className="d-flex gap-3 mt-2 flex-wrap justify-content-center"
            style={{ pointerEvents: "auto" }}
          >
            <button 
              type="button" 
              className="btn btn-roxo-light d-flex align-items-center gap-2 px-4 rounded-pill shadow-sm"
              onClick={triggerFileSelect}
            >
              <Image size={18} /> Selecionar Fotos
            </button>
            
            {/* Botão de Câmera (Focado em Mobile) */}
            <button 
              type="button" 
              className="btn btn-outline-roxo d-flex align-items-center gap-2 px-4 rounded-pill shadow-sm bg-white"
              onClick={triggerCamera}
            >
              <Camera size={18} /> Tirar Foto
            </button>
          </div>
        </div>

        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onFilesSelected}
          style={{ display: "none" }}
        />
      </div>

      {/* Dicas de Uso */}
      <div className="mt-4 p-3 bg-roxo-subtle rounded-4 border border-roxo border-opacity-10">
        <div className="d-flex gap-3">
          <div className="bg-white rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center h-fit">
            <i className="bi bi-info-circle text-roxo"></i>
          </div>
          <div>
            <p className="small mb-0 text-roxo fw-medium">Dica Profissional</p>
            <p className="small mb-0 text-muted opacity-80 text-justify">
              Para melhores resultados em seu catálogo, tente tirar fotos com o celular na horizontal e em locais bem iluminados. Todas as imagens passarão pelo processo de recorte sequencial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
