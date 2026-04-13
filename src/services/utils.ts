// utils.js
import { format, formatDistanceToNow, intervalToDuration } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// 📆 Formata data em dd/MM/yyyy HH:mm
const formatDateTime = (dataISO : string) : string => {
  if (!dataISO) return ''
  return format(new Date(dataISO), 'dd/MM/yyyy HH:mm')
}

// 📅 Formata só a data
const formatDate = (dataISO : string) : string => {
  if (!dataISO) return ''
  
  // Se for string YYYY-MM-DD, força interpretação como local adicionando hora
  if (typeof dataISO === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dataISO)) {
    return format(new Date(dataISO + 'T00:00:00'), 'dd/MM/yyyy')
  }

  return format(new Date(dataISO), 'dd/MM/yyyy')
}

// Formata data e retorna o dia da semana
const formatDayOfWeek = (dataISO : string) : string => {
  if (!dataISO) return ''
  return format(new Date(dataISO), 'EEEE', { locale: ptBR })
}

// Formata data e retorna a diferença em dias
const formatDifferenceInDays = (start : Date, end : Date) : string => {
  if (!start || !end) return ''
  const duration = intervalToDuration({ start, end })

  console.log(duration)
  
  const parts = []
  if (duration.years > 0) parts.push(`${duration.years} ano${duration.years > 1 ? 's' : ''}`)
  if (duration.months > 0) parts.push(`${duration.months} ${duration.months > 1 ? 'meses' : 'mês'}`)
  if (duration.days > 0) parts.push(`${duration.days} dia${duration.days > 1 ? 's' : ''}`)

  if (parts.length === 0) return '0 dias'

  if (parts.length === 1) return parts[0]
  const last = parts.pop()
  return `${parts.join(', ')} e ${last}`
}

// ⏳ Data relativa (ex: "há 3 dias")
const formatRelativeDate = (dataISO : string) : string => {
  if (!dataISO) return ''
  return formatDistanceToNow(new Date(dataISO), { addSuffix: true, locale: ptBR })
}

// Timer
const formatTimer = (totalSeconds : number) : string => {
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
const formatMoney = (valor : number, config : Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'BRL',
  }) : string => {
  if (isNaN(valor)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', config).format(valor)
}

// 🔢 Formata número com separadores (ex: 1.000.000)
const formatNumber = (valor : number) : string => {
  if (isNaN(valor)) return '0'
  return new Intl.NumberFormat('pt-BR').format(valor)
}

// 🔠 Capitaliza cada palavra de um texto
const capitalize = (str : string, maxLength : number = null) : string => {
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
const normalizeText = (str : string) : string => {
  if (!str) return ''
  return str.replace(/\s+/g, ' ').trim()
}

// 📱 Formata telefone (mask) (00) 00000-0000 ou (00) 0000-0000
const formatPhone = (value: string): string => {
  if (!value) return "";
  let digits = value.replace(/\D/g, "");

  // Se começar com 55 e tiver 12 ou 13 dígitos, remove o 55
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    digits = digits.slice(2);
  }

  if (digits.length > 11) digits = digits.slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6)
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

// 📛 Remove acentos (útil para buscas)
const removeAccents = (str: string): string => {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export default { 
  formatPhone, 
  formatDate, 
  formatMoney, 
  formatDateTime, 
  formatDistanceToNow, 
  formatNumber, 
  formatRelativeDate, 
  capitalize, 
  normalizeText, 
  removeAccents, 
  formatTimer, 
  formatDifferenceInDays
}
