// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
// Scriptable
// 顔保護つきコンポーネント再構築ドット変換
// v3 複数選択・同一保存先フォルダ版
// 目的:
// - 目のハイライトと口元を v2 より優先して残す
// - 後段で再ドット化しなくてよい 1x 画像を作る
// - 必要なら標準キャンバス(160x240 / 192x288 / 256x384)に直接出す
//
// 使い方:
// 1. 実行
// 2. 出力モードとサイズを選ぶ
// 3. 保存先フォルダを1回だけ選ぶ
// 4. 画像を複数選択できる
// 5. 選んだフォルダへまとめて 1x PNG を保存
//
// メモ:
// - 顔保護は「very strong」を推奨
// - 目・口セルだけ優先判定を強めています
// - この段階でかなり完成に寄せる想定です
// - JSファイルではなく txt で保存してください
// - 8倍プレビュー保存機能は削除済みです
// - 変換後の名前変更入力は削除済みです
// - 複数選択した画像を順番に変換します
// - 保存先は最初に1回だけ選びます

const DEFAULTS = {
  outputMode: "canvas",      // "width" | "canvas"
  targetWidth: 256,
  canvasW: 256,
  canvasH: 384,
  sampleMode: "mean",        // "mean" | "median"
  faceProtect: "very strong",// "very strong" | "strong" | "normal"
  gamma: 0.94,
  lineStrength: 0.86,
  highlightStrength: 0.56,
}

async function main() {
  try {
    const mode = await chooseOutputMode()
    if (!mode) return

    const size = await chooseSize(mode)
    if (!size) return

    const sampleMode = await choose(
      "代表色の決め方",
      "mean は安定、median はにじみを抑えやすいです。",
      ["mean", "median"],
      DEFAULTS.sampleMode
    )
    if (!sampleMode) return

    const faceProtect = await choose(
      "顔保護",
      "very strong は目のハイライトと口元を最優先で残します。",
      ["very strong", "strong", "normal"],
      DEFAULTS.faceProtect
    )
    if (!faceProtect) return

    const saveFolder = await chooseSaveFolder()
    if (!saveFolder) return

    const picked = await DocumentPicker.open(["public.image"])
    if (!picked || !picked.length) return

    const web = new WebView()
    await web.loadHTML(buildHtml())

    const saved = []
    const failed = []
    let lastImage = null
    let lastInfo = null

    for (const sourcePath of picked) {
      try {
        const sourceImage = await readPickedImage(sourcePath)
        if (!sourceImage) {
          throw new Error("画像を読み込めませんでした。PNG / JPEG / HEIC を試してください。")
        }

        const settings = {
          ...DEFAULTS,
          outputMode: mode,
          sampleMode,
          faceProtect,
          baseName: makeSafeBaseName(getBaseName(sourcePath) + "_facekeep_pixel_v3"),
          ...size,
        }

        const result = await runConversionInWebView(web, sourceImage, settings)

        const finalImage = Image.fromData(Data.fromBase64String(result.finalB64))
        if (!finalImage) throw new Error("本体画像の生成に失敗しました。")

        const outName = settings.baseName + ".png"
        const outPath = saveImageToFolder(finalImage, saveFolder.path, outName)

        lastImage = finalImage
        lastInfo = result.info || {}
        saved.push({
          sourceName: getBaseName(sourcePath),
          exportedMain: outPath,
        })
      } catch (err) {
        failed.push({
          sourceName: getBaseName(sourcePath),
          error: String(err && err.message ? err.message : err),
        })
      }
    }

    const lines = []
    lines.push(`保存完了: ${saved.length}件`)
    if (failed.length) lines.push(`失敗: ${failed.length}件`)
    lines.push(`・代表色: ${sampleMode}`)
    lines.push(`・顔保護: ${faceProtect}`)

    if (lastInfo) {
      lines.push(`・最後の出力サイズ: ${lastInfo.outW} x ${lastInfo.outH}`)
      lines.push(`・最後の元画像: ${lastInfo.srcW} x ${lastInfo.srcH}`)
    }

    if (saved.length) {
      lines.push("")
      lines.push("保存先フォルダ")
      lines.push("・" + saveFolder.label)
      lines.push("")
      lines.push("保存できた画像")
      for (const item of saved.slice(0, 8)) {
        lines.push("・" + item.sourceName)
      }
      if (saved.length > 8) {
        lines.push(`・ほか ${saved.length - 8} 件`)
      }
    }

    if (failed.length) {
      lines.push("")
      lines.push("失敗した画像")
      for (const item of failed.slice(0, 5)) {
        lines.push("・" + item.sourceName + " : " + item.error)
      }
      if (failed.length > 5) {
        lines.push(`・ほか ${failed.length - 5} 件`)
      }
    }

    const done = new Alert()
    done.title = "変換完了"
    done.message = lines.join("\n")
    if (lastImage) done.addAction("最後の本体を見る")
    done.addCancelAction("閉じる")
    const pick2 = await done.presentAlert()

    if (lastImage && pick2 === 0) {
      QuickLook.present(lastImage, true)
    }
  } catch (e) {
    const alert = new Alert()
    alert.title = "エラー"
    alert.message = String(e && e.message ? e.message : e)
    alert.addAction("OK")
    await alert.presentAlert()
  }
}

