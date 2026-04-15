import { useState, useRef, useCallback } from "react";

const TIPOS_IMAGEM_ACEITOS = ["image/jpeg", "image/png", "image/webp"];
const TIPOS_LABEL = "JPG, PNG ou WebP";
const TAMANHO_MAX_MB = 10;

/**
 * Hook genérico para gerenciamento de upload e recorte de imagem.
 *
 * Usa refs internas para que os callbacks (handleCropConfirm, handleCropCancel)
 * sejam estáveis entre renders — sem recriar objetos desnecessariamente.
 * O objeto `handlers` retornado é sempre o mesmo (referência estável),
 * o que evita re-renders em componentes filhos que o recebem como prop.
 *
 * @param {Function} onImageChange - Callback chamado quando uma imagem é confirmada ou cancelada.
 * @returns {Object} Estado e manipuladores para interface de upload de imagem.
 */
export default function useImageUpload(onImageChange) {
  const [cropSrc, setCropSrc] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [erro, setErro] = useState("");
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Refs para que os callbacks leiam sempre o valor mais atual
  // sem precisar desses estados como dependências do useCallback
  const cropSrcRef = useRef(cropSrc);
  cropSrcRef.current = cropSrc;

  const pendingFilesRef = useRef(pendingFiles);
  pendingFilesRef.current = pendingFiles;

  // Ref para o callback externo — permite que o chamador mude o handler
  // sem invalidar os callbacks internos deste hook
  const onImageChangeRef = useRef(onImageChange);
  onImageChangeRef.current = onImageChange;

  /**
   * Função auxiliar para pegar o próximo arquivo da fila e abrir o modal de recorte.
   * Estável entre renders — só chama setters do React (refs estáveis).
   */
  const processNextFile = useCallback((files) => {
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
  }, []); // Deps vazias — só usa setters estáveis

  /**
   * Processa a seleção de arquivos (um ou vários).
   * Valida tipo e tamanho antes de colocar na fila de recorte.
   */
  const handleFileSelect = useCallback((e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (files.length === 0) return;

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
  }, [processNextFile]); // processNextFile é estável

  /**
   * Confirma o recorte de uma imagem e avança para a próxima na fila.
   * Lê cropSrc e pendingFiles via refs — sem capturar valores stale.
   */
  const handleCropConfirm = useCallback((croppedFile) => {
    const src = cropSrcRef.current;
    const pending = pendingFilesRef.current;

    if (src) URL.revokeObjectURL(src);
    if (onImageChangeRef.current) onImageChangeRef.current(croppedFile);

    if (pending.length > 0) {
      processNextFile(pending);
    } else {
      setCropSrc(null);
      setShowCrop(false);
      setNomeArquivo("");
    }
  }, [processNextFile]); // processNextFile é estável

  /**
   * Cancela o recorte e avança para o próximo arquivo, ou encerra o fluxo.
   */
  const handleCropCancel = useCallback(() => {
    const src = cropSrcRef.current;
    const pending = pendingFilesRef.current;

    if (src) URL.revokeObjectURL(src);

    if (pending.length > 0) {
      processNextFile(pending);
    } else {
      setCropSrc(null);
      setShowCrop(false);
      setNomeArquivo("");
      if (onImageChangeRef.current) onImageChangeRef.current(null);
    }
  }, [processNextFile]); // processNextFile é estável

  /** Limpa completamente o estado do upload. */
  const clearImage = useCallback(() => {
    setErro("");
    setNomeArquivo("");
    setCropSrc(null);
    setShowCrop(false);
    setPendingFiles([]);
  }, []); // Deps vazias — só usa setters estáveis

  return {
    cropSrc,
    showCrop,
    erro,
    nomeArquivo,
    fileInputRef,
    tiposLabel: TIPOS_LABEL,
    tiposAceitos: TIPOS_IMAGEM_ACEITOS.join(","),
    // Objeto handlers com referências estáveis (useCallback) —
    // componentes filhos que dependem desse objeto não re-renderizam desnecessariamente
    handlers: {
      handleFileSelect,
      handleCropConfirm,
      handleCropCancel,
      clearImage,
    },
  };
}
