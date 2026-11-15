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

// 保存方式の静的検査: HTML版では既存ファイルの書込みハンドルを取得しない。
for (const file of htmlPages) {
  const source = read(file);
  assert(!source.includes("showSaveFilePicker"), "Direct write picker is prohibited: " + file);
  assert(!source.includes("createWritable("), "Direct file overwrite is prohibited: " + file);
}
const utility = read("browser-utils.js");
assert(utility.includes("uniqueExportName("), "Missing unique export-name helper");
assert(utility.includes("link.download=outputName"), "Common export links must use unique names");
for (const path of ["pixel_grid_editor_v10_scriptable.html", "色塗る君.html", "骨組みくん.html"]) {
  const source = read(path);
  assert(source.includes('src="./browser-utils.js"'), "Missing shared export-name helper in: " + path);
  assert(source.includes("PWAUtils.uniqueExportName("), "Export must create a unique name: " + path);
}
assert(read("pixel_grid_editor_v10_scriptable.html").includes("PWAUtils.zip("), "Grid paint bundle should be ZIP");
assert(read("色塗る君.html").includes("PWAUtils.zip("), "Coloring bundle should be ZIP");

console.log("Game-making-tools PWA: 8 browser tools, installability, offline assets and new-file-only exports checked.");
