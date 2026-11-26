// Five Seconds to Explain the Glass — a house cat excuses knocking a glass
// off the table, in one sentence, with zero remorse.
//
// The line is the entry: a single spoken sentence in the cat's own voice.
// The guard below enforces the sealed gate (entry.txt: UTF-8, 1-200 chars,
// not only whitespace) so a bad line can never be written out silently.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "I moved it to the floor for you — you're welcome, that's called helping, and frankly I'd like my tip now.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

export function validate(line: string): void {
  if (line.length < 1 || line.length > 200) {
    fail(`entry must be 1-200 characters, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    fail("entry must not be only whitespace");
  }
  // No control characters (other than the newline we append ourselves) and
  // no accidental leading/trailing whitespace: the entry is one clean
  // spoken sentence, and the file on disk must be exactly that sentence.
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    fail("entry must not contain control characters");
  }
  if (line !== line.trim()) {
    fail("entry must not start or end with whitespace");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
validate(LINE);
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, LINE + "\n", "utf8");
// Read-back check: the file on disk must be exactly the line + newline.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== LINE + "\n") {
  fail("read-back mismatch: entry.txt does not match the line");
}
console.log(`wrote ${outDir}/entry.txt (${LINE.length} chars)`);
