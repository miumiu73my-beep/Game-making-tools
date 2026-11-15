// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: folder;
// Scriptable
// 選択した複数ファイルから、指定した文字列をファイル名から削除して
// 選択した保存先フォルダに「リネーム済みコピー」として保存します。
// 元ファイルは変更しません。

const fmLocal = FileManager.local()
const fmICloud = FileManager.iCloud()

await main()
Script.complete()

async function main() {
  const intro = new Alert()
  intro.title = 'まとめてリネーム保存'
  intro.message = [
    '1. 元ファイルを複数選択',
    '2. ファイル名から削除したい部分を選択または入力',
    '3. 保存先フォルダを選択',
    '4. リネーム済みコピーを保存',
    '',
    '元ファイルはそのまま残ります。'
  ].join('\n')
  intro.addAction('開始')
  intro.addCancelAction('キャンセル')
  const introRes = await intro.presentAlert()
  if (introRes === -1) return

  const paths = await DocumentPicker.open(['public.item'])
  if (!paths || paths.length === 0) return

  const files = []
  for (const path of paths) {
    const fileName = lastPathComponent(path)
    const parts = splitBaseAndExt(fileName)
    files.push({
      sourcePath: path,
      originalName: fileName,
      base: parts.base,
      ext: parts.ext,
    })
  }

  const bases = files.map(x => x.base)
  const candidates = buildDeleteCandidates(bases)
  const deleteText = await chooseDeleteText(candidates, files)
  if (deleteText == null) return

  const previewText = buildPreview(files, deleteText)
  const confirm = new Alert()
  confirm.title = 'この内容で進めますか？'
  confirm.message = [
    `削除する文字列: 「${deleteText}」`,
    '',
    previewText,
  ].join('\n')
  confirm.addAction('保存先を選ぶ')
  confirm.addCancelAction('キャンセル')
  const confirmRes = await confirm.presentAlert()
  if (confirmRes === -1) return

  const outFolder = await DocumentPicker.openFolder()
  if (!outFolder) return

  const writer = detectWritableManager(outFolder)
  const usedNames = new Set()
  const resultLines = []
  let savedCount = 0

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const data = readAnyData(file.sourcePath)
    if (!data) {
      resultLines.push(`× ${file.originalName} -> 読み込み失敗`)
      continue
    }

    const renamedBase = makeRenamedBase(file.base, deleteText, i)
    const proposedName = renamedBase + file.ext
    const finalName = makeUniqueFileName(writer, outFolder, proposedName, usedNames)
    const destPath = writer.joinPath(outFolder, finalName)

    try {
      writer.write(destPath, data)
      usedNames.add(finalName)
      savedCount += 1
      resultLines.push(`○ ${file.originalName} -> ${finalName}`)
    } catch (e) {
      resultLines.push(`× ${file.originalName} -> 保存失敗 (${String(e)})`)
    }
  }

  const done = new Alert()
  done.title = '完了'
  done.message = [
    `保存できた数: ${savedCount} / ${files.length}`,
    '',
    ...resultLines.slice(0, 15),
    resultLines.length > 15 ? `...ほか ${resultLines.length - 15} 件` : ''
  ].filter(Boolean).join('\n')
  done.addAction('OK')
  await done.presentAlert()
}

function lastPathComponent(path) {
  const parts = String(path).split('/')
  return parts[parts.length - 1] || path
}

function splitBaseAndExt(fileName) {
  const idx = fileName.lastIndexOf('.')
  if (idx <= 0) {
    return { base: fileName, ext: '' }
  }
  return {
    base: fileName.slice(0, idx),
    ext: fileName.slice(idx),
  }
}

function removeLastOccurrence(text, target) {
  if (!target) return text
  const idx = text.lastIndexOf(target)
  if (idx === -1) return text
  return text.slice(0, idx) + text.slice(idx + target.length)
}

function cleanupBaseName(base) {
  let s = String(base)
  s = s.replace(/^\s+|\s+$/g, '')
  s = s.replace(/^[._\- ]+|[._\- ]+$/g, '')
  return s
}

function makeRenamedBase(base, deleteText, index) {
  let renamed = removeLastOccurrence(base, deleteText)
  renamed = cleanupBaseName(renamed)
  if (!renamed) {
    renamed = `renamed_${String(index + 1).padStart(3, '0')}`
  }
  return renamed
}

function makeUniqueFileName(fm, folderPath, proposedName, usedNames) {
  const parts = splitBaseAndExt(proposedName)
  let candidate = proposedName
  let count = 2

  while (usedNames.has(candidate) || fm.fileExists(fm.joinPath(folderPath, candidate))) {
    candidate = `${parts.base} (${count})${parts.ext}`
    count += 1
  }
  return candidate
}

function readAnyData(path) {
  for (const fm of [fmICloud, fmLocal]) {
    try {
      safeDownloadIfNeeded(fm, path)
      const data = fm.read(path)
      if (data) return data
    } catch (e) {
      // 次の FileManager を試す
    }
  }
  return null
}

function safeDownloadIfNeeded(fm, path) {
  try {
    if (typeof fm.isFileStoredIniCloud === 'function' && fm.isFileStoredIniCloud(path)) {
      if (typeof fm.isFileDownloaded === 'function' && !fm.isFileDownloaded(path)) {
        fm.downloadFileFromiCloud(path)
      }
    }
  } catch (e) {
    // ローカルファイル等は何もしない
  }
}

