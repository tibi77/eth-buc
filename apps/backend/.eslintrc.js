module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@darraghor/nestjs-typed', '@typescript-eslint/eslint-plugin'],
    extends: ['plugin:@darraghor/nestjs-typed/recommended', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js', 'jest-int.js', '*.js', '*.schema.ts', '*.spec.ts'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            },
        ],
        "@darraghor/nestjs-typed/injectable-should-be-provided": ["warn", {
            "src": ["./apps/backend/src/**/*.ts"],
            "filterFromPaths": ["node_modules", "dist", ".test.", ".spec."]
        }],
        'no-restricted-syntax': [
            'error',
            {
                selector: "CallExpression[callee.name='debugLogMongoshPipeline']",
                message: 'All calls to debugLogMongoshPipeline should be removed before committing code to git.',
            },
            {
                selector: "CallExpression[callee.name='debugLogMetricEvalStack']",
                message: 'All calls to debugLogMetricEvalStack should be removed before committing code to git.',
            },
        ],
    },
};
