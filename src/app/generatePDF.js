// import jsPDF from 'jspdf';
// import 'jspdf-autotable'; // Com as versões corretas, esta importação funciona como esperado
// import utils from "./utils";

// // /**
// //  * Gera um PDF de nota fiscal (recebimento ou venda) de forma customizada.
// //  * @param {object} config - Objeto de configuração para o PDF.
// //  */
// export const gerarPDFNota = (config) => {
//   const doc = new jsPDF({
//     orientation: 'portrait',
//     unit: 'pt',
//     format: 'a4'
//   });

//   // --- Cabeçalho ---
//   const titulo = config.tipo === 'recebimento' ? 'Nota de Recebimento de Produtos' : 'Nota de Venda';
//   doc.setFontSize(18);
//   doc.setTextColor(40);
//   doc.text(titulo, 40, 60);

//   // --- Informações da Nota ---
//   doc.setFontSize(12);
//   doc.setTextColor(100);
//   const entidadeLabel = config.tipo === 'recebimento' ? 'Fornecedor:' : 'Cliente:';
//   const entidadeValor = config.tipo === 'recebimento' ? config.dadosNota.fornecedor : config.dadosNota.cliente;
//   doc.text(`${entidadeLabel} ${entidadeValor}`, 40, 90);
//   doc.text(`Data de Emissão: ${utils.formatDate(config.dadosNota.data)}`, 40, 105);
//   doc.text(`Código da Nota: #${config.dadosNota.codigo}`, 40, 120);

//   // --- Tabela de Itens ---
//   const tableColumn = config.colunas.map(col => col.header);
//   const tableRows = config.dadosItens.map(item => 
//     config.colunas.map(col => {
//       if (col.dataKey.includes('valor')) {
//         return utils.formatMoney(item[col.dataKey]);
//       }
//       return item[col.dataKey] ?? '';
//     })
//   );

//   // A chamada doc.autoTable() agora funcionará corretamente
//   doc.autoTable({
//     head: [tableColumn],
//     body: tableRows,
//     startY: 140,
//     theme: 'striped',
//     headStyles: { fillColor: [22, 160, 133] },
//   });

//   // --- Rodapé (Valor Total) ---
//   const finalY = doc.lastAutoTable.finalY;
//   doc.setFontSize(14);
//   doc.setFont('helvetica', 'bold');
//   doc.text(`Valor Total: ${utils.formatMoney(config.dadosNota.valor_total)}`, 40, finalY + 40);

//   // --- ABRIR EM NOVA ABA (EM VEZ DE SALVAR) ---
//   // 1. Gera o PDF como um 'blob'
//   const pdfBlob = doc.output('blob');
  
//   // 2. Cria uma URL para esse blob
//   const pdfUrl = URL.createObjectURL(pdfBlob);
  
//   // 3. Abre a URL em uma nova aba
//   window.open(pdfUrl, '_blank');

//   // Opcional: Revoga a URL do objeto para liberar memória depois de um tempo
//   setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

//   // A linha abaixo não é mais necessária
//   doc.save(config.nomeArquivo);
// };


// Customisando 

// Excelente pergunta! A combinação do `jsPDF` com o `jspdf-autotable` oferece um controle imenso sobre a aparência do PDF. Vou detalhar as principais customizações que você pode fazer, desde o básico até o avançado.

// ### 1. Customizações com `jsPDF` (Elementos Gerais)

// Estas são as funções que você usa para "desenhar" no PDF antes e depois da tabela.

// - __Fontes e Textos:__

//   - `doc.setFontSize(16);` - Altera o tamanho da fonte.
//   - `doc.setFont('helvetica', 'bold');` - Altera a família da fonte ('helvetica', 'times', 'courier') e o estilo ('normal', 'bold', 'italic', 'bolditalic').
//   - `doc.setTextColor('#34495e');` - Altera a cor do texto (aceita nome, hex, rgb).
//   - `doc.text('Seu Texto', x, y);` - Posiciona o texto nas coordenadas X e Y.

// - __Cores e Formas:__

