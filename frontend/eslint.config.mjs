import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: ['.nuxt/**', 'dist/**', 'node_modules/**', 'coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      'no-undef': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/attribute-hyphenation': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  prettierConfig,
)
