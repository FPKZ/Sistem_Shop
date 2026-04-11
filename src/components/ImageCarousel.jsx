import { Carousel } from "react-bootstrap";
import { Package } from "lucide-react";

/**
 * ImageCarousel - Componente reutilizável para exibição de galerias de imagens.
 * 
 * @param {Object} props
 * @param {Array} props.imgs - Lista de URLs das imagens.
 * @param {string} props.height - Altura fixa do container (ex: "450px").
 * @param {string} props.objectFit - Estilo de preenchimento ("cover" ou "contain"). Por padrão "cover".
 * @param {string} props.className - Classes CSS adicionais para o container do Carousel.
 */
export default function ImageCarousel({ imgs, height = "400px", objectFit = "cover", className = "" }) {
  const hasImages = imgs && Array.isArray(imgs) && imgs.length > 0;

  if (!hasImages) {
    return (
      <div 
        className="text-center p-5 bg-light rounded-4 border border-dashed d-flex flex-column align-items-center justify-content-center"
        style={{ height }}
      >
        <Package size={48} className="text-muted mb-2" />
        <p className="text-muted mb-0">Nenhuma imagem disponível.</p>
      </div>
    );
  }

  return (
    <Carousel
      interval={null}
      variant="dark"
      className={`rounded-4 overflow-hidden border shadow-sm bg-light ${className}`}
    >
      {imgs.map((img, idx) => (
        <Carousel.Item key={idx}>
          <div
            className="d-flex align-items-center justify-content-center bg-light"
            style={{ height }}
          >
            <img
              src={img}
              className={`w-100 h-100 ${objectFit === "cover" ? "object-fit-cover" : "object-fit-contain"}`}
              alt={`Imagem ${idx + 1}`}
              style={{ objectFit }}
            />
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
