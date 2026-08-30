import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const assets = [
  'public/rogue/assets/operator-atlas.png',
  'public/rogue/assets/station-props-atlas.png',
  'public/rogue/assets/station-tiles-atlas.png',
];
const expectedFrames = 4;
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

for (const relativePath of assets) {
  const asset = resolve(relativePath);
  const data = await readFile(asset);
  if (!data.subarray(0, 8).equals(pngSignature)) throw new Error(`${relativePath} is not a PNG.`);
  if (data.toString('ascii', 12, 16) !== 'IHDR') throw new Error(`${relativePath} is missing IHDR.`);
  const width = data.readUInt32BE(16);
  const height = data.readUInt32BE(20);
  const bitDepth = data.readUInt8(24);
  const colorType = data.readUInt8(25);
  const fileSize = (await stat(asset)).size;
  if (width % expectedFrames || height % expectedFrames) throw new Error(`${relativePath} ${width}x${height} is not a 4x4 grid.`);
  if (width / expectedFrames < 64 || height / expectedFrames < 64) throw new Error(`${relativePath} frames must be at least 64px.`);
  if (bitDepth !== 8 || ![4, 6].includes(colorType)) throw new Error(`${relativePath} must be 8-bit PNG with alpha.`);
  if (fileSize > 1_500_000) throw new Error(`${relativePath} is ${fileSize} bytes; keep it below 1.5 MB.`);
  console.log(`Rogue atlas OK: ${relativePath}, ${width}x${height}, ${width / 4}x${height / 4} frames, ${fileSize} bytes.`);
}