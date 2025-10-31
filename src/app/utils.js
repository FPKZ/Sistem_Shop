// utils.js
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// 📆 Formata data em dd/MM/yyyy HH:mm
const formatDateTime = (dataISO) => {
  if (!dataISO) return ''
  return format(new Date(dataISO), 'dd/MM/yyyy HH:mm')
}

// 📅 Formata só a data
const formatDate = (dataISO) => {
  if (!dataISO) return ''
  return format(new Date(dataISO), 'dd/MM/yyyy')
}

// ⏳ Data relativa (ex: "há 3 dias")
const formatRelativeDate = (dataISO) => {
  if (!dataISO) return ''
  return formatDistanceToNow(new Date(dataISO), { addSuffix: true, locale: ptBR })
}

// Timer
function formatTimer(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
}

// Exemplo:
// console.log(formatTimer(332));    // "00:05:32"
// console.log(formatTimer(3672));   // "01:01:12"

// 💰 Formata número como valor monetário BRL
const formatMoney = (valor) => {
  if (isNaN(valor)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

// 🔢 Formata número com separadores (ex: 1.000.000)
const formatNumber = (valor) => {
  if (isNaN(valor)) return '0'
  return new Intl.NumberFormat('pt-BR').format(valor)
}

// 🔠 Capitaliza cada palavra de um texto
const capitalize = (str, maxLength = null) => {
  if (!str) return '';
  
  // Primeiro, substitui hífens por espaços
  let processedStr = str.replace(/-/g, ' ');

  // Lógica de reticências (se necessário)
  if (maxLength && processedStr.length > maxLength) {
    processedStr = processedStr.slice(0, maxLength).trim() + '...';
  }

  // Capitaliza cada palavra
  return processedStr
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// 🧼 Remove espaços extras e quebra de linha
const normalizeText = (str) => {
  if (!str) return ''
  return str.replace(/\s+/g, ' ').trim()
}

// 📛 Remove acentos (útil para buscas)
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export default { formatDate, formatMoney, formatDateTime, formatDistanceToNow, formatNumber, formatRelativeDate, capitalize, normalizeText, removeAccents, formatTimer}