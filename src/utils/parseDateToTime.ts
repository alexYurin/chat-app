export default function parseDateToTime(date: Date) {
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`
}
