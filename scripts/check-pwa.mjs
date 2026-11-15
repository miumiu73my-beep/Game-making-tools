import assert from "node:assert/strict";
import {readFileSync, readdirSync, existsSync} from "node:fs";
const read = path => readFileSync(path, "utf8");
const manifest = JSON.parse(read("manifest.webmanifest"));
const worker = read("sw.js");
assert.equal(manifest.display, "standalone");
assert.equal(manifest.start_url, "./index.html");
for (const icon of manifest.icons) assert(existsSync(icon.src), "Missing icon: " + icon.src);
const htmlPages = readdirSync(".").filter(name => name.endsWith(".html"));
assert.equal(htmlPages.length, 9, "Expected launcher + eight browser tools");
for (const file of htmlPages) {
  const text = read(file);
  assert(text.includes("manifest.webmanifest"), "Missing manifest link: " + file);
  assert(text.includes("pwa-nav.js"), "Missing PWA navigation/registration: " + file);
  if (file !== "index.html") {
    const entry = "./" + encodeURIComponent(file);
    assert(worker.includes(entry), "Missing offline cache entry: " + file);
    assert(read("index.html").includes(encodeURIComponent(file)), "Missing launcher link: " + file);
  }
}
for (const file of ["browser-utils.js","pwa-nav.js"]) assert(worker.includes('"./' + file + '"'), "Missing cached script: " + file);
for (const shortcut of manifest.shortcuts || []) {
  assert(existsSync(decodeURIComponent(shortcut.url.replace(/^\.\//,""))), "Missing shortcut: " + shortcut.url);
}
console.log("Game-making-tools PWA: 8 browser tools, manifest, icons, launcher and offline cache verified.");
