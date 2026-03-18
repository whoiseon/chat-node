// @ts-check
import { nestConfig } from '@repo/eslint-config/nest';

export default [
  ...nestConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['eslint.config.mjs', 'dist/**'],
  },
];
