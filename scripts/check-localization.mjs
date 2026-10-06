import fs from 'node:fs';
import { collectInterfaceCopy } from './lib/localization-copy.mjs';

const catalog = JSON.parse(fs.readFileSync('src/i18n/messages.json', 'utf8'));
const invariants = new Set(JSON.parse(fs.readFileSync('src/i18n/invariants.json', 'utf8')));
const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort().join(',');
const failures = [];
for (const [key, entry] of Object.entries(catalog)) {
  if (!Array.isArray(entry) || entry.length !== 3 || entry.some((text) => typeof text !== 'string' || !text.trim())) {
    failures.push(`Incomplete en/vi/ko entry: ${key}`);
    continue;
  }
  for (const [index, text] of entry.entries()) if (placeholders(text) !== placeholders(key)) failures.push(`Placeholders differ in ${['en', 'vi', 'ko'][index]}: ${key}`);
}
for (const item of collectInterfaceCopy()) {
  if (item.kind === 'binding') failures.push(`${item.file}:${item.line}: translating a technical binding: ${item.text}`);
  else if (item.kind === 'literal' && !invariants.has(item.text)) failures.push(`${item.file}:${item.line}: literal interface copy: ${item.text}`);
  else if (!catalog[item.text] && !invariants.has(item.text)) failures.push(`${item.file}:${item.line}: missing catalog entry: ${item.text}`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log(`Localization audit passed: ${Object.keys(catalog).length} complete en/vi/ko messages; UI literals, placeholders, and technical bindings checked.`);
