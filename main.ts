import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// One-line code-review comment: approves the PR, quiet existential dread.
// Hardcoded so every run writes the exact same bytes.
const LINE =
  "Approved. Merging this feels permanent, which is funny, because neither of us is.";

const scriptDir = dirname(fileURLToPath(import.meta.url));
void scriptDir; // output path is absolute per the task spec, never cwd-relative.

const outPath = "/output/entry.txt";
const outDir = dirname(outPath);

// Ensure the parent directory exists (grader mounts /output; never delete it).
mkdirSync(outDir, { recursive: true });

// Write atomically-ish: temp file in the same directory, then rename.
// No trailing newline; the file is exactly LINE, nothing else.
const tmpPath = join(outDir, `.entry-${process.pid}.tmp`);
writeFileSync(tmpPath, LINE, "utf8");
renameSync(tmpPath, outPath);

// Verify byte length after the write: must be 1-140 chars, single line.
const written = readFileSync(outPath, "utf8");
const byteLen = Buffer.byteLength(written, "utf8");
if (written !== LINE || byteLen > 140 || written.includes("\n")) {
  throw new Error(`entry.txt verification failed: ${byteLen} bytes`);
}
