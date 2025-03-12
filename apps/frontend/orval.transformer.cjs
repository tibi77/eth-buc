/**
 * Transformer function for orval.
 *
 * @param {OpenAPIObject} inputSchema
 * @return {OpenAPIObject}
 */
module.exports = (inputSchema) => {
    // strip the global prefix from all paths - it will be provided by the axios base url
    const prefix = '/api';
    return {
      ...inputSchema,
      paths: Object.keys(inputSchema.paths).reduce((acc, path) => {
        const newPath = path.replace(prefix, '');
        const endpoint = inputSchema.paths[path];
  
        // remove the word Controller from the operationId so that is not used
        // when generating the client
        Object.keys(endpoint).forEach((method) => {
          if (endpoint[method].operationId) {
            endpoint[method].operationId = endpoint[method].operationId.replace('Controller_', '_');
          }
        });
        acc[newPath] = endpoint;
        return acc;
      }, {}),
    };
  };
  