module.exports = {
  api: {
    input: {
      target: './src/api-openapi-spec.json',
      override: {
        transformer: './orval.transformer.cjs',
      },
    },
    output: {
      target: './src/__generated__/endpoints',
      fileExtension: '.gen.ts',
      mode: 'tags',
      headers: true,
      indexFiles: true,
      client: 'react-query',
      schemas: './src/__generated__/dto-schemas/',
      override: {
        mutator: {
          path: 'src/services/http.ts',
          name: 'useHttpManagerForGeneratedClient',
        },
      },
      urlEncodeParameters: true,
      prettier: true
    },
  },
};

