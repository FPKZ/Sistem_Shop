/**
 * Recorta uma imagem usando Canvas nativo com base nas coordenadas em pixels
 * fornecidas pelo react-easy-crop.
 *
 * @param {string} imageSrc - URL da imagem (object URL ou data URL)
 * @param {Object} pixelCrop - { x, y, width, height } em pixels
 * @param {string} [outputType="image/jpeg"] - MIME type de saída
 * @param {number} [quality=0.85] - Qualidade da compressão (0-1)
 * @returns {Promise<File>} - Arquivo recortado pronto para FormData
 */
export async function getCroppedImg(
  imageSrc,
  pixelCrop,
  outputType = "image/jpeg",
  quality = 0.85,
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas está vazio"));
          return;
        }
        const extension = outputType === "image/jpeg" ? "jpg" : "png";
        const file = new File([blob], `produto_img.${extension}`, {
          type: outputType,
        });
        resolve(file);
      },
      outputType,
      quality,
    );
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (err) => reject(err));
    // Necessário para imagens de outros domínios
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
