function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function trim(str: string, pattern = '') {
  if (typeof pattern === 'string' && pattern.length > 0) {
    return Array.from(pattern).reduce((trimed, currentPattern) => {
      const regExp = new RegExp(escapeRegExp(currentPattern), 'g')

      return trimed.replace(regExp, '')
    }, str)
  }

  return str.trim() || ''
}
