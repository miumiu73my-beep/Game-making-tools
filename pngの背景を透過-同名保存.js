// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: camera;
// 背景透過_PNG専用_立ち絵UI安定版
// 機能:
// - PNGを複数選択して一括処理
// - 保存先フォルダを選択
// - 外周からつながる背景を透過
// - 大きくて均一な「閉じた穴」も自動で透過
// - 立ち絵の白服や白髪を誤って抜きにくいよう調整
// - 出力は元画像と同じ名前の透過PNG

const INPUT_TYPES = ["public.png"]

const SETTINGS = {
  // 外周背景の判定の強さ。抜けない時だけ少し上げる
  tolerance: 22,

  // 背景色推定用の量子化幅
  borderBucketStep: 8,

  // 穴として認める最小面積
  // 立ち絵の白服を誤検出しにくくするため、かなり大きめにしています
  holeMinArea: 1200,
  holeMinAreaRatio: 0.02,

  // 穴として認める最小の幅・高さ比
  holeMinWidthRatio: 0.18,
  holeMinHeightRatio: 0.18,

  // 穴領域の色ばらつき上限
  // UIの大きな空白は低く、服や髪のハイライトは高くなりやすいです
  holeMaxStd: 8,

  // 穴の詰まり具合。低すぎると細い筋も穴扱いしやすくなるので少しだけ制限
  holeMinFillRatio: 0.18,
}

function getFmForPath(path) {
  if (String(path).includes("/Mobile Documents/")) return FileManager.iCloud()
  return FileManager.local()
}

async function ensureDownloaded(path) {
  const fm = getFmForPath(path)
  try {
    if (fm.isFileStoredIniCloud(path)) {
      await fm.downloadFileFromiCloud(path)
    }
  } catch (e) {}
  return fm
}

function fileNameOf(path) {
  return String(path).replace(/\\/g, "/").split("/").pop()
}

function stripExt(name) {
  return name.replace(/\.[^.]+$/, "")
}

function parseHexColor(hex) {
  const s = String(hex).trim().replace(/^#/, "")
  if (!/^[0-9a-fA-F]{6}$/.test(s)) {
    throw new Error("カラーコードは #RRGGBB 形式で入力してください")
  }
  return {
    hex: "#" + s.toUpperCase(),
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16),
  }
}

async function askHexColor() {
  const a = new Alert()
  a.title = "透過用の指定色"
  a.message = "背景をいったんこの色にそろえてから透過します。\n例: #FF00FF"
  a.addTextField("#FF00FF", "#FF00FF")
  a.addAction("OK")
  const idx = await a.presentAlert()
  if (idx === -1) throw new Error("キャンセルしました")
  return parseHexColor(a.textFieldValue(0))
}

async function pickInputFiles() {
  const picked = await DocumentPicker.open(INPUT_TYPES)
  if (!picked || picked.length === 0) {
    throw new Error("PNGが選択されませんでした")
  }
  return picked
}

async function pickOutputFolder() {
  const folder = await DocumentPicker.openFolder()
  if (!folder) throw new Error("保存先フォルダが選択されませんでした")
  return folder
}

