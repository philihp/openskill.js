import eslint from '@eslint/js'
import jestPlugin from 'eslint-plugin-jest'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/benchmark/**', 'eslint.config.js'],
  },
  {
    files: ['src/**/*.ts'],
    extends: [eslint.configs.recommended, eslintPluginPrettierRecommended, ...tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          // allow unused variables if they begin with _
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['src/**/__tests__/*.ts', 'src/**/*.test.ts'],
    extends: [jestPlugin.configs['flat/recommended']],
  }
)
