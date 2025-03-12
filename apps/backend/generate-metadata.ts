import { PluginMetadataGenerator } from '@nestjs/cli/lib/compiler/plugins/plugin-metadata-generator';
import { ReadonlyVisitor } from '@nestjs/swagger/dist/plugin';
import { join } from 'path';

// according to this doc https://docs.nestjs.com/recipes/swc#monorepo
// we need to run the nest cli plugins manually with webpack
const generator = new PluginMetadataGenerator();
generator.generate({
  visitors: [
    new ReadonlyVisitor({ introspectComments: true, pathToSource: __dirname }),
  ],
  outputDir: __dirname,
  watch: true,
  tsconfigPath: join('tsconfig.json'),
});
