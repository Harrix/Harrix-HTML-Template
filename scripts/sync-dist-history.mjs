/**
 * Copies build output from dist/ into a separate git repo for history tracking.
 * Set DIST_HISTORY_REPO to an absolute path to that repo's root (where .git lives).
 * If unset, exits 0 and skips (for CI / contributors without a mirror clone).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");

const targetRoot = process.env.DIST_HISTORY_REPO?.trim();

if (!targetRoot) {
  console.error(
    "[sync-dist-history] DIST_HISTORY_REPO is not set; skipping mirror sync",
  );
  process.exit(0);
}

const resolvedTarget = path.resolve(targetRoot);

if (!fs.existsSync(distDir) || !fs.statSync(distDir).isDirectory()) {
  console.error("[sync-dist-history] dist/ is missing or not a directory");
  process.exit(1);
}

if (!fs.existsSync(resolvedTarget) || !fs.statSync(resolvedTarget).isDirectory()) {
  console.error(
    `[sync-dist-history] DIST_HISTORY_REPO is not a directory: ${resolvedTarget}`,
  );
  process.exit(1);
}

const gitMarker = path.join(resolvedTarget, ".git");
if (!fs.existsSync(gitMarker)) {
  console.error(
    `[sync-dist-history] expected a git repo root (.git missing): ${resolvedTarget}`,
  );
  process.exit(1);
}

for (const ent of fs.readdirSync(resolvedTarget, { withFileTypes: true })) {
  if (ent.name === ".git") continue;
  fs.rmSync(path.join(resolvedTarget, ent.name), { recursive: true, force: true });
}

for (const ent of fs.readdirSync(distDir, { withFileTypes: true })) {
  const from = path.join(distDir, ent.name);
  const to = path.join(resolvedTarget, ent.name);
  fs.cpSync(from, to, { recursive: true, force: true });
}

console.error(`[sync-dist-history] synced dist/ → ${resolvedTarget}`);
