module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'plugin:storybook/recommended',
  ],
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        project: './*/tsconfig.json',
      },
    },
    typescript: {},
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
    project: ['./tsconfig.json'], // Specify it only for TypeScript files
  },
  plugins: ['import', 'react', '@typescript-eslint'],
  rules: {
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.tsx', '.jsx'],
      },
    ],
    'import/extensions': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    'max-classes-per-file': 'off',
    'class-methods-use-this': 'off',
    radix: 'off',
    'prefer-destructuring': 'off',
    'react/prop-types': 'off',
    // we are using typescript so prop type validation is not required,
    'react/jsx-props-no-spreading': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: true,
      },
    ],
  },
  overrides: [
    {
      files: ['*/**/*.test.*', '*/**/*.stories.*', '*/**/test*'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
            optionalDependencies: false,
            peerDependencies: true,
          },
        ],
        'no-await-in-loop': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-inline-styles': false,
      },
    },
    {
      files: ['*/**/*.tsx'],
      rules: {
        'global-require': 'off',
        // for using require between the code,
        '@typescript-eslint/explicit-module-boundary-types': 'off', // react components dont need unnecessary return type on functions like render()
      },
    },
  ],
};
