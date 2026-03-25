import { defineConfig } from '@hey-api/openapi-ts';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  input: {
    path: isDev ? 'http://localhost:4003/swagger-json' : './src/openapi.json',
  },
  output: './src/__generated__',
});
