import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createHash, createPrivateKey, createPublicKey, sign, verify } from 'node:crypto';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const development = process.argv.includes('--dev');
const version = JSON.parse(readFileSync(resolve(repositoryRoot, 'package.json'), 'utf8')).version;
const moduleId = 'clx.ssh';
const sidecarName = 'clx-ssh-sidecar.exe';
const outputRoot = resolve(repositoryRoot, 'dist-packs');
const finalDirectory = resolve(outputRoot, moduleId, version);
const stagingDirectory = resolve(outputRoot, `.staging-${moduleId}-${process.pid}`);
assertInsideRepository(finalDirectory);
assertInsideRepository(stagingDirectory);

const seed = signingSeed(development);
const keyId = process.env.CLX_MODULE_KEY_ID || (development ? 'clx-development-v1' : 'clx-release-v1');
const privateKey = createPrivateKey({
  key: Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), seed]),
  format: 'der',
  type: 'pkcs8',
});
const publicDer = createPublicKey(privateKey).export({ format: 'der', type: 'spki' });
const publicKey = publicDer.subarray(publicDer.length - 32);

const sidecar = resolve(repositoryRoot, 'target', development ? 'debug' : 'release', sidecarName);
const uiBundle = resolve(repositoryRoot, 'dist-modules', moduleId, 'index.js');
const notice = resolve(repositoryRoot, 'crates', 'clx-ssh-sidecar', 'NOTICE.txt');
for (const path of [sidecar, uiBundle, notice]) {
  if (!existsSync(path) || !statSync(path).isFile()) {
    throw new Error(`Required module artifact is missing: ${relative(repositoryRoot, path)}`);
  }
}

rmSync(stagingDirectory, { recursive: true, force: true });
mkdirSync(resolve(stagingDirectory, 'bin'), { recursive: true });
mkdirSync(resolve(stagingDirectory, 'ui'), { recursive: true });
copyFileSync(sidecar, resolve(stagingDirectory, 'bin', sidecarName));
copyFileSync(uiBundle, resolve(stagingDirectory, 'ui', 'index.js'));
copyFileSync(notice, resolve(stagingDirectory, 'NOTICE.txt'));

const template = JSON.parse(
  readFileSync(resolve(repositoryRoot, 'modules', moduleId, 'manifest.template.json'), 'utf8'),
);
template.version = version;
template.signature.keyId = keyId;
template.files = [
  fileRecord(stagingDirectory, `bin/${sidecarName}`),
  fileRecord(stagingDirectory, 'ui/index.js'),
  fileRecord(stagingDirectory, 'NOTICE.txt'),
];
const unsigned = structuredClone(template);
delete unsigned.signature;
const signingBytes = Buffer.from(canonicalJson(unsigned));
template.signature.value = sign(null, signingBytes, privateKey).toString('base64');
if (!verify(null, signingBytes, createPublicKey(privateKey), Buffer.from(template.signature.value, 'base64'))) {
  throw new Error('Generated Remote SSH module signature did not verify');
}

writeFileSync(resolve(stagingDirectory, 'manifest.json'), `${JSON.stringify(template, null, 2)}\n`);
mkdirSync(resolve(outputRoot, moduleId), { recursive: true });
rmSync(finalDirectory, { recursive: true, force: true });
renameSync(stagingDirectory, finalDirectory);
writeFileSync(resolve(outputRoot, 'publisher-public-key.txt'), `${publicKey.toString('base64')}\n`);

process.stdout.write(`${JSON.stringify({
  moduleId,
  version,
  directory: relative(repositoryRoot, finalDirectory).split(sep).join('/'),
  keyId,
  publicKey: publicKey.toString('base64'),
  development,
})}\n`);

function signingSeed(useDevelopmentKey) {
  if (useDevelopmentKey) {
    return Buffer.from('f1d0c0b0a09080706050403020100f0e1d2c3b4a59687766554433221100ffee', 'hex');
  }
  const encoded = process.env.CLX_MODULE_SIGNING_KEY;
  if (!encoded) throw new Error('CLX_MODULE_SIGNING_KEY is required for production pack signing');
  const value = Buffer.from(encoded, 'base64');
  if (value.length !== 32) {
    throw new Error('CLX_MODULE_SIGNING_KEY must decode to a 32-byte Ed25519 seed');
  }
  return value;
}

function fileRecord(root, path) {
  const bytes = readFileSync(resolve(root, ...path.split('/')));
  return {
    path,
    size: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  };
}

function canonicalJson(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(',')}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
}

function assertInsideRepository(path) {
  const resolved = resolve(path);
  if (!resolved.startsWith(repositoryRoot + sep)) {
    throw new Error(`Staging path escaped repository: ${resolved}`);
  }
}