async function processOneImage(inputPath, outputFolder, targetColor) {
  const fmIn = await ensureDownloaded(inputPath)
  const inData = fmIn.read(inputPath)
  const base64 = inData.toBase64String()
  const name = fileNameOf(inputPath)

  const web = new WebView()
  await web.loadHTML("<html><body></body></html>")

  const js = `
  (() => {
    const SETTINGS = ${JSON.stringify(SETTINGS)};
    const TARGET = ${JSON.stringify(targetColor)};
    const PNG_BASE64 = ${JSON.stringify(base64)};

    function colorDistSq(r1, g1, b1, r2, g2, b2) {
      const dr = r1 - r2;
      const dg = g1 - g2;
      const db = b1 - b2;
      return dr * dr + dg * dg + db * db;
    }

    function bucketKey(r, g, b, step) {
      return [Math.round(r / step), Math.round(g / step), Math.round(b / step)].join('_');
    }

    function pushNeighbors4(p, w, h, out) {
      const x = p % w;
      const y = (p / w) | 0;
      if (x > 0) out.push(p - 1);
      if (x + 1 < w) out.push(p + 1);
      if (y > 0) out.push(p - w);
      if (y + 1 < h) out.push(p + w);
    }

    function run() {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          try {
            const w = img.width;
            const h = img.height;
            const total = w * h;

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0);

            const src = ctx.getImageData(0, 0, w, h);
            const data = src.data;

            // 1) 外周から背景色を推定
            const buckets = new Map();
            const step = SETTINGS.borderBucketStep;

            function sampleBorder(x, y) {
              const i = (y * w + x) * 4;
              const a = data[i + 3];
              if (a === 0) return;
              const r = data[i], g = data[i + 1], b = data[i + 2];
              const key = bucketKey(r, g, b, step);
              let v = buckets.get(key);
              if (!v) v = { count: 0, r: 0, g: 0, b: 0 };
              v.count++;
              v.r += r;
              v.g += g;
              v.b += b;
              buckets.set(key, v);
            }

            for (let x = 0; x < w; x++) {
              sampleBorder(x, 0);
              sampleBorder(x, h - 1);
            }
            for (let y = 1; y < h - 1; y++) {
              sampleBorder(0, y);
              sampleBorder(w - 1, y);
            }

            // すでに全部透過などで外周色が拾えない場合はそのまま出力
            if (buckets.size === 0) {
              const out0 = canvas.toDataURL('image/png').split(',')[1];
              resolve(JSON.stringify({ ok: true, pngBase64: out0, stats: { width: w, height: h, alreadyTransparent: true } }));
              return;
            }

            let best = null;
            for (const [, v] of buckets) {
              if (!best || v.count > best.count) best = v;
            }

            const bg = {
              r: Math.round(best.r / best.count),
              g: Math.round(best.g / best.count),
              b: Math.round(best.b / best.count),
            };
            const tolSq = SETTINGS.tolerance * SETTINGS.tolerance;

            // 2) 背景候補マスク
            // 透過済みピクセルは背景として扱う
            const candidate = new Uint8Array(total);
            for (let p = 0, i = 0; p < total; p++, i += 4) {
              const a = data[i + 3];
              if (a === 0) {
                candidate[p] = 1;
                continue;
              }
              if (colorDistSq(data[i], data[i + 1], data[i + 2], bg.r, bg.g, bg.b) <= tolSq) {
                candidate[p] = 1;
              }
            }

            // 3) 外周からつながる背景だけをまず取得
            const outer = new Uint8Array(total);
            const queue = new Int32Array(total);
            let head = 0;
            let tail = 0;

            function enqueueIfOuter(x, y) {
              const p = y * w + x;
              if (!candidate[p] || outer[p]) return;
              outer[p] = 1;
              queue[tail++] = p;
            }

            for (let x = 0; x < w; x++) {
              enqueueIfOuter(x, 0);
              enqueueIfOuter(x, h - 1);
            }
            for (let y = 1; y < h - 1; y++) {
              enqueueIfOuter(0, y);
              enqueueIfOuter(w - 1, y);
            }

            while (head < tail) {
              const p = queue[head++];
              const x = p % w;
              const y = (p / w) | 0;
              if (x > 0) {
                const np = p - 1;
                if (candidate[np] && !outer[np]) { outer[np] = 1; queue[tail++] = np; }
              }
              if (x + 1 < w) {
                const np = p + 1;
                if (candidate[np] && !outer[np]) { outer[np] = 1; queue[tail++] = np; }
              }
              if (y > 0) {
                const np = p - w;
                if (candidate[np] && !outer[np]) { outer[np] = 1; queue[tail++] = np; }
              }
              if (y + 1 < h) {
                const np = p + w;
                if (candidate[np] && !outer[np]) { outer[np] = 1; queue[tail++] = np; }
              }
            }

            // 4) 最終マスクに外周背景を入れる
            const finalMask = new Uint8Array(total);
            let maskedCount = 0;
            for (let p = 0; p < total; p++) {
              if (outer[p]) {
                finalMask[p] = 1;
                maskedCount++;
              }
            }

            // 5) 大きくて均一な閉じた穴だけ追加で透過
            const minHoleArea = Math.max(SETTINGS.holeMinArea, Math.floor(total * SETTINGS.holeMinAreaRatio));
            const visited = new Uint8Array(total);
            const stack = new Int32Array(total);
            const comp = [];
            let acceptedHoles = 0;

            for (let start = 0; start < total; start++) {
              if (!candidate[start] || outer[start] || visited[start]) continue;

              let sp = 0;
              stack[sp++] = start;
              visited[start] = 1;
              comp.length = 0;

              let area = 0;
              let sumR = 0, sumG = 0, sumB = 0;
              let sumR2 = 0, sumG2 = 0, sumB2 = 0;
              let minX = w, minY = h, maxX = 0, maxY = 0;
              let touchesEdge = false;

              while (sp > 0) {
                const p = stack[--sp];
                comp.push(p);
                area++;

                const x = p % w;
                const y = (p / w) | 0;
                if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touchesEdge = true;
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;

                const i = p * 4;
                const a = data[i + 3];
                const r = data[i], g = data[i + 1], b = data[i + 2];
                if (a !== 0) {
                  sumR += r; sumG += g; sumB += b;
                  sumR2 += r * r; sumG2 += g * g; sumB2 += b * b;
                }

                if (x > 0) {
                  const np = p - 1;
                  if (candidate[np] && !outer[np] && !visited[np]) { visited[np] = 1; stack[sp++] = np; }
                }
                if (x + 1 < w) {
                  const np = p + 1;
                  if (candidate[np] && !outer[np] && !visited[np]) { visited[np] = 1; stack[sp++] = np; }
                }
                if (y > 0) {
                  const np = p - w;
                  if (candidate[np] && !outer[np] && !visited[np]) { visited[np] = 1; stack[sp++] = np; }
                }
                if (y + 1 < h) {
                  const np = p + w;
                  if (candidate[np] && !outer[np] && !visited[np]) { visited[np] = 1; stack[sp++] = np; }
                }
              }

              if (touchesEdge) continue;
              if (area < minHoleArea) continue;

              const boxW = maxX - minX + 1;
              const boxH = maxY - minY + 1;
              const fillRatio = area / (boxW * boxH);
              if (boxW / w < SETTINGS.holeMinWidthRatio) continue;
              if (boxH / h < SETTINGS.holeMinHeightRatio) continue;
              if (fillRatio < SETTINGS.holeMinFillRatio) continue;

              const meanR = sumR / area;
              const meanG = sumG / area;
              const meanB = sumB / area;
              const stdR = Math.sqrt(Math.max(0, (sumR2 / area) - meanR * meanR));
              const stdG = Math.sqrt(Math.max(0, (sumG2 / area) - meanG * meanG));
              const stdB = Math.sqrt(Math.max(0, (sumB2 / area) - meanB * meanB));
              const avgStd = (stdR + stdG + stdB) / 3;

              if (avgStd > SETTINGS.holeMaxStd) continue;

              for (const p of comp) {
                if (!finalMask[p]) {
                  finalMask[p] = 1;
                  maskedCount++;
                }
              }
              acceptedHoles++;
            }

            // 6) 指定色にそろえてから、その色を透過
            for (let p = 0, i = 0; p < total; p++, i += 4) {
              if (!finalMask[p]) continue;
              data[i] = TARGET.r;
              data[i + 1] = TARGET.g;
              data[i + 2] = TARGET.b;
              data[i + 3] = 0;
            }

            ctx.putImageData(src, 0, 0);
            const out = canvas.toDataURL('image/png').split(',')[1];
            resolve(JSON.stringify({
              ok: true,
              pngBase64: out,
              stats: {
                width: w,
                height: h,
                bg,
                maskedPixels: maskedCount,
                acceptedHoles,
              }
            }));
          } catch (err) {
            resolve(JSON.stringify({ ok: false, error: String(err) }));
          }
        };
        img.onerror = () => {
          resolve(JSON.stringify({ ok: false, error: '画像の読み込みに失敗しました' }));
        };
        img.src = 'data:image/png;base64,' + PNG_BASE64;
      });
    }

    run().then(completion);
  })();
  `

  const raw = await web.evaluateJavaScript(js, true)
  let result
  try {
    result = JSON.parse(raw)
  } catch (e) {
    throw new Error("JavaScriptの返り値を解析できませんでした")
  }

  if (!result || !result.ok || !result.pngBase64) {
    throw new Error(result && result.error ? result.error : "変換に失敗しました")
  }

  const outData = Data.fromBase64String(result.pngBase64)
  const fmOut = getFmForPath(outputFolder)
  const outPath = fmOut.joinPath(outputFolder, stripExt(name) + ".png")
  fmOut.write(outPath, outData)
  return { outPath, stats: result.stats || null }
}

async function main() {
  try {
    const targetColor = await askHexColor()
    const inputPaths = await pickInputFiles()
    const outputFolder = await pickOutputFolder()

    let success = 0
    const failed = []

    for (const inputPath of inputPaths) {
      const name = fileNameOf(inputPath)
      try {
        await processOneImage(inputPath, outputFolder, targetColor)
        success++
      } catch (e) {
        failed.push(`${name} : ${String(e)}`)
      }
    }

    const a = new Alert()
    a.title = "処理完了"
    a.message = [
      `成功: ${success}枚`,
      `失敗: ${failed.length}枚`,
      "",
      `指定色: ${targetColor.hex}`,
      "",
      `保存先:\n${outputFolder}`,
      failed.length ? "\n--- 失敗一覧 ---\n" + failed.join("\n") : "",
    ].join("\n")
    a.addAction("OK")
    await a.presentAlert()
  } catch (e) {
    const a = new Alert()
    a.title = "中止しました"
    a.message = String(e)
    a.addAction("OK")
    await a.presentAlert()
  }
}

await main()
