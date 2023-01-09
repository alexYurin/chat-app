import range from './range'

export default function rangeRight(start = 0, end = 0, step = 1) {
  return range(start, end, step, true)
}
