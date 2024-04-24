import eslint from '@eslint/js'
import jestPlugin from 'eslint-plugin-jest'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  {
    // config with just ignores is the replacement for `.eslintignore`
    files: ['src/**/*.ts'],
    ignores: ['**/dist/**', '**/benchmark/**', 'eslint.config.js'],
    extends: [eslint.configs.recommended, eslintPluginPrettierRecommended, ...tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
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
