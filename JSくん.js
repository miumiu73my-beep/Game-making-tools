// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
// Variables used by Scriptable.
// icon-color: deep-purple; icon-glyph: file-code;

const CONFIG = {
  outputFolderName: "JSくん_出力",
  supportedExtensions: ["md", "txt", "js"],
  skipCommentLines: true,
  includeSourceLineNumber: true,
  overwrite: true,
  maxRecommendedFileSizeKB: 2048,
};

await main();

async function main() {
  const fm = FileManager.iCloud();
  const outputDir = ensureOutputDirectory(fm);
  const reservedOutputNames = {};

  const inputPaths = await collectInputPaths();
  if (!inputPaths.length) {
    await showMessage("JSくん", "ファイルが選択されませんでした。");
    Script.complete();
    return;
  }

  const results = [];
  for (const rawPath of inputPaths) {
    const path = normalizePossibleFileURL(rawPath);
    const ext = getExtension(path);

    if (!CONFIG.supportedExtensions.includes(ext)) {
      results.push({
        ok: false,
        input: path,
        reason: `未対応の拡張子です: .${ext || "(なし)"}`,
      });
      continue;
    }

    try {
      const result = await convertFile(path, fm, outputDir, reservedOutputNames);
      results.push(result);
    } catch (error) {
      results.push({
        ok: false,
        input: path,
        reason: String(error),
      });
    }
  }

  const reportPath = writeReport(fm, outputDir, results);
  await presentSummary(results, outputDir, reportPath);
  Script.complete();
}

async function collectInputPaths() {
  const picked = [];

  if (args.fileURLs && args.fileURLs.length > 0) {
    for (const fileURL of args.fileURLs) picked.push(fileURL);
    return uniqueStrings(picked);
  }

  const paths = await DocumentPicker.open(["public.plain-text"]);
  for (const path of paths) picked.push(path);
  return uniqueStrings(picked);
}

function ensureOutputDirectory(fm) {
  const dir = fm.joinPath(fm.documentsDirectory(), CONFIG.outputFolderName);
  if (!fm.fileExists(dir)) fm.createDirectory(dir, true);
  return dir;
}

async function convertFile(inputPath, fm, outputDir, reservedOutputNames) {
  if (!fm.fileExists(inputPath)) {
    throw new Error("ファイルが見つかりません。");
  }

  await safeDownloadIfNeeded(fm, inputPath);

  const ext = getExtension(inputPath);
  if (ext === "js") {
    return copyJsFile(inputPath, fm, outputDir, reservedOutputNames);
  }

  return convertScenarioFile(inputPath, fm, outputDir, reservedOutputNames);
}

async function convertScenarioFile(inputPath, fm, outputDir, reservedOutputNames) {
  const ext = getExtension(inputPath);
  const sizeKB = fm.fileSize(inputPath);
  const warnings = [];

  if (sizeKB != null && sizeKB > CONFIG.maxRecommendedFileSizeKB) {
    warnings.push(
      `ファイルサイズが ${Math.round(sizeKB)}KB あります。重い場合は分割推奨です。`
    );
  }

  const sourceText = readTextRobustly(fm, inputPath);
  const parsed = parseScenarioText(sourceText);
  const outputJS = buildJSOutput({
    sourcePath: inputPath,
    entries: parsed.entries,
    stats: parsed.stats,
    warnings,
  });

  const baseName = getBaseName(inputPath);
  const preferredOutputName = `${sanitizeFileName(baseName)}__from_${ext}.js`;
  const outputPath = chooseOutputPath(
    fm,
    outputDir,
    preferredOutputName,
    reservedOutputNames
  );

  fm.writeString(outputPath, outputJS);

  return {
    ok: true,
    kind: "converted",
    input: inputPath,
    output: outputPath,
    outputName: getFileName(outputPath),
    sizeKB,
    warnings,
    stats: parsed.stats,
  };
}

