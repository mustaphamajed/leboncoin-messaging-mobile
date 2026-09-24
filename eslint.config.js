// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/services/*', '@/lib/*', '@/components/*', '@/context/*', '@/providers/*', '@/features/*/*'],
              message: 'Import from the folder index (e.g. "@/services" or "@/features/messages") instead of a deep path.',
            },
          ],
        },
      ],
    },
  },
]);
