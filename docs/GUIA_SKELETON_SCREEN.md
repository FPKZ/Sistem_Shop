# Guia de Implementação: Skeleton Screens

Skeleton Screens são espaços reservados que imitam o layout da página enquanto os dados estão sendo carregados. Eles oferecem uma experiência de usuário (UX) mais fluida do que spinners de carregamento tradicionais.

---

## 1. O Conceito: Efeito Shimmer

O segredo de um bom Skeleton é o efeito **Shimmer** (brilho), que dá a sensação de que o conteúdo está "quase lá". Vamos usar o **Framer Motion** para criar esse movimento de forma leve.

---

## 2. Criando o Componente Base

Primeiro, crie um componente de átomo chamado `Skeleton.jsx`. Ele será a base para todos os outros.

```jsx
import { motion } from "framer-motion";

export const Skeleton = ({ width, height, borderRadius = "8px", className = "" }) => {
  return (
    <div 
      className={`bg-light position-relative overflow-hidden ${className}`}
      style={{ width, height, borderRadius, backgroundColor: "#e9ecef" }}
    >
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
        }}
      />
    </div>
  );
};
```

---

## 3. Compondo o Skeleton do Card de Produto

Agora, vamos montar um "molde" que se pareça com o seu card de produto real.

```jsx
import { Skeleton } from "./Skeleton";

export const ProductCardSkeleton = () => {
  return (
    <div className="card border-0 shadow-sm p-3 mb-4" style={{ borderRadius: "15px" }}>
      {/* Imagem do Produto */}
      <Skeleton width="100%" height="200px" borderRadius="12px" className="mb-3" />
      
      {/* Nome do Produto */}
      <Skeleton width="70%" height="20px" className="mb-2" />
      
      {/* Categoria */}
      <Skeleton width="40%" height="14px" className="mb-3" />
      
      {/* Preço e Botão */}
      <div className="d-flex justify-content-between align-items-center mt-2">
        <Skeleton width="30%" height="24px" />
        <Skeleton width="40px" height="40px" borderRadius="50%" />
      </div>
    </div>
  );
};
```

---

## 4. Integrando no Catálogo

No arquivo `Produtos.jsx`, você pode usar o estado `loading` para decidir se exibe os skeletons ou os produtos reais.

```jsx
import { ProductCardSkeleton } from "../components/skeletons/ProductCardSkeleton";

export default function Produtos({ produtos, loading }) {
  if (loading) {
    return (
      <div className="row g-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="row g-4">
      {produtos.map(p => (
        <CardProduto key={p.id} produto={p} />
      ))}
    </div>
  );
}
```

---

## 5. Benefícios no Sistem_Shop

1.  **Fim do "Pulo" de Layout**: Como o Skeleton tem o mesmo tamanho do card real, o layout não "pula" quando os dados chegam.
2.  **Percepção de Velocidade**: O usuário sente que a página está carregando gradualmente, em vez de esperar um spinner girar em uma tela branca.
3.  **Consistência**: Usando as mesmas cores do Bootstrap (`#e9ecef`) e os mesmos raios de borda, o Skeleton se integra perfeitamente ao seu Design Premium.

---
> [!TIP]
> Use o `AnimatePresence` do Framer Motion para fazer um "fade-out" suave do Skeleton quando os produtos reais aparecerem. Isso torna a transição quase imperceptível.