//   - `doc.setDrawColor('#2c3e50');` - Define a cor para desenhar formas.
//   - `doc.setLineWidth(1.5);` - Define a espessura da linha.
//   - `doc.line(x1, y1, x2, y2);` - Desenha uma linha de um ponto a outro (ótimo para divisórias).
//   - `doc.rect(x, y, width, height);` - Desenha um retângulo (bom para criar caixas de informação).

// - __Imagens:__

//   - `doc.addImage(logoBase64, 'PNG', x, y, width, height);` - Adiciona uma imagem ao PDF. É comum converter a imagem para o formato Base64 primeiro.

// ### 2. Customizações com `jspdf-autotable` (A Tabela)

// A maior parte da customização da tabela é feita através de um objeto de opções que você passa para a função `doc.autoTable()`.

// - __Estilos Básicos:__

//   - `theme: 'striped' | 'grid' | 'plain'` - Define o tema visual da tabela. `'grid'` é ótimo para notas fiscais.
//   - `startY: 150` - Define a coordenada Y onde a tabela começa.

// - __Estilos de Cabeçalho, Corpo e Rodapé:__

//   - `headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' }` - Estiliza o cabeçalho. `fillColor` é RGB.
//   - `bodyStyles: { textColor: [50, 50, 50] }` - Estiliza as células do corpo.
//   - `footStyles: { fillColor: [230, 230, 230], fontStyle: 'bold' }` - Estiliza o rodapé da tabela (se você tiver um).
//   - `alternateRowStyles: { fillColor: [245, 245, 245] }` - Estiliza as linhas alternadas (efeito "zebra").

// - __Estilos de Coluna:__

//   - `columnStyles`: Permite estilizar colunas individualmente.
/*
    ```javascript
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' }, // Coluna 0 (ID)
      4: { halign: 'right', cellWidth: 80 } // Coluna 4 (Preço), alinhada à direita
    }
    ```
*/
//   - `halign: 'left' | 'center' | 'right'` - Alinhamento horizontal.

//   - `valign: 'top' | 'middle' | 'bottom'` - Alinhamento vertical.

// - __Hooks (Ganchos) - Para Customizações Avançadas:__ Os hooks são funções que são chamadas em diferentes momentos da criação da tabela, permitindo que você desenhe conteúdo extra.

//   - `didDrawPage`: Chamado depois que uma página (incluindo a tabela) é desenhada. Perfeito para adicionar cabeçalhos e rodapés com número de página.
//   - `willDrawCell`: Chamado antes de uma célula ser desenhada. Permite mudar o estilo da célula com base no seu conteúdo (ex: deixar o texto vermelho se o valor for negativo).
//   - `didParseCell`: Permite modificar o conteúdo de uma célula antes de ser desenhada.

// ### Exemplo Prático: Uma Nota Fiscal Avançada

// Vamos aplicar vários desses conceitos no seu `generatePDF.js`. Este exemplo adiciona um cabeçalho com logo, um rodapé com número de página e estiliza a tabela de forma mais detalhada.

// __Arquivo: `src/app/generatePDF.js` (Versão Avançada)__


import jsPDF from 'jspdf';
import 'jspdf-autotable';
import utils from "./utils";

// FUNÇÃO PARA CONVERTER SVG PARA PNG (BASE64) ---
const svgToPngBase64 = (svgUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Necessário se o SVG estiver em outro domínio
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = (e) => {
      reject(e);
    };
    img.src = svgUrl;
  });
};

