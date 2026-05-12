import eslint from '@eslint/js'
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
  }
)
