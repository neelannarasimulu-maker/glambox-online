import fs from "fs";
import path from "path";

const requiredChecks = [
  {
    file: "components/sections/HeroSection.tsx",
    patterns: ["<Image", "priority", "sizes=\"100vw\""],
    description: "Hero image should use prioritized Next Image with explicit responsive sizing."
  },
  {
    file: "app/(site)/page.tsx",
    patterns: ["priority={index < 3}", "sizes=\"(min-width: 768px) 33vw, 100vw\""],
    description: "Landing popup cards should prioritize first-row images."
  },
  {
    file: "app/(site)/explore/page.tsx",
    patterns: ["priority={index < 3}", "sizes=\"(min-width: 768px) 33vw, 100vw\""],
    description: "Explore cards should prioritize first-row images."
  },
  {
    file: "app/(site)/book/page.tsx",
    patterns: ["priority={index < 3}", "sizes=\"(min-width: 768px) 33vw, 100vw\""],
    description: "Book cards should prioritize first-row images."
  }
];

function fail(message) {
  console.error(`\n[image:check] ${message}\n`);
  process.exit(1);
}

let hasFailure = false;
for (const check of requiredChecks) {
  const fullPath = path.join(process.cwd(), check.file);
  if (!fs.existsSync(fullPath)) {
    console.error(`[image:check] Missing file: ${check.file}`);
    hasFailure = true;
    continue;
  }

  const source = fs.readFileSync(fullPath, "utf8");
  for (const pattern of check.patterns) {
    if (!source.includes(pattern)) {
      console.error(`[image:check] Missing pattern "${pattern}" in ${check.file}`);
      console.error(`[image:check] Context: ${check.description}`);
      hasFailure = true;
    }
  }
}

if (hasFailure) {
  fail("Image loading strategy check failed.");
}

console.log("[image:check] Image priority strategy checks passed.");
