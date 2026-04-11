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
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (!file) return;

    // Validação de tipo
    if (!TIPOS_IMAGEM_ACEITOS.includes(file.type)) {
      setErro(`Tipo inválido. Use ${TIPOS_LABEL}.`);
      return;
    }

    // Validação de tamanho
    if (file.size > TAMANHO_MAX_MB * 1024 * 1024) {
      setErro(`Imagem muito grande. Máximo ${TAMANHO_MAX_MB}MB.`);
      return;
    }

    setErro("");
    setNomeArquivo(file.name);
    const objectUrl = URL.createObjectURL(file);
    setCropSrc(objectUrl);
    setShowCrop(true);
  };

  const handleCropConfirm = (croppedFile) => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setShowCrop(false);
    setNomeArquivo(croppedFile.name);
    
    if (onImageChange) onImageChange(croppedFile);
  };

  const handleCropCancel = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setShowCrop(false);
    setNomeArquivo("");
    
    if (onImageChange) onImageChange(null);
  };

  const clearImage = () => {
    setErro("");
    setNomeArquivo("");
    setCropSrc(null);
    setShowCrop(false);
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
    }), [onImageChange, cropSrc])
  };
}
