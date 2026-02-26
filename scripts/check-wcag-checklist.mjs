import fs from "fs";
import path from "path";

const root = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function fail(message) {
  console.error(`\n[wcag:check] ${message}\n`);
  process.exit(1);
}

const layoutSource = read("app/layout.tsx");
if (!layoutSource.includes("<html lang=\"en\">")) {
  fail("Root layout must define `<html lang=\"en\">`.");
}

const globalsSource = read("styles/globals.css");
if (!globalsSource.includes(":focus-visible")) {
  fail("Global styles must define a :focus-visible treatment.");
}
if (!globalsSource.includes("outline:")) {
  fail("Focus-visible style must include a visible outline.");
}
if (!globalsSource.includes("outline-offset")) {
  fail("Focus-visible style should include outline-offset for clarity.");
}

const searchTargets = ["app", "components"];
const offenders = [];
for (const target of searchTargets) {
  const stack = [path.join(root, target)];
  while (stack.length) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(current)) {
        stack.push(path.join(current, child));
      }
      continue;
    }

    if (!/\.(tsx|jsx|ts|js)$/.test(current)) {
      continue;
    }

    const source = fs.readFileSync(current, "utf8");
    if (/<img\b/.test(source)) {
      offenders.push(path.relative(root, current));
    }
  }
}

if (offenders.length) {
  fail(`Raw <img> tags found. Use next/image.\n${offenders.map((file) => `- ${file}`).join("\n")}`);
}

console.log("[wcag:check] WCAG baseline checklist passed.");
