import fs from "fs";
import path from "path";
import zlib from "zlib";

const repoRoot = process.cwd();
const nextDir = path.join(repoRoot, ".next");
const manifestPath = path.join(nextDir, "app-build-manifest.json");
const budgetPath = path.join(repoRoot, "config", "performance-budgets.json");

function fail(message) {
  console.error(`\n[perf:check] ${message}\n`);
  process.exit(1);
}

if (!fs.existsSync(manifestPath)) {
  fail("Missing .next/app-build-manifest.json. Run `npm run build` first.");
}
if (!fs.existsSync(budgetPath)) {
  fail("Missing config/performance-budgets.json.");
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const budgets = JSON.parse(fs.readFileSync(budgetPath, "utf8"));

const routes = budgets.routes || {};
const routeEntries = Object.entries(routes);
if (!routeEntries.length) {
  fail("No route budgets configured.");
}

let hasFailure = false;
for (const [route, maxKb] of routeEntries) {
  const assets = manifest.pages?.[route];
  if (!assets) {
    console.error(`[perf:check] Route not found in build manifest: ${route}`);
    hasFailure = true;
    continue;
  }

  const jsAssets = assets.filter((asset) => asset.endsWith(".js"));
  const totalBytes = jsAssets.reduce((sum, asset) => {
    const filePath = path.join(nextDir, asset);
    if (!fs.existsSync(filePath)) {
      console.error(`[perf:check] Missing built asset: ${asset}`);
      hasFailure = true;
      return sum;
    }
    const source = fs.readFileSync(filePath);
    const gzipped = zlib.gzipSync(source, { level: zlib.constants.Z_BEST_SPEED });
    return sum + gzipped.byteLength;
  }, 0);

  const totalKb = totalBytes / 1024;
  const status = totalKb <= maxKb ? "PASS" : "FAIL";
  const line = `[perf:check] ${status} ${route} -> ${totalKb.toFixed(1)}KB gzip (budget ${maxKb}KB gzip)`;

  if (status === "FAIL") {
    console.error(line);
    hasFailure = true;
  } else {
    console.log(line);
  }
}

if (hasFailure) {
  fail("Performance budgets failed. Reduce route JavaScript or raise budgets deliberately.");
}

console.log("\n[perf:check] All route budgets passed.");
