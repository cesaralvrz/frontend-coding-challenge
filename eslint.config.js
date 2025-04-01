import globals from 'globals';
import js from '@eslint/js';
import eslintPluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    plugins: {
      vue: eslintPluginVue,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        parser: 'espree'
      }
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    ...eslintPluginVue.configs['vue3-recommended'],
  },
  {
    files: ['**/*.{js,vue}'],
    ...prettier,
  },
];