async function runConversionInWebView(web, sourceImage, settings) {
  const inputB64 = Data.fromPNG(sourceImage).toBase64String()

  const js = `
    try {
      run(${JSON.stringify(inputB64)}, ${JSON.stringify(settings)})
        .then(function(result) {
          completion(JSON.stringify(result));
        })
        .catch(function(err) {
          completion(JSON.stringify({
            error: String(err && err.stack ? err.stack : err)
          }));
        });
    } catch (err) {
      completion(JSON.stringify({
        error: String(err && err.stack ? err.stack : err)
      }));
    }
    1;
  `

  const resultText = await web.evaluateJavaScript(js, true)
  if (!resultText) throw new Error("変換結果を受け取れませんでした。")
  const result = JSON.parse(resultText)

  if (!result || result.error) {
    throw new Error(result && result.error ? result.error : "変換に失敗しました。")
  }
  return result
}

async function chooseOutputMode() {
  const a = new Alert()
  a.title = "出力モード"
  a.message = "横幅だけ決めるか、標準キャンバスに直接出すかを選んでください。"
  a.addAction("横幅基準")
  a.addAction("キャンバス基準")
  a.addCancelAction("キャンセル")
  const idx = await a.presentAlert()
  if (idx === -1) return null
  return idx === 0 ? "width" : "canvas"
}

async function chooseSize(mode) {
  if (mode === "width") {
    const v = await choose(
      "出力横幅",
      "顔を残したいなら 192 以上、できれば 224 以上を推奨します。",
      ["128", "160", "192", "224", "256", "288"],
      String(DEFAULTS.targetWidth)
    )
    if (!v) return null
    return { targetWidth: Number(v) }
  }

  const v = await choose(
    "標準キャンバス",
    "Pixquare にそのまま入れやすいサイズです。顔を崩したくないなら 224x336 以上がおすすめです。",
    ["160x240", "192x288", "224x336", "256x384", "288x432"],
    `${DEFAULTS.canvasW}x${DEFAULTS.canvasH}`
  )
  if (!v) return null
  const parts = v.split("x").map(n => Number(n))
  return { canvasW: parts[0], canvasH: parts[1] }
}

async function choose(title, message, items, current) {
  const a = new Alert()
  a.title = title
  a.message = message
  for (const item of items) {
    a.addAction(item === current ? item + " ✓" : item)
  }
  a.addCancelAction("キャンセル")
  const idx = await a.presentAlert()
  if (idx === -1) return null
  return items[idx]
}


async function chooseSaveFolder() {
  const fm = FileManager.iCloud()
  const root = fm.documentsDirectory()
  let current = root

  while (true) {
    let names = []
    try {
      names = fm.listContents(current)
        .filter(name => !String(name).startsWith("."))
        .filter(name => {
          try {
            return fm.isDirectory(fm.joinPath(current, name))
          } catch (e) {
            return false
          }
        })
        .sort((a, b) => a.localeCompare(b, 'ja'))
    } catch (e) {
      names = []
    }

    const a = new Alert()
    a.title = "保存先フォルダ"
    a.message = [
      "まとめて保存する先を選んでください。",
      folderLabel(root, current),
      ""
    ].join("\n")

    const actions = []
    actions.push({ type: 'here', title: 'このフォルダに保存' })
    if (current !== root) actions.push({ type: 'up', title: '1つ上へ' })
    actions.push({ type: 'new', title: 'この中に新規フォルダを作る' })
    for (const name of names) {
      actions.push({ type: 'dir', title: '開く: ' + name, name })
    }
    for (const item of actions) a.addAction(item.title)
    a.addCancelAction('キャンセル')

    const idx = await a.presentAlert()
    if (idx === -1) return null
    const picked = actions[idx]
    if (!picked) return null

    if (picked.type === 'here') {
      return { path: current, label: folderLabel(root, current) }
    }
    if (picked.type === 'up') {
      current = parentDir(current) || root
      continue
    }
    if (picked.type === 'new') {
      const made = await createSubfolder(current)
      if (made) current = made
      continue
    }
    if (picked.type === 'dir') {
      current = fm.joinPath(current, picked.name)
      continue
    }
  }
}

