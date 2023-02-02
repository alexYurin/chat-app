export default function isObjectsEquals(a: unknown, b: unknown) {
  for (let i in a) {
    if (typeof b[i] == 'undefined') {
      return false
    }
    if (typeof b[i] == 'object') {
      if (!b[i].equals(a[i])) {
        return false
      }
    }
    if (b[i] != a[i]) {
      return false
    }
  }
  for (i in b) {
    if (typeof a[i] == 'undefined') {
      return false
    }
    if (typeof a[i] == 'object') {
      if (!a[i].equals(b[i])) {
        return false
      }
    }
    if (a[i] != b[i]) {
      return false
    }
  }
  return true
}
