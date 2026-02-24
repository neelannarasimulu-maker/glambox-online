import { rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const targets = [".next", ".next-local"];

async function removeTarget(target) {
  const fullPath = path.join(process.cwd(), target);
  try {
    await rm(fullPath, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200
    });
    console.log(`clean: removed ${target}`);
  } catch (error) {
    console.error(`clean: failed to remove ${target}`);
    throw error;
  }
}

await Promise.all(targets.map(removeTarget));
