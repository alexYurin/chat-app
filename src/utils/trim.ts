function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function trim(str: string, pattern = '') {
  if (typeof pattern === 'string' && pattern.length > 0) {
    return Array.from(pattern).reduce((trimed, currentPattern) => {
      const regExp = new RegExp(escapeRegExp(currentPattern), 'g')

      return trimed.replaceAll(regExp, '')
    }, str)
  }

  return str.trim() || ''
}

export default trim
