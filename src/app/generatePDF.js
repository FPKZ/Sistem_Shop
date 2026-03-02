import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import utils from "./utils";
import { COMPANY_INFO } from "./companyConfig";

// --- UTILS ---

const svgToPngBase64 = (svgUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = (e) => reject(e);
    img.src = svgUrl;
  });
};

// --- CONFIGURATORS (O QUE GERAR) ---

export const getVendaConfig = (venda) => {
  return {
    titulo: "",
    entidadeLabel: "Cliente:",
    entidadeValor: venda.cliente?.nome || "Consumidor",
    data: venda.data_venda,
    codigo: venda.id,
    valorTotal: venda.valor_total,
    format: [226, 600], // 80mm largura (térmica)
    margins: { top: 60, left: 10, bottom: 20, right: 10 },
    fontSize: { title: 12, body: 8, header: 10 },
    colunas: [
      { header: "#ID", dataKey: "id" },
      { header: "Prod", dataKey: "nome" },
      { header: "T", dataKey: "tamanho" },
      { header: "Preço", dataKey: "valor_venda" },
    ],
    dadosItens: (venda.itensVendidos || []).map((iv) => ({
      id: iv.itemEstoque.id,
      nome: iv.itemEstoque.nome,
      tamanho: iv.itemEstoque.tamanho,
      valor_venda: iv.itemEstoque.valor_venda,
    })),
    pagamentos: venda.notaVenda || [],
    nomeArquivo: `cupom-venda-${venda.id}.pdf`,
  };
};

export const getRecebimentoConfig = (nota) => {
  return {
    titulo: "Nota de Recebimento",
    entidadeLabel: "Fornecedor:",
    entidadeValor: nota.fornecedor,
    data: nota.data,
    codigo: nota.codigo,
    valorTotal: nota.valor_total,
    format: "a4",
    margins: { top: 80, left: 40, bottom: 40, right: 40 },
    fontSize: { title: 18, body: 12, header: 14 },
    colunas: [
      { header: "#ID", dataKey: "id" },
      { header: "Produto", dataKey: "nome" },
      { header: "Marca", dataKey: "marca" },
      { header: "Qtd.", dataKey: "quantidade" },
      { header: "Valor Compra", dataKey: "valor_compra" },
    ],
    dadosItens: (nota.itensNota || []).map((item) => ({
      ...item,
      quantidade: item.quantidade || 1,
    })),
    nomeArquivo: `nota-recebimento-${nota.codigo}.pdf`,
  };
};

// --- MOTOR (COMO GERAR) ---

export const printPDF = async (config) => {
  const isSmallFormat = Array.isArray(config.format);
  const margins = config.margins || {
    top: 80,
    left: 40,
    bottom: 40,
    right: 40,
  };
  const fontSize = config.fontSize || { title: 18, body: 12, header: 14 };

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: config.format || "a4",
  });

  // Carregar logo
  let logoBase64 = null;
  try {
    logoBase64 = await svgToPngBase64(COMPANY_INFO.logoPath);
  } catch (error) {
    console.error("Erro ao converter o logo:", error);
  }

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Processar dados da tabela
  const tableColumn = config.colunas.map((col) => col.header);
  const tableRows = config.dadosItens.map((item) =>
    config.colunas.map((col) => {
      const value = item[col.dataKey];
      if (
        col.dataKey.toLowerCase().includes("valor") ||
        col.dataKey.toLowerCase().includes("preço")
      ) {
        return utils.formatMoney(value);
      }
      return value ?? "";
    }),
  );

  // Informações da Nota (Antes da tabela)
  doc.setFontSize(fontSize.body);
  doc.setTextColor(100);
  doc.text(
    `${config.entidadeLabel} ${config.entidadeValor}`,
    margins.left,
    isSmallFormat ? 65 : 90,
  );
  doc.text(
    `Data: ${utils.formatDate(config.data)}`,
    margins.left,
    isSmallFormat ? 75 : 105,
  );
  doc.text(`Código: #${config.codigo}`, margins.left, isSmallFormat ? 85 : 120);

  // Gerar Tabela
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: isSmallFormat ? 95 : 140,
    theme: isSmallFormat ? "plain" : "grid",
    headStyles: {
      fillColor: isSmallFormat ? [255, 255, 255] : [44, 62, 80],
      textColor: isSmallFormat ? [0, 0, 0] : [255, 255, 255],
      fontStyle: "bold",
      halign: isSmallFormat ? null : "center",
      fontSize: fontSize.body,
    },
    styles: {
      fontSize: fontSize.body - (isSmallFormat ? 1 : 0),
      cellPadding: isSmallFormat ? 2 : 5,
    },
    columnStyles: {
      [tableColumn.length - 1]: { halign: "right" },
    },
    margin: { left: margins.left, right: margins.right },
    didDrawPage: (data) => {
      // **CABEÇALHO DA EMPRESA**
      if (logoBase64) {
        const logoSize = isSmallFormat ? 60 : 50;
        doc.addImage(logoBase64, "PNG", margins.left, 5, logoSize, logoSize);
      }

      doc.setFontSize(isSmallFormat ? 10 : 18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40);
      doc.text(
        COMPANY_INFO.name,
        isSmallFormat ? margins.left + 65 : 100,
        isSmallFormat ? 30 : 25,
      );

      doc.setFontSize(isSmallFormat ? 7 : 10);
      doc.setFont("helvetica", "normal");
      doc.text(
        COMPANY_INFO.address,
        isSmallFormat ? margins.left + 65 : 100,
        isSmallFormat ? 40 : 35,
      );

      // Titulo do PDF
      doc.setFontSize(isSmallFormat ? 9 : 14);
      doc.text(config.titulo, pageWidth - margins.right, 25, {
        align: "right",
      });

      // **RODAPÉ DA PÁGINA** (Opcional em pequeno formato)
      if (!isSmallFormat) {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          `Página ${data.pageNumber} de ${pageCount}`,
          margins.left,
          pageHeight - 20,
        );
      }
    },
  });

  // Valor Total
  const finalY = doc.lastAutoTable.finalY || 140;
  doc.setFontSize(fontSize.header);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total: ${utils.formatMoney(config.valorTotal)}`,
    margins.left,
    finalY + (isSmallFormat ? 15 : 40),
  );

  // Pagamentos (Se disponível)
  if (config.pagamentos && config.pagamentos.length > 0) {
    let currentY = finalY + (isSmallFormat ? 30 : 60);
    doc.setFontSize(fontSize.body);
    doc.setFont("helvetica", "bold");
    doc.text("Pagamento:", margins.left, currentY);
    currentY += isSmallFormat ? 10 : 15;

    doc.setFont("helvetica", "normal");
    config.pagamentos.forEach((p) => {
      const valor = p.valor_nota || p.valor || 0;
      const info = `${p.forma_pagamento}: ${utils.formatMoney(valor)}`;
      doc.text(info, margins.left, currentY);
      currentY += isSmallFormat ? 10 : 15;
    });
  }

  // Saída
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
};

// Aliases para compatibilidade
export const gerarPDFNota = printPDF;