async function copyJsFile(inputPath, fm, outputDir, reservedOutputNames) {
  const sizeKB = fm.fileSize(inputPath);
  const warnings = ["入力が .js だったため、変換せずそのままコピーしました。"];

  const sourceText = readTextRobustly(fm, inputPath);
  const baseName = getBaseName(inputPath);
  const preferredOutputName = `${sanitizeFileName(baseName)}__copied.js`;
  const outputPath = chooseOutputPath(
    fm,
    outputDir,
    preferredOutputName,
    reservedOutputNames
  );

  fm.writeString(outputPath, sourceText);

  return {
    ok: true,
    kind: "copied",
    input: inputPath,
    output: outputPath,
    outputName: getFileName(outputPath),
    sizeKB,
    warnings,
    stats: {
      totalLines: countLines(sourceText),
      usedLines: countLines(sourceText),
      dialogueCount: 0,
      actionCount: 0,
      controlCount: 0,
      skippedLines: 0,
    },
  };
}

function chooseOutputPath(fm, outputDir, preferredName, reservedOutputNames) {
  const dot = preferredName.lastIndexOf(".");
  const stem = dot >= 0 ? preferredName.slice(0, dot) : preferredName;
  const ext = dot >= 0 ? preferredName.slice(dot) : "";

  let index = 1;
  while (true) {
    const candidateName = index === 1 ? `${stem}${ext}` : `${stem}_${index}${ext}`;
    const candidatePath = fm.joinPath(outputDir, candidateName);

    if (!reservedOutputNames[candidateName]) {
      if (index === 1 && CONFIG.overwrite) {
        reservedOutputNames[candidateName] = true;
        return candidatePath;
      }

      if (!fm.fileExists(candidatePath)) {
        reservedOutputNames[candidateName] = true;
        return candidatePath;
      }
    }

    index++;
  }
}

async function safeDownloadIfNeeded(fm, path) {
  if (!fm.fileExists(path)) return;
  try {
    await fm.downloadFileFromiCloud(path);
  } catch (_) {
    // 既にDL済みやローカルならそのまま
  }
}

function readTextRobustly(fm, path) {
  try {
    const text = fm.readString(path);
    if (text != null) return stripBom(text);
  } catch (_) {
    // 次へ
  }

  const data = fm.read(path);
  if (!data) throw new Error("ファイルを読み込めませんでした。");

  const bytes = data.getBytes();
  if (!bytes || !bytes.length) return "";

  return decodeBytes(bytes);
}

function decodeBytes(bytes) {
  if (hasPrefix(bytes, [0xef, 0xbb, 0xbf])) {
    return decodeUtf8(bytes.slice(3));
  }
  if (hasPrefix(bytes, [0xff, 0xfe])) {
    return decodeUtf16LE(bytes.slice(2));
  }
  if (hasPrefix(bytes, [0xfe, 0xff])) {
    return decodeUtf16BE(bytes.slice(2));
  }

  try {
    const text = Data.fromBytes(bytes).toRawString();
    if (text != null) return stripBom(text);
  } catch (_) {
    // 次へ
  }

  return decodeUtf8(bytes);
}

