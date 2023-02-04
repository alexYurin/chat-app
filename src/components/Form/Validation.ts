export type RuleKeyType = keyof typeof Validation.rules

export type ValidationProps = (typeof Validation.rules)[RuleKeyType]

export type ValidationObjectType = {
  field: string
  isValid: boolean
  errorText: string | undefined
}

export default class Validation {
  static rules = {
    login: {
      pattern: /^(?!^\d+$)(?![_-])(?!.*[_-]{2})[a-zA-Z0-9_-]{3,20}$/,
      errorText:
        'От 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).',
    },
    email: {
      pattern:
        /^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$/i,
      errorText:
        'Латиница, может включать цифры и спецсимволы вроде дефиса, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы.',
    },
    first_name: {
      pattern: /^[A-ZА-Я-]{1}[a-zа-я-]{2,30}$/,
      errorText:
        'Латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).',
    },
    second_name: {
      pattern: /^[A-ZА-Я-]{1}[a-zа-я-]{2,30}$/,
      errorText:
        'Латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).',
    },
    phone: {
      pattern: /^([+]?\d{1,2}[-\s]?|)\d{3}[-\s]?\d{3}[-\s]?\d{4}$/,
      errorText:
        'От 10 до 15 символов, состоит из цифр, может начинается с плюса.',
    },
    password: {
      pattern: /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{8,40})\S$/,
      errorText:
        'От 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра.',
    },
    password_confirm: {
      pattern: /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{8,40})\S$/,
      errorText: 'Поля ввода пароля не совпадают.',
    },
    message: {
      pattern: /[\S\s]/,
      errorText: 'Не должно быть пустым.',
    },
    display_name: {
      pattern: /^[A-ZА-Яa-zа-я]{2,20}$/,
      errorText: 'Латиница или кириллица, от 2 до 20 символов.',
    },
  }

  check(
    rule: ValidationProps,
    field: string,
    value: string
  ): ValidationObjectType {
    const isValid = rule.pattern.test(value)

    return {
      field,
      isValid,
      errorText: isValid ? undefined : rule.errorText,
    }
  }
}
