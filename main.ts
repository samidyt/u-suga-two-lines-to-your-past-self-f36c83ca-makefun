import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Two lines addressed to the speaker's past self. Exactly two lines,
// 163 characters including the single newline between them.
const ENTRY =
  "Don't tell your father you hate him across the dinner table on Christmas Eve, 2019.\n" +
  "He dies that February, and those will be the last words he ever hears from you.";

function pickOutDir() {
  const candidates = [process.env.OUTPUT_DIR, "/output", "./output"].filter(Boolean);
  for (const dir of candidates) {
    try {
      mkdirSync(dir, { recursive: true });
      return dir;
    } catch {
      // Not writable here; try the next candidate.
    }
  }
  console.error("gate FAIL: no writable output directory");
  process.exit(1);
}

const outDir = pickOutDir();
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read back and self-check the gate: 1-280 chars, exactly 2 lines, non-blank.
const back = readFileSync(outPath, "utf8");
const lines = back.split("\n");
if (back.length < 1 || back.length > 280) {
  console.error(`gate FAIL: ${back.length} chars (need 1-280)`);
  process.exit(1);
}
if (lines.length !== 2 || lines.some((l) => l.trim().length === 0)) {
  console.error(`gate FAIL: ${lines.length} lines (need exactly 2 non-blank)`);
  process.exit(1);
}
console.log(`wrote ${outPath}: ${back.length} chars, ${lines.length} lines`);
