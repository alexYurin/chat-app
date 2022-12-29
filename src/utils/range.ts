export default function range(
  start = 0,
  end = 0,
  step = 1,
  isRight = false
): number[] {
  step = step >= 0 ? step : 1
  end = end === 0 ? start : end
  start = start >= 0 && start !== end ? start : 0

  const multiplier = end < 0 ? -1 : 1
  const length = Math.abs(end - start) / (step || 1)

  const array = Array.from({ length }, (_, index) => {
    if (index === 0 || step === 0) {
      return start
    }

    if (step > 1) {
      return (step + start) * index * multiplier
    }

    return (index + start) * multiplier
  })

  return isRight ? array.reverse() : array
}