export const gerarPDFNota = async (config) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  // --- 3. CONVERTA O LOGO ANTES DE USAR ---
  let logoBase64 = null;
  try {
    // Coloque o caminho correto para o seu logo SVG
    logoBase64 = await svgToPngBase64('/assets/logo.svg'); 
  } catch (error) {
    console.error("Erro ao converter o SVG:", error);
  }

  const pageHeight = doc.internal.pageSize.height;

  // --- DADOS DA TABELA ---
  const tableColumn = config.colunas.map(col => col.header);
  const tableRows = config.dadosItens.map(item => 
    config.colunas.map(col => {
      if (col.dataKey.includes('valor')) {
        return utils.formatMoney(item[col.dataKey]);
      }
      return item[col.dataKey] ?? '';
    })
  );

  // --- GERAR TABELA COM OPÇÕES AVANÇADAS ---
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 140,
    theme: 'grid', // Tema com todas as bordas
    
    // Estilos
    headStyles: { 
      fillColor: [44, 62, 80], // Azul escuro
      textColor: [255, 255, 255], // Branco
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      // Estiliza a última coluna (valor) para alinhar à direita
      [tableColumn.length - 1]: { halign: 'right' }
    },
    
    // Hook para adicionar cabeçalho e rodapé em TODAS as páginas
    didDrawPage: function (data) {
      // **CABEÇALHO DA PÁGINA**
      doc.addImage(logoBase64, 'SVG', 40, 20, 50, 50); // Adicionar logo
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Roma Sex Shop LTDA', 100, 45);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Darcy Lacerda, 313 - Peruíbe/SP', 100, 60);

      // **RODAPÉ DA PÁGINA**
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text('Página ' + data.pageNumber + ' de ' + pageCount, data.settings.margin.left, pageHeight - 20);
    },

    // Margem superior maior para dar espaço ao cabeçalho da página
    margin: { top: 80 } 
  });

  // --- Rodapé (Valor Total) ---
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Valor Total: ${utils.formatMoney(config.dadosNota.valor_total)}`, 40, finalY + 40);

  // --- ABRIR EM NOVA ABA (EM VEZ DE SALVAR) ---
  // 1. Gera o PDF como um 'blob'
  const pdfBlob = doc.output('blob');
  
  // 2. Cria uma URL para esse blob
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  // 3. Abre a URL em uma nova aba
  window.open(pdfUrl, '_blank');

  // Opcional: Revoga a URL do objeto para liberar memória depois de um tempo
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

  // A linha abaixo não é mais necessária
  // doc.save(config.nomeArquivo);
};



// Exemplos

// Crie a função que chama o gerador de PDF
//   const handlePrintCustom = () => {
//     // 3. Monte o objeto de configuração para a nota de recebimento
//     const config = {
//       tipo: 'recebimento',
//       dadosNota: {
//         codigo: selectNota.codigo,
//         data: selectNota.data,
//         fornecedor: selectNota.fornecedor,
//         valor_total: selectNota.valor_total,
//       },
//       colunas: [
//         { header: '#ID', dataKey: 'id' },
//         { header: 'Produto', dataKey: 'nome' },
//         { header: 'Marca', dataKey: 'marca' },
//         { header: 'Qtd.', dataKey: 'quantidade' }, // Supondo que tenha a quantidade
//         { header: 'Valor Compra', dataKey: 'valor_compra' },
//       ],
//       dadosItens: selectNota.itensNota.map(item => ({
//         ...item,
//         quantidade: 1 // Adicione a quantidade correta se tiver
//       })),
//       nomeArquivo: `nota-recebimento-${selectNota.codigo}.pdf`,
//     };

//     // 4. Chame a função
//     gerarPDFNota(config);
//   };


// Exemplo para uma nota de venda
// const configVenda = {
//   tipo: 'venda',
//   dadosNota: {
//     codigo: venda.codigo,
//     data: venda.data,
//     cliente: venda.cliente.nome, // Note a mudança de 'fornecedor' para 'cliente'
//     valor_total: venda.valor_total,
//   },
//   colunas: [
//     { header: '#ID', dataKey: 'id' },
//     { header: 'Produto', dataKey: 'nome' },
//     { header: 'Qtd.', dataKey: 'quantidade' },
//     { header: 'Valor Unit.', dataKey: 'valor_unitario' },
//     { header: 'Subtotal', dataKey: 'subtotal' },
//   ],
//   dadosItens: venda.itensVenda,
//   nomeArquivo: `nota-venda-${venda.codigo}.pdf`,
// };

// gerarPDFNota(configVenda);