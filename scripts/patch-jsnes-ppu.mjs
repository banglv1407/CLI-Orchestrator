import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const JSNES_PATCH_VERSION = "2.1.0";
export const JSNES_PPU_BROKEN_LINE =
  "let top = (sprTile & 1) !== 0 ? topTileNum - 1 + 256 : topTileNum;";
export const JSNES_PPU_FIXED_LINE =
  "let top = topTileNum + ((sprTile & 1) !== 0 ? 256 : 0);";

export function patchJsnesPpuSource(source) {
  if (source.includes(JSNES_PPU_FIXED_LINE)) {
    return { source, status: "already-patched" };
  }

  const occurrences = source.split(JSNES_PPU_BROKEN_LINE).length - 1;
  if (occurrences !== 1) {
    throw new Error(
      `Expected one JSNES 8x16 sprite bug signature, found ${occurrences}. ` +
        "Refusing to patch an unknown dependency layout.",
    );
  }

  return {
    source: source.replace(JSNES_PPU_BROKEN_LINE, JSNES_PPU_FIXED_LINE),
    status: "patched",
  };
}

export async function patchInstalledJsnes(repoRoot) {
  const packagePath = resolve(repoRoot, "node_modules", "jsnes", "package.json");
  const ppuPath = resolve(repoRoot, "node_modules", "jsnes", "src", "ppu", "index.js");
  const packageMetadata = JSON.parse(await readFile(packagePath, "utf8"));

  if (packageMetadata.version !== JSNES_PATCH_VERSION) {
    throw new Error(
      `JSNES PPU patch supports ${JSNES_PATCH_VERSION}, found ${packageMetadata.version}. ` +
        "Review the upstream sprite fix before changing the pinned dependency.",
    );
  }

  const original = await readFile(ppuPath, "utf8");
  const result = patchJsnesPpuSource(original);
  if (result.status === "patched") {
    await writeFile(ppuPath, result.source, "utf8");
  }

  console.log(
    `JSNES ${JSNES_PATCH_VERSION} 8x16 sprite patch: ${result.status}.`,
  );
  return result.status;
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const repoRoot = resolve(dirname(scriptPath), "..");
  await patchInstalledJsnes(repoRoot);
}
