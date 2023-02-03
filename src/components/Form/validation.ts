export const validationRules = {
  login: {
    pattern: /^[a-zA-Z\-\_]+$/,
    errorText:
      'От 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).',
  },
  password: {
    pattern: /d/,
    errorText:
      'От 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра.',
  },
  email: {
    pattern: /d/,
    errorText:
      'Латиница, может включать цифры и спецсимволы вроде дефиса, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы.',
  },
  first_name: {
    pattern: /d/,
    errorText:
      'Латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).',
  },
  second_name: {
    pattern: /d/,
    errorText:
      'Латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).',
  },
  phone: {
    pattern: /d/,
    errorText:
      'От 10 до 15 символов, состоит из цифр, может начинается с плюса.',
  },
  password_confirm: {
    pattern: /d/,
    errorText: 'Поля ввода пароля не совпадают.',
  },
  message: {
    pattern: /d/,
    errorText: 'Не должно быть пустым.',
  },
  display_name: {
    pattern: /d/,
    errorText: 'Латиница или кириллица, от 2 до 20 символов.',
  },
}

export type RulesType = typeof validationRules

export default function validation(
  ruleKey: keyof typeof validationRules,
  value: string
) {
  const rule = validationRules[ruleKey]
  const isValid = rule.pattern.test(value)

  return { isValid, errorText: isValid ? undefined : rule.errorText }
}
