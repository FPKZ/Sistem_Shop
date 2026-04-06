# Guia de Uso: Framer Motion no Sistem_Shop

Este documento fornece orientações sobre como utilizar a biblioteca **Framer Motion** para adicionar animações e interações fluidas ao projeto Sistem_Shop.

## 1. Instalação e Configuração

A biblioteca já está instalada no projeto. Para utilizá-la em um novo componente, basta importar o objeto `motion`:

```javascript
import { motion } from "framer-motion";
```

## 2. Princípios Básicos

O Framer Motion funciona substituindo tags HTML padrão por suas versões animadas (ex: `<div>` vira `<motion.div>`, `<button>` vira `<motion.button>`).

### Feedback de Botões (Tap & Hover)

Para todos os botões do sistema, utilize o padrão de escala para fornecer feedback imediato:

```jsx
<motion.button
  whileHover={{ scale: 1.05 }}   // Aumenta levemente ao passar o mouse
  whileTap={{ scale: 0.95 }}     // Diminui levemente ao clicar/tocar
  className="btn btn-primary"
>
  Clique Aqui
</motion.button>
```

## 3. Padrões Implementados no Catálogo

### Cards de Produtos (`produtos.jsx`)
Utilizamos o Framer Motion para suavizar a entrada dos produtos e dar um efeito de elevação no hover.

- **`initial`**: Estado inicial (escondido).
- **`animate`**: Estado final (visível).
- **`layout`**: Faz com que o componente anime automaticamente quando sua posição no grid muda (ex: ao filtrar).

### Seletores de Cor e Tamanho (`Produto.jsx`)
Adicionamos animações de escala para tornar a seleção mais tátil.

### Botão de Pedido (`Catalogo.jsx`)
O botão flutuante agora possui uma animação de entrada (`initial={{ y: 100 }}`) para não aparecer de forma brusca quando o carrinho tem itens.

## 4. Animações de Estado (Loading & Success)

Para operações que levam tempo (API) ou requerem feedback imediato, utilizamos o padrão de estados.

### Carregamento (Loading)
Ideal para o botão de "Finalizar Pedido". Combine `AnimatePresence` com um estado de `loading`.

```jsx
const { loading } = useCatalogo();

<motion.button disabled={loading}>
  <AnimatePresence mode="wait">
    {loading ? (
      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        Processando...
      </motion.div>
    ) : (
      <motion.div key="normal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        Finalizar Pedido
      </motion.div>
    )}
  </AnimatePresence>
</motion.button>
```

### Sucesso Temporário (Success)
Ideal para o botão de "Adicionar ao Carrinho". Use um estado local para disparar a animação.

```jsx
const [success, setSuccess] = useState(false);

const handleAction = () => {
  setSuccess(true);
  setTimeout(() => setSuccess(false), 2000);
}

<motion.button
  style={{ backgroundColor: success ? "#25D366" : "#9333b3" }}
  onClick={handleAction}
>
  {success ? "✅ Adicionado!" : "Adicionar"}
</motion.button>
```

## 5. Variantes (Organização de Estados)

As variantes permitem definir estados de animação nomeados e reutilizáveis, facilitando o gerenciamento de componentes complexos.

```jsx
const whatsappVariants = {
  collapsed: { x: 115 },
  expanded: { x: 15 }
};

<motion.button
  initial="collapsed"
  animate={talkExpanded ? "expanded" : "collapsed"}
  whileHover="expanded"
  variants={whatsappVariants}
>
  Fale Conosco
</motion.button>
```

## 6. Interatividade PC vs Mobile

Em dispositivos móveis (touch), o efeito de `hover` muitas vezes não é confiável ou não existe. Podemos utilizar os eventos de hover do Framer Motion para criar comportamentos diferenciados.

### Exemplo: Botão do WhatsApp (Catalogo.jsx)
O botão deve expandir com o mouse no PC, mas exigir um toque para expandir no Mobile antes de executar a ação.

```jsx
const [isHovered, setIsHovered] = useState(false);
const [talkExpanded, setTalkExpanded] = useState(false);

<motion.button
  onHoverStart={() => setIsHovered(true)}   // Ativo no PC
  onHoverEnd={() => setIsHovered(false)}     // Ativo no PC
  onClick={() => {
    // Se já estiver expandido (pelo mouse ou pelo toque anterior), executa a ação
    if (isHovered || talkExpanded) {
      handleTalk();
    } else {
      // Caso contrário, apenas expande no primeiro toque (comportamento Mobile)
      setTalkExpanded(true);
    }
  }}
>
  ...
</motion.button>
```

## 7. Dicas de Performance

### Animação de Entrada de Lista
```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1 // Anima os filhos um por um com atraso
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

return (
  <motion.ul variants={container} initial="hidden" animate="show">
    {list.map(i => <motion.li key={i.id} variants={item} />)}
  </motion.ul>
)
```

---
> [!TIP]
> Sempre que criar um novo elemento clicável, considere adicionar pelo menos o `whileTap={{ scale: 0.95 }}`. Isso melhora drasticamente a percepção de performance e interatividade do sistema.
