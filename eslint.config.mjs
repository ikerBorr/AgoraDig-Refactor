// eslint.config.ts
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default defineConfig([
    {
        ignores: ['dist', 'node_modules'],
    },

    eslint.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            ...tseslint.configs.strictTypeChecked[1].rules,
            ...tseslint.configs.stylisticTypeChecked[1].rules,

            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/ban-ts-comment': [
                'warn',
                {
                    'ts-expect-error': 'allow-with-description',
                    'ts-ignore': false, // 👈 permite usar ts-ignore
                },
            ],
            'no-var': 'error',
            'prefer-const': ['error', { destructuring: 'all' }],
            eqeqeq: ['error', 'smart'],
            'object-shorthand': ['error', 'always'],
            'prefer-template': 'error',
            'no-debugger': 'error',
        },
    },

    {
        files: ['**/*.{test,spec}.{ts,tsx,js}'],
        rules: {
            'no-console': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
        },
    },

    {
        files: [
            '**/app/**/*.{ts,js}',
            '**/*.{config,conf}.{ts,js,mjs,cjs}',
            'eslint.config.{ts,js}',
        ],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            },
        },
        rules: {
            'no-console': 'off',
        },
    },
]);