module.exports = {
  extends: [
    'stylelint-config-sass-guidelines',
    'stylelint-config-prettier-scss',
  ],
  rules: {
    'selector-class-pattern': null,
    'order/properties-alphabetical-order': null,
    'scss/selector-no-redundant-nesting-selector': null,
    'color-hex-length': 'long',
    'max-nesting-depth': 4,
  },
}
