import { useState, useRef, useMemo } from "react";

const TIPOS_IMAGEM_ACEITOS = ["image/jpeg", "image/png", "image/webp"];
const TIPOS_LABEL = "JPG, PNG ou WebP";
const TAMANHO_MAX_MB = 10;

/**
 * Hook genérico para gerenciamento de upload e recorte de imagem.
 * 
 * @param {Function} onImageChange - Callback chamado quando uma imagem é confirmada ou cancelada.
 * @returns {Object} Estado e manipuladores para interface de upload de imagem.
 */
export default function useImageUpload(onImageChange) {
  const [cropSrc, setCropSrc] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [erro, setErro] = useState("");
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]); // Fila de arquivos para recorte
  const fileInputRef = useRef(null);

  /**
   * Processa a seleção de arquivos (um ou vários).
   * Coloca os arquivos na fila e inicia o processo de recorte do primeiro.
   */
  const handleFileSelect = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (files.length === 0) return;

    // Validação de tipo e tamanho para todos os arquivos
    const validFiles = files.filter(file => {
      if (!TIPOS_IMAGEM_ACEITOS.includes(file.type)) {
        setErro(`Tipo inválido para ${file.name}. Use ${TIPOS_LABEL}.`);
        return false;
      }
      if (file.size > TAMANHO_MAX_MB * 1024 * 1024) {
        setErro(`Imagem ${file.name} muito grande. Máximo ${TAMANHO_MAX_MB}MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setErro("");
    processNextFile(validFiles);
  };

  /**
   * Função auxiliar para pegar o próximo arquivo da fila e abrir o modal de recorte.
   */
  const processNextFile = (files) => {
    if (files.length === 0) {
      setPendingFiles([]);
      return;
    }

    const [current, ...rest] = files;
    setPendingFiles(rest);
    setNomeArquivo(current.name);
    
    const objectUrl = URL.createObjectURL(current);
    setCropSrc(objectUrl);
    setShowCrop(true);
  };

  const handleCropConfirm = (croppedFile) => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    
    // Notifica o sucesso da imagem atual
    if (onImageChange) onImageChange(croppedFile);

    // Se houver mais arquivos na fila, continua o processo
    if (pendingFiles.length > 0) {
      processNextFile(pendingFiles);
    } else {
      setCropSrc(null);
      setShowCrop(false);
      setNomeArquivo("");
    }
  };

  const handleCropCancel = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    
    // Se cancelou, apenas pula para o próximo se houver fila
    if (pendingFiles.length > 0) {
      processNextFile(pendingFiles);
    } else {
      setCropSrc(null);
      setShowCrop(false);
      setNomeArquivo("");
      if (onImageChange) onImageChange(null);
    }
  };

  const clearImage = () => {
    setErro("");
    setNomeArquivo("");
    setCropSrc(null);
    setShowCrop(false);
    setPendingFiles([]);
  };

  return {
    cropSrc,
    showCrop,
    erro,
    nomeArquivo,
    fileInputRef,
    tiposLabel: TIPOS_LABEL,
    tiposAceitos: TIPOS_IMAGEM_ACEITOS.join(","),
    handlers: useMemo(() => ({
      handleFileSelect,
      handleCropConfirm,
      handleCropCancel,
      clearImage
    }), [onImageChange, cropSrc, pendingFiles])
  };
}
