import fs from 'fs';
import path from 'path';

let projectRootPath: string | null = null;

function pathContainFile(
  startPathTokens: string[],
  file: string,
): string | null {
  const currentPath = startPathTokens.join(path.sep);
  const currentFile = path.join(currentPath, file);
  if (fs.existsSync(currentFile)) {
    return currentPath;
  }
  if (startPathTokens.length === 0) {
    return null;
  }
  startPathTokens.pop();
  return pathContainFile(startPathTokens, file);
}

export function getMonoRepoRootPath() {
  const pathTokens = __dirname.split(path.sep);
  const monoRepoRoot = pathContainFile(pathTokens, 'pnpm-workspace.yaml');
  if (monoRepoRoot) {
    return monoRepoRoot;
  }
  throw new Error('Could not find monorepo root path.');
}
export function getProjectRootPath() {
  if (projectRootPath) {
    return projectRootPath;
  }
  const monoRepoRoot = getMonoRepoRootPath();
  if (monoRepoRoot) {
    const bePath = path.join(monoRepoRoot, 'apps', 'backend');
    projectRootPath = bePath;
    return bePath;
  }
  throw new Error('Could not find project root path for the backend project.');
}
