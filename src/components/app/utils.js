// utils.js
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// 📆 Formata data em dd/MM/yyyy HH:mm
export const formatDateTime = (dataISO) => {
  if (!dataISO) return ''
  return format(new Date(dataISO), 'dd/MM/yyyy HH:mm')
}

// 📅 Formata só a data
export const formatDate = (dataISO) => {
  if (!dataISO) return ''
  return format(new Date(dataISO), 'dd/MM/yyyy')
}

// ⏳ Data relativa (ex: "há 3 dias")
export const formatRelativeDate = (dataISO) => {
  if (!dataISO) return ''
  return formatDistanceToNow(new Date(dataISO), { addSuffix: true, locale: ptBR })
}

// 💰 Formata número como valor monetário BRL
export const formatMoney = (valor) => {
  if (isNaN(valor)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

// 🔢 Formata número com separadores (ex: 1.000.000)
export const formatNumber = (valor) => {
  if (isNaN(valor)) return '0'
  return new Intl.NumberFormat('pt-BR').format(valor)
}

// 🔠 Capitaliza texto com limite e reticências
export const capitalize = (str, maxLength = null) => {
  if (!str) return ''
  let trimmed = str.trim()

  const needsEllipsis = maxLength && trimmed.length > maxLength
  if (needsEllipsis) {
    trimmed = trimmed.slice(0, maxLength).trim() + '...'
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

// 🧼 Remove espaços extras e quebra de linha
export const normalizeText = (str) => {
  if (!str) return ''
  return str.replace(/\s+/g, ' ').trim()
}

// 📛 Remove acentos (útil para buscas)
export const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}