async function createSubfolder(parent) {
  const fm = FileManager.iCloud()
  const prompt = new Alert()
  prompt.title = '新規フォルダ名'
  prompt.message = '保存先にする新しいフォルダ名を入力してください。'
  prompt.addTextField('pixel_out')
  prompt.addAction('作成')
  prompt.addCancelAction('キャンセル')
  const idx = await prompt.presentAlert()
  if (idx === -1) return null

  const raw = prompt.textFieldValue(0) || ''
  const safe = makeSafeBaseName(raw) || 'pixel_out'
  const path = fm.joinPath(parent, safe)
  if (!fm.fileExists(path)) {
    fm.createDirectory(path, true)
  }
  return path
}

function folderLabel(root, path) {
  const base = 'iCloud Drive / Scriptable'
  if (path === root) return base
  const rel = String(path).startsWith(root) ? String(path).slice(root.length) : String(path)
  return base + rel.replace(/^\/+/, '/').replace(/\//g, ' / ')
}

function parentDir(path) {
  const parts = String(path).split('/').filter(Boolean)
  if (parts.length <= 1) return path
  return '/' + parts.slice(0, -1).join('/')
}

function saveImageToFolder(image, folderPath, fileName) {
  const fm = FileManager.iCloud()
  if (!fm.fileExists(folderPath)) {
    fm.createDirectory(folderPath, true)
  }
  const outPath = fm.joinPath(folderPath, fileName)
  fm.writeImage(outPath, image)
  return outPath
}


async function readPickedImage(filePath) {
  let img = Image.fromFile(filePath)
  if (img) return img

  try {
    const fmi = FileManager.iCloud()
    if (fmi.fileExists(filePath)) {
      await fmi.downloadFileFromiCloud(filePath)
      img = fmi.readImage(filePath)
      if (img) return img
    }
  } catch (e) {}

  try {
    const fml = FileManager.local()
    if (fml.fileExists(filePath)) {
      img = fml.readImage(filePath)
      if (img) return img
    }
  } catch (e) {}

  return null
}

function getBaseName(path) {
  try {
    return FileManager.local().fileName(path, false)
  } catch (e) {
    return "pixel_source"
  }
}

function makeSafeBaseName(name) {
  return String(name || "")
    .replace(/\.[^.]+$/, "")
    .replace(/[\\\/:\*\?"<>\|]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function buildHtml() {
  return `
<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
html, body { margin:0; padding:0; background:#111; color:#fff; }
canvas { display:none; }
</style>
</head>
<body>
<script>
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }
function getIdx(x, y, w) { return (y * w + x) * 4 }
function createCanvas(w, h) {
  const c = document.createElement("canvas")
  c.width = w
  c.height = h
  return c
}
function imageDataToCanvas(imgData, w, h) {
  const c = createCanvas(w, h)
  const ctx = c.getContext("2d", { willReadFrequently: true })
  ctx.putImageData(new ImageData(imgData, w, h), 0, 0)
  return c
}
function canvasToImageData(canvas) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  const d = ctx.getImageData(0, 0, canvas.width, canvas.height)
  return { data: new Uint8ClampedArray(d.data), w: canvas.width, h: canvas.height }
}
function loadImage(src) {
  return new Promise(function(resolve, reject) {
    const img = new Image()
    img.onload = function() { resolve(img) }
    img.onerror = function() { reject(new Error("画像読み込み失敗")) }
    img.src = src
  })
}
function upscalePreview(img, scale) {
  const srcCanvas = imageDataToCanvas(img.data, img.w, img.h)
  const out = createCanvas(img.w * scale, img.h * scale)
  const ctx = out.getContext("2d")
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(srcCanvas, 0, 0, out.width, out.height)
  return out
}
function toGammaSpace(v, gamma) {
  return Math.pow(clamp(v / 255, 0, 1), gamma)
}
function fromGammaSpace(v, gamma) {
  return Math.round(clamp(Math.pow(clamp(v, 0, 1), 1 / gamma), 0, 1) * 255)
}
function brightnessFromRgb(r, g, b, gamma) {
  const rr = toGammaSpace(r, gamma)
  const gg = toGammaSpace(g, gamma)
  const bb = toGammaSpace(b, gamma)
  return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb
}
function median(arr) {
  if (!arr.length) return 0
  const copy = arr.slice().sort(function(a, b) { return a - b })
  return copy[Math.floor(copy.length / 2)]
}
function mixColor(base, ink, t) {
  t = clamp(t, 0, 1)
  return {
    r: Math.round(base.r * (1 - t) + ink.r * t),
    g: Math.round(base.g * (1 - t) + ink.g * t),
    b: Math.round(base.b * (1 - t) + ink.b * t),
  }
}
function multiplyOne(base, ink) {
  return Math.round((base * ink) / 255)
}
function screenOne(base, ink) {
  return 255 - Math.round(((255 - base) * (255 - ink)) / 255)
}
function isSkinLike(r, g, b, a) {
  if (a < 16) return false
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max - min < 10) return false
  if (!(r >= g && g >= b)) return false
  if (r < 70 || g < 35 || b < 20) return false
  if (r - b < 16) return false
  return true
}
function boxContains(box, x, y, pad) {
  pad = pad || 0
  return x >= box.x1 - pad && x <= box.x2 + pad && y >= box.y1 - pad && y <= box.y2 + pad
}
function boxesIntersect(x0, y0, x1, y1, box, pad) {
  pad = pad || 0
  return !(x1 < box.x1 - pad || x0 > box.x2 + pad || y1 < box.y1 - pad || y0 > box.y2 + pad)
}
function expandBox(box, pad, w, h) {
  return {
    x1: clamp(box.x1 - pad, 0, w - 1),
    y1: clamp(box.y1 - pad, 0, h - 1),
    x2: clamp(box.x2 + pad, 0, w - 1),
    y2: clamp(box.y2 + pad, 0, h - 1),
  }
}
function detectFaceBox(img, faceProtect) {
  const { data, w, h } = img
  const xMin = Math.floor(w * 0.12)
  const xMax = Math.ceil(w * 0.88)
  const yMin = 0
  const yMax = Math.ceil(h * 0.56)

  let x1 = w, y1 = h, x2 = -1, y2 = -1, count = 0
  for (let y = yMin; y < yMax; y++) {
    for (let x = xMin; x < xMax; x++) {
      const i = getIdx(x, y, w)
      if (isSkinLike(data[i], data[i+1], data[i+2], data[i+3])) {
        count++
        if (x < x1) x1 = x
        if (y < y1) y1 = y
        if (x > x2) x2 = x
        if (y > y2) y2 = y
      }
    }
  }

  let box
  if (count >= Math.max(18, Math.floor(w * h * 0.002))) {
    box = { x1, y1, x2, y2 }
  } else {
    box = {
      x1: Math.floor(w * 0.26),
      y1: Math.floor(h * 0.06),
      x2: Math.ceil(w * 0.74),
      y2: Math.ceil(h * 0.36),
    }
  }

  const pad = faceProtect === "very strong" ? Math.max(4, Math.round(Math.min(w, h) * 0.01))
            : faceProtect === "strong" ? 3 : 2
  return expandBox(box, pad, w, h)
}

function faceZoneForCell(x0, y0, x1, y1, faceBox) {
  const cx = (x0 + x1 - 1) * 0.5
  const cy = (y0 + y1 - 1) * 0.5
  if (!boxContains(faceBox, cx, cy, 0)) return "none"

  const fw = Math.max(1, faceBox.x2 - faceBox.x1 + 1)
  const fh = Math.max(1, faceBox.y2 - faceBox.y1 + 1)
  const nx = (cx - faceBox.x1) / fw
  const ny = (cy - faceBox.y1) / fh

  const inCoreX = nx >= 0.18 && nx <= 0.82
  if (inCoreX && ny >= 0.18 && ny <= 0.54) return "eyes"
  if (inCoreX && ny >= 0.58 && ny <= 0.88) return "mouth"
  return "face"
}
function buildLaplacian(img, gamma) {
  const { data, w, h } = img
  const lum = new Float32Array(w * h)
  const alpha = new Float32Array(w * h)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = getIdx(x, y, w)
      const a = data[i + 3] / 255
      const p = y * w + x
      alpha[p] = a
      if (a < 0.02) {
        lum[p] = 0
        continue
      }
      lum[p] = brightnessFromRgb(data[i], data[i + 1], data[i + 2], gamma)
    }
  }

  const edge = new Float32Array(w * h)
  let sum = 0
  let count = 0
  let maxV = 0

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x
      if (alpha[p] < 0.02) continue

      const c = lum[p]
      const left = lum[p - 1]
      const right = lum[p + 1]
      const up = lum[p - w]
      const down = lum[p + w]
      const diag1 = lum[p - w - 1]
      const diag2 = lum[p - w + 1]
      const diag3 = lum[p + w - 1]
      const diag4 = lum[p + w + 1]

      const v = Math.abs(8 * c - left - right - up - down - diag1 - diag2 - diag3 - diag4)
      edge[p] = v
      sum += v
      count++
      if (v > maxV) maxV = v
    }
  }

  const mean = count ? (sum / count) : 0
  return {
    lum: lum,
    alpha: alpha,
    edge: edge,
    meanEdge: mean,
    maxEdge: maxV,
    w: w,
    h: h,
  }
}
function thresholds(faceProtect) {
  if (faceProtect === "normal") {
    return {
      contrast: 0.22,
      edgeDensity: 0.10,
      edgePeak: 0.56,
      lineDensity: 0.06,
      priorityBias: 0.08,
      brightGap: 0.22,
      brightLum: 0.78,
    }
  }
  if (faceProtect === "strong") {
    return {
      contrast: 0.18,
      edgeDensity: 0.08,
      edgePeak: 0.48,
      lineDensity: 0.05,
      priorityBias: 0.06,
      brightGap: 0.18,
      brightLum: 0.74,
    }
  }
  return {
    contrast: 0.14,
    edgeDensity: 0.06,
    edgePeak: 0.42,
    lineDensity: 0.04,
    priorityBias: 0.04,
    brightGap: 0.14,
    brightLum: 0.70,
  }
}
function collectCell(img, lap, x0, y0, x1, y1, cfg, faceBox) {
  const { data, w } = img
  const gamma = cfg.gamma
  const t = thresholds(cfg.faceProtect)
  const zone = faceZoneForCell(x0, y0, x1, y1, faceBox)
  const insideFace = zone !== "none"
  const insideEye = zone === "eyes"
  const insideMouth = zone === "mouth"
  const insideFeature = insideEye || insideMouth

  let alphaSum = 0
  let opaqueCount = 0
  let linR = 0
  let linG = 0
  let linB = 0
  let minLum = Infinity
  let maxLum = -Infinity
  let baseLumApprox = 0
  let edgeMax = 0
  let edgeCount = 0

  const rList = []
  const gList = []
  const bList = []
  const aList = []

  let darkest = null
  let darkestEdge = null
  let brightest = null
  let brightestEdge = null
  let whiteishCount = 0
  let darkishCount = 0
  let veryDarkCount = 0
  let nearWhiteCount = 0

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = getIdx(x, y, w)
      const a = data[i + 3]
      if (a < 8) continue

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const p = y * w + x
      const lum = lap.lum[p]
      const e = lap.edge[p]

      opaqueCount++
      alphaSum += a / 255

      const rr = toGammaSpace(r, gamma)
      const gg = toGammaSpace(g, gamma)
      const bb = toGammaSpace(b, gamma)
      linR += rr
      linG += gg
      linB += bb
      rList.push(rr)
      gList.push(gg)
      bList.push(bb)
      aList.push(a / 255)

      if (lum < minLum) minLum = lum
      if (lum > maxLum) maxLum = lum
      baseLumApprox += lum
      if (e > edgeMax) edgeMax = e
      if (e > lap.meanEdge * (insideFeature ? 1.02 : 1.15)) edgeCount++

      if (!darkest || lum < darkest.lum) darkest = { r, g, b, lum }
      if (!brightest || lum > brightest.lum) brightest = { r, g, b, lum }

      if (e > lap.meanEdge * (insideFeature ? 1.00 : 1.12)) {
        if (!darkestEdge || lum < darkestEdge.lum) darkestEdge = { r, g, b, lum, edge: e }
        if (!brightestEdge || lum > brightestEdge.lum) brightestEdge = { r, g, b, lum, edge: e }
      }

      const mx = Math.max(r, g, b)
      const mn = Math.min(r, g, b)
      if (mx > 190 && (mx - mn) < 75) whiteishCount++
      if (mx > 220 && mn > 180) nearWhiteCount++
      if (lum < 0.28) darkishCount++
      if (lum < 0.18) veryDarkCount++
    }
  }

  if (!opaqueCount) {
    return {
      empty: true,
      baseColor: { r: 0, g: 0, b: 0, a: 0 },
      lineColor: { r: 255, g: 255, b: 255, a: 0 },
      highlightColor: { r: 255, g: 255, b: 255, a: 0 },
    }
  }

  let baseColor
  if (cfg.sampleMode === "median") {
    baseColor = {
      r: fromGammaSpace(median(rList), gamma),
      g: fromGammaSpace(median(gList), gamma),
      b: fromGammaSpace(median(bList), gamma),
      a: Math.round(clamp(median(aList), 0, 1) * 255),
    }
  } else {
    baseColor = {
      r: fromGammaSpace(linR / opaqueCount, gamma),
      g: fromGammaSpace(linG / opaqueCount, gamma),
      b: fromGammaSpace(linB / opaqueCount, gamma),
      a: Math.round(clamp(alphaSum / opaqueCount, 0, 1) * 255),
    }
  }

  const contrast = maxLum - minLum
  const edgeDensity = edgeCount / opaqueCount
  const edgeNorm = lap.maxEdge > 0 ? edgeMax / lap.maxEdge : 0
  const avgLum = baseLumApprox / opaqueCount
  const ink = darkestEdge || darkest || { r: 0, g: 0, b: 0, lum: 0 }
  const bright = brightestEdge || brightest || { r: 255, g: 255, b: 255, lum: 1 }
  const inkGap = avgLum - ink.lum
  const brightGap = bright.lum - avgLum

  const hasStrongBoundary =
    contrast >= (insideFeature ? t.contrast * 0.72 : t.contrast) ||
    edgeDensity >= (insideFeature ? t.edgeDensity * 0.60 : t.edgeDensity) ||
    edgeNorm >= (insideFeature ? t.edgePeak * 0.74 : t.edgePeak)

  let prioritizedColor = baseColor
  const priorityBias = insideFeature ? Math.max(0.02, t.priorityBias * 0.45) : t.priorityBias
  if (hasStrongBoundary && inkGap > priorityBias) {
    let priorityMix = clamp(
      ((contrast - t.contrast) * 2.2) +
      (edgeDensity * 2.0) +
      ((edgeNorm - t.edgePeak) * 1.7) +
      (inkGap * 2.0),
      0,
      1
    )
    if (insideFeature) {
      priorityMix = clamp(priorityMix * 1.35 + (veryDarkCount / opaqueCount) * 1.15, 0.12, insideEye ? 0.56 : 0.62)
    }
    prioritizedColor = {
      ...mixColor(baseColor, ink, priorityMix),
      a: baseColor.a,
    }
  }

  const whiteishRatio = whiteishCount / opaqueCount
  const nearWhiteRatio = nearWhiteCount / opaqueCount
  const darkishRatio = darkishCount / opaqueCount
  const veryDarkRatio = veryDarkCount / opaqueCount
  const brightNearWhite = Math.max(bright.r, bright.g, bright.b) >= 208 && (Math.max(bright.r, bright.g, bright.b) - Math.min(bright.r, bright.g, bright.b)) <= 96

  const canProtectHighlight =
    insideEye &&
    brightNearWhite &&
    whiteishRatio >= 0.05 &&
    whiteishRatio <= 0.45 &&
    darkishRatio >= 0.04 &&
    bright.lum >= t.brightLum &&
    brightGap >= t.brightGap * 0.7 &&
    contrast >= t.contrast * 0.78 &&
    (edgeDensity >= t.lineDensity * 0.55 || edgeNorm >= t.edgePeak * 0.68 || !!darkestEdge)

  let lineAlpha = 255
  let highlightAlpha = 0
  let finalBase = prioritizedColor

  if (insideEye) {
    lineAlpha = cfg.faceProtect === "very strong" ? 236 : 246

    if (hasStrongBoundary && inkGap > 0.025) {
      const darkMix = clamp((inkGap * 1.7) + (edgeDensity * 1.25) + (edgeNorm * 0.55) + (veryDarkRatio * 1.0), 0.10, cfg.faceProtect === "very strong" ? 0.42 : 0.34)
      finalBase = {
        ...mixColor(baseColor, ink, darkMix),
        a: baseColor.a,
      }
    }

    if (canProtectHighlight) {
      const softLift = clamp((brightGap * 0.55) + (whiteishRatio * 0.42) + (nearWhiteRatio * 0.65), 0.04, cfg.faceProtect === "very strong" ? 0.16 : 0.13)
      finalBase = {
        ...mixColor(finalBase, bright, softLift),
        a: baseColor.a,
      }
      highlightAlpha = Math.round(clamp((brightGap * 1.45) + (whiteishRatio * 1.05) + (nearWhiteRatio * 1.4), 0.18, cfg.faceProtect === "very strong" ? 0.90 : 0.78) * 255)
    }
  } else if (insideMouth) {
    lineAlpha = cfg.faceProtect === "very strong" ? 244 : 250
    if (hasStrongBoundary && inkGap > 0.018) {
      const mouthMix = clamp((inkGap * 1.95) + (edgeDensity * 1.4) + (edgeNorm * 0.65), 0.16, cfg.faceProtect === "very strong" ? 0.56 : 0.46)
      finalBase = {
        ...mixColor(baseColor, ink, mouthMix),
        a: baseColor.a,
      }
    }
  } else if (insideFace) {
    lineAlpha = cfg.faceProtect === "very strong" ? 222 : 236
  }

  const shouldDrawLine =
    !!darkestEdge &&
    (
      insideFeature
        ? (
            edgeDensity >= t.lineDensity * 0.52 ||
            edgeNorm >= t.edgePeak * 0.66 ||
            contrast >= t.contrast * 0.72 ||
            inkGap >= 0.05
          )
        : (
            edgeDensity >= t.lineDensity ||
            edgeNorm >= t.edgePeak ||
            contrast >= t.contrast + 0.05
          )
    )

  const highlightColor = canProtectHighlight
    ? {
        r: Math.max(240, bright.r),
        g: Math.max(240, bright.g),
        b: Math.max(240, bright.b),
        a: highlightAlpha,
      }
    : { r: 255, g: 255, b: 255, a: 0 }

  return {
    empty: false,
    baseColor: finalBase,
    lineColor: shouldDrawLine
      ? { r: ink.r, g: ink.g, b: ink.b, a: lineAlpha }
      : { r: 255, g: 255, b: 255, a: 0 },
    highlightColor: highlightColor,
  }
}
function buildSeparatedLayers(img, outW, outH, cfg, faceBox) {
  const cellW = img.w / outW
  const cellH = img.h / outH

  const lap = buildLaplacian(img, cfg.gamma)
  const flat = new Uint8ClampedArray(outW * outH * 4)
  const line = new Uint8ClampedArray(outW * outH * 4)
  const highlight = new Uint8ClampedArray(outW * outH * 4)

  for (let gy = 0; gy < outH; gy++) {
    const y0 = Math.floor(gy * cellH)
    const y1 = Math.max(y0 + 1, Math.min(img.h, Math.ceil((gy + 1) * cellH)))

    for (let gx = 0; gx < outW; gx++) {
      const x0 = Math.floor(gx * cellW)
      const x1 = Math.max(x0 + 1, Math.min(img.w, Math.ceil((gx + 1) * cellW)))
      const cell = collectCell(img, lap, x0, y0, x1, y1, cfg, faceBox)
      const di = getIdx(gx, gy, outW)

      flat[di] = cell.baseColor.r
      flat[di + 1] = cell.baseColor.g
      flat[di + 2] = cell.baseColor.b
      flat[di + 3] = cell.baseColor.a

      line[di] = cell.lineColor.r
      line[di + 1] = cell.lineColor.g
      line[di + 2] = cell.lineColor.b
      line[di + 3] = cell.lineColor.a

      highlight[di] = cell.highlightColor.r
      highlight[di + 1] = cell.highlightColor.g
      highlight[di + 2] = cell.highlightColor.b
      highlight[di + 3] = cell.highlightColor.a
    }
  }

  return {
    flat: { data: flat, w: outW, h: outH },
    line: { data: line, w: outW, h: outH },
    highlight: { data: highlight, w: outW, h: outH },
  }
}
function composeLayers(flat, line, highlight, lineStrength, highlightStrength) {
  const out = new Uint8ClampedArray(flat.length)
  for (let i = 0; i < flat.length; i += 4) {
    const a = flat[i + 3]
    if (a < 8) {
      out[i + 3] = 0
      continue
    }

    const la = (line[i + 3] / 255) * lineStrength
    let r = flat[i]
    let g = flat[i + 1]
    let b = flat[i + 2]

    if (la > 0) {
      const mr = multiplyOne(r, line[i] || 255)
      const mg = multiplyOne(g, line[i + 1] || 255)
      const mb = multiplyOne(b, line[i + 2] || 255)
      r = Math.round(r * (1 - la) + mr * la)
      g = Math.round(g * (1 - la) + mg * la)
      b = Math.round(b * (1 - la) + mb * la)
    }

    const ha = (highlight[i + 3] / 255) * highlightStrength
    if (ha > 0) {
      const sr = screenOne(r, highlight[i] || 255)
      const sg = screenOne(g, highlight[i + 1] || 255)
      const sb = screenOne(b, highlight[i + 2] || 255)
      r = Math.round(r * (1 - ha) + sr * ha)
      g = Math.round(g * (1 - ha) + sg * ha)
      b = Math.round(b * (1 - ha) + sb * ha)
    }

    out[i] = r
    out[i + 1] = g
    out[i + 2] = b
    out[i + 3] = a
  }
  return out
}
function placeOnCanvas(img, canvasW, canvasH) {
  const out = new Uint8ClampedArray(canvasW * canvasH * 4)
  const ox = Math.floor((canvasW - img.w) / 2)
  const oy = Math.floor((canvasH - img.h) / 2)

  for (let y = 0; y < img.h; y++) {
    for (let x = 0; x < img.w; x++) {
      const sx = x
      const sy = y
      const dx = x + ox
      const dy = y + oy
      if (dx < 0 || dy < 0 || dx >= canvasW || dy >= canvasH) continue
      const si = getIdx(sx, sy, img.w)
      const di = getIdx(dx, dy, canvasW)
      out[di] = img.data[si]
      out[di + 1] = img.data[si + 1]
      out[di + 2] = img.data[si + 2]
      out[di + 3] = img.data[si + 3]
    }
  }
  return { data: out, w: canvasW, h: canvasH }
}
function solveOutputSize(srcW, srcH, cfg) {
  if (cfg.outputMode === "canvas") {
    const canvasW = Math.max(1, cfg.canvasW || 192)
    const canvasH = Math.max(1, cfg.canvasH || 288)
    let outW = canvasW
    let outH = Math.round(srcH * (outW / srcW))
    if (outH > canvasH) {
      outH = canvasH
      outW = Math.round(srcW * (outH / srcH))
    }
    return {
      outW: Math.max(1, outW),
      outH: Math.max(1, outH),
      canvasW: canvasW,
      canvasH: canvasH,
    }
  }

  const outW = Math.max(1, cfg.targetWidth || 192)
  const outH = Math.max(1, Math.round(srcH * (outW / srcW)))
  return { outW, outH, canvasW: outW, canvasH: outH }
}

window.run = async function(inputB64, cfg) {
  const src = await loadImage("data:image/png;base64," + inputB64)

  const baseCanvas = createCanvas(src.width, src.height)
  const baseCtx = baseCanvas.getContext("2d", { willReadFrequently: true })
  baseCtx.imageSmoothingEnabled = false
  baseCtx.drawImage(src, 0, 0)

  const img = canvasToImageData(baseCanvas)
  const faceBox = detectFaceBox(img, cfg.faceProtect || "very strong")
  const solved = solveOutputSize(img.w, img.h, cfg)

  const layers = buildSeparatedLayers(img, solved.outW, solved.outH, cfg, faceBox)
  const composed = composeLayers(
    layers.flat.data,
    layers.line.data,
    layers.highlight.data,
    cfg.lineStrength || 0.78,
    cfg.highlightStrength || 0.72
  )

  let finalImg = { data: composed, w: solved.outW, h: solved.outH }
  if (cfg.outputMode === "canvas") {
    finalImg = placeOnCanvas(finalImg, solved.canvasW, solved.canvasH)
  }

  const finalCanvas = imageDataToCanvas(finalImg.data, finalImg.w, finalImg.h)

  return {
    finalB64: finalCanvas.toDataURL("image/png").split(",")[1],
    info: {
      srcW: img.w,
      srcH: img.h,
      outW: finalImg.w,
      outH: finalImg.h,
      innerW: solved.outW,
      innerH: solved.outH,
      sampleMode: cfg.sampleMode,
      faceProtect: cfg.faceProtect,
      gamma: cfg.gamma,
      lineStrength: cfg.lineStrength,
      highlightStrength: cfg.highlightStrength,
    }
  }
}
</script>
</body>
</html>
`
}

await main()
