import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  { ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'commitlint.config.js', 'apps/**/dist/**', 'apps/github-shortcut-badges/vitest.config.ts'] },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname }
    },
    rules: {
      'semi': ['error', 'never'],
      'eol-last': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'indent': ['error', 2],
      'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }]
    }
  },
  {
    files: ['**/*.tsx'],
    rules: {
      'jsx-quotes': ['error', 'prefer-double']
    }
  }
)
