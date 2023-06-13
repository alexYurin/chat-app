declare module '*.svg' {
  const content: string

  export default content
}

declare module '*.pug' {
  const content: (locals: Record<string, unknown>) => string

  export default content
}

declare module '*.scss' {
  const content: Record<string, string>

  export default content
}
