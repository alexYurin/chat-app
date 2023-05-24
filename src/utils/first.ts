export default function first<T>(array: T[]): T | undefined {
  return Array.from(array)[0]
}
