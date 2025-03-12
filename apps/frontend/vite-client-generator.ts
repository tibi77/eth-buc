import crypto from 'crypto';
import fs from 'fs';
import shelljs from 'shelljs';
import { debounce } from 'throttle-debounce';

function generateClient() {
  shelljs.exec('pnpm run generate-client', (err, stdout, stderr) => {
    // TODO should skip this if no change has been detected
    console.log('Generating react query client...');
    const hasError = err || stderr || stdout.indexOf('OpenAPI spec has been converted into ready to use orval') === -1;
    if (hasError) {
      console.error(err);
      console.log(stdout);
      console.error(stderr);
    }
  });
}

function checksumFile(path: string) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(path);
    stream.on('error', reject);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

let lastChecksum: string | null = null;
const debouncedGenerateClient = debounce(1000, generateClient);

export const viteClientGeneratorPlugin = () => ({
  name: 'vite-client-generator-plugin',
  async handleHotUpdate({ file }: { file: string }) {
    if (file.endsWith('api-openapi-spec.json')) {
      const checksum = (await checksumFile(file)) as string;
      if (checksum !== lastChecksum) {
        lastChecksum = checksum;
        debouncedGenerateClient();
      } else {
        console.log('Skipping client generation, no change detected...');
      }
    }
  },
});