function detectWritableManager(folderPath) {
  const probeName = `.__rename_probe_${Date.now()}.tmp`
  const probeText = 'ok'

  for (const fm of [fmLocal, fmICloud]) {
    const probePath = fm.joinPath(folderPath, probeName)
    try {
      fm.writeString(probePath, probeText)
      fm.remove(probePath)
      return fm
    } catch (e) {
      // 次を試す
    }
  }

  throw new Error('保存先フォルダに書き込めませんでした。')
}

function buildPreview(files, deleteText) {
  const lines = []
  const max = Math.min(files.length, 8)
  for (let i = 0; i < max; i++) {
    const f = files[i]
    const newName = makeRenamedBase(f.base, deleteText, i) + f.ext
    lines.push(`${f.originalName}`)
    lines.push(`→ ${newName}`)
    lines.push('')
  }
  if (files.length > max) {
    lines.push(`...ほか ${files.length - max} 件`)
  }
  return lines.join('\n')
}

async function chooseDeleteText(candidates, files) {
  while (true) {
    const picker = new Alert()
    picker.title = '削除したい部分を選んでください'
    const sampleNames = files.slice(0, 6).map(x => `・${x.originalName}`).join('\n')
    picker.message = [
      '候補を選ぶか、手入力してください。',
      '',
      '選択したファイル名の例:',
      sampleNames,
      files.length > 6 ? `...ほか ${files.length - 6} 件` : ''
    ].filter(Boolean).join('\n')

    const shown = candidates.slice(0, 6)
    for (const candidate of shown) {
      picker.addAction(`候補: 「${shortText(candidate, 28)}」`)
    }
    picker.addAction('手入力する')
    picker.addCancelAction('キャンセル')

    const res = await picker.presentSheet()
    if (res === -1) return null

    if (res < shown.length) {
      return shown[res]
    }

    const manual = await askManualDeleteText(candidates[0] || '')
    if (manual == null) return null
    if (manual.length === 0) {
      await showMessage('空欄です', '削除したい文字列を入力してください。')
      continue
    }
    return manual
  }
}

async function askManualDeleteText(defaultText) {
  const a = new Alert()
  a.title = '削除したい文字列を入力'
  a.message = 'ファイル名から削除したい部分を、そのまま入力してください。'
  a.addTextField('例: 共通部分', defaultText)
  a.addAction('OK')
  a.addCancelAction('キャンセル')
  const res = await a.presentAlert()
  if (res === -1) return null
  return (a.textFieldValue(0) || '').trim()
}

async function showMessage(title, message) {
  const a = new Alert()
  a.title = title
  a.message = message
  a.addAction('OK')
  await a.presentAlert()
}

function buildDeleteCandidates(bases) {
  const set = new Set()
  const add = (s) => {
    if (!s) return
    const t = String(s)
    if (!t.trim()) return
    set.add(t)
  }

  const suffix = longestCommonSuffix(bases)
  if (suffix) {
    add(suffix)
    add(suffix.trim())
    add(suffix.replace(/^[._\- ]+/, ''))
    add(suffix.replace(/[._\- ]+$/, ''))
    add(suffix.replace(/^[._\- ]+|[._\- ]+$/g, ''))
  }

  const lcs = longestCommonSubstring(bases)
  if (lcs && lcs.length >= 2) {
    add(lcs)
    add(lcs.trim())
  }

  return Array.from(set)
    .filter(x => x.length >= 1)
    .sort((a, b) => scoreCandidate(b, bases) - scoreCandidate(a, bases) || b.length - a.length)
}

function scoreCandidate(candidate, bases) {
  let score = candidate.length
  let suffixHits = 0
  for (const base of bases) {
    if (base.endsWith(candidate)) suffixHits += 1
  }
  score += suffixHits * 100
  if (/^[._\- ]/.test(candidate)) score += 10
  return score
}

function longestCommonSuffix(strings) {
  if (!strings || strings.length === 0) return ''
  let rev = strings.map(s => Array.from(String(s)).reverse().join(''))
  let prefix = longestCommonPrefix(rev)
  return Array.from(prefix).reverse().join('')
}

function longestCommonPrefix(strings) {
  if (!strings || strings.length === 0) return ''
  let prefix = String(strings[0])
  for (let i = 1; i < strings.length; i++) {
    const s = String(strings[i])
    while (!s.startsWith(prefix) && prefix.length > 0) {
      prefix = prefix.slice(0, -1)
    }
    if (!prefix) break
  }
  return prefix
}

function longestCommonSubstring(strings) {
  if (!strings || strings.length === 0) return ''
  if (strings.length === 1) return strings[0]

  const sorted = [...strings].map(s => String(s)).sort((a, b) => a.length - b.length)
  const shortest = sorted[0]
  const others = sorted.slice(1)

  for (let len = shortest.length; len >= 2; len--) {
    const seen = new Set()
    for (let start = 0; start <= shortest.length - len; start++) {
      const sub = shortest.slice(start, start + len)
      if (seen.has(sub)) continue
      seen.add(sub)
      if (others.every(s => s.includes(sub))) {
        return sub
      }
    }
  }
  return ''
}

function shortText(text, maxLen) {
  const s = String(text)
  if (s.length <= maxLen) return s
  return s.slice(0, maxLen - 1) + '…'
}
