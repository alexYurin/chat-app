export default function isArray(array: unknown): array is [] {
  return Array.isArray(array)
}
