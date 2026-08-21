import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, generateKeyPairSync, sign } from 'node:crypto';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const development = process.argv.includes('--dev');
const version = JSON.parse(readFileSync(resolve(repositoryRoot, 'package.json'), 'utf8')).version;
const moduleId = 'clx.pet';
const outputRoot = resolve(repositoryRoot, 'dist-packs');
const finalDirectory = resolve(outputRoot, moduleId, version);

const uiBundle = resolve(repositoryRoot, 'dist-modules', moduleId, 'index.js');
const notice = resolve(repositoryRoot, 'modules', moduleId, 'NOTICE.txt');
const templateManifest = resolve(repositoryRoot, 'modules', moduleId, 'manifest.template.json');

for (const path of [uiBundle, notice, templateManifest]) {
  if (!existsSync(path) || !statSync(path).isFile()) {
    throw new Error(`Required artifact is missing: ${path}`);
  }
}

mkdirSync(resolve(finalDirectory, 'ui'), { recursive: true });
copyFileSync(uiBundle, resolve(finalDirectory, 'ui', 'index.js'));
copyFileSync(notice, resolve(finalDirectory, 'NOTICE.txt'));

const manifest = JSON.parse(readFileSync(templateManifest, 'utf8'));
manifest.version = version;

const { publicKey: pubBuf, privateKey: privBuf } = generateKeyPairSync('ed25519');
const pubBase64 = pubBuf.export({ type: 'spki', format: 'der' }).subarray(-32).toString('base64');
const sigPayload = JSON.stringify({ ...manifest, signature: undefined });
const sigValue = sign(null, Buffer.from(sigPayload), privBuf).toString('base64');
manifest.signature.keyId = development ? 'clx-development-v1' : 'clx-release-v1';
manifest.signature.value = sigValue;

writeFileSync(resolve(finalDirectory, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log(JSON.stringify({
  moduleId,
  version,
  directory: `dist-packs/${moduleId}/${version}`,
  keyId: manifest.signature.keyId,
  publicKey: pubBase64,
  development,
}));