function decodeUtf8(bytes) {
  let result = "";
  for (let i = 0; i < bytes.length; i++) {
    const b1 = bytes[i];

    if (b1 < 0x80) {
      result += String.fromCharCode(b1);
      continue;
    }

    if ((b1 & 0xe0) === 0xc0) {
      const b2 = bytes[++i];
      if (b2 == null) {
        result += "�";
        break;
      }
      const cp = ((b1 & 0x1f) << 6) | (b2 & 0x3f);
      result += String.fromCharCode(cp);
      continue;
    }

    if ((b1 & 0xf0) === 0xe0) {
      const b2 = bytes[++i];
      const b3 = bytes[++i];
      if (b2 == null || b3 == null) {
        result += "�";
        break;
      }
      const cp = ((b1 & 0x0f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f);
      result += String.fromCharCode(cp);
      continue;
    }

    if ((b1 & 0xf8) === 0xf0) {
      const b2 = bytes[++i];
      const b3 = bytes[++i];
      const b4 = bytes[++i];
      if (b2 == null || b3 == null || b4 == null) {
        result += "�";
        break;
      }
      let cp =
        ((b1 & 0x07) << 18) |
        ((b2 & 0x3f) << 12) |
        ((b3 & 0x3f) << 6) |
        (b4 & 0x3f);
      cp -= 0x10000;
      result += String.fromCharCode(0xd800 + (cp >> 10));
      result += String.fromCharCode(0xdc00 + (cp & 0x3ff));
      continue;
    }

    result += "�";
  }
  return stripBom(result);
}

function decodeUtf16LE(bytes) {
  let result = "";
  for (let i = 0; i < bytes.length; i += 2) {
    const lo = bytes[i];
    const hi = bytes[i + 1];
    if (hi == null) break;
    result += String.fromCharCode((hi << 8) | lo);
  }
  return stripBom(result);
}

function decodeUtf16BE(bytes) {
  let result = "";
  for (let i = 0; i < bytes.length; i += 2) {
    const hi = bytes[i];
    const lo = bytes[i + 1];
    if (lo == null) break;
    result += String.fromCharCode((hi << 8) | lo);
  }
  return stripBom(result);
}

function parseScenarioText(text) {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = normalized.split("\n");
  const entries = [];
  let insideCodeFence = false;

  const stats = {
    totalLines: lines.length,
    usedLines: 0,
    dialogueCount: 0,
    actionCount: 0,
    controlCount: 0,
    skippedLines: 0,
  };

  for (let index = 0; index < lines.length; index++) {
    let line = stripBom(lines[index]).trim();
    const sourceLine = index + 1;

    if (!line) {
      stats.skippedLines++;
      continue;
    }

    if (/^```/.test(line)) {
      insideCodeFence = !insideCodeFence;
      stats.skippedLines++;
      continue;
    }
    if (insideCodeFence) {
      stats.skippedLines++;
      continue;
    }

    line = normalizeDecorativePrefix(line);

    if (!line) {
      stats.skippedLines++;
      continue;
    }

    if (CONFIG.skipCommentLines && /^(\/\/|;|※|注:|注記:)/.test(line)) {
      stats.skippedLines++;
      continue;
    }

    const control = parseControlLine(line, sourceLine);
    if (control) {
      entries.push(control);
      stats.usedLines++;
      stats.controlCount++;
      continue;
    }

    const dialogue = parseDialogueLine(line, sourceLine);
    if (dialogue) {
      entries.push(dialogue);
      stats.usedLines++;
      stats.dialogueCount++;
      continue;
    }

    entries.push(makeActionEntry(line, sourceLine));
    stats.usedLines++;
    stats.actionCount++;
  }

  return { entries, stats };
}

function parseControlLine(line, sourceLine) {
  const m = line.match(/^<<\s*([A-Z_]+)\s*:?\s*(.*?)\s*>>$/i);
  if (!m) return null;

  return attachLineNumber(
    {
      type: "control",
      command: m[1].toUpperCase(),
      value: m[2] || "",
    },
    sourceLine
  );
}

function parseDialogueLine(line, sourceLine) {
  const start = line.indexOf("「");
  const end = line.lastIndexOf("」");
  if (start <= 0 || end <= start) return null;

  const speaker = cleanupField(line.slice(0, start));
  const text = cleanupField(line.slice(start + 1, end));
  const tail = cleanupField(line.slice(end + 1));

  const meta = splitMeta(tail);
  return attachLineNumber(
    {
      type: "dialogue",
      speaker,
      text,
      expression: meta.expression,
      background: meta.background,
      note: meta.note,
    },
    sourceLine
  );
}

function makeActionEntry(line, sourceLine) {
  return attachLineNumber(
    {
      type: "action",
      text: cleanupField(line),
    },
    sourceLine
  );
}

function splitMeta(tail) {
  if (!tail) return { expression: "", background: "", note: "" };

  const cleanTail = tail.replace(/^[：:\-\s]+/, "").trim();
  if (!cleanTail) return { expression: "", background: "", note: "" };

  const parts = cleanTail
    .split(/[，,]/)
    .map((v) => cleanupField(v))
    .filter(Boolean);

  return {
    expression: parts[0] || "",
    background: parts[1] || "",
    note: parts.slice(2).join(", "),
  };
}

function buildJSOutput({ sourcePath, entries, stats, warnings }) {
  const sourceName = getFileName(sourcePath);
  const payload = {
    sourceFile: sourceName,
    generatedAt: formatDate(new Date()),
    stats,
    warnings,
    entries,
  };

  const body = JSON.stringify(payload, null, 2);
  return [
    `// Auto-generated by JSくん`,
    `// source: ${sourceName}`,
    ``,
    `const scriptData = ${body};`,
    ``,
    `if (typeof module !== "undefined") {`,
    `  module.exports = scriptData;`,
    `}`,
    ``,
  ].join("\n");
}

function writeReport(fm, outputDir, results) {
  const lines = [];
  lines.push(`JSくん 変換レポート`);
  lines.push(`生成日時: ${formatDate(new Date())}`);
  lines.push("");

  for (const result of results) {
    lines.push(result.ok ? "[OK]" : "[NG]");
    lines.push(`入力: ${result.input}`);
    if (result.ok) {
      lines.push(`種類: ${result.kind || "converted"}`);
      lines.push(`出力: ${result.output}`);
      lines.push(
        `件数: dialogue=${result.stats.dialogueCount}, action=${result.stats.actionCount}, control=${result.stats.controlCount}`
      );
      if (result.warnings && result.warnings.length) {
        lines.push(`警告: ${result.warnings.join(" / ")}`);
      }
    } else {
      lines.push(`理由: ${result.reason}`);
    }
    lines.push("");
  }

  const reportPath = fm.joinPath(outputDir, "_JSくん_変換レポート.txt");
  fm.writeString(reportPath, lines.join("\n"));
  return reportPath;
}

async function presentSummary(results, outputDir, reportPath) {
  const okCount = results.filter((r) => r.ok).length;
  const ngCount = results.length - okCount;

  const lines = [];
  lines.push(`保存先:`);
  lines.push(outputDir);
  lines.push("");
  lines.push(`成功: ${okCount}件 / 失敗: ${ngCount}件`);

  for (const result of results) {
    if (!result.ok) {
      lines.push(`・NG: ${getFileName(result.input)} → ${result.reason}`);
      continue;
    }

    if (result.kind === "copied") {
      lines.push(`・OK: ${getFileName(result.input)} → ${result.outputName} (そのままコピー)`);
      continue;
    }

    lines.push(
      `・OK: ${getFileName(result.input)} → ${result.outputName} (会話${result.stats.dialogueCount}/動作${result.stats.actionCount}/制御${result.stats.controlCount})`
    );
  }

  lines.push("");
  lines.push(`レポート:`);
  lines.push(reportPath);

  const alert = new Alert();
  alert.title = "JSくん";
  alert.message = lines.join("\n");
  alert.addAction("OK");
  alert.addAction("レポートを見る");
  const choice = await alert.presentAlert();
  if (choice === 1) {
    await QuickLook.present(reportPath, false);
  }
}

async function showMessage(title, message) {
  const alert = new Alert();
  alert.title = title;
  alert.message = message;
  alert.addAction("OK");
  await alert.presentAlert();
}

function normalizeDecorativePrefix(line) {
  let s = line.trim();
  s = s.replace(/^#{1,6}\s*/, "");
  s = s.replace(/^[-*•]\s+/, "");
  s = s.replace(/^\d+[.)]\s+/, "");
  return s.trim();
}

function cleanupField(value) {
  return String(value || "")
    .replace(/^\uFEFF/, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function stripBom(text) {
  return String(text || "").replace(/^\uFEFF/, "");
}

function attachLineNumber(obj, sourceLine) {
  if (CONFIG.includeSourceLineNumber) obj.sourceLine = sourceLine;
  return obj;
}

function normalizePossibleFileURL(value) {
  if (typeof value !== "string") return String(value || "");
  if (!/^file:\/\//i.test(value)) return value;

  let path = value.replace(/^file:\/\//i, "");
  path = path.replace(/^localhost/i, "");
  try {
    path = decodeURIComponent(path);
  } catch (_) {}
  return path;
}

function hasPrefix(bytes, prefix) {
  if (bytes.length < prefix.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (bytes[i] !== prefix[i]) return false;
  }
  return true;
}

function uniqueStrings(list) {
  const seen = {};
  const out = [];
  for (const item of list) {
    const key = String(item);
    if (seen[key]) continue;
    seen[key] = true;
    out.push(item);
  }
  return out;
}

function getFileName(path) {
  const parts = String(path).split("/");
  return parts[parts.length - 1] || path;
}

function getBaseName(path) {
  const fileName = getFileName(path);
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(0, dot) : fileName;
}

function getExtension(path) {
  const fileName = getFileName(path).toLowerCase();
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(dot + 1) : "";
}

function sanitizeFileName(name) {
  return String(name || "untitled")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_")
    .replace(/\s+/g, "_")
    .trim();
}

function countLines(text) {
  if (!text) return 0;
  return String(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").length;
}

function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  const hh = pad2(date.getHours());
  const mi = pad2(date.getMinutes());
  const ss = pad2(date.getSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function pad2(n) {
  return n < 10 ? `0${n}` : String(n);
}