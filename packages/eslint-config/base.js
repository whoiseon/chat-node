import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';
import eslintPluginImport from 'eslint-plugin-import';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  // ignore rules
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'external', // 외부 라이브러리
            'parent', // 부모 파일
            'sibling', // 형제 파일
            'internal', // 내부 모듈
            'type', // 타입 파일
          ],
          pathGroups: [{ pattern: '@/**', group: 'parent' }],
          pathGroupsExcludedImportTypes: ['type'],
          alphabetize: {
            order: 'asc', // 알파벳 순서로 정렬
            caseInsensitive: true, // 대소문자 구분 없음
          },
          'newlines-between': 'always', // 그룹 사이에 빈 줄 추가
        },
      ],
    },
  },
  {
    ignores: ['dist/**'],
  },
];
